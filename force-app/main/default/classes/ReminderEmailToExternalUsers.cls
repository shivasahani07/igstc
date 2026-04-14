public class ReminderEmailToExternalUsers implements Database.Batchable<sObject>, Database.Stateful{
    public ReminderEmailToExternalUsers() {

    }

    public Database.QueryLocator start(Database.BatchableContext bc){
        // String emailTest = 'paridhi.gupta@igstc.org';
        // String emailTest = 'isha.raj@utilitarianlab.com';
        return Database.getQueryLocator('SELECT Id,Salutation,Name,FirstName,LastName,Email,External__c FROM Contact where External__c = True');
    }

    public void execute(Database.BatchableContext bc, List<contact> conList){

        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();
        EmailTemplate empRec = [Select Id,Subject,HtmlValue From EmailTemplate where Name = 'German User External Email'];
        Attachment att = [Select Id,name,Body,ContentType from attachment Where Name= 'IGSTC WISER 2023(1).pdf' LIMIT 1];
        Id orgWideEmailAddressId = [SELECT Id FROM OrgWideEmailAddress WHERE Address = 'saquib.shaikh@igstc.org'].Id;
        // Id orgWideEmailAddressId = [SELECT Id FROM OrgWideEmailAddress WHERE Address = 'isha999raj@gmail.com'].Id;
        Blob Blobbody;

        for(Contact Con : conList){
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setOrgWideEmailAddressId(orgWideEmailAddressId);
            email.setToAddresses(new List<String>{Con.Email});
            email.setSubject(empRec.Subject);

            Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
            attach.setContentType('application/pdf');
            attach.setFileName('IGSTC WISER Brochure.pdf');
            attach.setInline(false);
            attach.Body = att.Body;

            string htmlEmailVal = empRec.HtmlValue;
            if(!string.isBlank(Con.Salutation))
                htmlEmailVal = htmlEmailVal.replace('{!Contact.Salutation}', Con.Salutation);
            if(!string.isBlank(Con.FirstName))
                htmlEmailVal = htmlEmailVal.replace('{!Contact.FirstName}', Con.FirstName);
            if(!string.isBlank(Con.LastName))
                htmlEmailVal = htmlEmailVal.replace('{!Contact.LastName}', Con.LastName);
            if(!string.isBlank(Con.Email))
            htmlEmailVal = htmlEmailVal.replace('{!Contact.Email}', Con.Email);
            
            email.setBccAddresses(new List<String>{'saquib.shaikh@igstc.org'});
            email.setHtmlBody(htmlEmailVal );
            email.setFileAttachments(new Messaging.EmailFileAttachment[] { attach });
            mails.add(email);       
        }
        Messaging.sendEmail(mails);
    }

    public void finish(Database.BatchableContext bc){
        System.debug('The Batch Run Successfully');
    }
}