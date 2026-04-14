public class fileuploadDisbursementIF {
    public id recId{get;set;}
    public string contactName{get;set;}
    public Boolean attendanceRemainder{get;set;}
    public Boolean SEUCRemainder{get;set;}
    public Boolean progressRemainder{get;set;}
    public Boolean SupportingRemainder{get;set;}
    public string bemSize;
    public Disbursement_Schedule__c ds{get;set;}
    public fileuploadDisbursementIF(ApexPages.StandardController ctrl) {
      //  recId='a1vIn000000H7A2IAK';
        recId=apexpages.currentpage().getparameters().get('id');
        ds = [SELECT Id, Proposal_Contact_Name__c, proposals__r.recordtype.developername,Attendance_Report_Remainder__c,Progress_Report_Remainder__c,Supporting_Documents_Remainder__c,Send_SE_UC_reminder__c,Send_Closure_remainder__c,Name,Proposals__c, Tranche__c,Start_Date__c, End_Date__c FROM Disbursement_Schedule__c where id =: recId];
        bemSize = 'Tranche ' + ds.Tranche__c;
        contactName = ds.Proposal_Contact_Name__c;
        SEUCRemainder = ds.Send_SE_UC_reminder__c;
        attendanceRemainder = ds.Attendance_Report_Remainder__c;
        progressRemainder = ds.Progress_Report_Remainder__c;
        SupportingRemainder = ds.Supporting_Documents_Remainder__c;
    }
    public string parentid{get;set;}
    public transient string filename{get;set;}
    public transient blob filebody{get;set;}
    public transient string filename1{get;set;}
    public transient blob filebody1{get;set;}
    public transient string filename2{get;set;}
    public transient blob filebody2{get;set;}
    public transient string filename3{get;set;}
    public transient blob filebody3{get;set;}
    
    public void upload(){
        if(fileBody != null && fileName!= null)  {
            attachment attach = new attachment();
            attach.parentId = recId;
            attach.body=filebody;
            attach.name='SE-UC Report - ' + bemSize + '.pdf';
            insert attach;
            
            Task taskRecord = New Task();
            taskRecord.WhatId = ds.Proposals__c;
            taskRecord.Subject = 'Review SE/UC Report - ' + bemSize ;
            insert taskRecord;
            
            ds.SE_UC_report_submitted__c = true;
            update ds;
            
            
            
            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM,'SE/UC report uploaded successfully!!')); 
        }
    }
 
    public void upload1(){
        if(fileBody1 != null && fileName1 != null)  {
            attachment attach = new attachment();
            attach.parentId = recId;
            attach.body=filebody1;
            attach.name='Attendance Report - ' + bemSize + '.pdf';
            insert attach;
            
            Task taskRecord = New Task();
            taskRecord.WhatId = ds.Proposals__c;
            taskRecord.Subject = 'Review Attendance Report - '+ bemSize;
            insert taskRecord;
            
            ds.Attendance_Report_Submitted__c = true;
            update ds;
            
            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM,'Attendance report uploaded successfully!!'));           
            
        }
    }  
    
    public void upload2(){
        if(fileBody2 != null && fileName2!= null)  {
            attachment attach = new attachment();
            attach.parentId = recId;
            attach.body=filebody2;
            attach.name='Progress Report - ' + bemSize + '.pdf';
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
    public void upload3(){
        if(fileBody3 != null && fileName3!= null)  {
            attachment attach = new attachment();
            attach.parentId = recId;
            attach.body=filebody3;
            attach.name='Supporting Document - ' + bemSize + '.pdf';
           
            insert attach;
            
            Task taskRecord = New Task();
            taskRecord.WhatId = ds.Proposals__c;
            taskRecord.Subject = 'Review Supporting Document - ' + bemSize;
            insert taskRecord;
            
          
            
            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM,'Supporting Documents uploaded successfully!!')); 
        }
    }
 
}