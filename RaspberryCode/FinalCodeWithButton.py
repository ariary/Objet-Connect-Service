import time 
#MQTT
import paho.mqtt.client as paho
broker="broker.hivemq.com"
import grovepi
import os
import json
button=3
pin=7
numleds=1
#connecter la led a la pin D7
led = 7
numleds = 1
#connecter le capteur lumiere a la pin A0
light_sensor = 0
#threshold du capteur lumiere
threshold = 10
#bouton
grovepi.pinMode(button,"INPUT")
grovepi.pinMode(pin,"OUTPUT")
grovepi.chainableRgbLed_init(pin,numleds)
#capteur lumiere
grovepi.pinMode(light_sensor,"INPUT")
grovepi.pinMode(led,"OUTPUT")
grovepi.chainableRgbLed_init(led,numleds)
#define callback de tous les capteurs
while True:
       	try:
		if grovepi.digitalRead(button)==1:
			#Recuperer la valeur du capteur
			sensor_value = grovepi.analogRead(light_sensor)
			#Calculer la resistance du capteur
			resistance = (float)(1023 - sensor_value) * 10 / sensor_value
			print("Personne present")
			print("subscribing to Traffic server")
			def on_message(client,userdata, message):
				time.sleep(1)
       				print("received message =",str(message.payload.decode("utf-8")))
       				if (str(message.payload.decode("utf-8"))=='Allumer lumiere'):
       					grovepi.storeColor(255,255,255)
                       			grovepi.chainableRgbLed_pattern(pin,0,0)
				if (str(message.payload.decode("utf-8"))=='Eteindre lumiere'):
					grovepi.storeColor(0,0,0)
					grovepi.chainableRgbLed_pattern(pin,0,0)
			client= paho.Client("client-001")
			print("connecting to broker ",broker)
			client.connect(broker)
			print("connecte")
			client.loop_start()
			client.subscribe("mirror/traffic")
			time.sleep(2)
			client.subscribe("mirror/lampe")
			time.sleep(2)
			client.on_message=on_message
			print("publishing presence")
		        client.publish("mirror/presence","1")
			time.sleep(2)
			print("publishing resistanceLumiere")
            		client.publish("mirror/resistanceLumiere",resistance)
            		time.sleep(2)
			client.loop_stop()
		else:
			print("Aucune personne presente")
			grovepi.storeColor(0,0,0)
                	grovepi.chainableRgbLed_pattern(pin,0,0)
	except IOError:
        	print "Error"
