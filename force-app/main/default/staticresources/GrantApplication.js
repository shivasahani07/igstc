angular.module('cp_app').controller('grant_ctrl', function($scope,$rootScope){
    debugger;
    $scope.siteURL = siteURL;
    $scope.applicantDetails = [];
    $scope.input=[];
    $scope.disableGrants = [];
    var statusLoginHas=0;

    $scope.getApplicantDetails = function(){
        ApplicantPortal_Contoller.getApplicantDetailsForGrant($rootScope.userId, function (result, event){
            if(event.status) {
                debugger;
                $scope.applicantDetails = result;
                $scope.grants = [];
                for(var i=0;i<$scope.applicantDetails.length;i++){
                    statusLoginHas=0;
                    if ($scope.applicantDetails[i].Contacts != undefined){
                        for(j = 0; j < $scope.applicantDetails[i].Contacts.length; j++){
                            if ($scope.applicantDetails[i].Contacts[j].Login_Hash_Code__c == $rootScope.userId){
                                $scope.input.push($scope.applicantDetails[i]);
                                statusLoginHas=1;
                            }
                        }
                    }
                    if(statusLoginHas==0){
                        $scope.disableGrants.push($scope.applicantDetails[i]);
                    }
                }
                for(var i=0;i<$scope.input.length;i++){
                    if($scope.input[i].Existing_Grants__r != undefined){
                        for(var j=0;j<$scope.input[i].Existing_Grants__r.length;j++){
                            if($scope.input[i].Existing_Grants__r[j].Starting_Date__c != undefined){
                                $scope.input[i].Existing_Grants__r[j].Starting_Date__c   = new Date($scope.input[i].Existing_Grants__r[j].Starting_Date__c);
                            }
                        }
                            
                    }else if($scope.input[i].Existing_Grants__r == undefined){
                        var rec = {
                            'Account__r.Name':$scope.input[i].Name,
                            'Title__c': '',
                            'Funding_Agency__c': '',
                            'Duration__c': '',
                            'Budget__c': '',
                            'Starting_Date__c': '',
                            'Account__c': $scope.input[i].Id,
                            'Application__c': $scope.input[i].Proposals__c
                        };
                        $scope.input[i].Existing_Grants__r = [];
                        debugger;
                        $scope.input[i].Existing_Grants__r.push(rec);
                    }
                }
                for(var i=0;i<$scope.disableGrants.length;i++){
                    if($scope.disableGrants[i].Existing_Grants__r != undefined){
                      for(var j=0;j<$scope.disableGrants[i].Existing_Grants__r.length;j++){
                        if($scope.disableGrants[i].Existing_Grants__r[j].Starting_Date__c != undefined){
                            var date = new Date($scope.disableGrants[i].Existing_Grants__r[j].Starting_Date__c);
                            var year = date.getUTCFullYear();
                            var month = date.getMonth()+1;
                            var day = date.getDate();
                            $scope.disableGrants[i].Existing_Grants__r[j].Starting_Date__c   = year.toString()+'-'+month.toString()+'-'+day.toString();
                    }
                }
            }
        }
                    
                    var existingGrant = [{"title":"","fundingagency":"","Account":"","AccountName":"","duration":"","budget":"","id":"","startingyear":0,"startingmonth":0,"startingday":0,"Application":""}];
                    $scope.grants.push(existingGrant);
                $scope.$apply();
            }
        },
        {escape: true}
        )
    }

    $scope.getApplicantDetails();

    $scope.submitExistingGrants = function(){
        debugger;
        for(var i=0;i<$scope.input.length;i++){
            for(var j=0;j<$scope.input[i].Existing_Grants__r.length;j++){
                if($scope.input[i].Existing_Grants__r[j].Funding_Agency__c == undefined || $scope.input[i].Existing_Grants__r[j].Funding_Agency__c == ""){
                    swal("Existing Grants", "Please Enter Funding Agency.");
                    return;
                }
                if($scope.input[i].Existing_Grants__r[j].Budget__c == undefined || $scope.input[i].Existing_Grants__r[j].Budget__c == ""){
                    swal("Existing Grants", "Please Enter Budget.");
                    return;
                }
                if($scope.input[i].Existing_Grants__r[j].Starting_Date__c == undefined || $scope.input[i].Existing_Grants__r[j].Starting_Date__c == ""){
                    swal("Existing Grants", "Please Enter Starting Date.");
                    return;
                }
                if($scope.input[i].Existing_Grants__r[j].Duration__c == undefined || $scope.input[i].Existing_Grants__r[j].Duration__c == ""){
                    swal("Existing Grants", "Please Enter Duration(Number in months).");
                    return;
                }
            }
        }
        $scope.grantList = [];
        for(let i=0; i<$scope.grants.length; i++){
            delete ($scope.grants[i]['Name']);
            delete ($scope.grants[i]['$$hashKey']);
          
            for(let j=0; j<$scope.input[i].Existing_Grants__r.length; j++){
                if($scope.input[i].Existing_Grants__r[j].Budget__c == undefined || $scope.input[i].Existing_Grants__r[j].Budget__c == ""){
                    $scope.input[i].Existing_Grants__r[j].Budget__c = 0;
                    // Number('$scope.applicantDetails[i].Existing_Grants__r[j].Budget__c');
                }
                if($scope.input[i].Existing_Grants__r[j].Duration__c == undefined || $scope.input[i].Existing_Grants__r[j].Duration__c == ""){
                    $scope.input[i].Existing_Grants__r[j].Duration__c = 0;
                    // Number('$scope.applicantDetails[i].Existing_Grants__r[j].Duration__c'); 
                }
                var grantApplication = {"title":"","fundingagency":"","Account":$scope.input[i].Id,"AccountName":$scope.input[i].Name,"duration":"","budget":"","id":"","startingyear":0,"startingmonth":0,"startingday":0,"Application":""};
                    grantApplication.Account = $scope.input[i].Id;
                    grantApplication.Application = $scope.input[i].Proposals__c;
                    grantApplication.AccountName = $scope.input[i].Name;
                    grantApplication.id = $scope.input[i].Existing_Grants__r[j].Id;
                    grantApplication.title = $scope.input[i].Existing_Grants__r[j].Title__c;
                    grantApplication.fundingagency = $scope.input[i].Existing_Grants__r[j].Funding_Agency__c;
                    grantApplication.duration = $scope.input[i].Existing_Grants__r[j].Duration__c;
                    grantApplication.budget = $scope.input[i].Existing_Grants__r[j].Budget__c;
                    $scope.grantList.push(grantApplication);
    
                if($scope.input[i].Existing_Grants__r[j].Starting_Date__c != undefined && $scope.input[i].Existing_Grants__r[j].Starting_Date__c != ""){
                    grantApplication.startingyear = $scope.input[i].Existing_Grants__r[j].Starting_Date__c.getUTCFullYear();
                    grantApplication.startingmonth = $scope.input[i].Existing_Grants__r[j].Starting_Date__c.getUTCMonth()+1;
                    grantApplication.startingday = $scope.input[i].Existing_Grants__r[j].Starting_Date__c.getDate();
                }else{
                    delete ($scope.input[i].Existing_Grants__r[j].Starting_Date__c);     
                }
    
                delete ($scope.input[i].Existing_Grants__r[j].Starting_Date__c);
            }
        }
        ApplicantPortal_Contoller.insertExistingGrants($scope.grantList, function(result, event){
            if(event.status){
             debugger;
             Swal.fire(
                 'Success',
                 'your proposal has been Submitted successfully.',
                 'success'
             );
            //  
            $scope.redirectPageURL('Home');
             $scope.grantList = result;
             $scope.$apply();  
         }
        },
        {escape:true}
        )
    }

    // Save As Draft

    $scope.insertExistingGrantsAsDraft = function(){
    debugger;
    for(var i=0;i<$scope.input.length;i++){
        for(var j=0;j<$scope.input[i].Existing_Grants__r.length;j++){
            if($scope.input[i].Existing_Grants__r[j].Funding_Agency__c == undefined || $scope.input[i].Existing_Grants__r[j].Funding_Agency__c == ""){
                swal("Existing Grants", "Please Enter Funding Agency.");
                return;
            }
            if($scope.input[i].Existing_Grants__r[j].Budget__c == undefined || $scope.input[i].Existing_Grants__r[j].Budget__c == ""){
                swal("Existing Grants", "Please Enter Budget.");
                return;
            }
            if($scope.input[i].Existing_Grants__r[j].Starting_Date__c == undefined || $scope.input[i].Existing_Grants__r[j].Starting_Date__c == ""){
                swal("Existing Grants", "Please Enter Starting Date.");
                return;
            }
            if($scope.input[i].Existing_Grants__r[j].Duration__c == undefined || $scope.input[i].Existing_Grants__r[j].Duration__c == ""){
                swal("Existing Grants", "Please Enter Duration(Number in months).");
                return;
            }
        }
    }
    $scope.grantList = [];
    for(let i=0; i<$scope.grants.length; i++){
        delete ($scope.grants[i]['Name']);
        delete ($scope.grants[i]['$$hashKey']);
      
        for(let j=0; j<$scope.input[i].Existing_Grants__r.length; j++){
            if($scope.input[i].Existing_Grants__r[j].Budget__c == undefined || $scope.input[i].Existing_Grants__r[j].Budget__c == ""){
                $scope.input[i].Existing_Grants__r[j].Budget__c = 0;
                // Number('$scope.applicantDetails[i].Existing_Grants__r[j].Budget__c');
            }
            if($scope.input[i].Existing_Grants__r[j].Duration__c == undefined || $scope.input[i].Existing_Grants__r[j].Duration__c == ""){
                $scope.input[i].Existing_Grants__r[j].Duration__c = 0;
                // Number('$scope.applicantDetails[i].Existing_Grants__r[j].Duration__c'); 
            }
            var grantApplication = {"title":"","fundingagency":"","Account":$scope.input[i].Id,"AccountName":$scope.input[i].Name,"duration":"","budget":"","id":"","startingyear":0,"startingmonth":0,"startingday":0,"Application":""};
                grantApplication.Account = $scope.input[i].Id;
                grantApplication.Application = $scope.input[i].Proposals__c;
                grantApplication.AccountName = $scope.input[i].Name;
                grantApplication.id = $scope.input[i].Existing_Grants__r[j].Id;
                grantApplication.title = $scope.input[i].Existing_Grants__r[j].Title__c;
                grantApplication.fundingagency = $scope.input[i].Existing_Grants__r[j].Funding_Agency__c;
                grantApplication.duration = $scope.input[i].Existing_Grants__r[j].Duration__c;
                grantApplication.budget = $scope.input[i].Existing_Grants__r[j].Budget__c;
                $scope.grantList.push(grantApplication);

            if($scope.input[i].Existing_Grants__r[j].Starting_Date__c != undefined && $scope.input[i].Existing_Grants__r[j].Starting_Date__c != ""){
                grantApplication.startingyear = $scope.input[i].Existing_Grants__r[j].Starting_Date__c.getUTCFullYear();
                grantApplication.startingmonth = $scope.input[i].Existing_Grants__r[j].Starting_Date__c.getUTCMonth()+1;
                grantApplication.startingday = $scope.input[i].Existing_Grants__r[j].Starting_Date__c.getDate();
            }else{
                delete ($scope.input[i].Existing_Grants__r[j].Starting_Date__c);     
            }

            delete ($scope.input[i].Existing_Grants__r[j].Starting_Date__c);
        }
    }
    ApplicantPortal_Contoller.insertExistingGrantsAsDraft($scope.grantList, function(result, event){
        if(event.status){
         debugger;
         Swal.fire(
             '',
             'Your Proposal has been saved as Draft .',
             'success'
         );
         $scope.redirectPageURL('Home');
         $scope.grantList = result;
         $scope.$apply();  
     }
    },
    {escape:true}
    )
}
    
    $scope.addRow = function (index) {
        debugger;
        var rec = {
            'Account__r.Name':$scope.input[index].Name,
            'Title__c': '',
            'Funding_Agency__c': '',
            'Duration__c': '',
            'Budget__c': '',
            'Starting_Date__c': '',
            'Account__c': $scope.input[index].Id,
            'Application__c': $scope.input[index].Proposals__c
        };
        $scope.input[index].Existing_Grants__r.push(rec);
    }

    $scope.deleteRow = function (param1,param2) {
        debugger;
        if ($scope.input[param1].Existing_Grants__r.length > 1){
            if($scope.input[param1].Id != undefined){
                $scope.deleteGrants($scope.input[param1].Existing_Grants__r[param2].Id);
            }
            $scope.input[param1].Existing_Grants__r.splice(param2, 1);
        }
    }

    $scope.deleteGrants = function(grantstId){
        ApplicantPortal_Contoller.deleteGrants(grantstId, function (result, event) {
            if (event.status) {
                debugger;
                Swal.fire(
                    'Success',
                    'Deleted Succesfully.',
                    'success'
                );
                $scope.$apply();
            }
        },
            {escape: true}
            )
    }

    $scope.redirectPageURL = function(pageName){
        debugger;
        var link=document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href="#/"+pageName;
        link.click();
    }

    $scope.abc = function(){
        debugger;
    }

    $scope.abc();
});