var express = require("express");
var app = express();

var port = process.env.PORT || 8080;


app.get("/new/:url/\/b(http|https)//\/\*", function(req, res) {
    // used to shorten url and return json data
    var url = req.params;
    res.status(200).send(url);
});

app.get("/:url", function(req, res) {
    // used to redirect to shortened url

});


var server = app.listen(port, function() {
    console.log('app is up');
});

module.exports = server;

// project https://little-url.herokuapp.com/