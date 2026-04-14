({
    doInit : function(component, event, helper) {
        debugger;
        var action = component.get("c.updateCriteriaCheck");
        var dismissActionPanel = $A.get("e.force:closeQuickAction");
        dismissActionPanel.fire();
        location.reload();
        $A.get('e.force:refreshView').fire();
        action.setParams({
            "recordId" : component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            if(response.getState() === "SUCCESS"){
                
                var data = response.getReturnValue();
                $A.get('e.force:refreshView').fire();
            }
        });
        $A.enqueueAction(action);
    }
})