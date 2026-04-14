global class ScheduleBatchForAttandancePecfar implements Schedulable{
    global void execute(SchedulableContext SC) {
        AttandanceReportPECFAR batchInstance = new AttandanceReportPECFAR();
        database.executeBatch(batchInstance);
    }
}