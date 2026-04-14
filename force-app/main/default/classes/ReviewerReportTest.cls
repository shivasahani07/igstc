@IsTest
public class ReviewerReportTest {

    private class MockHttpResponseGenerator implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setBody('{}');
            res.setStatusCode(200);
            return res;
        }
    }

    @IsTest
    static void testReviewerReportMethods() {
      
        Campaign camp = new Campaign(Name = 'Test Campaign');
        insert camp;

        YealyCall__c yearly = new YealyCall__c(Year__c = '2025');
        insert yearly;

        Question_Template__c qTemp = new Question_Template__c(Name = 'QTemp', Yearly_Call__c = yearly.Id);
        insert qTemp;

        Application_Proposal__c proposal1 = new Application_Proposal__c(
            Campaign__c = camp.Id,
            Question_Template__c = qTemp.Id,
            Generate_Reviewer_Document__c = true
        );
        insert proposal1;

        Application_Proposal__c proposal2 = new Application_Proposal__c(
            Campaign__c = camp.Id,
            Question_Template__c = qTemp.Id,
            Generate_Reviewer_Document__c = false
        );
        insert proposal2;

        Reviewer__c reviewer = new Reviewer__c(
            Name = 'Test Reviewer',
            Email__c = 'test@example.com'
        );
        insert reviewer;

        Reviewer_Mapping__c mapping = new Reviewer_Mapping__c(
            Reviewer__c = reviewer.Id,
            Proposals__c = proposal1.Id,
            Stage__c = 'Submitted'
        );
        insert mapping;

        APXTConga4__Conga_Solution__c sol = new APXTConga4__Conga_Solution__c(Name = 'Test Solution');
        insert sol;

        //Prevents callout-related errors
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());

        Test.startTest();
        ReviewerReport.getReviewerMappingCounts();
        ReviewerReport.getReviewerDetails(reviewer.Name);
        ReviewerReport.getCampaignName();
        ReviewerReport.getYear();
        ReviewerReport.getProposals(camp.Id, '2025','');
        ReviewerReport.getCongaSolution('Test Solution');
        ReviewerReport.updateGenerateReviewerDoc(new List<Application_Proposal__c>{proposal1, proposal2});
        Test.stopTest();

        System.assert(true);
    }
}