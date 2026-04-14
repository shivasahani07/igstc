public class fileUploadDisbursement_connectplus {
    public id recId{get;set;}
    public string contactName{get;set;}
    public string countryType{get;set;}
    public string bemSize;
    public Disbursement_Schedule__c ds;
    public fileUploadDisbursement_connectplus(ApexPages.StandardController ctrl) {
        recId=apexpages.currentpage().getparameters().get('id');
        ds = [SELECT Id, Proposal_Contact_Name__c,Name,Contact__r.account_country_type__c,Contact__c,Proposals__c, Tranche__c,Start_Date__c, End_Date__c FROM Disbursement_Schedule__c where id =: recId];
        bemSize = 'Tranche ' + ds.Tranche__c;
        contactName = ds.Proposal_Contact_Name__c;
        countryType = ds.Contact__r.account_country_type__c;
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
            attach.name='SE-UC Report - ' + bemSize;
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
            attach.name='Euro Remittance Invoice - ' + bemSize;
            insert attach;
            
            Task taskRecord = New Task();
            taskRecord.WhatId = ds.Proposals__c;
            taskRecord.Subject = 'Review Euro Remittance Invoice - '+ bemSize;
            insert taskRecord;
            
            ds.Euro_Remittance_invoice_submitted__c = true;
            update ds;
            
            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM,'Euro Remittance Invoice uploaded successfully!!')); 
        }
    }
    public void upload4(){
        if(fileBody4 != null && fileName4 != null)  {
            attachment attach = new attachment();
            attach.parentId = recId;
            attach.body=filebody4;
            attach.name='Bank account details  - ' + bemSize;
            insert attach;
            
            Task taskRecord = New Task();
            taskRecord.WhatId = ds.Proposals__c;
            taskRecord.Subject = 'Review Bank account details - '+ bemSize;
            insert taskRecord;
            
            ds.Bank_account_details_submitted__c = true;
            update ds;
            
            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM,'Bank account details uploaded successfully!!')); 
        }
    }
}