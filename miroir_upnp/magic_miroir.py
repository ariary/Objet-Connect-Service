from threading import Thread
from twisted.internet import reactor
from pyupnp.device import Device, DeviceIcon
from pyupnp.ssdp import SSDP
from pyupnp.upnp import UPnP
from magicMiroirServices.presence import PresenceService
from magicMiroirServices.lumiere import LumiereService
#from magicMiroirServices.led import LedService
from sensorReader.sensor_value import SensorValue
from sensorReader.ThreadReadSensorValues import ThreadReadSensorValues

class MiroirServerDevice(Device):
		deviceType = 'urn:schemas-upnp-org:device:MiroirServer:1'
		friendlyName = "Magic Miroir"
		def __init__(self):
			Device.__init__(self)
			self.sensorValues = SensorValue()
			ThreadReadSensorValues(self.sensorValues).start()
			#change the uuid
			self.uuid = 'd4f0fd64-ad9d-4cfd-aa76-8d3541fbf008'
			self.lumiereService = LumiereService()
			#self.microservice = MicroService()
			self.presenceService = PresenceService()
			#self.ledService = LedService()
			self.services = [
				self.lumiereService,
				#self.ledService,
				#self.microservice,
				self.presenceService
			]

			print "Demarrage service ! "
			#On demarre le service de detection de la presence de l'utilisateur dans un thread apart
			self.threadPresenceService = Thread(target=PresenceService.listen_presence_change, args = (self.presenceService,self.sensorValues))
			self.threadPresenceService.start()
			#On demarre le service pour la mise a jour de la resistance de la lumiere 
			self.threadLumiereService = Thread(target=LumiereService.listen_lumiere_change,args=(self.lumiereService,self.sensorValues))
			self.threadLumiereService.start()
			#On demarre le service pour la mise a jour de la valeur led  
			#self.threadLedService = Thread(target=LedService.listen_lumiere_change,args=(self.ledService,self.sensorValues))
			#self.threadLedService.start()
			#On demarre le service pour le microphone
			#self.thredMicroService = Thread(target=MicroService.listen_Micro_change, args = (self.microservice,self.sensorValues))
			#self.thredMicroService.start()
			self.icons = [DeviceIcon('image/png', 32, 32, 24,'http://172.25.3.103:52323/MediaRenderer_32x32.png')]



if __name__ == '__main__':
	#Logr.configure(logging.DEBUG)
	device = MiroirServerDevice()

	upnp = UPnP(device)
	ssdp = SSDP(device)

	upnp.listen()
	ssdp.listen()
	reactor.run()
