import sys
import os
import re
import mCommon 
import mController
import mSysCmd
import datetime,time


def avgHost(records):
    avg = {'load_average':0} 

    for obj in records: 
        avg['load_average'] = avg['load_average'] + obj['load_average']
        avg['cpu_user'] = avg['cpu_user'] + obj['cpu_user']
        avg['cpu_sys'] = avg['cpu_sys'] + obj['cpu_sys']
        avg['cpu_nice'] = avg['cpu_nice'] + obj['cpu_nice']
        avg['cpu_idle'] = avg['cpu_idle'] + obj['cpu_idle']
        avg['cpu_iowait'] = avg['cpu_iowait'] + obj['cpu_iowait']
        avg['mem_used'] = avg['mem_used'] + obj['mem_used']
        avg['mem_free'] = avg['mem_free'] + obj['mem_free']
        avg['mem_buffers'] = avg['mem_buffers'] + obj['mem_buffers']
        avg['mem_cached'] = avg['mem_cached'] + obj['mem_cached']
        avg['swap_used'] = avg['swap_used'] + obj['swap_used']
        avg['swap_free'] = avg['swap_free'] + obj['swap_free']

    for (key,val) in avg.items():
        accu = val/len(records)
        avg[key] = ('%.2f'% accu)

    return avg

def avgDisk(records):
    avg = { 'tps':0, 'rsec':0, 'wsec':0, 'avgrq_sz':0, 'avgqu_sz':0, 'await':0, 'svctm':0, 'util':0 } 

    for obj in records: 
        avg['tps'] = avg['tps'] + obj['tps']
        avg['rsec'] = avg['rsec'] + obj['rsec']
        avg['wsec'] = avg['wsec'] + obj['wsec']
        avg['avgrq_sz'] = avg['avgrq_sz'] + obj['avgrq_sz']
        avg['avgqu_sz'] = avg['avgqu_sz'] + obj['avgqu_sz']
        avg['await'] = avg['await'] + obj['await']
        avg['svctm'] = avg['svctm'] + obj['svctm']
        avg['util'] = avg['util'] + obj['util']

    for (key,val) in avg.items():
        accu = val/len(records)
        avg[key] = ('%.2f'% accu)

    return avg

def avgFs(records):
    avg = { 'total_size':0, 'used_size':0, 'space_used_percent':0 } 

    for obj in records: 
        avg['total_size'] = avg['total_size'] + obj['total_size']
        avg['used_size'] = avg['used_size'] + obj['used_size']
        avg['space_used_percent'] = avg['space_used_percent'] + obj['space_used_percent']

    for (key,val) in avg.items():
        accu = val/len(records)
        avg[key] = ('%.2f'% accu)

    return avg

def avgNc(records):
    avg = { 'rxpck':0, 'txpck':0, 'rxkb':0, 'txkb':0 } 

    for obj in records: 
        avg['rxpck'] = avg['rxpck'] + obj['rxpck']
        avg['txpck'] = avg['txpck'] + obj['txpck']
        avg['rxkb'] = avg['rxkb'] + obj['rxkb']
        avg['txkb'] = avg['txkb'] + obj['txkb']

    for (key,val) in avg.items():
        accu = val/len(records)
        avg[key] = ('%.2f'% accu)

    return avg

def collectAvgData(hostId, cltType):
    realtime = (datetime.datetime.now() - datetime.timedelta(days=1)).strftime('%Y-%m-%d 23:59:59')
    if cltType == 'day':
        selectType  = 'normal'
        starttime   = datetime.datetime.now() - datetime.timedelta(days=1)
        start       = starttime.strftime('%Y-%m-%d 00:00:00')
        end         = datetime.datetime.now().strftime('%Y-%m-%d 00:00:00')

    elif cltType == 'week':
        selectType = 'day'
        starttime = datetime.datetime.now() - datetime.timedelta(days=7)
        start = starttime.strftime('%Y-%m-%d 00:00:00')
        end   = datetime.datetime.now().strftime('%Y-%m-%d 00:00:00')

    elif cltType == 'month':
        selectType = 'day'
        starttime = datetime.datetime.now() - datetime.timedelta(days=30)
        start = starttime.strftime('%Y-%m-%d 00:00:00')
        end   = datetime.datetime.now().strftime('%Y-%m-%d 00:00:00')

    elif cltType == 'year':
        selectType = 'week'
        starttime = datetime.datetime.now() - datetime.timedelta(days=365)
        start = starttime.strftime('%Y-%m-%d 00:00:00')
        end   = datetime.datetime.now().strftime('%Y-%m-%d 00:00:00')

    else:
        return

    #Host
    exist = mController.getHostHistory(hostId, cltType, start, end, 1);

    if exist is None:
        normal = mController.getHostHistory(hostId, selectType, start, end, 0);
        avg = avgHost(normal)
        avg['type'] = cltType
        avg['host_id'] = hostId 
        avg['real_time'] = realtime 
        mController.insertHostHistory(avg);

    #Disk
    disklist = mController.getDiskIdListByHost(hostId)
    for id in disklist:
        exist = mController.getDiskHistory(id, cltType, start, end, 1);

        if exist is None:
            normal = mController.getDiskHistory(id, selectType, start, end, 0);
            avg = avgDisk(normal)
            avg['type'] = cltType
            avg['disk_id'] = id 
            avg['real_time'] = realtime 
            mController.insertDiskHistory(avg);

    #File System
    fslist = mController.getFsIdListByHost(hostId)
    for id in fslist:
        exist = mController.getFsHistory(id, cltType, start, end, 1);

        if exist is None:
            normal = mController.getFsHistory(id, selectType, start, end, 0);
            avg = avgFs(normal)
            avg['type'] = cltType
            avg['fs_id'] = id 
            avg['real_time'] = realtime 
            mController.insertFsHistory(avg);

    #Network Card
    nclist = mController.getNcIdListByHost(hostId)
    for id in nclist:
        exist = mController.getNcHistory(id, cltType, start, end, 1);

        if exist is None:
            normal = mController.getNcHistory(id, selectType, start, end, 0);
            avg = avgNc(normal)
            avg['type'] = cltType
            avg['nc_id'] = id 
            avg['real_time'] = realtime 
            mController.insertNcHistory(avg);


if __name__ == '__main__':
    collectAvgData(1,"day")
    collectAvgData(1,"week")
    collectAvgData(1,"month")
    collectAvgData(1,"year")
