import MySQLdb
import MySQLdb.cursors
import json

from DBUtils.PooledDB import PooledDB

#Defined Constant
DB_HOST     = '192.168.1.19'
DB_PORT     = 3306
DB_USER     = 'admin'
DB_PWD      = 'admin'
DB_SCHEMA   = 'monitor'
DB_CHARSET  = 'utf8'

TABLE_HOST_INFO     = 'info_host'
TABLE_HOST_HISTORY  = 'info_host_history'
TABLE_FS_INFO       = 'info_filesystem'
TABLE_FS_HISTORY    = 'info_filesystem_history'
TABLE_NC_INFO       = 'info_networkcard'
TABLE_NC_HISTORY    = 'info_networkcard_history'
TABLE_DISK_INFO     = 'info_disk'
TABLE_DISK_HISTORY  = 'info_disk_history'


#Global Variables
dbPool = PooledDB(creator=MySQLdb, mincached=4, maxcached=10, maxshared=0, maxconnections=20, blocking=False, maxusage=100, setsession=['SET AUTOCOMMIT = 1'],
        host=DB_HOST, port=DB_PORT, user=DB_USER, passwd=DB_PWD, db=DB_SCHEMA, charset=DB_CHARSET, cursorclass = MySQLdb.cursors.DictCursor )

###################
# Base Operations #
###################
def dbInsert(table, columns): #arges: table[string], columns[dict]
    insertId = 0
    try:
        global dbPool
        coon = dbPool.connection()
        cur = coon.cursor()

        keys = ''
        values = ''

        for (key, val) in columns.items():
#            print type(val)
            tmpval = str(val) 

            if keys != '':
                keys = keys + ','
                values = values + ','
            keys = keys + key
            values = values + "'" + tmpval + "'"
        sqlstr = "insert into " + table + " ( " + keys + " ) values ( " + values + "  )"
        #print sqlstr
        cur.execute(sqlstr)
#        print sqlstr
#        insertId = coon.insert_id()
        insertId = cur.lastrowid
        cur.close()
        coon.close()
    except MySQLdb.Error as e:
        print "mysql error %d: %s" % (e.args[0], e.args[1])
    return insertId

def dbReplaceInto(table, columns): #arges: table[string], columns[dict]
    try:
        global dbPool
        coon = dbPool.connection()
        cur = coon.cursor()

        keys = ''
        values = ''

        for (key, val) in columns.items():
            tmpval = str(val) 
            if keys != '':
                keys = keys + ','
                values = values + ','
            keys = keys + key
            values = values + "'" + tmpval + "'"
        sqlstr = "replace into " + table + " ( " + keys + " ) values ( " + values + "  )"
        print sqlstr
        #cur.execute(sqlstr)

        cur.close()
        coon.close()
    except MySQLdb.Error as e:
        print "mysql error %d: %s" % (e.args[0], e.args[1])

def dbDelete(sqlStr):
    try:
        global dbPool
        coon = dbPool.connection()
        cur = coon.cursor()
        cur.execute(sqlStr)
        cur.close()
        coon.close()
    except MySQLdb.Error as e:
        print "Mysql Error %d: %s" % (e.args[0], e.args[1])


def dbUpdate(table, columns, whereStr ):
    try:
        global dbPool
        coon = dbPool.connection()
        cur = coon.cursor()

        sets = ''

        for (key, val) in columns.items():
            tmpval = str(val) 
            if sets != '':
                sets = sets + ','
            sets = sets + key + "='" + tmpval + "'" 
        sqlstr = "UPDATE " + table + " SET " + sets  + whereStr
        cur.execute(sqlstr)

        cur.close()
        coon.close()
    except MySQLdb.Error as e:
        print "mysql error %d: %s" % (e.args[0], e.args[1])



def dbUpdateByQuery(sqlStr):
    try:
        global dbPool
        coon = dbPool.connection()
        cur = coon.cursor()
        cur.execute(sqlStr)
        cur.close()
        coon.close()
    except MySQLdb.Error as e:
        print "Mysql Error %d: %s" % (e.args[0], e.args[1])


def dbSelect(table, columnsName, where):
    result = None
    try:
        global dbPool
        coon = dbPool.connection()
        cur = coon.cursor()
        cur.execute(sqlStr)
        result = cur.fetchall()
        if len(result) == 0:
           result = None
        cur.close()
        coon.close()
    except MySQLdb.Error as e:
        print "Mysql Error %d: %s" % (e.args[0], e.args[1])
    return result

def dbSelectByQuery(sqlStr):
    result = None
    try:
        global dbPool
        coon = dbPool.connection()
        cur = coon.cursor()
        cur.execute(sqlStr)
        result = cur.fetchall()
        if len(result) == 0:
            result = None
        cur.close()
        coon.close()
    except MySQLdb.Error as e:
        print "Mysql Error %d: %s" % (e.args[0], e.args[1])
    return result

