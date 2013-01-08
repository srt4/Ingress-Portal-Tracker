var config = require("../config.json");
var portals = require('./portal');
var mongo = require('mongodb');


function Mongo() {

}

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server(config.mongo.host, config.mongo.port, {auto_reconnect: true});
db = new Db(config.mongo.dbName, server);

db.open(function(err, db){
   if(!err) {
       if(config.debug) {
           console.log("Connected to mongo");
       }
   }
});

Mongo.populateDb = function(data) {
    if(config.debug) {
        console.log("Writing portals to the db");
    }

    console.log(data);

    db.collection('portals', function(err, collection) {
       var mongoData = Mongo.sanitizeKeys(data);

       collection.insert(mongoData, {safe:true}, function (err, result) {
           if(err) {
               console.error("ERROR >> " + err);
           } else {
               if(config.debug) {
                   console.log("Insert to db completed.");
               }
           }
       });
    });
};

Mongo.getAllPortals = function() {
    db.collection('portals', function(err, collection){
        collection.find().toArray(function(err, items) {
            console.error(JSON.stringify(items));
        });
    })
};

Mongo.sanitizeKeys = function(data) {
    var newData = [];
    var toRemove = ["."];

    for(var key in data) {
        if (data.hasOwnProperty(key)) {
            var newKey = key;
            toRemove.forEach(function(sanitize){
                if (key.indexOf(sanitize)) {
                    newKey = newKey.replace(sanitize, "");
                }
            });

            newData.push(data[key]);
        }
    }

    return newData;
};

module.exports = Mongo;