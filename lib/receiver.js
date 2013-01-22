exports.acceptPayload = function(req, res) {
    console.log(req.param.url);
    console.log(req.param.payload.length);
};