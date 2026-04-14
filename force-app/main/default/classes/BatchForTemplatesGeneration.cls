global  class BatchForTemplatesGeneration implements Database.Batchable <Sobject>,Database.AllowsCallouts,Database.Stateful{
    global List<String> propIdTobePass = new List<String>();
    
    global Database.QueryLocator Start(Database.BatchableContext bc){
        List<String> stages = new List<String>();
        String proposalValues = label.Proposal_Stages;
        
        if(proposalValues.contains(',')){
            stages = proposalValues.split(',');    
        }else{
            stages.add(proposalValues);   
        }
        String query = 'SELECT Id,Name,Proposal_Stages__c FROM Application_Proposal__c WHERE Proposal_Stages__c IN : stages AND Batch_Completed__c = false LIMIT 10';
        system.debug('Query Result'+ database.query(query));
        return Database.getQueryLocator(query);
    }
    
    global void execute(Database.BatchableContext bc, List<Application_Proposal__c> proposalList){
        //propIdTobePass = new List<String>();
        for(Application_Proposal__c proposal : proposalList) {        
            if(String.isNotBlank(proposal.Id)){
                propIdTobePass.add(proposal.Id);  
            }
        }
        system.debug('propIdTobePass'+propIdTobePass);
        if(!propIdTobePass.isempty()){
            CongaDocGenerationHelper.generateCongaTemplatesForBatch(propIdTobePass);
        }
    }
    
    global void finish(Database.BatchableContext bc) {
        system.debug('propIdTobePass'+propIdTobePass);
        List<String> AttachmentsToBeDeleted = new List<String>();
        
        List<Application_Proposal__c> proposalList = [Select id , Batch_Completed__c from Application_Proposal__c where id In : propIdTobePass];
        
        for(Application_Proposal__c app : proposalList){
            app.Batch_Completed__c = true;
        }
        update proposalList;
        
        for(String str : propIdTobePass){
            List<Attachment> Attlist = [Select id , name from attachment where parentId IN : propIdTobePass Order By createdDate DESC];
            if(Attlist.size() > 0){
                for(Integer i=0 ; i < Attlist.size() ; i++){
                    if(i == 0){
                        system.debug('Skipping the first value');
                    }else{
                        AttachmentsToBeDeleted.add(Attlist[i].Id);
                    }
                    
                }
            }
        }
        system.debug('AttachToBeDeleted'+AttachmentsToBeDeleted);
        if(AttachmentsToBeDeleted.size() > 0){
            //database.delete(AttachmentsToBeDeleted);
        }
    }
}