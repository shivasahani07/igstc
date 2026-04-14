public class displayEmailDataOnProposalApexClass {
     
    @AuraEnabled(cacheable=true)
    public static List<EmailMessage> getEmailMessagesBasedOnContact(String proposalId){
        List<contact> con = [SELECT Id, Proposal_Name__c, Proposals__c,Is_Primary__c FROM Contact where Proposals__c =:proposalId AND Is_Primary__c = true order by createddate desc limit 1];
        List<EmailMessage> emailList= new List<EmailMessage>([SELECT Id, Subject,Status,messagedate, Name, Contact__c,Contact__r.Name FROM EmailMessage where contact__c =: con ]);
        if(!emailList.isEmpty()) {
            return emailList;
        }
        return emailList;
    }
    
}