var request = require("supertest");


describe('url shortener', function() {
    var server;
    beforeEach( function() {
        delete require.cache[require.resolve('../server')];
        server = require('../server');
    });
    afterEach( function(done) {
        server.close(done);
    });
    
    it('gets new url', function(done) {
        request(server)
            .get('/new/http://some.url')
            .expect("http://some.url", done);
    });
    it('test 200 response', function(done) {
        request(server)
            .get('/new/http://some.url')
            .expect(200, done);
    });
});