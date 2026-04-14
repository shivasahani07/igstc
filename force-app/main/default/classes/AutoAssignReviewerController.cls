public without sharing class AutoAssignReviewerController {
    public AutoAssignReviewerController() {}

    @AuraEnabled(cacheable = true)
    public static Application_Proposal__c getRcDetails(String id){
        try {
            return [Select Id,Name From Application_Proposal__c Where Id=:id];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    Public static string matchReviewer(string proposalId){
        System.debug('proposalId--'+proposalId);
        Application_Proposal__c appProposal = [select name,id,KeyWords__c,(select name,id,Reviewer__c from Reviewer_Mapping__r) from Application_Proposal__c where Id =:proposalId];
        System.debug('appProposal---: ' +appProposal );
        List<string> proposalKeyWordList ;
        set<string> assignedReviewersId = New set<string>();
        System.debug('appProposal.Reviewer_Mapping__r: ' +appProposal.Reviewer_Mapping__r);
        for(Reviewer_Mapping__c revId:appProposal.Reviewer_Mapping__r){
            assignedReviewersId.add(revId.Reviewer__c);
        }
        if(!string.isBlank(appProposal.KeyWords__c )){
            system.debug('appProposal.KeyWords__c ---'+appProposal.KeyWords__c );
            appProposal.KeyWords__c.split(';');
            //String target = appProposal.KeyWords__c.replaceAll('<[^>]+>',' ');
            proposalKeyWordList = appProposal.KeyWords__c.split(';');
            system.debug('proposalKeyWordList ---'+proposalKeyWordList);
            system.debug('proposalKeyWordList ---'+proposalKeyWordList.size());
        }
        Set<string> keyWordSet = new Set<string>();
        if(proposalKeyWordList.size() > 0){
            for (string key : proposalKeyWordList) {
                keyWordSet.add('%%'+key.trim()+'%%');
            }
            System.debug('keyWordSet: ' +keyWordSet );
            System.debug('assignedReviewersId: ' +assignedReviewersId );
            List<Reviewer__c> reviewerList = [select name,id from Reviewer__c where skills__c Like :keyWordSet AND Id NOT IN :assignedReviewersId limit 5];
            system.debug('reviewerList---'+reviewerList);
            List<Reviewer_Mapping__c> revmappingList = New List<Reviewer_Mapping__c>();
            if(reviewerList.size() > 0){

                for(Reviewer__c rev:reviewerList){
                    Reviewer_Mapping__c revmapping = New Reviewer_Mapping__c();
                    revmapping.Reviewer__c = rev.Id;
                    revmapping.Proposals__c = proposalId;
                    revmappingList.add(revmapping); 
                }
                insert revmappingList;
                RETURN 'success';
            }
            RETURN 'No Reviewers Found';
        }
        RETURN 'No Keywords';
    }
}