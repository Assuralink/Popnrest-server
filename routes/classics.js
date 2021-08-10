const express = require('express');
const router = express.Router();
const promise = require("promise");

router.get("/", function(req,res){
  var data = new Object();

  data.theme_mode = "journey_mode";

  res.render("homepage", data);
});

module.exports = router;