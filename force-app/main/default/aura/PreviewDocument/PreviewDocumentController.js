({
    doInit : function(component, event, helper) {
        debugger;
        // var today = new Date();
        // component.set("v.currentDate", today);
        var action = component.get("c.generateTempForAwardDraft");
        action.setParams({
            proID : component.get("v.recordId")
        });
        action.setCallback(this,function(e){
            if(e.getState()=='SUCCESS'){
                var result=e.getReturnValue();
                //component.set("v.fileId", result);
            }
            else{
                alert(JSON.stringify(e.getError()));
            }
        });
        
        window.setTimeout( 
            $A.getCallback(function(){ 
                component.set("v.showSpinner", false); 
                helper.helperMethod(component, event);
            }), 15000 
        );
        $A.enqueueAction(action);  
    },
    
    handleSend: function(component, event, helper) {
        debugger;
        var action = component.get("c.sendProposal");
        action.setParams({
            propId : component.get("v.recordId"),
            attId : component.get("v.fileId")
        });
        
        
        action.setCallback(this,function(e){
            var toastEvent = $A.get("e.force:showToast");
            if(e.getReturnValue()==='Approved'){
                toastEvent.setParams({
                    title : 'Success',
                    message: 'Proposal Sent Successfully',
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'success',
                    mode: 'pester'
                });
            }
            else if(e.getReturnValue() !='Approved') {
                // var errors= response.getError();
                toastEvent.setParams({
                    title : 'Sent Error',
                    message: 'We cant send this Email to the Applicant coz of previous pending stage.',
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'error',
                    mode: 'sticky'
                });
            }
            toastEvent.fire();
            var dismissActionPanel = $A.get("e.force:closeQuickAction");
            dismissActionPanel.fire();
        });
        $A.enqueueAction(action);  
    },
    
    handleCancel: function(component, event, helper) {
        var dismissActionPanel = $A.get("e.force:closeQuickAction");
        dismissActionPanel.fire();
    },
})