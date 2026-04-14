@isTest
private class IFReleaseTrancheLetter_Test {

    private class CongaHttpMock implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200);

            String endpoint = req.getEndpoint();
            if (endpoint != null && endpoint.contains('/services/Soap/u/')) {
                res.setHeader('Content-Type', 'text/xml');
                res.setBody(
                    '<?xml version="1.0" encoding="UTF-8"?>'
                    + '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:partner.soap.sforce.com">'
                    + '<soapenv:Body>'
                    + '<urn:loginResponse>'
                    + '<urn:result>'
                    + '<urn:sessionId>00Dxx0000000001!MOCK</urn:sessionId>'
                    + '</urn:result>'
                    + '</urn:loginResponse>'
                    + '</soapenv:Body>'
                    + '</soapenv:Envelope>'
                );
                return res;
            }

            res.setHeader('Content-Type', 'text/plain');
            res.setBody('/00Pxx0000000001');
            return res;
        }
    }

    private static void setupCongaCalloutMock() {
        Test.setMock(HttpCalloutMock.class, new CongaHttpMock());
    }

    @testSetup
    static void makeData(){
        setupCongaCalloutMock();
        // Create Record Types
        Id industrialFellowshipRT = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Industrial Fellowship').getRecordTypeId();
        Id pecfarRT = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('PECFAR').getRecordTypeId();
        Id wiserRT = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('WISER').getRecordTypeId();
        Id singRT = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('SING').getRecordTypeId();
        
        // Create Year
        Year__c yearRec = new Year__c(Name = '2024', Is_Active__c = true, Is_Current_Year__c = true);
        insert yearRec;
        
        // Create Yearly Call
        YealyCall__c yearlyCall = new YealyCall__c();
        yearlyCall.Year__c = yearRec.Id;
        insert yearlyCall;
        
        // Create Accounts
        Account acc1 = new Account(
            Name = 'Test Account 1',
            BillingCountry = 'India'
        );
        Account acc2 = new Account(
            Name = 'Test Account 2',
            BillingCountry = 'Germany'
        );
        insert new List<Account>{acc1, acc2};
        
        // Create Contacts
        Contact con1 = new Contact(
            FirstName = 'John',
            LastName = 'Doe',
            AccountId = acc1.Id,
            Industrial_Fellowship_Type__c = 'Test Type'
        );
        Contact con2 = new Contact(
            FirstName = 'Jane',
            LastName = 'Smith',
            AccountId = acc2.Id,
            Industrial_Fellowship_Type__c = 'Test Type'
        );
        insert new List<Contact>{con1, con2};
        
        // Create Application Proposals for different record types
        List<Application_Proposal__c> proposals = new List<Application_Proposal__c>();
        
        // Industrial Fellowship Proposal
        Application_Proposal__c ifProposal = new Application_Proposal__c(
            Title_Of__c = 'IF Test Proposal',
            RecordTypeId = industrialFellowshipRT,
            yearly_Call__c = yearlyCall.Id
        );
        proposals.add(ifProposal);
        
        // PECFAR Proposal
        Application_Proposal__c pecfarProposal = new Application_Proposal__c(
            Title_Of__c = 'PECFAR Test Proposal',
            RecordTypeId = pecfarRT,
            yearly_Call__c = yearlyCall.Id
        );
        proposals.add(pecfarProposal);
        
        // WISER Proposal
        Application_Proposal__c wiserProposal = new Application_Proposal__c(
            Title_Of__c = 'WISER Test Proposal',
            RecordTypeId = wiserRT,
            yearly_Call__c = yearlyCall.Id
        );
        proposals.add(wiserProposal);
        
        // SING Proposal
        Application_Proposal__c singProposal = new Application_Proposal__c(
            Title_Of__c = 'SING Test Proposal',
            RecordTypeId = singRT,
            yearly_Call__c = yearlyCall.Id
        );
        proposals.add(singProposal);
        
        insert proposals;
        
        // Create Applicant Proposal Associations
        List<Applicant_Proposal_Association__c> associations = new List<Applicant_Proposal_Association__c>();
        for(Application_Proposal__c prop : proposals){
            Applicant_Proposal_Association__c assoc1 = new Applicant_Proposal_Association__c(
                Proposals__c = prop.Id,
                Contact__c = con1.Id
            );
            associations.add(assoc1);
            
            Applicant_Proposal_Association__c assoc2 = new Applicant_Proposal_Association__c(
                Proposals__c = prop.Id,
                Contact__c = con2.Id
            );
            associations.add(assoc2);
        }
        insert associations;
        
        // Create Disbursement Schedules
        List<Disbursement_Schedule__c> schedules = new List<Disbursement_Schedule__c>();
        
        // Industrial Fellowship Schedules (all tranches)
        for(Integer i = 2; i <= 12; i++){
            Disbursement_Schedule__c ds = new Disbursement_Schedule__c(
                Proposals__c = ifProposal.Id,
                tranche__c = String.valueOf(i)
            );
            schedules.add(ds);
        }
        
        // PECFAR Schedule
        Disbursement_Schedule__c pecfarDs = new Disbursement_Schedule__c(
            Proposals__c = pecfarProposal.Id,
            tranche__c = '1'
        );
        schedules.add(pecfarDs);
        
        // WISER Schedule
        Disbursement_Schedule__c wiserDs = new Disbursement_Schedule__c(
            Proposals__c = wiserProposal.Id,
            tranche__c = '1'
        );
        schedules.add(wiserDs);
        
        // SING Schedule
        Disbursement_Schedule__c singDs = new Disbursement_Schedule__c(
            Proposals__c = singProposal.Id,
            tranche__c = '1'
        );
        schedules.add(singDs);
        
        insert schedules;
        
        // Create TemplateURLByName__c records
        List<TemplateURLByName__c> templates = new List<TemplateURLByName__c>();
        
        TemplateURLByName__c ifTrancheTemplate = new TemplateURLByName__c(
            Name = 'IF Tranche Letter',
            Object_Name__c = 'Application_Proposal__c',
            Formula_Field_Name__c = 'IF_tranche__c'
        );
        templates.add(ifTrancheTemplate);
        
        TemplateURLByName__c pecfarTemplate = new TemplateURLByName__c(
            Name = 'PECFAR Tranche Release',
            Object_Name__c = 'Application_Proposal__c',
            Formula_Field_Name__c = 'IF_tranche__c'
        );
        templates.add(pecfarTemplate);
        
        // Add all IF tranche templates
        for(Integer i = 3; i <= 12; i++){
            String templateName = '';
            String formulaFieldName = '';
            if(i == 3) {
                templateName = 'IF3RDTRANCHE';
                formulaFieldName = 'IF3RDTRANCHE__c';
            } else {
                templateName = 'IF' + i + 'THTRANCHE';
                formulaFieldName = 'IF' + i + 'THTRANCHE__c';
            }
            
            TemplateURLByName__c template = new TemplateURLByName__c(
                Name = templateName,
                Object_Name__c = 'Application_Proposal__c',
                Formula_Field_Name__c = formulaFieldName
            );
            templates.add(template);
        }
        
        insert templates;
        
        // Create User Documents and Attachments
        List<User_Document__c> userDocs = new List<User_Document__c>();
        
        for(Application_Proposal__c prop : proposals){
            User_Document__c doc = new User_Document__c(
                Name = 'Test Document',
                Proposals__c = prop.Id
            );
            userDocs.add(doc);
        }
        
        insert userDocs;
    }
    
    @isTest
    static void testIFTrancheLetter_IndustrialFellowship_AllTranches(){
        setupCongaCalloutMock();
        // Get test data
        Application_Proposal__c ifProposal = [SELECT Id FROM Application_Proposal__c WHERE RecordType.Name = 'Industrial Fellowship' LIMIT 1];
        System.debug('Found IF Proposal: ' + ifProposal.Id);
        
        // Check if Disbursement Schedules exist
        List<Disbursement_Schedule__c> existingSchedules = [SELECT Id, Proposals__c, tranche__c FROM Disbursement_Schedule__c WHERE Proposals__c = :ifProposal.Id];
        System.debug('Found ' + existingSchedules.size() + ' schedules for proposal ' + ifProposal.Id);
        for(Disbursement_Schedule__c ds : existingSchedules) {
            System.debug('Schedule: ' + ds.Id + ', Tranche: ' + ds.tranche__c);
        }
        
        Test.startTest();
        // Test all tranches from 2 to 12
        for(Integer i = 2; i <= 12; i++){
            System.debug('Looking for tranche ' + i);
            Disbursement_Schedule__c ds = [SELECT Id FROM Disbursement_Schedule__c WHERE Proposals__c = :ifProposal.Id AND tranche__c = :String.valueOf(i) LIMIT 1];
            System.debug('Found schedule for tranche ' + i + ': ' + ds.Id);
            
            List<String> proId = new List<String>{ds.Id};
            IFReleaseTrancheLetter.ifTrancheLetter(proId);
        }
        Test.stopTest();
    }
    
    @isTest
    static void testIFTrancheLetter_PECFAR(){
        setupCongaCalloutMock();
        // Get test data
        Application_Proposal__c pecfarProposal = [SELECT Id FROM Application_Proposal__c WHERE RecordType.Name = 'PECFAR' LIMIT 1];
        Disbursement_Schedule__c ds = [SELECT Id FROM Disbursement_Schedule__c WHERE Proposals__c = :pecfarProposal.Id LIMIT 1];
        
        Test.startTest();
        List<String> proId = new List<String>{ds.Id};
        IFReleaseTrancheLetter.ifTrancheLetter(proId);
        Test.stopTest();
    }
    
    @isTest
    static void testGenerateCongaTemplatesUsingCS_IndustrialFellowship(){
        setupCongaCalloutMock();
        // Get test data
        Application_Proposal__c ifProposal = [SELECT Id FROM Application_Proposal__c WHERE RecordType.Name = 'Industrial Fellowship' LIMIT 1];
        Disbursement_Schedule__c ds = [SELECT Id FROM Disbursement_Schedule__c WHERE Proposals__c = :ifProposal.Id LIMIT 1];
        
        Test.startTest();
        IFReleaseTrancheLetter.GenerateCongaTemplatesUsingCS(ifProposal.Id, 'IF Tranche Letter', ds.Id);
        Test.stopTest();
    }
    
    @isTest
    static void testGenerateCongaTemplatesUsingCS_PECFAR_India(){
        setupCongaCalloutMock();
        // Get test data
        Application_Proposal__c pecfarProposal = [SELECT Id FROM Application_Proposal__c WHERE RecordType.Name = 'PECFAR' LIMIT 1];
        Disbursement_Schedule__c ds = [SELECT Id FROM Disbursement_Schedule__c WHERE Proposals__c = :pecfarProposal.Id LIMIT 1];
        
        Test.startTest();
        IFReleaseTrancheLetter.GenerateCongaTemplatesUsingCS(pecfarProposal.Id, 'PECFAR Tranche Release', ds.Id);
        Test.stopTest();
    }
    
    @isTest
    static void testGenerateCongaTemplatesUsingCS_WISER(){
        setupCongaCalloutMock();
        // Get test data
        Application_Proposal__c wiserProposal = [SELECT Id FROM Application_Proposal__c WHERE RecordType.Name = 'WISER' LIMIT 1];
        Disbursement_Schedule__c ds = [SELECT Id FROM Disbursement_Schedule__c WHERE Proposals__c = :wiserProposal.Id LIMIT 1];
        
        // Create WISER template
        TemplateURLByName__c wiserTemplate = new TemplateURLByName__c(
            Name = 'WISER Template Test',
            Object_Name__c = 'Application_Proposal__c',
            Formula_Field_Name__c = 'IF_tranche__c'
        );
        insert wiserTemplate;
        
        Test.startTest();
        IFReleaseTrancheLetter.GenerateCongaTemplatesUsingCS(wiserProposal.Id, 'WISER Template Test', ds.Id);
        Test.stopTest();
    }
    
    @isTest
    static void testGenerateCongaTemplatesUsingCS_SING(){
        setupCongaCalloutMock();
        // Get test data
        Application_Proposal__c singProposal = [SELECT Id FROM Application_Proposal__c WHERE RecordType.Name = 'SING' LIMIT 1];
        Disbursement_Schedule__c ds = [SELECT Id FROM Disbursement_Schedule__c WHERE Proposals__c = :singProposal.Id LIMIT 1];
        
        // Create SING template
        TemplateURLByName__c singTemplate = new TemplateURLByName__c(
            Name = 'SING Template Test',
            Object_Name__c = 'Application_Proposal__c',
            Formula_Field_Name__c = 'IF_tranche__c'
        );
        insert singTemplate;
        
        Test.startTest();
        IFReleaseTrancheLetter.GenerateCongaTemplatesUsingCS(singProposal.Id, 'SING Template Test', ds.Id);
        Test.stopTest();
    }
    
    @isTest
    static void testGenerateCongaTemplatesUsingCS_DefaultRecordType(){
        setupCongaCalloutMock();
        // Get test data
        Application_Proposal__c ifProposal = [SELECT Id FROM Application_Proposal__c WHERE RecordType.Name = 'Industrial Fellowship' LIMIT 1];
        Disbursement_Schedule__c ds = [SELECT Id FROM Disbursement_Schedule__c WHERE Proposals__c = :ifProposal.Id LIMIT 1];
        
        // Create a template for default case
        TemplateURLByName__c defaultTemplate = new TemplateURLByName__c(
            Name = 'Default Template Test',
            Object_Name__c = 'Application_Proposal__c',
            Formula_Field_Name__c = 'IF_tranche__c'
        );
        insert defaultTemplate;
        
        Test.startTest();
        IFReleaseTrancheLetter.GenerateCongaTemplatesUsingCS(ifProposal.Id, 'Default Template Test', ds.Id);
        Test.stopTest();
    }
    
    @isTest
    static void testGenerateCongaTemplate(){
        setupCongaCalloutMock();
        Test.startTest();
        IFReleaseTrancheLetter.generateCongaTemplate('testQuery', 'TestTemplate');
        Test.stopTest();
    }
    
    @isTest
    static void testGenerateCongaTemplatesUsingCS_NoAttachments(){
        setupCongaCalloutMock();
        // Create test data without attachments
        Account acc = new Account(Name = 'Test Account No Att', BillingCountry = 'India');
        insert acc;
        
        Contact con = new Contact(FirstName = 'Test', LastName = 'Contact', AccountId = acc.Id);
        insert con;
        
        Year__c yc = new Year__c(Name = '2024', Is_Active__c = true, Is_Current_Year__c = true);
        insert yc;
        
        YealyCall__c yearlyCall = new YealyCall__c();
        yearlyCall.Year__c = yc.Id;
        insert yearlyCall;
        
        Id industrialFellowshipRT = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Industrial Fellowship').getRecordTypeId();
        Application_Proposal__c prop = new Application_Proposal__c(
            Title_Of__c = 'Test Proposal No Att',
            RecordTypeId = industrialFellowshipRT,
            yearly_Call__c = yearlyCall.Id
        );
        insert prop;
        
        Applicant_Proposal_Association__c assoc = new Applicant_Proposal_Association__c(
            Proposals__c = prop.Id,
            Contact__c = con.Id
        );
        insert assoc;
        
        Disbursement_Schedule__c ds = new Disbursement_Schedule__c(
            Proposals__c = prop.Id,
            tranche__c = '2'
        );
        insert ds;
        
        TemplateURLByName__c template = new TemplateURLByName__c(
            Name = 'IF Tranche Letter No Att',
            Object_Name__c = 'Application_Proposal__c',
            Formula_Field_Name__c = 'IF_tranche__c'
        );
        insert template;

        Test.startTest();
        IFReleaseTrancheLetter.GenerateCongaTemplatesUsingCS(prop.Id, 'IF Tranche Letter No Att', ds.Id);
        Test.stopTest();
    }
    
    @isTest
    static void testIFTrancheLetter_NoUserDocuments(){
        setupCongaCalloutMock();
        // Create minimal test data without User Documents
        Account acc = new Account(Name = 'Test Account No Docs', BillingCountry = 'India');
        insert acc;
        
        Contact con = new Contact(FirstName = 'Test', LastName = 'Contact', AccountId = acc.Id);
        insert con;
        
        Year__c yc = new Year__c(Name = '2024', Is_Active__c = true, Is_Current_Year__c = true);
        insert yc;
        
        YealyCall__c yearlyCall = new YealyCall__c();
        yearlyCall.Year__c = yc.Id;
        insert yearlyCall;
        
        Id industrialFellowshipRT = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Industrial Fellowship').getRecordTypeId();
        Application_Proposal__c prop = new Application_Proposal__c(
            Title_Of__c = 'Test Proposal No Docs',
            RecordTypeId = industrialFellowshipRT,
            yearly_Call__c = yearlyCall.Id
        );
        insert prop;
        
        Applicant_Proposal_Association__c assoc = new Applicant_Proposal_Association__c(
            Proposals__c = prop.Id,
            Contact__c = con.Id
        );
        insert assoc;
        
        Disbursement_Schedule__c ds = new Disbursement_Schedule__c(
            Proposals__c = prop.Id,
            tranche__c = '2'
        );
        insert ds;
        
        TemplateURLByName__c template = new TemplateURLByName__c(
            Name = 'IF Tranche Letter No Docs',
            Object_Name__c = 'Application_Proposal__c',
            Formula_Field_Name__c = 'IF_tranche__c'
        );
        insert template;

        Test.startTest();
        List<String> proId = new List<String>{ds.Id};
        IFReleaseTrancheLetter.ifTrancheLetter(proId);
        Test.stopTest();
    }
    
    @isTest
    static void testIFTrancheLetter_SingleItem(){
        setupCongaCalloutMock();
        // Create minimal test data
        Account acc = new Account(Name = 'Test Account Single', BillingCountry = 'India');
        insert acc;
        
        Contact con = new Contact(FirstName = 'Test', LastName = 'Contact', AccountId = acc.Id);
        insert con;
        
        Year__c yc = new Year__c(Name = '2024', Is_Active__c = true, Is_Current_Year__c = true);
        insert yc;
        
        YealyCall__c yearlyCall = new YealyCall__c();
        yearlyCall.Year__c = yc.Id;
        insert yearlyCall;
        
        Id industrialFellowshipRT = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Industrial Fellowship').getRecordTypeId();
        Application_Proposal__c prop = new Application_Proposal__c(
            Title_Of__c = 'Test Proposal Single',
            RecordTypeId = industrialFellowshipRT,
            yearly_Call__c = yearlyCall.Id
        );
        insert prop;
        
        Applicant_Proposal_Association__c assoc = new Applicant_Proposal_Association__c(
            Proposals__c = prop.Id,
            Contact__c = con.Id
        );
        insert assoc;
        
        Disbursement_Schedule__c ds = new Disbursement_Schedule__c(
            Proposals__c = prop.Id,
            tranche__c = '2'
        );
        insert ds;
        
        TemplateURLByName__c template = new TemplateURLByName__c(
            Name = 'IF Tranche Letter Single',
            Object_Name__c = 'Application_Proposal__c',
            Formula_Field_Name__c = 'IF_tranche__c'
        );
        insert template;

        Test.startTest();
        List<String> proId = new List<String>{ds.Id};
        System.debug('Testing with valid DS ID: ' + ds.Id);
        IFReleaseTrancheLetter.ifTrancheLetter(proId);
        Test.stopTest();
    }
}