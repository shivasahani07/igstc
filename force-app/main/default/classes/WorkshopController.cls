public without sharing class WorkshopController {
    public string tabValues  {get;set;}
    public string thematicAreaList {get;set;}
    public string countrytype  {get;set;}
    public string countryCode  {get;set;}
    public string availingFellowship  {get;set;}
    public string pairedApplicant  {get;set;}
    public string participantType {get;set;}
    public string bankType {get;set;}
    public string participatingWorkshop {get;set;}
    // public string degree  {get;set;}
    public string specialization  {get;set;}
     
    public string presentingWorkshop  {get;set;} 
    public string currencyType2  {get;set;} 
    public string stage  {get;set;}
    public String ApplicantPortalSiteURL {get;set;}
    public string secondstage  {get;set;}
    public string emailVerified  {get;set;}
    public string proposalStage  {get;set;}
    public String candidateId {get;set;}
    public string campaigntype {get;set;}
    public string contactId {get;set;}
    public string financialConDetails {get;set;}
    public string gender {get;set;}
    public string nationality {get;set;}
    public string country {get;set;}
    public string available_followship {get;set;}
    public string associated_with_igstc {get;set;}
    // public String nature_of_Job{get;set;}
    public String expanseHead {get;set;}
    public String applicantName {get;set;}
    public String applicantEmail {get;set;}
    public boolean isPrimaryContact {get;set;}
    public boolean isCoordinator {get;set;}
    public string accountId {get;set;}
    public String projectId {get;set;}
    public string natureOfThesisWork {get;set;}
    public string natureOfPhDWork {get;set;}
    public string percentCGPA {get;set;}
    public string states {get;set;}
    public Date signDate {get;set;}
    public string campaignData {get;set;}
    public string currencyPickList  {get;set;}
    public Boolean partnerSubmission {get;set;}
    public List<proposalWrap> proposalWrapperList {get;set;}
    
    public WorkshopController() {
        ApplicantPortalSiteURL = Constants.CANDIDATE_SITE ;
        list<Application_Portal_Tabs__c> cdTabs = [select name,Tab_Label__c,id,Controller_Name__c,Display_Order__c from Application_Portal_Tabs__c ORDER BY Display_Order__c];
        tabValues = JSON.serialize(cdTabs);
        thematicAreaList = JSON.serialize(fetchAllThematicArea());
        countrytype = JSON.serialize(Utility.getPicklistValues('Account' , 'Country_Type__c'));
        countryCode = JSON.serialize(Utility.getPicklistValues('Contact' , 'Country_Code__c'));
        natureOfThesisWork = JSON.serialize(Utility.getPicklistValues('Education_Details__c' , 'Nature_of_Thesis_Work__c'));
        natureOfPhDWork = JSON.serialize(Utility.getPicklistValues('Education_Details__c' , 'Nature_of_PhD_Work__c'));
        currencyType2 = JSON.serialize(Utility.getPicklistValues('Expense_Line_Item__c' , 'Currency_Type2__c'));
        availingFellowship = JSON.serialize(Utility.getPicklistValues('Application_Proposal__c' , 'Availing_any_other_fellowship_currently__c'));
        pairedApplicant = JSON.serialize(Utility.getPicklistValues('Application_Proposal__c' , 'Paired_Applicant_associated_with_IGSTC__c'));
        participantType = JSON.serialize(Utility.getPicklistValues('Participants__c' , 'Participant_Type__c'));
        bankType = JSON.serialize(Utility.getPicklistValues('Bank_Details__c' , 'Bank_Type__c'));
        participatingWorkshop = JSON.serialize(Utility.getPicklistValues('Participants__c' , 'Whether_Participant_is_presenting__c'));
        // degree = JSON.serialize(Utility.getPicklistValues('Education_Details__c' , 'Degree__c'));
        specialization = JSON.serialize(Utility.getPicklistValues('Education_Details__c' , 'Specialization__c'));
        percentCGPA = JSON.serialize(Utility.getPicklistValues('Education_Details__c' , 'Percentage_cgpa__c'));
        states = JSON.serialize(Utility.getPicklistValues('Contact' , 'States__c'));
        presentingWorkshop = JSON.serialize(Utility.getPicklistValues('Contact' , 'Presenting_Workshop__c'));
        financialConDetails = JSON.serialize([SELECT German_Academia__c,German_Institute__c,Indian__c,Indian_Institute__c FROM Financial_Overview_Conditions__c limit 1]);
        campaignData=JSON.serialize([SELECT Id,Name,Description,EndDate,Image_URL__c,RedirectPage__c,(select name,id from Attachments order by createdDate DESC),(SELECT Id,Campaign__c,Name,Description__c FROM Campaign_Guidlines__r) FROM Campaign]);
        stage = JSON.serialize(Utility.getPicklistValues('Application_Proposal__c' , 'Stage__c'));
        String rawId = ApexPages.currentPage().getParameters().get('id');
        if (String.isNotBlank(rawId)) {  
            Integer slashIndex = rawId.indexOf('/');
            candidateId = (slashIndex > -1) ? rawId.substring(0, slashIndex) : rawId;
        }
        gender = JSON.serialize(Utility.getPicklistValues('Contact' , 'Gender__c'));
        nationality = JSON.serialize(Utility.getPicklistValues('Contact' , 'Nationality__c'));
        country = JSON.serialize(Utility.getPicklistValues('Contact' , 'Country__c'));
        available_followship = JSON.serialize(Utility.getPicklistValues('Contact' , 'Availing_Fellowship__c'));
        available_followship = JSON.serialize(Utility.getPicklistValues('Contact' , 'Associated_with_IGSTC__c'));
        // nature_of_Job = JSON.serialize(Utility.getPicklistValues('Employment_Details__c' , 'Nature_of_Job__c'));
        expanseHead = JSON.serialize(Utility.getPicklistValues('Financial_Contribution__c' , 'Expanse_Head__c'));
        currencyPickList = JSON.serialize(Utility.getPicklistValues('Existing_Grants__c' , 'Currency__c'));
        signDate = System.today();
        system.debug('candidateId---'+candidateId);
        if(!string.isBlank(candidateId)){
            List<contact> applicantDetails = [SELECT Id,Email,Status__c,account.Is_Coordinator__c,name,Account.Id,Proposals__c,Proposals__r.Campaign__r.Name,Email_Verified__c,Is_Primary__c,Campaign__c,Login_Hash_Code__c,(SELECT Id, Proposals__r.Id, Proposals__r.Stage__c, Proposals__r.Proposal_Stages__c FROM Applicant_Proposal_Associations__r) FROM contact WHERE Login_hash_code__c =:candidateId];
            for(Contact conRec : applicantDetails){
                emailVerified = String.valueOf(conRec.Email_Verified__c);
            }
            // if(!string.isBlank(applicantDetails[0].Proposals__c)){
            //     Application_Proposal__c proposal = [SELECT Id,Name,Stage__c,Proposal_Stages__c FROM Application_Proposal__c where Id =: applicantDetails[0].Proposals__c];
            //     secondstage = proposal.stage__c;
            //     proposalStage = proposal.Proposal_Stages__c;
            // }
            proposalWrapperList = new List<proposalWrap>();

            if(!applicantDetails[0].Applicant_Proposal_Associations__r.isEmpty()){
                for(Applicant_Proposal_Association__c apa : applicantDetails[0].Applicant_Proposal_Associations__r) {
                    proposalWrap wrap = new proposalWrap();
                    wrap.apaId = apa.Id;
                    wrap.Id = apa.Proposals__r.Id;
                    wrap.proposalStage = apa.Proposals__r.Proposal_Stages__c;
                    // secondStage = apa.Proposals__r.Stage__c=='2nd Stage' ?'true':'false';
                    // System.debug('secondStage : -------- ' + secondStage);
                    proposalStage= apa.Proposals__r.Proposal_Stages__c;
                    System.debug('Stage = ' + proposalStage);
                    wrap.stage = apa.Proposals__r.Stage__c;
                    wrap.secondStage = (apa.Proposals__r.Stage__c == '2nd Stage');
                    proposalWrapperList.add(wrap);
                }
            }
            
            if(applicantDetails.size() >0){
                contactId = applicantDetails[0].Id;
                projectId = applicantDetails[0].Proposals__c;
                campaigntype = applicantDetails[0].Campaign__c;
                applicantName=applicantDetails[0].Name;
                applicantEmail=applicantDetails[0].Email;
                isPrimaryContact=applicantDetails[0].Is_Primary__c;
                accountId=applicantDetails[0].Account.Id;
                isCoordinator=applicantDetails[0].Account.Is_Coordinator__c;
                if(applicantDetails[0].Status__c == 'Submitted'){
                    partnerSubmission = true;
                }else {
                    partnerSubmission = false;
                }
                
            }
        }
    }
    
    public class proposalWrap {
        public String Id {get; set;}
        public String stage {get; set;}
        public String proposalStage {get; set;}
        public Boolean secondStage {get;set;}
        public String apaId {get;set;}
    }
    
    public static String generateRandomString(){
        String charString = '!@#$%^&*()nopqrstuvwABCDPQRSTUVWXYZ0123456789abcdefghijkEFGHIJKLMNOlmxyz';
        String randomNew = '';
        while (randomNew .length() < 10){
            Integer changeInt = Math.mod(Math.abs(Crypto.getRandomInteger()), charString.length());
            randomNew += charString.substring(changeInt , changeInt +1);
        }
        return  randomNew;
    }
    
    
    @InvocableMethod(label='Update password' description='Updating null password for Contacts.' category='Contact')
    public static void updatePassword(List<string> ids) {
        List<Contact> conList = New List<Contact>();
        for(String con : ids){
            Contact conRec = New Contact();
            conRec.Id = con;
            conRec.Password__c = generateRandomString();
            conList.add(conRec);
        }
        update conList;
        system.debug('ids --> '+ids);
        // return null;
    }
    
    @RemoteAction
    public static FAQ_Links__c getFAQLinks(String programme){
        FAQ_Links__c links = New FAQ_Links__c();
        try{
            links = [SELECT Id,Name,Basic_Guidelines__c,Call_Text__c,FAQs__c,Programme__c FROM FAQ_Links__c WHERE Programme__c =: programme];
            return links;
        }catch(Exception e){
            return links;
        }
    }
    @RemoteAction
    public static List<Campaign_Theme__c> fetchCampaignThemes(){
        List<Campaign_Theme__c> campaignThemeList = [SELECT Id,Name FROM Campaign_Theme__c];
        if(!campaignThemeList.isEmpty()){
            return campaignThemeList;
        }
        return Null;
    }
    
    //*********************************** NEW GLOBAL LOGIN METHODS *********************************************
    //Added by Vikash
    public class ApplicantWrap {
        public List<Campaign> campaignList {get; set;}
        public List<Applicant_Proposal_Association__c> appliedCampaign {get; set;}
    }
    
    @RemoteAction
    public static ApplicantWrap getApplicantData( String candidateId){
        ApplicantWrap wrap = new ApplicantWrap();
        try{
            List<Campaign> campaignList = [SELECT Id,Name,Description,Actual_End_Date__c,Disable_Campaign__c,EndDate,Image_URL__c,RedirectPage__c,Cut_Off_Start_Date__c,Cut_Off_End_Date__c,Icon__c,(select name,id from Attachments order by createdDate DESC),(SELECT Id,Campaign__c,Name,Description__c FROM Campaign_Guidlines__r) FROM Campaign];
            if(!campaignList.isEmpty()){
                wrap.campaignList =  campaignList;
            }
            List<Applicant_Proposal_Association__c> applicantAssociationList= [SELECT Id, Contact__c, Proposals__c, Proposals__r.Campaign__r.Name, Proposals__r.Campaign__r.Description, Proposals__r.Campaign__r.Actual_End_Date__c, Proposals__r.Campaign__r.Icon__c, Proposals__r.Campaign__r.RedirectPage__c, Proposals__r.Campaign__r.Id FROM Applicant_Proposal_Association__c WHERE Contact__r.Login_hash_code__c =:candidateId];
            if(!applicantAssociationList.isEmpty()) {
                wrap.appliedCampaign = applicantAssociationList;
            }
            return wrap;
        } catch(Exception e) {
            System.debug('Error while getting Applicant Data ===> ' + e.getMessage() + ' at Line Number ===> ' + e.getLineNumber() + ' Stack Trace String ===> ' + e.getStackTraceString());
            return null;
        }
    }
    
    
    public class UserWrap {
        String firstName;
        String lastName;
        String email;
        String org;
        String title;
        String password;
        String country;
    }
    @RemoteAction
    public static String insertNewUser( UserWrap newUser ) {
        System.debug('newUser ===> ' + newUser);
        if(newUser == null) {
            return 'No data was passed!';
        }
        try {
            List<Contact> conList = [SELECT Id,Name,Email From Contact WHERE Email=: newUser.email];
            system.debug('conList ::'+conList);
            if(conList.size() > 0){
                return 'A User with this email already exists in our system please try with new Email!';
            }else{
                Account acc = new Account();
                Contact con = new Contact();
                acc.Name = newUser.org;
                acc.Is_Coordinator__c = true; // Changed by Rukasar
                acc.Is_Primary__c = true;
                insert acc;
                con.AccountId = acc.Id;
                con.Title = newUser.title;
                con.FirstName = newUser.firstName;
                con.LastName = newUser.lastName;
                con.Email = newUser.Email;
                con.Password__c = newUser.password;
                con.MailingCountry = newUser.country;
                con.Is_Primary__c = true;
                insert con;
                return 'Successfully created new user!';
            }
        }catch(Exception e) {
            System.debug('Error while craeting new contact and account ==> ' + e.getMessage() + ' at Line ===> ' + e.getLineNumber() + ' Stack Trace ===> ' + e.getStackTraceString());
            return 'Error creating new user!';
        }
    }
    
    //campaign method added by rukasar:
    @RemoteAction
    public static Campaign getActiveCampaign(string campaign_name) {
        try {
            List<Campaign> campaigns = [SELECT Id, Name,Yearly_Call__r.Pecfar_age_limit__c,Yearly_Call__r.Date_of_Birth_PECFAR__c FROM Campaign WHERE IsActive = true and name= :campaign_name                                   
                                        ORDER BY CreatedDate DESC 
                                        LIMIT 1];
            
            if (!campaigns.isEmpty()) {
                return campaigns[0];
            }
            return null;
        } catch (Exception e) {
            System.debug('Error: ' + e.getMessage());
            return null;
        }
    }
    
    public class CaptchaWrap {
        // public String userInput {get; set;}
        public String captchaValue {get; set;}
        public String captchaDisplay {get; set;}
        // public String email {get; set;}
        // public String password {get; set;}
    }
    
    
    
    @RemoteAction
    public static CaptchaWrap generateCaptcha() {
        CaptchaWrap c = new CaptchaWrap();
        c.captchaValue = createCaptcha();
        c.captchaDisplay = makeSpaced(c.captchaValue);
        return c;
    }
    
    @RemoteAction
    public static Map<String, Object> validateFormRemote(String email, String password, String userInput) {
        Map<String, Object> result = new Map<String, Object>();
        result.put('success', false);
        result.put('message', '');
        result.put('redirectUrl', '');
        result.put('hashCode', '');
        result.put('emailVerified', true);
        
        if(String.isBlank(email) || String.isBlank(password) || String.isBlank(userInput)) {
            result.put('message', 'Please fill all required fields.');
            return result;
        }
        
        CaptchaWrap temp = generateCaptcha();
        
        // You can replace this logic with your actual validation
        List<Contact> c = [SELECT Id, Password__c, Login_Hash_Code__c,Email_Verified__c FROM Contact WHERE Email = :email LIMIT 1];
        if(c.isEmpty()) {
            result.put('message', 'No account found for this email.');
            return result;
        }
        if(c[0].Email_Verified__c == false) {
            result.put('success', false);
            result.put('emailVerified', false);
            result.put('message', 'Your email is not verified. Please check your inbox for verification instructions.');
            return result;
        }
        
        if(String.valueOf(c[0].Password__c) != password) {
            result.put('message', 'Incorrect password.');
            return result;
        }
        c[0].Login_Hash_Code__c = Utility.generateRandomString();
        update c;
        result.put('hashCode', c[0].Login_Hash_Code__c);
        result.put('success', true);
        result.put('redirectUrl',
                   'https://indo-germansciencetechnologycentre--newdevutil.sandbox.my.salesforce-sites.com/ApplicantDashboard/ApplicantPortal?id='
                   + c[0].Login_Hash_Code__c
                  );
        return result;
    }
    
    private static String createCaptcha() {
        String chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
        String captcha = '';
        for(Integer i=0;i<6;i++){
            Integer r = Math.mod(Math.abs(Crypto.getRandomInteger()), chars.length());
            captcha += chars.substring(r, r+1);
        }
        return captcha;
    }
    
    private static String makeSpaced(String s) {
        return String.join(new List<String>(s.split('')), ' ');
    }
    
    //************************************** PROJECT DETAIL PAGE ***********************************************
    
    @RemoteAction
    public static Application_Proposal__c getApplicantDetails(String applicantHashCode){
        return Proposal_Controller.getApplicantDetails(applicantHashCode);
    }
    
    /*
    @RemoteAction
    public static String insertApplication(Application_Proposal__c applicantDetails, List<string> selThemeList, integer day, integer month, integer year, String conId, String recordType, String yearlyCallId){
        return Proposal_Controller.insertApplication(applicantDetails, selThemeList, day, month, year, conId, recordType, yearlyCallId);
    }
    */
    
    @RemoteAction
    public static Proposal_Controller.insertApplicationWrapper insertApplication(Application_Proposal__c applicantDetails, List<string> selThemeList, integer day, integer month, integer year, String conId, String recordType, String yearlyCallId){
        return Proposal_Controller.insertApplication(applicantDetails, selThemeList, day, month, year, conId, recordType, yearlyCallId);
    }
    
    @RemoteAction
    public static List<Thematic_Area__c> fetchAllThematicArea(){
        return Proposal_Controller.fetchAllThematicArea();
        
    }
    
    @RemoteAction
    public static  void deleteThematicArea(String themeId){
        Proposal_Controller.deleteThematicArea(themeId);
    }
    
    
    //********************************** CONSORTIA DETAILS ***************************************************
    
    @RemoteAction
    public static string insertAccount(List<Account> accountDetails,List<Contact> contactDetails){
        return Proposal_Controller.insertAccount(accountDetails,contactDetails);
    }
    
    @RemoteAction
    public static Account saveAccount(Account accountDetails,string projectId){
        
        accountDetails.Proposals__c = projectId;
        accountDetails.NumberOfEmployees = Integer.valueOf(accountDetails.NumberOfEmployees);
        upsert accountDetails;
        return accountDetails;
    }
    
    @RemoteAction
    public static contact saveContact(Contact contactDetails,string accountId,string projectId){
        contactDetails.AccountId = accountId;
        contactDetails.Proposals__c = projectId;
        upsert contactDetails;
        return contactDetails;
    }
    
    @RemoteAction
    public static string insertAccountAndContact(account accDetails, list<contact> conListToInsert){
        return Proposal_Controller.insertAccountAndContact(accDetails,conListToInsert);
    }
    
    @RemoteAction
    public static  list<account> getPatnerDetails(string applicantHashCode){
        return Proposal_Controller.getPatnerDetails(applicantHashCode);
    }
    
    @RemoteAction
    public static  list<account> getPatnerDetails2(string applicantHashCode){
        return Proposal_Controller.getPatnerDetails2(applicantHashCode);
    }
    
    
    // ======================================== WORKSHOP METHOD =============================================== //
    @RemoteAction
    public static  list<account> getPatnerDetails3(String applicantHashCode, String proposalId){
        return Proposal_Controller.getPatnerDetails3(applicantHashCode, proposalId);
    }
    
    @RemoteAction
    public static string insertConsortiaDetailPage(list<Proposal_Controller.ConsortiaDetails> ConsortiaDetailsList,string projectId){
        return Proposal_Controller.insertConsortiaDetailPage(ConsortiaDetailsList,projectId);
    }
    
    @RemoteAction
    public static  void deleteContact(string contactId){
        Proposal_Controller.deleteContact(contactId);
    }
    
    
    @RemoteAction
    public static  void deleteAccountDetails(string accId, list<string> contactIdList){
        Proposal_Controller.deleteAccountDetails(accId, contactIdList);
    }
    
    //*************************************** CONSORTIUM PARTNER INFORMATION *********************************************
    
    @RemoteAction
    public static String insertPartnerInformation(Account contactDetails){
        return Proposal_Controller.insertPartnerInformation(contactDetails);
    }
    
    //************************************* CURRICULUM VITAE *********************************************************
    
    @RemoteAction
    public static String insertContactDetails(List<Contact> contactDetails, List<Education_Details__c> educationDetails, List<Employment_Details__c> employmentDetails, List<Publications_Patents__c> publicationDetails){
        //system.debug('method ::'+Proposal_Controller.insertContactDetails(contactDetails,educationDetails,employmentDetails,publicationDetails));
        return Proposal_Controller.insertContactDetails(contactDetails,educationDetails,employmentDetails,publicationDetails);
    }
    
    @RemoteAction
    public static Contact getContactDetails(string hashCode){
        return Proposal_Controller.getContactDetails(hashCode);
    }
    
    @RemoteAction
    public static Contact getCvDetails(string contactId){
        return Proposal_Controller.getCvDetails(contactId);
    }
    
    //******************************************* COMPANY PROFILE *********************************************
    
    @RemoteAction
    public static  Account getCompanyApplicantDetails(string applicantHashCode){
        return Proposal_Controller.getCompanyApplicantDetails(applicantHashCode);
    }
    
    @RemoteAction
    public static Account insertApplicant(Account applicantDetails){
        return Proposal_Controller.insertApplicant(applicantDetails);
    }
    
    //****************************************** FINANCIAL OVERVIEW ***************************************************
    
    @RemoteAction
    public static  list<Applicant_Proposal_Association__c> getProjectDetailsDetails(string proposalId){
        return Proposal_Controller.getProjectDetailsDetails(proposalId);
    }
    
    @RemoteAction
    public static String insertFinancialDetails(List<Financial_Contribution__c> financialDetails){
        return Proposal_Controller.insertFinancialDetails(financialDetails);
    }
    
    //*************************************** PROJECT DETAIL ********************************************
    
    @RemoteAction
    public static string insertProjectDetails(Application_Proposal__c proposalDetails){
        return Proposal_Controller.insertProjectDetails(proposalDetails);
    }
    
    @RemoteAction
    public static Application_Proposal__c getProjectdetils(String proposalId){
        return Proposal_Controller.getProjectdetils(proposalId);
    }
    
    @RemoteAction
    public static String doCUploadAttachment(String attachmentBody, String attachmentName, string cvId, String udId){
        return Proposal_Controller.doCUploadAttachment(attachmentBody,attachmentName,cvId,udId);
    }
    
    @RemoteAction
    public static string createUserDocument(string udId, string conId, string pId, string fileId){
        return Proposal_Controller.createUserDocument(udId, conId, pId, fileId);
    }
    
    @RemoteAction
    public static string createUserDocumentPecfarDoc(string udId, string conId, string pId, string fileId){
        return Proposal_Controller.createUserDocumentPecfarDoc(udId, conId, pId, fileId);
    }
    
    //************************************** WORK PACKAGE **********************************************************
    
   /* @RemoteAction
    public static List<Work_Package__c> getWPDetails(string applicantHashCode){
        return Proposal_Controller.getWPDetails(applicantHashCode);
    }*/
    
    @RemoteAction
    public static List<Work_Package__c> getWPDetails(String proposalId, String proposalStage){
        return Proposal_Controller.getWPDetails(proposalId, proposalStage);
    }
    @RemoteAction
    public static List<Account> getProposalAccounts(String ProposalId){
        return Proposal_Controller.getProposalAccounts(ProposalId);
    }
    @RemoteAction
    public static Proposal_Controller.accountWrapper getProposalAccount(String loginhashcode){
        return Proposal_Controller.getProposalAccount(loginhashcode);
    }
    // @RemoteAction
    // public static list<Account> getWorkPackageDetails(string applicantHashCode){
    //     return Proposal_Controller.getWorkPackageDetails(applicantHashCode);
    // }
    
    // @RemoteAction
    // public static  String insertWPContactDetails(List<Work_Package__c> workPackDetails){
    //     system.debug('workPackDetails ::'+workPackDetails);
    //     return Proposal_Controller.insertWPContactDetails(workPackDetails);
    // }
    
    // @RemoteAction
    // public static  String insertWPContactDetailsAsDraft(List<Work_Package__c> workPackDetails){
    //     return Proposal_Controller.insertWPContactDetailsAsDraft(workPackDetails);
    // }
    
    // @RemoteAction
    // public static  void deleteWorkPackage(string wpId){
    //     Proposal_Controller.deleteWorkPackage(wpId);
    // }
    
    //************************************** Grant Application **********************************************************
    
    /*@RemoteAction
    public static  List<Account> getApplicantDetailsForGrant(string applicantHashCode){
        return Proposal_Controller.getApplicantDetailsForGrant(applicantHashCode);
    }*/
     @RemoteAction
    public static List<Account> getApplicantDetailsForGrant(String apaId, String proposalId){
        return Proposal_Controller.getApplicantDetailsForGrant(apaId, proposalId);
    }
    
    /*@RemoteAction
    public static String insertExistingGrants(List<Proposal_Controller.ExistingGrantsWrapper> grantList){
        system.debug('grantList ---> '+grantList);
        return Proposal_Controller.insertExistingGrants(grantList);
    }*/
    
     @RemoteAction
    public static String insertExistingGrants(List<Proposal_Controller.ExistingGrantsWrapper> grantList, String apaId){
        system.debug('grantList ---> '+grantList);
        return Proposal_Controller.insertExistingGrants(grantList, apaId);
    }
    
    @RemoteAction
    public static String insertExistingGrantsAsDraft(List<Proposal_Controller.ExistingGrantsWrapper> grantList){
        return Proposal_Controller.insertExistingGrantsAsDraft(grantList);
    }
    
    @RemoteAction
    public static  void deleteGrants(string grantstId){
        Proposal_Controller.deleteGrants(grantstId);
    }
    
    @RemoteAction
    public static Proposal_Controller.MyProposalWapper fetchProjectDetails(String projectId){
        system.debug('projectId :: '+projectId);
        return Proposal_Controller.fetchProjectDetails(projectId);
    }
    
    //************************************** PI Deliverables **********************************************************
    
    // @RemoteAction
    // public static  list<Account> getProjectDetailsForPI(string applicantHashCode){
    //     return Proposal_Controller.getProjectDetailsForPI(applicantHashCode);
    // }
    
    
    // @RemoteAction
    // public static  String insertDeliverables(List<Proposal_Controller.PiWrapper> deliverableList){
    //     System.debug('deliverableList---'+deliverableList);
    //      return Proposal_Controller.insertDeliverables(deliverableList);
    // }
    
    @RemoteAction
    public static List<PI_Deliverables__c> getDeliverablesDetails(string applicantHashCode){
        return Proposal_Controller.getDeliverablesDetails(applicantHashCode);
    }
    
    @RemoteAction
    public static String saveDeliverables(List<Proposal_Controller.WrapperPIDeliverables> wrapper,String ProposalId){
        Proposal_Controller instance = new Proposal_Controller();
        return instance.saveDeliverables(wrapper,ProposalId);
    }
    
    @RemoteAction
    public static void deleteDeliverables(string deliverId){
        Proposal_Controller.deleteDeliverables(deliverId);
    }
    
    //************************************** Network Meeting **********************************************************
    
    // @RemoteAction
    // public static list<Account> getProjectDetailsForNetMeet(string applicantHashCode){
    //     return Proposal_Controller.getProjectDetailsForNetMeet(applicantHashCode);
    // }
    
    // @RemoteAction
    // public static String insertMeetingDetails(List<Proposal_Controller.NetworkMeetWrapper> meetingList){
    //     system.debug('MeetingList ---> '+meetingList);
    //     return Proposal_Controller.insertMeetingDetails(meetingList);
    // }
    
    // @RemoteAction
    // public static  void deleteMeeting(string netId){
    //     Proposal_Controller.deleteMeeting(netId);
    // }
    
    @RemoteAction
    public static List<Network_Meeting__c> getMeetingDetails(string applicantHashCode){
        return Proposal_Controller.getMeetingDetails(applicantHashCode);
    }
    
    @RemoteAction
    public static String saveMeetingDetailss(List<Proposal_Controller.WrapperNetworkMeetings> wrapper,String ProposalId){
        Proposal_Controller instance = new Proposal_Controller();
        return instance.saveMeetingDetailss(wrapper,ProposalId);
    }
    
    @RemoteAction
    public static void deleteNetworkMeeting(string netMeetingId){
        Proposal_Controller.deleteNetworkMeeting(netMeetingId);
    }
    
    //************************************** Privacy Policy Acceptance **********************************************************
    
    @RemoteAction
    public static string insertPrivacyPolicy(Application_Proposal__c proposalDetails){
        return Proposal_Controller.insertPrivacyPolicy(proposalDetails);
    }
    
    @RemoteAction
    public static string finalSubmit(Application_Proposal__c proposalDetails){
        return Proposal_Controller.finalSubmit(proposalDetails);
    }
    //************************************** Industraial Fellowship **********************************************************
    /*
    @RemoteAction
    public static String updateIndusrianFellowshipBasicDet(String ContactId,Contact InstanceCon,Integer birthDay,Integer birthMonth,Integer birthYear,Integer phdEnrollYear,Integer phdEnrollMonth,Integer phdEnrollDay,Integer phdAwardYear,Integer phdAwardMonth,Integer phdAwardDay,Integer phdThesisYear,Integer phdThesisMonth,Integer phdThesisDay,Application_Proposal__c prop){
        IndustrialFellowshipHelper instanceIFH=new IndustrialFellowshipHelper();
        return instanceIFH.updateIndusrianFellowshipBasicDet(ContactId,InstanceCon,birthDay,birthMonth,birthYear,phdEnrollYear,phdEnrollMonth,phdEnrollDay,phdAwardYear,phdAwardMonth,phdAwardDay,phdThesisYear,phdThesisMonth,phdThesisDay,prop);
    }
    @RemoteAction
    public static String updatePersonalInfoIF(String ContactId,Contact InstanceCon,Integer birthDay,Integer birthMonth,Integer birthYear,Integer pasExYear,Integer pasExMonth,Integer pasExDay){
        IndustrialFellowshipHelper instanceIFH=new IndustrialFellowshipHelper();
        return instanceIFH.updatePersonalInfoIF(ContactId,InstanceCon,birthDay,birthMonth,birthYear,pasExYear,pasExMonth,pasExDay);
    }
    @RemoteAction
    public static Campaign getCampaignEndDate(String campaignName){
        IndustrialFellowshipModel instanceIFM=new IndustrialFellowshipModel();
        return instanceIFM.getCampaignEndDate(campaignName);
    }
	*/
    //************************************** WORKSHOP **********************************************************
    
    //************************************** Coordinators Page **********************************************************
    
    @RemoteAction
    public static List<Contact> getCoordinatorsDetails(string hashCode){
        return Proposal_Controller.getCoordinatorsDetails(hashCode);
    }
    
    @RemoteAction
    public static string SaveWorkshopContactDetails2(Contact conDataList, List<Education_Details__c> eduDetails, List<Employment_Details__c> empDetails){
        try{
            conDataList.MailingState = conDataList.State__c; //Added by Aman on 29 Aug'23. Put back the value of MailingState from State__c and see if it retains the value.
            upsert conDataList;
            upsert eduDetails;
            upsert empDetails;
            return 'success';
        }catch(Exception e){
            return e.getMessage();
        }
    }
    
    @RemoteAction
    public static String insertCoordinatorsInformation(String proposalId,List<Account> accList,List<Contact> conList){
        return Proposal_Controller.insertCoordinatorsInformation(proposalId,accList,conList);
    }
    
    //************************************** BasicDetails_Page **********************************************************
    
    // @RemoteAction
    // public static Application_Proposal__c getBasicDetails(String applicantHashCode){
    //     return Proposal_Controller.getBasicDetails(applicantHashCode);
    // }

    @RemoteAction
    public static Application_Proposal__c getBasicDetails(String proposalId){
        return Proposal_Controller.getBasicDetails(proposalId);
    }
    
    @RemoteAction
    public static string insertBasicDetails (Application_Proposal__c applicantDetails, integer day, integer month, integer year, integer endday, integer emdmonth, integer endyear, String conId, String RecordType){
        return Proposal_Controller.insertBasicDetails(applicantDetails, day, month, year, endday, emdmonth, endyear, conId, recordType);
    }
    
    @RemoteAction
    public static string insertBasicDetails2 (Application_Proposal__c applicantDetails, integer day, integer month, integer year, integer endday, integer emdmonth, integer endyear, String conId, String proposalId, String RecordType){
        return Proposal_Controller.insertBasicDetails2(applicantDetails, day, month, year, endday, emdmonth, endyear, conId, proposalId, recordType);
    }
    
    //************************************** Participants **********************************************************
    
    @RemoteAction
    public static List<Participants__c> getParticipantDetails(String proposalId){
        return Proposal_Controller.getParticipantDetails(proposalId);
    }
    
    /*
@RemoteAction
public static string insertParticipants(List<Participants__c> allParticipantDetails){
return Proposal_Controller.insertParticipants(allParticipantDetails);
}
*/
    
    // NEW METHOD FOR WORKSHOP - TO TAG PROPOSAL TO PARTICIPANTS
    @RemoteAction
    public static string insertParticipants(List<Participants__c> allParticipantDetails, String proposalId){
        return Proposal_Controller.insertParticipants(allParticipantDetails, proposalId);
    }
    
    @RemoteAction
    public static  void deleteParticipant(string participantId){
        Proposal_Controller.deleteParticipant(participantId);
    }
    
    ////////////////////////////////////////////// Curriculum /////////////////////////////////////
    
    @RemoteAction
    public static String insertCurriculumDetails(List<Contact> contactDetails, List<Education_Details__c> educationDetails, List<Employment_Details__c> employmentDetails, List<Publications_Patents__c> publicationDetails){
        return Proposal_Controller.insertCurriculumDetails(contactDetails, educationDetails, employmentDetails, publicationDetails);
    }
    @RemoteAction
    public static List<Contact> getCurriculumDetails(string hashCode){
        return Proposal_Controller.getCurriculumDetails(hashCode);
    }
    
    //************************************** Financial_Details **********************************************************
    
    @RemoteAction
    public static List<Contact> getAllFinancialDetails(string hashCode){
        return Proposal_Controller.getAllFinancialDetails(hashCode);
    }
    
    @RemoteAction
    public static string saveFinancialDetails(List<Financial_Contribution__c> financialList){
        return Proposal_Controller.saveFinancialDetails(financialList);
    }
    
    //************************************** BankDetailsForCoordinators **********************************************************
    
    @RemoteAction
    public static List<Account> getBankDetails(string hashCode){
        return Proposal_Controller.getBankDetails(hashCode);
    }
    
    @RemoteAction
    public static String upsertBankDetails(List<Bank_Details__c> bankDetailsList){
        return Proposal_Controller.upsertBankDetails(bankDetailsList);
    }
    
    
    //************************************** Project Details in Wiser **********************************************************
    @RemoteAction
    public static Application_Proposal__c getApplicantDetailsWiser(String applicantHashCode,String proposalId){
        return Proposal_Controller.getApplicantDetailsWiser(applicantHashCode, proposalId);
    }
    
    // @RemoteAction
    // public static String insertApplicationWiser(Application_Proposal__c applicantDetails,  String conId, String recordType){
    //     return Proposal_Controller.insertApplicationWiser(applicantDetails, conId, recordType);
    // }

     @RemoteAction
    public static Proposal_Controller.insertApplicationWrapper insertApplicationWiser(Application_Proposal__c applicantDetails,  String conId, String recordType){
        return Proposal_Controller.insertApplicationWiser(applicantDetails, conId, recordType);
    }
    
    @RemoteAction
    public static String LogoutApplicant(String loginHasgCode){
        return Proposal_Controller.LogoutApplicant(loginHasgCode);
    }
    
    // @RemoteAction
    // public static String createExpenseDeclarationDetails(List<Expense_Line_Item__c> expenseLineItem,String proposalId,String accId){
    //     return Proposal_Controller.createExpenseDeclarationDetails(expenseLineItem, proposalId, accId);
    // }
    
    @RemoteAction
    public static string createExpenseDeclarationDetails(String accId, List<Expense_Detail__c> manPowerRecords, 
                                                         List<Expense_Detail__c> consumables, List<Expense_Detail__c> Equipment, 
                                                         List<Expense_Detail__c> travel, List<Expense_Detail__c> overhead, 
                                                         List<Expense_Detail__c> contingency, List<Expense_Detail__c> outsourcing, 
                                                         Applicant_Proposal_Association__c updatedApa){
                                                             return Proposal_Controller.createExpenseDeclarationDetails(accId, manPowerRecords, consumables, Equipment, travel, overhead, contingency, outsourcing, updatedApa);
                                                         }
    
    // @RemoteAction
    // public static List<Expense_Detail__c> getExpenseRecords(String ProposalId){
    //     return Proposal_Controller.getExpenseRecords(ProposalId);
    // }
    
    @RemoteAction
    public static Proposal_Controller.edWrapper getExpenseRecords(String ProposalId, String ContactId) {
        return Proposal_Controller.getExpenseDetails(ProposalId, ContactId);
    }
    
    // NEW CODE - RETURNING CUSTOM TYPE
    @RemoteAction
    public static Proposal_Controller.ProposalWithContactsDTO getConsentCheckbox(String proposalId){
        return Proposal_Controller.getConsentCheckbox(proposalId);
    }
    
    // OLD CODE - Re-using same method (RETURNING Application_Proposal__c)
    // @RemoteAction
    // public static Application_Proposal__c getConsentCheckbox(string proposalId){
    //     return Proposal_Controller.getConsentCheckbox(proposalId);
    // }
    
    
    @RemoteAction
    public static string saveAsDraftWorkshop(Application_Proposal__c proposalList, String projectId, Integer year, Integer month, Integer day){
        return Proposal_Controller.saveAsDraftWorkshop(proposalList,projectId,year,month,day);
    }
    
    @RemoteAction
    public static string upsertCheckbox(Application_Proposal__c proposalList, String projectId, Integer year, Integer month, Integer day){
        return Proposal_Controller.upsertCheckbox(proposalList,projectId,year,month,day);
    }
    @RemoteAction
    public static Proposal_Controller.WrapProposalPendings getProposalPendings(String pid){
        return Proposal_Controller.getProposalPendings(pid);
    }
    
    @RemoteAction
    public static List<Proposal_Controller.accWrapper> getExpenseDetailsOfAccount(string proposalId){
        return Proposal_Controller.getExpenseDetailsOfAccount(proposalId);
    }
    
    @RemoteAction
    public static string saveExpenseDetails(List<Expense_Line_Item__c> listOfLineItem, Application_Proposal__c app){
        return Proposal_Controller.saveExpenseDetails(listOfLineItem,app);
    }
    
    @RemoteAction
    public static  void deleteExpenseLineItems(string lineItemId){
        Proposal_Controller.deleteExpenseLineItems(lineItemId);
    }
    
    @RemoteAction
    public static  void deleteExpenseLineItem(string lineItemId){
        Proposal_Controller.deleteExpenseLineItem(lineItemId);
    }
    
    @RemoteAction
    public static String insertFellowship_Details(Contact applicantDetails, integer startday, integer startmonth, integer startyear, integer endday, integer endmonth, integer endyear,String conId, String recordType){
        return Proposal_Controller.insertFellowship_Details(applicantDetails, startday, startmonth, startyear, endday, endmonth, endyear, conId, recordType);
    }
    
    @RemoteAction
    public static List<Contact> getPairingDetails(string hashcode, string campaignId){
        return Proposal_Controller.getPairingDetails(hashcode,campaignId);
    }
    
    /* @RemoteAction
    public static String insertPairingDetails(List<Proposal_Controller.wrapperPairing> contactList){
        return Proposal_Controller.insertPairingDetails(contactList);
    } */

     @RemoteAction
    public static Proposal_Controller.insertPairingWrapper insertPairingDetails(List<Proposal_Controller.wrapperPairing> contactList,String campaignId,String yearlyCall){
        return Proposal_Controller.insertPairingDetails(contactList,campaignId,yearlyCall);
    }
    
    @RemoteAction
    public static Contact getPersonalInformation(string hashCode){
        return Proposal_Controller.getPersonalInformation(hashCode);
    }
    
    @RemoteAction
    public static string insertPersonalInfo(Contact conDetails, integer birthday, integer birthmonth, integer birthyear){
        return Proposal_Controller.insertPersonalInfo(conDetails, birthday, birthmonth, birthyear); 
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
    public static string doUploadAttachment (string type, String attachmentBody, String attachmentName,string conId, String fileId, string userDocId){
        return IndustrialFellowshipHelper.doUploadAttachment(type, attachmentBody, attachmentName, conId, fileId, userDocId);
    }
    
    @RemoteAction
    public static String doUploadProfilePic(String contactId, String attachmentBody, String attachmentName) {
        system.debug('contactId==>'+contactId+'attachmentBody==>'+attachmentBody+'attachmentName==>'+attachmentName);
        if(contactId != null && attachmentBody != null) {
            Attachment att = new Attachment();
            String newBody = '';
            newBody += attachmentBody;
            att.Body = EncodingUtil.base64Decode(newBody);
            att.Name = attachmentName;
            att.parentId = contactId;
            
            insert att;
            system.debug('Id ::'+att.Id);
            string attId = att.Id;
            if(attId != null){
                if(attId.length() == 18){
                    attId = attId.substring(0,attId.length()-3);
                }
            }
            
            update new Contact(Id = contactId,Profile_Pic_Attachment_Id__c = attId,Uploaded__c = true);
            return attId;
        }
        return null;
    }
    
    @RemoteAction
    public static String doCUploadAttachmentB(String attachmentBody, String attachmentName, string cvId, Bank_Details__c bankInstance) {
        String udId;
        system.debug('attachmentBody---'+attachmentName+'---attachmentId---'+cvId+'---cvId---'+udId);
        system.debug('cvId---'+cvId+'---udId---'+udId);
        bankInstance.File_Upload_Status__c = 'Uploaded';
        upsert bankInstance;
        udId=bankInstance.Id;
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
    public static List<Employment_Details__c> getEmpDetails(string hashcode, string apaId){
        return Proposal_Controller.getEmpDetails(hashcode,apaId);
    }
    
     @RemoteAction
    public static string insertEmploymentDetailsPECFAR(List<Employment_Details__c> empDetails, string apaId){
        return Proposal_Controller.insertEmploymentDetailsPECFAR(empDetails,apaId);
    }
    
    // @RemoteAction
    // public static string updateEmploymentDetails(List<Proposal_Controller.employmentWrapper> empList){
    //     return Proposal_Controller.updateEmploymentDetails(empList);
    // }
    
    @RemoteAction
    public static  void deleteEmployment(string empId){
        Proposal_Controller.deleteEmployment(empId);
    }
    
    @RemoteAction
    public static Contact getParentOrgDetails(string hashcode){
        return Proposal_Controller.getParentOrgDetails(hashcode);
    }
    
    @RemoteAction
    public static string updateconAccDetails(Account conAccDetails){
        return Proposal_Controller.updateconAccDetails(conAccDetails);
    }
    
    @RemoteAction
    public static Achievement__c getAchievements(string hashcode,string apaId){
        return Proposal_Controller.getAchievements(hashcode,apaId);
    }
    
    @RemoteAction
    public static string updateAchievements(Achievement__c achievementList,string apaId){
        return Proposal_Controller.updateAchievements(achievementList,apaId);
    }
    
    @RemoteAction
    public static string insertWiserDraft(string projectId, integer day, integer month, integer year){
        return Proposal_Controller.insertWiserDraft(projectId, day, month, year);
    }
    
    @RemoteAction
    public static string finalSubmitWiser(string projectId, string conId, integer day, integer month, integer year){
        return Proposal_Controller.finalSubmitWiser(projectId, conId, day, month, year);
    }
    
    @RemoteAction
    public static Contact getDeclarationfields(string hashcode){
        return Proposal_Controller.getDeclarationfields(hashcode);
    }
    
    @RemoteAction
    public static string submit2plus2(Contact conDetails,integer year,integer month,integer day,string projectid){
        return Proposal_Controller.submit2plus2(conDetails, year, month, day,projectid);
    }
    //Added by Aman on 5th September
    //Desc: used to submit the details of Partners for 2+2 program
    @RemoteAction
    public static string submitPartner2plus2(Contact conDetails,integer year,integer month,integer day){
        return Proposal_Controller.submitPartner2plus2(conDetails, year, month, day);
    }
    
    @RemoteAction
    public static string upsertSign(Contact conDetails,integer year,integer month,integer day){
        return Proposal_Controller.upsertSign(conDetails, year, month, day);
    }
    
    @RemoteAction
    public static list<Proposal_Controller.UserDocumentWrapper> getContactUserDoc(id parentId, Id proposalId){
        Proposal_Controller pc = new Proposal_Controller();
        return pc.getContactUserDoc(parentId, proposalId);
    }
    @RemoteAction
    public static list<Proposal_Controller.ProposalDocumentWrapper> getAllProposalDoc(id parentId){
        return Proposal_Controller.getAllProposalDoc(parentId);
    }
    @RemoteAction
    public static list<Proposal_Controller.UserDocumentWrapper> getReviewerUserDoc(id parentId){
        return Proposal_Controller.getReviewerUserDoc(parentId);
    }
    
    @RemoteAction
    public static Contact getcampaigntype(string hashcode){
        try{
            Contact conrec = [SELECT Id,Name,Campaign__c,Is_Primary__c from Contact where Login_Hash_Code__c=: hashcode];
            return conrec;
        }catch(exception e){
            return null;
        }
    }
    
    // @RemoteAction
    // public static ContentDocumentLink getSignature(string conId){
    //     return Proposal_Controller.getSignature(conId);
    // }
    
    @RemoteAction
    public static list<Proposal_Controller.MeetingThemeWrapper> getMeetingThemeDetails(string proposalId){
        return Proposal_Controller.getMeetingThemeDetails(proposalId);
    }
    
    @RemoteAction
    Public static string saveMeetingDetails(List<Proposal_Controller.MeetingThemeWrapper> meetingThemeWrapper){
        return Proposal_Controller.saveMeetingDetails(meetingThemeWrapper);
    }
    
    @RemoteAction
    public static list<Proposal_Controller.UserDocumentWrapper> getAllUserDoc(string parentId) {
        return Proposal_Controller.getAllUserDoc(parentId);
    }
    
    // ================================== WORKSHOP METHOD ===================================== //
    @RemoteAction
    public static Proposal_Controller.insertApplicationWrapper insertCoordinatorsInformation2(List<Account> accList,List<Contact> conList, String proposalId, String yearlyCallId){
        return Proposal_Controller.insertCoordinatorsInformation2(accList, conList, proposalId, yearlyCallId);
    }
    
    @RemoteAction
    public static list<Proposal_Controller.UserDocumentWrapper> getAllUserDocSignature(string parentId) {
        return Proposal_Controller.getAllUserDocSignature(parentId);
    }
    
    @RemoteAction
    public static string saveAsDraftPecfar(Application_Proposal__c proposalDetails){
        return Proposal_Controller.saveAsDraftPecfar(proposalDetails);
    }
    
  /*  @RemoteAction
    public static string finalSubmitPecfar(Application_Proposal__c proposalDetails){
        return Proposal_Controller.finalSubmitPecfar(proposalDetails);
    }
*/
    
    @RemoteAction
    public static String reviewAppDocGen(string proID){
        Proposal_Controller prosalInstance=new Proposal_Controller();
        return prosalInstance.reviewAppDocGen(proID);
    }
    @RemoteAction
    public static list<Attachment> getCongaDoc(string proID){
        Proposal_Controller prosalInstance=new Proposal_Controller();
        return prosalInstance.getCongaDoc(proID);
    }
    @RemoteAction
    public static String doCUploadProfilePic(String attachmentBody, String attachmentName, string cvId, String udId) {
        system.debug('attachmentBody---'+attachmentName+'---attachmentId---'+cvId+'---cvId---'+udId);
        system.debug('cvId---'+cvId+'---udId---'+udId);
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
    
    // @RemoteAction
    // public static string reviewApp(string proID,string CampaignType){
    //     return Proposal_Controller.reviewApp(proID,CampaignType);
    // }
    @RemoteAction
    public static string updateProfileAttId(string conId,string attId){
        update New Contact(id=conId,Profile_Pic_Attachment_Id__c=attId);
        return 'success';
    }
   /* @RemoteAction
    public static Contact getFellowshipDetails(string applicantHashCode){
        return Proposal_Controller.getFellowshipDetails(applicantHashCode);
    }*/
     @RemoteAction
    public static Contact getFellowshipDetails(string applicantHashCode, string proposalId){
        return Proposal_Controller.getFellowshipDetails(applicantHashCode, proposalId);
    }
    // @RemoteAction
    // public static String doCUploadAttachmentReviewer(String attachmentBody, String attachmentName, string cvId, String udId) {
    //     system.debug('attachmentBody---'+attachmentName+'---attachmentId---'+cvId+'---cvId---'+udId);
    //     system.debug('cvId---'+cvId+'---udId---'+udId);
    //     Reviewer__c userDocc = New Reviewer__c();
    //     userDocc.Id = udId;
    //     userDocc.Status__c = 'Uploaded';
    //     system.debug('status ::'+userDocc);
    //     upsert userDocc;
    //     if(String.isBlank(attachmentBody) || String.isBlank(udId))
    //         return 'ERROR';
    //     if(String.isBlank(cvId)) {
    //         ContentVersion conVer = new ContentVersion();
    //         conVer.ContentLocation = 'S';
    //         conVer.PathOnClient = '/'+System.now()+attachmentName;//'attachmentName';
    //         conVer.Title = attachmentName;
    //         conVer.VersionData = EncodingUtil.base64Decode(attachmentBody);
    //         conVer.isMajorVersion = false;
    //         insert conVer;
    
    //         ContentDistribution cdl = new ContentDistribution();
    //         cdl.ContentVersionId = conVer.Id;
    //         cdl.Name = 'PublicShare';
    //         cdl.RelatedRecordId = udId;
    //         insert cdl;
    //         system.debug('ContentDistribution----'+cdl);
    //         Id conDoc = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:conVer.Id].ContentDocumentId;
    //         ContentDocumentLink conDocLink = New ContentDocumentLink();
    //         conDocLink.LinkedEntityId = udId;
    //         conDocLink.ContentDocumentId = conDoc;
    //         conDocLink.shareType = 'V';
    //         insert conDocLink;
    
    //         return conVer.Id;
    
    //     }else {
    //         List<ContentVersion> cvList = [SELECT Id, VersionData FROM ContentVersion WHERE Id = :cvId];
    //         if(!cvList.isEmpty()) {
    //             ContentVersion cVersion = cvList[0];
    //             if(cVersion.VersionData != null) {
    //                 String newBody = EncodingUtil.base64Encode(cVersion.VersionData);
    //                 newBody += attachmentBody;
    //                 cVersion.VersionData = EncodingUtil.base64Decode(newBody);
    //                 update cVersion;
    //                 return cVersion.Id;
    //             }
    //         }
    //     }
    //     return 'Success';
    // }
    private static Attachment getAttachment(String attId) {
        list<Attachment> attachments = [SELECT Id, Body
                                        FROM Attachment 
                                        WHERE Id =: attId];
        if(attachments.isEmpty()) {
            Attachment a = new Attachment();
            return a;
        } else {
            return attachments[0];
        }
    }
    
    @RemoteAction
    public static String doCUploadAttachmentAa(String attachmentBody, String attachmentName, string cvId, String udId) {
        try {
            System.debug('=== Upload Start ===');
            System.debug('attachmentBody: ' + attachmentName);
            System.debug('cvId: ' + cvId);
            System.debug('udId: ' + udId);
            System.debug('attachmentBody length: ' + (attachmentBody != null ? attachmentBody.length() : 0));
            
            // FIX 1: Check if udId is provided and valid
            if (String.isBlank(udId)) {
                System.debug('ERROR: udId is null or blank');
                throw new AuraHandledException('User Document ID is required but was not provided');
            }
            
            // FIX 2: Verify the User_Document__c record exists before trying to update
            User_Document__c userDoc;
            try {
                userDoc = [SELECT Id, Status__c FROM User_Document__c WHERE Id = :udId LIMIT 1];
            } catch (Exception e) {
                System.debug('ERROR: User Document not found with Id: ' + udId);
                throw new AuraHandledException('User Document record not found');
            }
            
            // Update the status
            userDoc.Status__c = 'Uploaded';
            update userDoc;
            System.debug('User Document updated successfully');
            
            // Handle attachment creation/update
            if (String.isBlank(cvId)) {
                // Create new attachment
                Attachment aatt = new Attachment(
                    ParentId = udId, 
                    Name = attachmentName, 
                    Body = EncodingUtil.base64Decode(attachmentBody)
                );
                
                // FIX 3: Get owner safely
                Id ownerId = getOwnerIdOfRecord(udId);
                if (ownerId != null) {
                    aatt.OwnerId = ownerId;
                }
                
                insert aatt;
                System.debug('New attachment created: ' + aatt.Id);
                return aatt.Id;
            } else {
                // Append to existing attachment
                Attachment att = getAttachment(cvId);
                String newBody = '';
                if (att.Body != null) {
                    newBody = EncodingUtil.base64Encode(att.Body);
                }
                newBody += attachmentBody;
                att.Body = EncodingUtil.base64Decode(newBody);
                
                // FIX 3: Get owner safely
                Id ownerId = getOwnerIdOfRecord(udId);
                if (ownerId != null) {
                    att.OwnerId = ownerId;
                }
                
                update att;
                System.debug('Attachment updated: ' + att.Id);
                return att.Id;
            }
            
        } catch (Exception e) {
            System.debug('=== Upload Exception ===');
            System.debug('Error: ' + e.getMessage());
            System.debug('Line: ' + e.getLineNumber());
            System.debug('Stack: ' + e.getStackTraceString());
            throw new AuraHandledException('Upload failed: ' + e.getMessage());
        }
    }
    
    // Attachment a = new Attachment(parentId = udId, name=attachmentName, body = Blob.valueOf(attachmentBody));
    // insert a;
    // if(String.isBlank(attachmentBody) || String.isBlank(udId))
    //     return 'ERROR';
    // if(String.isBlank(cvId)) {
    //     ContentVersion conVer = new ContentVersion();
    //     conVer.ContentLocation = 'S';
    //     conVer.PathOnClient = '/'+System.now()+attachmentName;//'attachmentName';
    //     conVer.Title = attachmentName;
    //     conVer.VersionData = EncodingUtil.base64Decode(attachmentBody);
    //     conVer.isMajorVersion = false;
    //     insert conVer;
    
    //     ContentDistribution cdl = new ContentDistribution();
    //     cdl.ContentVersionId = conVer.Id;
    //     cdl.Name = 'PublicShare';
    //     cdl.RelatedRecordId = udId;
    //     insert cdl;
    //     system.debug('ContentDistribution----'+cdl);
    //     Id conDoc = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:conVer.Id].ContentDocumentId;
    //     ContentDocumentLink conDocLink = New ContentDocumentLink();
    //     conDocLink.LinkedEntityId = udId;
    //     conDocLink.ContentDocumentId = conDoc;
    //     conDocLink.shareType = 'V';
    //     insert conDocLink;
    
    //     return conVer.Id;
    
    // }else {
    //     List<ContentVersion> cvList = [SELECT Id, VersionData FROM ContentVersion WHERE Id = :cvId];
    //     if(!cvList.isEmpty()) {
    //         ContentVersion cVersion = cvList[0];
    //         if(cVersion.VersionData != null) {
    //             String newBody = EncodingUtil.base64Encode(cVersion.VersionData);
    //             newBody += attachmentBody;
    //             cVersion.VersionData = EncodingUtil.base64Decode(newBody);
    //             update cVersion;
    //             return cVersion.Id;
    //         }
    //     }
    // }
    // return 'Success';
    
    
    @RemoteAction
    public static String doCUploadAttachmentSignature(String attachmentBody, String attachmentName, string cvId, String udId) {
        system.debug('attachmentBody---'+attachmentName+'---attachmentId---'+cvId+'---cvId---'+udId);
        system.debug('cvId---'+cvId+'---udId---'+udId);
        if(cvId == ''){
            cvId = null;
        }
        if(udId == ''){
            udId = null;
        }
        User_Document__c userDocc = New User_Document__c();
        userDocc.Id = udId;
        userDocc.Status__c = 'Uploaded';
        system.debug('status ::'+userDocc);
        upsert userDocc;
        
        udId = userDocc.Id;
        
        // if(cvId == null) {
        //     // Attachment att = new Attachment(parentId = udId, name=attachmentName, body = EncodingUtil.base64Decode(attachmentBody));
        //     // upsert att;
        //     Attachment aatt = new Attachment(parentId = udId, name=attachmentName, body = EncodingUtil.base64Decode(attachmentBody));
        //     aatt.OwnerId = getOwnerIdOfRecord(udId);
        //     insert aatt;
        //     return aatt.Id;
        // }else{
        //     Attachment att = getAttachment(cvId);
        //     String newBody = '';
        //     if(att.Body != null) {
        //         newBody = EncodingUtil.base64Encode(att.Body);
        //     }
        //     newBody += attachmentBody;
        //     att.Body = EncodingUtil.base64Decode(newBody);
        //     att.OwnerId = getOwnerIdOfRecord(udId);
        //     upsert att;
        // return att.Id;
        // }
        
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
    public static String doCUploadAttachmentSignatureCustom(String attachmentBody, String attachmentName, string cvId, String udId) {
        system.debug('attachmentBody---'+attachmentName+'---attachmentId---'+cvId+'---cvId---'+udId);
        system.debug('cvId---'+cvId+'---udId---'+udId);
        
        // Split the udId string into a list of IDs
        List<String> userDocIds = udId.split(',');
        System.debug('cvId >> '+cvId);
        List<String> cvIdIds = new List<String>();
        if(cvId != null) {
            cvIdIds = cvId.split(',');
        }
        System.debug('cvIdIds'+cvIdIds);
        // Create a list to hold User_Document__c records for update
        List<User_Document__c> userDocsToUpdate = new List<User_Document__c>();
        
        // Create a list to hold Attachments for insertion
        List<Attachment> attachmentsToInsert = new List<Attachment>();
        
        // Iterate over each ID and process
        for (String id : userDocIds) {
            id = id.trim(); // Ensure no extra spaces
            
            // Update User_Document__c record
            User_Document__c userDoc = new User_Document__c();
            userDoc.Id = id;
            userDoc.Status__c = 'Uploaded';
            userDocsToUpdate.add(userDoc);
            
            // Handle attachment logic
            if (cvId == null) {
                Attachment aatt = new Attachment(
                    parentId = id,
                    name = attachmentName,
                    body = EncodingUtil.base64Decode(attachmentBody)
                );
                aatt.OwnerId = getOwnerIdOfRecord(id);
                //insert aatt;
                //return aatt.Id;
                attachmentsToInsert.add(aatt);
            } else {
                for(String str: cvIdIds){
                    Attachment att = getAttachment(str);
                    String newBody = '';
                    if (att.Body != null) {
                        newBody = EncodingUtil.base64Encode(att.Body);
                    }
                    newBody += attachmentBody;
                    att.Body = EncodingUtil.base64Decode(newBody);
                    att.OwnerId = getOwnerIdOfRecord(id);
                    upsert att;
                }
                //return att.Id;
            }
        }
        
        // Perform the update for User_Document__c records
        if (!userDocsToUpdate.isEmpty()) {
            upsert userDocsToUpdate;
        }
        
        // Insert the new attachments
        if (!attachmentsToInsert.isEmpty()) {
            insert attachmentsToInsert;
        }
        // Collect the Ids in a List<String>
        List<String> attachmentIds = new List<String>();
        for (Attachment att : attachmentsToInsert) {
            attachmentIds.add(att.Id);
        }
        
        // Convert the List<String> to a single comma-separated String
        String result = String.join(attachmentIds, ',');
        return result;
    }
    
    @RemoteAction
    public static String newMethod(String a, String b, String c, String d){
        return 'Success';
    }
    @RemoteAction
    public static String doCUploadAttachmentProjectDet(String attachmentBody, String attachmentName, String cvId, String udId) {
        system.debug('attachmentBody--->'+attachmentBody+'attachmentName---->'+attachmentName+'---cvId---'+cvId+'---udId---'+udId);
        system.debug('cvId---'+cvId+'---udId---'+udId);
        
        if(udId == ''){
            udId = null;
        }
        
        Proposal_Document__c userDocc = New Proposal_Document__c();
        if(udId != null && udId != 'undefined' && udId != ''){
            userDocc.Id = udId;
        }
        
        userDocc.Status__c = 'Uploaded';
        system.debug('status ::'+userDocc);
        upsert userDocc;
        
        if(String.isEmpty(cvId)) {
            Attachment aatt = new Attachment(parentId = udId, name=attachmentName, body = EncodingUtil.base64Decode(attachmentBody));
            //aatt.OwnerId = '0055j000005jt18AAA';
            aatt.OwnerId = getOwnerIdOfRecord(udId);
            insert aatt;
            system.debug('aatt.Id::'+aatt.Id);
            return aatt.Id;
        }else{
            Attachment att = getAttachment(cvId);
            String newBody = '';
            if(att.Body != null) {
                newBody = EncodingUtil.base64Encode(att.Body);
            }
            newBody += attachmentBody;
            att.Body = EncodingUtil.base64Decode(newBody);
            att.OwnerId = getOwnerIdOfRecord(udId); 
            // att.OwnerId = '0055j000005jt18AAA';
            upsert att;
            return att.Id;
        }
    }
    @RemoteAction
    public static String doCUploadAttachmentSignature22(String attachmentBody, String attachmentName, string cvId, String udId, string projectid,string CreateTask,string TaskSubject) {
        system.debug('attachmentBody---'+attachmentName+'---attachmentId---'+cvId+'---cvId---'+udId);
        system.debug('cvId---'+cvId+'---udId---'+udId);
        User_Document__c userDocc = New User_Document__c();
        userDocc.Id = udId;
        userDocc.Status__c = 'Uploaded';
        system.debug('status ::'+userDocc);
        upsert userDocc;
        
        // if(cvId == null) {
        //     // Attachment att = new Attachment(parentId = udId, name=attachmentName, body = EncodingUtil.base64Decode(attachmentBody));
        //     // upsert att;
        //     Attachment aatt = new Attachment(parentId = udId, name=attachmentName, body = EncodingUtil.base64Decode(attachmentBody));
        //     aatt.OwnerId = getOwnerIdOfRecord(udId);
        //     insert aatt;
        //     return aatt.Id;
        // }else{
        //     Attachment att = getAttachment(cvId);
        //     String newBody = '';
        //     if(att.Body != null) {
        //         newBody = EncodingUtil.base64Encode(att.Body);
        //     }
        //     newBody += attachmentBody;
        //     att.Body = EncodingUtil.base64Decode(newBody);
        //     att.OwnerId = getOwnerIdOfRecord(udId);
        //     upsert att;
        // return att.Id;
        // }
        
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
                    return cVersion.Id;
                }
            }
        }
        return 'Success';
    }
    public static Id getOwnerIdOfRecord(Id recordId){
        
        String objectName = recordId.getSObjectType().getDescribe().getName();
        String ownerIdFieldName = 'OwnerId';
        
        // Build the dynamic SOQL query
        String queryString = 'SELECT ' + ownerIdFieldName + ' FROM ' + objectName + ' WHERE Id = \'' + recordId + '\' LIMIT 1';
        
        // Execute the dynamic SOQL query
        SObject[] queryResult = Database.query(queryString);
        
        // Get the OwnerId value from the query result
        Id ownerId = (Id)queryResult[0].get(ownerIdFieldName);
        return ownerId;
    }
    
    //     public static Id getOwnerIdOfRecord222(Id recordId) {
    //     try {
    //         if (recordId == null) {
    //             System.debug('WARNING: recordId is null, returning current user');
    //             return UserInfo.getUserId();
    //         }
    
    //         String objectName = recordId.getSObjectType().getDescribe().getName();
    //         String query = 'SELECT OwnerId FROM ' + objectName + ' WHERE Id = :recordId LIMIT 1';
    //         SObject record = Database.query(query);
    
    //         if (record != null) {
    //             return (Id)record.get('OwnerId');
    //         }
    //         return UserInfo.getUserId();
    
    //     } catch (Exception e) {
    //         System.debug('Error in getOwnerIdOfRecord222: ' + e.getMessage());
    //         return UserInfo.getUserId();
    //     }
    // }
    
    @RemoteAction
    public static Map<String, List<String>> getFieldDependencies(String objectName, String controllingField, String dependentField){
        try{
        System.debug('NewMethod is called');
        return Proposal_Controller.getFieldDependencies(objectName, controllingField, dependentField);


        }catch(Exception e){
            System.debug('Error Occured==>'+e.getMessage());
            System.debug('Error Occured==>'+e.getLineNumber());
            return null;
        }
    }
    
    @RemoteAction
    public static string createAnotherCoord(string projectId){
        return Proposal_Controller.createAnotherCoord(projectId);
    }
    
    /*
    @RemoteAction
    public static Contact getCoodinatorDetList(string hashcode){
        return Proposal_Controller.getCoodinatorDetList(hashcode);
    }
    */
    
    // ------------------------------- WORKSHOP METHOD ------------------------------------ //
    @RemoteAction
    public static Contact getCoodinatorDetList(string hashcode, string apaId){
        return Proposal_Controller.getCoodinatorDetList(hashcode, apaId);
    }
    
    @RemoteAction
    public static void deleteEducationWorkshop(string eduId){
        Proposal_Controller.deleteEducationWorkshop(eduId);
    }
    
    @RemoteAction
    public static void deleteEmploymentWorkshop(string empId){
        Proposal_Controller.deleteEmploymentWorkshop(empId);
    }
    
    // @RemoteAction
    // public static string SaveWorkshopContactDetails(List<Contact> conDataList, List<Education_Details__c> eduDetails, List<Employment_Details__c> empDetails){
    //     return Proposal_Controller.SaveWorkshopContactDetails(conDataList, eduDetails, empDetails);
    // }

    @RemoteAction
    public static string SaveWorkshopContactDetails(List<Contact> conDataList, List<Education_Details__c> eduDetails, List<Employment_Details__c> empDetails, String apaId, String proposalId){
        return Proposal_Controller.SaveWorkshopContactDetails(conDataList, eduDetails, empDetails, apaId, proposalId);
    }
    
    @RemoteAction
    public static Account getAddressDetails(string hashcode){
        return Proposal_Controller.getAddressDetails(hashcode);
    }
    
    @RemoteAction
    public static string saveAddressDetails(Account addressDetails, List<Contact> contactList){
        return Proposal_Controller.saveAddressDetails(addressDetails,contactList);
    }
    
    @RemoteAction
    public static List<Contact> getAllContacts(){
        return Proposal_Controller.getAllContacts();
    }
    
    @RemoteAction
    public static List<Contact> checkEmail(string email, string contId){
        return Proposal_Controller.checkEmail(email, contId);
    }
    
    @RemoteAction
    public static string getConForHostNationality(string candidateId){
        return Proposal_Controller.getConForHostNationality(candidateId);
    }
    
    @RemoteAction
    public static string createHostContact(string conID, string projectid){
        return Proposal_Controller.createHostContact(conID,projectid);
    }
    
    @RemoteAction
    public static Contact getCVDetailsForWiserApplicant(string candidateId,String apaId){
        return Proposal_Controller.getCVDetailsForWiserApplicant(candidateId, apaId);
    }
    @RemoteAction
    public static WrapperProposalDet getPECFARProposalDetails(string ProposalId){
        List<Contact> listContact=[SELECT ID,Name,proposals__r.Tentative_plans_for_networking__c,proposals__r.Basis_for_choosing_the_pairing_fellow__c,proposals__r.Expected_Deliverables__c,
                                   proposals__r.Tentative_Start_Date__c,proposals__r.Research_Approach_Objectives__c,proposals__r.Tentative_End_Date__c,proposals__r.Availing_any_other_fellowship_currently__c,proposals__r.Paired_Applicant_associated_with_IGSTC__c,
                                   proposals__r.Availing_Other_Fellowship_Detail__c,proposals__r.Applicant_associated_with_IGSTC_Detail__c,FirstName,LastName,MailingStreet,Profile_Pic_Attachment_Id__c,Gender__c,MobilePhone,Designation__c,Institution_Name__c,Nationality__c,Institution__c,Email,Birthdate,Planned_research_activities_of_the_visit__c,Expected_outcomes__c,Basis_for_choosing_your_paired_member__c,Tentative_Start_Date__c,Tentative_End_Date__c,Availing_Fellowship__c,Associated_with_IGSTC__c,Give_Fellowship_Details__c,Give_Associated_Details__c,Account.Name,Account.BillingStreet,Account.BillingCity,Account.BillingCountry,Account.BillingState,
                                   Account.BillingPostalCode,Account.Email__c,Account.Homepage_URL__c,Account.Organisation_Posrt__c,Uploaded__c,
                                   (select name,id from Attachments Order By CreatedDate DESC limit 1),(SELECT Name,Start_Year__c,End_Year__c,End_Date__c,Start_Date__c,Nature_of_PhD_Work__c,Nature_of_Thesis_Work__c,Institution_Name__c,Area_of_specialization__c,Percentage__c,Percentage_cgpa__c,
                                                                                                        Thesis_Supervisor__c,Thesis_Type__c,Recordtype.Name,RecordTypeId,Title_Thesis__c FROM Education_Details__r) FROM Contact WHERE Proposals__c=:ProposalId];
        //(SELECT id,Awards_Honours__c,List_of_Publications__c,List_of_Patents_filed__c,Book_Chapters__c,Any_other_achievements__c FROM Achievement__r)
        List<Id> listConatctId = new List<Id>();
        for(contact con:listContact){
            listConatctId.add(con.Id);
        }
        List<Achievement__c> listAchievement=[SELECT id,Awards_Honours__c,List_of_Publications__c,List_of_Patents_filed__c,Book_Chapters__c,Any_other_achievements__c FROM Achievement__c where contact__r.Id IN:listConatctId];
        WrapperProposalDet instanceWrapper=new WrapperProposalDet();
        instanceWrapper.Lcon=listContact;
        instanceWrapper.achievements=listAchievement;
        return instanceWrapper;
    }
    public class WrapperProposalDet {
        List<Contact> Lcon;
        List<Achievement__c> achievements;
    }
    
    // @RemoteAction
    // public static Account getMentorHostDetails(string candidateId){
    //     return Proposal_Controller.getMentorHostDetails(candidateId);
    // }
    @RemoteAction
    public static Account getMentorHostDetails(string candidateId,string apaId){
        return Proposal_Controller.getMentorHostDetails(candidateId,apaId);
    }
    
   @RemoteAction
    public static string saveMentorHostDetails(Account AccountRecord, string candidateId, string proposalID,string apaId){
        return Proposal_Controller.saveMentorHostDetails(AccountRecord, candidateId, proposalID,apaId);
    }

    @RemoteAction
    public static List<References__c> checkReferenceEmail(List<string> email, List<Id> ids){
        return Proposal_Controller.checkReferenceEmail(email,ids);
    }
    
    @RemoteAction
    public static List<Account> getApplicantDetailsForGrantWISER(string applicantHashCode){
        contact conRec = [select name,id,Proposals__c,AccountId,Account.Name from contact where Id =:applicantHashCode limit 1];
        System.debug('conRec-----'+conRec);
        list<Account> applicantList = New list<Account>();
        if(conRec.AccountId != null){
            system.debug('applicantList-----'+applicantList);
            applicantList = [select Id,Name,Proposals__c,(SELECT Id,Title__c,Funding_Agency__c,Budget__c,Starting_Date__c,End_Date__c,Role_in_the_Project__c,Account__c,Application__c,Currency__c FROM Existing_Grants__r),(Select Id,Login_Hash_Code__c From Contacts) from Account where Proposals__c=:conRec.Proposals__c];
            return applicantList;
        }
        return null;
    }
    
    @RemoteAction
    public static String insertExistingGrantsWISER(List<ExistingGrantsWrapper> grantList){
        try{
            system.debug('size ---> '+grantList.size());
            // List<Application_Proposal__c> applicationList = new List<Application_Proposal__c>();
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
                grantsRec.Currency__c = wrap.currencyPick;
                grantsRec.Role_in_the_Project__c = wrap.role;
                grantsRec.Starting_Date__c = wrap.startDate;
                grantsRec.End_Date__c = wrap.endDate;
                if(wrap.id != null){
                    grantsRec.id = wrap.id;
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
            // system.debug('applicationList::'+applicationList);
            // upsert applicationList;
            upsert existingGrantList;
            return 'SUCCESS';
            
        }catch(Exception e){
            return e.getMessage();
        }
    }
    
    public class ExistingGrantsWrapper{
        String title;
        String fundingagency;
        String Account;
        String AccountName;
        String budget;
        String currencyPick;
        String id;
        String Application;
        String startDate;
        String endDate;
        String role;
        // Integer startingday;
        // Integer startingmonth;
        // Integer startingyear;
    }
    
    @RemoteAction
    public Static List<References__c> getProposalDetailsReferences(String proposalId){
        try{
            List<References__c> getParticipantList = [SELECT Id,Name,Email__c,Phone__c,Proposals__c,Organisation_Institute__c,Designation__c FROM References__c WHERE Proposals__c =:proposalId];
            System.debug('getParticipantList ::'+getParticipantList);
            return getParticipantList;
        }catch(Exception e){
            System.debug('The Error '+e.getMessage()+' Line'+e.getLineNumber());
            return null;
        }
    }
    
    @RemoteAction
    public static void deleteParticipantsReferences(string partcpntId){
        delete New References__c(Id=partcpntId);
    }
    
    @RemoteAction
    public Static string insertParticipantsReferences(List<References__c> insertParticipantsList, String proposalId){
        try{
            upsert insertParticipantsList;
            return 'success';
        }catch(Exception e){
            return e.getMessage()+e.getLineNumber();
        }
    }
    
    @RemoteAction
    public static Application_Proposal__c getIntimationLetter(string conId){
        try{
            Application_Proposal__c IntimationLetter = New Application_Proposal__c();
            Contact conRec = [SELECT Id,Proposals__c FROM Contact WHERE Id=:conId];
            if(!string.isBlank(conRec.Proposals__c)){
                IntimationLetter = [SELECT Id,Intimation_Letter_Accepted__c FROM Application_Proposal__c WHERE Id=: conRec.Proposals__c];
                return IntimationLetter;
            }else{
                return IntimationLetter;
            }
            
        }catch(Exception e){
            return null;
        }
    }
    
    @RemoteAction
    public static string saveAccepted(Application_Proposal__c details){
        try{
            upsert details;
            return 'success';
            
        }catch(Exception e){
            return e.getMessage();
        }
    }
    
    @RemoteAction
    public static Application_Proposal__c getTentativeDate(string contactId){
        try{
            Application_Proposal__c appProposal = New Application_Proposal__c();
            Contact conRec = [SELECT Id,Proposals__c FROM Contact Where Id =: contactId];
            if(!string.isBlank(conRec.Proposals__c)){
                appProposal = [SELECT Id,Tentative_Start_Date__c,Tentative_End_Date__c,Intimation_Letter_Accepted__c FROM Application_Proposal__c WHERE Id=: conRec.Proposals__c];
            }
            return appProposal;
        }catch(Exception e){
            return null;
        }
    }
    
    @RemoteAction
    public static string saveTentativeDate(Application_Proposal__c applicantDetails, integer day, integer month, integer year, integer endday, integer endmonth, integer endyear){
        try{
            Application_Proposal__c app = New Application_Proposal__c();
            if(day==0 && month==0 && year==0){
                
            }else{
                app.Id = applicantDetails.Id;
                app.Tentative_Start_Date__c = Date.newInstance(year, month, day);
                
            }
            if(endday==0 && endmonth==0 && endyear==0){
                
            }else{
                app.Id = applicantDetails.Id;
                app.Tentative_End_Date__c = Date.newInstance(endyear, endmonth, endday);
                
            }
            upsert app;
            return 'success';
        }catch(Exception e){
            return e.getMessage()+e.getLineNumber();
        }
    }
    
    @RemoteAction
    public static List<Contact> getCoordDetails(string projectId){
        return Proposal_Controller.getCoordDetails(projectId);
    }
    
    @RemoteAction
    public static Contact getConnectContact(string hasCode){
        try{
            Contact conRec = [SELECT Id,FirstName,LastName,Email,Department,Designation__c,Account.Name,Phone,MailingStreet,MailingCity,MailingState,MailingCountry,MailingPostalCode,
                              Proposals__r.Thematic_Area__c,Proposals__r.Title_Of__c,Proposals__r.Title_In_German__c,Proposals__r.Acronym__c,Proposals__r.Proposed_Date__c,Proposals__r.Workshop_Finish_Date__c,
                              Proposals__r.Proposed_Venue__c,Proposals__r.Summary__c From Contact WHERE Login_Hash_Code__c =: hasCode];
            return conRec;
        }catch(Exception e){
            return null;
        }
    }
    
    @RemoteAction
    public static Account getHostDetailsConnect(string ptojectId){
        try{
            Account accRec = [SELECT Id,Name,BillingStreet,BillingCity,BillingCountry,BillingState,BillingPostalCode,Name_of_Mentor__c,
                              Designation_Position_of_the_Mentor__c,Mentor_contact_number__c,Mentor_E_mail_Id__c From Account Where Host__c =: true AND Proposals__c=:ptojectId];
            return accRec;
        }catch(Exception e){
            return null;
        }
    }
    
    @RemoteAction
    public static string insertConnectadditionalPoints(Contact contactDetails, Account hostAccountRecord, Application_Proposal__c appRecord, integer day, integer month, integer year, integer endday, integer endmonth, integer endyear){
        try{
            if(day==0 && month==0 && year==0){
                
            }else{
                appRecord.Proposed_Date__c = Date.newInstance(year, month, day);
                
            }
            if(endday==0 && endmonth==0 && endyear==0){
                
            }else{
                appRecord.Workshop_Finish_Date__c = Date.newInstance(endyear, endmonth, endday);
                
            }
            hostAccountRecord.Proposals__c = appRecord.Id;
            hostAccountRecord.Host__c = true;
            upsert hostAccountRecord;
            upsert appRecord;
            upsert contactDetails;
            return 'success';
        }catch(Exception e){
            return e.getMessage()+e.getLineNumber();
        }
    }
    
    /*
    @RemoteAction
    public static List<Contact> checkBulkEmail(List<string> email, List<Id> ids){
        try{
            List<Contact> refList = [SELECT Id,Name,Email FROM Contact WHERE Email IN: email AND Id NOT IN: ids];
            return refList;
        }catch(Exception e){
            return null;
        }
    }
    */
    @RemoteAction
    public static List<Contact> checkBulkEmail(String email) {
        return [
            SELECT Id, Salutation, FirstName, LastName, Email, Phone, Department,
                AccountId,
                Account.Name,
                Account.Homepage_URL__c,
                Account.BillingStreet,
                Account.BillingCity,
                Account.BillingState,
                Account.BillingCountry,
                Account.BillingPostalCode
            FROM Contact
            WHERE Email = :email
        ];
    }


    @RemoteAction
    public static Contact checkEmailAndFetchContact(String email){
        return [
            SELECT Id, FirstName, LastName, Email, Phone, Department,
                AccountId,
                Account.Name,
                Account.Homepage_URL__c,
                Account.BillingStreet,
                Account.BillingCity,
                Account.BillingState,
                Account.BillingCountry,
                Account.BillingPostalCode
            FROM Contact
            WHERE Email = :email
            LIMIT 1
        ];
    }

    
    @RemoteAction
    public static Account getHostSing(String projectId){
        System.debug('ProjectId====>' + projectId);
        System.debug('getHostSing Method Is Being Called By Harsh');
        
        try {
            // -----------------------------------------
            // STEP 1: Get AccountIds linked to Proposal via Association → Contact
            // -----------------------------------------
            List<Id> accountIds = new List<Id>();
            
            for (Contact c : [
                SELECT AccountId
                FROM Contact
                WHERE Id IN (
                    SELECT Contact__c
                    FROM Applicant_Proposal_Association__c
                    WHERE Proposals__c = :projectId
                )
            ]) {
                if (c.AccountId != null) {
                    accountIds.add(c.AccountId);
                }
            }
            
            System.debug('Related Account Ids ==>' + accountIds);
            
            // No related accounts found
            if (accountIds.isEmpty()) {
                System.debug('No Account found for given ProposalId.');
                return null;
            }
            
            // -----------------------------------------
            // STEP 2: Fetch host Account (Host__c = true) with Contacts
            // -----------------------------------------
            Account acc = [
                SELECT Id, Name, Email__c, BillingStreet, BillingCity, BillingState, BillingCountry,
                BillingPostalCode, Phone,
                (SELECT Id, FirstName, LastName, Name, Designation__c, Email, MobilePhone,
                 MailingStreet, MailingCity, MailingState, MailingCountry,
                 MailingPostalCode, Nationality__c, Department
                 FROM Contacts)
                FROM Account
                WHERE Id IN :accountIds
                AND Host__c = true
                LIMIT 1
            ];
            
            System.debug('Host Account =======> ' + acc);
            return acc;
            
        } catch (Exception e) {
            System.debug('Exception in getHostSing: ' + e.getMessage());
            return null;
        }
    }
    
    @RemoteAction
    public static contact getConSing(string hashCode){
        try{
            Contact conRec = [SELECT Id,Name,MailingCountry,Login_Hash_Code__c, Proposals__c  FROM Contact WHERE Login_Hash_Code__c =: hashCode];
            return conRec;
        }catch(Exception e){
            return null;
        }
    }
    @RemoteAction
    public static contact getConSing222(string hashCode){
        try{
            // Contact conRec = [SELECT Id,Name,MailingCountry,Login_Hash_Code__c, Proposals__c  FROM Contact WHERE Login_Hash_Code__c =: hxashCode];
            
            Contact conRec = [SELECT Id,Name,MailingCountry,Login_Hash_Code__c, (SELECT ID, Name,Proposals__r.Name FROM Applicant_Proposal_Associations__r WHERE  Proposals__r.RecordType_Name__c='SING')   FROM Contact WHERE Login_Hash_Code__c =: hashCode];
            
            return conRec;
        }catch(Exception e){
            return null;
        }
    }
    
    // @RemoteAction
    // public static string saveHostDetails(Account accRecord, Contact conRec, string projectId){
    
    //     try{
    //         accRecord.BillingState = accRecord.Shipping_State__c;
    //         accRecord.Proposals__c = projectId;
    //         accRecord.Host__c = true;
    //         upsert accRecord;
    //         conRec.AccountId = accRecord.Id;
    //         conRec.Proposals__c = projectId;
    //         upsert conRec;
    //         return 'success';
    
    //     }catch(Exception e){
    //         return e.getMessage()+e.getLineNumber();
    //     }
    // }
    
    // **************************************************************************************************
    // Changed by harsh 
    // @RemoteAction
    // public static String saveHostDetails(Account accRecord, Contact conRec, String projectId){
    //     try{
    //         // For Account
    //         if(accRecord.Id != null){
    //             // Update existing account
    //             accRecord.BillingState = accRecord.Shipping_State__c;
    //             // accRecord.Proposals__c = projectId;
    //             accRecord.Host__c = true;
    //             update accRecord;
    //         } else {
    //             // Insert new account
    //             accRecord.BillingState = accRecord.Shipping_State__c;
    //             // accRecord.Proposals__c = projectId;
    //             accRecord.Host__c = true;
    //             insert accRecord;
    //         }
    
    //         // For Contact
    //         conRec.AccountId = accRecord.Id;
    //         // conRec.Proposals__c = projectId;
    
    //         if(conRec.Id != null){
    //             update conRec;
    //         } else {
    //             insert conRec;
    //         }
    
    //         return 'success';
    //     } catch(Exception e){
    //         return e.getMessage() + ' at line ' + e.getLineNumber();
    //     }
    // } 
    
    
    
    @RemoteAction
    public static String saveHostDetails(Account accRecord, Contact conRec, String projectId){
        try{
            // Validate projectId
            if(String.isBlank(projectId)){
                return 'Error: Project ID is required.';
            }
            
            // For Account
            if(accRecord.Id != null){
                // Update existing account
                accRecord.BillingState = accRecord.Shipping_State__c;
                accRecord.Host__c = true;
                update accRecord;
            } else {
                // Insert new account
                accRecord.BillingState = accRecord.Shipping_State__c;
                accRecord.Host__c = true;
                insert accRecord;
            }
            
            // For Contact
            conRec.AccountId = accRecord.Id;
            
            if(conRec.Id != null){
                update conRec;
            } else {
                insert conRec;
            }
            
            // Check if Association already exists for this Contact and Proposal
            List<Applicant_Proposal_Association__c> existingAssociations = [
                SELECT Id
                FROM Applicant_Proposal_Association__c
                WHERE Contact__c = :conRec.Id
                AND Proposals__c = :projectId
                LIMIT 1
            ];
            
            if(existingAssociations.isEmpty()){
                // Create new Applicant Proposal Association
                Applicant_Proposal_Association__c association = new Applicant_Proposal_Association__c(
                    Contact__c = conRec.Id,
                    Proposals__c = projectId
                );
                insert association;
            }
            
            return 'success';
        } catch(Exception e){
            return e.getMessage() + ' at line ' + e.getLineNumber();
        }
    }
    
    
    
    
    
    
    
    
    
    
    // *********************************************************************
    
    @RemoteAction
    public static List<Expense_Head__c> getExpenseFromProposal(string proposalId){
        return Proposal_Controller.getExpenseFromProposal(proposalId);
    }
    
    /*
@RemoteAction
public static List<Contact> getCoordCVDetails(string proposalid){
return Proposal_Controller.getCoordCVDetails(proposalid);
}
*/
    
    @RemoteAction
    public static List<Contact> getCoordCVDetails(String hashcode, String apaId, String proposalId){
        return Proposal_Controller.getCoordCVDetails(hashcode, apaId, proposalId);
    }
    
    
    @RemoteAction
    public static List<Expense_Head__c> getAllExpenseHeadwithTotalELI(string proposalId){
        try{
            List<Expense_Head__c> ExpenseHeadList = [SELECT Id,Name,Total_Year_1_ELI__c,Total_Year_2_ELI__c,Total_Year_3_ELI__c,Year_1_Actual_Spent__c,Year_1_Adjustment_Amount__c,Year_2_Actual_Spent__c,Year_2_Adjustment_Amount__c,Year_3_Actual_Spent__c,Year_3_Adjustment_Amount__c,Currency_Type__c FROM Expense_Head__c Where Proposals__c =: proposalId];
            return ExpenseHeadList;
        }catch(Exception e){
            return null;
        }
    }
    
    @RemoteAction
    public static string saveAllExpenseHeadExpense(List<Expense_Head__c> expenseHeadList){
        try{
            if(!expenseHeadList.isEmpty()){
                upsert expenseHeadList;
            }
            return 'success';
        }catch(Exception e){
            return e.getMessage()+e.getLineNumber();
        }
    }
    
    @RemoteAction
    public static Contact getExpirationDate(string contId){
        try{
            Contact conRec = [SELECT Id,Name,Hashcode_Expiration_Date__c FROM Contact WHERE Id =: contId];
            return conRec;
        }catch(Exception e){
            return null;
        }
    }
    
    @RemoteAction
    public static Bank_Details__c getBankDetailsOfIFContact(string conId){
        try{
            Bank_Details__c banDet = [SELECT Id,Name,Bank_Name__c,Bank_Account_Number__c,Bank_IFSC_Code__c,Bank_SWIFT_Code__c,Bank_Branch_Name__c,Bank_Address__c,Contact__r.Account_Country_Type__c From Bank_Details__c WHERE Contact__c =: conId];
            return banDet;
        }catch(Exception e){
            return null;
        }
    }
    
    @RemoteAction
    public static string saveBankDetails(Bank_Details__c bankDetails){
        try{
            upsert bankDetails;
            return 'SUCCESS';
        }catch(Exception e){
            return e.getMessage()+e.getLineNumber();
        }
    }
    
    @RemoteAction
    public static Contact getDocUploadDet2(String loginHashCode){
        return [SELECT Id,Name,AccountId,Proposals__r.Id,Proposals__r.Name,Proposals__r.SC_Review_Stages__c,(select id,name,Bank_Account_Number__c,Bank_Address__c,Bank_Branch_Name__c,Bank_Name__c,Bank_IFSC_Code__c,Bank_SWIFT_Code__c,Bank_Type__c from Bank_Details__r),Proposals__r.Invitation_Letter_Form_Status__c,Proposals__r.Security_Sensitivity_Clearance_Stage__c,Proposals__r.Due_Diligence_Stage__c,Proposals__r.Proposal_Stages__c,Proposals__r.Decision_Letter_Sent__c,Proposals__r.Travel_Form_Status__c,Proposals__r.Visa_Stages__c,Proposals__r.Undertaking_Status__c From Contact WHERE Login_Hash_Code__c=: loginHashCode Limit 1];
    }
    
    @RemoteAction
    public static String updateIFDocStatus2(Application_Proposal__c instanceProposal){
        try{
            upsert instanceProposal;
            return 'success';
        }catch(Exception e){
            system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
            return 'Error Occured';
        }
    }
    
    @RemoteAction
    public static Contact getAccountCountryType(string conId){
        try{
            Contact ConRec = [SELECT Id,Account_Country_Type__c,Proposals__r.Bank_Status__c,Proposals__r.Undertaking_Status__c FROM Contact WHERE Id =: conId];
            return ConRec;
        }catch(Exception e){
            return null;
        }
    }
    
    @RemoteAction
    public static string regenrateLink(string contId){
        try{
            Date todayDate  = System.today();
            Contact contactRecord = [SELECT Id,FirstName,LastName,Login_Hash_Code__c,Hashcode_Expiration_Date__c,Email FROM Contact WHERE Id =: contId];
            Emailtemplate emailTempRec =  [Select Id,HtmlValue,Subject from EmailTemplate where Name ='Regenerate Expired Link - IF'];
            Id orgWideEmailAddressId = [SELECT Id FROM OrgWideEmailAddress WHERE Address = 'isha999raj@gmail.com'].Id;
            system.debug('orgWideEmailAddressId ==> '+orgWideEmailAddressId);
            system.debug('HashCode Before Update ==> '+contactRecord);
            
            /*commented this logic to resolve login hash code issue and added below logic
contactRecord.Login_Hash_Code__c = Utility.generateRandomString();
contactRecord.Hashcode_Expiration_Date__c = todayDate.addDays(3);
*/
            //logic added by rutuja
            if(String.isBlank(contactRecord.Login_Hash_Code__c)){
                contactRecord.Login_Hash_Code__c = Utility.generateRandomString();
            }
            HashcodeExpiryDate__c hashcodeNumberofDays = HashcodeExpiryDate__c.getInstance();
            Decimal test = hashcodeNumberofDays.Hashcode_Expiration_Date__c;
            if(String.isBlank(String.valueOf(contactRecord.Hashcode_Expiration_Date__c))){
                contactRecord.Hashcode_Expiration_Date__c = todayDate.addDays(Integer.valueOf(hashcodeNumberofDays.Hashcode_Expiration_Date__c));
            }
            //till here
            
            update contactRecord;
            
            system.debug('contactRecord After Update ==> '+contactRecord);
            system.debug('HashCode After Update ==> '+contactRecord);
            
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            mail.setOrgWideEmailAddressId(orgWideEmailAddressId);
            mail.setToAddresses(new String[] { contactRecord.Email});
            system.debug('Email ==> '+contactRecord.Email);
            mail.setSubject(emailTempRec.Subject);
            string emailHtmlValue = emailTempRec.HtmlValue;
            
            if(!string.isBlank(contactRecord.FirstName)){
                emailHtmlValue = emailHtmlValue.replace('{!Contact.FirstName}', contactRecord.FirstName);
            }
            if(!string.isBlank(contactRecord.LastName)){
                emailHtmlValue = emailHtmlValue.replace('{!Contact.LastName}', contactRecord.LastName);
            }
            if(!string.isBlank(contactRecord.Login_Hash_Code__c)){
                emailHtmlValue = emailHtmlValue.replace('{!Contact.Login_Hash_Code__c}', contactRecord.Login_Hash_Code__c);
            }
            if(!string.isBlank(contactRecord.Id)){
                emailHtmlValue = emailHtmlValue.replace('{!Contact.Id}', contactRecord.Id);
            }
            
            mail.setHtmlBody(emailHtmlValue);//Set HTML Body
            system.debug('mail ==>'+mail);
            //Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
            system.debug('SUCCESS-----');
            
            Messaging.sendEmailResult[] mrs = Messaging.sendEmail(new Messaging.Email[] { mail }, false);
            
            for (Messaging.SendEmailResult mr : mrs)
            {
                if (mr.isSuccess()) {
                    system.debug('SUCCESS-----Email');//Do something for success
                }  else {
                    // Operation failed, so get all errors
                    for(Messaging.SendEmailError err : mr.getErrors()) {
                        System.debug('The following error has occurred.');
                        System.debug(err.getStatusCode() + ': ' + err.getMessage());
                        System.debug('fields that affected this error: ' + err.getFields());
                    }
                }
            }
            return 'SUCCESS';
            
        }catch(Exception e){
            system.debug('ERROR ==> '+e.getMessage()+e.getLineNumber());
            return e.getMessage()+e.getLineNumber();
        }
    }
}