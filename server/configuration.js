//MYSQL
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database: "mydb"
});


//CONFIGURATION MIRROR
var express = require('express');
var bodyParser = require('body-parser');
var app     = express();

var id = "";
var dep = "";
var dst = "";

//SERVICE
var request = require("request");


app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/itineraryPrefs', function(req, res) {
  dep = req.body.departure;
  dst = req.body.destination;
  id = req.body.id;

  console.log("Received from configuration.html: (id)" +  id+ ", (departure) "+ dep +", (destination) "+dst);
  /*Validity address verifification */
  request("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+req.body.departure+"&destinations="+req.body.destination+"&mode=driving&departure_time=now&traffic_model=best_guess&language=fr-FR&key=AIzaSyBfwmxGEnUSlilAXOkAkXbZeskaYJ5Gsak", function(error, response, body) {
  try {
    var obj = JSON.parse(body); //Parsing JSON
    var status = obj.rows[0].elements[0].status;//Retrieve status
    
    if (status == "NOT_FOUND") {
      console.log("not_found: addresses specified may be incorrect");
      return res.send('Please check the validity of the addresses specified');
    }else{
      console.log("Itinary validated!" );
      connection.connect(function(err) { //ajout db
        if (err) throw err;
        console.log("Connection with db ok!");
        var sql = "INSERT INTO mirrors (id,dep, dest) VALUES ("+id+",'"+dep+"', '"+dst+"')";
        connection.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Modification of user (id)");
        });
      });
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


// /!\
// Pour l'instant on ne peut pas modifier une valeure déjà éxistante 
// .ie. à chaque fois on crée une nouvelle entrée on update pas
// le fichier create_db.js sert à créer la db mirrors 