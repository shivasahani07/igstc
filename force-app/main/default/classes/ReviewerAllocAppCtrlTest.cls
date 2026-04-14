@isTest
private class ReviewerAllocAppCtrlTest {
    
    private class MockHttpResponse implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setBody('{"status":"success"}');
            res.setStatusCode(200);
            return res;
        }
    }
    
    @isTest 
    static void testGetOnloadData() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());
        
        YealyCall__c yearRecord = new YealyCall__c(Year__c = '2025');
        insert yearRecord;
        
        Campaign camp = new Campaign(Name = 'Test Campaign');
        insert camp;
        
        Application_Proposal__c proposal = new Application_Proposal__c(
            Campaign__c = camp.Id,
            Proposal_Stages__c = 'Submitted',
            Stage__c = '1st Stage'
        );
        insert proposal;
        
        Test.startTest();
        reviewerAllocationApllicationController.DataWrapper result = reviewerAllocationApllicationController.getOnloadData();
        Test.stopTest();
    
      
    }
}