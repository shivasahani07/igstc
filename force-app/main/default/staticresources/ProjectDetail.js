angular.module('cp_app').controller('projectCtrl', function ($scope, $sce, $rootScope) {
    debugger;

    // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }

    // Fetching the APA Id from Local Storage
    if (localStorage.getItem('apaId')) {
        $rootScope.apaId = localStorage.getItem('apaId');
        console.log('Loaded apaId from localStorage:', $rootScope.apaId);
    }

    $scope.config = {};
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
    $scope.selectedFile;
    $scope.config.removeButtons = 'BGColor,Anchor,Subscript,Superscript,Paste,Copy,Cut,Undo,Redo';
    debugger;
    $scope.siteURL = siteURL;
    $scope.proposalDetails = {};
    $scope.disable = false;
    // $scope.uploadDisable = proposalStage == "Draft" && isCoordinator == "true" ? false : true;  //need to check 
    //$scope.uploadDisable = proposalStage == "Draft" && isCoordinator == "true" ? true : false;  //need to check 

    $scope.uploadProgress = 0;
    $scope.showProgressBar = false;

    $scope.previewFileLink = '';

    // if(proposalStage=="Draft" && isCoordinator == "true"){
    //     $scope.uploadDisable = false;
    // }else{
    //     $scope.uploadDisable = true;
    // }
    $rootScope.secondStage;
    $scope.secondStage;

    console.log('second stage=>' + $rootScope.secondStage);
    console.log(' scope second stage=>' + $scope.secondStage);

    // $scope.pWrapper = window.proposalWrapperListJSON;
    // console.log(' $scope.pWrapper : ', $scope.pWrapper);

    // console.log(typeof ($scope.pWrapper));

    // // $scope.pWrapper = JSON.parse(window.proposalWrapperList);
    // // console.log(typeof ($scope.pWrapper));
    // // console.log($scope.pWrapper);

    // // console.log('typeOf($scope.pWrapper) : ', typeof ($scope.pWrapper));
    // // console.log('$scope.pWrapper : ', $scope.pWrapper);

    // // $scope.parsedPWrapper = JSON.parse($scope.pWrapper);
    // // console.log('typeOf($scope.parsedPWrapper) ', typeof ($scope.parsedPWrapper));
    // // console.log($scope.parsedPWrapper);

    console.log('proposalWrapperList : ', proposalWrapperList);
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
    console.log('$scope.proposalWrapperList : ', $scope.proposalWrapperList);

    $scope.objRtf = [{ charCount: 0, maxCharLimit: 0, errorStatus: false }];
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false });
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false });
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false });
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false });
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false });
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false });
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false });
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false });
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 0, errorStatus: false });

    $scope.getProjectdetils = function () {
        debugger;
        ApplicantPortal_Contoller.getProjectdetils($rootScope.proposalId, function (result, event) {
            debugger;
            if (event.status && result) {
                debugger;
                if (result.Research_Approach_Objectives__c != undefined || result.Research_Approach_Objectives__c != "") {
                    result.Research_Approach_Objectives__c = result.Research_Approach_Objectives__c ? result.Research_Approach_Objectives__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Research_Approach_Objectives__c;
                }
                if (result.Current_State_Of_The_Art__c != undefined || result.Current_State_Of_The_Art__c != "") {
                    result.Current_State_Of_The_Art__c = result.Current_State_Of_The_Art__c ? result.Current_State_Of_The_Art__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Current_State_Of_The_Art__c;
                }
                if (result.Project_Description__c != undefined || result.Project_Description__c != "") {
                    result.Project_Description__c = result.Project_Description__c ? result.Project_Description__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Project_Description__c;
                }
                if (result.Expected_Deliverables__c != undefined || result.Expected_Deliverables__c != "") {
                    result.Expected_Deliverables__c = result.Expected_Deliverables__c ? result.Expected_Deliverables__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Expected_Deliverables__c;
                }
                if (result.Reasons_For_And_Benefits_Of_Cooperation__c != undefined || result.Reasons_For_And_Benefits_Of_Cooperation__c != "") {
                    result.Reasons_For_And_Benefits_Of_Cooperation__c = result.Reasons_For_And_Benefits_Of_Cooperation__c ? result.Reasons_For_And_Benefits_Of_Cooperation__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Reasons_For_And_Benefits_Of_Cooperation__c;
                }
                if (result.Equipment__c != undefined || result.Equipment__c != "") {
                    result.Equipment__c = result.Equipment__c ? result.Equipment__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Equipment__c;
                }
                if (result.Criteria_For_Abandoning_The_Project__c != undefined || result.Criteria_For_Abandoning_The_Project__c != "") {
                    result.Criteria_For_Abandoning_The_Project__c = result.Criteria_For_Abandoning_The_Project__c ? result.Criteria_For_Abandoning_The_Project__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Criteria_For_Abandoning_The_Project__c;
                }
                if (result.Innovative_Aspects__c != undefined || result.Innovative_Aspects__c != "") {
                    result.Innovative_Aspects__c = result.Innovative_Aspects__c ? result.Innovative_Aspects__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Innovative_Aspects__c;
                }
                if (result.Research_Scholars__c != undefined || result.Research_Scholars__c != "") {
                    result.Research_Scholars__c = result.Research_Scholars__c ? result.Research_Scholars__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Research_Scholars__c;
                }
                if (result.Necessity_Of_Funding__c != undefined || result.Necessity_Of_Funding__c != "") {
                    result.Necessity_Of_Funding__c = result.Necessity_Of_Funding__c ? result.Necessity_Of_Funding__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Necessity_Of_Funding__c;
                }
                $scope.proposalDetails = result;
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }
    $scope.getProjectdetils();


    // ------------------------------------------------------------------------------ //
    // Method to get the Proposal Stage and APA Is_Coordinator

    $rootScope.currentProposalStage = '';
    $rootScope.isCoordinator = false;
    $rootScope.stage = '';

    $scope.getProposalStage = function () {
        debugger;

        ApplicantPortal_Contoller.getProposalStageUsingProposalId(
            $rootScope.proposalId,
            $rootScope.apaId,
            function (result, event) {

                if (event.status && result) {
                    $scope.$apply(function () {

                        $rootScope.currentProposalStage = result.proposalStage;
                        $rootScope.isCoordinator = result.isCoordinator;
                        $rootScope.stage = result.stage;

                        $rootScope.secondStage = $rootScope.stage == '2nd Stage' ? true : false;

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
            }
        );
    };
    $scope.getProposalStage();

    // Method to get the Files onload based on the Stage of the Proposal
    $scope.getDocsDet = function () {
        debugger;

        $scope.selectedFile = '';
        $scope.doc = null;
        $scope.sampleDoc = null;
        $scope.previewFileLink = '';
        $('#file_frame').attr('src', '');

        ApplicantPortal_Contoller.getAllProposalDoc(
            $rootScope.proposalId,
            function (result, event) {

                debugger;
                console.log('onload doc:: ', result);

                $scope.selectedProposal = null;
                debugger;
                if ($scope.proposalWrapperList && $rootScope.apaId) {

                    for (var i = 0; i < $scope.proposalWrapperList.length; i++) {

                        var wrap = $scope.proposalWrapperList[i];

                        if (wrap.apaId === $rootScope.apaId) {
                            console.log('wrap.apaId : ', wrap.apaId);
                            $scope.selectedProposal = wrap;
                            break;
                        }
                    }
                }

                /*
                if ($scope.selectedProposal) {
                    debugger;
                    // $rootScope.secondStage = $scope.selectedProposal.secondStage;
                    // $scope.stage = $scope.selectedProposal.stage;
                    // $scope.proposalStage = $scope.selectedProposal.proposalStage;

                    console.log('Selected APA:', $scope.selectedProposal);
                    console.log('Second Stage:', $rootScope.secondStage);
                } else {
                    console.warn('No matching APA found for apaId:', $rootScope.apaId);
                }
                */

                if (event.status && result) {

                    $scope.allDocs = result;

                    // Decide expected document name based on stage
                    var expectedDocName = $rootScope.secondStage
                        ? 'Project Details - Stage 2'
                        : 'Project Details - Stage 1';

                    console.log('expectedDocName : ', expectedDocName);

                    for (var i = 0; i < $scope.allDocs.length; i++) {

                        var currentDoc = $scope.allDocs[i].userDocument;

                        // Pick stage-specific Project Details document
                        if (currentDoc.Name === expectedDocName) {
                            console.log('currentDoc.Name : ', currentDoc.Name);

                            $scope.doc = $scope.allDocs[i];

                            if (
                                currentDoc.Attachments &&
                                currentDoc.Attachments.length > 0
                            ) {
                                let fileId = currentDoc.Attachments[0].Id;
                                $scope.previewFileLink =
                                    `/ApplicantDashboard/servlet/servlet.FileDownload?file=${fileId}`;
                            }
                        }

                        // Sample document (always collect)
                        if (currentDoc.Name === 'Sample Document') {
                            $scope.sampleDoc = currentDoc;
                        }
                    }

                    // Safety check
                    if (!$scope.doc) {
                        console.warn(
                            'No Project Details document found for stage:',
                            $rootScope.secondStage ? 'Stage 2' : 'Stage 1'
                        );
                    }

                    $scope.$applyAsync();
                }
            },
            { escape: true }
        );
    };
    $scope.getDocsDet();
    // ------------------------------------------------------------------------------ //

    // ------------------------------------------------------------------------------ //
    // $scope.getDocsDet = function () {
    //     debugger;
    //     $scope.selectedFile = '';
    //     $('#file_frame').attr('src', '');
    //     // ApplicantPortal_Contoller.getAllProposalDoc($rootScope.projectId, function (result, event) {
    //     ApplicantPortal_Contoller.getAllProposalDoc($rootScope.proposalId, function (result, event) {
    //         debugger
    //         console.log('onload doc:: ');
    //         console.log(result);
    //         if (event.status) {
    //             $scope.allDocs = result;
    //             var uploadCount = 0;
    //             for (var i = 0; i < $scope.allDocs.length; i++) {
    //                 debugger;
    //                 if ($scope.allDocs[i].userDocument.Name == 'Project Details') {
    //                     $scope.doc = $scope.allDocs[i];
    //                     if ($scope.doc.userDocument.Attachments && $scope.doc.userDocument.Attachments[0]) {
    //                         let fileId = $scope.doc.userDocument.Attachments[0].Id;
    //                         //$scope.previewFileLink = $scope.siteURL + `servlet/servlet.FileDownload?file=${fileId}`;
    //                         $scope.previewFileLink = `/ApplicantDashboard/servlet/servlet.FileDownload?file=${fileId}`;
    //                     }
    //                 }
    //                 if ($scope.allDocs[i].userDocument.Name == 'Sample Document') {
    //                     $scope.sampleDoc = $scope.allDocs[i].userDocument;
    //                 }
    //             }
    //             $scope.$applyAsync();
    //         }

    //     }, {
    //         escape: true
    //     })

    // }
    // $scope.getDocsDet();


    /*
    $scope.getDocsDet = function () {
        debugger;
        $scope.selectedFile = '';
        $('#file_frame').attr('src', '');
        // ApplicantPortal_Contoller.getAllProposalDoc($rootScope.projectId, function (result, event) {
        ApplicantPortal_Contoller.getAllProposalDoc($rootScope.proposalId, function (result, event) {
            debugger
            console.log('onload doc:: ');
            console.log(result);
            if (event.status) {
                $scope.allDocs = result;
                var uploadCount = 0;
                for (var i = 0; i < $scope.allDocs.length; i++) {
                    debugger;
                    if ($scope.allDocs[i].userDocument.Name == 'Project Details' ) {
                        $scope.doc = $scope.allDocs[i];
                        if ($scope.doc.userDocument.Attachments && $scope.doc.userDocument.Attachments[0]) {
                            let fileId = $scope.doc.userDocument.Attachments[0].Id;
                            //$scope.previewFileLink = $scope.siteURL + `servlet/servlet.FileDownload?file=${fileId}`;
                            $scope.previewFileLink = `/ApplicantDashboard/servlet/servlet.FileDownload?file=${fileId}`;
                        }
                    }
                    if ($scope.allDocs[i].userDocument.Name == 'Sample Document') {
                        $scope.sampleDoc = $scope.allDocs[i].userDocument;
                    }
                }
                $scope.$applyAsync();
            }

        }, {
            escape: true
        })

    }
    $scope.getDocsDet();
    */





    $scope.filePreviewHandler = function (fileContent) {
        debugger;
        $scope.selectedFile = fileContent;

        console.log('selectedFile---', $scope.selectedFile);
        var jhj = $scope.selectedFile.userDocument.Attachments[0].Id;
        console.log(jhj);
        $scope.filesrec = $sce.trustAsResourceUrl(window.location.origin + '/ApplicantDashboard/servlet/servlet.FileDownload?file=' + $scope.selectedFile.userDocument.Attachments[0].Id);
        console.log('filesrec : ', $scope.filesrec);

        $('#file_frame').attr('src', $scope.filesrec);

        var myModal = new bootstrap.Modal(document.getElementById('filePreview'))
        myModal.show('slow');
        $scope.$apply();

        //.ContentDistribution.DistributionPublicUrl
    }
    $scope.uploadFile = function (type, userDocId, fileId) {
        debugger;

        // Commented By Saurabh
        /*
        if ($scope.doc && $scope.doc.userDocument && $scope.doc.userDocument.Status__c && $scope.doc.userDocument.Status__c == 'Uploaded' ) {
            // console.log('File already uploaded !!');
            swal({
                title: "Error",
                text: "A file has already been uploaded. You cannot upload another file.",
                icon: "error",
                button: "OK",
            });
            return;
        }
        */

        $scope.uploadProgress = 0;
        $scope.showProgressBar = true;
        $scope.isUploading = true;

        $scope.showSpinnereditProf = true;
        var file;
        maxFileSize = 5191680;
        file = document.getElementById('fileSignature').files[0];
        if (!file) {
            swal("info", "You must choose a file before trying to upload it", "info");
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
            $scope.resetUploadState();
            return;
        }
        fileName = file.name;
        var typeOfFile = fileName.split(".");
        lengthOfType = typeOfFile.length;
        if (typeOfFile[lengthOfType - 1] == "pdf" || typeOfFile[lengthOfType - 1] == "PDF") {

        } else {
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
            swal('info', 'Please choose pdf only.', 'info');
            return;
        }
        console.log(file);
        if (file != undefined) {
            if (file.size <= maxFileSize) {

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
                        // Add the info or warning message here after uploading
                        swal({
                            title: "Warning",
                            text: "Once you upload the file, it cannot be uploaded again. Please ensure this is the correct file.",
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
                                // console.log("Upload canceled");
                                $scope.resetUploadState();
                            }
                        });
                    } else {
                        $scope.isUploading = false;
                        $scope.showSpinnereditProf = false;
                        // swal("info", "Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".", "info");
                        swal("info", "File size should be lesser than 4 MB.", "info"); return;
                        // alert("Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".");
                    }

                }
                fileReader.onerror = function (e) {
                    $scope.isUploading = false;
                    $scope.showSpinnereditProf = false;
                    swal("info", "There was an error reading the file.  Please try again.", "info");
                    return;
                    // alert("There was an error reading the file.  Please try again.");
                }
                fileReader.onabort = function (e) {
                    $scope.isUploading = false;
                    $scope.showSpinnereditProf = false;
                    swal("info", "There was an error reading the file.  Please try again.", "info");
                    return;
                    // alert("There was an error reading the file.  Please try again.");
                }

                fileReader.readAsBinaryString(file);  //Read the body of the file

            } else {
                $scope.isUploading = false;
                $scope.showSpinnereditProf = false;
                swal("info", "File must be under 5 Mb in size.  Your file is too large.  Please try again.", "info");
                return;
            }
        } else {
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
            swal("info", "You must choose a file before trying to upload it", "info");
            return;
            // alert("You must choose a file before trying to upload it");
            // $scope.showSpinnereditProf = false;
        }
    }

    $scope.resetUploadState = function () {
        if (!$scope.$$phase) { // Check if Angular digest cycle is not already in progress
            $scope.$applyAsync(function () {
                $scope.isUploading = false;
                $scope.showSpinnereditProf = false;
                $scope.showProgressBar = false;
                $scope.uploadProgress = 0;
                document.getElementById('fileSignature').value = "";
            });
        } else {
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
        }
    };


    $scope.uploadAttachment = function (type, userDocId, fileId) {
        debugger;
        var attachmentBody = "";
        // if (fileId == undefined) {
        //     fileId = "";
        // }

        $scope.$applyAsync(function () {
            $scope.uploadProgress = Math.round((positionIndex / fileSize) * 100);
        });

        //if (fileSize <= positionIndex + chunkSize) {
        if (true) {
            debugger;
            attachmentBody = attachment.substring(positionIndex);
            doneUploading = true;
            $scope.isUploading = false;
            $scope.showSpinnereditProf = false;
        } else {
            attachmentBody = attachment.substring(positionIndex, positionIndex + chunkSize);
        }
        console.log("Uploading " + attachmentBody.length + " chars of " + fileSize);
        var stringAttachmentBody = String(attachmentBody);
        var stringAttachmentName = String(attachmentName);
        var stringFileId = fileId ? String(fileId) : '';
        var stringUserDocId = (userDocId && userDocId !== 'undefined') ? String(userDocId) : '';

        ApplicantPortal_Contoller.doCUploadAttachmentProjectDet(
            //attachmentBody, attachmentName, fileId, userDocId,
            stringAttachmentBody, stringAttachmentName, stringFileId, stringUserDocId,
            function (result, event) {
                console.log(result);
                if (event.type === 'exception') {
                    console.log("exception");
                    console.log(event);
                    $scope.isUploading = false;
                    $scope.showSpinnereditProf = false;
                } else if (event.status) {
                    if (doneUploading == true) {
                        $scope.isUploading = false;
                        $scope.showSpinnereditProf = false;
                        $scope.$applyAsync(function () {
                            $scope.uploadProgress = 100;
                        });
                        swal(
                            'success',
                            'Uploaded Successfully!',
                            'success'
                        )

                        setTimeout(function () {
                            $scope.isUploading = false; // Allow button to be clickable again
                            $scope.showProgressBar = false;
                            $scope.getDocsDet(); // Refresh doc list to get the new file link
                            if (!$scope.$$phase) $scope.$apply();
                        }, 1500);

                        $scope.getProjectdetils();
                        $scope.getDocsDet();
                        // $scope.disableSubmit = false;

                    } else {
                        debugger;
                        positionIndex += chunkSize;
                        $scope.uploadAttachment(type, userDocId, result);
                    }
                    $scope.showUplaodUserDoc = false;
                    // $scope.getCandidateDetails();
                }

            },


            { buffer: true, escape: true, timeout: 120000 }
        );
    }
    // $scope.uploadFile = function (type, userDocId, fileId,maxSize,minFileSize) {
    //     debugger;
    //     $scope.showSpinnereditProf = true;
    //     var file;

    //         file = document.getElementById('attachmentFiles').files[0];
    //         fileName = file.name;
    //         var typeOfFile = fileName.split(".");
    //         lengthOfType =  typeOfFile.length;
    //         if(typeOfFile[lengthOfType-1] != "pdf"){
    //             swal('info','Please choose pdf file only.','info');
    //             return;
    //         }
    //     console.log(file);
    //     maxFileSize=maxSize;
    //     if (file != undefined) {
    //         if (file.size <= maxFileSize) {

    //             attachmentName = file.name;
    //             const myArr = attachmentName.split(".");
    //             var fileReader = new FileReader();
    //             fileReader.onloadend = function (e) {
    //                 attachment = window.btoa(this.result);  //Base 64 encode the file before sending it
    //                 positionIndex = 0;
    //                 fileSize = attachment.length;
    //                 $scope.showSpinnereditProf = false;
    //                 console.log("Total Attachment Length: " + fileSize);
    //                 doneUploading = false;
    //                 debugger;
    //                 if (fileSize < maxStringSize) {
    //                     $scope.uploadAttachment(type , userDocId, null);
    //                 } else {
    //                     swal('info','Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".','info');
    //                     return;
    //                 }

    //             }
    //             fileReader.onerror = function (e) {
    //                 swal('info','There was an error reading the file.  Please try again.','info');
    //                 return;
    //             }
    //             fileReader.onabort = function (e) {
    //                 swal('info','There was an error reading the file.  Please try again.','info');
    //                 return;
    //             }

    //             fileReader.readAsBinaryString(file);  //Read the body of the file

    //         } else {
    //             swal('info','Your file is too large.  Please try again.','info');
    //             return;
    //             $scope.showSpinnereditProf = false;
    //         }
    //     } else {
    //         swal('info','You must choose a file before trying to upload it','info');
    //         return;
    //         $scope.showSpinnereditProf = false;
    //     }
    // }

    // $scope.uploadAttachment = function (type, userDocId, fileId) {
    //     debugger;
    //     var attachmentBody = "";
    //     // if (fileId == undefined) {
    //     //     fileId = " ";
    //     // }
    //     if (fileSize <= positionIndex + chunkSize) {
    //         debugger;
    //         attachmentBody = attachment.substring(positionIndex);
    //         doneUploading = true;
    //     } else {
    //         attachmentBody = attachment.substring(positionIndex, positionIndex + chunkSize);
    //     }
    //     console.log("Uploading " + attachmentBody.length + " chars of " + fileSize);
    //     ApplicantPortal_Contoller.doCUploadAttachmentAa(
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
    //                     // $scope.disableSubmit = false;

    //                     }
    //                    // $scope.getCandidateDetails();\
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
    $scope.readCharacter = function (event, index) {
        debugger
        try {
            var rtfString = event.toString().replace(/<[^>]*>|\s/g, '').replace(/\s+/g, '').replace(/&ndash;/g, '-').replace(/&euro;/g, '1').replace(/&amp;/g, '1').replace(/&#39;/g, '1').replace(/&quot;/g, '1').replace(/&nbsp;/g, '').replace(/&mdash;/g, '-').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&bull;/g, '');
            charLength = rtfString.length;
            if (charLength > 0) {
                $scope.objRtf[index].charCount = charLength;
            }
            else {
                $scope.objRtf[index].charCount = 0;
            }
        } catch (e) { }
    }

    $scope.saveDetails = function () {
        debugger;

        if ($scope.doc.userDocument.Status__c !== 'Uploaded') {
            // console.log('File already uploaded !!');
            swal({
                title: "Info",
                text: "A file must be uploaded before saving.",
                icon: "info",
                button: "OK",
            });
            return;
        }

        // if($scope.proposalDetails.Research_Approach_Objectives__c == undefined || $scope.proposalDetails.Research_Approach_Objectives__c == ""){
        //     Swal.fire(
        //         '',
        //       'Please fill main objectives of the research proposal.',
        //       'error'
        //       );
        //       return;
        // }
        // if($scope.proposalDetails.Current_State_Of_The_Art__c == undefined || $scope.proposalDetails.Current_State_Of_The_Art__c == ""){
        //     Swal.fire(
        //         '',
        //       'Please fill current state of the art.',
        //       'error'
        //       );
        //       return;
        // }
        // if($scope.proposalDetails.Project_Description__c == undefined || $scope.proposalDetails.Project_Description__c == ""){
        //     Swal.fire(
        //         '',
        //       'Please fill Project description of proposal.',
        //       'error'
        //       );
        //       return;
        // }
        // if($scope.proposalDetails.Expected_Deliverables__c == undefined || $scope.proposalDetails.Expected_Deliverables__c == ""){
        //     Swal.fire(
        //         '',
        //       'Please fill Expected Deliverables.',
        //       'error'
        //       );
        //       return;
        // }
        // if($scope.proposalDetails.Reasons_For_And_Benefits_Of_Cooperation__c == undefined || $scope.proposalDetails.Reasons_For_And_Benefits_Of_Cooperation__c == ""){
        //     Swal.fire(
        //         '',
        //       'Please fill Reasons for and benefits of cooperation including previous collaboration with the partner country.',
        //       'error'
        //       );
        //       return;
        // }
        // if($scope.proposalDetails.Equipment__c == undefined || $scope.proposalDetails.Equipment__c == ""){
        //     Swal.fire(
        //         '',
        //       'Please fill Proposal Equipment.',
        //       'error'
        //       );
        //       return;
        // }

        // if(($scope.proposalDetails.Criteria_For_Abandoning_The_Project__c == undefined || $scope.proposalDetails.Criteria_For_Abandoning_The_Project__c == "") && $rootScope.secondStage == true)
        //             {
        //                 Swal.fire(
        //                   '',
        //                 'Please fill citeria for abandoning the project.',
        //                 'error'
        //                 );
        //                     return;
        //             }

        // if(($scope.proposalDetails.Necessity_Of_Funding__c == undefined || $scope.proposalDetails.Necessity_Of_Funding__c == "") && $rootScope.secondStage == true)
        // {
        //     Swal.fire(
        //         '',
        //     'Tell us your necessity of funding..',
        //     'error'
        //     );
        //         return;
        // }
        $("#btnSubmit").html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Please wait...');
        ApplicantPortal_Contoller.insertProjectDetails($scope.proposalFieldsDetails, function (result, event) {
            //ApplicantPortal_Contoller.insertProjectDetails($scope.proposalDetails, function (result, event) {
            $("#btnSubmit").html('<i class="fa-solid fa-check me-2"></i>Save and Next');
            if (event.status) {
                debugger;
                // swal({
                //     title: "Success",
                //     text: "Project Details have been saved successfully.",
                //     icon: "success",
                //     buttons: true,
                //     dangerMode: false,
                // }).then((willDelete) => {
                //     if (willDelete) {
                //         if ($rootScope.secondStage) {
                //             $scope.redirectPageURL('ExpenseDeclaration');
                //         } else {
                //             $scope.redirectPageURL('Declartion_2plus2');
                //         }
                //     } else {
                //         return;
                //     }
                // });

                let messageText;

                messageText = $rootScope.secondStage
                    ? `Project Details have been saved successfully.

                    Next Step:
                    Please fill in the Expense Declaration Info.`
                    : `Project Details have been saved successfully.

                    Next Step:
                    Please fill in the Declaration Info.`;

                swal({
                    title: "Success",
                    text: messageText,
                    icon: "success",
                    button: "OK",
                    // buttons: true,
                    dangerMode: false,
                }).then((willDelete) => {
                    if (willDelete) {
                        if ($rootScope.secondStage) {
                            $scope.redirectPageURL('ExpenseDeclaration');
                        } else {
                            $scope.redirectPageURL('Declartion_2plus2');
                        }
                    } else {
                        return;
                    }
                });

                // Swal.fire(
                //     'Success',
                //     'Project Details have been saved successfully.',
                //     'success'
                // );
                // $scope.redirectPageURL('WorkPackages');
                // $scope.proposalDetails = result;
                // $scope.$apply();
            }
        },
            { escape: true }
        )
    }





    $scope.uploadFileToUserDoc = function () {
        debugger;
        $scope.selecteduDoc;
        if ($scope.fileId != undefined) {
            $scope.uploadFile($scope.proposalDetails.Id, $scope.fileId);
        } else {
            $scope.uploadFile($scope.proposalDetails.Id, "");
        }
    }

    $scope.redirectPageURL = function (pageName) {
        debugger;
        var link = document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href = "#/" + pageName;
        link.click();
    }

    /* ###################### NEW RTF FIELDS LOGIC HANDLED HERE  ###################### */
    $scope.proposalFieldsDetails;

    // $scope.objRtf = [{ charCount: 0, maxCharLimit: 1000, errorStatus: false }];

    $scope.getProjectDetailsData = function () {
        debugger;
        ApplicantPortal_Contoller.getProjectDetailsFromApex($rootScope.proposalId, function (result, event) {
            debugger;
            if (event.status && result) {
                debugger;
                // FOR STAGE 1 FIELDS
                if (result.Research_Approach_Objectives__c != undefined || result.Research_Approach_Objectives__c != "") {
                    result.Research_Approach_Objectives__c = result.Research_Approach_Objectives__c ? result.Research_Approach_Objectives__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Research_Approach_Objectives__c;
                }
                if (result.Current_State_Of_The_Art__c != undefined || result.Current_State_Of_The_Art__c != "") {
                    result.Current_State_Of_The_Art__c = result.Current_State_Of_The_Art__c ? result.Current_State_Of_The_Art__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Current_State_Of_The_Art__c;
                }
                if (result.Project_Description__c != undefined || result.Project_Description__c != "") {
                    result.Project_Description__c = result.Project_Description__c ? result.Project_Description__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Project_Description__c;
                }
                if (result.Expected_Deliverables__c != undefined || result.Expected_Deliverables__c != "") {
                    result.Expected_Deliverables__c = result.Expected_Deliverables__c ? result.Expected_Deliverables__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Expected_Deliverables__c;
                }
                if (result.Reasons_For_And_Benefits_Of_Cooperation__c != undefined || result.Reasons_For_And_Benefits_Of_Cooperation__c != "") {
                    result.Reasons_For_And_Benefits_Of_Cooperation__c = result.Reasons_For_And_Benefits_Of_Cooperation__c ? result.Reasons_For_And_Benefits_Of_Cooperation__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Reasons_For_And_Benefits_Of_Cooperation__c;
                }
                if (result.Equipment__c != undefined || result.Equipment__c != "") {
                    result.Equipment__c = result.Equipment__c ? result.Equipment__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Equipment__c;
                }
                if (result.Brief_Statement_of_Purpose__c != undefined || result.Brief_Statement_of_Purpose__c != "") {
                    result.Brief_Statement_of_Purpose__c = result.Brief_Statement_of_Purpose__c ? result.Brief_Statement_of_Purpose__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Brief_Statement_of_Purpose__c;
                }

                // FOR STAGE 2 FIELDS
                if (result.Main_Objective_Research_Approach_S2__c != undefined || result.Main_Objective_Research_Approach_S2__c != "") {
                    result.Main_Objective_Research_Approach_S2__c = result.Main_Objective_Research_Approach_S2__c ? result.Main_Objective_Research_Approach_S2__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Main_Objective_Research_Approach_S2__c;
                }
                if (result.Current_State_Of_The_Art_Stage_2__c != undefined || result.Current_State_Of_The_Art_Stage_2__c != "") {
                    result.Current_State_Of_The_Art_Stage_2__c = result.Current_State_Of_The_Art_Stage_2__c ? result.Current_State_Of_The_Art_Stage_2__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Current_State_Of_The_Art_Stage_2__c;
                }
                if (result.Project_Description_Stage_2__c != undefined || result.Project_Description_Stage_2__c != "") {
                    result.Project_Description_Stage_2__c = result.Project_Description_Stage_2__c ? result.Project_Description_Stage_2__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Project_Description_Stage_2__c;
                }
                if (result.Risk_Assessment_And_Migration_Strategy__c != undefined || result.Risk_Assessment_And_Migration_Strategy__c != "") {
                    result.Risk_Assessment_And_Migration_Strategy__c = result.Risk_Assessment_And_Migration_Strategy__c ? result.Risk_Assessment_And_Migration_Strategy__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Risk_Assessment_And_Migration_Strategy__c;
                }
                if (result.Reasons_For_And_Benefits_Of_Corp_Stage2__c != undefined || result.Reasons_For_And_Benefits_Of_Corp_Stage2__c != "") {
                    result.Reasons_For_And_Benefits_Of_Corp_Stage2__c = result.Reasons_For_And_Benefits_Of_Corp_Stage2__c ? result.Reasons_For_And_Benefits_Of_Corp_Stage2__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Reasons_For_And_Benefits_Of_Corp_Stage2__c;
                }
                if (result.Innovative_Aspects__c != undefined || result.Innovative_Aspects__c != "") {
                    result.Innovative_Aspects__c = result.Innovative_Aspects__c ? result.Innovative_Aspects__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Innovative_Aspects__c;
                }
                if (result.Market_Assessment_Of_Proposed_Tech__c != undefined || result.Market_Assessment_Of_Proposed_Tech__c != "") {
                    result.Market_Assessment_Of_Proposed_Tech__c = result.Market_Assessment_Of_Proposed_Tech__c ? result.Market_Assessment_Of_Proposed_Tech__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Market_Assessment_Of_Proposed_Tech__c;
                }
                if (result.Future_Commercialization_Plan__c != undefined || result.Future_Commercialization_Plan__c != "") {
                    result.Future_Commercialization_Plan__c = result.Future_Commercialization_Plan__c ? result.Future_Commercialization_Plan__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Future_Commercialization_Plan__c;
                }
                if (result.Data_Management_And_Sharing_Protocols__c != undefined || result.Data_Management_And_Sharing_Protocols__c != "") {
                    result.Data_Management_And_Sharing_Protocols__c = result.Data_Management_And_Sharing_Protocols__c ? result.Data_Management_And_Sharing_Protocols__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Data_Management_And_Sharing_Protocols__c;
                }
                if (result.Involvement_Of_Young_Scientists__c != undefined || result.Involvement_Of_Young_Scientists__c != "") {
                    result.Involvement_Of_Young_Scientists__c = result.Involvement_Of_Young_Scientists__c ? result.Involvement_Of_Young_Scientists__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Involvement_Of_Young_Scientists__c;
                }
                if (result.Necessity_Of_Funding__c != undefined || result.Necessity_Of_Funding__c != "") {
                    result.Necessity_Of_Funding__c = result.Necessity_Of_Funding__c ? result.Necessity_Of_Funding__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Necessity_Of_Funding__c;
                }

                $scope.proposalFieldsDetails = result;
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }
    $scope.getProjectDetailsData();

    // $scope.readCharacter = function (event, index) {
    //     debugger;

    //     try {
    //         var rtfString = event.toString().replace(/<[^>]*>|\s/g, '').replace(/\s+/g, '').replace(/&ndash;/g, '-').replace(/&euro;/g, '1').replace(/&amp;/g, '1').replace(/&#39;/g, '1').replace(/&quot;/g, '1').replace(/&nbsp;/g, '').replace(/&mdash;/g, '-').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&bull;/g, '');
    //         charLength = rtfString.length;
    //         if (charLength > 0) {
    //             $scope.objRtf[index].charCount = charLength;
    //             if (charLength > $scope.objRtf[index].maxCharLimit) {
    //                 $scope.objRtf[index].errorStatus = true;
    //             } else {
    //                 $scope.objRtf[index].errorStatus = false;
    //             }
    //         }
    //         else {
    //             $scope.objRtf[index].charCount = 0;
    //             $scope.objRtf[index].errorStatus = false;
    //         }
    //     } catch (e) { }
    // }



    $scope.objRtf = []; // start empty

    $scope.readCharacter = function (event, index, maxLimit) {
        try {

            // Initialize index if not exists
            if (!$scope.objRtf[index]) {
                $scope.objRtf[index] = {
                    charCount: 0,
                    maxCharLimit: maxLimit,
                    errorStatus: false
                };
            }

            if (!event) {
                $scope.objRtf[index].charCount = 0;
                $scope.objRtf[index].errorStatus = false;
                return;
            }

            // Strip HTML tags + entities
            var plainText = event
                .replace(/<[^>]*>/g, '')
                .replace(/&nbsp;/g, ' ')
                .replace(/&[a-zA-Z0-9#]+;/g, ' ');

            var charLength = plainText.length;

            $scope.objRtf[index].charCount = charLength;
            $scope.objRtf[index].errorStatus = charLength > maxLimit;

        } catch (e) { }
    };


    // ----------------------------- Need to add afterwards -----------------------------
    // if ($scope.applicantDetails.Summary__c != undefined || $scope.applicantDetails.Summary__c != "") {
    //         if ($scope.objRtf[0].errorStatus) {
    //             swal("info", "Summary max. length limit is 1000 character only.", "info");
    //             return;
    //         }
    //     }

});
