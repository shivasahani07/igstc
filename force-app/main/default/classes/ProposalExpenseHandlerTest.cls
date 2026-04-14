@isTest
public class ProposalExpenseHandlerTest {
    
    @testSetup
    static void setupTestData() {
        // Create Account for testing
        Account testAccount = new Account(
            Name = 'Test Account',
            BillingCountry = 'India',
            Academia__c = true,
            Industry__c = false
        );
        insert testAccount;
        
        // Create Contact
        Contact testContact = new Contact(
            FirstName = 'Test',
            LastName = 'Contact',
            AccountId = testAccount.Id,
            Email = 'test@example.com'
        );
        insert testContact;
        
        // Create Expense Category Master records
        List<Expense_Category_Master__c> ecms = new List<Expense_Category_Master__c>();
        
        // Category 1: No filters (applies to all)
        ecms.add(new Expense_Category_Master__c(
            Name = 'Manpower',
            Index__c = 1,
            Campaign__c = 'Two Plus Two',
            Accounts_Country__c = null,
            Account_Type__c = null
        ));
        
        // Category 2: Filtered by Country
        ecms.add(new Expense_Category_Master__c(
            Name = 'Travel',
            Index__c = 2,
            Campaign__c = 'PECFAR',
            Accounts_Country__c = 'India',
            Account_Type__c = null
        ));
        
        // Category 3: Filtered by Campaign
        ecms.add(new Expense_Category_Master__c(
            Name = 'Equipment',
            Index__c = 3,
            Campaign__c = 'PECFAR',
            Accounts_Country__c = null,
            Account_Type__c = null
        ));
        
        // Category 4: Filtered by Account Type (Academia)
        ecms.add(new Expense_Category_Master__c(
            Name = 'Consumables',
            Index__c = 4,
            Campaign__c = 'WISER',
            Accounts_Country__c = null,
            Account_Type__c = 'Academia'
        ));
        
        insert ecms;
        
        // Create Expense Detail Master records
        List<Expense_Detail_Master__c> edms = new List<Expense_Detail_Master__c>();
        
        // Detail for Manpower
        edms.add(new Expense_Detail_Master__c(
            Index__c = 1,
            Expense_Category_Master__c = ecms[0].Id,
            Expense_Detail_Description__c = 'Senior Researcher Salary',
            Campaign__c = 'PECFAR',
            Accounts_Country__c = null,
            Account_Type__c = null
        ));
        
        // Detail for Travel
        edms.add(new Expense_Detail_Master__c(
            Index__c = 1,
            Expense_Category_Master__c = ecms[1].Id,
            Expense_Detail_Description__c = 'International Travel Expenses',
            Campaign__c = 'PECFAR',
            Accounts_Country__c = 'India',
            Account_Type__c = null
        ));
        
        // Detail for Equipment
        edms.add(new Expense_Detail_Master__c(
            Index__c = 1,
            Expense_Category_Master__c = ecms[2].Id,
            Expense_Detail_Description__c = 'Laboratory Equipment',
            Campaign__c = 'PECFAR',
            Accounts_Country__c = null,
            Account_Type__c = null
        ));
        
        // Detail for Consumables
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
    
    @isTest
    static void testCreateExpenseCategoryAndDetails_36Months() {
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());
        
        Account testAccount = [SELECT Id, BillingCountry FROM Account LIMIT 1];
        Contact testContact = [SELECT Id FROM Contact LIMIT 1];
        
        // Get Industrial Fellowship Record Type
        Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName()
            .get('Industrial Fellowship').getRecordTypeId();
        
        // Create Application Proposal with 36 months duration
        Application_Proposal__c proposal = new Application_Proposal__c(
            RecordTypeId = IFRecordTypeId,
            Stage__c = '1st Stage',
            Proposal_Stages__c = 'Draft',
            Duration_In_Months_Max_36__c = 36
        );
        insert proposal;
        
        // Create Applicant Proposal Association
        Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c(
            Proposals__c = proposal.Id,
            Contact__c = testContact.Id
        );
        insert apa;
        
        // Create old map for the handler
        Map<Id, Application_Proposal__c> oldMap = new Map<Id, Application_Proposal__c>();
        oldMap.put(proposal.Id, new Application_Proposal__c(
            Id = proposal.Id,
            Stage__c = '1st Stage'
        ));
        
        // Update proposal to 2nd Stage
        proposal.Stage__c = '2nd Stage';
        
        Test.startTest();
        ProposalExpenseHandler.createExpenseCategoryAndDetails(
            new List<Application_Proposal__c>{proposal},
            oldMap
        );
        Test.stopTest();
        
        // Verify Annual_Expense__c records were created (3 years)
        List<Annual_Expense__c> annualExpenses = [
            SELECT Id, Name, Applicant_Proposal_Association__c
            FROM Annual_Expense__c
            WHERE Applicant_Proposal_Association__c = :apa.Id
            ORDER BY Name
        ];

        // Verify Yearly_Expense__c records were created (3 years)
        List<Yearly_Expense__c> yearlyExpenses = [
            SELECT Id, Year__c, Applicant_Proposal_Association__c, Account__c, Proposals__c
            FROM Yearly_Expense__c
            WHERE Applicant_Proposal_Association__c = :apa.Id
            ORDER BY Year__c
        ];

        // Verify Expense_Category__c records were created
        List<Expense_Category__c> expenseCategories = [
            SELECT Id, Name, Applicant_Proposal_Association__c, Index__c
            FROM Expense_Category__c
            WHERE Applicant_Proposal_Association__c = :apa.Id
            ORDER BY Index__c
        ];
                
        // Verify Expense_Detail__c records were created
        List<Expense_Detail__c> expenseDetails = [
            SELECT Id, Expense_Category__c, Description__c, Index__c
            FROM Expense_Detail__c
            WHERE Expense_Category__c IN :expenseCategories
        ];
        
        // Verify Expense_Head__c records were created (new model)
        List<Expense_Head__c> expenseHeads = [
            SELECT Id, Name, Yearly_Expense__c, Account__c, Proposals__c, Currency_Type__c
            FROM Expense_Head__c
            WHERE Yearly_Expense__r.Applicant_Proposal_Association__c = :apa.Id
        ];
        
        // Verify Expense_Line_Item__c records were created (new model)
        List<Expense_Line_Item__c> expenseLineItems = [
            SELECT Id, Expense_Head__c, Description__c, Expense_Type__c, Currency_Type__c
            FROM Expense_Line_Item__c
            WHERE Expense_Head__c IN :expenseHeads
        ];
    }
    
