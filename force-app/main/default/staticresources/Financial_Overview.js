angular.module('cp_app').controller('financialCtrl', function ($scope, $rootScope) {
    debugger;

    // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }


    $scope.siteURL = siteURL;
    $rootScope.secondstage;
    //$rootScope.financialConDetails = financialConDetails;
    $scope.financialDetails = {};
    $scope.disable = false;
    $scope.disabled = true;
    $scope.input = [];
    $scope.financialOverViewList = [];
    var statusLoginHas = 0;
    $scope.finance = [];
    $scope.indianIndus = 0;
    $scope.indianAcademia = 0;
    $scope.germanIndus = 0;
    $scope.germanAcademia = 0;
    $scope.TotalContriIndianIndustry = 0;
    $scope.TotalContriIndianAcademia = 0;
    $scope.TotalContriGermanIndustry = 0;
    $scope.TotalContriGermanAcademia = 0;
    $rootScope.isPrimaryContact;
    $scope.disableBtn = false;
    $scope.hodeTableAskedFunding = false;
    if ($rootScope.isPrimaryContact == "true") {
        $scope.hodeTableAskedFunding = true;
    }

    $scope.getApplicantDeetails = function () {
        ApplicantPortal_Contoller.getProjectDetailsDetails($rootScope.proposalId, function (result, event) {
            if (event.status) {
                debugger;
                console.log(result);
                debugger;
                for (var i = 0; i < result.length; i++) {
                    if (result[i].Financial_Contribution__r != undefined) {
                        if (result[i].Financial_Contribution__r[0].Total__c == 'NaN' || result[i].Financial_Contribution__r[0].Total__c == '' || result[i].Financial_Contribution__r[0].Total__c == undefined) {
                            result[i].Financial_Contribution__r[0].Total__c = 0;
                        }
                        if (result[i].Financial_Contribution__r[0].Own_Contribution__c == 'NaN' || result[i].Financial_Contribution__r[0].Own_Contribution__c == '' || result[i].Financial_Contribution__r[0].Own_Contribution__c == undefined) {
                            result[i].Financial_Contribution__r[0].Own_Contribution__c = 0;
                        }
                        if (result[i].Financial_Contribution__r[0].IGSTC_Contribution__c == 'NaN' || result[i].Financial_Contribution__r[0].IGSTC_Contribution__c == '' || result[i].Financial_Contribution__r[0].IGSTC_Contribution__c == undefined) {
                            result[i].Financial_Contribution__r[0].IGSTC_Contribution__c = 0;
                        }
                        if (result[i].Financial_Contribution__r[0].Budget_for_Capital_Expenditure__c == 'NaN' || result[i].Financial_Contribution__r[0].Budget_for_Capital_Expenditure__c == '' || result[i].Financial_Contribution__r[0].Budget_for_Capital_Expenditure__c == undefined) {
                            result[i].Financial_Contribution__r[0].Budget_for_Capital_Expenditure__c = 0;
                        }
                        if (result[i].Financial_Contribution__r[0].Budget_for_Recurring_Expenditure__c == 'NaN' || result[i].Financial_Contribution__r[0].Budget_for_Recurring_Expenditure__c == '' || result[i].Financial_Contribution__r[0].Budget_for_Recurring_Expenditure__c == undefined) {
                            result[i].Financial_Contribution__r[0].Budget_for_Recurring_Expenditure__c = 0;
                        }
                    }
                    else {
                        result[i].Financial_Contribution__r = [];
                        result[i].Financial_Contribution__r.push({ Applicant_Proposal_Association__c: result[i].Id, Total__c: 0, Own_Contribution__c: 0, IGSTC_Contribution__c: 0, Asked_From_IGSTC__c: 0, Budget_for_Capital_Expenditure__c: 0, Budget_for_Recurring_Expenditure__c: 0 });
                    }
                }
                $scope.applicantDetails = result;
                if ($rootScope.isPrimaryContact == "true") {
                    $scope.input = result;
                }
                $scope.indianIndus = 0;
                $scope.indianAcademia = 0;
                $scope.germanIndus = 0;
                $scope.germanAcademia = 0;
                for (var i = 0; i < $scope.applicantDetails.length; i++) {
                    if ($rootScope.isPrimaryContact == "false") {
                        statusLoginHas = 0;
                        if ($scope.applicantDetails[i].Contact__r && $scope.applicantDetails[i].Contact__r.Login_Hash_Code__c == $rootScope.candidateId) {
                            $scope.input.push($scope.applicantDetails[i]);
                            statusLoginHas = 1;
                        }
                        // if ($scope.applicantDetails[i].Contacts != undefined){
                        // for (j = 0; j < $scope.applicantDetails[i].Contacts.length; j++) {
                        //     if ($scope.applicantDetails[i].Contacts[j].Login_Hash_Code__c == $rootScope.userId) {
                        //         $scope.input.push($scope.applicantDetails[i]);
                        //         statusLoginHas=1;
                        //     }
                        //  }
                        // }
                        if (statusLoginHas == 0) {
                            $scope.financialOverViewList.push($scope.applicantDetails[i]);
                        }
                    }
                    console.log("financial contribution");
                    console.log($scope.input);

                    if ($scope.applicantDetails[i].Financial_Contribution__r != undefined) {
                        for (var j = 0; j < $scope.applicantDetails[i].Financial_Contribution__r.length; j++) {
                            if ($scope.applicantDetails[i].Contact__r.Account.BillingCountry == "India" && $scope.applicantDetails[i].Contact__r.Account.Industry__c == true) {
                                $scope.indianIndus = Number($scope.indianIndus) + Number($scope.applicantDetails[i].Financial_Contribution__r[j].IGSTC_Contribution__c);
                                //$scope.OwnContr=Number($scope.OwnContr)+Number($scope.applicantDetails[i].Financial_Contribution__r[j].Own_Contribution__c);                    
                            } else if ($scope.applicantDetails[i].Contact__r.Account.BillingCountry == "India" && $scope.applicantDetails[i].Contact__r.Account.Academia__c == true) {
                                $scope.indianAcademia = Number($scope.indianAcademia) + Number($scope.applicantDetails[i].Financial_Contribution__r[j].IGSTC_Contribution__c);
                            } else if ($scope.applicantDetails[i].Contact__r.Account.BillingCountry == "Germany" && $scope.applicantDetails[i].Contact__r.Account.Industry__c == true) {
                                $scope.germanIndus = Number($scope.germanIndus) + Number($scope.applicantDetails[i].Financial_Contribution__r[j].IGSTC_Contribution__c);
                            } else {
                                $scope.germanAcademia = Number($scope.germanAcademia) + Number($scope.applicantDetails[i].Financial_Contribution__r[j].IGSTC_Contribution__c);
                            }

                            $scope.TotalIndianContribution = Number($scope.indianIndus) + Number($scope.indianAcademia);
                            $scope.TotalGermanContribution = Number($scope.germanIndus) + Number($scope.germanAcademia);
                            // $scope.TotalContriIndianIndustry=$scope.OwnContr;   
                            $scope.TotalContriIndianIndustry = $scope.indianIndus;
                            $scope.TotalContriIndianAcademia = $scope.indianAcademia;
                            $scope.TotalContriGermanIndustry = $scope.germanIndus;
                            $scope.TotalContriGermanAcademia = $scope.germanAcademia;
                        }
                    }
                    //         if($scope.applicantDetails[i].Financial_Contribution__r != undefined){
                    //             for(var j=0;j<$scope.applicantDetails[i].Financial_Contribution__r.length;j++){
                    //                 if($scope.applicantDetails[i].BillingCountry == "India" && $scope.applicantDetails[i].Industry__c == true){
                    //                     $scope.indianIndus = $scope.applicantDetails[i].Financial_Contribution__r[j].IGSTC_Contribution__c ;
                    //                 }else if($scope.applicantDetails[i].BillingCountry == "India" && $scope.applicantDetails[i].Academia__c == true){
                    //                     $scope.indianAcademia = $scope.applicantDetails[i].Financial_Contribution__r[j].IGSTC_Contribution__c ;
                    //                 }else if($scope.applicantDetails[i].BillingCountry == "Germany" && $scope.applicantDetails[i].Industry__c == true){
                    //                     $scope.germanIndus = $scope.applicantDetails[i].Financial_Contribution__r[j].IGSTC_Contribution__c ;
                    //                 }else{
                    //                     $scope.germanAcademia = $scope.applicantDetails[i].Financial_Contribution__r[j].IGSTC_Contribution__c ;
                    //                 }

                    //                 $scope.TotalIndianContribution = Number($scope.indianIndus) + Number($scope.indianAcademia);
                    //                 $scope.TotalGermanContribution = Number($scope.germanIndus) + Number($scope.germanAcademia);
                    //     }
                    // }
                    //     if($scope.applicantDetails[i].Financial_Contribution__r != undefined){
                    //         for(var j=0;j<$scope.applicantDetails[i].Financial_Contribution__r.length;j++){
                    //         if($scope.applicantDetails[i].Financial_Contribution__r[j].Country__c == 'India' && $scope.applicantDetails[i].Financial_Contribution__r[j].Account_Type__c == 'Industry'){
                    //             $scope.indianIndus = $scope.applicantDetails[i].Financial_Contribution__r[j].IGSTC_Contribution__c ;
                    //         }
                    //         if($scope.applicantDetails[i].Financial_Contribution__r[j].Country__c == 'India' && $scope.applicantDetails[i].Financial_Contribution__r[j].Account_Type__c == 'Academia'){
                    //             $scope.indianAcademia = $scope.applicantDetails[i].Financial_Contribution__r[j].IGSTC_Contribution__c ;
                    //         }
                    //         if($scope.applicantDetails[i].Financial_Contribution__r[j].Country__c == 'Germany' && $scope.applicantDetails[i].Financial_Contribution__r[j].Account_Type__c == 'Industry'){
                    //             $scope.germanIndus = $scope.applicantDetails[i].Financial_Contribution__r[j].IGSTC_Contribution__c ;
                    //         }
                    //         if($scope.applicantDetails[i].Financial_Contribution__r[j].Country__c == 'Germany' && $scope.applicantDetails[i].Financial_Contribution__r[j].Account_Type__c == 'Academia'){
                    //             $scope.germanAcademia = $scope.applicantDetails[i].Financial_Contribution__r[j].IGSTC_Contribution__c ;
                    //         }
                    //     }
                    // }
                }

                for (let i = 0; i < $scope.input.length; i++) {
                    var financialOverview = { "Name": $scope.input[i].Contact__r.Name, "Applicant_Proposal_Association__c": $scope.input[i].Id, "Own_Contribution__c": " ", "IGSTC_Contribution__c": "", "Budget_for_Capital_Expenditure__c": 0, "Budget_for_Recurring_Expenditure__c": 0 };
                    if ($scope.input[i].Financial_Contribution__r == undefined) {
                        var financeDet = [{ "Name": $scope.input[i].Contact__r.Name, "Applicant_Proposal_Association__c": $scope.input[i].Id, "Own_Contribution__c": " ", "IGSTC_Contribution__c": "", "Budget_for_Capital_Expenditure__c": 0, "Budget_for_Recurring_Expenditure__c": 0 }];
                        $scope.input[i].Financial_Contribution__r = financeDet;
                    }
                }
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }

    // $scope.totalAmount = 0;
    // $scope.changeHandler = function(){
    //     debugger;
    //     $scope.totalAmount = $scope.input[0].Financial_Contribution__r[0].IGSTC_Contribution__c+$scope.input[0].Financial_Contribution__r[0].Own_Contribution__c;
    //     console.log('$scope.input',$scope.input);
    //     console.log('InputBaski',$scope.totalAmount);
    // }
    $scope.getApplicantDeetails();
    $scope.calculateOtherField = function (index) {
        debugger;
        $scope.OwnContr = 0;
        $scope.indianIndus = 0;
        $scope.indianAcademia = 0;
        $scope.germanIndus = 0;
        $scope.germanAcademia = 0;
        for (var i = 0; i < $scope.applicantDetails.length; i++) {
            if ($scope.applicantDetails[i].Financial_Contribution__r != undefined) {
                for (var j = 0; j < $scope.applicantDetails[i].Financial_Contribution__r.length; j++) {
                    if ($scope.applicantDetails[i].Contact__r.Account.BillingCountry == "India" && $scope.applicantDetails[i].Contact__r.Account.Industry__c == true) {
                        $scope.indianIndus = Number($scope.indianIndus) + Number($scope.applicantDetails[i].Financial_Contribution__r[j].IGSTC_Contribution__c);
                        //$scope.OwnContr=Number($scope.OwnContr)+Number($scope.applicantDetails[i].Financial_Contribution__r[j].Own_Contribution__c);                    
                    } else if ($scope.applicantDetails[i].Contact__r.Account.BillingCountry == "India" && $scope.applicantDetails[i].Contact__r.Account.Academia__c == true) {
                        $scope.indianAcademia = Number($scope.indianAcademia) + Number($scope.applicantDetails[i].Financial_Contribution__r[j].IGSTC_Contribution__c);
                    } else if ($scope.applicantDetails[i].Contact__r.Account.BillingCountry == "Germany" && $scope.applicantDetails[i].Contact__r.Account.Industry__c == true) {
                        $scope.germanIndus = Number($scope.germanIndus) + Number($scope.applicantDetails[i].Financial_Contribution__r[j].IGSTC_Contribution__c);
                    } else {
                        $scope.germanAcademia = Number($scope.germanAcademia) + Number($scope.applicantDetails[i].Financial_Contribution__r[j].IGSTC_Contribution__c);
                    }

                    $scope.TotalIndianContribution = Number($scope.indianIndus) + Number($scope.indianAcademia);
                    $scope.TotalGermanContribution = Number($scope.germanIndus) + Number($scope.germanAcademia);

                    // $scope.TotalContriIndianIndustry=$scope.OwnContr;   
                    $scope.TotalContriIndianIndustry = $scope.indianIndus;
                    $scope.TotalContriIndianAcademia = $scope.indianAcademia;
                    $scope.TotalContriGermanIndustry = $scope.germanIndus;
                    $scope.TotalContriGermanAcademia = $scope.germanAcademia;
                }
            }
        }
        $scope.validateFinacialDet(index);
        
        // Calculate Total from IGSTC + Own Contribution
        var totalFromContributions = Number($scope.input[index].Financial_Contribution__r[0].IGSTC_Contribution__c || 0) + Number($scope.input[index].Financial_Contribution__r[0].Own_Contribution__c || 0);
        
        // Set Total to the contribution total (IGSTC + Own)
        $scope.input[index].Financial_Contribution__r[0].Total__c = totalFromContributions;
        
        // Calculate percentage
        if (totalFromContributions > 0) {
            $scope.input[index].Financial_Contribution__r[0].Asked_From_IGSTC__c = (Number($scope.input[index].Financial_Contribution__r[0].IGSTC_Contribution__c || 0) / totalFromContributions) * 100;
        } else {
            $scope.input[index].Financial_Contribution__r[0].Asked_From_IGSTC__c = 0;
        }
    }
    $scope.validateFinacialDet = function (index) {
        debugger
        $scope.disableBtn = false;
        var FisrtAccountCountry = $scope.input[index].Contact__r.Account.BillingCountry;
        var FirstAccountAcademia = $scope.input[index].Contact__r.Account.Academia__c;
        var FirstAccountIndustry = $scope.input[index].Contact__r.Account.Industry__c;
        var FisrtAccountIGSTContri = $scope.input[index].Financial_Contribution__r[0].IGSTC_Contribution__c;
        var SecondAccountAcademia = [];
        var SecondAccountIndustry = [];
        var SecondAccountIGSTCContr = [];

        if ($rootScope.isPrimaryContact == "true") {
            for (var i = 0; i < $scope.input.length; i++) {
                if ($scope.input[i].Contact__r.Account.BillingCountry == FisrtAccountCountry && $scope.input[i].Id != $scope.input[index].Id) {
                    SecondAccountAcademia.push($scope.input[i].Contact__r.Account.Academia__c);
                    SecondAccountIndustry.push($scope.input[i].Contact__r.Account.Industry__c);
                    SecondAccountIGSTCContr.push($scope.input[i].Financial_Contribution__r[0].IGSTC_Contribution__c);
                }
            }
        }
        else {
            for (var i = 0; i < $scope.applicantDetails.length; i++) {
                if ($scope.applicantDetails[i].Contact__r.Account.BillingCountry == FisrtAccountCountry && $scope.applicantDetails[i].Id != $scope.applicantDetails[index].Id) {
                    SecondAccountAcademia.push($scope.applicantDetails[i].Contact__r.Account.Academia__c);
                    SecondAccountIndustry.push($scope.applicantDetails[i].Contact__r.Account.Industry__c);
                    SecondAccountIGSTCContr.push($scope.applicantDetails[i].Financial_Contribution__r[0].IGSTC_Contribution__c);
                }
            }
        }
        // var TotalContri=FisrtAccountIGSTContri;
        var TotalContri = 0;
        for (var i = 0; i < SecondAccountIGSTCContr.length; i++) {
            TotalContri = parseInt(TotalContri) + parseInt(SecondAccountIGSTCContr[i]);
        }
        if (FisrtAccountCountry == 'Germany' && TotalContri > 500000) {
            swal('info', 'For German partners max. limit for IGSTC funding is €500,000', 'info');
            //$("#total"+i+"").addClass('border-theme');
            return false;
        }
        else {
            if (FirstAccountAcademia) {
                if (TotalContri > 35000000) {
                    swal('info', 'For Indian partners max. limit for IGSTC funding is Rs. 35,000,000', 'info');
                    //$("#total"+i+"").addClass('border-theme');
                    $scope.disableBtn = true;
                    return false;
                }
            } else {
                if (FisrtAccountIGSTContri > 15000000) {
                    swal('info', 'For Indian industry max. limit for IGSTC funding is Rs. 15,000,000', 'info');
                    //$("#total"+i+"").addClass('border-theme');
                    $scope.disableBtn = true;
                    return false;
                }
                if (TotalContri > 35000000) {
                    swal('info', 'For Indian partners max. limit for IGSTC funding is Rs. 35,000,000', 'info');
                    //$("#total"+i+"").addClass('border-theme');
                    $scope.disableBtn = true;
                    return false;
                }
            }
        }
        return true;
    }
    let indianIndustryContri;

    // $scope.submitFinancialDetails = function () {
    //     debugger;
    //     var financialList = [];
    //     $scope.disableBtn = false;
    //     financialList = $scope.input;

    //     for (let i = 0; i < financialList.length; i++) {
    //         if (financialList[i].Financial_Contribution__r != undefined) {
    //             for (let j = 0; j < financialList[i].Financial_Contribution__r.length; j++) {
    //                 //Added by Aman 10th Oct 2023 : Check the Industry Contribution
    //                 if (financialList[i].Contact__r.Account.BillingCountry == 'India' && financialList[i].Contact__r.Account.Industry__c == true && financialList[i].Financial_Contribution__r[j].Own_Contribution__c < financialList[i].Financial_Contribution__r[j].IGSTC_Contribution__c) {
    //                     swal("Financial Details", "For Indian Industry, Own Contribution should not be less than IGSTC contribution.");
    //                     $("#own" + i + "").addClass('border-theme');
    //                     return;
    //                 }
    //                 //Modified by Aman 30th Aug 2023 : financialList[i].BillingCountry as financialList[i].Financial_Contribution__r[j].Country__c not filling in start
    //                 if (financialList[i].Financial_Contribution__r[j].Country__c == 'India' && financialList[i].Financial_Contribution__r[j].Account_Type__c == 'Industry') {
    //                     // if (financialList[i].BillingCountry == 'India' && financialList[i].Financial_Contribution__r[j].Account_Type__c == 'Industry') {
    //                     indianIndustryContri = financialList[i].Financial_Contribution__r[j].IGSTC_Contribution__c;
    //                 }
    //             }
    //         }
    //     }
    //     for (let i = 0; i < financialList.length; i++) {
    //         if ($rootScope.accountId == financialList[i].Id) {
    //             for (let j = 0; j < financialList[i].Financial_Contribution__r.length; j++) {
    //                 if (financialList[i].Financial_Contribution__r[j].Own_Contribution__c == undefined || financialList[i].Financial_Contribution__r[j].Own_Contribution__c === "") {
    //                     swal("Financial Details", "Please Enter Own Contribution.");
    //                     $("#own" + j + "").addClass('border-theme');
    //                     return;
    //                 }
    //                 if (financialList[i].Financial_Contribution__r[j].IGSTC_Contribution__c == undefined || financialList[i].Financial_Contribution__r[j].IGSTC_Contribution__c === "") {
    //                     swal("Financial Details", "Please Enter IGSTC Contribution.");
    //                     $("#igstc" + j + "").addClass('border-theme');
    //                     return;
    //                 }
    //                 if (financialList[i].Financial_Contribution__r[j].Own_Contribution__c < 0) {
    //                     swal("Financial Details", "Own Contribution should not be less than 0.");
    //                     $("#own" + j + "").addClass('border-theme');
    //                     return;
    //                 }
    //                 if (financialList[i].Financial_Contribution__r[j].IGSTC_Contribution__c <= 0) {
    //                     swal("Financial Details", "IGSTC Contribution should be greater than 0.");
    //                     $("#igstc" + j + "").addClass('border-theme');
    //                     return;
    //                 }
    //                 if (financialList[i].Contact__r.Account.BillingCountry == 'India' && financialList[i].Contact__r.Account.Academia__c == true && (financialList[i].Financial_Contribution__r[j].IGSTC_Contribution__c > 20000000 - indianIndustryContri || financialList[i].Financial_Contribution__r[j].IGSTC_Contribution__c > 20000000)) {
    //                     swal("Financial Details", "For Indian Academia, IGSTC Contribution should not be greater than Rs. 20,000,000 minus Indian Industry IGSTC contribution.");
    //                     $("#igstc" + j + "").addClass('border-theme');
    //                     return;
    //                 }
    //                 if (financialList[i].Contact__r.Account.BillingCountry == 'India' && financialList[i].Contact__r.Account.Academia__c == true && financialList[i].Financial_Contribution__r[j].IGSTC_Contribution__c > 20000000) {
    //                     swal("Financial Details", "IGSTC Contribution should not be greater than Rs. 20,000,000.");
    //                     $("#igstc" + j + "").addClass('border-theme');
    //                     return;
    //                 }
    //                 // if (financialList[i].BillingCountry == 'India' && financialList[i].Industry__c == true && financialList[i].Financial_Contribution__r[j].Own_Contribution__c < financialList[i].Financial_Contribution__r[j].IGSTC_Contribution__c ) {
    //                 //     swal("Financial Details", "For Indian Industry, Own Contribution should not be less than IGSTC contribution.");
    //                 //     $("#igstc"+j+"").addClass('border-theme');
    //                 //     return;
    //                 // }
    //                 if (financialList[i].Contact__r.Account.BillingCountry == 'India' && financialList[i].Contact__r.Account.Industry__c == true && financialList[i].Financial_Contribution__r[j].IGSTC_Contribution__c > 15000000) {
    //                     swal("Financial Details", "For Indian Industry, IGSTC Contribution should not be greater than 1.5cr.");
    //                     $("#igstc" + j + "").addClass('border-theme');
    //                     return;
    //                 }
    //                 if (financialList[i].Contact__r.Account.BillingCountry == 'Germany' && financialList[i].Contact__r.Account.Academia__c == true && financialList[i].Financial_Contribution__r[j].IGSTC_Contribution__c > 50000) {
    //                     swal("Financial Details", "For German Academia, IGSTC Contribution should not be greater than €50,000.");
    //                     $("#igstc" + j + "").addClass('border-theme');
    //                     return;
    //                 }
    //                 if (financialList[i].Contact__r.Account.BillingCountry == 'Germany' && financialList[i].Contact__r.Account.Industry__c == true && financialList[i].Financial_Contribution__r[j].IGSTC_Contribution__c > 50000) {
    //                     swal("Financial Details", "For German Industry, IGSTC Contribution should not be greater than €50,000.");
    //                     $("#igstc" + j + "").addClass('border-theme');
    //                     return;
    //                 }
    //                 // validation
    //                 var firstAccountId = financialList[i].Id;
    //                 for (var n = 0; n < 2; n++) {
    //                     var FisrtAccountCountry;
    //                     var FirstAccountAcademia;
    //                     var FisrtAccountIGSTContri;

    //                     if (n == 0) {
    //                         FisrtAccountCountry = financialList[i].Contact__r.Account.BillingCountry;
    //                         FirstAccountAcademia = financialList[i].Contact__r.Account.Academia__c;
    //                         FisrtAccountIGSTContri = financialList[i].Financial_Contribution__r[0].IGSTC_Contribution__c;
    //                     }
    //                     else {
    //                         for (var o = 0; o < $scope.applicantDetails.length; o++) {
    //                             if (FisrtAccountCountry != $scope.applicantDetails[o].Contact__r.Account.BillingCountry) {
    //                                 FisrtAccountCountry = $scope.applicantDetails[o].Contact__r.Account.BillingCountry;
    //                                 FirstAccountAcademia = $scope.applicantDetails[o].Contact__r.Account.Academia__c;
    //                                 FisrtAccountIGSTContri = $scope.applicantDetails[o].Financial_Contribution__r[0].IGSTC_Contribution__c;
    //                                 firstAccountId = $scope.applicantDetails[o].Id;
    //                                 break;
    //                             }
    //                         }
    //                     }

    //                     var SecondAccountAcademia = [];
    //                     var SecondAccountIndustry = [];
    //                     var SecondAccountIGSTCContr = [];

    //                     if ($rootScope.isPrimaryContact == "true") {
    //                         for (var k = 0; k < financialList.length; k++) {
    //                             if (financialList[k].Contact__r.Account.BillingCountry == FisrtAccountCountry && financialList[k].Id != firstAccountId) {
    //                                 SecondAccountAcademia.push(financialList[k].Contact__r.Account.Academia__c);
    //                                 SecondAccountIndustry.push(financialList[k].Contact__r.Account.Industry__c);
    //                                 SecondAccountIGSTCContr.push(financialList[k].Financial_Contribution__r[0].IGSTC_Contribution__c);
    //                             }
    //                         }
    //                     }
    //                     else {
    //                         for (var l = 0; l < $scope.applicantDetails.length; l++) {
    //                             if ($scope.applicantDetails[l].Contact__r.Account.BillingCountry == FisrtAccountCountry && $scope.applicantDetails[l].Id != firstAccountId) {
    //                                 SecondAccountAcademia.push($scope.applicantDetails[l].Contact__r.Account.Academia__c);
    //                                 SecondAccountIndustry.push($scope.applicantDetails[l].Contact__r.Account.Industry__c);
    //                                 SecondAccountIGSTCContr.push($scope.applicantDetails[l].Financial_Contribution__r[0].IGSTC_Contribution__c);
    //                             }
    //                         }
    //                     }
    //                     var TotalContri = FisrtAccountIGSTContri;
    //                     for (var m = 0; m < SecondAccountIGSTCContr.length; m++) {
    //                         TotalContri = parseInt(TotalContri) + parseInt(SecondAccountIGSTCContr[m]);
    //                         // TotalContri=TotalContri+SecondAccountIGSTCContr[m];
    //                     }
    //                     if (FisrtAccountCountry == 'Germany' && TotalContri > 50000) {
    //                         swal('info', 'For German partners max. limit for IGSTC funding is €50,000', 'info');
    //                         $scope.disableBtn = true;
    //                         return;
    //                     }
    //                     else {
    //                         if (FirstAccountAcademia) {
    //                             if (TotalContri > 35000000) {
    //                                 swal('info', 'For Indian partners max. limit for IGSTC funding is Rs. 35,000,000', 'info');
    //                                 $scope.disableBtn = true;
    //                                 return;
    //                             }
    //                         } else {
    //                             if (FisrtAccountIGSTContri > 15000000) {
    //                                 swal('info', 'For Indian industry max. limit for IGSTC funding is Rs. 15,000,000', 'info');
    //                                 $scope.disableBtn = true;
    //                                 return false;
    //                             }
    //                             if (TotalContri > 35000000) {
    //                                 swal('info', 'For Indian partners max. limit for IGSTC funding is Rs. 35000000', 'info');
    //                                 $scope.disableBtn = true;
    //                                 return;
    //                             }
    //                         }
    //                     }
    //                 }
    //                 // end validating
    //             }
    //         }
    //     }
    //     // var retResult=$scope.validateFinacialDet(0);
    //     // if(!retResult){
    //     //     return;
    //     // }
    //     debugger
    //     for (let i = 0; i < financialList.length; i++) {
    //         delete (financialList[i]['Name']);
    //         delete (financialList[i]['$$hashKey']);
    //         delete (financialList[i].Contacts);
    //         if (financialList[i].Financial_Contribution__r != undefined && financialList[i].Financial_Contribution__r.length > 0) {
    //             for (let j = 0; j < financialList[i].Financial_Contribution__r.length; j++) {
    //                 $scope.finance.push(financialList[i].Financial_Contribution__r[j]);
    //             }
    //         }
    //     }

    //     // for(var i=0;i<$scope.finance.length;i++){
    //     //     if($scope.finance[i].Own_Contribution__c == undefined || $scope.finance[i].Own_Contribution__c == ""){
    //     //         swal("Financial Details", "Please Enter your Own Contribution");
    //     //     }
    //     //     if($scope.finance[i].IGSTC_Contribution__c == undefined || $scope.finance[i].IGSTC_Contribution__c == ""){
    //     //         swal("Financial Details", "Please Enter IGSTC Contribution");
    //     //     }
    //     //     if($scope.finance[i].IGSTC_Contribution__c <= 0){
    //     //         swal("Financial Details", "Own Contribution should be greate than 0");
    //     //     }
    //     //     if($scope.finance[i].IGSTC_Contribution__c <= 0){
    //     //         swal("Financial Details", "IGSTC Contribution should be greate than 0");
    //     //     }
    //     // }
    //     $("#btnSubmit").html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Please wait...');
    //     ApplicantPortal_Contoller.insertFinancialDetails($scope.finance, function (result, event) {
    //         $("#btnSubmit").html('<i class="fa-solid fa-check me-2"></i>Save and Next');
    //         if (event.status) {
    //             debugger;
    //             swal({
    //                 title: "Success",
    //                 text: "Your Financial detail has been saved successfully.",
    //                 icon: "success",
    //                 buttons: true,
    //                 dangerMode: false,
    //             }).then((willDelete) => {
    //                 if (willDelete) {
    //                     $scope.redirectPageURL('ProjectDetail');
    //                     $scope.finance = result;
    //                     $scope.$apply();
    //                 } else {
    //                     return;
    //                 }
    //             });
    //             // Swal.fire(
    //             //     'Financial Detail',
    //             //     'Your Financial detail has been saved successfully.',
    //             //     'success'
    //             // );
    //             // $scope.redirectPageURL('ProjectDetail');
    //             // $scope.finance = result;
    //             // $scope.$apply();
    //         }
    //     },
    //         { escape: true }
    //     )
    // }

    $scope.submitFinancialDetails = function () {
        debugger;
        var financialList = [];
        $scope.disableBtn = false;
        financialList = $scope.input;

        // Calculate total German contribution first
        let totalGermanIGSTC = 0;
        let totalIndianIGSTC = 0;
        let indianIndustryContri = 0;

        // First pass: Calculate totals
        for (let i = 0; i < $scope.applicantDetails.length; i++) {
            if ($scope.applicantDetails[i].Financial_Contribution__r != undefined &&
                $scope.applicantDetails[i].Financial_Contribution__r.length > 0) {

                if ($scope.applicantDetails[i].Contact__r.Account.BillingCountry == 'Germany') {
                    totalGermanIGSTC += Number($scope.applicantDetails[i].Financial_Contribution__r[0].IGSTC_Contribution__c) || 0;
                }

                if ($scope.applicantDetails[i].Contact__r.Account.BillingCountry == 'India') {
                    totalIndianIGSTC += Number($scope.applicantDetails[i].Financial_Contribution__r[0].IGSTC_Contribution__c) || 0;

                    if ($scope.applicantDetails[i].Contact__r.Account.Industry__c == true) {
                        indianIndustryContri += Number($scope.applicantDetails[i].Financial_Contribution__r[0].IGSTC_Contribution__c) || 0;
                    }
                }
            }
        }

        // Check total German funding limit
        if (totalGermanIGSTC > 500000) {
            swal('Validation Error', `Total IGSTC funding for all German partners is €${totalGermanIGSTC.toLocaleString()}, which exceeds the maximum limit of €500,000.`, 'error');
            $scope.disableBtn = true;
            return;
        }

        // Check total Indian funding limit
        if (totalIndianIGSTC > 35000000) {
            swal('Validation Error', `Total IGSTC funding for all Indian partners is Rs. ${totalIndianIGSTC.toLocaleString()}, which exceeds the maximum limit of Rs. 35,000,000.`, 'error');
            $scope.disableBtn = true;
            return;
        }

        // Second pass: Individual validations
        for (let i = 0; i < financialList.length; i++) {
            if (financialList[i].Financial_Contribution__r != undefined &&
                financialList[i].Financial_Contribution__r.length > 0) {

                for (let j = 0; j < financialList[i].Financial_Contribution__r.length; j++) {
                    var contribution = financialList[i].Financial_Contribution__r[j];
                    var account = financialList[i].Contact__r.Account;

                    // Basic validations
                    if (contribution.Own_Contribution__c == undefined || contribution.Own_Contribution__c === "") {
                        swal("Financial Details", "Please Enter Own Contribution.");
                        $("#own" + i).addClass('border-theme');
                        return;
                    }

                    if (contribution.IGSTC_Contribution__c == undefined || contribution.IGSTC_Contribution__c === "") {
                        swal("Financial Details", "Please Enter IGSTC Contribution.");
                        $("#igstc" + i).addClass('border-theme');
                        return;
                    }

                    if (Number(contribution.Own_Contribution__c) < 0) {
                        swal("Financial Details", "Own Contribution should not be less than 0.");
                        $("#own" + i).addClass('border-theme');
                        return;
                    }

                    if (Number(contribution.IGSTC_Contribution__c) <= 0) {
                        swal("Financial Details", "IGSTC Contribution should be greater than 0.");
                        $("#igstc" + i).addClass('border-theme');
                        return;
                    }

                    // Indian Industry validation
                    if (account.BillingCountry == 'India' && account.Industry__c == true) {
                        if (Number(contribution.Own_Contribution__c) < Number(contribution.IGSTC_Contribution__c)) {
                            swal("Financial Details", "For Indian Industry, Own Contribution should not be less than IGSTC contribution.");
                            $("#own" + i).addClass('border-theme');
                            return;
                        }

                        if (Number(contribution.IGSTC_Contribution__c) > 15000000) {
                            swal("Financial Details", "For Indian Industry, IGSTC Contribution should not be greater than Rs. 15,000,000.");
                            $("#igstc" + i).addClass('border-theme');
                            return;
                        }
                    }

                    // Indian Academia validation
                    if (account.BillingCountry == 'India' && account.Academia__c == true) {
                        var maxForAcademia = 35000000 - indianIndustryContri;
                        if (Number(contribution.IGSTC_Contribution__c) > maxForAcademia) {
                            swal("Financial Details",
                                `For Indian Academia, IGSTC Contribution should not be greater than Rs. ${maxForAcademia.toLocaleString()}. ` +
                                `(Rs. 20,000,000 minus Indian Industry contribution of Rs. ${indianIndustryContri.toLocaleString()})`);
                            $("#igstc" + i).addClass('border-theme');
                            return;
                        }

                        // if (Number(contribution.IGSTC_Contribution__c) > 20000000) {
                        //     swal("Financial Details", "For Indian Academia, IGSTC Contribution should not be greater than Rs. 20,000,000.");
                        //     $("#igstc" + i).addClass('border-theme');
                        //     return;
                        // }
                    }

                    // German validation (individual - each German partner)
                    if (account.BillingCountry == 'Germany') {
                        if (Number(contribution.IGSTC_Contribution__c) > 500000) {
                            swal("Financial Details", "For German partners, IGSTC Contribution should not be greater than €500,000 per partner.");
                            $("#igstc" + i).addClass('border-theme');
                            return;
                        }
                    }

                    // Validate Budget fields are not empty
                    if (contribution.Budget_for_Capital_Expenditure__c == undefined || contribution.Budget_for_Capital_Expenditure__c === "") {
                        swal("Financial Details", "Please Enter Budget for Capital Expenditure.");
                        $("#capital" + i).addClass('border-theme');
                        return;
                    }

                    if (contribution.Budget_for_Recurring_Expenditure__c == undefined || contribution.Budget_for_Recurring_Expenditure__c === "") {
                        swal("Financial Details", "Please Enter Budget for Recurring Expenditure.");
                        $("#recurring" + i).addClass('border-theme');
                        return;
                    }

                    // Validate that Total = IGSTC + Own = Capital + Recurring
                    var totalFromContributions = Number(contribution.IGSTC_Contribution__c || 0) + Number(contribution.Own_Contribution__c || 0);
                    var totalFromBudget = Number(contribution.Budget_for_Capital_Expenditure__c || 0) + Number(contribution.Budget_for_Recurring_Expenditure__c || 0);

                    if (Math.abs(totalFromContributions - totalFromBudget) > 0.01) {
                        swal("Financial Details", 
                            "Total (IGSTC Funding + Own Contribution) must equal (Budget for Capital Expenditure + Budget for Recurring Expenditure).\n\n" +
                            "Current values:\n" +
                            "IGSTC Funding + Own Contribution = " + totalFromContributions.toLocaleString() + "\n" +
                            "Capital + Recurring Expenditure = " + totalFromBudget.toLocaleString());
                        $("#igstc" + i).addClass('border-theme');
                        $("#own" + i).addClass('border-theme');
                        $("#capital" + i).addClass('border-theme');
                        $("#recurring" + i).addClass('border-theme');
                        return;
                    }
                }
            }
        }

        // If all validations pass, prepare and submit data
        for (let i = 0; i < financialList.length; i++) {
            delete (financialList[i]['Name']);
            delete (financialList[i]['$$hashKey']);
            delete (financialList[i].Contacts);
            if (financialList[i].Financial_Contribution__r != undefined && financialList[i].Financial_Contribution__r.length > 0) {
                for (let j = 0; j < financialList[i].Financial_Contribution__r.length; j++) {
                    $scope.finance.push(financialList[i].Financial_Contribution__r[j]);
                }
            }
        }

        $("#btnSubmit").html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Please wait...');
        ApplicantPortal_Contoller.insertFinancialDetails($scope.finance, function (result, event) {
            $("#btnSubmit").html('<i class="fa-solid fa-check me-2"></i>Save and Next');
            if (event.status) {
                debugger;
                // swal({
                //     title: "Success",
                //     text: "Your Financial detail has been saved successfully.",
                //     icon: "success",
                //     buttons: true,
                //     dangerMode: false,
                // }).then((willDelete) => {
                //     if (willDelete) {
                //         $scope.redirectPageURL('ProjectDetail');
                //         $scope.finance = result;
                //         $scope.$apply();
                //     } else {
                //         return;
                //     }
                // });

                swal({
                    title: "Success",
                    text:
                        "Your Financial details have been saved successfully.\n\n" +
                        "Next Step:\n" +
                        "Please upload the Project Proposal information.",
                    icon: "success",
                    button: "OK",
                    // buttons: true,
                    dangerMode: false
                }).then((willDelete) => {
                    if (willDelete) {
                        $scope.redirectPageURL('ProjectDetail');
                        $scope.finance = result;
                        $scope.$apply();
                    }
                });
            }
        },
            { escape: true }
        )
    }


    $scope.redirectPageURL = function (pageName) {
        debugger;
        var link = document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href = "#/" + pageName;
        link.click();
    }

    $scope.removeClass = function (controlid, index) {
        var controlIdfor = controlid + "" + index;
        $("#" + controlIdfor + "").removeClass('border-theme');
    }
});
