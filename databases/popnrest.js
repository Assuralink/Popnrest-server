var mysql = require("mysql");
const PARAMS = require("../constants/index");

if(PARAMS.mode == "DEV"){

  var popnrest_db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "popnrest",
    multipleStatements: true
  });

}else{

  var popnrest_db = mysql.createConnection({
    socketPath: '/srv/run/mysqld/mysqld.sock',
    database: 'popnrest',
    user: 'root',  
    password: '',
    multipleStatements: true,
  });

}

popnrest_db.connect(function (err) {
  if (err) {
    console.log("error connecting: " + err.stack);
    return;
  }
  console.log("connected to POPNREST as id " + popnrest_db.threadId+"\n\n");
});

module.exports = popnrest_db;