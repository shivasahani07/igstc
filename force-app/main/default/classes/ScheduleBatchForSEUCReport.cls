global class ScheduleBatchForSEUCReport implements Schedulable{
    global void execute(SchedulableContext SC) {
        SEUCProgressReportEmailTaskBatch batchInstance = new SEUCProgressReportEmailTaskBatch();
        database.executeBatch(batchInstance);
    }
}