var http = require('http');

var instructions = function(req, res) { //req= request res= response
  res.writeHead(200, {"Content-Type": "application/json"}); //return code & MIME type
/*  res.writeHead(200, {"Content-Type": "text/plain"});
  var service = require("./services.js");
  console.log(service.info_traffic());
  res.write(""+service.info_traffic());*/
  var request = require("request");

  var treshold=600;
  request("https://maps.googleapis.com/maps/api/distancematrix/json?origins=Cannes&destinations=Nice&mode=driving&departure_time=now&traffic_model=best_guess&language=fr-FR&key=AIzaSyBfwmxGEnUSlilAXOkAkXbZeskaYJ5Gsak", function(error, response, body) {
    //pessimistic, optimistic, best_guess;
    try {
    	var obj = JSON.parse(body); //Parsing JSON

    	/*Retrieve duration*/
    	var elements = obj.rows[0].elements;
    	var usual_time = elements[0].duration.value;
    	var current_time = elements[0].duration_in_traffic.value;
    	/*define traffic condition*/
    	if (current_time-usual_time>=treshold) {
    		console.log("Bad traffic condition");
    		res.write('{"traffic": "bad"}',function(err) { res.end(); });
    	}else if(current_time-usual_time>=-treshold){
    		console.log("Usual traffic condition ");
    		res.write('{"traffic": "usual"}',function(err) { res.end(); });
    	} else {
    		console.log("Excellent traffic condition ");
    		res.write('{"traffic": "excellent"}',function(err) { res.end(); });
    	};
    } catch (e){
    	console.error("Parsing error:",e);
    }
  }); 
}

var server = http.createServer(instructions);
server.listen(8080);