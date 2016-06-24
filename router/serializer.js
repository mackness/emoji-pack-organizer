var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var path = require('path');
var config = require('config');
var Serializer = require('../classes/KeyboardSerializer');
//handles serializer routes

router.use('/:keyboard', function(req, res) {
  	var ref = new firebase(config.get('firebase.databaseURL'));
    var emojiConfig = config.get('emoji');
    var keySerial = new Serializer(ref, req.params.keyboard, emojiConfig);
    var jsonConfig = config.get('emoji-keyboards');
    var out = "";
    var outObj = {};
    var i = 0;

    for (var manifest in jsonConfig) {
      var lpPromise = new Promise(function(resolve, reject) {
        // skip loop if the property is from prototype
        //if (!jsonConfig.hasOwnProperty(manifest)) continue;
        var lcManifest = manifest;
        var manifestConfig = jsonConfig[lcManifest];
        var endpoint = manifestConfig['endpoint'];
        
        //console.log("LINE25");
        //console.log(lcManifest);
        keySerial.serialize(manifestConfig['class'], function(val) {
            //console.log(lcManifest);
            //console.log("VAL 28");
            resolve({"manifest": lcManifest, "value": val});
            //res.send(outObj);
        }, function(err) {
            reject(err);
        });
      });
      lpPromise.then(function (result) {
        //console.log("SUCCESS LINE 37:");
        //console.log(result.manifest);
        //console.log(result.value);
        outObj[result.manifest] = result.value;
        //res.send(outObj);
      }, function (err) {
        console.log("ERROR");
        console.log(err);
      });
    }
	 
   Promise.all([lpPromise]).then(function(result) {
    //console.log("47");
    //console.log(outObj);
    res.send(outObj);
    }, function(err){
      console.log("AT ERR");
      callback("ERROR");
    });
    //console.log("48");

});

module.exports = router;