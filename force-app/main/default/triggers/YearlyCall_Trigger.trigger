trigger YearlyCall_Trigger on YealyCall__c (before insert) {
	
    // Trigger to generate the Yearly Call Name
    if(Trigger.isBefore && Trigger.isInsert){
        YearlyCall_Trigger_Controller.generateAutoNumber(Trigger.new);
    }
}