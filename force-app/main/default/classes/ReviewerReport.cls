public with sharing class ReviewerReport {
    
    public class ReviewerMappingCount {
        @AuraEnabled public Id reviewerId { get; set; }
        @AuraEnabled public String reviewerName { get; set; }
        @AuraEnabled public String reviewerEmail { get; set; }
        @AuraEnabled public Integer mappingCount { get; set; }
        
        public ReviewerMappingCount(Id id, String name, String email, Integer count) {
            this.reviewerId = id;
            this.reviewerName = name;
            this.reviewerEmail = email;
            this.mappingCount = count;
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static List<ReviewerMappingCount> getReviewerMappingCounts() {
        List<ReviewerMappingCount> results = new List<ReviewerMappingCount>();
        
        for (AggregateResult ar : [
            SELECT Reviewer__c reviewerId, Reviewer__r.Name reviewerName, Reviewer__r.Email__c reviewerEmail, COUNT(Id) mappingCount
            FROM Reviewer_Mapping__c
            GROUP BY Reviewer__c, Reviewer__r.Name, Reviewer__r.Email__c
            ORDER BY COUNT(Id) DESC
        ]) {
            results.add(new ReviewerMappingCount(
                (Id)ar.get('reviewerId'),
                (String)ar.get('reviewerName'),
                (String)ar.get('reviewerEmail'),
                (Integer)ar.get('mappingCount')
            ));
        }
        
        return results;
    }
    @AuraEnabled(cacheable=true)
    public static List<Reviewer_Mapping__c> getReviewerDetails(String reviewerName){
        return[
            Select Id, Proposal_Name__c,Proposals__r.RecordType.Name,Stage__c,Proposal_Stage__c from Reviewer_Mapping__c  WHERE Reviewer__r.Name = :reviewerName
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Campaign> getCampaignName(){
        return[
            SELECT Id, Name FROM Campaign  ORDER BY Name DESC 
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<YealyCall__c> getYear(){
        return[
                Select Id,Year__c from YealyCall__c  ORDER BY Year__c DESC

        ];
    }


    //@AuraEnabled(cacheable=true)
    // public static List<Application_Proposal__c > getProposals(Id campaignId, String yearValue) {
    //     return [
    //         SELECT Id,Name , Campaign__r.Name,Title_Of__c,Stage__c,Proposal_Stages__c, Question_Template__r.Yearly_Call__r.Year__c FROM Application_Proposal__c  WHERE Campaign__c = :campaignId AND 
    //         CALENDAR_YEAR(CreatedDate) = 2025  AND ( Proposal_Stages__c = 'Under Review' OR Proposal_Stages__c ='Under SC Review') ORDER BY CreatedDate DESC
    //     ];
    // }
    @AuraEnabled(cacheable=true)
    public static List<Application_Proposal__c> getProposals(Id campaignId, String yearValue) {

        if (campaignId == null || String.isBlank(yearValue)) {
            return new List<Application_Proposal__c>();
        }

        Integer year;
        try {
            year = Integer.valueOf(yearValue);
        } catch (Exception e) {
            return new List<Application_Proposal__c>();
        }

        DateTime startDate = DateTime.newInstance(year, 1, 1, 0, 0, 0);
        DateTime endDate   = DateTime.newInstance(year + 1, 1, 1, 0, 0, 0);

        return [
            SELECT Id, Name, Campaign__r.Name, Title_Of__c, Stage__c, Proposal_Stages__c,Question_Template__r.Yearly_Call__r.Year__c FROM Application_Proposal__c
            WHERE Campaign__c = :campaignId AND CreatedDate >= :startDate AND CreatedDate <  :endDate AND Proposal_Stages__c IN ('Under Review', 'Under SC Review')
            ORDER BY CreatedDate DESC
        ];
    }

    @AuraEnabled(cacheable=true)
    public static APXTConga4__Conga_Solution__c getCongaSolution(String solutionName) {
        return [ SELECT Id, Name  FROM APXTConga4__Conga_Solution__c WHERE Name = :solutionName LIMIT 1
        ];
    }

    

    
    @AuraEnabled
public static void updateGenerateReviewerDoc(List<Application_Proposal__c> proposalList) {

    if (proposalList == null || proposalList.isEmpty()) {
        return;
    }

    Set<Id> selectedIds = new Set<Id>();
    for (Application_Proposal__c p : proposalList) {
        selectedIds.add(p.Id);
    }

    List<Application_Proposal__c> toReset = [
        SELECT Id
        FROM Application_Proposal__c
        WHERE Generate_Reviewer_Document__c = true
        AND Id NOT IN :selectedIds
    ];

    for (Application_Proposal__c rec : toReset) {
        rec.Generate_Reviewer_Document__c = false;
    }

    for (Application_Proposal__c p : proposalList) {
        p.Generate_Reviewer_Document__c = true;
    }

    update toReset;
    update proposalList;
}



//     @AuraEnabled
// public static void updateGenerateReviewerDoc(List<Application_Proposal__c> proposalList) {
//     if (proposalList == null || proposalList.isEmpty()) return;

//     Set<Id> selectedIds = new Set<Id>();
//     for (Application_Proposal__c p : proposalList) selectedIds.add(p.Id);

//     List<Application_Proposal__c> toReset = [
//         SELECT Id  FROM Application_Proposal__c WHERE Generate_Reviewer_Document__c = true AND Id NOT IN :selectedIds
//     ];
//     for (Application_Proposal__c rec : toReset) rec.Generate_Reviewer_Document__c = false;

//     toReset.addAll(proposalList);
//     update toReset;
// }





}