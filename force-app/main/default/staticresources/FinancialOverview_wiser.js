angular.module('cp_app').controller('financialWiser_Ctrl', function ($scope, $rootScope) {
    console.log('=== Controller Initialized: financialWiser_Ctrl ===');
    console.log('Initial $rootScope.mailingCountry:', $rootScope.mailingCountry);
    console.log('Initial $scope.mailingCountry:', $scope.mailingCountry);

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
    $scope.euroExchangeRate = 108.695652173;

    // Initialize mailingCountry variables
    $scope.mailingCountry = $scope.mailingCountry || $rootScope.mailingCountry || null;
    if (!$rootScope.mailingCountry && $scope.mailingCountry) {
        $rootScope.mailingCountry = $scope.mailingCountry;
    }
    console.log('After initialization - $scope.mailingCountry:', $scope.mailingCountry);
    console.log('After initialization - $rootScope.mailingCountry:', $rootScope.mailingCountry);

    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }

    if (localStorage.getItem('apaId')) {
        $rootScope.apaId = localStorage.getItem('apaId');
        console.log('Loaded proposalId from localStorage:', $rootScope.apaId);
    }

    if (localStorage.getItem('yearlyCallId')) {
        $rootScope.yearlyCallId = localStorage.getItem('yearlyCallId');
        console.log('Loaded yearlyCallId from localStorage:', $rootScope.yearlyCallId);
    }

    console.log('$rootScope.candidateId ===>>' + $rootScope.candidateId);

    /**
    * Fetches proposal stage from Apex on page load
    */
    $scope.getProposalStage = function () {
        debugger;
        if ($rootScope.apaId && $rootScope.proposalId) {
            ApplicantPortal_Contoller.getProposalStageUsingProposalId($rootScope.proposalId, $rootScope.apaId, function (result, event) {
                debugger;
                if (event.status && result) {
                    $scope.proposalStage = (result.proposalStage != 'Draft' && result.proposalStage != null && result.proposalStage != undefined);
                    $rootScope.proposalStage = $scope.proposalStage;
                    $scope.$apply();
                }
            }, { escape: true });
        }
    }
    $scope.getProposalStage();

    const PER_DIEM_MONTHLY = 2300;
    const DAYS_IN_MONTH = 30;
    const PER_DAY_COST = PER_DIEM_MONTHLY / DAYS_IN_MONTH;
    const MAX_RESEARCH_AMOUNT_EURO = 16000;
    const MAX_RESEARCH_AMOUNT_INR = 1300000;
    const TRAVEL_COST_EURO = 1500;
    const TRAVEL_COST_INR = 100000; // Fixed ₹1,00,000 for India

    $scope.timeUnits = ['Hour', 'Day', 'Week', 'Month'];
    $scope.showFullInfoBox = false; // Initialize info box as collapsed

    // Helper function to check if country is India
    $scope.isIndia = function () {
        const country = $scope.mailingCountry ||
            $rootScope.mailingCountry ||
            ($scope.accDetails && $scope.accDetails.Contacts &&
                $scope.accDetails.Contacts[0] &&
                $scope.accDetails.Contacts[0].MailingCountry);
        const isIndiaResult = country === 'India' || country === 'india';
        console.log('=== DEBUG: isIndia() ===');
        console.log('Country:', country);
        console.log('Is India?', isIndiaResult);
        console.log('=== END DEBUG ===');
        return isIndiaResult;
    };

    // Helper function to check if country is Germany
    $scope.isGermany = function () {
        const country = $scope.mailingCountry ||
            $rootScope.mailingCountry ||
            ($scope.accDetails && $scope.accDetails.Contacts &&
                $scope.accDetails.Contacts[0] &&
                $scope.accDetails.Contacts[0].MailingCountry);
        const isGermanyResult = country === 'Germany' || country === 'germany';
        console.log('=== DEBUG: isGermany() ===');
        console.log('Country:', country);
        console.log('Is Germany?', isGermanyResult);
        console.log('=== END DEBUG ===');
        return isGermanyResult;
    };

    // Function to get max research amount based on mailing country
    $scope.getMaxResearchAmount = function () {
        // Check multiple sources for mailing country
        const isIndia = ($scope.mailingCountry === 'India' ||
            $rootScope.mailingCountry === 'India' ||
            ($scope.accDetails && $scope.accDetails.Contacts &&
                $scope.accDetails.Contacts[0] &&
                $scope.accDetails.Contacts[0].MailingCountry === 'India'));
        if (isIndia) {
            return MAX_RESEARCH_AMOUNT_INR;
        }
        return MAX_RESEARCH_AMOUNT_EURO;
    };

    // Function to get travel cost based on mailing country
    // Travel cost is fixed: ₹1,00,000 for India, €1500 for Germany
    $scope.getTravelCost = function () {
        // Check multiple sources for mailing country
        const isIndia = ($scope.mailingCountry === 'India' ||
            $rootScope.mailingCountry === 'India' ||
            ($scope.accDetails && $scope.accDetails.Contacts &&
                $scope.accDetails.Contacts[0] &&
                $scope.accDetails.Contacts[0].MailingCountry === 'India'));
        if (isIndia) {
            return TRAVEL_COST_INR; // Fixed ₹1,00,000 for India
        }
        return TRAVEL_COST_EURO; // Fixed €1500 for Germany
    };

    // Function to get per day rate based on mailing country
    $scope.getPerDayRate = function () {
        // Check multiple sources for mailing country
        const isIndia = ($scope.mailingCountry === 'India' ||
            $rootScope.mailingCountry === 'India' ||
            ($scope.accDetails && $scope.accDetails.Contacts &&
                $scope.accDetails.Contacts[0] &&
                $scope.accDetails.Contacts[0].MailingCountry === 'India'));
        if (isIndia) {
            return (PER_DIEM_MONTHLY * ($scope.euroExchangeRate || $rootScope.euroExchangeRate || 1)) / DAYS_IN_MONTH;
        }
        return PER_DIEM_MONTHLY / DAYS_IN_MONTH;
    };

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
        totalCost: 0,
        description: '' // Description for Research Stay
    };

    $scope.budgetTravel = {
        costYear1: 0,
        costYear2: 0,
        costYear3: 0,
        totalCost: 0,
        description: '' // Description for Travel
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
        hoursUnit: 'Hour',
        totalYear1: 0,
        totalYear2: 0,
        totalYear3: 0,
        totalAmount: 0,
        researchStaffType: 'Research staff 1', // Track the backend type name
        expenseHeadIds: [], // Store Expense_Head__c IDs for deletion
        description: '' // Single description for all Research Staff items (stored in Expense_Head__c.Description__c)
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
        total: 0,
        description: '' // Description for Consumables
    };

    $scope.minorEquipment = {
        year1: 0,
        year2: 0,
        year3: 0,
        total: 0,
        description: '' // Description for Minor Equipment
    };

    $scope.budgetContingency = {
        year1: 0,
        year2: 0,
        year3: 0,
        total: 0,
        description: '' // Description for Contingency
    };

    $scope.budgetOverhead = {
        percentageYear1: 0,
        percentageYear2: 0,
        percentageYear3: 0,
        amountYear1: 0,
        amountYear2: 0,
        amountYear3: 0,
        totalAmount: 0,
        description: '' // Description for Overhead
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

    // $scope.getApplicantStatusFromAPA = function () {

    //     ApplicantPortal_Contoller.fetchApplicantStatusWithDuration(
    //         $rootScope.apaId,
    //         $rootScope.yearlyCallId,
    //         function (result, event) {

    //             console.log('Result:', result);
    //             console.log('Event:', event);

    //             if (event.status && result) {

    //                 // Status flag
    //                 $rootScope.isCurrentUserSubmitted = result.applicantStatus === 'Submitted';

    //                 // Duration months
    //                 $rootScope.proposalDurationMonths = result.durationInMonths;

    //                 // Set year visibility based on duration
    //                 $scope.setYearVisibilityBasedOnDuration();

    //                 // Euro exchange rate
    //                 $rootScope.euroExchangeRate = result.euroExchangeRate;
    //                 $scope.euroExchangeRate = result.euroExchangeRate;

    //                 // Mailing country
    //                 $rootScope.mailingCountry = result.mailingCountry;
    //                 $scope.mailingCountry = result.mailingCountry;

    //                 // Lock editor only if submitted
    //                 if ($rootScope.isCurrentUserSubmitted) {
    //                     CKEDITOR.config.readOnly = true;
    //                 }

    //             } else {
    //                 console.error('fetchApplicantStatus failed:', event.message);
    //             }
    //         },
    //         { escape: true }
    //     );
    // };

    // $scope.getApplicantStatusFromAPA();

    $scope.getAccounts = function () {
        debugger;
        IndustrialFellowshipController.getProposalAccounts($rootScope.proposalId, $rootScope.candidateId, function (result, event) {
            console.log('onload :: =>');
            console.log(result);
            console.log('event:', event);

            if (event.status && result != null) {
                debugger;
                if (result.accountDetail.Name != undefined || result.accountDetail.Name != "") {
                    result.accountDetail.Name = result.accountDetail.Name ? result.accountDetail.Name.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.accountDetail.Name;
                }
                $scope.accDetails = result.accountDetail;
                $scope.durationMonths = result.durationInMonths;

                // Set mailing country from accDetails
                if ($scope.accDetails && $scope.accDetails.Contacts &&
                    $scope.accDetails.Contacts[0] &&
                    $scope.accDetails.Contacts[0].MailingCountry) {
                    // Normalize country name (capitalize first letter)
                    let countryName = $scope.accDetails.Contacts[0].MailingCountry;
                    // Normalize to proper case (e.g., "germany" -> "Germany", "GERMANY" -> "Germany")
                    if (countryName) {
                        countryName = countryName.charAt(0).toUpperCase() + countryName.slice(1).toLowerCase();
                    }
                    $scope.mailingCountry = countryName;
                    $rootScope.mailingCountry = countryName;
                    console.log('=== DEBUG: Mailing Country Information ===');
                    console.log('Original accDetails.Contacts[0].MailingCountry:', $scope.accDetails.Contacts[0].MailingCountry);
                    console.log('Normalized $scope.mailingCountry:', $scope.mailingCountry);
                    console.log('Normalized $rootScope.mailingCountry:', $rootScope.mailingCountry);
                    console.log('Full accDetails:', $scope.accDetails);
                    console.log('Full Contacts array:', $scope.accDetails.Contacts);
                    console.log('First Contact:', $scope.accDetails.Contacts[0]);
                    console.log('Is India?', $scope.mailingCountry === 'India');
                    console.log('Is Germany?', $scope.mailingCountry === 'Germany');
                    console.log('=== END DEBUG ===');
                } else {
                    console.log('=== DEBUG: Mailing Country NOT Found ===');
                    console.log('accDetails exists:', !!$scope.accDetails);
                    console.log('Contacts exists:', !!($scope.accDetails && $scope.accDetails.Contacts));
                    console.log('Contacts length:', ($scope.accDetails && $scope.accDetails.Contacts) ? $scope.accDetails.Contacts.length : 0);
                    console.log('First Contact exists:', !!($scope.accDetails && $scope.accDetails.Contacts && $scope.accDetails.Contacts[0]));
                    if ($scope.accDetails && $scope.accDetails.Contacts && $scope.accDetails.Contacts[0]) {
                        console.log('First Contact MailingCountry:', $scope.accDetails.Contacts[0].MailingCountry);
                    }
                    console.log('=== END DEBUG ===');
                }

                // Watch for changes in mailingCountry
                $scope.$watch('mailingCountry', function (newVal, oldVal) {
                    console.log('=== DEBUG: mailingCountry changed ===');
                    console.log('Old value:', oldVal);
                    console.log('New value:', newVal);
                    console.log('=== END DEBUG ===');
                });

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
            } else {
                // Handle error case
                console.error('Error fetching proposal accounts:', event);
                var errorMessage = 'Failed to load account details.';
                if (event && event.message) {
                    errorMessage = event.message;
                } else if (event && event.type) {
                    errorMessage = 'Error: ' + event.type;
                }
                swal({
                    title: "Error",
                    text: errorMessage,
                    icon: "error",
                    button: "OK"
                });
                $scope.$apply();
            }
        }, { escape: true })
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
                        } else if (headName === 'Overheads' || headName === 'Projektpauschale') {
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

        // Show spinner on button
        $("#btnPreview").html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Please wait...');
        $("#btnPreview").prop('disabled', true);

        IndustrialFellowshipController.saveExpenceLineItemWISER($scope.expLineItem, $scope.totalSum, function (result, event) {

            // Restore button
            $("#btnPreview").html('<i class="fa-solid fa-check me-2"></i>Save and Next');
            $("#btnPreview").prop('disabled', false);

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
            const PER_DAY_RATE = $scope.getPerDayRate();

            const d1 = Number($scope.budgetResearchStay.daysYear1) || 0;
            const d2 = Number($scope.budgetResearchStay.daysYear2) || 0;
            const d3 = Number($scope.budgetResearchStay.daysYear3) || 0;

            $scope.budgetResearchStay.totalDays = d1 + d2 + d3;

            if ($scope.mailingCountry === 'India') {
                $scope.budgetResearchStay.costYear1 = Math.round(Math.round(d1 * PER_DAY_RATE * 100) / 100);
                $scope.budgetResearchStay.costYear2 = Math.round(Math.round(d2 * PER_DAY_RATE * 100) / 100);
                $scope.budgetResearchStay.costYear3 = Math.round(Math.round(d3 * PER_DAY_RATE * 100) / 100);
            } else {
                $scope.budgetResearchStay.costYear1 = Math.round(Math.round(d1 * PER_DAY_RATE * 100) / 100);
                $scope.budgetResearchStay.costYear2 = Math.round(Math.round(d2 * PER_DAY_RATE * 100) / 100);
                $scope.budgetResearchStay.costYear3 = Math.round(Math.round(d3 * PER_DAY_RATE * 100) / 100);
            }

            // $scope.budgetOverhead.amountYear1 = Math.round((baseYear1 * ($scope.budgetOverhead.percentageYear1 || 0) / 100) * 100) / 100;
            //         // $scope.budgetOverhead.amountYear2 = Math.round((baseYear2 * ($scope.budgetOverhead.percentageYear2 || 0) / 100) * 100) / 100;
            //         // $scope.budgetOverhead.amountYear3 = Math.round((baseYear3 * ($scope.budgetOverhead.percentageYear3 || 0) / 100) * 100) / 100;

            // if ($scope.mailingCountry === 'India') {
            //     $scope.budgetResearchStay.costYear1 = Math.round(Math.round(d1 * PER_DAY_RATE) / 108.695652173);
            //     $scope.budgetResearchStay.costYear2 = Math.round(Math.round(d2 * PER_DAY_RATE) / 108.695652173);
            //     $scope.budgetResearchStay.costYear3 = Math.round(Math.round(d3 * PER_DAY_RATE) / 108.695652173);
            // } else {
            //     $scope.budgetResearchStay.costYear1 = Math.round(Math.round(d1 * PER_DAY_RATE * 100) / 100);
            //     $scope.budgetResearchStay.costYear2 = Math.round(Math.round(d2 * PER_DAY_RATE * 100) / 100);
            //     $scope.budgetResearchStay.costYear3 = Math.round(Math.round(d3 * PER_DAY_RATE * 100) / 100);
            // }

            $scope.budgetResearchStay.totalCost =
                $scope.budgetResearchStay.costYear1 +
                $scope.budgetResearchStay.costYear2 +
                $scope.budgetResearchStay.costYear3;

            /* =====================================================
               2️⃣ TRAVEL COST (AUTO)
               Validation: Fixed ₹1,00,000 for India (€1500 for Germany) if any days are added, 0 if zero days
            ===================================================== */
            const travelCost = $scope.getTravelCost();
            // Check days instead of cost - travel cost is fixed if any days are added
            $scope.budgetTravel.costYear1 = (d1 > 0) ? travelCost : 0;
            $scope.budgetTravel.costYear2 = (d2 > 0) ? travelCost : 0;
            $scope.budgetTravel.costYear3 = (d3 > 0) ? travelCost : 0;

            $scope.budgetTravel.totalCost =
                $scope.budgetTravel.costYear1 +
                $scope.budgetTravel.costYear2 +
                $scope.budgetTravel.costYear3;

            /* =====================================================
               3️⃣ RESEARCH STAY + TRAVEL TOTAL
            ===================================================== */
            $scope.researchStayTravelTotal.year1 =
                Math.round(Math.round($scope.budgetResearchStay.costYear1 +
                    $scope.budgetTravel.costYear1) * 100) / 100;

            $scope.researchStayTravelTotal.year2 =
                Math.round(Math.round($scope.budgetResearchStay.costYear2 +
                    $scope.budgetTravel.costYear2) * 100) / 100;

            $scope.researchStayTravelTotal.year3 =
                Math.round(Math.round($scope.budgetResearchStay.costYear3 +
                    $scope.budgetTravel.costYear3) * 100) / 100;

            $scope.researchStayTravelTotal.total =
                Math.round(Math.round($scope.researchStayTravelTotal.year1 +
                    $scope.researchStayTravelTotal.year2 +
                    $scope.researchStayTravelTotal.year3) * 100) / 100;

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
               = MAX_RESEARCH_AMOUNT − (Research Stay + Travel)
            ===================================================== */
            const maxResearchAmount = $scope.getMaxResearchAmount();
            $scope.totalResearchAmount.year1 =
                Math.max(0, maxResearchAmount - $scope.researchStayTravelTotal.year1);

            // Only calculate Year 2 if duration is 24 or 36 months
            if ($rootScope.proposalDurationMonths >= 24) {
                $scope.totalResearchAmount.year2 =
                    Math.max(0, maxResearchAmount - $scope.researchStayTravelTotal.year2);
            } else {
                $scope.totalResearchAmount.year2 = 0;
            }

            // Only calculate Year 3 if duration is 36 months
            if ($rootScope.proposalDurationMonths === 36) {
                $scope.totalResearchAmount.year3 =
                    Math.max(0, maxResearchAmount - $scope.researchStayTravelTotal.year3);
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
                    Math.round(
                        $scope.totalResearchAmount.year1 *
                        (Number($scope.budgetOverhead.percentageYear1) || 0)
                    ) / 100
                );

            // Only calculate Year 2 if duration is 24 or 36 months
            if ($rootScope.proposalDurationMonths >= 24) {
                $scope.budgetOverhead.amountYear2 =
                    Math.round(
                        Math.round(
                            $scope.totalResearchAmount.year2 *
                            (Number($scope.budgetOverhead.percentageYear2) || 0)
                        ) / 100
                    );
            } else {
                $scope.budgetOverhead.amountYear2 = 0;
            }

            // Only calculate Year 3 if duration is 36 months
            if ($rootScope.proposalDurationMonths === 36) {
                $scope.budgetOverhead.amountYear3 =
                    Math.round(
                        Math.round(
                            $scope.totalResearchAmount.year3 *
                            (Number($scope.budgetOverhead.percentageYear3) || 0)
                        ) / 100
                    );
            } else {
                $scope.budgetOverhead.amountYear3 = 0;
            }

            $scope.budgetOverhead.totalAmount = Math.round(
                $scope.budgetOverhead.amountYear1 +
                $scope.budgetOverhead.amountYear2 +
                $scope.budgetOverhead.amountYear3
            );

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
            // = MAX_RESEARCH_AMOUNT - (Research Stay + Travel) - Overheads
            // =====================================================
            $scope.remainingForResearch.year1 =
                Math.round(Math.max(
                    0,
                    maxResearchAmount -
                    ($scope.researchStayTravelTotal.year1 || 0) -
                    ($scope.budgetOverhead.amountYear1 || 0)
                ) * 100) / 100;

            // Only calculate Year 2 if duration is 24 or 36 months
            if ($rootScope.proposalDurationMonths >= 24) {
                $scope.remainingForResearch.year2 =
                    Math.round(Math.max(
                        0,
                        maxResearchAmount -
                        ($scope.researchStayTravelTotal.year2 || 0) -
                        ($scope.budgetOverhead.amountYear2 || 0)
                    ) * 100) / 100;
            } else {
                $scope.remainingForResearch.year2 = 0;
            }

            // Only calculate Year 3 if duration is 36 months
            if ($rootScope.proposalDurationMonths === 36) {
                $scope.remainingForResearch.year3 =
                    Math.round(Math.max(
                        0,
                        maxResearchAmount -
                        ($scope.researchStayTravelTotal.year3 || 0) -
                        ($scope.budgetOverhead.amountYear3 || 0)
                    ) * 100) / 100;
            } else {
                $scope.remainingForResearch.year3 = 0;
            }

            $scope.remainingForResearch.total =
                Math.round(Math.round($scope.remainingForResearch.year1 +
                    $scope.remainingForResearch.year2 +
                    $scope.remainingForResearch.year3) * 100) / 100;

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
                Math.round(Math.round($scope.researchStayTravelTotal.year1 +
                    $scope.totalResearchHeads.year1) * 100) / 100;

            // Only calculate Year 2 if duration is 24 or 36 months
            if ($rootScope.proposalDurationMonths >= 24) {
                $scope.grandTotal.year2 =
                    Math.round(Math.round($scope.researchStayTravelTotal.year2 +
                        $scope.totalResearchHeads.year2) * 100) / 100;
            } else {
                $scope.grandTotal.year2 = 0;
            }

            // Only calculate Year 3 if duration is 36 months
            if ($rootScope.proposalDurationMonths === 36) {
                $scope.grandTotal.year3 =
                    Math.round(Math.round($scope.researchStayTravelTotal.year3 +
                        $scope.totalResearchHeads.year3) * 100) / 100;
            } else {
                $scope.grandTotal.year3 = 0;
            }

            $scope.grandTotal.total =
                Math.round(Math.round($scope.grandTotal.year1 +
                    $scope.grandTotal.year2 +
                    $scope.grandTotal.year3) * 100) / 100;

            console.log('$scope.grandTotal.year1', $scope.grandTotal.year1);

            /* =====================================================
                9️⃣ VALIDATION: Grand Total must not exceed MAX_RESEARCH_AMOUNT
            ===================================================== */

            $scope.grandTotalError = {
                year1: false,
                year2: false,
                year3: false,
                any: false
            };
            debugger;

            $scope.grandTotalError.year1 = $scope.grandTotal.year1 > maxResearchAmount;

            // Only validate Year 2 if duration is 24 or 36 months
            if ($rootScope.proposalDurationMonths >= 24) {
                $scope.grandTotalError.year2 = $scope.grandTotal.year2 > maxResearchAmount;
            } else {
                $scope.grandTotalError.year2 = false;
            }

            // Only validate Year 3 if duration is 36 months
            if ($rootScope.proposalDurationMonths === 36) {
                $scope.grandTotalError.year3 = $scope.grandTotal.year3 > maxResearchAmount;
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
                year1: Math.round(Math.round(($scope.remainingForResearch.year1 || 0) * 0.15 * 100) / 100),
                year2: $rootScope.proposalDurationMonths >= 24 ? Math.round(Math.round(($scope.remainingForResearch.year2 || 0) * 0.15 * 100) / 100) : 0,
                year3: $rootScope.proposalDurationMonths === 36 ? Math.round(Math.round(($scope.remainingForResearch.year3 || 0) * 0.15 * 100) / 100) : 0
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
                MAX_DAYS_PER_YEAR = 30;
                TOTAL_MIN = 20;
                TOTAL_MAX = 60;
            } else if ($rootScope.proposalDurationMonths === 36) {
                MAX_DAYS_PER_YEAR = 45;
                TOTAL_MIN = 30;
                TOTAL_MAX = 90;
            } else {
                $scope.researchStayError.durationInvalid = true;
            }

            // ---------- Per-year validation ----------
            // First check if user has started entering data (total days > 0)
            const totalDays1 = (Number($scope.budgetResearchStay.daysYear1) || 0) +
                (Number($scope.budgetResearchStay.daysYear2) || 0) +
                (Number($scope.budgetResearchStay.daysYear3) || 0);
            const hasUserStartedEnteringData = totalDays1 > 0;

            function isInvalidYear(days, durationMonths, hasStartedEntering) {
                // Don't validate if duration is not set yet
                if (!durationMonths || (durationMonths !== 24 && durationMonths !== 36)) {
                    return false;
                }

                // Convert days to number, default to 0 if undefined/null
                const daysNum = Number(days) || 0;

                // Don't validate 0 values unless user has started entering data
                if (daysNum === 0) {
                    // For 24 months: 0 is not allowed only if user has started entering data
                    if (durationMonths === 24 && hasStartedEntering) {
                        return true;
                    }
                    // For 36 months: 0 is allowed (but at least 2 years must be non-zero - checked separately)
                    return false;
                }
                // For non-zero values, check range
                if (daysNum > 0) {
                    return daysNum < MIN_DAYS_PER_YEAR || daysNum > MAX_DAYS_PER_YEAR;
                }
                return false;
            }

            $scope.researchStayError.year1 = isInvalidYear($scope.budgetResearchStay.daysYear1, $rootScope.proposalDurationMonths, hasUserStartedEnteringData);

            // Only validate Year 2 if duration is 24 or 36 months
            if ($rootScope.proposalDurationMonths >= 24) {
                $scope.researchStayError.year2 = isInvalidYear($scope.budgetResearchStay.daysYear2, $rootScope.proposalDurationMonths, hasUserStartedEnteringData);
            } else {
                $scope.researchStayError.year2 = false;
            }

            // Only validate Year 3 if duration is 36 months
            if ($rootScope.proposalDurationMonths === 36) {
                $scope.researchStayError.year3 = isInvalidYear($scope.budgetResearchStay.daysYear3, $rootScope.proposalDurationMonths, hasUserStartedEnteringData);
            } else {
                $scope.researchStayError.year3 = false;
            }

            // ---------- Mandatory years validation ----------
            // Only validate mandatory years if user has started entering data (total days > 0)

            // For 24 months: Both Year 1 and Year 2 are mandatory (cannot be 0)
            if ($rootScope.proposalDurationMonths === 24 && hasUserStartedEnteringData) {
                const year1 = Number($scope.budgetResearchStay.daysYear1) || 0;
                const year2 = Number($scope.budgetResearchStay.daysYear2) || 0;
                if (year1 === 0) {
                    $scope.researchStayError.year1 = true;
                }
                if (year2 === 0) {
                    $scope.researchStayError.year2 = true;
                }
            }

            // For 36 months: At least 2 years must be non-zero (can have 0 in one year)
            if ($rootScope.proposalDurationMonths === 36 && hasUserStartedEnteringData) {
                const year1 = Number($scope.budgetResearchStay.daysYear1) || 0;
                const year2 = Number($scope.budgetResearchStay.daysYear2) || 0;
                const year3 = Number($scope.budgetResearchStay.daysYear3) || 0;
                const nonZeroCount = (year1 > 0 ? 1 : 0) + (year2 > 0 ? 1 : 0) + (year3 > 0 ? 1 : 0);
                if (nonZeroCount < 2) {
                    // At least 2 years must be non-zero - mark zero years as error (only if not already invalid from range check)
                    if (year1 === 0) {
                        $scope.researchStayError.year1 = true;
                    }
                    if (year2 === 0) {
                        $scope.researchStayError.year2 = true;
                    }
                    if (year3 === 0) {
                        $scope.researchStayError.year3 = true;
                    }
                }
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
                // Ensure hoursUnit is initialized only if it's truly undefined/null/empty
                // Don't reset if it's already been set from backend data
                if (!staff.hoursUnit || (staff.hoursUnit === '' || staff.hoursUnit === null || staff.hoursUnit === undefined)) {
                    staff.hoursUnit = 'Hour';
                }
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
            hoursUnit: 'Hour',
            totalYear1: 0,
            totalYear2: 0,
            totalYear3: 0,
            totalAmount: 0,
            researchStaffType: 'Research staff ' + nextIndex, // Track the backend type name
            expenseHeadIds: [], // Store Expense_Head__c IDs for deletion (empty for new records)
            description: '' // Single description for all Research Staff items (stored in Expense_Head__c.Description__c)
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

        ApplicantPortal_Contoller.getExpenseHeadLineItemsForWiser($rootScope.apaId, function (result, event) {
            console.log('getExpenseHeadLineItems result:', result);
            console.log('getExpenseHeadLineItems event:', event);
            if (event.status && result != null && result.lineItems != null) {
                console.log('Processing expense heads:', result.expenseHeads);
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
                    'Overheads': { year1: null, year2: null, year3: null }
                };

                // Map to store descriptions by Research Staff name
                let researchStaffDescriptionsMap = {};

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
                            // Load description from Expense_Head__c (use first non-empty description found)
                            // Since all 3 years have the same description, we only need to set it once per Research Staff name
                            if (head.Description__c && head.Description__c !== null && head.Description__c !== undefined && head.Description__c !== '') {
                                // Decode HTML entities in description
                                let decodedDescription = String(head.Description__c)
                                    .replace(/&amp;/g, '&')
                                    .replace(/&#39;/g, '\'')
                                    .replace(/&quot;/g, '"')
                                    .replace(/&lt;/g, '<')
                                    .replace(/&gt;/g, '>')
                                    .replace(/&nbsp;/g, ' ')
                                    .trim();
                                // Set description for this Research Staff name (only if not already set)
                                if (decodedDescription !== '' && (!researchStaffDescriptionsMap[head.Name] || researchStaffDescriptionsMap[head.Name] === '')) {
                                    researchStaffDescriptionsMap[head.Name] = decodedDescription;
                                    console.log('Loaded description for', head.Name, ':', decodedDescription);
                                }
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
                        // Load description from Expense_Description_2__c (only set once, use first non-empty value found)
                        if ((!$scope.budgetResearchStay.description || $scope.budgetResearchStay.description === '') &&
                            item.Expense_Description_2__c != null && item.Expense_Description_2__c !== undefined && item.Expense_Description_2__c !== '') {
                            var descriptionValue = typeof item.Expense_Description_2__c === 'string' ? item.Expense_Description_2__c.trim() : String(item.Expense_Description_2__c);
                            if (descriptionValue !== '') {
                                // Decode HTML entities
                                descriptionValue = descriptionValue
                                    .replace(/&amp;/g, '&')
                                    .replace(/&#39;/g, '\'')
                                    .replace(/&quot;/g, '"')
                                    .replace(/&lt;/g, '<')
                                    .replace(/&gt;/g, '>')
                                    .replace(/&nbsp;/g, ' ');
                                $scope.budgetResearchStay.description = descriptionValue;
                                console.log('Loaded Research Stay description:', descriptionValue);
                            }
                        }
                        // Backend consolidates items, so each item has all three year fields populated
                        // Assuming first item is days, second is cost
                        if (item.Description__c && item.Description__c.toLowerCase().includes('day')) {
                            // Read all three year fields directly from consolidated item
                            if (item.Year1_Expense__c != null && item.Year1_Expense__c != 0) {
                                $scope.budgetResearchStay.daysYear1 = item.Year1_Expense__c || 0;
                            }
                            if (item.Year2_Expense__c != null && item.Year2_Expense__c != 0) {
                                $scope.budgetResearchStay.daysYear2 = item.Year2_Expense__c || 0;
                            }
                            if (item.Year3_Expense__c != null && item.Year3_Expense__c != 0) {
                                $scope.budgetResearchStay.daysYear3 = item.Year3_Expense__c || 0;
                            }
                        } else {
                            // Read all three year fields directly from consolidated item
                            if (item.Year1_Expense__c != null && item.Year1_Expense__c != 0) {
                                $scope.budgetResearchStay.costYear1 = item.Year1_Expense__c || 0;
                            }
                            if (item.Year2_Expense__c != null && item.Year2_Expense__c != 0) {
                                $scope.budgetResearchStay.costYear2 = item.Year2_Expense__c || 0;
                            }
                            if (item.Year3_Expense__c != null && item.Year3_Expense__c != 0) {
                                $scope.budgetResearchStay.costYear3 = item.Year3_Expense__c || 0;
                            }
                        }
                    } else if (expenseType === 'Travel' || expenseType === 'Travel & Networking') {
                        // Load description from Expense_Description_2__c (only set once, use first non-empty value found)
                        if ((!$scope.budgetTravel.description || $scope.budgetTravel.description === '') &&
                            item.Expense_Description_2__c != null && item.Expense_Description_2__c !== undefined && item.Expense_Description_2__c !== '') {
                            var descriptionValue = typeof item.Expense_Description_2__c === 'string' ? item.Expense_Description_2__c.trim() : String(item.Expense_Description_2__c);
                            if (descriptionValue !== '') {
                                // Decode HTML entities
                                descriptionValue = descriptionValue
                                    .replace(/&amp;/g, '&')
                                    .replace(/&#39;/g, '\'')
                                    .replace(/&quot;/g, '"')
                                    .replace(/&lt;/g, '<')
                                    .replace(/&gt;/g, '>')
                                    .replace(/&nbsp;/g, ' ');
                                $scope.budgetTravel.description = descriptionValue;
                                console.log('Loaded Travel description:', descriptionValue);
                            }
                        }
                        // Backend consolidates items, so each item has all three year fields populated
                        // Read all three year fields directly from consolidated item
                        if (item.Year1_Expense__c != null && item.Year1_Expense__c != 0) {
                            $scope.budgetTravel.costYear1 = item.Year1_Expense__c || 0;
                        }
                        if (item.Year2_Expense__c != null && item.Year2_Expense__c != 0) {
                            $scope.budgetTravel.costYear2 = item.Year2_Expense__c || 0;
                        }
                        if (item.Year3_Expense__c != null && item.Year3_Expense__c != 0) {
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
                                hoursUnit: 'Hour',
                                totalYear1: 0, totalYear2: 0, totalYear3: 0, totalAmount: 0,
                                researchStaffType: 'Research staff ' + newIndex, // Track the backend type name
                                expenseHeadIds: [], // Store Expense_Head__c IDs for deletion
                                description: '' // Single description for all Research Staff items (stored in Expense_Head__c.Description__c)
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

                        // Load Description__c from Expense_Head__c (single description for all items)
                        // First try to get from the descriptions map (loaded from Expense_Head__c)
                        // Set description only once per staff record (when processing first line item for that staff)
                        // Use expenseType (which matches head.Name) to get description from map
                        if (!staff.description || staff.description === '') {
                            // Try to get description using expenseType (which should match the head.Name)
                            if (researchStaffDescriptionsMap[expenseType] && researchStaffDescriptionsMap[expenseType] !== null && researchStaffDescriptionsMap[expenseType] !== undefined && researchStaffDescriptionsMap[expenseType] !== '') {
                                var descriptionValue = typeof researchStaffDescriptionsMap[expenseType] === 'string' ? researchStaffDescriptionsMap[expenseType].trim() : String(researchStaffDescriptionsMap[expenseType]);
                                if (descriptionValue !== '') {
                                    staff.description = descriptionValue;
                                    console.log('Set description from map during line item processing for', expenseType, ':', descriptionValue);
                                }
                            }
                            // Also try using staff.researchStaffType as fallback
                            if ((!staff.description || staff.description === '') && staff.researchStaffType && researchStaffDescriptionsMap[staff.researchStaffType]) {
                                var descriptionValue = typeof researchStaffDescriptionsMap[staff.researchStaffType] === 'string' ? researchStaffDescriptionsMap[staff.researchStaffType].trim() : String(researchStaffDescriptionsMap[staff.researchStaffType]);
                                if (descriptionValue !== '') {
                                    staff.description = descriptionValue;
                                    console.log('Set description from map using researchStaffType for', staff.researchStaffType, ':', descriptionValue);
                                }
                            }
                            // Backward compatibility: Also check Expense_Description_2__c from line items (for old data)
                            // If Description__c is not set, try to get it from any of the line items
                            if ((!staff.description || staff.description === '') && item.Expense_Description_2__c != null && item.Expense_Description_2__c !== undefined && item.Expense_Description_2__c !== '') {
                                var descriptionValue = typeof item.Expense_Description_2__c === 'string' ? item.Expense_Description_2__c.trim() : String(item.Expense_Description_2__c);
                                if (descriptionValue !== '') {
                                    staff.description = descriptionValue;
                                    console.log('Set description from Expense_Description_2__c for', expenseType, ':', descriptionValue);
                                }
                            }
                        }

                        // Map line items based on Index__c and Description
                        // Index 1 = No. of Positions, Index 2 = Renumeration/Fellowship, Index 3 = Hours
                        if (item.Index__c === 1 || (item.Description__c && (item.Description__c.includes('No. of Positions') || item.Description__c.includes('Positions')))) {
                            // No. of Positions
                            staff.positionsYear1 = item.Year1_Expense__c || item.Number__c || 0;
                            if ($rootScope.proposalDurationMonths >= 24) {
                                staff.positionsYear2 = item.Year2_Expense__c || item.Number__c || 0;
                            }
                            if ($rootScope.proposalDurationMonths === 36) {
                                staff.positionsYear3 = item.Year3_Expense__c || item.Number__c || 0;
                            }
                        } else if (item.Index__c === 2 || (item.Description__c && (item.Description__c.includes('Cost') || item.Description__c.includes('Renumeration/Fellowship') || item.Description__c.includes('Renumeration') || item.Description__c.includes('Fellowship')) && !item.Description__c.includes('hour'))) {
                            // Cost / Renumeration/Fellowship
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
                            // Load Time_Units__c value from backend
                            // Set the value if it exists in the item (all years should have the same value)
                            // Always set if value exists, since all years should have the same value
                            if (item.Time_Units__c != null && item.Time_Units__c !== undefined && item.Time_Units__c !== '') {
                                var timeUnitValue = typeof item.Time_Units__c === 'string' ? item.Time_Units__c.trim() : String(item.Time_Units__c);
                                if (timeUnitValue !== '') {
                                    staff.hoursUnit = timeUnitValue;
                                    console.log('Loaded Time_Units__c for Research Staff:', staff.researchStaffType, 'Value:', timeUnitValue);
                                }
                            }
                        }
                    } else if (expenseType === 'Consumables' || expenseType === 'Consumables/Materials') {
                        // Load description from Expense_Description_2__c (only set once, use first non-empty value found)
                        if ((!$scope.budgetConsumables.description || $scope.budgetConsumables.description === '') &&
                            item.Expense_Description_2__c != null && item.Expense_Description_2__c !== undefined && item.Expense_Description_2__c !== '') {
                            var descriptionValue = typeof item.Expense_Description_2__c === 'string' ? item.Expense_Description_2__c.trim() : String(item.Expense_Description_2__c);
                            if (descriptionValue !== '') {
                                // Decode HTML entities
                                descriptionValue = descriptionValue
                                    .replace(/&amp;/g, '&')
                                    .replace(/&#39;/g, '\'')
                                    .replace(/&quot;/g, '"')
                                    .replace(/&lt;/g, '<')
                                    .replace(/&gt;/g, '>')
                                    .replace(/&nbsp;/g, ' ');
                                $scope.budgetConsumables.description = descriptionValue;
                                console.log('Loaded Consumables description:', descriptionValue);
                            }
                        }
                        // Backend consolidates items, so each item has all three year fields populated
                        // Read all three year fields directly from consolidated item
                        if (item.Year1_Expense__c != null && item.Year1_Expense__c != 0) {
                            $scope.budgetConsumables.year1 = item.Year1_Expense__c || 0;
                        }
                        if (item.Year2_Expense__c != null && item.Year2_Expense__c != 0) {
                            $scope.budgetConsumables.year2 = item.Year2_Expense__c || 0;
                        }
                        if (item.Year3_Expense__c != null && item.Year3_Expense__c != 0) {
                            $scope.budgetConsumables.year3 = item.Year3_Expense__c || 0;
                        }
                    } else if (expenseType === 'Equipment' || expenseType === 'Equipment & Accessories' || expenseType === 'Minor equipment') {
                        // Load description from Expense_Description_2__c (only set once, use first non-empty value found)
                        if ((!$scope.minorEquipment.description || $scope.minorEquipment.description === '') &&
                            item.Expense_Description_2__c != null && item.Expense_Description_2__c !== undefined && item.Expense_Description_2__c !== '') {
                            var descriptionValue = typeof item.Expense_Description_2__c === 'string' ? item.Expense_Description_2__c.trim() : String(item.Expense_Description_2__c);
                            if (descriptionValue !== '') {
                                // Decode HTML entities
                                descriptionValue = descriptionValue
                                    .replace(/&amp;/g, '&')
                                    .replace(/&#39;/g, '\'')
                                    .replace(/&quot;/g, '"')
                                    .replace(/&lt;/g, '<')
                                    .replace(/&gt;/g, '>')
                                    .replace(/&nbsp;/g, ' ');
                                $scope.minorEquipment.description = descriptionValue;
                                console.log('Loaded Minor Equipment description:', descriptionValue);
                            }
                        }
                        // Backend consolidates items, so each item has all three year fields populated
                        // Read all three year fields directly from consolidated item
                        if (item.Year1_Expense__c != null && item.Year1_Expense__c != 0) {
                            $scope.minorEquipment.year1 = item.Year1_Expense__c || 0;
                        }
                        if (item.Year2_Expense__c != null && item.Year2_Expense__c != 0) {
                            $scope.minorEquipment.year2 = item.Year2_Expense__c || 0;
                        }
                        if (item.Year3_Expense__c != null && item.Year3_Expense__c != 0) {
                            $scope.minorEquipment.year3 = item.Year3_Expense__c || 0;
                        }
                    } else if (expenseType === 'Contingency') {
                        // Load description from Expense_Description_2__c (only set once, use first non-empty value found)
                        if ((!$scope.budgetContingency.description || $scope.budgetContingency.description === '') &&
                            item.Expense_Description_2__c != null && item.Expense_Description_2__c !== undefined && item.Expense_Description_2__c !== '') {
                            var descriptionValue = typeof item.Expense_Description_2__c === 'string' ? item.Expense_Description_2__c.trim() : String(item.Expense_Description_2__c);
                            if (descriptionValue !== '') {
                                // Decode HTML entities
                                descriptionValue = descriptionValue
                                    .replace(/&amp;/g, '&')
                                    .replace(/&#39;/g, '\'')
                                    .replace(/&quot;/g, '"')
                                    .replace(/&lt;/g, '<')
                                    .replace(/&gt;/g, '>')
                                    .replace(/&nbsp;/g, ' ');
                                $scope.budgetContingency.description = descriptionValue;
                                console.log('Loaded Contingency description:', descriptionValue);
                            }
                        }
                        // Backend consolidates items, so each item has all three year fields populated
                        // Read all three year fields directly from consolidated item
                        if (item.Year1_Expense__c != null && item.Year1_Expense__c != 0) {
                            $scope.budgetContingency.year1 = item.Year1_Expense__c || 0;
                        }
                        if (item.Year2_Expense__c != null && item.Year2_Expense__c != 0) {
                            $scope.budgetContingency.year2 = item.Year2_Expense__c || 0;
                        }
                        if (item.Year3_Expense__c != null && item.Year3_Expense__c != 0) {
                            $scope.budgetContingency.year3 = item.Year3_Expense__c || 0;
                        }
                    } else if (expenseType === 'Overheads' || expenseType === 'Projektpauschale') {
                        // Load description from Expense_Description_2__c (only set once, use first non-empty value found)
                        if ((!$scope.budgetOverhead.description || $scope.budgetOverhead.description === '') &&
                            item.Expense_Description_2__c != null && item.Expense_Description_2__c !== undefined && item.Expense_Description_2__c !== '') {
                            var descriptionValue = typeof item.Expense_Description_2__c === 'string' ? item.Expense_Description_2__c.trim() : String(item.Expense_Description_2__c);
                            if (descriptionValue !== '') {
                                // Decode HTML entities
                                descriptionValue = descriptionValue
                                    .replace(/&amp;/g, '&')
                                    .replace(/&#39;/g, '\'')
                                    .replace(/&quot;/g, '"')
                                    .replace(/&lt;/g, '<')
                                    .replace(/&gt;/g, '>')
                                    .replace(/&nbsp;/g, ' ');
                                $scope.budgetOverhead.description = descriptionValue;
                                console.log('Loaded Overhead description:', descriptionValue);
                            }
                        }
                        // Backend consolidates items, so each item has all three year fields populated
                        // Overhead percentage - read all three year fields directly from consolidated item
                        if (item.Year1_Expense__c != null && item.Year1_Expense__c != 0) {
                            $scope.budgetOverhead.percentageYear1 = item.Year1_Expense__c || 0;
                        }
                        if (item.Year2_Expense__c != null && item.Year2_Expense__c != 0) {
                            $scope.budgetOverhead.percentageYear2 = item.Year2_Expense__c || 0;
                        }
                        if (item.Year3_Expense__c != null && item.Year3_Expense__c != 0) {
                            $scope.budgetOverhead.percentageYear3 = item.Year3_Expense__c || 0;
                        }
                    }
                }

                // After processing all line items, ensure descriptions are set from Expense_Head__c for all Research Staff
                console.log('researchStaffDescriptionsMap:', researchStaffDescriptionsMap);
                if ($scope.budgetResearchStaffList && $scope.budgetResearchStaffList.length > 0) {
                    for (let k = 0; k < $scope.budgetResearchStaffList.length; k++) {
                        let staff = $scope.budgetResearchStaffList[k];
                        console.log('Processing staff:', staff.researchStaffType, 'Current description:', staff.description);
                        // If description is not set, try to get it from the descriptions map
                        if ((!staff.description || staff.description === '') && staff.researchStaffType) {
                            if (researchStaffDescriptionsMap[staff.researchStaffType] &&
                                researchStaffDescriptionsMap[staff.researchStaffType] !== null &&
                                researchStaffDescriptionsMap[staff.researchStaffType] !== undefined &&
                                researchStaffDescriptionsMap[staff.researchStaffType] !== '') {
                                var descriptionValue = typeof researchStaffDescriptionsMap[staff.researchStaffType] === 'string'
                                    ? researchStaffDescriptionsMap[staff.researchStaffType].trim()
                                    : String(researchStaffDescriptionsMap[staff.researchStaffType]);
                                if (descriptionValue !== '') {
                                    staff.description = descriptionValue;
                                    console.log('Set description for', staff.researchStaffType, ':', descriptionValue);
                                }
                            } else {
                                console.log('No description found in map for', staff.researchStaffType);
                            }
                        } else {
                            console.log('Description already set for', staff.researchStaffType, ':', staff.description);
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
                        hoursUnit: 'Hour',
                        totalYear1: 0, totalYear2: 0, totalYear3: 0, totalAmount: 0,
                        researchStaffType: 'Research staff 1',
                        expenseHeadIds: [],
                        description: '' // Single description for all Research Staff items (stored in Expense_Head__c.Description__c)
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
                        hoursUnit: 'Hour',
                        totalYear1: 0, totalYear2: 0, totalYear3: 0, totalAmount: 0,
                        researchStaffType: 'Research staff 1',
                        expenseHeadIds: [],
                        description: '' // Single description for all Research Staff items (stored in Expense_Head__c.Description__c)
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
            const isIndia = ($scope.mailingCountry === 'India' ||
                $rootScope.mailingCountry === 'India' ||
                ($scope.accDetails && $scope.accDetails.Contacts &&
                    $scope.accDetails.Contacts[0] &&
                    $scope.accDetails.Contacts[0].MailingCountry === 'India'));
            const maxAmountFormatted = isIndia ? '₹13,00,000' : '€16,000';
            swal("Grand Total Error", "Yearly budget cannot exceed " + maxAmountFormatted + ".", "warning");
            return;
        }

        // Validate description fields length (max 250 characters)
        if ($scope.budgetResearchStaffList && $scope.budgetResearchStaffList.length > 0) {
            for (let i = 0; i < $scope.budgetResearchStaffList.length; i++) {
                let staff = $scope.budgetResearchStaffList[i];
                let staffNumber = i + 1;

                if (staff.description && staff.description.length > 250) {
                    swal("Description Length Error",
                        "Research Staff " + staffNumber + " - Description cannot exceed 250 characters. Current length: " + staff.description.length + " characters.",
                        "warning");
                    return;
                }
            }
        }

        // Validate other expense item descriptions
        if ($scope.budgetResearchStay.description && $scope.budgetResearchStay.description.length > 250) {
            swal("Description Length Error", "Research Stay - Description cannot exceed 250 characters. Current length: " + $scope.budgetResearchStay.description.length + " characters.", "warning");
            return;
        }
        if ($scope.budgetTravel.description && $scope.budgetTravel.description.length > 250) {
            swal("Description Length Error", "Travel - Description cannot exceed 250 characters. Current length: " + $scope.budgetTravel.description.length + " characters.", "warning");
            return;
        }
        if ($scope.budgetOverhead.description && $scope.budgetOverhead.description.length > 250) {
            swal("Description Length Error", "Overhead - Description cannot exceed 250 characters. Current length: " + $scope.budgetOverhead.description.length + " characters.", "warning");
            return;
        }
        if ($scope.budgetConsumables.description && $scope.budgetConsumables.description.length > 250) {
            swal("Description Length Error", "Consumables - Description cannot exceed 250 characters. Current length: " + $scope.budgetConsumables.description.length + " characters.", "warning");
            return;
        }
        if ($scope.minorEquipment.description && $scope.minorEquipment.description.length > 250) {
            swal("Description Length Error", "Minor Equipment - Description cannot exceed 250 characters. Current length: " + $scope.minorEquipment.description.length + " characters.", "warning");
            return;
        }
        if ($scope.budgetContingency.description && $scope.budgetContingency.description.length > 250) {
            swal("Description Length Error", "Contingency - Description cannot exceed 250 characters. Current length: " + $scope.budgetContingency.description.length + " characters.", "warning");
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
                'Overheads': { year1: null, year2: null, year3: null }
            };
        }

        // Research Stay - days - Create separate line items for each year
        // Year 1
        let researchStayDaysYear1Item = {
            Index__c: 1,
            Description__c: 'Research Stay - No. of days',
            Expense_Description_2__c: $scope.budgetResearchStay.description || '', // Store description in Expense_Description_2__c
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
                Expense_Description_2__c: $scope.budgetResearchStay.description || '', // Store description in Expense_Description_2__c
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
                Expense_Description_2__c: $scope.budgetResearchStay.description || '', // Store description in Expense_Description_2__c
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
            Description__c: 'Research Stay Cost',
            //Expense_Description_2__c: $scope.budgetResearchStay.description || '', // Store description in Expense_Description_2__c
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
                Description__c: 'Research Stay Cost',
                //Expense_Description_2__c: $scope.budgetResearchStay.description || '', // Store description in Expense_Description_2__c
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
                Description__c: 'Research Stay Cost',
                //Expense_Description_2__c: $scope.budgetResearchStay.description || '', // Store description in Expense_Description_2__c
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
            Description__c: 'Travel Cost per visit',
            Expense_Description_2__c: $scope.budgetTravel.description || '', // Store description in Expense_Description_2__c
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
                Description__c: 'Travel Cost per visit',
                Expense_Description_2__c: $scope.budgetTravel.description || '', // Store description in Expense_Description_2__c
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
                Description__c: 'Travel Cost per visit',
                Expense_Description_2__c: $scope.budgetTravel.description || '', // Store description in Expense_Description_2__c
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
                    // Description__c: 'No. of Positions|Y1Total:' + year1Total + '|Y2Total:' + year2Total + '|Y3Total:' + year3Total,
                    Description__c: 'No. of Positions',
                    Number__c: staff.positionsYear1 || 0,
                    Year1_Expense__c: staff.positionsYear1 || 0,
                    Year2_Expense__c: 0,
                    Year3_Expense__c: 0,
                    Total_Expense__c: staff.positionsYear1 || 0,
                    Expense_Type__c: researchStaffType,
                    Expense_Description_2__c: staff.description || '' // Store description in Expense_Description_2__c for backend to use when creating Expense_Head__c
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
                        //Description__c: 'No. of Positions|Y1Total:' + year1Total + '|Y2Total:' + year2Total + '|Y3Total:' + year3Total,
                        Description__c: 'No. of Positions',
                        Expense_Description_2__c: staff.description || '', // Store description in Expense_Description_2__c
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
                        //Description__c: 'No. of Positions|Y1Total:' + year1Total + '|Y2Total:' + year2Total + '|Y3Total:' + year3Total,
                        Description__c: 'No. of Positions',
                        Expense_Description_2__c: staff.description || '', // Store description in Expense_Description_2__c
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

                // Child Line Item 2: Cost / Renumeration/Fellowship
                // Year 1
                let costYear1Item = {
                    Index__c: 2,
                    Description__c: 'Renumeration/Fellowship',
                    // Expense_Description_2__c: staff.description || '', // Store description in Expense_Description_2__c - COMMENTED: Only store on No. of Positions
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
                        Description__c: 'Renumeration/Fellowship',
                        // Expense_Description_2__c: staff.description || '', // Store description in Expense_Description_2__c - COMMENTED: Only store on No. of Positions
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
                        Description__c: 'Renumeration/Fellowship',
                        // Expense_Description_2__c: staff.description || '', // Store description in Expense_Description_2__c - COMMENTED: Only store on No. of Positions
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
                    // Expense_Description_2__c: staff.description || '', // Store description in Expense_Description_2__c - COMMENTED: Only store on No. of Positions
                    Person_Month__c: staff.hoursYear1 || 0,
                    Year1_Expense__c: staff.hoursYear1 || 0,
                    Year2_Expense__c: 0,
                    Year3_Expense__c: 0,
                    Total_Expense__c: staff.hoursYear1 || 0,
                    Time_Units__c: staff.hoursUnit || 'Hour',
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
                        // Expense_Description_2__c: staff.description || '', // Store description in Expense_Description_2__c - COMMENTED: Only store on No. of Positions
                        Person_Month__c: staff.hoursYear2 || 0,
                        Year1_Expense__c: 0,
                        Year2_Expense__c: staff.hoursYear2 || 0,
                        Year3_Expense__c: 0,
                        Total_Expense__c: staff.hoursYear2 || 0,
                        Time_Units__c: staff.hoursUnit || 'Hour',
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
                        // Expense_Description_2__c: staff.description || '', // Store description in Expense_Description_2__c - COMMENTED: Only store on No. of Positions
                        Person_Month__c: staff.hoursYear3 || 0,
                        Year1_Expense__c: 0,
                        Year2_Expense__c: 0,
                        Year3_Expense__c: staff.hoursYear3 || 0,
                        Total_Expense__c: staff.hoursYear3 || 0,
                        Time_Units__c: staff.hoursUnit || 'Hour',
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
            Expense_Description_2__c: $scope.budgetConsumables.description || '', // Store description in Expense_Description_2__c
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
                Expense_Description_2__c: $scope.budgetConsumables.description || '', // Store description in Expense_Description_2__c
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
                Expense_Description_2__c: $scope.budgetConsumables.description || '', // Store description in Expense_Description_2__c
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
            Expense_Description_2__c: $scope.minorEquipment.description || '', // Store description in Expense_Description_2__c
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
                Expense_Description_2__c: $scope.minorEquipment.description || '', // Store description in Expense_Description_2__c
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
                Expense_Description_2__c: $scope.minorEquipment.description || '', // Store description in Expense_Description_2__c
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
            Expense_Description_2__c: $scope.budgetContingency.description || '', // Store description in Expense_Description_2__c
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
                Expense_Description_2__c: $scope.budgetContingency.description || '', // Store description in Expense_Description_2__c
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
                Expense_Description_2__c: $scope.budgetContingency.description || '', // Store description in Expense_Description_2__c
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
            Expense_Description_2__c: $scope.budgetOverhead.description || '', // Store description in Expense_Description_2__c
            Year1_Expense__c: $scope.budgetOverhead.percentageYear1 || 0,
            Year2_Expense__c: 0,
            Year3_Expense__c: 0,
            Total_Expense__c: $scope.budgetOverhead.percentageYear1 || 0,
            Expense_Type__c: 'Overheads'
        };
        if ($scope.expenseHeadIds['Overheads'] && $scope.expenseHeadIds['Overheads'].year1) {
            overheadYear1Item.Expense_Head__c = $scope.expenseHeadIds['Overheads'].year1;
        }
        allExpenseLineItems.push(overheadYear1Item);

        // Year 2 - only if duration is 24 or 36 months
        if ($rootScope.proposalDurationMonths >= 24) {
            let overheadYear2Item = {
                Description__c: 'Overheads Percentage',
                Expense_Description_2__c: $scope.budgetOverhead.description || '', // Store description in Expense_Description_2__c
                Year1_Expense__c: 0,
                Year2_Expense__c: $scope.budgetOverhead.percentageYear2 || 0,
                Year3_Expense__c: 0,
                Total_Expense__c: $scope.budgetOverhead.percentageYear2 || 0,
                Expense_Type__c: 'Overheads'
            };
            if ($scope.expenseHeadIds['Overheads'] && $scope.expenseHeadIds['Overheads'].year2) {
                overheadYear2Item.Expense_Head__c = $scope.expenseHeadIds['Overheads'].year2;
            }
            allExpenseLineItems.push(overheadYear2Item);
        }

        // Year 3 - only if duration is 36 months
        if ($rootScope.proposalDurationMonths === 36) {
            let overheadYear3Item = {
                Description__c: 'Overheads Percentage',
                Expense_Description_2__c: $scope.budgetOverhead.description || '', // Store description in Expense_Description_2__c
                Year1_Expense__c: 0,
                Year2_Expense__c: 0,
                Year3_Expense__c: $scope.budgetOverhead.percentageYear3 || 0,
                Total_Expense__c: $scope.budgetOverhead.percentageYear3 || 0,
                Expense_Type__c: 'Overheads'
            };
            if ($scope.expenseHeadIds['Overheads'] && $scope.expenseHeadIds['Overheads'].year3) {
                overheadYear3Item.Expense_Head__c = $scope.expenseHeadIds['Overheads'].year3;
            }
            allExpenseLineItems.push(overheadYear3Item);
        }

        // Prepare Expense_Head__c updates for Research Staff descriptions
        let expenseHeadUpdates = [];
        if ($scope.budgetResearchStaffList && $scope.budgetResearchStaffList.length > 0) {
            for (let i = 0; i < $scope.budgetResearchStaffList.length; i++) {
                let staff = $scope.budgetResearchStaffList[i];
                if (staff.description && staff.description !== null && staff.description !== undefined && staff.description !== '') {
                    // Get Expense_Head__c IDs for this Research Staff
                    let year1HeadId = (staff.expenseHeadIds && staff.expenseHeadIds.length > 0) ? staff.expenseHeadIds[0] : null;
                    let year2HeadId = (staff.expenseHeadIds && staff.expenseHeadIds.length > 1) ? staff.expenseHeadIds[1] : null;
                    let year3HeadId = (staff.expenseHeadIds && staff.expenseHeadIds.length > 2) ? staff.expenseHeadIds[2] : null;

                    // Add updates for all years (will be updated after line items are saved)
                    if (year1HeadId && year1HeadId !== 'null' && year1HeadId !== 'undefined') {
                        expenseHeadUpdates.push({
                            Id: year1HeadId,
                            Description__c: staff.description
                        });
                    }
                    if (year2HeadId && year2HeadId !== 'null' && year2HeadId !== 'undefined') {
                        expenseHeadUpdates.push({
                            Id: year2HeadId,
                            Description__c: staff.description
                        });
                    }
                    if (year3HeadId && year3HeadId !== 'null' && year3HeadId !== 'undefined') {
                        expenseHeadUpdates.push({
                            Id: year3HeadId,
                            Description__c: staff.description
                        });
                    }
                }
            }
        }

        // Prepare APA update object (include Year 1/2/3 Expense totals and total yearly expense from Expense Table grand total row)
        var updatedApa = {
            'Id': $rootScope.apaId,
            'Year_1_Expense__c': $scope.grandTotal && $scope.grandTotal.year1 != null ? $scope.grandTotal.year1 : 0,
            'Year_2_Expense__c': $scope.grandTotal && $scope.grandTotal.year2 != null ? $scope.grandTotal.year2 : 0,
            'Year_3_Expense__c': $scope.grandTotal && $scope.grandTotal.year3 != null ? $scope.grandTotal.year3 : 0,
            'Total_Yearly_Expense__c': $scope.grandTotal && $scope.grandTotal.total != null ? $scope.grandTotal.total : 0,
            // Add Total Research Heads fields to APA instead of Expense Head
            'Total_Research_Heads_Year_1__c': $scope.totalResearchHeads && $scope.totalResearchHeads.year1 != null ? $scope.totalResearchHeads.year1 : 0,
            'Total_Research_Heads_Year_2__c': $scope.totalResearchHeads && $scope.totalResearchHeads.year2 != null ? $scope.totalResearchHeads.year2 : 0,
            'Total_Research_Heads_Year_3__c': $scope.totalResearchHeads && $scope.totalResearchHeads.year3 != null ? $scope.totalResearchHeads.year3 : 0,
            'Total_Research_Heads__c': $scope.totalResearchHeads && $scope.totalResearchHeads.total != null ? $scope.totalResearchHeads.total : 0
        };

        // Show spinner on button
        $("#btnPreview").html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Please wait...');
        $("#btnPreview").prop('disabled', true);

        // Save using ApplicantPortal_Contoller
        ApplicantPortal_Contoller.createExpenseWithHeadAndLineItemsForWiser(
            allExpenseLineItems, $rootScope.apaId, updatedApa,
            function (result, event) {
                // Restore button
                $("#btnPreview").html('<i class="fa-solid fa-check me-2"></i>Save and Next');
                $("#btnPreview").prop('disabled', false);

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
                    let saveResult = null;
                    try {
                        // Handle HTML-encoded JSON (common in Visualforce)
                        let decodedResult = result;
                        if (result && result.includes('&quot;')) {
                            // Create a temporary div to decode HTML entities
                            let tempDiv = document.createElement('div');
                            tempDiv.innerHTML = result;
                            decodedResult = tempDiv.textContent || tempDiv.innerText || result;
                        }

                        saveResult = JSON.parse(decodedResult);
                        console.log('=== DEBUG: Raw Apex Result ===');
                        console.log('Raw result:', result);
                        console.log('Decoded result:', decodedResult);
                        console.log('Parsed saveResult:', saveResult);
                        console.log('saveResult.status:', saveResult ? saveResult.status : 'undefined');
                        console.log('saveResult.researchStaffHeadIds:', saveResult ? saveResult.researchStaffHeadIds : 'undefined');
                        console.log('saveResult.expenseHeadIds:', saveResult ? saveResult.expenseHeadIds : 'undefined');
                        console.log('=== END DEBUG ===');
                    } catch (e) {
                        // If JSON parsing fails, assume it's a simple success/error string
                        console.log('Could not parse save result as JSON: ' + e.message);
                        console.log('Raw result that failed to parse:', result);
                    }

                    // Prepare Expense_Head__c updates with descriptions
                    let finalExpenseHeadUpdates = [];

                    if (saveResult && saveResult.status === 'success' && saveResult.researchStaffHeadIds) {
                        // Update expenseHeadIds for each Research Staff record and prepare Expense_Head__c updates
                        if ($scope.budgetResearchStaffList && $scope.budgetResearchStaffList.length > 0) {
                            for (let i = 0; i < $scope.budgetResearchStaffList.length; i++) {
                                let staff = $scope.budgetResearchStaffList[i];
                                let researchStaffType = staff.researchStaffType || ('Research staff ' + (i + 1));

                                // Get Expense_Head__c IDs for this Research Staff from backend response
                                // Try exact match first
                                let headIds = null;
                                if (saveResult.researchStaffHeadIds[researchStaffType]) {
                                    headIds = saveResult.researchStaffHeadIds[researchStaffType];
                                } else {
                                    // If exact match fails, try to find by iterating through all keys
                                    // This handles cases where the backend might return slightly different naming
                                    // Try matching by index (e.g., "Research staff 1" should match staff at index 0)
                                    let expectedIndex = i + 1;
                                    for (let key in saveResult.researchStaffHeadIds) {
                                        if (key && (key === researchStaffType ||
                                            key.toLowerCase().includes('research staff') &&
                                            (key.includes(String(expectedIndex)) ||
                                                (i === 0 && !key.match(/\d/))))) {
                                            headIds = saveResult.researchStaffHeadIds[key];
                                            console.log('Matched Research Staff by key:', key, 'for staff type:', researchStaffType);
                                            break;
                                        }
                                    }

                                    // If still not found, try to match by position (first key for first staff, etc.)
                                    if (!headIds) {
                                        let keys = Object.keys(saveResult.researchStaffHeadIds);
                                        if (keys.length > i && keys[i]) {
                                            headIds = saveResult.researchStaffHeadIds[keys[i]];
                                            console.log('Matched Research Staff by position:', keys[i], 'for staff index:', i);
                                        }
                                    }
                                }

                                if (headIds && Array.isArray(headIds)) {
                                    // Store IDs in correct order: [Year1HeadId, Year2HeadId, Year3HeadId]
                                    // Keep null values to maintain array indices
                                    staff.expenseHeadIds = [
                                        headIds[0] || null,
                                        headIds[1] || null,
                                        headIds[2] || null
                                    ];

                                    // Add Expense_Head__c updates with description and total amounts for newly created heads
                                    // CRITICAL: Always update description if it exists, even for first-time creation
                                    console.log('=== DEBUG: Research Staff Data ===');
                                    console.log('Research Staff Type:', researchStaffType);
                                    console.log('Staff data:', staff);
                                    console.log('Staff totals:', {
                                        totalYear1: staff.totalYear1,
                                        totalYear2: staff.totalYear2,
                                        totalYear3: staff.totalYear3,
                                        totalAmount: staff.totalAmount
                                    });
                                    console.log('Head IDs:', headIds);
                                    console.log('=== END DEBUG ===');

                                    if (staff.description && staff.description !== null && staff.description !== undefined && staff.description !== '') {
                                        if (headIds[0] && headIds[0] !== 'null' && headIds[0] !== 'undefined' && headIds[0] !== null) {
                                            let updateObject = {
                                                Id: headIds[0],
                                                Description__c: staff.description,
                                                Amount_For_Research_Staff_Year_1__c: staff.totalYear1 || 0,
                                                Amount_For_Research_Staff_Year_2__c: staff.totalYear2 || 0,
                                                Amount_For_Research_Staff_Year_3__c: staff.totalYear3 || 0,
                                                Amount_For_Research_Staff__c: staff.totalAmount || 0
                                            };

                                            // Only add Total_Amount_for_All_Research_Staff fields if this is the last Research Staff
                                            if (i === $scope.budgetResearchStaffList.length - 1) {
                                                updateObject.Total_Amount_for_All_Research_Staff_Y1__c = $scope.budgetResearchStaff.totalYear1 || 0;
                                                updateObject.Total_Amount_for_All_Research_Staff_Y2__c = $scope.budgetResearchStaff.totalYear2 || 0;
                                                updateObject.Total_Amount_for_All_Research_Staff_Y3__c = $scope.budgetResearchStaff.totalYear3 || 0;
                                                updateObject.Total_Amount_for_All_Research_Staff__c = $scope.budgetResearchStaff.totalAmount || 0;
                                                // Mark this as the Last Research Staff record
                                                updateObject.Last_Research_Staff_For_All_RS_Total_Amt__c = true;
                                                console.log('Adding Total_Amount_for_All_Research_Staff fields to LAST Research Staff:', researchStaffType);
                                            }

                                            finalExpenseHeadUpdates.push(updateObject);
                                            console.log('Added all total fields update for Year 1 head:', headIds[0]);
                                        }
                                        if (headIds[1] && headIds[1] !== 'null' && headIds[1] !== 'undefined' && headIds[1] !== null) {
                                            let updateObject = {
                                                Id: headIds[1],
                                                Description__c: staff.description,
                                                Amount_For_Research_Staff_Year_1__c: staff.totalYear1 || 0,
                                                Amount_For_Research_Staff_Year_2__c: staff.totalYear2 || 0,
                                                Amount_For_Research_Staff_Year_3__c: staff.totalYear3 || 0,
                                                Amount_For_Research_Staff__c: staff.totalAmount || 0
                                            };

                                            // Only add Total_Amount_for_All_Research_Staff fields if this is the last Research Staff
                                            if (i === $scope.budgetResearchStaffList.length - 1) {
                                                updateObject.Total_Amount_for_All_Research_Staff_Y1__c = $scope.budgetResearchStaff.totalYear1 || 0;
                                                updateObject.Total_Amount_for_All_Research_Staff_Y2__c = $scope.budgetResearchStaff.totalYear2 || 0;
                                                updateObject.Total_Amount_for_All_Research_Staff_Y3__c = $scope.budgetResearchStaff.totalYear3 || 0;
                                                updateObject.Total_Amount_for_All_Research_Staff__c = $scope.budgetResearchStaff.totalAmount || 0;
                                                // Mark this as the Last Research Staff record
                                                updateObject.Last_Research_Staff_For_All_RS_Total_Amt__c = true;
                                            }

                                            finalExpenseHeadUpdates.push(updateObject);
                                            console.log('Added all total fields update for Year 2 head:', headIds[1]);
                                        }
                                        if (headIds[2] && headIds[2] !== 'null' && headIds[2] !== 'undefined' && headIds[2] !== null) {
                                            let updateObject = {
                                                Id: headIds[2],
                                                Description__c: staff.description,
                                                Amount_For_Research_Staff_Year_1__c: staff.totalYear1 || 0,
                                                Amount_For_Research_Staff_Year_2__c: staff.totalYear2 || 0,
                                                Amount_For_Research_Staff_Year_3__c: staff.totalYear3 || 0,
                                                Amount_For_Research_Staff__c: staff.totalAmount || 0
                                            };

                                            // Only add Total_Amount_for_All_Research_Staff fields if this is the last Research Staff
                                            if (i === $scope.budgetResearchStaffList.length - 1) {
                                                updateObject.Total_Amount_for_All_Research_Staff_Y1__c = $scope.budgetResearchStaff.totalYear1 || 0;
                                                updateObject.Total_Amount_for_All_Research_Staff_Y2__c = $scope.budgetResearchStaff.totalYear2 || 0;
                                                updateObject.Total_Amount_for_All_Research_Staff_Y3__c = $scope.budgetResearchStaff.totalYear3 || 0;
                                                updateObject.Total_Amount_for_All_Research_Staff__c = $scope.budgetResearchStaff.totalAmount || 0;
                                                // Mark this as the Last Research Staff record
                                                updateObject.Last_Research_Staff_For_All_RS_Total_Amt__c = true;
                                            }

                                            finalExpenseHeadUpdates.push(updateObject);
                                            console.log('Added all total fields update for Year 3 head:', headIds[2]);
                                        }
                                    } else {
                                        console.log('No description to update for Research Staff:', researchStaffType);
                                        // Still update total amounts even if no description
                                        if (headIds[0] && headIds[0] !== 'null' && headIds[0] !== 'undefined' && headIds[0] !== null) {
                                            let updateObject = {
                                                Id: headIds[0],
                                                Amount_For_Research_Staff_Year_1__c: staff.totalYear1 || 0,
                                                Amount_For_Research_Staff_Year_2__c: staff.totalYear2 || 0,
                                                Amount_For_Research_Staff_Year_3__c: staff.totalYear3 || 0,
                                                Amount_For_Research_Staff__c: staff.totalAmount || 0
                                            };

                                            // Only add Total_Amount_for_All_Research_Staff fields if this is the last Research Staff
                                            if (i === $scope.budgetResearchStaffList.length - 1) {
                                                updateObject.Total_Amount_for_All_Research_Staff_Y1__c = $scope.budgetResearchStaff.totalYear1 || 0;
                                                updateObject.Total_Amount_for_All_Research_Staff_Y2__c = $scope.budgetResearchStaff.totalYear2 || 0;
                                                updateObject.Total_Amount_for_All_Research_Staff_Y3__c = $scope.budgetResearchStaff.totalYear3 || 0;
                                                updateObject.Total_Amount_for_All_Research_Staff__c = $scope.budgetResearchStaff.totalAmount || 0;
                                                // Mark this as the Last Research Staff record
                                                updateObject.Last_Research_Staff_For_All_RS_Total_Amt__c = true;
                                            }

                                            // Add Total_Research_Heads fields
                                            updateObject.Total_Research_Heads_Year_1__c = $scope.totalResearchHeads.year1 || 0;
                                            updateObject.Total_Research_Heads_Year_2__c = $scope.totalResearchHeads.year2 || 0;
                                            updateObject.Total_Research_Heads_Year_3__c = $scope.totalResearchHeads.year3 || 0;
                                            updateObject.Total_Research_Heads__c = $scope.totalResearchHeads.total || 0;

                                            finalExpenseHeadUpdates.push(updateObject);
                                            console.log('Added all total fields update (no description) for Year 1 head:', headIds[0]);
                                        }
                                        if (headIds[1] && headIds[1] !== 'null' && headIds[1] !== 'undefined' && headIds[1] !== null) {
                                            let updateObject = {
                                                Id: headIds[1],
                                                Amount_For_Research_Staff_Year_1__c: staff.totalYear1 || 0,
                                                Amount_For_Research_Staff_Year_2__c: staff.totalYear2 || 0,
                                                Amount_For_Research_Staff_Year_3__c: staff.totalYear3 || 0,
                                                Amount_For_Research_Staff__c: staff.totalAmount || 0
                                            };

                                            // Only add Total_Amount_for_All_Research_Staff fields if this is the last Research Staff
                                            if (i === $scope.budgetResearchStaffList.length - 1) {
                                                updateObject.Total_Amount_for_All_Research_Staff_Y1__c = $scope.budgetResearchStaff.totalYear1 || 0;
                                                updateObject.Total_Amount_for_All_Research_Staff_Y2__c = $scope.budgetResearchStaff.totalYear2 || 0;
                                                updateObject.Total_Amount_for_All_Research_Staff_Y3__c = $scope.budgetResearchStaff.totalYear3 || 0;
                                                updateObject.Total_Amount_for_All_Research_Staff__c = $scope.budgetResearchStaff.totalAmount || 0;
                                                // Mark this as the Last Research Staff record
                                                updateObject.Last_Research_Staff_For_All_RS_Total_Amt__c = true;
                                            }

                                            // Add Total_Research_Heads fields
                                            updateObject.Total_Research_Heads_Year_1__c = $scope.totalResearchHeads.year1 || 0;
                                            updateObject.Total_Research_Heads_Year_2__c = $scope.totalResearchHeads.year2 || 0;
                                            updateObject.Total_Research_Heads_Year_3__c = $scope.totalResearchHeads.year3 || 0;
                                            updateObject.Total_Research_Heads__c = $scope.totalResearchHeads.total || 0;

                                            finalExpenseHeadUpdates.push(updateObject);
                                            console.log('Added all total fields update (no description) for Year 2 head:', headIds[1]);
                                        }
                                        if (headIds[2] && headIds[2] !== 'null' && headIds[2] !== 'undefined' && headIds[2] !== null) {
                                            let updateObject = {
                                                Id: headIds[2],
                                                Amount_For_Research_Staff_Year_1__c: staff.totalYear1 || 0,
                                                Amount_For_Research_Staff_Year_2__c: staff.totalYear2 || 0,
                                                Amount_For_Research_Staff_Year_3__c: staff.totalYear3 || 0,
                                                Amount_For_Research_Staff__c: staff.totalAmount || 0
                                            };

                                            // Only add Total_Amount_for_All_Research_Staff fields if this is the last Research Staff
                                            if (i === $scope.budgetResearchStaffList.length - 1) {
                                                updateObject.Total_Amount_for_All_Research_Staff_Y1__c = $scope.budgetResearchStaff.totalYear1 || 0;
                                                updateObject.Total_Amount_for_All_Research_Staff_Y2__c = $scope.budgetResearchStaff.totalYear2 || 0;
                                                updateObject.Total_Amount_for_All_Research_Staff_Y3__c = $scope.budgetResearchStaff.totalYear3 || 0;
                                                updateObject.Total_Amount_for_All_Research_Staff__c = $scope.budgetResearchStaff.totalAmount || 0;
                                                // Mark this as the Last Research Staff record
                                                updateObject.Last_Research_Staff_For_All_RS_Total_Amt__c = true;
                                            }

                                            // Add Total_Research_Heads fields
                                            updateObject.Total_Research_Heads_Year_1__c = $scope.totalResearchHeads.year1 || 0;
                                            updateObject.Total_Research_Heads_Year_2__c = $scope.totalResearchHeads.year2 || 0;
                                            updateObject.Total_Research_Heads_Year_3__c = $scope.totalResearchHeads.year3 || 0;
                                            updateObject.Total_Research_Heads__c = $scope.totalResearchHeads.total || 0;

                                            finalExpenseHeadUpdates.push(updateObject);
                                            console.log('Added all total fields update (no description) for Year 3 head:', headIds[2]);
                                        }
                                    }
                                } else {
                                    console.warn('Could not find Expense_Head__c IDs for Research Staff:', researchStaffType, 'in save result:', saveResult.researchStaffHeadIds);
                                }
                            }
                        }
                    }

                    // Add total field updates for newly created Research Stay, Travel, and Overheads Expense Head records
                    // These records were just created and their IDs are in the saveResult
                    console.log('=== DEBUG: Checking expenseHeadIds condition ===');
                    console.log('saveResult exists:', saveResult != null);
                    console.log('saveResult.status:', saveResult ? saveResult.status : 'undefined');
                    console.log('saveResult.expenseHeadIds exists:', saveResult && saveResult.expenseHeadIds);
                    if (saveResult && saveResult.status === 'success' && saveResult.expenseHeadIds) {
                        console.log('=== DEBUG: Inside expenseHeadIds condition ===');
                        console.log('saveResult.expenseHeadIds:', saveResult.expenseHeadIds);

                        // Process Research Stay Expense Heads
                        if (saveResult.expenseHeadIds['Research stay']) {
                            let researchStayIds = saveResult.expenseHeadIds['Research stay'];
                            if (researchStayIds.year1) {
                                finalExpenseHeadUpdates.push({
                                    Id: researchStayIds.year1
                                    // Research_Stay_Travel_Total and Total_Research_Amount_Remaining fields removed - now stored only in Travel Expense Head
                                });
                                console.log('Added total fields to newly created Research Stay Year 1:', researchStayIds.year1);
                            }
                            if (researchStayIds.year2) {
                                finalExpenseHeadUpdates.push({
                                    Id: researchStayIds.year2
                                    // Research_Stay_Travel_Total and Total_Research_Amount_Remaining fields removed - now stored only in Travel Expense Head
                                });
                                console.log('Added total fields to newly created Research Stay Year 2:', researchStayIds.year2);
                            }
                            if (researchStayIds.year3) {
                                finalExpenseHeadUpdates.push({
                                    Id: researchStayIds.year3
                                    // Research_Stay_Travel_Total and Total_Research_Amount_Remaining fields removed - now stored only in Travel Expense Head
                                });
                                console.log('Added total fields to newly created Research Stay Year 3:', researchStayIds.year3);
                            }
                        }

                        // Process Travel Expense Heads
                        if (saveResult.expenseHeadIds['Travel']) {
                            let travelIds = saveResult.expenseHeadIds['Travel'];
                            if (travelIds.year1) {
                                finalExpenseHeadUpdates.push({
                                    Id: travelIds.year1,
                                    Research_Stay_Travel_Total_Year_1__c: $scope.researchStayTravelTotal.year1 || 0,
                                    Research_Stay_Travel_Total_Year_2__c: $scope.researchStayTravelTotal.year2 || 0,
                                    Research_Stay_Travel_Total_Year_3__c: $scope.researchStayTravelTotal.year3 || 0,
                                    Research_Stay_Travel_Total__c: $scope.researchStayTravelTotal.total || 0,
                                    Total_Research_Amount_Remaining_Year_1__c: $scope.totalResearchAmount.year1 || 0,
                                    Total_Research_Amount_Remaining_Year_2__c: $scope.totalResearchAmount.year2 || 0,
                                    Total_Research_Amount_Remaining_Year_3__c: $scope.totalResearchAmount.year3 || 0,
                                    Total_Research_Amount__c: $scope.totalResearchAmount.total || 0
                                    // Total_Research_Heads fields removed - now stored in APA
                                });
                                console.log('Added total fields to newly created Travel Year 1:', travelIds.year1);
                            }
                            if (travelIds.year2) {
                                finalExpenseHeadUpdates.push({
                                    Id: travelIds.year2,
                                    Research_Stay_Travel_Total_Year_1__c: $scope.researchStayTravelTotal.year1 || 0,
                                    Research_Stay_Travel_Total_Year_2__c: $scope.researchStayTravelTotal.year2 || 0,
                                    Research_Stay_Travel_Total_Year_3__c: $scope.researchStayTravelTotal.year3 || 0,
                                    Research_Stay_Travel_Total__c: $scope.researchStayTravelTotal.total || 0,
                                    Total_Research_Amount_Remaining_Year_1__c: $scope.totalResearchAmount.year1 || 0,
                                    Total_Research_Amount_Remaining_Year_2__c: $scope.totalResearchAmount.year2 || 0,
                                    Total_Research_Amount_Remaining_Year_3__c: $scope.totalResearchAmount.year3 || 0,
                                    Total_Research_Amount__c: $scope.totalResearchAmount.total || 0
                                    // Total_Research_Heads fields removed - now stored in APA
                                });
                                console.log('Added total fields to newly created Travel Year 2:', travelIds.year2);
                            }
                            if (travelIds.year3) {
                                finalExpenseHeadUpdates.push({
                                    Id: travelIds.year3,
                                    Research_Stay_Travel_Total_Year_1__c: $scope.researchStayTravelTotal.year1 || 0,
                                    Research_Stay_Travel_Total_Year_2__c: $scope.researchStayTravelTotal.year2 || 0,
                                    Research_Stay_Travel_Total_Year_3__c: $scope.researchStayTravelTotal.year3 || 0,
                                    Research_Stay_Travel_Total__c: $scope.researchStayTravelTotal.total || 0,
                                    Total_Research_Amount_Remaining_Year_1__c: $scope.totalResearchAmount.year1 || 0,
                                    Total_Research_Amount_Remaining_Year_2__c: $scope.totalResearchAmount.year2 || 0,
                                    Total_Research_Amount_Remaining_Year_3__c: $scope.totalResearchAmount.year3 || 0,
                                    Total_Research_Amount__c: $scope.totalResearchAmount.total || 0
                                    // Total_Research_Heads fields removed - now stored in APA
                                });
                                console.log('Added total fields to newly created Travel Year 3:', travelIds.year3);
                            }
                        }

                        // Process Overheads Expense Heads
                        if (saveResult.expenseHeadIds['Overheads']) {
                            let overheadIds = saveResult.expenseHeadIds['Overheads'];
                            if (overheadIds.year1) {
                                finalExpenseHeadUpdates.push({
                                    Id: overheadIds.year1,
                                    Overhead_Amount_Year_1__c: $scope.budgetOverhead.amountYear1 || 0,
                                    Overhead_Amount_Year_2__c: $scope.budgetOverhead.amountYear2 || 0,
                                    Overhead_Amount_Year_3__c: $scope.budgetOverhead.amountYear3 || 0,
                                    Overhead_Amount_Total__c: $scope.budgetOverhead.totalAmount || 0,
                                    Remaining_Amount_for_Research_Heads_Y1__c: $scope.remainingForResearch.year1 || 0,
                                    Remaining_Amount_for_Research_Heads_Y2__c: $scope.remainingForResearch.year2 || 0,
                                    Remaining_Amount_for_Research_Heads_Y3__c: $scope.remainingForResearch.year3 || 0,
                                    Remaining_Amount_for_Research_Heads__c: $scope.remainingForResearch.total || 0,
                                    Total_Research_Heads_Year_1__c: $scope.totalResearchHeads.year1 || 0,
                                    Total_Research_Heads_Year_2__c: $scope.totalResearchHeads.year2 || 0,
                                    Total_Research_Heads_Year_3__c: $scope.totalResearchHeads.year3 || 0,
                                    Total_Research_Heads__c: $scope.totalResearchHeads.total || 0
                                });
                                console.log('Added total fields to newly created Overheads Year 1:', overheadIds.year1);
                            }
                            if (overheadIds.year2) {
                                finalExpenseHeadUpdates.push({
                                    Id: overheadIds.year2,
                                    Overhead_Amount_Year_1__c: $scope.budgetOverhead.amountYear1 || 0,
                                    Overhead_Amount_Year_2__c: $scope.budgetOverhead.amountYear2 || 0,
                                    Overhead_Amount_Year_3__c: $scope.budgetOverhead.amountYear3 || 0,
                                    Overhead_Amount_Total__c: $scope.budgetOverhead.totalAmount || 0,
                                    Remaining_Amount_for_Research_Heads_Y1__c: $scope.remainingForResearch.year1 || 0,
                                    Remaining_Amount_for_Research_Heads_Y2__c: $scope.remainingForResearch.year2 || 0,
                                    Remaining_Amount_for_Research_Heads_Y3__c: $scope.remainingForResearch.year3 || 0,
                                    Remaining_Amount_for_Research_Heads__c: $scope.remainingForResearch.total || 0,
                                    Total_Research_Heads_Year_1__c: $scope.totalResearchHeads.year1 || 0,
                                    Total_Research_Heads_Year_2__c: $scope.totalResearchHeads.year2 || 0,
                                    Total_Research_Heads_Year_3__c: $scope.totalResearchHeads.year3 || 0,
                                    Total_Research_Heads__c: $scope.totalResearchHeads.total || 0
                                });
                                console.log('Added total fields to newly created Overheads Year 2:', overheadIds.year2);
                            }
                            if (overheadIds.year3) {
                                finalExpenseHeadUpdates.push({
                                    Id: overheadIds.year3,
                                    Overhead_Amount_Year_1__c: $scope.budgetOverhead.amountYear1 || 0,
                                    Overhead_Amount_Year_2__c: $scope.budgetOverhead.amountYear2 || 0,
                                    Overhead_Amount_Year_3__c: $scope.budgetOverhead.amountYear3 || 0,
                                    Overhead_Amount_Total__c: $scope.budgetOverhead.totalAmount || 0,
                                    Remaining_Amount_for_Research_Heads_Y1__c: $scope.remainingForResearch.year1 || 0,
                                    Remaining_Amount_for_Research_Heads_Y2__c: $scope.remainingForResearch.year2 || 0,
                                    Remaining_Amount_for_Research_Heads_Y3__c: $scope.remainingForResearch.year3 || 0,
                                    Remaining_Amount_for_Research_Heads__c: $scope.remainingForResearch.total || 0,
                                    Total_Research_Heads_Year_1__c: $scope.totalResearchHeads.year1 || 0,
                                    Total_Research_Heads_Year_2__c: $scope.totalResearchHeads.year2 || 0,
                                    Total_Research_Heads_Year_3__c: $scope.totalResearchHeads.year3 || 0,
                                    Total_Research_Heads__c: $scope.totalResearchHeads.total || 0
                                });
                                console.log('Added total fields to newly created Overheads Year 3:', overheadIds.year3);
                            }
                        }

                        console.log('=== END DEBUG: Added Total Fields to Newly Created Expense Heads ===');
                    }

                    // Combine finalExpenseHeadUpdates with expenseHeadUpdates (for existing records)
                    // Use Set to avoid duplicates based on Id
                    let allExpenseHeadUpdatesMap = new Map();

                    // Add existing updates first
                    console.log('=== DEBUG: Processing expenseHeadUpdates ===');
                    console.log('expenseHeadUpdates length:', expenseHeadUpdates ? expenseHeadUpdates.length : 0);
                    if (expenseHeadUpdates && expenseHeadUpdates.length > 0) {
                        for (let i = 0; i < expenseHeadUpdates.length; i++) {
                            console.log('expenseHeadUpdates[' + i + ']:', expenseHeadUpdates[i]);
                            if (expenseHeadUpdates[i].Id) {
                                allExpenseHeadUpdatesMap.set(expenseHeadUpdates[i].Id, expenseHeadUpdates[i]);
                            }
                        }
                    }
                    console.log('=== END DEBUG ===');

                    // Update existing Research Staff Expense Heads with total amounts
                    console.log('=== DEBUG: Updating Existing Research Staff Heads ===');
                    if ($scope.budgetResearchStaffList && $scope.budgetResearchStaffList.length > 0) {
                        for (let i = 0; i < $scope.budgetResearchStaffList.length; i++) {
                            let staff = $scope.budgetResearchStaffList[i];
                            let researchStaffType = staff.researchStaffType;

                            console.log('Processing existing Research Staff:', researchStaffType);
                            console.log('Staff totals:', {
                                totalYear1: staff.totalYear1,
                                totalYear2: staff.totalYear2,
                                totalYear3: staff.totalYear3,
                                totalAmount: staff.totalAmount
                            });

                            if (staff.expenseHeadIds && Array.isArray(staff.expenseHeadIds)) {
                                // Update Year 1 Expense Head
                                if (staff.expenseHeadIds[0] && staff.expenseHeadIds[0] !== 'null' && staff.expenseHeadIds[0] !== 'undefined' && staff.expenseHeadIds[0] !== null) {
                                    let existingUpdate = allExpenseHeadUpdatesMap.get(staff.expenseHeadIds[0]);
                                    if (existingUpdate) {
                                        // Add Amount_For_Research_Staff fields to existing update
                                        existingUpdate.Amount_For_Research_Staff_Year_1__c = staff.totalYear1 || 0;
                                        existingUpdate.Amount_For_Research_Staff_Year_2__c = staff.totalYear2 || 0;
                                        existingUpdate.Amount_For_Research_Staff_Year_3__c = staff.totalYear3 || 0;
                                        existingUpdate.Amount_For_Research_Staff__c = staff.totalAmount || 0;
                                        // Add Total_Amount_for_All_Research_Staff fields only if this is the last Research Staff
                                        if (i === $scope.budgetResearchStaffList.length - 1) {
                                            existingUpdate.Total_Amount_for_All_Research_Staff_Y1__c = $scope.budgetResearchStaff.totalYear1 || 0;
                                            existingUpdate.Total_Amount_for_All_Research_Staff_Y2__c = $scope.budgetResearchStaff.totalYear2 || 0;
                                            existingUpdate.Total_Amount_for_All_Research_Staff_Y3__c = $scope.budgetResearchStaff.totalYear3 || 0;
                                            existingUpdate.Total_Amount_for_All_Research_Staff__c = $scope.budgetResearchStaff.totalAmount || 0;
                                            // Mark this as the Last Research Staff record
                                            existingUpdate.Last_Research_Staff_For_All_RS_Total_Amt__c = true;
                                            console.log('Adding Total_Amount_for_All_Research_Staff fields to LAST existing Research Staff:', researchStaffType);
                                        }
                                        // Add Total_Research_Heads fields to existing update
                                        existingUpdate.Total_Research_Heads_Year_1__c = $scope.totalResearchHeads.year1 || 0;
                                        existingUpdate.Total_Research_Heads_Year_2__c = $scope.totalResearchHeads.year2 || 0;
                                        existingUpdate.Total_Research_Heads_Year_3__c = $scope.totalResearchHeads.year3 || 0;
                                        existingUpdate.Total_Research_Heads__c = $scope.totalResearchHeads.total || 0;
                                        console.log('Added all total fields to existing Year 1 head:', staff.expenseHeadIds[0]);
                                    } else {
                                        // Create new update for this Expense Head
                                        let newUpdateObject = {
                                            Id: staff.expenseHeadIds[0],
                                            Amount_For_Research_Staff_Year_1__c: staff.totalYear1 || 0,
                                            Amount_For_Research_Staff_Year_2__c: staff.totalYear2 || 0,
                                            Amount_For_Research_Staff_Year_3__c: staff.totalYear3 || 0,
                                            Amount_For_Research_Staff__c: staff.totalAmount || 0
                                        };

                                        // Only add Total_Amount_for_All_Research_Staff fields if this is the last Research Staff
                                        if (i === $scope.budgetResearchStaffList.length - 1) {
                                            newUpdateObject.Total_Amount_for_All_Research_Staff_Y1__c = $scope.budgetResearchStaff.totalYear1 || 0;
                                            newUpdateObject.Total_Amount_for_All_Research_Staff_Y2__c = $scope.budgetResearchStaff.totalYear2 || 0;
                                            newUpdateObject.Total_Amount_for_All_Research_Staff_Y3__c = $scope.budgetResearchStaff.totalYear3 || 0;
                                            newUpdateObject.Total_Amount_for_All_Research_Staff__c = $scope.budgetResearchStaff.totalAmount || 0;
                                            // Mark this as the Last Research Staff record
                                            newUpdateObject.Last_Research_Staff_For_All_RS_Total_Amt__c = true;
                                        }

                                        // Add Total_Research_Heads fields
                                        newUpdateObject.Total_Research_Heads_Year_1__c = $scope.totalResearchHeads.year1 || 0;
                                        newUpdateObject.Total_Research_Heads_Year_2__c = $scope.totalResearchHeads.year2 || 0;
                                        newUpdateObject.Total_Research_Heads_Year_3__c = $scope.totalResearchHeads.year3 || 0;
                                        newUpdateObject.Total_Research_Heads__c = $scope.totalResearchHeads.total || 0;

                                        allExpenseHeadUpdatesMap.set(staff.expenseHeadIds[0], newUpdateObject);
                                        console.log('Created new all total fields update for Year 1 head:', staff.expenseHeadIds[0]);
                                    }
                                }

                                // Update Year 2 Expense Head
                                if (staff.expenseHeadIds[1] && staff.expenseHeadIds[1] !== 'null' && staff.expenseHeadIds[1] !== 'undefined' && staff.expenseHeadIds[1] !== null) {
                                    let existingUpdate = allExpenseHeadUpdatesMap.get(staff.expenseHeadIds[1]);
                                    if (existingUpdate) {
                                        // Add Amount_For_Research_Staff fields to existing update
                                        existingUpdate.Amount_For_Research_Staff_Year_1__c = staff.totalYear1 || 0;
                                        existingUpdate.Amount_For_Research_Staff_Year_2__c = staff.totalYear2 || 0;
                                        existingUpdate.Amount_For_Research_Staff_Year_3__c = staff.totalYear3 || 0;
                                        existingUpdate.Amount_For_Research_Staff__c = staff.totalAmount || 0;
                                        // Add Total_Amount_for_All_Research_Staff fields only if this is the last Research Staff
                                        if (i === $scope.budgetResearchStaffList.length - 1) {
                                            existingUpdate.Total_Amount_for_All_Research_Staff_Y1__c = $scope.budgetResearchStaff.totalYear1 || 0;
                                            existingUpdate.Total_Amount_for_All_Research_Staff_Y2__c = $scope.budgetResearchStaff.totalYear2 || 0;
                                            existingUpdate.Total_Amount_for_All_Research_Staff_Y3__c = $scope.budgetResearchStaff.totalYear3 || 0;
                                            existingUpdate.Total_Amount_for_All_Research_Staff__c = $scope.budgetResearchStaff.totalAmount || 0;
                                            // Mark this as the Last Research Staff record
                                            existingUpdate.Last_Research_Staff_For_All_RS_Total_Amt__c = true;
                                        }
                                        // Add Total_Research_Heads fields to existing update
                                        existingUpdate.Total_Research_Heads_Year_1__c = $scope.totalResearchHeads.year1 || 0;
                                        existingUpdate.Total_Research_Heads_Year_2__c = $scope.totalResearchHeads.year2 || 0;
                                        existingUpdate.Total_Research_Heads_Year_3__c = $scope.totalResearchHeads.year3 || 0;
                                        existingUpdate.Total_Research_Heads__c = $scope.totalResearchHeads.total || 0;
                                        console.log('Added all total fields to existing Year 2 head:', staff.expenseHeadIds[1]);
                                    } else {
                                        // Create new update for this Expense Head
                                        let newUpdateObject = {
                                            Id: staff.expenseHeadIds[1],
                                            Amount_For_Research_Staff_Year_1__c: staff.totalYear1 || 0,
                                            Amount_For_Research_Staff_Year_2__c: staff.totalYear2 || 0,
                                            Amount_For_Research_Staff_Year_3__c: staff.totalYear3 || 0,
                                            Amount_For_Research_Staff__c: staff.totalAmount || 0
                                        };

                                        // Only add Total_Amount_for_All_Research_Staff fields if this is the last Research Staff
                                        if (i === $scope.budgetResearchStaffList.length - 1) {
                                            newUpdateObject.Total_Amount_for_All_Research_Staff_Y1__c = $scope.budgetResearchStaff.totalYear1 || 0;
                                            newUpdateObject.Total_Amount_for_All_Research_Staff_Y2__c = $scope.budgetResearchStaff.totalYear2 || 0;
                                            newUpdateObject.Total_Amount_for_All_Research_Staff_Y3__c = $scope.budgetResearchStaff.totalYear3 || 0;
                                            newUpdateObject.Total_Amount_for_All_Research_Staff__c = $scope.budgetResearchStaff.totalAmount || 0;
                                            // Mark this as the Last Research Staff record
                                            newUpdateObject.Last_Research_Staff_For_All_RS_Total_Amt__c = true;
                                        }

                                        // Add Total_Research_Heads fields
                                        newUpdateObject.Total_Research_Heads_Year_1__c = $scope.totalResearchHeads.year1 || 0;
                                        newUpdateObject.Total_Research_Heads_Year_2__c = $scope.totalResearchHeads.year2 || 0;
                                        newUpdateObject.Total_Research_Heads_Year_3__c = $scope.totalResearchHeads.year3 || 0;
                                        newUpdateObject.Total_Research_Heads__c = $scope.totalResearchHeads.total || 0;

                                        allExpenseHeadUpdatesMap.set(staff.expenseHeadIds[1], newUpdateObject);
                                        console.log('Created new all total fields update for Year 2 head:', staff.expenseHeadIds[1]);
                                    }
                                }

                                // Update Year 3 Expense Head
                                if (staff.expenseHeadIds[2] && staff.expenseHeadIds[2] !== 'null' && staff.expenseHeadIds[2] !== 'undefined' && staff.expenseHeadIds[2] !== null) {
                                    let existingUpdate = allExpenseHeadUpdatesMap.get(staff.expenseHeadIds[2]);
                                    if (existingUpdate) {
                                        // Add Amount_For_Research_Staff fields to existing update
                                        existingUpdate.Amount_For_Research_Staff_Year_1__c = staff.totalYear1 || 0;
                                        existingUpdate.Amount_For_Research_Staff_Year_2__c = staff.totalYear2 || 0;
                                        existingUpdate.Amount_For_Research_Staff_Year_3__c = staff.totalYear3 || 0;
                                        existingUpdate.Amount_For_Research_Staff__c = staff.totalAmount || 0;
                                        // Add Total_Amount_for_All_Research_Staff fields only if this is the last Research Staff
                                        if (i === $scope.budgetResearchStaffList.length - 1) {
                                            existingUpdate.Total_Amount_for_All_Research_Staff_Y1__c = $scope.budgetResearchStaff.totalYear1 || 0;
                                            existingUpdate.Total_Amount_for_All_Research_Staff_Y2__c = $scope.budgetResearchStaff.totalYear2 || 0;
                                            existingUpdate.Total_Amount_for_All_Research_Staff_Y3__c = $scope.budgetResearchStaff.totalYear3 || 0;
                                            existingUpdate.Total_Amount_for_All_Research_Staff__c = $scope.budgetResearchStaff.totalAmount || 0;
                                            // Mark this as the Last Research Staff record
                                            existingUpdate.Last_Research_Staff_For_All_RS_Total_Amt__c = true;
                                        }
                                        // Add Total_Research_Heads fields to existing update
                                        existingUpdate.Total_Research_Heads_Year_1__c = $scope.totalResearchHeads.year1 || 0;
                                        existingUpdate.Total_Research_Heads_Year_2__c = $scope.totalResearchHeads.year2 || 0;
                                        existingUpdate.Total_Research_Heads_Year_3__c = $scope.totalResearchHeads.year3 || 0;
                                        existingUpdate.Total_Research_Heads__c = $scope.totalResearchHeads.total || 0;
                                        console.log('Added all total fields to existing Year 3 head:', staff.expenseHeadIds[2]);
                                    } else {
                                        // Create new update for this Expense Head
                                        let newUpdateObject = {
                                            Id: staff.expenseHeadIds[2],
                                            Amount_For_Research_Staff_Year_1__c: staff.totalYear1 || 0,
                                            Amount_For_Research_Staff_Year_2__c: staff.totalYear2 || 0,
                                            Amount_For_Research_Staff_Year_3__c: staff.totalYear3 || 0,
                                            Amount_For_Research_Staff__c: staff.totalAmount || 0
                                        };

                                        // Only add Total_Amount_for_All_Research_Staff fields if this is the last Research Staff
                                        if (i === $scope.budgetResearchStaffList.length - 1) {
                                            newUpdateObject.Total_Amount_for_All_Research_Staff_Y1__c = $scope.budgetResearchStaff.totalYear1 || 0;
                                            newUpdateObject.Total_Amount_for_All_Research_Staff_Y2__c = $scope.budgetResearchStaff.totalYear2 || 0;
                                            newUpdateObject.Total_Amount_for_All_Research_Staff_Y3__c = $scope.budgetResearchStaff.totalYear3 || 0;
                                            newUpdateObject.Total_Amount_for_All_Research_Staff__c = $scope.budgetResearchStaff.totalAmount || 0;
                                            // Mark this as the Last Research Staff record
                                            newUpdateObject.Last_Research_Staff_For_All_RS_Total_Amt__c = true;
                                        }

                                        // Add Total_Research_Heads fields
                                        newUpdateObject.Total_Research_Heads_Year_1__c = $scope.totalResearchHeads.year1 || 0;
                                        newUpdateObject.Total_Research_Heads_Year_2__c = $scope.totalResearchHeads.year2 || 0;
                                        newUpdateObject.Total_Research_Heads_Year_3__c = $scope.totalResearchHeads.year3 || 0;
                                        newUpdateObject.Total_Research_Heads__c = $scope.totalResearchHeads.total || 0;

                                        allExpenseHeadUpdatesMap.set(staff.expenseHeadIds[2], newUpdateObject);
                                        console.log('Created new all total fields update for Year 3 head:', staff.expenseHeadIds[2]);
                                    }
                                }
                            }
                        }
                    }
                    console.log('=== END DEBUG ===');

                    // Add final updates (will overwrite if same Id exists)
                    console.log('=== DEBUG: Before Merging Final Updates ===');
                    console.log('finalExpenseHeadUpdates length:', finalExpenseHeadUpdates ? finalExpenseHeadUpdates.length : 0);
                    if (finalExpenseHeadUpdates && finalExpenseHeadUpdates.length > 0) {
                        for (let i = 0; i < finalExpenseHeadUpdates.length; i++) {
                            console.log('Final update ' + (i + 1) + ':', finalExpenseHeadUpdates[i]);
                        }
                    }
                    console.log('=== END DEBUG ===');

                    if (finalExpenseHeadUpdates && finalExpenseHeadUpdates.length > 0) {
                        for (let i = 0; i < finalExpenseHeadUpdates.length; i++) {
                            if (finalExpenseHeadUpdates[i].Id) {
                                allExpenseHeadUpdatesMap.set(finalExpenseHeadUpdates[i].Id, finalExpenseHeadUpdates[i]);
                            }
                        }
                    }

                    // Convert map back to array
                    let allExpenseHeadUpdates = Array.from(allExpenseHeadUpdatesMap.values());

                    // Add Total_Research_Heads fields to ALL Expense Head records
                    console.log('=== DEBUG: Adding Total_Research_Heads to ALL Expense Heads ===');
                    console.log('allExpenseHeadUpdates length before adding missing heads:', allExpenseHeadUpdates.length);

                    // Also add ALL existing Expense Head records that might not be in the updates array
                    // This ensures Travel, Consumables, Minor equipment, Contingency, etc. are included
                    if ($scope.expenseHeadIds) {
                        for (let expenseType in $scope.expenseHeadIds) {
                            if (expenseType !== 'Research stay' && expenseType !== 'Overheads') { // Skip ones already handled
                                let expenseTypeIds = $scope.expenseHeadIds[expenseType];
                                console.log('Processing expense type:', expenseType, 'IDs:', expenseTypeIds);

                                if (expenseTypeIds.year1 && expenseTypeIds.year1 !== 'null' && expenseTypeIds.year1 !== 'undefined' && expenseTypeIds.year1 !== null) {
                                    if (!allExpenseHeadUpdatesMap.has(expenseTypeIds.year1)) {
                                        allExpenseHeadUpdatesMap.set(expenseTypeIds.year1, { Id: expenseTypeIds.year1 });
                                        console.log('Added missing Expense Head to updates:', expenseTypeIds.year1);
                                    }
                                }
                                if (expenseTypeIds.year2 && expenseTypeIds.year2 !== 'null' && expenseTypeIds.year2 !== 'undefined' && expenseTypeIds.year2 !== null) {
                                    if (!allExpenseHeadUpdatesMap.has(expenseTypeIds.year2)) {
                                        allExpenseHeadUpdatesMap.set(expenseTypeIds.year2, { Id: expenseTypeIds.year2 });
                                        console.log('Added missing Expense Head to updates:', expenseTypeIds.year2);
                                    }
                                }
                                if (expenseTypeIds.year3 && expenseTypeIds.year3 !== 'null' && expenseTypeIds.year3 !== 'undefined' && expenseTypeIds.year3 !== null) {
                                    if (!allExpenseHeadUpdatesMap.has(expenseTypeIds.year3)) {
                                        allExpenseHeadUpdatesMap.set(expenseTypeIds.year3, { Id: expenseTypeIds.year3 });
                                        console.log('Added missing Expense Head to updates:', expenseTypeIds.year3);
                                    }
                                }
                            }
                        }
                    }

                    // Convert map back to array again to include newly added Expense Heads
                    allExpenseHeadUpdates = Array.from(allExpenseHeadUpdatesMap.values());
                    console.log('allExpenseHeadUpdates length after adding missing heads:', allExpenseHeadUpdates.length);

                    for (let i = 0; i < allExpenseHeadUpdates.length; i++) {
                        let expenseHead = allExpenseHeadUpdates[i];
                        console.log('Adding Total_Research_Heads to Expense Head:', expenseHead.Id);

                        // Add Total_Research_Heads fields to every Expense Head record
                        expenseHead.Total_Research_Heads_Year_1__c = $scope.totalResearchHeads.year1 || 0;
                        expenseHead.Total_Research_Heads_Year_2__c = $scope.totalResearchHeads.year2 || 0;
                        expenseHead.Total_Research_Heads_Year_3__c = $scope.totalResearchHeads.year3 || 0;
                        expenseHead.Total_Research_Heads__c = $scope.totalResearchHeads.total || 0;
                    }
                    console.log('=== END DEBUG ===');

                    // Add researchStayTravelTotal data to ALL Research Stay Expense Head records (Year 1, 2, 3)
                    // Find all Research Stay Expense Head IDs and add the total fields to each
                    let researchStayHeadIds = [];
                    if ($scope.expenseHeadIds && $scope.expenseHeadIds['Research stay']) {
                        if ($scope.expenseHeadIds['Research stay'].year1) {
                            researchStayHeadIds.push($scope.expenseHeadIds['Research stay'].year1);
                        }
                        if ($scope.expenseHeadIds['Research stay'].year2) {
                            researchStayHeadIds.push($scope.expenseHeadIds['Research stay'].year2);
                        }
                        if ($scope.expenseHeadIds['Research stay'].year3) {
                            researchStayHeadIds.push($scope.expenseHeadIds['Research stay'].year3);
                        }
                    }

                    // Update ALL Research Stay Expense Heads with Total_Research_Heads only (Research_Stay_Travel_Total and Total_Research_Amount_Remaining now stored only in Travel Expense Head)
                    for (let i = 0; i < researchStayHeadIds.length; i++) {
                        let headId = researchStayHeadIds[i];
                        if (headId && headId !== 'null' && headId !== 'undefined') {
                            // Check if this head is already in the updates array
                            let existingUpdate = allExpenseHeadUpdates.find(update => update.Id === headId);
                            if (existingUpdate) {
                                // Research_Stay_Travel_Total and Total_Research_Amount_Remaining fields removed - now stored only in Travel Expense Head
                                // Add Total_Research_Heads fields to existing update
                                existingUpdate.Total_Research_Heads_Year_1__c = $scope.totalResearchHeads.year1 || 0;
                                existingUpdate.Total_Research_Heads_Year_2__c = $scope.totalResearchHeads.year2 || 0;
                                existingUpdate.Total_Research_Heads_Year_3__c = $scope.totalResearchHeads.year3 || 0;
                                existingUpdate.Total_Research_Heads__c = $scope.totalResearchHeads.total || 0;
                            } else {
                                // Create new update for Total_Research_Heads fields only (Research_Stay_Travel_Total and Total_Research_Amount_Remaining removed)
                                allExpenseHeadUpdates.push({
                                    Id: headId,
                                    Total_Research_Heads_Year_1__c: $scope.totalResearchHeads.year1 || 0,
                                    Total_Research_Heads_Year_2__c: $scope.totalResearchHeads.year2 || 0,
                                    Total_Research_Heads_Year_3__c: $scope.totalResearchHeads.year3 || 0,
                                    Total_Research_Heads__c: $scope.totalResearchHeads.total || 0
                                });
                            }
                            console.log('Added Total_Research_Heads to Research Stay Expense Head (Research_Stay_Travel_Total and Total_Research_Amount_Remaining now stored only in Travel Expense Head):', headId, {
                                totalResearchHeads: {
                                    year1: $scope.totalResearchHeads.year1,
                                    year2: $scope.totalResearchHeads.year2,
                                    year3: $scope.totalResearchHeads.year3,
                                    total: $scope.totalResearchHeads.total
                                }
                            });
                        }
                    }

                    if (researchStayHeadIds.length === 0) {
                        console.warn('Could not find Research Stay Expense Head ID to store researchStayTravelTotal and totalResearchAmount');
                    }

                    // Add researchStayTravelTotal and totalResearchAmount data to ALL Travel Expense Head records (Year 1, 2, 3)
                    // Find all Travel Expense Head IDs and add the total fields to each
                    let travelHeadIds = [];
                    if ($scope.expenseHeadIds && $scope.expenseHeadIds['Travel']) {
                        if ($scope.expenseHeadIds['Travel'].year1) {
                            travelHeadIds.push($scope.expenseHeadIds['Travel'].year1);
                        }
                        if ($scope.expenseHeadIds['Travel'].year2) {
                            travelHeadIds.push($scope.expenseHeadIds['Travel'].year2);
                        }
                        if ($scope.expenseHeadIds['Travel'].year3) {
                            travelHeadIds.push($scope.expenseHeadIds['Travel'].year3);
                        }
                    }

                    // Update ALL Travel Expense Heads with researchStayTravelTotal and totalResearchAmount
                    for (let i = 0; i < travelHeadIds.length; i++) {
                        let headId = travelHeadIds[i];
                        if (headId && headId !== 'null' && headId !== 'undefined') {
                            // Check if this head is already in the updates array
                            let existingUpdate = allExpenseHeadUpdates.find(update => update.Id === headId);
                            if (existingUpdate) {
                                // Add researchStayTravelTotal fields to existing update
                                existingUpdate.Research_Stay_Travel_Total_Year_1__c = $scope.researchStayTravelTotal.year1 || 0;
                                existingUpdate.Research_Stay_Travel_Total_Year_2__c = $scope.researchStayTravelTotal.year2 || 0;
                                existingUpdate.Research_Stay_Travel_Total_Year_3__c = $scope.researchStayTravelTotal.year3 || 0;
                                existingUpdate.Research_Stay_Travel_Total__c = $scope.researchStayTravelTotal.total || 0;
                                // Add totalResearchAmount fields to existing update
                                existingUpdate.Total_Research_Amount_Remaining_Year_1__c = $scope.totalResearchAmount.year1 || 0;
                                existingUpdate.Total_Research_Amount_Remaining_Year_2__c = $scope.totalResearchAmount.year2 || 0;
                                existingUpdate.Total_Research_Amount_Remaining_Year_3__c = $scope.totalResearchAmount.year3 || 0;
                                existingUpdate.Total_Research_Amount__c = $scope.totalResearchAmount.total || 0;
                            } else {
                                // Create new update for researchStayTravelTotal and totalResearchAmount fields
                                allExpenseHeadUpdates.push({
                                    Id: headId,
                                    Research_Stay_Travel_Total_Year_1__c: $scope.researchStayTravelTotal.year1 || 0,
                                    Research_Stay_Travel_Total_Year_2__c: $scope.researchStayTravelTotal.year2 || 0,
                                    Research_Stay_Travel_Total_Year_3__c: $scope.researchStayTravelTotal.year3 || 0,
                                    Research_Stay_Travel_Total__c: $scope.researchStayTravelTotal.total || 0,
                                    Total_Research_Amount_Remaining_Year_1__c: $scope.totalResearchAmount.year1 || 0,
                                    Total_Research_Amount_Remaining_Year_2__c: $scope.totalResearchAmount.year2 || 0,
                                    Total_Research_Amount_Remaining_Year_3__c: $scope.totalResearchAmount.year3 || 0,
                                    Total_Research_Amount__c: $scope.totalResearchAmount.total || 0
                                });
                            }
                            console.log('Added researchStayTravelTotal and totalResearchAmount to Travel Expense Head:', headId, {
                                researchStayTravelTotal: {
                                    year1: $scope.researchStayTravelTotal.year1,
                                    year2: $scope.researchStayTravelTotal.year2,
                                    year3: $scope.researchStayTravelTotal.year3,
                                    total: $scope.researchStayTravelTotal.total
                                },
                                totalResearchAmount: {
                                    year1: $scope.totalResearchAmount.year1,
                                    year2: $scope.totalResearchAmount.year2,
                                    year3: $scope.totalResearchAmount.year3,
                                    total: $scope.totalResearchAmount.total
                                }
                            });
                        }
                    }

                    if (travelHeadIds.length === 0) {
                        console.warn('Could not find Travel Expense Head ID to store researchStayTravelTotal and totalResearchAmount');
                    }

                    // Add budgetOverhead data to ALL Overhead Expense Head records (Year 1, 2, 3)
                    // Find all Overhead Expense Head IDs and add the total fields to each
                    let overheadHeadIds = [];
                    if ($scope.expenseHeadIds && $scope.expenseHeadIds['Overheads']) {
                        if ($scope.expenseHeadIds['Overheads'].year1) {
                            overheadHeadIds.push($scope.expenseHeadIds['Overheads'].year1);
                        }
                        if ($scope.expenseHeadIds['Overheads'].year2) {
                            overheadHeadIds.push($scope.expenseHeadIds['Overheads'].year2);
                        }
                        if ($scope.expenseHeadIds['Overheads'].year3) {
                            overheadHeadIds.push($scope.expenseHeadIds['Overheads'].year3);
                        }
                    }

                    // Update ALL Overhead Expense Heads with budgetOverhead amounts
                    for (let i = 0; i < overheadHeadIds.length; i++) {
                        let headId = overheadHeadIds[i];
                        if (headId && headId !== 'null' && headId !== 'undefined') {
                            // Check if this head is already in the updates array
                            let existingOverheadUpdate = allExpenseHeadUpdates.find(update => update.Id === headId);
                            if (existingOverheadUpdate) {
                                // Add budgetOverhead amount fields to existing update
                                existingOverheadUpdate.Overhead_Amount_Year_1__c = $scope.budgetOverhead.amountYear1 || 0;
                                existingOverheadUpdate.Overhead_Amount_Year_2__c = $scope.budgetOverhead.amountYear2 || 0;
                                existingOverheadUpdate.Overhead_Amount_Year_3__c = $scope.budgetOverhead.amountYear3 || 0;
                                existingOverheadUpdate.Overhead_Amount_Total__c = $scope.budgetOverhead.totalAmount || 0;
                                // Add remainingForResearch fields to existing update
                                existingOverheadUpdate.Remaining_Amount_for_Research_Heads_Y1__c = $scope.remainingForResearch.year1 || 0;
                                existingOverheadUpdate.Remaining_Amount_for_Research_Heads_Y2__c = $scope.remainingForResearch.year2 || 0;
                                existingOverheadUpdate.Remaining_Amount_for_Research_Heads_Y3__c = $scope.remainingForResearch.year3 || 0;
                                existingOverheadUpdate.Remaining_Amount_for_Research_Heads__c = $scope.remainingForResearch.total || 0;
                                // Add Total_Research_Heads fields to existing update
                                existingOverheadUpdate.Total_Research_Heads_Year_1__c = $scope.totalResearchHeads.year1 || 0;
                                existingOverheadUpdate.Total_Research_Heads_Year_2__c = $scope.totalResearchHeads.year2 || 0;
                                existingOverheadUpdate.Total_Research_Heads_Year_3__c = $scope.totalResearchHeads.year3 || 0;
                                existingOverheadUpdate.Total_Research_Heads__c = $scope.totalResearchHeads.total || 0;
                            } else {
                                // Create new update for budgetOverhead, remainingForResearch, and Total_Research_Heads fields
                                allExpenseHeadUpdates.push({
                                    Id: headId,
                                    Overhead_Amount_Year_1__c: $scope.budgetOverhead.amountYear1 || 0,
                                    Overhead_Amount_Year_2__c: $scope.budgetOverhead.amountYear2 || 0,
                                    Overhead_Amount_Year_3__c: $scope.budgetOverhead.amountYear3 || 0,
                                    Overhead_Amount_Total__c: $scope.budgetOverhead.totalAmount || 0,
                                    Remaining_Amount_for_Research_Heads_Y1__c: $scope.remainingForResearch.year1 || 0,
                                    Remaining_Amount_for_Research_Heads_Y2__c: $scope.remainingForResearch.year2 || 0,
                                    Remaining_Amount_for_Research_Heads_Y3__c: $scope.remainingForResearch.year3 || 0,
                                    Remaining_Amount_for_Research_Heads__c: $scope.remainingForResearch.total || 0,
                                    Total_Research_Heads_Year_1__c: $scope.totalResearchHeads.year1 || 0,
                                    Total_Research_Heads_Year_2__c: $scope.totalResearchHeads.year2 || 0,
                                    Total_Research_Heads_Year_3__c: $scope.totalResearchHeads.year3 || 0,
                                    Total_Research_Heads__c: $scope.totalResearchHeads.total || 0
                                });
                            }
                            console.log('Added budgetOverhead amounts, remainingForResearch, and Total_Research_Heads to Overhead Expense Head:', headId, {
                                budgetOverhead: {
                                    amountYear1: $scope.budgetOverhead.amountYear1,
                                    amountYear2: $scope.budgetOverhead.amountYear2,
                                    amountYear3: $scope.budgetOverhead.amountYear3,
                                    totalAmount: $scope.budgetOverhead.totalAmount
                                },
                                remainingForResearch: {
                                    year1: $scope.remainingForResearch.year1,
                                    year2: $scope.remainingForResearch.year2,
                                    year3: $scope.remainingForResearch.year3,
                                    total: $scope.remainingForResearch.total
                                },
                                totalResearchHeads: {
                                    year1: $scope.totalResearchHeads.year1,
                                    year2: $scope.totalResearchHeads.year2,
                                    year3: $scope.totalResearchHeads.year3,
                                    total: $scope.totalResearchHeads.total
                                }
                            });
                        }
                    }

                    if (overheadHeadIds.length === 0) {
                        console.warn('Could not find Overhead Expense Head ID to store budgetOverhead amounts');
                    }

                    // Update Expense_Head__c records with descriptions and researchStayTravelTotal
                    if (allExpenseHeadUpdates.length > 0) {
                        console.log('=== DEBUG: Final Expense Head Updates ===');
                        console.log('Number of Expense Head records to update:', allExpenseHeadUpdates.length);

                        // Log each record individually for better debugging
                        for (let i = 0; i < allExpenseHeadUpdates.length; i++) {
                            console.log('Expense Head Update ' + (i + 1) + ':', {
                                Id: allExpenseHeadUpdates[i].Id,
                                Description__c: allExpenseHeadUpdates[i].Description__c,
                                Amount_For_Research_Staff_Year_1__c: allExpenseHeadUpdates[i].Amount_For_Research_Staff_Year_1__c,
                                Amount_For_Research_Staff_Year_2__c: allExpenseHeadUpdates[i].Amount_For_Research_Staff_Year_2__c,
                                Amount_For_Research_Staff_Year_3__c: allExpenseHeadUpdates[i].Amount_For_Research_Staff_Year_3__c,
                                Amount_For_Research_Staff__c: allExpenseHeadUpdates[i].Amount_For_Research_Staff__c,
                                Research_Stay_Travel_Total_Year_1__c: allExpenseHeadUpdates[i].Research_Stay_Travel_Total_Year_1__c,
                                Research_Stay_Travel_Total_Year_2__c: allExpenseHeadUpdates[i].Research_Stay_Travel_Total_Year_2__c,
                                Research_Stay_Travel_Total_Year_3__c: allExpenseHeadUpdates[i].Research_Stay_Travel_Total_Year_3__c,
                                Research_Stay_Travel_Total__c: allExpenseHeadUpdates[i].Research_Stay_Travel_Total__c,
                                Total_Research_Amount_Remaining_Year_1__c: allExpenseHeadUpdates[i].Total_Research_Amount_Remaining_Year_1__c,
                                Total_Research_Amount_Remaining_Year_2__c: allExpenseHeadUpdates[i].Total_Research_Amount_Remaining_Year_2__c,
                                Total_Research_Amount_Remaining_Year_3__c: allExpenseHeadUpdates[i].Total_Research_Amount_Remaining_Year_3__c,
                                Total_Research_Amount__c: allExpenseHeadUpdates[i].Total_Research_Amount__c,
                                Overhead_Amount_Year_1__c: allExpenseHeadUpdates[i].Overhead_Amount_Year_1__c,
                                Overhead_Amount_Year_2__c: allExpenseHeadUpdates[i].Overhead_Amount_Year_2__c,
                                Overhead_Amount_Year_3__c: allExpenseHeadUpdates[i].Overhead_Amount_Year_3__c,
                                Overhead_Amount_Total__c: allExpenseHeadUpdates[i].Overhead_Amount_Total__c,
                                Remaining_Amount_for_Research_Heads_Y1__c: allExpenseHeadUpdates[i].Remaining_Amount_for_Research_Heads_Y1__c,
                                Remaining_Amount_for_Research_Heads_Y2__c: allExpenseHeadUpdates[i].Remaining_Amount_for_Research_Heads_Y2__c,
                                Remaining_Amount_for_Research_Heads_Y3__c: allExpenseHeadUpdates[i].Remaining_Amount_for_Research_Heads_Y3__c,
                                Remaining_Amount_for_Research_Heads__c: allExpenseHeadUpdates[i].Remaining_Amount_for_Research_Heads__c
                            });
                        }

                        console.log('Full update data:', JSON.stringify(allExpenseHeadUpdates, null, 2));
                        console.log('=== END DEBUG ===');

                        // Update Expense_Head__c records
                        ApplicantPortal_Contoller.updateExpenseHeadDescriptions(allExpenseHeadUpdates, function (updateResult, updateEvent) {
                            console.log('=== DEBUG: Update Result ===');
                            console.log('updateResult:', updateResult);
                            console.log('updateEvent:', updateEvent);
                            console.log('updateEvent.status:', updateEvent ? updateEvent.status : 'undefined');
                            console.log('=== END DEBUG ===');

                            if (updateEvent && updateEvent.status) {
                                console.log('Expense Head records (including researchStayTravelTotal) updated successfully');
                            } else {
                                console.error('Failed to update Expense Head records:', updateResult, updateEvent);
                            }
                        });
                    } else {
                        console.log('No Expense Head records to update');
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
        const maxResearchAmount = $scope.getMaxResearchAmount();
        const isIndia = ($scope.mailingCountry === 'India' ||
            $rootScope.mailingCountry === 'India' ||
            ($scope.accDetails && $scope.accDetails.Contacts &&
                $scope.accDetails.Contacts[0] &&
                $scope.accDetails.Contacts[0].MailingCountry === 'India'));
        const currencySymbol = isIndia ? '₹' : '€';
        const maxAmountFormatted = isIndia ? '₹13,00,000' : '€16,000';

        // 1️⃣ Grand Total validation (per year)
        if ($scope.grandTotal.year1 > maxResearchAmount) {
            swal(
                "Budget Limit Exceeded",
                "Year 1 Grand Total cannot be more than " + maxAmountFormatted + ".",
                "info"
            );
            return false;
        }

        // Only validate Year 2 if duration is 24 or 36 months
        if ($rootScope.proposalDurationMonths >= 24 && $scope.grandTotal.year2 > maxResearchAmount) {
            swal(
                "Budget Limit Exceeded",
                "Year 2 Grand Total cannot be more than " + maxAmountFormatted + ".",
                "info"
            );
            return false;
        }

        // Only validate Year 3 if duration is 36 months
        if ($rootScope.proposalDurationMonths === 36 && $scope.grandTotal.year3 > maxResearchAmount) {
            swal(
                "Budget Limit Exceeded",
                "Year 3 Grand Total cannot be more than " + maxAmountFormatted + ".",
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

    // Function to format numbers in Indian currency format (₹ 13,00,000)
    $scope.formatIndianNumber = function (value, decimals) {
        if (value == null || value === undefined || value === '') {
            return '₹ 0';
        }

        const num = parseFloat(value);
        if (isNaN(num)) {
            return '₹ 0';
        }

        // Round to specified decimal places (default 2)
        const decimalPlaces = decimals !== undefined ? decimals : 2;
        const rounded = Math.round(num * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);

        // Split into integer and decimal parts
        const parts = rounded.toString().split('.');
        let integerPart = parts[0];
        const decimalPart = parts[1] || '';

        // Apply Indian numbering system: first 3 digits from right, then every 2 digits
        if (integerPart.length > 3) {
            const lastThree = integerPart.slice(-3);
            const remaining = integerPart.slice(0, -3);

            // Add commas: every 2 digits from right for remaining part
            let formattedRemaining = '';
            let i = remaining.length - 1;
            while (i >= 0) {
                const start = Math.max(0, i - 1);
                const chunk = remaining.slice(start, i + 1);
                formattedRemaining = (formattedRemaining ? chunk + ',' : chunk) + formattedRemaining;
                i -= 2;
            }

            integerPart = formattedRemaining + ',' + lastThree;
        }

        // Add decimal part if exists
        if (decimalPart) {
            // Pad decimal part to required decimal places
            let paddedDecimal = decimalPart;
            while (paddedDecimal.length < decimalPlaces) {
                paddedDecimal += '0';
            }
            paddedDecimal = paddedDecimal.substring(0, decimalPlaces);
            return '₹ ' + integerPart + '.' + paddedDecimal;
        } else if (decimalPlaces > 0) {
            let zeros = '';
            for (let j = 0; j < decimalPlaces; j++) {
                zeros += '0';
            }
            return '₹ ' + integerPart + '.' + zeros;
        }

        return '₹ ' + integerPart;
    };

    // Function to format numbers in German currency format (€ 1.234,56)
    $scope.formatGermanNumber = function (value, decimals) {
        console.log('=== DEBUG: formatGermanNumber called ===');
        console.log('Value:', value);
        console.log('Decimals:', decimals);
        console.log('Current mailingCountry:', $scope.mailingCountry);
        console.log('Current $rootScope.mailingCountry:', $rootScope.mailingCountry);

        if (value == null || value === undefined || value === '') {
            console.log('formatGermanNumber: Value is null/undefined/empty, returning € 0,00');
            return '€ 0,00';
        }

        const num = parseFloat(value);
        if (isNaN(num)) {
            console.log('formatGermanNumber: Value is NaN, returning € 0,00');
            return '€ 0,00';
        }

        // Round to specified decimal places (default 2)
        const decimalPlaces = decimals !== undefined ? decimals : 2;
        const rounded = Math.round(num * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);

        // Split into integer and decimal parts
        const parts = rounded.toString().split('.');
        let integerPart = parts[0];
        const decimalPart = parts[1] || '';

        // Apply German numbering system: period (.) for thousands separator
        // Format integer part with periods as thousands separators
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Add decimal part if exists
        let result = '';
        if (decimalPart) {
            // Pad decimal part to required decimal places
            let paddedDecimal = decimalPart;
            while (paddedDecimal.length < decimalPlaces) {
                paddedDecimal += '0';
            }
            paddedDecimal = paddedDecimal.substring(0, decimalPlaces);
            result = '€ ' + integerPart + ',' + paddedDecimal;
        } else if (decimalPlaces > 0) {
            let zeros = '';
            for (let j = 0; j < decimalPlaces; j++) {
                zeros += '0';
            }
            result = '€ ' + integerPart + ',' + zeros;
        } else {
            result = '€ ' + integerPart;
        }

        console.log('formatGermanNumber: Final result:', result);
        console.log('=== END DEBUG: formatGermanNumber ===');
        return result;
    };
})