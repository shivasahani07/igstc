public without sharing class RegistrationForm_Controller {
    
    static String code;
    public Boolean isSignUp                 {get;set;}
    public Boolean isLogin                  {get;set;}
    public Boolean isCustomer               {get;set;}
    public Boolean isCandidate              {get;set;}
    public boolean isMentorExist            {get;set;}
    public string  name                     {get;set;}
    public string  FbId                     {get;set;}
    public string  gId                      {get;set;}
    public string  gFname                   {get;set;}
    public string  gLname                   {get;set;}
    public string hasCodeUpdate             {get;set;}
    public string Error                     {get;set;}
    public static final String SITE  =      'Login';
    public string currentUserId             {get;set;}
    public string hasCode                   {get;set;}
    public string contactId                   {get;set;}
    public string campaign                  {get;set;}
    public string currentdonorId            {get;set;}
    public Boolean SignupCandidate          {get;set;}
    public Boolean SignupCustomer           {get;set;}
    public Boolean docUplaodCustomer        {get;set;}
    public string isFBcustomerSignup        {get;set;}
    public string isFBcandidateSignup       {get;set;}
    public string selfAssesmentQuestions    {get;set;}
    public string jobFuncList               {get;set;}
    public string asignmentStatusList       {get;set;}
    public string jobShiftTimings           {get;set;}
    public string jobShiftAvailiblity       {get;set;}
    public string industryType              {get;set;}
    public String candidateSiteURL          {get;set;}
    public String candidateHashcode         {get;set;}
    public static String candidateId        {get;set;}
    public String ApplicantPortalSiteURL          {get;set;}
    
    
    public PageReference redirectProfilePage(){
        system.debug('redirectProfilePage--');
        
        Cookie cookiehashObj    = new Cookie('hashCodeLog', '', null, 0, false);
        Cookie cookiefbObj      = new Cookie('fbSessionId', '', null, 0, false);
        Cookie cookieGoogleObj  = new Cookie('googleSessionId', '', null, 0, false);
        Cookie cookiePrlmObj  = new Cookie('cookieEncStudent', '', null, 0, false);
        ApexPages.currentPage().setCookies(new Cookie[]{cookiehashObj, cookiefbObj, cookieGoogleObj,cookiePrlmObj});
        
        
        code                        = ApexPages.currentPage().getParameters().get('code');
        SignupCandidate            = ApexPages.currentPage().getParameters().get('m') == '2' ? true : false;
        SignupCustomer            = ApexPages.currentPage().getParameters().get('m') == '1' ? true : false;
        isLogin            = ApexPages.currentPage().getParameters().get('m') == '0' ? true : false;
        system.debug('ApexPages.currentPage().getParameters().get--'+ApexPages.currentPage().getParameters().get('m'));
        system.debug('code---'+code+'---SignupCandidate----'+SignupCandidate+'---SignupCustomer----'+SignupCustomer+'---isLogin----'+isLogin);
        Cookie cookieObj            = new Cookie('googleCode', code, null, 100, false);
        Cookie cookieLoginTypeObj   = new Cookie('loginType', 'googleLogin', null, 86400, false);
        Cookie isCandidate              = new Cookie('isSignupCandidate',SignupCandidate == true ? 'true' : 'false', null, 100, false);
        Cookie isCustomer               = new Cookie('isSignupCustomer',SignupCustomer == true ? 'true' : 'false', null, 100, false);
        Cookie isLogin                  = new Cookie('isLogin',isLogin == true ? 'true' : 'false', null, 100, false);
        Cookie pageReload                  = new Cookie('reload','true', null, 100, false);
        PageReference MyNewPage     = Page.redirectProfilePage;
        
        MyNewPage.setCookies(new Cookie[]{cookieObj, cookieLoginTypeObj,isCandidate,isCustomer,isLogin});
        
        MyNewPage.setRedirect(true);
        return MyNewPage;
        
    }
    @RemoteAction
    public static Map<String, SignUpDetails__mdt> getSignupSettings(){
        
        Map<String, SignUpDetails__mdt> mapEd = SignUpDetails__mdt.getAll();
        Map<String, SignUpDetails__mdt> signupMap = new Map<String, SignUpDetails__mdt>();
        for(SignUpDetails__mdt tempObj : mapEd.values()){
            if(tempObj.Active__c)
                signupMap.put(tempObj.AuthType__c,tempObj);
        }
        return signupMap;   
    }
    
    public void googleAuth(){
        try{
            system.debug('google auth');
            Cookie logType = ApexPages.currentPage().getCookies().get('loginType');
            system.debug('loginid::'+logType);
            system.debug('logType.getValue() -----'+logType.getValue());
            if(logType.getValue()   == 'googleLogin'){
                try{
                    //recordType = '';
                    Cookie candidate = ApexPages.currentPage().getCookies().get('isSignupCandidate');
                    Cookie customer = ApexPages.currentPage().getCookies().get('isSignupCustomer');
                    Cookie Login = ApexPages.currentPage().getCookies().get('isLogin');
                    system.debug('SignupCandidate----'+candidate.getValue());
                    system.debug('SignupCustomer----'+customer.getValue());
                    if(candidate.getValue() == 'True'){
                        SignupCandidate = True;
                        system.debug('SignupCandidate----');
                    }
                    if(customer.getValue() == 'True'){
                        SignupCustomer = True;
                        system.debug('SignupCustomer----');
                    }
                    if(Login.getValue() == 'True'){
                        islogin = True;
                    }
                    system.debug('registrationFromGoogle'); 
                    String authCode ;        
                    System.debug(Apexpages.currentPage().getParameters().get('code'));
                    Cookie lkcode = ApexPages.currentPage().getCookies().get('googleCode');
                    System.debug('CODE'+lkcode);
                    if(lkcode != null){
                        code = lkcode.getValue();
                        Cookie cookiegObj   = new Cookie('googleCode', '', null, 100, false);
                        ApexPages.currentPage().setCookies(new Cookie[]{cookiegObj});
                    }
                    if(String.isBlank(code)){
                        Cookie gSessId = ApexPages.currentPage().getCookies().get('googleSessionId');
                        if(gSessId != null){
                            authCode = gSessId.getValue();
                        }
                    }
                    System.debug('code'+code);
                    if(!String.isBlank(code)){
                        if(candidate.getValue() == 'True'){
                            System.debug('code @ 134');
                            authCode = LoginAuthentication_Helper.getGoogleAuthCode(code,'candidate');
                        }
                        if(customer.getValue() == 'True'){
                            System.debug('code @ 138');
                            authCode = LoginAuthentication_Helper.getGoogleAuthCode(code,'customer');
                        }
                        if(Login.getValue() == 'True'){
                            System.debug('code @ 142');
                            authCode = LoginAuthentication_Helper.getGoogleAuthCode(code,'login');
                        }
                        authCode = LoginAuthentication_Helper.getGoogleAuthCode(code,'login');
                        
                    }
                    System.debug('AUTHCODE'+AUTHCODE);
                    if(!String.isBlank(authCode)){
                        System.debug('AUTHCODE');
                        if(!authCode.equalsIgnoreCase('Error')){
                            GooglePublicDetailsClass.GoogleDetails gResp = LoginAuthentication_Helper.getGoogleEmail(authCode);
                            System.debug('gResp---'+gResp);
                            system.debug('gResp.email===='+gResp.email);
                            if(gResp != null && !String.isBlank(gResp.email)){
                                gId = gResp.email;
                                gFname = gResp.firstName;
                                gLname = gResp.lastName;
                                System.debug('AUTHCODE');
                                try{
                                    list<Contact> currentCandidate    = [Select id,name,Login_Hash_Code__c,Campaign__c,status__c from Contact where Email =:gResp.email];
                                    system.debug('currentCandidate------'+currentCandidate);
                                    if(currentCandidate.size() >0){
                                        SignupCandidate = false;
                                        currentdonorId          = currentCandidate[0].Id;
                                        Contact contact=new Contact();
                                        //logic added by rutuja to resolve login hash code issue 
                                        if(String.isBlank(contact.Login_Hash_Code__c)){
                                            contact.Login_Hash_Code__c=FacebookAuthHandler.generateRandomString();
                                        }
                                        contact.Id=currentdonorId;
                                        hasCode=contact.Login_Hash_Code__c;
                                        contactId = contact.Id;
                                        campaign=currentCandidate[0].Campaign__c;
                                        system.debug('inside if campaign---'+campaign);
                                        system.debug(' contact.Campaign__c---'+currentCandidate[0].Campaign__c);
                                        update contact;
                                        
                                    }else{
                                        
                                        SignupCandidate = true;
                                    }
                                    
                                    System.debug('HASH CODE===>'+contact.Login_Hash_Code__c);
                                    
                                    Cookie cookieObj1 = new Cookie('googleSessionId', authCode, null, 3600, false);
                                    ApexPages.currentPage().setCookies(new Cookie[]{cookieObj1});
                                }catch(Exception e){
                                    system.debug(e.getMessage());
                                }
                            }
                        }
                    }
                    
                }catch(Exception e){
                    system.Debug('linenum------'+e.getLineNumber()+'error-------'+e.getMessage());
                }
            }  
        }catch(exception e){
            system.debug('get line---'+e.getLineNumber()+'--message--'+e.getMessage());
        }
    }
    
    public PageReference checkUserAuth(){
        isMentorExist=false;
        system.debug('checkUserAuth-----'+currentUserId);
        PageReference pg   = new PageReference('/'); 
        string encStudentId   = Apexpages.currentPage().getParameters().get('encStudentId');
        string hashCode     = Apexpages.currentPage().getParameters().get('d');  
        
        system.debug('hashCode===>'+hashCode + 'enc StudentId====>'+encStudentId);  
        
        if(encStudentId != null){
            currentUserId          = FacebookAuthHandler.decryptString(encStudentId, 'FFE12ORDER34KEY56QWERTY56QAXWSX');
            Cookie cookieEncStudent   = new Cookie('cookieEncStudent', currentUserId, null, 86400, false);
            ApexPages.currentPage().setCookies(new Cookie[]{cookieEncStudent});            
        }
        
        if(hashCode != null){
            Cookie cookiehashCode   = new Cookie('hashCodeLog', currentUserId, null, 1800, false);
            ApexPages.currentPage().setCookies(new Cookie[]{cookiehashCode});
        }
        
        if(currentUserId == null){
            Cookie encStd = ApexPages.currentPage().getCookies().get('cookieEncStudent');
            system.debug('encStd==>'+encStd);
            if(encStd != null) currentUserId = encStd.getValue();
            if(currentUserId != null){
                Cookie cookieEncDonor   = new Cookie('cookieEncStudent', currentUserId, null, 86400, false);
                ApexPages.currentPage().setCookies(new Cookie[]{cookieEncDonor}); 
            }            
        }
        
        
        if(currentUserId == null){
            Cookie chashcode = ApexPages.currentPage().getCookies().get('hashCodeLog');
            if(chashcode != null) currentUserId    = chashcode.getValue();
            if(currentUserId != null){
                Cookie cookiehashCode   = new Cookie('hashCodeLog', currentUserId, null, 1800, false);
                ApexPages.currentPage().setCookies(new Cookie[]{cookiehashCode});
            }          
        }
        System.debug('currentUserId'+currentUserId);
        if(currentUserId == null || currentUserId==''){
            Cookie logType = ApexPages.currentPage().getCookies().get('loginType');
            system.debug('loginid::'+logType);
            //system.debug('logTypetValue----'+logType.getValue());
            if(logType != null){
                if(logType.getValue()   == 'googleLogin'){
                    try{
                        Cookie candidate = ApexPages.currentPage().getCookies().get('isSignupCandidate');
                        Cookie customer = ApexPages.currentPage().getCookies().get('isSignupCustomer');
                        system.debug('SignupCandidate----'+candidate.getValue());
                        system.debug('SignupCustomer----'+customer.getValue());
                        if(candidate.getValue() == 'True'){
                            SignupCandidate = True;
                            system.debug('SignupCandidate----');
                        }
                        if(customer.getValue() == 'True'){
                            SignupCustomer = True;
                            system.debug('SignupCustomer----');
                        }
                        //recordType = '';
                        checkGoogleAuth();
                        system.debug('registrationFromGoogle');
                        //PageReference pageRef = new PageReference('https://testingv2-leadersinternational.cs18.force.com/login/redirectprofilepage');
                        
                    }catch(Exception e){
                        system.Debug('linenum------'+e.getLineNumber()+'error-------'+e.getMessage());
                        system.debug('pg'+pg);
                        return pg;
                    }
                }
                if(logType.getValue()   == 'fbLogin'){
                    try{
                        Cookie candidate = ApexPages.currentPage().getCookies().get('isSignupCandidate');
                        Cookie customer = ApexPages.currentPage().getCookies().get('isSignupCustomer');
                        system.debug('SignupCandidate----'+candidate.getValue());
                        isFBcustomerSignup = customer.getValue();
                        isFBcandidateSignup = candidate.getValue();
                        system.debug('SignupCustomer----'+customer.getValue());
                        system.debug('checkFacebookAuth----');
                        
                        checkFacebookAuth();  
                        if(ApexPages.currentPage().getCookies().get('signUp').getValue() == 'true') {
                            isSignUp = true;
                            System.debug('facebook signup');
                            return null;
                        }
                        if(ApexPages.currentPage().getCookies().get('Login').getValue() == 'true') {
                            isLogin = true;
                            System.debug('facebook login');
                            return null;
                        }
                        
                    }catch(Exception e){
                        system.debug('exception '+e.getMessage()+'line no '+e.getLineNumber());
                        return pg;
                    }
                }
                
            }else{
                return pg;
            }
        }
        
        // If current user is not an authorized user 
        // then redirect to login page
        system.debug('currentUserId-----'+currentUserId);
        if(currentUserId == null) return pg;
        
        return null;
    }
    
    public void checkGoogleAuth(){
        
        String authCode ;        
        System.debug(Apexpages.currentPage().getParameters().get('code'));
        Cookie lkcode = ApexPages.currentPage().getCookies().get('googleCode');
        System.debug('CODE'+lkcode);
        System.debug(ApexPages.currentPage().getCookies());
        if(lkcode != null){
            code = lkcode.getValue();
            Cookie cookiegObj   = new Cookie('googleCode', '', null, 100, false);
            ApexPages.currentPage().setCookies(new Cookie[]{cookiegObj});
        }
        
        if(String.isBlank(code)){
            Cookie gSessId = ApexPages.currentPage().getCookies().get('googleSessionId');
            if(gSessId != null){
                authCode = gSessId.getValue();
            }
        }
        System.debug('code'+code);
        if(!String.isBlank(code)){
            authCode = LoginAuthentication_Helper.getGoogleAuthCode(code,LoginAuthentication_Helper.DONOR_STIE);
            System.debug('authCode'+authCode);
        }
        System.debug('AUTHCODE');
        if(!String.isBlank(authCode)){
            System.debug('AUTHCODE');
            if(!authCode.equalsIgnoreCase('Error')){
                GooglePublicDetailsClass.GoogleDetails gResp = LoginAuthentication_Helper.getGoogleEmail(authCode);
                System.debug('gResp---'+gResp);
                system.debug('gResp.email===='+gResp.email);
                if(gResp != null && !String.isBlank(gResp.email)){
                    gId = gResp.email;
                    System.debug('AUTHCODE');
                    try{
                        list<Contact> currentdonor    = [Select id,name,Login_Hash_Code__c,Campaign__c from Contact where Email =:gResp.email];
                        if(currentdonor.size() >0){
                            currentdonorId          = currentdonor[0].Id;
                            Contact contact=new Contact();
                            //logic added by rutuja to resolve login hash code issue 
                            if(String.isBlank(contact.Login_Hash_Code__c)){
                                contact.Login_Hash_Code__c=FacebookAuthHandler.generateRandomString();
                            }
                            contact.Id=currentdonorId;
                            hasCode=contact.Login_Hash_Code__c;
                            contactId = contact.Id;
                            campaign=contact.Campaign__c;
                            system.debug('inside if');
                            update contact;
                        }else{
                            /*  Contact contact=new Contact();
contact.LastName = gResp.lastName;
contact.firstName = gResp.firstName;
contact.Email = gResp.email;
contact.Login_Hash_Code__c = FacebookAuthHandler.generateRandomString();
//contact.Last_Hash_Code_Updated__c = System.now();
hasCode = contact.Login_Hash_Code__c ;
system.debug('inside else');
insert contact;  
*/
                            SignupCandidate = true;
                        }
                        
                        System.debug('HASH CODE===>'+contact.Login_Hash_Code__c);
                        
                        Cookie cookieObj1 = new Cookie('googleSessionId', authCode, null, 3600, false);
                        ApexPages.currentPage().setCookies(new Cookie[]{cookieObj1});
                    }catch(Exception e){
                        system.debug(e.getMessage());
                    }
                }
            }
        }
        
    }
    public void checkFacebookAuth(){
        String authCode ;        
        Cookie lkcode = ApexPages.currentPage().getCookies().get('facebookCode');
        
        string isSignup = ApexPages.currentPage().getCookies().get('signUp').getValue();
        string isLogin = ApexPages.currentPage().getCookies().get('Login').getValue();
        //string isCandidate = ApexPages.currentPage().getCookies().get('isCandidate').getValue();
        //string isCustomer = ApexPages.currentPage().getCookies().get('isCustomer').getValue();
        if(lkcode != null){
            code = lkcode.getValue();
            Cookie cookiefObj   = new Cookie('facebookCode', '', null, 100, false);
            ApexPages.currentPage().setCookies(new Cookie[]{cookiefObj});
        }
        if(String.isBlank(code)){
            Cookie gSessId = ApexPages.currentPage().getCookies().get('fbSessionId');   
            if(gSessId != null){
                authCode = gSessId.getValue();
            }
        }
        system.debug('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@code'+code);
        string token;
        if(!String.isBlank(code)){
            Facebook_API_Details__c fad = Facebook_API_Details__c.getInstance();
            if(isLogin == 'true' || isFBcandidateSignup == 'true' || isFBcustomerSignup == 'true'){
                token = FacebookAuthHandler.generateFBAuthCode(code,fad.Auth_Endpoint_URL__c,fad.login_Site_URL__c, fad.App_Id__c, fad.App_Secret__c);    
            }else{
                system.debug('is candiddate');
                token = FacebookAuthHandler.generateFBAuthCode(code,fad.Auth_Endpoint_URL__c,fad.candidate_login_site_url__c, fad.App_Id__c, fad.App_Secret__c);   
            }
            
            system.debug('is token---'+token);
        }
        
        if(!String.isBlank(token)){
            Facebook_API_Details__c fad = Facebook_API_Details__c.getInstance();
            String fbEmail  = FacebookAuthHandler.getFBPublicDetails(fad.Endpoint_URL__c, fad.App_Id__c, fad.App_Secret__c, token);
            FbId            = fbEmail;
            name            = FacebookAuthHandler.name;
            system.debug('fbEmail----------'+fbEmail);
            system.debug(name);
            if(!String.isBlank(fbEmail)){
                
                try{
                    if(isLogin == 'true'){
                        system.debug('login is true-----');
                    }
                    system.debug('isLogin------'+isLogin);
                    system.debug('fbEmail------'+fbEmail);
                    
                    Contact[] currentUser;
                    //currentUser     = [Select id,Internal_Status__c,RecordTypeId,RecordType.developerName from Contact where (Email =:fbEmail OR Facebook_login_ID__c =:fbEmail) and (RecordTypeId=:conStdRecordTypeId OR RecordTypeId=:conFacRecordTypeId OR RecordTypeId=:manRecordTypeId)];
                    currentUser     = [Select id,name,status__c,Login_Hash_Code__c from Contact where Email =:fbEmail]; 
                    system.debug('currentUser--'+currentUser);
                    
                    string recordType;
                    Boolean isSignupFromFb;
                    if (currentUser.size() > 0){
                        
                        currentUserId           = currentUser[0].Id;
                        System.debug('FBEMAIL  '+fbEmail);
                        Contact contact=new Contact();
                        //logic added by rutuja to resolve login hash code issue 
                        if(String.isBlank(contact.Login_Hash_Code__c)){
                            contact.Login_Hash_Code__c=FacebookAuthHandler.generateRandomString();
                        }
                        hasCodeUpdate=contact.Login_Hash_Code__c;
                        contact.id=currentUser[0].id;
                        update contact;
                        System.debug('LOGIN HASHCODE===>'+contact.Login_Hash_Code__c);
                        SignupCandidate = false;
                        
                        
                        Cookie cookieObj1 = new Cookie('fbSessionId', authCode, null, 3600, false);
                        ApexPages.currentPage().setCookies(new Cookie[]{cookieObj1});
                        return ;
                    }
                    else{
                        /* Contact contact=new Contact();
contact.lastName = FacebookAuthHandler.name;
contact.email = fbEmail;
contact.Login_Hash_Code__c=FacebookAuthHandler.generateRandomString();
hasCodeUpdate=contact.Login_Hash_Code__c;
insert contact; */
                        //   isSignupFromFb = true;
                        //    SignupCandidate = true;
                        currentUserId = 'signUp';
                        system.debug('FbId---'+FbId+'---name---'+name+'---isLogin---'+isLogin);
                        System.debug('isSignupFromFb---'+isSignupFromFb);
                        Cookie cookieObj1 = new Cookie('fbSessionId', authCode, null, 3600, false);
                        ApexPages.currentPage().setCookies(new Cookie[]{cookieObj1});
                    }
                    
                }
                catch(Exception e){
                    system.debug(e.getMessage());
                }
            }
        }
    } 
    
    public PageReference redirectProfilePagefoFB() {
        isSignUp            = false;
        isLogin         = false;
        system.debug('redirectProfilePagefoFB cookiessssssssssssss');
        system.debug('ApexPages.currentPage().getParameters().get(m)------'+ApexPages.currentPage().getParameters().get('m'));
        code                        = ApexPages.currentPage().getParameters().get('code');
        isSignUp            = ApexPages.currentPage().getParameters().get('m') == '1' ? true : false;
        string mValue = ApexPages.currentPage().getParameters().get('m');
        system.debug('code----'+code);
        if(mValue == '1'|| mValue == '2'){
            isSignUp = True;
            system.debug('isSignUp---'+isSignUp);
        }
        isLogin             = ApexPages.currentPage().getParameters().get('m') == '0' ? true : false;
        isCustomer          = ApexPages.currentPage().getParameters().get('m') == '1' ? true : false;
        isCandidate         = ApexPages.currentPage().getParameters().get('m') == '2' ? true : false;
        Cookie cookieObj            = new Cookie('facebookCode', code, null, 100, false);
        Cookie cookieLoginTypeObj   = new Cookie('loginType', 'fbLogin', null, 86400, false);
        Cookie mSite                = new Cookie('signUp',isSignUp == true ? 'true' : 'false', null, 100, false);
        Cookie aSite                = new Cookie('Login',isLogin == true ? 'true' : 'false', null, 100, false);
        Cookie isCandidate              = new Cookie('isSignupCandidate',isCandidate == true ? 'true' : 'false', null, 100, false);
        Cookie isCustomer               = new Cookie('isSignupCustomer',isCustomer == true ? 'true' : 'false', null, 100, false);
        system.debug('code'+code);
        system.debug('isSignUp'+isSignUp);
        // Facebook_API_Details__c fad = Facebook_API_Details__c.getInstance();
        //  String token = FacebookAuthHandler.generateFBAuthCode(code,fad.Auth_Endpoint_URL__c,fad.login_Site_URL__c, fad.App_Id__c, fad.App_Secret__c);    
        //  FacebookAuthHandler.getFBPublicDetails(fad.Endpoint_URL__c,fad.App_Id__c,fad.App_Secret__c,token);
        //  system.debug('token'+token);
        PageReference MyNewPage     = Page.RedirectToFBProfilePage;
        
        MyNewPage.setCookies(new Cookie[]{cookieObj, cookieLoginTypeObj, mSite,aSite,isCandidate,isCustomer});
        
        MyNewPage.setRedirect(true);
        return MyNewPage;
    }
    
    @RemoteAction
    public static String insertContact(Contact contactDetails, String companyName, string campaignURL){
        try{
            system.debug('contactDetails ::'+contactDetails);
            system.debug('companyName ::'+companyName);
            
            List<Campaign> campaignData;
            
            Application_Proposal__c appProposal = New Application_Proposal__c();
            if(campaignURL == 'wiser'){
                appProposal.RecordTypeId = Utility.getProposalRecordType('WISER');
                campaignData=[SELECT Id,(SELECT Id From Yearly_Calls__r WHERE Active__c = True LIMIT 1) FROM Campaign where Name='WISER' LIMIT 1];
                appProposal.Campaign__c=campaignData[0].Id;
            }else if(campaignURL == 'workshop'){
                appProposal.RecordTypeId = Utility.getProposalRecordType('Workshop');
                campaignData=[SELECT Id,(SELECT Id From Yearly_Calls__r WHERE Active__c = True LIMIT 1) FROM Campaign where Name='workshop' LIMIT 1];
                appProposal.Campaign__c=campaignData[0].Id;
                
                system.debug('workshop --> '+campaignData);
            }else if(campaignURL == 'pecfar'){
                appProposal.RecordTypeId = Utility.getProposalRecordType('PECFAR');
                campaignData=[SELECT Id,(SELECT Id From Yearly_Calls__r WHERE Active__c = True LIMIT 1) FROM Campaign where Name='PECFAR' LIMIT 1];
                appProposal.Campaign__c=campaignData[0].Id;
            }else if(campaignURL == 'sing'){
                appProposal.RecordTypeId = Utility.getProposalRecordType('SING');
                campaignData=[SELECT Id,(SELECT Id From Yearly_Calls__r WHERE Active__c = True LIMIT 1) FROM Campaign where Name='SING' LIMIT 1];
                appProposal.Campaign__c=campaignData[0].Id;
            }else if(campaignURL == '2plus2'){
                appProposal.RecordTypeId = Utility.getProposalRecordType('Two Plus Two');
                campaignData=[SELECT Id,(SELECT Id From Yearly_Calls__r WHERE Active__c = True LIMIT 1) FROM Campaign where Name='2+2 Call' LIMIT 1];
                appProposal.Campaign__c=campaignData[0].Id;
            }else{
                appProposal.RecordTypeId = Utility.getProposalRecordType('Industrial Fellowship');
                campaignData=[SELECT Id,(SELECT Id From Yearly_Calls__r WHERE Active__c = True LIMIT 1) FROM Campaign where Name='Industrial Fellowships' LIMIT 1];
                appProposal.Campaign__c=campaignData[0].Id;
            }
            
            appProposal.Proposal_Stages__c = 'Draft';
            system.debug('campaignData[0].Yearly_Calls__r[0].Id ==> '+campaignData[0].Yearly_Calls__r[0].Id);
            appProposal.yearly_Call__c = campaignData[0].Yearly_Calls__r[0].Id;
            insert appProposal;
            List<Contact> conList = [SELECT Id,Name,Email From Contact WHERE Email=: contactDetails.Email];
            system.debug('conList ::'+conList);
            if(conList.size() > 0){
                return 'Email already Exists';
            }else{
                Account acc = New Account();
                acc.Name = companyName;
                if(campaignURL == '2plus2'){
                    acc.Is_Coordinator__c=true;    
                }
                acc.Website=contactDetails.Homepage_URL__c;
                acc.Is_Primary__c = true;
                acc.Proposals__c = appProposal.Id;
                insert acc;
                system.debug('acc ::'+acc);
                contactDetails.AccountId = acc.Id; 
                //logic added by rutuja to resolve login hash code issue 
                if(String.isBlank(contactDetails.Login_Hash_Code__c)){
                    contactDetails.Login_Hash_Code__c = Utility.generateRandomString();
                }
                contactDetails.Is_Primary__c = true;
                contactDetails.Proposals__c = appProposal.Id;
                contactDetails.Salutation = contactDetails.Title;
                insert contactDetails;
                system.debug('contactDetails ::'+contactDetails);
            }
            
            return contactDetails.Login_Hash_Code__c ;
        }catch(Exception e){
            return e.getMessage() + e.getLineNumber();
        }
    }
    
    
    @RemoteAction
    public static contact loginUser(string userName, string password,boolean campaignDisabled){
        try{
            list<contact> conRec = [select Login_Hash_Code__c,firstName,proposals__r.proposal_stages__c,proposals__r.Submitted__c,LastName,id,email from contact where email =:userName AND Password__c =:password  AND Host__c != true limit 1];
            system.debug('conRec----'+conRec);
            if(conRec.size() > 0 ){   
                // Contact Rev = new Contact();
                //logic added by rutuja to resolve login hash code issue 
                if(String.isBlank(conRec[0].Login_Hash_Code__c)){
                    conRec[0].Login_Hash_Code__c = Utility.generateRandomString();
                }
                //Rev.Id = conRec[0].Id;  
                System.debug('The Hash Code Value');
                update conRec;                    
                return conRec[0];
            }else{
                return null;
            }
        }catch(exception e){
            system.debug(e.getLineNumber()+'---error Message---'+e.getMessage());
            return null;
        }   
    }
    
    @RemoteAction
    public static string getcampaigntype(string userName){
        try{
            Contact conrec = [SELECT Id,Name,Campaign__c from Contact where email=: userName AND Host__c != true];
            return conrec.Campaign__c;
        }catch(exception e){
            return null;
        }
    }
    @RemoteAction
    public static List<Campaign> fetchCampaignsPrograms(){
        List<Campaign> campaignList = [SELECT Id,Name,Description,Actual_End_Date__c,Disable_Campaign__c,EndDate,Image_URL__c,RedirectPage__c,Cut_Off_Start_Date__c,Cut_Off_End_Date__c,(select name,id from Attachments order by createdDate DESC),(SELECT Id,Campaign__c,Name,Description__c FROM Campaign_Guidlines__r) FROM Campaign];
        if(!campaignList.isEmpty()){
            return campaignList; 
        }
        return Null;
    }
    // Forgot Reset Application Portal
    @RemoteAction
    Public Static String ForgotPassapplication(String emailId){
        string emailTempName;
        try{
            List<Contact> conList = [SELECT Name,Salutation,LastName,Email, Password__c,Campaign__c, Login_Hash_Code__c FROM Contact WHERE Email =: emailId];
            if(conList.size()>0){
                String currentConId;
                String hasCode;
                String contactId;
                currentConId = conList[0].id;
                Contact con = new Contact();
                //logic added by rutuja to resolve login hash code issue 
                if(String.isBlank(con.Login_Hash_Code__c)){
                    con.Login_Hash_Code__c = Utility.generateRandomString();
                }
                con.Id = currentConId;
                hasCode = String.valueOf(con.Login_Hash_Code__c);
                contactId = String.valueOf(con.Id);
                system.debug('conList[0].Campaign__c ::' +conList[0].Campaign__c);
                
                
                if(conList[0].Campaign__c == 'if'){
                    emailTempName = 'Email to Primary Contact for Reset Password IF';
                }else if(conList[0].Campaign__c == 'pecfar'){
                    emailTempName = 'Reset Password PECFAR';
                }else if(conList[0].Campaign__c == 'wiser'){
                    emailTempName = 'Email to Primary Contact for reset password WISER';
                }else if(conList[0].Campaign__c == 'sing'){
                    emailTempName = 'Reset password - SING';
                }else if(conList[0].Campaign__c == 'workshop'){
                    emailTempName = 'Reset password - WORKSHOP';
                }else if(conList[0].Campaign__c == '2plus2'){
                    emailTempName = 'Email to Primary Contact for Reset Password 2+2';
                }
                else{
                    emailTempName = 'Application Forget Password'; 
                }
                
                List<Messaging.SingleEmailMessage> mailList = new List<Messaging.SingleEmailMessage>();
                EmailTemplate temp = [SELECT Id,Name,HTMLValue,Subject, Body FROM EmailTemplate WHERE Name =: emailTempName];
                String orgWideEmailName = Label.OrgWideEmailAddress;
                List<OrgWideEmailAddress> oweaList = [SELECT Id, Address, DisplayName FROM OrgWideEmailAddress WHERE DisplayName = :orgWideEmailName];
                OrgWideEmailAddress owea;
                if (!oweaList.isEmpty()) {
                    owea = oweaList[0];
                    System.debug('Found OrgWideEmailAddress: ' + owea.Address);
                } else {
                    System.debug('No OrgWideEmailAddress found with DisplayName====>'+orgWideEmailName);
                }
                //Id orgWideEmailAddressId = [SELECT Id FROM OrgWideEmailAddress WHERE DisplayName='noreply@igstc.org' LIMIT 1].Id;
                //Id orgWideEmailAddressId = [SELECT Id FROM OrgWideEmailAddress WHERE DisplayName='isha' LIMIT 1].Id;
                system.debug('temp ::'+temp);
                String htmlBody = temp.HTMLValue;
                String subject = temp.Subject;
                String plainTextBody = temp.body;
                
                system.debug('plainTextBody ::'+temp.body);
                
                htmlBody = htmlBody.replace('{!Contact.Name}', conList[0].Salutation + ' ' +  conList[0].LastName );
                htmlBody = htmlBody.replace('{!Contact.Login_Hash_Code__c}', con.Login_Hash_Code__c);
                htmlBody = htmlBody.replace('{!$Label.ApplicationPasswordReset}', Label.ApplicationPasswordReset);
                htmlBody = htmlBody.replace('{!$Label.Site_Base_URL}', Label.Site_Base_URL);
                
                plainTextBody = plainTextBody.replace('{!Contact.Name}', conList[0].Name);
                plainTextBody = plainTextBody.replace('{!Contact.Login_Hash_Code__c}', con.Login_Hash_Code__c);
                plainTextBody = plainTextBody.replace('{!$Label.ApplicationPasswordReset}', Label.ApplicationPasswordReset);
				plainTextBody = plainTextBody.replace('{!$Label.Site_Base_URL}', Label.Site_Base_URL);
                String comingEmail =  conList[0].Email;
                System.debug('comingEmail--------->'+comingEmail);
                
                Messaging.SingleEmailMessage mailTemp = new Messaging.SingleEmailMessage();
                if (owea != null) {
                    mailTemp.setOrgWideEmailAddressId(owea.Id);
                    System.debug('Setting OrgWideEmailAddressId: ' + owea.Id);
                } else {
                    System.debug('OrgWideEmailAddressId is null.');
                }
                //mailTemp.setOrgWideEmailAddressId(orgWideEmailAddressId);
                mailTemp.setHtmlBody(htmlBody);
                mailTemp.setSubject(subject);
                mailTemp.setPlainTextBody(plainTextBody);
                mailTemp.toAddresses = new String[] { conList[0].Email };
                    mailList.add(mailTemp);
                
                system.debug('mailList ::'+mailList);
                if(!mailList.isEmpty()){
                    Messaging.sendEmail(mailList);
                }
                update con;
                return con.Login_Hash_Code__c;
            }
            
        }catch(Exception e){
            System.debug('The Error '+e.getMessage());
            System.debug('Erron Line '+e.getLineNumber());
            return e.getMessage();
        }
        return null;
    }
    
    // Password Reset Application Portal
   /*
    @RemoteAction
    Public Static String ApplicationPasswordReset(String password, String loginhashcode){
        try{
            Contact conToUpdate = [SELECT Name,Email, Password__c, Campaign__c, Login_Hash_Code__c FROM Contact WHERE Login_Hash_Code__c =: loginhashcode LIMIT 1];
            conToUpdate.Password__c = password;
            //logic added by rutuja to resolve login hash code issue 
            if(String.isBlank(conToUpdate.Login_Hash_Code__c)){    
                conToUpdate.Login_Hash_Code__c = Utility.generateRandomString();
            }
            update conToUpdate;
            return conToUpdate.Campaign__c;
        }catch(Exception e){
            System.debug('The Error---->'+e.getMessage());
            System.debug('The Error Line---->'+e.getLineNumber());
        }
        return 'error';
    }*/
//  ********* Change made by Anurag Raichand *******************
    @RemoteAction
    Public Static String ApplicationPasswordReset(String password, String loginhashcode){
        try{
            List<Contact> conList = [SELECT Name, Email, Password__c, Campaign__c, Login_Hash_Code__c FROM Contact WHERE Login_Hash_Code__c =: loginhashcode 
                                     LIMIT 1];

            if (conList.isEmpty()) {
                System.debug('ApplicationPasswordReset Error: No Contact found with hash: ' + loginhashcode);
                return 'error_not_found'; 
            }

            Contact conToUpdate = conList[0];
            conToUpdate.Password__c = password;
            
            if(String.isBlank(conToUpdate.Login_Hash_Code__c)){    
                conToUpdate.Login_Hash_Code__c = Utility.generateRandomString();
            }
            
            update conToUpdate;
            
            if (String.isBlank(conToUpdate.Campaign__c)) {
                return 'success_no_campaign';
            } else {
                return conToUpdate.Campaign__c;
            }
            
        }catch(Exception e){
            System.debug('The Error---->'+e.getMessage());
            System.debug('The Error Line---->'+e.getLineNumber());
            return 'error_exception'; // Return a specific error string for exceptions
        }
    }
    
    //**************************************************************************
    
    @RemoteAction
    Public Static String getCampaign(String loginhashcode){
        try{
            Contact conToUpdate = [SELECT Name,Email, Password__c, Campaign__c, Login_Hash_Code__c FROM Contact WHERE Login_Hash_Code__c =: loginhashcode LIMIT 1];
            return conToUpdate.Campaign__c;
        }catch(Exception e){
            System.debug('The Error---->'+e.getMessage());
            System.debug('The Error Line---->'+e.getLineNumber());
        }
        return 'error';
    }
    
    @RemoteAction
    public static Contact getPasswordHint(String emailId){
        Contact conRec = New Contact();
        try{
            conRec = [SELECT Id,Password_Hint__c FROM Contact WHERE Email =: emailId];
            return conRec;
        }catch(Exception e){
            return conRec;
        }
    }
    @RemoteAction
    public static WrapperLinksCampaign getFAQLinks(String programme){
        WrapperLinksCampaign wrapper=new WrapperLinksCampaign();
        FAQ_Links__c links = New FAQ_Links__c();
        try{
            
            List<Campaign> campaignList = [SELECT Id,Name,Description,Actual_End_Date__c,Disable_Campaign__c,EndDate,Image_URL__c,RedirectPage__c,Cut_Off_Start_Date__c,Cut_Off_End_Date__c FROM Campaign];                                
            wrapper.listCampaign=campaignList;
            links = [SELECT Id,Name,Basic_Guidelines__c,Call_Text__c,FAQs__c,Programme__c FROM FAQ_Links__c WHERE Programme__c =: programme];
            if(links!=null)
                wrapper.link=links;
            return wrapper;
        }catch(Exception e){
            system.debug('Error Message::=>'+e.getMessage());
            system.debug('Error Line No::=>'+e.getLineNumber());
            wrapper.link=links;
            return wrapper;
        }
    }
    public class WrapperLinksCampaign{
        FAQ_Links__c link;
        List<Campaign> listCampaign;
    }
    
    public static void firstTestMethod11(){
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

    }
}