var Mongo = require('./lib/mongo'),
    config = require("./config.json"),
    Player = require('./lib/player');

Array.prototype.unique = function() {
    var o = {}, i, l = this.length, r = [];
    for(i=0; i<l;i+=1) o[this[i]] = this[i];
    for(i in o) r.push(o[i]);
    return r;
};


/**
 *
 * @return {Array} guids found
 */
var findAllUserGuids = function() {
    var guids = [];

    Mongo.getDb().collection("portals", function(err, collection){
        collection.find({}, {capturingPlayerId: 1}).toArray(function(err, items){
            guids.push(items.capturingPlayerId);

            items.forEach(function(item){
                if(item.capturingPlayerId !== undefined) {
                    guids.push(item.capturingPlayerId);
                }
            });

            collection.find({}, {"mods.installingUser": 1}).toArray(function(err, items){
                items.forEach(function(item){
                    if (item.mods !== undefined && item.mods.installingUser !== undefined) {
                        guids.push(item.mods.installingUser);
                    }
                });
                collection.find({}, {"resonators.ownerGuid": 1}).toArray(function(err, items){
                    items.forEach(function(item){
                        if (item.resonators !== undefined && item.resonators.ownerGuid !== undefined){
                            guids.push(item.resonators.ownerGuid);
                        }
                    });

                    console.log(guids.unique().length);

                    var uniqueGuids = guids.unique();
                    var notFoundGuids = [];
                    var i = 0;
                    var j = 0;
                    uniqueGuids.forEach(function(guid){
                        Mongo.getDb().collection("players", function(err, collection){
                            collection.find({guid: guid}
                            ).toArray(function(err, items){
                                    var notFound = true;
                                    j++;

                                    items.forEach(function(player){
                                        console.log(player);
                                        notFound = false;
                                        i++;
                                    });

                                    if (notFound && guid !== undefined) {
                                        notFoundGuids.push(guid);
                                    }

                                    console.log("DONE >> " + i + " / " + uniqueGuids.length);
                                    console.log(notFoundGuids);

                                    if(j == uniqueGuids.length){
                                        console.log("PROCESSED ALL");
                                        (function(){
                                            Player.fetchAll(
                                                uniqueGuids,
                                                function(data) {
                                                    data.forEach(function(player) {
                                                        Mongo.savePlayer(player);
                                                    })
                                                }
                                            );
                                        })();
                                    }
                            })
                        });
                    });


                });
            });
        });
    });
};


findAllUserGuids();

