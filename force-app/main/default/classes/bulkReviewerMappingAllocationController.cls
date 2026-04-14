public with sharing class bulkReviewerMappingAllocationController {

    public class dataWrapper {
        @AuraEnabled public List<Application_Proposal__c> proposals {get;set;}
        @AuraEnabled public List<Reviewer__c> reviewers {get;set;}
        @AuraEnabled public List<String> proposalStages {get;set;}
    }

    @AuraEnabled
    public static dataWrapper fetchDataOnLoad() {
        dataWrapper wrap = new dataWrapper();
        try {
            List<Application_Proposal__c> proposals = [SELECT Id, Name, RecordType.Name, Stage__c FROM Application_Proposal__c ORDER BY CreatedDate DESC];
            List<Reviewer__c> reviewers = [SELECT Id, Email__c FROM Reviewer__c ORDER BY CreatedDate DESC];
            List<String> proposalStages = Utility.getPicklistValues('Reviewer_Mapping__c', 'Proposal_Stage__c');
            wrap.proposals = proposals != null ? proposals : new List<Application_Proposal__c>();
            wrap.reviewers = reviewers != null ? reviewers : new List<Reviewer__c>();
            wrap.proposalStages = proposalStages != null ? proposalStages : new List<String>();
        } catch(Exception e) {
            System.debug('Error while fetchig data ---> ' + e.getMessage() + ' at line number ---> ' + e.getLineNumber());
        }
        return wrap;
    }

    @AuraEnabled
    public static String createMapping(List<Reviewer_Mapping__c> mappings) {
        try{
            System.debug('mappings ---> ' + mappings);
            insert mappings;
            return 'SUCCESS';
        } catch(Exception e) {
            System.debug('Error while creating Mapping ---> ' + e.getMessage() + ' at line number ---> ' + e.getLineNumber());
            return 'Error while creating Mapping ---> ' + e.getMessage() + ' at line number ---> ' + e.getLineNumber();
        }
    }
}