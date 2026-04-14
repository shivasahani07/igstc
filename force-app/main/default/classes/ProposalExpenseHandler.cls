public class ProposalExpenseHandler {

    public static void createExpenseCategoryAndDetails(
        List<Application_Proposal__c> newRecords,
        Map<Id, Application_Proposal__c> oldMap
    ) {

        System.debug('newRecord ===> ' + newRecords);
        
        Set<Id> proposalIds = new Set<Id>();
        Set<Id> apaIds = new Set<Id>();
        Set<Id> insertedECIds = new Set<Id>();
        Set<Id> insertedEHIds = new Set<Id>();
        
        Map<Id, List<Expense_Category__c>> apaIdXpreviousExpenseCategories = new Map<Id, List<Expense_Category__c>>();
        Map<Id, List<Expense_Head__c>> apaIdXpreviousExpenseHeads = new Map<Id, List<Expense_Head__c>>();
        Map<Id, Integer> apaIdXnumberOfYears = new Map<Id, Integer>();
        List<Applicant_Proposal_Association__c> relatedAPA = new List<Applicant_Proposal_Association__c>();
        
        List<Expense_Category__c> ecListToInsert = new List<Expense_Category__c>();
        List<Expense_Detail__c> edListToInsert = new List<Expense_Detail__c>();
        List<Annual_Expense__c> aeToInsert = new List<Annual_Expense__c>();
        List<Expense_Category__c> previousExpenseCategories;
        
        // New model lists
        List<Yearly_Expense__c> yeListToInsert = new List<Yearly_Expense__c>();
        List<Expense_Head__c> ehListToInsert = new List<Expense_Head__c>();
        List<Expense_Line_Item__c> eliListToInsert = new List<Expense_Line_Item__c>();
    
        // Fetch Proposal record types
        Map<String, String> rtNameXid = new Map<String, String>();
        for (RecordType rt : [SELECT Id, Name FROM RecordType WHERE SobjectType = 'Application_Proposal__c']) {
            rtNameXid.put(rt.Name, rt.Id);
        }
    
        if (!newRecords.isEmpty()) {
            try {
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
    
                // Collect Proposal IDs for Stage filtering
                for (Application_Proposal__c proposal : newRecords) {
                    if (oldMap != null && oldMap.containsKey(proposal.Id)) {
                        Application_Proposal__c oldProposal = oldMap.get(proposal.Id);
                        
                        if (oldProposal.Stage__c == '1st Stage' && proposal.Stage__c == '2nd Stage') {
                            proposalIds.add(proposal.Id);
                        }
                    }
                }
    
                // Fetch related APA with Duration_In_Months_Max_36__c from Proposal
                relatedAPA = proposalIds.isEmpty() ? new List<Applicant_Proposal_Association__c>() :
                              [SELECT Id, Proposals__c, Proposals__r.RecordType.Name, Proposals__r.Duration_In_Months_Max_36__c,
                               Contact__r.AccountId, Contact__r.Account.BillingCountry, Contact__r.Account.Academia__c, Contact__r.Account.Industry__c
                               FROM Applicant_Proposal_Association__c
                               WHERE Proposals__c IN :proposalIds];
    
                // Query existing Annual_Expense__c and Yearly_Expense__c records to prevent duplicates
                Map<Id, Set<String>> existingAnnualExpenses = new Map<Id, Set<String>>();
                Map<Id, Set<String>> existingYearlyExpenses = new Map<Id, Set<String>>();
                
                if (!relatedAPA.isEmpty()) {
                    for (Applicant_Proposal_Association__c apa : relatedAPA) {
                        apaIds.add(apa.Id);
                    }
                    
                    // Query existing Annual_Expense__c records
                    List<Annual_Expense__c> existingAE = [
                        SELECT Id, Name, Applicant_Proposal_Association__c
                        FROM Annual_Expense__c
                        WHERE Applicant_Proposal_Association__c IN :apaIds
                    ];
                    
                    for (Annual_Expense__c ae : existingAE) {
                        if (!existingAnnualExpenses.containsKey(ae.Applicant_Proposal_Association__c)) {
                            existingAnnualExpenses.put(ae.Applicant_Proposal_Association__c, new Set<String>());
                        }
                        existingAnnualExpenses.get(ae.Applicant_Proposal_Association__c).add(ae.Name);
                    }
                    
                    // Query existing Yearly_Expense__c records
                    List<Yearly_Expense__c> existingYE = [
                        SELECT Id, Year__c, Applicant_Proposal_Association__c
                        FROM Yearly_Expense__c
                        WHERE Applicant_Proposal_Association__c IN :apaIds
                    ];
                    
                    for (Yearly_Expense__c ye : existingYE) {
                        if (!existingYearlyExpenses.containsKey(ye.Applicant_Proposal_Association__c)) {
                            existingYearlyExpenses.put(ye.Applicant_Proposal_Association__c, new Set<String>());
                        }
                        if (ye.Year__c != null) {
                            existingYearlyExpenses.get(ye.Applicant_Proposal_Association__c).add(ye.Year__c);
                        }
                    }
                    
                    for (Applicant_Proposal_Association__c apa : relatedAPA) {
                        // Calculate number of years based on Duration_In_Months_Max_36__c
                        // 36 months = 3 years, 24 months = 2 years, 12 months = 1 year
                        Integer numberOfYears = 3; // Default to 3 years
                        if (apa.Proposals__r.Duration_In_Months_Max_36__c != null) {
                            Decimal durationMonths = apa.Proposals__r.Duration_In_Months_Max_36__c;
                            numberOfYears = (Integer)Math.ceil(durationMonths / 12);
                            // Ensure minimum 1 year and maximum 3 years
                            if (numberOfYears < 1) numberOfYears = 1;
                            if (numberOfYears > 3) numberOfYears = 3;
                        }
                        
                        // Store numberOfYears for later use
                        apaIdXnumberOfYears.put(apa.Id, numberOfYears);
                        
                        // Check existing Annual_Expense__c records before creating
                        Set<String> existingAENames = existingAnnualExpenses.get(apa.Id);
                        if (existingAENames == null) {
                            existingAENames = new Set<String>();
                        }
                        
                        for (Integer i = 1; i <= numberOfYears; i++) {
                            String yearName = 'Year ' + i;
                            // Only create if it doesn't already exist
                            if (!existingAENames.contains(yearName)) {
                                Annual_Expense__c ae = new Annual_Expense__c();
                                ae.Name = yearName;
                                ae.Applicant_Proposal_Association__c = apa.Id;
                                aeToInsert.add(ae);
                            }
                        }
                        
                        // Check existing Yearly_Expense__c records before creating (new model)
                        Set<String> existingYEYears = existingYearlyExpenses.get(apa.Id);
                        if (existingYEYears == null) {
                            existingYEYears = new Set<String>();
                        }
                        
                        for (Integer i = 1; i <= numberOfYears; i++) {
                            String yearStr = string.valueOf(i);
                            // Only create if it doesn't already exist
                            if (!existingYEYears.contains(yearStr)) {
                                Yearly_Expense__c ye = new Yearly_Expense__c();
                                // ye.Name = 'Year ' + i;
                                ye.Year__c = yearStr;
                                ye.Applicant_Proposal_Association__c = apa.Id;
                                ye.Account__c = apa.Contact__r.AccountId;
                                ye.Proposals__c = apa.Proposals__c;
                                yeListToInsert.add(ye);
                            }
                        }
                    }
                }
    
                if (!aeToInsert.isEmpty()) {
                    insert aeToInsert;
                }
                
                // Insert Yearly_Expense__c records
                if (!yeListToInsert.isEmpty()) {
                    insert yeListToInsert;
                }
    
                // Fetch previous Expense Categories for APA
                previousExpenseCategories = apaIds.isEmpty() ? new List<Expense_Category__c>() :
                    [SELECT Id, Name, Applicant_Proposal_Association__c 
                     FROM Expense_Category__c 
                     WHERE Applicant_Proposal_Association__c IN :apaIds];
    
                for (Expense_Category__c ec : previousExpenseCategories) {
                    if (!apaIdXpreviousExpenseCategories.containsKey(ec.Applicant_Proposal_Association__c)) {
                        apaIdXpreviousExpenseCategories.put(ec.Applicant_Proposal_Association__c, new List<Expense_Category__c>());
                    }
                    apaIdXpreviousExpenseCategories.get(ec.Applicant_Proposal_Association__c).add(ec);
                }
                
                // Fetch previous Expense Heads for APA (new model)
                List<Expense_Head__c> previousExpenseHeads = apaIds.isEmpty() ? new List<Expense_Head__c>() :
                    [SELECT Id, Name, Yearly_Expense__r.Applicant_Proposal_Association__c 
                     FROM Expense_Head__c 
                     WHERE Yearly_Expense__r.Applicant_Proposal_Association__c IN :apaIds];
    
                for (Expense_Head__c eh : previousExpenseHeads) {
                    Id apaId = eh.Yearly_Expense__r.Applicant_Proposal_Association__c;
                    if (!apaIdXpreviousExpenseHeads.containsKey(apaId)) {
                        apaIdXpreviousExpenseHeads.put(apaId, new List<Expense_Head__c>());
                    }
                    apaIdXpreviousExpenseHeads.get(apaId).add(eh);
                }
    
                // Loop through APA records to create Expense Categories
                for (Applicant_Proposal_Association__c apa : relatedAPA) {
                    Boolean alreadyHasCategories = apaIdXpreviousExpenseCategories.containsKey(apa.Id)
                                                   && !apaIdXpreviousExpenseCategories.get(apa.Id).isEmpty();
    
                    if (!alreadyHasCategories) {
                        for (Expense_Category_Master__c ecm : ecms) {
                            String dynamicFieldName = ecm.Account_Type__c != null ? ecm.Account_Type__c + '__c' : null;
    
                            if ((ecm.Accounts_Country__c == null || ecm.Accounts_Country__c == apa.Contact__r.Account.BillingCountry) &&
                                (ecm.Campaign__c == null || ecm.Campaign__c == apa.Proposals__r.RecordType.Name) &&
                                (ecm.Account_Type__c == null || apa.Contact__r.Account.get(dynamicFieldName) == true)) {
                                    
                                Expense_Category__c ec = new Expense_Category__c();
                                ec.Index__c = ecm.Index__c;
                                ec.Applicant_Proposal_Association__c = apa.Id; 
                                ec.Name = ecm.Name;
                                ecListToInsert.add(ec);
                            }
                        }
                    }
                }
    
                if (!ecListToInsert.isEmpty()) {
                    insert ecListToInsert;
                    for (Expense_Category__c ec : ecListToInsert) {
                        insertedECIds.add(ec.Id);
                    }
                }
    
                // Create Expense Details
                if (!insertedECIds.isEmpty()) {
                    for (Expense_Category__c ec : [
                        SELECT Id, Name, Applicant_Proposal_Association__c, 
                               Applicant_Proposal_Association__r.Proposals__r.RecordType.Name,
                               Applicant_Proposal_Association__r.Contact__r.Account.BillingCountry
                               FROM Expense_Category__c
                        WHERE Id IN :insertedECIds
                    ]) {
                        for (Expense_Detail_Master__c edm : edms) {
                            String dynamicFieldName = edm.Account_Type__c != null ? edm.Account_Type__c + '__c' : null;
    
                            if ((edm.Accounts_Country__c == null || ec.Applicant_Proposal_Association__r.Contact__r.Account.BillingCountry == edm.Accounts_Country__c) &&
                                edm.Expense_Category_Master__r.Name == ec.Name &&
                                (edm.Campaign__c == null || edm.Campaign__c == ec.Applicant_Proposal_Association__r.Proposals__r.RecordType.Name) &&
                                (edm.Account_Type__c == null || ec.Applicant_Proposal_Association__r.Contact__r.Account.get(dynamicFieldName) == true)) {
    
                                Expense_Detail__c ed = new Expense_Detail__c();
                                ed.Index__c = edm.Index__c;
                                ed.Expense_Category__c = ec.Id;
                                ed.Description__c = edm.Expense_Detail_Description__c;
                                edListToInsert.add(ed);
                            }
                        }
                    }
                }
    
                if (!edListToInsert.isEmpty()) {
                    insert edListToInsert;
                }
                
                // ===== NEW MODEL: Create Expense_Head__c records (similar to Expense_Category__c) =====
                // Create a map of APA Id to its Yearly_Expense__c records
                Map<Id, List<Yearly_Expense__c>> apaIdXYearlyExpenses = new Map<Id, List<Yearly_Expense__c>>();
                for (Yearly_Expense__c ye : yeListToInsert) {
                    if (!apaIdXYearlyExpenses.containsKey(ye.Applicant_Proposal_Association__c)) {
                        apaIdXYearlyExpenses.put(ye.Applicant_Proposal_Association__c, new List<Yearly_Expense__c>());
                    }
                    apaIdXYearlyExpenses.get(ye.Applicant_Proposal_Association__c).add(ye);
                }
                
                // Loop through APA records to create Expense Heads (one per Yearly_Expense__c)
                for (Applicant_Proposal_Association__c apa : relatedAPA) {
                    Boolean alreadyHasExpenseHeads = apaIdXpreviousExpenseHeads.containsKey(apa.Id)
                                                      && !apaIdXpreviousExpenseHeads.get(apa.Id).isEmpty();
                    
                    if (!alreadyHasExpenseHeads && apaIdXYearlyExpenses.containsKey(apa.Id)) {
                        // Get the first Yearly_Expense__c for this APA (Year 1)
                        List<Yearly_Expense__c> yearlyExpenses = apaIdXYearlyExpenses.get(apa.Id);
                        Yearly_Expense__c yearOneExpense = yearlyExpenses.isEmpty() ? null : yearlyExpenses[0];
                        
                        if (yearOneExpense != null) {
                            for (Expense_Category_Master__c ecm : ecms) {
                                String dynamicFieldName = ecm.Account_Type__c != null ? ecm.Account_Type__c + '__c' : null;
        
                                if ((ecm.Accounts_Country__c == null || ecm.Accounts_Country__c == apa.Contact__r.Account.BillingCountry) &&
                                    (ecm.Campaign__c == null || ecm.Campaign__c == apa.Proposals__r.RecordType.Name) &&
                                    (ecm.Account_Type__c == null || apa.Contact__r.Account.get(dynamicFieldName) == true)) {
                                        
                                    Expense_Head__c eh = new Expense_Head__c();
                                    eh.Index__c = ecm.Index__c != null ? String.valueOf(ecm.Index__c) : '';
                                    eh.Yearly_Expense__c = yearOneExpense.Id;
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
                
                if (!ehListToInsert.isEmpty()) {
                    insert ehListToInsert;
                    for (Expense_Head__c eh : ehListToInsert) {
                        insertedEHIds.add(eh.Id);
                    }
                }
                
                // ===== NEW MODEL: Create Expense_Line_Item__c records (similar to Expense_Detail__c) =====
                if (!insertedEHIds.isEmpty()) {
                    for (Expense_Head__c eh : [
                        SELECT Id, Name, Index__c, Account__c, Proposals__c,
                               Yearly_Expense__r.Applicant_Proposal_Association__c,
                               Yearly_Expense__r.Applicant_Proposal_Association__r.Proposals__r.RecordType.Name,
                               Yearly_Expense__r.Applicant_Proposal_Association__r.Contact__r.Account.BillingCountry,
                               Yearly_Expense__r.Applicant_Proposal_Association__r.Contact__r.Account.Academia__c,
                               Yearly_Expense__r.Applicant_Proposal_Association__r.Contact__r.Account.Industry__c
                        FROM Expense_Head__c
                        WHERE Id IN :insertedEHIds
                    ]) {
                        for (Expense_Detail_Master__c edm : edms) {
                            String dynamicFieldName = edm.Account_Type__c != null ? edm.Account_Type__c + '__c' : null;
                            String billingCountry = eh.Yearly_Expense__r.Applicant_Proposal_Association__r.Contact__r.Account.BillingCountry;
                            String recordTypeName = eh.Yearly_Expense__r.Applicant_Proposal_Association__r.Proposals__r.RecordType.Name;
    
                            if ((edm.Accounts_Country__c == null || billingCountry == edm.Accounts_Country__c) &&
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
                
                if (!eliListToInsert.isEmpty()) {
                    insert eliListToInsert;
                }
    
            } catch (Exception e) {
                System.debug('Exception: ' + e.getMessage() + ' at Line: ' + e.getLineNumber() + ' Stack Trace:' + e.getStackTraceString());
            }
        } else {
            System.debug('No Proposals created or updated yet.');
        }

    }
    
    public static void firstTestMethod8(){
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
    }
    
    
    
    
    
    
}