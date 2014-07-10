import  json
import controller

hostStr = '''
{
    "obj" : "HOST",
    "properties" : ["hostname", "last_hours"]
}
    '''

def processReceivedStr(receivedStr):
    #print receivedStr
    jsonObj = json.loads(receivedStr);
    print jsonObj["hostname"] 
        
    columns = dict() 
    for (key, val) in jsonObj.items():
        print "key:" + key 
        print type(val)
        print "val:" + json.dumps(val)
        columns[key] = json.dumps(val) 
    controller.insertDiskHistory(columns)
    return True 


if __name__ == '__main__':
    import time
    import socket

    requestStr = '''
{
    "obj" : "HOST",
    "properties" : ["hostname", "last_hours"]
}
    '''

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect(('localhost', 8001))
    #time.sleep(2)
    hostStr = hostStr + chr(0)
    sock.send(hostStr)
    sock.send(chr(0))
    receivedStr = sock.recv(1024)
    print receivedStr
    processReceivedStr(receivedStr) 
    sock.close()
