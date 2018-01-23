import time
import grovepi

#connecter la led a la pin D7
led = 7
numleds = 1
#connecter le capteur lumiere a la pin A0
light_sensor = 0

threshold = 10

grovepi.pinMode(light_sensor,"INPUT")
grovepi.pinMode(led,"OUTPUT")
grovepi.chainableRgbLed_init(led,numleds)

while True:
	try:
		#Recuperer la valeur du capteur
		sensor_value = grovepi.analogRead(light_sensor)
		#Calculer la resistance du capteur
		resistance = (float)(1023 - sensor_value) * 10 / sensor_value
		if resistance > threshold:
			#Pas de luminance 
			#Allumer Led rouge
			grovepi.storeColor(255,0,0)
			grovepi.chainableRgbLed_pattern(led,0,0)
			print("Zone sans luminance")
		else:
			#Avec luminance
			#Allumer Led verte
			grovepi.storeColor(0,255,0)
			grovepi.chainableRgbLed_pattern(led,0,0)
			print("Zone avec luminance")
		print("sensor_value = %d et resistance = %.2f" %(sensor_value, resistance))
		time.sleep(.5)
	except IOError:
		print("Error")

