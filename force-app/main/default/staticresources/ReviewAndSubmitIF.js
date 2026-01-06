angular.module('cp_app').controller('ReviewAndSubmitIF_Ctrl', function ($scope, $sce, $rootScope) {
    debugger
    $scope.SignDate = new Date($rootScope.signDate);
    $scope.objContact = {};
    $scope.disableSubmit = true;
    $scope.allDocs = {};
    $scope.doc = {};
    $scope.allSixDoc = {};
    // local state variables (avoid implicit globals)
    var maxFileSize = 0,
        fileName = '',
        lengthOfType = 0,
        attachmentName = '',
        attachment = '',
        positionIndex = 0,
        fileSize = 0,
        doneUploading = false;
    debugger
    // $scope.redirectPageURL = function (URL) {
    //     var link = document.createElement("a");
    //     link.id = 'someLink'; //give it an ID!
    //     link.href = '#/' + URL + '';
    //     link.click();
    // }
    $scope.redirectPageURL = function(pageName) {
    debugger;
    var link = document.createElement("a");

    let baseUrl = link.baseURI;
    // Remove hash part ( #/something )
    if (baseUrl.includes('#/')) {
        baseUrl = baseUrl.split('#/')[0];
    }
    if (pageName === 'Home') {
        // Get id and campaign from current URL dynamically
        let urlParams = new URLSearchParams(window.location.search);
        let id = urlParams.get("id") || "";
        let campaign ='Industrial Fellowships';
        // Build final HOME URL format dynamically
        let finalUrl = baseUrl;
        if (campaign) {
         //   finalUrl += "&campaign=" + campaign;
        }
       // finalUrl += "#/Home";
        finalUrl;
        // link.href = finalUrl;
        // link.click();
        
         // 1️⃣ Redirect to Home
        window.location.replace(finalUrl);

        // 2️⃣ Refresh AFTER redirect
        setTimeout(function () {
            window.location.reload();
        }, 100);
 
    } else {
        // For other pages → keep same base + hash routing
        link.href = baseUrl + "#/" + pageName;
        link.click();
    }
};

    
    
     // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }

    $scope.selectedFile;

    $scope.filePreviewHandler = function (fileContent) {
        debugger;
        $scope.selectedFile = fileContent;

        console.log('selectedFile---', $scope.selectedFile);

        $('#file_frame').attr('src', $scope.selectedFile.ContentDistribution.DistributionPublicUrl);

        var myModal = new bootstrap.Modal(document.getElementById('filePreview'))
        myModal.show('slow');
        if (!$scope.$$phase) $scope.$apply();

        //.ContentDistribution.DistributionPublicUrl
    }

    $scope.getProjectdetils = function () {
        debugger;

        $scope.selectedFile = '';
        // $('#file_frame').attr('src', '');
        ApplicantPortal_Contoller.getContactUserDoc($rootScope.contactId,$rootScope.proposalId,function (result, event) {
            debugger
            console.log('result return onload :: ');
            console.log(result);
            // Defensive: verify result shape — expected an array of userDocument wrappers
            if (event.status) {
                var looksLikeApplicantData = result && result.campaignList !== undefined;
                if (looksLikeApplicantData) {
                    // This response appears to be for getApplicantData — log and ignore
                    console.warn('Received applicantData in getContactUserDoc callback — ignoring.');
                    console.warn(result);
                    return;
                }
                if (!Array.isArray(result)) {
                    console.warn('getContactUserDoc returned unexpected payload:', result);
                    return;
                }
                $scope.allDocs = result;
                var uploadCount = 0;
                for (var i = 0; i < $scope.allDocs.length; i++) {
                    if ($scope.allDocs[i].userDocument.Name == 'Signature') {
                        $scope.doc = $scope.allDocs[i];
                        if ($scope.allDocs[i].userDocument.Status__c == 'Uploaded') {
                            uploadCount = uploadCount + 1;
                        }
                    }
                    else if ($scope.allDocs[i].userDocument.Name == 'All six documents in single file') {
                        $scope.allSixDoc = $scope.allDocs[i];
                        if ($scope.allDocs[i].userDocument.Status__c == 'Uploaded') {
                            uploadCount = uploadCount + 1;
                        }
                    }
                    if (uploadCount == 2)
                        $scope.disableSubmit = false;
                }
                if (!$scope.$$phase) $scope.$apply();
            }
        }, {
            escape: true
        })
    }
    $scope.getOnload = function () {
        IndustrialFellowshipController.getContactSingh($rootScope.candidateId, function (result, event) {
            debugger
            console.log(result);
            $scope.getProjectdetils();
            console.log(event);
            if (event.status) {
                if (result.Declaration_Sign_Date__c != undefined && $rootScope.proposalStage) {
                    $scope.SignDate = new Date(result.Declaration_Sign_Date__c);
                }
                $scope.objContact = result;

                $scope.$apply();
            }
        });

        //  $scope.getProjectdetils();
    }
    $scope.getOnload();
    // $scope.getProjectdetils();
    $scope.submitProposalIF = function (saveType) {
        // $scope.redirectPageURL('Home');
        debugger
        if ($rootScope.proposalStage) {
            // $scope.redirectPageURL('Home');
            return;
        }
        if ($rootScope.disabledCampaign) {
            swal('Campaign ended', 'Campaign deadline has been lapsed.', 'info');
            return;
        }
        var year = 0;
        var month = 0;
        var day = 0;
        if (saveType == 's') {
            if ($scope.SignDate != undefined && $scope.SignDate != '') {
                year = $scope.SignDate.getUTCFullYear();
                month = $scope.SignDate.getUTCMonth() + 1;
                day = $scope.SignDate.getDate();
                // delete $scope.objContact.Birthdate;
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
                        $scope.submitApplicationDetail(saveType, year, month, day);
                    } else {
                        return;
                    }
                });
        }
        else {
            $scope.submitApplicationDetail(saveType, year, month, day);
        }

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
        IndustrialFellowshipController.getCongaDoc($rootScope.projectId, function (result, event) {
            debugger
            console.log("attachamnet id");
            console.log(result);
            if (result.length < 1) {
                swal('', 'Document generation fail, please try again or contact to support.', 'error');
                return;
            }
            var myModal = new bootstrap.Modal(document.getElementById('filePreview2'))
            myModal.show('slow');
            if (!$scope.$$phase) $scope.$apply();
        });
    }
    $scope.submitApplicationDetail = function (saveType, year, month, day) {
        delete $scope.objContact.Attachments
        IndustrialFellowshipController.submitProposalIF($scope.objContact, saveType, $rootScope.proposalId, year, month, day, function (result, event) {
            console.log(result);
            console.log(event);
            debugger
            if (event.status) {
                if (saveType == 'd') {
                    swal({
                        title: "Save as a draft",
                        text: "Your Proposal has been saved as Draft!",
                        icon: "success",
                        buttons: "OK",
                        dangerMode: false,
                    }).then((willDelete) => {
                        if (willDelete) {
                            $scope.redirectPageURL('Home');                            
                            // $scope.redirectPageURL = function (URL) {
                            //     var link = document.createElement("a");
                            //     link.id = 'someLink'; //give it an ID!
                            //     link.href = '#/' + URL + '';
                            //     link.click();
                                
                            // }
                        } else {
                            return;
                        }
                    });
                }
                else {
                    $rootScope.proposalStage = true;
                    CKEDITOR.config.readOnly = true;
                    swal({
                        title: "Submit",
                        text: "Your Proposal has been submitted successfully!",
                        icon: "success",
                        buttons: "OK",
                        dangerMode: false,
                    }).then((willDelete) => {
                        if (willDelete) {
                             $scope.redirectPageURL('Home');                          
                            // $scope.redirectPageURL = function (URL) {
                            //     var link = document.createElement("a");
                            //     link.id = 'someLink'; //give it an ID!
                            //     link.href = '#/' + URL + '';
                            //     link.click();
                            // }
                        } else {
                            return;
                        }
                    });
                    // swal('success','Your Proposal has been submitted successfully','success');
                    // $rootScope.proposalStage=true;
                    // CKEDITOR.config.readOnly = true;
                }
                //$scope.redirectPageURL('Home');
            }
        });
    }

     
    $scope.uploadFile = function (type, userDocId, fileId, fileSizeFun) {
        debugger;
        maxFileSize = fileSizeFun;
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
        if (file != undefined) {
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
                    positionIndex = 0;
                    fileSize = attachment.length;
                    $scope.showSpinnereditProf = false;
                    console.log("Total Attachment Length: " + fileSize);
                    doneUploading = false;
                    debugger;
                    if (fileSize < maxStringSize) {
                        $scope.uploadAttachment(type, userDocId, fileId);
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
        var chunkSize = 750000;
        if (fileId == undefined) {
            fileId = " ";
        }
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
});