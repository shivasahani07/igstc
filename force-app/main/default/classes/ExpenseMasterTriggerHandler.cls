public class ExpenseMasterTriggerHandler {
	
    public static void createYearlyExpense(List<Expense_Master__c> emList){
        List<Yearly_Expense__c> yearlyExpenseListTobeInsert = New List<Yearly_Expense__c>();
        for(Expense_Master__c em : emList){
            for(integer i=1;i<4;i++){
                Yearly_Expense__c ye = new Yearly_Expense__c();
                ye.Expense_Master__c = em.Id;
                ye.Year__c = String.valueOf(i);
                yearlyExpenseListTobeInsert.add(ye);
            }
            //Added by Aman 5th Oct'23 to add "Extension" Yealy Expense Record for 2+2 Proposal.
            if (em.Proposals__c!=null) {
                List<Application_Proposal__c> propRec = [SELECT Id, RecordType_Name__c
                                                    FROM Application_Proposal__c 
                                                    WHERE ID =:em.Proposals__c LIMIT 1];
                if(!propRec.isEmpty() && propRec[0].RecordType_Name__c == 'Two Plus Two'){
                    Yearly_Expense__c ye = new Yearly_Expense__c();
                    ye.Expense_Master__c = em.Id;
                    ye.Year__c = 'Extension';
                    yearlyExpenseListTobeInsert.add(ye);
                }
            }
        }
        if(!yearlyExpenseListTobeInsert.isEmpty()){
            insert yearlyExpenseListTobeInsert;
        }
    }
}