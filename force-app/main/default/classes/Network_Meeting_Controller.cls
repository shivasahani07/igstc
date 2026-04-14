public class Network_Meeting_Controller {
    
    // @RemoteAction
    // public static list<contact> getProjectDetailsForNetMeet(string applicantHashCode){
    //     contact conRec = [select name,id,Proposals__c from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
    //     list<contact> applicantList = New list<contact>();
    //     if(!string.isBlank(conRec.Proposals__c)){
    //         applicantList = [select name,id,FirstName,LastName,(SELECT Id,Meeting_Agenda__c,Meeting_Venue__c,Tentative_Date__c,Participants__c,Actual_Date__c FROM Network_Meetings__r) from Contact  where Proposals__c=:conRec.Proposals__c];
    //         return applicantList;
    //     }
    //     return applicantList;
    // }
    
    // @RemoteAction
    // public static String insertMeetingDetails(List<Network_Meeting__c> meetingList){
    //     try{
    //         upsert meetingList;
    //         return 'SUCCESS';
            
    //     }catch(Exception e){
    //        return 'ERROR'; 
    //     }
    // }
}