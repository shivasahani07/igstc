trigger ExpenseLineItemTrigger on Expense_Line_Item__c (After insert,After update) {
    if(trigger.isAfter){
        if(Trigger.isInsert  ||  Trigger.isUpdate) {
            ExpenseLineItemTriggerHelper.updateTotalValueOnItsHead(Trigger.new);
            ExpenseLineItemTriggerHelper.createExpenseHeadReport(Trigger.new);
        }
    }
}