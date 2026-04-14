public class AttendanceReportWORKSHOP implements Database.Batchable<sObject>, Database.Stateful {
    
    public Database.QueryLocator start(Database.BatchableContext bc){
        Date todayDate = system.today();
        string devName = 'Workshop';
        return Database.getQueryLocator('SELECT Id, Name,Workshop_Finish_Date__c,X1_week_of_WORKSHOP_Finish__c,(SELECT Id,Name,Email,Password__c,Proposals__c,Proposals__r.Title_Of__c From Contacts__r) From Application_Proposal__c where X1_week_of_WORKSHOP_Finish__c =: todayDate and RecordType.DeveloperName =: devName');
    }
    
    public void execute(Database.BatchableContext bc, List<Application_Proposal__c> projectList){
        
        system.debug('projectList:: ' + projectList);
        Date todayDate = system.today();
        List<Messaging.SingleEmailMessage> emailsList = new List<Messaging.SingleEmailMessage>();
        
        for(Application_Proposal__c project : projectList){
                for(Contact conRec : project.Contacts__r){
                    conRec.Login_Hash_Code__c = Utility.generateRandomString();
                    update conRec;
                    Messaging.SingleEmailMessage contactEmail = new Messaging.SingleEmailMessage();
                    List <String> emailRecipients = new List <String>{conRec.Email};
                        
                        contactEmail.setToAddresses(emailRecipients);
                    contactEmail.setSubject('Attendance Report');
                    contactEmail.setReplyTo(emailRecipients[0]);
                    
                    String emailBody = 'Dear ' + conRec.Name + ',' ;
                    emailBody += ' <br> <br> We are writing this email to notify you for your attendance report for proposal title as' + conRec.Proposals__r.Title_Of__c + '". <br> <br>';
                    emailBody += ' It has been already 1 week of your WORKSHOP completion and we have not recieved your attendance report on above mentioned proposal.  <br> Kindly Submit your attendance report on the below link. <br> <br>';
                    // emailBody += '<a href="https://indo-germansciencetechnologycentre--dev.sandbox.my.salesforce-sites.com/ApplicantDashboard/ApplicantPortal?id=' + conRec.Login_Hash_Code__c+ '#/IFDocUploads">' + 'Click here'+ '</a><br><br>' ;
                    emailBody += '<br><br> Thanks & Regards, <br> Amit Salvi, <br> Project Co-ordinator <br> IGSTC';
                    contactEmail.setHtmlBody(emailBody);
                    emailsList.add(contactEmail);
                }
        }
        if(!emailsList.isEmpty()) {
            Messaging.sendEmail(emailsList);
        }
        // if(!taskListToInsert.isEmpty()){
        //     insert taskListToInsert;
        // }
    }
    
    public void finish(Database.BatchableContext bc){
        System.debug('The Batch Run Successfully');
    }
    
}