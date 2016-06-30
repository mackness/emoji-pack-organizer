"use strict";
var firebase = require('firebase');

class KeyboardSerializer {
  constructor(fireref, keyboardId, emojiConfig) {
    this.fireref = fireref;
    this.keyboardId = keyboardId;
    this.keyboardName = "";
    this.cacheObj = {};
    this.emojiConfig = (typeof emojiConfig !== "undefined") ? emojiConfig : {};
    this.rootLevel = {
      /*packs must be first*/
      "packs": {
        fbkey: "packs",
        filter: {
          key: "keyboard",
          value: keyboardId
        }
      }, 
      "categories": {
        fbkey: "categories",
        filter: {
          key: "keyboard",
          value: keyboardId
        }
      },
      "emojis": {
        fbkey: "emojis",
        filter: {
          fbkey: "category",
          value: []
        }
      },
      "types": {
        fbkey: "types",
        filter: {
          key: "keyboard",
          value: keyboardId
        }
      },
      "photos": {
        fbkey: "photos"
      },
      "tones": {
        fbkey: "tones"
      },
      /*
      "emojis": {}, 
      "types": {}, 
      "tones": {}*/
    }
  }

  serialize(className, callback) {
    var ks = this;
    var jsonConfObj = require("../"+className);
    //console.log(jsonConfObj);
    var keyboardRef = this.fireref.child("keyboards/"+this.keyboardId);
    keyboardRef.once("value", function(keyboard) {
      //got keyboard
      ks.cacheObj["keyboards"] = keyboard.val();
      ks.keyboardName = ks.cacheObj["keyboards"]["title"];
      /*
        grab data from FB for all root level objects defined in rootLevel
      */      
      
      var categories = Object.keys(ks.cacheObj["keyboards"]["categories"]);
      ks.rootLevel["emojis"]["filter"]["value"] = categories;

      for (var rootLvlName in ks.rootLevel) {
          var lpPromise = new Promise(function(resolve, reject) {
            var rootLvl = ks.rootLevel[rootLvlName];
            var fbref = ks.fireref.child(rootLvl.fbkey);
            
            if (typeof rootLvl.filter !== "undefined") {
              /*
                if the filter value is an array of keys, we'll need to do multiple loops
              */
              if (Array.isArray(rootLvl.filter.value)) {
                fbref.once("value", function(objs) {
                var tmpObs = {};
                var allOjs = objs.val();
                var validEmojisIds = [];
                if (rootLvl.fbkey == 'emojis') {
                  var emojisToPacks = {};
                  for (var packid in ks.cacheObj["packs"]) {
                    var pack = ks.cacheObj["packs"][packid];
                    var emojisIds = pack.emojis;
                    emojisIds = Object.keys(emojisIds);
                    validEmojisIds = validEmojisIds.concat(emojisIds);
                    emojisIds.forEach(function(val, index, arr) {
                      emojisToPacks[val] = packid;
                    });
                  }
                }
                for(var objK in allOjs) {
                   var objs = allOjs[objK];
                   if (typeof objs !== "undefined") {
                    if (rootLvl.filter.value.indexOf(objs[rootLvl.filter.fbkey]) > -1) {
                      //okay found it
                      //if emojis make sure it belongs to a pack
                      if (rootLvl.fbkey == 'emojis') {
                        if (validEmojisIds.indexOf(objK) > -1) {
                          objs["pack"] = emojisToPacks[objK];
                          tmpObs[objK] = objs;
                        }
                      } else {
                        tmpObs[objK] = objs;
                      }
                    }
                   }  
                }
                ks.cacheObj[rootLvl.fbkey] = tmpObs;

                resolve("success");
                }, function(err) {
                  reject(err);
                });

              } else {
                fbref.orderByChild(rootLvl.filter.key).equalTo(rootLvl.filter.value).once("value", function(objs) {
                  ks.cacheObj[rootLvl.fbkey] = objs.val();
                  resolve("success");
                }, function(err) {
                  reject(err);
                });
              }
            } else {
              fbref.once("value", function(objs) {
                ks.cacheObj[rootLvl.fbkey] = objs.val();
                resolve("success");
              }, function(err) {
                reject(err);
              });
            }
          });

        lpPromise.then(function(result) {
          //console.log("lpPromise");
        }, function(err){
          //console.log(err);
        });
      }

      Promise.all([lpPromise]).then(function(result) {
        //fill out values
        //var obj = ks.fillValues(null, {}, jsonConfObj, "keyboards/")
        try {
          var obj = ks.fillValues(jsonConfObj, ks.cacheObj["keyboards"])
          callback(obj);
        } catch (e) {
          console.log(e);
          callback(e);
        }
      }, function(err){
        console.log(err);
        callback("ERROR");
      });

    });
  }