def dbQuery(sqlStr):
    result = None
    try:
        global dbPool
        coon = dbPool.connection()
        cur = coon.cursor()
        cur.execute(sqlStr)
        result = cur.fetchall()
        if len(result) == 0:
           result = None
        cur.close()
        coon.close()
    except MySQLdb.Error as e:
        print "Mysql Error %d: %s" % (e.args[0], e.args[1])
    return result


       


#######################
# Advanced Operations #
#######################

##### Host #####
#   return HOST dict 
def getHostByIP(hostIp): 
    sqlStr = "SELECT * FROM "+ TABLE_HOST_INFO+ " WHERE host_ip='" + hostIp + "'"
    result = dbSelectByQuery(sqlStr)
    if result is None:
        return None
    else:
        return result[0]

def getHostByID(hostId): 
    sqlStr = "SELECT * FROM "+ TABLE_HOST_INFO+ " WHERE host_id=" + str(hostId)
    result = dbSelectByQuery(sqlStr)
    if result is None:
        return None
    else:
        return result[0]

def getHostHistory(hostId, type, start, end, limit): 
    strlimit = ''
    if limit > 0:
        strlimit = ' LIMIT ' + str(limit)
    sqlStr = "SELECT * FROM "+ TABLE_HOST_HISTORY+ " WHERE host_id=" + str(hostId) + " AND type='" + type + "' AND real_time>='" + start + "' AND real_time<'" + end + "'" + strlimit
    result = dbSelectByQuery(sqlStr)
    if result is None:
        return None
    elif limit == 1:
        return result[0]
    else:
        return result

def getHostList():
    sqlStr = "SELECT * FROM " + TABLE_HOST_INFO
    result = dbSelectByQuery(sqlStr)
    if result is None:
        return None
    else:
        return result 

def getHostIdList():
    hostIdList = list()
    sqlStr = "SELECT host_id FROM " + TABLE_HOST_INFO
    result = dbSelectByQuery(sqlStr)
    if result is None:
        return None
    else:
        for val in result:
            hostIdList.append(val['host_id'])
        return hostIdList 

def updateHostInfo(hostId, columns):
    sets = ''
    for (key, val) in columns.items():
        if sets != '':
            sets = sets + ','
        sets = sets + key + "='" + str(val) + "'"
    
    sqlStr = "UPDATE "+ TABLE_HOST_INFO+  " set "  + sets + " where host_id='" + str(hostId) + "'"
    dbUpdateByQuery(sqlStr) 

def insertHostHistory(columns):
    dbInsert(TABLE_HOST_HISTORY, columns)


##### File System #####
def replaceIntoFS(columns):
    #variables
    fs_id = 0

    #check exists
    whereStr = " WHERE host_id=" + str(columns['host_id']) +" AND fs_name='" + columns['fs_name']  + "'"
    checkSql = "SELECT * FROM " + TABLE_FS_INFO + whereStr 
    list = dbSelectByQuery(checkSql)    
    if list is None:
        fs_id = dbInsert(TABLE_FS_INFO, columns)
    else:
        dbUpdate(TABLE_FS_INFO, columns, whereStr)
        fs_id = list[0]['fs_id']

    #return
    return fs_id

def deleteFs(fsId):
    sqlStr = "DELETE FROM " + TABLE_FS_INFO + " WHERE fs_id=" + str(fsId)
    dbDelete(sqlStr)

def getFsIdByHostName(hostId, fsName):
    result = getFsByHostName(hostId, fsName)
    if result is None:
        return 0
    else:
        return result[0]['fs_id']

def getFsByHostName(hostId, fsName):
    sqlStr = "SELECT * FROM " + TABLE_FS_INFO + " WHERE host_id=" + str(hostId) + " AND fs_name='" + fsName + "'"
    result = dbSelectByQuery(sqlStr)
    if result is None:
        return None
    else:
        return result

def getFsListByHost(hostId):
    sqlStr = "SELECT * FROM " + TABLE_FS_INFO + " WHERE host_id=" + str(hostId) 
    result = dbSelectByQuery(sqlStr)
    if result is None:
        return None
    else:
        return result

def getFsIdListByHost(hostId):
    fsIdList = list()
    sqlStr = "SELECT fs_id FROM " + TABLE_FS_INFO + " WHERE host_id=" + str(hostId) 
    result = dbSelectByQuery(sqlStr)
    if result is None:
        return None
    else:
        for val in result:
            fsIdList.append(val['fs_id'])
        return fsIdList 

def getFsHistory(fsId, type, start, end, limit): 
    strlimit = ''
    if limit > 0:
        strlimit = ' LIMIT ' + str(limit)
    sqlStr = "SELECT * FROM "+ TABLE_FS_HISTORY+ " WHERE fs_id=" + str(fsId) + " AND type='" + type + "' AND real_time>='" + start + "' AND real_time<'" + end + "'" + strlimit
    result = dbSelectByQuery(sqlStr)
    if result is None:
        return None
    elif limit == 1:
        return result[0]
    else:
        return result

################

def insertFsHistory(columns):
    dbInsert(TABLE_FS_HISTORY, columns)


