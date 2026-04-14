trigger TriggerOnProposal on Application_Proposal__c (after insert,after update, before update,before delete) {
    ProposalTriggerHandler proposalInstance = ProposalTriggerHandler.getInstance();
    
    if(Trigger.isInsert && Trigger.isAfter){
        proposalInstance.afterInsert(Trigger.newMap);
        EvaluationController.checkEvaluationCriteria(trigger.new);
    }
    if(Trigger.isUpdate && Trigger.isAfter){
        proposalInstance.createMasterExpenseRecord(Trigger.new,Trigger.oldMap);
        proposalInstance.createDisbursmentFRecord(Trigger.newMap,Trigger.oldMap);
        proposalInstance.createDisbursmentFRecordForPECFAR(Trigger.newMap,Trigger.oldMap);
        proposalInstance.createDisbursmentFRecordForSING(Trigger.newMap,Trigger.oldMap);
        proposalInstance.createDisbursmentFRecordForWORKSHOP(Trigger.newMap,Trigger.oldMap);
        proposalInstance.createDisbursmentFRecordForCONNECTPLUS(Trigger.newMap,Trigger.oldMap);
        proposalInstance.createDisbursmentFRecordFor_two_plus_two(Trigger.newMap,Trigger.oldMap);
        
    }
    
    if(trigger.isBefore && trigger.isUpdate){
        proposalInstance.validationForunderreviewstage(Trigger.newMap, Trigger.oldMap);
        proposalInstance.validationOnSCReviewStageChange(Trigger.new, Trigger.oldMap);
        proposalInstance.createDisbursmentFRecordForWISER(Trigger.newMap,Trigger.oldMap);
        proposalInstance.validationOnRecommendationNote(Trigger.newMap,Trigger.oldMap);
        proposalInstance.validationOnOfficeNote(Trigger.newMap,Trigger.oldMap);
    }
    
    if(trigger.isBefore && trigger.isDelete){
        // ProposalTriggerHandler.beforeDelete(trigger.old);
    }
}