public withOut sharing class MatchReviewer_Controller {
    
    @AuraEnabled(cacheable=true)
    public static List<Reviewer__c> getReviewers(){
        try {
            List<Reviewer__c> allReviewerRecords = [select name,id from Reviewer__c];
            return allReviewerRecords;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}