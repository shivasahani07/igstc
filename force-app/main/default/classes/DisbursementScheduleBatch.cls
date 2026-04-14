public class DisbursementScheduleBatch implements Database.Batchable<sObject>, Database.Stateful{

    public Database.QueryLocator start(Database.BatchableContext bc){
        Date todayDate = system.today();
        string devName = 'Industrial_Fellowships';
        string devName2 = 'PECFAR';
        return Database.getQueryLocator('SELECT Id,Start_Date__c,End_Date__c,Proposals__c FROM Disbursement_Schedule__c WHERE Start_Date__c =: todayDate and (Proposals__r.RecordType.DeveloperName =: devName or Proposals__r.RecordType.DeveloperName =: devName2)');
    }

    public void execute(Database.BatchableContext bc, List<Disbursement_Schedule__c> disbursementList){

        set<String> proposalList = New set<String>();
        List<Task> taskList = New List<Task>();
        system.debug('disbursementList ::'+disbursementList);
        for(Disbursement_Schedule__c disbursementRec : disbursementList){
            proposalList.add(disbursementRec.Proposals__c);
        }

        for(String record : proposalList){
            Task taskRecord = New Task();
            taskRecord.WhatId = record;
            taskRecord.Subject = 'Next set of Tranche Release';
            taskList.add(taskRecord);
        }
        insert taskList;
    }

    public void finish(Database.BatchableContext bc){
        System.debug('The Batch Run Successfully');
    }
}