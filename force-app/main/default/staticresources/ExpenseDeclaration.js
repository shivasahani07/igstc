angular.module('cp_app').controller('ExpenseDeclaration', function ($scope, $rootScope) {
    debugger;

    // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }

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
    $scope.overhead = [];
    $scope.contingency = [];
    $scope.outsourcing = [];
    $scope.manPower = {};
    $scope.equipmentTotals = {};
    $scope.allExpenseCategories = {};
    $scope.expenseCategory = [];
    $scope.consumableTotal = {};
    $scope.travelTotal = {};
    $scope.outsourcingTotal = {};
    $scope.contingencyTotal = {};
    $scope.subTotal = {};
    $scope.overheadCharges = {};
    $scope.totals = {};
    $scope.industryContr = {};
    $scope.igstcFunding = {};
    $scope.financeDetails = {};
    $rootScope.apaId = '';
    $scope.numberOfYears = 3; // Default to 3 years
    $scope.durationInMonths = 36; // Default to 36 months
    
    // Initialize financial contribution totals (same as Financial_Overview)
    $scope.indianIndus = 0;
    $scope.indianAcademia = 0;
    $scope.germanIndus = 0;
    $scope.germanAcademia = 0;
    $scope.TotalIndianContribution = 0;
    $scope.TotalGermanContribution = 0;
    $scope.TotalContriIndianIndustry = 0;
    $scope.TotalContriIndianAcademia = 0;
    $scope.TotalContriGermanIndustry = 0;
    $scope.TotalContriGermanAcademia = 0;
    $scope.applicantDetails = [];

    $scope.getExpenseRecords = function () {
        debugger;
        ApplicantPortal_Contoller.getExpenseRecords($rootScope.proposalId, $rootScope.contactId, function (result, event) {
            debugger;
            console.log("declred expense list");
            console.log(result);
            debugger;
            if (event.status && result != null) {
                debugger;
                $scope.accList = result?.conList[0]?.Account;
                $scope.expenseList = result.edList;
                $scope.allExpenseCategories = result.ecList;
                $scope.applicantProposalAsscocition = result.apa[0];
                $scope.financeDetails = result?.apa[0]?.Financial_Contribution__r[0];
                $scope.igstcFunding.Year1_Expense__c = result?.apa[0]?.IGSTC_Funding_Year_1__c;
                $scope.igstcFunding.Year2_Expense__c = result?.apa[0]?.IGSTC_Funding_Year_2__c;
                $scope.igstcFunding.Year3_Expense__c = result?.apa[0]?.IGSTC_Funding_Year_3__c;
                $scope.igstcFunding.Total_Expense__c = result?.apa[0]?.IGSTC_Total_Funding__c;
                $scope.industryContr.Year1_Expense__c = result?.apa[0]?.Industry_Contribution_Year_1__c;
                $scope.industryContr.Year2_Expense__c = result?.apa[0]?.Industry_Contribution_Year_2__c;
                $scope.industryContr.Year3_Expense__c = result?.apa[0]?.Industry_Contribution_Year_3__c;
                $scope.industryContr.Total_Expense__c = result?.apa[0]?.Total_Industry_Contribution__c;
                $rootScope.apaId = $scope.applicantProposalAsscocition.Id;
                
                // Set number of years based on Duration_In_Months_Max_36__c
                if (result.numberOfYears != null && result.numberOfYears > 0) {
                    $scope.numberOfYears = result.numberOfYears;
                } else {
                    $scope.numberOfYears = 3; // Default to 3 years
                }
                if (result.durationInMonths != null) {
                    $scope.durationInMonths = result.durationInMonths;
                }
                console.log('Number of Years:', $scope.numberOfYears);
                console.log('Duration in Months:', $scope.durationInMonths);
                
                if ($scope.allExpenseCategories != null) {
                    $scope.expenseCategory = $scope.allExpenseCategories.filter(item => item.Applicant_Proposal_Association__c == $rootScope.apaId);
                }
                
                // Load existing expense line items if apaId is available
                if ($rootScope.apaId) {
                    $scope.getExpenseHeadLineItems();
                }
                
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }
    // $scope.getAccounts = function () {
    //     debugger;
    //     ApplicantPortal_Contoller.getProposalAccount($rootScope.candidateId, function (result, event) {
    //         if (event.status && result != null) {
    //             debugger;
    //             $scope.accList = result?.conList[0]?.Account;
    //             $scope.financeDetails = result?.accList[0]?.Financial_Contribution__r[0];
    //             $scope.igstcFunding.Year1_Expense__c = result?.accList[0]?.IGSTC_Funding_Year_1__c;
    //             $scope.igstcFunding.Year2_Expense__c = result?.accList[0]?.IGSTC_Funding_Year_2__c;
    //             $scope.igstcFunding.Year3_Expense__c = result?.accList[0]?.IGSTC_Funding_Year_3__c;
    //             $scope.igstcFunding.Total_Expense__c = result?.accList[0]?.IGSTC_Total_Funding__c;
    //             $scope.industryContr.Year1_Expense__c = result?.accList[0]?.Industry_Contribution_Year_1__c;
    //             $scope.industryContr.Year2_Expense__c = result?.accList[0]?.Industry_Contribution_Year_2__c;
    //             $scope.industryContr.Year3_Expense__c = result?.accList[0]?.Industry_Contribution_Year_3__c;
    //             $scope.industryContr.Total_Expense__c = result?.accList[0]?.Total_Industry_Contribution__c;
    //             $scope.$apply();
    //         }
    //     })
    // }
    // $scope.getAccounts();
    // Function to calculate financial contribution totals (same as Financial_Overview)
    $scope.calculateFinancialTotals = function () {
        $scope.indianIndus = 0;
        $scope.indianAcademia = 0;
        $scope.germanIndus = 0;
        $scope.germanAcademia = 0;
        
        if ($scope.applicantDetails && $scope.applicantDetails.length > 0) {
            for (var i = 0; i < $scope.applicantDetails.length; i++) {
                if ($scope.applicantDetails[i].Financial_Contribution__r != undefined) {
                    for (var j = 0; j < $scope.applicantDetails[i].Financial_Contribution__r.length; j++) {
                        var account = $scope.applicantDetails[i].Contact__r?.Account;
                        if (account) {
                            if (account.BillingCountry == "India" && account.Industry__c == true) {
                                $scope.indianIndus = Number($scope.indianIndus) + Number($scope.applicantDetails[i].Financial_Contribution__r[j].IGSTC_Contribution__c || 0);
                            } else if (account.BillingCountry == "India" && account.Academia__c == true) {
                                $scope.indianAcademia = Number($scope.indianAcademia) + Number($scope.applicantDetails[i].Financial_Contribution__r[j].IGSTC_Contribution__c || 0);
                            } else if (account.BillingCountry == "Germany" && account.Industry__c == true) {
                                $scope.germanIndus = Number($scope.germanIndus) + Number($scope.applicantDetails[i].Financial_Contribution__r[j].IGSTC_Contribution__c || 0);
                            } else if (account.BillingCountry == "Germany" && account.Academia__c == true) {
                                $scope.germanAcademia = Number($scope.germanAcademia) + Number($scope.applicantDetails[i].Financial_Contribution__r[j].IGSTC_Contribution__c || 0);
                            }
                        }
                    }
                }
            }
        }
        
        $scope.TotalIndianContribution = Number($scope.indianIndus) + Number($scope.indianAcademia);
        $scope.TotalGermanContribution = Number($scope.germanIndus) + Number($scope.germanAcademia);
        $scope.TotalContriIndianIndustry = $scope.indianIndus;
        $scope.TotalContriIndianAcademia = $scope.indianAcademia;
        $scope.TotalContriGermanIndustry = $scope.germanIndus;
        $scope.TotalContriGermanAcademia = $scope.germanAcademia;
    };
    
    // Function to load all applicant details for financial totals calculation
    $scope.getApplicantDetailsForTotals = function () {
        ApplicantPortal_Contoller.getProjectDetailsDetails($rootScope.proposalId, function (result, event) {
            if (event.status && result != null) {
                $scope.applicantDetails = result;
                $scope.calculateFinancialTotals();
                $scope.$apply();
            }
        }, { escape: true });
    };
    
    $scope.getExpenseRecords();
    // Load applicant details to calculate financial contribution totals
    $scope.getApplicantDetailsForTotals();
    
    // NEW METHOD: Get expense records from Expense_Head__c and Expense_Line_Item__c
    $scope.getExpenseHeadLineItems = function () {
        if (!$rootScope.apaId) {
            console.log('APA Id not available yet');
            return;
        }
        
        ApplicantPortal_Contoller.getExpenseHeadLineItems($rootScope.apaId, function (result, event) {
            console.log('getExpenseHeadLineItems result:', result);
            if (event.status && result != null && result.lineItems != null) {
                // Clear existing arrays
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
                
                // Process line items and categorize by Expense_Type__c
                for (let i = 0; i < result.lineItems.length; i++) {
                    let item = result.lineItems[i];
                    let expenseType = item.Expense_Type__c;
                    
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
                    
                    // Create record object
                    let record = {
                        Id: item.Id,
                        Description__c: item.Description__c,
                        Position__c: item.Position__c,
                        Number__c: item.Number__c,
                        Person_Month__c: item.Person_Month__c,
                        Salary_Month__c: item.Salary_Month__c,
                        Unit_Price__c: item.Unit_Price__c,
                        Multiplier__c: item.Multiplier__c,
                        Year1_Expense__c: item.Year1_Expense__c || 0,
                        Year2_Expense__c: item.Year2_Expense__c || 0,
                        Year3_Expense__c: item.Year3_Expense__c || 0,
                        Total_Expense__c: item.Total_Expense__c || 0,
                        Index__c: item.Index__c,
                        Expense_Type__c: expenseType
                    };
                    
                    // Categorize by expense type
                    if (expenseType === 'Manpower') {
                        $scope.manPowerRecords.push(record);
                        $scope.manPower.Total_Year1_Expense__c = ($scope.manPower.Total_Year1_Expense__c || 0) + (item.Year1_Expense__c || 0);
                        $scope.manPower.Total_Year2_Expense__c = ($scope.manPower.Total_Year2_Expense__c || 0) + (item.Year2_Expense__c || 0);
                        $scope.manPower.Total_Year3_Expense__c = ($scope.manPower.Total_Year3_Expense__c || 0) + (item.Year3_Expense__c || 0);
                        $scope.manPower.Overall_Expense = ($scope.manPower.Overall_Expense || 0) + (item.Total_Expense__c || 0);
                    } else if (expenseType === 'Consumables/Materials') {
                        $scope.consumables.push(record);
                        $scope.consumableTotal.Total_Year1_Expense__c = ($scope.consumableTotal.Total_Year1_Expense__c || 0) + (item.Year1_Expense__c || 0);
                        $scope.consumableTotal.Total_Year2_Expense__c = ($scope.consumableTotal.Total_Year2_Expense__c || 0) + (item.Year2_Expense__c || 0);
                        $scope.consumableTotal.Total_Year3_Expense__c = ($scope.consumableTotal.Total_Year3_Expense__c || 0) + (item.Year3_Expense__c || 0);
                        $scope.consumableTotal.Overall_Expense = ($scope.consumableTotal.Overall_Expense || 0) + (item.Total_Expense__c || 0);
                    } else if (expenseType === 'Equipment & Accessories') {
                        $scope.Equipment.push(record);
                        $scope.equipmentTotals.Total_Year1_Expense__c = ($scope.equipmentTotals.Total_Year1_Expense__c || 0) + (item.Year1_Expense__c || 0);
                        $scope.equipmentTotals.Total_Year2_Expense__c = ($scope.equipmentTotals.Total_Year2_Expense__c || 0) + (item.Year2_Expense__c || 0);
                        $scope.equipmentTotals.Total_Year3_Expense__c = ($scope.equipmentTotals.Total_Year3_Expense__c || 0) + (item.Year3_Expense__c || 0);
                        $scope.equipmentTotals.Overall_Expense = ($scope.equipmentTotals.Overall_Expense || 0) + (item.Total_Expense__c || 0);
                    } else if (expenseType === 'Travel & Networking') {
                        $scope.travel.push(record);
                        $scope.travelTotal.Total_Year1_Expense__c = ($scope.travelTotal.Total_Year1_Expense__c || 0) + (item.Year1_Expense__c || 0);
                        $scope.travelTotal.Total_Year2_Expense__c = ($scope.travelTotal.Total_Year2_Expense__c || 0) + (item.Year2_Expense__c || 0);
                        $scope.travelTotal.Total_Year3_Expense__c = ($scope.travelTotal.Total_Year3_Expense__c || 0) + (item.Year3_Expense__c || 0);
                        $scope.travelTotal.Overall_Expense = ($scope.travelTotal.Overall_Expense || 0) + (item.Total_Expense__c || 0);
                    } else if (expenseType === 'Overhead' || expenseType === 'Projektpauschale') {
                        $scope.overhead.push(record);
                        $scope.overheadCharges.Total_Year1_Expense__c = ($scope.overheadCharges.Total_Year1_Expense__c || 0) + (item.Year1_Expense__c || 0);
                        $scope.overheadCharges.Total_Year2_Expense__c = ($scope.overheadCharges.Total_Year2_Expense__c || 0) + (item.Year2_Expense__c || 0);
                        $scope.overheadCharges.Total_Year3_Expense__c = ($scope.overheadCharges.Total_Year3_Expense__c || 0) + (item.Year3_Expense__c || 0);
                        $scope.overheadCharges.Overall_Expense = ($scope.overheadCharges.Overall_Expense || 0) + (item.Total_Expense__c || 0);
                    } else if (expenseType === 'Contingency') {
                        $scope.contingency.push(record);
                        $scope.contingencyTotal.Total_Year1_Expense__c = ($scope.contingencyTotal.Total_Year1_Expense__c || 0) + (item.Year1_Expense__c || 0);
                        $scope.contingencyTotal.Total_Year2_Expense__c = ($scope.contingencyTotal.Total_Year2_Expense__c || 0) + (item.Year2_Expense__c || 0);
                        $scope.contingencyTotal.Total_Year3_Expense__c = ($scope.contingencyTotal.Total_Year3_Expense__c || 0) + (item.Year3_Expense__c || 0);
                        $scope.contingencyTotal.Overall_Expense = ($scope.contingencyTotal.Overall_Expense || 0) + (item.Total_Expense__c || 0);
                    } else if (expenseType === 'Subcontract/Outsourcing') {
                        $scope.outsourcing.push(record);
                        $scope.outsourcingTotal.Total_Year1_Expense__c = ($scope.outsourcingTotal.Total_Year1_Expense__c || 0) + (item.Year1_Expense__c || 0);
                        $scope.outsourcingTotal.Total_Year2_Expense__c = ($scope.outsourcingTotal.Total_Year2_Expense__c || 0) + (item.Year2_Expense__c || 0);
                        $scope.outsourcingTotal.Total_Year3_Expense__c = ($scope.outsourcingTotal.Total_Year3_Expense__c || 0) + (item.Year3_Expense__c || 0);
                        $scope.outsourcingTotal.Overall_Expense = ($scope.outsourcingTotal.Overall_Expense || 0) + (item.Total_Expense__c || 0);
                    }
                }
                
                // Add empty records if arrays are empty
                if ($scope.manPowerRecords.length === 0) {
                    $scope.manPowerRecords.push({ Description__c: '', Year1_Expense__c: 0, Year2_Expense__c: 0, Year3_Expense__c: 0, Total_Expense__c: 0 });
                }
                if ($scope.consumables.length === 0) {
                    $scope.consumables.push({ Description__c: '', Year1_Expense__c: 0, Year2_Expense__c: 0, Year3_Expense__c: 0, Total_Expense__c: 0 });
                }
                if ($scope.Equipment.length === 0) {
                    $scope.Equipment.push({ Description__c: '', Year1_Expense__c: 0, Year2_Expense__c: 0, Year3_Expense__c: 0, Total_Expense__c: 0 });
                }
                if ($scope.travel.length === 0) {
                    $scope.travel.push({ Description__c: '', Year1_Expense__c: 0, Year2_Expense__c: 0, Year3_Expense__c: 0, Total_Expense__c: 0 });
                }
                if ($scope.overhead.length === 0) {
                    $scope.overhead.push({ Description__c: '', Year1_Expense__c: 0, Year2_Expense__c: 0, Year3_Expense__c: 0, Total_Expense__c: 0 });
                }
                if ($scope.contingency.length === 0) {
                    $scope.contingency.push({ Description__c: '', Year1_Expense__c: 0, Year2_Expense__c: 0, Year3_Expense__c: 0, Total_Expense__c: 0 });
                }
                if ($scope.outsourcing.length === 0) {
                    $scope.outsourcing.push({ Description__c: '', Year1_Expense__c: 0, Year2_Expense__c: 0, Year3_Expense__c: 0, Total_Expense__c: 0 });
                }
                
                $scope.updateTotals();
                $scope.$apply();
            }
        }, { escape: true });
    };
    $scope.enableExpenseModule = function (index) {
        debugger;
        $scope.accId = index;
        $scope.expenseDetails = true;
        $scope.expenseTempList = [];
        if ($scope.expenseList.length > 0) {
            for (var i = 0; i < $scope.expenseList.length; i++) {
                $scope.expenseTempList.push()
            }
        }
        
        // First try to load expense line items from new structure
        // If apaId exists, load from new Expense_Line_Item__c structure and skip old expenseList processing
        if ($rootScope.apaId) {
            $scope.getExpenseHeadLineItems();
            // Return early to skip old expenseList processing
            // getExpenseHeadLineItems will populate the arrays asynchronously
            return;
        }
        
        // Fallback to old structure processing if apaId not available
        $scope.manPowerRecords = [];
        $scope.consumables = [];
        $scope.Equipment = [];
        $scope.travel = [];
        $scope.outsourcing = [];
        $scope.contingency = [];
        $scope.overhead = [];
        if ($scope.expenseList.length > 0) {
            console.log('expenseList ===> ' + $scope.expenseList);
            for (var i = 0; i < $scope.expenseList.length; i++) {
                if ($scope.expenseList[i].Description__c != undefined) {
                    $scope.expenseList[i].Description__c = $scope.expenseList[i].Description__c
                        .replace(/&amp;/g, '&')
                        .replace(/&#39;/g, '\'')
                        .replaceAll('&amp;amp;', '&')
                        .replaceAll('&amp;gt;', '>')
                        .replaceAll('&lt;', '<')
                        .replaceAll('lt;', '<')
                        .replaceAll('&gt;', '>')
                        .replaceAll('gt;', '>')
                        .replaceAll('&amp;', '&')
                        .replaceAll('amp;', '&')
                        .replaceAll('&quot;', '\'');
                }
                if ($scope.expenseList[i].Expense_Category__c) {
                    $scope.expenseList[i].Expense_Category__r.Name = $scope.expenseList[i].Expense_Category__r.Name
                        .replace(/&amp;/g, '&')
                        .replace(/&#39;/g, '\'')
                        .replaceAll('&amp;amp;', '&')
                        .replaceAll('&amp;gt;', '>')
                        .replaceAll('&lt;', '<')
                        .replaceAll('lt;', '<')
                        .replaceAll('&gt;', '>')
                        .replaceAll('gt;', '>')
                        .replaceAll('&amp;', '&')
                        .replaceAll('amp;', '&')
                        .replaceAll('&quot;', '\'');
                }
                // if($scope.expenseList[i].Expense_Head__r.Yearly_Expense__r.Expense_Master__r.Account__c==index){
                //     if($scope.expenseList[i].Expense_Head__r.Name==="Manpower"){
                //         $scope.manPowerRecords.push({Id:$scope.expenseList[i].Id,Description__c:$scope.expenseList[i].Description__c,Unit_Price__c:$scope.expenseList[i].Unit_Price__c,
                //             Multiplier__c:$scope.expenseList[i].Multiplier__c,Year1_Expense__c:$scope.expenseList[i].Year1_Expense__c,Year2_Expense__c:$scope.expenseList[i].Year2_Expense__c,
                //             Year3_Expense__c:$scope.expenseList[i].Year3_Expense__c,Total_Expense__c:$scope.expenseList[i].Total_Expense__c,Expense_Type__c:$scope.expenseList[i].Expense_Type__c,
                //             Position__c:$scope.expenseList[i].Position__c,Person_Month__c:$scope.expenseList[i].Person_Month__c,Salary_Month__c:$scope.expenseList[i].Salary_Month__c
                //         });
                //     }
                //     else if($scope.expenseList[i].Expense_Head__r.Name==="Consumables"){
                //         $scope.consumables.push({Id:$scope.expenseList[i].Id,Description__c:$scope.expenseList[i].Description__c,Unit_Price__c:$scope.expenseList[i].Unit_Price__c,
                //             Multiplier__c:$scope.expenseList[i].Multiplier__c,Year1_Expense__c:$scope.expenseList[i].Year1_Expense__c,Year2_Expense__c:$scope.expenseList[i].Year2_Expense__c,
                //             Year3_Expense__c:$scope.expenseList[i].Year3_Expense__c,Total_Expense__c:$scope.expenseList[i].Total_Expense__c,Expense_Type__c:$scope.expenseList[i].Expense_Type__c,
                //             Number__c:$scope.expenseList[i].Number__c
                //         });
                //     }
                //     else if($scope.expenseList[i].Expense_Head__r.Name==="Equipment"){
                //         $scope.Equipment.push({Id:$scope.expenseList[i].Id,Description__c:$scope.expenseList[i].Description__c,Unit_Price__c:$scope.expenseList[i].Unit_Price__c,
                //             Multiplier__c:$scope.expenseList[i].Multiplier__c,Year1_Expense__c:$scope.expenseList[i].Year1_Expense__c,Year2_Expense__c:$scope.expenseList[i].Year2_Expense__c,
                //             Year3_Expense__c:$scope.expenseList[i].Year3_Expense__c,Total_Expense__c:$scope.expenseList[i].Total_Expense__c,Expense_Type__c:$scope.expenseList[i].Expense_Type__c,
                //             Number__c:$scope.expenseList[i].Number__c
                //         });
                //     }
                //     else if($scope.expenseList[i].Expense_Head__r.Name==="Travel/Networking"){
                //         $scope.travel.push({Id:$scope.expenseList[i].Id,Description__c:$scope.expenseList[i].Description__c,Unit_Price__c:$scope.expenseList[i].Unit_Price__c,
                //             Multiplier__c:$scope.expenseList[i].Multiplier__c,Year1_Expense__c:$scope.expenseList[i].Year1_Expense__c,Year2_Expense__c:$scope.expenseList[i].Year2_Expense__c,
                //             Year3_Expense__c:$scope.expenseList[i].Year3_Expense__c,Total_Expense__c:$scope.expenseList[i].Total_Expense__c,Expense_Type__c:$scope.expenseList[i].Expense_Type__c,
                //             Number__c:$scope.expenseList[i].Number__c
                //         });
                //     }
                //     else if($scope.expenseList[i].Expense_Head__r.Name==="Overhead"){
                //         $scope.overhead.push({Id:$scope.expenseList[i].Id,Description__c:$scope.expenseList[i].Description__c,Unit_Price__c:$scope.expenseList[i].Unit_Price__c,
                //             Multiplier__c:$scope.expenseList[i].Multiplier__c,Year1_Expense__c:$scope.expenseList[i].Year1_Expense__c,Year2_Expense__c:$scope.expenseList[i].Year2_Expense__c,
                //             Year3_Expense__c:$scope.expenseList[i].Year3_Expense__c,Total_Expense__c:$scope.expenseList[i].Total_Expense__c,Expense_Type__c:$scope.expenseList[i].Expense_Type__c
                //         });
                //     }
                //     else if($scope.expenseList[i].Expense_Head__r.Name==="Contingency"){
                //         $scope.contingency.push({Id:$scope.expenseList[i].Id,Description__c:$scope.expenseList[i].Description__c,Unit_Price__c:$scope.expenseList[i].Unit_Price__c,
                //             Multiplier__c:$scope.expenseList[i].Multiplier__c,Year1_Expense__c:$scope.expenseList[i].Year1_Expense__c,Year2_Expense__c:$scope.expenseList[i].Year2_Expense__c,
                //             Year3_Expense__c:$scope.expenseList[i].Year3_Expense__c,Total_Expense__c:$scope.expenseList[i].Total_Expense__c,Expense_Type__c:$scope.expenseList[i].Expense_Type__c
                //         });
                //     }
                //     else if($scope.expenseList[i].Expense_Head__r.Name==="Outsourcing"){
                //         $scope.outsourcing.push({Id:$scope.expenseList[i].Id,Description__c:$scope.expenseList[i].Description__c,Unit_Price__c:$scope.expenseList[i].Unit_Price__c,
                //             Multiplier__c:$scope.expenseList[i].Multiplier__c,Year1_Expense__c:$scope.expenseList[i].Year1_Expense__c,Year2_Expense__c:$scope.expenseList[i].Year2_Expense__c,
                //             Year3_Expense__c:$scope.expenseList[i].Year3_Expense__c,Total_Expense__c:$scope.expenseList[i].Total_Expense__c,Expense_Type__c:$scope.expenseList[i].Expense_Type__c
                //         });
                //     }
                // }
                // if ($scope.expenseList[i].Expense_Category__r.Account__c == index) {
                if ($scope.expenseList[i].Expense_Category__r.Name === "Manpower") {
                    $scope.manPower.Total_Year1_Expense__c = Number((($scope.manPower.Total_Year1_Expense__c || 0) + ($scope.expenseList[i].Year1_Expense__c || 0)).toFixed(2));
                    $scope.manPower.Total_Year2_Expense__c = Number((($scope.manPower.Total_Year2_Expense__c || 0) + ($scope.expenseList[i].Year2_Expense__c || 0)).toFixed(2));
                    $scope.manPower.Total_Year3_Expense__c = Number((($scope.manPower.Total_Year3_Expense__c || 0) + ($scope.expenseList[i].Year3_Expense__c || 0)).toFixed(2));
                    $scope.manPower.Overall_Expense = Number(($scope.manPower.Total_Year1_Expense__c + $scope.manPower.Total_Year2_Expense__c + $scope.manPower.Total_Year3_Expense__c).toFixed(2));
                    $scope.manPowerRecords.push({
                        Id: $scope.expenseList[i].Id,
                        Description__c: $scope.expenseList[i].Description__c,
                        Number__c: $scope.expenseList[i].Number__c,
                        Unit_Price__c: $scope.expenseList[i].Unit_Price__c,
                        Year1_Expense__c: $scope.expenseList[i].Year1_Expense__c,
                        Year2_Expense__c: $scope.expenseList[i].Year2_Expense__c,
                        Year3_Expense__c: $scope.expenseList[i].Year3_Expense__c,
                        Total_Expense__c: $scope.expenseList[i].Total_Expense__c,
                        Position__c: $scope.expenseList[i].Position__c,
                        Person_Month__c: $scope.expenseList[i].Person_Month__c,
                        Salary_Month__c: $scope.expenseList[i].Salary_Month__c
                    });
                }
                else if ($scope.expenseList[i].Expense_Category__r.Name === "Consumables/Materials") {
                    $scope.consumableTotal.Total_Year1_Expense__c = Number((($scope.consumableTotal.Total_Year1_Expense__c || 0) + ($scope.expenseList[i].Year1_Expense__c || 0)).toFixed(2));
                    $scope.consumableTotal.Total_Year2_Expense__c = Number((($scope.consumableTotal.Total_Year2_Expense__c || 0) + ($scope.expenseList[i].Year2_Expense__c || 0)).toFixed(2));
                    $scope.consumableTotal.Total_Year3_Expense__c = Number((($scope.consumableTotal.Total_Year3_Expense__c || 0) + ($scope.expenseList[i].Year3_Expense__c || 0)).toFixed(2));
                    $scope.consumableTotal.Overall_Expense = Number(($scope.consumableTotal.Total_Year1_Expense__c + $scope.consumableTotal.Total_Year2_Expense__c + $scope.consumableTotal.Total_Year3_Expense__c).toFixed(2));
                    $scope.consumables.push({
                        Id: $scope.expenseList[i].Id,
                        Description__c: $scope.expenseList[i].Description__c,
                        Number__c: $scope.expenseList[i].Number__c,
                        Unit_Price__c: $scope.expenseList[i].Unit_Price__c,
                        Year1_Expense__c: $scope.expenseList[i].Year1_Expense__c,
                        Year2_Expense__c: $scope.expenseList[i].Year2_Expense__c,
                        Year3_Expense__c: $scope.expenseList[i].Year3_Expense__c,
                        Total_Expense__c: $scope.expenseList[i].Total_Expense__c,
                        Position__c: $scope.expenseList[i].Position__c,
                        Person_Month__c: $scope.expenseList[i].Person_Month__c,
                        Salary_Month__c: $scope.expenseList[i].Salary_Month__c
                    });
                }
                else if ($scope.expenseList[i].Expense_Category__r.Name === "Equipment & Accessories") {
                    $scope.equipmentTotals.Total_Year1_Expense__c = Number((($scope.equipmentTotals.Total_Year1_Expense__c || 0) + ($scope.expenseList[i].Year1_Expense__c || 0)).toFixed(2));
                    $scope.equipmentTotals.Total_Year2_Expense__c = Number((($scope.equipmentTotals.Total_Year2_Expense__c || 0) + ($scope.expenseList[i].Year2_Expense__c || 0)).toFixed(2));
                    $scope.equipmentTotals.Total_Year3_Expense__c = Number((($scope.equipmentTotals.Total_Year3_Expense__c || 0) + ($scope.expenseList[i].Year3_Expense__c || 0)).toFixed(2));
                    $scope.equipmentTotals.Overall_Expense = Number(($scope.equipmentTotals.Total_Year1_Expense__c + $scope.equipmentTotals.Total_Year2_Expense__c + $scope.equipmentTotals.Total_Year3_Expense__c).toFixed(2));
                    $scope.Equipment.push({
                        Id: $scope.expenseList[i].Id,
                        Description__c: $scope.expenseList[i].Description__c,
                        Number__c: $scope.expenseList[i].Number__c,
                        Unit_Price__c: $scope.expenseList[i].Unit_Price__c,
                        Year1_Expense__c: $scope.expenseList[i].Year1_Expense__c,
                        Year2_Expense__c: $scope.expenseList[i].Year2_Expense__c,
                        Year3_Expense__c: $scope.expenseList[i].Year3_Expense__c,
                        Total_Expense__c: $scope.expenseList[i].Total_Expense__c,
                        Position__c: $scope.expenseList[i].Position__c,
                        Person_Month__c: $scope.expenseList[i].Person_Month__c,
                        Salary_Month__c: $scope.expenseList[i].Salary_Month__c
                    });
                }
                else if ($scope.expenseList[i].Expense_Category__r.Name === "Travel & Networking") {
                    $scope.travelTotal.Total_Year1_Expense__c = Number((($scope.travelTotal.Total_Year1_Expense__c || 0) + ($scope.expenseList[i].Year1_Expense__c || 0)).toFixed(2));
                    $scope.travelTotal.Total_Year2_Expense__c = Number((($scope.travelTotal.Total_Year2_Expense__c || 0) + ($scope.expenseList[i].Year2_Expense__c || 0)).toFixed(2));
                    $scope.travelTotal.Total_Year3_Expense__c = Number((($scope.travelTotal.Total_Year3_Expense__c || 0) + ($scope.expenseList[i].Year3_Expense__c || 0)).toFixed(2));
                    $scope.travelTotal.Overall_Expense = Number(($scope.travelTotal.Total_Year1_Expense__c + $scope.travelTotal.Total_Year2_Expense__c + $scope.travelTotal.Total_Year3_Expense__c).toFixed(2));
                    $scope.travel.push({
                        Id: $scope.expenseList[i].Id,
                        Description__c: $scope.expenseList[i].Description__c,
                        Number__c: $scope.expenseList[i].Number__c,
                        Unit_Price__c: $scope.expenseList[i].Unit_Price__c,
                        Year1_Expense__c: $scope.expenseList[i].Year1_Expense__c,
                        Year2_Expense__c: $scope.expenseList[i].Year2_Expense__c,
                        Year3_Expense__c: $scope.expenseList[i].Year3_Expense__c,
                        Total_Expense__c: $scope.expenseList[i].Total_Expense__c,
                        Position__c: $scope.expenseList[i].Position__c,
                        Person_Month__c: $scope.expenseList[i].Person_Month__c,
                        Salary_Month__c: $scope.expenseList[i].Salary_Month__c
                    });
                }
                else if ($scope.expenseList[i].Expense_Category__r.Name === "Overhead" || $scope.expenseList[i].Expense_Category__r.Name === "Projektpauschale") {
                    $scope.overheadCharges.Total_Year1_Expense__c = Number((($scope.overheadCharges.Total_Year1_Expense__c || 0) + ($scope.expenseList[i].Year1_Expense__c || 0)).toFixed(2));
                    $scope.overheadCharges.Total_Year2_Expense__c = Number((($scope.overheadCharges.Total_Year2_Expense__c || 0) + ($scope.expenseList[i].Year2_Expense__c || 0)).toFixed(2));
                    $scope.overheadCharges.Total_Year3_Expense__c = Number((($scope.overheadCharges.Total_Year3_Expense__c || 0) + ($scope.expenseList[i].Year3_Expense__c || 0)).toFixed(2));
                    $scope.overheadCharges.Overall_Expense = Number(($scope.overheadCharges.Total_Year1_Expense__c + $scope.overheadCharges.Total_Year2_Expense__c + $scope.overheadCharges.Total_Year3_Expense__c).toFixed(2));
                    $scope.overhead.push({
                        Id: $scope.expenseList[i].Id,
                        Description__c: $scope.expenseList[i].Description__c,
                        Number__c: $scope.expenseList[i].Number__c,
                        Unit_Price__c: $scope.expenseList[i].Unit_Price__c,
                        Year1_Expense__c: $scope.expenseList[i].Year1_Expense__c,
                        Year2_Expense__c: $scope.expenseList[i].Year2_Expense__c,
                        Year3_Expense__c: $scope.expenseList[i].Year3_Expense__c,
                        Total_Expense__c: $scope.expenseList[i].Total_Expense__c,
                        Position__c: $scope.expenseList[i].Position__c,
                        Person_Month__c: $scope.expenseList[i].Person_Month__c,
                        Salary_Month__c: $scope.expenseList[i].Salary_Month__c
                    });
                }
                else if ($scope.expenseList[i].Expense_Category__r.Name === "Contingency") {
                    $scope.contingencyTotal.Total_Year1_Expense__c = Number((($scope.contingencyTotal.Total_Year1_Expense__c || 0) + ($scope.expenseList[i].Year1_Expense__c || 0)).toFixed(2));
                    $scope.contingencyTotal.Total_Year2_Expense__c = Number((($scope.contingencyTotal.Total_Year2_Expense__c || 0) + ($scope.expenseList[i].Year2_Expense__c || 0)).toFixed(2));
                    $scope.contingencyTotal.Total_Year3_Expense__c = Number((($scope.contingencyTotal.Total_Year3_Expense__c || 0) + ($scope.expenseList[i].Year3_Expense__c || 0)).toFixed(2));
                    $scope.contingencyTotal.Overall_Expense = Number(($scope.contingencyTotal.Total_Year1_Expense__c + $scope.contingencyTotal.Total_Year2_Expense__c + $scope.contingencyTotal.Total_Year3_Expense__c).toFixed(2));
                    $scope.contingency.push({
                        Id: $scope.expenseList[i].Id,
                        Description__c: $scope.expenseList[i].Description__c,
                        Number__c: $scope.expenseList[i].Number__c,
                        Unit_Price__c: $scope.expenseList[i].Unit_Price__c,
                        Year1_Expense__c: $scope.expenseList[i].Year1_Expense__c,
                        Year2_Expense__c: $scope.expenseList[i].Year2_Expense__c,
                        Year3_Expense__c: $scope.expenseList[i].Year3_Expense__c,
                        Total_Expense__c: $scope.expenseList[i].Total_Expense__c,
                        Position__c: $scope.expenseList[i].Position__c,
                        Person_Month__c: $scope.expenseList[i].Person_Month__c,
                        Salary_Month__c: $scope.expenseList[i].Salary_Month__c
                    });
                }
                else if ($scope.expenseList[i].Expense_Category__r.Name === "Subcontract/Outsourcing") {
                    $scope.outsourcingTotal.Total_Year1_Expense__c = Number((($scope.outsourcingTotal.Total_Year1_Expense__c || 0) + ($scope.expenseList[i].Year1_Expense__c || 0)).toFixed(2));
                    $scope.outsourcingTotal.Total_Year2_Expense__c = Number((($scope.outsourcingTotal.Total_Year2_Expense__c || 0) + ($scope.expenseList[i].Year2_Expense__c || 0)).toFixed(2));
                    $scope.outsourcingTotal.Total_Year3_Expense__c = Number((($scope.outsourcingTotal.Total_Year3_Expense__c || 0) + ($scope.expenseList[i].Year3_Expense__c || 0)).toFixed(2));
                    $scope.outsourcingTotal.Overall_Expense = Number(($scope.outsourcingTotal.Total_Year1_Expense__c + $scope.outsourcingTotal.Total_Year2_Expense__c + $scope.outsourcingTotal.Total_Year3_Expense__c).toFixed(2));
                    $scope.outsourcing.push({
                        Id: $scope.expenseList[i].Id,
                        Description__c: $scope.expenseList[i].Description__c,
                        Number__c: $scope.expenseList[i].Number__c,
                        Unit_Price__c: $scope.expenseList[i].Unit_Price__c,
                        Year1_Expense__c: $scope.expenseList[i].Year1_Expense__c,
                        Year2_Expense__c: $scope.expenseList[i].Year2_Expense__c,
                        Year3_Expense__c: $scope.expenseList[i].Year3_Expense__c,
                        Total_Expense__c: $scope.expenseList[i].Total_Expense__c,
                        Position__c: $scope.expenseList[i].Position__c,
                        Person_Month__c: $scope.expenseList[i].Person_Month__c,
                        Salary_Month__c: $scope.expenseList[i].Salary_Month__c
                    });
                }
                $scope.updateTotals();
                // }
            }
        }
        if ($scope.manPowerRecords.length <= 0) {
            $scope.manPowerRecords.push({
                "Position__c": "",
                "Person_Month__c": "",
                "Salary_Month__c": "",
                "Year1_Expense__c": undefined,
                "Year2_Expense__c": undefined,
                "Year3_Expense__c": undefined,
                "Total_Expense__c": undefined
                // "Expense_Type__c":""
            });
        }
        if ($scope.consumables.length <= 0) {
            $scope.consumables.push({
                "Description__c": "",
                "Unit_Price__c": "",
                "Number__c": "",
                "Year1_Expense__c": undefined,
                "Year2_Expense__c": undefined,
                "Year3_Expense__c": undefined,
                "Total_Expense__c": undefined
                // "Expense_Type__c":""
            });
        }
        if ($scope.Equipment.length <= 0) {
            $scope.Equipment.push({
                "Description__c": "",
                "Unit_Price__c": "",
                "Number__c": "",
                "Year1_Expense__c": undefined,
                "Year2_Expense__c": undefined,
                "Year3_Expense__c": undefined,
                "Total_Expense__c": undefined
                // "Expense_Type__c":""
            });
        }
        if ($scope.travel.length <= 0) {
            $scope.travel.push({
                "Description__c": "",
                "Unit_Price__c": "",
                "Number__c": "",
                "Year1_Expense__c": undefined,
                "Year2_Expense__c": undefined,
                "Year3_Expense__c": undefined,
                "Total_Expense__c": undefined
                // "Expense_Type__c":""
            });
        }
        if ($scope.overhead.length <= 0) {
            $scope.overhead.push({
                "Description__c": "",
                "Unit_Price__c": "",
                // "Multiplier__c":"",
                "Year1_Expense__c": undefined,
                "Year2_Expense__c": undefined,
                "Year3_Expense__c": undefined,
                "Total_Expense__c": undefined
                // "Expense_Type__c":""
            });
        }
        if ($scope.contingency.length <= 0) {
            $scope.contingency.push({
                "Description__c": "",
                "Unit_Price__c": "",
                // "Multiplier__c":"",
                "Year1_Expense__c": undefined,
                "Year2_Expense__c": undefined,
                "Year3_Expense__c": undefined,
                "Total_Expense__c": undefined
                // "Expense_Type__c":""
            });
        }
        if ($scope.outsourcing.length <= 0) {
            $scope.outsourcing.push({
                "Description__c": "",
                "Unit_Price__c": "",
                // "Multiplier__c":"",
                "Year1_Expense__c": undefined,
                "Year2_Expense__c": undefined,
                "Year3_Expense__c": undefined,
                "Total_Expense__c": undefined
                // "Expense_Type__c":""
            });
        }
        $scope.$apply();
    }

    // console.log('$scope.manPowerRecords::'+$scope.manPowerRecords);
    // $scope.proposalId = 'a081y0000029D81AAE';

    $scope.disableExpenseModule = function (index) {
        debugger;
        // console.log($scope.accList[index].Id);
        // $scope.expenseDetails = false;
        location.reload();
    }
    $scope.addRow = function (param1, param2) {
        debugger;
        // $scope.contactList.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        // $scope.ConsortiaDetials.Contacts.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        $scope.manPowerRecords.push({
            "Position__c": "",
            "Person_Month__c": "",
            "Salary_Month__c": "",
            "Year1_Expense__c": undefined,
            "Year2_Expense__c": undefined,
            "Year3_Expense__c": undefined,
            "Total_Expense__c": undefined
            // "Expense_Type__c":""
        });
        $scope.$apply();

    }
    $scope.addRowCon = function (param1, param2) {
        debugger;
        // $scope.contactList.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        // $scope.ConsortiaDetials.Contacts.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        $scope.consumables.push({
            "Description__c": "",
            "Unit_Price__c": "",
            "Number__c": "",
            "Year1_Expense__c": undefined,
            "Year2_Expense__c": undefined,
            "Year3_Expense__c": undefined,
            "Total_Expense__c": undefined
            // "Expense_Type__c":""
        });

    }
    $scope.addRowEquip = function (param1, param2) {
        debugger;
        // $scope.contactList.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        // $scope.ConsortiaDetials.Contacts.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        $scope.Equipment.push({
            "Description__c": "",
            "Unit_Price__c": "",
            "Number__c": "",
            "Year1_Expense__c": undefined,
            "Year2_Expense__c": undefined,
            "Year3_Expense__c": undefined,
            "Total_Expense__c": undefined
            // "Expense_Type__c":""
        });

    }
    $scope.addRowTravel = function (param1, param2) {
        debugger;
        // $scope.contactList.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        // $scope.ConsortiaDetials.Contacts.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        $scope.travel.push({
            "Description__c": "",
            "Unit_Price__c": "",
            "Number__c": "",
            "Year1_Expense__c": undefined,
            "Year2_Expense__c": undefined,
            "Year3_Expense__c": undefined,
            "Total_Expense__c": undefined
            // "Expense_Type__c":""
        });

    }
    $scope.addRowOverhead = function (param1, param2) {
        debugger;
        // $scope.contactList.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        // $scope.ConsortiaDetials.Contacts.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        $scope.overhead.push({
            "Description__c": "",
            "Unit_Price__c": "",
            // "Multiplier__c":"",
            "Year1_Expense__c": undefined,
            "Year2_Expense__c": undefined,
            "Year3_Expense__c": undefined,
            "Total_Expense__c": undefined
            // "Expense_Type__c":""
        });

    }
    $scope.addRowContingency = function (param1, param2) {
        debugger;
        // $scope.contactList.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        // $scope.ConsortiaDetials.Contacts.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        $scope.contingency.push({
            "Description__c": "",
            "Unit_Price__c": "",
            // "Multiplier__c":"",
            "Year1_Expense__c": undefined,
            "Year2_Expense__c": undefined,
            "Year3_Expense__c": undefined,
            "Total_Expense__c": undefined
            // "Expense_Type__c":""
        });

    }
    $scope.addRowOutsourcing = function (param1, param2) {
        debugger;
        // $scope.contactList.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        // $scope.ConsortiaDetials.Contacts.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
        $scope.outsourcing.push({
            "Description__c": "",
            "Unit_Price__c": "",
            // "Multiplier__c":"",
            "Year1_Expense__c": undefined,
            "Year2_Expense__c": undefined,
            "Year3_Expense__c": undefined,
            "Total_Expense__c": undefined
            // "Expense_Type__c":""
        });

    }

    $scope.deleteRow = function (param1, param2, Id) {
        debugger;
        if ($scope.manPowerRecords.length > 1) {
            $scope.manPowerRecords.splice(param2, 1);
        }
        if (Id != undefined) {
            $scope.deleteExpenseLineItems(Id);
        }
        $scope.manPower.Total_Year1_Expense__c = $scope.manPowerRecords.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year1_Expense__c;
        }, 0);
        $scope.manPower.Total_Year2_Expense__c = $scope.manPowerRecords.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year2_Expense__c;
        }, 0);
        $scope.manPower.Total_Year3_Expense__c = $scope.manPowerRecords.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year3_Expense__c;
        }, 0);
        $scope.manPower.Overall_Expense = $scope.manPowerRecords.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Total_Expense__c;
        }, 0);
        $scope.updateTotals();
    }
    $scope.deleteExpenseLineItems = function (Id) {
        ApplicantPortal_Contoller.deleteExpenseLineItem(Id, function (result, event) {
            debugger
            if (event.status) {
                debugger;
                swal("Expense Details", "Expense line item has been deleted successfully!");
                debugger;
            }
        });
    }
    $scope.deleteRowConsumables = function (param1, param2, Id) {
        debugger;
        if ($scope.consumables.length > 1) {
            $scope.consumables.splice(param2, 1);
        }
        if (Id != undefined) {
            $scope.deleteExpenseLineItems(Id);
        }
        $scope.consumableTotal.Total_Year1_Expense__c = $scope.consumables.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year1_Expense__c;
        }, 0);
        $scope.consumableTotal.Total_Year2_Expense__c = $scope.consumables.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year2_Expense__c;
        }, 0);
        $scope.consumableTotal.Total_Year3_Expense__c = $scope.consumables.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year3_Expense__c;
        }, 0);
        $scope.consumableTotal.Overall_Expense = $scope.consumables.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Total_Expense__c;
        }, 0);
        $scope.updateTotals();
    }
    $scope.deleteRowEquipment = function (param1, param2, Id) {
        debugger;
        if ($scope.Equipment.length > 1) {
            $scope.Equipment.splice(param2, 1);
        }
        if (Id != undefined) {
            $scope.deleteExpenseLineItems(Id);
        }
        $scope.equipmentTotals.Total_Year1_Expense__c = $scope.Equipment.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year1_Expense__c;
        }, 0);
        $scope.equipmentTotals.Total_Year2_Expense__c = $scope.Equipment.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year2_Expense__c;
        }, 0);
        $scope.equipmentTotals.Total_Year3_Expense__c = $scope.Equipment.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year3_Expense__c;
        }, 0);
        $scope.equipmentTotals.Overall_Expense = $scope.Equipment.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Total_Expense__c;
        }, 0);
        $scope.updateTotals();
    }
    $scope.deleteRowTravel = function (param1, param2, Id) {
        debugger;
        if ($scope.travel.length > 1) {
            $scope.travel.splice(param2, 1);
        }
        if (Id != undefined) {
            $scope.deleteExpenseLineItems(Id);
        }
        $scope.travelTotal.Total_Year1_Expense__c = $scope.travel.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year1_Expense__c;
        }, 0);
        $scope.travelTotal.Total_Year2_Expense__c = $scope.travel.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year2_Expense__c;
        }, 0);
        $scope.travelTotal.Total_Year3_Expense__c = $scope.travel.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year3_Expense__c;
        }, 0);
        $scope.travelTotal.Overall_Expense = $scope.travel.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Total_Expense__c;
        }, 0);
        $scope.updateTotals();
    }
    $scope.deleteRowOutsourcing = function (param1, param2, Id) {
        debugger;

        if ($scope.outsourcing.length > 1) {
            $scope.outsourcing.splice(param2, 1);
        }
        if (Id != undefined) {
            $scope.deleteExpenseLineItems(Id);
        }
        $scope.outsourcingTotal.Total_Year1_Expense__c = $scope.outsourcing.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year1_Expense__c;
        }, 0);
        $scope.outsourcingTotal.Total_Year2_Expense__c = $scope.outsourcing.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year2_Expense__c;
        }, 0);
        $scope.outsourcingTotal.Total_Year3_Expense__c = $scope.outsourcing.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year3_Expense__c;
        }, 0);
        $scope.outsourcingTotal.Overall_Expense = $scope.outsourcing.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Total_Expense__c;
        }, 0);
        $scope.updateTotals();
    }
    $scope.deleteRowContingency = function (param1, param2, Id) {
        debugger;

        if ($scope.contingency.length > 1) {
            $scope.contingency.splice(param2, 1);
        }
        if (Id != undefined) {
            $scope.deleteExpenseLineItems(Id);
        }
        $scope.contingencyTotal.Total_Year1_Expense__c = $scope.contingency.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year1_Expense__c;
        }, 0);
        $scope.contingencyTotal.Total_Year2_Expense__c = $scope.contingency.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year2_Expense__c;
        }, 0);
        $scope.contingencyTotal.Total_Year3_Expense__c = $scope.contingency.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year3_Expense__c;
        }, 0);
        $scope.contingencyTotal.Overall_Expense = $scope.contingency.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Total_Expense__c;
        }, 0);
        $scope.updateTotals();
    }
    $scope.deleteRowOverhead = function (param1, param2, Id) {
        debugger;
        if ($scope.overhead.length > 1) {
            $scope.overhead.splice(param2, 1);
        }
        if (Id != undefined) {
            $scope.deleteExpenseLineItems(Id);
        }
        $scope.overheadCharges.Total_Year1_Expense__c = $scope.overhead.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year1_Expense__c;
        }, 0);
        $scope.overheadCharges.Total_Year2_Expense__c = $scope.overhead.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year2_Expense__c;
        }, 0);
        $scope.overheadCharges.Total_Year3_Expense__c = $scope.overhead.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Year3_Expense__c;
        }, 0);
        $scope.overheadCharges.Overall_Expense = $scope.overhead.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.Total_Expense__c;
        }, 0);
        $scope.updateTotals();
    }

    $scope.hasValues = function (obj) {
        let hasValidValue = false;
        Object.keys(obj).forEach(key => {
            if (key === "$$hashKey") return; // skip this field
            let v = obj[key];
            // Check if it has a valid value
            if (v !== null && v !== undefined && v !== "" && v != 0) {
                hasValidValue = true;
            } else {
                // If not valid, make it null
                obj[key] = null;
            }
        });
        return hasValidValue;
    }

    $scope.validateExpense = function () {
        let inrFilter = angular.element(document.body).injector().get('$filter')('inrCurrency');
        let euroFilter = angular.element(document.body).injector().get('$filter')('euroCurrency');
        for (let i = 0; i < $scope.travel.length; i++) {
            if ($scope.travel[i].Description__c != 'Hosting German Partner'
                && ($scope.travel[i].Number__c == 0 || $scope.travel[i].Number__c == '' || $scope.travel[i].Number__c == NaN || $scope.travel[i].Number__c == undefined || $scope.travel[i].Number__c == null)
                && ($scope.travel[i].Unit_Price__c == 0 || $scope.travel[i].Unit_Price__c == '' || $scope.travel[i].Unit_Price__c == NaN || $scope.travel[i].Unit_Price__c == undefined || $scope.travel[i].Unit_Price__c == null)
                && ($scope.travel[i].Year1_Expense__c == 0 || $scope.travel[i].Year1_Expense__c == '' || $scope.travel[i].Year1_Expense__c == NaN || $scope.travel[i].Year1_Expense__c == undefined || $scope.travel[i].Year1_Expense__c == null)
                && ($scope.travel[i].Year2_Expense__c == 0 || $scope.travel[i].Year2_Expense__c == '' || $scope.travel[i].Year2_Expense__c == NaN || $scope.travel[i].Year2_Expense__c == undefined || $scope.travel[i].Year2_Expense__c == null)
                && ($scope.travel[i].Year3_Expense__c == 0 || $scope.travel[i].Year3_Expense__c == '' || $scope.travel[i].Year3_Expense__c == NaN || $scope.travel[i].Year3_Expense__c == undefined || $scope.travel[i].Year3_Expense__c == null)) {
                return {
                    isValid: false,
                    message: "Please enter some value in " + $scope.travel[i].Description__c + " as all the travel heads are mandatory!"
                };
            }
        }
        if ($scope.accList.Academia__c) {
            if ($scope.totals && $scope.financeDetails && $scope.financeDetails.IGSTC_Contribution__c && $scope.totals.Overall_Expense && ($scope.financeDetails.IGSTC_Contribution__c != $scope.totals.Overall_Expense)) {
                let errmsg = '';
                if ($scope.accList.BillingCountry == 'India') errmsg = "The total of expenses entered in this table cannot be greater or less than the amount requested from IGSTC in the previous stages which is " + inrFilter($scope.financeDetails.IGSTC_Contribution__c) + " !";
                if ($scope.accList.BillingCountry == 'Germany') errmsg = "The total of expenses entered in this table cannot be greater or less than the amount requested from IGSTC in the previous stages which is " + euroFilter($scope.financeDetails.IGSTC_Contribution__c) + " !";
                return {
                    isValid: false,
                    message: errmsg
                };
            }
        }
        if ($scope.accList.Industry__c) {
            if ($scope.totals && $scope.igstcFunding && $scope.igstcFunding.Total_Expense__c && $scope.totals.Overall_Expense && ($scope.igstcFunding.Total_Expense__c > $scope.totals.Overall_Expense)) {

                return {
                    isValid: false,
                    message: "IGSTC Funding cannot be greater than the Total expenses mentioned in the above table !"
                };
            }
            if ($scope.totals && $scope.igstcFunding && $scope.industryContr &&
                ((($scope.igstcFunding.Year1_Expense__c ? $scope.igstcFunding.Year1_Expense__c : 0)
                    + ($scope.industryContr.Year1_Expense__c ? $scope.industryContr.Year1_Expense__c : 0))
                    != $scope.totals.Total_Year1_Expense__c)) {

                return {
                    isValid: false,
                    message: "Your total expenses of year 1 have not been correctly divided into igstc funding and industry contribution as both of them don't add up to match the totals!"
                };
            }
            if ($scope.totals && $scope.igstcFunding && $scope.industryContr &&
                ((($scope.igstcFunding.Year2_Expense__c ? $scope.igstcFunding.Year2_Expense__c : 0)
                    + ($scope.industryContr.Year2_Expense__c ? $scope.industryContr.Year2_Expense__c : 0))
                    != $scope.totals.Total_Year2_Expense__c)) {

                return {
                    isValid: false,
                    message: "Your total expenses of year 2 have not been correctly divided into igstc funding and industry contribution as both of them don't add up to match the totals!"
                };
            }
            if ($scope.totals && $scope.igstcFunding && $scope.industryContr &&
                ((($scope.igstcFunding.Year3_Expense__c ? $scope.igstcFunding.Year3_Expense__c : 0)
                    + ($scope.industryContr.Year3_Expense__c ? $scope.industryContr.Year3_Expense__c : 0))
                    != $scope.totals.Total_Year3_Expense__c)) {

                return {
                    isValid: false,
                    message: "Your total expenses of year 3 have not been correctly divided into igstc funding and industry contribution as both of them don't add up to match the totals!"
                };
            }
            // if ($scope.totals && $scope.igstcFunding && $scope.igstcFunding.Total_Expense__c && $scope.totals.Overall_Expense && ($scope.igstcFunding.Total_Expense__c > $scope.totals.Overall_Expense / 2)) {
            //     swal("Error", "Total of IGSTC Funding should be <= 50% of total budget!", "error");
            //     return;
            // }
            if ($scope.financeDetails && $scope.igstcFunding && $scope.igstcFunding.Total_Expense__c && $scope.financeDetails.IGSTC_Contribution__c && ($scope.igstcFunding.Total_Expense__c != $scope.financeDetails.IGSTC_Contribution__c)) {
                let errmsg = '';
                if ($scope.accList.BillingCountry == 'India') errmsg = "IGSTC Funding cannot be greater or less than the Financial Contribution entered in the previous stages which is " + inrFilter($scope.financeDetails.IGSTC_Contribution__c) + " !";
                if ($scope.accList.BillingCountry == 'Germany') errmsg = "IGSTC Funding cannot be greater or less than the Financial Contribution entered in the previous stages which is " + euroFilter($scope.financeDetails.IGSTC_Contribution__c) + " !";
                return {
                    isValid: false,
                    message: errmsg
                };
            }
            if ($scope.financeDetails && $scope.industryContr && $scope.industryContr.Total_Expense__c && $scope.financeDetails.Own_Contribution__c && ($scope.industryContr.Total_Expense__c != $scope.financeDetails.Own_Contribution__c)) {
                let errmsg = '';
                if ($scope.accList.BillingCountry == 'India') errmsg = "Industry Contribution cannot be greater or less than the Financial Contribution entered in the previous stages which is " + inrFilter($scope.industryContr.Total_Expense__c) + " !";
                if ($scope.accList.BillingCountry == 'Germany') errmsg = "Industry Contribution cannot be greater or less than the Financial Contribution entered in the previous stages which is " + euroFilter($scope.industryContr.Total_Expense__c) + " !";
                return {
                    isValid: false,
                    message: errmsg
                };
            }
        }
        return { isValid: true };
    };

    $scope.submitExpense = function () {
        debugger;
        let validation = $scope.validateExpense();
        $scope.updatedApa = {
            'Id': $rootScope.apaId,
            'IGSTC_Funding_Year_1__c': $scope.igstcFunding.Year1_Expense__c,
            'IGSTC_Funding_Year_2__c': $scope.igstcFunding.Year2_Expense__c,
            'IGSTC_Funding_Year_3__c': $scope.igstcFunding.Year3_Expense__c,
            'Industry_Contribution_Year_1__c': $scope.industryContr.Year1_Expense__c,
            'Industry_Contribution_Year_2__c': $scope.industryContr.Year2_Expense__c,
            'Industry_Contribution_Year_3__c': $scope.industryContr.Year3_Expense__c
        }
        // for (let i = 0; i < $scope.travel.length; i++) {
        //     if ($scope.travel[i].Description__c != 'Hosting German Partner'
        //         && ($scope.travel[i].Number__c == 0 || $scope.travel[i].Number__c == '' || $scope.travel[i].Number__c == NaN || $scope.travel[i].Number__c == undefined || $scope.travel[i].Number__c == null)
        //         && ($scope.travel[i].Unit_Price__c == 0 || $scope.travel[i].Unit_Price__c == '' || $scope.travel[i].Unit_Price__c == NaN || $scope.travel[i].Unit_Price__c == undefined || $scope.travel[i].Unit_Price__c == null)
        //         && ($scope.travel[i].Year1_Expense__c == 0 || $scope.travel[i].Year1_Expense__c == '' || $scope.travel[i].Year1_Expense__c == NaN || $scope.travel[i].Year1_Expense__c == undefined || $scope.travel[i].Year1_Expense__c == null)
        //         && ($scope.travel[i].Year2_Expense__c == 0 || $scope.travel[i].Year2_Expense__c == '' || $scope.travel[i].Year2_Expense__c == NaN || $scope.travel[i].Year2_Expense__c == undefined || $scope.travel[i].Year2_Expense__c == null)
        //         && ($scope.travel[i].Year3_Expense__c == 0 || $scope.travel[i].Year3_Expense__c == '' || $scope.travel[i].Year3_Expense__c == NaN || $scope.travel[i].Year3_Expense__c == undefined || $scope.travel[i].Year3_Expense__c == null)) {
        //         swal("Error", "Please enter some value in " + $scope.travel[i].Description__c + " as all the travel heads are mandatory to fill!", "error");
        //         return;
        //     }
        // }
        // if ($scope.accList.Academia__c) {
        //     if ($scope.totals && $scope.financeDetails && $scope.financeDetails.IGSTC_Contribution__c && $scope.totals.Overall_Expense && ($scope.financeDetails.IGSTC_Contribution__c != $scope.totals.Overall_Expense)) {
        //         if ($scope.accList.BillingCountry == 'India') swal("Error", "The total of expenses entered in this table cannot be greater or less than the amount requested from IGSTC in the previous stages which is " + inrFilter($scope.financeDetails.IGSTC_Contribution__c) + " !", "error");
        //         if ($scope.accList.BillingCountry == 'Germany') swal("Error", "The total of expenses entered in this table cannot be greater or less than the amount requested from IGSTC in the previous stages which is " + euroFilter($scope.financeDetails.IGSTC_Contribution__c) + " !", "error");
        //         return;
        //     }
        // }
        // if ($scope.accList.Industry__c) {
        //     if ($scope.totals && $scope.igstcFunding && $scope.igstcFunding.Total_Expense__c && $scope.totals.Overall_Expense && ($scope.igstcFunding.Total_Expense__c > $scope.totals.Overall_Expense)) {
        //         swal("Error", "IGSTC Funding cannot be greater than the Total expenses mentioned in the above table !", "error");
        //         return;
        //     }
        //     if ($scope.totals && $scope.igstcFunding && $scope.industryContr &&
        //         ((($scope.igstcFunding.Year1_Expense__c ? $scope.igstcFunding.Year1_Expense__c : 0)
        //             + ($scope.industryContr.Year1_Expense__c ? $scope.industryContr.Year1_Expense__c : 0))
        //             != $scope.totals.Total_Year1_Expense__c)) {
        //         swal("Error", "Your total expenses of year 1 have not been correctly divided into igstc funding and industry contribution as both of them don't add up to match the totals!", "error");
        //         return;
        //     }
        //     if ($scope.totals && $scope.igstcFunding && $scope.industryContr &&
        //         ((($scope.igstcFunding.Year2_Expense__c ? $scope.igstcFunding.Year2_Expense__c : 0)
        //             + ($scope.industryContr.Year2_Expense__c ? $scope.industryContr.Year2_Expense__c : 0))
        //             != $scope.totals.Total_Year2_Expense__c)) {
        //         swal("Error", "Your total expenses of year 2 have not been correctly divided into igstc funding and industry contribution as both of them don't add up to match the totals!", "error");
        //         return;
        //     }
        //     if ($scope.totals && $scope.igstcFunding && $scope.industryContr &&
        //         ((($scope.igstcFunding.Year3_Expense__c ? $scope.igstcFunding.Year3_Expense__c : 0)
        //             + ($scope.industryContr.Year3_Expense__c ? $scope.industryContr.Year3_Expense__c : 0))
        //             != $scope.totals.Total_Year3_Expense__c)) {
        //         swal("Error", "Your total expenses of year 3 have not been correctly divided into igstc funding and industry contribution as both of them don't add up to match the totals!", "error");
        //         return;
        //     }
        //     // if ($scope.totals && $scope.igstcFunding && $scope.igstcFunding.Total_Expense__c && $scope.totals.Overall_Expense && ($scope.igstcFunding.Total_Expense__c > $scope.totals.Overall_Expense / 2)) {
        //     //     swal("Error", "Total of IGSTC Funding should be <= 50% of total budget!", "error");
        //     //     return;
        //     // }
        //     if ($scope.financeDetails && $scope.igstcFunding && $scope.igstcFunding.Total_Expense__c && $scope.financeDetails.IGSTC_Contribution__c && ($scope.igstcFunding.Total_Expense__c != $scope.financeDetails.IGSTC_Contribution__c)) {
        //         if ($scope.accList.BillingCountry == 'India') swal("Error", "IGSTC Funding cannot be greater or less than the Financial Contribution entered in the previous stages which is " + inrFilter($scope.financeDetails.IGSTC_Contribution__c) + " !", "error");
        //         if ($scope.accList.BillingCountry == 'Germany') swal("Error", "IGSTC Funding cannot be greater or less than the Financial Contribution entered in the previous stages which is " + euroFilter($scope.financeDetails.IGSTC_Contribution__c) + " !", "error");
        //         return;
        //     }
        //     if ($scope.financeDetails && $scope.industryContr && $scope.industryContr.Total_Expense__c && $scope.financeDetails.Own_Contribution__c && ($scope.industryContr.Total_Expense__c != $scope.financeDetails.Own_Contribution__c)) {
        //         if ($scope.accList.BillingCountry == 'India') swal("Error", "Industry Contribution cannot be greater or less than the Financial Contribution entered in the previous stages which is " + inrFilter($scope.industryContr.Total_Expense__c) + " !", "error");
        //         if ($scope.accList.BillingCountry == 'Germany') swal("Error", "Industry Contribution cannot be greater or less than the Financial Contribution entered in the previous stages which is " + euroFilter($scope.industryContr.Total_Expense__c) + " !", "error");
        //         return;
        //     }
        // }
        // Filter out empty records before saving
        $scope.manPowerRecords = $scope.manPowerRecords.filter(item => !(
            typeof item === "object" && !Array.isArray(item) && item !== null && !$scope.hasValues(item)
        ));
        $scope.consumables = $scope.consumables.filter(item => !(
            typeof item === "object" && !Array.isArray(item) && item !== null && !$scope.hasValues(item)
        ));
        $scope.Equipment = $scope.Equipment.filter(item => !(
            typeof item === "object" && !Array.isArray(item) && item !== null && !$scope.hasValues(item)
        ));
        $scope.travel = $scope.travel.filter(item => !(
            typeof item === "object" && !Array.isArray(item) && item !== null && !$scope.hasValues(item)
        ));
        $scope.overhead = $scope.overhead.filter(item => !(
            typeof item === "object" && !Array.isArray(item) && item !== null && !$scope.hasValues(item)
        ));
        $scope.contingency = $scope.contingency.filter(item => !(
            typeof item === "object" && !Array.isArray(item) && item !== null && !$scope.hasValues(item)
        ));
        $scope.outsourcing = $scope.outsourcing.filter(item => !(
            typeof item === "object" && !Array.isArray(item) && item !== null && !$scope.hasValues(item)
        ));
        // if($scope.accList.Industry__c){
        //     flag=false;
        //     for(let i=0; i<$scope.tempObj.length; i++){
        //     	rec = $scope.tempObj[i];
        //         if(rec.Description__c == 'Own Contribution'){
        //             flag = true;
        //             break;
        //         }
        //     }
        //     if(flag == false){
        //         swal('info','For Industry partners its Mandatory to add "Own Contribution". Check spelling if already added.','info');
        //             return false;
        //     }
        // }
        //$scope.tempObj = $scope.manPowerRecords;
        
        // NEW CODE: Combine all expense records into single list with Expense_Type__c
        let allExpenseLineItems = [];
        let indexCounter = 1;
        
        // Add Manpower records
        for (let i = 0; i < $scope.manPowerRecords.length; i++) {
            let rec = angular.copy($scope.manPowerRecords[i]);
            rec.Expense_Type__c = 'Manpower';
            rec.Index__c = indexCounter++;
            delete rec.$$hashKey;
            delete rec.Expense_Category__c;  // Remove old model field if present
            delete rec.Expense_Category__r;  // Remove old model relationship if present
            allExpenseLineItems.push(rec);
        }
        
        // Add Consumables records
        indexCounter = 1;
        for (let i = 0; i < $scope.consumables.length; i++) {
            let rec = angular.copy($scope.consumables[i]);
            rec.Expense_Type__c = 'Consumables/Materials';
            rec.Index__c = indexCounter++;
            delete rec.$$hashKey;
            delete rec.Expense_Category__c;
            delete rec.Expense_Category__r;
            allExpenseLineItems.push(rec);
        }
        
        // Add Equipment records
        indexCounter = 1;
        for (let i = 0; i < $scope.Equipment.length; i++) {
            let rec = angular.copy($scope.Equipment[i]);
            rec.Expense_Type__c = 'Equipment & Accessories';
            rec.Index__c = indexCounter++;
            delete rec.$$hashKey;
            delete rec.Expense_Category__c;
            delete rec.Expense_Category__r;
            allExpenseLineItems.push(rec);
        }
        
        // Add Travel records
        indexCounter = 1;
        for (let i = 0; i < $scope.travel.length; i++) {
            let rec = angular.copy($scope.travel[i]);
            rec.Expense_Type__c = 'Travel & Networking';
            rec.Index__c = indexCounter++;
            delete rec.$$hashKey;
            delete rec.Expense_Category__c;
            delete rec.Expense_Category__r;
            allExpenseLineItems.push(rec);
        }
        
        // Add Overhead records
        indexCounter = 1;
        for (let i = 0; i < $scope.overhead.length; i++) {
            let rec = angular.copy($scope.overhead[i]);
            rec.Expense_Type__c = 'Overhead';
            rec.Index__c = indexCounter++;
            delete rec.$$hashKey;
            delete rec.Expense_Category__c;
            delete rec.Expense_Category__r;
            allExpenseLineItems.push(rec);
        }
        
        // Add Contingency records
        indexCounter = 1;
        for (let i = 0; i < $scope.contingency.length; i++) {
            let rec = angular.copy($scope.contingency[i]);
            rec.Expense_Type__c = 'Contingency';
            rec.Index__c = indexCounter++;
            delete rec.$$hashKey;
            delete rec.Expense_Category__c;
            delete rec.Expense_Category__r;
            allExpenseLineItems.push(rec);
        }
        
        // Add Outsourcing records
        indexCounter = 1;
        for (let i = 0; i < $scope.outsourcing.length; i++) {
            let rec = angular.copy($scope.outsourcing[i]);
            rec.Expense_Type__c = 'Subcontract/Outsourcing';
            rec.Index__c = indexCounter++;
            delete rec.$$hashKey;
            delete rec.Expense_Category__c;
            delete rec.Expense_Category__r;
            allExpenseLineItems.push(rec);
        }
        
        console.log('allExpenseLineItems:', allExpenseLineItems);
        
        // Call new method that saves to Expense_Head__c and Expense_Line_Item__c
        ApplicantPortal_Contoller.createExpenseWithHeadAndLineItems(
            allExpenseLineItems, $rootScope.apaId, $scope.updatedApa,
            function (result, event) {
                if (event.status && result != null) {
                    debugger;
                    if (result.startsWith('error')) {
                        swal("Error", "Error saving expense details: " + result, "error");
                        return;
                    }
                    if (!validation.isValid) {
                        swal(
                            "Saved as Draft",
                            "Your data has been saved as draft.\n\n" +
                            "But cannot continue because:\n" +
                            validation.message,
                            "warning"
                        );
                        return;
                    }
                    swal("Expense Details", "Your Expense Detail has been saved Successfully");
                    $scope.redirectPageURL('Declartion_2plus2');
                    //$scope.enableExpenseModule();
                    //$scope.$apply();
                }
            }
        )
    }

    // $scope.calculateOtherField = function (exType) {
    //     debugger;
    //     if (exType === "man") {
    //         for (let i = 0; i < $scope.manPowerRecords.length; i++) {
    //             // $scope.manPowerRecords[i].Year1_Expense__c = ;
    //             // $scope.manPowerRecords[i].Year2_Expense__c = ;
    //             // $scope.manPowerRecords[i].Year3_Expense__c = ;
    //             $scope.manPowerRecords[i].Total_Expense__c = ($scope.manPowerRecords[i].Year1_Expense__c != undefined ? Number($scope.manPowerRecords[i].Year1_Expense__c) : 0)
    //                 + ($scope.manPowerRecords[i].Year2_Expense__c != undefined ? Number($scope.manPowerRecords[i].Year2_Expense__c) : 0)
    //                 + ($scope.manPowerRecords[i].Year3_Expense__c != undefined ? Number($scope.manPowerRecords[i].Year3_Expense__c) : 0);
    //         }
    //         $scope.manPower.Total_Year1_Expense__c = $scope.manPowerRecords.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year1_Expense__c ? currentValue.Year1_Expense__c : 0);
    //         }, 0);
    //         $scope.manPower.Total_Year2_Expense__c = $scope.manPowerRecords.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year2_Expense__c ? currentValue.Year2_Expense__c : 0);
    //         }, 0);
    //         $scope.manPower.Total_Year3_Expense__c = $scope.manPowerRecords.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year3_Expense__c ? currentValue.Year3_Expense__c : 0);
    //         }, 0);
    //         $scope.manPower.Overall_Expense = $scope.manPowerRecords.reduce(function (accumulator, currentValue) {
    //             return accumulator + currentValue.Total_Expense__c;
    //         }, 0);
    //     }
    //     else if (exType === "cons") {
    //         for (let i = 0; i < $scope.consumables.length; i++) {
    //             // $scope.consumables[i].Year1_Expense__c = ;
    //             // $scope.consumables[i].Year2_Expense__c = ;
    //             // $scope.consumables[i].Year3_Expense__c = ;
    //             $scope.consumables[i].Total_Expense__c = ($scope.consumables[i].Year1_Expense__c != undefined ? Number($scope.consumables[i].Year1_Expense__c) : 0)
    //                 + ($scope.consumables[i].Year2_Expense__c != undefined ? Number($scope.consumables[i].Year2_Expense__c) : 0)
    //                 + ($scope.consumables[i].Year3_Expense__c != undefined ? Number($scope.consumables[i].Year3_Expense__c) : 0);
    //         }
    //         $scope.consumableTotal.Total_Year1_Expense__c = $scope.consumables.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year1_Expense__c ? currentValue.Year1_Expense__c : 0);
    //         }, 0);
    //         $scope.consumableTotal.Total_Year2_Expense__c = $scope.consumables.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year2_Expense__c ? currentValue.Year2_Expense__c : 0);
    //         }, 0);
    //         $scope.consumableTotal.Total_Year3_Expense__c = $scope.consumables.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year3_Expense__c ? currentValue.Year3_Expense__c : 0);
    //         }, 0);
    //         $scope.consumableTotal.Overall_Expense = $scope.consumables.reduce(function (accumulator, currentValue) {
    //             return accumulator + currentValue.Total_Expense__c;
    //         }, 0);
    //     }
    //     else if (exType === "equi") {
    //         for (let i = 0; i < $scope.Equipment.length; i++) {
    //             // $scope.Equipment[i].Year1_Expense__c = ;
    //             // $scope.Equipment[i].Year2_Expense__c = ;
    //             // $scope.Equipment[i].Year3_Expense__c = ;
    //             $scope.Equipment[i].Total_Expense__c = ($scope.Equipment[i].Year1_Expense__c != undefined ? Number($scope.Equipment[i].Year1_Expense__c) : 0)
    //                 + ($scope.Equipment[i].Year2_Expense__c != undefined ? Number($scope.Equipment[i].Year2_Expense__c) : 0)
    //                 + ($scope.Equipment[i].Year3_Expense__c != undefined ? Number($scope.Equipment[i].Year3_Expense__c) : 0);
    //         }
    //         $scope.equipmentTotals.Total_Year1_Expense__c = $scope.Equipment.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year1_Expense__c ? currentValue.Year1_Expense__c : 0);
    //         }, 0);
    //         $scope.equipmentTotals.Total_Year2_Expense__c = $scope.Equipment.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year2_Expense__c ? currentValue.Year2_Expense__c : 0);
    //         }, 0);
    //         $scope.equipmentTotals.Total_Year3_Expense__c = $scope.Equipment.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year3_Expense__c ? currentValue.Year3_Expense__c : 0);
    //         }, 0);
    //         $scope.equipmentTotals.Overall_Expense = $scope.Equipment.reduce(function (accumulator, currentValue) {
    //             return accumulator + currentValue.Total_Expense__c;
    //         }, 0);
    //     }
    //     else if (exType === "travel") {
    //         for (let i = 0; i < $scope.travel.length; i++) {
    //             // $scope.travel[i].Year1_Expense__c = ;
    //             // $scope.travel[i].Year2_Expense__c = ;
    //             // $scope.travel[i].Year3_Expense__c = ;
    //             $scope.travel[i].Total_Expense__c = ($scope.travel[i].Year1_Expense__c != undefined ? Number($scope.travel[i].Year1_Expense__c) : 0)
    //                 + ($scope.travel[i].Year2_Expense__c != undefined ? Number($scope.travel[i].Year2_Expense__c) : 0)
    //                 + ($scope.travel[i].Year3_Expense__c != undefined ? Number($scope.travel[i].Year3_Expense__c) : 0);
    //         }
    //         $scope.travelTotal.Total_Year1_Expense__c = $scope.travel.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year1_Expense__c ? currentValue.Year1_Expense__c : 0);
    //         }, 0);
    //         $scope.travelTotal.Total_Year2_Expense__c = $scope.travel.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year2_Expense__c ? currentValue.Year2_Expense__c : 0);
    //         }, 0);
    //         $scope.travelTotal.Total_Year3_Expense__c = $scope.travel.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year3_Expense__c ? currentValue.Year3_Expense__c : 0);
    //         }, 0);
    //         $scope.travelTotal.Overall_Expense = $scope.travel.reduce(function (accumulator, currentValue) {
    //             return accumulator + currentValue.Total_Expense__c;
    //         }, 0);
    //     }
    //     else if (exType === "outsourcing") {
    //         for (let i = 0; i < $scope.outsourcing.length; i++) {
    //             // $scope.outsourcing[i].Year1_Expense__c = ;
    //             // $scope.outsourcing[i].Year2_Expense__c = ;
    //             // $scope.outsourcing[i].Year3_Expense__c = ;
    //             $scope.outsourcing[i].Total_Expense__c = ($scope.outsourcing[i].Year1_Expense__c != undefined ? Number($scope.outsourcing[i].Year1_Expense__c) : 0)
    //                 + ($scope.outsourcing[i].Year2_Expense__c != undefined ? Number($scope.outsourcing[i].Year2_Expense__c) : 0)
    //                 + ($scope.outsourcing[i].Year3_Expense__c != undefined ? Number($scope.outsourcing[i].Year3_Expense__c) : 0);
    //         }
    //         $scope.outsourcingTotal.Total_Year1_Expense__c = $scope.outsourcing.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year1_Expense__c ? currentValue.Year1_Expense__c : 0);
    //         }, 0);
    //         $scope.outsourcingTotal.Total_Year2_Expense__c = $scope.outsourcing.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year2_Expense__c ? currentValue.Year2_Expense__c : 0);
    //         }, 0);
    //         $scope.outsourcingTotal.Total_Year3_Expense__c = $scope.outsourcing.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year3_Expense__c ? currentValue.Year3_Expense__c : 0);
    //         }, 0);
    //         $scope.outsourcingTotal.Overall_Expense = $scope.outsourcing.reduce(function (accumulator, currentValue) {
    //             return accumulator + currentValue.Total_Expense__c;
    //         }, 0);
    //     }
    //     else if (exType === "contingency") {
    //         for (let i = 0; i < $scope.contingency.length; i++) {
    //             // $scope.contingency[i].Year1_Expense__c = ;
    //             // $scope.contingency[i].Year2_Expense__c = ;
    //             // $scope.contingency[i].Year3_Expense__c = ;
    //             $scope.contingency[i].Total_Expense__c = ($scope.contingency[i].Year1_Expense__c != undefined ? Number($scope.contingency[i].Year1_Expense__c) : 0)
    //                 + ($scope.contingency[i].Year2_Expense__c != undefined ? Number($scope.contingency[i].Year2_Expense__c) : 0)
    //                 + ($scope.contingency[i].Year3_Expense__c != undefined ? Number($scope.contingency[i].Year3_Expense__c) : 0);
    //         }
    //         $scope.contingencyTotal.Total_Year1_Expense__c = $scope.contingency.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year1_Expense__c ? currentValue.Year1_Expense__c : 0);
    //         }, 0);
    //         $scope.contingencyTotal.Total_Year2_Expense__c = $scope.contingency.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year2_Expense__c ? currentValue.Year2_Expense__c : 0);
    //         }, 0);
    //         $scope.contingencyTotal.Total_Year3_Expense__c = $scope.contingency.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year3_Expense__c ? currentValue.Year3_Expense__c : 0);
    //         }, 0);
    //         $scope.contingencyTotal.Overall_Expense = $scope.contingency.reduce(function (accumulator, currentValue) {
    //             return accumulator + currentValue.Total_Expense__c;
    //         }, 0);
    //     }
    //     else if (exType === "overhead") {
    //         for (let i = 0; i < $scope.overhead.length; i++) {
    //             // $scope.overhead[i].Year1_Expense__c = ;
    //             // $scope.overhead[i].Year2_Expense__c = ;
    //             // $scope.overhead[i].Year3_Expense__c = ;
    //             $scope.overhead[i].Total_Expense__c = ($scope.overhead[i].Year1_Expense__c != undefined ? Number($scope.overhead[i].Year1_Expense__c) : 0)
    //                 + ($scope.overhead[i].Year2_Expense__c != undefined ? Number($scope.overhead[i].Year2_Expense__c) : 0)
    //                 + ($scope.overhead[i].Year3_Expense__c != undefined ? Number($scope.overhead[i].Year3_Expense__c) : 0);
    //         }
    //         $scope.overheadCharges.Total_Year1_Expense__c = $scope.overhead.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year1_Expense__c ? currentValue.Year1_Expense__c : 0);
    //         }, 0);
    //         $scope.overheadCharges.Total_Year2_Expense__c = $scope.overhead.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year2_Expense__c ? currentValue.Year2_Expense__c : 0);
    //         }, 0);
    //         $scope.overheadCharges.Total_Year3_Expense__c = $scope.overhead.reduce(function (accumulator, currentValue) {
    //             return accumulator + (currentValue.Year3_Expense__c ? currentValue.Year3_Expense__c : 0);
    //         }, 0);
    //         $scope.overheadCharges.Overall_Expense = $scope.overhead.reduce(function (accumulator, currentValue) {
    //             return accumulator + currentValue.Total_Expense__c;
    //         }, 0);
    //     }
    //     else if (exType === "igstc") {
    //         // $scope.igstcFunding.Year1_Expense__c = ;
    //         // $scope.igstcFunding.Year2_Expense__c = ;
    //         // $scope.igstcFunding.Year3_Expense__c = ;
    //         $scope.igstcFunding.Total_Expense__c = ($scope.igstcFunding.Year1_Expense__c != undefined ? Number($scope.igstcFunding.Year1_Expense__c) : 0)
    //             + ($scope.igstcFunding.Year2_Expense__c != undefined ? Number($scope.igstcFunding.Year2_Expense__c) : 0)
    //             + ($scope.igstcFunding.Year3_Expense__c != undefined ? Number($scope.igstcFunding.Year3_Expense__c) : 0);
    //     }
    //     else if (exType === "ic") {
    //         // $scope.industryContr.Year1_Expense__c = ;
    //         // $scope.industryContr.Year2_Expense__c = ;
    //         // $scope.industryContr.Year3_Expense__c = ;
    //         $scope.industryContr.Total_Expense__c = ($scope.industryContr.Year1_Expense__c != undefined ? Number($scope.industryContr.Year1_Expense__c) : 0)
    //             + ($scope.industryContr.Year2_Expense__c != undefined ? Number($scope.industryContr.Year2_Expense__c) : 0)
    //             + ($scope.industryContr.Year3_Expense__c != undefined ? Number($scope.industryContr.Year3_Expense__c) : 0);
    //     }
    //     $scope.updateTotals();
    // }

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

    $scope.calculateYearField = function (exType) {
        debugger;
        if (exType === "man") {
            for (let i = 0; i < $scope.manPowerRecords.length; i++) {
                $scope.manPowerRecords[i].Year1_Expense__c = Number($scope.manPowerRecords[i].Multiplier__c * $scope.manPowerRecords[i].Unit_Price__c);
                $scope.manPowerRecords[i].Year2_Expense__c = Number($scope.manPowerRecords[i].Multiplier__c * $scope.manPowerRecords[i].Unit_Price__c);
                $scope.manPowerRecords[i].Year3_Expense__c = Number($scope.manPowerRecords[i].Multiplier__c * $scope.manPowerRecords[i].Unit_Price__c);
            }
        }
        else if (exType === "cons") {
            for (let i = 0; i < $scope.consumables.length; i++) {
                $scope.consumables[i].Year1_Expense__c = Number($scope.consumables[i].Multiplier__c * $scope.consumables[i].Unit_Price__c);
                $scope.consumables[i].Year2_Expense__c = Number($scope.consumables[i].Multiplier__c * $scope.consumables[i].Unit_Price__c);
                $scope.consumables[i].Year3_Expense__c = Number($scope.consumables[i].Multiplier__c * $scope.consumables[i].Unit_Price__c);
            }
        }
        else if (exType === "equi") {
            for (let i = 0; i < $scope.Equipment.length; i++) {
                $scope.Equipment[i].Year1_Expense__c = Number($scope.Equipment[i].Multiplier__c * $scope.Equipment[i].Unit_Price__c);
                $scope.Equipment[i].Year2_Expense__c = Number($scope.Equipment[i].Multiplier__c * $scope.Equipment[i].Unit_Price__c);
                $scope.Equipment[i].Year3_Expense__c = Number($scope.Equipment[i].Multiplier__c * $scope.Equipment[i].Unit_Price__c);
            }
        }
        else if (exType === "travel") {
            for (let i = 0; i < $scope.travel.length; i++) {
                $scope.travel[i].Year1_Expense__c = Number($scope.travel[i].Multiplier__c * $scope.travel[i].Unit_Price__c);
                $scope.travel[i].Year2_Expense__c = Number($scope.travel[i].Multiplier__c * $scope.travel[i].Unit_Price__c);
                $scope.travel[i].Year3_Expense__c = Number($scope.travel[i].Multiplier__c * $scope.travel[i].Unit_Price__c);
            }
        }
        else if (exType === "other") {
            for (let i = 0; i < $scope.other.length; i++) {
                $scope.other[i].Year1_Expense__c = Number($scope.other[i].Multiplier__c * $scope.other[i].Unit_Price__c);
                $scope.other[i].Year2_Expense__c = Number($scope.other[i].Multiplier__c * $scope.other[i].Unit_Price__c);
                $scope.other[i].Year3_Expense__c = Number($scope.other[i].Multiplier__c * $scope.other[i].Unit_Price__c);
            }
        }
        $scope.calculateOtherField(exType);
    }

    $scope.redirectPageURL = function (pageName) {
        debugger;
        swal({
            title: "Success",
            text: "Expense details have been saved successfully.",
            icon: "success",
            buttons: true,
            dangerMode: false,
        }).then((willDelete) => {
            if (willDelete) {
                var link = document.createElement("a");
                link.id = 'someLink'; //give it an ID!
                link.href = "#/" + pageName;
                link.click();
            } else {
                return;
            }
        });
        // var link=document.createElement("a");
        // link.id = 'someLink'; //give it an ID!
        // link.href="#/"+pageName;
        // link.click();
    }
});

