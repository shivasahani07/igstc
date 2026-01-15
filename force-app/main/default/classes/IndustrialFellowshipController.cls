public withOut sharing class IndustrialFellowshipController {
    public IndustrialFellowshipController(){
        
    }
    @RemoteAction
    public static List<Education_Details__c> getEduQualification(String loginHashCode,String apaId){
        IndustrialFellowshipModel instanceIFM=new IndustrialFellowshipModel();
        return instanceIFM.getEduQualification(loginHashCode,apaId);
    }
    @RemoteAction
    public static String saveEduDetailIF(String loginHashCode,List<Education_Details__c> instanceEduDet,List<IndustrialFellowshipHelper.WrapperDate> dateList,String apaId){
        IndustrialFellowshipHelper instanceIFH=new IndustrialFellowshipHelper();
        return instanceIFH.saveEduDetailIF(loginHashCode,instanceEduDet,dateList,apaId);
    }
    @RemoteAction
    public static Achievement__c getAchievementsDet(String loginHashCode){ 
        IndustrialFellowshipModel instanceIFM=new IndustrialFellowshipModel();
        return instanceIFM.getAchievementsDet(loginHashCode);
    }
    @RemoteAction
    public static String upsertAchievements(String loginHashCode,Achievement__c instanceAchiev,String flag){
        IndustrialFellowshipHelper instanceIFH=new IndustrialFellowshipHelper();
        return instanceIFH.upsertAchievements(loginHashCode,instanceAchiev,flag);
    }
    @RemoteAction
    public static Contact getContactEmployement(String loginHashCode,String apaId){
        IndustrialFellowshipModel instanceIFM=new IndustrialFellowshipModel();
        return instanceIFM.getContactEmployement(loginHashCode,apaId);
    }
    @RemoteAction
    public static String saveContactEmployement(String loginHashCode,Contact con,List<IndustrialFellowshipHelper.employmentWrapper> emp,String apaId){
        IndustrialFellowshipHelper instanceIFH=new IndustrialFellowshipHelper();
        return instanceIFH.saveContactEmployement(loginHashCode,con,emp,apaId);
    }
    @RemoteAction
    public static Contact getContactDetailsFellowDet(String loginHashCode){
        IndustrialFellowshipModel instanceIFM=new IndustrialFellowshipModel();
        return instanceIFM.getContactDetailsFellowDet(loginHashCode);
    }
    @RemoteAction
    public static String saveFellowshipDetails(String loginHashCode,Contact[] con,Contact pContact)
    {
        IndustrialFellowshipHelper instanceIFH=new IndustrialFellowshipHelper();
        return instanceIFH.saveFellowshipDetails(loginHashCode,con,pContact);
    }
    @RemoteAction
    public static String saveFellowshipProposal(String loginHashCode,Application_Proposal__c prop,Contact pContact,String AccountId, String recordType)
    {
        IndustrialFellowshipHelper instanceIFH=new IndustrialFellowshipHelper();
        return instanceIFH.saveFellowshipProposal(loginHashCode,prop,pContact,AccountId,recordType);
    }
    @RemoteAction
    public static Contact getContactSingh(String loginHashCode){
        IndustrialFellowshipModel instanceIFM=new IndustrialFellowshipModel();
        return instanceIFM.getContactSingh(loginHashCode);
    }

// ********************Added by Harsh 21/12/2025 12:45**************************
    @RemoteAction
public static Application_Proposal__c getProposalData(String proposalId) {
    return [SELECT Id, Name, Proposal_Stages__c 
            FROM Application_Proposal__c 
            WHERE Id = :proposalId 
            LIMIT 1];
}
    // @RemoteAction
    // public static String saveApplicantPortalSingh(String loginHashCode,Contact con,Account acc,Integer year,Integer month,Integer day, String contactId, String recordTypeName){
    //     IndustrialFellowshipHelper instanceIFH=new IndustrialFellowshipHelper();
    //     System.debug('IndustrialFellowshipHelper called');
    //     return instanceIFH.saveApplicantPortalSingh(loginHashCode,con,acc,year,month,day,contactId,recordTypeName);
    // }
    @RemoteAction
public static String saveApplicantPortalSingh(String loginHashCode,Contact con,Account acc,Integer year,Integer month,Integer day, String contactId, String recordTypeName, String campaignId, String yearlyCallId){
    System.debug('IndustrialFellowshipController called');
    return IndustrialFellowshipHelper.saveApplicantPortalSingh(loginHashCode,con,acc,year,month,day,contactId,recordTypeName,campaignId, yearlyCallId );
}
    @RemoteAction
    public static Contact getProposalDet(String loginHashCode){
        IndustrialFellowshipModel instanceIFM=new IndustrialFellowshipModel();
        return instanceIFM.getProposalDet(loginHashCode);
    }
    @RemoteAction
    public static String saveProjectDetailsSing(String loginHashCode,Contact pContact,Application_Proposal__c prop,String AccountId,String recordType){
        IndustrialFellowshipHelper instanceIFH=new IndustrialFellowshipHelper();
        return instanceIFH.saveProjectDetailsSing(loginHashCode,pContact,prop,AccountId,recordType);
    }

    // Wiser
    @RemoteAction 
    public static Contact getContactWiser(String conId){
        return IndustrialFellowshipHelper.getContactInfoWiser(conId);
    }
   // Wiser 1
    @RemoteAction 
    public static String saveApplicantPortalWiser(contact conRec,Account acc,integer birthYear,integer birthMonth,integer birthDay, string campaignId){
        IndustrialFellowshipHelper instanceIFM = new IndustrialFellowshipHelper();
        return instanceIFM.insertApplicantDetails(conRec, acc, birthYear, birthMonth, birthDay, campaignId);
    }

   // Host Information 1
   @RemoteAction 
   public static Contact getContactHostInfo(String hashcode){
    return IndustrialFellowshipModel.getContactHostInfo(hashcode);
   }

   
   // Host Information 1
   @RemoteAction 
    public static String saveApplicationPortalHostInformation(Contact hostDetails, Account accDet, string projectId, string recordtype){
        system.debug('hostDetails-->'+hostDetails);
        system.debug('projectId-->'+projectId);

        return IndustrialFellowshipHelper.insertHostInfoDetails(hostDetails, accDet, projectId, recordtype);
    }

    // ------------------------------------- WISER METHOD TO GET PROPOSAL ----------------------------------------- //
    /* @RemoteAction
    public static Application_Proposal__c getHostProjectDetails(string hashcode){
        return IndustrialFellowshipModel.getHostProjectDetails(hashcode);
    } */

    @RemoteAction
    public static Application_Proposal__c getHostProjectDetails(String proposalId){
        return IndustrialFellowshipModel.getHostProjectDetails(proposalId);
    }

    // ------------------------------------- WISER METHOD TO CREATE PROPOSAL ----------------------------------------- //
    /* @RemoteAction 
    public static String saveHostProjectInformation(Application_Proposal__c hostDetails, integer sDate, integer sMonth, integer sYear, integer eDate, integer eMonth, integer eYear){
        return IndustrialFellowshipHelper.insertHostProjectDetails(hostDetails, sDate, sMonth, sYear, eDate, eMonth, eYear);
    } */

    @RemoteAction 
    public static IndustrialFellowshipHelper.ProposalAndAPAWrapper saveHostProjectInformation(Application_Proposal__c hostDetails, String proposalId, String candidateId, String yearlyCallId, Integer sDate, Integer sMonth, Integer sYear, Integer eDate, Integer eMonth, Integer eYear){
        return IndustrialFellowshipHelper.insertHostProjectDetails(hostDetails, proposalId, candidateId, yearlyCallId, sDate, sMonth, sYear, eDate, eMonth, eYear);
    }

    // @RemoteAction 
    // public static String saveHostProjectInformation(Application_Proposal__c hostDetails, String proposalId, String candidateId, String yearlyCallId, Integer sDate, Integer sMonth, Integer sYear, Integer eDate, Integer eMonth, Integer eYear){
    //     return IndustrialFellowshipHelper.insertHostProjectDetails(hostDetails, proposalId, candidateId, yearlyCallId, sDate, sMonth, sYear, eDate, eMonth, eYear);
    // }

    //consortia functions
    @RemoteAction 
    public static String upsertConsortiaAccountDet(Account instanceAcc, String projectId){
        IndustrialFellowshipHelper instanceIFH = new IndustrialFellowshipHelper();
        return instanceIFH.upsertConsortiaAccountDet(instanceAcc, projectId);
    }
    @RemoteAction 
    public static String upsertConsortiaContactsDet(Contact instanceCon,String accountId, String projectId){
        IndustrialFellowshipHelper instanceIFH = new IndustrialFellowshipHelper();
        return instanceIFH.upsertConsortiaContactsDet(instanceCon, accountId,projectId);
    }
    @RemoteAction 
    public static List<Contact> getContactEduOtherDet(String AccountId){
        IndustrialFellowshipModel instanceIFM = new IndustrialFellowshipModel();
        return instanceIFM.getContactEduOtherDet(AccountId);
    }
    @RemoteAction 
    public static String saveOtherDet(List<Education_Details__c> instanceEdu,List<Employment_Details__c> insempdet,List<Publications_Patents__c> instpublication){
        IndustrialFellowshipHelper instanceIFH = new IndustrialFellowshipHelper();
        return instanceIFH.saveOtherDet(instanceEdu,insempdet,instpublication);
    }
    @RemoteAction 
    public static String deleteAccount(String accountId){
        IndustrialFellowshipHelper instanceIFH = new IndustrialFellowshipHelper();
        return instanceIFH.deleteAccount(accountId);
    }
    @RemoteAction 
    public static List<IndustrialFellowshipModel.WrapperConsortiaContacts> getAccountContactEduOtherDetList(String ProposalId){
        IndustrialFellowshipModel instanceIFM = new IndustrialFellowshipModel();
        return instanceIFM.getAccountContactEduOtherDetList(ProposalId);
    }
    @RemoteAction 
    public static String saveAccountContactEduOtherDetList(String ProposalId,String accountId,Contact con,List<Employment_Details__c> ed,List<Education_Details__c> edu,String flag){
        IndustrialFellowshipHelper instanceIFH = new IndustrialFellowshipHelper();
        return instanceIFH.saveAccountContactEduOtherDetList(ProposalId,accountId,con,ed,edu,flag);
    }
    /* @RemoteAction 
    public static String saveWorkPackageDet(List<IndustrialFellowshipHelper.WrapperWorkpackageDet> wrapper,String ProposalId){
        IndustrialFellowshipHelper instanceIFH = new IndustrialFellowshipHelper();
        return instanceIFH.saveWorkPackageDet(wrapper,ProposalId);
    } */
    @RemoteAction 
    public static String saveWorkPackageDet(List<IndustrialFellowshipHelper.WrapperWorkpackageDet> wrapper, String ProposalId, String proposalStage){
        IndustrialFellowshipHelper instanceIFH = new IndustrialFellowshipHelper();
        return instanceIFH.saveWorkPackageDet(wrapper, ProposalId, proposalStage);
    }
    @RemoteAction
    public static string deleteWorkPackageDetails(string workPackageId){
        return IndustrialFellowshipHelper.deleteWorkPackageDetails(workPackageId);
    }
    @RemoteAction 
    public static List<Education_Details__c> getEducationQualificationData(String ContactId){
        IndustrialFellowshipModel instanceIFM = new IndustrialFellowshipModel();
        return instanceIFM.getEducationQualificationData(ContactId);
    }
    @RemoteAction 
    public static List<Employment_Details__c> getEmploymentData(String ContactId){
        IndustrialFellowshipModel instanceIFM = new IndustrialFellowshipModel();
        return instanceIFM.getEmploymentData(ContactId);
    }
    @RemoteAction 
    public static List<Publications_Patents__c> getPublicationData(String ContactId){
        IndustrialFellowshipModel instanceIFM = new IndustrialFellowshipModel();
        return instanceIFM.getPublicationData(ContactId);
    }
    @RemoteAction 
    public static String deleteContact(String contactId){
        IndustrialFellowshipHelper instanceIFH = new IndustrialFellowshipHelper();
        return instanceIFH.deleteContact(contactId);
    }
    @RemoteAction 
    public static String deleteEducation(String eduId){
        IndustrialFellowshipHelper instanceIFH = new IndustrialFellowshipHelper();
        return instanceIFH.deleteEducation(eduId);
    }
    @RemoteAction 
    public static String deleteEmployment(String employmentId){
        IndustrialFellowshipHelper instanceIFH = new IndustrialFellowshipHelper();
        return instanceIFH.deleteEmployment(employmentId);
    }
    @RemoteAction 
    public static String deletePublication(String publicationId){
        IndustrialFellowshipHelper instanceIFH = new IndustrialFellowshipHelper();
        return instanceIFH.deletePublication(publicationId);
    }    
    @RemoteAction
    public static String doUploadAttachment(string type, String attachmentBody, String attachmentName,string conId, String attachmentId, string attId) {
        return IndustrialFellowshipHelper.doUploadAttachment(type,attachmentBody, attachmentName,conId, attachmentId, attId);
    }
    @RemoteAction
    public static String UploadAttachment(string type, String attachmentBody, String attachmentName,string conId, String attachmentId, string attId) {
        return IndustrialFellowshipHelper.doUploadAttachment(type,attachmentBody, attachmentName,conId, attachmentId, attId);
    }

    @RemoteAction
    public static list<IndustrialFellowshipHelper.UserDocumentWrapper> getContactUserDoc(string parentId) {
        list<IndustrialFellowshipHelper.UserDocumentWrapper> userDocList = IndustrialFellowshipHelper.getContactUserDoc(parentId);
        return userDocList; 
    }

    @RemoteAction
    public static String deleteEducationLineItem(String lineItemId) {
        IndustrialFellowshipHelper instanceIFH = new IndustrialFellowshipHelper();
        return instanceIFH.deleteEducationLineItem(lineItemId);
    }
    @RemoteAction
    public static String submitProposalIF(Contact con,String saveType,String proposalId,integer year,integer month,integer day) {
        IndustrialFellowshipHelper instanceIFH = new IndustrialFellowshipHelper();
        return instanceIFH.submitProposalIF(con,saveType,proposalId,year,month,day);
    }
    @RemoteAction
    public static String UploadAttachments(String attachmentBody, String attachmentName, string cvId, String udId) {
        IndustrialFellowshipHelper instanceIFH = new IndustrialFellowshipHelper();
        return instanceIFH.UploadAttachments(attachmentBody,attachmentName, cvId, udId);
    }
    @RemoteAction
    public static String submitSingApp(String projectId,Integer year, Integer month, Integer day) {
        IndustrialFellowshipHelper instanceIFH = new IndustrialFellowshipHelper();
        return instanceIFH.submitSingApp(projectId,year,month,day);
    }
    @RemoteAction
    public static Account getAccountBankDetails(String accountId) {
        IndustrialFellowshipModel instanceIFM = new IndustrialFellowshipModel();
        return instanceIFM.getAccountBankDetails(accountId);
    }
    @RemoteAction
    public static String saveAccountBankDetails(Bank_Details__c instanceBankDetails) {
        IndustrialFellowshipHelper instanceIFH = new IndustrialFellowshipHelper();
        return instanceIFH.saveAccountBankDetails(instanceBankDetails);
    }
    // @RemoteAction
    // public static String upsertProposal(Application_Proposal__c ProposalId,string ContactId) {
    //     IndustrialFellowshipHelper instanceIFH = new IndustrialFellowshipHelper();
    //     return instanceIFH.upsertProposal(ProposalId,ContactId);
    // }
    @RemoteAction
    public static Contact getDocUploadDet(String loginHashCode){
        IndustrialFellowshipModel instanceIFM = new IndustrialFellowshipModel();
        return instanceIFM.getDocUploadDet(loginHashCode);
    }
    @RemoteAction
    public static IndustrialFellowshipModel.WrapperDocGrant getDocUploadDetPECFAR(String loginHashCode){
        IndustrialFellowshipModel instanceIFM = new IndustrialFellowshipModel();
        return instanceIFM.getDocUploadDetPECFAR(loginHashCode);
    }
    @RemoteAction
    public static Contact getWorkshopDocUpload(String loginHashCode){
        IndustrialFellowshipModel instanceIFM = new IndustrialFellowshipModel();
        return instanceIFM.getWorkshopDocUpload(loginHashCode);
    }
    @RemoteAction
    public static IndustrialFellowshipHelper.ProposalAccountWrapper getProposalAccounts(String ProposalId, String loginHashCode ){
        return IndustrialFellowshipHelper.getProposalAccounts(ProposalId, loginHashCode);
    }

    @RemoteAction
    public static String createExpenseDeclarationDetails(List<Expense_Line_Item__c> expenseLineItem,String proposalId,String accId){
        return IndustrialFellowshipHelper.createExpenseDeclarationDetails(expenseLineItem, proposalId, accId);
    }

    @RemoteAction
    public static List<Expense_Head__c> getExpenseRecords(String ProposalId){
        return IndustrialFellowshipHelper.getExpenseRecords(ProposalId);
    }  

    @RemoteAction
    public static List<Expense_Head__c> createExpenceHead(List<Expense_Head__c> allExpenceHead){
        return IndustrialFellowshipHelper.createExpenceHead(allExpenceHead);
    }

    @RemoteAction
    public static String saveExpenceLineItem(List<Expense_Line_Item__c> expLineItem, string appId, Integer amount){
        return IndustrialFellowshipHelper.saveExpenceLineItem(expLineItem, appId, amount);
    }

    @RemoteAction
    public static String saveExpenceLineItemWISER(List<Expense_Line_Item__c> expLineItem, String totalSum){
        return IndustrialFellowshipHelper.saveExpenceLineItemWISER(expLineItem,totalSum);
    }

    @RemoteAction
    public static String updateIFDocStatus(Application_Proposal__c instanceProposal){
        IndustrialFellowshipHelper instanceIFH = new IndustrialFellowshipHelper();
        return instanceIFH.updateIFDocStatus(instanceProposal);
    }

    @RemoteAction
    public static Bank_Details__c getBankDetails(string projectId){
        return IndustrialFellowshipHelper.getBankDetails(projectId);
    }

    @RemoteAction
    public static string submitWiserBankDetails (Bank_Details__c bnkDetails) {
        upsert bnkDetails;
        return 'success';
    }
    @RemoteAction
    public static list<IndustrialFellowshipModel.UserDocumentWrapper> getAllUserDoc(String contactId){
        IndustrialFellowshipModel instanceIFM = new IndustrialFellowshipModel();
        return instanceIFM.getAllUserDoc(contactId);
    }
    @RemoteAction
    public static string UploadDocuments(String attachmentBody, String attachmentName, string cvId, String udId,string docName,string contactId,string proposalId,string createTask,string taskSubject){
        IndustrialFellowshipHelper instanceIFH = new IndustrialFellowshipHelper();
        return instanceIFH.UploadDocuments(attachmentBody,attachmentName,cvId,udId,docName,contactId,proposalId,createTask,taskSubject);
    }
    @RemoteAction
    public static IndustrialFellowshipHelper.insertApplicationWrapper updateIndusrianFellowshipBasicDet(String campaignId,String candidateId,Contact InstanceCon,Integer birthDay,Integer birthMonth,Integer birthYear,Integer phdEnrollYear,Integer phdEnrollMonth,Integer phdEnrollDay,Integer phdAwardYear,Integer phdAwardMonth,Integer phdAwardDay,Integer phdThesisYear,Integer phdThesisMonth,Integer phdThesisDay,Application_Proposal__c prop){
       // IndustrialFellowshipHelper instanceIFH=new IndustrialFellowshipHelper();
        return IndustrialFellowshipHelper.updateIndusrianFellowshipBasicDet(campaignId,candidateId,InstanceCon,birthDay,birthMonth,birthYear,phdEnrollYear,phdEnrollMonth,phdEnrollDay,phdAwardYear,phdAwardMonth,phdAwardDay,phdThesisYear,phdThesisMonth,phdThesisDay,prop);
    }
    @RemoteAction
    public static String reviewAppDocGen(string proID){
        IndustrialFellowshipHelper instanceIFH=new IndustrialFellowshipHelper();
        return instanceIFH.reviewAppDocGen(proID);
    }
    @RemoteAction
    public static list<Attachment> getCongaDoc(string proID){
        IndustrialFellowshipHelper instanceIFH=new IndustrialFellowshipHelper();
        return instanceIFH.getCongaDoc(proID);
    }
    @RemoteAction
    public static String saveBankDet(Bank_Details__c instanceBank){
        IndustrialFellowshipHelper instanceIFH=new IndustrialFellowshipHelper();
        return instanceIFH.saveBankDet(instanceBank);
    }
    @RemoteAction
    public static String doCUploadAttachmentA(String attachmentBody, String attachmentName, string cvId, String udId,string projectid,string CreateTask,string TaskSubject) {
        system.debug('attachmentBody---'+attachmentName+'---attachmentId---'+cvId+'---cvId---'+udId);
        system.debug('cvId---'+cvId+'---udId---'+udId);
        User_Document__c userDocc = New User_Document__c();
        userDocc.Id = udId;
        userDocc.Status__c = 'Uploaded';
        upsert userDocc;
        if(String.isBlank(attachmentBody) || String.isBlank(udId))
            return 'ERROR';
        if(String.isBlank(cvId)) {
            ContentVersion conVer = new ContentVersion();
            conVer.ContentLocation = 'S'; 
            conVer.PathOnClient = 'attachmentName'; 
            conVer.Title = attachmentName; 
            conVer.VersionData = EncodingUtil.base64Decode(attachmentBody); 
            conVer.isMajorVersion = false;
            insert conVer;   
            
            ContentDistribution cdl = new ContentDistribution();
            cdl.ContentVersionId = conVer.Id;
            cdl.Name = 'PublicShare';
            cdl.RelatedRecordId = udId;
            insert cdl;
            system.debug('ContentDistribution----'+cdl);
            Id conDoc = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:conVer.Id].ContentDocumentId;
            ContentDocumentLink conDocLink = New ContentDocumentLink();
            conDocLink.LinkedEntityId = udId; 
            conDocLink.ContentDocumentId = conDoc; 
            conDocLink.shareType = 'V';
            insert conDocLink;
            if(CreateTask=='Create'){
                Task taskRecord = New Task();
                taskRecord.WhatId = projectid;
                taskRecord.Subject = TaskSubject;
                insert taskRecord;
            }
            return conVer.Id;

        }else {
            List<ContentVersion> cvList = [SELECT Id, VersionData FROM ContentVersion WHERE Id = :cvId];
            if(!cvList.isEmpty()) {
                ContentVersion cVersion = cvList[0];
                if(cVersion.VersionData != null) {
                    String newBody = EncodingUtil.base64Encode(cVersion.VersionData);
                    newBody += attachmentBody;
                    cVersion.VersionData = EncodingUtil.base64Decode(newBody); 
                    update cVersion;
                    if(CreateTask=='Create'){
                        Task taskRecord = New Task();
                        taskRecord.WhatId = projectid;
                        taskRecord.Subject = TaskSubject;
                        insert taskRecord;
                    }
                    return cVersion.Id;
                }   
            }
        }
        return 'Success';
    }

    @RemoteAction
    public static String UploadDocumentsUpdated(String attachmentBody, String attachmentName, string cvId, String udId,string docName,string contactId,string proposalId,string CreateTask,string TaskSubject) {
        system.debug('attachmentBody---'+attachmentName+'---attachmentId---'+cvId+'---cvId---'+udId);
        system.debug('cvId---'+cvId+'---udId---'+udId);
        User_Document__c userDocc = New User_Document__c();
        userDocc.Id = udId;
        userDocc.Status__c = 'Uploaded';
        system.debug('status ::'+userDocc);
        upsert userDocc;
                    
        Attachment a = new Attachment(parentId = udId, name=attachmentName, body = Blob.valueOf(attachmentBody));
        insert a;
        if(String.isBlank(attachmentBody) || String.isBlank(udId))
            return 'ERROR';
        if(String.isBlank(cvId)) {
            ContentVersion conVer = new ContentVersion();
            conVer.ContentLocation = 'S';
            conVer.PathOnClient = '/'+System.now()+attachmentName;//'attachmentName';
            conVer.Title = attachmentName;
            conVer.VersionData = EncodingUtil.base64Decode(attachmentBody);
            conVer.isMajorVersion = false;
            insert conVer;  
           
            ContentDistribution cdl = new ContentDistribution();
            cdl.ContentVersionId = conVer.Id;
            cdl.Name = 'PublicShare';
            cdl.RelatedRecordId = udId;
            insert cdl;
            system.debug('ContentDistribution----'+cdl);
            Id conDoc = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:conVer.Id].ContentDocumentId;
            ContentDocumentLink conDocLink = New ContentDocumentLink();
            conDocLink.LinkedEntityId = udId;
            conDocLink.ContentDocumentId = conDoc;
            conDocLink.shareType = 'V';
            insert conDocLink;

            if(CreateTask=='Create'){
                Task taskRecord = New Task();
                taskRecord.WhatId = proposalId;
                taskRecord.Subject = TaskSubject;
                insert taskRecord;
            }

            return conVer.Id;

        }else {
            List<ContentVersion> cvList = [SELECT Id, VersionData FROM ContentVersion WHERE Id = :cvId];
            if(!cvList.isEmpty()) {
                ContentVersion cVersion = cvList[0];
                if(cVersion.VersionData != null) {
                    String newBody = EncodingUtil.base64Encode(cVersion.VersionData);
                    newBody += attachmentBody;
                    cVersion.VersionData = EncodingUtil.base64Decode(newBody);
                    update cVersion;
                    return cVersion.Id;
                }  
            }
        }
       return 'Success';
    }

    @RemoteAction
    public static List<String> getCitiesByState(String country, String state) {

        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://countriesnow.space/api/v0.1/countries/cities');
        req.setMethod('POST');
        req.setTimeout(120000); // important
        req.setHeader('Content-Type', 'application/json');
        req.setHeader('Accept', 'application/json');

        req.setBody(JSON.serialize(new Map<String, String>{
            'country' => country,
            'state'   => state
        }));

        Http http = new Http();
        HttpResponse res = http.send(req);

        System.debug('STATUS CODE => ' + res.getStatusCode());
        System.debug('STATUS      => ' + res.getStatus());
        System.debug('BODY        => ' + res.getBody());

        if (res.getStatusCode() == 200) {
            Map<String, Object> parsed =
                (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            return (List<String>) parsed.get('data');
        }

        throw new CalloutException('API failed: ' + res.getStatus());
    }

}