var express = require("express");
var app = express();
var mon = require("mongodb");
var mongo = mon.MongoClient;
var mongourl = require('./mongourl');

var port = process.env.PORT || 8080;

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
        mongo.connect(mongourl.url, function(err, db) {
            if (err) throw console.error(err);

            var collection = db.collection('url');

            collection.find({
                "original_url": url
            }).toArray(function(err, doc) {
                if (err) return console.error(err);

                if (doc.length > 0) {
                    res.status(200).json({ original_url: doc[0].original_url, short_url: req.headers.host + '/' + doc[0]._id });

                    db.close();
                    return;
                }

                collection.insertOne({ original_url: url }, function(err, ins) {
                    if (err) return console.error(err);

                    if (ins.insertedCount > 0) {
                        res.status(200).json({ original_url: url, short_url: req.headers.host + '/' + ins.insertedId });

                        db.close();
                        return;
                    }
                });
            });
        });
    }

});

app.get("/:url", function(req, res) {
    // used to redirect to shortened url
    var urlArg = req.params.url;
    if (req.params.url.length === 24) {

        mongo.connect(mongourl.url, function(err, db) {
            if (err) throw console.error(err);

            var collection = db.collection('url');

            collection.find({
                _id: new mon.ObjectId(req.params.url)
            }).toArray(function(err, doc) {
                if (doc.length > 0) {
                    res.status(200).redirect(doc[0].original_url);

                    db.close();
                    return;
                } else {
                    res.redirect('/new/');

                    db.close();
                    return;
                }
            });
        });
    } else {
        res.redirect('/new/');
    }
});


var server = app.listen(port, function() {
    //console.log( 'app is up' );
});

module.exports = server;

// project https://little-url.herokuapp.com/