var Portal = require("./lib/portal"),
    Mongo = require('./lib/mongo'),
    config = require("./config.json"),
    express = require('express'),
    fs = require('fs'),
    portals = require('./routes/portals'),
    receiver = require('./lib/receiver'),
    players = require('./routes/players'),
    path = require('path');

var app = express();

var logFile = fs.createWriteStream('./access.log', {
    flags: 'a'
});


app.configure(function () {
    app.use(express.logger({stream: logFile}));
    if(config.debug) {
        app.use(express.logger('dev'));
    }
    app.use(express.bodyParser());
    app.engine('.html', require('jade').__express);
    app.use(express.static(path.join(__dirname, 'public')));
});

// add routes
app.post('/data/add', receiver.acceptPayload)
app.post('/portals/filter', portals.findWithFilter);
app.get('/portals', portals.findAll);
app.get('/portals/:lat/:lon/:radius', portals.findAllBounded);
app.get('/portals/lite/:lat/:lon/:radius', portals.liteFindAllBounded);
app.get('/portals/user/:id', portals.findByUser);
app.get('/portals/faction/:id', portals.findByFaction);
app.get('/portals/lvlgt/:id', portals.findByLevelGt);
app.get('/portals/lvllt/:id', portals.findByLevelLt);
app.get('/player', players.findAllPlayers);
app.get('/players', players.findAll); // TODO merge with /player route
app.get('/player/:name', players.findPlayer);


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
		});
        Mongo.populateDb(foundPortals);
    });

}


if (config.fetchOnStart){
    getPortals();
}
