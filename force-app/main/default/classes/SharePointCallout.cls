global without sharing class SharePointCallout {
    //This method will be used to create folders and subfolders corresponding to a proposal.
    @future(callout=true)
    public static void createFolder(Set<Id> proposalList){
        system.debug('proposalList====>'+proposalList);
        List<Application_Proposal__c> appProposaList = [Select Id,Name,RecordType.DeveloperName From Application_Proposal__c Where Id In : proposalList];
        system.debug('appProposaList==>'+appProposaList);
        for(Application_Proposal__c pro :appProposaList){
            //This will create the main Folder on site.. 
            String response = SharePointHandler.createFolderInsideSite('Proposals/'+pro.RecordType.DeveloperName+'/'+pro.Name);
            if(response=='Success'){
                //This will create the folders under the proposal .
                createSubFolders(pro);
            }
        }
    }
    //Main method for creating subFolders
    public static void createSubFolders(Application_Proposal__c pro){
        String propRecordTypeName= pro.RecordType.DeveloperName;
        system.debug('propRecordTypeName--'+propRecordTypeName);
        
        List<Sharepoint_Master__c>        masterAndChildRecords              = [SELECT Name , (Select Name from SharePoint_Child_Configs__r) FROM Sharepoint_Master__c where Name = :propRecordTypeName and Is_campaign__c = false];
        List<SharePoint_Child_Config__c>  childAndSubChildRecords            = [SELECT Name , (Select Name from SharePoint_Subchild_Configs__r) FROM SharePoint_Child_Config__c where Master_Config_Name__c = :propRecordTypeName and Sharepoint_Master_Configuration__r.Is_campaign__c = false];
        List<SharePoint_Subchild_Configs__c>  SubchildAndInnerChildRecords   = [SELECT Name , (Select Name from SharePoint_innerChild_Configs__r) FROM SharePoint_Subchild_Configs__c where Master_Config_Name__c = :propRecordTypeName AND SharePoint_Child_Config__r.Sharepoint_Master_Configuration__r.Is_campaign__c = false];
        Map<String,List<String>> FoldersBySubFolder = new Map<String,List<String>>();
        Map<String,List<String>> childFoldersBySubFolder = new Map<String,List<String>>();
        system.debug('masterAndChildRecords--'+masterAndChildRecords);
        system.debug('childAndSubChildRecords--'+childAndSubChildRecords); 
        system.debug('SubchildAndInnerChildRecords--'+SubchildAndInnerChildRecords);
        List<String> folders = new List<String>();
        //Preparing the first map of folder and subfodlers
        for(SharePoint_Child_Config__c childFolderRec : childAndSubChildRecords){
            folders.add(childFolderRec.Name);
            List<String> Subfolders = new List<String>();
            for(SharePoint_Subchild_Configs__c relatedRec : childFolderRec.SharePoint_Subchild_Configs__r){
                System.debug('relatedRec=>'+relatedRec.Name);
                if(relatedRec.Name == 'Upload Undertaking'){
                    Subfolders.add('Undertaking');    
                }
                Subfolders.add(relatedRec.Name);
            }
            FoldersBySubFolder.put(childFolderRec.Name,Subfolders);
        }
        system.debug('FoldersBySubFolder'+FoldersBySubFolder);
        //Preparing the second map of Subfolder and childfodlers
        for(SharePoint_Subchild_Configs__c subChildFolderRec : SubchildAndInnerChildRecords){
            //folders.add(childFolderRec.Name);
            List<String> childFolders = new List<String>();
            for(SharePoint_innerChild_Config__c relatedRec : subChildFolderRec.SharePoint_innerChild_Configs__r){
                childFolders.add(relatedRec.Name);
            }
            childFoldersBySubFolder.put(subChildFolderRec.Name,childFolders);
        }
        system.debug('childFoldersBySubFolder'+childFoldersBySubFolder);
        
        system.debug('childFoldersBySubFolder'+childFoldersBySubFolder);
        for(String folderRec : folders){
            String response = SharePointHandler.createFolderInsideSite('Proposals/'+propRecordTypeName +'/'+pro.Name+'/'+folderRec);
            if(FoldersBySubFolder.get(folderRec)!=null && !FoldersBySubFolder.get(folderRec).isEmpty()){
                for(String subFolder : FoldersBySubFolder.get(folderRec)){
                    SharePointHandler.createFolderInsideSite('Proposals/'+propRecordTypeName+'/'+pro.Name+'/'+folderRec+'/'+subFolder);
                    if(childFoldersBySubFolder.containsKey(subFolder)) {
                        system.debug('Child folders are exisiting'+childFoldersBySubFolder.containsKey(subFolder));
                        for(String StrRec : childFoldersBySubFolder.get(subFolder)){
                            SharePointHandler.createFolderInsideSite('Proposals/'+propRecordTypeName+'/'+pro.Name+'/'+folderRec+'/'+subFolder+'/'+StrRec);
                        }
                    }
                }
            }
        }
    }
    
    public static void createCustomFolder(String recordId, Integer fNumbers,List<String> expensesList, List<String> recDocs){
        Application_Proposal__c pro = [Select Id,Name From Application_Proposal__c Where Id=:recordId];
        for(Integer i = 1; i<=fNumbers; i++){
            String fName = i+'';
            
            if(i==1){
                fName += ' st';
            }else if(i==2){
                fName += ' nd';
            }else if(i==3){
                fName += ' rd';
            }else if(i==4 || i== 5 || i==6 || i==7 || i==8 || i==9){
                fName += ' th';
            }
            
            fName += ' '+expensesList[i-1];
            cFolder('Proposals/'+pro.Name+'/'+fName);
        }
        
        for(String fName : recDocs){
            cFolder('Proposals/'+pro.Name+'/'+fName);
        }
    }
    
    @future(callout=true)
    public static void cFolder(String folderName){
        SharePointHandler.createFolderInsideSite(folderName);
    }
}