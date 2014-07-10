import MySQLdb
import json

from DBUtils.PooledDB import PooledDB

#Defined Constant
DB_HOST     = '192.168.1.19'
DB_PORT     = 3306
DB_USER     = 'admin'
DB_PWD      = 'admin'
DB_SCHEMA   = 'monitor'
DB_CHARSET  = 'utf8'

#Global Variables
dbPool = PooledDB(creator=MySQLdb, mincached=4, maxcached=10, maxshared=0, maxconnections=20, blocking=False, maxusage=100, setsession=['SET AUTOCOMMIT = 1'],
        host=DB_HOST, port=DB_PORT, user=DB_USER, passwd=DB_PWD, db=DB_SCHEMA, charset=DB_CHARSET )

###################
# Base Operations #
###################
def dbInsert(table, columns):
    try:
        global dbPool
        coon = dbPool.connection()
        cur = coon.cursor()

        keys = ''
        values = ''

        for (key, val) in columns.items():
            print "key:" + key
            print type(val)
            print "val:" + val
            if keys != '':
                keys = keys + ','
                values = values + ','
            keys = keys + key
            values = values + val
        sqlStr = 'INSERT INTO ' + table + ' ( ' + keys + ' ) VALUES ( ' + values +  ' )'
        print sqlStr
        #cur.execute(sqlStr)

        cur.close()
        coon.close()
    except MySQLdb.Error as e:
        print "Mysql Error %d: %s" % (e.args[0], e.args[1])


#######################
# Advanced Operations #
#######################
def insertDiskHistory(columns):
    table = 'info_disk_history'
    dbInsert(table, columns)


