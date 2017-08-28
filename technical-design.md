# Hub and Client design

<h2 id="index">Index</h2>

* [The Hub](#thehub)
* [Security](#security)
* [Control Units](#controlunits)
    * [Control Unit Capability 1 (CC1)](#cc1)
* [Communication between Hub and CU](#hubcucomm)
* [Data layer](#datalayer)   

  
<h2 id="thehub">The Hub</h2>

The hub consists of a WebServer in NodeJS running the Mosca MQTT broker.

It uses a MongoDB for data storage

It does not have any authentication at the moment; authentication will be built on top of Passport.

Idea is for the ```Hub``` to be the main controller unit that is 'auto-discoverable' by the ```clients``` or ```nodes```.
Each ```node``` on boot up tries to connect to ```hubofthings.local``` and on connection publishes its capabilities in terms of Control Units it is managing.

**Control units** are typically one PiZero (or any compute module) running an instance of the MQTT ```client```. Since a Pi can control multiple items via GPIO port, a control unit must declare what it can do, when connecting to the MQTT broker, in this case the Hub.

A control unit need to support MQTT, https and the TCP/IP stack to be a part of the Hub's network.

**Control unit Capability (CC)** is the description of a single capability of the CU. A CU can have multiple capabilities at the same time, e.g. Drive Relays and provide Temperature or Light sensor reading etc. The maximum number of CCs is typically guided by maximum number of addressable GPIO pins or I2C functions.

<h2 id="security">Security</h2>
TBD.
Idea is to run a token server on Hub and clients register to get security tokens.

<h2 id="controlunits">Control Units</h2>  

<h3 id="cc1">Control-unit Capability 1 (CC1) - The Relay Driver</h3>

A RaspberryPi can power 5v relays from its 5v pins and drive it through any of its GPIO ports.

**_Warning_**    
** What goes on the other side of the Relay is beyond the scope of this framework. If you are dealing with high voltage (110v/230v), high current, relays please be careful and take all safety measures that are standard while dealing with high voltage.**  
I am assuming you are using Relays to trip 3.3v-5v circuits ;-)

#### CC Supported Actions  
1. Initialize : The CU can be initialized (this is almost directly related to the gpiozero ```ìnitialize``` command. CUs are coded in python and uses the gpiozero library under the hood)
2. On : The CU has a ON state
3. Off : The CU has an OFF state
4. Close: The CU is in an unresponsive state and cannot respond to anything other than Initialize.
5. Update: All CUs should be able to update themselves on this command. The details of updating an air-gapped network is to be worked out later.

This is represented as the following JSON payload  
```json
{
    "ccType": "Relay",
    "ccTypeId": 1001,
    "ccGpioPin": 17,
    "ccActions": [
        {
            "name": "Initialize",
            "deps": []     
        },
        {
            "name": "On",
            "deps" : ["Initialize"]
        },
        {
            "name": "Off",
            "deps": ["Initialize", "On"]
        },
        {
            "name": "Close",
            "deps": ["Initialize"]
        }
    ]
}
```  

#### CC State
When a Hub starts communicating with a CU it stores a 'session' state of the CU to provide appropriate views on the UI.  
The state is persisted on actions and also on a timer.


<h2 id="hubcucomm">Communication  between Hub and CU</h2>

Since CUs communicate with the Hub over WiFi (at the moment), it is important only recognized CUs are allowed to talk to the Hub. Towards this, each CU needs to be registered manually once they establish a connection.

If a CU is not registered it is blacklisted after a while.  

When a CU is blacklisted it is informed of the decision and all future requests are ignored (how? Block IP?)

### Workflow

#### Registration
1. ```hubofthings.local``` is online
2. CU comes online and tries to connect to ```hubofthings.local```
3. If connected, CU sends out a Registration message to the ```/Register``` channel and registers to listen to the ```/Register/[mac-address]``` channel.
4. The registration information is stored into the DB and the system waits for it to be acted upon.
5. When the user whitelists the CU (from the ```hubofthings.local``` site), the mqtt server sends out a message on the ```/Register/[mac-address]``` channel to the tell the CU that it is now whitelisted and it can communicate with the Hub. This payload also contains a security token that the CU must use for future requests.
6. Once the the CU receives registration confirmation it registers to listen to ```/cu/[mac-address]```channel.
7. When a CU fails to reach ```hubofthings.local``` it retries connection with an increasing time gap. A CU continues for 24 hours and then shuts itself down if it cannot reach ```hubofthings.local``` to register itself.

#### Command exchange
Initially commands are initiated from the Hub via the web interface only. There will be provision of CU to CU command exchange in the future so that devices like capacitive switch pHATs and other fancy input methods can be used to send commands to other CUs.

##### Hub to CC
1. Hub presents all capabilities of a particular CU as 'appropriate components' on screen. For example the "Initialize" capability can be represented as a "Button".
2. Whenever the state is changed, Hub saves the snapshot in the DB. Refer to cuState section in Data Layer.
3. Pressing a ```Button``` sends a ```command```message to the ```/cu/[mac-address]/command``` channel.

##### CC to Hub
1. Once the CC receives a ```command``` it tries to complete the action.
2. Once action is complete the CC sends back a ```response``` payload to the ```/cu/[mac-address]/response``` and report back the status.



<h2 id="datalayer">Data Layer</h2>

### piothub

The database for the web server

#### accounts
Accounts collection used by Passport (reserved for future use)

#### session
Session data as used by Passport and ```express-session```

#### devices
Devices collection that stores the list of devices that connected to MQTT server

 **_id:** Unique identifier generated by MongoDB  
 **deviceId:** MAC address provided while Registering  
 **capabilities:** Array of Control Unit Capabilities. It is okay to store all the CCs in one documents because the number of GPIO channels available is limited on a single RaspberryPi/Arduino node and will be well under MongoDB's document size limit.

```ts
{
    _id: ObjectId;
    deviceId: string;
    capabilities: Array<Capability>;
}
```

#### capability
Describes CCs of a Control unit. These are not top level documents, rather stored as part of each device.

```ts
{
    _id: ObjectId;
    type: string;
    typeId: number;
    gpioPin: number;
    actions: [
        {
            name: string,
            deps: Array<string>     
        }
    ]
}
```

#### state
Describes the state of a Control Unit's capability. For example if the CU has one or more CC1s, this collection stores one item per CC1 per CU. It is a flat structure without sub-documenting CCs under their respective CUs.

```ts
{
    _id: ObjectId;
    cuId: ObjectId;
    capabilityId: ObjectId;
    type: string;
    gpioPin: number;
    state: any;
}
```

### mqtt
The backing store for mosca
