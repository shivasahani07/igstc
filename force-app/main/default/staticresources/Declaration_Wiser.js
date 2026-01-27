angular.module('cp_app').controller('declarationwiser_ctrl', function ($scope, $sce, $rootScope) {
    debugger;

    $scope.siteURL = siteURL;
    $scope.decDetails = {};
    $scope.SignDate = new Date($rootScope.signDate);
    $scope.disableUploadButton = true;
    $scope.proposalStage = false;

    var maxStringSize = 6000000;
    var chunkSize = 750000;

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
        if (localStorage.getItem('contactId')) {
            $rootScope.contactId = localStorage.getItem('contactId');
            $scope.contactId = $rootScope.contactId;
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

    $scope.getDeclarationfields = function () {
        debugger;
        ApplicantPortal_Contoller.getDeclarationfields($rootScope.contactId, function (result, event) {
            debugger;
            if (event.status && result) {
                if (result != null) {
                    if (result.Declaration_Sign_Date__c != undefined) {
                        $scope.SignDate = new Date(result.Declaration_Sign_Date__c);
                    }
                    $scope.decDetails = result;
                }
                debugger;
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }
    $scope.getDeclarationfields();

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

    $scope.getProjectdetils = function () {
        debugger;
        $scope.selectedFile = '';
        $('#file_frame').attr('src', '');
        console.log('Calling getContactUserDoc with contactId:', $rootScope.contactId, 'proposalId:', $rootScope.proposalId);
        if (!$rootScope.contactId || !$rootScope.proposalId) {
            console.log('Missing contactId or proposalId');
            return;
        }
        ApplicantPortal_Contoller.getContactUserDoc($rootScope.contactId, $rootScope.proposalId, function (result, event) {
            debugger
            console.log('result return onload :: ');
            console.log(result);
            console.log('event:', event);
            if (event.status) {
                $scope.allDocs = result;
                for (var i = 0; i < $scope.allDocs.length; i++) {
                    if ($scope.allDocs[i].userDocument.Name == 'Signature') {
                        $scope.doc = $scope.allDocs[i];
                    }
                }
                $scope.$apply();
            } else {
                console.log('Error in getContactUserDoc:', event.message);
            }
        }, {
            escape: true
        })
    }
    $scope.getProjectdetils();



    $scope.saveDetails = function () {
        debugger;
        var year = 0;
        var month = 0;
        var day = 0;

        if ($scope.SignDate != undefined && $scope.SignDate != '') {
            year = $scope.SignDate.getUTCFullYear();
            month = $scope.SignDate.getUTCMonth() + 1;
            day = $scope.SignDate.getDate();
        }

        ApplicantPortal_Contoller.upsertSign($scope.decDetails, year, month, day, function (result, event) {
            if (event.status) {
                debugger;
                Swal.fire(
                    'Success',
                    'Your data has been saved successfully.',
                    'success'
                );
                $scope.redirectPageURL('Home');
                $scope.decDetails = result;
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }

    $scope.insertWiserDraft = function () {
        debugger;
        var day = 0;
        var month = 0;
        var year = 0;
        if ($scope.SignDate != undefined && $scope.SignDate != '') {
            year = $scope.SignDate.getUTCFullYear();
            month = $scope.SignDate.getUTCMonth() + 1;
            day = $scope.SignDate.getDate();
            // delete $scope.objContact.Birthdate;
        }

        for (var i = 0; i < $scope.allDocs.length; i++) {
            if ($scope.allDocs[i].userDocument.Name == 'Signature') {
                if ($scope.allDocs[i].userDocument.Status__c != 'Uploaded') {
                    swal('info', 'Please upload signature.', 'info');
                    return;
                }
            }
        }
        ApplicantPortal_Contoller.insertWiserDraft(
            $rootScope.projectId, day, month, year,
            function (result, event) {
                if (event.status) {

                    swal("Success", "Your Proposal has been saved as Draft.", "success");

                    setTimeout(function () {
                        $scope.redirectPageURL('Home');
                        $scope.$apply();
                    }, 1200); // 1 second

                    $scope.grantList = result;
                }
            },
            { escape: true }
        );

        // ApplicantPortal_Contoller.insertWiserDraft($rootScope.projectId, day, month, year, function (result, event) {
        //     if (event.status) {
        //         debugger;
        //         Swal.fire(
        //             'success',
        //             'Your Proposal has been saved as Draft .',
        //             'success'
        //         );
        //         $scope.redirectPageURL('Home');
        //         $scope.grantList = result;
        //         $scope.$apply();
        //     }
        // },
        //     { escape: true }
        // )
    }
    $scope.reviewApp = function () {
        debugger
        $("#btnPreview").html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Generating...');
        ApplicantPortal_Contoller.reviewAppDocGen($rootScope.projectId, function (result, event) {
            console.log("now call for doc");
            console.log(result);
            setTimeout(
                function () {
                    $("#btnPreview").html('<i class="fa-solid fa-eye me-2"></i>Review');
                    $scope.getDoc();
                    $scope.$digest();
                },
                30000);
        });
    }
    $scope.getDoc = function () {
        ApplicantPortal_Contoller.getCongaDoc($rootScope.projectId, function (result, event) {
            debugger
            console.log("attachamnet id");
            console.log(result);
            if (result.length < 1) {
                swal('', 'Document generation fail, please try again or contact to support.', 'error');
                return;
            }
            let baseUrl = window.location.origin;
            $scope.fileUrl = $sce.trustAsResourceUrl(baseUrl + '/servlet/servlet.FileDownload?file=' + result[0].Id + '#view=FitH');
            var myModal = new bootstrap.Modal(document.getElementById('filePreview2'))
            myModal.show('slow');
            $scope.$apply();
        });
    }
    $scope.finalSubmitWiser = function () {
        debugger;
        var day = 0;
        var month = 0;
        var year = 0;
        if ($scope.SignDate != undefined && $scope.SignDate != '') {
            year = $scope.SignDate.getUTCFullYear();
            month = $scope.SignDate.getUTCMonth() + 1;
            day = $scope.SignDate.getDate();
            // delete $scope.objContact.Birthdate;
        }

        for (var i = 0; i < $scope.allDocs.length; i++) {
            if ($scope.allDocs[i].userDocument.Name == 'Signature') {
                if ($scope.allDocs[i].userDocument.Status__c != 'Uploaded') {
                    swal('info', 'Please upload signature.', 'info');
                    return;
                }
            }
        }

        swal({
            title: "Are you sure?",
            text: "Are you sure? Once the proposal is submitted, it cannot be edited.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    // ApplicantPortal_Contoller.finalSubmitWiser($rootScope.projectId, $rootScope.contactId, day, month, year, function (result, event) {
                    // ApplicantPortal_Contoller.finalSubmitWiser($rootScope.proposalId, $rootScope.contactId, $rootScope.apaId, day, month, year, function (result, event) {
                    //     if (event.status) {
                    //         debugger;
                    //         $rootScope.proposalStage = true;
                    //         CKEDITOR.config.readOnly = true;
                    //         swal(
                    //             'Success',
                    //             'Your proposal has been submitted successfully.',
                    //             'success'
                    //         );
                    //         $scope.redirectPageURL('Home');
                    //         $scope.proposalDetails = result;
                    //         $scope.$apply();
                    //     }
                    // },
                    //     { escape: true }
                    // );

                    ApplicantPortal_Contoller.finalSubmitWiser(
                        $rootScope.proposalId, $rootScope.contactId, $rootScope.apaId, day, month, year, function (result, event) {
                            if (event.status) {
                                debugger;

                                // Lock current user if submitted
                                $rootScope.isCurrentUserSubmitted = result.isCurrentUserSubmitted;

                                // Lock entire proposal if completed
                                $rootScope.proposalStage = result.isProposalCompleted;

                                // Lock editor accordingly
                                if (result.isCurrentUserSubmitted || result.isProposalCompleted) {
                                    CKEDITOR.config.readOnly = true;
                                }

                                swal(
                                    'Success',
                                    result.message,
                                    'success'
                                );

                                if (result.isProposalCompleted) {
                                    $scope.redirectPageURL('Home');
                                }

                                $scope.$apply();
                            }
                        },
                        { escape: true }
                    );

                }
            });

        // ApplicantPortal_Contoller.finalSubmitWiser($rootScope.projectId,day,month,year, function(result, event){
        //     if(event.status){
        //      debugger;
        //      $scope.redirectPageURL('Home');
        //      $scope.grantList = result;
        //      $scope.$apply();  
        //  }
        // },
        // {escape:true}
        // )
    }

    // $scope.createUserDocument = function(){
    //     debugger;
    //     ApplicantPortal_Contoller.createUserDocument("", $rootScope.contactId, $rootScope.projectId,"", function(result,event){
    //         debugger;
    //         if(event.status && result){
    //             if(result != null){
    //                 $scope.uploadFile('sign',result,'');
    //             }
    //             debugger;
    //             $scope.$apply();
    //         }
    //     },
    //                                               {escape: true}
    //                                              )
    // }

    $scope.uploadFile = function (type, userDocId, fileId, maxSize, minFileSize) {
        debugger;
        $scope.showSpinnereditProf = true;
        var file;

        file = document.getElementById(type).files[0];
        fileName = file.name;
        var typeOfFile = fileName.split(".");
        lengthOfType = typeOfFile.length;
        if (typeOfFile[lengthOfType - 1] == "jpg" || typeOfFile[lengthOfType - 1] == "jpeg") {

        } else {
            swal('info', 'Please choose jpg/jpeg file only.', 'info');
            return;
        }
        console.log(file);
        maxFileSize = maxSize;
        if (file != undefined) {
            if (file.size <= maxFileSize) {
                if (file.size < minFileSize) {
                    swal('info', 'Your file is too small. Please try again.', 'info');
                    return;
                    // alert("Your file is too small. Please try again.");
                    // return;
                }
                attachmentName = file.name;
                const myArr = attachmentName.split(".");
                var fileReader = new FileReader();
                fileReader.onloadend = function (e) {
                    attachment = window.btoa(this.result);  //Base 64 encode the file before sending it
                    positionIndex = 0;
                    fileSize = attachment.length;
                    $scope.showSpinnereditProf = false;
                    console.log("Total Attachment Length: " + fileSize);
                    doneUploading = false;
                    debugger;
                    if (fileSize < maxStringSize) {
                        $scope.uploadAttachment(type, userDocId, null);
                    } else {
                        swal('info', 'Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".', 'info');
                        return;
                        // alert("Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".");
                    }

                }
                fileReader.onerror = function (e) {
                    swal('info', 'There was an error reading the file.  Please try again.', 'info');
                    return;
                    // alert("There was an error reading the file.  Please try again.");
                }
                fileReader.onabort = function (e) {
                    swal('info', 'There was an error reading the file.  Please try again.', 'info');
                    return;
                    // alert("There was an error reading the file.  Please try again.");
                }

                fileReader.readAsBinaryString(file);  //Read the body of the file

            } else {
                swal('info', 'Your file is too large.  Please try again.', 'info');
                return;
                // alert("Your file is too large.  Please try again.");
                $scope.showSpinnereditProf = false;
            }
        } else {
            swal('info', 'You must choose a file before trying to upload it', 'info');
            return;
            // alert("You must choose a file before trying to upload it");
            $scope.showSpinnereditProf = false;
        }
    }

    $scope.uploadAttachment = function (type, userDocId, fileId) {
        debugger;
        var attachmentBody = "";
        // if (fileId == undefined) {
        //     fileId = " ";
        // }
        if (fileSize <= positionIndex + chunkSize) {
            debugger;
            attachmentBody = attachment.substring(positionIndex);
            doneUploading = true;
        } else {
            attachmentBody = attachment.substring(positionIndex, positionIndex + chunkSize);
        }
        console.log("Uploading " + attachmentBody.length + " chars of " + fileSize);
        ApplicantPortal_Contoller.doCUploadAttachmentSignature(
            attachmentBody, attachmentName, fileId, userDocId,
            function (result, event) {
                console.log(result);
                if (event.type === 'exception') {
                    console.log("exception");
                    console.log(event);
                } else if (event.status) {
                    if (doneUploading == true) {
                        $scope.getProjectdetils();
                        swal(
                            'success',
                            'Uploaded Successfully!',
                            'success'
                        )

                        $scope.getProjectdetils();
                        // $scope.disableSubmit = false;

                    }
                    $scope.showUplaodUserDoc = false;
                    // $scope.getCandidateDetails();

                } else {
                    debugger;
                    positionIndex += chunkSize;
                    $scope.uploadAttachment(type, userDocId, result);
                }
            },


            { buffer: true, escape: true, timeout: 120000 }
        );
    }

    $scope.redirectPageURL = function (pageName) {
        debugger;
        debugger;
        var link = document.createElement("a");
        // Get current base URL dynamically (no hard coding)
        let baseUrl = link.baseURI;
        // Remove hash part ( #/something )
        if (baseUrl.includes('#/')) {
            baseUrl = baseUrl.split('#/')[0];
        }
        if (pageName === 'Home') {
            // Get id and campaign from current URL dynamically
            let urlParams = new URLSearchParams(window.location.search);
            let id = urlParams.get("id") || "";
            let campaign = '2plus2';
            // Build final HOME URL format dynamically
            let finalUrl = baseUrl;
            if (campaign) {
                // finalUrl += "&campaign=" + campaign;
            }
            // finalUrl += "#/Home";
            finalUrl;
            link.href = finalUrl;
            link.click();

        } else {
            // For other pages → keep same base + hash routing
            link.href = baseUrl + "#/" + pageName;
            link.click();
        }
    }

});