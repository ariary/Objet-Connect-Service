var mosca = require('mosca')

var pubsubsettings = {
  //using ascoltatore
  type: 'mongo',		
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var moscaSettings = {
  port: 1883,			//mosca (mqtt) port
  backend: pubsubsettings	//pubsubsettings is the object we created above 

};

var server = new mosca.Server(moscaSettings);	//here we start mosca
server.on('ready', setup);	//on init it fires up setup()

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running')
}


