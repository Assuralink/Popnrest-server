const express = require('express');
const router = express.Router();
const promise = require("promise");

var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({
  parameterLimit: 1000000000,
  limit: "50mb",
  extended: true,
});

const auth = require("../middleware/auth");

const popnrest_db = require('../databases/popnrest');
const firebase = require('../databases/firebase');
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
  privateKey: require("fs").readFileSync(__dirname + "/../popnrestlondon.pem"),
};
const forwardConfig = {
  srcHost: "localhost",
  srcPort: "8889",
  dstHost: dbServer.host,
  dstPort: dbServer.port,
};
var opencart_db = null;
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
          opencart_db = mysql2.createConnection(updatedDbServer);
          opencart_db.connect((error) => {
            if (error) {
              console.log(">> ERROR");
              reject(error);
            }
            console.log(">> Connected to OpenCart DB");
            resolve(opencart_db);
          });
        }
      );
    })
    .connect(tunnelConfig);
});

// Tools
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
var dateFormater = require("dateformat");
var timediff = require("timediff");

// Models
const User = require('../models/users');
const Booking = require('../models/bookings');
const DATE_NOW_SQL = dateFormater(new Date(), "yyyy-mm-dd");


router.post("/login", (req,res,next) => {

  var data = new Object();
  var error = null;

  data.user = new User();

  var queries = new promise(function (resolve, reject) {
    
    var query = "SELECT * FROM customers WHERE email = \""+req.body.email+"\"";
    console.log(query);
    popnrest_db.query(query, function (err, rows, fields) {
      if (!err) {
        if (Number(rows.length) > 0) {

          // If user is found in the new database, try to authenticate with stored password
          var row = rows[0];

          if(passwordHash.verify(req.body.password, row.password)){

            data.user.id = row.id;
            data.user.uid = row.uid;
            data.user.email = row.email;
            data.user.role = "user";
            data.user.firstname = row.firstname;
            data.user.lastname = row.lastname;
            data.user.phoneNumber = row.phoneNumber;
            console.log(">> Good password, proceded");

            resolve();
          }else{
            console.log(">> Wrong password, proceded");
            error = new Error("Your email and/or password is incorrect");
            reject();
          }

        }else{

          // If not, try to auth with Firebase
          firebase
          .auth()
          .signInWithEmailAndPassword(req.body.email, req.body.password)
          .then((userCredential) => {

            var firebase_user = userCredential.user;
            data.user.uid = firebase_user.uid;
            data.user.email = firebase_user.email;
            data.user.role = "user";

            var hashedPassword = passwordHash.generate(req.body.password);

            // If user in logged with Firebase, move him to database
            var query =
              "INSERT INTO customers (uid,email,firstname,lastname,phone_number,password) VALUES ("
                +"\""+data.user.uid+"\", "
                +"\""+data.user.email+"\", "
                +"\""+data.user.firstname+"\", "
                +"\""+data.user.lastname+"\", "
                +"\""+data.user.phoneNumber+"\" "
              ")";
            console.log(query);
            popnrest_db.query(query, function (err, rows, fields) {
              if (!err) {
                resolve();
              } else {
                error = new Error("Error while trying to add the user to the migrated database");
                reject();
              }
            });

          })
          .catch((err) => {
            error = new Error("Your email and/or password is incorrect");
            reject();
          });

        }
      }else{
        reject();
      }

    });
  }).then(function () {
    return new promise(function (resolve, reject) {

      data.token = jwt.sign(
        { userId: data.user.id },
        "RANDOM_TOKEN_SECRET",
        {
          expiresIn: "24h",
        }
      );

      resolve();
    });
  }).then(function () {
    res.status(200).json(data);
  }).catch(function () {
    res.status(401).json({
      stack: error.stack,
      message: error.message
    });
  });
});