// angular.module('cp_app').filter('inrCurrency', function () {
//     return function (input, symbol) {
//         if (isNaN(input)) return input;
//         symbol = symbol || '₹';  // Default symbol
//         let num = parseInt(input, 10); // remove decimals
//         let intPart = num.toString();
//         // Indian numbering format (last 3 digits, then groups of 2)
//         let lastThree = intPart.substring(intPart.length - 3);
//         let otherNumbers = intPart.substring(0, intPart.length - 3);
//         if (otherNumbers !== '') {
//             lastThree = ',' + lastThree;
//         }
//         let formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
//         return symbol + formatted;
//     };
// });

// angular.module('cp_app').filter('euroCurrency', function () {
//     return function (input, symbol) {
//         if (isNaN(input)) return input;
//         symbol = symbol || '€'; // Default Euro symbol
//         let num = parseInt(input, 10); // remove decimals
//         let intPart = num.toString();
//         // European grouping (every 3 digits from the right)
//         let formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//         return symbol + formatted;
//     };
// });

angular.module('cp_app').filter('inrCurrency', function () {
    return function (input, symbol) {
        if (isNaN(input)) return input;
        symbol = symbol || '₹';  // Default symbol
        let num = parseFloat(input).toFixed(2);
        // Split integer and decimal part
        let parts = num.split(".");
        let intPart = parts[0];
        let decPart = parts.length > 1 ? "." + parts[1] : "";
        // Indian numbering format (last 3 digits, then groups of 2)
        let lastThree = intPart.substring(intPart.length - 3);
        let otherNumbers = intPart.substring(0, intPart.length - 3);
        if (otherNumbers !== '') {
            lastThree = ',' + lastThree;
        }
        let formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        return symbol + formatted + decPart;
    };
});

