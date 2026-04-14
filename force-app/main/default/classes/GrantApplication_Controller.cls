public class GrantApplication_Controller {
    
    @RemoteAction
    public static  contact getApplicantDetailsForGrant(string applicantHashCode){
        try{
            contact conRec = [select name,id,Title,Funding_Agency__c,Budget__c,Starting_Date__c,Duration__c from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
            return conRec;
        }catch(Exception e){
            return null;
        }
    }
    
    @RemoteAction
    public static String insertGrantApplication(Contact applicantDetails){
        try{
            update applicantDetails;
            return 'SUCCESS';
        }catch(Exception e){
            return 'ERROR';
        }
    }
}