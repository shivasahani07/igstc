@isTest
public class CongaHelperToolLightningTest {
    
    @TestSetup
    static void setup() {
        CongaSession__c cs = new CongaSession__c(
            Name = 'NubikDev',
            Username__c = 'test@test.com',
            Password__c = 'test123'
        );
        insert cs;
    }
    
    @isTest
    static void testHttpReq() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());
        
        Test.startTest();
        String result = CongaHelperToolLightning.HttpReq('https://test.com');
        Test.stopTest();
        
        System.assertEquals('Success', result);
    }
    
    @isTest
    static void testGetSessionId() {
        Test.setMock(HttpCalloutMock.class, new MockSoapResponse());
        
        Test.startTest();
        String sessionId = CongaHelperToolLightning.getSessionId('test@test.com', 'test123');
        Test.stopTest();
    }
    
    @isTest
    static void testGenerateReport() {
        Test.setMock(HttpCalloutMock.class, new MockCongaResponse());
        
        Test.startTest();
        String attachId = CongaHelperToolLightning.generateReport(
            'https://test.com?sessionId=SESSION_ID',
            'Test.pdf',
            'val1',
            'val2', 
            'val3'
        );
        Test.stopTest();
        
        System.assertNotEquals(null, attachId);
    }
    
    @isTest
    static void testFixBatchURL() {
        Test.startTest();
        String result = CongaHelperToolLightning.fixBatchURL(
            'https://test.com',
            'Test.pdf',
            'dv0',
            'dv1',
            'dv2'
        );
        Test.stopTest();
        
        System.assert(result.contains('DefaultPDF=1'));
        System.assert(result.contains('APIMode=1'));
        System.assert(result.contains('OFN=Test.pdf'));
    }
    
    @isTest
    static void testGetReportName() {
        Test.startTest();
        String result = CongaHelperToolLightning.getReportName('Report', 'Record', 'English');
        Test.stopTest();
        
        System.assertEquals('Report EN - Record', result);
    }
    
    // Simple Mock Classes
    private class MockHttpResponse implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200);
            res.setBody('Success');
            return res;
        }
    }
    
    private class MockSoapResponse implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200);
            res.setBody('<?xml version="1.0"?><Envelope><Body><loginResponse><result><sessionId>TEST123</sessionId></result></loginResponse></Body></Envelope>');
            return res;
        }
    }
    
    private class MockCongaResponse implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200);
            res.setBody('</body>/ATTACH123');
            return res;
        }
    }
}