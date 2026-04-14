public class Curriculum_vitae_Controller {
    
    // public String ApplicantPortalSiteURL {get;set;}
    
    // public Curriculum_vitae_Controller(){
    //     ApplicantPortalSiteURL = Constants.CANDIDATE_SITE ;
    // }
    // @RemoteAction
    // public static String insertContactDetails(Contact contactDetails, List<Education_Details__c> educationDetails, List<Employment_Details__c> employmentDetails, List<Publications_Patents__c> publicationDetails){
    //     try{
    //         Upsert contactDetails;
    //         for(Education_Details__c edu : educationDetails){
    //             edu.Contact__c = contactDetails.Id;
    //         }
    //         Upsert educationDetails;
    //         for(Employment_Details__c emp : employmentDetails){
    //             emp.Contact__c = contactDetails.Id;
    //         }
    //         Upsert employmentDetails;
    //         for(Publications_Patents__c patent : publicationDetails){
    //             patent.Contact__c = contactDetails.Id;
    //         }
    //         Upsert publicationDetails;
    //         return 'SUCCESS';
            
    //     }catch(exception e){
    //         return 'ERROR';
    //     }
    // }
    
    // @RemoteAction
    // public static Contact getContactDetails(string hashCode){
    //     Contact conRec = [SELECT Id,Name,FirstName,LastName,Actual_Position__c,MailingCity,MailingState,MailingCountry,(SELECT Id,Name,Institution_Name__c,Specialization__c,Degree__c,End_Year__c FROM Education_Details__r),(SELECT Id,Name,Organization_Name__c,Position__c,End_Year__c FROM Employment_Details__r),(select name,id,description__c from Publications_Patents__r) From Contact WHERE Login_Hash_Code__c=: hashCode Limit 1];
    //     return conRec; 
    // }
}