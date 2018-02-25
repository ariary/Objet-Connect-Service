var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database: "mydb"
});

// connection.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");

//   var sql = "CREATE TABLE mirrors (id INTEGER, dep VARCHAR(255), dest VARCHAR(255))";
//   connection.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table created");
//   });
// });

connection.connect(function(err) {
  if (err) throw err;
  connection.query("SELECT * FROM mirrors WHERE id = 1", function (err, result, fields) {
    if (err) throw err;
    if (result.length > 0) {
    	console.log("éxiste");
    }else{
    	console.log("éxiste pas");
    }
  });
});
