angular.module('cp_app').controller('declarationplus2_ctrl', function ($scope, $sce, $rootScope) {
    debugger;

    // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }

    $scope.siteURL = siteURL;
    $scope.decDetails = {};
    $scope.SignDate = new Date($rootScope.signDate);
    $scope.disableUploadButton = true;
    $scope.partnerInfoStage = false;

    console.log('$rootScope.proposalStage on Declaration Page:', $rootScope.proposalStage);

    $scope.getDeclarationfields = function () {
        debugger;
        ApplicantPortal_Contoller.getDeclarationfields($rootScope.candidateId, function (result, event) {
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

    $scope.getProjectdetils = function () {
        debugger;
        //ApplicantPortal_Contoller.getContactUserDoc($rootScope.contactId,$rootScope.projectId, function (result, event) {
        ApplicantPortal_Contoller.getContactUserDoc($rootScope.contactId, $rootScope.proposalId, function (result, event) {
            debugger
            console.log('result return onload :: ');
            console.log(result);
            if (event.status) {
                $scope.allDocs = result;
                for (var i = 0; i < $scope.allDocs.length; i++) {
                    if ($scope.allDocs[i].userDocument.Name == 'Signature') {
                        $scope.doc = $scope.allDocs[i];
                    }
                }
                $scope.$apply();
            }
        }, {
            escape: true
        })
    }
    $scope.getProjectdetils();
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
    $scope.uploadFile = function (type, userDocId, fileId) {
        debugger;
        console.log('[uploadFile] args:', { type, userDocId, fileId });

        // Prefer reading from $scope if args are empty
        var safeDoc = $scope.doc && $scope.doc.userDocument ? $scope.doc.userDocument : null;
        var safeType = type || (safeDoc && safeDoc.Name) || null;
        var safeUDId = userDocId || (safeDoc && (safeDoc.Id || safeDoc.Id__c || safeDoc.User_Document__c)) || null;
        var safeFileId = fileId || '';

        console.log('[uploadFile] resolved:', { safeType, safeUDId, safeFileId, safeDoc });

        if (!safeDoc) {
            console.error('[uploadFile] $scope.doc.userDocument is not ready yet');
            swal("error", "Signature document not loaded yet. Please wait a moment and try again.", "error");
            return;
        }
        if (!safeUDId) {
            console.error('[uploadFile] userDocId missing');
            swal("error", "Missing document Id for Signature. Please reload the page.", "error");
            return;
        }

        //if($scope.doc.userDocument.Status__c=='Uploaded'){
        if ($scope.doc && $scope.doc.userDocument && $scope.doc.userDocument.Status__c && $scope.doc.userDocument.Status__c == 'Uploaded') {
            // console.log('File already uploaded !!');
            swal({
                title: "Error",
                text: "A signature has already been uploaded. You cannot upload another signature.",
                icon: "error",
                button: "OK",
            });
            return;
        }
        $scope.showSpinnereditProf = true;
        var file;

        file = document.getElementById('fileSignature').files[0];
        fileName = file.name;
        var typeOfFile = fileName.split(".");
        lengthOfType = typeOfFile.length;
        if (typeOfFile[lengthOfType - 1] == "jpg" || typeOfFile[lengthOfType - 1] == "jpeg") {

        } else {
            swal('info', 'Please choose jpg/jpeg file only.', 'info');
            return;
        }
        console.log(file);
        if (file != undefined) {
            // if (file.size <= maxFileSize) {
            if (true) {
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
                        // $scope.uploadAttachment(type , userDocId, fileId);
                        // Add the info or warning message here after uploading
                        swal({
                            title: "Warning",
                            text: "Once you upload the signature, it cannot be uploaded again. Please ensure this is the correct signature.",
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
                                console.log("Upload canceled");
                            }
                        });
                    } else {
                        swal("info", "Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".", "info");
                        return;
                        // alert("Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".");
                    }

                }
                fileReader.onerror = function (e) {
                    swal("info", "There was an error reading the file.  Please try again.", "info");
                    return;
                    // alert("There was an error reading the file.  Please try again.");
                }
                fileReader.onabort = function (e) {
                    swal("info", "There was an error reading the file.  Please try again.", "info");
                    return;
                    // alert("There was an error reading the file.  Please try again.");
                }

                fileReader.readAsBinaryString(file);  //Read the body of the file

            } else {
                swal("info", "File must be under 1 Mb in size.  Your file is too large.  Please try again.", "info");
                return;
            }
        } else {
            swal("info", "You must choose a file before trying to upload it", "info");
            return;
            // alert("You must choose a file before trying to upload it");
            // $scope.showSpinnereditProf = false;
        }
    }

    $scope.uploadAttachment = function (type, userDocId, fileId) {
        debugger;
        var attachmentBody = "";
        if (fileId == undefined) {
            fileId = " ";
        }
        //if (fileSize <= positionIndex + chunkSize) {
        if (true) {
            debugger;
            attachmentBody = attachment.substring(positionIndex);
            doneUploading = true;
        } else {
            attachmentBody = attachment.substring(positionIndex, positionIndex + chunkSize);
        }
        console.log("Uploading " + attachmentBody.length + " chars of " + fileSize);
        var attachmentBodyString = String(attachmentBody);
        console.log('attachmentBodyString====================>' + attachmentBodyString);
        var attachmentNameString = String(attachmentName);
        console.log('attachmentNameString===================>' + attachmentNameString);
        var fileIdString = (fileId !== undefined && fileId !== null) ? String(fileId) : '';
        console.log('fileIdString======================>' + fileIdString);
        var userDocIdString = (userDocId !== undefined && userDocId !== null) ? String(userDocId) : '';
        console.log('userDocIdString======================>' + userDocIdString);
        ApplicantPortal_Contoller.doCUploadAttachmentSignature(
            //attachmentBody, attachmentName,fileId, userDocId, 
            attachmentBodyString, attachmentNameString, fileIdString, userDocIdString,
            function (result, event) {
                console.log(result);
                if (event.type === 'exception') {
                    console.log("exception");
                    console.log(event);
                } else if (event.status) {
                    if (doneUploading == true) {
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
    $scope.SubmitApplication = function () {
        debugger;
        var year = 0;
        var month = 0;
        var day = 0;
        for (var i = 0; i < $scope.allDocs.length; i++) {
            if ($scope.allDocs[i].userDocument.Name == 'Signature') {
                if ($scope.allDocs[i].userDocument.Status__c != 'Uploaded') {
                    swal('info', 'Please upload Signature.', 'info');
                    return;
                }
            }
        }
        if ($scope.SignDate != undefined && $scope.SignDate != '') {
            year = $scope.SignDate.getUTCFullYear();
            month = $scope.SignDate.getUTCMonth() + 1;
            day = $scope.SignDate.getDate();
        }

        swal({
            title: "Are you sure?",
            text: "Once submitted, you will not be able to update proposal!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    // ApplicantPortal_Contoller.submit2plus2($scope.decDetails,year,month,day,$rootScope.projectId, function(result,event){
                    ApplicantPortal_Contoller.submit2plus2($scope.decDetails, year, month, day, $rootScope.proposalId, function (result, event) {
                        if (event.status) {
                            debugger;
                            if (result == "Success") {
                                $rootScope.proposalStage = true;
                                CKEDITOR.config.readOnly = true;
                                $scope.$apply();

                                // Swal.fire(
                                //     'Success',
                                //     'Your application has been Submitted successfully.',
                                //     'success'
                                // );

                                swal(
                                    'Success',
                                    'Your application has been Submitted successfully.',
                                    'success'
                                ).then(function () {

                                    setTimeout(function () {
                                        $scope.redirectPageURL('Home');
                                        $scope.$apply();
                                    }, 1500);

                                });
                            }
                            else {

                                swal(
                                    'Success',
                                    'Your data has been saved successfully. You cannot Submit until all partners have submitted the Application.',
                                    'warning'
                                ).then(function () {

                                    setTimeout(function () {
                                        $scope.redirectPageURL('Home');
                                        $scope.$apply();
                                    }, 500);

                                });
                            }

                            // } else {
                            //     // Swal.fire(
                            //     //     'Success',
                            //     //     'Your data has been saved successfully. You cannot Submit until all partners have submitted the Application.',
                            //     //     'info'
                            //     // );

                            //     swal(
                            //         'Success',
                            //         'Your data has been saved successfully. You cannot Submit until all partners have submitted the Application.',
                            //         'warning'
                            //     );
                            // }

                            //$scope.redirectPageURL('Home');
                            // $scope.redirectPageURL('Home&campaign=2plus2');    
                        }
                    },
                        { escape: true }
                    )
                } else {
                    return;
                }
            });
    }
    $scope.saveDetails = function () {
        debugger;
        var year = 0;
        var month = 0;
        var day = 0;
        for (var i = 0; i < $scope.allDocs.length; i++) {
            if ($scope.allDocs[i].userDocument.Name == 'Signature') {
                if ($scope.allDocs[i].userDocument.Status__c != 'Uploaded') {
                    swal('info', 'Please upload Signature.', 'info');
                    return;
                }
            }
        }
        if ($scope.SignDate != undefined && $scope.SignDate != '') {
            year = $scope.SignDate.getUTCFullYear();
            month = $scope.SignDate.getUTCMonth() + 1;
            day = $scope.SignDate.getDate();
        }

        ApplicantPortal_Contoller.upsertSign($scope.decDetails, year, month, day, function (result, event) {
            if (event.status) {
                debugger;
                // Swal.fire(
                //     'Success',
                //     'Your data has been saved successfully.',
                //     'success'
                // );

                swal(
                    'Success',
                    'Your data has been saved successfully.',
                    'success'
                ).then(function () {

                    setTimeout(function () {
                        $scope.redirectPageURL('Home');
                        $scope.$apply();
                    }, 1500);

                });


                // $scope.redirectPageURL('Home');
                $scope.decDetails = result;
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }

    $scope.saveAndSubmit = function () {
        debugger;
        var year = 0;
        var month = 0;
        var day = 0;
        for (var i = 0; i < $scope.allDocs.length; i++) {
            if ($scope.allDocs[i].userDocument.Name == 'Signature') {
                if ($scope.allDocs[i].userDocument.Status__c != 'Uploaded') {
                    swal('info', 'Please upload Signature.', 'info');
                    return;
                }
            }
        }
        if ($scope.SignDate != undefined && $scope.SignDate != '') {
            year = $scope.SignDate.getUTCFullYear();
            month = $scope.SignDate.getUTCMonth() + 1;
            day = $scope.SignDate.getDate();
        }

        swal({
            title: "Are you sure?",
            text: "Once submitted, you will not be able to update proposal!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    ApplicantPortal_Contoller.submitPartner2plus2($scope.decDetails, year, month, day, function (result, event) {
                        if (event.status) {
                            debugger;
                            Swal.fire(
                                'Success',
                                'Your Application has been submitted successfully.',
                                'success'
                            );
                            $scope.proposalStage = true;
                            $scope.redirectPageURL('Home');
                            $scope.decDetails = result;
                            $scope.$apply();
                        }
                    },
                        { escape: true }
                    )
                } else {
                    return;
                }
            });

    }

    $scope.saveandNext = function () {
        debugger;
        for (var i = 0; i < $scope.allDocs.length; i++) {
            if ($scope.allDocs[i].userDocument.Name == 'Signature') {
                if ($scope.allDocs[i].userDocument.Status__c != 'Uploaded') {
                    swal('info', 'Please upload Signature.', 'info');
                    return;
                }
            }
        }
        swal({
            title: "Declaration",
            text: "Details have been saved successfully.",
            icon: "success",
            button: "ok!",
        }).then((value) => {
            $scope.redirectPageURL('MyProposal');
        });

    }

    $scope.redirectPageURL = function (pageName) {
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
    };


});