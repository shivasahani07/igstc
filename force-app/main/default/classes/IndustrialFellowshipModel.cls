public class IndustrialFellowshipModel {
    public List<Education_Details__c> getEduQualification(String loginHashCode,String apaId){
        // List<Education_Details__c> lEduDet=
        return [SELECT Name,Degree__c,Start_Year__c,End_Year__c,CGPA__c,End_Date__c,Start_Date__c,Nature_of_PhD_Work__c,Nature_of_Thesis_Work__c,Institution_Name__c,Area_of_specialization__c,Percentage__c,Percentage_cgpa__c,
                Thesis_Supervisor__c,Thesis_Type__c,Recordtype.Name,RecordTypeId,Title_Thesis__c FROM Education_Details__c WHERE contact__r.Login_Hash_Code__c=:loginHashCode AND Applicant_Proposal_Association__c=:apaId]; 
        // return lEduDet;
    }
    public Achievement__c getAchievementsDet(String loginHashCode){
        // List<Education_Details__c> lEduDet=
        return [SELECT id,contact__c,Awards_Honours__c,List_of_Publications__c,List_of_Patents_filed__c,Book_Chapters__c,Any_other_achievements__c FROM Achievement__c where contact__r.Login_Hash_Code__c=:loginHashCode]; 
        // return lEduDet;
    }
    public Contact getContactEmployement(String loginHashCode,String apaId){
        return [SELECT Id,Name,Previous_industrial_internship__c,Availing_Fellowship__c,Fellowship_Details__c,Associated_with_IGSTC__c,Associated_Details__c,Abstract_of_Ongoing_Work__c,
                (SELECT Id,Name,Organization_Name__c,current_employement__c,Position__c,Start_Date__c,End_Date__c,Nature_of_Job__c FROM Employment_Details__r WHERE Applicant_Proposal_Association__c=:apaId)
                From Contact WHERE Login_Hash_Code__c=: loginHashCode Limit 1];
    }
   //***************OLD Method *****************//
   /* public Contact getContactDetailsFellowDet(String loginHashCode){
        return [SELECT Id,Name,FirstName,LastName,Uploaded__c,Industrial_Fellowship_Type__c,Proposals__r.Title_Of__c,Proposals__r.Duration_In_Months_Max_36__c,Proposals__r.Research_Approach_Objectives__c,Proposals__r.Host_industry__c,
                Proposals__r.Brief_Statement_of_Purpose__c,Proposals__r.Expected_Deliverables__c,Proposals__r.Proposed_area__c,Proposals__r.Parent_organisation__c,Proposals__r.Campaign__r.EndDate,
                Proposals__r.Fellowship_Duration__c,Proposals__r.Work_plan__c,(select id,FirstName,LastName,Addess_same_as__c,MailingCity,MailingState,MailingCountry,MailingPostalCode,MailingStreet,OtherStreet,OtherCity,OtherState,OtherCountry,OtherPostalCode,Position_of_the_Mentor__c,Brief_portfolio__c,Email from Contacts__r),
                (select id,FirstName,LastName,Email,Addess_same_as__c,MailingCity,MailingState,MailingCountry,MailingPostalCode,MailingStreet,Position_of_the_Mentor__c,Brief_portfolio__c,OtherStreet,OtherCity,OtherState,OtherCountry,OtherPostalCode from Contacts1__r) From Contact WHERE Login_Hash_Code__c=: loginHashCode Limit 1];
    }*/


    //******************Changed By Karthik KE ********************************/
   public Contact getContactDetailsFellowDet(String loginHashCode){
        return [SELECT Id,Name,FirstName,LastName,Uploaded__c,Industrial_Fellowship_Type__c,(SELECT Id, Name ,Proposals__r.Title_Of__c,Proposals__r.Duration_In_Months_Max_36__c,Proposals__r.Research_Approach_Objectives__c,Proposals__r.Host_industry__c,
                Proposals__r.Brief_Statement_of_Purpose__c,Proposals__r.Expected_Deliverables__c,Proposals__r.Proposed_area__c,Proposals__r.Parent_organisation__c,Proposals__r.Campaign__r.EndDate,
                Proposals__r.Fellowship_Duration__c,Proposals__r.Work_plan__c  FROM Applicant_Proposal_Associations__r Where Proposals__r.RecordType_Name__c='Industrial Fellowship'),(SELECT Id,FirstName,LastName,Addess_same_as__c,MailingCity,MailingState,MailingCountry,MailingPostalCode,MailingStreet,OtherStreet,OtherCity,OtherState,OtherCountry,OtherPostalCode,Position_of_the_Mentor__c,Brief_portfolio__c,Email from Contacts__r),
                (SELECT Id,FirstName,LastName,Email,Addess_same_as__c,MailingCity,MailingState,MailingCountry,MailingPostalCode,MailingStreet,Position_of_the_Mentor__c,Brief_portfolio__c,OtherStreet,OtherCity,OtherState,OtherCountry,OtherPostalCode from Contacts1__r) FROM Contact WHERE Login_Hash_Code__c=: loginHashCode Limit 1];
    }
   //**********************************************************************************/
//    @RemoteAction




    // commented Method
    public  Contact getContactSingh(String loginHashCode){
        return [SELECT id,FirstName,LastName,Signature_Place__c,Account.Name, Industrial_Fellowship_Type__c,Uploaded__c,Declaration_Sign_Date__c,MailingCity,MailingState,MailingCountry,MailingPostalCode,MailingStreet,Nationality__c,Institute_Name__c,Department,Designation__c,Phone,Email,Homepage_URL__c,Birthdate,Profile_Pic_Attachment_Id__c,Institution_Name__c,(select name,id from Attachments Order By CreatedDate DESC limit 1)
                From Contact WHERE Login_Hash_Code__c=: loginHashCode Limit 1];
    }

    // public  Applicant_Proposal_Association__c getContactSingh(String loginHashCode){
    //     return [SELECT Id, Contact__r.FirstName, Contact__r.LastName, Contact__r.Signature_Place__c,  Contact__r.Industrial_Fellowship_Type__c, Contact__r.Uploaded__c, Contact__r.Declaration_Sign_Date__c, Contact__r.MailingCity, Contact__r.MailingState, Contact__r.MailingCountry, Contact__r.MailingPostalCode, Contact__r.MailingStreet, Contact__r.Nationality__c, Contact__r.Institute_Name__c, Contact__r.Department, Contact__r.Designation__c, Contact__r.Phone, Contact__r.Email, Contact__r.Homepage_URL__c, Contact__r.Birthdate, Contact__r.Profile_Pic_Attachment_Id__c, Contact__r.Institution_Name__c, (SELECT Id From User_Documents__r Order By CreatedDate DESC limit 1) 
    //             FROM Applicant_Proposal_Association__c WHERE Contact__r.Login_Hash_Code__c=: loginHashCode Limit 1];
    // }


    // Old Method
    // public Contact getProposalDet(String loginHashCode){
    //     return [SELECT Id,Name,Proposals__r.Duration_In_Months_Max_36__c,Proposals__r.Id,Proposals__r.Purpose_for_Applying_Other__c,Proposals__r.Brief_Statement_of_Purpose__c,Proposals__r.Title_Of__c,Proposals__r.Proposed_area__c,Proposals__r.Purpose_for_applying__c,Proposals__r.KeyWords__c,Proposals__r.Summary__c,Proposals__r.Research_Approach_Objectives__c,Proposals__r.Abstract_of_proposed__c
    //             From Contact WHERE Login_Hash_Code__c=: loginHashCode Limit 1];
    // }

    // Changed By harsh 
    public Contact getProposalDet(String loginHashCode){
        return [SELECT Id,Name, (SELECT Id, Name, Proposals__r.Duration_In_Months_Max_36__c, Proposals__r.Id, Proposals__r.Purpose_for_Applying_Other__c, Proposals__r.Brief_Statement_of_Purpose__c, Proposals__r.Title_Of__c, Proposals__r.Proposed_area__c, Proposals__r.Purpose_for_applying__c, Proposals__r.KeyWords__c, Proposals__r.Summary__c, Proposals__r.Research_Approach_Objectives__c, Proposals__r.Abstract_of_proposed__c FROM Applicant_Proposal_Associations__r  WHERE Proposals__r.RecordType_Name__c = 'SING')
                From Contact WHERE Login_Hash_Code__c=: loginHashCode Limit 1];
    }


    public Account getAccountBankDetails(String accountId){
        return [SELECT Id,Name,(select id,name,Account__c,Account_Name__c,Bank_Name__c,Bank_Account_Number__c,Bank_Address__c,Bank_IFSC_Code__c from Bank_Details__r) From Account WHERE Id=: accountId Limit 1];
    }
  

  // Controller for Wiser ApplicantInformation
 
//  public  List<Contact> getContactWiser(String projectId){
//    List<Contact> conRec = [SELECT Id,FirstName,Institution_Name__c,LastName,AccountId,Account.Name,Account.Proposals__c,Country__c,MailingCity, MailingState,MailingCountry,MailingPostalCode, MailingStreet,Nationality__c,Institute_Name__c,Department, Designation__c,Phone,Email, Homepage_URL__c, Birthdate,Proposals__c,(select name,id from Attachments Order By CreatedDate DESC limit 1) FROM Contact WHERE Proposals__c=: projectId];
//    System.debug('conRec ::'+conRec);
//    return conRec;
// }

    // Host Information
    // public Static Contact getContactHostInfo(String projectId){
    //     Contact con = [SELECT Id,FirstName,LastName, MailingCity, MailingState,MailingCountry,MailingPostalCode, MailingStreet,Nationality__c,Institution_Name__c,Department, Designation__c,Profile_Pic_Attachment_Id__c,Uploaded__c,(select name,id from Attachments Order By CreatedDate DESC limit 1),Phone,Email, Homepage_URL__c FROM Contact WHERE Proposals__c =: projectId AND Is_Primary__c =: false];
    //     System.debug('con Data::'+con);
    //     return con;
    // }

    public static Contact getContactHostInfo(string userId){
        try{

            Contact conRec = [SELECT Id,Name,AccountID,Host_Details__c FROM Contact WHERE Id=: userId];
                system.debug('conRec ::'+conRec);
                Contact con = New Contact();
                if(!string.isBlank(conRec.Host_Details__c)){
                    con = [SELECT Id,Salutation,FirstName,LastName, MailingCity, MailingState,MailingCountry,MailingPostalCode, MailingStreet,Nationality__c,Institution_Name__c,Department,Account.Name,
                    Designation__c,Profile_Pic_Attachment_Id__c,Uploaded__c,Country_Code__c,(select name,id from Attachments Order By CreatedDate DESC limit 1),
                    Phone,Email, Homepage_URL__c FROM Contact WHERE Id=: conRec.Host_Details__c];
                }
                system.debug('con ::'+con);
                return con;
            // Contact conRec = [select Id,(SELECT Id,FirstName,LastName, MailingCity, MailingState,MailingCountry,MailingPostalCode, MailingStreet,Nationality__c,Institution_Name__c,Department,Account.Name,
            //      Designation__c,Profile_Pic_Attachment_Id__c,Uploaded__c,Country_Code__c,(select name,id from Attachments Order By CreatedDate DESC limit 1),
            //      Phone,Email, Homepage_URL__c FROM Contact) FROM Contacts1 WHERE Id =:userId];
            //      return conRec;
            
        }catch(Exception e){
            return null;
        }
    }

    public static Application_Proposal__c getHostProjectDetails(string hashcode){

        contact userDetail = [select name,id,Proposals__c from contact where Login_Hash_Code__c =:hashcode limit 1];
        system.debug('userDetail ::'+userDetail.Proposals__c);
        Application_Proposal__c appProposal;
        if(userDetail.Proposals__c != null){
            appProposal = [SELECT Id,Host_Project_Title__c,Host_Abstract_Of_Project__c,Host_Funding_Source__c,Actual_Application_Start_Date__c,Actual_Application_End_Date__c FROM Application_Proposal__c where id=:userDetail.Proposals__c Limit 1];
        }
        system.debug('appproposal ::'+appProposal);
        return appProposal;
        // try{
        //     Application_Proposal__c appRecord = [SELECT Id,Host_Project_Title__c,Host_Abstract_Of_Project__c,Host_Funding_Source__c,Actual_Application_Start_Date__c,Actual_Application_End_Date__c FROM Application_Proposal__c WHERE Id=: projectId];
        //     return appRecord;
        // }catch(Exception e){
        //     return null;
        // }
    }


    public List<Contact> getContactEduOtherDet(String AccountId){
        Id eduId = Schema.SObjectType.Education_Details__c.getRecordTypeInfosByName().get('Education').getRecordTypeId();
        Id pubId = Schema.SObjectType.Publications_Patents__c.getRecordTypeInfosByName().get('Publication').getRecordTypeId();
        List<Contact> con = [SELECT Id,FirstName,LastName, MailingCity, MailingState,MailingCountry,MailingPostalCode, MailingStreet,Nationality__c,Institute_Name__c,Department,Publications_Patents__c, Designation__c,Phone,Email, Homepage_URL__c, 
        Birthdate,(Select id,Name,Institution_Name__c,Area_of_specialization__c,Degree__c,Start_Year__c from Education_Details__r where RecordTypeId=:eduId),(Select id,Name,Organization_Name__c,Position__c,End_Year__c from Employment_Details__r) FROM Contact WHERE AccountId=:AccountId];
        System.debug('con Data::'+con);
        return con;
    }
    public List<WrapperConsortiaContacts> getAccountContactEduOtherDetList(String ProposalId){
        Id eduId = Schema.SObjectType.Education_Details__c.getRecordTypeInfosByName().get('Education').getRecordTypeId();
        // Id pubId = Schema.SObjectType.Publications_Patents__c.getRecordTypeInfosByName().get('Publication').getRecordTypeId();
        List<account> accountList=[select id,name,Country_Type__c from Account where Proposals__c =:ProposalId];
        List<Id> ids=new List<Id>();
        for(Account acc:accountList){
            ids.add(acc.id);
        }
        List<Contact> Listcon = [SELECT AccountId,Id,FirstName,LastName, MailingCity, MailingState,MailingCountry,MailingPostalCode,Actual_Position__c, MailingStreet,Nationality__c,Institute_Name__c,Publications_Patents__c,Department, Designation__c,Phone,Email, Homepage_URL__c, Birthdate,
        (Select id,Name,Institution_Name__c,Area_of_specialization__c,Degree__c,Start_Year__c,End_Year__c from Education_Details__r where RecordTypeId=:eduId),(Select id,Name,Organization_Name__c,Position__c,End_Year__c,Start_Year__c from Employment_Details__r) FROM Contact WHERE AccountId IN:ids];

         List<WrapperConsortiaContacts> wrappper=new List<WrapperConsortiaContacts>();

        for(Account acc:accountList){
            WrapperConsortiaContacts wr=new WrapperConsortiaContacts();
            wr.AccName=acc.Name;
                wr.AccId=acc.Id;
                wr.Country=acc.Country_Type__c;
                List<Contact> lc=new List<Contact>();
            for(Contact con:Listcon){
                if(acc.Id==con.accountId){
                    lc.add(con);
                } 
            }
            if(lc.size() >0){
                wr.Lcon=lc;
            }
            wrappper.add(wr);
        }

        System.debug('con Data::'+wrappper);
        return wrappper;
    }
    public List<Education_Details__c> getEducationQualificationData(String ContactId){
        Id eduId = Schema.SObjectType.Education_Details__c.getRecordTypeInfosByName().get('Education').getRecordTypeId();
        // Id pubId = Schema.SObjectType.Publications_Patents__c.getRecordTypeInfosByName().get('Publication').getRecordTypeId();
        // List<account> accountList=[select id,name from Account where Proposals__c =:ProposalId];
        // List<Id> ids=new List<Id>();
        // for(Account acc:accountList){
        //     ids.add(acc.id);
        // }
        // List<Contact> Listcon = [SELECT AccountId,Id,FirstName,LastName, MailingCity, MailingState,MailingCountry,MailingPostalCode,Actual_Position__c, MailingStreet,Nationality__c,Institute_Name__c,Department, Designation__c,Phone,Email, Homepage_URL__c, Birthdate,
        // (Select id,Name,Institution_Name__c,Area_of_specialization__c,Degree__c,Start_Year__c,End_Year__c from Education_Details__r where RecordTypeId=:eduId),(Select id,Name,Organization_Name__c,Position__c,End_Year__c,Start_Year__c from Employment_Details__r),
        //  (Select id,Description__c from Publications_Patents__r where RecordTypeId=:pubId) FROM Contact WHERE AccountId IN:ids];
        List<Education_Details__c> ListInstanceEducationDetail=[Select id,Name,Institution_Name__c,Area_of_specialization__c,Degree__c,Start_Year__c,End_Year__c from Education_Details__c where RecordTypeId=:eduId and contact__c=:ContactId];
        System.debug('con Data::'+ListInstanceEducationDetail);
        return ListInstanceEducationDetail;
    }
    public List<Employment_Details__c> getEmploymentData(String ContactId){
        // List<Contact> Listcon = [SELECT AccountId,Id,FirstName,LastName, MailingCity, MailingState,MailingCountry,MailingPostalCode,Actual_Position__c, MailingStreet,Nationality__c,Institute_Name__c,Department, Designation__c,Phone,Email, Homepage_URL__c, Birthdate,
        // (Select id,Name,Institution_Name__c,Area_of_specialization__c,Degree__c,Start_Year__c,End_Year__c from Education_Details__r where RecordTypeId=:eduId),(Select id,Name,Organization_Name__c,Position__c,End_Year__c,Start_Year__c from Employment_Details__r),
        //  (Select id,Description__c from Publications_Patents__r where RecordTypeId=:pubId) FROM Contact WHERE AccountId IN:ids];
        List<Employment_Details__c> ListInstanceEducationDetail=[Select id,Name,Organization_Name__c,Position__c,End_Year__c,Start_Year__c from Employment_Details__c where contact__c=:ContactId];
        System.debug('con Data::'+ListInstanceEducationDetail);
        return ListInstanceEducationDetail;
    }
    public List<Publications_Patents__c> getPublicationData(String ContactId){
        Id pubId = Schema.SObjectType.Publications_Patents__c.getRecordTypeInfosByName().get('Publication').getRecordTypeId();
        List<Publications_Patents__c> ListInstanceEducationDetail=[Select id,Description__c from Publications_Patents__c where RecordTypeId=:pubId and contact__c=:ContactId];
        System.debug('con Data::'+ListInstanceEducationDetail);
        return ListInstanceEducationDetail;
    }
    public Contact getWorkshopDocUpload(String loginHashCode){
        // List<Education_Details__c> lEduDet=        
        return [SELECT Id,Name,Proposals__r.Id,Account_Country_Type__c,Nationality__c,Proposals__r.German_Invoice_Status__c,Proposals__r.Indian_Invoice_Status__c,Proposals__r.Name,Proposals__r.Invitation_Letter_Form_Status__c,Proposals__r.Proposal_Stages__c,Proposals__r.Decision_Letter_Sent__c,Proposals__r.Travel_Form_Status__c,Proposals__r.Visa_Stages__c,Proposals__r.Undertaking_Status__c From Contact WHERE Login_Hash_Code__c=: loginHashCode Limit 1];
        // return lEduDet;
    }
    public Contact getDocUploadDet(String loginHashCode){
        // List<Education_Details__c> lEduDet=     
        return [SELECT Id,Name,AccountId,Proposals__r.Id,Proposals__r.Name,Proposals__r.SC_Review_Stages__c,(select id,name,Bank_Account_Number__c,Bank_Address__c,Bank_Branch_Name__c,Bank_Name__c,Bank_IFSC_Code__c,Bank_SWIFT_Code__c,Bank_Type__c from Bank_Details__r),Proposals__r.Invitation_Letter_Form_Status__c,Proposals__r.Bank_Status__c,Proposals__r.Security_Sensitivity_Clearance_Stage__c,Proposals__r.Due_Diligence_Stage__c,Proposals__r.Proposal_Stages__c,Proposals__r.Decision_Letter_Sent__c,Proposals__r.Travel_Form_Status__c,Proposals__r.Visa_Stages__c,Proposals__r.Undertaking_Status__c From Contact WHERE Login_Hash_Code__c=: loginHashCode Limit 1];
        // return lEduDet;
    }
    public WrapperDocGrant getDocUploadDetPECFAR(String loginHashCode){
        // List<Education_Details__c> lEduDet=     
        contact instanceContact = [SELECT Id,Name,AccountId,Proposals__r.Id,Proposals__r.Name,(select id,name,Bank_Account_Number__c,Bank_Address__c,Bank_Branch_Name__c,Bank_Name__c,Bank_IFSC_Code__c,Bank_SWIFT_Code__c,Bank_Type__c from Bank_Details__r),Proposals__r.Invitation_Letter_Form_Status__c,Proposals__r.Proposal_Stages__c,Proposals__r.Due_Diligence_Stage__c,Proposals__r.Decision_Letter_Sent__c,Proposals__r.Travel_Form_Status__c,Proposals__r.Visa_Stages__c,Proposals__r.Undertaking_Status__c From Contact WHERE Login_Hash_Code__c=: loginHashCode Limit 1];
        account accInstance=[select id,name,(select id,name,Bank_Account_Number__c,Bank_Address__c,Bank_Branch_Name__c,Bank_Name__c,Bank_IFSC_Code__c,Bank_SWIFT_Code__c,Bank_Type__c from Bank_Details__r) from account where id =:instanceContact.AccountId];
        WrapperDocGrant wrapper=new WrapperDocGrant();
        wrapper.acc=accInstance;
        wrapper.con=instanceContact;
        return wrapper;
        // return lEduDet;
    }
    public class WrapperDocGrant{
        Account acc;
        Contact con;
    }
    public list<UserDocumentWrapper> getAllUserDoc(string contactId) {
        try{
            list<UserDocumentWrapper> udWrapperList = New List<UserDocumentWrapper>();
            map<string,ContentDocumentLink> userDocIdXcdLink = New map<string,ContentDocumentLink>();
            map<string,ContentDistribution> userDocIdXcDistrbtn = New map<string,ContentDistribution>();
            
            map<string,User_Document__c> idXUserDoc = New Map<string,User_Document__c>();
            map<string,ContentDocumentLink> udIdXcdLink = New Map<string,ContentDocumentLink>();
            // list<User_Document__c> getUserDoc = [select name,id,Status__c from User_Document__c where User_Document__c =:contactId];
            list<User_Document__c> getUserDoc = [select name,id,Status__c from User_Document__c where Contact__c =:contactId];
            // list<User_Document__c> getUserDoc = [select Id,Name,Doc_Name__c,Doc_Status__c from User_Document__c where Contact__c =:contactId];
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
    public Campaign getCampaignEndDate(String campaignName){
        return [SELECT NAME,EndDate FROM Campaign where Name=:campaignName Limit 1];
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
public class WrapperConsortiaContacts {
        String AccName;
        String AccId;
        String Country;
        List<Contact> Lcon;
}
}