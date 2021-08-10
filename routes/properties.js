const express = require('express');
const router = express.Router();
const promise = require("promise");
const popnrest_db = require('../databases/popnrest');

router.get("/:property_name", (req,res,next) => {

    console.log("Searching for property :: "+req.params.property_name);

    var data = new Object();
    var error = null;

    var property_name = req.params.property_name;
    
    var queries = new promise(function (resolve, reject) {

        var query = "SELECT * FROM properties "
        +"WHERE LOWER(name) = \""+property_name.toLowerCase()+"\"";
        console.log(query);
        popnrest_db.query(query, function (err,rows,fields) {
            if(!err){
                if(Number(rows.length) > 0){

                    var row = rows[0];

                    data.propertyId = row.id;
                    data.title = row.title;
                    data.address = row.address;
                    data.postcode = row.postcode;
                    data.town = row.town;
                    data.country = "United Kingdom"; // TODO

                    console.log(">OK");

                    resolve();
                }else{
                    reject();
                }
            }else{
                reject();
            }
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
        res.render("properties", data);
    }).catch(function () {
        res.render("properties_404");
    });
});
    
module.exports = router;