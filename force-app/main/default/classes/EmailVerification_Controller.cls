public withOut sharing class EmailVerification_Controller {
    @RemoteAction
    public static string verifyEmail(string hashcode) {
        if(!String.isBlank(hashcode)){
            List<Contact> contactRec = [select name,id,Email,Email_Verified__c,Campaign__c from Contact where Id=:hashcode];
            if(contactRec.size() > 0){
                contactRec[0].Email_Verified__c = true;
                    update contactRec[0];
                    return contactRec[0].Name;
            }
        }
        return 'verified';
    }
}