angular.module('cp_app').controller('WISERgrant_ctrl', function ($scope, $rootScope) {

    debugger;
    $scope.siteURL = siteURL;
    $scope.applicantDetails = [];
    $scope.input = [];
    $scope.disableGrants = [];
    var statusLoginHas = 0;
    $scope.pickListCurrency = $rootScope.currencyPickList;
    $scope.grantsHandledValue = ''; // Current selected value from Grants_Handled__c
    $scope.grantsHandledPickList = []; // Picklist values for Grants_Handled__c
    $scope.showGrantsTable = false; // Controls table visibility



    $scope.getDataFromLocalStorage = function () {
        debugger;
        if (localStorage.getItem('candidateId')) {
            $rootScope.candidateId = localStorage.getItem('candidateId');
        }
        if (localStorage.getItem('apaId')) {
            $rootScope.apaId = localStorage.getItem('apaId');
            $scope.apaId = $rootScope.apaId;
        }
        if (localStorage.getItem('proposalId')) {
            $rootScope.proposalId = localStorage.getItem('proposalId');
            $scope.proposalId = $rootScope.proposalId;
        }
    }
    $scope.getDataFromLocalStorage();

    $scope.getApplicantStatusFromAPA = function () {
        debugger;
        ApplicantPortal_Contoller.fetchApplicantStatus($rootScope.apaId, function (result, event) {
            debugger;

            console.log('result return onload :: ');
            console.log(result);
            console.log('event:', event);

            if (event.status) {
                $rootScope.isCurrentUserSubmitted = result;
                CKEDITOR.config.readOnly = true;
            } else {
                console.log('Error in fetchApplicantStatus:', event.message);
            }
        }, {
            escape: true
        });
    }
    $scope.getApplicantStatusFromAPA();

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

    // Get Grants_Handled__c picklist values from Salesforce
    $scope.getGrantsHandledPicklistValues = function () {
        ApplicantPortal_Contoller.getGrantsHandledPicklistValues(function (result, event) {
            if (event.status && result) {
                $scope.grantsHandledPickList = result;
                $scope.$applyAsync();
            }
        }, { escape: true });
    };
    $scope.getGrantsHandledPicklistValues();

    $scope.getExistingGrants = function () {
        ApplicantPortal_Contoller.getExistingGrantsRecords(
            $rootScope.apaId,
            function (result, event) {
                if (event.status && result) {
                    $scope.existingGrants = result;

                    // Extract Grants_Handled__c from the first record (if exists)
                    if ($scope.existingGrants.length > 0 && $scope.existingGrants[0].Applicant_Proposal_Association__r) {
                        $scope.grantsHandledValue = $scope.existingGrants[0].Applicant_Proposal_Association__r.Grants_Handled__c || '';
                        // Show table if Grants_Handled__c is 'Yes'
                        $scope.showGrantsTable = ($scope.grantsHandledValue === 'Yes');
                        $scope.$applyAsync();
                    } else {
                        // No grants records - fetch APA directly to get Grants_Handled__c value
                        $scope.fetchAPAGrantsHandled();
                    }
                }
            },
            { escape: true }
        );
    };

    // Fallback method to get Grants_Handled__c when no grants exist
    $scope.fetchAPAGrantsHandled = function () {
        if ($rootScope.apaId) {
            ApplicantPortal_Contoller.getAPAGrantsHandled($rootScope.apaId, function (result, event) {
                if (event.status && result) {
                    $scope.grantsHandledValue = result.Grants_Handled__c || '';
                    // Show table if Grants_Handled__c is 'Yes'
                    $scope.showGrantsTable = ($scope.grantsHandledValue === 'Yes');

                    // If need to show table but no grants exist, add one empty row
                    if ($scope.showGrantsTable && (!$scope.existingGrants || $scope.existingGrants.length === 0)) {
                        $scope.existingGrants = [{
                            Title__c: '',
                            Funding_Agency__c: '',
                            Currency__c: '',
                            Budget__c: '',
                            Starting_Date__c: '',
                            End_Date__c: '',
                            Role_in_the_Project__c: '',
                            Application__c: $rootScope.proposalId
                        }];
                    }
                    $scope.$applyAsync();
                }
            }, { escape: true });
        }
    };

    // Handle change in Grants Handled picklist
    $scope.onGrantsHandledChange = function () {
        debugger;
        $scope.showGrantsTable = ($scope.grantsHandledValue === 'Yes');

        // If user selects 'Yes' and no grants exist, add an empty row
        if ($scope.showGrantsTable && (!$scope.existingGrants || $scope.existingGrants.length === 0)) {
            $scope.existingGrants = [{
                Title__c: '',
                Funding_Agency__c: '',
                Currency__c: '',
                Budget__c: '',
                Starting_Date__c: '',
                End_Date__c: '',
                Role_in_the_Project__c: '',
                Application__c: $rootScope.proposalId
            }];
        }
    };

    $scope.getExistingGrants();


    // $scope.getApplicantDetails = function () {
    //     ApplicantPortal_Contoller.getApplicantDetailsForGrantWISER($rootScope.apaId, function (result, event) {
    //         if (event.status) {
    //             debugger;
    //             $scope.grantDetails = result;
    //             $scope.grants = [];

    //             for (var i = 0; i < $scope.grantDetails.length; i++) {
    //                 statusLoginHas = 0;

    //                 if ($scope.grantDetails[i].Contacts != undefined) {
    //                     for (j = 0; j < $scope.grantDetails[i].Contacts.length; j++) {
    //                         if ($scope.grantDetails[i].Contacts[j].Login_Hash_Code__c == $rootScope.candidateId) {
    //                             $scope.input.push($scope.grantDetails[i]);
    //                             statusLoginHas = 1;
    //                         }
    //                     }
    //                 }
    //                 if (statusLoginHas == 0) {
    //                     $scope.disableGrants.push($scope.grantDetails[i]);
    //                 }
    //             }

    //             for (var i = 0; i < $scope.input.length; i++) {
    //                 if ($scope.input[i].Existing_Grants__r == undefined) {
    //                     var rec = {
    //                         'Account__r.Name': $scope.input[i].Name,
    //                         'Title__c': '',
    //                         'Funding_Agency__c': '',
    //                         'Role_in_the_Project__c': '',
    //                         'Budget__c': '',
    //                         'Starting_Date__c': '',
    //                         'End_Date__c': '',
    //                         'Account__c': $scope.input[i].Id,
    //                         'Application__c': $rootScope.proposalId
    //                     };
    //                     $scope.input[i].Existing_Grants__r = [];
    //                     debugger;
    //                     $scope.input[i].Existing_Grants__r.push(rec);
    //                 } else {
    //                     for (var j = 0; j < $scope.input[i].Existing_Grants__r.length; j++) {
    //                         if ($scope.input[i].Existing_Grants__r[j].Title__c != undefined || $scope.input[i].Existing_Grants__r[j].Title__c != '') {
    //                             $scope.input[i].Existing_Grants__r[j].Title__c = $scope.input[i].Existing_Grants__r[j].Title__c ? $scope.input[i].Existing_Grants__r[j].Title__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : $scope.input[i].Existing_Grants__r[j].Title__c;
    //                         }
    //                         if ($scope.input[i].Existing_Grants__r[j].Funding_Agency__c != undefined || $scope.input[i].Existing_Grants__r[j].Funding_Agency__c != '') {
    //                             $scope.input[i].Existing_Grants__r[j].Funding_Agency__c = $scope.input[i].Existing_Grants__r[j].Funding_Agency__c ? $scope.input[i].Existing_Grants__r[j].Funding_Agency__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : $scope.input[i].Existing_Grants__r[j].Funding_Agency__c;
    //                         }
    //                         if ($scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c != undefined || $scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c != '') {
    //                             $scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c = $scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c ? $scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : $scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c;
    //                         }
    //                     }
    //                 }
    //             }

    //             var existingGrant = [{ "title": "", "fundingagency": "", "Account": "", "AccountName": "", "role": "", "budget": "", "id": "", "startDate": "", "endDate": "", "Application": "" }];
    //             $scope.grants.push(existingGrant);
    //             $scope.$apply();
    //         }
    //     },
    //         { escape: true }
    //     )
    // }
    // $scope.getApplicantDetails();

    // $scope.getApplicantDetails = function () {
    // ApplicantPortal_Contoller.getApplicantDetailsForGrantWISER($rootScope.contactId, function (result, event) {
    //         if (event.status) {
    //             debugger;
    //             $scope.applicantDetails = result;
    //             $scope.grants = [];

    //             for (var i = 0; i < $scope.applicantDetails.length; i++) {
    //                 statusLoginHas = 0;

    //                 if ($scope.applicantDetails[i].Contacts != undefined) {
    //                     for (j = 0; j < $scope.applicantDetails[i].Contacts.length; j++) {
    //                         if ($scope.applicantDetails[i].Contacts[j].Login_Hash_Code__c == $rootScope.candidateId) {
    //                             $scope.input.push($scope.applicantDetails[i]);
    //                             statusLoginHas = 1;
    //                         }
    //                     }
    //                 }
    //                 if (statusLoginHas == 0) {
    //                     $scope.disableGrants.push($scope.applicantDetails[i]);
    //                 }
    //             }

    //             for (var i = 0; i < $scope.input.length; i++) {
    //                 if ($scope.input[i].Existing_Grants__r == undefined) {
    //                     var rec = {
    //                         'Account__r.Name': $scope.input[i].Name,
    //                         'Title__c': '',
    //                         'Funding_Agency__c': '',
    //                         'Role_in_the_Project__c': '',
    //                         'Budget__c': '',
    //                         'Starting_Date__c': '',
    //                         'End_Date__c': '',
    //                         'Account__c': $scope.input[i].Id,
    //                         'Application__c': $rootScope.proposalId
    //                     };
    //                     $scope.input[i].Existing_Grants__r = [];
    //                     debugger;
    //                     $scope.input[i].Existing_Grants__r.push(rec);
    //                 } else {
    //                     for (var j = 0; j < $scope.input[i].Existing_Grants__r.length; j++) {
    //                         if ($scope.input[i].Existing_Grants__r[j].Title__c != undefined || $scope.input[i].Existing_Grants__r[j].Title__c != '') {
    //                             $scope.input[i].Existing_Grants__r[j].Title__c = $scope.input[i].Existing_Grants__r[j].Title__c ? $scope.input[i].Existing_Grants__r[j].Title__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : $scope.input[i].Existing_Grants__r[j].Title__c;
    //                         }
    //                         if ($scope.input[i].Existing_Grants__r[j].Funding_Agency__c != undefined || $scope.input[i].Existing_Grants__r[j].Funding_Agency__c != '') {
    //                             $scope.input[i].Existing_Grants__r[j].Funding_Agency__c = $scope.input[i].Existing_Grants__r[j].Funding_Agency__c ? $scope.input[i].Existing_Grants__r[j].Funding_Agency__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : $scope.input[i].Existing_Grants__r[j].Funding_Agency__c;
    //                         }
    //                         if ($scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c != undefined || $scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c != '') {
    //                             $scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c = $scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c ? $scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : $scope.input[i].Existing_Grants__r[j].Role_in_the_Project__c;
    //                         }
    //                     }
    //                 }
    //             }
    //             //         for(var i=0;i<$scope.disableGrants.length;i++){
    //             //             if($scope.disableGrants[i].Existing_Grants__r != undefined){
    //             //               for(var j=0;j<$scope.disableGrants[i].Existing_Grants__r.length;j++){
    //             //                 if($scope.disableGrants[i].Existing_Grants__r[j].Starting_Date__c != undefined){
    //             //                     var date = new Date($scope.disableGrants[i].Existing_Grants__r[j].Starting_Date__c);
    //             //                     var year = date.getUTCFullYear();
    //             //                     var month = date.getMonth()+1;
    //             //                     var day = date.getDate();
    //             //                     $scope.disableGrants[i].Existing_Grants__r[j].Starting_Date__c   = year.toString()+'-'+month.toString()+'-'+day.toString();
    //             //             }
    //             //         }
    //             //     }
    //             // }

    //             var existingGrant = [{ "title": "", "fundingagency": "", "Account": "", "AccountName": "", "role": "", "budget": "", "id": "", "startDate": "", "endDate": "", "Application": "" }];
    //             $scope.grants.push(existingGrant);
    //             $scope.$apply();
    //         }
    //     },
    //         { escape: true }
    //     )
    // }
    // $scope.getApplicantDetails();

    $scope.submitExistingGrants = function () {
        debugger;

        if (!$scope.grantsHandledValue || $scope.grantsHandledValue === '' || $scope.grantsHandledValue === '-- Select --') {
            swal("Info", "Please select a valid Grants Handled option.", "info");
            return;
        }

        // First, update the Grants_Handled__c value on APA
        ApplicantPortal_Contoller.updateAPAGrantsHandled($rootScope.apaId, $scope.grantsHandledValue, function (result, event) {
            if (event.status && result === 'SUCCESS') {
                console.log("APA Grants Handled updated successfully");

                // If user selected 'No', skip saving grants and navigate
                if ($scope.grantsHandledValue !== 'Yes') {
                    swal({
                        title: "Success",
                        text: 'Your selection has been saved successfully.',
                        icon: "success",
                        button: "ok!",
                    });
                    $scope.redirectPageURL('TwoReferenceWiser');
                    return;
                }

                // If user selected 'Yes', save the grant records
                $scope.grantList = [];

                for (let i = 0; i < $scope.existingGrants.length; i++) {
                    var grant = $scope.existingGrants[i];

                    // Format dates to string if they are Date objects
                    var startDate = grant.Starting_Date__c;
                    var endDate = grant.End_Date__c;

                    if (startDate instanceof Date) {
                        startDate = startDate.toISOString().split('T')[0];
                    }
                    if (endDate instanceof Date) {
                        endDate = endDate.toISOString().split('T')[0];
                    }

                    var grantApplication = {
                        "title": grant.Title__c || "",
                        "fundingagency": grant.Funding_Agency__c || "",
                        "Account": grant.Account__c || null,
                        "AccountName": "",
                        "role": grant.Role_in_the_Project__c || "",
                        "currencyPick": grant.Currency__c || "",
                        "budget": grant.Budget__c || "",
                        "id": grant.Id || null,
                        "startDate": startDate || "",
                        "endDate": endDate || "",
                        "Application": $rootScope.proposalId,
                        "apaId": $rootScope.apaId
                    };

                    $scope.grantList.push(grantApplication);
                }

                ApplicantPortal_Contoller.insertExistingGrantsWISER($scope.grantList, function (result, event) {
                    if (event.status && result != null) {
                        console.log("Result ::" + result);

                        swal({
                            title: "Success",
                            text: 'Your Existing Grant details have been saved successfully.',
                            icon: "success",
                            button: "ok!",
                        });
                        $scope.redirectPageURL('TwoReferenceWiser');
                    } else {
                        swal({
                            title: "Error",
                            text: "Exception!",
                            icon: "error",
                            button: "ok!",
                        });
                    }
                });
            } else {
                swal({
                    title: "Error",
                    text: "Failed to save selection!",
                    icon: "error",
                    button: "ok!",
                });
            }
        }, { escape: true });
    }

    $scope.addRow = function () {
        debugger;
        var rec = {
            Title__c: '',
            Funding_Agency__c: '',
            Currency__c: '',
            Budget__c: '',
            Starting_Date__c: '',
            End_Date__c: '',
            Role_in_the_Project__c: '',
            Application__c: $rootScope.proposalId
        };
        $scope.existingGrants.push(rec);
    }

    $scope.deleteRow = function (index) {
        debugger;
        if ($scope.existingGrants.length > 1) {
            var grant = $scope.existingGrants[index];
            if (grant.Id != undefined && grant.Id != null) {
                $scope.deleteGrants(grant.Id);
            }
            $scope.existingGrants.splice(index, 1);
        } else {
            // Keep at least one empty row
            swal("Info", "At least one row is required.");
        }
    }

    $scope.deleteGrants = function (grantstId) {
        ApplicantPortal_Contoller.deleteGrants(grantstId, function (result, event) {
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

    $scope.previousPage = function () {
        debugger;
        //   $scope.redirectPageURL('TwoReferenceWiser');
        $scope.redirectPageURL('FinancialOverview_wiser');
        // window.location.replace(window.location.origin+'/ApplicantDashboard/ApplicantPortal?id='+$rootScope.userId+'#/TwoReferenceWiser');
    }

    $scope.removeClass = function (controlid, index) {
        var controlIdfor = controlid + "" + index;
        $("#" + controlIdfor + "").removeClass('border-theme');
    }

});