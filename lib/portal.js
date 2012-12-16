var http = require('http');
var Mod = require('./mod');
var Resonator = require('./resonator');


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

Portal.prototype.getId = function() {
	return this.id;
}
Portal.prototype.setId = function(id) {
	this.id = id;
}

Portal.prototype.getName = function() {
	return this.name;
}
Portal.prototype.setName = function(name) {
	this.name = name;
}

Portal.prototype.getTeam = function() {
	return this.team;
}
Portal.prototype.setTeam = function(team) {
	this.team = team;
}

Portal.prototype.getAddress = function() {
	return this.address;
}
Portal.prototype.setAddress = function(address) {
	this.address = address;
}

Portal.prototype.getImage = function() {
	return this.image;
}
Portal.prototype.setImage = function(image) {
	this.image = image;
}

Portal.prototype.getMods = function() {
	return this.mods;
}
Portal.prototype.addMod = function(mod) {
	this.mods.push(mod);
}

Portal.prototype.getResonators = function() {
	return this.resonators;
}
Portal.prototype.addResonator = function(resonators) {
	this.resonators.push(resonators);
}

Portal.prototype.getLocation = function() {
	return {latitude: this.latitude, longitude: this.longitude};
}
Portal.prototype.setLocation = function(latitude, longitude) {
	this.latitude = latitude;
	this.longitude = longitude;
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
	if (data.imageByUrl !== undefined) {
		portal.setImage(data.imageByUrl.imageUrl);
	}
	portal.setTeam(data.controllingTeam !== undefined && data.controllingTeam.team !== undefined ? data.controllingTeam.team : "Nobody");
	
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
	
	//console.log("\n\nPortal: ", data , "\n\n\n");
	
	return portal;
}

Portal.fetchAll = function(latitude, longitude, callback) {
	//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
	var options = {
		host:   'www.ingress.com',
		//host:   'www.google.com',
		path:   '/rpc/dashboard.getThinnedEntitiesV2',
		method: 'POST',
		headers: {
			'X-CSRFToken': 'IE39DpyPiwpA0z18m9WzupVDB9qWnhCR',
			'X-Requested-With': 'XMLHttpRequest',
			'Cookie': 'csrftoken=IE39DpyPiwpA0z18m9WzupVDB9qWnhCR; ACSID=AJKiYcETxSlv80cJoAWKF7eKMq4pxObe5EAmiI1rUKiblI8s1kzxXrkJ1TQ5Jw9WHLnX22lD7t5sGFQNpqR_o85JsgmS3hCzyh4umixnbL4YVyLK68LBpsru3bV_PRTlOjotQbkgtQrB_9jUFFQo9c3L4k9xjPxriIN7YY43V74fxwN7mGn7d0h5FuqH10-gMakYmPTp8BvX1VgXKE-PSddN-WAHFgZ1DgI9EzKDcTp7w9BSgh7xwo4zRH3SvZk60QqmjdOgLulqGFMlFNHfqRWHLCSCvq1rBx1TZkHdAuxpj0Kcjnaub0GfLbnGM-Dh-5V0PQ4-KufVOD0lhL3YUu1PwGaNxzuSIolbK84DT9_nrD7JQiZichWNAZLMOle_Q9GR5O51xC5GMiq2xHeQslxE6zjtRevPQ9RztsDVC0-_wFE91Ls0dmncg-Ht4227-lX4Umv61o09x9BkPiGxQS_EMWaxL4cvZkO2_T0ZClHhYmbb9WVqY5I_ZAnLsOia0dnysDsNJyglW00lgC5rJfGWQPQKVvxGnXp7hgTDN23EeK88WR4SIGfot-5m9YygIi3z8-VXuCJm; ingress.intelmap.lat=51.44990005494227; ingress.intelmap.lng=-1.29638671875; ingress.intelmap.zoom=6; __utma=24037858.2033149229.1355337972.1355583187.1355690799.5; __utmb=24037858.15.6.1355690812442; __utmc=24037858; __utmz=24037858.1355337972.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided)'
		},
		agent: false
	};
	
	//ID
	var id = "00313131211";
	
	//Post body
	var postBody = {
		"minLevelOfDetail": -1,
		"boundsParamsList": [
			{"id":id,"minLatE6":51399206,"minLngE6":-1054687,"maxLatE6":51618017,"maxLngE6":-703125,"qk":"00313131301"}//,
			//{"id":id,"minLatE6":51399206,"minLngE6":-1757812,"maxLatE6":51618017,"maxLngE6":-1406250,"qk":"00313131211"}
		],
		"method":"dashboard.getThinnedEntitiesV2"
	}
	
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
//			console.log("FULL RESPONSE!!! ", json.result.map[id].gameEntities[0]);
			
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
	
}


module.exports = Portal;