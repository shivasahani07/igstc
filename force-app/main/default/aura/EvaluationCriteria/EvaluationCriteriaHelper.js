({
	showSpinner: function (component, event, helper) {
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
    },
     
    hideSpinner: function (component, event, helper) {
        var spinner = component.find("mySpinner");
        $A.util.addClass(spinner, "slds-hide");
    },

    helperMethod : function(component, event) {
        window.setTimeout(
            $A.getCallback(function() {
                var action = component.get("c.getAttachmentId");
                action.setParams({
                    propId : component.get("v.recordId")
                });
                action.setCallback(this,function(e){
                    if(e.getState()=='SUCCESS'){
                        var result=e.getReturnValue();
                        component.set("v.fileId", result);
                    }
                    else{
                        alert(JSON.stringify(e.getError()));
                    }
                });
                $A.enqueueAction(action); 
            }),
            10000 // 10 seconds delay
        ); 
    }
})