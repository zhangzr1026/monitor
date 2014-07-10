############   FILE SYSTEM    #############

import sys
import os
import re
import mCommon 
import mController
import mSysCmd

# Key List of fsSet:(df -P)
# Filesystem, 1024-blocks, Used, Available, Capacity, Mounted

############################################
#Insert record into table "info_filesystem"#
############################################

def collectFsInfo(hostid):
    #Variables
    fsIdList = list()

    #find BY SSH
    fsSet = getFsDictOnSSH(hostid)

    #for fs on SSH
    for fs in fsSet: 
        columns = dict()
        columns['host_id']      = hostid
        columns['fs_name']      = fs['Filesystem'] 
        columns['mounted_on']   = fs['Mounted']
        columns['total_size']   = mCommon.KBYTES2M(fs['1024-blocks'])
        columns['used_size']    = mCommon.KBYTES2M(fs['Used'])
        columns['space_used_percent'] = mCommon.getCapacityNum(fs['Capacity'])
        columns['gmt_update']   = mCommon.getCurrentTime() 

        fsId = mController.replaceIntoFS(columns)
        fsIdList.append(fsId)
   
    #Delete expired DB date
    dbFsIdList = mController.getFsIdListByHost(hostid)
    
    difSet = set(dbFsIdList) - set(fsIdList) 
    for diffFsId in difSet:
        mController.deleteFs(diffFsId)


####################################################
#Insert record into table "info_filesystem_history"#
####################################################

def collectFsStatus(hostid):
    #find By SSH
    fsSet = getFsDictOnSSH(hostid)

    #for fs ON SSH
    for fs in fsSet:
        infoDict    = dict()
        historyDict = dict()
        infoDict['host_id']      = hostid
        infoDict['fs_name']      = fs['Filesystem']
        infoDict['mounted_on']   = fs['Mounted']
        infoDict['total_size']   = mCommon.KBYTES2M(fs['1024-blocks'])
        infoDict['used_size']    = mCommon.KBYTES2M(fs['Used'])
        infoDict['space_used_percent'] = mCommon.getCapacityNum(fs['Capacity'])
        infoDict['gmt_update']   = mCommon.getCurrentTime()

        fs_id = mController.getFsIdByHostName(hostid, fs['Filesystem'])
        if fs_id == 0:
           collectFsInfo(hostid) 
        else:
            historyDict['real_time']    = mCommon.getCurrentTime()
            historyDict['fs_id']        = fs_id
            historyDict['type']         = 'normal' 
            historyDict['total_size']   = mCommon.KBYTES2M(fs['1024-blocks']) 
            historyDict['used_size']    = mCommon.KBYTES2M(fs['Used'])
            historyDict['space_used_percent'] = mCommon.getCapacityNum(fs['Capacity'])
            mController.insertFsHistory(historyDict) 
        


def getFsDictOnSSH(hostid):
    #Variables
    fsSet = list()

    #Select basic infomation from database
    host = mController.getHostByID(hostid)
    
#    hostid  = host['host_id']
    hostip  = host['host_ip']
    user    = host['dracuser']
    passwd  = host['dracpasswd']

    #get File System information 
    tempstr = mSysCmd.ssh_cmd(hostip, user, passwd, 'df -P')
    tempstr = tempstr.strip()
        
    # process txt table into dict ! 
    templist = tempstr.split('\n')
    keylist  = templist[0].split()
    for row in templist:
        if row == templist[0]:
            continue
        
        fsrow = dict()   

        rowlist = row.split()
        for col in rowlist:
            index = rowlist.index(col)
            key = keylist[index]
            fsrow[key] = col
        
        fsSet.append(fsrow)

    return fsSet
       




if __name__ == '__main__':
    collectFsStatus(2)
