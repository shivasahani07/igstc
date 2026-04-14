trigger TriggerOnExpenseMaster on Expense_Master__c (after insert) {
    if(Trigger.isInsert && Trigger.isAfter){
        ExpenseMasterTriggerHandler.createYearlyExpense(Trigger.New);
    }
}