angular.module('cp_app').controller('address_ctrl', function ($scope, $sce, $rootScope) {

    // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }

    // Disable the Fields if the Proposal already exists.
    /*
    if($rootScope.proposalId){
        $scope.disableConsortiaAddressFields = true;
    }
          */

    $scope.siteURL = siteURL;
    $scope.selectedFile;
    $scope.proposalStage = $scope.proposalStage ? true : ($scope.secondstage ? true : false);

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

        var myModal = new bootstrap.Modal(document.getElementById('filePreview'));
        myModal.show('slow');
        $scope.$apply();

        //.ContentDistribution.DistributionPublicUrl
    }

    $scope.getProjectdetils = function () {
        debugger;
        $scope.selectedFile = '';
        $('#file_frame').attr('src', '');
        ApplicantPortal_Contoller.getContactUserDoc($rootScope.contactId, $rootScope.proposalId, function (result, event) {
            debugger
            console.log('result return onload :: ');
            console.log(result);
            /**
             * Added by : Aman [ result != null ]
             * Date : 25 Aug 2023
             * Description : Added null check for the result. Issue was that Coordinator details were not coming up correctly.
             */
            if (event.status && result != null) {
                $scope.allDocs = result;
                var uploadCount = 0;
                for (var i = 0; i < $scope.allDocs.length; i++) {
                    debugger;
                    if ($scope.allDocs[i].userDocument.Name == 'DSIR') {
                        $scope.doc = $scope.allDocs[i];
                        if ($scope.allDocs[i].userDocument.Status__c == 'Uploaded') {
                            uploadCount = uploadCount + 1;
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

    $scope.uploadFile = function (type, userDocId, fileId, maxSize, minFileSize) {

        debugger;
        var maxStringSize = 6000000;

        $scope.showSpinnereditProf = true;
        var file;

        file = document.getElementById(type).files[0];
        fileName = file.name;
        var typeOfFile = fileName.split(".");
        lengthOfType = typeOfFile.length;
        if (typeOfFile[lengthOfType - 1] != "pdf") {
            swal('info', 'Please choose pdf file only.', 'info');
            return;
        }
        console.log(file);
        maxFileSize = maxSize;
        if (file != undefined) {
            if (file.size <= maxFileSize) {

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
                    }

                }
                fileReader.onerror = function (e) {
                    swal('info', 'There was an error reading the file.  Please try again.', 'info');
                    return;
                }
                fileReader.onabort = function (e) {
                    swal('info', 'There was an error reading the file.  Please try again.', 'info');
                    return;
                }

                fileReader.readAsBinaryString(file);  //Read the body of the file

            } else {
                swal('info', 'Your file is too large.  Please try again.', 'info');
                return;
                $scope.showSpinnereditProf = false;
            }
        } else {
            swal('info', 'You must choose a file before trying to upload it', 'info');
            return;
            $scope.showSpinnereditProf = false;
        }
    }

    $scope.uploadAttachment = function (type, userDocId, fileId) {
        debugger;
        var chunkSize = 750000;
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
        ApplicantPortal_Contoller.doCUploadAttachmentAa(
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
                    // $scope.getCandidateDetails();\
                    else {
                        debugger;
                        positionIndex += chunkSize;
                        $scope.uploadAttachment(type, userDocId, result);
                    }
                    $scope.showUplaodUserDoc = false;
                }
            },


            { buffer: true, escape: true, timeout: 120000 }
        );
    }

    $scope.getDependentPicklistValues = function () {
        debugger;
        $scope.indianStates = [];
        $scope.germanStates = [];
        ApplicantPortal_Contoller.getFieldDependencies('Contact', 'Country__c', 'States__c', function (result, event) {
            debugger;
            if (event.status && result != null) {
                debugger;
                var indianStatesArray = result.India;
                $scope.indianStates = indianStatesArray.map(item => item == "Union Territory of J&amp;K" ? "Union Territory of J&K" : item);
                $scope.germanStates = result.Germany;
                $scope.allStates = result.India.concat(result.Germany);
                $scope.$apply();
            }
        }
        )
    }
    $scope.getDependentPicklistValues();

    $scope.getAddressDetails = function () {
        debugger;
        ApplicantPortal_Contoller.getAddressDetails($rootScope.candidateId, function (result, event) {
            if (event.status) {
                debugger;
                $scope.addressDetails = result;
                console.log('onload');
                console.log(result);
                if ($scope.addressDetails.Name != undefined) {
                    $scope.addressDetails.Name = $scope.addressDetails.Name.replace(/&amp;/g, '&').replace(/&#39;/g, '\'').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'');
                }
                if ($scope.addressDetails.Contacts[0].Department != undefined)
                    $scope.addressDetails.Contacts[0].Department = $scope.addressDetails.Contacts[0].Department.replace(/&amp;/g, '&').replace(/&#39;/g, '\'').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'');
                if ($scope.addressDetails.BillingStreet != undefined)
                    $scope.addressDetails.BillingStreet = $scope.addressDetails.BillingStreet.replace(/&amp;/g, '&').replace(/&#39;/g, '\'').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'');
                if ($scope.addressDetails.BillingCity != undefined)
                    $scope.addressDetails.BillingCity = $scope.addressDetails.BillingCity.replace(/&amp;/g, '&').replace(/&#39;/g, '\'').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'');
                if ($scope.addressDetails.BillingState != undefined)
                    $scope.addressDetails.BillingState = $scope.addressDetails.BillingState.replace(/&amp;/g, '&').replace(/&#39;/g, '\'').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'');

                if ($scope.addressDetails.BillingCountry == 'India') {
                    $scope.stateList = $scope.indianStates;
                } else if ($scope.addressDetails.BillingCountry == 'Germany') {
                    $scope.stateList = $scope.germanStates;
                }
                //$scope.addressDetails.ShippingCountry = $scope.addressDetails.BillingCountry; 
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }
    $scope.getAddressDetails();
    $scope.onCountryChange = function () {
        debugger;

        if ($scope.addressDetails.MailingCountry == 'India') {
            $scope.stateList = $scope.indianStates;
        } else if ($scope.addressDetails.MailingCountry == 'Germany') {
            $scope.stateList = $scope.germanStates;
        }
        $scope.$apply();
    }
    $scope.redirectPageURL = function (pageName) {
        var link = document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href = "#/" + pageName;
        link.click();
    }

    $scope.saveAddressDetails = function () {
        debugger;

        if ($scope.addressDetails.Name == undefined || $scope.addressDetails.Name == "") {
            swal("Address Details", "Please Enter Institution/Industry Name.");
            $("#inst").addClass('border-theme');
            return;
        }
        // if($scope.addressDetails.BillingCountry == 'India' && $scope.addressDetails.Industry__c == true && $scope.addressDetails.DSIR_Recoginition_Details__c == undefined){
        //     swal("Address Details", "Please Enter DSIR Number.");
        //     $("#dsir").addClass('border-theme');
        //     return;
        // }
        if ($scope.addressDetails.Contacts[0].Title == undefined || $scope.addressDetails.Contacts[0].Title == "") {
            swal("Address Details", "Please select salutation");
            $("#ddTitle").addClass('border-theme');
            return;
        }
        if ($scope.addressDetails.Contacts[0].Designation__c == undefined || $scope.addressDetails.Contacts[0].Designation__c == "") {
            swal("Address Details", "Please Enter Designation.");
            $("#IState").addClass('border-theme');
            return;
        }
        if ($scope.addressDetails.Website == undefined || $scope.addressDetails.Website == "") {
            swal("Address Details", "Please Enter HomePage URL.");
            $("#IState").addClass('border-theme');
            return;
        }
        if ($scope.addressDetails.Contacts[0].Name == undefined || $scope.addressDetails.Contacts[0].Name == "") {
            swal("Address Details", "Please Enter Head of Project.");
            $("#head").addClass('border-theme');
            return;
        }
        if ($scope.addressDetails.Contacts[0].Phone == undefined || $scope.addressDetails.Contacts[0].Phone == "") {
            swal("Address Details", "Please Enter Phone.");
            $("#phone").addClass('border-theme');
            return;
        }
        if ($scope.addressDetails.Contacts[0].Department == undefined || $scope.addressDetails.Contacts[0].Department == "") {
            swal("Address Details", "Please Enter Department.");
            $("#dept").addClass('border-theme');
            return;
        }

        if ($scope.addressDetails.BillingStreet == undefined || $scope.addressDetails.BillingStreet == "") {
            swal("Address Details", "Please Enter Street.");
            $("#IStreet").addClass('border-theme');
            return;
        }
        if ($scope.addressDetails.BillingCity == undefined || $scope.addressDetails.BillingCity == "") {
            swal("Address Details", "Please Enter City.");
            $("#ICity").addClass('border-theme');
            return;
        }
        if ($scope.addressDetails.BillingCountry == undefined || $scope.addressDetails.BillingCountry == "") {
            swal("Address Details", "Please Enter Country.");
            $("#ICountry").addClass('border-theme');
            return;
        }
        if ($scope.addressDetails.BillingState == undefined || $scope.addressDetails.BillingState == "") {
            swal("Address Details", "Please Enter State.");
            $("#IState").addClass('border-theme');
            return;
        }
        if ($scope.addressDetails.BillingPostalCode == undefined || $scope.addressDetails.BillingPostalCode == "") {
            swal("Address Details", "Please Enter Post Code.");
            $("#IPcode").addClass('border-theme');
            return;
        }

        // ------------- POSTAL CODE VALIDATION ------------------ //
        debugger;
        var country = $scope.addressDetails.BillingCountry;
        var postalCode = $scope.addressDetails.BillingPostalCode;

        // Allow digits only for validation
        postalCode = postalCode.replace(/[^0-9]/g, '');

        if (country === 'India' && postalCode.length !== 6) {
            swal(
                "Info!",
                "Postal Code for India must be exactly 6 digits."
            );
            return;
        }

        if (country === 'Germany' && postalCode.length !== 5) {
            swal(
                "Info!",
                "Postal Code for Germany must be exactly 5 digits."
            );
            return;
        }


        if ($scope.addressDetails.Industry__c == true) {
            if ($scope.addressDetails.Year_Of_Establishment__c == undefined || $scope.addressDetails.Year_Of_Establishment__c == "") {
                swal("Address Details", "Please Enter Year Of Establishment.");
                $("#establish").addClass('border-theme');
                return;
            }
            if ($scope.addressDetails.Main_Business_Area__c == undefined || $scope.addressDetails.Main_Business_Area__c == "") {
                swal("Address Details", "Please Enter Main Business Area.");
                $("#business").addClass('border-theme');
                return;
            }
            if ($scope.addressDetails.NumberOfEmployees == undefined || $scope.addressDetails.NumberOfEmployees == "") {
                swal("Address Details", "Please Enter Number Of Permanent Employees.");
                $("#employees").addClass('border-theme');
                return;
            }
            if ($scope.addressDetails.Infrastructural_Facilities__c == undefined || $scope.addressDetails.Infrastructural_Facilities__c == "") {
                swal("Address Details", "Please Enter Infrastructural Facilities.");
                $("#facility").addClass('border-theme');
                return;
            }
            if ($scope.addressDetails.Domain_Expertise_Available__c == undefined || $scope.addressDetails.Domain_Expertise_Available__c == "") {
                swal("Address Details", "Please Enter Domain Expertise Available/Existing.");
                $("#domain").addClass('border-theme');
                return;
            }
            if ($scope.addressDetails.Ownership_Profile__c == undefined || $scope.addressDetails.Ownership_Profile__c == "") {
                swal("Address Details", "Please Enter Ownership profile.");
                $("#ownership").addClass('border-theme');
                return;
            }
            if ($scope.addressDetails.Ownership_Profile__c.length > 600) {
                swal(
                    "info",
                    "Ownership Profile cannot exceed 600 characters.",
                    "info"
                );
                $("#ownership").addClass('border-theme');
                return;
            }
            if ($scope.addressDetails.Last_Year_s_Balance__c == undefined || $scope.addressDetails.Last_Year_s_Balance__c == "") {
                swal("Address Details", "Please Enter Last year's balance.");
                $("#balance").addClass('border-theme');
                return;
            }
        }

        $scope.contactList = [];
        if ($scope.addressDetails.Contacts != undefined) {
            $scope.contactList.push($scope.addressDetails.Contacts[0]);
        }
        $scope.addressDetails['Shipping_State__c'] = $scope.addressDetails['BillingState'];
        // $scope.addressDetails.NumberOfEmployees = Number($scope.addressDetails.NumberOfEmployees);

        // ---- OLD CODE WHICH IS DELETING DATA FROM LIST TO PASS DATA TO APEX ----- //
        // ---- BECAUSE OF THIS DATA IS GETTING CLEARED FROM UI AS SOON AS WE CLICKED ON CANCEL BUTTON ON SWAL ---- //

        // delete ($scope.addressDetails['Contacts']);
        // delete ($scope.addressDetails['$$hashKey']);
        // delete ($scope.addressDetails['stateList']);

        // ----- PREPARE NEW LIST TO PASS TO APEX WITH REQUIRED DATA, AND REMOVE UNWANTED DATA AND PASS THIS LIST TO APEX INSTEAD OF ORIGINAL LIST ----- //
        // Prepare a clean copy for Apex 
        $scope.cleanedAddressDetails = angular.copy($scope.addressDetails);

        // Remove unwanted properties ONLY from the copied object
        delete $scope.cleanedAddressDetails['Contacts'];
        delete $scope.cleanedAddressDetails['$$hashKey'];
        delete $scope.cleanedAddressDetails['stateList'];
        delete $scope.cleanedAddressDetails._charLimitMap;

        // ---------------- CLEAN CONTACT LIST ----------------
        $scope.cleanedContactList = angular.copy($scope.contactList);

        if ($scope.cleanedContactList && $scope.cleanedContactList.length > 0) {
            for (let i = 0; i < $scope.cleanedContactList.length; i++) {
                delete $scope.cleanedContactList[i]._charLimitMap;
                delete $scope.cleanedContactList[i].$$hashKey;
            }
        }

        $("#btnSubmit").html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Please wait...');
        debugger;

        // ApplicantPortal_Contoller.saveAddressDetails($scope.addressDetails, $scope.contactList, function (result, event) {
        ApplicantPortal_Contoller.saveAddressDetails($scope.cleanedAddressDetails, $scope.cleanedContactList, function (result, event) {
            debugger;
            $("#btnSubmit").html('<i class="fa-solid fa-check me-2"></i>Save and Next');
            if (event.status) {
                debugger;

                // swal({
                //     title: "Success",
                //     text: "Consortium Details have been saved successfully.",
                //     icon: "success",
                //     buttons: true,
                //     dangerMode: false,
                // }).then((willDelete) => {
                //     if (willDelete) {
                //         $scope.disableSubmit = true;
                //         $scope.redirectPageURL('ConsortiaContacts');
                //         $scope.$apply();
                //     } else {
                //         return;
                //     }
                // });

                swal({
                    title: "Success",
                    text:
                        "Consortium Details have been saved successfully.\n\n" +
                        "Next Step:\n" +
                        "On the next page, please complete the following details:\n" +
                        "• Education Details\n" +
                        "• Employment Details\n" +
                        "• Patent / Publication Details",
                    icon: "success",
                    button: "OK",
                    // buttons: true,
                    dangerMode: false
                }).then((willDelete) => {
                    if (willDelete) {
                        $scope.disableSubmit = true;
                        $scope.redirectPageURL('ConsortiaContacts');
                        $scope.$apply();
                    }
                });

                // Swal.fire(
                //     'Success',
                //     'Consortia Details has been saved successfully.',
                //     'success'
                // );
                // $scope.disableSubmit = true; 
                // $scope.redirectPageURL('ConsortiaContacts');
            }
        },
            { escape: true }
        )
    }

    $scope.removeClass2 = function (controlid) {
        $("#" + controlid + "").removeClass('border-theme');
    }


    $scope.checkCharLimit = function (obj, fieldName, limit) {

        // SAFETY: if Contacts[0] not ready, stop
        if (!obj) return;

        // Initialize map once
        if (!obj._charLimitMap) {
            obj._charLimitMap = {};
        }

        var value = obj[fieldName];

        if (!value) {
            obj._charLimitMap[fieldName] = false;
            return;
        }

        if (value.length > limit) {
            obj[fieldName] = value.substring(0, limit);
            obj._charLimitMap[fieldName] = true;
        } else {
            obj._charLimitMap[fieldName] = false;
        }
    };

    $scope.checkCharLimit = function (obj, fieldName, limit) {
        debugger;

        if (!obj) return;

        var targetObj;
        var value;

        // 🔹 Account field
        if (obj.hasOwnProperty(fieldName)) {
            targetObj = obj;
            value = obj[fieldName];

        }
        // 🔹 Contact field
        else if (
            obj.Contacts &&
            obj.Contacts.length > 0 &&
            obj.Contacts[0].hasOwnProperty(fieldName)
        ) {
            targetObj = obj.Contacts[0];
            value = obj.Contacts[0][fieldName];

        } else {
            return;
        }

        // Init error map
        targetObj._charLimitMap = targetObj._charLimitMap || {};

        if (!value) {
            targetObj._charLimitMap[fieldName] = false;
            return;
        }

        /* =====================================================
           SPECIAL CASE: POSTAL / ZIP CODE
           ===================================================== */
        if (fieldName === 'BillingPostalCode') {

            var country = obj.BillingCountry;
            var cleanedValue = value.replace(/[^0-9]/g, '');

            var maxLength;
            var regex;

            if (country === 'India') {
                maxLength = 6;
                regex = /^[0-9]{6}$/;
            }
            else if (country === 'Germany') {
                maxLength = 5;
                regex = /^[0-9]{5}$/;
            }
            else {
                maxLength = limit; // fallback
            }

            // Length check
            if (cleanedValue.length > maxLength) {
                targetObj._charLimitMap[fieldName] = true;
                console.log('❌ Postal code length exceeded for', country);
                return;
            }

            // Pattern check (only when full length entered)
            if (cleanedValue.length === maxLength) {
                if (regex && !regex.test(cleanedValue)) {
                    targetObj._charLimitMap[fieldName] = true;
                    console.log('❌ Invalid Postal Code for', country);
                    return;
                }
            }

            targetObj._charLimitMap[fieldName] = false;
            console.log('✅ Valid Postal Code for', country);
            return;
        }

        /* =====================================================
            DEFAULT CHAR LIMIT LOGIC (Website, Department, etc.)
           ===================================================== */

        if (value.length > limit) {
            targetObj._charLimitMap[fieldName] = true;
        } else {
            targetObj._charLimitMap[fieldName] = false;
        }
    };
});