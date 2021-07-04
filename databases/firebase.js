
var firebase = require("firebase");

var firebaseConfig = {
  apiKey: "AIzaSyBuKWh2PUzTVXlyWXMjuSbuQb2D-tnyFRc",
  authDomain: "popnrest.firebaseapp.com",
  databaseURL: "https://popnrest.firebaseio.com",
  projectId: "popnrest",
  storageBucket: "popnrest.appspot.com",
  messagingSenderId: "571497874947",
  appId: "1:571497874947:web:ebffc0ea30dcba89b07036",
  measurementId: "G-8F16M46FZC",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

module.exports = firebase;