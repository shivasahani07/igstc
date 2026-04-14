// THIS CLASS HAS BEEN CREATED BY SHIVA 
// THIS CLASS FOR SUM ALL LINE ITEM  VALUE ON ITS HEAD 
// THIS IS ONLU FOR SING
//  DATE 2023-05-03 YY-MM-DD

public class ExpenseLineItemTriggerHelper {

    Public static void updateTotalValueOnItsHead(List<Expense_Line_Item__c> newELIList){
        system.debug('newELIList::'+newELIList);
        list<string> expenseHeadIDList =new list<string>();
        for(Expense_Line_Item__c ELI:newELIList){
            IF(ELI.Expense_Head__c !=NULL){
                expenseHeadIDList.add(ELI.Expense_Head__c);
            }
        }
        
        Map<Id, Decimal> lineItemvalueIWthHeadID = new Map<Id, Decimal>();
        map<id,Expense_Head__c> expenHeadByID = new  map<id,Expense_Head__c>([select id,ELI__c,Proposals__c,Proposals__r.recordtype.name,(select id,Expense_Head__c,Year1_Expense__c from Expense_Line_Items__r) from Expense_Head__c where id In: expenseHeadIDList AND Proposals__r.recordtype.name='SING']);
        for(Expense_Head__c exh : expenHeadByID.values()){
            Decimal totalofLineItem = 0;
           // Decimal totalPercentage = 0;
            list<Expense_Line_Item__c> linitemList=exh.Expense_Line_Items__r;
            for( Expense_Line_Item__c litm : linitemList){
                if(litm.Year1_Expense__c != null){
                    totalofLineItem +=litm.Year1_Expense__c;
                }
                
            }
            
            lineItemvalueIWthHeadID.put(exh.id,totalofLineItem);
        }
        
         List<Expense_Head__c> headTobeUpdated = new List<Expense_Head__c>();
        
        for (Id headID : lineItemvalueIWthHeadID.keySet()) {
            Expense_Head__c EXPH = new Expense_Head__c(Id=headID, ELI__c=lineItemvalueIWthHeadID.get(headID));
            headTobeUpdated.add(EXPH);
        }
        if(!headTobeUpdated.isEmpty()){
             update headTobeUpdated;
        }
    }

