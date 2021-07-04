const express = require('express');
const router = express.Router();

router.get("/login", (req,res,next) => {
    console.log(' ---> Routes to /login');
    res.render("user_login");
});

router.get("/account", (req,res,next) => {
  res.render("user_account");
});
router.get("/booking-log", (req,res,next) => {
  res.render("user_bookingLog");
});
    
module.exports = router;