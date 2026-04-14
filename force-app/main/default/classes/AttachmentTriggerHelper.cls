public class AttachmentTriggerHelper {
    
    public static void updateAttachmentName(List<Attachment> NewAttList){
        system.debug('NewAttList'+NewAttList);
        List<String> parentIdList = new List<String>();
        
        for(Attachment at : NewAttList) {
            String sObjName = (at.ParentId).getSObjectType().getDescribe().getName();
            system.debug('sObjName'+sObjName);
            if( sObjName == 'User_Document__c'){
                parentIdList.add(at.ParentId);     
            }
        }
        
        List<User_Document__c> userDocumentList = [Select id , name , Proposal_Id__c , Propsal_Name__c , Contact__c ,(Select Id,Name from Attachments Order by createdDate Desc LIMIT 1 ) from User_Document__c where  ID IN :parentIdList ];
        
        for(User_Document__c ud : userDocumentList){
            ud.Attachment_Name__c = ud.Attachments[0].Name;
            
        }
        update userDocumentList;
        
    }
    
    public static void DeletePreviousAttach(List<Attachment> NewAttList){
        system.debug('NewAttList'+NewAttList);
        List<String> parentIdList = new List<String>();
        
        for(Attachment at : NewAttList) {
            String sObjName = (at.ParentId).getSObjectType().getDescribe().getName();
            system.debug('sObjName'+sObjName);
            if( sObjName == 'User_Document__c'){
                parentIdList.add(at.ParentId);     
            }
        }
        
        list<Attachment> attachList = [select id,name from Attachment where ParentId IN: parentIdList];
        system.debug('attachList'+attachList);
        if(attachList.size() > 0){
            delete attachList;    
        }
        
    }
    
    //This method is being used to push the uploaded attachments to the sharepoint to specific folders from user documents of contact..
    public static void pushAttachmentsToSPFromContactPECFAR(List<Attachment> NewAttList){
        Map<String,List<String>> userDocsByFolder = new map<String,List<String>>();
        Map<String,User_Document__c> userDocById = new map<String,User_Document__c>();
        Map<String,String> userDocIdByProposalName = new map<String,String>();
        Map<Id,String> attachmentRecByPath = new Map<Id,String>();
        Map<String,List<String>> FoldersBySubFolder = new Map<String,List<String>>();
        List<User_Document__c> userDocumentList = new  List<User_Document__c>();
        List<String> userDocumentIds = new List<String>();
        List<String> appProposalIds = new List<String>();
        List<String> dssProposalIds = new List<String>();
        List<String> attachmentIdList = new List<String>();
        String proposalName = ''; 
        String proposalTrancheName = ''; 
        String path = '';
        String folderName = '';
        String parentFolderName = '';
        
        //Mapping the Folders to the Main Folders using Master_Sharepoint_records.
        
        List<Sharepoint_Master__c>        masterAndChildRecords              = [SELECT Name , (Select Name from SharePoint_Child_Configs__r) FROM Sharepoint_Master__c where Name = 'PECFAR' and Is_campaign__c = false];
        List<SharePoint_Child_Config__c>  childAndSubChildRecords            = [SELECT Name , (Select Name from SharePoint_Subchild_Configs__r) FROM SharePoint_Child_Config__c where Master_Config_Name__c = 'PECFAR' and Sharepoint_Master_Configuration__r.Is_campaign__c = false];
        
        for(SharePoint_Child_Config__c childFolderRec : childAndSubChildRecords){
            List<String> Subfolders = new List<String>();
            for(SharePoint_Subchild_Configs__c relatedRec : childFolderRec.SharePoint_Subchild_Configs__r){
                Subfolders.add(relatedRec.Name);
            }
            FoldersBySubFolder.put(childFolderRec.Name,Subfolders);
        }
        system.debug('FoldersBySubFolder'+FoldersBySubFolder);
        //Mapping the Folders to the User Documents folders on sharePoint. 
        List<Folders_Mapping_For_Sharepoint__c> folderMappingData = [SELECT Name,Sub_Folders__c FROM Folders_Mapping_For_Sharepoint__c];
        
        for(Folders_Mapping_For_Sharepoint__c mappingRec : folderMappingData){
            System.debug('mappingRec==>'+mappingRec.Name);
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c);
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c.CONTAINS('Upload Undertaking'));
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c.replace('Upload Undertaking','Undertaking'));
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c);
            List<String> subfolderList = new List<string>();
            Set<String> subfolderSet = new Set<string>();
            subfolderSet.addAll(mappingRec.Sub_Folders__c.split(','));
            if(subfolderSet.contains('Upload Undertaking')){
                subfolderSet.remove('Upload Undertaking');
                subfolderSet.add('Undertaking');
            }
            if(subfolderSet.contains('Invitation Letter Form')){
                subfolderSet.remove('Invitation Letter Form');
                subfolderSet.add('Invitation Letter');
            }
            if(subfolderSet.contains('Upload Visit Letter')){
                subfolderSet.remove('Upload Visit Letter');
                subfolderSet.add('Visit Letter');
            }
            subfolderList.addAll(subfolderSet);
            if(mappingRec.Name == 'Release Notes as per Disbursement'){
                userDocsByFolder.put('Release Notes as per Disbursement Schedule',mappingRec.Sub_Folders__c.split(','));    
            }
            if(mappingRec.Sub_Folders__c.CONTAINS('Upload Undertaking') || mappingRec.Sub_Folders__c.CONTAINS('Invitation Letter Form') || mappingRec.Sub_Folders__c.CONTAINS('Upload Visit Letter')){
               
                userDocsByFolder.put(mappingRec.Name,subfolderList); 
            }
            
            else{
                userDocsByFolder.put(mappingRec.Name,mappingRec.Sub_Folders__c.split(','));
            }
        }
        system.debug('userDocsByFolder'+userDocsByFolder);
        for(Attachment at : NewAttList) {
            String sObjName = (at.ParentId).getSObjectType().getDescribe().getName();
            system.debug('sObjName'+sObjName);
            if( sObjName == 'User_Document__c'){
                userDocumentIds.add(at.ParentId);     
            }
            if(sObjName == 'Application_Proposal__c' ){
                appProposalIds.add(at.ParentId);
            }
            if(sObjName == 'Disbursement_Schedule__c'){
                dssProposalIds.add(at.ParentId);
            }
        }
        
        if(userDocumentIds.size() > 0){
            for(User_Document__c ud : [Select Id , name , Proposal_Id__c , Propsal_Name__c from User_Document__c where id IN : userDocumentIds]){
                userDocById.put(ud.Id , ud);
            }    
            userDocumentList = [Select id , name , Proposal_Id__c , Propsal_Name__c , Proposals__r.Name, Contact__c ,(Select Id,Name from Attachments Order by createdDate Desc LIMIT 1 ) from User_Document__c where  ID IN :userDocumentIds ];
            system.debug('userDocById'+userDocById);
            
            
            for(String folder : userDocsByFolder.keyset()){
                system.debug('Main Folder'+folder);
                for(String userDoc : userDocsByFolder.get(folder)){
                    system.debug('Second Folder '+userDoc);
                    for(User_Document__c udRec: userDocumentList){
                        system.debug('third Folder '+udRec.Name);
                        if(udRec.Name == 'Upload Undertaking'){
                            udRec.Name = 'Undertaking';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Invitation Letter Form'){
                            udRec.Name = 'Invitation Letter';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Upload Visit Letter'){
                            udRec.Name = 'Visit Letter';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Upload Bank Details'){
                            udRec.Name = 'Bank Account Details';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == userDoc){
                            system.debug('third Folder INNN1'+udRec.Name);
                            //attachmentIdList.add(udRec.Attachments[0].Id);
                            if(udRec.Propsal_Name__c != null){
                                proposalName = udRec.Propsal_Name__c;    
                            }else{
                                proposalName = udRec.Proposals__r.Name;    
                            }
                            system.debug('proposalName====>'+proposalName);
                            for(String mainFolder : FoldersBySubFolder.keySet()){
                                for(String folderValue : FoldersBySubFolder.get(mainFolder)){
                                    if(folder.equals(folderValue)){
                                        system.debug('Got it 🧑‍💻');
                                        parentFolderName = mainFolder;
                                    }else{
                                        parentFolderName = 'Application Document';
                                    }
                                    
                                }
                            }
                            parentFolderName = parentFolderName.replaceAll(' ','%20');
                            //commented by rutuja
                            //folderName = folder.replaceAll(' ','%20');
                            folderName = udRec.Name.replaceAll(' ','%20');
                            system.debug('parentFolderName=====>'+parentFolderName);
                            system.debug('folderName=====>'+folderName);
                            system.debug('proposalName===>'+proposalName);
                            //commented by rutuja
                            //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+parentFolderName+'/'+folderName;
                            //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+'Upload%20Undertaking';
                            
                            if(folderName == 'Signature' || folderName == 'Profile%20Pic' || folderName == 'Proof%20of%20Date%20of%20birth.' || 
                               folderName == 'Invitation%20letter%20from%20the%20host%20organization' || folderName == 'Proof%20of%20employment' || folderName == 'Educational%20Qualification%20certificates.'
                              || folderName == 'No%20Objection%20Certificate'){
                            path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Application%20Document'+'/'+'Attachments';
                            system.debug('path=>'+path);
                            }
                            if(folderName != 'Signature' && folderName != 'Profile%20Pic' && folderName != 'Proof%20of%20Date%20of%20birth.' && 
                               folderName != 'Invitation%20letter%20from%20the%20host%20organization' && folderName != 'Proof%20of%20employment' && folderName != 'Educational%20Qualification%20certificates.'
                              && folderName != 'No%20Objection%20Certificate'){
                            path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+folderName;
                            system.debug('path=>'+path);
                            }
                            attachmentRecByPath.put(udRec.Attachments[0].Id,path);
                        }
                    }
                }
            }
            system.debug('attachmentRecByPath'+attachmentRecByPath);
            list<Attachment> attachList = [select id,ParentId,name,Body from Attachment where ID IN: attachmentRecByPath.keySet()];
            system.debug('attachList size'+attachList.size());
            for(Attachment att : attachList){
                system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                String sObjName = (att.ParentId).getSObjectType().getDescribe().getName();
                system.debug('sObjName'+sObjName);
                if( sObjName == 'User_Document__c'){
                    User_Document__c ud = [select id,contact__r.Name,Name from User_Document__c where id =: att.ParentId order by createddate desc limit 1];
                    createFileUsingBlobFromAttachments(att.Body, ud.Name + ' - ' +  ud.contact__r.Name + ' - '+ att.Name,attachmentRecByPath.get(att.Id));
                }
                else{
                    createFileUsingBlobFromAttachments(att.Body,att.Name,attachmentRecByPath.get(att.Id));
                }
            }
        }
        
        system.debug('appProposalIds'+appProposalIds);
        if(appProposalIds.size() > 0){
            
            List<Application_Proposal__c> appProposalList = [Select id , name ,(Select Id,Name from Attachments Order by createdDate Desc LIMIT 1 ) from Application_Proposal__c where  ID IN :appProposalIds];
            proposalName = appProposalList[0].Name;
            
            for(Application_Proposal__c uds : appProposalList){
                attachmentIdList.add(uds.Attachments[0].Id);
            }
            system.debug('Running for the proposals..../');
            system.debug('proposalName'+proposalName);
            
            	//commented by rutuja
                //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/Application%20Document/Attachments';
                list<Attachment> attachList = [select id,name,Body from Attachment where ID IN: attachmentIdList];
                for(Attachment att : attachList){
                    if(att.Name.contains('Decision_letter')){
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+'Decision%20letter';
                        system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('award_less_than_two')){
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+'Award%20Letter';
                        system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(!att.Name.contains('Decision_letter') && !att.Name.contains('award_less_than_two') && att.Name.contains('_PECFAR_')){
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Application%20Document'+'/'+'Application%20documents';
                        system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                }
            
            
        }
        
        if(dssProposalIds.size() > 0){
            
            List<Disbursement_Schedule__c> appProposalList = [Select id , Tranche__c,name ,Proposals__r.Name,(Select Id,Name from Attachments Order by createdDate Desc LIMIT 1 ) from Disbursement_Schedule__c where  ID IN :dssProposalIds];
            proposalName = appProposalList[0].Proposals__r.Name;
            proposalTrancheName = 'Tranche ' + appProposalList[0].Tranche__c ;
            for(Disbursement_Schedule__c uds : appProposalList){
                attachmentIdList.add(uds.Attachments[0].Id);
            }
            system.debug('Running for the proposals..../');
            system.debug('proposalName'+proposalName);
            
            	//commented by rutuja
                //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/Application%20Document/Attachments';
                list<Attachment> attachList = [select id,name,Body from Attachment where ID IN: attachmentIdList];
                for(Attachment att : attachList){
                    if(att.Name.contains('Attendance Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Attendance%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('SE/UC Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'SE-UC%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,'SE-UC Report - '+ proposalTrancheName,path);
                    }
                }
            
            
        }
        
        
    }
    
    public static void pushAttachmentsToSPFromContactIF(List<Attachment> NewAttList){
        Map<String,List<String>> userDocsByFolder = new map<String,List<String>>();
        Map<String,User_Document__c> userDocById = new map<String,User_Document__c>();
        Map<String,String> userDocIdByProposalName = new map<String,String>();
        Map<Id,String> attachmentRecByPath = new Map<Id,String>();
        Map<String,List<String>> FoldersBySubFolder = new Map<String,List<String>>();
        List<User_Document__c> userDocumentList = new  List<User_Document__c>();
        List<String> userDocumentIds = new List<String>();
        List<String> appProposalIds = new List<String>();
        List<String> dssProposalIds = new List<String>();
        List<String> attachmentIdList = new List<String>();
        String proposalName = ''; 
        String proposalTrancheName = ''; 
        String path = '';
        String folderName = '';
        String parentFolderName = '';
        
        //Mapping the Folders to the Main Folders using Master_Sharepoint_records.
        
        List<Sharepoint_Master__c>        masterAndChildRecords              = [SELECT Name , (Select Name from SharePoint_Child_Configs__r) FROM Sharepoint_Master__c where Name = 'Industrial_Fellowships' and Is_campaign__c = false];
        List<SharePoint_Child_Config__c>  childAndSubChildRecords            = [SELECT Name , (Select Name from SharePoint_Subchild_Configs__r) FROM SharePoint_Child_Config__c where Master_Config_Name__c = 'Industrial_Fellowships' and Sharepoint_Master_Configuration__r.Is_campaign__c = false];
        
        for(SharePoint_Child_Config__c childFolderRec : childAndSubChildRecords){
            List<String> Subfolders = new List<String>();
            for(SharePoint_Subchild_Configs__c relatedRec : childFolderRec.SharePoint_Subchild_Configs__r){
                Subfolders.add(relatedRec.Name);
            }
            FoldersBySubFolder.put(childFolderRec.Name,Subfolders);
        }
        system.debug('FoldersBySubFolder'+FoldersBySubFolder);
        //Mapping the Folders to the User Documents folders on sharePoint. 
        List<Folders_Mapping_For_Sharepoint__c> folderMappingData = [SELECT Name,Sub_Folders__c FROM Folders_Mapping_For_Sharepoint__c];
        
        for(Folders_Mapping_For_Sharepoint__c mappingRec : folderMappingData){
            System.debug('mappingRec==>'+mappingRec.Name);
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c);
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c.CONTAINS('Upload Undertaking'));
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c.replace('Upload Undertaking','Undertaking'));
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c);
            List<String> subfolderList = new List<string>();
            Set<String> subfolderSet = new Set<string>();
            subfolderSet.addAll(mappingRec.Sub_Folders__c.split(','));
            if(subfolderSet.contains('Upload Undertaking')){
                subfolderSet.remove('Upload Undertaking');
                subfolderSet.add('Undertaking');
            }
            if(subfolderSet.contains('Invitation Letter Form')){
                subfolderSet.remove('Invitation Letter Form');
                subfolderSet.add('Invitation Letter');
            }
            if(subfolderSet.contains('Upload Visit Letter')){
                subfolderSet.remove('Upload Visit Letter');
                subfolderSet.add('Visit Letter');
            }
            subfolderList.addAll(subfolderSet);
            if(mappingRec.Name == 'Release Notes as per Disbursement'){
                userDocsByFolder.put('Release Notes as per Disbursement Schedule',mappingRec.Sub_Folders__c.split(','));    
            }
            if(mappingRec.Sub_Folders__c.CONTAINS('Upload Undertaking') || mappingRec.Sub_Folders__c.CONTAINS('Invitation Letter Form') || mappingRec.Sub_Folders__c.CONTAINS('Upload Visit Letter')){
               
                userDocsByFolder.put(mappingRec.Name,subfolderList); 
            }
            
            else{
                userDocsByFolder.put(mappingRec.Name,mappingRec.Sub_Folders__c.split(','));
            }
        }
        system.debug('userDocsByFolder'+userDocsByFolder);
        for(Attachment at : NewAttList) {
            String sObjName = (at.ParentId).getSObjectType().getDescribe().getName();
            system.debug('sObjName'+sObjName);
            if( sObjName == 'User_Document__c'){
                userDocumentIds.add(at.ParentId);     
            }
            if(sObjName == 'Application_Proposal__c' ){
                appProposalIds.add(at.ParentId);
            }
            if(sObjName == 'Disbursement_Schedule__c'){
                dssProposalIds.add(at.ParentId);
            }
        }
        
        if(userDocumentIds.size() > 0){
            for(User_Document__c ud : [Select Id , name , Proposal_Id__c , Propsal_Name__c from User_Document__c where id IN : userDocumentIds]){
                userDocById.put(ud.Id , ud);
            }    
            userDocumentList = [Select id , name , Proposal_Id__c , Propsal_Name__c , Proposals__r.Name, Contact__c ,(Select Id,Name from Attachments Order by createdDate Desc LIMIT 1 ) from User_Document__c where  ID IN :userDocumentIds ];
            system.debug('userDocById'+userDocById);
            
            
            for(String folder : userDocsByFolder.keyset()){
                system.debug('Main Folder'+folder);
                for(String userDoc : userDocsByFolder.get(folder)){
                    system.debug('Second Folder '+userDoc);
                    for(User_Document__c udRec: userDocumentList){
                        system.debug('third Folder '+udRec.Name);
                        if(udRec.Name == 'Upload Undertaking'){
                            udRec.Name = 'Undertaking';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Invitation Letter Form'){
                            udRec.Name = 'Invitation Letter';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Upload Visit Letter'){
                            udRec.Name = 'Visit Letter';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Upload Bank Details'){
                            udRec.Name = 'Bank Account Details';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Upload your Visa'){
                            udRec.Name = 'Visa Documents';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == userDoc){
                            system.debug('third Folder INNN1'+udRec.Name);
                            //attachmentIdList.add(udRec.Attachments[0].Id);
                            if(udRec.Propsal_Name__c != null){
                                proposalName = udRec.Propsal_Name__c;    
                            }else{
                                proposalName = udRec.Proposals__r.Name;    
                            }
                            system.debug('proposalName====>'+proposalName);
                            for(String mainFolder : FoldersBySubFolder.keySet()){
                                for(String folderValue : FoldersBySubFolder.get(mainFolder)){
                                    if(folder.equals(folderValue)){
                                        system.debug('Got it 🧑‍💻');
                                        parentFolderName = mainFolder;
                                    }else{
                                        parentFolderName = 'Application Document';
                                    }
                                    
                                }
                            }
                            parentFolderName = parentFolderName.replaceAll(' ','%20');
                            //commented by rutuja
                            //folderName = folder.replaceAll(' ','%20');
                            folderName = udRec.Name.replaceAll(' ','%20');
                            system.debug('parentFolderName=====>'+parentFolderName);
                            system.debug('folderName=====>'+folderName);
                            system.debug('proposalName===>'+proposalName);
                            //commented by rutuja
                            //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+parentFolderName+'/'+folderName;
                            //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+'Upload%20Undertaking';
                            
                            if(folderName == 'Signature' || folderName == 'Profile%20Picture' || folderName == 'Acceptance%20Letter' ||  folderName == 'proof%20of%20thesis%20submission'||
                               folderName == 'Recommendation%20Letter' || folderName == 'Proof%20of%20employment' || folderName == 'Permission%20Letter'
                              || folderName == 'Two%20(2)%20letters%20of%20reference' || folderName == 'Scan%20copy%20of%20the%20front%20page%20of%20current%20Passport-Aadhar%20card'){
                            path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Industrial_Fellowships/'+proposalName+'/'+'Application%20Document'+'/'+'Attachments';
                            system.debug('path=>'+path);
                            }
                            if(folderName != 'Signature' && folderName != 'Profile%20Picture' && folderName != 'Acceptance%20Letter' && folderName != 'proof%20of%20thesis%20submission' &&
                               folderName != 'Recommendation%20Letter' && folderName != 'Proof%20of%20employment' && folderName != 'Permission%20Letter'
                              && folderName != 'Two%20(2)%20letters%20of%20reference' && folderName != 'Scan%20copy%20of%20the%20front%20page%20of%20current%20Passport-Aadhar%20card'){
                            path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Industrial_Fellowships/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+folderName;
                            system.debug('path=>'+path);
                            }
                            attachmentRecByPath.put(udRec.Attachments[0].Id,path);
                        }
                    }
                }
            }
            system.debug('attachmentRecByPath'+attachmentRecByPath);
            list<Attachment> attachList = [select id,ParentId,name,Body from Attachment where ID IN: attachmentRecByPath.keySet()];
            system.debug('attachList size'+attachList.size());
            for(Attachment att : attachList){
                system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                String sObjName = (att.ParentId).getSObjectType().getDescribe().getName();
                system.debug('sObjName'+sObjName);
                if( sObjName == 'User_Document__c'){
                    User_Document__c ud = [select id,contact__r.Name,Name from User_Document__c where id =: att.ParentId order by createddate desc limit 1];
                    if(ud.contact__r.Name != NULL){
                        createFileUsingBlobFromAttachments(att.Body, ud.Name + ' - ' +  ud.contact__r.Name + ' - '+ att.Name,attachmentRecByPath.get(att.Id));
                    }
                    else{
                        createFileUsingBlobFromAttachments(att.Body, ud.Name + ' - ' + att.Name,attachmentRecByPath.get(att.Id));
                    }
                }
                else{
                    createFileUsingBlobFromAttachments(att.Body,att.Name,attachmentRecByPath.get(att.Id));
                }
            }
        }
        
        system.debug('appProposalIds'+appProposalIds);
        if(appProposalIds.size() > 0){
            
            List<Application_Proposal__c> appProposalList = [Select id , name ,(Select Id,Name from Attachments Order by createdDate Desc LIMIT 1 ) from Application_Proposal__c where  ID IN :appProposalIds];
            proposalName = appProposalList[0].Name;
            
            for(Application_Proposal__c uds : appProposalList){
                attachmentIdList.add(uds.Attachments[0].Id);
            }
            system.debug('Running for the proposals..../');
            system.debug('proposalName'+proposalName);
            
            	//commented by rutuja
                //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/Application%20Document/Attachments';
                list<Attachment> attachList = [select id,name,Body from Attachment where ID IN: attachmentIdList];
                for(Attachment att : attachList){
                    if(att.Name.contains('Decision_Letter')){
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Industrial_Fellowships/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+'Decision%20letter';
                        system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('AwardLetter')){
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Industrial_Fellowships/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+'Award%20Letter';
                        system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(!att.Name.contains('Decision_Letter') && !att.Name.contains('AwardLetter') && att.Name.contains('_IF_')){
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Industrial_Fellowships/'+proposalName+'/'+'Application%20Document'+'/'+'Application%20documents';
                        system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                }
            
            
        }
        
        if(dssProposalIds.size() > 0){
            
            List<Disbursement_Schedule__c> appProposalList = [Select id , Tranche__c,name ,Proposals__r.Name,(Select Id,Name from Attachments Order by createdDate Desc LIMIT 1 ) from Disbursement_Schedule__c where  ID IN :dssProposalIds];
            proposalName = appProposalList[0].Proposals__r.Name;
            proposalTrancheName = 'Tranche ' + appProposalList[0].Tranche__c ;
            for(Disbursement_Schedule__c uds : appProposalList){
                attachmentIdList.add(uds.Attachments[0].Id);
            }
            system.debug('Running for the proposals..../');
            system.debug('proposalName'+proposalName);
            
            	//commented by rutuja
                //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/Application%20Document/Attachments';
                list<Attachment> attachList = [select id,name,Body from Attachment where ID IN: attachmentIdList];
                for(Attachment att : attachList){
                    if(att.Name.contains('Attendance Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Industrial_Fellowships/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Attendance%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('SE/UC Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Industrial_Fellowships/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'SE-UC%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,'SE-UC Report - '+ proposalTrancheName,path);
                    }
                    if(att.Name.contains('Closure Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Industrial_Fellowships/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                }
            
            
        }
        
        
    }
    
    public static void pushAttachmentsToSPFromContactWISER(List<Attachment> NewAttList){
        Map<String,List<String>> userDocsByFolder = new map<String,List<String>>();
        Map<String,User_Document__c> userDocById = new map<String,User_Document__c>();
        Map<String,String> userDocIdByProposalName = new map<String,String>();
        Map<Id,String> attachmentRecByPath = new Map<Id,String>();
        Map<String,List<String>> FoldersBySubFolder = new Map<String,List<String>>();
        List<User_Document__c> userDocumentList = new  List<User_Document__c>();
        List<String> userDocumentIds = new List<String>();
        List<String> appProposalIds = new List<String>();
        List<String> dssProposalIds = new List<String>();
        List<String> attachmentIdList = new List<String>();
        String proposalName = ''; 
        String proposalTrancheName = ''; 
        String path = '';
        String folderName = '';
        String parentFolderName = '';
        
        //Mapping the Folders to the Main Folders using Master_Sharepoint_records.
        
        List<Sharepoint_Master__c>        masterAndChildRecords              = [SELECT Name , (Select Name from SharePoint_Child_Configs__r) FROM Sharepoint_Master__c where Name = 'WISER' and Is_campaign__c = false];
        List<SharePoint_Child_Config__c>  childAndSubChildRecords            = [SELECT Name , (Select Name from SharePoint_Subchild_Configs__r) FROM SharePoint_Child_Config__c where Master_Config_Name__c = 'WISER' and Sharepoint_Master_Configuration__r.Is_campaign__c = false];
        
        for(SharePoint_Child_Config__c childFolderRec : childAndSubChildRecords){
            List<String> Subfolders = new List<String>();
            for(SharePoint_Subchild_Configs__c relatedRec : childFolderRec.SharePoint_Subchild_Configs__r){
                Subfolders.add(relatedRec.Name);
            }
            FoldersBySubFolder.put(childFolderRec.Name,Subfolders);
        }
        system.debug('FoldersBySubFolder'+FoldersBySubFolder);
        //Mapping the Folders to the User Documents folders on sharePoint. 
        List<Folders_Mapping_For_Sharepoint__c> folderMappingData = [SELECT Name,Sub_Folders__c FROM Folders_Mapping_For_Sharepoint__c];
        
        for(Folders_Mapping_For_Sharepoint__c mappingRec : folderMappingData){
            System.debug('mappingRec==>'+mappingRec.Name);
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c);
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c.CONTAINS('Upload Undertaking'));
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c.replace('Upload Undertaking','Undertaking'));
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c);
            List<String> subfolderList = new List<string>();
            Set<String> subfolderSet = new Set<string>();
            subfolderSet.addAll(mappingRec.Sub_Folders__c.split(','));
            if(subfolderSet.contains('Upload Undertaking')){
                subfolderSet.remove('Upload Undertaking');
                subfolderSet.add('Undertaking');
            }
            if(subfolderSet.contains('Invitation Letter Form')){
                subfolderSet.remove('Invitation Letter Form');
                subfolderSet.add('Invitation Letter');
            }
            if(subfolderSet.contains('Upload Visit Letter')){
                subfolderSet.remove('Upload Visit Letter');
                subfolderSet.add('Visit Letter');
            }
            subfolderList.addAll(subfolderSet);
            if(mappingRec.Name == 'Release Notes as per Disbursement'){
                userDocsByFolder.put('Release Notes as per Disbursement Schedule',mappingRec.Sub_Folders__c.split(','));    
            }
            if(mappingRec.Sub_Folders__c.CONTAINS('Upload Undertaking') || mappingRec.Sub_Folders__c.CONTAINS('Invitation Letter Form') || mappingRec.Sub_Folders__c.CONTAINS('Upload Visit Letter')){
               
                userDocsByFolder.put(mappingRec.Name,subfolderList); 
            }
            
            else{
                userDocsByFolder.put(mappingRec.Name,mappingRec.Sub_Folders__c.split(','));
            }
        }
        system.debug('userDocsByFolder'+userDocsByFolder);
        for(Attachment at : NewAttList) {
            String sObjName = (at.ParentId).getSObjectType().getDescribe().getName();
            system.debug('sObjName'+sObjName);
            if( sObjName == 'User_Document__c'){
                userDocumentIds.add(at.ParentId);     
            }
            if(sObjName == 'Application_Proposal__c' ){
                appProposalIds.add(at.ParentId);
            }
            if(sObjName == 'Disbursement_Schedule__c'){
                dssProposalIds.add(at.ParentId);
            }
        }
        
        if(userDocumentIds.size() > 0){
            for(User_Document__c ud : [Select Id , name , Proposal_Id__c , Propsal_Name__c from User_Document__c where id IN : userDocumentIds]){
                userDocById.put(ud.Id , ud);
            }    
            userDocumentList = [Select id , name , Proposal_Id__c , Propsal_Name__c , Proposals__r.Name, Contact__c ,(Select Id,Name from Attachments Order by createdDate Desc LIMIT 1 ) from User_Document__c where  ID IN :userDocumentIds ];
            system.debug('userDocById'+userDocById);
            
            
            for(String folder : userDocsByFolder.keyset()){
                system.debug('Main Folder'+folder);
                for(String userDoc : userDocsByFolder.get(folder)){
                    system.debug('Second Folder '+userDoc);
                    for(User_Document__c udRec: userDocumentList){
                        system.debug('third Folder '+udRec.Name);
                        if(udRec.Name == 'Upload Undertaking'){
                            udRec.Name = 'Undertaking';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Invitation Letter Form'){
                            udRec.Name = 'Invitation Letter';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Upload Visit Letter'){
                            udRec.Name = 'Visit Letter';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Upload Bank Details' ){
                            udRec.Name = 'Bank Account Details';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Upload your Visa'){
                            udRec.Name = 'Visa Documents';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Security/Sensitivity Clearance Document'){
                            udRec.Name = 'Security-Sensitivity Clearance Document';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == userDoc){
                            system.debug('third Folder INNN1'+udRec.Name);
                            //attachmentIdList.add(udRec.Attachments[0].Id);
                            if(udRec.Propsal_Name__c != null){
                                proposalName = udRec.Propsal_Name__c;    
                            }else{
                                proposalName = udRec.Proposals__r.Name;    
                            }
                            system.debug('proposalName====>'+proposalName);
                            for(String mainFolder : FoldersBySubFolder.keySet()){
                                for(String folderValue : FoldersBySubFolder.get(mainFolder)){
                                    if(folder.equals(folderValue)){
                                        system.debug('Got it 🧑‍💻');
                                        parentFolderName = mainFolder;
                                    }else{
                                        parentFolderName = 'Application Document';
                                    }
                                    
                                }
                            }
                            parentFolderName = parentFolderName.replaceAll(' ','%20');
                            //commented by rutuja
                            //folderName = folder.replaceAll(' ','%20');
                            folderName = udRec.Name.replaceAll(' ','%20');
                            system.debug('parentFolderName=====>'+parentFolderName);
                            system.debug('folderName=====>'+folderName);
                            system.debug('proposalName===>'+proposalName);
                            //commented by rutuja
                            //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+parentFolderName+'/'+folderName;
                            //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+'Upload%20Undertaking';
                            
                            if(folderName == 'Signature' || folderName == 'Profile%20Picture' || folderName == 'Acceptance%20letter' || 
                               folderName == 'No%objection%20certificate' || folderName == 'Proof%20of%20employment' || folderName == 'Educational%20Qualification%20certificates.'
                              || folderName == 'No%20Objection%20Certificate'){
                            path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/WISER/'+proposalName+'/'+'Application%20Document'+'/'+'Attachments';
                            system.debug('path=>'+path);
                            }
                            if(folderName != 'Signature' && folderName != 'Profile%20Picture' && folderName != 'Acceptance%20letter' && 
                               folderName != 'No%objection%20certificate' && folderName != 'Proof%20of%20employment' && folderName != 'Educational%20Qualification%20certificates.'
                              && folderName != 'No%20Objection%20Certificate'){
                            path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/WISER/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+folderName;
                            system.debug('path=>'+path);
                            }
                            attachmentRecByPath.put(udRec.Attachments[0].Id,path);
                        }
                    }
                }
            }
            system.debug('attachmentRecByPath'+attachmentRecByPath);
            list<Attachment> attachList = [select id,ParentId,name,Body from Attachment where ID IN: attachmentRecByPath.keySet()];
            system.debug('attachList size'+attachList.size());
            for(Attachment att : attachList){
                system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                String sObjName = (att.ParentId).getSObjectType().getDescribe().getName();
                system.debug('sObjName'+sObjName);
                if( sObjName == 'User_Document__c'){
                    User_Document__c ud = [select id,contact__r.Name,Name from User_Document__c where id =: att.ParentId order by createddate desc limit 1];
                    if(ud.contact__r.Name != NULL){
                        createFileUsingBlobFromAttachments(att.Body, ud.Name + ' - ' +  ud.contact__r.Name + ' - '+ att.Name,attachmentRecByPath.get(att.Id));
                    }
                    else{
                        createFileUsingBlobFromAttachments(att.Body, ud.Name + ' - ' + att.Name,attachmentRecByPath.get(att.Id));
                    }
                }
                else{
                    createFileUsingBlobFromAttachments(att.Body,att.Name,attachmentRecByPath.get(att.Id));
                }
            }
        }
        
        system.debug('appProposalIds'+appProposalIds);
        if(appProposalIds.size() > 0){
            
            List<Application_Proposal__c> appProposalList = [Select id , name ,(Select Id,Name from Attachments Order by createdDate Desc LIMIT 1 ) from Application_Proposal__c where  ID IN :appProposalIds];
            proposalName = appProposalList[0].Name;
            
            for(Application_Proposal__c uds : appProposalList){
                attachmentIdList.add(uds.Attachments[0].Id);
            }
            system.debug('Running for the proposals..../');
            system.debug('proposalName'+proposalName);
            
            	//commented by rutuja
                //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/Application%20Document/Attachments';
                list<Attachment> attachList = [select id,name,Body from Attachment where ID IN: attachmentIdList];
                for(Attachment att : attachList){
                    if(att.Name.contains('Decision_Letter')){
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/WISER/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+'Decision%20letter';
                        system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('Award_Letter')){
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/WISER/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+'Award%20Letter';
                        system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(!att.Name.contains('Decision_Letter') && !att.Name.contains('Award_Letter') && att.Name.contains('_WISER_')){
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/WISER/'+proposalName+'/'+'Application%20Document'+'/'+'Application%20documents';
                        system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                }
            
            
        }
        
        if(dssProposalIds.size() > 0){
            
            List<Disbursement_Schedule__c> appProposalList = [Select id , Tranche__c,name ,Proposals__r.Name,(Select Id,Name from Attachments Order by createdDate Desc LIMIT 1 ) from Disbursement_Schedule__c where  ID IN :dssProposalIds];
            proposalName = appProposalList[0].Proposals__r.Name;
            proposalTrancheName = 'Tranche ' + appProposalList[0].Tranche__c ;
            for(Disbursement_Schedule__c uds : appProposalList){
                attachmentIdList.add(uds.Attachments[0].Id);
            }
            system.debug('Running for the proposals..../');
            system.debug('proposalName'+proposalName);
            
            	//commented by rutuja
                //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/Application%20Document/Attachments';
                list<Attachment> attachList = [select id,name,Body from Attachment where ID IN: attachmentIdList];
                for(Attachment att : attachList){
                    if(att.Name.contains('Attendance Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/WISER/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Attendance%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('APR Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/WISER/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'APR%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('KPI Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/WISER/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'KPI%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('Visit Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/WISER/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Visit%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('SE/UC Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/WISER/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'SE-UC%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,'SE-UC Report - '+ proposalTrancheName,path);
                    }
                }
            
            
        }
        
        
    }
   
    public static void pushAttachmentsToSPFromContactSING(List<Attachment> NewAttList){
        Map<String,List<String>> userDocsByFolder = new map<String,List<String>>();
        Map<String,User_Document__c> userDocById = new map<String,User_Document__c>();
        Map<String,String> userDocIdByProposalName = new map<String,String>();
        Map<Id,String> attachmentRecByPath = new Map<Id,String>();
        Map<String,List<String>> FoldersBySubFolder = new Map<String,List<String>>();
        List<User_Document__c> userDocumentList = new  List<User_Document__c>();
        List<String> userDocumentIds = new List<String>();
        List<String> appProposalIds = new List<String>();
        List<String> dssProposalIds = new List<String>();
        List<String> attachmentIdList = new List<String>();
        String proposalName = ''; 
        String proposalTrancheName = ''; 
        String path = '';
        String folderName = '';
        String parentFolderName = '';
        
        //Mapping the Folders to the Main Folders using Master_Sharepoint_records.
        
        List<Sharepoint_Master__c>        masterAndChildRecords              = [SELECT Name , (Select Name from SharePoint_Child_Configs__r) FROM Sharepoint_Master__c where Name = 'SING' and Is_campaign__c = false];
        List<SharePoint_Child_Config__c>  childAndSubChildRecords            = [SELECT Name , (Select Name from SharePoint_Subchild_Configs__r) FROM SharePoint_Child_Config__c where Master_Config_Name__c = 'SING' and Sharepoint_Master_Configuration__r.Is_campaign__c = false];
        
        for(SharePoint_Child_Config__c childFolderRec : childAndSubChildRecords){
            List<String> Subfolders = new List<String>();
            for(SharePoint_Subchild_Configs__c relatedRec : childFolderRec.SharePoint_Subchild_Configs__r){
                Subfolders.add(relatedRec.Name);
            }
            FoldersBySubFolder.put(childFolderRec.Name,Subfolders);
        }
        system.debug('FoldersBySubFolder'+FoldersBySubFolder);
        //Mapping the Folders to the User Documents folders on sharePoint. 
        List<Folders_Mapping_For_Sharepoint__c> folderMappingData = [SELECT Name,Sub_Folders__c FROM Folders_Mapping_For_Sharepoint__c];
        
        for(Folders_Mapping_For_Sharepoint__c mappingRec : folderMappingData){
            System.debug('mappingRec==>'+mappingRec.Name);
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c);
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c.CONTAINS('Upload Undertaking'));
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c.replace('Upload Undertaking','Undertaking'));
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c);
            List<String> subfolderList = new List<string>();
            Set<String> subfolderSet = new Set<string>();
            subfolderSet.addAll(mappingRec.Sub_Folders__c.split(','));
            if(subfolderSet.contains('Upload Undertaking')){
                subfolderSet.remove('Upload Undertaking');
                subfolderSet.add('Undertaking');
            }
            if(subfolderSet.contains('Invitation Letter Form')){
                subfolderSet.remove('Invitation Letter Form');
                subfolderSet.add('Invitation Letter');
            }
            if(subfolderSet.contains('Upload Visit Letter')){
                subfolderSet.remove('Upload Visit Letter');
                subfolderSet.add('Visit Letter');
            }
            subfolderList.addAll(subfolderSet);
            if(mappingRec.Name == 'Release Notes as per Disbursement'){
                userDocsByFolder.put('Release Notes as per Disbursement Schedule',mappingRec.Sub_Folders__c.split(','));    
            }
            if(mappingRec.Sub_Folders__c.CONTAINS('Upload Undertaking') || mappingRec.Sub_Folders__c.CONTAINS('Invitation Letter Form') || mappingRec.Sub_Folders__c.CONTAINS('Upload Visit Letter')){
               
                userDocsByFolder.put(mappingRec.Name,subfolderList); 
            }
            
            else{
                userDocsByFolder.put(mappingRec.Name,mappingRec.Sub_Folders__c.split(','));
            }
        }
        system.debug('userDocsByFolder'+userDocsByFolder);
        for(Attachment at : NewAttList) {
            String sObjName = (at.ParentId).getSObjectType().getDescribe().getName();
            system.debug('sObjName'+sObjName);
            if( sObjName == 'User_Document__c'){
                userDocumentIds.add(at.ParentId);     
            }
            if(sObjName == 'Application_Proposal__c' ){
                appProposalIds.add(at.ParentId);
            }
            if(sObjName == 'Disbursement_Schedule__c'){
                dssProposalIds.add(at.ParentId);
            }
        }
        
        if(userDocumentIds.size() > 0){
            for(User_Document__c ud : [Select Id , name , Proposal_Id__c , Propsal_Name__c from User_Document__c where id IN : userDocumentIds]){
                userDocById.put(ud.Id , ud);
            }    
            userDocumentList = [Select id , name , Proposal_Id__c , Propsal_Name__c , Proposals__r.Name, Contact__c ,(Select Id,Name from Attachments Order by createdDate Desc LIMIT 1 ) from User_Document__c where  ID IN :userDocumentIds ];
            system.debug('userDocById'+userDocById);
            
            
            for(String folder : userDocsByFolder.keyset()){
                system.debug('Main Folder'+folder);
                for(String userDoc : userDocsByFolder.get(folder)){
                    system.debug('Second Folder '+userDoc);
                    for(User_Document__c udRec: userDocumentList){
                        system.debug('third Folder '+udRec.Name);
                        if(udRec.Name == 'Upload Undertaking'){
                            udRec.Name = 'Undertaking';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Invitation Letter Form'){
                            udRec.Name = 'Invitation Letter';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Upload Visit Letter'){
                            udRec.Name = 'Visit Letter';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Upload Bank Details' ){
                            udRec.Name = 'Bank Account Details';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Upload your Visa'){
                            udRec.Name = 'Visa Documents';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Security/Sensitivity Clearance Document'){
                            udRec.Name = 'Security-Sensitivity Clearance Document';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == userDoc){
                            system.debug('third Folder INNN1'+udRec.Name);
                            //attachmentIdList.add(udRec.Attachments[0].Id);
                            if(udRec.Propsal_Name__c != null){
                                proposalName = udRec.Propsal_Name__c;    
                            }else{
                                proposalName = udRec.Proposals__r.Name;    
                            }
                            system.debug('proposalName====>'+proposalName);
                            for(String mainFolder : FoldersBySubFolder.keySet()){
                                for(String folderValue : FoldersBySubFolder.get(mainFolder)){
                                    if(folder.equals(folderValue)){
                                        system.debug('Got it 🧑‍💻');
                                        parentFolderName = mainFolder;
                                    }else{
                                        parentFolderName = 'Application Document';
                                    }
                                    
                                }
                            }
                            parentFolderName = parentFolderName.replaceAll(' ','%20');
                            //commented by rutuja
                            //folderName = folder.replaceAll(' ','%20');
                            folderName = udRec.Name.replaceAll(' ','%20');
                            system.debug('parentFolderName=====>'+parentFolderName);
                            system.debug('folderName=====>'+folderName);
                            system.debug('proposalName===>'+proposalName);
                            //commented by rutuja
                            //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+parentFolderName+'/'+folderName;
                            //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+'Upload%20Undertaking';
                            
                            if(folderName == 'Signature' || folderName == 'Profile%20Picture' || folderName == 'No%20Objection%20Certificate%20from%20the%20Parent%20Insitution' || 
                               folderName == 'Consent%20from%20the%20parent%20organisation%20(max%20500%20KB)' || folderName == 'Signature%20(date)%20of%20the%20applicant%20Upload%20in%20jpg-jpeg%20format' || 
                               folderName == 'Signature%20of%20the%20Head%20of%20Organization%20(signature,%20date%20and%20seal)'
                              || folderName == 'Supporting%20documents%20in%20favour%20of%20your%20application%20(max%2010%20MB)'){
                                  
                            path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/SING/'+proposalName+'/'+'Application%20Document'+'/'+'Attachments';
                            system.debug('path=>'+path);
                            }
                            if(folderName != 'Signature' && folderName != 'Profile%20Picture' && folderName != 'No%20Objection%20Certificate%20from%20the%20Parent%20Insitution' && 
                               folderName != 'Consent%20from%20the%20parent%20organisation%20(max%20500%20KB)' && folderName != 'Signature%20(date)%20of%20the%20applicant%20Upload%20in%20jpg-jpeg%20format'&& 
                               folderName != 'Signature%20of%20the%20Head%20of%20Organization%20(signature,%20date%20and%20seal)'
                              && folderName != 'Supporting%20documents%20in%20favour%20of%20your%20application%20(max%2010%20MB)'){
                            path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/SING/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+folderName;
                            system.debug('path=>'+path);
                            }
                            attachmentRecByPath.put(udRec.Attachments[0].Id,path);
                        }
                    }
                }
            }
            system.debug('attachmentRecByPath'+attachmentRecByPath);
            list<Attachment> attachList = [select id,ParentId,name,Body from Attachment where ID IN: attachmentRecByPath.keySet()];
            system.debug('attachList size'+attachList.size());
            for(Attachment att : attachList){
                system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                String sObjName = (att.ParentId).getSObjectType().getDescribe().getName();
                system.debug('sObjName'+sObjName);
                if( sObjName == 'User_Document__c'){
                    User_Document__c ud = [select id,contact__r.Name,Name from User_Document__c where id =: att.ParentId order by createddate desc limit 1];
                    if(ud.contact__r.Name != NULL){
                        createFileUsingBlobFromAttachments(att.Body, ud.Name + ' - ' +  ud.contact__r.Name + ' - '+ att.Name,attachmentRecByPath.get(att.Id));
                    }
                    else{
                        createFileUsingBlobFromAttachments(att.Body, ud.Name + ' - ' + att.Name,attachmentRecByPath.get(att.Id));
                    }
                }
                else{
                    createFileUsingBlobFromAttachments(att.Body,att.Name,attachmentRecByPath.get(att.Id));
                }
            }
        }
        
        system.debug('appProposalIds'+appProposalIds);
        if(appProposalIds.size() > 0){
            
            List<Application_Proposal__c> appProposalList = [Select id , name ,(Select Id,Name from Attachments Order by createdDate Desc LIMIT 1 ) from Application_Proposal__c where  ID IN :appProposalIds];
            proposalName = appProposalList[0].Name;
            
            for(Application_Proposal__c uds : appProposalList){
                attachmentIdList.add(uds.Attachments[0].Id);
            }
            system.debug('Running for the proposals..../');
            system.debug('proposalName'+proposalName);
            
            	//commented by rutuja
                //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/Application%20Document/Attachments';
                list<Attachment> attachList = [select id,name,Body from Attachment where ID IN: attachmentIdList];
                for(Attachment att : attachList){
                    if(att.Name.contains('Decision_Letter')){
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/SING/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+'Decision%20letter';
                        system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('Office')){
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/SING/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+'Office%20Note';
                        system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('Award_Letter')){
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/SING/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+'Award%20Letter';
                        system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(!att.Name.contains('Decision_Letter') && !att.Name.contains('Award_Letter') && att.Name.contains('_SING_')){
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/SING/'+proposalName+'/'+'Application%20Document'+'/'+'Application%20documents';
                        system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                }
            
            
        }
        
        if(dssProposalIds.size() > 0){
            
            List<Disbursement_Schedule__c> appProposalList = [Select id , Tranche__c,name ,Proposals__r.Name,(Select Id,Name from Attachments Order by createdDate Desc LIMIT 1 ) from Disbursement_Schedule__c where  ID IN :dssProposalIds];
            proposalName = appProposalList[0].Proposals__r.Name;
            proposalTrancheName = 'Tranche ' + appProposalList[0].Tranche__c ;
            for(Disbursement_Schedule__c uds : appProposalList){
                attachmentIdList.add(uds.Attachments[0].Id);
            }
            system.debug('Running for the proposals..../');
            system.debug('proposalName'+proposalName);
            
            	//commented by rutuja
                //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/Application%20Document/Attachments';
                list<Attachment> attachList = [select id,name,Body from Attachment where ID IN: attachmentIdList];
                for(Attachment att : attachList){
                    if(att.Name.contains('Attendance Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/SING/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Attendance%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('APR Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/SING/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'APR%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('KPI Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/SING/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'KPI%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('Visit Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/SING/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Visit%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('SE/UC Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/SING/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'SE-UC%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,'SE-UC Report - '+ proposalTrancheName,path);
                    }
                }
            
            
        }
        
        
    }
   
    public static void pushAttachmentsToSPFromContactWORKSHOP(List<Attachment> NewAttList){
        Map<String,List<String>> userDocsByFolder = new map<String,List<String>>();
        Map<String,User_Document__c> userDocById = new map<String,User_Document__c>();
        Map<String,String> userDocIdByProposalName = new map<String,String>();
        Map<Id,String> attachmentRecByPath = new Map<Id,String>();
        Map<String,List<String>> FoldersBySubFolder = new Map<String,List<String>>();
        List<User_Document__c> userDocumentList = new  List<User_Document__c>();
        List<String> userDocumentIds = new List<String>();
        List<String> appProposalIds = new List<String>();
        List<String> dssProposalIds = new List<String>();
        List<String> attachmentIdList = new List<String>();
        String proposalName = ''; 
        String proposalTrancheName = ''; 
        String path = '';
        String folderName = '';
        String parentFolderName = '';
        
        //Mapping the Folders to the Main Folders using Master_Sharepoint_records.
        
        List<Sharepoint_Master__c>        masterAndChildRecords              = [SELECT Name , (Select Name from SharePoint_Child_Configs__r) FROM Sharepoint_Master__c where Name = 'Workshop' and Is_campaign__c = false];
        List<SharePoint_Child_Config__c>  childAndSubChildRecords            = [SELECT Name , (Select Name from SharePoint_Subchild_Configs__r) FROM SharePoint_Child_Config__c where Master_Config_Name__c = 'Workshop' and Sharepoint_Master_Configuration__r.Is_campaign__c = false];
        
        for(SharePoint_Child_Config__c childFolderRec : childAndSubChildRecords){
            List<String> Subfolders = new List<String>();
            for(SharePoint_Subchild_Configs__c relatedRec : childFolderRec.SharePoint_Subchild_Configs__r){
                Subfolders.add(relatedRec.Name);
            }
            FoldersBySubFolder.put(childFolderRec.Name,Subfolders);
        }
        system.debug('FoldersBySubFolder'+FoldersBySubFolder);
        //Mapping the Folders to the User Documents folders on sharePoint. 
        List<Folders_Mapping_For_Sharepoint__c> folderMappingData = [SELECT Name,Sub_Folders__c FROM Folders_Mapping_For_Sharepoint__c];
        
        for(Folders_Mapping_For_Sharepoint__c mappingRec : folderMappingData){
            System.debug('mappingRec==>'+mappingRec.Name);
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c);
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c.CONTAINS('Upload Undertaking'));
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c.replace('Upload Undertaking','Undertaking'));
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c);
            List<String> subfolderList = new List<string>();
            Set<String> subfolderSet = new Set<string>();
            subfolderSet.addAll(mappingRec.Sub_Folders__c.split(','));
            if(subfolderSet.contains('Upload Undertaking')){
                subfolderSet.remove('Upload Undertaking');
                subfolderSet.add('Undertaking');
            }
            if(subfolderSet.contains('Invitation Letter Form')){
                subfolderSet.remove('Invitation Letter Form');
                subfolderSet.add('Invitation Letter');
            }
            if(subfolderSet.contains('Upload Visit Letter')){
                subfolderSet.remove('Upload Visit Letter');
                subfolderSet.add('Visit Letter');
            }
            subfolderList.addAll(subfolderSet);
            if(mappingRec.Name == 'Release Notes as per Disbursement'){
                userDocsByFolder.put('Release Notes as per Disbursement Schedule',mappingRec.Sub_Folders__c.split(','));    
            }
            if(mappingRec.Sub_Folders__c.CONTAINS('Upload Undertaking') || mappingRec.Sub_Folders__c.CONTAINS('Invitation Letter Form') || mappingRec.Sub_Folders__c.CONTAINS('Upload Visit Letter')){
               
                userDocsByFolder.put(mappingRec.Name,subfolderList); 
            }
            
            else{
                userDocsByFolder.put(mappingRec.Name,mappingRec.Sub_Folders__c.split(','));
            }
        }
        system.debug('userDocsByFolder'+userDocsByFolder);
        for(Attachment at : NewAttList) {
            String sObjName = (at.ParentId).getSObjectType().getDescribe().getName();
            system.debug('sObjName'+sObjName);
            if( sObjName == 'User_Document__c'){
                userDocumentIds.add(at.ParentId);     
            }
            if(sObjName == 'Application_Proposal__c' ){
                appProposalIds.add(at.ParentId);
            }
            if(sObjName == 'Disbursement_Schedule__c'){
                dssProposalIds.add(at.ParentId);
            }
        }
        
        if(userDocumentIds.size() > 0){
            for(User_Document__c ud : [Select Id , name , Proposal_Id__c , Propsal_Name__c from User_Document__c where id IN : userDocumentIds]){
                userDocById.put(ud.Id , ud);
            }    
            userDocumentList = [Select id , name , Proposal_Id__c , Propsal_Name__c , Proposals__r.Name, Contact__c ,(Select Id,Name from Attachments Order by createdDate Desc LIMIT 1 ) from User_Document__c where  ID IN :userDocumentIds ];
            system.debug('userDocById'+userDocById);
            
            
            for(String folder : userDocsByFolder.keyset()){
                system.debug('Main Folder'+folder);
                for(String userDoc : userDocsByFolder.get(folder)){
                    system.debug('Second Folder '+userDoc);
                    for(User_Document__c udRec: userDocumentList){
                        system.debug('third Folder '+udRec.Name);
                        if(udRec.Name == 'Upload Undertaking'){
                            udRec.Name = 'Undertaking';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Invitation Letter Form'){
                            udRec.Name = 'Invitation Letter';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Upload Visit Letter'){
                            udRec.Name = 'Visit Letter';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Upload Bank Details' ){
                            udRec.Name = 'Bank Account Details';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Upload your Visa'){
                            udRec.Name = 'Visa Documents';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Security/Sensitivity Clearance Document'){
                            udRec.Name = 'Security-Sensitivity Clearance Document';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == userDoc){
                            system.debug('third Folder INNN1'+udRec.Name);
                            //attachmentIdList.add(udRec.Attachments[0].Id);
                            if(udRec.Propsal_Name__c != null){
                                proposalName = udRec.Propsal_Name__c;    
                            }else{
                                proposalName = udRec.Proposals__r.Name;    
                            }
                            system.debug('proposalName====>'+proposalName);
                            for(String mainFolder : FoldersBySubFolder.keySet()){
                                for(String folderValue : FoldersBySubFolder.get(mainFolder)){
                                    if(folder.equals(folderValue)){
                                        system.debug('Got it 🧑‍💻');
                                        parentFolderName = mainFolder;
                                    }else{
                                        parentFolderName = 'Application Document';
                                    }
                                    
                                }
                            }
                            parentFolderName = parentFolderName.replaceAll(' ','%20');
                            //commented by rutuja
                            //folderName = folder.replaceAll(' ','%20');
                            folderName = udRec.Name.replaceAll(' ','%20');
                            system.debug('parentFolderName=====>'+parentFolderName);
                            system.debug('folderName=====>'+folderName);
                            system.debug('proposalName===>'+proposalName);
                            //commented by rutuja
                            //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+parentFolderName+'/'+folderName;
                            //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+'Upload%20Undertaking';
                            
                            if(folderName == 'Coordinator%201%20Signature' || folderName == 'Coordinator%202%20Signature' || folderName == 'Meeting%20Agenda' ){
                                  
                            path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Workshop/'+proposalName+'/'+'Application%20Document'+'/'+'Attachments';
                            system.debug('path=>'+path);
                            }
                            if(folderName != 'Coordinator%201%20Signature' && folderName != 'Coordinator%202%20Signature' && folderName != 'Meeting%20Agenda' ){
                            path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Workshop/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+folderName;
                            system.debug('path=>'+path);
                            }
                            attachmentRecByPath.put(udRec.Attachments[0].Id,path);
                        }
                    }
                }
            }
            system.debug('attachmentRecByPath'+attachmentRecByPath);
            list<Attachment> attachList = [select id,ParentId,name,Body from Attachment where ID IN: attachmentRecByPath.keySet()];
            system.debug('attachList size'+attachList.size());
            for(Attachment att : attachList){
                system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                String sObjName = (att.ParentId).getSObjectType().getDescribe().getName();
                system.debug('sObjName'+sObjName);
                if( sObjName == 'User_Document__c'){
                    User_Document__c ud = [select id,contact__r.Name,Name from User_Document__c where id =: att.ParentId order by createddate desc limit 1];
                    if(ud.contact__r.Name != NULL){
                        createFileUsingBlobFromAttachments(att.Body, ud.Name + ' - ' +  ud.contact__r.Name + ' - '+ att.Name,attachmentRecByPath.get(att.Id));
                    }
                    else{
                        createFileUsingBlobFromAttachments(att.Body, ud.Name + ' - ' + att.Name,attachmentRecByPath.get(att.Id));
                    }
                }
                else{
                    createFileUsingBlobFromAttachments(att.Body,att.Name,attachmentRecByPath.get(att.Id));
                }
            }
        }
        
        system.debug('appProposalIds'+appProposalIds);
        if(appProposalIds.size() > 0){
            
            List<Application_Proposal__c> appProposalList = [Select id , name ,(Select Id,Name from Attachments Order by createdDate Desc LIMIT 1 ) from Application_Proposal__c where  ID IN :appProposalIds];
            proposalName = appProposalList[0].Name;
            
            for(Application_Proposal__c uds : appProposalList){
                attachmentIdList.add(uds.Attachments[0].Id);
            }
            system.debug('Running for the proposals..../');
            system.debug('proposalName'+proposalName);
            
            	//commented by rutuja
                //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/Application%20Document/Attachments';
                list<Attachment> attachList = [select id,name,Body from Attachment where ID IN: attachmentIdList];
                for(Attachment att : attachList){
                    if(att.Name.contains('_workshopIndian_sanction') || att.Name.contains('_workshopGerman_sanction')){
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Workshop/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+'Award%20Letter';
                        system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    
                    if(!att.Name.contains('_workshopIndian_sanction') && !att.Name.contains('_workshopGerman_sanction') && att.Name.contains('_WORKSHOP_')){
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Workshop/'+proposalName+'/'+'Application%20Document'+'/'+'Application%20documents';
                        system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                }
            
            
        }
        
        if(dssProposalIds.size() > 0){
            
            List<Disbursement_Schedule__c> appProposalList = [Select id , Tranche__c,name ,Proposals__r.Name,(Select Id,Name from Attachments Order by createdDate Desc LIMIT 1 ) from Disbursement_Schedule__c where  ID IN :dssProposalIds];
            proposalName = appProposalList[0].Proposals__r.Name;
            proposalTrancheName = 'Tranche ' + appProposalList[0].Tranche__c ;
            for(Disbursement_Schedule__c uds : appProposalList){
                attachmentIdList.add(uds.Attachments[0].Id);
            }
            system.debug('Running for the proposals..../');
            system.debug('proposalName'+proposalName);
            
            	//commented by rutuja
                //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/Application%20Document/Attachments';
                list<Attachment> attachList = [select id,name,Body from Attachment where ID IN: attachmentIdList];
                for(Attachment att : attachList){
                    if(att.Name.contains('Attendance Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Workshop/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Attendance%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('WORKSHOP Final Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Workshop/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'WORKSHOP%20Final%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('WORKSHOP Brief Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Workshop/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'WORKSHOP%20Brief%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('Closure Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Workshop/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('KPI Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Workshop/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'KPI%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('Visit Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Workshop/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Visit%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('SE/UC Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Workshop/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'SE-UC%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,'SE-UC Report - '+ proposalTrancheName,path);
                    }
                }
            
            
        }
        
        
    }
   
    public static void pushAttachmentsToSPFromContactConnectPlus(List<Attachment> NewAttList){
        Map<String,List<String>> userDocsByFolder = new map<String,List<String>>();
        Map<String,User_Document__c> userDocById = new map<String,User_Document__c>();
        Map<String,String> userDocIdByProposalName = new map<String,String>();
        Map<Id,String> attachmentRecByPath = new Map<Id,String>();
        Map<String,List<String>> FoldersBySubFolder = new Map<String,List<String>>();
        List<User_Document__c> userDocumentList = new  List<User_Document__c>();
        List<String> userDocumentIds = new List<String>();
        List<String> appProposalIds = new List<String>();
        List<String> dssProposalIds = new List<String>();
        List<String> attachmentIdList = new List<String>();
        String proposalName = ''; 
        String proposalTrancheName = ''; 
        String path = '';
        String folderName = '';
        String parentFolderName = '';
        
        //Mapping the Folders to the Main Folders using Master_Sharepoint_records.
        
        List<Sharepoint_Master__c>        masterAndChildRecords              = [SELECT Name , (Select Name from SharePoint_Child_Configs__r) FROM Sharepoint_Master__c where Name = 'Connect_Plus' and Is_campaign__c = false];
        List<SharePoint_Child_Config__c>  childAndSubChildRecords            = [SELECT Name , (Select Name from SharePoint_Subchild_Configs__r) FROM SharePoint_Child_Config__c where Master_Config_Name__c = 'Connect_Plus' and Sharepoint_Master_Configuration__r.Is_campaign__c = false];
        
        for(SharePoint_Child_Config__c childFolderRec : childAndSubChildRecords){
            List<String> Subfolders = new List<String>();
            for(SharePoint_Subchild_Configs__c relatedRec : childFolderRec.SharePoint_Subchild_Configs__r){
                Subfolders.add(relatedRec.Name);
            }
            FoldersBySubFolder.put(childFolderRec.Name,Subfolders);
        }
        system.debug('FoldersBySubFolder'+FoldersBySubFolder);
        //Mapping the Folders to the User Documents folders on sharePoint. 
        List<Folders_Mapping_For_Sharepoint__c> folderMappingData = [SELECT Name,Sub_Folders__c FROM Folders_Mapping_For_Sharepoint__c];
        
        for(Folders_Mapping_For_Sharepoint__c mappingRec : folderMappingData){
            System.debug('mappingRec==>'+mappingRec.Name);
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c);
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c.CONTAINS('Upload Undertaking'));
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c.replace('Upload Undertaking','Undertaking'));
            System.debug('mappingRec==>'+mappingRec.Sub_Folders__c);
            List<String> subfolderList = new List<string>();
            Set<String> subfolderSet = new Set<string>();
            subfolderSet.addAll(mappingRec.Sub_Folders__c.split(','));
            if(subfolderSet.contains('Upload Undertaking')){
                subfolderSet.remove('Upload Undertaking');
                subfolderSet.add('Undertaking');
            }
            if(subfolderSet.contains('Invitation Letter Form')){
                subfolderSet.remove('Invitation Letter Form');
                subfolderSet.add('Invitation Letter');
            }
            if(subfolderSet.contains('Upload Visit Letter')){
                subfolderSet.remove('Upload Visit Letter');
                subfolderSet.add('Visit Letter');
            }
            subfolderList.addAll(subfolderSet);
            if(mappingRec.Name == 'Release Notes as per Disbursement'){
                userDocsByFolder.put('Release Notes as per Disbursement Schedule',mappingRec.Sub_Folders__c.split(','));    
            }
            if(mappingRec.Sub_Folders__c.CONTAINS('Upload Undertaking') || mappingRec.Sub_Folders__c.CONTAINS('Invitation Letter Form') || mappingRec.Sub_Folders__c.CONTAINS('Upload Visit Letter')){
               
                userDocsByFolder.put(mappingRec.Name,subfolderList); 
            }
            
            else{
                userDocsByFolder.put(mappingRec.Name,mappingRec.Sub_Folders__c.split(','));
            }
        }
        system.debug('userDocsByFolder'+userDocsByFolder);
        for(Attachment at : NewAttList) {
            String sObjName = (at.ParentId).getSObjectType().getDescribe().getName();
            system.debug('sObjName'+sObjName);
            if( sObjName == 'User_Document__c'){
                userDocumentIds.add(at.ParentId);     
            }
            if(sObjName == 'Application_Proposal__c' ){
                appProposalIds.add(at.ParentId);
            }
            if(sObjName == 'Disbursement_Schedule__c'){
                dssProposalIds.add(at.ParentId);
            }
        }
        
        if(userDocumentIds.size() > 0){
            for(User_Document__c ud : [Select Id , name , Proposal_Id__c , Propsal_Name__c from User_Document__c where id IN : userDocumentIds]){
                userDocById.put(ud.Id , ud);
            }    
            userDocumentList = [Select id , name , Proposal_Id__c , Propsal_Name__c , Proposals__r.Name, Contact__c ,(Select Id,Name from Attachments Order by createdDate Desc LIMIT 1 ) from User_Document__c where  ID IN :userDocumentIds ];
            system.debug('userDocById'+userDocById);
            
            
            for(String folder : userDocsByFolder.keyset()){
                system.debug('Main Folder'+folder);
                for(String userDoc : userDocsByFolder.get(folder)){
                    system.debug('Second Folder '+userDoc);
                    for(User_Document__c udRec: userDocumentList){
                        system.debug('third Folder '+udRec.Name);
                        if(udRec.Name == 'Upload Undertaking'){
                            udRec.Name = 'Undertaking';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Invitation Letter Form'){
                            udRec.Name = 'Invitation Letter';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Upload Visit Letter'){
                            udRec.Name = 'Visit Letter';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Upload Bank Details' ){
                            udRec.Name = 'Bank Account Details';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Upload your Visa'){
                            udRec.Name = 'Visa Documents';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == 'Security/Sensitivity Clearance Document'){
                            udRec.Name = 'Security-Sensitivity Clearance Document';
                            system.debug('third Folder INNN'+udRec.Name);
                        }
                        if(udRec.Name == userDoc){
                            system.debug('third Folder INNN1'+udRec.Name);
                            //attachmentIdList.add(udRec.Attachments[0].Id);
                            if(udRec.Propsal_Name__c != null){
                                proposalName = udRec.Propsal_Name__c;    
                            }else{
                                proposalName = udRec.Proposals__r.Name;    
                            }
                            system.debug('proposalName====>'+proposalName);
                            for(String mainFolder : FoldersBySubFolder.keySet()){
                                for(String folderValue : FoldersBySubFolder.get(mainFolder)){
                                    if(folder.equals(folderValue)){
                                        system.debug('Got it 🧑‍💻');
                                        parentFolderName = mainFolder;
                                    }else{
                                        parentFolderName = 'Application Document';
                                    }
                                    
                                }
                            }
                            parentFolderName = parentFolderName.replaceAll(' ','%20');
                            //commented by rutuja
                            //folderName = folder.replaceAll(' ','%20');
                            folderName = udRec.Name.replaceAll(' ','%20');
                            system.debug('parentFolderName=====>'+parentFolderName);
                            system.debug('folderName=====>'+folderName);
                            system.debug('proposalName===>'+proposalName);
                            //commented by rutuja
                            //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+parentFolderName+'/'+folderName;
                            //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+'Upload%20Undertaking';
                            
                            if(folderName == 'Coordinator%201%20Signature' || folderName == 'Coordinator%202%20Signature' || folderName == 'Meeting%20Agenda' ){
                                  
                            path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Connect_Plus/'+proposalName+'/'+'Application%20Document'+'/'+'Attachments';
                            system.debug('path=>'+path);
                            }
                            if(folderName != 'Coordinator%201%20Signature' && folderName != 'Coordinator%202%20Signature' && folderName != 'Meeting%20Agenda' ){
                            path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Connect_Plus/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+folderName;
                            system.debug('path=>'+path);
                            }
                            attachmentRecByPath.put(udRec.Attachments[0].Id,path);
                        }
                    }
                }
            }
            system.debug('attachmentRecByPath'+attachmentRecByPath);
            list<Attachment> attachList = [select id,ParentId,name,Body from Attachment where ID IN: attachmentRecByPath.keySet()];
            system.debug('attachList size'+attachList.size());
            for(Attachment att : attachList){
                system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                String sObjName = (att.ParentId).getSObjectType().getDescribe().getName();
                system.debug('sObjName'+sObjName);
                if( sObjName == 'User_Document__c'){
                    User_Document__c ud = [select id,contact__r.Name,Name from User_Document__c where id =: att.ParentId order by createddate desc limit 1];
                    if(ud.contact__r.Name != NULL){
                        createFileUsingBlobFromAttachments(att.Body, ud.Name + ' - ' +  ud.contact__r.Name + ' - '+ att.Name,attachmentRecByPath.get(att.Id));
                    }
                    else{
                        createFileUsingBlobFromAttachments(att.Body, ud.Name + ' - ' + att.Name,attachmentRecByPath.get(att.Id));
                    }
                }
                else{
                    createFileUsingBlobFromAttachments(att.Body,att.Name,attachmentRecByPath.get(att.Id));
                }
            }
        }
        
        system.debug('appProposalIds'+appProposalIds);
        if(appProposalIds.size() > 0){
            
            List<Application_Proposal__c> appProposalList = [Select id , name ,(Select Id,Name from Attachments Order by createdDate Desc LIMIT 1 ) from Application_Proposal__c where  ID IN :appProposalIds];
            proposalName = appProposalList[0].Name;
            
            for(Application_Proposal__c uds : appProposalList){
                attachmentIdList.add(uds.Attachments[0].Id);
            }
            system.debug('Running for the proposals..../');
            system.debug('proposalName'+proposalName);
            
            	//commented by rutuja
                //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/Application%20Document/Attachments';
                list<Attachment> attachList = [select id,name,Body from Attachment where ID IN: attachmentIdList];
                for(Attachment att : attachList){
                    if(att.Name.contains('_workshopIndian_sanction') || att.Name.contains('_workshopGerman_sanction')){
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Connect_Plus/'+proposalName+'/'+'Grant%20Award%20Process'+'/'+'Award%20Letter';
                        system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    else if(!att.Name.contains('_workshopIndian_sanction') && !att.Name.contains('_workshopGerman_sanction') && att.Name.contains('_WORKSHOP_')){
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Connect_Plus/'+proposalName+'/'+'Application%20Document'+'/'+'Application%20documents';
                        system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    else {
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Connect_Plus/'+proposalName+'/'+'Application%20Document'+'/'+'Attachments';
                        system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                }
            
            
        }
        
        if(dssProposalIds.size() > 0){
            
            List<Disbursement_Schedule__c> appProposalList = [Select id , Tranche__c,name ,Proposals__r.Name,(Select Id,Name from Attachments Order by createdDate Desc LIMIT 1 ) from Disbursement_Schedule__c where  ID IN :dssProposalIds];
            proposalName = appProposalList[0].Proposals__r.Name;
            proposalTrancheName = 'Tranche ' + appProposalList[0].Tranche__c ;
            for(Disbursement_Schedule__c uds : appProposalList){
                attachmentIdList.add(uds.Attachments[0].Id);
            }
            system.debug('Running for the proposals..../');
            system.debug('proposalName'+proposalName);
            
            	//commented by rutuja
                //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/Application%20Document/Attachments';
                list<Attachment> attachList = [select id,name,Body from Attachment where ID IN: attachmentIdList];
                for(Attachment att : attachList){
                    if(att.Name.contains('SE-UC Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Connect_Plus/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'SE-UC%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('Visit Report')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Connect_Plus/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Visit%20Report';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('Euro Remittance Invoice')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Connect_Plus/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Euro%20Remittance%20Invoice';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    if(att.Name.contains('Bank account details')){
                        //path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Closure%20Report';
                        path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/Connect_Plus/'+proposalName+'/'+'Post-Grant%20Award%20Process'+'/'+'Bank%20account%20details';
                        system.debug('The path is ====>'+path);
                        createFileUsingBlobFromAttachments(att.Body,att.Name,path);
                    }
                    
                }
            
            
        }
        
        
    }
   
    
    //This method is being used to push the uploaded attachments to the sharepoint to specific folders from user documents of Proposal..
    public static void pushAttachmentsToSPFromProposal(List<Attachment> NewAttList){
        Map<String,List<String>> userDocsByFolder = new map<String,List<String>>();
        Map<String,User_Document__c> userDocById = new map<String,User_Document__c>();
        Map<String,String> userDocIdByProposalName = new map<String,String>();
        Map<Id,String> attachmentRecByPath = new Map<Id,String>();
        Map<String,List<String>> FoldersBySubFolder = new Map<String,List<String>>();
        List<User_Document__c> userDocumentList = new  List<User_Document__c>();
        List<String> userDocumentIds = new List<String>();
        List<String> appProposalIds = new List<String>();
        List<String> dssProposalIds = new List<String>();
        List<String> attachmentIdList = new List<String>();
        String proposalName = ''; 
        String path = '';
        String folderName = '';
        String parentFolderName = '';
        
        //Mapping the Folders to the Main Folders using Master_Sharepoint_records.
        
        List<Sharepoint_Master__c>        masterAndChildRecords              = [SELECT Name , (Select Name from SharePoint_Child_Configs__r) FROM Sharepoint_Master__c where Name = 'PECFAR' and Is_campaign__c = false];
        List<SharePoint_Child_Config__c>  childAndSubChildRecords            = [SELECT Name , (Select Name from SharePoint_Subchild_Configs__r) FROM SharePoint_Child_Config__c where Master_Config_Name__c = 'PECFAR' and Sharepoint_Master_Configuration__r.Is_campaign__c = false];
        
        /*for(SharePoint_Child_Config__c childFolderRec : childAndSubChildRecords){
            List<String> Subfolders = new List<String>();
            for(SharePoint_Subchild_Configs__c relatedRec : childFolderRec.SharePoint_Subchild_Configs__r){
                Subfolders.add(relatedRec.Name);
            }
            FoldersBySubFolder.put(childFolderRec.Name,Subfolders);
        }*/
        for(Sharepoint_Master__c childFolderRec : masterAndChildRecords){
            List<String> Subfolders = new List<String>();
            for(SharePoint_Child_Config__c relatedRec : childFolderRec.SharePoint_Child_Configs__r){
                Subfolders.add(relatedRec.Name);
            }
            FoldersBySubFolder.put(childFolderRec.Name,Subfolders);
        }
        system.debug('FoldersBySubFolder'+FoldersBySubFolder);
        
        //Mapping the Folders to the User Documents folders on sharePoint. 
        
        List<Folders_Mapping_For_Sharepoint__c> folderMappingData = [SELECT Name,Sub_Folders__c FROM Folders_Mapping_For_Sharepoint__c];
        
        for(Folders_Mapping_For_Sharepoint__c mappingRec : folderMappingData){
            if(mappingRec.Name == 'Release Notes as per Disbursement'){
                userDocsByFolder.put('Release Notes as per Disbursement Schedule',mappingRec.Sub_Folders__c.split(','));    
            }else{
                userDocsByFolder.put(mappingRec.Name,mappingRec.Sub_Folders__c.split(','));
            }
        }
        system.debug('userDocsByFolder'+userDocsByFolder);
        for(Attachment at : NewAttList) {
            String sObjName = (at.ParentId).getSObjectType().getDescribe().getName();
            system.debug('sObjName'+sObjName);
           
            if(sObjName == 'Application_Proposal__c'){
                appProposalIds.add(at.ParentId);
            }
            
        }
        
        if(appProposalIds.size() > 0){
            
            List<Application_Proposal__c> appProposalList = [Select id , name ,(Select Id,Name from Attachments Order by createdDate Desc LIMIT 1 ) from Application_Proposal__c where  ID IN :appProposalIds];
            proposalName = appProposalList[0].Name;
            for(Application_Proposal__c uds : appProposalList){
                attachmentIdList.add(uds.Attachments[0].Id);
            }
            system.debug('proposalName'+proposalName);
            path = '/sites/SalesforceSharepoint/Shared%20Documents/Proposals/PECFAR/'+proposalName+'/Application%20Document/Attachments';
            list<Attachment> attachList = [select id,name,Body from Attachment where ID IN: attachmentIdList];
            for(Attachment att : attachList){
                system.debug('The path is ====>'+attachmentRecByPath.get(att.Id));
                createFileUsingBlobFromAttachments(att.Body,att.Name,path);
            }
            
        }
        
        
    }
    
    @future(callout=true)
    public static void createFileUsingBlobFromAttachments(Blob content,String fileName,String folderName){
        
        fileName = fileName.replaceAll(' ','%20');
        System.debug('content=>'+content);
        System.debug('fileName=>'+fileName);
        System.debug('folderName=>'+folderName);
        //commented by rutuja
        //String url = 'sites/IGSTC/_api/web/GetFolderByServerRelativeUrl('+'\''+folderName+'\')/Files/add(url=\''+fileName+'\',overwrite=true)';
        String url = 'sites/SalesforceSharepoint/_api/web/GetFolderByServerRelativeUrl('+'\''+folderName+'\')/Files/AddUsingPath(decodedurl=\''+fileName+'\',overwrite=true)';
        //String url = 'sites/'+siteName+'/_api/web/GetFolderByServerRelativeUrl('+'\'/sites/'+siteName+'/'+folderName+'\')/Files/add(url=\''+fileName+'\',overwrite=true)';
        
        HTTP http = new HTTP();
        HttpRequest req = new HttpRequest();
        
        String body = 'Ly8gUmVxdWVzdCBCb2R5LS0tLQ0KDQp7DQogICJjdXN0b21lcl9ncm91cGluZyI6ICJaMDAxIiwNCiAgInBhcnRuZXJfcm9sZSI6ICJTWTAwMDFYIiwNCiAgImN1c3RvbWVyX25hbWUiOiAiQWtoaWwgSyBHIiwNCiAgInN0cmVldF8yIjogIk5POjgwLEJPTU1BU0FORFJBIElORFVTVFJJQUwgQVJFQSIsDQogICJzdHJlZXRfMyI6ICJBTkVLQUwgVEFMVUssIEhPU1VSIFJPQUQsIiwNCiAgInN0cmVldCI6ICJJTkRVU1RSSUFMIEFSRUEsIENIRU1CQU5PT1IiLA0KICAicG9zdGFsX0NvZGUiOiAiNjgzNTcyIiwNCiAgImNpdHkiOiAiQU5HQU1BTFkiLA0KICAiY291bnRyeSI6ICJJTiIsDQogICJyZWdpb24iOiAzMiwNCiAgImxhbmd1YWdlIjogIkVOIiwNCiAgInRlbGVwaG9uZV9udW1iZXIiOiAiOTI0OTUwMDAwMiIsDQogICJtb2JpbGVfbnVtYmVyIjogIjkyNDk1MDAwMDIiLA0KICAiZW1haWwiOiAibW9vbGFuc2dyb3VwQGdtYWlsLmNvbSIsDQogICJ0YXhfdHlwZSI6ICIwOSIsDQogICJnc3Rpbl9udW1iZXIiOiAiMzJBQUNDTTMyNTlOMVpCIiwNCiAgInBhbl9udW1iZXIiOiAiQUFDQ00zMjU5TiINCn0NCg0KDQovLyBSZXNwb25zZSAtIFN1Y2Nlc3MNCg0Kew0KICAgICJzdGF0dXMiOnRydWUsDQogICAgImN1c3RvbWVyX2lkIjoiV0VXRVBXSUUzMjMyMzIzMiIsDQp9DQoNCi8vIFJlc3BvbnNlIC0gRXJyb3INCg0Kew0KICAgICJzdGF0dXMiOnRydWUsDQogICAgIm1lc3NhZ2UiOiJFcnJvciBtZXNzYWdlIGhlcmUiLA0KfQ0KDQo=';
        
        req.setHeader('Accept', 'application/json;odata=verbose');
        req.setHeader('Content-Type','application/json;odata=verbose');
        req.setHeader('Authorization', 'BASIC {!$Credential.AuthorizationHeaderValue}');
        req.setHeader('Content-Length', '0');
        req.setHeader('X-RequestDigest','{form_digest_value}');
        req.setTimeout(120000);
        //req.setBody(EncodingUtil.base64Decode(body).toString());
        req.setBodyAsBlob(content);
        
        req.setMethod('POST');
        //commented by rutuja
        //req.setEndpoint('callout:SPSF/'+url);
        req.setEndpoint('callout:Sharepoint_IGSTC/'+url);
        HTTPResponse res = http.send(req);
        System.debug('testingrutuja=>'+res.getBody());
        
    }
}