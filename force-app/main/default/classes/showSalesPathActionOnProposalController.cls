public with sharing class showSalesPathActionOnProposalController {
    public showSalesPathActionOnProposalController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Sales_Path_Action__mdt> getActionRecords(string propId){
        try{
            List<Sales_Path_Action__mdt> salesPathRecord = New List<Sales_Path_Action__mdt>();
            Application_Proposal__c appRecord = [SELECT Id,Name,RecordType.Name,Proposal_Stages__c From Application_Proposal__c WHERE Id =: propId];
            system.debug('appRecord ==> '+appRecord);
            if(appRecord.RecordType.Name == 'Industrial Fellowship'){
                salesPathRecord = [SELECT Current_Action__c,Next_Stage__c,Record_Type__c,Stage__c From Sales_Path_Action__mdt WHERE
                 Record_Type__c =: appRecord.RecordType.Name AND Stage__c =: appRecord.Proposal_Stages__c];
            }
            system.debug('salesPathRecord ==> '+salesPathRecord);
            return salesPathRecord;
        }catch(Exception e){
            return null;
        }
    }
}