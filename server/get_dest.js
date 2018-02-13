//MYSQL
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database: "mydb"
});

if (process.argv.length >=3) {
  connection.connect(function(err) {
    if (err) throw err;
    connection.query("SELECT dest FROM mirrors WHERE id="+process.argv[2], function (err, result, fields) {
      if (err) throw err;
      if (!result.length) {
      	console.log("No destination preferences defined for (id)"+process.argv[2]);
      }else{
      	console.log(result[0].dest)
      }
    });
  });
}else{
  console.log("get_dest expects 1 arguments, missing "+ (3 - process.argv.length) +" element")
}