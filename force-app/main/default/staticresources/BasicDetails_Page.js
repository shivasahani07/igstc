angular.module('cp_app').controller('basicDetails_ctrl', function ($scope, $sce, $rootScope) {
    debugger;

    // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }

    $rootScope.proposalId;
    $scope.siteURL = siteURL;
    $rootScope.candidateId;
    $rootScope.siteURL;
    $rootScope.contactId;
    $scope.proposedDate; 
    $scope.endDate;
    $scope.announcementDate;
    $scope.config.height = 400;
    $scope.saveChanges = false;
    $scope.objRtf = [{ charCount: 0, maxCharLimit: 1000, errorStatus: false }];
    $scope.readCharacter = function (event, index) {
        debugger
        try {
            var rtfString = event.toString().replace(/<[^>]*>|\s/g, '').replace(/\s+/g, '').replace(/&ndash;/g, '-').replace(/&euro;/g, '1').replace(/&amp;/g, '1').replace(/&#39;/g, '1').replace(/&quot;/g, '1').replace(/&nbsp;/g, '').replace(/&mdash;/g, '-').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&bull;/g, '');
            charLength = rtfString.length;
            if (charLength > 0) {
                $scope.objRtf[index].charCount = charLength;
                if (charLength > $scope.objRtf[index].maxCharLimit) {
                    $scope.objRtf[index].errorStatus = true;
                } else {
                    $scope.objRtf[index].errorStatus = false;
                }
            }
            else {
                $scope.objRtf[index].charCount = 0;
                $scope.objRtf[index].errorStatus = false;
            }
        } catch (e) { }
    }

    $scope.getApplicantProjectDetails = function () {
        // ApplicantPortal_Contoller.getBasicDetails($rootScope.candidateId, function (result, event) {
        // WorkshopController.getBasicDetails($rootScope.candidateId, function (result, event) {
        WorkshopController.getBasicDetails($rootScope.proposalId, function (result, event) {
            if (event.status) {
                debugger;
                // if (result.Campaign__r?.Result_Announcement_Date__c != null) {
                //     $scope.announcementDate = new Date(result.Campaign__r.Result_Announcement_Date__c)
                // }
                if (result.Campaign__r && result.Campaign__r.Result_Announcement_Date__c) {
                    $scope.announcementDate = new Date(result.Campaign__r.Result_Announcement_Date__c);
                }
                if (result.Proposed_Date__c != undefined && result.Proposed_Date__c != "") {
                    $scope.proposedDate = new Date(result.Proposed_Date__c);
                }
                if (result.Workshop_Finish_Date__c != undefined && result.Workshop_Finish_Date__c != "") {
                    $scope.endDate = new Date(result.Workshop_Finish_Date__c);
                }
                $scope.applicantDetails = result;

                if (result.Thematic_Area__c != undefined || result.Thematic_Area__c != '') {
                    $scope.applicantDetails.Thematic_Area__c = result.Thematic_Area__c ? result.Thematic_Area__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result.Thematic_Area__c;
                }
                if (result.Title_Of__c != undefined || result.Title_Of__c != '') {
                    $scope.applicantDetails.Title_Of__c = result.Title_Of__c ? result.Title_Of__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result.Title_Of__c;
                }
                if (result.Title_In_German__c != undefined || result.Title_In_German__c != '') {
                    $scope.applicantDetails.Title_In_German__c = result.Title_In_German__c ? result.Title_In_German__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result.Title_In_German__c;
                }
                if (result.Acronym__c != undefined || result.Acronym__c != '') {
                    $scope.applicantDetails.Acronym__c = result.Acronym__c ? result.Acronym__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result.Acronym__c;
                }
                if (result.Proposed_Venue__c != undefined || result.Proposed_Venue__c != '') {
                    $scope.applicantDetails.Proposed_Venue__c = result.Proposed_Venue__c ? result.Proposed_Venue__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result.Proposed_Venue__c;
                }
                if (result.Summary__c != undefined || result.Summary__c != "") {
                    $scope.applicantDetails.Summary__c = result.Summary__c ? result.Summary__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result.Summary__c;
                }
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }
    $scope.getApplicantProjectDetails();

    $scope.applicantDetails = {};

    $scope.saveBasicDetails = function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        $scope.applicantDetails.Campaign__c = $rootScope.tagCampaignId;
        debugger;
        if ($scope.applicantDetails.Thematic_Area__c == undefined || $scope.applicantDetails.Thematic_Area__c == "") {
            swal("Basic Details", "Please Enter Project Thematic Area.");
            $("#thematic").addClass('border-theme');
            return;
        }
        if ($scope.applicantDetails.Title_Of__c == undefined || $scope.applicantDetails.Title_Of__c == "") {
            swal("Basic Details", "Please Enter Project Title.");
            $("#titleProp").addClass('border-theme');
            return;
        }
        if ($scope.applicantDetails.Title_In_German__c == undefined || $scope.applicantDetails.Title_In_German__c == "") {
            swal("Basic Details", "Please Enter Project Title in German.");
            $("#title").addClass('border-theme');
            return;
        }
        if ($scope.applicantDetails.Acronym__c == undefined || $scope.applicantDetails.Acronym__c == "") {
            swal("Basic Details", "Please Enter Project Acronym.");
            $("#acronym").addClass('border-theme');
            return;
        }
        if ($scope.proposedDate == undefined || $scope.proposedDate == "") {
            swal("Basic Details", "Please enter Proposed Date.");
            $("#proposedDate").addClass('border-theme');
            return;
        }
        if ($scope.endDate == undefined || $scope.endDate == "") {
            swal("Basic Details", "Please enter Workshop End Date.");
            $("#endDate").addClass('border-theme');
            return;
        }
        if ($scope.applicantDetails.Proposed_Venue__c == undefined || $scope.applicantDetails.Proposed_Venue__c == "") {
            swal("Basic Details", "Please Enter Project Proposed Venue.");
            $("#venue").addClass('border-theme');
            return;
        }
        if ($scope.applicantDetails.Country_of_Venue__c == undefined || $scope.applicantDetails.Country_of_Venue__c == "") {
            swal("Basic Details", "Please Enter Country of venue.");
            $("#txtCountry").addClass('border-theme');
            return;
        }
        if ($scope.applicantDetails.Summary__c == undefined || $scope.applicantDetails.Summary__c == "") {
            swal("Basic Details", "Please Enter Project Summary.");
            return;
        }

        if ($scope.applicantDetails.Summary__c != undefined || $scope.applicantDetails.Summary__c != "") {
            if ($scope.objRtf[0].charCount > 1000) {
                swal("info", "Summary maxlength will be 1000 character only.", "info");
                return;
            }
        }

        if ($scope.proposedDate != undefined || $scope.proposedDate != "") {
            var year = $scope.proposedDate.getUTCFullYear();
            var month = $scope.proposedDate.getUTCMonth() + 1;
            var day = $scope.proposedDate.getDate();
        } else {
            var year = 0;
            var month = 0;
            var day = 0;
        }

        if ($scope.endDate != undefined || $scope.endDate != "") {
            var endyear = $scope.endDate.getUTCFullYear();
            var endmonth = $scope.endDate.getUTCMonth() + 1;
            var endday = $scope.endDate.getDate();
        } else {
            var endyear = 0;
            var endmonth = 0;
            var endday = 0;
        }
        // if($scope.proposedDate < $scope.announcementDate){
        //     swal("Basic Details", "Workshop proposed Date should not be previous to result announcement date.");
        //     $("#proposedDate").addClass('border-theme');
        //     return;  
        // }
        // if($scope.endDate < $scope.announcementDate){
        //     swal("Basic Details", "Workshop End Date should not be previous to result announcement date.");
        //     $("#endDate").addClass('border-theme');
        //     return;  
        // }
        // if($scope.proposedDate > $scope.endDate){
        //     swal("Basic Details", "Workshop End Date should not be previous to Workshop proposed Date.");
        //     $("#proposedDate").addClass('border-theme');
        //     $("#endDate").addClass('border-theme');
        //     return;   
        // }
        // if($scope.proposedDate == $scope.endDate){
        //     swal("Basic Details", "Workshop End Date should not be same to Workshop proposed Date.");
        //     $("#proposedDate").addClass('border-theme');
        //     $("#endDate").addClass('border-theme');
        //     return;   
        // }

        // if($scope.proposedDate.getDate() < dd && $scope.proposedDate.getUTCMonth()+1 <= mm && $scope.proposedDate.getUTCFullYear() <= yyyy){
        //     swal("info", "Workshop proposed Date should not be previous date.");
        //     $("#txtSD").addClass('border-theme');
        //     return;
        // }
        // if($scope.endDate.getDate() < dd && $scope.endDate.getUTCMonth()+1 <= mm && $scope.endDate.getUTCFullYear() <= yyyy){
        //     swal("info", "Workshop End Date should not be previous date.");
        //     $("#txtSD").addClass('border-theme');
        //             return;
        // }
        // if($scope.proposedDate.getDate() > $scope.endDate.getDate() && $scope.proposedDate.getUTCMonth()+1 >= $scope.endDate.getUTCMonth()+1 && $scope.proposedDate.getUTCFullYear() >= $scope.endDate.getUTCFullYear()){
        //     swal("Proposal Detail", "Workshop proposed date should not be previous to Workshop End Date.");
        //     $("#txtSD").addClass('border-theme');
        //             return;
        // }
        // if($scope.proposedDate.getDate() == $scope.endDate.getDate() && $scope.proposedDate.getUTCMonth()+1 == $scope.endDate.getUTCMonth()+1 && $scope.proposedDate.getUTCFullYear() == $scope.endDate.getUTCFullYear()){
        //     swal("Proposal Detail", "Workshop proposed date should not be same date to Workshop End Date.");
        //     $("#txtSD").addClass('border-theme');
        //             return;
        // }

        /*
        ApplicantPortal_Contoller.insertBasicDetails($scope.applicantDetails,day,month,year,endday,endmonth,endyear,$rootScope.contactId,'Workshop', function(result, event){
            if(event.status && result != null){
                debugger;
                Swal.fire(
                    'SUCCESS',
                    'Your Basic detail of Proposal have been saved successfully.',
                    'success'
                );
                $scope.saveChanges = true;
                $scope.redirectPageURL('Proposal_Details');
                $rootScope.projectId = result;
                $scope.$apply();
            }
        },
        {escape: true}
        )
        */
        console.log('$rootScope.proposalId ', $rootScope.proposalId);

        //ApplicantPortal_Contoller.insertBasicDetails2($scope.applicantDetails, day, month, year, endday, endmonth, endyear, $rootScope.contactId, $rootScope.proposalId, 'Workshop', function (result, event) {
        WorkshopController.insertBasicDetails2($scope.applicantDetails, day, month, year, endday, endmonth, endyear, $rootScope.contactId, $rootScope.proposalId, 'Workshop', function (result, event) {
            if (event.status && result != null) {
                debugger;
                Swal.fire(
                    'SUCCESS',
                    'Your Basic detail of Proposal have been saved successfully.',
                    'success'
                );
                $scope.saveChanges = true;
                $scope.redirectPageURL('Proposal_Details');
                $rootScope.projectId = result;
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }

    $scope.next = function () {
        debugger;
        if ($scope.saveChanges == true) {
            $scope.redirectPageURL('Coordinators_Page');
        } else {
            $scope.saveBasicDetails();
        }
    }

    $scope.redirectPageURL = function (pageName) {
        debugger;
        var link = document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href = "#/" + pageName;
        link.click();
    }

    $scope.removeClass2 = function (controlid) {
        $("#" + controlid + "").removeClass('border-theme');
    }

});