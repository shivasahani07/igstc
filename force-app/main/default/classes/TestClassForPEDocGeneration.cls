@isTest
public class TestClassForPEDocGeneration {
        public static testMethod void PEDocGeenarationTest(){
        test.startTest();
        GenerateCongaTemplate__e docGenration = new GenerateCongaTemplate__e();
        docGenration.Proposal_Id__c = null;
        docGenration.Proposal_RecordType_Name__c = null;
        EventBus.publish(docGenration);
        test.stopTest();
        }
}