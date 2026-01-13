angular.module('cp_app').controller('ProjectDetailCtrl', function ($scope, $rootScope) {

    debugger;

    // Fetching the proposalId from Local Storage
    if (localStorage.getItem('yearlyCallId')) {
        $rootScope.yearlyCallId = localStorage.getItem('yearlyCallId');
        console.log('Loaded proposalId from localStorage:', $rootScope.yearlyCallId);
    }

    $scope.siteURL = siteURL;
    //$rootScope.secondstage = secondstage;
    $rootScope.userHashId;
    $rootScope.userId;
    $rootScope.candidateId;
    $rootScope.siteURL;
    $rootScope.thematicAreaList;
    $scope.tentitiveStartDate;
    $rootScope.contactId;
    $rootScope.secondstage;
    $rootScope.proposalStage;
    $scope.thematicAreaToDisplay = [];
    $scope.objKeyword = [];
    $scope.objRtf = [{ charCount: 0, maxCharLimit: 1000, errorStatus: false }];
    //Added by Aman to make readonly for Partners except Coordinator
    $scope.startDate = false;
    $scope.bulletCondition = $rootScope.secondStage && $rootScope.isPrimaryContact == "true" ? true : false;
    $scope.proposalStage = $rootScope.proposalStage ? true : ($rootScope.isPrimaryContact == "false" ? true : false);
    CKEDITOR.config.readOnly = $scope.proposalStage;
    // $scope.proposalStage = $rootScope.proposalStage;
    // if($rootScope.isPrimaryContact=="false" && $rootScope.proposalStage == false){
    //     $scope.proposalStage = true;
    //     CKEDITOR.config.readOnly = true;
    // }
    //till here
    $scope.getApplicantDetail = function () {
        console.log('Inside getApplicantDetail=======================> ');
        console.log('$rootScope.userId====================>' + $rootScope.userId);
        console.log('thematicAreaList value:', $scope.thematicAreaList);
        console.log('thematicAreaList length:', $scope.thematicAreaList ? $scope.thematicAreaList.length : 0);
        debugger;
        ApplicantPortal_Contoller.getApplicantDetails($rootScope.candidateId, function (result, event) {
            console.log('Apex called===============>');
            console.log('Result===================>' + JSON.stringify(result));
            console.log('Event=================>' + JSON.stringify(event));

            if (event.status) {
                debugger;
                if (result != null) {
                    var thematicAreaId = []
                    $rootScope.projectId = result.Id;
                    /*  for(var i=0;i<$scope.thematicAreaList.length;i++){
                          thematicAreaId.push($scope.thematicAreaList[i].Id);
                          $scope.thematicAreaToDisplay.push({"Id":$scope.thematicAreaList[i].Id,"Name":$scope.thematicAreaList[i].Name,"checked":false});
                      } */
                    // $scope.tentitiveStartDate = result.Tentative_Start_Date__c;
                    if (result.Tentative_Start_Date__c != null) {
                        $scope.startDate = true;
                        $scope.tentitiveStartDate = new Date(result.Tentative_Start_Date__c);
                    }
                    if (result.Summary__c != undefined || result.Summary__c != "") {
                        result.Summary__c = result.Summary__c ? result.Summary__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replace(/&#39;/g, '\'').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Summary__c;
                    }
                    if (result.Acronym__c != undefined || result.Acronym__c != "") {
                        result.Acronym__c = result.Acronym__c ? result.Acronym__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replace(/&#39;/g, '\'').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Acronym__c;
                    }
                    if (result.Title_Of__c != undefined || result.Title_Of__c != "") {
                        result.Title_Of__c = result.Title_Of__c ? result.Title_Of__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replace(/&#39;/g, '\'').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Title_Of__c;
                    }
                    if (result.Title_In_German__c != undefined || result.Title_In_German__c != "") {
                        result.Title_In_German__c = result.Title_In_German__c ? result.Title_In_German__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replace(/&#39;/g, '\'').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Title_In_German__c;
                    }
                    if (result.KeyWords__c != undefined || result.KeyWords__c != "") {
                        result.KeyWords__c = result.KeyWords__c ? result.KeyWords__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replace(/&#39;/g, '\'').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.KeyWords__c;
                    }
                    $scope.applicantDetails = result;
                    //$scope.applicantDetails.Duration_In_Months_Max_36__c = Math.round($scope.applicantDetails.Duration_In_Months_Max_36__c);
                    if ($scope.applicantDetails.Application_Thematic_Area__r != undefined) {
                        $scope.thematicAreaToDisplay = [];
                        for (var i = 0; i < $scope.applicantDetails.Application_Thematic_Area__r.length; i++) {
                            thematicAreaId.push($scope.applicantDetails.Application_Thematic_Area__r[i].Thematic_Area_Name__c);

                            /*  if(thematicAreaId.includes($scope.applicantDetails.Application_Thematic_Area__r[i].Id)){
                                  $scope.thematicAreaToDisplay.push({"Id":$scope.applicantDetails.Application_Thematic_Area__r[i].Id,"Name":$scope.applicantDetails.Application_Thematic_Area__r[i].Thematic_Area_Name__c	,"checked":true});
                              }else{
                                  $scope.thematicAreaToDisplay.push({"Id":$scope.applicantDetails.Application_Thematic_Area__r[i].Id,"Name":$scope.applicantDetails.Application_Thematic_Area__r[i].Thematic_Area_Name__c	,"checked":false});
                              }*/
                        }
                        for (var i = 0; i < $scope.thematicAreaList.length; i++) {
                            if (thematicAreaId.includes($scope.thematicAreaList[i].Name)) {
                                $scope.thematicAreaToDisplay.push({ "Id": $scope.thematicAreaList[i].Id, "Name": $scope.thematicAreaList[i].Name, "checked": true });
                            } else {
                                $scope.thematicAreaToDisplay.push({ "Id": $scope.thematicAreaList[i].Id, "Name": $scope.thematicAreaList[i].Name, "checked": false });
                            }
                        }
                    } else {

                        for (var i = 0; i < $scope.thematicAreaList.length; i++) {
                            $scope.thematicAreaToDisplay.push({ "Id": $scope.thematicAreaList[i].Id, "Name": $scope.thematicAreaList[i].Name, "checked": false });

                        }
                    }
                } else {
                    for (var i = 0; i < $scope.thematicAreaList.length; i++) {
                        $scope.thematicAreaToDisplay.push({ "Id": $scope.thematicAreaList[i].Id, "Name": $scope.thematicAreaList[i].Name, "checked": false });
                    }
                }
                if ($scope.applicantDetails.KeyWords__c != undefined && $scope.applicantDetails.KeyWords__c != '') {
                    var keyword = $scope.applicantDetails.KeyWords__c.split(';');
                    $scope.objKeyword.splice(0, 1);
                    for (var k = 0; k < keyword.length; k++) {
                        $scope.objKeyword.push({ "keyword": keyword[k] });
                    }
                }
                else {
                    $scope.objKeyword.push({ "keyword": "" });
                }
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }

    $scope.addKeyword = function () {
        debugger
        if ($scope.objKeyword.length <= 5) {
            $scope.objKeyword.push({ keyword: "" });
            $scope.$apply();
        }
    }
    $scope.removeKeyword = function (index) {
        if ($scope.objKeyword.length > 1) {
            $scope.objKeyword.splice(index, 1);
        }
    }

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
    $scope.getApplicantDetail();

    // $scope.restrictDecimalVal = function (myVar) {
    //     // myVar = Math.round($scope.applicantDetails.Duration_In_Months_Max_36__c);
    //     if (myVar > 36) {
    //         return false;
    //     }
    //     else {
    //         return true;
    //     }
    // }

    $scope.restrictDecimalVal = function () {
        let val = $scope.applicantDetails.Duration_In_Months_Max_36__c;

        if (val > 36) {
            //$scope.applicantDetails.Duration_In_Months_Max_36__c = 36;
        }
        if (val < 24) {
            //$scope.applicantDetails.Duration_In_Months_Max_36__c = 24;
        }
    };
    // CKEDITOR.instances["config"].on('keyup', function() {
    //     alert("I ma live!");
    // });
    $scope.rtfMaxLength = function (myVar) {
        debugger
        var k = myVar;
        if (myVar > 36) {
            return false;
        }
        else {
            return true;
        }
    }
    $scope.applicantDetails = {};
    $scope.camDetails = {};
    $scope.thematicAreaList = thematicAreaList;
    $rootScope.tagCampaignId = '701e1000000twctAAA';
    $scope.saveApplication = function () {
        $scope.applicantDetails.Campaign__c = $rootScope.tagCampaignId;
        debugger;

        if ($scope.applicantDetails.Acronym__c == undefined || $scope.applicantDetails.Acronym__c == "") {
            swal("info", "Please Enter Project Acronym.", "info");
            $("#Acronym").addClass('border-theme');
            return;
        }

        if ($scope.applicantDetails.Acronym__c.length > 300) {
            swal(
                "info",
                "Project Acronym cannot exceed 300 characters.",
                "info"
            );
            $("#Acronym").addClass('border-theme');
            return;
        }

        if ($scope.applicantDetails.Title_Of__c == undefined || $scope.applicantDetails.Title_Of__c == "") {
            swal("info", "Please Enter Title of Proposal.", "info");
            $("#title").addClass('border-theme');
            return;
        }

        if ($scope.applicantDetails.Title_Of__c.length > 600) {
            swal(
                "info",
                "Title of Proposal cannot exceed 600 characters.",
                "info"
            );
            $("#Acronym").addClass('border-theme');
            return;
        }

        if ($scope.applicantDetails.Title_In_German__c == undefined || $scope.applicantDetails.Title_In_German__c == "") {
            swal("info", "Please Enter Title des Antrages(In German).", "info");
            $("#titleG").addClass('border-theme');
            return;
        }

        if ($scope.applicantDetails.Title_In_German__c.length > 600) {
            swal(
                "info",
                "Title In German cannot exceed 600 characters.",
                "info"
            );
            $("#Acronym").addClass('border-theme');
            return;
        }

        if ($scope.applicantDetails.Duration_In_Months_Max_36__c == undefined || $scope.applicantDetails.Duration_In_Months_Max_36__c == "") {
            swal("info", "Please Enter Project Duration.", "info");
            $("#txtDuration").addClass('border-theme');
            return;
        }

        if ($scope.applicantDetails.Duration_In_Months_Max_36__c < 24 || $scope.applicantDetails.Duration_In_Months_Max_36__c > 36) {
            swal("info", "Duration must be between 24 to 36 months.", "info");
            $("#proposedDate").addClass('border-theme');
            return;
        }

        debugger;
        $scope.selectedTheme = [];
        for (var i = 0; i < $scope.thematicAreaToDisplay.length; i++) {
            if ($scope.thematicAreaToDisplay[i].checked) {
                $scope.selectedTheme.push($scope.thematicAreaToDisplay[i].Id);
            }
        }
        if ($scope.selectedTheme.length <= 0) {
            swal("info", "Please select at least one project theme.", "info");
            return;
        }

        var keyword = "";
        for (var i = 0; i < $scope.objKeyword.length; i++) {
            if ($scope.objKeyword[i].keyword != '' && $scope.objKeyword[i].keyword != undefined) {
                if (i == 0)
                    keyword = $scope.objKeyword[i].keyword;
                else
                    keyword = keyword + ';' + $scope.objKeyword[i].keyword;
            }
        }
        $scope.applicantDetails.KeyWords__c = keyword;
        delete ($scope.applicantDetails.Application_Thematic_Area__r);
        delete $scope.applicantDetails._charLimitMap;

        if ($scope.applicantDetails.KeyWords__c == undefined || $scope.applicantDetails.KeyWords__c == "") {
            swal("info", "Please Enter Keyword.", "info");
            $("#key").addClass('border-theme');
            return;
        }

        if ($scope.applicantDetails.Summary__c == undefined || $scope.applicantDetails.Summary__c == "") {
            swal("info", "Please Enter Proposal Summary.", "info");
            return;
        }
        if ($scope.applicantDetails.Summary__c != undefined || $scope.applicantDetails.Summary__c != "") {
            if ($scope.objRtf[0].errorStatus) {
                swal("info", "Summary max. length limit is 1000 character only.", "info");
                return;
            }
        }

        var year = 0;
        var month = 0;
        var day = 0;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (($scope.tentitiveStartDate == undefined || $scope.tentitiveStartDate == '') && $rootScope.secondstage == true) {
            swal("info", "Please Enter Tentative Date.", "info");
            $("#TSD").addClass('border-theme');
            return;
        } else if (($scope.tentitiveStartDate != undefined || $scope.tentitiveStartDate != "") && $rootScope.secondstage == true) {
            year = $scope.tentitiveStartDate.getUTCFullYear();
            month = $scope.startDate ? $scope.tentitiveStartDate.getUTCMonth() + 1 : $scope.tentitiveStartDate.getUTCMonth() + 2;
            day = $scope.tentitiveStartDate.getDate();
        }

        if (($scope.tentitiveStartDate != undefined || $scope.tentitiveStartDate != "") && $rootScope.secondstage == true) {
            if (($scope.tentitiveStartDate.getDate() < dd && $scope.tentitiveStartDate.getUTCMonth() + 1 <= mm && $scope.tentitiveStartDate.getUTCFullYear() <= yyyy) && $rootScope.secondstage == true) {
                swal("info", "Tentative Start Date should not be previous date.");
                $("#TSD").addClass('border-theme');
                return;
            }
        }
        $("#btnPreview").html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Please wait...');
        debugger;
        ApplicantPortal_Contoller.insertApplication($scope.applicantDetails, $scope.selectedTheme, day, month, year, $rootScope.contactId, 'Two Plus Two', $rootScope.yearlyCallId, function (result, event) {
            debugger;
            // Saving the ProposalId in Local Storage
            localStorage.setItem('proposalId', result.proposalId);
            localStorage.setItem('apaId', result.apa?.Id);

            $("#btnPreview").html('<i class="fa-solid fa-check me-2"></i>Save and Next');
            /*
            if (event.status && result != null) {
                debugger;
                swal({
                    title: "Success",
                    text: "Basic Details have been saved successfully.",
                    icon: "success",
                    buttons: true,
                    dangerMode: false,
                }).then((willDelete) => {
                    if (willDelete) {
                        $rootScope.projectId = result;
                        $scope.$apply();
                        $scope.redirectPageURL('Consortia');
                    } else {
                        return;
                    }
                });
                // Swal.fire(
                //     'Proposal Detail',
                //     'Basic Details have been saved successfully.',
                //     'success'
                // );
                // $scope.redirectPageURL('Consortia');
                // $rootScope.projectId = result;
                // $scope.$apply();
            }
            */
            /*
            if (event.status && result != null) {
                swal({
                    title: "Success",
                    text: "Basic Details have been saved successfully.",
                    icon: "success",
                    buttons: {
                        cancel: "Cancel",
                        confirm: "Submit"
                    }
                }).then((isConfirmed) => {
                    if (isConfirmed) {
                        // ✔ User clicked SUBMIT
                        $rootScope.projectId = result;
                        $scope.$apply();
                        $scope.redirectPageURL('Consortia');
                    } else {
                        // ✔ User clicked CANCEL → do nothing
                        // Data remains as it is
                    }
                });
            }
            */

            $scope.successmessage = "Basic Details have been saved successfully.\n\n" +
                "Next Step:\n" +
                "* Please add Coordinator details\n" +
                "* Submit once all Project Partners are added";

            if (event.status && result != null) {
                swal({
                    title: "Success",
                    text: $scope.successmessage,
                    icon: "success",
                    button: "OK"
                    // buttons: {
                    //     // cancel: "Cancel",
                    //     confirm: "OK"
                    // }
                }).then((isConfirmed) => {
                    if (isConfirmed) {
                        // ✔ User clicked SUBMIT
                        $rootScope.projectId = result;
                        $scope.$apply();
                        $scope.redirectPageURL('Consortia');
                    } else {
                        // ✔ User clicked CANCEL → do nothing
                        // Data remains as it is
                    }
                });
            }

        },
            { escape: true }
        )
    }
    $scope.redirectToApplicantPortal = function () {
        // Redirect to Applicant Portal page with candidate ID
        window.location.href = 'https://indo-germansciencetechnologycentre--newdevutil.sandbox.my.salesforce-sites.com/ApplicantDashboard/ApplicantPortal?id=' + $rootScope.candidateId;
    };

    $scope.redirectPageURL = function (pageName) {
        debugger;
        if ($rootScope.isPrimaryContact == "false" && $rootScope.proposalStage == false) {
            CKEDITOR.config.readOnly = false;
        }
        var link = document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href = "#/" + pageName;
        link.click();
    }



    $scope.thematicArea = function (theme, index) {
        debugger;
        if ($scope.thematicAreaToDisplay[index].checked) {
            $scope.thematicAreaToDisplay[index].checked = false;
        }
        else {
            $scope.thematicAreaToDisplay[index].checked = true;
        }
        // if($scope.selectedTheme.includes(theme)){

        //     $scope.selectedTheme.splice($scope.selectedTheme.indexOf(theme),1);
        // }else{
        //     $scope.selectedTheme.push(theme);
        // }
    }

    // $scope.unChecked = function () {
    //     debugger;
    //     if ($scope.selectedTheme.length > 1){
    //         if($scope.selectedTheme.Id != undefined){
    //             $scope.deleteThematicArea($scope.selectedTheme.Id);
    //         }
    //         $scope.selectedTheme.splice();
    //     }
    // }

    // $scope.deleteThematicArea = function(){
    //     ApplicantPortal_Contoller.deleteThematicArea($scope.themeId, function (result, event) {
    //         if (event.status) {
    //             debugger;
    //             Swal.fire(
    //                 'Success',
    //                 'UnChecked Succesfully.',
    //                 'success'
    //             );
    //             $scope.$apply();
    //         }
    //     },
    //         {escape: true}
    //         )
    // }

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

    $scope.getDetails = function () {
        debugger;
        $scope.camDetails = result;
        { escape: false }
    }
    $scope.validateDate = function () {
        var Year;
        var Month;
        var Day;
        debugger
        if ($scope.tentitiveStartDate != undefined && $scope.tentitiveStartDate != '') {
            Year = $scope.tentitiveStartDate.getUTCFullYear();
            Month = $scope.tentitiveStartDate.getUTCMonth();
            Month = Month + 1;
            Day = $scope.tentitiveStartDate.getDate();
        }
        var dayDiff = moment().diff('' + Year + '-' + Month + '-' + Day + '', 'days');
        if (dayDiff > 0) {
            swal('info', 'Tentative date can not be less than today date. ', 'info')
            $scope.tentitiveStartDate = '';
            $scope.$apply();
        }
    }
    $scope.validateMaxLength = function (val) {
        alert(val);
    }
    $(document).ready(function () {
        $("#txtDuration").keypress(function (e) {
            debugger
            if (e.charCode >= 48 && e.charCode <= 57) {
                return true;
            }
            else {
                return false;
            }
        });
    });

    $scope.removeClass2 = function (controlid) {
        $("#" + controlid + "").removeClass('border-theme');
    }

    //   $(document).ready(function() {
    //     if($rootScope.proposalStage != "Draft"){
    //         CKEDITOR.config.readOnly = true;
    //     }
    // });
});
$(document).ready(function () {
    $("#Acronym").focus();
});