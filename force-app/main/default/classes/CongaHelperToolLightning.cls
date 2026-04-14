/* **************************************************************************
* Batch Class: CongaHelperTool
* Created by 
*
* Purpose/Methods:
* - 
*
* Unit Test: 
* 
* Modifications: Jesus Varela - C071847, 10/31/2014
*  generate Potential Candidates, One Pager and  Candidate Biography on Contact
* reports
*
************************************************************************** */
public with sharing class CongaHelperToolLightning {
    
    // -----------------------------------------------------------------------
    // Ststic varialbles
    // -----------------------------------------------------------------------
    public static boolean STOP_MOST_RECENT_NOTE = false;
    
    
    // -----------------------------------------------------------------------
    // HttpReq Method
    // - HttpRequest to get the session related to the org
    // -----------------------------------------------------------------------
    public static String HttpReq(String url){
        // Instantiate a new http object
        Http h = new Http();
        
        // Instantiate a new HTTP request, specify the method (GET) as well 
        // as the endpoint
        HttpRequest req = new HttpRequest();
        req.setMethod('GET');
        req.setEndpoint(url);
        req.setTimeout(120000);
        // Send the request, and return a response
        system.debug('request is'+req);
        HttpResponse res = h.send(req);
        system.debug('body is '+ res.getBody());
        return res.getBody();
    }
    // -----------------------------------------------------------------------
    // getSessionId Method
    // - Get the session related to the org
    // -----------------------------------------------------------------------
    public static String getSessionId(String username, String password){
        String loginDomain;
                
        final String sessionId;
        System.debug(':: username/password ::::::::: '+username+'/'+password);
        try {
          
            loginDomain = System.Url.getOrgDomainUrl().toExternalForm();
            System.debug(':: loginDomain ::::::::: '+loginDomain);
            
            
            //-----------------------------------------------------------------
            // Login via SOAP/XML web service api to establish session
            //-----------------------------------------------------------------
            HttpRequest request = new HttpRequest();
            request.setEndpoint(loginDomain + '/services/Soap/u/60.0');
            request.setMethod('POST');
            request.setHeader('Content-Type', 'text/xml;charset=UTF-8');
            request.setHeader('SOAPAction', '""');
            //not escaping username and password because we're setting those 
            //variables above in other words, this line "trusts" the lines 
            //above if username and password were sourced elsewhere, they'd 
            //need to be escaped below
            request.setBody('<Envelope xmlns="http://schemas.xmlsoap.org/soap'+
                            '/envelope/"><Header/><Body><login xmlns=' + 
                            '"urn:partner.soap.sforce.com"><username>' + 
                            username + '</username><password>' + password + 
                            '</password></login></Body></Envelope>');   
            Dom.XmlNode resultElmt = (new Http()).send(request)
                .getBodyDocument().getRootElement()
                .getChildElement('Body',
                                 'http://schemas.xmlsoap.org/soap/envelope/')
                .getChildElement('loginResponse',
                                 'urn:partner.soap.sforce.com')
                .getChildElement('result','urn:partner.soap.sforce.com');
            
            system.debug('resultElmt'+resultElmt);
            sessionId = resultElmt.getChildElement('sessionId',
                                                   'urn:partner.soap.sforce.com').getText();
            System.debug('sessionId:' + sessionId); 
            
            
        } catch (Exception e) {
            System.debug('Exception:' + e.getMessage() +'@'+e.getLineNumber());    
        }
      
        return sessionId;//userinfo.getSessionId();//sessionId;
    }
    
    /* 
public static String getSessionId(String username, String password){
        String loginDomain;
                
        final String sessionId;
        System.debug(':: username/password ::::::::: '+username+'/'+password);
        try {
          
            loginDomain = Url.getSalesForceBaseUrl().toExternalForm();
            System.debug(':: loginDomain ::::::::: '+loginDomain);
            
            
            //-----------------------------------------------------------------
            // Login via SOAP/XML web service api to establish session
            //-----------------------------------------------------------------
            HttpRequest request = new HttpRequest();
            request.setEndpoint(loginDomain + '/services/Soap/u/22.0');
            request.setMethod('POST');
            request.setHeader('Content-Type', 'text/xml;charset=UTF-8');
            request.setHeader('SOAPAction', '""');
            //not escaping username and password because we're setting those 
            //variables above in other words, this line "trusts" the lines 
            //above if username and password were sourced elsewhere, they'd 
            //need to be escaped below
            request.setBody('<Envelope xmlns="http://schemas.xmlsoap.org/soap'+
                            '/envelope/"><Header/><Body><login xmlns=' + 
                            '"urn:partner.soap.sforce.com"><username>' + 
                            username + '</username><password>' + password + 
                            '</password></login></Body></Envelope>');   
            Dom.XmlNode resultElmt = (new Http()).send(request)
                .getBodyDocument().getRootElement()
                .getChildElement('Body',
                                 'http://schemas.xmlsoap.org/soap/envelope/')
                .getChildElement('loginResponse',
                                 'urn:partner.soap.sforce.com')
                .getChildElement('result','urn:partner.soap.sforce.com');
            
            system.debug('resultElmt'+resultElmt);
            sessionId = resultElmt.getChildElement('sessionId',
                                                   'urn:partner.soap.sforce.com').getText();
            System.debug('sessionId:' + sessionId); 
            
            
        } catch (Exception e) {
            System.debug('Exception:' + e.getMessage() +'@'+e.getLineNumber());    
        }
      
        return sessionId;//userinfo.getSessionId();//sessionId;
    }
*/
    
    public static string generateReport(String reportLink,string fileName,string dv0, string dv1, string dv2){
        String attachId = '';
        System.debug('reportLink =>'+reportLink);
        if(reportLink != null && string.isNotEmpty(reportLink)){
            try {
                string url = reportLink;           
                System.debug(url);
                
                //Org credentials
                CongaSession__c cs = CongaSession__c.getValues('NubikDev');
                String username = cs.Username__c;
                String password = cs.Password__c;
                String sessiondId = CongaHelperToolLightning.getSessionId(username, password);
                
                url = url.replace('SESSION_ID', sessiondId);
                url = CongaHelperToolLightning.fixBatchURL(url,fileName,dv0,dv1,dv2);
                System.debug(':: [CongaHelperTool] EndPoint :: ' + url);
                attachId = CongaHelperToolLightning.HttpReq(url);
                System.debug(':: [CongaHelperToolLightning] attachId :: ' + attachId);
                
                if (attachId.indexOf('</body>/') != -1) {
                    attachId = attachId.substring(attachId.indexOf('</body>/')+8);
                }else if (attachId.indexOf('/') != -1){
                    attachId = attachId.substring(attachId.indexOf('/')+1);
                }
            } catch (Exception e) {
                attachId = 'Result: There is an error when the attachament id was generated';
                System.debug(':: [CongaHelperToolLightning] attachId :: ' + attachId 
                             + '----> ' + e +e.getMessage()+' AT '+e.getLineNumber());
            }
        }
        return attachId;
    }
    
    public static string fixBatchURL(string url, string fileName, string dv0, string dv1, string dv2){
        if(!url.contains('DefaultPDF'))
            url+='&DefaultPDF=1';
        if(!url.contains('APIMode'))
            url+=+'&APIMode=1';
        if(url.contains('&DS7=1'))
            url = url.replace('&DS7=1', '');
        if(!url.contains('&OFN=') && fileName!=null)
            url+='&OFN='+EncodingUtil.urlEncode(fileName, 'UTF-8');
        if(!url.contains('&DV0=') && dv0!=null && dv0!='')
            url+='&DV0='+EncodingUtil.urlEncode(dv0, 'UTF-8');
        if(!url.contains('&DV1=') && dv1!=null && dv1!='')
            url+='&DV1='+EncodingUtil.urlEncode(dv1, 'UTF-8');
        if(!url.contains('&DV2=') && dv2!=null && dv2!='')
            url+='&DV2='+EncodingUtil.urlEncode(dv2, 'UTF-8');
        return url;
    }
    
    public static string getReportName(string baseName, string recordName,string language){
        string result = baseName;
        if(language!=null && language!=''){  
            result += ' '+language.subString(0,2).toUppercase();
        } 
        result += ' - '+recordName;
        return result;
    }
    
}