/**
 * @author [Dinesh B]
 * @email dinesh.b@utilitarianLab.com
 * @create date 2022-07-28 20:07:01
 * @modify date 2022-07-28 20:07:01
 * @desc [Currently it will fire when created date is today]
 */

public  class BatchForReviewer7DaysEmail implements Database.Batchable <Sobject> {
    
    public Database.QueryLocator Start(Database.BatchableContext bc){
        String query = 'SELECT Id,Name,CreatedDate,Proposals__r.Proposal_Stages__c,Reviewer__r.Email__c,Reviewer__r.Name FROM Reviewer_Mapping__c WHERE  Proposals__r.Proposal_Stages__c = \'Under Review\' ';
        return Database.getQueryLocator(query);
    }
    public void Execute(Database.BatchableContext bc, List<Reviewer_Mapping__c> RevMapList){
        List<Messaging.SingleEmailMessage> mailList = new List<Messaging.SingleEmailMessage>();
        EmailTemplate temp = [SELECT Id,Subject,Body,HTMLValue FROM EmailTemplate WHERE Name ='Reviewer Inactive 7 Days'];
        String str = temp.HTMLValue;
        String body = temp.body;
        for(Reviewer_Mapping__c revMap : RevMapList){
              body = body.replace('{!Reviewer__c.Name}', revMap.Reviewer__r.Name);
            Date ActualcreatedDate = date.newinstance(revMap.CreatedDate.year(), revMap.CreatedDate.month(), revMap.CreatedDate.day());
            if(revMap.Reviewer__r.Email__c !=null && ActualcreatedDate == system.today()){
             Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
             mail.setHtmlBody(str);
             mail.setSubject(temp.Subject);
             mail.setPlainTextBody(body);
            mail.toAddresses = new String[] {  revMap.Reviewer__r.Email__c};
             mailList.add(mail);
            }
        }
 if(!mailList.isEmpty()){
             Messaging.sendEmail(mailList);
        } 
    }
    public void Finish(Database.BatchableContext bc){
      
    }
}