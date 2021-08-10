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

var validateDate = require("validate-date");
var dateFormater = require("dateformat");
var timediff = require("timediff");

var promise = require("promise");

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
app.use("/spec", express.static(__dirname + "/spec"));

app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials',
  defaultLayout: __dirname + '/views/layouts/main.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

var today = new Date();
var YYYY = today.getFullYear();

const PARAMS = require("./constants/index");

var port = PARAMS.port;

var admin = require("firebase-admin");
const { connect } = require("http2");
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
  this.error = "";
}

const classics_Routes = require("./routes/classics");
app.use('/', classics_Routes);


const users_API = require('./API/users');
app.use('/users', users_API);
const users_Routes = require('./routes/users');
app.use('/users', users_Routes);


const properties_Routes = require('./routes/properties');
app.use('/properties', properties_Routes);


const cart_Routes = require('./routes/carts');
app.use('/carts', cart_Routes);
var carts_API = require('./API/carts');
app.use('/carts', carts_API);

var bookings_API = require('./API/bookings');
app.use('/bookings', bookings_API);

var payments_API = require('./API/payments');
app.use('/payments', payments_API);


app.get("/documentation", function(req,res){
  res.render("documentation");
});


console.log("Listining on / on port " + port);

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
