angular.module('cp_app').controller('fellowshipP_ctrl', function ($scope, $rootScope) {

    debugger;
    $scope.siteURL = siteURL;
    $rootScope.userHashId;
    $rootScope.userId;
    $rootScope.candidateId;
    $rootScope.siteURL;
    $scope.tentitiveStartDate;
    $scope.tentitiveEndDate;
    $scope.announcementDate;
    $rootScope.availingFellowship;
    $rootScope.pairedApplicant;
    $scope.Pecfar_dateInformationText;
    $scope.Pecfar_dateInformationText2;

    $scope.BroadAreaOfResearch = '';
    $scope.NonTechTitle = '';
    $scope.TitleOfProject = '';

    $scope.objKeyword = [];
    $scope.thematicAreaToDisplay = [];
    $scope.thematicAreaList = [];
    $scope.selectedTheme = [];

    // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }

    // Fetching the proposalId from Local Storage
    if (localStorage.getItem('apaId')) {
        $rootScope.apaId = localStorage.getItem('apaId');
        console.log('Loaded apaId from localStorage:', $rootScope.apaId);
    }

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

    // Fetch thematic areas dynamically
    $scope.fetchThematicAreas = function (callback) {
        ApplicantPortal_Contoller.fetchAllThematicArea(function (result, event) {
            if (event.status && result != null) {
                $scope.thematicAreaList = result;
                $scope.$apply();
            }
            if (callback) callback();
        }, { escape: true });
    };

    // Load saved thematic areas for the proposal
    $scope.loadSavedThematicAreas = function (proposalId) {
        ApplicantPortal_Contoller.getApplicationThematicAreas(proposalId, function (result, event) {
            if (event.status) {
                var savedThematicAreaIds = [];
                if (result != null && result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        savedThematicAreaIds.push(result[i].Thematic_Area__c);
                    }
                }

                // Build thematicAreaToDisplay with checked status based on saved areas
                $scope.thematicAreaToDisplay = [];
                for (var i = 0; i < $scope.thematicAreaList.length; i++) {
                    var isChecked = savedThematicAreaIds.includes($scope.thematicAreaList[i].Id);
                    $scope.thematicAreaToDisplay.push({
                        "Id": $scope.thematicAreaList[i].Id,
                        "Name": $scope.thematicAreaList[i].Name,
                        "checked": isChecked
                    });
                }
                $scope.$apply();
            }
        }, { escape: true });
    };

    $scope.objRtf = [{ charCount: 0, maxCharLimit: 1500, errorStatus: false }];
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 500, errorStatus: false });
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 500, errorStatus: false });
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 500, errorStatus: false });

    $scope.startDate = false;



    $scope.readCharacter = function (event, index) {

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

    $scope.apaRecord = {};
    $scope.getProjectdetils = function () {
        debugger;

        ApplicantPortal_Contoller.getFellowshipDetails(
            $rootScope.candidateId,
            $rootScope.proposalId,
            $rootScope.apaId,
            function (result, event) {

                if (event.status && result) {
                    console.log('APA record:', result);

                    // Main APA record
                    $scope.apaRecord = result;

                    $scope.Pecfar_dateInformationText = new Date(result.Proposals__r.yearly_Call__r.Pecfar_Information_Text__c);
                    $scope.Pecfar_dateInformationText2 = new Date(result.Proposals__r.yearly_Call__r.Pecfar_Information_Text_2__c);

                    /* -------- DATE NORMALIZATION -------- */

                    if (result.Title_Of_Project__c != null) {
                        $scope.apaRecord.Title_Of_Project__c = $scope.apaRecord.Title_Of_Project__c ? $scope.apaRecord.Title_Of_Project__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : $scope.apaRecord.Title_Of_Project__c;
                    }

                    if (result.KeyWords__c) {
                        var keyword = result.KeyWords__c.split(';');

                        $scope.objKeyword.splice(0, 1);

                        for (var k = 0; k < keyword.length; k++) {
                            $scope.objKeyword.push({ keyword: keyword[k] });
                        }
                    } else {
                        // Add one empty keyword input if no keywords exist
                        $scope.objKeyword.push({ keyword: "" });
                    }


                    if (result.Broad_area_of_research__c != null) {
                        $scope.apaRecord.Broad_area_of_research__c = $scope.apaRecord.Broad_area_of_research__c ? $scope.apaRecord.Broad_area_of_research__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : $scope.apaRecord.Broad_area_of_research__c;
                    }

                    if (result.Non_Technical_Title_Of_Project__c != null) {
                        $scope.apaRecord.Non_Technical_Title_Of_Project__c = $scope.apaRecord.Non_Technical_Title_Of_Project__c ? $scope.apaRecord.Non_Technical_Title_Of_Project__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : $scope.apaRecord.Non_Technical_Title_Of_Project__c;
                    }

                    if (result.Planned_research_activities_of_the_visit__c != null) {
                        $scope.apaRecord.Planned_research_activities_of_the_visit__c = $scope.apaRecord.Planned_research_activities_of_the_visit__c ? $scope.apaRecord.Planned_research_activities_of_the_visit__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : $scope.apaRecord.Planned_research_activities_of_the_visit__c;
                    }

                    if (result.Expected_outcomes__c != null) {
                        $scope.apaRecord.Expected_outcomes__c = $scope.apaRecord.Expected_outcomes__c ? $scope.apaRecord.Expected_outcomes__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : $scope.apaRecord.Expected_outcomes__c;
                    }

                    if (result.Basis_for_choosing_your_paired_member__c != null) {
                        $scope.apaRecord.Basis_for_choosing_your_paired_member__c = $scope.apaRecord.Basis_for_choosing_your_paired_member__c ? $scope.apaRecord.Basis_for_choosing_your_paired_member__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : $scope.apaRecord.Basis_for_choosing_your_paired_member__c;
                    }

                    if (result.Tentative_plans__c != null) {
                        $scope.apaRecord.Tentative_plans__c = $scope.apaRecord.Tentative_plans__c ? $scope.apaRecord.Tentative_plans__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : $scope.apaRecord.Tentative_plans__c;
                    }

                    if (result.Give_Fellowship_Details__c != null) {
                        $scope.apaRecord.Give_Fellowship_Details__c = $scope.apaRecord.Give_Fellowship_Details__c ? $scope.apaRecord.Give_Fellowship_Details__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : $scope.apaRecord.Give_Fellowship_Details__c;
                    }

                    if (result.Give_Associated_Details__c != null) {
                        $scope.apaRecord.Give_Associated_Details__c = $scope.apaRecord.Give_Associated_Details__c ? $scope.apaRecord.Give_Associated_Details__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : $scope.apaRecord.Give_Associated_Details__c;
                    }

                    if (result.Tentative_Start_Date__c != null) {
                        $scope.apaRecord.Tentative_Start_Date__c =
                            normalizeToDate(result.Tentative_Start_Date__c);

                        $scope.tentitiveStartDate = new Date(result.Tentative_Start_Date__c);
                        console.log('tentitiveStartDate :', $scope.tentitiveStartDate);
                        console.log('apaRecord.Tentative_Start_Date__c :', $scope.apaRecord.Tentative_Start_Date__c);
                    }

                    if (result.Tentative_End_Date__c != null) {
                        $scope.apaRecord.Tentative_End_Date__c =
                            normalizeToDate(result.Tentative_End_Date__c);

                        $scope.tentitiveEndDate = new Date(result.Tentative_End_Date__c);
                        console.log('tentitiveEndDate :', $scope.tentitiveEndDate);
                        console.log('apaRecord.Tentative_End_Date__c :', $scope.apaRecord.Tentative_End_Date__c);
                    }

                    // Proposal (read-only)
                    $scope.proposal = result.Proposals__r || {};

                    // UI flags
                    $scope.isFellowshipAvailed = result.Availing_Fellowship__c;

                    $scope.$apply();
                }
            }
        );
    };

    /* -------- HELPER FUNCTION -------- */
    function normalizeToDate(val) {
        // Already a Date
        if (val instanceof Date) {
            return val;
        }

        // Epoch milliseconds (number)
        if (typeof val === 'number') {
            return new Date(val);
        }

        // ISO or yyyy-MM-dd string
        if (typeof val === 'string') {
            return new Date(val);
        }

        return null;
    }

    /*
    ApplicantPortal_Contoller.getFellowshipDetails($rootScope.candidateId, $rootScope.proposalId, function (result, event) {
        debugger;
        if (event.status) {
            if (result != null) {
                $scope.Pecfar_dateInformationText = new Date(result.Applicant_Proposal_Associations__r[0].Proposals__r.yearly_Call__r.Pecfar_Information_Text__c);
                $scope.Pecfar_dateInformationText2 = new Date(result.Applicant_Proposal_Associations__r[0].Proposals__r.yearly_Call__r.Pecfar_Information_Text_2__c);
                // $scope.BroadAreaOfResearch =result.Applicant_Proposal_Associations__r[0].Proposals__r.Broad_area_of_research__c;
                // $scope.NonTechTitle=result.Applicant_Proposal_Associations__r[0].Proposals__r.Non_Technical_Title_Of_Project__c;
                // $rootScope.projectId = result.Id;
                if (result.Applicant_Proposal_Associations__r[0].Proposals__r.yearly_Call__r.Result_Announcement_Date__c != null) {
                    $scope.announcementDate = new Date(result.Applicant_Proposal_Associations__r[0].Proposals__r.yearly_Call__r.Result_Announcement_Date__c)
                }


                if (result.Tentative_Start_Date__c != null) {
                    $scope.startDate = true;
                    $scope.tentitiveStartDate = new Date(result.Tentative_Start_Date__c);
                    //     var startDateObj = new Date(result.Tentative_Start_Date__c);
                    //     // Format date as yyyy-MM-dd for HTML date input (avoid timezone issues)
                    //     var year = startDateObj.getFullYear();
                    //     var month = String(startDateObj.getMonth() + 1).padStart(2, '0');
                    //     var day = String(startDateObj.getDate()).padStart(2, '0');
                    //     $scope.tentitiveStartDate = year + '-' + month + '-' + day;
                    //    // $scope.tentitiveStartDate = day + '-' + month + '-' + year;
                }
                if (result.Tentative_End_Date__c != null) {
                    $scope.tentitiveEndDate = new Date(result.Tentative_End_Date__c);
                    // var endDateObj = new Date(result.Tentative_End_Date__c);
                    // // Format date as yyyy-MM-dd for HTML date input (avoid timezone issues)
                    // var year = endDateObj.getFullYear();
                    // var month = String(endDateObj.getMonth() + 1).padStart(2, '0');
                    // var day = String(endDateObj.getDate()).padStart(2, '0');
                    // $scope.tentitiveEndDate = year + '-' + month + '-' + day;
                    // //$scope.tentitiveEndDate = day + '-' + month + '-' + year;
                }
                $scope.$apply();
            }

            debugger;

            // Load Title_Of_Project__c from Application_Proposal__c
            if (result.Applicant_Proposal_Associations__r &&
                result.Applicant_Proposal_Associations__r.length > 0 &&
                result.Applicant_Proposal_Associations__r[0].Proposals__r &&
                result.Applicant_Proposal_Associations__r[0].Proposals__r.Title_Of__c != undefined &&
                result.Applicant_Proposal_Associations__r[0].Proposals__r.Title_Of__c != "") {
                var titleOfProject = result.Applicant_Proposal_Associations__r[0].Proposals__r.Title_Of__c;
                titleOfProject = titleOfProject ? titleOfProject.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : titleOfProject;
                $scope.TitleOfProject = titleOfProject;
            } else {
                // Initialize as empty string if no value exists
                $scope.TitleOfProject = '';
            }



            if (result.Planned_research_activities_of_the_visit__c != undefined || result.Planned_research_activities_of_the_visit__c != "") {
                result.Planned_research_activities_of_the_visit__c = result.Planned_research_activities_of_the_visit__c ? result.Planned_research_activities_of_the_visit__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Planned_research_activities_of_the_visit__c;
            }
            if (result.Expected_outcomes__c != undefined || result.Expected_outcomes__c != "") {
                result.Expected_outcomes__c = result.Expected_outcomes__c ? result.Expected_outcomes__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Expected_outcomes__c;
            }
            if (result.Basis_for_choosing_your_paired_member__c != undefined || result.Basis_for_choosing_your_paired_member__c != "") {
                result.Basis_for_choosing_your_paired_member__c = result.Basis_for_choosing_your_paired_member__c ? result.Basis_for_choosing_your_paired_member__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Basis_for_choosing_your_paired_member__c;
            }
            if (result.Tentative_plans__c != undefined || result.Tentative_plans__c != "") {
                result.Tentative_plans__c = result.Tentative_plans__c ? result.Tentative_plans__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Tentative_plans__c;
            }
            if (result.Give_Fellowship_Details__c != undefined || result.Give_Fellowship_Details__c != "") {
                result.Give_Fellowship_Details__c = result.Give_Fellowship_Details__c ? result.Give_Fellowship_Details__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Give_Fellowship_Details__c;
            }
            if (result.Give_Associated_Details__c != undefined || result.Give_Associated_Details__c != "") {
                result.Give_Associated_Details__c = result.Give_Associated_Details__c ? result.Give_Associated_Details__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Give_Associated_Details__c;
            }
            if (
                result.Applicant_Proposal_Associations__r &&
                result.Applicant_Proposal_Associations__r.length > 0 &&
                result.Applicant_Proposal_Associations__r[0].Proposals__r &&
                result.Applicant_Proposal_Associations__r[0].Proposals__r.KeyWords__c
            ) {
                var keyword = result
                    .Applicant_Proposal_Associations__r[0]
                    .Proposals__r
                    .KeyWords__c
                    .split(';');

                $scope.objKeyword.splice(0, 1);

                for (var k = 0; k < keyword.length; k++) {
                    $scope.objKeyword.push({ keyword: keyword[k] });
                }
            } else {
                // Add one empty keyword input if no keywords exist
                $scope.objKeyword.push({ keyword: "" });
            }

            if (result.Applicant_Proposal_Associations__r[0].Proposals__r.Non_Technical_Title_Of_Project__c != undefined || result.Applicant_Proposal_Associations__r[0].Proposals__r.Non_Technical_Title_Of_Project__c != "") {
                result.Applicant_Proposal_Associations__r[0].Proposals__r.Non_Technical_Title_Of_Project__c = result.Applicant_Proposal_Associations__r[0].Proposals__r.Non_Technical_Title_Of_Project__c ? result.Applicant_Proposal_Associations__r[0].Proposals__r.Non_Technical_Title_Of_Project__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Applicant_Proposal_Associations__r[0].Proposals__r.Non_Technical_Title_Of_Project__c;
                $scope.NonTechTitle = result.Applicant_Proposal_Associations__r[0].Proposals__r.Non_Technical_Title_Of_Project__c;
            }

            if (result.Applicant_Proposal_Associations__r[0].Proposals__r.Broad_area_of_research__c != undefined || result.Applicant_Proposal_Associations__r[0].Proposals__r.Broad_area_of_research__c != "") {
                result.Applicant_Proposal_Associations__r[0].Proposals__r.Broad_area_of_research__c = result.Applicant_Proposal_Associations__r[0].Proposals__r.Broad_area_of_research__c ? result.Applicant_Proposal_Associations__r[0].Proposals__r.Broad_area_of_research__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Applicant_Proposal_Associations__r[0].Proposals__r.Broad_area_of_research__c;
                $scope.BroadAreaOfResearch = result.Applicant_Proposal_Associations__r[0].Proposals__r.Broad_area_of_research__c;
            }


            // Store proposalId for loading thematic areas
            var proposalId = null;
            if (result.Applicant_Proposal_Associations__r &&
                result.Applicant_Proposal_Associations__r.length > 0 &&
                result.Applicant_Proposal_Associations__r[0].Proposals__r) {
                proposalId = result.Applicant_Proposal_Associations__r[0].Proposals__r.Id;
                // Store proposalId in rootScope for later use
                $rootScope.proposalId = proposalId;
                localStorage.setItem('proposalId', proposalId);
            }

            $scope.proposalDetails = result;
            $scope.$apply();

            // Load Thematic Areas (Subtopic) via separate call
            if (proposalId) {
                $scope.loadSavedThematicAreas(proposalId);
            } else {
                // If no proposal, just show unchecked thematic areas
                $scope.thematicAreaToDisplay = [];
                for (var i = 0; i < $scope.thematicAreaList.length; i++) {
                    $scope.thematicAreaToDisplay.push({ "Id": $scope.thematicAreaList[i].Id, "Name": $scope.thematicAreaList[i].Name, "checked": false });
                }
                $scope.$apply();
            }
        }
    },
        { escape: true }
    )
    */


    $scope.addKeyword = function () {
        debugger;
        if ($scope.objKeyword.length < 6) {
            $scope.objKeyword.push({ keyword: "" });
        }
    }
    $scope.removeKeyword = function (index) {
        if ($scope.objKeyword.length > 1) {
            $scope.objKeyword.splice(index, 1);
        }
    }

    // Thematic Area (Subtopic) checkbox toggle function
    // $scope.thematicArea = function (theme, index) {
    //     debugger;
    //     if ($scope.thematicAreaToDisplay[index].checked) {
    //         $scope.thematicAreaToDisplay[index].checked = false;
    //     } else {
    //         $scope.thematicAreaToDisplay[index].checked = true;
    //     }
    // }

    // Fetch thematic areas first, then load project details
    $scope.fetchThematicAreas(function () {
        $scope.getProjectdetils();
    });
    $scope.proposalDetails = {};

    $scope.saveApplication = function () {
        debugger;

        var apa = $scope.apaRecord;

        /* ---------------- BASIC SAFETY CHECK ---------------- */
        if (!apa || !apa.Id) {
            swal("Error", "Fellowship record not loaded properly.", "error");
            return;
        }

        // Validate Title_Of_Project__c
        if (!apa.Title_Of_Project__c) {
            swal("Info", "Please Enter Title of project.", "info");
            return;
        }

        // Validate Keyword
        var keyword = "";
        for (var i = 0; i < $scope.objKeyword.length; i++) {
            if ($scope.objKeyword[i].keyword != '' && $scope.objKeyword[i].keyword != undefined) {
                if (i == 0)
                    keyword = $scope.objKeyword[i].keyword;
                else
                    keyword = keyword + ';' + $scope.objKeyword[i].keyword;
            }
        }
        $scope.apaRecord.KeyWords__c = keyword;

        if ($scope.apaRecord.KeyWords__c == undefined || $scope.apaRecord.KeyWords__c == "") {
            swal("Info", "Please enter keyword.", "info");
            return;
        }

        // ADD BROAD AREA VALIDATION HERE 
        if (!apa.Broad_area_of_research__c) {
            swal("Info", "Please enter Broad Area of Research.", "info");
            return;
        }

        // Non-Technical Title
        if (!apa.Non_Technical_Title_Of_Project__c) {
            swal("Info", "Please enter Non-technical title of the project.", "info");
            return;
        }



        /* ---------------- RTF VALIDATIONS ---------------- */



        if (!apa.Planned_research_activities_of_the_visit__c) {
            swal("Info", "Please enter Work plan for the visit duration.", "info");
            return;
        }
        if ($scope.objRtf[0].charCount > 1500) {
            swal("Info", "Max character limit for Work plan is 1500.", "info");
            return;
        }

        if (!apa.Expected_outcomes__c) {
            swal("Info", "Please enter Expected outcomes.", "info");
            return;
        }
        if ($scope.objRtf[1].charCount > 500) {
            swal("Info", "Max character limit for Expected outcomes is 500.", "info");
            return;
        }

        if (!apa.Basis_for_choosing_your_paired_member__c) {
            swal("Info", "Please enter basis for choosing paired member.", "info");
            return;
        }
        if ($scope.objRtf[2].charCount > 500) {
            swal("Info", "Max character limit for pairing basis is 500.", "info");
            return;
        }

        if (!apa.Tentative_plans__c) {
            swal("Info", "Plans for networking visits to different institutions during the fellowship.", "info");
            return;
        }

        if ($scope.objRtf[3].charCount > 500) {
            swal("Info", "Max character limit for networking plans is 500.", "info");
            return;
        }

        // if (apa.Tentative_plans__c && $scope.objRtf[3].charCount > 500) {
        //     swal("Info", "Max character limit for networking plans is 500.", "info");
        //     return;
        // }


        /* ---------------- DATE VALIDATIONS ---------------- */

        var startDateForCompare = normalizeToDate($scope.apaRecord.Tentative_Start_Date__c);
        var endDateForCompare = normalizeToDate($scope.apaRecord.Tentative_End_Date__c);

        $scope.Pecfar_dateInformationText = new Date($scope.apaRecord.Proposals__r.yearly_Call__r.Pecfar_Information_Text__c);
        $scope.Pecfar_dateInformationText2 = new Date($scope.apaRecord.Proposals__r.yearly_Call__r.Pecfar_Information_Text_2__c);


        // 1️⃣ Start Date >= PECFAR Start Date
        if (startDateForCompare < $scope.Pecfar_dateInformationText) {

            var d = $scope.Pecfar_dateInformationText.getDate();
            var m = $scope.Pecfar_dateInformationText.getMonth() + 1;
            var y = $scope.Pecfar_dateInformationText.getFullYear();

            swal(
                "Info",
                "Fellowship should tentatively start on or after " + d + "/" + m + "/" + y,
                "info"
            );
            $("#txtSD").addClass('border-theme');
            return;
        }

        // 2️⃣ End Date <= PECFAR End Date
        if (endDateForCompare > $scope.Pecfar_dateInformationText2) {

            var d2 = $scope.Pecfar_dateInformationText2.getDate();
            var m2 = $scope.Pecfar_dateInformationText2.getMonth() + 1;
            var y2 = $scope.Pecfar_dateInformationText2.getFullYear();

            swal(
                "Info",
                "Fellowship should tentatively end on or before " + d2 + "/" + m2 + "/" + y2,
                "info"
            );
            $("#txtED").addClass('border-theme');
            return;
        }

        // 3️⃣ End Date must be AFTER Start Date
        if (endDateForCompare <= startDateForCompare) {

            swal(
                "Info",
                "Tentative End Date should be after Tentative Start Date.",
                "info"
            );
            $("#txtSD").addClass('border-theme');
            $("#txtED").addClass('border-theme');
            return;
        }

        // 4️⃣ End Date must NOT be same as Start Date
        if (startDateForCompare.getTime() === endDateForCompare.getTime()) {

            swal(
                "Info",
                "Tentative End Date should not be same as Tentative Start Date.",
                "info"
            );
            $("#txtSD").addClass('border-theme');
            $("#txtED").addClass('border-theme');
            return;
        }

        // 5️⃣ Duration must be GREATER than 30 days
        var diffInDays = Math.floor(
            (endDateForCompare.getTime() - startDateForCompare.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffInDays <= 30) {
            swal(
                "Info",
                "Difference between Tentative Start Date and Tentative End Date should be greater than 30 days.",
                "info"
            );
            $("#txtED").addClass('border-theme');
            return;
        }

        /* ---------------- FELLOWSHIP FLAGS ---------------- */

        if (!apa.Availing_Fellowship__c) {
            swal("Info", "Please specify whether you are availing any other fellowship.", "info");
            return;
        }

        if (!apa.Associated_with_IGSTC__c) {
            swal("Info", "Please specify IGSTC association.", "info");
            return;
        }

        if (apa.Availing_Fellowship__c === 'Yes' && !apa.Give_Fellowship_Details__c) {
            swal("Info", "Please provide fellowship details.", "info");
            return;
        }

        if (apa.Associated_with_IGSTC__c === 'Yes' && !apa.Give_Associated_Details__c) {
            swal("Info", "Please provide IGSTC association details.", "info");
            return;
        }

        console.log("Saving APA Record:", apa);

        ApplicantPortal_Contoller.insertFellowship_Details(
            JSON.stringify($scope.apaRecord),
            function (result, event) {

                if (event.status) {
                    swal({
                        title: "Fellowship Details",
                        text: "Your fellowship details have been successfully saved.",
                        icon: "success",
                        button: "OK"
                    }).then(function () {
                        $scope.redirectPageURL('Attachments_Pecfar');
                    });
                    $scope.$apply();
                } else {
                    swal("Error", event.message || "Unknown error", "error");
                }
            },
            { escape: true }
        );
    };


    /* Commented for Replacing Other Validation
    $scope.saveApplication = function () {
        debugger;
        // Convert dates to Date objects for comparison
        var startDateForCompare = $scope.tentitiveStartDate instanceof Date ? $scope.tentitiveStartDate : new Date($scope.tentitiveStartDate);
        let date1 = startDateForCompare.getTime();
        let date2 = new Date($scope.Pecfar_dateInformationText).getTime();
    
        let testdateyear = new Date($scope.Pecfar_dateInformationText).getFullYear();
        let testdatemonth = new Date($scope.Pecfar_dateInformationText).getMonth() + 1;
        let testdatedate = new Date($scope.Pecfar_dateInformationText).getDate();
    
        // Validate Title_Of_Project__c
        if ($scope.TitleOfProject == undefined || $scope.TitleOfProject == "" || $scope.TitleOfProject.trim() === "") {
            swal("Info", "Please Enter Title of project.", "info");
            $("#txtTitle").addClass('border-theme');
            return;
        }
    
        /* ✅ ADD BROAD AREA VALIDATION HERE 
        if ($scope.BroadAreaOfResearch == undefined ||
            $scope.BroadAreaOfResearch.trim() === "") {
    
            swal("Info", "Please enter Broad Area of Research.", "info");
            $("#txtBroadArea").addClass('border-theme');
            return;
        }
    
        // Non-Technical Title
        if ($scope.NonTechTitle == undefined ||
            $scope.NonTechTitle.trim() === "") {
            swal("Info", "Please enter Non-technical title of the project.", "info");
            $("#txtNonTechTitle").addClass('border-theme');
            return;
        }
    
        // Validate Subtopic selection (optional - only if thematic areas are available)
        $scope.selectedTheme = [];
        // if ($scope.thematicAreaToDisplay && $scope.thematicAreaToDisplay.length > 0) {
        //     for (var i = 0; i < $scope.thematicAreaToDisplay.length; i++) {
        //         if ($scope.thematicAreaToDisplay[i].checked) {
        //             $scope.selectedTheme.push($scope.thematicAreaToDisplay[i].Id);
        //         }
        //     }
        //     // if ($scope.selectedTheme.length <= 0) {
        //     //     swal("Info", "Please select at least one Subtopic.", "info");
        //     //     return;
        //     // }
        // }
    
        if (date1 < date2) {
            swal("Basic Details", "Fellowship should tentatively start after  " + testdatedate + "/" + testdatemonth + "/" + testdateyear, "info");
            $("#txtBirthdate").addClass('border-theme');
            return;
        }
        if ($scope.proposalDetails.Planned_research_activities_of_the_visit__c == undefined || $scope.proposalDetails.Planned_research_activities_of_the_visit__c == "") {
            swal("Proposal Detail", "Please Enter Reasearch Approach Objectives.");
            return;
        } else {
    
            if ($scope.objRtf[0].charCount > 1500) {
                swal('Info', 'Max character limit for Planned research activities of the visit is 1500 only', 'info');
                return;
            }
        }
    
        if ($scope.proposalDetails.Expected_outcomes__c == undefined || $scope.proposalDetails.Expected_outcomes__c == "") {
            swal("Proposal Detail", "Please Enter Expected outcomes including future plans emerging out of the visit and value addition to the parent organization.");
            return;
        } else {
    
            if ($scope.objRtf[1].charCount > 500) {
                swal('Info', 'Max character limit for Expected outcomes including future plans emerging out of the visit and value addition to the parent organization is 500 only', 'info');
                return;
            }
        }
    
        if ($scope.proposalDetails.Basis_for_choosing_your_paired_member__c == undefined || $scope.proposalDetails.Basis_for_choosing_your_paired_member__c == "") {
            swal("Proposal Detail", "Please Enter basis for choosing the pairing fellow.");
            return;
        } else {
    
            if ($scope.objRtf[2].charCount > 500) {
                swal('Info', 'Max character limit for What is the basis for choosing the pairing fellow is 500 only', 'info');
                return;
            }
        }
    
        if ($scope.proposalDetails.Tentative_plans__c != undefined) {
    
            if ($scope.objRtf[3].charCount > 500) {
                swal('Info', 'Max character limit for Tentative plans for networking visits to different institutions during the fellowship is 500 only', 'info');
                return;
            }
        }
    
        var startyear = 0;
        var startmonth = 0;
        var startday = 0;
        var endyear = 0;
        var endmonth = 0;
        var endday = 0;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
    
        if ($scope.tentitiveStartDate == undefined || $scope.tentitiveStartDate == '') {
            swal("Proposal Detail", "Please Enter Tentative Start Date.");
            $("#txtSD").addClass('border-theme');
            return;
        } else if ($scope.tentitiveStartDate != undefined || $scope.tentitiveStartDate != "") {
            // Handle both Date objects and date strings (yyyy-MM-dd format from HTML input)
            var startDateObj;
            if ($scope.tentitiveStartDate instanceof Date) {
                startDateObj = $scope.tentitiveStartDate;
            } else if (typeof $scope.tentitiveStartDate === 'string' && $scope.tentitiveStartDate.includes('-')) {
                // Parse yyyy-MM-dd format string
                var dateParts = $scope.tentitiveStartDate.split('-');
                startDateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
            } else {
                startDateObj = new Date($scope.tentitiveStartDate);
            }
            startyear = startDateObj.getFullYear();
            startmonth = startDateObj.getMonth() + 1; // Always add 1 since months are 0-indexed
            startday = startDateObj.getDate();
        }
    
        // Convert to Date objects for comparison
        var startDateForCompare = $scope.tentitiveStartDate instanceof Date ? $scope.tentitiveStartDate : new Date($scope.tentitiveStartDate);
        var announcementDateForCompare = $scope.announcementDate instanceof Date ? $scope.announcementDate : new Date($scope.announcementDate);
        if (startDateForCompare < announcementDateForCompare) {
            swal("Proposal Detail", "Tentative Start Date should not be previous to result announcement date.");
            $("#txtSD").addClass('border-theme');
            return;
        }
    
        if ($scope.tentitiveEndDate == undefined || $scope.tentitiveEndDate == '') {
            swal("Proposal Detail", "Please Enter Tentative End Date.");
            $("#txtED").addClass('border-theme');
            return;
        } else if ($scope.tentitiveEndDate != undefined || $scope.tentitiveEndDate != "") {
            // Handle both Date objects and date strings (yyyy-MM-dd format from HTML input)
            var endDateObj;
            if ($scope.tentitiveEndDate instanceof Date) {
                endDateObj = $scope.tentitiveEndDate;
            } else if (typeof $scope.tentitiveEndDate === 'string' && $scope.tentitiveEndDate.includes('-')) {
                // Parse yyyy-MM-dd format string
                var dateParts = $scope.tentitiveEndDate.split('-');
                endDateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
            } else {
                endDateObj = new Date($scope.tentitiveEndDate);
            }
            endyear = endDateObj.getFullYear();
            endmonth = endDateObj.getMonth() + 1;
            endday = endDateObj.getDate();
        }
    
        console.log('tentitiveStartDate :', $scope.tentitiveStartDate);
        console.log('today :', today);
        console.log('tentitiveStartDate :', $scope.tentitiveStartDate);
        console.log('tentitiveEndDate1 :', new Date($scope.tentitiveEndDate).toLocaleString());
        console.log('announcementdate :', new Date($scope.announcementDate).toLocaleString());
    
        // Convert end date for comparison
        var endDateForCompare = $scope.tentitiveEndDate instanceof Date ? $scope.tentitiveEndDate : new Date($scope.tentitiveEndDate);
        if (endDateForCompare < announcementDateForCompare) {
            swal("Proposal Detail", "Tentative End Date should not be previous to result announcement date.");
            $("#txtED").addClass('border-theme');
            return;
        }
    
        // 🔴 NEW VALIDATION: End Date <= Pecfar End Date
        if (endDateForCompare.getTime() > new Date($scope.Pecfar_dateInformationText2).getTime()) {
    
            var pecfarEnd = new Date($scope.Pecfar_dateInformationText2);
            var d = pecfarEnd.getDate();
            var m = pecfarEnd.getMonth() + 1;
            var y = pecfarEnd.getFullYear();
    
            swal(
                "Basic Details",
                "Fellowship should tentatively end on" + d + "/" + m + "/" + y,
                "info"
            );
    
            $("#txtED").addClass('border-theme');
            return;
        }
    
    
        if (startDateForCompare > endDateForCompare) {
            swal("Proposal Detail", "Tentative End Date should not be previous to Tentative Start Date.");
            $("#txtSD").addClass('border-theme');
            $("#txtED").addClass('border-theme');
            return;
        }
    
        console.log('tentitiveStartDate :', $scope.tentitiveStartDate);
        console.log('tentitiveEndDate :', $scope.tentitiveEndDate);
    
        debugger;
        if (startDateForCompare.getTime() === endDateForCompare.getTime()) {
            swal("Proposal Detail", "Tentative End Date should not be same to Tentative Start Date.");
            $("#txtSD").addClass('border-theme');
            $("#txtED").addClass('border-theme');
            return;
        }
    
        // var timeDiff = Math.abs($scope.tentitiveEndDate.getTime() - $scope.tentitiveStartDate.getTime());
        // $scope.dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
        // console.log('dayDifference :: '+$scope.dayDifference);
    
        // if($scope.dayDifference >= 365){
        //     swal("Info", 'Duration must be less than one year.',"Info");
        //     $("#txtED").addClass('border-theme');
        //     return;   
        // }
        if ($scope.proposalDetails.Availing_Fellowship__c == undefined || $scope.proposalDetails.Availing_Fellowship__c == "") {
            swal("Proposal Detail", "Please Enter Are You Availing any other fellowship currently?");
            return;
        }
    
        if ($scope.proposalDetails.Associated_with_IGSTC__c == undefined || $scope.proposalDetails.Associated_with_IGSTC__c == "") {
            swal("Proposal Detail", "Please Enter Whether the paired applicant associated with IGSTC programmes in past?");
            return;
        }
    
        if ($scope.proposalDetails.Availing_Fellowship__c == 'Yes' && ($scope.proposalDetails.Give_Fellowship_Details__c == undefined || $scope.proposalDetails.Give_Fellowship_Details__c == "")) {
            swal("Proposal Detail", "Please give details for availing fellowship.");
            return;
        }
        if ($scope.proposalDetails.Associated_with_IGSTC__c == 'Yes' && ($scope.proposalDetails.Give_Associated_Details__c == undefined || $scope.proposalDetails.Give_Associated_Details__c == "")) {
            swal("Proposal Detail", "Please give details for previously associated with the IGSTC in past.");
            return;
        }
    
        // Convert to Date objects for moment.js
        var startDateForMoment = $scope.tentitiveStartDate instanceof Date ? $scope.tentitiveStartDate : new Date($scope.tentitiveStartDate);
        var endDateForMoment = $scope.tentitiveEndDate instanceof Date ? $scope.tentitiveEndDate : new Date($scope.tentitiveEndDate);
        var endDate = moment(endDateForMoment);
        var starDate = moment(startDateForMoment);
        var years = endDate.diff(starDate, 'days');
    
        /*Commented for Replacing Other Validation
    
        // if (years > 60) {
        //     swal("Basic Details", "Duration should not be more than 2 months", "Info");
        //     $("#txtED").addClass('border-theme');
        //     return;
        // }
    
        if (years < 30) {
            swal("Basic Details", "Duration should not be less than 1 month.", "info");
            $("#txtED").addClass('border-theme');
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
        //$scope.proposalDetails.KeyWords__c = keyword;
    
        delete ($scope.proposalDetails.Tentative_Start_Date__c);
        delete ($scope.proposalDetails.Tentative_End_Date__c);
        delete ($scope.proposalDetails.Applicant_Proposal_Associations__r);
        delete ($scope.proposalDetails.KeyWords__c);
        // Remove Title_Of_Project__c from Contact object as it will be saved to Application_Proposal__c
        delete ($scope.proposalDetails.Title_Of_Project__c);
    
        // Get Title_Of_Project__c from TitleOfProject variable
        var titleOfProject = $scope.TitleOfProject || "";
    
        console.log('Saving Fellowship Details with params:');
        console.log('proposalId:', $rootScope.proposalId);
        console.log('selectedTheme:', $scope.selectedTheme);
        console.log('keyword:', keyword);
        console.log('contactId:', $rootScope.contactId);
        console.log('titleOfProject:', titleOfProject);
    
        ApplicantPortal_Contoller.insertFellowship_Details($scope.proposalDetails, $rootScope.proposalId, $scope.BroadAreaOfResearch, $scope.NonTechTitle, titleOfProject, $scope.selectedTheme, keyword, startday, startmonth, startyear, endday, endmonth, endyear, $rootScope.contactId, 'PECFAR', function (result, event) {
            debugger;
            console.log('insertFellowship_Details result:', result);
            console.log('insertFellowship_Details event:', event);
            if (event.status && result != null) {
                debugger;
                swal({
                    title: "Fellowship Details",
                    text: 'Your fellowship details have been successfully saved.',
                    icon: "success",
                    button: "ok!",
                }).then((value) => {
                    $scope.redirectPageURL('Attachments_Pecfar');
                    $rootScope.projectId = result;
                });
    
                $scope.$apply();
    
            }
            else {
                var errorMsg = event.message || result || "Unknown error occurred";
                console.error('Error saving fellowship details:', errorMsg);
                swal({
                    title: "Fellowship Details",
                    text: "Error: " + errorMsg,
                    icon: "error",
                    button: "ok!",
                });
            }
        },
            { escape: true }
        )
    }
    */

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