var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var path = require('path');
var config = require('config');
var Serializer = require('../classes/KeyboardSerializer');
var AWS = require('aws-sdk');
//handles serializer routes

router.use('/:keyboard/:target', function(req, res) {
  	var ref = new firebase(config.get('firebase.databaseURL'));
    var emojiConfig = config.get('emoji');
    var target = req.params.target;
    var keyboardId = req.params.keyboard;
    var keySerial = new Serializer(ref, keyboardId, emojiConfig);
    var jsonConfig = config.get('emoji-keyboards');

    AWS.config.region = config.get('emoji.s3.region');
    var s3bucket = new AWS.S3({params: {Bucket: config.get('emoji.s3.bucket')}});

    var out = "";
    var outObj = {"results": [1,2]};
    var i = 0;

    //set target to blank if prod
    if (target == "production") {
        target = "";
    } else {
        target += "/";
    }

    for (var manifest in jsonConfig) {
      var lpPromise = new Promise(function(resolve, reject) {
        // skip loop if the property is from prototype
        //if (!jsonConfig.hasOwnProperty(manifest)) continue;
        var lcManifest = manifest;
        var manifestConfig = jsonConfig[lcManifest];

        //console.log("LINE25");
        //console.log(lcManifest);
        keySerial.serialize(manifestConfig['class'], function(val) {
            //console.log(lcManifest);
            //console.log("VAL 28");
            var fileName = jsonConfig[lcManifest]['endpoint'];
            fileName = fileName.replace(':keyboard', keySerial.keyboardName.toLowerCase()).replace(':target/', target);
            console.log("LINE 46");
            var params = {
              Key: fileName,
              ContentType: 'application/json',
              Body: JSON.stringify(val),
              ACL: 'public-read',
              CacheControl: 'max-age=300'
            };
            
            var s3Promise = new Promise(function(resolve, reject) {
                s3bucket.upload(params, function(err, data) {
                    console.log("S3 SUCCESS")
                    console.log(data);
                  resolve(data);
                if(err) {
                  reject(err);
                }
                
              });
            });

            s3Promise.then(
                function(result){
                    console.log("79");
                    resolve(result);
                }, function(err) {
                    console.log("ERR");
                    console.log(err);
                    reject(err);
            });
            //res.send(outObj);
        }, function(err) {
            reject(err);
        });
      });

      lpPromise.then(function (result) {
        console.log("SUCCESS LINE 37:");
        //console.log(result.manifest);
        //console.log(result.value);
        outObj.results.append(3);
        console.log(outObj["results"]);
        //res.send(outObj);
      }, function (err) {
        console.log("ERROR");
        console.log(err);
      });
    }
	 
   Promise.all([lpPromise]).then(function(result) {
    console.log("ALMOSTREAD");
    console.log(outObj);

    res.send(outObj);
    }, function(err){
      console.log("AT ERR");
      callback("ERROR");
    });
    //console.log("48");

});

module.exports = router;