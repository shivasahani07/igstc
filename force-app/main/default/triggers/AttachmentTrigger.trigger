trigger AttachmentTrigger on Attachment (before insert,after insert,after update,before update) {
    
    if(Trigger.isafter && Trigger.IsInsert){
        Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Industrial Fellowship').getRecordTypeId();
        Id PECFARRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('PECFAR').getRecordTypeId();
        Id WISERRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('WISER').getRecordTypeId();
        Id SINGRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('SING').getRecordTypeId();
        Id WorkshopRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Workshop').getRecordTypeId();
        Id ConnectPlusRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Connect Plus').getRecordTypeId();
        Id TwoPlusTwoRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Two Plus Two').getRecordTypeId();
        
        Set<String> UserDocumentparentIdSet = new Set<String>();
        Set<String> ProposalparentIdSet = new Set<String>();
        Set<String> DisbursementparentIdSet = new Set<String>();
        system.debug('Attachment Trigger is running..!!');
        //This method will be used to push the docs to sharepoint that are uploaded to contact 
        for(attachment at : Trigger.new){
            String sObjName = (at.ParentId).getSObjectType().getDescribe().getName();
            system.debug('sObjName'+sObjName);
            if( sObjName == 'User_Document__c'){
                
                UserDocumentparentIdSet.add(at.ParentId);     
            }
            if( sObjName == 'Application_Proposal__c'){
                ProposalparentIdSet.add(at.ParentId);     
            }
            if( sObjName == 'Disbursement_Schedule__c'){
                DisbursementparentIdSet.add(at.ParentId);     
            }
            
        }
        if(!UserDocumentparentIdSet.isEmpty() ){
            List<User_Document__c> udList = new List<User_Document__c>([select id,Proposal_Id__c,proposals__c from User_Document__c where id in : UserDocumentparentIdSet]);
            for(User_Document__c ud : udList){
                ProposalparentIdSet.add(ud.Proposal_Id__c); 
                ProposalparentIdSet.add(ud.proposals__c); 
            }
        }
        if(!DisbursementparentIdSet.isEmpty() ){
            List<Disbursement_Schedule__c> dsList = new List<Disbursement_Schedule__c>([select id,Proposals__c from Disbursement_Schedule__c where id in : DisbursementparentIdSet]);
            for(Disbursement_Schedule__c ds : dsList){
                ProposalparentIdSet.add(ds.Proposals__c); 
            }
        }
        
        List<Application_Proposal__c> apList = new List<Application_Proposal__c>([select Id,RecordTypeId from Application_Proposal__c where id in : ProposalparentIdSet]);
        for(Application_Proposal__c ap : apList){
            if(ap.RecordTypeId == PECFARRecordTypeId){
                AttachmentTriggerHelper.pushAttachmentsToSPFromContactPECFAR(Trigger.New);
            }
            if(ap.RecordTypeId == IFRecordTypeId){
                AttachmentTriggerHelper.pushAttachmentsToSPFromContactIF(Trigger.New);
            }
            if(ap.RecordTypeId == WISERRecordTypeId){
                AttachmentTriggerHelper.pushAttachmentsToSPFromContactWISER(Trigger.New);
            }
            if(ap.RecordTypeId == SINGRecordTypeId){
                AttachmentTriggerHelper.pushAttachmentsToSPFromContactSING(Trigger.New);
            }
            if(ap.RecordTypeId == WorkshopRecordTypeId){
                AttachmentTriggerHelper.pushAttachmentsToSPFromContactWORKSHOP(Trigger.New);
            }
            if(ap.RecordTypeId == ConnectPlusRecordTypeId){
                AttachmentTriggerHelper.pushAttachmentsToSPFromContactConnectPlus(Trigger.New);
            }
            
        }
        
        //AttachmentTriggerHelper.pushAttachmentsToSPFromProposal(Trigger.New);
        AttachmentTriggerHelper.updateAttachmentName(Trigger.New);
    }
    
    
}