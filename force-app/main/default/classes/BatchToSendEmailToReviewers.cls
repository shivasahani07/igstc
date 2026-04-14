public class BatchToSendEmailToReviewers implements Database.Batchable<sObject>, Database.Stateful {

    private String campaignName;

    public BatchToSendEmailToReviewers(String campaignName) {
        this.campaignName = campaignName;
    }

    public Database.QueryLocator start(Database.BatchableContext bc){
        string devName = campaignName;
        system.debug('devName ------> '+devName);
        string stage = 'Under Review';
        return Database.getQueryLocator([SELECT Id,Name,Is_Email_Sent__c,Reviewer__c,Reviewer__r.Email__c,Proposals__c,Proposals__r.Campaign__r.Name, Proposals__r.Proposal_Stages__c From Reviewer_Mapping__c WHERE Proposals__r.Campaign__r.Name=: devName  AND Proposals__r.Proposal_Stages__c = 'Under Review' AND Reviewer__c != null AND Is_Email_Sent__c = false]);
    }

    public void execute(Database.BatchableContext bc, List<Reviewer_Mapping__c> ListOfreviewerMappingRecords){
       
        system.debug('ListOfreviewerMappingRecords ------> '+ListOfreviewerMappingRecords);
        Set<Id> reviewerIds = New Set<Id>();
        List<Reviewer__c> revListToUpdate = New List<Reviewer__c>();
        Map<Id,String> mapOfReviewerIdByEmail = New Map<Id,String>();
        for(Reviewer_Mapping__c rmRecord : ListOfreviewerMappingRecords){
            mapOfReviewerIdByEmail.put(rmRecord.Reviewer__c,rmRecord.Reviewer__r.Email__c);
        }

        for(Id revId : mapOfReviewerIdByEmail.keySet()){
            reviewerIds.add(revId);
        }
        system.debug('reviewerIds -----> '+reviewerIds);

        List<Reviewer__c> ReviewerList = [SELECT Id,Name,Email__c,Password__c From Reviewer__c WHERE Id IN : reviewerIds];
        system.debug('ReviewerList -----> '+ReviewerList);

        for(Reviewer__c revRecord : ReviewerList){
            if(String.isBlank(revRecord.Password__c)){
                revRecord.Password__c = ApplicantPortal_Contoller.generateRandomString();
                revListToUpdate.add(revRecord);
            }
        }
        update revListToUpdate;

        List<Messaging.SingleEmailMessage> emailsList = new List<Messaging.SingleEmailMessage>();
        Emailtemplate emailTempRec =  [Select Id,HtmlValue,Subject from EmailTemplate where Name ='Reviewer Registration Emaail'];
        Emailtemplate emailTempRecPecfar =  [Select Id,HtmlValue,Subject from EmailTemplate where Name ='Reviewer Registration Emaail - PECFAR'];
        Emailtemplate emailTempRecSing =  [Select Id,HtmlValue,Subject from EmailTemplate where Name ='Reviewer Registration Emaail - SING'];
        Emailtemplate emailTempRecWiser =  [Select Id,HtmlValue,Subject from EmailTemplate where Name ='Reviewer Registration Emaail - WISER'];
        Emailtemplate emailTempRecWorkshop =  [Select Id,HtmlValue,Subject from EmailTemplate where Name ='Reviewer Registration Emaail - WORKSHOP'];
        Emailtemplate emailTempRecTwoPlustwo =  [Select Id,HtmlValue,Subject from EmailTemplate where Name ='Reviewer Registration Emaail - 2+2 Call'];
        Id orgWideEmailAddressId = [SELECT Id FROM OrgWideEmailAddress ].Id;

        if(!ReviewerList.isEmpty()){
            for(Reviewer__c rev : ReviewerList){
                if(campaignName == 'Industrial Fellowships'){
                    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                    mail.setOrgWideEmailAddressId(orgWideEmailAddressId);
                    mail.setToAddresses(new String[] {rev.Email__c});
                    mail.setSubject(emailTempRec.Subject);//Set Subject
                    string emailHtmlValue = emailTempRec.HtmlValue;
    
                    if(!string.isBlank(rev.Name)){
                        emailHtmlValue = emailHtmlValue.replace('{!Reviewer__c.Name}', rev.Name);
                    }
                    if(!string.isBlank(rev.Email__c)){
                        emailHtmlValue = emailHtmlValue.replace('{!Reviewer__c.Email__c}', rev.Email__c);
                    }
                    if(!string.isBlank(rev.Password__c)){
                        emailHtmlValue = emailHtmlValue.replace('{!Reviewer__c.Password__c}', rev.Password__c);
                    }
                    
                    mail.setHtmlBody(emailHtmlValue);//Set HTML Body
                    Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
                }else if(campaignName == 'PECFAR'){
                    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                    mail.setOrgWideEmailAddressId(orgWideEmailAddressId);
                    mail.setToAddresses(new String[] {rev.Email__c});
                    mail.setSubject(emailTempRecPecfar.Subject);//Set Subject
                    string emailHtmlValue = emailTempRecPecfar.HtmlValue;
    
                    if(!string.isBlank(rev.Name)){
                        emailHtmlValue = emailHtmlValue.replace('{!Reviewer__c.Name}', rev.Name);
                    }
                    if(!string.isBlank(rev.Email__c)){
                        emailHtmlValue = emailHtmlValue.replace('{!Reviewer__c.Email__c}', rev.Email__c);
                    }
                    if(!string.isBlank(rev.Password__c)){
                        emailHtmlValue = emailHtmlValue.replace('{!Reviewer__c.Password__c}', rev.Password__c);
                    }
                    
                    mail.setHtmlBody(emailHtmlValue);//Set HTML Body
                    Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
                }else if (campaignName == 'WISER'){
                    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                    mail.setOrgWideEmailAddressId(orgWideEmailAddressId);
                    mail.setToAddresses(new String[] {rev.Email__c});
                    mail.setSubject(emailTempRecWiser.Subject);//Set Subject
                    string emailHtmlValue = emailTempRecWiser.HtmlValue;
    
                    if(!string.isBlank(rev.Name)){
                        emailHtmlValue = emailHtmlValue.replace('{!Reviewer__c.Name}', rev.Name);
                    }
                    if(!string.isBlank(rev.Email__c)){
                        emailHtmlValue = emailHtmlValue.replace('{!Reviewer__c.Email__c}', rev.Email__c);
                    }
                    if(!string.isBlank(rev.Password__c)){
                        emailHtmlValue = emailHtmlValue.replace('{!Reviewer__c.Password__c}', rev.Password__c);
                    }
                    
                    mail.setHtmlBody(emailHtmlValue);//Set HTML Body
                    Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
                }else if (campaignName == 'SING'){
                    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                    mail.setOrgWideEmailAddressId(orgWideEmailAddressId);
                    mail.setToAddresses(new String[] {rev.Email__c});
                    mail.setSubject(emailTempRecSing.Subject);//Set Subject
                    string emailHtmlValue = emailTempRecSing.HtmlValue;
    
                    if(!string.isBlank(rev.Name)){
                        emailHtmlValue = emailHtmlValue.replace('{!Reviewer__c.Name}', rev.Name);
                    }
                    if(!string.isBlank(rev.Email__c)){
                        emailHtmlValue = emailHtmlValue.replace('{!Reviewer__c.Email__c}', rev.Email__c);
                    }
                    if(!string.isBlank(rev.Password__c)){
                        emailHtmlValue = emailHtmlValue.replace('{!Reviewer__c.Password__c}', rev.Password__c);
                    }
                    
                    mail.setHtmlBody(emailHtmlValue);//Set HTML Body
                    Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
                }else if (campaignName == 'Workshop'){
                    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                    mail.setOrgWideEmailAddressId(orgWideEmailAddressId);
                    mail.setToAddresses(new String[] {rev.Email__c});
                    mail.setSubject(emailTempRecWorkshop.Subject);//Set Subject
                    string emailHtmlValue = emailTempRecWorkshop.HtmlValue;
    
                    if(!string.isBlank(rev.Name)){
                        emailHtmlValue = emailHtmlValue.replace('{!Reviewer__c.Name}', rev.Name);
                    }
                    if(!string.isBlank(rev.Email__c)){
                        emailHtmlValue = emailHtmlValue.replace('{!Reviewer__c.Email__c}', rev.Email__c);
                    }
                    if(!string.isBlank(rev.Password__c)){
                        emailHtmlValue = emailHtmlValue.replace('{!Reviewer__c.Password__c}', rev.Password__c);
                    }
                    
                    mail.setHtmlBody(emailHtmlValue);//Set HTML Body
                    Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
                }else{
                    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                    mail.setOrgWideEmailAddressId(orgWideEmailAddressId);
                    mail.setToAddresses(new String[] {rev.Email__c});
                    mail.setSubject(emailTempRecTwoPlustwo.Subject);//Set Subject
                    string emailHtmlValue = emailTempRecTwoPlustwo.HtmlValue;
    
                    if(!string.isBlank(rev.Name)){
                        emailHtmlValue = emailHtmlValue.replace('{!Reviewer__c.Name}', rev.Name);
                    }
                    if(!string.isBlank(rev.Email__c)){
                        emailHtmlValue = emailHtmlValue.replace('{!Reviewer__c.Email__c}', rev.Email__c);
                    }
                    if(!string.isBlank(rev.Password__c)){
                        emailHtmlValue = emailHtmlValue.replace('{!Reviewer__c.Password__c}', rev.Password__c);
                    }
                    
                    mail.setHtmlBody(emailHtmlValue);//Set HTML Body
                    Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
                }
                
            }
        }

        List<Reviewer_Mapping__c> RevMappingListToUpdate = New List<Reviewer_Mapping__c>();

        for(Reviewer_Mapping__c revMap : ListOfreviewerMappingRecords){
            revMap.Is_Email_Sent__c = true;
            RevMappingListToUpdate.add(revMap);
        }
        update RevMappingListToUpdate;
    }
    
    public void finish(Database.BatchableContext bc){
        System.debug('The Batch Run Successfully');
    }
}