public class fileUploadDisbursement_workshop {
    public id recId{get;set;}
    public string contactName{get;set;}
    public string countryType{get;set;}
    public string bemSize;
    public Disbursement_Schedule__c ds;
    public fileUploadDisbursement_workshop(ApexPages.StandardController ctrl) {
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
    
    
    public void upload1(){
        if(fileBody1 != null && fileName1!= null)  {
            attachment attach = new attachment();
            attach.parentId = recId;
            attach.body=filebody1;
            attach.name='Brief report - ' + bemSize;
            insert attach;
            
            Task taskRecord = New Task();
            taskRecord.WhatId = ds.Proposals__c;
            taskRecord.Subject = 'Review Brief report - ' + bemSize;
            insert taskRecord;
            
            ds.Brief_report_submitted__c = true;
            update ds;
                        
            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM,'Brief report uploaded successfully!!')); 
        }
    }
 
    public void upload2(){
        if(fileBody2 != null && fileName2 != null)  {
            attachment attach = new attachment();
            attach.parentId = recId;
            attach.body=filebody2;
            attach.name='Detailed Report - ' + bemSize;
            insert attach;
            
            Task taskRecord = New Task();
            taskRecord.WhatId = ds.Proposals__c;
            taskRecord.Subject = 'Review detailed report - '+ bemSize;
            insert taskRecord;
            
            ds.Detailed_report_submitted__c = true;
            update ds;
            
            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM,'Detailed report uploaded successfully!!')); 
        }
    }
    
}