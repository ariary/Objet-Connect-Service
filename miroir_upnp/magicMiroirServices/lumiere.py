# coding=utf-8
# Meriem Chebaane
#
# Service pour la resistance de lumiere par le capteur de lumiere
#
from pyupnp.event import EventProperty
from pyupnp.services import register_action, Service, ServiceActionArgument, ServiceStateVariable
from sensorReader.sensor_value import SensorValue
import time


class LumiereService(Service):
    version = (1, 0)
    serviceType = "urn:schemas-upnp-org:service:LumiereService:1"
    serviceId = "urn:upnp-org:serviceId:LumiereService"
    actions = {
        'GetLumiere': [
            ServiceActionArgument('Resistance','out','Resistance')
        ]
    }

    stateVariables = [
        ServiceStateVariable('Resistance', 'string', sendEvents=True)

    ]
    state=EventProperty('Resistance')

    def listen_lumiere_change(self,s):
        while True:
			self.state = s.lumiere
			time.sleep(0.5)
        return

    @register_action('GetLumiere')
    def getLumiere(self):
        return {
            'resistance' : self.state
        }
