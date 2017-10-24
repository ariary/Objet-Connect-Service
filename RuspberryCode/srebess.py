import requests
import json


treshold=600


r = requests.get("https://maps.googleapis.com/maps/api/distancematrix/json?origins=Cannes&destinations=Nice&mode=driving&departure_time=now&traffic_model=best_guess&language=fr-FR&key=AIzaSyBfwmxGEnUSlilAXOkAkXbZeskaYJ5Gsak")


res = json.loads(r.content)

#parse duration from HTTP request result
duration = res['rows'][0]['elements'][0]['duration']['value']
#convert value to int
duration = int(duration)
print(duration)


#parse duration in traffic from HTTP request result
durationInTraffic = res['rows'][0]['elements'][0]['duration_in_traffic']['value']
#convert value to int
durationInTraffic = int(durationInTraffic)
print(durationInTraffic)


#check for condition
if (durationInTraffic-duration>=treshold) :
  		print("Bad traffic condition")
elif(durationInTraffic-duration>=-treshold):
  		print("Usual traffic condition ")
else :
  		print("Excellent traffic condition ")
