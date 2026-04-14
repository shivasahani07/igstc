public without sharing class ProposalDocumentLWCController {
    
    @AuraEnabled(cacheable = true)
    public static Map<String,List<Object>> getFoldersAndFiles(String recId){
        try {
            if(!String.isEmpty(recId)){
                Map<String,List<Object>> responseMap = new Map<String,List<Object>>();

                Application_Proposal__c prop = [Select Id,Name From Application_Proposal__c Where Id=:recId];

                String destination = 'Proposals/'+prop.Name;

                Map<String,Object> filesResponse = (Map<String, Object>)JSON.deserializeUntyped(SharePointHandler.getAllFilesAndFoldersInSites(destination,'Files'));
                Map<String,Object> foldersResponse = (Map<String, Object>)JSON.deserializeUntyped(SharePointHandler.getAllFilesAndFoldersInSites(destination,'Folders'));

                if(filesResponse.containsKey('d') && foldersResponse.containsKey('d')){
                    Map<String,Object> resultFileMap = (Map<String,Object>) filesResponse.get('d');
                    Map<String,Object> resultFolderMap = (Map<String,Object>) foldersResponse.get('d');

                    responseMap.put('files',(List<Object>) resultFileMap.get('results'));
                    responseMap.put('folders',(List<Object>) resultFolderMap.get('results'));
                }
                // responseMap.put('files',filesResponse);
                // responseMap.put('folders',foldersResponse);
                return responseMap;
            }
            return null;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Map<String,List<Object>> getSubFoldersAndFiles(String filesUrl,String foldersUrl){
        try {
            System.debug('FilesUrl----'+filesUrl);
            System.debug('FoldersUrl----'+foldersUrl);

            Map<String,List<Object>> responseMap = new Map<String,List<Object>>();

            Map<String,Object> filesResponse = (Map<String, Object>)JSON.deserializeUntyped(SharePointHandler.getFilesOrFolder(filesUrl));
            Map<String,Object> foldersResponse = (Map<String, Object>)JSON.deserializeUntyped(SharePointHandler.getFilesOrFolder(foldersUrl));

            if(filesResponse.containsKey('d') && foldersResponse.containsKey('d')){
                Map<String,Object> resultFileMap = (Map<String,Object>) filesResponse.get('d');
                Map<String,Object> resultFolderMap = (Map<String,Object>) foldersResponse.get('d');

                responseMap.put('files',(List<Object>) resultFileMap.get('results'));
                responseMap.put('folders',(List<Object>) resultFolderMap.get('results'));
            }
            // responseMap.put('files',filesResponse);
            // responseMap.put('folders',foldersResponse);
            return responseMap;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Map<String,Object> createFolder(String path){
        try {
            Map<String,Object> responseMap = new Map<String,Object>();
            Map<String,Object> response = (Map<String, Object>)JSON.deserializeUntyped(SharePointHandler.createFolder(path));

            if(response.containsKey('d')){
                responseMap = (Map<String,Object>) response.get('d');
            }

            return responseMap;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string deleteFolderInsideSite(String path){
        try {
            return SharePointHandler.deleteFolderInsideSite(path)?'Success':'Failure';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Map<String,Object> createFile(String base64, String fileName,String path){
        try {
            Map<String,Object> responseMap = new Map<String,Object>();

            Blob fileContents = EncodingUtil.base64Decode(base64);
            String response = SharePointHandler.createFileUsingBlob(fileContents,fileName,path);

            if(response!='Failure'){
                Map<String,Object> res = (Map<String, Object>)JSON.deserializeUntyped(response);

                if(res.containsKey('d')){
                    responseMap = (Map<String,Object>) res.get('d');
                }
            }
            
            return responseMap;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string deleteFileSP(String path){
        try {
            return SharePointHandler.deleteFileInsideSite(path);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // @AuraEnabled
    // public static string downloadFile(String path){
    //     try {
    //         return SharePointHandler.downloadFile(path);
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }


}