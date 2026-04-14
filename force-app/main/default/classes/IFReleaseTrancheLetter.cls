public with sharing class IFReleaseTrancheLetter {
    
    @InvocableMethod(label='IF Tranche Release' description='Send Tranche letter.' category='Application_Proposal__c')
    Public Static void ifTrancheLetter(List<String> proID){
        system.debug('proID--'+proID);
        String dsId = proID[0];
        Disbursement_Schedule__c ds = [select id,proposals__c,tranche__c from Disbursement_Schedule__c where id =: dsId];
        Application_Proposal__c propData = [Select id , RecordTypeId,RecordType.Name,IF_tranche__c,IF3RDTRANCHE__c, IF12THTRANCHE__c, IF11THTRANCHE__c, IF4THTRANCHE__c, IF5THTRANCHE__c, IF6THTRANCHE__c, IF7THTRANCHE__c, IF8THTRANCHE__c, IF9THTRANCHE__c, IF10THTRANCHE__c from Application_Proposal__c where id = : ds.proposals__c];
        system.debug('propData--'+propData);
        system.debug('propData.RecordType.Name--'+propData.RecordType.Name);
        list<contact> conList  =[select id,name,Industrial_Fellowship_Type__c from contact WHERE Proposals__c =:ds.proposals__c];
        system.debug('conList----'+conList);
        //Record type conditions added by Rutuja
        if(propData.RecordType.Name == 'Industrial Fellowship' ){
            if(ds.tranche__c == '2' ){
            GenerateCongaTemplatesUsingCS(propData.Id,'IF Tranche Letter',ds.id);
            }
            else if(ds.tranche__c == '3' ){
            GenerateCongaTemplatesUsingCS(propData.Id,'IF3RDTRANCHE',ds.id);
            }
            else if(ds.tranche__c == '4' ){
            GenerateCongaTemplatesUsingCS(propData.Id,'IF4THTRANCHE',ds.id);
            }
            else if(ds.tranche__c == '5' ){
            GenerateCongaTemplatesUsingCS(propData.Id,'IF5THTRANCHE',ds.id);
            }
            else if(ds.tranche__c == '6' ){
            GenerateCongaTemplatesUsingCS(propData.Id,'IF6THTRANCHE',ds.id);
            }
            else if(ds.tranche__c == '7' ){
            GenerateCongaTemplatesUsingCS(propData.Id,'IF7THTRANCHE',ds.id);
            }
            else if(ds.tranche__c == '8' ){
            GenerateCongaTemplatesUsingCS(propData.Id,'IF8THTRANCHE',ds.id);
            }
            else if(ds.tranche__c == '9' ){
            GenerateCongaTemplatesUsingCS(propData.Id,'IF9THTRANCHE',ds.id);
            }
            else if(ds.tranche__c == '10' ){
            GenerateCongaTemplatesUsingCS(propData.Id,'IF10THTRANCHE',ds.id);
            }
            else if(ds.tranche__c == '11' ){
            GenerateCongaTemplatesUsingCS(propData.Id,'IF11THTRANCHE',ds.id);
            }
            else if(ds.tranche__c == '12' ){
            GenerateCongaTemplatesUsingCS(propData.Id,'IF12THTRANCHE',ds.id);
            }
        }
        else if(propData.RecordType.Name == 'PECFAR'){
            GenerateCongaTemplatesUsingCS(propData.Id,'PECFAR Tranche Release',ds.id);
        }
    }

    Public Static void GenerateCongaTemplatesUsingCS(String recordID, String TempName , String ds_id){
        TemplateURLByName__c TempInfoRec=[select id,name,Object_Name__c,Formula_Field_Name__c from TemplateURLByName__c where Name =:TempName];
        String query='';
        String CongaQuery = '';
        String objectList = TempInfoRec.Object_Name__c;
        String fieldName =TempInfoRec.Formula_Field_Name__c+', Id,Name,RecordTypeId,yearly_Call__r.year__c,RecordType.Name,(Select Id, Firstname , Account.BillingCountry ,Lastname from contacts__r)';
        String condition='id=:recordID';
        query = 'SELECT '+ fieldName +' FROM ' + objectList + ' WHERE ' + condition;
        // query = 'SELECT '+ fieldName +' FROM ' + objectList;
        System.debug('query is '+ query );
        List<Application_Proposal__c> queryData = Database.query(query);
        system.debug('queryData--'+queryData);
        Disbursement_Schedule__c ds = [select id,proposals__c,tranche__c from Disbursement_Schedule__c where id =: ds_id];
        //-------------------------------------------------------------------------
        
         // Query contacts via Applicant_Proposal_Association__c junction object
        List<Contact> contactList = [
            SELECT Id, Firstname, Account.BillingCountry, Lastname 
            FROM Contact 
            WHERE Id IN (
                SELECT Contact__c 
                FROM Applicant_Proposal_Association__c 
                WHERE Proposals__c = :recordID
            )
        ];
        
        system.debug('contactList---:'+contactList);
        
        Application_Proposal__c propRec = new Application_Proposal__c();
        propRec = queryData[0];
        map<Id,List<Contact>> contactsByPropID = new map<Id,List<Contact>>();
        List<Contact> conLIst = new List<Contact>();
        conLIst.addAll(contactList);
        contactsByPropID.put(propRec.Id ,conLIst);
        //-------------------------------------------------------------------------- 
        
        String exCategoriesCustomLable  = Label.docCategoriesToBeExcluded;
        // String tempName = '';
        List<String> docCategoriesToBeExcluded =  exCategoriesCustomLable.split(',');
        SYSTEM.debug('docCategoriesToBeExcluded---'+docCategoriesToBeExcluded);
        system.debug('contactsByPropID'+contactsByPropID);
        
        List<String> UserDocumentIds = new List<String>();
        
        List<User_Document__c> UserDocList = [Select Id,Name from User_Document__c where Proposal_Id__c = :recordId AND Name NOT IN :docCategoriesToBeExcluded];
        
        for(User_Document__c ud : UserDocList){
            UserDocumentIds.add(ud.Id);
        }
        system.debug('UserDocumentIds'+UserDocumentIds);
        
        String attIds = '';
        for(String usd : UserDocumentIds){
            List<Attachment> attList = [Select id , name from Attachment where parentId = :usd order by CreatedDate  Desc Limit 1];
            if(attList.size() > 0){
                String attid = attList[0].Id; 
                attIds = attIds + attid  + ',';
            }
            
        }
        attIds = attIds.removeEnd(',');
        system.debug('Attachment Ids Are ' + attIds); 
        system.debug('contactsByPropID.get(propRec.Id)[0]'+contactsByPropID.get(propRec.Id));
        if(propRec.RecordType.Name == 'Industrial Fellowship'){
            tempName = propRec.Name+'_IF_'+propRec.yearly_Call__r.year__c+'_'+contactsByPropID.get(propRec.Id)[0].Firstname +'_'+contactsByPropID.get(propRec.Id)[0].LastName+'_Tranche-'+ds.tranche__c;
            CongaQuery = (String)propRec.get(TempInfoRec.Formula_Field_Name__c);
            CongaQuery = CongaQuery.replace('AttachmentId=00P1y000003a34i','AttachmentId='+attIds );
            system.debug('IF CONGA'+CongaQuery);
        }else if(propRec.RecordType.Name == 'PECFAR'){
            //german and indian logic included
            if(contactsByPropID.get(propRec.Id)[0].Account.BillingCountry == 'India'){
                system.debug('propRec------'+contactsByPropID.get(propRec.Id)[0].Account.BillingCountry);
                
                tempName = propRec.Name+'_PECFAR_'+propRec.yearly_Call__r.year__c+'_'+contactsByPropID.get(propRec.Id)[0].Firstname +'_'+contactsByPropID.get(propRec.Id)[1].Firstname+'_Tranche-'+ds.tranche__c;
            }
            else{
                 tempName = propRec.Name+'_PECFAR_'+propRec.yearly_Call__r.year__c+'_'+contactsByPropID.get(propRec.Id)[1].Firstname +'_'+contactsByPropID.get(propRec.Id)[0].Firstname+'_Tranche-'+ds.tranche__c;
            }
            
            CongaQuery = (String)propRec.get(TempInfoRec.Formula_Field_Name__c);
            system.debug('');
            CongaQuery = CongaQuery.replace('AttachmentId=00P1y000003a34i','AttachmentId='+attIds );
            system.debug('PECFAR CONGA'+CongaQuery);
            
        }else if(propRec.RecordType.Name == 'WISER'){
            tempName = propRec.Name+'_WISER_'+propRec.yearly_Call__r.year__c+'_'+contactsByPropID.get(propRec.Id)[0].Firstname +'_'+contactsByPropID.get(propRec.Id)[0].LastName+'_Tranche-'+ds.tranche__c;
            CongaQuery = (String)propRec.get(TempInfoRec.Formula_Field_Name__c);
            CongaQuery = CongaQuery.replace('AttachmentId=00P1y000003a34i','AttachmentId='+attIds );
            system.debug('Wiser_Conga_Url__c CONGA'+CongaQuery);
        }else if(propRec.RecordType.Name == 'SING'){
            tempName = propRec.Name+'_SING_'+propRec.yearly_Call__r.year__c+'_'+contactsByPropID.get(propRec.Id)[0].Firstname +'_'+contactsByPropID.get(propRec.Id)[0].LastName+'_Tranche-'+ds.tranche__c;
            system.debug('Attachment Ids Are ' + attIds); 
            CongaQuery = (String)propRec.get(TempInfoRec.Formula_Field_Name__c);
            CongaQuery = CongaQuery.replace('AttachmentId=00P1y000003a34i','AttachmentId='+attIds );
            system.debug('SING CONGA'+CongaQuery);
        }else{
            tempName = propRec.Name+'_'+propRec.yearly_Call__r.year__c+'_'+contactsByPropID.get(propRec.Id)[0].Firstname +'_'+contactsByPropID.get(propRec.Id)[0].LastName+'_Tranche-'+ds.tranche__c;
            system.debug('Attachment Ids Are ' + attIds); 
            CongaQuery = (String)propRec.get(TempInfoRec.Formula_Field_Name__c);
            CongaQuery = CongaQuery.replace('AttachmentId=00P1y000003a34i','AttachmentId='+attIds );
            system.debug('SING CONGA'+CongaQuery);
        }
        system.debug('tempName-----'+tempName);
        generateCongaTemplate(CongaQuery,tempName); 	
    }

    @future (callout=true)
    Public static void generateCongaTemplate(String var,String TemplateName){
        system.debug('var ::'+var);
        String TemplateId = CongaHelperToolLightning.generateReport(var,TemplateName,null,null,null);
        system.debug('TemplateId'+TemplateId);
    }
}