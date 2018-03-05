# coding=utf-8
# Gatien Chapon & Gregory Robin
#
# Service pour la localisation par GPS
#
from pyupnp.event import EventProperty
from pyupnp.services import register_action, Service, ServiceActionArgument, ServiceStateVariable
from sensorReader.sensor_value import SensorValue
import time


class MicrophoneService(Service):
    version = (1, 0)
    serviceType = "urn:schemas-upnp-org:service:MicroService:1"
    serviceId = "urn:upnp-org:serviceId:MicroService"
    actions = {
        'GetMicrophone': [
            ServiceActionArgument('Microphone','out','Microphone')
        ]
    }

    stateVariables = [
        ServiceStateVariable('Microphone', 'string', sendEvents=True)

    ]
    state=EventProperty('Microphone')

    def listen_micro_change(self,s):
        while True:
			self.state = s.micro
			time.sleep(0.5)
        return

    @register_action('GetMicrophone')
    def getMicrophone(self):
        return {
            'Microphone' : self.state
        }
