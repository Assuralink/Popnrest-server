var express = require("express");
var app = express();
var http = require("http");
var https = require("https");

var bodyParser = require("body-parser"); // pull information from HTML POST (express4)
// var urlEncodedParser = bodyParser.urlencoded({ extended: false });
var urlEncodedParser = bodyParser.urlencoded({
  parameterLimit: 1000000000,
  limit: "50mb",
  extended: true,
});

var hbs = require("express-hbs");

var mysql = require("mysql");
var dateFormat = require("dateformat");
var timediff = require("timediff");

var promise = require("promise");

const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");

var cors = require("cors");
const corsOptions = {
  credentials: true,
  methods: "POST, PUT, OPTIONS, DELETE, GET",
  allowedHeaders: "X-Requested-With, Content-Type, Authorization",
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.engine(
  "hbs",
  hbs.express4({
    partialsDir: __dirname + "/views/partials",
    defaultLayout: __dirname + "/views/layouts/main.hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/images", express.static(__dirname + "/images"));

var today = new Date();
var YYYY = today.getFullYear();

var DATE_NOW_SQL = dateFormat(new Date(), "yyyy-mm-dd");

const mysql2 = require("mysql2");
const { Client } = require("ssh2");

const sshClient = new Client();
const dbServer = {
  host: "localhost",
  port: "8889",
  user: "external-user",
  password: "SFtxnaFfdC6K3h66",
  database: "database",
};
const tunnelConfig = {
  host: "ec2-35-178-221-55.eu-west-2.compute.amazonaws.com",
  port: 22,
  username: "ec2-user",
  privateKey: require("fs").readFileSync(__dirname + "/popnrestlondon.pem"),
};
const forwardConfig = {
  srcHost: "localhost",
  srcPort: "8889",
  dstHost: dbServer.host,
  dstPort: dbServer.port,
};

var connection = null;
const SSHConnection = new Promise((resolve, reject) => {
  sshClient
    .on("ready", () => {
      console.log(">> SSH Ready");
      sshClient.forwardOut(
        forwardConfig.srcHost,
        forwardConfig.srcPort,
        forwardConfig.dstHost,
        forwardConfig.dstPort,
        (err, stream) => {
          if (err) {
            reject(err);
            console.log(">> ERROR");
          }
          const updatedDbServer = {
            ...dbServer,
            stream,
          };
          connection = mysql2.createConnection(updatedDbServer);
          connection.connect((error) => {
            if (error) {
              console.log(">> ERROR");
              reject(error);
            }
            console.log(">> Connected to remote DB");
            resolve(connection);
          });
        }
      );
    })
    .connect(tunnelConfig);
});

// var popnrest_db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "popnrest",
//   multipleStatements: true,
// });

// popnrest_db.connect(function (err) {
//   if (err) {
//     console.log("error connecting: " + err.stack);
//     return;
//   }
//   console.log("connected to POPNREST as id " + popnrest_db.threadId);
// });

console.log(process.env);

var port = 8000;
var SERVER_MODE = "dev";
// var SERVER_MODE = "prod";

var firebase = require("firebase");
var firebaseConfig = {
  apiKey: "AIzaSyBuKWh2PUzTVXlyWXMjuSbuQb2D-tnyFRc",
  authDomain: "popnrest.firebaseapp.com",
  databaseURL: "https://popnrest.firebaseio.com",
  projectId: "popnrest",
  storageBucket: "popnrest.appspot.com",
  messagingSenderId: "571497874947",
  appId: "1:571497874947:web:ebffc0ea30dcba89b07036",
  measurementId: "G-8F16M46FZC",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var admin = require("firebase-admin");
var serviceAccount = require(__dirname +
  "/popnrest-firebase-adminsdk-54ve2-c6d65b8840.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://popnrest.firebaseio.com",
});

// admin
// .auth()
// .updateUser("mf8zR3y80LciyTIebKPT7igWZQx1", {
// 	password: 'adminas11'
// })
// .then((userRecord) => {
// 	console.log('>> Password updated');
// 	resolve();
// })
// .catch((error) => {
// 	reject();
// });

// mysqldump({
// 	connection: {
// 		host: "localhost",
// 		user: "root",
// 		password: "",
// 		database: "burdigala",
// 	},
// 	dumpToFile: './dump.sql',
// });

// // Chargement de socket.io
// var io = require('socket.io').listen(server);

// // Quand un client se connecte, on le note dans la console
// io.sockets.on('connection', function (socket) {
// 	log('Un client est connecté !');
// });

var server = http.createServer(app);

app.use(bodyParser.json({ limit: "50mb" }));

// var request = Mailjet
// .post("parseroute")
// .request({
// 	"Url":"https://aci-bil.fr/webhook/inbound_email"
// })
// request
// .then((result) => {
// 	console.log(result.body)
// })
// .catch((err) => {
// 	console.log(err.statusCode)
// });

function Data() {
  this.current_url = "";
  this.page_title = "";
  this.page_description = "";
  this.statut = false;
  this.erreur = "";
}

// function User(){
// 	this.uid = "mf8zR3y80LciyTIebKPT7igWZQx1";
// 	this.email = "mickael@naturalink.link";
// 	this.firstname = "Mickaël";
// 	this.lastname = "Largement";
// 	this.telephone = "06 26 52 18 44";
// 	this.fax = "01 98 89 98 99";
// 	this.role = "customer";
// 	this.error = "";
// }

function User() {
  this.uid = "";
  this.email = "";
  this.firstname = "";
  this.lastname = "";
  this.phone_number = "";
  this.fax = "";
  this.role = "customer";
  this.error = "";
}

app.post("/customers/login", urlEncodedParser, function (req, res) {
  console.log(">>> CUSTOMERS LOGIN");

  var data = new Data();
  data.user = new User();

  var queries = new promise(function (resolve, reject) {
    firebase
      .auth()
      .signInWithEmailAndPassword(req.body.email, req.body.password)
      .then((userCredential) => {
        // Signed in
        var firebase_user = userCredential.user;

        data.user.uid = firebase_user.uid;
        data.user.email = firebase_user.email;
        // user.email = "simondv@hotmail.com";
        // user.email = "yoann@popnrest.com";
        // user.email = "jared@appfly.com";
        // user.email = "susan.peowrie@gmail.com";
        // user.email = "akintish@hmail.com";

        data.user.role = "customer";

        data.token = jwt.sign(
          { userId: firebase_user.uid },
          "RANDOM_TOKEN_SECRET",
          { expiresIn: "24h" }
        );

        resolve();
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + " : " + errorMessage);

        reject();
      });
  })
    .then(function () {
      data.statut = true;
      res.json(data);
    })
    .catch(function () {
      data.statut = false;
      res.json(data);
    });
});

function Booking() {
  this.id = 0;
  this.date = "";
  this.date_sql = "";
  this.time = "";
  this.time_sql = "";
  this.duration = "";
  this.location = "";
  this.price = "";
  this.from_today = 0;
}

console.log("Listining on / on port " + port);
app.get("/", function (req, res) {
  console.log(">> Accessing");
  res.render("customer_login.hbs");
});

app.post("/customers/bookings", auth, function (req, res) {
  var data = new Data();

  data.bookings = [];
  data.upcoming_bookings = [];
  data.past_bookings = [];

  var email = req.body.email;
  email = "akintish@hmail.com";

  var queries = new promise(function (resolve, reject) {
    var query =
      "SELECT oc_order.order_id, oc_order.total, oc_product.model " +
      "FROM oc_order, oc_order_product, oc_product " +
      "WHERE oc_order.order_id = oc_order_product.order_id " +
      "AND oc_order_product.product_id = oc_product.product_id " +
      "AND order_status_id = 5 " +
      'AND email = "' +
      email +
      '"';
    console.log(query);
    connection.query(query, function (err, rows, fields) {
      if (!err) {
        if (Number(rows.length) > 0) {
          for (var i in rows) {
            var row = rows[i];

            var booking = new Booking();
            booking.id = row.order_id;
            booking.location =
              row.model.charAt(0).toUpperCase() + row.model.slice(1);
            booking.price = "£" + row.total;

            data.bookings.push(booking);
          }
        }
        resolve();
      } else {
        data.erreur = "";
        reject();
      }
    });
  })
    .then(function () {
      return new promise(function (resolve, reject) {
        if (Number(data.bookings.length) > 0) {
          var query = "SELECT * FROM oc_order_option " + "WHERE ( ";
          for (var i in data.bookings) {
            if (i > 0) {
              query += "OR ";
            }
            query += "order_id = " + data.bookings[i].id + " ";
          }
          query += ")";
          console.log(query);
          connection.query(query, function (err, rows, fields) {
            if (!err) {
              if (Number(rows.length) > 0) {
                for (var i in rows) {
                  var row = rows[i];

                  for (var b in data.bookings) {
                    if (data.bookings[b].id == row.order_id) {
                      switch (row.name) {
                        case "Duration":
                          data.bookings[b].duration = row.value;
                          break;
                        case "Time":
                          data.bookings[b].time_sql = row.value;
                          // data.bookings[b].time = row.value;
                          data.bookings[b].time = dateFormat(
                            DATE_NOW_SQL + " " + row.value,
                            "shortTime"
                          );
                          break;
                        case "Date":
                          data.bookings[b].date = dateFormat(
                            new Date(row.value),
                            "dd-mm-yy"
                          );
                          data.bookings[b].date_sql = row.value;
                          break;
                      }
                    }
                  }
                }
              }
              resolve();
            } else {
              data.erreur = "";
              reject();
            }
          });
        } else {
          resolve();
        }
      });
    })
    .then(function () {
      return new promise(function (resolve, reject) {
        for (var i in data.bookings) {
          var diff = timediff(DATE_NOW_SQL, data.bookings[i].date_sql, "D")
            .days;
          data.bookings[i].from_today = diff;

          if (diff < 0) {
            data.past_bookings.push(data.bookings[i]);
          } else {
            data.upcoming_bookings.push(data.bookings[i]);
          }
        }

        data.upcoming_bookings.sort(function (a, b) {
          return new Date(a.from_today) - new Date(b.from_today);
        });
        data.past_bookings.sort(function (a, b) {
          return new Date(a.from_today) - new Date(b.from_today);
        });

        resolve();
      });
    })
    .then(function () {
      data.statut = true;
      res.json(data);
    })
    .catch(function () {
      data.statut = false;
      res.json(data);
    });
});

app.post("/customers/firstname", auth, urlEncodedParser, function (req, res) {
  var data = new Data();

  var firstname = req.body.firstname;

  var queries = new promise(function (resolve, reject) {
    data.firstname = firstname;
    console.log(">> " + data.firstname);

    resolve();
  })
    .then(function () {
      data.statut = true;
      res.json(data);
    })
    .catch(function () {
      data.statut = false;
      res.json(data);
    });
});

app.post("/customers/lastname", auth, urlEncodedParser, function (req, res) {
  var data = new Data();

  var lastname = req.body.lastname;

  var queries = new promise(function (resolve, reject) {
    data.lastname = lastname;
    console.log(">> " + data.lastname);

    resolve();
  })
    .then(function () {
      data.statut = true;
      res.json(data);
    })
    .catch(function () {
      data.statut = false;
      res.json(data);
    });
});

app.post(
  "/customers/phone_number",
  auth,
  urlEncodedParser,
  function (req, res) {
    var data = new Data();

    var phone_number = req.body.phone_number;

    var queries = new promise(function (resolve, reject) {
      data.phone_number = phone_number;
      console.log(">> " + data.phone_number);

      resolve();
    })
      .then(function () {
        data.statut = true;
        res.json(data);
      })
      .catch(function () {
        data.statut = false;
        res.json(data);
      });
  }
);

app.post("/customers/email", auth, urlEncodedParser, function (req, res) {
  var data = new Data();

  var email = req.body.email;

  var queries = new promise(function (resolve, reject) {
    data.email = email;
    console.log(">> " + data.email);

    resolve();
  })
    .then(function () {
      data.statut = true;
      res.json(data);
    })
    .catch(function () {
      data.statut = false;
      res.json(data);
    });
});

app.post("/customers/account/password", urlEncodedParser, function (req, res) {
  var data = new Data();

  console.log(">> USER");
  console.log(req.user);

  var queries = new promise(function (resolve, reject) {
    admin
      .auth()
      .updateUser(req.user.uid, {
        password: "adminadmin11",
      })
      .then((userRecord) => {
        resolve();
      })
      .catch((error) => {
        reject();
      });
  })
    .then(function () {
      data.statut = true;
      res.json(data);
    })
    .catch(function () {
      data.statut = false;
      res.json(data);
    });
});

server.listen(port);
