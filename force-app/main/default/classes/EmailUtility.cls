public class EmailUtility {
    
    Public static void SendEmailToReviwierForToday(String EmailId){
        
        Messaging.SingleEmailMessage reviewerEmail = new Messaging.SingleEmailMessage();
        
        List<Messaging.SingleEmailMessage> emailsList = new List<Messaging.SingleEmailMessage>();
                List <String> emailRecipients = new List <String>{EmailId};
                    
                reviewerEmail.setToAddresses(emailRecipients);
                reviewerEmail.setSubject('Reviews pending');
                reviewerEmail.setReplyTo(emailRecipients[0]);
                
                String emailBody = 'Dear ';
                emailBody += ' <br> <br> We are Delighted to Inform you that you have been assigned as a evaluator on Proposal for IGSTC 2+2 Call Project Titled as "{Project Title}".  <br> <br>';
                emailBody += ' Its been Already 7 Days And we have Not recieved your reviews on Below Mentioned proposal.Kindly Submit your valuable remarks on proposal by logging in to our Evalaution Portal with below Credentials. <br> <br>';
                
                emailBody += '<br> Thanks & Regards, <br> Amit Salvi, <br> Project Co-ordinator <br> IGSTC';
                reviewerEmail.setHtmlBody(emailBody);
                emailsList.add(reviewerEmail);
            
            if(!emailsList.isEmpty()) {
                Messaging.sendEmail(emailsList);     
            }
        
    }

}