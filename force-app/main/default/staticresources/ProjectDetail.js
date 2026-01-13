angular.module('cp_app').controller('projectCtrl', function ($scope, $sce, $rootScope) {
    debugger;

    // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }

    // Fetching the APA Id from Local Storage
    if (localStorage.getItem('apaId')) {
        $rootScope.apaId = localStorage.getItem('apaId');
        console.log('Loaded apaId from localStorage:', $rootScope.apaId);
    }

    // Fetching the candidateId from Local Storage
    // if (localStorage.getItem('candidateId')) {
    //     $rootScope.candidateId = localStorage.getItem('candidateId');
    //     console.log('Loaded candidateId from localStorage:', $rootScope.candidateId);
    // }

    $scope.config = {};
    $scope.config.toolbarGroups = [
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
        { name: 'forms', groups: ['forms'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
        { name: 'links', groups: ['links'] },
        { name: 'insert', groups: ['insert'] },
        { name: 'styles', groups: ['styles'] },
        { name: 'colors', groups: ['colors'] },
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'tools', groups: ['tools'] },
        { name: 'others', groups: ['others'] },
        { name: 'about', groups: ['about'] }
    ];
    $scope.selectedFile;
    $scope.config.removeButtons = 'BGColor,Anchor,Subscript,Superscript,Paste,Copy,Cut,Undo,Redo';
    debugger;
    $scope.siteURL = siteURL;
    $scope.proposalDetails = {};
    $scope.disable = false;
    // $scope.uploadDisable = proposalStage == "Draft" && isCoordinator == "true" ? false : true;  //need to check 
    //$scope.uploadDisable = proposalStage == "Draft" && isCoordinator == "true" ? true : false;  //need to check 

    $scope.uploadProgress = 0;
    $scope.showProgressBar = false;

    $scope.previewFileLink = '';

    // Additional document variables
    $scope.auditedFinancialDoc = null;
    $scope.auditedFinancialPreviewLink = '';
    $scope.quotationEquipmentDoc = null;
    $scope.quotationEquipmentPreviewLink = '';
    $scope.letterOfConsentDoc = null;
    $scope.letterOfConsentPreviewLink = '';

    // if(proposalStage=="Draft" && isCoordinator == "true"){
    //     $scope.uploadDisable = false;
    // }else{
    //     $scope.uploadDisable = true;
    // }
    $rootScope.secondStage;
    $scope.secondStage;

    console.log('second stage=>' + $rootScope.secondStage);
    console.log(' scope second stage=>' + $scope.secondStage);

    // $scope.pWrapper = window.proposalWrapperListJSON;
    // console.log(' $scope.pWrapper : ', $scope.pWrapper);

    // console.log(typeof ($scope.pWrapper));

    // // $scope.pWrapper = JSON.parse(window.proposalWrapperList);
    // // console.log(typeof ($scope.pWrapper));
    // // console.log($scope.pWrapper);

    // // console.log('typeOf($scope.pWrapper) : ', typeof ($scope.pWrapper));
    // // console.log('$scope.pWrapper : ', $scope.pWrapper);

    // // $scope.parsedPWrapper = JSON.parse($scope.pWrapper);
    // // console.log('typeOf($scope.parsedPWrapper) ', typeof ($scope.parsedPWrapper));
    // // console.log($scope.parsedPWrapper);

    console.log('proposalWrapperList : ', proposalWrapperList);
    $scope.proposalWrapperList = proposalWrapperList
        .replace(/^\[|\]$/g, '')
        .split(/proposalWrap:/)
        .filter(s => s.trim())
        .map(item => {
            const obj = {};
            item
                .replace(/^\[|\]$/g, '')
                .split(',')
                .forEach(pair => {
                    const [key, value] = pair.split('=').map(v => v.trim());
                    if (key) obj[key] = (value === 'null') ? null : value;
                });
            return obj;
        });
    console.log('$scope.proposalWrapperList : ', $scope.proposalWrapperList);

    $scope.objRtf = [{ charCount: 0, maxCharLimit: 0, errorStatus: false }];
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false });
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false });
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false });
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false });
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false });
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false });
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false });
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false });
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false });
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false });
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false }); // Index 11 - Tentative_plans_for_networking__c
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false }); // Index 12 - Plan_For_Utilisation_and_Preservation__c
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false }); // Index 13 - Profile_Of_The_Academic_Institutions__c

    // Work Package Variables
    $scope.workPackList = [];
    $scope.AccountList = [];
    $scope.defaultAccountList = [];
    const accountIdXaccount = new Map();

    // Existing Grants Variables
    $scope.input = [];
    $scope.disableGrants = [];
    $scope.grantList = [];
    $scope.grants = [];

    // ------------------------------------------------------------------------------ //
    // Method to get the Proposal Stage and APA Is_Coordinator
    // ------------------------------------------------------------------------------ //
    $rootScope.currentProposalStage = '';
    $rootScope.isCoordinator = false;
    $rootScope.stage = '';

    $scope.getProposalStage = function () {
        debugger;

        ApplicantPortal_Contoller.getProposalStageUsingProposalId(
            $rootScope.proposalId,
            $rootScope.apaId,
            function (result, event) {

                if (event.status && result) {
                    $scope.$apply(function () {

                        $rootScope.currentProposalStage = result.proposalStage;
                        $rootScope.isCoordinator = result.isCoordinator;
                        $rootScope.stage = result.stage;
                        $rootScope.maxDurationInMonths = result.durationInMonths;

                        $rootScope.secondStage = $rootScope.stage == '2nd Stage' ? true : false;

                        $scope.uploadDisable =
                            !(
                                $rootScope.currentProposalStage === "Draft"
                                && $rootScope.isCoordinator === true
                            );
                    });
                }

                console.log('$rootScope.currentProposalStage : ', $rootScope.currentProposalStage);
                console.log('$rootScope.isCoordinator : ', $rootScope.isCoordinator);
                console.log('$rootScope.stage : ', $rootScope.stage);
                console.log('$rootScope.secondStage : ', $rootScope.secondStage);
                console.log('uploadDisable:', $scope.uploadDisable);
            }
        );
    };
    $scope.getProposalStage();

    /**
     * Gets proposal accounts (partners) through contacts linked via Applicant_Proposal_Association__c
     */
    $scope.getProposalAccounts = function () {
        ApplicantPortal_Contoller.getProposalAccountsFromAPA($rootScope.proposalId, function (result, event) {
            if (event.status) {
                console.log('Partner accounts from APA:', result);
                $scope.AccountList = result;
                if ($scope.AccountList != undefined && $scope.AccountList.length > 0) {
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
                // Load work package details after accounts are loaded
                $scope.getWPDetails();
                $scope.$applyAsync();
            } else {
                console.error('Error fetching partner accounts:', event.message);
            }
        });
    }
    $scope.getProposalAccounts();

    /* -------------------------------------------------------------------------------- */
    // Gets work package details
    /* -------------------------------------------------------------------------------- */
    $scope.getWPDetails = function () {
        ApplicantPortal_Contoller.getWPDetails($rootScope.proposalId, $rootScope.stage, function (result, event) {
            debugger;
            console.log('work packages data', result);
            if (event.status && result) {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].Work_Package_Detail__c != undefined || result[i].Work_Package_Detail__c != "") {
                        result[i].Work_Package_Detail__c = result[i].Work_Package_Detail__c ? result[i].Work_Package_Detail__c.replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Work_Package_Detail__c;
                    }
                }
                var applicantDetails = result;
                if (applicantDetails.length > 0) {
                    for (var i = 0; i < applicantDetails.length; i++) {
                        const accountIdXselectedAcc = new Map();
                        var accDetails = [];
                        if (applicantDetails[i].Account_Mapping__r != undefined) {
                            for (var j = 0; j < applicantDetails[i].Account_Mapping__r.length; j++) {
                                accountIdXselectedAcc.set(applicantDetails[i].Account_Mapping__r[j].Account__c, applicantDetails[i].Account_Mapping__r[j]);
                            }
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
                            accDetails = JSON.parse(JSON.stringify($scope.defaultAccountList));
                        }
                        $scope.workPackList.push({
                            "trl_level": applicantDetails[i].TRL_Level__c,
                            "AccountList": accDetails,
                            "title": applicantDetails[i].Title__c,
                            "duration": applicantDetails[i].Duration__c,
                            Workpackage_detail: applicantDetails[i].Work_Package_Detail__c,
                            "WPSequence": applicantDetails[i].WP_Sequence__c,
                            Id: applicantDetails[i].Id,
                            end_trl_level: applicantDetails[i].End_TRL_Level__c,
                            externalId: i
                        });
                    }
                } else {
                    $scope.workPackList.push({
                        end_trl_level: "",
                        externalId: 0,
                        "AccountList": JSON.parse(JSON.stringify($scope.defaultAccountList))
                    });
                }
                $scope.$applyAsync();
            }
        }, { escape: true });
    }

    // Note: getWPDetails() is now called from inside getProposalAccounts() callback
    // to ensure accounts are loaded before work packages are fetched

    /**
     * Opens work package detail popup
     */
    $scope.OpenPopup = function (index) {
        var myModal = new bootstrap.Modal(document.getElementById('flipFlop' + index));
        myModal.show('slow');
    }

    /**
     * Opens work package detail popup for Stage 2
     */
    $scope.OpenPopupStage2 = function (index) {
        var myModal = new bootstrap.Modal(document.getElementById('flipFlopStage2' + index));
        myModal.show('slow');
    }

    /**
     * Adds new work package row
     */
    $scope.addRowsWorkPackage = function () {
        debugger;
        var arrayLength = $scope.workPackList.length;
        var externalid = arrayLength > 0 ? $scope.workPackList[arrayLength - 1].externalId : 0;
        var accList = [];
        for (var i = 0; i < $scope.AccountList.length; i++) {
            var option = {
                'Id': $scope.AccountList[i].Id,
                'Name': $scope.AccountList[i].Name,
                'selected': false
            };
            accList.push(option);
        }
        $scope.workPackList.push({
            end_trl_level: "",
            externalId: externalid + 1,
            AccountList: accList
        });
    }

    /**
     * Removes work package row
     */
    $scope.removeRow = function (index) {
        debugger;
        if ($scope.workPackList.length == 1) {
            return;
        }
        if ($scope.workPackList[index].Id == undefined) {
            $scope.workPackList.splice(index, 1);
            return;
        }
        ApplicantPortal_Contoller.deleteWorkPackageDetails($scope.workPackList[index].Id, function (result, event) {
            if (event.status) {
                swal("Work Package", "Your Work Package data has been Deleted Successfully");
                $scope.workPackList.splice(index, 1);
            }
            $scope.$applyAsync();
        });
    }

    /*
     * Removes Deliverables
     */
    $scope.removeRowDeliverables = function (index) {
        debugger;
        if ($scope.PIList.length == 1) {
            return;
        }
        if ($scope.PIList[index].Id == undefined) {
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

    /**
     * Removes border theme class
     */
    $scope.removeClass = function (controlid, index) {
        debugger;
        var controlIdfor = controlid + "" + index;
        $("#" + controlIdfor + "").removeClass('border-theme');
    }

    /**
     * Saves work package details
     */
    $scope.saveWorkPackageDet = function () {
        debugger;
        var objData = JSON.parse(JSON.stringify($scope.workPackList));

        // Validation
        for (var i = 0; i < objData.length; i++) {
            var count = 0;
            if (objData[i].AccountList) {
                for (var k = 0; k < objData[i].AccountList.length; k++) {
                    if (objData[i].AccountList[k].selected == true) {
                        count = count + 1;
                    }
                }
            }
            if (count <= 0) {
                swal("Work Package Details", "Please Select Partners.");
                $("#account" + i + "").addClass('border-theme');
                return;
            }

            if (objData[i].trl_level == undefined || objData[i].trl_level == "") {
                swal("Work Package Details", "Please Enter Start TRL Level.");
                $("#STL" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].end_trl_level == undefined || objData[i].end_trl_level == "") {
                swal("Work Package Details", "Please Enter End TRL Level.");
                $("#ETL" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].title == undefined || objData[i].title == "") {
                swal("Work Package Details", "Please Enter Title.");
                $("#title" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].duration == undefined || objData[i].duration == "") {
                swal("Work Package Details", "Please Enter Duration.");
                $("#duration" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].trl_level < 3 || objData[i].trl_level > 9) {
                swal("Work Package Details", "Minimum TRL Level should be 3 and Maximum TRL Level should be 9");
                $("#STL" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].end_trl_level < 3 || objData[i].end_trl_level > 9) {
                swal("Work Package Details", "Minimum TRL Level should be 3 and Maximum TRL Level should be 9");
                $("#ETL" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].end_trl_level < objData[i].trl_level) {
                swal("Work Package Details", "End TRL Level should be greater than Start TRL Level.");
                $("#ETL" + i + "").addClass('border-theme');
                return;
            }
        }

        // Prepare data for saving - map field names to match Apex wrapper
        for (var i = 0; i < objData.length; i++) {
            delete objData[i]['$$hashKey'];
            delete objData[i]['durationError'];
            delete objData[i]['durationErrorMsg'];
            delete objData[i]['minDurationError'];
            delete objData[i]['maxDurationError'];

            // Map externalId to ExternalId (Apex expects capital E)
            if (objData[i].externalId !== undefined) {
                objData[i].ExternalId = String(objData[i].externalId);
                delete objData[i]['externalId'];
            }

            // Ensure Id is a string (empty string if undefined)
            if (objData[i].Id === undefined || objData[i].Id === null) {
                objData[i].Id = '';
            }

            // Convert numeric values to strings for Apex
            if (objData[i].trl_level !== undefined) {
                objData[i].trl_level = String(objData[i].trl_level);
            }
            if (objData[i].end_trl_level !== undefined) {
                objData[i].end_trl_level = String(objData[i].end_trl_level);
            }
            if (objData[i].duration !== undefined) {
                objData[i].duration = String(objData[i].duration);
            }
            if (objData[i].WPSequence !== undefined) {
                objData[i].WPSequence = String(objData[i].WPSequence);
            }

            var accountWrapperList = [];
            if (objData[i].AccountList) {
                for (var k = 0; k < objData[i].AccountList.length; k++) {
                    var acc = objData[i].AccountList[k];
                    var wrapper = {
                        accnt: { Id: acc.Id, Name: acc.Name },
                        isSelected: acc.selected === true
                    };
                    if (acc.accountMappingId !== undefined && acc.accountMappingId !== null) {
                        wrapper.accountMappingId = acc.accountMappingId;
                    }
                    accountWrapperList.push(wrapper);
                }
            }
            objData[i].AccountListWrapper = accountWrapperList;
            delete objData[i]['AccountList'];
        }

        console.log('Saving work package data:', objData);

        IndustrialFellowshipController.saveWorkPackageDet(objData, $rootScope.proposalId, $rootScope.stage, function (result, event) {
            debugger;
            console.log('Save work package result:', result);
            console.log('Event:', event);
            if (event.status) {
                if (result === 'success') {
                    Swal.fire(
                        'Success',
                        'Your Work Package details have been saved successfully.',
                        'success'
                    );
                    if ($rootScope.secondStage) {
                        //$scope.redirectPageURL('PIDeliverables');
                    } else {
                        //$scope.redirectPageURL('PrivacyPolicyAcceptance');
                    }
                } else {
                    swal("Error", "Failed to save work package details: " + result, "error");
                }
                $scope.$applyAsync();
            } else {
                console.error('Error saving work packages:', event.message);
                swal("Error", "Failed to save work package details. Please try again.", "error");
            }
        });
    }

    $scope.getProjectdetils = function () {
        debugger;
        ApplicantPortal_Contoller.getProjectdetils($rootScope.proposalId, function (result, event) {
            debugger;
            if (event.status && result) {
                debugger;
                if (result.Research_Approach_Objectives__c != undefined || result.Research_Approach_Objectives__c != "") {
                    result.Research_Approach_Objectives__c = result.Research_Approach_Objectives__c ? result.Research_Approach_Objectives__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Research_Approach_Objectives__c;
                }
                if (result.Current_State_Of_The_Art__c != undefined || result.Current_State_Of_The_Art__c != "") {
                    result.Current_State_Of_The_Art__c = result.Current_State_Of_The_Art__c ? result.Current_State_Of_The_Art__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Current_State_Of_The_Art__c;
                }
                if (result.Project_Description__c != undefined || result.Project_Description__c != "") {
                    result.Project_Description__c = result.Project_Description__c ? result.Project_Description__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Project_Description__c;
                }
                if (result.Expected_Deliverables__c != undefined || result.Expected_Deliverables__c != "") {
                    result.Expected_Deliverables__c = result.Expected_Deliverables__c ? result.Expected_Deliverables__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Expected_Deliverables__c;
                }
                if (result.Reasons_For_And_Benefits_Of_Cooperation__c != undefined || result.Reasons_For_And_Benefits_Of_Cooperation__c != "") {
                    result.Reasons_For_And_Benefits_Of_Cooperation__c = result.Reasons_For_And_Benefits_Of_Cooperation__c ? result.Reasons_For_And_Benefits_Of_Cooperation__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Reasons_For_And_Benefits_Of_Cooperation__c;
                }
                if (result.Equipment__c != undefined || result.Equipment__c != "") {
                    result.Equipment__c = result.Equipment__c ? result.Equipment__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Equipment__c;
                }
                if (result.Criteria_For_Abandoning_The_Project__c != undefined || result.Criteria_For_Abandoning_The_Project__c != "") {
                    result.Criteria_For_Abandoning_The_Project__c = result.Criteria_For_Abandoning_The_Project__c ? result.Criteria_For_Abandoning_The_Project__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Criteria_For_Abandoning_The_Project__c;
                }
                if (result.Innovative_Aspects__c != undefined || result.Innovative_Aspects__c != "") {
                    result.Innovative_Aspects__c = result.Innovative_Aspects__c ? result.Innovative_Aspects__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Innovative_Aspects__c;
                }
                if (result.Research_Scholars__c != undefined || result.Research_Scholars__c != "") {
                    result.Research_Scholars__c = result.Research_Scholars__c ? result.Research_Scholars__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Research_Scholars__c;
                }
                if (result.Necessity_Of_Funding__c != undefined || result.Necessity_Of_Funding__c != "") {
                    result.Necessity_Of_Funding__c = result.Necessity_Of_Funding__c ? result.Necessity_Of_Funding__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Necessity_Of_Funding__c;
                }
                $scope.proposalDetails = result;
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }
    $scope.getProjectdetils();

    // Method to get the Files onload based on the Stage of the Proposal
    $scope.getDocsDet = function () {
        debugger;

        $scope.selectedFile = '';
        $scope.doc = null;
        $scope.sampleDoc = null;
        $scope.previewFileLink = '';

        // Reset additional document variables
        $scope.auditedFinancialDoc = null;
        $scope.auditedFinancialPreviewLink = '';
        $scope.quotationEquipmentDoc = null;
        $scope.quotationEquipmentPreviewLink = '';
        $scope.letterOfConsentDoc = null;
        $scope.letterOfConsentPreviewLink = '';

        $('#file_frame').attr('src', '');

        ApplicantPortal_Contoller.getAllProposalDoc(
            $rootScope.proposalId,
            function (result, event) {

                debugger;
                console.log('onload doc:: ', result);

                $scope.selectedProposal = null;
                debugger;
                if ($scope.proposalWrapperList && $rootScope.apaId) {

                    for (var i = 0; i < $scope.proposalWrapperList.length; i++) {

                        var wrap = $scope.proposalWrapperList[i];

                        if (wrap.apaId === $rootScope.apaId) {
                            console.log('wrap.apaId : ', wrap.apaId);
                            $scope.selectedProposal = wrap;
                            break;
                        }
                    }
                }

                if (event.status && result) {

                    $scope.allDocs = result;

                    // Decide expected document name based on stage
                    var expectedDocName = $rootScope.secondStage
                        ? 'Project Details - Stage 2'
                        : 'Project Details - Stage 1';

                    console.log('expectedDocName : ', expectedDocName);

                    for (var i = 0; i < $scope.allDocs.length; i++) {

                        var currentDoc = $scope.allDocs[i].userDocument;

                        // Pick stage-specific Project Details document
                        if (currentDoc.Name === expectedDocName) {
                            console.log('currentDoc.Name : ', currentDoc.Name);

                            $scope.doc = $scope.allDocs[i];

                            if (
                                currentDoc.Attachments &&
                                currentDoc.Attachments.length > 0
                            ) {
                                let fileId = currentDoc.Attachments[0].Id;
                                $scope.previewFileLink =
                                    `/ApplicantDashboard/servlet/servlet.FileDownload?file=${fileId}`;
                            }
                        }

                        // Sample document (always collect)
                        if (currentDoc.Name === 'Sample Document') {
                            $scope.sampleDoc = currentDoc;
                        }

                        // Audited Financial Statement
                        if (currentDoc.Name === 'Audited Financial Statement') {
                            $scope.auditedFinancialDoc = $scope.allDocs[i];
                            if (currentDoc.Attachments && currentDoc.Attachments.length > 0) {
                                let fileId = currentDoc.Attachments[0].Id;
                                $scope.auditedFinancialPreviewLink = `/ApplicantDashboard/servlet/servlet.FileDownload?file=${fileId}`;
                            }
                        }

                        // Quotation For Equipment/Accessories
                        if (currentDoc.Name === 'Quotation For Equipment/Accessories' || currentDoc.Name === 'Quotation For Equipment') {
                            $scope.quotationEquipmentDoc = $scope.allDocs[i];
                            if (currentDoc.Attachments && currentDoc.Attachments.length > 0) {
                                let fileId = currentDoc.Attachments[0].Id;
                                $scope.quotationEquipmentPreviewLink = `/ApplicantDashboard/servlet/servlet.FileDownload?file=${fileId}`;
                            }
                        }

                        // Letter of Consent
                        if (currentDoc.Name === 'Letter of Consent' || currentDoc.Name === 'Letter of consent') {
                            $scope.letterOfConsentDoc = $scope.allDocs[i];
                            if (currentDoc.Attachments && currentDoc.Attachments.length > 0) {
                                let fileId = currentDoc.Attachments[0].Id;
                                $scope.letterOfConsentPreviewLink = `/ApplicantDashboard/servlet/servlet.FileDownload?file=${fileId}`;
                            }
                        }
                    }

                    // Safety check
                    if (!$scope.doc) {
                        console.warn(
                            'No Project Details document found for stage:',
                            $rootScope.secondStage ? 'Stage 2' : 'Stage 1'
                        );
                    }

                    $scope.$applyAsync();
                }
            },
            { escape: true }
        );
    };
    $scope.getDocsDet();
    // ------------------------------------------------------------------------------ //

    // ------------------------------------------------------------------------------ //
    // $scope.getDocsDet = function () {
    //     debugger;
    //     $scope.selectedFile = '';
    //     $('#file_frame').attr('src', '');
    //     // ApplicantPortal_Contoller.getAllProposalDoc($rootScope.projectId, function (result, event) {
    //     ApplicantPortal_Contoller.getAllProposalDoc($rootScope.proposalId, function (result, event) {
    //         debugger
    //         console.log('onload doc:: ');
    //         console.log(result);
    //         if (event.status) {
    //             $scope.allDocs = result;
    //             var uploadCount = 0;
    //             for (var i = 0; i < $scope.allDocs.length; i++) {
    //                 debugger;
    //                 if ($scope.allDocs[i].userDocument.Name == 'Project Details') {
    //                     $scope.doc = $scope.allDocs[i];
    //                     if ($scope.doc.userDocument.Attachments && $scope.doc.userDocument.Attachments[0]) {
    //                         let fileId = $scope.doc.userDocument.Attachments[0].Id;
    //                         //$scope.previewFileLink = $scope.siteURL + `servlet/servlet.FileDownload?file=${fileId}`;
    //                         $scope.previewFileLink = `/ApplicantDashboard/servlet/servlet.FileDownload?file=${fileId}`;
    //                     }
    //                 }
    //                 if ($scope.allDocs[i].userDocument.Name == 'Sample Document') {
    //                     $scope.sampleDoc = $scope.allDocs[i].userDocument;
    //                 }
    //             }
    //             $scope.$applyAsync();
    //         }

    //     }, {
    //         escape: true
    //     })

    // }
    // $scope.getDocsDet();


    /*
    $scope.getDocsDet = function () {
        debugger;
        $scope.selectedFile = '';
        $('#file_frame').attr('src', '');
        // ApplicantPortal_Contoller.getAllProposalDoc($rootScope.projectId, function (result, event) {
        ApplicantPortal_Contoller.getAllProposalDoc($rootScope.proposalId, function (result, event) {
            debugger
            console.log('onload doc:: ');
            console.log(result);
            if (event.status) {
                $scope.allDocs = result;
                var uploadCount = 0;
                for (var i = 0; i < $scope.allDocs.length; i++) {
                    debugger;
                    if ($scope.allDocs[i].userDocument.Name == 'Project Details' ) {
                        $scope.doc = $scope.allDocs[i];
                        if ($scope.doc.userDocument.Attachments && $scope.doc.userDocument.Attachments[0]) {
                            let fileId = $scope.doc.userDocument.Attachments[0].Id;
                            //$scope.previewFileLink = $scope.siteURL + `servlet/servlet.FileDownload?file=${fileId}`;
                            $scope.previewFileLink = `/ApplicantDashboard/servlet/servlet.FileDownload?file=${fileId}`;
                        }
                    }
                    if ($scope.allDocs[i].userDocument.Name == 'Sample Document') {
                        $scope.sampleDoc = $scope.allDocs[i].userDocument;
                    }
                }
                $scope.$applyAsync();
            }

        }, {
            escape: true
        })

    }
    $scope.getDocsDet();
    */





    $scope.filePreviewHandler = function (fileContent) {
        debugger;
        $scope.selectedFile = fileContent;

        console.log('selectedFile---', $scope.selectedFile);
        var jhj = $scope.selectedFile.userDocument.Attachments[0].Id;
        console.log(jhj);
        $scope.filesrec = $sce.trustAsResourceUrl(window.location.origin + '/ApplicantDashboard/servlet/servlet.FileDownload?file=' + $scope.selectedFile.userDocument.Attachments[0].Id);
        console.log('filesrec : ', $scope.filesrec);

        $('#file_frame').attr('src', $scope.filesrec);

        var myModal = new bootstrap.Modal(document.getElementById('filePreview'))
        myModal.show('slow');
        $scope.$apply();

        //.ContentDistribution.DistributionPublicUrl
    }
    $scope.uploadFile = function (type, userDocId, fileId) {
        debugger;

        // Commented By Saurabh
        /*
        if ($scope.doc && $scope.doc.userDocument && $scope.doc.userDocument.Status__c && $scope.doc.userDocument.Status__c == 'Uploaded' ) {
            // console.log('File already uploaded !!');
            swal({
                title: "Error",
                text: "A file has already been uploaded. You cannot upload another file.",
                icon: "error",
                button: "OK",
            });
            return;
        }
        */

        $scope.uploadProgress = 0;
        $scope.showProgressBar = true;
        $scope.isUploading = true;

        $scope.showSpinnereditProf = true;
        var file;
        maxFileSize = 5191680;
        file = document.getElementById('fileSignature').files[0];
        if (!file) {
            swal("info", "You must choose a file before trying to upload it", "info");
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
            $scope.resetUploadState();
            return;
        }
        fileName = file.name;
        var typeOfFile = fileName.split(".");
        lengthOfType = typeOfFile.length;
        if (typeOfFile[lengthOfType - 1] == "pdf" || typeOfFile[lengthOfType - 1] == "PDF") {

        } else {
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
            swal('info', 'Please choose pdf only.', 'info');
            return;
        }
        console.log(file);
        if (file != undefined) {
            if (file.size <= maxFileSize) {

                attachmentName = file.name;
                const myArr = attachmentName.split(".");
                /* if (myArr[1] != "pdf" && type != 'profilePic') {
                    alert("Please upload in PDF format only");
                    return;
                } */
                var fileReader = new FileReader();
                fileReader.onloadend = function (e) {
                    attachment = window.btoa(this.result);  //Base 64 encode the file before sending it
                    positionIndex = 0;
                    fileSize = attachment.length;
                    $scope.showSpinnereditProf = false;
                    console.log("Total Attachment Length: " + fileSize);
                    doneUploading = false;
                    debugger;
                    // if (fileSize < maxStringSize) {

                    if (true) {
                        // Add the info or warning message here after uploading
                        swal({
                            title: "Warning",
                            text: "Once you upload the file, it cannot be uploaded again. Please ensure this is the correct file.",
                            icon: "warning",
                            buttons: {
                                cancel: "Cancel",
                                confirm: {
                                    text: "Upload",
                                    value: true,
                                },
                            },
                        }).then((willUpload) => {
                            if (willUpload) {
                                $scope.uploadAttachment(type, userDocId, fileId);
                            } else {
                                // Action for canceling the upload (optional)
                                // console.log("Upload canceled");
                                $scope.resetUploadState();
                            }
                        });
                    } else {
                        $scope.isUploading = false;
                        $scope.showSpinnereditProf = false;
                        // swal("info", "Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".", "info");
                        swal("info", "File size should be lesser than 4 MB.", "info"); return;
                        // alert("Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".");
                    }

                }
                fileReader.onerror = function (e) {
                    $scope.isUploading = false;
                    $scope.showSpinnereditProf = false;
                    swal("info", "There was an error reading the file.  Please try again.", "info");
                    return;
                    // alert("There was an error reading the file.  Please try again.");
                }
                fileReader.onabort = function (e) {
                    $scope.isUploading = false;
                    $scope.showSpinnereditProf = false;
                    swal("info", "There was an error reading the file.  Please try again.", "info");
                    return;
                    // alert("There was an error reading the file.  Please try again.");
                }

                fileReader.readAsBinaryString(file);  //Read the body of the file

            } else {
                $scope.isUploading = false;
                $scope.showSpinnereditProf = false;
                swal("info", "File must be under 5 Mb in size.  Your file is too large.  Please try again.", "info");
                return;
            }
        } else {
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
            swal("info", "You must choose a file before trying to upload it", "info");
            return;
            // alert("You must choose a file before trying to upload it");
            // $scope.showSpinnereditProf = false;
        }
    }

    $scope.resetUploadState = function () {
        if (!$scope.$$phase) { // Check if Angular digest cycle is not already in progress
            $scope.$applyAsync(function () {
                $scope.isUploading = false;
                $scope.showSpinnereditProf = false;
                $scope.showProgressBar = false;
                $scope.uploadProgress = 0;
                document.getElementById('fileSignature').value = "";
            });
        } else {
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
        }
    };


    $scope.uploadAttachment = function (type, userDocId, fileId) {
        debugger;
        var attachmentBody = "";
        // if (fileId == undefined) {
        //     fileId = "";
        // }

        $scope.$applyAsync(function () {
            $scope.uploadProgress = Math.round((positionIndex / fileSize) * 100);
        });

        //if (fileSize <= positionIndex + chunkSize) {
        if (true) {
            debugger;
            attachmentBody = attachment.substring(positionIndex);
            doneUploading = true;
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
        } else {
            attachmentBody = attachment.substring(positionIndex, positionIndex + chunkSize);
        }
        console.log("Uploading " + attachmentBody.length + " chars of " + fileSize);
        var stringAttachmentBody = String(attachmentBody);
        var stringAttachmentName = String(attachmentName);
        var stringFileId = fileId ? String(fileId) : '';
        var stringUserDocId = (userDocId && userDocId !== 'undefined') ? String(userDocId) : '';

        ApplicantPortal_Contoller.doCUploadAttachmentProjectDet(
            //attachmentBody, attachmentName, fileId, userDocId,
            stringAttachmentBody, stringAttachmentName, stringFileId, stringUserDocId,
            function (result, event) {
                debugger;
                console.log(result);
                if (event.type === 'exception') {
                    console.log("exception");
                    console.log(event);
                    $scope.isUploading = false;
                    $scope.showSpinnereditProf = false;
                } else if (event.status) {
                    if (doneUploading == true) {
                        $scope.isUploading = false;
                        $scope.showSpinnereditProf = false;
                        $scope.$applyAsync(function () {
                            $scope.uploadProgress = 100;
                        });
                        swal(
                            'success',
                            'Uploaded Successfully!',
                            'success'
                        )

                        setTimeout(function () {
                            $scope.isUploading = false; // Allow button to be clickable again
                            $scope.showProgressBar = false;
                            $scope.getDocsDet(); // Refresh doc list to get the new file link
                            if (!$scope.$$phase) $scope.$apply();
                        }, 1500);

                        $scope.getProjectdetils();
                        $scope.getDocsDet();
                        // $scope.disableSubmit = false;

                    } else {
                        debugger;
                        positionIndex += chunkSize;
                        $scope.uploadAttachment(type, userDocId, result);
                    }
                    $scope.showUplaodUserDoc = false;
                    // $scope.getCandidateDetails();
                }

            },


            { buffer: true, escape: true, timeout: 120000 }
        );
    }

    // ----------------------------- AUDITED FINANCIAL STATEMENT UPLOAD ----------------------------- //
    $scope.uploadAuditedFinancial = function () {
        debugger;

        $scope.uploadProgress = 0;
        $scope.showProgressBar = true;
        $scope.isUploading = true;
        $scope.showSpinnereditProf = true;

        var file;
        var maxFileSize = 5191680;
        file = document.getElementById('auditedFinancialFile').files[0];

        if (!file) {
            swal("info", "You must choose a file before trying to upload it", "info");
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            return;
        }

        var fileName = file.name;
        var typeOfFile = fileName.split(".");
        var lengthOfType = typeOfFile.length;

        if (typeOfFile[lengthOfType - 1].toLowerCase() !== "pdf") {
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            swal('info', 'Please choose PDF file only.', 'info');
            return;
        }

        if (file.size > maxFileSize) {
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            swal("info", "File must be under 5 MB in size.", "info");
            return;
        }

        var fileReader = new FileReader();
        fileReader.onloadend = function (e) {
            var attachmentData = window.btoa(this.result);

            swal({
                title: "Confirm Upload",
                text: "Are you sure you want to upload the Audited Financial Statement?",
                icon: "warning",
                buttons: {
                    cancel: "Cancel",
                    confirm: { text: "Upload", value: true }
                }
            }).then((willUpload) => {
                if (willUpload) {
                    var userDocId = $scope.auditedFinancialDoc ? $scope.auditedFinancialDoc.userDocument.Id : '';
                    var fileId = ($scope.auditedFinancialDoc && $scope.auditedFinancialDoc.userDocument.Attachments && $scope.auditedFinancialDoc.userDocument.Attachments[0])
                        ? $scope.auditedFinancialDoc.userDocument.Attachments[0].Id : '';

                    ApplicantPortal_Contoller.doCUploadAttachmentProjectDet(
                        attachmentData, fileName, fileId, userDocId,
                        function (result, event) {
                            if (event.status) {
                                swal('success', 'Audited Financial Statement uploaded successfully!', 'success');
                                $scope.getDocsDet();
                            } else {
                                swal('error', 'Error uploading file. Please try again.', 'error');
                            }
                            $scope.isUploading = false;
                            $scope.showSpinnereditProf = false;
                            $scope.showProgressBar = false;
                            document.getElementById('auditedFinancialFile').value = "";
                            $scope.$applyAsync();
                        },
                        { buffer: true, escape: true, timeout: 120000 }
                    );
                } else {
                    $scope.isUploading = false;
                    $scope.showSpinnereditProf = false;
                    $scope.showProgressBar = false;
                    document.getElementById('auditedFinancialFile').value = "";
                    $scope.$applyAsync();
                }
            });
        };

        fileReader.onerror = function (e) {
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            swal("info", "Error reading file. Please try again.", "info");
        };

        fileReader.readAsBinaryString(file);
    }

    // ----------------------------- QUOTATION FOR EQUIPMENT/ACCESSORIES UPLOAD ----------------------------- //
    $scope.uploadQuotationEquipment = function () {
        debugger;

        $scope.uploadProgress = 0;
        $scope.showProgressBar = true;
        $scope.isUploading = true;
        $scope.showSpinnereditProf = true;

        var file;
        var maxFileSize = 5191680;
        file = document.getElementById('quotationEquipmentFile').files[0];

        if (!file) {
            swal("info", "You must choose a file before trying to upload it", "info");
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            return;
        }

        var fileName = file.name;
        var typeOfFile = fileName.split(".");
        var lengthOfType = typeOfFile.length;

        if (typeOfFile[lengthOfType - 1].toLowerCase() !== "pdf") {
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            swal('info', 'Please choose PDF file only.', 'info');
            return;
        }

        if (file.size > maxFileSize) {
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            swal("info", "File must be under 5 MB in size.", "info");
            return;
        }

        var fileReader = new FileReader();
        fileReader.onloadend = function (e) {
            var attachmentData = window.btoa(this.result);

            swal({
                title: "Confirm Upload",
                text: "Are you sure you want to upload the Quotation For Equipment/Accessories?",
                icon: "warning",
                buttons: {
                    cancel: "Cancel",
                    confirm: { text: "Upload", value: true }
                }
            }).then((willUpload) => {
                if (willUpload) {
                    var userDocId = $scope.quotationEquipmentDoc ? $scope.quotationEquipmentDoc.userDocument.Id : '';
                    var fileId = ($scope.quotationEquipmentDoc && $scope.quotationEquipmentDoc.userDocument.Attachments && $scope.quotationEquipmentDoc.userDocument.Attachments[0])
                        ? $scope.quotationEquipmentDoc.userDocument.Attachments[0].Id : '';

                    ApplicantPortal_Contoller.doCUploadAttachmentProjectDet(
                        attachmentData, fileName, fileId, userDocId,
                        function (result, event) {
                            if (event.status) {
                                swal('success', 'Quotation For Equipment/Accessories uploaded successfully!', 'success');
                                $scope.getDocsDet();
                            } else {
                                swal('error', 'Error uploading file. Please try again.', 'error');
                            }
                            $scope.isUploading = false;
                            $scope.showSpinnereditProf = false;
                            $scope.showProgressBar = false;
                            document.getElementById('quotationEquipmentFile').value = "";
                            $scope.$applyAsync();
                        },
                        { buffer: true, escape: true, timeout: 120000 }
                    );
                } else {
                    $scope.isUploading = false;
                    $scope.showSpinnereditProf = false;
                    $scope.showProgressBar = false;
                    document.getElementById('quotationEquipmentFile').value = "";
                    $scope.$applyAsync();
                }
            });
        };

        fileReader.onerror = function (e) {
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            swal("info", "Error reading file. Please try again.", "info");
        };

        fileReader.readAsBinaryString(file);
    }

    // ----------------------------- LETTER OF CONSENT UPLOAD ----------------------------- //
    $scope.uploadLetterOfConsent = function () {
        debugger;

        $scope.uploadProgress = 0;
        $scope.showProgressBar = true;
        $scope.isUploading = true;
        $scope.showSpinnereditProf = true;

        var file;
        var maxFileSize = 5191680;
        file = document.getElementById('letterOfConsentFile').files[0];

        if (!file) {
            swal("info", "You must choose a file before trying to upload it", "info");
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            return;
        }

        var fileName = file.name;
        var typeOfFile = fileName.split(".");
        var lengthOfType = typeOfFile.length;

        if (typeOfFile[lengthOfType - 1].toLowerCase() !== "pdf") {
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            swal('info', 'Please choose PDF file only.', 'info');
            return;
        }

        if (file.size > maxFileSize) {
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            swal("info", "File must be under 5 MB in size.", "info");
            return;
        }

        var fileReader = new FileReader();
        fileReader.onloadend = function (e) {
            var attachmentData = window.btoa(this.result);

            swal({
                title: "Confirm Upload",
                text: "Are you sure you want to upload the Letter of Consent?",
                icon: "warning",
                buttons: {
                    cancel: "Cancel",
                    confirm: { text: "Upload", value: true }
                }
            }).then((willUpload) => {
                if (willUpload) {
                    var userDocId = $scope.letterOfConsentDoc ? $scope.letterOfConsentDoc.userDocument.Id : '';
                    var fileId = ($scope.letterOfConsentDoc && $scope.letterOfConsentDoc.userDocument.Attachments && $scope.letterOfConsentDoc.userDocument.Attachments[0])
                        ? $scope.letterOfConsentDoc.userDocument.Attachments[0].Id : '';

                    ApplicantPortal_Contoller.doCUploadAttachmentProjectDet(
                        attachmentData, fileName, fileId, userDocId,
                        function (result, event) {
                            if (event.status) {
                                swal('success', 'Letter of Consent uploaded successfully!', 'success');
                                $scope.getDocsDet();
                            } else {
                                swal('error', 'Error uploading file. Please try again.', 'error');
                            }
                            $scope.isUploading = false;
                            $scope.showSpinnereditProf = false;
                            $scope.showProgressBar = false;
                            document.getElementById('letterOfConsentFile').value = "";
                            $scope.$applyAsync();
                        },
                        { buffer: true, escape: true, timeout: 120000 }
                    );
                } else {
                    $scope.isUploading = false;
                    $scope.showSpinnereditProf = false;
                    $scope.showProgressBar = false;
                    document.getElementById('letterOfConsentFile').value = "";
                    $scope.$applyAsync();
                }
            });
        };

        fileReader.onerror = function (e) {
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            swal("info", "Error reading file. Please try again.", "info");
        };

        fileReader.readAsBinaryString(file);
    }

    // $scope.uploadFile = function (type, userDocId, fileId,maxSize,minFileSize) {
    //     debugger;
    //     $scope.showSpinnereditProf = true;
    //     var file;

    //         file = document.getElementById('attachmentFiles').files[0];
    //         fileName = file.name;
    //         var typeOfFile = fileName.split(".");
    //         lengthOfType =  typeOfFile.length;
    //         if(typeOfFile[lengthOfType-1] != "pdf"){
    //             swal('info','Please choose pdf file only.','info');
    //             return;
    //         }
    //     console.log(file);
    //     maxFileSize=maxSize;
    //     if (file != undefined) {
    //         if (file.size <= maxFileSize) {

    //             attachmentName = file.name;
    //             const myArr = attachmentName.split(".");
    //             var fileReader = new FileReader();
    //             fileReader.onloadend = function (e) {
    //                 attachment = window.btoa(this.result);  //Base 64 encode the file before sending it
    //                 positionIndex = 0;
    //                 fileSize = attachment.length;
    //                 $scope.showSpinnereditProf = false;
    //                 console.log("Total Attachment Length: " + fileSize);
    //                 doneUploading = false;
    //                 debugger;
    //                 if (fileSize < maxStringSize) {
    //                     $scope.uploadAttachment(type , userDocId, null);
    //                 } else {
    //                     swal('info','Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".','info');
    //                     return;
    //                 }

    //             }
    //             fileReader.onerror = function (e) {
    //                 swal('info','There was an error reading the file.  Please try again.','info');
    //                 return;
    //             }
    //             fileReader.onabort = function (e) {
    //                 swal('info','There was an error reading the file.  Please try again.','info');
    //                 return;
    //             }

    //             fileReader.readAsBinaryString(file);  //Read the body of the file

    //         } else {
    //             swal('info','Your file is too large.  Please try again.','info');
    //             return;
    //             $scope.showSpinnereditProf = false;
    //         }
    //     } else {
    //         swal('info','You must choose a file before trying to upload it','info');
    //         return;
    //         $scope.showSpinnereditProf = false;
    //     }
    // }

    // $scope.uploadAttachment = function (type, userDocId, fileId) {
    //     debugger;
    //     var attachmentBody = "";
    //     // if (fileId == undefined) {
    //     //     fileId = " ";
    //     // }
    //     if (fileSize <= positionIndex + chunkSize) {
    //         debugger;
    //         attachmentBody = attachment.substring(positionIndex);
    //         doneUploading = true;
    //     } else {
    //         attachmentBody = attachment.substring(positionIndex, positionIndex + chunkSize);
    //     }
    //     console.log("Uploading " + attachmentBody.length + " chars of " + fileSize);
    //     ApplicantPortal_Contoller.doCUploadAttachmentAa(
    //         attachmentBody, attachmentName,fileId, userDocId, 
    //         function (result, event) {
    //             console.log(result);
    //             if (event.type === 'exception') {
    //                 console.log("exception");
    //                 console.log(event);
    //             } else if (event.status) {
    //                 if (doneUploading == true) {
    //                     $scope.getProjectdetils();

    //                     swal(
    //                         'success',
    //                         'Uploaded Successfully!',
    //                         'success'
    //                     )
    //                     $scope.getProjectdetils();
    //                     // $scope.disableSubmit = false;

    //                     }
    //                    // $scope.getCandidateDetails();\
    //                    else {
    //                     debugger;
    //                     positionIndex += chunkSize;
    //                     $scope.uploadAttachment(type,userDocId,result);
    //                 }
    //                 $scope.showUplaodUserDoc = false;
    //                 } 
    //         },


    //         { buffer: true, escape: true, timeout: 120000 }
    //     );
    // }
    $scope.readCharacter = function (event, index) {
        debugger
        try {
            var rtfString = event.toString().replace(/<[^>]*>|\s/g, '').replace(/\s+/g, '').replace(/&ndash;/g, '-').replace(/&euro;/g, '1').replace(/&amp;/g, '1').replace(/&#39;/g, '1').replace(/&quot;/g, '1').replace(/&nbsp;/g, '').replace(/&mdash;/g, '-').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&bull;/g, '');
            charLength = rtfString.length;
            if (charLength > 0) {
                $scope.objRtf[index].charCount = charLength;
            }
            else {
                $scope.objRtf[index].charCount = 0;
            }
        } catch (e) { }
    }

    $scope.saveDetails = function () {
        debugger;

        if ($scope.doc.userDocument.Status__c !== 'Uploaded') {
            // console.log('File already uploaded !!');
            swal({
                title: "Info",
                text: "A file must be uploaded before saving.",
                icon: "info",
                button: "OK",
            });
            return;
        }

        // if($scope.proposalDetails.Research_Approach_Objectives__c == undefined || $scope.proposalDetails.Research_Approach_Objectives__c == ""){
        //     Swal.fire(
        //         '',
        //       'Please fill main objectives of the research proposal.',
        //       'error'
        //       );
        //       return;
        // }
        // if($scope.proposalDetails.Current_State_Of_The_Art__c == undefined || $scope.proposalDetails.Current_State_Of_The_Art__c == ""){
        //     Swal.fire(
        //         '',
        //       'Please fill current state of the art.',
        //       'error'
        //       );
        //       return;
        // }
        // if($scope.proposalDetails.Project_Description__c == undefined || $scope.proposalDetails.Project_Description__c == ""){
        //     Swal.fire(
        //         '',
        //       'Please fill Project description of proposal.',
        //       'error'
        //       );
        //       return;
        // }
        // if($scope.proposalDetails.Expected_Deliverables__c == undefined || $scope.proposalDetails.Expected_Deliverables__c == ""){
        //     Swal.fire(
        //         '',
        //       'Please fill Expected Deliverables.',
        //       'error'
        //       );
        //       return;
        // }
        // if($scope.proposalDetails.Reasons_For_And_Benefits_Of_Cooperation__c == undefined || $scope.proposalDetails.Reasons_For_And_Benefits_Of_Cooperation__c == ""){
        //     Swal.fire(
        //         '',
        //       'Please fill Reasons for and benefits of cooperation including previous collaboration with the partner country.',
        //       'error'
        //       );
        //       return;
        // }
        // if($scope.proposalDetails.Equipment__c == undefined || $scope.proposalDetails.Equipment__c == ""){
        //     Swal.fire(
        //         '',
        //       'Please fill Proposal Equipment.',
        //       'error'
        //       );
        //       return;
        // }

        // if(($scope.proposalDetails.Criteria_For_Abandoning_The_Project__c == undefined || $scope.proposalDetails.Criteria_For_Abandoning_The_Project__c == "") && $rootScope.secondStage == true)
        //             {
        //                 Swal.fire(
        //                   '',
        //                 'Please fill citeria for abandoning the project.',
        //                 'error'
        //                 );
        //                     return;
        //             }

        // if(($scope.proposalDetails.Necessity_Of_Funding__c == undefined || $scope.proposalDetails.Necessity_Of_Funding__c == "") && $rootScope.secondStage == true)
        // {
        //     Swal.fire(
        //         '',
        //     'Tell us your necessity of funding..',
        //     'error'
        //     );
        //         return;
        // }
        $("#btnSubmit").html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Please wait...');
        ApplicantPortal_Contoller.insertProjectDetails($scope.proposalFieldsDetails, function (result, event) {
            $("#btnSubmit").html('<i class="fa-solid fa-check me-2"></i>Save and Next');
            if (event.status) {
                debugger;

                // Save Work Package Details
                $scope.saveWorkPackageDetailsInternal(function (wpSuccess) {
                    let messageText;

                    messageText = $rootScope.secondStage
                        ? `Project Details have been saved successfully.

                        Next Step:
                        Please fill in the Expense Declaration Info.`
                        : `Project Details have been saved successfully.

                        Next Step:
                        Please fill in the Declaration Info.`;

                    swal({
                        title: "Success",
                        text: messageText,
                        icon: "success",
                        button: "OK",
                        dangerMode: false,
                    }).then((willDelete) => {
                        if (willDelete) {
                            if ($rootScope.secondStage) {
                                $scope.redirectPageURL('ExpenseDeclaration');
                            } else {
                                $scope.redirectPageURL('Declartion_2plus2');
                            }
                        } else {
                            return;
                        }
                    });
                });
            }
        },
            { escape: true }
        )
    }

    /**
     * Internal function to save work package details (called from saveDetails)
     */
    $scope.saveWorkPackageDetailsInternal = function (callback) {
        debugger;

        // Check if there are work packages to save
        if (!$scope.workPackList || $scope.workPackList.length === 0) {
            console.log('No work packages to save');
            // Still need to save deliverables and grants even if no work packages
            $scope.saveDeliverablesInternal(function (deliverablesSuccess) {
                if (deliverablesSuccess) {
                    console.log('Deliverables saved successfully (no work packages)');
                } else {
                    console.error('Error saving deliverables');
                }
                if (callback) callback(true);
            });
            return;
        }

        var objData = JSON.parse(JSON.stringify($scope.workPackList));

        // === ADD VALIDATIONS HERE (BEFORE preparing data) ===
        for (var i = 0; i < objData.length; i++) {
            var count = 0;
            if (objData[i].AccountList) {
                for (var k = 0; k < objData[i].AccountList.length; k++) {
                    if (objData[i].AccountList[k].selected == true) {
                        count = count + 1;
                    }
                }
            }
            if (count <= 0) {
                swal("Work Package Details", "Please Select Partners.");
                $("#account" + i + "").addClass('border-theme');
                return;
            }

            if (objData[i].trl_level == undefined || objData[i].trl_level == "") {
                swal("Work Package Details", "Please Enter Start TRL Level.");
                $("#STL" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].end_trl_level == undefined || objData[i].end_trl_level == "") {
                swal("Work Package Details", "Please Enter End TRL Level.");
                $("#ETL" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].trl_level < 3 || objData[i].trl_level > 9) {
                swal("Work Package Details", "Minimum TRL Level should be 3 and Maximum TRL Level should be 9");
                $("#STL" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].end_trl_level < 3 || objData[i].end_trl_level > 9) {
                swal("Work Package Details", "Minimum TRL Level should be 3 and Maximum TRL Level should be 9");
                $("#ETL" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].end_trl_level < objData[i].trl_level) {
                swal("Work Package Details", "End TRL Level should be greater than Start TRL Level.");
                $("#ETL" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].title == undefined || objData[i].title == "") {
                swal("Work Package Details", "Please Enter Title.");
                $("#title" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].duration == undefined || objData[i].duration == "") {
                swal("Work Package Details", "Please Enter Duration.");
                $("#duration" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].duration != undefined && objData[i].duration != "") {
                if (Number(objData[i].duration) > Number($rootScope.maxDurationInMonths)) {
                    swal("Work Package Details", "Max. Duration can be " + $rootScope.maxDurationInMonths + " months.");
                    $("#duration" + i + "").addClass('border-theme');
                    return;
                }
            }

        }
        // === END VALIDATIONS ===

        // Prepare data for saving - map field names to match Apex wrapper
        for (var i = 0; i < objData.length; i++) {
            delete objData[i]['$$hashKey'];
            delete objData[i]['durationError'];
            delete objData[i]['durationErrorMsg'];
            delete objData[i]['minDurationError'];
            delete objData[i]['maxDurationError'];

            // Map externalId to ExternalId (Apex expects capital E)
            if (objData[i].externalId !== undefined) {
                objData[i].ExternalId = String(objData[i].externalId);
                delete objData[i]['externalId'];
            }

            // Ensure Id is a string (empty string if undefined)
            if (objData[i].Id === undefined || objData[i].Id === null) {
                objData[i].Id = '';
            }

            // Convert numeric values to strings for Apex
            if (objData[i].trl_level !== undefined) {
                objData[i].trl_level = String(objData[i].trl_level);
            }
            if (objData[i].end_trl_level !== undefined) {
                objData[i].end_trl_level = String(objData[i].end_trl_level);
            }
            if (objData[i].duration !== undefined) {
                objData[i].duration = String(objData[i].duration);
            }
            if (objData[i].WPSequence !== undefined) {
                objData[i].WPSequence = String(objData[i].WPSequence);
            }

            var accountWrapperList = [];
            if (objData[i].AccountList) {
                for (var k = 0; k < objData[i].AccountList.length; k++) {
                    var acc = objData[i].AccountList[k];
                    var wrapper = {
                        accnt: { Id: acc.Id, Name: acc.Name },
                        isSelected: acc.selected === true
                    };
                    if (acc.accountMappingId !== undefined && acc.accountMappingId !== null) {
                        wrapper.accountMappingId = acc.accountMappingId;
                    }
                    accountWrapperList.push(wrapper);
                }
            }
            objData[i].AccountListWrapper = accountWrapperList;
            delete objData[i]['AccountList'];
        }

        console.log('Saving work package data from saveDetails:', objData);

        ApplicantPortal_Contoller.saveWorkPackageDet(objData, $rootScope.proposalId, $rootScope.stage, function (result, event) {
            debugger;
            console.log('Save work package result:', result);
            if (event.status && result === 'success') {
                console.log('Work packages saved successfully');
                // Save deliverables after work packages
                $scope.saveDeliverablesInternal(function (deliverablesSuccess) {
                    if (deliverablesSuccess) {
                        console.log('Deliverables saved successfully');
                    } else {
                        console.error('Error saving deliverables');
                    }
                    // Call callback after both are done
                    if (callback) callback(true);
                });
            } else {
                console.error('Error saving work packages:', event.message || result);
                if (callback) callback(false);
            }
        });
    }

    /**
     * Internal function to save deliverables (called from saveDetails)
     */
    $scope.saveDeliverablesInternal = function (callback) {
        debugger;

        // Check if there are deliverables to save
        if (!$scope.PIList || $scope.PIList.length === 0) {
            console.log('No deliverables to save');
            // Still need to save grants even if no deliverables
            $scope.saveExistingGrantsInternal(function (grantsSuccess) {
                if (grantsSuccess) {
                    console.log('Existing grants saved successfully (no deliverables)');
                } else {
                    console.error('Error saving existing grants');
                }
                if (callback) callback(true);
            });
            return;
        }

        var objData = JSON.parse(JSON.stringify($scope.PIList));

        // Prepare data for saving
        for (var i = 0; i < objData.length; i++) {
            if (objData[i].Due_Date__c != undefined && objData[i].Due_Date__c != "") {
                var dueDate = new Date(objData[i].Due_Date__c);
                objData[i].year = dueDate.getUTCFullYear();
                objData[i].month = dueDate.getUTCMonth() + 1;
                objData[i].day = dueDate.getDate();
            }
            delete objData[i]['$$hashKey'];
            delete objData[i]['durationError'];
            delete objData[i]['durationErrorMsg'];
            delete objData[i]['minDurationError'];
            delete objData[i]['maxDurationError'];

            var accountWrapperList = [];
            if (objData[i].AccountList) {
                for (var k = 0; k < objData[i].AccountList.length; k++) {
                    var acc = objData[i].AccountList[k];
                    var wrapper = {
                        accnt: { Id: acc.Id, Name: acc.Name },
                        isSelected: acc.selected === true
                    };
                    if (acc.accountMappingId != undefined) {
                        wrapper.accountMappingId = acc.accountMappingId;
                    }
                    accountWrapperList.push(wrapper);
                }
            }
            objData[i].AccountListWrapper = accountWrapperList;
            delete objData[i]['AccountList'];
            delete objData[i]['Due_Date__c'];
        }

        console.log('Saving deliverables from saveDetails:', objData);

        ApplicantPortal_Contoller.saveDeliverables(objData, $rootScope.proposalId, function (result, event) {
            debugger;
            console.log('Save deliverables result:', result);
            if (event.status) {
                console.log('Deliverables saved successfully');
                // Save existing grants after deliverables
                $scope.saveExistingGrantsInternal(function (grantsSuccess) {
                    if (grantsSuccess) {
                        console.log('Existing grants saved successfully');
                    } else {
                        console.error('Error saving existing grants');
                    }
                    if (callback) callback(true);
                });
            } else {
                console.error('Error saving deliverables:', event.message);
                if (callback) callback(false);
            }
        });
    }

    /**
     * Internal function to save existing grants (called from saveDeliverablesInternal)
     */
    $scope.saveExistingGrantsInternal = function (callback) {
        debugger;

        // Check if there are grants to save
        if (!$scope.input || $scope.input.length === 0) {
            console.log('No existing grants to save');
            if (callback) callback(true);
            return;
        }

        // Build grant list for saving
        var grantListToSave = [];
        for (var i = 0; i < $scope.input.length; i++) {
            if ($scope.input[i].Existing_Grants__r) {
                for (var j = 0; j < $scope.input[i].Existing_Grants__r.length; j++) {
                    var grant = $scope.input[i].Existing_Grants__r[j];

                    // Set defaults for empty values
                    if (grant.Budget__c === undefined || grant.Budget__c === "") {
                        grant.Budget__c = 0;
                    }
                    if (grant.Duration__c === undefined || grant.Duration__c === "") {
                        grant.Duration__c = 0;
                    }

                    var grantApplication = {
                        "title": grant.Title__c || "",
                        "fundingagency": grant.Funding_Agency__c || "",
                        "Account": $scope.input[i].Id,
                        "AccountName": $scope.input[i].Name,
                        "duration": grant.Duration__c,
                        "budget": grant.Budget__c,
                        "id": (grant.Id && grant.Id.length > 0) ? grant.Id : null,
                        "startingyear": 0,
                        "startingmonth": 0,
                        "startingday": 0,
                        "Application": $scope.input[i].Proposals__c || $rootScope.proposalId
                    };

                    // Handle date
                    if (grant.Starting_Date__c !== undefined && grant.Starting_Date__c !== "") {
                        var startDate;
                        if (grant.Starting_Date__c instanceof Date) {
                            startDate = grant.Starting_Date__c;
                        } else {
                            startDate = new Date(grant.Starting_Date__c);
                        }
                        grantApplication.startingyear = startDate.getUTCFullYear();
                        grantApplication.startingmonth = startDate.getUTCMonth() + 1;
                        grantApplication.startingday = startDate.getDate();
                    }

                    grantListToSave.push(grantApplication);
                }
            }
        }

        if (grantListToSave.length === 0) {
            console.log('No grants data to save');
            if (callback) callback(true);
            return;
        }

        console.log('Saving existing grants:', grantListToSave);

        ApplicantPortal_Contoller.insertExistingGrants(grantListToSave, $rootScope.apaId, function (result, event) {
            debugger;
            console.log('Save existing grants result:', result);
            if (event.status) {
                console.log('Existing grants saved successfully');
                if (callback) callback(true);
            } else {
                console.error('Error saving existing grants:', event.message);
                if (callback) callback(false);
            }
        }, { escape: true });
    }





    $scope.uploadFileToUserDoc = function () {
        debugger;
        $scope.selecteduDoc;
        if ($scope.fileId != undefined) {
            $scope.uploadFile($scope.proposalDetails.Id, $scope.fileId);
        } else {
            $scope.uploadFile($scope.proposalDetails.Id, "");
        }
    }

    $scope.redirectPageURL = function (pageName) {
        debugger;
        var link = document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href = "#/" + pageName;
        link.click();
    }

    /* ###################### NEW RTF FIELDS LOGIC HANDLED HERE  ###################### */
    $scope.proposalFieldsDetails;

    // $scope.objRtf = [{ charCount: 0, maxCharLimit: 1000, errorStatus: false }];

    $scope.getProjectDetailsData = function () {
        debugger;
        ApplicantPortal_Contoller.getProjectDetailsFromApex($rootScope.proposalId, function (result, event) {
            debugger;
            if (event.status && result) {
                debugger;
                // FOR STAGE 1 FIELDS
                if (result.Research_Approach_Objectives__c != undefined || result.Research_Approach_Objectives__c != "") {
                    result.Research_Approach_Objectives__c = result.Research_Approach_Objectives__c ? result.Research_Approach_Objectives__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Research_Approach_Objectives__c;
                }
                if (result.Current_State_Of_The_Art__c != undefined || result.Current_State_Of_The_Art__c != "") {
                    result.Current_State_Of_The_Art__c = result.Current_State_Of_The_Art__c ? result.Current_State_Of_The_Art__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Current_State_Of_The_Art__c;
                }
                if (result.Project_Description__c != undefined || result.Project_Description__c != "") {
                    result.Project_Description__c = result.Project_Description__c ? result.Project_Description__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Project_Description__c;
                }
                if (result.Expected_Deliverables__c != undefined || result.Expected_Deliverables__c != "") {
                    result.Expected_Deliverables__c = result.Expected_Deliverables__c ? result.Expected_Deliverables__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Expected_Deliverables__c;
                }
                if (result.Reasons_For_And_Benefits_Of_Cooperation__c != undefined || result.Reasons_For_And_Benefits_Of_Cooperation__c != "") {
                    result.Reasons_For_And_Benefits_Of_Cooperation__c = result.Reasons_For_And_Benefits_Of_Cooperation__c ? result.Reasons_For_And_Benefits_Of_Cooperation__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Reasons_For_And_Benefits_Of_Cooperation__c;
                }
                if (result.Equipment__c != undefined || result.Equipment__c != "") {
                    result.Equipment__c = result.Equipment__c ? result.Equipment__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Equipment__c;
                }
                if (result.Brief_Statement_of_Purpose__c != undefined || result.Brief_Statement_of_Purpose__c != "") {
                    result.Brief_Statement_of_Purpose__c = result.Brief_Statement_of_Purpose__c ? result.Brief_Statement_of_Purpose__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Brief_Statement_of_Purpose__c;
                }

                // FOR STAGE 2 FIELDS
                if (result.Main_Objective_Research_Approach_S2__c != undefined || result.Main_Objective_Research_Approach_S2__c != "") {
                    result.Main_Objective_Research_Approach_S2__c = result.Main_Objective_Research_Approach_S2__c ? result.Main_Objective_Research_Approach_S2__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Main_Objective_Research_Approach_S2__c;
                }
                if (result.Current_State_Of_The_Art_Stage_2__c != undefined || result.Current_State_Of_The_Art_Stage_2__c != "") {
                    result.Current_State_Of_The_Art_Stage_2__c = result.Current_State_Of_The_Art_Stage_2__c ? result.Current_State_Of_The_Art_Stage_2__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Current_State_Of_The_Art_Stage_2__c;
                }
                if (result.Project_Description_Stage_2__c != undefined || result.Project_Description_Stage_2__c != "") {
                    result.Project_Description_Stage_2__c = result.Project_Description_Stage_2__c ? result.Project_Description_Stage_2__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Project_Description_Stage_2__c;
                }
                if (result.Risk_Assessment_And_Migration_Strategy__c != undefined || result.Risk_Assessment_And_Migration_Strategy__c != "") {
                    result.Risk_Assessment_And_Migration_Strategy__c = result.Risk_Assessment_And_Migration_Strategy__c ? result.Risk_Assessment_And_Migration_Strategy__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Risk_Assessment_And_Migration_Strategy__c;
                }
                if (result.Reasons_For_And_Benefits_Of_Corp_Stage2__c != undefined || result.Reasons_For_And_Benefits_Of_Corp_Stage2__c != "") {
                    result.Reasons_For_And_Benefits_Of_Corp_Stage2__c = result.Reasons_For_And_Benefits_Of_Corp_Stage2__c ? result.Reasons_For_And_Benefits_Of_Corp_Stage2__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Reasons_For_And_Benefits_Of_Corp_Stage2__c;
                }
                if (result.Innovative_Aspects__c != undefined || result.Innovative_Aspects__c != "") {
                    result.Innovative_Aspects__c = result.Innovative_Aspects__c ? result.Innovative_Aspects__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Innovative_Aspects__c;
                }
                if (result.Market_Assessment_Of_Proposed_Tech__c != undefined || result.Market_Assessment_Of_Proposed_Tech__c != "") {
                    result.Market_Assessment_Of_Proposed_Tech__c = result.Market_Assessment_Of_Proposed_Tech__c ? result.Market_Assessment_Of_Proposed_Tech__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Market_Assessment_Of_Proposed_Tech__c;
                }
                if (result.Future_Commercialization_Plan__c != undefined || result.Future_Commercialization_Plan__c != "") {
                    result.Future_Commercialization_Plan__c = result.Future_Commercialization_Plan__c ? result.Future_Commercialization_Plan__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Future_Commercialization_Plan__c;
                }
                if (result.Data_Management_And_Sharing_Protocols__c != undefined || result.Data_Management_And_Sharing_Protocols__c != "") {
                    result.Data_Management_And_Sharing_Protocols__c = result.Data_Management_And_Sharing_Protocols__c ? result.Data_Management_And_Sharing_Protocols__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Data_Management_And_Sharing_Protocols__c;
                }
                if (result.Involvement_Of_Young_Scientists__c != undefined || result.Involvement_Of_Young_Scientists__c != "") {
                    result.Involvement_Of_Young_Scientists__c = result.Involvement_Of_Young_Scientists__c ? result.Involvement_Of_Young_Scientists__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Involvement_Of_Young_Scientists__c;
                }
                if (result.Necessity_Of_Funding__c != undefined || result.Necessity_Of_Funding__c != "") {
                    result.Necessity_Of_Funding__c = result.Necessity_Of_Funding__c ? result.Necessity_Of_Funding__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Necessity_Of_Funding__c;
                }

                // Annexures Fields
                if (result.Tentative_plans_for_networking__c != undefined || result.Tentative_plans_for_networking__c != "") {
                    result.Tentative_plans_for_networking__c = result.Tentative_plans_for_networking__c ? result.Tentative_plans_for_networking__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Tentative_plans_for_networking__c;
                }
                if (result.Plan_For_Utilisation_and_Preservation__c != undefined || result.Plan_For_Utilisation_and_Preservation__c != "") {
                    result.Plan_For_Utilisation_and_Preservation__c = result.Plan_For_Utilisation_and_Preservation__c ? result.Plan_For_Utilisation_and_Preservation__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Plan_For_Utilisation_and_Preservation__c;
                }
                if (result.Profile_Of_The_Academic_Institutions__c != undefined || result.Profile_Of_The_Academic_Institutions__c != "") {
                    result.Profile_Of_The_Academic_Institutions__c = result.Profile_Of_The_Academic_Institutions__c ? result.Profile_Of_The_Academic_Institutions__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Profile_Of_The_Academic_Institutions__c;
                }

                $scope.proposalFieldsDetails = result;
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }
    $scope.getProjectDetailsData();

    // $scope.readCharacter = function (event, index) {
    //     debugger;

    //     try {
    //         var rtfString = event.toString().replace(/<[^>]*>|\s/g, '').replace(/\s+/g, '').replace(/&ndash;/g, '-').replace(/&euro;/g, '1').replace(/&amp;/g, '1').replace(/&#39;/g, '1').replace(/&quot;/g, '1').replace(/&nbsp;/g, '').replace(/&mdash;/g, '-').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&bull;/g, '');
    //         charLength = rtfString.length;
    //         if (charLength > 0) {
    //             $scope.objRtf[index].charCount = charLength;
    //             if (charLength > $scope.objRtf[index].maxCharLimit) {
    //                 $scope.objRtf[index].errorStatus = true;
    //             } else {
    //                 $scope.objRtf[index].errorStatus = false;
    //             }
    //         }
    //         else {
    //             $scope.objRtf[index].charCount = 0;
    //             $scope.objRtf[index].errorStatus = false;
    //         }
    //     } catch (e) { }
    // }



    $scope.objRtf = []; // start empty

    $scope.readCharacter = function (event, index, maxLimit) {
        try {

            // Initialize index if not exists
            if (!$scope.objRtf[index]) {
                $scope.objRtf[index] = {
                    charCount: 0,
                    maxCharLimit: maxLimit,
                    errorStatus: false
                };
            }

            if (!event) {
                $scope.objRtf[index].charCount = 0;
                $scope.objRtf[index].errorStatus = false;
                return;
            }

            // Strip HTML tags + entities
            var plainText = event
                .replace(/<[^>]*>/g, '')
                .replace(/&nbsp;/g, ' ')
                .replace(/&[a-zA-Z0-9#]+;/g, ' ');

            var charLength = plainText.length;

            $scope.objRtf[index].charCount = charLength;
            $scope.objRtf[index].errorStatus = charLength > maxLimit;

        } catch (e) { }
    };


    // ----------------------------- DELIVERABLES FUNCTIONALITY ----------------------------- //

    // Deliverables Variables
    $scope.PIList = [];
    $scope.deliverableAccountList = [];
    $scope.deliverableDefaultAccountList = [];
    const deliverableAccountIdXaccount = new Map();

    /**
     * Gets proposal accounts for deliverables
     */
    $scope.getDeliverableAccounts = function () {
        ApplicantPortal_Contoller.getProposalAccountsFromAPA($rootScope.proposalId, function (result, event) {
            if (event.status) {
                console.log('Deliverable accounts:', result);
                $scope.deliverableAccountList = result || [];
                if ($scope.deliverableAccountList.length > 0) {
                    for (var i = 0; i < $scope.deliverableAccountList.length; i++) {
                        deliverableAccountIdXaccount.set($scope.deliverableAccountList[i].Id, $scope.deliverableAccountList[i]);
                        var option = {
                            'Id': $scope.deliverableAccountList[i].Id,
                            'Name': $scope.deliverableAccountList[i].Name,
                            'selected': false
                        };
                        $scope.deliverableDefaultAccountList.push(option);
                    }
                }
                // Load deliverables after accounts are loaded
                $scope.getDeliverablesDetails();
                $scope.$applyAsync();
            } else {
                console.error('Error loading deliverable accounts:', event.message);
            }
        });
    }

    /**
     * Adds new deliverable row
     */
    $scope.addRows = function () {
        debugger;
        var externalid = 0;
        if ($scope.PIList.length > 0) {
            externalid = $scope.PIList[$scope.PIList.length - 1].externalId || 0;
        }

        var accList = [];
        // Use deliverableDefaultAccountList or deliverableAccountList
        var sourceList = $scope.deliverableDefaultAccountList.length > 0
            ? $scope.deliverableDefaultAccountList
            : $scope.deliverableAccountList;

        for (var i = 0; i < sourceList.length; i++) {
            var option = {
                'Id': sourceList[i].Id,
                'Name': sourceList[i].Name,
                'selected': false
            };
            accList.push(option);
        }

        $scope.PIList.push({
            title: "",
            externalId: externalid + 1,
            AccountList: accList
        });

        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    /**
     * Removes deliverable row
     */
    $scope.removeDeliverableRow = function (index) {
        debugger;
        if ($scope.PIList.length == 1) {
            return;
        }
        if ($scope.PIList[index].Id == undefined) {
            $scope.PIList.splice(index, 1);
            return;
        }
        ApplicantPortal_Contoller.deleteDeliverables($scope.PIList[index].Id, function (result, event) {
            if (event.status) {
                swal("PI Deliverables", "Your PI Deliverables detail has been deleted successfully.");
                $scope.PIList.splice(index, 1);
            }
            $scope.$applyAsync();
        });
    }

    /**
     * Gets deliverables details by proposal ID
     */
    $scope.getDeliverablesDetails = function () {
        ApplicantPortal_Contoller.getDeliverablesDetailsByProposalId($rootScope.proposalId, function (result, event) {
            debugger;
            console.log('Deliverables details:', result);
            if (event.status && result) {
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        const accountIdXselectedAcc = new Map();
                        var accDetails = [];

                        if (result[i].Deliverables_Account_Mapping__r != undefined) {
                            for (var j = 0; j < result[i].Deliverables_Account_Mapping__r.length; j++) {
                                accountIdXselectedAcc.set(result[i].Deliverables_Account_Mapping__r[j].Account__c, result[i].Deliverables_Account_Mapping__r[j]);
                            }
                            for (const accountId of deliverableAccountIdXaccount.keys()) {
                                if (accountIdXselectedAcc.has(accountId)) {
                                    var option = {
                                        'Id': deliverableAccountIdXaccount.get(accountId).Id,
                                        'Name': deliverableAccountIdXaccount.get(accountId).Name,
                                        'selected': true,
                                        'accountMappingId': accountIdXselectedAcc.get(accountId).Id
                                    };
                                } else {
                                    var option = {
                                        'Id': deliverableAccountIdXaccount.get(accountId).Id,
                                        'Name': deliverableAccountIdXaccount.get(accountId).Name,
                                        'selected': false
                                    };
                                }
                                accDetails.push(option);
                            }
                        } else {
                            accDetails = JSON.parse(JSON.stringify($scope.deliverableDefaultAccountList));
                        }

                        if (result[i].Due_Date__c != undefined) {
                            result[i].Due_Date__c = new Date(result[i].Due_Date__c);
                        }

                        $scope.PIList.push({
                            "AccountList": accDetails,
                            "title": result[i].Title__c,
                            "Due_Date__c": result[i].Due_Date__c,
                            Id: result[i].Id,
                            externalId: i
                        });
                    }
                } else {
                    // Add empty row if no deliverables exist
                    $scope.PIList.push({
                        title: "",
                        externalId: 0,
                        "AccountList": JSON.parse(JSON.stringify($scope.deliverableDefaultAccountList))
                    });
                }
                $scope.$applyAsync();
            }
        }, {
            escape: true
        });
    }

    // Load deliverable accounts on init
    $scope.getDeliverableAccounts();

    /**
     * Saves deliverables
     */
    $scope.saveDeliverables = function () {
        debugger;
        var objData = JSON.parse(JSON.stringify($scope.PIList));

        // Validation
        for (var i = 0; i < objData.length; i++) {
            var count = 0;
            if (objData[i].AccountList) {
                for (var k = 0; k < objData[i].AccountList.length; k++) {
                    if (objData[i].AccountList[k].selected == true) {
                        count = count + 1;
                    }
                }
            }
            if (count <= 0) {
                swal("PI Deliverables Details", "Please Select Partners.");
                $("#partner" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].title == undefined || objData[i].title == "") {
                swal("PI Deliverables Details", "Please Enter Title.");
                $("#title" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].Due_Date__c == undefined || objData[i].Due_Date__c == "") {
                swal("PI Deliverables Details", "Please Enter Due Date.");
                $("#due" + i + "").addClass('border-theme');
                return;
            }
        }

        // Prepare data for saving
        for (var i = 0; i < objData.length; i++) {
            if (objData[i].Due_Date__c != undefined && objData[i].Due_Date__c != "") {
                var dueDate = new Date(objData[i].Due_Date__c);
                objData[i].year = dueDate.getUTCFullYear();
                objData[i].month = dueDate.getUTCMonth() + 1;
                objData[i].day = dueDate.getDate();
            }
            delete objData[i]['$$hashKey'];
            delete objData[i]['durationError'];
            delete objData[i]['durationErrorMsg'];
            delete objData[i]['minDurationError'];
            delete objData[i]['maxDurationError'];

            var accountWrapperList = [];
            if (objData[i].AccountList) {
                for (var k = 0; k < objData[i].AccountList.length; k++) {
                    var acc = objData[i].AccountList[k];
                    var wrapper = {
                        accnt: { Id: acc.Id, Name: acc.Name },
                        isSelected: acc.selected === true
                    };
                    if (acc.accountMappingId != undefined) {
                        wrapper.accountMappingId = acc.accountMappingId;
                    }
                    accountWrapperList.push(wrapper);
                }
            }
            objData[i].AccountListWrapper = accountWrapperList;
            delete objData[i]['AccountList'];
            delete objData[i]['Due_Date__c'];
        }

        console.log('Saving deliverables:', objData);

        ApplicantPortal_Contoller.saveDeliverables(objData, $rootScope.proposalId, function (result, event) {
            debugger;
            console.log('Save deliverables result:', result);
            if (event.status) {
                swal("PI Deliverables", "Your PI Deliverables detail has been saved successfully.");
                //$scope.redirectPageURL('Network_Meeting');
            } else {
                console.error('Error saving deliverables:', event.message);
                swal("Error", "Failed to save deliverables. Please try again.", "error");
            }
            $scope.$applyAsync();
        });
    }

    /**
     * Removes border theme class for deliverables
     */
    $scope.removeDeliverableClass = function (controlid, index) {
        debugger;
        var controlIdfor = controlid + "" + index;
        $("#" + controlIdfor + "").removeClass('border-theme');
    }

    /* ------------------------------- ONGOING PROJECTS / GRANT APPLICATIONS ------------------------------- */
    $scope.getApplicantDetails = function () {
        // ApplicantPortal_Contoller.getApplicantDetailsForGrant($rootScope.candidateId, function (result, event) {
        ApplicantPortal_Contoller.getApplicantDetailsForGrant($rootScope.apaId, $rootScope.proposalId, function (result, event) {
            if (event.status) {
                debugger;
                $scope.applicantDetails = result;
                $scope.grants = [];
                for (var i = 0; i < $scope.applicantDetails.length; i++) {
                    statusLoginHas = 0;
                    if ($scope.applicantDetails[i].Contacts != undefined) {
                        for (j = 0; j < $scope.applicantDetails[i].Contacts.length; j++) {
                            if ($scope.applicantDetails[i].Contacts[j].Login_Hash_Code__c == $rootScope.candidateId) {
                                $scope.input.push($scope.applicantDetails[i]);
                                statusLoginHas = 1;
                            }
                        }
                    }
                    if (statusLoginHas == 0) {
                        $scope.disableGrants.push($scope.applicantDetails[i]);
                    }
                }
                for (var i = 0; i < $scope.input.length; i++) {
                    if ($scope.input[i].Existing_Grants__r != undefined) {
                        for (var j = 0; j < $scope.input[i].Existing_Grants__r.length; j++) {
                            if ($scope.input[i].Existing_Grants__r[j].Starting_Date__c != undefined) {
                                $scope.input[i].Existing_Grants__r[j].Starting_Date__c = new Date($scope.input[i].Existing_Grants__r[j].Starting_Date__c);
                            }
                        }

                    } else if ($scope.input[i].Existing_Grants__r == undefined) {
                        var rec = {
                            'Account__r.Name': $scope.input[i].Name,
                            'Title__c': '',
                            'Funding_Agency__c': '',
                            'Duration__c': '',
                            'Budget__c': '',
                            'Starting_Date__c': '',
                            'Account__c': $scope.input[i].Id,
                            'Application__c': $scope.input[i].Proposals__c
                        };
                        $scope.input[i].Existing_Grants__r = [];
                        debugger;
                        $scope.input[i].Existing_Grants__r.push(rec);
                    }
                }
                for (var i = 0; i < $scope.disableGrants.length; i++) {
                    if ($scope.disableGrants[i].Existing_Grants__r != undefined) {
                        for (var j = 0; j < $scope.disableGrants[i].Existing_Grants__r.length; j++) {
                            if ($scope.disableGrants[i].Existing_Grants__r[j].Starting_Date__c != undefined) {
                                var date = new Date($scope.disableGrants[i].Existing_Grants__r[j].Starting_Date__c);
                                var year = date.getUTCFullYear();
                                var month = date.getMonth() + 1;
                                var day = date.getDate();
                                $scope.disableGrants[i].Existing_Grants__r[j].Starting_Date__c = year.toString() + '-' + month.toString() + '-' + day.toString();
                            }
                        }
                    }
                }

                var existingGrant = [{ "title": "", "fundingagency": "", "Account": "", "AccountName": "", "duration": "", "budget": "", "id": "", "startingyear": 0, "startingmonth": 0, "startingday": 0, "Application": "" }];
                $scope.grants.push(existingGrant);
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }
    $scope.getApplicantDetails();

    /**
     * Adds a new row to existing grants table
     */
    $scope.addRow = function (index) {
        var rec = {
            'Account__r.Name': $scope.input[index].Name,
            'Title__c': '',
            'Funding_Agency__c': '',
            'Duration__c': '',
            'Budget__c': '',
            'Starting_Date__c': '',
            'Account__c': $scope.input[index].Id,
            'Application__c': $scope.input[index].Proposals__c
        };
        if ($scope.input[index].Existing_Grants__r == undefined) {
            $scope.input[index].Existing_Grants__r = [];
        }
        $scope.input[index].Existing_Grants__r.push(rec);
    }

    /**
     * Deletes a row from existing grants table
     */
    $scope.deleteRow = function (parentIndex, childIndex) {
        if ($scope.input[parentIndex].Existing_Grants__r.length > 1) {
            $scope.input[parentIndex].Existing_Grants__r.splice(childIndex, 1);
        } else {
            swal("Info", "At least one grant record is required.");
        }
    }

    $scope.submitExistingGrants = function () {
        debugger;
        for (var i = 0; i < $scope.input.length; i++) {
            for (var j = 0; j < $scope.input[i].Existing_Grants__r.length; j++) {
                if ($scope.input[i].Existing_Grants__r[j].Funding_Agency__c == undefined || $scope.input[i].Existing_Grants__r[j].Funding_Agency__c == "") {
                    swal("Existing Grants", "Please Enter Funding Agency.");
                    return;
                }
                if ($scope.input[i].Existing_Grants__r[j].Budget__c == undefined || $scope.input[i].Existing_Grants__r[j].Budget__c == "") {
                    swal("Existing Grants", "Please Enter Budget.");
                    return;
                }
                if ($scope.input[i].Existing_Grants__r[j].Starting_Date__c == undefined || $scope.input[i].Existing_Grants__r[j].Starting_Date__c == "") {
                    swal("Existing Grants", "Please Enter Starting Date.");
                    return;
                }
                if ($scope.input[i].Existing_Grants__r[j].Duration__c == undefined || $scope.input[i].Existing_Grants__r[j].Duration__c == "") {
                    swal("Existing Grants", "Please Enter Duration(Number in months).");
                    return;
                }
            }
        }
        $scope.grantList = [];
        for (let i = 0; i < $scope.input.length; i++) {
            for (let j = 0; j < $scope.input[i].Existing_Grants__r.length; j++) {
                if ($scope.input[i].Existing_Grants__r[j].Budget__c == undefined || $scope.input[i].Existing_Grants__r[j].Budget__c == "") {
                    $scope.input[i].Existing_Grants__r[j].Budget__c = 0;
                    // Number('$scope.applicantDetails[i].Existing_Grants__r[j].Budget__c');
                }
                if ($scope.input[i].Existing_Grants__r[j].Duration__c == undefined || $scope.input[i].Existing_Grants__r[j].Duration__c == "") {
                    $scope.input[i].Existing_Grants__r[j].Duration__c = 0;
                    // Number('$scope.applicantDetails[i].Existing_Grants__r[j].Duration__c'); 
                }
                var grantId = $scope.input[i].Existing_Grants__r[j].Id;
                var grantApplication = {
                    "title": $scope.input[i].Existing_Grants__r[j].Title__c || "",
                    "fundingagency": $scope.input[i].Existing_Grants__r[j].Funding_Agency__c || "",
                    "Account": $scope.input[i].Id,
                    "AccountName": $scope.input[i].Name,
                    "duration": $scope.input[i].Existing_Grants__r[j].Duration__c,
                    "budget": $scope.input[i].Existing_Grants__r[j].Budget__c,
                    "id": (grantId && grantId.length > 0) ? grantId : null,
                    "startingyear": 0,
                    "startingmonth": 0,
                    "startingday": 0,
                    "Application": $scope.input[i].Proposals__c || $rootScope.proposalId
                };
                $scope.grantList.push(grantApplication);

                if ($scope.input[i].Existing_Grants__r[j].Starting_Date__c != undefined && $scope.input[i].Existing_Grants__r[j].Starting_Date__c != "") {
                    grantApplication.startingyear = $scope.input[i].Existing_Grants__r[j].Starting_Date__c.getUTCFullYear();
                    grantApplication.startingmonth = $scope.input[i].Existing_Grants__r[j].Starting_Date__c.getUTCMonth() + 1;
                    grantApplication.startingday = $scope.input[i].Existing_Grants__r[j].Starting_Date__c.getDate();
                } else {
                    delete ($scope.input[i].Existing_Grants__r[j].Starting_Date__c);
                }

                delete ($scope.input[i].Existing_Grants__r[j].Starting_Date__c);
            }
        }
        ApplicantPortal_Contoller.insertExistingGrants($scope.grantList, $rootScope.apaId, function (result, event) {
            if (event.status) {
                debugger;
                Swal.fire(
                    'Success',
                    'your proposal has been Submitted successfully.',
                    'success'
                );
                //  
                $scope.redirectPageURL('Home');
                $scope.grantList = result;
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }

    $rootScope.minDurationInMonths = 1;

    $scope.validateDuration = function (applicnt) {
        debugger;
        // Reset flags every time
        applicnt.durationError = false;
        applicnt.minDurationError = false;
        applicnt.maxDurationError = false;

        if (applicnt.duration === null ||
            applicnt.duration === undefined ||
            applicnt.duration === '') {
            return;
        }

        var val = Number(applicnt.duration);

        // Non-numeric
        if (isNaN(val)) {
            applicnt.durationError = true;
            return;
        }

        // Minimum duration
        if ($rootScope.minDurationInMonths != null &&
            val < Number($rootScope.minDurationInMonths)) {

            applicnt.minDurationError = true;
            applicnt.durationError = true;
            return;
        }

        // Maximum duration
        if ($rootScope.maxDurationInMonths != null &&
            val > Number($rootScope.maxDurationInMonths)) {

            applicnt.maxDurationError = true;
            applicnt.durationError = true;
            return;
        }
    };


    // ----------------------------- Need to add afterwards -----------------------------
    // if ($scope.applicantDetails.Summary__c != undefined || $scope.applicantDetails.Summary__c != "") {
    //         if ($scope.objRtf[0].errorStatus) {
    //             swal("info", "Summary max. length limit is 1000 character only.", "info");
    //             return;
    //         }
    //     }

});