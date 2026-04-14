({
	doInit : function(component, event, helper) {
        component.set("v.testing","display: none;");
        var action = component.get("c.getDisbursementRecords");
        action.setParams({
            proposalId : component.get("v.recordId")
        });
        action.setCallback(this,function(response){
            if(response.getState() === 'SUCCESS'){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Success',
                    message: 'Disbursement Records Regenerated Successfully!!',
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'success',
                    mode: 'pester'
                });
                toastEvent.fire();
                
                var dismissActionPanel = $A.get("e.force:closeQuickAction");
                dismissActionPanel.fire();
                
                
            } 
        });
		$A.enqueueAction(action);
	},
})