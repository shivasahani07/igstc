public class ConsortiaDetailPage_Controller {
    
    public String ApplicantPortalSiteURL {get;set;}
    
    public ConsortiaDetailPage_Controller(){
        ApplicantPortalSiteURL = Constants.CANDIDATE_SITE ;
    }
    @RemoteAction
    public static string insertAccount(List<Account> accountDetails,List<Contact> contactDetails){
        try{
            upsert accountDetails;
            upsert contactDetails;
            return 'success';
        }catch (Exception e){
            return 'error';   
        }
    }
    
    /*@RemoteAction
    public static void getApplicantDetails(string applicantHashCode){
        contact conRec = [select name,id,Proposals__c from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
        if(conRec.Proposals__c != Null){
            Account accRec = [SELECT Id,Name FROM Account WHERE Id=: conRec.AccountId];
        }
    }*/
    
    @RemoteAction
    public static string insertAccountAndContact(account accDetails, list<contact> conListToInsert){
        insert accDetails;
        for(contact con:ConListToInsert){
            con.AccountId = accDetails.Id;
        }
        insert ConListToInsert;
        return 'success';
    }

    @RemoteAction
    public static  list<account> getPatnerDetails(string applicantHashCode){
        system.debug('applicantHashCode---'+applicantHashCode);
        contact conRec = [select name,id,Proposals__c from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
        list<contact> applicantList = New list<contact>();
        if(!string.isBlank(conRec.Proposals__c)){
           List<account> accountContactList = [select name,id,(select name,id,firstName,LastName,Email,Phone from contacts) from account where Proposals__c =:conRec.Proposals__c];
           return accountContactList;
        }
        return null;
    }

    public class AccountContactWrapper {
        public Account acc;
        public List<contact> con;
    }
}