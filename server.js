var express = require( "express" );
var app = express();
var mongo = require("mongodb").MongoClient;
var mongourl = require('./mongourl');

var port = process.env.PORT || 8080;


function urlExists(url) {
    mongo.connect(mongourl.url, function(err, db) {
        if (err) return console.error(err);
        db.collection('url').find({
            "original_url" : url
        }).toArray(function(err, doc) {
            if (err) return console.error(err);
            db.close();
            return doc;
        });
    });
}

app.get( "/new/:url(*)", function( req, res ) {
    // used to shorten url and return json data
    var url = req.params.url;
    // check if we have http/https
    if ( url.indexOf( 'http://' ) === -1 && url.indexOf( 'https://' ) === -1 ) {
        res.status( 404 )
            .send( {
                "error": "Wrong url format. Make sure you have a valid protocol and real site."
            } );

    } else {
        //check if url exists in db
        res.status( 200 ).send( url );
    }

} );

app.get( "/:url", function( req, res ) {
    // used to redirect to shortened url
    res.send( req.params.url );
} );


var server = app.listen( port, function() {
    //console.log( 'app is up' );
} );

module.exports = server;

// project https://little-url.herokuapp.com/