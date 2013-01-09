var Portal = require("./lib/portal"),
    Mongo = require('./lib/mongo'),
    config = require("./config.json"),
    express = require('express'),
    portals = require('./routes/portals')
    path = require('path');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.static(path.join(__dirname, 'public')));
});

// add routes
app.get('/portals', portals.findAll);
app.get('/portals/user/:id', portals.findByUser);
app.get('/portals/faction/:id', portals.findByFaction);
app.get('/portals/lvlgt/:id', portals.findByLevelGt);
app.get('/portals/lvllt/:id', portals.findByLevelLt);


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
            console.log(portal.latitude);

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

getPortals();

Mongo.getAllPortals();
