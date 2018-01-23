import time 
import paho.mqtt.client as paho
broker="broker.hivemq.com"
import grovepi
import os
import json
button=3
pin=7
numleds=1
grovepi.pinMode(button,"INPUT")
grovepi.pinMode(pin,"OUTPUT")
grovepi.chainableRgbLed_init(pin,numleds)
#define callback
while True:
       	try:
		if grovepi.digitalRead(button)==1:
			print("Personne present")
			print("subscribing Led")
			def on_message(client,userdata, message):
				time.sleep(1)
       				print("received message =",str(message.payload.decode("utf-8")))
				if (str(message.payload.decode("utf-8"))=='red'):
                                	grovepi.storeColor(255,0,0)
                                	grovepi.chainableRgbLed_pattern(pin,0,0)
                        	elif (str(message.payload.decode("utf-8"))=='yellow'):
                                	grovepi.storeColor(255,255,0)
                                	grovepi.chainableRgbLed_pattern(pin,0,0)
                        	else:
                                	grovepi.storeColor(0,255,0)
                                	grovepi.chainableRgbLed_pattern(pin,0,0)
			client= paho.Client("client-001")
			print("connecting to broker ",broker)
			client.connect(broker)
			print("connecte")
			client.loop_start()
			client.subscribe("mirror/led")
			time.sleep(2)
			client.on_message=on_message
			print("publishing presence")
            		client.publish("mirror/presence","1")
			time.sleep(2)
			client.loop_stop()
		else:
			print("")
			grovepi.storeColor(255,0,127)
			grovepi.chainableRgbLed_pattern(pin,0,0)
	except IOError:
        	print "Error"
