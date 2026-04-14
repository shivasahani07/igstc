global class ScheduleBatchForSEUCPecfar implements Schedulable{
    global void execute(SchedulableContext SC) {
        SEUCReportPECFAR batchInstance = new SEUCReportPECFAR();
        database.executeBatch(batchInstance);
    }
}