global class BulkAssignReviewerController {
    
    @RemoteAction
    global static List<Campaign> getCampaign(){
        try{
            List<Campaign> CampaignList = [SELECT Id, Name FROM Campaign];
            return CampaignList;       
        }catch(Exception e){
            return null;
        }
    }
    
    @RemoteAction
    global static List<YealyCall__c> getCampaignYear() {
        try {
            // Query using GROUP BY and store results in a List<AggregateResult>
            List<AggregateResult> groupedResults = [SELECT year__c FROM YealyCall__c GROUP BY year__c];
            
            // Initialize a list to hold the unique YealyCall__c records
            List<YealyCall__c> CampaignYearList = new List<YealyCall__c>();
            
            // Loop through the AggregateResult list and populate CampaignYearList
            for (AggregateResult ar : groupedResults) {
                YealyCall__c yearRecord = new YealyCall__c();
                yearRecord.year__c = (String) ar.get('year__c');
                CampaignYearList.add(yearRecord);
            }
            
            return CampaignYearList;
        } catch (Exception e) {
            return null;
        }
    }
    @RemoteAction
    global static List<Reviewer__c> getReviewer(){
        try{
            List<Reviewer__c> reviewerList = [select Id ,Name From Reviewer__c where Active__c = true ];
            return reviewerList;
        }catch(Exception e){
            return null;
        }
    }
    
    @RemoteAction
    global static List<Application_Proposal__c> catchName(String campaignName,String campaignYear,String reviewerName){
        try{
            //campaignYear='2024';
            system.debug('Campaign Name:'+campaignName);
            // Remove square brackets and spaces, then split by commas
            campaignName = campaignName.replace('[', '').replace(']', '').trim();
            System.debug('campaignName: '+campaignName);
            List<String> idcampaignNameList = campaignName.split(',');
            System.debug('idcampaignNameList: '+idcampaignNameList);
            
            system.debug('Campaign Year:'+campaignYear);
            // Remove square brackets and spaces, then split by commas
            campaignYear = campaignYear.replace('[', '').replace(']', '').trim();
            System.debug('campaignYear: '+campaignYear);
            List<String> yearList = campaignYear.split(',');
            System.debug('yearList: '+yearList);
            
            List<Application_Proposal__c> app = [SELECT Id,Title_Of__c, Name FROM Application_Proposal__c WHERE Campaign__c IN:idcampaignNameList AND Campaign__r.Year__c IN: yearList AND Proposal_Stages__c=: 'Submitted' AND RecordType.DeveloperName != null];
            
            system.debug('app'+app);
            return app;
        }catch(Exception e){
            return null;
        }
    }
    
    // @RemoteAction
    // //global static finalWrapper getProposalAndReviewer(string campaignNName){
    // global static finalWrapper getProposalAndReviewer(string campaignNName,String yearName,String reviewerName){
    //     system.debug('campaignNName ==> '+campaignNName);
    //     system.debug('reviewerName ==> '+reviewerName);
        
    //     	system.debug('yearName:'+yearName);
    //         // Remove square brackets and spaces, then split by commas
    //         yearName = yearName.replace('[', '').replace(']', '').trim();
    //         System.debug('yearName: '+yearName);
    //         List<String> yearList = yearName.split(',');
    //         System.debug('yearList: '+yearList);
            
        
    //     List<Reviewer__c> myreviewerList =new List<Reviewer__c>();
    //     if(reviewerName.equals('a04Ip000000oZ7tIAE')){
    //         myreviewerList = [select Id ,Name From Reviewer__c where Active__c = true ];
    //     }else{
    //         // Remove the square brackets and split the string by commas to create a list of IDs
    //         List<Id> reviewerIds = new List<Id>();
    //         reviewerName = reviewerName.replace('[', '').replace(']', ''); // Remove brackets
    //         List<String> idStrings = reviewerName.split(','); // Split by comma
            
    //         // Trim any leading or trailing spaces and add to the Id list
    //         for (String idStr : idStrings) {
    //             reviewerIds.add(idStr.trim());
    //         }
    //         System.debug('reviewerIds :'+reviewerIds);
    //         System.debug('reviewerIds Size :'+reviewerIds.size());
            
    //         myreviewerList=[select Id ,Name From Reviewer__c where Active__c = true AND Id IN : reviewerIds];
    //     }
    //     System.debug('myreviewerList Ajai :'+myreviewerList);
    //     Set<Id> allReviewer = new Set<Id>(); 
    //     for(Reviewer__c IndiRev: myreviewerList){
    //         allReviewer.add( IndiRev.Id);
    //     }
    //     system.debug('allReviewer ==> '+allReviewer);
    //     system.debug('Campaign Name:'+campaignNName);
    //     // Remove square brackets and spaces, then split by commas
    //     campaignNName = campaignNName.replace('[', '').replace(']', '').trim();
    //     System.debug('campaignName: '+campaignNName);
    //     List<String> idList = campaignNName.split(',');
    //     System.debug('idList: '+idList);
        
    //     //AND Campaign__r.Year__c IN: yearList
    //     // List<Application_Proposal__c> applicationList = [select Id,Name,Title_Of__c,(select name from contacts__r),(Select id,Name,Proposals__c,isSelected__c,Reviewer__c from Reviewer_Mapping__r) From Application_Proposal__c WHERE Campaign__c=: campaignNName and Proposal_Stages__c in('Under Eligibility Check','Under Review')];
    //     List<Application_Proposal__c> applicationList = [select Id,Name,Title_Of__c,(select name from contacts__r),(Select id,Name,Proposals__c,isSelected__c,Reviewer__c from Reviewer_Mapping__r) From Application_Proposal__c WHERE Campaign__c IN: idList and Proposal_Stages__c IN ('Under Review') ];
    //     system.debug('applicationList ==> '+applicationList);
        
    //     List<reviewerWrapper> reviewerWrapperList = new List<reviewerWrapper>(); 
    //     for(Application_Proposal__c app :applicationList){
    //         List<Reviewer_Mapping__c> reviewerMappingListToBeInserted = new List<Reviewer_Mapping__c>();
    //         if(app.Reviewer_Mapping__r.size()==0){
    //             for(Reviewer__c Individualreviewer : myreviewerList){
    //                 Reviewer_Mapping__c reviewerMapRecord = new Reviewer_Mapping__c();
                    
    //                 reviewerMapRecord.Proposals__c =app.Id;
    //                 reviewerMapRecord.Reviewer__c = Individualreviewer.Id;
    //                 reviewerMapRecord.isSelected__c = false;   
    //                 reviewerMappingListToBeInserted.add(reviewerMapRecord);
    //             }
                
    //         }else{
    //             // Handle Stored Data
    //             for(Reviewer_Mapping__c RmRec : app.Reviewer_Mapping__r) {
    //                 // Also Find Out - Who Are pending Reviewers
    //                 allReviewer.remove(RmRec.Reviewer__c);
                    
    //                 reviewerMappingListToBeInserted.add(RmRec);
    //             }
    //             // Handle Dummy data
    //             for(Id leftOutreviewerId : allReviewer){
    //                 Reviewer_Mapping__c reviewerMapRecord = new Reviewer_Mapping__c();
                    
    //                 reviewerMapRecord.Proposals__c =app.Id;
    //                 reviewerMapRecord.Reviewer__c = leftOutreviewerId;
    //                 reviewerMapRecord.isSelected__c = false;   
    //                 reviewerMappingListToBeInserted.add(reviewerMapRecord);
    //             }
    //             // 
    //         }
    //         reviewerWrapper wrapInstance = new reviewerWrapper(app,reviewerMappingListToBeInserted);
    //         reviewerWrapperList.add(wrapInstance);
    //     }
    //     finalWrapper finalWrapInstance = new finalWrapper();
    //     finalWrapInstance.allAppWithRM = reviewerWrapperList;
    //     finalWrapInstance.allReviewer = myreviewerList;
    //     return finalWrapInstance;
    // }

    //New version (19/08/2025)
    @RemoteAction
    global static finalWrapper getProposalAndReviewer(String campaignNName, String yearName, String reviewerName) {
        // Parse the JSON strings into lists
        List<String> idList = (List<String>)JSON.deserialize(campaignNName, List<String>.class);
        List<String> yearList = (List<String>)JSON.deserialize(yearName, List<String>.class);
        List<String> reviewerIdList = (List<String>)JSON.deserialize(reviewerName, List<String>.class);
        
        System.debug('idList: ' + idList);
        System.debug('yearList: ' + yearList);
        System.debug('reviewerIdList: ' + reviewerIdList);

        // Get reviewers based on selection
        List<Reviewer__c> myreviewerList = [SELECT Id, Name FROM Reviewer__c WHERE Active__c = true AND Id IN :reviewerIdList];
        
        Set<Id> allReviewer = new Set<Id>(); 
        for (Reviewer__c IndiRev : myreviewerList) {
            allReviewer.add(IndiRev.Id);
        }

        // Query applications
        List<Application_Proposal__c> applicationList = [
            SELECT Id, Name, Title_Of__c, 
                (SELECT Name FROM contacts__r),
                (SELECT Id, Name, Proposals__c, isSelected__c, Reviewer__c 
                    FROM Reviewer_Mapping__r) 
            FROM Application_Proposal__c 
            WHERE Campaign__c IN :idList 
            AND Proposal_Stages__c IN ('Under Review')
        ];

        List<reviewerWrapper> reviewerWrapperList = new List<reviewerWrapper>(); 
        for (Application_Proposal__c app : applicationList) {
            List<Reviewer_Mapping__c> reviewerMappingListToBeInserted = new List<Reviewer_Mapping__c>();
            
            if (app.Reviewer_Mapping__r.size() == 0) {
                // No existing mappings - create all new ones
                for (Reviewer__c Individualreviewer : myreviewerList) {
                    reviewerMappingListToBeInserted.add(
                        new Reviewer_Mapping__c(
                            Proposals__c = app.Id,
                            Reviewer__c = Individualreviewer.Id,
                            isSelected__c = false
                        )
                    );
                }
            } else {
                // Handle existing mappings
                for (Reviewer_Mapping__c RmRec : app.Reviewer_Mapping__r) {
                    allReviewer.remove(RmRec.Reviewer__c);
                    reviewerMappingListToBeInserted.add(RmRec);
                }
                
                // Add mappings for missing reviewers
                for (Id leftOutreviewerId : allReviewer) {
                    reviewerMappingListToBeInserted.add(
                        new Reviewer_Mapping__c(
                            Proposals__c = app.Id,
                            Reviewer__c = leftOutreviewerId,
                            isSelected__c = false
                        )
                    );
                }
            }
            
            reviewerWrapperList.add(new reviewerWrapper(app, reviewerMappingListToBeInserted));
        }
        
        finalWrapper finalWrapInstance = new finalWrapper();
        finalWrapInstance.allAppWithRM = reviewerWrapperList;
        finalWrapInstance.allReviewer = myreviewerList;
        return finalWrapInstance;
    }

    @RemoteAction
    global static List<Reviewer__c> getCampaignReviewerData(){
        try{
            List<Reviewer__c> listReviewer=[select id,name,Birthdate__c,Email__c,Skills__c,campaign__r.name from Reviewer__c where Active__c=True];
            
            return listReviewer;
        }catch(Exception e){
            system.debug('Error Message::=>'+e.getMessage());
            system.debug('Error Line No.::=>'+e.getLineNumber());
            return null;
        }
    }
    global class finalWrapper{
        public List<reviewerWrapper> allAppWithRM;
        public List<Reviewer__c> allReviewer;
    }
    global class reviewerWrapper{
        public Application_Proposal__c application;
        public List<Reviewer_Mapping__c> reviewerList;
        public reviewerWrapper(Application_Proposal__c application,List<Reviewer_Mapping__c> reviewerList){
            this.application = application;
            this.reviewerList = reviewerList;
        }
        
    }
    
    @RemoteAction
    global static String getReviewerAction(List<Reviewer_Mapping__c> listOfSelectedReviewerMappings,List<Reviewer_Mapping__c> RemoveReviewerMappings){
        try{
            if(!listOfSelectedReviewerMappings.isEmpty()){
                Map<Id,List<Id>> reviewerIdvsProposalIDMap =  new Map<Id, List<Id>>();
                Set<Id> proposalIdSet = new Set<Id>();
                List<Messaging.SingleEmailMessage> emailsList = new List<Messaging.SingleEmailMessage>();
                for(Reviewer_Mapping__c rmObj : listOfSelectedReviewerMappings){
                    if(rmObj.Id == null){
                        if(!reviewerIdvsProposalIDMap.containsKey(rmObj.Reviewer__c)){
                            reviewerIdvsProposalIDMap.put(rmObj.Reviewer__c,new List<Id>());
                        }
                        reviewerIdvsProposalIDMap.get(rmObj.Reviewer__c).add(rmObj.Proposals__c);
                    }
                    proposalIdSet.add(rmObj.Proposals__c);
                }
                
                Map<Id,Application_Proposal__c> proposalMap = new Map<Id,Application_Proposal__c>([SELECT ID,Name,Title_Of__c
                                                                                                   FROM Application_Proposal__c 
                                                                                                   WHERE Id IN: proposalIdSet]);
                Map<Id,Reviewer__c> reviewerMap = new Map<Id,Reviewer__c>([SELECT ID,Name,Password__c, Email__c 
                                                                           FROM Reviewer__c 
                                                                           WHERE ID IN: reviewerIdvsProposalIDMap.keySet()]);
                Emailtemplate emailTempRec =  [Select Id,HtmlValue,Subject from EmailTemplate where Name ='Allocation Email To Reviewer - Two Plus Two'];
                for (Id revID : reviewerIdvsProposalIDMap.keySet()) {
                    List<String> proposalDetailsList = new List<String>();
                    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                    String toEmailId = reviewerMap.get(revId).Email__c;
                    mail.setToAddresses(new String[] {toEmailId});
                    mail.setSubject(emailTempRec.Subject);
                    String emailHtmlValue = emailTempRec.HtmlValue;
                    if(!String.isBlank(reviewerMap.get(revId).Name)){
                        emailHtmlValue = emailHtmlValue.replace('{Reviewer_Name__c}', reviewerMap.get(revId).Name);
                    }
                    emailHtmlValue = emailHtmlValue.replace('{Reviewer_Email__c}', toEmailId);
                    if(!String.isBlank(reviewerMap.get(revId).Password__c)){
                        emailHtmlValue = emailHtmlValue.replace('{Reviewer_Password__c}', reviewerMap.get(revId).Password__c);
                    }
                    //Concatenate the details of proposals.
                    for(Id proposalId : reviewerIdvsProposalIDMap.get(revId)){
                        String propBodyDetails = proposalMap.get(proposalId).Name+' - '+proposalMap.get(proposalId).Title_Of__c;
                        proposalDetailsList.add(propBodyDetails);
                    }
                    emailHtmlValue = emailHtmlValue.replace('{Proposal Details}', String.join(proposalDetailsList,'<br>'));
                    mail.setHtmlBody(emailHtmlValue);//Set HTML Body
                    emailsList.add(mail);
                }
                if(!emailsList.isEmpty()){
                    upsert listOfSelectedReviewerMappings;
                    system.debug('After Upsert => '+listOfSelectedReviewerMappings);
                    Messaging.sendEmail(emailsList);
                }
            }
            
            if(!RemoveReviewerMappings.isEmpty()){
                delete RemoveReviewerMappings;
            } 
            return 'success';
        }catch(Exception e){
            return e.getMessage();
        }      
        
    }
}