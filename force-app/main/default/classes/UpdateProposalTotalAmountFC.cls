public class UpdateProposalTotalAmountFC {
    
    public static void getProposalIdFromFinancialContribution(Map<id, Financial_Contribution__c> newFinanceContriMap, Map<id, Financial_Contribution__c> oldFinanceContriMap){
        
        try{
            set<Id> accountId = New set<Id>();
        set<Id> proposalId = New set<Id>();
        List<Account> accListWithFinancialContriList = new List<Account>();
        Map<Id,decimal> proposalIdByAccountAmount = New Map<Id,decimal>();
        Map<String,Financial_Contribution__c> mapOfAccountIdByFinancialContribution = New Map<String,Financial_Contribution__c>();
        List<Application_Proposal__c> appProposalToUpdate = new List<Application_Proposal__c>();
        
        for(Financial_Contribution__c financeContri : newFinanceContriMap.values()){
            if(financeContri.Total__c != oldFinanceContriMap.get(financeContri.Id).Total__c){
                accountId.add(financeContri.Account__c);
                proposalId.add(financeContri.Account__r.Proposals__c);
                mapOfAccountIdByFinancialContribution.put(financeContri.Account__c,financeContri); 
            }
        }
        if(!accountId.isEmpty()){
            accListWithFinancialContriList = [SELECT Id,Name,Proposals__c,Proposals__r.Total_Amount__c,(SELECT Id,Name,Total__c,IGSTC_Contribution__c FROM Financial_Contribution__r) From Account WHERE Id In : accountId];
            if(!accListWithFinancialContriList.isEmpty()){
                for(Account acc : accListWithFinancialContriList){
                    decimal financeContriAmount = 0;
                    for(Financial_Contribution__c financialContriRec : acc.Financial_Contribution__r){
                        if(financialContriRec.Total__c > 0){
                            financeContriAmount += financialContriRec.Total__c;
                        }
                    }
                    if(proposalIdByAccountAmount.containsKey(acc.Proposals__c)){
                        decimal amount = proposalIdByAccountAmount.get(acc.Proposals__c);
                        amount += financeContriAmount;
                        proposalIdByAccountAmount.put(acc.Proposals__c, amount);
                    }else{
                        proposalIdByAccountAmount.put(acc.Proposals__c, financeContriAmount);
                    }
                    /*if(ProposalFD.containsKey(acc.Proposals__c)){
decimal currentAmount = ProposalFD.get(acc.Proposals__c)+acc.Financial_Contribution__r[0].IGSTC_Contribution__c;
ProposalFD.put(acc.Proposals__c,currentAmount);
}else{
decimal currentAmount = acc.Proposals__r.Total_Amount__c+acc.Financial_Contribution__r[0].IGSTC_Contribution__c;
ProposalFD.put(acc.Proposals__c,currentAmount);
}*/
                }
                if(!proposalIdByAccountAmount.isEmpty()){
                    for(Id appProposalId : proposalIdByAccountAmount.keyset()){
                        Application_Proposal__c applicationProposal = New Application_Proposal__c();
                        applicationProposal.Id = appProposalId;
                        applicationProposal.Total_Amount__c = proposalIdByAccountAmount.get(appProposalId);
                        appProposalToUpdate.add(applicationProposal);
                    }
                    if(!appProposalToUpdate.isEmpty()){
                        update appProposalToUpdate;
                    }
                }
            }
        }
        }catch(exception ex){
            system.debug('Error -->'+ex.getLineNumber());
            system.debug('Error-->'+ex.getMessage());
            system.debug('Error-->'+ex.getStackTraceString());
        }
    }
    
   
}