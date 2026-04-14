public class ExpenseHeadCompWISERController {

    @AuraEnabled
    public static List<Expense_Head__c> getExpenseHeads(Id proposalId) {
        return [SELECT Id,Description__c,Approved_Head__c,Name,Total_Year_1_ELI__c,Total_Year_2_ELI__c,Total_Year_3_ELI__c,Year_1_Actual_Spent__c,ELI__c,Year_1_Adjustment_Amount__c,Year_2_Actual_Spent__c,Year_2_Adjustment_Amount__c,Year_3_Actual_Spent__c,
                Year_3_Adjustment_Amount__c,Currency_Type__c,Currency_Type_INR_EURO__c,Year_1_Approved_Amount__c,Year_2_Approved_Amount__c,Year_3_Approved_Amount__c FROM Expense_Head__c Where Proposals__c =: proposalId];
    }
    
    @AuraEnabled
    public static String saveDetails(List<Expense_Head__c> expenseHeads){
        try{
            system.debug('expenseHeads ::'+expenseHeads);
            upsert expenseHeads;
            return 'SUCCESS';  
        }catch(Exception e){
            return e.getMessage()+e.getLineNumber();
        }
    }
}