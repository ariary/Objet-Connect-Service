var request = require("request");
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com')

var connected = false;

client.on('connect', () => {
  client.subscribe('mirror/led');
  client.subscribe('mirror/presence');
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

function getWeatherService(){
  console.log("send meteo");
}


function  getTraficservice(){
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

      client.publish('mirror/led' , "red" ,{qos: 1})
      // color="red";
    }else if(current_time-usual_time>=-treshold){
      console.log("Usual traffic condition ");
       client.publish('mirror/led', "yellow",{qos: 1})
      // color="red";
    } else {
      console.log("Excellent traffic condition ");
      client.publish('mirror/led', "green",{qos: 1})
      // color="red";
    };
  } catch (e){
    console.error("Parsing error:",e);
  }
  }); 
}