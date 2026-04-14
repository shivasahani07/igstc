({
    doInit : function(component, event, helper) {
        var action = component.get("c.generateTemplateFromProposal");
        action.setParams({
            "recordId": component.get("v.recordId")
        })
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var toastEvent = $A.get("e.force:showToast");    
                toastEvent.setParams({
                    "title": "Success!",
                    "message": " Your Template have been generated successfully!!"
                });
                toastEvent.fire();
                // Close the action panel
                var dismissActionPanel = $A.get("e.force:closeQuickAction");
                dismissActionPanel.fire();
            }else{
                var toastEvent = $A.get("e.force:showToast");    
                toastEvent.setParams({
                    "title": "Error!",
                    "message": " Something has gone wrong."
                });
                toastEvent.fire();
                // Close the action panel
                var dismissActionPanel = $A.get("e.force:closeQuickAction");
                dismissActionPanel.fire();
            }
            
        });
        $A.enqueueAction(action);
    },
    
})