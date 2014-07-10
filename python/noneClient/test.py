import  json
import controller

rows = controller.getHostInfo("192.168.1.12")


#for(r) in rows:
#    for(l) in r:
#        print l


if rows is None:
    exit(1)
for(l) in rows:
    print l
