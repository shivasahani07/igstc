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

    $scope.isCoordinator = isCoordinator;
    $scope.quotationEquipmentDoc = null;
    $scope.auditedFinancialDoc = null;
    $rootScope.mailingCountry = '';


    if (localStorage.getItem('apaId')) {
        $rootScope.apaId = localStorage.getItem('apaId');
    }

    console.log('$rootScope.proposalStage on Declaration Page:', $rootScope.proposalStage);
    console.log('$rootScope.isCoordinator on Declaration Page:', $scope.isCoordinator + '--' + isCoordinator);

    $scope.getProposalStage = function () {
        debugger;

        ApplicantPortal_Contoller.getProposalStageUsingProposalId(
            $rootScope.proposalId,
            $rootScope.apaId,
            function (result, event) {

                if (event.status && result) {
                    $scope.$apply(function () {

                        $rootScope.currentProposalStage = result.proposalStage;
                        $rootScope.expenseDetailsSubmitted = result.expenseDetailsSubmitted;
                        $rootScope.isCoordinator = result.isCoordinator == true ? 'true' : 'false';
                        $scope.isCoordinator = result.isCoordinator == true ? 'true' : 'false';
                        $rootScope.stage = result.stage;


                        $rootScope.mailingCountry = result.mailingCountry;
                        $rootScope.secondStage = $rootScope.stage == '2nd Stage' ? true : false;
                        $scope.proposalStage = $rootScope.currentProposalStage == 'Draft' ? false : true;
                        $rootScope.proposalStage = $scope.proposalStage;
                        $scope.uploadDisable =
                            !(
                                $rootScope.currentProposalStage === "Draft"
                                && $rootScope.isCoordinator === true
                            );
                    });
                }

                console.log('$rootScope.currentProposalStage : ', $rootScope.currentProposalStage);
                console.log('$rootScope.isCoordinator : ', $rootScope.isCoordinator);
                console.log('$rootScope.stage : ', $rootScope.stage);
                console.log('$rootScope.secondStage : ', $rootScope.secondStage);
                console.log('uploadDisable:', $scope.uploadDisable);
                console.log('$rootScope.mailingCountry : ', $rootScope.mailingCountry);

                // Fetch proposal-level documents after stage info is loaded
                $scope.getProposalDocs();
            }
        );
    };
    $scope.getProposalStage();

    // Method to fetch APA-level documents (Quotation Equipment, Financial Statement)
    $scope.getProposalDocs = function () {
        ApplicantPortal_Contoller.getContactUserDoc($rootScope.contactId, $rootScope.proposalId, function (result, event) {
            if (event.status && result) {
                // Decide expected document names based on stage
                var expectedFinancialDocName = $rootScope.secondStage
                    ? 'Financial Statement Report - Stage 2'
                    : 'Financial Statement Report - Stage 1';

                var expectedQuotationDocName = $rootScope.secondStage
                    ? 'Quotation For Equipment - Stage 2'
                    : 'Quotation For Equipment - Stage 1';

                for (var i = 0; i < result.length; i++) {
                    var docName = result[i].userDocument.Name;

                    if (docName === expectedFinancialDocName) {
                        $scope.auditedFinancialDoc = result[i];
                    }
                    else if (docName === expectedQuotationDocName) {
                        $scope.quotationEquipmentDoc = result[i];
                    }
                }
                console.log('Declaration - quotationEquipmentDoc:', $scope.quotationEquipmentDoc);
                console.log('Declaration - auditedFinancialDoc:', $scope.auditedFinancialDoc);
                $scope.$applyAsync();
            }
        }, { escape: true });
    };

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
            // swal({
            //     title: "Error",
            //     text: "A signature has already been uploaded. You cannot upload another signature.",
            //     icon: "error",
            //     button: "OK",
            // });
            showInfo('A signature has already been uploaded. You cannot upload another signature.');
            return;
        }
        $scope.showSpinnereditProf = true;
        var file;

        file = document.getElementById('fileSignature').files[0];
        if (!file) {
            $scope.showSpinnereditProf = false;
            swal("Info", "You must choose a file before trying to upload it", "info");
            return;
        }

        var maxFileSize = 1048576;
        if (file.size > maxFileSize) {
            $scope.showSpinnereditProf = false;
            swal("Info", "File must be under 1 Mb in size. Please try again.", "info");
            return;
        }
        fileName = file.name;
        var typeOfFile = fileName.split(".");
        lengthOfType = typeOfFile.length;
        if (typeOfFile[lengthOfType - 1] == "jpg" || typeOfFile[lengthOfType - 1] == "jpeg") {

        } else {
            swal('Info', 'Please choose jpg/jpeg file only.', 'info');
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
                    swal("Info", "There was an error reading the file.  Please try again.", "info");
                    return;
                    // alert("There was an error reading the file.  Please try again.");
                }
                fileReader.onabort = function (e) {
                    swal("Info", "There was an error reading the file.  Please try again.", "info");
                    return;
                    // alert("There was an error reading the file.  Please try again.");
                }

                fileReader.readAsBinaryString(file);  //Read the body of the file

            } else {
                swal("Info", "File must be under 1 Mb in size.  Your file is too large.  Please try again.", "info");
                return;
            }
        } else {
            swal("Info", "You must choose a file before trying to upload it", "info");
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
                            'Success',
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

        if (
            $rootScope.secondStage &&
            !$rootScope.expenseDetailsSubmitted
        ) {
            showInfo('Please submit Expense Details before submitting the application.');
            // swal(
            //     'Info',
            //     'Please submit Expense Details before submitting the application.',
            //     'info'
            // );
            return;
        }

        var year = 0;
        var month = 0;
        var day = 0;
        for (var i = 0; i < $scope.allDocs.length; i++) {
            if ($scope.allDocs[i].userDocument.Name == 'Signature') {
                if ($scope.allDocs[i].userDocument.Status__c != 'Uploaded') {
                    swal('Info', 'Please upload Signature.', 'info');
                    return;
                }
            }
        }

        // // Validate Quotation for Equipment / Accessories is uploaded - Stage 1
        // if ($rootScope.stage === '1st Stage' && $rootScope.mailingCountry === 'India') {
        //     if (!$scope.quotationEquipmentDoc || !$scope.quotationEquipmentDoc.userDocument || $scope.quotationEquipmentDoc.userDocument.Status__c !== 'Uploaded') {
        //         swal('info', 'Please upload Quotation for Equipment / Accessories - Stage 1 before submitting.', 'info');
        //         return;
        //     }
        // }

        // // Validate Quotation for Equipment / Accessories is uploaded - Stage 2
        // if ($rootScope.stage === '2nd Stage' && $rootScope.mailingCountry === 'India') {
        //     if (!$scope.quotationEquipmentDoc || !$scope.quotationEquipmentDoc.userDocument || $scope.quotationEquipmentDoc.userDocument.Status__c !== 'Uploaded') {
        //         swal('info', 'Please upload Quotation for Equipment / Accessories - Stage 2 before submitting.', 'info');
        //         return;
        //     }
        // }

        // // Validate Financial Statement Report is uploaded - Stage 2
        // if ($rootScope.stage === '2nd Stage' && ($rootScope.mailingCountry === 'India')) {
        //     if (!$scope.auditedFinancialDoc || !$scope.auditedFinancialDoc.userDocument || $scope.auditedFinancialDoc.userDocument.Status__c !== 'Uploaded') {
        //         swal('info', 'Please upload Financial Statement Report - Stage 2 before submitting.', 'info');
        //         return;
        //     }
        // }
        if ($scope.SignDate != undefined && $scope.SignDate != '') {
            year = $scope.SignDate.getUTCFullYear();
            month = $scope.SignDate.getUTCMonth() + 1;
            day = $scope.SignDate.getDate();
        }


        console.log('$rootScope.expenseDetailsSubmitted : ', $rootScope.expenseDetailsSubmitted);
        console.log('$rootScope.secondStage : ', $rootScope.secondStage);
        console.log('$rootScope.isCoordinator : ', $rootScope.isCoordinator);



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

                                // swal(
                                //     'Success',
                                //     'Your data has been saved successfully. You cannot Submit until all partners have submitted the Application.',
                                //     'warning'
                                swal({
                                    title: "Success",
                                    content: {
                                        element: "div",
                                        attributes: {
                                            innerHTML: `
                                            <p style="margin-top:10px; margin-bottom:20px; line-height:1.6;">
                                                Your data has been saved successfully. You cannot Submit until all partners have submitted the Application.
                                            </p>
                                        `
                                        }
                                    },
                                    icon: "warning",
                                    button: "OK"
                                }).then(function () {

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
                    swal('Info', 'Please upload Signature.', 'info');
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

        if (
            $rootScope.secondStage &&
            !$rootScope.expenseDetailsSubmitted
        ) {
            showInfo('Please submit Expense Details before submitting the application.');
            // swal(
            //     'Info',
            //     'Please submit Expense Details before submitting the application.',
            //     'info'
            // );
            return;
        }

        var year = 0;
        var month = 0;
        var day = 0;
        for (var i = 0; i < $scope.allDocs.length; i++) {
            if ($scope.allDocs[i].userDocument.Name == 'Signature') {
                if ($scope.allDocs[i].userDocument.Status__c != 'Uploaded') {
                    swal('Info', 'Please upload Signature.', 'info');
                    return;
                }
            }
        }

        // Validate Quotation for Equipment / Accessories is uploaded - Stage 1
        // if ($rootScope.stage === '1st Stage' && $rootScope.mailingCountry === 'India') {
        //     if (!$scope.quotationEquipmentDoc || !$scope.quotationEquipmentDoc.userDocument || $scope.quotationEquipmentDoc.userDocument.Status__c !== 'Uploaded') {
        //         //swal('Info', 'Please upload Quotation for Equipment / Accessories - Stage 1 before submitting.', 'info');
        //         showInfo('Please upload Quotation for Equipment / Accessories - Stage 1 before submitting.');
        //         return;
        //     }
        // }

        // // Validate Quotation for Equipment / Accessories is uploaded - Stage 2
        // if ($rootScope.stage === '2nd Stage' && $rootScope.mailingCountry === 'India') {
        //     if (!$scope.quotationEquipmentDoc || !$scope.quotationEquipmentDoc.userDocument || $scope.quotationEquipmentDoc.userDocument.Status__c !== 'Uploaded') {
        //         showInfo('Please upload Quotation for Equipment / Accessories - Stage 2 before submitting.');
        //         return;
        //     }
        // }

        // // Validate Financial Statement Report is uploaded - Stage 2
        // if ($rootScope.stage === '2nd Stage' && ($rootScope.mailingCountry === 'India')) {
        //     if (!$scope.auditedFinancialDoc || !$scope.auditedFinancialDoc.userDocument || $scope.auditedFinancialDoc.userDocument.Status__c !== 'Uploaded') {
        //         showInfo('Please upload Financial Statement Report - Stage 2 before submitting.');
        //         return;
        //     }
        // }


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
                    ApplicantPortal_Contoller.submitPartner2plus2($scope.decDetails, year, month, day, $rootScope.proposalId, function (result, event) {
                        if (event.status) {
                            debugger;
                            // swal(
                            //     'Success',
                            //     'Your Application has been submitted successfully.',
                            //     'success'
                            // );
                            // showSuccess('Your Application has been submitted successfully.');
                            // $scope.proposalStage = true;
                            // $scope.redirectPageURL('Home');
                            // $scope.decDetails = result;
                            // $scope.$apply();

                            showSuccess('Your Application has been submitted successfully.')
                                .then(function () {
                                    // This code executes after user clicks OK
                                    $scope.proposalStage = true;
                                    $scope.redirectPageURL('Home');
                                    $scope.decDetails = result;
                                    $scope.$apply();
                                });
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
                    swal('Info', 'Please upload Signature.', 'info');
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

    function showSuccess(message) {
        return swal({  // Add return here
            title: "Success",
            content: {
                element: "div",
                attributes: {
                    innerHTML: `<p style="margin-top:10px; margin-bottom:20px; line-height:1.6;">${message}</p>`
                }
            },
            icon: "success",
            button: "OK"
        });
    }


});