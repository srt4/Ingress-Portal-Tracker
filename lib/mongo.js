var config = require("../config.json");
var portals = require('./portal');
var mongo = require('mongodb');


function Mongo() {}

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server(config.mongo.host, config.mongo.port, {auto_reconnect: true});
var db = new Db(config.mongo.dbName, server);

db.open(function(err, db){
   if(!err) {
       if(config.debug) {
           console.log("Connected to mongo");
       }
   }
});

Mongo.getDb = function() {
    return db;
};

Mongo.addPortals = function(data) {
    if(config.debug) {
        console.log("Writing portals to the db");
    }

    console.log(data);

    db.collection('portals', function(err, collection) {
       var mongoData = Mongo.sanitizeKeys(data);

       mongoData.forEach(function(mongoDatum) {
           collection.update({id: mongoDatum.id}, mongoDatum, { safe:true, upsert:true },
           function (err, result) {
               if(err) {
                   console.error("ERROR >> " + err);
               } else {
                   if(config.debug) {
                       console.log("Insert to db completed.");
                   }
               }
           })
       });
    });
};

Mongo.savePlayer = function(player) {
    db.collection('players', function(err, collection){
        collection.update({guid: player.guid}, player, { safe:true, upsert:true },
        function(err, result) {
           if(err) {
               console.error("ERROR >> " + err);
           } else {
               if(config.debug) {
                   console.log("Inserted player " + JSON.stringify(player));
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

Mongo.writePortalsWithFilterToResponse = function(filter, response) {
    db.collection('portals', function(err, collection) {
        collection.find(filter).toArray(function(err, items) {
            response.send(items);
        });
    });
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