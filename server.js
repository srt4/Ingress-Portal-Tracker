var Portal = require("./lib/portal");
var Passcode = require("./lib/passcode");
var color = require("ansi-color").set;
var config = require("./config.json");

var collectedPasscodes = {};

function getPasscodes() {
	Passcode.fetchAll(function(passcodes){
		passcodes.forEach(function(passcode){
			console.log("Passcode: " + passcode);
			if (collectedPasscodes[passcode] === undefined) {
				console.log(new Date().getUTCDate() + " - NEW CODE!!!!! " + passcode);
			} else {
				collectedPasscodes[passcode] = true;
			}
		});
	});
}

function getPortals() {
	Portal.fetchAll(null, null, function(portals){
		portals.forEach(function(portal){
			console.log("ID: " + portal.getId());
			console.log("NAME: " + portal.getName());
			console.log("ADDRESS: " + portal.getAddress());
			
			var teamColor = "white_bg";
			switch(portal.getTeam()) {
				case "enlightened":
					teamColor = "green_bg";
					break;
				case "resistance":
					teamColor = "blue_bg";
					break;
			}
			console.log("TEAM: " + color(portal.getTeam(), teamColor));
			console.log("MODS: ");
			portal.getMods().forEach(function(mod){
				console.log(" - Name: " + mod.getName() + ", Rarity: " + mod.getRarity());
			});
			console.log("RESONATORS: ");
			portal.getResonators().forEach(function(resonator){
				console.log(" - Level: " + resonator.getLevel() + ", Energy: " + resonator.getEnergyTotal() + " (" + resonator.getEnergyPercentage() + "%)");
			});
			console.log("\n-----------------------------------------------------------------------------------\n");
		});
	});
}

//getPortals();

setInterval(function(){
	getPasscodes();
}, (config.passcode.interval === undefined ? 30 : config.passcode.interval) * 1000);
