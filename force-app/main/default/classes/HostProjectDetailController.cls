/**
 * @author [Dinesh B]
 * @email dinesh.b@utilitarianLab.com
 * @create date 2022-10-11 17:59:44
 * @modify date 2022-10-11 17:59:44
 * @desc [description]
 */

public without sharing class HostProjectDetailController {

    @RemoteAction
    public Static List<Contact> getHostProjectDetails(String proposalId){
    List<contact> conRecList = [SELECT Id,name,(SELECT Id, Name,Title__c,Contact__c,Abstract__c,End_Date__c,Funding_source__c,Start_Date__c FROM Host__r) FroM Contact WHERE Proposals__c =:proposalId];
    System.debug('conRecList ::'+conRecList);
    return conRecList;

    }

    @RemoteAction
    public Static String insertHostProjectDetails(List<Host__c> hostDetails,Integer startDay, Integer startMonth, Integer startYear, Integer endDay, Integer endMonth, Integer endYear, String conId){
        if(startDay == 00 && startMonth == 00 && startYear == 00){
        }
        else{
            for(Host__c hos : hostDetails){
                hos.Start_Date__c = Date.newInstance(startYear, startMonth, startDay);
            }
        }
        if(endDay == 00 && endMonth == 00 && endYear == 00){ 
        }
        else{
            for(Host__c hos : hostDetails){
                hos.End_Date__c =Date.newInstance(endYear, endMonth, endDay);
            }
        }
        upsert hostDetails;
        Contact con = new Contact(Id = conId);
        update con;
        return 'SUCCESS';
    }

    @RemoteAction
    public Static List<Host__c> insertHostList(List<wrapperListHost> wrapperList){
        try{
            List<Host__c> hostListToUpsert = new List<Host__c>();
            for(wrapperListHost wrap : wrapperList){
                Host__c HO = new Host__c();
                if(wrap.startYear !=0){
                    HO.Start_Date__c = Date.newInstance(wrap.startYear,wrap.startMonth,wrap.startDay);
                }
                if(wrap.EndYear !=0){
                    HO.End_Date__c = Date.newInstance(wrap.endYear,wrap.endMonth,wrap.endDay);
                }
                Ho.Name = wrap.HostList.Name;
                Ho.Title__c = wrap.HostList.Title__c;
                Ho.Abstract__c = wrap.HostList.Abstract__c;
                HO.Id = wrap.hostList.Id;
                HO.Contact__c = wrap.contactId;
                hostListToUpsert.add(HO);
            }
            upsert hostListToUpsert;
            return hostListToUpsert;
        }catch(Exception e){
                System.debug('The Error '+e.getMessage()+'Erron Line '+e.getLineNumber());
                return null;
            }
    }


    public class wrapperListHost{
        public Host__c HostList;
        public Integer startDay;
        public Integer startMonth;
        public Integer startYear;
        public Integer EndDay;
        public Integer EndMonth;
        public Integer EndYear;
        public String contactId;
    }




    //=============================== Controller for Two Reference ================================================================================================================

    @RemoteAction
    public Static List<References__c> getProposalDetails(String proposalId){
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
    public static void deleteParticipants(string partcpntId){
        delete New References__c(Id=partcpntId);
    }

    // =============================================== Controller for Projects handles/grant application =========================================================================

    @RemoteAction
    public static List<Existing_Grants__c> getExistingGrantsDetails1(String proposalId){
        try{
            List<Account> accListBasedOnProsalid = [SELECT Id,Name,Proposals__c FROM Account WHERE Proposals__c =: proposalId];
            Set<Id> IdSet = new Set<Id>();
            for(Account acc : accListBasedOnProsalid){
                IdSet.add(acc.Id);
            }
            System.debug('accListBasedOnProsalid ::'+accListBasedOnProsalid.size());
            List<Existing_Grants__c> getExigrantBasedOnAccId = [SELECT Id,Name,Account__c,Account__r.Name,Title__c,Funding_Agency__c,Budget__c,Duration__c FROM Existing_Grants__c WHERE Account__c IN: IdSet];
           // System.debug('getExigrantBasedOnAccId ::'+getExigrantBasedOnAccId);
            for(Existing_Grants__c EX : getExigrantBasedOnAccId){
                System.debug('Result ::'+Ex.Account__r.Name);
            }
            return getExigrantBasedOnAccId;
          //  return null;
        }catch(Exception e){
                System.debug('The Error '+e.getMessage()+'Erron Line '+e.getLineNumber());
                return null;
            }
    }

    // Update V1
    @RemoteAction
    public static List<Account> getExistingGrantsDetails(String proposalId){
        List<Account> getAccountList = [SELECT Id,Name,Proposals__c,(SELECT Id,Name,Title__c,Funding_Agency__c,Budget__c,Duration__c FROM Existing_Grants__r) FROM Account WHERE Proposals__c =: proposalId];
        System.debug('getAccountList ::'+getAccountList);
        for(Account acc : getAccountList){
            System.debug('acc And Host :'+acc.Name+'//'+acc.Existing_Grants__r);
        }
        return getAccountList;
    }

    @RemoteAction
    public static Account getgarntList(string userId){
        try{
            Contact conRec = [SELECT Id,Name,AccountId FROM Contact WHERE Login_Hash_Code__c=: userId];
            system.debug('conRec'+conRec);
            Account accRec = [SELECT Id,Name,(SELECT Id,Name,Title__c,Funding_Agency__c,Budget__c,Duration__c FROM Existing_Grants__r) FROM Account Where Id=: conRec.AccountId];
            return accRec;
        }catch(Exception e){
            return null;
        }
    }

    
    // Updated Class
    @RemoteAction
    public Static  List<Existing_Grants__c>  insertExistingGrantsListApex(List<wrapperList> EGListToInsertList){
     system.debug('EGListToInsertList ::'+EGListToInsertList); 
try{
    List<Existing_Grants__c> GranttoInsertList = new List<Existing_Grants__c>();
    for(wrapperList wrap : EGListToInsertList){
        Existing_Grants__c EG = new Existing_Grants__c();
        if(wrap.startYear !=0){
            // EG.Starting_Date__c = Date.newInstance(wrap.startYear,wrap.startMonth,wrap.startDay);
        }
       EG.Title__c=wrap.EGList.Title__c;
       EG.Funding_Agency__c=wrap.EGList.Funding_Agency__c;
       EG.Budget__c = wrap.EGList.Budget__c;
       EG.Duration__c = wrap.EGList.Duration__c;
       EG.Id=wrap.EGList.Id;
    //    EG.Starting_Date__c = wrap.EGList.Starting_Date__c;
       EG.Account__c = wrap.accId;
       GranttoInsertList.add(EG);
      }
        system.debug('GranttoInsertList ::'+GranttoInsertList);
        upsert GranttoInsertList;

      return GranttoInsertList;
}catch(Exception e){
    System.debug('Error :'+e.getMessage()+' Line :'+e.getLineNumber());
   return null;
}
    }

// For Delete
@RemoteAction
public Static String deleteExistGrant(String ExistGrantId){
    try{
        List<Existing_Grants__c> deletGrantList = [SELECT Id,Name FROM Existing_Grants__c WHERE ID =:ExistGrantId];
        System.debug('deletGrantList ::'+deletGrantList);
        delete deletGrantList;
      
        return 'SUCCESS';
    }catch(Exception e){
            System.debug('The Error '+e.getMessage()+'Erron Line '+e.getLineNumber());
            return null;
        }
}

// Wrapper For insertExistingGrants 612 : Proposal_Controller: Method: insertPairingDetails

public class wrapperList{
    public Existing_Grants__c EGList;
    public Integer startDay;
    public Integer startMonth;
    public Integer startYear;
   // public String proposalId;
    public String accId;
}


    // =============================================== Controller for Attachments & Declaration  =========================================================================

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

    @RemoteAction
    public static List<Account> getApplicantDetailsForGrantWISER(string applicantHashCode){
        contact conRec = [select name,id,Proposals__c,AccountId,Account.Name from contact where Id =:applicantHashCode limit 1];
        System.debug('conRec-----'+conRec);
        list<Account> applicantList = New list<Account>();
        if(conRec.AccountId != null){
            system.debug('applicantList-----'+applicantList);
            applicantList = [select Id,Name,Proposals__c,(SELECT Id,Title__c,Funding_Agency__c,Budget__c,Duration__c,Account__c,Application__c FROM Existing_Grants__r),(Select Id,Login_Hash_Code__c From Contacts) from Account where Proposals__c=:conRec.Proposals__c];
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

  
    
}