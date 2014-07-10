import pexpect 
import os
import subprocess
import re

def ssh_cmd(ip, user, passwd, cmd):
    ssh = pexpect.spawn('ssh -l %s %s "%s"' %(user, ip, cmd))
    r = ''
    try:
        i = ssh.expect(['password:','continue connecting (yes/no)?'])
        if i == 0:
            ssh.sendline(passwd)
        elif i==1:
            ssh.sendline('yes')
    except pexpect.EOF:
        ssh.close()
    else:
        r = ssh.read()
        ssh.expect(pexpect.EOF)
        ssh.close()
    return r

def local_cmd(cmd):
    r = os.popen(cmd)
    text = r.read()
    r.close
    return text

def checkPing(ipAddr):
    tempstr =  local_cmd('ping '+ipAddr+' -c 4')
    SEARCH_PAT = re.compile(r'(\d+) packets transmitted, (\d+) received,.*\s(\d+)% packet loss')
    pat_search = SEARCH_PAT.search(tempstr)
    if pat_search != None:
        group = pat_search.groups()
        if group[2] != '100':
            return True
        else:
            return False
    else:
        return False


if __name__ == '__main__':
    print checkPing('192.168.1.200')
