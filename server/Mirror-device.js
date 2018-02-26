var upnp = require("peer-upnp");
var http = require("http");
var server = http.createServer();
var PORT = 8082;
// start server on port 8080. please do this step before you create a peer
server.listen(PORT);

// Create a UPnP Peer. 
var peer = upnp.createPeer({
	prefix: "/upnp",
	server: server
}).on("ready",function(peer){
	console.log("ready");
	// advertise device after peer is ready
	device.advertise();
}).on("close",function(peer){
	console.log("closed");
}).start();

// Create a BinaryLight device as specified in UPnP http://upnp.org/specs/ha/UPnP-ha-BinaryLight-v1-Device.pdf.  
// Please refer for device configuration parameters to the UPnP device architecture.
var device = peer.createDevice({
	autoAdvertise: false,
	uuid: "6bd5eabd-b7c8-4f7b-ae6c-a30ccdeb5988",
	productName: "Coltram",
	productVersion: "0.0.1",
	domain: "schemas-upnp-org",
	type: "MirrorDevice",
	version: "1",
	friendlyName: "MirrorDevice",
	manufacturer: "Fraunhofer FOKUS",
	manufacturerURL: "http://www.fokus.fraunhofer.de",
	modelName: "MirrorDevice",
	modelDescription: "MirrorDevice",
	modelNumber: "0.0.1",
	modelURL: "http://www.famium.org",
	serialNumber: "1234-1234-1234-1234",
	UPC: "123456789012"
});

var servicePresence = device.createService({
	domain: "schemas-upnp-org",
	type: "PresenceService",
	version: "1",
	// Service Implementation
	implementation: {
		GetPresence: function(inputs){
			// the result is the value of the state variable Target
			return {RetTargetValue: this.get("Target")}
		},
		SetPresence: function(inputs){
			// set the new value of the state variable Target
			this.set("Target", inputs.NewTargetValue); 
			// notify state change of the state variable to all subscribers
			this.notify("Target");
			this.get("Target") == "1"? console.log("Change Presence to ON"):console.log("Change Presence to OFF");
		},
		GetStatus: function(inputs){
			// the result is the value of the state variable Target
			return {ResultStatus: this.get("Target")}
		}
	},
	// Service Description. this will be converted to XML 
	description: {
		actions: {
			GetPresence: {
				outputs: {
					RetTargetValue: "Target" // Target is the name of the state variable
				}
			},
			SetPresence: {
				inputs: {
					NewTargetValue: "Target"
				}
			},
			GetStatus: {
				outputs: {
					ResultStatus: "Status"
				}
			}
		},
		// declare all state variables: key is the name of the variable and value is the type of the variable. 
		// type can be JSON object in this form {type: "boolean"}. 
		variables: {
			Target: {
				type: "boolean",
				event: true,
				multicast: true
			}, 
			Status: "boolean"
		}
	}
});
// initialize the Target State Variable with 0
servicePresence.set("Target",0);

var serviceDisplay = device.createService({
	domain: "schemas-upnp-org",
	type: "Display",
	version: "1",
	// Service Implementation
	implementation: {
		SetDisplay: function(inputs){
			// set the new value of the state variable Target
			console.log("new Display"+inputs.NewTargetValue); 
			// notify state change of the state variable to all subscribers
		},
	},
	// Service Description. this will be converted to XML 
	description: {
		actions: {
			SetDisplay: {
				inputs: {
					NewTargetValue: "Target"
				}
			}
		},
		// declare all state variables: key is the name of the variable and value is the type of the variable. 
		// type can be JSON object in this form {type: "boolean"}. 
		variables: {
			Target: "string",
		}
	}
});