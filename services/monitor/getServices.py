#python3
import sys
import os
import re
import json

if(len(sys.argv) != 2) :
    print("\nusage python3 genConfig.py <pathOfServices>\n")
    exit(0)

#path of services
path = sys.argv[1]

regJS = r"\s*\.\s*listen\s*\(\s*(\d{4})"
regPY = r"\s*.\s*run\s*\(.*,\s*port\s*=\s*(\d{4}).*\)"

services = []
for folder in filter(lambda x : os.path.isdir(os.path.join(path,x)), os.listdir(path) ) :
    servicePath = os.path.join(path,folder)
    serviceId = folder
    servicePort = -1
    if ("app.js" in os.listdir(servicePath)) :
        f = open(os.path.join(servicePath , "app.js"),"r")
        text = f.read()
        f.close()
        match = re.search(regJS,text)
        servicePort = match.group(1)

    if("app.py" in os.listdir(servicePath) ) :
        f = open(os.path.join(servicePath , "app.py"),"r")
        text = f.read()
        f.close()
        match = re.search(regPY,text)
        servicePort = match.group(1)
    if(int(servicePort) > -1 ) :
        services.append({
            "url" : "/api/"+serviceId.lower(),
            "port" : str(servicePort),
            "id" : serviceId
            })


print(json.dumps(services , indent = 2))
