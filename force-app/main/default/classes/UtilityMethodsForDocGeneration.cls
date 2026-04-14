public class UtilityMethodsForDocGeneration {
    
    @AuraEnabled
    public static list<Contact> getRelatedList(Id recordId)
    {
        List<Contact> Conlist = [Select id,name,firstname,lastname,Email,Phone,Fellowship_Duration__c from Contact where Proposals__c=: recordId ];
        return Conlist;
    }

    @AuraEnabled
    public static String getFellowshipType(String proID){
        try{
            System.debug('pecfarAwardlessthenTwo Called');
            DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proID,'Pecfar Award less then two');
            
            return 'success';
        }catch(Exception e){
            return e.getMessage()+e.getLineNumber();
        }
    }

	@AuraEnabled
    public static String getFellowshipTypetwoplustwo(String proID){
        try{
            System.debug('Two plus two award letter');
            DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proID,'Two plus two award letter');
            
            return 'success';
        }catch(Exception e){
            return e.getMessage()+e.getLineNumber();
        }
    } 
    
    @AuraEnabled
    public static String getFellowshipTypeConnectPlus(String proID){
        try{
            System.debug('CONNECT PLUS SANCTION ORDER');
            DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proID,'CONNECT PLUS SANCTION ORDER');
            
            return 'success';
        }catch(Exception e){
            return e.getMessage()+e.getLineNumber();
        }
    } 
    
    @AuraEnabled
    Public Static void ifDecisionLetter2(String proID){
        // Changes Start Balaji Added the Child Query to fetch the related Contacts
        Application_Proposal__c appProposalRecord = [SELECT Id,Name,RecordType.Name,(Select Id,Industrial_Fellowship_Type__c from contacts__r) From Application_Proposal__c WHERE Id =: proID];
        system.debug('Industrial Fellowship Type Balajai==> '+appProposalRecord.contacts__r[0].Industrial_Fellowship_Type__c);
        if(appProposalRecord.RecordType.Name == 'Industrial Fellowship'){
            // Changes Start Balaji Added the condition based on Industrial Fellowship Type 
            if(appProposalRecord.contacts__r[0].Industrial_Fellowship_Type__c=='PIEF'){
                DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proID,'IF DECISOIN PIEF');
            }else{
                DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proID,'IF Decision Letter');
            }
            // Changes End Balaji Added the condition based on Industrial Fellowship Type
        }
        else if(appProposalRecord.RecordType.Name == 'PECFAR'){
            DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proID,'Pecfar Decision letter'); 
        }
        else if(appProposalRecord.RecordType.Name == 'Two Plus Two'){
            DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proID,'Two Plus Two Decision Letter'); 
        }
    }
    
    @AuraEnabled
    Public Static void generateTempForAwardDraft(String proID){
        List<Application_Proposal__c> proposalList = [SELECT Id,Award_Letter_Date__c From Application_Proposal__c WHERE Id =: proID LIMIT 1];
        if(!proposalList.isEmpty()){
            if(proposalList[0].Award_Letter_Date__c == null){
                Date newDate=system.today();
                proposalList[0].Award_Letter_Date__c=newDate;
                update proposalList;
            }
        }
        
        list<contact> conList  =[select id,name,Industrial_Fellowship_Type__c from contact WHERE Proposals__c =:proID];
        system.debug('conList----'+conList);
        
        if(!conList.isEmpty()){
            for(contact cn : conList){
                if(cn.Industrial_Fellowship_Type__c =='PIEF'){
                    system.debug('Inside PIEF');
                    DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proID,'IF Award Letter PIEF');
                }else{
                    DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proID,'IF Award Letter PDIF');
                }
            }
        }
    }

    @AuraEnabled
    Public Static string generateAwardLetterOfSing(String proID){ 
        try{
            list<contact> conList  =[select id,name from contact WHERE Proposals__c =:proID];
            Application_Proposal__c proposalRecord = [SELECT Id, RecordType.Name,Grantee_Recipient__c,Country_of_Venue__c FROM Application_Proposal__c Where Id =: proID];
            system.debug('conList----'+conList);

            if(!conList.isEmpty()){
                if(proposalRecord.RecordType.Name == 'SING'){
                    DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proID,'Sing Award Letter'); 
                }else if(proposalRecord.RecordType.Name == 'Workshop'){
                    if(proposalRecord.Grantee_Recipient__c =='Indian Grant'){ //proposalRecord.Country_of_Venue__c == 'India' ||
                        DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proID,'workshop indian sanction');
                    }else{
                        DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proID,'workshop german sanction');
                    }
                }
            } 
            return 'Success';
        }catch(Exception e){
            return e.getMessage()+e.getLineNumber();
        }
    }

    @AuraEnabled
    Public Static void generateWiserAwardLetter(String proID){
        
        list<contact> conList  =[select id,name from contact WHERE Proposals__c =:proID];
        system.debug('conList----'+conList);
        
        if(!conList.isEmpty()){
            DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proID,'Wiser Draft Letter');
        }
    }
    
    @AuraEnabled
    public static string getAttachmentId(string propId){
        String attachmentid = '';
        attachmentid = [SELECT Id, Name FROM Attachment WHERE ParentID =: propId Order by LastModifiedDate desc LIMIT 1].Id;
        /*
        List<APXT_CongaSign__Transaction__c> ap = new List<APXT_CongaSign__Transaction__c>([select id,APXT_CongaSign__Status__c,Parent_a08__c from APXT_CongaSign__Transaction__c where Parent_a08__c =: propId order by lastModifieddate desc limit 1]);
        if(!ap.isEmpty()){
        //system.debug('ap===>'+ap[0].Parent_a08__c);
        if(ap[0].APXT_CongaSign__Status__c == 'COMPLETE'){
            List<ContentDocumentLink> cdl = new List<ContentDocumentLink>([SELECT Id, LinkedEntityId, ContentDocumentid,ContentDocument.createddate, ShareType, Visibility  FROM ContentDocumentLink where  LinkedEntityId  =: propId order by ContentDocument.createddate desc limit 1 ]);
            attachmentid = cdl[0].ContentDocumentid;
            
            List<ContentVersion> theFile = new List<ContentVersion>([SELECT Title, FileType, VersionData FROM ContentVersion WHERE ContentDocumentId=: attachmentid order by lastModifieddate desc limit 1]);
            String parentID = cdl[0].LinkedEntityId;
            Blob BodyData = theFile[0].VersionData;
            
            Attachment anAttachment = new Attachment();
            //anAttachment.Body = BodyData;
            anAttachment.Body = theFile[0].VersionData;
            //anAttachment.ContentType = theFile.FileType;
            anAttachment.Name = theFile[0].Title;
            anAttachment.ParentId = cdl[0].LinkedEntityId;
            anAttachment.contenttype='application/pdf';
            insert anAttachment;
            
            attachmentid = anAttachment.id;
        }
    	}
        system.debug('ap1===>'+attachmentid); */
        return attachmentid;
        //return '00P1y0000044XwZEAU';
        
        //return [SELECT Id, Name FROM Attachment WHERE ParentID =: propId Order by LastModifiedDate desc LIMIT 1].Id;
        //previous logic changed by Rutuja as it is sending last modified file id
        /*Application_Proposal__c proposalRecord = [SELECT Id, RecordType.Name, Country_of_Venue__c FROM Application_Proposal__c Where Id =: proID];
		if(proposalRecord.RecordType.Name == 'Industrial Fellowship'){
        return [SELECT Id, Name FROM Attachment WHERE ParentID =: propId Order by LastModifiedDate desc LIMIT 1].Id;
        }
        else if(proposalRecord.RecordType.Name == 'PECFAR'){
        return [SELECT Id, Name FROM Attachment WHERE ParentID =: propId Order by LastModifiedDate desc LIMIT 1].Id;
        }*/
    }
    @AuraEnabled
    public static string getAttachmentId_congasign_disbursement(string propId){
        String attachmentid = '';
        //attachmentid = [SELECT Id, Name FROM Attachment WHERE ParentID =: propId Order by LastModifiedDate desc LIMIT 1].Id;
        Disbursement_Schedule__c ds = [select id,proposals__c from Disbursement_Schedule__c where id =: propId];
        
        List<APXT_CongaSign__Transaction__c> ap = new List<APXT_CongaSign__Transaction__c>([select id,APXT_CongaSign__Status__c,Parent_a08__c from APXT_CongaSign__Transaction__c where Parent_a08__c =: ds.Proposals__c order by lastModifieddate desc limit 1]);
        //if(!ap.isEmpty()){
        //system.debug('ap===>'+ap[0].Parent_a08__c);
        if(ap[0].APXT_CongaSign__Status__c == 'COMPLETE'){
            system.debug('ap===>'+ap[0].APXT_CongaSign__Status__c);
            List<ContentDocumentLink> cdl = new List<ContentDocumentLink>([SELECT Id, LinkedEntityId, ContentDocumentid,ContentDocument.createddate, ShareType, Visibility  FROM ContentDocumentLink where  LinkedEntityId  =: ds.Proposals__c order by ContentDocument.createddate desc limit 1 ]);
            attachmentid = cdl[0].ContentDocumentid;
           //List<ContentDocumentLink> cdl = new List<ContentDocumentLink>([SELECT Id, LinkedEntityId, ContentDocumentid,ContentDocument.createddate, ShareType, Visibility  FROM ContentDocumentLink where  LinkedEntityId  =: propId order by ContentDocument.createddate desc limit 1 ]);
             
            List<ContentVersion> theFile = new List<ContentVersion>([SELECT Title, FileType, VersionData FROM ContentVersion WHERE ContentDocumentId=: attachmentid order by lastModifieddate desc limit 1]);
            String parentID = cdl[0].LinkedEntityId;
            Blob BodyData = theFile[0].VersionData;
            
            Attachment anAttachment = new Attachment();
            //anAttachment.Body = BodyData;
            anAttachment.Body = theFile[0].VersionData;
            //anAttachment.ContentType = theFile.FileType;
            anAttachment.Name = theFile[0].Title;
            anAttachment.ParentId = cdl[0].LinkedEntityId;
            anAttachment.contenttype='application/pdf';
            insert anAttachment;
            
            attachmentid = anAttachment.id;
        }
    	//}
        system.debug('ap1===>'+attachmentid); 
        return attachmentid;
        //return '00P1y0000044XwZEAU';
        
        //return [SELECT Id, Name FROM Attachment WHERE ParentID =: propId Order by LastModifiedDate desc LIMIT 1].Id;
        //previous logic changed by Rutuja as it is sending last modified file id
        /*Application_Proposal__c proposalRecord = [SELECT Id, RecordType.Name, Country_of_Venue__c FROM Application_Proposal__c Where Id =: proID];
		if(proposalRecord.RecordType.Name == 'Industrial Fellowship'){
        return [SELECT Id, Name FROM Attachment WHERE ParentID =: propId Order by LastModifiedDate desc LIMIT 1].Id;
        }
        else if(proposalRecord.RecordType.Name == 'PECFAR'){
        return [SELECT Id, Name FROM Attachment WHERE ParentID =: propId Order by LastModifiedDate desc LIMIT 1].Id;
        }*/
    }
    
    @AuraEnabled
    public static string getAttachmentId_congasign(string propId){
        String attachmentid = '';
        //attachmentid = [SELECT Id, Name FROM Attachment WHERE ParentID =: propId Order by LastModifiedDate desc LIMIT 1].Id;
        
        List<APXT_CongaSign__Transaction__c> ap = new List<APXT_CongaSign__Transaction__c>([select id,APXT_CongaSign__Status__c,Parent_a08__c from APXT_CongaSign__Transaction__c where Parent_a08__c =: propId order by lastModifieddate desc limit 1]);
        if(!ap.isEmpty()){
        //system.debug('ap===>'+ap[0].Parent_a08__c);
        if(ap[0].APXT_CongaSign__Status__c == 'COMPLETE'){
            system.debug('ap===>'+ap[0].APXT_CongaSign__Status__c);
            List<ContentDocumentLink> cdl = new List<ContentDocumentLink>([SELECT Id, LinkedEntityId, ContentDocumentid,ContentDocument.createddate, ShareType, Visibility  FROM ContentDocumentLink where  LinkedEntityId  =: propId order by ContentDocument.createddate desc limit 1 ]);
            attachmentid = cdl[0].ContentDocumentid;
            
            List<ContentVersion> theFile = new List<ContentVersion>([SELECT Title, FileType, VersionData FROM ContentVersion WHERE ContentDocumentId=: attachmentid order by lastModifieddate desc limit 1]);
            String parentID = cdl[0].LinkedEntityId;
            Blob BodyData = theFile[0].VersionData;
            
            Attachment anAttachment = new Attachment();
            //anAttachment.Body = BodyData;
            anAttachment.Body = theFile[0].VersionData;
            //anAttachment.ContentType = theFile.FileType;
            anAttachment.Name = theFile[0].Title;
            anAttachment.ParentId = cdl[0].LinkedEntityId;
            anAttachment.contenttype='application/pdf';
            insert anAttachment;
            
            attachmentid = anAttachment.id;
        }
    	}
        system.debug('ap1===>'+attachmentid); 
        return attachmentid;
        //return '00P1y0000044XwZEAU';
        
        //return [SELECT Id, Name FROM Attachment WHERE ParentID =: propId Order by LastModifiedDate desc LIMIT 1].Id;
        //previous logic changed by Rutuja as it is sending last modified file id
        /*Application_Proposal__c proposalRecord = [SELECT Id, RecordType.Name, Country_of_Venue__c FROM Application_Proposal__c Where Id =: proID];
		if(proposalRecord.RecordType.Name == 'Industrial Fellowship'){
        return [SELECT Id, Name FROM Attachment WHERE ParentID =: propId Order by LastModifiedDate desc LIMIT 1].Id;
        }
        else if(proposalRecord.RecordType.Name == 'PECFAR'){
        return [SELECT Id, Name FROM Attachment WHERE ParentID =: propId Order by LastModifiedDate desc LIMIT 1].Id;
        }*/
    }
    
    @AuraEnabled
    public static string sendProposal(string propId, string attId){
        try{
            Date todayDate  = System.today();
            List<Messaging.SingleEmailMessage> emailList = new List<Messaging.SingleEmailMessage>();
            List<Contact> conListToUpdateHashCode = New List<Contact>();
            List<Contact> conList = [Select Hashcode_Expiration_Date__c,Email,Salutation,LastName,FirstName,Name,Account_Country_Type__c,Login_Hash_Code__c,Industrial_Fellowship_Type__c,Proposals__c,Proposals__r.Date_Tentative_start_date__c,Proposals__r.Title_Of__c,AccountName__c,Proposals__r.Duration_In_Months_Max_36__c,Proposals__r.Visa_Stages__c,Proposals__r.Tentative_Start_Date__c From Contact where Proposals__c =: propId];
            Account acchost = [select id,name,proposals__c,Account_Type__c,billingcountry from account where proposals__c =: propId and Account_Type__c = 'Host Organisation' limit 1];
            for(Contact con : conList){
                
                /*commented this logic to resolve login hash code issue and added below logic
                con.Login_Hash_Code__c = Utility.generateRandomString();
                con.Hashcode_Expiration_Date__c = todayDate.addDays(3);
                */
                //logic added by rutuja
                if(String.isBlank(con.Login_Hash_Code__c)){
                con.Login_Hash_Code__c = Utility.generateRandomString();
                }
                HashcodeExpiryDate__c hashcodeNumberofDays = HashcodeExpiryDate__c.getInstance();
                Decimal test = hashcodeNumberofDays.Hashcode_Expiration_Date__c;
                if(String.isBlank(String.valueOf(con.Hashcode_Expiration_Date__c))){
                con.Hashcode_Expiration_Date__c = todayDate.addDays(Integer.valueOf(hashcodeNumberofDays.Hashcode_Expiration_Date__c));
                }
                //till here
                
                conListToUpdateHashCode.add(con); 
            }
            if(!conListToUpdateHashCode.isEmpty()){
                update conListToUpdateHashCode;
            }
            
            List<Attachment> attList = [Select Id,name,Body,ContentType from attachment where Id = :attId]; 
            Map<Id,Application_Proposal__c> appList = New Map<Id,Application_Proposal__c>(); 
            Emailtemplate emailTempRec =  [Select Id,HtmlValue,Subject from EmailTemplate where Name ='Award Letter For PDIF - IF'];
            Emailtemplate emailTempRecPIEF =  [Select Id,HtmlValue,Subject from EmailTemplate where Name ='Award Letter For PIEF - IF'];       
            
            if(!conList.isEmpty()){
                for(Contact con : conList){
                    if(con.Industrial_Fellowship_Type__c == 'PDIF'){
                        Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
                        attach.setContentType(attList[0].ContentType);
                        attach.setFileName(attList[0].Name);
                        attach.Body = attList[0].Body;
                        OrgWideEmailAddress owea = [select Id from OrgWideEmailAddress where Address = 'industrial.fellowship@igstc.org'];
                        //OrgWideEmailAddress owea = [select Id from OrgWideEmailAddress where Address = 'isha999raj@gmail.com'];
                		Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            			mail.setOrgWideEmailAddressId(owea.Id);
                        mail.setToAddresses(new String[] { con.Email});//Set To Email Address
                        mail.setSubject(emailTempRec.Subject);//Set Subject
                        string emailHtmlValue = emailTempRec.HtmlValue;
                        
                        string name = '';
                        if(!string.isBlank(conList[0].Salutation)){
                            name = conList[0].Salutation + ' ';
                        }
                        if(!string.isBlank(conList[0].LastName)){
                            name = name + conList[0].LastName;
                        }
                        
                        if(!string.isBlank(conList[0].FirstName)){
                            emailHtmlValue = emailHtmlValue.replace('{!Contact.FirstName}', name);
                        }
                        if(!string.isBlank(conList[0].Login_Hash_Code__c)){
                            emailHtmlValue = emailHtmlValue.replace('{!Contact.Login_Hash_Code__c}', conList[0].Login_Hash_Code__c);
                        }
                        if(!string.isBlank(conList[0].Proposals__r.Title_Of__c)){
                            emailHtmlValue = emailHtmlValue.replace('{!Application_Proposal__c.Title_Of__c}', conList[0].Proposals__r.Title_Of__c);
                        }
                        if(!string.isBlank(conList[0].AccountName__c)){
                            emailHtmlValue = emailHtmlValue.replace('{!Contact.AccountName__c}', acchost.name);
                        }
                        if(conList[0].Proposals__r.Duration_In_Months_Max_36__c != null){
                            emailHtmlValue = emailHtmlValue.replace('{!Application_Proposal__c.Duration_In_Months_Max_36__c}', string.valueOf(conList[0].Proposals__r.Duration_In_Months_Max_36__c));
                        }
                        
                        if(!string.isBlank(conList[0].Account_Country_Type__c)){
                            emailHtmlValue = emailHtmlValue.replace('{!Contact.Account_Country_Type__c}', acchost.billingcountry);
                        }
                        if(conList[0].Proposals__r.Tentative_Start_Date__c != null){
                            emailHtmlValue = emailHtmlValue.replace('{!Application_Proposal__c.Tentative_Start_Date__c}', conList[0].Proposals__r.Date_Tentative_start_date__c);
                        }
                        mail.setHtmlBody(emailHtmlValue);//Set HTML Body
                        // **************commented as conga documents are not ready **************//
                        mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attach });//Set File Attachment
                        // // **************commented as conga documents are not ready **************//
                        EmailMessage emailMessageRecToBeInserted = New EmailMessage();
                        emailMessageRecToBeInserted.MessageDate = System.now();
                        emailMessageRecToBeInserted.Status = '3';
                        emailMessageRecToBeInserted.Subject = emailTempRec.Subject;
                        emailMessageRecToBeInserted.ToAddress = con.Email;
                        emailMessageRecToBeInserted.Contact__c = con.Id;
                        system.debug('emailMessageRecToBeInserted ==> '+emailMessageRecToBeInserted);
                        insert emailMessageRecToBeInserted;
                        if(conList[0].Proposals__r.Visa_Stages__c == 'Approved'){
                            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
                            Application_Proposal__c app = New Application_Proposal__c();
                            app.Id = conList[0].Proposals__c;
                            app.Undertaking_Status__c = 'Sent';
                            appList.put(app.Id,app);
                            update appList.values();
                        }
                        

                    }
                    else{
                        Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
                        attach.setContentType(attList[0].ContentType);
                        attach.setFileName(attList[0].Name);
                        attach.Body = attList[0].Body;
                        
                        OrgWideEmailAddress owea = [select Id from OrgWideEmailAddress where Address = 'industrial.fellowship@igstc.org'];
                        //OrgWideEmailAddress owea = [select Id from OrgWideEmailAddress where Address = 'isha999raj@gmail.com'];
                		Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            			mail.setOrgWideEmailAddressId(owea.Id);
                        mail.setToAddresses(new String[] { con.Email});//Set To Email Address
                        
                        string emailHtmlValue = emailTempRecPIEF.HtmlValue;

                        if(!string.isBlank(conList[0].FirstName)){
                            emailHtmlValue = emailHtmlValue.replace('{!Contact.FirstName}', conList[0].Salutation + ' ' + conList[0].LastName);
                            mail.setSubject(emailTempRecPIEF.Subject + ' - ' + conList[0].FirstName);//Set Subject
                        }
                        if(!string.isBlank(conList[0].Login_Hash_Code__c)){
                            emailHtmlValue = emailHtmlValue.replace('{!Contact.Login_Hash_Code__c}', conList[0].Login_Hash_Code__c);
                        }
                        if(!string.isBlank(conList[0].Account_Country_Type__c)){
                            emailHtmlValue = emailHtmlValue.replace('{!Contact.Account_Country_Type__c}', acchost.billingcountry);
                        }
                        if(!string.isBlank(conList[0].Proposals__r.Title_Of__c)){
                            emailHtmlValue = emailHtmlValue.replace('{!Application_Proposal__c.Title_Of__c}', conList[0].Proposals__r.Title_Of__c);
                        }
                        if(!string.isBlank(conList[0].AccountName__c)){
                            emailHtmlValue = emailHtmlValue.replace('{!Contact.AccountName__c}', acchost.Name);
                        }
                        if(conList[0].Proposals__r.Duration_In_Months_Max_36__c != null){
                            emailHtmlValue = emailHtmlValue.replace('{!Application_Proposal__c.Duration_In_Months_Max_36__c}', string.valueOf(conList[0].Proposals__r.Duration_In_Months_Max_36__c));
                        }
                        if(conList[0].Proposals__r.Tentative_Start_Date__c != null){
                            emailHtmlValue = emailHtmlValue.replace('{!Application_Proposal__c.Tentative_Start_Date__c}', conList[0].Proposals__r.Date_Tentative_start_date__c);
                        }
                        mail.setHtmlBody(emailHtmlValue);//Set HTML Body
                        // ************** commented as conga documents are not ready **************//
                        mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attach });//Set File Attachment
                        // // **************commented as conga documents are not ready **************//
                        EmailMessage emailMessageRecToBeInserted = New EmailMessage();
                        emailMessageRecToBeInserted.MessageDate = System.now();
                        emailMessageRecToBeInserted.Status = '3';
                        emailMessageRecToBeInserted.Subject = emailTempRecPIEF.Subject;
                        emailMessageRecToBeInserted.ToAddress = con.Email;
                        emailMessageRecToBeInserted.Contact__c = con.Id;
                        system.debug('emailMessageRecToBeInserted ==> '+emailMessageRecToBeInserted);
                        insert emailMessageRecToBeInserted;
                        if(conList[0].Proposals__r.Visa_Stages__c == 'Approved'){
                            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
                            Application_Proposal__c app = New Application_Proposal__c();
                            app.Id = conList[0].Proposals__c;
                            app.Undertaking_Status__c = 'Sent';
                            appList.put(app.Id,app);
                            update appList.values();
                        }
                    }
                    
                }
            }
            return conList[0].Proposals__r.Visa_Stages__c;
            
        }catch(Exception e){
            System.debug('The following exception has occurred: ' + e.getMessage());
            System.debug('The following exception has occurred: ' + e.getLineNumber());
            return e.getMessage()+e.getLineNumber();
            // system.debug(e.getMessage()+e.getLineNumber());
        } 
    }
    
    @AuraEnabled
    public static string sendProposalDecision(string propId, string attId){
        try{
            Date todayDate  = System.today();
                string returnValue;
                List<Application_Proposal__c> appList = New List<Application_Proposal__c>();
                List<Contact> conListToUpdateHashcode = New List<Contact>();
            List<Contact> conList1 = [SELECT Id,Hashcode_Expiration_Date__c,Name,FirstName,LastName,Campaign__c,ApplicationId__c,Proposals__r.Tentative_Start_Date__c,Proposals__r.Duration_In_Months_Max_36__c,Proposals__r.Travel_Form_Status__c,Proposals__r.RecordType.DeveloperName,Proposals__r.Invitation_Letter_Form_Status__c,Login_Hash_Code__c FROM Contact WHERE Proposals__c =: propId];
            system.debug('old Hashcode --> '+conList1[0].Login_Hash_Code__c);
                /*Updating Hashcode */
                for(Contact conRec : conList1){
                    /*commented this logic to resolve login hash code issue and added below logic
					  con.Login_Hash_Code__c = Utility.generateRandomString();
					  con.Hashcode_Expiration_Date__c = todayDate.addDays(3);
					*/
                    //logic added by rutuja
                    if(String.isBlank(conRec.Login_Hash_Code__c)){
                        conRec.Login_Hash_Code__c = Utility.generateRandomString();
                    }
                    HashcodeExpiryDate__c hashcodeNumberofDays = HashcodeExpiryDate__c.getInstance();
                    Decimal test = hashcodeNumberofDays.Hashcode_Expiration_Date__c;
                    if(String.isBlank(String.valueOf(conRec.Hashcode_Expiration_Date__c))){
                        conRec.Hashcode_Expiration_Date__c = todayDate.addDays(Integer.valueOf(hashcodeNumberofDays.Hashcode_Expiration_Date__c));
                    }
                    //till here
                    
                    conListToUpdateHashcode.add(conRec);
                }
                if(!conListToUpdateHashcode.isEmpty()){
                    update conListToUpdateHashcode;
                }

            //Email not triggering for 2nd contact - pecfar - logic added by Rutuja
            List<Contact> conList = [SELECT Id,Name,Salutation,Email,FirstName,LastName,Campaign__c,ApplicationId__c,Proposals__r.Tentative_Start_Date__c,Proposals__r.Duration_In_Months_Max_36__c,Proposals__r.Travel_Form_Status__c,Proposals__r.RecordType.DeveloperName,Proposals__r.Invitation_Letter_Form_Status__c,Login_Hash_Code__c FROM Contact WHERE Proposals__c =: propId];
            List<String> contactEmailList = new List<String>();
            String contactEmail;
            if(conList[0].Proposals__r.RecordType.DeveloperName == 'Industrial_Fellowships'){
                contactEmail = [Select Email From Contact where Proposals__c =: propId and Is_Primary__c = true].Email;
                contactEmailList.add(contactEmail);
            }
            else if(conList[0].Proposals__r.RecordType.DeveloperName == 'PECFAR'){
                for(Contact con : conList){
                    contactEmailList.add(con.Email);
                }
            }
            
            	
            
                List<String> attachmentsListToBeReturned = new List<String>();
                List<EmailMessage> listOfEmailMesToInsert = New List<EmailMessage>();  
                Emailtemplate emailTempRec = New Emailtemplate();
                List<Attachment> attList = [Select Id,name,Body,ContentType from attachment where parentId = :propId order by createdDate DESC];
                system.debug('attList --> '+attList[0].Id);
                if(conList[0].Proposals__r.RecordType.DeveloperName == 'Industrial_Fellowships'){
                    emailTempRec = [Select Id,HtmlValue,Subject from EmailTemplate where Name ='Decision Letter - IF'];
                }else if(conList[0].Proposals__r.RecordType.DeveloperName == 'PECFAR'){
                    emailTempRec = [Select Id,HtmlValue,Subject from EmailTemplate where Name ='Decision Mail - PECFAR'];
                }

                Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
                attach.setContentType(attList[0].ContentType);
                attach.setFileName(attList[0].Name);
                attach.Body = attList[0].Body;
            	OrgWideEmailAddress owea = [select Id from OrgWideEmailAddress where Address = 'industrial.fellowship@igstc.org'];
            	//OrgWideEmailAddress owea = [select Id from OrgWideEmailAddress where Address = 'isha999raj@gmail.com'];
            	Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            	mail.setOrgWideEmailAddressId(owea.Id);
                mail.setToAddresses( contactEmailList);//Set To Email Address
                mail.setSubject(emailTempRec.Subject);//Set Subject
            string emailHtmlValue = emailTempRec.HtmlValue;
            
            string name = '';
            if(!string.isBlank(conList[0].Salutation)){
                name = conList[0].Salutation + ' ';
            }
            if(!string.isBlank(conList[0].LastName)){
                name = name + conList[0].LastName;
            }
            if(!string.isBlank(conList[0].FirstName)){
                emailHtmlValue = emailHtmlValue.replace('{!Contact.FirstName}', name);
            }
            if(conList[0].Proposals__r.Tentative_Start_Date__c != null){
                    emailHtmlValue = emailHtmlValue.replace('{!Application_Proposal__c.Tentative_Start_Date__c}', string.valueOf(conList[0].Proposals__r.Tentative_Start_Date__c));
                }
                if(conList[0].Proposals__r.Duration_In_Months_Max_36__c != null){
                    emailHtmlValue = emailHtmlValue.replace('{!Application_Proposal__c.Duration_In_Months_Max_36__c}', string.valueOf(conList[0].Proposals__r.Duration_In_Months_Max_36__c));
                }
                if(!string.isBlank(conList[0].Login_Hash_Code__c)){
                    emailHtmlValue = emailHtmlValue.replace('{!Contact.Login_Hash_Code__c}', conList[0].Login_Hash_Code__c);
                }
                if(!string.isBlank(conList[0].Id)){
                    emailHtmlValue = emailHtmlValue.replace('{!Contact.Id}', conList[0].Id);
                }
                mail.setHtmlBody(emailHtmlValue);//Set HTML Body
            
                mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attach });//Set File Attachment
                if(conList[0].Proposals__r.Travel_Form_Status__c == 'Approved' && conList[0].Proposals__r.RecordType.DeveloperName == 'Industrial_Fellowships'){
                    Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
                    EmailMessage emailMessageRecToBeInserted = New EmailMessage();
                    emailMessageRecToBeInserted.MessageDate = System.now();
                    emailMessageRecToBeInserted.Status = '3';
                    emailMessageRecToBeInserted.Subject = emailTempRec.Subject;
                    emailMessageRecToBeInserted.ToAddress = contactEmail;
                    emailMessageRecToBeInserted.Contact__c = conList[0].Id;
                    system.debug('emailMessageRecToBeInserted ==> '+emailMessageRecToBeInserted);
                    insert emailMessageRecToBeInserted;
                    Application_Proposal__c app = New Application_Proposal__c();
                    app.Id = conList[0].Proposals__c;
                    app.Decision_Letter_Sent__c = true;
                    //app.Travel_Form_Status__c = 'Sent';
                    app.Visa_Stages__c = 'Sent';
                    app.Proposal_Stages__c = 'Under Visa Process';
                    appList.add(app);
                    update appList;
                    returnValue = conList[0].Proposals__r.Travel_Form_Status__c;
                    system.debug('returnValue'+returnValue);
                }
            else if(conList[0].Proposals__r.RecordType.DeveloperName == 'PECFAR'){
            		List<EmailMessage> emailListNew = new List<EmailMessage>();
                    OrgWideEmailAddress owea1 = [select Id from OrgWideEmailAddress where Address = 'pecfar@igstc.org'];
                    //OrgWideEmailAddress owea1 = [select Id from OrgWideEmailAddress where Address = 'isha999raj@gmail.com'];
            		mail.setOrgWideEmailAddressId(owea1.Id);
                    Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
                    for(Contact con1 : conList){
                    EmailMessage emailMessageRecToBeInserted = New EmailMessage();
                    emailMessageRecToBeInserted.MessageDate = System.now();
                    emailMessageRecToBeInserted.Status = '3';
                    emailMessageRecToBeInserted.Subject = emailTempRec.Subject;
                    emailMessageRecToBeInserted.ToAddress = con1.Email;
                    emailMessageRecToBeInserted.Contact__c = con1.Id;
                    system.debug('emailMessageRecToBeInserted ==> '+emailMessageRecToBeInserted);
                        emailListNew.add(emailMessageRecToBeInserted);
                    }
                    insert emailListNew;
                    Application_Proposal__c app = New Application_Proposal__c();
                    app.Id = conList[0].Proposals__c;
                    app.Decision_Letter_Sent__c = true;
                    app.Proposal_Stages__c = 'Under Award';
                    appList.add(app);
                    if(!appList.isEmpty()){
                        update appList;
                    }
                    returnValue = conList[0].Proposals__r.Invitation_Letter_Form_Status__c;
                    system.debug('returnValue'+returnValue);
                }
                 return returnValue;   
                
        }catch(Exception e){
            system.debug(e.getMessage()+e.getLineNumber());
            return e.getMessage()+e.getLineNumber();
            
        }
    }
    
    @AuraEnabled
    public static string sendProposal_decision_twoplustwo(string propId, string attId){
        try{
            List<Messaging.SingleEmailMessage> emailList = new List<Messaging.SingleEmailMessage>();
            List<Contact> contactList = [Select Email,Name,Login_Hash_Code__c,Proposals__c,proposals__r.Acronym__c From Contact where Proposals__c =: propId ]; 
            Contact primaryContact = [Select Email,Name,Login_Hash_Code__c,Proposals__c,proposals__r.Acronym__c,proposals__r.Title_Of__c From Contact where Proposals__c =: propId and Is_Primary__c = true limit 1]; 
            List<Attachment> attList = [Select Id,name,Body,ContentType from attachment where Id = :attId]; 
            List<Application_Proposal__c> appList = New List<Application_Proposal__c>();  
            List<EmailMessage> listOfEmailMesToInsert = New List<EmailMessage>();        
            
            if(!contactList.isEmpty()){
                List <String> emailRecipients = new List <String>();
                for(Contact con : contactList){
                    emailRecipients.add(con.Email);
                        }
                
                    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                    
                    mail.setToAddresses(emailRecipients);
                    mail.setSubject('IGSTC 2+2 call 2023 – Decision letter to ' + primaryContact.proposals__r.Title_Of__c + ' ' + primaryContact.proposals__r.Acronym__c );
                    String emailBody = 'Dear ' + primaryContact.proposals__r.Acronym__c + 'Team,' ;
                    emailBody += ' <br> <br> Greetings from IGSTC. <br> ';
                    emailBody += ' Thank you for submitting the second stage proposal.  <br> ';
                    emailBody += ' Kindly note that based on the scientific evaluation your proposal has been selected for funding support under 2+2 Call 2023'+  +'  <br> ';
                    emailBody += ' Please find the attached decision letter for your reference. <br><br>';
                    emailBody += 'Best regards,  <br> IGSTC Grants Team <br> Grants Management  <br> IGSTC <br> Indo-German Science & Technology Centre <br> Ground Floor, Block-II, Technology Bhavan, <br> New Mehrauli Road, New Delhi-110016 <br> Tel: + 91- 011 -2654 3500 <br> E-mail: info.igstc@igstc.org <br> Homepage: www.igstc.org <br>';
                    mail.setHtmlBody(emailBody);//Set HTML Body
                    Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
                    if(!attList.isEMpty()){
                        attach.setContentType(attList[0].ContentType);
                        attach.setFileName(attList[0].Name);
                        attach.Body = attList[0].Body;
                        mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attach });
                    }
                    emailList.add(mail);

                    EmailMessage emailMessageRecToBeInserted = New EmailMessage();
                    emailMessageRecToBeInserted.MessageDate = System.now();
                    emailMessageRecToBeInserted.Status = '3';
                    emailMessageRecToBeInserted.Subject = 'Order Letter to all contacts';
                    emailMessageRecToBeInserted.ToAddress = primaryContact.Email;
                    emailMessageRecToBeInserted.Contact__c = primaryContact.Id;
                    system.debug('emailMessageRecToBeInserted ==> '+emailMessageRecToBeInserted);
                    listOfEmailMesToInsert.add(emailMessageRecToBeInserted);
                
                if(!emailList.isEmpty()){
                    Messaging.sendEmail(emailList);
                }
                if(!listOfEmailMesToInsert.isEmpty()){
                    insert listOfEmailMesToInsert;
                }
                Application_Proposal__c app = New Application_Proposal__c();
                app.Id = contactList[0].Proposals__c;
                app.Undertaking_Status__c = 'Sent';
                appList.add(app);
                system.debug('appList ----> '+appList);
                update appList;
            }
           return 'Approved'; 
        }catch(Exception e){
            system.debug(e.getMessage()+e.getLineNumber());
            return e.getMessage()+e.getLineNumber();
        } 
    }

    
     @AuraEnabled
    public static void sendProposal3(string propId, string attId){
        try{
            List<Messaging.SingleEmailMessage> emailList = new List<Messaging.SingleEmailMessage>();
            List<Contact> contactList = [Select Email,Name,Login_Hash_Code__c,Proposals__c,proposals__r.Acronym__c From Contact where Proposals__c =: propId AND Account_Country_Type__c = 'India']; 
            List<Attachment> attList = [Select Id,name,Body,ContentType from attachment where Id = :attId]; 
            List<Application_Proposal__c> appList = New List<Application_Proposal__c>();  
            List<EmailMessage> listOfEmailMesToInsert = New List<EmailMessage>();        
            
            if(!contactList.isEmpty()){
                for(Contact con : contactList){
                    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                    List <String> emailRecipients = new List <String>{con.Email};
                    mail.setToAddresses(emailRecipients);
                    mail.setSubject('IGSTC 2+2 project – ' + con.proposals__r.Acronym__c + ' : Award Letter & Disbursement of 1st Year grants');
                    String emailBody = 'Dear ' + con.proposals__r.Acronym__c + 'Team,' ;
                    emailBody += ' <br> <br> Please find the attached Award Letter and Terms & Conditions of the Grant (Annexure II) for the IGSTC project. ' +con.proposals__r.Acronym__c  + 'The grant is being released shortly. <br> <br>';
                    emailBody += ' <br> <br> Kindly acknowledge the receipt of the Award Letter and grants. <br> <br><br>';
                    emailBody += 'With regards, <br> Rupak <br><br>Dr. Rupak Bhattacharya<br>Senior Scientific Officer <br> IGSTC <br> Indo-German Science & Technology Centre <br> Ground Floor, Block-II, Technology Bhavan, <br> New Mehrauli Road, New Delhi-110016 <br> Tel: +91-011-26543504 <br> E-mail: rupak.bhattacharya@igstc.org <br> Homepage: www.igstc.org <br>';
                    mail.setHtmlBody(emailBody);//Set HTML Body
                    Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
                    if(!attList.isEMpty()){
                        attach.setContentType(attList[0].ContentType);
                        attach.setFileName(attList[0].Name);
                        attach.Body = attList[0].Body;
                        mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attach });
                    }
                    emailList.add(mail);

                    EmailMessage emailMessageRecToBeInserted = New EmailMessage();
                    emailMessageRecToBeInserted.MessageDate = System.now();
                    emailMessageRecToBeInserted.Status = '3';
                    emailMessageRecToBeInserted.Subject = 'Award Letter';
                    emailMessageRecToBeInserted.ToAddress = con.Email;
                    emailMessageRecToBeInserted.Contact__c = con.Id;
                    system.debug('emailMessageRecToBeInserted ==> '+emailMessageRecToBeInserted);
                    listOfEmailMesToInsert.add(emailMessageRecToBeInserted);
                }
                if(!emailList.isEmpty()){
                    Messaging.sendEmail(emailList);
                }
                if(!listOfEmailMesToInsert.isEmpty()){
                    insert listOfEmailMesToInsert;
                }
                Application_Proposal__c app = New Application_Proposal__c();
                app.Id = contactList[0].Proposals__c;
                app.Undertaking_Status__c = 'Sent';
                appList.add(app);
                system.debug('appList ----> '+appList);
                update appList;
            }
            
        }catch(Exception e){
            system.debug(e.getMessage()+e.getLineNumber());
        } 
    }

     @AuraEnabled
    public static void sendProposal3_year2or3_conga(string propId, string attId){
        try{
            List<Messaging.SingleEmailMessage> emailList = new List<Messaging.SingleEmailMessage>();
            List<Contact> contactList = [Select Email,Name,Login_Hash_Code__c,Proposals__c,proposals__r.Acronym__c From Contact where Proposals__c =: propId ]; 
            List<Attachment> attList = [Select Id,name,Body,ContentType from attachment where Id = :attId]; 
            List<Application_Proposal__c> appList = New List<Application_Proposal__c>();  
            List<EmailMessage> listOfEmailMesToInsert = New List<EmailMessage>();        
            
            if(!contactList.isEmpty()){
                for(Contact con : contactList){
                    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                    List <String> emailRecipients = new List <String>{con.Email};
                    mail.setToAddresses(emailRecipients);
                    mail.setSubject('IGSTC 2+2 project – ' + con.proposals__r.Acronym__c + ' : Order');
                    String emailBody = 'Dear ' + con.proposals__r.Acronym__c + ' Team,' ;
                    //emailBody += ' <br> <br> Please find the attached Award Letter and Terms & Conditions of the Grant (Annexure II) for the IGSTC project. ' +con.proposals__r.Acronym__c  + 'The grant is being released shortly. <br> <br>';
                    emailBody += ' <br> <br> Test <br> <br><br>';
                    emailBody += 'With regards, <br> Rupak <br><br>Dr. Rupak Bhattacharya<br>Senior Scientific Officer <br> IGSTC <br> Indo-German Science & Technology Centre <br> Ground Floor, Block-II, Technology Bhavan, <br> New Mehrauli Road, New Delhi-110016 <br> Tel: +91-011-26543504 <br> E-mail: rupak.bhattacharya@igstc.org <br> Homepage: www.igstc.org <br>';
                    mail.setHtmlBody(emailBody);//Set HTML Body
                    Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
                    if(!attList.isEMpty()){
                        attach.setContentType(attList[0].ContentType);
                        attach.setFileName(attList[0].Name);
                        attach.Body = attList[0].Body;
                        mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attach });
                    }
                    emailList.add(mail);

                    EmailMessage emailMessageRecToBeInserted = New EmailMessage();
                    emailMessageRecToBeInserted.MessageDate = System.now();
                    emailMessageRecToBeInserted.Status = '3';
                    emailMessageRecToBeInserted.Subject = 'Order Letter';
                    emailMessageRecToBeInserted.ToAddress = con.Email;
                    emailMessageRecToBeInserted.Contact__c = con.Id;
                    system.debug('emailMessageRecToBeInserted ==> '+emailMessageRecToBeInserted);
                    listOfEmailMesToInsert.add(emailMessageRecToBeInserted);
                }
                if(!emailList.isEmpty()){
                    Messaging.sendEmail(emailList);
                }
                if(!listOfEmailMesToInsert.isEmpty()){
                    insert listOfEmailMesToInsert;
                }
                Application_Proposal__c app = New Application_Proposal__c();
                app.Id = contactList[0].Proposals__c;
                app.Undertaking_Status__c = 'Sent';
                appList.add(app);
                system.debug('appList ----> '+appList);
                update appList;
            }
            
        }catch(Exception e){
            system.debug(e.getMessage()+e.getLineNumber());
        } 
    }

     @AuraEnabled
    public static void sendProposal4(string propId, string attId){
        try{
            List<Messaging.SingleEmailMessage> emailList = new List<Messaging.SingleEmailMessage>();
            List<Contact> contactList = [Select Salutation,proposals__r.Title_Of__c,account.Name,LastName,Email,Name,Login_Hash_Code__c,Proposals__c From Contact where Proposals__c =: propId]; 
            List<Attachment> attList = [Select Id,name,Body,ContentType from attachment where Id = :attId]; 
            List<Application_Proposal__c> appList = New List<Application_Proposal__c>();  
            List<EmailMessage> listOfEmailMesToInsert = New List<EmailMessage>();        
            
            if(!contactList.isEmpty()){
                for(Contact con : contactList){
                    OrgWideEmailAddress owea = [select Id from OrgWideEmailAddress where Address = 'info.igstc@igstc.org'];
                    //OrgWideEmailAddress owea = [select Id from OrgWideEmailAddress where Address = 'isha999raj@gmail.com'];
                    
                		Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            			mail.setOrgWideEmailAddressId(owea.Id);
                    List <String> emailRecipients = new List <String>{con.Email};
                    mail.setToAddresses(emailRecipients);
                    mail.setSubject('IGSTC-CONNECT Plus - release of Sanction Order to ' + con.Salutation + ' ' +  con.LastName);
                    String emailBody = 'Dear ' + con.Salutation + ' ' + con.LastName + ',' ;
                    emailBody += ' <br> <br> Please find the enclosed Order for grant related to IGSTC-CONNECT Plus programme. The grant will be released to ' + con.account.Name + 'upon receiving of following documents. <br> <br>';
                    emailBody += '	1. Original Air ticket along with boarding passes. <br> <br>';
                    emailBody += '	2. SE/UC from ' + con.account.Name + 'in the attached format. <br> <br>';
                    emailBody += '	3. Visit report along with 3-4 representative high-resolution photographs in the attached format. <br> <br>';
                    emailBody += 'Kindly acknowledge the receipt of this letter.  <br> <br>';
                    emailBody += 'Best regards,  <br> IGSTC Grants Team <br> Grants Management  <br> IGSTC <br> Indo-German Science & Technology Centre <br> Ground Floor, Block-II, Technology Bhavan, <br> New Mehrauli Road, New Delhi-110016 <br> Tel: + 91- 011 -2654 3509 <br> E-mail: info.igstc@igstc.org <br> Homepage: www.igstc.org <br>';
                    mail.setHtmlBody(emailBody);//Set HTML Body
                    Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
                    if(!attList.isEMpty()){
                        attach.setContentType(attList[0].ContentType);
                        attach.setFileName(attList[0].Name);
                        attach.Body = attList[0].Body;
                        mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attach });
                    }
                    emailList.add(mail);

                    EmailMessage emailMessageRecToBeInserted = New EmailMessage();
                    emailMessageRecToBeInserted.MessageDate = System.now();
                    emailMessageRecToBeInserted.Status = '3';
                    emailMessageRecToBeInserted.Subject = 'Award Letter';
                    emailMessageRecToBeInserted.ToAddress = con.Email;
                    emailMessageRecToBeInserted.Contact__c = con.Id;
                    system.debug('emailMessageRecToBeInserted ==> '+emailMessageRecToBeInserted);
                    listOfEmailMesToInsert.add(emailMessageRecToBeInserted);
                }
                if(!emailList.isEmpty()){
                    Messaging.sendEmail(emailList);
                }
                if(!listOfEmailMesToInsert.isEmpty()){
                    insert listOfEmailMesToInsert;
                }
                Application_Proposal__c app = New Application_Proposal__c();
                app.Id = contactList[0].Proposals__c;
                app.Undertaking_Status__c = 'Sent';
                appList.add(app);
                system.debug('appList ----> '+appList);
                update appList;
            }
            
        }catch(Exception e){
            system.debug(e.getMessage()+e.getLineNumber());
        } 
    }

    @AuraEnabled
    public static void sendProposaldisbursement(string propId, string attId){
        try{
            List<Messaging.SingleEmailMessage> emailList = new List<Messaging.SingleEmailMessage>();
            Disbursement_Schedule__c ds = [select id,Contact__r.Email,Contact__r.Salutation,Contact__r.LastName,proposals__c,Tranche__c from Disbursement_Schedule__c where id =: propId];
            Application_Proposal__c propData = [Select id , RecordTypeId,RecordType.Name,IF_tranche__c from Application_Proposal__c where id = : ds.proposals__c];
            List<Contact> contactList = [Select Salutation,LastName,Email,Name,Login_Hash_Code__c,Proposals__c From Contact where Proposals__c =: ds.proposals__c]; 
            List<Attachment> attList = [Select Id,name,Body,ContentType from attachment where Id = :attId]; 
            List<Application_Proposal__c> appList = New List<Application_Proposal__c>();  
            List<EmailMessage> listOfEmailMesToInsert = New List<EmailMessage>();        
            string name = '';
                        if(!string.isBlank(ds.Contact__r.Salutation)){
                            name = ds.Contact__r.Salutation + ' ';
                        }
                        if(!string.isBlank(ds.Contact__r.LastName)){
                            name = name + ds.Contact__r.LastName;
                        }
            if(!contactList.isEmpty()){
               // for(Contact con : contactList){
                    OrgWideEmailAddress owea = [select Id from OrgWideEmailAddress where Address = 'pecfar@igstc.org'];
                    //OrgWideEmailAddress owea = [select Id from OrgWideEmailAddress where Address = 'isha999raj@gmail.com'];
                		Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            			mail.setOrgWideEmailAddressId(owea.Id);
                    List <String> emailRecipients = new List <String>{ds.Contact__r.Email};
                    mail.setToAddresses(emailRecipients);
                    mail.setSubject(' IGSTC PECFAR 2023 – Tranche ' + ds.Tranche__c + ' release order - ' + ds.Contact__r.Salutation  + ' ' + ds.Contact__r.Lastname);
                    
                    
                    
                    String emailBody = 'Dear ' + name + ',' ;
                    emailBody += ' <br> <br> Please find attached the Release order for your tranche '+ ds.Tranche__c + ' of the IGSTC PECFAR 2023.  <br> <br>';
                    emailBody += '<br><br> Kind regards,  <br> IGSTC Grants Team <br> Grants Management  <br> IGSTC <br> Indo-German Science & Technology Centre <br> Ground Floor, Block-II, Technology Bhavan, <br> New Mehrauli Road, New Delhi-110016 <br> Tel: + 91- 011 -2654 3509 <br> E-mail: pecfar@igstc.org <br> Homepage: www.igstc.org <br>';
                    mail.setHtmlBody(emailBody);//Set HTML Body
                    Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
                    if(!attList.isEMpty()){
                        attach.setContentType(attList[0].ContentType);
                        attach.setFileName(attList[0].Name);
                        attach.Body = attList[0].Body;
                        mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attach });
                    }
                    emailList.add(mail);

                    EmailMessage emailMessageRecToBeInserted = New EmailMessage();
                    emailMessageRecToBeInserted.MessageDate = System.now();
                    emailMessageRecToBeInserted.Status = '3';
                    emailMessageRecToBeInserted.Subject = 'Tranche Letter';
                    emailMessageRecToBeInserted.ToAddress = ds.Contact__r.Email;
                    emailMessageRecToBeInserted.Contact__c = ds.Contact__r.Id;
                    system.debug('emailMessageRecToBeInserted ==> '+emailMessageRecToBeInserted);
                    listOfEmailMesToInsert.add(emailMessageRecToBeInserted);
                //}
                if(!emailList.isEmpty()){
                    Messaging.sendEmail(emailList);
                }
                if(!listOfEmailMesToInsert.isEmpty()){
                    insert listOfEmailMesToInsert;
                }
                Application_Proposal__c app = New Application_Proposal__c();
                app.Id = contactList[0].Proposals__c;
                app.Undertaking_Status__c = 'Sent';
                appList.add(app);
                system.debug('appList ----> '+appList);
                update appList;
            }
            
        }catch(Exception e){
            system.debug(e.getMessage()+e.getLineNumber());
        } 
    }

    
    @AuraEnabled
    public static void sendProposal2(string propId, string attId){
        try{
            List<Messaging.SingleEmailMessage> emailList = new List<Messaging.SingleEmailMessage>();
            List<Contact> contactList = [Select Salutation,LastName,Email,Name,Login_Hash_Code__c,Proposals__c From Contact where Proposals__c =: propId]; 
            List<Attachment> attList = [Select Id,name,Body,ContentType from attachment where Id = :attId]; 
            List<Application_Proposal__c> appList = New List<Application_Proposal__c>();  
            List<EmailMessage> listOfEmailMesToInsert = New List<EmailMessage>();        
            
            if(!contactList.isEmpty()){
                for(Contact con : contactList){
                    OrgWideEmailAddress owea = [select Id from OrgWideEmailAddress where Address = 'pecfar@igstc.org'];
                    //OrgWideEmailAddress owea = [select Id from OrgWideEmailAddress where Address = 'isha999raj@gmail.com'];
                		Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            			mail.setOrgWideEmailAddressId(owea.Id);
                    List <String> emailRecipients = new List <String>{con.Email};
                    mail.setToAddresses(emailRecipients);
                    mail.setSubject(' IGSTC PECFAR – Award Letter');
                    
                    string name = '';
                        if(!string.isBlank(con.Salutation)){
                            name = con.Salutation + ' ';
                        }
                        if(!string.isBlank(con.LastName)){
                            name = name + con.LastName;
                        }
                    
                    String emailBody = 'Dear ' + name + ',' ;
                    emailBody += ' <br> <br> Greetings from the Indo-German Science & Technology Centre (IGSTC).  <br> <br>';
                    emailBody += ' <br> Please find the attached Award Letter for “Paired Early Career Research Fellowship in Applied Research (PECFAR)” to undertake research and networking visit to your host institutions.  <br> <br>';
                    emailBody += ' <br> Kindly submit the following documents for the release of grants. The formats can be downloaded from <a href="https://www.igstc.org/home/PECFAR_forms">' + 'here'+ '</a> <br> <br>';
                    emailBody += 'For Indian awardee: <br>';
                    emailBody += ' • A duly filled & signed Undertaking notarised on a Rs 100/- stamp paper by the Indian parent institution. Please upload the scan copy using the below link and send us the original hard copy (by post) to <b>IGSTC Secretariat, New Delhi. </b> <br><br>';
                    emailBody += '<br>For German awardee: <br>';
                    emailBody += ' • A duly filled and signed Undertaking and signed Euro Remittance Invoice by the German parent institution. Please upload the scan copy using the below link and send us the original hard copy (by post) to the <b>German Project Office,IGSTC </b>(z.H. Dörte Merk, Deutsches Zentrum für Luft- und Raumfahrt e. V. (DLR), Projektträger, Europäische und Internationale Zusammenarbeit, Heinrich-Konen-Straße 1, 53227 Bonn). <br><br>';
                    emailBody += '<br>The link for uploading signed document:  <br>';
                    emailBody += '<a href="https://indo-germansciencetechnologycentre.my.salesforce-sites.com/ApplicantDashboard/ApplicantPortal?id=' + con.Login_Hash_Code__c+ '&campaign=pecfar#/PECFARDocUpload ">' + 'Click here'+ '</a><br><br>' ;
                    //emailBody += '<a href="https://indo-germansciencetechnologycentre.my.salesforce-sites.com/ApplicantDashboard/ApplicantPortal?id=' + con.Login_Hash_Code__c+ '&campaign=pecfar#/PECFARDocUpload ">' + 'Click here'+ '</a><br><br>' ;
                    emailBody += '<br>Kindly acknowledge the receipt of the Award Letter along with the acceptance of the conditions. IGSTC will release the grants upon receipt of the requested documents. <br>';
                    emailBody += '<br> In case of any queries, feel free to contact us. ';
                    emailBody += '<br><br> Best regards,  <br> IGSTC Grants Team <br> Grants Management  <br> IGSTC <br> Indo-German Science & Technology Centre <br> Ground Floor, Block-II, Technology Bhavan, <br> New Mehrauli Road, New Delhi-110016 <br> Tel: + 91- 011 -2654 3509 <br> E-mail: pecfar@igstc.org <br> Homepage: www.igstc.org <br>';
                    mail.setHtmlBody(emailBody);//Set HTML Body
                    Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
                    if(!attList.isEMpty()){
                        attach.setContentType(attList[0].ContentType);
                        attach.setFileName(attList[0].Name);
                        attach.Body = attList[0].Body;
                        mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attach });
                    }
                    emailList.add(mail);

                    EmailMessage emailMessageRecToBeInserted = New EmailMessage();
                    emailMessageRecToBeInserted.MessageDate = System.now();
                    emailMessageRecToBeInserted.Status = '3';
                    emailMessageRecToBeInserted.Subject = 'Award Letter';
                    emailMessageRecToBeInserted.ToAddress = con.Email;
                    emailMessageRecToBeInserted.Contact__c = con.Id;
                    system.debug('emailMessageRecToBeInserted ==> '+emailMessageRecToBeInserted);
                    listOfEmailMesToInsert.add(emailMessageRecToBeInserted);
                }
                if(!emailList.isEmpty()){
                    Messaging.sendEmail(emailList);
                }
                if(!listOfEmailMesToInsert.isEmpty()){
                    insert listOfEmailMesToInsert;
                }
                Application_Proposal__c app = New Application_Proposal__c();
                app.Id = contactList[0].Proposals__c;
                app.Undertaking_Status__c = 'Sent';
                appList.add(app);
                system.debug('appList ----> '+appList);
                update appList;
            }
            
        }catch(Exception e){
            system.debug(e.getMessage()+e.getLineNumber());
        } 
    }

    @AuraEnabled
    public static void sendProposalAwardWiser(string propId, string attId){
        try{

                List<Application_Proposal__c> appList = New List<Application_Proposal__c>();
                List<Contact> conList = [SELECT Id,Name,Salutation,Email,FirstName,LastName,Campaign__c,ApplicationId__c,Proposals__r.Tentative_Start_Date__c,Proposals__r.Duration_In_Months_Max_36__c,Login_Hash_Code__c FROM Contact WHERE Proposals__c =: propId AND MailingCountry = 'India'];
                String HostInstitute = [Select Email,account.name From Contact where Proposals__c =: propId and Is_Primary__c = false].account.name; 
            Application_Proposal__c ap = [select id,Title_Of__c from Application_Proposal__c where id =: propId];
            Id contactId = [Select Email From Contact where Proposals__c =: propId and Is_Primary__c = true].Id; 
                List<String> attachmentsListToBeReturned = new List<String>();
                Emailtemplate emailTempRec = New Emailtemplate();
                List<Attachment> attList = [Select Id,name,Body,ContentType from attachment where parentId = :propId order by createdDate DESC];
                // emailTempRec = [Select Id,HtmlValue,Subject from EmailTemplate where Name ='Decision Mail - IF'];
				List<EmailMessage> listOfEmailMesToInsert = New List<EmailMessage>();
            if(!conList.isEmpty()){
                for(Contact con : conList){
                Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
                attach.setContentType(attList[0].ContentType);
                attach.setFileName(attList[0].Name);
                attach.Body = attList[0].Body;
                
                OrgWideEmailAddress owea = [select Id from OrgWideEmailAddress where Address = 'wiser@igstc.org'];
                    //OrgWideEmailAddress owea = [select Id from OrgWideEmailAddress where Address = 'isha999raj@gmail.com'];
                		Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            			mail.setOrgWideEmailAddressId(owea.Id);
                mail.setToAddresses(new String[] { con.Email });//Set To Email Address
                mail.setSubject(' IGSTC Women Involvement in Science and Engineering Research (WISER) – Award Letter- ' + con.Name);
                String emailBody = 'Dear ' +con.Salutation + ' ' + con.LastName + ',' ;
                emailBody += ' <br> <br> Please find the attached award letter for "IGSTC Women Involvement in Science and Engineering Research (WISER)"  to undertake research on the project titled ' + ' " ' + ap.Title_Of__c + ' " '  + 'along with the host institution ' + HostInstitute + '.';
                    emailBody += ' <br> <br> Kindly acknowledge the receipt of the same along with the acceptance of the conditions. An Annexure 2/Endorsement format is attached for your immediate action. You need to upload the scanned copy first and then send us the original hard copy on institute’s letterhead to IGSTC as soon as possible.  The grant will be released upon the receipt of the Annexure 2/Endorsement duly signed.  <br> <br>';
                    emailBody += ' <br> <br> Please submit your Endorsment letter on below link. <br> ';
                    emailBody += '<a href="https://indo-germansciencetechnologycentre.my.salesforce-sites.com/ApplicantDashboard/ApplicantPortal?id=' + conList[0].Login_Hash_Code__c+ '&campaign=wiser#/WISERDocUpload ">' + 'Click here'+ '</a><br><br>' ;
                    //emailBody += '<a href="https://indo-germansciencetechnologycentre.my.salesforce-sites.com/ApplicantDashboard/ApplicantPortal?id=' + conList[0].Login_Hash_Code__c+ '&campaign=wiser#/WISERDocUpload ">' + 'Click here'+ '</a><br><br>' ;
                    emailBody += ' <br> <br> Wish you a successful Indo-German Collaboration!  <br> ';
                    emailBody += '<br><br> Kind regards,  <br> IGSTC Grants Team <br> Grants Management  <br> IGSTC <br> Indo-German Science & Technology Centre <br> Ground Floor, Block-II, Technology Bhavan, <br> New Mehrauli Road, New Delhi-110016 <br> Tel: + 91- 011 -2654 3509 <br> E-mail: wiser@igstc.org <br> Homepage: www.igstc.org <br>';
                mail.setHtmlBody(emailBody);
                // string emailHtmlValue = emailTempRec.HtmlValue;
                // if(!string.isBlank(conList[0].FirstName)){
                //     emailHtmlValue = emailHtmlValue.replace('{!Contact.FirstName}', conList[0].FirstName);
                // }
                // if(conList[0].Proposals__r.Tentative_Start_Date__c != null){
                //     emailHtmlValue = emailHtmlValue.replace('{!Application_Proposal__c.Tentative_Start_Date__c}', string.valueOf(conList[0].Proposals__r.Tentative_Start_Date__c));
                // }
                // if(conList[0].Proposals__r.Duration_In_Months_Max_36__c != null){
                //     emailHtmlValue = emailHtmlValue.replace('{!Application_Proposal__c.Duration_In_Months_Max_36__c}', string.valueOf(conList[0].Proposals__r.Duration_In_Months_Max_36__c));
                // }
                // if(!string.isBlank(conList[0].Login_Hash_Code__c)){
                //     emailHtmlValue = emailHtmlValue.replace('{!Contact.Login_Hash_Code__c}', conList[0].Login_Hash_Code__c);
                // }
                // mail.setHtmlBody(emailHtmlValue);//Set HTML Body
                mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attach });//Set File Attachment
                    Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
                    
                    EmailMessage emailMessageRecToBeInserted = New EmailMessage();
                            emailMessageRecToBeInserted.MessageDate = System.now();
                            emailMessageRecToBeInserted.Status = '3';
                            emailMessageRecToBeInserted.Subject = 'Award Letter';
                            emailMessageRecToBeInserted.ToAddress = con.Email;
                            emailMessageRecToBeInserted.Contact__c = con.Id;
                            system.debug('emailMessageRecToBeInserted ==> '+emailMessageRecToBeInserted);
                            listOfEmailMesToInsert.add(emailMessageRecToBeInserted);
                }      
                Application_Proposal__c app = New Application_Proposal__c();
                app.Id = conList[0].Proposals__c;
                app.Undertaking_Status__c = 'Sent';
                app.Endorsement_Letter_Status__c = 'Sent';
                appList.add(app);

                update appList;
            if(!listOfEmailMesToInsert.isEmpty()){
                            insert listOfEmailMesToInsert;
                        }
                }
        }catch(Exception e){
            system.debug(e.getMessage()+e.getLineNumber());
        }
    }

    @future (callout=true)
    Public static void generateCongaTemplate(String var,String TemplateName){
        system.debug('var ::'+var);
        String TemplateId = CongaHelperToolLightning.generateReport(var,TemplateName,null,null,null);
        system.debug('TemplateId'+TemplateId);
    }



    @AuraEnabled
    public static string SendAwardLetterSing(string propId, string attId){
        try{
            Application_Proposal__c applicationProposalRecord = [SELECT Id, RecordType.Name From Application_Proposal__c WHERE Id =: propId];
            List<Messaging.SingleEmailMessage> emailList = new List<Messaging.SingleEmailMessage>();
            List<Contact> conList = [Select Salutation,LastName,Email,FirstName,Name,Login_Hash_Code__c,Is_Primary__c,Proposals__c,Proposals__r.Title_Of__c,AccountName__c,Proposals__r.Duration_In_Months_Max_36__c,Proposals__r.Tentative_Start_Date__c From Contact where Proposals__c =: propId AND Is_Primary__c = true];
            List<Attachment> attList = [Select Id,name,Body,ContentType from attachment where Id = :attId]; 
            List<Application_Proposal__c> appList = New List<Application_Proposal__c>();
            List<EmailMessage> listOfEmailMesToInsert = New List<EmailMessage>();
            Emailtemplate emailTempRec =  [Select Id,HtmlValue,Subject from EmailTemplate where Name ='Award Letter - SING'];
            Emailtemplate emailTempRecWorkshop =  [Select Id,HtmlValue,Subject from EmailTemplate where Name ='Award Letter - WORKSHOP'];
            if(applicationProposalRecord.RecordType.Name == 'SING'){
            Account acchost = [select id,name,proposals__c,Account_Type__c,billingcountry from account where proposals__c =: propId and Account_Type__c = 'Host Organisation' limit 1];
                if(!conList.isEmpty()){
                    for(Contact con : conList){
                        string name = '';
                        if(!string.isBlank(con.Salutation)){
                            name = con.Salutation + ' ';
                        }
                        if(!string.isBlank(con.LastName)){
                            name = name + con.LastName;
                        }
                    
                            Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
                            attach.setContentType(attList[0].ContentType);
                            attach.setFileName(attList[0].Name);
                            attach.Body = attList[0].Body;
                            
                        OrgWideEmailAddress owea = [select Id from OrgWideEmailAddress where Address = 'sing@igstc.org'];
                        //OrgWideEmailAddress owea = [select Id from OrgWideEmailAddress where Address = 'isha999raj@gmail.com'];
                		Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            			mail.setOrgWideEmailAddressId(owea.Id);
                            mail.setToAddresses(new String[] { con.Email});//Set To Email Address
                            mail.setSubject(emailTempRec.Subject);//Set Subject
                            string emailHtmlValue = emailTempRec.HtmlValue;
                            if(!string.isBlank(conList[0].FirstName)){
                                emailHtmlValue = emailHtmlValue.replace('{!Contact.FirstName}', name);
                            }
                            if(!string.isBlank(conList[0].Login_Hash_Code__c)){
                                emailHtmlValue = emailHtmlValue.replace('{!Contact.Login_Hash_Code__c}', conList[0].Login_Hash_Code__c);
                            }
                            if(!string.isBlank(conList[0].Proposals__r.Title_Of__c)){
                                emailHtmlValue = emailHtmlValue.replace('{!Application_Proposal__c.Title_Of__c}', conList[0].Proposals__r.Title_Of__c);
                            }
                        if(!string.isBlank(conList[0].AccountName__c)){
                            emailHtmlValue = emailHtmlValue.replace('{!Account.Host_Account__c}', acchost.name);
                        }
                        mail.setHtmlBody(emailHtmlValue);//Set HTML Body
                            mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attach });//Set File Attachment
                            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
                            EmailMessage emailMessageRecToBeInserted = New EmailMessage();
                            emailMessageRecToBeInserted.MessageDate = System.now();
                            emailMessageRecToBeInserted.Status = '3';
                            emailMessageRecToBeInserted.Subject = emailTempRec.Subject;
                            emailMessageRecToBeInserted.ToAddress = con.Email;
                            emailMessageRecToBeInserted.Contact__c = con.Id;
                            system.debug('emailMessageRecToBeInserted ==> '+emailMessageRecToBeInserted);
                            listOfEmailMesToInsert.add(emailMessageRecToBeInserted);
                                Application_Proposal__c app = New Application_Proposal__c();
                                app.Id = conList[0].Proposals__c;
                                app.Undertaking_Status__c = 'Sent';
                                appList.add(app);
                                update appList;
                        }
                        if(!listOfEmailMesToInsert.isEmpty()){
                            insert listOfEmailMesToInsert;
                        }
                }
            }else if(applicationProposalRecord.RecordType.Name == 'Workshop'){
                if(!conList.isEmpty()){
                    for(Contact con : conList){
                        string name = '';
                        if(!string.isBlank(con.Salutation)){
                            name = con.Salutation + ' ';
                        }
                        if(!string.isBlank(con.LastName)){
                            name = name + con.LastName;
                        }
                    
                        Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
                        attach.setContentType(attList[0].ContentType);
                        attach.setFileName(attList[0].Name);
                        attach.Body = attList[0].Body;
                        
                       OrgWideEmailAddress owea = [select Id from OrgWideEmailAddress where Address = 'info.igstc@igstc.org'];
                       //OrgWideEmailAddress owea = [select Id from OrgWideEmailAddress where Address = 'isha999raj@gmail.com'];
                		Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            			mail.setOrgWideEmailAddressId(owea.Id);
                        mail.setToAddresses(new String[] { con.Email});//Set To Email Address
                        mail.setSubject(emailTempRecWorkshop.Subject);//Set Subject
                        string emailHtmlValue = emailTempRecWorkshop.HtmlValue;
                        if(!string.isBlank(conList[0].FirstName)){
                            emailHtmlValue = emailHtmlValue.replace('{!Contact.FirstName}', name);
                        }
                        if(!string.isBlank(conList[0].Login_Hash_Code__c)){
                            emailHtmlValue = emailHtmlValue.replace('{!Contact.Login_Hash_Code__c}', conList[0].Login_Hash_Code__c);
                        }
                        if(!string.isBlank(conList[0].Proposals__r.Title_Of__c)){
                            emailHtmlValue = emailHtmlValue.replace('{!Application_Proposal__c.Title_Of__c}', conList[0].Proposals__r.Title_Of__c);
                        }
                        mail.setHtmlBody(emailHtmlValue);//Set HTML Body
                        mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attach });//Set File Attachment
                        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });

                        EmailMessage emailMessageRecToBeInserted = New EmailMessage();
                        emailMessageRecToBeInserted.MessageDate = System.now();
                        emailMessageRecToBeInserted.Status = '3';
                        emailMessageRecToBeInserted.Subject = emailTempRecWorkshop.Subject;
                        emailMessageRecToBeInserted.ToAddress = con.Email;
                        emailMessageRecToBeInserted.Contact__c = con.Id;
                        system.debug('emailMessageRecToBeInserted ==> '+emailMessageRecToBeInserted);
                        listOfEmailMesToInsert.add(emailMessageRecToBeInserted);

                            Application_Proposal__c app = New Application_Proposal__c();
                            app.Id = conList[0].Proposals__c;
                            app.Proposal_Stages__c = 'Under Grant';
                            appList.add(app);
                            update appList;
                    }
                    if(!listOfEmailMesToInsert.isEmpty()){
                        insert listOfEmailMesToInsert;
                    }
                } 
            }
            
            return 'SUCCESS';
            
        }catch(Exception e){
            
            system.debug(e.getMessage()+e.getLineNumber());
            return e.getMessage()+e.getLineNumber();
        } 
    }
    /********************* END ********************/
    
}