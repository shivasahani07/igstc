public without sharing class ApplicantPortal_Contoller {
 
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
    public string secondStage  {get;set;}
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
    public String proposalWrapperListJSON { get; set; }


   public String yearList { get; set; } //Added by Karthik for year dropdown

    // Contact Profile Properties
    public Contact con { 
        get {
            if (con == null) {
                con = new Contact();
            }
            return con;
        }
        set;
    }
    public List<Education_Details__c> educationList { 
        get {
            if (educationList == null) {
                educationList = new List<Education_Details__c>();
            }
            return educationList;
        }
        set;
    }
    public List<Employment_Details__c> employmentList { 
        get {
            if (employmentList == null) {
                employmentList = new List<Employment_Details__c>();
            }
            return employmentList;
        }
        set;
    }
    public List<Achievement__c> achievementList { 
        get {
            if (achievementList == null) {
                achievementList = new List<Achievement__c>();
            }
            return achievementList;
        }
        set;
    }
    public Id profileImageId { get; set; }
    
    public String getProfileImageUrl() {
        if (profileImageId != null) {
            String attId = String.valueOf(profileImageId);
            return '/servlet/servlet.FileDownload?file=' + attId;
        }
        return '';
    }
    
    public String getEducationListJSON() {
        try {
            if (educationList == null) {
                educationList = new List<Education_Details__c>();
            }
            String jsonStr = JSON.serialize(educationList);
            System.debug('EducationListJSON: ' + jsonStr);
            return jsonStr;
        } catch (Exception e) {
            System.debug('Error serializing educationList: ' + e.getMessage());
            return '[]';
        }
    }
    
    public String getEmploymentListJSON() {
        try {
            if (employmentList == null) {
                employmentList = new List<Employment_Details__c>();
            }
            String jsonStr = JSON.serialize(employmentList);
            System.debug('EmploymentListJSON: ' + jsonStr);
            return jsonStr;
        } catch (Exception e) {
            System.debug('Error serializing employmentList: ' + e.getMessage());
            return '[]';
        }
    }
    
    public String getAchievementListJSON() {
        try {
            if (achievementList == null) {
                achievementList = new List<Achievement__c>();
            }
            String jsonStr = JSON.serialize(achievementList);
            System.debug('AchievementListJSON: ' + jsonStr);
            return jsonStr;
        } catch (Exception e) {
            System.debug('Error serializing achievementList: ' + e.getMessage());
            return '[]';
        }
    }
    
    public ApplicantPortal_Contoller() {
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

        // Fetch Year__c records (year object)//Added By karthik
        List<Year__c> yearRecs = [SELECT Id, Name,Is_Active__c,Is_Current_Year__c FROM Year__c WHERE Is_Active__c= true ORDER BY Name DESC];
        yearList = JSON.serialize(yearRecs);


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
        
        // Initialize contact profile lists
        educationList = new List<Education_Details__c>();
        employmentList = new List<Employment_Details__c>();
        achievementList = new List<Achievement__c>();
        con = new Contact();
        
        if(!string.isBlank(candidateId)){
            List<contact> applicantDetails = [SELECT Id,Email,Status__c,account.Is_Coordinator__c,name,Account.Id,Proposals__c,Proposals__r.Campaign__r.Name,Email_Verified__c,Campaign__c,Login_Hash_Code__c,(SELECT Id, Is_Coordinator__c, Proposals__r.Id, Proposals__r.Stage__c, Proposals__r.Proposal_Stages__c FROM Applicant_Proposal_Associations__r) FROM contact WHERE Login_hash_code__c =:candidateId];
            for(Contact conRec : applicantDetails){
                emailVerified = String.valueOf(conRec.Email_Verified__c);
            }
            // if(!string.isBlank(applicantDetails[0].Proposals__c)){
            //     Application_Proposal__c proposal = [SELECT Id,Name,Stage__c,Proposal_Stages__c FROM Application_Proposal__c where Id =: applicantDetails[0].Proposals__c];
            //     secondstage = proposal.stage__c;
            //     proposalStage = proposal.Proposal_Stages__c;
            // }
            proposalWrapperList = new List<proposalWrap>();
            if(!applicantDetails.isEmpty() && !applicantDetails[0].Applicant_Proposal_Associations__r.isEmpty()){
                for(Applicant_Proposal_Association__c apa : applicantDetails[0].Applicant_Proposal_Associations__r) {
                    proposalWrap wrap = new proposalWrap();
                    wrap.apaId = apa.Id;
                    wrap.Id = apa.Proposals__r.Id;
                    wrap.proposalStage = apa.Proposals__r.Proposal_Stages__c;
                    secondStage = apa.Proposals__r.Stage__c=='2nd Stage' ?'true':'false';
                    proposalStage= apa.Proposals__r.Proposal_Stages__c;
                    System.debug('************** proposalStage = ' + apa.Proposals__r.Proposal_Stages__c);
                    wrap.secondStage = (apa.Proposals__r.Stage__c == '2nd Stage');
                    wrap.stage = apa.Proposals__r.Stage__c;
                    proposalWrapperList.add(wrap);
                }
            }
            proposalWrapperListJSON = JSON.serialize(proposalWrapperList);
            System.debug('proposalWrapperListJSON : ' + proposalWrapperListJSON);
            
            if(applicantDetails.size() >0){
                contactId = applicantDetails[0].Id;
                 projectId = applicantDetails[0].Proposals__c;
                campaigntype = applicantDetails[0].Campaign__c;
                applicantName=applicantDetails[0].Name;
                applicantEmail=applicantDetails[0].Email;
                accountId=applicantDetails[0].Account.Id;
                if(!applicantDetails[0].Applicant_Proposal_Associations__r.isEmpty()){
                    isPrimaryContact = applicantDetails[0].Applicant_Proposal_Associations__r[0].Is_Coordinator__c;
                    isCoordinator = applicantDetails[0].Applicant_Proposal_Associations__r[0].Is_Coordinator__c;
                } else {
                    isPrimaryContact = false;
                    isCoordinator = applicantDetails[0].Account.Is_Coordinator__c;
                }
                if(applicantDetails[0].Status__c == 'Submitted'){
                    partnerSubmission = true;
                }else {
                    partnerSubmission = false;
                }
                
                // Load contact profile data
                loadContactProfileData(contactId);
            }
        } else if (!String.isBlank(contactId)) {
            // If contactId is set directly (e.g., from URL parameter), load profile data
            loadContactProfileData(contactId);
        }
        
    }
    
    // Load contact profile data for Profile section
    private void loadContactProfileData(Id conId) {
        System.debug('loadContactProfileData called with conId: ' + conId);
        if (conId != null) {
            try {
                List<Contact> contactList = [
                    SELECT Id, Salutation, FirstName, LastName, Email, Phone, MobilePhone,
                           MailingCountry, MailingCity, MailingPostalCode, MailingState,
                           MailingStreet, Title, Designation__c, Department, AccountId, Account.Id, Account.Name,
                           Profile_Pic_Attachment_Id__c, Uploaded__c,
                           (SELECT Id, Name, Degree__c, Institution_Name__c, Area_of_specialization__c, 
                                   Start_Year__c, End_Year__c, CGPA__c, Percentage__c, Percentage_cgpa__c,
                                   Start_Date__c, End_Date__c, Nature_of_PhD_Work__c, Nature_of_Thesis_Work__c,
                                   Thesis_Supervisor__c, Thesis_Type__c, Title_Thesis__c, Contact__c
                            FROM Education_Details__r
                            ORDER BY End_Year__c DESC NULLS LAST, Start_Year__c DESC NULLS LAST),
                           (SELECT Id, Name, Organization_Name__c, Position__c, Start_Date__c, End_Date__c,
                                   Start_Year__c, End_Year__c, Nature_of_Job__c, current_employement__c, Contact__c
                            FROM Employment_Details__r
                            ORDER BY End_Date__c DESC NULLS LAST, Start_Date__c DESC NULLS LAST),
                           (SELECT Id, Name, Awards_Honours__c, List_of_Publications__c, Book_Chapters__c, 
                                   List_of_Patents_filed__c, Any_other_achievements__c, Contact__c                                   
                            FROM Achievements__r
                            ORDER BY CreatedDate DESC)
                    FROM Contact
                    WHERE Id = :conId
                    LIMIT 1
                ];
                
                if (!contactList.isEmpty()) {
                    con = contactList[0];
                    
                    educationList = con.Education_Details__r != null ? con.Education_Details__r : new List<Education_Details__c>();
                    employmentList = con.Employment_Details__r != null ? con.Employment_Details__r : new List<Employment_Details__c>();
                    
                    System.debug('Loaded educationList size: ' + educationList.size());
                    System.debug('Loaded employmentList size: ' + employmentList.size());
                    
                    try {
                        achievementList = con.Achievements__r != null && !con.Achievements__r.isEmpty()
                            ? con.Achievements__r
                            : new List<Achievement__c>();
                        System.debug('Loaded achievementList size: ' + achievementList.size());
                    } catch (Exception ex) {
                        System.debug('Error loading achievements from relationship: ' + ex.getMessage());
                        achievementList = new List<Achievement__c>();
                        try {
                            List<Achievement__c> achList = [
                                SELECT Id, Name, Awards_Honours__c, List_of_Publications__c, 
                                       Book_Chapters__c, List_of_Patents_filed__c, Any_other_achievements__c, Contact__c
                                FROM Achievement__c
                                WHERE Contact__c = :con.Id
                                ORDER BY CreatedDate DESC
                                LIMIT 10
                            ];
                            achievementList = achList;
                            System.debug('Loaded achievementList from direct query size: ' + achievementList.size());
                        } catch (Exception e2) {
                            System.debug('Error loading achievements from direct query: ' + e2.getMessage());
                            achievementList = new List<Achievement__c>();
                        }
                    }
                    
                    // Load profile image
                    if (con.Profile_Pic_Attachment_Id__c != null) {
                        try {
                            String attIdStr = String.valueOf(con.Profile_Pic_Attachment_Id__c);
                            profileImageId = Id.valueOf(attIdStr);
                            System.debug('Loaded profileImageId: ' + profileImageId);
                        } catch (Exception e) {
                            System.debug('Error loading profile image ID: ' + e.getMessage());
                        }
                    }
                } else {
                    System.debug('No contact found with Id: ' + conId);
                    con = new Contact();
                    educationList = new List<Education_Details__c>();
                    employmentList = new List<Employment_Details__c>();
                    achievementList = new List<Achievement__c>();
                }
            } catch (Exception e) {
                System.debug('Error loading contact profile data: ' + e.getMessage());
                System.debug('Stack trace: ' + e.getStackTraceString());
                con = new Contact();
                educationList = new List<Education_Details__c>();
                employmentList = new List<Employment_Details__c>();
                achievementList = new List<Achievement__c>();
            }
        } else {
            System.debug('conId is null, initializing empty lists');
            con = new Contact();
            educationList = new List<Education_Details__c>();
            employmentList = new List<Employment_Details__c>();
            achievementList = new List<Achievement__c>();
        }
    }

    public class proposalWrap {
        public String Id {get; set;}
        public String stage {get; set;}
        public String proposalStage {get; set;}
        public String apaId {get; set;}
        public Boolean secondStage {get;set;}
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
    
    public class ProposalData{
        public String proposalStage {get; set;}
        public Boolean isCoordinator {get; set;}
        public String stage {get; set;}
        public Decimal durationInMonths {get;set;}
        public String mailingCountry {get;set;}
        public Boolean expenseDetailsSubmitted {get;set;}
    } 

    @RemoteAction
    public static ProposalData getProposalStageUsingProposalId(String proposalId, String apaId){

        Applicant_Proposal_Association__c apaDetails = [
            SELECT Id, Contact__c, Is_Coordinator__c, Proposals__c, Proposals__r.Id, Proposals__r.Name, Proposals__r.Proposal_Stages__c, 
            Proposals__r.Stage__c, Proposals__r.Duration_In_Months_Max_36__c, Contact__r.MailingCountry, Expense_Details_Submitted__c
            FROM Applicant_Proposal_Association__c 
            WHERE Id =: apaId 
            AND Proposals__c =: proposalId
            LIMIT 1
        ];

        ProposalData pData = new ProposalData();
        pData.proposalStage = apaDetails.Proposals__r.Proposal_Stages__c;
        pData.isCoordinator = apaDetails.Is_Coordinator__c;
        pData.stage = apaDetails.Proposals__r.Stage__c;
        pData.durationInMonths = apaDetails.Proposals__r.Duration_In_Months_Max_36__c;
        pData.mailingCountry = apaDetails.Contact__r.MailingCountry;    
        pData.expenseDetailsSubmitted = apaDetails.Expense_Details_Submitted__c;

        return pData;
        // Application_Proposal__c ap = [SELECT Id, Stage__c, Proposal_Stages__c FROM Application_Proposal__c WHERE Id =: proposalId];

        // return ap.Proposal_Stages__c;
   
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
   /*public class ApplicantWrap {
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
            List<Applicant_Proposal_Association__c> applicantAssociationList= [SELECT Id, Contact__c, Contact__r.Name, Proposals__c, Proposals__r.Campaign__r.Name, Proposals__r.Campaign__r.Description, Proposals__r.Campaign__r.Actual_End_Date__c, Proposals__r.Campaign__r.Icon__c, Proposals__r.Campaign__r.RedirectPage__c, Proposals__r.Campaign__r.Id FROM Applicant_Proposal_Association__c WHERE Contact__r.Login_hash_code__c =:candidateId];
            if(!applicantAssociationList.isEmpty()) {
                wrap.appliedCampaign = applicantAssociationList;
            }
            return wrap;
        } catch(Exception e) {
            System.debug('Error while getting Applicant Data ===> ' + e.getMessage() + ' at Line Number ===> ' + e.getLineNumber() + ' Stack Trace String ===> ' + e.getStackTraceString());
            return null;
        }
    } 
    
    */
      
 //Added By karthik  ( I need to add Attachments and Campaign_Guidlines from campaign in this query.)
   public class ApplicantWrap {
        public List<YealyCall__c> campaignList {get; set;}  // Changed to YearlyCall__c
        public List<Applicant_Proposal_Association__c> appliedCampaign {get; set;}
    }
    
    @RemoteAction
    public static ApplicantWrap getApplicantData(String candidateId, String yearId) {
        ApplicantWrap wrap = new ApplicantWrap();
        try {
            // Fetch campaigns through Yearly-Call 
            List<YealyCall__c> yearlyCalls = [
                SELECT Id, Name, Campaign__c,Campaign__r.Name, Campaign__r.Description,Campaign__r.Actual_End_Date__c,Campaign__r.Disable_Campaign__c, Years__c, 
                       Campaign__r.EndDate,Campaign__r.Image_URL__c,Campaign__r.RedirectPage__c,Campaign__r.Cut_Off_Start_Date__c,Campaign__r.Cut_Off_End_Date__c,Campaign__r.Icon__c,Campaign_Start_Date__c,Campaign_End_Date__c,Second_Stage_Start_Date_Time__c,Second_Stage_End_Date_Time__c
                FROM YealyCall__c   WHERE Active__c = true AND Years__c = :yearId];
            
            if(!yearlyCalls.isEmpty()) {
                wrap.campaignList = yearlyCalls;
            }
            
            // Applied campaigns 
            List<Applicant_Proposal_Association__c> applicantAssociationList = [
                SELECT Id, Contact__c, Proposals__c,Proposals__r.Id,Proposals__r.Name,Proposals__r.Title_Of__c,Proposals__r.Proposal_Stages__c,Proposals__r.Stage__c, Is_Signatory__c, Proposals__r.Campaign__r.Id,Proposals__r.Campaign__r.Name,
                        Contact__r.Title_Of_Project__c, Proposals__r.Campaign__r.Description, Proposals__r.Campaign__r.Actual_End_Date__c, Proposals__r.Campaign__r.Icon__c, Proposals__r.Campaign__r.RedirectPage__c,
                        Proposals__r.yearly_Call__c,Proposals__r.yearly_Call__r.Id,Proposals__r.yearly_Call__r.Campaign_Start_Date__c,Proposals__r.yearly_Call__r.Campaign_End_Date__c,Proposals__r.yearly_Call__r.Second_Stage_Start_Date_Time__c,Proposals__r.yearly_Call__r.Second_Stage_End_Date_Time__c
                FROM Applicant_Proposal_Association__c WHERE Contact__r.Login_hash_code__c = :candidateId  AND Proposals__r.yearly_Call__r.Years__C = :yearId AND Is_Signatory__c = false];
            
            if(!applicantAssociationList.isEmpty()) {
                wrap.appliedCampaign = applicantAssociationList;
            }        
            return wrap;
        }
        catch(Exception e) {
            System.debug('Error: ' + e.getMessage());
            return null;
        }
    }


    
    
    @RemoteAction
    public static String getContactName(String hashcode){

        System.debug('------------------ getContactName() --------------------');

        if(String.isBlank(hashcode)) return 'INVALID hascode';

        Contact con = [
            SELECT Id, Name, FirstName, LastName, Login_hash_code__c
            FROM Contact 
            WHERE Login_hash_code__c = :hashcode
        ];
        return con.Name;
    }

    @RemoteAction
    public static Map<String, String> getUserDetails(String hashcode){

        System.debug('------------------ getUserDetails() --------------------');

        Map<String, String> userDetails = new Map<String, String>();
        
        if(String.isBlank(hashcode)) {
            return userDetails;
        }

        Contact con = [
            SELECT Id, Name, Email, Profile_Pic_Attachment_Id__c
            FROM Contact 
            WHERE Login_hash_code__c = :hashcode
            LIMIT 1
        ];
        
        if(con != null) {
            userDetails.put('email', con.Email != null ? con.Email : '');
            userDetails.put('profilePicId', con.Profile_Pic_Attachment_Id__c != null ? String.valueOf(con.Profile_Pic_Attachment_Id__c) : '');
        }
        
        return userDetails;
    }
	
    
    public class UserWrap {
        String firstName;
        String lastName;
        String email;
        String org;
        String title;
        String password;
        String country;
        String birthdate;
    }
    @RemoteAction
    public static String insertNewUser( UserWrap newUser ) {
        System.debug('newUser ===> ' + newUser);
        if(newUser == null) {
            return 'No data was passed!';
        }
        try {
            // Check for existing user by email
            List<Contact> conListByEmail = [SELECT Id,Name,Email From Contact WHERE Email=: newUser.email];
            system.debug('conListByEmail ::'+conListByEmail);
            if(conListByEmail.size() > 0){
                return 'A User with this email already exists in our system please try with new Email!';
            }
            
            // Check for existing user by Date of Birth + First Name + Last Name combination
            if(String.isNotBlank(newUser.birthdate)) {
                Date birthDate = Date.valueOf(newUser.birthdate);
                List<Contact> conListByDOB = [
                    SELECT Id, Name, Email, FirstName, LastName, Birthdate 
                    FROM Contact 
                    WHERE Birthdate = :birthDate 
                    AND FirstName = :newUser.firstName 
                    AND LastName = :newUser.lastName
                ];
                system.debug('conListByDOB ::'+conListByDOB);
                if(conListByDOB.size() > 0){
                    return 'A User with this Date of Birth and Name combination already exists in our system. Please contact support if you believe this is an error.';
                }
            }
            
            // If no existing user found, create new user
            Account acc = new Account();
            Contact con = new Contact();
            acc.Name = newUser.org;
            acc.Is_Coordinator__c = true; // Changed by Rukasar
            insert acc;
            con.AccountId = acc.Id;
            con.Title = newUser.title;
            con.FirstName = newUser.firstName;
            con.LastName = newUser.lastName;
            con.Email = newUser.Email;
            con.Password__c = newUser.password;
            con.MailingCountry = newUser.country;
            if(String.isNotBlank(newUser.birthdate)) {
                con.Birthdate = Date.valueOf(newUser.birthdate);
            }
            insert con;
            // return 'Successfully created new user!';
            //return 'You have successfully registered on IGSTC Portal, Please check your E-mail!';
            return 'You have successfully registered on IGSTC Portal, kindly verify your E-mail before logging in!';
        }catch(Exception e) {
            System.debug('Error while craeting new contact and account ==> ' + e.getMessage() + ' at Line ===> ' + e.getLineNumber() + ' Stack Trace ===> ' + e.getStackTraceString());
            return 'Error creating new user: ' + e.getMessage();
        }
    }
    /*
    //campaign method for Pecfar added by rukasar:
@RemoteAction
public static List<Campaign> getActiveCampaign(string campaign_name) {
    try {
        List<Campaign> campaigns = [SELECT Id, Name,Yearly_Call__r.Pecfar_age_limit__c,Yearly_Call__r.Date_of_Birth_PECFAR__c FROM Campaign WHERE Yearly_Call__c !=null And  IsActive = true and name= :campaign_name];
        
        if (!campaigns.isEmpty()) {
            return campaigns;
        }
        return null;
    } catch (Exception e) {
        System.debug('Error: ' + e.getMessage());
        return null;
    }
}
*/
     @RemoteAction
 public static List<YealyCall__c> getActiveCampaign(String yearlyCallId) {
     try {
         List<YealyCall__c> yearlycallCampaigns = [SELECT Id, Name,Campaign__c,Pecfar_age_limit__c,Date_of_Birth_PECFAR__c FROM YealyCall__c WHERE Id = :yearlyCallId];
       
         if (!yearlycallCampaigns.isEmpty()) {
            return yearlycallCampaigns;
        }
         return null;
    } catch (Exception e) {
         System.debug('Error: ' + e.getMessage());
         return null;
}
 }
    
    
    
    // Campaign method for If added by rukasar:
/* @RemoteAction
public static List<Campaign> getActiveCampaignIf(string campaign_name) {
    try {
        List<Campaign> campaigns = [SELECT Id, Name, Yearly_Call__r.PIEF_Age_Limit__c,Yearly_Call__r.PIEF_PhD_time__c,
                                    Yearly_Call__r.Date_of_Birth_PIEF__c,Yearly_Call__r.PhD_Enrollment_Date_PIEF__c,
                                    Yearly_Call__r.PDIF_Age_Limit__c,Yearly_Call__r.PDIF_PhD_time__c,
                                    Yearly_Call__r.Date_of_Birth_PDIF__c,Yearly_Call__r.PhD_Enroll_ment_Date_PDIF__c 
                                    FROM Campaign WHERE Yearly_Call__c != null AND Name = :campaign_name];
        							//I need to Add 'IsActive = true' in this query after activating the campaign.
   									     
        if (!campaigns.isEmpty()) {
            return campaigns;
        }
        
        return null;
    } catch (Exception e) {
        System.debug('Error: ' + e.getMessage());
        return null;
    }
}*/

 @RemoteAction
public static List<YealyCall__c> getActiveCampaignIf(String yearlyCallId) {
    try {
        List<YealyCall__c> yearlycalls = [SELECT Id, Name, Campaign__c,Years__c,PIEF_Age_Limit__c,Campaign_End_Date__c,PIEF_PhD_time__c,
                                    Date_of_Birth_PIEF__c,PhD_Enrollment_Date_PIEF__c,
                                    PDIF_Age_Limit__c,PDIF_PhD_time__c,
                                    Date_of_Birth_PDIF__c,PhD_Enroll_ment_Date_PDIF__c 
                                    FROM YealyCall__c WHERE Id = :yearlyCallId];
        							
   									     
        if (!yearlycalls.isEmpty()) {
            return yearlycalls;
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
        result.put('redirectUrl',System.Label.Siteappurl+c[0].Login_Hash_Code__c
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


        //**************************************Support Case ***********************************************
        // @RemoteAction
        // public static Map<String, Object> createSupportCase(String name,String email,String comment,String proposalId) {
        //     Map<String, Object> res = new Map<String, Object>();
        //     try {
        //         if (String.isBlank(name) || String.isBlank(email) || String.isBlank(comment)) {
        //             res.put('success', false);
        //             res.put('message', 'Please fill all mandatory fields.');
        //             return res;
        //         }

        //         Case c = new Case(
        //             SuppliedName = name,
        //             SuppliedEmail = email,
        //             Subject = 'IGSTC Support Request',
        //             Origin = 'Web',
        //             Comments__c = comment
        //         );
        //         if (!String.isBlank(proposalId)) {
        //             c.Application__c = proposalId;
        //         }
        //         insert c;

        //         res.put('success', true);
        //         res.put('message', 'SUCCESS');
        //         return res;

        //     } 
        //     catch (Exception e) {
        //         res.put('success', false);
        //         res.put('message', e.getMessage());
        //         return res;
        //     }
        // }


        @RemoteAction
        public static Map<String, Object> createSupportCase(String name,String email,String comment,String proposalNumber,String program) {
            Map<String, Object> res = new Map<String, Object>();
            try {
                if (String.isBlank(name) || String.isBlank(email) || String.isBlank(comment)) {
                    res.put('success', false);
                    res.put('message', 'Please fill all mandatory fields.');
                    return res;
                }
                // Email format validation
                String emailRegex = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';
                if (!Pattern.matches(emailRegex, email)) {
                    res.put('success', false);
                    res.put('message', 'Invalid email format.');
                    return res;
                }

               /* if (String.isBlank(program)) {
                    res.put('success', false);
                    res.put('message', 'Program is required.');
                    return res;
                }*/
                // Find Contact by Email
                Contact matchedContact;
                List<Contact> contacts = [SELECT Id FROM Contact WHERE Email = :email LIMIT 1];
                if (!contacts.isEmpty()) {
                    matchedContact = contacts[0];
                }
                 /* ======================
                FIND PROPOSAL BY NAME
                ====================== */
                Id proposalId;
                if (!String.isBlank(proposalNumber)) {
                    List<Application_Proposal__c> proposals = [SELECT Id FROM Application_Proposal__c WHERE Name = :proposalNumber LIMIT 1];
                    if (!proposals.isEmpty()) {
                        proposalId = proposals[0].Id;
                    } else {
                        res.put('success', false);
                        res.put('message', 'Invalid Proposal Number.');
                        return res;
                    }
                }

                // Create Case
                Case c = new Case(
                    SuppliedName  = name,
                    SuppliedEmail = email,
                    Application_Number__c=proposalNumber,
                    Status = 'Pending',
                    Subject       = 'Support Ticket from Applicant Portal',
                    Origin        = 'Portal',
                    Comments__c   = comment
                   // Program__c    = program
                );
                // Only set Program if provided
                if (!String.isBlank(program)) {
                    c.Program__c = program;
                }
                //  Tag Contact if found
                if (matchedContact != null) {
                    c.ContactId = matchedContact.Id;
                }
                // Optional Proposal link
                if (proposalId != null) {
                    c.Application__c = proposalId;
                }
                insert c;

                res.put('success', true);
                res.put('message', 'SUCCESS');
                return res;

            } catch (Exception e) {
                res.put('success', false);
                res.put('message', e.getMessage());
                return res;
            }
        }


    //**************************************Fetch Tickets (Cases) for Logged-in Contact***********************************************

        @RemoteAction
        public static List<CaseWrapper> getMyTickets(Id contactId) {
            List<CaseWrapper> result = new List<CaseWrapper>();

            for (Case c : [SELECT Id,CaseNumber,Status,SuppliedEmail,SuppliedName,Application_Number__c,Comments__c,Program__c FROM Case WHERE ContactId = :contactId ORDER BY CreatedDate DESC]) {
                result.add(new CaseWrapper(c));
            }
            return result;
        }

        public class CaseWrapper {
            public String caseNumber;
            public String applicationNumber;
            public String status;
            public String email;
            public String name;
            public String comments;
            public String program;

            public CaseWrapper(Case c) {
                caseNumber = c.CaseNumber;
                applicationNumber = String.isBlank(c.Application_Number__c) ? 'NA' : c.Application_Number__c;
                status = c.Status;
                email = c.SuppliedEmail;
                name = c.SuppliedName;
                comments = c.Comments__c; // rich text
                program = c.Program__c;
            }
        }

        //**************************************Fetch Tickets (Cases) for Logged-in Contact***********************************************

        //**************************************Raise Tickets (Cases) for Logged-in Contact***********************************************


        @RemoteAction
        public static List<ProposalWrapper> getProposalsForContact(Id contactId) {
            List<ProposalWrapper> result = new List<ProposalWrapper>();

            for (Applicant_Proposal_Association__c apa : [SELECT Proposals__r.Id,Proposals__r.Name FROM Applicant_Proposal_Association__c WHERE Contact__c = :contactId]) {
                result.add(new ProposalWrapper(apa.Proposals__r.Id,apa.Proposals__r.Name));
            }
            return result;
        }

        public class ProposalWrapper {
            public Id proposalId;
            public String proposalNumber;

            public ProposalWrapper(Id id, String name) {
                proposalId = id;
                proposalNumber = name;
            }
        }


        @RemoteAction
        public static String createTicket(
            Id contactId,
            String proposalNumber,
            String program,
            String comments
        ) {
            try {
                // Validate proposal number (if provided)
                Id proposalId;
                if (!String.isBlank(proposalNumber)) {
                    List<Application_Proposal__c> proposals = [SELECT Id FROM Application_Proposal__c WHERE Name = :proposalNumber LIMIT 1];
                    if (proposals.isEmpty()) {
                        return 'INVALID_PROPOSAL';
                    }
                    proposalId = proposals[0].Id;
                }

                // Fetch contact once
                Contact con = [SELECT Name, Email FROM Contact WHERE Id = :contactId LIMIT 1];

                // Create Case
                Case c = new Case();
                c.ContactId = contactId;
                c.Subject = 'Support Ticket from Applicant Portal';
                c.Origin = 'Portal';
                c.Status = 'Pending';
                c.Program__c = program; 
                c.Comments__c = comments;
                c.SuppliedName = con.Name;
                c.SuppliedEmail = con.Email;
                if (proposalId != null) {
                    c.Application_Number__c = proposalNumber;
                }
                insert c;
                return 'SUCCESS';

            } catch (Exception e) {
                System.debug('Ticket creation error: ' + e.getMessage());
                return 'ERROR';
            }
        }

        //**************************************Raise Tickets (Cases) for Logged-in Contact***********************************************



    //************************************** PROJECT DETAIL PAGE ***********************************************
    
    @RemoteAction
    public static Proposal_Controller.insertApplicationWrapper getApplicantDetails(String applicantHashCode,string apaId){
        return Proposal_Controller.getApplicantDetails(applicantHashCode,apaId);
    }
    
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
    public static  list<account> getPatnerDetails(string identifier){
        // Check if identifier is a proposalId (starts with 'a0' and is 18 chars) or hashcode
        // Proposal IDs in Salesforce are 18 characters and start with specific prefixes
        if (identifier != null && identifier.length() == 18 && (identifier.startsWith('a0') || identifier.startsWith('a1'))) {
            // It's a proposalId - use the new method that queries by proposalId
            return Proposal_Controller.getPatnerDetails(identifier);
        } else {
            // It's a hashcode - need to find proposalId first, but for now use the identifier
            // The Proposal_Controller.getPatnerDetails(String) method expects proposalId
            // If it's a hashcode, we need a different approach
            return Proposal_Controller.getPatnerDetails(identifier);
        }
    }
    
    @RemoteAction
    public static  list<account> getPatnerDetails2(string applicantHashCode){
        return Proposal_Controller.getPatnerDetails2(applicantHashCode);
    }

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
    
    @RemoteAction
    public static Account getAccountByContactId(string accountId){
        try {
            Account acc = [
                SELECT Id, Name, Website, Homepage_URL__c, Phone, BillingCountry, 
                       BillingState, BillingCity, BillingStreet, BillingPostalCode,
                       Academia__c, Industry__c, Is_Coordinator__c
                FROM Account
                WHERE Id = :accountId
                LIMIT 1
            ];
            return acc;
        } catch (Exception e) {
            System.debug('Error in getAccountByContactId: ' + e.getMessage());
            return null;
        }
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
    public static Application_Proposal__c getProjectdetils(string hashcode){
        return Proposal_Controller.getProjectdetils(hashcode);
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
    } */

    @RemoteAction
    public static List<Work_Package__c> getWPDetails(String proposalId, String proposalStage){
        return Proposal_Controller.getWPDetails(proposalId, proposalStage);
    }

    @RemoteAction
    public static List<Account> getProposalAccounts(String ProposalId){
        return Proposal_Controller.getProposalAccounts(ProposalId);
    }

    @RemoteAction 
    public static String saveWorkPackageDet(List<IndustrialFellowshipHelper.WrapperWorkpackageDet> wrapper,String ProposalId, String proposalStage){
        IndustrialFellowshipHelper instanceIFH = new IndustrialFellowshipHelper();
        return instanceIFH.saveWorkPackageDet(wrapper,ProposalId, proposalStage);
    }
    
    /**
     * Gets accounts through contacts linked to proposal via Applicant_Proposal_Association__c
     */
    @RemoteAction
    public static List<Account> getProposalAccountsFromAPA(String proposalId){
        try {
            List<Contact> contactList = [
                SELECT Id, FirstName, LastName, AccountId, Account.Name, Account.BillingCountry, Account.Country_Type__c
                FROM Contact
                WHERE Id IN (
                    SELECT Contact__c
                    FROM Applicant_Proposal_Association__c
                    WHERE Proposals__c = :proposalId
                )
            ];
            
            Set<Id> accountIds = new Set<Id>();
            for(Contact con : contactList) {
                if(con.AccountId != null) {
                    accountIds.add(con.AccountId);
                }
            }
            
            List<Account> accountList = [
                SELECT Id, Name, BillingCountry, Country_Type__c
                FROM Account
                WHERE Id IN :accountIds
            ];
            
            return accountList;
        } catch(Exception e) {
            System.debug('Error in getProposalAccountsFromAPA: ' + e.getMessage());
            return new List<Account>();
        }
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
    
    // @RemoteAction
    // public static  List<Account> getApplicantDetailsForGrant(string applicantHashCode){
    //     return Proposal_Controller.getApplicantDetailsForGrant(applicantHashCode);
    // }

    @RemoteAction
    public static List<Account> getApplicantDetailsForGrant(String apaId, String proposalId){
        return Proposal_Controller.getApplicantDetailsForGrant(apaId, proposalId);
    }
    
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
    
    /**
     * Gets deliverables by proposal ID directly
     */
    @RemoteAction
    public static List<PI_Deliverables__c> getDeliverablesDetailsByProposalId(String proposalId){
        List<PI_Deliverables__c> deliverableList = new List<PI_Deliverables__c>();
        try {
            if(!String.isBlank(proposalId)){
                deliverableList = [
                    SELECT Id, Title__c, External_Id__c, Due_Date__c, Application__c, Account__c, Account__r.Name,
                        (SELECT Id, Name, Account_Name__c, Account__c FROM Deliverables_Account_Mapping__r),
                        (SELECT Id, Name FROM Accounts__r) 
                    FROM PI_Deliverables__c 
                    WHERE Application__c = :proposalId
                ];
            }
            System.debug('deliverableList by proposalId: ' + deliverableList);
            return deliverableList;
        } catch(Exception e) {
            System.debug('Error in getDeliverablesDetailsByProposalId: ' + e.getMessage());
            return new List<PI_Deliverables__c>();
        }
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
    
    //************************************** NEW WP + Deliverables Combined Table **********************************************************
    

    @RemoteAction
    public static List<Work_Package__c> getWPWithDeliverables(String proposalId, String proposalStage){
        try{
            List<Work_Package__c> workPackageList = [
                SELECT Id, WP_Sequence__c, WP_Sequence_2__c, Title__c, TRL_Level__c, End_TRL_Level__c, Duration_Start_Month__c, Duration_End_Month__c, External_Id__c, Application__c,
                       (SELECT Id, Account__c, Application__c, Due_Date__c, Deliverable_Sequence__c, Duration_Start_Month__c, Duration_End_Month__c, External_Id__c, Name, Title__c, Work_Package__c FROM PI_Deliverables__r ORDER BY Deliverable_Sequence__c),
                       (SELECT Id, Account__c FROM Account_Mapping__r)
                FROM Work_Package__c 
                WHERE Application__c = :proposalId
                //AND Proposal_Stage__c = :proposalStage
                ORDER BY WP_Sequence_2__c
            ];
            return workPackageList;
        }catch(Exception e){
            System.debug('Error in getWPWithDeliverables: ' + e.getMessage() + ' Line: ' + e.getLineNumber());
            return new List<Work_Package__c>();
        }
    }
    
    // ------------------------------- DATA FOR GANTT CHART -------------------------------------- //
    @RemoteAction
    public static Map<String, Object> getGanttChartData(String proposalId, String proposalStage, String wpDeliverablesJSON) {
        Map<String, Object> response = new Map<String, Object>();
        
        try {
            // Get proposal details for max duration
            Application_Proposal__c proposal = [
                SELECT Duration_In_Months_Max_36__c 
                FROM Application_Proposal__c 
                WHERE Id = :proposalId
                LIMIT 1
            ];
            
            Integer maxDuration = proposal?.Duration_In_Months_Max_36__c != null ? 
                Integer.valueOf(proposal.Duration_In_Months_Max_36__c) : 36;
            
            List<Map<String, Object>> ganttData = new List<Map<String, Object>>();
            
            // CASE 1: We have unsaved data from the frontend (user is entering data)
            if (String.isNotBlank(wpDeliverablesJSON)) {
                List<Object> unsavedData = (List<Object>) JSON.deserializeUntyped(wpDeliverablesJSON);
                
                // Get all account IDs from unsaved data to fetch contacts
                Set<Id> accountIdsFromUnsaved = new Set<Id>();
                for (Object wpObj : unsavedData) {
                    Map<String, Object> wpMap = (Map<String, Object>) wpObj;
                    List<Object> accountList = (List<Object>) wpMap.get('AccountList');
                    
                    if (accountList != null) {
                        for (Object accObj : accountList) {
                            Map<String, Object> accMap = (Map<String, Object>) accObj;
                            if (accMap.get('selected') == true) {
                                String accountId = (String) accMap.get('Id');
                                if (String.isNotBlank(accountId)) {
                                    accountIdsFromUnsaved.add(Id.valueOf(accountId));
                                }
                            }
                        }
                    }
                }
                
                // Get contacts for these accounts
                Map<Id, List<String>> accountContactsMap = getContactsForAccounts(proposalId, accountIdsFromUnsaved);
                
                // Build Gantt data from unsaved data
                for (Object wpObj : unsavedData) {
                    Map<String, Object> wpMap = (Map<String, Object>) wpObj;
                    
                    Map<String, Object> wpGanttMap = new Map<String, Object>();
                    wpGanttMap.put('title', wpMap.get('title'));
                    wpGanttMap.put('wpSequence', wpMap.get('wpSequence'));
                    wpGanttMap.put('wpStartMonth', wpMap.get('wpStartMonth'));
                    wpGanttMap.put('wpEndMonth', wpMap.get('wpEndMonth'));
                    
                    // Collect contact initials from selected accounts
                    Set<String> contactInitials = new Set<String>();
                    List<Object> accountList = (List<Object>) wpMap.get('AccountList');
                    if (accountList != null) {
                        for (Object accObj : accountList) {
                            Map<String, Object> accMap = (Map<String, Object>) accObj;
                            if (accMap.get('selected') == true) {
                                String accountId = (String) accMap.get('Id');
                                if (accountContactsMap.containsKey(Id.valueOf(accountId))) {
                                    contactInitials.addAll(accountContactsMap.get(Id.valueOf(accountId)));
                                }
                            }
                        }
                    }
                    wpGanttMap.put('contactInitials', new List<String>(contactInitials));
                    
                    // Add deliverables
                    List<Map<String, Object>> deliverablesList = new List<Map<String, Object>>();
                    List<Object> deliverables = (List<Object>) wpMap.get('deliverables');
                    if (deliverables != null) {
                        for (Object delivObj : deliverables) {
                            Map<String, Object> delivMap = (Map<String, Object>) delivObj;
                            deliverablesList.add(delivMap);
                        }
                    }
                    wpGanttMap.put('deliverables', deliverablesList);
                    
                    ganttData.add(wpGanttMap);
                }
            } 
            // CASE 2: No unsaved data, get from database
            else {
                List<Work_Package__c> workPackages = [
                    SELECT Id, Title__c, WP_Sequence_2__c, Duration_Start_Month__c, Duration_End_Month__c,
                        (SELECT Id, Title__c, Deliverable_Sequence__c, Duration_Start_Month__c, Duration_End_Month__c 
                        FROM PI_Deliverables__r 
                        ORDER BY Deliverable_Sequence__c),
                        (SELECT Id, Account__c, Account__r.Name FROM Account_Mapping__r)
                    FROM Work_Package__c 
                    WHERE Application__c = :proposalId
                    AND Proposal_Stage__c = :proposalStage
                    ORDER BY WP_Sequence_2__c
                ];
                
                // Collect all Account IDs
                Set<Id> allAccountIds = new Set<Id>();
                for (Work_Package__c wp : workPackages) {
                    if (wp.Account_Mapping__r != null) {
                        for (Account_Mapping__c am : wp.Account_Mapping__r) {
                            if (am.Account__c != null) {
                                allAccountIds.add(am.Account__c);
                            }
                        }
                    }
                }
                
                // Get contacts for these accounts
                Map<Id, List<String>> accountContactsMap = getContactsForAccounts(proposalId, allAccountIds);
                
                // Build Gantt data from database
                for (Work_Package__c wp : workPackages) {
                    Map<String, Object> wpMap = new Map<String, Object>();
                    wpMap.put('title', wp.Title__c);
                    wpMap.put('wpSequence', wp.WP_Sequence_2__c);
                    wpMap.put('wpStartMonth', wp.Duration_Start_Month__c);
                    wpMap.put('wpEndMonth', wp.Duration_End_Month__c);
                    
                    // Collect contact initials
                    Set<String> contactInitials = new Set<String>();
                    if (wp.Account_Mapping__r != null) {
                        for (Account_Mapping__c am : wp.Account_Mapping__r) {
                            if (am.Account__c != null && accountContactsMap.containsKey(am.Account__c)) {
                                contactInitials.addAll(accountContactsMap.get(am.Account__c));
                            }
                        }
                    }
                    wpMap.put('contactInitials', new List<String>(contactInitials));
                    
                    // Add deliverables
                    List<Map<String, Object>> deliverablesList = new List<Map<String, Object>>();
                    for (PI_Deliverables__c deliv : wp.PI_Deliverables__r) {
                        Map<String, Object> delivMap = new Map<String, Object>();
                        delivMap.put('deliverableSequence', deliv.Deliverable_Sequence__c);
                        delivMap.put('startMonth', deliv.Duration_Start_Month__c);
                        delivMap.put('endMonth', deliv.Duration_End_Month__c);
                        deliverablesList.add(delivMap);
                    }
                    wpMap.put('deliverables', deliverablesList);
                    
                    ganttData.add(wpMap);
                }
            }
            
            response.put('success', true);
            response.put('maxDuration', maxDuration);
            response.put('workPackages', ganttData);
            
        } catch (Exception e) {
            response.put('success', false);
            response.put('error', e.getMessage());
            System.debug('Error in getGanttChartData: ' + e.getMessage() + ' Line: ' + e.getLineNumber());
        }
        
        return response;
    }

    // Helper method to get contact initials for accounts
    private static Map<Id, List<String>> getContactsForAccounts(String proposalId, Set<Id> accountIds) {
        Map<Id, List<String>> accountContactsMap = new Map<Id, List<String>>();
        
        if (accountIds.isEmpty()) {
            return accountContactsMap;
        }
        
        List<Applicant_Proposal_Association__c> apas = [
            SELECT Id, Contact__c, Contact__r.FirstName, Contact__r.LastName, 
                Contact__r.AccountId
            FROM Applicant_Proposal_Association__c 
            WHERE Contact__r.AccountId IN :accountIds 
            AND Is_Signatory__c = false
            AND Proposals__c = :proposalId
        ];
        
        for (Applicant_Proposal_Association__c apa : apas) {
            Id accountId = apa.Contact__r.AccountId;
            
            if (!accountContactsMap.containsKey(accountId)) {
                accountContactsMap.put(accountId, new List<String>());
            }
            
            String firstName = apa.Contact__r.FirstName != null ? apa.Contact__r.FirstName : '';
            String lastName = apa.Contact__r.LastName != null ? apa.Contact__r.LastName : '';
            
            String initials = '';
            if (firstName != '') initials += firstName.substring(0, 1);
            if (lastName != '') initials += lastName.substring(0, 1);
            
            if (String.isNotBlank(initials)) {
                accountContactsMap.get(accountId).add(initials.toUpperCase());
            }
        }
        
        return accountContactsMap;
    }

    // ----------------------------- GANTT CHART FUNCTIONALITY END ---------------------------------- //
    
    @RemoteAction
    public static String saveWPWithDeliverables(List<WrapperWPWithDeliverables> wrapperList, String proposalId, String proposalStage){
        try{
            System.debug('saveWPWithDeliverables - wrapperList: ' + wrapperList);
            
            List<Work_Package__c> workPackagesToUpsert = new List<Work_Package__c>();
            Map<String, List<IndustrialFellowshipHelper.AccountListWrapper>> wpExternalIdToAccountMap = new Map<String, List<IndustrialFellowshipHelper.AccountListWrapper>>();
            Map<String, List<WrapperDeliverable>> wpExternalIdToDeliverablesMap = new Map<String, List<WrapperDeliverable>>();
            
            for(WrapperWPWithDeliverables wpWrapper : wrapperList){
                Work_Package__c wp = new Work_Package__c();
                
                if(String.isNotBlank(wpWrapper.Id)){
                    wp.Id = wpWrapper.Id;
                }
                
                wp.WP_Sequence_2__c = wpWrapper.wpSequence;
                wp.Title__c = wpWrapper.title;
                wp.TRL_Level__c = Integer.valueOf(wpWrapper.trlFrom);
                wp.End_TRL_Level__c = Integer.valueOf(wpWrapper.trlTo);
                wp.Duration_Start_Month__c = Decimal.valueOf(wpWrapper.wpStartMonth);
                wp.Duration_End_Month__c = Decimal.valueOf(wpWrapper.wpEndMonth);
                wp.External_Id__c = wpWrapper.externalId;
                wp.Application__c = proposalId;
                wp.Proposal_Stage__c = proposalStage;
                
                workPackagesToUpsert.add(wp);
                wpExternalIdToAccountMap.put(wpWrapper.externalId, wpWrapper.AccountListWrapper);
                wpExternalIdToDeliverablesMap.put(wpWrapper.externalId, wpWrapper.deliverables);
            }
            
            upsert workPackagesToUpsert;
            
            Map<String, String> externalIdToWPId = new Map<String, String>();
            for(Work_Package__c wp : workPackagesToUpsert){
                externalIdToWPId.put(wp.External_Id__c, wp.Id);
            }
            
            List<Account_Mapping__c> accountMappingsToUpsert = new List<Account_Mapping__c>();
            List<Account_Mapping__c> accountMappingsToDelete = new List<Account_Mapping__c>();
            
            for(String externalId : wpExternalIdToAccountMap.keySet()){
                String wpId = externalIdToWPId.get(externalId);
                for(IndustrialFellowshipHelper.AccountListWrapper accWrapper : wpExternalIdToAccountMap.get(externalId)){
                    if(accWrapper.isSelected && String.isBlank(accWrapper.accountMappingId)){
                        Account_Mapping__c accMapping = new Account_Mapping__c();
                        accMapping.Account__c = accWrapper.accnt.Id;
                        accMapping.Work_Package__c = wpId;
                        accountMappingsToUpsert.add(accMapping);
                    }else if(!accWrapper.isSelected && String.isNotBlank(accWrapper.accountMappingId)){
                        accountMappingsToDelete.add(new Account_Mapping__c(Id = accWrapper.accountMappingId));
                    }
                }
            }
            
            if(!accountMappingsToUpsert.isEmpty()){
                upsert accountMappingsToUpsert;
            }
            if(!accountMappingsToDelete.isEmpty()){
                delete accountMappingsToDelete;
            }
            
            List<PI_Deliverables__c> deliverablesToUpsert = new List<PI_Deliverables__c>();
            
            for(String externalId : wpExternalIdToDeliverablesMap.keySet()){
                String wpId = externalIdToWPId.get(externalId);
                List<WrapperDeliverable> deliverables = wpExternalIdToDeliverablesMap.get(externalId);
                
                if(deliverables != null && !deliverables.isEmpty()){
                    for(WrapperDeliverable delivWrapper : deliverables){
                        PI_Deliverables__c deliv = new PI_Deliverables__c();
                        
                        if(String.isNotBlank(delivWrapper.Id)){
                            deliv.Id = delivWrapper.Id;
                        }
                        
                        deliv.Deliverable_Sequence__c = delivWrapper.deliverableSequence;
                        deliv.Title__c = delivWrapper.title;
                        deliv.Duration_Start_Month__c = Decimal.valueOf(delivWrapper.startMonth);
                        deliv.Duration_End_Month__c = Decimal.valueOf(delivWrapper.endMonth);
                        deliv.External_Id__c = delivWrapper.externalId;
                        
                        // Only set Work_Package__c for new records (when Id is blank)
                        if(String.isBlank(delivWrapper.Id)){
                            deliv.Work_Package__c = wpId;
                        }
                        
                        deliverablesToUpsert.add(deliv);
                    }
                }
            }
            
            if(!deliverablesToUpsert.isEmpty()){
                upsert deliverablesToUpsert;
            }
            
            return 'success';
        }catch(Exception e){
            System.debug('Error in saveWPWithDeliverables: ' + e.getMessage() + ' Line: ' + e.getLineNumber());
            return 'Error: ' + e.getMessage();
        }
    }
    
    @RemoteAction
    public static String deleteWorkPackageWithDeliverables(String workPackageId){
        try{
            List<PI_Deliverables__c> deliverables = [SELECT Id FROM PI_Deliverables__c WHERE Work_Package__c = :workPackageId];
            if(!deliverables.isEmpty()){
                delete deliverables;
            }
            
            List<Account_Mapping__c> accountMappings = [SELECT Id FROM Account_Mapping__c WHERE Work_Package__c = :workPackageId];
            if(!accountMappings.isEmpty()){
                delete accountMappings;
            }
            
            delete new Work_Package__c(Id = workPackageId);
            
            return 'Success';
        }catch(Exception e){
            System.debug('Error in deleteWorkPackageWithDeliverables: ' + e.getMessage() + ' Line: ' + e.getLineNumber());
            return 'Error: ' + e.getMessage();
        }
    }
    
    @RemoteAction
    public static String deleteDeliverableNew(String deliverableId){
        try{
            delete new PI_Deliverables__c(Id = deliverableId);
            return 'Success';
        }catch(Exception e){
            System.debug('Error in deleteDeliverableNew: ' + e.getMessage() + ' Line: ' + e.getLineNumber());
            return 'Error: ' + e.getMessage();
        }
    }
    
    public class WrapperWPWithDeliverables {
        public String Id;
        public String wpSequence;
        public String title;
        public String trlFrom;
        public String trlTo;
        public String wpStartMonth;
        public String wpEndMonth;
        public String externalId;
        public List<IndustrialFellowshipHelper.AccountListWrapper> AccountListWrapper;
        public List<WrapperDeliverable> deliverables;
    }
    
    public class WrapperDeliverable {
        public String Id;
        public String deliverableSequence;
        public String title;
        public String startMonth;
        public String endMonth;
        public String externalId;
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

    @RemoteAction
    public static IndustrialFellowshipHelper.insertApplicationWrapper updateIndusrianFellowshipBasicDet(String campaignId,String candidateId,Contact InstanceCon,Integer birthDay,Integer birthMonth,Integer birthYear,Integer phdEnrollYear,Integer phdEnrollMonth,Integer phdEnrollDay,Integer phdAwardYear,Integer phdAwardMonth,Integer phdAwardDay,Integer phdThesisYear,Integer phdThesisMonth,Integer phdThesisDay,Application_Proposal__c prop){
       // IndustrialFellowshipHelper instanceIFH=new IndustrialFellowshipHelper();
        return IndustrialFellowshipHelper.updateIndusrianFellowshipBasicDet(campaignId,candidateId,InstanceCon,birthDay,birthMonth,birthYear,phdEnrollYear,phdEnrollMonth,phdEnrollDay,phdAwardYear,phdAwardMonth,phdAwardDay,phdThesisYear,phdThesisMonth,phdThesisDay,prop);
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
    //************************************** WORKSHOP **********************************************************
    
    //************************************** Coordinators Page **********************************************************
    
    @RemoteAction
    public static List<Contact> getCoordinatorsDetails(string hashCode){
        return Proposal_Controller.getCoordinatorsDetails(hashCode);
    }
    
    @RemoteAction
    public static string SaveWorkshopContactDetails2(Contact conDataList, List<Education_Details__c> eduDetails, List<Employment_Details__c> empDetails, String apaId){
        try{
            conDataList.MailingState = conDataList.State__c; //Added by Aman on 29 Aug'23. Put back the value of MailingState from State__c and see if it retains the value.
            upsert conDataList;
            upsert eduDetails;
            upsert empDetails;
            
            // Update APA fields with the same values from Contact
            if(String.isNotBlank(apaId)){
                Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c();
                apa.Id = apaId;
                apa.Publications_Patents__c = conDataList.Publications_Patents__c;
                apa.List_Of_Patents_Filed_Granted__c = conDataList.List_Of_Patents_Filed_Granted__c;
                apa.Book_Chapters_Monographs__c = conDataList.Book_Chapters_Monographs__c;
                apa.Any_Other_Notable_Achievements__c = conDataList.Any_Other_Notable_Achievements__c;
                update apa;
            }
            
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
    
    @RemoteAction
    public static Application_Proposal__c getBasicDetails(String applicantHashCode){
        return Proposal_Controller.getBasicDetails(applicantHashCode);
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
    public static List<Participants__c> getParticipantDetails(string hashcode){
        return Proposal_Controller.getParticipantDetails(hashcode);
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
   /* 
    // NEW METHOD: Create expense with Expense_Head__c and Expense_Line_Item__c
    @RemoteAction
    public static String createExpenseWithHeadAndLineItems(List<Expense_Line_Item__c> expenseLineItems, String apaId, Applicant_Proposal_Association__c updatedApa) {
        return Proposal_Controller.createExpenseWithHeadAndLineItems(expenseLineItems, apaId, updatedApa);
    }

   
    /*
    // NEW METHOD: Get expense records from Expense_Head__c and Expense_Line_Item__c
    @RemoteAction
    public static Proposal_Controller.ExpenseHeadLineItemWrapper getExpenseHeadLineItems(String apaId) {
        return Proposal_Controller.getExpenseHeadLineItems(apaId);
    }
    */
    // @RemoteAction
    // public static List<Expense_Detail__c> getExpenseRecords(String ProposalId){
    //     return Proposal_Controller.getExpenseRecords(ProposalId);
    // }
	
    // NEW METHOD: Delete Research Staff records by IDs
    @RemoteAction
    public static String deleteResearchStaffByIds(List<String> expenseHeadIds) {
        return Proposal_Controller.deleteResearchStaffByIds(expenseHeadIds);
    }
    
    // NEW METHOD: Get expense records from Expense_Head__c and Expense_Line_Item__c
    @RemoteAction
    public static Proposal_Controller.ExpenseHeadLineItemWrapper getExpenseHeadLineItems(String apaId) {
        return Proposal_Controller.getExpenseHeadLineItems(apaId);
    }

    @RemoteAction
    public static String createExpenseWithHeadAndLineItems(List<Expense_Line_Item__c> expenseLineItems, String apaId, Applicant_Proposal_Association__c updatedApa) {
        return Proposal_Controller.createExpenseWithHeadAndLineItems(expenseLineItems, apaId, updatedApa);
    }

    @RemoteAction
    public static String createExpenseWithHeadAndLineItemsForWiser(List<Expense_Line_Item__c> expenseLineItems, String apaId, Applicant_Proposal_Association__c updatedApa) {
        return Proposal_Controller.createExpenseWithHeadAndLineItemsForWiser(expenseLineItems, apaId, updatedApa);
    }

    @RemoteAction
    public static Proposal_Controller.edWrapper getExpenseRecords(String ProposalId, String ContactId) {
        return Proposal_Controller.getExpenseDetails(ProposalId, ContactId);
    }

    public class YearlyExpenseWrapper {
        public Id id;
        public String year;
        public List<ExpenseHeadWrapper> expenseHeads = new List<ExpenseHeadWrapper>();
    }

    public class ExpenseHeadWrapper {
        public Id id;
        public String name;
        public List<Expense_Line_Item__c> lineItems = new List<Expense_Line_Item__c>();
    }

    
    @RemoteAction
    public static Map<String, Object> getYearlyExpenseHierarchy(Id apaId) {

        Map<String, Object> response = new Map<String, Object>();

        /* ===============================
        1️⃣ Fetch Yearly Expenses
        =============================== */
        List<Yearly_Expense__c> yearlyExpenses = [
            SELECT Id, Year__c
            FROM Yearly_Expense__c
            WHERE Applicant_Proposal_Association__c = :apaId
            ORDER BY Year__c
        ];

        if (yearlyExpenses.isEmpty()) {
            response.put('yearlyExpenses', new List<YearlyExpenseWrapper>());
            return response;
        }

        /* ===============================
        2️⃣ Fetch Expense Heads
        =============================== */
        List<Expense_Head__c> heads = [
            SELECT Id, Name, Yearly_Expense__c
            FROM Expense_Head__c
            WHERE Yearly_Expense__c IN :yearlyExpenses
        ];

        /* ===============================
        3️⃣ Fetch Line Items
        =============================== */
        List<Expense_Line_Item__c> lineItems = [
            SELECT Id, Description__c, Index__c,
                Year1_Expense__c, Year2_Expense__c, Year3_Expense__c,
                Expense_Type__c, Expense_Head__c, Expense_Description_2__c
            FROM Expense_Line_Item__c
            WHERE Expense_Head__c IN :heads
        ];

        /* ===============================
        4️⃣ Map Line Items → Head
        =============================== */
        Map<Id, List<Expense_Line_Item__c>> headToLines = new Map<Id, List<Expense_Line_Item__c>>();
        for (Expense_Line_Item__c li : lineItems) {
            if (!headToLines.containsKey(li.Expense_Head__c)) {
                headToLines.put(li.Expense_Head__c, new List<Expense_Line_Item__c>());
            }
            headToLines.get(li.Expense_Head__c).add(li);
        }

        /* ===============================
        5️⃣ Map Heads → Yearly Expense
        =============================== */
        Map<Id, List<ExpenseHeadWrapper>> yearlyToHeads = new Map<Id, List<ExpenseHeadWrapper>>();
        for (Expense_Head__c h : heads) {

            ExpenseHeadWrapper hw = new ExpenseHeadWrapper();
            hw.id = h.Id;
            hw.name = h.Name;
            hw.lineItems = headToLines.containsKey(h.Id)
                ? headToLines.get(h.Id)
                : new List<Expense_Line_Item__c>();

            if (!yearlyToHeads.containsKey(h.Yearly_Expense__c)) {
                yearlyToHeads.put(h.Yearly_Expense__c, new List<ExpenseHeadWrapper>());
            }
            yearlyToHeads.get(h.Yearly_Expense__c).add(hw);
        }

        /* ===============================
        6️⃣ Build Final Hierarchy
        =============================== */
        List<YearlyExpenseWrapper> result = new List<YearlyExpenseWrapper>();

        for (Yearly_Expense__c ye : yearlyExpenses) {
            YearlyExpenseWrapper yw = new YearlyExpenseWrapper();
            yw.id = ye.Id;
            yw.year = ye.Year__c;
            yw.expenseHeads = yearlyToHeads.containsKey(ye.Id)
                ? yearlyToHeads.get(ye.Id)
                : new List<ExpenseHeadWrapper>();

            result.add(yw);
        }

        response.put('yearlyExpenses', result);
        return response;
    }
    
    // NEW CODE - RETURNING CUSTOM TYPE
    @RemoteAction
    public static Proposal_Controller.ProposalWithContactsDTO getConsentCheckbox(string proposalId){
        return Proposal_Controller.getConsentCheckbox(proposalId);
    }

    // OLD CODE - RETURNING Application_Proposal__c
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
    public static String insertFellowship_DetailsOld(Contact applicantDetails, integer startday, integer startmonth, integer startyear, integer endday, integer endmonth, integer endyear,String conId, String recordType){
        return Proposal_Controller.insertFellowship_Details(applicantDetails, startday, startmonth, startyear, endday, endmonth, endyear, conId, recordType);
    }
    
    // New overloaded method with proposalId, selectedTheme, and keyword parameters
    // @RemoteAction
    // public static String insertFellowship_Details(Contact applicantDetails, String proposalId,String BroadAreaOfResearch,String NonTechTitle, String TitleOfProject, List<String> selectedTheme, String keyword, integer startday, integer startmonth, integer startyear, integer endday, integer endmonth, integer endyear, String conId, String recordType){
    //     return Proposal_Controller.insertFellowship_DetailsWithTheme(applicantDetails, proposalId, BroadAreaOfResearch,NonTechTitle,TitleOfProject,selectedTheme, keyword, startday, startmonth, startyear, endday, endmonth, endyear, conId, recordType);
    // }

    // @RemoteAction
    // public static String insertFellowship_Details(Applicant_Proposal_Association__c apaRecord){
    //     return Proposal_Controller.insertFellowship_DetailsWithTheme(apaRecord);
    // }

    @RemoteAction
    public static String insertFellowship_Details(String apaJson) {
        try {
            if (String.isBlank(apaJson)) {
                throw new AuraHandledException('Invalid fellowship data.');
            }

            // Deserialize into untyped map first
            Map<String, Object> rawMap =
                (Map<String, Object>) JSON.deserializeUntyped(apaJson);

            // --- FIX DATE FIELDS ---
            normalizeDateField(rawMap, 'Tentative_Start_Date__c');
            normalizeDateField(rawMap, 'Tentative_End_Date__c');

            // Serialize back to JSON
            String fixedJson = JSON.serialize(rawMap);

            // Deserialize into sObject
            Applicant_Proposal_Association__c apa =
                (Applicant_Proposal_Association__c)
                JSON.deserialize(fixedJson, Applicant_Proposal_Association__c.class);

            if (apa.Id == null) {
                throw new AuraHandledException('Missing fellowship record Id.');
            }

            update apa;
            return apa.Id;

        } catch (Exception e) {
            System.debug(
                'insertFellowship_Details error at line ' +
                e.getLineNumber() + ' : ' + e.getMessage()
            );
            throw new AuraHandledException(
                'Error saving fellowship details: ' + e.getMessage()
            );
        }
    }

    /* ---------------- HELPER ---------------- */

    private static void normalizeDateField(
        Map<String, Object> data,
        String fieldName
    ) {
        if (!data.containsKey(fieldName) || data.get(fieldName) == null) return;

        String rawVal = String.valueOf(data.get(fieldName));

        // Handle ISO DateTime → Date
        if (rawVal.contains('T')) {
            // Example: 2026-02-01T18:30:00.000Z
            data.put(fieldName, rawVal.substring(0, 10)); // yyyy-MM-dd
        }
    }


    // @RemoteAction
    // public static String insertFellowship_Details(Contact applicantDetails, String proposalId,String BroadAreaOfResearch,String NonTechTitle, String TitleOfProject, List<String> selectedTheme, String keyword, integer startday, integer startmonth, integer startyear, integer endday, integer endmonth, integer endyear, String conId, String recordType){
    //     return Proposal_Controller.insertFellowship_DetailsWithTheme(applicantDetails, proposalId, BroadAreaOfResearch,NonTechTitle,selectedTheme, keyword, startday, startmonth, startyear, endday, endmonth, endyear, conId, recordType);
    // }
    
    @RemoteAction
    public static List<Proposal_Controller.PairingContactWrapper> getPairingDetails(string hashcode, String campaignId){
        return Proposal_Controller.getPairingDetails(hashcode,campaignId);
    }

    ///*************************New Method aaded by Karthik 
    @RemoteAction
    public static List<Proposal_Controller.ContactWithAPAWrapper> getPairingDetailsinWiser(string hashcode, String proposalId){
        return Proposal_Controller.getPairingDetailsinWiser(hashcode, proposalId);
    }


    // @RemoteAction
    // public static Proposal_Controller.insertPairingWrapperinWiser insertPairingDetailsinWiser(List<Proposal_Controller.wrapperPairing> contactList,String campaignId,String yearlyCall){
    //     return Proposal_Controller.insertPairingDetailsinWiser(contactList,campaignId,yearlyCall);
    // }

    @RemoteAction
    public static Proposal_Controller.insertPairingWrapperinWiser insertPairingDetailsinWiser(List<Proposal_Controller.wrapperPairing> contactList,String campaignId,String yearlyCall, String proposalId, String coordinatorContactId, String loggedInContactHashcode){
        return Proposal_Controller.insertPairingDetailsinWiser(contactList,campaignId,yearlyCall, proposalId, coordinatorContactId, loggedInContactHashcode);
    }

    @RemoteAction
    public static Integer getAPACountForProposal(String proposalId){
        try {
            if(String.isBlank(proposalId)) {
                return 0;
            }
            List<Applicant_Proposal_Association__c> apaList = [
                SELECT Id 
                FROM Applicant_Proposal_Association__c 
                WHERE Proposals__c = :proposalId
            ];
            return apaList.size();
        } catch(Exception e) {
            System.debug('Error in getAPACountForProposal: ' + e.getMessage());
            return 0;
        }
    }

    @RemoteAction
    public static Boolean checkContactsHaveAPAs(String proposalId, List<String> contactIds){
        try {
            if(String.isBlank(proposalId) || contactIds == null || contactIds.isEmpty()) {
                return false;
            }
            // Check if all provided contacts already have APAs for this proposal
            List<Applicant_Proposal_Association__c> existingAPAs = [
                SELECT Id, Contact__c 
                FROM Applicant_Proposal_Association__c 
                WHERE Proposals__c = :proposalId
                AND Contact__c IN :contactIds
            ];
            
            // Create a set of contact IDs that have APAs
            Set<String> contactIdsWithAPAs = new Set<String>();
            for(Applicant_Proposal_Association__c apa : existingAPAs) {
                if(apa.Contact__c != null) {
                    contactIdsWithAPAs.add(apa.Contact__c);
                }
            }
            
            // Return true if all provided contacts already have APAs (meaning we're editing existing contacts)
            return contactIdsWithAPAs.size() == contactIds.size();
        } catch(Exception e) {
            System.debug('Error in checkContactsHaveAPAs: ' + e.getMessage());
            return false;
        }
    }

    ////////////////////////////New Method aaded by Karthik 
    
    @RemoteAction
    public static Proposal_Controller.insertPairingWrapper insertPairingDetails(List<Proposal_Controller.wrapperPairing> contactList,String campaignId,String yearlyCall,String contactId,String projectId){
        return Proposal_Controller.insertPairingDetails(contactList,campaignId,yearlyCall,contactId,projectId);
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
    
    // @RemoteAction
    // public static string finalSubmitWiser(string projectId, string conId, integer day, integer month, integer year){
    //     return Proposal_Controller.finalSubmitWiser(projectId, conId, day, month, year);
    // }

    @RemoteAction
    public static Proposal_Controller.FinalSubmitResponse finalSubmitWiser(String proposalId, String conId, String apaId, Integer day, Integer month, Integer year){
        return Proposal_Controller.finalSubmitWiser(proposalId, conId, apaId, day, month, year);
    }
    
    @RemoteAction
    public static Contact getDeclarationfields(string hashcode){
        return Proposal_Controller.getDeclarationfields(hashcode);
    }
    @RemoteAction
    public static Applicant_Proposal_Association__c getDeclarationfieldsinWiser(string hashcode,string apaId){
        return Proposal_Controller.getDeclarationfieldsinWiser(hashcode,apaId);
    }
    
    @RemoteAction
    public static string submit2plus2(Contact conDetails,integer year,integer month,integer day,string projectid){
        return Proposal_Controller.submit2plus2(conDetails, year, month, day,projectid);
    }
    //Added by Aman on 5th September
    //Desc: used to submit the details of Partners for 2+2 program
    @RemoteAction
    public static string submitPartner2plus2(Contact conDetails,integer year,integer month,integer day,string proposalId){
        return Proposal_Controller.submitPartner2plus2(conDetails, year, month, day, proposalId);
    }
    
    @RemoteAction
    public static string upsertSign(Contact conDetails,integer year,integer month,integer day){
        return Proposal_Controller.upsertSign(conDetails, year, month, day);
    }
    
    @RemoteAction
    public static list<Proposal_Controller.UserDocumentWrapper> getContactUserDoc(id parentId, Id proposalId){ 
        //Proposal_Controller proposalCon = New Proposal_Controller();
        
        return Proposal_Controller.getContactUserDoc(parentId, proposalId);
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
    public static Applicant_Proposal_Association__c getcampaigntype(string hashcode, string proposalId){
        try{
            Contact conrec = [SELECT Id FROM Contact WHERE Login_Hash_Code__c = :hashcode LIMIT 1];
            
            Id propId = String.isNotBlank(proposalId) ? Id.valueOf(proposalId) : null;
            if(propId == null){
                List<Applicant_Proposal_Association__c> apaList = [
                    SELECT Id, Proposals__c 
                    FROM Applicant_Proposal_Association__c 
                    WHERE Contact__c = :conrec.Id 
                    AND Proposals__r.RecordType_Name__c = 'PECFAR'
                    ORDER BY CreatedDate DESC 
                    LIMIT 1
                ];
                if(!apaList.isEmpty()){
                    propId = apaList[0].Proposals__c;
                }
            }
            
            if(propId == null){
                return null;
            }
            
            Applicant_Proposal_Association__c apa = [
                SELECT Id, Is_Coordinator__c, Contact__c, Proposals__c 
                FROM Applicant_Proposal_Association__c 
                WHERE Contact__c = :conrec.Id 
                AND Proposals__c = :propId
                LIMIT 1
            ];
            return apa;
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
    
    @RemoteAction
    public static Proposal_Controller.insertApplicationWrapper insertCoordinatorsInformation2(List<Account> accList,List<Contact> conList, string proposalId, string yearlyCallId){
        return Proposal_Controller.insertCoordinatorsInformation2(accList, conList,proposalId, yearlyCallId);
    }
    
    @RemoteAction
    public static list<Proposal_Controller.UserDocumentWrapper> getAllUserDocSignature(string parentId) {
        return Proposal_Controller.getAllUserDocSignature(parentId);
    }
    
    @RemoteAction
    public static list<Proposal_Controller.UserDocumentWrapper> getAllUserDocSignatureNEW(string parentId) {
        return Proposal_Controller.getAllUserDocSignatureNEW(parentId);
    }
    
    @RemoteAction
    public static string saveAsDraftPecfar(Application_Proposal__c proposalDetails){
        return Proposal_Controller.saveAsDraftPecfar(proposalDetails);
    }
    
    /*
    @RemoteAction
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
    */

    public class FinalSubmitResponse {
        @AuraEnabled public Boolean isCurrentUserSubmitted;
        @AuraEnabled public Boolean isProposalCompleted;
        @AuraEnabled public String message;
    }

    @RemoteAction
    public static FinalSubmitResponse finalSubmitPecfar(Application_Proposal__c proposalDetails, String apaId, String proposalId){
        FinalSubmitResponse resp = new FinalSubmitResponse();
        try{
            // Query the current APA to check if Is_Coordinator__c is true
            Applicant_Proposal_Association__c currentAPA = [
                SELECT Id, Is_Coordinator__c, Applicant_Status__c
                FROM Applicant_Proposal_Association__c
                WHERE Id = :apaId
                LIMIT 1
            ];
            
            // Always update current user's APA Applicant_Status__c to 'Submitted'
            // Both contacts can submit their application independently
            update new Applicant_Proposal_Association__c(
                Id = apaId,
                Applicant_Status__c = 'Submitted'
                //Proposed_Date__c = proposedDate
            );
            
            // Set isCurrentUserSubmitted to true since this contact has submitted
            resp.isCurrentUserSubmitted = true;
            
            // Check if the current user is a coordinator
            if (currentAPA.Is_Coordinator__c == true) {
                // Coordinator is eligible for final submission
                // Check if both contacts have submitted their application
                
                // Fetching all NON-SIGNATORY APAs for the proposal (both contacts)
                List<Applicant_Proposal_Association__c> apaList = [
                    SELECT Id, Applicant_Status__c
                    FROM Applicant_Proposal_Association__c
                    WHERE Proposals__c = :proposalId
                    AND Is_Signatory__c = false
                ];
                
                // Checking if all APAs (both contacts) are submitted
                Boolean allSubmitted = true;
                for (Applicant_Proposal_Association__c apa : apaList) {
                    if (apa.Applicant_Status__c != 'Submitted') {
                        allSubmitted = false;
                        break;
                    }
                }
                
                // Updating proposal ONLY if all non-signatory APAs are submitted
                // When the Coordinator submits and both contacts have submitted,
                // the Proposal will be updated to submitted (final submission)
                if (allSubmitted && !apaList.isEmpty()) {
                    update new Application_Proposal__c(
                        Id = proposalId,
                        Stage__c = '1st Stage',
                        Proposal_Stages__c = 'Submitted',
                        Submitted__c = true
                        //Proposed_Date__c = proposedDate
                    );
                    
                    resp.isProposalCompleted = true;
                    resp.message = 'COMPLETED: Your application has been submitted successfully. All applicants have submitted.';
                    
                } else {
                    resp.isProposalCompleted = false;
                    resp.message = 'Your application has been submitted. Please wait for your partner to submit before final submission can be completed.';
                }
                
            } else {
                // Non-coordinator can only submit their part
                // They cannot do final submission
                resp.isProposalCompleted = false;
                // resp.message = 'Your application has been submitted successfully. Coordinator will complete the final submission once both applicants have submitted.';
                resp.message = 'Your part of the application has been submitted successfully. Primary Applicant will complete the final submission of the application.';
            }
            
            return resp;
            
        } catch (Exception e) {
            resp.message = 'ERROR : ' + e.getMessage();
            return resp;
        }
        /*
            proposalDetails.Stage__c = '1st Stage';
            proposalDetails.Proposal_Stages__c = 'Submitted';
            proposalDetails.Submitted__c = true;
            upsert proposalDetails;
            return 'success';
        }catch(Exception e){
            return e.getMessage();
        }
        */
    }
    
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
    /*
    @RemoteAction
    public static Contact getFellowshipDetails(string applicantHashCode, string proposalId){
        return Proposal_Controller.getFellowshipDetails(applicantHashCode, proposalId);
    }
    */

    @RemoteAction
    public static Applicant_Proposal_Association__c getFellowshipDetails(string applicantHashCode, string proposalId, string apaId){
        return Proposal_Controller.getFellowshipDetails(applicantHashCode, proposalId, apaId);
    }
    
    @RemoteAction
    public static List<Application_Thematic_Area__c> getApplicationThematicAreas(String proposalId){
        return Proposal_Controller.getApplicationThematicAreas(proposalId);
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
    
    
    // @RemoteAction
    // public static String doCUploadAttachmentSignature(String attachmentBody, String attachmentName, string cvId, String udId) {
    //     system.debug('attachmentBody---'+attachmentName+'---attachmentId---'+cvId+'---cvId---'+udId);
    //     system.debug('cvId---'+cvId+'---udId---'+udId);
    //     if(cvId == ''){
    //         cvId = null;
    //     }
    //     if(udId == ''){
    //         udId = null;
    //     }
    //     User_Document__c userDocc = New User_Document__c();
    //     userDocc.Id = udId;
    //     userDocc.Status__c = 'Uploaded';
    //     system.debug('status ::'+userDocc);
    //     upsert userDocc;
        
    //     udId = userDocc.Id;
        
    //     // if(cvId == null) {
    //         //     // Attachment att = new Attachment(parentId = udId, name=attachmentName, body = EncodingUtil.base64Decode(attachmentBody));
    //         //     // upsert att;
    //         //     Attachment aatt = new Attachment(parentId = udId, name=attachmentName, body = EncodingUtil.base64Decode(attachmentBody));
    //         //     aatt.OwnerId = getOwnerIdOfRecord(udId);
    //         //     insert aatt;
    //         //     return aatt.Id;
    //     // }else{
    //         //     Attachment att = getAttachment(cvId);
    //         //     String newBody = '';
    //         //     if(att.Body != null) {
    //             //         newBody = EncodingUtil.base64Encode(att.Body);
    //         //     }
    //         //     newBody += attachmentBody;
    //         //     att.Body = EncodingUtil.base64Decode(newBody);
    //         //     att.OwnerId = getOwnerIdOfRecord(udId);
    //         //     upsert att;
    //         // return att.Id;
    //     // }
        
    //     Attachment a = new Attachment(parentId = udId, name=attachmentName, body = Blob.valueOf(attachmentBody));
    //     insert a;
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
    @RemoteAction
    public static String doCUploadAttachmentSignature(String attachmentBody,String attachmentName,String cvId,String udId) {
        if(String.isBlank(attachmentBody) || String.isBlank(udId)) {
            return 'ERROR';
        }
        User_Document__c userDocc = New User_Document__c();
            userDocc.Id = udId;
            userDocc.Status__c = 'Uploaded';
            system.debug('status ::'+userDocc);
            upsert userDocc;
            
            udId = userDocc.Id;

        if(String.isBlank(cvId)) {
            // FIRST CHUNK
            ContentVersion cv = new ContentVersion();
            cv.ContentLocation = 'S';
            cv.PathOnClient = '/' + attachmentName;
            cv.Title = attachmentName;
            cv.VersionData = EncodingUtil.base64Decode(attachmentBody);
            cv.IsMajorVersion = false;
            insert cv;

            ContentDistribution cd = new ContentDistribution();
            cd.ContentVersionId = cv.Id;
            cd.Name = 'PublicShare';
            cd.RelatedRecordId = udId;
            insert cd;

            Id contentDocId = [
                SELECT ContentDocumentId
                FROM ContentVersion
                WHERE Id = :cv.Id
            ].ContentDocumentId;

            insert new ContentDocumentLink(
                LinkedEntityId = udId,
                ContentDocumentId = contentDocId,
                ShareType = 'V'
            );

            return cv.Id;

        } else {
            // NEXT CHUNKS
            ContentVersion cv = [
                SELECT Id, VersionData
                FROM ContentVersion
                WHERE Id = :cvId
                LIMIT 1
            ];

            String existing = EncodingUtil.base64Encode(cv.VersionData);
            existing += attachmentBody;
            cv.VersionData = EncodingUtil.base64Decode(existing);
            update cv;

            return cv.Id;
        }
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

            ContentVersion conVer = new ContentVersion();
            conVer.ContentLocation = 'S';
            conVer.PathOnClient = 'TestAcctac.jpeg';
            conVer.Title = attachmentName;
            conVer.VersionData = EncodingUtil.base64Decode(attachmentBody);
            conVer.isMajorVersion = false;
            conVer.FirstPublishLocationId = udId;
            insert conVer;
            

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
        return Proposal_Controller.getFieldDependencies(objectName, controllingField, dependentField);
    }
    
    @RemoteAction
    public static string createAnotherCoord(string projectId){
        return Proposal_Controller.createAnotherCoord(projectId);
    }
    
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
    public static Proposal_Controller.CheckEmailWrapper checkEmailWiser(String email, String contId, String oppMailingCountry, String yearlyCallId){
        return Proposal_Controller.checkEmailWiser(email, contId, oppMailingCountry, yearlyCallId);
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
 /*   
    @RemoteAction
    public static WrapperProposalDet getPECFARProposalDetails(string proposalId){
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
    */
    // New method to bind Proposal on Applicant Proposal Association.. By Rukasar
    @RemoteAction
public static WrapperProposalDet getPECFARProposalDetails(string proposalId){
    // Step 1: Get contact IDs through junction
    List<Id> contactIds = new List<Id>();
    set<id> apaIds = new set<id>();
    for(Applicant_Proposal_Association__c assoc : [
        SELECT Contact__c 
        FROM Applicant_Proposal_Association__c 
        WHERE Proposals__c = :proposalId
    ]) {
        if(assoc.Contact__c != null) {
            contactIds.add(assoc.Contact__c);
            apaIds.add(assoc.Id);
        }
    }
    if(contactIds.isEmpty()) {
        WrapperProposalDet emptyWrapper = new WrapperProposalDet();
        emptyWrapper.Lcon = new List<Contact>();
        emptyWrapper.achievements = new List<Achievement__c>();
        return emptyWrapper;
    }
    // Step 2: Query contacts WITHOUT proposals__r fields - only core contact fields + subqueries
    List<Contact> listContact = [
        SELECT ID, Name, FirstName, LastName, MailingStreet, Profile_Pic_Attachment_Id__c,
               Gender__c, MobilePhone, Designation__c, Institution_Name__c,
               Nationality__c, Institution__c, Email, Birthdate,
               Planned_research_activities_of_the_visit__c, Expected_outcomes__c,
               Basis_for_choosing_your_paired_member__c, Tentative_Start_Date__c,
               Tentative_End_Date__c, Availing_Fellowship__c, Associated_with_IGSTC__c,
               Give_Fellowship_Details__c, Give_Associated_Details__c,
               Account.Name, Account.BillingStreet, Account.BillingCity,
               Account.BillingCountry, Account.BillingState, Account.BillingPostalCode,
               Account.Email__c, Account.Homepage_URL__c, Account.Organisation_Posrt__c,
               Uploaded__c,
               (SELECT name, id FROM Attachments ORDER BY CreatedDate DESC LIMIT 1),
               (SELECT Name, Start_Year__c, End_Year__c, End_Date__c, Start_Date__c,
                       Nature_of_PhD_Work__c, Nature_of_Thesis_Work__c,
                       Institution_Name__c, Area_of_specialization__c,
                       Percentage__c, Percentage_cgpa__c, Thesis_Supervisor__c,
                       Thesis_Type__c, Recordtype.Name, RecordTypeId, Title_Thesis__c 
                FROM Education_Details__r where Applicant_Proposal_Association__c IN :apaIds) 
        FROM Contact 
        WHERE Id IN :contactIds
    ];
    // Step 3: Query Proposal fields through junction for this proposal
    Application_Proposal__c proposal = [
        SELECT Tentative_plans_for_networking__c, Basis_for_choosing_the_pairing_fellow__c,
               Expected_Deliverables__c, Tentative_Start_Date__c, Research_Approach_Objectives__c,
               Tentative_End_Date__c, Availing_any_other_fellowship_currently__c,
               Paired_Applicant_associated_with_IGSTC__c, Availing_Other_Fellowship_Detail__c,
               Applicant_associated_with_IGSTC_Detail__c
        FROM Application_Proposal__c 
        WHERE Id = :proposalId
    ];
    // Step 4: Get achievements
    List<Achievement__c> listAchievement = [
        SELECT id, Awards_Honours__c, List_of_Publications__c,
               List_of_Patents_filed__c, Book_Chapters__c, Any_other_achievements__c 
        FROM Achievement__c 
        WHERE Contact__c IN :contactIds
    ];
    WrapperProposalDet instanceWrapper = new WrapperProposalDet();
    instanceWrapper.Lcon = listContact;
    instanceWrapper.proposal = proposal;  
    instanceWrapper.achievements = listAchievement;
    return instanceWrapper;
}

    public class WrapperProposalDet {
        List<Contact> Lcon;
        List<Achievement__c> achievements;
        Application_Proposal__c proposal;
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
    public static string downloadApplicationPdf(String id){
        try{
            if(String.isBlank(id)){
                return null;
            }
            Attachment attachment = [SELECT Id, Name, Body FROM Attachment WHERE parentId = :id AND ContentType = 'application/pdf' ORDER BY CreatedDate DESC LIMIT 1 ];     
            return attachment.Id; 
        }catch(Exception e){
            System.debug('Error Message : ' + e.getMessage() +
                ' Error Line Number : ' + e.getLineNumber()
            );   
            return null;
        }   
    }

    // @RemoteAction
    // public static List<Account> getApplicantDetailsForGrantWISER(string applicantHashCode){
    //     contact conRec = [select name,id,Proposals__c,AccountId,Account.Name from contact where Id =:applicantHashCode limit 1];
    //     System.debug('conRec-----'+conRec);
    //     list<Account> applicantList = New list<Account>();
    //     if(conRec.AccountId != null){
    //         system.debug('applicantList-----'+applicantList);
    //         applicantList = [select Id,Name,Proposals__c,(SELECT Id,Title__c,Funding_Agency__c,Budget__c,Starting_Date__c,End_Date__c,Role_in_the_Project__c,Account__c,Application__c,Currency__c FROM Existing_Grants__r),(Select Id,Login_Hash_Code__c From Contacts) from Account where Id =:conRec.AccountId];
    //         return applicantList;
    //     }
    //     return null;
    // }

    @RemoteAction
    public static List<Existing_Grants__c> getExistingGrantsRecords(String apaId) {
        try {
            if (String.isNotBlank(apaId)) {
                return [
                    SELECT Id,
                        Title__c,
                        Funding_Agency__c,
                        Budget__c,
                        Starting_Date__c,
                        End_Date__c,
                        Role_in_the_Project__c,
                        Account__c,
                        Application__c,
                        Currency__c,
                        Active_applications_funded_by_DST_BMFTR__c,
                        Applicant_Proposal_Association__c,
                        Applicant_Proposal_Association__r.Grants_Handled__c,
                        Applicant_Proposal_Association__r.Contact__c,
                        Applicant_Proposal_Association__r.Contact__r.AccountId,
                        Applicant_Proposal_Association__r.Contact__r.Account.Name
                    FROM Existing_Grants__c
                    WHERE Applicant_Proposal_Association__c = :apaId
                ];
            }
            return new List<Existing_Grants__c>(); 
        } catch (Exception e) {
            System.debug(
                'Error Message : ' + e.getMessage() +
                ' Error Line Number : ' + e.getLineNumber()
            );
            throw new AuraHandledException(
                'Error Message : ' + e.getMessage() +
                ' Error Line Number : ' + e.getLineNumber()
            );
        }
    }

    @RemoteAction
    public static Applicant_Proposal_Association__c getAPAGrantsHandled(String apaId) {
        try {
            if (String.isNotBlank(apaId)) {
                return [
                    SELECT Id, Grants_Handled__c
                    FROM Applicant_Proposal_Association__c
                    WHERE Id = :apaId
                    LIMIT 1
                ];
            }
            return null;
        } catch (Exception e) {
            System.debug('Error in getAPAGrantsHandled: ' + e.getMessage());
            return null;
        }
    }

    @RemoteAction
    public static List<String> getGrantsHandledPicklistValues() {
        return Utility.getPicklistValues('Applicant_Proposal_Association__c', 'Grants_Handled__c');
    }

    @RemoteAction
    public static String updateAPAGrantsHandled(String apaId, String grantsHandledValue) {
        try {
            if (String.isNotBlank(apaId)) {
                Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c();
                apa.Id = apaId;
                apa.Grants_Handled__c = grantsHandledValue;
                update apa;
                return 'SUCCESS';
            }
            return 'ERROR: APA ID is blank';
        } catch (Exception e) {
            System.debug('Error in updateAPAGrantsHandled: ' + e.getMessage());
            return 'ERROR: ' + e.getMessage();
        }
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
                grantsRec.Applicant_Proposal_Association__c = wrap.apaId;
                grantsRec.Budget__c = wrap.budget;
                grantsRec.Currency__c = wrap.currencyPick;
                grantsRec.Role_in_the_Project__c = wrap.role;
                grantsRec.Starting_Date__c = wrap.startDate;
                grantsRec.End_Date__c = wrap.endDate;
                grantsRec.Active_applications_funded_by_DST_BMFTR__c = wrap.activeApplications;  // Map RTF field
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
        String apaId;
        String activeApplications;  // Active applications funded by DST-BMFTR RTF field
        // Integer startingday;
        // Integer startingmonth;
        // Integer startingyear;
    }
    
    // @RemoteAction
    // public Static List<References__c> getProposalDetailsReferences(String proposalId){
    //     try{
    //         List<References__c> getParticipantList = [SELECT Id,Name,Email__c,Phone__c,Proposals__c,Organisation_Institute__c,Designation__c FROM References__c WHERE Proposals__c =:proposalId];
    //         System.debug('getParticipantList ::'+getParticipantList);
    //         return getParticipantList;
    //     }catch(Exception e){
    //         System.debug('The Error '+e.getMessage()+' Line'+e.getLineNumber());
    //         return null;
    //    . }
    // }

    @RemoteAction
    public Static List<References__c> getProposalDetailsReferences(String proposalId, String apaId){
        try{
            List<References__c> getParticipantList = [
                SELECT Id, Name, Email__c, Phone__c, Proposals__c, Organisation_Institute__c, Designation__c, Applicant_Proposal_Association__c
                FROM References__c 
                WHERE Applicant_Proposal_Association__c =: apaId];

            System.debug('getParticipantList ::' + getParticipantList);
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
    
    // @RemoteAction
    // public Static string insertParticipantsReferences(List<References__c> insertParticipantsList, String proposalId){
    //     try{
    //         upsert insertParticipantsList;
    //         return 'success';
    //     }catch(Exception e){
    //         return e.getMessage()+e.getLineNumber();
    //     }
    // }

    // ------------ METHOD UPDATED TO SAVE SIGNATORY DETAILS ------------ //
    @RemoteAction
    public static String insertParticipantsReferences(List<References__c> insertParticipantsList, String proposalId, String apaId, Contact signatoryContact, Applicant_Proposal_Association__c apaRecord, String signatoryAPAId, String accountId){
        try{
            if(! insertParticipantsList.isEmpty()){

                for(References__c ref : insertParticipantsList){
                    if(ref.Applicant_Proposal_Association__c == null)
                        ref.Applicant_Proposal_Association__c = apaId;
                }
                upsert insertParticipantsList;
            }
            
            System.debug('Contact : ' + signatoryContact);
            System.debug('Account Id : ' + accountId);
            System.debug('Proposal Id : ' + proposalId);
            System.debug('APA Id : ' + apaId);
            System.debug('Signatory APA Id : ' + signatoryAPAId);

            // Handle null checks
            if(signatoryContact == null){
                return 'Signatory Contact data is required';
            }
            
            if(String.isBlank(accountId)){
                return 'Account Id is required';
            }

            // Set Contact fields
            signatoryContact.AccountId = accountId;
            signatoryContact.Is_Signatory__c= true;
            
            // Map signatory fields to Contact standard fields
            if(String.isNotBlank(signatoryContact.Signatory_First_Name__c)){
                signatoryContact.FirstName = signatoryContact.Signatory_First_Name__c;
            }
            if(String.isNotBlank(signatoryContact.Signatory_Last_Name__c)){
                signatoryContact.LastName = signatoryContact.Signatory_Last_Name__c;
            }
            
            // Preserve signatory-specific custom fields (they should already be on the Contact object)
            // Signatory_Salutation__c, Signatory_Institution__c, Signatory_Designation__c, Email are preserved
            
            // Check if Contact exists by Email (if Email is provided and no Id exists)
            if(String.isBlank(signatoryContact.Id) && String.isNotBlank(signatoryContact.Email)){
                List<Contact> existingContacts = [
                    SELECT Id, AccountId 
                    FROM Contact 
                    WHERE Email = :signatoryContact.Email 
                    LIMIT 1
                ];
                if(!existingContacts.isEmpty()){
                    signatoryContact.Id = existingContacts[0].Id;
                    // Update AccountId if it's different
                    signatoryContact.AccountId = accountId;
                }
            }
            
            // Insert or Update Contact
            if(String.isNotBlank(signatoryContact.Id)){
                update signatoryContact;
            } else {
                insert signatoryContact;
            }
            System.debug('Contact Inserted/Updated Successfully : ' + signatoryContact.Id);

            // Handle APA Record creation/update
            Applicant_Proposal_Association__c signatoryAPA;
            
            if(String.isNotBlank(signatoryAPAId)){
                // Update existing APA
                signatoryAPA = new Applicant_Proposal_Association__c(
                    Id = signatoryAPAId,
                    Contact__c = signatoryContact.Id,
                    Is_Signatory__c = true
                );
                if(apaRecord != null && String.isNotBlank(apaRecord.Signatory_Emailist_Name__c)){
                    signatoryAPA.Signatory_Emailist_Name__c = apaRecord.Signatory_Emailist_Name__c;
                }
                update signatoryAPA;
            } else {
                // Create new APA
                signatoryAPA = new Applicant_Proposal_Association__c(
                    Contact__c = signatoryContact.Id,
                    Proposals__c = proposalId,
                    Is_Signatory__c = true
                );
                if(apaRecord != null && String.isNotBlank(apaRecord.Signatory_Emailist_Name__c)){
                    signatoryAPA.Signatory_Emailist_Name__c = apaRecord.Signatory_Emailist_Name__c;
                }
                insert signatoryAPA;
            }
            System.debug('APA Inserted/Updated Successfully : ' + signatoryAPA.Id);
            
            return signatoryAPA.Id;
        }catch(DmlException e){
            System.debug('DML Exception: ' + e.getMessage() + ' at line ' + e.getLineNumber());
            return 'Error: ' + e.getMessage() + ' at line ' + e.getLineNumber();
        }catch(Exception e){
            System.debug('Exception: ' + e.getMessage() + ' at line ' + e.getLineNumber());
            return 'Error: ' + e.getMessage() + ' at line ' + e.getLineNumber();
        }
    }

    // ------------ METHOD UPDATED TO GET SIGNATORY DETAILS ------------ //
    @RemoteAction
    public static Applicant_Proposal_Association__c getSignatoryContactAPADetails(String proposalId, String apaId, String accountId){
        try {
            List<Applicant_Proposal_Association__c> signatoryAPAList = [
                SELECT Id, Contact__r.Id, Contact__r.Salutation, Contact__r.Signatory_Salutation__c, Contact__r.Institution_Name__c, Contact__r.LastName, 
                Contact__r.Institute_Name__c, Contact__r.Department, Contact__r.Designation__c, Contact__r.Email, 
                Contact__r.Account.Name, Contact__r.AccountId, Contact__r.Signatory_First_Name__c, Contact__r.Signatory_Last_Name__c, 
                Contact__r.Signatory_Institution__c, Contact__r.Signatory_Designation__c, Is_Signatory__c, Proposals__c, Signatory_Emailist_Name__c
                FROM Applicant_Proposal_Association__c 
                WHERE Is_Signatory__c = true
                AND  Contact__r.AccountId =: accountId
                AND Proposals__c =: proposalId
                LIMIT 1
            ];
            
            if (signatoryAPAList.isEmpty()) {
                return null;
            }
            
            return signatoryAPAList[0];
        } catch (Exception e) {
            System.debug('Error in getSignatoryContactAPADetails: ' + e.getMessage());
            return null;
        }
    }
	
    @RemoteAction
    public static Contact checkContactEmailExists(String email) {
        try {
            if (String.isBlank(email)) {
                return null;
            }
            
            List<Contact> existingContacts = [
                SELECT Id, Email, Name 
                FROM Contact 
                WHERE Email = :email 
                LIMIT 1
            ];
            
            return existingContacts.isEmpty() ? null : existingContacts[0];
        } catch (Exception e) {
            System.debug('Error in checkContactEmailExists: ' + e.getMessage());
            return null;
        }
    }

    @RemoteAction
    public static Contact getContactDetailsForWiser(String hashCode) {
        Contact conRec = [
            SELECT Id, Name, Title, FirstName, LastName,
            Actual_Position__c, Department, Country__c, Head_Of_Project__c,
            Homepage_URL__c, Email, Phone, Thesis_Submission_Date__c,
            Industrial_Fellowship_Type__c, Birthdate, PhD_Enroll_Date__c, Awarded_PhD__c,
            Country_Code__c, Uploaded__c, PhD_Awarded_Date__c, Gender__c, Nationality__c,
            PassportNo__c, Passport_Expiry__c, Addess_same_as__c,
            MailingAddress, MailingStreet, MailingCity, MailingCountry, MailingState, MailingPostalCode,
            OtherAddress, OtherStreet, OtherCountry, OtherCity, OtherState, OtherPostalCode,
            MobilePhone, OtherPhone, Profile_Pic_Attachment_Id__c
            FROM Contact
            WHERE Login_Hash_Code__c = :hashCode
            LIMIT 1
        ];

        return conRec;
    }
    
    // -------------- METHOD TO GET THE SIGNATORY SALUTATION PICKLIST VALUES --------------- //
    @RemoteAction
    public static List<String> getSignatorySalutationPicklist() {
        List<String> values = new List<String>();

        Schema.DescribeFieldResult dfr =
            Contact.Signatory_Salutation__c.getDescribe();

        for (Schema.PicklistEntry ple : dfr.getPicklistValues()) {
            values.add(ple.getValue());
        }

        return values;
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
    
    @RemoteAction
    public static List<Contact> checkBulkEmail(List<string> email, List<Id> ids){
        try{
            List<Contact> refList = [SELECT Id,Name,Email FROM Contact WHERE Email IN: email AND Id NOT IN: ids];
            return refList;
        }catch(Exception e){
            return null;
        }
    }

   @RemoteAction
    public static List<Contact> checkBulkEmail2(String email) {
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

            Contact conRec = [SELECT Id,Name,MailingCountry,Login_Hash_Code__c, (SELECT ID, Name,Proposals__r.Name, Proposals__c FROM Applicant_Proposal_Associations__r WHERE  Proposals__r.Record_Type_Name__c='SING')   FROM Contact WHERE Login_Hash_Code__c =: hashCode];

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
    
    
    
    // Changing Proposal Stage = Draft

@RemoteAction
public static void updateProposalStage(Id proposalId) {
    Application_Proposal__c p = new Application_Proposal__c(
        Id = proposalId,
        Proposal_Stages__c = 'Draft'
    );
    update p;
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

    @RemoteAction
    public static Application_Proposal__c getProjectDetailsFromApex(String proposalId){
        try{
            System.debug('----------- getProjectDetailsFromApex() ------------');

            Application_Proposal__c proposal = [
                SELECT Research_Approach_Objectives__c, Current_State_Of_The_Art__c, Project_Description__c,
                Expected_Deliverables__c, Reasons_For_And_Benefits_Of_Cooperation__c, Equipment__c,
                Brief_Statement_of_Purpose__c, Main_Objective_Research_Approach_S2__c, Current_State_Of_The_Art_Stage_2__c,
                Project_Description_Stage_2__c, Risk_Assessment_And_Migration_Strategy__c, Reasons_For_And_Benefits_Of_Corp_Stage2__c,
                Innovative_Aspects__c, Market_Assessment_Of_Proposed_Tech__c, Future_Commercialization_Plan__c, 
                Data_Management_And_Sharing_Protocols__c, Involvement_Of_Young_Scientists__c, Necessity_Of_Funding__c,
                Tentative_plans_for_networking__c, Plan_For_Utilisation_and_Preservation__c, Profile_Of_The_Academic_Institutions__c
                FROM Application_Proposal__c
                WHERE Id = :proposalId
                LIMIT 1
            ];
            System.debug('proposal : ' + proposal);

            return proposal;
        }
        catch(Exception ex){
            System.debug('ERROR @ LINE NUMBER :: ' + ex.getLineNumber());
            System.debug('ERROR MESSAGE :: ' + ex.getMessage());

            return null;
            // return 'ERROR @ LINE NUMBER :: ' + ex.getLineNumber() + ' ERROR MESSAGE :: ' + ex.getMessage();
        }
    }

    @RemoteAction
    public static string deleteWorkPackageDetails(string workPackageId){
        return IndustrialFellowshipHelper.deleteWorkPackageDetails(workPackageId);
    }
    
     @RemoteAction
    public static Contact getSignatoryContactDetails (String conId){
        Contact conRec = [SELECT Id, Salutation, FirstName, Institution_Name__c, 
            LastName, Country__c, MailingCity, MailingState, MailingCountry, 
            MailingPostalCode, MailingStreet, Nationality__c, Institute_Name__c,
            Department, Country_Code__c, Designation__c, Phone, Email, Homepage_URL__c,
            Gender__c, Birthdate, Proposals__c, Profile_Pic_Attachment_Id__c, Account.Name,
            Uploaded__c, PassportNo__c, 
            Signatory_First_Name__c, Signatory_Last_Name__c,
            Signatory_Institution__c, Signatory_Designation__c
            FROM Contact 
            WHERE Id =: conId
        ];
        return conRec;
    }
    
    @RemoteAction
    public static Boolean fetchApplicantStatus(String apaId){
        List<Applicant_Proposal_Association__c> apaList = [
            SELECT Applicant_Status__c, Contact__c, Contact__r.Is_Primary__c, Proposals__c, Proposals__r.Duration_In_Months_Max_36__c
            FROM Applicant_Proposal_Association__c
            WHERE Id = :apaId
            AND Is_Signatory__c = false
            LIMIT 1
        ];

        if (!apaList.isEmpty() && apaList[0].Applicant_Status__c == 'Submitted') {
            return true;
        }
        return false;
    }

    @RemoteAction
    public static ApplicantStatusWrapper fetchApplicantStatusWithDuration(String apaId, String yearlyCallId) {

        ApplicantStatusWrapper res = new ApplicantStatusWrapper();

        List<Applicant_Proposal_Association__c> apaList = [
            SELECT Applicant_Status__c, Contact__c, Contact__r.MailingCountry,
                Proposals__r.Duration_In_Months_Max_36__c
            FROM Applicant_Proposal_Association__c
            WHERE Id = :apaId
            AND Is_Signatory__c = false
            LIMIT 1
        ];

        if (!apaList.isEmpty()) {
            res.applicantStatus = apaList[0].Applicant_Status__c;
            res.durationInMonths = (Integer) apaList[0].Proposals__r.Duration_In_Months_Max_36__c;
            res.mailingCountry = apaList[0].Contact__r.MailingCountry;
        }

        YealyCall__c yearlyCall = [SELECT Id, Campaign__c, Campaign__r.Euro_Exchange_Rate__c 
            FROM YealyCall__c 
            WHERE Id =: yearlyCallId
        ];
        if (yearlyCall != null) {
            res.euroExchangeRate = yearlyCall.Campaign__r.Euro_Exchange_Rate__c;
        }

        return res;
    }

    public class ApplicantStatusWrapper {
        @AuraEnabled public String applicantStatus;
        @AuraEnabled public Integer durationInMonths;
        @AuraEnabled public Decimal euroExchangeRate;
        @AuraEnabled public String mailingCountry;
    }

    @RemoteAction
    public static String updateExpenseHeadDescriptions(List<Expense_Head__c> expenseHeads) {
        try {
            if (expenseHeads != null && !expenseHeads.isEmpty()) {
                update expenseHeads;
                return 'SUCCESS';
            }
            return 'ERROR: No expense heads provided';
        } catch (Exception e) {
            return 'ERROR: ' + e.getMessage();
        }
    }
    
    // ========== CONTACT PROFILE METHODS (moved from ContactProfileController) ==========
    
    @RemoteAction
    public static String saveContactProfile(Map<String, Object> contactData) {
        try {
            Contact c = new Contact();
            c.Id = (String) contactData.get('Id');
            c.Salutation = (String) contactData.get('Salutation');
            c.FirstName = (String) contactData.get('FirstName');
            c.LastName = (String) contactData.get('LastName');
            c.Designation__c = (String) contactData.get('Designation__c');
            c.Department = (String) contactData.get('Department');
            c.Email = (String) contactData.get('Email');
            c.MobilePhone = (String) contactData.get('MobilePhone');
            c.MailingCountry = (String) contactData.get('MailingCountry');
            c.MailingStreet = (String) contactData.get('MailingStreet');
            c.MailingState = (String) contactData.get('MailingState');
            c.MailingCity = (String) contactData.get('MailingCity');
            c.MailingPostalCode = (String) contactData.get('MailingPostalCode');
            
            // Handle Account
            String accountName = (String) contactData.get('AccountName');
            if (String.isNotBlank(accountName)) {
                Account acc;
                List<Account> accList = [
                    SELECT Id
                    FROM Account
                    WHERE Name = :accountName
                    LIMIT 1
                ];
                
                if (!accList.isEmpty()) {
                    acc = accList[0];
                } else {
                    acc = new Account(Name = accountName);
                    insert acc;
                }
                
                c.AccountId = acc.Id;
            }
            
            upsert c;
            return 'SUCCESS';
            
        } catch (Exception e) {
            return 'ERROR: ' + e.getMessage();
        }
    }
    
    @RemoteAction
    public static String saveEducationDetails(String contactId, String educationJson) {
        try {
            List<Object> rawList = (List<Object>) JSON.deserializeUntyped(educationJson);
            List<Education_Details__c> educationList = new List<Education_Details__c>();
            
            for (Object obj : rawList) {
                Map<String, Object> row = (Map<String, Object>) obj;
                
                Education_Details__c edu = new Education_Details__c();
                edu.Id = (String) row.get('Id');
                edu.Contact__c = contactId;
                edu.Degree__c = (String) row.get('Degree__c');
                edu.Institution_Name__c = (String) row.get('Institution_Name__c');
                edu.Area_of_specialization__c = (String) row.get('Area_of_specialization__c');
                
                // Safe date handling
                String startDateStr = (String) row.get('Start_Date__c');
                if (String.isNotBlank(startDateStr)) {
                    edu.Start_Date__c = Date.valueOf(startDateStr);
                }
                
                String endDateStr = (String) row.get('End_Date__c');
                if (String.isNotBlank(endDateStr)) {
                    edu.End_Date__c = Date.valueOf(endDateStr);
                }
                
                educationList.add(edu);
            }
            
            if (educationList.isEmpty()) {
                return 'ERROR: No education data provided';
            }
            
            upsert educationList;
            return 'SUCCESS';
            
        } catch (Exception e) {
            System.debug('Error saving education: ' + e.getMessage());
            return 'ERROR: ' + e.getMessage();
        }
    }
    
    @RemoteAction
    public static String saveEmploymentDetails(String contactId, String employmentJson) {
        try {
            List<Employment_Details__c> employmentList = (List<Employment_Details__c>) JSON.deserialize(
                employmentJson,
                List<Employment_Details__c>.class
            );
            
            if (employmentList == null || employmentList.isEmpty()) {
                return 'ERROR: No employment data provided';
            }
            
            for (Employment_Details__c emp : employmentList) {
                if (emp.Contact__c == null) {
                    emp.Contact__c = contactId;
                }
            }
            
            upsert employmentList;
            return 'SUCCESS';
            
        } catch (Exception e) {
            return 'ERROR: ' + e.getMessage();
        }
    }
    
    @RemoteAction
    public static String saveAchievementDetails(String contactId, String achievementJson) {
        try {
            List<Achievement__c> achievements = (List<Achievement__c>) JSON.deserialize(
                achievementJson,
                List<Achievement__c>.class
            );
            
            if (achievements == null || achievements.isEmpty()) {
                return 'ERROR: No achievement data provided';
            }
            
            for (Achievement__c ach : achievements) {
                if (ach.Contact__c == null) {
                    ach.Contact__c = contactId;
                }
            }
            
            upsert achievements;
            return 'SUCCESS';
            
        } catch (Exception e) {
            System.debug('Error saving achievement: ' + e.getMessage());
            return 'ERROR: ' + e.getMessage();
        }
    }
    
    @RemoteAction
    public static String deleteEducationRecord(String recordId) {
        try {
            delete new Education_Details__c(Id = recordId);
            return 'SUCCESS';
        } catch (Exception e) {
            return 'ERROR: ' + e.getMessage();
        }
    }
    
    @RemoteAction
    public static String deleteEmploymentRecord(String recordId) {
        try {
            delete new Employment_Details__c(Id = recordId);
            return 'SUCCESS';
        } catch (Exception e) {
            return 'ERROR: ' + e.getMessage();
        }
    }
    
    @RemoteAction
    public static String getProfileImageUrl(String contactId) {
        try {
            Contact con = [SELECT Id, Profile_Pic_Attachment_Id__c FROM Contact WHERE Id = :contactId LIMIT 1];
            if (con.Profile_Pic_Attachment_Id__c != null) {
                String attId = con.Profile_Pic_Attachment_Id__c;
                return '/servlet/servlet.FileDownload?file=' + attId;
            }
            return null;
        } catch (Exception e) {
            System.debug('Error getting profile image URL: ' + e.getMessage());
            return null;
        }
    }
    
    @RemoteAction
    // NEW METHOD: Get expense records from Expense_Head__c and Expense_Line_Item__c
    public static ExpenseHeadLineItemWrapper getExpenseHeadLineItemsForWiser(String apaId) {
        ExpenseHeadLineItemWrapper wrapper = new ExpenseHeadLineItemWrapper();
        
        try {
            // Get Yearly_Expense__c records for this APA
            List<Yearly_Expense__c> yearlyExpenses = [SELECT Id, Year__c, Applicant_Proposal_Association__c 
                                                      FROM Yearly_Expense__c 
                                                      WHERE Applicant_Proposal_Association__c = :apaId 
                                                      ORDER BY Year__c ASC];
            
            if(yearlyExpenses.isEmpty()) {
                return wrapper;
            }
            
            Set<Id> yearlyExpenseIds = new Set<Id>();
            for(Yearly_Expense__c ye : yearlyExpenses) {
                yearlyExpenseIds.add(ye.Id);
            }
            
            // Get all Expense_Head__c records with Year information and Description
            List<Expense_Head__c> expenseHeads = [SELECT Id, Name, Yearly_Expense__c, Yearly_Expense__r.Year__c, Description__c
                                                  FROM Expense_Head__c 
                                                  WHERE Yearly_Expense__c IN :yearlyExpenseIds
                                                  ORDER BY Name ASC, Yearly_Expense__r.Year__c ASC];
            
            Set<Id> headIds = new Set<Id>();
            for(Expense_Head__c eh : expenseHeads) {
                headIds.add(eh.Id);
            }
            
            // Get all line items
            List<Expense_Line_Item__c> lineItems = [SELECT Id, Name, Description__c, Position__c, Number__c, 
                                                    Person_Month__c, Salary_Month__c, Unit_Price__c, Multiplier__c,
                                                    Year1_Expense__c, Year2_Expense__c, Year3_Expense__c,
                                                    Year1_Approved_Amount__c, Year2_Approved_Amount__c, Year3_Approved_Amount__c,
                                                    Total_Expense__c, Index__c, Expense_Type__c, Expense_Head__c,
                                                    Time_Units__c, Expense_Description_2__c,
                                                    Expense_Head__r.Name, Expense_Head__r.Yearly_Expense__r.Year__c
                                                    FROM Expense_Line_Item__c 
                                                    WHERE Expense_Head__c IN :headIds 
                                                    ORDER BY Index__c ASC];
            
            // Consolidate line items (from Yearly_Expense__c -> Expense_Head__c -> Expense_Line_Item__c)
            // For Travel & Networking: merge by (Type + Description) when Description set, so same description = one UI row (no duplicate labels)
            // For others: merge by (Type + Index); merge Year1/Year2/Year3 from line items under Year 1/2/3 heads into single record
            Map<String, Expense_Line_Item__c> consolidatedMap = new Map<String, Expense_Line_Item__c>();
            
            for(Expense_Line_Item__c eli : lineItems) {
                String headName = eli.Expense_Head__r != null && eli.Expense_Head__r.Name != null ? eli.Expense_Head__r.Name : '';
                // Normalize so "Travel &amp; Networking" and "Travel & Networking" produce same key (avoid duplicate UI rows)
                String headNorm = (headName != null && headName.contains('&amp;')) ? headName.replace('&amp;', '&') : headName;
                Decimal idx = eli.Index__c != null ? eli.Index__c : 0;
                Boolean isTravelNetworking = (headNorm == 'Travel & Networking');
                // Normalize description: trim, replace HTML entities, normalize whitespace for consistent key matching
                String descNorm = null;
                if(eli.Description__c != null && eli.Description__c.trim() != '') {
                    descNorm = eli.Description__c.trim();
                    // Replace HTML entities
                    descNorm = descNorm.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"');
                    // Normalize multiple spaces to single space for consistent matching
                    descNorm = descNorm.replaceAll('\\s+', ' ');
                }
                // Travel & Networking with same description -> one row (avoid duplicate "Daily Allowance", "Participation at conference" in UI)
                String key = (isTravelNetworking && descNorm != null)
                    ? (headNorm + '_DESC_' + descNorm)
                    : (headNorm + '_' + idx);
                        
                        if(consolidatedMap.containsKey(key)) {
                            Expense_Line_Item__c existing = consolidatedMap.get(key);
                            // Merge year data when key matches so same description = one row with Year1/Year2/Year3 combined
                            String yearValue = (eli.Expense_Head__r != null && eli.Expense_Head__r.Yearly_Expense__r != null) 
                                ? eli.Expense_Head__r.Yearly_Expense__r.Year__c : null;
                            if(yearValue == '1') {
                                // Always update Year1 fields when processing Year 1 line item (even if 0, as 0 is valid)
                                existing.Year1_Expense__c = eli.Year1_Expense__c != null ? eli.Year1_Expense__c : 0;
                                existing.Year1_Approved_Amount__c = eli.Year1_Approved_Amount__c;
                            } else if(yearValue == '2') {
                                // Always update Year2 fields when processing Year 2 line item (even if 0, as 0 is valid)
                                existing.Year2_Expense__c = eli.Year2_Expense__c != null ? eli.Year2_Expense__c : 0;
                                existing.Year2_Approved_Amount__c = eli.Year2_Approved_Amount__c;
                            } else if(yearValue == '3') {
                                // Always update Year3 fields when processing Year 3 line item (even if 0, as 0 is valid)
                                existing.Year3_Expense__c = eli.Year3_Expense__c != null ? eli.Year3_Expense__c : 0;
                                existing.Year3_Approved_Amount__c = eli.Year3_Approved_Amount__c;
                            }
                            // Preserve Time_Units__c if it exists in the new item and not already set in existing
                            if(eli.Time_Units__c != null && eli.Time_Units__c != '' && (existing.Time_Units__c == null || existing.Time_Units__c == '')) {
                                existing.Time_Units__c = eli.Time_Units__c;
                            }
                            // Preserve Expense_Description_2__c if it exists in the new item and not already set in existing
                            if(eli.Expense_Description_2__c != null && eli.Expense_Description_2__c != '' && (existing.Expense_Description_2__c == null || existing.Expense_Description_2__c == '')) {
                                existing.Expense_Description_2__c = eli.Expense_Description_2__c;
                            }
                            // Recalculate total
                            existing.Total_Expense__c = (existing.Year1_Expense__c != null ? existing.Year1_Expense__c : 0) +
                                (existing.Year2_Expense__c != null ? existing.Year2_Expense__c : 0) +
                                (existing.Year3_Expense__c != null ? existing.Year3_Expense__c : 0);
                        } else {
                            Expense_Line_Item__c consolidated = new Expense_Line_Item__c();
                            consolidated.Id = eli.Id;
                            consolidated.Description__c = eli.Description__c;
                            consolidated.Position__c = eli.Position__c;
                            consolidated.Number__c = eli.Number__c;
                            consolidated.Person_Month__c = eli.Person_Month__c;
                            consolidated.Salary_Month__c = eli.Salary_Month__c;
                            consolidated.Unit_Price__c = eli.Unit_Price__c;
                            consolidated.Multiplier__c = eli.Multiplier__c;
                            consolidated.Index__c = eli.Index__c;
                            consolidated.Expense_Type__c = eli.Expense_Head__r.Name;
                            consolidated.Expense_Head__c = eli.Expense_Head__c; // Preserve Expense_Head__c ID for frontend to determine year
                            consolidated.Time_Units__c = eli.Time_Units__c; // Preserve Time_Units__c field
                            consolidated.Expense_Description_2__c = eli.Expense_Description_2__c; // Preserve Expense_Description_2__c field
                            
                            // Use same year check logic as merge section for consistency
                            String yearValueNew = (eli.Expense_Head__r != null && eli.Expense_Head__r.Yearly_Expense__r != null) 
                                ? eli.Expense_Head__r.Yearly_Expense__r.Year__c : null;
                            if(yearValueNew == '1') {
                                consolidated.Year1_Expense__c = eli.Year1_Expense__c != null ? eli.Year1_Expense__c : 0;
                                consolidated.Year1_Approved_Amount__c = eli.Year1_Approved_Amount__c;
                                consolidated.Year2_Expense__c = 0;
                                consolidated.Year3_Expense__c = 0;
                            } else if(yearValueNew == '2') {
                                consolidated.Year1_Expense__c = 0;
                                consolidated.Year2_Expense__c = eli.Year2_Expense__c != null ? eli.Year2_Expense__c : 0;
                                consolidated.Year2_Approved_Amount__c = eli.Year2_Approved_Amount__c;
                                consolidated.Year3_Expense__c = 0;
                            } else if(yearValueNew == '3') {
                                consolidated.Year1_Expense__c = 0;
                                consolidated.Year2_Expense__c = 0;
                                consolidated.Year3_Expense__c = eli.Year3_Expense__c != null ? eli.Year3_Expense__c : 0;
                                consolidated.Year3_Approved_Amount__c = eli.Year3_Approved_Amount__c;
                            } else {
                                // If year is null or unexpected, initialize all years to 0
                                consolidated.Year1_Expense__c = 0;
                                consolidated.Year2_Expense__c = 0;
                                consolidated.Year3_Expense__c = 0;
                            }
                            
                            consolidated.Total_Expense__c = (consolidated.Year1_Expense__c != null ? consolidated.Year1_Expense__c : 0) +
                                (consolidated.Year2_Expense__c != null ? consolidated.Year2_Expense__c : 0) +
                                (consolidated.Year3_Expense__c != null ? consolidated.Year3_Expense__c : 0);
                            
                            consolidatedMap.put(key, consolidated);
                        }
            }
            
            // Return in stable order: by Expense_Type__c then Index__c (so UI sections and rows are consistent)
            List<String> keys = new List<String>(consolidatedMap.keySet());
            keys.sort();
            List<Expense_Line_Item__c> sortedLineItems = new List<Expense_Line_Item__c>();
            for (String k : keys) {
                sortedLineItems.add(consolidatedMap.get(k));
            }
            wrapper.lineItems = sortedLineItems;
            wrapper.expenseHeads = expenseHeads;
            wrapper.yearlyExpenses = yearlyExpenses;
            
            return wrapper;
        } catch(Exception e) {
            System.debug('Error getting expense head line items ===> ' + e.getMessage());
            return wrapper;
        }
    }
    
     public class ExpenseHeadLineItemWrapper {
        public List<Expense_Line_Item__c> lineItems;
        public List<Expense_Head__c> expenseHeads;
        public List<Yearly_Expense__c> yearlyExpenses;
        
        public ExpenseHeadLineItemWrapper() {
            lineItems = new List<Expense_Line_Item__c>();
            expenseHeads = new List<Expense_Head__c>();
            yearlyExpenses = new List<Yearly_Expense__c>();
        }
    }

    @RemoteAction
    public static Application_Proposal__c getUserPopupChoiceFromProposal(String proposalId) {

        if(String.isNotBlank(proposalId)){
            Application_Proposal__c proposal = [
                SELECT  Id, User_Popup_Choice__c 
                FROM Application_Proposal__c 
                WHERE Id = :proposalId
            ];
            return proposal;
        }
        
        return null;
     
    }

    @RemoteAction
    public static Boolean saveUserPopupChoice(String proposalId, String popupChoice) {
        try {
            if(String.isNotBlank(proposalId) && String.isNotBlank(popupChoice)){
                Application_Proposal__c proposal = new Application_Proposal__c(
                    Id = proposalId,
                    User_Popup_Choice__c = popupChoice
                );
                update proposal;
                return true;
            }
            return false;
        } catch(Exception e) {
            System.debug('Error saving user popup choice: ' + e.getMessage());
            return false;
        }
    }
    
    
    public static void firstTestMethod1(){
        Integer i=0;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
         i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
    }
  
    public static void firstTestMethod2(){
        Integer i=0;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
         i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
    }
    
    public static void firstTestMethod3(){
        Integer i=0;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
         i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
    }
    
    public static void firstTestMethod4(){
        Integer i=0;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
         i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
    }
  
    public static void firstTestMethod5(){
        Integer i=0;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
         i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
    }
    
    public static void firstTestMethod6(){
        Integer i=0;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
         i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
    }
    
     public static void firstTestMethod7(){
        Integer i=0;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
         i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
    }

    public static void firstTestMethod33(){
        Integer i=0;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
         i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
    }
    
    public static void firstTestMethod44(){
        Integer i=0;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
         i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
        i++;i++;
    }
  
}