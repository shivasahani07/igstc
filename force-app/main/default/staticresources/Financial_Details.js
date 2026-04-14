angular.module('cp_app').controller('financialdetails_ctrl', function($scope, $rootScope){
   
    $scope.siteURL = siteURL;
    $rootScope.projectId;
    $scope.expenseHeadList = [];
    $scope.listOfItems = [];
    $scope.proposalsRec ={};
    $scope.defaultCurrency;

    $scope.getExpenseFromProposal = function(){
        debugger;
        ApplicantPortal_Contoller.getExpenseFromProposal($rootScope.projectId,function(result,event){
            debugger;
            if(event.status && result){
                debugger;
                $scope.expenseAllList = result;
                for(var i=0;i<$scope.expenseAllList.length;i++){
                    if($scope.expenseAllList[i].Proposals__r.Total_funding_requested_from_IGSTC__c != undefined){
                        $scope.IGSTCFunding = $scope.expenseAllList[i].Proposals__r.Total_funding_requested_from_IGSTC__c;
                    }else{
                        $scope.IGSTCFunding = 0;
                    }
                    if($scope.expenseAllList[i].Proposals__r.Funding_from_other_sources_own_contrib__c != undefined){
                        $scope.OwnFunding = $scope.expenseAllList[i].Proposals__r.Funding_from_other_sources_own_contrib__c;
                    }
                    if($scope.expenseAllList[i].Expense_Line_Items__r == undefined){
                        $scope.expenseAllList[i].Expense_Line_Items__r = [];
                        if($scope.expenseAllList[i].Proposals__r.Country_of_Venue__c == "India"){
                            $scope.expenseAllList[i].Expense_Line_Items__r.push({"Multiplier__c":"","Expense_Head__c":$scope.expenseAllList[i].Id,"Total_Expense__c":"","Currency_Type2__c":"INR"});
                            $scope.defaultCurrency = "INR";
                        }else{
                            $scope.expenseAllList[i].Expense_Line_Items__r.push({"Multiplier__c":"","Expense_Head__c":$scope.expenseAllList[i].Id,"Total_Expense__c":"","Currency_Type2__c":"Euro"});
                            $scope.defaultCurrency = "Euro";

                        }
                    }else{
                        for(var j=0;j<$scope.expenseAllList[i].Expense_Line_Items__r.length;j++){
                            if($scope.expenseAllList[i].Expense_Line_Items__r[j].Description__c != undefined || $scope.expenseAllList[i].Expense_Line_Items__r[j].Description__c != ""){
                                $scope.expenseAllList[i].Expense_Line_Items__r[j].Description__c = $scope.expenseAllList[i].Expense_Line_Items__r[j].Description__c ? $scope.expenseAllList[i].Expense_Line_Items__r[j].Description__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.expenseAllList[i].Expense_Line_Items__r[j].Description__c;
                            }
                            if($scope.expenseAllList[i].Proposals__r.Country_of_Venue__c == "India"){
                                $scope.expenseAllList[i].Expense_Line_Items__r[j].Currency_Type2__c = "INR";
                                $scope.defaultCurrency = "INR";
                            }else{
                                $scope.expenseAllList[i].Expense_Line_Items__r[j].Currency_Type2__c = "Euro";    
                                $scope.defaultCurrency = "Euro";
                            }
                        }
                    }
                }
            }
            $scope.$apply();
        }
        )
    }
    $scope.getExpenseFromProposal();

    $scope.addExpense = function(param1){
        debugger;
        if($scope.expenseAllList[param1].Expense_Line_Items__r){
            $scope.expenseAllList[param1].Expense_Line_Items__r.push({"Multiplier__c":"","Expense_Head__c":$scope.expenseAllList[param1].Id,"Currency_Type2__c":$scope.defaultCurrency});
        }else{
            $scope.expenseAllList[param1].Expense_Line_Items__r = [{"Multiplier__c":"","Expense_Head__c":$scope.expenseAllList[param1].Id,"Currency_Type2__c":$scope.defaultCurrency}];
        }
        $scope.$apply();

    }

    $scope.deleteExpense = function(param1,param2){
        debugger;
        if ($scope.expenseAllList[param1].Expense_Line_Items__r.length > 1){
            if($scope.expenseAllList[param1].Expense_Line_Items__r[param2].Id != undefined){
                $scope.deleteExpenseLineItems($scope.expenseAllList[param1].Expense_Line_Items__r[param2].Id);
            }
            $scope.expenseAllList[param1].Expense_Line_Items__r.splice(param2, 1);
        }
    }

    $scope.saveLineItems = function(saveType){
        debugger;

        if(saveType == 'partial'){
            debugger;

            for(let i=0; i<$scope.expenseAllList.length; i++){
                $scope.proposalsRec = $scope.expenseAllList[i].Proposals__r;
                delete ($scope.expenseAllList[i]['Name']);
                delete ($scope.expenseAllList[i]['$$hashKey']);
                for(var j=0;j<$scope.expenseAllList[i].Expense_Line_Items__r.length;j++){
                    delete ($scope.expenseAllList[i].Expense_Line_Items__r[j]['$$hashKey']);
                    $scope.listOfItems.push($scope.expenseAllList[i].Expense_Line_Items__r[j]);
                }
           }
    
           $scope.expenseAllList[0].Proposals__r.Total_funding_requested_from_IGSTC__c = $scope.IGSTCFunding;
           $scope.expenseAllList[0].Proposals__r.Funding_from_other_sources_own_contrib__c = $scope.OwnFunding;
    
           ApplicantPortal_Contoller.saveExpenseDetails($scope.listOfItems,$scope.proposalsRec,function(result,event){
            debugger;
            if(event.status && result!=null){
                Swal.fire(
                    'Success',
                    'Financial details have partially saved.',
                    'success'
                );
				//$scope.getExpenseFromProposal();
                // $scope.redirectPageURL('Curriculum_vitae');
                $scope.$apply();
            }
         },
         {escape:true}
         )
           window.location.reload();
        }else{
            for(var i=0;i<$scope.expenseAllList.length;i++){
                if($scope.expenseAllList[i].Expense_Line_Items__r != undefined){
                   for(var j=0;j<$scope.expenseAllList[i].Expense_Line_Items__r.length;j++){
                    if($scope.expenseAllList[i].Expense_Line_Items__r[j].Description__c == undefined){
                        swal("Expense Details", "Please Enter Description.");
                        //$("#sYear"+j+"").addClass('border-theme');
                        return;
                    }
    
                    if($scope.expenseAllList[i].Expense_Line_Items__r[j].Total_Expense__c == undefined || $scope.expenseAllList[i].Expense_Line_Items__r[j].Total_Expense__c == ""){
                        swal("Expense Details", "Please Enter Total.");
                        //$("#sYear"+j+"").addClass('border-theme');
                        return;
                    }
                   }
                }
            }
            for(let i=0; i<$scope.expenseAllList.length; i++){
                $scope.proposalsRec = $scope.expenseAllList[i].Proposals__r;
                delete ($scope.expenseAllList[i]['Name']);
                delete ($scope.expenseAllList[i]['$$hashKey']);
                for(var j=0;j<$scope.expenseAllList[i].Expense_Line_Items__r.length;j++){
                    delete ($scope.expenseAllList[i].Expense_Line_Items__r[j]['$$hashKey']);
                    $scope.listOfItems.push($scope.expenseAllList[i].Expense_Line_Items__r[j]);
                }
           }
    
           $scope.expenseAllList[0].Proposals__r.Total_funding_requested_from_IGSTC__c = $scope.IGSTCFunding;
           $scope.expenseAllList[0].Proposals__r.Funding_from_other_sources_own_contrib__c = $scope.OwnFunding;
    
           ApplicantPortal_Contoller.saveExpenseDetails($scope.listOfItems,$scope.proposalsRec,function(result,event){
            debugger;
            if(event.status && result!=null){
                Swal.fire(
                    'Success',
                    'Financial details have been saved successfully.',
                    'success'
                );
                $scope.redirectPageURL('Curriculum_vitae');
                $scope.$apply();
            }
         },
         {escape:true}
         )
        }
        
    }

    $scope.calculateTotalOfTotal = function(){
        debugger;
        $scope.IGSTCFunding = 0;
        for(let i=0; i<$scope.expenseAllList.length; i++){
            if($scope.expenseAllList[i].Expense_Line_Items__r != undefined){
                for(var j=0;j<$scope.expenseAllList[i].Expense_Line_Items__r.length;j++){
                    if($scope.expenseAllList[i].Expense_Line_Items__r[j].Total_Expense__c != undefined){
                        $scope.IGSTCFunding = $scope.IGSTCFunding+Number($scope.expenseAllList[i].Expense_Line_Items__r[j].Total_Expense__c);
                    }
                }
            }
        }
    }

    // $scope.getExpenseDetails = function(){
    //     debugger;
    //     ApplicantPortal_Contoller.getExpenseDetailsOfAccount($rootScope.userId, function(result,event){
    //         debugger;
    //         console.log("onload data");
    //         console.log(result);
    //         if(event.status && result!=null){
    //             debugger;
    //             $scope.expenseHeadList = result;

    //                 for(var i=0;i<$scope.expenseHeadList.length;i++){
                        
    //                   for(var j=0;j<$scope.expenseHeadList[i].exHeadWrapper.length;j++){
    //                     if($scope.expenseHeadList[i].exHeadWrapper[j].expenseLineItemList.length <= 0){
    //                         debugger;
    //                         $scope.expenseHeadList[i].exHeadWrapper[j].expenseLineItemList.push({"Multiplier__c":"","Expense_Head__c":$scope.expenseHeadList[i].exHeadWrapper[j].expenseHead.Id,"Total_Expense__c":""});
    //                     }
    //                   }  
    //                 }
    //                 debugger;
    //                 $scope.$apply();
    //         }
    //     },
    //     {escape:true}
    //     ) 
    // }
    // $scope.getExpenseDetails();

    $scope.redirectPageURL = function(pageName){
        debugger;
        var link=document.createElement("a");
        link.Id = 'someLink';
        link.href="#/"+pageName;
        link.click();
    }

    // $scope.submitDetails = function(){
    //    debugger;

    //    for(let i=0; i<$scope.expenseHeadList.length; i++){
    //         delete ($scope.expenseHeadList[i]['Name']);
    //         delete ($scope.expenseHeadList[i]['$$hashKey']);
    //         for(var j=0;j<$scope.expenseHeadList[i].exHeadWrapper.length;j++){
    //             delete ($scope.expenseHeadList[i].exHeadWrapper[j]['$$hashKey']);
    //             delete ($scope.expenseHeadList[i].exHeadWrapper[j].expenseHead.Expense_Line_Items__r);
    //             for(var k=0;k<$scope.expenseHeadList[i].exHeadWrapper[j].expenseLineItemList.length;k++){
    //                 delete ($scope.expenseHeadList[i].exHeadWrapper[j].expenseLineItemList[k]['$$hashKey']);
    //                 $scope.listOfItems.push($scope.expenseHeadList[i].exHeadWrapper[j].expenseLineItemList[k]);
    //             }
    //         }
    //    }

    //      debugger;
    //      ApplicantPortal_Contoller.saveExpenseDetails($scope.listOfItems,function(result,event){
    //         debugger;
    //         if(event.status && result!=null){
    //             Swal.fire(
    //                 'Success',
    //                 'Financial detail has been saved successfully.',
    //                 'success'
    //             );
    //             $scope.redirectPageURL('Curriculum_vitae');
    //             $scope.$apply();
    //         }
    //      },
    //      {escape:true}
    //      )
    // }

    $scope.addLineItems = function(param1,param2){
        debugger;
        if($scope.expenseHeadList[param1].exHeadWrapper[param2]){
            $scope.expenseHeadList[param1].exHeadWrapper[param2].expenseLineItemList.push({"Multiplier__c":"","Expense_Head__c":$scope.expenseHeadList[param1].exHeadWrapper[param2].expenseHead.Id});
        }else{
            $scope.expenseHeadList[param1].exHeadWrapper[param2].expenseLineItemList = [{"Multiplier__c":"","Expense_Head__c":$scope.expenseHeadList[param1].exHeadWrapper[param2].expenseHead.Id}];
        }
        $scope.$apply();
    }

    $scope.deleteLineItems = function (param1,param2,param3) {
        debugger;
        if ($scope.expenseHeadList[param1].exHeadWrapper[param2].expenseLineItemList.length > 1){
            if($scope.expenseHeadList[param1].exHeadWrapper[param2].expenseLineItemList[param3].Id != undefined){
                $scope.deleteExpenseLineItems($scope.expenseHeadList[param1].exHeadWrapper[param2].expenseLineItemList[param3].Id);
            }
            $scope.expenseHeadList[param1].exHeadWrapper[param2].expenseLineItemList.splice(param3, 1);
        }
    }


    $scope.deleteExpenseLineItems = function(lineItemId){
        ApplicantPortal_Contoller.deleteExpenseLineItems(lineItemId, function (result, event) {
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
});