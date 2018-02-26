var upnp = require("peer-upnp");
var UUID = require("node-uuid");
var os = require("os");
var http = require("http");
var server = http.createServer();
var PORT = 8081;
server.listen(PORT);

var peer = upnp.createPeer({
	prefix: "/upnp",
	server: server
}).on("ready",function(peer){
	console.log("ready");
		//Presence
		peer.on("urn:schemas-upnp-org:service:PresenceService:1",function(service){
			console.log("PresenceService  found");
	        // get notified when device disappears
			service.on("disappear",function(service){
				console.log("service "+service.serviceType+" disappeared");
			});
	        // bind to the service in order to call its methods
	        // bind will generate a JavaScript function for each service method.
	        // Inputs and outputs are JSON objects where the keys are the name of the
	        // inputs or outputs.
			service.bind(function(service){
	            // Call UPnP interface SetTarget of SwitchPower Service
	            console.log("Call GetPresence");
				service.GetPresence({
				},function(res){
					console.log("GetPresence done:"+res.RetTargetValue);
				});
			}).on("event",function(data){
				console.log("Receive update from Presence Service: ",data.Target);
					if (data.Target==1) {
						console.log("Personne présente, on envoie le traffic sur le service display")

						var peer2 = upnp.createPeer({
							prefix: "/upnp",
							server: server
						}).on("ready",function(peer){
							console.log("ready");
							peer2.on("urn:schemas-upnp-org:service:Display:1",function(service){
								console.log("DisplayService  found");
						        // get notified when device disappears
								service.on("disappear",function(service){
									console.log("service "+service.serviceType+" disappeared");
								});
						        // bind to the service in order to call its methods
						        // bind will generate a JavaScript function for each service method.
						        // Inputs and outputs are JSON objects where the keys are the name of the
						        // inputs or outputs.
								service.bind(function(service){
						            // Call UPnP interface SetTarget of SwitchPower Service
						            var res;
						            Promise.all([requestSQL("0")])
						              .then(function(results_sql) {
						                var route = results_sql[0];  // request SQL
						                Promise.all([requestTraffic(route)])
						                  .then(function(results_traffic) {
						                    res = results_traffic[0];  // request traffic
			                                console.log("Call SetDisplay with:"+res);
			                    			service.SetDisplay({
			                    				NewTargetValue:res
			                    			},function(res){
			                    				console.log("SetDisplay done");
			                    			});
						                  });
						              });
								});
						        // Stop receiving updates after 10 seconds
						/*		setTimeout(function(){
									//service.removeAllListeners("event");
								},10000);*/
							});
							
						}).start();
					}
			});
	        // Stop receiving updates after 10 seconds
	/*		setTimeout(function(){
				//service.removeAllListeners("event");
			},10000);*/
		});

	}).on("close",function(peer){
		console.log("closed");
	}).start();

// close peer after 3 minutes
setTimeout(function(){
	//peer.close();
},180000);



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