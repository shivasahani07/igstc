public class fileUploadDisbursementScheduleApexClass {
    public id recId{get;set;}
    public string contactName{get;set;}
    public Boolean ClosureRemainder{get;set;}
    public Boolean SEUCRemainder{get;set;}
    public string bemSize;
    public Disbursement_Schedule__c ds{get;set;}
    public fileUploadDisbursementScheduleApexClass(ApexPages.StandardController ctrl) {
        recId=apexpages.currentpage().getparameters().get('id');
        ds = [SELECT Id, Proposal_Contact_Name__c, proposals__r.recordtype.developername,Send_SE_UC_reminder__c,Send_Closure_remainder__c,Name,Proposals__c, Tranche__c,Start_Date__c, End_Date__c FROM Disbursement_Schedule__c where id =: recId];
        bemSize = 'Tranche ' + ds.Tranche__c;
        contactName = ds.Proposal_Contact_Name__c;
        SEUCRemainder = ds.Send_SE_UC_reminder__c;
        ClosureRemainder = ds.Send_Closure_remainder__c;
    }
    public string parentid{get;set;}
    public string filename{get;set;}
    public blob filebody{get;set;}
    public string filename1{get;set;}
    public blob filebody1{get;set;}
    public string filename2{get;set;}
    public blob filebody2{get;set;}
    
    public void upload(){
        if(fileBody != null && fileName!= null)  {
            attachment attach = new attachment();
            attach.parentId = recId;
            attach.body=filebody;
            attach.name='Attendance Report - ' + bemSize;
            insert attach;
            
            Task taskRecord = New Task();
            taskRecord.WhatId = ds.Proposals__c;
            taskRecord.Subject = 'Review Attendance Report - ' + bemSize;
            insert taskRecord;
            
            ds.Attendance_Report_Submitted__c = true;
            update ds;
            
            
            
            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM,'Attendance report uploaded successfully!!')); 
        }
    }
 
    public void upload1(){
        if(fileBody1 != null && fileName1 != null)  {
            attachment attach = new attachment();
            attach.parentId = recId;
            attach.body=filebody1;
            attach.name='SE/UC Report - ' + bemSize;
            insert attach;
            
            Task taskRecord = New Task();
            taskRecord.WhatId = ds.Proposals__c;
            taskRecord.Subject = 'Review SE/UC Report - '+ bemSize;
            insert taskRecord;
            
            ds.SE_UC_report_submitted__c = true;
            update ds;
            
            
            
            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM,'SE/UC report uploaded successfully!!')); 
        }
    }
    
    public void upload2(){
        if(fileBody2 != null && fileName2!= null)  {
            attachment attach = new attachment();
            attach.parentId = recId;
            attach.body=filebody2;
            attach.name='Progress Report - ' + bemSize;
            insert attach;
            
            Task taskRecord = New Task();
            taskRecord.WhatId = ds.Proposals__c;
            taskRecord.Subject = 'Review Progress Report - ' + bemSize;
            insert taskRecord;
            
            ds.Annual_Progress_Report_submitted__c = true;
            update ds;
            
            
            
            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM,'Progress report uploaded successfully!!')); 
        }
    }
 
}