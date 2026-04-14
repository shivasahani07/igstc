public class ConsortiumPartnerInformation_Controller {
    
    public String ApplicantPortalSiteURL {get;set;}
    
    public ConsortiumPartnerInformation_Controller(){
        ApplicantPortalSiteURL = Constants.CANDIDATE_SITE ;
    }
    @RemoteAction
    public static String insertPartnerInformation(Contact contactDetails){
        try{
            insert contactDetails;
            return 'SUCCESS';
        }catch(Exception e){
            return 'ERROR';
        }
    }

}