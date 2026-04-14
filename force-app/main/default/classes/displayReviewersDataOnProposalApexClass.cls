public class displayReviewersDataOnProposalApexClass {
     
    @AuraEnabled(cacheable=true)
    public static List<Reviewer_Mapping__c> getReviewerMapping(String proposalId){
        return [Select Id,Name,stage__c,Reviewer__c,Reviewer__r.Name ,Total_Score__c from Reviewer_Mapping__c where Proposals__c=:proposalId];
         
    }
    
}