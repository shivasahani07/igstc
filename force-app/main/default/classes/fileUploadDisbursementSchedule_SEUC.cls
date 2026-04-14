public class fileUploadDisbursementSchedule_SEUC {
    public id recId{get;set;}
    public string contactName{get;set;}
    public string bemSize;
    public Disbursement_Schedule__c ds;
    public fileUploadDisbursementSchedule_SEUC(ApexPages.StandardController ctrl) {
        recId=apexpages.currentpage().getparameters().get('id');
        ds = [SELECT Id, Proposal_Contact_Name__c,Name,Proposals__c, Tranche__c,Start_Date__c, End_Date__c FROM Disbursement_Schedule__c where id =: recId];
        bemSize = 'Tranche ' + ds.Tranche__c;
        contactName = ds.Proposal_Contact_Name__c;
    }
    public string parentid{get;set;}
    
    public string filename1{get;set;}
    public blob filebody1{get;set;}
    public string filename2{get;set;}
    public blob filebody2{get;set;}
    public string filename3{get;set;}
    public blob filebody3{get;set;}
    public string filename4{get;set;}
    public blob filebody4{get;set;}
    
    public void upload1(){
        if(fileBody1 != null && fileName1!= null)  {
            attachment attach = new attachment();
            attach.parentId = recId;
            attach.body=filebody1;
            attach.name='SE/UC Report - ' + bemSize;
            insert attach;
            
            Task taskRecord = New Task();
            taskRecord.WhatId = ds.Proposals__c;
            taskRecord.Subject = 'Review SE/UC Report - ' + bemSize;
            insert taskRecord;
            
            ds.SE_UC_report_submitted__c = true;
            update ds;
                        
            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM,'SE/UC Report uploaded successfully!!')); 
        }
    }
 
    public void upload2(){
        if(fileBody2 != null && fileName2 != null)  {
            attachment attach = new attachment();
            attach.parentId = recId;
            attach.body=filebody2;
            attach.name='Visit Report - ' + bemSize;
            insert attach;
            
            Task taskRecord = New Task();
            taskRecord.WhatId = ds.Proposals__c;
            taskRecord.Subject = 'Review Visit Report - '+ bemSize;
            insert taskRecord;
            
            ds.Visit_Report_Submitted__c = true;
            update ds;
            
            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM,'Visit Report uploaded successfully!!')); 
        }
    }
    public void upload3(){
        if(fileBody3 != null && fileName3 != null)  {
            attachment attach = new attachment();
            attach.parentId = recId;
            attach.body=filebody3;
            attach.name='KPI Report - ' + bemSize;
            insert attach;
            
            Task taskRecord = New Task();
            taskRecord.WhatId = ds.Proposals__c;
            taskRecord.Subject = 'Review KPI Report - '+ bemSize;
            insert taskRecord;
            
            ds.KPI_Report_Submitted__c = true;
            update ds;
            
            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM,'KPI Report uploaded successfully!!')); 
        }
    }
    public void upload4(){
        if(fileBody4 != null && fileName4 != null)  {
            attachment attach = new attachment();
            attach.parentId = recId;
            attach.body=filebody4;
            attach.name='APR Report - ' + bemSize;
            insert attach;
            
            Task taskRecord = New Task();
            taskRecord.WhatId = ds.Proposals__c;
            taskRecord.Subject = 'Review APR Report - '+ bemSize;
            insert taskRecord;
            
            ds.Annual_Progress_Report_submitted__c = true;
            update ds;
            
            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM,'APR Report uploaded successfully!!')); 
        }
    }
}