const express = require('express');
const router = express.Router();
const promise = require("promise");
const popnrest_db = require('../databases/popnrest');
const moment = require('moment');
const financial = require('../tools/financial');

const User = require('../models/users');


router.get("/id/:cart_identifier", (req,res,next) => {

    console.log("Searching for cart ID :: "+req.params.cart_identifier);

    var data = new Object();
    var error = null;

    var cart_identifier = req.params.cart_identifier;
    data.cartId = cart_identifier;
    
    var queries = new promise(function (resolve, reject) {

        var query = "SELECT * FROM bookings, properties "
        +"WHERE bookings.propertyId = properties.id "
        +"AND LOWER(identifier) = \""+cart_identifier.toLowerCase()+"\"";
        console.log(query);
        popnrest_db.query(query, function (err,rows,fields) {
            if(!err){
                if(Number(rows.length) > 0){

                    var row = rows[0];

                    data.propertyId = row.propertyId;
                    data.propertyName = row.name.toLowerCase();
                    data.title = row.title;
                    data.address = row.address;
                    data.postcode = row.postcode;
                    data.town = row.town;
                    data.country = "United Kingdom";

                    data.startingDate = moment(row.fromDate).format("YYYY-MM-DD");
                    data.startingTime =  moment(row.fromDate).format("HH:mm");
                    data.duration = row.duration;
                    data.endingTime = moment(row.toDate).format("YYYY-MM-DD HH:mm");

                    data.statusId = row.statusId;

                    data.total = financial(row.total);

                    data.user = new User();
                    data.user.id = row.customerId;

                    data.userNotAuth = false;
                    if(data.user.id == 0){
                        data.userNotAuth = true;
                    }
        
                    var a = moment(data.startingDate+" "+data.startingTime);
                    var b = moment(data.startingDate+" 19:00");
                    var diffNight = a.diff(b, "minutes");

                    // Check if the booking is EXPIRED
                    data.expired = false;
                    var diffExpired = moment(data.startingDate+" "+data.startingTime).isAfter();
                    if(
                        !diffExpired &&
                        data.statusId == 0
                    ){
                        data.expired = true;
                    }

                    // Check if booking is PAID
                    data.paid = false;
                    if(data.statusId == 2){
                        data.paid = true;
                    }
                    
                    data.journeyType = false;
                    data.theme_mode = "night_mode";
                    if(diffNight <= 0){
                        data.journeyType = true;
                        data.theme_mode = "journey_mode";
                    }

                    resolve();
                }else{
                    reject();
                }
            }else{
                reject();
            }
        });

    }).then(function(){
        return new promise(function(resolve,reject){

            if(data.user.id > 0){

                var query = "SELECT * FROM customers "
                +"WHERE id = "+data.user.id;
                console.log(query);
                popnrest_db.query(query, function (err,rows,fields) {
                    if(!err){
                        if(Number(rows.length) > 0){

                            var row = rows[0];

                            data.user.firstname = row.firstname;
                            data.user.lastname = row.lastname;
                            data.user.email = row.email;
                            data.user.phoneNumber = row.phoneNumber;
                            data.user.uid = row.uid;
                        
                            resolve();
                        }else{
                            error = new Error("User not found in database");
                            reject();
                        }
                    }else{
                        reject();
                    }
                });

            }else{
                resolve();
            }

        });
    }).then(function(){

        if(
            !data.paid && // Booking is not paid yet
            !data.expired // Booking is not expired
        ){
            res.render("cart", data);
        }else{
            res.render("cart_status", data);
        }

    }).catch(function () {
        res.render("cart_404");
    });
});



module.exports = router;