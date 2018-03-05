# coding=utf-8
# meriem chebaane
#
# Service permettant la gestion d'allumage de la led verte et rouge
# Une seule fonction exposé :
# SetLightStatus("ON"|"OFF","RED"|"GREEN") permettant l'allumage et l'extinction des leds

from pyupnp.event import EventProperty
from pyupnp.services import register_action, Service, ServiceActionArgument, ServiceStateVariable
from sensorReader.sensor_value import SensorValue
import time


class LedService(Service):
    version = (1, 0)
    serviceType = "urn:schemas-upnp-org:service:LedService:1"
    serviceId = "urn:upnp-org:serviceId:LedService"
    actions = {
        'SetLed' : [
            ServiceActionArgument('Led','in','A_ARG_TYPE_Status')
        ],
        'GetLed' : [
            ServiceActionArgument('Led_status','out','Led_Status')
        ]
    }

    stateVariables = [
        ServiceStateVariable('A_ARG_TYPE_Status','string'),
        ServiceStateVariable('Led_Status', 'string',sendEvents=True)
    ]
    
    state=EventProperty('Led')

    @register_action('SetLed')
    def setLed(self,status):
       	while True:
			self.state = s.led
			time.sleep(0.7)
        return

    @register_action('GetLed')
    def getLed(self):
        return {
            'LedStatus' : self.Presence
        }
