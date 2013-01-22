var portal = require('./portal');
var Mongo = require('./mongo');

exports.acceptPayload = function(req, res) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');


    var url = req.param('url', null);
    var data = req.param('data', null);

    console.log(url);

    switch(url) {
        case "/rpc/dashboard.getThinnedEntitiesV2":
            portal.processPayload(data, null);
            break;
        default:
            console.log("Nothing to process; URL was " + url);
            break;
    }
};