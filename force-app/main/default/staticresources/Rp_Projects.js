angular.module('rp_app').controller('projects_ctrl', function ($scope, $sce, $rootScope) {
    console.log($rootScope);
    $rootScope.activeTab = 0;
    $rootScope.userDetails;
    console.log("user details");
    console.log($rootScope.userDetails);
    $rootScope.reviewerId;
    $rootScope.GradValues = GradValues;
    $rootScope.RatingValues = RatingValues;
    $scope.disable = false;
    $rootScope.pid;
    $scope.divReviewerResponse = false;
    $scope.stageFileterValue = false;
    $scope.PendingProposal = false;
    $scope.DraftProposal = false;
    $scope.SubmittedProposal = false;
    $scope.myReviews = false;
    $scope.flagDashboard = true;
    $scope.ratingScore = 0;
    $scope.totalRating = 0;
    $scope.projectDescriptionShow = false;
    $scope.mainObjectiveShow = false;
    $scope.currentStateArtShow = false;
    $rootScope.reviewerName;
    $rootScope.reviewerEmail;
    $scope.getAllProposalFromReviewer = [];
    $scope.partnersDetail = {};
    $scope.proposalSummary = "";
    $scope.Attachments = {};
    $scope.showHome = true;
    $scope.flagProjectDet = true;
    $scope.reviewShow = false;
    $scope.show2plus2 = false;
    $scope.showSing = false;
    $scope.showIndustrial = false;
    $scope.proposalSummaryShow = false;
    $scope.showWorkshop = false;
    $scope.showWiser = false;
    $scope.showPecfar = false;
    $scope.flag = true;
    $scope.reviewerData = {};
    $scope.objReviewer = {};
    $scope.ObjResponse = {};
    $scope.pId = 'a081y000002wJGKAA2';
    $scope.documents = [];
    $scope.proposalListByDueDate = {};
    $scope.showDashboard = true;
    $scope.showProfile = true;
    $scope.myReviewsHeading = "Draft Reviews";
    $scope.rFirstName = "";
    var maxStringSize = 6000000;    //Maximum String size is 6,000,000 characters 6 MB
    var maxFileSize = 4350000;      //After Base64 Encoding, this is the max file size
    var chunkSize = 950000;         //Maximum Javascript Remoting message size is 1,000,000 characters
    $scope.rLastName = "";
    $scope.objGender = ['Male', 'Female', 'Other'];
    $scope.currentPassword = "";
    $scope.newPassword = "";
    $scope.confirmPassword = "";
    $scope.rBirthdate = "";

    $scope.plus2Prop = [];
    $scope.plus2PendingPropCount = 0;
    $scope.plus2DraftPropCount = 0;
    $scope.plus2SubmittedPropCount = 0;

    $scope.PECFARProp = [];
    $scope.PECFARPendingPropCount = 0;
    $scope.PECFARDraftPropCount = 0;
    $scope.PECFARSubmittedPropCount = 0;

    $scope.WISERProp = [];
    $scope.WISERPendingPropCount = 0;
    $scope.WISERDraftPropCount = 0;
    $scope.WISERSubmittedPropCount = 0;

    $scope.iFProp = [];
    $scope.iFPendingPropCount = 0;
    $scope.iFDraftPropCount = 0;
    $scope.iFSubmittedPropCount = 0;

    $scope.SINGProp = [];
    $scope.SINGPendingPropCount = 0;
    $scope.SINGDraftPropCount = 0;
    $scope.SINGSubmittedPropCount = 0;

    $scope.workshopProp = [];
    $scope.workshopPendingPropCount = 0;
    $scope.workshopDraftPropCount = 0;
    $scope.workshopSubmittedPropCount = 0;

    $scope.infoCardPlus2 = false;
    $scope.infoCardWISER = false;
    $scope.infoCardPECFAR = false;
    $scope.infoCardSING = false;
    $scope.infoCardIF = false;
    $scope.infoCardWorkshop = false;
    $scope.validrLname = false;
    $scope.validrFname = false;

    $scope.selectedReviewerMap = {};
    $scope.showSpinner = false;

    //reviewerId = 'a1V1y000000LwWhEAK';
    //
    $scope.validateField = function (cVal, cid) {
        if (cVal == null || cVal == '' || cVal == ' ' || cVal == undefined) {
            if (cid == "txtFirstName")
                $scope.validrFname = true;
            else
                $scope.validrLname = true;
            $("#" + cid + "").addClass('border-theme');
        } else {
            if (cid == "txtFirstName")
                $scope.validrFname = true;
            else
                $scope.validrLname = true;
            $("#" + cid + "").removeClass('border-theme');
        }
    }
    $scope.onStageChange = function (stagevalue) {
        debugger;
        $scope.filterList = [];
        $scope.stageFileterValue = false;
        for (var i = 0; i < $scope.proposalList.length; i++) {
            if ($scope.proposalList[i].Stage__c == stagevalue) {
                $scope.filterList.push($scope.proposalList[i]);
            }
        }

        if ($scope.filterList.length == 0) {
            $scope.stageFileterValue = true;
        }
        console.log('$scope.filterList::' + $scope.filterList);
    }
    $scope.getAllProposal = function () {
        ReviewerPortal_Controller.getAllProposal(reviewerId, function (result, event) {
            if (event.status && result != null) {
                debugger;
                $scope.getAllProposalFromReviewer = result;
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }
    $scope.updateReviewerDetails = function () {
        debugger
        // $.notify("Access granted", "success");
        // $.notify("Success", {type: "info", icon:"check"});
        // if(event.status && result !=null){
        //     // Swal('success','Reviewer details updated successfully','success');
        //     $.notify("Reviewer details updated successfully", "success");
        // }else{
        //     // Swal('error','exception occured','error');
        //     $.notify("Examption occured, Please try again or contact to support.", "error");
        // }
        //return;
        if ($scope.rFirstName == null || $scope.rFirstName == ' ' || $scope.rFirstName == '' || $scope.rFirstName == undefined) {
            $scope.validrFname = true;
            $("#rFirstName").removeClass('border-theme');
            swal('info', 'Please enter first name', 'info');
            return;
        }
        if ($scope.rLastName == null || $scope.rLastName == ' ' || $scope.rLastName == '' || $scope.rLastName == undefined) {
            $scope.validrLname = true;
            $("#txtLastName").removeClass('border-theme');
            swal('info', 'Please enter last name', 'info');
            return;
        }
        var birthYear = 0;
        var birthMonth = 0;
        var birthDay = 0;
        if ($scope.rBirthdate != undefined && $scope.rBirthdate != '') {
            birthYear = $scope.rBirthdate.getUTCFullYear();
            birthMonth = $scope.rBirthdate.getUTCMonth() + 1;
            birthDay = $scope.rBirthdate.getDate();
            // delete $scope.objContact.Birthdate;
        }
        var age = moment().diff('' + birthYear + '-' + birthMonth + '-' + birthDay + '', 'years');
        if (age < 22) {
            swal("error", "Age should be greater than 21 years");
            $("#txtBirthdate").addClass('border-theme');
            return false;
        }
        $scope.objReviewer.Name = $scope.rFirstName + ' ' + $scope.rLastName;
        ReviewerPortal_Controller.updateReviewerDetails($scope.objReviewer, birthDay, birthMonth, birthYear, function (result, event) {
            debugger
            if (event.status && result != null) {
                Swal('success', 'Reviewer details updated successfully', 'success');
            } else {
                Swal('error', 'exception occured', 'error');
            }
        });
    }
    $scope.resetPassword = function () {
        if ($scope.currentPassword != $scope.objReviewer.Password__c) {
            Swal('error', 'current password is invalid');
            $("#txtCurrentPassword").addClass('border-theme');
            return;
        }
        else if ($scope.newPassword != $scope.confirmPassword) {
            Swal('error', 'new password and confirm password does not match');
            return;
        } else if ($scope.newPassword == '' || $scope.confirmPassword == '') {
            Swal('error', 'Please enter new password');
            return;
        }
        else {
            $scope.objReviewer.Password__c = $scope.confirmPassword;
            ReviewerPortal_Controller.updateReviewerDetailspassword($scope.objReviewer, function (result, event) {
                if (event.status && result != null) {
                    Swal('success', 'Password updated successfully');
                } else {
                    Swal('error', 'exception occured');
                }
            });
        }
    }
    $scope.removeClass = function (ctrlId) {
        $("#" + ctrlId + "").removeClass('border-theme');
    }
    $scope.getReviewerDet = function () {
        ReviewerPortal_Controller.getReviewerDet(reviewerId, function (result, event) {
            debugger
            console.log('reviewer detail');
            console.log(result);
            if (event.status && result != null) {
                debugger;
                $scope.objReviewer = result;
                if (result.Birthdate__c != undefined && result.Birthdate__c != '') {
                    $scope.rBirthdate = new Date(result.Birthdate__c);
                }
                var rNameArray = $scope.objReviewer.Name.split(' ');
                $scope.rFirstName = rNameArray[0];
                for (var i = 1; i < rNameArray.length; i++) {
                    if (i == 1) {
                        $scope.rLastName = rNameArray[i];
                    } else {
                        $scope.rLastName = $scope.rLastName + ' ' + rNameArray[i];
                    }
                }

                if ($scope.objReviewer.Attachments != undefined && $scope.objReviewer.Attachments.length > 0) {
                    $scope.doc = $scope.objReviewer.Profile_Pic_Attachment_Id__c;
                    $scope.imageSrc = window.location.origin + '/Reviewer/servlet/servlet.FileDownload?file=' + $scope.objReviewer.Profile_Pic_Attachment_Id__c;
                    delete $scope.objReviewer.Attachments;
                }
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }
    $scope.getReviewerDet();
    $scope.showProfileDiv = function () {
        debugger;
        $scope.showDashboard = false;
        $scope.showProfile = false;
    }
    $scope.fileUrl;
    $scope.getProposalDocuments = function (selectedProposalId) {
        debugger;
        ReviewerPortal_Controller.getProAttachment(selectedProposalId, function (res, evt) {
            console.log('selected proposal id::=>' + selectedProposalId);
            // ReviewerPortal_Controller.getContactUserDoc(selectedProposalId,function(res,evt){
            debugger
            console.log('Documents---', res); // remove this line in prod;
            if (res && res.length > 0) {
                let dList = [];

                res.forEach((item, index) => {
                    item.Name = item.Name.split('.')[0];
                    item.selected = index == 0;
                    item.style = index == 0 ? 'border: 0px;border-radius: 3px;width: 100%;cursor: pointer;background-color: #160a4b;color: white' : 'border: 0px;border-radius: 3px;width: 100%;cursor: pointer;'
                    dList.push(item);
                })
                // res.forEach((item,index)=>{
                //     item.Name = item.userDocument.Name;
                //     item.selected = index==0;
                //     item.style = index==0?'border: 0px;border-radius: 3px;width: 100%;cursor: pointer;background-color: #160a4b;color: white':'border: 0px;border-radius: 3px;width: 100%;cursor: pointer;'
                //     dList.push(item);
                // })
                $scope.documents = dList;
                debugger;

                let baseUrl = window.location.origin;
                //$scope.fileUrl = $sce.trustAsResourceUrl('https://indo-germansciencetechnologycentre--dev.sandbox.file.force.com/servlet/servlet.FileDownload?file='+res[0].Id);
                // $scope.fileUrl = $sce.trustAsResourceUrl(res[0].ContentDistribution.DistributionPublicUrl+'#view=FitH');
                $scope.fileUrl = $sce.trustAsResourceUrl(baseUrl + '/servlet/servlet.FileDownload?file=' + res[0].Id + '#view=FitH');
                // console.log('URL---',baseUrl+'/servlet/servlet.FileDownload?file='+dList[cSelectedFIndex].Id+'&embedded=true');

                $scope.$apply();
                // document.getElementById("myIframe").contentDocument.location.reload(true); 
            } else {
                $scope.documents = [];
                $scope.$apply();
            }
        });
    }

    $scope.fileSelectedHandler = function (index) {
        debugger;
        // $scope.fileUrl = $sce.trustAsResourceUrl(res[0].ContentDistribution.DistributionPublicUrl+'#view=FitH');
        $scope.fileUrl = $sce.trustAsResourceUrl($scope.documents[index].ContentDistribution.DistributionPublicUrl + '#view=FitH');
        $scope.$apply();
        // let dList = $scope.documents;

        // let prevSelectedFIndex  = dList.findIndex(item=>item.selected);
        // let cSelectedFIndex = dList.findIndex(item=>item.Id==fileId);

        // if(prevSelectedFIndex!=cSelectedFIndex){
        //     dList[prevSelectedFIndex].selected = false;
        //     dList[cSelectedFIndex].selected = true;

        //     dList[prevSelectedFIndex].style = 'border: 0px;border-radius: 3px;width: 100%;cursor: pointer;';
        //     dList[cSelectedFIndex].style = 'border: 0px;border-radius: 3px;width: 100%;cursor: pointer;background-color: #160a4b;color: white';

        //     $scope.documents = dList;

        //     let baseUrl = window.location.origin;
        //     $scope.fileUrl = $sce.trustAsResourceUrl(baseUrl+'/servlet/servlet.FileDownload?file='+dList[cSelectedFIndex].Id+'&embedded=true');
        //     $scope.$apply();
        // }
    }

    $scope.getAllProposal();

    $scope.getOnload = function () {
        debugger;

        ReviewerPortal_Controller.onpageload(reviewerId, function (result, event) {
            $scope.draftList = [];
            $scope.pendingList = [];
            $scope.submittedList = [];
            console.log("onload");
            console.log(result);
            if (event.status && result != null) {
                debugger;
                $scope.proposalList = result;
                for (var i = 0; i < $scope.proposalList.length; i++) {
                    if ($scope.proposalList[i].Stage__c == 'Draft') {
                        $scope.draftList.push($scope.proposalList[i]);
                        if ($scope.proposalList[i].Proposals__r.Campaign__r != undefined) {
                            if ($scope.proposalList[i].Proposals__r.Campaign__r.Name == 'Industrial Fellowships') {
                                $scope.iFProp.push($scope.proposalList[i]);
                                $scope.iFDraftPropCount = $scope.iFDraftPropCount + 1;
                            }
                            else if ($scope.proposalList[i].Proposals__r.Campaign__r.Name == 'Workshop') {
                                $scope.workshopProp.push($scope.proposalList[i]);
                                $scope.workshopDraftPropCount = $scope.workshopDraftPropCount + 1;
                            }
                            else if ($scope.proposalList[i].Proposals__r.Campaign__r.Name == 'WISER') {
                                $scope.WISERProp.push($scope.proposalList[i]);
                                $scope.WISERDraftPropCount = $scope.WISERDraftPropCount + 1;
                            }
                            else if ($scope.proposalList[i].Proposals__r.Campaign__r.Name == 'PECFAR') {
                                $scope.PECFARProp.push($scope.proposalList[i]);
                                $scope.PECFARDraftPropCount = $scope.PECFARDraftPropCount + 1;
                            }
                            else if ($scope.proposalList[i].Proposals__r.Campaign__r.Name == 'SING') {
                                $scope.SINGProp.push($scope.proposalList[i]);
                                $scope.SINGDraftPropCount = $scope.SINGDraftPropCount + 1;
                            }
                            else if ($scope.proposalList[i].Proposals__r.Campaign__r.Name == '2+2 Call') {
                                $scope.plus2Prop.push($scope.proposalList[i]);
                                $scope.plus2DraftPropCount = $scope.plus2DraftPropCount + 1;
                            }
                        }
                    } else if ($scope.proposalList[i].Stage__c == 'Pending') {
                        $scope.pendingList.push($scope.proposalList[i]);
                        if ($scope.proposalList[i].Proposals__r.Campaign__r != undefined) {
                            if ($scope.proposalList[i].Proposals__r.Campaign__r.Name == 'Industrial Fellowships') {
                                $scope.iFProp.push($scope.proposalList[i]);
                                $scope.iFPendingPropCount = $scope.iFPendingPropCount + 1;
                            }
                            else if ($scope.proposalList[i].Proposals__r.Campaign__r.Name == 'Workshop') {
                                $scope.workshopProp.push($scope.proposalList[i]);
                                $scope.workshopPendingPropCount = $scope.workshopPendingPropCount + 1;
                            }
                            else if ($scope.proposalList[i].Proposals__r.Campaign__r.Name == 'WISER') {
                                $scope.WISERProp.push($scope.proposalList[i]);
                                $scope.WISERPendingPropCount = $scope.WISERPendingPropCount + 1;
                            }
                            else if ($scope.proposalList[i].Proposals__r.Campaign__r.Name == 'PECFAR') {
                                $scope.PECFARProp.push($scope.proposalList[i]);
                                $scope.PECFARPendingPropCount = $scope.PECFARPendingPropCount + 1;
                            }
                            else if ($scope.proposalList[i].Proposals__r.Campaign__r.Name == 'SING') {
                                $scope.SINGProp.push($scope.proposalList[i]);
                                $scope.SINGPendingPropCount = $scope.SINGPendingPropCount + 1;
                            }
                            else if ($scope.proposalList[i].Proposals__r.Campaign__r.Name == '2+2 Call') {
                                $scope.plus2Prop.push($scope.proposalList[i]);
                                $scope.plus2PendingPropCount = $scope.plus2PendingPropCount + 1;
                            }
                        }
                    } else {
                        $scope.submittedList.push($scope.proposalList[i]);
                        if ($scope.proposalList[i].Proposals__r.Campaign__r != undefined) {
                            if ($scope.proposalList[i].Proposals__r.Campaign__r.Name == 'Industrial Fellowships') {
                                $scope.iFProp.push($scope.proposalList[i]);
                                $scope.iFSubmittedPropCount = $scope.iFSubmittedPropCount + 1;
                            }
                            else if ($scope.proposalList[i].Proposals__r.Campaign__r.Name == 'Workshop') {
                                $scope.workshopProp.push($scope.proposalList[i]);
                                $scope.workshopSubmittedPropCount = $scope.workshopSubmittedPropCount + 1;
                            }
                            else if ($scope.proposalList[i].Proposals__r.Campaign__r.Name == 'WISER') {
                                $scope.WISERProp.push($scope.proposalList[i]);
                                $scope.WISERSubmittedPropCount = $scope.WISERSubmittedPropCount + 1;
                            }
                            else if ($scope.proposalList[i].Proposals__r.Campaign__r.Name == 'PECFAR') {
                                $scope.PECFARProp.push($scope.proposalList[i]);
                                $scope.PECFARSubmittedPropCount = $scope.PECFARSubmittedPropCount + 1;
                            }
                            else if ($scope.proposalList[i].Proposals__r.Campaign__r.Name == 'SING') {
                                $scope.SINGProp.push($scope.proposalList[i]);
                                $scope.SINGSubmittedPropCount = $scope.SINGSubmittedPropCount + 1;
                            }
                            else if ($scope.proposalList[i].Proposals__r.Campaign__r.Name == '2+2 Call') {
                                $scope.plus2Prop.push($scope.proposalList[i]);
                                $scope.plus2SubmittedPropCount = $scope.plus2SubmittedPropCount + 1;
                            }
                        }
                    }
                }
                if ($scope.iFProp.length > 0) {
                    $scope.infoCardIF = true;
                }
                if ($scope.plus2Prop.length > 0) {
                    $scope.infoCardPlus2 = true;
                }
                if ($scope.WISERProp.length > 0) {
                    $scope.infoCardWISER = true;
                }
                if ($scope.PECFARProp.length > 0) {
                    $scope.infoCardPECFAR = true;
                }
                if ($scope.SINGProp.length > 0) {
                    $scope.infoCardSING = true;
                }
                if ($scope.workshopProp.length > 0) {
                    $scope.infoCardWorkshop = true;
                }
                $scope.myReviewsList = $scope.draftList;
                console.log('draft proposals');
                console.log($scope.draftList);
                $scope.$apply();
            }
        })
    }

    $scope.getOnload();
    $scope.getProposalByDueDate = function () {
        ReviewerPortal_Controller.getProposalByDueDate(reviewerId, function (result, event) {
            debugger
            if (event.status && result != null) {
                debugger;
                $scope.proposalListByDueDate = result;
                console.log('data due date lis::');
                console.log($scope.proposalListByDueDate);
                $scope.$apply();
            }
        });
    }
    $scope.trustHtml = function(value) {
        return value ? $sce.trustAsHtml(value) : '';
    };
    // ----------------------
    // PROGRAMME FILTER LOGIC
    // ----------------------
    $scope.showAllProgrammeFilter = false;
    $scope.showDraftProgrammeFilter = false;
    $scope.showPendingProgrammeFilter = false;
    $scope.showSubmittedProgrammeFilter = false;
    $scope.allProgrammes = [];

    $scope.$watch('proposalListByDueDate', function(newVal) {
        if (newVal && newVal.length) {
            const uniqueProgs = [...new Set(newVal.map(r => r.Proposals__r.Campaign__r.Name))];
            $scope.allProgrammes = uniqueProgs.map(p => ({ name: p, selected: false }));

            // also initialize statuses here (so both load together)
            const uniqueStatuses = [...new Set(newVal.map(r => r.Stage__c))];
            $scope.allStatuses = uniqueStatuses.map(s => ({ name: s, selected: false }));
        }
    });

    // Toggle dropdowns
    $scope.toggleProgrammeFilter = function() {
        if($scope.DraftProposal) {
            $scope.showDraftProgrammeFilter = !$scope.showDraftProgrammeFilter;
        } else if($scope.PendingProposal) {
            $scope.showPendingProgrammeFilter = !$scope.showPendingProgrammeFilter;
        } else if($scope.SubmittedProposal) {
            $scope.showSubmittedProgrammeFilter = !$scope.showSubmittedProgrammeFilter;
        } else {
            $scope.showAllProgrammeFilter = !$scope.showAllProgrammeFilter;
        }
        $scope.showStatusFilter = false;
    };
    $scope.toggleStatusFilter = function() {
        $scope.showStatusFilter = !$scope.showStatusFilter;
        $scope.showAllProgrammeFilter = false;
        $scope.showDraftProgrammeFilter = false;
        $scope.showPendingProgrammeFilter = false;
        $scope.showSubmittedProgrammeFilter = false;
    };

    // Programme filter function
    $scope.programmeFilterFn = function(row) {
        const selected = $scope.allProgrammes.filter(p => p.selected).map(p => p.name);
        if (selected.length === 0) return true;
        return selected.includes(row.Proposals__r.Campaign__r.Name);
    };
    $scope.applyProgrammeFilter = function() {
        $scope.showAllProgrammeFilter = false;
        $scope.showDraftProgrammeFilter = false;
        $scope.showPendingProgrammeFilter = false;
        $scope.showSubmittedProgrammeFilter = false;
    };
    $scope.clearProgrammeFilter = function() {
        $scope.allProgrammes.forEach(p => (p.selected = false));
    };


    $scope.downloadDocument = function () {
    const visibleProposals = $scope.submittedList.filter($scope.programmeFilterFn);
    let proposalIds = visibleProposals
        .map(r => r.Proposals__r?.Id || r.Proposal__c || r.Proposals__c)
        .filter(id => id);
    if (proposalIds.length === 0) {
        console.error("No proposal IDs found");
        return;
    }
    $scope.isLoading = true;
    ReviewerPortal_Controller.updateReviewerStatuses(proposalIds, function (result, event) {
        if (!event.status) {
            console.error("Update failed:", event.message);
            $scope.isLoading = false;
            $scope.$applyAsync();
            return;
        }
        ReviewerPortal_Controller.generateReviewerReport(function (pdfResult, event2) {

            if (!event2.status) {
                console.error("Callout failed:", event2.message);
                $scope.isLoading = false;
                $scope.$applyAsync();
                return;
            }
            const byteCharacters = atob(pdfResult);
            const byteArray = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteArray[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'Submitted Reviewer Report.pdf';
            link.click();

            $scope.isLoading = false;
            $scope.$applyAsync();
        });
    });
};


    // $scope.downloadDocument = function () {
    //     debugger;

    //     const visibleProposals = $scope.submittedList.filter($scope.programmeFilterFn);
    //     let proposalIds = visibleProposals.map(r => r.Proposals__r?.Id ||  r.Proposal__c ||  r.Proposals__c)
    //         .filter(id => id);
    //     console.log("Initial  proposal IDs:", proposalIds);

    //     if (proposalIds.length === 0 && visibleProposals.length > 0) {
    //         console.error("No proposal  ID found!");
    //         return;
    //     }

    //     $scope.isLoading = true;
        
    //     ReviewerPortal_Controller.updateReviewerReport(proposalIds ,function (result, event) {
    //         if (event.status) {

    //             var byteCharacters = atob(result);
    //             var byteNumbers = new Array(byteCharacters.length);

    //             for (var i = 0; i < byteCharacters.length; i++) {
    //                 byteNumbers[i] = byteCharacters.charCodeAt(i);
    //             }

    //             var byteArray = new Uint8Array(byteNumbers);
    //             var blob = new Blob([byteArray], { type: 'application/pdf' });

    //             var link = document.createElement('a');
    //             link.href = URL.createObjectURL(blob);
    //             link.download = 'Submitted Reviewer Report.pdf';
    //             link.click();
    //             $scope.isLoading = false;
    //             $scope.$applyAsync(); 
    //         }
    //     });
    // };


    // ----------------------
    // STATUS FILTER LOGIC
    // ----------------------
    $scope.showStatusFilter = false;
    $scope.allStatuses = [];

    $scope.statusFilterFn = function(row) {
        const selectedStatuses = $scope.allStatuses.filter(s => s.selected).map(s => s.name);
        if (selectedStatuses.length === 0) return true;
        return selectedStatuses.includes(row.Stage__c);
    };
    $scope.applyStatusFilter = function() {
        $scope.showStatusFilter = false;
    };
    $scope.clearStatusFilter = function() {
        $scope.allStatuses.forEach(s => (s.selected = false));
    };
    $scope.getProposalByDueDate();
    $scope.getProposalDetails = function (ProposalId) {
        debugger;
        ReviewerPortal_Controller.getProposalDetails(ProposalId, function (result, event) {
            console.log('proposal data');
            console.log(result);
            console.log(event);
            debugger
            if (event.status && result != null) {
                $scope.partnersDetail = [];
                $scope.objContactHost = [];
                $scope.objContactPrimaryh = [];
                $scope.objContactPrimaryhHost = [];
                $scope.ProposalData = result.proposalData;
                $scope.objContact = result.contactsList;
                // $scope.objContact=result.contactsList;
                console.log("proposal data contact");
                console.log($scope.objContact);
                for (var i = 0; i < $scope.objContact.length; i++) {
                    if ($scope.objContact[i].Is_Primary__c != undefined) {
                        if ($scope.objContact[i].Is_Primary__c == true) {
                            $scope.objContactPrimaryh.push($scope.objContact[i]);
                        }
                    }
                    if ($scope.objContact[i].Host__c != undefined) {
                        if ($scope.objContact[i].Host__c == true) {
                            $scope.objContactPrimaryhHost.push($scope.objContact[i]);
                        }
                    }
                }
                if (result.accountsList.length > 0) {
                    for (var i = 0; i < result.accountsList.length; i++) {

                        if (result.accountsList[i].Host__c != undefined) {
                            if (result.accountsList[i].Host__c) {
                                $scope.objContactHost.push(result.accountsList[i]);
                            } else {
                                $scope.partnersDetail.push(result.accountsList[i]);
                            }
                        }
                    }
                }
                console.log('11proposal contacts::=>');
                console.log($scope.objContactPrimaryhHost);
                console.log('Host details');
                console.log($scope.objContactHost);
                // $scope.objContactHost=result.contactsList;
                for (var i = 0; i < $scope.objContact.length; i++) {
                    if ($scope.objContact[i].MailingAddress != undefined)
                        if ($scope.objContact[i].MailingAddress.street != undefined)
                            $scope.objContact[i].MailingAddress.street = $scope.objContact[i].MailingAddress.street.replace(';', ', ');
                }
                console.log('proposal contacts::=>');
                console.log($scope.objContact);
                $scope.proposalSummary = result.proposalData.Summary__c;
                $scope.Attachments = result.proposalData.Attachments;
                // $scope.ExistingGrants=result.existingGrantsList;
                $scope.WorkPackages = result.workPackagesList;
                if (result.proposalData.Campaign__r.Name == "Industrial Fellowships") {
                    $scope.show2plus2 = false;
                    $scope.showSing = false;
                    $scope.showIndustrial = true;
                    $scope.showWorkshop = false;
                    $scope.showWiser = false;
                    $scope.proposalSummaryShow = false;
                    $scope.projectDescriptionShow = true;
                    $scope.showPecfar = false;
                    $scope.currentStateArtShow = true;
                    $scope.mainObjectiveShow = true;
                    $scope.showWorkshop = false;
                } else if (result.proposalData.Campaign__r.Name == "Workshop") {
                    $scope.show2plus2 = false;
                    $scope.showSing = false;
                    $scope.mainObjectiveShow = false;
                    $scope.showIndustrial = false;
                    $scope.proposalSummaryShow = true;
                    $scope.showWiser = false;
                    $scope.projectDescriptionShow = false;
                    $scope.showPecfar = false;
                    $scope.currentStateArtShow = false;
                    $scope.showWorkshop = true;
                } else if (result.proposalData.Campaign__r.Name == "PECFAR") {
                    $scope.show2plus2 = false;
                    $scope.showSing = false;
                    $scope.showIndustrial = false;
                    $scope.showWiser = false;
                    $scope.proposalSummaryShow = false;
                    $scope.projectDescriptionShow = false;
                    $scope.showPecfar = true;
                    $scope.currentStateArtShow = false;
                    $scope.mainObjectiveShow = false;
                    $scope.showWorkshop = false;
                } else if (result.proposalData.Campaign__r.Name == "WISER") {
                    $scope.show2plus2 = false;
                    $scope.showSing = false;
                    $scope.showIndustrial = false;
                    $scope.showWiser = true;
                    $scope.proposalSummaryShow = false;
                    $scope.projectDescriptionShow = false;
                    $scope.showPecfar = false;
                    $scope.currentStateArtShow = false;
                    $scope.mainObjectiveShow = false;
                    $scope.showWorkshop = false;
                }
                else {
                    $scope.show2plus2 = true;
                    $scope.showSing = false;
                    $scope.showIndustrial = false;
                    $scope.proposalSummaryShow = true;
                    $scope.showWiser = false;
                    $scope.projectDescriptionShow = true;
                    $scope.showPecfar = false;
                    $scope.mainObjectiveShow = true;
                    $scope.currentStateArtShow = true;
                    $scope.showWorkshop = false;
                }
                if ($scope.ProposalData.Attachments != undefined) {
                    if ($scope.ProposalData.Attachments.length > 0) {
                        let dList = [];
                        $scope.ProposalData.Attachments.forEach((item, index) => {
                            item.Name = item.Name.split('.')[0];
                            item.selected = index == 0;
                            item.style = index == 0 ? 'border: 0px;border-radius: 3px;width: 100%;cursor: pointer;background-color: #160a4b;color: white' : 'border: 0px;border-radius: 3px;width: 100%;cursor: pointer;'
                            dList.push(item);
                        })
                        $scope.documents = dList;
                        let baseUrl = window.location.origin;
                        // $scope.fileUrl = $sce.trustAsResourceUrl('https://indo-germansciencetechnologycentre--dev.sandbox.file.force.com/servlet/servlet.FileDownload?file='+$scope.ProposalData.Attachments[0].Id+'#view=FitH');
                        // $scope.fileUrl = $sce.trustAsResourceUrl('https://indo-germansciencetechnologycentre.my.salesforce-sites.com/ApplicantDashboard/servlet/servlet.FileDownload?file='+$scope.ProposalData.Attachments[0].Id+'#view=FitH');
                        $scope.fileUrl = $sce.trustAsResourceUrl(baseUrl + '/servlet/servlet.FileDownload?file=' + $scope.ProposalData.Attachments[0].Id + '#view=FitH');

                    } else {
                        $scope.documents = [];
                    }
                } else {
                    // $scope.fileUrl=null;
                    //$scope.fileUrl='';
                    $scope.fileUrl = $sce.trustAsResourceUrl('');
                    $("#myIframe").attr('src', '');
                    $scope.documents = [];
                }
                $scope.$apply();
            }
        },
            { escape: false }
        )
    }
    // $scope.getProposalDetails();
    $scope.setReviewsList = function (mrFlag) {
        debugger;
        if (mrFlag == 'draft') {
            $scope.myReviewsHeading = "Draft Reviews";
            $scope.myReviewsList = $scope.draftList;
        }
        else {
            $scope.myReviewsHeading = "Submitted Reviews";
            $scope.myReviewsList = $scope.submittedList;
        }
    }
    $scope.closeRow = function (index) {
        $("#myReviewsRow" + index + "").hide('slow');
    }
    $scope.getReviews = function (projectId, index) {
        debugger
        var selectedProposal;
        for (var i = 0; i < $scope.getAllProposalFromReviewer.length; i++) {
            if ($scope.getAllProposalFromReviewer[i].Id == projectId) {
                selectedProposal = $scope.getAllProposalFromReviewer[i];
            }
        }
        if (selectedProposal != undefined) {
            var reviewerMapId = '';
            if (selectedProposal.Reviewer_Mapping__r.length > 0) {
                reviewerMapId = selectedProposal.Reviewer_Mapping__r[0].Id;
            }
            ReviewerPortal_Controller.getAllQLIAndRRLI(selectedProposal.Question_Template__c, reviewerMapId, function (result, event) {
                debugger
                console.log('all questions');
                console.log(result);
                if (event.status && result != null) {
                    $scope.questionList = result;
                    if ($scope.questionList.length > 0) {
                        $('[id^="myReviewsRow"]').hide();
                        $("#myReviewsRow" + index + "").show('slow');
                    }
                    $scope.$apply();
                }
            })
        }
    }
    $scope.enableProjectDetails = function (selectedReviewerMapId, projectId, stageFlag, stage, prop_stage, programme) {
        debugger;
        console.log(' selectedReviewerMapId ===> ', selectedReviewerMapId);
        // if(stage=="Submitted"){
        //     $scope.divReviewerResponse=true;
        // }
        // else{
        //     $scope.divReviewerResponse=false;
        // }
        $scope.reviewShow = stageFlag;
        $scope.DraftProposal = false;
        $scope.PendingProposal = false;
        $scope.SubmittedProposal = false;
        $scope.flagDashboard = false;
        $scope.disable = stageFlag;
        for (var i = 0; i < $scope.getAllProposalFromReviewer.length; i++) {
            if ($scope.getAllProposalFromReviewer[i].Id == projectId) {
                $scope.projectDetails(selectedReviewerMapId, $scope.getAllProposalFromReviewer[i], prop_stage, programme);
            }
        }
        $scope.getProposalDocuments(projectId);                   
    }

    $scope.projectDetails = function (selectedReviewerMapId, project, prop_stage, programme) {
        debugger;
        $scope.flag = false;
        $scope.flagProjectDet = false;
        $scope.selectedProject = project;
        $scope.reviewerMapId = selectedReviewerMapId;
        if ($scope.selectedProject.Reviewer_Mapping__r.length > 0) {
            $scope.selectedReviewerMap = $scope.selectedProject.Reviewer_Mapping__r.find(function (item) {
                return item.Id === $scope.reviewerMapId;
            });
        }
        $scope.getAllQuestionLineItem(project.Question_Template__c, project.Id, prop_stage, programme);
    }

    $scope.downloadDetails = function (docId) {
        debugger;
        let anchorTagA = document.createElement('a');
        // var baseURL = {!$Label.Proposal_Download_URL}; //'{!$Label.Proposal_Download_URL}' + 
        //  anchorTagA.href = '{!$Label.Proposal_Download_URL}'+'servlet/servlet.FileDownload?file=' + docId;
        anchorTagA.href = '/Reviewer/servlet/servlet.FileDownload?file=' + docId;

        // let bug =  anchorTagA.href;
        //  let repValue = bug.replace("%7B!$Label.Proposal_Download_URL%7D", "servlet");
        window.open(anchorTagA.href, '_blank');
        console.log('=============>', anchorTagA.href);
        //  anchorTagA.download = 'downloadPdf';
        //  anchorTagA.click();

    }

    $scope.getAllQuestionLineItem = function (QuesTempId, ProposalId, prop_stage, programme) {
        debugger
        if (prop_stage == undefined || prop_stage == null) {
            prop_stage = '1st Stage';
        }
        ReviewerPortal_Controller.getAllQLIAndRRLI(QuesTempId, $scope.reviewerMapId, prop_stage, programme, function (result, event) {
            debugger
            console.log('all questions');
            console.log(result);
            var rating = 0;
            $scope.totalRating = 0;
            if (event.status && result != null) {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].RRLineItemList != undefined) {
                        if (result[i].RRLineItemList.Ratings__c != undefined) {
                            try {
                                result[i].RRLineItemList.Ratings__c = parseFloat(result[i].RRLineItemList.Ratings__c);
                                if (result[i].getQuesLineItemList.Is_Rating_Applicable__c) {
                                    rating = parseFloat(rating) + parseFloat(result[i].RRLineItemList.Ratings__c);
                                }
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        if (result[i].RRLineItemList.Response__c != undefined) {
                            try {
                                result[i].RRLineItemList.Response__c = result[i].RRLineItemList.Response__c ? result[i].RRLineItemList.Response__c.replace(/&amp;/g, '&').replace(/&#39;/g, '\'').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].RRLineItemList.Response__c;
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }
                    if (result[i].getQuesLineItemList.Is_Rating_Applicable__c) {
                        console.log(result[i].getQuesLineItemList.Maximum_Score__c);
                        //$scope.totalRating=$scope.totalRating+10;
                        $scope.totalRating = $scope.totalRating + result[i].getQuesLineItemList.Maximum_Score__c;
                    }
                }
                // $scope.ratingScore=(rating/result.length).toFixed(2);
                //$scope.totalRating=(result.length*10);
                $scope.ratingScore = rating
                $scope.ratingScore = $scope.ratingScore.toFixed(1);
                $scope.QuestionTempList = result;
                if ($scope.QuestionTempList.length > 0) {
                    // if(result[0].rmStage == 'Submitted'){
                    //     $scope.disable = true;
                    // }                                
                }
                $scope.$apply();
            }
            $scope.getReviewersDet(QuesTempId, ProposalId);
        })
    }

    $scope.getReviewersDet = function (QuesTempId, ProposalId) {
        debugger
        ReviewerPortal_Controller.getReviewersDet(QuesTempId, $scope.reviewerMapId, ProposalId, reviewerId, function (result, event) {
            debugger;
            console.log('reviewer det');
            console.log(result);
            console.log(event);
            if (event.status && result != null) {
                $scope.reviewerData = result;
                $scope.objReviewer = result.Reviewer__r;
                $scope.$apply();
            }
            $scope.getProposalDetails(ProposalId);
        })
    }
    $scope.showReviewerReponse = function (index) {
        if ($scope.disable == true) {
            var objIndexData = $scope.reviewerData[index].Reviewer_Response_LineItem__r;
            $scope.ObjResponse = null;
            $scope.ObjResponse = objIndexData;
            $scope.divReviewerResponse = false;
            $scope.$apply();
        }
    }
    $scope.validateRating = function (index, rating) {
        debugger
        if (rating < 1 || rating == null) {
            $("#spnRating" + index + "").show();
            $("#txtRating" + index + "").addClass('border-theme');
        }/*else if(rating>10){
            $scope.QuestionTempList[index].RRLineItemList.Ratings__c=10;
            $("#spnRating"+index+"").hide();
            $("#txtRating"+index+"").removeClass('border-theme');
        }*/
        else if (rating > 0 && rating < 10) {
            $("#spnRating" + index + "").hide();
            $("#txtRating" + index + "").removeClass('border-theme');
        }
        var arrRat = rating.toString().split('.');
        if (arrRat.length > 1) {
            var decimalval = arrRat[1].toString()[0];
            // var wholeNo=arrRat[0].toString();
            rating = parseFloat(arrRat[0].toString() + '.' + decimalval);
            $scope.QuestionTempList[index].RRLineItemList.Ratings__c = rating;
        }
        if (rating == null || rating == undefined) {
            rating = 0;
        }
        var rating = 0;
        for (var i = 0; i < $scope.QuestionTempList.length; i++) {
            if ($scope.QuestionTempList[i].RRLineItemList != undefined) {
                if ($scope.QuestionTempList[i].RRLineItemList.Ratings__c != undefined) {
                    try {
                        if ($scope.QuestionTempList[i].getQuesLineItemList.Is_Rating_Applicable__c)
                            rating = parseFloat(rating) + parseFloat($scope.QuestionTempList[i].RRLineItemList.Ratings__c);
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
        // $scope.ratingScore=(rating/$scope.QuestionTempList.length).toFixed(2);
        $scope.ratingScore = rating.toFixed(1);
    }
    $scope.submitResponseDetail = function (param1) {
        debugger;
        $scope.showSpinner = true;
        for (var i = 0; i < $scope.QuestionTempList.length; i++) {
            if ($scope.QuestionTempList[i] != undefined) {
                if (param1 == 'Submitted') {
                    if ($scope.QuestionTempList[i].RRLineItemList == undefined) {
                        $scope.showSpinner = false;
                        swal('Reviews', 'Please provide ratings & comments on all questions', 'error');
                        return
                    }
                    if ($scope.QuestionTempList[i].getQuesLineItemList.Is_Rating_Applicable__c) {
                        if ($scope.QuestionTempList[i].RRLineItemList.Ratings__c == undefined || $scope.QuestionTempList[i].RRLineItemList.Ratings__c == "") {
                            $scope.showSpinner = false;
                            swal('Reviews', 'Please provide ratings & comments on all questions', 'error');
                            return
                        }
                        if ($scope.QuestionTempList[i].RRLineItemList.Ratings__c < 1) {
                            $("#spnRating" + i + "").show();
                            $("#txtRating" + i + "").addClass('border-theme');
                            $scope.showSpinner = false;
                            swal('Reviews', 'Please enter rating between 1 to 10', 'error');
                            return;
                        }
                    }
                    if ($scope.QuestionTempList[i].getQuesLineItemList.Is_Comment_Applicable__c) {
                        if ($scope.QuestionTempList[i].RRLineItemList.Response__c == undefined || $scope.QuestionTempList[i].RRLineItemList.Response__c == "") {
                            $scope.showSpinner = false;
                            swal('Reviews', 'Please provide ratings & comments on all questions', 'error');
                            return
                        }
                    }
                }
                if ($scope.QuestionTempList[i]['$$hashKey'] != undefined) {
                    delete ($scope.QuestionTempList[i]['$$hashKey']);
                }
                if ($scope.QuestionTempList[i].getQuesLineItemList.Reviewer_Response_LineItem__r != undefined) {
                    delete ($scope.QuestionTempList[i].getQuesLineItemList.Reviewer_Response_LineItem__r);
                }
            }
        }
        $scope.qtList = [];
        for (var i = 0; i < $scope.QuestionTempList.length; i++) {
            if ($scope.QuestionTempList[i] != undefined) {
                if ($scope.QuestionTempList[i].RRLineItemList != undefined) {
                    if ($scope.QuestionTempList[i].RRLineItemList.Ratings__c != undefined) {
                        $scope.QuestionTempList[i].RRLineItemList.Ratings__c = $scope.QuestionTempList[i].RRLineItemList.Ratings__c.toString();
                    }
                    $scope.qtList.push($scope.QuestionTempList[i]);
                    if (($scope.QuestionTempList[i].RRLineItemList.Ratings__c == undefined || $scope.QuestionTempList[i].RRLineItemList.Ratings__c == "") &&
                        ($scope.QuestionTempList[i].RRLineItemList.Response__c == undefined || $scope.QuestionTempList[i].RRLineItemList.Response__c == "") &&
                        ($scope.QuestionTempList[i].RRLineItemList.Grade_Value__c == undefined || $scope.QuestionTempList[i].RRLineItemList.Grade_Value__c == "")) {
                        $scope.QuestionTempList.splice(i, 0);
                    }
                }
            }
        }

        console.log("submit data");
        console.log($scope.qtList);
        console.log(param1)
        ReviewerPortal_Controller.getAllResponseLineItem($scope.qtList, $scope.reviewerMapId, param1, $scope.ratingScore, $scope.totalRating, function (result, event) {
            console.log('submit response');
            console.log(result);
            console.log(event);
            if (event.status && result != null) {
                if (param1 == 'Draft') {
                    $scope.disable = false;
                } else if (param1 == 'Submitted') {
                    $scope.disable = true;
                }
                $scope.showSpinner = false;
                Swal.fire('',
                    'Record Saved Successfully !',
                    'success'

                );
                // $scope.redirectPageURL('ReviewerHome');
                // var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/Reviewer';
                // window.location.replace(window.location.origin +sitePrefix+"/ReviewerPortal?id="+hashcode+"#/ReviewerHome"); 
                location.reload();
                $scope.$apply();
                debugger;

            }
        })
    }


    $scope.backFromDetail = function () {
        $scope.flag = true;
    }


    $scope.redirectPageURL = function (pageName) {
        debugger;
        var link = document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href = "#/" + pageName;
        link.click();
    }
    $scope.showDraft = function () {
        debugger;
        $scope.flagDashboard = false;
        $scope.showDashboard = true;
        $scope.flag = true;
        $scope.PendingProposal = false;
        $scope.clearProgrammeFilter();
        $scope.clearStatusFilter();
        $scope.showAllProgrammeFilter = false;
        $scope.showDraftProgrammeFilter = false;
        $scope.showPendingProgrammeFilter = false;
        $scope.showSubmittedProgrammeFilter = false;
        $scope.showStatusFilter = false;
        $scope.DraftProposal = true;
        $scope.SubmittedProposal = false;
        $scope.showProfile = true;
        $scope.flagProjectDet = true;
        $scope.showHome = true;
        $scope.myReviews = false;
    }
    $scope.showPending = function () {
        debugger;
        $scope.flagDashboard = false;
        $scope.flag = true;
        $scope.showDashboard = true;
        $scope.PendingProposal = true;
        $scope.clearProgrammeFilter();
        $scope.clearStatusFilter();
        $scope.showAllProgrammeFilter = false;
        $scope.showDraftProgrammeFilter = false;
        $scope.showPendingProgrammeFilter = false;
        $scope.showSubmittedProgrammeFilter = false;
        $scope.showStatusFilter = false;
        $scope.DraftProposal = false;
        $scope.showProfile = true;
        $scope.SubmittedProposal = false;
        $scope.flagProjectDet = true;
        $scope.showHome = true;
        $scope.myReviews = false;
    }
    $scope.showSubmitted = function () {
        debugger;
        $scope.flagDashboard = false;
        $scope.flag = true;
        $scope.showDashboard = true;
        $scope.showProfile = true;
        $scope.PendingProposal = false;
        $scope.DraftProposal = false;
        $scope.clearProgrammeFilter();
        $scope.clearStatusFilter();
        $scope.showAllProgrammeFilter = false;
        $scope.showDraftProgrammeFilter = false;
        $scope.showPendingProgrammeFilter = false;
        $scope.showSubmittedProgrammeFilter = false;
        $scope.showStatusFilter = false;
        $scope.SubmittedProposal = true;
        $scope.flagProjectDet = true;
        $scope.showHome = true;
        $scope.myReviews = false;
    }
    $scope.showReviewerReviews = function () {
        $scope.flagDashboard = false;
        $scope.flag = true;
        $scope.showDashboard = true;
        $scope.showProfile = true;
        $scope.PendingProposal = false;
        $scope.DraftProposal = false;
        $scope.SubmittedProposal = false;
        $scope.flagProjectDet = true;
        $scope.showHome = true;
        $scope.myReviews = true;
    }
    $scope.showAllProposals = function () {
        $scope.flag = true;
        $scope.showProfile = true;
        $scope.flagDashboard = true;
        $scope.showDashboard = true;
        $scope.PendingProposal = false;
        $scope.clearProgrammeFilter();
        $scope.clearStatusFilter();
        $scope.showAllProgrammeFilter = false;
        $scope.showDraftProgrammeFilter = false;
        $scope.showPendingProgrammeFilter = false;
        $scope.showSubmittedProgrammeFilter = false;
        $scope.showStatusFilter = false;
        $scope.DraftProposal = false;
        $scope.SubmittedProposal = false;
        $scope.flagProjectDet = true;
        $scope.showHome = true;
        $scope.myReviews = false;
    }
    $scope.showHome = function () {
        $scope.flag = false;
        $scope.PendingProposal = false;
        $scope.DraftProposal = false;
        $scope.showProfile = true;
        $scope.showDashboard = true;
        $scope.SubmittedProposal = false;
        $scope.showHome = false;
        $scope.flagProjectDet = true;
        $scope.myReviews = false;
    }
    $scope.backToList = function () {
        $scope.flag = true;
        $scope.flagProjectDet = true;
        $scope.showDashboard = true;
    }
    $scope.redirect = function () {

        // var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ReviewerPortal';   
        window.location.replace(window.location.origin + '/Reviewer');

    }
    $scope.ratingNgRepeat = 1;
    $scope.setRating = function (val, index) {
        debugger
        $scope.ratingNgRepeat = 0;
        if ($scope.QuestionTempList[index].RRLineItemList == undefined) {
            $scope.QuestionTempList[index].RRLineItemList = {
                Ratings__c: ''
            };
        }
        $scope.QuestionTempList[index].RRLineItemList.Ratings__c = 0;
        $scope.QuestionTempList[index].RRLineItemList.Ratings__c = val;
        $scope.$apply();
    }
    $scope.setGrade = function (val, index) {
        debugger
        if ($scope.QuestionTempList[index].RRLineItemList == undefined) {
            $scope.QuestionTempList[index].RRLineItemList = {
                Grade_Value__c: ''
            };
        }
        $scope.QuestionTempList[index].RRLineItemList.Grade_Value__c = val;
        $scope.$apply();
    }
    $scope.signOutReviewer = function () {
        ReviewerPortal_Controller.LogoutReviewer($rootScope.hashCodeReviewer, function (result, event) {
            debugger
            console.log(result);
            console.log(event);
            if (event.status) {
                $rootScope.reviewerEmail = '';
                $rootScope.reviewerName = '';
                $scope.redirect();
                $scope.$apply();
            }
        });
    }
    // $scope.closeAllMenus=function(){
    //     debugger
    //     $('.dropdown-menu').hide();
    // }
    // $scope.setuserProfile=function(){
    //     $("#dropDownTop").show();
    // }
    $scope.getProjectdetils = function () {
        debugger;
        // var jj=RID;
        ReviewerPortal_Controller.getReviewerUserDoc($rootScope.reviewersIdd, function (result, event) {
            debugger
            console.log('result return for user documents :: ');
            console.log(result);
            if (event.status) {
                $scope.allDocs = result;
                if (result != undefined) {
                    for (var i = 0; i < $scope.allDocs.length; i++) {
                        if ($scope.allDocs[i].userDocument.Name == 'Profile Picture') {
                            $scope.docU = $scope.allDocs[i];
                        }
                    }
                }

                $scope.$apply();
            }
        }, {
            escape: true
        })
    }

    $scope.getProjectdetils();

    $scope.uploadFile = function (type, userDocId, fileId, fileSizeFun, fileSizeMin) {
        debugger;
        maxFileSize = fileSizeFun;
        // if(userDocId == )
        $scope.showSpinnereditProf = true;
        var file;

        file = document.getElementById("profilePic").files[0];

        fileName = file.name;
        var typeOfFile = fileName.split(".");
        lengthOfType = typeOfFile.length;
        if (typeOfFile[lengthOfType - 1] == "jpg" || typeOfFile[lengthOfType - 1] == "jpeg" || typeOfFile[lengthOfType - 1] == "JPEG" || typeOfFile[lengthOfType - 1] == "JPG") {

        } else {
            swal('info', 'Please choose jpg/jpeg file only.', 'info');
            $scope.setLostValues();
            return;
        }
        console.log(file);

        if (file != undefined) {
            if (file.size <= maxFileSize) {
                if (file.size < fileSizeMin) {
                    swal("info", "File must be between 30 to 500 kb in size.  Your file is too small.  Please try again.", "info");
                    $scope.setLostValues();
                    return;
                    // alert("File must be between 30 to 50 kb in size.  Your file is too small.  Please try again.");
                    // return;
                }
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
                    if (fileSize < fileSizeFun) {
                        $scope.uploadAttachment(type, userDocId, fileId);
                    } else {
                        swal("info", "Base 64 Encoded file is too large.  Maximum size is 512000 your file is " + fileSize + ".", "info");
                        $scope.setLostValues();
                        return;
                        // alert("Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".");
                    }

                }
                fileReader.onerror = function (e) {
                    swal("info", "There was an error reading the file.  Please try again.", "info");
                    $scope.setLostValues();
                    return;
                    // alert("There was an error reading the file.  Please try again.");
                }
                fileReader.onabort = function (e) {
                    swal("info", "There was an error reading the file.  Please try again.", "info");
                    $scope.setLostValues();
                    return;
                    // alert("There was an error reading the file.  Please try again.");
                }

                fileReader.readAsBinaryString(file);  //Read the body of the file

            } else {
                swal("info", "File must be under 500 kb in size.  Your file is too large.  Please try again.", "info");
                $scope.setLostValues();
                // $scope.getContactWiser();
                return;
                // alert("File must be under 50 kb in size.  Your file is too large.  Please try again.");
                $scope.showSpinnereditProf = false;
            }
        } else {
            swal("info", "You must choose a file before trying to upload it", "info");
            $scope.setLostValues();
            return;
            // alert("You must choose a file before trying to upload it");
            $scope.showSpinnereditProf = false;
        }
    }
    $scope.selectedFile;

    $scope.filePreviewHandler = function (fileContent) {
        debugger;
        $scope.selectedFile = fileContent;

        console.log('selectedFile---', $scope.selectedFile);

        $('#file_frame').attr('src', $scope.selectedFile.ContentDistribution.DistributionPublicUrl);

        var myModal = new bootstrap.Modal(document.getElementById('filePreview'))
        myModal.show('slow');
        $scope.$apply();

        //.ContentDistribution.DistributionPublicUrl
    }
    $scope.uploadAttachment = function (type, userDocId, fileId) {
        debugger;
        var attachmentBody = "";
        if (fileId == undefined) {
            fileId = " ";
        }
        if (userDocId == undefined) {
            userDocId = " ";
        }
        if (fileSize <= positionIndex + chunkSize) {
            debugger;
            attachmentBody = attachment.substring(positionIndex);
            doneUploading = true;
        } else {
            attachmentBody = attachment.substring(positionIndex, positionIndex + chunkSize);
        }
        console.log("Uploading " + attachmentBody.length + " chars of " + fileSize);
        ReviewerPortal_Controller.doUploadProfilePicReviewer(
            $rootScope.reviewersIdd, attachmentBody, attachmentName,
            function (result, event) {
                console.log(result);
                if (event.type === 'exception') {
                    console.log("exception");
                    console.log(event);
                } else if (event.status) {
                    if (doneUploading == true) {
                        //$scope.objContact.Uploaded__c = true;
                        swal(
                            'success',
                            'Uploaded successfully.',
                            'success'
                        );

                    }
                    $scope.showUplaodUserDoc = false;

                } else {
                    debugger;
                    positionIndex += chunkSize;
                    $scope.uploadAttachment(type, userDocId, result);
                }
            },


            { buffer: true, escape: true, timeout: 120000 }
        );
    }

    $scope.imageUpload = function (event) {
        var files = event.target.files; //FileList object

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = $scope.imageIsLoaded;
            reader.readAsDataURL(file);
        }
    }

    $scope.imageIsLoaded = function (e) {
        $scope.$apply(function () {
            $scope.stepsModel.push(e.target.result);
        });
    }
    // $scope.uploadAttachment = function (type, userDocId, fileId) {
    //     debugger;
    //     var attachmentBody = "";
    //     if (fileId == undefined) {
    //         fileId = " ";
    //     }
    //     if (fileSize <= positionIndex + chunkSize) {
    //         debugger;
    //         attachmentBody = attachment.substring(positionIndex);
    //         doneUploading = true;
    //     } else {
    //         attachmentBody = attachment.substring(positionIndex, positionIndex + chunkSize);
    //     }
    //     console.log("Uploading " + attachmentBody.length + " chars of " + fileSize);
    //     ReviewerPortal_Controller.doCUploadAttachmentReviewer(
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

    //                     }
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
    $scope.tabToggle = function (tabId) {
        debugger
        $("#home,#existingGrants,#askedGrants,#workPackages,#proposalSummary,#divFiles,#divReview").hide();
        $("div[name=divTopTables]").hide();
        $("#" + tabId + "").show('slow');
    }
    $scope.accordianToggleInd = function (accordianId, index) {
        debugger
        $("#collapseOne,#collapseTwo,#collapseThree,#collapseFour").hide();
        $("#" + accordianId + "" + index + "").show();
    }
    $scope.accordianToggleWiser = function (accordianId) {
        debugger
        $("#collapseWiserOne,#collapseWiserTwo").hide();
        $("#" + accordianId + "").show();
    }
    $scope.accordianToggle = function (accordianId) {
        debugger
        $("#collapseOne,#collapseTwo,#collapseThree,#collapseFour").hide();
        $("#" + accordianId + "").show();
    }
});
angular.directive("ngFileSelect", function ($scope, $rootScope, fileReader) {
    debugger;
    return {
        scope: {
            ngModel: '='
        },
        link: function ($scope, el) {
            function getFile(file) {
                fileReader.readAsDataUrl(file, $scope)
                    .then(function (result) {
                        $timeout(function () {
                            $scope.ngModel = result;
                        });
                    });
            }

            el.bind("change", function (e) {
                var file = (e.srcElement || e.target).files[0];
                getFile(file);
            });
        }
    };
});

angular.factory("fileReader", function ($q, $log) {
    var onLoad = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    var onProgress = function (reader, scope) {
        return function (event) {
            scope.$broadcast("fileProgress", {
                total: event.total,
                loaded: event.loaded
            });
        };
    };

    var getReader = function (deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };

    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL
    };
});