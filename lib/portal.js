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
		var latitude = parseInt(data.locationE6.latE6) / 100000;
		var longitude = parseInt(data.locationE6.lngE6) / 100000;
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

	var options = {
		host:   'www.ingress.com',
		path:   '/rpc/dashboard.getThinnedEntitiesV2',
		method: 'POST',
		headers: {
			'DEBUG': 'True',
			'X-CSRFToken': csrf,
			'X-Requested-With': 'XMLHttpRequest',
            'Cookie':'csrftoken=' + csrf + '; ACSID=AJKiYcEDyl9tXcQeH32PIKvX96tK6G5CE2ZNmVqO8HraZdkDsMRjSau3CqLVJvIKY41D2w-jW4OJBDvKkjqxk78kSfH0o7YDvQ8009xKPeRQ9_7NJrhXgABPojVgRLW6GVgXOGfdFXUt42XPBYwycpEJFfbHbCUuQDW7xJUhWnW4gmzvK1mClLyZO-fsiJtugesPNlMeefkY1ed19dva6JQKxEG0lRvDRDGtQgzUpgXWJtVI5wu6SKW625gZ7F2d20rn-HDFHsXV-uxx3U0_UgupX4elj8xhn0sxtq-wsus0H7cIOslEBNsaXnuC8I51Dgnmk1Pbd5AwIwkQtj4kNfpUoZbfSgBi9C-DDpCeRG_h58tQCo_qOjDs7ogWIE81TYH_I8Xn3kr_g7AbrwhoFt_aPs7rrXYCGTGwZHDU0DapYqnUTYVxixkSkr_oZvX4qYdusoekqDdrgjyz-Tojx23KxXQ3TCeTXVLAl6V0dCt6RAY-atzTikAgpRq1nExiMzc_DqwvtdU0rX1B5Y7jNPSOA72pkqodNOuJ1xCKfMvXh8ptQZLtSEmgsP75pR5mQ_TTeyOL_M4db0i18aQNdO58jz4qy6BtdA; ingress.intelmap.lat=47.75777688825797; ingress.intelmap.lng=-122.15244226782227; ingress.intelmap.zoom=13; __utma=24037858.297433716.1356420570.1357215536.1357216473.18; __utmb=24037858.15.9.1357247575837; __utmc=24037858; __utmz=24037858.1356420570.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)'
		},
		agent: false
	};
	
	//ID
	var id = "00512300303";
	
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
	
	postBody = JSON.stringify(postBody);

	//Create request
	var request = http.request(options, function(response) {
		
		var body = '';

		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function (chunk) {
			body += chunk;
		});

		//the whole response has been recieved, so we just print it out here
		response.on('end', function () {
			var json = JSON.parse(body);

			var portals = [];
			
			json.result.map[id].gameEntities.forEach(function(portalData){
				if (portalData[2].locationE6 !== undefined) {
					portals.push(Portal.createFromResponseData(portalData));
				}
			});
			
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
    return {latitude: this.latitude, longitude: this.longitude};
};

Portal.prototype.setLocation = function(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
};

module.exports = Portal;
