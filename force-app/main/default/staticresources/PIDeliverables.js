angular.module('cp_app').controller('deliverables_ctrl', function($scope,$rootScope) {
    debugger;

    $scope.siteURL = siteURL;
    $rootScope.projectId;
    $scope.disable = false;
    $rootScope.secondstage;
    $scope.dueDate;
    $scope.PIList = [];
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

    $scope.getDeliverablesDetails = function () {
        ApplicantPortal_Contoller.getDeliverablesDetails($rootScope.userId, function (result, event) {
            debugger
            if (event.status && result) {
                debugger;
                $scope.applicantDetails = result;
                if ($scope.applicantDetails.length > 0) {
                    $scope.allAccountDetails = [];
                    for (var i = 0; i < $scope.applicantDetails.length; i++) {
                        const accountIdXselectedAcc = new Map();

                        if ($scope.applicantDetails[i].Deliverables_Account_Mapping__r != undefined) {
                            for (var j = 0; j < $scope.applicantDetails[i].Deliverables_Account_Mapping__r.length; j++) {
                                accountIdXselectedAcc.set($scope.applicantDetails[i].Deliverables_Account_Mapping__r[j].Account__c, $scope.applicantDetails[i].Deliverables_Account_Mapping__r[j]);
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
                        if($scope.applicantDetails[i].Due_Date__c != undefined){
                            $scope.applicantDetails[i].Due_Date__c  = new Date($scope.applicantDetails[i].Due_Date__c);
                        }
                        $scope.PIList.push({
                            "AccountList": accDetails,
                            "title": $scope.applicantDetails[i].Title__c,
                            "Due_Date__c": $scope.applicantDetails[i].Due_Date__c,
                            Id: $scope.applicantDetails[i].Id,
                            externalId: i
                        });
                    }


                } else {
                    $scope.PIList.push({
                        title: "",
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

    $scope.getProposalAccounts();
    $scope.getDeliverablesDetails();

    $scope.saveDeliverables = function () {
        debugger
        var objData = $scope.PIList;
        for (var i = 0; i < objData.length; i++) {
            var count = 0;
            for(var k = 0; k < objData[i].AccountList.length; k++){
                if(objData[i].AccountList[k].selected == true){
                    count = count+1;
                }
            }
            if(count <= 0){
                swal("PI Deliverables Details", "Please Select Partners.");
                $("#partner"+i+"").addClass('border-theme');
                return; 
            }
            if(objData[i].title == undefined || objData[i].title == ""){
                swal("PI Deliverables Details", "Please Enter Title.");
                $("#title"+i+"").addClass('border-theme');
                return;
            }
            if(objData[i].Due_Date__c == undefined || objData[i].Due_Date__c == ""){
                swal("PI Deliverables Details", "Please Enter Due Date.");
                $("#due"+i+"").addClass('border-theme');
                return;
            }
            
        }

        for (var i = 0; i < objData.length; i++) {
            if(objData[i].Due_Date__c != undefined && objData[i].Due_Date__c != ""){
                objData[i].year = objData[i].Due_Date__c.getUTCFullYear();
                objData[i].month = objData[i].Due_Date__c.getUTCMonth()+1;
                objData[i].day = objData[i].Due_Date__c.getDate();
            }
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
            delete(objData[i].Due_Date__c);
        }

        console.log(objData);
        debugger;
        ApplicantPortal_Contoller.saveDeliverables(objData, $rootScope.projectId, function (result, event) {
            debugger;
            if (event.status) {
                swal("PI Deliverables", "Your PI Deliverables detail has been saved successfully.");
            }
            debugger;
            $scope.redirectPageURL('Network_Meeting');     

        });
    }

    $scope.addRows = function () {
        debugger
        var arrayLength = $scope.PIList.length;
        var externalid = $scope.PIList[arrayLength - 1].externalId;
        var accList = [];
        for (var i = 0; i < $scope.AccountList.length; i++) {
            var option = {
                'Id': $scope.AccountList[i].Id,
                'Name': $scope.AccountList[i].Name,
                'selected': false
            };
            accList.push(option);
        }
        $scope.PIList.push({
            title: "",
            externalId: externalid + 1,
            AccountList: accList
        });
        $scope.$apply();
    }

    $scope.removeRow = function (index) {
        debugger;
        if ($scope.PIList.length == 1) {
            return;
        }
        if($scope.PIList[index].Id == undefined){
            $scope.PIList.splice(index, 1);
            return;
        }
        ApplicantPortal_Contoller.deleteDeliverables($scope.PIList[index].Id, function (result, event) {
            if (event.status) {
                swal("PI Deliverables", "Your PI Deliverables detail has been deleted successfully.");
                $scope.PIList.splice(index, 1);
            }
            $scope.$apply();
        });
    }

    $scope.redirectPageURL = function (pageName) {
        debugger;
        var link = document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href = "#/" + pageName;
        link.click();
    }

    $scope.removeClass=function(controlid,index){
        debugger;
        var controlIdfor=controlid+""+index;
        $("#"+controlIdfor+"").removeClass('border-theme');
      }
    // $scope.date;
    // $scope.siteURL = siteURL;
    // $scope.deliverableList = [];
    // $scope.deliverableListwaweqw = [];
                
    //             $scope.getApplicantDetails = function(){
    //                 debugger;
    //                 ApplicantPortal_Contoller.getProjectDetailsForPI($rootScope.userId, function (result, event){
    //                 if(event.status) {
    //                     debugger;
    //                     $scope.applicantDetails = result;
                        
    //                     for(var i=0;i<$scope.applicantDetails.length;i++){
    //                         var piDeliver = {"Name":$scope.applicantDetails[i].Name,"Account":$scope.applicantDetails[i].Id ,"Title": "","Due_Date__c": "","day": 0, "month": 0, "year": 0};
    //                         if($scope.applicantDetails[i].PI_Deliverables__r != undefined && $scope.applicantDetails[i].PI_Deliverables__r.length > 0 ){
    //                             piDeliver.Title = $scope.applicantDetails[i].PI_Deliverables__r[0].Title__c;
    //                             if($scope.applicantDetails[i].PI_Deliverables__r[0].Due_Date__c != undefined){
    //                                 piDeliver.Due_Date__c = new Date($scope.applicantDetails[i].PI_Deliverables__r[0].Due_Date__c);
    //                             }
    //                             if($scope.applicantDetails[i].PI_Deliverables__r[0].Id != undefined){
    //                                 piDeliver.Id = $scope.applicantDetails[i].PI_Deliverables__r[0].Id;
    //                             }                          
    //                         }
    //                         $scope.deliverableList.push(piDeliver);
    //                         $scope.deliverableListwaweqw.push(piDeliver);
    //                     }
    //                     $scope.$apply();
    //                 }
    //               },
    //               {escape: true}
    //             )
    //             }
    //             $scope.getApplicantDetails();

    // $scope.submitDeliverables = function(){

    //     for(var i=0;i<$scope.deliverableList.length;i++){
    //         debugger;
    //         if($scope.deliverableList[i].Title == undefined || $scope.deliverableList[i].Title == ""){
    //             swal("PI Deliverables", "Please Enter Title.");
    //                 return;
    //         }
    //         if($scope.deliverableList[i].Due_Date__c == undefined || $scope.deliverableList[i].Due_Date__c == ""){
    //             swal("PI Deliverables", "Please Enter Due Date.");
    //                 return;
    //         }
    //     }
    //     for(let i=0; i<$scope.deliverableList.length; i++){
    //         debugger;
    //         delete ($scope.deliverableList[i]['Name']);
    //         delete ($scope.deliverableList[i]['$$hashKey']);
    //         if($scope.deliverableList[i].Due_Date__c != "" && $scope.deliverableList[i].Due_Date__c != undefined){
    //             $scope.deliverableList[i].year = $scope.deliverableList[i].Due_Date__c.getUTCFullYear();
    //             $scope.deliverableList[i].month = $scope.deliverableList[i].Due_Date__c.getUTCMonth()+1;
    //             $scope.deliverableList[i].day = $scope.deliverableList[i].Due_Date__c.getDate();
    //         }
    //         delete ($scope.deliverableList[i].Due_Date__c);
    //     }

    //     ApplicantPortal_Contoller.insertDeliverables($scope.deliverableList, function(result, event){
    //         if(event.status && result != null){
    //                 debugger;
    //                 Swal.fire(
    //                 'Success',
    //                 'Submitted successfully.',
    //                 'success'
    //             );
    //                 $scope.redirectPageURL('Network_Meeting');
    //                 $scope.deliverableList = result;
    //                 $scope.$apply();  
    //             }
    //         },
    //         {escape: true}
    //         )
    // }
                
    //       $scope.redirectPageURL = function(pageName){
    //        debugger;
    //        var link=document.createElement("a");
    //        link.id = 'someLink'; //give it an ID!
    //        link.href="#/"+pageName;
    //        link.click();
    //      }
});