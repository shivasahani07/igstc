public with sharing class SendEmailToAllReviewerOnCampaign {
    
    @AuraEnabled
    public static void runBatchClass(string campId) {
        system.debug('campId -----> '+campId);
        String campaignName = [SELECT Id,name from Campaign where id =: campId].Name;
        BatchToSendEmailToReviewers batchClass = new BatchToSendEmailToReviewers(campaignName);
        Database.executeBatch(batchClass);
    }

    public static String generateReviewerPassword(){
        Integer len = 8;
        final String chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
        String randStr = '';
        while (randStr.length() < len) {
            Integer idx = Math.mod(Math.abs(Crypto.getRandomInteger()), chars.length());
            randStr += chars.substring(idx, idx+1);
        }
        return randStr+string.ValueOf(system.now().getTime()); 
    }
    
}