############   Disk    #############

import sys
import os
import re
import mCommon 
import mController
import mSysCmd

# fdisk -l
# sar -d -p 1 1
# iostat -x 1 2
# cat /proc/partitions

######################################
#Insert record into table "info_disk"#
######################################

def collectDiskInfo(hostid):
    #Variables
    diskIdList = list()

    #find BY SSH
    diskSet = getDiskDictOnSSH(hostid)

    #for disk on SSH
    for disk in diskSet: 
        disk['host_id'] = hostid
        disk['gmt_update']   = mCommon.getCurrentTime() 

        diskId = mController.replaceIntoDisk(disk)
        diskIdList.append(diskId)
   
    #Delete expired DB date
    dbDiskIdList = mController.getDiskIdListByHost(hostid)
    
    difSet = set(dbDiskIdList) - set(diskIdList) 
    for diffDiskId in difSet:
        mController.deleteDisk(diffDiskId)


##############################################
#Insert record into table "info_disk_history"#
##############################################

def collectDiskStatus(hostid):
    #find By SSH
    diskSet = getDiskHistoryDictOnSSH(hostid)

    #for disk ON SSH
    for disk in diskSet:
        historyDict = dict()

        disk_id = mController.getDiskIdByHostName(hostid, disk['disk_name'])
        if disk_id == 0:
           collectDiskInfo(hostid) 
        else:
            historyDict['real_time']= mCommon.getCurrentTime()
            historyDict['disk_id']  = disk_id
            historyDict['type']     = 'normal' 
            historyDict['tps']      = disk['tps'] 
            historyDict['rsec']     = disk['rsec'] 
            historyDict['wsec']     = disk['wsec'] 
            historyDict['avgrq_sz'] = disk['avgrq_sz'] 
            historyDict['avgqu_sz'] = disk['avgqu_sz'] 
            historyDict['await']    = disk['await'] 
            historyDict['svctm']    = disk['svctm'] 
            historyDict['util']     = disk['util'] 
            mController.insertDiskHistory(historyDict) 
        


def getDiskDictOnSSH(hostid):
    #Variables
    diskSet = list()

    #Select basic infomation from database
    host = mController.getHostByID(hostid)
    
    hostip  = host['host_ip']
    user    = host['dracuser']
    passwd  = host['dracpasswd']

    #get Network Card information 
    tempstr = mSysCmd.ssh_cmd(hostip, user, passwd, 'fdisk -l')
    tempstr = tempstr.strip()
        
    # process txt into dict ! 
    SEARCH_PAT = re.compile(r'Disk\s+/dev/(\wd\w):.+,\s(\d+)\s+bytes\s+.+\s+.+\s+.+/\s+(\d+)\s+bytes')
    pat_search = SEARCH_PAT.findall(tempstr)
    for row in pat_search:
        diskrow = dict()
        diskrow['disk_name']    = row[0]
        diskrow['disk_capacity']= mCommon.BYTES2M(row[1])
        diskrow['sector_size'] = row[2]
        diskSet.append(diskrow)
    return diskSet
       
def getDiskHistoryDictOnSSH(hostid):
    #Variables
    diskSet = list()

    #Select basic infomation from database
    host = mController.getHostByID(hostid)
    
    hostip  = host['host_ip']
    user    = host['dracuser']
    passwd  = host['dracpasswd']

    #get Network Card Current information 
    tempstr = mSysCmd.ssh_cmd(hostip, user, passwd, 'sar -d -p 1 1')
    tempstr = tempstr.strip()
        
    # process txt into dict ! 
    SEARCH_PAT = re.compile(r'\s(Average:.+)')
    pat_search = SEARCH_PAT.findall(tempstr)
    
    for row in pat_search:
        diskrow = dict()
        SUBSEARCH_PAT = re.compile(r'Average:\s+(\wd\w)\s+(\d+\.\d+)\s+(\d+\.\d+)\s+(\d+\.\d+)\s+(\d+\.\d+)\s+(\d+\.\d+)\s+(\d+\.\d+)\s+(\d+\.\d+)\s+(\d+\.\d+)')
        subpat_search = SUBSEARCH_PAT.search(row)
        if subpat_search != None:
            subpatgroup = subpat_search.groups()
            diskrow['disk_name']= subpatgroup[0]
            diskrow['tps']      = subpatgroup[1]
            diskrow['rsec']     = subpatgroup[2]
            diskrow['wsec']     = subpatgroup[3]
            diskrow['avgrq_sz'] = subpatgroup[4]
            diskrow['avgqu_sz'] = subpatgroup[5]
            diskrow['await']    = subpatgroup[6]
            diskrow['svctm']    = subpatgroup[7]
            diskrow['util']     = subpatgroup[8]
            diskSet.append(diskrow)

    return diskSet
 


if __name__ == '__main__':
    collectDiskStatus(1)
#    collectDiskInfo(1)
#    getNcDictOnSSH(2)
#     getDiskHistoryDictOnSSH(1)
