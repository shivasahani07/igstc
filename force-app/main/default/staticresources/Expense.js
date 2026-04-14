angular.module('ExpenseModule',[]).controller('ExpenseModuleController', function ($scope, $rootScope){
    debugger;    
    console.log('Intiated::');
    //$scope.siteURL = siteURL;
    $rootScope.projectId;
    $scope.expenseDetails = false;
    $scope.accList = [];
    $scope.expenseList = [];
    $scope.accId = '';
    $scope.manPowerRecords =[];
    $scope.consumables =[];
    $scope.Equipment =[];
    $scope.travel =[];
    $scope.other =[];

$rootScope.projectId = 'a081y000002JcPrAAK';
    $scope.getExpenseRecords = function(){
        debugger;
        ApplicantPortal_Contoller.getExpenseRecords($rootScope.projectId, function(result,event){
            console.log("declred expense list");
            console.log(result);
            debugger;
            if(event.status && result!=null){
                $scope.expenseList = result;
                $scope.$apply();
            }
        },
        {escape: true}
        )
    }    
    $scope.getAccounts = function(){
        ApplicantPortal_Contoller.getProposalAccounts($rootScope.projectId,function(result,event){
            if (event.status && result != null) {
                debugger;
                $scope.accList = result;
                $scope.$apply();
            }
        })
    }
    $scope.getAccounts(); 
    $scope.getExpenseRecords();
    $scope.enableExpenseModule = function(index){
        debugger;
        $scope.accId = index;
        $scope.expenseDetails = true; 
        $scope.expenseTempList = [];
        if($scope.expenseList.length>0){
            for(var i=0;i<$scope.expenseList.length;i++){
                $scope.expenseTempList.push()
            }
        }
        $scope.manPowerRecords =[];
    $scope.consumables =[];
    $scope.Equipment =[];
    $scope.travel =[];
    $scope.other =[];
        if($scope.expenseList.length>0){
            for(var i=0;i<$scope.expenseList.length;i++){
                if($scope.expenseList[i].Expense_Head__r.Yearly_Expense__r.Expense_Master__r.Account__c==index){
                    if($scope.expenseList[i].Expense_Head__r.Name=='Man_Power'){
                        $scope.manPowerRecords.push({Id:$scope.expenseList[i].Id,Description__c:$scope.expenseList[i].Description__c,Unit_Price__c:$scope.expenseList[i].Unit_Price__c,
                            Multiplier__c:$scope.expenseList[i].Multiplier__c,Year1_Expense__c:$scope.expenseList[i].Year1_Expense__c,Year2_Expense__c:$scope.expenseList[i].Year2_Expense__c,
                            Year3_Expense__c:$scope.expenseList[i].Year3_Expense__c,Total_Expense__c:$scope.expenseList[i].Total_Expense__c,Expense_Type__c:$scope.expenseList[i].Expense_Type__c,
                            Year1_Approved_Amount__c : $scope.expenseList[i].Year1_Approved_Amount__c, year2_Approved_Amount__c : $scope.expenseList[i].year2_Approved_Amount__c,Year3_Approved_Amount__c : $scope.expenseList[i].Year3_Approved_Amount__c                        
                        });
                    }
                    else if($scope.expenseList[i].Expense_Head__r.Name=='consumables'){
                        $scope.consumables.push({Id:$scope.expenseList[i].Id,Description__c:$scope.expenseList[i].Description__c,Unit_Price__c:$scope.expenseList[i].Unit_Price__c,
                            Multiplier__c:$scope.expenseList[i].Multiplier__c,Year1_Expense__c:$scope.expenseList[i].Year1_Expense__c,Year2_Expense__c:$scope.expenseList[i].Year2_Expense__c,
                            Year3_Expense__c:$scope.expenseList[i].Year3_Expense__c,Total_Expense__c:$scope.expenseList[i].Total_Expense__c,Expense_Type__c:$scope.expenseList[i].Expense_Type__c,
                                                 Year1_Approved_Amount__c : $scope.expenseList[i].Year1_Approved_Amount__c, year2_Approved_Amount__c : $scope.expenseList[i].year2_Approved_Amount__c,Year3_Approved_Amount__c : $scope.expenseList[i].Year3_Approved_Amount__c
                        });
                    }
                    else if($scope.expenseList[i].Expense_Head__r.Name=='quipment'){
                        $scope.Equipment.push({Id:$scope.expenseList[i].Id,Description__c:$scope.expenseList[i].Description__c,Unit_Price__c:$scope.expenseList[i].Unit_Price__c,
                            Multiplier__c:$scope.expenseList[i].Multiplier__c,Year1_Expense__c:$scope.expenseList[i].Year1_Expense__c,Year2_Expense__c:$scope.expenseList[i].Year2_Expense__c,
                            Year3_Expense__c:$scope.expenseList[i].Year3_Expense__c,Total_Expense__c:$scope.expenseList[i].Total_Expense__c,Expense_Type__c:$scope.expenseList[i].Expense_Type__c,
                                               Year1_Approved_Amount__c : $scope.expenseList[i].Year1_Approved_Amount__c, year2_Approved_Amount__c : $scope.expenseList[i].year2_Approved_Amount__c,Year3_Approved_Amount__c : $scope.expenseList[i].Year3_Approved_Amount__c
                        });
                    }
                    else if($scope.expenseList[i].Expense_Head__r.Name=='travel'){
                        $scope.travel.push({Id:$scope.expenseList[i].Id,Description__c:$scope.expenseList[i].Description__c,Unit_Price__c:$scope.expenseList[i].Unit_Price__c,
                            Multiplier__c:$scope.expenseList[i].Multiplier__c,Year1_Expense__c:$scope.expenseList[i].Year1_Expense__c,Year2_Expense__c:$scope.expenseList[i].Year2_Expense__c,
                            Year3_Expense__c:$scope.expenseList[i].Year3_Expense__c,Total_Expense__c:$scope.expenseList[i].Total_Expense__c,Expense_Type__c:$scope.expenseList[i].Expense_Type__c,
                                            Year1_Approved_Amount__c : $scope.expenseList[i].Year1_Approved_Amount__c, year2_Approved_Amount__c : $scope.expenseList[i].year2_Approved_Amount__c,Year3_Approved_Amount__c : $scope.expenseList[i].Year3_Approved_Amount__c
                        });
                    }
                    else if($scope.expenseList[i].Expense_Head__r.Name=='other'){
                        $scope.other.push({Id:$scope.expenseList[i].Id,Description__c:$scope.expenseList[i].Description__c,Unit_Price__c:$scope.expenseList[i].Unit_Price__c,
                            Multiplier__c:$scope.expenseList[i].Multiplier__c,Year1_Expense__c:$scope.expenseList[i].Year1_Expense__c,Year2_Expense__c:$scope.expenseList[i].Year2_Expense__c,
                            Year3_Expense__c:$scope.expenseList[i].Year3_Expense__c,Total_Expense__c:$scope.expenseList[i].Total_Expense__c,Expense_Type__c:$scope.expenseList[i].Expense_Type__c,
                                           Year1_Approved_Amount__c : $scope.expenseList[i].Year1_Approved_Amount__c, year2_Approved_Amount__c : $scope.expenseList[i].year2_Approved_Amount__c,Year3_Approved_Amount__c : $scope.expenseList[i].Year3_Approved_Amount__c
                        });
                    }
                }
            }
        }
        if($scope.manPowerRecords.length<=0){
            $scope.manPowerRecords.push({
                'Description__c': '',
                'Unit_Price__c': '',
                "Multiplier__c":"",
                "Year1_Expense__c":"0",
                "Year2_Expense__c":"0",
                "Year3_Expense__c":"0",
                "Total_Expense__c":"",
                "Expense_Type__c":"",
                "Year1_Approved_Amount__c":"0",
                "year2_Approved_Amount__c":"0",
                "Year3_Approved_Amount__c":"0"
            });
        }
        if($scope.consumables.length<=0){
            $scope.consumables.push({
                'Description__c': '',
                'Unit_Price__c': '',
                "Multiplier__c":"",
                "Year1_Expense__c":"0",
                "Year2_Expense__c":"0",
                "Year3_Expense__c":"0",
                "Total_Expense__c":"",
                "Expense_Type__c":"",
                "Year1_Approved_Amount__c":"0",
                "year2_Approved_Amount__c":"0",
                "Year3_Approved_Amount__c":"0"
            });
        }
        if($scope.Equipment.length<=0){
            $scope.Equipment.push({
                'Description__c': '',
                'Unit_Price__c': '',
                "Multiplier__c":"",
                "Year1_Expense__c":"0",
                "Year2_Expense__c":"0",
                "Year3_Expense__c":"0",
                "Total_Expense__c":"",
                "Expense_Type__c":"",
                "Year1_Approved_Amount__c":"0",
                "year2_Approved_Amount__c":"0",
                "Year3_Approved_Amount__c":"0"
            });
        }
        if($scope.travel.length<=0){
            $scope.travel.push({
                'Description__c': '',
                'Unit_Price__c': '',
                "Multiplier__c":"",
                "Year1_Expense__c":"0",
                "Year2_Expense__c":"0",
                "Year3_Expense__c":"0",
                "Total_Expense__c":"",
                "Expense_Type__c":"",
                "Year1_Approved_Amount__c":"0",
                "year2_Approved_Amount__c":"0",
                "Year3_Approved_Amount__c":"0"
            });
        }
        if($scope.other.length<=0){
            $scope.other.push({
                'Description__c': '',
                'Unit_Price__c': '',
                "Multiplier__c":"",
                "Year1_Expense__c":"0",
                "Year2_Expense__c":"0",
                "Year3_Expense__c":"0",
                "Total_Expense__c":"",
                "Expense_Type__c":"",
                "Year1_Approved_Amount__c":"0",
                "year2_Approved_Amount__c":"0",
                "Year3_Approved_Amount__c":"0"
            });
        } 
        $scope.$apply();
    }
    
   
    
   
    
    console.log('$scope.manPowerRecords::'+$scope.manPowerRecords);
    // $scope.proposalId = 'a081y0000029D81AAE';
    
   
    $scope.disableExpenseModule = function(index){
        debugger;
        // console.log($scope.accList[index].Id);
        $scope.expenseDetails = false;
    }
    $scope.addRow = function (param1, param2) {
        debugger;
        // $scope.contactList.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        // $scope.ConsortiaDetials.Contacts.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        $scope.manPowerRecords.push({
            'Description__c': '',
            'Unit_Price__c': '',
            "Multiplier__c":"",
            "Year1_Expense__c":"0",
            "Year2_Expense__c":"0",
            "Year3_Expense__c":"0",
            "Total_Expense__c":"",
            "Expense_Type__c":""
        });
        $scope.$apply();
        
    }
    $scope.addRowCon = function (param1, param2) {
        debugger;
        // $scope.contactList.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        // $scope.ConsortiaDetials.Contacts.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        $scope.consumables.push({
            'Description__c': '',
            'Unit_Price__c': '',
            "Multiplier__c":"",
            "Year1_Expense__c":"0",
            "Year2_Expense__c":"0",
            "Year3_Expense__c":"0",
            "Total_Expense__c":"",
            "Expense_Type__c":""
        });
        
    }
    $scope.addRowEquip = function (param1, param2) {
        debugger;
        // $scope.contactList.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        // $scope.ConsortiaDetials.Contacts.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        $scope.Equipment.push({
            'Description__c': '',
            'Unit_Price__c': '',
            "Multiplier__c":"",
            "Year1_Expense__c":"0",
            "Year2_Expense__c":"0",
            "Year3_Expense__c":"0",
            "Total_Expense__c":"",
            "Expense_Type__c":""
        });
        
    }
    $scope.addRowTravel = function (param1, param2) {
        debugger;
        // $scope.contactList.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        // $scope.ConsortiaDetials.Contacts.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        $scope.travel.push({
            'Description__c': '',
            'Unit_Price__c': '',
            "Multiplier__c":"",
            "Year1_Expense__c":"0",
            "Year2_Expense__c":"0",
            "Year3_Expense__c":"0",
            "Total_Expense__c":"",
            "Expense_Type__c":""
        });
        
    }
    $scope.addRowOther = function (param1, param2) {
        debugger;
        // $scope.contactList.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        // $scope.ConsortiaDetials.Contacts.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        $scope.other.push({
            'Description__c': '',
            'Unit_Price__c': '',
            "Multiplier__c":"",
            "Year1_Expense__c":"0",
            "Year2_Expense__c":"0",
            "Year3_Expense__c":"0",
            "Total_Expense__c":"",
            "Expense_Type__c":""
        });
        
    }
    
    $scope.deleteRow = function (param1, param2,Id) {
        debugger;
        if ($scope.manPowerRecords.length > 1){
            $scope.manPowerRecords.splice(param2, 1);
        }
        if(Id!=undefined){
            $scope.deleteExpenseLineItems(Id);
        }
    }
    $scope.deleteExpenseLineItems=function(Id){
        ApplicantPortal_Contoller.deleteExpenseLineItems(Id,function (result, event){
            debugger
            if (event.status) {
                debugger;
                swal("Expense Details", "Expense line item has been deleted successfully!");
                debugger;
            }
        });
    }
    $scope.deleteRowConsumables = function (param1, param2,Id) {
        debugger;
        if ($scope.consumables.length > 1){
            $scope.consumables.splice(param2, 1);
        }
        if(Id!=undefined){
            $scope.deleteExpenseLineItems(Id);
        }
    }
    $scope.deleteRowEquipment = function (param1, param2,Id) {
        debugger;
        if ($scope.Equipment.length > 1){
            $scope.Equipment.splice(param2, 1);
        }
        if(Id!=undefined){
            $scope.deleteExpenseLineItems(Id);
        }
    }
    $scope.deleteRowTravel = function (param1, param2,Id) {
        debugger;
        if ($scope.travel.length > 1){
            $scope.travel.splice(param2, 1);
        }
        if(Id!=undefined){
            $scope.deleteExpenseLineItems(Id);
        }
    }
    $scope.deleteRowOther = function (param1, param2,Id) {
        debugger;
        if ($scope.other.length > 1){
            $scope.other.splice(param2, 1);
        }
        if(Id!=undefined){
            $scope.deleteExpenseLineItems(Id);
        }
    }
    
    $scope.submitExpense = function(para){
        debugger;
        if(para == 'Man_Power'){
            for (let i = 0; i < $scope.manPowerRecords.length; i++) {
                $scope.manPowerRecords[i]['Expense_Type__c'] = para;
                $scope.manPowerRecords[i]['Index__c'] = i +1;
                delete($scope.manPowerRecords[i]['$$hashKey']);
                
            }
            $scope.tempObj = $scope.manPowerRecords;
        }else if(para == 'consumables'){
            for (let i = 0; i < $scope.consumables.length; i++) {
                $scope.consumables[i]['Expense_Type__c'] = para;
                $scope.consumables[i]['Index__c'] = i +1;
                delete($scope.consumables[i]['$$hashKey']);
                
            }
            $scope.tempObj = $scope.consumables;
        }else if(para == 'quipment'){
            for (let i = 0; i < $scope.Equipment.length; i++) {
                $scope.Equipment[i]['Expense_Type__c'] = para;
                $scope.Equipment[i]['Index__c'] = i +1;
                delete($scope.Equipment[i]['$$hashKey']);
                
            }
            $scope.tempObj = $scope.Equipment;
        }else if(para == 'travel'){
            for (let i = 0; i < $scope.travel.length; i++) {
                $scope.travel[i]['Expense_Type__c'] = para;
                $scope.travel[i]['Index__c'] = i +1;
                delete($scope.travel[i]['$$hashKey']);
                
            }
            $scope.tempObj = $scope.travel;
        }else if(para == 'other'){
            for (let i = 0; i < $scope.other.length; i++) {
                $scope.other[i]['Expense_Type__c'] = para;
                $scope.other[i]['Index__c'] = i +1;
                delete($scope.other[i]['$$hashKey']);
                
            }
            $scope.tempObj = $scope.other;
        }
        
        //$scope.tempObj = $scope.manPowerRecords;
        ApplicantPortal_Contoller.createExpenseDeclarationDetails($scope.tempObj,$rootScope.projectId,$scope.accId,function (result, event){
            if (event.status && result != null) {
                debugger;
                swal("Expense Details", "Your data have been saved Successfully");
                debugger;
                //$scope.enableExpenseModule();
                //$scope.$apply();
            }
        }
                                                          )
    }

    $scope.calculateOtherField=function(exType){
        debugger;
        if(exType=='man'){
        for (let i = 0; i < $scope.manPowerRecords.length; i++) {
            $scope.manPowerRecords[i].Total_Expense__c = Number($scope.manPowerRecords[i].Year1_Expense__c)+Number($scope.manPowerRecords[i].Year2_Expense__c)+Number($scope.manPowerRecords[i].Year3_Expense__c);   
        }
    }
    else if(exType=='cons'){
        for (let i = 0; i < $scope.consumables.length; i++) {
            $scope.consumables[i].Total_Expense__c = Number($scope.consumables[i].Year1_Expense__c)+Number($scope.consumables[i].Year2_Expense__c)+Number($scope.consumables[i].Year3_Expense__c);   
        }
    }
    else if(exType=='equi'){
        for (let i = 0; i < $scope.Equipment.length; i++) {
            $scope.Equipment[i].Total_Expense__c = Number($scope.Equipment[i].Year1_Expense__c)+Number($scope.Equipment[i].Year2_Expense__c)+Number($scope.Equipment[i].Year3_Expense__c);   
        }
    }
    else if(exType=='travel'){
        for (let i = 0; i < $scope.travel.length; i++) {
            $scope.travel[i].Total_Expense__c = Number($scope.travel[i].Year1_Expense__c)+Number($scope.travel[i].Year2_Expense__c)+Number($scope.travel[i].Year3_Expense__c);   
        }
    }
    else if(exType=='other'){
        for (let i = 0; i < $scope.other.length; i++) {
            $scope.other[i].Total_Expense__c = Number($scope.other[i].Year1_Expense__c)+Number($scope.other[i].Year2_Expense__c)+Number($scope.other[i].Year3_Expense__c);   
        }
    }
    }

    $scope.calculateYearField=function(exType){
        debugger;
    if(exType=='man'){
        for (let i = 0; i < $scope.manPowerRecords.length; i++) {
            $scope.manPowerRecords[i].Year1_Expense__c = Number($scope.manPowerRecords[i].Multiplier__c*$scope.manPowerRecords[i].Unit_Price__c);
            $scope.manPowerRecords[i].Year2_Expense__c = Number($scope.manPowerRecords[i].Multiplier__c*$scope.manPowerRecords[i].Unit_Price__c);
            $scope.manPowerRecords[i].Year3_Expense__c = Number($scope.manPowerRecords[i].Multiplier__c*$scope.manPowerRecords[i].Unit_Price__c);
        }
    }
    else if(exType=='cons'){
        for (let i = 0; i < $scope.consumables.length; i++) {
            $scope.consumables[i].Year1_Expense__c = Number($scope.consumables[i].Multiplier__c*$scope.consumables[i].Unit_Price__c);
            $scope.consumables[i].Year2_Expense__c = Number($scope.consumables[i].Multiplier__c*$scope.consumables[i].Unit_Price__c);
            $scope.consumables[i].Year3_Expense__c = Number($scope.consumables[i].Multiplier__c*$scope.consumables[i].Unit_Price__c);
        }
    }
    else if(exType=='equi'){
        for (let i = 0; i < $scope.Equipment.length; i++) {
            $scope.Equipment[i].Year1_Expense__c = Number($scope.Equipment[i].Multiplier__c*$scope.Equipment[i].Unit_Price__c);
            $scope.Equipment[i].Year2_Expense__c = Number($scope.Equipment[i].Multiplier__c*$scope.Equipment[i].Unit_Price__c);
            $scope.Equipment[i].Year3_Expense__c = Number($scope.Equipment[i].Multiplier__c*$scope.Equipment[i].Unit_Price__c);
        }
    }
    else if(exType=='travel'){
        for (let i = 0; i < $scope.travel.length; i++) {
            $scope.travel[i].Year1_Expense__c = Number($scope.travel[i].Multiplier__c*$scope.travel[i].Unit_Price__c);
            $scope.travel[i].Year2_Expense__c = Number($scope.travel[i].Multiplier__c*$scope.travel[i].Unit_Price__c);
            $scope.travel[i].Year3_Expense__c = Number($scope.travel[i].Multiplier__c*$scope.travel[i].Unit_Price__c);
        }
    }
    else if(exType=='other'){
        for (let i = 0; i < $scope.other.length; i++) {
            $scope.other[i].Year1_Expense__c = Number($scope.other[i].Multiplier__c*$scope.other[i].Unit_Price__c);
            $scope.other[i].Year2_Expense__c = Number($scope.other[i].Multiplier__c*$scope.other[i].Unit_Price__c);
            $scope.other[i].Year3_Expense__c = Number($scope.other[i].Multiplier__c*$scope.other[i].Unit_Price__c);
        }
    }
        $scope.calculateOtherField(exType);
    }

    $scope.redirectPageURL = function(pageName){
        debugger;
        var link=document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href="#/"+pageName;
        link.click();
    }
});