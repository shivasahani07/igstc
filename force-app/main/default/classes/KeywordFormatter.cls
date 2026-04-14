public class KeywordFormatter {
    
    /**
     * Converts semicolon-separated string to HTML ordered list for Rich Text Fields
     * @param inputString - The semicolon-separated string (e.g., "one;two;three")
     * @return Formatted HTML string with proper list formatting
     */
    public static String formatToNumberedPoints(String inputString) {
        if (String.isBlank(inputString)) {
            return '';
        }
        
        // Split by semicolon
        List<String> items = inputString.split(';');
        
        // Use HTML ordered list for proper numbering
        String htmlOutput = '<ol style="margin-top: 0; margin-bottom: 0; padding-left: 20px;">';
        
        for (Integer i = 0; i < items.size(); i++) {
            String item = items[i].trim();
            if (String.isNotBlank(item)) {
                htmlOutput += '<li>' + item + '</li>';
            }
        }
        
        htmlOutput += '</ol>';
        
        return htmlOutput;
    }
    
    /**
     * Generic method to update any field on any object with formatted points
     * @param inputString - The semicolon-separated string
     * @param recordsToUpdate - List of records to update
     * @param targetField - The API name of the field to update
     * @return List of updated records
     */
    public static List<SObject> updateFormattedFieldOnRecords(String inputString, List<SObject> recordsToUpdate, String targetField) {
        if (String.isBlank(inputString) || recordsToUpdate == null || recordsToUpdate.isEmpty()) {
            return recordsToUpdate;
        }
        
        String formattedValue = formatToNumberedPoints(inputString);
        
        for (SObject record : recordsToUpdate) {
            record.put(targetField, formattedValue);
        }
        
        return recordsToUpdate;
    }
    
    // Helper method to update APA records
    public static void updateAPAExpectedDeliverables(Set<Id> proposalIds) {
        
        // Get all APA records related to these proposals
        List<Applicant_Proposal_Association__c> apasToUpdate = new List<Applicant_Proposal_Association__c>();
        
        // Query APA records with their related Proposal data
        List<Applicant_Proposal_Association__c> relatedAPAs = [
            SELECT Id, 
                   Expected_Deliverables_Points__c,Proposals__r.Research_Approach_Objectives__c,
                   Proposals__c,
                   Proposals__r.Expected_Deliverables__c
            FROM Applicant_Proposal_Association__c 
            WHERE Proposals__c IN :proposalIds
        ];
        
        // Group APAs by Proposal ID for efficient processing
        Map<Id, List<Applicant_Proposal_Association__c>> apasByProposalId = new Map<Id, List<Applicant_Proposal_Association__c>>();
        
        for (Applicant_Proposal_Association__c apa : relatedAPAs) {
            if (!apasByProposalId.containsKey(apa.Proposals__c)) {
                apasByProposalId.put(apa.Proposals__c, new List<Applicant_Proposal_Association__c>());
            }
            apasByProposalId.get(apa.Proposals__c).add(apa);
        }
        
        // Process each Proposal's APAs
        for (Id proposalId : proposalIds) {
            if (apasByProposalId.containsKey(proposalId)) {
                // Get the first APA to access the Proposal's Expected_Deliverables__c
                // (all APAs for this proposal will have the same proposal reference)
                List<Applicant_Proposal_Association__c> proposalAPAs = apasByProposalId.get(proposalId);
                
                if (!proposalAPAs.isEmpty()) {
                    String deliverablesValue = proposalAPAs[0].Proposals__r.Expected_Deliverables__c;
                    String deliverablesValue2 = proposalAPAs[0].Proposals__r.Research_Approach_Objectives__c;
                    
                    // Use the utility method to update all APAs for this proposal
                    KeywordFormatter.updateFormattedFieldOnRecords(deliverablesValue,proposalAPAs,'Expected_Deliverables_Points__c');
                    KeywordFormatter.updateFormattedFieldOnRecords(deliverablesValue2,proposalAPAs,'Research_Approach_Objectives_Points__c');
                    apasToUpdate.addAll(proposalAPAs);
                }
            }
        }
        
        // Update all APA records
        if (!apasToUpdate.isEmpty()) {
            try {
                update apasToUpdate;
                System.debug('Updated ' + apasToUpdate.size() + ' APA records with formatted deliverables');
            } catch (DmlException e) {
                System.debug('Error updating APA records: ' + e.getMessage());
                // Handle error appropriately
            }
        }
    }
}