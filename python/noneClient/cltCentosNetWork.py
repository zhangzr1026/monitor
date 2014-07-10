############   NETWORK CARD    #############

import sys
import os
import re
import mCommon 
import mController
import mSysCmd

# Key List of ncSet:(ifconfig)

##################################################
#Insert record into table "info_networkcard"#
##################################################

def collectNcInfo(hostid):
    #Variables
    ncIdList = list()

    #find BY SSH
    ncSet = getNcDictOnSSH(hostid)

    #for nc on SSH
    for nc in ncSet: 
        nc['host_id'] = hostid
        nc['gmt_update']   = mCommon.getCurrentTime() 

        ncId = mController.replaceIntoNc(nc)
        ncIdList.append(ncId)
   
    #Delete expired DB date
    dbNcIdList = mController.getNcIdListByHost(hostid)
    
    difSet = set(dbNcIdList) - set(ncIdList) 
    for diffNcId in difSet:
        mController.deleteNc(diffNcId)


####################################################
#Insert record into table "info_filesystem_history"#
####################################################

def collectNcStatus(hostid):
    #find By SSH
    ncSet = getNcHistoryDictOnSSH(hostid)

    #for nc ON SSH
    for nc in ncSet:
        historyDict = dict()

        nc_id = mController.getNcIdByHostName(hostid, nc['name'])
        if nc_id == 0:
           collectNcInfo(hostid) 
        else:
            historyDict['real_time']= mCommon.getCurrentTime()
            historyDict['nc_id']    = nc_id
            historyDict['type']     = 'normal' 
            historyDict['rxpck']    = nc['rxpck'] 
            historyDict['txpck']    = nc['txpck'] 
            historyDict['rxkb']     = nc['rxkb'] 
            historyDict['txkb']     = nc['txkb'] 
            mController.insertNcHistory(historyDict) 
        


def getNcDictOnSSH(hostid):
    #Variables
    ncSet = list()

    #Select basic infomation from database
    host = mController.getHostByID(hostid)
    
    hostip  = host['host_ip']
    user    = host['dracuser']
    passwd  = host['dracpasswd']

    #get Network Card information 
    tempstr = mSysCmd.ssh_cmd(hostip, user, passwd, 'ifconfig')
    tempstr = tempstr.strip()
        
    # process txt into dict ! 
    SEARCH_PAT = re.compile(r'(\w+)\s+Link encap:(.+)\n(.+)\n')
    pat_search = SEARCH_PAT.findall(tempstr)
    for row in pat_search:
        ncrow = dict()

        ncrow['nc_name'] = row[0]

        SUBSEARCH_PAT = re.compile(r'HWaddr\s+(\w\w:\w\w:\w\w:\w\w:\w\w:\w\w)')
        subpat_search = SUBSEARCH_PAT.search(row[1])
        if subpat_search != None:
            subpatgroup = subpat_search.groups()
            ncrow['mac_addr'] = subpatgroup[0]

        SUBSEARCH_PAT = re.compile(r'inet addr:(\d+\.\d+\.\d+\.\d+)')
        subpat_search = SUBSEARCH_PAT.search(row[2])
        if subpat_search != None:
            subpatgroup = subpat_search.groups()
            ncrow['ip_addr'] = subpatgroup[0]
        
        ncSet.append(ncrow)

    return ncSet
       
def getNcHistoryDictOnSSH(hostid):
    #Variables
    htySet = list()

    #Select basic infomation from database
    host = mController.getHostByID(hostid)
    
    hostip  = host['host_ip']
    user    = host['dracuser']
    passwd  = host['dracpasswd']

    #get Network Card Current information 
    tempstr = mSysCmd.ssh_cmd(hostip, user, passwd, 'sar -n DEV 1 1')
    tempstr = tempstr.strip()
        
    # process txt into dict ! 
    SEARCH_PAT = re.compile(r'\sAverage:(.+)')
    pat_search = SEARCH_PAT.findall(tempstr)
    
    for row in pat_search:
        ncrow = dict()

        SUBSEARCH_PAT = re.compile(r'(\w+)\s+(\d+\.\d+)\s+(\d+\.\d+)\s+(\d+\.\d+)\s+(\d+\.\d+)')
        subpat_search = SUBSEARCH_PAT.search(row)
        if subpat_search != None:
            subpatgroup = subpat_search.groups()
            ncrow['name']  = subpatgroup[0]
            ncrow['rxpck'] = subpatgroup[1]
            ncrow['txpck'] = subpatgroup[2]
            ncrow['rxkb']  = subpatgroup[3]
            ncrow['txkb']  = subpatgroup[4]
            htySet.append(ncrow)

    return htySet
 



if __name__ == '__main__':
    collectNcStatus(1)
#    collectNcInfo(1)
#    print getNcDictOnSSH(1)
#    print getNcHistoryDictOnSSH(1)
