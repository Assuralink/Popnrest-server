
    // set up ========================
	var express = require('express');
	var app = express();
	var http = require('http');
	var https = require('https');
	var eyes = require('eyes');
	var fs = require('fs');
	var path = require('path');
	var dateFormat = require('dateformat');
	
    var morgan = require('morgan'); // log requests to the console (express4)
   
	const url = require('url');
	
	var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
	var urlEncodedParser = bodyParser.urlencoded({ extended: false });
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
	var hbs = require('express-hbs'); 
	var session = require('express-session');
	var promise = require('promise');
	var cookieParser = require('cookie-parser');


	const passport = require('passport');
	const CustomStrategy = require('passport-custom');

	app.use(passport.initialize());
	app.use(passport.session());



	var mysql = require('mysql');

	var firebase = require('firebase');

	var firebaseConfig = {
		apiKey: "AIzaSyBuKWh2PUzTVXlyWXMjuSbuQb2D-tnyFRc",
		authDomain: "popnrest.firebaseapp.com",
		databaseURL: "https://popnrest.firebaseio.com",
		projectId: "popnrest",
		storageBucket: "popnrest.appspot.com",
		messagingSenderId: "571497874947",
		appId: "1:571497874947:web:ebffc0ea30dcba89b07036",
		measurementId: "G-8F16M46FZC"
	};
	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);
	


	



	// HANDLEBARS
	app.engine('hbs', hbs.express4({
	  partialsDir: __dirname + '/views/partials',
	  defaultLayout: __dirname + '/views/layouts/main.hbs'
	}));
	app.set('view engine', 'hbs');
	app.set('views', __dirname + '/views');
	
	// var port = process.env.PORT;
	
	// LOCAL
	var URL_SITE = "http://127.0.0.1:8080";
	var connection = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "",
		database: "opencart",
		multipleStatements: true
	});
	var port = 8080;

	// TEST CONNEXION MySQL
	connection.connect(function(err) {
		if (err) {
			console.log('error connecting: ' + err.stack);
			return;
		}
		console.log('connected as id ' + connection.threadId);
	});
	

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});
	  
	app.use(session({ 
		secret: 'popnrest',
		saveUninitialized : false,
		resave : true,
		cookie: { maxAge: 60000 }
	}));

	var server = http.createServer(app);

	app.use("/css", express.static(__dirname + "/css"));
	app.use("/js", express.static(__dirname + "/js"));
	app.use("/images", express.static(__dirname + "/images"));
	app.use("/fonts", express.static(__dirname + "/fonts"));
	app.use("/lang", express.static(__dirname + "/lang"));
	app.use("/favicon", express.static(__dirname + "/favicon"));
	app.use("/sitemap", express.static(__dirname + "/sitemap.xml"));
	app.use("/robots", express.static(__dirname + "/robots.txt"));
	app.use("/robots.txt", express.static(__dirname + "/robots.txt"));
	app.use("/fonts", express.static(__dirname + "/fonts"));
	
	app.use(cookieParser());
	app.use(bodyParser.json());

	function Data(){
		this.statut = false;
		this.erreur = [];
	}

	function Customer(){
		this.id = 0;
		this.fistname = "";
		this.lastname = "";
		this.email = "";
		this.phone_number = "";
		this.bookings = [];
	}



	// AUTHENTIFICATION
	passport.use('Authentification_Customer', new CustomStrategy(
		function(req, callback) {

			console.log(">>> Authentification Customer");
  
			var user = {}
		
			var queries = new promise(function(resolve,reject){	

				firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
				.then((userCredential) => {
					
					// Signed in 
					var firebase_user = userCredential.user;
					console.log("USER");
					console.log(user);

					user.id = firebase_user.uid;
					user.email = firebase_user.email;
					user.role = "customer";

					resolve();
				})
				.catch((error) => {

					var errorCode = error.code;
					var errorMessage = error.message;
					console.log(errorCode+" : "+errorMessage);

					reject();
				});	

			}).then(function(){
				callback(null, user);
			}).catch(function(){
				callback(null);
			});
		}
	));

	passport.serializeUser(function(user, done){
		console.log("Serialize");
		console.log(user);
		return done(null, user);
	});

	passport.deserializeUser(function(user, done){
		console.log("Deserialize");
		console.log(user);
		return done(null, user);
	});









	app.get("/", function(req,res){
		var data = {
			pageTitle: "Pop & Rest",
			page_description: "description customer"
		}
		res.redirect("/customers/login");
	});


	app.post("/customers/login", urlEncodedParser, function(req,res){
		
		var data = new Data();

		var queries = new promise(function(resolve,reject){

			passport.authenticate('Authentification_Customer', function(error, user, info){
				if(!error){				
					if(user){
						req.logIn(user, function(err){
							if(err){
								console.log("ERR : "+err);
								reject();
							}else{
								console.log("LOGGED IN");
								console.log("is Auth :: "+req.isAuthenticated());
								console.log(req.user);

								resolve();
							}
						});	
					}else{
						reject();
					}
				}else{
					reject();
				}	
			})(req, res);

		}).then(function(){
			data.statut = true;
			res.json(data);
		}).catch(function(){
			data.statut = false;
			res.json(data);
		});
	});

	function isAuthenticated_Customer(req,res,next){

		console.log("req");
		console.log(req);

		console.log(">> is Auth ?");
		console.log(req.isAuthenticated());

		if(!req.isAuthenticated()){
			console.log("NOT AUTH");
			res.redirect("/customers/login");
		}else{
			console.log("AUTH");
			console.log(req.user);
			if(req.user.role == "customer"){
				console.log("OK");
				next();
			}else{
				res.redirect("/customers/login");
			}
		}
	}
	
	app.get("/customers/login", function(req,res){
		var data = {
			pageTitle: "Pop & Rest • Login",
			page_description: "Login description"
		}
		res.render("customer_login", data);
	});

	


	app.get("/customers/dashboard", function(req,res){

		console.log("CUSTOMER DASH");
		console.log(req.user);
		console.log(req.isAuthenticated());

		var data = {
			pageTitle: "Pop & Rest • Customer Dashboard",
			page_description: "Customer dashboard description"
		}
		res.render("customer_dashboard", data);
	});




	app.post("/customers/bookings/upcoming", function(req,res){

		var data = new Data();

		data.bookings = [
			{
				id: 1,
				date: "01/03/2020"
			},
			{
				id: 2,
				date: "01/04/2020"
			}
		]

		// data.customer = new Customer();
		
		var queries = new promise(function(resolve,reject){
			
			resolve();

		}).then(function(){
			data.statut = true;
			res.json(data);
		}).catch(function(){
			data.statut = false;
			res.json(data);
		});
	});


	server.listen(port);