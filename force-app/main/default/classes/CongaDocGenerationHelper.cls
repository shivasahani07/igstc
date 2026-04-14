public class CongaDocGenerationHelper {
    
    Public static void generateCongaTemplatesForBatch(List<String> recordIdList){
        System.debug('recordIdList'+recordIdList);
        String CongaQuery = '';
        String exCategoriesCustomLable  = Label.docCategoriesToBeExcluded;
        String tempName = '';
        List<String> docCategoriesToBeExcluded =  exCategoriesCustomLable.split(',');
        SYSTEM.debug('docCategoriesToBeExcluded---'+docCategoriesToBeExcluded);
        map<Application_Proposal__c,List<Contact>> contactsByProp = new map<Application_Proposal__c,List<Contact>>();
        map<Id,List<String>> userDocsByPropId = new map<Id,List<String>>();
        map<string,String> attIdsByPropId = new map<string,String>();
        List<Application_Proposal__c> appProposalRecList = [SELECT Id,Name,Conga_URL__c,Pecfar_Conga_Url__c,IF_conga_Url__c,Wiser_Conga_Url__c,Sing_Conga_url__c,RecordTypeId,RecordType.Name,(Select Id, Firstname , Account.BillingCountry ,Lastname from contacts__r)  FROM Application_Proposal__c WHERE Id IN :recordIdList];
        //Application_Proposal__c appProposalRec = appProposalRecList[0];
        
        for(Application_Proposal__c ap : appProposalRecList){
            List<Contact> conLIst = new List<Contact>();
            conLIst.addAll(ap.contacts__r);
            contactsByProp.put(ap ,conLIst);
        }
        system.debug('contactsByProp'+contactsByProp);
        
        List<String> UserDocumentIds = new List<String>();
        
        List<User_Document__c> UserDocList = [Select Id,Name,Proposal_Id__c,(select id from attachments order by createddate desc limit 1) from User_Document__c where Proposal_Id__c IN:recordIdList AND Name NOT IN :docCategoriesToBeExcluded];
        
        
        
        for(User_Document__c ud : UserDocList){
            system.debug('Attachments'+ud.attachments);
            if(userDocsByPropId.containsKey(ud.Proposal_Id__c)){
                userDocsByPropId.get(ud.Proposal_Id__c).add(Ud.Id);
                String attId = attIdsByPropId.get(ud.Proposal_Id__c);
                if(ud.attachments.size() > 0 ){
                    attId = attId +','+ud.attachments[0].Id;
                }
                attIdsByPropId.put(ud.Proposal_Id__c,attId);
            }else{
                List<String> docIds = new List<String>();
                docIds.add(Ud.Id);
                String attId = '';
                if(ud.attachments.size() > 0 ){
                    attId = ud.attachments[0].Id;
                }
                userDocsByPropId.put(ud.Proposal_Id__c,docIds);  
                attIdsByPropId.put(ud.Proposal_Id__c,attId);
            }
            //String attId = ud.attachments[0].Id;
        }
        system.debug('userDocsByPropId'+userDocsByPropId);
        system.debug('attIdsByPropId'+attIdsByPropId);
        
        
        for(Application_Proposal__c appProposalRec : contactsByProp.keyset()){
            system.debug('appProposalRec'+appProposalRec.Id);
            if(appProposalRec.RecordType.Name == 'Industrial Fellowship'){
                system.debug('contactsByProp.get(appProposalRec)'+contactsByProp.get(appProposalRec));
                if(contactsByProp.get(appProposalRec).size() > 0){
                    tempName = appProposalRec.Name+'_IF_2023'+ +'_'+contactsByProp.get(appProposalRec)[0].FirstName+'_'+contactsByProp.get(appProposalRec)[0].LastName;
                }
                
                CongaQuery = appProposalRec.IF_conga_Url__c;
                if(attIdsByPropId.get(appProposalRec.Id) != '' && attIdsByPropId.get(appProposalRec.Id) != null){
                    CongaQuery = CongaQuery.replace('AttachmentId=00P1y000003a34i','AttachmentId='+attIdsByPropId.get(appProposalRec.Id).removeEnd(','));    
                }else{
                    CongaQuery = CongaQuery.replace('AttachmentId=00P1y000003a34i','AttachmentId=');    
                }
                
                system.debug('IF CONGA'+CongaQuery);
            }else if(appProposalRec.RecordType.Name == 'PECFAR'){
                if(contactsByProp.get(appProposalRec).size() > 0){
                    if(contactsByProp.get(appProposalRec)[0].Account.BillingCountry == 'India'){
                        tempName = appProposalRec.Name+'_PECFAR_2023_'+contactsByProp.get(appProposalRec)[0].Firstname +'_'+contactsByProp.get(appProposalRec)[1].Firstname;
                    }
                }
                
                
                CongaQuery = appProposalRec.Pecfar_Conga_Url__c;
                if(attIdsByPropId.get(appProposalRec.Id) != '' && attIdsByPropId.get(appProposalRec.Id) != null){
                    system.debug('attIdsByPropId.get(appProposalRec.Id)'+attIdsByPropId.get(appProposalRec.Id));
                    CongaQuery = CongaQuery.replace('AttachmentId=00P1y000003a34i','AttachmentId='+attIdsByPropId.get(appProposalRec.Id).removeEnd(','));    
                }else{
                    CongaQuery = CongaQuery.replace('AttachmentId=00P1y000003a34i','AttachmentId=');    
                }
                //CongaQuery = CongaQuery.replace('AttachmentId=00P1y000003a34i','AttachmentId='+attIdsByPropId.get(appProposalRec.Id).removeEnd(',') );
                system.debug('PECFAR CONGA'+CongaQuery);
                
            }else if(appProposalRec.RecordType.Name == 'WISER'){
                if(contactsByProp.get(appProposalRec).size() > 0){
                    tempName = appProposalRec.Name+'_WISER_2023_'+contactsByProp.get(appProposalRec)[0].Firstname +'_'+contactsByProp.get(appProposalRec)[0].LastName;
                }
               
                CongaQuery = appProposalRec.Wiser_Conga_Url__c	;
                if(attIdsByPropId.get(appProposalRec.Id) != '' && attIdsByPropId.get(appProposalRec.Id) != null){
                    CongaQuery = CongaQuery.replace('AttachmentId=00P1y000003a34i','AttachmentId='+attIdsByPropId.get(appProposalRec.Id).removeEnd(',') );
                }else{
                    CongaQuery = CongaQuery.replace('AttachmentId=00P1y000003a34i','AttachmentId=');    
                }
                
                system.debug('Wiser_Conga_Url__c CONGA'+CongaQuery);
            }else if(appProposalRec.RecordType.Name == 'SING'){
                if(contactsByProp.get(appProposalRec).size() > 0){
                    tempName = appProposalRec.Name+'_SING_2023_'+contactsByProp.get(appProposalRec)[0].Firstname +'_'+contactsByProp.get(appProposalRec)[0].LastName;
                }
                
                //tempName = appProposalRec.Name+'_SING_2023_'+contactsByProp.get(appProposalRec)[0].Firstname +'_'+contactsByProp.get(appProposalRec)[0].LastName;
                CongaQuery = appProposalRec.Sing_Conga_url__c;
                if(attIdsByPropId.get(appProposalRec.Id) != '' && attIdsByPropId.get(appProposalRec.Id) != null){
                    CongaQuery = CongaQuery.replace('AttachmentId=00P1y000003a34i','AttachmentId='+attIdsByPropId.get(appProposalRec.Id).removeEnd(','));    
                }else{
                    CongaQuery = CongaQuery.replace('AttachmentId=00P1y000003a34i','AttachmentId=');    
                }
                //CongaQuery = CongaQuery.replace('AttachmentId=00P1y000003a34i','AttachmentId='+attIdsByPropId.get(appProposalRec.Id).removeEnd(',') );
                system.debug('SING CONGA'+CongaQuery);
            }  
            system.debug('CongaQuery'+CongaQuery);
            String TemplateId = CongaHelperToolLightning.generateReport(CongaQuery,tempName,null,null,null);
            system.debug('TemplateId'+TemplateId);
        }
    }
}