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
            swal('info', 'Please select a file before uploading.', 'info');
            return;
        }
        var file = inputElement.files[0];

        fileName = file.name;
        var typeOfFile = fileName.split(".");
        lengthOfType = typeOfFile.length;
        if (typeOfFile[lengthOfType - 1] == "pdf" || typeOfFile[lengthOfType - 1] == "PDF") {

        } else {
            swal('info', 'Please choose pdf file only.', 'info');
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
                        swal("info", "Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".", "info");
                        return;
                        //   alert("Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".");
                    }

                }
                fileReader.onerror = function (e) {
                    swal("info", "There was an error reading the file.  Please try again.", "info");
                    return;
                    //   alert("There was an error reading the file.  Please try again.");
                }
                fileReader.onabort = function (e) {
                    swal("info", "There was an error reading the file.  Please try again.", "info");
                    return;
                    //   alert("There was an error reading the file.  Please try again.");
                }

                fileReader.readAsBinaryString(file);  //Read the body of the file

            } else {
                swal("info", "File must be under 1 Mb in size.  Your file is too large.  Please try again.", "info");
                return;
                //   alert("File must be 1 MB in size.  Your file is too large.  Please try again.");
                //   $scope.showSpinnereditProf = false;
            }
        } else {
            swal("info", "You must choose a file before trying to upload it", "info");
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


    $scope.getPairingDetailsinWiser = function () {
        debugger;
        $scope.pairingDetails = [];
        if ($rootScope.campaignId == undefined) {
            $rootScope.campaignId = "";
        }
        ApplicantPortal_Contoller.getPairingDetailsinWiser($rootScope.candidateId, $rootScope.proposalId, function (result, event) {
            debugger;
            if (event.status) {
                if (result != null) {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].Birthdate != null || result[i].Birthdate != undefined) {
                            $scope.birthDatepresent[i] = true;
                            result[i].Birthdate = new Date(result[i].Birthdate);
                        } else {
                            $scope.birthDatepresent[i] = false;
                        }

                        if (result[i].Account != undefined) {
                            if (result[i].FirstName != undefined || result[i].FirstName != '') {
                                result[i].FirstName = result[i].FirstName ? result[i].FirstName.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].FirstName;
                            }
                            if (result[i].LastName != undefined || result[i].LastName != '') {
                                result[i].LastName = result[i].LastName ? result[i].LastName.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].LastName;
                            }
                            if (result[i].Account.Name != undefined || result[i].Account.Name != '') {
                                result[i].Account.Name = result[i].Account.Name ? result[i].Account.Name.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].Account.Name;
                            }
                        }
                    }

                }
                debugger;

                if (result == null || result.length == 0) {
                    $scope.pairingDetails.push({
                        "FirstName": " ",
                        "LastName": " ",
                        "Email": " ",
                        "Birthdate": "",
                        "MailingCountry": "",
                        // "Campaign__c":$scope.campaigntype
                    });
                } else {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].Is_Primary__c == true) {
                            $scope.pairingDetails = result[i];
                            if ($scope.pairingDetails.MailingCountry == "India") {
                                $scope.pairList.MailingCountry = "Germany";
                                $scope.country2 = "German";
                                $scope.country1 = "Indian";
                            } else {
                                $scope.pairList.MailingCountry = "India";
                                $scope.country2 = "Indian";
                                $scope.country1 = "German";
                            }
                        } else if (result[i].Is_Primary__c == false) {
                            $scope.pairList = result[i];
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
                $scope.$apply();

            }
        }, {
            escape: true
        })
    }
    $scope.getPairingDetailsinWiser();


    $scope.insertPairingDetailsinWiser = function () {
        debugger;
        $scope.detailedList = [];
        $scope.conList = [];
        $scope.detailedList.push($scope.pairingDetails, $scope.pairList);
        console.log('detailedList :: ' + $scope.detailedList);
        debugger;

        // 🔹 Force DOB validation on Save
        $scope.validateDOB($scope.pairingDetails.Birthdate, 'dobPrimary');
        $scope.validateDOB($scope.pairList.Birthdate, 'dobSecondary');

        // 🔹 Stop save if DOB invalid
        if ($scope.dobErrors.dobPrimary || $scope.dobErrors.dobSecondary) {
            swal(
                "Invalid Date of Birth",
                "Age must be more than 26 years and less than 55 years.",
                "info"
            );
            return;
        }

        if ($scope.pairingDetails != undefined) {

            if ($scope.pairingDetails.FirstName == undefined || $scope.pairingDetails.FirstName == "") {
                swal("info", "Please Enter First Name.");
                $("#txtIndFN").addClass('border-theme');
                return;
            }

            if ($scope.pairingDetails.LastName == undefined || $scope.pairingDetails.LastName == "") {
                swal("info", "Please Enter Last Name.");
                $("#txtIndLN").addClass('border-theme');
                return;
            }

            if ($scope.pairingDetails.Email == undefined || $scope.pairingDetails.Email == "") {
                swal("info", "Please Enter Email.");
                $("#txtIndEmail").addClass('border-theme');
                return;
            } else {
                if ($scope.valid($scope.pairingDetails.Email)) {
                    swal(
                        'info',
                        'Check Your Registered Email.',
                        'info'
                    )
                    $("#txtIndEmail").addClass('border-theme');
                    return;
                }
            }

            if ($scope.pairingDetails.Account == undefined || $scope.pairingDetails.Account == "") {
                swal("info", "Please Enter Institution / Organization Name.");
                $("#txtIndOrg").addClass('border-theme');
                return;
            }

            if ($scope.pairingDetails.Account != undefined) {
                if ($scope.pairingDetails.Account.Name == undefined) {
                    swal("info", "Please Enter Institution / Organization Name.");
                    $("#txtIndOrg").addClass('border-theme');
                    return;
                }
            }

            if ($scope.pairingDetails.Birthdate == undefined || $scope.pairingDetails.Birthdate == "") {
                swal("info", "Please Enter BirthDate.");
                $("#txtIndBD").addClass('border-theme');
                return;
            }
        }



        if ($scope.pairList != undefined) {
            if ($scope.pairList.FirstName == undefined || $scope.pairList.FirstName == "") {
                swal("info", "Please Enter First Name.");
                $("#txtGerFN").addClass('border-theme');
                return;
            }

            if ($scope.pairList.LastName == undefined || $scope.pairList.LastName == "") {
                swal("info", "Please Enter Last Name.");
                $("#txtGerLn").addClass('border-theme');
                return;
            }

            if ($scope.pairList.Email == undefined || $scope.pairList.Email == "") {
                swal("info", "Please Enter Email.");
                $("#txtGerEmail").addClass('border-theme');
                return;
            } else {
                if ($scope.valid($scope.pairList.Email)) {
                    swal(
                        'info',
                        'Check Your Registered Email.',
                        'info'
                    )
                    $("#txtGerEmail").addClass('border-theme');
                    return;
                }
            }

            if ($scope.pairList.Account == undefined || $scope.pairList.Account == "") {
                swal("info", "Please Enter Institution / Organization Name.");
                $("#txtGerOrg").addClass('border-theme');
                return;
            }

            if ($scope.pairList.Account != undefined) {
                if ($scope.pairList.Account.Name == undefined) {
                    swal("info", "Please Enter Institution / Organization Name.");
                    $("#txtGerOrg").addClass('border-theme');
                    return;
                }
            }

            if ($scope.pairList.Birthdate == undefined || $scope.pairList.Birthdate == "") {
                swal("info", "Please Enter BirthDate.");
                $("#txtGerBD").addClass('border-theme');
                return;
            }



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

            for (var i = 0; i < $scope.detailedList.length; i++) {
                delete ($scope.detailedList[i].Birthdate);
            }

            ApplicantPortal_Contoller.insertPairingDetailsinWiser($scope.conList, $rootScope.campaignId, $rootScope.yearlyCallId, function (result, event) {
                if (event.status) {
                    debugger;
                    // Saving the ProposalId in Local Storage
                    localStorage.setItem('proposalId', result.proposalId);
                    localStorage.setItem('apaId', result.apa.Id);
                    swal({
                        title: "Pairing Details",
                        text: 'Pairing details have been successfully saved.',
                        icon: "success",
                        button: "ok!",
                    }).then((value) => {
                        $scope.getPairingDetailsinWiser();
                        $scope.redirectPageURL('WiserApplicationPage');
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
    }

    $scope.redirectToApplicantPortal = function () {
        $scope.redirectPageURL('HostProjectDetails');
        // window.location.href = 'https://indo-germansciencetechnologycentre--newdevutil.sandbox.my.salesforce-sites.com/ApplicantDashboard/ApplicantPortal?id=%27 + $rootScope.candidateId'
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
            swal('info', 'Please upload the PDF file.', 'info');
        }
        else {
            $scope.applicantDetails.Campaign__c = $rootScope.campaignId;
            debugger;

            if ($scope.applicantDetails.Title_Of__c == undefined || $scope.applicantDetails.Title_Of__c == "") {
                swal("info", "Please Enter Title of proposal.", "info");
                $("#txtTitle").addClass('border-theme');
                return;
            }

            if ($scope.applicantDetails.Broad_area_of_research__c == undefined || $scope.applicantDetails.Broad_area_of_research__c == "") {
                swal("info", "Please Enter Broad Area of Reasearch.", "info");
                $("#txtResearch").addClass('border-theme');
                return;
            }

            if ($scope.applicantDetails.Duration_In_Months_Max_36__c == undefined || $scope.applicantDetails.Duration_In_Months_Max_36__c == "") {
                swal("info", "Please Enter Project Duration.", "info");
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
                swal("info", "Please Enter Keyword.", "info");
                $("#txtKeyword").addClass('border-theme');
                return;
            }

            if ($scope.applicantDetails.Abstract_of_proposed_work__c == undefined || $scope.applicantDetails.Abstract_of_proposed_work__c == "") {
                swal("info", "Please Enter Abstract of proposed work.", "info");
                return;
            } else {
                //    var div = document.createElement("div");
                //   div.innerHTML = $scope.applicantDetails.Abstract_of_proposed_work__c;
                //   let abstractText = div.innerText.replace(/(\r\n\t|\t|\n|\r)/gm, "");
                //   abstractText = abstractText.replaceAll(' ','');

                //   console.log('abstractText---',abstractText);
                //   console.log('abstractTextLength---',abstractText.length);


                if ($scope.objRtf[0].charCount > 600) {
                    swal("info", "Abstract of proposed work maxlength will be 600 characters only.", "info");
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
    $scope.validateDOB = function (dob, fieldName) {
        debugger;

        if (!dob) {
            $scope.dobErrors[fieldName] = false;
            return;
        }

        var today = new Date();
        var birthDate = new Date(dob);

        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();

        // Adjust if birthday has not occurred yet this year
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Age rule: >26 and <55
        $scope.dobErrors[fieldName] = !(age > 26 && age < 55);
    };



})