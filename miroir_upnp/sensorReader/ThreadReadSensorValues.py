from threading import Thread
import time
from sensor_value import SensorValue
from threading import Lock

class ThreadReadSensorValues(Thread):
	mutex = Lock()
	def __init__(self, sensorValues):
		''' Constructor. '''
		Thread.__init__(self)
		self.sensorValues = sensorValues

	def run(self):
		while True:
			self.mutex.acquire(1)
			self.sensorValues.update_presence_values()
			self.sensorValues.update_lumiere_values()
			self.sensorValues.print_info()
			#self.sensorValues.update_micro_values()
			self.mutex.release()
			time.sleep(0.5)
			

