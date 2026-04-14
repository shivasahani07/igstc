public class ReviewReminderEmailBatch implements Database.Batchable<sObject>, Database.Stateful {
    
     public Database.QueryLocator start(Database.BatchableContext bc){
        Date dt= System.today();
        Date before7Days = dt.addDays(-7);
        return Database.getQueryLocator('SELECT Id, Name, Reviewer__r.Password__c, Proposals__c , Review_Due_Date__c, Proposals__r.Title_Of__c, Reviewer__r.Login_Hash_Code__c, Reviewer__r.Email__c, Reviewer__r.Name, Stage__c FROM Reviewer_Mapping__c WHERE ' +
                                        'Review_Due_Date__c = TODAY');
    }
    
    public void execute(Database.BatchableContext bc, List<Reviewer_Mapping__c> reviewerList){
        
        system.debug('reviewerList:: ' + reviewerList);
        system.debug('reviewerList.size ' + reviewerList.size());
        
        
        List<Messaging.SingleEmailMessage> emailsList = new List<Messaging.SingleEmailMessage>();
        
            for(Reviewer_Mapping__c review : reviewerList){
                
                Messaging.SingleEmailMessage reviewerEmail = new Messaging.SingleEmailMessage();
        
                List <String> emailRecipients = new List <String>{review.Reviewer__r.Email__c};
                    
                reviewerEmail.setToAddresses(emailRecipients);
                reviewerEmail.setSubject('Reviews pending');
                reviewerEmail.setReplyTo(emailRecipients[0]);
                
                String emailBody = 'Dear ' + review.Reviewer__r.Name + ',' ;
                emailBody += ' <br> <br> We are delighted to Inform you that you have been assigned as a evaluator on Proposal for IGSTC 2+2 Call Project Titled as "' + review.Proposals__r.Title_Of__c + '". <br> <br>';
                emailBody += ' It has been already 7 Days and we have not recieved your reviews on below mentioned proposal.  <br> Kindly Submit your valuable remarks on proposal by logging in to our Evalaution Portal with below Credentials. <br> <br>';
                emailBody += '<a href="https://indo-germansciencetechnologycentre--dev--c.visualforce.com/apex/ReviewerPortal?id=' + review.Reviewer__r.Login_Hash_Code__c+ '#/Rp_Projects">' + 'Click here'+ '</a><br><br>' ;
                emailBody += 'Username: ' + review.Reviewer__r.Email__c;
                emailBody += '<br> Password: ' + review.Reviewer__r.Password__c;
                
                emailBody += '<br><br> Thanks & Regards, <br> Amit Salvi, <br> Project Co-ordinator <br> IGSTC';
                reviewerEmail.setHtmlBody(emailBody);
                emailsList.add(reviewerEmail);
            
            if(!emailsList.isEmpty()) {
                Messaging.sendEmail(emailsList);   
                review.Review_Due_Date__c = System.Today().addDays(7);
                Update review;
                system.debug('review.Review_Due_Date__c :: ' + review.Review_Due_Date__c);
            }
        }
    }
    public void finish(Database.BatchableContext bc){
        System.debug('The Batch Run Successfully');
    }
    
    
    
}