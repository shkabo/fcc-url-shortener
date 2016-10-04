var request = require( "supertest" );


describe( 'URL shortener microservices', function() {
    var server;
    beforeEach( function() {
        delete require.cache[ require.resolve( '../server' ) ];
        server = require( '../server' );
    } );
    afterEach( function( done ) {
        server.close( done );
    } );

    describe( '/new/ route tests', function() {
        it( 'Valid new link', function( done ) {
            request( server )
                .get( '/new/http://www.google.com' )
                .expect( "http://www.google.com", done );
        } );

        it( 'test 200 for valid link', function( done ) {
            request( server )
                .get( '/new/http://www.google.com' )
                .expect( 200, done );
        } );

        it( 'bad url fail', function( done ) {
            request( server )
                .get( '/new/google.com' )
                .expect( {
                    "error": "Wrong url format. Make sure you have a valid protocol and real site."
                }, done );
        } );

        it( 'test 404 for bad link', function( done ) {
            request( server )
                .get( '/new/google.com' )
                .expect( 404, done );
        } );

    } );

    describe( 'Shortened url route tests', function() {
        it( 'valid shortened url', function( done ) {
            request( server )
                .get( '/1' )
                .expect( 302, done );
        } );

        it( 'bad shortened url', function( done ) {
            request( server )
                .get( '/000000002' )
                .expect( 404, done );
        } );
    } );
} );