var Portal = require("./lib/portal"),
    Mongo = require('./lib/mongo'),
    config = require("./config.json"),
    express = require('express'),
    portals = require('routes/portals');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
});

// add routes
app.get('/wines', wine.findAll);
app.get('/wines/:id', wine.findById);
app.post('/wines', wine.addWine);
app.put('/wines/:id', wine.updateWine);
app.delete('/wines/:id', wine.deleteWine);

app.listen(3000);
console.log('Listening on port 3000...');

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


setInterval(function(){
	//getPortals();
}, config.server.refreshInterval);

//getPortals();

Mongo.getAllPortals();
