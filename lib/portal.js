var http = require('http');
var Mod = require('./mod');
var Resonator = require('./resonator');
var config = require('../config.json');


function Portal() {
	this.id = '';
	this.name = '';
	this.address = '';
	this.mods = [];
	this.resonators = [];
	this.team = '';
	this.latitude = 0;
	this.longitude = 0;
    this.image = '';
    this.capturingPlayerId = '';
}


Portal.createFromResponseData = function(responseData) {
	var portal = new Portal();
	var data = responseData[2];
	var v2 = data.portalV2;
	portal.setId(responseData[0]);

	if (v2 !== undefined) {
		portal.setName(v2.descriptiveText.TITLE);
		portal.setAddress(v2.descriptiveText.ADDRESS);
	}

    if(data.captured) {
        portal.setCapturingPlayerId(data.captured.capturingPlayerId);
    }

    // See if the portal has an image
	if (data.imageByUrl !== undefined) {
		portal.setImage(data.imageByUrl.imageUrl);
	}

    // Rename Aliens -> Enlightened, and/or test if the portal is uncapped / unknown
	if (data.controllingTeam !== undefined && data.controllingTeam.team !== undefined) {
		var team = data.controllingTeam.team;
		if (team === "ALIENS") {
			portal.setTeam("enlightened");
		} else if (team === "RESISTANCE") {
			portal.setTeam("resistance");
		} else {
			portal.setTeam("none");
		}
	} else {
		portal.setTeam("unknown");
	}

	if (data.locationE6 !== undefined) {
		var latitude = parseInt(data.locationE6.latE6) / 1e6;
		var longitude = parseInt(data.locationE6.lngE6) / 1e6;
		portal.setLocation(latitude, longitude);
	}
	
	//For each mod
	if (v2 !== undefined) {
		v2.linkedModArray.forEach(function(modData){
			if (modData !== null) {
				portal.addMod(Mod.createFromResponseData(modData));
			}
	});
	}
	
	//Resonators
	if (data.resonatorArray !== undefined) {
		data.resonatorArray.resonators.forEach(function(resonatorData){
			if (resonatorData !== null) {
				portal.addResonator(Resonator.createFromResponseData(resonatorData));
			}
		});
	}

	return portal;
};

