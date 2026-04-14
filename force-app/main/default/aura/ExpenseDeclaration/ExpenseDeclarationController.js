({
	doInit : function(cmp, event, helper) {
        cmp.set('v.siteURL','/apex/ExpenseDeclaration_V1');
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url":"/apex/ExpenseDeclaration_V1"
        });
        urlEvent.fire(); 
		
	}
})