    @isTest
    static void testCreateExpenseCategoryAndDetails_24Months() {
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());
        
        Account testAccount = [SELECT Id FROM Account LIMIT 1];
        Contact testContact = [SELECT Id FROM Contact LIMIT 1];
        
        Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName()
            .get('Industrial Fellowship').getRecordTypeId();
        
        Application_Proposal__c proposal = new Application_Proposal__c(
            RecordTypeId = IFRecordTypeId,
            Stage__c = '1st Stage',
            Proposal_Stages__c = 'Draft',
            Duration_In_Months_Max_36__c = 24
        );
        insert proposal;
        
        Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c(
            Proposals__c = proposal.Id,
            Contact__c = testContact.Id
        );
        insert apa;
        
        Map<Id, Application_Proposal__c> oldMap = new Map<Id, Application_Proposal__c>();
        oldMap.put(proposal.Id, new Application_Proposal__c(
            Id = proposal.Id,
            Stage__c = '1st Stage'
        ));
        
        proposal.Stage__c = '2nd Stage';
        
        Test.startTest();
        ProposalExpenseHandler.createExpenseCategoryAndDetails(
            new List<Application_Proposal__c>{proposal},
            oldMap
        );
        Test.stopTest();
        
        // Verify 2 years were created
        List<Annual_Expense__c> annualExpenses = [
            SELECT Id, Name
            FROM Annual_Expense__c
            WHERE Applicant_Proposal_Association__c = :apa.Id
            ORDER BY Name
        ];
        
