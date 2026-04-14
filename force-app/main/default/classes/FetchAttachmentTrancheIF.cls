public with sharing class FetchAttachmentTrancheIF {
    @InvocableMethod(label='Generate Tranche attachment Id For IF' description='Get TrancheIF template' category='attachment')
    Public Static void getTrancheAttId(List<String> proIDList){
        system.debug('proIDList ::'+proIDList);
        try{
            Date todayDate  = System.today();
            if(!proIDList.isEmpty()){
                String dsId = proIDList[0];
                Disbursement_Schedule__c ds = [select id,proposals__c,Tranche__c from Disbursement_Schedule__c where id =: dsId];
                
                List<Messaging.SingleEmailMessage> emailList = new List<Messaging.SingleEmailMessage>();
                List<Contact> conListToUpdateHashCode = New List<Contact>();
                List<Contact> contactList = [Select Salutation,LastName,Email,Name,FirstName,Id,Login_Hash_Code__c From Contact where Proposals__c =: ds.proposals__c];
                Application_Proposal__c proposalrecord = [select id,Name,recordtype.name ,Country_of_Venue__c,Proposed_Date__c,Workshop_Finish_Date__c from Application_Proposal__c where id =: ds.proposals__c];
                for(Contact con : contactList){
                    con.Login_Hash_Code__c = Utility.generateRandomString();
                    //con.Hashcode_Expiration_Date__c = todayDate.addDays(3);
                    
                    //logic added by rutuja
                    HashcodeExpiryDate__c hashcodeNumberofDays = HashcodeExpiryDate__c.getInstance();
                    Decimal test = hashcodeNumberofDays.Hashcode_Expiration_Date__c;
                    //con.Hashcode_Expiration_Date__c = todayDate.addDays(3);
                    con.Hashcode_Expiration_Date__c = todayDate.addDays(Integer.valueOf(hashcodeNumberofDays.Hashcode_Expiration_Date__c));
                    //till here
                    
                    conListToUpdateHashCode.add(con);
                }
                if(!conListToUpdateHashCode.isEmpty()){
                    update conListToUpdateHashCode;
                }


                Emailtemplate emailTempRec = New Emailtemplate();
                emailTempRec =  [Select Id,HtmlValue,Subject from EmailTemplate where Name ='Tranche Release Mail - IF'];
                List<Attachment> attList = [Select Id,name,Body,ContentType from attachment where parentId = :ds.proposals__c order by createdDate DESC limit 1];           
                
                if(!contactList.isEmpty()){
                    for(Contact con : contactList){
                        
                        OrgWideEmailAddress owea = [select Id from OrgWideEmailAddress where Address = 'industrial.fellowship@igstc.org'];
                        //OrgWideEmailAddress owea = [select Id from OrgWideEmailAddress where Address = 'isha999raj@gmail.com'];
                        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                        mail.setOrgWideEmailAddressId(owea.Id);
                        List <String> emailRecipients = new List <String>{con.Email};
                        mail.setToAddresses(emailRecipients);
                        
                        string emailSubject = emailTempRec.Subject;
                        if(!string.isBlank(con.FirstName)){
                            emailSubject = emailSubject.replace('{!Contact.Name}', con.Name);
                            
                        }
                        emailSubject = emailSubject.replace('Industrial Fellowship', proposalrecord.RecordType.Name);
                        emailSubject = emailSubject.replace('{!Disbursement_Schedule__c.Tranche__c}', ds.Tranche__c);
                        mail.setSubject(emailSubject);
                        string emailHtmlValue = emailTempRec.HtmlValue;
                        if(!string.isBlank(con.FirstName)){
                            emailHtmlValue = emailHtmlValue.replace('{!Contact.FirstName}', con.Salutation + ' ' + con.LastName);
                            emailHtmlValue = emailHtmlValue.replace('Industrial Fellowship', proposalrecord.RecordType.Name);
                            emailHtmlValue = emailHtmlValue.replace('{!Disbursement_Schedule__c.Tranche__c}', ds.Tranche__c);
                        }
                        mail.setHtmlBody(emailHtmlValue);
                        Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
                        if(!attList.isEMpty()){
                            attach.setContentType(attList[0].ContentType);
                            attach.setFileName(attList[0].Name);
                            attach.Body = attList[0].Body;
                            mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attach });
                        }
                        emailList.add(mail);
                    }
                    if(!emailList.isEmpty()){
                        Messaging.sendEmail(emailList);
                    }
                    EmailMessage emailMessageRecToBeInserted = New EmailMessage();
                    emailMessageRecToBeInserted.MessageDate = System.now();
                    emailMessageRecToBeInserted.Status = '3';
                    emailMessageRecToBeInserted.Subject = emailTempRec.Subject;
                    emailMessageRecToBeInserted.ToAddress = contactList[0].Email;
                    emailMessageRecToBeInserted.Contact__c = contactList[0].Id;
                    system.debug('emailMessageRecToBeInserted ==> '+emailMessageRecToBeInserted);
                    insert emailMessageRecToBeInserted;
                }
            }
        }catch(Exception e){
            system.debug(e.getMessage()+e.getLineNumber());
        }
    }
}