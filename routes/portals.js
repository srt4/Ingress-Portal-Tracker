var Mongo = require('../lib/mongo');

/*

TODO: this controller reads from the mongo
Server.js periodically updates the mongo.

    */

exports.findAll = function(req, res) {
    getJsonFromMongo({}, res);
};

exports.findByUser = function(req, res) {
    var user = req.params.id;
    // todo not working
};

exports.findByFaction = function(req, res) {
    var faction = req.params.id;

    getJsonFromMongo(
        {
            team: faction
        },
        res
    );
};

exports.findAllBounded = function(req, res) {
    var lat = parseFloat(req.params.lat, 10);
    var lon = parseFloat(req.params.lon, 10);
    var radius = parseFloat(req.params.radius, 10);

    var filter =             {
        latitude: {
            $gte: lat - radius,
            $lte: lat + radius
        },
        longitude: {
            $gte: lon - radius,
            $lte: lon + radius
        }
    };

    console.log(JSON.stringify(filter));

    Mongo.getDb().collection('portals', function(err, collection) {
        collection.find(
            {
                latitude: {
                    $gte: lat - radius,
                    $lte: lat + radius
                },
                longitude: {
                    $gte: lon - radius,
                    $lte: lon + radius
                }
            }
        ).toArray(function(err, items){
                res.send(items);
        });
    });
};

exports.findByLevelGt = function(req, res) {
    //todo
    var levelGt = req.params.id;
};

exports.findByLevelLt = function(req, res) {
    //todo
    var levelLt = req.params.id;
};

var getJsonFromMongo = function(filter, response) {
    Mongo.writePortalsWithFilterToResponse(filter, response);
};