public withOut sharing class Meeting_Theme_Controller {

    @RemoteAction
    public static list<MeetingThemeWrapper> getMeetingThemeDetails(string proposalId){
        List<Meeting_Theme__c>  meetingThemeList = [select name,id,Meeting_Date__c,External_Id__c,(select name,id from Meeting_Themes__r) from Meeting_Theme__c where Meeting_Date__c != null AND  Proposals__c=:proposalId];
        System.debug('meetingThemeList: ' +meetingThemeList);
        List<Meeting_Theme__c>  meetingThemeNameList = [select name,id,Meeting_Theme__c,Meeting_Theme_Title__c,Meeting_Date__c,External_Id__c,(select name,id,Start_Time__c,End_Time__c,Attendees__c,Purpose__c from Meeting_Agenda__r) from Meeting_Theme__c where Meeting_Theme__r.Proposals__c=:proposalId];
        System.debug('meetingThemeNameList: ' +meetingThemeNameList);
        Map<string, list<MeetingAgendaWrapper>> mThemeXmAgenda = new Map<string,list<MeetingAgendaWrapper>>();
        for (Meeting_Theme__c metingTheme : meetingThemeNameList) {
            list<MeetingAgendaWrapper> meetingAgendaList = New list<MeetingAgendaWrapper> ();
            for(Meeting_Agenda__c mAgenda:metingTheme.Meeting_Agenda__r){
                MeetingAgendaWrapper meetingAgenda = New MeetingAgendaWrapper();
                meetingAgenda.mAgenda = mAgenda;
                if(mAgenda.Start_Time__c != null){
                    meetingAgenda.sHour = mAgenda.Start_Time__c.hour();
                    meetingAgenda.smin = mAgenda.Start_Time__c.minute();
                }
                if(mAgenda.End_Time__c != null){
                    meetingAgenda.eHour = mAgenda.End_Time__c.hour();
                    meetingAgenda.emin = mAgenda.End_Time__c.minute();
                }
                meetingAgendaList.add(meetingAgenda);
            }
            mThemeXmAgenda.put(metingTheme.Id,meetingAgendaList);
        }
        List<MeetingDetails> MeetingDetlList = New List<MeetingDetails>();
        Map<string, List<MeetingDetails>> meetingThemeIdXmdList = new Map<string, List<MeetingDetails>>();
        List<Meeting_Agenda__c> allMeetingAgenda = New List<Meeting_Agenda__c>();
        for (Meeting_Theme__c mTheme : meetingThemeNameList) {
            if(meetingThemeIdXmdList.containsKey(mTheme.Meeting_Theme__c)){
                MeetingDetails mDetail = New MeetingDetails();
                mDetail.meetingTopic = mTheme;
             //   mDetail.meetingAgenda = mTheme.Meeting_Agenda__r;
             mDetail.meetingAgenda = mThemeXmAgenda.get(mTheme.Id);
                allMeetingAgenda.add(mTheme.Meeting_Agenda__r);
                List<MeetingDetails> mdList = meetingThemeIdXmdList.get(mTheme.Meeting_Theme__c);
                mdList.add(mDetail);
                meetingThemeIdXmdList.put(mTheme.Meeting_Theme__c,mdList);
            }else{
                MeetingDetails mDetail = New MeetingDetails();
                mDetail.meetingTopic = mTheme;
             //   mDetail.meetingAgenda = mTheme.Meeting_Agenda__r;
             mDetail.meetingAgenda = mThemeXmAgenda.get(mTheme.Id);
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

    @RemoteAction
    // integer finalYear, integer finalMonth, integer finalDay,  
    Public static string saveMeetingThemeDetails(String meetingThemeWrapperString, string proposalId){

        System.debug('meetingThemeWrapperString: ' +meetingThemeWrapperString );
        Application_Proposal__c appProposal = [SELECT Id,Name From Application_Proposal__c WHERE Id =: proposalId];
        // if(finalDay==0 && finalMonth==0 && finalYear==0){
                
        // }else{
        //     appProposal.Workshop_Finish_Date__c = Date.newInstance(finalYear, finalMonth, finalDay);
        // }
        update appProposal;
        List<MeetingThemeWrapper> meetingThemeWrapper  = (List<MeetingThemeWrapper>)JSON.deserialize(meetingThemeWrapperString,List<MeetingThemeWrapper>.class);
        List<Meeting_Theme__c> meetingThemeToUpdate = new List<Meeting_Theme__c>();
        System.debug('meetingThemeWrapper: ' +meetingThemeWrapper );
        Map<string, list<Meeting_Theme__c>> extrnalIdXchildMeetingTheme = new Map<string, list<Meeting_Theme__c>>();
        Map<string, list<MeetingAgendaWrapper>> extrnalIdXMeetingAgendaWrapper = new Map<string, list<MeetingAgendaWrapper>>();
        for(meetingThemeWrapper mtWrapper:meetingThemeWrapper){
            if(mtWrapper.meetingYear !=0){
                System.debug('mtWrapper.meetingYear: ' +mtWrapper.meetingYear);
                System.debug('mtWrapper.meetingMonth: ' +mtWrapper.meetingMonth);
                System.debug('mtWrapper.meetingYear: ' +mtWrapper.meetingYear);
                mtWrapper.meetingTheme.Meeting_Date__c = Date.newInstance(mtWrapper.meetingYear,mtWrapper.meetingMonth,mtWrapper.meetingDay);
            }
            meetingThemeToUpdate.add(mtWrapper.meetingTheme);
                for(MeetingDetails meetingDetl:mtWrapper.MeetingDetailList){
                    if(extrnalIdXchildMeetingTheme.containsKey(mtWrapper.meetingTheme.External_Id__c)){
                    list<Meeting_Theme__c> mtListToBeAdded = extrnalIdXchildMeetingTheme.get(mtWrapper.meetingTheme.External_Id__c);
                    mtListToBeAdded.add(meetingDetl.meetingTopic);
                    extrnalIdXchildMeetingTheme.put(mtWrapper.meetingTheme.External_Id__c,mtListToBeAdded);
                    }else{
                        extrnalIdXchildMeetingTheme.put(mtWrapper.meetingTheme.External_Id__c,New List<Meeting_Theme__c>{meetingDetl.meetingTopic});
                    }
                    System.debug('meetingDetl.meetingTopic.External_Id__c: ' +meetingDetl.meetingTopic.External_Id__c);
                    if(extrnalIdXMeetingAgendaWrapper.containsKey(meetingDetl.meetingTopic.External_Id__c)){
                        List<MeetingAgendaWrapper> meetingAgendaList = extrnalIdXMeetingAgendaWrapper.get(meetingDetl.meetingTopic.External_Id__c);
                        System.debug('meetingDetl.meetingAgenda: ' +meetingDetl.meetingAgenda );
                        meetingAgendaList.addAll(meetingDetl.meetingAgenda);
                        System.debug('meetingAgendaList: ' +meetingAgendaList);
                        extrnalIdXMeetingAgendaWrapper.put(meetingDetl.meetingTopic.External_Id__c,meetingAgendaList);
                    }else{
                        System.debug('meetingDetl.meetingAgenda: ' +meetingDetl.meetingAgenda );
                        extrnalIdXMeetingAgendaWrapper.put(meetingDetl.meetingTopic.External_Id__c,meetingDetl.meetingAgenda);
                        }
                }
            }
            Map<string,string> meetingDateEIdXmeetingDateId = New map<string,string>();
            Map<string,string> childmThemeEIdXchildmThemeId = New map<string,string>();
            System.debug('meetingThemeToUpdate: ' +meetingThemeToUpdate);
            upsert meetingThemeToUpdate;
            for(Meeting_Theme__c updatedMtheme:meetingThemeToUpdate){
                meetingDateEIdXmeetingDateId.put(updatedMtheme.External_Id__c,updatedMtheme.Id);
            }
            System.debug('meetingDateEIdXmeetingDateId: ' +meetingDateEIdXmeetingDateId);
            List<Meeting_Theme__c> childMeetingThemeToUpdate = new List<Meeting_Theme__c>();
            for(string externalId:extrnalIdXchildMeetingTheme.keySet()){
                for (Meeting_Theme__c mTheme : extrnalIdXchildMeetingTheme.get(externalId)) {
                    mTheme.Meeting_Theme__c = meetingDateEIdXmeetingDateId.get(externalId);
                    childMeetingThemeToUpdate.add(mTheme);
                }
            }
            System.debug('childMeetingThemeToUpdate: ' + childMeetingThemeToUpdate);
            upsert childMeetingThemeToUpdate;
            for(Meeting_Theme__c updatedMtheme:childMeetingThemeToUpdate){
                System.debug('updatedMtheme.External_Id__c: ' +updatedMtheme.External_Id__c+'----'+updatedMtheme.Id );
                childmThemeEIdXchildmThemeId.put(updatedMtheme.External_Id__c,updatedMtheme.Id);
                System.debug('childmThemeEIdXchildmThemeId: ' +childmThemeEIdXchildmThemeId );
            }

            // for(string externalId:extrnalIdXMeetingAgendaWrapper.keySet()){
            //     for (Meeting_Agenda__c mAgenda : extrnalIdXMeetingAgendaWrapper.get(externalId)) {
            //         mAgenda.Meeting_Theme__c = childmThemeEIdXchildmThemeId.get(externalId);
            //         meetingAgendaToUpdate.add(mAgenda);
            //     }
            // }

            System.debug('childmThemeEIdXchildmThemeId: ' +childmThemeEIdXchildmThemeId );
            List<Meeting_Agenda__c> meetingAgendaToUpdate = new List<Meeting_Agenda__c>();
            System.debug('extrnalIdXMeetingAgendaWrapper: ' +extrnalIdXMeetingAgendaWrapper );
            for(string externalId:childmThemeEIdXchildmThemeId.keySet()){
                for(MeetingAgendaWrapper mAgendaWrap : extrnalIdXMeetingAgendaWrapper.get(externalId)) {
                    System.debug('mAgendaWrap: ' + mAgendaWrap);
                    System.debug('externalId: ' + externalId);
                    System.debug('mAgendaWrap.sHour: ' + mAgendaWrap.eHour);
                    System.debug('mAgendaWrap.eMin: ' + mAgendaWrap.eMin);
                    if(mAgendaWrap.sHour != null && mAgendaWrap.sMin != null ){
                        mAgendaWrap.mAgenda.Start_Time__c = Time.newInstance(mAgendaWrap.sHour, mAgendaWrap.sMin, 0, 0);
                    }
                    if(mAgendaWrap.eHour != null && mAgendaWrap.eMin != null ){
                        mAgendaWrap.mAgenda.End_Time__c = Time.newInstance(mAgendaWrap.eHour, mAgendaWrap.eMin, 0, 0);
                    }
                    mAgendaWrap.mAgenda.Meeting_Theme__c = childmThemeEIdXchildmThemeId.get(externalId);
                    System.debug('mAgendaWrap.mAgenda: ' +mAgendaWrap.mAgenda);
                    meetingAgendaToUpdate.add(mAgendaWrap.mAgenda);
                }
            }

            System.debug('extrnalIdXchildMeetingTheme: ' +extrnalIdXchildMeetingTheme);
            System.debug('extrnalIdXMeetingAgendaWrapper: ' +extrnalIdXMeetingAgendaWrapper);
            System.debug('meetingDateEIdXmeetingDateId: ' +meetingDateEIdXmeetingDateId);
            System.debug('childmThemeEIdXchildmThemeId: ' +childmThemeEIdXchildmThemeId);
            System.debug('meetingAgendaToUpdate: ' +meetingAgendaToUpdate);

            upsert meetingAgendaToUpdate;
            return null;
    }
    
    @RemoteAction
    public static void deleteMeetingTheme(string meetingTheme) {
        if(string.isNotBlank(meetingTheme))
            delete New Meeting_Theme__c(id=meetingTheme);
    }

    @RemoteAction
    public static List<MeetingDetails> getMeetingThemeDetailsforSlectdDay(integer day, integer month, integer year, string proposalId){
        if(day != null && month != null && year != null)
            Date selectedDate = date.newInstance(year,month,day);

List<Meeting_Theme__c>  meetingThemeNameList = [select name,id,Meeting_Theme__c,Meeting_Theme_Title__c,Meeting_Date__c,External_Id__c,(select name,id,Start_Time__c,End_Time__c,Attendees__c,Purpose__c from Meeting_Agenda__r) from Meeting_Theme__c where Meeting_Theme__r.Proposals__c=:proposalId];
System.debug('meetingThemeNameList: ' +meetingThemeNameList);
List<MeetingDetails> mDetailList = New List<MeetingDetails>();
        Map<string, list<MeetingAgendaWrapper>> mThemeXmAgenda = new Map<string,list<MeetingAgendaWrapper>>();
        for (Meeting_Theme__c metingTheme : meetingThemeNameList) {
            list<MeetingAgendaWrapper> meetingAgendaList = New list<MeetingAgendaWrapper> ();
            MeetingDetails mDetails = New MeetingDetails();
            for(Meeting_Agenda__c mAgenda:metingTheme.Meeting_Agenda__r){
                MeetingAgendaWrapper meetingAgenda = New MeetingAgendaWrapper();
                meetingAgenda.mAgenda = mAgenda;
                if(mAgenda.Start_Time__c != null){
                    meetingAgenda.sHour = mAgenda.Start_Time__c.hour();
                    meetingAgenda.smin = mAgenda.Start_Time__c.minute();
                }
                if(mAgenda.End_Time__c != null){
                    meetingAgenda.eHour = mAgenda.End_Time__c.hour();
                    meetingAgenda.emin = mAgenda.End_Time__c.minute();
                }
                meetingAgendaList.add(meetingAgenda);
                mDetails.meetingTopic = metingTheme;
                mDetails.meetingAgenda = meetingAgendaList;    
                mDetailList.add(mDetails);          
            }
        }
        
        return mDetailList;
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
        public list<MeetingAgendaWrapper> meetingAgenda; 
    }

    public class MeetingAgendaWrapper{
        public Meeting_Agenda__c mAgenda; 
        public integer sHour;
        public integer sMin;
        public integer eHour;
        public integer eMin;
    }

    @RemoteAction
    public static Application_Proposal__c getWorkshopDates(string applicantHashCode){
        try{
            contact conRec = [select name,id,Proposals__c from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
            system.debug('applicantHashCode' +applicantHashCode);
            Application_Proposal__c proposalRecord;
            if(!string.isBlank(conRec.Proposals__c)){
                proposalRecord = [SELECT Id,Name,Proposed_Date__c,Workshop_Finish_Date__c FROM Application_Proposal__c WHERE Id=: conRec.Proposals__c];
            }
            return proposalRecord;
        }catch(Exception e){
            return null;
        }
    }
}