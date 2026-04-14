public with sharing class ReviewerAllocationController {
    public class SideBarDataWrapper {
        @AuraEnabled public List<Side_Bar_Item__mdt> sidebarItems { get; set; }
    }

    @AuraEnabled(cacheable=true)
    public static SideBarDataWrapper getSideBarOnLoadData() {
        SideBarDataWrapper wrap = new SideBarDataWrapper();
        try {
            List<Side_Bar_Item__mdt> records = [
                SELECT Id, SL_No__c, MasterLabel, Value__c, Icon__c
                FROM Side_Bar_Item__mdt ORDER BY SL_No__c
            ];
            wrap.sidebarItems = records;
        } catch(Exception e) {
            System.debug('Error while fetching sidebar items ---> ' + e.getMessage() + ' at line number ---> ' + e.getLineNumber());
        }
        return wrap;
    }
}