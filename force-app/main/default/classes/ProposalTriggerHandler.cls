public class ProposalTriggerHandler {
    static ProposalTriggerHandler proposalInstance;
    
    public static ProposalTriggerHandler getInstance(){
        if(proposalInstance==null)
            proposalInstance = new ProposalTriggerHandler();
        return proposalInstance;    
    }
    
    public void afterInsert(Map<Id,Application_Proposal__c> proposalMap){
        List<String> proposalIds = new List<String>();
        for(String Str : proposalMap.keySet()){
            proposalIds.add(Str);
        }
        //SharePointCallout.createFolder(proposalMap.keySet());
        //
        
        //commenting this logic as sharepoint objects are present in devpro sandbox - rutuja
        
        sharePointBatch batch = new sharePointBatch(proposalIds);
        Database.executeBatch(batch);
    } 
    
    public static void beforeDelete(List<Application_Proposal__c> newPropList){
        // system.debug('newPropList'+newPropList);
        // for(Application_Proposal__c appProp : newPropList){
        //if(appProp.Id == 'a081y000002xuye' || appProp.Id == 'a081y000002xpMl' ||appProp.Id == 'a081y000002xv1N' || appProp.Id == 'a081y000002xmqYAAQ' || appProp.Id == 'a081y000002xnZ7AAI'){
        //appProp.addError('These records are being used for testing and cannot be deleted.');
        // }
        //}
    }
    
    public void createMasterExpenseRecord(List<Application_Proposal__c> proposalList,Map<Id,Application_Proposal__c> oldProposalMap){
        Set<String> proposalIdSet = new Set<String>();
        Map<String,String> mapofAccidByPropId = New Map<String,String>();
        List<Expense_Master__c> emListTobeInsert = New List<Expense_Master__c>();
        for(Application_Proposal__c ap : proposalList){
            if(ap.Stage__c != null && ap.Stage__c != oldProposalMap.get(ap.Id).Stage__c && ap.Stage__c == '2nd Stage'){
                proposalIdSet.add(ap.Id);
            }
        }
        
        if(!proposalIdSet.isEmpty()){
            List<Account> accList = [select id,proposals__c from account where proposals__c in: proposalIdSet];
            for(Account acc : accList){
                mapofAccidByPropId.put(acc.Id,acc.proposals__c);
            }
            for(Account acc : accList){
                Expense_Master__c em = new Expense_Master__c();
                em.Account__c = acc.id;
                em.Proposals__c = mapofAccidByPropId.get(acc.id);
                emListTobeInsert.add(em);
            }
            if(!emListTobeInsert.isEmpty()){
                insert emListTobeInsert;
            }
        }
    }
    
    public void createDisbursmentFRecord(Map<Id, Application_Proposal__c> newProposalMap,Map<Id,Application_Proposal__c> oldProposalMap){
        Set<id> proposalId = New Set<Id>();
        List<Disbursement_Schedule__c> disbursementList = New List<Disbursement_Schedule__c>();
        Decimal perDayAmount;
        Integer Difference;
        
        for(Application_Proposal__c proposalRec : newProposalMap.values()){
            system.debug('proposalRec--->'+proposalRec.RecordType_Name__c);
            system.debug('proposalRec.Proposal_Stages__c ::'+proposalRec.Proposal_Stages__c);
            system.debug('RecordType ::'+proposalRec.RecordType_Name__c);
            if(proposalRec.Proposal_Stages__c != null && proposalRec.Proposal_Stages__c != oldProposalMap.get(proposalRec.Id).Proposal_Stages__c && proposalRec.Proposal_Stages__c == 'Under Decision'){
                if(proposalRec.RecordType_Name__c == 'Industrial Fellowship'){
                    proposalId.add(proposalRec.Id);
                }
            }
        }
        system.debug('proposalId ::'+proposalId);
        List<Contact> contactList = [SELECT Id,Name,Proposals__c,Industrial_Fellowship_Type__c,Proposals__r.Name,Proposals__r.Tentative_End_Date__c,Proposals__r.Tentative_Start_Date__c,Proposals__r.RecordType_Name__c FROM Contact WHERE Proposals__c In : proposalId Limit 1];
        system.debug('contactList ::'+contactList);
        if(!contactList.isEMpty()){
            if(contactList[0].Proposals__r.Tentative_Start_Date__c != null && contactList[0].Proposals__r.Tentative_End_Date__c != null){
                Difference = contactList[0].Proposals__r.Tentative_Start_Date__c.monthsBetween(contactList[0].Proposals__r.Tentative_End_Date__c);
            }
            system.debug('Difference ::'+Difference);
            if(contactList[0].Industrial_Fellowship_Type__c == 'PDIF' && contactList[0].Proposals__r.RecordType_Name__c == 'Industrial Fellowship'){
                            List<Grant_Portal_Docs__c> getCurrencyForPDIF = [Select Id,Name,Amount__c,Campaign__c,Campaign_Type__c From Grant_Portal_Docs__c WHERE Campaign__c = 'IF' AND Campaign_Type__c = 'PDIF'];
                            Date tentitiveEndDate,tentitiveStartDate;
                            
                            for(Integer i=0;i<Difference;i++){
                                Disbursement_Schedule__c disbursementRecord = New Disbursement_Schedule__c();
                                disbursementRecord.Proposals__c = contactList[0].Proposals__c;
                                
                                disbursementRecord.Tranche__c = string.valueOf( i + 1 );
                                disbursementRecord.Attendance_Report_Remainder__c = true;
                                /*if(disbursementRecord.Tranche__c != '1'){
                                    disbursementRecord.Attendance_Report_Remainder__c = true;
                                }
                                if(disbursementRecord.Tranche__c == '2' || disbursementRecord.Tranche__c == '11' || disbursementRecord.Tranche__c == '12'){
                                    disbursementRecord.Send_SE_UC_reminder__c = true;
                                }
                                if(disbursementRecord.Tranche__c == '3' || disbursementRecord.Tranche__c == '6' || disbursementRecord.Tranche__c == '9' || disbursementRecord.Tranche__c == '11' || disbursementRecord.Tranche__c == '12'){
                                    disbursementRecord.Progress_Report_Remainder__c = true;
                                }
                                if(disbursementRecord.Tranche__c == '2' || disbursementRecord.Tranche__c == '3' || disbursementRecord.Tranche__c == '6' || disbursementRecord.Tranche__c == '9' || disbursementRecord.Tranche__c == '11' || disbursementRecord.Tranche__c == '12'){
                                    disbursementRecord.Supporting_Documents_Remainder__c = true;
                                }*/
                                disbursementRecord.Disbursement_Name__c = 'DS-' + contactList[0].Proposals__r.Name.replace('IGSTC-','') + '-' + disbursementRecord.Tranche__c + '-' + contactList[0].Name;
                                Integer tentativeday = contactList[0].Proposals__r.Tentative_Start_Date__c.Day();
                                system.debug('tentativeday -----'+tentativeday);
                                Integer tentativemonth = contactList[0].Proposals__r.Tentative_Start_Date__c.Month();
                                system.debug('tentativemonth ----'+tentativemonth);
                                Integer tentativeyear = contactList[0].Proposals__r.Tentative_Start_Date__c.Year();
                                system.debug('tentativeyear ----'+tentativeyear);
                                Integer TotalnumberDays = date.daysInMonth(Integer.valueOf(tentativeyear), Integer.valueOf(tentativemonth));
                                system.debug('TotalnumberDays ------'+TotalnumberDays);
                                Integer TentativeRemainingDays = TotalnumberDays - tentativeday;
                                system.debug('TentativeRemainingDays ------'+TentativeRemainingDays);
                                tentitiveStartDate = contactList[0].Proposals__r.Tentative_End_Date__c;
                                disbursementRecord.Contact__c = contactList[0].id;
                                
                                if(i== 0){
                                    disbursementRecord.Send_SE_UC_reminder__c = true;
                                    disbursementRecord.Supporting_Documents_Remainder__c = true;
                                    if(contactList[0].Proposals__r.Tentative_Start_Date__c.day() <= 15 && i == 0){
                                        
                                        tentativeday = tentativeday + TentativeRemainingDays;
                                        tentitiveStartDate = contactList[0].Proposals__r.Tentative_Start_Date__c;//.addDays(TentativeRemainingDays);
                                        system.debug('tentitiveEndDate adding remaining days ------- '+tentitiveEndDate);
                                        //rutuja
                                        //disbursementRecord.Start_Date__c = tentitiveStartDate;
                                        disbursementRecord.Start_Date__c =  contactList[0].Proposals__r.Tentative_Start_Date__c;
                                        tentitiveEndDate = tentitiveStartDate.addDays(TentativeRemainingDays);
                                        tentitiveEndDate = tentitiveEndDate.addMonths(1);
                                        //rutuja
                                        //disbursementRecord.End_Date__c = tentitiveEndDate;
                                        disbursementRecord.End_Date__c = contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(2).addDays(-1); 
                                        system.debug('disbursementRecord.End_Date__c adding 1 month ------ '+disbursementRecord.End_Date__c);
                                        system.debug('tentitiveStartDate--->'+tentitiveStartDate);
                                        system.debug('tentitiveEndDate--->'+tentitiveEndDate);
                                    }
                                    if(contactList[0].Proposals__r.Tentative_Start_Date__c.day() > 15 && i == 0){
                                        
                                        tentativeday = tentativeday + TentativeRemainingDays;
                                        tentitiveStartDate = contactList[0].Proposals__r.Tentative_Start_Date__c;//.addDays(TentativeRemainingDays);
                                        system.debug('tentitiveEndDate adding remaining days ------- '+tentitiveEndDate);
                                        //rutuja
                                        //disbursementRecord.Start_Date__c = tentitiveStartDate;
                                        disbursementRecord.Start_Date__c =  contactList[0].Proposals__r.Tentative_Start_Date__c;
                                        tentitiveEndDate = tentitiveStartDate.addDays(TentativeRemainingDays);
                                        tentitiveEndDate = tentitiveEndDate.addMonths(1);
                                        //rutuja
                                        //disbursementRecord.End_Date__c = tentitiveEndDate;
                                        
                                        //Integer apdate =  Date.newInstance(contactList[0].Proposals__r.Tentative_Start_Date__c.year(),contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(2).month,1);             
                                        disbursementRecord.End_Date__c = Date.newInstance(contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(2).year(),contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(2).month(),1).adddays(-1); 
                                        //disbursementRecord.End_Date__c =contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(2).addDays(-1); 
                                        system.debug('disbursementRecord.End_Date__c adding 1 month ------ '+disbursementRecord.End_Date__c);
                                        system.debug('tentitiveStartDate--->'+tentitiveStartDate);
                                        system.debug('tentitiveEndDate--->'+tentitiveEndDate);
                                    }
                                }
                                
                                else if(i != 0 && i != Difference-1){
                                    if(contactList[0].Proposals__r.Tentative_Start_Date__c.day() <= 15){
                                    //rutuja
                                    //disbursementRecord.Start_Date__c = tentitiveEndDate.addMonths(i-1);
                                    //disbursementRecord.Start_Date__c = disbursementRecord.Start_Date__c.addDays(1); 
                                    //
                                    if(disbursementRecord.Tranche__c == '2' || disbursementRecord.Tranche__c == '5' || disbursementRecord.Tranche__c == '8' ){
                                    disbursementRecord.Progress_Report_Remainder__c = true;
                                	}
                                    disbursementRecord.Start_Date__c = contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+1);
                                    system.debug(i+ 'Start Date -------- '+disbursementRecord.Start_Date__c);
                                    //rutuja
                                    //disbursementRecord.End_Date__c = tentitiveEndDate.addMonths(i);
                                    //
                                    disbursementRecord.End_Date__c = contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+2).addDays(-1);
                                    system.debug(i+ 'End Date -------- '+disbursementRecord.End_Date__c);
                                    system.debug('tentitiveStartDate--->'+tentitiveStartDate);
                                    system.debug('tentitiveEndDate--->'+tentitiveEndDate);
                                    }
                                    if(contactList[0].Proposals__r.Tentative_Start_Date__c.day() > 15){
                                        if(disbursementRecord.Tranche__c == '3' || disbursementRecord.Tranche__c == '6' || disbursementRecord.Tranche__c == '9' ){
                                            disbursementRecord.Progress_Report_Remainder__c = true;
                                        }	
                                        disbursementRecord.Start_Date__c = Date.newInstance(contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+1).year(),contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+1).month(),1); 
                                        //disbursementRecord.End_Date__c = Date.newInstance(contactList[0].Proposals__r.Tentative_Start_Date__c.year(),contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+2).month(),1).adddays(-1); 
                                        disbursementRecord.End_Date__c = Date.newInstance(contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+2).year(),contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+2).month(),1).adddays(-1); 
                                    }
                                    
                                }
                                else if(i != 0 && i == Difference-1 && contactList[0].Proposals__r.Tentative_Start_Date__c.day() < 15){
                                    disbursementRecord.Send_SE_UC_reminder__c = true;
                                    disbursementRecord.Supporting_Documents_Remainder__c = true;
                                    disbursementRecord.Progress_Report_Remainder__c = true;
                                    disbursementRecord.Start_Date__c = contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+1);
                                    disbursementRecord.End_Date__c = contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+2).addDays(-1);
                                    
                                }
                                else if(i != 0 && i == Difference-1 && contactList[0].Proposals__r.Tentative_Start_Date__c.day() > 15){
                                    disbursementRecord.Send_SE_UC_reminder__c = true;
                                    disbursementRecord.Supporting_Documents_Remainder__c = true;
                                    disbursementRecord.Progress_Report_Remainder__c = true;
                                    disbursementRecord.Start_Date__c = Date.newInstance(contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+1).year(),contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+1).month(),1); 
                                    disbursementRecord.End_Date__c = contactList[0].Proposals__r.Tentative_End_Date__c; 
                                    
                                }
                                
                                if(disbursementRecord.Start_Date__c.day() <= 15 && i == 0){
                                    disbursementRecord.Amount__c = getCurrencyForPDIF[0].Amount__c * 2;  
                                }
                                else if((disbursementRecord.Start_Date__c.day() > 15 && i == 0) ){
                                    Integer day = disbursementRecord.Start_Date__c.Day();
                                    system.debug('day -----'+day);
                                    Integer month = disbursementRecord.Start_Date__c.Month();
                                    system.debug('month ----'+month);
                                    Integer year = disbursementRecord.Start_Date__c.Year();
                                    system.debug('year ----'+year);
                                    
                                    Integer numberDays = date.daysInMonth(Integer.valueOf(year), Integer.valueOf(month));
                                    system.debug('numberDays ------'+numberDays);
                                    Integer RemainingDays = numberDays - day;
                                    system.debug('remaining days::'+RemainingDays);
                                    perDayAmount = getCurrencyForPDIF[0].Amount__c/numberDays;
                                    disbursementRecord.Amount__c = 1250+getCurrencyForPDIF[0].Amount__c;
                                    //disbursementRecord.Amount__c = perDayAmount*RemainingDays+getCurrencyForPIEF[0].Amount__c;
                                }
                                else if((i != 0 && i != Difference-1) || (i != 0 && i == Difference-1 && disbursementRecord.End_Date__c.day() > 25)){
                                    disbursementRecord.Amount__c = getCurrencyForPDIF[0].Amount__c;  
                                }
                                else if(i != 0 && i == Difference-1 && disbursementRecord.Start_Date__c.day() < 15){
                                    Integer day = contactList[0].Proposals__r.Tentative_Start_Date__c.Day();
                                    system.debug('day -----'+day);
                                    Integer month = contactList[0].Proposals__r.Tentative_Start_Date__c.Month();
                                    system.debug('month ----'+month);
                                    Integer year = contactList[0].Proposals__r.Tentative_Start_Date__c.Year();
                                    system.debug('year ----'+year);
                                    Integer endday = contactList[0].Proposals__r.Tentative_End_Date__c.Day();
                                    system.debug('endday'+endday);
                                    Integer numberDays = date.daysInMonth(Integer.valueOf(year), Integer.valueOf(month));
                                    system.debug('numberDays'+numberDays);
                                    Integer RemainingDays = numberDays - endday;
                                    system.debug('remaining days::'+RemainingDays);
                                    perDayAmount = getCurrencyForPDIF[0].Amount__c/numberDays;
                                    disbursementRecord.Amount__c = 1250;
                                    //disbursementRecord.Amount__c = perDayAmount*RemainingDays;
                                }
                                
                                disbursementRecord.Release_Grant_Amount__c = disbursementRecord.Amount__c;
                                disbursementList.add(disbursementRecord);
                            }
                            /*
                            for(integer i=1 ; i<=disbursementList.size() ; i+=3){
                                //if(disbursementList[i].Contact__r.Industrial_Fellowship_Type__c == 'PDIF'){
                                system.debug('testing=>'+disbursementList[i]);
                                system.debug('testing=>'+disbursementList[i].Send_SE_UC_reminder__c);
                                disbursementList[i].Send_SE_UC_reminder__c = true;
                                //}
                                
                            }
                            for(integer i=2 ; i<=disbursementList.size() ; i+=4){
                                //if(disbursementList[i].Contact__r.Industrial_Fellowship_Type__c == 'PDIF'){
                                system.debug('testing=>'+disbursementList[i]);
                                system.debug('testing=>'+disbursementList[i].Send_SE_UC_reminder__c);
                                disbursementList[i].Send_Closure_remainder__c	 = true;
                                //}
                                
                            }
                            */
                        }
                        else{
                            List<Grant_Portal_Docs__c> getCurrencyForPIEF = [Select Id,Name,Amount__c,Campaign__c,Campaign_Type__c From Grant_Portal_Docs__c WHERE Campaign__c = 'IF' AND Campaign_Type__c = 'PIEF'];
                            Date tentitiveEndDate,tentitiveStartDate;
                            for(Integer i=0;i<Difference;i++){
                                Disbursement_Schedule__c disbursementRecord = New Disbursement_Schedule__c();
                                disbursementRecord.Proposals__c = contactList[0].Proposals__c;
                                
                                disbursementRecord.Tranche__c = string.valueOf( i + 1 );
                                
                                disbursementRecord.Attendance_Report_Remainder__c = true;
                                
                                disbursementRecord.Disbursement_Name__c = 'DS-' + contactList[0].Proposals__r.Name.replace('IGSTC-','') + '-' + disbursementRecord.Tranche__c + '-' + contactList[0].Name;
                                Integer tentativeday = contactList[0].Proposals__r.Tentative_Start_Date__c.Day();
                                system.debug('tentativeday -----'+tentativeday);
                                Integer tentativemonth = contactList[0].Proposals__r.Tentative_Start_Date__c.Month();
                                system.debug('tentativemonth ----'+tentativemonth);
                                Integer tentativeyear = contactList[0].Proposals__r.Tentative_Start_Date__c.Year();
                                system.debug('tentativeyear ----'+tentativeyear);
                                Integer TotalnumberDays = date.daysInMonth(Integer.valueOf(tentativeyear), Integer.valueOf(tentativemonth));
                                system.debug('TotalnumberDays ------'+TotalnumberDays);
                                Integer TentativeRemainingDays = TotalnumberDays - tentativeday;
                                system.debug('TentativeRemainingDays ------'+TentativeRemainingDays);
                                tentitiveStartDate = contactList[0].Proposals__r.Tentative_End_Date__c;
                                disbursementRecord.Contact__c = contactList[0].id;
                                
                                if(i== 0){
                                    disbursementRecord.Send_SE_UC_reminder__c = true;
                                    disbursementRecord.Supporting_Documents_Remainder__c = true;
                                    
                                    if(contactList[0].Proposals__r.Tentative_Start_Date__c.day() <= 15 && i == 0){
                                        
                                        tentativeday = tentativeday + TentativeRemainingDays;
                                        tentitiveStartDate = contactList[0].Proposals__r.Tentative_Start_Date__c;//.addDays(TentativeRemainingDays);
                                        system.debug('tentitiveEndDate adding remaining days ------- '+tentitiveEndDate);
                                        //rutuja
                                        //disbursementRecord.Start_Date__c = tentitiveStartDate;
                                        disbursementRecord.Start_Date__c =  contactList[0].Proposals__r.Tentative_Start_Date__c;
                                        tentitiveEndDate = tentitiveStartDate.addDays(TentativeRemainingDays);
                                        tentitiveEndDate = tentitiveEndDate.addMonths(1);
                                        //rutuja
                                        //disbursementRecord.End_Date__c = tentitiveEndDate;
                                        disbursementRecord.End_Date__c = contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(2).addDays(-1); 
                                        system.debug('disbursementRecord.End_Date__c adding 1 month ------ '+disbursementRecord.End_Date__c);
                                        system.debug('tentitiveStartDate--->'+tentitiveStartDate);
                                        system.debug('tentitiveEndDate--->'+tentitiveEndDate);
                                    }
                                    if(contactList[0].Proposals__r.Tentative_Start_Date__c.day() > 15 && i == 0){
                                        
                                        tentativeday = tentativeday + TentativeRemainingDays;
                                        tentitiveStartDate = contactList[0].Proposals__r.Tentative_Start_Date__c;//.addDays(TentativeRemainingDays);
                                        system.debug('tentitiveEndDate adding remaining days ------- '+tentitiveEndDate);
                                        //rutuja
                                        //disbursementRecord.Start_Date__c = tentitiveStartDate;
                                        disbursementRecord.Start_Date__c =  contactList[0].Proposals__r.Tentative_Start_Date__c;
                                        tentitiveEndDate = tentitiveStartDate.addDays(TentativeRemainingDays);
                                        tentitiveEndDate = tentitiveEndDate.addMonths(1);
                                        //rutuja
                                        //disbursementRecord.End_Date__c = tentitiveEndDate;
                                        
                                        //Integer apdate =  Date.newInstance(contactList[0].Proposals__r.Tentative_Start_Date__c.year(),contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(2).month,1);             
                                        disbursementRecord.End_Date__c = Date.newInstance(contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(2).year(),contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(2).month(),1).adddays(-1); 
                                        //disbursementRecord.End_Date__c =contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(2).addDays(-1); 
                                        system.debug('disbursementRecord.End_Date__c adding 1 month ------ '+disbursementRecord.End_Date__c);
                                        system.debug('tentitiveStartDate--->'+tentitiveStartDate);
                                        system.debug('tentitiveEndDate--->'+tentitiveEndDate);
                                    }
                                }
                                
                                else if(i != 0 && i != Difference-1){
                                    if(contactList[0].Proposals__r.Tentative_Start_Date__c.day() <= 15){
                                    //rutuja
                                    //disbursementRecord.Start_Date__c = tentitiveEndDate.addMonths(i-1);
                                    //disbursementRecord.Start_Date__c = disbursementRecord.Start_Date__c.addDays(1); 
                                    //
                                    if(disbursementRecord.Tranche__c == '2' ){
                                    disbursementRecord.Progress_Report_Remainder__c = true;
                                	}
                                    disbursementRecord.Start_Date__c = contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+1);
                                    system.debug(i+ 'Start Date -------- '+disbursementRecord.Start_Date__c);
                                    //rutuja
                                    //disbursementRecord.End_Date__c = tentitiveEndDate.addMonths(i);
                                    //
                                    disbursementRecord.End_Date__c = contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+2).addDays(-1);
                                    system.debug(i+ 'End Date -------- '+disbursementRecord.End_Date__c);
                                    system.debug('tentitiveStartDate--->'+tentitiveStartDate);
                                    system.debug('tentitiveEndDate--->'+tentitiveEndDate);
                                    }
                                    if(contactList[0].Proposals__r.Tentative_Start_Date__c.day() > 15){
                                        if(disbursementRecord.Tranche__c == '3' ){
                                            disbursementRecord.Progress_Report_Remainder__c = true;
                                        }
                                        disbursementRecord.Start_Date__c = Date.newInstance(contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+1).year(),contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+1).month(),1); 
                                        disbursementRecord.End_Date__c = Date.newInstance(contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+2).year(),contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+2).month(),1).adddays(-1); 
                                    }
                                    
                                }
                                else if(i != 0 && i == Difference-1 && contactList[0].Proposals__r.Tentative_Start_Date__c.day() < 15){
									disbursementRecord.Send_SE_UC_reminder__c = true;
                                    disbursementRecord.Supporting_Documents_Remainder__c = true;
                                    disbursementRecord.Progress_Report_Remainder__c = true;
                                                                        
                                    disbursementRecord.Start_Date__c = contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+1);
                                    disbursementRecord.End_Date__c = contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+2).addDays(-1);
                                    
                                }
                                else if(i != 0 && i == Difference-1 && contactList[0].Proposals__r.Tentative_Start_Date__c.day() > 15){
                                    disbursementRecord.Send_SE_UC_reminder__c = true;
                                    disbursementRecord.Supporting_Documents_Remainder__c = true;
                                    disbursementRecord.Progress_Report_Remainder__c = true;
                                    
                                    disbursementRecord.Start_Date__c = Date.newInstance(contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+1).year(),contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+1).month(),1); 
                                    disbursementRecord.End_Date__c = contactList[0].Proposals__r.Tentative_End_Date__c; 
                                    
                                }
                                
                                if(disbursementRecord.Start_Date__c.day() <= 15 && i == 0){
                                    disbursementRecord.Amount__c = getCurrencyForPIEF[0].Amount__c * 2;  
                                }
                                else if((disbursementRecord.Start_Date__c.day() > 15 && i == 0) ){
                                    Integer day = disbursementRecord.Start_Date__c.Day();
                                    system.debug('day -----'+day);
                                    Integer month = disbursementRecord.Start_Date__c.Month();
                                    system.debug('month ----'+month);
                                    Integer year = disbursementRecord.Start_Date__c.Year();
                                    system.debug('year ----'+year);
                                    
                                    Integer numberDays = date.daysInMonth(Integer.valueOf(year), Integer.valueOf(month));
                                    system.debug('numberDays ------'+numberDays);
                                    Integer RemainingDays = numberDays - day;
                                    system.debug('remaining days::'+RemainingDays);
                                    perDayAmount = getCurrencyForPIEF[0].Amount__c/numberDays;
                                    disbursementRecord.Amount__c = 750+getCurrencyForPIEF[0].Amount__c;
                                    //disbursementRecord.Amount__c = perDayAmount*RemainingDays+getCurrencyForPIEF[0].Amount__c;
                                }
                                else if((i != 0 && i != Difference-1) || (i != 0 && i == Difference-1 && disbursementRecord.End_Date__c.day() > 25)){
                                    disbursementRecord.Amount__c = getCurrencyForPIEF[0].Amount__c;  
                                }
                                else if(i != 0 && i == Difference-1 && disbursementRecord.Start_Date__c.day() < 15){
                                    Integer day = contactList[0].Proposals__r.Tentative_Start_Date__c.Day();
                                    system.debug('day -----'+day);
                                    Integer month = contactList[0].Proposals__r.Tentative_Start_Date__c.Month();
                                    system.debug('month ----'+month);
                                    Integer year = contactList[0].Proposals__r.Tentative_Start_Date__c.Year();
                                    system.debug('year ----'+year);
                                    Integer endday = contactList[0].Proposals__r.Tentative_End_Date__c.Day();
                                    system.debug('endday'+endday);
                                    Integer numberDays = date.daysInMonth(Integer.valueOf(year), Integer.valueOf(month));
                                    system.debug('numberDays'+numberDays);
                                    Integer RemainingDays = numberDays - endday;
                                    system.debug('remaining days::'+RemainingDays);
                                    perDayAmount = getCurrencyForPIEF[0].Amount__c/numberDays;
                                    disbursementRecord.Amount__c = 750;
                                    //disbursementRecord.Amount__c = perDayAmount*RemainingDays;
                                }
                                
                                disbursementRecord.Release_Grant_Amount__c = disbursementRecord.Amount__c;
                                disbursementList.add(disbursementRecord);
                            }
                            /*for(integer i=1 ; i<=disbursementList.size() ; i+=3){
                                
                                //if(disbursementList[i].Contact__r.Industrial_Fellowship_Type__c.contains('PIEF')){
                                system.debug('testing=>'+disbursementList[i]);
                                system.debug('testing=>'+disbursementList[i].Send_SE_UC_reminder__c);
                                disbursementList[i].Send_SE_UC_reminder__c = true;
                                disbursementList[i].Send_Closure_remainder__c	 = true;
                                // }
                            }*/
                            
                        }
                        
            /*if(contactList[0].Industrial_Fellowship_Type__c == 'PDIF' && contactList[0].Proposals__r.RecordType_Name__c == 'Industrial Fellowship'){
                List<Grant_Portal_Docs__c> getCurrencyForPDIF = [Select Id,Name,Amount__c,Campaign__c,Campaign_Type__c From Grant_Portal_Docs__c WHERE Campaign__c = 'IF' AND Campaign_Type__c = 'PDIF'];
                Date tentitiveEndDate,tentitiveStartDate;
                for(Integer i=0;i<Difference-1;i++){
                    Disbursement_Schedule__c disbursementRecord = New Disbursement_Schedule__c();
                    disbursementRecord.Proposals__c = contactList[0].Proposals__c;
                    
                    disbursementRecord.Tranche__c = string.valueOf( i + 1 );
                    if(i >= 1 && (i+3 <= Difference)){
                        disbursementRecord.Tranche__c = string.valueOf( i + 1 ) + 'sendmail' ;
                    }
                    disbursementRecord.Disbursement_Name__c = 'DS-' + contactList[0].Proposals__r.Name.replace('IGSTC-','') + '-' + disbursementRecord.Tranche__c + '-' + contactList[0].Name ;
                    Integer tentativeday = contactList[0].Proposals__r.Tentative_Start_Date__c.Day();
                    system.debug('tentativeday -----'+tentativeday);
                    Integer tentativemonth = contactList[0].Proposals__r.Tentative_Start_Date__c.Month();
                    system.debug('tentativemonth ----'+tentativemonth);
                    Integer tentativeyear = contactList[0].Proposals__r.Tentative_Start_Date__c.Year();
                    system.debug('tentativeyear ----'+tentativeyear);
                    Integer TotalnumberDays = date.daysInMonth(Integer.valueOf(tentativeyear), Integer.valueOf(tentativemonth));
                    system.debug('TotalnumberDays ------'+TotalnumberDays);
                    Integer TentativeRemainingDays = TotalnumberDays - tentativeday;
                    system.debug('TentativeRemainingDays ------'+TentativeRemainingDays);
                    tentitiveStartDate = contactList[0].Proposals__r.Tentative_End_Date__c;
                    disbursementRecord.Contact__c = contactList[0].id;
                    
                    if(i== 0){
                        tentativeday = tentativeday + TentativeRemainingDays;
                        tentitiveStartDate = contactList[0].Proposals__r.Tentative_Start_Date__c;//.addDays(TentativeRemainingDays);
                        system.debug('tentitiveEndDate adding remaining days ------- '+tentitiveEndDate);
                        //rutuja
                        //disbursementRecord.Start_Date__c = tentitiveStartDate;
                        disbursementRecord.Start_Date__c =  contactList[0].Proposals__r.Tentative_Start_Date__c;
                        tentitiveEndDate = tentitiveStartDate.addDays(TentativeRemainingDays);
                        tentitiveEndDate = tentitiveEndDate.addMonths(1);
                        //rutuja
                        //disbursementRecord.End_Date__c = tentitiveEndDate;
                        disbursementRecord.End_Date__c = contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(2).addDays(-1); 
                        //disbursementRecord.End_Date__c = contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(1).addDays(-1); 
                        system.debug('disbursementRecord.End_Date__c adding 1 month ------ '+disbursementRecord.End_Date__c);
                        system.debug('tentitiveStartDate--->'+tentitiveStartDate);
                        system.debug('tentitiveEndDate--->'+tentitiveEndDate);
                    }else{
                        //rutuja
                        //disbursementRecord.Start_Date__c = tentitiveEndDate.addMonths(i-1);
                        //disbursementRecord.Start_Date__c = disbursementRecord.Start_Date__c.addDays(1);
                        disbursementRecord.Start_Date__c = contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+1);
                        //disbursementRecord.Start_Date__c = contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i);
                        system.debug(i+ 'Start Date -------- '+disbursementRecord.Start_Date__c);
                        //rutuja
                        //disbursementRecord.End_Date__c = tentitiveEndDate.addMonths(i);
                        disbursementRecord.End_Date__c = contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+2).addDays(-1);
                        //disbursementRecord.End_Date__c = contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+1).addDays(-1);
                        system.debug(i+ 'End Date -------- '+disbursementRecord.End_Date__c);
                        system.debug('tentitiveStartDate--->'+tentitiveStartDate);
                        system.debug('tentitiveEndDate--->'+tentitiveEndDate);
                    }
                    
                    if(disbursementRecord.Start_Date__c.day() <= 15 && i == 0){
                        disbursementRecord.Amount__c = getCurrencyForPDIF[0].Amount__c * 2;  
                    }else if(disbursementRecord.Start_Date__c.day() > 15 && i == 0){
                        Integer day = disbursementRecord.Start_Date__c.Day();
                        system.debug('day -----'+day);
                        Integer month = disbursementRecord.Start_Date__c.Month();
                        system.debug('month ----'+month);
                        Integer year = disbursementRecord.Start_Date__c.Year();
                        system.debug('year ----'+year);
                        
                        Integer numberDays = date.daysInMonth(Integer.valueOf(year), Integer.valueOf(month));
                        system.debug('numberDays ------'+numberDays);
                        Integer RemainingDays = numberDays - day;
                        system.debug('remaining days::'+RemainingDays);
                        perDayAmount = getCurrencyForPDIF[0].Amount__c/numberDays;
                        disbursementRecord.Amount__c = perDayAmount*RemainingDays+getCurrencyForPDIF[0].Amount__c;
                    }
                    else{
                        disbursementRecord.Amount__c = getCurrencyForPDIF[0].Amount__c;  
                    }
                    disbursementRecord.Release_Grant_Amount__c = disbursementRecord.Amount__c;
                    disbursementList.add(disbursementRecord);
                }
                for(integer i=1 ; i<=disbursementList.size() ; i+=3){
                                //if(disbursementList[i].Contact__r.Industrial_Fellowship_Type__c == 'PDIF'){
                                system.debug('testing=>'+disbursementList[i]);
                                system.debug('testing=>'+disbursementList[i].Send_SE_UC_reminder__c);
                                disbursementList[i].Send_SE_UC_reminder__c = true;
                                //}
                                
                            }
                            for(integer i=2 ; i<=disbursementList.size() ; i+=4){
                                //if(disbursementList[i].Contact__r.Industrial_Fellowship_Type__c == 'PDIF'){
                                system.debug('testing=>'+disbursementList[i]);
                                system.debug('testing=>'+disbursementList[i].Send_SE_UC_reminder__c);
                                disbursementList[i].Send_Closure_remainder__c	 = true;
                                //}
                                
                            }
            } 
            else{
                List<Grant_Portal_Docs__c> getCurrencyForPIEF = [Select Id,Name,Amount__c,Campaign__c,Campaign_Type__c From Grant_Portal_Docs__c WHERE Campaign__c = 'IF' AND Campaign_Type__c = 'PIEF'];
                Date tentitiveEndDate,tentitiveStartDate;
                for(Integer i=0;i<Difference-1;i++){
                    Disbursement_Schedule__c disbursementRecord = New Disbursement_Schedule__c();
                    disbursementRecord.Proposals__c = contactList[0].Proposals__c;
                    
                    disbursementRecord.Tranche__c = string.valueOf( i + 1 );
                    disbursementRecord.Disbursement_Name__c = 'DS-' + contactList[0].Proposals__r.Name.replace('IGSTC-','') + '-' + disbursementRecord.Tranche__c + '-' + contactList[0].Name;
                    Integer tentativeday = contactList[0].Proposals__r.Tentative_Start_Date__c.Day();
                    system.debug('tentativeday -----'+tentativeday);
                    Integer tentativemonth = contactList[0].Proposals__r.Tentative_Start_Date__c.Month();
                    system.debug('tentativemonth ----'+tentativemonth);
                    Integer tentativeyear = contactList[0].Proposals__r.Tentative_Start_Date__c.Year();
                    system.debug('tentativeyear ----'+tentativeyear);
                    Integer TotalnumberDays = date.daysInMonth(Integer.valueOf(tentativeyear), Integer.valueOf(tentativemonth));
                    system.debug('TotalnumberDays ------'+TotalnumberDays);
                    Integer TentativeRemainingDays = TotalnumberDays - tentativeday;
                    system.debug('TentativeRemainingDays ------'+TentativeRemainingDays);
                    tentitiveStartDate = contactList[0].Proposals__r.Tentative_End_Date__c;
                    disbursementRecord.Contact__c = contactList[0].id;
                    
                    if(i== 0){
                        tentativeday = tentativeday + TentativeRemainingDays;
                        tentitiveStartDate = contactList[0].Proposals__r.Tentative_Start_Date__c;//.addDays(TentativeRemainingDays);
                        system.debug('tentitiveEndDate adding remaining days ------- '+tentitiveEndDate);
                        //rutuja
                        //disbursementRecord.Start_Date__c = tentitiveStartDate;
                        disbursementRecord.Start_Date__c =  contactList[0].Proposals__r.Tentative_Start_Date__c;
                        tentitiveEndDate = tentitiveStartDate.addDays(TentativeRemainingDays);
                        tentitiveEndDate = tentitiveEndDate.addMonths(1);
                        //rutuja
                        //disbursementRecord.End_Date__c = tentitiveEndDate;
                        disbursementRecord.End_Date__c = contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(2).addDays(-1); 
                        system.debug('disbursementRecord.End_Date__c adding 1 month ------ '+disbursementRecord.End_Date__c);
                        system.debug('tentitiveStartDate--->'+tentitiveStartDate);
                        system.debug('tentitiveEndDate--->'+tentitiveEndDate);
                    }else{
                        //rutuja
                        //disbursementRecord.Start_Date__c = tentitiveEndDate.addMonths(i-1);
                        //disbursementRecord.Start_Date__c = disbursementRecord.Start_Date__c.addDays(1); 
                        //
                        disbursementRecord.Start_Date__c = contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+1);
                        system.debug(i+ 'Start Date -------- '+disbursementRecord.Start_Date__c);
                        //rutuja
                        //disbursementRecord.End_Date__c = tentitiveEndDate.addMonths(i);
                        //
                        disbursementRecord.End_Date__c = contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+2).addDays(-1);
                        system.debug(i+ 'End Date -------- '+disbursementRecord.End_Date__c);
                        system.debug('tentitiveStartDate--->'+tentitiveStartDate);
                        system.debug('tentitiveEndDate--->'+tentitiveEndDate);
                        
                        
                    }
                    
                    if(disbursementRecord.Start_Date__c.day() <= 15 && i == 0){
                        disbursementRecord.Amount__c = getCurrencyForPIEF[0].Amount__c * 2;  
                    }else if(disbursementRecord.Start_Date__c.day() > 15 && i == 0){
                        Integer day = disbursementRecord.Start_Date__c.Day();
                        system.debug('day -----'+day);
                        Integer month = disbursementRecord.Start_Date__c.Month();
                        system.debug('month ----'+month);
                        Integer year = disbursementRecord.Start_Date__c.Year();
                        system.debug('year ----'+year);
                        
                        Integer numberDays = date.daysInMonth(Integer.valueOf(year), Integer.valueOf(month));
                        system.debug('numberDays ------'+numberDays);
                        Integer RemainingDays = numberDays - day;
                        system.debug('remaining days::'+RemainingDays);
                        perDayAmount = getCurrencyForPIEF[0].Amount__c/numberDays;
                        disbursementRecord.Amount__c = perDayAmount*RemainingDays+getCurrencyForPIEF[0].Amount__c;
                    }
                    else{
                        disbursementRecord.Amount__c = getCurrencyForPIEF[0].Amount__c;  
                    }
                    disbursementRecord.Release_Grant_Amount__c = disbursementRecord.Amount__c;
                    disbursementList.add(disbursementRecord);
                }
                for(integer i=1 ; i<=disbursementList.size() ; i+=3){
                                
                                //if(disbursementList[i].Contact__r.Industrial_Fellowship_Type__c.contains('PIEF')){
                                system.debug('testing=>'+disbursementList[i]);
                                system.debug('testing=>'+disbursementList[i].Send_SE_UC_reminder__c);
                                disbursementList[i].Send_SE_UC_reminder__c = true;
                                disbursementList[i].Send_Closure_remainder__c	 = true;
                               // }
                            }
            }
            */
            if(!disbursementList.isEmpty()){
                insert disbursementList;
            }
        }
        
    }
    
    public void createDisbursmentFRecordFor_two_plus_two(Map<Id, Application_Proposal__c> newProposalMap,Map<Id,Application_Proposal__c> oldProposalMap){
        Set<id> proposalId = New Set<Id>();
        List<Disbursement_Schedule__c> disbursementList = New List<Disbursement_Schedule__c>();
        Decimal perDayAmount;
        
        for(Application_Proposal__c proposalRec : newProposalMap.values()){
            system.debug('proposalRec--->'+proposalRec.RecordType_Name__c);
            system.debug('proposalRec.Proposal_Stages__c ::'+proposalRec.Proposal_Stages__c);
            system.debug('RecordType ::'+proposalRec.RecordType_Name__c);
            if(proposalRec.Proposal_Stages__c != null && proposalRec.Proposal_Stages__c != oldProposalMap.get(proposalRec.Id).Proposal_Stages__c && proposalRec.Proposal_Stages__c == 'Under Award'){
                if(proposalRec.RecordType_Name__c == 'Two Plus Two'){
                    proposalId.add(proposalRec.Id);
                }
            }
        }
        system.debug('proposalId ::'+proposalId);
        List<Contact> contactList = [SELECT Id,Name,Proposals__c,Proposals__r.Name,Tentative_End_Date__c,Tentative_Start_Date__c,Proposals__r.RecordType_Name__c FROM Contact WHERE Proposals__c In : proposalId];
        List<Account> accountList = [SELECT Id,Name,Proposals__c,YE_1_Released_Grant__c,YE_2_Released_Grant__c,YE_3_Released_Grant__c,Proposals__r.Name,Proposals__r.Actual_Application_Start_Date__c,YE_1_Total_Allocated__c, YE_2_Total_Allocated__c, YE_3_Total_Allocated__c,Proposals__r.RecordType_Name__c FROM Account WHERE Proposals__c In : proposalId];
        system.debug('contactList ::'+contactList);
        
        if(!accountList.isEMpty()){
            for(Account acc : accountList){
                	Contact con = [SELECT Id,accountid,Name,Proposals__c,Proposals__r.Name,Tentative_End_Date__c,Tentative_Start_Date__c,Proposals__r.RecordType_Name__c from contact where accountid =: acc.id];
                
                	//Tranche 1
                    Disbursement_Schedule__c disbursementRecord = New Disbursement_Schedule__c();
                    disbursementRecord.proposals__c = acc.proposals__c;
                    disbursementRecord.Contact__c = con.Id;
                    disbursementRecord.Tranche__c = '1';
                    disbursementRecord.Disbursement_Name__c = 'DS-' + con.Proposals__r.Name.replace('IGSTC-','') + '-' + disbursementRecord.Tranche__c + '-' + con.Name;
                    disbursementRecord.Start_Date__c = acc.Proposals__r.Actual_Application_Start_Date__c;
                    disbursementRecord.End_Date__c = acc.Proposals__r.Actual_Application_Start_Date__c.addYears(1).addDays(-1);
                    disbursementRecord.Amount__c = acc.YE_1_Released_Grant__c;
                
                    disbursementList.add(disbursementRecord);
                    
                	//Tranche 2
                    Disbursement_Schedule__c disbursementRecord1 = New Disbursement_Schedule__c();
                    disbursementRecord1.proposals__c = acc.proposals__c;
                    disbursementRecord1.Contact__c = con.Id;
                    disbursementRecord1.Tranche__c = '2';
                    disbursementRecord1.Disbursement_Name__c = 'DS-' + con.Proposals__r.Name.replace('IGSTC-','') + '-' + disbursementRecord1.Tranche__c + '-' + con.Name;
                    disbursementRecord1.Start_Date__c = acc.Proposals__r.Actual_Application_Start_Date__c.addYears(1);
                    disbursementRecord1.End_Date__c = acc.Proposals__r.Actual_Application_Start_Date__c.addYears(2).addDays(-1);
                    disbursementRecord1.Amount__c = acc.YE_2_Released_Grant__c;
                    disbursementList.add(disbursementRecord1);
                    
                
                	//Tranche 3
                    Disbursement_Schedule__c disbursementRecord2 = New Disbursement_Schedule__c();
                    disbursementRecord2.proposals__c = acc.proposals__c;
                    disbursementRecord2.Contact__c = con.Id;
                    disbursementRecord2.Tranche__c = '3';
                    disbursementRecord2.Disbursement_Name__c = 'DS-' + con.Proposals__r.Name.replace('IGSTC-','') + '-' + disbursementRecord2.Tranche__c + '-' + con.Name;
                    disbursementRecord2.Start_Date__c = acc.Proposals__r.Actual_Application_Start_Date__c.addYears(2);
                    disbursementRecord2.End_Date__c = acc.Proposals__r.Actual_Application_Start_Date__c.addYears(3);
                    disbursementRecord2.Amount__c = acc.YE_3_Released_Grant__c;
                    disbursementList.add(disbursementRecord2);
            }
            
                
            if(!disbursementList.isEmpty()){
                insert disbursementList; 
            } 
        }
        
    }
    
    
    public void createDisbursmentFRecordForPECFAR(Map<Id, Application_Proposal__c> newProposalMap,Map<Id,Application_Proposal__c> oldProposalMap){
        Set<id> proposalId = New Set<Id>();
        List<Disbursement_Schedule__c> disbursementList = New List<Disbursement_Schedule__c>();
        Decimal perDayAmount;
        
        for(Application_Proposal__c proposalRec : newProposalMap.values()){
            system.debug('proposalRec--->'+proposalRec.RecordType_Name__c);
            system.debug('proposalRec.Proposal_Stages__c ::'+proposalRec.Proposal_Stages__c);
            system.debug('RecordType ::'+proposalRec.RecordType_Name__c);
            if(proposalRec.Proposal_Stages__c != null && proposalRec.Proposal_Stages__c != oldProposalMap.get(proposalRec.Id).Proposal_Stages__c && proposalRec.Proposal_Stages__c == 'Under Decision'){
                if(proposalRec.RecordType_Name__c == 'PECFAR'){
                    proposalId.add(proposalRec.Id);
                }
            }
        }
        system.debug('proposalId ::'+proposalId);
        List<Contact> contactList = [SELECT Id,Name,account.BillingCountry,Proposals__c,Proposals__r.Disbursement_Type_for_German_Awardee__c,Proposals__r.Name,Tentative_End_Date__c,Tentative_Start_Date__c,Proposals__r.RecordType_Name__c FROM Contact WHERE Proposals__c In : proposalId];
        system.debug('contactList ::'+contactList);
        
        if(!contactList.isEMpty()){
            for(Contact con : contactList){
                Long Difference = con.Tentative_Start_Date__c.daysBetween(con.Tentative_End_Date__c);
                system.debug('Difference ::'+Difference);
                
                if(con.Account.BillingCountry == 'India' || (con.Account.BillingCountry == 'Germany' && con.Proposals__r.Disbursement_Type_for_German_Awardee__c == 'Standard' )){
                    if(Difference < 60){
                        List<Grant_Portal_Docs__c> getCurrencyForTwoMonths = [Select Id,Name,Amount__c,Campaign__c,Campaign_Type__c From Grant_Portal_Docs__c WHERE Campaign__c = 'PECFAR' AND Campaign_Type__c = 'Less Two Months'];
                        Disbursement_Schedule__c disbursementRecord = New Disbursement_Schedule__c();
                        Long daysBetweenTwoDates = con.Tentative_Start_Date__c.daysBetween(con.Tentative_End_Date__c);
                        system.debug('daysBetweenTwoDates -----> '+daysBetweenTwoDates);
                        disbursementRecord.proposals__c = con.proposals__c;
                        disbursementRecord.Contact__c = con.Id;
                        disbursementRecord.Tranche__c = '1';
                        disbursementRecord.Tranche_Name__c = con.Name + ' - 1';
                        disbursementRecord.Disbursement_Name__c = 'DS-' + con.Proposals__r.Name.replace('IGSTC-','') + '-' + disbursementRecord.Tranche__c + '-' + con.Name;
                        disbursementRecord.Start_Date__c = con.Tentative_Start_Date__c;
                        disbursementRecord.End_Date__c = con.Tentative_End_Date__c;
                        Decimal TotalAmount = daysBetweenTwoDates * 76.67 * 90 / 100;
                        system.debug('TotalAmount --------> '+TotalAmount);
                        disbursementRecord.Amount__c = TotalAmount;
                        disbursementRecord.Release_Grant_Amount__c = disbursementRecord.Amount__c;
                        disbursementList.add(disbursementRecord);
                        
                        Disbursement_Schedule__c disbursementRecord1 = New Disbursement_Schedule__c();
                        disbursementRecord1.proposals__c = con.proposals__c;
                        disbursementRecord1.Contact__c = con.Id;
                        disbursementRecord1.Tranche__c = '2';
                        disbursementRecord1.Tranche_Name__c = con.Name + ' - 2';
                        disbursementRecord1.Disbursement_Name__c = 'DS-' + con.Proposals__r.Name.replace('IGSTC-','') + '-' + disbursementRecord1.Tranche__c + '-' + con.Name;
                        disbursementRecord1.Start_Date__c = con.Tentative_Start_Date__c;
                        disbursementRecord1.End_Date__c = con.Tentative_End_Date__c;
                        Decimal TotalAmount1 = daysBetweenTwoDates * 76.67 * 10 / 100; 
                        system.debug('TotalAmount --------> '+TotalAmount1);
                        disbursementRecord1.Amount__c = TotalAmount1;
                        disbursementRecord1.Release_Grant_Amount__c = disbursementRecord1.Amount__c;
                        disbursementList.add(disbursementRecord1);
                    } 
                    else{
                        List<Grant_Portal_Docs__c> getCurrencyForLessTwoMonths = [Select Id,Name,Amount__c,Campaign__c,Campaign_Type__c From Grant_Portal_Docs__c WHERE Campaign__c = 'PECFAR' AND Campaign_Type__c = 'Two Months'];
                        Disbursement_Schedule__c disbursementRecord = New Disbursement_Schedule__c();
                        disbursementRecord.proposals__c = con.proposals__c;
                        disbursementRecord.Contact__c = con.Id;
                        disbursementRecord.Tranche__c = '1';
                        disbursementRecord.Tranche_Name__c = con.Name + ' - 1';
                        disbursementRecord.Disbursement_Name__c = 'DS-' + con.Proposals__r.Name.replace('IGSTC-','') + '-' + disbursementRecord.Tranche__c + '-' + con.Name;
                        disbursementRecord.Start_Date__c = con.Tentative_Start_Date__c;
                        disbursementRecord.End_Date__c = con.Tentative_Start_Date__c.addMonths(1).addDays(-1);
                        disbursementRecord.Amount__c = getCurrencyForLessTwoMonths[0].Amount__c;
                        disbursementRecord.Release_Grant_Amount__c = disbursementRecord.Amount__c;
                        disbursementList.add(disbursementRecord);
                        
                        Disbursement_Schedule__c disbursementRecord2 = New Disbursement_Schedule__c();
                        disbursementRecord2.proposals__c = con.proposals__c;
                        disbursementRecord2.Contact__c = con.Id;
                        disbursementRecord2.Tranche__c = '2';
                        disbursementRecord2.Tranche_Name__c = con.Name + ' - 2';
                        disbursementRecord2.Disbursement_Name__c = 'DS-' + con.Proposals__r.Name.replace('IGSTC-','') + '-' + disbursementRecord2.Tranche__c + '-' + con.Name;
                        disbursementRecord2.Start_Date__c = con.Tentative_Start_Date__c.addMonths(1);
                        disbursementRecord2.End_Date__c = con.Tentative_Start_Date__c.addMonths(2).addDays(-1);
                        disbursementRecord2.Amount__c = getCurrencyForLessTwoMonths[0].Amount__c;
                        disbursementRecord2.Release_Grant_Amount__c = disbursementRecord2.Amount__c;
                        disbursementList.add(disbursementRecord2);
                    }
                } 
               /* else if(con.Account.BillingCountry == 'Germany' && con.Proposals__r.Disbursement_Type_for_German_Awardee__c == 'Standard' ){
                    List<Grant_Portal_Docs__c> getCurrencyForTwoMonths = [Select Id,Name,Amount__c,Campaign__c,Campaign_Type__c From Grant_Portal_Docs__c WHERE Campaign__c = 'PECFAR' AND Campaign_Type__c = 'Less Two Months'];
                        Disbursement_Schedule__c disbursementRecord = New Disbursement_Schedule__c();
                        Long daysBetweenTwoDates = con.Tentative_Start_Date__c.daysBetween(con.Tentative_End_Date__c);
                        system.debug('daysBetweenTwoDates -----> '+daysBetweenTwoDates);
                        disbursementRecord.proposals__c = con.proposals__c;
                        disbursementRecord.Contact__c = con.Id;
                        disbursementRecord.Tranche__c = '1';
                        disbursementRecord.Disbursement_Name__c = 'DS-' + con.Proposals__r.Name.replace('IGSTC-','') + '-' + disbursementRecord.Tranche__c;
                        disbursementRecord.Start_Date__c = con.Tentative_Start_Date__c;
                        disbursementRecord.End_Date__c = con.Tentative_End_Date__c;
                        Decimal TotalAmount = daysBetweenTwoDates * 76.67 * 90 / 100;
                        system.debug('TotalAmount --------> '+TotalAmount);
                        disbursementRecord.Amount__c = TotalAmount;
                        disbursementRecord.Release_Grant_Amount__c = disbursementRecord.Amount__c;
                        disbursementList.add(disbursementRecord);
                        
                        Disbursement_Schedule__c disbursementRecord1 = New Disbursement_Schedule__c();
                        disbursementRecord1.proposals__c = con.proposals__c;
                        disbursementRecord1.Contact__c = con.Id;
                        disbursementRecord1.Tranche__c = '2';
                        disbursementRecord1.Disbursement_Name__c = 'DS-' + con.Proposals__r.Name.replace('IGSTC-','') + '-' + disbursementRecord1.Tranche__c;
                        disbursementRecord1.Start_Date__c = con.Tentative_Start_Date__c;
                        disbursementRecord1.End_Date__c = con.Tentative_End_Date__c;
                        Decimal TotalAmount1 = daysBetweenTwoDates * 76.67 * 10 / 100; 
                        system.debug('TotalAmount --------> '+TotalAmount1);
                        disbursementRecord1.Amount__c = TotalAmount1;
                        disbursementRecord1.Release_Grant_Amount__c = disbursementRecord1.Amount__c;
                        disbursementList.add(disbursementRecord1);
                } */
                else if(con.Account.BillingCountry == 'Germany' && con.Proposals__r.Disbursement_Type_for_German_Awardee__c == 'Reimbursement' ){
                    Long daysBetweenTwoDates = con.Tentative_Start_Date__c.daysBetween(con.Tentative_End_Date__c);
                    system.debug('daysBetweenTwoDates -----> '+daysBetweenTwoDates);
                    
                    List<Grant_Portal_Docs__c> getCurrencyForLessTwoMonths = [Select Id,Name,Amount__c,Campaign__c,Campaign_Type__c From Grant_Portal_Docs__c WHERE Campaign__c = 'PECFAR' AND Campaign_Type__c = 'Two Months'];
                    Disbursement_Schedule__c disbursementRecord = New Disbursement_Schedule__c();
                    disbursementRecord.proposals__c = con.proposals__c;
                    disbursementRecord.Contact__c = con.Id;
                    disbursementRecord.Tranche__c = '1';
                    disbursementRecord.Tranche_Name__c = con.Name + ' - 1';
                    disbursementRecord.Disbursement_Name__c = 'DS-' + con.Proposals__r.Name.replace('IGSTC-','') + '-' + disbursementRecord.Tranche__c + '-' + con.Name;
                    disbursementRecord.Start_Date__c = con.Tentative_Start_Date__c;
                    disbursementRecord.End_Date__c = con.Tentative_End_Date__c;
                    disbursementRecord.Amount__c =  daysBetweenTwoDates * 76.67 ;
                    disbursementRecord.Release_Grant_Amount__c = disbursementRecord.Amount__c;
                    disbursementList.add(disbursementRecord);
                    
                    
                }
                
                /*if(Difference <= 21){
                    List<Grant_Portal_Docs__c> getCurrencyForTwoMonths = [Select Id,Name,Amount__c,Campaign__c,Campaign_Type__c From Grant_Portal_Docs__c WHERE Campaign__c = 'PECFAR' AND Campaign_Type__c = 'Less Two Months'];
                    Disbursement_Schedule__c disbursementRecord = New Disbursement_Schedule__c();
                    Long daysBetweenTwoDates = con.Tentative_Start_Date__c.daysBetween(con.Tentative_End_Date__c);
                    system.debug('daysBetweenTwoDates -----> '+daysBetweenTwoDates);
                    disbursementRecord.proposals__c = con.proposals__c;
                    disbursementRecord.Contact__c = con.Id;
                    disbursementRecord.Tranche__c = '1';
                    disbursementRecord.Disbursement_Name__c = 'DS-' + con.Proposals__r.Name.replace('IGSTC-','') + '-' + disbursementRecord.Tranche__c;
                    disbursementRecord.Start_Date__c = con.Tentative_Start_Date__c;
                    disbursementRecord.End_Date__c = con.Tentative_End_Date__c;
                    Decimal TotalAmount = getCurrencyForTwoMonths[0].Amount__c/31*daysBetweenTwoDates;
                    system.debug('TotalAmount --------> '+TotalAmount);
                    disbursementRecord.Amount__c = TotalAmount/90*100;
                    disbursementRecord.Release_Grant_Amount__c = disbursementRecord.Amount__c;
                    disbursementList.add(disbursementRecord);
                    
                }else if (Difference >21 && Difference <= 31){
                    List<Grant_Portal_Docs__c> getCurrencyForLessTwoMonths = [Select Id,Name,Amount__c,Campaign__c,Campaign_Type__c From Grant_Portal_Docs__c WHERE Campaign__c = 'PECFAR' AND Campaign_Type__c = 'Two Months'];
                    system.debug('getCurrencyForLessTwoMonths -----------> '+getCurrencyForLessTwoMonths);
                    Long MonthsDifference = con.Tentative_Start_Date__c.monthsBetween(con.Tentative_End_Date__c);
                    system.debug('MonthsDifference ----> '+MonthsDifference);
                    Disbursement_Schedule__c disbursementRecord = New Disbursement_Schedule__c();
                    disbursementRecord.proposals__c = con.proposals__c;
                    disbursementRecord.Contact__c = con.Id;
                    disbursementRecord.Tranche__c = '1';
                    disbursementRecord.Disbursement_Name__c = 'DS-' + con.Proposals__r.Name.replace('IGSTC-','') + '-' + disbursementRecord.Tranche__c;
                    disbursementRecord.Start_Date__c = con.Tentative_Start_Date__c;
                    disbursementRecord.End_Date__c = con.Tentative_End_Date__c;
                    disbursementRecord.Amount__c = getCurrencyForLessTwoMonths[0].Amount__c;
                    disbursementRecord.Release_Grant_Amount__c = disbursementRecord.Amount__c;
                    disbursementList.add(disbursementRecord);
                }else{
                    List<Grant_Portal_Docs__c> getCurrencyForLessTwoMonths = [Select Id,Name,Amount__c,Campaign__c,Campaign_Type__c From Grant_Portal_Docs__c WHERE Campaign__c = 'PECFAR' AND Campaign_Type__c = 'Two Months'];
                    Disbursement_Schedule__c disbursementRecord = New Disbursement_Schedule__c();
                    disbursementRecord.proposals__c = con.proposals__c;
                    disbursementRecord.Contact__c = con.Id;
                    disbursementRecord.Tranche__c = '1';
                    disbursementRecord.Disbursement_Name__c = 'DS-' + con.Proposals__r.Name.replace('IGSTC-','') + '-' + disbursementRecord.Tranche__c;
                    disbursementRecord.Start_Date__c = con.Tentative_Start_Date__c;
                    disbursementRecord.End_Date__c = con.Tentative_Start_Date__c.addMonths(1).addDays(-1);
                    disbursementRecord.Amount__c = getCurrencyForLessTwoMonths[0].Amount__c;
                    disbursementRecord.Release_Grant_Amount__c = disbursementRecord.Amount__c;
                    disbursementList.add(disbursementRecord);
                    
                    Disbursement_Schedule__c disbursementRecord2 = New Disbursement_Schedule__c();
                    disbursementRecord2.proposals__c = con.proposals__c;
                    disbursementRecord2.Contact__c = con.Id;
                    disbursementRecord2.Tranche__c = '2';
                    disbursementRecord2.Disbursement_Name__c = 'DS-' + con.Proposals__r.Name.replace('IGSTC-','') + '-' + disbursementRecord2.Tranche__c;
                    disbursementRecord2.Start_Date__c = con.Tentative_Start_Date__c.addMonths(1);
                    disbursementRecord2.End_Date__c = con.Tentative_Start_Date__c.addMonths(2).addDays(-1);
                    disbursementRecord2.Amount__c = getCurrencyForLessTwoMonths[0].Amount__c;
                    disbursementRecord2.Release_Grant_Amount__c = disbursementRecord2.Amount__c;
                    disbursementList.add(disbursementRecord2);
                }*/
                
            }
            if(!disbursementList.isEmpty()){
                insert disbursementList; 
            } 
        }
        
    }
    
    public void createDisbursmentFRecordForCONNECTPLUS(Map<Id, Application_Proposal__c> newProposalMap,Map<Id,Application_Proposal__c> oldProposalMap){
        Set<id> proposalId = New Set<Id>();
        List<Disbursement_Schedule__c> disbursementList = New List<Disbursement_Schedule__c>();
        Decimal perDayAmount;
        Long Difference;
        
        for(Application_Proposal__c proposalRec : newProposalMap.values()){
            system.debug('proposalRec--->'+proposalRec.RecordType_Name__c);
            system.debug('proposalRec.Proposal_Stages__c ::'+proposalRec.Proposal_Stages__c);
            system.debug('RecordType ::'+proposalRec.RecordType_Name__c);
            if(proposalRec.Proposal_Stages__c != null && proposalRec.Proposal_Stages__c != oldProposalMap.get(proposalRec.Id).Proposal_Stages__c && proposalRec.Proposal_Stages__c == 'Under Award'){
                if(proposalRec.RecordType_Name__c == 'Connect Plus'){
                    proposalId.add(proposalRec.Id);
                }
            }
        }
        system.debug('proposalId ::'+proposalId);
        List<Application_Proposal__c> proposalList = [select id,Name,Tentative_Start_Date__c,Tentative_End_Date__c,Country_of_Venue__c,Proposed_Date__c,Workshop_Finish_Date__c from Application_Proposal__c where id IN : proposalId];
        
            for(Application_Proposal__c ap : proposalList){
                contact con = [select id,proposals__c,Is_Primary__c,name from contact where proposals__c =: ap.Id and Is_Primary__c = true];
                    //Record1
                    Disbursement_Schedule__c disbursementRecord = New Disbursement_Schedule__c();
                    disbursementRecord.Proposals__c = ap.Id;
                    disbursementRecord.Tranche__c = '1'; 
                    disbursementRecord.Disbursement_Name__c = 'DS-' + ap.Name.replace('IGSTC-','') + '-' + disbursementRecord.Tranche__c + '-' + con.Name;
                    if(ap.Tentative_Start_Date__c != null ){
                        disbursementRecord.Start_Date__c = ap.Tentative_Start_Date__c; 
                    }
                	if(ap.Tentative_End_Date__c != null ){
                        disbursementRecord.End_Date__c = ap.Tentative_End_Date__c; 
                    }
                    disbursementRecord.Amount__c = 75000;
                    system.debug('Amount 1 ----> '+disbursementRecord.Amount__c);
                    disbursementRecord.Release_Grant_Amount__c = disbursementRecord.Amount__c;
                    disbursementRecord.Contact__c = con.id;
                    disbursementList.add(disbursementRecord);
                    
                                
                if(!disbursementList.isEmpty()){
                    insert disbursementList; 
                } 
            
        }
        
        
        
        
    }
    
    
    public void createDisbursmentFRecordForWORKSHOP(Map<Id, Application_Proposal__c> newProposalMap,Map<Id,Application_Proposal__c> oldProposalMap){
        Set<id> proposalId = New Set<Id>();
        List<Disbursement_Schedule__c> disbursementList = New List<Disbursement_Schedule__c>();
        Decimal perDayAmount;
        Long Difference;
        
        for(Application_Proposal__c proposalRec : newProposalMap.values()){
            system.debug('proposalRec--->'+proposalRec.RecordType_Name__c);
            system.debug('proposalRec.Proposal_Stages__c ::'+proposalRec.Proposal_Stages__c);
            system.debug('RecordType ::'+proposalRec.RecordType_Name__c);
            if(proposalRec.Proposal_Stages__c != null && proposalRec.Proposal_Stages__c != oldProposalMap.get(proposalRec.Id).Proposal_Stages__c && proposalRec.Proposal_Stages__c == 'Under Award'){
                if(proposalRec.RecordType_Name__c == 'Workshop'){
                    proposalId.add(proposalRec.Id);
                }
            }
        }
        system.debug('proposalId ::'+proposalId);
        List<Application_Proposal__c> proposalList = [select id,Grantee_Recipient__c,Name,Country_of_Venue__c,Proposed_Date__c,Workshop_Finish_Date__c from Application_Proposal__c where id IN : proposalId];
        List<Expense_Head__c> expenseHeadList = [SELECT Id,Name,Proposals__c,Approved_Amount__c,Year_1_Approved_Amount__c,Year_2_Approved_Amount__c,Year_3_Approved_Amount__c FROM Expense_Head__c WHERE Proposals__c In : proposalId];
        system.debug('expenseHeadList ::'+expenseHeadList);
        Map<String,Decimal> mapOfyear1ApprovedAmount = new Map<String,Decimal>();
        Map<String,Decimal> mapOfyear2ApprovedAmount = new Map<String,Decimal>();
        Map<String,Decimal> mapOfyear3ApprovedAmount = new Map<String,Decimal>();
        Map<String,Integer> totalCountApprovedAmount = new Map<String,Integer>();
        Map<String,Integer> count1ApprovedAmount = new Map<String,Integer>();
        Map<String,Integer> count2ApprovedAmount = new Map<String,Integer>();
        Map<Id,Integer> ApprovedAmountMap = new Map<Id,Integer>();
        if(!expenseHeadList.isEmpty()){
            Integer TotalApprovedAmount = 0;
            for(Expense_Head__c eh : expenseHeadList){
                if(eh.Approved_Amount__c != ''){
                    TotalApprovedAmount = TotalApprovedAmount + Integer.valueOf(eh.Approved_Amount__c);
                    ApprovedAmountMap.put(eh.Proposals__c, TotalApprovedAmount);
                }
            } 
            for(Application_Proposal__c ap : proposalList){
                //contact con = [select id,proposals__c,Is_Primary__c from contact where proposals__c =: ap.Id and Is_Primary__c = true];
                Integer TotalAmount = ApprovedAmountMap.get(ap.id) ;   
                if(ap.Grantee_Recipient__c == 'Indian Grant' ){
                    contact con = [select id,proposals__c,Is_Primary__c, account.BillingCountry,name from contact where proposals__c =: ap.Id and account.BillingCountry = 'India' limit 1];
                    //Record1
                    Disbursement_Schedule__c disbursementRecord = New Disbursement_Schedule__c();
                    disbursementRecord.Proposals__c = ap.Id;
                    disbursementRecord.Tranche__c = '1'; 
                    disbursementRecord.Disbursement_Name__c = 'DS-' + ap.Name.replace('IGSTC-','') + '-' + disbursementRecord.Tranche__c + '-' + con.Name;
                    if(ap.Proposed_Date__c != null){
                        disbursementRecord.Start_Date__c = ap.Proposed_Date__c; 
                        disbursementRecord.End_Date__c = ap.Proposed_Date__c; 
                    }
                    disbursementRecord.Amount__c = TotalAmount*80/100;
                    system.debug('Amount 1 ----> '+disbursementRecord.Amount__c);
                    disbursementRecord.Release_Grant_Amount__c = disbursementRecord.Amount__c;
                    disbursementRecord.Contact__c = con.id;
                    disbursementList.add(disbursementRecord);
                    
                    //Record 2
                    Disbursement_Schedule__c disbursementRecord1 = New Disbursement_Schedule__c();
                    disbursementRecord1.Proposals__c = ap.Id;
                    disbursementRecord1.Tranche__c = '2'; 
                    disbursementRecord1.Disbursement_Name__c = 'DS-' + ap.Name.replace('IGSTC-','') + '-' + disbursementRecord1.Tranche__c + '-' + con.Name;
                    if(ap.Workshop_Finish_Date__c != null){
                        disbursementRecord1.Start_Date__c = ap.Workshop_Finish_Date__c;
                        disbursementRecord1.End_Date__c = ap.Workshop_Finish_Date__c; 
                    }
                    disbursementRecord1.Amount__c = TotalAmount*20/100;
                    system.debug('Amount 1 ----> '+disbursementRecord1.Amount__c);
                    disbursementRecord1.Release_Grant_Amount__c = disbursementRecord1.Amount__c;
                    disbursementRecord1.Contact__c = con.id;
                    disbursementList.add(disbursementRecord1);
                    
                }
                else if(ap.Grantee_Recipient__c == 'German Grant' ){
                    contact con1 = [select id,proposals__c,Is_Primary__c, account.BillingCountry,name from contact where proposals__c =: ap.Id and account.BillingCountry = 'Germany' limit 1];
                    //Record1
                    Disbursement_Schedule__c disbursementRecord = New Disbursement_Schedule__c();
                    disbursementRecord.Proposals__c = ap.Id;
                    disbursementRecord.Tranche__c = '1'; 
                    disbursementRecord.Disbursement_Name__c = 'DS-' + ap.Name.replace('IGSTC-','') + '-' + disbursementRecord.Tranche__c + '-' + con1.Name;
                    if(ap.Proposed_Date__c != null){
                        disbursementRecord.Start_Date__c = ap.Proposed_Date__c; 
                        disbursementRecord.End_Date__c = ap.Proposed_Date__c; 
                    }
                    disbursementRecord.Amount__c = TotalAmount*90/100;
                    system.debug('Amount 1 ----> '+disbursementRecord.Amount__c);
                    disbursementRecord.Release_Grant_Amount__c = disbursementRecord.Amount__c;
                    disbursementRecord.Contact__c = con1.id;
                    disbursementList.add(disbursementRecord);
                    
                    //Record 2
                    Disbursement_Schedule__c disbursementRecord1 = New Disbursement_Schedule__c();
                    disbursementRecord1.Proposals__c = ap.Id;
                    disbursementRecord1.Tranche__c = '2'; 
                    disbursementRecord1.Disbursement_Name__c = 'DS-' + ap.Name.replace('IGSTC-','') + '-' + disbursementRecord1.Tranche__c + '-' + con1.Name;
                    if(ap.Workshop_Finish_Date__c != null){
                        disbursementRecord1.Start_Date__c = ap.Workshop_Finish_Date__c;
                        disbursementRecord1.End_Date__c = ap.Workshop_Finish_Date__c; 
                    }
                    disbursementRecord1.Amount__c = TotalAmount*10/100;
                    system.debug('Amount 1 ----> '+disbursementRecord1.Amount__c);
                    disbursementRecord1.Release_Grant_Amount__c = disbursementRecord1.Amount__c;
                    disbursementRecord1.Contact__c = con1.id;
                    disbursementList.add(disbursementRecord1);
                    
                }
                else if(ap.Grantee_Recipient__c == 'Split Grant' ){
                    contact con = [select id,proposals__c,Is_Primary__c, account.BillingCountry,name from contact where proposals__c =: ap.Id and account.BillingCountry = 'India' limit 1];
                    //Record1
                    Disbursement_Schedule__c disbursementRecord = New Disbursement_Schedule__c();
                    disbursementRecord.Proposals__c = ap.Id;
                    disbursementRecord.Tranche__c = '1'; 
                    disbursementRecord.Disbursement_Name__c = 'DS-' + ap.Name.replace('IGSTC-','') + '-' + disbursementRecord.Tranche__c + '-' + con.Name;
                    if(ap.Proposed_Date__c != null){
                        disbursementRecord.Start_Date__c = ap.Proposed_Date__c; 
                        disbursementRecord.End_Date__c = ap.Proposed_Date__c; 
                    }
                    disbursementRecord.Amount__c = TotalAmount*80/100;
                    system.debug('Amount 1 ----> '+disbursementRecord.Amount__c);
                    disbursementRecord.Release_Grant_Amount__c = disbursementRecord.Amount__c;
                    disbursementRecord.Contact__c = con.id;
                    disbursementList.add(disbursementRecord);
                    
                    //Record 2
                    Disbursement_Schedule__c disbursementRecord1 = New Disbursement_Schedule__c();
                    disbursementRecord1.Proposals__c = ap.Id;
                    disbursementRecord1.Tranche__c = '2'; 
                    disbursementRecord1.Disbursement_Name__c = 'DS-' + ap.Name.replace('IGSTC-','') + '-' + disbursementRecord1.Tranche__c + '-' + con.Name;
                    if(ap.Workshop_Finish_Date__c != null){
                        disbursementRecord1.Start_Date__c = ap.Workshop_Finish_Date__c;
                        disbursementRecord1.End_Date__c = ap.Workshop_Finish_Date__c; 
                    }
                    disbursementRecord1.Amount__c = TotalAmount*20/100;
                    system.debug('Amount 1 ----> '+disbursementRecord1.Amount__c);
                    disbursementRecord1.Release_Grant_Amount__c = disbursementRecord1.Amount__c;
                    disbursementRecord1.Contact__c = con.id;
                    disbursementList.add(disbursementRecord1);
                    
                    contact con1 = [select id,proposals__c,Is_Primary__c, account.BillingCountry,name from contact where proposals__c =: ap.Id and account.BillingCountry = 'Germany' limit 1];
                    //Record3
                    Disbursement_Schedule__c disbursementRecord2 = New Disbursement_Schedule__c();
                    disbursementRecord2.Proposals__c = ap.Id;
                    disbursementRecord2.Tranche__c = '3'; 
                    disbursementRecord2.Disbursement_Name__c = 'DS-' + ap.Name.replace('IGSTC-','') + '-' + disbursementRecord2.Tranche__c + '-' + con.Name;
                    if(ap.Proposed_Date__c != null){
                        disbursementRecord2.Start_Date__c = ap.Proposed_Date__c; 
                        disbursementRecord2.End_Date__c = ap.Proposed_Date__c; 
                    }
                    disbursementRecord2.Amount__c = TotalAmount*90/100;
                    system.debug('Amount 1 ----> '+disbursementRecord2.Amount__c);
                    disbursementRecord2.Release_Grant_Amount__c = disbursementRecord2.Amount__c;
                    disbursementRecord2.Contact__c = con1.id;
                    disbursementList.add(disbursementRecord2);
                    
                    //Record 4
                    Disbursement_Schedule__c disbursementRecord3 = New Disbursement_Schedule__c();
                    disbursementRecord3.Proposals__c = ap.Id;
                    disbursementRecord3.Tranche__c = '4'; 
                    disbursementRecord3.Disbursement_Name__c = 'DS-' + ap.Name.replace('IGSTC-','') + '-' + disbursementRecord3.Tranche__c + '-' + con1.Name;
                    if(ap.Workshop_Finish_Date__c != null){
                        disbursementRecord3.Start_Date__c = ap.Workshop_Finish_Date__c;
                        disbursementRecord3.End_Date__c = ap.Workshop_Finish_Date__c; 
                    }
                    disbursementRecord3.Amount__c = TotalAmount*10/100;
                    system.debug('Amount 1 ----> '+disbursementRecord3.Amount__c);
                    disbursementRecord3.Release_Grant_Amount__c = disbursementRecord3.Amount__c;
                    disbursementRecord3.Contact__c = con1.id;
                    disbursementList.add(disbursementRecord3);
                    
                }
                
                if(!disbursementList.isEmpty()){
                    insert disbursementList; 
                } 
                
                Task taskRecord = New Task();
                taskRecord.WhatId = ap.id;
                taskRecord.Subject = 'Please upload Closure Note.';
                insert taskRecord;
            }
        }
        
        
        
        
    }
    
    public void createDisbursmentFRecordForWISER(Map<Id, Application_Proposal__c> newProposalMap,Map<Id,Application_Proposal__c> oldProposalMap){
        Set<id> proposalId = New Set<Id>();
        List<Disbursement_Schedule__c> disbursementList = New List<Disbursement_Schedule__c>();
        Decimal perDayAmount;
        Long Difference;
        
        for(Application_Proposal__c proposalRec : newProposalMap.values()){
            system.debug('proposalRec--->'+proposalRec.RecordType_Name__c);
            system.debug('proposalRec.Proposal_Stages__c ::'+proposalRec.Proposal_Stages__c);
            system.debug('RecordType ::'+proposalRec.RecordType_Name__c);
            if(proposalRec.Proposal_Stages__c != null && proposalRec.Proposal_Stages__c != oldProposalMap.get(proposalRec.Id).Proposal_Stages__c && proposalRec.Proposal_Stages__c == 'Under Award'){
                if(proposalRec.RecordType_Name__c == 'WISER'){
                    proposalId.add(proposalRec.Id);
                }
            }
        }
        system.debug('proposalId ::'+proposalId);
        List<Application_Proposal__c> proposalList = [select id,Name,Tentative_Start_Date__c from Application_Proposal__c where id IN : proposalId];
        List<Expense_Head__c> expenseHeadList = [SELECT Id,Name,Proposals__c,Year_1_Approved_Amount__c,Year_2_Approved_Amount__c,Year_3_Approved_Amount__c FROM Expense_Head__c WHERE Proposals__c In : proposalId];
        system.debug('expenseHeadList ::'+expenseHeadList);
        Map<String,Decimal> mapOfyear1ApprovedAmount = new Map<String,Decimal>();
        Map<String,Decimal> mapOfyear2ApprovedAmount = new Map<String,Decimal>();
        Map<String,Decimal> mapOfyear3ApprovedAmount = new Map<String,Decimal>();
        Map<String,Integer> totalCountApprovedAmount = new Map<String,Integer>();
        Map<String,Integer> count1ApprovedAmount = new Map<String,Integer>();
        Map<String,Integer> count2ApprovedAmount = new Map<String,Integer>();
        Map<String,Integer> count3ApprovedAmount = new Map<String,Integer>();
        if(!expenseHeadList.isEmpty()){
            List<AggregateResult> result =  [Select Proposals__c, count(Id) totalcount , count(Year_1_Approved_Amount__c) count1 , count(Year_2_Approved_Amount__c) count2, count(Year_3_Approved_Amount__c) count3, 
                                             sum(Year_1_Approved_Amount__c) cnt1 , sum(Year_2_Approved_Amount__c) cnt2,sum(Year_3_Approved_Amount__c) cnt3 
                                             FROM Expense_Head__c where Proposals__c =: proposalId group by Proposals__c];
            for(AggregateResult ar:result){
                String approvedproposalId =(String)ar.get('Proposals__c');
                Integer totalCount = (Integer)ar.get('totalcount');
                Integer year1Count = (Integer)ar.get('count1');
                Integer year2Count = (Integer)ar.get('count2');
                Integer year3Count = (Integer)ar.get('count3');
                Decimal year1ApprovedAmount =(Decimal)ar.get('cnt1');
                Decimal year2ApprovedAmount =(Decimal)ar.get('cnt2');
                Decimal year3ApprovedAmount =(Decimal)ar.get('cnt3');
                
                mapOfyear1ApprovedAmount.put(approvedproposalId,year1ApprovedAmount);
                mapOfyear2ApprovedAmount.put(approvedproposalId,year2ApprovedAmount);
                mapOfyear3ApprovedAmount.put(approvedproposalId,year3ApprovedAmount);
                
                totalCountApprovedAmount.put(approvedproposalId,totalCount);
                count1ApprovedAmount.put(approvedproposalId,year1Count);
                count2ApprovedAmount.put(approvedproposalId,year2Count);
                count3ApprovedAmount.put(approvedproposalId,year3Count);
                
                
                
            }
            system.debug('test=>mapOfyear1ApprovedAmount=>'+mapOfyear1ApprovedAmount);
            system.debug('test=>count1ApprovedAmount=>'+count1ApprovedAmount);
            
            for(Application_Proposal__c ap : proposalList){
                contact con = [select id,proposals__c,Is_Primary__c,name from contact where proposals__c =: ap.Id and Is_Primary__c = true];
                if(totalCountApprovedAmount.containsKey(ap.Id) || count1ApprovedAmount.containsKey(ap.Id) || count2ApprovedAmount.containsKey(ap.Id) || count3ApprovedAmount.containsKey(ap.Id)){
                    if(count1ApprovedAmount.get(ap.Id) != totalCountApprovedAmount.get(ap.Id) || count2ApprovedAmount.get(ap.Id) != totalCountApprovedAmount.get(ap.Id) || count3ApprovedAmount.get(ap.Id) != totalCountApprovedAmount.get(ap.Id)){
                        ap.addError('Please update all expense heads approved amount!!');
                    }
                }
                if(mapOfyear1ApprovedAmount.containsKey(ap.Id) || mapOfyear2ApprovedAmount.containsKey(ap.Id) || mapOfyear3ApprovedAmount.containsKey(ap.Id)){
                    //Record1
                    Disbursement_Schedule__c disbursementRecord = New Disbursement_Schedule__c();
                    disbursementRecord.Proposals__c = ap.Id;
                    disbursementRecord.Tranche__c = '1'; 
                    disbursementRecord.Disbursement_Name__c = 'DS-' + ap.Name.replace('IGSTC-','') + '-' + disbursementRecord.Tranche__c + '-' + con.Name;
                    if(ap.Tentative_Start_Date__c != null){
                        disbursementRecord.Start_Date__c = ap.Tentative_Start_Date__c; 
                        disbursementRecord.End_Date__c = ap.Tentative_Start_Date__c.addyears(1).addDays(-1); 
                    }
                    disbursementRecord.Amount__c = mapOfyear1ApprovedAmount.get(ap.Id);
                    system.debug('Amount 1 ----> '+disbursementRecord.Amount__c);
                    disbursementRecord.Release_Grant_Amount__c = disbursementRecord.Amount__c;
                    disbursementRecord.Contact__c = con.id;
                    disbursementList.add(disbursementRecord);
                    
                    //Record 2
                    Disbursement_Schedule__c disbursementRecord1 = New Disbursement_Schedule__c();
                    disbursementRecord1.Proposals__c = ap.Id;
                    disbursementRecord1.Tranche__c = '2'; 
                    disbursementRecord1.Disbursement_Name__c = 'DS-' + ap.Name.replace('IGSTC-','') + '-' + disbursementRecord1.Tranche__c + '-' + con.Name;
                    if(ap.Tentative_Start_Date__c != null){
                        disbursementRecord1.Start_Date__c = ap.Tentative_Start_Date__c.addyears(1);
                        disbursementRecord1.End_Date__c = ap.Tentative_Start_Date__c.addyears(2).addDays(-1); 
                    }
                    disbursementRecord1.Amount__c = mapOfyear2ApprovedAmount.get(ap.Id);
                    system.debug('Amount 1 ----> '+disbursementRecord1.Amount__c);
                    disbursementRecord1.Release_Grant_Amount__c = disbursementRecord1.Amount__c;
                    disbursementRecord1.Contact__c = con.id;
                    disbursementList.add(disbursementRecord1);
                    
                    //Record 3
                    Disbursement_Schedule__c disbursementRecord2 = New Disbursement_Schedule__c();
                    disbursementRecord2.Proposals__c = ap.Id;
                    disbursementRecord2.Tranche__c = '3'; 
                    disbursementRecord2.Disbursement_Name__c = 'DS-' + ap.Name.replace('IGSTC-','') + '-' + disbursementRecord2.Tranche__c + '-' + con.Name;
                    if(ap.Tentative_Start_Date__c != null){
                        disbursementRecord2.Start_Date__c = ap.Tentative_Start_Date__c.addyears(2);
                        disbursementRecord2.End_Date__c = ap.Tentative_Start_Date__c.addyears(3).addDays(-1); 
                    }
                    disbursementRecord2.Amount__c = mapOfyear3ApprovedAmount.get(ap.Id);
                    system.debug('Amount 1 ----> '+disbursementRecord2.Amount__c);
                    disbursementRecord2.Release_Grant_Amount__c = disbursementRecord2.Amount__c;
                    disbursementRecord2.Contact__c = con.id;
                    disbursementList.add(disbursementRecord2);
                }
                if(!disbursementList.isEmpty()){
                    insert disbursementList; 
                } 
            }
        }
        
       
    }
    
    
    public void createDisbursmentFRecordForSING(Map<Id, Application_Proposal__c> newProposalMap,Map<Id,Application_Proposal__c> oldProposalMap){
        Set<id> proposalId = New Set<Id>();
        List<Disbursement_Schedule__c> disbursementList = New List<Disbursement_Schedule__c>();
        Decimal perDayAmount;
        
        for(Application_Proposal__c proposalRec : newProposalMap.values()){
            system.debug('proposalRec--->'+proposalRec.RecordType_Name__c);
            system.debug('proposalRec.Proposal_Stages__c ::'+proposalRec.Proposal_Stages__c);
            system.debug('RecordType ::'+proposalRec.RecordType_Name__c);
            if(proposalRec.Proposal_Stages__c != null && proposalRec.Proposal_Stages__c != oldProposalMap.get(proposalRec.Id).Proposal_Stages__c && proposalRec.Proposal_Stages__c == 'Under Award'){
                if(proposalRec.RecordType_Name__c == 'SING'){
                    proposalId.add(proposalRec.Id);
                }
            }
        }
        system.debug('proposalId ::'+proposalId);
        List<Disbursement_Schedule__c> existingDisbursementRecords = New List<Disbursement_Schedule__c>();
        List<Application_Proposal__c> applicationRecord = [SELECT Id,Name,Tentative_Start_Date__c,Tentative_End_Date__c,RecordType.Name,Total_funding_requested_from_IGSTC__c FROM Application_Proposal__c WHERE Id In : proposalId];
        List<Expense_Head__c> expenseHeadList = [SELECT Id,Name,Proposals__c,Approved_Amount__c,Year_1_Approved_Amount__c,Year_2_Approved_Amount__c,Year_3_Approved_Amount__c FROM Expense_Head__c WHERE Proposals__c In : proposalId];
        system.debug('expenseHeadList ::'+expenseHeadList);
        Map<String,Decimal> mapOfyear1ApprovedAmount = new Map<String,Decimal>();
        Map<String,Decimal> mapOfyear2ApprovedAmount = new Map<String,Decimal>();
        Map<String,Decimal> mapOfyear3ApprovedAmount = new Map<String,Decimal>();
        Map<String,Integer> totalCountApprovedAmount = new Map<String,Integer>();
        Map<String,Integer> count1ApprovedAmount = new Map<String,Integer>();
        Map<String,Integer> count2ApprovedAmount = new Map<String,Integer>();
        Map<Id,Integer> ApprovedAmountMap = new Map<Id,Integer>();
        system.debug('applicationRecord ::'+applicationRecord);
        if(!expenseHeadList.isEmpty()){
            Integer TotalApprovedAmount = 0;
            for(Expense_Head__c eh : expenseHeadList){
                if(eh.Approved_Amount__c != ''){
                    TotalApprovedAmount = TotalApprovedAmount + Integer.valueOf(eh.Approved_Amount__c);
                    ApprovedAmountMap.put(eh.Proposals__c, TotalApprovedAmount);
                }
            }
            for(Application_Proposal__c app : applicationRecord){
                Contact con = [SELECT Id,Name,account.BillingCountry,Proposals__c,Proposals__r.Disbursement_Type_for_German_Awardee__c,Proposals__r.Name,Tentative_End_Date__c,Tentative_Start_Date__c,Proposals__r.RecordType_Name__c FROM Contact WHERE Proposals__c =: app.id AND Is_Primary__c = true];
                String invalidNumbers = '[^0-9]';
                //Integer TotalAmount = Integer.valueOf(app.Total_funding_requested_from_IGSTC__c.replaceAll(invalidNumbers,''));
                Integer TotalAmount = ApprovedAmountMap.get(app.id) ; 
                    Disbursement_Schedule__c disbursementRecord = New Disbursement_Schedule__c();
                    disbursementRecord.Proposals__c = app.Id;
                    disbursementRecord.Tranche__c = '1'; 
                    disbursementRecord.Disbursement_Name__c = 'DS-' + app.Name.replace('IGSTC-','') + '-' + disbursementRecord.Tranche__c + '-' + con.Name;
                    if(app.Tentative_Start_Date__c != null){
                        disbursementRecord.Start_Date__c = app.Tentative_Start_Date__c; 
                    }
                    system.debug('TotalAmount ----> '+TotalAmount);
                    disbursementRecord.Amount__c = TotalAmount*90/100;
                    system.debug('Amount 1 ----> '+disbursementRecord.Amount__c);
                    disbursementRecord.Release_Grant_Amount__c = disbursementRecord.Amount__c;
                	disbursementRecord.Contact__c = con.Id;
                    disbursementList.add(disbursementRecord);
                    
                    Disbursement_Schedule__c disbursementRecord2 = New Disbursement_Schedule__c();
                    disbursementRecord2.Proposals__c = app.Id;
                    disbursementRecord2.Tranche__c = '2';
                    disbursementRecord2.Disbursement_Name__c = 'DS-' + app.Name.replace('IGSTC-','') + '-' + disbursementRecord2.Tranche__c + '-' + con.Name;
                    if(app.Tentative_End_Date__c != null){
                        disbursementRecord2.Start_Date__c = app.Tentative_End_Date__c; 
                    }
                    disbursementRecord2.Amount__c = TotalAmount*10/100;
                    system.debug('Amount 2 ----> '+disbursementRecord.Amount__c);
                    disbursementRecord2.Release_Grant_Amount__c = disbursementRecord2.Amount__c;
                	disbursementRecord2.Contact__c = con.Id;
                    disbursementList.add(disbursementRecord2);
                }
                if(!disbursementList.isEmpty()){
                    insert disbursementList; 
                } 
           
        }
        
    }
    
    public void validationForunderreviewstage(Map<Id, Application_Proposal__c> newProposalMap,Map<Id,Application_Proposal__c> oldProposalMap){
        Set<id> proposalId = New Set<Id>();
        
        for(Application_Proposal__c proposalRec : newProposalMap.values()){
            system.debug('proposalRec--->'+proposalRec.RecordType_Name__c);
            system.debug('proposalRec.Proposal_Stages__c ::'+proposalRec.Proposal_Stages__c);
            system.debug('RecordType ::'+proposalRec.RecordType_Name__c);
            if(proposalRec.Proposal_Stages__c != null && proposalRec.Proposal_Stages__c != oldProposalMap.get(proposalRec.Id).Proposal_Stages__c && proposalRec.Proposal_Stages__c == 'Under Review'){
                    proposalId.add(proposalRec.Id);
            }
        }
        if(!proposalId.isEmpty()){
        Map<Id, Application_Proposal__c> accts = new Map<Id, Application_Proposal__c>([Select Id, (Select Id from Reviewer_Mapping__r) from Application_Proposal__c where id in :proposalId]);
        for(Application_Proposal__c acc : newProposalMap.values())
        {
            system.debug('1===>');
            if(accts.get(acc.id).Reviewer_Mapping__r.size() > 0)
            {
                system.debug('2===>'+accts.get(acc.id).Reviewer_Mapping__r.size());
                
            }
            else{
                system.debug('3===>');
                acc.adderror('Please assign reviewers before moving to under review stage.');
            }
        } 
        }
        
    }
    
    public void validationOnRecommendationNote(Map<Id, Application_Proposal__c> newProposalMap,Map<Id,Application_Proposal__c> oldProposalMap){
        Set<id> proposalId = New Set<Id>();
        
        for(Application_Proposal__c proposalRec : newProposalMap.values()){
            system.debug('proposalRec--->'+proposalRec.RecordType_Name__c);
            system.debug('proposalRec.Proposal_Stages__c ::'+proposalRec.Proposal_Stages__c);
            system.debug('RecordType ::'+proposalRec.RecordType_Name__c);
            if(proposalRec.Final_Status_by_Director__c != null && proposalRec.Final_Status_by_Director__c != oldProposalMap.get(proposalRec.Id).Final_Status_by_Director__c && proposalRec.Final_Status_by_Director__c == 'Approved'){
                    proposalId.add(proposalRec.Id);
            }
        }
        if(!proposalId.isEmpty()){
            //List<ContentDocument> recommendationNoteList = new List<ContentDocument>([SELECT Id, Title,parentId FROM ContentDocument where title = 'Recommendation Note']);
            List<ContentDocumentLink> cdlList = new List<ContentDocumentLink>([SELECT Id, LinkedEntityId, ContentDocumentId,ContentDocument.Title FROM ContentDocumentLink where ContentDocument.Title = 'Recommendation Note' and LinkedEntityId IN : proposalId ]);
            Map<Id,ContentDocumentLink> proposalMap = new Map<Id,ContentDocumentLink>();
            for(ContentDocumentLink cd : cdlList){
                proposalMap.put(cd.LinkedEntityId,cd);
                system.debug('proposalMap=>'+proposalMap);
            }
            
            for(Application_Proposal__c acc : newProposalMap.values())
            {
                if(!proposalMap.containsKey(acc.id)){
                    acc.adderror('Please upload Recommendation Note.');
                }
            }
            
        }
        
    }
    
    public void validationOnOfficeNote(Map<Id, Application_Proposal__c> newProposalMap,Map<Id,Application_Proposal__c> oldProposalMap){
        Set<id> proposalId = New Set<Id>();
        
        for(Application_Proposal__c proposalRec : newProposalMap.values()){
            system.debug('proposalRec--->'+proposalRec.RecordType_Name__c);
            system.debug('proposalRec.Proposal_Stages__c ::'+proposalRec.Proposal_Stages__c);
            system.debug('RecordType ::'+proposalRec.RecordType_Name__c);
            if(proposalRec.Office_Note_Uploaded__c != null && proposalRec.Office_Note_Uploaded__c != oldProposalMap.get(proposalRec.Id).Office_Note_Uploaded__c && proposalRec.Office_Note_Uploaded__c == true){
                    proposalId.add(proposalRec.Id);
            }
        }
        if(!proposalId.isEmpty()){
            //List<ContentDocument> recommendationNoteList = new List<ContentDocument>([SELECT Id, Title,parentId FROM ContentDocument where title = 'Recommendation Note']);
            List<ContentDocumentLink> cdlList = new List<ContentDocumentLink>([SELECT Id, LinkedEntityId, ContentDocumentId,ContentDocument.Title FROM ContentDocumentLink where ContentDocument.Title = 'Office Note' and LinkedEntityId IN : proposalId ]);
            Map<Id,ContentDocumentLink> proposalMap = new Map<Id,ContentDocumentLink>();
            for(ContentDocumentLink cd : cdlList){
                proposalMap.put(cd.LinkedEntityId,cd);
                system.debug('proposalMap=>'+proposalMap);
            }
            
            for(Application_Proposal__c acc : newProposalMap.values())
            {
                if(!proposalMap.containsKey(acc.id)){
                    acc.adderror('Please upload Office Note 1.');
                }
                
            }
            
        }
        
    }
    
    
    public void validationOnSCReviewStageChange(List<Application_Proposal__c> appProposalList, Map<Id, Application_Proposal__c> oldProposalsMap){
        try{
            List<Application_Proposal__c> proposalsToUpdate = new List<Application_Proposal__c>();
            for (Application_Proposal__c prop : appProposalList){
                Application_Proposal__c oldProposal = oldProposalsMap.get(prop.Id);
                if (prop.SC_Review_Stages__c == 'SC Review Rejected' && oldProposal.SC_Review_Stages__c == 'Sc Review Approved') {
                    prop.addError('SC Review Stage cannot be chang from Approved to Rejected.');
                }
                else if (prop.SC_Review_Stages__c == 'SC Review Waitlisted' && oldProposal.SC_Review_Stages__c == 'Sc Review Approved') {
                    prop.addError('SC Review Stage cannot be change from Approved to waitlist.');
                }
                
                
                else if (prop.SC_Review_Stages__c == 'SC Review Waitlisted' && oldProposal.SC_Review_Stages__c == 'SC Review Decline') {
                    prop.addError('SC Review Stage cannot be change from Decline to waitlist.');
                }
                else if (prop.SC_Review_Stages__c == 'Sc Review Approved' && oldProposal.SC_Review_Stages__c == 'SC Review Decline') {
                    prop.addError('SC Review Stage cannot be chang from Decline to Approved.');
                }
                else if (prop.SC_Review_Stages__c == 'SC Review Rejected' && oldProposal.SC_Review_Stages__c == 'SC Review Decline') {
                    prop.addError('SC Review Stage cannot be chang from Decline to Rejected.');
                }
                
                
                else if (prop.SC_Review_Stages__c == 'SC Review Waitlisted' && oldProposal.SC_Review_Stages__c == 'SC Review Rejected') {
                    prop.addError('SC Review Stage cannot be change from Rejected to waitlist.');
                }
                else if (prop.SC_Review_Stages__c == 'Sc Review Approved' && oldProposal.SC_Review_Stages__c == 'SC Review Rejected') {
                    prop.addError('SC Review Stage cannot be chang from Rejected to Approved.');
                }
                else if (prop.SC_Review_Stages__c == 'SC Review Decline' && oldProposal.SC_Review_Stages__c == 'SC Review Rejected') {
                    prop.addError('SC Review Stage cannot be chang from Rejected to Decline.');
                }
            }
        }catch(Exception e){
            
        }
    }
}