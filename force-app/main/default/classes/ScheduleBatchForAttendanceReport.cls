global class ScheduleBatchForAttendanceReport  implements Schedulable{
    global void execute(SchedulableContext SC) {
        AttandanceReportEmailAndTaskBatch batchInstance = new AttandanceReportEmailAndTaskBatch();
        database.executeBatch(batchInstance);
    }
}