@isTest
private class BulkAssignReviewerControllerTest {
    private class MockHttpResponse implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setBody('{"status":"success"}');
            res.setStatusCode(200);
            return res;
        }
    }

    @testSetup
    static void setupData() {
        YealyCall__c year1 = new YealyCall__c(Year__c = '2024');
        YealyCall__c year2 = new YealyCall__c(Year__c = '2025');
        insert new List<YealyCall__c>{year1, year2};
        
        Campaign camp = new Campaign(Name = 'Test Campaign');
        insert camp;
        
        Reviewer__c reviewer = new Reviewer__c(
            Name = 'Test Reviewer',
            Active__c = true,
            Email__c = 'test@test.com',
            Password__c = 'testpass123',
            campaign__c = camp.Id
        );
        insert reviewer;
    }
    
    @isTest
    static void setupEmailTemplate() {
        User adminUser = [SELECT Id FROM User WHERE Profile.Name = 'System Administrator' AND IsActive = true LIMIT 1];
        System.runAs(adminUser) {
            EmailTemplate emailTemplate = new EmailTemplate(
                DeveloperName = 'Allocation_Email_To_Reviewer_Two_Plus_Two',
                Name = 'Allocation Email To Reviewer - Two Plus Two',
                Subject = 'Test Subject',
                HtmlValue = '<html>Dear {Reviewer_Name__c}, Email: {Reviewer_Email__c}, Password: {Reviewer_Password__c}<br/>{Proposal Details}</html>',
                Body = 'Test Body',
                TemplateType = 'text',
                FolderId = UserInfo.getUserId(),
                IsActive = true
            );
            insert emailTemplate;
        }
    }
    
    @isTest
    static void testGetCampaign() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());
        Test.startTest();
        List<Campaign> result = BulkAssignReviewerController.getCampaign();
        Test.stopTest();
        System.assertNotEquals(null, result);
        System.assert(result.size() > 0);
    }
    
    @isTest
    static void testGetCampaignYear() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());
        Test.startTest();
        List<YealyCall__c> result = BulkAssignReviewerController.getCampaignYear();
        Test.stopTest();
        System.assertNotEquals(null, result);
        System.assert(result.size() > 0);
    }
    
    @isTest
    static void testGetReviewer() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());
        Test.startTest();
        List<Reviewer__c> result = BulkAssignReviewerController.getReviewer();
        Test.stopTest();
        System.assertNotEquals(null, result);
        System.assert(result.size() > 0);
    }
    
    @isTest
    static void testCatchName() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());
        Campaign camp = [SELECT Id FROM Campaign LIMIT 1];
        Application_Proposal__c proposal = new Application_Proposal__c(
            Campaign__c = camp.Id,
            Proposal_Stages__c = 'Submitted',
            Title_Of__c = 'Test Proposal'
        );
        insert proposal;

        Test.startTest();
        List<Application_Proposal__c> result = BulkAssignReviewerController.catchName('[' + camp.Id + ']', '[2024]', 'Test Reviewer');
        Test.stopTest();
        System.assertNotEquals(null, result);
    }
    
    @isTest
    static void testGetProposalAndReviewer() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());
        Campaign camp = [SELECT Id FROM Campaign LIMIT 1];
        Reviewer__c reviewer = [SELECT Id FROM Reviewer__c LIMIT 1];
        Application_Proposal__c proposal = new Application_Proposal__c(
            Campaign__c = camp.Id,
            Proposal_Stages__c = 'Under Review',
            Title_Of__c = 'Test Proposal'
        );
        insert proposal;
        Reviewer_Mapping__c mapping = new Reviewer_Mapping__c(
            Proposals__c = proposal.Id,
            Reviewer__c = reviewer.Id,
            isSelected__c = true
        );
        insert mapping;
        
        String campaignJson = JSON.serialize(new List<String>{camp.Id});
        String yearJson = JSON.serialize(new List<String>{'2024'});
        String reviewerJson = JSON.serialize(new List<String>{reviewer.Id});
        
        Test.startTest();
        BulkAssignReviewerController.finalWrapper result = BulkAssignReviewerController.getProposalAndReviewer(campaignJson, yearJson, reviewerJson);
        Test.stopTest();
        System.assertNotEquals(null, result);
        System.assertNotEquals(null, result.allAppWithRM);
    }
    
    @isTest
    static void testGetCampaignReviewerData() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());
        Test.startTest();
        List<Reviewer__c> result = BulkAssignReviewerController.getCampaignReviewerData();
        Test.stopTest();
        System.assertNotEquals(null, result);
    }
    
    @isTest
    static void testGetReviewerActionInsert() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());
        Campaign camp = [SELECT Id FROM Campaign LIMIT 1];
        Reviewer__c reviewer = [SELECT Id FROM Reviewer__c LIMIT 1];
        Application_Proposal__c proposal = new Application_Proposal__c(
            Campaign__c = camp.Id,
            Proposal_Stages__c = 'Under Review',
            Title_Of__c = 'Test Proposal'
        );
        insert proposal;
        Reviewer_Mapping__c mapping = new Reviewer_Mapping__c(
            Proposals__c = proposal.Id,
            Reviewer__c = reviewer.Id,
            isSelected__c = true
        );
        
        Test.startTest();
        String result = BulkAssignReviewerController.getReviewerAction(
            new List<Reviewer_Mapping__c>{mapping},
            new List<Reviewer_Mapping__c>()
        );
        Test.stopTest();
        System.assertEquals('success', result);
    }
    
    @isTest
    static void testGetReviewerActionDelete() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());
        Campaign camp = [SELECT Id FROM Campaign LIMIT 1];
        Reviewer__c reviewer = [SELECT Id FROM Reviewer__c LIMIT 1];
        Application_Proposal__c proposal = new Application_Proposal__c(
            Campaign__c = camp.Id,
            Proposal_Stages__c = 'Under Review',
            Title_Of__c = 'Test Proposal'
        );
        insert proposal;
        Reviewer_Mapping__c mapping = new Reviewer_Mapping__c(
            Proposals__c = proposal.Id,
            Reviewer__c = reviewer.Id,
            isSelected__c = true
        );
        insert mapping;
        
        Test.startTest();
        String resultDelete = BulkAssignReviewerController.getReviewerAction(
            new List<Reviewer_Mapping__c>(),
            new List<Reviewer_Mapping__c>{mapping}
        );
        Test.stopTest();
        System.assertEquals('success', resultDelete);
    }
}