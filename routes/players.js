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