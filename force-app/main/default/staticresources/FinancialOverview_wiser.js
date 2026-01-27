angular.module('cp_app').controller('financialWiser_Ctrl', function ($scope, $rootScope) {
    console.log('Intiated::');
    $scope.siteURL = siteURL;
    $rootScope.projectId;
    $rootScope.proposalId;
    $rootScope.contactId;
    $rootScope.apaId = '';
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
    $rootScope.candidateId;

    const PER_DIEM_MONTHLY = 2300;
    const DAYS_IN_MONTH = 30;
    const PER_DAY_COST = PER_DIEM_MONTHLY / DAYS_IN_MONTH;
    const MAX_RESEARCH_AMOUNT = 16000;

    // Budget table variables (using different names to avoid conflicts with expense arrays)
    // ===== INITIALIZE MODELS =====
    $scope.budgetResearchStay = {
        daysYear1: 0,
        daysYear2: 0,
        daysYear3: 0,
        costYear1: 0,
        costYear2: 0,
        costYear3: 0,
        totalDays: 0,
        totalCost: 0
    };

    $scope.budgetTravel = {
        costYear1: 0,
        costYear2: 0,
        costYear3: 0,
        totalCost: 0
    };

    // Research Staff as array to support multiple records
    $scope.budgetResearchStaffList = [{
        positionsYear1: 0,
        positionsYear2: 0,
        positionsYear3: 0,
        costYear1: 0,
        costYear2: 0,
        costYear3: 0,
        hoursYear1: 0,
        hoursYear2: 0,
        hoursYear3: 0,
        totalYear1: 0,
        totalYear2: 0,
        totalYear3: 0,
        totalAmount: 0,
        researchStaffType: 'Research staff 1', // Track the backend type name
        expenseHeadIds: [] // Store Expense_Head__c IDs for deletion
    }];

    // Aggregate totals for all Research Staff records
    $scope.budgetResearchStaff = {
        totalYear1: 0,
        totalYear2: 0,
        totalYear3: 0,
        totalAmount: 0
    };

    $scope.budgetConsumables = {
        year1: 0,
        year2: 0,
        year3: 0,
        total: 0
    };

    $scope.minorEquipment = {
        year1: 0,
        year2: 0,
        year3: 0,
        total: 0
    };

    $scope.budgetContingency = {
        year1: 0,
        year2: 0,
        year3: 0,
        total: 0
    };

    $scope.budgetOverhead = {
        percentageYear1: 0,
        percentageYear2: 0,
        percentageYear3: 0,
        amountYear1: 0,
        amountYear2: 0,
        amountYear3: 0,
        totalAmount: 0
    };

    $scope.researchStayTravelTotal = {
        year1: 0,
        year2: 0,
        year3: 0,
        total: 0
    };

    $scope.totalResearchHeads = {
        year1: 0,
        year2: 0,
        year3: 0,
        total: 0
    };

    $scope.totalResearchAmount = {
        year1: 0,
        year2: 0,
        year3: 0,
        total: 0
    };

    $scope.remainingForResearch = {
        year1: 0,
        year2: 0,
        year3: 0,
        total: 0
    };

    $scope.grandTotal = {
        year1: 0,
        year2: 0,
        year3: 0,
        total: 0
    };


    //     $scope.budgetResearchStay = {
    //     daysYear1,
    //     daysYear2,
    //     daysYear3,
    //     costYear1,
    //     costYear2,
    //     costYear3,
    //     totalDays,
    //     totalCost
    // };
    // $scope.budgetTravel = {
    //     costYear1,
    //     costYear2,
    //     costYear3,
    //     totalCost
    // };
    // $scope.researchStayTravelTotal = {
    //     year1,
    //     year2,
    //     year3,
    //     total
    // };
    // $scope.totalResearchAmount = {
    //     year1,
    //     year2,
    //     year3,
    //     total
    // };
    // $scope.budgetOverhead = {
    //     percentageYear1,
    //     percentageYear2,
    //     percentageYear3,
    //     amountYear1,
    //     amountYear2,
    //     amountYear3,
    //     totalAmount
    // };
    // $scope.remainingForResearch = {
    //     year1,
    //     year2,
    //     year3,
    //     total
    // };
    // $scope.budgetResearchStaff = {
    //     positionsYear1,
    //     positionsYear2,
    //     positionsYear3,
    //     costYear1,
    //     costYear2,
    //     costYear3,
    //     hoursYear1,
    //     hoursYear2,
    //     hoursYear3,
    //     totalYear1,
    //     totalYear2,
    //     totalYear3,
    //     totalAmount
    // };
    // $scope.budgetConsumables = {
    //     year1,
    //     year2,
    //     year3,
    //     total
    // };
    // $scope.minorEquipment = {
    //     year1,
    //     year2,
    //     year3,
    //     total
    // };
    // $scope.budgetContingency = {
    //     year1,
    //     year2,
    //     year3,
    //     total
    // };
    // $scope.grandTotal = {
    //     year1,
    //     year2,
    //     year3,
    //     total
    // };

    if (localStorage.getItem('apaId')) {
        $rootScope.apaId = localStorage.getItem('apaId');
        console.log('Loaded proposalId from localStorage:', $rootScope.apaId);
    }

    console.log('$rootScope.candidateId ===>>' + $rootScope.candidateId);

    // Function to set year visibility based on duration
    $scope.setYearVisibilityBasedOnDuration = function () {
        if ($rootScope.proposalDurationMonths === 24) {
            $scope.Showyear2 = true;
            $scope.Showyear3 = false;
            $scope.numberOfYears = 2;
        } else if ($rootScope.proposalDurationMonths === 36) {
            $scope.Showyear2 = true;
            $scope.Showyear3 = true;
            $scope.numberOfYears = 3;
        } else {
            $scope.Showyear2 = false;
            $scope.Showyear3 = false;
            $scope.numberOfYears = 1;
        }
        console.log('Year visibility set - Duration:', $rootScope.proposalDurationMonths, 'Years:', $scope.numberOfYears);
    };

    $scope.getApplicantStatusFromAPA = function () {

        ApplicantPortal_Contoller.fetchApplicantStatusWithDuration(
            $rootScope.apaId,
            function (result, event) {

                console.log('Result:', result);
                console.log('Event:', event);

                if (event.status && result) {

                    // Status flag
                    $rootScope.isCurrentUserSubmitted = result.applicantStatus === 'Submitted';

                    // Duration (store wherever needed)
                    $rootScope.proposalDurationMonths = result.durationInMonths;

                    // Set year visibility based on duration
                    $scope.setYearVisibilityBasedOnDuration();

                    // Lock editor only if submitted
                    if ($rootScope.isCurrentUserSubmitted) {
                        CKEDITOR.config.readOnly = true;
                    }

                } else {
                    console.error('fetchApplicantStatus failed:', event.message);
                }
            },
            { escape: true }
        );
    };

    $scope.getApplicantStatusFromAPA();

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

                // Set $rootScope.proposalDurationMonths if not already set
                if (!$rootScope.proposalDurationMonths) {
                    $rootScope.proposalDurationMonths = result.durationInMonths;
                }

                // Set year visibility based on duration
                $scope.setYearVisibilityBasedOnDuration();

                console.log('Duration months:', $scope.durationMonths, 'Proposal duration:', $rootScope.proposalDurationMonths);
                $scope.getExpenseRecords();

                // Try to get expense records from ApplicantPortal_Contoller if contactId is available
                if ($rootScope.proposalId && $rootScope.contactId) {
                    $scope.getExpenseRecordsFromApex();
                } else {
                    // Initialize budget table calculations even if we don't have contactId
                    $scope.recalculateAll();
                }

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
                    // Process expense records to populate expense table arrays
                    $scope.processExpenseRecordsForTable();
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

    // Process expense records to populate expense table arrays - Matching ExpenseDeclaration.js logic
    $scope.processExpenseRecordsForTable = function () {
        // Reset arrays
        $scope.manPowerRecords = [];
        $scope.consumables = [];
        $scope.Equipment = [];
        $scope.travel = [];
        $scope.outsourcing = [];
        $scope.contingency = [];
        $scope.overhead = [];

        // Reset totals
        $scope.manPower = {};
        $scope.equipmentTotals = {};
        $scope.consumableTotal = {};
        $scope.travelTotal = {};
        $scope.outsourcingTotal = {};
        $scope.contingencyTotal = {};
        $scope.overheadCharges = {};

        if ($scope.expenseList && $scope.expenseList.length > 0) {
            for (var i = 0; i < $scope.expenseList.length; i++) {
                var expenseHead = $scope.expenseList[i];
                var headName = expenseHead.Name;

                if (expenseHead.Expense_Line_Items__r && expenseHead.Expense_Line_Items__r.length > 0) {
                    for (var j = 0; j < expenseHead.Expense_Line_Items__r.length; j++) {
                        var lineItem = expenseHead.Expense_Line_Items__r[j];

                        var record = {
                            Id: lineItem.Id,
                            Description__c: lineItem.Description__c || '',
                            Position__c: lineItem.Position__c || '',
                            Number__c: lineItem.Number__c || '',
                            Person_Month__c: lineItem.Person_Month__c || '',
                            Salary_Month__c: lineItem.Salary_Month__c || '',
                            Unit_Price__c: lineItem.Unit_Price__c || '',
                            Multiplier__c: lineItem.Multiplier__c || '',
                            Year1_Expense__c: lineItem.Year1_Expense__c || 0,
                            Year2_Expense__c: lineItem.Year2_Expense__c || 0,
                            Year3_Expense__c: lineItem.Year3_Expense__c || 0,
                            Total_Expense__c: lineItem.Total_Expense__c || 0,
                            Expense_Head__c: expenseHead.Id,
                            Expense_Type__c: headName
                        };

                        // Categorize by expense head name - Matching ExpenseDeclaration.js
                        if (headName === 'Research staff' || headName === 'Manpower') {
                            $scope.manPowerRecords.push(record);
                            $scope.manPower.Total_Year1_Expense__c = Number((($scope.manPower.Total_Year1_Expense__c || 0) + (lineItem.Year1_Expense__c || 0)).toFixed(2));
                            $scope.manPower.Total_Year2_Expense__c = Number((($scope.manPower.Total_Year2_Expense__c || 0) + (lineItem.Year2_Expense__c || 0)).toFixed(2));
                            $scope.manPower.Total_Year3_Expense__c = Number((($scope.manPower.Total_Year3_Expense__c || 0) + (lineItem.Year3_Expense__c || 0)).toFixed(2));
                            $scope.manPower.Overall_Expense = Number(($scope.manPower.Total_Year1_Expense__c + $scope.manPower.Total_Year2_Expense__c + $scope.manPower.Total_Year3_Expense__c).toFixed(2));
                        } else if (headName === 'Consumables' || headName === 'Consumables/Materials') {
                            $scope.consumables.push(record);
                            $scope.consumableTotal.Total_Year1_Expense__c = Number((($scope.consumableTotal.Total_Year1_Expense__c || 0) + (lineItem.Year1_Expense__c || 0)).toFixed(2));
                            $scope.consumableTotal.Total_Year2_Expense__c = Number((($scope.consumableTotal.Total_Year2_Expense__c || 0) + (lineItem.Year2_Expense__c || 0)).toFixed(2));
                            $scope.consumableTotal.Total_Year3_Expense__c = Number((($scope.consumableTotal.Total_Year3_Expense__c || 0) + (lineItem.Year3_Expense__c || 0)).toFixed(2));
                            $scope.consumableTotal.Overall_Expense = Number(($scope.consumableTotal.Total_Year1_Expense__c + $scope.consumableTotal.Total_Year2_Expense__c + $scope.consumableTotal.Total_Year3_Expense__c).toFixed(2));
                        } else if (headName === 'Equipment' || headName === 'Equipment & Accessories') {
                            $scope.Equipment.push(record);
                            $scope.equipmentTotals.Total_Year1_Expense__c = Number((($scope.equipmentTotals.Total_Year1_Expense__c || 0) + (lineItem.Year1_Expense__c || 0)).toFixed(2));
                            $scope.equipmentTotals.Total_Year2_Expense__c = Number((($scope.equipmentTotals.Total_Year2_Expense__c || 0) + (lineItem.Year2_Expense__c || 0)).toFixed(2));
                            $scope.equipmentTotals.Total_Year3_Expense__c = Number((($scope.equipmentTotals.Total_Year3_Expense__c || 0) + (lineItem.Year3_Expense__c || 0)).toFixed(2));
                            $scope.equipmentTotals.Overall_Expense = Number(($scope.equipmentTotals.Total_Year1_Expense__c + $scope.equipmentTotals.Total_Year2_Expense__c + $scope.equipmentTotals.Total_Year3_Expense__c).toFixed(2));
                        } else if (headName === 'Travel' || headName === 'Travel & Networking') {
                            $scope.travel.push(record);
                            $scope.travelTotal.Total_Year1_Expense__c = Number((($scope.travelTotal.Total_Year1_Expense__c || 0) + (lineItem.Year1_Expense__c || 0)).toFixed(2));
                            $scope.travelTotal.Total_Year2_Expense__c = Number((($scope.travelTotal.Total_Year2_Expense__c || 0) + (lineItem.Year2_Expense__c || 0)).toFixed(2));
                            $scope.travelTotal.Total_Year3_Expense__c = Number((($scope.travelTotal.Total_Year3_Expense__c || 0) + (lineItem.Year3_Expense__c || 0)).toFixed(2));
                            $scope.travelTotal.Overall_Expense = Number(($scope.travelTotal.Total_Year1_Expense__c + $scope.travelTotal.Total_Year2_Expense__c + $scope.travelTotal.Total_Year3_Expense__c).toFixed(2));
                        } else if (headName === 'Overhead' || headName === 'Projektpauschale') {
                            $scope.overhead.push(record);
                            $scope.overheadCharges.Total_Year1_Expense__c = Number((($scope.overheadCharges.Total_Year1_Expense__c || 0) + (lineItem.Year1_Expense__c || 0)).toFixed(2));
                            $scope.overheadCharges.Total_Year2_Expense__c = Number((($scope.overheadCharges.Total_Year2_Expense__c || 0) + (lineItem.Year2_Expense__c || 0)).toFixed(2));
                            $scope.overheadCharges.Total_Year3_Expense__c = Number((($scope.overheadCharges.Total_Year3_Expense__c || 0) + (lineItem.Year3_Expense__c || 0)).toFixed(2));
                            $scope.overheadCharges.Overall_Expense = Number(($scope.overheadCharges.Total_Year1_Expense__c + $scope.overheadCharges.Total_Year2_Expense__c + $scope.overheadCharges.Total_Year3_Expense__c).toFixed(2));
                        } else if (headName === 'Contingency') {
                            $scope.contingency.push(record);
                            $scope.contingencyTotal.Total_Year1_Expense__c = Number((($scope.contingencyTotal.Total_Year1_Expense__c || 0) + (lineItem.Year1_Expense__c || 0)).toFixed(2));
                            $scope.contingencyTotal.Total_Year2_Expense__c = Number((($scope.contingencyTotal.Total_Year2_Expense__c || 0) + (lineItem.Year2_Expense__c || 0)).toFixed(2));
                            $scope.contingencyTotal.Total_Year3_Expense__c = Number((($scope.contingencyTotal.Total_Year3_Expense__c || 0) + (lineItem.Year3_Expense__c || 0)).toFixed(2));
                            $scope.contingencyTotal.Overall_Expense = Number(($scope.contingencyTotal.Total_Year1_Expense__c + $scope.contingencyTotal.Total_Year2_Expense__c + $scope.contingencyTotal.Total_Year3_Expense__c).toFixed(2));
                        } else if (headName === 'Subcontract/Outsourcing' || headName === 'Miscellaneous and Others') {
                            $scope.outsourcing.push(record);
                            $scope.outsourcingTotal.Total_Year1_Expense__c = Number((($scope.outsourcingTotal.Total_Year1_Expense__c || 0) + (lineItem.Year1_Expense__c || 0)).toFixed(2));
                            $scope.outsourcingTotal.Total_Year2_Expense__c = Number((($scope.outsourcingTotal.Total_Year2_Expense__c || 0) + (lineItem.Year2_Expense__c || 0)).toFixed(2));
                            $scope.outsourcingTotal.Total_Year3_Expense__c = Number((($scope.outsourcingTotal.Total_Year3_Expense__c || 0) + (lineItem.Year3_Expense__c || 0)).toFixed(2));
                            $scope.outsourcingTotal.Overall_Expense = Number(($scope.outsourcingTotal.Total_Year1_Expense__c + $scope.outsourcingTotal.Total_Year2_Expense__c + $scope.outsourcingTotal.Total_Year3_Expense__c).toFixed(2));
                        }
                    }
                }
            }
        }

        // Ensure arrays have at least one empty record if they're empty
        if ($scope.manPowerRecords.length === 0) {
            $scope.manPowerRecords.push({
                "Position__c": "",
                "Person_Month__c": "",
                "Salary_Month__c": "",
                "Year1_Expense__c": undefined,
                "Year2_Expense__c": undefined,
                "Year3_Expense__c": undefined,
                "Total_Expense__c": undefined
            });
        }
        if ($scope.consumables.length === 0) {
            $scope.consumables.push({
                "Description__c": "",
                "Unit_Price__c": "",
                "Number__c": "",
                "Year1_Expense__c": undefined,
                "Year2_Expense__c": undefined,
                "Year3_Expense__c": undefined,
                "Total_Expense__c": undefined
            });
        }
        if ($scope.Equipment.length === 0) {
            $scope.Equipment.push({
                "Description__c": "",
                "Unit_Price__c": "",
                "Number__c": "",
                "Year1_Expense__c": undefined,
                "Year2_Expense__c": undefined,
                "Year3_Expense__c": undefined,
                "Total_Expense__c": undefined
            });
        }
        if ($scope.travel.length === 0) {
            $scope.travel.push({
                "Description__c": "",
                "Unit_Price__c": "",
                "Number__c": "",
                "Year1_Expense__c": undefined,
                "Year2_Expense__c": undefined,
                "Year3_Expense__c": undefined,
                "Total_Expense__c": undefined
            });
        }
        if ($scope.overhead.length === 0) {
            $scope.overhead.push({
                "Description__c": "",
                "Unit_Price__c": "",
                "Year1_Expense__c": undefined,
                "Year2_Expense__c": undefined,
                "Year3_Expense__c": undefined,
                "Total_Expense__c": undefined
            });
        }
        if ($scope.contingency.length === 0) {
            $scope.contingency.push({
                "Description__c": "",
                "Unit_Price__c": "",
                "Year1_Expense__c": undefined,
                "Year2_Expense__c": undefined,
                "Year3_Expense__c": undefined,
                "Total_Expense__c": undefined
            });
        }
        if ($scope.outsourcing.length === 0) {
            $scope.outsourcing.push({
                "Description__c": "",
                "Unit_Price__c": "",
                "Year1_Expense__c": undefined,
                "Year2_Expense__c": undefined,
                "Year3_Expense__c": undefined,
                "Total_Expense__c": undefined
            });
        }

        $scope.updateTotals();
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
        // Use new budget table save method if apaId is available
        if ($rootScope.apaId) {
            $scope.saveBudgetTableData();
            return;
        }

        // Otherwise use existing method
        $scope.expLineItem = [];
        debugger;

        $scope.emptyDescription = false;
        $scope.researchSum = 0;
        $scope.researchSum2 = 0;
        $scope.researchSum3 = 0;

        $scope.researchSumGermany = 0;
        $scope.researchSum2Germany = 0;
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
            if (!event) {
                console.error('Event is null or undefined');
                swal("Error", "Failed to save: No response from server.", "error");
                return;
            }

            if (event.status && result != null) {
                console.log('Save successful - result:', result);
                swal({
                    title: "SUCCESS",
                    text: 'Budget details have been saved successfully.',
                    icon: "success",
                    button: "ok!",
                });

                // Redirect immediately - don't wait for swal
                setTimeout(function () {
                    $scope.redirectPageURL('ExistingGrantWISER');
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                }, 1000);

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

    // Expense Table Variables - Matching ExpenseDeclaration.js
    $scope.numberOfYears = 1;
    $scope.outsourcing = [];
    $scope.contingency = [];
    $scope.overhead = [];
    $scope.manPower = {};
    $scope.equipmentTotals = {};
    $scope.consumableTotal = {};
    $scope.travelTotal = {};
    $scope.outsourcingTotal = {};
    $scope.contingencyTotal = {};
    $scope.overheadCharges = {};
    $scope.subTotal = {};
    $scope.totals = {};
    $scope.igstcFunding = {};
    $scope.industryContr = {};

    // Add row methods - Matching ExpenseDeclaration.js
    $scope.addRow = function (param1, param2) {
        $scope.manPowerRecords.push({
            "Position__c": "",
            "Person_Month__c": "",
            "Salary_Month__c": "",
            "Year1_Expense__c": undefined,
            "Year2_Expense__c": undefined,
            "Year3_Expense__c": undefined,
            "Total_Expense__c": undefined
        });
        $scope.$apply();
    }
    $scope.addRowCon = function (param1, param2) {
        $scope.consumables.push({
            "Description__c": "",
            "Unit_Price__c": "",
            "Number__c": "",
            "Year1_Expense__c": undefined,
            "Year2_Expense__c": undefined,
            "Year3_Expense__c": undefined,
            "Total_Expense__c": undefined
        });
    }
    $scope.addRowEquip = function (param1, param2) {
        $scope.Equipment.push({
            "Description__c": "",
            "Unit_Price__c": "",
            "Number__c": "",
            "Year1_Expense__c": undefined,
            "Year2_Expense__c": undefined,
            "Year3_Expense__c": undefined,
            "Total_Expense__c": undefined
        });
    }
    $scope.addRowOutsourcing = function (param1, param2) {
        $scope.outsourcing.push({
            "Description__c": "",
            "Unit_Price__c": "",
            "Year1_Expense__c": undefined,
            "Year2_Expense__c": undefined,
            "Year3_Expense__c": undefined,
            "Total_Expense__c": undefined
        });
    }

    // Delete row methods - Matching ExpenseDeclaration.js
    $scope.deleteRow = function (param1, param2, Id) {
        if ($scope.manPowerRecords.length > 1) {
            $scope.manPowerRecords.splice(param2, 1);
        }
        $scope.manPower.Total_Year1_Expense__c = $scope.manPowerRecords.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Year1_Expense__c || 0);
        }, 0);
        $scope.manPower.Total_Year2_Expense__c = $scope.manPowerRecords.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Year2_Expense__c || 0);
        }, 0);
        $scope.manPower.Total_Year3_Expense__c = $scope.manPowerRecords.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Year3_Expense__c || 0);
        }, 0);
        $scope.manPower.Overall_Expense = $scope.manPowerRecords.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Total_Expense__c || 0);
        }, 0);
        $scope.updateTotals();
    }
    $scope.deleteRowConsumables = function (param1, param2, Id) {
        if ($scope.consumables.length > 1) {
            $scope.consumables.splice(param2, 1);
        }
        $scope.consumableTotal.Total_Year1_Expense__c = $scope.consumables.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Year1_Expense__c || 0);
        }, 0);
        $scope.consumableTotal.Total_Year2_Expense__c = $scope.consumables.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Year2_Expense__c || 0);
        }, 0);
        $scope.consumableTotal.Total_Year3_Expense__c = $scope.consumables.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Year3_Expense__c || 0);
        }, 0);
        $scope.consumableTotal.Overall_Expense = $scope.consumables.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Total_Expense__c || 0);
        }, 0);
        $scope.updateTotals();
    }
    $scope.deleteRowEquipment = function (param1, param2, Id) {
        if ($scope.Equipment.length > 1) {
            $scope.Equipment.splice(param2, 1);
        }
        $scope.equipmentTotals.Total_Year1_Expense__c = $scope.Equipment.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Year1_Expense__c || 0);
        }, 0);
        $scope.equipmentTotals.Total_Year2_Expense__c = $scope.Equipment.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Year2_Expense__c || 0);
        }, 0);
        $scope.equipmentTotals.Total_Year3_Expense__c = $scope.Equipment.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Year3_Expense__c || 0);
        }, 0);
        $scope.equipmentTotals.Overall_Expense = $scope.Equipment.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Total_Expense__c || 0);
        }, 0);
        $scope.updateTotals();
    }
    $scope.deleteRowOutsourcing = function (param1, param2, Id) {
        if ($scope.outsourcing.length > 1) {
            $scope.outsourcing.splice(param2, 1);
        }
        $scope.outsourcingTotal.Total_Year1_Expense__c = $scope.outsourcing.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Year1_Expense__c || 0);
        }, 0);
        $scope.outsourcingTotal.Total_Year2_Expense__c = $scope.outsourcing.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Year2_Expense__c || 0);
        }, 0);
        $scope.outsourcingTotal.Total_Year3_Expense__c = $scope.outsourcing.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Year3_Expense__c || 0);
        }, 0);
        $scope.outsourcingTotal.Overall_Expense = $scope.outsourcing.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Total_Expense__c || 0);
        }, 0);
        $scope.updateTotals();
    }
    $scope.deleteRowContingency = function (param1, param2, Id) {
        if ($scope.contingency.length > 1) {
            $scope.contingency.splice(param2, 1);
        }
        $scope.contingencyTotal.Total_Year1_Expense__c = $scope.contingency.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Year1_Expense__c || 0);
        }, 0);
        $scope.contingencyTotal.Total_Year2_Expense__c = $scope.contingency.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Year2_Expense__c || 0);
        }, 0);
        $scope.contingencyTotal.Total_Year3_Expense__c = $scope.contingency.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Year3_Expense__c || 0);
        }, 0);
        $scope.contingencyTotal.Overall_Expense = $scope.contingency.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Total_Expense__c || 0);
        }, 0);
        $scope.updateTotals();
    }
    $scope.deleteRowOverhead = function (param1, param2, Id) {
        if ($scope.overhead.length > 1) {
            $scope.overhead.splice(param2, 1);
        }
        $scope.overheadCharges.Total_Year1_Expense__c = $scope.overhead.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Year1_Expense__c || 0);
        }, 0);
        $scope.overheadCharges.Total_Year2_Expense__c = $scope.overhead.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Year2_Expense__c || 0);
        }, 0);
        $scope.overheadCharges.Total_Year3_Expense__c = $scope.overhead.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Year3_Expense__c || 0);
        }, 0);
        $scope.overheadCharges.Overall_Expense = $scope.overhead.reduce(function (accumulator, currentValue) {
            return accumulator + (currentValue.Total_Expense__c || 0);
        }, 0);
        $scope.updateTotals();
    }

    // Calculate Other Field - Matching ExpenseDeclaration.js
    $scope.calculateOtherField = function (exType) {
        function toNum(val) {
            return val != null && val !== '' && !isNaN(val)
                ? Number(parseFloat(val).toFixed(2))
                : 0;
        }

        function round2(val) {
            return Number(parseFloat(val).toFixed(2));
        }

        function sum(arr, field) {
            return round2(arr.reduce((acc, cur) => acc + toNum(cur[field]), 0));
        }

        function calcTotals(list, totalObj) {
            for (let i = 0; i < list.length; i++) {
                const r = list[i];
                r.Total_Expense__c = round2(toNum(r.Year1_Expense__c) + toNum(r.Year2_Expense__c) + toNum(r.Year3_Expense__c));
            }
            totalObj.Total_Year1_Expense__c = sum(list, 'Year1_Expense__c');
            totalObj.Total_Year2_Expense__c = sum(list, 'Year2_Expense__c');
            totalObj.Total_Year3_Expense__c = sum(list, 'Year3_Expense__c');
            totalObj.Overall_Expense = round2(list.reduce((acc, cur) => acc + toNum(cur.Total_Expense__c), 0));
        }

        if (exType === 'man') {
            calcTotals($scope.manPowerRecords, $scope.manPower);
        }
        else if (exType === 'cons') {
            calcTotals($scope.consumables, $scope.consumableTotal);
        }
        else if (exType === 'equi') {
            calcTotals($scope.Equipment, $scope.equipmentTotals);
        }
        else if (exType === 'travel') {
            calcTotals($scope.travel, $scope.travelTotal);
        }
        else if (exType === 'outsourcing') {
            calcTotals($scope.outsourcing, $scope.outsourcingTotal);
        }
        else if (exType === 'contingency') {
            calcTotals($scope.contingency, $scope.contingencyTotal);
        }
        else if (exType === 'overhead') {
            calcTotals($scope.overhead, $scope.overheadCharges);
        }
        else if (exType === 'igstc') {
            $scope.igstcFunding.Total_Expense__c = round2(
                toNum($scope.igstcFunding.Year1_Expense__c) +
                toNum($scope.igstcFunding.Year2_Expense__c) +
                toNum($scope.igstcFunding.Year3_Expense__c)
            );
        }
        else if (exType === 'ic') {
            $scope.industryContr.Total_Expense__c = round2(
                toNum($scope.industryContr.Year1_Expense__c) +
                toNum($scope.industryContr.Year2_Expense__c) +
                toNum($scope.industryContr.Year3_Expense__c)
            );
        }
        $scope.updateTotals();
    };

    // Update Totals - Matching ExpenseDeclaration.js
    $scope.updateTotals = function () {
        function toNum(val) {
            return val != null && val !== '' && !isNaN(val)
                ? Number(parseFloat(val).toFixed(2))
                : 0;
        }

        function round2(val) {
            return Number(parseFloat(val).toFixed(2));
        }

        $scope.subTotal.Total_Year1_Expense__c = round2(
            toNum($scope.manPower.Total_Year1_Expense__c) +
            toNum($scope.consumableTotal.Total_Year1_Expense__c) +
            toNum($scope.equipmentTotals.Total_Year1_Expense__c) +
            toNum($scope.travelTotal.Total_Year1_Expense__c) +
            toNum($scope.outsourcingTotal.Total_Year1_Expense__c) +
            toNum($scope.contingencyTotal.Total_Year1_Expense__c)
        );

        $scope.subTotal.Total_Year2_Expense__c = round2(
            toNum($scope.manPower.Total_Year2_Expense__c) +
            toNum($scope.consumableTotal.Total_Year2_Expense__c) +
            toNum($scope.equipmentTotals.Total_Year2_Expense__c) +
            toNum($scope.travelTotal.Total_Year2_Expense__c) +
            toNum($scope.outsourcingTotal.Total_Year2_Expense__c) +
            toNum($scope.contingencyTotal.Total_Year2_Expense__c)
        );

        $scope.subTotal.Total_Year3_Expense__c = round2(
            toNum($scope.manPower.Total_Year3_Expense__c) +
            toNum($scope.consumableTotal.Total_Year3_Expense__c) +
            toNum($scope.equipmentTotals.Total_Year3_Expense__c) +
            toNum($scope.travelTotal.Total_Year3_Expense__c) +
            toNum($scope.outsourcingTotal.Total_Year3_Expense__c) +
            toNum($scope.contingencyTotal.Total_Year3_Expense__c)
        );

        $scope.subTotal.Overall_Expense = round2(
            toNum($scope.manPower.Overall_Expense) +
            toNum($scope.consumableTotal.Overall_Expense) +
            toNum($scope.equipmentTotals.Overall_Expense) +
            toNum($scope.travelTotal.Overall_Expense) +
            toNum($scope.outsourcingTotal.Overall_Expense) +
            toNum($scope.contingencyTotal.Overall_Expense)
        );

        $scope.totals.Total_Year1_Expense__c = round2(
            toNum($scope.subTotal.Total_Year1_Expense__c) +
            toNum($scope.overheadCharges.Total_Year1_Expense__c)
        );

        $scope.totals.Total_Year2_Expense__c = round2(
            toNum($scope.subTotal.Total_Year2_Expense__c) +
            toNum($scope.overheadCharges.Total_Year2_Expense__c)
        );

        $scope.totals.Total_Year3_Expense__c = round2(
            toNum($scope.subTotal.Total_Year3_Expense__c) +
            toNum($scope.overheadCharges.Total_Year3_Expense__c)
        );

        $scope.totals.Overall_Expense = round2(
            toNum($scope.subTotal.Overall_Expense) +
            toNum($scope.overheadCharges.Overall_Expense)
        );
    };

    // // ========== BUDGET TABLE CALCULATION METHODS ==========
    // // Flag to prevent infinite loops during calculations
    // $scope.isCalculating = false;

    // // Master calculation method - calls all calculations in correct order without circular dependencies
    // $scope.recalculateAll = function () {
    //     if ($scope.isCalculating) {
    //         return; // Prevent infinite loops
    //     }
    //     $scope.isCalculating = true;

    //     try {

    //         // --- CALCULATION : Research Stay Per diem cost --- //
    //         const perDay = 2300 / 30;

    //         // --- Research Stay Days ---
    //         const d1 = Number($scope.budgetResearchStay.daysYear1) || 0;
    //         const d2 = Number($scope.budgetResearchStay.daysYear2) || 0;
    //         const d3 = Number($scope.budgetResearchStay.daysYear3) || 0;

    //         $scope.budgetResearchStay.totalDays = d1 + d2 + d3;

    //         // --- Research Stay Per Diem Cost (AUTO CALCULATED) ---
    //         $scope.budgetResearchStay.costYear1 = Math.round(d1 * perDay * 100) / 100;
    //         $scope.budgetResearchStay.costYear2 = Math.round(d2 * perDay * 100) / 100;
    //         $scope.budgetResearchStay.costYear3 = Math.round(d3 * perDay * 100) / 100;

    //         $scope.budgetResearchStay.totalCost =
    //             $scope.budgetResearchStay.costYear1 +
    //             $scope.budgetResearchStay.costYear2 +
    //             $scope.budgetResearchStay.costYear3;

    //         // --- CALCULATION : Travel Cost per Visit (AUTO CALCULATED) ---
    //         $scope.budgetTravel.costYear1 =
    //             $scope.budgetResearchStay.costYear1 > 0 ? 1500 : 0;

    //         $scope.budgetTravel.costYear2 =
    //             $scope.budgetResearchStay.costYear2 > 0 ? 1500 : 0;

    //         $scope.budgetTravel.costYear3 =
    //             $scope.budgetResearchStay.costYear3 > 0 ? 1500 : 0;

    //         $scope.budgetTravel.totalCost =
    //             $scope.budgetTravel.costYear1 +
    //             $scope.budgetTravel.costYear2 +
    //             $scope.budgetTravel.costYear3;


    //         // Step 1: Calculate individual component totals
    //         $scope.budgetResearchStay.totalDays = ($scope.budgetResearchStay.daysYear1 || 0) + ($scope.budgetResearchStay.daysYear2 || 0) + ($scope.budgetResearchStay.daysYear3 || 0);
    //         $scope.budgetResearchStay.totalCost = ($scope.budgetResearchStay.costYear1 || 0) + ($scope.budgetResearchStay.costYear2 || 0) + ($scope.budgetResearchStay.costYear3 || 0);

    //         $scope.budgetTravel.totalCost = ($scope.budgetTravel.costYear1 || 0) + ($scope.budgetTravel.costYear2 || 0) + ($scope.budgetTravel.costYear3 || 0);

    //         $scope.budgetResearchStaff.totalYear1 = ($scope.budgetResearchStaff.positionsYear1 || 0) * ($scope.budgetResearchStaff.costYear1 || 0) * ($scope.budgetResearchStaff.hoursYear1 || 0);
    //         $scope.budgetResearchStaff.totalYear2 = ($scope.budgetResearchStaff.positionsYear2 || 0) * ($scope.budgetResearchStaff.costYear2 || 0) * ($scope.budgetResearchStaff.hoursYear2 || 0);
    //         $scope.budgetResearchStaff.totalYear3 = ($scope.budgetResearchStaff.positionsYear3 || 0) * ($scope.budgetResearchStaff.costYear3 || 0) * ($scope.budgetResearchStaff.hoursYear3 || 0);
    //         $scope.budgetResearchStaff.totalAmount = $scope.budgetResearchStaff.totalYear1 + $scope.budgetResearchStaff.totalYear2 + $scope.budgetResearchStaff.totalYear3;

    //         $scope.budgetConsumables.total = ($scope.budgetConsumables.year1 || 0) + ($scope.budgetConsumables.year2 || 0) + ($scope.budgetConsumables.year3 || 0);
    //         $scope.minorEquipment.total = ($scope.minorEquipment.year1 || 0) + ($scope.minorEquipment.year2 || 0) + ($scope.minorEquipment.year3 || 0);
    //         $scope.budgetContingency.total = ($scope.budgetContingency.year1 || 0) + ($scope.budgetContingency.year2 || 0) + ($scope.budgetContingency.year3 || 0);

    //         // Step 2: Calculate Research Stay + Travel totals
    //         // $scope.researchStayTravelTotal.year1 = ($scope.budgetResearchStay.costYear1 || 0) + ($scope.budgetTravel.costYear1 || 0);
    //         // $scope.researchStayTravelTotal.year2 = ($scope.budgetResearchStay.costYear2 || 0) + ($scope.budgetTravel.costYear2 || 0);
    //         // $scope.researchStayTravelTotal.year3 = ($scope.budgetResearchStay.costYear3 || 0) + ($scope.budgetTravel.costYear3 || 0);
    //         // $scope.researchStayTravelTotal.total = $scope.researchStayTravelTotal.year1 + $scope.researchStayTravelTotal.year2 + $scope.researchStayTravelTotal.year3;

    //         // Step 2: Calculate Research Stay + Travel totals
    //         $scope.researchStayTravelTotal.year1 =
    //             ($scope.budgetResearchStay.costYear1 || 0) +
    //             ($scope.budgetTravel.costYear1 || 0);

    //         $scope.researchStayTravelTotal.year2 =
    //             ($scope.budgetResearchStay.costYear2 || 0) +
    //             ($scope.budgetTravel.costYear2 || 0);

    //         $scope.researchStayTravelTotal.year3 =
    //             ($scope.budgetResearchStay.costYear3 || 0) +
    //             ($scope.budgetTravel.costYear3 || 0);

    //         $scope.researchStayTravelTotal.total =
    //             $scope.researchStayTravelTotal.year1 +
    //             $scope.researchStayTravelTotal.year2 +
    //             $scope.researchStayTravelTotal.year3;

    //         // Step 2.1: Total Research Heads = (Staff + Consumables + Minor Equipment + Contingency)
    //         $scope.totalResearchHeads.year1 =
    //             ($scope.budgetResearchStaff.totalYear1 || 0) +
    //             ($scope.budgetConsumables.year1 || 0) +
    //             ($scope.minorEquipment.year1 || 0) +
    //             ($scope.budgetContingency.year1 || 0);

    //         $scope.totalResearchHeads.year2 =
    //             ($scope.budgetResearchStaff.totalYear2 || 0) +
    //             ($scope.budgetConsumables.year2 || 0) +
    //             ($scope.minorEquipment.year2 || 0) +
    //             ($scope.budgetContingency.year2 || 0);

    //         $scope.totalResearchHeads.year3 =
    //             ($scope.budgetResearchStaff.totalYear3 || 0) +
    //             ($scope.budgetConsumables.year3 || 0) +
    //             ($scope.minorEquipment.year3 || 0) +
    //             ($scope.budgetContingency.year3 || 0);

    //         $scope.totalResearchHeads.total =
    //             $scope.totalResearchHeads.year1 +
    //             $scope.totalResearchHeads.year2 +
    //             $scope.totalResearchHeads.year3;


    //         // Step 3: Calculate Total Research Amount (before overhead)
    //         // $scope.totalResearchAmount.year1 = ($scope.researchStayTravelTotal.year1 || 0) + ($scope.budgetResearchStaff.totalYear1 || 0) + ($scope.budgetConsumables.year1 || 0) + ($scope.minorEquipment.year1 || 0) + ($scope.budgetContingency.year1 || 0);
    //         // $scope.totalResearchAmount.year2 = ($scope.researchStayTravelTotal.year2 || 0) + ($scope.budgetResearchStaff.totalYear2 || 0) + ($scope.budgetConsumables.year2 || 0) + ($scope.minorEquipment.year2 || 0) + ($scope.budgetContingency.year2 || 0);
    //         // $scope.totalResearchAmount.year3 = ($scope.researchStayTravelTotal.year3 || 0) + ($scope.budgetResearchStaff.totalYear3 || 0) + ($scope.budgetConsumables.year3 || 0) + ($scope.minorEquipment.year3 || 0) + ($scope.budgetContingency.year3 || 0);
    //         // $scope.totalResearchAmount.total = $scope.totalResearchAmount.year1 + $scope.totalResearchAmount.year2 + $scope.totalResearchAmount.year3;

    //         // Step 3: Calculate Total Research Amount (before overhead)
    //         $scope.totalResearchAmount.year1 =
    //             MAX_RESEARCH_AMOUNT - ($scope.researchStayTravelTotal.year1 || 0);

    //         $scope.totalResearchAmount.year2 =
    //             MAX_RESEARCH_AMOUNT - ($scope.researchStayTravelTotal.year2 || 0);

    //         $scope.totalResearchAmount.year3 =
    //             MAX_RESEARCH_AMOUNT - ($scope.researchStayTravelTotal.year3 || 0);

    //         $scope.totalResearchAmount.total =
    //             $scope.totalResearchAmount.year1 +
    //             $scope.totalResearchAmount.year2 +
    //             $scope.totalResearchAmount.year3;

    //         // Preserve original Total Research Amount for overhead calculation
    //         $scope.originalResearchAmount.year1 = $scope.totalResearchAmount.year1;
    //         $scope.originalResearchAmount.year2 = $scope.totalResearchAmount.year2;
    //         $scope.originalResearchAmount.year3 = $scope.totalResearchAmount.year3;
    //         $scope.originalResearchAmount.total = $scope.totalResearchAmount.total;


    //         // Step 4: Calculate Overhead amounts based on Total Research Amount
    //         var baseYear1 = $scope.totalResearchAmount.year1 || 0;
    //         var baseYear2 = $scope.totalResearchAmount.year2 || 0;
    //         var baseYear3 = $scope.totalResearchAmount.year3 || 0;

    //         // $scope.budgetOverhead.amountYear1 = Math.round((baseYear1 * ($scope.budgetOverhead.percentageYear1 || 0) / 100) * 100) / 100;
    //         // $scope.budgetOverhead.amountYear2 = Math.round((baseYear2 * ($scope.budgetOverhead.percentageYear2 || 0) / 100) * 100) / 100;
    //         // $scope.budgetOverhead.amountYear3 = Math.round((baseYear3 * ($scope.budgetOverhead.percentageYear3 || 0) / 100) * 100) / 100;
    //         // $scope.budgetOverhead.totalAmount = $scope.budgetOverhead.amountYear1 + $scope.budgetOverhead.amountYear2 + $scope.budgetOverhead.amountYear3;

    //         $scope.budgetOverhead.amountYear1 =
    //             Math.round(($scope.totalResearchAmount.year1 *
    //                 ($scope.budgetOverhead.percentageYear1 || 0))) / 100;

    //         $scope.budgetOverhead.amountYear2 =
    //             Math.round(($scope.totalResearchAmount.year2 *
    //                 ($scope.budgetOverhead.percentageYear2 || 0))) / 100;

    //         $scope.budgetOverhead.amountYear3 =
    //             Math.round(($scope.totalResearchAmount.year3 *
    //                 ($scope.budgetOverhead.percentageYear3 || 0))) / 100;

    //         $scope.budgetOverhead.totalAmount =
    //             $scope.budgetOverhead.amountYear1 +
    //             $scope.budgetOverhead.amountYear2 +
    //             $scope.budgetOverhead.amountYear3;


    //         // Step 5: Calculate Remaining Amount for Research Heads
    //         $scope.remainingForResearch.year1 = baseYear1 - $scope.budgetOverhead.amountYear1;
    //         $scope.remainingForResearch.year2 = baseYear2 - $scope.budgetOverhead.amountYear2;
    //         $scope.remainingForResearch.year3 = baseYear3 - $scope.budgetOverhead.amountYear3;
    //         $scope.remainingForResearch.total = $scope.remainingForResearch.year1 + $scope.remainingForResearch.year2 + $scope.remainingForResearch.year3;

    //         // Step 6: Calculate Grand Total (Total Research Amount + Overhead)
    //         // $scope.grandTotal.year1 = ($scope.totalResearchAmount.year1 || 0) + ($scope.budgetOverhead.amountYear1 || 0);
    //         // $scope.grandTotal.year2 = ($scope.totalResearchAmount.year2 || 0) + ($scope.budgetOverhead.amountYear2 || 0);
    //         // $scope.grandTotal.year3 = ($scope.totalResearchAmount.year3 || 0) + ($scope.budgetOverhead.amountYear3 || 0);
    //         // $scope.grandTotal.total = $scope.grandTotal.year1 + $scope.grandTotal.year2 + $scope.grandTotal.year3;

    //         // Step 6: Calculate Grand Total (Total Research Amount + Overhead)
    //         $scope.grandTotal.year1 =
    //             $scope.researchStayTravelTotal.year1 +
    //             $scope.budgetOverhead.amountYear1 +
    //             $scope.totalResearchHeads.year1;

    //         $scope.grandTotal.year2 =
    //             $scope.researchStayTravelTotal.year2 +
    //             $scope.budgetOverhead.amountYear2 +
    //             $scope.totalResearchHeads.year2;

    //         $scope.grandTotal.year3 =
    //             $scope.researchStayTravelTotal.year3 +
    //             $scope.budgetOverhead.amountYear3 +
    //             $scope.totalResearchHeads.year3;

    //         $scope.grandTotal.total =
    //             $scope.grandTotal.year1 +
    //             $scope.grandTotal.year2 +
    //             $scope.grandTotal.year3;


    //         // Step 7: Adjust Total Research Amount (Grand Total - Travel)
    //         $scope.totalResearchAmount.year1 =
    //             ($scope.grandTotal.year1 || 0) -
    //             ($scope.researchStayTravelTotal.year1 || 0);

    //         $scope.totalResearchAmount.year2 =
    //             ($scope.grandTotal.year2 || 0) -
    //             ($scope.researchStayTravelTotal.year2 || 0);

    //         $scope.totalResearchAmount.year3 =
    //             ($scope.grandTotal.year3 || 0) -
    //             ($scope.researchStayTravelTotal.year3 || 0);

    //         $scope.totalResearchAmount.total =
    //             $scope.totalResearchAmount.year1 +
    //             $scope.totalResearchAmount.year2 +
    //             $scope.totalResearchAmount.year3;

    //     } finally {
    //         $scope.isCalculating = false;
    //     }
    // };

    // Individual calculation methods - they only update their own values and call recalculateAll

    // ========== BUDGET TABLE CALCULATION METHOD ==========
    $scope.isCalculating = false;

    $scope.recalculateAll = function () {
        if ($scope.isCalculating) {
            return;
        }
        $scope.isCalculating = true;

        try {

            /* =====================================================
               1️⃣ RESEARCH STAY (Per diem calculation)
            ===================================================== */
            const PER_DAY_RATE = 2300 / 30;

            const d1 = Number($scope.budgetResearchStay.daysYear1) || 0;
            const d2 = Number($scope.budgetResearchStay.daysYear2) || 0;
            const d3 = Number($scope.budgetResearchStay.daysYear3) || 0;

            $scope.budgetResearchStay.totalDays = d1 + d2 + d3;

            $scope.budgetResearchStay.costYear1 = Math.round(d1 * PER_DAY_RATE * 100) / 100;
            $scope.budgetResearchStay.costYear2 = Math.round(d2 * PER_DAY_RATE * 100) / 100;
            $scope.budgetResearchStay.costYear3 = Math.round(d3 * PER_DAY_RATE * 100) / 100;

            $scope.budgetResearchStay.totalCost =
                $scope.budgetResearchStay.costYear1 +
                $scope.budgetResearchStay.costYear2 +
                $scope.budgetResearchStay.costYear3;

            /* =====================================================
               2️⃣ TRAVEL COST (AUTO)
               IF research stay exists → 1500
            ===================================================== */
            $scope.budgetTravel.costYear1 = $scope.budgetResearchStay.costYear1 > 0 ? 1500 : 0;
            $scope.budgetTravel.costYear2 = $scope.budgetResearchStay.costYear2 > 0 ? 1500 : 0;
            $scope.budgetTravel.costYear3 = $scope.budgetResearchStay.costYear3 > 0 ? 1500 : 0;

            $scope.budgetTravel.totalCost =
                $scope.budgetTravel.costYear1 +
                $scope.budgetTravel.costYear2 +
                $scope.budgetTravel.costYear3;

            /* =====================================================
               3️⃣ RESEARCH STAY + TRAVEL TOTAL
            ===================================================== */
            $scope.researchStayTravelTotal.year1 =
                $scope.budgetResearchStay.costYear1 +
                $scope.budgetTravel.costYear1;

            $scope.researchStayTravelTotal.year2 =
                $scope.budgetResearchStay.costYear2 +
                $scope.budgetTravel.costYear2;

            $scope.researchStayTravelTotal.year3 =
                $scope.budgetResearchStay.costYear3 +
                $scope.budgetTravel.costYear3;

            $scope.researchStayTravelTotal.total =
                $scope.researchStayTravelTotal.year1 +
                $scope.researchStayTravelTotal.year2 +
                $scope.researchStayTravelTotal.year3;

            /* =====================================================
               4️⃣ RESEARCH STAFF (Multiple records support)
            ===================================================== */
            // Reset aggregate totals
            /* =====================================================
               4️⃣ RESEARCH STAFF (MULTIPLICATION LOGIC – FINAL)
            ===================================================== */

            // Reset aggregate totals
            $scope.budgetResearchStaff.totalYear1 = 0;
            $scope.budgetResearchStaff.totalYear2 = 0;
            $scope.budgetResearchStaff.totalYear3 = 0;

            if ($scope.budgetResearchStaffList && $scope.budgetResearchStaffList.length > 0) {

                for (let i = 0; i < $scope.budgetResearchStaffList.length; i++) {
                    let staff = $scope.budgetResearchStaffList[i];

                    // ✅ CORRECT FORMULA: positions × cost × hours
                    staff.totalYear1 =
                        (Number(staff.positionsYear1) || 0) *
                        (Number(staff.costYear1) || 0) *
                        (Number(staff.hoursYear1) || 0);

                    // Only calculate Year 2 if duration is 24 or 36 months
                    if ($rootScope.proposalDurationMonths >= 24) {
                        staff.totalYear2 =
                            (Number(staff.positionsYear2) || 0) *
                            (Number(staff.costYear2) || 0) *
                            (Number(staff.hoursYear2) || 0);
                    } else {
                        staff.totalYear2 = 0;
                    }

                    // Only calculate Year 3 if duration is 36 months
                    if ($rootScope.proposalDurationMonths === 36) {
                        staff.totalYear3 =
                            (Number(staff.positionsYear3) || 0) *
                            (Number(staff.costYear3) || 0) *
                            (Number(staff.hoursYear3) || 0);
                    } else {
                        staff.totalYear3 = 0;
                    }

                    // Per staff total
                    staff.totalAmount =
                        staff.totalYear1 +
                        staff.totalYear2 +
                        staff.totalYear3;

                    // Aggregate totals (ALL staff)
                    $scope.budgetResearchStaff.totalYear1 += staff.totalYear1;
                    if ($rootScope.proposalDurationMonths >= 24) {
                        $scope.budgetResearchStaff.totalYear2 += staff.totalYear2;
                    }
                    if ($rootScope.proposalDurationMonths === 36) {
                        $scope.budgetResearchStaff.totalYear3 += staff.totalYear3;
                    }
                }
            }

            // Final total for all research staff
            $scope.budgetResearchStaff.totalAmount =
                $scope.budgetResearchStaff.totalYear1 +
                $scope.budgetResearchStaff.totalYear2 +
                $scope.budgetResearchStaff.totalYear3;


            /* =====================================================
               5️⃣ TOTAL RESEARCH AMOUNT (Remaining Balance)
               = 16000 − (Research Stay + Travel)
            ===================================================== */
            $scope.totalResearchAmount.year1 =
                Math.max(0, MAX_RESEARCH_AMOUNT - $scope.researchStayTravelTotal.year1);

            // Only calculate Year 2 if duration is 24 or 36 months
            if ($rootScope.proposalDurationMonths >= 24) {
                $scope.totalResearchAmount.year2 =
                    Math.max(0, MAX_RESEARCH_AMOUNT - $scope.researchStayTravelTotal.year2);
            } else {
                $scope.totalResearchAmount.year2 = 0;
            }

            // Only calculate Year 3 if duration is 36 months
            if ($rootScope.proposalDurationMonths === 36) {
                $scope.totalResearchAmount.year3 =
                    Math.max(0, MAX_RESEARCH_AMOUNT - $scope.researchStayTravelTotal.year3);
            } else {
                $scope.totalResearchAmount.year3 = 0;
            }

            $scope.totalResearchAmount.total =
                $scope.totalResearchAmount.year1 +
                $scope.totalResearchAmount.year2 +
                $scope.totalResearchAmount.year3;

            /* =====================================================
               6️⃣ OVERHEAD (Based on Total Research Amount)
            ===================================================== */
            $scope.budgetOverhead.amountYear1 =
                Math.round(
                    $scope.totalResearchAmount.year1 *
                    (Number($scope.budgetOverhead.percentageYear1) || 0)
                ) / 100;

            // Only calculate Year 2 if duration is 24 or 36 months
            if ($rootScope.proposalDurationMonths >= 24) {
                $scope.budgetOverhead.amountYear2 =
                    Math.round(
                        $scope.totalResearchAmount.year2 *
                        (Number($scope.budgetOverhead.percentageYear2) || 0)
                    ) / 100;
            } else {
                $scope.budgetOverhead.amountYear2 = 0;
            }

            // Only calculate Year 3 if duration is 36 months
            if ($rootScope.proposalDurationMonths === 36) {
                $scope.budgetOverhead.amountYear3 =
                    Math.round(
                        $scope.totalResearchAmount.year3 *
                        (Number($scope.budgetOverhead.percentageYear3) || 0)
                    ) / 100;
            } else {
                $scope.budgetOverhead.amountYear3 = 0;
            }

            $scope.budgetOverhead.totalAmount =
                $scope.budgetOverhead.amountYear1 +
                $scope.budgetOverhead.amountYear2 +
                $scope.budgetOverhead.amountYear3;

            /* =====================================================
               7️⃣ TOTAL RESEARCH HEADS
               (Overheads Amount + Staff + Consumables + Minor Equipment + Contingency)
            ===================================================== */
            $scope.totalResearchHeads.year1 =
                ($scope.budgetOverhead.amountYear1 || 0) +
                ($scope.budgetResearchStaff.totalYear1 || 0) +
                ($scope.budgetConsumables.year1 || 0) +
                ($scope.minorEquipment.year1 || 0) +
                ($scope.budgetContingency.year1 || 0);

            // Only calculate Year 2 if duration is 24 or 36 months
            if ($rootScope.proposalDurationMonths >= 24) {
                $scope.totalResearchHeads.year2 =
                    ($scope.budgetOverhead.amountYear2 || 0) +
                    ($scope.budgetResearchStaff.totalYear2 || 0) +
                    ($scope.budgetConsumables.year2 || 0) +
                    ($scope.minorEquipment.year2 || 0) +
                    ($scope.budgetContingency.year2 || 0);
            } else {
                $scope.totalResearchHeads.year2 = 0;
            }

            // Only calculate Year 3 if duration is 36 months
            if ($rootScope.proposalDurationMonths === 36) {
                $scope.totalResearchHeads.year3 =
                    ($scope.budgetOverhead.amountYear3 || 0) +
                    ($scope.budgetResearchStaff.totalYear3 || 0) +
                    ($scope.budgetConsumables.year3 || 0) +
                    ($scope.minorEquipment.year3 || 0) +
                    ($scope.budgetContingency.year3 || 0);
            } else {
                $scope.totalResearchHeads.year3 = 0;
            }

            $scope.totalResearchHeads.total =
                $scope.totalResearchHeads.year1 +
                $scope.totalResearchHeads.year2 +
                $scope.totalResearchHeads.year3;

            console.log('$scope.totalResearchHeads.year1 :', $scope.totalResearchHeads.year1);

            // =====================================================
            // Remaining Amount for Research Heads
            // = 16000 - (Research Stay + Travel) - Overheads
            // =====================================================
            $scope.remainingForResearch.year1 =
                Math.max(
                    0,
                    MAX_RESEARCH_AMOUNT -
                    ($scope.researchStayTravelTotal.year1 || 0) -
                    ($scope.budgetOverhead.amountYear1 || 0)
                );

            // Only calculate Year 2 if duration is 24 or 36 months
            if ($rootScope.proposalDurationMonths >= 24) {
                $scope.remainingForResearch.year2 =
                    Math.max(
                        0,
                        MAX_RESEARCH_AMOUNT -
                        ($scope.researchStayTravelTotal.year2 || 0) -
                        ($scope.budgetOverhead.amountYear2 || 0)
                    );
            } else {
                $scope.remainingForResearch.year2 = 0;
            }

            // Only calculate Year 3 if duration is 36 months
            if ($rootScope.proposalDurationMonths === 36) {
                $scope.remainingForResearch.year3 =
                    Math.max(
                        0,
                        MAX_RESEARCH_AMOUNT -
                        ($scope.researchStayTravelTotal.year3 || 0) -
                        ($scope.budgetOverhead.amountYear3 || 0)
                    );
            } else {
                $scope.remainingForResearch.year3 = 0;
            }

            $scope.remainingForResearch.total =
                $scope.remainingForResearch.year1 +
                $scope.remainingForResearch.year2 +
                $scope.remainingForResearch.year3;

            /* =====================================================
                CALCULATE TOTALS FOR OTHER HEADS
            ===================================================== */

            // Consumables
            $scope.budgetConsumables.total =
                (Number($scope.budgetConsumables.year1) || 0) +
                (Number($scope.budgetConsumables.year2) || 0) +
                ($rootScope.proposalDurationMonths === 36 ? (Number($scope.budgetConsumables.year3) || 0) : 0);

            // Minor Equipment
            $scope.minorEquipment.total =
                (Number($scope.minorEquipment.year1) || 0) +
                (Number($scope.minorEquipment.year2) || 0) +
                ($rootScope.proposalDurationMonths === 36 ? (Number($scope.minorEquipment.year3) || 0) : 0);

            // Contingency & Miscellaneous
            $scope.budgetContingency.total =
                (Number($scope.budgetContingency.year1) || 0) +
                (Number($scope.budgetContingency.year2) || 0) +
                ($rootScope.proposalDurationMonths === 36 ? (Number($scope.budgetContingency.year3) || 0) : 0);


            /* =====================================================
               8️⃣ GRAND TOTAL (FINAL)
            ===================================================== */
            $scope.grandTotal.year1 =
                $scope.researchStayTravelTotal.year1 +
                $scope.totalResearchHeads.year1;

            // Only calculate Year 2 if duration is 24 or 36 months
            if ($rootScope.proposalDurationMonths >= 24) {
                $scope.grandTotal.year2 =
                    $scope.researchStayTravelTotal.year2 +
                    $scope.totalResearchHeads.year2;
            } else {
                $scope.grandTotal.year2 = 0;
            }

            // Only calculate Year 3 if duration is 36 months
            if ($rootScope.proposalDurationMonths === 36) {
                $scope.grandTotal.year3 =
                    $scope.researchStayTravelTotal.year3 +
                    $scope.totalResearchHeads.year3;
            } else {
                $scope.grandTotal.year3 = 0;
            }

            $scope.grandTotal.total =
                $scope.grandTotal.year1 +
                $scope.grandTotal.year2 +
                $scope.grandTotal.year3;

            console.log('$scope.grandTotal.year1', $scope.grandTotal.year1);

            /* =====================================================
                9️⃣ VALIDATION: Grand Total must not exceed 16000
            ===================================================== */

            $scope.grandTotalError = {
                year1: false,
                year2: false,
                year3: false,
                any: false
            };
            debugger;

            $scope.grandTotalError.year1 = $scope.grandTotal.year1 > MAX_RESEARCH_AMOUNT;

            // Only validate Year 2 if duration is 24 or 36 months
            if ($rootScope.proposalDurationMonths >= 24) {
                $scope.grandTotalError.year2 = $scope.grandTotal.year2 > MAX_RESEARCH_AMOUNT;
            } else {
                $scope.grandTotalError.year2 = false;
            }

            // Only validate Year 3 if duration is 36 months
            if ($rootScope.proposalDurationMonths === 36) {
                $scope.grandTotalError.year3 = $scope.grandTotal.year3 > MAX_RESEARCH_AMOUNT;
            } else {
                $scope.grandTotalError.year3 = false;
            }

            $scope.grandTotalError.any =
                $scope.grandTotalError.year1 ||
                $scope.grandTotalError.year2 ||
                $scope.grandTotalError.year3;

            /* =====================================================
            🔟 VALIDATION: Contingency Max 15% of Remaining Research
            ===================================================== */

            // Reset contingency errors
            $scope.contingencyError = {
                year1: false,
                year2: false,
                year3: false,
                any: false
            };

            // Calculate max allowed contingency (15%)
            $scope.maxContingency = {
                year1: Math.round(($scope.remainingForResearch.year1 || 0) * 0.15 * 100) / 100,
                year2: $rootScope.proposalDurationMonths >= 24 ? Math.round(($scope.remainingForResearch.year2 || 0) * 0.15 * 100) / 100 : 0,
                year3: $rootScope.proposalDurationMonths === 36 ? Math.round(($scope.remainingForResearch.year3 || 0) * 0.15 * 100) / 100 : 0
            };

            // Validate entered contingency
            $scope.contingencyError.year1 =
                ($scope.budgetContingency.year1 || 0) > $scope.maxContingency.year1;

            // Only validate Year 2 if duration is 24 or 36 months
            if ($rootScope.proposalDurationMonths >= 24) {
                $scope.contingencyError.year2 =
                    ($scope.budgetContingency.year2 || 0) > $scope.maxContingency.year2;
            } else {
                $scope.contingencyError.year2 = false;
            }

            // Only validate Year 3 if duration is 36 months
            if ($rootScope.proposalDurationMonths === 36) {
                $scope.contingencyError.year3 =
                    ($scope.budgetContingency.year3 || 0) > $scope.maxContingency.year3;
            } else {
                $scope.contingencyError.year3 = false;
            }

            $scope.contingencyError.any =
                $scope.contingencyError.year1 ||
                $scope.contingencyError.year2 ||
                $scope.contingencyError.year3;

            /* =====================================================
            🔟 VALIDATION: Research Stay (Per Year + Total)
            ===================================================== */

            // Always reset first (important)
            $scope.researchStayError = {
                year1: false,
                year2: false,
                year3: false,
                total: false,
                durationInvalid: false,
                any: false
            };

            const MIN_DAYS_PER_YEAR = 10;

            // ---------- Decide rules by duration ----------
            let MAX_DAYS_PER_YEAR = 0;
            let TOTAL_MIN = 0;
            let TOTAL_MAX = 0;

            if ($rootScope.proposalDurationMonths === 24) {
                MAX_DAYS_PER_YEAR = 50;
                TOTAL_MIN = 20;
                TOTAL_MAX = 60;
            } else if ($rootScope.proposalDurationMonths === 36) {
                MAX_DAYS_PER_YEAR = 80;
                TOTAL_MIN = 30;
                TOTAL_MAX = 90;
            } else {
                $scope.researchStayError.durationInvalid = true;
            }

            // ---------- Per-year validation ----------
            function isInvalidYear(days) {
                if (!days || days === 0) return false; // zero allowed
                return days < MIN_DAYS_PER_YEAR || days > MAX_DAYS_PER_YEAR;
            }

            $scope.researchStayError.year1 = isInvalidYear($scope.budgetResearchStay.daysYear1);

            // Only validate Year 2 if duration is 24 or 36 months
            if ($rootScope.proposalDurationMonths >= 24) {
                $scope.researchStayError.year2 = isInvalidYear($scope.budgetResearchStay.daysYear2);
            } else {
                $scope.researchStayError.year2 = false;
            }

            // Only validate Year 3 if duration is 36 months
            if ($rootScope.proposalDurationMonths === 36) {
                $scope.researchStayError.year3 = isInvalidYear($scope.budgetResearchStay.daysYear3);
            } else {
                $scope.researchStayError.year3 = false;
            }

            // ---------- Total validation ----------
            const totalDays = $scope.budgetResearchStay.totalDays || 0;

            $scope.researchStayError.total =
                totalDays > 0 &&
                (totalDays < TOTAL_MIN || totalDays > TOTAL_MAX);

            // ---------- Aggregate flag ----------
            $scope.researchStayError.any =
                $scope.researchStayError.year1 ||
                $scope.researchStayError.year2 ||
                $scope.researchStayError.year3 ||
                $scope.researchStayError.total ||
                $scope.researchStayError.durationInvalid;


        } finally {
            $scope.isCalculating = false;
        }
    };

    // Initialize year visibility on page load if duration is already available
    if ($rootScope.proposalDurationMonths) {
        $scope.setYearVisibilityBasedOnDuration();
    }

    $scope.recalculateAll();

    $scope.calculateResearchStay = function () {
        $scope.recalculateAll();
    };

    $scope.calculateTravel = function () {
        $scope.recalculateAll();
    };

    $scope.calculateResearchStaff = function () {
        $scope.recalculateAll();
    };

    $scope.calculateTotals = function () {
        $scope.recalculateAll();
    };

    // Cached array for Research Staff rows (to avoid infinite digest loop)
    $scope.researchStaffRows = [];

    // Helper function to update flattened rows for Research Staff
    $scope.updateResearchStaffRows = function () {
        $scope.researchStaffRows = [];
        if ($scope.budgetResearchStaffList && $scope.budgetResearchStaffList.length > 0) {
            for (var i = 0; i < $scope.budgetResearchStaffList.length; i++) {
                var staff = $scope.budgetResearchStaffList[i];
                $scope.researchStaffRows.push({ staff: staff, index: i, rowType: 'positions' });
                $scope.researchStaffRows.push({ staff: staff, index: i, rowType: 'cost' });
                $scope.researchStaffRows.push({ staff: staff, index: i, rowType: 'hours' });
                $scope.researchStaffRows.push({ staff: staff, index: i, rowType: 'total' });
            }
        }
    };

    // Initialize rows
    $scope.updateResearchStaffRows();

    // Add new Research Staff record
    $scope.addResearchStaff = function () {
        // Find the highest Research Staff number from existing records
        let maxIndex = 0;
        if ($scope.budgetResearchStaffList && $scope.budgetResearchStaffList.length > 0) {
            for (let i = 0; i < $scope.budgetResearchStaffList.length; i++) {
                let staff = $scope.budgetResearchStaffList[i];
                if (staff.researchStaffType) {
                    let match = staff.researchStaffType.match(/Research staff (\d+)/);
                    if (match) {
                        let index = parseInt(match[1]);
                        if (index > maxIndex) {
                            maxIndex = index;
                        }
                    }
                }
            }
        }
        let nextIndex = maxIndex + 1;

        $scope.budgetResearchStaffList.push({
            positionsYear1: 0,
            positionsYear2: 0,
            positionsYear3: 0,
            costYear1: 0,
            costYear2: 0,
            costYear3: 0,
            hoursYear1: 0,
            hoursYear2: 0,
            hoursYear3: 0,
            totalYear1: 0,
            totalYear2: 0,
            totalYear3: 0,
            totalAmount: 0,
            researchStaffType: 'Research staff ' + nextIndex, // Track the backend type name
            expenseHeadIds: [] // Store Expense_Head__c IDs for deletion (empty for new records)
        });
        $scope.updateResearchStaffRows();
        $scope.recalculateAll();
    };

    // Remove Research Staff record
    $scope.removeResearchStaff = function (index) {
        if ($scope.budgetResearchStaffList.length > 1) {
            let staff = $scope.budgetResearchStaffList[index];
            // Get the Research Staff type from the staff object, or generate it if not set
            let researchStaffType = staff.researchStaffType || ('Research staff ' + (index + 1));

            // Confirm deletion using SweetAlert v2 promise syntax
            swal({
                title: "Are you sure?",
                text: "Do you want to delete " + researchStaffType + "?",
                icon: "warning",
                buttons: true,
                dangerMode: true
            }).then(function (isConfirm) {
                if (isConfirm) {
                    // Delete from backend using Expense_Head__c IDs
                    if (staff.expenseHeadIds && staff.expenseHeadIds.length > 0) {
                        ApplicantPortal_Contoller.deleteResearchStaffByIds(
                            staff.expenseHeadIds,
                            function (result, event) {
                                if (event.status && result != null) {
                                    if (result.startsWith && result.startsWith('error')) {
                                        swal("Error", "Error deleting Research Staff: " + result, "error");
                                        return;
                                    }

                                    // Remove from frontend list
                                    $scope.budgetResearchStaffList.splice(index, 1);
                                    $scope.updateResearchStaffRows();
                                    $scope.recalculateAll();

                                    swal("Deleted!", researchStaffType + " has been deleted.", "success");
                                    $scope.$apply();
                                } else {
                                    swal("Error", "Error deleting Research Staff", "error");
                                }
                            },
                            { escape: true }
                        );
                    } else {
                        // If no expenseHeadIds, just remove from frontend (for new records not yet saved)
                        $scope.budgetResearchStaffList.splice(index, 1);
                        $scope.updateResearchStaffRows();
                        $scope.recalculateAll();
                        swal("Deleted!", researchStaffType + " has been removed.", "success");
                        $scope.$apply();
                    }
                }
            });
        }
    };

    // ========== FETCH AND SAVE METHODS (Similar to ExpenseDeclaration.js) ==========
    // Get expense records from Apex using ApplicantPortal_Contoller
    $scope.getExpenseRecordsFromApex = function () {
        debugger;
        if (!$rootScope.proposalId || !$rootScope.contactId) {
            console.log('ProposalId or ContactId not available for expense records');
            return;
        }
        ApplicantPortal_Contoller.getExpenseRecords($rootScope.proposalId, $rootScope.contactId, function (result, event) {
            debugger;
            console.log("expense records result");
            console.log(result);
            if (event.status && result != null) {
                debugger;
                $scope.accList = result?.conList[0]?.Account;
                $scope.applicantProposalAsscocition = result.apa[0];
                $rootScope.apaId = $scope.applicantProposalAsscocition.Id;

                if ($rootScope.apaId) {
                    $scope.getExpenseHeadLineItemsFromApex();
                }

                $scope.$apply();
            }
        },
            { escape: true }
        )
    };

    // Get expense head line items and populate budget table
    $scope.getExpenseHeadLineItemsFromApex = function () {
        if (!$rootScope.apaId) {
            console.log('APA Id not available yet');
            return;
        }

        ApplicantPortal_Contoller.getExpenseHeadLineItems($rootScope.apaId, function (result, event) {
            console.log('getExpenseHeadLineItems result:', result);
            if (event.status && result != null && result.lineItems != null) {
                // Build maps of Expense_Head__c IDs by expense type and year from expenseHeads
                // Map: "Research staff 1" -> {year1: "id1", year2: "id2", year3: "id3"}
                let researchStaffHeadIdsMap = {};
                // Map: "Research stay" -> {year1: "id1", year2: "id2", year3: "id3"}
                let expenseHeadIdsMap = {
                    'Research stay': { year1: null, year2: null, year3: null },
                    'Travel': { year1: null, year2: null, year3: null },
                    'Consumables': { year1: null, year2: null, year3: null },
                    'Minor equipment': { year1: null, year2: null, year3: null },
                    'Contingency': { year1: null, year2: null, year3: null },
                    'Overhead': { year1: null, year2: null, year3: null }
                };

                if (result.expenseHeads && result.expenseHeads.length > 0) {
                    for (let j = 0; j < result.expenseHeads.length; j++) {
                        let head = result.expenseHeads[j];
                        let year = head.Yearly_Expense__r && head.Yearly_Expense__r.Year__c ? head.Yearly_Expense__r.Year__c : null;

                        if (head.Name && head.Name.startsWith('Research staff')) {
                            if (!researchStaffHeadIdsMap[head.Name]) {
                                researchStaffHeadIdsMap[head.Name] = { year1: null, year2: null, year3: null };
                            }
                            // Map by year
                            if (year === '1') {
                                researchStaffHeadIdsMap[head.Name].year1 = head.Id;
                            } else if (year === '2') {
                                researchStaffHeadIdsMap[head.Name].year2 = head.Id;
                            } else if (year === '3') {
                                researchStaffHeadIdsMap[head.Name].year3 = head.Id;
                            }
                        } else if (head.Name && expenseHeadIdsMap[head.Name]) {
                            // Map other expense types by year
                            if (year === '1') {
                                expenseHeadIdsMap[head.Name].year1 = head.Id;
                            } else if (year === '2') {
                                expenseHeadIdsMap[head.Name].year2 = head.Id;
                            } else if (year === '3') {
                                expenseHeadIdsMap[head.Name].year3 = head.Id;
                            }
                        }
                    }
                }

                // Store Expense_Head__c IDs in scope for saving
                $scope.expenseHeadIds = expenseHeadIdsMap;

                // Process line items and populate budget table variables
                for (let i = 0; i < result.lineItems.length; i++) {
                    let item = result.lineItems[i];
                    let expenseType = item.Expense_Type__c || '';

                    // Decode special characters
                    if (item.Description__c) {
                        item.Description__c = item.Description__c
                            .replace(/&amp;/g, '&')
                            .replace(/&#39;/g, '\'')
                            .replaceAll('&amp;amp;', '&')
                            .replaceAll('&lt;', '<')
                            .replaceAll('&gt;', '>')
                            .replaceAll('&quot;', '\'');
                    }

                    // Get the year from Expense_Head__c relationship to determine which year's data this is
                    let itemYear = null;
                    if (item.Expense_Head__r && item.Expense_Head__r.Yearly_Expense__r && item.Expense_Head__r.Yearly_Expense__r.Year__c) {
                        itemYear = item.Expense_Head__r.Yearly_Expense__r.Year__c;
                    } else if (item.Expense_Head__c && expenseHeadIdsMap[expenseType]) {
                        // Try to determine year from Expense_Head__c ID
                        let headIds = expenseHeadIdsMap[expenseType];
                        if (headIds.year1 === item.Expense_Head__c) {
                            itemYear = '1';
                        } else if (headIds.year2 === item.Expense_Head__c) {
                            itemYear = '2';
                        } else if (headIds.year3 === item.Expense_Head__c) {
                            itemYear = '3';
                        }
                    }

                    // If year cannot be determined from head, try to determine from which expense field has value
                    if (!itemYear) {
                        if (item.Year1_Expense__c != null && item.Year1_Expense__c != 0 && (item.Year2_Expense__c == null || item.Year2_Expense__c == 0) && (item.Year3_Expense__c == null || item.Year3_Expense__c == 0)) {
                            itemYear = '1';
                        } else if (item.Year2_Expense__c != null && item.Year2_Expense__c != 0 && (item.Year1_Expense__c == null || item.Year1_Expense__c == 0) && (item.Year3_Expense__c == null || item.Year3_Expense__c == 0)) {
                            itemYear = '2';
                        } else if (item.Year3_Expense__c != null && item.Year3_Expense__c != 0 && (item.Year1_Expense__c == null || item.Year1_Expense__c == 0) && (item.Year2_Expense__c == null || item.Year2_Expense__c == 0)) {
                            itemYear = '3';
                        }
                    }

                    // Map expense types to budget table fields - extract year-specific values
                    if (expenseType === 'Research stay' || expenseType === 'Research Stay') {
                        // Assuming first item is days, second is cost
                        if (item.Description__c && item.Description__c.toLowerCase().includes('day')) {
                            if (itemYear === '1' || (!itemYear && item.Year1_Expense__c != null)) {
                                $scope.budgetResearchStay.daysYear1 = item.Year1_Expense__c || 0;
                            } else if (itemYear === '2' || (!itemYear && item.Year2_Expense__c != null)) {
                                $scope.budgetResearchStay.daysYear2 = item.Year2_Expense__c || 0;
                            } else if (itemYear === '3' || (!itemYear && item.Year3_Expense__c != null)) {
                                $scope.budgetResearchStay.daysYear3 = item.Year3_Expense__c || 0;
                            }
                        } else {
                            if (itemYear === '1' || (!itemYear && item.Year1_Expense__c != null)) {
                                $scope.budgetResearchStay.costYear1 = item.Year1_Expense__c || 0;
                            } else if (itemYear === '2' || (!itemYear && item.Year2_Expense__c != null)) {
                                $scope.budgetResearchStay.costYear2 = item.Year2_Expense__c || 0;
                            } else if (itemYear === '3' || (!itemYear && item.Year3_Expense__c != null)) {
                                $scope.budgetResearchStay.costYear3 = item.Year3_Expense__c || 0;
                            }
                        }
                    } else if (expenseType === 'Travel' || expenseType === 'Travel & Networking') {
                        if (itemYear === '1' || (!itemYear && item.Year1_Expense__c != null)) {
                            $scope.budgetTravel.costYear1 = item.Year1_Expense__c || 0;
                        } else if (itemYear === '2' || (!itemYear && item.Year2_Expense__c != null)) {
                            $scope.budgetTravel.costYear2 = item.Year2_Expense__c || 0;
                        } else if (itemYear === '3' || (!itemYear && item.Year3_Expense__c != null)) {
                            $scope.budgetTravel.costYear3 = item.Year3_Expense__c || 0;
                        }
                    } else if (expenseType && expenseType.startsWith('Research staff')) {
                        // Initialize list if empty - only create records for actual backend data
                        if (!$scope.budgetResearchStaffList || $scope.budgetResearchStaffList.length === 0) {
                            $scope.budgetResearchStaffList = [];
                        }

                        // Extract Research Staff number from expense type (e.g., "Research staff 1" -> 1)
                        let staffNumberMatch = expenseType.match(/Research staff (\d+)/);
                        let staffIndex = staffNumberMatch ? parseInt(staffNumberMatch[1]) - 1 : $scope.budgetResearchStaffList.length;

                        // Ensure we have enough staff records - only create records that exist in backend
                        while ($scope.budgetResearchStaffList.length <= staffIndex) {
                            let newIndex = $scope.budgetResearchStaffList.length + 1;
                            $scope.budgetResearchStaffList.push({
                                positionsYear1: 0, positionsYear2: 0, positionsYear3: 0,
                                costYear1: 0, costYear2: 0, costYear3: 0,
                                hoursYear1: 0, hoursYear2: 0, hoursYear3: 0,
                                totalYear1: 0, totalYear2: 0, totalYear3: 0, totalAmount: 0,
                                researchStaffType: 'Research staff ' + newIndex, // Track the backend type name
                                expenseHeadIds: [] // Store Expense_Head__c IDs for deletion
                            });
                        }

                        let staff = $scope.budgetResearchStaffList[staffIndex];
                        // Store the original Research Staff type name from backend
                        if (!staff.researchStaffType) {
                            staff.researchStaffType = expenseType;
                        }

                        // Store Expense_Head__c IDs for this Research Staff in correct order: [Year1, Year2, Year3]
                        // Keep null values to maintain array indices
                        if (researchStaffHeadIdsMap[expenseType]) {
                            let headIdsByYear = researchStaffHeadIdsMap[expenseType];
                            staff.expenseHeadIds = [
                                headIdsByYear.year1 || null,
                                headIdsByYear.year2 || null,
                                headIdsByYear.year3 || null
                            ];
                        } else {
                            // Initialize empty array if no IDs found
                            staff.expenseHeadIds = [];
                        }

                        // Map line items based on Index__c and Description
                        // Index 1 = No. of Positions, Index 2 = Cost, Index 3 = Hours
                        if (item.Index__c === 1 || (item.Description__c && (item.Description__c.includes('No. of Positions') || item.Description__c.includes('Positions')))) {
                            // No. of Positions
                            staff.positionsYear1 = item.Year1_Expense__c || item.Number__c || 0;
                            if ($rootScope.proposalDurationMonths >= 24) {
                                staff.positionsYear2 = item.Year2_Expense__c || item.Number__c || 0;
                            }
                            if ($rootScope.proposalDurationMonths === 36) {
                                staff.positionsYear3 = item.Year3_Expense__c || item.Number__c || 0;
                            }
                        } else if (item.Index__c === 2 || (item.Description__c && item.Description__c.includes('Cost') && !item.Description__c.includes('hour'))) {
                            // Cost
                            staff.costYear1 = item.Year1_Expense__c || item.Salary_Month__c || 0;
                            if ($rootScope.proposalDurationMonths >= 24) {
                                staff.costYear2 = item.Year2_Expense__c || item.Salary_Month__c || 0;
                            }
                            if ($rootScope.proposalDurationMonths === 36) {
                                staff.costYear3 = item.Year3_Expense__c || item.Salary_Month__c || 0;
                            }
                        } else if (item.Index__c === 3 || (item.Description__c && (item.Description__c.includes('hour') || item.Description__c.includes('Hours')))) {
                            // Number of hours/week/days/month
                            staff.hoursYear1 = item.Year1_Expense__c || item.Person_Month__c || 0;
                            if ($rootScope.proposalDurationMonths >= 24) {
                                staff.hoursYear2 = item.Year2_Expense__c || item.Person_Month__c || 0;
                            }
                            if ($rootScope.proposalDurationMonths === 36) {
                                staff.hoursYear3 = item.Year3_Expense__c || item.Person_Month__c || 0;
                            }
                        }
                    } else if (expenseType === 'Consumables' || expenseType === 'Consumables/Materials') {
                        if (itemYear === '1' || (!itemYear && item.Year1_Expense__c != null)) {
                            $scope.budgetConsumables.year1 = item.Year1_Expense__c || 0;
                        } else if (itemYear === '2' || (!itemYear && item.Year2_Expense__c != null)) {
                            $scope.budgetConsumables.year2 = item.Year2_Expense__c || 0;
                        } else if (itemYear === '3' || (!itemYear && item.Year3_Expense__c != null)) {
                            $scope.budgetConsumables.year3 = item.Year3_Expense__c || 0;
                        }
                    } else if (expenseType === 'Equipment' || expenseType === 'Equipment & Accessories' || expenseType === 'Minor equipment') {
                        if (itemYear === '1' || (!itemYear && item.Year1_Expense__c != null)) {
                            $scope.minorEquipment.year1 = item.Year1_Expense__c || 0;
                        } else if (itemYear === '2' || (!itemYear && item.Year2_Expense__c != null)) {
                            $scope.minorEquipment.year2 = item.Year2_Expense__c || 0;
                        } else if (itemYear === '3' || (!itemYear && item.Year3_Expense__c != null)) {
                            $scope.minorEquipment.year3 = item.Year3_Expense__c || 0;
                        }
                    } else if (expenseType === 'Contingency') {
                        if (itemYear === '1' || (!itemYear && item.Year1_Expense__c != null)) {
                            $scope.budgetContingency.year1 = item.Year1_Expense__c || 0;
                        } else if (itemYear === '2' || (!itemYear && item.Year2_Expense__c != null)) {
                            $scope.budgetContingency.year2 = item.Year2_Expense__c || 0;
                        } else if (itemYear === '3' || (!itemYear && item.Year3_Expense__c != null)) {
                            $scope.budgetContingency.year3 = item.Year3_Expense__c || 0;
                        }
                    } else if (expenseType === 'Overhead' || expenseType === 'Projektpauschale') {
                        // Overhead percentage might be stored differently
                        if (itemYear === '1' || (!itemYear && item.Year1_Expense__c != null)) {
                            $scope.budgetOverhead.percentageYear1 = item.Year1_Expense__c || 0;
                        } else if (itemYear === '2' || (!itemYear && item.Year2_Expense__c != null)) {
                            $scope.budgetOverhead.percentageYear2 = item.Year2_Expense__c || 0;
                        } else if (itemYear === '3' || (!itemYear && item.Year3_Expense__c != null)) {
                            $scope.budgetOverhead.percentageYear3 = item.Year3_Expense__c || 0;
                        }
                    }
                }

                // Check if any Research Staff records were loaded from backend
                // Only show default record if NO Research Staff records exist in backend
                let hasResearchStaffRecords = false;
                if ($scope.budgetResearchStaffList && $scope.budgetResearchStaffList.length > 0) {
                    // Check if any Research Staff has expenseHeadIds (meaning it was saved in backend)
                    for (let k = 0; k < $scope.budgetResearchStaffList.length; k++) {
                        if ($scope.budgetResearchStaffList[k].expenseHeadIds &&
                            $scope.budgetResearchStaffList[k].expenseHeadIds.length > 0) {
                            hasResearchStaffRecords = true;
                            break;
                        }
                    }
                }

                // If no Research Staff records found in backend, show only one default record
                // If records exist, only show those records (don't add default empty records)
                if (!hasResearchStaffRecords) {
                    // No records in backend - show one default record
                    $scope.budgetResearchStaffList = [{
                        positionsYear1: 0, positionsYear2: 0, positionsYear3: 0,
                        costYear1: 0, costYear2: 0, costYear3: 0,
                        hoursYear1: 0, hoursYear2: 0, hoursYear3: 0,
                        totalYear1: 0, totalYear2: 0, totalYear3: 0, totalAmount: 0,
                        researchStaffType: 'Research staff 1',
                        expenseHeadIds: []
                    }];
                } else {
                    // Records exist in backend - remove any records without expenseHeadIds (empty/default records)
                    $scope.budgetResearchStaffList = $scope.budgetResearchStaffList.filter(function (staff) {
                        return staff.expenseHeadIds && staff.expenseHeadIds.length > 0;
                    });
                }

                // Update research staff rows after loading data
                $scope.updateResearchStaffRows();

                // Set year visibility based on duration before recalculating
                if ($rootScope.proposalDurationMonths) {
                    $scope.setYearVisibilityBasedOnDuration();
                }

                // Recalculate all totals after populating data
                $scope.recalculateAll();

                $scope.$apply();
            } else {
                // If API call succeeded but no data returned, ensure one default Research Staff record
                if (!$scope.budgetResearchStaffList || $scope.budgetResearchStaffList.length === 0) {
                    $scope.budgetResearchStaffList = [{
                        positionsYear1: 0, positionsYear2: 0, positionsYear3: 0,
                        costYear1: 0, costYear2: 0, costYear3: 0,
                        hoursYear1: 0, hoursYear2: 0, hoursYear3: 0,
                        totalYear1: 0, totalYear2: 0, totalYear3: 0, totalAmount: 0,
                        researchStaffType: 'Research staff 1',
                        expenseHeadIds: []
                    }];
                    $scope.updateResearchStaffRows();
                }
            }
        }, { escape: true });
    };

    // Save expense details using ApplicantPortal_Contoller
    $scope.saveBudgetTableData = function () {
        debugger;

        // 🔁 Ensure latest calculations & validations
        $scope.recalculateAll();

        /* ============================================
            BLOCK SAVE IF ANY VALIDATION FAILS
        ============================================ */

        // if (
        //     ($scope.grandTotalError && $scope.grandTotalError.any) ||
        //     ($scope.contingencyError && $scope.contingencyError.any) ||
        //     ($scope.researchStayError && $scope.researchStayError.any)
        // ) {
        //     swal({
        //         title: "Validation Error",
        //         text: "Please fix all validation errors before saving.",
        //         icon: "warning",
        //         button: "OK"
        //     });
        //     return;
        // }

        if ($scope.researchStayError && $scope.researchStayError.any) {
            swal("Research Stay Error", "Please correct Research Stay duration errors.", "warning");
            return;
        }

        if ($scope.contingencyError && $scope.contingencyError.any) {
            swal("Contingency Error", "Contingency exceeds allowed 15% limit.", "warning");
            return;
        }

        if ($scope.grandTotalError && $scope.grandTotalError.any) {
            swal("Grand Total Error", "Yearly budget cannot exceed €16000.", "warning");
            return;
        }


        // Prepare line items for saving
        var allExpenseLineItems = [];

        // Initialize expenseHeadIds if not already set
        if (!$scope.expenseHeadIds) {
            $scope.expenseHeadIds = {
                'Research stay': { year1: null, year2: null, year3: null },
                'Travel': { year1: null, year2: null, year3: null },
                'Consumables': { year1: null, year2: null, year3: null },
                'Minor equipment': { year1: null, year2: null, year3: null },
                'Contingency': { year1: null, year2: null, year3: null },
                'Overhead': { year1: null, year2: null, year3: null }
            };
        }

        // Research Stay - days - Create separate line items for each year
        // Year 1
        let researchStayDaysYear1Item = {
            Index__c: 1,
            Description__c: 'Research Stay - No. of days',
            Year1_Expense__c: $scope.budgetResearchStay.daysYear1 || 0,
            Year2_Expense__c: 0,
            Year3_Expense__c: 0,
            Total_Expense__c: $scope.budgetResearchStay.daysYear1 || 0,
            Expense_Type__c: 'Research stay'
        };
        if ($scope.expenseHeadIds['Research stay'] && $scope.expenseHeadIds['Research stay'].year1) {
            researchStayDaysYear1Item.Expense_Head__c = $scope.expenseHeadIds['Research stay'].year1;
        }
        allExpenseLineItems.push(researchStayDaysYear1Item);

        // Year 2 - only if duration is 24 or 36 months
        if ($rootScope.proposalDurationMonths >= 24) {
            let researchStayDaysYear2Item = {
                Index__c: 1,
                Description__c: 'Research Stay - No. of days',
                Year1_Expense__c: 0,
                Year2_Expense__c: $scope.budgetResearchStay.daysYear2 || 0,
                Year3_Expense__c: 0,
                Total_Expense__c: $scope.budgetResearchStay.daysYear2 || 0,
                Expense_Type__c: 'Research stay'
            };
            if ($scope.expenseHeadIds['Research stay'] && $scope.expenseHeadIds['Research stay'].year2) {
                researchStayDaysYear2Item.Expense_Head__c = $scope.expenseHeadIds['Research stay'].year2;
            }
            allExpenseLineItems.push(researchStayDaysYear2Item);
        }

        // Year 3 - only if duration is 36 months
        if ($rootScope.proposalDurationMonths === 36) {
            let researchStayDaysYear3Item = {
                Index__c: 1,
                Description__c: 'Research Stay - No. of days',
                Year1_Expense__c: 0,
                Year2_Expense__c: 0,
                Year3_Expense__c: $scope.budgetResearchStay.daysYear3 || 0,
                Total_Expense__c: $scope.budgetResearchStay.daysYear3 || 0,
                Expense_Type__c: 'Research stay'
            };
            if ($scope.expenseHeadIds['Research stay'] && $scope.expenseHeadIds['Research stay'].year3) {
                researchStayDaysYear3Item.Expense_Head__c = $scope.expenseHeadIds['Research stay'].year3;
            }
            allExpenseLineItems.push(researchStayDaysYear3Item);
        }

        // Research Stay - cost - Create separate line items for each year
        // Year 1
        let researchStayCostYear1Item = {
            Index__c: 2,
            Description__c: 'Research Stay Per diem cost',
            Year1_Expense__c: $scope.budgetResearchStay.costYear1 || 0,
            Year2_Expense__c: 0,
            Year3_Expense__c: 0,
            Total_Expense__c: $scope.budgetResearchStay.costYear1 || 0,
            Expense_Type__c: 'Research stay'
        };
        if ($scope.expenseHeadIds['Research stay'] && $scope.expenseHeadIds['Research stay'].year1) {
            researchStayCostYear1Item.Expense_Head__c = $scope.expenseHeadIds['Research stay'].year1;
        }
        allExpenseLineItems.push(researchStayCostYear1Item);

        // Year 2 - only if duration is 24 or 36 months
        if ($rootScope.proposalDurationMonths >= 24) {
            let researchStayCostYear2Item = {
                Index__c: 2,
                Description__c: 'Research Stay Per diem cost',
                Year1_Expense__c: 0,
                Year2_Expense__c: $scope.budgetResearchStay.costYear2 || 0,
                Year3_Expense__c: 0,
                Total_Expense__c: $scope.budgetResearchStay.costYear2 || 0,
                Expense_Type__c: 'Research stay'
            };
            if ($scope.expenseHeadIds['Research stay'] && $scope.expenseHeadIds['Research stay'].year2) {
                researchStayCostYear2Item.Expense_Head__c = $scope.expenseHeadIds['Research stay'].year2;
            }
            allExpenseLineItems.push(researchStayCostYear2Item);
        }

        // Year 3 - only if duration is 36 months
        if ($rootScope.proposalDurationMonths === 36) {
            let researchStayCostYear3Item = {
                Index__c: 2,
                Description__c: 'Research Stay Per diem cost',
                Year1_Expense__c: 0,
                Year2_Expense__c: 0,
                Year3_Expense__c: $scope.budgetResearchStay.costYear3 || 0,
                Total_Expense__c: $scope.budgetResearchStay.costYear3 || 0,
                Expense_Type__c: 'Research stay'
            };
            if ($scope.expenseHeadIds['Research stay'] && $scope.expenseHeadIds['Research stay'].year3) {
                researchStayCostYear3Item.Expense_Head__c = $scope.expenseHeadIds['Research stay'].year3;
            }
            allExpenseLineItems.push(researchStayCostYear3Item);
        }

        // Travel - Create separate line items for each year
        // Year 1
        let travelYear1Item = {
            Description__c: 'Travel cost per visit',
            Year1_Expense__c: $scope.budgetTravel.costYear1 || 0,
            Year2_Expense__c: 0,
            Year3_Expense__c: 0,
            Total_Expense__c: $scope.budgetTravel.costYear1 || 0,
            Expense_Type__c: 'Travel'
        };
        if ($scope.expenseHeadIds['Travel'] && $scope.expenseHeadIds['Travel'].year1) {
            travelYear1Item.Expense_Head__c = $scope.expenseHeadIds['Travel'].year1;
        }
        allExpenseLineItems.push(travelYear1Item);

        // Year 2 - only if duration is 24 or 36 months
        if ($rootScope.proposalDurationMonths >= 24) {
            let travelYear2Item = {
                Description__c: 'Travel cost per visit',
                Year1_Expense__c: 0,
                Year2_Expense__c: $scope.budgetTravel.costYear2 || 0,
                Year3_Expense__c: 0,
                Total_Expense__c: $scope.budgetTravel.costYear2 || 0,
                Expense_Type__c: 'Travel'
            };
            if ($scope.expenseHeadIds['Travel'] && $scope.expenseHeadIds['Travel'].year2) {
                travelYear2Item.Expense_Head__c = $scope.expenseHeadIds['Travel'].year2;
            }
            allExpenseLineItems.push(travelYear2Item);
        }

        // Year 3 - only if duration is 36 months
        if ($rootScope.proposalDurationMonths === 36) {
            let travelYear3Item = {
                Description__c: 'Travel cost per visit',
                Year1_Expense__c: 0,
                Year2_Expense__c: 0,
                Year3_Expense__c: $scope.budgetTravel.costYear3 || 0,
                Total_Expense__c: $scope.budgetTravel.costYear3 || 0,
                Expense_Type__c: 'Travel'
            };
            if ($scope.expenseHeadIds['Travel'] && $scope.expenseHeadIds['Travel'].year3) {
                travelYear3Item.Expense_Head__c = $scope.expenseHeadIds['Travel'].year3;
            }
            allExpenseLineItems.push(travelYear3Item);
        }

        // Research Staff - Multiple records with child line items
        // Use Expense_Head__c IDs to identify which records to update vs create
        if ($scope.budgetResearchStaffList && $scope.budgetResearchStaffList.length > 0) {
            for (let i = 0; i < $scope.budgetResearchStaffList.length; i++) {
                let staff = $scope.budgetResearchStaffList[i];
                // Use existing researchStaffType or generate new one
                let researchStaffType = staff.researchStaffType || ('Research staff ' + (i + 1));

                // Get Expense_Head__c IDs for this Research Staff (Year 1, 2, 3)
                // expenseHeadIds array contains [Year1HeadId, Year2HeadId, Year3HeadId] or empty for new records
                let year1HeadId = (staff.expenseHeadIds && staff.expenseHeadIds.length > 0) ? staff.expenseHeadIds[0] : null;
                let year2HeadId = (staff.expenseHeadIds && staff.expenseHeadIds.length > 1) ? staff.expenseHeadIds[1] : null;
                let year3HeadId = (staff.expenseHeadIds && staff.expenseHeadIds.length > 2) ? staff.expenseHeadIds[2] : null;

                // Child Line Item 1: No. of Positions
                // Store year-specific totals in Description for backend processing
                // Format: "No. of Positions|Y1Total:XXX|Y2Total:YYY|Y3Total:ZZZ"
                let year1Total = (staff.positionsYear1 || 0) * (staff.costYear1 || 0) * (staff.hoursYear1 || 0);
                let year2Total = (staff.positionsYear2 || 0) * (staff.costYear2 || 0) * (staff.hoursYear2 || 0);
                let year3Total = (staff.positionsYear3 || 0) * (staff.costYear3 || 0) * (staff.hoursYear3 || 0);

                // Year 1 line item
                let year1LineItem = {
                    Index__c: 1,
                    Description__c: 'No. of Positions|Y1Total:' + year1Total + '|Y2Total:' + year2Total + '|Y3Total:' + year3Total,
                    Number__c: staff.positionsYear1 || 0,
                    Year1_Expense__c: staff.positionsYear1 || 0,
                    Year2_Expense__c: 0,
                    Year3_Expense__c: 0,
                    Total_Expense__c: staff.positionsYear1 || 0,
                    Expense_Type__c: researchStaffType
                };
                // Only include Expense_Head__c if it's not null/undefined/empty
                if (year1HeadId && year1HeadId !== 'null' && year1HeadId !== 'undefined') {
                    year1LineItem.Expense_Head__c = year1HeadId;
                }
                allExpenseLineItems.push(year1LineItem);

                // Year 2 line item - only if duration is 24 or 36 months
                if ($rootScope.proposalDurationMonths >= 24) {
                    let year2LineItem = {
                        Index__c: 1,
                        Description__c: 'No. of Positions|Y1Total:' + year1Total + '|Y2Total:' + year2Total + '|Y3Total:' + year3Total,
                        Number__c: staff.positionsYear2 || 0,
                        Year1_Expense__c: 0,
                        Year2_Expense__c: staff.positionsYear2 || 0,
                        Year3_Expense__c: 0,
                        Total_Expense__c: staff.positionsYear2 || 0,
                        Expense_Type__c: researchStaffType
                    };
                    // Only include Expense_Head__c if it's not null/undefined/empty
                    if (year2HeadId && year2HeadId !== 'null' && year2HeadId !== 'undefined') {
                        year2LineItem.Expense_Head__c = year2HeadId;
                    }
                    allExpenseLineItems.push(year2LineItem);
                }

                // Year 3 line item - only if duration is 36 months
                if ($rootScope.proposalDurationMonths === 36) {
                    let year3LineItem = {
                        Index__c: 1,
                        Description__c: 'No. of Positions|Y1Total:' + year1Total + '|Y2Total:' + year2Total + '|Y3Total:' + year3Total,
                        Number__c: staff.positionsYear3 || 0,
                        Year1_Expense__c: 0,
                        Year2_Expense__c: 0,
                        Year3_Expense__c: staff.positionsYear3 || 0,
                        Total_Expense__c: staff.positionsYear3 || 0,
                        Expense_Type__c: researchStaffType
                    };
                    // Only include Expense_Head__c if it's not null/undefined/empty
                    if (year3HeadId && year3HeadId !== 'null' && year3HeadId !== 'undefined') {
                        year3LineItem.Expense_Head__c = year3HeadId;
                    }
                    allExpenseLineItems.push(year3LineItem);
                }

                // Child Line Item 2: Cost
                // Year 1
                let costYear1Item = {
                    Index__c: 2,
                    Description__c: 'Cost',
                    Salary_Month__c: staff.costYear1 || 0,
                    Year1_Expense__c: staff.costYear1 || 0,
                    Year2_Expense__c: 0,
                    Year3_Expense__c: 0,
                    Total_Expense__c: staff.costYear1 || 0,
                    Expense_Type__c: researchStaffType
                };
                if (year1HeadId && year1HeadId !== 'null' && year1HeadId !== 'undefined') {
                    costYear1Item.Expense_Head__c = year1HeadId;
                }
                allExpenseLineItems.push(costYear1Item);

                // Year 2 - only if duration is 24 or 36 months
                if ($rootScope.proposalDurationMonths >= 24) {
                    let costYear2Item = {
                        Index__c: 2,
                        Description__c: 'Cost',
                        Salary_Month__c: staff.costYear2 || 0,
                        Year1_Expense__c: 0,
                        Year2_Expense__c: staff.costYear2 || 0,
                        Year3_Expense__c: 0,
                        Total_Expense__c: staff.costYear2 || 0,
                        Expense_Type__c: researchStaffType
                    };
                    if (year2HeadId && year2HeadId !== 'null' && year2HeadId !== 'undefined') {
                        costYear2Item.Expense_Head__c = year2HeadId;
                    }
                    allExpenseLineItems.push(costYear2Item);
                }

                // Year 3 - only if duration is 36 months
                if ($rootScope.proposalDurationMonths === 36) {
                    let costYear3Item = {
                        Index__c: 2,
                        Description__c: 'Cost',
                        Salary_Month__c: staff.costYear3 || 0,
                        Year1_Expense__c: 0,
                        Year2_Expense__c: 0,
                        Year3_Expense__c: staff.costYear3 || 0,
                        Total_Expense__c: staff.costYear3 || 0,
                        Expense_Type__c: researchStaffType
                    };
                    if (year3HeadId && year3HeadId !== 'null' && year3HeadId !== 'undefined') {
                        costYear3Item.Expense_Head__c = year3HeadId;
                    }
                    allExpenseLineItems.push(costYear3Item);
                }

                // Child Line Item 3: Number of hours/week/days/month
                // Year 1
                let hoursYear1Item = {
                    Index__c: 3,
                    Description__c: 'Number of hour/week/days/month',
                    Person_Month__c: staff.hoursYear1 || 0,
                    Year1_Expense__c: staff.hoursYear1 || 0,
                    Year2_Expense__c: 0,
                    Year3_Expense__c: 0,
                    Total_Expense__c: staff.hoursYear1 || 0,
                    Expense_Type__c: researchStaffType
                };
                if (year1HeadId && year1HeadId !== 'null' && year1HeadId !== 'undefined') {
                    hoursYear1Item.Expense_Head__c = year1HeadId;
                }
                allExpenseLineItems.push(hoursYear1Item);

                // Year 2 - only if duration is 24 or 36 months
                if ($rootScope.proposalDurationMonths >= 24) {
                    let hoursYear2Item = {
                        Index__c: 3,
                        Description__c: 'Number of hour/week/days/month',
                        Person_Month__c: staff.hoursYear2 || 0,
                        Year1_Expense__c: 0,
                        Year2_Expense__c: staff.hoursYear2 || 0,
                        Year3_Expense__c: 0,
                        Total_Expense__c: staff.hoursYear2 || 0,
                        Expense_Type__c: researchStaffType
                    };
                    if (year2HeadId && year2HeadId !== 'null' && year2HeadId !== 'undefined') {
                        hoursYear2Item.Expense_Head__c = year2HeadId;
                    }
                    allExpenseLineItems.push(hoursYear2Item);
                }

                // Year 3 - only if duration is 36 months
                if ($rootScope.proposalDurationMonths === 36) {
                    let hoursYear3Item = {
                        Index__c: 3,
                        Description__c: 'Number of hour/week/days/month',
                        Person_Month__c: staff.hoursYear3 || 0,
                        Year1_Expense__c: 0,
                        Year2_Expense__c: 0,
                        Year3_Expense__c: staff.hoursYear3 || 0,
                        Total_Expense__c: staff.hoursYear3 || 0,
                        Expense_Type__c: researchStaffType
                    };
                    if (year3HeadId && year3HeadId !== 'null' && year3HeadId !== 'undefined') {
                        hoursYear3Item.Expense_Head__c = year3HeadId;
                    }
                    allExpenseLineItems.push(hoursYear3Item);
                }
            }
        }

        // Consumables - Create separate line items for each year
        // Year 1
        let consumablesYear1Item = {
            Description__c: 'Consumables',
            Year1_Expense__c: $scope.budgetConsumables.year1 || 0,
            Year2_Expense__c: 0,
            Year3_Expense__c: 0,
            Total_Expense__c: $scope.budgetConsumables.year1 || 0,
            Expense_Type__c: 'Consumables'
        };
        if ($scope.expenseHeadIds['Consumables'] && $scope.expenseHeadIds['Consumables'].year1) {
            consumablesYear1Item.Expense_Head__c = $scope.expenseHeadIds['Consumables'].year1;
        }
        allExpenseLineItems.push(consumablesYear1Item);

        // Year 2 - only if duration is 24 or 36 months
        if ($rootScope.proposalDurationMonths >= 24) {
            let consumablesYear2Item = {
                Description__c: 'Consumables',
                Year1_Expense__c: 0,
                Year2_Expense__c: $scope.budgetConsumables.year2 || 0,
                Year3_Expense__c: 0,
                Total_Expense__c: $scope.budgetConsumables.year2 || 0,
                Expense_Type__c: 'Consumables'
            };
            if ($scope.expenseHeadIds['Consumables'] && $scope.expenseHeadIds['Consumables'].year2) {
                consumablesYear2Item.Expense_Head__c = $scope.expenseHeadIds['Consumables'].year2;
            }
            allExpenseLineItems.push(consumablesYear2Item);
        }

        // Year 3 - only if duration is 36 months
        if ($rootScope.proposalDurationMonths === 36) {
            let consumablesYear3Item = {
                Description__c: 'Consumables',
                Year1_Expense__c: 0,
                Year2_Expense__c: 0,
                Year3_Expense__c: $scope.budgetConsumables.year3 || 0,
                Total_Expense__c: $scope.budgetConsumables.year3 || 0,
                Expense_Type__c: 'Consumables'
            };
            if ($scope.expenseHeadIds['Consumables'] && $scope.expenseHeadIds['Consumables'].year3) {
                consumablesYear3Item.Expense_Head__c = $scope.expenseHeadIds['Consumables'].year3;
            }
            allExpenseLineItems.push(consumablesYear3Item);
        }

        // Minor Equipment - Create separate line items for each year
        // Year 1
        let minorEquipmentYear1Item = {
            Description__c: 'Minor equipment',
            Year1_Expense__c: $scope.minorEquipment.year1 || 0,
            Year2_Expense__c: 0,
            Year3_Expense__c: 0,
            Total_Expense__c: $scope.minorEquipment.year1 || 0,
            Expense_Type__c: 'Minor equipment'
        };
        if ($scope.expenseHeadIds['Minor equipment'] && $scope.expenseHeadIds['Minor equipment'].year1) {
            minorEquipmentYear1Item.Expense_Head__c = $scope.expenseHeadIds['Minor equipment'].year1;
        }
        allExpenseLineItems.push(minorEquipmentYear1Item);

        // Year 2 - only if duration is 24 or 36 months
        if ($rootScope.proposalDurationMonths >= 24) {
            let minorEquipmentYear2Item = {
                Description__c: 'Minor equipment',
                Year1_Expense__c: 0,
                Year2_Expense__c: $scope.minorEquipment.year2 || 0,
                Year3_Expense__c: 0,
                Total_Expense__c: $scope.minorEquipment.year2 || 0,
                Expense_Type__c: 'Minor equipment'
            };
            if ($scope.expenseHeadIds['Minor equipment'] && $scope.expenseHeadIds['Minor equipment'].year2) {
                minorEquipmentYear2Item.Expense_Head__c = $scope.expenseHeadIds['Minor equipment'].year2;
            }
            allExpenseLineItems.push(minorEquipmentYear2Item);
        }

        // Year 3 - only if duration is 36 months
        if ($rootScope.proposalDurationMonths === 36) {
            let minorEquipmentYear3Item = {
                Description__c: 'Minor equipment',
                Year1_Expense__c: 0,
                Year2_Expense__c: 0,
                Year3_Expense__c: $scope.minorEquipment.year3 || 0,
                Total_Expense__c: $scope.minorEquipment.year3 || 0,
                Expense_Type__c: 'Minor equipment'
            };
            if ($scope.expenseHeadIds['Minor equipment'] && $scope.expenseHeadIds['Minor equipment'].year3) {
                minorEquipmentYear3Item.Expense_Head__c = $scope.expenseHeadIds['Minor equipment'].year3;
            }
            allExpenseLineItems.push(minorEquipmentYear3Item);
        }

        // Contingency - Create separate line items for each year
        // Year 1
        let contingencyYear1Item = {
            Description__c: 'Contingency and Miscellaneous',
            Year1_Expense__c: $scope.budgetContingency.year1 || 0,
            Year2_Expense__c: 0,
            Year3_Expense__c: 0,
            Total_Expense__c: $scope.budgetContingency.year1 || 0,
            Expense_Type__c: 'Contingency'
        };
        if ($scope.expenseHeadIds['Contingency'] && $scope.expenseHeadIds['Contingency'].year1) {
            contingencyYear1Item.Expense_Head__c = $scope.expenseHeadIds['Contingency'].year1;
        }
        allExpenseLineItems.push(contingencyYear1Item);

        // Year 2 - only if duration is 24 or 36 months
        if ($rootScope.proposalDurationMonths >= 24) {
            let contingencyYear2Item = {
                Description__c: 'Contingency and Miscellaneous',
                Year1_Expense__c: 0,
                Year2_Expense__c: $scope.budgetContingency.year2 || 0,
                Year3_Expense__c: 0,
                Total_Expense__c: $scope.budgetContingency.year2 || 0,
                Expense_Type__c: 'Contingency'
            };
            if ($scope.expenseHeadIds['Contingency'] && $scope.expenseHeadIds['Contingency'].year2) {
                contingencyYear2Item.Expense_Head__c = $scope.expenseHeadIds['Contingency'].year2;
            }
            allExpenseLineItems.push(contingencyYear2Item);
        }

        // Year 3 - only if duration is 36 months
        if ($rootScope.proposalDurationMonths === 36) {
            let contingencyYear3Item = {
                Description__c: 'Contingency and Miscellaneous',
                Year1_Expense__c: 0,
                Year2_Expense__c: 0,
                Year3_Expense__c: $scope.budgetContingency.year3 || 0,
                Total_Expense__c: $scope.budgetContingency.year3 || 0,
                Expense_Type__c: 'Contingency'
            };
            if ($scope.expenseHeadIds['Contingency'] && $scope.expenseHeadIds['Contingency'].year3) {
                contingencyYear3Item.Expense_Head__c = $scope.expenseHeadIds['Contingency'].year3;
            }
            allExpenseLineItems.push(contingencyYear3Item);
        }

        // Overhead - Create separate line items for each year
        // Year 1
        let overheadYear1Item = {
            Description__c: 'Overheads Percentage',
            Year1_Expense__c: $scope.budgetOverhead.percentageYear1 || 0,
            Year2_Expense__c: 0,
            Year3_Expense__c: 0,
            Total_Expense__c: $scope.budgetOverhead.percentageYear1 || 0,
            Expense_Type__c: 'Overhead'
        };
        if ($scope.expenseHeadIds['Overhead'] && $scope.expenseHeadIds['Overhead'].year1) {
            overheadYear1Item.Expense_Head__c = $scope.expenseHeadIds['Overhead'].year1;
        }
        allExpenseLineItems.push(overheadYear1Item);

        // Year 2 - only if duration is 24 or 36 months
        if ($rootScope.proposalDurationMonths >= 24) {
            let overheadYear2Item = {
                Description__c: 'Overheads Percentage',
                Year1_Expense__c: 0,
                Year2_Expense__c: $scope.budgetOverhead.percentageYear2 || 0,
                Year3_Expense__c: 0,
                Total_Expense__c: $scope.budgetOverhead.percentageYear2 || 0,
                Expense_Type__c: 'Overhead'
            };
            if ($scope.expenseHeadIds['Overhead'] && $scope.expenseHeadIds['Overhead'].year2) {
                overheadYear2Item.Expense_Head__c = $scope.expenseHeadIds['Overhead'].year2;
            }
            allExpenseLineItems.push(overheadYear2Item);
        }

        // Year 3 - only if duration is 36 months
        if ($rootScope.proposalDurationMonths === 36) {
            let overheadYear3Item = {
                Description__c: 'Overheads Percentage',
                Year1_Expense__c: 0,
                Year2_Expense__c: 0,
                Year3_Expense__c: $scope.budgetOverhead.percentageYear3 || 0,
                Total_Expense__c: $scope.budgetOverhead.percentageYear3 || 0,
                Expense_Type__c: 'Overhead'
            };
            if ($scope.expenseHeadIds['Overhead'] && $scope.expenseHeadIds['Overhead'].year3) {
                overheadYear3Item.Expense_Head__c = $scope.expenseHeadIds['Overhead'].year3;
            }
            allExpenseLineItems.push(overheadYear3Item);
        }

        // Prepare APA update object
        var updatedApa = {
            'Id': $rootScope.apaId
        };

        // Save using ApplicantPortal_Contoller
        ApplicantPortal_Contoller.createExpenseWithHeadAndLineItemsForWiser(
            allExpenseLineItems, $rootScope.apaId, updatedApa,
            function (result, event) {
                if (!event) {
                    console.error('Event is null or undefined');
                    swal("Error", "Failed to save: No response from server.", "error");
                    return;
                }

                if (event.status && result != null) {
                    debugger;

                    // Check if result is an error string
                    if (typeof result === 'string' && result.startsWith && result.startsWith('error')) {
                        swal("Error", "Error saving budget details: " + result, "error");
                        return;
                    }

                    // Try to parse JSON result containing Expense_Head__c IDs
                    try {
                        let saveResult = JSON.parse(result);
                        if (saveResult.status === 'success' && saveResult.researchStaffHeadIds) {
                            // Update expenseHeadIds for each Research Staff record
                            if ($scope.budgetResearchStaffList && $scope.budgetResearchStaffList.length > 0) {
                                for (let i = 0; i < $scope.budgetResearchStaffList.length; i++) {
                                    let staff = $scope.budgetResearchStaffList[i];
                                    let researchStaffType = staff.researchStaffType || ('Research staff ' + (i + 1));

                                    // Get Expense_Head__c IDs for this Research Staff from backend response
                                    if (saveResult.researchStaffHeadIds[researchStaffType]) {
                                        // Store IDs in correct order: [Year1HeadId, Year2HeadId, Year3HeadId]
                                        // Keep null values to maintain array indices
                                        let headIds = saveResult.researchStaffHeadIds[researchStaffType];
                                        staff.expenseHeadIds = [
                                            headIds[0] || null,
                                            headIds[1] || null,
                                            headIds[2] || null
                                        ];
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        // If JSON parsing fails, assume it's a simple success/error string
                        console.log('Could not parse save result as JSON: ' + e.message);
                        // If result is just "success" string, that's fine - we'll still redirect
                    }

                    // Show success message
                    swal({
                        title: "Success",
                        text: "Budget details have been saved successfully.",
                        icon: "success",
                        button: "ok!",
                    });

                    // Redirect immediately - don't wait for swal
                    setTimeout(function () {
                        $scope.redirectPageURL('ExistingGrantWISER');
                        if (!$scope.$$phase && !$scope.$root.$$phase) {
                            $scope.$apply();
                        }
                    }, 1000);
                } else {
                    // Handle case where event.status is false or result is null
                    swal({
                        title: "ERROR",
                        text: "Failed to save budget details. Please try again.",
                        icon: "error",
                        button: "ok!",
                    });
                }
            },
            { escape: true }
        );
    };

    // Initialize: Try to get expense records using ApplicantPortal_Contoller if available
    // This will be called after getAccounts() sets up proposalId and contactId
    // We'll call it from getAccounts() callback if needed

    $scope.onOverheadChange = function (year) {
        debugger;
        let field = 'percentageYear' + year;
        let value = Number($scope.budgetOverhead[field]) || 0;

        // Hard cap at 10%
        if (value > 10) {
            $scope.budgetOverhead[field] = 10;

            swal(
                "Invalid Percentage",
                "Overheads percentage cannot be more than 10%",
                "warning"
            );
        }

        if (value < 0) {
            $scope.budgetOverhead[field] = 0;
        }

        // Recalculate AFTER validation
        $scope.recalculateAll();
    };

    $scope.validateBeforeSave = function () {

        // 1️⃣ Grand Total validation (per year)
        if ($scope.grandTotal.year1 > MAX_RESEARCH_AMOUNT) {
            swal(
                "Budget Limit Exceeded",
                "Year 1 Grand Total cannot be more than €16,000.",
                "info"
            );
            return false;
        }

        // Only validate Year 2 if duration is 24 or 36 months
        if ($rootScope.proposalDurationMonths >= 24 && $scope.grandTotal.year2 > MAX_RESEARCH_AMOUNT) {
            swal(
                "Budget Limit Exceeded",
                "Year 2 Grand Total cannot be more than €16,000.",
                "info"
            );
            return false;
        }

        // Only validate Year 3 if duration is 36 months
        if ($rootScope.proposalDurationMonths === 36 && $scope.grandTotal.year3 > MAX_RESEARCH_AMOUNT) {
            swal(
                "Budget Limit Exceeded",
                "Year 3 Grand Total cannot be more than €16,000.",
                "info"
            );
            return false;
        }

        // 2️⃣ Overhead percentage validation
        if (($scope.budgetOverhead.percentageYear1 || 0) > 10) {
            swal(
                "Invalid Overheads",
                "Year 1 Overheads percentage cannot be more than 10%.",
                "info"
            );
            return false;
        }

        // Only validate Year 2 if duration is 24 or 36 months
        if ($rootScope.proposalDurationMonths >= 24 && ($scope.budgetOverhead.percentageYear2 || 0) > 10) {
            swal(
                "Invalid Overheads",
                "Year 2 Overheads percentage cannot be more than 10%.",
                "info"
            );
            return false;
        }

        // Only validate Year 3 if duration is 36 months
        if ($rootScope.proposalDurationMonths === 36 && ($scope.budgetOverhead.percentageYear3 || 0) > 10) {
            swal(
                "Invalid Overheads",
                "Year 3 Overheads percentage cannot be more than 10%.",
                "info"
            );
            return false;
        }

        // ✅ All validations passed
        return true;
    };
})