angular.module('cp_app').controller('financialWiser_Ctrl', function ($scope, $rootScope) {
    console.log('Intiated::');
    $scope.siteURL = siteURL;
    $rootScope.projectId;
    $scope.expenseDetails = false;
    $scope.accList = [];
    $scope.expenseList = [];
    $scope.accId = '';
    $scope.manPowerRecords = [];
    $scope.consumables = [];
    $scope.Equipment = [];
    $scope.travel = [];
    $scope.other = [];
    $scope.Showyear2 = false;
    $scope.Showyear3 = false;
    $scope.durationMonths = 0;
    $rootScope.candidateId

    console.log('$rootScope.candidateId ===>>' + $rootScope.candidateId);

    $scope.getAccounts = function () {
        debugger;
        IndustrialFellowshipController.getProposalAccounts($rootScope.proposalId, $rootScope.candidateId, function (result, event) {
            console.log('onload :: =>');
            console.log(result);
            if (event.status && result != null) {
                debugger;
                if (result.accountDetail.Name != undefined || result.accountDetail.Name != "") {
                    result.accountDetail.Name = result.accountDetail.Name ? result.accountDetail.Name.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.accountDetail.Name;
                }
                $scope.accDetails = result.accountDetail;
                $scope.durationMonths = result.durationInMonths;
                if ($scope.durationMonths > 12 && $scope.durationMonths < 25) {
                    $scope.Showyear2 = true;
                } else if ($scope.durationMonths > 24) {
                    $scope.Showyear2 = true;
                    $scope.Showyear3 = true;
                }
                console.log($scope.durationMonths);
                $scope.getExpenseRecords();
                $scope.$apply();
            }
        })
    }
    $scope.getAccounts();


    $scope.getExpenseRecords = function () {
        debugger;
        IndustrialFellowshipController.getExpenseRecords($rootScope.proposalId, function (result, event) {
            console.log("declred expense list");
            console.log(result);
            debugger;
            if (event.status) {
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].Name != undefined || result[i].Name != "") {
                            result[i].Name = result[i].Name ? result[i].Name.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Name;
                        }
                        if (result[i].Expense_Line_Items__r == undefined) {
                            result[i].Expense_Line_Items__r = [];
                            result[i].Expense_Line_Items__r.push({ "Expense_Head__c": result[i].Id, 'Description__c': '', "Year1_Expense__c": "", "Year2_Expense__c": "", "Year3_Expense__c": "", "Total_Expense__c": "", "Expense_Type__c": "" });
                        } else {
                            result[i].Expense_Line_Items__r = result[i].Expense_Line_Items__r;
                            for (var j = 0; j < result[i].Expense_Line_Items__r.length; j++) {
                                if (result[i].Expense_Line_Items__r[j].Description__c != undefined || result[i].Expense_Line_Items__r[j].Description__c != "") {
                                    result[i].Expense_Line_Items__r[j].Description__c = result[i].Expense_Line_Items__r[j].Description__c ? result[i].Expense_Line_Items__r[j].Description__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Expense_Line_Items__r[j].Description__c;
                                }
                            }
                        }
                    }
                    $scope.expenseList = result;
                    $scope.calculateOtherField();
                    $scope.calculateOtherField2();
                    $scope.calculateOtherField3();
                } else {
                    $scope.createExpenceHead();
                }
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }

    $scope.createExpenceHead = function () {
        debugger;
        if ($scope.accDetails.Contacts[0].MailingCountry == "India") {
            var allExpencehead = [{
                'Account__c': $scope.accDetails.Id,
                "Name": "Research staff",
                "Proposals__c": $rootScope.projectId,
            }, {
                'Account__c': $scope.accDetails.Id,
                "Name": "Consumables",
                "Proposals__c": $rootScope.projectId,
            },
            {
                'Account__c': $scope.accDetails.Id,
                "Name": "Research stay",
                "Proposals__c": $rootScope.projectId,
            }, {
                'Account__c': $scope.accDetails.Id,
                "Name": "Travel",
                "Proposals__c": $rootScope.projectId,
            }, {
                'Account__c': $scope.accDetails.Id,
                "Name": "Contingency",
                "Proposals__c": $rootScope.projectId,
            }, {
                'Account__c': $scope.accDetails.Id,
                "Name": "Miscellaneous and Others",
                "Proposals__c": $rootScope.projectId,
            }]
        } else if ($scope.accDetails.Contacts[0].MailingCountry == "Germany") {
            var allExpencehead = [{
                'Account__c': $scope.accDetails.Id,
                "Name": "Research staff",
                "Proposals__c": $rootScope.projectId,
            }, {
                'Account__c': $scope.accDetails.Id,
                "Name": "Consumables",
                "Proposals__c": $rootScope.projectId,
            },
            {
                'Account__c': $scope.accDetails.Id,
                "Name": "Research stay",
                "Proposals__c": $rootScope.projectId,
            }, {
                'Account__c': $scope.accDetails.Id,
                "Name": "Travel",
                "Proposals__c": $rootScope.projectId,
            }, {
                'Account__c': $scope.accDetails.Id,
                "Name": "Contingency",
                "Proposals__c": $rootScope.projectId,
            }, {
                'Account__c': $scope.accDetails.Id,
                "Name": "Miscellaneous and Others",
                "Proposals__c": $rootScope.projectId,
            }]
        }

        IndustrialFellowshipController.createExpenceHead(allExpencehead, function (result, event) {
            console.log("declred expense    list");
            console.log(result);
            debugger;
            if (event.status && result != null) {
                for (var i = 0; i < result.length; i++) {
                    result[i].Expense_Line_Items__r = [];
                    result[i].Expense_Line_Items__r.push({ "Expense_Head__c": result[i].Id, 'Description__c': '', "Year1_Expense__c": "", "Year2_Expense__c": "", "Year3_Expense__c": "", "Total_Expense__c": "", "Expense_Type__c": "" });
                }
                $scope.Expense_Line_Items__r = result;
                $scope.expenseList = result;
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }

    console.log('$scope.manPowerRecords::' + $scope.manPowerRecords);
    // $scope.proposalId = 'a081y0000029D81AAE';



    $scope.addRow = function (param1) {
        debugger;
        $scope.expenseList[param1].Expense_Line_Items__r.push({
            'Description__c': '',
            "Year1_Expense__c": "",
            "Year2_Expense__c": "",
            "Year3_Expense__c": "",
            "Expense_Head__c": $scope.expenseList[param1].Id
        });
        $scope.$apply();

    }

    $scope.deleteRow = function (param1, param2) {
        debugger;
        if ($scope.expenseList[param1].Expense_Line_Items__r.length > 1) {
            $scope.expenseList[param1].Expense_Line_Items__r.splice(param2, 1);
        }
    }

    $scope.saveExpenceLineitems = function () {
        $scope.expLineItem = [];
        debugger;

        $scope.emptyDescription = false;
        $scope.researchSum = 0;
        $scope.researchSum2 = 0;
        $scope.researchSum3 = 0;

        $scope.researchSumGermany = 0;
        $scope.researchSum2Germany - 0;
        $scope.researchSum3Germany = 0;

        $scope.travelSum = 0;
        $scope.travelSum2 = 0;
        $scope.travelSum3 = 0;

        $scope.travelSumGermany = 0;
        $scope.travelSum2Germany = 0;
        $scope.travelSum3Germany = 0;

        for (var i = 0; i < $scope.expenseList.length; i++) {
            for (var j = 0; j < $scope.expenseList[i].Expense_Line_Items__r.length; j++) {
                if (!$scope.expenseList[i].Expense_Line_Items__r[j].Description__c || $scope.expenseList[i].Expense_Line_Items__r[j].Description__c.trim() === "") {
                    $scope.emptyDescription = true;
                    break;
                }
            }
            if ($scope.emptyDescription) break;
        }

        if ($scope.emptyDescription) {
            swal("info", "Please fill in all descriptions before saving.", "info");
            return;
        }

        for (var i = 0; i < $scope.expenseList.length; i++) {
            if ($scope.accDetails.Contacts[0].MailingCountry == "India") {

                if ($scope.expenseList[i].Name == "Research stay") {
                    for (let j = 0; j < $scope.expenseList[i].Expense_Line_Items__r.length; j++) {
                        $scope.researchSum = $scope.researchSum + Number($scope.expenseList[i].Expense_Line_Items__r[j].Year1_Expense__c);
                        $scope.researchSum2 = $scope.researchSum2 + Number($scope.expenseList[i].Expense_Line_Items__r[j].Year2_Expense__c);
                        $scope.researchSum3 = $scope.researchSum3 + Number($scope.expenseList[i].Expense_Line_Items__r[j].Year3_Expense__c);
                    }
                } else if ($scope.expenseList[i].Name == "Travel") {
                    for (let j = 0; j < $scope.expenseList[i].Expense_Line_Items__r.length; j++) {
                        $scope.travelSum = $scope.travelSum + Number($scope.expenseList[i].Expense_Line_Items__r[j].Year1_Expense__c);
                        $scope.travelSum2 = $scope.travelSum2 + Number($scope.expenseList[i].Expense_Line_Items__r[j].Year2_Expense__c);
                        $scope.travelSum3 = $scope.travelSum3 + Number($scope.expenseList[i].Expense_Line_Items__r[j].Year3_Expense__c);
                    }
                }
            } else {
                if ($scope.expenseList[i].Name == "Research stay") {
                    for (let j = 0; j < $scope.expenseList[i].Expense_Line_Items__r.length; j++) {
                        $scope.researchSumGermany = $scope.researchSumGermany + Number($scope.expenseList[i].Expense_Line_Items__r[j].Year1_Expense__c);
                        $scope.researchSum2Germany = $scope.researchSum2Germany + Number($scope.expenseList[i].Expense_Line_Items__r[j].Year2_Expense__c);
                        $scope.researchSum3Germany = $scope.researchSum3Germany + Number($scope.expenseList[i].Expense_Line_Items__r[j].Year3_Expense__c);
                    }
                } else if ($scope.expenseList[i].Name == "Travel") {
                    for (let j = 0; j < $scope.expenseList[i].Expense_Line_Items__r.length; j++) {
                        $scope.travelSumGermany = $scope.travelSumGermany + Number($scope.expenseList[i].Expense_Line_Items__r[j].Year1_Expense__c);
                        $scope.travelSum2Germany = $scope.travelSum2Germany + Number($scope.expenseList[i].Expense_Line_Items__r[j].Year2_Expense__c);
                        $scope.travelSum3Germany = $scope.travelSum3Germany + Number($scope.expenseList[i].Expense_Line_Items__r[j].Year3_Expense__c);
                    }
                }
            }
        }

        for (var i = 0; i < $scope.expenseList.length; i++) {
            for (let j = 0; j < $scope.expenseList[i].Expense_Line_Items__r.length; j++) {
                delete ($scope.expenseList[i].Expense_Line_Items__r[j]['$$hashKey']);
                $scope.expLineItem.push($scope.expenseList[i].Expense_Line_Items__r[j]);
            }
        }
        $scope.totalSum = "";

        if ($scope.accDetails.Contacts[0].MailingCountry == "India") {
            // if($scope.researchSum > 200000){
            //     swal("info", "Research stay expense for each year should not be more than 200000.","info");
            //     return;  
            // }
            // if($scope.researchSum2 > 200000){
            //     swal("info", "Research stay expense for each year should not be more than 200000.","info");
            //     return;  
            // }
            // if($scope.researchSum3 > 200000){
            //     swal("info", "Research stay expense for each year should not be more than 200000.","info");
            //     return;  
            // }

            // if($scope.travelSum > 100000){
            //     swal("info", "Travel expense for each year should not be more than 100000.","info");
            //     return;  
            // }
            // if($scope.travelSum2 > 100000){
            //     swal("info", "Travel expense for each year should not be more than 100000.","info");
            //     return;  
            // }
            // if($scope.travelSum3 > 100000){
            //     swal("info", "Travel expense for each year should not be more than 100000.","info");
            //     return;  
            // }

            if ($scope.year1 > 1300000) {
                swal("info", "Year 1 expense should not be more than 1300000.", "info");
                return;
            }
            if ($scope.year2 > 1300000) {
                swal("info", "Year 2 expense should not be more than 1300000.", "info");
                return;
            }
            if ($scope.year3 > 1300000) {
                swal("info", "Year 3 expense should not be more than 1300000.", "info");
                return;
            }
            $scope.totalSum = $scope.year1 + $scope.year2 + $scope.year3;
        } else {
            // if($scope.researchSumGermany > 2300){
            //     swal("info", "Research stay expense for each year should not be more than 2300 €.","info");
            //     return;  
            // }
            // if($scope.researchSum2Germany > 2300){
            //     swal("info", "Research stay expense for each year should not be more than 2300 €.","info");
            //     return;  
            // }
            // if($scope.researchSum3Germany > 2300){
            //     swal("info", "Research stay expense for each year should not be more than 2300 €.","info");
            //     return;  
            // }

            // if($scope.travelSumGermany > 1500){
            //     swal("info", "Travel expense for each year should not be more than 1500 €.","info");
            //     return;  
            // }
            // if($scope.travelSum2Germany > 1500){
            //     swal("info", "Travel expense for each year should not be more than 1500 €.","info");
            //     return;  
            // }
            // if($scope.travelSum3Germany > 1500){
            //     swal("info", "Travel expense for each year should not be more than 1500 €.","info");
            //     return;  
            // }

            if ($scope.year1Germany > 16000) {
                swal("info", "Year 1 expense should not be more than 16000 €.", "info");
                return;
            }
            if ($scope.year2Germany > 16000) {
                swal("info", "Year 2 expense should not be more than 16000 €.", "info");
                return;
            }
            if ($scope.year3Germany > 16000) {
                swal("info", "Year 3 expense should not be more than 16000 €.", "info");
                return;
            }

            $scope.totalSum = $scope.year1Germany + $scope.year2Germany + $scope.year3Germany;
        }

        debugger;
        IndustrialFellowshipController.saveExpenceLineItemWISER($scope.expLineItem, $scope.totalSum, function (result, event) {
            if (event.status && result != null) {
                console.log(result);
                swal({
                    title: "SUCCESS",
                    text: 'Budget details have been saved successfully.',
                    icon: "success",
                    button: "ok!",
                })
                $scope.redirectPageURL('ExistingGrantWISER');

            } else {
                swal({
                    title: "ERROR",
                    text: "Exception !",
                    icon: "error",
                    button: "ok!",
                });
            }
            // if (event.status && result != null) {
            //     debugger;
            //     Swal.fire(
            //         'Success',
            //         'Budget details have been saved successfully.',
            //         'success'
            //    );
            //     $scope.redirectPageURL('HostProjectDetails');
            // }
        })
    }



    $scope.calculateOtherField = function () {
        debugger;
        $scope.year1 = 0;
        $scope.year1Germany = 0;
        for (var i = 0; i < $scope.expenseList.length; i++) {
            if ($scope.accDetails.Contacts[0].MailingCountry == "India") {
                if ($scope.expenseList[i].Expense_Line_Items__r != undefined) {
                    for (var j = 0; j < $scope.expenseList[i].Expense_Line_Items__r.length; j++) {
                        if ($scope.expenseList[i].Expense_Line_Items__r[j].Year1_Expense__c != undefined) {
                            $scope.year1 = $scope.year1 + Number($scope.expenseList[i].Expense_Line_Items__r[j].Year1_Expense__c);
                        }

                    }
                }
            } else {
                if ($scope.expenseList[i].Expense_Line_Items__r != undefined) {
                    for (var j = 0; j < $scope.expenseList[i].Expense_Line_Items__r.length; j++) {
                        if ($scope.expenseList[i].Expense_Line_Items__r[j].Year1_Expense__c != undefined) {
                            $scope.year1Germany = $scope.year1Germany + Number($scope.expenseList[i].Expense_Line_Items__r[j].Year1_Expense__c);
                        }

                    }
                }
            }
        }
        $scope.$apply();
    }


    $scope.calculateOtherField2 = function () {
        debugger;
        $scope.year2 = 0;
        $scope.year2Germany = 0;
        for (var i = 0; i < $scope.expenseList.length; i++) {
            if ($scope.accDetails.Contacts[0].MailingCountry == "India") {
                if ($scope.expenseList[i].Expense_Line_Items__r != undefined) {
                    for (var j = 0; j < $scope.expenseList[i].Expense_Line_Items__r.length; j++) {
                        if ($scope.expenseList[i].Expense_Line_Items__r[j].Year2_Expense__c != undefined) {
                            $scope.year2 = $scope.year2 + Number($scope.expenseList[i].Expense_Line_Items__r[j].Year2_Expense__c);
                        }
                    }
                }
            } else {
                if ($scope.expenseList[i].Expense_Line_Items__r != undefined) {
                    for (var j = 0; j < $scope.expenseList[i].Expense_Line_Items__r.length; j++) {
                        if ($scope.expenseList[i].Expense_Line_Items__r[j].Year2_Expense__c != undefined) {
                            $scope.year2Germany = $scope.year2Germany + Number($scope.expenseList[i].Expense_Line_Items__r[j].Year2_Expense__c);
                        }
                    }
                }
            }
        }
    }

    $scope.calculateOtherField3 = function () {
        debugger;
        $scope.year3 = 0;
        $scope.year3Germany = 0;
        for (var i = 0; i < $scope.expenseList.length; i++) {
            if ($scope.accDetails.Contacts[0].MailingCountry == "India") {
                if ($scope.expenseList[i].Expense_Line_Items__r != undefined) {
                    for (var j = 0; j < $scope.expenseList[i].Expense_Line_Items__r.length; j++) {
                        if ($scope.expenseList[i].Expense_Line_Items__r[j].Year3_Expense__c != undefined) {
                            $scope.year3 = $scope.year3 + Number($scope.expenseList[i].Expense_Line_Items__r[j].Year3_Expense__c);
                        }
                    }
                }
            } else {
                if ($scope.expenseList[i].Expense_Line_Items__r != undefined) {
                    for (var j = 0; j < $scope.expenseList[i].Expense_Line_Items__r.length; j++) {
                        if ($scope.expenseList[i].Expense_Line_Items__r[j].Year3_Expense__c != undefined) {
                            $scope.year3Germany = $scope.year3Germany + Number($scope.expenseList[i].Expense_Line_Items__r[j].Year3_Expense__c);
                        }
                    }
                }
            }
        }
    }
    $scope.redirectPageURL = function (pageName) {
        debugger;
        var link = document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href = "#/" + pageName;
        link.click();
    }
})