var Portal = require("./lib/portal"),
    Mongo = require('./lib/mongo'),
    config = require("./config.json"),
    express = require('express'),
    Player = require('./lib/player'),
    portals = require('./routes/portals'),
    players = require('./routes/players'),
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
app.get('/players', players.findAll);


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

/*
Player.fetchAll([
 "0664e05899e9472480e1540e27601134.c",
 "da967df8c5d24bd3bf681174a5d48938.c",
 "2d0ff054ab8942ccaf57900b5e53a63d.c",
 "e2d4f4bab5d0401c9d78e007afd18504.c",
 "4e61b8420e814cc09543304e0a7dbc19.c",
 "31df5905273e4f3d96997302235e6296.c",
 "7fefa486bc2f4273848781ed0fd1573e.c",
 "13610a66398044d2b0597b4f6892a269.c",
 "14b107da742d4dbc8190a2d7dfe87d1c.c",
 "16e5add54ead41f0bc8417fdaabbd640.c",
 "6a5781382c09418eacc5382b2ac16575.c",
 "5d7c8fe0da4d46bf9ef23f621bc5b188.c",
 "dda5d06773fe47b198bb0600450863fb.c",
 "2bf16faa4168464e9996148c4bf416ed.c",
 "d3ff65b089894caf9bd54cd54a1753a1.c",
 "c316cd7ad5e449ac86f23f03cd34476e.c",
 "a7947242d35d4f01912bd3d85137a9ac.c",
 "8ba0ccd270e94a5898dd1dd60f70c2f7.c",
 "0e6028635ac14fa6908128d4ea5921d1.c",
 "f2d6ab6f9fb6490db09795795b50350a.c",
 "6bf52799c1864c218bbe45dd7e49187e.c",
 "5ebd096685b54e4381e97037db9f87b5.c",
 "e08cfd3f68a6405d976a1e29d133f98d.c",
 "7fae7a7ed81e44e09ea47463c76a59ef.c",
 "c2855229a57b4d7bb03803d5f678bd17.c",
 "d5debfcc54a447fca40ffece2b731af5.c",
 "9e52f5681d484d689e0842df2af69156.c",
 "41656064fb27483188c23c8331829563.c",
 "1f252df43bd44c6fabbd594e939b9515.c",
 "ca0bc1b3820b4e2597c7abdb5c6a9f7f.c",
 "d4cf7312cb1f407ea03841654ac4bf95.c",
 "3978aaf0ab794a498e44264f0846f8c0.c",
 "3034bb262bce4f8dac96cbe7750dde06.c",
 "344bb23e2ef144978672e8c71b4821ea.c",
 "d11a54a077fb4b6c995697df81766754.c",
 "fccaacc85a8844ff9bde99115b767f70.c",
 "0655c79d46e345fe83eb8f0a2dc69a41.c",
 "6e0116d68745438cbd293aeb781d8944.c",
 "d9d8f1e64bf7470da74968d8e92a82ae.c",
 "1991e39fa5de4aec805510bdbaadc16f.c",
 "1a266b6a90ab4d1d8ead95d0dc19170b.c",
 "7093c5549d3041d7837860cb60136156.c",
 "b58a300e9ca341d9a109d349e8936573.c",
 "c239f7341a7f4a23bc2d5979c40f052f.c",
 "aed713294bf44a07abd7b96c76a274c8.c",
 "16d01b86ae2f4bf490069ce2320da8d0.c",
 "ce509444710d4b0984e714d1e4c1f252.c",
 "8b6d2fb24295498984ba493fc371e7b5.c",
 "a9fcd4cca6bc4197a20c2b44d66d42d4.c",
 "4bcde6b4efbb4b1b8a56eb10e3122195.c",
 "936ba7d63da44cd590cac8081db4d744.c",
 "8e532ff5c55e41ccbefadea46c6dbe3f.c",
 "47d14c1bfa2c4e00a32c19bb71b87f86.c",
 "d1c4e425a78749a6adeef8538126a160.c",
 "0439b6da41ed44a3931e072f382dfb37.c",
 "99a0a381fbdc40dcb7f27f145896c88c.c",
 "d4dcf615a92747219e93fefe7d276007.c",
 "3279ddaa7074476696fb02ecb4a2d4a9.c",
 "91f7cd83636643459216abdf344e6a05.c",
 "3e6eec0dbee549ab8a12d4dbc31364b9.c",
 "5ccce20f90a94067a7b412162cfceb2d.c",
 "4369d190c9d64376b16645e8dd4a11ce.c",
 "0209aa41008746d581e2ebe682ea17da.c",
 "36584f658d904f05b0f931bd7fb0eee3.c",
 "4919cf27865d4005922fff9d99bb5582.c",
 "9644fce5b3b043a8a5bfaa31dde54e1d.c",
 "246e61eb53c5472793e08b59d39d5c75.c",
 "0a7f5c777996436797c7b756bd1604bf.c",
 "a04909235b864bb89cf46556ff2f42cc.c",
 "b9176b9ccb8848a19f6c677085f04c8b.c",
 "b3b00fbfc4204636b60f5a6bfb64efa2.c",
 "02cc060e7e214189871a2e7d4eb5e33f.c",
 "3902c4dbbdb147e9a12b8dcae43da557.c",
 "6d841f01d33a4171afa3ec9b592208f9.c",
 "c40801478a694c7d8bdda797d4d2c130.c",
 "5c65ab57fe104fbb85e1e0c53e1cdb7c.c",
 "e8080e509a204eba9a6d92f880fff6f2.c",
 "5654c805e02f4b7cbb11223d948ca3e6.c",
 "4f641300f0794fecbbc070b75988ea78.c",
 "2acdec7448e0433da4ff660a1bcc3e33.c",
 "9e7875f859c2487d88f452031db7270c.c",
 "0004adcd23454303b5ec60b5abb7f404.c",
 "37fe52c7748f4d268704d8cf6ae66582.c",
 "4e3c03c570c9486e815ebe6c9a4c83ee.c",
 "eef1cc3ab8fe4c7688d49ba2792de0b2.c",
 "4aabdb22e5e8485db7f6d867f327a664.c",
 "644b3c037dd64fd68a52820b9c3dac73.c",
 "38c8b0bdcae843e49d689867e38aa086.c",
 "8eba7197fc9a41489a6c0e9410f6afb3.c",
 "badc9601aa3c4a068e6cbe2f9d0d00d7.c",
 "bf98f642c549487cb299b63817532d20.c",
 "038d11944f8848908be483661df22dbf.c",
 "6568f6da61b440c9b640749910c4a397.c",
 "a2ba57d5faad449d928cbc2fd9dc3a51.c",
 "9ca277156cd840c3b8a6e05a815d94c5.c",
 "d98269becc1147fdb61605216f46284e.c",
 "a8064f4976e2433489ca93330c370dfc.c",
 "72ddfc603f7c41138923c7326d14003b.c",
 "f11ca55ab65a4558a626f81f37741bf6.c",
 "a2d3e0990c834782a5d4590df9cd8559.c",
 "9b8d672eab5948349e80d5f209c54d6c.c",
 "c5f1174680464d8897d52dcd4bb76550.c",
 "dd603a46bae64e058f3f04c3d32bccbb.c",
 "22c9a9c7a4f3457e838b9694cc09c50d.c",
 "42ca9059ff6a446782ce9db2371f7435.c",
 "81049a891d344b4f8aa41c74abf21249.c",
 "38cf46c8f520430cac6cd2596c96323e.c",
 "3f21a57a41374c6f8fadb047099e35ce.c",
 "f609ee0f9a9a410f81be1faa026f3b50.c",
 "87a9c60151e8480995c9a97af08cd996.c",
 "f1a33a3d2a16495f967411c123463ee4.c",
 "2502a2e7eae14f10a4a4789fbc448a49.c",
 "ba31700aafd242a6940225378b6c7759.c",
 "376aecb0cdd54008adc1730b95c51a61.c",
 "591ce9fa35fb40c08b8c5ba8705e109e.c",
 "db19fe16124c4c4ca0029e1e3a0da14f.c",
 "793b4b4338394ac1b2779320f607fbaa.c",
 "9947727c18d34c82bdf89b2c4216bac2.c",
 "ade09fe796654c01b4c470dd78d34b84.c",
 "b965eeb2d83941a7be19e007266e2778.c",
 "4e9abc3d7adb43d89eb6dc3c48b0d0f4.c",
 "25e1e8020ac24895be1e92b13f2eba33.c",
 "be1182f1313d4792a710f48a499f929a.c",
 "150de85df85242d2878b81a145c98562.c",
 "ae9dba2bfe52403bbb383fddda82a484.c",
 "a721307e9ee64d02be72a103d77867d4.c",
 "bf0ef07f1a6f4573bc164f9da8ba5809.c",
 "98f1b39d2f4744e7847f5b6a2406e11d.c",
 "d341f13a2fbe45dc976da6b65e8ce6ee.c",
 "3e59238c3bf4413881a00107809f9db0.c",
 "6c6cfbfc4364409aae9db7e105eedc89.c",
 "5ec3d6803b784ea0b1b967f5cd2cb0ef.c",
 "b30f6d9c0139470c99c5e60cdf73331f.c",
 "65371bbb59df4a1b8dc1e6e2679756e9.c",
 "b498863ce3df459d875f59db150a1b2f.c",
 "606b7721157243a8b7b2c5def23f6f19.c",
 "5e6addcd5fc54481a84591d2ce55a57c.c",
 "7ad6b06979fa433c9c0b4379979782b5.c",
 "c4453539c42747d9b9cc8f1c12746d18.c",
 "cf576eca6c0d41d5b7828731c2a83739.c",
 "8faab76165ba4c788cbb5410db6f6c4c.c",
 "c39630055a0442c6ada4adb8c77a7a13.c",
 "1f5922f41bdd43c190ad2e941a53721c.c",
 "2e2f7ae90b92425ab46f208d36500446.c",
 "d18fee5f5f144951b0a973ecc1f7ea50.c",
 "136ba89a21d74286be0f3ca6c526a7e6.c",
 "080460129fab4803a0055e56331be8d2.c",
 "e717e8fe5674487785363f5e1404ed3e.c",
 "e6a780c0cb284e40842f746c24d088cb.c",
 "107e62bd1a9f47b29d1731a5bfd19e85.c",
 "1aa1651c85d34147bf5b4700bd33d871.c",
 "3a2e3f30bcda4fea89f7c7f5c21c9562.c",
 "0313220ea55849a3aca821f84d33d0c3.c",
 "802b637eab5243ba8aea17aca108e426.c",
 "d8b4f504e66448a4a8a0e30ab0d0ec67.c",
 "e68b79eb3d764e2580d27368bbbd1545.c",
 "5d618cbfe3ec43a0b063be219991b9fc.c",
 "1fe84987c48a46a5acf1a78be859c81d.c",
 "c4095e4280a347e7982dc9570e7b9ff4.c",
 "2f755274af274b3fb7e1fc26dc8aadcb.c",
 "d48803f8350b45a48d2354b8721cd868.c",
 "7ce342fe36fa4e3e90b02284d369d855.c",
 "b5a47511d4534dbb9e544628094d04f2.c",
 "f6ce04b3e1d246b997592b8a1dbed846.c",
 "57887a2f399a48328020b0d5b2408237.c",
 "18320b607a3e4782a195dfaf7646f93a.c",
 "f0c292c1923841869144951786b4ad2b.c",
 "9c8c69e0d33443fba2a6a4d77caa5714.c",
 "61f7f822a95b40aeb4591752d851c112.c",
 "84c3402dcec641aeb8497300b7fc2f0b.c",
 "f98900b288574c758d542fee2950558c.c",
 "c51a926cc1614c1fbc431cf1bbf712b7.c",
 "06b3ab6d878c44f782e6bdc5dd8a3c29.c"
 ]


 ,
function(data) {
   data.forEach(function(player) {
       Mongo.savePlayer(player);
   })
});*/

//getPortals();

//Mongo.getAllPortals();

