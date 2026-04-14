public with sharing class generateHashcodeForCons {
    public generateHashcodeForCons() {

    }

    @InvocableMethod(label='Update Cons hashcode' description='Updating hashcode for Contacts.' category='Contact')
    public static void generateLoginHashCode(List<string> ids){
        try{
            Date todayDate  = System.today();
            system.debug('Proposal Igs ==> '+ids);
            List<Contact> contactList = New List<Contact>();
            List<Contact> contactListToUpdate = New List<Contact>();
            contactList = [SELECT Id,Name,Login_Hash_Code__c FROM Contact WHERE Proposals__c IN : ids];
            system.debug('contactList ==> '+contactList);
			
            //logic added by rutuja
            HashcodeExpiryDate__c hashcodeNumberofDays = HashcodeExpiryDate__c.getInstance();
            Decimal test = hashcodeNumberofDays.Hashcode_Expiration_Date__c;
            //till here
            
            for(Contact con : contactList){
                system.debug('HashCode ==>'+con.Login_Hash_Code__c);
                    con.Login_Hash_Code__c = Utility.generateRandomString();
                    //con.Hashcode_Expiration_Date__c = todayDate.addDays(3); 
                    con.Hashcode_Expiration_Date__c = todayDate.addDays(Integer.valueOf(hashcodeNumberofDays.Hashcode_Expiration_Date__c));
                
                    contactListToUpdate.add(con);
            }
            if(!contactListToUpdate.isEmpty()){
                update contactListToUpdate;
            }
        }catch(Exception e){

        }
    }
}