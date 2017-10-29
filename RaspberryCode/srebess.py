<<<<<<< HEAD
import request
=======
import requests

>>>>>>> 9f4d46d1b12ce1a14fb0096dfa8deeaf8253c7c9
import json 
  

def ask_service(name):
	
	print("Before req")
	req = requests.get("http://172.20.10.4:8080/?service="+name)

	print("after req")
    
	#we don't use name for the moment
	
	print("Bien consomme")
	
	res=req.json
	
	return res
	
