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