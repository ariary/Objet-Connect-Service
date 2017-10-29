#Miroir Magique 
# @author : Zeineb Ben Aouicha 
#Importation du librairies time et grovepi
import time 
import grovepi
import os
import srebess
import json
#Button branchee sur la pin d3 du grove
button=3
#RGB Led branchee sur la pin d7 du grove
pin=7
numleds=1
#Configuration du button en tant qu'entree
grovepi.pinMode(button,"INPUT")
#Configuration du RGB Led en tant que sortie
grovepi.pinMode(pin,"OUTPUT")
#Initialisation du Led
grovepi.chainableRgbLed_init(pin,numleds)
#Boucle Infini
while True:
	try:
		#Traitement lorsqu'on appui sur le button 
		if grovepi.digitalRead(button)==1:
			print("Personne present")
			#call web service
			j_res=json.loads(srebess.ask_service("traffic"))
			#si l'état du traffic est mauvais
			if j_res['traffic'] == "bad":
			    #mauvaise état du traffic
				#Selection du couleur rouge
			    grovepi.storeColor(255,0,0)
			    #allumer la Led avec cette coleur(rouge)
			    grovepi.chainableRgbLed_pattern(pin,0,0)
			elif j_res['traffic'] == "usual":
				#état normal du traffic
				#Selection du couleur jaune
			    grovepi.storeColor(255,255,0)
			    #allumer la Led avec cette coleur(jaune)
			    grovepi.chainableRgbLed_pattern(pin,0,0)
			else:
			    #excellent état du traffic
			    #Selection du couleur vert
			    grovepi.storeColor(0,255,0)
			    #allumer la Led avec cette couleur(vert)
			    grovepi.chainableRgbLed_pattern(pin,0,0)
		else:
			print("")
			#Selection du couleur Rose
			grovepi.storeColor(255,0,127)
			#allumer la Led avec cette couleur (rose)
			grovepi.chainableRgbLed_pattern(pin,0,0)
	except IOError:
        	print "Error"
		
