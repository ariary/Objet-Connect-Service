#Miroir Magique 
# @author : Zeineb Ben Aouicha 

#Importation du librairies time et grovepi
import time 
import grovepi
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
grovepi.chainableRgbLed_inti(pin,numleds)
#Boucle Infini
while True:
	try:
		#Traitement lorsqu'on appui sur le button 
		if grovepi.digitalRead(button)==1:
			print("Personne present")
			#Selection du couleur vert
			grovepi.storeColor(0,255,0)
			#allumer la Led avec cette  (vert)
			grovepi.chainableRgbLed_pattern(pin,0,0)
		else:
			print("")
			#Selection du couleur Rose
			grovepi.storeColor(255,0,127)
			#allumer la Led avec cette couleur (rose)
			grovepi.chainableRgbLed_pattern(pin,0,0)
	except IOError:
        print "Error"