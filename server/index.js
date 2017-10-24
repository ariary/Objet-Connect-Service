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
  	}else if(current_time-usual_time>=-treshold){
  		console.log("Usual traffic condition ");
  	} else {
  		console.log("Excellent traffic condition ");
  	};
  } catch (e){
  	console.error("Parsing error:",e);
  }
}); 