/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 03-01-2023
 * @last modified by  : Dhanush Babu
**/
public class ReviwerPortalController {
    static final String TWO_PLUS_TWO = 'Two plus Two';
    static final String PECFAR = 'PECFAR'; 
    static final string INDUSTRIAL_FELLOWSHIP = 'Industrial Fellowship';
    static final String SING = 'SING';
    
    @AuraEnabled(cacheable=true)
    public static list<Application_Proposal__c> getApplicationBasedOnType(String RecordTypeName){
        list<Application_Proposal__c> proposalList1 = [SELECT ID, NAME, RecordType.Name,Proposal_Stages__c,Submitted__c,Sum_Of_Ratings__c,Sum_of_Reviewer_ratings__c From Application_Proposal__c Where RecordType.Name =: RecordTypeName];
        return proposalList1;
    }
    @AuraEnabled(cacheable=true)
    public static  list<Application_Proposal__c>  getProposalApplication(){
        list<Application_Proposal__c> proposalList = [SELECT ID, Name, RecordType.Name,Proposal_Stages__c, Proposed_Date__c, Application_Date__c, Actual_Application_Start_Date__c, Current_State_Of_The_Art__c,
                                                      Sum_Of_Ratings__c,Sum_of_Reviewer_ratings__c FROM Application_Proposal__c];
        return proposalList;
    }
    @AuraEnabled(cacheable=true)
     public static  list<Application_Proposal__c>  getProposalApplicationtpt(){
        list<Application_Proposal__c> proposalList =[SELECT ID, NAME, RecordType.Name,Proposal_Stages__c,Submitted__c,Sum_Of_Ratings__c,Sum_of_Reviewer_ratings__c From Application_Proposal__c Where RecordType.name ='Two plus Two'];
        return proposalList;
    }
      @AuraEnabled(cacheable=true)
     public static  list<Application_Proposal__c>  getProposalApplicationSing(){
        list<Application_Proposal__c> proposalList =[SELECT ID, NAME, RecordType.Name,Proposal_Stages__c,Submitted__c,Sum_Of_Ratings__c,Sum_of_Reviewer_ratings__c From Application_Proposal__c Where RecordType.name ='SING'];
        return proposalList;
    }
    @AuraEnabled(cacheable=true)
     public static  list<Application_Proposal__c>  getProposalApplicationIf(){
        list<Application_Proposal__c> proposalList =[SELECT ID, NAME, RecordType.Name,Proposal_Stages__c,Submitted__c,Sum_Of_Ratings__c,Sum_of_Reviewer_ratings__c From Application_Proposal__c Where RecordType.name ='Industrial Fellowship'];
        return proposalList;
    }
    @AuraEnabled(cacheable=true)
     public static  list<Application_Proposal__c>  getProposalApplicationPECFAR(){
        list<Application_Proposal__c> proposalList =[SELECT ID, NAME, RecordType.Name,Proposal_Stages__c,Submitted__c,Sum_Of_Ratings__c,Sum_of_Reviewer_ratings__c From Application_Proposal__c Where RecordType.name ='PECFAR'];
        return proposalList;
    }
     @AuraEnabled(cacheable=true)
     public static  list<Application_Proposal__c>  getProposalApplicationWISER(){
        list<Application_Proposal__c> proposalList =[SELECT ID, NAME, RecordType.Name,Proposal_Stages__c,Sum_Of_Ratings__c,Submitted__c,Sum_of_Reviewer_ratings__c From Application_Proposal__c Where RecordType.name ='WISER'];
        return proposalList;
    }
     @AuraEnabled(cacheable=true)
     public static  list<Application_Proposal__c>  getProposalApplicationWorkshop(){
        list<Application_Proposal__c> proposalList =[SELECT ID, NAME, RecordType.Name,Proposal_Stages__c,Submitted__c,Sum_Of_Ratings__c,Sum_of_Reviewer_ratings__c From Application_Proposal__c Where RecordType.name ='Workshop' order by Proposal_Stages__c asc];
        return proposalList;
    }
    @AuraEnabled(cacheable=true)
    public static  list<Application_Proposal__c>  getProposalApplication1(string RecordTypeName){
        list<Application_Proposal__c> proposalList = [SELECT ID, NAME, RecordType.Name,Proposal_Stages__c, Proposed_Date__c, Application_Date__c, Actual_Application_Start_Date__c, Current_State_Of_The_Art__c,
                                                      Sum_Of_Ratings__c,Sum_of_Reviewer_ratings__c FROM Application_Proposal__c  Where RecordType.Name =: RecordTypeName ];
        return proposalList;
    }
    @AuraEnabled(cacheable=true)
    public static  list<Application_Proposal__c>  getProposalApplicationforDataTable(String RecordTypeName, string Stage){
        list<Application_Proposal__c> proposalList = [SELECT ID, NAME, RecordType.Name,Proposal_Stages__c, Proposed_Date__c, Submitted__c,Application_Date__c, Actual_Application_Start_Date__c, Current_State_Of_The_Art__c,
                                                      Sum_Of_Ratings__c,Sum_of_Reviewer_ratings__c FROM Application_Proposal__c  Where RecordType.Name =: RecordTypeName and Proposal_Stages__c =: Stage];
        return proposalList;
    }
    @AuraEnabled(cacheable=true)
    public static  list<Application_Proposal__c>  getSubmittedApplicationforDataTable(String RecordTypeName){
        list<Application_Proposal__c> proposalList = [SELECT ID, NAME, RecordType.Name,Proposal_Stages__c,Campaign__r.year__c, Proposed_Date__c, Submitted__c,Application_Date__c, Actual_Application_Start_Date__c, Current_State_Of_The_Art__c,
                                                      Sum_Of_Ratings__c,Sum_of_Reviewer_ratings__c FROM Application_Proposal__c  Where RecordType.Name =: RecordTypeName and Submitted__c = true];
        return proposalList;
    }
    
