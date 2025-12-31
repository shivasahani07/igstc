public class YearlyCall_Trigger_Controller {
	
    public static void generateAutoNumber(List<YealyCall__c> yearlyCallList){
        
        for(YealyCall__c yc : yearlyCallList){
            yc.Yearly_Call_Name__c = 'YEAR' + '_' + yc.Campaign__r.Name + '_' + yc.Year__c + 'Auto Number';
        }
    }
}