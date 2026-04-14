public class s_class {

    /**
     * Processes proposals matching the given campaign name and proposal Id:
     * creates/links APAs and updates related child records (Education, Employment, etc.).
     * @param campaignName Campaign__r.Name value (e.g. 'pecfar')
     * @param proposalId   Application_Proposal__c Id to process
     */
    public static void updateData(String campaignName, Id proposalId) {
        if (String.isBlank(campaignName) || proposalId == null) {
            System.debug('campaignName and proposalId are required');
            return;
        }

        List<Application_Proposal__c> pefcarapp = [
            SELECT Id, Name
            FROM Application_Proposal__c
            WHERE Campaign__r.Name = :campaignName
            AND Id = :proposalId
        ];

        if (pefcarapp.isEmpty()) {
            System.debug('No proposal found with Campaign Name = ' + campaignName + ' and Id = ' + proposalId);
            return;
        }
        
        System.debug('Processing ' + pefcarapp.size() + ' proposal(s)');
        
        List<Contact> contactss = [
            SELECT Id, Name, AccountId, Proposals__c,Is_Primary__c,
            (SELECT Applicant_Proposal_Association__c, Name, Degree__c, Start_Year__c, End_Year__c, CGPA__c, End_Date__c, Start_Date__c, Institution_Name__c, Area_of_specialization__c, Percentage__c, Percentage_cgpa__c, Contact__c 
             FROM Education_Details__r),
            (SELECT Applicant_Proposal_Association__c, Id, Organization_Name__c, Position__c, Start_Year__c, End_Year__c, Contact__c 
             FROM Employment_Details__r),
            (SELECT Id, Name, Applicant_Proposal_Association__c, Contact__c 
             FROM Publications_Patents__r),
            (SELECT Id, Name, Contact__c, Applicant_Proposal_Association__c 
             FROM User_Documents__r),
            (SELECT Id, Name, Contact__c, Applicant_Proposal_Association__c 
             FROM Achievements__r)
            FROM Contact 
            WHERE Proposals__c IN :pefcarapp
        ];
        
        // Process each proposal separately
        Set<Id> proposalIds = new Set<Id>();
        Set<Id> contactIds = new Set<Id>();
        Map<Id, Contact> contactMap = new Map<Id, Contact>();
        
        for (Contact con : contactss) {
            contactIds.add(con.Id);
            if (con.AccountId != null) {
                contactMap.put(con.AccountId, con);
            }
        }
        
        for (Application_Proposal__c prop : pefcarapp) {
            proposalIds.add(prop.Id);
        }
        
        // Fetch existing associations for ALL proposals
        Map<String, Applicant_Proposal_Association__c> existingAssocMap = new Map<String, Applicant_Proposal_Association__c>();
        // Key format: ContactId + '_' + ProposalId
        if (!contactIds.isEmpty() && !proposalIds.isEmpty()) {
            for (Applicant_Proposal_Association__c apa : [
                SELECT Id, Contact__c, Proposals__c
                FROM Applicant_Proposal_Association__c
                WHERE Contact__c IN :contactIds
                AND Proposals__c IN :proposalIds
            ]) {
                String key = apa.Contact__c + '_' + apa.Proposals__c;
                existingAssocMap.put(key, apa);
            }
        }
        
        // Create APAs for each proposal-contact combination
        List<Applicant_Proposal_Association__c> apainserted = new List<Applicant_Proposal_Association__c>();
        for (Application_Proposal__c prop : pefcarapp) {
            for (Contact con : contactss) {
                String key = con.Id + '_' + prop.Id;
                if (!existingAssocMap.containsKey(key)) {
                    Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c();
                    apa.is_coordinator__c = con.Is_Primary__c;
                    apa.Contact__c = con.Id;  
                    apa.Proposals__c = prop.Id;
                    apainserted.add(apa);
                }
            }
        }
        
        if (!apainserted.isEmpty()) {
            insert apainserted;
            System.debug('Created ' + apainserted.size() + ' new APAs');
        }
        
        // Combine existing and newly inserted APAs
        List<Applicant_Proposal_Association__c> allAPAs = new List<Applicant_Proposal_Association__c>();
        allAPAs.addAll(existingAssocMap.values());
        allAPAs.addAll(apainserted);
        
        // Create map: ContactId -> Map<ProposalId, APA>
        // This allows child records to be linked to the correct APA for each proposal
        Map<Id, Map<Id, Applicant_Proposal_Association__c>> apaByContactAndProposal = new Map<Id, Map<Id, Applicant_Proposal_Association__c>>();
        for (Applicant_Proposal_Association__c apa : allAPAs) {
            if (!apaByContactAndProposal.containsKey(apa.Contact__c)) {
                apaByContactAndProposal.put(apa.Contact__c, new Map<Id, Applicant_Proposal_Association__c>());
            }
            apaByContactAndProposal.get(apa.Contact__c).put(apa.Proposals__c, apa);
        }
        
        // Collect all child records for update
        List<Education_Details__c> educationDetails = new List<Education_Details__c>();
        List<Employment_Details__c> employmentDetails = new List<Employment_Details__c>();
        List<Publications_Patents__c> publicationDetails = new List<Publications_Patents__c>();
        List<User_Document__c> userDocuments = new List<User_Document__c>();
        List<Achievement__c> achievements = new List<Achievement__c>();
        
        // For child records, we need to determine which proposal they belong to
        // Since child records may not have Proposal__c, we'll link them to the APA for the contact's current proposal
        // If Contact has Proposals__c set, use that; otherwise use the first proposal
        Map<Id, Applicant_Proposal_Association__c> apaByContactid = new Map<Id, Applicant_Proposal_Association__c>();
        for (Contact con : contactss) {
            Id proposalIdToUse = null;
            if (con.Proposals__c != null && proposalIds.contains(con.Proposals__c)) {
                proposalIdToUse = con.Proposals__c;
            } else if (!pefcarapp.isEmpty()) {
                // Fallback to first proposal if Contact doesn't have Proposals__c set
                proposalIdToUse = pefcarapp[0].Id;
            }
            
            if (proposalIdToUse != null && apaByContactAndProposal.containsKey(con.Id)) {
                Map<Id, Applicant_Proposal_Association__c> proposalAPAMap = apaByContactAndProposal.get(con.Id);
                if (proposalAPAMap.containsKey(proposalIdToUse)) {
                    apaByContactid.put(con.Id, proposalAPAMap.get(proposalIdToUse));
                }
            }
        }
        
        for (Contact con : contactss) {
            // Update Education Details
            if (con.Education_Details__r != null) {
                for (Education_Details__c edu : con.Education_Details__r) {
                    if (edu.Contact__c != null && apaByContactid.containsKey(edu.Contact__c)) {
                        Applicant_Proposal_Association__c apa = apaByContactid.get(edu.Contact__c);
                        if (apa != null && apa.Id != null) {
                            edu.Applicant_Proposal_Association__c = apa.Id;
                            educationDetails.add(edu);
                        }
                    }
                }
            }
            
            // Update Employment Details
            if (con.Employment_Details__r != null) {
                for (Employment_Details__c empl : con.Employment_Details__r) {
                    if (empl.Contact__c != null && apaByContactid.containsKey(empl.Contact__c)) {
                        Applicant_Proposal_Association__c apa = apaByContactid.get(empl.Contact__c);
                        if (apa != null && apa.Id != null) {
                            empl.Applicant_Proposal_Association__c = apa.Id;
                            employmentDetails.add(empl);
                        }
                    }
                }
            }
            
            // Update Publications/Patents
            if (con.Publications_Patents__r != null) {
                for (Publications_Patents__c pub : con.Publications_Patents__r) {
                    if (pub.Contact__c != null && apaByContactid.containsKey(pub.Contact__c)) {
                        Applicant_Proposal_Association__c apa = apaByContactid.get(pub.Contact__c);
                        if (apa != null && apa.Id != null) {
                            pub.Applicant_Proposal_Association__c = apa.Id;
                            publicationDetails.add(pub);
                        }
                    }
                }
            }
            
            // Update User Documents
            if (con.User_Documents__r != null) {
                for (User_Document__c usrdoc : con.User_Documents__r) {
                    if (usrdoc.Contact__c != null && apaByContactid.containsKey(usrdoc.Contact__c)) {
                        Applicant_Proposal_Association__c apa = apaByContactid.get(usrdoc.Contact__c);
                        if (apa != null && apa.Id != null) {
                            usrdoc.Applicant_Proposal_Association__c = apa.Id;
                            userDocuments.add(usrdoc);
                        }
                    }
                }
            }
            
            // Update Achievements
            if (con.Achievements__r != null) {
                for (Achievement__c achv : con.Achievements__r) {
                    if (achv.Contact__c != null && apaByContactid.containsKey(achv.Contact__c)) {
                        Applicant_Proposal_Association__c apa = apaByContactid.get(achv.Contact__c);
                        if (apa != null && apa.Id != null) {
                            achv.Applicant_Proposal_Association__c = apa.Id;
                            achievements.add(achv);
                        }
                    }
                }
            }
        }
        
        // Update all child records
        if (!educationDetails.isEmpty()) {
            update educationDetails;
        }
        if (!employmentDetails.isEmpty()) {
            update employmentDetails;
        }
        if (!publicationDetails.isEmpty()) {
            update publicationDetails;
        }
        if (!userDocuments.isEmpty()) {
            update userDocuments;
        }
        if (!achievements.isEmpty()) {
            update achievements;
        }
        
        // Query Accounts
        List<Account> accounts = [
            SELECT Id, Name, Proposals__c,
            (SELECT Id, Name, Account__c, Applicant_Proposal_Association__c, Application__c 
             FROM Financial_Contribution__r),
            (SELECT Id, Name, Account__c, Applicant_Proposal_Association__c, Application__c 
             FROM Existing_Grants__r),
            (SELECT Id, Name, Account__c, Applicant_Proposal_Association__c, Proposals__c 
             FROM Yearly_Expense__r)
            FROM Account  
            WHERE Proposals__c IN :proposalIds
        ];
        
        // Collect Account-related child records for update
        List<Financial_Contribution__c> financialContributions = new List<Financial_Contribution__c>();
        List<Existing_Grants__c> existingGrants = new List<Existing_Grants__c>();
        List<Yearly_Expense__c> yearlyExpenses = new List<Yearly_Expense__c>();
        
        if (accounts != null && !accounts.isEmpty()) {
            for (Account acc : accounts) {
                // Update Financial Contributions
                if (acc.Financial_Contribution__r != null) {
                    for(Financial_Contribution__c fc : acc.Financial_Contribution__r) {
                        if (fc.Account__c != null && contactMap.containsKey(fc.Account__c)) {
                            Contact relatedContact = contactMap.get(fc.Account__c);
                            if (relatedContact != null && apaByContactid.containsKey(relatedContact.Id)) {
                                Applicant_Proposal_Association__c apa = apaByContactid.get(relatedContact.Id);
                                if (apa != null && apa.Id != null) {
                                    fc.Applicant_Proposal_Association__c = apa.Id;
                                    financialContributions.add(fc);
                                }
                            }
                        }
                    }
                }
                
                // Update Existing Grants
                if (acc.Existing_Grants__r != null) {
                    for(Existing_Grants__c eg : acc.Existing_Grants__r) {
                        if (eg.Account__c != null && contactMap.containsKey(eg.Account__c)) {
                            Contact relatedContact = contactMap.get(eg.Account__c);
                            if (relatedContact != null && apaByContactid.containsKey(relatedContact.Id)) {
                                Applicant_Proposal_Association__c apa = apaByContactid.get(relatedContact.Id);
                                if (apa != null && apa.Id != null) {
                                    eg.Applicant_Proposal_Association__c = apa.Id;
                                    existingGrants.add(eg);
                                }
                            }
                        }
                    }
                }
                
                // Update Yearly Expenses
                if (acc.Yearly_Expense__r != null) {
                    for(Yearly_Expense__c ye : acc.Yearly_Expense__r) {
                        if (ye.Account__c != null && contactMap.containsKey(ye.Account__c)) {
                            Contact relatedContact = contactMap.get(ye.Account__c);
                            if (relatedContact != null && apaByContactid.containsKey(relatedContact.Id)) {
                                Applicant_Proposal_Association__c apa = apaByContactid.get(relatedContact.Id);
                                if (apa != null && apa.Id != null) {
                                    ye.Applicant_Proposal_Association__c = apa.Id;
                                    yearlyExpenses.add(ye);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        // Update Account-related child records
        if (!financialContributions.isEmpty()) {
            update financialContributions;
        }
        if (!existingGrants.isEmpty()) {
            update existingGrants;
        }
        if (!yearlyExpenses.isEmpty()) {
            update yearlyExpenses;
        }
    }
}