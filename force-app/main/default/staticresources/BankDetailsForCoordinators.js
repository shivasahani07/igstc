angular.module('cp_app').controller('bankDetails_ctrl',function($scope, $rootScope){
debugger;

    $scope.siteURL = siteURL;
    $rootScope.projectId;
    $scope.bankType = bankType;
    $scope.applicantDetails = []
    $scope.bankDetailsList = [];

    $scope.getBankDetails = function () {
        debugger;
        ApplicantPortal_Contoller.getBankDetails($rootScope.userId, function (result, event) {
            if (event.status) {
                debugger;
                $scope.applicantDetails = result;                  
                for(var i=0;i<$scope.applicantDetails.length;i++){
                    if($scope.applicantDetails[i].Bank_Details__r == undefined){
                        var rec = {
                            "Account__c": $scope.applicantDetails[i].Id,
                            "Bank_Account_Number__c":"",
                            "Bank_Branch_Name__c":"",
                            "Bank_HSN_Code__c":"",
                            "Bank_IFSC_Code__c":"",
                            "Bank_Name__c":"",
                            "Bank_SWIFT_Code__c":"",
                            "Bank_Type__c":"",
                            "Bank_Address__c":""
                        }
                        $scope.applicantDetails[i].Bank_Details__r = [];
                        debugger;
                        $scope.applicantDetails[i].Bank_Details__r.push(rec);
                    }
                }
                $scope.$apply();      
            }
        }, 
        {escape: true}
        )
    }
    $scope.getBankDetails();

    $scope.submitBankDetails = function(){
        debugger;
        // for (let i = 0; i < $scope.applicantDetails.length; i++) {
        //     if($scope.applicantDetails[i].Bank_Details__r != undefined && $scope.applicantDetails[i].Bank_Details__r.length > 0){
        //     for(let j=0;j<$scope.applicantDetails[i].Bank_Details__r.length;j++){
        //         delete ($scope.applicantDetails[i].Bank_Details__r[j]['$$hashKey']);
        //         $scope.bankDetailsList.push($scope.applicantDetails[i].Bank_Details__r[j]);
        //     }
        // }
        // }

        // if($scope.bankDetailsList != undefined){
            for (let i=0; i<$scope.applicantDetails.length; i++) {
                if($scope.applicantDetails[i].Bank_Details__r != undefined && $scope.applicantDetails[i].Bank_Details__r.length > 0){
                    for(var j=0;j<$scope.applicantDetails[i].Bank_Details__r.length;j++){
                        if($scope.applicantDetails[i].Bank_Details__r[j].Bank_Name__c == undefined || $scope.applicantDetails[i].Bank_Details__r[j].Bank_Name__c == ""){
                            swal("Bank Details", "Please Enter Bank Name.");
                        return;
                        }
        
                        if($scope.applicantDetails[i].Bank_Details__r[j].Bank_Type__c == undefined || $scope.applicantDetails[i].Bank_Details__r[j].Bank_Type__c == ""){
                            swal("Bank Details", "Please Select Bank Type.");
                        return;
                        }
        
                        if($scope.applicantDetails[i].Bank_Details__r[j].Bank_Account_Number__c == undefined || $scope.applicantDetails[i].Bank_Details__r[j].Bank_Account_Number__c == ""){
                            swal("Bank Details", "Please Enter Bank Account Number.");
                        return;
                        }
        
                        if($scope.applicantDetails[i].Bank_Details__r[j].Bank_Branch_Name__c == undefined || $scope.applicantDetails[i].Bank_Details__r[j].Bank_Branch_Name__c == ""){
                            swal("Bank Details", "Please Enter Bank Branch Name.");
                        return;
                        }
        
                        if($scope.applicantDetails[i].Country_Type__c == "India" &&($scope.applicantDetails[i].Bank_Details__r[j].Bank_IFSC_Code__c == undefined || $scope.applicantDetails[i].Bank_Details__r[j].Bank_IFSC_Code__c == "")){
                            swal("Bank Details", "Please Enter Bank IFSC Code as it is mandatory for Indian Partner only.");
                        return;
                        }
        
                        if($scope.applicantDetails[i].Country_Type__c == "Germany" &&($scope.applicantDetails[i].Bank_Details__r[j].Bank_SWIFT_Code__c == undefined || $scope.applicantDetails[i].Bank_Details__r[j].Bank_SWIFT_Code__c == "")){
                            swal("Bank Details", "Please Enter Bank SWIFT Code as it is mandatory for German Partner only.");
                        return;
                        }
        
                        if($scope.applicantDetails[i].Bank_Details__r[j].Bank_Address__c == undefined || $scope.applicantDetails[i].Bank_Details__r[j].Bank_Address__c == ""){
                            swal("Bank Details", "Please Enter Bank Bank Address.");
                        return;
                        }
                    }
                }
            }
        // }
        for (let i = 0; i < $scope.applicantDetails.length; i++) {
            delete ($scope.applicantDetails[i]['Name']);
            delete ($scope.applicantDetails[i]['$$hashKey']);
            if($scope.applicantDetails[i].Bank_Details__r != undefined && $scope.applicantDetails[i].Bank_Details__r.length > 0){
            for(let j=0;j<$scope.applicantDetails[i].Bank_Details__r.length;j++){
                delete ($scope.applicantDetails[i].Bank_Details__r[j]['$$hashKey']);
                $scope.bankDetailsList.push($scope.applicantDetails[i].Bank_Details__r[j]);
            }
        }
        }
        ApplicantPortal_Contoller.upsertBankDetails($scope.bankDetailsList, function (result, event) {
            if (event.status) {
                debugger;
                Swal.fire(
                    'Success',
                    'Bank Detail has been saved successfully.',
                    'success'
                );
                $scope.redirectPageURL('Financial_Details');
                $scope.bankDetailsList = result;
                $scope.$apply();
            }
        },
        )
    }

    $scope.redirectPageURL = function(pageName){
        debugger;
        var link=document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href="#/"+pageName;
        link.click();
    }
});