# Meriem Chebaane
import time
import grovepi
#A verifier 
import os
import json
# a changer 
distance_sensor =4 
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
grovepi.pinMode(distance_sensor,"INPUT")
grovepi.pinMode(pin,"OUTPUT")
grovepi.chainableRgbLed_init(pin,numleds)
#capteur lumiere
grovepi.pinMode(light_sensor,"INPUT")
grovepi.pinMode(led,"OUTPUT")
grovepi.chainableRgbLed_init(led,numleds)
class SensorValue():

	def __init__(self): # Notre methode constructeur
		self.presence = "" # si la personne est detectee envoyer uuid 'd4f0fd64-ad9d-4cfd-aa76-8d3541fbf008' else '
		self.lumiere = 0
		self.micro = 0
		self.led = "EteindreLed" #si resistance > threshold allumer led else eteindre lumiere
	def update_presence_values(self):
		res = grovepi.digitalRead(distance_sensor)
		if (res == 0):
			print("Personne presente")
			grovepi.chainableRgbLed_pattern(pin,0,0)
			self.presence = "d4f0fd64-ad9d-4cfd-aa76-8d3541fbf008"
		if (res == 1):
			self.presence = "null"
	def update_lumiere_values(self):
		resistance = grovepi.analogRead(light_sensor)
		#Calculer la resistance du capteur
		resistancecal = (float)(1023 - resistance) * 10 / resistance
		if (resistancecal > threshold):
			print("Allumer led")
			self.lumiere = "AllumerLed"
		else:
			self.lumiere = "EteindreLed"
	def update_led_values(self):
		#Verifier l'etat de la led demander
		if (self.led == "AllumerLed"):
			grovepi.storeColor(255,255,255)
			grovepi.chainableRgbLed_pattern(pin,0,0)
		if (self.led == "EteindreLed"):
			grovepi.storeColor(0,0,0)
			grovepi.chainableRgbLed_pattern(pin,0,0)
	def print_info(self):
		print "Presence:", self.presence, "resistance lumiere : ", self.lumiere," microphone : ",self.micro , "Led :", self.led,""



