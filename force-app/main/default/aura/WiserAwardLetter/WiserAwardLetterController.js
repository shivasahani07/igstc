({
    doInit : function(component, event, helper) {
        debugger;
        var action = component.get("c.generateWiserAwardLetter");
        action.setParams({
            proID : component.get("v.recordId")
        });
        action.setCallback(this,function(e){
            if(e.getState()=='SUCCESS'){
                var result=e.getReturnValue();
                console.log('Wiser'+result);
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
        var action = component.get("c.sendProposalAwardWiser");
        action.setParams({
            propId : component.get("v.recordId"),
            attId : component.get("v.fileId")
        });
        
        
        action.setCallback(this,function(e){
            var toastEvent = $A.get("e.force:showToast");
            if(e.getState()==='SUCCESS'){
                toastEvent.setParams({
                    title : 'Success',
                    message: 'Proposal Sent Successfully',
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'success',
                    mode: 'pester'
                });
            }
            else if(e.getState() ==='ERROR') {
                var errors= response.getError();
                toastEvent.setParams({
                    title : 'Sent Error',
                    message: errors[0].message,
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