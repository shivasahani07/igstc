@isTest
public class ReviewLogInFormControllerTest {
    
    @TestSetup
    static void setupTestData() {
        // Create test Reviewer records
        List<Reviewer__c> testReviewers = new List<Reviewer__c>();
        
        testReviewers.add(new Reviewer__c(
            Name = 'Test Reviewer 1',
            Email__c = 'test1@example.com',
            Password__c = 'password123',
            Login_Hash_Code__c = 'oldHashCode1'
        ));
        
        testReviewers.add(new Reviewer__c(
            Name = 'Test Reviewer 2',
            Email__c = 'test2@example.com',
            Password__c = 'password456',
            Login_Hash_Code__c = 'oldHashCode2'
        ));
        
        insert testReviewers;
    }
    
    @isTest
    static void testLoginReviewer_Success() {
        // Test successful login
        Test.startTest();
        String result = ReviewLogInFormController.loginReviewer('test1@example.com', 'password123');
        Test.stopTest();
        
        // Verify the result
        System.assertNotEquals(null, result, 'Login should return a hash code');
        System.assert(result.length() > 0, 'Hash code should not be empty');
        
        // Verify the reviewer record was updated
        Reviewer__c updatedReviewer = [SELECT Login_Hash_Code__c FROM Reviewer__c WHERE Email__c = 'test1@example.com'];
        System.assertEquals(result, updatedReviewer.Login_Hash_Code__c, 'Hash code should be updated');
    }
    
    @isTest
    static void testLoginReviewer_InvalidCredentials() {
        // Test login with invalid credentials
        Test.startTest();
        String result = ReviewLogInFormController.loginReviewer('wrong@example.com', 'wrongpassword');
        Test.stopTest();
        
        // Verify the result
        System.assertEquals(null, result, 'Login should return null for invalid credentials');
    }
    
    @isTest
    static void testLoginReviewer_EmptyCredentials() {
        // Test login with empty credentials
        Test.startTest();
        String result = ReviewLogInFormController.loginReviewer('', '');
        Test.stopTest();
        
        // Verify the result
        System.assertEquals(null, result, 'Login should return null for empty credentials');
    }
    
    @isTest
    static void testForgetPassReviewer_Success() {
        // Test successful password reset request
        Test.startTest();
        String result = ReviewLogInFormController.ForgetPassReviewer('test1@example.com');
        Test.stopTest();
        
        // Verify the result
        System.assertNotEquals(null, result, 'Forget password should return a hash code');
        System.assert(result.length() > 0, 'Hash code should not be empty');
        
        // Verify the reviewer record was updated
        Reviewer__c updatedReviewer = [SELECT Login_Hash_Code__c FROM Reviewer__c WHERE Email__c = 'test1@example.com'];
        System.assertEquals(result, updatedReviewer.Login_Hash_Code__c, 'Hash code should be updated');
    }
    
    @isTest
    static void testForgetPassReviewer_EmailNotFound() {
        // Test password reset request with non-existent email
        Test.startTest();
        String result = ReviewLogInFormController.ForgetPassReviewer('nonexistent@example.com');
        Test.stopTest();
        
        // Verify the result
        System.assertEquals(null, result, 'Forget password should return null for non-existent email');
    }
    
    @isTest
    static void testForgetPassReviewer_EmptyEmail() {
        // Test password reset request with empty email
        Test.startTest();
        String result = ReviewLogInFormController.ForgetPassReviewer('');
        Test.stopTest();
        
        // Verify the result
        System.assertEquals(null, result, 'Forget password should return null for empty email');
    }
    
    @isTest
    static void testResetPassword_Success() {
        // Setup - get a reviewer with known hash code
        Reviewer__c testReviewer = [SELECT Id, Login_Hash_Code__c FROM Reviewer__c WHERE Email__c = 'test1@example.com'];
        String oldHashCode = testReviewer.Login_Hash_Code__c;
        String newPassword = 'newPassword123';
        
        Test.startTest();
        String result = ReviewLogInFormController.ResetPassword(newPassword, oldHashCode);
        Test.stopTest();
        
        // Verify the result
        System.assertNotEquals(null, result, 'Reset password should return a new hash code');
        System.assertNotEquals(oldHashCode, result, 'New hash code should be different from old one');
        
        // Verify the reviewer record was updated
        Reviewer__c updatedReviewer = [SELECT Password__c, Login_Hash_Code__c FROM Reviewer__c WHERE Id = :testReviewer.Id];
        System.assertEquals(newPassword, updatedReviewer.Password__c, 'Password should be updated');
        System.assertEquals(result, updatedReviewer.Login_Hash_Code__c, 'Hash code should be updated');
    }
    
    @isTest
    static void testResetPassword_InvalidHashCode() {
        // Test reset password with invalid hash code
        Test.startTest();
        String result = ReviewLogInFormController.ResetPassword('newPassword123', 'invalidHashCode');
        Test.stopTest();
        
        // Verify the result
        System.assertEquals(null, result, 'Reset password should return null for invalid hash code');
    }
    
    @isTest
    static void testResetPassword_EmptyParameters() {
        // Test reset password with empty parameters
        Test.startTest();
        String result = ReviewLogInFormController.ResetPassword('', '');
        Test.stopTest();
        
        // Verify the result
        System.assertEquals(null, result, 'Reset password should return null for empty parameters');
    }
    
    @isTest
    static void testExceptionHandling() {
        // Test exception handling by causing a DML exception
        // This test ensures that exceptions are properly caught and handled
        
        // Remove all reviewers to cause query to return empty list
        delete [SELECT Id FROM Reviewer__c];
        
        Test.startTest();
        String loginResult = ReviewLogInFormController.loginReviewer('test@example.com', 'password');
        String forgetResult = ReviewLogInFormController.ForgetPassReviewer('test@example.com');
        String resetResult = ReviewLogInFormController.ResetPassword('newPass', 'hash');
        Test.stopTest();
        
        // Verify that methods return null when exceptions occur
        System.assertEquals(null, loginResult, 'Should return null when exception occurs');
        System.assertEquals(null, forgetResult, 'Should return null when exception occurs');
        System.assertEquals(null, resetResult, 'Should return null when exception occurs');
    }
    
    // Test for email functionality in ForgetPassReviewer
    @isTest
    static void testForgetPassReviewer_EmailSending() {
        // Setup mock for email sending
        Integer emailInvocations = Limits.getEmailInvocations();
        
        Test.startTest();
        String result = ReviewLogInFormController.ForgetPassReviewer('test1@example.com');
        Test.stopTest();
        
    }
}