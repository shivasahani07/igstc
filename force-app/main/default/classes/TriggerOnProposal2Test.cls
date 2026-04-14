@isTest
public class TriggerOnProposal2Test {

    @testSetup
    static void setup() {
        Account testAccount = new Account(
            Name = 'Test Account',
            BillingCountry = 'India',
            Academia__c = true,
            Industry__c = false
        );
        insert testAccount;

        Contact testContact = new Contact(
            FirstName = 'Test',
            LastName = 'Contact',
            AccountId = testAccount.Id,
            Email = 'test@example.com'
        );
        insert testContact;

        List<Expense_Category_Master__c> ecms = new List<Expense_Category_Master__c>();
        ecms.add(new Expense_Category_Master__c(
            Name = 'Manpower',
            Index__c = 1,
            Campaign__c = 'Two Plus Two',
            Accounts_Country__c = null,
            Account_Type__c = null
        ));
        ecms.add(new Expense_Category_Master__c(
            Name = 'Travel',
            Index__c = 2,
            Campaign__c = 'PECFAR',
            Accounts_Country__c = 'India',
            Account_Type__c = null
        ));
        ecms.add(new Expense_Category_Master__c(
            Name = 'Equipment',
            Index__c = 3,
            Campaign__c = 'PECFAR',
            Accounts_Country__c = null,
            Account_Type__c = null
        ));
        ecms.add(new Expense_Category_Master__c(
            Name = 'Consumables',
            Index__c = 4,
            Campaign__c = 'WISER',
            Accounts_Country__c = null,
            Account_Type__c = 'Academia'
        ));
        insert ecms;

        List<Expense_Detail_Master__c> edms = new List<Expense_Detail_Master__c>();
        edms.add(new Expense_Detail_Master__c(
            Index__c = 1,
            Expense_Category_Master__c = ecms[0].Id,
            Expense_Detail_Description__c = 'Senior Researcher Salary',
            Campaign__c = 'PECFAR',
            Accounts_Country__c = null,
            Account_Type__c = null
        ));
        edms.add(new Expense_Detail_Master__c(
            Index__c = 1,
            Expense_Category_Master__c = ecms[1].Id,
            Expense_Detail_Description__c = 'International Travel Expenses',
            Campaign__c = 'PECFAR',
            Accounts_Country__c = 'India',
            Account_Type__c = null
        ));
        edms.add(new Expense_Detail_Master__c(
            Index__c = 1,
            Expense_Category_Master__c = ecms[2].Id,
            Expense_Detail_Description__c = 'Laboratory Equipment',
            Campaign__c = 'PECFAR',
            Accounts_Country__c = null,
            Account_Type__c = null
        ));
        edms.add(new Expense_Detail_Master__c(
            Index__c = 1,
            Expense_Category_Master__c = ecms[3].Id,
            Expense_Detail_Description__c = 'Research Materials and Supplies',
            Campaign__c = null,
            Accounts_Country__c = null,
            Account_Type__c = 'Academia'
        ));
        insert edms;
    }

    private static Id getProposalRecordTypeId() {
        Map<String, Schema.RecordTypeInfo> rtByName = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName();
        if (rtByName != null && rtByName.containsKey('Industrial Fellowship')) {
            return rtByName.get('Industrial Fellowship').getRecordTypeId();
        }
        if (rtByName != null) {
            for (Schema.RecordTypeInfo rti : rtByName.values()) {
                if (rti != null && rti.isAvailable()) {
                    return rti.getRecordTypeId();
                }
            }
        }
        return null;
    }

    @isTest
    static void testAfterUpdate_ExpectedDeliverables_UpdatesAPA() {
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());

        Contact testContact = [SELECT Id FROM Contact LIMIT 1];

        Application_Proposal__c proposal = new Application_Proposal__c(
            RecordTypeId = getProposalRecordTypeId(),
            Stage__c = '1st Stage',
            Proposal_Stages__c = 'Draft',
            Duration_In_Months_Max_36__c = 12,
            Expected_Deliverables__c = 'a;b'
        );
        insert proposal;

        Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c(
            Proposals__c = proposal.Id,
            Contact__c = testContact.Id
        );
        insert apa;

