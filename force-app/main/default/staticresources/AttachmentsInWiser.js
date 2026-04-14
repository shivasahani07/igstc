angular.module('cp_app').controller('attachmentWiser_ctrl', function ($scope, $sce, $rootScope) {

    $scope.objContact = {};
    $scope.disableSubmit = true;
    $scope.allDocs = {};
    $scope.doc = {};
    $scope.allSixDoc = {};
    $scope.proposalStage = false;

    // Loading states for file uploads
    $scope.uploadingNOC = false;
    $scope.uploadingProjectProposal = false;


    // Salesforce Apex RemoteAction String parameter limit is 6MB for individual String parameters
    // When chunks are appended in Apex, we need to ensure total doesn't exceed 6MB
    // Using 400KB chunks allows up to 15 chunks (6MB total) to support files up to ~4.5MB
    // A 4.9MB file becomes ~6.52MB Base64 encoded, which requires careful chunking
    var maxStringSize = 6000000; // 6MB - Salesforce Apex RemoteAction String parameter limit
    var chunkSize = 400000; // 400KB chunks - allows more chunks before hitting 6MB limit when accumulated

    debugger;
    $scope.redirectPageURL = function (URL) {
        var link = document.createElement("a");
        link.id = 'someLink';
        link.href = '#/' + URL + '';
        link.click();
    }

    /**
     * Downloads a Word file from the provided link
     * Currently uses a dummy link for testing
     * TODO: Replace dummyWordFileUrl with the actual Word file URL when available
     */
    $scope.downloadWordFile = function () {
        debugger;
        // Dummy link for Word file download - replace with actual link when available
        // Example: var wordFileUrl = 'https://example.com/path/to/template.docx';
        var dummyWordFileUrl = 'https://file-examples.com/storage/fe68c1c0e6c4e0c2c0e6c4e/2017/10/file_example_DOCX_10.docx';

        // Create a temporary anchor element to trigger download
        var link = document.createElement("a");
        link.href = dummyWordFileUrl;
        link.download = 'template.docx'; // Suggested filename for download
        link.target = '_blank'; // Open in new tab as fallback

        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Note: If the URL doesn't support CORS or download attribute,
        // the file will open in a new tab instead
    }

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

    /* ===============================
       WATCH FOR REQUIRED IDS (CRITICAL FIX)
    =============================== */

    let initialized = false;

    $scope.$watch(
        function () {
            return $rootScope.apaId && $rootScope.proposalId;
        },
        function (ready) {
            if (ready && !initialized) {
                initialized = true;

                $scope.getProposalStage();
                $scope.getProjectdetils();
                $scope.getProjectProposalDoc();
            }
        }
    );

    // $scope.getApplicantStatusFromAPA = function () {
    //     debugger;
    //     ApplicantPortal_Contoller.fetchApplicantStatus($rootScope.apaId, function (result, event) {
    //         debugger;

    //         console.log('result return onload :: ');
    //         console.log(result);
    //         console.log('event:', event);

    //         if (event.status) {
    //             $rootScope.isCurrentUserSubmitted = result;
    //             CKEDITOR.config.readOnly = true;
    //         } else {
    //             console.log('Error in fetchApplicantStatus:', event.message);
    //         }
    //     }, {
    //         escape: true
    //     });
    // }
    // $scope.getApplicantStatusFromAPA();

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

                    $scope.isCoordinator = false;
                    if (result.isCoordinator === true) {
                        $scope.isCoordinator = true;
                    }

                    $scope.$apply();
                }
            }, { escape: true });
        }
    }
    //$scope.getProposalStage();

    $scope.selectedFile;

    $scope.filePreviewHandler = function (fileContent) {
        debugger;
        $scope.selectedFile = fileContent;

        console.log('selectedFile---', $scope.selectedFile);
        var jhj = $scope.selectedFile.userDocument.Attachments[0].Id;
        console.log(jhj);
        $scope.filesrec = $sce.trustAsResourceUrl(window.location.origin + '/ApplicantDashboard/servlet/servlet.FileDownload?file=' + $scope.selectedFile.userDocument.Attachments[0].Id);
        //$scope.filesrec = window.location.origin +'/ApplicantDashboard/servlet/servlet.FileDownload?file='+$scope.selectedFile.userDocument.Attachments[0].Id;
        // $('#file_frame').attr('src', $scope.selectedFile.ContentDistribution.DistributionPublicUrl);
        $('#file_frame').attr('src', $scope.filesrec);

        var myModal = new bootstrap.Modal(document.getElementById('filePreview'))
        myModal.show('slow');
        $scope.$apply();

        //.ContentDistribution.DistributionPublicUrl
    }

    $scope.getProjectdetils = function () {
        debugger;
        $scope.getProposalStage();

        $scope.selectedFile = '';
        $('#file_frame').attr('src', '');
        ApplicantPortal_Contoller.getContactUserDoc($rootScope.contactId, $rootScope.proposalId, function (result, event) {
            debugger
            console.log('result return onload :: ');
            console.log(result);
            if (event.status) {
                $scope.allDocs = result;
                var uploadCount = 0;
                for (var i = 0; i < $scope.allDocs.length; i++) {
                    if ($scope.allDocs[i].userDocument.Name == 'No objection certificate') {
                        $scope.noObjection = $scope.allDocs[i];
                        if ($scope.allDocs[i].userDocument.Status__c == 'Uploaded') {
                            uploadCount = uploadCount + 1;
                        }
                    } else if ($scope.allDocs[i].userDocument.Name == 'Signature of the Applicant') {
                        $scope.signApp = $scope.allDocs[i];
                        if ($scope.allDocs[i].userDocument.Status__c == 'Uploaded') {
                            uploadCount = uploadCount + 1;
                        }
                    } else if ($scope.allDocs[i].userDocument.Name == 'Signature of the Host') {
                        $scope.hostsign = $scope.allDocs[i];
                        if ($scope.allDocs[i].userDocument.Status__c == 'Uploaded') {
                            uploadCount = uploadCount + 1;
                        }
                    }
                    // else if ($scope.allDocs[i].userDocument.Name == 'Acceptance letter') {
                    //     $scope.doc = $scope.allDocs[i];
                    //     if ($scope.allDocs[i].userDocument.Status__c == 'Uploaded') {
                    //         uploadCount = uploadCount + 1;
                    //     }
                    // }
                }
                $scope.$apply();
            }
        }, {
            escape: true
        })
    }
    //$scope.getProjectdetils();


    $scope.uploadFile = function (type, userDocId, fileId, maxSize, minFileSize) {
        debugger;
        $scope.showSpinnereditProf = true;

        // Set loading state based on file type
        if (type && type.indexOf('No objection certificate') !== -1) {
            $scope.uploadingNOC = true;
        } else if (type && type.indexOf('project Description') !== -1) {
            $scope.uploadingProjectProposal = true;
        }

        var file;

        file = document.getElementById(type).files[0];
        fileName = file.name;
        var typeOfFile = fileName.split(".");
        lengthOfType = typeOfFile.length;
        if (typeOfFile[lengthOfType - 1] != "pdf") {
            swal('Info', 'Please choose pdf file only.', 'info');
            $scope.uploadingNOC = false;
            $scope.uploadingProjectProposal = false;
            return;
        }
        console.log(file);
        var maxFileSize = maxSize;
        if (file != undefined) {
            if (file.size <= maxFileSize) {
                if (minFileSize && file.size < minFileSize) {
                    swal('Info', 'Your file is too small. Minimum size is ' + (minFileSize / 1024) + ' KB.', 'info');
                    $scope.uploadingNOC = false;
                    $scope.uploadingProjectProposal = false;
                    $scope.showSpinnereditProf = false;
                    return;
                }
                attachmentName = file.name;
                const myArr = attachmentName.split(".");
                var fileReader = new FileReader();
                fileReader.onloadend = function (e) {
                    attachment = window.btoa(this.result);  //Base 64 encode the file before sending it
                    positionIndex = 0;
                    fileSize = attachment.length;
                    $scope.showSpinnereditProf = false;
                    console.log("Original file size: " + file.size + " bytes, Base64 encoded size: " + fileSize + " bytes");
                    doneUploading = false;
                    debugger;
                    // Check if Base64 encoded size exceeds Apex limit
                    // Note: Apex has 6MB limit per String parameter, but chunks are accumulated
                    // So we need to be conservative - allow up to 6MB but use small chunks
                    if (fileSize <= maxStringSize) {
                        $scope.uploadAttachment(type, userDocId, null);
                    } else {
                        var maxFileSizeMB = ((maxStringSize / 1.33) / (1024 * 1024)).toFixed(1); // Convert back to original file size estimate
                        var currentFileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                        swal('Info', 'File is too large after encoding. Maximum file size is approximately ' + maxFileSizeMB + ' MB. Your file is ' + currentFileSizeMB + ' MB. Please reduce the file size and try again.', 'info');
                        $scope.uploadingNOC = false;
                        $scope.uploadingProjectProposal = false;
                        $scope.showSpinnereditProf = false;
                        return;
                    }

                }
                fileReader.onerror = function (e) {
                    swal('Info', 'There was an error reading the file.  Please try again.', 'info');
                    $scope.uploadingNOC = false;
                    $scope.uploadingProjectProposal = false;
                    $scope.showSpinnereditProf = false;
                    $scope.$apply();
                    return;
                    // alert("There was an error reading the file.  Please try again.");
                }
                fileReader.onabort = function (e) {
                    swal('Info', 'There was an error reading the file.  Please try again.', 'info');
                    $scope.uploadingNOC = false;
                    $scope.uploadingProjectProposal = false;
                    $scope.showSpinnereditProf = false;
                    $scope.$apply();
                    return;
                    // alert("There was an error reading the file.  Please try again.");
                }

                fileReader.readAsBinaryString(file);  //Read the body of the file

            } else {
                var maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(0);
                swal('Info', 'Your file is too large. Maximum file size is ' + maxSizeMB + ' MB. Please try again.', 'info');
                $scope.uploadingNOC = false;
                $scope.uploadingProjectProposal = false;
                $scope.showSpinnereditProf = false;
                return;
                // alert("Your file is too large.  Please try again.");
            }
        } else {
            swal('Info', 'You must choose a file before trying to upload it', 'info');
            $scope.uploadingNOC = false;
            $scope.uploadingProjectProposal = false;
            $scope.showSpinnereditProf = false;
            return;
            // alert("You must choose a file before trying to upload it");
        }
    }

    $scope.uploadFile1 = function (type, userDocId, fileId, maxSize, minFileSize) {
        debugger;
        $scope.showSpinnereditProf = true;
        var file;

        file = document.getElementById(type).files[0];
        fileName = file.name;
        var typeOfFile = fileName.split(".");
        lengthOfType = typeOfFile.length;
        if (typeOfFile[lengthOfType - 1] == "jpg" || typeOfFile[lengthOfType - 1] == "jpeg") {

        } else {
            swal('Info', 'Please choose jpg/jpeg file only.', 'info');
            return;
        }
        console.log(file);
        maxFileSize = maxSize;
        if (file != undefined) {
            if (file.size <= maxFileSize) {
                if (file.size < minFileSize) {
                    swal('Info', 'Your file is too small. Please try again.', 'info');
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
                        swal('Info', 'Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".', 'info');
                        return;
                        // alert("Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".");
                    }

                }
                fileReader.onerror = function (e) {
                    swal('Info', 'There was an error reading the file.  Please try again.', 'info');
                    $scope.uploadingNOC = false;
                    $scope.uploadingProjectProposal = false;
                    $scope.showSpinnereditProf = false;
                    $scope.$apply();
                    return;
                    // alert("There was an error reading the file.  Please try again.");
                }
                fileReader.onabort = function (e) {
                    swal('Info', 'There was an error reading the file.  Please try again.', 'info');
                    $scope.uploadingNOC = false;
                    $scope.uploadingProjectProposal = false;
                    $scope.showSpinnereditProf = false;
                    $scope.$apply();
                    return;
                    // alert("There was an error reading the file.  Please try again.");
                }

                fileReader.readAsBinaryString(file);  //Read the body of the file

            } else {
                swal('Info', 'Your file is too large.  Please try again.', 'info');
                return;
                // alert("Your file is too large.  Please try again.");
                $scope.showSpinnereditProf = false;
            }
        } else {
            swal('Info', 'You must choose a file before trying to upload it', 'info');
            return;
            // alert("You must choose a file before trying to upload it");
            $scope.showSpinnereditProf = false;
        }
    }

    $scope.uploadAttachment = function (type, userDocId, fileId) {
        debugger;
        var attachmentBody = "";
        var currentChunkSize = chunkSize;

        // Calculate remaining size
        var remainingSize = fileSize - positionIndex;

        // Ensure chunk size doesn't exceed remaining size
        if (remainingSize <= currentChunkSize) {
            attachmentBody = attachment.substring(positionIndex);
            doneUploading = true;
        } else {
            // Use dynamic chunk size to ensure we don't exceed limits
            // Ensure chunk size doesn't exceed 6MB limit for Apex
            var maxChunkSize = 6000000; // 6MB Apex limit
            currentChunkSize = Math.min(currentChunkSize, maxChunkSize, remainingSize);
            attachmentBody = attachment.substring(positionIndex, positionIndex + currentChunkSize);
        }

        // Validate chunk size before sending
        if (attachmentBody.length > 6000000) {
            swal('Error', 'Chunk size exceeds maximum allowed size. Please try a smaller file or contact support.', 'error');
            $scope.showSpinnereditProf = false;
            $scope.uploadingNOC = false;
            $scope.uploadingProjectProposal = false;
            return;
        }

        console.log("Uploading chunk: " + attachmentBody.length + " chars of " + fileSize + " (position: " + positionIndex + ")");
        ApplicantPortal_Contoller.doCUploadAttachmentAa(
            attachmentBody, attachmentName, fileId, userDocId,
            function (result, event) {
                console.log(result);
                if (event.type === 'exception') {
                    console.log("exception");
                    console.log(event);
                    $scope.showSpinnereditProf = false;
                    $scope.uploadingNOC = false;
                    $scope.uploadingProjectProposal = false;
                    var errorMsg = 'Upload failed. ';
                    if (event.message) {
                        errorMsg += event.message;
                    } else if (event.data && event.data[0]) {
                        errorMsg += event.data[0];
                    } else {
                        errorMsg += 'Please check file size (max ~4.1MB) and try again.';
                    }
                    swal('Error', errorMsg, 'error');
                    $scope.$apply();
                } else if (event.status) {
                    if (doneUploading == true) {
                        $scope.getProjectdetils();
                        $scope.getProjectProposalDoc();
                        $scope.uploadingNOC = false;
                        $scope.uploadingProjectProposal = false;
                        $scope.showSpinnereditProf = false;
                        swal(
                            'Success',
                            'Uploaded Successfully!',
                            'success'
                        )
                        // $scope.disableSubmit = false;

                    }
                    // $scope.getCandidateDetails();\
                    else {
                        debugger;
                        positionIndex += currentChunkSize;
                        $scope.uploadAttachment(type, userDocId, result);
                    }
                    $scope.showUplaodUserDoc = false;
                } else {
                    $scope.showSpinnereditProf = false;
                    $scope.uploadingNOC = false;
                    $scope.uploadingProjectProposal = false;
                    swal('Error', 'Upload failed. Please try again.', 'error');
                    $scope.$apply();
                }
            },


            { buffer: true, escape: true, timeout: 120000 }
        );
    }

    $scope.saveandNext = function () {
        debugger;

        // Validate project proposal upload
        if ($scope.isCoordinator && (!$scope.projectProposal || !$scope.projectProposal.userDocument || $scope.projectProposal.userDocument.Status__c != 'Uploaded')) {
            swal('Info', 'Please upload the project proposal.', 'info');
            return;
        }

        for (var i = 0; i < $scope.allDocs.length; i++) {
            if ($scope.allDocs[i].userDocument.Name == 'No objection certificate') {
                if ($scope.allDocs[i].userDocument.Status__c != 'Uploaded') {
                    swal('Info', 'Please upload no objection certificate.', 'info');
                    return;
                }
            }
            // if($scope.allDocs[i].userDocument.Name == 'Signature of the Host'){
            //     if($scope.allDocs[i].userDocument.Status__c != 'Uploaded'){
            //         swal('info','Please upload signature of the host.','info');
            //         return;
            //     }
            // }else
            // if ($scope.allDocs[i].userDocument.Name == 'Acceptance letter') {
            //     if ($scope.allDocs[i].userDocument.Status__c != 'Uploaded') {
            //         swal('Info', 'Please upload Acceptance Letter.', 'info');
            //         return;
            //     }
            // } else if ($scope.allDocs[i].userDocument.Name == 'No objection certificate') {
            //     if ($scope.allDocs[i].userDocument.Status__c != 'Uploaded') {
            //         swal('Info', 'Please upload no objection certificate.', 'info');
            //         return;
            //     }
            // }
        }

        swal({
            title: "Success",
            text: 'Attachments have been saved successfully.',
            icon: "success",
            button: "ok!",
        });

        $scope.redirectPageURL('Declaration_Wiser');
    }

    // Show spinner on button
    $("#btnPreview").html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Please wait...');
    $("#btnPreview").prop('disabled', true);

    // ----------------- CODE TO GET PROJECT PROPOSAL DOCUMENT FOR UPLOAD -------------------- //
    $scope.getProjectProposalDoc = function () {
        debugger;
        ApplicantPortal_Contoller.getAllUserDoc($rootScope.proposalId, function (result, event) {
            debugger;
            // Restore button
            $("#btnPreview").html('<i class="fa-solid fa-check me-2"></i>Save and Next');
            $("#btnPreview").prop('disabled', false);
            // console.log('result return onload :: ');
            // console.log(result);
            if (event.status) {
                $scope.projProposal = result;
                for (var i = 0; i < $scope.projProposal.length; i++) {

                    var doc = $scope.projProposal[i];

                    var apaId = doc &&
                        doc.userDocument &&
                        doc.userDocument.Applicant_Proposal_Association__c;

                    if ($scope.projProposal[i].userDocument.Name == 'project Description' && !apaId) {
                        $scope.projectProposal = $scope.projProposal[i];
                    }
                }
                console.log('$scope.projectProposal : ', $scope.projectProposal);
                $scope.$apply();
            }
        }, {
            escape: true
        })
    }
    //$scope.getProjectProposalDoc();

    // $scope.getProjectDetailsOnLoad = function () {
    //     debugger;
    //     $scope.selectedFile = '';
    //     $('#file_frame').attr('src', '');
    //     ApplicantPortal_Contoller.getAllProposalDoc($rootScope.proposalId, function (result, event) {
    //         debugger
    //         console.log('result return onload :: ');
    //         console.log(result);
    //         if (event.status) {
    //             $scope.allDocs = result;
    //             var uploadCount = 0;
    //             for (var i = 0; i < $scope.allDocs.length; i++) {
    //                 if ($scope.allDocs[i].userDocument.Name == 'project Description') {
    //                     $scope.doc = $scope.allDocs[i];
    //                     if ($scope.allDocs[i].userDocument.Status__c == 'Uploaded') {
    //                         uploadCount = uploadCount + 1;
    //                     }
    //                 }
    //             }
    //             $scope.$apply();
    //         }
    //     }, {
    //         escape: true
    //     })
    // }
    // $scope.getProjectDetailsOnLoad();



});

