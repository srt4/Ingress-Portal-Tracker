var Mongo = require('../lib/mongo');

exports.findAll = function(req, res) {
    Mongo.getDb().collection('players', function(err, collection){
        collection.find().toArray(function(err, items) {
            var transformedItems = {};
            items.forEach(function(player){
                transformedItems[player.guid] = player.name;
            });
            res.send(transformedItems);
        });
    });
};

exports.findPlayer = function(req, res) {
    var db = Mongo.getDb();

    var findPortalsForPlayer = function(guid) {
        db.collection('portals', function(err, collection){
            collection.find({
                capturingPlayerId: guid
            }).toArray(function(err, items){
                res.render('../views/player.jade', {
                    items: items,
                    name: req.params.name
                })
            });
        });
    };

    // start by getting guid for player
    db.collection('players', function(err, collection) {
        collection.find({
            name: new RegExp(req.params.name, 'i')
        }).toArray(function(err, items){
                var guid = null;
                items.forEach(function(item){
                    guid = item.guid;
                    req.params.name = item.name;
                });

                if(guid !== null) {
                    findPortalsForPlayer(guid);
                } else {
                    res.send(err);
                }
        });
    });
};