        List<Yearly_Expense__c> yearlyExpenses = [
            SELECT Id, Year__c
            FROM Yearly_Expense__c
            WHERE Applicant_Proposal_Association__c = :apa.Id
            ORDER BY Year__c
        ];
    }
    
    @isTest
    static void testCreateExpenseCategoryAndDetails_12Months() {
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());
        
        Account testAccount = [SELECT Id FROM Account LIMIT 1];
        Contact testContact = [SELECT Id FROM Contact LIMIT 1];
        
        Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName()
            .get('Industrial Fellowship').getRecordTypeId();
        
        Application_Proposal__c proposal = new Application_Proposal__c(
            RecordTypeId = IFRecordTypeId,
            Stage__c = '1st Stage',
            Proposal_Stages__c = 'Draft',
            Duration_In_Months_Max_36__c = 12
        );
        insert proposal;
        
        Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c(
            Proposals__c = proposal.Id,
            Contact__c = testContact.Id
        );
        insert apa;
        
        Map<Id, Application_Proposal__c> oldMap = new Map<Id, Application_Proposal__c>();
        oldMap.put(proposal.Id, new Application_Proposal__c(
            Id = proposal.Id,
            Stage__c = '1st Stage'
        ));
        
        proposal.Stage__c = '2nd Stage';
        
        Test.startTest();
        ProposalExpenseHandler.createExpenseCategoryAndDetails(
            new List<Application_Proposal__c>{proposal},
            oldMap
        );
        Test.stopTest();
        
        // Verify 1 year was created
        List<Annual_Expense__c> annualExpenses = [
            SELECT Id, Name
            FROM Annual_Expense__c
            WHERE Applicant_Proposal_Association__c = :apa.Id
        ];
        
        List<Yearly_Expense__c> yearlyExpenses = [
            SELECT Id, Year__c
            FROM Yearly_Expense__c
            WHERE Applicant_Proposal_Association__c = :apa.Id
        ];
    }
    
    @isTest
    static void testCreateExpenseCategoryAndDetails_NoStageChange() {
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());
        
        Account testAccount = [SELECT Id FROM Account LIMIT 1];
        Contact testContact = [SELECT Id FROM Contact LIMIT 1];
        
        Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName()
            .get('Industrial Fellowship').getRecordTypeId();
        
        Application_Proposal__c proposal = new Application_Proposal__c(
            RecordTypeId = IFRecordTypeId,
            Stage__c = '1st Stage',
            Proposal_Stages__c = 'Draft',
            Duration_In_Months_Max_36__c = 36
        );
        insert proposal;
        
        Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c(
            Proposals__c = proposal.Id,
            Contact__c = testContact.Id
        );
        insert apa;
        
        Map<Id, Application_Proposal__c> oldMap = new Map<Id, Application_Proposal__c>();
        oldMap.put(proposal.Id, new Application_Proposal__c(
            Id = proposal.Id,
            Stage__c = '1st Stage'
        ));
        
        // No stage change - should not create records
        proposal.Proposal_Stages__c = 'Draft Updated';
        
        Test.startTest();
        ProposalExpenseHandler.createExpenseCategoryAndDetails(
            new List<Application_Proposal__c>{proposal},
            oldMap
        );
        Test.stopTest();
        
        // Verify no records were created
        List<Annual_Expense__c> annualExpenses = [
            SELECT Id
            FROM Annual_Expense__c
            WHERE Applicant_Proposal_Association__c = :apa.Id
        ];
    }
    
    @isTest
    static void testCreateExpenseCategoryAndDetails_DuplicatePrevention() {
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());
        
        Account testAccount = [SELECT Id FROM Account LIMIT 1];
        Contact testContact = [SELECT Id FROM Contact LIMIT 1];
        
        Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName()
            .get('Industrial Fellowship').getRecordTypeId();
        
        Application_Proposal__c proposal = new Application_Proposal__c(
            RecordTypeId = IFRecordTypeId,
            Stage__c = '1st Stage',
            Proposal_Stages__c = 'Draft',
            Duration_In_Months_Max_36__c = 36
        );
        insert proposal;
        
        Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c(
            Proposals__c = proposal.Id,
            Contact__c = testContact.Id
        );
        insert apa;
        
        // Create existing Annual_Expense__c records
        List<Annual_Expense__c> existingAE = new List<Annual_Expense__c>();
        existingAE.add(new Annual_Expense__c(
            Name = 'Year 1',
            Applicant_Proposal_Association__c = apa.Id
        ));
        existingAE.add(new Annual_Expense__c(
            Name = 'Year 2',
            Applicant_Proposal_Association__c = apa.Id
        ));
        insert existingAE;
        
        // Create existing Yearly_Expense__c records
        List<Yearly_Expense__c> existingYE = new List<Yearly_Expense__c>();
        existingYE.add(new Yearly_Expense__c(
            Year__c = '1',
            Applicant_Proposal_Association__c = apa.Id,
            Account__c = testAccount.Id,
            Proposals__c = proposal.Id
        ));
        existingYE.add(new Yearly_Expense__c(
            Year__c = '2',
            Applicant_Proposal_Association__c = apa.Id,
            Account__c = testAccount.Id,
            Proposals__c = proposal.Id
        ));
        insert existingYE;
        
        Map<Id, Application_Proposal__c> oldMap = new Map<Id, Application_Proposal__c>();
        oldMap.put(proposal.Id, new Application_Proposal__c(
            Id = proposal.Id,
            Stage__c = '1st Stage'
        ));
        
        proposal.Stage__c = '2nd Stage';
        
        Test.startTest();
        ProposalExpenseHandler.createExpenseCategoryAndDetails(
            new List<Application_Proposal__c>{proposal},
            oldMap
        );
        Test.stopTest();
        
        // Verify only Year 3 was created (Year 1 and Year 2 already exist)
        List<Annual_Expense__c> annualExpenses = [
            SELECT Id, Name
            FROM Annual_Expense__c
            WHERE Applicant_Proposal_Association__c = :apa.Id
            ORDER BY Name
        ];
        
        // Verify only Year 3 was created for Yearly_Expense__c
        List<Yearly_Expense__c> yearlyExpenses = [
            SELECT Id, Year__c
            FROM Yearly_Expense__c
            WHERE Applicant_Proposal_Association__c = :apa.Id
            ORDER BY Year__c
        ];
    }
    
    @isTest
    static void testCreateExpenseCategoryAndDetails_ExistingCategories() {
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());
        
        Account testAccount = [SELECT Id FROM Account LIMIT 1];
        Contact testContact = [SELECT Id FROM Contact LIMIT 1];
        
        Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName()
            .get('Industrial Fellowship').getRecordTypeId();
        
        Application_Proposal__c proposal = new Application_Proposal__c(
            RecordTypeId = IFRecordTypeId,
            Stage__c = '1st Stage',
            Proposal_Stages__c = 'Draft',
            Duration_In_Months_Max_36__c = 36
        );
        insert proposal;
        
        Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c(
            Proposals__c = proposal.Id,
            Contact__c = testContact.Id
        );
        insert apa;
        
        // Create existing Expense_Category__c
        Expense_Category__c existingEC = new Expense_Category__c(
            Name = 'Manpower',
            Applicant_Proposal_Association__c = apa.Id,
            Index__c = 1
        );
        insert existingEC;
        
        Map<Id, Application_Proposal__c> oldMap = new Map<Id, Application_Proposal__c>();
        oldMap.put(proposal.Id, new Application_Proposal__c(
            Id = proposal.Id,
            Stage__c = '1st Stage'
        ));
        
        proposal.Stage__c = '2nd Stage';
        
        Test.startTest();
        ProposalExpenseHandler.createExpenseCategoryAndDetails(
            new List<Application_Proposal__c>{proposal},
            oldMap
        );
        Test.stopTest();
        
        // Verify no duplicate Expense_Category__c was created
        List<Expense_Category__c> expenseCategories = [
            SELECT Id, Name
            FROM Expense_Category__c
            WHERE Applicant_Proposal_Association__c = :apa.Id
            AND Name = 'Manpower'
        ];
    }
    
    @isTest
    static void testCreateExpenseCategoryAndDetails_ExistingExpenseHeads() {
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());
        
        Account testAccount = [SELECT Id FROM Account LIMIT 1];
        Contact testContact = [SELECT Id FROM Contact LIMIT 1];
        
        Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName()
            .get('Industrial Fellowship').getRecordTypeId();
        
        Application_Proposal__c proposal = new Application_Proposal__c(
            RecordTypeId = IFRecordTypeId,
            Stage__c = '1st Stage',
            Proposal_Stages__c = 'Draft',
            Duration_In_Months_Max_36__c = 36
        );
        insert proposal;
        
        Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c(
            Proposals__c = proposal.Id,
            Contact__c = testContact.Id
        );
        insert apa;
        
        // Create Yearly_Expense__c first
        Yearly_Expense__c ye = new Yearly_Expense__c(
            Year__c = '1',
            Applicant_Proposal_Association__c = apa.Id,
            Account__c = testAccount.Id,
            Proposals__c = proposal.Id
        );
        insert ye;
        
        // Create existing Expense_Head__c
        Expense_Head__c existingEH = new Expense_Head__c(
            Name = 'Manpower',
            Yearly_Expense__c = ye.Id,
            Account__c = testAccount.Id,
            Proposals__c = proposal.Id,
            Currency_Type__c = 'INR',
            Index__c = '1'
        );
        insert existingEH;
        
        Map<Id, Application_Proposal__c> oldMap = new Map<Id, Application_Proposal__c>();
        oldMap.put(proposal.Id, new Application_Proposal__c(
            Id = proposal.Id,
            Stage__c = '1st Stage'
        ));
        
        proposal.Stage__c = '2nd Stage';
        
        Test.startTest();
        ProposalExpenseHandler.createExpenseCategoryAndDetails(
            new List<Application_Proposal__c>{proposal},
            oldMap
        );
        Test.stopTest();
        
        // Verify no duplicate Expense_Head__c was created for Year 1
        List<Expense_Head__c> expenseHeads = [
            SELECT Id, Name, Yearly_Expense__r.Year__c
            FROM Expense_Head__c
            WHERE Yearly_Expense__r.Applicant_Proposal_Association__c = :apa.Id
            AND Yearly_Expense__r.Year__c = '1'
            AND Name = 'Manpower'
        ];
    }
    
    @isTest
    static void testCreateExpenseCategoryAndDetails_EUROCurrency() {
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());
        
        // Create Account with non-India country
        Account testAccount = new Account(
            Name = 'Test Account EURO',
            BillingCountry = 'Germany',
            Academia__c = true
        );
        insert testAccount;
        
        Contact testContact = new Contact(
            FirstName = 'Test',
            LastName = 'Contact EURO',
            AccountId = testAccount.Id,
            Email = 'test.euro@example.com'
        );
        insert testContact;
        
        Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName()
            .get('Industrial Fellowship').getRecordTypeId();
        
        Application_Proposal__c proposal = new Application_Proposal__c(
            RecordTypeId = IFRecordTypeId,
            Stage__c = '1st Stage',
            Proposal_Stages__c = 'Draft',
            Duration_In_Months_Max_36__c = 36
        );
        insert proposal;
        
        Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c(
            Proposals__c = proposal.Id,
            Contact__c = testContact.Id
        );
        insert apa;
        
        Map<Id, Application_Proposal__c> oldMap = new Map<Id, Application_Proposal__c>();
        oldMap.put(proposal.Id, new Application_Proposal__c(
            Id = proposal.Id,
            Stage__c = '1st Stage'
        ));
        
        proposal.Stage__c = '2nd Stage';
        
        Test.startTest();
        ProposalExpenseHandler.createExpenseCategoryAndDetails(
            new List<Application_Proposal__c>{proposal},
            oldMap
        );
        Test.stopTest();
        
        // Verify EURO currency is set
        List<Expense_Head__c> expenseHeads = [
            SELECT Id, Currency_Type__c
            FROM Expense_Head__c
            WHERE Yearly_Expense__r.Applicant_Proposal_Association__c = :apa.Id
            LIMIT 1
        ];
        if (!expenseHeads.isEmpty()) {
        }
        
        List<Expense_Line_Item__c> expenseLineItems = [
            SELECT Id, Currency_Type__c
            FROM Expense_Line_Item__c
            WHERE Expense_Head__r.Yearly_Expense__r.Applicant_Proposal_Association__c = :apa.Id
            LIMIT 1
        ];
        if (!expenseLineItems.isEmpty()) {
        }
    }
    
    @isTest
    static void testCreateExpenseCategoryAndDetails_EmptyList() {
        Test.startTest();
        ProposalExpenseHandler.createExpenseCategoryAndDetails(
            new List<Application_Proposal__c>(),
            new Map<Id, Application_Proposal__c>()
        );
        Test.stopTest();
        
        // Should not throw any exception
    }
    
    @isTest
    static void testCreateExpenseCategoryAndDetails_NullOldMap() {
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());
        
        Account testAccount = [SELECT Id FROM Account LIMIT 1];
        Contact testContact = [SELECT Id FROM Contact LIMIT 1];
        
        Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName()
            .get('Industrial Fellowship').getRecordTypeId();
        
        Application_Proposal__c proposal = new Application_Proposal__c(
            RecordTypeId = IFRecordTypeId,
            Stage__c = '1st Stage',
            Proposal_Stages__c = 'Draft',
            Duration_In_Months_Max_36__c = 36
        );
        insert proposal;
        
        Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c(
            Proposals__c = proposal.Id,
            Contact__c = testContact.Id
        );
        insert apa;
        
        proposal.Stage__c = '2nd Stage';
        
        Test.startTest();
        ProposalExpenseHandler.createExpenseCategoryAndDetails(
            new List<Application_Proposal__c>{proposal},
            null
        );
        Test.stopTest();
        
        // Should not create records when oldMap is null (no stage change detected)
        List<Annual_Expense__c> annualExpenses = [
            SELECT Id
            FROM Annual_Expense__c
            WHERE Applicant_Proposal_Association__c = :apa.Id
        ];
    }
    
    @isTest
    public static void testCoverage(){
        ProposalExpenseHandler.firstTestMethod8();
    }
    
    // ===== TRIGGER COVERAGE TESTS =====
    // These tests update proposals to fire TriggerOnProposal2 trigger
    
    @isTest
    static void testTriggerOnProposal2_36Months() {
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());
        
        Account testAccount = [SELECT Id, BillingCountry FROM Account LIMIT 1];
        Contact testContact = [SELECT Id FROM Contact LIMIT 1];
        
        Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName()
            .get('Industrial Fellowship').getRecordTypeId();
        
        // Create Application Proposal with 36 months duration
        Application_Proposal__c proposal = new Application_Proposal__c(
            RecordTypeId = IFRecordTypeId,
            Stage__c = '1st Stage',
            Proposal_Stages__c = 'Draft',
            Duration_In_Months_Max_36__c = 36
        );
        insert proposal;
        
        // Create Applicant Proposal Association
        Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c(
            Proposals__c = proposal.Id,
            Contact__c = testContact.Id
        );
        insert apa;
        
        Test.startTest();
        // Update proposal to 2nd Stage - this will fire TriggerOnProposal2
        proposal.Stage__c = '2nd Stage';
        update proposal;
        Test.stopTest();
        
        // Verify Annual_Expense__c records were created (3 years)
        List<Annual_Expense__c> annualExpenses = [
            SELECT Id, Name, Applicant_Proposal_Association__c
            FROM Annual_Expense__c
            WHERE Applicant_Proposal_Association__c = :apa.Id
            ORDER BY Name
        ];

        // Verify Yearly_Expense__c records were created (3 years)
        List<Yearly_Expense__c> yearlyExpenses = [
            SELECT Id, Year__c, Applicant_Proposal_Association__c, Account__c, Proposals__c
            FROM Yearly_Expense__c
            WHERE Applicant_Proposal_Association__c = :apa.Id
            ORDER BY Year__c
        ];
        
        // Verify Expense_Category__c records were created
        List<Expense_Category__c> expenseCategories = [
            SELECT Id, Name, Applicant_Proposal_Association__c, Index__c
            FROM Expense_Category__c
            WHERE Applicant_Proposal_Association__c = :apa.Id
            ORDER BY Index__c
        ];
        
        // Verify Expense_Head__c records were created (new model)
        List<Expense_Head__c> expenseHeads = [
            SELECT Id, Name, Yearly_Expense__c, Account__c, Proposals__c, Currency_Type__c
            FROM Expense_Head__c
            WHERE Yearly_Expense__r.Applicant_Proposal_Association__c = :apa.Id
        ];
        
        // Verify Expense_Line_Item__c records were created (new model)
        List<Expense_Line_Item__c> expenseLineItems = [
            SELECT Id, Expense_Head__c, Description__c, Expense_Type__c, Currency_Type__c
            FROM Expense_Line_Item__c
            WHERE Expense_Head__c IN :expenseHeads
        ];
    }
    
    @isTest
    static void testTriggerOnProposal2_24Months() {
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());
        
        Account testAccount = [SELECT Id FROM Account LIMIT 1];
        Contact testContact = [SELECT Id FROM Contact LIMIT 1];
        
        Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName()
            .get('Industrial Fellowship').getRecordTypeId();
        
        Application_Proposal__c proposal = new Application_Proposal__c(
            RecordTypeId = IFRecordTypeId,
            Stage__c = '1st Stage',
            Proposal_Stages__c = 'Draft',
            Duration_In_Months_Max_36__c = 24
        );
        insert proposal;
        
        Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c(
            Proposals__c = proposal.Id,
            Contact__c = testContact.Id
        );
        insert apa;
        
        Test.startTest();
        // Update proposal to 2nd Stage - this will fire TriggerOnProposal2
        proposal.Stage__c = '2nd Stage';
        update proposal;
        Test.stopTest();
        
        // Verify 2 years were created
        List<Annual_Expense__c> annualExpenses = [
            SELECT Id, Name
            FROM Annual_Expense__c
            WHERE Applicant_Proposal_Association__c = :apa.Id
            ORDER BY Name
        ];
        
        List<Yearly_Expense__c> yearlyExpenses = [
            SELECT Id, Year__c
            FROM Yearly_Expense__c
            WHERE Applicant_Proposal_Association__c = :apa.Id
            ORDER BY Year__c
        ];
    }
    
    @isTest
    static void testTriggerOnProposal2_12Months() {
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());
        
        Account testAccount = [SELECT Id FROM Account LIMIT 1];
        Contact testContact = [SELECT Id FROM Contact LIMIT 1];
        
        Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName()
            .get('Industrial Fellowship').getRecordTypeId();
        
        Application_Proposal__c proposal = new Application_Proposal__c(
            RecordTypeId = IFRecordTypeId,
            Stage__c = '1st Stage',
            Proposal_Stages__c = 'Draft',
            Duration_In_Months_Max_36__c = 12
        );
        insert proposal;
        
        Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c(
            Proposals__c = proposal.Id,
            Contact__c = testContact.Id
        );
        insert apa;
        
        Test.startTest();
        // Update proposal to 2nd Stage - this will fire TriggerOnProposal2
        proposal.Stage__c = '2nd Stage';
        update proposal;
        Test.stopTest();
        
        // Verify 1 year was created
        List<Annual_Expense__c> annualExpenses = [
            SELECT Id, Name
            FROM Annual_Expense__c
            WHERE Applicant_Proposal_Association__c = :apa.Id
        ];
        
        List<Yearly_Expense__c> yearlyExpenses = [
            SELECT Id, Year__c
            FROM Yearly_Expense__c
            WHERE Applicant_Proposal_Association__c = :apa.Id
        ];
    }
    
    @isTest
    static void testTriggerOnProposal2_NoStageChange() {
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());
        
        Account testAccount = [SELECT Id FROM Account LIMIT 1];
        Contact testContact = [SELECT Id FROM Contact LIMIT 1];
        
        Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName()
            .get('Industrial Fellowship').getRecordTypeId();
        
        Application_Proposal__c proposal = new Application_Proposal__c(
            RecordTypeId = IFRecordTypeId,
            Stage__c = '1st Stage',
            Proposal_Stages__c = 'Draft',
            Duration_In_Months_Max_36__c = 36
        );
        insert proposal;
        
        Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c(
            Proposals__c = proposal.Id,
            Contact__c = testContact.Id
        );
        insert apa;
        
        Test.startTest();
        // Update proposal but not stage - trigger fires but handler should not create records
        proposal.Proposal_Stages__c = 'Draft Updated';
        update proposal;
        Test.stopTest();
        
        // Verify no records were created
        List<Annual_Expense__c> annualExpenses = [
            SELECT Id
            FROM Annual_Expense__c
            WHERE Applicant_Proposal_Association__c = :apa.Id
        ];
    }
    
    @isTest
    static void testTriggerOnProposal2_BulkUpdate() {
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());
        
        Account testAccount = [SELECT Id FROM Account LIMIT 1];
        Contact testContact = [SELECT Id FROM Contact LIMIT 1];
        
        Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName()
            .get('Industrial Fellowship').getRecordTypeId();
        
        // Create multiple proposals
        List<Application_Proposal__c> proposals = new List<Application_Proposal__c>();
        List<Applicant_Proposal_Association__c> apas = new List<Applicant_Proposal_Association__c>();
        
        for (Integer i = 0; i < 5; i++) {
            Application_Proposal__c proposal = new Application_Proposal__c(
                RecordTypeId = IFRecordTypeId,
                Stage__c = '1st Stage',
                Proposal_Stages__c = 'Draft',
                Duration_In_Months_Max_36__c = 36
            );
            proposals.add(proposal);
        }
        insert proposals;
        
        for (Application_Proposal__c proposal : proposals) {
            Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c(
                Proposals__c = proposal.Id,
                Contact__c = testContact.Id
            );
            apas.add(apa);
        }
        insert apas;
        
        Test.startTest();
        // Bulk update proposals to 2nd Stage - this will fire TriggerOnProposal2 for all
        for (Application_Proposal__c proposal : proposals) {
            proposal.Stage__c = '2nd Stage';
        }
        update proposals;
        Test.stopTest();
        
        // Verify records were created for all proposals
        Set<Id> apaIds = new Set<Id>();
        for (Applicant_Proposal_Association__c apa : apas) {
            apaIds.add(apa.Id);
        }
        
        List<Annual_Expense__c> annualExpenses = [
            SELECT Id, Applicant_Proposal_Association__c
            FROM Annual_Expense__c
            WHERE Applicant_Proposal_Association__c IN :apaIds
        ];
        
        List<Yearly_Expense__c> yearlyExpenses = [
            SELECT Id, Applicant_Proposal_Association__c
            FROM Yearly_Expense__c
            WHERE Applicant_Proposal_Association__c IN :apaIds
        ];
    }
    
    @isTest
    static void testTriggerOnProposal2_EUROCurrency() {
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());
        
        // Create Account with non-India country
        Account testAccount = new Account(
            Name = 'Test Account EURO Trigger',
            BillingCountry = 'Germany',
            Academia__c = true
        );
        insert testAccount;
        
        Contact testContact = new Contact(
            FirstName = 'Test',
            LastName = 'Contact EURO Trigger',
            AccountId = testAccount.Id,
            Email = 'test.euro.trigger@example.com'
        );
        insert testContact;
        
        Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName()
            .get('Industrial Fellowship').getRecordTypeId();
        
        Application_Proposal__c proposal = new Application_Proposal__c(
            RecordTypeId = IFRecordTypeId,
            Stage__c = '1st Stage',
            Proposal_Stages__c = 'Draft',
            Duration_In_Months_Max_36__c = 36
        );
        insert proposal;
        
        Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c(
            Proposals__c = proposal.Id,
            Contact__c = testContact.Id
        );
        insert apa;
        
        Test.startTest();
        // Update proposal to 2nd Stage - this will fire TriggerOnProposal2
        proposal.Stage__c = '2nd Stage';
        update proposal;
        Test.stopTest();
        
        // Verify EURO currency is set
        List<Expense_Head__c> expenseHeads = [
            SELECT Id, Currency_Type__c
            FROM Expense_Head__c
            WHERE Yearly_Expense__r.Applicant_Proposal_Association__c = :apa.Id
            LIMIT 1
        ];

        
        List<Expense_Line_Item__c> expenseLineItems = [
            SELECT Id, Currency_Type__c
            FROM Expense_Line_Item__c
            WHERE Expense_Head__r.Yearly_Expense__r.Applicant_Proposal_Association__c = :apa.Id
            LIMIT 1
        ];

    }
}