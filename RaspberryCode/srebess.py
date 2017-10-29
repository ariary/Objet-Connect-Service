import requests

import json 
  

def ask_service(name):
	
	print("Before req")
	req = requests.get("http://172.20.10.4:8080/?service="+name)

	print("after req")
    
	#we don't use name for the moment
	
	print("Bien consomme")
	
	res=req.json
	
	return res
	
