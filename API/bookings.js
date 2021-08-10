const express = require('express');
const router = express.Router();
const promise = require("promise");
const moment = require('moment');

const popnrest_db = require('../databases/popnrest');

var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({
  parameterLimit: 1000000000,
  limit: "50mb",
  extended: true,
});

router.get('/calculate', urlEncodedParser, function(req,res){

    var data = new Object();
    var error = null;

    console.log("\n ---------- CALCULATE BOOKING PRICE ---------- ");

    var propertyId = req.query.propertyId;
    var date = req.query.date;
    var time = req.query.time;
    var duration = req.query.duration;

    var queries = new promise(function(resolve, reject){

        calculate_bookingPrice(
            propertyId,
            date,
            time,
            duration,
            function(response, err){
                if(!err){
                    data = response;
                    resolve();
                }else{
                    error = err;
                    reject();
                }
            }
        );

    }).then(function(){
        return new promise(function(resolve,reject){

            console.log("Calculate booking datas");
            console.log(data);

            data.is_instant_booking = false;

            var a = moment();
            var b = moment(data.from_datetime_sql);
            var diff = b.diff(a, 'minutes');

            console.log("Diff");
            console.log(diff);

            if(Number(diff) >= 0 && Number(diff) < 10){
                data.is_instant_booking = true;
            }

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

router.post("/add", urlEncodedParser, function (req, res) {

    console.log(" ---------- BOOKINGS - ADD RESERVATION -----------");

    var data = new Object();
    var error = null;
    
    var propertyId = Number(req.body.propertyId);
    var userId = Number(req.body.userId);
    var date = req.body.date;
    var duration = Number(req.body.duration);
    var time = req.body.time;

    var queries = new promise(function (resolve, reject) {

        calculate_bookingPrice(
            propertyId,
            date,
            time,
            duration,
            function(response, err){
                if(!err){

                    console.log(">> Response");
                    console.log(response);

                    data = response;
                    resolve();
                }else{
                    error = err;
                    reject();
                }
            }
        );
  
    }).then(function () {
        return new promise(function (resolve, reject) {

            data.identifier = Math.random().toString(36).substring(7);
            data.vat = data.price * 0.2;
            data.total = data.price + data.vat;
            data.userId = userId;

            var query = "INSERT INTO bookings (identifier,propertyId,roomId,fromDate,toDate,duration,customerId,price,vat,total,statusId) VALUES ("
                +"\""+data.identifier+"\", "
                +"1, "
                +"1, "
                +"\""+data.from_datetime_sql+"\", "
                +"\""+data.to_datetime_sql+"\", "
                +duration+", "
                +userId+", "
                +data.price+","
                +data.vat+","
                +data.total+","
                +"0"
            +")";
            console.log(query);
            popnrest_db.query(query, function (err,rows,fields){
                if(!err){

                    data.bookingId = rows.insertId;
                    data.durationString = duration+" min";
                    data.duration = Number(duration);

                    resolve();
                }else{
                    error = new Error("An error occured when trying to add your reservation, please try later");
                    reject();
                }
            });

        });
    }).then(function () {
        return new promise(function (resolve, reject) {

            var query = "INSERT INTO bookings_state_history (bookingId,statusId,date_added) VALUES ("
                +data.bookingId+", "
                +"0, "
                +"NOW()"
            +")";
            console.log(query);
            popnrest_db.query(query, function (err,rows,fields){
                if(!err){
                    data.stateId = rows.insertId;
                    resolve();
                }else{
                    error = new Error("An error occured when trying to add your reservation, please try later");
                    reject();
                }
            });

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

function calculate_bookingPrice(
    propertyId,
    date,
    time,
    duration,
    callback
){

    var data = new Object();
    var error = null;
    
    var queries = new promise(function(resolve, reject){

        data.from_date_sql = moment(date).format("YYYY-MM-DD");
        console.log("> Date from sql :: "+data.from_date_sql);
        
        data.from_datetime_sql = data.from_date_sql+" "+time;
        console.log("> Datetime from sql :: "+data.from_datetime_sql);

        data.from_hour = moment(data.from_datetime_sql).format('HH');
        console.log('> From hour :: '+data.from_hour);

        data.to_datetime_sql = moment(data.from_datetime_sql).add(duration, 'm').format("YYYY-MM-DD HH:mm");
        console.log("> To :: "+data.to_datetime_sql);


        if(
            data.from_date_sql != "Invalid date" &&
            data.from_datetime_sql != "Invalid date" && 
            data.to_datetime_sql != "Invalid date"
        ){
            resolve();
        }else{
            error = new Error("Invalid date");
            reject();
        }

    }).then(function(){
        return new promise(function(resolve, reject){

            data.journey_rate = 0;
            data.night_rate = 0;

            var query = "SELECT * FROM properties_rates "
            +"WHERE propertyId = "+propertyId;
            console.log(query);
            popnrest_db.query(query, function (err, rows, fields) {
                if(!err){
                    if(Number(rows.length) > 0){

                        var row = rows[0];

                        data.journey_hourly_rate = row.journey_hourly_rate;
                        data.night_hourly_rate = row.night_hourly_rate;
                    
                        resolve();
                    }else{
                        error = new Error("Rates not found for this request");
                        reject();
                    } 
                }else{
                    reject();
                }
            });

        });
    }).then(function(){
        return new promise(function(resolve, reject){

            data.price = 0;
            
            var nb_parts =  duration / 30;

            data.price = nb_parts * data.journey_hourly_rate;

            resolve();

        });
    }).then(function () {
        callback(data,error);
    }).catch(function () {
        callback(data,error);
    });
}

router.post("/promotional/add", urlEncodedParser, function(req,res){

    console.log(" ---------- BOOKINGS - ADD PROMOTIONAL CODE -----------");

    var data = new Object();
    var error = null;
    
    var cartId = req.body.cartId;
    var code = req.body.code;

    var queries = new promise(function(resolve,reject){
        
        var query = "SELECT * FROM bookings "
        +"WHERE identifier = \""+cartId+"\"";
        console.log(query);
        popnrest_db.query(query, function (err, rows, fields) {
            if(!err){
                if(Number(rows.length) > 0){

                    var row = rows[0];

                    data.bookingId = row.id;
                    data.propertyId = row.propertyId;
                    data.price = row.price;
                    data.vat = row.vat;
                    data.total = row.total;

                    resolve();
                }else{
                    error = new Error("This booking not exist");
                    reject();
                } 
            }else{
                reject();
            }
        });

    }).then(function(){
        return new promise(function(resolve, reject){

            var query = "SELECT * FROM properties_promotional_codes "
            +"WHERE code = \""+code+"\" "
            +"AND propertyId = "+data.propertyId;
            console.log(query);
            popnrest_db.query(query, function (err, rows, fields) {
                if(!err){
                    if(Number(rows.length) > 0){

                        var row = rows[0];

                        data.promotional_code_id = row.id;
                        data.promotional_amount = row.amount;
                        data.propertyId = row.propertyId;
                        data.quantity = row.quantity;
                    
                        resolve();
                    }else{
                        error = new Error("This promotional code not exist");
                        reject();
                    } 
                }else{
                    reject();
                }
            });

        });
    }).then(function(){
        return new promise(function(resolve,reject){

            var query = "SELECT * FROM bookings_applied_promotions "
            +"WHERE promotional_code_id = "+data.promotional_code_id;
            console.log(query);
            popnrest_db.query(query, function (err, rows, fields) {
                if(!err){
                    if(Number(rows.length) > 0){

                        data.number_of_use = Number(rows.length);

                        if(
                            data.quantity < data.number_of_use
                        ){
                            resolve();
                        }else{
                            error = new Error("This promotional code's maximal number of use is exceeded");
                            reject();
                        }
                    
                    }else{
                        resolve();
                    } 
                }else{
                    reject();
                }
            });

        });
    }).then(function(){
        return new promise(function(resolve,reject){

            var new_total = data.total - data.promotional_amount;
            
            var new_vat = new_total * 0.2;
            new_vat = Math.round(new_vat * 100)/100;

            var new_price = new_total - new_vat;
            
            data.new_price = new_price;
            data.new_vat = new_vat;
            data.new_total = new_total;

            resolve();

        });
    }).then(function () {
        return new promise(function (resolve, reject) {

            var query = "INSERT INTO bookings_applied_promotions (bookingId,reduction,promotional_code_id,date_added) VALUES ("
                +data.bookingId+", "
                +data.promotional_amount+", "
                +data.promotional_code_id+", "
                +"NOW()"
            +")";
            console.log(query);
            popnrest_db.query(query, function (err,rows,fields){
                if(!err){
                    resolve();
                }else{
                    error = new Error("An error occured when trying to add your promotional code, please try later");
                    reject();
                }
            });

        });
    }).then(function () {
        return new promise(function (resolve, reject) {

            var query = "UPDATE bookings SET "
            +"price = "+data.new_price+", "
            +"vat = "+data.new_vat+", "
            +"total = "+data.new_total+" "
            +"WHERE id = "+data.bookingId;
            console.log(query);
            popnrest_db.query(query, function (err,rows,fields){
                if(!err){
                    resolve();
                }else{
                    error = new Error("An error occured when trying to update your booking, please try later");
                    reject();
                }
            });

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