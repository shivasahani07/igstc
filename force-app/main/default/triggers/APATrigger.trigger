trigger APATrigger on Applicant_Proposal_Association__c (after insert) {
    if(Trigger.isAfter && Trigger.isInsert){
        ApplicationProposalTriggerHandler.createYearlyExpenseAndRelatedRecords(Trigger.new);
    }
}