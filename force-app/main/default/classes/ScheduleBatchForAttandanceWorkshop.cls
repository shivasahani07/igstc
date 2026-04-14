global class ScheduleBatchForAttandanceWorkshop implements Schedulable{
    global void execute(SchedulableContext SC) {
        AttendanceReportWORKSHOP batchInstance = new AttendanceReportWORKSHOP();
        database.executeBatch(batchInstance);
    }
}