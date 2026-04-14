public class WorkPackageTriggerHelper {
    
    /*public static void increaseCount(List<Work_Package__c> wpList){
        
        List<Work_Package__c> existingSequence = [select id,Name,WP_Sequence__c,Application__c from Work_Package__c where Application__c = :wpList[0].Application__c order by WP_Sequence__c DESC];
        if(existingSequence.size() > 0){
            Decimal intCount = existingSequence[0].WP_Sequence__c;
            for(Work_Package__c wp : wpList){
                wp.WP_Sequence__c = intCount +0.1;
            }
        }else{
            for(Work_Package__c wp : wpList){
                wp.WP_Sequence__c =  1.0;
            }
        }
    }*/
    
}