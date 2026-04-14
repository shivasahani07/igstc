public with sharing class reviewerAllocationApllicationController {

    public class DataWrapper {
        @AuraEnabled public List<YealyCall__c> yearlist { get; set; }
        @AuraEnabled public List<Application_Proposal__c> proposals { get; set; }
        @AuraEnabled public List<Campaign> campaigns { get; set; }
    }

    @AuraEnabled
    public static DataWrapper getOnloadData(){
        DataWrapper wrap = new DataWrapper();
        try {
            List<YealyCall__c> yearlist = [SELECT Id, Year__c FROM YealyCall__c ORDER BY Year__c DESC];
            List<Application_Proposal__c> proposals = [SELECT Id, Name, RecordType.Name, Campaign__r.Name, Proposal_Stages__c, Stage__c, CreatedDate, Submitted__c, (SELECT Id, (SELECT Id, Name FROM Contacts) FROM Accounts__r), (SELECT Id FROM Reviewer_Mapping__r) FROM Application_Proposal__c WHERE Campaign__c != null ORDER BY CreatedDate ASC];
            System.debug('proposals ---> ' + proposals);
            List<Campaign> campaigns = [SELECT Id, Name FROM Campaign];
            wrap.yearlist = yearlist;
            wrap.proposals = proposals;
            wrap.campaigns = campaigns;
        } catch (Exception e) {
            System.debug('Error while loading initial data ---> ' + e.getMessage() + ' at line number ---> ' + e.getLineNumber());
            throw new AuraHandledException(e.getMessage());
        }
        return wrap;
    }
}