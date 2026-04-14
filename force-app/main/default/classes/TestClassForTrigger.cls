@isTest
public class TestClassForTrigger {
    @isTest
    Public static void TriggeronExpenseMaster(){
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());
        
        Account acc=new Account();
        acc.Name='Account For Test';
        insert acc;
        
        Application_Proposal__c pro=new Application_Proposal__c();
        Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Industrial Fellowship').getRecordTypeId();
        pro.RecordTypeId = IFRecordTypeId;
        insert pro;
        
        Expense_Master__c expMaster=new Expense_Master__c();
        expMaster.Account__c=acc.Id;
        expMaster.Proposals__c=pro.Id;
        
        insert expMaster;
    }
    
     @isTest
    Public Static Void testMethodUpadteProposalTotalAmountFC(){
        
        Financial_Contribution__c financialContributionRec = new Financial_Contribution__c();
        insert financialContributionRec;
        
        financialContributionRec.Number__c = 12;
        update financialContributionRec;
        
    }
    
    @isTest
    Public Static Void testMethodproposalInstance(){
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());
        Application_Proposal__c AppProposal=new Application_Proposal__c();
        Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Industrial Fellowship').getRecordTypeId();
        AppProposal.RecordTypeId = IFRecordTypeId;
        insert AppProposal;
         AppProposal.Awarded_Amount__c=12.5;
         update AppProposal;
        
    }

    @isTest
    Public Static Void testMethodEvaluationStep(){
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());
        Application_Proposal__c AppProposal=new Application_Proposal__c();
        Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Industrial Fellowship').getRecordTypeId();
        AppProposal.RecordTypeId = IFRecordTypeId;
        insert AppProposal;

         Evaluation_Step__c evalStep = new Evaluation_Step__c(Subject__c ='Test', Status__c= 'Completed',Proposals__c=AppProposal.Id);
         insert evalStep;
        evalStep.Status__c = 'Approved';
        update evalStep;
        
    }
    

}