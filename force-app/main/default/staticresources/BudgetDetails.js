angular.module('cp_app').controller('budget_ctrl', function($scope, $rootScope){
    console.log('Intiated::');
    $scope.siteURL = siteURL;
    $rootScope.projectId;
    $rootScope.proposalId;
    $scope.expenseDetails = false;
    $scope.accList = [];
    $scope.expenseList = [];
    $scope.accId = '';


    // Fetching the proposalId from Local Storage

    if (localStorage.getItem('proposalId')) {

        $rootScope.proposalId = localStorage.getItem('proposalId');

        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);

        $rootScope.projectId = $rootScope.proposalId;
        // $scope.getExpenseRecords();
    }







    $scope.getContact = function(){
        debugger;
        ApplicantPortal_Contoller.getConSing222($rootScope.candidateId,function(result,event){
            debugger;
            if(event.status && result){
                $scope.conRecord = result;
                // $rootScope.projectId = result.Applicant_Proposal_Associations__r[0].Proposals__c;
            }
            $scope.$apply();
            $scope.getExpenseRecords();
        })
    }
    $scope.getContact();


    $scope.getExpenseRecords = function(){
        debugger;
        IndustrialFellowshipController.getExpenseRecords($rootScope.projectId, function(result,event){
            console.log("declred expense list");
            console.log(result);
            debugger;
            if(event.status){
                console.log('result------>'+result);
               if(result.length >0){
                   for(var i=0;i<result.length;i++){
                       if(result[i].Expense_Line_Items__r == undefined){
                           result[i].Expense_Line_Items__r  = [];
                           if($scope.conRecord.MailingCountry == "India"){
                            $scope.year1 = result[0].Proposals__r.Total_funding_requested_from_IGSTC__c;
                            result[i].Expense_Line_Items__r.push( {"Expense_Head__c":result[i].Id,'Description__c': '',"Currency_Type__c":'INR'});
                           }else{
                            $scope.year1Germany = result[0].Proposals__r.Total_funding_requested_from_IGSTC__c;
                            result[i].Expense_Line_Items__r.push( {"Expense_Head__c":result[i].Id,'Description__c': '',"Currency_Type__c":'EURO'});
                           }
                       }else{
                        if($scope.conRecord.MailingCountry == "India"){
                            if(result[0].Proposals__r.Total_funding_requested_from_IGSTC__c != undefined)
                            $scope.year1 = result[0].Proposals__r.Total_funding_requested_from_IGSTC__c.split(/\$/).join('');
                            // $scope.year1 = result[0].Proposals__r.Total_funding_requested_from_IGSTC__c;
                        }else{
                            if(result[0].Proposals__r.Total_funding_requested_from_IGSTC__c != undefined)
                            $scope.year1Germany = result[0].Proposals__r.Total_funding_requested_from_IGSTC__c.split(/\$/).join('');
                        }
                           
                           for(var j=0;j<result[i].Expense_Line_Items__r.length;j++){
                            if(result[i].Expense_Line_Items__r[j].Description__c != undefined || result[i].Expense_Line_Items__r[j].Description__c != ''){
                                result[i].Expense_Line_Items__r[j].Description__c = result[i].Expense_Line_Items__r[j].Description__c ? result[i].Expense_Line_Items__r[j].Description__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result[i].Expense_Line_Items__r[j].Description__c;  
                              }
                           }
                           result[i].Expense_Line_Items__r = result[i].Expense_Line_Items__r;
                       }
                      }
                   $scope.expenseList = result;
               }else{
               }
               $scope.$apply();
            }
        },
        {escape: true}
        )
    } 
    $scope.getExpenseRecords();
   

    $scope.addRow = function (param1) {
        debugger;
        $scope.expenseList[param1].Expense_Line_Items__r.push({
           'Description__c': '',
           "Expense_Head__c":$scope.expenseList[param1].Id
       });
        $scope.$apply();
        
    }

    $scope.deleteRow = function (param1, param2) {
        debugger;
        if ($scope.expenseList[param1].Expense_Line_Items__r.length > 1){
            if($scope.expenseList[param1].Expense_Line_Items__r[param2].Id != undefined){
                $scope.deleteExpenseLineItems($scope.expenseList[param1].Expense_Line_Items__r[param2].Id);
            }
            $scope.expenseList[param1].Expense_Line_Items__r.splice(param2, 1);
        }
    }

$scope.saveExpenceLineitems = function(){
   $scope.expLineItem = [];
   debugger;

   for(var i=0;i< $scope.expenseList.length;i++){
       for (let j = 0; j < $scope.expenseList[i].Expense_Line_Items__r.length; j++) {
           delete($scope.expenseList[i].Expense_Line_Items__r[j]['$$hashKey']);
           $scope.expLineItem.push( $scope.expenseList[i].Expense_Line_Items__r[j]);
       }
   }

   if($scope.conRecord.MailingCountry == "India"){
    $scope.expenseList[0].Proposals__r.Total_funding_requested_from_IGSTC__c = $scope.year1;
    if($scope.year1 > 900000){
        swal("info", "Total Grants asked by IGSTC should not be more than 900000.","info");
        return;
    }
   }else{
    $scope.expenseList[0].Proposals__r.Total_funding_requested_from_IGSTC__c = $scope.year1Germany;
        if($scope.year1Germany > 10000){
            swal("info", "Total Grants asked by IGSTC should not be more than 10000 €.","info");
            return;
        }
   }

   if($scope.expenseList[0].Proposals__r.Total_funding_requested_from_IGSTC__c == undefined){
    $scope.expenseList[0].Proposals__r.Total_funding_requested_from_IGSTC__c = 0;
   }
   $scope.expenseList[0].Proposals__r.Total_funding_requested_from_IGSTC__c = String($scope.expenseList[0].Proposals__r.Total_funding_requested_from_IGSTC__c);
   if($scope.expenseList[0].Proposals__r.Total_funding_requested_from_IGSTC__c.includes('$')){
    $scope.expenseList[0].Proposals__r.Total_funding_requested_from_IGSTC__c = $scope.expenseList[0].Proposals__r.Total_funding_requested_from_IGSTC__c.replace('$', '');
   }
   $scope.expenseList[0].Proposals__r.Total_funding_requested_from_IGSTC__c = Number($scope.expenseList[0].Proposals__r.Total_funding_requested_from_IGSTC__c);

   IndustrialFellowshipController.saveExpenceLineItem($scope.expLineItem,$scope.expenseList[0].Proposals__c,$scope.expenseList[0].Proposals__r.Total_funding_requested_from_IGSTC__c,function(result,event){
       if(event.status && result != null){
               console.log(result);                    
           swal({
                title: "SUCCESS",
                text: 'Budget details have been saved successfully.',
                icon: "success",
                button: "ok!",
           })  
           $scope.redirectPageURL('AttachmentsSing');                  
         
      } else{
           swal({
                title: "ERROR",
                text: "Exception !",
                icon: "error",
                button: "ok!",
           });
      }
       
   })
}
    $scope.redirectPageURL = function(pageName){
        debugger;
        var link=document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href="#/"+pageName;
        link.click();
    }

    $scope.calculateOtherField=function(){
        debugger;
        $scope.year1 = 0;
        $scope.year1Germany = 0;
        for(var i=0;i<$scope.expenseList.length;i++){
            if($scope.conRecord.MailingCountry == "India"){
                if($scope.expenseList[i].Expense_Line_Items__r != undefined){
                    for(var j=0;j<$scope.expenseList[i].Expense_Line_Items__r.length;j++){
                        if($scope.expenseList[i].Expense_Line_Items__r[j].Year1_Expense__c != undefined){
                            $scope.year1 = $scope.year1+Number($scope.expenseList[i].Expense_Line_Items__r[j].Year1_Expense__c);
                        }
        
                    }
                }
            }else{
                if($scope.expenseList[i].Expense_Line_Items__r != undefined){
                    for(var j=0;j<$scope.expenseList[i].Expense_Line_Items__r.length;j++){
                        if($scope.expenseList[i].Expense_Line_Items__r[j].Year1_Expense__c != undefined){
                            $scope.year1Germany = $scope.year1Germany+Number($scope.expenseList[i].Expense_Line_Items__r[j].Year1_Expense__c);
                        }
        
                    }
                } 
            }
        }
        $scope.$apply();
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
})