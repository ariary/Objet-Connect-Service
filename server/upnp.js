var upnp = require("peer-upnp");
var http = require("http");
var server = http.createServer();
var PORT = 8080;
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
	type: "Mirror",
	version: "1",
	friendlyName: "Mirror",
	manufacturer: "Fraunhofer FOKUS",
	manufacturerURL: "http://www.fokus.fraunhofer.de",
	modelName: "Mirror",
	modelDescription: "Mirror",
	modelNumber: "0.0.1",
	modelURL: "http://www.famium.org",
	serialNumber: "1234-1234-1234-1234",
	UPC: "123456789012"
});

// create a GetTraffic service in the Mirror device as specified here http://upnp.org/specs/ha/UPnP-ha-SwitchPower-v1-Service.pdf
var service = device.createService({
	domain: "schemas-upnp-org",
	type: "Traffic",
	version: "1",
	// Service Implementation
	implementation: {
		GetTraffic: function(inputs){
/*			this.set("Target",requestSQL(inputs.UserValue)
				.then((params)=>requestTraffic(params))
				.catch(function(error) {
					console.log("Error:"+error)
				}));
			this.notify("Target");*/
			var res;
			Promise.all([requestSQL(inputs.UserValue)])
			  .then(function(results_sql) {
			    var route = results_sql[0];  // request SQL
			    Promise.all([requestTraffic(route)])
			      .then(function(results_traffic) {
			        var res = results_traffic[0];  // request traffic
			        service.set("Target",res);
			      });
			  });

			return {RetTrafficValue: this.get("Target")};
		},
		SetTarget: function(inputs){
			// set the new value of the state variable Target
			this.set("Target", inputs.NewTargetValue); 
			// notify state change of the state variable to all subscribers
			this.notify("Target");
		},
		GetStatus: function(inputs){
			// the result is the value of the state variable Target
			return {ResultStatus: this.get("Target")}
		},
	},
	// Service Description. this will be converted to XML 
	description: {
		actions: {
			GetTraffic: {
				inputs: {
					UserValue: "uuid"
				},
				outputs: {
					RetTrafficValue: "Target", // Target is the name of the state variable
				}

			},
			SetTarget: {
				inputs: {
					NewTargetValue: "Target"
				}
			},
			GetStatus: {
				outputs: {
					ResultStatus: "Status",
				}
			}
		},
		// declare all state variables: key is the name of the variable and value is the type of the variable. 
		// type can be JSON object in this form {type: "boolean"}. 
		variables: {
			Target: "string", 
			Status: "string",
			uuid: "string"
		}
	}
});
// initialize the Target State Variable with 0
service.set("Target","0");


function requestSQL (id) {
	return new Promise(function (resolve, reject) {
		var mysql      = require('mysql');
		var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'root',
		database: "mydb"
		});
		var prefs=[];
		connection.connect(function(err) {
			if (err) throw err;
			connection.query("SELECT dep,dest FROM mirrors WHERE id="+id, function (err, result, fields) {
				if (err) throw err;
				if (!result.length) {
					console.log("No destination preferences defined for (id)"+id);
					reject(prefs);
				}else{
					prefs[0]=result[0].dep;
					prefs[1]=result[0].dest;
					console.log("[RETRIEVE SQL]for user"+id+":dep = "+prefs[0]+" ,dest = "+prefs[1]);
				}
				resolve(prefs);
			});
		});
	})
}


function requestTraffic(params){
	return new Promise(function (resolve, reject) {
		var request = require("request");
		var treshold=600; // in seconds	
		var result;
		request("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+params[0]+"&destinations="+params[1]+"&mode=driving&departure_time=now&traffic_model=best_guess&language=fr-FR&key=AIzaSyBfwmxGEnUSlilAXOkAkXbZeskaYJ5Gsak", function(error, response, body) {
		//pessimistic, optimistic, best_guess;
		try {
		  var obj = JSON.parse(body); //Parsing JSON

		  //Retrieve duration
		  var elements = obj.rows[0].elements;
		  var usual_time = elements[0].duration.value;
		  var current_time = elements[0].duration_in_traffic.value;

		  //define traffic condition
		  if (current_time-usual_time>=treshold) {
		    result="bad"; 
		    console.log("[RETRIEVE TRAFFIC]: "+result);
		  }else if(current_time-usual_time>=-treshold){
		    result="usual"; 
		    console.log("[RETRIEVE TRAFFIC]: "+result);
		  } else {
		    result="excellent";
		    console.log("[RETRIEVE TRAFFIC]: "+result);
		  }
		  resolve(result);
		} catch (e){
		  console.error("Parsing error:",e);
		}
		});
	});
}



