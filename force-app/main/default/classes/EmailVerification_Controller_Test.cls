@IsTest
public class EmailVerification_Controller_Test {

    @IsTest
    static void testVerifyEmail_Success() {
        // Step 1: Create test Contact
        Contact con = new Contact(
            LastName = 'Test User',
            Email = 'testuser@example.com',
            Email_Verified__c = false
        );
        insert con;

        // Step 2: Call RemoteAction method
        Test.startTest();
        String result = EmailVerification_Controller.verifyEmail(con.Id);
        Test.stopTest();

        // Step 3: Fetch updated contact
        Contact updatedCon = [
            SELECT Email_Verified__c, Name
            FROM Contact
            WHERE Id = :con.Id
        ];

        // Step 4: Assertions
        System.assertEquals(true, updatedCon.Email_Verified__c,
            'Email_Verified__c should be updated to true');
        System.assertEquals(updatedCon.Name, result,
            'Method should return contact name');
    }

    @IsTest
    static void testVerifyEmail_BlankHashcode() {
        // Call method with blank hashcode
        Test.startTest();
        String result = EmailVerification_Controller.verifyEmail('');
        Test.stopTest();

        // Assertion
        System.assertEquals('verified', result,
            'Method should return "verified" for blank hashcode');
    }

    @IsTest
    static void testVerifyEmail_InvalidId() {
        // Call method with non-existing Contact Id
        Test.startTest();
        String result = EmailVerification_Controller.verifyEmail('003000000000000AAA');
        Test.stopTest();

        // Assertion
        System.assertEquals('verified', result,
            'Method should return "verified" when no contact is found');
    }
}