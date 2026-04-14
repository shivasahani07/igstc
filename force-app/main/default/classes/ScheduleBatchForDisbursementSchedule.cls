global class ScheduleBatchForDisbursementSchedule implements Schedulable{
    global void execute(SchedulableContext SC) {
        DisbursementScheduleBatch batchInstance = new DisbursementScheduleBatch();
        database.executeBatch(batchInstance);
    }
}