  fillValues(fillInstrs, rootObj) {
    var filledObj = {};
    /* loop thru fillInstrs and fill values for fields */
    for (var field in fillInstrs) {
      //console.log(field);
      if (field == '_expand') continue;
      if (field == '_value') continue;
      if (field == '_aliasAs') continue;
      if (field == '_filter') continue;

      var fieldInstr = fillInstrs[field];
      //console.log(fieldInstr);
      if (typeof fieldInstr === 'object') {
        /*
        The fill instruction is an object
        is it an object or an array. If array we are going to include multiple records
        */
        if (Array.isArray(fieldInstr)) {
          /*
          we need to return mutilple values
          */
          //console.log("148");
          var objKey = field;
          // make sure we can fill the object
          var objsToFillFrom = this.cacheObj[objKey];
          var tmpFillInstrs = fieldInstr[0];
          if (typeof objsToFillFrom !== "undefined") {
            /*
            loop thru out objects value and fill according to tmpFillInstrs
            objsToFillFrom = ['id': {}, 'id': {}]
            */
            var expandedObjs = [];
            //check to see if field contains ids, it does lets filter by ids
            var filter =  tmpFillInstrs['_filter'];
            if (typeof filter !== "undefined") {
              var tmpIds = this.completeFill('fill', rootObj[objKey]);
              if (typeof tmpIds !== "undefined") {
                var filterIdKeys = Object.keys(tmpIds);
                var that = this;
                filterIdKeys.forEach(function(keyId, index, array){
                  var objToFill = that.getObjectByKey(keyId, objsToFillFrom);
                  //if fill instruction is object call fillValues
                  if (typeof tmpFillInstrs === "object") {
                    expandedObjs.push(that.fillValues(tmpFillInstrs, objToFill));
                  } else {
                    expandedObjs.push(that.completeFill(tmpFillInstrs, objToFill));
                  }
                });
              }
            }
            else {
              if (field == "tones") {
                console.log("DOING OTHER");
              }
              for (var toFillId in objsToFillFrom) {
                var objToFill = this.getObjectByKey(toFillId, objsToFillFrom);
                expandedObjs.push(this.fillValues(tmpFillInstrs, objToFill));
              }
            }
            
            var aliasAs = tmpFillInstrs['_aliasAs'];

            if (typeof aliasAs !== "undefined") {
              filledObj[aliasAs] = expandedObjs;
            } else {
              filledObj[field] = expandedObjs;
            }
          }

        } else {
          var aliasAs = fieldInstr['_aliasAs'];
          var expand = fieldInstr['_expand'];
          var valInstr = fieldInstr['_value'];
          if (typeof valInstr !== "undefined") {
            fieldInstr = valInstr;
          }
          /* 
          are we expanding this object?
          */
          if (typeof expand !== "undefined") {
            /*
              we're expanding the object, first check to see if this field contains ids to look up objects against
              the fill instructions is in expand['fields']
            */
            var expandObjName = expand['object'];
            var expandObjFillInstr = expand['fields'];
            //try to see if this field contain ids, but check to see if filter is defined.  If so use that instead of field name
            var filter = fieldInstr['_filter'];
            if (typeof filter !== "undefined") {
              var tmpIds = this.completeFill('fill', rootObj[filter]);
            } else {
              var tmpIds = this.completeFill('fill', rootObj[field]);
            }

            if (typeof tmpIds !== "undefined") {
              var filterIdKeys = Object.keys(tmpIds);
              var objsToFillFrom = this.cacheObj[expandObjName];
              var expandedObjs = [];
              var that = this;
              filterIdKeys.forEach(function(keyId, index, array){
                var objToFill = that.getObjectByKey(keyId, objsToFillFrom);
                //if fill instruction is object call fillValues
                if (typeof expandObjFillInstr === "object") {
                  expandedObjs.push(that.fillValues(expandObjFillInstr, objToFill));
                } else {
                  expandedObjs.push(that.completeFill(expandObjFillInstr, objToFill));
                }
              });
              if (expandedObjs.length == 1) {
                expandedObjs = expandedObjs[0];
              }

              if (typeof aliasAs !== "undefined") {
                filledObj[aliasAs] = expandedObjs;
              } else {
                filledObj[field] = expandedObjs;
              }
            }
          } else {
            //console.log("159");
            //console.log(fieldInstr);
            var val = this.completeFill(fieldInstr, rootObj[field]);
            if (typeof aliasAs !== "undefined") {
              filledObj[aliasAs] = val;
            } else {
              filledObj[field] = val;
            }
          }
        }
      } else {
        //striaght fill
        filledObj[field] = this.completeFill(fieldInstr, rootObj[field])
      }
    }
    return filledObj;
  }

  completeFill(fillInstr, val) {
    
    if (typeof fillInstr === "function") {
      /*
      The fill instruction has a callback
      */
      val = fillInstr(val, this.emojiConfig);
    } 
    return val;

  }

  getObjectByKey(key, objs) {
    var objToFill = objs[key];
    //make id part of obj
    if (typeof objToFill['id'] == "undefined") {
      objToFill['id'] = key;
    }
    return objToFill;
  }
};

module.exports = KeyboardSerializer;