public class gg {
    
    public static void CreateRecord(){
        for(Integer i = 6; i<=10;i++){
            Question_Line_Item__c var = new Question_Line_Item__c();
            var.Question__c = 'Scroll NO '+i;
            var.Question_Template__c = 'a1X1y00000021CjEAI';
            insert var;
            System.debug('The Var List :'+var);
        }
        
    }
}