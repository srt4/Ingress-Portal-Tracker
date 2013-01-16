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

exports.liteFindAllBounded = function(req, res) {
    var lat = parseFloat(req.params.lat, 10);
    var lon = parseFloat(req.params.lon, 10);
    var radius = parseFloat(req.params.radius, 10);

    var filter = {
        latitude: {
            $gte: lat - radius,
            $lte: lat + radius
        },
        longitude: {
            $gte: lon - radius,
            $lte: lon + radius
        }
    };

    var projection = {
        latitude: 1,
        longitude: 1,
        team: 1,
        capturingPlayerId: 1,
        address: 1,
        name: 1
    };

    Mongo.getDb().collection('portals', function(err, collection){
        collection.find(
            filter,
            projection
        ).toArray(function(err, items){
            res.send(items);
        });
    })
};

exports.findWithFilter = function(req, res) {
    var filter = req.param('filter', null);

    Mongo.getDb().collection('portals', function(err, collection){
        collection.find(filter).toArray(function(err, items){
            res.send(items);
        });
    });
};

exports.findAllBounded = function(req, res) {
    var lat = parseFloat(req.params.lat, 10);
    var lon = parseFloat(req.params.lon, 10);
    var radius = parseFloat(req.params.radius, 10);

    var filter = {
        latitude: {
            $gte: lat - radius,
            $lte: lat + radius
        },
        longitude: {
            $gte: lon - radius,
            $lte: lon + radius
        }
    };

    Mongo.getDb().collection('portals', function(err, collection) {
        collection.find(filter).toArray(function(err, items){
                res.send(items);
        });
    });
};

exports.findByLevelGt = function(req, res) {
    //todo
    var levelGt = req.params.id;

    var filter = {
        "resonators.level": {
            $not: {
                "$gte": levelGt
            }
        }
    };

    Mongo.getDb().collection('portals', function(err, collection){
        collection.find(filter).toArray(function(err, items){
            res.send(items);
        });
    });
};

exports.findByLevelLt = function(req, res) {
    //todo
    var levelLt = req.params.id;
};

var getJsonFromMongo = function(filter, response) {
    Mongo.writePortalsWithFilterToResponse(filter, response);
};