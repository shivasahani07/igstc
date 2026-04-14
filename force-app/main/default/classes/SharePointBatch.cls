global without sharing class SharePointBatch implements Database.Batchable<sObject> ,Database.AllowsCallouts
{
    private List<String> recordIds;
    
    public SharePointBatch(List<String> recordIds) {
        this.recordIds = recordIds;
    }
    
    public Database.QueryLocator start(Database.BatchableContext BC)
    {
        system.debug('recordIds==========>'+recordIds);
        return Database.getQueryLocator([Select Id,Name,RecordType.DeveloperName From Application_Proposal__c WHERE Id IN :recordIds]);
        //changed by rutuja to test 
        //return Database.getQueryLocator([Select Id,Name,RecordType.DeveloperName From Application_Proposal__c WHERE Id = 'a081y000003qO5SAAU']);

    }
    
    public void execute(Database.BatchableContext BC, List<Application_Proposal__c> appProposaList)
    {
        system.debug('appProposaList========>'+appProposaList);
        for(Application_Proposal__c pro :appProposaList){
            //This will create the main Folder on site.. 
            String response = SharePointHandler.createFolderInsideSite('Proposals/'+pro.RecordType.DeveloperName+'/'+pro.Name);
            
            if(response=='Success'){
                //This will create the folders under the proposal .
                try{
                    SharePointCallout.createSubFolders(pro);
                }catch(Exception e){
                    system.debug('Exception '+e.getMessage() + '@' +e.getLineNumber());
                }
                
            }
        }
    }
    public void finish(Database.BatchableContext BC) {
    }
}