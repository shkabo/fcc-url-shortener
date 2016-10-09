var express = require("express");
var app = express();
var mongo = require("mongodb").MongoClient;
var mongourl = require('./mongourl');

var port = process.env.PORT || 8080;


/**
 * check if url exists in mongo db
 * 
 * @param url string
 */
function urlExists(url) {
    mongo.connect(mongourl.url, function(err, db) {
        if (err) return console.error(err);
        db.collection('url').find({
            "original_url": url
        }).toArray(function(err, doc) {
            if (err) return console.error(err);
            db.close();
            return doc;
        });
    });
}

/**
 * add new url to the db
 * 
 * @param url
 */
function addUrl(url, shortId) {
    mongo.connect(mongourl.url, function(err, db) {
        if (err) return console.error(err);

        var collection = db.collection('url');
        collection.insert({
            "original_url": url,
            "shortId": shortId
        }, function(err, data) {
            if (err) throw err;
            db.close();
            return data;
        });
    });
}

/**
 * return max id number from db
 */
function maxShortNum() {
    mongo.connect(mongourl.url, function(err, db) {
        if (err) return console.error(err);

        var collection = db.collection('url');
        return collection.agregate.find().sort({ shortId: -1 }).limit(1);
    });
}

app.get("/new/:url(*)", function(req, res) {
    // used to shorten url and return json data
    var url = req.params.url;
    // check if we have http/https
    if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1) {
        res.status(404)
            .send({
                "error": "Wrong url format. Make sure you have a valid protocol and real site."
            });
    } else {
        //check if url exists in db
        if (urlExists(url) === []) {
            console.log('doesn\'t exist');
        }
        res.status(200).send(url);
    }

});

app.get("/:url", function(req, res) {
    // used to redirect to shortened url
    res.send(req.params.url);
});


var server = app.listen(port, function() {
    //console.log( 'app is up' );
});

module.exports = server;

// project https://little-url.herokuapp.com/