var mysql = require("mysql");

var popnrest_db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "popnrest",
  multipleStatements: true,
});

popnrest_db.connect(function (err) {
  if (err) {
    console.log("error connecting: " + err.stack);
    return;
  }
  console.log("connected to POPNREST as id " + popnrest_db.threadId+"\n\n");
});

module.exports = popnrest_db;