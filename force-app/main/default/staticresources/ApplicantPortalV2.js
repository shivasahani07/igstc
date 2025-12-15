var workingDaysValues = [];
var siteURL;
var candidateId;
var gender;
var country;
var nationality;
var available_followship;
var associated_with_igstc;
var profilePicURL;
var isCoordinator;
var partnerSubmission;

var app = angular.module('cp_app');
debugger;
var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/Testing';    // ======================>
app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('');
    var rp = $routeProvider;

    for (var i = 0; i < tabValues.length; i++) {
        var pageName = '/' + tabValues[i].Name;

        if (tabValues[i].Apex_class_Name__c != undefined) {
            rp.when(pageName, {

                templateUrl: sitePrefix + pageName,
                controller: tabValues[i].Apex_class_Name__c
            });
        } else {
            rp.when(pageName, {
                templateUrl: sitePrefix + pageName,
            })
        }

    }
});
app.filter('specialChar', function () {
    return function (input) {
        return input ? input.replace(/&amp;/g, '&').replace(/&#39;/g, '\'').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : input;
    }
});

function wysiwygeditor($scope) {
    $scope.orightml = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li style="color: green;">Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE8+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>';
    $scope.htmlcontent = $scope.orightml;
    $scope.disabled = false;
};

app.controller('cp_dashboard_ctrl', function ($scope, $rootScope, $timeout, $window, $location, $element) {
    $scope.config = {};
    debugger;
    $scope.isLoading = false;
    
    // FIX: Initialize isRoutedView immediately based on current path
    // This ensures route detection happens before function execution
    $rootScope.isRoutedView = $location.path() !== '' && $location.path() !== '/';
    
    // Also update on location change for navigation
    $scope.$on('$locationChangeSuccess', function () {
        $scope.$evalAsync(function () {
            $rootScope.isRoutedView = $location.path() !== '' && $location.path() !== '/';
        });
    });
    
    $scope.load = function () {
        const hashCode = localStorage.getItem('hashCode');
        if (hashCode == null || hashCode == '') {
            window.location.href = window.location.href.includes('/apex') ? '/apex' : '/Testing';
            history.pushState(null, null, window.location.href);
        }
    };
    $scope.load();
    $scope.selectedMenu = 'Programs';

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
    $scope.configg = {
        options: "",
        trackBy: 'Id',
        displayBy: ['Name'],
        multiSelect: true,
        preSelectItem: true,
        preSelectAll: false
    };
    $scope.allPrograms = [];
    $scope.appliedPrograms = [];
    $scope.config.removeButtons = 'BGColor,Anchor,Subscript,Superscript,Paste,Copy,Cut,Undo,Redo';
    $rootScope.countrytype = countrytype;
    $rootScope.campaignId;
    $rootScope.countryCode = countryCode;
    $rootScope.availingFellowship = availingFellowship;
    $rootScope.pairedApplicant = pairedApplicant;
    $rootScope.participantType = participantType;
    $rootScope.bankType = bankType;
    $rootScope.participatingWorkshop = participatingWorkshop;
    $rootScope.presentingWorkshop = presentingWorkshop;
    $rootScope.candidateId = candidateId;
    $rootScope.campaigntype = campaigntype;
    $rootScope.siteURL = siteURL;
    $rootScope.profilePicURL = profilePicURL;
    $rootScope.thematicAreaList = thematicAreaList;
    $rootScope.gender = gender;

    $rootScope.proposalId = '';
    $rootScope.yearlyCallId = '';

    $rootScope.currencyPickList = currencyPickList;
    //  $rootScope.accList = accList;
    $rootScope.country = country;
    $rootScope.nationality = nationality;
    $rootScope.available_followship = available_followship;
    $rootScope.associated_with_igstc = associated_with_igstc;
    $rootScope.applicantName = applicantName;
    $rootScope.applicantEmail = applicantEmail;
    $rootScope.isPrimaryContact = isPrimaryContact;
    $rootScope.accountId = accountId;
    $rootScope.natureOfThesisWork = natureOfThesisWork;
    $rootScope.natureOfPhDWork = natureOfPhDWork;
    $rootScope.percentCGPA = percentCGPA;
    $rootScope.states = states;
    $rootScope.signDate = signDate;
    $rootScope.secondStage = false;

    $scope.applicantAssociationListData;
    $scope.contactName;

    //**********************Added BY Karthik For Dropdown
    $scope.yearList = yearList;
    $scope.selectedYear = null;
    $scope.selectedYearId = null;
    debugger

    // Find current active year
    $scope.currentYear = $scope.yearList.find(function (y) {
        return y.Is_Active__c && y.Is_Current_Year__c;
    });
    debugger

    // Set default selected year to current active year
    if ($scope.currentYear) {
        $scope.selectedYear = $scope.currentYear.Id;  // Store Id for ng-model binding
        $scope.selectedYearId = $scope.currentYear.Id; // Store Id for Apex call
        console.log('Default Selected Year Id:', $scope.selectedYearId);
    } else if ($scope.yearList && $scope.yearList.length > 0) {
        // If no current year, select first year
        $scope.selectedYear = $scope.yearList[0].Id;
        $scope.selectedYearId = $scope.yearList[0].Id;
        console.log('Default Selected Year Id (first year):', $scope.selectedYearId);
    }
    debugger

    $scope.onYearChange = function (selectedYearValue) {
        debugger;
        // Get the selected year value passed as parameter from ng-change
        // If parameter is not provided, fallback to scope variable
        var yearId = selectedYearValue || $scope.selectedYear;

        console.log("onYearChange triggered");
        console.log("Year passed as parameter:", selectedYearValue);
        console.log("Year from scope:", $scope.selectedYear);
        console.log("YearId to use:", yearId);
        console.log("Previous selectedYearId:", $scope.selectedYearId);

        // Update selectedYearId with the newly selected year
        if (yearId) {
            // Ensure we're using the new value
            $scope.selectedYearId = yearId;
            $scope.selectedYear = yearId; // Keep in sync
            console.log("Updated selectedYearId to:", $scope.selectedYearId);

            // Call Apex method with the newly selected year Id directly
            // Pass the yearId as parameter to ensure we use the correct value
            $scope.getApplicantData(yearId);
        } else {
            console.warn("No year selected, clearing data");
            $scope.selectedYearId = null;
            $scope.selectedYear = null;
            $scope.allPrograms = [];
            $scope.appliedPrograms = [];
        }
    };

    //*********************Added BY Karthik For Dropdown


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

    $rootScope.contactId = contactId;
    $rootScope.projectId = '';
    $rootScope.campaignName = '';
    $rootScope.isCoordinator = isCoordinator;
    $rootScope.partnerSubmission = partnerSubmission;
    $rootScope.secondstage = false;
    $rootScope.emailVerified;
    $rootScope.proposalStage = false;

    CKEDITOR.addCss('border:solid 1px red !important;');

    // FIX: Add conditional check to skip execution on routed views (child pages)
    $scope.getContactName = function () {
        // Skip if on a routed view (child page)
        if ($rootScope.isRoutedView) {
            return;
        }
        debugger;

        //$scope.isLoading = true;
        ApplicantPortal_Contoller.getContactName($scope.candidateId, function (result, event) {
            if (event.status && result != null) {
                $rootScope.contactName = result;
            }
        });
    }
    $scope.getContactName();

    // *******************************************************************************    
    //Added By karthik

    function isPastDate(dateStr) {
        if (!dateStr) return false; // treat no date as not expired
        var d = new Date(dateStr);
        if (isNaN(d)) return false;
        var today = new Date();
        d.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        return d < today;
    }

    // FIX: Add conditional check to skip execution on routed views (child pages)
    $scope.getApplicantData = function (yearIdParam) {
        // Skip if on a routed view (child page)
        if ($rootScope.isRoutedView) {
            return;
        }

        // Use parameter if provided, otherwise use scope variable
        var yearIdToUse = yearIdParam || $scope.selectedYearId;

        // Ensure we have a year selected before making the call
        if (!yearIdToUse) {
            console.warn('No year selected, cannot fetch applicant data');
            return;
        }

        console.log('getApplicantData called with yearId:', yearIdToUse);
        $scope.isLoading = true;
        ApplicantPortal_Contoller.getApplicantData($scope.candidateId, yearIdToUse, function (result, event) {
            debugger
            if (event.status && result != null) {
                $scope.allCamapigns = result.campaignList; // Campaigns in this YearlyCall__c 
                $scope.appliedCampaigns = result.appliedCampaign;

                // Applied programs 
                $scope.appliedPrograms = $scope.appliedCampaigns ? $scope.appliedCampaigns.map(item => ({
                    name: item?.Proposals__r?.Campaign__r?.Name ?? "",
                    PropName: item?.Proposals__r?.Name ?? "",
                    desc: item?.Proposals__r?.Campaign__r?.Description ?? "",
                    deadline: item.Proposals__r?.yearly_Call__r?.Campaign_End_Date__c ?
                        new Date(item.Proposals__r?.yearly_Call__r?.Campaign_End_Date__c).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }) : 'Not mentioned',
                    icon: item.Proposals__r?.Campaign__r?.Icon__c ?? "",
                    redirectUrl:'Testing',
                    campaignId: item?.Proposals__r?.Campaign__r?.Id ?? "",
                    proposalId: item?.Proposals__c ?? "",
                    apaId: item?.Id ?? "",
                    yearlyCallId: item?.Proposals__r?.yearly_Call__c ?? "",
                    category: 'applied'
                })) : [];

                // Simple helper for YearlyCall__c → Campaign data              
                function getCampaignData(item) {
                    var rawDeadline = item.Campaign_End_Date__c || null;
                    return {
                        name: item.Campaign__r?.Name ?? "",
                        desc: item.Campaign__r?.Description ?? "",
                        deadline: rawDeadline ?
                            new Date(rawDeadline).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            }) : 'Not mentioned',
                        icon: item.Campaign__r?.Icon__c ?? "",
                        redirectUrl: item.Campaign__r?.RedirectPage__c ?? "",
                        campaignId: item.Campaign__r?.Id ?? "",
                        yearlyCallId: item.Id,
                        yearlyCall: item.Name,
                        isExpired: isPastDate(rawDeadline)
                    };
                }


                if (!$scope.appliedPrograms.length) {
                    $scope.allPrograms = $scope.allCamapigns.map(item => ({
                        ...getCampaignData(item),
                        proposalId: '',
                        category: 'not applied'
                    }));
                } else {
                    const appliedCampaignIds = new Set(
                        $scope.appliedPrograms.filter(a => a.campaignId).map(a => a.campaignId)
                    );

                    $scope.allPrograms = $scope.allCamapigns
                        .filter(item => {
                            const campaignId = item.Campaign__r?.Id;
                            return campaignId && !appliedCampaignIds.has(campaignId);
                        })
                        .map(item => ({
                            ...getCampaignData(item),
                            proposalId: '',
                            category: 'not applied'
                        }));
                }

                $scope.isLoading = false;
                $scope.$apply();
            } else {
                $scope.isLoading = false;
                $scope.$apply();
            }
        }, { escape: true });
    };

    // Call getApplicantData on initial load if year is selected
    if ($scope.selectedYearId) {
        $scope.getApplicantData();
    }

    //************************************************************************************************** */
    $scope.redirectToForm = function (val) {
        debugger;
        if (val.category == 'applied' && (val.proposalId != undefined || val.proposalId != '')) {
            localStorage.setItem('proposalId', val.proposalId);
            localStorage.setItem('yearlyCallId', val.yearlyCallId);
            localStorage.setItem('apaId', val.apaId);
            const proposalData = $scope.proposalWrapperList.find(item => item.Id == val.proposalId);
            $rootScope.proposalId = proposalData.Id;
            if (proposalData.stage == "1st Stage") {
                $rootScope.secondStage = false;
            } else {
                $rootScope.secondStage = true;
            }
            if (proposalData.stage == '' || proposalData.stage == undefined) {
                $rootScope.secondStage = false;
            }
            if (proposalData.proposalStage != "Draft" || (proposalData.proposalStage == "Draft" && partnerSubmission == "true")) {
                // if(proposalStage != "Draft"){
                $rootScope.proposalStage = true;
                CKEDITOR.config.readOnly = true;
            } else {
                $rootScope.proposalStage = false;
            }
            if (proposalData.proposalStage == undefined || proposalData.proposalStage == '') {
                $rootScope.proposalStage = false;
                CKEDITOR.config.readOnly = false;
            }
        } else {
            $rootScope.secondStage = false;
            localStorage.setItem('yearlyCallId', val.yearlyCallId);
        }
        $rootScope.campaignId = val.campaignId;
        $location.path('/' + val.redirectUrl);
    }

    $scope.showSection = function (menu) {
        $scope.selectedMenu = menu;
    };

    $scope.logout = function () {
        // Redirect to login page after logout
        debugger;
        $scope.isLoading = true;
        ApplicantPortal_Contoller.LogoutApplicant($rootScope.candidateId, function (result, event) {
            debugger;
            if (event.status && result === 'Success') {
                localStorage.setItem('hashCode', '');
                window.location.href = 'https://indo-germansciencetechnologycentre--newdevutil.sandbox.my.salesforce-sites.com/Testing/';
                $scope.isLoading = false;
            } else if (result === 'Error') {
                window.location.href = 'https://indo-germansciencetechnologycentre--newdevutil.sandbox.my.salesforce-sites.com/Testing/';
                $scope.isLoading = false;
            } else {
                alert('Error logging Out!');
                console.log('Error ---> ' + event.message);
                $scope.isLoading = false;
            }
            $scope.$apply();
        });
    };


});

