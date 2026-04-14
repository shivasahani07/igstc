public class PE_GenerateCongaTemplateHelper {
    public static void afterInsert(List<GenerateCongaTemplate__e> newCongaList){
        system.debug('newCongaList-->'+newCongaList);
        if(!newCongaList.isEmpty()){
            DynamicCongaTempGeneration.GenerateCongaTemplatesUsingCS(newCongaList[0].Proposal_Id__c,newCongaList[0].Proposal_RecordType_Name__c	);
        }
        
    }
}