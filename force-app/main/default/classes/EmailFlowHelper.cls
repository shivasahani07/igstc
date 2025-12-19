/* 
* AUTHOR - Isha Raj
*/

public class EmailFlowHelper {
    @InvocableMethod(label='Generate Conga Template' description='Get template Id to send an Attachment' category='Application_Proposal__c')
    Public Static Void generateIFTemplateFromProposal(List<Id> recordId){
        system.debug('recordId ::'+recordId);
        String recordIdVar = recordId[0];
        system.debug('recordIdVar ::'+recordIdVar);        
        
        Application_Proposal__c appProposalRec = [SELECT Id,Name,Conga_URL__c,Document_generated__c,Pecfar_Conga_Url__c,IF_conga_Url__c,Wiser_Conga_Url__c,Sing_Conga_url__c,RecordTypeId,RecordType.Name  FROM Application_Proposal__c WHERE Id = :recordIdVar];
        system.debug('appProposalRec ::'+appProposalRec);
        
        if(appProposalRec.RecordType.Name == 'Industrial Fellowship'){
            system.debug('IF');
            //Platform Event
            GenerateCongaTemplate__e GenerateCongaTemplateRec = new GenerateCongaTemplate__e( Proposal_Id__c=recordIdVar, Proposal_RecordType_Name__c='IF Conga Url' );           
            Database.SaveResult result = EventBus.publish(GenerateCongaTemplateRec);
            if (result.isSuccess()) {
                System.debug('Successfully published event.');
                
            } else {
                for(Database.Error err : result.getErrors()) {
                    System.debug('Error returned: ' + err.getStatusCode() );
                }
            }
            //DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(recordIdVar,'IF Conga Url');
        }else if(appProposalRec.RecordType.Name == 'PECFAR'){
            system.debug('PECFAR');
            //Platform Event
            GenerateCongaTemplate__e GenerateCongaTemplateRec = new GenerateCongaTemplate__e( Proposal_Id__c=recordIdVar, Proposal_RecordType_Name__c='Pecfar Conga Url' );           
            Database.SaveResult result = EventBus.publish(GenerateCongaTemplateRec);
            if (result.isSuccess()) {
                System.debug('Successfully published event.');
                
            } else {
                for(Database.Error err : result.getErrors()) {
                    System.debug('Error returned: ' + err.getStatusCode() );
                }
            }
            // DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(recordIdVar,'Pecfar Conga Url');
            
        }else if(appProposalRec.RecordType.Name == 'WISER'){
            system.debug('WISER');
            //Platform Event
            GenerateCongaTemplate__e GenerateCongaTemplateRec = new GenerateCongaTemplate__e( Proposal_Id__c=recordIdVar, Proposal_RecordType_Name__c='Wiser Conga Url' );           
            Database.SaveResult result = EventBus.publish(GenerateCongaTemplateRec);
            if (result.isSuccess()) {
                System.debug('Successfully published event.');
                
            } else {
                for(Database.Error err : result.getErrors()) {
                    System.debug('Error returned: ' + err.getStatusCode() );
                }
            }
            // DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(recordIdVar,'Wiser Conga Url');
        }else if(appProposalRec.RecordType.Name == 'SING'){
            system.debug('SING');
            //Platform Event
            GenerateCongaTemplate__e GenerateCongaTemplateRec = new GenerateCongaTemplate__e( Proposal_Id__c=recordIdVar, Proposal_RecordType_Name__c='Sing Conga url' );           
            Database.SaveResult result = EventBus.publish(GenerateCongaTemplateRec);
            if (result.isSuccess()) {
                System.debug('Successfully published event.');
                
            } else {
                for(Database.Error err : result.getErrors()) {
                    System.debug('Error returned: ' + err.getStatusCode() );
                }
            }
            // DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(recordIdVar,'Sing Conga url');
        }
        else if(appProposalRec.RecordType.Name == 'Workshop'){
            system.debug('WORKSHOP');
            //Platform Event
            GenerateCongaTemplate__e GenerateCongaTemplateRec = new GenerateCongaTemplate__e( Proposal_Id__c=recordIdVar, Proposal_RecordType_Name__c='WORKSHOP APPLICATION PORTAL' );           
            Database.SaveResult result = EventBus.publish(GenerateCongaTemplateRec);
            if (result.isSuccess()) {
                System.debug('Successfully published event.');
                
            } else {
                for(Database.Error err : result.getErrors()) {
                    System.debug('Error returned: ' + err.getStatusCode() );
                }
            }
            // DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(recordIdVar,'Sing Conga url');
        }
        else if(appProposalRec.RecordType.Name == 'Two Plus Two'){
            system.debug('Two Plus Two');
            //Platform Event
            GenerateCongaTemplate__e GenerateCongaTemplateRec = new GenerateCongaTemplate__e( Proposal_Id__c=recordIdVar, Proposal_RecordType_Name__c='TWO PLUS TWO APP PORTAL' );           
            Database.SaveResult result = EventBus.publish(GenerateCongaTemplateRec);
            if (result.isSuccess()) {
                System.debug('Successfully published event.');
                
            } else {
                for(Database.Error err : result.getErrors()) {
                    System.debug('Error returned: ' + err.getStatusCode() );
                }
            }
            DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(recordIdVar,'TWO PLUS TWO APP PORTAL');
        }
    }
 
    //@InvocableMethod(label='Generate attachment Id For IF' description='Get attachment template' category='attachment')
    //This method will be used to generate Template dynamically for Applicatio Portal
    Public Static String getLatestAttachmentId(String proID){
        
        List<Attachment> attList = [Select Id,name from attachment where parentId = :proID order by createdDate DESC];
        
        return attList[0].Id;
    }
}