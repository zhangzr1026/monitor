import time,datetime
import mController
import mSysCmd


def CentosCollector(hostid):
    import cltCentosHost
    import cltCentosFileSystem
    import cltCentosNetWork
    import cltCentosDisk
   
    cltCentosHost.collectHostInfo(hostid)
    cltCentosHost.collectHostStatus(hostid)
    cltCentosFileSystem.collectFsStatus(hostid)
    cltCentosNetWork.collectNcStatus(hostid)
    cltCentosDisk.collectDiskStatus(hostid)


def AvgDataCollector(hostid):
    import cltCentosAvgData

    cltCentosAvgData.collectAvgData(hostid,"day")
    cltCentosAvgData.collectAvgData(hostid,"week")
    cltCentosAvgData.collectAvgData(hostid,"month")

if __name__ == '__main__':
    #myTimer
    myTimer = list()
    myTimer.append({"name":"start","time":datetime.datetime.now()})

    hostList = mController.getHostList()
    for host in hostList:
        hostid  = host['host_id']
        user    = host['dracuser']
        pwd     = host['dracpasswd']
        ipAddr  = host['host_ip'];

        checkOnline = mSysCmd.checkPing(ipAddr)
        myTimer.append({"name":"checkOnline","time":datetime.datetime.now()})

        if checkOnline:    
            if host!= '' and user!= '' and pwd!= '':
                CentosCollector(hostid)
                AvgDataCollector(hostid)
                myTimer.append({"name":"collector","time":datetime.datetime.now()})

        else:
            column = dict() 
            column['status'] = 'offline'
            mController.updateHostInfo(hostid,column);
            myTimer.append({"name":"setOffLine","time":datetime.datetime.now()})
            continue
    
    myTimer.append({"name":"end","time":datetime.datetime.now()})

    b = False  
    for r in myTimer:
        if b:
            print (r['time']- b['time']).seconds
        print r
        b = r