Portal.fetchAll = function(latitude, longitude, callback) {
    var csrf = config.api.csrf;
    var acsid = config.api.ascid;

	var options = {
		host:   'www.ingress.com',
		path:   '/rpc/dashboard.getThinnedEntitiesV2',
		method: 'POST',
		headers: {
			'X-CSRFToken': csrf,
			'X-Requested-With': 'XMLHttpRequest',
            'Cookie':'csrftoken=iiDmWnb3JI5aAOQsjEJfJ3Cycn3jRjRT; ingress.intelmap.lat=48.76450132370874; ingress.intelmap.lng=-122.68472728210453; ingress.intelmap.zoom=10; ACSID=AJKiYcEdAP9K8dDhbaZMcD1fFczKdlKGJkbq3DD5asIgzy9kmlpCnGjHH911_dKMZGSKtYGNEMyTZsc3xQs7eduKVYpdTlHDiTuoEdfEY7VJR008c4HkOTdqtbkGBAmRmpF44nLFFste2EoVWU1pm4oczHqYTd2OkGlKAfiVwAUW0mBVh0eqlcdWQfaR7WOiAZVod5pKOlC9qnEtS9aZwNsxpzOSQR9MyTWfQbAxSK3rn9k0QGKa_QHK4w2QUUexU53XyYVHyey5DL6MeUyliXHO1B6X-hsdXn2_fIwK7Gr_A4xvv58MLc27W4NlbjNvrFanvl4EuuGZXBFpYQ9ZxGRcnVgSFEzolicxTj2kxKRL3o9vDvDaum-xrtTQ4f27_8rBrtSgHAMWVzTftOws9jTM89il8sh01BR3smlvZ8yTZh-X6e96m1LpeEWkxKFPs_E-gN9EiPi4x4HOFKJjnR43_aYMoajiNs9_Stl69QUP2lg1JtMsZ6yvKAe8jS0XRAbz5fSRB460s-oVfh_81wtPXg6-svVzH2hOxiaw4ixpWJ5-vgqQdlEmlCCFyzfmjRqeQSe5Sr73GbPB2pASWvNp5XNce2Kxow; __utma=24037858.297433716.1356420570.1358500934.1358544590.87; __utmb=24037858.200.8.1358547747217; __utmc=24037858; __utmz=24037858.1357381717.24.2.utmcsr=reddit.com|utmccn=(referral)|utmcmd=referral|utmcct=/r/Ingress/',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11',
            'Host': 'www.ingress.com',
            'Origin': 'http://www.ingress.com',
            'Referer': 'http://www.ingress.com/intel',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'en-US,en;q=0.8',
            'Connection': 'keep-alive',
            'Content-Type': 'application/json; charset=UTF-8'
        },
		agent: false
	};
	
	//ID
	var id = config.api.mapId;
	
	//Post body
    var postBody = {
        "minLevelOfDetail": -1,
        "boundsParamsList":[
            {
                "id": id,
                "minLatE6": config.api.centerLatE6 - config.api.radius,
                "minLngE6": config.api.centerLonE6 - config.api.radius,
                "maxLatE6": config.api.centerLatE6 + config.api.radius,
                "maxLngE6": config.api.centerLonE6 + config.api.radius,
                "qk": id
            }
        ],
        "method":"dashboard.getThinnedEntitiesV2"
    };


    postBody = {
        "minLevelOfDetail":-1,
        "boundsParamsList":[
            {
                "id":"002123013",
                "minLatE6":47040182,
                "minLngE6":-119531250,
                "maxLatE6":47989922,
                "maxLngE6":-118125000,
                "qk":"002123013"
            },
            {
                "id":"002123003",
                "minLatE6":47040182,
                "minLngE6":-122343750,
                "maxLatE6":47989922,
                "maxLngE6":-120937500,
                "qk":"002123003"
            },
            {
                "id":"002122113",
                "minLatE6":47040182,
                "minLngE6":-125156250,
                "maxLatE6":47989922,
                "maxLngE6":-123750000,
                "qk":"002122113"
            }, // Bham
            {
                "id":"002122115",
                         //47040182
                "maxLatE6":48770000,
                "minLatE6":48000000,
                "maxLngE6":-122000000,
                "minLngE6":-124000000
            }

        ],"method":"dashboard.getThinnedEntitiesV2"};
	postBody = JSON.stringify(postBody);

	//Create request
	var request = http.request(options, function(response) {
		
		var body = '';

		//another chunk of data has been received, so append it to `str`
		response.on('data', function (chunk) {
			body += chunk;
		});

		//the whole response has been received, so we just print it out here
		response.on('end', function () {
            if(config.debug) {
                console.log("Received Response >> " + body);
            }

			var json = JSON.parse(body);

            if(config.debug) {
                console.log("Parsed Response >> " + json);
            }

			var portals = [];

            if (json.hasOwnProperty("result") && json.result.hasOwnProperty("map")) {
                for (var mapElem in json.result.map) {
                    if (json.result.map.hasOwnProperty(mapElem)) {
                        json.result.map[mapElem].gameEntities.forEach(function(portalData){
                            if(portalData[2].locationE6 !== undefined) {
                                portals.push(Portal.createFromResponseData(portalData));
                            }
                        });
                    }
                }
            } else {
                console.error("Response came back unreadable >> " + json.error);
            }
			
			callback(portals);
		});
	});

	request.on("error", function(error){
		console.error("Error: ", error.stack);
	});

	//Write post body
	request.write(postBody);
	request.end();
};

Portal.prototype.getId = function() {
    return this.id;
};

Portal.prototype.setId = function(id) {
    this.id = id;
};

Portal.prototype.getName = function() {
    return this.name;
};

Portal.prototype.setName = function(name) {
    this.name = name;
};

Portal.prototype.getTeam = function() {
    return this.team;
};

Portal.prototype.setTeam = function(team) {
    this.team = team;
};

Portal.prototype.getAddress = function() {
    return this.address;
};

Portal.prototype.setAddress = function(address) {
    this.address = address;
};

Portal.prototype.getImage = function() {
    return this.image;
};

Portal.prototype.setImage = function(image) {
    this.image = image;
};

Portal.prototype.getCapturingPlayerId = function() {
    return this.capturingPlayerId;
};

Portal.prototype.setCapturingPlayerId = function(guid) {
    this.capturingPlayerId = guid;
};

Portal.prototype.getMods = function() {
    return this.mods;
};

Portal.prototype.addMod = function(mod) {
    this.mods.push(mod);
};

Portal.prototype.getResonators = function() {
    return this.resonators;
};

Portal.prototype.addResonator = function(resonators) {
    this.resonators.push(resonators);
};

Portal.prototype.getLocation = function() {
    return {
        latitude: this.latitude,
        longitude: this.longitude
    };
};

Portal.prototype.setLocation = function(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
};

module.exports = Portal;
