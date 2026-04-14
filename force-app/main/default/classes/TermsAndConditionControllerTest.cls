@isTest
public with sharing class TermsAndConditionControllerTest {
    	@testSetUp
        static void setupData() {
            Campaign c=new Campaign(Name = 'Test Campaign');
            insert c;
            Terms_Condition__c term = new Terms_Condition__c(
                Terms_Description__c = '<h1>Helloo</h1>',
                Campaign__c = c.Id,
                Country__c = 'India'
            );
            insert term;
            Terms_Condition__c term2 = new Terms_Condition__c(
                Terms_Description__c = '<h1>Helloo</h1>',
                Campaign__c = c.Id,
                Country__c = 'Germany'
            );
            //insert term2;
        }  
    @isTest
    public static void testgetCountryOptions(){
        TermsAndConditionController.getCountryOptions();
    }
    @isTest
    public static void testsaveTermsCondition(){
        List<Campaign> campaigns=[SELECT Id FROM Campaign LIMIT 1];
        try{
            TermsAndConditionController.saveTermsCondition('<h1>Helloooo</h1>',campaigns[0].Id,'India');
        }
        catch(Exception e){
            
        }
    }
    @isTest
    public static void testsaveTermsConditionSecond(){
        List<Campaign> campaigns=[SELECT Id FROM Campaign LIMIT 1];
        String html='<h1>Website Terms of Service</h1><h2>1. Acceptance of Terms</h2><p>By registering, you agree to the following:</p><ol><li>Provide accurate and complete information.</li><li>Keep your account details secure.</li><li>Use the website for lawful purposes only.</li></ol><h2>2. Termination Policy</h2><p>We reserve the right to terminate accounts that:</p><ol><li>Violate our terms of use.</li><li>Engage in fraudulent or harmful activities.</li><li>Disrupt the experience of other users.</li></ol>';
        TermsAndConditionController.saveTermsCondition(html,campaigns[0].Id,'Germany');
    }
}