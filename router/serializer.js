var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var path = require('path');
var config = require('config');

//handles serializer routes

router.use('/', function(req, res) {
  //console.log(process.env);
  res.send("HELLO WORLD BOW BOW");
  console.log(config.get('firebase'));
});

module.exports = router;