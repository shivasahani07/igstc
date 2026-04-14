public class displayUserDocumentsOnProposalApexClass {
     
    //added on 23oct
    @AuraEnabled(cacheable=true)
    public static List<User_Document__c> displayUDList(String proposalId){
        return [SELECT Id, Name, Status__c, Document_uploaded__c,Order__c FROM User_Document__c where Proposals__c=:proposalId AND Order__c != null order by Order__c asc];
         
    }

    @AuraEnabled(cacheable=true)
    public static List<User_Document__c> getUserDocumentList1(String proposalId){
        return [SELECT Id, Name, Status__c, Document_uploaded__c FROM User_Document__c where Proposals__c=:proposalId AND Status__c='uploaded'];
         
    }

    @AuraEnabled(cacheable=true)
    public static List<User_Document__c> getUserDocumentList2(String proposalId){
        return [SELECT Id, Name, Status__c, Document_uploaded__c FROM User_Document__c where Proposals__c=:proposalId AND Status__c='pending'];
         
    }

    @AuraEnabled(cacheable=true)
    public static List<User_Document__c> getcontactUD(String proposalId){
        List<contact> conList = new List<contact>();
    Application_Proposal__c propData = [Select id , RecordTypeId,RecordType.Name,IF_tranche__c from Application_Proposal__c where id = : proposalId];
    if(propData.RecordType.Name == 'WISER'){
        conList = [SELECT Id, Name,Institution__c,Tentative_Start_Date__c,Tentative_End_Date__c, Fellowship_Duration__c, Industrial_Fellowship_Type__c, PhD_Enroll_Date__c, CONTACT_ADDRESS_FORMULA__c ,Is_Primary__c FROM contact where Proposals__c=:proposalId and Is_Primary__c = true];
    }
    else {
        conList = [SELECT Id, Name,Institution__c,Tentative_Start_Date__c,Tentative_End_Date__c, Fellowship_Duration__c, Industrial_Fellowship_Type__c, PhD_Enroll_Date__c, CONTACT_ADDRESS_FORMULA__c  FROM contact where Proposals__c=:proposalId ];
    }
    return [SELECT Id, Name, Status__c, Document_uploaded__c,contact__r.Name FROM User_Document__c where Contact__c IN : conList AND Status__c='uploaded'];

    }

    @AuraEnabled(cacheable=true)
    public static List<User_Document__c> getcontactUD1(String proposalId){
        List<contact> conList = new List<contact>();
        Application_Proposal__c propData = [Select id , RecordTypeId,RecordType.Name,IF_tranche__c from Application_Proposal__c where id = : proposalId];
        if(propData.RecordType.Name == 'WISER'){
            conList = [SELECT Id, Name,Institution__c,Tentative_Start_Date__c,Tentative_End_Date__c, Fellowship_Duration__c, Industrial_Fellowship_Type__c, PhD_Enroll_Date__c, CONTACT_ADDRESS_FORMULA__c , Is_Primary__c FROM contact where Proposals__c=:proposalId and Is_Primary__c = true];
        }
        else {
            conList = [SELECT Id, Name,Institution__c,Tentative_Start_Date__c,Tentative_End_Date__c, Fellowship_Duration__c, Industrial_Fellowship_Type__c, PhD_Enroll_Date__c, CONTACT_ADDRESS_FORMULA__c  FROM contact where Proposals__c=:proposalId ];
        }
        return [SELECT Id, Name, Status__c, Document_uploaded__c,contact__r.Name FROM User_Document__c where Contact__c IN : conList AND Status__c='pending'];
         
    }
    
}