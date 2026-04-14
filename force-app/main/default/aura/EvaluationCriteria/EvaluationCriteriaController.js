({
	doInit : function(component, event, helper) {
        debugger;
        var action = component.get("c.getEvaluationRecords");
        action.setParams({
            proposalId : component.get("v.recordId")
        });
        action.setCallback(this,function(response){
            if(response.getState() === 'SUCCESS'){
                var result = response.getReturnValue();
                if(result != null){
                    component.set("v.EvaluationRecordsList",result);
                    helper.helperMethod(component, event);
                }
            } 
        });
		$A.enqueueAction(action);
	},
    
    SaveEvaluationRecords : function(component, event, helper) {
        debugger;
        helper.showSpinner(component);
        var action = component.get("c.saveEvaluationRecords");
        action.setParams({
            "evaluationRecordList" : component.get("v.EvaluationRecordsList")
        });
        action.setCallback(this,function(response){
            if(response.getState() === 'SUCCESS'){
                helper.hideSpinner(component);
                var result = response.getReturnValue();
                if(result != null){
                    let ToastMessage = component.get("c.showInfo");
                    $A.enqueueAction(ToastMessage);
                    var dismissActionPanel = $A.get("e.force:closeQuickAction");
                    dismissActionPanel.fire();
                    $A.get('e.force:refreshView').fire();
                }
            } 
        });
		$A.enqueueAction(action);
	},

    SaveAsDraftEvaluationRecords : function(component, event, helper) {
        debugger;
        helper.showSpinner(component);
        var action = component.get("c.SaveDraftEvaluationRecords");
        action.setParams({
            "evaluationRecordList" : component.get("v.EvaluationRecordsList")
        });
        action.setCallback(this,function(response){
            if(response.getState() === 'SUCCESS'){
                helper.hideSpinner(component);
                var result = response.getReturnValue();
                if(result != null){
                    let ToastMessage = component.get("c.showInfo");
                    $A.enqueueAction(ToastMessage);
                    var dismissActionPanel = $A.get("e.force:closeQuickAction");
                    dismissActionPanel.fire();
                    $A.get('e.force:refreshView').fire();
                }
            } 
        });
		$A.enqueueAction(action);
	},
    
    handleyesCheckboxChange : function(component, event, helper) {
        debugger;
        var selectedItem = event.currentTarget;
        var index = selectedItem.dataset.record;       
        var evaluationList = component.get("v.EvaluationRecordsList");
        for(var i = 0 ; i< evaluationList.length ;i++){
            if(evaluationList[i].Id == index){
                if(evaluationList[i].Yes__c){
                    evaluationList[i].Yes__c = false; 
                }else{
                    evaluationList[i].Yes__c = true;
                }
            }
        }
        component.set("v.EvaluationRecordsList",evaluationList);
	},
    
    showInfo : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'SUCCESS',
            message: 'Eligibility checked have been successfully submitted !!!!',
            duration:' 5000',
            key: 'info_alt',
            type: 'success',
            mode: 'pester'
        });
        toastEvent.fire();
    },

    showInfo2 : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'SUCCESS',
            message: 'Records have been saved as Draft.',
            duration:' 5000',
            key: 'info_alt',
            type: 'success',
            mode: 'pester'
        });
        toastEvent.fire();
    }
    
})