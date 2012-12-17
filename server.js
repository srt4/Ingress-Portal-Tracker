var Portal = require("./lib/portal");
var Passcode = require("./lib/passcode");
var color = require("ansi-color").set;
var config = require("./config.json");
var irc = require('irc');

var collectedPasscodes = {};
var passcodeOutput = [];

config.passcode.output.forEach(function(output){
	if (output.type === "irc") {
		var client = new irc.Client(
			output.host,
			output.user,
			{
				channels: output.channels,
				port: output.port,
				selfSigned: true,
				secure: output.ssl,
				password: output.password,
				certExpired: true
			}
		);
			
		client.addListener('error', function(message) {
			console.error('ERROR: %s: %s', message.command, message.args.join(' '));
		});
		
		client.addListener('message', function (from, to, message) {
			if (message === "passcode search now") {
				getPasscodes();
			}
			output.channels.forEach(function(channel) {
				client.say(channel, "Fetching any passcodes " + from);
			});
		});
			
		setTimeout(function(){
			output.channels.forEach(function(channel) {
				client.say(channel, "I'm alive!");
			});
		}, 20 * 1000);
		
		passcodeOutput.push({
			type: "irc",
			connection: client
		});

	}	
	
});

function getPasscodes() {
	Passcode.fetchAll(function(passcodes){
		passcodes.forEach(function(passcode){
			console.log("Passcode: " + passcode);
			if (collectedPasscodes[passcode] === undefined) {
				console.log(new Date().getUTCDate() + " - NEW CODE!!!!! " + passcode);
				passcodeOutput.forEach(function(output){
					if (output.type === "irc") {
						output.channels.forEach(function(channel) {
							client.say(channel, "#PASSCODE: " + passcode);
						});
					}
				});
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
setInterval(function(){
	getPasscodes();
}, (config.passcode.interval === undefined ? 30 : config.passcode.interval) * 1000);


setInterval(function(){
	getPortals();
}, 5 * 60 * 1000);
getPortals();