var Portal = require("./lib/portal");
var Mongo = require('./lib/mongo');
var config = require("./config.json");
var irc = require('irc');
var httpServer = require('http');


var foundPortals = {};

function getPortals() {
	if(config.debug) {
		console.log("Fetching portals...");
	}

    console.log(Mongo);

	Portal.fetchAll(null, null, function(portals){
		portals.forEach(function(portal){
			foundPortals[portal.getId()] = portal;

			if(config.debug && false) {
				console.log("ID: " + portal.getId());
				console.log("NAME: " + portal.getName());
				console.log("ADDRESS: " + portal.getAddress());
			}

            var teamColor;
			switch(portal.getTeam()) {
				case "enlightened":
					teamColor = "green_bg";
					break;
				case "resistance":
					teamColor = "blue_bg";
					break;
				default:
					teamColor = "white_bg";
					break;
			}

			if (config.debug && false) {
				console.log("TEAM: " + portal.getTeam());
				console.log("MODS: ");

				portal.getMods().forEach(function(mod){
					console.log(" - Name: " + mod.getName() + ", Rarity: " + mod.getRarity());
				});

				console.log("RESONATORS: ");
				portal.getResonators().forEach(function(resonator){
					console.log(" - Level: " + resonator.getLevel() + ", Energy: " + resonator.getEnergyTotal() + " (" + resonator.getEnergyPercentage() + "%)");
				});

				console.log("\n-----------------------------------------------------------------------------------\n");
			}
		});
        Mongo.populateDb(foundPortals);
    });

}


httpServer.createServer(function(request,response){
	response.writeHeader(200, {"Content-Type": "text/plain"});

	for (var portalId in foundPortals) {
        // so as to not look up internal properties
		if(foundPortals.hasOwnProperty(portalId)) {
            var portal = foundPortals[portalId];
            response.write(JSON.stringify(portal));
        }
	}

	response.end();
}).listen(8080);


setInterval(function(){
	//getPortals();
}, config.server.refreshInterval);

//getPortals();

Mongo.getAllPortals();
