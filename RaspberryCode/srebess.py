import requests
import json

def ask_service(name):
	req = requests.get("http://172.20.10.4") #we don't use name for the moment
	res= req.json
    return res 
	
	