        Test.startTest();
        proposal.Stage__c = '2nd Stage';
        proposal.Expected_Deliverables__c = 'one;two;three';
        update proposal;
        Test.stopTest();

        Applicant_Proposal_Association__c refreshed = [
            SELECT Id, Expected_Deliverables_Points__c
            FROM Applicant_Proposal_Association__c
            WHERE Id = :apa.Id
        ];

        System.assertEquals(
            KeywordFormatter.formatToNumberedPoints('one;two;three'),
            refreshed.Expected_Deliverables_Points__c,
            'APA Expected_Deliverables_Points__c should be updated when proposal Expected_Deliverables__c changes'
        );
    }

    @isTest
    static void testAfterUpdate_NoDeliverablesChange_DoesNotOverwriteAPA() {
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());

        Contact testContact = [SELECT Id FROM Contact LIMIT 1];

        Application_Proposal__c proposal = new Application_Proposal__c(
            RecordTypeId = getProposalRecordTypeId(),
            Stage__c = '1st Stage',
            Proposal_Stages__c = 'Draft',
            Duration_In_Months_Max_36__c = 12,
            Expected_Deliverables__c = 'one;two'
        );
        insert proposal;

        Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c(
            Proposals__c = proposal.Id,
            Contact__c = testContact.Id,
            Expected_Deliverables_Points__c = 'SHOULD_STAY'
        );
        insert apa;

        Test.startTest();
        proposal.Stage__c = '2nd Stage';
        update proposal;
        Test.stopTest();

        Applicant_Proposal_Association__c refreshed = [
            SELECT Id, Expected_Deliverables_Points__c
            FROM Applicant_Proposal_Association__c
            WHERE Id = :apa.Id
        ];

        System.assertEquals(
            'SHOULD_STAY',
            refreshed.Expected_Deliverables_Points__c,
            'APA points should not be overwritten if Expected_Deliverables__c did not change'
        );
    }

    @isTest
    static void testAfterUpdate_Bulk_ExpectedDeliverables() {
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());

        Contact testContact = [SELECT Id FROM Contact LIMIT 1];

        List<Application_Proposal__c> proposals = new List<Application_Proposal__c>();
        for (Integer i = 0; i < 5; i++) {
            proposals.add(new Application_Proposal__c(
                RecordTypeId = getProposalRecordTypeId(),
                Stage__c = '1st Stage',
                Proposal_Stages__c = 'Draft',
                Duration_In_Months_Max_36__c = 12,
                Expected_Deliverables__c = 'x;y'
            ));
        }
        insert proposals;

        List<Applicant_Proposal_Association__c> apas = new List<Applicant_Proposal_Association__c>();
        for (Application_Proposal__c p : proposals) {
            apas.add(new Applicant_Proposal_Association__c(
                Proposals__c = p.Id,
                Contact__c = testContact.Id
            ));
        }
        insert apas;

        for (Integer i = 0; i < proposals.size(); i++) {
            proposals[i].Stage__c = '2nd Stage';
            proposals[i].Expected_Deliverables__c = 'bulk;' + String.valueOf(i);
        }

        Test.startTest();
        update proposals;
        Test.stopTest();

        Map<Id, Applicant_Proposal_Association__c> apaByProposalId = new Map<Id, Applicant_Proposal_Association__c>();
        for (Applicant_Proposal_Association__c a : [
            SELECT Id, Proposals__c, Expected_Deliverables_Points__c
            FROM Applicant_Proposal_Association__c
            WHERE Proposals__c IN :proposals
        ]) {
            apaByProposalId.put(a.Proposals__c, a);
        }

        System.assertEquals(proposals.size(), apaByProposalId.size());
        for (Integer i = 0; i < proposals.size(); i++) {
            Applicant_Proposal_Association__c a = apaByProposalId.get(proposals[i].Id);
            System.assertEquals(
                KeywordFormatter.formatToNumberedPoints('bulk;' + String.valueOf(i)),
                a.Expected_Deliverables_Points__c
            );
        }
    }
}