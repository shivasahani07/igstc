public class displayDisbursementRecordsinPieChart {


    @AuraEnabled(cacheable=true)
    public static List<DataSet> getAllAccountsByRating(String proposalId){
    List<AggregateResult> result =  [Select sum(amount__c) cnt, Status__c FROM Disbursement_Schedule__c where Proposals__c=:proposalId group by Status__c];
    List<DataSet> dataSet = new List<DataSet>();
    for(AggregateResult ar:result){
    String status =  (String)ar.get('Status__c') ;
    Decimal total =(Decimal)ar.get('cnt');
    dataSet.add(new DataSet(status ,total));
    }
    System.debug('dataSet'+dataSet);
    return dataSet ;
    }

    public class DataSet{
    public DataSet(String label ,Decimal count){
    this.label  = label ;
    this.count = count ;
    }
    @AuraEnabled
    public String label {get;set;}
    @AuraEnabled
    public Decimal  count {get;set;}
    }

}