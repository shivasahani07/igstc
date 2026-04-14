public class LandingPageController {
    
    @RemoteAction
    public static List<Reviewer_Mapping__c> onpageload(string reviewerId){
        return [select id, Review_Due_Date__c , Proposals__r.Acronym__c,Proposals__r.Title_Of__c,Proposals__r.Title_In_German__c,Proposals__r.KeyWords__c,Proposals__r.Duration_In_Months_Max_36__c from Reviewer_Mapping__c where Reviewer__c =: reviewerId];
    }
}