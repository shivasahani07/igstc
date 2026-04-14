public with sharing class WORKSHOPBudgetDetailsController {
    public WORKSHOPBudgetDetailsController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Expense_Head__c> getAllExpenseHeadLineitems(string proposalId){
        try{
            List<Expense_Head__c> listOfHeadsAndLineItems = [SELECT Id,Name,ELI__c,Approved_Head__c,Approved_Amount__c,Advance_Release__c,Approved_Comment__c,Final_Settlement__c,
            (SELECT Id,Name,Description__c FROM Expense_Line_Items__r) FROM Expense_Head__c WHERE Proposals__c =: proposalId];
            return listOfHeadsAndLineItems;
        }catch(Exception e){
            return null;
        }
    }

    @AuraEnabled(cacheable=false)
    public static string saveExpenseHeadDetails(List<Expense_Head__c> listOfHeads){
        system.debug('listOfHeads :: '+listOfHeads);
        system.debug('size :: '+listOfHeads.size());
        try{
            if(!listOfHeads.isEmpty()){
                update listOfHeads;
            }
            return 'SUCCESS';
        }catch(Exception e){
            return e.getMessage()+e.getLineNumber();
        }
    }
}