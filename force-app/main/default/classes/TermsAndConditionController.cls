public with sharing class TermsAndConditionController {
    
    // Fetch Country picklist values dynamically
    @AuraEnabled(cacheable=true)
    public static List<String> getCountryOptions() {
        Set<String> countries = new Set<String>();
        for (Terms_Condition__c term : [
            SELECT Country__c FROM Terms_Condition__c WHERE Country__c != NULL
        ]) {
            countries.add(term.Country__c);
        }
        return new List<String>(countries);
    }

    @AuraEnabled
    public static String saveTermsCondition(String htmlText, Id campaignId, String country) {
        if(campaignId!=null && country!=null){
            List<Terms_Condition__c> termsList=[SELECT Id, Terms_Description__c  FROM Terms_Condition__c WHERE Campaign__c = :campaignId AND Country__c = :country LIMIT 1];
            if(!termsList.isEmpty()){
                throw new AuraHandledException('Terms and Conditions already exists for this same Campaign and Country');
            }
        }
        try{

           Terms_Condition__c term = new Terms_Condition__c(
            Terms_Description__c = htmlText,
            Campaign__c = campaignId,
            Country__c = country
        );
        insert term;

        term = [
            SELECT Id, Terms_Description__c 
            FROM Terms_Condition__c 
            WHERE Id = :term.Id 
            LIMIT 1
        ];

        String updatedHTML = adjustHTML(term.Terms_Description__c);
        term.Terms_Description__c = updatedHTML;
        update term;
      
        return term.Id;

       }catch(Exception e){
          throw new AuraHandledException(e.getMessage());
       }
    }

    // Utility: adjust nested list numbering
    private static String adjustHTML(String html) {
        if (String.isBlank(html)) {
            return html;
        }

        List<String> olParts = html.split('</ol>');
        if (olParts.size() <= 1) {
            return html;
        }

        String firstPart = olParts[0];
        String remaining = '';

        for (Integer i = 1; i < olParts.size(); i++) {
            if (i > 1) remaining += '</ol>';
            remaining += olParts[i];
        }

        String ulPart = '';
        Integer ulStart = remaining.indexOf('<ul>');
        Integer ulEnd = remaining.lastIndexOf('</ul>');
        String ulEndTag = '</ul>';

        if (ulStart != -1 && ulEnd != -1 && ulEnd > ulStart) {
            ulPart = remaining.substring(ulStart, ulEnd + ulEndTag.length());
        }

        Integer lastLiCount = countOccurrences(firstPart, '<li>');

        if (!String.isBlank(ulPart)) {
            firstPart = firstPart.replace('</li></ol>', ulPart + '</li></ol>');
        }

        remaining = remaining.replaceFirst('<ol>', '<ol start="' + (lastLiCount + 1) + '">');
        return firstPart + '</ol>' + remaining;
    }

    private static Integer countOccurrences(String text, String search) {
        Integer count = 0;
        Integer idx = 0;
        while (true) {
            idx = text.indexOf(search, idx);
            if (idx == -1) break;
            count++;
            idx += search.length();
        }
        return count;
    }
}