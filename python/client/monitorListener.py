def jsonProcess(jsonStr):
    returnStr = '''
{
    "hostname" : "zzr's Mac",
    "last_hours" : 5
}
    '''

    return returnStr 


if __name__ == '__main__':
    import socket

    # Define constant
    DEFINED_EOF = chr(0) 
    SOCKET_PORT         = 8001
    SOCKET_HOST_ADDRESS = 'localhost'
    SOCKET_BACKLOG      = 5
    SOCKET_BUFFER_LEN   = 2
    SOCKET_CONN_TIMEOUT = 5             # CONNECTION TIMEOUT (second)

    # Create Socket
    listener = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    listener.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)  # Port reuse, because when the port is in TIME_WAIT status, the listener cant bind on to the port
    listener.bind( (SOCKET_HOST_ADDRESS, SOCKET_PORT) )
    listener.listen(SOCKET_BACKLOG)

    # Listen and Process
    while True:
        receiveStr = ''

        connection,address = listener.accept()

        try:
            connection.settimeout(SOCKET_CONN_TIMEOUT)
            a = 0
            while True:
                a =a +1 
                print 'Step[%d]:' %(a)
                buf = connection.recv(SOCKET_BUFFER_LEN)
                receiveStr = receiveStr + buf
                print buf
                EOF = buf.find(DEFINED_EOF)  # "\n" means the end of the stream 
                if EOF==0:  #get the EOF tag
                    print receiveStr;
                    returnStr = jsonProcess(receiveStr)
                    connection.send(returnStr)
                    connection.shutdown(socket.SHUT_RDWR)
                    connection.close()
                    break;
                else:
                    continue;
        except socket.timeout:
            print 'time out'
            connection.send('Time out! Or try add the EOF(\\n) to the end of the stream')
            connection.close()

                










