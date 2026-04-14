/**
 * Test class for s_class
 * Covers updateData(String campaignName, Id proposalId)
 * Uses HTTP mock so triggers that perform callouts (e.g. on Application_Proposal__c) do not fail.
 */
@isTest
private class s_classTest {

    @isTest
    static void testUpdateData_NullParams() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());
        Test.startTest();
        s_class.updateData(null, null);
        s_class.updateData('', null);
        s_class.updateData('pecfar', null);
        Test.stopTest();
        // Early return when params are null/blank; no exception
    }

    @isTest
    static void testUpdateData_NoMatchingProposal() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());
        Id fakeId = (Id) (Schema.SObjectType.Application_Proposal__c.getKeyPrefix() + '0'.repeat(12));
        Test.startTest();
        s_class.updateData('pecfar', fakeId);
        Test.stopTest();
        // No proposal matches campaign + id → early return; no exception
    }

    @isTest
    static void testUpdateData_WithMatchingProposal() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());

        Campaign camp = new Campaign(Name = 'pecfar');
        insert camp;

        Id rtId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Industrial Fellowship').getRecordTypeId();
        Application_Proposal__c prop = new Application_Proposal__c(
            RecordTypeId = rtId,
            Campaign__c = camp.Id,
            Stage__c = '1st Stage'
        );
        insert prop;

        Test.startTest();
        s_class.updateData('pecfar', prop.Id);
        Test.stopTest();

        // Proposal is found; method runs (no contacts so no APAs/child updates); no exception
    }

    @isTest
    static void testUpdateData_FullFlowWithContactAndAPA() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());

        Campaign camp = new Campaign(Name = 'pecfar');
        insert camp;

        Id rtId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Industrial Fellowship').getRecordTypeId();
        Application_Proposal__c prop = new Application_Proposal__c(
            RecordTypeId = rtId,
            Campaign__c = camp.Id,
            Stage__c = '1st Stage'
        );
        insert prop;

        Account acc = new Account(Name = 'Test Account');
        insert acc;
        acc.Proposals__c = prop.Id;
        update acc;

        Contact con = new Contact(
            LastName = 'TestContact',
            AccountId = acc.Id,
            Proposals__c = prop.Id
        );
        insert con;

        Test.startTest();
        s_class.updateData('pecfar', prop.Id);
        Test.stopTest();

        // Proposal + Contact found; APA created and inserted; maps built; Account query runs
        List<Applicant_Proposal_Association__c> apas = [
            SELECT Id, Contact__c, Proposals__c
            FROM Applicant_Proposal_Association__c
            WHERE Proposals__c = :prop.Id AND Contact__c = :con.Id
        ];
        System.assertEquals(1, apas.size(), 'One APA should be created for the contact-proposal pair');
    }

    @isTest
    static void testUpdateData_FullFlowWithContactChildAndAccountChild() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());

        Campaign camp = new Campaign(Name = 'pecfar');
        insert camp;

        Id rtId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Industrial Fellowship').getRecordTypeId();
        Application_Proposal__c prop = new Application_Proposal__c(
            RecordTypeId = rtId,
            Campaign__c = camp.Id,
            Stage__c = '1st Stage'
        );
        insert prop;

        Account acc = new Account(Name = 'Test Account');
        insert acc;
        acc.Proposals__c = prop.Id;
        update acc;

        Contact con = new Contact(
            LastName = 'TestContact',
            AccountId = acc.Id,
            Proposals__c = prop.Id
        );
        insert con;

        Education_Details__c edu = new Education_Details__c(
            Contact__c = con.Id,
            Institution_Name__c = 'Test Institution'
        );
        insert edu;

        Financial_Contribution__c fc = new Financial_Contribution__c(Account__c = acc.Id);
        insert fc;

        Test.startTest();
        s_class.updateData('pecfar', prop.Id);
        Test.stopTest();

        edu = [SELECT Id, Applicant_Proposal_Association__c FROM Education_Details__c WHERE Id = :edu.Id];
        System.assertNotEquals(null, edu.Applicant_Proposal_Association__c, 'Education detail should be linked to APA');

        fc = [SELECT Id, Applicant_Proposal_Association__c FROM Financial_Contribution__c WHERE Id = :fc.Id];
        System.assertNotEquals(null, fc.Applicant_Proposal_Association__c, 'Financial contribution should be linked to APA');
    }

    @isTest
    static void testUpdateData_AllContactAndAccountChildTypes() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());

        Campaign camp = new Campaign(Name = 'pecfar');
        insert camp;

        Id rtId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Industrial Fellowship').getRecordTypeId();
        Application_Proposal__c prop = new Application_Proposal__c(
            RecordTypeId = rtId,
            Campaign__c = camp.Id,
            Stage__c = '1st Stage'
        );
        insert prop;

        Account acc = new Account(Name = 'Test Account');
        insert acc;
        acc.Proposals__c = prop.Id;
        update acc;

        Contact con = new Contact(
            LastName = 'TestContact',
            AccountId = acc.Id,
            Proposals__c = prop.Id
        );
        insert con;

        Education_Details__c edu = new Education_Details__c(Contact__c = con.Id, Institution_Name__c = 'Edu');
        insert edu;

        Employment_Details__c empl = new Employment_Details__c(Contact__c = con.Id, Organization_Name__c = 'Emp');
        insert empl;

        Publications_Patents__c pub = new Publications_Patents__c(Contact__c = con.Id);
        insert pub;

        User_Document__c udoc = new User_Document__c(Contact__c = con.Id, Name = 'UDoc');
        insert udoc;

        Achievement__c achv = new Achievement__c(Contact__c = con.Id);
        insert achv;

        Financial_Contribution__c fc = new Financial_Contribution__c(Account__c = acc.Id);
        insert fc;

        Existing_Grants__c eg = new Existing_Grants__c(Account__c = acc.Id);
        insert eg;

        Yearly_Expense__c ye = new Yearly_Expense__c(Account__c = acc.Id, Proposals__c = prop.Id);
        insert ye;

        Test.startTest();
        s_class.updateData('pecfar', prop.Id);
        Test.stopTest();

        edu = [SELECT Applicant_Proposal_Association__c FROM Education_Details__c WHERE Id = :edu.Id];
        System.assertNotEquals(null, edu.Applicant_Proposal_Association__c);

        empl = [SELECT Applicant_Proposal_Association__c FROM Employment_Details__c WHERE Id = :empl.Id];
        System.assertNotEquals(null, empl.Applicant_Proposal_Association__c);

        pub = [SELECT Applicant_Proposal_Association__c FROM Publications_Patents__c WHERE Id = :pub.Id];
        System.assertNotEquals(null, pub.Applicant_Proposal_Association__c);

        udoc = [SELECT Applicant_Proposal_Association__c FROM User_Document__c WHERE Id = :udoc.Id];
        System.assertNotEquals(null, udoc.Applicant_Proposal_Association__c);

        achv = [SELECT Applicant_Proposal_Association__c FROM Achievement__c WHERE Id = :achv.Id];
        System.assertNotEquals(null, achv.Applicant_Proposal_Association__c);

        fc = [SELECT Applicant_Proposal_Association__c FROM Financial_Contribution__c WHERE Id = :fc.Id];
        System.assertNotEquals(null, fc.Applicant_Proposal_Association__c);

        eg = [SELECT Applicant_Proposal_Association__c FROM Existing_Grants__c WHERE Id = :eg.Id];
        System.assertNotEquals(null, eg.Applicant_Proposal_Association__c);

        ye = [SELECT Applicant_Proposal_Association__c FROM Yearly_Expense__c WHERE Id = :ye.Id];
        System.assertNotEquals(null, ye.Applicant_Proposal_Association__c);
    }

    @isTest
    static void testUpdateData_ExistingAPA() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());

        Campaign camp = new Campaign(Name = 'pecfar');
        insert camp;

        Id rtId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Industrial Fellowship').getRecordTypeId();
        Application_Proposal__c prop = new Application_Proposal__c(
            RecordTypeId = rtId,
            Campaign__c = camp.Id,
            Stage__c = '1st Stage'
        );
        insert prop;

        Account acc = new Account(Name = 'Test Account');
        insert acc;
        acc.Proposals__c = prop.Id;
        update acc;

        Contact con = new Contact(
            LastName = 'TestContact',
            AccountId = acc.Id,
            Proposals__c = prop.Id
        );
        insert con;

        Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c(
            Contact__c = con.Id,
            Proposals__c = prop.Id
        );
        insert apa;

        Test.startTest();
        s_class.updateData('pecfar', prop.Id);
        Test.stopTest();

        // No new APA created; existing APA used
        List<Applicant_Proposal_Association__c> apas = [
            SELECT Id FROM Applicant_Proposal_Association__c
            WHERE Proposals__c = :prop.Id AND Contact__c = :con.Id
        ];
        System.assertEquals(1, apas.size(), 'Should still have only one APA (existing)');
    }

    private class MockHttpResponse implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200);
            res.setHeader('Content-Type', 'application/json');
            res.setBody('{}');
            return res;
        }
    }
}