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
var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard';    // ======================>
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

app.controller('cp_dashboard_ctrl', function ($scope, $rootScope, $timeout, $window, $location, $element, $sce) {
    $scope.config = {};
    debugger;
    $scope.isLoading = false;

    // Helper function to check if current route is the dashboard route
    // Only dashboard routes should load getContactName() and getApplicantData()
    var isDashboardRoute = function () {
        var path = $location.path();
        // Dashboard routes: empty path, root path, or /Home
        return path === '' || path === '/' || path === '/Home';
    };

    // Helper function to check if current route should skip dashboard functions
    // Returns true if NOT on dashboard route (i.e., on any child/routed page)
    var shouldSkipDashboardFunctions = function () {
        return !isDashboardRoute();
    };
    console.log('shiva----', $rootScope.proposalStage)
    // Initialize isRoutedView immediately based on current path
    $rootScope.isRoutedView = $location.path() !== '' && $location.path() !== '/';

    $scope.$on('$locationChangeSuccess', function () {
        $scope.$evalAsync(function () {
            $rootScope.isRoutedView = $location.path() !== '' && $location.path() !== '/';
            // Re-initialize secondStage when route changes (in case proposalId changes)
            $scope.initializeSecondStageFromStorage();
        });
    });
    $scope.load = function () {
        const hashCode = localStorage.getItem('hashCode');
        if (hashCode == null || hashCode == '') {
            window.location.href = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard';
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
    $scope.allCamapigns = []; // Initialize to prevent errors when no campaigns exist
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
    //$rootScope.apaId='';

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
    $scope.showUserDropdown = false;
    $scope.userEmail = '';
    $scope.userProfilePicId = null;
    $scope.profilePicUrl = '';

    // ----------- Apply Button Popup Code - Start ------------ //
    $scope.showDocumentPopup = false;
    $scope.showWhatToExpectPopup_2Plus2 = false;
    $scope.showWhatToExpectPopup_WISER = false;
    $scope.showWhatToExpectPopup_PECFAR = false;
    $scope.showWhatToExpectPopup_IF = false;
    $scope.selectedProgram = null;
    $rootScope.userSelectedRML = false;
    $rootScope.userSelectedDSA = false;

    $scope.openWhatToExpectPopup = function (p) {
        debugger;
        console.log('-------------- openWhatToExpectPopup --------------');
        $scope.selectedProgram = p;
        console.log('selectedProgram ===> ', $scope.selectedProgram);

        if (p.name === '2+2 Call') {
            $scope.showWhatToExpectPopup_2Plus2 = true;
        }
        else if (p.name === 'WISER') {
            $scope.showWhatToExpectPopup_WISER = true;
        }
        else if (p.name === 'PECFAR') {
            $scope.showWhatToExpectPopup_PECFAR = true
        }
        else if (p.name === 'Industrial Fellowships') {
            $scope.showWhatToExpectPopup_IF = true;
        }
        else {
            $scope.redirectToForm(p);
        }

    }

    $scope.closeWhatToExpectPopup = function () {
        $scope.showWhatToExpectPopup_2Plus2 = false;
        $scope.showWhatToExpectPopup_WISER = false;
        $scope.showWhatToExpectPopup_PECFAR = false;
        $scope.showWhatToExpectPopup_IF = false
    };

    $scope.openDocumentPopup = function (p) {
        debugger;
        console.log(' ----------- openDocumentPopup ------------ : ', p);

        if (p.name === '2+2 Call') {
            $scope.selectedProgram = p;
            $scope.showDocumentPopup = true;
        } else {
            $scope.redirectToForm(p);
        }
    }

    // $scope.openDocumentPopup = function (p) {
    //     debugger;
    //     console.log(' ----------- openDocumentPopup ------------ : ', p)
    //     $scope.selectedProgram = p;
    //     $scope.showDocumentPopup = true;
    // };

    $scope.cancelPopup = function () {
        debugger;
        $scope.showDocumentPopup = false;
    }

    $scope.dontShowAgain = function () {
        debugger;

        $rootScope.userSelectedDSA = true;
        localStorage.setItem('userPopupChoice', 'DAA');

        // Save the choice to the proposal
        ApplicantPortal_Contoller.saveUserPopupChoice($rootScope.proposalId, 'DAA', function (result, event) {
            if (event.status && result) {
                console.log('Popup choice DAA saved successfully');
            } else {
                console.error('Failed to save popup choice DAA');
            }
        });

        $scope.redirectToForm($scope.selectedProgram);
    };

    $scope.remindMeLater = function () {
        debugger;

        $rootScope.userSelectedRML = true;
        localStorage.setItem('userPopupChoice', 'RML');
        //$scope.showDocumentPopup = false;

        // Save the choice to the proposal
        ApplicantPortal_Contoller.saveUserPopupChoice($rootScope.proposalId, 'RML', function (result, event) {
            if (event.status && result) {
                console.log('Popup choice RML saved successfully');
            } else {
                console.error('Failed to save popup choice RML');
            }
        });
        $scope.redirectToForm($scope.selectedProgram);
    };
    // ----------- Apply Button Popup Code - Finish ;------------ //

    // Toggle user dropdown menu
    $scope.toggleUserDropdown = function (event) {
        if (event) {
            event.stopPropagation();
        }
        $scope.showUserDropdown = !$scope.showUserDropdown;
    };

    // Close dropdown when clicking outside
    $scope.$on('$locationChangeSuccess', function () {
        $scope.showUserDropdown = false;
    });

    // Close dropdown when clicking outside (document click handler)
    angular.element(document).on('click', function (event) {
        if ($scope.showUserDropdown && !angular.element(event.target).closest('.user-profile-dropdown').length) {
            $scope.$apply(function () {
                $scope.showUserDropdown = false;
            });
        }
    });

    // Get user email and profile picture
    $scope.getUserDetails = function () {
        const hashCode = localStorage.getItem('hashCode');
        if (!hashCode) {
            console.error('hashCode not found in localStorage');
            // Use existing data if available
            $scope.userEmail = $rootScope.applicantEmail || '';
            return;
        }
        // Skip remote action if on a routed view (e.g., ProjectDetail, Consortia, etc.)
        if (shouldSkipDashboardFunctions()) {
            $scope.userEmail = $rootScope.applicantEmail || '';
            return;
        }

        ApplicantPortal_Contoller.getUserDetails(hashCode, function (result, event) {
            if (event.status && result != null) {
                $scope.userEmail = result.email || $rootScope.applicantEmail || '';
                $scope.userProfilePicId = result.profilePicId || null;

                if ($scope.userProfilePicId) {
                    var baseURL = window.location.origin;
                    $scope.profilePicUrl = baseURL + '/ApplicantDashboard/servlet/servlet.FileDownload?file=' + $scope.userProfilePicId;
                }
                $scope.$apply();
            } else {
                // Fallback to existing data
                $scope.userEmail = $rootScope.applicantEmail || '';
            }
        });
    };

    // Navigate to reset password page
    $scope.navigateToResetPassword = function () {
        var baseURL = window.location.origin;
        var resetPasswordUrl = baseURL + '/ApplicantDashboard/PortalResetPassword';
        window.location.href = resetPasswordUrl;
    };

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

    // Function to set secondStage from localStorage proposalId on page load/refresh
    // This ensures secondStage is set even when redirectToForm doesn't run (e.g., on page refresh)
    $scope.initializeSecondStageFromStorage = function () {
        var proposalIdFromStorage = localStorage.getItem('proposalId');
        if (proposalIdFromStorage && $scope.proposalWrapperList && $scope.proposalWrapperList.length > 0) {
            const proposalData = $scope.proposalWrapperList.find(item => item.Id == proposalIdFromStorage);
            if (proposalData) {
                // Set proposalId in rootScope if not already set
                if (!$rootScope.proposalId) {
                    $rootScope.proposalId = proposalData.Id;
                }

                // Determine if it's second stage
                if (proposalData.stage == "1st Stage") {
                    $rootScope.secondStage = false;
                } else if (proposalData.stage == "2nd Stage" || proposalData.stage == "2nd stage" || proposalData.stage == "2ndStage") {
                    $rootScope.secondStage = true;
                } else {
                    $rootScope.secondStage = false;
                }

                if (proposalData.stage == '' || proposalData.stage == undefined) {
                    $rootScope.secondStage = false;
                }

                // Set proposalStage as well
                if (proposalData.proposalStage != "Draft" || (proposalData.proposalStage == "Draft" && partnerSubmission == "true")) {
                    $rootScope.proposalStage = true;
                    if (typeof CKEDITOR !== 'undefined' && CKEDITOR.config) {
                        CKEDITOR.config.readOnly = true;
                    }
                } else {
                    $rootScope.proposalStage = false;
                }
                if (proposalData.proposalStage == undefined || proposalData.proposalStage == '') {
                    $rootScope.proposalStage = false;
                    if (typeof CKEDITOR !== 'undefined' && CKEDITOR.config) {
                        CKEDITOR.config.readOnly = false;
                    }
                }

                console.log('Initialized secondStage from localStorage:', $rootScope.secondStage, 'for proposal:', proposalIdFromStorage);
            }
        }
    };

    // Call this function on controller initialization to set secondStage on page load/refresh
    $scope.initializeSecondStageFromStorage();

    // if(secondstage == "1st Stage"){
    //     $rootScope.secondStage = false;
    // }else{
    //     $rootScope.secondStage = true;
    // }
    // if(secondstage == '' || secondstage == undefined){
    //     $rootScope.secondStage = false;
    // }

    $rootScope.contactId = contactId;
    $rootScope.projectId = '';
    $rootScope.campaignName = '';
    $rootScope.isCoordinator = isCoordinator;
    $rootScope.partnerSubmission = partnerSubmission;
    $rootScope.secondstage = false;
    $rootScope.emailVerified;
    $rootScope.proposalStage = false;
    // if(secondstage == "2nd Stage"){
    //     $rootScope.secondstage = true;
    // }else{
    //     $rootScope.secondstage = false;
    // }

    //added by Aman 4th September
    // Desc: to account for Per partner submission.
    // if(proposalStage != "Draft" || (proposalStage == "Draft" && partnerSubmission == "true")){
    //     // if(proposalStage != "Draft"){
    //     $rootScope.proposalStage = true;
    //     CKEDITOR.config.readOnly = true;
    // }else{
    //     $rootScope.proposalStage = false;
    // }
    // if(proposalStage==undefined || proposalStage==''){
    //     $rootScope.proposalStage = false;
    //     CKEDITOR.config.readOnly = false;
    // }
    //  CKEDITOR.replace( 'Resolution', {
    //     height: 800
    // } );
    //  $scope.checkCampaign = function(){
    //     debugger;
    //     if($rootScope.campaigntype.toUpperCase() != $scope.programmeHeaderName){
    //         swal(
    //             '',
    //             'incorrect',
    //             'error'
    //         );
    //         if($rootScope.campaigntype == "pecfar"){
    //             var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=Landing_Page_Pecfar';
    //             setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);
    //         }
    //         if($rootScope.campaigntype == "wiser"){
    //             var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=LANDING_PAGE_WISER';
    //             setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);
    //         }
    //         if($rootScope.campaigntype == "if"){
    //             var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=Landing_Page_Industrial_Fellowship';
    //             setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);
    //         }
    //         if($rootScope.campaigntype == "sing"){
    //             var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=LANDING_PAGE_SING';
    //             setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);
    //         }
    //         if($rootScope.campaigntype == "workshop"){
    //             var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=Landing_Page_Workshop';
    //             setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);
    //         }
    //         if($rootScope.campaigntype == "2plus2"){
    //             var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=Landing_Page_Two_Plus_Two';
    //             setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);
    //         }
    //         return;
    //     }else{
    //     }
    // }
    // $scope.checkCampaign();

    CKEDITOR.addCss('border:solid 1px red !important;');
    // $scope.redirect = function(){
    //     debugger;
    //     if($scope.res == "workshop"){
    //         var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=Landing_Page_Workshop';
    //         setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);

    //     }else if($scope.res == "pecfar"){
    //         var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=Landing_Page_Pecfar';
    //         setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);

    //     }else if($scope.res == "if"){
    //         var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=Landing_Page_Industrial_Fellowship';
    //         setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);

    //     }
    //     else if($scope.res == "sing"){
    //         var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=LANDING_PAGE_SING';
    //         setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);

    //     }
    //     else if($scope.res == "wiser"){
    //         var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=LANDING_PAGE_WISER';
    //         setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);

    //     }
    //     else if($scope.res == "2plus2"){
    //         var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=Landing_Page_Two_Plus_Two';
    //         setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);
    //     }
    //     else if($scope.res == "connect"){
    //         var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=Landing_Page_CONNECT_PLUS';
    //         setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);
    //     }

    //         var sitePrefix; 
    //         // switch($rootScope.CampainURL.toUpperCase()){
    //         //         case 'if':
    //         //             sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/?campaign=Landing_Page_Industrial_Fellowship';
    //         //             break;
    //         //         case 'pecfar':
    //         //             sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/?campaign=Landing_Page_Pecfar';
    //         //             break;
    //         //         case 'workshop':
    //         //             sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/?campaign=Landing_Page_Workshop';
    //         //             break;
    //         //         case '2plus2':
    //         //             sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/?campaign=Landing_Page_Two_Plus_Two';
    //         //             break;
    //         //         case 'wiser':
    //         //             sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/?campaign=LANDING_PAGE_WISER';
    //         //             break;
    //         //         case 'sing':
    //         //             sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/?campaign=LANDING_PAGE_SING';
    //         //             break;
    //         //             // default:
    //         //             //     sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/?campaign=Landing_Page_Industrial_Fellowship';
    //         //             //     break;
    //         // }  
    //         // window.location.replace(window.location.origin +sitePrefix);
    // }
    // $scope.LogoutApplicant=function(){        
    //     ApplicantPortal_Contoller.LogoutApplicant($rootScope.candidateId, function (result, event) {
    //         debugger
    //         console.log(result);
    //         console.log(event);
    //         if(event.status){
    //             $rootScope.applicantEmail='';
    //             $rootScope.applicantName='';
    //             $rootScope.campaignId = '';
    //             $scope.res=result;
    //             $scope.redirect();
    //             $scope.$apply();
    //         }
    //     });   
    // }

    $scope.getContactName = function () {
        // Always load contact name for global header (visible on all pages)
        // No need to skip - contactName should be available everywhere
        debugger;
        if (localStorage.getItem('applicantName')) {
            $rootScope.contactName = localStorage.getItem('applicantName');
        }
        console.log($rootScope.proposalStage + 'proposalStage');
        // Skip if on a routed view that should not load dashboard functions
        if (shouldSkipDashboardFunctions()) {
            return;
        }
        // Use hashCode from localStorage (required by getContactName method)
        const hashCode = localStorage.getItem('hashCode');
        if (!hashCode) {
            console.error('hashCode not found in localStorage, cannot fetch contact name');
            return;
        }

        //$scope.isLoading = true;
        ApplicantPortal_Contoller.getContactName(hashCode, function (result, event) {
            if (event.status && result != null) {
                $rootScope.contactName = result;
                localStorage.setItem('applicantName', result);
            }
        });
    }
    $scope.getContactName();
    $scope.getUserDetails();

    /*$scope.getApplicantData = function () {
        debugger;
        $scope.isLoading = true;
        ApplicantPortal_Contoller.getApplicantData($scope.candidateId, function (result, event) {
            debugger;
            if (event.status && result != null) {
                debugger;
                console.log('campaign::=>');
                console.log(result);
                $scope.allCamapigns = result.campaignList;
                $scope.appliedCampaigns = result.appliedCampaign;

                $scope.appliedPrograms = $scope.appliedCampaigns ? $scope.appliedCampaigns.map(item => {
                    return {
                        name: item?.Proposals__r?.Campaign__r?.Name ?? "",
                        desc: item?.Proposals__r?.Campaign__r?.Description ?? "",
                        deadline: item.Proposals__r?.Campaign__r?.Actual_End_Date__c ? new Date(item.Proposals__r?.Campaign__r?.Actual_End_Date__c).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }) : 'Not mentioned',
                        icon: item.Proposals__r?.Campaign__r?.Icon__c ?? "",
                        redirectUrl: item?.Proposals__r?.Campaign__r?.RedirectPage__c ?? "",
                        campaignId: item?.Proposals__r?.Campaign__r?.Id ?? "",
                        proposalId: item?.Proposals__c ?? "",
                        category: 'applied'
                    }
                }) : [];

                if (!$scope.appliedPrograms || !$scope.appliedPrograms.length) {
                    // If no applied programs → keep all campaigns
                    $scope.allPrograms = $scope.allCamapigns.map(item => ({
                        name: item.Name,
                        desc: item.Description,
                        deadline: item.Actual_End_Date__c
                            ? new Date(item.Actual_End_Date__c).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            })
                            : 'Not mentioned',
                        icon: item.Icon__c,
                        redirectUrl: item.RedirectPage__c,
                        campaignId: item.Id,
                        proposalId: '',
                        category: 'not applied'
                    }));
                } else {
                    // Build a Set of applied program names
                    const appliedNames = new Set(
                        $scope.appliedPrograms
                            .filter(a => a && a.name) // safety filter
                            .map(a => a.name)
                    );

                    // Exclude already applied campaigns
                    $scope.allPrograms = $scope.allCamapigns
                        .filter(item => !appliedNames.has(item.Name)) // not equal condition
                        .map(item => ({
                            name: item.Name,
                            desc: item.Description,
                            deadline: item.Actual_End_Date__c
                                ? new Date(item.Actual_End_Date__c).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                })
                                : 'Not mentioned',
                            icon: item.Icon__c,
                            redirectUrl: item.RedirectPage__c,
                            campaignId: item.Id,
                            category: 'not applied'
                        }));
                }
                $scope.isLoading = false;
                $scope.$apply();
            }
        },
            { escape: true }
        );
    }
    $scope.getApplicantData();*/



    // *******************************************************************************    
    //Added By karthik


    // function isPastDate(dateStr) {
    //     if (!dateStr) return false; // treat no date as not expired
    //     var d = new Date(dateStr);
    //     if (isNaN(d)) return false;
    //     var today = new Date();
    //     d.setHours(0, 0, 0, 0);
    //     today.setHours(0, 0, 0, 0);
    //     return d < today;
    // }

    // OLD FUNCTION BEFORE EXPIRING 2+2 PROGRAM
    // function isPastDate(dateStr) {
    //     // Disable Apply if deadline is null / empty
    //     if (!dateStr) return true;

    //     var d = new Date(dateStr);
    //     if (isNaN(d)) return true;

    //     var today = new Date();
    //     d.setHours(0, 0, 0, 0);
    //     today.setHours(0, 0, 0, 0);

    //     return d < today;
    // }


    function isPastDate(dateTimeStr) {
        // If no deadline → treat as expired (or change to false if you prefer)
        if (!dateTimeStr) return true;

        var deadline = new Date(dateTimeStr);

        if (isNaN(deadline.getTime())) return true;

        // Compare full date + time with current time
        return new Date().getTime() > deadline.getTime();
    }

    // Campaign end date cutoff: treat backend date as end of that day at 5:30 PM IST.
    // 5:30 PM IST = 12:00 UTC, so we set deadline to 12:00 UTC on the end date for consistent comparison.
    // function isPastDate(rawDeadline) {
    //     if (!rawDeadline) return false;

    //     const deadline = new Date(rawDeadline);
    //     if (isNaN(deadline.getTime())) return false;

    //     // Set cutoff to 5:30 PM IST on the deadline date (17:30 IST = 12:00 UTC)
    //     // deadline.setUTCHours(12, 0, 0, 0);
    //     deadline.setUTCHours(10, 40, 0, 0);

    //     return Date.now() > deadline.getTime();
    // }


    $scope.getApplicantData = function (yearIdParam) {
        // Skip if on a routed view that should not load dashboard functions
        if (shouldSkipDashboardFunctions()) {
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
                // Ensure allCamapigns is always an array, even if result.campaignList is null/undefined
                $scope.allCamapigns = (result.campaignList && Array.isArray(result.campaignList)) ? result.campaignList : []; // Campaigns in this YearlyCall__c 
                $scope.appliedCampaigns = result.appliedCampaign;

                console.log('$scope.appliedCampaigns =====> ', $scope.appliedCampaigns);



                // Applied programs 
                // $scope.appliedPrograms = $scope.appliedCampaigns ? $scope.appliedCampaigns.map(item => ({

                //     name: item?.Proposals__r?.Campaign__r?.Name ?? "",
                //     PropName: item?.Proposals__r?.Name ?? "",
                //     //titleOfProject: item?.Contact__r?.Title_Of_Project__c ?? "",
                //     titleOfProject: item?.Proposals__r?.Title_Of__c ?? item?.Contact__r.Title_Of_Project__c ?? "",
                //     desc: item?.Proposals__r?.Campaign__r?.Description ?? "",
                //     deadline: item.Proposals__r?.yearly_Call__r?.Campaign_End_Date__c ?
                //         new Date(item.Proposals__r?.yearly_Call__r?.Campaign_End_Date__c).toLocaleDateString('en-GB', {
                //             day: '2-digit',
                //             month: 'short',
                //             year: 'numeric'
                //         }) : 'Not mentioned',
                //     icon: item.Proposals__r?.Campaign__r?.Icon__c ?? "",
                //     redirectUrl: item?.Proposals__r?.Campaign__r?.RedirectPage__c ?? "",
                //     campaignId: item?.Proposals__r?.Campaign__r?.Id ?? "",
                //     proposalId: item?.Proposals__c ?? "",
                //     apaId: item?.Id ?? "",
                //     yearlyCallId: item?.Proposals__r?.yearly_Call__c ?? "",
                //     proposalStage: item?.Proposals__r?.Proposal_Stages__c ?? "",
                //     category: 'applied',
                //     id: item?.Proposals__r?.Id ?? ""
                //     //isExpiredTwoPlusTwoCall: item.Proposals__r?.Campaign__r?.Id === '7015j00000056SLAAY'

                // })) : [];              

                //********* Applied programs with dynamic deadline and 2+2 specific disable logic *************// 

                $scope.appliedPrograms = $scope.appliedCampaigns ? $scope.appliedCampaigns.map(item => {

                    const campaignName = item?.Proposals__r?.Campaign__r?.Name ?? "";
                    const proposalStage = item?.Proposals__r?.Proposal_Stages__c ?? "";
                    const stage = item?.Proposals__r?.Stage__c ?? "";
                    const firstStageEnd = item?.Proposals__r?.yearly_Call__r?.Campaign_End_Date__c ?? null;
                    const secondStageEnd = item?.Proposals__r?.yearly_Call__r?.Second_Stage_End_Date_Time__c ?? null;

                    let selectedDeadline = null;
                    let disableEdit = false;
                    // Decide which deadline to show
                    if (stage === '2nd Stage') {
                        selectedDeadline = secondStageEnd;
                    } else {
                        selectedDeadline = firstStageEnd;
                    }
                    // Disable logic (ONLY for 2+2 Draft 2nd Stage)
                    if (campaignName === '2+2 Call' && proposalStage === 'Draft' && stage === '2nd Stage' && secondStageEnd) {
                        disableEdit = new Date() > new Date(secondStageEnd);
                    }
                    else {
                        disableEdit = new Date() > new Date(firstStageEnd);
                    }

                    /*const formattedDeadline = selectedDeadline ? new Date(selectedDeadline).toLocaleDateString('en-GB', {
                        timeZone: 'Asia/Kolkata',
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true   // remove if you want AM/PM
                    }).replace('am', 'AM').replace('pm', 'PM') + ' IST'
                        : 'Not mentioned';

                        const formattedFirstStageDeadline = formattedDeadline(firstStageEnd);
                        const formattedSecondStageDeadline = formattedDeadline(secondStageEnd);

                    return {
                        name: campaignName,
                        PropName: item?.Proposals__r?.Name ?? "",
                        titleOfProject: item?.Proposals__r?.Title_Of__c ?? item?.Contact__r?.Title_Of_Project__c ?? "",
                        desc: item?.Proposals__r?.Campaign__r?.Description ?? "",
                        stage: stage,
                        proposalStage: proposalStage,
                        //*******Dynamic deadline based on stage
                        deadline: formattedDeadline,                    
                        icon: item?.Proposals__r?.Campaign__r?.Icon__c ?? "",
                        redirectUrl: item?.Proposals__r?.Campaign__r?.RedirectPage__c ?? "",
                        campaignId: item?.Proposals__r?.Campaign__r?.Id ?? "",
                        proposalId: item?.Proposals__c ?? "",
                        apaId: item?.Id ?? "",
                        yearlyCallId: item?.Proposals__r?.yearly_Call__c ?? "",
                        category: 'applied',
                        id: item?.Proposals__r?.Id ?? "",

                        // Final control flag
                        disableEdit: disableEdit
                    };*/

                    // Format function
                    const formatDateTime = (dateVal) => {
                        return dateVal
                            ? new Date(dateVal).toLocaleString('en-GB', {
                                timeZone: 'Asia/Kolkata',
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            }).replace('am', 'AM').replace('pm', 'PM') + ' IST'
                            : 'Not mentioned';
                    };

                    const formattedFirstStageDeadline = formatDateTime(firstStageEnd);
                    const formattedSecondStageDeadline = formatDateTime(secondStageEnd);

                    return {
                        name: campaignName,
                        PropName: item?.Proposals__r?.Name ?? "",
                        titleOfProject: item?.Proposals__r?.Title_Of__c ?? item?.Contact__r?.Title_Of_Project__c ?? "",
                        desc: item?.Proposals__r?.Campaign__r?.Description ?? "",
                        stage: stage,
                        proposalStage: proposalStage,
                        //NEW FIELDS
                        firstStageDeadline: formattedFirstStageDeadline,
                        secondStageDeadline: formattedSecondStageDeadline,
                        // Keep existing (for other programs)
                        deadline: stage === '2nd Stage' ? formattedSecondStageDeadline : formattedFirstStageDeadline,
                        // FLAG (BEST PRACTICE)
                        isTwoPlusTwo: campaignName === '2+2 Call',
                        icon: item?.Proposals__r?.Campaign__r?.Icon__c ?? "",
                        redirectUrl: item?.Proposals__r?.Campaign__r?.RedirectPage__c ?? "",
                        campaignId: item?.Proposals__r?.Campaign__r?.Id ?? "",
                        proposalId: item?.Proposals__c ?? "",
                        apaId: item?.Id ?? "",
                        yearlyCallId: item?.Proposals__r?.yearly_Call__c ?? "",
                        category: 'applied',
                        id: item?.Proposals__r?.Id ?? "",
                        disableEdit: disableEdit
                    };
                })
                    : [];

                //********* Applied programs with dynamic deadline and 2+2 specific disable logic *************// 

                // Simple helper for YearlyCall__c → Campaign data              
                /*function getCampaignData(item) {
                    var rawDeadline = item.Campaign_End_Date__c || null;
                    return {
                        name: item.Campaign__r?.Name ?? "",
                        desc: item.Campaign__r?.Description ?? "",                        
                        deadline: rawDeadline ?
                            new Date(rawDeadline).toLocaleString('en-GB', {
                                timeZone: 'Asia/Kolkata',
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true   // remove if you want AM/PM
                            }).replace('am', 'AM').replace('pm', 'PM') + ' IST'
                            : 'Not mentioned',
                        icon: item.Campaign__r?.Icon__c ?? "",
                        redirectUrl: item.Campaign__r?.RedirectPage__c ?? "",
                        campaignId: item.Campaign__r?.Id ?? "",
                        yearlyCallId: item.Id,
                        yearlyCall: item.Name,
                        isExpired: isPastDate(rawDeadline)                     
                   };
                 }*/
                function getCampaignData(item) {
                    const campaignName = item.Campaign__r?.Name ?? "";
                    const firstStageEnd = item.Campaign_End_Date__c ?? null;
                    const secondStageEnd = item.Second_Stage_End_Date_Time__c ?? null;
                    const formatDateTime = (dateVal) => {
                        return dateVal
                            ? new Date(dateVal).toLocaleString('en-GB', {
                                timeZone: 'Asia/Kolkata',
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            }).replace('am', 'AM').replace('pm', 'PM') + ' IST'
                            : 'Not mentioned';
                    };

                    const formattedFirstStageDeadline = formatDateTime(firstStageEnd);
                    const formattedSecondStageDeadline = formatDateTime(secondStageEnd);

                    return {
                        name: campaignName,
                        desc: item.Campaign__r?.Description ?? "",
                        // NEW FIELDS
                        firstStageDeadline: formattedFirstStageDeadline,
                        secondStageDeadline: formattedSecondStageDeadline,
                        // Existing fallback
                        deadline: formattedFirstStageDeadline || 'Not mentioned',
                        isTwoPlusTwo: campaignName === '2+2 Call',
                        icon: item.Campaign__r?.Icon__c ?? "",
                        redirectUrl: item.Campaign__r?.RedirectPage__c ?? "",
                        campaignId: item.Campaign__r?.Id ?? "",
                        yearlyCallId: item.Id,
                        yearlyCall: item.Name,
                        isExpired: isPastDate(firstStageEnd)
                    };
                }


                // Ensure allPrograms is always initialized as an array
                $scope.allPrograms = [];

                if (!$scope.appliedPrograms.length) {
                    debugger;
                    if ($scope.allCamapigns && $scope.allCamapigns.length > 0) {
                        debugger;
                        $scope.allPrograms = $scope.allCamapigns.map(item => ({
                            ...getCampaignData(item),
                            proposalId: '',
                            category: 'not applied'
                        }));
                    }
                } else {
                    const appliedCampaignIds = new Set(
                        $scope.appliedPrograms.filter(a => a.campaignId).map(a => a.campaignId)
                    );

                    if ($scope.allCamapigns && $scope.allCamapigns.length > 0) {
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
                }

                // Default value
                $scope.wiserCampaign = false;

                const WISER_CAMPAIGN_ID = '7015j00000056SQAAY';

                if (!$scope.wiserCampaign && $scope.appliedPrograms?.length) {
                    $scope.wiserCampaign = $scope.appliedPrograms.some(p =>
                        p.campaignId === WISER_CAMPAIGN_ID
                    );
                }

                $scope.isLoading = false;
                $scope.$apply();
            } else {
                // Handle error case - ensure arrays are initialized
                $scope.allCamapigns = [];
                $scope.appliedPrograms = [];
                $scope.allPrograms = [];
                $scope.isLoading = false;
                $scope.$apply();
            }
        }, { escape: true });
    };

    // Call getApplicantData on initial load if year is selected
    if ($scope.selectedYearId) {
        $scope.getApplicantData();
    }


    // $scope.onYearChange = function () {
    //     if (!$scope.selectedYear) {
    //         return;
    //     }
    //     $scope.getApplicantData();
    // };


    // ================== Know More link resolver ==================
    $scope.getKnowMoreLink = function (programName) {
        if (!programName) {
            return '#';
        }

        switch (programName.toUpperCase()) {
            case '2+2 CALL':
                return 'https://indo-germansciencetechnologycentre.my.salesforce.com/sfc/p/5j00000AduBP/a/e200000Lj8Gi/IQcEjbIh7eh70BlmVc3VYvE9Z6IvW9AwZK5UyE2MBP0';

            case 'PECFAR':
                return 'https://indo-germansciencetechnologycentre.my.salesforce.com/sfc/p/5j00000AduBP/a/e200000HBNXZ/CEyPpx.mUbKMmZM1sYlksJLz8_qdZm47NDiN53e5nw4';

            case 'WISER':
                return 'https://indo-germansciencetechnologycentre.my.salesforce.com/sfc/p/5j00000AduBP/a/e200000Hj3pZ/eiXBcY92D1e7oObbGwOkrFZvwGLCfDI9RduKDiHN_sM';

            case 'SING':
                return 'https://www.igstc.org/home';

            case 'WORKSHOP':
                return 'https://www.igstc.org/home';


            case 'INDUSTRIAL FELLOWSHIPS':
                return 'https://indo-germansciencetechnologycentre.my.salesforce.com/sfc/p/5j00000AduBP/a/e200000HCBpG/n.YDEXlesCaUieYkx88AruUQXSqQKPUjpT9Co_8itzg';

            default:
                return 'https://www.igstc.org/home';
        }
    };
    // =============================================================

    //************************************************************************************************** */

    $scope.popupValue = '';

    $scope.redirectToForm2 = function (val) {
        debugger;
        console.log('val in redirectToForm2() ===> ', val);
        console.log('val.campaignName ===> ', val.campaignName);
        console.log('val.name : ===> ', val.name);

        // Ensure proposalId is available before making controller call
        if (val.proposalId && val.proposalId !== '') {
            $rootScope.proposalId = val.proposalId;
        }

        // Check if proposalId is available
        if (!$rootScope.proposalId || $rootScope.proposalId === '') {
            console.error('Proposal ID is not available');
            $scope.redirectToForm(val);
            return;
        }

        // Reset popupValue for fresh call
        $scope.popupValue = '';

        ApplicantPortal_Contoller.getUserPopupChoiceFromProposal($rootScope.proposalId, function (result, event) {
            if (event.status && result != null) {
                console.log('&&&&&&&& popupValue : ', result.User_Popup_Choice__c);
                $scope.popupValue = result.User_Popup_Choice__c;
                console.log('**** $scope.popupValue **** : ', $scope.popupValue);

                // Use $apply to ensure Angular updates the scope
                $scope.$apply(function () {
                    // Process after getting popup value
                    if (val.name === '2+2 Call') {
                        if ($scope.popupValue === 'RML') {
                            $scope.openDocumentPopup(val);
                        } else {
                            $scope.redirectToForm(val);
                        }
                    } else {
                        $scope.redirectToForm(val);
                    }
                });
            } else {
                console.error('Failed to get popup choice, redirecting to form');
                $scope.$apply(function () {
                    $scope.redirectToForm(val);
                });
            }
        });
    }

    $scope.redirectToForm = function (val) {
        debugger;

        var redirectPage = val.redirectUrl;
        var isSecondStage = false;

        if (val.category == 'applied' && (val.proposalId != undefined && val.proposalId != '')) {
            localStorage.setItem('proposalId', val.proposalId);
            localStorage.setItem('yearlyCallId', val.yearlyCallId);
            localStorage.setItem('apaId', val.apaId);
            const proposalData = $scope.proposalWrapperList.find(item => item.Id == val.proposalId);

            $rootScope.proposalId = proposalData.Id;
            console.log('$rootScope.proposalId : ========> ', $rootScope.proposalId);

            if (!proposalData) {
                console.error('Proposal data not found for ID:', val.proposalId);
                $rootScope.campaignId = val.campaignId;
                $location.path('/' + redirectPage);
                return;
            }

            // Determine if it's second stage
            if (proposalData.stage == "1st Stage") {
                $rootScope.secondStage = false;
                isSecondStage = false;
            } else if (proposalData.stage == "2nd Stage" || proposalData.stage == "2nd stage" || proposalData.stage == "2ndStage") {
                $rootScope.secondStage = true;
                isSecondStage = true;
            } else {
                $rootScope.secondStage = false;
                isSecondStage = false;
            }

            if (proposalData.stage == '' || proposalData.stage == undefined) {
                $rootScope.secondStage = false;
                isSecondStage = false;
            }

            // When in 2nd Stage, prevent redirecting to declaration pages
            // Declaration pages should only be reached through the normal application flow
            if (isSecondStage) {
                var declarationPages = ['Declartion_2plus2', 'ExpenseDeclaration', 'Declaration'];
                if (declarationPages.indexOf(redirectPage) !== -1) {
                    // If redirectUrl is a declaration page, we need to find the actual starting page
                    // Check if we can get the campaign's actual starting page from allPrograms
                    var campaignData = $scope.allPrograms.find(p => p.campaignId == val.campaignId);

                    // debugger;
                    // $scope.wiserCampaign = null;

                    // if ($scope.allPrograms && Array.isArray($scope.allPrograms)) {
                    //     $scope.wiserCampaign = $scope.allPrograms.find(function (c) {
                    //         return c.Name === 'WISER';
                    //     });
                    // }
                    // console.log('wiserCampaign:', $scope.wiserCampaign);

                    if (campaignData && campaignData.redirectUrl && declarationPages.indexOf(campaignData.redirectUrl) === -1) {
                        redirectPage = campaignData.redirectUrl;
                    } else {
                        // Fallback: For 2+2 Call, default to ProjectDetailPage; for others, use Dashboard_IF or similar
                        // This is a safety measure - ideally the Campaign's RedirectPage__c should be the starting page
                        console.warn('2nd Stage proposal redirecting to declaration page. Campaign RedirectPage__c may be incorrectly configured.');
                        // Keep the original redirectUrl but log a warning
                    }
                }
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
            $rootScope.proposalStage = false;
            localStorage.setItem('proposalId', '');
            localStorage.setItem('yearlyCallId', val.yearlyCallId);
        }
        $rootScope.campaignId = val.campaignId;
        $location.path('/' + redirectPage);
    }

    $scope.showSection = function (menu) {
        $scope.selectedMenu = menu;
        // Load profile data when Profile section is selected
        if (menu === 'Profile') {
            setTimeout(function () {
                loadAllProfileData();
            }, 300);
        }
        $scope.selectedFAQ = null; // Reset FAQ detail view when switching sections

        if (menu === 'Help') {
            $scope.loadMyTickets();
            $scope.loadProposalsForContact();
        }
    };

    // FAQ data
    $scope.faqData = {
        '2+2 CALL': {
            name: 'IGSTC 2+2 Call - 2025',
            title: '2+2 CALL',
            description: 'A flagship funding scheme supporting joint R&D projects with two partners each from India and Germany.',
            hasCallText: true,
            hasBasicGuidelines: true,
            hasFAQs: true,
            callTextUrl: 'https://www.igstc.org/projects_call_text',
            basicGuidelinesUrl: 'https://www.igstc.org/home/projects_basic_guideline',
            faqUrl: 'https://www.igstc.org/home/faqs',
            hasProjectDetailsFormat: true,
            hasStandingInstructions: true,
            hasDocumentsRequired: false,
            documentsRequired: [],
            email: 'info.igstc@igstc.org',
            deadline: 'Application Deadline: 15th February 2026',
            hasRefreshNote: true
        },
        'PECFAR': {
            name: 'Paired Early Career Fellowship in Applied Research (PECFAR) - Call 2025',
            title: 'PECFAR',
            description: 'Facilitates exchange of young Indian and German researchers and clinicians in the medical field.',
            hasCallText: true,
            hasBasicGuidelines: true,
            hasFAQs: true,
            hasProjectDetailsFormat: false,
            hasStandingInstructions: false,
            hasDocumentsRequired: true,
            documentsRequired: [
                'No Objection Certificate from the Parent institution.',
                'Invitation Letter from the host institution.',
                'Proof of Date of Birth (Scan copy of Passport/ Aadhar Card).',
                'Proof of Education Qualifications arranged in reverse chronological order.',
                'Proof of Current Employment/Fellowship Award Letter.'
            ],
            email: 'pecfar@igstc.org',
            deadline: 'Application Deadline: 31st March 2025',
            hasRefreshNote: false
        },
        'WISER': {
            name: 'Women Involvement in Science and Engineering Research (WISER)',
            title: 'WISER',
            description: 'Empowers Indian women scientists through international exposure and Indo-German research partnerships.',
            hasCallText: true,
            hasBasicGuidelines: true,
            hasFAQs: true,
            callTextUrl: 'https://www.igstc.org/home/wiser_2025',
            basicGuidelinesUrl: 'https://www.igstc.org/home/wiser_basic_guidelines_2025',
            faqUrl: 'https://www.igstc.org/home/wiser_faq_2025',
            hasProjectDetailsFormat: false,
            hasStandingInstructions: false,
            hasDocumentsRequired: true,
            documentsRequired: [
                'No Objection Certificate (NOC)/Endorsement letter from the head of the institution(present organisation).',
                'Endorsement/consent letter from the Indian/German pairing collaborator'
            ],
            email: 'wiser@igstc.org',
            deadline: 'Application submission: 1 February to 31 March every year',
            hasRefreshNote: false
        },
        'SING': {
            name: 'IGSTC SING - Call 2025',
            title: 'SING',
            description: 'Supports the creation of Indo-German research network centres in strategic areas.',
            hasCallText: true,
            hasBasicGuidelines: false,
            hasFAQs: false,
            hasProjectDetailsFormat: false,
            hasStandingInstructions: false,
            hasDocumentsRequired: true,
            documentsRequired: [
                'Consent Letter/No Objection Certificate from the Parent Institution.',
                'Invitation/Support Letter from the Host Institution.',
                'Supporting documents in favour of your application, including CV.'
            ],
            email: 'sing@igstc.org',
            deadline: 'Application submission: Open throughout the year',
            hasRefreshNote: false
        },
        'WORKSHOPS': {
            name: 'IGSTC Workshop - Call 2026',
            title: 'WORKSHOPS',
            description: 'Funds thematic workshops and exploratory meetings to initiate Indo-German collaboration.',
            hasCallText: true,
            hasBasicGuidelines: false,
            hasFAQs: false,
            hasProjectDetailsFormat: false,
            hasStandingInstructions: false,
            hasDocumentsRequired: false,
            documentsRequired: [],
            email: 'info.igstc@igstc.org',
            deadline: 'Cut-off dates: 31st January 2026 and 31st July 2026',
            hasRefreshNote: false
        },
        'IF': {
            name: 'IGSTC Industrial Fellowships - Call 2025',
            title: 'IF',
            description: 'This programme is aimed at encouraging PhD students/researchers in S&T with an appreciable track record.',
            hasCallText: true,
            hasBasicGuidelines: true,
            hasFAQs: true,
            hasProjectDetailsFormat: false,
            hasStandingInstructions: false,
            hasDocumentsRequired: true,
            documentsRequired: [
                'Consent Letter from the Host Institution.',
                'The applicant having institutional affiliation needs to submit NOC from the Head of the institution at the time of application. NOC Format',
                'Applicants needs to submit recommendation letter from the mentor at parent organisation.',
                'PDIF applicant not having affiliation with an institution needs to submit 2 letters of reference.',
                'Proof of Date of Birth (Scan copy of Passport/ Aadhar Card).',
                'Proof of Education Qualifications arranged in reverse chronological order.',
                'Proof of Employment.'
            ],
            email: 'industrial.fellowship@igstc.org',
            deadline: 'Application Deadline: 31st March 2025',
            hasRefreshNote: false
        }
    };

    $scope.showFAQDetail = function (faqTitle) {
        $scope.selectedFAQ = $scope.faqData[faqTitle];
    };

    $scope.backToFAQ = function () {
        $scope.selectedFAQ = null;
    };


    //**************************************Fetch Tickets (Cases) for Logged-in Contact***********************************************

    $scope.tickets = [];
    $scope.isTicketsLoading = false;

    $scope.loadMyTickets = function () {
        $scope.isTicketsLoading = true;

        ApplicantPortal_Contoller.getMyTickets(
            $rootScope.contactId,
            function (result, event) {
                if (event.status && result) {
                    $scope.tickets = result;
                } else {
                    $scope.tickets = [];
                }
                $scope.isTicketsLoading = false;
                $scope.$apply();
            }
        );
    };

    // ---------------- View Comments ----------------
    $scope.showViewCommentsModal = false;
    $scope.selectedTicketComments = '';

    $scope.openViewCommentsModal = function (ticket) {
        if (ticket && ticket.comments) {
            // TRUST HTML so Angular renders it
            $scope.selectedTicketComments = $sce.trustAsHtml(ticket.comments);
        } else {
            $scope.selectedTicketComments = $sce.trustAsHtml('<i>No comments available</i>');
        }
        $scope.showViewCommentsModal = true;
    };

    $scope.closeViewCommentsModal = function () {
        $scope.showViewCommentsModal = false;
    };


    //**************************************Fetch Tickets (Cases) for Logged-in Contact***********************************************



    // ************************************** Raise Ticket **************************************

    // ---------------- Proposals Autocomplete ----------------
    $scope.proposals = [];
    $scope.filteredProposals = [];
    $scope.showProposalDropdown = false;

    $scope.loadProposalsForContact = function () {
        ApplicantPortal_Contoller.getProposalsForContact(
            $rootScope.contactId,
            function (result, event) {
                if (event.status && result) {
                    $scope.proposals = result;
                }
                $scope.$apply();
            }
        );
    };


    $scope.filterProposals = function () {
        if (!$scope.ticket.proposalNumber) {
            $scope.filteredProposals = [];
            $scope.showProposalDropdown = false;
            return;
        }

        var search = $scope.ticket.proposalNumber.toLowerCase();

        $scope.filteredProposals = $scope.proposals.filter(function (p) {
            return p.proposalNumber.toLowerCase().includes(search);
        });

        $scope.showProposalDropdown = true;
    };

    $scope.selectProposal = function (proposal) {
        $scope.ticket.proposalNumber = proposal.proposalNumber;
        $scope.showProposalDropdown = false;
    };

    // ---------------- Proposals Autocomplete ----------------


    $scope.showRaiseTicketModal = false;
    $scope.isTicketSaving = false;

    $scope.ticket = {
        proposalNumber: '',
        program: '',
        comments: ''
    };

    $scope.openRaiseTicketModal = function () {
        $scope.ticket = {
            proposalNumber: '',
            program: '',
            comments: ''
        };
        $scope.showRaiseTicketModal = true;
    };

    $scope.closeRaiseTicketModal = function () {
        $scope.showRaiseTicketModal = false;
    };

    $scope.allowedPrograms = [
        '2+2 Call',
        'Industrial Fellowships',
        'PECFAR',
        'Workshop',
        'SING',
        'WISER'
    ];

    // Submit ticket
    $scope.submitTicket = function () {
        // if (!$scope.ticket.comments) {
        //     alert('Please enter comments');
        //     return;
        // }

        if (!$scope.ticket.comments) {
            $scope.showToast('Please enter comments', 'error');
            return;
        }

        if ($scope.allowedPrograms.indexOf($scope.ticket.program) === -1) {
            $scope.showToast('Please select Program', 'error');
            return;
        }

        $scope.isTicketSaving = true;
        ApplicantPortal_Contoller.createTicket(
            $rootScope.contactId,
            $scope.ticket.proposalNumber,
            $scope.ticket.program,
            $scope.ticket.comments,
            function (result, event) {
                if (event.status) {
                    if (result === 'SUCCESS') {
                        //alert('Ticket raised successfully');
                        $scope.showToast('Ticket raised successfully', 'success');
                        $scope.closeRaiseTicketModal();
                        $scope.loadMyTickets();
                    } else if (result === 'INVALID_PROPOSAL') {
                        // alert('Invalid Application / Proposal Number');
                        $scope.showToast('Invalid Application / Proposal Number', 'error');
                    } else {
                        // alert('Error while creating ticket');
                        $scope.showToast('Error while creating ticket', 'error');
                    }
                }
                $scope.$apply();
            }
        );

    };




    // ---------------- Toast Popup ----------------
    $scope.toast = {
        show: false,
        message: '',
        type: 'success'
    };

    $scope.showToast = function (message, type) {
        $scope.toast.message = message;
        $scope.toast.type = type || 'success';
        $scope.toast.show = true;

        // Auto hide after 3 seconds
        setTimeout(function () {
            $scope.$apply(function () {
                $scope.toast.show = false;
            });
        }, 3000);
    };

    // ************************************** Raise Ticket **************************************


    // Navigate to home/dashboard - removes hash but keeps query params
    $scope.navigateToHome = function () {
        // Reset to dashboard view
        $scope.selectedMenu = 'Programs';
        $scope.selectedFAQ = null;
        $rootScope.isRoutedView = false;

        // Clear any route and navigate to base URL
        var baseUrl = window.location.origin + window.location.pathname;
        if (window.location.search) {
            baseUrl += window.location.search;
        }

        // Remove hash from URL
        if (window.location.hash) {
            window.location.href = baseUrl;
        } else {
            // If already on base URL, just reset the view
            $location.path('');
            $scope.$apply();
        }
    };

    $scope.downloadApplicationPdf = function (id) {
        debugger;
        ApplicantPortal_Contoller.downloadApplicationPdf(id, function (result, event) {
            debugger;
            if (event.status && result != null) {
                window.open('/servlet/servlet.FileDownload?file=' + result, '_blank');
            } else {
                console.error('Error downloading application pdf:', event.message);
            }
        });

    };

    $scope.logout = function () {
        // Redirect to login page after logout
        debugger;
        /*
        $scope.isLoading = true;
        ApplicantPortal_Contoller.LogoutApplicant($rootScope.candidateId,function(result,event){
            debugger;
            if(event.status && result == 'Success'){
                localStorage.setItem('hashCode','');
                window.location.href = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard';
                history.pushState(null, null, window.location.href);
                // history.back();
                $scope.isLoading = false;
            }else if(result == 'Error'){
                window.location.href = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard';
                history.pushState(null, null, window.location.href);
                // history.back();
                $scope.isLoading = false;
            }else{
                alert('Error logging Out !');
                console.log('Error ---> '+event.message);
                $scope.isLoading = false;
            }
            $scope.$apply();
        });
    };
    */
        // $scope.isLoading = true;
        // ApplicantPortal_Contoller.LogoutApplicant($rootScope.candidateId, function (result, event) {
        //     debugger;
        //     if (event.status && result === 'Success') {
        //         localStorage.setItem('hashCode', '');
        //         window.location.href = 'https://indo-germansciencetechnologycentre--prodcopy.sandbox.my.salesforce-sites.com/ApplicantDashboard/';
        //         $scope.isLoading = false;
        //     } else if (result === 'Error') {
        //         window.location.href = 'https://indo-germansciencetechnologycentre--prodcopy.sandbox.my.salesforce-sites.com/ApplicantDashboard/';
        //         $scope.isLoading = false;
        //     } else {
        //         window.location.href = 'https://indo-germansciencetechnologycentre--prodcopy.sandbox.my.salesforce-sites.com/ApplicantDashboard/';
        //         console.log('Error ---> ' + event.message);
        //         $scope.isLoading = false;
        //     }
        //     $scope.$apply();
        // });
        $scope.isLoading = true;
        ApplicantPortal_Contoller.LogoutApplicant($rootScope.candidateId, function (result, event) {
            debugger;
            if (event.status && result === 'Success') {
                localStorage.setItem('hashCode', '');
                window.location.href = 'https://indo-germansciencetechnologycentre.my.salesforce-sites.com/ApplicantDashboard/';
                $scope.isLoading = false;
            } else if (result === 'Error') {
                window.location.href = 'https://indo-germansciencetechnologycentre.my.salesforce-sites.com/ApplicantDashboard/';
                $scope.isLoading = false;
            } else {
                window.location.href = 'https://indo-germansciencetechnologycentre.my.salesforce-sites.com/ApplicantDashboard/';
                $scope.isLoading = false;
            }
            $scope.$apply();
        });
 
    };


});

// ========== CONTACT PROFILE FUNCTIONS (moved from contactprofile.page) ==========

// Contact Profile Tab Management
function openContactTab(tabIndex) {
    var container = document.querySelector('.contact-profile-container');
    if (!container) return;

    var tabs = container.querySelectorAll('.tab');
    var contents = container.querySelectorAll('.tab-content');

    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    if (tabs[tabIndex] && contents[tabIndex]) {
        tabs[tabIndex].classList.add('active');
        contents[tabIndex].classList.add('active');
    }
}

function toggleAccordion(header) {
    var item = header.parentElement;
    item.classList.toggle('active');
}

// Global variables for file upload
var attachment = '';
var attachmentName = '';
var fileSize = 0;
var positionIndex = 0;
var doneUploading = false;
var maxStringSize = 6000000; // ~6MB base64 encoded

// Handle file selection
function handleFileSelect(input) {
    if (input.files && input.files[0]) {
        var file = input.files[0];
        var fileSizeInBytes = file.size;
        var maxFileSize = 5242880; // 5MB

        // Validate file size
        if (fileSizeInBytes > maxFileSize) {
            alert('File size must be less than 5MB. Your file is ' + (fileSizeInBytes / 1024 / 1024).toFixed(2) + 'MB');
            input.value = '';
            return;
        }

        // Validate file type
        var fileName = file.name.toLowerCase();
        if (!(fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png'))) {
            alert('Only JPG, JPEG, and PNG images are allowed');
            input.value = '';
            return;
        }

        attachmentName = file.name;

        // Preview image first
        var uploadDiv = document.getElementById('profileUploadDiv');
        var previewReader = new FileReader();

        previewReader.onload = function (e) {
            var img = uploadDiv.querySelector('.profile-image');
            if (!img) {
                img = document.createElement('img');
                img.className = 'profile-image';
                img.alt = 'Profile Picture';
                uploadDiv.appendChild(img);
            }
            img.src = e.target.result;
            uploadDiv.classList.add('has-image');
            var uploadText = document.getElementById('uploadText');
            if (uploadText) {
                uploadText.style.display = 'none';
            }
        };

        previewReader.readAsDataURL(file);

        // Read file as binary string for upload
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
            attachment = btoa(e.target.result); // Convert to base64
            fileSize = attachment.length;

            if (fileSize > maxStringSize) {
                alert('Base64 encoded file is too large. Maximum size is ' + (maxStringSize / 1024 / 1024).toFixed(2) + 'MB. Your file is ' + (fileSize / 1024 / 1024).toFixed(2) + 'MB');
                input.value = '';
                return;
            }

            // Auto-upload the file
            uploadProfilePicture();
        };

        fileReader.onerror = function (e) {
            alert('There was an error reading the file. Please try again.');
            input.value = '';
        };

        fileReader.readAsBinaryString(file);
    }
}

// Upload profile picture in chunks
function uploadProfilePicture() {
    var contactId = contactProfileData ? contactProfileData.contactId : '';
    if (!contactId || contactId === '') {
        alert('Please save contact details first before uploading image');
        return;
    }

    positionIndex = 0;
    doneUploading = false;
    uploadAttachmentChunk();
}

function uploadAttachmentChunk() {
    var chunkSize = 750000;
    var attachmentBody = '';
    var contactId = contactProfileData ? contactProfileData.contactId : '';

    if (fileSize <= positionIndex + chunkSize) {
        attachmentBody = attachment.substring(positionIndex);
        doneUploading = true;
    } else {
        attachmentBody = attachment.substring(positionIndex, positionIndex + chunkSize);
    }

    console.log('Uploading ' + attachmentBody.length + ' chars of ' + fileSize);

    // Call RemoteAction
    var remoteAction = REMOTE_ACTION_UPLOAD_PIC;
    if (!remoteAction || remoteAction === '' || remoteAction.indexOf('$RemoteAction') !== -1) {
        remoteAction = 'ApplicantPortal_Contoller.doUploadProfilePic';
    }

    Visualforce.remoting.Manager.invokeAction(
        remoteAction,
        contactId,
        attachmentBody,
        attachmentName,
        function (result, event) {
            console.log('Upload result:', result);
            if (event.type === 'exception') {
                console.error('Exception:', event);
                alert('Error uploading image: ' + event.message);
            } else if (event.status) {
                if (doneUploading) {
                    // Upload complete
                    showMessage('messages', 'Profile picture uploaded successfully!', 'success');
                    // Refresh profile image without reloading page
                    setTimeout(function () {
                        refreshProfileImage();
                    }, 1000);
                } else {
                    // Continue with next chunk
                    positionIndex += chunkSize;
                    uploadAttachmentChunk();
                }
            } else {
                showMessage('messages', 'Error uploading image. Please try again.', 'error');
            }
        },
        { buffer: true, escape: true, timeout: 120000 }
    );
}

// Handle image load success
function handleImageLoad(img) {
    var uploadDiv = document.getElementById('profileUploadDiv');
    if (uploadDiv) {
        uploadDiv.classList.add('has-image');
    }
}

// Handle image load error
function handleImageError(img) {
    img.style.display = 'none';
    var uploadDiv = document.getElementById('profileUploadDiv');
    if (uploadDiv) {
        uploadDiv.classList.remove('has-image');
    }
}

// Initialize Visualforce Remoting - ensure it's available
function initializeRemoting() {
    if (typeof Visualforce !== 'undefined' && Visualforce.remoting && Visualforce.remoting.Manager) {
        console.log('Visualforce remoting initialized');
        return true;
    } else {
        console.warn('Visualforce remoting not ready, retrying...');
        setTimeout(initializeRemoting, 100);
        return false;
    }
}

// Function to load all profile data when Profile section is visible
function loadAllProfileData() {
    console.log('Loading all profile data...');
    console.log('contactProfileData:', contactProfileData);

    if (!contactProfileData) {
        console.warn('contactProfileData is not defined');
        return;
    }

    // Check if Profile section DOM elements exist
    var contactForm = document.getElementById('contactForm');
    var educationContainer = document.getElementById('educationRowsContainer');

    if (!contactForm && !educationContainer) {
        console.warn('Profile section DOM elements not found yet, retrying...');
        setTimeout(function () {
            loadAllProfileData();
        }, 200);
        return;
    }

    // Wait a bit for DOM to be fully ready
    setTimeout(function () {
        console.log('Starting to load profile data...');
        loadContactData();
        loadEducationData();
        loadEmploymentData();
        loadAchievementData();
        loadProfileImage();
    }, 100);
}

// Check if existing image loaded successfully on page load
window.addEventListener('load', function () {
    // Wait for Visualforce remoting to be ready
    if (initializeRemoting()) {
        // Only load if Profile section might be visible
        if (document.getElementById('contactForm') || document.getElementById('educationRowsContainer')) {
            loadAllProfileData();
        }
    } else {
        // Retry after a short delay
        setTimeout(function () {
            if (document.getElementById('contactForm') || document.getElementById('educationRowsContainer')) {
                loadAllProfileData();
            }
        }, 500);
    }
});

// Also watch for Profile menu selection via AngularJS (backup)
if (typeof angular !== 'undefined') {
    setTimeout(function () {
        try {
            var app = angular.module('cp_app');
            if (app) {
                app.run(function ($rootScope) {
                    $rootScope.$watch('selectedMenu', function (newVal, oldVal) {
                        if (newVal === 'Profile' && newVal !== oldVal) {
                            console.log('Profile menu selected via Angular watch');
                            setTimeout(function () {
                                loadAllProfileData();
                            }, 300);
                        }
                    });
                });
            }
        } catch (e) {
            console.warn('Could not set up Angular watch:', e);
        }
    }, 1000);
}

// ========== DATA LOADING FUNCTIONS ==========

function loadContactData() {
    // Load contact data from contactProfileData object
    if (!contactProfileData) return;

    // Set Salutation dropdown
    if (contactProfileData.salutation) {
        var salutationSelect = document.getElementById('contactSalutation');
        if (salutationSelect) {
            salutationSelect.value = contactProfileData.salutation;
        }
    }

    // Populate all form fields
    if (contactProfileData.firstName) {
        var firstNameEl = document.getElementById('contactFirstName');
        if (firstNameEl) firstNameEl.value = contactProfileData.firstName;
    }

    if (contactProfileData.lastName) {
        var lastNameEl = document.getElementById('contactLastName');
        if (lastNameEl) lastNameEl.value = contactProfileData.lastName;
    }

    if (contactProfileData.designation) {
        var designationEl = document.getElementById('contactDesignation');
        if (designationEl) designationEl.value = contactProfileData.designation;
    }

    if (contactProfileData.department) {
        var departmentEl = document.getElementById('contactDepartment');
        if (departmentEl) departmentEl.value = contactProfileData.department;
    }

    if (contactProfileData.email) {
        var emailEl = document.getElementById('contactEmail');
        if (emailEl) emailEl.value = contactProfileData.email;
    }

    if (contactProfileData.mobilePhone) {
        var phoneEl = document.getElementById('contactPhone');
        if (phoneEl) phoneEl.value = contactProfileData.mobilePhone;
    }

    if (contactProfileData.mailingCountry) {
        var countryEl = document.getElementById('contactCountry');
        if (countryEl) countryEl.value = contactProfileData.mailingCountry;
    }

    if (contactProfileData.mailingStreet) {
        var streetEl = document.getElementById('contactStreet');
        if (streetEl) streetEl.value = contactProfileData.mailingStreet;
    }

    if (contactProfileData.mailingState) {
        var stateEl = document.getElementById('contactState');
        if (stateEl) stateEl.value = contactProfileData.mailingState;
    }

    if (contactProfileData.mailingCity) {
        var cityEl = document.getElementById('contactCity');
        if (cityEl) cityEl.value = contactProfileData.mailingCity;
    }

    if (contactProfileData.mailingPostalCode) {
        var postalEl = document.getElementById('contactPostalCode');
        if (postalEl) postalEl.value = contactProfileData.mailingPostalCode;
    }

    if (contactProfileData.accountName) {
        var institutionEl = document.getElementById('contactInstitution');
        if (institutionEl) institutionEl.value = contactProfileData.accountName;
    }
}

function loadEducationData() {
    console.log('loadEducationData called');
    try {
        var container = document.getElementById('educationRowsContainer');
        if (!container) {
            console.warn('educationRowsContainer not found in DOM');
            return;
        }

        var jsonString = contactProfileData && contactProfileData.educationListJSON
            ? contactProfileData.educationListJSON
            : '[]';

        console.log('Education JSON string:', jsonString);

        // Handle empty string or null
        if (!jsonString || jsonString === '' || jsonString === 'null' || jsonString === 'undefined') {
            jsonString = '[]';
        }

        var educationData = JSON.parse(jsonString);
        console.log('Parsed education data:', educationData);

        container.innerHTML = '';

        if (educationData && educationData.length > 0) {
            console.log('Loading ' + educationData.length + ' education records');
            educationData.forEach(function (edu, index) {
                addEducationRowHTML(edu, index);
            });
        } else {
            console.log('No education data, adding empty row');
            addEducationRowHTML(null, 0);
        }
    } catch (e) {
        console.error('Error loading education data:', e);
        console.error('JSON string was:', contactProfileData ? contactProfileData.educationListJSON : 'undefined');
        var container = document.getElementById('educationRowsContainer');
        if (container) {
            container.innerHTML = '';
            addEducationRowHTML(null, 0);
        }
    }
}

function loadEmploymentData() {
    console.log('loadEmploymentData called');
    try {
        var container = document.getElementById('employmentRowsContainer');
        if (!container) {
            console.warn('employmentRowsContainer not found in DOM');
            return;
        }

        var jsonString = contactProfileData && contactProfileData.employmentListJSON
            ? contactProfileData.employmentListJSON
            : '[]';

        console.log('Employment JSON string:', jsonString);

        // Handle empty string or null
        if (!jsonString || jsonString === '' || jsonString === 'null' || jsonString === 'undefined') {
            jsonString = '[]';
        }

        var employmentData = JSON.parse(jsonString);
        console.log('Parsed employment data:', employmentData);

        container.innerHTML = '';

        if (employmentData && employmentData.length > 0) {
            console.log('Loading ' + employmentData.length + ' employment records');
            employmentData.forEach(function (emp, index) {
                addEmploymentRowHTML(emp, index);
            });
        } else {
            console.log('No employment data, adding empty row');
            addEmploymentRowHTML(null, 0);
        }
    } catch (e) {
        console.error('Error loading employment data:', e);
        console.error('JSON string was:', contactProfileData ? contactProfileData.employmentListJSON : 'undefined');
        var container = document.getElementById('employmentRowsContainer');
        if (container) {
            container.innerHTML = '';
            addEmploymentRowHTML(null, 0);
        }
    }
}

function loadAchievementData() {
    console.log('loadAchievementData called');
    try {
        var jsonString = contactProfileData && contactProfileData.achievementListJSON
            ? contactProfileData.achievementListJSON
            : '[]';

        console.log('Achievement JSON string:', jsonString);

        // Handle empty string or null
        if (!jsonString || jsonString === '' || jsonString === 'null' || jsonString === 'undefined') {
            jsonString = '[]';
        }

        var achievementData = JSON.parse(jsonString);
        console.log('Parsed achievement data:', achievementData);

        if (achievementData && achievementData.length > 0) {
            var ach = achievementData[0];
            console.log('Loading achievement:', ach);

            var awardsEl = document.getElementById('achievementAwards');
            if (awardsEl) {
                awardsEl.innerHTML = ach.Awards_Honours__c || '';
                console.log('Loaded Awards_Honours__c:', ach.Awards_Honours__c);
            } else {
                console.warn('achievementAwards element not found');
            }

            var patentsEl = document.getElementById('achievementPatents');
            if (patentsEl) {
                patentsEl.innerHTML = ach.List_of_Patents_filed__c || '';
                console.log('Loaded List_of_Patents_filed__c:', ach.List_of_Patents_filed__c);
            } else {
                console.warn('achievementPatents element not found');
            }

            var bookChaptersEl = document.getElementById('achievementBookChapters');
            if (bookChaptersEl) {
                bookChaptersEl.innerHTML = ach.Book_Chapters__c || '';
                console.log('Loaded Book_Chapters__c:', ach.Book_Chapters__c);
            } else {
                console.warn('achievementBookChapters element not found');
            }

            var otherEl = document.getElementById('achievementOther');
            if (otherEl) {
                otherEl.innerHTML = ach.Any_other_achievements__c || '';
                console.log('Loaded Any_other_achievements__c:', ach.Any_other_achievements__c);
            } else {
                console.warn('achievementOther element not found');
            }

            var publicationsEl = document.getElementById('achievementPublications');
            if (publicationsEl) {
                publicationsEl.innerHTML = ach.List_of_Publications__c || '';
                console.log('Loaded List_of_Publications__c:', ach.List_of_Publications__c);
            } else {
                console.warn('achievementPublications element not found');
            }
        } else {
            console.log('No achievement data found');
        }
    } catch (e) {
        console.error('Error loading achievement data', e);
        console.error('JSON string was:', contactProfileData ? contactProfileData.achievementListJSON : 'undefined');
    }
}

function loadProfileImage() {
    console.log('loadProfileImage called');
    var contactId = contactProfileData ? contactProfileData.contactId : '';
    var profileImageUrl = contactProfileData ? contactProfileData.profileImageUrl : '';

    console.log('contactId:', contactId);
    console.log('profileImageUrl:', profileImageUrl);

    var img = document.getElementById('existingProfileImage');
    if (!img) {
        console.warn('existingProfileImage element not found');
        return;
    }

    // First try to use the Visualforce expression value
    if (profileImageUrl && profileImageUrl !== '' && profileImageUrl !== 'null' && profileImageUrl !== 'undefined') {
        console.log('Using Visualforce expression URL:', profileImageUrl);
        img.src = profileImageUrl;
        img.style.display = 'block';
        handleImageLoad(img);
    } else if (contactId) {
        console.log('Fetching profile image via RemoteAction for contactId:', contactId);
        // Fallback to RemoteAction if Visualforce value is not available
        var remoteAction = REMOTE_ACTION_GET_IMAGE;
        if (!remoteAction || remoteAction === '' || remoteAction.indexOf('$RemoteAction') !== -1) {
            remoteAction = 'ApplicantPortal_Contoller.getProfileImageUrl';
        }

        Visualforce.remoting.Manager.invokeAction(
            remoteAction,
            contactId,
            function (result, event) {
                console.log('Profile image RemoteAction result:', result);
                console.log('Profile image RemoteAction event:', event);
                if (event.status && result && result !== 'null' && result !== '' && result !== 'undefined') {
                    img.src = result;
                    img.style.display = 'block';
                    handleImageLoad(img);
                } else {
                    console.log('No profile image found or error occurred');
                }
            },
            { escape: true }
        );
    } else {
        console.log('No contactId available to load profile image');
    }
}

// ========== ROW MANAGEMENT FUNCTIONS ==========

function addEducationRowHTML(edu, index) {
    var container = document.getElementById('educationRowsContainer');
    if (!container) return;

    var row = document.createElement('div');
    row.className = 'grid-row';
    row.style.cssText = 'grid-template-columns: 1.2fr 1.5fr 1.5fr 1fr 1fr 60px;';
    row.id = 'eduRow_' + index;

    var degreeValue = edu ? (edu.Degree__c || '') : '';
    var institutionValue = edu ? (edu.Institution_Name__c || '') : '';
    var specializationValue = edu ? (edu.Area_of_specialization__c || '') : '';
    var startDateValue = edu && edu.Start_Date__c ? edu.Start_Date__c.split('T')[0] : '';
    var endDateValue = edu && edu.End_Date__c ? edu.End_Date__c.split('T')[0] : '';
    var eduId = edu ? (edu.Id || '') : '';

    row.innerHTML = '<input type="hidden" class="eduId" value="' + (eduId || '') + '"/>' +
        '<input type="text" class="eduDegree form-control" value="' + degreeValue + '" placeholder="Degree"/>' +
        '<input type="text" class="eduInstitution form-control" value="' + institutionValue + '" placeholder="Institution"/>' +
        '<input type="text" class="eduSpecialization form-control" value="' + specializationValue + '" placeholder="Specialization"/>' +
        '<input type="date" class="eduStartDate form-control" value="' + startDateValue + '"/>' +
        '<input type="date" class="eduEndDate form-control" value="' + endDateValue + '"/>' +
        '<div class="action-icons"><button type="button" class="icon-btn icon-delete" onclick="removeEducationRow(' + index + ')">×</button></div>';

    container.appendChild(row);
}

function addEducationRow() {
    var container = document.getElementById('educationRowsContainer');
    if (!container) return;
    var index = container.children.length;
    addEducationRowHTML(null, index);
}

function removeEducationRow(index) {
    if (!confirm('Are you sure you want to delete this education record?')) {
        return;
    }

    var row = document.getElementById('eduRow_' + index);
    if (!row) return;

    var recordId = row.querySelector('.eduId').value;

    // If record already saved → delete from Salesforce
    if (recordId) {
        var remoteAction = REMOTE_ACTION_DELETE_EDUCATION;
        if (!remoteAction || remoteAction === '' || remoteAction.indexOf('$RemoteAction') !== -1) {
            remoteAction = 'ApplicantPortal_Contoller.deleteEducationRecord';
        }

        Visualforce.remoting.Manager.invokeAction(
            remoteAction,
            recordId,
            function (result, event) {
                if (event.status && result === 'SUCCESS') {
                    row.remove();
                    showMessage(
                        'educationMessages',
                        'Education record deleted successfully.',
                        'success'
                    );
                } else {
                    showMessage(
                        'educationMessages',
                        result || 'Error deleting record',
                        'error'
                    );
                }
            },
            { escape: true }
        );
    } else {
        // Unsaved row → just remove UI
        row.remove();
    }
}

function addEmploymentRowHTML(emp, index) {
    var container = document.getElementById('employmentRowsContainer');
    if (!container) return;

    var row = document.createElement('div');
    row.className = 'grid-row';
    row.style.cssText = 'grid-template-columns: 1.8fr 1.4fr 1fr 1fr 60px;';
    row.id = 'empRow_' + index;

    var orgValue = emp ? (emp.Organization_Name__c || '') : '';
    var positionValue = emp ? (emp.Position__c || '') : '';
    var startDateValue = emp && emp.Start_Date__c ? emp.Start_Date__c.split('T')[0] : '';
    var endDateValue = emp && emp.End_Date__c ? emp.End_Date__c.split('T')[0] : '';
    var empId = emp ? (emp.Id || '') : '';

    row.innerHTML = '<input type="hidden" class="empId" value="' + (empId || '') + '"/>' +
        '<input type="text" class="empOrganization form-control" value="' + orgValue + '" placeholder="Organization"/>' +
        '<input type="text" class="empPosition form-control" value="' + positionValue + '" placeholder="Position"/>' +
        '<input type="date" class="empStartDate form-control" value="' + startDateValue + '"/>' +
        '<input type="date" class="empEndDate form-control" value="' + endDateValue + '"/>' +
        '<div class="action-icons"><button type="button" class="icon-btn icon-delete" onclick="removeEmploymentRow(' + index + ')">×</button></div>';

    container.appendChild(row);
}

function addEmploymentRow() {
    var container = document.getElementById('employmentRowsContainer');
    if (!container) return;
    var index = container.children.length;
    addEmploymentRowHTML(null, index);
}

function removeEmploymentRow(index) {
    if (!confirm('Are you sure you want to delete this employment record?')) {
        return;
    }

    var row = document.getElementById('empRow_' + index);
    if (!row) return;

    var recordId = row.querySelector('.empId').value;

    if (recordId) {
        var remoteAction = REMOTE_ACTION_DELETE_EMPLOYMENT;
        if (!remoteAction || remoteAction === '' || remoteAction.indexOf('$RemoteAction') !== -1) {
            remoteAction = 'ApplicantPortal_Contoller.deleteEmploymentRecord';
        }

        Visualforce.remoting.Manager.invokeAction(
            remoteAction,
            recordId,
            function (result, event) {
                if (event.status && result === 'SUCCESS') {
                    row.remove();
                    showMessage(
                        'employmentMessages',
                        'Employment record deleted successfully.',
                        'success'
                    );
                } else {
                    showMessage(
                        'employmentMessages',
                        result || 'Error deleting record',
                        'error'
                    );
                }
            },
            { escape: true }
        );
    } else {
        row.remove();
    }
}

// ========== SAVE FUNCTIONS ==========

function saveContactData() {
    var contactId = contactProfileData ? contactProfileData.contactId : '';
    var contactData = {
        Id: contactId,
        Salutation: document.getElementById('contactSalutation').value,
        FirstName: document.getElementById('contactFirstName').value,
        LastName: document.getElementById('contactLastName').value,
        Designation__c: document.getElementById('contactDesignation').value,
        Department: document.getElementById('contactDepartment').value,
        Email: document.getElementById('contactEmail').value,
        MobilePhone: document.getElementById('contactPhone').value,
        MailingCountry: document.getElementById('contactCountry').value,
        MailingStreet: document.getElementById('contactStreet').value,
        MailingState: document.getElementById('contactState').value,
        MailingCity: document.getElementById('contactCity').value,
        MailingPostalCode: document.getElementById('contactPostalCode').value,
        AccountName: document.getElementById('contactInstitution').value
    };

    // Ensure Visualforce remoting is available
    if (typeof Visualforce === 'undefined' || !Visualforce.remoting || !Visualforce.remoting.Manager) {
        showMessage('messages', 'Error: Visualforce remoting not available. Please refresh the page.', 'error');
        console.error('Visualforce remoting not available');
        return;
    }

    try {
        var remotingManager = Visualforce.remoting.Manager;
        var remoteAction = REMOTE_ACTION_SAVE_CONTACT;

        console.log('Calling remoting action:', remoteAction);

        // If the action wasn't resolved, try direct name
        if (!remoteAction || remoteAction === '' || remoteAction.indexOf('$RemoteAction') !== -1) {
            console.warn('Remote action not resolved, trying direct name');
            remoteAction = 'ApplicantPortal_Contoller.saveContactProfile';
        }

        // Make the remoting call
        remotingManager.invokeAction(
            remoteAction,
            contactData,
            function (result, event) {
                console.log('Remoting result:', result);
                console.log('Remoting event:', event);

                if (event.status) {
                    if (result === 'SUCCESS') {
                        showMessage('messages', 'Profile saved successfully!', 'success');
                        // Reload page data after successful save
                        setTimeout(function () {
                            location.reload();
                        }, 1500);
                    } else {
                        showMessage('messages', result, 'error');
                    }
                } else {
                    var errorMsg = 'Unknown error';
                    if (event.message) {
                        errorMsg = event.message;
                    } else if (event.type === 'exception') {
                        errorMsg = 'Exception occurred: ' + (event.where || 'Unknown location');
                    }
                    showMessage('messages', 'Error saving profile: ' + errorMsg, 'error');
                    console.error('Full remoting error event:', JSON.stringify(event, null, 2));
                }
            },
            { escape: true, timeout: 30000 }
        );
    } catch (e) {
        showMessage('messages', 'Error: ' + e.message, 'error');
        console.error('Exception calling remoting:', e);
    }
}

function saveEducationData() {
    var contactId = contactProfileData ? contactProfileData.contactId : '';
    var rows = document.querySelectorAll('#educationRowsContainer .grid-row');
    var educationList = [];

    rows.forEach(function (row) {
        var edu = {
            Id: row.querySelector('.eduId').value || null,
            Degree__c: row.querySelector('.eduDegree').value,
            Institution_Name__c: row.querySelector('.eduInstitution').value,
            Area_of_specialization__c: row.querySelector('.eduSpecialization').value,
            Start_Date__c: row.querySelector('.eduStartDate').value,
            End_Date__c: row.querySelector('.eduEndDate').value,
            Contact__c: contactId
        };
        if (edu.Degree__c || edu.Institution_Name__c) {
            educationList.push(edu);
        }
    });

    var remoteAction = REMOTE_ACTION_SAVE_EDUCATION;
    if (!remoteAction || remoteAction === '' || remoteAction.indexOf('$RemoteAction') !== -1) {
        remoteAction = 'ApplicantPortal_Contoller.saveEducationDetails';
    }

    Visualforce.remoting.Manager.invokeAction(
        remoteAction,
        contactId,
        JSON.stringify(educationList),
        function (result, event) {
            if (event.status) {
                showMessage(
                    'educationMessages',
                    result === 'SUCCESS'
                        ? 'Education details saved successfully!'
                        : result,
                    result === 'SUCCESS' ? 'success' : 'error'
                );
            } else {
                showMessage('educationMessages', event.message, 'error');
            }
        },
        { escape: true }
    );
}

function saveEmploymentData() {
    var contactId = contactProfileData ? contactProfileData.contactId : '';
    var rows = document.querySelectorAll('#employmentRowsContainer .grid-row');
    var employmentList = [];

    rows.forEach(function (row) {
        var emp = {
            Id: row.querySelector('.empId').value || null,
            Organization_Name__c: row.querySelector('.empOrganization').value,
            Position__c: row.querySelector('.empPosition').value,
            Start_Date__c: row.querySelector('.empStartDate').value,
            End_Date__c: row.querySelector('.empEndDate').value,
            Contact__c: contactId
        };
        if (emp.Organization_Name__c || emp.Position__c) {
            employmentList.push(emp);
        }
    });

    var remoteAction = REMOTE_ACTION_SAVE_EMPLOYMENT;
    if (!remoteAction || remoteAction === '' || remoteAction.indexOf('$RemoteAction') !== -1) {
        remoteAction = 'ApplicantPortal_Contoller.saveEmploymentDetails';
    }

    Visualforce.remoting.Manager.invokeAction(
        remoteAction,
        contactId,
        JSON.stringify(employmentList),
        function (result, event) {
            if (event.status) {
                if (result === 'SUCCESS') {
                    showMessage(
                        'employmentMessages',
                        'Employment details saved successfully!',
                        'success'
                    );
                } else {
                    showMessage('employmentMessages', result, 'error');
                }
            } else {
                showMessage(
                    'employmentMessages',
                    'Error saving employment: ' + event.message,
                    'error'
                );
            }
        },
        { escape: true }
    );
}

function saveAchievementData() {
    var contactId = contactProfileData ? contactProfileData.contactId : '';

    var achievement = {
        Contact__c: contactId,
        Awards_Honours__c: document.getElementById('achievementAwards').innerHTML,
        List_of_Patents_filed__c: document.getElementById('achievementPatents').innerHTML,
        Book_Chapters__c: document.getElementById('achievementBookChapters').innerHTML,
        Any_other_achievements__c: document.getElementById('achievementOther').innerHTML,
        List_of_Publications__c: document.getElementById('achievementPublications').innerHTML
    };

    // Attach existing Id if present
    try {
        if (contactProfileData && contactProfileData.achievementListJSON) {
            var list = JSON.parse(contactProfileData.achievementListJSON);
            if (list && list.length > 0) {
                achievement.Id = list[0].Id;
            }
        }
    } catch (e) { }

    var remoteAction = REMOTE_ACTION_SAVE_ACHIEVEMENT;
    if (!remoteAction || remoteAction === '' || remoteAction.indexOf('$RemoteAction') !== -1) {
        remoteAction = 'ApplicantPortal_Contoller.saveAchievementDetails';
    }

    Visualforce.remoting.Manager.invokeAction(
        remoteAction,
        contactId,
        JSON.stringify([achievement]),
        function (result, event) {
            if (event.status) {
                showMessage(
                    'achievementMessages',
                    result === 'SUCCESS'
                        ? 'Achievements saved successfully!'
                        : result,
                    result === 'SUCCESS' ? 'success' : 'error'
                );
            } else {
                showMessage('achievementMessages', event.message, 'error');
            }
        },
        { escape: true }
    );
}

function savePublicationData() {
    var contactId = contactProfileData ? contactProfileData.contactId : '';

    var achievement = {
        Contact__c: contactId,
        List_of_Publications__c: document.getElementById('achievementPublications').innerHTML
    };

    // Attach existing Achievement Id if present
    try {
        if (contactProfileData && contactProfileData.achievementListJSON) {
            var list = JSON.parse(contactProfileData.achievementListJSON);
            if (list && list.length > 0) {
                achievement.Id = list[0].Id;
            }
        }
    } catch (e) { }

    var remoteAction = REMOTE_ACTION_SAVE_ACHIEVEMENT;
    if (!remoteAction || remoteAction === '' || remoteAction.indexOf('$RemoteAction') !== -1) {
        remoteAction = 'ApplicantPortal_Contoller.saveAchievementDetails';
    }

    Visualforce.remoting.Manager.invokeAction(
        remoteAction,
        contactId,
        JSON.stringify([achievement]),
        function (result, event) {
            if (event.status) {
                showMessage(
                    'publicationMessages',
                    result === 'SUCCESS'
                        ? 'Publications saved successfully!'
                        : result,
                    result === 'SUCCESS' ? 'success' : 'error'
                );
            } else {
                showMessage('publicationMessages', event.message, 'error');
            }
        },
        { escape: true }
    );
}

function showMessage(containerId, message, type) {
    var container = document.getElementById(containerId);
    if (container) {
        var className = type === 'success' ? 'success' : 'error';
        container.innerHTML = '<div class="' + className + '" style="padding: 10px; margin: 10px 0; border-radius: 4px; background: ' +
            (type === 'success' ? '#d4edda' : '#f8d7da') + '; color: ' +
            (type === 'success' ? '#155724' : '#721c24') + ';">' + message + '</div>';
        setTimeout(function () {
            container.innerHTML = '';
        }, 5000);
    }
}

function uploadSignature() {
    alert('Signature upload functionality to be implemented');
}

// Fix profile picture display after upload
function refreshProfileImage() {
    var contactId = contactProfileData ? contactProfileData.contactId : '';
    if (contactId) {
        var remoteAction = REMOTE_ACTION_GET_IMAGE;
        if (!remoteAction || remoteAction === '' || remoteAction.indexOf('$RemoteAction') !== -1) {
            remoteAction = 'ApplicantPortal_Contoller.getProfileImageUrl';
        }

        Visualforce.remoting.Manager.invokeAction(
            remoteAction,
            contactId,
            function (result, event) {
                if (event.status && result && result !== 'null') {
                    var img = document.getElementById('existingProfileImage');
                    if (img) {
                        img.src = result + '?t=' + new Date().getTime(); // Add timestamp to force refresh
                        img.style.display = 'block';
                        handleImageLoad(img);
                    }
                }
            },
            { escape: true }
        );
    }
}



