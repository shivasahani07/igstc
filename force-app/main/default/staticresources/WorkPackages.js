angular.module('cp_app').controller('workPackageCtrl', function ($scope, $rootScope) {
    debugger;
    $scope.siteURL = siteURL;
    $rootScope.projectId;
    $scope.disable = false;
    $rootScope.secondstage;
    $scope.workPackList = [];
    $scope.applicantDetails = [];
    $scope.accDetails = [];
    $scope.AccountList = [];
    $scope.show = false;
    $scope.defaultAccountList = [];
    const accountIdXaccount = new Map();
    $scope.getProposalAccounts = function () {
        ApplicantPortal_Contoller.getProposalAccounts($rootScope.projectId, function (result, event) {
            if (event.status) {
                $scope.AccountList = result;
                if ($scope.AccountList != undefined) {
                    for (var i = 0; i < $scope.AccountList.length; i++) {
                        accountIdXaccount.set($scope.AccountList[i].Id, $scope.AccountList[i]);
                    }

                    for (var i = 0; i < $scope.AccountList.length; i++) {
                        var option = {
                            'Id': $scope.AccountList[i].Id,
                            'Name': $scope.AccountList[i].Name,
                            'selected': false
                        };
                        $scope.defaultAccountList.push(option);
                    }
                }
            }
        });
    }


    $scope.getDetails = function () {
        ApplicantPortal_Contoller.getWPDetails($rootScope.userId, function (result, event) {
            debugger
            console.log('work packages data');
            console.log(result);
            if (event.status && result) {
                debugger;
                for(var i=0;i<result.length;i++){
                    if(result[i].Work_Package_Detail__c != undefined || result[i].Work_Package_Detail__c != ""){
                        result[i].Work_Package_Detail__c = result[i].Work_Package_Detail__c ? result[i].Work_Package_Detail__c.replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result[i].Work_Package_Detail__c;
                    }
                }
                $scope.applicantDetails = result;
                if ($scope.applicantDetails.length > 0) {
                    $scope.allAccountDetails = [];
                    for (var i = 0; i < $scope.applicantDetails.length; i++) {
                        const accountIdXselectedAcc = new Map();

                        if ($scope.applicantDetails[i].Account_Mapping__r != undefined) {
                            for (var j = 0; j < $scope.applicantDetails[i].Account_Mapping__r.length; j++) {
                                accountIdXselectedAcc.set($scope.applicantDetails[i].Account_Mapping__r[j].Account__c, $scope.applicantDetails[i].Account_Mapping__r[j]);
                            }
                            var accDetails = [];
                            for (const accountId of accountIdXaccount.keys()) {
                                if (accountIdXselectedAcc.has(accountId)) {
                                    var option = {
                                        'Id': accountIdXaccount.get(accountId).Id,
                                        'Name': accountIdXaccount.get(accountId).Name,
                                        'selected': true,
                                        'accountMappingId': accountIdXselectedAcc.get(accountId).Id
                                    };
                                } else {
                                    var option = {
                                        'Id': accountIdXaccount.get(accountId).Id,
                                        'Name': accountIdXaccount.get(accountId).Name,
                                        'selected': false
                                    };
                                }
                                accDetails.push(option);
                            }
                        } else {
                            accDetails= $scope.defaultAccountList;
                        }
                        $scope.workPackList.push({
                            "trl_level": $scope.applicantDetails[i].TRL_Level__c,
                            "AccountList": accDetails,
                            "title": $scope.applicantDetails[i].Title__c,
                            "duration": $scope.applicantDetails[i].Duration__c,
                            Workpackage_detail: $scope.applicantDetails[i].Work_Package_Detail__c,
                            "WPSequence": $scope.applicantDetails[i].WP_Sequence__c,
                            Id: $scope.applicantDetails[i].Id,
                            end_trl_level: $scope.applicantDetails[i].End_TRL_Level__c,
                            externalId: i
                        });
                    }


                } else {
                    $scope.workPackList.push({
                        end_trl_level: "",
                        externalId: 0,
                        "AccountList": $scope.defaultAccountList
                    });
                }
                $scope.$apply();
            }
        }, {
            escape: true
        })
    }
    $scope.OpenPopup = function (index) {
        var myModal = new bootstrap.Modal(document.getElementById('flipFlop' + index + ''))
        myModal.show('slow')
        $scope.$apply();
    }
    // $scope.ClosePopup = function (index) {
    //     $('#flipFlop' + index + '').modal('hide');
    //     $scope.$apply();
    // }
    $scope.getProposalAccounts();
    $scope.getDetails();

    $scope.redirectPageURL = function (pageName) {
        debugger;
        var link = document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href = "#/" + pageName;
        link.click();
    }
    $scope.addRowsWorkPackage = function () {
        debugger
        var arrayLength = $scope.workPackList.length;
        var externalid = $scope.workPackList[arrayLength - 1].externalId;
        var accList = [];
        for (var i = 0; i < $scope.AccountList.length; i++) {
            var option = {
                'Id': $scope.AccountList[i].Id,
                'Name': $scope.AccountList[i].Name,
                'selected': false
            };
            accList.push(option);
        }
        $scope.workPackList.push({
            end_trl_level: "",
            externalId: externalid + 1,
            AccountList: accList
        });
        $scope.$apply();
    }
    $scope.removeRow = function (index) {
        debugger;
        if ($scope.workPackList.length == 1) {
            return;
        }
        if($scope.workPackList[index].Id == undefined){
            $scope.workPackList.splice(index, 1);
            return;
        }
        IndustrialFellowshipController.deleteWorkPackageDetails($scope.workPackList[index].Id, function (result, event) {
            if (event.status) {
                swal("Work Package", "Your Work Package data has been Deleted Successfully");
                $scope.workPackList.splice(index, 1);
            }
            $scope.$apply();
        });
    }
    $scope.saveWorkPackageDet = function () {
        debugger
        var objData = $scope.workPackList;
        for (var i = 0; i < objData.length; i++) {

            var count = 0;
            for(var k = 0; k < objData[i].AccountList.length; k++){
                if(objData[i].AccountList[k].selected == true){
                    count = count+1;
                }
            }
            if(count <= 0){
                swal("Work Package Details", "Please Select Partners.");
                $("#account"+i+"").addClass('border-theme');
                return; 
            }
            
            if(objData[i].trl_level == undefined || objData[i].trl_level == ""){
                swal("Work Package Details", "Please Enter Start TRL Level.");
                $("#STL"+i+"").addClass('border-theme');
                    return;
            }
            if(objData[i].end_trl_level == undefined || objData[i].end_trl_level == ""){
                swal("Work Package Details", "Please Enter End TRL Level.");
                $("#ETL"+i+"").addClass('border-theme');
                    return;
            }
            if(objData[i].title == undefined || objData[i].title == ""){
                swal("Work Package Details", "Please Enter Title.");
                $("#title"+i+"").addClass('border-theme');
                    return;
            }
            if(objData[i].duration == undefined || objData[i].duration == ""){
                swal("Work Package Details", "Please Enter Duration.");
                $("#duration"+i+"").addClass('border-theme');
                    return;
            }
            if(objData[i].trl_level < 3 || objData[i].trl_level > 9){
                swal("Work Package Details", "Minimum TRL Level should be 3 and Maximum TRL Level should be 9");
                $("#STL"+i+"").addClass('border-theme');
                    return;
            }
            if(objData[i].end_trl_level < 3 || objData[i].end_trl_level > 9){
                swal("Work Package Details", "Minimum TRL Level should be 3 and Maximum TRL Level should be 9");
                $("#ETL"+i+"").addClass('border-theme');
                    return;
            }
            if(objData[i].end_trl_level < objData[i].trl_level){
                swal("Work Package Details", "End TRL Level should be greater than Start TRL Level.");
                $("#ETL"+i+"").addClass('border-theme');
                    return;
            }
        }

        for (var i = 0; i < objData.length; i++) {
            delete(objData[i]['$$hashKey']);
            var accountWrapperList = [];
            for (var k = 0; k < objData[i].AccountList.length; k++) {
                if (objData[i].AccountList[k].accountMappingId != undefined) {
                    accountWrapperList.push({
                        accnt: objData[i].AccountList[k],
                        isSelected: objData[i].AccountList[k].selected,
                        accountMappingId: objData[i].AccountList[k].accountMappingId
                    });
                } else {
                    accountWrapperList.push({
                        accnt: objData[i].AccountList[k],
                        isSelected: objData[i].AccountList[k].selected
                    });
                }

                delete(objData[i].AccountList[k]['$$hashKey']);
                delete(objData[i].AccountList[k]['selected']);
                delete(objData[i].AccountList[k]['accountMappingId']);
            }
            objData[i].AccountListWrapper = accountWrapperList;
            delete(objData[i]['AccountList']);

            // if(objData[i].AccountListWrapper.length <= 0){
            //         swal("Work Package Details", "Please Select Partners.");
            //             return;
            //     }
        }

        console.log(objData);
        debugger;
        IndustrialFellowshipController.saveWorkPackageDet(objData, $rootScope.projectId, function (result, event) {
            debugger
            console.log('save contact details');
            console.log(result);
            console.log(event);
            if (event.status) {
                Swal.fire(
                    'Success',
                    'your Work Package details have been saved successfully..',
                    'success'
                );
            if($rootScope.secondStage){
                $scope.redirectPageURL('PIDeliverables');     
            }else{
                $scope.redirectPageURL('PrivacyPolicyAcceptance');     
            }
            $scope.$apply();
            }

        });
    }

    $scope.redirectPageURL = function(pageName){
        debugger;
        var link=document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href="#/"+pageName;
        link.click();
    }
    $(document).ready(function(){
        function keypressFunc(){
            debugger
            if(e.charCode>=48 && e.charCode<=57){
                return true;
            }
            else
            {
                return false;
            }
        }
            $("input").keypress(function(e){
                debugger
                if(e.charCode>=48 && e.charCode<=57){
                    return true;
                }
                else
                {
                    return false;
                }
            });      
        });

        $scope.removeClass=function(controlid,index){
            debugger;
            var controlIdfor=controlid+""+index;
            $("#"+controlIdfor+"").removeClass('border-theme');
          }
});