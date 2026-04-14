trigger TriggerOnProposal2 on Application_Proposal__c (after update) {

    if (Trigger.isAfter && Trigger.isUpdate) {
        ProposalExpenseHandler.createExpenseCategoryAndDetails(
            Trigger.new,
            Trigger.oldMap
        );
        
        // ----------------------------- TRIGGER TO STORE THE Expected Deliverables OF PROPOSAL ON Expected Deliverables Points ON APA ------------------------------ //
        // Set to store Proposal IDs where Expected_Deliverables__c has changed
        Set<Id> proposalIdsWithChangedDeliverables = new Set<Id>();
        
        // Check if Expected_Deliverables__c field has changed
        for (Application_Proposal__c proposal : Trigger.new) {
            Application_Proposal__c oldProposal = Trigger.oldMap.get(proposal.Id);
            
            // Only proceed if Expected_Deliverables__c has changed and is not null
            if (proposal.Expected_Deliverables__c != oldProposal.Expected_Deliverables__c || proposal.Research_Approach_Objectives__c != oldProposal.Research_Approach_Objectives__c ) {
                proposalIdsWithChangedDeliverables.add(proposal.Id);
            }
        }
        
        // If there are proposals with changed deliverables, update their APA records
        if (!proposalIdsWithChangedDeliverables.isEmpty()) {
            KeywordFormatter.updateAPAExpectedDeliverables(proposalIdsWithChangedDeliverables);
        }
    }
    
    
}