angular.module('cp_app').filter('euroCurrency', function () {
    return function (input, symbol) {
        if (isNaN(input)) return input;
        symbol = symbol || '€'; // Default Euro symbol
        let num = parseFloat(input).toFixed(2);
        // Split integer and decimal part
        let parts = num.split(".");
        let intPart = parts[0];
        let decPart = parts.length > 1 ? "," + parts[1] : ""; // <-- use comma for decimals
        // European grouping (every 3 digits from the right)
        let formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return symbol + formatted + decPart;
    };
});

angular.module('cp_app').directive('euroInput', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            // Convert "8,99" → 8.99 for model
            ngModelCtrl.$parsers.push(function (viewValue) {
                if (!viewValue) return null;
                // Remove spaces
                let str = String(viewValue).replace(/\s+/g, '');
                // Replace comma with dot
                str = str.replace(',', '.');
                let parsed = parseFloat(str);
                return isNaN(parsed) ? null : parsed;
            });
            // Display model value exactly as user typed
            ngModelCtrl.$formatters.push(function (modelValue) {
                if (modelValue == null || modelValue === '') return '';
                // Convert decimal dot back to comma for UI
                return String(modelValue).replace('.', ',');
            });
            // Restrict user input to digits + single comma only
            element.on('keypress', function (e) {
                let key = e.which || e.keyCode;
                if (key <= 31 || e.ctrlKey || e.metaKey) return;
                let ch = String.fromCharCode(key);
                let val = element.val();
                // Allow digits and comma only
                if (!/[0-9,]/.test(ch)) {
                    e.preventDefault();
                    return;
                }
                // Prevent multiple commas
                if (ch === ',' && val.includes(',')) {
                    e.preventDefault();
                }
            });
            // Clean up pasted input
            element.on('input', function () {
                let val = element.val() || '';
                val = val.replace(/[^0-9,]/g, '');
                // Keep only first comma
                let parts = val.split(',');
                if (parts.length > 2) {
                    val = parts[0] + ',' + parts.slice(1).join('');
                }
                element.val(val);
            });
        }
    };
});