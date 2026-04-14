public class Utility {
    
    public static List<String> getPicklistValues(String ObjectApi_name,String Field_name){ 
        
        List<String> lstPickvals                        = new List<String>();
        Schema.SObjectType targetType                   = Schema.getGlobalDescribe().get(ObjectApi_name);
        Sobject Object_name                             = targetType.newSObject();
        Schema.sObjectType sobject_type                 = Object_name.getSObjectType(); 
        Schema.DescribeSObjectResult sobject_describe   = sobject_type.getDescribe();
        Map<String, Schema.SObjectField> field_map      = sobject_describe.fields.getMap();
        List<Schema.PicklistEntry> pick_list_values     = field_map.get(Field_name).getDescribe().getPickListValues();
        
        for (Schema.PicklistEntry a : pick_list_values) {
            
            lstPickvals.add(String.ValueOf(a.getLabel()).trim());  
        }
        return lstPickvals;
    }

    public static String generateRandomString(){
        Integer len = 10;
        final String chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
        String randStr = '';
        while (randStr.length() < len) {
            Integer idx = Math.mod(Math.abs(Crypto.getRandomInteger()), chars.length());
            randStr += chars.substring(idx, idx+1);
        }
        return randStr+string.ValueOf(system.now().getTime()); 
    }

    public static string getProposalRecordType(string recordTypeName){
        return Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get(recordTypeName).getRecordTypeId();
    }

    public static string getAccountRecordType(string name){
        return Schema.SObjectType.Account.getRecordTypeInfosByName().get(name).getRecordTypeId(); 
    }

    @InvocableMethod(label='Update hashcode' description='Updating null hashcode for Contacts.' category='Contact')
  public static void updatehashcode(List<string> ids) {
    List<Contact> conList = New List<Contact>();
    for(String con : ids){
        Contact conRec = New Contact();
        conRec.Id = con;
        conRec.Login_Hash_Code__c = generateRandomString();
        conList.add(conRec);
    }
    update conList;
    system.debug('ids --> '+ids);
    // return null;
  }

}