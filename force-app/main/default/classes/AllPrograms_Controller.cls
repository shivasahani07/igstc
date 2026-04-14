public class AllPrograms_Controller {
    
    public string campaignList {get;set;}
    
    public AllPrograms_Controller(){
        campaignList = JSON.serialize(fetchCampaignsPrograms());
    }
    
    @RemoteAction
    public static List<Campaign> fetchCampaignsPrograms(){
        List<Campaign> campaignList = [SELECT Id,Name FROM Campaign Limit 1];
        if(!campaignList.isEmpty()){
            return campaignList; 
        }
        return Null;
    }
}