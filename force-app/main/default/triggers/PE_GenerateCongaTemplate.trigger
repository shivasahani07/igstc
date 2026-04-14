trigger PE_GenerateCongaTemplate on GenerateCongaTemplate__e (after insert) {
    if(trigger.isAfter && trigger.isInsert){
        PE_GenerateCongaTemplateHelper.afterInsert(trigger.new);
    }
}