    @AuraEnabled(cacheable=true)
    
    public static Integer getAllocatedCompleted(String RecordTypeName){
        list<Reviewer_Mapping__c> revMapListpending = new list<Reviewer_Mapping__c>();
        list<Application_Proposal__c> proposalList2 = [select id, name,RecordType.name,Proposal_Stages__c,Submitted__c,Sum_of_Reviewer_ratings__c from Application_Proposal__c Where RecordType.name =: RecordTypeName and Proposal_Stages__c=: ConstantsReviwerPortalDashboard.REVIEW_COMPLETED];
        
        return proposalList2.size();
    }
    @AuraEnabled(cacheable=true)
    
    public static  list<Application_Proposal__c> getUnAllocated(String RecordTypeName){
        list<Reviewer_Mapping__c> revMapListpending = new list<Reviewer_Mapping__c>();
        list<Application_Proposal__c> proposalList2 = [select id, name,RecordType.name,Proposal_Stages__c,Submitted__c,Sum_of_Reviewer_ratings__c from Application_Proposal__c Where RecordType.name =: RecordTypeName and Proposal_Stages__c=: ConstantsReviwerPortalDashboard.SUBMITTED];
        
        return proposalList2;
    }
    @AuraEnabled(cacheable=true)
    public static list<Application_Proposal__c>  getAllocatedpending(String RecordTypeName){
        
        list<Application_Proposal__c> pendingProposalList = [select id, name,RecordType.name,Proposal_Stages__c,Submitted__c,Sum_of_Reviewer_ratings__c from Application_Proposal__c Where RecordType.name =: RecordTypeName and Proposal_Stages__c=:ConstantsReviwerPortalDashboard.UNDER_REVIEW And Submitted__c=true ];
        
        return pendingProposalList;
    }
    @AuraEnabled
    public static integer pendingRecordCount(String RecordTypeName){
        list<Application_Proposal__c> reviewrMaplist = new list<Application_Proposal__c>();
        integer num =0;
         list<Application_Proposal__c> pendingProposalList = [select id, name,RecordType.name,Proposal_Stages__c,Submitted__c,Sum_of_Reviewer_ratings__c,(Select id, name,Stage__c From Reviewer_Mapping__r Where Stage__c ='Draft') from Application_Proposal__c Where  RecordType.name =: RecordTypeName And Proposal_Stages__c=:ConstantsReviwerPortalDashboard.UNDER_REVIEW And Submitted__c=true ];
        for(Application_Proposal__c app: pendingProposalList){
            list<Reviewer_Mapping__c> reviewrMaplist1 = new list<Reviewer_Mapping__c>();
            System.debug('app>>>'+ app);
            for(Reviewer_Mapping__c rev: app.Reviewer_Mapping__r){
                reviewrMaplist1.add(rev);
                    System.debug('reviewrMaplist1>>>'+ reviewrMaplist1);
            }
                        System.debug('reviewrMaplist1.Size()>>>'+ reviewrMaplist1.Size());
          if(reviewrMaplist1.Size()>0)
              num++;
              
        }
       return num;
    }
}