public class PIDeliverables_Controller {
    
    @RemoteAction
    public static  list<contact> getProjectDetailsDetails(string applicantHashCode){
        system.debug('applicantHashCode---'+applicantHashCode);
        contact conRec = [select name,id,Proposals__c from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
        list<contact> applicantList = New list<contact>();
        if(!string.isBlank(conRec.Proposals__c)){
            applicantList = [select name,id,FirstName,LastName from Contact  where Proposals__c=:conRec.Proposals__c];
            return applicantList;
        }
        system.debug('applicantList--'+applicantList);
        return applicantList;
    }
    
    @RemoteAction
    public static  String insertDeliverables(List<PI_Deliverables__c> deliverablesDetails){
        try{
            insert deliverablesDetails;
            return 'SUCCESS';
            
        }catch(Exception e){
           return 'ERROR'; 
        }
    }
}