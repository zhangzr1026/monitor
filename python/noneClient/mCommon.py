import time

KBYTES = 1024
MBYTES = 1024 * 1024
GBYTES = 1024 * 1024 * 1024

# Get Time
def getCurrentTime():
    return time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())) 

# Get Integer Part from the Capacity
def getCapacityNum(capacityStr):
    tmpStr = capacityStr.replace('%','')
    return tmpStr

# Convert From Byte to Megabytes or Gigabytes
def BYTES2K(bytes):
    result = float(bytes) / KBYTES
    return ('%.2f'% result)

def BYTES2M(bytes):
    result = float(bytes) / MBYTES
    return ('%.2f'% result) 

def BYTES2G(bytes):
    result = float(bytes) / GBYTES
    return ('%.2f'% result)

def KBYTES2M(bytes):
    result = float(bytes) / KBYTES
    return ('%.2f'% result) 

def KBYTES2G(bytes):
    result = float(bytes) / MBYTES
    return ('%.2f'% result)

# Convert From SSH Command's "Text Table Format" to "Python Lict[Dict] Object"
def getLictDictFromText(txtstr):
    #Variables
    txtList = list()

    #get File System information 
    tempstr = txtstr.strip()
    
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
    
        txtList.append(fsrow)

    return txtList 


# Like "free" to Dict[][]
#             total       used       free     shared    buffers     cached
#             Mem:       1873328    1795720      77608          0     127532     105988
#             -/+ buffers/cache:    1562200     311128
#             Swap:      4128760     835688    3293072

def getDictDictFromText(txtstr):
    #Variables
    txtDict = dict()

    #get File System information 
    tempstr = txtstr.strip()
    
    # process txt table into dict ! 
    rowlist = tempstr.split('\n')
    keylist  = rowlist[0].split()
    for row in rowlist:
        if row == rowlist[0]:
            continue
    
        fsrow = dict()   

        collist = row.split()
        rowkey = collist[0].replace(':',"")
        for col in collist:
            if col == collist[0]:
                continue
            
            colindex = collist.index(col)
            #print col + ":" +  str(colindex) + ":" + keylist[colindex-1] 

            colkey = keylist[colindex-1]
            fsrow[colkey] = col 
    
        txtDict[rowkey] = fsrow

    return txtDict 
