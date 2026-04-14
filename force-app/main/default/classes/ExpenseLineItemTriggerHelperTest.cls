@isTest(SeeAllData = true)
private class ExpenseLineItemTriggerHelperTest {
    
    static testMethod void testUpdateTotalValueOnItsHead() {
        // Create test data
        Id proposalRecordType_SING = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('SING').getRecordTypeId();
        
        
        Application_Proposal__c applicationProposal = [select Id from Application_Proposal__c where RecordTypeId =:proposalRecordType_SING limit 1];
        //applicationProposal.RecordTypeId = proposalRecordType_SING;
        //insert applicationProposal;
        
        Expense_Head__c expenseHead = new Expense_Head__c(Proposals__c = applicationProposal.Id, Name = 'Test Expense Head');
        insert expenseHead;
        
        Expense_Line_Item__c expenseLineItem1 = new Expense_Line_Item__c(Expense_Head__c = expenseHead.Id, Year1_Expense__c = 100);
        Expense_Line_Item__c expenseLineItem2 = new Expense_Line_Item__c(Expense_Head__c = expenseHead.Id, Year1_Expense__c = 200);
        Expense_Line_Item__c expenseLineItem3 = new Expense_Line_Item__c(Expense_Head__c = expenseHead.Id, Year1_Expense__c = 300);
        insert new List<Expense_Line_Item__c>{ expenseLineItem1, expenseLineItem2, expenseLineItem3 };
            
            List<Expense_Line_Item__c> newELIList = new List<Expense_Line_Item__c>{ expenseLineItem1, expenseLineItem2, expenseLineItem3 };
                Test.startTest();
        ExpenseLineItemTriggerHelper.updateTotalValueOnItsHead(newELIList);
        Test.stopTest();
        
        /*

// Call the method to be tested


// Verify the results
expenseHead = [SELECT ELI__c FROM Expense_Head__c WHERE Id = :expenseHead.Id];
System.assertEquals(600, expenseHead.ELI__c);*/
    }
    
    
    
}