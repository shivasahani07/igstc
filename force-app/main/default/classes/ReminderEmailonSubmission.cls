public class ReminderEmailonSubmission implements Database.Batchable<sObject>, Database.Stateful{

        public Database.QueryLocator start(Database.BatchableContext bc){
            string devName = 'Industrial Fellowship';
            return Database.getQueryLocator('SELECT Id,Name,FirstName,LastName,Email FROM Contact where Proposals__r.RecordType.Name =: devName');
        }

        public void execute(Database.BatchableContext bc, List<contact> conList){

            List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();
            EmailTemplate empRec = [Select Id,Subject,HtmlValue From EmailTemplate where Name = 'Industrial Fellowship'];
            Id orgWideEmailAddressId = [SELECT Id FROM OrgWideEmailAddress ].Id;
    
            for(Contact Con : conList){
                Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
                email.setOrgWideEmailAddressId(orgWideEmailAddressId);
                email.setToAddresses(new List<String>{Con.Email});
                email.setSubject(empRec.Subject);
                string htmlEmailVal = empRec.HtmlValue;
                if(!string.isBlank(Con.FirstName))
                    htmlEmailVal = htmlEmailVal.replace('{!Contact.FirstName}', Con.FirstName);
                if(!string.isBlank(Con.LastName))
                    htmlEmailVal = htmlEmailVal.replace('{!Contact.LastName}', Con.LastName);
                
                email.setBccAddresses(new List<String>{'saquib.shaikh@igstc.org'});
                email.setHtmlBody(htmlEmailVal );
                mails.add(email);        
                Messaging.sendEmail(mails);
        }
    }

        public void finish(Database.BatchableContext bc){
            System.debug('The Batch Run Successfully');
        }
}