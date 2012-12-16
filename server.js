var Portal = require("./lib/portal");

function getPortals() {
	Portal.fetchAll(null, null, function(portals){
		portals.forEach(function(portal){
			console.log("NAME: " + portal.getName());
			console.log("ADDRESS: " + portal.getAddress());
			console.log("TEAM: " + portal.getTeam());
			console.log("MODS: \n", portal.getMods());
			console.log("RESONATORS: \n", portal.getResonators());
			console.log("\n\n");
		});
	});
}

getPortals();