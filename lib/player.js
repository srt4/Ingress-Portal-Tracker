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

    var options = {
        host: 'www.ingress.com',
        path: '/rpc/dashboard.getPlayersByGuids',
        method: 'POST',
        headers: {
            'DEBUG': 'True',
            'X-CSRFToken': csrf,
            'X-Requested-With': 'XMLHttpRequest',
            'Cookie':'csrftoken=' + csrf + '; ACSID=AJKiYcEDyl9tXcQeH32PIKvX96tK6G5CE2ZNmVqO8HraZdkDsMRjSau3CqLVJvIKY41D2w-jW4OJBDvKkjqxk78kSfH0o7YDvQ8009xKPeRQ9_7NJrhXgABPojVgRLW6GVgXOGfdFXUt42XPBYwycpEJFfbHbCUuQDW7xJUhWnW4gmzvK1mClLyZO-fsiJtugesPNlMeefkY1ed19dva6JQKxEG0lRvDRDGtQgzUpgXWJtVI5wu6SKW625gZ7F2d20rn-HDFHsXV-uxx3U0_UgupX4elj8xhn0sxtq-wsus0H7cIOslEBNsaXnuC8I51Dgnmk1Pbd5AwIwkQtj4kNfpUoZbfSgBi9C-DDpCeRG_h58tQCo_qOjDs7ogWIE81TYH_I8Xn3kr_g7AbrwhoFt_aPs7rrXYCGTGwZHDU0DapYqnUTYVxixkSkr_oZvX4qYdusoekqDdrgjyz-Tojx23KxXQ3TCeTXVLAl6V0dCt6RAY-atzTikAgpRq1nExiMzc_DqwvtdU0rX1B5Y7jNPSOA72pkqodNOuJ1xCKfMvXh8ptQZLtSEmgsP75pR5mQ_TTeyOL_M4db0i18aQNdO58jz4qy6BtdA; ingress.intelmap.lat=47.75777688825797; ingress.intelmap.lng=-122.15244226782227; ingress.intelmap.zoom=13; __utma=24037858.297433716.1356420570.1357215536.1357216473.18; __utmb=24037858.15.9.1357247575837; __utmc=24037858; __utmz=24037858.1356420570.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)'
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