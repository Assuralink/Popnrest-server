const express = require('express');
const router = express.Router();
const promise = require("promise");

var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({
  parameterLimit: 1000000000,
  limit: "50mb",
  extended: true,
});

const stripe = require("stripe")("sk_test_z3fnuvqdJsTc3R1bGjcGBn3000rPPqFsNM");

const popnrest_db = require('../databases/popnrest');

router.post("/stripe/create", urlEncodedParser, function (req, res) {

    console.log(">> Create Stripe Payment");
    
    var data = new Object();
    var error = null;

    var cartId = req.body.cartId;

    var queries = new promise(function (resolve, reject) {

        data.amountToPay = 100;

        resolve();

    }).then(function(){
        return new promise(function(resolve,reject){

            var paymentIntent = stripe.paymentIntents.create({
                amount: data.amountToPay,
                currency: "eur"
            }).then((res) => {
                data.clientSecret = res.client_secret;
                resolve();
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