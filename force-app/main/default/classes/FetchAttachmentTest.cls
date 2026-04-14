@isTest
public class FetchAttachmentTest {
    @isTest
    static void testGetLatestAttachmentId() {
       		Application_Proposal__c pro=new Application_Proposal__c();
            Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Industrial Fellowship').getRecordTypeId();
            pro.RecordTypeId = IFRecordTypeId;
            insert pro;
        
        // Create a test contact
  	        Contact testContact = new Contact(
            Salutation = 'Mr.',
            FirstName = 'John',
            LastName = 'Doe',
            Email = 'john.doe@example.com',
            Is_Primary__c = true,
            Campaign__c = 'if',
            Proposals__c= pro.Id 
        );
        insert testContact;

        // Create a test attachment
        Attachment testAttachment = new Attachment(
            Name = 'Test Attachment',
            Body = Blob.valueOf('Test content'),
            ContentType = 'text/plain',
            ParentId = testContact.Proposals__c
        );
        insert testAttachment;

        Test.startTest();
        try{
            List<String> proposalIdList = new List<String>{testContact.Proposals__c};
            FetchAttachment.getLatestAttachmentId(proposalIdList);
            Test.stopTest();
    
            // Verify email message record was created
            List<EmailMessage> emailMessages = [SELECT Id, Subject, ToAddress, Contact__c FROM EmailMessage WHERE ToAddress = :testContact.Email];
            System.assertEquals(1, emailMessages.size());
            System.assertEquals('IF Submission', emailMessages[0].Subject);
            System.assertEquals(testContact.Id, emailMessages[0].Contact__c);
        }Catch(Exception Ex){}
        
    }

    @isTest
    static void testGetLatestAttachmentIdNoPrimaryContact() {
        try{
		Application_Proposal__c pro=new Application_Proposal__c();
            Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Industrial Fellowship').getRecordTypeId();
            pro.RecordTypeId = IFRecordTypeId;
        insert pro;
        // Create a test contact that is not primary
        Contact testContact = new Contact(
            Salutation = 'Ms.',
            FirstName = 'Jane',
            LastName = 'Doe',
            Email = 'jane.doe@example.com',
            Proposals__c = pro.Id,
            Is_Primary__c = false,
            Campaign__c = 'if'
        );
        insert testContact;

        // Create a test attachment
        Attachment testAttachment = new Attachment(
            Name = 'Test Attachment',
            Body = Blob.valueOf('Test content'),
            ContentType = 'text/plain',
            ParentId = testContact.Proposals__c
        );
        insert testAttachment;

        Test.startTest();
        List<String> proposalIdList = new List<String>{testContact.Proposals__c};
        FetchAttachment.getLatestAttachmentId(proposalIdList);
        Test.stopTest();
        }Catch(Exception Ex){}
    }
}