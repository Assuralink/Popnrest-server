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

const stripe = require("stripe")("sk_test_z3fnuvqdJsTc3R1bGjcGBn3000rPPqFsNM");

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


var port = 8080 || process.env.PORT;
var SERVER_MODE = "dev";
// var SERVER_MODE = "prod";

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


app.get("/", function(req,res){
  res.render("homepage");
});


const users_API = require('./API/users');
app.use('/users', users_API);

const users_Routes = require('./routes/users');
app.use('/users', users_Routes);

app.get("/documentation", function(req,res){
  res.render("documentation");
});


console.log("Listining on / on port " + port);



app.post("/payment/stripe/create", urlEncodedParser, function (req, res) {

  console.log(">> Create Stripe Payment");
  
  var data = new Data();
  data.amountToPay = 0;

  var cart = req.body.cart;

  var queries = new promise(function (resolve, reject) {

    if(Number(cart.length) > 0){
      for(var c in cart){
        let productPrice = cart[c].price * 100;
        data.amountToPay += productPrice;
      }
      resolve();
    }else{
      data.error = "Your cart is empty";
      reject();
    }

  })
  .then(function(){
    return new promise(function(resolve,reject){

      var paymentIntent = stripe.paymentIntents.create({
        amount: data.amountToPay,
        currency: "eur"
      }).then((res) => {
        data.clientSecret = res.client_secret;
        resolve();
      });

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

app.post("/bookings/add", urlEncodedParser, function (req, res) {

  console.log(" ---------- BOOKINGS - ADD -----------");

  var data = new Data();
  data.from_sql = "";
  data.to_sql = "";

  var userId = req.body.userId;
  var date = req.body.date;
  var duration = Number(req.body.duration);
  var time = req.body.time;
  var from_sql = null;
  var to_sql = null;

  var queries = new promise(function (resolve, reject) {

    if(date != ""){
      if(validateDate(date, responseType="boolean", dateFormat="mm/dd/yyyy")){
        data.from_sql = dateFormater(new Date(date), "yyyy-mm-dd");
        data.from_sql += " "+time+":00";
        resolve();
      }else{
        data.error = "Please enter a valid date";
        reject();
      }
    }else{
      data.error = "Please enter a valid date";
      reject();
    }
  
  })
  .then(function () {
      return new promise(function (resolve, reject) {

        var query = "SELECT DATE_ADD(\""+data.from_sql+"\", INTERVAL "+duration+" MINUTE) as toDate";
        console.log(query);
        popnrest_db.query(query, function (err, rows, fields) {
          if (!err) {
            if (Number(rows.length) > 0) {
              data.to_sql = rows[0].toDate;              
              resolve();
            } else {
              reject();
            }
          } else {
            reject();
          }
        });

      });
    })
  .then(function () {
      return new promise(function (resolve, reject) {

        var query = "INSERT INTO bookings (productId,fromDate,toDate,duration,customerId,price,vat,total) VALUES ("
          +"1, "
          +"\""+data.from_sql+"\", "
          +"\""+data.to_sql+"\", "
          +duration+", "
          +"\""+userId+"\", "
          +"99,"
          +"20,"
          +"119"
        +")";
        console.log(query);
        popnrest_db.query(query, function (err, rows, fields) {
          if (!err) {
            data.fromDate = dateFormater(new Date(data.from_sql), "mm/dd/yyyy")+" "+time;
            data.durationString = duration+" min";
            data.duration = Number(duration);
            resolve();
          } else {
            data.error = "An error occured when trying to add your reservation, please try later"
            reject();
          }
        });

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
