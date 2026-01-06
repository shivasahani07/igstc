angular.module('cp_app').controller('WISERgrant_ctrl', function($scope,$rootScope){

    debugger;
    $scope.siteURL = siteURL;
    $scope.applicantDetails = [];
    $scope.input=[];
    $scope.disableGrants = [];
    var statusLoginHas=0;
    $scope.pickListCurrency=$rootScope.currencyPickList;


    
$scope.getDataFromLocalStorage = function(){
    debugger;
    if(localStorage.getItem('candidateId')){
        $rootScope.candidateId = localStorage.getItem('candidateId');
    }
    if(localStorage.getItem('apaId')){
        $rootScope.apaId = localStorage.getItem('apaId');
        $scope.apaId = $rootScope.apaId;
    }
    if(localStorage.getItem('proposalId')){
        $rootScope.proposalId = localStorage.getItem('proposalId');
        $scope.proposalId = $rootScope.proposalId;
    }
}

$scope.getDataFromLocalStorage();

/**
 * Fetches proposal stage from Apex on page load
 */
$scope.getProposalStage = function(){
    debugger;
    if($rootScope.apaId && $rootScope.proposalId){
        ApplicantPortal_Contoller.getProposalStageUsingProposalId($rootScope.proposalId, $rootScope.apaId, function(result, event){
            debugger;
            if(event.status && result){
                $scope.proposalStage = (result.proposalStage != 'Draft' && result.proposalStage != null && result.proposalStage != undefined);
                $rootScope.proposalStage = $scope.proposalStage;
                $scope.$apply();
            }
        }, { escape: true });
    }
}

$scope.getProposalStage();


    $scope.getApplicantDetails = function(){
     ApplicantPortal_Contoller.getApplicantDetailsForGrantWISER($rootScope.contactId, function (result, event){
            if(event.status) {
                debugger;
                $scope.applicantDetails = result;
                $scope.grants = [];
                for(var i=0;i<$scope.applicantDetails.length;i++){
                    statusLoginHas=0;
                    if ($scope.applicantDetails[i].Contacts != undefined){
                        for(j = 0; j < $scope.applicantDetails[i].Contacts.length; j++){
                            if ($scope.applicantDetails[i].Contacts[j].Login_Hash_Code__c == $rootScope.candidateId){
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
                    if($scope.input[i].Existing_Grants__r == undefined){
                        var rec = {
                            'Account__r.Name':$scope.input[i].Name,
                            'Title__c': '',
                            'Funding_Agency__c': '',
                            'Role_in_the_Project__c': '',
                            'Budget__c': '',
                            'Starting_Date__c': '',
                            'End_Date__c': '',
                            'Account__c': $scope.input[i].Id,
                            'Application__c': $rootScope.proposalId
                        };
                        $scope.input[i].Existing_Grants__r = [];
                        debugger;
                        $scope.input[i].Existing_Grants__r.push(rec);
                    }else{
                        for(var j=0;j<$scope.input[i].Existing_Grants__r.length;j++){
                            if($scope.input[i].Existing_Grants__r[j].Title__c != undefined || $scope.input[i].Existing_Grants__r[j].Title__c != ''){
                                $scope.input[i].Existing_Grants__r[j].Title__c = $scope.input[i].Existing_Grants__r[j].Title__c ? $scope.input[i].Existing_Grants__r[j].Title__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.input[i].Existing_Grants__r[j].Title__c;  
                            }
                            if($scope.input[i].Existing_Grants__r[j].Funding_Agency__c != undefined || $scope.input[i].Existing_Grants__r[j].Funding_Agency__c != ''){
                                $scope.input[i].Existing_Grants__r[j].Funding_Agency__c = $scope.input[i].Existing_Grants__r[j].Funding_Agency__c ? $scope.input[i].Existing_Grants__r[j].Funding_Agency__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.input[i].Existing_Grants__r[j].Funding_Agency__c;  
                            }
                            if($scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c != undefined || $scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c != ''){
                                $scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c = $scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c ? $scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c;  
                            }
                        }
                    }
                }
        //         for(var i=0;i<$scope.disableGrants.length;i++){
        //             if($scope.disableGrants[i].Existing_Grants__r != undefined){
        //               for(var j=0;j<$scope.disableGrants[i].Existing_Grants__r.length;j++){
        //                 if($scope.disableGrants[i].Existing_Grants__r[j].Starting_Date__c != undefined){
        //                     var date = new Date($scope.disableGrants[i].Existing_Grants__r[j].Starting_Date__c);
        //                     var year = date.getUTCFullYear();
        //                     var month = date.getMonth()+1;
        //                     var day = date.getDate();
        //                     $scope.disableGrants[i].Existing_Grants__r[j].Starting_Date__c   = year.toString()+'-'+month.toString()+'-'+day.toString();
        //             }
        //         }
        //     }
        // }
                    
                    var existingGrant = [{"title":"","fundingagency":"","Account":"","AccountName":"","role":"","budget":"","id":"","startDate":"","endDate":"","Application":""}];
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
        // for(var i=0;i<$scope.input.length;i++){
        //     for(var j=0;j<$scope.input[i].Existing_Grants__r.length;j++){

        //         if($scope.input[i].Existing_Grants__r[j].Title__c == undefined || $scope.input[i].Existing_Grants__r[j].Title__c == ""){
        //             swal("Existing Grants", "Please Enter Title.");
        //             $("#title"+j+"").addClass('border-theme');
        //             return;
        //         }
        //         if($scope.input[i].Existing_Grants__r[j].Funding_Agency__c == undefined || $scope.input[i].Existing_Grants__r[j].Funding_Agency__c == ""){
        //             swal("Existing Grants", "Please Enter Funding Agency.");
        //             $("#funding"+i+"").addClass('border-theme');
        //             return;
        //         }
        //         if($scope.input[i].Existing_Grants__r[j].Budget__c == undefined || $scope.input[i].Existing_Grants__r[j].Budget__c == ""){
        //             swal("Existing Grants", "Please Enter Budget.");
        //             $("#budget"+i+"").addClass('border-theme');
        //             return;
        //         }
        //         if($scope.input[i].Existing_Grants__r[j].Starting_Date__c == undefined || $scope.input[i].Existing_Grants__r[j].Starting_Date__c == ""){
        //             swal("Existing Grants", "Please Enter Starting Date.");
        //             $("#startDate"+i+"").addClass('border-theme');
        //             return;
        //         }
        //         if($scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c == undefined || $scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c == ""){
        //             swal("Existing Grants", "Please Enter role(Number in months).");
        //             $("#role"+i+"").addClass('border-theme');
        //             return;
        //         }
        //     }
        // }
        $scope.grantList = [];
        for(let i=0; i<$scope.grants.length; i++){
            delete ($scope.grants[i]['Name']);
            delete ($scope.grants[i]['$$hashKey']);
          
            for(let j=0; j<$scope.input[i].Existing_Grants__r.length; j++){
                // if($scope.input[i].Existing_Grants__r[j].Budget__c == undefined || $scope.input[i].Existing_Grants__r[j].Budget__c == ""){
                //     $scope.input[i].Existing_Grants__r[j].Budget__c = 0;
                //     // Number('$scope.applicantDetails[i].Existing_Grants__r[j].Budget__c');
                // }
                // if($scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c == undefined || $scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c == ""){
                //     $scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c = 0;
                //     // Number('$scope.applicantDetails[i].Existing_Grants__r[j].Role_in_the_Project__c'); 
                // }
                var grantApplication = {"title":"","fundingagency":"","Account":$scope.input[i].Id,"AccountName":$scope.input[i].Name,"role":"",currencyPick:"","budget":"","id":"","startDate":"","endDate":"","Application":""};
                    grantApplication.Account = $scope.input[i].Id;
                    grantApplication.Application = $rootScope.proposalId;
                    grantApplication.AccountName = $scope.input[i].Name;
                    grantApplication.id = $scope.input[i].Existing_Grants__r[j].Id==undefined?null:$scope.input[i].Existing_Grants__r[j].Id;
                    grantApplication.title = $scope.input[i].Existing_Grants__r[j].Title__c;
                    grantApplication.fundingagency = $scope.input[i].Existing_Grants__r[j].Funding_Agency__c;
                    grantApplication.role = $scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c;
                    grantApplication.budget = $scope.input[i].Existing_Grants__r[j].Budget__c;
                    grantApplication.currencyPick = $scope.input[i].Existing_Grants__r[j].Currency__c;
                    grantApplication.startDate = $scope.input[i].Existing_Grants__r[j].Starting_Date__c;
                    grantApplication.endDate = $scope.input[i].Existing_Grants__r[j].End_Date__c;
                    $scope.grantList.push(grantApplication);
    
                // if($scope.input[i].Existing_Grants__r[j].Starting_Date__c != undefined && $scope.input[i].Existing_Grants__r[j].Starting_Date__c != ""){
                //     grantApplication.startingyear = $scope.input[i].Existing_Grants__r[j].Starting_Date__c.getUTCFullYear();
                //     grantApplication.startingmonth = $scope.input[i].Existing_Grants__r[j].Starting_Date__c.getUTCMonth()+1;
                //     grantApplication.startingday = $scope.input[i].Existing_Grants__r[j].Starting_Date__c.getDate();
                // }else{
                //     delete ($scope.input[i].Existing_Grants__r[j].Starting_Date__c);     
                // }
    
                // delete ($scope.input[i].Existing_Grants__r[j].Starting_Date__c);
            }
        }
        ApplicantPortal_Contoller.insertExistingGrantsWISER($scope.grantList, function(result, event){
          if(event.status && result !=null){
                              console.log("Result ::"+result);
                             
                             
                              swal({
                                   title: "Success",
                                   text:  'Your Existing Grant details have been saved successfully.',
                                   icon: "success",
                                 button: "ok!",
                            });
                            $scope.redirectPageURL('CV_Wiser');
                            
                    // window.location.replace('https://dev-igstc.cs114.force.com/ApplicantDashboard/ApplicantPortal?id='+$rootScope.userId+'#/AttachmentsInWiser');
                         }else{
                              swal({
                                   title: "Error",
                                   text: "Exception!",
                                   icon: "error",
                                   button: "ok!",
                                 });
                         }
                    })
                }
    
    $scope.addRow = function (index) {
        debugger;
        var rec = {
            'Account__r.Name':$scope.input[index].Name,
            'Title__c': '',
            'Funding_Agency__c': '',
            'Role_in_the_Project__c': '',
            'Budget__c': '',
            'Starting_Date__c': '',
            'Account__c': $scope.input[index].Id,
            'Application__c': $rootScope.proposalId
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

    $scope.previousPage = function(){
          debugger;
          $scope.redirectPageURL('TwoReferenceWiser');
          // window.location.replace(window.location.origin+'/ApplicantDashboard/ApplicantPortal?id='+$rootScope.userId+'#/TwoReferenceWiser');
       }

       $scope.removeClass=function(controlid,index){
        var controlIdfor=controlid+""+index;
        $("#"+controlIdfor+"").removeClass('border-theme');
      }

});