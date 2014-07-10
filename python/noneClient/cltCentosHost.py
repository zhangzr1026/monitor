import sys
import os
import re
import mCommon 
import mController
import mSysCmd
import datetime,time

######################################
#Insert record into table "info_host"#
######################################
def collectHostInfo(hostid):
    #Variables
    cHost = dict()

    #Select basic infomation from database
    host = mController.getHostByID(hostid)
    
#    hostid  = host['host_id']
    hostip  = host['host_ip']
    user    = host['dracuser']
    passwd  = host['dracpasswd']

    collectTime = mCommon.getCurrentTime()

    #get Host Name
#    tempstr =  mSysCmd.ssh_cmd(hostip, user, passwd, 'hostname')
#    hostname = tempstr.strip()
#    cHost['host_name'] = hostname

    #get Last Hours
    tempstr = mSysCmd.ssh_cmd(hostip, user, passwd, 'cat /proc/uptime')
    tempstr = tempstr.strip()

    SEARCH_PAT = re.compile(r'\d+')
    pat_search = SEARCH_PAT.search(tempstr)

    if pat_search is None:
        lasthours = 0
    else:
        lasthours = pat_search.group(0)
        cHost['last_hours'] = lasthours

    #get Host Name and Opeartion System Kernel
    tempstr = mSysCmd.ssh_cmd(hostip, user, passwd, 'uname -a')
    tempstr = tempstr.strip()
     
    templist = tempstr.split()
    cHost['host_name']      = templist[1]
    cHost['kernel']         = templist[2]

    #get Distribute ID
    tempstr = mSysCmd.ssh_cmd(hostip, user, passwd, 'cat /etc/issue')

    templist = tempstr.split('\n')
    cHost['distribute_id']  = templist[1]

    #get Memory Infomation
    tempstr = mSysCmd.ssh_cmd(hostip, user, passwd, 'free') 
   
    tempDict = mCommon.getDictDictFromText(tempstr)
    cHost['physical_mem']   = mCommon.KBYTES2M(tempDict['Mem']['total'])
    cHost['swap_size']      = mCommon.KBYTES2M(tempDict['Swap']['total'])

    #get cpu Information
    # Pyhsical Num: cat /proc/cpuinfo |grep "physical id"|sort |uniq|wc -l
    # Logic Num:    cat /proc/cpuinfo |grep "processor"|wc -l
    # Cores:        cat /proc/cpuinfo |grep "cores"|uniq
    # MHz:          cat /proc/cpuinfo |grep MHz|uniq
    # Model:        cat /proc/cpuinfo | grep name | cut -f2 -d: | uniq -c
    tempstr = mSysCmd.ssh_cmd(hostip, user, passwd, 'cat /proc/cpuinfo | grep name | uniq | cut -d: -f 2')
    cHost['cpu_model_name'] = tempstr.strip()
    tempstr = mSysCmd.ssh_cmd(hostip, user, passwd, 'cat /proc/cpuinfo | grep MHz | uniq | cut -d : -f 2')
    tempstr = tempstr.strip()
    templist = tempstr.split()
    tempfloat = float(templist[0])/1000
    cHost['cpu_ghz'] = ('%.2f'% tempfloat)
    tempstr = mSysCmd.ssh_cmd(hostip, user, passwd, 'cat /proc/cpuinfo |grep "processor"|wc -l')
    cHost['cpu_num']        = tempstr.strip()

    #get Other Info
    cHost['os_type']    = 'linux'
    cHost['gmt_update'] = collectTime
    cHost['status']     = 'online' 
    if host['status'] == 'offline':            #if the status changed ,mark the online time
        cHost['online_time'] = collectTime 

    #Update Host Infomation
    mController.updateHostInfo(hostid, cHost) 

   

#############################################
# Insert record to table "info_host_history"#
#############################################
def collectHostStatus(hostid):
    #Variables
    cHistory = dict()

    #Select basic infomation from database
    host = mController.getHostByID(hostid)
    
