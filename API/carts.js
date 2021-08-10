const express = require('express');
const router = express.Router();
const promise = require("promise");
var dateFormater = require("dateformat");
const moment = require('moment');

var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({
  parameterLimit: 1000000000,
  limit: "50mb",
  extended: true,
});

const auth = require("../middleware/auth");

const popnrest_db = require('../databases/popnrest');

router.get("/details", (req,res,next) => {

    console.log("----------- GET CART DETAILS ---------");

    var data = new Object();
    var error = null;

    var cartId = req.query.cartId;
    
    var queries = new promise(function (resolve, reject) {

        var query = "SELECT *, IF(NOW() > fromDate, true, false) as expired, bookings.id as bookingId "
        +"FROM bookings, properties "
        +"WHERE bookings.propertyId = properties.id "
        +"AND LOWER(identifier) = \""+cartId.toLowerCase()+"\"";
        console.log(query);
        popnrest_db.query(query, function (err,rows,fields) {
            if(!err){
                if(Number(rows.length) > 0){

                    var row = rows[0];

                    data.bookingId = row.bookingId;

                    data.propertyId = row.propertyId;
                    data.title = row.title;
                    data.address = row.address;
                    data.postcode = row.postcode;
                    data.town = row.town;
                    data.country = "United Kingdom";

                    data.fromDate = dateFormater(new Date(row.fromDate), "dd/mm/yyyy")+" "+dateFormater(new Date(row.fromDate), "HH:MM");
                    data.toDate = dateFormater(new Date(row.fromDate), "dd/mm/yyyy")+" "+dateFormater(new Date(row.fromDate), "HH:MM");
                    data.durationString = row.duration+"min";
                    data.price = row.price;
                    data.vat = row.vat;
                    data.total = row.total;

                    data.expired = row.expired;

                    resolve();
                }else{
                    error = new Error('Error when trying to get cart details');
                    reject();
                }
            }else{
                reject();
            }
        });

    }).then(function(){
        return new promise(function(resolve,reject){

            data.promotional_code = null;

            var query = "SELECT * "
            +"FROM bookings, bookings_applied_promotions, properties_promotional_codes "
            +"WHERE bookings.id = bookings_applied_promotions.bookingId "
            +"AND bookings_applied_promotions.promotional_code_id = properties_promotional_codes.id "
            +"AND bookings.id = "+data.bookingId;   
            console.log(query);
            popnrest_db.query(query, function (err,rows,fields) {
                if(!err){
                    if(Number(rows.length) > 0){

                        var row = rows[0];
                        
                        var old_total = data.total + row.reduction;

                        data.promotional_code = {
                            code: row.code,
                            reduction: "£"+row.reduction,
                            old_total: "£"+old_total,
                            new_total: "£"+data.total
                        }
                        
                    }
                    resolve();
                }else{
                    reject();
                }
            });

        });
    }).then(function(){
        return new promise(function(resolve, reject){

            data.images = [];

            var query = "SELECT * FROM properties_images "
            +"WHERE propertyId = "+data.propertyId;
            console.log(query);
            popnrest_db.query(query, function (err,rows,fields) {
                if(!err){
                    if(Number(rows.length) > 0){
                        for(var i in rows){

                            var row = rows[i];

                            var isFirst = false;
                            if(i == 0){
                                isFirst = true;
                            }

                            data.images.push({
                                name: row.name,
                                url: row.url,
                                first: isFirst
                            });

                        }
                    }
                    resolve();
                }else{
                    reject();
                }
            });

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

router.post("/confirm_payment", urlEncodedParser, function (req, res) {

    console.log(">> Confirm Cart Payment");
    
    var data = new Object();
    var error = null;

    var cartId = req.body.cartId;
    var providerId = Number(req.body.providerId);
    var external_id = req.body.external_id;
    var amount = Number(req.body.amount);

    var queries = new promise(function (resolve, reject) {

        var query = "SELECT * FROM bookings "
        +"WHERE LOWER(identifier) = \""+cartId.toLowerCase()+"\"";
        console.log(query);
        popnrest_db.query(query, function (err,rows,fields) {
            if(!err){
                if(Number(rows.length) > 0){

                    data.bookingId = rows[0].id;

                    resolve();
                }else{
                   error = new Error("Cart ID is not found");
                   reject();
               }
            }else{
                reject();
            }
        });

    }).then(function(){
        return new promise(function(resolve,reject){

            var query = "UPDATE bookings SET "
            +"statusId = 2 "
            +"WHERE id = "+data.bookingId;
            console.log(query);
            popnrest_db.query(query, function (err,rows,fields) {
                if(!err){
                    resolve();
                }else{
                    reject();
                }
            });

        });
    }).then(function(){
        return new promise(function(resolve,reject){

            var query = "INSERT INTO bookings_payments (bookingId,paymentProviderId,external_id,amount,date_added) VALUES ("
                +data.bookingId+", "
                +providerId+", "
                +"\""+external_id+"\", "
                +amount+", "
                +"NOW()"
            +")";
            console.log(query);
            popnrest_db.query(query, function (err,rows,fields) {
                if(!err){
                    resolve();
                }else{
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