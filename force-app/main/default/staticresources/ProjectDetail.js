angular.module('cp_app').controller('projectCtrl', function ($scope, $sce, $rootScope) {
    debugger;

    // Page spinner control
    $scope.showPageSpinner = true;

    // Fallback timeout to hide spinner after 10 seconds (as a safety measure)
    setTimeout(function () {
        if ($scope.showPageSpinner) {
            console.log('Fallback timeout reached, hiding spinner');
            $scope.showPageSpinner = false;
            $scope.$applyAsync();
        }
    }, 10000);

    // Track loading completion
    $scope.loadingOperations = {
        proposalStage: false,
        proposalAccounts: false,
        wpDetails: false,
        wpDeliverables: false
    };

    // Function to check if all loading is complete
    $scope.checkLoadingComplete = function () {
        const allLoaded = Object.values($scope.loadingOperations).every(status => status === true);
        if (allLoaded) {
            $scope.showPageSpinner = false;
            console.log('All data loaded, hiding spinner');
            $scope.$applyAsync();
        }
    };

    // Function to mark a loading operation as complete
    $scope.markLoadingComplete = function (operation) {
        if ($scope.loadingOperations.hasOwnProperty(operation)) {
            $scope.loadingOperations[operation] = true;
            console.log('Loading operation completed:', operation);
            $scope.checkLoadingComplete();
        }
    };

    // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        $scope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);

        // Initialize Gantt Chart after proposalId is loaded
        /*
        setTimeout(function () {
            debugger;
            initializeGanttChartFromAngular($rootScope.proposalId);
        }, 1000);
        */
    }

    // Fetching the APA Id from Local Storage
    if (localStorage.getItem('apaId')) {
        $rootScope.apaId = localStorage.getItem('apaId');
        console.log('Loaded apaId from localStorage:', $rootScope.apaId);
    }

    if (localStorage.getItem('contactId')) {
        $rootScope.contactId = localStorage.getItem('contactId');
        $scope.contactId = $rootScope.contactId;
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

    // Progress variables for Project Proposal upload
    $scope.projectProposalUploadProgress = 0;
    $scope.showProjectProposalProgressBar = false;

    // Progress variables for Financial Statement Report upload
    $scope.financialStatementUploadProgress = 0;
    $scope.showFinancialStatementProgressBar = false;

    // Progress variables for Quotation Equipment upload
    $scope.quotationEquipmentUploadProgress = 0;
    $scope.showQuotationEquipmentProgressBar = false;

    $scope.uploadProgress = 0;
    $scope.showProgressBar = false;

    // Separate uploading flags per document type
    $scope.isUploadingProjectProposal = false;
    $scope.isUploadingFinancialStatement = false;
    $scope.isUploadingQuotation = false;
    $scope.isUploadingLetterOfConsent = false;
    $scope.isUploadingGrantAcceptanceUndertaking = false;
    $scope.isUploadingSensitivitySecurityUndertaking = false;

    $scope.previewFileLink = '';

    // Additional document variables
    $scope.auditedFinancialDoc = null;
    $scope.auditedFinancialPreviewLink = '';
    $scope.quotationEquipmentDoc = null;
    $scope.quotationEquipmentPreviewLink = '';
    $scope.letterOfConsentDoc = null;
    $scope.letterOfConsentPreviewLink = '';
    $scope.grantAcceptanceUndertakingDoc = null;
    $scope.grantAcceptanceUndertakingPreviewLink = '';
    $scope.sensitivitySecurityUndertakingDoc = null;
    $scope.sensitivitySecurityUndertakingPreviewLink = '';

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
    $rootScope.mailingCountry = '';

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
                        $scope.isCoordinator = $rootScope.isCoordinator;
                        $rootScope.stage = result.stage;
                        $scope.stage = $rootScope.stage;
                        $rootScope.maxDurationInMonths = result.durationInMonths;
                        $scope.maxDurations = result.durationInMonths;
                        $rootScope.mailingCountry = result.mailingCountry;
                        $scope.mailingCountry = $rootScope.mailingCountry;
                        $rootScope.secondStage = $rootScope.stage == '2nd Stage' ? true : false;

                        $scope.uploadDisable =
                            !(
                                $rootScope.currentProposalStage === "Draft"
                                && $rootScope.isCoordinator === true
                            );
                    });

                    // Mark proposal stage loading as complete
                    $scope.markLoadingComplete('proposalStage');
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
                // OLD SYSTEM: Commented out as we're using the new WP+Deliverables system
                // $scope.getWPDetails();

                // Load new WP+Deliverables combined table data
                $scope.loadWPDeliverablesData();

                // Initial Gantt chart update (will get data from database)
                setTimeout(function () {
                    $scope.updateGanttChart();
                }, 1000);

                // Mark proposal accounts loading as complete
                $scope.markLoadingComplete('proposalAccounts');

                $scope.$applyAsync();
            } else {
                console.error('Error fetching partner accounts:', event.message);
                // Still mark as complete even on error to avoid spinner hanging
                $scope.markLoadingComplete('proposalAccounts');
            }
        });
    }
    $scope.getProposalAccounts();


    // =====================================================================================
    // ==================== GANTT CHART FUNCTIONALITY ==================
    // =====================================================================================

    /*
    $scope.renderGanttChart = function () {
        try {
            console.log('Rendering Gantt Chart with wpDeliverablesTableList:', $scope.wpDeliverablesTableList);

            if (!$scope.wpDeliverablesTableList || $scope.wpDeliverablesTableList.length === 0) {
                document.getElementById($scope.getGanttChartId()).innerHTML =
                    '<div style="text-align: center; padding: 40px; color: #666;">No work packages found</div>';
                return;
            }

            // Use fixed duration from rootScope or default to 24
            let maxDuration = $rootScope.maxDurationInMonths ? parseInt($rootScope.maxDurationInMonths) : 24;

            // Generate months array for header
            let months = [];
            for (let i = 1; i <= maxDuration; i++) {
                months.push(i);
            }

            // EXACT same grid style as LWC - 1fr
            let gridStyle = `grid-template-columns: repeat(${maxDuration}, 1fr);`;

            let html = '';

            // EXACT same structure as LWC
            html += '<div class="gantt-container">';

            // Month header - EXACT same as LWC
            html += '<div class="month-row" style="' + gridStyle + '">';
            for (let i = 1; i <= maxDuration; i++) {
                html += '<div class="month">' + i + '</div>';
            }
            html += '</div>';

            // Content area with vertical lines
            html += '<div class="content-area">';

            // Vertical lines overlay - EXACT same as LWC
            html += '<div class="vertical-lines-overlay" style="' + gridStyle + '">';
            for (let i = 1; i <= maxDuration; i++) {
                html += '<div class="vertical-line"></div>';
            }
            html += '</div>';

            // Define colors array (matching LWC)
            const colors = ['#ffad43ff', '#ff8c00', '#a855f7', '#10b981', '#50d492ff', '#f59e0b', '#06b6d6', '#8b5cf6'];

            // Work Packages
            for (let wp of $scope.wpDeliverablesTableList) {

                // Parse month values
                const wpStart = wp.wpStartMonth ? parseInt(wp.wpStartMonth) : 1;
                const wpEnd = wp.wpEndMonth ? parseInt(wp.wpEndMonth) : maxDuration;

                // EXACT same style as LWC
                const wpStyle = `grid-column: ${wpStart} / ${wpEnd + 1};`;

                html += '<div class="wp-block">';

                // Work Package Row - EXACT same structure
                html += '<div class="row wp-row" style="' + gridStyle + '">';
                html += '<div class="wp-wrapper" style="' + wpStyle + '">';
                html += '<div class="wp-title">';
                html += wp.title || 'Work Package';

                // Add contact initials if they exist
                if (wp.contactInitials && wp.contactInitials.length > 0) {
                    for (let initials of wp.contactInitials) {
                        html += '<span class="contact-badges-inline contact-badge" title="' + initials + '">' + initials + '</span>';
                    }
                }

                html += '</div>'; // Close wp-title
                html += '<div class="wp-bar"></div>';
                html += '</div>'; // Close wp-wrapper
                html += '</div>'; // Close row

                // Deliverables
                if (wp.deliverables && wp.deliverables.length > 0) {
                    for (let d of wp.deliverables) {
                        const dStart = d.startMonth ? parseInt(d.startMonth) : wpStart;
                        const dEnd = d.endMonth ? parseInt(d.endMonth) : wpEnd;

                        // EXACT same style as LWC
                        const colorIndex = dStart % colors.length;
                        const dStyle = `grid-column: ${dStart} / ${dEnd + 1}; background: ${colors[colorIndex]};`;

                        html += '<div class="row deliverable-row" style="' + gridStyle + '">';
                        html += '<div class="deliverable-bar" style="' + dStyle + '">';

                        let label = d.deliverableSequence || d.Deliverable_Sequence__c || 'D';
                        html += label;

                        html += '</div>';
                        html += '</div>';
                    }
                }

                html += '</div>'; // End wp-block
            }

            html += '</div>'; // End content-area
            html += '</div>'; // End gantt-container

            document.getElementById($scope.getGanttChartId()).innerHTML = html;

        } catch (error) {
            console.error('Error rendering Gantt Chart:', error);
        }
    };

    // Watch for changes in wpDeliverablesTableList
    $scope.$watch('wpDeliverablesTableList', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            setTimeout(function () {
                $scope.renderGanttChart();
            }, 100); // Small delay to ensure DOM is ready
        }
    }, true);

    // Initial render when data is loaded
    $scope.$on('wpDataLoaded', function () {
        setTimeout(function () {
            $scope.renderGanttChart();
        }, 100);
    });
    */


    // Function to get the correct Gantt chart ID based on current stage
    $scope.getGanttChartId = function () {
        return $rootScope.stage === '2nd Stage' ? 'ganttChartStage2' : 'ganttChartStage1';
    };

    // Function to update Gantt chart with current data (even unsaved)
    $scope.updateGanttChart = function () {
        // Get current work package data from the scope (including unsaved changes)
        var currentWPData = $scope.wpDeliverablesTableList;

        if (!currentWPData || currentWPData.length === 0) {
            // If no data, show empty state
            document.getElementById($scope.getGanttChartId()).innerHTML =
                '<div style="text-align: center; padding: 40px; color: #666;">Add work packages to see Gantt chart</div>';
            return;
        }

        // Show loading indicator
        document.getElementById($scope.getGanttChartId()).innerHTML =
            '<div style="text-align: center; padding: 40px; color: #666;">Loading Gantt chart...</div>';

        // Convert current data to JSON string to send to Apex
        var wpDataJSON = angular.toJson(currentWPData);

        // Call Apex to get enriched data with contact initials
        ApplicantPortal_Contoller.getGanttChartData(
            $rootScope.proposalId,
            $rootScope.stage,
            wpDataJSON, // Send current unsaved data
            function (result, event) {
                if (event.status && result && result.success) {
                    console.log('Gantt chart data updated:', result);

                    // Update max duration if needed
                    if (result.maxDuration) {
                        $rootScope.maxDurationInMonths = result.maxDuration;
                    }

                    // Render chart with enriched data
                    $scope.renderGanttChartWithData(result.workPackages);

                    $scope.$applyAsync();
                } else {
                    console.error('Error updating Gantt chart:', event.message || result?.error);
                    // Fallback to client-side rendering without contact initials
                    $scope.renderGanttChartWithData(currentWPData);
                }
            },
            { escape: true }
        );
    };

    // Enhanced render function
    $scope.renderGanttChartWithData = function (ganttData) {
        try {
            if (!ganttData || ganttData.length === 0) {
                document.getElementById($scope.getGanttChartId()).innerHTML =
                    '<div style="text-align: center; padding: 40px; color: #666;">No work packages to display</div>';
                return;
            }

            let maxDuration = $rootScope.maxDurationInMonths ? parseInt($rootScope.maxDurationInMonths) : 36;
            let gridStyle = `grid-template-columns: repeat(${maxDuration}, 1fr);`;

            let html = '<div class="gantt-container">';

            // Month header
            html += '<div class="month-row" style="' + gridStyle + '">';
            for (let i = 1; i <= maxDuration; i++) {
                html += '<div class="month">' + i + '</div>';
            }
            html += '</div>';

            // Content area with vertical lines
            html += '<div class="content-area">';
            html += '<div class="vertical-lines-overlay" style="' + gridStyle + '">';
            for (let i = 1; i <= maxDuration; i++) {
                html += '<div class="vertical-line"></div>';
            }
            html += '</div>';

            const colors = ['#ffad43ff', '#ff8c00', '#a855f7', '#0e7adfff', '#50d492ff', '#f59e0b', '#06a5d6ff', '#8b5cf6'];

            // Work Packages
            for (let wp of ganttData) {
                const wpStart = wp.wpStartMonth ? parseInt(wp.wpStartMonth) : 1;
                const wpEnd = wp.wpEndMonth ? parseInt(wp.wpEndMonth) : maxDuration;

                // Ensure valid numbers
                if (isNaN(wpStart) || isNaN(wpEnd)) continue;

                const wpStyle = `grid-column: ${wpStart} / ${wpEnd + 1};`;

                html += '<div class="wp-block">';

                // Work Package Row
                html += '<div class="row wp-row" style="' + gridStyle + '">';
                html += '<div class="wp-wrapper" style="' + wpStyle + '">';
                html += '<div class="wp-title">';
                html += wp.title || 'Work Package ' + (wp.wpSequence || '');

                // Add contact initials if they exist
                if (wp.contactInitials && wp.contactInitials.length > 0) {
                    for (let initials of wp.contactInitials) {
                        if (initials) {
                            html += '<span class="contact-badges-inline contact-badge" title="' + initials + '">' + initials + '</span>';
                        }
                    }
                }

                html += '</div>'; // Close wp-title
                html += '<div class="wp-bar"></div>';
                html += '</div>'; // Close wp-wrapper
                html += '</div>'; // Close row

                // Deliverables
                if (wp.deliverables && wp.deliverables.length > 0) {
                    for (let d of wp.deliverables) {
                        const dStart = d.startMonth ? parseInt(d.startMonth) : wpStart;
                        const dEnd = d.endMonth ? parseInt(d.endMonth) : wpEnd;

                        if (isNaN(dStart) || isNaN(dEnd)) continue;

                        const colorIndex = (dStart - 1) % colors.length;
                        const dStyle = `grid-column: ${dStart} / ${dEnd + 1}; background: ${colors[colorIndex]};`;

                        html += '<div class="row deliverable-row" style="' + gridStyle + '">';
                        html += '<div class="deliverable-bar" style="' + dStyle + '">';
                        html += d.deliverableSequence || 'D';
                        html += '</div>';
                        html += '</div>';
                    }
                }

                html += '</div>'; // End wp-block
            }

            html += '</div>'; // End content-area
            html += '</div>'; // End gantt-container

            document.getElementById($scope.getGanttChartId()).innerHTML = html;

        } catch (error) {
            console.error('Error rendering Gantt Chart:', error);
            document.getElementById($scope.getGanttChartId()).innerHTML =
                '<div style="text-align: center; padding: 40px; color: red;">Error rendering chart</div>';
        }
    };

    // Trigger Gantt chart update whenever data changes
    $scope.$watch('wpDeliverablesTableList', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            // Debounce to avoid too many calls
            if ($scope.ganttUpdateTimeout) {
                clearTimeout($scope.ganttUpdateTimeout);
            }
            $scope.ganttUpdateTimeout = setTimeout(function () {
                $scope.updateGanttChart();
            }, 500); // Wait 500ms after user stops typing
        }
    }, true);

    // Also watch for changes in max duration
    $scope.$watch('rootScope.maxDurationInMonths', function (newValue, oldValue) {
        if (newValue !== oldValue && $scope.wpDeliverablesTableList?.length > 0) {
            $scope.updateGanttChart();
        }
    });

    // =====================================================================================
    // ==================== END GANTT CHART FUNCTIONALITY ==================
    // =====================================================================================

    /* -------------------------------------------------------------------------------- */
    // OLD WORK PACKAGE SYSTEM - DEPRECATED (Using new WP+Deliverables system)
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
                            "WPSequence": applicantDetails[i].WP_Sequence_2__c,
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

                // Mark WP details loading as complete
                $scope.markLoadingComplete('wpDetails');

                $scope.$applyAsync();
            } else {
                console.error('Error fetching WP details:', event.message);
                // Still mark as complete even on error to avoid spinner hanging
                $scope.markLoadingComplete('wpDetails');
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
                swal("Work Package", "Your Work Package data has been Deleted Successfully", "info");
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
                swal("PI Deliverables", "Your PI Deliverables detail has been deleted successfully.", "info");
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
    /*
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
                swal("Work Package Details", "Please Select Partners.", "info");
                $("#account" + i + "").addClass('border-theme');
                return;
            }

            if (objData[i].trl_level == undefined || objData[i].trl_level == "") {
                swal("Work Package Details", "Please Enter Start TRL Level.", "info");
                $("#STL" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].end_trl_level == undefined || objData[i].end_trl_level == "") {
                swal("Work Package Details", "Please Enter End TRL Level.", "info");
                $("#ETL" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].title == undefined || objData[i].title == "") {
                swal("Work Package Details", "Please Enter Title.", "info");
                $("#title" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].duration == undefined || objData[i].duration == "") {
                swal("Work Package Details", "Please Enter Duration.", "info");
                $("#duration" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].trl_level < 3 || objData[i].trl_level > 9) {
                swal("Work Package Details", "Minimum TRL Level should be 3 and Maximum TRL Level should be 9", "info");
                $("#STL" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].end_trl_level < 3 || objData[i].end_trl_level > 9) {
                swal("Work Package Details", "Minimum TRL Level should be 3 and Maximum TRL Level should be 9", "info");
                $("#ETL" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].end_trl_level < objData[i].trl_level) {
                swal("Work Package Details", "End TRL Level should be greater than Start TRL Level.", "info");
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
    */

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

        $scope.projectDescriptionDoc = null;
        $scope.projectDescriptionPreviewLink = '';

        $scope.projectDescriptionUploadProgress = 0;
        $scope.showProjectDescriptionProgressBar = false;

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

                    var expectedProjectDescriptionDocName = 'Project Description';


                    var expectedProjectDescriptionDocNameFallback = 'Project Description';

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

                        // Pick stage-specific Project Description document
                        if (currentDoc.Name === expectedProjectDescriptionDocName || currentDoc.Name === expectedProjectDescriptionDocNameFallback) {
                            $scope.projectDescriptionDoc = $scope.allDocs[i];
                            if (
                                currentDoc.Attachments &&
                                currentDoc.Attachments.length > 0
                            ) {
                                let fileId = currentDoc.Attachments[0].Id;
                                $scope.projectDescriptionPreviewLink =
                                    `/ApplicantDashboard/servlet/servlet.FileDownload?file=${fileId}`;
                            }
                        }

                        // Sample document (always collect)
                        if (currentDoc.Name === 'Sample Document') {
                            $scope.sampleDoc = currentDoc;
                        }

                        // Audited Financial Statement
                        // if (currentDoc.Name === 'Audited Financial Statement') {
                        //     $scope.auditedFinancialDoc = $scope.allDocs[i];
                        //     if (currentDoc.Attachments && currentDoc.Attachments.length > 0) {
                        //         let fileId = currentDoc.Attachments[0].Id;
                        //         $scope.auditedFinancialPreviewLink = `/ApplicantDashboard/servlet/servlet.FileDownload?file=${fileId}`;
                        //     }
                        // }

                        // // Quotation For Equipment/Accessories
                        // if (currentDoc.Name === 'Quotation For Equipment/Accessories' || currentDoc.Name === 'Quotation For Equipment') {
                        //     $scope.quotationEquipmentDoc = $scope.allDocs[i];
                        //     if (currentDoc.Attachments && currentDoc.Attachments.length > 0) {
                        //         let fileId = currentDoc.Attachments[0].Id;
                        //         $scope.quotationEquipmentPreviewLink = `/ApplicantDashboard/servlet/servlet.FileDownload?file=${fileId}`;
                        //     }
                        // }

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

                    if ($rootScope.secondStage && !$scope.projectDescriptionDoc) {
                        console.warn('No Project Description document found for stage: Stage 2');
                    }

                    $scope.$applyAsync();
                }
            },
            { escape: true }
        );
    };
    $scope.getDocsDet();
    // ------------------------------------------------------------------------------ //

    $scope.loadAPAUserDocs = function () {
        debugger;
        $scope.selectedFile = '';
        $('#file_frame').attr('src', '');
        ApplicantPortal_Contoller.getContactUserDoc($rootScope.contactId, $rootScope.proposalId, function (result, event) {
            debugger
            console.log('result return onload :: ');
            console.log(result);
            if (event.status) {
                $scope.apaUserDocs = result;

                // Reset document variables
                $scope.auditedFinancialDoc = null;
                $scope.auditedFinancialPreviewLink = '';
                $scope.quotationEquipmentDoc = null;
                $scope.quotationEquipmentPreviewLink = '';
                $scope.grantAcceptanceUndertakingDoc = null;
                $scope.grantAcceptanceUndertakingPreviewLink = '';
                $scope.sensitivitySecurityUndertakingDoc = null;
                $scope.sensitivitySecurityUndertakingPreviewLink = '';

                // Decide expected document names based on stage
                var expectedFinancialDocName = $rootScope.secondStage
                    ? 'Financial Statement Report - Stage 2'
                    : 'Financial Statement Report - Stage 1';

                var expectedQuotationDocName = $rootScope.secondStage
                    ? 'Quotation For Equipment - Stage 2'
                    : 'Quotation For Equipment - Stage 1';

                var expectedGrantAcceptanceUndertakingDocName = 'Undertaking Format of Grant Acceptance';
                var expectedSensitivitySecurityUndertakingDocName = 'Undertaking for Sensitivity Security Regulations';

                console.log('Expected Financial Doc Name: ', expectedFinancialDocName);
                console.log('Expected Quotation Doc Name: ', expectedQuotationDocName);
                console.log('Expected Grant Acceptance Undertaking Doc Name: ', expectedGrantAcceptanceUndertakingDocName);
                console.log('Expected Sensitivity Security Undertaking Doc Name: ', expectedSensitivitySecurityUndertakingDocName);

                var uploadCount = 0;
                for (var i = 0; i < $scope.apaUserDocs.length; i++) {
                    var docName = $scope.apaUserDocs[i].userDocument.Name;

                    // Financial Statement Report (APA level) - Stage specific
                    if (docName === expectedFinancialDocName) {
                        $scope.auditedFinancialDoc = $scope.apaUserDocs[i];
                        // Get the latest attachment (Attachments are ordered by CreatedDate DESC in Apex)
                        if ($scope.apaUserDocs[i].userDocument.Attachments && $scope.apaUserDocs[i].userDocument.Attachments.length > 0) {
                            // Attachments[0] is the latest attachment since Apex orders by CreatedDate DESC
                            var fileId = $scope.apaUserDocs[i].userDocument.Attachments[0].Id;
                            $scope.auditedFinancialPreviewLink = '/ApplicantDashboard/servlet/servlet.FileDownload?file=' + fileId;
                        }
                        if ($scope.apaUserDocs[i].userDocument.Status__c == 'Uploaded') {
                            uploadCount = uploadCount + 1;
                        }
                    }
                    // Quotation For Equipment (APA level) - Stage specific
                    else if (docName === expectedQuotationDocName) {
                        $scope.quotationEquipmentDoc = $scope.apaUserDocs[i];
                        // Get the latest attachment (Attachments are ordered by CreatedDate DESC in Apex)
                        if ($scope.apaUserDocs[i].userDocument.Attachments && $scope.apaUserDocs[i].userDocument.Attachments.length > 0) {
                            // Attachments[0] is the latest attachment since Apex orders by CreatedDate DESC
                            var fileId = $scope.apaUserDocs[i].userDocument.Attachments[0].Id;
                            $scope.quotationEquipmentPreviewLink = '/ApplicantDashboard/servlet/servlet.FileDownload?file=' + fileId;
                        }
                        if ($scope.apaUserDocs[i].userDocument.Status__c == 'Uploaded') {
                            uploadCount = uploadCount + 1;
                        }
                    }
                    // Undertaking Format of Grant Acceptance & Signing of Agreement (APA level) - Stage 1 only
                    else if (!$rootScope.secondStage && docName === expectedGrantAcceptanceUndertakingDocName) {
                        $scope.grantAcceptanceUndertakingDoc = $scope.apaUserDocs[i];
                        if (
                            $scope.apaUserDocs[i].userDocument.Attachments &&
                            $scope.apaUserDocs[i].userDocument.Attachments.length > 0
                        ) {
                            var fileId = $scope.apaUserDocs[i].userDocument.Attachments[0].Id;
                            $scope.grantAcceptanceUndertakingPreviewLink = '/ApplicantDashboard/servlet/servlet.FileDownload?file=' + fileId;
                        }
                        if ($scope.apaUserDocs[i].userDocument.Status__c == 'Uploaded') {
                            uploadCount = uploadCount + 1;
                        }
                    }
                    // Undertaking for Sensitivity Security Regulations (APA level) - Stage 1 only
                    else if (!$rootScope.secondStage && docName === expectedSensitivitySecurityUndertakingDocName) {
                        $scope.sensitivitySecurityUndertakingDoc = $scope.apaUserDocs[i];
                        if (
                            $scope.apaUserDocs[i].userDocument.Attachments &&
                            $scope.apaUserDocs[i].userDocument.Attachments.length > 0
                        ) {
                            var fileId = $scope.apaUserDocs[i].userDocument.Attachments[0].Id;
                            $scope.sensitivitySecurityUndertakingPreviewLink = '/ApplicantDashboard/servlet/servlet.FileDownload?file=' + fileId;
                        }
                        if ($scope.apaUserDocs[i].userDocument.Status__c == 'Uploaded') {
                            uploadCount = uploadCount + 1;
                        }
                    }
                }
                $scope.$apply();
            }
        }, {
            escape: true
        })
    }
    $scope.loadAPAUserDocs();
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
    $scope.uploadFile = function (type, userDocId, fileId, inputElementId) {
        debugger;

        var inputId = inputElementId || 'fileSignature';
        var isProjectDescriptionUpload = inputId === 'projectDescriptionFile';

        if (!type || !userDocId) {
            // Guard: ensure doc.userDocument with Name and Id exist (prevents errors when doc is null/undefined)
            if (!$scope.doc || !$scope.doc.userDocument || !$scope.doc.userDocument.Name || !$scope.doc.userDocument.Id) {
                swal("Info", "Document information is not available. Please refresh the page and try again.", "info");
                $scope.isUploading = false;
                $scope.showProjectProposalProgressBar = false;
                $scope.showSpinnereditProf = false;
                return;
            }
            type = $scope.doc.userDocument.Name;
            userDocId = $scope.doc.userDocument.Id;
        }

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
        $scope.isUploadingProjectProposal = true;
        if (isProjectDescriptionUpload) {
            $scope.projectDescriptionUploadProgress = 0;
            $scope.showProjectDescriptionProgressBar = true;
        } else {
            $scope.projectProposalUploadProgress = 0;
            $scope.showProjectProposalProgressBar = true;
        }

        $scope.showSpinnereditProf = true;
        var file;
        maxFileSize = 5191680;
        var inputEl = document.getElementById(inputId);
        file = inputEl ? inputEl.files[0] : null;
        if (!file) {
            swal("Info", "You must choose a file before trying to upload it", "info");
            $scope.isUploadingProjectProposal = false;
            $scope.showSpinnereditProf = false;
            $scope.resetUploadState();
            return;
        }
        fileName = file.name;
        var typeOfFile = fileName.split(".");
        lengthOfType = typeOfFile.length;
        if (typeOfFile[lengthOfType - 1] == "pdf" || typeOfFile[lengthOfType - 1] == "PDF") {

        } else {
            $scope.isUploadingProjectProposal = false;
            $scope.showSpinnereditProf = false;
            swal('Info', 'Please choose pdf only.', 'info');
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
                            text: "Please ensure this is the correct file.",
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
                        $scope.isUploadingProjectProposal = false;
                        $scope.showSpinnereditProf = false;
                        // swal("info", "Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".", "info");
                        swal("info", "File size should be lesser than 4 MB.", "info"); return;
                        // alert("Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".");
                    }

                }
                fileReader.onerror = function (e) {
                    $scope.isUploadingProjectProposal = false;
                    $scope.showSpinnereditProf = false;
                    swal("Info", "There was an error reading the file.  Please try again.", "info");
                    return;
                    // alert("There was an error reading the file.  Please try again.");
                }
                fileReader.onabort = function (e) {
                    $scope.isUploadingProjectProposal = false;
                    $scope.showSpinnereditProf = false;
                    swal("Info", "There was an error reading the file.  Please try again.", "info");
                    return;
                    // alert("There was an error reading the file.  Please try again.");
                }

                fileReader.readAsBinaryString(file);  //Read the body of the file

            } else {
                $scope.isUploadingProjectProposal = false;
                $scope.showSpinnereditProf = false;
                swal("Info", "File must be under 5 Mb in size.  Your file is too large.  Please try again.", "info");
                return;
            }
        } else {
            $scope.isUploadingProjectProposal = false;
            $scope.showSpinnereditProf = false;
            swal("Info", "You must choose a file before trying to upload it", "info");
            return;
            // alert("You must choose a file before trying to upload it");
            // $scope.showSpinnereditProf = false;
        }
    }

    $scope.resetUploadState = function () {
        if (!$scope.$$phase) { // Check if Angular digest cycle is not already in progress
            $scope.$applyAsync(function () {
                $scope.isUploadingProjectProposal = false;
                $scope.showSpinnereditProf = false;
                $scope.showProgressBar = false;
                $scope.uploadProgress = 0;
                $scope.showProjectProposalProgressBar = false;
                $scope.projectProposalUploadProgress = 0;
                $scope.showProjectDescriptionProgressBar = false;
                $scope.projectDescriptionUploadProgress = 0;
                var sig = document.getElementById('fileSignature');
                if (sig) sig.value = "";
                var projDesc = document.getElementById('projectDescriptionFile');
                if (projDesc) projDesc.value = "";
            });
        } else {
            $scope.isUploadingProjectProposal = false;
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
            var pct = Math.round((positionIndex / fileSize) * 100);
            $scope.uploadProgress = pct;
            if ($scope.showProjectDescriptionProgressBar) {
                $scope.projectDescriptionUploadProgress = pct;
            } else {
                $scope.projectProposalUploadProgress = pct;
            }
        });

        //if (fileSize <= positionIndex + chunkSize) {
        if (true) {
            debugger;
            attachmentBody = attachment.substring(positionIndex);
            doneUploading = true;
            $scope.isUploadingProjectProposal = false;
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
                    $scope.isUploadingProjectProposal = false;
                    $scope.showSpinnereditProf = false;
                } else if (event.status) {
                    if (doneUploading == true) {
                        $scope.isUploadingProjectProposal = false;
                        $scope.showSpinnereditProf = false;
                        $scope.$applyAsync(function () {
                            $scope.uploadProgress = 100;
                            if ($scope.showProjectDescriptionProgressBar) {
                                $scope.projectDescriptionUploadProgress = 100;
                            } else {
                                $scope.projectProposalUploadProgress = 100;
                            }
                        });
                        swal(
                            'Success',
                            'Uploaded Successfully!',
                            'success'
                        )

                        setTimeout(function () {
                            $scope.isUploading = false; // Allow button to be clickable again
                            $scope.showProgressBar = false;
                            $scope.showProjectProposalProgressBar = false;
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

    // ----------------------------- AUDITED FINANCIAL STATEMENT UPLOAD - OLD FUNCTIONALITY ----------------------------- //

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
            swal("Info", "You must choose a file before trying to upload it", "info");
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
            swal('Info', 'Please choose PDF file only.', 'info');
            return;
        }

        if (file.size > maxFileSize) {
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            swal("Info", "File must be under 5 MB in size.", "info");
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
            swal("Info", "Error reading file. Please try again.", "info");
        };

        fileReader.readAsBinaryString(file);
    }

    // ----------------------------- GRANT ACCEPTANCE UNDERTAKING UPLOAD (STAGE 1 ONLY) ----------------------------- //
    $scope.uploadGrantAcceptanceUndertaking = function () {
        debugger;

        if ($rootScope.secondStage || $rootScope.mailingCountry !== 'India') {
            return;
        }

        $scope.uploadProgress = 0;
        $scope.showProgressBar = true;
        $scope.isUploadingGrantAcceptanceUndertaking = true;
        $scope.showSpinnereditProf = true;

        var file;
        var maxFileSize = 5191680;
        var inputId = 'grantAcceptanceUndertakingFileStage1';
        file = document.getElementById(inputId).files[0];

        if (!file) {
            swal("Info", "You must choose a file before trying to upload it", "info");
            $scope.isUploadingGrantAcceptanceUndertaking = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            return;
        }

        var fileName = file.name;
        var typeOfFile = fileName.split(".");
        var lengthOfType = typeOfFile.length;

        if (typeOfFile[lengthOfType - 1].toLowerCase() !== "pdf") {
            $scope.isUploadingGrantAcceptanceUndertaking = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            swal('Info', 'Please choose PDF file only.', 'info');
            return;
        }

        if (file.size > maxFileSize) {
            $scope.isUploadingGrantAcceptanceUndertaking = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            swal("Info", "File must be under 5 MB in size.", "info");
            return;
        }

        var fileReader = new FileReader();
        fileReader.onloadend = function (e) {
            var attachmentData = window.btoa(this.result);

            // swal({
            //     title: "Confirm Upload",
            //     text: "Are you sure you want to upload the Undertaking Format of Grant Acceptance & Signing of Agreement?",
            //     icon: "warning",
            //     buttons: {
            //         cancel: "Cancel",
            //         confirm: { text: "Upload", value: true }
            //     }
            // }).then((willUpload) => {
            swal({
                title: "Confirm Upload",
                content: {
                    element: "div",
                    attributes: {
                        innerHTML: `
                            <p style="margin-top:10px; margin-bottom:20px; line-height:1.6;">
                                Are you sure you want to upload the Undertaking of Grant Acceptance & Signing of Agreement?
                            </p>
                        `
                    }
                },
                icon: "warning",
                buttons: {
                    cancel: "Cancel",
                    confirm: { text: "Upload", value: true }
                }
            }).then((willUpload) => {
                if (willUpload) {
                    var userDocId = $scope.grantAcceptanceUndertakingDoc ? $scope.grantAcceptanceUndertakingDoc.userDocument.Id : '';

                    if (!userDocId) {
                        swal('Error', 'User Document not found. Please refresh the page and try again.', 'error');
                        $scope.isUploadingGrantAcceptanceUndertaking = false;
                        $scope.showSpinnereditProf = false;
                        $scope.showProgressBar = false;
                        document.getElementById(inputId).value = "";
                        $scope.$applyAsync();
                        return;
                    }

                    ApplicantPortal_Contoller.doCUploadAttachmentAa(
                        attachmentData, fileName, null, userDocId,
                        function (result, event) {
                            if (event.status) {
                                swal('Success', 'Grant Acceptance uploaded successfully!', 'success');
                                $scope.loadAPAUserDocs();
                            } else {
                                swal('Error', 'Error uploading file. Please try again.', 'error');
                            }
                            $scope.isUploadingGrantAcceptanceUndertaking = false;
                            $scope.showSpinnereditProf = false;
                            $scope.showProgressBar = false;
                            document.getElementById(inputId).value = "";
                            $scope.$applyAsync();
                        },
                        { buffer: true, escape: true, timeout: 120000 }
                    );
                } else {
                    $scope.isUploadingGrantAcceptanceUndertaking = false;
                    $scope.showSpinnereditProf = false;
                    $scope.showProgressBar = false;
                    document.getElementById(inputId).value = "";
                    $scope.$applyAsync();
                }
            });
        };

        fileReader.onerror = function (e) {
            $scope.isUploadingGrantAcceptanceUndertaking = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            swal("Error", "Error reading file. Please try again.", "error");
        };

        fileReader.readAsBinaryString(file);
    }

    // ----------------------------- SENSITIVITY / SECURITY UNDERTAKING UPLOAD (STAGE 1 ONLY) ----------------------------- //
    $scope.uploadSensitivitySecurityUndertaking = function () {
        debugger;

        if ($rootScope.secondStage) {
            return;
        }

        $scope.uploadProgress = 0;
        $scope.showProgressBar = true;
        $scope.isUploadingSensitivitySecurityUndertaking = true;
        $scope.showSpinnereditProf = true;

        var file;
        var maxFileSize = 5191680;
        var inputId = 'sensitivitySecurityUndertakingFileStage1';
        file = document.getElementById(inputId).files[0];

        if (!file) {
            swal("Info", "You must choose a file before trying to upload it", "info");
            $scope.isUploadingSensitivitySecurityUndertaking = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            return;
        }

        var fileName = file.name;
        var typeOfFile = fileName.split(".");
        var lengthOfType = typeOfFile.length;

        if (typeOfFile[lengthOfType - 1].toLowerCase() !== "pdf") {
            $scope.isUploadingSensitivitySecurityUndertaking = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            swal('Info', 'Please choose PDF file only.', 'info');
            return;
        }

        if (file.size > maxFileSize) {
            $scope.isUploadingSensitivitySecurityUndertaking = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            swal("Info", "File must be under 5 MB in size.", "info");
            return;
        }

        var fileReader = new FileReader();
        fileReader.onloadend = function (e) {
            var attachmentData = window.btoa(this.result);

            // swal({
            //     title: "Confirm Upload",
            //     text: "Are you sure you want to upload the Undertaking for Sensitivity Security Regulations?",
            //     icon: "warning",
            //     buttons: {
            //         cancel: "Cancel",
            //         confirm: { text: "Upload", value: true }
            //     }
            // }).then((willUpload) => {
            swal({
                title: "Confirm Upload",
                content: {
                    element: "div",
                    attributes: {
                        innerHTML: `
                                <p style="margin-top:10px; margin-bottom:20px; line-height:1.6;">
                                    Are you sure you want to upload the Undertaking for Sensitivity Security Regulations?
                                </p>
                            `
                    }
                },
                icon: "warning",
                buttons: {
                    cancel: "Cancel",
                    confirm: { text: "Upload", value: true }
                }
            }).then((willUpload) => {
                if (willUpload) {
                    var userDocId = $scope.sensitivitySecurityUndertakingDoc ? $scope.sensitivitySecurityUndertakingDoc.userDocument.Id : '';

                    if (!userDocId) {
                        swal('Error', 'User Document not found. Please refresh the page and try again.', 'error');
                        $scope.isUploadingSensitivitySecurityUndertaking = false;
                        $scope.showSpinnereditProf = false;
                        $scope.showProgressBar = false;
                        document.getElementById(inputId).value = "";
                        $scope.$applyAsync();
                        return;
                    }

                    ApplicantPortal_Contoller.doCUploadAttachmentAa(
                        attachmentData, fileName, null, userDocId,
                        function (result, event) {
                            if (event.status) {
                                swal('Success', 'Sensitivity Security undertaking uploaded successfully!', 'success');
                                $scope.loadAPAUserDocs();
                            } else {
                                swal('Error', 'Error uploading file. Please try again.', 'error');
                            }
                            $scope.isUploadingSensitivitySecurityUndertaking = false;
                            $scope.showSpinnereditProf = false;
                            $scope.showProgressBar = false;
                            document.getElementById(inputId).value = "";
                            $scope.$applyAsync();
                        },
                        { buffer: true, escape: true, timeout: 120000 }
                    );
                } else {
                    $scope.isUploadingSensitivitySecurityUndertaking = false;
                    $scope.showSpinnereditProf = false;
                    $scope.showProgressBar = false;
                    document.getElementById(inputId).value = "";
                    $scope.$applyAsync();
                }
            });
        };

        fileReader.onerror = function (e) {
            $scope.isUploadingSensitivitySecurityUndertaking = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            swal("Error", "Error reading file. Please try again.", "error");
        };

        fileReader.readAsBinaryString(file);
    }


    $scope.uploadAuditedFinancial = function () {
        debugger;

        $scope.financialStatementUploadProgress = 0;
        $scope.showFinancialStatementProgressBar = true;
        $scope.isUploadingFinancialStatement = true;
        $scope.showSpinnereditProf = true;

        var file;
        var maxFileSize = 5191680;
        // Determine which input to use based on stage
        var inputId = $rootScope.secondStage ? 'auditedFinancialFileStage2' : 'auditedFinancialFileStage1';
        file = document.getElementById(inputId).files[0];

        if (!file) {
            swal("Info", "You must choose a file before trying to upload it", "info");
            $scope.isUploadingFinancialStatement = false;
            $scope.showSpinnereditProf = false;
            $scope.showFinancialStatementProgressBar = false;
            return;
        }

        var fileName = file.name;
        var typeOfFile = fileName.split(".");
        var lengthOfType = typeOfFile.length;

        if (typeOfFile[lengthOfType - 1].toLowerCase() !== "pdf") {
            $scope.isUploadingFinancialStatement = false;
            $scope.showSpinnereditProf = false;
            $scope.showFinancialStatementProgressBar = false;
            swal('Info', 'Please choose PDF file only.', 'info');
            return;
        }

        if (file.size > maxFileSize) {
            $scope.isUploadingFinancialStatement = false;
            $scope.showSpinnereditProf = false;
            $scope.showFinancialStatementProgressBar = false;
            swal("Info", "File must be under 5 MB in size.", "info");
            return;
        }

        var fileReader = new FileReader();
        fileReader.onloadend = function (e) {
            var attachmentData = window.btoa(this.result);

            // swal({
            //     title: "Confirm Upload",
            //     text: "Are you sure you want to upload the Financial Statement Report?",
            //     icon: "warning",
            //     buttons: {
            //         cancel: "Cancel",
            //         confirm: { text: "Upload", value: true }
            //     }
            // }).then((willUpload) => {
            swal({
                title: "Confirm Upload",
                content: {
                    element: "div",
                    attributes: {
                        innerHTML: `
                            <p style="margin-top:10px; margin-bottom:20px; line-height:1.6;">
                                Are you sure you want to upload the Financial Statement Report?
                            </p>
                        `
                    }
                },
                icon: "warning",
                buttons: {
                    cancel: "Cancel",
                    confirm: { text: "Upload", value: true }
                }
            }).then((willUpload) => {
                if (willUpload) {
                    var userDocId = $scope.auditedFinancialDoc ? $scope.auditedFinancialDoc.userDocument.Id : '';

                    // Validate userDocId exists
                    if (!userDocId) {
                        swal('Error', 'User Document not found. Please refresh the page and try again.', 'error');
                        $scope.isUploadingFinancialStatement = false;
                        $scope.showSpinnereditProf = false;
                        $scope.showFinancialStatementProgressBar = false;
                        document.getElementById(inputId).value = "";
                        $scope.$applyAsync();
                        return;
                    }

                    // Always create a new attachment (fileId = null) to keep old attachments
                    // The latest attachment will be fetched when loadAPAUserDocs() is called
                    ApplicantPortal_Contoller.doCUploadAttachmentAa(
                        attachmentData, fileName, null, userDocId,
                        function (result, event) {
                            if (event.status) {
                                $scope.financialStatementUploadProgress = 100;
                                swal('Success', 'Financial Statement Report uploaded successfully!', 'success');
                                // Reload APA User Documents to refresh the UI and get the latest attachment
                                $scope.loadAPAUserDocs();
                            } else {
                                swal('Error', 'Error uploading file. Please try again.', 'error');
                            }
                            $scope.isUploadingFinancialStatement = false;
                            $scope.showSpinnereditProf = false;
                            $scope.showFinancialStatementProgressBar = false;
                            document.getElementById(inputId).value = "";
                            $scope.$applyAsync();
                        },
                        { buffer: true, escape: true, timeout: 120000 }
                    );
                } else {
                    $scope.isUploadingFinancialStatement = false;
                    $scope.showSpinnereditProf = false;
                    $scope.showFinancialStatementProgressBar = false;
                    document.getElementById(inputId).value = "";
                    $scope.$applyAsync();
                }
            });
        };

        fileReader.onerror = function (e) {
            $scope.isUploadingFinancialStatement = false;
            $scope.showSpinnereditProf = false;
            $scope.showFinancialStatementProgressBar = false;
            swal("Error", "Error reading file. Please try again.", "error");
        };

        fileReader.readAsBinaryString(file);
    }

    // ----------------------------- QUOTATION FOR EQUIPMENT/ACCESSORIES UPLOAD - OLD FUNCTIONALITY ----------------------------- //
    /*
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
    */

    $scope.uploadQuotationEquipment = function () {
        debugger;

        $scope.quotationEquipmentUploadProgress = 0;
        $scope.showQuotationEquipmentProgressBar = true;
        $scope.isUploadingQuotation = true;
        $scope.showSpinnereditProf = true;

        var file;
        var maxFileSize = 5191680;
        // Determine which input to use based on stage
        var inputId = $rootScope.secondStage ? 'quotationEquipmentFileStage2' : 'quotationEquipmentFileStage1';
        file = document.getElementById(inputId).files[0];

        if (!file) {
            swal("Info", "You must choose a file before trying to upload it", "info");
            $scope.isUploadingQuotation = false;
            $scope.showSpinnereditProf = false;
            $scope.showQuotationEquipmentProgressBar = false;
            return;
        }

        var fileName = file.name;
        var typeOfFile = fileName.split(".");
        var lengthOfType = typeOfFile.length;

        if (typeOfFile[lengthOfType - 1].toLowerCase() !== "pdf") {
            $scope.isUploadingQuotation = false;
            $scope.showSpinnereditProf = false;
            $scope.showQuotationEquipmentProgressBar = false;
            swal('Info', 'Please choose PDF file only.', 'info');
            return;
        }

        if (file.size > maxFileSize) {
            $scope.isUploadingQuotation = false;
            $scope.showSpinnereditProf = false;
            $scope.showQuotationEquipmentProgressBar = false;
            swal("Info", "File must be under 5 MB in size.", "info");
            return;
        }

        var fileReader = new FileReader();
        fileReader.onloadend = function (e) {
            var attachmentData = window.btoa(this.result);

            // swal({
            //     title: "Confirm Upload",
            //     text: "Are you sure you want to upload the Quotation For Equipment/Accessories?",
            //     icon: "warning",
            //     buttons: {
            //         cancel: "Cancel",
            //         confirm: { text: "Upload", value: true }
            //     }
            // }).then((willUpload) => {
            swal({
                title: "Confirm Upload",
                content: {
                    element: "div",
                    attributes: {
                        innerHTML: `
                                <p style="margin-top:10px; margin-bottom:20px; line-height:1.6;">
                                    Are you sure you want to upload the Quotation For Equipment/Accessories?
                                </p>
                            `
                    }
                },
                icon: "warning",
                buttons: {
                    cancel: "Cancel",
                    confirm: { text: "Upload", value: true }
                }
            }).then((willUpload) => {
                if (willUpload) {
                    var userDocId = $scope.quotationEquipmentDoc ? $scope.quotationEquipmentDoc.userDocument.Id : '';

                    // Validate userDocId exists
                    if (!userDocId) {
                        swal('Error', 'User Document not found. Please refresh the page and try again.', 'error');
                        $scope.isUploadingQuotation = false;
                        $scope.showSpinnereditProf = false;
                        $scope.showQuotationEquipmentProgressBar = false;
                        document.getElementById(inputId).value = "";
                        $scope.$applyAsync();
                        return;
                    }

                    // Always create a new attachment (fileId = null) to keep old attachments
                    // The latest attachment will be fetched when loadAPAUserDocs() is called
                    ApplicantPortal_Contoller.doCUploadAttachmentAa(
                        attachmentData, fileName, null, userDocId,
                        function (result, event) {
                            if (event.status) {
                                $scope.quotationEquipmentUploadProgress = 100;
                                swal('Success', 'Quotation For Equipment/Accessories uploaded successfully!', 'success');
                                // Reload APA User Documents to refresh the UI and get the latest attachment
                                $scope.loadAPAUserDocs();
                            } else {
                                swal('Error', 'Error uploading file. Please try again.', 'error');
                            }
                            $scope.isUploadingQuotation = false;
                            $scope.showSpinnereditProf = false;
                            $scope.showQuotationEquipmentProgressBar = false;
                            document.getElementById(inputId).value = "";
                            $scope.$applyAsync();
                        },
                        { buffer: true, escape: true, timeout: 120000 }
                    );
                } else {
                    $scope.isUploadingQuotation = false;
                    $scope.showSpinnereditProf = false;
                    $scope.showQuotationEquipmentProgressBar = false;
                    document.getElementById(inputId).value = "";
                    $scope.$applyAsync();
                }
            });
        };

        fileReader.onerror = function (e) {
            $scope.isUploadingQuotation = false;
            $scope.showSpinnereditProf = false;
            $scope.showQuotationEquipmentProgressBar = false;
            swal("info", "Error reading file. Please try again.", "info");
        };

        fileReader.readAsBinaryString(file);
    }

    // ----------------------------- LETTER OF CONSENT UPLOAD ----------------------------- //
    $scope.uploadLetterOfConsent = function () {
        debugger;

        $scope.uploadProgress = 0;
        $scope.showProgressBar = true;
        $scope.isUploadingLetterOfConsent = true;
        $scope.showSpinnereditProf = true;

        var file;
        var maxFileSize = 5191680;
        file = document.getElementById('letterOfConsentFile').files[0];

        if (!file) {
            swal("Info", "You must choose a file before trying to upload it", "info");
            $scope.isUploadingLetterOfConsent = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            return;
        }

        var fileName = file.name;
        var typeOfFile = fileName.split(".");
        var lengthOfType = typeOfFile.length;

        if (typeOfFile[lengthOfType - 1].toLowerCase() !== "pdf") {
            $scope.isUploadingLetterOfConsent = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            swal('Info', 'Please choose PDF file only.', 'info');
            return;
        }

        if (file.size > maxFileSize) {
            $scope.isUploadingLetterOfConsent = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            swal("Info", "File must be under 5 MB in size.", "info");
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
                                swal('Success', 'Letter of Consent uploaded successfully!', 'success');
                                $scope.getDocsDet();
                                $scope.loadAPAUserDocs();
                            } else {
                                swal('Error', 'Error uploading file. Please try again.', 'error');
                            }
                            $scope.isUploadingLetterOfConsent = false;
                            $scope.showSpinnereditProf = false;
                            $scope.showProgressBar = false;
                            document.getElementById('letterOfConsentFile').value = "";
                            $scope.$applyAsync();
                        },
                        { buffer: true, escape: true, timeout: 120000 }
                    );
                } else {
                    $scope.isUploadingLetterOfConsent = false;
                    $scope.showSpinnereditProf = false;
                    $scope.showProgressBar = false;
                    document.getElementById('letterOfConsentFile').value = "";
                    $scope.$applyAsync();
                }
            });
        };

        fileReader.onerror = function (e) {
            $scope.isUploadingLetterOfConsent = false;
            $scope.showSpinnereditProf = false;
            $scope.showProgressBar = false;
            swal("Info", "Error reading file. Please try again.", "info");
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
    // readCharacter() is defined later with signature (event, index, maxLimit)

    // $scope.saveDetails = function () {
    //     debugger;

    //     // if ($scope.proposalFieldsDetails) {
    //     //     var popupChoice = localStorage.getItem('userPopupChoice');
    //     //     console.log('popupChoice =================>  ', popupChoice);

    //     //     if (popupChoice) {
    //     //         $scope.proposalFieldsDetails.User_Popup_Choice__c = popupChoice;
    //     //     }
    //     // }

    //     if ($scope.doc.userDocument.Status__c !== 'Uploaded') {
    //         // console.log('File already uploaded !!');
    //         swal({
    //             title: "Info",
    //             // text: "A file must be uploaded before saving.",
    //             text: "Please upload Project Proposal before saving.",
    //             icon: "info",
    //             button: "OK",
    //         });
    //         return;
    //     }

    //     if (
    //         $rootScope.mailingCountry === 'India'
    //         && !$rootScope.secondStage
    //         && !(
    //             $scope.grantAcceptanceUndertakingDoc
    //             && $scope.grantAcceptanceUndertakingDoc.userDocument
    //             && $scope.grantAcceptanceUndertakingDoc.userDocument.Status__c === 'Uploaded'
    //         )
    //     ) {
    //         swal({
    //             title: "Info",
    //             text: "Please upload Undertaking Format of Grant Acceptance before saving.",
    //             icon: "info",
    //             button: "OK",
    //         });
    //         return;
    //     }

    //     if (
    //         !$rootScope.secondStage
    //         && !(
    //             $scope.sensitivitySecurityUndertakingDoc
    //             && $scope.sensitivitySecurityUndertakingDoc.userDocument
    //             && $scope.sensitivitySecurityUndertakingDoc.userDocument.Status__c === 'Uploaded'
    //         )
    //     ) {
    //         swal({
    //             title: "Info",
    //             text: "Please upload Undertaking for Sensitivity Security Regulations before saving.",
    //             icon: "info",
    //             button: "OK",
    //         });
    //         return;
    //     }


    //     // ---------------------- FIELD REQUIRED VALIDATION ---------------------------- //

    //     // **************************************** Stage 1 required fields ****************************************
    //     if ($scope.proposalFieldsDetails.Research_Approach_Objectives__c == undefined || $scope.proposalFieldsDetails.Research_Approach_Objectives__c == "") {
    //         swal(
    //             'Info',
    //             'Please fill Main objectives of the research approach (max. chars 3000).',
    //             'info'
    //         );
    //         return;
    //     }
    //     if ($scope.proposalFieldsDetails.Current_State_Of_The_Art__c == undefined || $scope.proposalFieldsDetails.Current_State_Of_The_Art__c == "") {
    //         swal(
    //             'Info',
    //             'Please fill Current state of the art in the field (max. chars 3000).',
    //             'info'
    //         );
    //         return;
    //     }
    //     if ($scope.proposalFieldsDetails.Project_Description__c == undefined || $scope.proposalFieldsDetails.Project_Description__c == "") {
    //         swal(
    //             'Info',
    //             'Please fill Project description including work packages/work distribution amongst partners. Comment on starting TRL and expected TRL at end of the project (max. chars 12000).',
    //             'info'
    //         );
    //         return;
    //     }
    //     if ($scope.proposalFieldsDetails.Expected_Deliverables__c == undefined || $scope.proposalFieldsDetails.Expected_Deliverables__c == "") {
    //         swal(
    //             'Info',
    //             'Please fill Expected deliverables as bullet points (max. chars 3000).',
    //             'info'
    //         );
    //         return;
    //     }
    //     if ($scope.proposalFieldsDetails.Reasons_For_And_Benefits_Of_Cooperation__c == undefined || $scope.proposalFieldsDetails.Reasons_For_And_Benefits_Of_Cooperation__c == "") {
    //         swal(
    //             'Info',
    //             'Please fill Reasons for and benefits of cooperation - including previous collaboration with the partner country (max. chars 6000).',
    //             'info'
    //         );
    //         return;
    //     }
    //     if ($scope.proposalFieldsDetails.Equipment__c == undefined || $scope.proposalFieldsDetails.Equipment__c == "") {
    //         swal(
    //             'Info',
    //             'Please fill Equipment (if equipment to be purchased, please justify briefly the need) (max. chars 3000).',
    //             'info'
    //         );
    //         return;
    //     }
    //     if ($scope.proposalFieldsDetails.Brief_Statement_of_Purpose__c == undefined || $scope.proposalFieldsDetails.Brief_Statement_of_Purpose__c == "") {
    //         swal(
    //             'Info',
    //             'Please fill Brief profile of each partner institution with emphasis on research activities (max. chars 3000).',
    //             'info'
    //         );
    //         return;
    //     }

    //     // **************************************** Stage 2 required fields ****************************************
    //     if (($scope.proposalFieldsDetails.Main_Objective_Research_Approach_S2__c == undefined || $scope.proposalFieldsDetails.Main_Objective_Research_Approach_S2__c == "") && $rootScope.secondStage == true) {
    //         swal(
    //             'Info',
    //             'Please fill Main objectives of the research approach (max. chars 4000).',
    //             'info'
    //         );
    //         return;
    //     }

    //     if (($scope.proposalFieldsDetails.Current_State_Of_The_Art_Stage_2__c == undefined || $scope.proposalFieldsDetails.Current_State_Of_The_Art_Stage_2__c == "") && $rootScope.secondStage == true) {
    //         swal(
    //             'Info',
    //             'Please fill Current state of the art in the field (max. chars 6000).',
    //             'info'
    //         );
    //         return;
    //     }

    //     if (($scope.proposalFieldsDetails.Project_Description_Stage_2__c == undefined || $scope.proposalFieldsDetails.Project_Description_Stage_2__c == "") && $rootScope.secondStage == true) {
    //         swal(
    //             'Info',
    //             'Please fill Detailed project description (max. chars 20000).',
    //             'info'
    //         );
    //         return;
    //     }
    //     if (($scope.proposalFieldsDetails.Risk_Assessment_And_Migration_Strategy__c == undefined || $scope.proposalFieldsDetails.Risk_Assessment_And_Migration_Strategy__c == "") && $rootScope.secondStage == true) {
    //         swal(
    //             'Info',
    //             'Please fill Risk assessment & mitigation strategy and Criteria for abandoning the project (max. chars 3000).',
    //             'info'
    //         );
    //         return;
    //     }

    //     if (($scope.proposalFieldsDetails.Reasons_For_And_Benefits_Of_Corp_Stage2__c == undefined || $scope.proposalFieldsDetails.Reasons_For_And_Benefits_Of_Corp_Stage2__c == "") && $rootScope.secondStage == true) {
    //         swal(
    //             'Info',
    //             'Please fill Reasons for and benefits of cooperation for each partner (max. chars 3000).',
    //             'info'
    //         );
    //         return;
    //     }

    //     if (($scope.proposalFieldsDetails.Innovative_Aspects__c == undefined || $scope.proposalFieldsDetails.Innovative_Aspects__c == "") && $rootScope.secondStage == true) {
    //         swal(
    //             'Info',
    //             'Please fill Innovative aspects / IP and future potential utilization plan (max. chars 10000).',
    //             'info'
    //         );
    //         return;
    //     }

    //     if (($scope.proposalFieldsDetails.Market_Assessment_Of_Proposed_Tech__c == undefined || $scope.proposalFieldsDetails.Market_Assessment_Of_Proposed_Tech__c == "") && $rootScope.secondStage == true) {
    //         swal(
    //             'Info',
    //             'Please fill Market assessment of proposed technology/product (max. chars 12000).',
    //             'info'
    //         );
    //         return;
    //     }

    //     if (($scope.proposalFieldsDetails.Future_Commercialization_Plan__c == undefined || $scope.proposalFieldsDetails.Future_Commercialization_Plan__c == "") && $rootScope.secondStage == true) {
    //         swal(
    //             'Info',
    //             'Please fill Future commercialization plan and expected timeline (max. chars 12000).',
    //             'info'
    //         );
    //         return;
    //     }

    //     if (($scope.proposalFieldsDetails.Data_Management_And_Sharing_Protocols__c == undefined || $scope.proposalFieldsDetails.Data_Management_And_Sharing_Protocols__c == "") && $rootScope.secondStage == true) {
    //         swal(
    //             'Info',
    //             'Please fill Data Management and Sharing Protocols (max. chars 5000).',
    //             'info'
    //         );
    //         return;
    //     }

    //     if (($scope.proposalFieldsDetails.Involvement_Of_Young_Scientists__c == undefined || $scope.proposalFieldsDetails.Involvement_Of_Young_Scientists__c == "") && $rootScope.secondStage == true) {
    //         swal(
    //             'Info',
    //             'Please fill Involvement of young scientists / research scholars (max. chars 3000).',
    //             'info'
    //         );
    //         return;
    //     }

    //     if (($scope.proposalFieldsDetails.Necessity_Of_Funding__c == undefined || $scope.proposalFieldsDetails.Necessity_Of_Funding__c == "") && $rootScope.secondStage == true) {
    //         swal(
    //             'Info',
    //             'Please fill Necessity of funding (max. chars 3000).',
    //             'info'
    //         );
    //         return;
    //     }

    //     if (($scope.proposalFieldsDetails.Tentative_plans_for_networking__c == undefined || $scope.proposalFieldsDetails.Tentative_plans_for_networking__c == "") && $rootScope.secondStage == true) {
    //         swal(
    //             'Info',
    //             'Please fill Tentative Plans For Network Meetings and Exchange Visits (including duration) (max. chars 3000).',
    //             'info'
    //         );
    //         return;
    //     }

    //     if (($scope.proposalFieldsDetails.Plan_For_Utilisation_and_Preservation__c == undefined || $scope.proposalFieldsDetails.Plan_For_Utilisation_and_Preservation__c == "") && $rootScope.secondStage == true) {
    //         swal(
    //             'Info',
    //             'Please fill Plan for the utilisation and preservation of project-acquired equipment after the completion of the project. (max. chars 3000).',
    //             'info'
    //         );
    //         return;
    //     }

    //     if (($scope.proposalFieldsDetails.Profile_Of_The_Academic_Institutions__c == undefined || $scope.proposalFieldsDetails.Profile_Of_The_Academic_Institutions__c == "") && $rootScope.secondStage == true) {
    //         swal(
    //             'Info',
    //             'Please fill Profile of the academic institutions (max. chars 3000).',
    //             'info'
    //         );
    //         return;
    //     }


    //     // ---------------------- CHARACTER LIMIT VALIDATION ---------------------------- //

    //     // Recalculate character counts at save-time to ensure validation always runs
    //     if ($rootScope.stage === '1st Stage') {
    //         $scope.readCharacter($scope.proposalFieldsDetails.Research_Approach_Objectives__c, 0, 3000);
    //         $scope.readCharacter($scope.proposalFieldsDetails.Current_State_Of_The_Art__c, 1, 3000);
    //         $scope.readCharacter($scope.proposalFieldsDetails.Project_Description__c, 2, 12000);
    //         $scope.readCharacter($scope.proposalFieldsDetails.Expected_Deliverables__c, 3, 3000);
    //         $scope.readCharacter($scope.proposalFieldsDetails.Reasons_For_And_Benefits_Of_Cooperation__c, 4, 6000);
    //         $scope.readCharacter($scope.proposalFieldsDetails.Equipment__c, 5, 3000);
    //         $scope.readCharacter($scope.proposalFieldsDetails.Brief_Statement_of_Purpose__c, 6, 3000);
    //     }

    //     if ($rootScope.stage === '2nd Stage' && $rootScope.secondStage == true) {
    //         $scope.readCharacter($scope.proposalFieldsDetails.Main_Objective_Research_Approach_S2__c, 0, 4000);
    //         $scope.readCharacter($scope.proposalFieldsDetails.Current_State_Of_The_Art_Stage_2__c, 1, 6000);
    //         $scope.readCharacter($scope.proposalFieldsDetails.Project_Description_Stage_2__c, 2, 20000);
    //         $scope.readCharacter($scope.proposalFieldsDetails.Risk_Assessment_And_Migration_Strategy__c, 3, 3000);
    //         $scope.readCharacter($scope.proposalFieldsDetails.Reasons_For_And_Benefits_Of_Corp_Stage2__c, 4, 3000);
    //         $scope.readCharacter($scope.proposalFieldsDetails.Innovative_Aspects__c, 5, 10000);
    //         $scope.readCharacter($scope.proposalFieldsDetails.Market_Assessment_Of_Proposed_Tech__c, 6, 12000);
    //         $scope.readCharacter($scope.proposalFieldsDetails.Future_Commercialization_Plan__c, 7, 12000);
    //         $scope.readCharacter($scope.proposalFieldsDetails.Data_Management_And_Sharing_Protocols__c, 8, 5000);
    //         $scope.readCharacter($scope.proposalFieldsDetails.Involvement_Of_Young_Scientists__c, 9, 3000);
    //         $scope.readCharacter($scope.proposalFieldsDetails.Necessity_Of_Funding__c, 10, 3000);
    //         $scope.readCharacter($scope.proposalFieldsDetails.Tentative_plans_for_networking__c, 11, 3000);
    //         $scope.readCharacter($scope.proposalFieldsDetails.Plan_For_Utilisation_and_Preservation__c, 12, 3000);
    //         $scope.readCharacter($scope.proposalFieldsDetails.Profile_Of_The_Academic_Institutions__c, 13, 10000);
    //     }

    //     // Stage 1 field char limit checks (only for 1st Stage)
    //     if ($rootScope.stage === '1st Stage') {
    //         // indices match readCharacter() calls in ProjectDetail.page
    //         var charLimitErrors = [
    //             { index: 0, limit: 3000, field: 'Research_Approach_Objectives__c', label: 'Main objectives of the research proposal' },
    //             { index: 1, limit: 3000, field: 'Current_State_Of_The_Art__c', label: 'Current state of the art' },
    //             { index: 2, limit: 12000, field: 'Project_Description__c', label: 'Project description' },
    //             { index: 3, limit: 3000, field: 'Expected_Deliverables__c', label: 'Expected deliverables' },
    //             { index: 4, limit: 6000, field: 'Reasons_For_And_Benefits_Of_Cooperation__c', label: 'Reasons for and benefits of cooperation' },
    //             { index: 5, limit: 3000, field: 'Equipment__c', label: 'Equipment' },
    //             { index: 6, limit: 3000, field: 'Brief_Statement_of_Purpose__c', label: 'Brief statement of purpose / reasons for cooperation' }
    //         ];

    //         for (var ci = 0; ci < charLimitErrors.length; ci++) {
    //             var entry = charLimitErrors[ci];
    //             if ($scope.objRtf[entry.index] && $scope.objRtf[entry.index].errorStatus) {
    //                 swal('Info', 'Character limit exceeded for "' + entry.label + '". Maximum allowed is ' + entry.limit + ' characters.', 'info');
    //                 return;
    //             }
    //         }
    //     }

    //     // Stage 2 additional field char limit checks (only for 2nd Stage)
    //     if ($rootScope.stage === '2nd Stage' && $rootScope.secondStage == true) {
    //         var charLimitErrorsS2 = [
    //             { index: 0, limit: 4000, label: 'Main objectives of the research approach (Stage 2)' },
    //             { index: 1, limit: 6000, label: 'Current state of the art (Stage 2)' },
    //             { index: 2, limit: 20000, label: 'Project description (Stage 2)' },
    //             { index: 3, limit: 3000, label: 'Risk assessment and mitigation strategy' },
    //             { index: 4, limit: 3000, label: 'Reasons for and benefits of cooperation (Stage 2)' },
    //             { index: 5, limit: 10000, label: 'Innovative aspects' },
    //             { index: 6, limit: 12000, label: 'Market assessment of proposed technology' },
    //             { index: 7, limit: 12000, label: 'Future commercialization plan' },
    //             { index: 8, limit: 5000, label: 'Data management and sharing protocols' },
    //             { index: 9, limit: 3000, label: 'Involvement of young scientists' },
    //             { index: 10, limit: 3000, label: 'Necessity of funding' },
    //             { index: 11, limit: 3000, label: 'Tentative plans for networking' },
    //             { index: 12, limit: 3000, label: 'Plan for utilisation and preservation' },
    //             { index: 13, limit: 10000, label: 'Profile of the academic institutions' }
    //         ];

    //         for (var ci2 = 0; ci2 < charLimitErrorsS2.length; ci2++) {
    //             var entry2 = charLimitErrorsS2[ci2];
    //             if ($scope.objRtf[entry2.index] && $scope.objRtf[entry2.index].errorStatus) {
    //                 swal('Info', 'Character limit exceeded for "' + entry2.label + '". Maximum allowed is ' + entry2.limit + ' characters.', 'info');
    //                 return;
    //             }
    //         }
    //     }

    //     // ---------------------- END CHARACTER LIMIT VALIDATION ---------------------------- //

    //     // ---------------------- CHECKING PROPOSAL REQUIRED FIELDS ---------------------------- //


    //     // Validate Quotation for Equipment / Accessories is uploaded - Stage 1
    //     // if ($rootScope.stage === '1st Stage' && $rootScope.mailingCountry === 'India') {
    //     //     if (!$scope.quotationEquipmentDoc || !$scope.quotationEquipmentDoc.userDocument || $scope.quotationEquipmentDoc.userDocument.Status__c !== 'Uploaded') {
    //     //         swal({
    //     //             title: "Info",
    //     //             text: "Please upload Quotation for Equipment / Accessories - Stage 1 before saving.",
    //     //             icon: "info",
    //     //             button: "OK",
    //     //         });
    //     //         return;
    //     //     }
    //     // }

    //     // Validate Financial Statement Report is uploaded - Stage 2
    //     if ($rootScope.stage === '2nd Stage' && ($rootScope.mailingCountry === 'India')) {
    //         if (!$scope.auditedFinancialDoc || !$scope.auditedFinancialDoc.userDocument || $scope.auditedFinancialDoc.userDocument.Status__c !== 'Uploaded') {
    //             swal({
    //                 title: "Info",
    //                 text: "Please upload Financial Statement Report - Stage 2 before saving.",
    //                 icon: "info",
    //                 button: "OK",
    //             });
    //             return;
    //         }
    //     }

    //     // Validate Quotation for Equipment / Accessories is uploaded - Stage 2
    //     if ($rootScope.stage === '2nd Stage' && $rootScope.mailingCountry === 'India') {
    //         if (!$scope.quotationEquipmentDoc || !$scope.quotationEquipmentDoc.userDocument || $scope.quotationEquipmentDoc.userDocument.Status__c !== 'Uploaded') {
    //             swal({
    //                 title: "Info",
    //                 text: "Please upload Quotation for Equipment / Accessories - Stage 2 before saving.",
    //                 icon: "info",
    //                 button: "OK",
    //             });
    //             return;
    //         }
    //     }

    //     $("#btnSubmit").html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Please wait...');
    //     ApplicantPortal_Contoller.insertProjectDetails($scope.proposalFieldsDetails, function (result, event) {
    //         $("#btnSubmit").html('<i class="fa-solid fa-check me-2"></i>Save and Next');
    //         if (event.status) {
    //             debugger;

    //             // Save Work Package Details
    //             $scope.saveWorkPackageDetailsInternal(function (wpSuccess) {
    //                 let messageText;

    //                 messageText = $rootScope.secondStage
    //                     ? `Project Details have been saved successfully.

    //                     Next Step:
    //                     Please fill in the Expense Table Info.`
    //                     : `Project Details have been saved successfully.

    //                     Next Step:
    //                     Please upload signature in Declaration Page.`;
    //                 // Please fill in the Declaration Info.
    //                 swal({
    //                     title: "Success",
    //                     text: messageText,
    //                     icon: "success",
    //                     button: "OK",
    //                     dangerMode: false,
    //                 }).then((willDelete) => {
    //                     if (willDelete) {
    //                         if ($rootScope.secondStage) {
    //                             $scope.redirectPageURL('ExpenseDeclaration');
    //                         } else {
    //                             $scope.redirectPageURL('Declartion_2plus2');
    //                         }
    //                     } else {
    //                         return;
    //                     }
    //                 });
    //             });
    //         }
    //     },
    //         { escape: true }
    //     )
    // }

    $scope.saveDetails = function () {
        debugger;

        // ==================== DOCUMENT UPLOAD VALIDATIONS ====================

        // Check if Project Proposal is uploaded
        if ($scope.doc.userDocument.Status__c !== 'Uploaded') {
            swal({
                title: "Info",
                text: "Please upload Project Proposal before saving.",
                icon: "info",
                button: "OK",
            });
            return;
        }

        // Check Grant Acceptance Undertaking (India, Stage 1 only)
        if (
            $rootScope.mailingCountry === 'India'
            && !$rootScope.secondStage
            && !(
                $scope.grantAcceptanceUndertakingDoc
                && $scope.grantAcceptanceUndertakingDoc.userDocument
                && $scope.grantAcceptanceUndertakingDoc.userDocument.Status__c === 'Uploaded'
            )
        ) {
            // swal({
            //     title: "Info",
            //     text: "Please upload Undertaking Format of Grant Acceptance before saving.",
            //     icon: "info",
            //     button: "OK",
            // });
            // return;
            swal({
                title: "Info",
                content: {
                    element: "div",
                    attributes: {
                        innerHTML: `
                            <p style="margin-top:10px; margin-bottom:20px; line-height:1.6;">
                                Please upload Undertaking format of Grant Acceptance before saving.
                            </p>
                        `
                    }
                },
                icon: "info",
                button: "OK"
            });
            return;
        }

        // Check Sensitivity Security Undertaking (Stage 1 only)
        if (
            !$rootScope.secondStage
            && !(
                $scope.sensitivitySecurityUndertakingDoc
                && $scope.sensitivitySecurityUndertakingDoc.userDocument
                && $scope.sensitivitySecurityUndertakingDoc.userDocument.Status__c === 'Uploaded'
            )
        ) {
            // swal({
            //     title: "Info",
            //     text: "Please upload Undertaking for Sensitivity Security Regulations before saving.",
            //     icon: "info",
            //     button: "OK",
            // });
            // return;
            swal({
                title: "Info",
                content: {
                    element: "div",
                    attributes: {
                        innerHTML: `
                            <p style="margin-top:10px; margin-bottom:20px; line-height:1.6;">
                               Please upload Undertaking for Sensitivity Security Regulations before saving.
                            </p>
                        `
                    }
                },
                icon: "info",
                button: "OK"
            });
            return;
        }

        // ==================== PROJECT DETAILS FIELD VALIDATIONS ====================

        // Stage 1 required fields
        if (!$rootScope.secondStage) {
            if ($scope.proposalFieldsDetails.Research_Approach_Objectives__c == undefined || $scope.proposalFieldsDetails.Research_Approach_Objectives__c == "") {
                showInfo('Please fill Main objectives of the research approach (max. chars 3000).');
                return;
            }
            if ($scope.proposalFieldsDetails.Current_State_Of_The_Art__c == undefined || $scope.proposalFieldsDetails.Current_State_Of_The_Art__c == "") {
                showInfo('Please fill Current state of the art in the field (max. chars 3000).');
                return;
            }
            if ($scope.proposalFieldsDetails.Project_Description__c == undefined || $scope.proposalFieldsDetails.Project_Description__c == "") {
                showInfo('Please fill Project description including work packages/work distribution amongst partners. Comment on starting TRL and expected TRL at end of the project (max. chars 12000).');
                return;
            }
            if ($scope.proposalFieldsDetails.Expected_Deliverables__c == undefined || $scope.proposalFieldsDetails.Expected_Deliverables__c == "") {
                showInfo('Please fill Expected deliverables as bullet points (max. chars 3000).');
                return;
            }
            if ($scope.proposalFieldsDetails.Reasons_For_And_Benefits_Of_Cooperation__c == undefined || $scope.proposalFieldsDetails.Reasons_For_And_Benefits_Of_Cooperation__c == "") {
                showInfo('Please fill Reasons for and benefits of cooperation - including previous collaboration with the partner country (max. chars 6000).');
                return;
            }
            if ($scope.proposalFieldsDetails.Equipment__c == undefined || $scope.proposalFieldsDetails.Equipment__c == "") {
                showInfo('Please fill Equipment (if equipment to be purchased, please justify briefly the need) (max. chars 3000).');
                return;
            }
            if ($scope.proposalFieldsDetails.Brief_Statement_of_Purpose__c == undefined || $scope.proposalFieldsDetails.Brief_Statement_of_Purpose__c == "") {
                showInfo('Please fill Brief profile of each partner institution with emphasis on research activities (max. chars 3000).');
                return;
            }
        }

        // Stage 2 required fields
        if ($rootScope.secondStage == true) {
            if ($scope.proposalFieldsDetails.Main_Objective_Research_Approach_S2__c == undefined || $scope.proposalFieldsDetails.Main_Objective_Research_Approach_S2__c == "") {
                showInfo('Please fill Main objectives of the research approach (max. chars 4000).');
                return;
            }
            if ($scope.proposalFieldsDetails.Current_State_Of_The_Art_Stage_2__c == undefined || $scope.proposalFieldsDetails.Current_State_Of_The_Art_Stage_2__c == "") {
                showInfo('Please fill Current state of the art in the field (max. chars 6000).');
                return;
            }
            // if ($scope.proposalFieldsDetails.Project_Description_Stage_2__c == undefined || $scope.proposalFieldsDetails.Project_Description_Stage_2__c == "") {
            //     showInfo('Please fill Detailed project description (max. chars 20000).');
            //     return;
            // }
            if ($scope.proposalFieldsDetails.Risk_Assessment_And_Migration_Strategy__c == undefined || $scope.proposalFieldsDetails.Risk_Assessment_And_Migration_Strategy__c == "") {
                showInfo('Please fill Risk assessment & mitigation strategy and Criteria for abandoning the project (max. chars 3000).');
                return;
            }
            if ($scope.proposalFieldsDetails.Reasons_For_And_Benefits_Of_Corp_Stage2__c == undefined || $scope.proposalFieldsDetails.Reasons_For_And_Benefits_Of_Corp_Stage2__c == "") {
                showInfo('Please fill Reasons for and benefits of cooperation for each partner (max. chars 3000).');
                return;
            }
            if ($scope.proposalFieldsDetails.Innovative_Aspects__c == undefined || $scope.proposalFieldsDetails.Innovative_Aspects__c == "") {
                showInfo('Please fill Innovative aspects / IP and future potential utilization plan (max. chars 10000).');
                return;
            }
            // if ($scope.proposalFieldsDetails.Market_Assessment_Of_Proposed_Tech__c == undefined || $scope.proposalFieldsDetails.Market_Assessment_Of_Proposed_Tech__c == "") {
            //     showInfo('Please fill Market assessment of proposed technology/product (max. chars 12000).');
            //     return;
            // }
            // if ($scope.proposalFieldsDetails.Future_Commercialization_Plan__c == undefined || $scope.proposalFieldsDetails.Future_Commercialization_Plan__c == "") {
            //     showInfo('Please fill Future commercialization plan and expected timeline (max. chars 12000).');
            //     return;
            // }
            if ($scope.proposalFieldsDetails.Data_Management_And_Sharing_Protocols__c == undefined || $scope.proposalFieldsDetails.Data_Management_And_Sharing_Protocols__c == "") {
                showInfo('Please fill Data Management and Sharing Protocols (max. chars 5000).');
                return;
            }
            if ($scope.proposalFieldsDetails.Involvement_Of_Young_Scientists__c == undefined || $scope.proposalFieldsDetails.Involvement_Of_Young_Scientists__c == "") {
                showInfo('Please fill Involvement of young scientists / research scholars (max. chars 3000).');
                return;
            }
            if ($scope.proposalFieldsDetails.Necessity_Of_Funding__c == undefined || $scope.proposalFieldsDetails.Necessity_Of_Funding__c == "") {
                showInfo('Please fill Necessity of funding (max. chars 3000).');
                return;
            }
            if ($scope.proposalFieldsDetails.Tentative_plans_for_networking__c == undefined || $scope.proposalFieldsDetails.Tentative_plans_for_networking__c == "") {
                showInfo('Please fill Tentative Plans For Network Meetings and Exchange Visits (including duration) (max. chars 3000).');
                return;
            }
            if ($scope.proposalFieldsDetails.Plan_For_Utilisation_and_Preservation__c == undefined || $scope.proposalFieldsDetails.Plan_For_Utilisation_and_Preservation__c == "") {
                showInfo('Please fill Plan for the utilisation and preservation of project-acquired equipment after the completion of the project. (max. chars 3000).');
                return;
            }
            if ($scope.proposalFieldsDetails.Profile_Of_The_Academic_Institutions__c == undefined || $scope.proposalFieldsDetails.Profile_Of_The_Academic_Institutions__c == "") {
                showInfo('Please fill Profile of the academic institutions (max. chars 3000).');
                return;
            }
        }

        function showInfo(message) {
            swal({
                title: "Info",
                content: {
                    element: "div",
                    attributes: {
                        innerHTML: `<p style="margin-top:10px; margin-bottom:20px; line-height:1.6;">${message}</p>`
                    }
                },
                icon: "info",
                button: "OK"
            });
        }

        // ==================== CHARACTER LIMIT VALIDATIONS ====================

        // Recalculate character counts at save-time to ensure validation always runs
        if ($rootScope.stage === '1st Stage') {
            $scope.readCharacter($scope.proposalFieldsDetails.Research_Approach_Objectives__c, 0, 3000);
            $scope.readCharacter($scope.proposalFieldsDetails.Current_State_Of_The_Art__c, 1, 3000);
            $scope.readCharacter($scope.proposalFieldsDetails.Project_Description__c, 2, 12000);
            $scope.readCharacter($scope.proposalFieldsDetails.Expected_Deliverables__c, 3, 3000);
            $scope.readCharacter($scope.proposalFieldsDetails.Reasons_For_And_Benefits_Of_Cooperation__c, 4, 6000);
            $scope.readCharacter($scope.proposalFieldsDetails.Equipment__c, 5, 3000);
            $scope.readCharacter($scope.proposalFieldsDetails.Brief_Statement_of_Purpose__c, 6, 3000);
        }

        if ($rootScope.stage === '2nd Stage' && $rootScope.secondStage == true) {
            $scope.readCharacter($scope.proposalFieldsDetails.Main_Objective_Research_Approach_S2__c, 0, 4000);
            $scope.readCharacter($scope.proposalFieldsDetails.Current_State_Of_The_Art_Stage_2__c, 1, 6000);
            $scope.readCharacter($scope.proposalFieldsDetails.Project_Description_Stage_2__c, 2, 20000);
            $scope.readCharacter($scope.proposalFieldsDetails.Risk_Assessment_And_Migration_Strategy__c, 3, 3000);
            $scope.readCharacter($scope.proposalFieldsDetails.Reasons_For_And_Benefits_Of_Corp_Stage2__c, 4, 3000);
            $scope.readCharacter($scope.proposalFieldsDetails.Innovative_Aspects__c, 5, 10000);
            $scope.readCharacter($scope.proposalFieldsDetails.Market_Assessment_Of_Proposed_Tech__c, 6, 12000);
            $scope.readCharacter($scope.proposalFieldsDetails.Future_Commercialization_Plan__c, 7, 12000);
            $scope.readCharacter($scope.proposalFieldsDetails.Data_Management_And_Sharing_Protocols__c, 8, 5000);
            $scope.readCharacter($scope.proposalFieldsDetails.Involvement_Of_Young_Scientists__c, 9, 3000);
            $scope.readCharacter($scope.proposalFieldsDetails.Necessity_Of_Funding__c, 10, 3000);
            $scope.readCharacter($scope.proposalFieldsDetails.Tentative_plans_for_networking__c, 11, 3000);
            $scope.readCharacter($scope.proposalFieldsDetails.Plan_For_Utilisation_and_Preservation__c, 12, 3000);
            $scope.readCharacter($scope.proposalFieldsDetails.Profile_Of_The_Academic_Institutions__c, 13, 3000);
        }

        // Check character limit errors for Stage 1
        if ($rootScope.stage === '1st Stage') {
            var charLimitErrors = [
                { index: 0, limit: 3000, label: 'Main objectives of the research proposal' },
                { index: 1, limit: 3000, label: 'Current state of the art' },
                { index: 2, limit: 12000, label: 'Project description' },
                { index: 3, limit: 3000, label: 'Expected deliverables' },
                { index: 4, limit: 6000, label: 'Reasons for and benefits of cooperation' },
                { index: 5, limit: 3000, label: 'Equipment' },
                { index: 6, limit: 3000, label: 'Brief statement of purpose / reasons for cooperation' }
            ];

            for (var ci = 0; ci < charLimitErrors.length; ci++) {
                var entry = charLimitErrors[ci];
                if ($scope.objRtf[entry.index] && $scope.objRtf[entry.index].errorStatus) {
                    swal('Info', 'Character limit exceeded for "' + entry.label + '". Maximum allowed is ' + entry.limit + ' characters.', 'info');
                    return;
                }
            }
        }

        // Check character limit errors for Stage 2
        if ($rootScope.stage === '2nd Stage' && $rootScope.secondStage == true) {
            var charLimitErrorsS2 = [
                { index: 0, limit: 4000, label: 'Main objectives of the research approach (Stage 2)' },
                { index: 1, limit: 6000, label: 'Current state of the art (Stage 2)' },
                { index: 2, limit: 20000, label: 'Project description (Stage 2)' },
                { index: 3, limit: 3000, label: 'Risk assessment and mitigation strategy' },
                { index: 4, limit: 3000, label: 'Reasons for and benefits of cooperation (Stage 2)' },
                { index: 5, limit: 10000, label: 'Innovative aspects' },
                { index: 6, limit: 12000, label: 'Market assessment of proposed technology' },
                { index: 7, limit: 12000, label: 'Future commercialization plan' },
                { index: 8, limit: 5000, label: 'Data management and sharing protocols' },
                { index: 9, limit: 3000, label: 'Involvement of young scientists' },
                { index: 10, limit: 3000, label: 'Necessity of funding' },
                { index: 11, limit: 3000, label: 'Tentative plans for networking' },
                { index: 12, limit: 3000, label: 'Plan for utilisation and preservation' },
                { index: 13, limit: 3000, label: 'Profile of the academic institutions' }
            ];

            for (var ci2 = 0; ci2 < charLimitErrorsS2.length; ci2++) {
                var entry2 = charLimitErrorsS2[ci2];
                if ($scope.objRtf[entry2.index] && $scope.objRtf[entry2.index].errorStatus) {
                    swal('Info', 'Character limit exceeded for "' + entry2.label + '". Maximum allowed is ' + entry2.limit + ' characters.', 'info');
                    return;
                }
            }
        }

        // ==================== DOCUMENT UPLOAD VALIDATIONS (Stage specific) ====================

        // Validate Financial Statement Report is uploaded - Stage 2
        if ($rootScope.stage === '2nd Stage' && ($rootScope.mailingCountry === 'India')) {
            if (!$scope.auditedFinancialDoc || !$scope.auditedFinancialDoc.userDocument || $scope.auditedFinancialDoc.userDocument.Status__c !== 'Uploaded') {
                swal({
                    title: "Info",
                    text: "Please upload Budget Report - Stage 2 before saving.",
                    icon: "info",
                    button: "OK",
                });
                return;
            }
        }

        // Validate Quotation for Equipment / Accessories is uploaded - Stage 2
        if ($rootScope.stage === '2nd Stage' && $rootScope.mailingCountry === 'India') {
            if (!$scope.quotationEquipmentDoc || !$scope.quotationEquipmentDoc.userDocument || $scope.quotationEquipmentDoc.userDocument.Status__c !== 'Uploaded') {
                swal({
                    title: "Info",
                    text: "Please upload Quotation for Equipment / Accessories - Stage 2 before saving.",
                    icon: "info",
                    button: "OK",
                });
                return;
            }
        }

        // ==================== NEW: WORK PACKAGE & DELIVERABLES VALIDATION ====================
        // This runs before any database operations, preventing save if validation fails

        if (!validateWPDeliverablesBeforeSave()) {
            return; // Stop execution if validation fails
        }

        // ==================== PROCEED WITH SAVING ====================

        $("#btnSubmit").html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Please wait...');

        ApplicantPortal_Contoller.insertProjectDetails($scope.proposalFieldsDetails, function (result, event) {
            $("#btnSubmit").html('<i class="fa-solid fa-check me-2"></i>Save and Next');

            if (event.status) {
                debugger;

                // OLD SYSTEM: Commented out - using new WP+Deliverables system directly
                // $scope.saveWorkPackageDetailsInternal(function (wpSuccess) {

                // Save WP and Deliverables using the new combined method
                $scope.saveWPDeliverablesData();
                console.log('WP and Deliverables saved successfully');

                // Save existing grants independently
                $scope.saveExistingGrantsInternal(function (grantsSuccess) {
                    let messageText;

                    messageText = $rootScope.secondStage
                        ? `<div style="text-align: center;">
                <div style="margin-bottom: 15px;">Project Details have been saved successfully.</div>
                <div style="font-weight: bold; margin: 10px 0;">Next Step:</div>
                <div>Please fill in the Expense Table Info.</div>
            </div>`
                        : `<div style="text-align: center;">
                <div style="margin-bottom: 15px;">Project Details have been saved successfully.</div>
                <div style="font-weight: bold; margin: 10px 0;">Next Step:</div>
                <div>Please upload signature in Declaration Page.</div>
            </div>`;

                    swal({
                        title: "Success",
                        content: {
                            element: "div",
                            attributes: {
                                innerHTML: messageText
                            }
                        },
                        icon: "success",
                        button: "OK"
                    }).then((willDelete) => {
                        if (willDelete) {
                            if ($rootScope.secondStage) {
                                $scope.redirectPageURL('ExpenseDeclaration');
                            } else {
                                $scope.redirectPageURL('Declartion_2plus2');
                            }
                        }
                    });
                });
                // }); // OLD SYSTEM callback closing - commented out
            }
        },
            { escape: true });
    }

    // ==================== NEW HELPER FUNCTION FOR WP + DELIVERABLES VALIDATION ====================
    function validateWPDeliverablesBeforeSave() {
        debugger;

        // Skip validation if no work packages exist (old functionality)
        if (!$scope.wpDeliverablesTableList || $scope.wpDeliverablesTableList.length === 0) {
            return true;
        }

        var objData = $scope.wpDeliverablesTableList;

        for (var i = 0; i < objData.length; i++) {
            var wp = objData[i];

            // Partner validation
            var count = 0;
            if (wp.AccountList) {
                for (var k = 0; k < wp.AccountList.length; k++) {
                    if (wp.AccountList[k].selected == true) {
                        count++;
                    }
                }
            }
            if ($rootScope.secondStage == true) {
                if (count <= 0) {
                    swal("Work Package Details", "Please select at least one partner for " + wp.wpSequence, "info");
                    return false;
                }

                // Title validation
                if (!wp.title || wp.title.trim() === "") {
                    swal("Work Package Details", "Please enter title for " + wp.wpSequence, "info");
                    return false;
                }

                // TRL validations
                if (!wp.trlFrom || wp.trlFrom === "") {
                    swal("Work Package Details", "Please select TRL From for " + wp.wpSequence, "info");
                    return false;
                }

                if (!wp.trlTo || wp.trlTo === "") {
                    swal("Work Package Details", "Please select TRL To for " + wp.wpSequence, "info");
                    return false;
                }

                if (parseInt(wp.trlTo) < parseInt(wp.trlFrom)) {
                    swal("Work Package Details", "TRL To must be >= TRL From for " + wp.wpSequence, "info");
                    return false;
                }

                // Month validations
                if (!wp.wpStartMonth || wp.wpStartMonth === "") {
                    swal("Work Package Details", "Please enter WP Start Month for " + wp.wpSequence, "info");
                    return false;
                }

                if (!wp.wpEndMonth || wp.wpEndMonth === "") {
                    swal("Work Package Details", "Please enter WP End Month for " + wp.wpSequence, "info");
                    return false;
                }

                if (parseInt(wp.wpEndMonth) < parseInt(wp.wpStartMonth)) {
                    swal("Work Package Details", "WP End Month must be >= WP Start Month for " + wp.wpSequence, "info");
                    return false;
                }

                // Duration validation against max duration
                var wpDuration = parseInt(wp.wpEndMonth) - parseInt(wp.wpStartMonth) + 1;
                if (wpDuration > parseInt($rootScope.maxDurationInMonths)) {
                    swal("Work Package Details", "WP Duration cannot exceed " + $rootScope.maxDurationInMonths + " months for " + wp.wpSequence, "info");
                    return false;
                }
            }

            // Deliverables validation
            if (wp.deliverables && wp.deliverables.length > 0) {
                for (var j = 0; j < wp.deliverables.length; j++) {
                    var deliv = wp.deliverables[j];

                    if ($rootScope.secondStage == true) {
                        if (!deliv.title || deliv.title.trim() === "") {
                            swal("Deliverable Details", "Please enter title for " + deliv.deliverableSequence, "info");
                            return false;
                        }

                        if (!deliv.startMonth || deliv.startMonth === "") {
                            swal("Deliverable Details", "Please enter Start Month for " + deliv.deliverableSequence, "info");
                            return false;
                        }

                        if (!deliv.endMonth || deliv.endMonth === "") {
                            swal("Deliverable Details", "Please enter End Month for " + deliv.deliverableSequence, "info");
                            return false;
                        }

                        var delivStart = parseInt(deliv.startMonth);
                        var delivEnd = parseInt(deliv.endMonth);
                        var wpStart = parseInt(wp.wpStartMonth);
                        var wpEnd = parseInt(wp.wpEndMonth);

                        if (delivStart < wpStart) {
                            swal("Validation Error", "Deliverable Start Month must be >= WP Start Month (" + wpStart + ") for " + deliv.deliverableSequence, "error");
                            return false;
                        }

                        if (delivEnd > wpEnd) {
                            swal("Validation Error", "Deliverable End Month must be <= WP End Month (" + wpEnd + ") for " + deliv.deliverableSequence, "error");
                            return false;
                        }

                        if (delivEnd < delivStart) {
                            swal("Deliverable Details", "End Month must be >= Start Month for " + deliv.deliverableSequence, "info");
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    /**
     * OLD WORK PACKAGE SYSTEM - DEPRECATED
     * Internal function to save work package details (called from saveDetails)
     * Note: This function is no longer used - replaced by saveWPDeliverablesData()
     */
    $scope.saveWorkPackageDetailsInternal = function (callback) {
        debugger;

        // Check if there are work packages to save
        if (!$scope.workPackList || $scope.workPackList.length === 0) {
            console.log('No work packages to save');
            // Still need to save deliverables and grants even if no work packages
            $scope.saveWPDeliverablesData();
            console.log('WP and Deliverables saved successfully (no work packages)');

            // Save existing grants independently
            $scope.saveExistingGrantsInternal(function (grantsSuccess) {
                if (grantsSuccess) {
                    console.log('Existing grants saved successfully (no work packages)');
                } else {
                    console.error('Error saving existing grants');
                }
                if (callback) callback(true);
            });
            return;
        }

        var objData = JSON.parse(JSON.stringify($scope.workPackList));

        // Filter out empty work packages to prevent creating extra empty records
        var filteredData = objData.filter(function (wp) {
            // Consider a work package valid if it has any of the following:
            // - An ID (already saved)
            // - A title
            // - TRL levels
            // - Duration
            // - Work package details
            return (wp.Id && wp.Id !== '') ||
                (wp.title && wp.title.trim() !== '') ||
                (wp.trl_level && wp.trl_level !== '') ||
                (wp.end_trl_level && wp.end_trl_level !== '') ||
                (wp.duration && wp.duration !== '') ||
                (wp.Workpackage_detail && wp.Workpackage_detail.trim() !== '');
        });

        console.log('OLD SYSTEM - Filtered work packages for saving:', filteredData);
        console.log('OLD SYSTEM - Original work packages count:', objData.length, 'Filtered count:', filteredData.length);

        // If no valid work packages exist, proceed directly to deliverables and grants
        if (filteredData.length === 0) {
            console.log('OLD SYSTEM - No valid work packages to save, proceeding to deliverables and grants');
            // Still need to save deliverables and grants even if no work packages
            $scope.saveWPDeliverablesData();
            console.log('WP and Deliverables saved successfully (no valid work packages)');

            // Save existing grants independently
            $scope.saveExistingGrantsInternal(function (grantsSuccess) {
                if (grantsSuccess) {
                    console.log('Existing grants saved successfully (no valid work packages)');
                } else {
                    console.error('Error saving existing grants');
                }
                if (callback) callback(true);
            });
            return;
        }

        // === ADD VALIDATIONS HERE (BEFORE preparing data) ===
        for (var i = 0; i < filteredData.length; i++) {
            var count = 0;
            if (filteredData[i].AccountList) {
                for (var k = 0; k < filteredData[i].AccountList.length; k++) {
                    if (filteredData[i].AccountList[k].selected == true) {
                        count = count + 1;
                    }
                }
            }
            /*
            if (filteredData[i].title == undefined || filteredData[i].title == "") {
                swal("Work Package Details", "Please Enter Title.", "info");
                $("#title" + i + "").addClass('border-theme');
                return;
            }
            if (count <= 0) {
                swal("Work Package Details", "Please Select Partners.", "info");
                $("#account" + i + "").addClass('border-theme');
                return;
            }
            if (filteredData[i].trl_level == undefined || filteredData[i].trl_level == "") {
                swal("Work Package Details", "Please Enter Start TRL Level.", "info");
                $("#STL" + i + "").addClass('border-theme');
                return;
            }
            if (filteredData[i].end_trl_level == undefined || filteredData[i].end_trl_level == "") {
                swal("Work Package Details", "Please Enter End TRL Level.", "info");
                $("#ETL" + i + "").addClass('border-theme');
                return;
            }
            if (filteredData[i].trl_level < 3 || filteredData[i].trl_level > 9) {
                swal("Work Package Details", "Minimum TRL Level should be 3 and Maximum TRL Level should be 9", "info");
                $("#STL" + i + "").addClass('border-theme');
                return;
            }
            if (filteredData[i].end_trl_level < 3 || filteredData[i].end_trl_level > 9) {
                swal("Work Package Details", "Minimum TRL Level should be 3 and Maximum TRL Level should be 9", "info");
                $("#ETL" + i + "").addClass('border-theme');
                return;
            }
            if (filteredData[i].end_trl_level < filteredData[i].trl_level) {
                swal("Work Package Details", "End TRL Level should be greater than Start TRL Level.", "info");
                $("#ETL" + i + "").addClass('border-theme');
                return;
            }
            if (filteredData[i].duration == undefined || filteredData[i].duration == "") {
                swal("Work Package Details", "Please Enter Duration.", "info");
                $("#duration" + i + "").addClass('border-theme');
                return;
            }
            if (filteredData[i].duration != undefined && filteredData[i].duration != "") {
                if (Number(filteredData[i].duration) > Number($rootScope.maxDurationInMonths)) {
                    swal("Work Package Details", "Max. Duration can be " + $rootScope.maxDurationInMonths + " months.", "info");
                    $("#duration" + i + "").addClass('border-theme');
                    return;
                }
            }
            */

        }
        // === END VALIDATIONS ===

        // Prepare data for saving - map field names to match Apex wrapper
        for (var i = 0; i < filteredData.length; i++) {
            delete filteredData[i]['$$hashKey'];
            delete filteredData[i]['durationError'];
            delete filteredData[i]['durationErrorMsg'];
            delete filteredData[i]['minDurationError'];
            delete filteredData[i]['maxDurationError'];

            // Map externalId to ExternalId (Apex expects capital E)
            if (filteredData[i].externalId !== undefined) {
                filteredData[i].ExternalId = String(filteredData[i].externalId);
                delete filteredData[i]['externalId'];
            }

            // Ensure Id is a string (empty string if undefined)
            if (filteredData[i].Id === undefined || filteredData[i].Id === null) {
                filteredData[i].Id = '';
            }

            // Convert numeric values to strings for Apex
            if (filteredData[i].trl_level !== undefined) {
                filteredData[i].trl_level = String(filteredData[i].trl_level);
            }
            if (filteredData[i].end_trl_level !== undefined) {
                filteredData[i].end_trl_level = String(filteredData[i].end_trl_level);
            }
            if (filteredData[i].duration !== undefined) {
                filteredData[i].duration = String(filteredData[i].duration);
            }
            if (filteredData[i].WPSequence !== undefined) {
                filteredData[i].WPSequence = String(filteredData[i].WPSequence);
            }

            var accountWrapperList = [];
            if (filteredData[i].AccountList) {
                for (var k = 0; k < filteredData[i].AccountList.length; k++) {
                    var acc = filteredData[i].AccountList[k];
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
            filteredData[i].AccountListWrapper = accountWrapperList;
            delete filteredData[i]['AccountList'];
        }

        console.log('Saving work package data from saveDetails:', filteredData);

        ApplicantPortal_Contoller.saveWorkPackageDet(filteredData, $rootScope.proposalId, $rootScope.stage, function (result, event) {
            debugger;
            console.log('Save work package result:', result);
            if (event.status && result === 'success') {
                console.log('Work packages saved successfully');
                // Save deliverables after work packages
                // Save WP and Deliverables using the new combined method
                $scope.saveWPDeliverablesData();
                console.log('WP and Deliverables saved successfully');

                // Save existing grants independently (not dependent on old deliverables flow)
                $scope.saveExistingGrantsInternal(function (grantsSuccess) {
                    if (grantsSuccess) {
                        console.log('Existing grants saved successfully');
                    } else {
                        console.error('Error saving existing grants');
                    }
                    // Call callback after all are done
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

        /*
        if ($rootScope.stage === '2nd Stage') {

            // Validation
            for (var i = 0; i < objData.length; i++) {
                debugger;
                var count = 0;
                if (objData[i].AccountList) {
                    for (var k = 0; k < objData[i].AccountList.length; k++) {
                        if (objData[i].AccountList[k].selected == true) {
                            count = count + 1;
                        }
                    }
                }
                if (objData[i].title == undefined || objData[i].title == "") {
                    swal("PI Deliverables Details", "Please Enter Title.", "info");
                    $("#title" + i + "").addClass('border-theme');
                    //if (callback) callback(false);
                    return;
                }
                if (count <= 0) {
                    swal("PI Deliverables Details", "Please Select Partners.", "info");
                    $("#partner" + i + "").addClass('border-theme');
                    //if (callback) callback(false);
                    return;
                }
                if (objData[i].Due_Date__c == undefined || objData[i].Due_Date__c == "") {
                    swal("PI Deliverables Details", "Please Enter Due Date.", "info");
                    $("#due" + i + "").addClass('border-theme');
                    //if (callback) callback(false);
                    return;
                }
            }
        }
        */
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
     * Internal function to save existing grants 
     * Previously called from saveDeliverablesInternal, now called independently from saveWorkPackageDetailsInternal
     * to ensure grants are saved even when old deliverables code is commented out
     */
    $scope.saveExistingGrantsInternal = function (callback) {
        debugger;

        if ($rootScope.secondStage == true) {

            // Check if there are grants to save
            if (!$scope.input || $scope.input.length === 0) {
                console.log('No existing grants to save');
                if (callback) callback(true);
                return;
            }

            // Validation
            for (var i = 0; i < $scope.input.length; i++) {
                for (var j = 0; j < $scope.input[i].Existing_Grants__r.length; j++) {

                    if ($scope.input[i].Existing_Grants__r[j].Title__c == undefined || $scope.input[i].Existing_Grants__r[j].Title__c == "") {
                        swal("Existing Grants", "Please enter Title.", "info");
                        // if (callback) callback(false);
                        return;
                    }

                    if ($scope.input[i].Existing_Grants__r[j].Funding_Agency__c == undefined || $scope.input[i].Existing_Grants__r[j].Funding_Agency__c == "") {
                        swal("Existing Grants", "Please enter Funding Agency.", "info");
                        // if (callback) callback(false);
                        return;
                    }
                    if ($scope.input[i].Existing_Grants__r[j].Budget__c == undefined || $scope.input[i].Existing_Grants__r[j].Budget__c == "" || $scope.input[i].Existing_Grants__r[j].Budget__c <= 0) {
                        swal("Existing Grants", "Please enter Budget.", "info");
                        // if (callback) callback(false);
                        return;
                    }


                    var startDate = $scope.input[i].Existing_Grants__r[j].Starting_Date__c;

                    if (!startDate || isNaN(new Date(startDate).getTime())) {
                        swal("Existing Grants", "Please enter Starting Date.", "info");
                        return;
                    }
                    // if ($scope.input[i].Existing_Grants__r[j].Starting_Date__c == undefined || $scope.input[i].Existing_Grants__r[j].Starting_Date__c == "") {
                    //     swal("Existing Grants", "Please Enter Starting Date.");
                    //     // if (callback) callback(false);
                    //     return;
                    // }
                    if ($scope.input[i].Existing_Grants__r[j].Duration__c == undefined || $scope.input[i].Existing_Grants__r[j].Duration__c == "" || $scope.input[i].Existing_Grants__r[j].Duration__c <= 0) {
                        swal("Existing Grants", "Please enter Duration(Number in months).", "info");
                        // if (callback) callback(false);
                        return;
                    }
                }
            }
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

            // debugger;
            // console.log('event : ', event);
            // console.log('event : ', index);
            // console.log('event : ', maxLimit);

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
                swal("PI Deliverables", "Your PI Deliverables detail has been deleted successfully.", "info");
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
    /*
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
                swal("PI Deliverables Details", "Please Select Partners.", "info");
                $("#partner" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].title == undefined || objData[i].title == "") {
                swal("PI Deliverables Details", "Please Enter Title.", "info");
                $("#title" + i + "").addClass('border-theme');
                return;
            }
            if (objData[i].Due_Date__c == undefined || objData[i].Due_Date__c == "") {
                swal("PI Deliverables Details", "Please Enter Due Date.", "info");
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
                swal("PI Deliverables", "Your PI Deliverables detail has been saved successfully.", "info");
                //$scope.redirectPageURL('Network_Meeting');
            } else {
                console.error('Error saving deliverables:', event.message);
                swal("Error", "Failed to save deliverables. Please try again.", "error");
            }
            $scope.$applyAsync();
        });
    }
    */
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
            swal("Info", "At least one grant record is required.", "info");
        }
    }

    $scope.submitExistingGrants = function () {
        debugger;
        for (var i = 0; i < $scope.input.length; i++) {
            for (var j = 0; j < $scope.input[i].Existing_Grants__r.length; j++) {
                if ($scope.input[i].Existing_Grants__r[j].Funding_Agency__c == undefined || $scope.input[i].Existing_Grants__r[j].Funding_Agency__c == "") {
                    swal("Existing Grants", "Please enter Funding Agency.", "info");
                    return;
                }
                if ($scope.input[i].Existing_Grants__r[j].Budget__c == undefined || $scope.input[i].Existing_Grants__r[j].Budget__c == "") {
                    swal("Existing Grants", "Please enter Budget.", "info");
                    return;
                }
                if ($scope.input[i].Existing_Grants__r[j].Starting_Date__c == undefined || $scope.input[i].Existing_Grants__r[j].Starting_Date__c == "") {
                    swal("Existing Grants", "Please enter Starting Date.", "info");
                    return;
                }
                if ($scope.input[i].Existing_Grants__r[j].Duration__c == undefined || $scope.input[i].Existing_Grants__r[j].Duration__c == "") {
                    swal("Existing Grants", "Please enter Duration(Number in months).", "info");
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


    $scope.checkCharLimit = function (obj, fieldName, limit) {
        debugger;

        if (!obj) return;

        var targetObj;
        var value;

        // 🔹 Account field
        if (obj.hasOwnProperty(fieldName)) {
            targetObj = obj;
            value = obj[fieldName];

        }
        // 🔹 Contact field
        else if (
            obj.Contacts &&
            obj.Contacts.length > 0 &&
            obj.Contacts[0].hasOwnProperty(fieldName)
        ) {
            targetObj = obj.Contacts[0];
            value = obj.Contacts[0][fieldName];

        } else {
            return;
        }

        // Init error map
        targetObj._charLimitMap = targetObj._charLimitMap || {};

        if (!value) {
            targetObj._charLimitMap[fieldName] = false;
            return;
        }

        /* =====================================================
           SPECIAL CASE: POSTAL / ZIP CODE
           ===================================================== */
        if (fieldName === 'BillingPostalCode') {

            var country = obj.BillingCountry;
            var cleanedValue = value.replace(/[^0-9]/g, '');

            var maxLength;
            var regex;

            if (country === 'India') {
                maxLength = 6;
                regex = /^[0-9]{6}$/;
            }
            else if (country === 'Germany') {
                maxLength = 5;
                regex = /^[0-9]{5}$/;
            }
            else {
                maxLength = limit; // fallback
            }

            // Length check
            if (cleanedValue.length > maxLength) {
                targetObj._charLimitMap[fieldName] = true;
                console.log('❌ Postal code length exceeded for', country);
                return;
            }

            // Pattern check (only when full length entered)
            if (cleanedValue.length === maxLength) {
                if (regex && !regex.test(cleanedValue)) {
                    targetObj._charLimitMap[fieldName] = true;
                    console.log('❌ Invalid Postal Code for', country);
                    return;
                }
            }

            targetObj._charLimitMap[fieldName] = false;
            console.log('✅ Valid Postal Code for', country);
            return;
        }

        /* =====================================================
            DEFAULT CHAR LIMIT LOGIC (Website, Department, etc.)
           ===================================================== */

        if (value.length > limit) {
            targetObj._charLimitMap[fieldName] = true;
        } else {
            targetObj._charLimitMap[fieldName] = false;
        }
    };

    // ----------------------------- Need to add afterwards -----------------------------
    // if ($scope.applicantDetails.Summary__c != undefined || $scope.applicantDetails.Summary__c != "") {
    //         if ($scope.objRtf[0].errorStatus) {
    //             swal("info", "Summary max. length limit is 1000 character only.", "info");
    //             return;
    //         }
    //     }

    $scope.trlOptions = [3, 4, 5, 6, 7, 8, 9];
    $scope.wpDeliverablesTableList = [];

    $scope.regenerateWPSequences = function () {
        for (var i = 0; i < $scope.wpDeliverablesTableList.length; i++) {
            var wp = $scope.wpDeliverablesTableList[i];
            wp.wpSequence = 'WP' + (i + 1);
            if (wp.deliverables && wp.deliverables.length > 0) {
                for (var j = 0; j < wp.deliverables.length; j++) {
                    wp.deliverables[j].deliverableSequence = 'D' + (i + 1) + '.' + (j + 1);
                }
            }
        }
    };

    $scope.addNewWP = function () {
        var wpIndex = $scope.wpDeliverablesTableList.length + 1;
        var newWP = {
            Id: '',
            wpSequence: 'WP' + wpIndex,
            title: '',
            trlFrom: null,
            trlTo: null,
            AccountList: JSON.parse(JSON.stringify($scope.defaultAccountList)),
            wpStartMonth: null,
            wpEndMonth: null,
            deliverables: [],
            externalId: new Date().getTime() + '_' + wpIndex
        };
        $scope.wpDeliverablesTableList.push(newWP);
    };

    $scope.addNewDeliverable = function (wpIndex) {
        var wp = $scope.wpDeliverablesTableList[wpIndex];

        // Initialize deliverables array if it doesn't exist
        if (!wp.deliverables) {
            wp.deliverables = [];
        }

        var delivIndex = wp.deliverables.length + 1;
        var newDeliverable = {
            Id: '',
            deliverableSequence: 'D' + (wpIndex + 1) + '.' + delivIndex,
            title: '',
            startMonth: null,
            endMonth: null,
            externalId: new Date().getTime() + '_' + wpIndex + '_' + delivIndex,
            startMonthError: false,
            endMonthError: false
        };
        wp.deliverables.push(newDeliverable);
        $scope.regenerateWPSequences();
    };

    $scope.removeWP = function (wpIndex) {
        if ($scope.wpDeliverablesTableList.length === 1) {
            swal("Info", "At least one Work Package is required.", "info");
            return;
        }
        var wp = $scope.wpDeliverablesTableList[wpIndex];
        if (wp.Id && wp.Id !== '') {
            swal({
                title: "Are you sure?",
                text: "This will delete the Work Package and all its deliverables!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    ApplicantPortal_Contoller.deleteWorkPackageWithDeliverables(wp.Id, function (result, event) {
                        if (event.status && result === 'Success') {
                            $scope.wpDeliverablesTableList.splice(wpIndex, 1);
                            $scope.regenerateWPSequences();
                            swal("Success", "Work Package deleted successfully", "success");
                            $scope.$applyAsync();
                        } else {
                            swal("Error", "Failed to delete Work Package", "error");
                        }
                    });
                }
            });
        } else {
            $scope.wpDeliverablesTableList.splice(wpIndex, 1);
            $scope.regenerateWPSequences();
        }
    };

    $scope.removeDeliverable = function (wpIndex, delivIndex) {
        var wp = $scope.wpDeliverablesTableList[wpIndex];

        // Check if deliverables array exists
        if (!wp.deliverables || !wp.deliverables[delivIndex]) {
            return;
        }

        var deliverable = wp.deliverables[delivIndex];
        if (deliverable.Id && deliverable.Id !== '') {
            swal({
                title: "Are you sure?",
                text: "This will delete the deliverable!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    ApplicantPortal_Contoller.deleteDeliverableNew(deliverable.Id, function (result, event) {
                        if (event.status && result === 'Success') {
                            wp.deliverables.splice(delivIndex, 1);
                            $scope.regenerateWPSequences();
                            swal("Success", "Deliverable deleted successfully", "success");
                            $scope.$applyAsync();
                        } else {
                            swal("Error", "Failed to delete deliverable", "error");
                        }
                    });
                }
            });
        } else {
            wp.deliverables.splice(delivIndex, 1);
            $scope.regenerateWPSequences();
        }
    };

    $scope.validateDeliverableMonths = function (wp, deliverable) {
        deliverable.startMonthError = false;
        deliverable.endMonthError = false;
        if (wp.wpStartMonth && deliverable.startMonth) {
            if (parseInt(deliverable.startMonth) < parseInt(wp.wpStartMonth)) {
                deliverable.startMonthError = true;
            }
        }
        if (wp.wpEndMonth && deliverable.endMonth) {
            if (parseInt(deliverable.endMonth) > parseInt(wp.wpEndMonth)) {
                deliverable.endMonthError = true;
            }
        }
    };

    $scope.validateWorkPackageMonths = function (wp) {
        // Reset only end month errors
        wp.endMonthMaxDurationError = false;
        wp.endMonthStartError = false;

        // Convert to numbers, handle empty values
        var startMonth = wp.wpStartMonth !== undefined && wp.wpStartMonth !== null && wp.wpStartMonth !== ''
            ? parseInt(wp.wpStartMonth) : null;
        var endMonth = wp.wpEndMonth !== undefined && wp.wpEndMonth !== null && wp.wpEndMonth !== ''
            ? parseInt(wp.wpEndMonth) : null;

        // Validate End Month
        if (endMonth !== null) {
            // Check if End Month is less than Start Month
            if (startMonth !== null && endMonth < startMonth) {
                wp.endMonthStartError = true;
            }

            // Check max duration
            var maxDuration = parseInt($scope.maxDurations);
            if (endMonth > maxDuration) {
                wp.endMonthMaxDurationError = true;
            }
        }

        // Debug logging
        console.log('Validation Result:', {
            startMonth: startMonth,
            endMonth: endMonth,
            endMonthStartError: wp.endMonthStartError,
            endMonthMaxDurationError: wp.endMonthMaxDurationError
        });
    };

    $scope.loadWPDeliverablesData = function () {
        ApplicantPortal_Contoller.getWPWithDeliverables($rootScope.proposalId, $rootScope.stage, function (result, event) {
            if (event.status && result) {
                console.log('WP with Deliverables data:', result);
                $scope.wpDeliverablesTableList = [];
                for (var i = 0; i < result.length; i++) {
                    var wpData = result[i];
                    const accountIdXselectedAcc = new Map();
                    var accDetails = [];
                    if (wpData.Account_Mapping__r != undefined) {
                        for (var j = 0; j < wpData.Account_Mapping__r.length; j++) {
                            accountIdXselectedAcc.set(wpData.Account_Mapping__r[j].Account__c, wpData.Account_Mapping__r[j]);
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
                    var deliverablesList = [];
                    if (wpData.PI_Deliverables__r && wpData.PI_Deliverables__r.length > 0) {
                        for (var k = 0; k < wpData.PI_Deliverables__r.length; k++) {
                            var deliv = wpData.PI_Deliverables__r[k];
                            deliverablesList.push({
                                Id: deliv.Id,
                                deliverableSequence: deliv.Deliverable_Sequence__c || '',
                                title: deliv.Title__c || '',
                                startMonth: deliv.Duration_Start_Month__c || null,
                                endMonth: deliv.Duration_End_Month__c || null,
                                externalId: deliv.External_Id__c || (new Date().getTime() + '_' + i + '_' + k),
                                startMonthError: false,
                                endMonthError: false
                            });
                        }
                    }
                    $scope.wpDeliverablesTableList.push({
                        Id: wpData.Id,
                        wpSequence: wpData.WP_Sequence_2__c || '',
                        title: wpData.Title__c || '',
                        trlFrom: wpData.TRL_Level__c || null,
                        trlTo: wpData.End_TRL_Level__c || null,
                        AccountList: accDetails,
                        wpStartMonth: wpData.Duration_Start_Month__c || null,
                        wpEndMonth: wpData.Duration_End_Month__c || null,
                        deliverables: deliverablesList,
                        externalId: wpData.External_Id__c || (new Date().getTime() + '_' + i)
                    });
                }
                if ($scope.wpDeliverablesTableList.length === 0) {
                    $scope.addNewWP();
                }

                // Mark WP Deliverables loading as complete
                $scope.markLoadingComplete('wpDeliverables');

                $scope.$applyAsync();
            } else {
                console.error('Error fetching WP Deliverables data:', event.message);
                // Still mark as complete even on error to avoid spinner hanging
                $scope.markLoadingComplete('wpDeliverables');
            }
        }, { escape: true });
    };

    $scope.saveWPDeliverablesData = function () {
        var objData = JSON.parse(JSON.stringify($scope.wpDeliverablesTableList));

        // Filter out empty work packages to prevent creating extra empty records
        var filteredData = objData.filter(function (wp) {
            // Consider a work package valid if it has any of the following:
            // - An ID (already saved)
            // - A title
            // - TRL levels
            // - Start/End months
            // - Deliverables
            return (wp.Id && wp.Id !== '') ||
                (wp.title && wp.title.trim() !== '') ||
                (wp.trlFrom && wp.trlFrom !== '') ||
                (wp.trlTo && wp.trlTo !== '') ||
                (wp.wpStartMonth && wp.wpStartMonth !== '') ||
                (wp.wpEndMonth && wp.wpEndMonth !== '') ||
                (wp.deliverables && wp.deliverables.length > 0);
        });

        console.log('Filtered work packages for saving:', filteredData);
        console.log('Original work packages count:', objData.length, 'Filtered count:', filteredData.length);

        // If no valid work packages exist, don't proceed with saving
        if (filteredData.length === 0) {
            console.log('No valid work packages to save');
            return;
        }

        for (var i = 0; i < filteredData.length; i++) {
            var wp = filteredData[i];
            var count = 0;
            if (wp.AccountList) {
                for (var k = 0; k < wp.AccountList.length; k++) {
                    if (wp.AccountList[k].selected == true) {
                        count = count + 1;
                    }
                }
            }
            if ($rootScope.secondStage == true) {
                if (count <= 0) {
                    swal("Work Package Details", "Please select at least one partner for " + wp.wpSequence, "info");
                    return;
                }
                if (!wp.title || wp.title === "") {
                    swal("Work Package Details", "Please enter title for " + wp.wpSequence, "info");
                    return;
                }
                if (!wp.trlFrom || wp.trlFrom === "") {
                    swal("Work Package Details", "Please select TRL From for " + wp.wpSequence, "info");
                    return;
                }
                if (!wp.trlTo || wp.trlTo === "") {
                    swal("Work Package Details", "Please select TRL To for " + wp.wpSequence, "info");
                    return;
                }
                if (parseInt(wp.trlTo) < parseInt(wp.trlFrom)) {
                    swal("Work Package Details", "TRL To must be >= TRL From for " + wp.wpSequence, "info");
                    return;
                }
                if (!wp.wpStartMonth || wp.wpStartMonth === "") {
                    swal("Work Package Details", "Please enter WP Start Month for " + wp.wpSequence, "info");
                    return;
                }
                if (!wp.wpEndMonth || wp.wpEndMonth === "") {
                    swal("Work Package Details", "Please enter WP End Month for " + wp.wpSequence, "info");
                    return;
                }
                if (parseInt(wp.wpEndMonth) < parseInt(wp.wpStartMonth)) {
                    swal("Work Package Details", "WP End Month must be >= WP Start Month for " + wp.wpSequence, "info");
                    return;
                }
                if (wp.deliverables && wp.deliverables.length > 0) {
                    for (var j = 0; j < wp.deliverables.length; j++) {
                        var deliv = wp.deliverables[j];
                        if (!deliv.title || deliv.title === "") {
                            swal("Deliverable Details", "Please enter title for " + deliv.deliverableSequence, "info");
                            return;
                        }
                        if (!deliv.startMonth || deliv.startMonth === "") {
                            swal("Deliverable Details", "Please enter Start Month for " + deliv.deliverableSequence, "info");
                            return;
                        }
                        if (!deliv.endMonth || deliv.endMonth === "") {
                            swal("Deliverable Details", "Please enter End Month for " + deliv.deliverableSequence, "info");
                            return;
                        }
                        if (parseInt(deliv.startMonth) < parseInt(wp.wpStartMonth)) {
                            swal("Validation Error", "Deliverable Start Month must be >= WP Start Month for " + deliv.deliverableSequence, "error");
                            return;
                        }
                        if (parseInt(deliv.endMonth) > parseInt(wp.wpEndMonth)) {
                            swal("Validation Error", "Deliverable End Month must be <= WP End Month for " + deliv.deliverableSequence, "error");
                            return;
                        }
                        if (parseInt(deliv.endMonth) < parseInt(deliv.startMonth)) {
                            swal("Deliverable Details", "End Month must be >= Start Month for " + deliv.deliverableSequence, "info");
                            return;
                        }
                    }
                }
            }
        }
        var dataToSend = [];
        for (var i = 0; i < filteredData.length; i++) {
            var wp = filteredData[i];
            var accountWrapperList = [];
            if (wp.AccountList) {
                for (var k = 0; k < wp.AccountList.length; k++) {
                    var acc = wp.AccountList[k];
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
            var deliverablesList = [];
            if (wp.deliverables && wp.deliverables.length > 0) {
                for (var j = 0; j < wp.deliverables.length; j++) {
                    var deliv = wp.deliverables[j];
                    deliverablesList.push({
                        Id: deliv.Id || '',
                        deliverableSequence: deliv.deliverableSequence,
                        title: deliv.title,
                        startMonth: String(deliv.startMonth),
                        endMonth: String(deliv.endMonth),
                        externalId: deliv.externalId
                    });
                }
            }
            dataToSend.push({
                Id: wp.Id || '',
                wpSequence: wp.wpSequence,
                title: wp.title,
                trlFrom: String(wp.trlFrom),
                trlTo: String(wp.trlTo),
                wpStartMonth: String(wp.wpStartMonth),
                wpEndMonth: String(wp.wpEndMonth),
                externalId: wp.externalId,
                AccountListWrapper: accountWrapperList,
                deliverables: deliverablesList
            });
        }
        ApplicantPortal_Contoller.saveWPWithDeliverables(dataToSend, $rootScope.proposalId, $rootScope.stage, function (result, event) {
            if (event.status) {
                if (result === 'success') {
                    //Swal.fire('Success', 'Work Packages and Deliverables saved successfully!', 'success');
                    $scope.loadWPDeliverablesData();

                    // Update Gantt chart with saved data
                    setTimeout(function () {
                        $scope.updateGanttChart();
                    }, 300);

                } else {
                    swal("Error", "Failed to save Work Packages and Deliverables: " + result, "error");
                }
                $scope.$applyAsync();
            } else {
                console.error('Error saving WP + Deliverables:', event.message);
                swal("Error", "Failed to save. Please try again.", "error");
            }
        });
    };

});



// Global function to initialize Gantt Chart from Angular controller
function initializeGanttChartFromAngular(proposalId) {
    console.log('=== INITIALIZING GANTT CHART FROM ANGULAR ===');
    console.log('Proposal ID from Angular:', proposalId);

    if (!proposalId) {
        console.error('No proposal ID provided to initializeGanttChartFromAngular');
        return;
    }

    try {
        $Lightning.use("c:GanttChartApp", function () {
            console.log('Lightning Out app loaded successfully from Angular');

            $Lightning.createComponent(
                "c:ganttChartWrapper",
                { recordId: proposalId },
                "ganttChartContainer",
                function (component) {
                    console.log("Gantt Chart component loaded successfully from Angular:", component);

                    // Hide loading message
                    const container = document.getElementById('ganttChartContainer');
                    if (container) {
                        const loadingDiv = container.querySelector('div[style*="Loading Gantt Chart"]');
                        if (loadingDiv) {
                            loadingDiv.style.display = 'none';
                        }
                    }
                }
            );
        }, function (err) {
            console.error('Lightning Out app failed to load from Angular:', err);

            // Show error message
            const container = document.getElementById('ganttChartContainer');
            if (container) {
                container.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100%; color: red;"><div><i class="fas fa-exclamation-triangle me-2"></i>Failed to load Gantt Chart from Angular. Please check console for details.</div></div>';
            }
        });
    } catch (error) {
        console.error("Error initializing Lightning Out from Angular:", error);
    }
}