#   hostid  = host['host_id']
    hostip  = host['host_ip']
    user    = host['dracuser']
    passwd  = host['dracpasswd']

    collectTime = mCommon.getCurrentTime()

    #get Memory Infomation
    tempstr = mSysCmd.ssh_cmd(hostip, user, passwd, 'free') 
   
    tempDict = mCommon.getDictDictFromText(tempstr)
    cHistory['mem_used']    = mCommon.KBYTES2M(tempDict['Mem']['used']) 
    cHistory['mem_free']    = mCommon.KBYTES2M(tempDict['Mem']['free'])
    cHistory['mem_buffers'] = mCommon.KBYTES2M(tempDict['Mem']['buffers']) 
    cHistory['mem_cached']  = mCommon.KBYTES2M(tempDict['Mem']['cached'])
    cHistory['swap_used']   = mCommon.KBYTES2M(tempDict['Mem']['used'])
    cHistory['swap_free']   = mCommon.KBYTES2M(tempDict['Mem']['free'])

    #get cpu Information
    # Problem1: TERM environment variable not set.
    # Slove:    add "export TERM=linux;" before 'top'
    # Problem2: top: failed tty get
    # Slove:    top -b
    # Problem3: Top Initail display is always in the same value
    # Slove:    top -bi -n 2 -d 0.02
    #tempstr = mSysCmd.ssh_cmd(hostip, user, passwd, '/usr/bin/top -n 1 | head -n 5')
    tempstr = mSysCmd.ssh_cmd(hostip, user, passwd, 'export TERM=linux; /usr/bin/top -bi -n 2 -d 0.02')
    tempstr = tempstr.split('\r\n\r\n\r\n')[1]
    tempstr.strip()
    templist = tempstr.split('\n')
    tempload = templist[0]
    tempcpu  = templist[2]

    SEARCH_PAT = re.compile(r'load average: (\d+.\d+), (\d+.\d+), (\d+.\d+)')
    pat_search = SEARCH_PAT.search(tempload).groups()
    if pat_search != None:
        load1 = pat_search[0]
        load5= pat_search[1]
        load15 = pat_search[2]
        cHistory['load_average']= load1 

    SEARCH_PAT = re.compile(r'(\d+.\d+)%us')
    pat_search = SEARCH_PAT.search(tempcpu)
    if pat_search != None:
        patgroup = pat_search.groups()
        cHistory['cpu_user'] = patgroup[0]

    SEARCH_PAT = re.compile(r'(\d+.\d+)%sy')
    pat_search = SEARCH_PAT.search(tempcpu)
    if pat_search != None:
        patgroup = pat_search.groups()
        cHistory['cpu_sys'] = patgroup[0]

    SEARCH_PAT = re.compile(r'(\d+.\d+)%ni')
    pat_search = SEARCH_PAT.search(tempcpu)
    if pat_search != None:
        patgroup = pat_search.groups()
        cHistory['cpu_nice'] = patgroup[0]

    SEARCH_PAT = re.compile(r'(\d+.\d+)%id')
    pat_search = SEARCH_PAT.search(tempcpu)
    if pat_search != None:
        patgroup = pat_search.groups()
        cHistory['cpu_idle'] = patgroup[0]

    SEARCH_PAT = re.compile(r'(\d+.\d+)%wa')
    pat_search = SEARCH_PAT.search(tempcpu)
    if pat_search != None:
        patgroup = pat_search.groups()
        cHistory['cpu_iowait'] = patgroup[0]

    #Insert Host History Information
    cHistory['real_time']   = collectTime
    cHistory['host_id']     = hostid
    cHistory['type']        = 'normal'
    mController.insertHostHistory(cHistory)


   

    

if __name__ == '__main__':
    PASS
#    collectHostInfo(2)
#    collectHostStatus(2)
#    collectAvgData(1,"day")
