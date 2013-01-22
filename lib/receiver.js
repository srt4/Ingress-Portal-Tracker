exports.acceptPayload = function(req, res) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');


    var url = req.param('url', null);
    var data = req.param('data', null);

    console.log(url);
};