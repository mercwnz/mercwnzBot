import json, re, os, sys

from datetime import datetime

from os import listdir
from os.path import isfile, join

mypath =  os.path.dirname(os.path.realpath(__file__))

onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]

a = 76;
for i in onlyfiles:
	if(re.match(".*.json$", i, re.IGNORECASE)):
		o = os.path.basename(i)

		with open(o, encoding="utf8") as f:
			data = json.load(f)
			comments = data['comments']
			for c in comments:
				if(re.match("pnkyfish just died again. She has now died \d+ times", c['message']['body'], re.IGNORECASE)):
					m = re.match("pnkyfish just died again. She has now died (\d+) times", c['message']['body'], re.IGNORECASE)[1]
					try:
						d = (datetime.strptime(c['created_at'], '%Y-%m-%dT%H:%M:%S.%fZ') - datetime(1970,1,1)).total_seconds()
						p = (datetime.strptime(c['created_at'], '%Y-%m-%dT%H:%M:%S.%fZ').strftime("%Y-%m-%d %H:%M:%S"))
					except Exception:
						d = (datetime.strptime(c['created_at'], '%Y-%m-%dT%H:%M:%SZ') - datetime(1970,1,1)).total_seconds()
						p = (datetime.strptime(c['created_at'], '%Y-%m-%dT%H:%M:%SZ').strftime("%Y-%m-%d %H:%M:%S"))
						pass

					print(m,"\t" , d,"\t ",p)
					a = a+1
