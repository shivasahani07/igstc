public class CompanyProfile_Controller {
    
    public String ApplicantPortalSiteURL {get;set;}
    
    public CompanyProfile_Controller(){
        ApplicantPortalSiteURL = Constants.CANDIDATE_SITE ;
        system.debug('ApplicantPortalSiteURL :: '+ApplicantPortalSiteURL);
    }
    
    @RemoteAction
    public static  Account getCompanyApplicantDetails(string applicantHashCode){
        contact conRec = [select name,id,AccountId from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
        system.debug('applicantHashCode' +applicantHashCode);
        if(conRec.AccountId != Null){
            Account acc = [SELECT id,Name FROM Account WHERE Id=: conRec.AccountId];
            return acc;
        }else{
            return Null;  
        }     
    }
    
    @RemoteAction
    public static Account insertApplicant(Account applicantDetails){
        try{
            applicantDetails.NumberOfEmployees = integer.valueOf(applicantDetails.NumberOfEmployees);
            update applicantDetails;
            return applicantDetails;
        }catch (Exception e){
            return null;   
        }
    }
    
}