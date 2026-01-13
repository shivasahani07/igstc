public withOut sharing class IndustrialFellowshipHelper {

  /*  public String updateIndusrianFellowshipBasicDet(String contactId,Contact InstanceCon,Integer birthDay,Integer birthMonth,Integer birthYear,
Integer phdEnrollYear,Integer phdEnrollMonth,Integer phdEnrollDay,Integer phdAwardYear,Integer phdAwardMonth,Integer phdAwardDay
,Integer phdThesisYear,Integer phdThesisMonth,Integer phdThesisDay,Application_Proposal__c prop){
    try {
        Date newBirthDate;
        Date newPhdEnrollDate;
        Date newAwardDate;
        Date newThesisDate;
        if(birthDay!=0){
            newBirthDate=Date.newInstance(birthYear,birthMonth,birthDay);
        }
        if(birthDay!=0){
            InstanceCon.Birthdate=newBirthDate;
        }
        if(phdEnrollYear!=0){
            newPhdEnrollDate=Date.newInstance(phdEnrollYear,phdEnrollMonth,phdEnrollDay);
        }
        if(phdEnrollYear!=0){
            InstanceCon.PhD_Enroll_Date__c=newPhdEnrollDate;
        }
        if(phdAwardYear!=0){
            newAwardDate=Date.newInstance(phdAwardYear,phdAwardMonth,phdAwardDay);
        }
        if(phdAwardYear!=0){
            InstanceCon.PhD_Awarded_Date__c=newAwardDate;
        }
        if(phdThesisYear!=0){
            newThesisDate=Date.newInstance(phdThesisYear,phdThesisMonth,phdThesisDay);
        }
        if(phdThesisYear!=0){
            InstanceCon.Thesis_Submission_Date__c=newThesisDate;
        }
        prop.RecordTypeId = Utility.getProposalRecordType('Industrial Fellowship');
        upsert prop;
        InstanceCon.Proposals__c = prop.Id;
        InstanceCon.Login_Hash_Code__c=contactId;
        update InstanceCon;
        return prop.Id;
    } catch (Exception e) {
        system.debug('exception: '+e.getMessage()+' line no. '+e.getLineNumber()+'');
        return 'exception: '+e.getMessage()+' line no. '+e.getLineNumber()+'';
    }
}

	*/

   
  /* public String updateIndusrianFellowshipBasicDet(
    String campaignId,
    String candidateId,
    Contact InstanceCon,
    Integer birthDay,
    Integer birthMonth,
    Integer birthYear,
    Integer phdEnrollYear,
    Integer phdEnrollMonth,
    Integer phdEnrollDay,
    Integer phdAwardYear,
    Integer phdAwardMonth,
    Integer phdAwardDay,
    Integer phdThesisYear,
    Integer phdThesisMonth,
    Integer phdThesisDay,
    Application_Proposal__c prop
){
    try {
        Date newBirthDate;
        Date newPhdEnrollDate;
        Date newAwardDate;
        Date newThesisDate;

        if(birthDay != 0){
            newBirthDate = Date.newInstance(birthYear, birthMonth, birthDay);
            InstanceCon.Birthdate = newBirthDate;
        }

        if(phdEnrollYear != 0){
            newPhdEnrollDate = Date.newInstance(phdEnrollYear, phdEnrollMonth, phdEnrollDay);
            InstanceCon.PhD_Enroll_Date__c = newPhdEnrollDate;
        }

        if(phdAwardYear != 0){
            newAwardDate = Date.newInstance(phdAwardYear, phdAwardMonth, phdAwardDay);
            InstanceCon.PhD_Awarded_Date__c = newAwardDate;
        }

        if(phdThesisYear != 0){
            newThesisDate = Date.newInstance(phdThesisYear, phdThesisMonth, phdThesisDay);
            InstanceCon.Thesis_Submission_Date__c = newThesisDate;
        }


        prop.RecordTypeId = Utility.getProposalRecordType('Industrial Fellowship');
        prop.Campaign__c= campaignId;
        upsert prop;

        
        InstanceCon.Login_Hash_Code__c = candidateId;
        update InstanceCon;


        
        Applicant_Proposal_Association__c existingAPA = null;

        List<Applicant_Proposal_Association__c> apaList = [
            SELECT Id
            FROM Applicant_Proposal_Association__c
            WHERE Contact__c = :InstanceCon.Id
            AND Proposals__c = :prop.Id
            LIMIT 1
        ];

        if (!apaList.isEmpty()) {
            existingAPA = apaList[0];
        }

        // If not found → create new junction object record
        if (existingAPA == null) {
            existingAPA = new Applicant_Proposal_Association__c();
            existingAPA.Contact__c = InstanceCon.Id;
            existingAPA.Proposals__c = prop.Id;
            insert existingAPA;
        }

            return prop.Id;
    } catch (Exception e) {
        system.debug('exception: ' + e.getMessage() + ' line no. ' + e.getLineNumber());
        return 'exception: ' + e.getMessage() + ' line no. ' + e.getLineNumber();
    }
}  */


 public static  insertApplicationWrapper updateIndusrianFellowshipBasicDet(
    String campaignId,
    String candidateId,
    Contact InstanceCon,
    Integer birthDay,
    Integer birthMonth,
    Integer birthYear,
    Integer phdEnrollYear,
    Integer phdEnrollMonth,
    Integer phdEnrollDay,
    Integer phdAwardYear,
    Integer phdAwardMonth,
    Integer phdAwardDay,
    Integer phdThesisYear,
    Integer phdThesisMonth,
    Integer phdThesisDay,
    Application_Proposal__c prop
){
    insertApplicationWrapper datawrapper = new insertApplicationWrapper();
    try {
        Date newBirthDate;
        Date newPhdEnrollDate;
        Date newAwardDate;
        Date newThesisDate;

        if(birthDay != 0){
            newBirthDate = Date.newInstance(birthYear, birthMonth, birthDay);
            InstanceCon.Birthdate = newBirthDate;
        }

        if(phdEnrollYear != 0){
            newPhdEnrollDate = Date.newInstance(phdEnrollYear, phdEnrollMonth, phdEnrollDay);
            InstanceCon.PhD_Enroll_Date__c = newPhdEnrollDate;
        }

        if(phdAwardYear != 0){
            newAwardDate = Date.newInstance(phdAwardYear, phdAwardMonth, phdAwardDay);
            InstanceCon.PhD_Awarded_Date__c = newAwardDate;
        }

        if(phdThesisYear != 0){
            newThesisDate = Date.newInstance(phdThesisYear, phdThesisMonth, phdThesisDay);
            InstanceCon.Thesis_Submission_Date__c = newThesisDate;
        }


        prop.RecordTypeId = Utility.getProposalRecordType('Industrial Fellowship');
        prop.Campaign__c= campaignId;
        upsert prop;

        
        InstanceCon.Login_Hash_Code__c = candidateId;
        update InstanceCon;


        
        Applicant_Proposal_Association__c existingAPA = null;

        List<Applicant_Proposal_Association__c> apaList = [
            SELECT Id
            FROM Applicant_Proposal_Association__c
            WHERE Contact__c = :InstanceCon.Id
            AND Proposals__c = :prop.Id
            LIMIT 1
        ];

        if (!apaList.isEmpty()) {
            existingAPA = apaList[0];
        }

        // If not found → create new junction object record
        if (existingAPA == null) {
            existingAPA = new Applicant_Proposal_Association__c();
            existingAPA.Contact__c = InstanceCon.Id;
            existingAPA.Proposals__c = prop.Id;
            insert existingAPA;
        }

            // Populate wrapper with results
            datawrapper.proposalId = prop.Id;
            datawrapper.proposal = prop;
            datawrapper.apa = existingAPA;
            
            return datawrapper;
    } catch (Exception e) {
        system.debug('exception: ' + e.getMessage() + ' line no. ' + e.getLineNumber());
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
 
    
 
    

    @RemoteAction
    public static Contact fetchProjectId(String candidateId){
        SYstem.debug('Hash code ==>' + candidateId);
        return [Select Id, Name, Proposals__r.RecordType_Name__c, Proposals__c From Contact where Login_Hash_Code__c=: candidateId];
    }
        


//*************Changed By Karthik KE

// Upsert Method for WiserApplicationPage
// public String insertApplicantDetails(contact conRec,Account AccDet,integer birthYear,integer birthMonth,integer birthDay, string campaignId){
//     try{
//         upsert AccDet;
//         Application_Proposal__c app = New Application_Proposal__c();
//         system.debug('con ::'+conRec);
//         system.debug('conRec.Proposals__c ::'+conRec.Proposals__c);
//     if(conRec.Proposals__c == null){
//         app.Campaign__c = campaignId;
//         app.RecordTypeId = Utility.getProposalRecordType('WISER');
//         app.Proposal_Stages__c = 'Draft';
//         upsert app;
//         system.debug('app ::'+app);
//         Contact con = [SELECT Id,AccountId FROM Contact WHERE Id =:conRec.id];
//         system.debug('con ::'+con);
//         if(!String.isEmpty(con.AccountId)){
//             Account acc = new Account();
//             acc.id = con.AccountId;
//             acc.Proposals__c = app.Id;
//             update acc;
//         }
//         conRec.Proposals__c = app.Id;
//     }
//     conRec.MailingState = conRec.State__c;
//     if(birthYear != 0){
//         conRec.Birthdate = Date.newInstance(birthYear,birthMonth,birthDay);
//     }
//     upsert conRec;
//     return conRec.Proposals__c;

//     }catch(Exception e){
//         return e.getMessage()+e.getLineNumber();
//     }
// }


// public String insertApplicantDetails(contact conRec, Account accDet, integer birthYear, integer birthMonth, integer birthDay, String campaignId) {
//     try {
//         // Upsert the Account first
//         upsert accDet;
        
      
//         // Query for existing junction record for this Contact
//             List<Applicant_Proposal_Association__c> associations = [
//                 SELECT Id, Proposals__c 
//                 FROM Applicant_Proposal_Association__c
//                 WHERE Contact__c = :conRec.Id
//                 LIMIT 1
//             ];

//             Applicant_Proposal_Association__c association;
//             if (associations.isEmpty()) {
//                 association = null;
//             } else {
//                 association = associations[0];
//             }

        
//         Application_Proposal__c app;

//         if (association == null) {
//             // No junction exists, create new junction record
//             association = new Applicant_Proposal_Association__c();
//             association.Contact__c = conRec.Id;
//             insert association;

//             // Create new Proposal and link with CampaignId if provided
//             app = new Application_Proposal__c();
//             if (!String.isEmpty(campaignId)) {
//                 app.Campaign__c = campaignId;
//             }
//             app.RecordTypeId = Utility.getProposalRecordType('WISER');
//             app.Proposal_Stages__c = 'Draft';
//             insert app;

//             // Link proposal to junction object
//             association.Proposals__c = app.Id;
//             update association;

//             // Link Proposal to Contact for convenience or existing logic
//             conRec.Proposals__c = app.Id;

//             // Also update Account field if AccountId present
//             if (!String.isEmpty(conRec.AccountId)) {
//                 Account acc = new Account(
//                     Id = conRec.AccountId,
//                     Proposals__c = app.Id
//                 );
//                 update acc;
//             }

//         } else if (association.Proposals__c == null) {
//             // Junction exists but no Proposal linked, create Proposal and update junction
//             app = new Application_Proposal__c();
//             if (!String.isEmpty(campaignId)) {
//                 app.Campaign__c = campaignId;
//             }
//             app.RecordTypeId = Utility.getProposalRecordType('WISER');
//             app.Proposal_Stages__c = 'Draft';
//             insert app;

//             association.Proposals__c = app.Id;
//             update association;

//             // Link Proposal to Contact and Account
//             conRec.Proposals__c = app.Id;

//             if (!String.isEmpty(conRec.AccountId)) {
//                 Account acc = new Account(
//                     Id = conRec.AccountId,
//                     Proposals__c = app.Id
//                 );
//                 update acc;
//             }

//         } else {
//             // Both junction and proposal exist, assign existing proposal to contact
//             conRec.Proposals__c = association.Proposals__c;
//         }

//         // Set MailingState from custom State field and set Birthdate if given
//         conRec.MailingState = conRec.State__c;

//         if (birthYear != 0) {
//             conRec.Birthdate = Date.newInstance(birthYear, birthMonth, birthDay);
//         }

//         // Upsert the Contact last
//         upsert conRec;

//         return conRec.Proposals__c;

//     } catch (Exception e) {
//         return e.getMessage() + ' Line: ' + e.getLineNumber();
//     }
// }


//changed by Karthik KE
// Upsert Method for WiserApplicationPage
public String insertApplicantDetails(contact conRec, Account accDet, integer birthYear, integer birthMonth, integer birthDay, String campaignId) {
    try {
        upsert accDet;
        
        List<Applicant_Proposal_Association__c> associations = [
            SELECT Id, Proposals__c 
            FROM Applicant_Proposal_Association__c
            WHERE Contact__c = :conRec.Id
            LIMIT 1
        ];

        Applicant_Proposal_Association__c association;
        if (associations.isEmpty()) {
            association = null;
        } else {
            association = associations[0];
        }

        Application_Proposal__c app;

        // Fetch WISER record type Id once
        Id wiserRecordTypeId = Utility.getProposalRecordType('WISER');
        
        if (association == null) {
            association = new Applicant_Proposal_Association__c(Contact__c = conRec.Id);
            insert association;

            app = new Application_Proposal__c();
            if (!String.isEmpty(campaignId)) {
                app.Campaign__c = campaignId;
            }
            app.RecordTypeId = wiserRecordTypeId;
            app.Proposal_Stages__c = 'Draft';
            insert app;

            association.Proposals__c = app.Id;
            update association;

            

            if (!String.isEmpty(conRec.AccountId)) {
                Account acc = new Account(Id = conRec.AccountId);
                update acc;
            }
        } else {
            Boolean createNewProposal = false;
            if (association.Proposals__c == null) {
                createNewProposal = true;
            } else {
                // Query existing Proposal record to check RecordTypeId
                Application_Proposal__c existingProposal = [
                    SELECT Id, RecordTypeId 
                    FROM Application_Proposal__c 
                    WHERE Id = :association.Proposals__c
                    LIMIT 1
                ];

                if (existingProposal.RecordTypeId != wiserRecordTypeId) {
                    createNewProposal = true;
                } else {
                    conRec.Proposals__c = association.Proposals__c;
                }
            }

            if (createNewProposal) {
                app = new Application_Proposal__c();
                if (!String.isEmpty(campaignId)) {
                    app.Campaign__c = campaignId;
                }
                app.RecordTypeId = wiserRecordTypeId;
                app.Proposal_Stages__c = 'Draft';
                insert app;

                association.Proposals__c = app.Id;
                update association;

                

                if (!String.isEmpty(conRec.AccountId)) {
                    Account acc = new Account(Id = conRec.AccountId);
                    update acc;
                }
            }
        }

        conRec.MailingState = conRec.State__c;

        if (birthYear != 0) {
            conRec.Birthdate = Date.newInstance(birthYear, birthMonth, birthDay);
        }

        upsert conRec;

        return conRec.Proposals__c;

    } catch (Exception e) {
        return e.getMessage() + ' Line: ' + e.getLineNumber();
    }
}



public class wrapperApplicant{
        public Contact cont;
        public Integer birthyear;
        public Integer birthmonth;
        public Integer birthday;
        public string proposal;
        public string accId;  
}

// Upsert Method for HostInfoApplicationPage

public static String insertHostInfoDetails(Contact hostDetails, Account acc, string projectId, string recordtype){
    acc.RecordTypeId = Utility.getAccountRecordType('Academia');
    // acc.Proposals__c=projectId;
    upsert acc;
    system.debug('hostDetails ::'+hostDetails);
    // Account acc = New Account();
    //     acc.Name = 'Blank';
    //     acc.RecordTypeId = Utility.getAccountRecordType('Academia');
    //     system.debug('Account1 -->'+acc.Name);
    //     upsert acc;
        // system.debug('Account2 -->'+acc.Id);
        hostDetails.AccountId = acc.Id;
//    hostDetails.Proposals__c = projectId;
   hostDetails.MailingState = hostDetails.State__c;
//    hostDetails.Applicant_Type__c = 'Host';
    // System.debug('hostDetails: ' +hostDetails);
    hostDetails.Host__c = true;
   upsert hostDetails;
//    Proposal_Controller.getContactUserDoc(hostDetails.Id);
    return hostDetails.Id;

}

public class wrapperHostInformation{
    public Host__c host;
    public integer startDay;
    public integer startMonth;
    public integer startYear;
    public integer endDay;
    public integer endMonth;
    public integer endYear;
   // public string conId;
}


public String updatePersonalInfoIF(String ContactId,Contact InstanceCon,Integer birthDay,Integer birthMonth,Integer birthYear,Integer pasExYear,Integer pasExMonth,Integer pasExDay)
{
    try {
        InstanceCon.MailingState = InstanceCon.State__c;
        InstanceCon.OtherState = InstanceCon.Other_State__c;
        Date newBirthDate;
        Date newPasExpDate;
        if(birthDay!=0){
            newBirthDate=Date.newInstance(birthYear,birthMonth,birthDay);
            InstanceCon.Birthdate=newBirthDate;
        }
        if(pasExYear!=0){
            newPasExpDate=Date.newInstance(pasExYear,pasExMonth,pasExDay);
            InstanceCon.Passport_Expiry__c=newPasExpDate;
        }
        InstanceCon.Login_Hash_Code__c=contactId;
        update InstanceCon;
        return 'Your Personal Information have been saved successfully.';
    } catch (DmlException e) {
        system.debug('exception: '+e.getMessage()+' line no. '+e.getLineNumber()+'');
        return 'ERROR';
    }
}
public String saveEduDetailIF(String loginHashCode,List<Education_Details__c> instanceEduDet,List<WrapperDate> dateList,String apaId){
    try {
        system.debug('education detail :: '+instanceEduDet);
        Id eduId = Schema.SObjectType.Education_Details__c.getRecordTypeInfosByName().get('Education').getRecordTypeId();
        Id thesisId = Schema.SObjectType.Education_Details__c.getRecordTypeInfosByName().get('Thesis').getRecordTypeId();
        Date newMtStartDate;
        Date newMtEndDate;
        Date newPhDStartDate;
        Date newPhDEndDate;
        Integer mtStartDateCheck=0;
        Integer mtEndDateCheck=0;
        Integer phdStartDateCheck=0;
        Integer phdEndDateCheck=0;
        for(WrapperDate singleDate:dateList){
            if(singleDate.GroupName=='mt'){
                if(singleDate.fromTo=='start'){
                   if(singleDate.year==0){
                    mtStartDateCheck=1;
                   }else{
                    newMtStartDate=Date.newInstance(singleDate.year,singleDate.month,singleDate.day);}
                }else{
                    if(singleDate.year==0){
                        mtEndDateCheck=1;                
                    }else{newMtEndDate=Date.newInstance(singleDate.year,singleDate.month,singleDate.day);}
                }
            }
            else
            {
                if(singleDate.fromTo=='start'){
                    if(singleDate.year==0){phdStartDateCheck=1;}else{
                    newPhDStartDate=Date.newInstance(singleDate.year,singleDate.month,singleDate.day);}
                }else{
                    if(singleDate.year==0){phdEndDateCheck=1;}else{
                    newPhDEndDate=Date.newInstance(singleDate.year,singleDate.month,singleDate.day);}
                }
            }
        }
        for(Education_Details__c lineItem:instanceEduDet){
            if(lineItem.Degree__c!=null){
                lineItem.RecordTypeId=eduId;
                lineItem.Applicant_Proposal_Association__c=apaId;
            }
            else{
                lineItem.RecordTypeId=thesisId;
                lineItem.Applicant_Proposal_Association__c=apaId;
                if(lineItem.Thesis_Type__c=='Master Thesis'){
                    if(mtStartDateCheck==0){
                    lineItem.Start_Date__c=newMtStartDate;
                    }else{
                        lineItem.Start_Date__c=null;
                    }
                    if(mtEndDateCheck==0){
                        lineItem.End_Date__c=newMtEndDate;
                    }else{
                        lineItem.End_Date__c=null;
                    }
                }
                else
                {
                    if(phdStartDateCheck==0){
                    lineItem.Start_Date__c=newPhDStartDate;
                    }else{lineItem.Start_Date__c=null;}
                    if(phdEndDateCheck==0){
                    lineItem.End_Date__c=newPhDEndDate;
                    }else{lineItem.End_Date__c=null;}
                }
            }
        }
        system.debug('education detail :: '+instanceEduDet);
        upsert instanceEduDet;
        return 'Your Education details have been saved successfully.';
    } catch (DmlException e) {
        system.debug('exception: '+e.getMessage()+' line no. '+e.getLineNumber()+'');
        return 'exception: ';
    }
    }
public String upsertAchievements(String loginHashCode,Achievement__c instanceAchiev,String flag){
    try {
        if(flag=='update'){
        update instanceAchiev;
        }
        else {
            Contact instanceCon = [SELECT ID FROM Contact WHERE Login_Hash_Code__c=:loginHashCode limit 1];
            instanceAchiev.contact__c=instanceCon.id;
            insert instanceAchiev;
        }
        return 'Your Achievements details have been saved successfully.';
    } catch (DmlException e) {
        system.debug('exception: '+e.getMessage()+' line no. '+e.getLineNumber()+'');
    return 'ERROR';
    }
}
public String saveContactEmployement(String loginHashCode,Contact con,List<employmentWrapper> empList,String apaId){
    try {
        update con;
        system.debug('size ---> '+empList.size());
        List<Employment_Details__c> employList = New List<Employment_Details__c>();
        Set<String> ids = New Set<String>();
        system.debug('empList ---> '+empList);
        for(employmentWrapper wrap : empList){
            system.debug('wrap----'+wrap);
            Employment_Details__c emRec = New Employment_Details__c();
            emRec.Organization_Name__c = wrap.employmentDetails.Organization_Name__c;
            emRec.Position__c = wrap.employmentDetails.Position__c;
            emRec.Nature_of_Job__c = wrap.employmentDetails.Nature_of_Job__c;
            emRec.Contact__c = wrap.employmentDetails.Contact__c;
            emRec.Start_Date__c = wrap.employmentDetails.Start_Date__c;
            emRec.End_Date__c = wrap.employmentDetails.End_Date__c;
            emRec.Applicant_Proposal_Association__c = apaId;
            if(wrap.employmentDetails.Id != null){
                emRec.Id = wrap.employmentDetails.Id;
            }
            employList.add(emRec);
        }
        system.debug('employList ::'+employList);
        upsert employList;
        system.debug('employList ::'+employList);
        return 'Your employment details have been saved successfully.';
    } catch (DmlException e) {
        system.debug('exception: '+e.getMessage()+' line no. '+e.getLineNumber()+'');
    return 'ERROR';
    }
}
public String saveFellowshipDetails(String loginHashCode,Contact[] con,Contact pContact){
    try {
        for(Contact conRec : con){
            conRec.MailingState = conRec.State__c;
        }
        // upsert prop;
        // pContact.Proposals__c = prop.Id;
        update pContact;
        upsert con;        
        return 'Your Mentor/Host Details have been saved successfully.';
    } catch (DmlException e) {
        system.debug('exception: '+e.getMessage()+' line no. '+e.getLineNumber()+'');
    return e.getMessage();
    }
}
public String submitProposalIF(Contact con,String saveType,String proposalId,integer year,integer month,integer day){
    try{            
    if(saveType=='s'){
       if(year!=0){
            Date newDate=Date.newInstance(year,month,day);
            con.Declaration_Sign_Date__c=newDate;
        }
        update con;
        Application_Proposal__c prop=new Application_Proposal__c(Id=proposalId);
        prop.Proposal_Stages__c='Submitted';
        prop.Submitted__c = true;
        update prop;
    }
    else
    {
        update con;
    }
    return 'success';
}
catch(Exception e){
    system.debug('exception: '+e.getMessage()+' line no. '+e.getLineNumber()+'');
    return 'Exception';
}
}

public String saveFellowshipProposal(String loginHashCode,Application_Proposal__c prop,Contact pContact,String AccountId, String recordType){
    try {
        prop.RecordTypeId = Utility.getProposalRecordType('Industrial Fellowship');
        upsert prop;
        //pContact.Proposals__c = prop.Id; Commented By Karthik KE
        update pContact;
        Account accountUpdate=[SELECT ID,Name FROM Account WHERE Id=:AccountId limit 1];
       // accountUpdate.Proposals__c=prop.Id; Commented By Karthik KE
        update accountUpdate;
        return prop.Id;
    } catch (DmlException e) {
        //system.debug('exception: '+e.getMessage()+' line no. '+e.getLineNumber()+'');
    return 'exception: '+e.getMessage()+' line no. '+e.getLineNumber()+'';
    }
}
  
    
// public String saveApplicantPortalSingh(String loginHashCode,Contact con){
//     try {
//         update con;
//         return 'Applicant Information has been saved successfully.';
//     } catch (DmlException e) {
//         system.debug('exception: '+e.getMessage()+' line no. '+e.getLineNumber()+'');
//     return e.getMessage() + e.getLineNumber();
//     }
// }

// public String saveApplicantPortalSingh(String loginHashCode,Contact InstanceCon,Account acc,Integer year,Integer month,Integer day)
// {
//     try {
//         upsert acc;
//         Date newBirthDate;
//         if(year!=0){
//             newBirthDate=Date.newInstance(year,month,day);
//             InstanceCon.Birthdate=newBirthDate;
//         }
//         upsert InstanceCon;
//         return 'Applicant Information has been saved successfully.';
//     } catch (DmlException e) {
//         system.debug('exception: '+e.getMessage()+' line no. '+e.getLineNumber()+'');
//         return e.getMessage() + e.getLineNumber();
//     }
// }

@RemoteAction
    public static String saveApplicantPortalSingh(
        String candidateId,
        Contact con,
        Account acc,
        Integer year,
        Integer month,
        Integer day,
        String contactId,
        String recordTypeName,
        String campaignId,
        String yearlyCallId
    ) {
        Savepoint sp = Database.setSavepoint();
        
        try {
            if (acc != null) {
                upsert acc;
                
                if (con.AccountId == null && acc.Id != null) {
                    con.AccountId = acc.Id;
                }
            }
            
            if (year != null && year != 0 && month != null && day != null) {
                Date newBirthDate = Date.newInstance(year, month, day);
                con.Birthdate = newBirthDate;
            }
            
            if (con != null) {
                upsert con;
            }
            
            Id finalContactId = String.isNotBlank(contactId) ? Id.valueOf(contactId) : con.Id;
            
            Id recordTypeId;
            try {
                recordTypeId = Schema.SObjectType.Application_Proposal__c
                    .getRecordTypeInfosByDeveloperName()
                    .get(recordTypeName)
                    .getRecordTypeId();
            } catch (Exception e) {
                System.debug('RecordType ' + recordTypeName + ' not found: ' + e.getMessage());
                return 'Applicant Information has been saved successfully. (Proposal creation skipped - RecordType not found)';
            }
            
            List<Applicant_Proposal_Association__c> existingAssociations = [
                SELECT Id, 
                       Proposals__c, 
                       Yearly_Call__c,
                       Proposals__r.Id, 
                       Proposals__r.RecordTypeId,
                       Contact__c
                FROM Applicant_Proposal_Association__c
                WHERE Contact__c = :finalContactId
                AND Proposals__r.RecordTypeId = :recordTypeId AND Proposals__r.yearly_Call__c  =: yearlyCallId
                LIMIT 1
            ];
            
            Application_Proposal__c proposal;
            Applicant_Proposal_Association__c association;
            
            if (!existingAssociations.isEmpty()) {
                association = existingAssociations[0];
                
                proposal = [SELECT Id, RecordTypeId FROM Application_Proposal__c WHERE Id = :association.Proposals__c LIMIT 1];
                
                update proposal;
                update association;
                
                System.debug('Updated existing Proposal and Association');
                
            } else {
                proposal = new Application_Proposal__c(
                    RecordTypeId = recordTypeId,
                    yearly_Call__c=yearlyCallId,
                    Campaign__c = String.isNotBlank(campaignId) ? Id.valueOf(campaignId) : null
                );
                insert proposal;
                
                association = new Applicant_Proposal_Association__c(
                    Contact__c = finalContactId,
                    Proposals__c = proposal.Id
                );
                insert association;
                
                System.debug('Created new Proposal and Association');
            }
            
            //return 'Applicant Information has been saved successfully.';
            return proposal.Id;
        } catch (DmlException e) {
            Database.rollback(sp);
            System.debug('DML Exception: ' + e.getMessage() + ' at line ' + e.getLineNumber());
            return 'Error: ' + e.getMessage() + ' (Line: ' + e.getLineNumber() + ')';
            
        } catch (Exception e) {
            Database.rollback(sp);
            System.debug('General Exception: ' + e.getMessage() + ' at line ' + e.getLineNumber());
            return 'Error: ' + e.getMessage() + ' (Line: ' + e.getLineNumber() + ')';
        }
    }

   









public String saveAccountBankDetails(Bank_Details__c instanceBankDetails){
    try {
        upsert instanceBankDetails;
        return instanceBankDetails.Id;
    } catch (DmlException e) {
        system.debug('exception: '+e.getMessage()+' line no. '+e.getLineNumber()+'');
    return 'ERROR';
    }
}

 // Modified By Harsh
public String saveProjectDetailsSing(String loginHashCode,Contact pContact,Application_Proposal__c prop,String AccountId,String recordType){
    try {
        prop.RecordTypeId = Utility.getProposalRecordType('SING');
        upsert prop;
        // Modified By Harsh
        // pContact.Proposals__c = prop.Id;
        // update pContact;
        // Account accountUpdate=[SELECT ID,Name FROM Account WHERE Id=:AccountId limit 1];
        // accountUpdate.Proposals__c=prop.Id;
        // update accountUpdate;
        return prop.Id;
    } catch (DmlException e) {
        //system.debug('exception: '+e.getMessage()+' line no. '+e.getLineNumber()+'');
    return 'exception: '+e.getMessage()+' line no. '+e.getLineNumber()+'';
    }
}

// Wiser
public string saveApplicantPortalWiser(String loginHashCode, Contact con){
    try{
        update con;
        return 'Record Updated Successfully';
    }catch(Exception e){
        system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
        return 'Error Occured';
        }
}

   // Host Information
   public String saveApplicationPortalHostInformation(String loginHashCode, Contact con){
    try{
        upsert con;
        return 'Record Updated Successfully';
    }catch(Exception e){
        system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
        return 'Error Occured';
        }
   }

    /*
    public static String insertHostProjectDetails(Application_Proposal__c hostDetails, String proposalId, String candidateId, String yearlyCallId, Integer sDate, Integer sMonth, Integer sYear, Integer eDate, Integer eMonth, Integer eYear){
        if(!String.isBlank(proposalId)){
 
                Application_Proposal__c proposalRec = [
                    SELECT Id, Host_Abstract_Of_Project__c, Host_Project_Title__c, Host_Funding_Source__c, 
                    Actual_Application_End_Date__c, Broad_area_of_research__c
                    FROM Application_Proposal__c
                    WHERE Id = :proposalId
                    LIMIT 1
                ];

                proposalRec.Host_Project_Title__c = hostDetails.Host_Project_Title__c;
                proposalRec.Host_Abstract_Of_Project__c = hostDetails.Host_Abstract_Of_Project__c;
                proposalRec.Broad_area_of_research__c = hostDetails.Broad_area_of_research__c;

                upsert proposalRec;
                return 'SUCCESS';
        }
        return 'proposalId doesen\'t exists';
    }
    */

   // ------------------------------------- WISER METHOD TO CREATE PROPOSAL ----------------------------------------- //
    public static IndustrialFellowshipHelper.ProposalAndAPAWrapper insertHostProjectDetails(Application_Proposal__c hostDetails, String proposalId, String candidateId, String yearlyCallId, Integer sDate, Integer sMonth, Integer sYear, Integer eDate, Integer eMonth, Integer eYear){
        try {
            System.debug(' ================= IndustrialFellowshipHelper.insertHostProjectDetails() ================== ');

            System.debug('hostDetails :: ' + hostDetails);
            System.debug('sDate :: ' + sDate);

            List<Contact> conList = [
                SELECT Id, Login_Hash_Code__c
                FROM Contact
                WHERE Login_Hash_Code__c = :candidateId
            ];

            Set<Id> conIds = new Set<Id>();
            for(Contact conRecord : conList){
                conRecord.Proposals__c = null;
                conIds.add(conRecord.Id);
            }

            Applicant_Proposal_Association__c primaryAPA;
            Application_Proposal__c proposalRec;
            ProposalAndAPAWrapper datawrapper = new ProposalAndAPAWrapper();

            // =================================================
            // CASE 1: PROPOSAL EXISTS
            // =================================================
            if(!String.isBlank(proposalId)){
 
                proposalRec = [
                    SELECT Id, Host_Abstract_Of_Project__c, Host_Project_Title__c, Host_Funding_Source__c, 
                    Actual_Application_End_Date__c, Broad_area_of_research__c
                    FROM Application_Proposal__c
                    WHERE Id = :proposalId
                    LIMIT 1
                ];

                proposalRec.Host_Project_Title__c = hostDetails.Host_Project_Title__c;
                proposalRec.Host_Abstract_Of_Project__c = hostDetails.Host_Abstract_Of_Project__c;
                proposalRec.Broad_area_of_research__c = hostDetails.Broad_area_of_research__c;
                proposalRec.Duration_In_Months_Max_36__c = hostDetails.Duration_In_Months_Max_36__c;
                proposalRec.KeyWords__c = hostDetails.KeyWords__c;
                upsert proposalRec;
 
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
                    .get('WISER')
                    .getRecordTypeId();
 
                Campaign camp = [
                    SELECT Id
                    FROM Campaign
                    WHERE Name = 'WISER'
                    LIMIT 1
                ];

                // if(sDate == 0 && sMonth == 0 && sYear == 0){

                // }else{
                //     proposalRec.Actual_Application_Start_Date__c = Date.newInstance(sYear,sMonth,sDate);
                // }

                // if(eDate == 0 && eMonth == 0 && eYear == 0){

                // }else{
                //     proposalRec.Actual_Application_End_Date__c = Date.newInstance(eYear,eMonth,eDate);
                // }
 
                proposalRec = new Application_Proposal__c(
                    Title_Of__c = 'WISER',
                    RecordTypeId = workshopRecordTypeId,
                    Campaign__c = camp.Id,
                    yearly_Call__c = yearlyCallId,
                    Host_Abstract_Of_Project__c = hostDetails.Host_Abstract_Of_Project__c,
                    Host_Project_Title__c = hostDetails.Host_Project_Title__c
                    //Actual_Application_Start_Date__c = Date.newInstance(sYear,sMonth,sDate)
                );
                upsert proposalRec;
 
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
            System.debug('Line Number : ' + e.getLineNumber() + ' Error Message : ' +  e.getMessage());
            throw new AuraHandledException(
                e.getMessage() + ' @ line ' + e.getLineNumber()
            );
        }

    
        // if(sDate == 0 && sMonth == 0 && sYear == 0){

        // }else{
        //     hostDetails.Actual_Application_Start_Date__c = Date.newInstance(sYear,sMonth,sDate);
        // }

        // if(eDate == 0 && eMonth == 0 && eYear == 0){

        // }else{
        //     hostDetails.Actual_Application_End_Date__c = Date.newInstance(eYear,eMonth,eDate);
        // }
        // system.debug('@@@ ::'+hostDetails);
        // upsert hostDetails;
        // return 'SUCCESS';
    }  

    public class ProposalAndAPAWrapper {
        public String proposalId { get; set; }
        public Application_Proposal__c proposal { get; set; }
        public Applicant_Proposal_Association__c apa { get; set; }
    }



/*    public static String insertHostProjectDetails(Application_Proposal__c hostDetails, integer sDate, integer sMonth, integer sYear, integer eDate, integer eMonth, integer eYear){
        system.debug('hostDetails ::'+hostDetails);
        system.debug('sDate ::'+sDate);
        if(sDate == 0 && sMonth == 0 && sYear == 0){

        }else{
            hostDetails.Actual_Application_Start_Date__c = Date.newInstance(sYear,sMonth,sDate);
        }

        if(eDate == 0 && eMonth == 0 && eYear == 0){

        }else{
            hostDetails.Actual_Application_End_Date__c = Date.newInstance(eYear,eMonth,eDate);
        }
        system.debug('@@@ ::'+hostDetails);
        upsert hostDetails;
        return 'SUCCESS';

    } */

//consortia start
public String upsertConsortiaAccountDet(Account instanceAcc, String projectId){
    try{
        instanceAcc.Proposals__c=projectId;
        instanceAcc.NumberOfEmployees = integer.valueOf(instanceAcc.NumberOfEmployees);
        upsert instanceAcc;
        return instanceAcc.Id;
    }catch(Exception e){
        system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
        return e.getMessage() + e.getLineNumber();
        }
   }
   public String upsertConsortiaContactsDet(Contact instanceCon,String accountId, String projectId){
    try{
        instanceCon.AccountId = accountId;
        instanceCon.Proposals__c=projectId;
        upsert instanceCon;
        return instanceCon.Id;
    }catch(Exception e){
        system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
        return 'Error Occured';
        }
   }
   public String saveOtherDet(List<Education_Details__c> instanceEdu,List<Employment_Details__c> insempdet,List<Publications_Patents__c> instpublication){
    try{
        Id eduId = Schema.SObjectType.Education_Details__c.getRecordTypeInfosByName().get('Education').getRecordTypeId();
        Id pubId = Schema.SObjectType.Publications_Patents__c.getRecordTypeInfosByName().get('Publication').getRecordTypeId();
        for(Education_Details__c ed:instanceEdu){
            ed.RecordTypeId=eduId;
        }
        upsert instanceEdu;
        upsert insempdet;
        for(Publications_Patents__c pp:instpublication){
            pp.RecordTypeId=pubId;
        }
        upsert instpublication;
        return 'Record Updated Successfully';
    }catch(Exception e){
        system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
        return 'Error Occured';
        }
   }
   public String deleteAccount(String accountId){
    try{
        Account instanceAcc = New Account(Id=accountId);
        delete instanceAcc;
        return 'Account has been deleted successfully';
    }catch(Exception e){
        system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
        return 'Error Occured';
        }
   }
    // public String upsertProposal(Application_Proposal__c prop,string ContactId) {
    //     Contact conInstance=new Contact(Id=ContactId);
    //     upsert prop;
    //     conInstance.Proposals__c=prop.Id;
    //     return prop.Id;
    // }
   public String saveAccountContactEduOtherDetList(String ProposalId,String accountId,Contact con,List<Employment_Details__c> ed,List<Education_Details__c> edu,String flag){
    try{
        if(flag=='basicDet'){
        con.AccountId=accountId;
        con.Proposals__c=ProposalId;
        upsert con;
        }
        else if(flag=='education'){
            Id eduId = Schema.SObjectType.Education_Details__c.getRecordTypeInfosByName().get('Education').getRecordTypeId();
            for(Education_Details__c educa:edu){
                educa.Contact__c=con.Id;
                educa.RecordTypeId=eduId;
                educa.Start_Year__c = String.valueOf(educa.Start_Year__c);
                educa.End_Year__c = String.valueOf(educa.End_Year__c); 
            }
            upsert edu;
        }
        else if(flag=='employment'){
            for(Employment_Details__c empdet:ed){
                empdet.Contact__c=con.Id;
                empdet.Start_Year__c = String.valueOf(empdet.Start_Year__c);
                empdet.End_Year__c = String.valueOf(empdet.End_Year__c);          
            }
            upsert ed;
        }
        else if(flag=='publication'){
            upsert con;
            // Id pubId = Schema.SObjectType.Publications_Patents__c.getRecordTypeInfosByName().get('Publication').getRecordTypeId();
            // for(Publications_Patents__c pub:pp){
            //     pub.Contact__c=con.Id;
            //     pub.RecordTypeId=pubId;
            // }
            // upsert pp;
        }        
        return con.id;
    }catch(Exception e){
        system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
        return 'Error Occured';
        }
   }
   public string saveWorkPackageDet(List<WrapperWorkpackageDet> wrapper,String ProposalId, String proposalStage){
        try{
            system.debug('wrapper::'+wrapper);
            Map<String,List<AccountListWrapper>> mapWorkpackage=new Map<String,List<AccountListWrapper>>();
            List<Work_Package__c> ListWorkPackage=new List<Work_Package__c>();
            List<Account_Mapping__c> amr=new List<Account_Mapping__c>();
            // Schema.DescribeFieldResult F = Work_Package__c.External_Id__c.getDescribe();
            // Schema.sObjectField backendExternal = F.getSObjectField();
            // system.debug(backendExternal);
            for(WrapperWorkpackageDet workpackage : wrapper){
                system.debug('work Package::'+workpackage.duration);
                system.debug('work Package::'+workpackage.end_trl_level);
                system.debug('work Package::'+workpackage.trl_level);
                system.debug('work Package::'+workpackage.title);
                system.debug('sequence::'+workpackage.WPSequence);
                system.debug('Account lIst::'+workpackage.AccountListWrapper);
                Work_Package__c Instanceworkpackage=new Work_Package__c();                
                if(workpackage.Id!=''){
                    Instanceworkpackage.id=workpackage.Id;
                }
                if(workpackage.duration != null){
                    Instanceworkpackage.Duration__c=workpackage.duration;
                }
                if(workpackage.trl_level != null){
                    Instanceworkpackage.TRL_Level__c= integer.valueOf(workpackage.trl_level);
                }
                system.debug('workpackage.end_trl_level---'+workpackage.end_trl_level);
                if(workpackage.end_trl_level != null && workpackage.end_trl_level != ''){
                    Instanceworkpackage.End_TRL_Level__c=integer.valueOf(workpackage.end_trl_level);
                }
                system.debug('workpackage.WPSequence---'+workpackage.WPSequence);
                if(workpackage.WPSequence != null){
                    Instanceworkpackage.WP_Sequence__c=Decimal.valueOf(workpackage.WPSequence);
                }
                Instanceworkpackage.Title__c=workpackage.title;
                Instanceworkpackage.External_Id__c=workpackage.ExternalId;
                Instanceworkpackage.Application__c=ProposalId;
                Instanceworkpackage.Proposal_Stage__c= proposalStage;
                Instanceworkpackage.Work_Package_Detail__c=workpackage.Workpackage_detail;
                mapWorkpackage.put(workpackage.ExternalId,workpackage.AccountListWrapper);
                ListWorkPackage.add(Instanceworkpackage);
            }
            system.debug('ListWorkPackage---'+ListWorkPackage);
            upsert ListWorkPackage;            
            Map<String,String> externalIdXwrkPackgid = New Map<String,String>();
            for(Work_Package__c wp:ListWorkPackage){
                externalIdXwrkPackgid.put(wp.External_Id__c,wp.Id);
               /* List<AccountListWrapper> accWrapList = mapWorkpackage.get(wp.External_Id__c);
                for(Account ac:Lacc){
                    Account_Mapping__c accMapping=new Account_Mapping__c();
                    amsingle.Account__c=ac.id;
                    amsingle.Work_Package__c=wp.id;
                }  
                amr.add(amsingle);   */
            }
            system.debug('externalIdXwrkPackgid--'+externalIdXwrkPackgid);
            List<Account_Mapping__c> accMappingList = New List<Account_Mapping__c>();
            List<Account_Mapping__c> accMappingListToDelete = New List<Account_Mapping__c>();
            for(string externalId:mapWorkpackage.keySet()){
                for(AccountListWrapper accWrapper:mapWorkpackage.get(externalId)){
                    if(accWrapper.isSelected && String.isBlank(accWrapper.accountMappingId)){
                        Account_Mapping__c accMapping = New Account_Mapping__c();
                        accMapping.Account__c   = accWrapper.accnt.Id;
                        accMapping.Work_Package__c = externalIdXwrkPackgid.get(externalId);
                        accMappingList.add(accMapping);
                    }else if(!accWrapper.isSelected && !String.isBlank(accWrapper.accountMappingId)){
                        accMappingListToDelete.add(New Account_Mapping__c(id=accWrapper.accountMappingId));
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

    public static string deleteWorkPackageDetails(string workPackageId){
        try{
            List<Account_Mapping__c> accMappingList = [select name,id from Account_Mapping__c where Work_Package__c =:workPackageId];
            Delete accMappingList;
            Delete New Work_Package__c(Id=workPackageId);
            return 'Success';
        }catch(Exception e){
            system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
            return 'Error Occured';
        }
    }
    public String deleteContact(String contactId){
        try{
            Contact instanceAcc = New Contact(Id=contactId);
            delete instanceAcc;
            return 'success';
        }catch(Exception e){
            system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
            return 'Error Occured';
            }
       }
       public String deleteEducation(String eduId){
        try{
            Education_Details__c instanceAcc = New Education_Details__c(Id=eduId);
            delete instanceAcc;
            return 'success';
        }catch(Exception e){
            system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
            return 'Error Occured';
            }
       }
       public String deleteEmployment(String employmentId){
        try{
            Employment_Details__c instanceAcc = New Employment_Details__c(Id=employmentId);
            delete instanceAcc;
            return 'success';
        }catch(Exception e){
            system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
            return 'Error Occured';
            }
       }
       public String deletePublication(String publicationId){
        try{
            Publications_Patents__c instanceAcc = New Publications_Patents__c(Id=publicationId);
            delete instanceAcc;
            return 'success';
        }catch(Exception e){
            system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
            return 'Error Occured';
            }
       }
       public String deleteEducationLineItem(String eduId){
        try{
            Education_Details__c instanceEdu = New Education_Details__c(Id=eduId);
            delete instanceEdu;
            return 'success';
        }catch(Exception e){
            system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
            return 'Error Occured';
            }
       }

    //    Commented By Harsh 
    //    public String submitSingApp(String projectId, Integer year, Integer month, Integer day){
    //     try{
    //         Contact conRec = [Select Id,Name,Declaration_Sign_Date__c,Proposals__c FROM Contact WHERE Proposals__c =:projectId AND Is_Primary__c = true];
    //         if(year!=0){
    //             Date newDate=Date.newInstance(year,month,day);
    //             conRec.Declaration_Sign_Date__c=newDate;
    //         }
    //         update conRec;
    //         Application_Proposal__c updateProposal=new Application_Proposal__c(Id=projectId);
    //         updateProposal.Proposal_Stages__c='Submitted';
    //         updateProposal.Submitted__c = true;
    //         update updateProposal;
    //         return 'success';
    //     }catch(Exception e){
    //         system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
    //         return 'Error Occured';
    //         }
    //    }


    //  ****************ADDED By Harsh**************
    public String submitSingApp(String projectId, Integer year, Integer month, Integer day){
        try{
           
            Applicant_Proposal_Association__c apaRec = [Select Id,Name, Contact__r.Declaration_Sign_Date__c, Proposals__c FROM Applicant_Proposal_Association__c Where Proposals__c =:projectId AND Contact__r.Is_Primary__c = true];

            if(year!=0){
                Date newDate=Date.newInstance(year,month,day);
                apaRec.Contact__r.Declaration_Sign_Date__c=newDate;
                
                Contact con = new Contact();
                con.id = apaRec.Contact__c;
                con.Declaration_Sign_Date__c=newDate;
                update con;
            }
            update apaRec;

            
            Application_Proposal__c updateProposal=new Application_Proposal__c(Id=projectId);
            updateProposal.Proposal_Stages__c='Submitted';
            updateProposal.Submitted__c = true;
            update updateProposal;
            return 'success';
        }catch(Exception e){
            system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
            return 'Error Occured';
            }
       }



       public String UploadAttachments(String attachmentBody, String attachmentName, string cvId, String udId) {
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
       public static String doUploadAttachment(string type, String attachmentBody, String attachmentName,string conId, String fileId, string userDocId) {
           system.debug('appId--'+attachmentName+'---attachmentId---'+userDocId+'---userDocId---');
           try {
            if(type == 'profilePic' && String.isNotEmpty(conId)){
                if( String.isBlank(userDocId)){
                    User_Document__c udoc = New User_Document__c(Name='Profile Picture',contact__c=conId);
                    insert udoc;
                    userDocId = udoc.Id;
                }
            }
            System.debug('userDocId: ' + userDocId);
            if(String.isBlank(fileId)) {
                ContentVersion conVer = new ContentVersion();
                conVer.ContentLocation = 'S'; // to use S specify this document is in Salesforce, to use E for external files
                conVer.PathOnClient = 'attachmentName'; // The files name, extension is very important here which will help the file in preview.
                conVer.Title = attachmentName; // Display name of the files
                conVer.VersionData = EncodingUtil.base64Decode(attachmentBody); // converting your binary string to Blog
                conVer.isMajorVersion = false;
                insert conVer;    //Insert ContentVersion
                
                System.debug('conVer: ' + conVer);
                ContentDistribution cdl = new ContentDistribution();
                cdl.ContentVersionId = conVer.Id;
                cdl.Name = 'PublicShare';
                cdl.RelatedRecordId = userDocId;
                insert cdl;
                system.debug('ContentDistribution----'+cdl);
                // First get the Content Document Id from ContentVersion Object
                Id conDoc = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:conVer.Id].ContentDocumentId;
                //create ContentDocumentLink  record 
                ContentDocumentLink conDocLink = New ContentDocumentLink();
                conDocLink.LinkedEntityId = userDocId; // Specify RECORD ID here i.e Any Object ID (Standard Object/Custom Object)
                conDocLink.ContentDocumentId = conDoc;  //ContentDocumentId Id from ContentVersion
                conDocLink.shareType = 'V';
                insert conDocLink;
               
                    system.debug('update User doc---'+conVer.Id);
                 //    User_Document__c udoc = New User_Document__c(id=userDocId,Status__c='Uploaded',User_Document_Attachment_Id__c=conVer.Id);
                 //    update udoc;
                 if(type == 'profilePic' && String.isNotEmpty(conId)){
                    updateContactProfilepicId(conId,conVer.Id);
                }
                return conVer.Id;
            }else{
                List<ContentVersion> cvList = [SELECT Id, VersionData FROM ContentVersion WHERE Id = :fileId];
                if(!cvList.isEmpty()) {
                    ContentVersion cVersion = cvList[0];
                    if(cVersion.VersionData != null) {
                        String newBody = EncodingUtil.base64Encode(cVersion.VersionData);
                        newBody += attachmentBody;
                        cVersion.VersionData = EncodingUtil.base64Decode(newBody); // converting your binary string to Blog
                        update cVersion;
                        system.debug('update User doc    2---'+cVersion.Id);
                     //    User_Document__c udoc = New User_Document__c(id=userDocId,Status__c='Uploaded',User_Document_Attachment_Id__c=cVersion.Id);
                     //    update udoc;
                     if(type == 'profilePic' && String.isNotEmpty(conId)){
                        updateContactProfilepicId(conId,cVersion.Id);
                    }
                        return cVersion.Id;
                    } 
                    return 'error';   
                }
                return 'error'; 
            }
           
           }
           catch (Exception ex) {
            System.debug('ex line: ' +ex.getLineNumber()+'---getMessage-----'+ex.getMessage());
            return 'error'; 
           }           
       }

       public static void updateContactProfilepicId(string conId,string picAttId){
        Contact conRec = New Contact(id=conid,Profile_Pic_Attachment_Id__c=picAttId);
        update conRec;
    }

    public static contact getContactInfoWiser(string conId){
        Contact conRec = [SELECT Id,Salutation,FirstName,Institution_Name__c,LastName,Country__c,MailingCity,MailingState,MailingCountry,MailingPostalCode, MailingStreet,Nationality__c,Institute_Name__c,Department,Country_Code__c,Designation__c,Phone,Email, Homepage_URL__c,Gender__c, Birthdate,Proposals__c,Profile_Pic_Attachment_Id__c,Account.Name,Uploaded__c,(select name,id from Attachments Order By CreatedDate DESC limit 1) FROM Contact WHERE Id=: conId];
        return conRec;
    }

    public static list<UserDocumentWrapper> getContactUserDoc(id parentId) {
        try{
            list<UserDocumentWrapper> udWrapperList = New List<UserDocumentWrapper>();
            map<string,ContentDocumentLink> userDocIdXcdLink = New map<string,ContentDocumentLink>();
            map<string,ContentDistribution> userDocIdXcDistrbtn = New map<string,ContentDistribution>();

            map<string,User_Document__c> idXUserDoc = New Map<string,User_Document__c>();
            map<string,ContentDocumentLink> udIdXcdLink = New Map<string,ContentDocumentLink>();
             list<User_Document__c> getUserDoc = [select name,id,Status__c from User_Document__c where Contact__c =:parentId];
            system.debug('getUserDoc----'+getUserDoc);
            set<string> userDocIdSet = New set<string>();
            for(User_Document__c userDoc:getUserDoc){
                userDocIdSet.add(userDoc.id);
                idXUserDoc.put(userDoc.Id,userDoc);
            }
           
           list<ContentDocumentLink> allDocuments = [SELECT Id, LinkedEntityId, ContentDocumentId, Visibility, IsDeleted, ShareType,
            ContentDocument.Title, ContentDocument.createdDate, ContentDocument.FileType FROM ContentDocumentLink WHERE LinkedEntityId IN:userDocIdSet];
            List<ContentDistribution> ContentDistrbtn = [SELECT DistributionPublicUrl,PdfDownloadUrl,RelatedRecordId FROM ContentDistribution where RelatedRecordId IN :userDocIdSet];
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
            ContentVersion[] cvs = [SELECT Id, Title, ContentDocumentId from  contentversion where isLatest=true and ContentDocumentId IN :allDocId];
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
                    if(eli.Expense_Type__c != '' && eli.Year1_Expense__c >0){
                        
                        if(!firstYearSet.contains(eli.Expense_Type__c)){
                            Expense_Head__c exHead = new Expense_Head__c();
                            system.debug('eli.Expense_Head__c::'+eli.Expense_Head__c);
                            
                            exHead.Name = eli.Expense_Type__c;
                            if(mapofYearIdByHeadId.get(mapofYearByExpense.get('year1').Id) != null){
                                for(Expense_Head__c exHead2 : mapofYearIdByHeadId.get(mapofYearByExpense.get('year1').Id)){
                                    if(exHead.Name == exHead2.Name){
                                        exHead.Id = exHead2.id;
                                    }
                                }
                            }
                            
                            exHead.Yearly_Expense__c = mapofYearByExpense.get('year1').Id;
                            firstYearSet.add(eli.Expense_Type__c);
                            expenseHeadTobeInsert.add(exHead);
                        }
                        
                    }
                    if(eli.Expense_Type__c != '' && eli.Year2_Expense__c > 0){
                        if(!secondYearSet.contains(eli.Expense_Type__c)){
                            Expense_Head__c exHead = new Expense_Head__c();
                            exHead.Name = eli.Expense_Type__c;
                            if(mapofYearIdByHeadId.get(mapofYearByExpense.get('year2').Id) != null){
                                for(Expense_Head__c exHead2 : mapofYearIdByHeadId.get(mapofYearByExpense.get('year2').Id)){
                                    if(exHead.Name == exHead2.Name){
                                        exHead.Id = exHead2.id;
                                    }
                                }
                            }
                            
                            exHead.Yearly_Expense__c = mapofYearByExpense.get('year2').Id;
                            secondYearSet.add(eli.Expense_Type__c);
                            expenseHeadTobeInsert.add(exHead);
                        }
                        
                    }
                    if(eli.Expense_Type__c != '' && eli.Year3_Expense__c > 0){
                        if(!thirdYearSet.contains(eli.Expense_Type__c)){
                            Expense_Head__c exHead = new Expense_Head__c();
                            exHead.Name = eli.Expense_Type__c;
                            if(mapofYearIdByHeadId.get(mapofYearByExpense.get('year3').Id) != null){
                                for(Expense_Head__c exHead2 : mapofYearIdByHeadId.get(mapofYearByExpense.get('year3').Id)){
                                    if(exHead.Name == exHead2.Name){
                                        exHead.Id = exHead2.id;
                                    }
                                }
                            }
                            
                            exHead.Yearly_Expense__c = mapofYearByExpense.get('year3').Id;
                            thirdYearSet.add(eli.Expense_Type__c);
                            expenseHeadTobeInsert.add(exHead);
                        }
                        
                    }
                    
                    
                }
                system.debug('expenseHeadTobeInsert::'+expenseHeadTobeInsert);
                if(!expenseHeadTobeInsert.isEmpty()){
                    upsert expenseHeadTobeInsert;
                }
                if(exheadList.isEmpty()){
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
                    if(eli.Year1_Expense__c > 0){
                        Expense_Line_Item__c newELI = New Expense_Line_Item__c();
                        //newELI = eli;
                        newELI.Description__c = eli.Description__c;
                        newELI.Multiplier__c = eli.Multiplier__c;
                        newELI.Unit_Price__c = eli.Unit_Price__c;
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
                        newELI.Year2_Expense__c = 0;
                        newELI.Year3_Expense__c = 0;
                        newELI.Year1_Expense__c = eli.Year1_Expense__c;
                        newELI.Year1_Approved_Amount__c = eli.Year1_Approved_Amount__c;
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
                    if(eli.Year2_Expense__c > 0){
                        Expense_Line_Item__c newELI = New Expense_Line_Item__c();
                        //newELI = eli;
                        newELI.Description__c = eli.Description__c;
                        newELI.Multiplier__c = eli.Multiplier__c;
                        newELI.Unit_Price__c = eli.Unit_Price__c;
                        newELI.Year1_Expense__c = 0;
                        newELI.Year3_Expense__c = 0;
                        newELI.Year2_Expense__c = eli.Year2_Expense__c;
                        newELI.year2_Approved_Amount__c = eli.year2_Approved_Amount__c;
                        for(Expense_Head__c exHead : mapofYearidByExpenseHead.get(mapofYearByExpense.get('year2').Id)){
                            if(eli.Expense_Type__c == exHead.Name){
                                newELI.Expense_Head__c = exHead.Id;
                            }
                        }
                        //newELI.Expense_Head__c = mapofYearidByExpenseHead.get(mapofYearByExpense.get('year2').Id).Id;
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
                    if(eli.Year3_Expense__c > 0){
                        Expense_Line_Item__c newELI = New Expense_Line_Item__c();
                        //newELI = eli;
                        newELI.Description__c = eli.Description__c;
                        newELI.Multiplier__c = eli.Multiplier__c;
                        newELI.Unit_Price__c = eli.Unit_Price__c;
                        newELI.Year1_Expense__c = 0;
                        newELI.Year2_Expense__c = 0;
                        newELI.Year3_Expense__c = eli.Year3_Expense__c;
                        newELI.Year3_Approved_Amount__c = eli.Year3_Approved_Amount__c;
                        for(Expense_Head__c exHead : mapofYearidByExpenseHead.get(mapofYearByExpense.get('year3').Id)){
                            if(eli.Expense_Type__c == exHead.Name){
                                newELI.Expense_Head__c = exHead.Id;
                            }
                        }
                        //newELI.Expense_Head__c = mapofYearidByExpenseHead.get(mapofYearByExpense.get('year3').Id).Id;
                        newELI.index__c = eli.Index__c;
                        system.debug('newELI.index__c::'+newELI.index__c);
                        system.debug('newELI.index__c::'+newELI.Expense_Head__c);
                        system.debug('newELI.index__c::'+mapofHeadIdByLineItems.get(newELI.Expense_Head__c));
                        if(mapofHeadIdByLineItems.get(newELI.Expense_Head__c) != null){
                            for(Expense_Line_Item__c eli2 : mapofHeadIdByLineItems.get(newELI.Expense_Head__c)){
                                if(eli2.index__c == newELI.index__c){
                                    newELI.Id = eli2.Id;
                                }
                            } 
                        }
                        expenseLineItemTobeInsert.add(newELI);
                    }
                    
                }
            }
        }
        system.debug('expenseLineItem::'+expenseLineItemTobeInsert);
        upsert expenseLineItemTobeInsert;
        return 'success';
    }
    
    public String reviewAppDocGen(string proID){
        try{
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

    //    ***********************************************************************************************************************
            // Changed by Harsh Gupta on 28-09-2020
    //    public static Account getProposalAccounts(String ProposalId){
    //     List<Account> acc=[SELECT id,name,Country_Type__c,proposals__r.Duration_In_Months_Max_36__c,(SELECT Id,Name,MailingCountry FROM Contacts) from Account where proposals__c=:ProposalId limit 1];
    //     return acc[0];
    // } 

    public static ProposalAccountWrapper getProposalAccounts(String ProposalId, String loginHashCode){
    
        Applicant_Proposal_Association__c apa = [
            SELECT Id, Name, Proposals__r.Duration_In_Months_Max_36__c, Contact__c, Contact__r.AccountId  
            FROM Applicant_Proposal_Association__c 
            WHERE Proposals__c = :ProposalId 
            AND Contact__r.Login_Hash_Code__c = :loginHashCode 
            LIMIT 1
        ];

        List<Account> acc = [
            SELECT Id, Name, Country_Type__c, 
                (SELECT Id, Name, MailingCountry FROM Contacts) 
            FROM Account 
            WHERE Id = :apa.Contact__r.AccountId
        ];
        
        return new ProposalAccountWrapper(acc[0], apa.Proposals__r.Duration_In_Months_Max_36__c);
    }
    
    public class ProposalAccountWrapper {
        @AuraEnabled
        public Account accountDetail { get; set; }
        
        @AuraEnabled
        public Decimal durationInMonths { get; set; }
        
        public ProposalAccountWrapper(Account acc, Decimal duration) {
            this.accountDetail = acc;
            this.durationInMonths = duration;
        }
    }

// **********************************************************************************************************************************************

    public static String LogoutApplicant(String loginHasgCode){
        try{
            contact conRec = [select name,id,Proposals__c from contact where Login_Hash_Code__c =:loginHasgCode limit 1];
            /*commented this logic to resolve login hash code issue and added below logic
            conRec.Login_Hash_Code__c=null;
            update conRec;
			*/
            return 'success';
        }
        catch(Exception e){
            system.debug('The Error :: '+e.getMessage()+' AND Line No :: '+e.getLineNumber()+'');
            return 'Exception';
        }
    }
       
    public static List<Expense_Head__c> getExpenseRecords(String ProposalId){
        list<Expense_Head__c> allExpHead = [select name,id,Proposals__c,Proposals__r.Total_funding_requested_from_IGSTC__c,(select name,Description__c,Currency_Type__c,Expense_Head__c,Expense_Type__c,Year1_Expense__c,Year2_Expense__c,Year3_Expense__c from Expense_Line_Items__r) from Expense_Head__c where Proposals__c =:ProposalId];
          
          return allExpHead;
      }

      public static list<Expense_Head__c> createExpenceHead(list<Expense_Head__c> allExpenceHead){
        insert allExpenceHead;
        return allExpenceHead;
      }

      public static String saveExpenceLineItem(List<Expense_Line_Item__c> expLineItem, string appId, Integer amount){
        
        try{
            system.debug('expLineItem ---->'+expLineItem);
            system.debug('amount ---> '+amount);
            // if(amount == null){
            //     amount = 0;
            // }
            Application_Proposal__c appRecordToUpdate = New Application_Proposal__c();
            appRecordToUpdate.Id = appId;
            appRecordToUpdate.Total_funding_requested_from_IGSTC__c = string.valueOf(amount);
            system.debug('appRecordToUpdate.Total_funding_requested_from_IGSTC__c -----> '+appRecordToUpdate.Total_funding_requested_from_IGSTC__c);
            if(!string.isBlank(appRecordToUpdate.Total_funding_requested_from_IGSTC__c)){
                upsert appRecordToUpdate;
            }
            system.debug('After Insertion -----> '+appRecordToUpdate.Total_funding_requested_from_IGSTC__c);

            if(!expLineItem.isEmpty()){
                upsert expLineItem;
            }
            return 'success';
        }catch(Exception e){
            return 'error';
        }
    }

    public static String saveExpenceLineItemWISER(List<Expense_Line_Item__c> expLineItem, String totalSum){
        try{
            system.debug('expLineItem ---->'+expLineItem);
            if(!expLineItem.isEmpty()){
                upsert expLineItem;
            }
            Expense_Head__c expenseHeadRecord = [SELECT Id,Name,Proposals__c FROM Expense_Head__c WHERE Id =: expLineItem[0].Expense_Head__c];
            Application_Proposal__c appProposal = [SELECT Id,Name,Total_funding_requested_from_IGSTC__c FROM Application_Proposal__c WHERE Id =: expenseHeadRecord.Proposals__c];
            system.debug('appProposal ---->'+appProposal);
            if(appProposal != null){
                appProposal.Total_funding_requested_from_IGSTC__c = totalSum;
                upsert appProposal;
            }
            system.debug('appProposal2 ---->'+appProposal);
            return 'success';
        }catch(Exception e){
            return e.getMessage()+e.getLineNumber();
        }
    }

    public static Bank_Details__c getBankDetails(string projectId){
        List<Account> accList = [select name,id from Account where Proposals__c =:projectId];
        if (accList.size() >0) {
            List<Bank_Details__c> bankDetailsList = [select id,Account_Name__c,Bank_Account_Number__c,Bank_Address__c,Bank_Branch_Name__c,Name,Bank_IFSC_Code__c,Bank_Name__c from Bank_Details__c where Account__c =:accList[0].Id];
            if(bankDetailsList.size() >0){
                return bankDetailsList[0];
            }else{
                return New Bank_Details__c(Account__c=accList[0].Id);
            }
        }
        return null;
    }
    public String UploadDocuments(String attachmentBody, String attachmentName, string cvId, String udId,string docName,string contactId,string proposalId,string CreateTask,string TaskSubject) {
        system.debug('attachmentBody---'+attachmentName+'---attachmentId---'+cvId+'---cvId---'+udId);
        system.debug('cvId---'+cvId+'---udId---'+udId);
        User_Document__c userDocc = New User_Document__c();
        userDocc.Id = udId;
        userDocc.Status__c = 'Uploaded';
        userDocc.Name = docName;
        userDocc.Contact__c=contactId;
        //userDocc.Proposal_Application__c=proposalId;
        upsert userDocc;
        udId=userDocc.Id;
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
                    if(CreateTask=='Create'){
                        Task taskRecord = New Task();
                        taskRecord.WhatId = proposalId;
                        taskRecord.Subject = TaskSubject;
                        insert taskRecord;
                    }
                    return cVersion.Id;
                }   
            }
        }
        return 'Success';
    }
    public String saveBankDet(Bank_Details__c instanceBank){
        try{
            upsert instanceBank;
            return instanceBank.Id;
        }
        catch(Exception e){
            system.debug('Error Message::=>'+e.getMessage());
            system.debug('Error Line Number::=>'+e.getLineNumber());
            return 'exception';
        }
    }

   public class AccountListWrapper{
    public Account accnt;
    public Boolean isSelected;
    public String accountMappingId;
}
public class WrapperDate{
    String GroupName;
    String fromTo;
    integer year;
    integer month;
    integer day;
}
   public class WrapperWorkpackageDet {
    public String duration;
    public String end_trl_level;
    public String trl_level;
    public String title;
    public String Id;
    public String WPSequence;
    public String ExternalId;
    public String Workpackage_detail;
    public List<AccountListWrapper> AccountListWrapper;
    
}
public class employmentWrapper{
    public Employment_Details__c employmentDetails;
}
public class UserDocumentWrapper{
    public User_Document__c userDocument;
    public ContentVersion contentVersion;
    public ContentDistribution ContentDistribution;
}
}