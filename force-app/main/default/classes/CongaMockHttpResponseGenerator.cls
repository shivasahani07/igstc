global class CongaMockHttpResponseGenerator implements HttpCalloutMock {

    // -----------------------------------------------------------------------
    // respond Method
    // - Create a fake respond to simulate the request to Conga
    // -----------------------------------------------------------------------
    global HTTPResponse respond(HTTPRequest req) {
        // Create a fake response
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'text/xml;charset=UTF-8');
        res.setBody('<body></body>/012345678900000000');
        res.setStatusCode(200);
        return res;
    }
}