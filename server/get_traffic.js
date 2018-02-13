var request = require("request");


if (process.argv.length >= 4) {

  var treshold=600; // in seconds
  var dep = process.argv[2];
  var dest = process.argv[3]
  request("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+dep+"&destinations="+dest+"&mode=driving&departure_time=now&traffic_model=best_guess&language=fr-FR&key=AIzaSyBfwmxGEnUSlilAXOkAkXbZeskaYJ5Gsak", function(error, response, body) {
    //pessimistic, optimistic, best_guess;
    try {
      var obj = JSON.parse(body); //Parsing JSON

      //Retrieve duration
      var elements = obj.rows[0].elements;
      var usual_time = elements[0].duration.value;
      var current_time = elements[0].duration_in_traffic.value;

      //define traffic condition
      if (current_time-usual_time>=treshold) {
        console.log("Bad traffic condition");
        // color="red";
      }else if(current_time-usual_time>=-treshold){
        console.log("Usual traffic condition ");
      } else {
        console.log("Excellent traffic condition ");
      };
    } catch (e){
      console.error("Parsing error:",e);
    }
  });
}else{
  console.log("get_traffic expects 2 arguments, missing "+ (4 - process.argv.length) +" elements");
}