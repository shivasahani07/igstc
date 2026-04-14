trigger TriggetOnFinancialContribution on Financial_Contribution__c (before update) {
    if(trigger.isBefore && trigger.isUpdate){
        UpdateProposalTotalAmountFC.getProposalIdFromFinancialContribution(trigger.newMap, trigger.oldMap);
    }
}