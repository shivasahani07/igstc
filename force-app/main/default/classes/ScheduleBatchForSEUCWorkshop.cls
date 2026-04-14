global class ScheduleBatchForSEUCWorkshop implements Schedulable{
    global void execute(SchedulableContext SC) {
        SEUCReportWorkshop batchInstance = new SEUCReportWorkshop();
        database.executeBatch(batchInstance);
    }
}