##### NetWork Infomation #####
def replaceIntoNc(columns):
    #variables
    nc_id = 0

    #check exists
    whereStr = " WHERE host_id=" + str(columns['host_id']) +" AND nc_name='" + columns['nc_name']  + "'"
    checkSql = "SELECT * FROM " + TABLE_NC_INFO + whereStr 
    list = dbSelectByQuery(checkSql)    
    if list is None:
        nc_id = dbInsert(TABLE_NC_INFO, columns)
    else:
        dbUpdate(TABLE_NC_INFO, columns, whereStr)
        nc_id = list[0]['nc_id']

    #return
    return nc_id

def deleteNc(ncId):
    sqlStr = "DELETE FROM " + TABLE_NC_INFO + " WHERE nc_id=" + str(ncId)
    dbDelete(sqlStr)

def getNcIdByHostName(hostId, ncName):
    result = getNcByHostName(hostId, ncName)
    if result is None:
        return 0
    else:
        return result[0]['nc_id']

def getNcByHostName(hostId, ncName):
    sqlStr = "SELECT * FROM " + TABLE_NC_INFO + " WHERE host_id=" + str(hostId) + " AND nc_name='" + ncName + "'"
    result = dbSelectByQuery(sqlStr)
    if result is None:
        return None
    else:
        return result

def getNcListByHost(hostId):
    sqlStr = "SELECT * FROM " + TABLE_NC_INFO + " WHERE host_id=" + str(hostId) 
    result = dbSelectByQuery(sqlStr)
    if result is None:
        return None
    else:
        return result

def getNcIdListByHost(hostId):
    ncIdList = list()
    sqlStr = "SELECT nc_id FROM " + TABLE_NC_INFO + " WHERE host_id=" + str(hostId) 
    result = dbSelectByQuery(sqlStr)
    if result is None:
        return None
    else:
        for val in result:
            ncIdList.append(val['nc_id'])
        return ncIdList 

def getNcHistory(ncId, type, start, end, limit): 
    strlimit = ''
    if limit > 0:
        strlimit = ' LIMIT ' + str(limit)
    sqlStr = "SELECT * FROM "+ TABLE_NC_HISTORY+ " WHERE nc_id=" + str(ncId) + " AND type='" + type + "' AND real_time>='" + start + "' AND real_time<'" + end + "'" + strlimit
    result = dbSelectByQuery(sqlStr)
    if result is None:
        return None
    elif limit == 1:
        return result[0]
    else:
        return result


#################################
def insertNcHistory(columns):
    dbInsert(TABLE_NC_HISTORY, columns)


##### Disk Infomation #####
def replaceIntoDisk(columns):
    #variables
    disk_id = 0

    #check exists
    whereStr = " WHERE host_id=" + str(columns['host_id']) +" AND disk_name='" + columns['disk_name']  + "'"
    checkSql = "SELECT * FROM " + TABLE_DISK_INFO + whereStr 
    list = dbSelectByQuery(checkSql)    
    if list is None:
        disk_id = dbInsert(TABLE_DISK_INFO, columns)
    else:
        dbUpdate(TABLE_DISK_INFO, columns, whereStr)
        disk_id = list[0]['disk_id']

    #return
    return disk_id

def deleteDisk(diskId):
    sqlStr = "DELETE FROM " + TABLE_DISK_INFO + " WHERE disk_id=" + str(diskId)
    dbDelete(sqlStr)

def getDiskIdByHostName(hostId, diskName):
    result = getDiskByHostName(hostId, diskName)
    if result is None:
        return 0
    else:
        return result[0]['disk_id']

def getDiskByHostName(hostId, diskName):
    sqlStr = "SELECT * FROM " + TABLE_DISK_INFO + " WHERE host_id=" + str(hostId) + " AND disk_name='" + diskName + "'"
    result = dbSelectByQuery(sqlStr)
    if result is None:
        return None
    else:
        return result

def getDiskListByHost(hostId):
    sqlStr = "SELECT * FROM " + TABLE_DISK_INFO + " WHERE host_id=" + str(hostId) 
    result = dbSelectByQuery(sqlStr)
    if result is None:
        return None
    else:
        return result

def getDiskIdListByHost(hostId):
    diskIdList = list()
    sqlStr = "SELECT disk_id FROM " + TABLE_DISK_INFO + " WHERE host_id=" + str(hostId) 
    result = dbSelectByQuery(sqlStr)
    if result is None:
        return None
    else:
        for val in result:
            diskIdList.append(val['disk_id'])
        return diskIdList 

def getDiskHistory(diskId, type, start, end, limit): 
    strlimit = ''
    if limit > 0:
        strlimit = ' LIMIT ' + str(limit)
    sqlStr = "SELECT * FROM "+ TABLE_DISK_HISTORY+ " WHERE disk_id=" + str(diskId) + " AND type='" + type + "' AND real_time>='" + start + "' AND real_time<'" + end + "'" + strlimit
    result = dbSelectByQuery(sqlStr)
    if result is None:
        return None
    elif limit == 1:
        return result[0]
    else:
        return result

################

def insertDiskHistory(columns):
    dbInsert(TABLE_DISK_HISTORY, columns)

