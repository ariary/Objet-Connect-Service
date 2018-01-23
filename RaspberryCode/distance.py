import time
import grovepi

#connecter le capteur distance la pin D4
sensor = 4

grovepi.pinMode(sensor,"INPUT")

while True:
	try:
		if grovepi.digitalRead(sensor) ==0:
			print("Personne Present")
		else:
			print("Rien")
		time.sleep(.5)
	except IOError:
		print("Error")
