global class OrgMockHttpResponseGenerator {
	 // -----------------------------------------------------------------------
  // respond Method
  // - Create a fake respond to simulate the request to Salesforce to get 
  // the organization Session Id
  // -----------------------------------------------------------------------
  global HTTPResponse respond(HTTPRequest req) {
      // Create a fake response
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'text/xml;charset=UTF-8');
        res.setHeader('SOAPAction', '""');
        res.setBody('<Envelope><Body xmlns="http://schemas.xmlsoap.org/soap/' + 
            'envelope/"><loginResponse xmlns="urn:partner.soap.' + 
            'sforce.com"><result xmlns="urn:partner.soap.sforce.com">'+
            '<sessionId xmlns="urn:partner.soap.sforce.com">' + 
            'testSessionId</sessionId></result></loginResponse>' + 
            '</Body></Envelope>');
        res.setStatusCode(200);
        return res;
    }
}