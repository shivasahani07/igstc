public class ApplicationProposalTriggerHandler {
    
    public static void createYearlyExpenseAndRelatedRecords(List<Applicant_Proposal_Association__c> apaList) {
        try {
            // Collect APA IDs and query related fields
            Set<Id> apaIds = new Set<Id>();
            for(Applicant_Proposal_Association__c apa : apaList) {
                apaIds.add(apa.Id);
            }
            
            // Query APA records with Proposal details including Duration_In_Months_Max_36__c
            List<Applicant_Proposal_Association__c> apaRecords = [
                SELECT Id, Proposals__c, Proposals__r.Duration_In_Months_Max_36__c,
                       Proposals__r.RecordType.Name, Contact__r.AccountId, 
                       Contact__r.Account.BillingCountry, Contact__r.Account.Academia__c, 
                       Contact__r.Account.Industry__c
                FROM Applicant_Proposal_Association__c
                WHERE Id IN :apaIds
            ];
            
            if(apaRecords.isEmpty()) {
                return;
            }
            
            // Check for existing Yearly_Expense__c records to avoid duplicates
            List<Yearly_Expense__c> existingYE = [
                SELECT Id, Year__c, Applicant_Proposal_Association__c
                FROM Yearly_Expense__c
                WHERE Applicant_Proposal_Association__c IN :apaIds
            ];
            
            Map<Id, Set<String>> existingYearlyExpenses = new Map<Id, Set<String>>();
            for(Yearly_Expense__c ye : existingYE) {
                if(!existingYearlyExpenses.containsKey(ye.Applicant_Proposal_Association__c)) {
                    existingYearlyExpenses.put(ye.Applicant_Proposal_Association__c, new Set<String>());
                }
                if(ye.Year__c != null) {
                    existingYearlyExpenses.get(ye.Applicant_Proposal_Association__c).add(ye.Year__c);
                }
            }
            
            // Query Expense Category Master and Expense Detail Master
            List<Expense_Category_Master__c> ecms = [
                SELECT Id, Name, Campaign__c, Accounts_Country__c, Index__c, Account_Type__c  
                FROM Expense_Category_Master__c
            ];
            
            List<Expense_Detail_Master__c> edms = [
                SELECT Id, Name, Campaign__c, Accounts_Country__c, Expense_Category_Master__c, 
                       Expense_Category_Master__r.Name, Expense_Detail_Description__c, 
                       Index__c, Account_Type__c 
                FROM Expense_Detail_Master__c
            ];
            
            // Lists to hold records to insert
            List<Yearly_Expense__c> yeListToInsert = new List<Yearly_Expense__c>();
            List<Expense_Head__c> ehListToInsert = new List<Expense_Head__c>();
            List<Expense_Line_Item__c> eliListToInsert = new List<Expense_Line_Item__c>();
            
            // Map to store APA Id to its Yearly_Expense__c records
            Map<Id, List<Yearly_Expense__c>> apaIdXYearlyExpenses = new Map<Id, List<Yearly_Expense__c>>();
            
            // Create Yearly_Expense__c records based on Duration in Months
            for(Applicant_Proposal_Association__c apa : apaRecords) {
                // Calculate number of years based on Duration_In_Months_Max_36__c
                // 24 months = 2 years, 36 months = 3 years
                Integer numberOfYears = 3; // Default to 3 years
                if(apa.Proposals__r.Duration_In_Months_Max_36__c != null) {
                    Decimal durationMonths = apa.Proposals__r.Duration_In_Months_Max_36__c;
                    numberOfYears = (Integer)Math.ceil(durationMonths / 12);
                    // Ensure minimum 1 year and maximum 3 years
                    if(numberOfYears < 1) numberOfYears = 1;
                    if(numberOfYears > 3) numberOfYears = 3;
                }
                
                // Check existing Yearly_Expense__c records before creating
                Set<String> existingYEYears = existingYearlyExpenses.get(apa.Id);
                if(existingYEYears == null) {
                    existingYEYears = new Set<String>();
                }
                
                // Create Yearly_Expense__c records for each year
                for(Integer i = 1; i <= numberOfYears; i++) {
                    String yearStr = String.valueOf(i);
                    // Only create if it doesn't already exist
                    if(!existingYEYears.contains(yearStr)) {
                        Yearly_Expense__c ye = new Yearly_Expense__c();
                        ye.Year__c = yearStr;
                        ye.Applicant_Proposal_Association__c = apa.Id;
                        ye.Account__c = apa.Contact__r.AccountId;
                        ye.Proposals__c = apa.Proposals__c;
                        yeListToInsert.add(ye);
                    }
                }
            }
            
            // Insert Yearly_Expense__c records
            if(!yeListToInsert.isEmpty()) {
                insert yeListToInsert;
                
                // Build map of APA Id to Yearly_Expense__c records
                for(Yearly_Expense__c ye : yeListToInsert) {
                    if(!apaIdXYearlyExpenses.containsKey(ye.Applicant_Proposal_Association__c)) {
                        apaIdXYearlyExpenses.put(ye.Applicant_Proposal_Association__c, new List<Yearly_Expense__c>());
                    }
                    apaIdXYearlyExpenses.get(ye.Applicant_Proposal_Association__c).add(ye);
                }
            }
            
            // Check for existing Expense_Head__c records
            List<Expense_Head__c> previousExpenseHeads = [
                SELECT Id, Name, Yearly_Expense__r.Applicant_Proposal_Association__c 
                FROM Expense_Head__c 
                WHERE Yearly_Expense__r.Applicant_Proposal_Association__c IN :apaIds
            ];
            
            Map<Id, List<Expense_Head__c>> apaIdXpreviousExpenseHeads = new Map<Id, List<Expense_Head__c>>();
            for(Expense_Head__c eh : previousExpenseHeads) {
                Id apaId = eh.Yearly_Expense__r.Applicant_Proposal_Association__c;
                if(!apaIdXpreviousExpenseHeads.containsKey(apaId)) {
                    apaIdXpreviousExpenseHeads.put(apaId, new List<Expense_Head__c>());
                }
                apaIdXpreviousExpenseHeads.get(apaId).add(eh);
            }
            
            // Create Expense_Head__c records (one per Yearly_Expense__c for each year)
            for(Applicant_Proposal_Association__c apa : apaRecords) {
                Boolean alreadyHasExpenseHeads = apaIdXpreviousExpenseHeads.containsKey(apa.Id)
                                                  && !apaIdXpreviousExpenseHeads.get(apa.Id).isEmpty();
                
                if(!alreadyHasExpenseHeads && apaIdXYearlyExpenses.containsKey(apa.Id)) {
                    // Get all Yearly_Expense__c records for this APA
                    List<Yearly_Expense__c> yearlyExpenses = apaIdXYearlyExpenses.get(apa.Id);
                    
                    // Create Expense Head for each Yearly Expense
                    for(Yearly_Expense__c ye : yearlyExpenses) {
                        for(Expense_Category_Master__c ecm : ecms) {
                            String dynamicFieldName = ecm.Account_Type__c != null ? ecm.Account_Type__c + '__c' : null;
                            
                            if((ecm.Accounts_Country__c == null || ecm.Accounts_Country__c == apa.Contact__r.Account.BillingCountry) &&
                               (ecm.Campaign__c == null || ecm.Campaign__c == apa.Proposals__r.RecordType.Name) &&
                               (ecm.Account_Type__c == null || apa.Contact__r.Account.get(dynamicFieldName) == true)) {
                                    
                                Expense_Head__c eh = new Expense_Head__c();
                                eh.Index__c = ecm.Index__c != null ? String.valueOf(ecm.Index__c) : '';
                                eh.Yearly_Expense__c = ye.Id;
                                eh.Account__c = apa.Contact__r.AccountId;
                                eh.Proposals__c = apa.Proposals__c;
                                eh.Name = ecm.Name;
                                eh.Currency_Type__c = apa.Contact__r.Account.BillingCountry == 'India' ? 'INR' : 'EURO';
                                ehListToInsert.add(eh);
                            }
                        }
                    }
                }
            }
            
            // Insert Expense_Head__c records
            Set<Id> insertedEHIds = new Set<Id>();
            if(!ehListToInsert.isEmpty()) {
                insert ehListToInsert;
                for(Expense_Head__c eh : ehListToInsert) {
                    insertedEHIds.add(eh.Id);
                }
            }
            
            // Create Expense_Line_Item__c records
            if(!insertedEHIds.isEmpty()) {
                for(Expense_Head__c eh : [
                    SELECT Id, Name, Index__c, Account__c, Proposals__c,
                           Yearly_Expense__r.Applicant_Proposal_Association__c,
                           Yearly_Expense__r.Applicant_Proposal_Association__r.Proposals__r.RecordType.Name,
                           Yearly_Expense__r.Applicant_Proposal_Association__r.Contact__r.Account.BillingCountry,
                           Yearly_Expense__r.Applicant_Proposal_Association__r.Contact__r.Account.Academia__c,
                           Yearly_Expense__r.Applicant_Proposal_Association__r.Contact__r.Account.Industry__c
                    FROM Expense_Head__c
                    WHERE Id IN :insertedEHIds
                ]) {
                    for(Expense_Detail_Master__c edm : edms) {
                        String dynamicFieldName = edm.Account_Type__c != null ? edm.Account_Type__c + '__c' : null;
                        String billingCountry = eh.Yearly_Expense__r.Applicant_Proposal_Association__r.Contact__r.Account.BillingCountry;
                        String recordTypeName = eh.Yearly_Expense__r.Applicant_Proposal_Association__r.Proposals__r.RecordType.Name;
                        
                        if((edm.Accounts_Country__c == null || billingCountry == edm.Accounts_Country__c) &&
                           edm.Expense_Category_Master__r.Name == eh.Name &&
                           (edm.Campaign__c == null || edm.Campaign__c == recordTypeName) &&
                           (edm.Account_Type__c == null || eh.Yearly_Expense__r.Applicant_Proposal_Association__r.Contact__r.Account.get(dynamicFieldName) == true)) {
                            
                            Expense_Line_Item__c eli = new Expense_Line_Item__c();
                            eli.Index__c = edm.Index__c;
                            eli.Expense_Head__c = eh.Id;
                            eli.Description__c = edm.Expense_Detail_Description__c;
                            eli.Expense_Type__c = eh.Name;
                            eli.Account__c = eh.Account__c;
                            eli.Currency_Type__c = billingCountry == 'India' ? 'INR' : 'EURO';
                            eliListToInsert.add(eli);
                        }
                    }
                }
            }
            
            // Insert Expense_Line_Item__c records
            if(!eliListToInsert.isEmpty()) {
                insert eliListToInsert;
            }
            
        } catch(Exception e) {
            System.debug('Exception in createYearlyExpenseAndRelatedRecords: ' + e.getMessage() + 
                        ' at Line: ' + e.getLineNumber() + 
                        ' Stack Trace: ' + e.getStackTraceString());
        }
    }
}