public class ExpenseDeclaration {
    public ExpenseDeclaration(){
        
    }
    
    // @RemoteAction
    // public static List<Account> fetchAllAccountsFromProposal(String proposalId){
    //     List<Account> accList = new List<Account>();
    //     if(proposalId != null && proposalId != ''){
    //         accList = [select id,Name from account where Proposals__c =: proposalId];
    //     }
        
    //     return accList;
    // }
    @RemoteAction
    public static List<Account> getProposalAccounts(String ProposalId){
        List<Account> acc=[SELECT id,name,Country_Type__c from Account where proposals__c=:ProposalId];
        return acc;
    }
    
    @RemoteAction
    public static void createExpenseDeclarationDetails(List<Expense_Line_Item__c> expenseLineItem,String proposalId,String accId){
        List<Yearly_Expense__c> yearlyExpense = New List<Yearly_Expense__c>();
        List<Expense_Master__c> expenseMasterList = [select id from Expense_Master__c where Account__c =: accId and proposals__c =:proposalId];
        system.debug('expenseMasterList:'+expenseMasterList);
        Map<String,Yearly_Expense__c> mapofYearByExpense = New Map<String,Yearly_Expense__c>();
        List<Expense_Head__c> expenseHeadTobeInsert = New List<Expense_Head__c>();
        Set<String> yearSet = New Set<String>();
        List<Expense_Line_Item__c> expenseLineItemTobeInsert = New List<Expense_Line_Item__c>();
        if(!expenseMasterList.isEmpty()){
            Set<String> emSet = new Set<String>();
            for(Expense_Master__c em : expenseMasterList){
                emSet.add(em.Id);
            }
            if(!emSet.isEmpty()){
                yearlyExpense = [select id,Expense_Master__c,year__c from Yearly_Expense__c where Expense_Master__c in: emSet order by year__c];
                system.debug('yearlyExpense::'+yearlyExpense);
                integer counter = 0;
                
                for(Yearly_Expense__c yrExpense : yearlyExpense){
                    yearSet.add(yrExpense.Id);
                    mapofYearByExpense.put('year'+ ++counter,yrExpense);
                }
            }
            system.debug('mapofYearByExpense::'+mapofYearByExpense);
            Set<String> firstYearSet = New Set<String>();
            Set<String> secondYearSet = New Set<String>();
            Set<String> thirdYearSet = New Set<String>();
            if(!expenseLineItem.isEmpty()){
                for(Expense_Line_Item__c eli : expenseLineItem){
                    
                    if(eli.Expense_Type__c != '' && eli.Year1_Expense__c >0){
                        if(!firstYearSet.contains(eli.Expense_Type__c)){
                            Expense_Head__c exHead = new Expense_Head__c();
                            exHead.Name = eli.Expense_Type__c;
                            exHead.Yearly_Expense__c = mapofYearByExpense.get('year1').Id;
                            firstYearSet.add(eli.Expense_Type__c);
                            expenseHeadTobeInsert.add(exHead);
                        }
                        
                    }
                    if(eli.Expense_Type__c != '' && eli.Year2_Expense__c > 0){
                        if(!secondYearSet.contains(eli.Expense_Type__c)){
                            Expense_Head__c exHead = new Expense_Head__c();
                            exHead.Name = eli.Expense_Type__c;
                            exHead.Yearly_Expense__c = mapofYearByExpense.get('year2').Id;
                            secondYearSet.add(eli.Expense_Type__c);
                            expenseHeadTobeInsert.add(exHead);
                        }
                        
                    }
                    if(eli.Expense_Type__c != '' && eli.Year3_Expense__c > 0){
                        if(!thirdYearSet.contains(eli.Expense_Type__c)){
                            Expense_Head__c exHead = new Expense_Head__c();
                            exHead.Name = eli.Expense_Type__c;
                            exHead.Yearly_Expense__c = mapofYearByExpense.get('year3').Id;
                            thirdYearSet.add(eli.Expense_Type__c);
                            expenseHeadTobeInsert.add(exHead);
                        }
                        
                    }
                    
                    
                }
                system.debug('expenseHeadTobeInsert::'+expenseHeadTobeInsert);
                if(!expenseHeadTobeInsert.isEmpty()){
                    insert expenseHeadTobeInsert;
                }
                
                List<Expense_Head__c> exhead = [select id,Yearly_Expense__c from Expense_Head__c where Yearly_Expense__c in: yearSet];
                Map<String,Expense_Head__c> mapofYearidByExpenseHead = New Map<String,Expense_Head__c>();
                for(Expense_Head__c exh : exhead){
                    mapofYearidByExpenseHead.put(exh.Yearly_Expense__c,exh);
                }
                
                
                for(Expense_Line_Item__c eli : expenseLineItem){
                    system.debug('eli::'+eli);
                    if(eli.Year1_Expense__c > 0){
                       Expense_Line_Item__c newELI = New Expense_Line_Item__c();
                        //newELI = eli;
                        newELI.Description__c = eli.Description__c;
                        newELI.Multiplier__c = eli.Multiplier__c;
                        newELI.Unit_Price__c = eli.Unit_Price__c;
                        newELI.Expense_Head__c = mapofYearidByExpenseHead.get(mapofYearByExpense.get('year1').Id).Id;
                        newELI.Year2_Expense__c = 0;
                        newELI.Year3_Expense__c = 0;
                        newELI.Year1_Expense__c = eli.Year1_Expense__c;
                        expenseLineItemTobeInsert.add(newELI);
                    }
                    system.debug('eli::'+eli);
                    system.debug('eli.Year2_Expense__c::'+eli.Year2_Expense__c);
                    if(eli.Year2_Expense__c > 0){
                        Expense_Line_Item__c newELI = New Expense_Line_Item__c();
                        //newELI = eli;
                        newELI.Description__c = eli.Description__c;
                        newELI.Multiplier__c = eli.Multiplier__c;
                        newELI.Unit_Price__c = eli.Unit_Price__c;
                        newELI.Year1_Expense__c = 0;
                        newELI.Year3_Expense__c = 0;
                        newELI.Year2_Expense__c = eli.Year2_Expense__c;
                        newELI.Expense_Head__c = mapofYearidByExpenseHead.get(mapofYearByExpense.get('year2').Id).Id;
                        expenseLineItemTobeInsert.add(newELI);
                    }
                    if(eli.Year3_Expense__c > 0){
                        Expense_Line_Item__c newELI = New Expense_Line_Item__c();
                        //newELI = eli;
                        //newELI.Description__c = eli.Description__c;
                        newELI.Multiplier__c = eli.Multiplier__c;
                        newELI.Unit_Price__c = eli.Unit_Price__c;
                        newELI.Year1_Expense__c = 0;
                        newELI.Year2_Expense__c = 0;
                        newELI.Year3_Expense__c = eli.Year3_Expense__c;
                        newELI.Expense_Head__c = mapofYearidByExpenseHead.get(mapofYearByExpense.get('year3').Id).Id;
                        expenseLineItemTobeInsert.add(newELI);
                    }
                    
                }
            }
        }
        system.debug('expenseLineItem::'+expenseLineItemTobeInsert);
        insert expenseLineItemTobeInsert;
    }
}