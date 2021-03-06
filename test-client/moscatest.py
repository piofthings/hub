import paho.mqtt.client as mqtt
import json

# from gpiozero  import OutputDevice
from time import sleep

from uuid import getnode as get_mac
mac = get_mac()
print(mac)

class Payload(object):
 def __init__(self, json_def):
  s = json.loads(json_def)
  self.id = None if 'id' not in s else s['id']
  self.state = None if 'state' not in s else s['state']


# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
 print("Connected with result code "+str(rc))

 # Subscribing in on_connect() means that if we lose the connection and
 # reconnect then subscriptions will be renewed.
 #client.subscribe("$SYS/#")
 client.subscribe("/Relays")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
 print(msg.topic+" "+str(msg.payload))
 payload = Payload(msg.payload)
 print("id:"+ str(payload.id))
 print("state:" + str(payload.state))
 #relay1 = OutputDevice(17, active_high=False)
 #relay2 = OutputDevice(27, active_high=False)


client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("localhost", 1883, 60)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
client.loop_forever()