router.post("/signup", urlEncodedParser, function (req, res) {

  var data = new Object();
  var error = null;

  data.user = new User();

  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var phoneNumber = req.body.phoneNumber;
  var password = req.body.password;

  var queries = new promise(function (resolve, reject) {

    if (firstname != "") {
      resolve();
    } else {
      error = new Error("You need to provide a firstname");
      reject();
    }
  }).then(function () {
    return new promise(function (resolve, reject) {

      if (lastname != "") {
        resolve();
      } else {
        error = new Error("You need to provide a lastname");
        reject();
      }

    });
  }).then(function () {
      return new promise(function (resolve, reject) {

        if (email != "") {
          resolve();
        } else {
          error = new Error("You need to provide an email");
          reject();
        }

    });
  }).then(function () {
    return new promise(function (resolve, reject) {

      var query = "SELECT * FROM customers WHERE email = \""+email+"\"";
      console.log(query);
      popnrest_db.query(query, function (err,rows,fields) {
        if (!err) {
          if (Number(rows.length) > 0) {
            error = new Error("An account exist with this email");
            reject();
          } else {
            resolve();
          }
        } else {
          reject();
        }
      });

    });
  }).then(function () {
    return new promise(function (resolve, reject) {
      
      if (phoneNumber != "") {
        resolve();
      } else {
        error = new Error("You need to provide a phone number");
        reject();
      }

    });
  }).then(function () {
    return new promise(function (resolve, reject) {

      if (password != "") {
        resolve();
      } else {
        error = new Error("You need to provide a password");
        reject();
      }
    });

  }).then(function () {
    return new promise(function (resolve, reject) {

      let randomUid = Math.random().toString(36).substring(7);
      var hashedPassword = passwordHash.generate(password);

      var query = "INSERT INTO customers (uid,email,firstname,lastname,phoneNumber,password,date_added) VALUES (" +
        +"\""+randomUid+"\", "
        +"\""+email+"\", "
        +"\""+firstname+"\", "
        +"\""+lastname+"\", "
        +"\""+phoneNumber+"\", "
        +"\""+hashedPassword+"\", "
        +"NOW()"
      +")";
      console.log(query);
      popnrest_db.query(query, function (err, rows, fields) {
        if (!err) {

          data.user.id = rows.insertId;
          data.user.uid = randomUid;
          data.user.firstname = firstname;
          data.user.lastname = lastname;
          data.user.email = email;
          data.user.phoneNumber = phoneNumber;

          resolve();
        } else {
          error = new Error("Error while trying to save customer to the database");
          reject();
        }
      });

    });
  }).then(function(){
    return new promise(function(resolve,reject){

      data.token = jwt.sign(
        { userId: data.user.id },
        "RANDOM_TOKEN_SECRET",
        {
          expiresIn: "24h",
        }
      );

      resolve();
    });
  }).then(function () {
    res.status(200).json(data);
  }).catch(function () {
    res.status(401).json({
      stack: error.stack,
      message: error.message
    });
  });
});

router.get("/details", urlEncodedParser, function(req, res){

  var data = new Object();
  var error = null;
  data.user = new User();

  var userId = Number(req.query.userId);

  var queries = new promise(function (resolve, reject) {
    
    var query = "SELECT * FROM customers WHERE id = "+userId;
    console.log(query);
    popnrest_db.query(query, function (err, rows, fields) {
      if (!err) {
        if (Number(rows.length) > 0) {

          var row = rows[0];

          data.user.id = row.id;
          data.user.uid = row.uid;
          data.user.firstname = row.firstname;
          data.user.lastname = row.lastname;
          data.user.phoneNumber = row.phoneNumber;
          data.user.email = row.email;
          data.user.role = "user";
          
          resolve();
        }else{
          error = new Error("The user is not found in the database");
          reject();
        } 
      }else{
        reject();
      }
    });
  }).then(function () {
    res.status(200).json(data);
  }).catch(function () {
    res.status(401).json({
      stack: error.stack,
      message: error.message
    });
  });
});

router.post("/firstname/update", auth, urlEncodedParser, function (req, res) {

  var data = new Object();
  var error = null;

  var firstname = req.body.firstname;
  var userId = Number(req.body.userId);

  var queries = new promise(function (resolve, reject) {

    var query = "UPDATE customers SET "
    +"firstname = \""+firstname+"\" "
    +"WHERE id = "+userId;
    console.log(query);
    popnrest_db.query(query, function (err,rows,fields) {
      if(!err){

        data = {
          firstname: firstname,
          success: true,
          message: "Your firstname has been updated"
        }

        resolve();
      }else{
        error = new Error("Error while updating user's firstname");
        reject();
      }
    });
  }).then(function () {
    res.status(200).json(data);
  }).catch(function () {
    res.status(401).json({
      stack: error.stack,
      message: error.message
    });
  });
});

router.post("/lastname/update", auth, urlEncodedParser, function (req, res) {

  var data = new Object();
  var error = null;

  var lastname = req.body.lastname;
  var userId = Number(req.body.userId);

  var queries = new promise(function (resolve, reject) {

    var query = "UPDATE customers SET "
    +"lastname = \""+lastname+"\" "
    +"WHERE id = "+userId;
    console.log(query);
    popnrest_db.query(query, function (err,rows,fields) {
      if(!err){

        data = {
          lastname: lastname,
          success: true,
          message: "Your lastname has been updated"
        }

        resolve();
      }else{
        error = new Error("Error while updating user's lastname");
        reject();
      }
    });
  }).then(function () {
    res.status(200).json(data);
  }).catch(function () {
    res.status(401).json({
      stack: error.stack,
      message: error.message
    });
  });
});

router.post("/phoneNumber/update", auth, urlEncodedParser, function (req, res) {

  var data = new Object();
  var error = null;

  var phoneNumber = req.body.phoneNumber;
  var userId = Number(req.body.userId);

  var queries = new promise(function (resolve, reject) {

    var query = "UPDATE customers SET "
    +"phoneNumber = \""+phoneNumber+"\" "
    +"WHERE id = "+userId;
    console.log(query);
    popnrest_db.query(query, function (err,rows,fields) {
      if(!err){

        data = {
          phoneNumber: phoneNumber,
          success: true,
          message: "Your phone number has been updated"
        }

        resolve();
      }else{
        error = new Error("Error while updating user's phone number");
        reject();
      }
    });
  }).then(function () {
    res.status(200).json(data);
  }).catch(function () {
    res.status(401).json({
      stack: error.stack,
      message: error.message
    });
  });
});

