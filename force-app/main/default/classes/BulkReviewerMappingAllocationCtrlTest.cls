@isTest
private class BulkReviewerMappingAllocationCtrlTest {

    private class UtilityMock implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200);
            res.setBody('["Submitted","In Review","Approved"]');
            return res;
        }
    }

    @isTest
    static void testFetchDataOnLoad() {
        Test.setMock(HttpCalloutMock.class, new UtilityMock());

        Application_Proposal__c p = new Application_Proposal__c(Stage__c = '1st Stage');
        insert p;

        Reviewer__c r = new Reviewer__c(Email__c = 'reviewer@test.com');
        insert r;

        Test.startTest();  

        bulkReviewerMappingAllocationController.dataWrapper w =
            bulkReviewerMappingAllocationController.fetchDataOnLoad();
        
        Test.stopTest();  

        System.assertNotEquals(null, w);
        System.assert(w.proposals.size() > 0);
        System.assert(w.reviewers.size() > 0);
        System.assert(w.proposalStages.size() > 0);
    }

    @isTest
    static void testCreateMapping() {
        Test.setMock(HttpCalloutMock.class, new UtilityMock());

        Application_Proposal__c p = new Application_Proposal__c(Stage__c = '1st Stage');
        insert p;

        Reviewer__c r = new Reviewer__c(Email__c = 'reviewer@test.com');
        insert r;

        Reviewer_Mapping__c rm = new Reviewer_Mapping__c(
            Proposals__c = p.Id,    
            Reviewer__c = r.Id,
            Proposal_Stage__c = '1st Stage'
        );

        Test.startTest();  
        String res = bulkReviewerMappingAllocationController.createMapping(
            new List<Reviewer_Mapping__c>{ rm }
        );
        Test.stopTest(); 
		System.debug('res ===> ' + res);
        System.assertEquals('SUCCESS', res);
        System.assertEquals(1, [SELECT COUNT() FROM Reviewer_Mapping__c]);
    }
}