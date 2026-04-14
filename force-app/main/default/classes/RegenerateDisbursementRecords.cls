public class RegenerateDisbursementRecords {
    
    @AuraEnabled
    public static void getDisbursementRecords(string proposalId){
        try{
            if(!String.isBlank(proposalId)){
                Id IFRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Industrial Fellowship').getRecordTypeId();
                Id PECFARRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('PECFAR').getRecordTypeId();
                Id WISERRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('WISER').getRecordTypeId();
                Id SINGRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('SING').getRecordTypeId();
                Id WorkshopRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Workshop').getRecordTypeId();
                Id ConnectPlusRecordTypeId = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName().get('Connect Plus').getRecordTypeId();
                
                Application_Proposal__c apRecordtypeId = [SELECT Id, RecordTypeId FROM Application_Proposal__c where id =: proposalId];
                if(apRecordtypeId.RecordTypeId == IFRecordTypeId){
                List<Disbursement_Schedule__c> dsList = [SELECT Id,Name,Proposals__c From Disbursement_Schedule__c WHERE Proposals__c =: proposalId];
                if(dsList.size() > 0){
                    system.debug('dsList -----> '+dsList);
                    delete dsList;
                }
                    List<Disbursement_Schedule__c> disbursementList = New List<Disbursement_Schedule__c>();
                    Decimal perDayAmount;
                    Integer Difference;
                    List<Contact> contactList = [SELECT Id,Name,Proposals__c,Industrial_Fellowship_Type__c,Proposals__r.Name,Proposals__r.Tentative_End_Date__c,Proposals__r.Tentative_Start_Date__c,Proposals__r.RecordType_Name__c FROM Contact WHERE Proposals__c =: proposalId Limit 1];
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
                                        //added on 29/12
                                        //disbursementRecord.Start_Date__c = Date.newInstance(contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+1).year(),contactList[0].Proposals__r.Tentative_Start_Date__c.addMonths(i+1).month(),1); 
                                        
                                        if(disbursementRecord.Tranche__c == '3' || disbursementRecord.Tranche__c == '6' || disbursementRecord.Tranche__c == '9' ){
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
                                
                                /*if(disbursementRecord.Tranche__c != '1'){
                                    disbursementRecord.Attendance_Report_Remainder__c = true;
                                }
                                if(disbursementRecord.Tranche__c == '2' || disbursementRecord.Tranche__c == '5' || disbursementRecord.Tranche__c == '6'){
                                    disbursementRecord.Send_SE_UC_reminder__c = true;
                                }
                                if(disbursementRecord.Tranche__c == '3' || disbursementRecord.Tranche__c == '5' || disbursementRecord.Tranche__c == '6' ){
                                    disbursementRecord.Progress_Report_Remainder__c = true;
                                }
                                if(disbursementRecord.Tranche__c == '2' || disbursementRecord.Tranche__c == '3' || disbursementRecord.Tranche__c == '5' || disbursementRecord.Tranche__c == '6'){
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
                            /*
                            for(integer i=1 ; i<=disbursementList.size() ; i+=3){
                                
                                //if(disbursementList[i].Contact__r.Industrial_Fellowship_Type__c.contains('PIEF')){
                                system.debug('testing=>'+disbursementList[i]);
                                system.debug('testing=>'+disbursementList[i].Send_SE_UC_reminder__c);
                                disbursementList[i].Send_SE_UC_reminder__c = true;
                                disbursementList[i].Send_Closure_remainder__c	 = true;
                                // }
                            }*/
                            
                        }
                        
                        if(!disbursementList.isEmpty()){
                            insert disbursementList;
                        }
                    }
                
            }
                if(apRecordtypeId.RecordTypeId == PECFARRecordTypeId){
                List<Disbursement_Schedule__c> dsList = [SELECT Id,Name,Proposals__c From Disbursement_Schedule__c WHERE Proposals__c =: proposalId];
                if(dsList.size() > 0){
                    system.debug('dsList -----> '+dsList);
                    delete dsList;
                }
                    List<Disbursement_Schedule__c> disbursementList = New List<Disbursement_Schedule__c>();
                    List<Contact> contactList = [SELECT Id,Name,account.BillingCountry,Proposals__c,Proposals__r.Disbursement_Type_for_German_Awardee__c,Proposals__r.Name,Tentative_End_Date__c,Tentative_Start_Date__c,Proposals__r.RecordType_Name__c FROM Contact WHERE Proposals__c =: proposalId];
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
                
               
                
            }
            if(!disbursementList.isEmpty()){
                insert disbursementList; 
            } 
        }
        
                
            }
                if(apRecordtypeId.RecordTypeId == WorkshopRecordTypeId){
                List<Disbursement_Schedule__c> dsList = [SELECT Id,Name,Proposals__c From Disbursement_Schedule__c WHERE Proposals__c =: proposalId];
                if(dsList.size() > 0){
                    system.debug('dsList -----> '+dsList);
                    delete dsList;
                }
                    List<Disbursement_Schedule__c> disbursementList = New List<Disbursement_Schedule__c>();
                    Decimal perDayAmount;
                    Long Difference;
                    List<Application_Proposal__c> proposalList = [select id,Grantee_Recipient__c,Name,Country_of_Venue__c,Proposed_Date__c,Workshop_Finish_Date__c from Application_Proposal__c where id =: proposalId];
        List<Expense_Head__c> expenseHeadList = [SELECT Id,Name,Proposals__c,Approved_Amount__c,Year_1_Approved_Amount__c,Year_2_Approved_Amount__c,Year_3_Approved_Amount__c FROM Expense_Head__c WHERE Proposals__c =: proposalId];
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
                
            }
        }
        
        
        
        
                }
                if(apRecordtypeId.RecordTypeId == SINGRecordTypeId){
                    List<Disbursement_Schedule__c> dsList = [SELECT Id,Name,Proposals__c From Disbursement_Schedule__c WHERE Proposals__c =: proposalId];
                    if(dsList.size() > 0){
                        system.debug('dsList -----> '+dsList);
                        delete dsList;
                    }
                    List<Disbursement_Schedule__c> existingDisbursementRecords = New List<Disbursement_Schedule__c>();
                    List<Application_Proposal__c> applicationRecord = [SELECT Id,Name,Tentative_Start_Date__c,Tentative_End_Date__c,RecordType.Name,Total_funding_requested_from_IGSTC__c FROM Application_Proposal__c WHERE Id =: proposalId];
                    List<Expense_Head__c> expenseHeadList = [SELECT Id,Name,Proposals__c,Approved_Amount__c,Year_1_Approved_Amount__c,Year_2_Approved_Amount__c,Year_3_Approved_Amount__c FROM Expense_Head__c WHERE Proposals__c  =: proposalId];
                    system.debug('expenseHeadList ::'+expenseHeadList);
                    List<Disbursement_Schedule__c> disbursementList = New List<Disbursement_Schedule__c>();
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
            } 
        }catch(Exception e){
            system.debug('=>>>' + e.getMessage());
            system.debug('=>>>' + e.getLineNumber());
        }
    }
    
    @AuraEnabled
    public static void generateApplicationPDF(string proposalId){
        Application_Proposal__c proposalRecord = [SELECT Id,Proposal_Stages__c,recordtype.developername From Application_Proposal__c WHERE id =: proposalId ];
        if(proposalRecord.recordtype.developername == 'Industrial_Fellowships'){
        DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proposalId, 'IF Conga Url');
        } else if(proposalRecord.recordtype.developername == 'PECFAR'){
        DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proposalId, 'Pecfar Conga Url');
        } else if(proposalRecord.recordtype.developername == 'SING'){
        DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proposalId, 'Sing Conga url');
        } else if(proposalRecord.recordtype.developername == 'WISER'){
        DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proposalId, 'Wiser Conga Url');
        } else if(proposalRecord.recordtype.developername == 'Two_Plus_Two'){
        DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proposalId, 'TWO PLUS TWO APP PORTAL');
        } else if(proposalRecord.recordtype.developername == 'Workshop'){
        DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proposalId, 'WORKSHOP APPLICATION PORTAL');
        }
        system.debug('qqqqqqqqqqqqproposalId'+proposalId);
    }
    
    @AuraEnabled
    public static void generateyear2order(string proposalId){
        Application_Proposal__c proposalRecord = [SELECT Id,Proposal_Stages__c,recordtype.developername From Application_Proposal__c WHERE id =: proposalId ];
        if(proposalRecord.recordtype.developername == 'Two_Plus_Two'){
        DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proposalId, 'Two Plus Two Year 2 Order');
        } 
        system.debug('qqqqqqqqqqqqproposalId'+proposalId);
    }
    
    @AuraEnabled
    public static void generateyear3order(string proposalId){
        Application_Proposal__c proposalRecord = [SELECT Id,Proposal_Stages__c,recordtype.developername From Application_Proposal__c WHERE id =: proposalId ];
        if(proposalRecord.recordtype.developername == 'Two_Plus_Two'){
        DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(proposalId, 'Two Plus Two Year 3 Order');
        } 
        system.debug('qqqqqqqqqqqqproposalId'+proposalId);
    }
    
    @AuraEnabled
    public static void forecloseApplication(string proposalId){
        try{
            if(!String.isBlank(proposalId)){
                List<Disbursement_Schedule__c> dsListToUpdate = new List<Disbursement_Schedule__c>();
                List<Application_Proposal__c> proposalListToUpdate = new List<Application_Proposal__c>();
                List<Disbursement_Schedule__c> dsList = [SELECT Id,Name,Proposals__c,status__c From Disbursement_Schedule__c WHERE Proposals__c =: proposalId AND status__c != 'Released'];
                Application_Proposal__c proposalRecord = [SELECT Id,Proposal_Stages__c From Application_Proposal__c WHERE id =: proposalId ];
                if(dsList.size() > 0){
                    for(Disbursement_Schedule__c ds : dsList){
                        ds.status__c = 'Rejected';
                        dsListToUpdate.add(ds);
                        
                    }
                    proposalRecord.Proposal_Stages__c = 'Closure';
                        proposalListToUpdate.add(proposalRecord);
                }
                if(dsListToUpdate.size() > 0){
                    update dsListToUpdate;
                }
                if(proposalListToUpdate.size() > 0){
                    update proposalListToUpdate;
                }
            }
        }catch(Exception e){
            
        }
        
    }
}