router.post("/email/update", auth, urlEncodedParser, function (req, res) {

  var data = new Object();
  var error = null;

  var email = req.body.email;
  var userId = Number(req.body.userId);

  var queries = new promise(function (resolve, reject) {

    var query = "UPDATE customers SET "
    +"email = \""+email+"\" "
    +"WHERE id = "+userId;
    console.log(query);
    popnrest_db.query(query, function (err,rows,fields) {
      if(!err){

        data = {
          email: email,
          success: true,
          message: "Your email has been updated"
        }

        resolve();
      }else{
        error = new Error("Error while updating user's email");
        reject();
      }
    });
  }).then(function () {
    res.status(200).json(data);
  }).catch(function () {
    res.status(401).json({
      stack: error.stack,
      message: error.message
    });
  });
});
    
router.get("/bookings", auth, urlEncodedParser, function (req, res) {

  var data = new Object();
  var error = null;

  data.bookings = [];
  data.upcoming_bookings = [];
  data.past_bookings = [];

  var userId = Number(req.query.userId);

  var queries = new promise(function (resolve, reject) {

    var query = "SELECT email FROM customers "
    +"WHERE id = "+userId;
    console.log(query);
    popnrest_db.query(query, function (err,rows,fields) {
      if(!err){

        data.email = rows[0].email;

        resolve();
      }else{
        error = new Error("Error while getting user's email");
        reject();
      }
    });

  }).then(function(){
    return new promise(function(resolve,reject){

      console.log("OpenCart DBB");
      console.log(opencart_db);

      // user.email = "simondv@hotmail.com";
      // user.email = "yoann@popnrest.com";
      // user.email = "jared@appfly.com";
      // user.email = "susan.peowrie@gmail.com";
      // user.email = "akintish@hmail.com";

      // Retrieving previous bookings from OpenCart database
      var query = "SELECT oc_order.order_id, oc_order.total, oc_product.model "
      +"FROM oc_order, oc_order_product, oc_product "
      +"WHERE oc_order.order_id = oc_order_product.order_id "
      +"AND oc_order_product.product_id = oc_product.product_id "
      +"AND order_status_id = 5 "
      // +"AND email = \""+data.email+"\"";
      +"AND email = \"yoann@popnrest.com\"";
      console.log(query);
      opencart_db.query(query, function (err,rows,fields) {
        if(!err){
          if(Number(rows.length) > 0){

            for(var i in rows){

              var row = rows[i];

              var booking = new Booking();
              booking.id = row.order_id;
              booking.location = row.model.charAt(0).toUpperCase() + row.model.slice(1);
              booking.price = "£" + row.total;
              data.bookings.push(booking);
            }

          }
          resolve();
        }else{
          error = new Error("Error while getting previous bookings from OpenCart database");
          reject();
        }
      });

    });
  }).then(function () {
      return new promise(function (resolve, reject) {

        if(Number(data.bookings.length) > 0){

          var query = "SELECT * FROM oc_order_option " 
          +"WHERE ( ";
          for(var i in data.bookings){
            if(i > 0) {
              query += "OR ";
            }
            query += "order_id = " + data.bookings[i].id + " ";
          }
          query += ")";
          console.log(query);
          opencart_db.query(query, function (err, rows, fields) {
            if(!err){
              if(Number(rows.length) > 0){

                for(var i in rows){

                  var row = rows[i];

                  for(var b in data.bookings){
                    if(data.bookings[b].id == row.order_id){

                      switch (row.name) {
                        case "Duration":
                          data.bookings[b].duration = row.value;
                        break;
                        case "Time":
                          data.bookings[b].time_sql = row.value;
                          // data.bookings[b].time = row.value;
                          data.bookings[b].time = dateFormater(
                            DATE_NOW_SQL + " " + row.value,
                            "shortTime"
                          );
                        break;
                        case "Date":
                          data.bookings[b].date = dateFormater(
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
            }else{
              error = new Error("Error while getting previous bookings from OpenCart database [step2]");
              reject();
            }
          });
        } else {
          resolve();
        }
      });
    })
  .then(function () {
    return new promise(function (resolve, reject){

      for(var i in data.bookings){

        var diff = timediff(DATE_NOW_SQL,data.bookings[i].date_sql,"D").days;
        data.bookings[i].from_today = diff;

        if(diff < 0){
          data.past_bookings.push(data.bookings[i]);
        }else{
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
  }).then(function(){
    res.status(200).json(data);
  }).catch(function(){
    res.status(401).json({
      stack: error.stack,
      message: error.message
    });
  });
});

module.exports = router;