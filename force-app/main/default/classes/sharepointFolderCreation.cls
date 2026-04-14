public class sharepointFolderCreation {
    /*public static string newmwth(String RecordTypeName,String docName, id recordId){
        String inputString = '';
        string outFolder;
        Application_Proposal__c app = [Select id, Name From Application_Proposal__c Where id =: recordId];
        
        String proposalName = app.Name;
        String baseurl2 =  System.Label.SharePoint_File_BaseUrl + proposalName+'/';
        
        try{
            // String RecordTypeName='Industrial_Fellowships';
            //String docName= 'Decision Letter';
            
            map<string,Proposal_SharePoint_Config__mdt> st = Proposal_SharePoint_Config__mdt.getAll();
            Proposal_SharePoint_Config__mdt proposalSharepoint = st.get(RecordTypeName);
            Map<String,String> mcs = new Map<String,String>();
            /*mcs.put('Evaluation Documents',proposalSharepoint.Evaluation_Documents__c);
            mcs.put('Application Documents',proposalSharepoint.Application_Documents__c);
            mcs.put('Grant Documents',proposalSharepoint.Grant_Documents__c);
            mcs.put('Post Grant Documents',proposalSharepoint.Post_Grant_Documents__c);
            mcs.put('Grant Documents',proposalSharepoint.Grant_Documents__c); 
            for(string sts : mcs.keySet()){
                if(mcs.get(sts).contains(docName)){
                    inputString = mcs.get(sts);
                    outFolder=sts;
                }
            }
            if(inputString.contains( '=>')){
                Map<String, String> resultMap = new Map<String, String>();
                String[] pairs = inputString.substringBefore(',').split(';');
                
                for (String pair : pairs) {
                    List<String> keyValue = pair.split('=>');
                    resultMap.put(keyValue[0].trim(), keyValue[1].trim());
                }
                for (String key : resultMap.keyset()) {
                    if(resultMap.get(key).contains(docName)){
                        outFolder=outFolder+'/'+key;
                        outFolder= baseurl2+outFolder.replaceAll(' ', '%20');
                    }
                }
                return baseurl2+outFolder;
            }
        }
        
        catch(Exception e){
            System.debug(e.getMessage() +'  '+ e.getLineNumber());
        }
        return baseurl2+outFolder.replaceAll(' ', '%20');  
    }*/
}