public withOut sharing class Proposal_Controller {
    
    /* public string thematicAreaList {get;set;}
public string duration  {get;set;}
public String ApplicantPortalSiteURL {get;set;}
public String candidateId {get;set;}

public Proposal_Controller(){
ApplicantPortalSiteURL = Constants.CANDIDATE_SITE ;
thematicAreaList = JSON.serialize(fetchAllThematicArea());

candidateId = Apexpages.currentPage().getParameters().get('id'); 
system.debug('candidateId---'+candidateId);
}*/
    
    //************************************** PROJECT DETAIL PAGE ***********************************************
    
    /*
public static Application_Proposal__c getApplicantDetails(string applicantHashCode){

contact conRec = [select name,id,Proposals__c from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
Id twoPlusTwoRtId = [SELECT Id FROM RecordType WHERE SobjectType = 'Application_Proposal__c' AND DeveloperName = 'Two_Plus_Two' LIMIT 1].Id;

system.debug('applicantHashCode' +applicantHashCode);
Application_Proposal__c proposalRecord;
if(!string.isBlank(conRec.Proposals__c)){
//   proposalRecord = [SELECT id,Name,Acronym__c,Title_Of__c,Title_In_German__c,Thematic_Topic__c,Duration_In_Months_Max_36__c,Tentative_Start_Date__c,Summary__c,KeyWords__c,Abstract_of_proposed__c,Project_Description__c,Stage__c,Proposed_Venue__c,Proposed_Date__c,(select name,id,Thematic_Area_Name__c	 from Application_Thematic_Area__r) FROM Application_Proposal__c WHERE Id=: conRec.Proposals__c];
proposalRecord = [SELECT Id, Name, Acronym__c, Title_Of__c, Title_In_German__c,Thematic_Topic__c, Duration_In_Months_Max_36__c,Tentative_Start_Date__c, Summary__c, KeyWords__c,Abstract_of_proposed__c, Project_Description__c,Stage__c, Proposed_Venue__c, Proposed_Date__c,(SELECT Name, Id, Thematic_Area_Name__c FROM Application_Thematic_Area__r) FROM Application_Proposal__c WHERE Id IN (SELECT Proposals__c FROM Applicant_Proposal_Association__c WHERE Contact__c = :conRec.Id)AND RecordTypeId = :twoPlusTwoRtId];


system.debug('proposalRecord----'+proposalRecord);
return proposalRecord;
}

//else{
//     return proposalRecord;  
// }     
//     System.debug('proposalId===>'+proposalId);
//    // proposalId = 'a04e10000003LMTAA2';
//     Application_Proposal__c proposalRecord;
//     if (String.isNotBlank(proposalId)) {
// 	proposalRecord = [SELECT id,Name,Acronym__c,Title_Of__c,Title_In_German__c,Thematic_Topic__c,Duration_In_Months_Max_36__c,Tentative_Start_Date__c,Summary__c,KeyWords__c,Abstract_of_proposed__c,Project_Description__c,Stage__c,Proposed_Venue__c,Proposed_Date__c,(select name,id,Thematic_Area_Name__c	 from Application_Thematic_Area__r) FROM Application_Proposal__c WHERE Id=: proposalId];

//  } 
return proposalRecord;

}
*/
    public static Application_Proposal__c getApplicantDetails(string applicantHashCode){
        
        contact conRec = [select name,id,Proposals__c from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
        Id twoPlusTwoRtId = [SELECT Id FROM RecordType WHERE SobjectType = 'Application_Proposal__c' AND DeveloperName = 'Two_Plus_Two' LIMIT 1].Id;
        
        system.debug('applicantHashCode' +applicantHashCode);
        Application_Proposal__c proposalRecord;
        
        if(!string.isBlank(conRec.Proposals__c)){
            // Option 1: Use direct lookup (if this is what you want)
            proposalRecord = [SELECT Id, Name, Acronym__c, Title_Of__c, Title_In_German__c,Thematic_Topic__c, Duration_In_Months_Max_36__c,Tentative_Start_Date__c, Summary__c, KeyWords__c,Abstract_of_proposed__c, Project_Description__c,Stage__c, Proposed_Venue__c, Proposed_Date__c,(SELECT Name, Id, Thematic_Area_Name__c FROM Application_Thematic_Area__r) FROM Application_Proposal__c WHERE Id = :conRec.Proposals__c AND RecordTypeId = :twoPlusTwoRtId];
            
            system.debug('proposalRecord----'+proposalRecord);
            return proposalRecord;
        } else {
            // Option 2: If no direct lookup, try junction object
            List<Application_Proposal__c> proposalRecords = [SELECT Id, Name, Acronym__c, Title_Of__c, Title_In_German__c,Thematic_Topic__c, Duration_In_Months_Max_36__c,Tentative_Start_Date__c, Summary__c, KeyWords__c,Abstract_of_proposed__c, Project_Description__c,Stage__c, Proposed_Venue__c, Proposed_Date__c,(SELECT Name, Id, Thematic_Area_Name__c FROM Application_Thematic_Area__r) FROM Application_Proposal__c WHERE Id IN (SELECT Proposals__c FROM Applicant_Proposal_Association__c WHERE Contact__c = :conRec.Id) AND RecordTypeId = :twoPlusTwoRtId LIMIT 1];
            
            if(!proposalRecords.isEmpty()) {
                return proposalRecords[0];
            }
        }
        
        return null;
    }
    
    
    
    
    // insert association record, tag proposal to association, account
    public static insertApplicationWrapper insertApplication(
        Application_Proposal__c applicantDetails, 
        List<String> setThemeList, 
        Integer day, 
        Integer month, 
        Integer year,
        String conId, 
        String recordType, 
        String yearlyCallId
    ) {
        insertApplicationWrapper datawrapper = new insertApplicationWrapper();
        
        try {
            // Set tentative start date if valid date parameters provided
            if (day != null && month != null && year != null && day > 0 && month > 0 && year > 0) {
                applicantDetails.Tentative_Start_Date__c = Date.newInstance(year, month, day);
            }
            
            // Set proposal stage with fallback value
            applicantDetails.Stage__c = String.isNotBlank(applicantDetails.Stage__c) ? applicantDetails.Stage__c : '1st Stage';
            applicantDetails.RecordTypeId = Utility.getProposalRecordType('Two Plus Two');
            applicantDetails.Proposal_Stages__c = 'Draft';
            applicantDetails.yearly_Call__c = yearlyCallId;
            
            // Upsert the proposal
            upsert applicantDetails;
            
            // Handle Applicant_Proposal_Association__c - create if doesn't exist
            Applicant_Proposal_Association__c association;
            List<Applicant_Proposal_Association__c> existingAppPropAssoc = [
                SELECT Id, Contact__c, Proposals__c 
                FROM Applicant_Proposal_Association__c 
                WHERE Contact__c = :conId 
                AND Proposals__c = :applicantDetails.Id 
                LIMIT 1
            ];
            
            if (existingAppPropAssoc.isEmpty()) {
                association = new Applicant_Proposal_Association__c(
                    Contact__c = conId,
                    Proposals__c = applicantDetails.Id,
                     Is_Coordinator__c = true
                );
                insert association;
            } else {
                association = existingAppPropAssoc[0];
            }
            
            // Handle Application_Thematic_Area__c records
            if (setThemeList != null && !setThemeList.isEmpty()) {
                // Delete existing thematic areas for this application
                delete [SELECT Id FROM Application_Thematic_Area__c WHERE Application__c = :applicantDetails.Id];
                
                // Create new thematic area records
                List<Application_Thematic_Area__c> appThematicAreaList = new List<Application_Thematic_Area__c>();
                for (String theme : setThemeList) {
                    appThematicAreaList.add(new Application_Thematic_Area__c(
                        Application__c = applicantDetails.Id,
                        Thematic_Area__c = theme
                    ));
                }
                insert appThematicAreaList;
            }
            
            // Update related contact and account if needed
            // Note: The original code was updating Contact and Account without changing any fields
            // This has been removed as it's unnecessary. If you need to set specific fields, add them here.
            
            // Populate wrapper with results
            datawrapper.proposalId = applicantDetails.Id;
            datawrapper.proposal = applicantDetails;
            datawrapper.apa = association;
            
            return datawrapper;
            
        } catch (Exception e) {
            // Log the error properly
            System.debug('Error in insertApplication at line ' + e.getLineNumber() + ': ' + e.getMessage());
            System.debug('Stack trace: ' + e.getStackTraceString());
            
            // Instead of returning null, return wrapper with error information
            // You might want to add error fields to your wrapper class
            throw new AuraHandledException('Error creating application: ' + e.getMessage());
        }
    }
    
    public class insertApplicationWrapper {
        public String proposalId { get; set; }
        public Application_Proposal__c proposal { get; set; }
        public Applicant_Proposal_Association__c apa { get; set; }
        // Consider adding error fields if needed
        // public Boolean isSuccess { get; set; }
        // public String errorMessage { get; set; }
    }
    
    
    public static List<Thematic_Area__c> fetchAllThematicArea(){
        List<Thematic_Area__c> thematicAreaList = [SELECT Id,Name FROM Thematic_Area__c];
        if(!thematicAreaList.isEmpty()){
            return thematicAreaList;
        }
        return thematicAreaList;
    }
    
    public static  void deleteThematicArea(String themeId){
        delete new Application_Thematic_Area__c(id=themeId);
    }
    
    //********************************** CONSORTIA DETAILS ***************************************************
    
    
    public static string insertAccount(List<Account> accountDetails,List<Contact> contactDetails){
        try{
            upsert accountDetails;
            upsert contactDetails;
            return 'success';
        }catch (Exception e){
            return 'error';   
        }
    }
    
    
    public static string insertAccountAndContact(account accDetails, list<contact> conListToInsert){
        upsert accDetails;
        for(contact con:ConListToInsert){
            con.AccountId = accDetails.Id;
            
        }
        upsert ConListToInsert;
        return 'success';
    }
    
    public static string insertConsortiaDetailPage(list<ConsortiaDetails> ConsortiaDetailsList,string projectId){
        system.debug('accDetails---'+ConsortiaDetailsList);
        List<contact> contactToInsert = New List<contact>();
        List<Account> accountToInsert = New List<Account>();
        Map<string,List<contact>> accNameXcontactList = New Map<string,List<contact>>();
        for(ConsortiaDetails consortia:ConsortiaDetailsList){
            Account companyDetails = New Account(Name=consortia.company.Name,Website=consortia.company.Website,Country_Type__c=consortia.company.Country_Type__c,Proposals__c=projectId);
            if(!string.isBlank(consortia.company.Id)){
                companyDetails.Id = consortia.company.Id;
            }
            accountToInsert.add(companyDetails);
            accNameXcontactList.put(consortia.company.Name,consortia.partnerDetails);
        }
        system.debug('accNameXcontactList---'+accNameXcontactList);
        system.debug('accountToInsert---'+accountToInsert);
        upsert accountToInsert;
        Map<string,string> accNameXId = New Map<string,string>();
        for(Account acc:accountToInsert){
            accNameXId.put(acc.Name,acc.Id);
        }
        
        system.debug('accNameXId---'+accNameXId);
        for(string accName:accNameXcontactList.keyset()){
            for(Contact con : accNameXcontactList.get(accName)){
                con.AccountId = accNameXId.get(accName);
                con.Proposals__c = projectId;
                contactToInsert.add(con);
            }
        }
        system.debug('contactToInsert---'+contactToInsert);
        upsert contactToInsert;
        return 'success';
    }
    
    /*
public static list<account> getPatnerDetails(string applicantHashCode){
system.debug('applicantHashCode---'+applicantHashCode);
contact conRec = [select name,id,Proposals__c,Account.Name,account.Website, 
account.Id,account.Is_Coordinator__c,account.Is_Primary__c,account.Year_Of_Establishment__c,account.Last_Year_s_Balance__c,account.SME__c, account.Homepage_URL__c,account.Country_Type__c,account.Industry__c,
account.Email__c,account.Is_DSIR_Available__c,account.DSIR_Recoginition_Details__c,account.Company_Profile__c,account.Ownership_Profile__c,account.Company_Website__c,account.Academia__c,account.Phone,account.Main_Business_Area__c,account.Infrastructural_Facilities__c,
account.Domain_Expertise_Available__c,account.Large_Industry__c,account.Start_Up__c,account.BillingStreet,account.BillingCity,account.BillingState,account.BillingPostalCode,account.BillingCountry,account.Department__c
from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
list<contact> applicantList = New list<contact>();
system.debug('conRec.Proposals__c---'+conRec.Proposals__c);      



Set<Id> contactIds = new Set<Id>{conRec.Id}; // Start with the current contact

// Get all Contacts associated with Proposals through APA junction for this contact
List<Applicant_Proposal_Association__c> associations = [
SELECT Id, Contact__c, Proposals__c 
FROM Applicant_Proposal_Association__c 
WHERE Contact__c = :conRec.Id
];

// Get all unique Contact IDs from the associations
for(Applicant_Proposal_Association__c apa : associations) {
if(apa.Contact__c != null) {
contactIds.add(apa.Contact__c);
}
}

// Then get Accounts through their Contacts
List<Account> accountContactList = [
SELECT Name, Website, Id, Is_Coordinator__c, Is_Primary__c, Year_Of_Establishment__c, 
Last_Year_s_Balance__c, SME__c, Homepage_URL__c, Country_Type__c, Industry__c,
Email__c, Is_DSIR_Available__c, DSIR_Recoginition_Details__c, Company_Profile__c, 
Ownership_Profile__c, Company_Website__c, Academia__c, Phone, Main_Business_Area__c, 
Infrastructural_Facilities__c, Domain_Expertise_Available__c, Large_Industry__c, 
Start_Up__c, BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry, 
Department__c,
(SELECT Title, Name, Id, Designation__c, FirstName, LastName, Email, Phone, 
Actual_Position__c, Head_Of_Project__c, Department, Profile_Pic_Attachment_Id__c 
FROM Contacts 
WHERE Id IN :contactIds
ORDER BY createdDate ASC) 
FROM Account 
WHERE Id IN (SELECT AccountId FROM Contact WHERE Id IN :contactIds)
ORDER BY createdDate ASC
]; 

system.debug('accountContactList---'+accountContactList);
return accountContactList;
}
*/
    
    // OLD METHOD 
    /*
public static list<account> getPatnerDetails(string applicantHashCode){
system.debug('applicantHashCode---'+applicantHashCode);
contact conRec = [select name,id,Proposals__c,Account.Name,account.Website, 
account.Id,account.Is_Coordinator__c,account.Is_Primary__c,account.Year_Of_Establishment__c,account.Last_Year_s_Balance__c,account.SME__c, account.Homepage_URL__c,account.Country_Type__c,account.Industry__c,
account.Email__c,account.Is_DSIR_Available__c,account.DSIR_Recoginition_Details__c,account.Company_Profile__c,account.Ownership_Profile__c,account.Company_Website__c,account.Academia__c,account.Phone,account.Main_Business_Area__c,account.Infrastructural_Facilities__c,
account.Domain_Expertise_Available__c,account.Large_Industry__c,account.Start_Up__c,account.BillingStreet,account.BillingCity,account.BillingState,account.BillingPostalCode,account.BillingCountry,account.Department__c
from contact where Login_Hash_Code__c =:applicantHashCode limit 1];

system.debug('conRec.Proposals__c---'+conRec.Proposals__c);      

Set<Id> contactIds = new Set<Id>();
Set<Id> proposalIds = new Set<Id>();

// Get all Contacts associated with Proposals through APA junction
List<Applicant_Proposal_Association__c> associations = [
SELECT Id, Contact__c, Proposals__c 
FROM Applicant_Proposal_Association__c 
WHERE Contact__c = :conRec.Id
];

// Collect proposal IDs
for(Applicant_Proposal_Association__c apa : associations) {
if(apa.Proposals__c != null) {
proposalIds.add(apa.Proposals__c);
}
}

// Get all contacts associated with these proposals
if(!proposalIds.isEmpty()) {
List<Applicant_Proposal_Association__c> allAssociations = [
SELECT Id, Contact__c, Proposals__c 
FROM Applicant_Proposal_Association__c 
WHERE Proposals__c IN :proposalIds
];

for(Applicant_Proposal_Association__c apa : allAssociations) {
if(apa.Contact__c != null) {
contactIds.add(apa.Contact__c);
}
}
}

// Add the current contact as well
contactIds.add(conRec.Id);

// Get all account IDs from these contacts
List<Contact> allContacts = [
SELECT Id, AccountId 
FROM Contact 
WHERE Id IN :contactIds AND AccountId != null
];

Set<Id> accountIds = new Set<Id>();
for(Contact c : allContacts) {
if(c.AccountId != null) {
accountIds.add(c.AccountId);
}
}

// Now fetch Accounts with their Contacts
List<Account> accountContactList = [
SELECT Name, Website, Id, Is_Coordinator__c, Is_Primary__c, Year_Of_Establishment__c, 
Last_Year_s_Balance__c, SME__c, Homepage_URL__c, Country_Type__c, Industry__c,
Email__c, Is_DSIR_Available__c, DSIR_Recoginition_Details__c, Company_Profile__c, 
Ownership_Profile__c, Company_Website__c, Academia__c, Phone, Main_Business_Area__c, 
Infrastructural_Facilities__c, Domain_Expertise_Available__c, Large_Industry__c, 
Start_Up__c, BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry, 
Department__c,
(SELECT Title, Name, Id, Designation__c, FirstName, LastName, Email, Phone, 
Actual_Position__c, Head_Of_Project__c, Department, Profile_Pic_Attachment_Id__c,
Campaign__c
FROM Contacts 
ORDER BY createdDate ASC) 
FROM Account 
WHERE Id IN :accountIds
ORDER BY Is_Coordinator__c DESC NULLS LAST, createdDate ASC
]; 

system.debug('accountContactList---'+accountContactList);
return accountContactList;
}
*/
    
    // NEW METHOD TO GET PARTNER DETAILS USING PROPOSALID
    public static List<Account> getPatnerDetails(String proposalId) {
        System.debug('proposalId --- ' + proposalId);
        
        // Get all APA records using Proposal Id
        List<Applicant_Proposal_Association__c> associations = [
            SELECT Id, Contact__c, Proposals__c
            FROM Applicant_Proposal_Association__c
            WHERE Proposals__c = :proposalId
        ];
        
        if (associations.isEmpty()) {
            System.debug('-------------------------- NO APA FOUND --------------------------');
            return new List<Account>();
        }
        
        // Collect Contact IDs
        Set<Id> contactIdSet = new Set<Id>();
        for (Applicant_Proposal_Association__c apa : associations) {
            if (apa.Contact__c != null) {
                contactIdSet.add(apa.Contact__c);
            }
        }
        
        if (contactIdSet.isEmpty()) {
            System.debug('-------------------------- Contact Set is Empty --------------------------');
            return new List<Account>();
        }
        
        // Fetch Contacts
        List<Contact> allContacts = [
            SELECT Id, AccountId
            FROM Contact
            WHERE Id IN :contactIdSet
            AND AccountId != null
        ];
        
        if (allContacts.isEmpty()) {
            System.debug('-------------------------- NO Contacts FOUND --------------------------');
            return new List<Account>();
        }
        
        // Collect Account IDs
        Set<Id> accountIds = new Set<Id>();
        for (Contact c : allContacts) {
            if (c.AccountId != null) {
                accountIds.add(c.AccountId);
            }
        }
        
        if (accountIds.isEmpty()) {
            System.debug('-------------------------- Account Set is Empty --------------------------');
            return new List<Account>();
        }
        
        // Fetch Accounts with their Contacts
        List<Account> accountContactList = [
            SELECT Name, Website, Id, Is_Coordinator__c, Is_Primary__c, Year_Of_Establishment__c,
            Last_Year_s_Balance__c, SME__c, Homepage_URL__c, Country_Type__c, Industry__c,
            Email__c, Is_DSIR_Available__c, DSIR_Recoginition_Details__c, Company_Profile__c,
            Ownership_Profile__c, Company_Website__c, Academia__c, Phone, Main_Business_Area__c,
            Infrastructural_Facilities__c, Domain_Expertise_Available__c, Large_Industry__c,
            Start_Up__c, BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry,
            Department__c,
            (SELECT Title, Name, Id, Designation__c, FirstName, LastName, Email, Phone, Campaign__c,
             Actual_Position__c, Head_Of_Project__c, Department, Profile_Pic_Attachment_Id__c
             FROM Contacts
             ORDER BY CreatedDate ASC)
            FROM Account
            WHERE Id IN :accountIds
            ORDER BY Is_Coordinator__c DESC NULLS LAST, CreatedDate ASC
        ];
        
        System.debug('accountContactList : ' + accountContactList);
        return accountContactList;
    }
    
    
    
    public static contact getSinglePatnerDetails(string applicantHashCode){
        system.debug('applicantHashCode---'+applicantHashCode);
        try{
            contact conRec = [select name,id,Proposals__c,Account.Name,account.Website, 
                              account.Id,account.Is_Coordinator__c,account.Is_Primary__c,account.Year_Of_Establishment__c,account.Last_Year_s_Balance__c,account.SME__c, account.Homepage_URL__c,account.Country_Type__c,account.Industry__c,
                              account.Email__c,account.Is_DSIR_Available__c,account.DSIR_Recoginition_Details__c,account.Company_Profile__c,account.Ownership_Profile__c,account.Company_Website__c,account.Academia__c,account.Phone,account.Main_Business_Area__c,account.Infrastructural_Facilities__c,
                              account.Domain_Expertise_Available__c,account.Large_Industry__c,account.Start_Up__c,account.BillingStreet,account.BillingCity,account.BillingState,account.BillingPostalCode,account.BillingCountry,account.Department__c
                              from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
            return conRec;
        }
        catch(Exception e){
            system.debug('error -->'+e.getMessage());
            return null;
        }
        // list<contact> applicantList = New list<contact>();
        // system.debug('conRec.Proposals__c---'+conRec.Proposals__c);
        // if(!string.isBlank(conRec.Proposals__c)){
        //     List<account> accountContactList = [select Name,Website,Id,Is_Coordinator__c,Is_Primary__c,Year_Of_Establishment__c,Last_Year_s_Balance__c,SME__c, Homepage_URL__c,Country_Type__c,Industry__c,
        //                                         Email__c,Is_DSIR_Available__c,DSIR_Recoginition_Details__c,Company_Profile__c,Ownership_Profile__c,Company_Website__c,Academia__c,Phone,Main_Business_Area__c,Infrastructural_Facilities__c,
        //                                         Domain_Expertise_Available__c,Large_Industry__c,Start_Up__c,BillingStreet,BillingCity,BillingState,BillingPostalCode,BillingCountry,Department__c,
        //                                         (select name,id,FirstName,LastName,Email,Phone,Actual_Position__c,Head_Of_Project__c,Department,Profile_Pic_Attachment_Id__c from contacts order By createdDate ASC) from account where Proposals__c =:conRec.Proposals__c order By createdDate ASC]; 
        //     system.debug('accountContactList---'+accountContactList);
        //     return accountContactList;
        // }        
    }
    
    /*
// UPDATED METHOD - FOR WORKSHOP
public static List<Account> getPatnerDetails3(String applicantHashCode, String proposalId){
System.debug('======================== getPatnerDetails3() ===========================');
System.debug('applicantHashCode : ' + applicantHashCode);

Contact conRec = [SELECT Name, Id, Proposals__c
FROM Contact 
WHERE Login_Hash_Code__c = :applicantHashCode LIMIT 1];
System.debug('conRec : ' + conRec);

String workshopRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Workshop').getRecordTypeId();
System.debug('workshopRecordTypeId : ' + workshopRecordTypeId);

if (conRec != null) {
if(! String.isBlank(conRec.Proposals__c)){
Applicant_Proposal_Association__c apaRecord = [
SELECT Id, Name, Proposals__c, Contact__c, Proposals__r.RecordTypeId 
FROM Applicant_Proposal_Association__c
WHERE Contact__c = :conRec.Id
AND Proposals__r.RecordTypeId = :workshopRecordTypeId
];
System.debug('apaRecord : ' + apaRecord);

List<Applicant_Proposal_Association__c> apaListForPropsals = [
SELECT Id, Name, Proposals__c, Contact__c, Proposals__r.RecordTypeId
FROM Applicant_Proposal_Association__c
WHERE Proposals__c = :apaRecord.Proposals__c
AND Proposals__r.RecordTypeId = :workshopRecordTypeId
];
System.debug('apaListForPropsals : ' + apaListForPropsals.size());
System.debug('apaListForPropsals : ' + apaListForPropsals);

Set<Id> contactIdSet = new Set<Id>();
for(Applicant_Proposal_Association__c apa : apaListForPropsals){
contactIdSet.add(apa.Contact__c);
}
System.debug('contactIdSet : ' + contactIdSet);

if(! contactIdSet.isEmpty()){

List<Contact> lstContacts = [
SELECT Salutation, Name, FirstName, Id, AccountId, LastName, Email, Phone, Department 
FROM Contact
WHERE Id IN :contactIdSet
ORDER BY CreatedDate ASC
];
System.debug('lstContacts : ' + lstContacts.size());

Set<Id> accountIdSet = new Set<Id>();
for(Contact con : lstContacts){
accountIdSet.add(con.AccountId);
}
System.debug('accountIdSet : ' + accountIdSet);

List<Account> accountContactList = [SELECT Name, Id, Homepage_URL__c, Country_Type__c, Academia__c, BillingStreet, BillingCity, BillingState, BillingPostalCode,
BillingCountry,Department__c,Industry__c,
(SELECT Salutation, Name, FirstName, Id, LastName, Email, Phone, Department 
FROM Contacts 
ORDER BY CreatedDate ASC)
FROM Account
WHERE Id IN : accountIdSet
]; 
System.debug('accountContactList : ' + accountContactList);

return accountContactList;
}
}
else{
List<Account> accountContactList = [
SELECT Name, Id, Homepage_URL__c, Country_Type__c, Academia__c,
BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry,
Department__c, Industry__c,
(SELECT Salutation, Name, FirstName, Id, LastName, Email, Phone, Department 
FROM Contacts ORDER BY CreatedDate ASC)
FROM Account
WHERE Id IN (SELECT AccountId FROM Contact WHERE Id = :conRec.Id)
ORDER BY CreatedDate ASC
];
system.debug('accountContactList---'+accountContactList);
return accountContactList;
}
}
return null;
}
*/
    
    /*
public static List<Account> getPatnerDetails3(String applicantHashCode, String proposalId){
System.debug('======================== getPatnerDetails3() ===========================');
System.debug('applicantHashCode : ' + applicantHashCode);
System.debug('proposalId : ' + proposalId);


Contact conRec = [SELECT Name, Id FROM Contact WHERE Login_Hash_Code__c = :applicantHashCode LIMIT 1];
System.debug('conRec : ' + conRec);

String workshopRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Workshop').getRecordTypeId();
System.debug('workshopRecordTypeId : ' + workshopRecordTypeId);

List<Applicant_Proposal_Association__c> apaRecord;
if(conRec != null){

if(proposalId != null){
apaRecord = [
SELECT Id, Name, Proposals__c, Contact__c, Proposals__r.RecordTypeId, Proposals__r.RecordType.Name
FROM Applicant_Proposal_Association__c
WHERE Contact__c = :conRec.Id
AND Proposals__c = :proposalId
AND Proposals__r.RecordType.Id =: workshopRecordTypeId
// AND Proposals__r.RecordType.Name =: 'Workshop'
LIMIT 1
];
System.debug('IF apaRecord : ' + apaRecord);
}else{
apaRecord = [
SELECT Id, Name, Proposals__c, Contact__c, Proposals__r.RecordTypeId, Proposals__r.RecordType.Name
FROM Applicant_Proposal_Association__c
WHERE Contact__c = :conRec.Id
AND Proposals__r.RecordType.Id =: workshopRecordTypeId
// AND Proposals__r.RecordType.Name =: 'Workshop'
LIMIT 1
];
System.debug('ELSE apaRecord : ' + apaRecord);
}

//FALLBACK CASE: NO PROPOSAL EXISTS FOR THIS CONTACT YET

if (apaRecord.isEmpty()) {

System.debug('It should come to this block');

List<Account> accountContactList = [
SELECT Name, Id, Homepage_URL__c, Country_Type__c, Academia__c,
BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry,
Department__c, Industry__c,
(SELECT Salutation, Name, FirstName, Id, LastName, Email, Phone, Department 
FROM Contacts ORDER BY CreatedDate ASC)
FROM Account
WHERE Id IN (SELECT AccountId FROM Contact WHERE Id = :conRec.Id)
ORDER BY CreatedDate ASC
];
system.debug('accountContactList---' + accountContactList);
return accountContactList;
}


// MAIN LOGIC — CONTACT ALREADY HAS WORKSHOP PROPOSAL

List<Applicant_Proposal_Association__c> apaListForPropsals = [
SELECT Id, Name, Proposals__c, Contact__c, Proposals__r.RecordTypeId
FROM Applicant_Proposal_Association__c
WHERE Proposals__c = :proposalId
AND Proposals__r.RecordTypeId = :workshopRecordTypeId
];
System.debug('apaListForPropsals : ' + apaListForPropsals.size());
System.debug('apaListForPropsals : ' + apaListForPropsals);



Set<Id> contactIdSet = new Set<Id>();
for(Applicant_Proposal_Association__c apa : apaListForPropsals){
contactIdSet.add(apa.Contact__c);
}
System.debug('contactIdSet : ' + contactIdSet);

if(!contactIdSet.isEmpty()){

List<Contact> lstContacts = [
SELECT Salutation, Name, FirstName, Id, AccountId, LastName, Email, Phone, Department 
FROM Contact
WHERE Id IN :contactIdSet
ORDER BY CreatedDate ASC
];
System.debug('lstContacts : ' + lstContacts.size());

Set<Id> accountIdSet = new Set<Id>();
for(Contact con : lstContacts){
accountIdSet.add(con.AccountId);
}
System.debug('accountIdSet : ' + accountIdSet);

List<Account> accountContactList = [
SELECT Name, Id, Homepage_URL__c, Country_Type__c, Academia__c, BillingStreet, BillingCity, BillingState, BillingPostalCode,
BillingCountry, Department__c, Industry__c,
(SELECT Salutation, Name, FirstName, Id, LastName, Email, Phone, Department 
FROM Contacts 
ORDER BY CreatedDate ASC)
FROM Account
WHERE Id IN :accountIdSet
]; 
System.debug('accountContactList : ' + accountContactList);

return accountContactList;
} else {
return null;
}
}

return null;
}
*/
    
    public static List<Account> getPatnerDetails3(String applicantHashCode, String proposalId){
        System.debug('======================== getPatnerDetails3() ===========================');
        System.debug('applicantHashCode : ' + applicantHashCode);
        System.debug('proposalId : ' + proposalId);
        
        Contact conRec = [SELECT Name, Id FROM Contact WHERE Login_Hash_Code__c = :applicantHashCode LIMIT 1];
        System.debug('conRec : ' + conRec);
        
        String workshopRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Workshop').getRecordTypeId();
        System.debug('workshopRecordTypeId : ' + workshopRecordTypeId);
        
        if(String.isBlank(proposalId)){
            List<Account> accountContactList = [
                SELECT Name, Id, Homepage_URL__c, Country_Type__c, Academia__c,
                BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry,
                Department__c, Industry__c,
                (SELECT Salutation, Name, FirstName, Id, LastName, Email, Phone, Department 
                 FROM Contacts ORDER BY CreatedDate ASC)
                FROM Account
                WHERE Id IN (SELECT AccountId FROM Contact WHERE Id = :conRec.Id)
                ORDER BY CreatedDate ASC
            ];
            system.debug('accountContactList---' + accountContactList);
            return accountContactList;
        }
        else{
            // MAIN LOGIC — CONTACT ALREADY HAS WORKSHOP PROPOSAL
            
            List<Applicant_Proposal_Association__c> apaListForPropsals = [
                SELECT Id, Name, Proposals__c, Contact__c, Proposals__r.RecordTypeId
                FROM Applicant_Proposal_Association__c
                WHERE Proposals__c = :proposalId
                AND Proposals__r.RecordTypeId = :workshopRecordTypeId
            ];
            System.debug('apaListForPropsals : ' + apaListForPropsals.size());
            System.debug('apaListForPropsals : ' + apaListForPropsals);
            
            Set<Id> contactIdSet = new Set<Id>();
            for(Applicant_Proposal_Association__c apa : apaListForPropsals){
                contactIdSet.add(apa.Contact__c);
            }
            System.debug('contactIdSet : ' + contactIdSet);
            
            if(!contactIdSet.isEmpty()){
                
                List<Contact> lstContacts = [
                    SELECT Salutation, Name, FirstName, Id, AccountId, LastName, Email, Phone, Department 
                    FROM Contact
                    WHERE Id IN :contactIdSet
                    ORDER BY CreatedDate ASC
                ];
                System.debug('lstContacts : ' + lstContacts.size());
                
                Set<Id> accountIdSet = new Set<Id>();
                for(Contact con : lstContacts){
                    accountIdSet.add(con.AccountId);
                }
                System.debug('accountIdSet : ' + accountIdSet);
                
                List<Account> accountContactList = [
                    SELECT Name, Id, Homepage_URL__c, Country_Type__c, Academia__c, BillingStreet, BillingCity, BillingState, BillingPostalCode,
                    BillingCountry, Department__c, Industry__c,
                    (SELECT Salutation, Name, FirstName, Id, LastName, Email, Phone, Department 
                     FROM Contacts 
                     ORDER BY CreatedDate ASC)
                    FROM Account
                    WHERE Id IN :accountIdSet
                ]; 
                System.debug('accountContactList : ' + accountContactList);
                
                return accountContactList;
            } else {
                return null;
            }
        }
    }
    
    public static  list<account> getPatnerDetails2(string applicantHashCode){
        system.debug('applicantHashCode---'+applicantHashCode);
        contact conRec = [select name,id,Proposals__c from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
        list<contact> applicantList = New list<contact>();
        system.debug('conRec.Proposals__c---'+conRec.Proposals__c);
        
        if(!string.isBlank(conRec.Proposals__c)){
            List<account> accountContactList = [select Name,Id, Homepage_URL__c,Country_Type__c,Academia__c,BillingStreet,BillingCity,BillingState,BillingPostalCode,BillingCountry,Department__c,Industry__c,
                                                (select Salutation,Name,FirstName,Id,LastName,Email,Phone,Department from Contacts order By createdDate ASC) from account where Proposals__c =:conRec.Proposals__c order By createdDate ASC]; 
            system.debug('accountContactList---'+accountContactList);
            return accountContactList;
        }
        
        if (conRec != null) {
            if(!string.isBlank(conRec.Proposals__c)){
                List<account> accountContactList = [select Name,Id, Homepage_URL__c,Country_Type__c,Academia__c,BillingStreet,BillingCity,BillingState,BillingPostalCode,BillingCountry,Department__c,Industry__c,
                                                    (select Salutation,Name,FirstName,Id,LastName,Email,Phone,Department from Contacts order By createdDate ASC) from account where Proposals__c =:conRec.Proposals__c order By createdDate ASC]; 
                system.debug('accountContactList---'+accountContactList);
                return accountContactList;
            }
            else{
                List<Account> accountContactList = [
                    SELECT Name, Id, Homepage_URL__c, Country_Type__c, Academia__c,
                    BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry,
                    Department__c, Industry__c,
                    (SELECT Salutation, Name, FirstName, Id, LastName, Email, Phone, Department 
                     FROM Contacts ORDER BY CreatedDate ASC)
                    FROM Account
                    WHERE Id IN (SELECT AccountId FROM Contact WHERE Id = :conRec.Id)
                    ORDER BY CreatedDate ASC
                ];
                system.debug('accountContactList---'+accountContactList);
                return accountContactList;
            }
        }
        return null;
    }
    
    // ORIGINAL EXISTING METHOD
    /*
public static  list<account> getPatnerDetails2(string applicantHashCode){
system.debug('applicantHashCode---'+applicantHashCode);
contact conRec = [select name,id,Proposals__c from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
list<contact> applicantList = New list<contact>();
system.debug('conRec.Proposals__c---'+conRec.Proposals__c);
if(!string.isBlank(conRec.Proposals__c)){
List<account> accountContactList = [select Name,Id, Homepage_URL__c,Country_Type__c,Academia__c,BillingStreet,BillingCity,BillingState,BillingPostalCode,BillingCountry,Department__c,Industry__c,
(select Salutation,Name,FirstName,Id,LastName,Email,Phone,Department from contacts order By createdDate ASC) from account where Proposals__c =:conRec.Proposals__c order By createdDate ASC];
system.debug('accountContactList---'+accountContactList);
return accountContactList;
}
return null;
}
*/
    
    //     public static List<Account> getPatnerDetails2(String applicantHashCode) {
    //     // Step 1: Find the Contact by hash code
    //     Contact applicantContact = [SELECT Id FROM Contact WHERE Login_Hash_Code__c = :applicantHashCode LIMIT 1];
    
    //     // Step 2: Query Applicant_Proposal_Association__c records for this Contact
    //     List<Applicant_Proposal_Association__c> appPropAssocList = [
    //         SELECT Id,Proposals__c
    //         FROM Applicant_Proposal_Association__c 
    //         WHERE Contact__c = :applicantContact.Id
    //     ];
    
    //     // Step 3: Collect Proposal IDs
    //     Set<Id> proposalIds = new Set<Id>();
    //     for (Applicant_Proposal_Association__c assoc : appPropAssocList) {
    //         proposalIds.add(assoc.Proposals__c);
    //     }
    
    //     // Step 4: Query Accounts that are linked to these Proposals (via a lookup or related list)
    //     // Assuming Account has a lookup field to Proposal (e.g., Proposals__c)
    //     List<Account> accountList = [
    //         SELECT Name, Id, Homepage_URL__c, Country_Type__c, Academia__c, 
    //                BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry, 
    //                Department__c, Industry__c,
    //                (SELECT Salutation, Name, FirstName, Id, LastName, Email, Phone, Department 
    //                 FROM Contacts ORDER BY CreatedDate ASC)
    //         FROM Account 
    //         WHERE Proposals__c IN :proposalIds 
    //         ORDER BY CreatedDate ASC
    //     ];
    
    //     return accountList;
    // }
    
    public static  void deleteContact(string contactId){
        delete new Contact(id=contactId);
    }
    
    public static  void deleteAccountDetails(string accId, list<string> contactIdList){
        
        List<contact> contactToDelete = NEw List<contact>();
        if(contactIdList.size() > 0){
            for(string cId:contactIdList){
                contactToDelete.add(New Contact(Id=cId));
            }
            delete contactToDelete;
        }
        Account accTODelete = new Account(id=accId);
        delete accTODelete;
        
    }
    
    //*************************************** CONSORTIUM PARTNER INFORMATION *********************************************
    
    
    public static String insertPartnerInformation(Account contactDetails){
        try{
            upsert contactDetails;
            return 'SUCCESS';
        }catch(Exception e){
            return 'ERROR';
        }
    }
    
    //************************************* CURRICULUM VITAE *********************************************************
    
    
    public static String insertContactDetails(List<Contact> contactDetails, List<Education_Details__c> educationDetails, List<Employment_Details__c> employmentDetails, List<Publications_Patents__c> publicationDetails){
        try{
            Upsert contactDetails;
            for(Contact con : contactDetails){
                for(Education_Details__c edu : educationDetails){
                    edu.Contact__c = con.Id;
                }
                Upsert educationDetails;
                for(Employment_Details__c emp : employmentDetails){
                    emp.Contact__c = con.Id;
                }
                Upsert employmentDetails;
                for(Publications_Patents__c patent : publicationDetails){
                    patent.Contact__c = con.Id;
                }
                Upsert publicationDetails;
            }
            return 'SUCCESS'; 
        }catch(exception e){
            system.debug('error -->'+e.getMessage());
            return 'ERROR';
        }
    }
    
    
    /* public static Contact getContactDetails(string hashCode){
Contact conRec = [SELECT Id,Name,Title,FirstName,LastName,Proposals__r.Name,Proposals__r.yearly_Call__r.year__c,Proposals__r.yearly_Call__r.PIEF_Age_Limit__c,
Proposals__r.yearly_Call__r.PDIF_Age_Limit__c,Proposals__r.yearly_Call__r.PDIF_PhD_time__c,Proposals__r.yearly_Call__r.PIEF_PhD_time__c	,
Proposals__r.yearly_Call__r.Date_of_Birth_PIEF__c,Proposals__r.yearly_Call__r.PhD_Enrollment_Date_PIEF__c,Proposals__r.yearly_Call__r.Date_of_Birth_PDIF__c,
Proposals__r.yearly_Call__r.PhD_Enroll_ment_Date_PDIF__c,Proposals__r.yearly_Call__r.Date_of_Birth_PECFAR__c,
Actual_Position__c,Department,Country__c,Head_Of_Project__c,Homepage_URL__c,Email,Phone,Thesis_Submission_Date__c,Industrial_Fellowship_Type__c,Birthdate,PhD_Enroll_Date__c,Awarded_PhD__c,Country_Code__c,Uploaded__c,
PhD_Awarded_Date__c,Gender__c,Nationality__c,PassportNo__c,Passport_Expiry__c,Addess_same_as__c,MailingAddress,MailingStreet,MailingCity,MailingCountry,MailingState,MailingPostalCode,
OtherAddress,OtherStreet,OtherCountry,OtherCity,OtherState,OtherPostalCode,MobilePhone,OtherPhone,Profile_Pic_Attachment_Id__c,Proposals__r.Campaign__r.EndDate,(SELECT Id,Name,Institution_Name__c,Area_of_specialization__c,End_Year__c FROM Education_Details__r),
(SELECT Id,Name,Organization_Name__c,Position__c,End_Year__c FROM Employment_Details__r),(select name,id,description__c from Publications_Patents__r),(select name,id from Attachments Order By CreatedDate DESC limit 1)
From Contact WHERE Login_Hash_Code__c=: hashCode Limit 1];
return conRec; 
}*/public static Contact getContactDetails(String hashCode) {
    Contact conRec = [
        SELECT Id, Name, Title, FirstName, LastName,
        Actual_Position__c, Department, Country__c, Head_Of_Project__c,
        Homepage_URL__c, Email, Phone, Thesis_Submission_Date__c,
        Industrial_Fellowship_Type__c, Birthdate, PhD_Enroll_Date__c, Awarded_PhD__c,
        Country_Code__c, Uploaded__c, PhD_Awarded_Date__c, Gender__c, Nationality__c,
        PassportNo__c, Passport_Expiry__c, Addess_same_as__c,
        MailingAddress, MailingStreet, MailingCity, MailingCountry, MailingState, MailingPostalCode,
        OtherAddress, OtherStreet, OtherCountry, OtherCity, OtherState, OtherPostalCode,
        MobilePhone, OtherPhone, Profile_Pic_Attachment_Id__c,
        (SELECT Id, Name, Institution_Name__c, Area_of_specialization__c, End_Year__c FROM Education_Details__r),
        (SELECT Id, Name, Organization_Name__c, Position__c, End_Year__c FROM Employment_Details__r),
        (SELECT Name, Id, Description__c FROM Publications_Patents__r),
        (SELECT Name, Id FROM Attachments ORDER BY CreatedDate DESC LIMIT 1),
        // Query related Proposals via junction object Applicant_Proposal_Association__c
        (SELECT Id, Proposals__r.Id, Proposals__r.Name, Proposals__r.Yearly_Call__r.Year__c,
         Proposals__r.Yearly_Call__r.PIEF_Age_Limit__c, Proposals__r.Yearly_Call__r.PDIF_Age_Limit__c,
         Proposals__r.Yearly_Call__r.PDIF_PhD_time__c, Proposals__r.Yearly_Call__r.PIEF_PhD_time__c,
         Proposals__r.Yearly_Call__r.Date_of_Birth_PIEF__c, Proposals__r.Yearly_Call__r.PhD_Enrollment_Date_PIEF__c,
         Proposals__r.Yearly_Call__r.Date_of_Birth_PDIF__c, Proposals__r.Yearly_Call__r.PhD_Enroll_ment_Date_PDIF__c,
         Proposals__r.Yearly_Call__r.Date_of_Birth_PECFAR__c, Proposals__r.Campaign__r.EndDate
         FROM Applicant_Proposal_Associations__r Where Proposals__r.RecordType_Name__c='Industrial Fellowship')
        FROM Contact
        WHERE Login_Hash_Code__c = :hashCode
        LIMIT 1
    ];
    return conRec;
}
    
    
    //*******************************************  *********************************************
    public static Contact getCvDetails(string contactId){
        Contact conRec = [SELECT Id,Name,FirstName,LastName,Actual_Position__c,MailingCity,MailingState,MailingStreet,MailingCountry,Department,MailingPostalCode,AccountId,Designation__c,Title,
                          Head_Of_Project__c,Homepage_URL__c,Email,Phone,(SELECT Id,Name,Institution_Name__c,Area_of_specialization__c,Degree__c,End_Year__c FROM Education_Details__r),
                          (SELECT Id,Name,Organization_Name__c,Position__c,End_Year__c FROM Employment_Details__r),(select name,id,description__c from Publications_Patents__r)
                          From Contact WHERE Id=: contactId Limit 1];
        return conRec; 
    }
    
    //******************************************* COMPANY PROFILE *********************************************
    
    
    public static  Account getCompanyApplicantDetails(string applicantHashCode){
        contact conRec = [select name,id,AccountId from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
        system.debug('applicantHashCode' +applicantHashCode);
        if(conRec.AccountId != Null){
            Account acc = [SELECT id,Name,Year_Of_Establishment__c,Last_Year_s_Balance__c,Main_Business_Area__c,NumberOfEmployees,Infrastructural_Facilities__c,Domain_Expertise_Available__c,DSIR_Recoginition_Details__c,Large_Industry__c,SME__c,Start_Up__c FROM Account WHERE Id=: conRec.AccountId];
            return acc;
        }else{
            return Null;  
        }     
    }
    
    
    public static Account insertApplicant(Account applicantDetails){
        try{
            applicantDetails.NumberOfEmployees = integer.valueOf(applicantDetails.NumberOfEmployees);
            system.debug('applicantDetails.NumberOfEmployees ::'+applicantDetails.NumberOfEmployees);
            upsert applicantDetails;
            return applicantDetails;
        }catch (Exception e){
            system.debug('error ::'+e.getMessage());
            return null;   
        }
    }
    
    //****************************************** FINANCIAL OVERVIEW ***************************************************
    
    
    public static  list<Applicant_Proposal_Association__c> getProjectDetailsDetails(string proposalId){
        system.debug('proposalId--->>>>>'+proposalId);
        list<Applicant_Proposal_Association__c> applicantAstnList = New list<Applicant_Proposal_Association__c>();
        if(proposalId != null){
            applicantAstnList = [SELECT Id,Contact__c, Contact__r.Account_Type__c,Proposals__c,Contact__r.Account.Country_Type__c,Contact__r.Name,Contact__r.Account.BillingCountry,Contact__r.Account.Industry__c,Contact__r.Account.Academia__c,
                                 (SELECT Id,Asked_From_IGSTC__c,IGSTC_Contribution__c,Own_Contribution__c,Total__c,Country__c,Partner__c,Partner__r.AccountId FROM Financial_Contribution__r),
                                 Proposals__r.Total_Amount__c,Contact__r.Login_Hash_Code__c,Contact__r.Account.Name FROM Applicant_Proposal_Association__c WHERE Proposals__c =:proposalId];
            return applicantAstnList;
        }
        system.debug('applicantAstnList--'+applicantAstnList);
        return applicantAstnList;
    }
    
    
    public static String insertFinancialDetails(List<Financial_Contribution__c> financialDetails){
        try{
            upsert financialDetails;
            return 'SUCCESS';
        }catch(Exception e){
            return e.getLineNumber() + e.getMessage();
        }
    }
    
    //*************************************** PROJECT DETAIL ********************************************
    
    
    public static string insertProjectDetails(Application_Proposal__c proposalDetails){
        try{
            upsert proposalDetails;
            return 'Success';
        }catch(Exception e){
            return e.getMessage()+e.getLineNumber();
        }
    }
    
    // UPDATED METHOD - FOR WORKSHOP USING HASHCODE
    /*
public static Application_Proposal__c getProjectdetils(String hashcode){
System.debug('-------------- getProjectdetils() ------------------');

Contact conRec = [SELECT Name, Id, Proposals__c 
FROM Contact 
WHERE Login_Hash_Code__c =:hashcode
LIMIT 1
];
System.debug('conRec :: ' + conRec);

String workshopRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Workshop').getRecordTypeId();
System.debug('workshopRecordTypeId : ' + workshopRecordTypeId);

Applicant_Proposal_Association__c apa = [
SELECT Proposals__c, Contact__c, Proposals__r.RecordTypeId
FROM Applicant_Proposal_Association__c
WHERE Contact__c = :conRec.Id
AND Proposals__r.RecordTypeId = :workshopRecordTypeId
LIMIT 1
];
System.debug('apaList : ' + apa);
System.debug('apaList Proposal Id : ' + apa.Proposals__c);

Application_Proposal__c proposalRecord = new Application_Proposal__c();

if( apa != null){
proposalRecord = [SELECT Name,id,Research_Approach_Objectives__c,Current_State_Of_The_Art__c,Project_Description__c,Expected_Deliverables__c,Equipment__c,
Reasons_For_And_Benefits_Of_Cooperation__c,Criteria_For_Abandoning_The_Project__c,Innovative_Aspects__c,Research_Scholars__c,
Necessity_Of_Funding__c,Background_Concept_Purpose__c,Specific_Need_For_the_Bilateral_Event__c,Privacy_Policy_Accepted__c,
Basis_for_choosing_the_pairing_fellow__c,Tentative_plans_for_networking__c,Tentative_Start_Date__c,Tentative_End_Date__c,Availing_any_other_fellowship_currently__c,
Availing_Other_Fellowship_Detail__c,Paired_Applicant_associated_with_IGSTC__c,Applicant_associated_with_IGSTC_Detail__c
FROM Application_Proposal__c 
WHERE Id = :apa.Proposals__c
AND RecordType_Name__c = 'Workshop'];
}
System.debug('proposalRecord : ' + proposalRecord);

return proposalRecord;
}
*/
    
    public static Application_Proposal__c getProjectdetils(String proposalId){
        System.debug('-------------- getProjectdetils() ------------------');
        
        if(String.isBlank(proposalId))
            return new Application_Proposal__c();
        
        String workshopRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Workshop').getRecordTypeId();
        System.debug('workshopRecordTypeId : ' + workshopRecordTypeId);
        
        Application_Proposal__c proposalRecord = [
            SELECT Name,id,Research_Approach_Objectives__c,Current_State_Of_The_Art__c,Project_Description__c,Expected_Deliverables__c,Equipment__c, RecordTypeId,
            Reasons_For_And_Benefits_Of_Cooperation__c,Criteria_For_Abandoning_The_Project__c,Innovative_Aspects__c,Research_Scholars__c,
            Necessity_Of_Funding__c,Background_Concept_Purpose__c,Specific_Need_For_the_Bilateral_Event__c,Privacy_Policy_Accepted__c,
            Basis_for_choosing_the_pairing_fellow__c,Tentative_plans_for_networking__c,Tentative_Start_Date__c,Tentative_End_Date__c,Availing_any_other_fellowship_currently__c,
            Availing_Other_Fellowship_Detail__c,Paired_Applicant_associated_with_IGSTC__c,Applicant_associated_with_IGSTC_Detail__c
            FROM Application_Proposal__c 
            WHERE Id = :proposalId
            // AND RecordTypeId = :workshopRecordTypeId
        ];
        System.debug('proposalRecord : ' + proposalRecord);
        
        return proposalRecord;
    }
    
    
    
    /*
public static Application_Proposal__c getProjectdetils(string hashcode){
contact userDetail = [select name,id,Proposals__c from contact where Login_Hash_Code__c =:hashcode limit 1];
system.debug('userDetail ::'+userDetail.Proposals__c);
Application_Proposal__c appProposal;
if(userDetail.Proposals__c != null){
appProposal = [select name,id,Research_Approach_Objectives__c,Current_State_Of_The_Art__c,Project_Description__c,Expected_Deliverables__c,Equipment__c,
Reasons_For_And_Benefits_Of_Cooperation__c,Criteria_For_Abandoning_The_Project__c,Innovative_Aspects__c,Research_Scholars__c,
Necessity_Of_Funding__c,Background_Concept_Purpose__c,Specific_Need_For_the_Bilateral_Event__c,Privacy_Policy_Accepted__c,
Basis_for_choosing_the_pairing_fellow__c,Tentative_plans_for_networking__c,Tentative_Start_Date__c,Tentative_End_Date__c,Availing_any_other_fellowship_currently__c,
Availing_Other_Fellowship_Detail__c,Paired_Applicant_associated_with_IGSTC__c,Applicant_associated_with_IGSTC_Detail__c from Application_Proposal__c where id=:userDetail.Proposals__c Limit 1];
}
system.debug('appproposal ::'+appProposal);
return appProposal;
}
*/
    
    
    
    //////////////////////////////////////////// FOR Signature Pecfar ///////////////////////////////////////////
    
    public static String doCUploadAttachment(String attachmentBody, String attachmentName, string cvId, String udId) {
        system.debug('attachmentBody---'+attachmentName+'---attachmentId---'+cvId+'---cvId---'+udId);
        if(String.isBlank(attachmentBody) || String.isBlank(udId))
            return 'ERROR';
        if(String.isBlank(cvId)) {
            ContentVersion conVer = new ContentVersion();
            conVer.ContentLocation = 'S'; // to use S specify this document is in Salesforce, to use E for external files
            conVer.PathOnClient = 'attachmentName'; // The files name, extension is very important here which will help the file in preview.
            conVer.Title = 'Signature - '+attachmentName; // Display name of the files
            conVer.VersionData = EncodingUtil.base64Decode(attachmentBody); // converting your binary string to Blog
            conVer.isMajorVersion = false;
            insert conVer;    //Insert ContentVersion
            
            ContentDistribution cdl = new ContentDistribution();
            cdl.ContentVersionId = conVer.Id;
            cdl.Name = 'PublicShare';
            cdl.RelatedRecordId = udId;
            insert cdl;
            system.debug('ContentDistribution----'+cdl);
            // First get the Content Document Id from ContentVersion Object
            Id conDoc = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:conVer.Id].ContentDocumentId;
            //create ContentDocumentLink  record 
            ContentDocumentLink conDocLink = New ContentDocumentLink();
            conDocLink.LinkedEntityId = udId; // Specify RECORD ID here i.e Any Object ID (Standard Object/Custom Object)
            conDocLink.ContentDocumentId = conDoc;  //ContentDocumentId Id from ContentVersion
            conDocLink.shareType = 'V';
            insert conDocLink;
            return conVer.Id;
        }else {
            List<ContentVersion> cvList = [SELECT Id, VersionData FROM ContentVersion WHERE Id = :cvId];
            if(!cvList.isEmpty()) {
                ContentVersion cVersion = cvList[0];
                if(cVersion.VersionData != null) {
                    String newBody = EncodingUtil.base64Encode(cVersion.VersionData);
                    newBody += attachmentBody;
                    cVersion.VersionData = EncodingUtil.base64Decode(newBody); // converting your binary string to Blog
                    update cVersion;
                    return cVersion.Id;
                }   
            }
        }
        return 'ERROR';
    }
    
    public static string createUserDocument(string udId, string conId, string pId, string fileId){
        try{
            User_Document__c userDocRecord = New User_Document__c();
            system.debug('udId----'+udId);
            if(!String.isBlank(udId)){
                userDocRecord.Id = udId;
            }
            userDocRecord.contact__c = conId;
            userDocRecord.proposals__c = pId;
            userDocRecord.Status__c = 'Uploaded';
            userDocRecord.Name = 'Signature';
            upsert userDocRecord;
            
            return userDocRecord.Id;
        }catch(Exception e){
            return e.getMessage() + e.getLineNumber();        }
    }
    
    public static string createUserDocumentPecfarDoc(string udId, string conId, string pId, string fileId){
        try{
            User_Document__c userDocRecord = New User_Document__c();
            system.debug('udId----'+udId);
            if(!String.isBlank(udId)){
                userDocRecord.Id = udId;
            }
            userDocRecord.contact__c = conId;
            userDocRecord.proposals__c = pId;
            userDocRecord.Status__c = 'Uploaded';
            userDocRecord.Name = 'Documents';
            upsert userDocRecord;
            
            return userDocRecord.Id;
        }catch(Exception e){
            return e.getMessage() + e.getLineNumber();        }
    }
    
    //************************************** WORK PACKAGE **********************************************************
    
    public static  list<Account> getWorkPackageDetails(string applicantHashCode){
        system.debug('applicantHashCode---'+applicantHashCode);
        contact conRec = [select name,id,Proposals__c,AccountId,Account.Name from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
        list<Account> applicantList = New list<Account>();
        if(conRec.AccountId != null){
            applicantList = [select Id,Name,(SELECT Id,TRL_Level__c,Application__c,Title__c,Duration__c,Account__r.Proposals__c FROM Work_Package__r) from Account where Proposals__c=:conRec.Proposals__c];
            return applicantList;
        }
        system.debug('applicantList--'+applicantList);
        return applicantList;
    }
    
    // public static String insertWPContactDetails(List<Work_Package__c> workPackDetails){
    //     try{
    
    //         Map<Id,Application_Proposal__c> applicationMap = new Map<Id,Application_Proposal__c>();
    
    //         List<String> workPackageList = new List<String>();
    
    //         System.debug('WorkPackDetails------'+workPackDetails);
    //         for(Work_Package__c wp : workPackDetails){
    //             workPackageList.add(wp.Id);
    //             if(!applicationMap.containsKey(wp.Application__c)){
    //                 applicationMap.put(wp.Application__c,new Application_Proposal__c(Id = wp.Application__c,Stage__c = '1st Stage',Proposal_Stages__c = 'Submitted'));
    //             }
    //             //wp.Application__r.Proposal_Stages__c = 'Submitted';
    //         }
    //         system.debug('applicationList ::'+applicationMap);
    //         if(!workPackageList.isEmpty()){
    //             // List<Work_Package__c> packageList = [SELECT Id,Application__c From Work_Package__c Where Id IN :workPackageList];
    //             // system.debug('packageList ::'+packageList);
    //             // for(Work_Package__c work : packageList){
    //             //     applicationList.add(new Application_Proposal__c(Id = work.Application__c,Stage__c = '1st Stage',Proposal_Stages__c = 'Submitted'));
    //             // }
    //             // system.debug('applicationList ::'+applicationList);
    //             upsert workPackDetails;
    //             upsert applicationMap.values();
    //         }
    //         return 'SUCCESS';
    
    //     }catch(Exception e){
    //         System.debug('The Error is  :'+e.getMessage());
    //         return e.getMessage(); 
    //     }
    // }
    
    // public static  String insertWPContactDetailsAsDraft(List<Work_Package__c> workPackDetails){
    
    //     //system.debug('applicationList ::'+applicationList);
    //             system.debug('workPackDetails ::'+workPackDetails);
    //     try{
    //         List<String> workPackageList = new List<String>();
    //         List<Application_Proposal__c> applicationList = new List<Application_Proposal__c>();
    //         for(Work_Package__c wp : workPackDetails){
    //             workPackageList.add(wp.Id);
    //         }
    //         if(!workPackageList.isEmpty()){
    //             List<Work_Package__c> workList = [SELECT Id,Application__c From Work_Package__c Where Id IN :workPackageList];
    //             for(Work_Package__c wp : workList){
    //                 Application_Proposal__c proposal = New Application_Proposal__c();
    //                 proposal.Id = wp.Application__c;
    //                 proposal.Stage__c = '1st Stage';
    //                 proposal.Proposal_Stages__c = 'Draft';
    //                 applicationList.add(proposal);
    //             }
    
    //             upsert applicationList;
    //             upsert workPackDetails;
    //         }
    
    //         return 'SUCCESS';
    
    //     }catch(Exception e){
    //         System.debug('The Error is  :'+e.getMessage());
    //         return e.getMessage()/*'ERROR'*/; 
    //     }
    // }
    
    // public static  void deleteWorkPackage(string wpId){
    //     delete new Work_Package__c(id=wpId);
    // }
    
    //************************************** PI Deliverables **********************************************************
    
    public class PiWrapper{
        String title;
        String Account;
        String id;
        Integer day;
        Integer month;
        Integer year;
    }
    
    public static  list<Account> getProjectDetailsForPI(string applicantHashCode){
        system.debug('applicantHashCode---'+applicantHashCode);
        contact conRec = [select name,id,Proposals__c,AccountId,Account.Name from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
        list<Account> applicantList = New list<Account>();
        if(conRec.AccountId != null){
            applicantList = [select Id,Name,(SELECT Id,Title__c,Due_Date__c,Account__c FROM PI_Deliverables__r) from Account where Proposals__c=:conRec.Proposals__c];
            return applicantList;
        }
        // if(!string.isBlank(conRec.Proposals__c)){
        //     applicantList = [select name,id,FirstName,LastName,(SELECT Id,Title__c,Due_Date__c,Responsible_Partner__c FROM PI_Deliverables__r) from Contact  where Proposals__c=:conRec.Proposals__c];
        //     return applicantList;
        // }
        system.debug('applicantList--'+applicantList);
        return applicantList;
    }
    
    public static  String insertDeliverables(List<PiWrapper> deliverableList){
        try{
            system.debug('deliverableList------'+deliverableList);
            List<PI_Deliverables__c> PIList = New List<PI_Deliverables__c>();
            for(PiWrapper wrap : deliverableList){
                PI_Deliverables__c pi = New PI_Deliverables__c();
                pi.Title__c = wrap.Title;
                pi.Account__c = wrap.Account;
                if(wrap.id != null){
                    pi.Id = wrap.id;
                }
                if(wrap.year != 0){
                    pi.Due_Date__c = Date.newInstance(wrap.year, wrap.month, wrap.day);
                }
                PIList.add(pi);
                system.debug('ghoomar ghoomar'+pi);
            }
            system.debug('goome re');
            system.debug('PIList --------> '+PIList);
            upsert PIList;
            return 'SUCCESS';
            
        }catch(Exception e){
            System.debug('The Error is  :'+e.getMessage());
            return e.getMessage(); 
        }
    }
    
    //************************************** Network Meeting **********************************************************
    
    // public class NetworkMeetWrapper{
    //     String meetingAgenda;
    //     String meetingVenue;
    //     String Account;
    //     String id;
    //     Integer tentativeday;
    //     Integer tentativemonth;
    //     Integer tentativeyear;
    //     Integer actualday;
    //     Integer actualmonth;
    //     Integer actualyear;
    // }
    
    // public static list<Account> getProjectDetailsForNetMeet(string applicantHashCode){
    //     contact conRec = [select name,id,Proposals__c,AccountId,Account.Name from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
    //     list<Account> applicantList = New list<Account>();
    //     if(conRec.AccountId != null){
    //         applicantList = [select Id,Name,(SELECT Id,Meeting_Agenda__c,Meeting_Venue__c,Tentative_Date__c,Participants__c,Actual_Date__c,Account__c FROM Network_Meetings__r) from Account where Proposals__c=:conRec.Proposals__c];
    //         return applicantList;
    //     }
    //     // if(!string.isBlank(conRec.Proposals__c)){
    //     //     applicantList = [select name,id,(SELECT Id,Meeting_Agenda__c,Meeting_Venue__c,Tentative_Date__c,Participants__c,Actual_Date__c,Contact__c FROM Network_Meetings__r) from Contact  where Proposals__c=:conRec.Proposals__c];
    //     //     return applicantList;
    //     // }
    //     return applicantList;
    // }
    
    
    // public static String insertMeetingDetails(List<NetworkMeetWrapper> meetingList){
    //     try{
    
    //         system.debug('size ---> '+meetingList.size());
    //         List<Network_Meeting__c> netMeetList = New List<Network_Meeting__c>();
    //         for(NetworkMeetWrapper wrapp : meetingList){
    //             Network_Meeting__c netMeet = New Network_Meeting__c();
    //             netMeet.Meeting_Agenda__c = wrapp.meetingAgenda;
    //             netMeet.Meeting_Venue__c = wrapp.meetingVenue;
    //             netMeet.Account__c = wrapp.Account;
    //             if(wrapp.id != null){
    //                 netMeet.id = wrapp.id;
    //             }
    //             if(wrapp.tentativeyear != 0){
    //                 netMeet.Tentative_Date__c = Date.newInstance(wrapp.tentativeyear, wrapp.tentativemonth, wrapp.tentativeday);
    //             }
    //             if(wrapp.actualyear != 0){
    //                 netMeet.Actual_Date__c = Date.newInstance(wrapp.actualyear, wrapp.actualmonth, wrapp.actualday);
    //             }
    //             netMeetList.add(netMeet);
    //         }
    //         system.debug('netMeetList :: '+netMeetList);
    //         upsert netMeetList;
    //         return 'SUCCESS';
    
    //     }catch(Exception e){
    //        return e.getMessage(); 
    //     }
    // }
    
    // public static  void deleteMeeting(string netId){
    //     delete new Network_Meeting__c(id=netId);
    // }
    
    //************************************** Grant Application **********************************************************
    
    public class ExistingGrantsWrapper{
        String title;
        String fundingagency;
        String Account;
        String AccountName;
        Integer duration;
        String budget;
        String id;
        String Application;
        Integer startingday;
        Integer startingmonth;
        Integer startingyear;
    }
    
    // public static List<Account> getApplicantDetailsForGrant(string applicantHashCode){
    //     contact conRec = [select name,id,Proposals__c,AccountId,Account.Name from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
    //     list<Account> applicantList = New list<Account>();
    //     if(conRec.AccountId != null){
    //         applicantList = [select Id,Name,Proposals__c,
    //         (SELECT Id,Title__c,Funding_Agency__c,Budget__c,Starting_Date__c,Duration__c,Account__c,Application__c FROM Existing_Grants__r),(
    //             Select Id,Login_Hash_Code__c From Contacts) from Account where Proposals__c=:conRec.Proposals__c];
    //         return applicantList;
    //     }
    //     return applicantList;
    // }

    public static List<Account> getApplicantDetailsForGrant(String apaId, String proposalId){
        
        List<Applicant_Proposal_Association__c> apaList = [
            SELECT Id, Proposals__c, Contact__c, Contact__r.AccountId 
            FROM Applicant_Proposal_Association__c 
            WHERE Proposals__c = :proposalId
        ];
        System.debug('apaList :::::: ' + apaList);

        Set<Id> accIdSet = new Set<Id>();
        for(Applicant_Proposal_Association__c  apa : apaList){
            accIdSet.add(apa.Contact__r.AccountId);
        }
        System.debug('accIdSet :::: ' + accIdSet);

        List<Account> accList = new List<Account>();
        if(! accIdSet.isEmpty()){
            accList = [SELECT Id, Name, Proposals__c,
                (SELECT Id, Title__c, Funding_Agency__c, Budget__c, Starting_Date__c, Duration__c, Account__c, Application__c, Applicant_Proposal_Association__c FROM Existing_Grants__r),
                (SELECT Id, Login_Hash_Code__c FROM Contacts) 
                FROM Account WHERE Id IN : accIdSet];
            return accList;
        }
        System.debug('accList :::: ' + accList);
        return accList;
    }
    
    public static String insertExistingGrants(List<ExistingGrantsWrapper> grantList, String apaId){
        try{
            system.debug('size ---> '+grantList.size());
            List<Application_Proposal__c> applicationList = new List<Application_Proposal__c>();
            List<Existing_Grants__c> existingGrantList = New List<Existing_Grants__c>();
            Set<String> ids = New Set<String>();
            for(ExistingGrantsWrapper wrap : grantList){
                system.debug('wrap----'+wrap);
                Existing_Grants__c grantsRec = New Existing_Grants__c();
                grantsRec.Title__c = wrap.title;
                grantsRec.Funding_Agency__c = wrap.fundingagency;
                grantsRec.Account__c = wrap.Account;
                grantsRec.Application__c = wrap.Application;
                grantsRec.Budget__c = wrap.budget;
                grantsRec.Duration__c = wrap.duration;
                grantsRec.Applicant_Proposal_Association__c = apaId;

                if(wrap.id != null){
                    grantsRec.id = wrap.id;
                }
                if(wrap.startingyear != 0){
                    // grantsRec.Starting_Date__c = Date.newInstance(wrap.startingyear, wrap.startingmonth, wrap.startingday);
                    grantsRec.Starting_Date__c = wrap.startingday + '/' + wrap.startingmonth + '/' + wrap.startingyear;
                }
                existingGrantList.add(grantsRec);
                ids.add(grantsRec.Application__c);
            }
            system.debug('existingGrantList :: '+existingGrantList);
            // for(String grant : ids){
            //     Application_Proposal__c applicatProposal = New Application_Proposal__c();
            //     applicatProposal.Id = grant;
            //     applicatProposal.Stage__c = '2nd Stage';
            //     applicatProposal.Proposal_Stages__c = 'Submitted';
            //     applicationList.add(applicatProposal);
                
            // }
            system.debug('applicationList::'+applicationList);
            // upsert applicationList;
            upsert existingGrantList;
            return 'SUCCESS';
            
        }catch(Exception e){
            return e.getMessage(); 
        }
    }
    
    public static String insertExistingGrantsAsDraft(List<ExistingGrantsWrapper> grantList){
        try{
            system.debug('size ---> '+grantList.size());
            List<Application_Proposal__c> applicationList = new List<Application_Proposal__c>();
            List<Existing_Grants__c> existingGrantList = New List<Existing_Grants__c>();
            Set<String> ids = New Set<String>();
            for(ExistingGrantsWrapper wrap : grantList){
                system.debug('wrap----'+wrap);
                Existing_Grants__c grantsRec = New Existing_Grants__c();
                grantsRec.Title__c = wrap.title;
                grantsRec.Funding_Agency__c = wrap.fundingagency;
                grantsRec.Account__c = wrap.Account;
                grantsRec.Application__c = wrap.Application;
                grantsRec.Budget__c = wrap.budget;
                grantsRec.Duration__c = wrap.duration;
                if(wrap.id != null){
                    grantsRec.id = wrap.id;
                }
                if(wrap.startingyear != 0){
                    // grantsRec.Starting_Date__c = Date.newInstance(wrap.startingyear, wrap.startingmonth, wrap.startingday);
                }
                existingGrantList.add(grantsRec);
                ids.add(grantsRec.Application__c);
            }
            system.debug('existingGrantList :: '+existingGrantList);
            for(String grant : ids){
                Application_Proposal__c applicatProposal = New Application_Proposal__c();
                applicatProposal.Id = grant;
                applicatProposal.Stage__c = '2nd Stage';
                applicatProposal.Proposal_Stages__c = 'Draft';
                applicationList.add(applicatProposal);
                
            }
            system.debug('applicationList::'+applicationList);
            upsert applicationList;
            upsert existingGrantList;
            return 'SUCCESS';
            
        }catch(Exception e){
            return e.getMessage(); 
        }
    }
    
    public static string insertWiserDraft(string projectId, integer day, integer month, integer year){
        try{
            Application_Proposal__c applicantDetails = New Application_Proposal__c();
            if(day==0 && month==0 && year==0){
                
            }else{
                applicantDetails.Proposed_Date__c = Date.newInstance(year, month, day);    
            }
            applicantDetails.Id = projectId;
            applicantDetails.Proposal_Stages__c = 'Draft';
            upsert applicantDetails;
            return 'success';
            
        }catch(Exception e){
            return e.getMessage() + e.getLineNumber();
        }
    }
    
    public static string finalSubmitWiser(string projectId, string conId, integer day, integer month, integer year){
        try{
            Contact con = New Contact();
            Application_Proposal__c applicantDetails = New Application_Proposal__c();
            if(day==0 && month==0 && year==0){
                
            }else{
                Date newDate=Date.newInstance(year,month,day);
                con.Id = conId;
                con.Declaration_Sign_Date__c=newDate;
                applicantDetails.Proposed_Date__c = Date.newInstance(year, month, day);    
            }
            applicantDetails.Id = projectId;
            applicantDetails.Proposal_Stages__c = 'Submitted';
            applicantDetails.Submitted__c = true;
            upsert applicantDetails;
            upsert con;
            return 'success';
            
        }catch(Exception e){
            return e.getMessage() + e.getLineNumber();
        }
    }
    
    public static  void deleteGrants(string grantstId){
        delete new Existing_Grants__c(id=grantstId);
    }
    
    public static MyProposalWapper fetchProjectDetails(String projectId){
        try{
            Application_Proposal__c ProposalRecord = [SELECT Id,Name,Document_generated__c,Campaign__r.Name,Campaign__r.RedirectPage__c
                                                      FROM Application_Proposal__c WHERE Id =: projectId];
            
            List<contact> instanceContact=[select id,Name,FirstName,LastName,MailingCountry from contact where Proposals__c=:projectId];
            
            String str1;
            if(ProposalRecord.Campaign__r.Name=='2+2 Call'){
                str1='%.pdf';
            }else if(ProposalRecord.Campaign__r.Name=='PECFAR' && instanceContact.size()==2){
                if(instanceContact[0].MailingCountry!='India'){
                    str1='%' + instanceContact[0].FirstName +'.pdf';
                }else{
                    str1='%' + instanceContact[1].FirstName +'.pdf';
                }
            }else{
                str1='%' + instanceContact[0].LastName +'.pdf';
            }
            
            Application_Proposal__c ProposalRec= [SELECT Id,Name,Document_generated__c,(select id,name from attachments where Name like :str1 order by createdDate desc limit 1),Project_Description__c,Reasons_For_And_Benefits_Of_Cooperation__c,Research_Approach_Objectives__c,
                                                  Necessity_Of_Funding__c,Research_Scholars__c,Summary__c,Title_Of__c,Campaign__r.Name,Campaign__r.RedirectPage__c
                                                  FROM Application_Proposal__c WHERE Id =: projectId];
            
            MyProposalWapper myProposalInstance=new MyProposalWapper();
            myProposalInstance.contactWrap=instanceContact;
            myProposalInstance.proposalWrap= ProposalRec;
            
            return myProposalInstance;
        }catch(Exception e){
            return null;
        }
    }
    public class MyProposalWapper{
        public List<Contact> contactWrap;
        public Application_Proposal__c proposalWrap;
    }
    public class ConsortiaDetails{
        public Account company;
        public List<contact> partnerDetails;
    }
    
    //************************************** Privacy Policy Acceptance **********************************************************
    
    public static string insertPrivacyPolicy(Application_Proposal__c proposalDetails){
        try{
            proposalDetails.Stage__c = '1st Stage';
            proposalDetails.Proposal_Stages__c = 'Draft';
            upsert proposalDetails;
            return 'success';
        }catch(Exception e){
            return e.getMessage();
        }
    }
    
    public static string finalSubmit(Application_Proposal__c proposalDetails){
        try{
            proposalDetails.Stage__c = '1st Stage';
            proposalDetails.Proposal_Stages__c = 'Submitted';
            upsert proposalDetails;
            return 'success';
        }catch(Exception e){
            return e.getMessage();
        }
    }
    
    //************************************** Coordinators Page **********************************************************
    
    public static List<Contact> getCoordinatorsDetails(string hashCode){
        Contact conRec = [Select Id,Name,Proposals__c FROM Contact WHERE Login_Hash_Code__c=: hashCode];
        List<Contact> conList = New List<Contact>();
        if(!string.isBlank(conRec.Proposals__c)){
            conList = [SELECT Id,Name,FirstName,LastName,Department,Head_Of_Project__c,Homepage_URL__c,Email,Phone,
                       MailingAddress,MailingStreet,MailingCity,MailingCountry,MailingState,MailingPostalCode,Indian__c,German__c,Proposals__c,Account.Name From Contact WHERE Proposals__c=: conRec.Proposals__c];
            return conList;
        }
        system.debug('conList --> '+conList);
        return conList;
    }
    
    public static string createAnotherCoord(string projectId){
        try{
            Account acc = New Account();
            Contact con = New Contact();
            acc.Name = 'sdfh@@gyut!!gff%^%yutytyut';
            acc.Proposals__c = projectId;
            insert acc;
            con.LastName = 'sdfh@@gyut!!gff%^%yutytyut';
            con.Email = 'mzowndhe2088qsgrj00@mailiii.coom';
            con.AccountId = acc.Id;
            con.Proposals__c = projectId;
            insert con;
            return 'success';
            
        }catch(Exception e){
            return e.getMessage()+e.getLineNumber();
        }
    }
    
    public static List<Contact> getCoordDetails(string projectId){
        try{
            List<Contact> conRec = [select name,id,FirstName,LastName,Email,Phone,Actual_Position__c,Head_Of_Project__c,Department,Profile_Pic_Attachment_Id__c,
                                    Account.Name,Account.Website,AccountId,Account.Year_Of_Establishment__c,Account.Last_Year_s_Balance__c,Account.SME__c, Account.Homepage_URL__c,Account.Country_Type__c,Account.Industry__c,
                                    Account.Email__c,Account.Is_DSIR_Available__c,Account.DSIR_Recoginition_Details__c,Account.Company_Profile__c,Account.Ownership_Profile__c,Account.Company_Website__c,Account.Academia__c,
                                    Account.Phone,Account.Main_Business_Area__c,Account.NumberOfEmployees,Account.Infrastructural_Facilities__c,Account.Domain_Expertise_Available__c,Account.Large_Industry__c,
                                    Account.Start_Up__c,Account.BillingStreet,Account.BillingCity,Account.BillingState,Account.BillingPostalCode,Account.BillingCountry,Account.Department__c from contact where Proposals__c =:projectId]; 
            
            return conRec;
        }catch(Exception e){
            return null;
        }
    }
    
    
    public static String insertCoordinatorsInformation(String proposalId, List<Account> accList,List<Contact> conList){
        try{
            system.debug( 'proposalId ===> ' + proposalId + ' conList::'+conList);
            List<Id> conIds = new List<Id>();
            for(Account acc : accList){
                system.debug('acc::'+acc.BillingState);
                //acc.BillingState = acc.Shipping_State__c;
            }
            Map<String,String> accMap = New Map<String,String>();
            for(Account accRecord : accList){
                if(accRecord.Is_Coordinator__c){
                    accRecord.BillingState = accRecord.State__c;
                }
                accMap.put(accRecord.Name,''); 
            }
            upsert accList;
            for(Account acc : accList){
                accMap.containsKey(acc.Name);
                accMap.put(acc.Name, acc.Id);
            }
            for(Contact conRecord : conList){
                conIds.add(conRecord.Id);
                system.debug('conRecord.Lastname  ::'+conRecord.Lastname);                                
                if(conRecord.LastName == null || conRecord.LastName == ''){
                    conRecord.LastName = conRecord.FirstName;
                }
                if(accMap.containsKey(conRecord.AccountId)){
                    conRecord.AccountId = accMap.get(conRecord.AccountId);
                }
            }
            system.debug('conList::'+conList);
            upsert accList;
            upsert conList;
            Map<Id, Id> existingAssocMap = new Map<Id, Id>();
            for (Applicant_Proposal_Association__c assoc : [ SELECT Id, Contact__c, Proposals__c FROM Applicant_Proposal_Association__c WHERE Proposals__c = :proposalId AND Contact__c IN :conIds ]) {
                existingAssocMap.put(assoc.Contact__c, assoc.Id);
            }
            List<Applicant_Proposal_Association__c> newAssocList = new List<Applicant_Proposal_Association__c>();
            for (Contact con : conList) {
                if (!existingAssocMap.containsKey(con.Id)) {
                    newAssocList.add(new Applicant_Proposal_Association__c(
                        Contact__c = con.Id,
                        Proposals__c = proposalId
                    ));
                }
            }
            if (!newAssocList.isEmpty()) {
                insert newAssocList;
            }
            return 'SUCCESS';
        }catch(Exception e){
            return e.getMessage() + e.getLineNumber();
        }
    }

    public static insertApplicationWrapper insertCoordinatorsInformation2(
        List<Account> accList,
        List<Contact> conList,
        String proposalId,
        String yearlyCallId
    ){
        insertApplicationWrapper datawrapper = new insertApplicationWrapper();
        
        try {
            System.debug('------------------ insertCoordinatorsInformation2 --------------------');
            System.debug('accList : ' + accList);

            List<Id> conIds = new List<Id>();
            Applicant_Proposal_Association__c primaryAPA;
            Application_Proposal__c proposalRec;
 
            // ---------------- ACCOUNT UPSERT ----------------
            Map<String,String> accMap = new Map<String,String>();
 
            for(Account accRecord : accList){

                if(accRecord.Is_Coordinator__c){
                    accRecord.BillingState = accRecord.BillingState;
                }
                accMap.put(accRecord.Name, '');
            }
            upsert accList;
 
            for(Account acc : accList){
                accMap.put(acc.Name, acc.Id);
            }
 
            // ---------------- CONTACT UPSERT ----------------
            for(Contact conRecord : conList){
                conRecord.Proposals__c = null;
                conIds.add(conRecord.Id);
 
                if(String.isBlank(conRecord.LastName)){
                    conRecord.LastName = conRecord.FirstName;
                }
                if(accMap.containsKey(conRecord.AccountId)){
                    conRecord.AccountId = accMap.get(conRecord.AccountId);
                }
            }
            upsert conList;
 
            // =================================================
            // CASE 1: PROPOSAL EXISTS
            // =================================================
            if(!String.isBlank(proposalId)){
 
                proposalRec = [
                    SELECT Id
                    FROM Application_Proposal__c
                    WHERE Id = :proposalId
                    LIMIT 1
                ];
 
                // Find Primary APA
                for(Applicant_Proposal_Association__c apa : [
                    SELECT Id, Contact__c, Contact__r.Is_Primary__c
                    FROM Applicant_Proposal_Association__c
                    WHERE Proposals__c = :proposalId
                    AND Contact__c IN :conIds
                ]){
                    if(apa.Contact__r.Is_Primary__c == true){
                        primaryAPA = apa;
                        break;
                    }
                }
            }
            // =================================================
            // CASE 2: PROPOSAL DOES NOT EXIST
            // =================================================
            else{
 
                String workshopRecordTypeId = Schema.SObjectType.Application_Proposal__c
                    .getRecordTypeInfosByName()
                    .get('Workshop')
                    .getRecordTypeId();
 
                Campaign camp = [
                    SELECT Id
                    FROM Campaign
                    WHERE Name = 'Workshop'
                    LIMIT 1
                ];
 
                proposalRec = new Application_Proposal__c(
                    Title_Of__c = 'Workshop',
                    RecordTypeId = workshopRecordTypeId,
                    Campaign__c = camp.Id,
                    yearly_Call__c = yearlyCallId
                );
                insert proposalRec;
 
                List<Applicant_Proposal_Association__c> apaList = new List<Applicant_Proposal_Association__c>();
                for(Contact c : conList){
                    apaList.add(new Applicant_Proposal_Association__c(
                        Contact__c = c.Id,
                        Proposals__c = proposalRec.Id
                    ));
                }
                insert apaList;
 
                // Find Primary APA
                for(Applicant_Proposal_Association__c apa : [
                    SELECT Id, Contact__r.Is_Primary__c
                    FROM Applicant_Proposal_Association__c
                    WHERE Proposals__c = :proposalRec.Id
                ]){
                    if(apa.Contact__r.Is_Primary__c == true){
                        primaryAPA = apa;
                        break;
                    }
                }
            }
 
            // ---------------- WRAPPER RESPONSE ----------------
            datawrapper.proposalId = proposalRec.Id;
            datawrapper.proposal   = proposalRec;
            datawrapper.apa        = primaryAPA;
 
            return datawrapper;
 
        } catch(Exception e){
            throw new AuraHandledException(
                e.getMessage() + ' @ line ' + e.getLineNumber()
            );
        }
    }

    /*
    // USING EXISTING METHOD FOR WORKSHOP - PASSING WRAPPER DATA
    public static insertApplicationWrapper2 insertCoordinatorsInformation2(
        List<Account> accList,
        List<Contact> conList,
        String proposalId,
        String yearlyCallId
    ){
        insertApplicationWrapper2 datawrapper = new insertApplicationWrapper2();

        try {
            List<Id> conIds = new List<Id>();
            Applicant_Proposal_Association__c primaryAPA;
            Application_Proposal__c proposalRec;
            List<Applicant_Proposal_Association__c> apaList;

            // ---------------- ACCOUNT UPSERT ----------------
            Map<String,String> accMap = new Map<String,String>();

            for(Account accRecord : accList){
                if(accRecord.Is_Coordinator__c){
                    accRecord.BillingState = accRecord.State__c;
                }
                accMap.put(accRecord.Name, '');
            }
            upsert accList;

            for(Account acc : accList){
                accMap.put(acc.Name, acc.Id);
            }

            // ---------------- CONTACT UPSERT ----------------
            for(Contact conRecord : conList){
                conRecord.Proposals__c = null;
                conIds.add(conRecord.Id);

                if(String.isBlank(conRecord.LastName)){
                    conRecord.LastName = conRecord.FirstName;
                }
                if(accMap.containsKey(conRecord.AccountId)){
                    conRecord.AccountId = accMap.get(conRecord.AccountId);
                }
            }
            upsert conList;

            // =================================================
            // CASE 1: PROPOSAL EXISTS
            // =================================================
            if(!String.isBlank(proposalId)){

                proposalRec = [
                    SELECT Id
                    FROM Application_Proposal__c
                    WHERE Id = :proposalId
                    LIMIT 1
                ];

                apaList = [
                    SELECT Id, Contact__c, Contact__r.Is_Primary__c
                    FROM Applicant_Proposal_Association__c
                    WHERE Proposals__c = :proposalId
                    AND Contact__c IN :conIds
                ];

                for (Applicant_Proposal_Association__c apa : apaList) {
                    apaIds.add(apa.Id);
                }
            }
            // =================================================
            // CASE 2: PROPOSAL DOES NOT EXIST
            // =================================================
            else{

                String workshopRecordTypeId = Schema.SObjectType.Application_Proposal__c
                    .getRecordTypeInfosByName()
                    .get('Workshop')
                    .getRecordTypeId();

                Campaign camp = [
                    SELECT Id
                    FROM Campaign
                    WHERE Name = 'Workshop'
                    LIMIT 1
                ];

                proposalRec = new Application_Proposal__c(
                    Title_Of__c = 'Workshop',
                    RecordTypeId = workshopRecordTypeId,
                    Campaign__c = camp.Id,
                    yearly_Call__c = yearlyCallId
                );
                insert proposalRec;

                
                for(Contact c : conList){
                    apaList.add(new Applicant_Proposal_Association__c(
                        Contact__c = c.Id,
                        Proposals__c = proposalRec.Id
                    ));
                }
                insert apaList;

                for (Applicant_Proposal_Association__c apa : apaList) {
                    apaIds.add(apa.Id);
                }
            }

            // ---------------- WRAPPER RESPONSE ----------------
            datawrapper.proposalId = proposalRec.Id;
            datawrapper.proposal   = proposalRec;
            datawrapper.apaIdList  = apaIds;

            return datawrapper;

        } catch(Exception e){
            throw new AuraHandledException(
                e.getMessage() + ' @ line ' + e.getLineNumber()
            );
        }
    }
    */

    
    /*
    // USING EXISTING METHOD FOR WORKSHOP
    public static String insertCoordinatorsInformation2(
        List<Account> accList,
        List<Contact> conList,
        String proposalId,
        String yearlyCallId)
    {
        try{
            system.debug( 'proposalId ===> ' + proposalId + ' conList::'+conList);
            List<Id> conIds = new List<Id>();
            for(Account acc : accList){
                system.debug('acc::'+acc.BillingState);
                //acc.BillingState = acc.Shipping_State__c;
            }
            Map<String,String> accMap = New Map<String,String>();
            for(Account accRecord : accList){
                if(accRecord.Is_Coordinator__c){
                    accRecord.BillingState = accRecord.State__c;
                }
                accMap.put(accRecord.Name,'');
            }
            upsert accList;
            
            for(Account acc : accList){
                accMap.containsKey(acc.Name);
                accMap.put(acc.Name, acc.Id);
            }
            
            for(Contact conRecord : conList){
                conRecord.Proposals__c = null;
                
                conIds.add(conRecord.Id);
                system.debug('conRecord.Lastname  ::'+conRecord.Lastname);                                
                if(conRecord.LastName == null || conRecord.LastName == ''){
                    conRecord.LastName = conRecord.FirstName;
                }
                if(accMap.containsKey(conRecord.AccountId)){
                    conRecord.AccountId = accMap.get(conRecord.AccountId);
                }
            }
            system.debug('conList::'+conList);
            upsert accList;
            upsert conList;
            
            Map<Id, Id> existingAssocMap = new Map<Id, Id>();
            if(! String.isBlank(proposalId)){
                for (Applicant_Proposal_Association__c assoc : [ SELECT Id, Contact__c, Proposals__c FROM Applicant_Proposal_Association__c WHERE Proposals__c = :proposalId AND Contact__c IN :conIds ]) {
                    existingAssocMap.put(assoc.Contact__c, assoc.Id);
                }
                List<Applicant_Proposal_Association__c> newAssocList = new List<Applicant_Proposal_Association__c>();
                
                for (Contact con : conList) {
                    con.Proposals__c = null;
                    
                    if (!existingAssocMap.containsKey(con.Id)) {
                        newAssocList.add(new Applicant_Proposal_Association__c(
                            Contact__c = con.Id,
                            Proposals__c = proposalId
                        ));
                    }
                    con.Proposals__c = null;
                }
                if (!newAssocList.isEmpty()) {
                    insert newAssocList;
                }
            }
            else{
                System.debug('No ProposalId Provided → Creating New Proposal');
                
                String workshopRecordTypeId = Schema.SObjectType.Application_Proposal__c
                    .getRecordTypeInfosByName()
                    .get('Workshop')
                    .getRecordTypeId();
                
                Campaign camp = [SELECT Id, Name FROM Campaign WHERE Name = 'Workshop'];
                
                Application_Proposal__c newProposal = new Application_Proposal__c(
                    Title_Of__c = 'Workshop',
                    RecordTypeId = workshopRecordTypeId,
                    Campaign__c = camp.Id,
                    yearly_Call__c = yearlyCallId
                );
                insert newProposal;
                
                
                System.debug('Created New Proposal : '+newProposal.Id);
                
                // Create APA for ALL Contacts
                List<Applicant_Proposal_Association__c> apaList = new List<Applicant_Proposal_Association__c>();
                for (Contact c : conList) {
                    apaList.add(new Applicant_Proposal_Association__c(
                        Contact__c = c.Id,
                        Proposals__c = newProposal.Id
                    ));
                    c.Proposals__c = null;
                }
                
                insert apaList;
                System.debug('APA Inserted Successfully : ' + apaList.size());
                return newProposal.Id;
            }
            
            // return 'SUCCESS';
            return proposalId;
        }catch(Exception e){
            return e.getMessage() + e.getLineNumber();
        }
    }
    */

    // OLD METHOD WITH NO PROPOSAL ID
    /*
public static String insertCoordinatorsInformation2(List<Account> accList,List<Contact> conList){
try{

system.debug('conList in the beginning::'+conList);

for(Account acc : accList){
system.debug('acc::'+acc.BillingState);
acc.BillingState = acc.Shipping_State__c;
}

Map<String,String> accMap = New Map<String,String>();
for(Account accRecord : accList){
accMap.put(accRecord.Name,''); 
}
upsert accList;

for(Account acc : accList){
accMap.containsKey(acc.Name);
accMap.put(acc.Name, acc.Id);
}

for(Contact conRecord : conList){
System.debug('Con Record Own Ids===>'+conRecord.Id);
system.debug('conRecord.Lastname  ::'+conRecord.Lastname);
if(conRecord.LastName == null || conRecord.LastName == ''){
conRecord.LastName = conRecord.FirstName;
//conRecord.Proposals__c = ap.Id; 
}
if(accMap.containsKey(conRecord.AccountId)){
conRecord.AccountId = accMap.get(conRecord.AccountId);
}
}
system.debug('conList: at the end:'+conList);
upsert accList;
upsert conList;

System.debug('Upserted conList====>'+conList);
System.debug('Upserted ConList Idsss====>'+conList[0].Id);



// Get WORKSHOP RecordTypeId 
String workshopRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Workshop').getRecordTypeId();
System.debug('workshopRecordTypeId : ' + workshopRecordTypeId);

// Create Proposal ONLY for NEW Contacts
Application_Proposal__c proposal;

if (!conList.isEmpty()) {
proposal = new Application_Proposal__c(
Title_Of__c = 'Workshop',
RecordTypeId = workshopRecordTypeId
);
insert proposal;
System.debug('Proposal Inserted Successfully : ' + proposal.Id);

List<Applicant_Proposal_Association__c> apaList = new List<Applicant_Proposal_Association__c>();

for (Contact c : conList) {
apaList.add(new Applicant_Proposal_Association__c(
Contact__c = c.Id,
Proposals__c = proposal.Id
));
}

insert apaList;
System.debug('APA Inserted Successfully : ' + apaList.size());

}

// return 'SUCCESS';
return proposal.Id;
}catch(Exception e){
return e.getMessage() + e.getLineNumber();
}
}
*/
    
    // ================================== WORKSHOP METHOD ===================================== //
    
    // NEW METHOD WITH PROPOSAL ID
    /*
public static String insertCoordinatorsInformation2(
List<Account> accList,
List<Contact> conList,
String proposalId
){
try{
System.debug('Incoming proposalId : ' + proposalId);
System.debug('Incoming conList at start : '+conList);

// ----------------------------- //
// 1. UPDATE ACCOUNTS
// ----------------------------- //
for(Account acc : accList){
System.debug('acc::'+acc.BillingState);
acc.BillingState = acc.Shipping_State__c;
}
upsert accList;

// Populate the ID into accMap
Map<String,String> accMap = new Map<String,String>();

for(Account acc : accList){
accMap.put(acc.Name, acc.Id);
}

// ----------------------------- //
// 2. UPDATE CONTACTS
// ----------------------------- //
List<Id> conIds = new List<Id>();

for(Contact conRecord : conList){

conIds.add(conRecord.Id);
System.debug('Contact Id : ' + conRecord.Id);

if(String.isBlank(conRecord.LastName)){
conRecord.LastName = conRecord.FirstName;
}

if(accMap.containsKey(conRecord.AccountId)){
conRecord.AccountId = accMap.get(conRecord.AccountId);
}
conRecord.Proposals__c = null;
}

//upsert accList;
upsert conList;

System.debug('Updated conList====>'+conList);

// ------------------------------------------- //
// 3. CASE A: PROPOSAL ALREADY EXISTS
// ------------------------------------------- //
if(!String.isBlank(proposalId)){

System.debug('Using Existing Proposal : '+proposalId);

// Fetch existing APA mappings
Map<Id, Id> existingAssocMap = new Map<Id, Id>();
for (Applicant_Proposal_Association__c assoc : [
SELECT Id, Contact__c 
FROM Applicant_Proposal_Association__c 
WHERE Proposals__c = :proposalId 
AND Contact__c IN :conIds
]) {
existingAssocMap.put(assoc.Contact__c, assoc.Id);
}

// Create missing APA
List<Applicant_Proposal_Association__c> newAssocList = new List<Applicant_Proposal_Association__c>();
for (Contact con : conList) {
if (!existingAssocMap.containsKey(con.Id)) {
newAssocList.add(new Applicant_Proposal_Association__c(
Contact__c = con.Id,
Proposals__c = proposalId
));
}
}

if(!newAssocList.isEmpty()){
insert newAssocList;
}

return proposalId;
}

// ------------------------------------------- //
// 4. CASE B: FIRST TIME → CREATE NEW PROPOSAL
// ------------------------------------------- //

System.debug('No ProposalId Provided → Creating New Proposal');

String workshopRecordTypeId = Schema.SObjectType.Application_Proposal__c
.getRecordTypeInfosByName()
.get('Workshop')
.getRecordTypeId();

Campaign camp = [SELECT Id, Name FROM Campaign WHERE Name = 'Workshop'];

Application_Proposal__c newProposal = new Application_Proposal__c(
Title_Of__c = 'Workshop',
RecordTypeId = workshopRecordTypeId,
Campaign__c = camp.Id
);
insert newProposal;

System.debug('Created New Proposal : '+newProposal.Id);

// Create APA for ALL Contacts
List<Applicant_Proposal_Association__c> apaList = new List<Applicant_Proposal_Association__c>();
for (Contact c : conList) {
apaList.add(new Applicant_Proposal_Association__c(
Contact__c = c.Id,
Proposals__c = newProposal.Id
));
}

insert apaList;
System.debug('APA Inserted Successfully : ' + apaList.size());

return newProposal.Id;
}
catch(Exception e){
return e.getMessage() + ' at Line : ' + e.getLineNumber();
}
}
*/
    
    // UPDATED METHOD - FOR WORKSHOP (In Use)
    // Inserts Accounts and Contacts
    // Inserts Application Proposal 
    // Creates Multiple Applicant_Proposal_Association__c as per New Contacts, tagging Contact and Application Proposal
    /*
public static String insertCoordinatorsInformation2(List<Account> accList, List<Contact> conList) {
System.debug(' -------------- insertCoordinatorsInformation2() ---------------- ');
System.debug('accList : ' + accList);
System.debug('conList : ' + conList);

try {
// Separate NEW vs EXISTING records
List<Account> newAccounts = new List<Account>();
List<Account> updateAccounts = new List<Account>();

for (Account a : accList) {
a.BillingState = a.Shipping_State__c;

if (a.Id == null) {
newAccounts.add(a);        // New Account → INSERT
} else {
updateAccounts.add(a);     // Existing Account → UPDATE
}
}
System.debug('newAccounts : ' + newAccounts);
System.debug('updateAccounts : ' + updateAccounts);

List<Contact> newContacts = new List<Contact>();
List<Contact> updateContacts = new List<Contact>();

for (Contact c : conList) {

if (String.isBlank(c.LastName)) {
c.LastName = c.FirstName;
}

if (c.Id == null) {
newContacts.add(c);        // New Contact → INSERT
} else {
updateContacts.add(c);     // Existing Contact → UPDATE
}
}
System.debug('newContacts : ' + newContacts);
System.debug('updateContacts : ' + updateContacts);

// INSERT and UPDATE Accounts
if (!newAccounts.isEmpty()) {
insert newAccounts;
System.debug('newAccounts : inserted successfully');
}
if (!updateAccounts.isEmpty()) {
update updateAccounts;
}

// Account Id → Id map
Map<Id, Id> accMap = new Map<Id, Id>();
for (Account acc : accList) {
if (acc.Id != null) {
accMap.put(acc.Id, acc.Id);
}
}

// AccountId to Contacts
for (Contact c : conList) {
if (c.AccountId != null && accMap.containsKey(c.AccountId)) {
c.AccountId = accMap.get(c.AccountId);
}
}

// INSERT & UPDATE Contacts
if (!newContacts.isEmpty()) {
insert newContacts;
System.debug('newContacts inserted successfully');
}
if (!updateContacts.isEmpty()) {
update updateContacts;
}

// Get WORKSHOP RecordTypeId 
String workshopRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Workshop').getRecordTypeId();
System.debug('workshopRecordTypeId : ' + workshopRecordTypeId);

// Create Proposal ONLY for NEW Contacts
if (!newContacts.isEmpty()) {
Application_Proposal__c proposal = new Application_Proposal__c(
Title_Of__c = 'Workshop',
RecordTypeId = workshopRecordTypeId
);
insert proposal;
System.debug('Proposal Inserted Successfully : ' + proposal.Id);

List<Applicant_Proposal_Association__c> apaList = new List<Applicant_Proposal_Association__c>();

for (Contact c : newContacts) {
apaList.add(new Applicant_Proposal_Association__c(
Contact__c = c.Id,
Proposals__c = proposal.Id
));
}

insert apaList;
System.debug('APA Inserted Successfully : ' + apaList.size());

}

return 'SUCCESS';

} catch (Exception e) {
return 'ERROR: ' + e.getMessage() + ' at line ' + e.getLineNumber();
}
}
*/
    
    
    
    
    //************************************** BasicDetails Page **********************************************************
    // OLD METHOD
    /*
public static Application_Proposal__c getBasicDetails(string applicantHashCode){

contact conRec = [select name,id,Proposals__c from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
system.debug('applicantHashCode' +applicantHashCode);
Application_Proposal__c proposalRecord;
if(!string.isBlank(conRec.Proposals__c)){
proposalRecord = [SELECT id,Name,Acronym__c,Country_of_Venue__c,Thematic_Area__c,Campaign__c,Title_Of__c,Title_In_German__c,Summary__c,Proposed_Venue__c,Proposed_Date__c,Workshop_Finish_Date__c,Campaign__r.Result_Announcement_Date__c FROM Application_Proposal__c WHERE Id=: conRec.Proposals__c];
system.debug('proposalRecord----'+proposalRecord);
return proposalRecord;
}else{
return proposalRecord;  
}     
}
*/
    
    // UPDATED METHOD CHANGED FOR WORKSHOP - USING HASHCODE
    /* 
public static Application_Proposal__c getBasicDetails(String applicantHashCode){
System.debug('applicantHashCode : ' + applicantHashCode);

Contact conRec = [SELECT Name, Id, Proposals__c 
FROM Contact 
WHERE Login_Hash_Code__c =:applicantHashCode 
LIMIT 1];
System.debug('conRec : ' + conRec);

String workshopRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Workshop').getRecordTypeId();
System.debug('workshopRecordTypeId : ' + workshopRecordTypeId);

List<Applicant_Proposal_Association__c> apaList = [
SELECT Proposals__c, Contact__c
FROM Applicant_Proposal_Association__c
WHERE Contact__c = :conRec.Id
AND Proposals__r.RecordTypeId = :workshopRecordTypeId
LIMIT 1
];
System.debug('apaList : ' + apaList);

Application_Proposal__c proposalRecord = [SELECT Id, Name, Acronym__c, Country_of_Venue__c, Thematic_Area__c, Campaign__c, 
Title_Of__c, Title_In_German__c, Summary__c, Proposed_Venue__c, Proposed_Date__c, Workshop_Finish_Date__c, 
Campaign__r.Result_Announcement_Date__c, RecordType_Name__c
FROM Application_Proposal__c 
WHERE Id =: apaList[0].Proposals__c
AND RecordTypeId = :workshopRecordTypeId
];
System.debug('proposalRecord : ' + proposalRecord);

if(proposalRecord != null){
return proposalRecord;
}else{
return null;
}
}
*/
    public static Application_Proposal__c getBasicDetails(String proposalId){
        System.debug('-------------------- getBasicDetails() ---------------------');
        System.debug('proposalId : ' + proposalId);
        
        if(String.isBlank(proposalId))
            return new Application_Proposal__c();
        
        String workshopRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Workshop').getRecordTypeId();
        System.debug('workshopRecordTypeId : ' + workshopRecordTypeId);
        
        Application_Proposal__c proposalRecord = [SELECT Id, Name, Acronym__c, Country_of_Venue__c, Thematic_Area__c, Campaign__c, 
                                                  Title_Of__c, Title_In_German__c, Summary__c, Proposed_Venue__c, Proposed_Date__c, Workshop_Finish_Date__c, 
                                                  Campaign__r.Result_Announcement_Date__c, RecordType_Name__c
                                                  FROM Application_Proposal__c 
                                                  WHERE Id = :proposalId
                                                  AND RecordTypeId = :workshopRecordTypeId
                                                 ];
        System.debug('proposalRecord : ' + proposalRecord);
        
        if(proposalRecord != null){
            return proposalRecord;
        }else{
            return null;
        }
    }
    
    // New Method
    public static String insertBasicDetails2 (
        Application_Proposal__c applicantDetails,
        Integer day, Integer month, Integer year,
        Integer endday, Integer emdmonth, Integer endyear,
        String conId, String proposalId, String recordType
    ){
        System.debug('--------------- EXECUTING insertBasicDetails2() ------------------');
        System.debug('Incoming applicantDetails : ' + applicantDetails);
        
        if(String.isBlank(conId)){
            return 'ERROR: Contact Id missing';
        }
        
        if(String.isBlank(proposalId)){
            return 'ERROR: ProposalId Id missing';
        }
        
        if(day==0 && month==0 && year==0){
            // Skip
        }else{
            applicantDetails.Proposed_Date__c = Date.newInstance(year, month, day);
        }
        
        if(endday==0 && emdmonth==0 && endyear==0){
            // Skip
        }else{
            applicantDetails.Workshop_Finish_Date__c = Date.newInstance(endyear, emdmonth, endday);
        }
        
        applicantDetails.Id = proposalId;       
        
        update applicantDetails;
        
        System.debug('Updated Proposal : ' + applicantDetails);
        
        return 'SUCCESS';
    }
    
    
    
    public static string insertBasicDetails (Application_Proposal__c applicantDetails, integer day, integer month, integer year, integer endday, integer emdmonth, integer endyear, String conId, String recordType){
        try{
            if(day==0 && month==0 && year==0){
                
            }else{
                applicantDetails.Proposed_Date__c = Date.newInstance(year, month, day);
                
            }
            if(endday==0 && emdmonth==0 && endyear==0){
                
            }else{
                applicantDetails.Workshop_Finish_Date__c = Date.newInstance(endyear, emdmonth, endday);
                
            }
            applicantDetails.Stage__c = '1st Stage';
            applicantDetails.Proposal_Stages__c = 'Draft';
            applicantDetails.RecordTypeId = Utility.getProposalRecordType('Workshop');
            upsert applicantDetails;
            
            Contact con = new Contact(Id=conId,Proposals__c = applicantDetails.Id);
            update con;
            contact conRec = [select id,AccountId from Contact where id=:con.Id];
            if(!string.isBlank(conRec.AccountId)){
                Account acc = New Account();
                acc.Id = conRec.AccountId;
                acc.Proposals__c = applicantDetails.Id;
                update acc;
            }
            return applicantDetails.Id;
        }catch (Exception e){
            return 'ERROR';
        }
    }
    
    //************************************** Participants **********************************************************
    
    // OLD METHOD
    /*
public static List<Participants__c> getParticipantDetails(string hashcode){
contact conRec = [select name,id,Proposals__c from contact where Login_Hash_Code__c =:hashcode limit 1];
system.debug('hashcode' +hashcode);
List<Participants__c> participantList = New List<Participants__c>();
if(!string.isBlank(conRec.Proposals__c)){
participantList = [SELECT Id,Name,Affiliation__c,Email__c,Organisation_Institute__c,Participant_Type__c,Phone__c,Whether_Participant_is_presenting__c,Proposals__c From Participants__c WHERE Proposals__c=: conRec.Proposals__c];
return participantList;
}
system.debug('participantList --> '+participantList);
return participantList;
}
*/
    
    // NEW METHOD FOR WORKSHOP - TO GET EXISTING PROPOSAL DETAILS USING HASHCODE
    /* public static List<Participants__c> getParticipantDetails(string hashcode){
System.debug('----------------------- getParticipantDetails() ---------------------------');

Contact conRec = [SELECT Name, Id, Proposals__c 
FROM Contact 
WHERE Login_Hash_Code__c = :hashcode 
LIMIT 1];
System.debug('hashcode' +hashcode);

List<Applicant_Proposal_Association__c> apaList = [
SELECT Proposals__c, Contact__c
FROM Applicant_Proposal_Association__c
WHERE Contact__c = :conRec.Id
LIMIT 1
];
System.debug('apaList : ' + apaList);

if (apaList.isEmpty() || apaList[0].Proposals__c == null) {
System.debug('No Proposal found → returning empty list');
return new List<Participants__c>();
}

List<Participants__c> participantList = [
SELECT Id, Name, Affiliation__c, Email__c, Organisation_Institute__c, Designation__c, 
Participant_Type__c, Phone__c, Whether_Participant_is_presenting__c,
Proposals__c
FROM Participants__c
WHERE Proposals__c = :apaList[0].Proposals__c
];
System.debug('participantList --> '+participantList);

return participantList;
} */
    
    // NEW METHOD FOR WORKSHOP - TO GET EXISTING PROPOSAL DETAILS USING PROPOSALID
    public static List<Participants__c> getParticipantDetails(String proposalId){
        System.debug('----------------------- getParticipantDetails() ---------------------------');
        
        if(String.isBlank(proposalId))
            return new List<Participants__c>();
        
        List<Participants__c> participantList = [
            SELECT Id, Name, Affiliation__c, Email__c, Organisation_Institute__c, Designation__c, 
            Participant_Type__c, Phone__c, Whether_Participant_is_presenting__c,
            Proposals__c
            FROM Participants__c
            WHERE Proposals__c = :proposalId
        ];
        System.debug('participantList : ' + participantList);
        
        return participantList;
    }
    
    // OLDEST EXISTING METHOD
    public static string insertParticipants(List<Participants__c> allParticipantDetails){
        try{
            system.debug('list --->'+allParticipantDetails);
            upsert allParticipantDetails;
            return 'SUCCESS';
        }catch(Exception e){
            System.debug('The Error is  :'+e.getMessage());
            return e.getMessage() + e.getLineNumber();
        }
    }
    
    // OLD METHOD FOR WORKSHOP - TO TAG PROPOSAL TO PARTICIPANTS USING HASHCODE
    /* public static String insertParticipants(List<Participants__c> allParticipantDetails, String hashCode){
try{
System.debug('----------------- insertParticipants() -------------------');

System.debug('allParticipantDetails list : ' + allParticipantDetails);
System.debug('hashCode : ' + hashCode);

Contact con = [SELECT Id, Login_Hash_Code__c
FROM Contact
WHERE Login_Hash_Code__c = :hashCode
];

List<Applicant_Proposal_Association__c> apaList = [
SELECT Proposals__c, Contact__c
FROM Applicant_Proposal_Association__c
WHERE Contact__c = :con.Id
LIMIT 1
];
System.debug('apaList : ' + apaList);

if(! allParticipantDetails.isEmpty()){
for(Participants__c p : allParticipantDetails){
p.Proposals__c = apaList[0].Proposals__c;
}
}
upsert allParticipantDetails;
System.debug('------ PARTICIPANTS DATA INSERTED SUCCESSFULLY !!');
return 'SUCCESS';
}catch(Exception e){
System.debug('The Error is  :'+e.getMessage());
return e.getMessage() + e.getLineNumber();
}
} */
    
    // NEW METHOD FOR WORKSHOP - TO TAG PROPOSAL TO PARTICIPANTS USING PROPOSALID
    public static String insertParticipants(List<Participants__c> allParticipantDetails, String proposalId){
        try{
            System.debug('----------------- insertParticipants() -------------------');
            
            System.debug('allParticipantDetails list : ' + allParticipantDetails);
            System.debug('proposalId : ' + proposalId);
            
            if(! allParticipantDetails.isEmpty()){
                for(Participants__c p : allParticipantDetails){
                    p.Proposals__c = proposalId;
                }
            }
            upsert allParticipantDetails;
            System.debug('------ PARTICIPANTS DATA INSERTED SUCCESSFULLY !!');
            return 'SUCCESS';
        }catch(Exception e){
            System.debug('The Error is  :'+e.getMessage());
            return e.getMessage() + e.getLineNumber();
        }
    } 
    
    
    public static  void deleteParticipant(string participantId){
        delete new Participants__c(id=participantId);
    }
    
    //************************************** CV of Coordinators **********************************************************
    
    
    public static List<Contact> getCurriculumDetails(string hashCode){
        Contact conRec = [Select Id,Name,Proposals__c FROM Contact WHERE Login_Hash_Code__c=: hashCode];
        List<Contact> conList = New List<Contact>();
        if(!string.isBlank(conRec.Proposals__c)){
            conList = [SELECT Id,Name,FirstName,LastName,Actual_Position__c,Department,Country__c,
                       Head_Of_Project__c,Homepage_URL__c,Email,Phone,Indian__c,German__c,
                       MailingAddress,MailingStreet,MailingCity,MailingCountry,MailingState,MailingPostalCode,
                       (SELECT Id,Name,Institution_Name__c,Area_of_specialization__c,Degree__c,End_Year__c FROM Education_Details__r),
                       (SELECT Id,Name,Organization_Name__c,Position__c,End_Year__c FROM Employment_Details__r),(select name,id,description__c from Publications_Patents__r)
                       From Contact WHERE Proposals__c=: conRec.Proposals__c];
            return conList;
        }
        system.debug('conList --> '+conList);
        return conList;
    }
    
    public static String insertCurriculumDetails(List<Contact> contactDetails, List<Education_Details__c> educationDetails, List<Employment_Details__c> employmentDetails, List<Publications_Patents__c> publicationDetails){
        try{
            upsert contactDetails;
            upsert educationDetails;
            upsert employmentDetails;
            upsert publicationDetails;
            return 'SUCCESS';
        }catch(exception e){
            system.debug('error -->'+e.getMessage());
            return 'ERROR';
        }
    }
    
    //************************************** Financial_Details **********************************************************
    
    public static List<Contact> getAllFinancialDetails(string hashCode){
        Contact conRec = [Select Id,Name,Proposals__c From Contact Where Login_Hash_Code__c=: hashCode];
        List<Contact> conList = New List<Contact>();
        if(!string.isBlank(conRec.Proposals__c)){
            conList = [SELECT Id,Indian__c,German__c,Proposals__c,(Select Id,Expanse_Head__c,Expanse_Name__c,Unit_Cost__c,Number__c,Total__c FROM Financial_Contribution__r) From Contact WHERE Proposals__c=: conRec.Proposals__c];
            return conList;
        }
        return conList;
    }
    
    public static string saveFinancialDetails(List<Financial_Contribution__c> financialList){
        try{
            upsert financialList;
            return 'Success';
        }catch(Exception e){
            return 'Error';
        }
    }
    
    // public static List<Account> getAccountExpenseDetails(string proposalId){
    //     try{
    //         List<Account> accListWithExpense = [Select Id,Name,Proposals__c,(select Id,Name From Expense_Head__c)]
    //     }catch(Exception e){
    
    //     }
    // }
    
    //************************************** BankDetailsForCoordinators **********************************************************
    
    public static List<Account> getBankDetails(string hashCode){
        Contact conRec = [Select Id,Name,Proposals__c From Contact Where Login_Hash_Code__c=: hashCode];
        List<Account> accList = New List<Account>();
        if(!string.isBlank(conRec.Proposals__c)){
            accList = [SELECT Id,Name,Proposals__c,Country_Type__c,(Select Id,Bank_Name__c,Bank_Type__c,Bank_IFSC_Code__c,Bank_SWIFT_Code__c,Bank_HSN_Code__c,Bank_Branch_Name__c,Bank_Account_Number__c,Account_Name__c,Bank_Address__c,Account__r.Country_Type__c From Bank_Details__r) From Account WHERE Proposals__c=: conRec.Proposals__c];
            return accList;
        }
        return accList;
    }
    
    public static String upsertBankDetails(List<Bank_Details__c> bankDetailsList){
        try{
            upsert bankDetailsList;
            return 'Success';
        }catch(Exception e){
            return e.getMessage() + e.getLineNumber();
        }
    }
    
    ///************************************** Project Details In Wiser **********************************************************
    
    public static Application_Proposal__c getApplicantDetailsWiser(string applicantHashCode ,String proposalId){
        
        contact conRec = [select name,id,Proposals__c from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
        Application_Proposal__c proposalRecord;
        if(!String.isBlank(proposalId)){
            proposalRecord = [SELECT id,Name,Title_Of__c,Duration_In_Months_Max_36__c,KeyWords__c,Abstract_of_proposed_work__c,Broad_area_of_research__c,Project_Description__c FROM Application_Proposal__c WHERE Id=: proposalId];
        }else{

        }
        return proposalRecord;
    }
    
    public static insertApplicationWrapper insertApplicationWiser(Application_Proposal__c applicantDetails, String conId, String recordType){
        insertApplicationWrapper datawrapper = new insertApplicationWrapper();
        try{
            string recordTypeId = Utility.getProposalRecordType(recordType);
            applicantDetails.RecordTypeId = recordTypeId;
            list<Applicant_Proposal_Association__c> apaList = new list<Applicant_Proposal_Association__c>();
            upsert applicantDetails;
             apaList = [SELECT Proposals__c, Contact__c FROM Applicant_Proposal_Association__c WHERE Contact__c = :conId AND Proposals__c = :applicantDetails.Id LIMIT 1];
            if(apaList.isEmpty()){
                Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c();
                apa.Contact__c = conId;
                apa.Proposals__c = applicantDetails.Id;
                apa.Is_Coordinator__c = true;
                insert apa;
                apaList.add(apa);
            }   
            datawrapper.apa = apaList[0];
            datawrapper.proposal = applicantDetails;
            datawrapper.proposalId = applicantDetails.Id;
            return datawrapper;
        }catch(Exception e){
            return new insertApplicationWrapper();
        }
    }

    
    //************************************** UPDATE WORK PACKAGE DETAILS **********************************************************
    
    public List<SelectOption> getAccountNames(string applicantHashCode) {
        contact conRec = [select name,id,Proposals__c,AccountId,Account.Name from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
        List<SelectOption> accOptions= new List<SelectOption>();
        accOptions.add( new SelectOption('','--Select--'));
        for( Account acc : [select Id,name,(SELECT Id,Title__c,Due_Date__c,Account__c FROM PI_Deliverables__r) from Account where Proposals__c=:conRec.Proposals__c]) {
            accOptions.add( new SelectOption(acc.Id,acc.name));
        }
        return accOptions;
    }
    
    /* public static List<Work_Package__c> getWPDetails(string applicantHashCode){
        List<Work_Package__c> workPackageList = New List<Work_Package__c>();
        
            workPackageList = [SELECT Id,TRL_Level__c,End_TRL_Level__c,WP_Sequence__c,Work_Package_Detail__c,Title__c,External_Id__c,Duration__c,Application__c,Account__c,Account__r.Name,(SELECT Id,Name,Account_Name__c,Account__c FROM Account_Mapping__r),
                               (SELECT Id,Name From Accounts__r) From Work_Package__c WHERE Application__c =: applicantHashCode];
        
        // for(Work_Package__c wpack : workPackageList){
        //     wpack.WP_Sequence__c = Integer.valueOf(wpack.WP_Sequence__c);
        // }
        system.debug('workPackageList ::'+workPackageList);
        return workPackageList;
    } */

    public static List<Work_Package__c> getWPDetails(String proposalId, String proposalStage){
        List<Work_Package__c> workPackageList = [
            SELECT Id,TRL_Level__c, End_TRL_Level__c, WP_Sequence__c, Work_Package_Detail__c,Title__c,External_Id__c,Duration__c,Application__c,Account__c,Account__r.Name,(SELECT Id,Name,Account_Name__c,Account__c FROM Account_Mapping__r),
            (SELECT Id,Name From Accounts__r) 
            FROM Work_Package__c 
            WHERE Application__c =: proposalId
            AND Proposal_Stage__c =: proposalStage];
        
        system.debug('workPackageList ::'+workPackageList);
        return workPackageList;
    }
    public static List<Account> getProposalAccounts(String ProposalId){
        try{
            List<Account> acc=[SELECT id,name,Country_Type__c from Account where proposals__c=:ProposalId];
            //return [select id,name,account.id,account.name,account.Country_Type__c from contact WHERE Login_Hash_Code__c =:applicantHashCode limit 1];
            return acc;
        }catch(Exception e){
            return null;
        }
        
    } 
    public static accountWrapper getProposalAccount(String applicantHashCode){
        accountWrapper wrap = new accountWrapper();
        List<Contact> conList = new List<Contact>();
        List<Account> accList = new List<Account>();
        try{
            //    List<Account> acc=[SELECT id,name,Country_Type__c from Account where proposals__c=:ProposalId];
            conList = [select id,name,AccountId,account.id,account.name,account.Country_Type__c,account.BillingCountry,account.Academia__c,account.Industry__c from contact WHERE Login_Hash_Code__c =:applicantHashCode limit 1];
            if(!conList.isEmpty() && conList[0].AccountId != null) {
                accList = [SELECT ID, Name, IGSTC_Funding_Year_1__c, IGSTC_Funding_Year_2__c, IGSTC_Funding_Year_3__c, IGSTC_Total_Funding__c, Industry_Contribution_Year_1__c, Industry_Contribution_Year_2__c, Industry_Contribution_Year_3__c, Total_Industry_Contribution__c, (SELECT Id, Name, Own_Contribution__c, IGSTC_Contribution__c, Total__c FROM Financial_Contribution__r) FROM Account WHERE Id = :conList[0].AccountId];
            }
            wrap.conList = conList;
            wrap.accList = accList;
            return wrap;
        }catch(Exception e){
            return wrap;
        }
        
    } 
    
    public class accountWrapper {
        public List<Contact> conList;
        public List<Account> accList;
    }
    public static String LogoutApplicant(String loginHasgCode){
        System.debug('loginHasgCode ===> ' + loginHasgCode);
        if(loginHasgCode == null || loginHasgCode == '') {
            System.debug('No loginHasgCode found.');
            return 'No loginHasgCode found.';
        }
        try{
            List<contact> conRec = [select name,id,Proposals__c,Campaign__c from contact where Login_Hash_Code__c =:loginHasgCode limit 1];
            if(conRec.isEmpty()) {
                System.debug('No contact found.');
                return 'No contact found.';
            }
            conRec[0].Login_Hash_Code__c = null;
            update conRec;
            return 'Success';
        }
        catch(Exception e){
            system.debug('Error on logging out from Applicant Portal ===> '+e.getMessage()+' at Line No ===> '+e.getLineNumber()+' Stack Trace String ===> ' + e.getStackTraceString());
            return e.getMessage();
        }
    }
    
    //************************************** UPDATED PI DELIVERABLES DETAILS **********************************************************
    
    public static List<PI_Deliverables__c> getDeliverablesDetails(string applicantHashCode){
        List<PI_Deliverables__c> deliverableList = New List<PI_Deliverables__c>();
        
        Contact conRec = [Select Id,Name,Proposals__c From Contact WHERE Login_Hash_Code__c =:applicantHashCode limit 1];
        system.debug('applicantHashCode ::'+applicantHashCode);
        
        if(!string.isBlank(conRec.Proposals__c)){
            deliverableList = [SELECT Id,Title__c,External_Id__c,Due_Date__c,Application__c,Account__c,Account__r.Name,(SELECT Id,Name,Account_Name__c,Account__c FROM Deliverables_Account_Mapping__r),
                               (SELECT Id,Name From Accounts__r) From PI_Deliverables__c WHERE Application__c =: conRec.Proposals__c];
        }
        system.debug('deliverableList ::'+deliverableList);
        return deliverableList;
    }
    
    public string saveDeliverables(List<WrapperPIDeliverables> wrapper,String ProposalId){
        try{
            system.debug('wrapper::'+wrapper);
            Map<String,List<AccountListWrapper>> mapPiDeliverables=new Map<String,List<AccountListWrapper>>();
            List<PI_Deliverables__c> ListPiDeliverables=new List<PI_Deliverables__c>();
            List<Deliverables_Account_Mapping__c> amr=new List<Deliverables_Account_Mapping__c>();
            for(WrapperPIDeliverables piDeliver : wrapper){
                PI_Deliverables__c InstancePiDeliver=new PI_Deliverables__c();                
                if(piDeliver.Id!=''){
                    InstancePiDeliver.id=piDeliver.Id;
                }
                if(piDeliver.title != null){
                    InstancePiDeliver.Title__c=piDeliver.title;
                }
                if(piDeliver.year != 0){
                    InstancePiDeliver.Due_Date__c = Date.newInstance(piDeliver.year, piDeliver.month, piDeliver.day);
                }
                InstancePiDeliver.External_Id__c=piDeliver.ExternalId;
                InstancePiDeliver.Application__c=ProposalId;
                mapPiDeliverables.put(piDeliver.ExternalId,piDeliver.AccountListWrapper);
                ListPiDeliverables.add(InstancePiDeliver);
            }
            system.debug('ListPiDeliverables---'+ListPiDeliverables);
            upsert ListPiDeliverables;            
            Map<String,String> externalIdXpiDeliverid = New Map<String,String>();
            for(PI_Deliverables__c wp:ListPiDeliverables){
                externalIdXpiDeliverid.put(wp.External_Id__c,wp.Id);
            }
            system.debug('externalIdXpiDeliverid--'+externalIdXpiDeliverid);
            List<Deliverables_Account_Mapping__c> accMappingList = New List<Deliverables_Account_Mapping__c>();
            List<Deliverables_Account_Mapping__c> accMappingListToDelete = New List<Deliverables_Account_Mapping__c>();
            for(string externalId:mapPiDeliverables.keySet()){
                for(AccountListWrapper accWrapper:mapPiDeliverables.get(externalId)){
                    if(accWrapper.isSelected && String.isBlank(accWrapper.accountMappingId)){
                        Deliverables_Account_Mapping__c accMapping = New Deliverables_Account_Mapping__c();
                        accMapping.Account__c   = accWrapper.accnt.Id;
                        accMapping.PI_Deliverables__c = externalIdXpiDeliverid.get(externalId);
                        accMappingList.add(accMapping);
                    }else if(!accWrapper.isSelected && !String.isBlank(accWrapper.accountMappingId)){
                        accMappingListToDelete.add(New Deliverables_Account_Mapping__c(id=accWrapper.accountMappingId));
                    }
                }
            }
            system.debug('accMappingList--'+accMappingList);
            system.debug('accMappingListToDelete--'+accMappingListToDelete);
            if(!accMappingList.isEmpty())
                upsert accMappingList;
            if(!accMappingListToDelete.isEmpty())
                delete accMappingListToDelete;
            return 'success';
        }catch(Exception e){
            system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
            return 'Error Occured';
        }
    }
    
    public static string deleteDeliverables(string deliverId){
        try{
            List<Deliverables_Account_Mapping__c> accMappingList = [select name,id from Deliverables_Account_Mapping__c where PI_Deliverables__c =:deliverId];
            Delete accMappingList;
            Delete New PI_Deliverables__c(Id=deliverId);
            return 'Success';
        }catch(Exception e){
            system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
            return 'Error Occured';
        }
    }
    
    public class AccountListWrapper{
        public Account accnt;
        public Boolean isSelected;
        public String accountMappingId;
    }
    
    
    public class WrapperPIDeliverables {
        public Integer day;
        public Integer month;
        public Integer year;
        public String title;
        public String Id;
        public String ExternalId;
        public List<AccountListWrapper> AccountListWrapper;
        
    }
    
    //************************************** UPDATED NETWORK MEETING DETAILS  **********************************************************
    
    public static List<Network_Meeting__c> getMeetingDetails(string applicantHashCode){
        List<Network_Meeting__c> MeetingList = New List<Network_Meeting__c>();
        
        Contact conRec = [Select Id,Name,Proposals__c From Contact WHERE Login_Hash_Code__c =:applicantHashCode limit 1];
        system.debug('applicantHashCode ::'+applicantHashCode);
        
        if(!string.isBlank(conRec.Proposals__c)){
            MeetingList = [SELECT Id,Meeting_Agenda__c,Meeting_Venue__c,Tentative_Date__c,Actual_Date__c,External_Id__c,Proposals__c,Account__c,Account__r.Name,(SELECT Id,Name,Account_Name__c,Account__c FROM Network_Meeting_Account_Mapping__r),
                           (SELECT Id,Name From Accounts__r) From Network_Meeting__c WHERE Proposals__c =: conRec.Proposals__c];
        }
        system.debug('MeetingList ::'+MeetingList);
        return MeetingList;
    }
    
    public string saveMeetingDetailss(List<WrapperNetworkMeetings> wrapper,String ProposalId){
        try{
            system.debug('wrapper::'+wrapper);
            Map<String,List<AccountListWrapper>> mapNetworkMeeting=new Map<String,List<AccountListWrapper>>();
            List<Network_Meeting__c> listOfNetworkMeeting=new List<Network_Meeting__c>();
            List<Network_Meeting_Account_Mapping__c> amr=new List<Network_Meeting_Account_Mapping__c>();
            for(WrapperNetworkMeetings netMeeting : wrapper){
                Network_Meeting__c InstanceNetMeeting=new Network_Meeting__c();                
                if(netMeeting.Id!=''){
                    InstanceNetMeeting.id=netMeeting.Id;
                }
                if(netMeeting.meetingAgenda != null){
                    InstanceNetMeeting.Meeting_Agenda__c=netMeeting.meetingAgenda;
                }
                if(netMeeting.meetingVenue != null){
                    InstanceNetMeeting.Meeting_Venue__c=netMeeting.meetingVenue;
                }
                if(netMeeting.tentativeyear != 0){
                    InstanceNetMeeting.Tentative_Date__c = Date.newInstance(netMeeting.tentativeyear, netMeeting.tentativemonth, netMeeting.tentativeday);
                }
                if(netMeeting.actualyear != 0){
                    InstanceNetMeeting.Actual_Date__c = Date.newInstance(netMeeting.actualyear, netMeeting.actualmonth, netMeeting.actualday);
                }
                InstanceNetMeeting.External_Id__c=netMeeting.ExternalId;
                InstanceNetMeeting.Proposals__c=ProposalId;
                mapNetworkMeeting.put(netMeeting.ExternalId,netMeeting.AccountListWrapper);
                listOfNetworkMeeting.add(InstanceNetMeeting);
            }
            system.debug('listOfNetworkMeeting---'+listOfNetworkMeeting);
            upsert listOfNetworkMeeting;            
            Map<String,String> externalIdXnetMeetid = New Map<String,String>();
            for(Network_Meeting__c nm:listOfNetworkMeeting){
                externalIdXnetMeetid.put(nm.External_Id__c,nm.Id);
            }
            system.debug('externalIdXnetMeetid--'+externalIdXnetMeetid);
            List<Network_Meeting_Account_Mapping__c> accMappingList = New List<Network_Meeting_Account_Mapping__c>();
            List<Network_Meeting_Account_Mapping__c> accMappingListToDelete = New List<Network_Meeting_Account_Mapping__c>();
            for(string externalId:mapNetworkMeeting.keySet()){
                for(AccountListWrapper accWrapper:mapNetworkMeeting.get(externalId)){
                    if(accWrapper.isSelected && String.isBlank(accWrapper.accountMappingId)){
                        Network_Meeting_Account_Mapping__c accMapping = New Network_Meeting_Account_Mapping__c();
                        accMapping.Account__c   = accWrapper.accnt.Id;
                        accMapping.Network_Meeting__c = externalIdXnetMeetid.get(externalId);
                        accMappingList.add(accMapping);
                    }else if(!accWrapper.isSelected && !String.isBlank(accWrapper.accountMappingId)){
                        accMappingListToDelete.add(New Network_Meeting_Account_Mapping__c(id=accWrapper.accountMappingId));
                    }
                }
            }
            system.debug('accMappingList--'+accMappingList);
            system.debug('accMappingListToDelete--'+accMappingListToDelete);
            if(!accMappingList.isEmpty())
                upsert accMappingList;
            if(!accMappingListToDelete.isEmpty())
                delete accMappingListToDelete;
            return 'success';
        }catch(Exception e){
            system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
            return 'Error Occured';
        }
    }
    
    public static string deleteNetworkMeeting(string netMeetingId){
        try{
            List<Network_Meeting_Account_Mapping__c> accMappingList = [select name,id from Network_Meeting_Account_Mapping__c where Network_Meeting__c =:netMeetingId];
            Delete accMappingList;
            Delete New Network_Meeting__c(Id=netMeetingId);
            return 'Success';
        }catch(Exception e){
            system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
            return 'Error Occured';
        }
    }
    
    public class WrapperNetworkMeetings {
        public String meetingAgenda;
        public String meetingVenue;
        public Integer tentativeday;
        public Integer tentativemonth;
        public Integer tentativeyear;
        public Integer actualday;
        public Integer actualmonth;
        public Integer actualyear;
        public String Id;
        public String ExternalId;
        public List<AccountListWrapper> AccountListWrapper;
        
    }
    
    //************************************** Expense Declaration  **********************************************************
    //commented this method for backup
    // public static string createExpenseDeclarationDetails(List<Expense_Line_Item__c> expenseLineItem,String proposalId,String accId){
    //     system.debug('expenseLineItem::'+expenseLineItem);
    //     system.debug('proposalId::'+proposalId);
    //     system.debug('accId::'+accId);
    //     List<Yearly_Expense__c> yearlyExpense = New List<Yearly_Expense__c>();
    //     List<Expense_Master__c> expenseMasterList = [select id from Expense_Master__c where Account__c =: accId and proposals__c =:proposalId];
    //     system.debug('expenseMasterList:'+expenseMasterList);
    //     Map<String,Yearly_Expense__c> mapofYearByExpense = New Map<String,Yearly_Expense__c>();
    //     List<Expense_Head__c> expenseHeadTobeInsert = New List<Expense_Head__c>();
    //     Set<String> yearSet = New Set<String>();
    //     List<Expense_Line_Item__c> expenseLineItemTobeInsert = New List<Expense_Line_Item__c>();
    //     if(!expenseMasterList.isEmpty()){
    //         Set<String> emSet = new Set<String>();
    //         for(Expense_Master__c em : expenseMasterList){
    //             emSet.add(em.Id);
    //         }
    //         if(!emSet.isEmpty()){
    //             yearlyExpense = [select id,Expense_Master__c,year__c from Yearly_Expense__c where Expense_Master__c in: emSet order by year__c];
    //             system.debug('yearlyExpense::'+yearlyExpense);
    //             integer counter = 0;
    
    //             for(Yearly_Expense__c yrExpense : yearlyExpense){
    //                 yearSet.add(yrExpense.Id);
    //                 mapofYearByExpense.put('year'+ ++counter,yrExpense);
    //             }
    //         }
    //         system.debug('mapofYearByExpense::'+mapofYearByExpense);
    //         Set<String> firstYearSet = New Set<String>();
    //         Set<String> secondYearSet = New Set<String>();
    //         Set<String> thirdYearSet = New Set<String>();
    //         List<Expense_Head__c> exheadList = new List<Expense_Head__c>();
    //         exheadList = [select id,Yearly_Expense__c,Name from Expense_Head__c where Yearly_Expense__c in: yearSet];
    //         Map<Id,List<Expense_Head__c>> mapofYearIdByHeadId = New Map<Id,List<Expense_Head__c>>();
    //         if(!exheadList.isEmpty()){
    //             for(Expense_Head__c eh : exheadList){
    //                 if(mapofYearIdByHeadId.containsKey(eh.Yearly_Expense__c)){
    //                     mapofYearIdByHeadId.get(eh.Yearly_Expense__c).add(eh);
    //                 }else{
    //                     mapofYearIdByHeadId.put(eh.Yearly_Expense__c, new List<Expense_Head__c>{eh});
    //                 }
    //             }
    //         }
    //         system.debug('exhead::'+exheadList);
    //         if(!expenseLineItem.isEmpty()){
    //             for(Expense_Line_Item__c eli : expenseLineItem){
    //                 system.debug('eli::'+eli);
    //                 integer expenseCount = 0;
    //                 if(eli.Expense_Type__c != '' && eli.Year1_Expense__c >=0){
    
    //                     if(!firstYearSet.contains(eli.Expense_Type__c)){
    //                         Expense_Head__c exHead = new Expense_Head__c();
    //                         system.debug('eli.Expense_Head__c::'+eli.Expense_Head__c);
    
    //                         exHead.Name = eli.Expense_Type__c;
    //                         if(mapofYearIdByHeadId.get(mapofYearByExpense.get('year1').Id) != null){
    //                             for(Expense_Head__c exHead2 : mapofYearIdByHeadId.get(mapofYearByExpense.get('year1').Id)){
    //                                 if(exHead.Name == exHead2.Name){
    //                                     exHead.Id = exHead2.id;
    //                                 }
    //                             }
    //                         }
    
    //                         exHead.Yearly_Expense__c = mapofYearByExpense.get('year1').Id;
    //                         firstYearSet.add(eli.Expense_Type__c);
    //                         expenseHeadTobeInsert.add(exHead);
    //                     }
    //                 }
    //                 if(eli.Expense_Type__c != '' && eli.Year2_Expense__c >= 0){
    //                     if(!secondYearSet.contains(eli.Expense_Type__c)){
    //                         Expense_Head__c exHead = new Expense_Head__c();
    //                         exHead.Name = eli.Expense_Type__c;
    //                         if(mapofYearIdByHeadId.get(mapofYearByExpense.get('year2').Id) != null){
    //                             for(Expense_Head__c exHead2 : mapofYearIdByHeadId.get(mapofYearByExpense.get('year2').Id)){
    //                                 if(exHead.Name == exHead2.Name){
    //                                     exHead.Id = exHead2.id;
    //                                 }
    //                             }
    //                         }
    
    //                         exHead.Yearly_Expense__c = mapofYearByExpense.get('year2').Id;
    //                         secondYearSet.add(eli.Expense_Type__c);
    //                         expenseHeadTobeInsert.add(exHead);
    //                     }
    
    //                 }
    //                 if(eli.Expense_Type__c != '' && eli.Year3_Expense__c >= 0){
    //                     if(!thirdYearSet.contains(eli.Expense_Type__c)){
    //                         Expense_Head__c exHead = new Expense_Head__c();
    //                         exHead.Name = eli.Expense_Type__c;
    //                         if(mapofYearIdByHeadId.get(mapofYearByExpense.get('year3').Id) != null){
    //                             for(Expense_Head__c exHead2 : mapofYearIdByHeadId.get(mapofYearByExpense.get('year3').Id)){
    //                                 if(exHead.Name == exHead2.Name){
    //                                     exHead.Id = exHead2.id;
    //                                 }
    //                             }
    //                         }
    
    //                         exHead.Yearly_Expense__c = mapofYearByExpense.get('year3').Id;
    //                         thirdYearSet.add(eli.Expense_Type__c);
    //                         expenseHeadTobeInsert.add(exHead);
    //                     }
    //                 }
    //             }
    //             system.debug('expenseHeadTobeInsert::'+expenseHeadTobeInsert);
    //             if(!expenseHeadTobeInsert.isEmpty()){
    //                 upsert expenseHeadTobeInsert;
    //             }
    //             if(!yearSet.isEmpty()){
    //                 exheadList = [select id,Yearly_Expense__c,Name from Expense_Head__c where Yearly_Expense__c in: yearSet];
    //             }
    //             system.debug('exheadList::'+exheadList);
    //             set<Id> exHeadIdSet = new set<Id>();
    //             if(!exheadList.isEmpty()){
    //                 for(Expense_Head__c exHead : exheadList){
    //                     exHeadIdSet.add(exHead.Id);
    //                 }
    //             }
    //             Map<String,List<Expense_Head__c>> mapofYearidByExpenseHead = New Map<String,List<Expense_Head__c>>();
    //             for(Expense_Head__c exh : exheadList){
    //                 if(mapofYearidByExpenseHead.containsKey(exh.Yearly_Expense__c)){
    //                     mapofYearidByExpenseHead.get(exh.Yearly_Expense__c).add(exh);
    //                 }else{
    //                     mapofYearidByExpenseHead.put(exh.Yearly_Expense__c,new list<Expense_Head__c>{exh});
    //                 }
    //                 //mapofYearidByExpenseHead.put(exh.Yearly_Expense__c,exh);
    //             }
    //             List<Expense_Line_Item__c> expenseLineItemList = new List<Expense_Line_Item__c>();
    //             Map<Id,List<Expense_Line_Item__c>> mapofHeadIdByLineItems = New Map<Id,List<Expense_Line_Item__c>>();
    //             if(!exHeadIdSet.isEmpty()){
    //                 expenseLineItemList = [select id,Expense_Head__c,index__c from Expense_Line_Item__c where Expense_Head__c in : exHeadIdSet];
    //                 for(Expense_Line_Item__c exLine : expenseLineItemList){
    //                     if(mapofHeadIdByLineItems.containsKey(exLine.Expense_Head__c)){
    //                         mapofHeadIdByLineItems.get(exLine.Expense_Head__c).add(exLine);
    //                     }else{
    //                         mapofHeadIdByLineItems.put(exLine.Expense_Head__c,New List<Expense_Line_Item__c>{exLine});
    //                     }
    //                 }
    //             }
    
    
    //             for(Expense_Line_Item__c eli : expenseLineItem){
    
    //                 system.debug('eli::'+eli);
    //                 if(eli.Year1_Expense__c >= 0){
    //                     Expense_Line_Item__c newELI = New Expense_Line_Item__c();
    //                     //newELI = eli;
    //                     newELI.Description__c = eli.Description__c;
    //                     //newELI.Expense_Head__r.Description__c = newELI.Expense_Head__r.Description__c + ',' + newELI.Description__c;
    //                     newELI.Multiplier__c = eli.Multiplier__c;
    //                     newELI.Unit_Price__c = eli.Unit_Price__c;
    //                     // newELI.Total_Expense__c = eli.Total_Expense__c;
    //                     system.debug('mapofYearidByExpenseHead::'+mapofYearidByExpenseHead.get(mapofYearByExpense.get('year1').Id));
    //                     system.debug('mapofYearByExpense.getId::'+mapofYearByExpense.get('year1').Id);
    //                     for(Expense_Head__c exHead : mapofYearidByExpenseHead.get(mapofYearByExpense.get('year1').Id)){
    //                         system.debug('newELI.Expense_Type__c::'+eli.Expense_Type__c);
    //                         system.debug('exHead.Name::'+exHead.Name);
    //                         if(eli.Expense_Type__c == exHead.Name){
    //                             newELI.Expense_Head__c = exHead.Id;
    //                         }
    //                     }
    //                     //newELI.Expense_Head__c = mapofYearidByExpenseHead.get(mapofYearByExpense.get('year1').Id).Id;
    //                     newELI.Year2_Expense__c = 0;
    //                     newELI.Year3_Expense__c = 0;
    //                     newELI.Year1_Expense__c = eli.Year1_Expense__c;
    //                     newELI.Year1_Approved_Amount__c = eli.Year1_Approved_Amount__c;
    //                     newELI.index__c = eli.Index__c;
    //                     if(mapofHeadIdByLineItems.get(newELI.Expense_Head__c) != null){
    //                         for(Expense_Line_Item__c eli2 : mapofHeadIdByLineItems.get(newELI.Expense_Head__c)){
    //                             if(eli2.index__c == newELI.index__c){
    //                                 newELI.Id = eli2.Id;
    //                             }
    //                         } 
    //                     }
    
    
    //                     expenseLineItemTobeInsert.add(newELI);
    //                 }
    //                 system.debug('eli::'+eli);
    //                 system.debug('eli.Year2_Expense__c::'+eli.Year2_Expense__c);
    //                 if(eli.Year2_Expense__c >= 0){
    //                     Expense_Line_Item__c newELI = New Expense_Line_Item__c();
    //                     //newELI = eli;
    //                     newELI.Description__c = eli.Description__c;
    //                     newELI.Multiplier__c = eli.Multiplier__c;
    //                     newELI.Unit_Price__c = eli.Unit_Price__c;
    //                     // newELI.Total_Expense__c = eli.Total_Expense__c;
    //                     newELI.Year1_Expense__c = 0;
    //                     newELI.Year3_Expense__c = 0;
    //                     newELI.Year2_Expense__c = eli.Year2_Expense__c;
    //                     newELI.year2_Approved_Amount__c = eli.year2_Approved_Amount__c;
    //                     for(Expense_Head__c exHead : mapofYearidByExpenseHead.get(mapofYearByExpense.get('year2').Id)){
    //                         if(eli.Expense_Type__c == exHead.Name){
    //                             newELI.Expense_Head__c = exHead.Id;
    //                         }
    //                     }
    //                     //newELI.Expense_Head__c = mapofYearidByExpenseHead.get(mapofYearByExpense.get('year2').Id).Id;
    //                     newELI.index__c = eli.Index__c;
    //                     if(mapofHeadIdByLineItems.get(newELI.Expense_Head__c) != null){
    //                         for(Expense_Line_Item__c eli2 : mapofHeadIdByLineItems.get(newELI.Expense_Head__c)){
    //                             if(eli2.index__c == newELI.index__c){
    //                                 newELI.Id = eli2.Id;
    //                             }
    //                         } 
    //                     }
    //                     expenseLineItemTobeInsert.add(newELI);
    //                 }
    //                 if(eli.Year3_Expense__c >= 0){
    //                     Expense_Line_Item__c newELI = New Expense_Line_Item__c();
    //                     //newELI = eli;
    //                     newELI.Description__c = eli.Description__c;
    //                     newELI.Multiplier__c = eli.Multiplier__c;
    //                     newELI.Unit_Price__c = eli.Unit_Price__c;
    //                     // newELI.Total_Expense__c = eli.Total_Expense__c;
    //                     newELI.Year1_Expense__c = 0;
    //                     newELI.Year2_Expense__c = 0;
    //                     newELI.Year3_Expense__c = eli.Year3_Expense__c;
    //                     newELI.Year3_Approved_Amount__c = eli.Year3_Approved_Amount__c;
    //                     for(Expense_Head__c exHead : mapofYearidByExpenseHead.get(mapofYearByExpense.get('year3').Id)){
    //                         if(eli.Expense_Type__c == exHead.Name){
    //                             newELI.Expense_Head__c = exHead.Id;
    //                         }
    //                     }
    //                     //newELI.Expense_Head__c = mapofYearidByExpenseHead.get(mapofYearByExpense.get('year3').Id).Id;
    //                     newELI.index__c = eli.Index__c;
    //                     system.debug('newELI.index__c::'+newELI.index__c);
    //                     system.debug('newELI.index__c::'+newELI.Expense_Head__c);
    //                     system.debug('newELI.index__c::'+mapofHeadIdByLineItems.get(newELI.Expense_Head__c));
    //                     if(mapofHeadIdByLineItems.get(newELI.Expense_Head__c) != null){
    //                         for(Expense_Line_Item__c eli2 : mapofHeadIdByLineItems.get(newELI.Expense_Head__c)){
    //                             if(eli2.index__c == newELI.index__c){
    //                                 newELI.Id = eli2.Id;
    //                             }
    //                         } 
    //                     }
    //                     expenseLineItemTobeInsert.add(newELI);
    //                 }
    
    //             }
    //         }
    //     }
    //     system.debug('expenseLineItem::'+expenseLineItemTobeInsert);
    //     upsert expenseLineItemTobeInsert;
    //     return 'success';
    // }
    
    // Rewrote this method after changing the data model of Expense Categories, Expense Details and Applicant Proposal Association
    public static string createExpenseDeclarationDetails(String accId, List<Expense_Detail__c> manPowerRecords, 
                                                         List<Expense_Detail__c> consumables, List<Expense_Detail__c> Equipment, 
                                                         List<Expense_Detail__c> travel, List<Expense_Detail__c> overhead, 
                                                         List<Expense_Detail__c> contingency, List<Expense_Detail__c> outsourcing, 
                                                         Applicant_Proposal_Association__c updatedApa){
                                                             system.debug('manPowerRecords::' + manPowerRecords);
                                                             system.debug('consumables::' + consumables);
                                                             system.debug('travel::' + travel);
                                                             system.debug('contingency::' + contingency);
                                                             system.debug('Equipment::' + Equipment);
                                                             system.debug('overhead::' + overhead);
                                                             system.debug('outsourcing::' + outsourcing);
                                                             system.debug('accId::'+accId);
                                                             try{
                                                                 // Map<String, Expense_Category__c> nameXec = new Map<String, Expense_Category__c>();
                                                                 // List<Expense_Category__c> ecs = [SELECT Id FROM Expense_Category__c WHERE Account__c = :accId];
                                                                 // if(!ecs.isEmpty()) {
                                                                 //     for(Expense_Category__c ec : ecs) {
                                                                 //         if(!nameXec.containsKey(ec.Name)) {
                                                                 //             nameXec.put(ec.Name, ec);
                                                                 //         }
                                                                 //     }
                                                                 if(!manPowerRecords.isEmpty()) {
                                                                     // for(Expense_Detail__c ed : manPowerRecords) {
                                                                     //     ed.Expense_Category__c = nameXec.get('');
                                                                     // }
                                                                     upsert manPowerRecords;
                                                                 }
                                                                 if(!consumables.isEmpty()) {
                                                                     upsert consumables;
                                                                 }
                                                                 if(!travel.isEmpty()) {
                                                                     upsert travel;
                                                                 }
                                                                 if(!contingency.isEmpty()) {
                                                                     upsert contingency;
                                                                 }
                                                                 if(!Equipment.isEmpty()) {
                                                                     upsert Equipment;
                                                                 }
                                                                 if(!overhead.isEmpty()) {
                                                                     upsert overhead;
                                                                 }
                                                                 if(!outsourcing.isEmpty()) {
                                                                     upsert outsourcing;
                                                                 }
                                                                 update updatedApa;
                                                                 // }
                                                                 return 'success';
                                                             } catch(Exception e) {
                                                                 System.debug('Error whikle creating expense details ===> ' + e.getMessage() + ' at Line Number ===> ' + e.getLineNumber() + ' stacke trace ===> ' + e.getStackTraceString());
                                                                 return 'error';
                                                             }
                                                         }
    
    //expense head logic - single - commented this code for year expense issue
    /*
public static string createExpenseDeclarationDetails(List<Expense_Line_Item__c> expenseLineItem,String proposalId,String accId){
system.debug('expenseLineItem::'+expenseLineItem);
system.debug('proposalId::'+proposalId);
system.debug('accId::'+accId);
List<Yearly_Expense__c> yearlyExpense = New List<Yearly_Expense__c>();
List<Expense_Master__c> expenseMasterList = [select id from Expense_Master__c where Account__c =: accId and proposals__c =:proposalId];
system.debug('expenseMasterList:'+expenseMasterList);
Map<String,Yearly_Expense__c> mapofYearByExpense = New Map<String,Yearly_Expense__c>();
List<Expense_Head__c> expenseHeadTobeInsert = New List<Expense_Head__c>();
Set<String> yearSet = New Set<String>();
List<Expense_Line_Item__c> expenseLineItemTobeInsert = New List<Expense_Line_Item__c>();
if(!expenseMasterList.isEmpty()){
Set<String> emSet = new Set<String>();
for(Expense_Master__c em : expenseMasterList){
emSet.add(em.Id);
}
if(!emSet.isEmpty()){
yearlyExpense = [select id,Expense_Master__c,year__c from Yearly_Expense__c where Expense_Master__c in: emSet order by year__c];
system.debug('yearlyExpense::'+yearlyExpense);
integer counter = 0;

for(Yearly_Expense__c yrExpense : yearlyExpense){
yearSet.add(yrExpense.Id);
mapofYearByExpense.put('year'+ ++counter,yrExpense);
}
}
system.debug('mapofYearByExpense::'+mapofYearByExpense);
Set<String> firstYearSet = New Set<String>();
Set<String> secondYearSet = New Set<String>();
Set<String> thirdYearSet = New Set<String>();
List<Expense_Head__c> exheadList = new List<Expense_Head__c>();
exheadList = [select id,Yearly_Expense__c,Name from Expense_Head__c where Yearly_Expense__c in: yearSet];
Map<Id,List<Expense_Head__c>> mapofYearIdByHeadId = New Map<Id,List<Expense_Head__c>>();
if(!exheadList.isEmpty()){
for(Expense_Head__c eh : exheadList){
if(mapofYearIdByHeadId.containsKey(eh.Yearly_Expense__c)){
mapofYearIdByHeadId.get(eh.Yearly_Expense__c).add(eh);
}else{
mapofYearIdByHeadId.put(eh.Yearly_Expense__c, new List<Expense_Head__c>{eh});
}
}
}
system.debug('exhead::'+exheadList);
if(!expenseLineItem.isEmpty()){
for(Expense_Line_Item__c eli : expenseLineItem){
system.debug('eli::'+eli);
integer expenseCount = 0;
if(eli.Expense_Type__c != '' && (eli.Year1_Expense__c >=0 || eli.Year2_Expense__c >= 0 || eli.Year3_Expense__c >= 0)){

if(!firstYearSet.contains(eli.Expense_Type__c)){
Expense_Head__c exHead = new Expense_Head__c();
system.debug('eli.Expense_Head__c::'+eli.Expense_Head__c);

exHead.Name = eli.Expense_Type__c;
if(mapofYearIdByHeadId.get(mapofYearByExpense.get('year1').Id) != null){
for(Expense_Head__c exHead2 : mapofYearIdByHeadId.get(mapofYearByExpense.get('year1').Id)){
if(exHead.Name == exHead2.Name){
exHead.Id = exHead2.id;
//added by rutuja
exHead.Total_Year_1_ELI__c = eli.Year1_Expense__c;
}
}
}

exHead.Yearly_Expense__c = mapofYearByExpense.get('year1').Id;
firstYearSet.add(eli.Expense_Type__c);
expenseHeadTobeInsert.add(exHead);
}
}

}
system.debug('expenseHeadTobeInsert::'+expenseHeadTobeInsert);
if(!expenseHeadTobeInsert.isEmpty()){
upsert expenseHeadTobeInsert;
}
if(!yearSet.isEmpty()){
exheadList = [select id,Yearly_Expense__c,Name from Expense_Head__c where Yearly_Expense__c in: yearSet];
}
system.debug('exheadList::'+exheadList);
set<Id> exHeadIdSet = new set<Id>();
if(!exheadList.isEmpty()){
for(Expense_Head__c exHead : exheadList){
exHeadIdSet.add(exHead.Id);
}
}
Map<String,List<Expense_Head__c>> mapofYearidByExpenseHead = New Map<String,List<Expense_Head__c>>();
for(Expense_Head__c exh : exheadList){
if(mapofYearidByExpenseHead.containsKey(exh.Yearly_Expense__c)){
mapofYearidByExpenseHead.get(exh.Yearly_Expense__c).add(exh);
}else{
mapofYearidByExpenseHead.put(exh.Yearly_Expense__c,new list<Expense_Head__c>{exh});
}
//mapofYearidByExpenseHead.put(exh.Yearly_Expense__c,exh);
}
List<Expense_Line_Item__c> expenseLineItemList = new List<Expense_Line_Item__c>();
Map<Id,List<Expense_Line_Item__c>> mapofHeadIdByLineItems = New Map<Id,List<Expense_Line_Item__c>>();
if(!exHeadIdSet.isEmpty()){
expenseLineItemList = [select id,Expense_Head__c,index__c from Expense_Line_Item__c where Expense_Head__c in : exHeadIdSet];
for(Expense_Line_Item__c exLine : expenseLineItemList){
if(mapofHeadIdByLineItems.containsKey(exLine.Expense_Head__c)){
mapofHeadIdByLineItems.get(exLine.Expense_Head__c).add(exLine);
}else{
mapofHeadIdByLineItems.put(exLine.Expense_Head__c,New List<Expense_Line_Item__c>{exLine});
}
}
}


for(Expense_Line_Item__c eli : expenseLineItem){

system.debug('eli::'+eli);
if(eli.Year1_Expense__c >= 0 || eli.Year2_Expense__c >= 0 || eli.Year3_Expense__c >= 0){
Expense_Line_Item__c newELI = New Expense_Line_Item__c();
//newELI = eli;
newELI.Description__c = eli.Description__c;
//newELI.Expense_Head__r.Description__c = newELI.Expense_Head__r.Description__c + ',' + newELI.Description__c;
newELI.Multiplier__c = eli.Multiplier__c;
newELI.Unit_Price__c = eli.Unit_Price__c;
// newELI.Total_Expense__c = eli.Total_Expense__c;
system.debug('mapofYearidByExpenseHead::'+mapofYearidByExpenseHead.get(mapofYearByExpense.get('year1').Id));
system.debug('mapofYearByExpense.getId::'+mapofYearByExpense.get('year1').Id);
for(Expense_Head__c exHead : mapofYearidByExpenseHead.get(mapofYearByExpense.get('year1').Id)){
system.debug('newELI.Expense_Type__c::'+eli.Expense_Type__c);
system.debug('exHead.Name::'+exHead.Name);
if(eli.Expense_Type__c == exHead.Name){
newELI.Expense_Head__c = exHead.Id;
}
}
//newELI.Expense_Head__c = mapofYearidByExpenseHead.get(mapofYearByExpense.get('year1').Id).Id;
//newELI.Year2_Expense__c = 0;
//newELI.Year3_Expense__c = 0;
newELI.Year1_Expense__c = eli.Year1_Expense__c;
newELI.Year1_Approved_Amount__c = eli.Year1_Approved_Amount__c;
newELI.Year2_Expense__c = eli.Year2_Expense__c;
newELI.year2_Approved_Amount__c = eli.year2_Approved_Amount__c;
newELI.Year3_Expense__c = eli.Year3_Expense__c;
newELI.Year3_Approved_Amount__c = eli.Year3_Approved_Amount__c;
newELI.index__c = eli.Index__c;
if(mapofHeadIdByLineItems.get(newELI.Expense_Head__c) != null){
for(Expense_Line_Item__c eli2 : mapofHeadIdByLineItems.get(newELI.Expense_Head__c)){
if(eli2.index__c == newELI.index__c){
newELI.Id = eli2.Id;
}
} 
}


expenseLineItemTobeInsert.add(newELI);
}
system.debug('eli::'+eli);
system.debug('eli.Year2_Expense__c::'+eli.Year2_Expense__c);

}
}
}
system.debug('expenseLineItem::'+expenseLineItemTobeInsert);
upsert expenseLineItemTobeInsert;
return 'success';
}
*/
    
    public static edWrapper getExpenseDetails(String ProposalId, String ContactId) {
        edWrapper wrap = new edWrapper();
        List<Expense_Detail__c> listOfExpense = new List<Expense_Detail__c>();
        List<Expense_Category__c> listOfCategory = new List<Expense_Category__c>();
        List<Contact> conList = new List<Contact>();
        List<Account> accList = new List<Account>();
        System.debug('ProposalId ===> ' + ProposalId);
        System.debug('ContactId ===> ' + ContactId);
        if(ContactId == null || ContactId == '' || ProposalId == null || ProposalId == '') {
            System.debug('ProposalId or ContactId is empty!');
            return wrap;
        }
        try {
            List<Applicant_Proposal_Association__c> requiredApa = [SELECT Id, Contact__c, Proposals__c, IGSTC_Funding_Year_1__c, IGSTC_Funding_Year_2__c, IGSTC_Funding_Year_3__c, IGSTC_Total_Funding__c, Industry_Contribution_Year_1__c, Industry_Contribution_Year_2__c, Industry_Contribution_Year_3__c, Total_Industry_Contribution__c,
                                                                   (SELECT Id, Name, Own_Contribution__c, IGSTC_Contribution__c, Total__c FROM Financial_Contribution__r)
                                                                   FROM Applicant_Proposal_Association__c 
                                                                   WHERE Contact__c = :ContactId 
                                                                   AND Proposals__c = :ProposalId 
                                                                   LIMIT 1];
            if(requiredApa.isEmpty()) {
                System.debug('Applicant Proposal Association not found!');
                return wrap;
            }
            conList = [SELECT Id,Name,AccountId,account.id,account.name,account.Country_Type__c,account.BillingCountry,account.Academia__c,account.Industry__c FROM Contact WHERE Id =:ContactId LIMIT 1];
            if(!conList.isEmpty() && conList[0].AccountId != null) {
                accList = [SELECT ID, Name, IGSTC_Funding_Year_1__c, IGSTC_Funding_Year_2__c, IGSTC_Funding_Year_3__c, IGSTC_Total_Funding__c, Industry_Contribution_Year_1__c, Industry_Contribution_Year_2__c, Industry_Contribution_Year_3__c, Total_Industry_Contribution__c FROM Account WHERE Id = :conList[0].AccountId];
            }
            wrap.conList = conList;
            wrap.accList = accList;
            listOfCategory = [SELECT Id, Name, Account__c, Applicant_Proposal_Association__c 
                              FROM Expense_Category__c 
                              WHERE Applicant_Proposal_Association__c = :requiredApa[0].Id];
            listOfExpense = [SELECT Id, Name, Description__c, Position__c, Number__c, Person_Month__c, 
                             Salary_Month__c, Unit_Price__c, Total_Expense__c, Year1_Expense__c, Year2_Expense__c, 
                             Year3_Expense__c, Expense_Category__c, Expense_Category__r.Account__c, 
                             Expense_Category__r.Name, Expense_Category__r.Overall_Expense__c, 
                             Expense_Category__r.Total_Expense_Year1__c, Expense_Category__r.Total_Expense_Year2__c, 
                             Expense_Category__r.Total_Expense_Year3__c, Expense_Category__r.Annual_Expense__r.Total_Expense__c,
                             Expense_Category__r.Annual_Expense__r.Name, Expense_Category__r.Annual_Expense__r.Year__c 
                             FROM Expense_Detail__c WHERE Expense_Category__r.Applicant_Proposal_Association__c = :requiredApa[0].Id ORDER BY Index__c ASC];
            System.debug('listOfExpense ==> ' + listOfExpense);
            wrap.ecList = listOfCategory;
            wrap.edList = listOfExpense;
            wrap.apa = requiredApa;
            return wrap;
        }catch(Exception e) {
            System.debug('Error querying Expense_Detail__c ===> ' + e.getMessage() + ' at Line ===> ' + e.getLineNumber() + ' stack Trace ===> ' + e.getStackTraceString());
            return wrap;
        }
    }
    
    public class edWrapper {
        public List<Expense_Detail__c> edList;
        public List<Expense_Category__c> ecList; 
        public List<Applicant_Proposal_Association__c> apa;
        public List<Contact> conList;
        public List<Account> accList;
    }
    
    public static List<Expense_Line_Item__c> getExpenseRecords(String ProposalId){
        List<Expense_Line_Item__c> listOfExpense=[SELECT id,Index__c,name,Description__c,Position__c,Number__c,Salary_Month__c,Person_Month__c,Expense_Type__c,Multiplier__c,Total_Expense__c,Total_ELI_Sum__c,Unit_Price__c,Year3_Approved_Amount__c,year2_Approved_Amount__c,Year1_Approved_Amount__c,Year1_Expense__c,Year2_Expense__c,Year3_Expense__c,Expense_Head__c,
                                                  Expense_Head__r.Yearly_Expense__c,Expense_Head__r.Name,Expense_Head__r.Yearly_Expense__r.Expense_Master__c,Expense_Head__r.Yearly_Expense__r.Expense_Master__r.Account__c From Expense_Line_Item__c
                                                  where Expense_Head__r.Yearly_Expense__r.Expense_Master__r.Proposals__c =: ProposalId order by index__c asc];
        
        list<Expense_Line_Item__c> expenseListTobeReturn  =new list<Expense_Line_Item__c>();
        Map<String,List<Expense_Line_Item__c>> mapofExpenseHeadByLineItems = new Map<String,List<Expense_Line_Item__c>>();
        Map<String,Map<String,List<Expense_Line_Item__c>>> mapOfExpenseHeadByAccLineItems = new Map<String,Map<String,List<Expense_Line_Item__c>>>();
        
        if(!listOfExpense.isEmpty()){
            for(Expense_Line_Item__c exLine : listOfExpense){
                if(mapOfExpenseHeadByAccLineItems.containsKey(exLine.Expense_Head__r.Yearly_Expense__r.Expense_Master__r.Account__c)){
                    if(mapOfExpenseHeadByAccLineItems.get(exLine.Expense_Head__r.Yearly_Expense__r.Expense_Master__r.Account__c).containsKey(exLine.Expense_Head__r.Name)){
                        mapOfExpenseHeadByAccLineItems.get(exLine.Expense_Head__r.Yearly_Expense__r.Expense_Master__r.Account__c).get(exLine.Expense_Head__r.Name).add(exLine);
                    }else{
                        mapOfExpenseHeadByAccLineItems.get(exLine.Expense_Head__r.Yearly_Expense__r.Expense_Master__r.Account__c).put(exLine.Expense_Head__r.Name,new List<Expense_Line_Item__c>{exLine});
                    }
                }else{
                    //mapofExpenseHeadByLineItems.put(exLine.Expense_Head__r.Name,new List<Expense_Line_Item__c>{exLine});                    
                    mapOfExpenseHeadByAccLineItems.put(exLine.Expense_Head__r.Yearly_Expense__r.Expense_Master__r.Account__c,new Map<String,List<Expense_Line_Item__c>>{exLine.Expense_Head__r.Name =>new List<Expense_Line_Item__c>{exLine}});
                }
                /*if(mapofExpenseHeadByLineItems.containsKey(exLine.Expense_Head__r.Name)){
mapofExpenseHeadByLineItems.get(exLine.Expense_Head__r.Name).add(exLine);
}else{

}*/
            }
            Map<Decimal,List<Expense_Line_Item__c>> mapofIndexByListofExpense = new Map<Decimal,List<Expense_Line_Item__c>>();
            /*for(String mapKey : mapofExpenseHeadByLineItems.keySet()){

for(Expense_Line_Item__c exl : mapofExpenseHeadByLineItems.get(mapKey)){
if(mapofIndexByListofExpense.containsKey(exl.Index__c)){
mapofIndexByListofExpense.get(exl.Index__c).add(exl);
}else{
mapofIndexByListofExpense.put(exl.Index__c,new list<Expense_Line_Item__c>{exl});
}
}
}*/
            for(String accId : mapOfExpenseHeadByAccLineItems.KeySet()){
                List<Expense_Line_Item__c> exLineItem = new List<Expense_Line_Item__c>();
                system.debug('mapOfExpenseHeadByAccLineItems.get(accId).Values()::'+mapOfExpenseHeadByAccLineItems.get(accId).Values());
                system.debug('mapOfExpenseHeadByAccLineItems.get(accId).Values().size()::'+mapOfExpenseHeadByAccLineItems.get(accId).Values().size());
                system.debug('mapOfExpenseHeadByAccLineItems.get(accId)::'+mapOfExpenseHeadByAccLineItems.get(accId));
                //exLineItem.add(mapOfExpenseHeadByAccLineItems.get(accId).Values());
                for(List<Expense_Line_Item__c> mapKey : mapOfExpenseHeadByAccLineItems.get(accId).Values()){
                    System.debug('mapKey ---> ' + mapKey);
                    Expense_Line_Item__c ex;
                    for(Expense_Line_Item__c exl : mapKey){
                        system.debug('exl.Index__c::'+exl.Index__c);
                        if(ex != null && ex.Expense_Head__r.Name == exl.Expense_Head__r.Name && ex.Index__c == exl.Index__c){
                            if(exl.Year1_Expense__c != null && exl.Year1_Expense__c != 0){
                                ex.Year1_Expense__c = exl.Year1_Expense__c;
                                ex.Year1_Approved_Amount__c = exl.Year1_Approved_Amount__c;
                            }
                            if(exl.Year2_Expense__c != null && exl.Year2_Expense__c != 0){
                                ex.Year2_Expense__c = exl.Year2_Expense__c;
                                ex.year2_Approved_Amount__c = exl.year2_Approved_Amount__c;
                            }
                            if(exl.Year3_Expense__c != null && exl.Year3_Expense__c != 0){
                                ex.Year3_Expense__c = exl.Year3_Expense__c;
                                ex.Year3_Approved_Amount__c = exl.Year3_Approved_Amount__c;
                            }
                            
                            if(ex.Year1_Expense__c != null && ex.Year2_Expense__c != null && ex.Year3_Expense__c != null){
                                ex.Total_Expense__c = ex.Year1_Expense__c + ex.Year2_Expense__c + ex.Year3_Expense__c;
                            }
                        }else{
                            system.debug('Inside else part::');
                            ex = new Expense_Line_Item__c();
                            ex = exl;
                            system.debug('ex::'+ex);
                            system.debug('ex::'+ex.Index__c);
                            expenseListTobeReturn.add(ex);
                        }
                    }
                }
            }
            
            /*for(String  mapKey : mapofExpenseHeadByLineItems.keySet()){
system.debug('mapKey::'+mapKey);
Expense_Line_Item__c ex;
for(Expense_Line_Item__c exl : mapofExpenseHeadByLineItems.get(mapKey)){

}
}*/
            
        }
        
        system.debug('expenseListTobeReturn::'+expenseListTobeReturn.size());
        system.debug('expenseListTobeReturn1::'+expenseListTobeReturn);
        return expenseListTobeReturn;
    }
    
    public static void deleteExpenseLineItem(String expenseLineItemId){
        if(expenseLineItemId != null && expenseLineItemId != ''){
            // delete [select id from Expense_Line_Item__c where Id =: expenseLineItemId];
            //Added by Aman to delete all the related Line Items
            // Expense_Line_Item__c exli = [select id,Description__c, Expense_Head__r.Name,Expense_Head__r.Account_Id__c,Proposal_Id__c 
            //             from Expense_Line_Item__c where Id =: expenseLineItemId LIMIT 1];
            //     List<Expense_Line_Item__c> lineItemsToDelete = new List<Expense_Line_Item__c>();
            //     List<Expense_Head__c> allYearExpenseHeads = [Select id,Name, (Select id,Description__c from Expense_Line_Items__r where Proposal_Id__c=:exli.Proposal_Id__c)
            //                     From Expense_Head__c 
            //                     Where Name =:exli.Expense_Head__r.Name 
            //                     and Account_Id__c=: exli.Expense_Head__r.Account_Id__c];
            //     for(Expense_Head__c expHead : allYearExpenseHeads){
            //         for(Expense_Line_Item__c var_exli : expHead.Expense_Line_Items__r){
            //             if(var_exli.Description__c == exli.Description__c){
            //                 System.debug('var_exli.Description__c ###'+var_exli.Description__c);
            //                 lineItemsToDelete.add(var_exli);
            //             }
            //         }
            //     }
            //     if(!lineItemsToDelete.isEmpty()){
            //     System.debug('Line Items to be deleted :: '+lineItemsToDelete);
            //     delete lineItemsToDelete;
            //     }
            try {
                List<Expense_Detail__c> records = [SELECT ID FROM Expense_Detail__c WHERE Id = :expenseLineItemId];
                delete records;
            }catch(Exception e) {
                System.debug('Error deleting expenseLineItemId ===> ' + e.getMessage() + ' at Line ===> ' + e.getLineNumber() + ' stack Trace ===> ' + e.getStackTraceString());
            }
        }   
    }
    
    
    // ------------ WRAPPER CLASS ------------- //
    public class ProposalWithContactsDTO {
        public String Id;
        public String Name;
        public Boolean Privacy_Policy_Accepted;
        
        public List<ContactDTO> Contacts = new List<ContactDTO>();
    }
    
    public class ContactDTO {
        public String Id;
        public AccountDTO Account;
        public Date Declaration_Sign_Date;
    }
    
    public class AccountDTO {
        public String Country_Type;
    }

    public static ProposalWithContactsDTO getConsentCheckbox(String proposalId) {

        System.debug('------------- getConsentCheckbox(proposalId) ---------------');
        System.debug('proposalId : ' + proposalId);

        ProposalWithContactsDTO dto = new ProposalWithContactsDTO();

        try {
            Application_Proposal__c proposal = [
                SELECT Id, Name, Privacy_Policy_Accepted__c
                FROM Application_Proposal__c
                WHERE Id = :proposalId
                LIMIT 1
            ];

            dto.Id = proposal.Id;
            dto.Name = proposal.Name;
            dto.Privacy_Policy_Accepted = proposal.Privacy_Policy_Accepted__c;

            List<Contact> contacts = [
                SELECT Id,
                    Declaration_Sign_Date__c,
                    Account.Country_Type__c
                FROM Contact
                WHERE Id IN (
                    SELECT Contact__c
                    FROM Applicant_Proposal_Association__c
                    WHERE Proposals__c = :proposalId
                )
            ];

            for (Contact c : contacts) {
                ContactDTO cDto = new ContactDTO();
                cDto.Id = c.Id;
                cDto.Declaration_Sign_Date = c.Declaration_Sign_Date__c;

                AccountDTO accDto = new AccountDTO();
                accDto.Country_Type = c.Account.Country_Type__c;

                cDto.Account = accDto;
                dto.Contacts.add(cDto);
            }

            return dto;

        } catch (Exception e) {
            System.debug('Error in getConsentCheckbox: ' + e.getMessage());
            return dto;
        }
    }

    
    // NEW METHOD FOR WORKSHOP
    /*
    public static ProposalWithContactsDTO getConsentCheckbox(String hashcode) {
        
        System.debug('------------- getConsentCheckbox() ---------------');
        System.debug('hashCode :  ' + hashcode);
        ProposalWithContactsDTO dto = new ProposalWithContactsDTO();
        
        try {
            Contact conRec = [
                SELECT Id, Login_Hash_Code__c
                FROM Contact
                WHERE Login_Hash_Code__c = :hashcode
            ];
            System.debug('conRec : ' + conRec);
            
            if (conRec == null) return dto;
            
            Applicant_Proposal_Association__c apa = [
                SELECT Proposals__c
                FROM Applicant_Proposal_Association__c
                WHERE Contact__c = :conRec.Id
                LIMIT 1
            ];
            System.debug('apa : ' + apa);
            
            if (apa == null) return dto;
            
            Application_Proposal__c proposal = [
                SELECT Id, Name, Privacy_Policy_Accepted__c
                FROM Application_Proposal__c
                WHERE Id = :apa.Proposals__c
            ];
            System.debug('proposal : ' + proposal);
            
            dto.Id = proposal.Id;
            dto.Name = proposal.Name;
            dto.Privacy_Policy_Accepted = proposal.Privacy_Policy_Accepted__c;
            
            List<Contact> contacts = [
                SELECT Id, Declaration_Sign_Date__c,
                Account.Country_Type__c
                FROM Contact
                WHERE Id IN (
                    SELECT Contact__c
                    FROM Applicant_Proposal_Association__c
                    WHERE Proposals__c = :proposal.Id
                )
            ];
            System.debug('contacts  : ' + contacts);
            
            for (Contact c : contacts) {
                ContactDTO cDto = new ContactDTO();
                cDto.Id = c.Id;
                cDto.Declaration_Sign_Date = c.Declaration_Sign_Date__c;
                
                AccountDTO acc = new AccountDTO();
                acc.Country_Type = c.Account.Country_Type__c;
                cDto.Account = acc;
                
                dto.Contacts.add(cDto);
            }
            System.debug('dto : ' + dto);
            
            // After populating dto, convert to map:
            Map<String, Object> responseMap = new Map<String, Object>();
            
            responseMap.put('Id', dto.Id);
            responseMap.put('Name', dto.Name);
            responseMap.put('Privacy_Policy_Accepted__c', dto.Privacy_Policy_Accepted);
            
            // Build Contacts__r array
            List<Object> contactsList = new List<Object>();
            
            for (ContactDTO c : dto.Contacts) {
                Map<String, Object> cMap = new Map<String, Object>();
                cMap.put('Id', c.Id);
                cMap.put('Declaration_Sign_Date__c', c.Declaration_Sign_Date);
                
                Map<String, Object> accMap = new Map<String, Object>();
                accMap.put('Country_Type__c', c.Account.Country_Type);
                
                cMap.put('Account', accMap);
                
                contactsList.add(cMap);
            }
            
            responseMap.put('Contacts__r', contactsList);
            
            //return responseMap;
            
            return dto;
            
        } catch (Exception e) {
            System.debug('Error: ' + e.getMessage());
            return dto;
        }
    } 
    */
    
    // OLD CODE - CODE

        // public static Application_Proposal__c getConsentCheckbox(string proposalId){
        // Application_Proposal__c appDetails = new Application_Proposal__c();
        // try{
        // appDetails = [SELECT Id, Name, Privacy_Policy_Accepted__c,
        // (SELECT Id, Name, Account.Country_Type__c, Declaration_Sign_Date__c 
        // FROM Contacts__r) 
        // FROM Application_Proposal__c WHERE Id= :proposalId
        // ];
        // return appDetails;
        // }catch(Exception e){
        // return appDetails;
        // }
        // }

    
    // NEW METHOD - FOR WORKSHOP
    public static String saveAsDraftWorkshop(Application_Proposal__c proposalList, String projectId, Integer year, Integer month, Integer day){
        
        try{
            Contact userContact = [
                SELECT Id, Name, Declaration_Sign_Date__c, Login_Hash_Code__c 
                FROM Contact 
                WHERE Login_Hash_Code__c = :projectId
            ];
            System.debug('userContact : ' + userContact);
            
            if (userContact == null) {
                return 'Error: Invalid hashcode (contact not found)';
            }
            
            Applicant_Proposal_Association__c apa = [
                SELECT Id, Contact__c, Proposals__c
                FROM Applicant_Proposal_Association__c
                WHERE Contact__c = :userContact.Id
                LIMIT 1
            ];
            System.debug('apa : ' + apa);
            
            if (apa == null || apa.Proposals__c == null) {
                return 'Error: No proposal found for this contact';
            }
            
            Id proposalId = apa.Proposals__c;
            System.debug('proposalId : ' + proposalId);
            
            List<Contact> contactList = [
                SELECT Id, Name, Declaration_Sign_Date__c
                FROM Contact
                WHERE Id IN (
                    SELECT Contact__c
                    FROM Applicant_Proposal_Association__c
                    WHERE Proposals__c = :proposalId
                )
            ];
            System.debug('contactList Size : ' + contactList.size());
            System.debug('contactList : ' + contactList);
            
            if(! contactList.isEmpty()){
                for(Contact con : contactList){
                    if(year == 0 && month == 0 && day == 0){
                        
                    }else{
                        Date newDate = Date.newInstance(year,month,day);
                        con.Declaration_Sign_Date__c = newDate;
                    }
                }
            }
            update contactList;
            System.debug('contactList UPDATED SUCCESSFULLY !!');
            
            // Best Practice to query the records, else it will update the unpassed fields as null
            /*
Application_Proposal__c proposalToUpdate = [
SELECT Id 
FROM Application_Proposal__c
WHERE Id = :proposalId
LIMIT 1
];
proposalToUpdate.Proposal_Stages__c = 'Draft';
proposalToUpdate.Submitted__c = true;

// Apply user-updated fields
proposalToUpdate.putAll(proposalList);

upsert proposalToUpdate;
*/
            
            // proposalDetails.Stage__c = '1st Stage';
            proposalList.Proposal_Stages__c = 'Draft';
            proposalList.Submitted__c = true;
            
            upsert proposalList;
            System.debug('proposalList UPDATED SUCCESSFULLY !!');
            
            return 'success';
        }catch(Exception e){
            return e.getMessage() + e.getLineNumber();
        }
    } 
    
    // OLD METHOD
    /* public static string saveAsDraftWorkshop(Application_Proposal__c proposalList, String projectId, Integer year, Integer month, Integer day){
try{
List<Contact> contactList = [SELECT Id,Name,Declaration_Sign_Date__c From Contact WHERE Proposals__c =: projectId];
if(!contactList.isEmpty()){
for(Contact con : contactList){
if(year == 0 && month == 0 && day == 0){

}else{
Date newDate=Date.newInstance(year,month,day);
con.Declaration_Sign_Date__c=newDate;
}
}
}

update contactList;
// proposalDetails.Stage__c = '1st Stage';
proposalList.Proposal_Stages__c = 'Draft';
proposalList.Submitted__c = true;
upsert proposalList;
return 'success';
}catch(Exception e){
return e.getMessage() + e.getLineNumber();
}
} */
    
    // NEW METHOD - FOR WORKSHOP
    public static String upsertCheckbox(Application_Proposal__c proposalList, String hashcode, Integer year, Integer month, Integer day){
        try{
            System.debug(' --------------- upsertCheckbox() ------------------- ');
            
            /*
            Contact userContact = [
                SELECT Id, Name, Declaration_Sign_Date__c, Login_Hash_Code__c 
                FROM Contact 
                WHERE Login_Hash_Code__c = :hashcode
            ];
            System.debug('userContact : ' + userContact);
            
            if (userContact == null) {
                return 'Error: Invalid hashcode (contact not found)';
            }
            
            Applicant_Proposal_Association__c apa = [
                SELECT Id, Contact__c, Proposals__c
                FROM Applicant_Proposal_Association__c
                WHERE Contact__c = :userContact.Id
                LIMIT 1
            ];
            System.debug('apa : ' + apa);
            
            if (apa == null || apa.Proposals__c == null) {
                return 'Error: No proposal found for this contact';
            }
            */

            Id proposalId = proposalList.Id;
            System.debug('proposalId : ' + proposalId);
            
            List<Contact> contactList = [
                SELECT Id, Name, Declaration_Sign_Date__c
                FROM Contact
                WHERE Id IN (
                    SELECT Contact__c
                    FROM Applicant_Proposal_Association__c
                    WHERE Proposals__c = :proposalId
                )
            ];
            System.debug('contactList Size : ' + contactList.size());
            System.debug('contactList : ' + contactList);
            
            if(! contactList.isEmpty()){
                for(Contact con : contactList){
                    if(year == 0 && month == 0 && day == 0){
                        
                    }else{
                        Date newDate = Date.newInstance(year,month,day);
                        con.Declaration_Sign_Date__c = newDate;
                    }
                }
            }
            update contactList;
            System.debug('contactList UPDATED SUCCESSFULLY !!');
            
            // Best Practice to query the records, else it will update the unpassed fields as null
            
            // Application_Proposal__c proposalToUpdate = [
            //     SELECT Id 
            //     FROM Application_Proposal__c
            //     WHERE Id = :proposalId
            //     LIMIT 1
            // ];
            // proposalToUpdate.Proposal_Stages__c = 'Draft';
            // proposalToUpdate.Submitted__c = true;
            
            // // Apply user-updated fields
            // proposalToUpdate.putAll(proposalList);
            
            // upsert proposalToUpdate;
            
            
            proposalList.Stage__c = '1st Stage';
            proposalList.Proposal_Stages__c = 'Draft';
            proposalList.Submitted__c = true;
            
            upsert proposalList;
            System.debug('proposalList UPDATED SUCCESSFULLY !!');
            
            return 'success';
        }catch(Exception e){
            return e.getMessage() + e.getLineNumber();
        }
    } 

    // NEW METHOD - FOR WORKSHOP using hashcode
    // public static String upsertCheckbox(Application_Proposal__c proposalList, String hashcode, Integer year, Integer month, Integer day){
    //     try{
    //         System.debug(' --------------- upsertCheckbox() ------------------- ');
            
    //         Contact userContact = [
    //             SELECT Id, Name, Declaration_Sign_Date__c, Login_Hash_Code__c 
    //             FROM Contact 
    //             WHERE Login_Hash_Code__c = :hashcode
    //         ];
    //         System.debug('userContact : ' + userContact);
            
    //         if (userContact == null) {
    //             return 'Error: Invalid hashcode (contact not found)';
    //         }
            
    //         Applicant_Proposal_Association__c apa = [
    //             SELECT Id, Contact__c, Proposals__c
    //             FROM Applicant_Proposal_Association__c
    //             WHERE Contact__c = :userContact.Id
    //             LIMIT 1
    //         ];
    //         System.debug('apa : ' + apa);
            
    //         if (apa == null || apa.Proposals__c == null) {
    //             return 'Error: No proposal found for this contact';
    //         }
            
    //         Id proposalId = apa.Proposals__c;
    //         System.debug('proposalId : ' + proposalId);
            
    //         List<Contact> contactList = [
    //             SELECT Id, Name, Declaration_Sign_Date__c
    //             FROM Contact
    //             WHERE Id IN (
    //                 SELECT Contact__c
    //                 FROM Applicant_Proposal_Association__c
    //                 WHERE Proposals__c = :proposalId
    //             )
    //         ];
    //         System.debug('contactList Size : ' + contactList.size());
    //         System.debug('contactList : ' + contactList);
            
    //         if(! contactList.isEmpty()){
    //             for(Contact con : contactList){
    //                 if(year == 0 && month == 0 && day == 0){
                        
    //                 }else{
    //                     Date newDate = Date.newInstance(year,month,day);
    //                     con.Declaration_Sign_Date__c = newDate;
    //                 }
    //             }
    //         }
    //         update contactList;
    //         System.debug('contactList UPDATED SUCCESSFULLY !!');
            
    //         // Best Practice to query the records, else it will update the unpassed fields as null
            
    //         // Application_Proposal__c proposalToUpdate = [
    //         //     SELECT Id 
    //         //     FROM Application_Proposal__c
    //         //     WHERE Id = :proposalId
    //         //     LIMIT 1
    //         // ];
    //         // proposalToUpdate.Proposal_Stages__c = 'Draft';
    //         // proposalToUpdate.Submitted__c = true;
            
    //         // // Apply user-updated fields
    //         // proposalToUpdate.putAll(proposalList);
            
    //         // upsert proposalToUpdate;
            
            
    //         proposalDetails.Stage__c = '1st Stage';
    //         proposalList.Proposal_Stages__c = 'Draft';
    //         proposalList.Submitted__c = true;
            
    //         upsert proposalList;
    //         System.debug('proposalList UPDATED SUCCESSFULLY !!');
            
    //         return 'success';
    //     }catch(Exception e){
    //         return e.getMessage() + e.getLineNumber();
    //     }
    // } 
    
    
    // OLD METHOD
    /* public static string upsertCheckbox(Application_Proposal__c proposalList, String projectId, Integer year, Integer month, Integer day){
try{
List<Contact> contactList = [SELECT Id,Name,Declaration_Sign_Date__c From Contact WHERE Proposals__c =: projectId];
if(!contactList.isEmpty()){
for(Contact con : contactList){
if(year == 0 && month == 0 && day == 0){

}else{
Date newDate=Date.newInstance(year,month,day);
con.Declaration_Sign_Date__c=newDate;
}
}
}

update contactList;
// proposalDetails.Stage__c = '1st Stage';
proposalList.Proposal_Stages__c = 'Submitted';
proposalList.Submitted__c = true;
upsert proposalList;
return 'success';
}catch(Exception e){
return e.getMessage() + e.getLineNumber();
}
} */
    public static WrapProposalPendings getProposalPendings(String pid){
        List<Account> listAccounts=[SELECT name,Academia__c,Industry__c,Website,Country_Type__c,(select Budget__c,Duration__c,Funding_Agency__c,Starting_Date__c,Title__c from Existing_Grants__r),(select Asked_From_IGSTC__c,IGSTC_Contribution__c,Partner_Name__c,Own_Contribution__c,Total__c from Financial_Contribution__r) from Account where Proposals__c=:pid];
        List<Work_Package__c> workPackageList = [SELECT Id,TRL_Level__c,End_TRL_Level__c,WP_Sequence__c,Work_Package_Detail__c,Title__c,External_Id__c,Duration__c,Application__c,Account__c,Account__r.Name,(SELECT Id,Name,Account_Name__c,Account__c FROM Account_Mapping__r),
                                                 (SELECT Id,Name From Accounts__r) From Work_Package__c WHERE Application__c =: pid];
        WrapProposalPendings wpp=new WrapProposalPendings();
        wpp.accountList=listAccounts;
        wpp.workPackagesList=workPackageList;
        return wpp;
    }
    public class WrapProposalPendings{
        public List<Account> accountList;
        public List<Work_Package__c> workPackagesList;
    }
    
    // public static void getExPenseDetails(string hashcode){
    //     try{
    //        Contact conRec = [SELECT Id,Name,AccountId,Proposals__c FROM Contact WHERE Login_Hash_Code__c =: hashcode];
    //        Account accRec = [SELECT Id,Name,() FROM Account WHERE Proposals__c=: conRec.Proposals__c]; 
    //     }catch(Exception e){
    
    //     }
    // }
    
    // OLD CODE
    public static List<Expense_Head__c> getExpenseFromProposal(string proposalId){
        try{
            List<Expense_Head__c> expensehead = [SELECT Id,Name,Proposals__r.Total_funding_requested_from_IGSTC__c,Proposals__r.Country_of_Venue__c,Proposals__r.Funding_from_other_sources_own_contrib__c,(SELECT Id,Name,Expense_Head__c,Multiplier__c,Total_Expense__c,Total_ELI_Sum__c,Unit_Price__c,Description__c,Currency_Type2__c From Expense_Line_Items__r) FROM Expense_Head__c WHERE Proposals__c =: proposalId];
            return expensehead;
            
        }catch(Exception e){
            return null;
        }
    }
    
    // NEW CODE
    /*
public static List<Expense_Head__c> getExpenseFromProposal(String proposalId){
System.debug(' ------------------ ');

try{
Contact conRec = [
SELECT Id
FROM Contact
WHERE Login_Hash_Code__c = :hashcode
LIMIT 1
];

if (conRec == null) return dto;

Applicant_Proposal_Association__c apa = [
SELECT Proposals__c
FROM Applicant_Proposal_Association__c
WHERE Contact__c = :conRec.Id
LIMIT 1
];

if (apa == null) return dto;
}
catch(Exception e){

}
try{
List<Expense_Head__c> expensehead = [
SELECT Id, Name, Proposals__r.Total_funding_requested_from_IGSTC__c, Proposals__r.Country_of_Venue__c, Proposals__r.Funding_from_other_sources_own_contrib__c,
(SELECT Id, Name, Expense_Head__c, Multiplier__c, Total_Expense__c, Total_ELI_Sum__c, Unit_Price__c, Description__c, Currency_Type2__c FROM Expense_Line_Items__r) 
FROM Expense_Head__c
WHERE Proposals__c =: proposalId
];
return expensehead;

}catch(Exception e){
return null;
}
}
*/
    public static List<accWrapper> getExpenseDetailsOfAccount(string proposalId){
        try{
            Contact conRec = [SELECT Id,Name,AccountId,Proposals__c FROM Contact WHERE Login_Hash_Code__c =: proposalId];
            List<accWrapper> accWrapperList = New List<accWrapper>();
            Map<Id,Account> maPOfAcc = New Map<Id,Account>([Select Id,Name,BillingCountry From Account Where Id=: conRec.AccountId]);
            system.debug('maPOfAcc----'+maPOfAcc);
            Map<Id,Expense_Head__c> expenseList = New Map<Id,Expense_Head__c>([SELECT Id,Name,Account__c,Account__r.Name,Proposals__c,(SELECT Id,Name,Expense_Head__c,Multiplier__c,Total_Expense__c,Total_ELI_Sum__c,Unit_Price__c From Expense_Line_Items__r) From Expense_Head__c WHERE Account__c=: maPOfAcc.keySet()]);
            Map<Id,List<Expense_Head__c>> mapOfAccExList = new Map<Id,List<Expense_Head__c>>();
            map<string,List<expenseHeadWrapper>> accIdXExpheadwrapList = New map<string,List<expenseHeadWrapper>>();
            for(Expense_Head__c exHead : expenseList.values()){
                if(mapOfAccExList.containsKey(exHead.Account__c)){
                    mapOfAccExList.get(exHead.Account__c).add(exHead);
                }else{
                    mapOfAccExList.put(exHead.Account__c,new List<Expense_Head__c>{exHead});
                }
                
                expenseHeadWrapper expHead = New expenseHeadWrapper();
                expHead.expenseHead = exHead;
                expHead.expenseLineItemList = exHead.Expense_Line_Items__r;
                if(accIdXExpheadwrapList.containsKey(exHead.Account__c)){
                    accIdXExpheadwrapList.get(exHead.Account__c).add(expHead);
                }else{
                    accIdXExpheadwrapList.put(exHead.Account__c,new List<expenseHeadWrapper>{expHead});
                }
            }
            for(string appId:maPOfAcc.keySet()){
                accWrapper accWrap = New accWrapper();
                accWrap.accRec = maPOfAcc.get(appId);
                accWrap.exHeadWrapper = accIdXExpheadwrapList.get(appId);
                accWrapperList.add(accWrap);
            }
            return accWrapperList;
        }catch(Exception e){
            return null;
        }
    }
    
    
    public class expenseHeadWrapper{
        public Expense_Head__c expenseHead;
        public List<Expense_Line_Item__c> expenseLineItemList;
    }
    
    public class accWrapper{
        public Account accRec;
        public List<expenseHeadWrapper> exHeadWrapper;
    }
    
    
    public static string saveExpenseDetails(List<Expense_Line_Item__c> listOfLineItem, Application_Proposal__c appRecord){
        try{
            appRecord.Total_funding_requested_from_IGSTC__c = string.valueOf(appRecord.Total_funding_requested_from_IGSTC__c);
            appRecord.Funding_from_other_sources_own_contrib__c = string.valueOf(appRecord.Funding_from_other_sources_own_contrib__c);
            upsert appRecord;
            upsert listOfLineItem;
            // Map<String,List<Expense_Line_Item__c>> mapOfExpenseHeadwithLineItems = New Map<String,List<Expense_Line_Item__c>>();
            // Map<String,Id> indexOfExHeadById = New Map<String,Id>();
            // List<expenseHeadWrapper> expenWrap=new list<expenseHeadWrapper>();
            // List<Expense_Head__c> expenheadList=new List<Expense_Head__c>();
            // for(accWrapper acc : wrapper){
            //     expenWrap=acc.exHeadWrapper;
            //     for(expenseHeadWrapper exwr: expenWrap){
            //         exwr.expenseHead.Account__c = acc.accRec.id;
            //         mapOfExpenseHeadwithLineItems.put(exwr.expenseHead.Index__c,exwr.expenseLineItemList);
            //         expenheadList.add(exwr.expenseHead);
            //     }
            // }
            // //upsert expenheadList;
            // List<Expense_Line_Item__c> listexpenseLineItem = new List<Expense_Line_Item__c>();
            // for(Expense_Head__c exhead:expenheadList){
            //     for(Expense_Line_Item__c expLineItem:mapOfExpenseHeadwithLineItems.get(exhead.Index__c)){
            //         expLineItem.Expense_Head__c=exhead.Id;
            //         listexpenseLineItem.add(expLineItem);
            //     }
            // }
            // upsert listexpenseLineItem;
            return 'success';
        }catch(Exception e){
            return e.getMessage() + e.getLineNumber();
        }
    }
    
    
    
    public static  void deleteExpenseLineItems(string lineItemId){
        delete new Expense_Line_Item__c(id=lineItemId);
    }
    
    
    
    //************************************** PECFAR MODULE  **********************************************************
    
    //************************************** Fellowship_Details  **********************************************************
    
    public static String insertFellowship_Details(Contact proposalDetails, integer startday, integer startmonth, integer startyear, integer endday, integer endmonth, integer endyear,String conId, String recordType){
        try{
            system.debug('startday ::'+startday);
            system.debug('startmonth ::'+startmonth);
            system.debug('startyear ::'+startyear);
            system.debug('endday ::'+endday);
            system.debug('endmonth ::'+endmonth);
            system.debug('endyear ::'+endyear);
            system.debug('proposalDetails ::'+proposalDetails);
            if(startday==0 && startmonth==0 && startyear==0){
                
            }else{
                proposalDetails.Tentative_Start_Date__c = Date.newInstance(startyear,startmonth,startday);
                
            }
            
            if(endday==0 && endmonth==0 && endyear==0){
                
            }else{
                proposalDetails.Tentative_End_Date__c = Date.newInstance(endyear,endmonth,endday);
                
            }
            // proposalDetails.RecordTypeId = Utility.getProposalRecordType('PECFAR');
            // proposalDetails.Stage__c = '1st Stage';
            // proposalDetails.Proposal_Stages__c = 'Draft';
            upsert proposalDetails;
            //Contact con = new Contact(Id=conId,Proposals__c = proposalDetails.Id);
            
            Contact con = new Contact(Id=conId);
            update con;
            contact conRec = [select id,AccountId from Contact where id=:con.Id];
            if(!string.isBlank(conRec.AccountId)){
                Account acc = New Account();
                acc.Id = conRec.AccountId;
                // acc.Proposals__c = proposalDetails.Id;
                update acc;
            }
            return proposalDetails.Id;
        }catch(Exception e){
            system.debug('exception ----'+e.getLineNumber()+'-----'+e.getMessage());
            return e.getLineNumber()+'-----'+e.getMessage();
        }
    }
    
    public static List<Contact> getPairingDetails(String hashcode, String campaignId){
        // Get the contact by hashcode
        Contact conRec = [SELECT Id, FirstName, LastName, Email, AccountId, Account.Name,MailingCountry, Is_Primary__c, Birthdate FROM Contact WHERE Login_Hash_Code__c = :hashcode  LIMIT 1];
        
        // Query if contact has any junction records
        List<Applicant_Proposal_Association__c> associations = [SELECT Id,Proposals__c FROM Applicant_Proposal_Association__c WHERE Contact__c = :conRec.Id And Proposals__r.RecordType_Name__c='PECFAR' LIMIT 1];
        
        List<Contact> conList;
        if (!associations.isEmpty()) {
            // Existing proposal from junction
            Id proposalId = associations[0].Proposals__c;
            
            // Query contacts linked via junction for that proposal
            conList = [SELECT Id, FirstName, LastName, Email, AccountId, Account.Name, MailingCountry, Is_Primary__c, Birthdate 
                       FROM Contact WHERE Id IN (SELECT Contact__c FROM Applicant_Proposal_Association__c WHERE Proposals__c = :proposalId)];
        } else {       
            // Return only the single contact just linked newly
            conList = new List<Contact>{conRec};
                }
        
        return conList;
    }


    //***********************************NEW METHOD ADDED BY KARTHIK for pairing page
     public static List<Contact> getPairingDetailsinWiser(String hashcode, String proposalId){
        // Get the contact by hashcode
        Contact conRec = [SELECT Id, FirstName, LastName, Email, AccountId, Account.Name,MailingCountry, Is_Primary__c, Birthdate FROM Contact WHERE Login_Hash_Code__c = :hashcode  LIMIT 1];
        
        // Query if contact has any junction records
        List<Applicant_Proposal_Association__c> associations = [SELECT Id,Proposals__c FROM Applicant_Proposal_Association__c WHERE Contact__c = :conRec.Id And Proposals__c=:proposalId LIMIT 1];
        
        List<Contact> conList;
        if (!associations.isEmpty()) {
            // Existing proposal from junction
            //Id proposalId = associations[0].Proposals__c;
            
            // Query contacts linked via junction for that proposal
            conList = [SELECT Id, FirstName, LastName, Email, AccountId, Account.Name, MailingCountry, Is_Primary__c, Birthdate 
                       FROM Contact WHERE Id IN (SELECT Contact__c FROM Applicant_Proposal_Association__c WHERE Proposals__c = :proposalId)];
        } else {       
            // Return only the single contact just linked newly
            conList = new List<Contact>{conRec};
                }
        
        return conList;
    }
    ////********************************************************** */
    
    /*  public static List<Contact> getPairingDetails(string hashcode, string campaignId){
Contact conRec = [SELECT Id,FirstName,LastName,Email,AccountId,Proposals__r.Yearly_Call__r.Pecfar_age_limit__c,Proposals__r.Yearly_Call__r.Date_of_Birth_PECFAR__c,Account.Name,Account.Proposals__c,MailingCountry,Is_Primary__c,Birthdate,Proposals__c,Proposals__r.Campaign__r.Result_Announcement_Date__c FROM Contact WHERE Login_Hash_Code__c=: hashcode];
Application_Proposal__c app = New Application_Proposal__c();
if(conRec.Proposals__c == null){
app.Campaign__c = campaignId;
app.RecordTypeId = Utility.getProposalRecordType('PECFAR');
app.Proposal_Stages__c = 'Draft';
insert app;
conRec.Proposals__c = app.Id;
update conRec;
}
system.debug('app ::'+app);
system.debug('conRec.Proposals__c ::'+conRec.Proposals__c);
List<Contact> conList = [SELECT Id,FirstName,LastName,Email,AccountId,Account.Name,Proposals__r.Yearly_Call__r.Pecfar_age_limit__c,Proposals__r.Yearly_Call__r.Date_of_Birth_PECFAR__c,Account.Proposals__c,MailingCountry,Is_Primary__c,Birthdate,Proposals__c,Proposals__r.Campaign__r.Result_Announcement_Date__c,Proposals__r.Campaign__r.EndDate FROM Contact WHERE Proposals__c=: conRec.Proposals__c];
return conList;
}*/
    
  /*  public static String insertPairingDetails(List<wrapperPairing> contactList, String campaignId,String yearlyCall){
        try{
            system.debug('size ---> ' + contactList.size());
            String existingAccountId;
            List<Contact> contList = new List<Contact>();
            List<Account> accList = new List<Account>();
            
            // Step 1: Upsert Accounts
            for(wrapperPairing wrapp : contactList){
                Account acc = new Account();
                acc.Name = wrapp.companyNmae;
                if(wrapp.accId != null){
                    acc.Id = wrapp.accId;
                    existingAccountId = wrapp.accId;
                }
                accList.add(acc);
            }
            upsert accList;
            
            Map<String, Id> accNameXaccId = new Map<String, Id>();
            for(Account accountSingle : accList){
                accNameXaccId.put(accountSingle.Name, accountSingle.Id);
            }
            
            // Step 2: Prepare Contact list for DML
            for(wrapperPairing wrapp : contactList){
                Contact con = new Contact();
                con.FirstName       = wrapp.cont.FirstName;
                con.LastName        = wrapp.cont.LastName;
                con.Email           = wrapp.cont.Email;
                con.MailingCountry  = wrapp.cont.MailingCountry;
                con.AccountId       = accNameXaccId.get(wrapp.companyNmae);
                
                if(wrapp.birthyear != null && wrapp.birthyear != 0){
                    con.Birthdate = Date.newInstance(wrapp.birthyear, wrapp.birthmonth, wrapp.birthday);
                }
                
                if(wrapp.cont.Id != null){
                    con.Id = wrapp.cont.Id;
                }
                contList.add(con);
            }
            
            List<Contact> newContacts      = new List<Contact>();
            List<Contact> existingContacts = new List<Contact>();
            for(Contact c : contList){
                if(c.Id == null){
                    newContacts.add(c);
                }else{
                    existingContacts.add(c);
                }
            }
            if(!newContacts.isEmpty()){
                insert newContacts;
            }
            if(!existingContacts.isEmpty()){
                update existingContacts;
            }
            
            // Collect all final contact Ids
            Set<Id> contactIds = new Set<Id>();
            for(Contact c : newContacts){
                contactIds.add(c.Id);
            }
            for(Contact c : existingContacts){
                contactIds.add(c.Id);
            }
            
            // Step 3: Check existing proposal THROUGH junction for these contacts
            Id pecfarRtId = Utility.getProposalRecordType('PECFAR');
            Application_Proposal__c singleProposal;
            
            // NEW LOGIC: Check if ANY of these contacts already have a proposal via junction
            List<Application_Proposal__c> existingProposalsViaJunction = new List<Application_Proposal__c>();
            if(!contactIds.isEmpty()){
                existingProposalsViaJunction = [
                    SELECT Id, Campaign__c, RecordTypeId
                    FROM Application_Proposal__c
                    WHERE Id IN (
                        SELECT Proposals__c 
                        FROM Applicant_Proposal_Association__c 
                        WHERE Contact__c IN :contactIds
                    )
                    AND Campaign__c = :campaignId
                    AND RecordTypeId = :pecfarRtId
                    LIMIT 1
                ];
            }
            
            if(!existingProposalsViaJunction.isEmpty()){
                // Use existing proposal found through junction
                singleProposal = existingProposalsViaJunction[0];
                system.debug('Found existing proposal via junction: ' + singleProposal.Id);
            } else {
                // No proposal found through junction - create new one
                singleProposal = new Application_Proposal__c();
                singleProposal.RecordTypeId   = pecfarRtId;
                singleProposal.Campaign__c    = campaignId;
                singleProposal.yearly_Call__c= yearlyCall;
                singleProposal.Proposal_Stages__c = 'Draft';
                insert singleProposal;
                system.debug('Created new proposal: ' + singleProposal.Id);
            }
            
            // Step 4: Create junction records for contacts NOT already linked
            List<Applicant_Proposal_Association__c> junctionList = new List<Applicant_Proposal_Association__c>();
            
            // Check existing junctions for these contacts + this proposal
            Map<Id, Applicant_Proposal_Association__c> existingJunctionMap = new Map<Id, Applicant_Proposal_Association__c>();
            if(!contactIds.isEmpty()){
                for(Applicant_Proposal_Association__c apa : [
                    SELECT Id, Contact__c
                    FROM Applicant_Proposal_Association__c
                    WHERE Contact__c IN :contactIds
                    AND Proposals__c = :singleProposal.Id
                ]){
                    existingJunctionMap.put(apa.Contact__c, apa);
                }
            }
            
            for(Id cId : contactIds){
                if(!existingJunctionMap.containsKey(cId)){
                    Applicant_Proposal_Association__c assoc = new Applicant_Proposal_Association__c();
                    assoc.Contact__c   = cId;
                    assoc.Proposals__c = singleProposal.Id;
                    junctionList.add(assoc);
                }
            }
            
            if(!junctionList.isEmpty()){
                insert junctionList;
                system.debug('Created ' + junctionList.size() + ' new junction records');
            } else {
                system.debug('No new junction records needed - all contacts already linked');
            }
            
            //return 'SUCCESS';
            return singleProposal.Id;
            
        } catch(Exception e){
            return e.getMessage() + ' Line: ' + e.getLineNumber() + ' Stack: ' + e.getStackTraceString(); 
        }
    }
        */
public static insertPairingWrapper insertPairingDetails(List<wrapperPairing> contactList, String campaignId, String yearlyCall) {
    insertPairingWrapper dataWrapper = new insertPairingWrapper();
    
    try {
        system.debug('size ---> ' + contactList.size());
        
        // Step 1: Upsert Accounts
        List<Account> accList = new List<Account>();
        for(wrapperPairing wrapp : contactList) {
            Account acc = new Account();
            acc.Name = wrapp.companyNmae;
            if(wrapp.accId != null) {
                acc.Id = wrapp.accId;
            }
            accList.add(acc);
             System.debug('$#accList=====>'+accList);
        }
        upsert accList;
        
        Map<String, Id> accNameXaccId = new Map<String, Id>();
        for(Account accountSingle : accList) {
            accNameXaccId.put(accountSingle.Name, accountSingle.Id);
        }
        
        // Step 2: Prepare and process Contacts
        List<Contact> contList = new List<Contact>();
        System.debug('$#contList=====>'+contList);
        for(wrapperPairing wrapp : contactList) {
            Contact con = new Contact();
            con.FirstName = wrapp.cont.FirstName;
            con.LastName = wrapp.cont.LastName;
            con.Email = wrapp.cont.Email;
            con.MailingCountry = wrapp.cont.MailingCountry;
            con.AccountId = accNameXaccId.get(wrapp.companyNmae);
            
            if(wrapp.birthyear != null && wrapp.birthyear != 0) {
                con.Birthdate = Date.newInstance(wrapp.birthyear, wrapp.birthmonth, wrapp.birthday);
            }
            
            if(wrapp.cont.Id != null) {
                con.Id = wrapp.cont.Id;
            }
            contList.add(con);
        }
        
        List<Contact> newContacts = new List<Contact>();
        List<Contact> existingContacts = new List<Contact>();
        System.debug('$#newContacts=====>'+newContacts);
        System.debug('$#newContacts=====>'+existingContacts);
        for(Contact c : contList) {
            if(c.Id == null) {
                newContacts.add(c);
            } else {
                existingContacts.add(c);
            }
        }
        
        if(!newContacts.isEmpty()) {
            insert newContacts;
        }
        if(!existingContacts.isEmpty()) {
            update existingContacts;
        }
        
        // Collect all final contact Ids
        Set<Id> contactIds = new Set<Id>();
        for(Contact c : newContacts) {
            contactIds.add(c.Id);
            
        }
        for(Contact c : existingContacts) {
            contactIds.add(c.Id);
        }
        
        // Step 3: Handle Proposal (PEC FAR logic)
        Id pecfarRtId = Utility.getProposalRecordType('PECFAR');
        Application_Proposal__c singleProposal;
        
        List<Application_Proposal__c> existingProposalsViaJunction = new List<Application_Proposal__c>();
        if(!contactIds.isEmpty()) {
            system.debug('size contactIds---> '+contactIds);
            existingProposalsViaJunction = [
                SELECT Id, Campaign__c, RecordTypeId
                FROM Application_Proposal__c
                WHERE Id IN (
                    SELECT Proposals__c 
                    FROM Applicant_Proposal_Association__c 
                    WHERE Contact__c IN :contactIds
                )
                AND Campaign__c = :campaignId
                AND RecordTypeId = :pecfarRtId
                LIMIT 1
            ];
        }
        
        if(!existingProposalsViaJunction.isEmpty()) {
            singleProposal = existingProposalsViaJunction[0];
            system.debug('Found existing proposal via junction: ' + singleProposal.Id);
        } else {
            singleProposal = new Application_Proposal__c();
            singleProposal.RecordTypeId = pecfarRtId;
            singleProposal.Campaign__c = campaignId;
            singleProposal.yearly_Call__c = yearlyCall;
            singleProposal.Proposal_Stages__c = 'Draft';
            insert singleProposal;
            system.debug('Created new proposal: ' + singleProposal.Id);
        }
        
        // Step 4: Handle Applicant_Proposal_Association__c - create if doesn't exist (SINGLE record like reference)
        
    /*    Applicant_Proposal_Association__c association;
        // Pick first contact for association (like reference uses single conId)
        Id firstContactId = contactIds.isEmpty() ? null : new List<Id>(contactIds)[0];
        
        if(firstContactId != null) {
            List<Applicant_Proposal_Association__c> existingAppPropAssoc = [
                SELECT Id, Contact__c, Proposals__c 
                FROM Applicant_Proposal_Association__c 
                WHERE Contact__c = :firstContactId 
                AND Proposals__c = :singleProposal.Id 
                LIMIT 1
            ];
            
            if (existingAppPropAssoc.isEmpty()) {
                association = new Applicant_Proposal_Association__c(
                    Contact__c = firstContactId,
                    Proposals__c = singleProposal.Id
                );
                insert association;
                system.debug('Created association: ' + association.Id);
            } else {
                association = existingAppPropAssoc[0];
                system.debug('Found existing association: ' + association.Id);
            }
        }
        */
        
        Applicant_Proposal_Association__c association;
List<Applicant_Proposal_Association__c> assocToInsert = new List<Applicant_Proposal_Association__c>();

if (!contactIds.isEmpty()) {

    // Fetch existing associations for all contacts for this proposal
    Map<Id, Applicant_Proposal_Association__c> existingAssocMap = new Map<Id, Applicant_Proposal_Association__c>();

    for (Applicant_Proposal_Association__c apa : [
        SELECT Id, Contact__c, Proposals__c
        FROM Applicant_Proposal_Association__c
        WHERE Contact__c IN :contactIds
        AND Proposals__c = :singleProposal.Id
    ]) {
        existingAssocMap.put(apa.Contact__c, apa);
    }

    // Create associations only if not already present
    for (Id conId : contactIds) {
        if (!existingAssocMap.containsKey(conId)) {
            assocToInsert.add(new Applicant_Proposal_Association__c(
                Contact__c = conId,
                Proposals__c = singleProposal.Id
            ));
        }
    }

    // Insert missing associations
    if (!assocToInsert.isEmpty()) {
        insert assocToInsert;
        System.debug('Created associations count: ' + assocToInsert.size());
    }

    // Maintain reference-style single association (first available)
    if (!existingAssocMap.isEmpty()) {
        association = existingAssocMap.values()[0];
    } else if (!assocToInsert.isEmpty()) {
        association = assocToInsert[0];
    }
}
        
        // Populate wrapper with results (EXACT reference pattern)
        dataWrapper.proposalId = singleProposal.Id;
        dataWrapper.proposal = singleProposal;
        dataWrapper.apa = association;
        
        return dataWrapper;
        
    } catch (Exception e) {
        // Log the error properly
        System.debug('Error in insertPairingDetails at line ' + e.getLineNumber() + ': ' + e.getMessage());
        System.debug('Stack trace: ' + e.getStackTraceString());
        
        throw new AuraHandledException('Error inserting pairing details: ' + e.getMessage());
    }
}

public class insertPairingWrapper {
    public String proposalId { get; set; }
    public Application_Proposal__c proposal { get; set; }
    public Applicant_Proposal_Association__c apa { get; set; }
}





//////**********************************New Method Added By Karthik For Pairing Page


public static insertPairingWrapperinWiser insertPairingDetailsinWiser(List<wrapperPairing> contactList, String campaignId, String yearlyCall) {
    insertPairingWrapperinWiser dataWrapper = new insertPairingWrapperinWiser();
    
    try {
        system.debug('size ---> ' + contactList.size());
        
        // Step 1: Upsert Accounts
        List<Account> accList = new List<Account>();
        for(wrapperPairing wrapp : contactList) {
            Account acc = new Account();
            acc.Name = wrapp.companyNmae;
            if(wrapp.accId != null) {
                acc.Id = wrapp.accId;
            }
            accList.add(acc);
             System.debug('$#accList=====>'+accList);
        }
        upsert accList;
        
        Map<String, Id> accNameXaccId = new Map<String, Id>();
        for(Account accountSingle : accList) {
            accNameXaccId.put(accountSingle.Name, accountSingle.Id);
        }
        
        // Step 2: Prepare and process Contacts
        List<Contact> contList = new List<Contact>();
        System.debug('$#contList=====>'+contList);
        for(wrapperPairing wrapp : contactList) {
            Contact con = new Contact();
            con.FirstName = wrapp.cont.FirstName;
            con.LastName = wrapp.cont.LastName;
            con.Email = wrapp.cont.Email;
            con.MailingCountry = wrapp.cont.MailingCountry;
            con.AccountId = accNameXaccId.get(wrapp.companyNmae);
            
            if(wrapp.birthyear != null && wrapp.birthyear != 0) {
                con.Birthdate = Date.newInstance(wrapp.birthyear, wrapp.birthmonth, wrapp.birthday);
            }
            
            if(wrapp.cont.Id != null) {
                con.Id = wrapp.cont.Id;
            }
            contList.add(con);
        }
        
        List<Contact> newContacts = new List<Contact>();
        List<Contact> existingContacts = new List<Contact>();
        System.debug('$#newContacts=====>'+newContacts);
        System.debug('$#newContacts=====>'+existingContacts);
        for(Contact c : contList) {
            if(c.Id == null) {
                newContacts.add(c);
            } else {
                existingContacts.add(c);
            }
        }
        
        if(!newContacts.isEmpty()) {
            insert newContacts;
        }
        if(!existingContacts.isEmpty()) {
            update existingContacts;
        }
        
        // Collect all final contact Ids
        Set<Id> contactIds = new Set<Id>();
        for(Contact c : newContacts) {
            contactIds.add(c.Id);
            
        }
        for(Contact c : existingContacts) {
            contactIds.add(c.Id);
        }
        
        // Step 3: Handle Proposal (PEC FAR logic)
        Id wiserRtTd = Utility.getProposalRecordType('WISER');
        Application_Proposal__c singleProposal;
        
        List<Application_Proposal__c> existingProposalsViaJunction = new List<Application_Proposal__c>();
        if(!contactIds.isEmpty()) {
            system.debug('size contactIds---> '+contactIds);
            existingProposalsViaJunction = [
                SELECT Id, Campaign__c, RecordTypeId
                FROM Application_Proposal__c
                WHERE Id IN (
                    SELECT Proposals__c 
                    FROM Applicant_Proposal_Association__c 
                    WHERE Contact__c IN :contactIds
                )
                AND Campaign__c = :campaignId
                AND RecordTypeId = :wiserRtTd
                LIMIT 1
            ];
        }
        
        if(!existingProposalsViaJunction.isEmpty()) {
            singleProposal = existingProposalsViaJunction[0];
            system.debug('Found existing proposal via junction: ' + singleProposal.Id);
        } else {
            singleProposal = new Application_Proposal__c();
            singleProposal.RecordTypeId = wiserRtTd;
            singleProposal.Campaign__c = campaignId;
            singleProposal.yearly_Call__c = yearlyCall;
            singleProposal.Proposal_Stages__c = 'Draft';
            insert singleProposal;
            system.debug('Created new proposal: ' + singleProposal.Id);
        }
        
       
        
    Applicant_Proposal_Association__c association;
    List<Applicant_Proposal_Association__c> assocToInsert = new List<Applicant_Proposal_Association__c>();

    if (!contactIds.isEmpty()) {

        // Fetch existing associations for all contacts for this proposal
        Map<Id, Applicant_Proposal_Association__c> existingAssocMap = new Map<Id, Applicant_Proposal_Association__c>();

        for (Applicant_Proposal_Association__c apa : [
            SELECT Id, Contact__c, Proposals__c
            FROM Applicant_Proposal_Association__c
            WHERE Contact__c IN :contactIds
            AND Proposals__c = :singleProposal.Id
        ]) {
            existingAssocMap.put(apa.Contact__c, apa);
        }

        // Create associations only if not already present
        for (Id conId : contactIds) {
            if (!existingAssocMap.containsKey(conId)) {
                assocToInsert.add(new Applicant_Proposal_Association__c(
                    Contact__c = conId,
                    Proposals__c = singleProposal.Id
                ));
            }
        }

        // Insert missing associations
        if (!assocToInsert.isEmpty()) {
            insert assocToInsert;
            System.debug('Created associations count: ' + assocToInsert.size());
        }

        // Maintain reference-style single association (first available)
        if (!existingAssocMap.isEmpty()) {
            association = existingAssocMap.values()[0];
        } else if (!assocToInsert.isEmpty()) {
            association = assocToInsert[0];
        }
    }
        
        // Populate wrapper with results (EXACT reference pattern)
        dataWrapper.proposalId = singleProposal.Id;
        dataWrapper.proposal = singleProposal;
        dataWrapper.apa = association;        
        return dataWrapper;
        
    } catch (Exception e) {
        // Log the error properly
        System.debug('Error in insertPairingDetails at line ' + e.getLineNumber() + ': ' + e.getMessage());
        System.debug('Stack trace: ' + e.getStackTraceString());
        
        throw new AuraHandledException('Error inserting pairing details: ' + e.getMessage());
    }
}

public class insertPairingWrapperinWiser {
    public String proposalId { get; set; }
    public Application_Proposal__c proposal { get; set; }
    public Applicant_Proposal_Association__c apa { get; set; }
}
/////*********************************New method Added By Karthik  for pairing page*****************/

 
    public class wrapperPairing {
        public Contact cont;
        public Integer birthyear;
        public Integer birthmonth;
        public Integer birthday;
        public string companyNmae;
        public string proposal;
        public string accId;  
    }
    
    public static Contact getPersonalInformation(string hashCode){
        Contact conRec = [SELECT Id,Profile_Pic_Attachment_Id__c,Name,FirstName,LastName,Birthdate,Gender__c,Designation__c,Institution_Name__c,Country_Code__c,Nationality__c,MailingAddress,MailingStreet,MailingCity,MailingState,MailingCountry,Nationalities__c,
                          MailingPostalCode,Email,MobilePhone,Account.Name,Uploaded__c,(select name,id from Attachments Order By CreatedDate DESC limit 1) From Contact Where Login_Hash_Code__c =: hashcode];
        return conRec;
    }
    
    public static string insertPersonalInfo(Contact conDetails, integer birthday, integer birthmonth, integer birthyear){
        try{
            conDetails.MailingState = conDetails.State__c;
            if(birthday == 0 && birthmonth==0 && birthyear==0){
                
            }else{
                conDetails.Birthdate = Date.newInstance(birthyear, birthmonth, birthday); 
            }
            upsert conDetails;
            return 'success';
        }catch(Exception e){
            return e.getMessage() + e.getLineNumber();
        }
    }
    
    public static List<Employment_Details__c> getEmpDetails(string hashcode, string apaId){
        try{
            List<Employment_Details__c> empList = [Select Id,Name,Start_Date__c,End_Date__c,Position__c,Organization_Name__c,Nature_of_Job__c,Contact__c,current_employement__c,
                                                   Contact__r.Previous_industrial_internship__c,Contact__r.Availing_Fellowship__c,Contact__r.Fellowship_Details__c,Contact__r.Associated_with_IGSTC__c,Contact__r.Associated_Details__c,
                                                   Contact__r.Abstract_of_Ongoing_Work__c From Employment_Details__c Where Contact__r.Login_Hash_Code__c =: hashcode and Applicant_Proposal_Association__c=:apaId ];
            return empList;
        }catch(Exception e){
            return null;
        }
    }
    
    public static string insertEmploymentDetailsPECFAR(List<Employment_Details__c> empDetails,string apaId){
     
    try{
        if(empDetails != null && !empDetails.isEmpty()){
            for(Employment_Details__c emp : empDetails){
                emp.Applicant_Proposal_Association__c = apaId;
            }
            upsert empDetails;
        }
        return 'success';
    }catch(Exception e){
        return e.getMessage() + ' at line ' + e.getLineNumber();
    }
    }
    
    // public static string updateEmploymentDetails(List<employmentWrapper> empList){
    //     try{
    
    //         system.debug('size ---> '+empList.size());
    //         List<Employment_Details__c> employList = New List<Employment_Details__c>();
    //         Set<String> ids = New Set<String>();
    //         for(employmentWrapper wrap : empList){
    //             system.debug('wrap----'+wrap);
    //             Employment_Details__c emRec = New Employment_Details__c();
    //             emRec.Organization_Name__c = wrap.employmentDetails.Organization_Name__c;
    //             emRec.Position__c = wrap.employmentDetails.Position__c;
    //             emRec.Nature_of_Job__c = wrap.employmentDetails.Nature_of_Job__c;
    //             emRec.Contact__c = wrap.employmentDetails.Contact__c;
    //             emRec.current_employement__c=wrap.employmentDetails.current_employement__c;
    //             if(wrap.employmentDetails.Id != null){
    //                 emRec.Id = wrap.employmentDetails.Id;
    //             }
    //             if(wrap.startYear != 0){
    //                 emRec.Start_Date__c = Date.newInstance(wrap.startYear, wrap.startMonth, wrap.startDay);
    //             }
    //             if(wrap.endYear != 0){
    //                 emRec.End_Date__c = Date.newInstance(wrap.endYear, wrap.endMonth, wrap.endDay);
    //             }
    //             employList.add(emRec);
    //         }
    //         system.debug('employList ::'+employList);
    //         upsert employList;
    //         system.debug('employList ::'+employList);
    
    //         return 'success';
    //     }catch(Exception e){
    //         system.debug('eror ::'+e.getMessage() +e.getLineNumber());
    //         return e.getMessage() + e.getLineNumber();
    //     }
    // }
    
    // public class employmentWrapper{
    //     public Employment_Details__c employmentDetails;
    //     public Integer startYear;
    //     public Integer startMonth;
    //     public Integer startDay;
    //     public Integer endYear;
    //     public Integer endMonth;
    //     public Integer endDay; 
    // }
    
    public static  void deleteEmployment(string empId){
        delete new Employment_Details__c(id=empId);
    }
    
    public static Contact getParentOrgDetails(string hashcode){
        try{
            Contact conAccRecord = [SELECT Id,Login_Hash_Code__c,AccountId,Account.Name,Account.BillingStreet,Account.BillingCity,Account.BillingCountry,Account.BillingState,Account.BillingPostalCode,
                                    Account.Email__c,Account.Homepage_URL__c,Account.Organisation_Posrt__c,Account.Name_of_Mentor__c,Account.Designation_Position_of_the_Mentor__c,
                                    Account.Mentor_contact_number__c,Account.Mentor_E_mail_Id__c From Contact Where Login_Hash_Code__c =: hashcode];
            return conAccRecord;
        }catch(Exception e){
            return null;
        }
    }
    
    public static string updateconAccDetails(Account conAccDetails){
        try{
            system.debug('conAccDetails ::'+conAccDetails);
            conAccDetails.BillingState = conAccDetails.Shipping_State__c;
            upsert conAccDetails;
            return 'success';
        }catch(Exception e){
            return e.getMessage() + e.getLineNumber();
        }
    }
    
    public static Achievement__c getAchievements(string hashcode,string apaId){
        try{
            List<Achievement__c> achieveRecord = [SELECT id,contact__c,Awards_Honours__c,List_of_Publications__c,List_of_Patents_filed__c,Book_Chapters__c,Any_other_achievements__c FROM Achievement__c where contact__r.Login_Hash_Code__c=:hashcode AND Applicant_Proposal_Association__c=:apaId];
            if(achieveRecord.size() > 0){
                return achieveRecord[0];
            }
            return null;
        }catch(Exception e){
            system.debug('error ::'+e.getMessage() + e.getLineNumber());
            return null;
        }
    }
    
    public static string updateAchievements(Achievement__c achievementList,string apaId){
        try{
            achievementList.Applicant_Proposal_Association__c=apaId;
            upsert achievementList;
            return 'success';
        }catch(Exception e){
            return e.getMessage() + e.getLineNumber();
        }
    }
    
    public static Contact getDeclarationfields(string hashcode){
        try{
            Contact conRec = [SELECT Id,Name,Declaration_Sign_Date__c FROM Contact WHERE Login_Hash_Code__c=: hashcode or Id=:hashcode];
            return conRec;
        }catch(Exception e){
            return null;
        }
    }
    
    public static string upsertSign(Contact conDetails,integer year,integer month,integer day){
        try{
            if(year == 0 && month == 0 && day == 0){
                
            }else{
                Date newDate=Date.newInstance(year,month,day);
                conDetails.Declaration_Sign_Date__c=newDate;
            }
            conDetails.Status__c = 'Draft';
            update conDetails;
            return 'Success';
        }catch(Exception e){
            return e.getMessage() + e.getLineNumber();
        }
    }
    
    public static string submitPartner2plus2(Contact conDetails,integer year,integer month,integer day){
        try{
            if(year == 0 && month == 0 && day == 0){
                
            }else{
                Date newDate=Date.newInstance(year,month,day);
                conDetails.Declaration_Sign_Date__c=newDate;
            }
            conDetails.Status__c = !conDetails.isPrimary_Contact__c ? 'Submitted' : conDetails.Status__c;
            update conDetails;
            return 'Success';
        }catch(Exception e){
            return e.getMessage() + e.getLineNumber();
        }
    }
    
    public static String submit2plus2(Contact conDetails, Integer year, Integer month, Integer day, String proposalId){
        try {
            // Set date if provided
            if(!(year == 0 && month == 0 && day == 0)){
                Date newDate = Date.newInstance(year, month, day);
                conDetails.Declaration_Sign_Date__c = newDate;
            }
            
            system.debug('Inside submit2plus2');
            
            // STEP 1: Get all Contact IDs linked to this Proposal
            List<Applicant_Proposal_Association__c> apaList = [
                SELECT Contact__c 
                FROM Applicant_Proposal_Association__c 
                WHERE Proposals__c = :proposalId
            ];
            
            Set<Id> partnerContactIds = new Set<Id>();
            for (Applicant_Proposal_Association__c apa : apaList) {
                partnerContactIds.add(apa.Contact__c);
            }
            
            system.debug('Partner Contact IDs = ' + partnerContactIds);
            
            // STEP 2: Get partners’ status
            List<Contact> partnerContacts = [
                SELECT Id, Status__c 
                FROM Contact 
                WHERE Id IN :partnerContactIds
            ];
            
            // STEP 3: Check if all have submitted
            Boolean allSubmitted = true;
            for (Contact c : partnerContacts) {
                if (c.Id != conDetails.Id && c.Status__c != 'Submitted') {
                    allSubmitted = false;
                    break;
                }
            }
            
            if (allSubmitted) {
                system.debug('All partners submitted');
                
                Application_Proposal__c prop = new Application_Proposal__c(Id = proposalId);
                prop.Proposal_Stages__c = 'Submitted';
                prop.Submitted__c = true;
                update prop;
                
                conDetails.Status__c = 'Submitted';
                update conDetails;
                
                return 'Success';
            } 
            else {
                system.debug('Partial submit');
                
                conDetails.Status__c = 'Draft';
                update conDetails;
                
                return 'Partial Success';
            }
        }
        catch (Exception e) {
            return e.getMessage() + ' Line: ' + e.getLineNumber();
        }
    }
    
    
    
    
    /*    public static string submit2plus2(Contact conDetails,integer year,integer month,integer day, string proposalID){
try{
if(year == 0 && month == 0 && day == 0){

}else{
Date newDate=Date.newInstance(year,month,day);
conDetails.Declaration_Sign_Date__c=newDate;
}
system.debug('Inside submit2plus2');

//Added by Aman on 5th September
//Desc: Check if the all the Partners have already submitted the Application or not
Boolean allPartSubmitted = true;
for(Contact con : [SELECT ID, Status__c FROM Contact WHERE Proposals__c =:ProposalId]){
system.debug('for');
if(con.Id != conDetails.Id && con.Status__c != 'Submitted'){
allPartSubmitted = false;
break;
}
}
if(allPartSubmitted){
system.debug('Submitted');
Application_Proposal__c prop=new Application_Proposal__c(Id=ProposalId);
prop.Proposal_Stages__c='Submitted';
prop.Submitted__c = true;
update prop;
conDetails.Status__c = 'Submitted';
update conDetails;
return 'Success';
} else {
system.debug('Inside Draft');
conDetails.Status__c = 'Draft';
update conDetails;
return 'Partial Success';
}
}catch(Exception e){
return e.getMessage() + e.getLineNumber();
}
}

*/
    public static list<UserDocumentWrapper> getReviewerUserDoc(id parentId) {
        try{
            list<UserDocumentWrapper> udWrapperList = New List<UserDocumentWrapper>();
            map<string,ContentDocumentLink> userDocIdXcdLink = New map<string,ContentDocumentLink>();
            map<string,ContentDistribution> userDocIdXcDistrbtn = New map<string,ContentDistribution>();
            
            map<string,User_Document__c> idXUserDoc = New Map<string,User_Document__c>();
            map<string,ContentDocumentLink> udIdXcdLink = New Map<string,ContentDocumentLink>();
            list<User_Document__c> getUserDoc;
            if(parentId.getSObjectType().getDescribe().getName() == 'Reviewer__c'){
                getUserDoc = [select name,id,Status__c from User_Document__c where Contact__c =:parentId];
            }
            // if(parentId.getSObjectType().getDescribe().getName() == 'Application_Proposal__c'){
            //     getUserDoc = [select name,id,Status__c from User_Document__c where Proposals__c =:parentId];
            // }
            system.debug('getUserDoc----'+getUserDoc);
            set<string> userDocIdSet = New set<string>();
            for(User_Document__c userDoc:getUserDoc){
                userDocIdSet.add(userDoc.id);
                idXUserDoc.put(userDoc.Id,userDoc);
            }
            
            list<ContentDocumentLink> allDocuments = [SELECT Id, LinkedEntityId, ContentDocumentId, Visibility, IsDeleted, ShareType,
                                                      ContentDocument.Title, ContentDocument.createdDate, ContentDocument.FileType FROM ContentDocumentLink WHERE LinkedEntityId =:userDocIdSet order by ContentDocument.createdDate];
            List<ContentDistribution> ContentDistrbtn = [SELECT DistributionPublicUrl,PdfDownloadUrl,RelatedRecordId FROM ContentDistribution where RelatedRecordId IN :userDocIdSet order by CreatedDate];
            system.debug('allDocuments---'+allDocuments);
            system.debug('ContentDistrbtn---'+ContentDistrbtn);
            set<string> allDocId = New set<string>();    
            for(ContentDocumentLink doc:allDocuments){
                system.debug('doc--'+doc.Id);
                userDocIdXcdLink.put(doc.LinkedEntityId,doc);
                allDocId.add(doc.ContentDocumentId);  
            }
            
            for(ContentDistribution doc:ContentDistrbtn){
                userDocIdXcDistrbtn.put(doc.RelatedRecordId,doc);
            }
            
            for(string userDocId:userDocIdSet ){
                udIdXcdLink.put(userDocId,userDocIdXcdLink.get(userDocId));
            }
            Map<string,ContentDocumentLink> docNameXcVersion = New Map<string,ContentDocumentLink>();
            
            Map<string,ContentVersion> cdocIdXcVersion = New Map<string,ContentVersion>();
            ContentVersion[] cvs = [SELECT Id, Title, ContentDocumentId from  contentversion where isLatest=true and ContentDocumentId IN :allDocId order by CreatedDate];
            system.debug('cvs--'+cvs);
            for(ContentVersion doc :cvs){
                cdocIdXcVersion.put(doc.ContentDocumentId,doc);
            }
            system.debug('cdocIdXcVersion--'+cdocIdXcVersion);
            for(string udId: userDocIdSet){
                system.debug('udId----------'+udId);
                UserDocumentWrapper udWrapper = New UserDocumentWrapper();
                udWrapper.userDocument = idXUserDoc.get(udId);
                System.debug('@@@@@'+userDocIdXcdLink.get(udId) );
                
                if(userDocIdXcdLink.get(udId) != null){
                    System.debug('@@@@@-----------'+cdocIdXcVersion.get(userDocIdXcdLink.get(udId).ContentDocumentId));
                    udWrapper.contentVersion = cdocIdXcVersion.get(userDocIdXcdLink.get(udId).ContentDocumentId) ;
                }
                if(userDocIdXcDistrbtn.get(udId) != null){
                    System.debug('@@@@@-----------'+userDocIdXcDistrbtn.get(udId));
                    udWrapper.ContentDistribution = userDocIdXcDistrbtn.get(udId) ;
                }
                udWrapperList.add(udWrapper);
            }
            return udWrapperList;
        }catch(Exception e){
            //HandleBusinessException.captureError('CandidateDashboard_Helper', 'getAllUserDoc', e);
            system.debug(e.getLineNumber()+'-----get Message----'+e.getMessage());
            return null;
        }
    }
    /*public static list<UserDocumentWrapper> getContactUserDoc(id parentId) {
try{
list<UserDocumentWrapper> udWrapperList = New List<UserDocumentWrapper>();
map<string,ContentDocumentLink> userDocIdXcdLink = New map<string,ContentDocumentLink>();
map<string,ContentDistribution> userDocIdXcDistrbtn = New map<string,ContentDistribution>();

map<string,User_Document__c> idXUserDoc = New Map<string,User_Document__c>();
map<string,ContentDocumentLink> udIdXcdLink = New Map<string,ContentDocumentLink>();
list<User_Document__c> getUserDoc;
if(parentId.getSObjectType().getDescribe().getName() == 'Contact'){
getUserDoc = [select name,id,Status__c,Attachment_Name__c,(select id from attachments order by createdDate DESC) from User_Document__c where Contact__c =:parentId];
}
// if(parentId.getSObjectType().getDescribe().getName() == 'Application_Proposal__c'){
//     getUserDoc = [select name,id,Status__c from User_Document__c where Proposals__c =:parentId];
// }
system.debug('getUserDoc----'+getUserDoc);
set<string> userDocIdSet = New set<string>();
for(User_Document__c userDoc:getUserDoc){
userDocIdSet.add(userDoc.id);
idXUserDoc.put(userDoc.Id,userDoc);
}

list<ContentDocumentLink> allDocuments = [SELECT Id, LinkedEntityId, ContentDocumentId, Visibility, IsDeleted, ShareType,
ContentDocument.Title, ContentDocument.createdDate, ContentDocument.FileType FROM ContentDocumentLink WHERE LinkedEntityId =:userDocIdSet order by ContentDocument.createdDate];
List<ContentDistribution> ContentDistrbtn = [SELECT DistributionPublicUrl,PdfDownloadUrl,RelatedRecordId FROM ContentDistribution where RelatedRecordId IN :userDocIdSet order by CreatedDate];
system.debug('allDocuments---'+allDocuments);
system.debug('ContentDistrbtn---'+ContentDistrbtn);
set<string> allDocId = New set<string>();    
for(ContentDocumentLink doc:allDocuments){
system.debug('doc--'+doc.Id);
userDocIdXcdLink.put(doc.LinkedEntityId,doc);
allDocId.add(doc.ContentDocumentId);  
}

for(ContentDistribution doc:ContentDistrbtn){
userDocIdXcDistrbtn.put(doc.RelatedRecordId,doc);
}

for(string userDocId:userDocIdSet ){
udIdXcdLink.put(userDocId,userDocIdXcdLink.get(userDocId));
}
Map<string,ContentDocumentLink> docNameXcVersion = New Map<string,ContentDocumentLink>();

Map<string,ContentVersion> cdocIdXcVersion = New Map<string,ContentVersion>();
ContentVersion[] cvs = [SELECT Id, Title, ContentDocumentId from  contentversion where isLatest=true and ContentDocumentId IN :allDocId order by CreatedDate];
system.debug('cvs--'+cvs);
for(ContentVersion doc :cvs){
cdocIdXcVersion.put(doc.ContentDocumentId,doc);
}
system.debug('cdocIdXcVersion--'+cdocIdXcVersion);
for(string udId: userDocIdSet){
system.debug('udId----------'+udId);
UserDocumentWrapper udWrapper = New UserDocumentWrapper();
udWrapper.userDocument = idXUserDoc.get(udId);
System.debug('@@@@@'+userDocIdXcdLink.get(udId) );

if(userDocIdXcdLink.get(udId) != null){
System.debug('@@@@@-----------'+cdocIdXcVersion.get(userDocIdXcdLink.get(udId).ContentDocumentId));
udWrapper.contentVersion = cdocIdXcVersion.get(userDocIdXcdLink.get(udId).ContentDocumentId) ;
}
if(userDocIdXcDistrbtn.get(udId) != null){
System.debug('@@@@@-----------'+userDocIdXcDistrbtn.get(udId));
udWrapper.ContentDistribution = userDocIdXcDistrbtn.get(udId) ;
}
udWrapperList.add(udWrapper);
}
return udWrapperList;
}catch(Exception e){
//HandleBusinessException.captureError('CandidateDashboard_Helper', 'getAllUserDoc', e);
system.debug(e.getLineNumber()+'-----get Message----'+e.getMessage());
return null;
}
}*/
    
    public list<UserDocumentWrapper> getContactUserDoc(id parentId, Id proposalId) {
        try{
            //   proposalId = 'a04e10000007iE1AAI';
            System.debug('parentId--'+parentId + '---proposalId--'+proposalId);
            list<UserDocumentWrapper> udWrapperList = New List<UserDocumentWrapper>();
            map<string,ContentDocumentLink> userDocIdXcdLink = New map<string,ContentDocumentLink>();
            map<string,ContentDistribution> userDocIdXcDistrbtn = New map<string,ContentDistribution>();
            
            map<string,User_Document__c> idXUserDoc = New Map<string,User_Document__c>();
            map<string,ContentDocumentLink> udIdXcdLink = New Map<string,ContentDocumentLink>();
            list<User_Document__c> getUserDoc;
            
            if(parentId.getSObjectType().getDescribe().getName() == 'Contact' && proposalId != null){
                getUserDoc = [SELECT name,id,Status__c,Attachment_Name__c,(select id from attachments order by createdDate DESC) from User_Document__c
                              WHERE Applicant_Proposal_Association__c IN (SELECT Id from Applicant_Proposal_Association__c WHERE Proposals__c =:proposalId AND Contact__c =:parentId)];
            }
            
            system.debug('getUserDoc----'+getUserDoc);
            set<string> userDocIdSet = New set<string>();
            for(User_Document__c userDoc:getUserDoc){
                userDocIdSet.add(userDoc.id);
                idXUserDoc.put(userDoc.Id,userDoc);
            }
            
            list<ContentDocumentLink> allDocuments = new list<ContentDocumentLink>();
            if(!userDocIdSet.isEmpty()) {
                allDocuments = [SELECT Id, LinkedEntityId, ContentDocumentId, Visibility, IsDeleted, ShareType,  
                                ContentDocument.Title, ContentDocument.createdDate, ContentDocument.FileType
                                FROM ContentDocumentLink WHERE LinkedEntityId IN :userDocIdSet order by ContentDocument.createdDate];
            }
            
            List<ContentDistribution> ContentDistrbtn = new List<ContentDistribution>();
            if(!userDocIdSet.isEmpty()) {
                ContentDistrbtn = [SELECT DistributionPublicUrl,PdfDownloadUrl,RelatedRecordId
                                   FROM ContentDistribution where RelatedRecordId IN :userDocIdSet order by CreatedDate];
            }
            
            system.debug('allDocuments---'+allDocuments);
            system.debug('ContentDistrbtn---'+ContentDistrbtn);
            set<string> allDocId = New set<string>();    
            for(ContentDocumentLink doc:allDocuments){
                system.debug('doc--'+doc.Id);
                userDocIdXcdLink.put(doc.LinkedEntityId,doc);
                allDocId.add(doc.ContentDocumentId);  
            }
            
            for(ContentDistribution doc:ContentDistrbtn){
                userDocIdXcDistrbtn.put(doc.RelatedRecordId,doc);
            }
            
            for(string userDocId:userDocIdSet ){
                udIdXcdLink.put(userDocId,userDocIdXcdLink.get(userDocId));
            }
            Map<string,ContentDocumentLink> docNameXcVersion = New Map<string,ContentDocumentLink>();
            
            // FIX: Check if allDocId is not empty before querying
            Map<string,ContentVersion> cdocIdXcVersion = New Map<string,ContentVersion>();
            ContentVersion[] cvs = new ContentVersion[]{};
                if(!allDocId.isEmpty()) {
                    cvs = [SELECT Id, Title, ContentDocumentId from contentversion
                           where isLatest=true and ContentDocumentId IN :allDocId order by CreatedDate];
                    for(ContentVersion doc :cvs){
                        cdocIdXcVersion.put(doc.ContentDocumentId,doc);
                    }
                }
            
            system.debug('cdocIdXcVersion--'+cdocIdXcVersion);
            for(string udId: userDocIdSet){
                system.debug('udId----------'+udId);
                UserDocumentWrapper udWrapper = New UserDocumentWrapper();
                udWrapper.userDocument = idXUserDoc.get(udId);
                System.debug('@@@@@'+userDocIdXcdLink.get(udId) );
                
                if(userDocIdXcdLink.get(udId) != null){
                    System.debug('@@@@@-----------'+cdocIdXcVersion.get(userDocIdXcdLink.get(udId).ContentDocumentId));
                    udWrapper.contentVersion = cdocIdXcVersion.get(userDocIdXcdLink.get(udId).ContentDocumentId) ;
                }
                if(userDocIdXcDistrbtn.get(udId) != null){
                    System.debug('@@@@@-----------'+userDocIdXcDistrbtn.get(udId));
                    udWrapper.ContentDistribution = userDocIdXcDistrbtn.get(udId) ;
                }
                udWrapperList.add(udWrapper);
            }
            System.debug('udWrapperList --'+udWrapperList);
            return udWrapperList;
        } catch(Exception e) {
            system.debug(e.getLineNumber()+'-----get Message----'+e.getMessage());
            return null;
        }
    }
    
    // UPDATED METHOD FOR WORKSHOP 
    /*     
public static list<UserDocumentWrapper> getAllUserDoc(string hashcode) {
try{
System.debug('=============== getAllUserDoc ==================');
System.debug('hashcode : ' + hashcode);

List<UserDocumentWrapper> udWrapperList = new List<UserDocumentWrapper>();
Map<String, ContentDocumentLink> userDocIdXcdLink = new Map<String, ContentDocumentLink>();
Map<String, ContentDistribution> userDocIdXcDistrbtn = new Map<String, ContentDistribution>();

Map<String, User_Document__c> idXUserDoc = new Map<String, User_Document__c>();
Map<String,ContentDocumentLink> udIdXcdLink = New Map<String,ContentDocumentLink>();

Id contactIdUsed;
Id proposalIdUsed;
Set<String> userDocIdSet = new Set<String>();

Contact conRec = [
SELECT Id, Name
FROM Contact
WHERE Login_Hash_Code__c = :hashcode
LIMIT 1
];
System.debug('conRec : ' + conRec);

if (conRec != null) {

List<Applicant_Proposal_Association__c> apaList = [
SELECT Id, Proposals__c, Contact__c
FROM Applicant_Proposal_Association__c
WHERE Contact__c = :conRec.Id
LIMIT 1
];
System.debug('apaList size: ' + apaList.size());

if (!apaList.isEmpty()) {

proposalIdUsed = apaList[0].Proposals__c;
System.debug('Proposal ID: ' + proposalIdUsed);

Application_Proposal__c proposalRec = [
SELECT Id, Name
FROM Application_Proposal__c
WHERE Id = :proposalIdUsed
LIMIT 1
];

// 4. Fetch Applicant Contacts for this Proposal - NEW MODEL (via APA)
List<Contact> applicantContacts = [
SELECT Id, Name, Applicant_Host__c
FROM Contact
WHERE Applicant_Host__c = 'Applicant'
AND Id IN (
SELECT Contact__c
FROM Applicant_Proposal_Association__c
WHERE Proposals__c = :proposalIdUsed
)
LIMIT 1
];

if (!applicantContacts.isEmpty()) {
contactIdUsed = applicantContacts[0].Id;
System.debug('Applicant Contact Used = ' + contactIdUsed);
} else {
System.debug('No applicant contacts found for proposal');
}
}
}

// Fetch User Documents using New Contact + Proposal            
if (proposalIdUsed != null || contactIdUsed != null) {

List<User_Document__c> getUserDoc = [
SELECT Id, Name, Status__c, Attachment_Name__c,
(SELECT Id FROM Attachments ORDER BY CreatedDate DESC)
FROM User_Document__c
WHERE (Proposals__c = :proposalIdUsed
OR Contact__c = :contactIdUsed)
];
System.debug('getUserDoc: ' + getUserDoc);

for (User_Document__c userDoc : getUserDoc) {
userDocIdSet.add(userDoc.Id);
idXUserDoc.put(userDoc.Id, userDoc);
}
}

List<ContentDocumentLink> allDocuments = [
SELECT Id, LinkedEntityId, ContentDocumentId, Visibility, IsDeleted, ShareType,
ContentDocument.Title, ContentDocument.createdDate, ContentDocument.FileType 
FROM ContentDocumentLink 
WHERE LinkedEntityId =: userDocIdSet 
ORDER BY ContentDocument.CreatedDate];

List<ContentDistribution> ContentDistrbtn = [
SELECT DistributionPublicUrl,PdfDownloadUrl,RelatedRecordId 
FROM ContentDistribution where RelatedRecordId 
IN :userDocIdSet 
ORDER BY createdDate
];
System.debug('ContentDistrbtn---'+ContentDistrbtn);
System.debug('allDocuments---'+allDocuments);

Set<string> allDocId = New set<string>();     

for(ContentDocumentLink doc:allDocuments){
system.debug('doc--'+doc.Id);
userDocIdXcdLink.put(doc.LinkedEntityId,doc);
allDocId.add(doc.ContentDocumentId);  
}

for(ContentDistribution doc:ContentDistrbtn){
userDocIdXcDistrbtn.put(doc.RelatedRecordId,doc);
}
for(string userDocId:userDocIdSet){
udIdXcdLink.put(userDocId,userDocIdXcdLink.get(userDocId));
}

Map<String,ContentDocumentLink> docNameXcVersion = New Map<String,ContentDocumentLink>();
Map<String,ContentVersion> cdocIdXcVersion = New Map<String,ContentVersion>();

ContentVersion[] cvs = [
SELECT Id, Title, ContentDocumentId 
FROM Contentversion
WHERE isLatest = true 
AND ContentDocumentId 
IN :allDocId 
ORDER BY CreatedDate desc
];
System.debug('cvs--'+cvs);

for(ContentVersion doc :cvs){
cdocIdXcVersion.put(doc.ContentDocumentId,doc);
}
System.debug('cdocIdXcVersion--'+cdocIdXcVersion);

for(string udId: userDocIdSet){
system.debug('udId----------'+udId);
UserDocumentWrapper udWrapper = New UserDocumentWrapper();
udWrapper.userDocument = idXUserDoc.get(udId);
System.debug('@@@@@'+userDocIdXcdLink.get(udId) );

if(userDocIdXcdLink.get(udId) != null){
System.debug('@@@@@-----------'+cdocIdXcVersion.get(userDocIdXcdLink.get(udId).ContentDocumentId));
udWrapper.contentVersion = cdocIdXcVersion.get(userDocIdXcdLink.get(udId).ContentDocumentId) ;
}
if(userDocIdXcDistrbtn.get(udId) != null){
System.debug('@@@@@-----------'+userDocIdXcDistrbtn.get(udId));
udWrapper.ContentDistribution = userDocIdXcDistrbtn.get(udId) ;
}
system.debug('udWrapper---'+udWrapper);
udWrapperList.add(udWrapper);
}
return udWrapperList;
}catch(Exception e){
//HandleBusinessException.captureError('CandidateDashboard_Helper', 'getAllUserDoc', e);
system.debug(e.getLineNumber()+'-----get Message----'+e.getMessage());
return null;
}
}
*/
    
    // UPDATED METHOD FOR WORKSHOP USING PROPOSALID 
    public static list<UserDocumentWrapper> getAllUserDoc(String proposalId) {
        try{
            System.debug('=============== getAllUserDoc ==================');
            System.debug('proposalId : ' + proposalId);
            
            List<UserDocumentWrapper> udWrapperList = new List<UserDocumentWrapper>();
            Map<String, ContentDocumentLink> userDocIdXcdLink = new Map<String, ContentDocumentLink>();
            Map<String, ContentDistribution> userDocIdXcDistrbtn = new Map<String, ContentDistribution>();
            
            Map<String, User_Document__c> idXUserDoc = new Map<String, User_Document__c>();
            Map<String,ContentDocumentLink> udIdXcdLink = New Map<String,ContentDocumentLink>();
            
            /*
Id contactIdUsed;
List<Application_Proposal__c> proposalList = [
SELECT Id, Name, 
(SELECT Id, Name, Applicant_Host__c 
FROM Contacts__r 
WHERE Applicant_Host__c = 'Applicant') 
FROM Application_Proposal__c WHERE Id =:proposalId
];

if (!proposalList.isEmpty() && !proposalList[0].Contacts__r.isEmpty()) {
contactIdUsed = proposalList[0].Contacts__r[0].Id;
} else {
System.debug('No contacts found for the specified Application Proposal.');
}
*/
            
            Id contactIdUsed;
            List<Applicant_Proposal_Association__c> apaList = [
                SELECT Id, Name, Proposals__c, Contact__c, Contact__r.Applicant_Host__c
                FROM Applicant_Proposal_Association__c
                WHERE Proposals__c = :proposalId
                AND Contact__r.Applicant_Host__c = 'Applicant'
            ];
            
            if (!apaList.isEmpty() && apaList[0].Contact__r.Applicant_Host__c != null) {
                contactIdUsed = apaList[0].Contact__c;
            } else {
                System.debug('No contacts found for the specified Application Proposal.');
            }
            
            
            
            List<User_Document__c> getUserDoc = [
                SELECT Name, Id, Status__c, Attachment_Name__c, 
                (SELECT Id FROM Attachments ORDER BY CreatedDate DESC) 
                FROM User_Document__c 
                WHERE (Proposals__c =:proposalId OR Contact__c =:contactIdUsed )
            ];
            System.debug('getUserDoc----'+getUserDoc);
            
            Set<string> userDocIdSet = new Set<string>();
            
            for(User_Document__c userDoc:getUserDoc){
                userDocIdSet.add(userDoc.id);
                idXUserDoc.put(userDoc.Id,userDoc);
            }
            
            List<ContentDocumentLink> allDocuments = [
                SELECT Id, LinkedEntityId, ContentDocumentId, Visibility, IsDeleted, ShareType,
                ContentDocument.Title, ContentDocument.createdDate, ContentDocument.FileType 
                FROM ContentDocumentLink 
                WHERE LinkedEntityId =: userDocIdSet 
                ORDER BY ContentDocument.CreatedDate];
            
            List<ContentDistribution> ContentDistrbtn = [
                SELECT DistributionPublicUrl,PdfDownloadUrl,RelatedRecordId 
                FROM ContentDistribution where RelatedRecordId 
                IN :userDocIdSet 
                ORDER BY createdDate
            ];
            System.debug('ContentDistrbtn---'+ContentDistrbtn);
            System.debug('allDocuments---'+allDocuments);
            
            Set<string> allDocId = New set<string>();     
            
            for(ContentDocumentLink doc:allDocuments){
                system.debug('doc--'+doc.Id);
                userDocIdXcdLink.put(doc.LinkedEntityId,doc);
                allDocId.add(doc.ContentDocumentId);  
            }
            
            for(ContentDistribution doc:ContentDistrbtn){
                userDocIdXcDistrbtn.put(doc.RelatedRecordId,doc);
            }
            for(string userDocId:userDocIdSet){
                udIdXcdLink.put(userDocId,userDocIdXcdLink.get(userDocId));
            }
            
            Map<String,ContentDocumentLink> docNameXcVersion = New Map<String,ContentDocumentLink>();
            Map<String,ContentVersion> cdocIdXcVersion = New Map<String,ContentVersion>();
            
            ContentVersion[] cvs = [
                SELECT Id, Title, ContentDocumentId 
                FROM Contentversion
                WHERE isLatest = true 
                AND ContentDocumentId 
                IN :allDocId 
                ORDER BY CreatedDate desc
            ];
            System.debug('cvs--'+cvs);
            
            for(ContentVersion doc :cvs){
                cdocIdXcVersion.put(doc.ContentDocumentId,doc);
            }
            System.debug('cdocIdXcVersion--'+cdocIdXcVersion);
            
            for(string udId: userDocIdSet){
                system.debug('udId----------'+udId);
                UserDocumentWrapper udWrapper = New UserDocumentWrapper();
                udWrapper.userDocument = idXUserDoc.get(udId);
                System.debug('@@@@@'+userDocIdXcdLink.get(udId) );
                
                if(userDocIdXcdLink.get(udId) != null){
                    System.debug('@@@@@-----------'+cdocIdXcVersion.get(userDocIdXcdLink.get(udId).ContentDocumentId));
                    udWrapper.contentVersion = cdocIdXcVersion.get(userDocIdXcdLink.get(udId).ContentDocumentId) ;
                }
                if(userDocIdXcDistrbtn.get(udId) != null){
                    System.debug('@@@@@-----------'+userDocIdXcDistrbtn.get(udId));
                    udWrapper.ContentDistribution = userDocIdXcDistrbtn.get(udId) ;
                }
                system.debug('udWrapper---'+udWrapper);
                udWrapperList.add(udWrapper);
            }
            return udWrapperList;
        }catch(Exception e){
            //HandleBusinessException.captureError('CandidateDashboard_Helper', 'getAllUserDoc', e);
            system.debug(e.getLineNumber()+'-----get Message----'+e.getMessage());
            return null;
        }
    }
    
    
    // OLD METHOD
    // public static list<UserDocumentWrapper> getAllUserDoc(string parentId) {
    //     try{
    //         list<UserDocumentWrapper> udWrapperList = New List<UserDocumentWrapper>();
    //         map<string,ContentDocumentLink> userDocIdXcdLink = New map<string,ContentDocumentLink>();
    //         map<string,ContentDistribution> userDocIdXcDistrbtn = New map<string,ContentDistribution>();
    
    //         map<string,User_Document__c> idXUserDoc = New Map<string,User_Document__c>();
    //         map<string,ContentDocumentLink> udIdXcdLink = New Map<string,ContentDocumentLink>();
    
    //         Id contactIdUsed;
    //         List<Application_Proposal__c> proposalList = [SELECT Id, Name, (SELECT Id, Name, Applicant_Host__c FROM Contacts__r WHERE Applicant_Host__c = 'Applicant') FROM Application_Proposal__c WHERE Id =:parentId];
    //         if (!proposalList.isEmpty() && !proposalList[0].Contacts__r.isEmpty()) {
    //             contactIdUsed = proposalList[0].Contacts__r[0].Id;
    //         } else {
    //             System.debug('No contacts found for the specified Application Proposal.');
    //         }
    //         list<User_Document__c> getUserDoc = [select name,id,Status__c, Attachment_Name__c, (select id from attachments order by createdDate DESC) from User_Document__c where (Proposals__c =:parentId OR Contact__c =:contactIdUsed ) ];
    //         system.debug('getUserDoc----'+getUserDoc);
    //         set<string> userDocIdSet = New set<string>();
    //         for(User_Document__c userDoc:getUserDoc){
    //             userDocIdSet.add(userDoc.id);
    //             idXUserDoc.put(userDoc.Id,userDoc);
    //         }
    
    //         list<ContentDocumentLink> allDocuments = [SELECT Id, LinkedEntityId, ContentDocumentId, Visibility, IsDeleted, ShareType,
    //                                                   ContentDocument.Title, ContentDocument.createdDate, ContentDocument.FileType FROM ContentDocumentLink WHERE LinkedEntityId =:userDocIdSet order by ContentDocument.createdDate];
    //         List<ContentDistribution> ContentDistrbtn = [SELECT DistributionPublicUrl,PdfDownloadUrl,RelatedRecordId FROM ContentDistribution where RelatedRecordId IN :userDocIdSet ORDER BY createdDate];
    //         system.debug('ContentDistrbtn---'+ContentDistrbtn);
    //         system.debug('allDocuments---'+allDocuments);
    //         set<string> allDocId = New set<string>();     
    //         for(ContentDocumentLink doc:allDocuments){
    //             system.debug('doc--'+doc.Id);
    //             userDocIdXcdLink.put(doc.LinkedEntityId,doc);
    //             allDocId.add(doc.ContentDocumentId);  
    //         }
    //         for(ContentDistribution doc:ContentDistrbtn){
    //             userDocIdXcDistrbtn.put(doc.RelatedRecordId,doc);
    //         }
    //         for(string userDocId:userDocIdSet){
    //             udIdXcdLink.put(userDocId,userDocIdXcdLink.get(userDocId));
    //         }
    //         Map<string,ContentDocumentLink> docNameXcVersion = New Map<string,ContentDocumentLink>();
    
    //         Map<string,ContentVersion> cdocIdXcVersion = New Map<string,ContentVersion>();
    //         ContentVersion[] cvs = [SELECT Id, Title, ContentDocumentId from  contentversion where isLatest=true and ContentDocumentId IN :allDocId order by CreatedDate desc];
    //         system.debug('cvs--'+cvs);
    //         for(ContentVersion doc :cvs){
    //             cdocIdXcVersion.put(doc.ContentDocumentId,doc);
    //         }
    
    
    
    
    //         system.debug('cdocIdXcVersion--'+cdocIdXcVersion);
    //         for(string udId: userDocIdSet){
    //             system.debug('udId----------'+udId);
    //             UserDocumentWrapper udWrapper = New UserDocumentWrapper();
    //             udWrapper.userDocument = idXUserDoc.get(udId);
    //             System.debug('@@@@@'+userDocIdXcdLink.get(udId) );
    
    //             if(userDocIdXcdLink.get(udId) != null){
    //                 System.debug('@@@@@-----------'+cdocIdXcVersion.get(userDocIdXcdLink.get(udId).ContentDocumentId));
    //                 udWrapper.contentVersion = cdocIdXcVersion.get(userDocIdXcdLink.get(udId).ContentDocumentId) ;
    //             }
    //             if(userDocIdXcDistrbtn.get(udId) != null){
    //                 System.debug('@@@@@-----------'+userDocIdXcDistrbtn.get(udId));
    //                 udWrapper.ContentDistribution = userDocIdXcDistrbtn.get(udId) ;
    //             }
    //             system.debug('udWrapper---'+udWrapper);
    //             udWrapperList.add(udWrapper);
    //         }
    //         return udWrapperList;
    //     }catch(Exception e){
    //         //HandleBusinessException.captureError('CandidateDashboard_Helper', 'getAllUserDoc', e);
    //         system.debug(e.getLineNumber()+'-----get Message----'+e.getMessage());
    //         return null;
    //     }
    // }
    
    public static list<ProposalDocumentWrapper> getAllProposalDoc(string parentId) {
        try{
            list<ProposalDocumentWrapper> udWrapperList = New List<ProposalDocumentWrapper>();
            map<string,ContentDocumentLink> userDocIdXcdLink = New map<string,ContentDocumentLink>();
            map<string,ContentDistribution> userDocIdXcDistrbtn = New map<string,ContentDistribution>();
            
            map<string,Proposal_Document__c> idXUserDoc = New Map<string,Proposal_Document__c>();
            map<string,ContentDocumentLink> udIdXcdLink = New Map<string,ContentDocumentLink>();
            list<Proposal_Document__c> getUserDoc = [select name,id,Status__c,Category_Template__r.Document_Public_Link__c,(select id from attachments order by createdDate DESC) from Proposal_Document__c where Proposals__c =:parentId];
            system.debug('getUserDoc----'+getUserDoc);
            set<string> userDocIdSet = New set<string>();
            for(Proposal_Document__c userDoc:getUserDoc){
                userDocIdSet.add(userDoc.id);
                idXUserDoc.put(userDoc.Id,userDoc);
            }
            
            list<ContentDocumentLink> allDocuments = [SELECT Id, LinkedEntityId, ContentDocumentId, Visibility, IsDeleted, ShareType,
                                                      ContentDocument.Title, ContentDocument.createdDate, ContentDocument.FileType FROM ContentDocumentLink WHERE LinkedEntityId =:userDocIdSet];
            List<ContentDistribution> ContentDistrbtn = [SELECT DistributionPublicUrl,PdfDownloadUrl,RelatedRecordId FROM ContentDistribution where RelatedRecordId IN :userDocIdSet];
            system.debug('ContentDistrbtn---'+ContentDistrbtn);
            system.debug('allDocuments---'+allDocuments);
            set<string> allDocId = New set<string>();     
            for(ContentDocumentLink doc:allDocuments){
                system.debug('doc--'+doc.Id);
                userDocIdXcdLink.put(doc.LinkedEntityId,doc);
                allDocId.add(doc.ContentDocumentId);  
            }
            for(ContentDistribution doc:ContentDistrbtn){
                userDocIdXcDistrbtn.put(doc.RelatedRecordId,doc);
            }
            for(string userDocId:userDocIdSet){
                udIdXcdLink.put(userDocId,userDocIdXcdLink.get(userDocId));
            }
            Map<string,ContentDocumentLink> docNameXcVersion = New Map<string,ContentDocumentLink>();
            
            Map<string,ContentVersion> cdocIdXcVersion = New Map<string,ContentVersion>();
            ContentVersion[] cvs = [SELECT Id, Title, ContentDocumentId from  contentversion where isLatest=true and ContentDocumentId IN :allDocId order by CreatedDate desc];
            system.debug('cvs--'+cvs);
            for(ContentVersion doc :cvs){
                cdocIdXcVersion.put(doc.ContentDocumentId,doc);
            }
            
            
            
            
            system.debug('cdocIdXcVersion--'+cdocIdXcVersion);
            for(string udId: userDocIdSet){
                system.debug('udId----------'+udId);
                ProposalDocumentWrapper udWrapper = New ProposalDocumentWrapper();
                udWrapper.userDocument = idXUserDoc.get(udId);
                System.debug('@@@@@'+userDocIdXcdLink.get(udId) );
                
                if(userDocIdXcdLink.get(udId) != null){
                    System.debug('@@@@@-----------'+cdocIdXcVersion.get(userDocIdXcdLink.get(udId).ContentDocumentId));
                    udWrapper.contentVersion = cdocIdXcVersion.get(userDocIdXcdLink.get(udId).ContentDocumentId) ;
                }
                if(userDocIdXcDistrbtn.get(udId) != null){
                    System.debug('@@@@@-----------'+userDocIdXcDistrbtn.get(udId));
                    udWrapper.ContentDistribution = userDocIdXcDistrbtn.get(udId) ;
                }
                system.debug('udWrapper---'+udWrapper);
                udWrapperList.add(udWrapper);
            }
            return udWrapperList;
        }catch(Exception e){
            //HandleBusinessException.captureError('CandidateDashboard_Helper', 'getAllUserDoc', e);
            system.debug(e.getLineNumber()+'-----get Message----'+e.getMessage());
            return null;
        }
    }
    
    
    /*
public static list<UserDocumentWrapper> getAllUserDocSignature(string parentId) {
try{
list<UserDocumentWrapper> udWrapperList = New List<UserDocumentWrapper>();
map<string,ContentDocumentLink> userDocIdXcdLink = New map<string,ContentDocumentLink>();
map<string,ContentDistribution> userDocIdXcDistrbtn = New map<string,ContentDistribution>();

map<string,User_Document__c> idXUserDoc = New Map<string,User_Document__c>();
map<string,ContentDocumentLink> udIdXcdLink = New Map<string,ContentDocumentLink>();
list<User_Document__c> getUserDoc = [select name,id,Status__c,(select id from attachments) from User_Document__c where Proposals__c =:parentId];
system.debug('getUserDoc----'+getUserDoc);
set<string> userDocIdSet = New set<string>();
for(User_Document__c userDoc:getUserDoc){
userDocIdSet.add(userDoc.id);
idXUserDoc.put(userDoc.Id,userDoc);
}

list<ContentDocumentLink> allDocuments = [SELECT Id, LinkedEntityId, ContentDocumentId, Visibility, IsDeleted, ShareType,
ContentDocument.Title, ContentDocument.createdDate, ContentDocument.FileType FROM ContentDocumentLink WHERE LinkedEntityId =:userDocIdSet];
List<ContentDistribution> ContentDistrbtn = [SELECT DistributionPublicUrl,PdfDownloadUrl,RelatedRecordId FROM ContentDistribution where RelatedRecordId IN :userDocIdSet];
system.debug('ContentDistrbtn---'+ContentDistrbtn);
system.debug('allDocuments---'+allDocuments);
set<string> allDocId = New set<string>();     
for(ContentDocumentLink doc:allDocuments){
system.debug('doc--'+doc.Id);
userDocIdXcdLink.put(doc.LinkedEntityId,doc);
allDocId.add(doc.ContentDocumentId);  
}
for(ContentDistribution doc:ContentDistrbtn){
userDocIdXcDistrbtn.put(doc.RelatedRecordId,doc);
}
for(string userDocId:userDocIdSet){
udIdXcdLink.put(userDocId,userDocIdXcdLink.get(userDocId));
}
Map<string,ContentDocumentLink> docNameXcVersion = New Map<string,ContentDocumentLink>();

Map<string,ContentVersion> cdocIdXcVersion = New Map<string,ContentVersion>();
ContentVersion[] cvs = [SELECT Id, Title, ContentDocumentId from  contentversion where isLatest=true and ContentDocumentId IN :allDocId order by CreatedDate desc];
system.debug('cvs--'+cvs);
for(ContentVersion doc :cvs){
cdocIdXcVersion.put(doc.ContentDocumentId,doc);
}




system.debug('cdocIdXcVersion--'+cdocIdXcVersion);
for(string udId: userDocIdSet){
system.debug('udId----------'+udId);
UserDocumentWrapper udWrapper = New UserDocumentWrapper();
udWrapper.userDocument = idXUserDoc.get(udId);
System.debug('@@@@@'+userDocIdXcdLink.get(udId) );

if(userDocIdXcdLink.get(udId) != null){
System.debug('@@@@@-----------'+cdocIdXcVersion.get(userDocIdXcdLink.get(udId).ContentDocumentId));
udWrapper.contentVersion = cdocIdXcVersion.get(userDocIdXcdLink.get(udId).ContentDocumentId) ;
}
if(userDocIdXcDistrbtn.get(udId) != null){
System.debug('@@@@@-----------'+userDocIdXcDistrbtn.get(udId));
udWrapper.ContentDistribution = userDocIdXcDistrbtn.get(udId) ;
}
system.debug('udWrapper---'+udWrapper);
udWrapperList.add(udWrapper);
}
return udWrapperList;
}catch(Exception e){
//HandleBusinessException.captureError('CandidateDashboard_Helper', 'getAllUserDoc', e);
system.debug(e.getLineNumber()+'-----get Message----'+e.getMessage());
return null;
}
}

*/
    
    /*OLD Method
public static List<UserDocumentWrapper> getAllUserDocSignature(String parentId) {
try {
List<UserDocumentWrapper> udWrapperList = new List<UserDocumentWrapper>();

// Step 1: Fetch all User Documents for the Proposal
List<User_Document__c> getUserDoc = [
SELECT Name, Id, Status__c, (SELECT Id FROM Attachments)
FROM User_Document__c
WHERE Proposals__c = :parentId
];
if (getUserDoc.isEmpty()) return udWrapperList;

// Step 2: Collect all IDs
Map<String, User_Document__c> idXUserDoc = new Map<String, User_Document__c>();
Set<String> userDocIdSet = new Set<String>();
for (User_Document__c userDoc : getUserDoc) {
userDocIdSet.add(userDoc.Id);
idXUserDoc.put(userDoc.Id, userDoc);
}

// Step 3: Fetch related ContentDocumentLink records
List<ContentDocumentLink> allDocuments = [
SELECT Id, LinkedEntityId, ContentDocumentId, Visibility, IsDeleted, ShareType,
ContentDocument.Title, ContentDocument.CreatedDate, ContentDocument.FileType
FROM ContentDocumentLink
WHERE LinkedEntityId IN :userDocIdSet
];

// Step 4: Fetch ContentDistribution for each User Document
List<ContentDistribution> contentDistrbtn = [
SELECT DistributionPublicUrl, PdfDownloadUrl, RelatedRecordId
FROM ContentDistribution
WHERE RelatedRecordId IN :userDocIdSet
];

// Step 5: Map relationships
Map<String, ContentDocumentLink> userDocIdXcdLink = new Map<String, ContentDocumentLink>();
Map<String, ContentDistribution> userDocIdXcDistrbtn = new Map<String, ContentDistribution>();
Set<String> allDocId = new Set<String>();

for (ContentDocumentLink doc : allDocuments) {
userDocIdXcdLink.put(doc.LinkedEntityId, doc);
allDocId.add(doc.ContentDocumentId);
}
for (ContentDistribution dist : contentDistrbtn) {
userDocIdXcDistrbtn.put(dist.RelatedRecordId, dist);
}

// Step 6: Fetch latest ContentVersion
Map<String, ContentVersion> cdocIdXcVersion = new Map<String, ContentVersion>();
if (!allDocId.isEmpty()) {
for (ContentVersion cv : [
SELECT Id, Title, ContentDocumentId
FROM ContentVersion
WHERE IsLatest = TRUE
AND ContentDocumentId IN :allDocId
ORDER BY CreatedDate DESC
]) {
cdocIdXcVersion.put(cv.ContentDocumentId, cv);
}
}

// Step 7: Build Wrapper List
for (String udId : userDocIdSet) {
UserDocumentWrapper udWrapper = new UserDocumentWrapper();
udWrapper.userDocument = idXUserDoc.get(udId);

ContentDocumentLink cdl = userDocIdXcdLink.get(udId);
if (cdl != null && cdocIdXcVersion.containsKey(cdl.ContentDocumentId)) {
udWrapper.contentVersion = cdocIdXcVersion.get(cdl.ContentDocumentId);
}

if (userDocIdXcDistrbtn.containsKey(udId)) {
udWrapper.ContentDistribution = userDocIdXcDistrbtn.get(udId);
}

udWrapperList.add(udWrapper);
}

return udWrapperList;

} catch (Exception e) {
System.debug('Error at line ' + e.getLineNumber() + ' - ' + e.getMessage());
return new List<UserDocumentWrapper>();
}
}*/
    
    // UPDATED METHOD        
    public static list<UserDocumentWrapper> getAllUserDocSignature(string hashcode) {
        try{
            System.debug('=============== getAllUserDoc ==================');
            System.debug('hashcode : ' + hashcode);
            
            List<UserDocumentWrapper> udWrapperList = new List<UserDocumentWrapper>();
            Map<String, ContentDocumentLink> userDocIdXcdLink = new Map<String, ContentDocumentLink>();
            Map<String, ContentDistribution> userDocIdXcDistrbtn = new Map<String, ContentDistribution>();
            
            Map<String, User_Document__c> idXUserDoc = new Map<String, User_Document__c>();
            Map<String,ContentDocumentLink> udIdXcdLink = New Map<String,ContentDocumentLink>();
            
            Id contactIdUsed;
            Id proposalIdUsed;
            Set<String> userDocIdSet = new Set<String>();
            
            Contact conRec = [
                SELECT Id, Name
                FROM Contact
                WHERE Login_Hash_Code__c = :hashcode
                LIMIT 1
            ];
            System.debug('conRec : ' + conRec);
            
            if (conRec != null) {
                
                List<Applicant_Proposal_Association__c> apaList = [
                    SELECT Id, Proposals__c, Contact__c
                    FROM Applicant_Proposal_Association__c
                    WHERE Contact__c = :conRec.Id
                    LIMIT 1
                ];
                System.debug('apaList size: ' + apaList.size());
                
                if (!apaList.isEmpty()) {
                    
                    proposalIdUsed = apaList[0].Proposals__c;
                    System.debug('Proposal ID: ' + proposalIdUsed);
                    
                    Application_Proposal__c proposalRec = [
                        SELECT Id, Name
                        FROM Application_Proposal__c
                        WHERE Id = :proposalIdUsed
                        LIMIT 1
                    ];
                    
                    // 4. Fetch Applicant Contacts for this Proposal - NEW MODEL (via APA)
                    List<Contact> applicantContacts = [
                        SELECT Id, Name, Applicant_Host__c
                        FROM Contact
                        WHERE Applicant_Host__c = 'Applicant'
                        AND Id IN (
                            SELECT Contact__c
                            FROM Applicant_Proposal_Association__c
                            WHERE Proposals__c = :proposalIdUsed
                        )
                        LIMIT 1
                    ];
                    
                    if (!applicantContacts.isEmpty()) {
                        contactIdUsed = applicantContacts[0].Id;
                        System.debug('Applicant Contact Used = ' + contactIdUsed);
                    } else {
                        System.debug('No applicant contacts found for proposal');
                    }
                }
            }
            
            // Fetch User Documents using New Contact + Proposal            
            if (proposalIdUsed != null || contactIdUsed != null) {
                
                List<User_Document__c> getUserDoc = [
                    SELECT Id, Name, Status__c, Attachment_Name__c,
                    (SELECT Id FROM Attachments ORDER BY CreatedDate DESC)
                    FROM User_Document__c
                    WHERE (Proposals__c = :proposalIdUsed
                           OR Contact__c = :contactIdUsed)
                ];
                System.debug('getUserDoc: ' + getUserDoc);
                
                for (User_Document__c userDoc : getUserDoc) {
                    userDocIdSet.add(userDoc.Id);
                    idXUserDoc.put(userDoc.Id, userDoc);
                }
            }
            
            List<ContentDocumentLink> allDocuments = [
                SELECT Id, LinkedEntityId, ContentDocumentId, Visibility, IsDeleted, ShareType,
                ContentDocument.Title, ContentDocument.createdDate, ContentDocument.FileType
                FROM ContentDocumentLink
                WHERE LinkedEntityId =: userDocIdSet
                ORDER BY ContentDocument.CreatedDate];
            
            List<ContentDistribution> ContentDistrbtn = [
                SELECT DistributionPublicUrl,PdfDownloadUrl,RelatedRecordId
                FROM ContentDistribution where RelatedRecordId
                IN :userDocIdSet
                ORDER BY createdDate
            ];
            System.debug('ContentDistrbtn---'+ContentDistrbtn);
            System.debug('allDocuments---'+allDocuments);
            
            Set<string> allDocId = New set<string>();    
            
            for(ContentDocumentLink doc:allDocuments){
                system.debug('doc--'+doc.Id);
                userDocIdXcdLink.put(doc.LinkedEntityId,doc);
                allDocId.add(doc.ContentDocumentId);  
            }
            
            for(ContentDistribution doc:ContentDistrbtn){
                userDocIdXcDistrbtn.put(doc.RelatedRecordId,doc);
            }
            for(string userDocId:userDocIdSet){
                udIdXcdLink.put(userDocId,userDocIdXcdLink.get(userDocId));
            }
            
            Map<String,ContentDocumentLink> docNameXcVersion = New Map<String,ContentDocumentLink>();
            Map<String,ContentVersion> cdocIdXcVersion = New Map<String,ContentVersion>();
            
            ContentVersion[] cvs = [
                SELECT Id, Title, ContentDocumentId
                FROM Contentversion
                WHERE isLatest = true
                AND ContentDocumentId
                IN :allDocId
                ORDER BY CreatedDate desc
            ];
            System.debug('cvs--'+cvs);
            
            for(ContentVersion doc :cvs){
                cdocIdXcVersion.put(doc.ContentDocumentId,doc);
            }
            System.debug('cdocIdXcVersion--'+cdocIdXcVersion);
            
            for(string udId: userDocIdSet){
                system.debug('udId----------'+udId);
                UserDocumentWrapper udWrapper = New UserDocumentWrapper();
                udWrapper.userDocument = idXUserDoc.get(udId);
                System.debug('@@@@@'+userDocIdXcdLink.get(udId) );
                
                if(userDocIdXcdLink.get(udId) != null){
                    System.debug('@@@@@-----------'+cdocIdXcVersion.get(userDocIdXcdLink.get(udId).ContentDocumentId));
                    udWrapper.contentVersion = cdocIdXcVersion.get(userDocIdXcdLink.get(udId).ContentDocumentId) ;
                }
                if(userDocIdXcDistrbtn.get(udId) != null){
                    System.debug('@@@@@-----------'+userDocIdXcDistrbtn.get(udId));
                    udWrapper.ContentDistribution = userDocIdXcDistrbtn.get(udId) ;
                }
                system.debug('udWrapper---'+udWrapper);
                udWrapperList.add(udWrapper);
            }
            return udWrapperList;
        }catch(Exception e){
            //HandleBusinessException.captureError('CandidateDashboard_Helper', 'getAllUserDoc', e);
            system.debug(e.getLineNumber()+'-----get Message----'+e.getMessage());
            return null;
        }
    }
    
    //New Method Updated and ADDED By Karthik(For ATTACH Refered Image.)
    
    public static List<UserDocumentWrapper> getAllUserDocSignatureNEW(String parentId) {
        try {
            List<UserDocumentWrapper> udWrapperList = new List<UserDocumentWrapper>();
            
            // Step 1: Fetch all User Documents for the Proposal
            List<User_Document__c> getUserDoc = [
                SELECT Name, Id, Status__c, (SELECT Id FROM Attachments)
                FROM User_Document__c
                WHERE Proposals__c = :parentId
            ];
            if (getUserDoc.isEmpty()) return udWrapperList;
            
            // Step 2: Collect all IDs
            Map<String, User_Document__c> idXUserDoc = new Map<String, User_Document__c>();
            Set<String> userDocIdSet = new Set<String>();
            for (User_Document__c userDoc : getUserDoc) {
                userDocIdSet.add(userDoc.Id);
                idXUserDoc.put(userDoc.Id, userDoc);
            }
            
            // Step 3: Fetch related ContentDocumentLink records
            List<ContentDocumentLink> allDocuments = [
                SELECT Id, LinkedEntityId, ContentDocumentId, Visibility, IsDeleted, ShareType,
                ContentDocument.Title, ContentDocument.CreatedDate, ContentDocument.FileType
                FROM ContentDocumentLink
                WHERE LinkedEntityId IN :userDocIdSet
            ];
            
            // Step 4: Fetch ContentDistribution for each User Document
            List<ContentDistribution> contentDistrbtn = [
                SELECT DistributionPublicUrl, PdfDownloadUrl, RelatedRecordId
                FROM ContentDistribution
                WHERE RelatedRecordId IN :userDocIdSet
            ];
            
            // Step 5: Map relationships
            Map<String, ContentDocumentLink> userDocIdXcdLink = new Map<String, ContentDocumentLink>();
            Map<String, ContentDistribution> userDocIdXcDistrbtn = new Map<String, ContentDistribution>();
            Set<String> allDocId = new Set<String>();
            
            for (ContentDocumentLink doc : allDocuments) {
                userDocIdXcdLink.put(doc.LinkedEntityId, doc);
                allDocId.add(doc.ContentDocumentId);
            }
            for (ContentDistribution dist : contentDistrbtn) {
                userDocIdXcDistrbtn.put(dist.RelatedRecordId, dist);
            }
            
            // Step 6: Fetch latest ContentVersion
            Map<String, ContentVersion> cdocIdXcVersion = new Map<String, ContentVersion>();
            if (!allDocId.isEmpty()) {
                for (ContentVersion cv : [
                    SELECT Id, Title, ContentDocumentId
                    FROM ContentVersion
                    WHERE IsLatest = TRUE
                    AND ContentDocumentId IN :allDocId
                    ORDER BY CreatedDate DESC
                ]) {
                    cdocIdXcVersion.put(cv.ContentDocumentId, cv);
                }
            }
            
            // Step 7: Build Wrapper List
            for (String udId : userDocIdSet) {
                UserDocumentWrapper udWrapper = new UserDocumentWrapper();
                udWrapper.userDocument = idXUserDoc.get(udId);
                
                ContentDocumentLink cdl = userDocIdXcdLink.get(udId);
                if (cdl != null && cdocIdXcVersion.containsKey(cdl.ContentDocumentId)) {
                    udWrapper.contentVersion = cdocIdXcVersion.get(cdl.ContentDocumentId);
                }
                
                if (userDocIdXcDistrbtn.containsKey(udId)) {
                    udWrapper.ContentDistribution = userDocIdXcDistrbtn.get(udId);
                }
                
                udWrapperList.add(udWrapper);
            }
            
            return udWrapperList;
            
        } catch (Exception e) {
            System.debug('Error at line ' + e.getLineNumber() + ' - ' + e.getMessage());
            return new List<UserDocumentWrapper>();
        }
    }
    
    
    
    
    
    public static list<MeetingThemeWrapper> getMeetingThemeDetails(string proposalId){
        List<Meeting_Theme__c>  meetingThemeList = [select name,id,Meeting_Date__c,External_Id__c,(select name,id from Meeting_Themes__r) from Meeting_Theme__c where Meeting_Date__c != null AND  Proposals__c=:proposalId];
        System.debug('meetingThemeList: ' +meetingThemeList);
        List<Meeting_Theme__c>  meetingThemeNameList = [select name,id,Meeting_Theme__c,Meeting_Theme_Title__c,Meeting_Date__c,External_Id__c,(select name,id from Meeting_Agenda__r) from Meeting_Theme__c where Meeting_Theme__r.Proposals__c=:proposalId];
        System.debug('meetingThemeNameList: ' +meetingThemeNameList);
        List<MeetingDetails> MeetingDetlList = New List<MeetingDetails>();
        Map<string, List<MeetingDetails>> meetingThemeIdXmdList = new Map<string, List<MeetingDetails>>();
        for (Meeting_Theme__c mTheme : meetingThemeNameList) {
            if(meetingThemeIdXmdList.containsKey(mTheme.Meeting_Theme__c)){
                MeetingDetails mDetail = New MeetingDetails();
                mDetail.meetingTopic = mTheme;
                mDetail.meetingAgenda = mTheme.Meeting_Agenda__r;
                List<MeetingDetails> mdList = meetingThemeIdXmdList.get(mTheme.Meeting_Theme__c);
                mdList.add(mDetail);
                meetingThemeIdXmdList.put(mTheme.Meeting_Theme__c,mdList);
            }else{
                MeetingDetails mDetail = New MeetingDetails();
                mDetail.meetingTopic = mTheme;
                mDetail.meetingAgenda = mTheme.Meeting_Agenda__r;
                meetingThemeIdXmdList.put(mTheme.Meeting_Theme__c,New List<MeetingDetails>{mDetail});
            }
        }
        
        List<MeetingThemeWrapper> MeetingThemeWrapperList = new List<MeetingThemeWrapper>();
        for(Meeting_Theme__c theme:meetingThemeList){
            MeetingThemeWrapper mTWrapper = New MeetingThemeWrapper();
            mTWrapper.meetingTheme = theme;
            mTWrapper.MeetingDetailList = meetingThemeIdXmdList.get(theme.Id);
            MeetingThemeWrapperList.add(mTWrapper);
        }
        System.debug('MeetingThemeWrapperList: ' +MeetingThemeWrapperList);
        return MeetingThemeWrapperList;
    }
    Public static string saveMeetingDetails(List<MeetingThemeWrapper> meetingThemeWrapper){
        List<Meeting_Theme__c> meetingThemeToUpdate = new List<Meeting_Theme__c>();
        Map<string, list<Meeting_Theme__c>> extrnalIdXchildMeetingTheme = new Map<string, list<Meeting_Theme__c>>();
        Map<string, list<Meeting_Agenda__c>> extrnalIdXMeetingAgenda = new Map<string, list<Meeting_Agenda__c>>();
        for(meetingThemeWrapper mtWrapper:meetingThemeWrapper){
            if(mtWrapper.meetingYear !=0){
                mtWrapper.meetingTheme.Meeting_Date__c = Date.newInstance(mtWrapper.meetingYear,mtWrapper.meetingMonth,mtWrapper.meetingYear);
            }
            meetingThemeToUpdate.add(mtWrapper.meetingTheme);
            for(MeetingDetails meetingDetl:mtWrapper.MeetingDetailList){
                if(extrnalIdXchildMeetingTheme.containsKey(mtWrapper.meetingTheme.External_Id__c)){
                    extrnalIdXchildMeetingTheme.get(mtWrapper.meetingTheme.External_Id__c).add(meetingDetl.meetingTopic);
                }else{
                    extrnalIdXchildMeetingTheme.put(mtWrapper.meetingTheme.External_Id__c,New List<Meeting_Theme__c>{meetingDetl.meetingTopic});
                }
                
                if(extrnalIdXMeetingAgenda.containsKey(meetingDetl.meetingTopic.External_Id__c)){
                    List<Meeting_Agenda__c> meetingAgendaList = extrnalIdXMeetingAgenda.get(meetingDetl.meetingTopic.External_Id__c);
                    meetingAgendaList.addAll(meetingDetl.meetingAgenda);
                    extrnalIdXMeetingAgenda.put(meetingDetl.meetingTopic.External_Id__c,meetingAgendaList);
                }else{
                    extrnalIdXMeetingAgenda.put(mtWrapper.meetingTheme.External_Id__c,meetingDetl.meetingAgenda);
                }
            }
        }
        Map<string,string> meetingDateEIdXmeetingDateId = New map<string,string>();
        Map<string,string> childmThemeEIdXchildmThemeId = New map<string,string>();
        upsert meetingThemeToUpdate;
        for(Meeting_Theme__c updatedMtheme:meetingThemeToUpdate){
            meetingDateEIdXmeetingDateId.put(updatedMtheme.External_Id__c,updatedMtheme.Id);
        }
        List<Meeting_Theme__c> childMeetingThemeToUpdate = new List<Meeting_Theme__c>();
        List<Meeting_Agenda__c> meetingAgendaToUpdate = new List<Meeting_Agenda__c>();
        for(string externalId:extrnalIdXchildMeetingTheme.keySet()){
            for (Meeting_Theme__c mTheme : extrnalIdXchildMeetingTheme.get(externalId)) {
                mTheme.Meeting_Theme__c = meetingDateEIdXmeetingDateId.get(externalId);
                childMeetingThemeToUpdate.add(mTheme);
            }
        }
        upsert childMeetingThemeToUpdate;
        for(Meeting_Theme__c updatedMtheme:childMeetingThemeToUpdate){
            childmThemeEIdXchildmThemeId.put(updatedMtheme.External_Id__c,updatedMtheme.Id);
        }
        
        for(string externalId:extrnalIdXMeetingAgenda.keySet()){
            for (Meeting_Agenda__c mAgenda : extrnalIdXMeetingAgenda.get(externalId)) {
                mAgenda.Meeting_Theme__c = childmThemeEIdXchildmThemeId.get(externalId);
                meetingAgendaToUpdate.add(mAgenda);
            }
        }
        System.debug('extrnalIdXchildMeetingTheme: ' +extrnalIdXchildMeetingTheme);
        System.debug('extrnalIdXMeetingAgenda: ' +extrnalIdXMeetingAgenda);
        System.debug('meetingDateEIdXmeetingDateId: ' +meetingDateEIdXmeetingDateId);
        System.debug('childmThemeEIdXchildmThemeId: ' +childmThemeEIdXchildmThemeId);
        System.debug('meetingAgendaToUpdate: ' +meetingAgendaToUpdate);
        
        upsert meetingAgendaToUpdate;
        return null;
    }
    
    
    public class ContactUserDocumentWrapper{
        public list<UserDocumentWrapper> userDocWrapper;
        public Contact userDetails;
        public Contact applicationProposal;
    }
    
    public class UserDocumentWrapper{
        public User_Document__c userDocument;
        public ContentVersion contentVersion;
        public ContentDistribution ContentDistribution;
    }
    public class ProposalDocumentWrapper{
        public Proposal_Document__c userDocument;
        public ContentVersion contentVersion;
        public ContentDistribution ContentDistribution;
    }
    
    
    Public class MeetingThemeWrapper{
        public Meeting_Theme__c meetingTheme;
        public integer meetingDay;
        public integer meetingMonth;
        public integer meetingYear;
        public List<MeetingDetails> MeetingDetailList;
        
    }
    
    public class MeetingDetails{
        public Meeting_Theme__c meetingTopic; 
        public list<Meeting_Agenda__c> meetingAgenda; 
    }
    
    public static string saveAsDraftPecfar(Application_Proposal__c proposalDetails){
        try{
            proposalDetails.Stage__c = '1st Stage';
            proposalDetails.Proposal_Stages__c = 'Draft';
            upsert proposalDetails;
            return 'success';
        }catch(Exception e){
            return e.getMessage();
        }
    }
    
    public static string finalSubmitPecfar(Application_Proposal__c proposalDetails){
        try{
            proposalDetails.Stage__c = '1st Stage';
            proposalDetails.Proposal_Stages__c = 'Submitted';
            proposalDetails.Submitted__c = true;
            upsert proposalDetails;
            return 'success';
        }catch(Exception e){
            return e.getMessage();
        }
    }
    
    /*  public static Contact getFellowshipDetails(string applicantHashCode){
try{
Contact conRec = [SELECT Id,Planned_research_activities_of_the_visit__c,Expected_outcomes__c,Basis_for_choosing_your_paired_member__c,Tentative_plans__c,Tentative_Start_Date__c,Tentative_End_Date__c, Title_Of_Project__c,
Availing_Fellowship__c,Associated_with_IGSTC__c,Give_Fellowship_Details__c,Give_Associated_Details__c,Proposals__r.yearly_Call__r.Pecfar_Information_Text__c,Proposals__r.Campaign__r.Result_Announcement_Date__c FROM Contact WHERE Login_Hash_Code__c =: applicantHashCode];
return conRec;
}catch(Exception e){
return null;
}

// contact conRec = [select name,id,Proposals__c from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
// system.debug('applicantHashCode' +applicantHashCode);
// Application_Proposal__c proposalRecord;
// if(!string.isBlank(conRec.Proposals__c)){
//     proposalRecord = [SELECT id,Name,Research_Approach_Objectives__c,Expected_Deliverables__c,Basis_for_choosing_the_pairing_fellow__c,Tentative_plans_for_networking__c,Tentative_Start_Date__c,
//     Tentative_End_Date__c,Availing_any_other_fellowship_currently__c,Paired_Applicant_associated_with_IGSTC__c,Availing_Other_Fellowship_Detail__c,Applicant_associated_with_IGSTC_Detail__c,Campaign__r.Result_Announcement_Date__c  FROM Application_Proposal__c WHERE Id=: conRec.Proposals__c];
//     system.debug('proposalRecord----'+proposalRecord);     
}*/
    
    public static Contact getFellowshipDetails(string applicantHashCode){
        
        try{
            Contact conRec = [SELECT Id,Planned_research_activities_of_the_visit__c,Expected_outcomes__c,Basis_for_choosing_your_paired_member__c,Tentative_plans__c,Tentative_Start_Date__c,Tentative_End_Date__c, Title_Of_Project__c,
                              Availing_Fellowship__c,Associated_with_IGSTC__c,Give_Fellowship_Details__c,Give_Associated_Details__c,(SELECT Id,Proposals__r.Id,Proposals__r.yearly_Call__r.Result_Announcement_Date__c,Proposals__r.yearly_Call__r.Pecfar_Information_Text__c
                                                                                                                                     FROM Applicant_Proposal_Associations__r WHERE Proposals__r.RecordType_Name__c='PECFAR' LIMIT 1) FROM Contact WHERE Login_Hash_Code__c =: applicantHashCode];
            
            return conRec;
        }
        catch(Exception e){
            return null;
        }
    }
    
    
    
    public String validFor; 
    
    public static Map<String, List<String>> getFieldDependencies(String objectName, String controllingField, String dependentField)
    {
        System.debug(' ============================ getFieldDependencies ==================================');
        Map<String, List<String>> controllingInfo = new Map<String, List<String>>();
        
        Schema.SObjectType objType = Schema.getGlobalDescribe().get(objectName);
        System.debug(' objType : ' + objType);
        
        Schema.DescribeSObjectResult describeResult = objType.getDescribe();
        Schema.DescribeFieldResult controllingFieldInfo = describeResult.fields.getMap().get(controllingField).getDescribe();
        Schema.DescribeFieldResult dependentFieldInfo = describeResult.fields.getMap().get(dependentField).getDescribe();
        
        List<Schema.PicklistEntry> controllingValues = controllingFieldInfo.getPicklistValues();
        List<Schema.PicklistEntry> dependentValues = dependentFieldInfo.getPicklistValues();
        
        for(Schema.PicklistEntry currControllingValue : controllingValues)
        {
            System.debug('ControllingField: Label:' + currControllingValue.getLabel());
            controllingInfo.put(currControllingValue.getLabel(), new List<String>());
        }
        
        for(Schema.PicklistEntry currDependentValue : dependentValues)
        {
            String jsonString = JSON.serialize(currDependentValue);
            
            MyPickListInfo info = (MyPickListInfo) JSON.deserialize(jsonString, MyPickListInfo.class);
            
            String hexString = EncodingUtil.convertToHex(EncodingUtil.base64Decode(info.validFor)).toUpperCase();
            
            System.debug('DependentField: Label:' + currDependentValue.getLabel() + ' ValidForInHex:' + hexString + ' JsonString:' + jsonString);
            
            Integer baseCount = 0;
            
            for(Integer curr : hexString.getChars())
            {
                Integer val = 0;
                
                if(curr >= 65)
                {
                    val = curr - 65 + 10;
                }
                else
                {
                    val = curr - 48;
                }
                
                if((val & 8) == 8)
                {
                    System.debug('Dependent Field: ' + currDependentValue.getLabel() + ' Partof ControllingField:' + controllingValues[baseCount + 0].getLabel());
                    controllingInfo.get(controllingValues[baseCount + 0].getLabel()).add(currDependentValue.getLabel());
                }
                if((val & 4) == 4)
                {
                    System.debug('Dependent Field: ' + currDependentValue.getLabel() + ' Partof ControllingField:' + controllingValues[baseCount + 1].getLabel());
                    controllingInfo.get(controllingValues[baseCount + 1].getLabel()).add(currDependentValue.getLabel());                    
                }
                if((val & 2) == 2)
                {
                    System.debug('Dependent Field: ' + currDependentValue.getLabel() + ' Partof ControllingField:' + controllingValues[baseCount + 2].getLabel());
                    controllingInfo.get(controllingValues[baseCount + 2].getLabel()).add(currDependentValue.getLabel());                    
                }
                if((val & 1) == 1)
                {
                    System.debug('Dependent Field: ' + currDependentValue.getLabel() + ' Partof ControllingField:' + controllingValues[baseCount + 3].getLabel());
                    controllingInfo.get(controllingValues[baseCount + 3].getLabel()).add(currDependentValue.getLabel());                    
                }
                
                baseCount += 4;
            }            
        } 
        
        System.debug('ControllingInfo: ' + controllingInfo);
        
        return controllingInfo;
    }
    class MyPickListInfo {
        public String active {get; set;}
        public String defaultValue {get; set;}
        public String label {get; set;}
        public String value {get; set;}
        public String validFor {get; set;}
    }
    
    public static Contact getCoodinatorDetList(string hashcode,string apaId){
        //29 Aug 2023 D: Modified query to get OtherStreet field and try to store the value of MailingStreet from js.
        Contact ContactRecord = [SELECT Id,Title,FirstName,LastName,Name,Email,Actual_Position__c,MailingStreet,OtherStreet,MailingCity,MailingState,MailingCountry,MailingPostalCode,Country__c,States__c,Account.Name,Publications_Patents__c,Publications_Patents_Relevant__c,
                                 Account.BillingCountry,
                                 (SELECT Id, Publications_Patents__c,List_Of_Patents_Filed_Granted__c,Book_Chapters_Monographs__c,Any_Other_Notable_Achievements__c
								 FROM Applicant_Proposal_Associations__r WHERE Id = :apaId), // New query added.to get APA Fields.
                                 (SELECT Name,Degree__c,Start_Year__c,End_Year__c,CGPA__c,End_Date__c,Start_Date__c,Institution_Name__c,Area_of_specialization__c,Percentage__c,Percentage_cgpa__c 
                                  FROM Education_Details__r where Applicant_Proposal_Association__c =:apaId ORDER BY End_Year__c DESC),
                                 (SELECT Id,Organization_Name__c,Position__c,Start_Year__c,End_Year__c FROM Employment_Details__r  where Applicant_Proposal_Association__c =:apaId)
                                 FROM Contact WHERE Login_Hash_Code__c=: hashcode ];
        return ContactRecord;
    }

    // RE-USING OLD METHOD
    public static List<Contact> getCoordCVDetails(String hashCode, String apaId, String proposalId){
        try{
            System.debug('--------------- getCoordCVDetails() ---------------');

            List<Applicant_Proposal_Association__c> apaList = [
                SELECT Id, Contact__c
                FROM Applicant_Proposal_Association__c
                WHERE Proposals__c = :proposalId
            ];

            Set<Id> contactIdSet = new Set<Id>();
            Set<Id> apaIdSet = new Set<Id>();

            for(Applicant_Proposal_Association__c apa : apaList){
                contactIdSet.add(apa.Contact__c);
                apaIdSet.add(apa.Id);
            }
            System.debug('contactIdSet : -------> ' + contactIdSet);
            System.debug('apaIdSet : -------> ' + apaIdSet);

            List<Contact> conList = [
                SELECT Id,Name,FirstName,LastName,Is_Primary__c,Email,Actual_Position__c,MailingStreet,MailingCity,MailingState,MailingCountry,MailingPostalCode,Country__c,States__c,Account.Name,Publications_Patents__c,
                Account.BillingCountry,
                (SELECT Name, Contact__c, Degree__c,Start_Year__c,End_Year__c,CGPA__c,End_Date__c,Start_Date__c,Institution_Name__c,Area_of_specialization__c,Percentage__c,Percentage_cgpa__c, Applicant_Proposal_Association__c FROM Education_Details__r WHERE Applicant_Proposal_Association__c IN :apaIdSet ORDER BY End_Year__c DESC),
                (SELECT Id, Contact__c, Organization_Name__c,Position__c,Start_Year__c,End_Year__c, Applicant_Proposal_Association__c FROM Employment_Details__r WHERE Applicant_Proposal_Association__c IN :apaIdSet ORDER BY End_Year__c DESC)
            FROM Contact 
            WHERE Id IN : contactIdSet];

            System.debug('conList size : ' + conList.size());
            System.debug('conList : ' + conList);

            /*
            Set<Id> apaIdSet = new Set<Id>();
            // for(Applicant_Proposal_Association__c apa  : apaListFromJs){
            //     apaIdSet.add(apa.Id);
            // }

            List<Applicant_Proposal_Association__c> apaList = [
                SELECT Id, Contact__c, Proposals__c FROM Applicant_Proposal_Association__c WHERE Proposals__c = :proposalId
            ];
            System.debug('apaList : ' + apaList);

            Set<Id> contactIdSet = new Set<Id>();
            for(Applicant_Proposal_Association__c apa : apaList){
                contactIdSet.add(apa.Contact__c);
                apaIdSet.add(apa.Id);
            }
            System.debug('contactIdSet : -------> ' + contactIdSet);

            List<Contact> conList = [
                SELECT Id,Name,FirstName,LastName,Is_Primary__c,Email,Actual_Position__c,MailingStreet,MailingCity,MailingState,MailingCountry,MailingPostalCode,Country__c,States__c,Account.Name,Publications_Patents__c,
                Account.BillingCountry,
                (SELECT Name,Degree__c,Start_Year__c,End_Year__c,CGPA__c,End_Date__c,Start_Date__c,Institution_Name__c,Area_of_specialization__c,Percentage__c,Percentage_cgpa__c, Applicant_Proposal_Association__c FROM Education_Details__r WHERE Applicant_Proposal_Association__c IN :apaIdSet ORDER BY End_Year__c DESC),
                (SELECT Id,Organization_Name__c,Position__c,Start_Year__c,End_Year__c, Applicant_Proposal_Association__c FROM Employment_Details__r WHERE Applicant_Proposal_Association__c IN :apaIdSet ORDER BY End_Year__c DESC)
            FROM Contact 
            WHERE Id IN : contactIdSet];

            System.debug('conList size : ' + conList.size());
            System.debug('conList : ' + conList);
            */

            return conList;
        }
        catch(Exception e){
            return null;
        }
    }

    /*
    // RE-USING OLD METHOD
    public static List<Contact> getCoordCVDetails(String hashCode, String apaId, String proposalId){
        try{
            System.debug('--------------- getCoordCVDetails() ---------------');

            List<Applicant_Proposal_Association__c> apaList = [
                SELECT Id, Contact__c, Proposals__c FROM Applicant_Proposal_Association__c WHERE Proposals__c = :proposalId
            ];
            System.debug('apaList : ' + apaList);

            Set<Id> contactIdSet = new Set<Id>();
            for(Applicant_Proposal_Association__c apa : apaList){
                contactIdSet.add(apa.Contact__c);
            }
            System.debug('contactIdSet : -------> ' + contactIdSet);

            List<Contact> conList = [
                SELECT Id,Name,FirstName,LastName,Is_Primary__c,Email,Actual_Position__c,MailingStreet,MailingCity,MailingState,MailingCountry,MailingPostalCode,Country__c,States__c,Account.Name,Publications_Patents__c,
                Account.BillingCountry,
                (SELECT Name,Degree__c,Start_Year__c,End_Year__c,CGPA__c,End_Date__c,Start_Date__c,Institution_Name__c,Area_of_specialization__c,Percentage__c,Percentage_cgpa__c, Applicant_Proposal_Association__c FROM Education_Details__r WHERE Applicant_Proposal_Association__c = :apaId ORDER BY End_Year__c DESC),
                (SELECT Id,Organization_Name__c,Position__c,Start_Year__c,End_Year__c, Applicant_Proposal_Association__c FROM Employment_Details__r WHERE Applicant_Proposal_Association__c = :apaId ORDER BY End_Year__c DESC)
            FROM Contact 
            WHERE Id IN : contactIdSet];

            System.debug('conList size : ' + conList.size());
            System.debug('conList : ' + conList);
            return conList;
        }
        catch(Exception e){
            return null;
        }
    }
    */

    // OLD METHOD
    /*
        public static List<Contact> getCoordCVDetails(string proposalid){
        try{
        List<Contact> conList = [SELECT Id,Name,FirstName,LastName,Is_Primary__c,Email,Actual_Position__c,MailingStreet,MailingCity,MailingState,MailingCountry,MailingPostalCode,Country__c,States__c,Account.Name,Publications_Patents__c,
        Account.BillingCountry,(SELECT Name,Degree__c,Start_Year__c,End_Year__c,CGPA__c,End_Date__c,Start_Date__c,Institution_Name__c,Area_of_specialization__c,Percentage__c,Percentage_cgpa__c 
        FROM Education_Details__r),(SELECT Id,Organization_Name__c,Position__c,Start_Year__c,End_Year__c FROM Employment_Details__r)
        FROM Contact WHERE Proposals__c=: proposalid];

        return conList;
        }catch(Exception e){
        return null;
        }
}
*/
    /*
    // NEW METHOD TO GET THE CONTACT EDUCATION DETAILS AND EMPLOYEE DETAILS - WORKSHOP
    public static List<Contact> getCoordCVDetails(String hashcode, String proposalId){
        try{
            System.debug('-------------------- getCoordCVDetails() ----------------------');
            
            System.debug('hashcode : ' + hashcode);
            
            Contact conRec = [SELECT Id, Name, Login_Hash_Code__c 
                              FROM Contact 
                              WHERE Login_Hash_Code__c = :hashcode 
                              LIMIT 1];
            System.debug('conRec : ' + conRec);
            
            if(conRec != null){
                List<Applicant_Proposal_Association__c> apaListForPropsals = [
                    SELECT Id, Name, Proposals__c, Contact__c 
                    FROM Applicant_Proposal_Association__c
                    WHERE Proposals__c = :proposalId
                    AND Contact__c = :conRec.Id
                ];
                System.debug('apaListForPropsals : ' + apaListForPropsals.size());
                System.debug('apaListForPropsals : ' + apaListForPropsals);
                
                System.debug('apaListForPropsals Con 1' + apaListForPropsals[0].Contact__c);
                
                Set<Id> contactIdSet = new Set<Id>();
                for(Applicant_Proposal_Association__c apa : apaListForPropsals){
                    contactIdSet.add(apa.Contact__c);
                }
                System.debug('contactIdSet : ' + contactIdSet);
                
                List<Contact> conList;
                if(! contactIdSet.isEmpty()){
                    conList = [
                        SELECT Id,Name,FirstName,LastName,Is_Primary__c,Email,Actual_Position__c,MailingStreet,MailingCity,MailingState,MailingCountry,                        
                        MailingPostalCode,Country__c,States__c,Account.Name,Publications_Patents__c,Login_Hash_Code__c, Account.BillingCountry,
                        (SELECT Name,Degree__c,Start_Year__c,End_Year__c,CGPA__c,End_Date__c,Start_Date__c,Institution_Name__c,Area_of_specialization__c,
                         Percentage__c,Percentage_cgpa__c 
                         FROM Education_Details__r),
                        (SELECT Id,Organization_Name__c,Position__c,Start_Year__c,End_Year__c 
                         FROM Employment_Details__r)
                        FROM Contact 
                        WHERE Id IN :contactIdSet
                    ];
                }
                System.debug('conList : ' + conList);
                
                return conList;
            }
            return null;
        }catch(Exception e){
            System.debug('Exception @ getCoordCVDetails : Line Number : ' + e.getLineNumber() + ' Error Message : ' + e.getMessage());
            return null;
        }
    }
    */

    public static void deleteEducationWorkshop(string eduId){
        delete new Education_Details__c(id=eduId);
    }
    
    public static void deleteEmploymentWorkshop(string empId){
        delete new Employment_Details__c(id=empId);
    }
    
    /*
    public static string SaveWorkshopContactDetails(List<Contact> conDataList, List<Education_Details__c> eduDetails, List<Employment_Details__c> empDetails){
        try{
            for(Contact con : conDataList){
                con.MailingState = con.State__c;
            }
            upsert conDataList;
            upsert eduDetails;
            upsert empDetails;
            return 'success';
        }catch(Exception e){
            return e.getMessage();
        }
    }
    */
    
    public static string SaveWorkshopContactDetails(List<Contact> conDataList, List<Education_Details__c> eduDetails, List<Employment_Details__c> empDetails, String apaId, String proposalId){
        try{

            for(Contact con : conDataList){
                con.MailingState = con.State__c;
            }
            upsert conDataList;

            Map<Id, Applicant_Proposal_Association__c> contactIdWithAPA = new Map<Id, Applicant_Proposal_Association__c>();

            List<Applicant_Proposal_Association__c> apaList = [
                SELECT Id, Contact__c
                FROM Applicant_Proposal_Association__c
                WHERE Proposals__c = :proposalId
            ];

            for(Applicant_Proposal_Association__c apa : apaList){
                contactIdWithAPA.put(apa.Contact__c, apa);
            }

            if(! eduDetails.isEmpty()){
                for(Education_Details__c edu : eduDetails){
                    edu.Applicant_Proposal_Association__c = contactIdWithAPA.get(edu.Contact__c) != null ? contactIdWithAPA.get(edu.Contact__c).Id : null;
                }
                upsert eduDetails;
            }

            if(! empDetails.isEmpty()){
                for(Employment_Details__c emp : empDetails){
                    emp.Applicant_Proposal_Association__c = contactIdWithAPA.get(emp.Contact__c) != null ? contactIdWithAPA.get(emp.Contact__c).Id : null;
                }
                upsert empDetails;
            }
            
            
            return 'success';
        }catch(Exception e){
            return e.getMessage();
        }
    }
    
    public static Account getAddressDetails(string hashcode){
        try{
            Contact conRec = [Select Id,Name,AccountId FROM Contact WHERE Login_Hash_Code__c=: hashcode];
            Account accRecord = [SELECT Id,Title__c,Head_Of_Project__c,Industry__c,Academia__c,Name,BillingStreet,BillingCity,BillingState,BillingCountry,BillingPostalCode,Homepage_URL__c,Year_Of_Establishment__c,Main_Business_Area__c,NumberOfEmployees,
                                 Infrastructural_Facilities__c,Domain_Expertise_Available__c,Ownership_Profile__c,Last_Year_s_Balance__c,Website,DSIR_Recoginition_Details__c,Country_Type__c,
                                 (SELECT Id,Title,Name,LastName,Email,Phone,Department,Designation__c FROM Contacts) FROM Account WHERE Id=: conRec.AccountId];
            return accRecord;
        }catch(Exception e){
            return null;
        }
    }
    
    public static string saveAddressDetails(Account addressDetails, List<Contact> contactList){
        try{
            addressDetails.NumberOfEmployees = Integer.valueOf(addressDetails.NumberOfEmployees);
            addressDetails.BillingState = addressDetails.Shipping_State__c;
            addressDetails.Country_Type__c = addressDetails.BillingCountry; // Added
            addressDetails.DSIR_Recoginition_Details__c = addressDetails.DSIR_Recoginition_Details__c;
            
            upsert contactList;
            upsert addressDetails;
            return 'success';
        }catch(Exception e){
            return e.getMessage() + e.getLineNumber();
        }
    }
    
    public static List<Contact> getAllContacts(){
        try{
            List<Contact> conRec = [SELECT Id,Name,Email FROM Contact];
            return conRec;
        }catch(Exception e){
            return null;
        }
    }
    
    public static List<References__c> checkReferenceEmail(List<string> email, List<Id> ids){
        try{
            List<References__c> refList = [SELECT Id,Name,Email__c FROM References__c WHERE Email__c IN: email AND Id NOT IN: ids];
            return refList;
        }catch(Exception e){
            return null;
        }
    }
    
    @RemoteAction
    public static List<Contact> checkEmail(String email, String contId) {
        List<Contact> conRec = new List<Contact>();
        try {
            if (String.isBlank(email)) {
                return conRec;
            }
            
            if (String.isNotBlank(contId)) {
                conRec = [
                    SELECT Id, FirstName, LastName, Email, Birthdate, MailingCountry, Account.Name, Nationality__c, Account_BillingCity__c, AccountName__c, Institution__c, Designation__c, Account.BillingStreet, Account.BillingCity, Account.BillingState, Account.BillingCountry, Account.BillingPostalCode, MobilePhone
                    FROM Contact
                    WHERE Email = :email
                    AND Id != :contId
                ];
            } else {
                conRec = [
                    SELECT Id, FirstName, LastName, Email, Birthdate, MailingCountry, Account.Name, Nationality__c, Account_BillingCity__c, AccountName__c, Institution__c, Designation__c, Account.BillingStreet, Account.BillingCity, Account.BillingState, Account.BillingCountry, Account.BillingPostalCode, MobilePhone
                    FROM Contact
                    WHERE Email = :email
                ];
            }
            return conRec;
        } catch (Exception e) {
            return new List<Contact>(); // never return null
        }
    }
    
    
    public static string getConForHostNationality(string userId){
        try{
            Contact conRec = [SELECT Id,Name,Nationalities__c,Nationality__c,MailingCountry FROM Contact WHERE Login_Hash_Code__c =: userId];
            return conRec.MailingCountry;
        }catch(Exception e){
            return e.getMessage()+e.getLineNumber();
        }
    }
    
    public static string createHostContact(string conID, string projectid){
        try{
            Account acc = New Account();
            acc.Name = 'hostaccABC';
            // acc.Proposals__c = projectId;
            upsert acc;
            Contact conRec = New Contact();
            ConRec.LastName = 'hostaccABC';
            conRec.AccountId = acc.Id;
            conRec.Proposals__c = projectid;
            
            
            // conRec.Proposals__c = projectId;
            upsert conRec;
            
            Contact primCon = New Contact();
            primCon.Id = conID;
            primCon.Host_Details__c = conRec.Id;
            update primCon;
            return conRec.Id;
            
        }catch(Exception e){
            return e.getMessage()+e.getLineNumber();
        }
    }
    
    public static Contact getCVDetailsForWiserApplicant(string userId,String apaId){
        try{
            Contact conRec = [SELECT Id,Name,FirstName,LastName,Phone,Email,Publications_Patents__c,List_Of_Patents_Filed_Granted__c,Book_Chapters_Monographs__c,Any_Other_Notable_Achievements__c,
                              (SELECT Id,Degree__c,End_Year__c,Start_Year__c,Institution_Name__c,Percentage__c,Percentage_cgpa__c,Area_of_specialization__c,Applicant_Proposal_Association__c FROM Education_Details__r WHERE Applicant_Proposal_Association__c =: apaId),
                              (SELECT Id,End_Year__c,Start_Year__c,Position__c,current_employement__c,Organization_Name__c,Nature_of_Job__c,Applicant_Proposal_Association__c FROM Employment_Details__r WHERE Applicant_Proposal_Association__c =: apaId) FROM Contact WHERE Login_Hash_Code__c=: userId];
            return conRec;
            
        }catch(Exception e){
            return null;
        }
    }
    
    // public static Account getMentorHostDetails(string userId){
    //     try{
    //         Contact conRec = [SELECT Id,Name,AccountID,Account.Host_Account__c FROM Contact WHERE Login_Hash_Code__c=: userId];
    //         system.debug('conRec ::'+conRec);
    //         Account accRec = New Account();
    //         if(!string.isBlank(conRec.Account.Host_Account__c)){
    //             accRec = [SELECT Id,Name,BillingCity,BillingStreet,BillingState,BillingCountry,BillingPostalCode,Name_of_Mentor__c,Designation_Position_of_the_Mentor__c,
    //                       Mentor_contact_number__c,Mentor_E_mail_Id__c,Organisation_Posrt__c,Proposals__c FROM Account WHERE Id=: conRec.Account.Host_Account__c];
    //         }
    //         system.debug('accRec ::'+accRec);
    //         return accRec;
    //     }catch(Exception e){
    //         return null;
    //     }
    // }

    public static Account getMentorHostDetails(String userId, String apaId) {
        try {
            Contact conRec = [SELECT Id, Name, AccountId, Account.Host_Account__c FROM Contact WHERE Login_Hash_Code__c = :userId LIMIT 1];
            System.debug('conRec :: ' + conRec);

            Account accRec = null;
            if (!String.isBlank(conRec.Account.Host_Account__c) && apaId != null) {
                List<Account> accList = [SELECT Id, Name, BillingCity, BillingStreet, BillingState,BillingCountry, BillingPostalCode, Name_of_Mentor__c,Designation_Position_of_the_Mentor__c,
                                        Mentor_contact_number__c, Mentor_E_mail_Id__c,Organisation_Posrt__c, Proposals__c FROM Account WHERE Id = :conRec.Account.Host_Account__c 
                                        AND Id IN (SELECT Account__c FROM Applicant_Proposal_Association__c WHERE Id = :apaId) LIMIT 1];

                if (!accList.isEmpty()) {
                    accRec = accList[0];
                }
            }
        System.debug('accRec :: ' + accRec);
        return accRec;
        } catch (Exception e) {
            return null;
        }
    }
    // public static String reviewApp(string proID,string CampaignType){
    //     try{
    //         return UtilityMethodsForDocGeneration.generateTempForAppPortal(proID, CampaignType);
    //     }catch(Exception e){
    //         system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
    //         return 'Error Occured';
    //         }
    //    }
    public String reviewAppDocGen(string proID){
        try{
            // UtilityMethodsForDocGeneration.generateTempForAppPortal(proID, CampaignType);
            // UtilityMethodsForDocGeneration.generateTempForAppPortal(proID, CampaignType);
            CongaDocGeneration.generateIFTemplateFromProposal(proID);
            return 'success';
        }catch(Exception e){
            system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
            return 'Error Occured';
        }
    }
    
    public list<Attachment> getCongaDoc(string proID){
        
        try{
            string attId=CongaDocGeneration.getLatestAttachmentId(proID);
            if(attId!=null){
                return [SELECT Id, ParentId , ContentType , Name FROM Attachment where id=:attId];
            }else{
                return new List<attachment>();
            }
        }catch(Exception e){
            system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
            return new List<attachment>();
        }
    }
    
    public String updateIFDocStatus(Application_Proposal__c instanceProposal){
        try{
            upsert instanceProposal;
            return 'success';
        }catch(Exception e){
            system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
            return 'Error Occured';
        }
    }
    
    public static string saveMentorHostDetails(Account AccountRecord, string userId, string proposalID,string apaId){
        try{
            AccountRecord.BillingState = AccountRecord.Shipping_State__c;
            // AccountRecord.Proposals__c = proposalID;
            AccountRecord.Host__c = true;
            upsert AccountRecord;
            Contact conRec = [SELECT Id,Name,AccountId FROM Contact Where Login_Hash_Code__c=: userId];
            Account accRec = [SELECT Id,Host_Account__c From Account WHERE Id=: conRec.AccountId];
            accRec.Host_Account__c = AccountRecord.Id;
            upsert accRec;
            Applicant_Proposal_Association__c apa=[SELECT Id,Name,Account__c FROM Applicant_Proposal_Association__c WHERE Id=: apaId];
            apa.Account__c = AccountRecord.Id;
            upsert apa;
            system.debug('conRecconRec ::'+conRec);
            system.debug('accRec.Host_Account__c ::'+accRec.Host_Account__c);
            return 'SUCCESS';
        }catch(Exception e){
            return e.getMessage()+e.getLineNumber();
        }
    }
    
    @AuraEnabled
    public static List<Evaluation_Step__c> getEvaluationRecords(string proposalId){
        try{
            if(!String.isBlank(proposalId)){
                Application_Proposal__c app = [SELECT Id,Name,RecordType.Name,Stage__c FROM Application_Proposal__c WHERe Id = :proposalId];
                List<Evaluation_Step__c> evaluationStepList = new List<Evaluation_Step__c>();
                if(app.RecordType.Name == 'Two Plus Two'){
                    System.debug('if');
                    evaluationStepList = [SELECT Id,Name,Subject__c,Comments__c,Yes__c,Stage__c From Evaluation_Step__c WHERE Proposals__c =: proposalId AND Stage__c =:app.Stage__c ];
                }else{
                    evaluationStepList = [SELECT Id,Name,Subject__c,Comments__c,Yes__c From Evaluation_Step__c WHERE Proposals__c =: proposalId]; 
                }
                if(evaluationStepList.size() > 0){
                    system.debug('evaluationStepList -----> '+evaluationStepList);
                    return evaluationStepList;
                }
            }
            system.debug('null ------> ');
            return null;
        }catch(Exception e){
            return null;
        }
    }
    
    @AuraEnabled
    public static string saveEvaluationRecords(List<Evaluation_Step__c> evaluationRecordList){
        System.debug('evaluationRecordList === >'+evaluationRecordList);
        try{
            System.debug('evaluationRecordList'+evaluationRecordList);
            set <Id> evaluationIdSet = New set<Id>();
            for(Evaluation_Step__c eve : evaluationRecordList){
                evaluationIdSet.add(eve.Id);
            }
            List<Evaluation_Step__c> listOfEligibilityRec = [SELECT Id,Proposals__c From Evaluation_Step__c WHERE Id IN : evaluationIdSet];
            String propId = listOfEligibilityRec[0].Proposals__c;
            
            Application_Proposal__c apptoUpdate = New Application_Proposal__c();
            apptoUpdate.Id = propId;
            apptoUpdate.Eligibility_Checked__c = true;
            apptoUpdate.Eligibility_Status__c = 'Submitted';
            update apptoUpdate;
            update evaluationRecordList;
            return 'SUCCESS';
        }catch(Exception e){
            return e.getMessage() + e.getLineNumber();
        }
    }
    
    @AuraEnabled
    public static string SaveDraftEvaluationRecords(List<Evaluation_Step__c> evaluationRecordList){
        System.debug('evaluationRecordList === >'+evaluationRecordList);
        try{
            set <Id> evaluationIdSet = New set<Id>();
            for(Evaluation_Step__c eve : evaluationRecordList){
                evaluationIdSet.add(eve.Id);
            }
            List<Evaluation_Step__c> listOfEligibilityRec = [SELECT Id,Proposals__c From Evaluation_Step__c WHERE Id IN : evaluationIdSet];
            String propId = listOfEligibilityRec[0].Proposals__c;
            
            Application_Proposal__c apptoUpdate = New Application_Proposal__c();
            apptoUpdate.Id = propId;
            apptoUpdate.Eligibility_Status__c = 'Draft';
            
            update apptoUpdate;
            update evaluationRecordList;
            return 'SUCCESS';
        }catch(Exception e){
            return e.getMessage() + e.getLineNumber();
        }
    }
    
    @AuraEnabled
    public static string getAttachmentId(string propId){
        return [SELECT Id, Name FROM Attachment WHERE ParentID =: propId Order by LastModifiedDate ASC LIMIT 1].Id;
    }
}