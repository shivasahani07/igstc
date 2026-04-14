/**
 * @author [Dinesh B]
 * @email dinesh.b@utilitarianLab.com
 * @create date 2022-08-13 13:18:26
 * @modify date 2022-10-15 12:58:57
 * @desc [description]
 */


angular.module('cp_app').controller('ProjectDetailInWiserCtrl', function ($scope, $sce, $rootScope) {
    debugger;
    $rootScope.userHashId;
    //new 
    $rootScope.campaignId;
    //
    $rootScope.userId;
    $rootScope.candidateId;

    $rootScope.contactId;
    $scope.objKeyword = [];
    $scope.doc = {};
    $scope.config.height = 500;
    $scope.objRtf = [{ charCount: 0, maxCharLimit: 600, errorStatus: false }];
    $scope.objRtf.push({ charCount: 0, maxCharLimit: 4500, errorStatus: false });
    debugger;

    $scope.selectedFile;
    $scope.isPdfUploded = false;
    $scope.isLoading = true; // Spinner flag
    $scope.showFullInfoBox = false; // Initialize info box as collapsed

    // ============================================
    /*var maxFileSize = 1048576; // 1MB in bytes
    var maxStringSize = 6000000; // Maximum base64 string size 
    var chunkSize = 950000; // Chunk size for splitting large files
    var attachment = '';
    var attachmentName = '';
    var positionIndex = 0;
    var fileSize = 0;
    var fileName = '';
    var lengthOfType = 0;
    var doneUploading = false;*/
    var maxFileSize = 1048576;
    var chunkSize = 950000;

    $scope.filePreviewHandler = function (fileContent) {
        debugger;
        $scope.selectedFile = fileContent;

        console.log('selectedFile---', $scope.selectedFile);

        var jhj = $scope.selectedFile.userDocument.Attachments[0].Id;
        console.log(jhj);

        $scope.filesrec = $sce.trustAsResourceUrl(window.location.origin + '/ApplicantDashboard/servlet/servlet.FileDownload?file=' + $scope.selectedFile.userDocument.Attachments[0].Id);
        $('#file_frame').attr('src', $scope.filesrec);

        // $('#file_frame').attr('src', $scope.selectedFile.ContentDistribution.DistributionPublicUrl);

        var myModal = new bootstrap.Modal(document.getElementById('filePreview'))
        myModal.show('slow');
        $scope.$apply();

        //.ContentDistribution.DistributionPublicUrl
    }


    $scope.getDataFromLocalStorage = function () {
        debugger;
        if (localStorage.getItem('candidateId')) {
            $rootScope.candidateId = localStorage.getItem('candidateId');
        }
        if (localStorage.getItem('apaId')) {
            $rootScope.apaId = localStorage.getItem('apaId');
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

    $scope.getProjectdetils = function () {
        debugger;
        ApplicantPortal_Contoller.getAllUserDoc($rootScope.projectId, function (result, event) {
            debugger
            console.log('result return onload :: ');
            console.log(result);
            if (event.status) {
                $scope.allDocs = result;
                $scope.userdocsIds = '';
                for (var i = 0; i < $scope.allDocs.length; i++) {
                    if ($scope.allDocs[i].userDocument.Name == 'project Description') {
                        $scope.doc = $scope.allDocs[i];
                        // Append ID with a comma only if userdocsIds is not empty
                        if ($scope.userdocsIds) {
                            $scope.userdocsIds += ',';
                        }
                        $scope.userdocsIds += $scope.allDocs[i].userDocument.Id;
                        if ($scope.allDocs[i].userDocument.Status__c == 'Uploaded') {
                            $scope.isPdfUploded = true;
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
    $scope.uploadFile = function (type, userDocId, fileId, fileSizeFun) {
        debugger;
        maxFileSize = fileSizeFun;
        $scope.showSpinnereditProf = true;
        var file;
        //new Lines 
        var inputElement = document.getElementById(type);
        if (!inputElement || !inputElement.files || inputElement.files.length === 0) {
            swal('Info', 'Please select a file before uploading.', 'info');
            return;
        }
        var file = inputElement.files[0];

        fileName = file.name;
        var typeOfFile = fileName.split(".");
        lengthOfType = typeOfFile.length;
        if (typeOfFile[lengthOfType - 1] == "pdf" || typeOfFile[lengthOfType - 1] == "PDF") {

        } else {
            swal('Info', 'Please choose pdf file only.', 'info');
            return;
        }
        console.log(file);
        if (file != undefined) {
            var fileSize1 = file.size / 2;
            if (file.size <= maxFileSize) {

                attachmentName = file.name;
                const myArr = attachmentName.split(".");
                /* if (myArr[1] != "pdf" && type != 'profilePic') {
                    alert("Please upload in PDF format only");
                    return;
                } */
                var fileReader = new FileReader();
                var maxStringSize = 6000000;
                fileReader.onloadend = function (e) {
                    attachment = window.btoa(this.result);  //Base 64 encode the file before sending it
                    console.log("Attachments========> ", attachment, this.result);
                    positionIndex = 0;
                    fileSize = attachment.length;
                    $scope.showSpinnereditProf = false;
                    console.log("Total Attachment Length: " + fileSize);
                    doneUploading = false;
                    debugger;

                    if (fileSize < maxStringSize) {
                        $scope.uploadAttachment(type, userDocId, null);
                    } else {
                        swal("Info", "Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".", "info");
                        return;
                        //   alert("Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".");
                    }

                }
                fileReader.onerror = function (e) {
                    swal("Info", "There was an error reading the file.  Please try again.", "info");
                    return;
                    //   alert("There was an error reading the file.  Please try again.");
                }
                fileReader.onabort = function (e) {
                    swal("Info", "There was an error reading the file.  Please try again.", "info");
                    return;
                    //   alert("There was an error reading the file.  Please try again.");
                }

                fileReader.readAsBinaryString(file);  //Read the body of the file

            } else {
                swal("Info", "File must be under 1 Mb in size.  Your file is too large.  Please try again.", "info");
                return;
                //   alert("File must be 1 MB in size.  Your file is too large.  Please try again.");
                //   $scope.showSpinnereditProf = false;
            }
        } else {
            swal("Info", "You must choose a file before trying to upload it", "info");
            return;
            //   alert("You must choose a file before trying to upload it");
            //   $scope.showSpinnereditProf = false;
        }
    }

    $scope.uploadAttachment = function (type, userDocId, fileId) {
        debugger;
        var attachmentBody = "";
        var chunkSize = 750000;
        //   if (fileId == undefined) {
        //       fileId = " ";
        //   }
        if (fileSize <= positionIndex + chunkSize) {
            debugger;
            attachmentBody = attachment.substring(positionIndex);
            doneUploading = true;
        } else {
            attachmentBody = attachment.substring(positionIndex, positionIndex + chunkSize);
        }
        console.log("Uploading " + attachmentBody.length + " chars of " + fileSize);
        ApplicantPortal_Contoller.doCUploadAttachmentSignatureCustom(
            attachmentBody, attachmentName, fileId, userDocId,
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

                        //   }
                        $scope.showUplaodUserDoc = false;
                        // $scope.getCandidateDetails();
                        $scope.isPdfUploded = true;

                    } else {
                        debugger;
                        positionIndex += chunkSize;
                        $scope.uploadAttachment(type, userDocId, result);
                    }
                }
            },


            { buffer: true, escape: true, timeout: 240000 }
        );
    }


    //**********************New methods by karthik for pairing page************************************//

    debugger;
    $scope.siteURL = siteURL;
    $rootScope.campaignId;
    $scope.pairList = { "Account": { "Name": "" } };
    $scope.country1;
    $scope.country2;
    $scope.pairingDetails = { "Account": { "Name": "" } };
    $scope.mydate = new Date('2013', '10', '28');

    $scope.birthDatepresent = [];

    // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }

    // Fetching the yearlyCallId from Local Storage
    if (localStorage.getItem('yearlyCallId')) {
        $rootScope.yearlyCallId = localStorage.getItem('yearlyCallId');
        console.log('Loaded yearlyCallId from localStorage:', $rootScope.yearlyCallId);
    }

    $scope.getActiveCampaignData = function () {
        debugger;
        ApplicantPortal_Contoller.getActiveCampaign($rootScope.yearlyCallId, function (result, event) {
            debugger
            console.log('Direct Test Result:', result);
            console.log('Direct Test Event:', event);

            if (event.status && result != null) {
                $rootScope.campaignId = result[0].Campaign__c;
                localStorage.setItem('campaignId', result[0].Campaign__c);
                $scope.$apply();
            } else {
                console.warn('No active campaign found or error occurred');
            }
        });
    };
    $scope.getActiveCampaignData();

    // Fetching the campaignId from Local Storage
    if (localStorage.getItem('campaignId')) {
        $rootScope.campaignId = localStorage.getItem('campaignId');
        console.log('Loaded campaignId from localStorage:', $rootScope.campaignId);
    }


    $scope.getPairingDetailsinWiser = function (showSpinner) {
        debugger;
        // Show spinner only on initial load (when showSpinner is true or undefined)
        if (showSpinner !== false) {
            $scope.isLoading = true;
        }
        // Initialize as object, not array
        $scope.pairingDetails = { "Account": { "Name": "" } };
        if ($rootScope.campaignId == undefined) {
            $rootScope.campaignId = "";
        }
        ApplicantPortal_Contoller.getPairingDetailsinWiser($rootScope.candidateId, $rootScope.proposalId, function (result, event) {
            debugger;
            if (event.status) {
                if (result != null) {
                    for (var i = 0; i < result.length; i++) {
                        // Extract contact from wrapper (new structure) or use result directly (backward compatibility)
                        var contactData = result[i].contact || result[i];
                        var isCoordinator = result[i].isCoordinator != null ? result[i].isCoordinator : false;

                        if (contactData.Birthdate != null || contactData.Birthdate != undefined) {
                            $scope.birthDatepresent[i] = true;
                            contactData.Birthdate = new Date(contactData.Birthdate);
                        } else {
                            $scope.birthDatepresent[i] = false;
                        }

                        if (contactData.Account != undefined) {
                            if (contactData.FirstName != undefined || contactData.FirstName != '') {
                                contactData.FirstName = contactData.FirstName ? contactData.FirstName.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : contactData.FirstName;
                            }
                            if (contactData.LastName != undefined || contactData.LastName != '') {
                                contactData.LastName = contactData.LastName ? contactData.LastName.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : contactData.LastName;
                            }
                            if (contactData.Account.Name != undefined || contactData.Account.Name != '') {
                                contactData.Account.Name = contactData.Account.Name ? contactData.Account.Name.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : contactData.Account.Name;
                            }
                        }
                    }

                }
                debugger;

                if (result == null || result.length == 0) {
                    $scope.pairingDetails = {
                        "FirstName": " ",
                        "LastName": " ",
                        "Email": " ",
                        "Birthdate": "",
                        "MailingCountry": "",
                        "Account": { "Name": "" }
                        // "Campaign__c":$scope.campaigntype
                    };
                } else {
                    // First, check if there's a coordinator (APA exists)
                    var hasCoordinator = false;
                    var coordinatorContact = null;
                    var loggedInContact = null;
                    var nonCoordinatorContacts = [];

                    for (var i = 0; i < result.length; i++) {
                        // Extract contact from wrapper (new structure) or use result directly (backward compatibility)
                        var contactData = result[i].contact || result[i];
                        var isCoordinator = result[i].isCoordinator != null ? result[i].isCoordinator : false;
                        var isLoggedInContact = result[i].isLoggedInContact != null ? result[i].isLoggedInContact : false;

                        if (isCoordinator == true) {
                            hasCoordinator = true;
                            coordinatorContact = contactData;
                        }

                        // Track logged-in contact separately
                        if (isLoggedInContact == true) {
                            loggedInContact = contactData;
                        }

                        // Track all non-coordinator contacts (including logged-in if not coordinator)
                        if (isCoordinator == false) {
                            nonCoordinatorContacts.push(contactData);
                        }
                    }

                    // Logic: If coordinator exists, show coordinator in first block; otherwise show logged-in contact
                    if (hasCoordinator && coordinatorContact) {
                        // Coordinator exists - show coordinator in first block
                        $scope.pairingDetails = coordinatorContact;
                        // Ensure Account object exists
                        if (!$scope.pairingDetails.Account) {
                            $scope.pairingDetails.Account = { Name: "" };
                        }
                        if ($scope.pairingDetails.MailingCountry == "India") {
                            $scope.pairList.MailingCountry = "Germany";
                            $scope.country2 = "German";
                            $scope.country1 = "Indian";
                        } else {
                            $scope.pairList.MailingCountry = "India";
                            $scope.country2 = "Indian";
                            $scope.country1 = "German";
                        }

                        // Find the non-coordinator contact for second block
                        var secondContact = null;
                        if (loggedInContact && loggedInContact.Id != coordinatorContact.Id) {
                            secondContact = loggedInContact;
                        } else if (nonCoordinatorContacts.length > 0) {
                            secondContact = nonCoordinatorContacts[0];
                        }

                        if (secondContact) {
                            $scope.pairList = angular.copy(secondContact);
                            // Ensure Account object exists and has Name property
                            if (!$scope.pairList.Account || typeof $scope.pairList.Account !== 'object') {
                                $scope.pairList.Account = { Name: "" };
                            } else if (!$scope.pairList.Account.hasOwnProperty('Name') || $scope.pairList.Account.Name === null || $scope.pairList.Account.Name === undefined) {
                                $scope.pairList.Account.Name = $scope.pairList.Account.Name || "";
                            }

                            // Ensure all required fields have default values if missing
                            $scope.pairList.FirstName = $scope.pairList.FirstName || "";
                            $scope.pairList.LastName = $scope.pairList.LastName || "";
                            $scope.pairList.Email = $scope.pairList.Email || "";
                            $scope.pairList.Id = $scope.pairList.Id || "";
                            $scope.pairList.AccountId = $scope.pairList.AccountId || "";

                            if ($scope.pairList.MailingCountry == "Germany") {
                                $scope.pairingDetails.MailingCountry = "India";
                                $scope.country1 = "Indian";
                                $scope.country2 = "German";
                            } else {
                                $scope.pairingDetails.MailingCountry = "Germany";
                                $scope.country1 = "German";
                                $scope.country2 = "Indian";
                            }
                        }
                    } else if (loggedInContact) {
                        // No coordinator exists (first time) - show logged-in contact in first block
                        $scope.pairingDetails = loggedInContact;
                        // Ensure Account object exists
                        if (!$scope.pairingDetails.Account) {
                            $scope.pairingDetails.Account = { Name: "" };
                        }
                        if ($scope.pairingDetails.MailingCountry == "India") {
                            $scope.pairList.MailingCountry = "Germany";
                            $scope.country2 = "German";
                            $scope.country1 = "Indian";
                        } else {
                            $scope.pairList.MailingCountry = "India";
                            $scope.country2 = "Indian";
                            $scope.country1 = "German";
                        }

                        // Find another contact for second block (not the logged-in contact)
                        var secondContact = null;
                        for (var j = 0; j < nonCoordinatorContacts.length; j++) {
                            if (nonCoordinatorContacts[j].Id != loggedInContact.Id) {
                                secondContact = nonCoordinatorContacts[j];
                                break;
                            }
                        }

                        if (secondContact) {
                            $scope.pairList = angular.copy(secondContact);
                            // Ensure Account object exists and has Name property
                            if (!$scope.pairList.Account || typeof $scope.pairList.Account !== 'object') {
                                $scope.pairList.Account = { Name: "" };
                            } else if (!$scope.pairList.Account.hasOwnProperty('Name') || $scope.pairList.Account.Name === null || $scope.pairList.Account.Name === undefined) {
                                $scope.pairList.Account.Name = $scope.pairList.Account.Name || "";
                            }

                            // Ensure all required fields have default values if missing
                            $scope.pairList.FirstName = $scope.pairList.FirstName || "";
                            $scope.pairList.LastName = $scope.pairList.LastName || "";
                            $scope.pairList.Email = $scope.pairList.Email || "";
                            $scope.pairList.Id = $scope.pairList.Id || "";
                            $scope.pairList.AccountId = $scope.pairList.AccountId || "";

                            if ($scope.pairList.MailingCountry == "Germany") {
                                $scope.pairingDetails.MailingCountry = "India";
                                $scope.country1 = "Indian";
                                $scope.country2 = "German";
                            } else {
                                $scope.pairingDetails.MailingCountry = "Germany";
                                $scope.country1 = "German";
                                $scope.country2 = "Indian";
                            }
                        }
                    }
                }
                if (showSpinner !== false) {
                    $scope.isLoading = false; // Hide spinner after data is loaded
                }
                $scope.$apply();

            } else {
                if (showSpinner !== false) {
                    $scope.isLoading = false; // Hide spinner on error
                }
            }
        }, {
            escape: true
        })
    }
    $scope.getPairingDetailsinWiser();


    $scope.insertPairingDetailsinWiser = function () {
        debugger;

        // Disable button at start
        $("#btnPreview").prop('disabled', true);

        $scope.detailedList = [];
        $scope.conList = [];
        $scope.detailedList.push($scope.pairingDetails, $scope.pairList);
        console.log('detailedList :: ' + $scope.detailedList);
        debugger;

        // // 🔹 Force DOB validation on Save
        // $scope.validateDOB($scope.pairingDetails.Birthdate, 'dobPrimary');
        // $scope.validateDOB($scope.pairList.Birthdate, 'dobSecondary');

        // // 🔹 Stop save if DOB invalid
        // if ($scope.dobErrors.dobPrimary || $scope.dobErrors.dobSecondary) {
        //     $("#btnPreview").prop('disabled', false);
        //     swal(
        //         "Invalid Date of Birth",
        //         "Age must be more than 26 years and less than 55 years.",
        //         "info"
        //     );
        //     return;
        // }

        if ($scope.pairingDetails != undefined) {

            if ($scope.pairingDetails.Email == undefined || $scope.pairingDetails.Email == "") {
                $("#btnPreview").prop('disabled', false);
                swal("Info", "Please Enter Email.");
                $("#txtIndEmail").addClass('border-theme');
                return;
            } else {
                if ($scope.valid($scope.pairingDetails.Email)) {
                    $("#btnPreview").prop('disabled', false);
                    swal(
                        'Info',
                        'Check Your Registered Email.',
                        'info'
                    )
                    $("#txtIndEmail").addClass('border-theme');
                    return;
                }
            }

            if ($scope.pairingDetails.FirstName == undefined || $scope.pairingDetails.FirstName == "") {
                $("#btnPreview").prop('disabled', false);
                swal("Info", "Please Enter First Name.");
                $("#txtIndFN").addClass('border-theme');
                return;
            }

            if ($scope.pairingDetails.LastName == undefined || $scope.pairingDetails.LastName == "") {
                $("#btnPreview").prop('disabled', false);
                swal("Info", "Please Enter Last Name.");
                $("#txtIndLN").addClass('border-theme');
                return;
            }

            // if ($scope.pairingDetails.Account == undefined || $scope.pairingDetails.Account == "") {
            //     swal("Info", "Please Enter Institution / Organization Name.");
            //     $("#txtIndOrg").addClass('border-theme');
            //     return;
            // }

            if (
                !$scope.pairingDetails ||
                !$scope.pairingDetails.Account ||
                !$scope.pairingDetails.Account.Name ||
                !$scope.pairingDetails.Account.Name.trim()
            ) {
                $("#btnPreview").prop('disabled', false);
                swal("Info", "Please Enter Institution / Organization Name.");
                $("#txtIndOrg").addClass('border-theme');
                return;
            }

            if ($scope.pairingDetails.Account != undefined) {
                if ($scope.pairingDetails.Account.Name == undefined) {
                    $("#btnPreview").prop('disabled', false);
                    swal("Info", "Please Enter Institution / Organization Name.");
                    $("#txtIndOrg").addClass('border-theme');
                    return;
                }
            }

            if ($scope.pairingDetails.Birthdate == undefined || $scope.pairingDetails.Birthdate == "") {
                $("#btnPreview").prop('disabled', false);
                swal("Info", "Please Enter BirthDate.");
                $("#txtIndBD").addClass('border-theme');
                return;
            }
        }

        if ($scope.pairList != undefined) {

            if ($scope.pairList.Email == undefined || $scope.pairList.Email == "") {
                $("#btnPreview").prop('disabled', false);
                swal("Info", "Please Enter Email.");
                $("#txtGerEmail").addClass('border-theme');
                return;
            } else {
                if ($scope.valid($scope.pairList.Email)) {
                    $("#btnPreview").prop('disabled', false);
                    swal(
                        'Info',
                        'Check Your Registered Email.',
                        'info'
                    )
                    $("#txtGerEmail").addClass('border-theme');
                    return;
                }
            }

            // Validation: 2nd contact must be an existing contact (must have Id)
            if (!$scope.pairList.Id || $scope.pairList.Id === '') {
                $("#btnPreview").prop('disabled', false);
                swal({
                    title: "Contact Validation",
                    text: "The second member of the pair must be an existing contact. Please enter a valid email address of an existing contact.",
                    icon: "error",
                    button: "OK"
                });
                $("#txtGerEmail").addClass('border-theme');
                return;
            }

            if ($scope.pairList.FirstName == undefined || $scope.pairList.FirstName == "") {
                $("#btnPreview").prop('disabled', false);
                swal("Info", "Please Enter First Name.");
                $("#txtGerFN").addClass('border-theme');
                return;
            }

            if ($scope.pairList.LastName == undefined || $scope.pairList.LastName == "") {
                $("#btnPreview").prop('disabled', false);
                swal("Info", "Please Enter Last Name.");
                $("#txtGerLn").addClass('border-theme');
                return;
            }

            if (
                !$scope.pairList ||
                !$scope.pairList.Account ||
                !$scope.pairList.Account.Name ||
                !$scope.pairList.Account.Name.trim()
            ) {
                $("#btnPreview").prop('disabled', false);
                swal("Info", "Please Enter Institution / Organization Name.");
                $("#txtGerOrg").addClass('border-theme');
                return;
            }

            if ($scope.pairList.Birthdate == undefined || $scope.pairList.Birthdate == "") {
                $("#btnPreview").prop('disabled', false);
                swal("Info", "Please Enter BirthDate.");
                $("#txtGerBD").addClass('border-theme');
                return;
            }

            // Check if both contacts already exist for this proposal - if yes, allow edit; if no, check limit
            if ($rootScope.proposalId) {
                var contact1Id = ($scope.pairingDetails && $scope.pairingDetails.Id) ? $scope.pairingDetails.Id : null;
                var contact2Id = ($scope.pairList && $scope.pairList.Id) ? $scope.pairList.Id : null;

                if (contact1Id && contact2Id) {
                    // Check if both contacts already have APAs for this proposal
                    ApplicantPortal_Contoller.checkContactsHaveAPAs($rootScope.proposalId, [contact1Id, contact2Id], function (hasAPAs, event) {
                        if (event.status && hasAPAs) {
                            // Editing existing contacts - allow save
                            $scope.proceedWithSave();
                        } else {
                            // Adding new contacts - check limit
                            ApplicantPortal_Contoller.getAPACountForProposal($rootScope.proposalId, function (count, event) {
                                if (event.status && count >= 2) {
                                    swal({
                                        title: "Maximum Partners Reached",
                                        text: "Already two Partners are existing for the current Proposal. Cannot add more partners.",
                                        icon: "error",
                                        button: "OK"
                                    });
                                    $("#btnPreview").prop('disabled', false);
                                } else {
                                    $scope.proceedWithSave();
                                }
                            }, { escape: true });
                        }
                    }, { escape: true });
                    return;
                } else {
                    // One or both contacts missing IDs - check limit
                    ApplicantPortal_Contoller.getAPACountForProposal($rootScope.proposalId, function (count, event) {
                        if (event.status && count >= 2) {
                            swal({
                                title: "Maximum Partners Reached",
                                text: "Already two Partners are existing for the current Proposal. Cannot add more partners.",
                                icon: "error",
                                button: "OK"
                            });
                            $("#btnPreview").prop('disabled', false);
                        } else {
                            $scope.proceedWithSave();
                        }
                    }, { escape: true });
                    return;
                }
            }

            $scope.proceedWithSave();
        }
    }

    // Separate function to handle the actual save logic
    $scope.proceedWithSave = function () {
        debugger;
        $scope.detailedList = [];
        $scope.conList = [];
        $scope.detailedList.push($scope.pairingDetails, $scope.pairList);
        console.log('detailedList :: ' + $scope.detailedList);
        debugger;

        for (let i = 0; i < $scope.detailedList.length; i++) {
            delete ($scope.detailedList[i]['$$hashKey']);
            var pairingObj = {
                "companyNmae": $scope.detailedList[i].Account.Name, "proposal": $rootScope.projectId, "accId": $scope.detailedList[i].AccountId, "birthyear": 0, "birthmonth": 0, "birthday": 0, cont: {
                    "FirstName": $scope.detailedList[i].FirstName, "LastName": $scope.detailedList[i].LastName, "Id": $scope.detailedList[i].Id, "Email": $scope.detailedList[i].Email, "Campaign__c": $scope.campaigntype, "MailingCountry": $scope.detailedList[i].MailingCountry, AccountId: $scope.detailedList[i].AccountId, "Proposals__c": $rootScope.projectId
                }
            };
            pairingObj.companyNmae = $scope.detailedList[i].Account.Name;

            if ($scope.detailedList[i].Birthdate == undefined || $scope.detailedList[i].Birthdate == '') {
                delete ($scope.detailedList[i].Birthdate);
            } else if ($scope.detailedList[i].Birthdate != undefined || $scope.detailedList[i].Birthdate != "") {
                pairingObj.birthyear = $scope.detailedList[i].Birthdate.getUTCFullYear();
                //pairingObj.birthmonth = $scope.detailedList[i].Birthdate.getUTCMonth()+1;
                pairingObj.birthmonth = $scope.birthDatepresent[i] ? $scope.detailedList[i].Birthdate.getUTCMonth() + 1 : $scope.detailedList[i].Birthdate.getUTCMonth() + 2;
                pairingObj.birthday = $scope.detailedList[i].Birthdate.getDate();

            }
            $scope.conList.push(pairingObj);

        }

        // for (var i = 0; i < $scope.detailedList.length; i++) {
        //     delete ($scope.detailedList[i].Birthdate);
        // }

        // Show spinner on button
        $("#btnPreview").html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Please wait...');
        $("#btnPreview").prop('disabled', true);

        // Get the coordinator contact ID (first block contact - pairingDetails)
        var coordinatorContactId = ($scope.pairingDetails && $scope.pairingDetails.Id) ? $scope.pairingDetails.Id : null;

        // Get the logged-in contact hashcode (candidateId) to return their specific APA
        var loggedInContactHashcode = $rootScope.candidateId || null;

        ApplicantPortal_Contoller.insertPairingDetailsinWiser($scope.conList, $rootScope.campaignId, $rootScope.yearlyCallId, $rootScope.proposalId, coordinatorContactId, loggedInContactHashcode, function (result, event) {
            if (event.status) {
                debugger;
                console.log("Result In insertPairingDetailsinWiser ::", result);

                // Restore button
                $("#btnPreview").html('<i class="fa-solid fa-check me-2"></i>Save and Next');
                $("#btnPreview").prop('disabled', false);

                // Saving the ProposalId and APAId in Local Storage (similar to saveHostProjectInformation)
                if (result && result.proposalId) {
                    localStorage.setItem('proposalId', result.proposalId);
                    $rootScope.proposalId = result.proposalId;
                    console.log('Saved proposalId to localStorage:', result.proposalId);
                }

                if (result && result.apa && result.apa.Id) {
                    localStorage.setItem('apaId', result.apa.Id);
                    $rootScope.apaId = result.apa.Id;
                    console.log('Saved apaId to localStorage:', result.apa.Id);
                }

                swal({
                    title: "Pairing Details",
                    text: 'Pairing details have been successfully saved.',
                    icon: "success",
                    button: "ok!",
                }).then((value) => {
                    $scope.getPairingDetailsinWiser(false); // Don't show spinner on refresh
                    // $scope.redirectPageURL('WiserApplicationPage');
                    $scope.redirectPageURL('HostProjectDetails');
                });
                //  Swal.fire(
                //      'Success',
                //      'Pairing detail has been saved successfully.',
                //      'success'
                //  );
                // $scope.redirectPageURL('WiserApplicationPage');
                $scope.$apply();
            }
            else {
                // Restore button on error
                $("#btnPreview").html('<i class="fa-solid fa-check me-2"></i>Save and Next');
                $("#btnPreview").prop('disabled', false);
                swal({
                    title: "Pairing Details",
                    text: "Exception!",
                    icon: "error",
                    button: "ok!",
                });
            }
        },
            { escape: true }
        )
    }

    $scope.redirectToApplicantPortal = function () {
        // $scope.redirectPageURL('HostProjectDetails');
        //window.location.href = 'https://indo-germansciencetechnologycentre--newdevutil.sandbox.my.salesforce-sites.com/ApplicantDashboard/ApplicantPortal?id=%27 + $rootScope.candidateId'
        window.location.href = 'https://indo-germansciencetechnologycentre.my.salesforce-sites.com/ApplicantDashboard/ApplicantPortal?id=' + $rootScope.candidateId;
    };

    $scope.valid = function (value) {
        if (value != undefined) {
            var x = value;
            var atpos = x.indexOf("@");
            var dotpos = x.lastIndexOf(".");
            if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {

                return true;
            }
            return false;
        }
    }



    ////////////****************************New methods by karthik for pairing page*************************** */


    /*
    $scope.getApplicantDetailsWiser = function () {


        ApplicantPortal_Contoller.getApplicantDetailsWiser($rootScope.candidateId, $rootScope.proposalId, function (result, event) {
            if (event.status) {
                debugger;
                if (result != null) {
                    if (result.Title_Of__c != undefined || result.Title_Of__c != "") {
                        result.Title_Of__c = result.Title_Of__c ? result.Title_Of__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Title_Of__c;
                    }
                    if (result.Broad_area_of_research__c != undefined || result.Broad_area_of_research__c != "") {
                        result.Broad_area_of_research__c = result.Broad_area_of_research__c ? result.Broad_area_of_research__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Broad_area_of_research__c;
                    }
                    if (result.KeyWords__c != undefined || result.KeyWords__c != "") {
                        result.KeyWords__c = result.KeyWords__c ? result.KeyWords__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.KeyWords__c;
                    }
                    if (result.Abstract_of_proposed_work__c != undefined || result.Abstract_of_proposed_work__c != "") {
                        result.Abstract_of_proposed_work__c = result.Abstract_of_proposed_work__c ? result.Abstract_of_proposed_work__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Abstract_of_proposed_work__c;
                    }
                    if (result.Project_Description__c != undefined || result.Project_Description__c != "") {
                        result.Project_Description__c = result.Project_Description__c ? result.Project_Description__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Project_Description__c;
                    }
                    $scope.applicantDetails = result;
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
                } else {
                    $scope.objKeyword.push({ "keyword": "" });
                }
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }
    $scope.getApplicantDetailsWiser();
    */



    $scope.applicantDetails = {};
    $scope.saveApplication = function () {
        debugger;

        if (!$scope.isPdfUploded) {
            swal('Info', 'Please upload the PDF file.', 'info');
        }
        else {
            $scope.applicantDetails.Campaign__c = $rootScope.campaignId;
            debugger;

            if ($scope.applicantDetails.Title_Of__c == undefined || $scope.applicantDetails.Title_Of__c == "") {
                swal("Info", "Please Enter Title of proposal.", "info");
                $("#txtTitle").addClass('border-theme');
                return;
            }

            if ($scope.applicantDetails.Broad_area_of_research__c == undefined || $scope.applicantDetails.Broad_area_of_research__c == "") {
                swal("Info", "Please Enter Broad Area of Reasearch.", "info");
                $("#txtResearch").addClass('border-theme');
                return;
            }

            if ($scope.applicantDetails.Duration_In_Months_Max_36__c == undefined || $scope.applicantDetails.Duration_In_Months_Max_36__c == "") {
                swal("Info", "Please Enter Project Duration.", "info");
                $("#txtDuration").addClass('border-theme');
                return;
            }

            if ($scope.applicantDetails.Duration_In_Months_Max_36__c < 24 || $scope.applicantDetails.Duration_In_Months_Max_36__c > 36) {
                swal("Proposal Detail", "Duration must be between 24 to 36 months.");
                $("#txtDuration").addClass('border-theme');
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

            if ($scope.applicantDetails.KeyWords__c == undefined || $scope.applicantDetails.KeyWords__c == "") {
                swal("Info", "Please Enter Keyword.", "info");
                $("#txtKeyword").addClass('border-theme');
                return;
            }

            if ($scope.applicantDetails.Abstract_of_proposed_work__c == undefined || $scope.applicantDetails.Abstract_of_proposed_work__c == "") {
                swal("Info", "Please Enter Abstract of proposed work.", "info");
                return;
            } else {
                //    var div = document.createElement("div");
                //   div.innerHTML = $scope.applicantDetails.Abstract_of_proposed_work__c;
                //   let abstractText = div.innerText.replace(/(\r\n\t|\t|\n|\r)/gm, "");
                //   abstractText = abstractText.replaceAll(' ','');

                //   console.log('abstractText---',abstractText);
                //   console.log('abstractTextLength---',abstractText.length);


                if ($scope.objRtf[0].charCount > 600) {
                    swal("Info", "Abstract of proposed work maxlength will be 600 characters only.", "info");
                    return;
                }
            }


            //     if($scope.applicantDetails.Project_Description__c == undefined || $scope.applicantDetails.Project_Description__c == ""){
            //          swal("info", "Please Enter Project Description.","info");
            //          // $("#txtDescription").addClass('border-theme');
            //          return;  
            //     }else{
            //       //    var div = document.createElement("div");
            //       //   div.innerHTML = $scope.applicantDetails.Project_Description__c;
            //       //   let description = div.innerText.replace(/(\r\n\t|\t|\n|\r)/gm, "");
            //       //   description = description.replaceAll(' ','');

            //         //  if($scope.objRtf[1].charCount > 4500){
            //         //      swal("info", "Project description maxlength will be 4500 characters only.","info");
            //         //      return;
            //         //  }
            //  }



            // if ($scope.applicantDetails.Duration_In_Months_Max_36__c > 36){
            //      swal("Proposal Detail", "Duration must be under 36 months.");
            //      $("#txtDuration").addClass('border-theme');
            //        return;
            //  }
            if (!$rootScope.proposalStage) {
                $scope.applicantDetails.Proposal_Stages__c = 'Draft';
            } else {
                $scope.applicantDetails.Proposal_Stages__c = 'Submitted';
            }

            ApplicantPortal_Contoller.insertApplicationWiser($scope.applicantDetails, $rootScope.contactId, 'WISER', function (result, event) {

                if (event.status && result != null) {
                    $rootScope.projectId = result;
                    console.log(result);
                    swal({
                        title: "SUCCESS",
                        text: 'Your project details have been saved successfully.',
                        icon: "success",
                        button: "ok!",
                    })
                    // $scope.redirectPageURL('FinancialOverview_wiser');
                    $scope.redirectPageURL('WiserApplicationPage');

                } else {
                    swal({
                        title: "ERROR",
                        text: "Exception !",
                        icon: "error",
                        button: "ok!",
                    });
                }

                //    if (event.status && result != null) {
                //         $rootScope.projectId = result;
                //         console.log(result);
                //         Swal.fire(
                //              'Success',
                //              'Your project details have been saved successfully.',
                //              'success'
                //         );
                //         $scope.redirectPageURL('FinancialOverview_wiser');
                //    } else {
                //         Swal.fire(
                //              'Error',
                //              'Error.',
                //              'error'
                //         );
                //    }

            });
        }
    };

    // $scope.getApplicantDetailsWiser();
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

    $scope.restrictDecimalVal = function (myVar) {
        debugger;
        if (myVar > 36) {
            $scope.applicantDetails.Duration_In_Months_Max_36__c = 36;
            //     return false;
        }
        else {
            return true;
        }
    }

    $scope.redirectPageURL = function (pageName) {
        debugger;
        var link = document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href = "#/" + pageName;
        link.click();
    }

    $scope.rtfMaxLength = function (myVar) {
        debugger
        var k = myVar;
        if (myVar.length > 300) {
            return false;
        }
        else {
            return true;
        }
    }
    $scope.removeClass = function (controlid) {
        $("#" + controlid + "").removeClass('border-theme');
    }

    // ======================== BIRTH DATA & AGE VERIFICATION VALIDATION ======================= //
    // Store DOB validation errors per field
    $scope.dobErrors = {};

    // Reusable DOB validation function
    // $scope.validateDOB = function (dob, fieldName) {
    //     debugger;

    //     if (!dob) {
    //         $scope.dobErrors[fieldName] = false;
    //         return;
    //     }

    //     var today = new Date();
    //     var birthDate = new Date(dob);

    //     var age = today.getFullYear() - birthDate.getFullYear();
    //     var m = today.getMonth() - birthDate.getMonth();

    //     // Adjust if birthday has not occurred yet this year
    //     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    //         age--;
    //     }

    //     // Age rule: >26 and <55
    //     $scope.dobErrors[fieldName] = !(age > 26 && age < 55);
    // };

    // $scope.getApplicantStatusFromAPA = function () {
    //     debugger;

    //     if (!$rootScope.apaId) {
    //         console.log('APA Id not available yet, skipping fetchApplicantStatus call');
    //         return;
    //     }

    //     ApplicantPortal_Contoller.fetchApplicantStatus(
    //         $rootScope.apaId,
    //         function (result, event) {
    //             debugger;

    //             if (event.status) {
    //                 $rootScope.isCurrentUserSubmitted = result;

    //                 // 🔐 Lock editor condition
    //                 $scope.isEditorLocked = ($scope.proposalStage || result);

    //                 // 🔒 Apply lock to CKEditor
    //                 $scope.toggleCkEditorReadOnly($scope.isEditorLocked);
    //             }
    //         },
    //         { escape: true }
    //     );
    // };
    // $scope.getApplicantStatusFromAPA();

    $scope.toggleCkEditorReadOnly = function (isReadOnly) {
        setTimeout(function () {
            if (CKEDITOR.instances) {
                Object.keys(CKEDITOR.instances).forEach(function (instanceName) {
                    CKEDITOR.instances[instanceName].setReadOnly(isReadOnly);
                });
            }
        }, 0);
    };

    $scope.checkEmail = function (email, contId) {
        debugger;
        $scope.emailCheck = false;

        // Clear previous contact data if email is empty
        if (!email || email.trim() === '') {
            $scope.pairList.Id = '';
            $scope.$apply();
            return;
        }

        // Validate email format first
        if ($scope.valid(email)) {
            $scope.emailCheck = false;
            $scope.pairList.Id = '';
            $scope.$apply();
            return;
        }

        if (contId == undefined) {
            contId = "";
        }

        // Determine opposite MailingCountry based on first contact's MailingCountry
        var oppMailingCountry = "";
        if ($scope.pairingDetails && $scope.pairingDetails.MailingCountry) {
            if ($scope.pairingDetails.MailingCountry == "India") {
                oppMailingCountry = "Germany";
            } else {
                oppMailingCountry = "India";
            }
        } else {
            // Default to India if pairingDetails is not available
            oppMailingCountry = "India";
        }

        ApplicantPortal_Contoller.checkEmailWiser(email, contId, oppMailingCountry, $rootScope.yearlyCallId, function (result, event) {
            debugger;
            if (event.status) {
                debugger;
                // Check for error message first (if contact has already applied for a campaign in current year)
                if (result && result.errorMessage) {
                    // Show error message - contact has already applied
                    $scope.emailCheck = false;
                    $scope.pairList.Id = '';
                    $scope.pairList.FirstName = '';
                    $scope.pairList.LastName = '';
                    $scope.pairList.Birthdate = '';
                    $scope.pairList.Account = { Name: '' };
                    $scope.pairList.AccountId = '';
                    // Keep the email that was entered
                    $scope.pairList.Email = email;

                    swal({
                        title: "Application Already Exists",
                        text: result.errorMessage,
                        icon: "error",
                        button: "OK"
                    });
                    $scope.$apply();
                    return;
                }

                // Check if contacts exist in the wrapper
                if (result && result.contacts && result.contacts.length > 0) {
                    // Contact exists - populate pairList with contact data including Id
                    var contact = result.contacts[0];
                    $scope.pairList.Id = contact.Id || '';
                    $scope.pairList.FirstName = contact.FirstName || '';
                    $scope.pairList.LastName = contact.LastName || '';
                    $scope.pairList.Email = contact.Email || email;
                    $scope.pairList.Birthdate = contact.Birthdate
                        ? new Date(Number(contact.Birthdate))
                        : '';
                    $scope.pairList.MailingCountry = contact.MailingCountry || '';
                    $scope.pairList.Campaign__c = $scope.campaigntype;
                    $scope.pairList.Account = contact.Account || { Name: '' };
                    $scope.pairList.AccountId = contact.AccountId || '';

                    $scope.emailCheck = true;

                    // Show success message that contact exists
                    swal({
                        title: "Contact Found",
                        text: "Contact exists in the system.",
                        icon: "success",
                        button: "OK",
                        timer: 2000
                    });
                }
                else {
                    // Contact doesn't exist - show error and clear contact-specific fields
                    $scope.emailCheck = false;
                    $scope.pairList.Id = '';
                    $scope.pairList.FirstName = '';
                    $scope.pairList.LastName = '';
                    $scope.pairList.Birthdate = '';
                    $scope.pairList.Account = { Name: '' };
                    $scope.pairList.AccountId = '';
                    // Keep the email that was entered
                    $scope.pairList.Email = email;

                    swal({
                        title: "Contact Not Found",
                        text: "This email does not exist in the system. Only existing contacts can be added as the second member of the pair.",
                        icon: "error",
                        button: "OK"
                    });
                }
                $scope.$apply();
            } else {
                // Handle RemoteAction error
                $scope.emailCheck = false;
                $scope.pairList.Id = '';
                swal({
                    title: "Error",
                    text: event.message || "An error occurred while checking the email.",
                    icon: "error",
                    button: "OK"
                });
                $scope.$apply();
            }
        })

    }


})