    public static void createExpenseHeadReport(List<Expense_Line_Item__c> newELIList){

        //get AccountID & Expense Head Name from line item
        /**
         * 
         */
        //get all ELIs with same Name & same Head Name
        //Iterate through ELIs to store the 1,2,3 years total
        //Instantiate a new Head Report Object and insert it.
        List<String> accountIdList =new List<String>();
        List<String> headNameList =new List<String>();
        List<String> eliDescriptionList =new List<String>();
        Map<String,List<String>> eliAccountIdVsHeadMap = new Map<String,List<String>>();
        Map<String,List<String>> eliHeadVsDescriptionMap = new Map<String,List<String>>();
        Map<String,List<Id>> eliDescripVsListIdMap = new Map<String,List<Id>>();
        
        for(Expense_Line_Item__c ELI:newELIList){
            if(ELI.Expense_Head__c !=NULL && String.isNotBlank(ELI.Description__c) && String.isNotBlank(ELI.Account__c)){
                accountIdList.add(ELI.Account__c);
                headNameList.add(ELI.Expense_Name__c);
                eliDescriptionList.add(ELI.Description__c);
            }
        }
        System.debug('accountIdList => '+accountIdList+' headNameList => '+headNameList+' eliDescriptionList => '+eliDescriptionList);
        Map<Id,Expense_Line_Item__c> eliMap =  new Map<Id,Expense_Line_Item__c>([SELECT ID,Account__r.Proposals__c, Expense_Head__r.Proposals__c,Account__c,Expense_Name__c,Expense_Head__r.Year_Detail__c, Description__c,
                                                                                    Expense_Description__c,Year1_Expense__c,Year2_Expense__c,Year3_Expense__c
                                                FROM Expense_Line_Item__c 
                                                WHERE Expense_Description__c IN:eliDescriptionList
                                                AND Account__c IN:accountIdList
                                                AND Expense_Name__c IN: headNameList ]);
        if(!eliMap.isEmpty()){
            System.debug('eliMap => '+eliMap);
            
            for(Expense_Line_Item__c ELI : eliMap.values()){
                if(!eliAccountIdVsHeadMap.containsKey(ELI.Account__c)){
                    eliAccountIdVsHeadMap.put(ELI.Account__c,new List<String>());
                }
                eliAccountIdVsHeadMap.get(ELI.Account__c).add(ELI.Expense_Name__c);

                if(!eliHeadVsDescriptionMap.containsKey(ELI.Expense_Name__c)){
                    eliHeadVsDescriptionMap.put(ELI.Expense_Name__c,new List<String>());
                }
                eliHeadVsDescriptionMap.get(ELI.Expense_Name__c).add(ELI.Expense_Description__c);

                if(!eliDescripVsListIdMap.containsKey(ELI.Expense_Description__c)){
                    eliDescripVsListIdMap.put(ELI.Expense_Description__c,new List<Id>());
                }
                eliDescripVsListIdMap.get(ELI.Expense_Description__c).add(ELI.Id);
            }
            System.debug('Map 1 => '+eliAccountIdVsHeadMap);
            System.debug('Map 2 => '+eliHeadVsDescriptionMap);
            System.debug('Map 3 => '+eliDescripVsListIdMap);
        }
        List<Expense_Head_Report__c> expenseHeadsToInsert = new List<Expense_Head_Report__c>();
        Map<String,Expense_Head_Report__c> uniqueIdentifierMap = new Map<String,Expense_Head_Report__c>();
        for (Expense_Line_Item__c varELI : newELIList) {
            String key = varELI.Description__c+varELI.Account__c+varELI.Expense_Name__c;
            System.debug('ELI Trigger Rec => '+varELI);
         if(eliDescripVsListIdMap.containsKey(varELI.Description__c) && !uniqueIdentifierMap.containsKey(key)){
            decimal year1Total = 0;
            decimal year2Total = 0;
            decimal year3Total = 0;
            
            for(Id eliID : eliDescripVsListIdMap.get(varELI.Description__c)){
                Expense_Line_Item__c lineItem = eliMap.get(eliID);
                if(lineItem.Account__c == varELI.Account__c && lineItem.Expense_Name__c == varELI.Expense_Name__c){
                    System.debug('ELI from DescriptionMap =>'+lineItem);
                    switch on lineItem.Expense_Head__r.Year_Detail__c {
                        when '1' {
                            year1Total += lineItem.Year1_Expense__c;
                        }
                        when '2' {
                            year2Total += lineItem.Year2_Expense__c;
                        }
                        when '3' {
                            year3Total += lineItem.Year3_Expense__c;
                        }
                    }
                    if(!uniqueIdentifierMap.containsKey(key)){
                        uniqueIdentifierMap.put(key,new Expense_Head_Report__c());
                    }
                }
            }
            System.debug('Unique Identifier Record => '+uniqueIdentifierMap);
            if(uniqueIdentifierMap.containsKey(key)){
                Expense_Head_Report__c expReportObj = uniqueIdentifierMap.get(key);
                expReportObj.Year_1_ELI__c = year1Total;
                expReportObj.Year_2_ELI__c = year2Total;
                expReportObj.Year_3_ELI__c = year3Total;
                expReportObj.Account__c    = varELI.Account__c;
                expReportObj.ELI_Name__c   = varELI.Description__c;
                expReportObj.Expense_Head_Name__c = varELI.Expense_Name__c;
                expReportObj.Proposal__c = varELI.Account__r.Proposals__c;
                system.debug('test==>'+varELI.Expense_Head__r.Yearly_Expense__r.Expense_Master__r.Proposals__c);
                uniqueIdentifierMap.put(key,expReportObj);
            }
         }
        }

        if(!uniqueIdentifierMap.values().isEmpty()){
            Map<String,Id> keyVsIdMap = new Map<String,Id>();
            System.debug('Unique Identifier Map => '+uniqueIdentifierMap);
            List<Expense_Head_Report__c> expHeadRepList = [SELECT ID,Key__c FROM Expense_Head_Report__c WHERE Key__c IN:uniqueIdentifierMap.keySet()];
            System.debug('expHeadRepList => '+expHeadRepList);
            // for(Expense_Head_Report__c expHeadRep : [SELECT ID,Key__c FROM Expense_Head_Report__c WHERE Key__c IN:uniqueIdentifierMap.keySet()]){
                for(Expense_Head_Report__c expHeadRep : expHeadRepList){
                if(!keyVsIdMap.containsKey(expHeadRep.Key__c)){
                    keyVsIdMap.put(expHeadRep.Key__c, expHeadRep.Id);
                }
            }
            for(String key : uniqueIdentifierMap.keySet()){
                if(keyVsIdMap.containsKey(key)){
                    Expense_Head_Report__c tempRec = uniqueIdentifierMap.get(key);
                    tempRec.Id = keyVsIdMap.get(key);
                    uniqueIdentifierMap.put(key,tempRec);
                }
            }
            System.debug('Final Map => '+uniqueIdentifierMap);
            upsert uniqueIdentifierMap.values();
        }
    }
}

// List<Expense_Line_Item__c> newELIList = [SELECT ID,Account__c,Expense_Name__c,Description__c,Expense_Head__c  
//                                         FROM Expense_Line_Item__c WHERE Account__c ='0011y00000itIRS' ];
// ExpenseLineItemTriggerHelper.createExpenseHeadReport(newELIList);