({
	doInit : function(component, event, helper) {
        
        var action = component.get("c.generateyear3order");
        action.setParams({
            proposalId : component.get("v.recordId")
        });
        action.setCallback(this,function(response){
            if(response.getState() === 'SUCCESS'){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Success',
                    message: 'Year 3 Order generated Successfully!!',
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