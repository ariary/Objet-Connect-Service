var request = require("request");

//CONFIGURATION MIRROR
var express = require('express');
var bodyParser = require('body-parser');
var app     = express();

var dep = "";
var dst = "";

app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/itineraryPrefs', function(req, res) {
  //res.send('You sent the name "' + req.body.name + '".');
  /*Validity address verifification */
  request("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+req.body.departure+"&destinations="+req.body.destination+"&mode=driving&departure_time=now&traffic_model=best_guess&language=fr-FR&key=AIzaSyBfwmxGEnUSlilAXOkAkXbZeskaYJ5Gsak", function(error, response, body) {
  try {
    var obj = JSON.parse(body); //Parsing JSON
    var status = obj.rows[0].elements[0].status;//Retrieve status
    
    if (status == "NOT_FOUND") {
      console.log("not_found: addresses specified may be incorrect");
      return res.send('Please check the validity of the addresses specified');
    }else{
              getWeatherService();

      console.log("New itinary: dep="+req.body.departure+" dest="+req.body.destination );
      dep = req.body.departure;
      dst = req.body.destination;
      return res.send('Changes saved');

    }

  } catch (e){
    console.error("Parsing error:",e);
  }
  });
});

app.listen(8080, function() {
  console.log('Configuration Server running at http://127.0.0.1:8080/');
});


//MQTT

var request = require("request");
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com')

var connected = false;

client.on('connect', () => {
  client.subscribe('mirror/traffic');
  client.subscribe('mirror/presence');
  client.subscribe('mirror/resistanceLumiere');
})


/*client.on('message', (topic, message) => {
  if(topic === 'mirror/presence') {
    console.log(message.toString());
  }
})*/

client.on('message', (topic, message) => {
  switch (topic) {
    case 'mirror/presence':
      return handlePresence(message)
    case 'mirror/led':
      return handleLed(message)
    case 'mirror/resistanceLumiere':
      return handleResistance(message)
    
  }
  console.log('No handler for topic %s', topic)
})

function handlePresence (message) {
  console.log('new message in topic mirror/presence: %s', message)
  getTraficservice();
  getWeatherService();
}
function handleLed (message) {
  console.log('new message in topic mirror/led: %s', message)
  getTraficservice();
  getWeatherService();
}

function handleResistance (message) {
  console.log('new message in topic mirror/resistanceLumiere: %s', message)
  var treshold=10;
  if (message > treshold ){
      console.log("zone sans lumiere");
      client.publish('mirror/lampe' , "Allumer lumiere" ,{qos: 1});
    }
  else {
     console.log("zone avec lumiere");
     client.publish('mirror/lampe' , "Eteindre lumiere" ,{qos: 1});
  }
    
}

function getWeatherService(){
  let apiKey = "938663da30c993fe49ae9857bfd35600";
  var city = "nice";
  let Weatherurl = 'http://api.openweathermap.org/data/2.5/weather?q='+city+'&units=Metric&APPID='+apiKey;
  request(Weatherurl, function (err, response, body) {
  if(err){
    console.log('error:', error);
  } else {
      try {
        console.log('body:', body);
        var weather = JSON.parse(body);
        console.log(" It is "+weather.main.temp+" degree in "+weather.name);
        
      }catch(e){
        console.error("Parsing error:",e);
}
  }
});
}


function  getTraficservice(){
  if ((dst=="")||(dep=="")) {
    console.log("No itinary known");
     client.publish('mirror/traffic' , "error" ,{qos: 1})
  }else{
    var treshold=600;
    request("https://maps.googleapis.com/maps/api/distancematrix/json?origins=Cannes&destinations=Nice&mode=driving&departure_time=now&traffic_model=best_guess&language=fr-FR&key=AIzaSyBfwmxGEnUSlilAXOkAkXbZeskaYJ5Gsak", function(error, response, body) {
    //pessimistic, optimistic, best_guess;
    try {
      var obj = JSON.parse(body); //Parsing JSON

      //Retrieve duration
      var elements = obj.rows[0].elements;
      var usual_time = elements[0].duration.value;
      var current_time = elements[0].duration_in_traffic.value;
      //define traffic condition
      // var color="";
      if (current_time-usual_time>=treshold) {
        console.log("Bad traffic condition");

        client.publish('mirror/traffic' , "Bad traffic condition" ,{qos: 1})
        // color="red";
      }else if(current_time-usual_time>=-treshold){
        console.log("Usual traffic condition ");
         client.publish('mirror/led', "Usual traffic condition ",{qos: 1})
        // color="red";
      } else {
        console.log("Excellent traffic condition ");
        client.publish('mirror/led', "Excellent traffic condition ",{qos: 1})
        // color="red";
      };
    } catch (e){
      console.error("Parsing error:",e);
    }
    }); 
  }

}