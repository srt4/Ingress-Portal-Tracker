var http = require('http');
var config = require('../config.json');

function Player() {
    this.guid = '';
    this.name = '';
}

Player.createFromResponseData = function(responseData) {
    var player = new Player();
    player.setGuid(responseData.guid);
    player.setName(responseData.nickname);
    return player;
};

Player.fetchAll = function(guids, callback) {
    var csrf = config.api.csrf;
    var acsid = config.api.ascid;

    var options = {
        host: 'www.ingress.com',
        path: '/rpc/dashboard.getPlayersByGuids',
        method: 'POST',
        headers: {
            'X-CSRFToken': csrf,
            'X-Requested-With': 'XMLHttpRequest',
            'Cookie':'csrftoken=iiDmWnb3JI5aAOQsjEJfJ3Cycn3jRjRT; ingress.intelmap.lat=48.76450132370874; ingress.intelmap.lng=-122.68472728210453; ingress.intelmap.zoom=10; ACSID=AJKiYcEdAP9K8dDhbaZMcD1fFczKdlKGJkbq3DD5asIgzy9kmlpCnGjHH911_dKMZGSKtYGNEMyTZsc3xQs7eduKVYpdTlHDiTuoEdfEY7VJR008c4HkOTdqtbkGBAmRmpF44nLFFste2EoVWU1pm4oczHqYTd2OkGlKAfiVwAUW0mBVh0eqlcdWQfaR7WOiAZVod5pKOlC9qnEtS9aZwNsxpzOSQR9MyTWfQbAxSK3rn9k0QGKa_QHK4w2QUUexU53XyYVHyey5DL6MeUyliXHO1B6X-hsdXn2_fIwK7Gr_A4xvv58MLc27W4NlbjNvrFanvl4EuuGZXBFpYQ9ZxGRcnVgSFEzolicxTj2kxKRL3o9vDvDaum-xrtTQ4f27_8rBrtSgHAMWVzTftOws9jTM89il8sh01BR3smlvZ8yTZh-X6e96m1LpeEWkxKFPs_E-gN9EiPi4x4HOFKJjnR43_aYMoajiNs9_Stl69QUP2lg1JtMsZ6yvKAe8jS0XRAbz5fSRB460s-oVfh_81wtPXg6-svVzH2hOxiaw4ixpWJ5-vgqQdlEmlCCFyzfmjRqeQSe5Sr73GbPB2pASWvNp5XNce2Kxow; __utma=24037858.297433716.1356420570.1358500934.1358544590.87; __utmb=24037858.200.8.1358547747217; __utmc=24037858; __utmz=24037858.1357381717.24.2.utmcsr=reddit.com|utmccn=(referral)|utmcmd=referral|utmcct=/r/Ingress/'
        },
        agent: false
    };

    var postBody = {
        "guids": guids,
        "method": "dashboard.getPlayersByGuids"
    };

    postBody = JSON.stringify(postBody);

    var request = http.request(options, function(response) {
        var body = '';

        response.on('data', function(chunk){
            body += chunk;
        });

        response.on('end', function () {
            if(config.debug) {
                console.log("Received Response >> " + body);
            }

            var players = [];

            var json = JSON.parse(body);
            if(json.hasOwnProperty("result")) {
                json.result.forEach(function(user) {
                    var player = new Player();
                    player.setGuid(user.guid);
                    player.setName(user.nickname);
                    players.push(player);
                });
            }

            callback(players);
        });
    });

    request.write(postBody);
    request.end();
};

Player.prototype.getGuid = function() {
    return this.guid;
};

Player.prototype.setGuid = function(guid) {
    this.guid = guid;
};

Player.prototype.getName = function() {
    return this.name;
};

Player.prototype.setName = function(name) {
    this.name = name;
};

Player.prototype.saveToMongo = function() {
    // todo
};

module.exports = Player;