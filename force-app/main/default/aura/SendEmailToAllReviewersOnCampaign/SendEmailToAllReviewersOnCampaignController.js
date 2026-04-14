({
    doInit : function(component, event, helper) {
        var action = component.get("c.runBatchClass");
        action.setParams({
            campId : component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
        });
        $A.enqueueAction(action);
    }
})