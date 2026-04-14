public class ProjectDetailPage_Controller {
    
    public string thematicAreaList {get;set;}
    // public string duration  {get;set;}
    public String ApplicantPortalSiteURL {get;set;}
    
    public ProjectDetailPage_Controller(){
        ApplicantPortalSiteURL = Constants.CANDIDATE_SITE ;
       thematicAreaList = JSON.serialize(fetchAllThematicArea());
        // duration = JSON.serialize(Utility.getPicklistValues('Application_Proposal__c' , 'Duration_In_Months_Max_36__c'));
        //system.debug('duration----'+duration);
    }
    
    
    public static Application_Proposal__c getApplicantDetails(string applicantHashCode){
        contact conRec = [select name,id,Proposals__c from contact where Login_Hash_Code__c =:applicantHashCode limit 1];
        system.debug('applicantHashCode' +applicantHashCode);
        if(conRec.Proposals__c != Null){
            Application_Proposal__c proposalRecord = [SELECT id,Name,Acronym__c,Title_Of__c,Title_In_German__c,Thematic_Topic__c,Duration_In_Months_Max_36__c,Summary__c,KeyWords__c,Tentative_Start_Date__c FROM Application_Proposal__c WHERE Id=: conRec.Proposals__c];
            return proposalRecord;
        }else{
            return Null;  
        }     
    }
    
    
    public static String insertApplication(Application_Proposal__c applicantDetails, List<string> selThemeList){
        try{
         
            upsert applicantDetails;
            List<Application_Thematic_Area__c> appThemeticAreaList = New List<Application_Thematic_Area__c>();
            for(string theme:selThemeList){
                appThemeticAreaList.add(new Application_Thematic_Area__c(Application__c=applicantDetails.Id,Thematic_Area__c=theme));
            }
            return 'SUCCESS';
        }catch(Exception e){
            return 'ERROR';
        }
    }
    
    
    public static List<Thematic_Area__c> fetchAllThematicArea(){
        List<Thematic_Area__c> thematicAreaList = [SELECT Id,Name FROM Thematic_Area__c];
        if(!thematicAreaList.isEmpty()){
            return thematicAreaList;
        }
        return null;
    } 
}