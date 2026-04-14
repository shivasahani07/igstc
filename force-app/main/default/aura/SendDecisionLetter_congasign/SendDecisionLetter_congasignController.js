({
    doInit : function(component, event, helper) {
        debugger;
        console.log('qqqqqq0=>',component.get("v.fileId"));
        /*var action = component.get("c.ifDecisionLetter2");
        action.setParams({
            proID : component.get("v.recordId")
        });
        action.setCallback(this,function(e){
            if(e.getState()=='SUCCESS'){
                var result=e.getReturnValue();
            }
            else{
                alert(JSON.stringify(e.getError()));
            }
        });
        */
        window.setTimeout( 
            $A.getCallback(function(){ 
                console.log('qqqqqq1=>',component.get("v.fileId"));
                helper.helperMethod(component, event);
                component.set("v.showSpinner", false); 
                console.log('qqqqqq2=>',component.get("v.fileId"));
            }), 15000 
        );
        //$A.enqueueAction(action);  
    },
    
    
    
    handleSend: function(component, event, helper) {
        debugger;
        var action = component.get("c.sendProposalDecision");
        action.setParams({
            propId : component.get("v.recordId"),
            attId : component.get("v.fileId")
        });
        
        
        action.setCallback(this,function(e){
            var toastEvent = $A.get("e.force:showToast");
            if(e.getReturnValue()==='Approved'){
                toastEvent.setParams({
                    title : 'Success',
                    message: 'Decision Letter Sent Successfully',
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'success',
                    mode: 'pester'
                });
            }
            else if(e.getReturnValue() !='Approved') {
                //var errors= response.getError();
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