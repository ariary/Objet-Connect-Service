# coding=utf-8
# Meriem Chebaane
#
# Service pour la detection du presence de l'utilisateur par le capteur de distance
#
from pyupnp.event import EventProperty
from pyupnp.services import register_action, Service, ServiceActionArgument, ServiceStateVariable
from sensorReader.sensor_value import SensorValue
import time


class PresenceService(Service):
    version = (1, 0)
    serviceType = "urn:schemas-upnp-org:service:PresenceService:1"
    serviceId = "urn:upnp-org:serviceId:PresenceService"
    actions = {
        'GetPresence': [
            ServiceActionArgument('Presence','out','Presence')
        ]
    }

    stateVariables = [
        ServiceStateVariable('Presence', 'string', sendEvents=True)

    ]
    state=EventProperty('Presence')

    def listen_presence_change(self,s):
        while True:
			self.state = s.presence
			time.sleep(0.7)
        return

    @register_action('GetPresence')
    def GetPresence(self):
        return {
            'Presence' : self.state
        }
