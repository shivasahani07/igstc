@isTest
public class KeywordFormatterTest {

    private static Id getProposalRecordTypeId() {
        Map<String, Schema.RecordTypeInfo> rtByName = Schema.SObjectType.Application_Proposal__c.getRecordTypeInfosByName();
        if (rtByName != null && rtByName.containsKey('Industrial Fellowship')) {
            return rtByName.get('Industrial Fellowship').getRecordTypeId();
        }
        if (rtByName != null) {
            for (Schema.RecordTypeInfo rti : rtByName.values()) {
                if (rti != null && rti.isAvailable()) {
                    return rti.getRecordTypeId();
                }
            }
        }
        return null;
    }

    @isTest
    static void testFormatToNumberedPoints_Blank() {
        System.assertEquals('', KeywordFormatter.formatToNumberedPoints(null));
        System.assertEquals('', KeywordFormatter.formatToNumberedPoints(''));
        System.assertEquals('', KeywordFormatter.formatToNumberedPoints('   '));
    }

    @isTest
    static void testFormatToNumberedPoints_Basic() {
        String inputValue = ' one ; two;three ; ; ';
        String html = KeywordFormatter.formatToNumberedPoints(inputValue);

        System.assert(html.startsWith('<ol'), 'Should start with <ol>');
        System.assert(html.contains('<li>one</li>'), 'Should contain trimmed item one');
        System.assert(html.contains('<li>two</li>'), 'Should contain trimmed item two');
        System.assert(html.contains('<li>three</li>'), 'Should contain trimmed item three');
        System.assert(html.endsWith('</ol>'), 'Should end with </ol>');
        System.assertEquals(-1, html.indexOf('<li></li>'), 'Should not include blank list items');
    }

    @isTest
    static void testUpdateFormattedFieldOnRecords() {
        Account a = new Account(Name = 'Test');

        List<SObject> updated = KeywordFormatter.updateFormattedFieldOnRecords(
            'a;b',
            new List<SObject>{ a },
            'Description'
        );

        System.assertEquals(1, updated.size());
        System.assertEquals(KeywordFormatter.formatToNumberedPoints('a;b'), (String)updated[0].get('Description'));

        List<SObject> noChange = KeywordFormatter.updateFormattedFieldOnRecords('', new List<SObject>{ new Account(Name = 'X') }, 'Description');
        System.assertEquals(1, noChange.size());
        System.assertEquals(null, noChange[0].get('Description'));
    }

    @isTest
    static void testUpdateAPAExpectedDeliverables() {
        Test.setMock(HttpCalloutMock.class, new HTTPMockGenerate());

        Account acct = new Account(Name = 'Test Account', BillingCountry = 'India', Academia__c = true, Industry__c = false);
        insert acct;

        Contact c = new Contact(FirstName = 'Test', LastName = 'Contact', AccountId = acct.Id, Email = 'test@example.com');
        insert c;

        Application_Proposal__c proposal = new Application_Proposal__c(
            RecordTypeId = getProposalRecordTypeId(),
            Stage__c = '1st Stage',
            Proposal_Stages__c = 'Draft',
            Expected_Deliverables__c = 'one;two'
        );
        insert proposal;

        Applicant_Proposal_Association__c apa = new Applicant_Proposal_Association__c(
            Proposals__c = proposal.Id,
            Contact__c = c.Id
        );
        insert apa;

        Test.startTest();
        KeywordFormatter.updateAPAExpectedDeliverables(new Set<Id>{ proposal.Id });
        Test.stopTest();

        Applicant_Proposal_Association__c refreshed = [
            SELECT Id, Expected_Deliverables_Points__c
            FROM Applicant_Proposal_Association__c
            WHERE Id = :apa.Id
        ];

        System.assertEquals(KeywordFormatter.formatToNumberedPoints('one;two'), refreshed.Expected_Deliverables_Points__c);
    }
}