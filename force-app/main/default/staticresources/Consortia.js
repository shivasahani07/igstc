angular.module('cp_app').controller('Consortia_Ctrl', function ($scope, $rootScope) {
    debugger;

    // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }

    // Disable the Fields if the User already entered the data.
    /*
    if($rootScope.proposalId){
        $scope.disableProjectPartnerDetailsOnConsortiaPage = true;
    }
    */
    $scope.basicDetails = true;
    $scope.companyDetails = false;
    $scope.countrytype = countrytype;
    $scope.consortiaDetails = [];
    $scope.signleConsortiaDetails = {};
    $scope.disble_button_ins = false;
    $scope.disble_button = false;
    $scope.disableAddButton = false;
    $scope.saveStatus = false;
    $scope.listOfIds = [];
    $scope.divCoordinator = true;
    $scope.divPartner = false;
    $scope.stateList = [];
    $scope.searchEmail = '';
    debugger
    $scope.proposalStage = $scope.proposalStage ? true : ($scope.secondstage ? true : false);
    $scope.isCoordinatorr = $rootScope.isCoordinator
    // if($rootScope.isCoordinatorr=="true"){
    //     $("#divCoordinatorInfo").show();
    //     $("#divProjectPartnerInfo").hide();
    // }else{
    //     $("#divProjectPartnerInfo").show();
    //     $("#divCoordinatorInfo").hide();
    // }
    if ($scope.isCoordinatorr == 'false' || $scope.isCoordinatorr === false) {
        $scope.divCoordinator = true;
        $scope.divPartner = false;
    }
    console.log('is coordinator ::=>' + $scope.isCoordinatorr);
    $scope.arrySaveStatus = [{ status: true }, { status: true }, { status: true }, { status: true }, { status: true }, { status: true }];

    $scope.selectedFile;

    $scope.filePreviewHandler = function (fileContent) {
        $scope.selectedFile = fileContent;

        console.log('selectedFile---', $scope.selectedFile);

        $('#file_frame').attr('src', $scope.selectedFile.ContentDistribution.DistributionPublicUrl);

        var myModal = new bootstrap.Modal(document.getElementById('filePreview'));
        myModal.show('slow');
        $scope.$apply();

        //.ContentDistribution.DistributionPublicUrl
    }
    $scope.setCurrentDiv = function (flag) {
        if (flag == "partner") {
            $scope.divCoordinator = false;
            $scope.divPartner = true;
        } else {
            $scope.divCoordinator = true;
            $scope.divPartner = false;
        }
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
                //$scope.indianStates = result.India;
                $scope.germanStates = result.Germany;
                // $scope.allStates = result.India.concat(result.Germany);
                $scope.$apply();
            }
        }
        )
    }
    $scope.getDependentPicklistValues();
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
                        $scope.uploadAttachment(type, userDocId, fileId);
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
        var attachmentBody = "";
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
    // $scope.checkEmail = function(email,contId){
    //     debugger;
    //     $scope.emailCheck = false;
    //     if(contId == undefined){
    //       contId = "";
    //     }
    //     ApplicantPortal_Contoller.checkEmail(email,contId,function(result,event){
    //       debugger;
    //       if(event.status){
    //         debugger;
    //         if(result.length > 0){
    //           $scope.emailCheck = true;
    //         }else{
    //           $scope.emailCheck = false;
    //         }
    //         $scope.$apply();
    //       }
    //     })

    //   }

    // $scope.NextIns=function(index,divid){  

    //     $scope.signleConsortiaDetails=$scope.consortiaDetails[index];
    //     debugger;
    //     $scope.ConsortiaDetailsList = [];
    //     delete($scope.signleConsortiaDetails['$$hashKey']);
    //     delete($scope.signleConsortiaDetails['RecordTypeId']);
    //     delete($scope.signleConsortiaDetails['Contacts']);
    //     if($scope.signleConsortiaDetails.Id==""){
    //         delete($scope.signleConsortiaDetails['Id']);
    //     }

    //     if($scope.signleConsortiaDetails.Name==undefined || $scope.signleConsortiaDetails.Name==''){
    //         swal("Required", "Please enter Institution/Industry name.")
    //         return
    //     }
    //     if($scope.signleConsortiaDetails.Department__c==undefined || $scope.signleConsortiaDetails.Department__c==''){
    //         swal("Required", "Please enter Department / Division.")
    //         return
    //     }
    //     if($scope.signleConsortiaDetails.ShippingPostalCode==undefined || $scope.signleConsortiaDetails.ShippingPostalCode==''){
    //         swal("Required", "Please Enter Postal Code.")
    //         return
    //     }
    //     if($scope.signleConsortiaDetails.ShippingCountry==undefined || $scope.signleConsortiaDetails.ShippingCountry==''){
    //         swal("Required", "Please Enter Country.")
    //         return
    //     }
    //     if($scope.signleConsortiaDetails.Head_Of_Project__c==undefined || $scope.signleConsortiaDetails.Head_Of_Project__c==''){
    //         swal("Required", "Please Enter Head Of Project.")
    //         return
    //     }
    //     if($scope.signleConsortiaDetails.Email__c==undefined || $scope.signleConsortiaDetails.Email__c==''){
    //         swal("Required", "Please Enter Email.")
    //         return
    //     }
    //     if($scope.signleConsortiaDetails.Phone==undefined || $scope.signleConsortiaDetails.Phone==''){
    //         swal("Required", "Please Enter Phone Number.")
    //         return
    //     }
    //     if($scope.signleConsortiaDetails.Industry__c==true && ($scope.signleConsortiaDetails.Year_Of_Establishment__c==undefined || $scope.signleConsortiaDetails.Year_Of_Establishment__c=='')){
    //         swal("Required", "Please Enter Year Of Establishment.")
    //         return
    //     }
    //     if($scope.signleConsortiaDetails.Industry__c==true && ($scope.signleConsortiaDetails.NumberOfEmployees==undefined || $scope.signleConsortiaDetails.NumberOfEmployees=='')){
    //         swal("Required", "Please Enter Number Of Permant Employees.")
    //         return
    //     }
    //     if($scope.signleConsortiaDetails.Industry__c==true && ($scope.signleConsortiaDetails.Last_Year_s_Balance__c==undefined || $scope.signleConsortiaDetails.Last_Year_s_Balance__c=='')){
    //         swal("Required", "Please Enter Last Year's Balance.")
    //         return
    //     }
    //     if($scope.signleConsortiaDetails.Website==undefined || $scope.signleConsortiaDetails.Website==''){
    //         swal("Required", "Please enter website.")
    //         return
    //     }
    //     $scope.disble_button_ins=true;
    // IndustrialFellowshipController.upsertConsortiaAccountDet($scope.signleConsortiaDetails, $rootScope.projectId, function (result, event) {            
    //     $scope.disble_button_ins=false;    
    //     console.log(result);
    //         console.log(event);
    //         if (event.status) {
    //             debugger;
    //             if($rootScope.proposalStage == false){
    //                 swal(
    //                     'Success',
    //                     'Institution/Industry details has been saved successfully.',
    //                     'success'
    //                 );
    //             }
    //             if(divid=='basic'){
    //             $("#basicDetailsId"+index+"").hide();
    //             if($scope.signleConsortiaDetails.Industry__c==true){
    //                 $("#companyDetailsId"+index+"").show();
    //             }
    //             else
    //             {
    //                 $("#acedmiaDetails"+index+"").show();                        
    //             }
    //         }
    //         else
    //         {
    //             $("#basicDetailsId"+index+"").show();
    //             $("#companyDetailsId"+index+"").hide();
    //             $("#acedmiaDetails"+index+"").hide(); 
    //         }
    //         $scope.$apply();

    //         }
    //     }, {
    //         escape: true
    //     })            
    // }
    // $scope.Next=function(index,divid){  
    //     debugger
    //     if($scope.consortiaDetails.length>6){
    //         swal("Consortia!", "Maximum 6 partners are allowed", "info");
    //         return;
    //     }

    //     $scope.signleConsortiaDetails=$scope.consortiaDetails[index];
    //     debugger;
    //     $scope.ConsortiaDetailsList = [];
    //     delete($scope.signleConsortiaDetails['$$hashKey']);
    //     delete($scope.signleConsortiaDetails['RecordTypeId']);
    //     delete($scope.signleConsortiaDetails['Contacts']);
    //     if($scope.signleConsortiaDetails.Id==""){
    //         delete($scope.signleConsortiaDetails['Id']);
    //     }
    //     if($scope.signleConsortiaDetails.Name==undefined || $scope.signleConsortiaDetails.Name=='' || $scope.signleConsortiaDetails.Name==' '){
    //         swal("Required", "Please enter name.");
    //         return
    //     }
    //     if($scope.signleConsortiaDetails.Website==undefined || $scope.signleConsortiaDetails.Website==''){
    //         swal("Required", "Please enter website.");
    //         return
    //     }
    //     if($scope.signleConsortiaDetails.Industry__c==false && $scope.signleConsortiaDetails.Academia__c==false){
    //         swal("Required", "Please choose industry or academia.");
    //         return
    //     }
    //     if($scope.signleConsortiaDetails.Industry__c==undefined && $scope.signleConsortiaDetails.Academia__c==undefined){
    //         swal("Required", "Please choose industry or academia.");
    //         return
    //     }
    //     if($scope.signleConsortiaDetails.BillingCountry==undefined){
    //         swal("Required", "Please select country");
    //         return
    //     }
    //     if($scope.signleConsortiaDetails.DSIR_Recoginition_Details__c==undefined && $scope.signleConsortiaDetails.Industry__c==true && $scope.signleConsortiaDetails.BillingCountry=='India'){
    //         swal("Required", "Please Enter DSIR Details");
    //         return
    //     }
    //     if($scope.signleConsortiaDetails.Industry__c==true && $scope.signleConsortiaDetails.BillingCountry=='India'){
    //     var file = document.getElementById('attachmentFiles').files[0];
    //                 if (file != undefined) {
    //                     if (file.size <= maxFileSize) {

    //                         attachmentName = file.name;
    //                         const myArr = attachmentName.split(".");
    //                         if (myArr[1] != "pdf") {
    //                             swal("Required", "Please upload in PDF format only")
    //                             return;
    //                         }
    //                     }else
    //                     {
    //                     }
    //                 }
    //             }
    //     $scope.disble_button=true;
    // IndustrialFellowshipController.upsertConsortiaAccountDet($scope.signleConsortiaDetails, $rootScope.projectId, function (result, event) {            
    //     $scope.disble_button=false;    
    //     console.log(result);
    //         console.log(event);
    //         if (event.status) {
    //             debugger;

    //             $scope.arrySaveStatus[index].status=true;
    //             $scope.consortiaDetails[index].Id=result;
    //             $scope.consortiaDetails[index].ShippingCountry=$scope.consortiaDetails[index].BillingCountry;
    //             if($rootScope.proposalStage == false){
    //                 swal(
    //                     'Success',
    //                     'Basic details has been saved successfully.',
    //                     'success'
    //                 );
    //             }
    //             if(divid=='basic'){
    //             $("#basicDetailsId"+index+"").hide();
    //             if($scope.signleConsortiaDetails.Industry__c==true){
    //                 $("#companyDetailsId"+index+"").show();
    //             }
    //             else
    //             {
    //                 $("#acedmiaDetails"+index+"").show();                        
    //             }
    //             if(!$scope.signleConsortiaDetails.Academia__c){                        
    //                 $scope.uploadFile('attachment', result, '');
    //                 }
    //         }
    //         else
    //         {
    //             $("#acedmiaDetails"+index+"").hide();
    //             $("#companyDetailsId"+index+"").hide();
    //             $("#divContact"+index+"").show();
    //         }
    //         $scope.$apply();

    //         }
    //     }, {
    //         escape: true
    //     })            
    // }
    // $scope.backBasic=function(index){
    //     debugger
    //     $("#companyDetailsId"+index+"").hide();
    //     $("#basicDetailsId"+index+"").show();
    // }
    // $scope.NextInstitute=function(){
    //     $scope.companyDetails=false;
    //     $scope.acedmiaDetails=true;
    // }
    // $scope.backComp=function(index){
    //     debugger
    //     $("#acedmiaDetails"+index+"").hide();
    //     $("#basicDetailsId"+index+"").show();
    // }
    $scope.industryAcademiaCoordinator = function (industryType, index) {
        //$scope.arrySaveStatus[index].status=false;
        debugger
        if (industryType == "academia") {
            $scope.CoordinatorDetails[index].Industry__c = false;
            $scope.CoordinatorDetails[index].Academia__c = true;
        } else {
            $scope.CoordinatorDetails[index].Industry__c = true;
            $scope.CoordinatorDetails[index].Academia__c = false;
        }
        $scope.$apply();
    }
    $scope.industryAcademia = function (industryType, index) {
        $scope.arrySaveStatus[index].status = false;
        debugger
        if (industryType == "academia") {
            $scope.allCoordinatorDetails[index].Industry__c = false;
            $scope.allCoordinatorDetails[index].Academia__c = true;
        } else {
            $scope.allCoordinatorDetails[index].Industry__c = true;
            $scope.allCoordinatorDetails[index].Academia__c = false;
        }
        $scope.$apply();
    }

    // $scope.getPatnerDetails = function () {
    //     debugger;
    //     $scope.consortiaDetails = [];
    //     ApplicantPortal_Contoller.getPatnerDetails($rootScope.userId, function (result, event) {
    //         console.log('patner details');
    //         console.log(result);
    //         console.log(event);
    //         if (event.status) {
    //             debugger;

    //             if (result == null || result.length == 0) {
    //                 $scope.consortiaDetails.push({
    //                     "Name": " ",
    //                     "Phone": " ",
    //                     Contacts: [{
    //                         "FirstName": " ",
    //                         "LastName": " "
    //                     }]
    //                 });
    //             } else {
    //                 for(var i=0;i<result.length;i++){
    //                     if(result[i].Contacts == undefined){
    //                         result[i].Contacts =[{"FirstName": " ","LastName": " "}]
    //                     }
    //                 }
    //                 $scope.consortiaDetails = result;                        
    //             }
    //             $scope.$apply();                    
    //             $("#panelsStayOpencollapse1,#panelsStayOpencollapse2,#panelsStayOpencollapse3,#panelsStayOpencollapse4,#panelsStayOpencollapse5").removeClass();
    //             $("#panelsStayOpencollapse1,#panelsStayOpencollapse2,#panelsStayOpencollapse3,#panelsStayOpencollapse4,#panelsStayOpencollapse5").addClass('accordion-collapse collapse');

    //         }
    //     }, {
    //         escape: true
    //     })
    // }
    // $scope.getApplicantDetails = function () {
    //     ApplicantPortal_Contoller.getCompanyApplicantDetails($rootScope.userId, function (result, event) {
    //         console.log('applicant')
    //         console.log(result)
    //         console.log(event)
    //         if (event.status) {
    //             debugger;
    //             $scope.applicantDetails = result;
    //             $scope.$apply();
    //         }
    //     }, {
    //         escape: true
    //     })
    // }
    // $scope.getContactDetails = function () {
    //     ApplicantPortal_Contoller.getContactDetails($rootScope.userId, function (result, event) {
    //         console.log('contact')
    //         console.log(result)
    //         console.log(event)
    //         if (event.status) {
    //             $scope.contactDetails = result;
    //             $scope.contactDetails = {
    //                 'FirstName': result.FirstName,
    //                 'LastName': result.LastName,
    //                 'Actual_Position__c': result.Actual_Position__c,
    //                 'MailingCity': result.MailingCity,
    //                 'MailingState': result.MailingState,
    //                 'MailingCountry': result.MailingCountry,
    //                 'Id': result.Id
    //             };
    //             if (result.Education_Details__r != undefined)
    //                 $scope.educationList = result.Education_Details__r;
    //             if (result.Employment_Details__r != undefined)
    //                 $scope.employmentList = result.Employment_Details__r;
    //             if (result.Publications_Patents__r != undefined)
    //                 $scope.publicationList = result.Publications_Patents__r;
    //             $scope.$apply();
    //         }
    //     }, {
    //         escape: true
    //     })
    // }
    $scope.addAccount = function () {
        debugger;
        if ($scope.allCoordinatorDetails.length > 5) {
            swal("Max Account Limit", "You can add maximum six account.")
            return;
        }

        // Use email from scope instead of prompt
        var email = ($scope.searchEmail || '').trim();

        if (email === '') {
            // No email provided — create an empty entry as before
            $scope.allCoordinatorDetails.push({
                "Name": "",
                "Phone": "",
                "Academia__c": true,
                "Industry__c": false,
                "Is_Coordinator__c": false,
                "Contacts": [{ "FirstName": "", "Campaign__c": $scope.campaigntype }]
            });
            if ($scope.allCoordinatorDetails.length > 5) {
                $scope.disableAddButton = true;
            }
            $scope.searchEmail = ''; // Clear search email
            $scope.$apply();
            return;
        }

        // Call backend to check for contact by email
        var contId = '';
        ApplicantPortal_Contoller.checkEmail(email, contId, function (result, event) {
            try {
                if (event.status) {
                    if (result && result.length > 0) {
                        // Found existing contact — load detailed contact info
                        var existingContactId = result[0].Id;
                        ApplicantPortal_Contoller.getCvDetails(existingContactId, function (res, ev) {
                            if (ev.status && res) {
                                var c = res || {};

                                // Get Account details using Contact's AccountId
                                if (c.AccountId) {
                                    ApplicantPortal_Contoller.getAccountByContactId(c.AccountId, function (accRes, accEv) {
                                        if (accEv.status && accRes) {
                                            var account = accRes;
                                            var contactObj = {
                                                FirstName: c.FirstName || '',
                                                LastName: c.LastName || '',
                                                Email: c.Email || email,
                                                Phone: c.Phone || '',
                                                Id: c.Id || existingContactId,
                                                Designation__c: c.Designation__c || '',
                                                Department: c.Department || '',
                                                Title: c.Title || '',
                                                Campaign__c: $scope.campaigntype
                                            };

                                            $scope.allCoordinatorDetails.push({
                                                "Name": account.Name || '',
                                                "Website": account.Website || account.Homepage_URL__c || '',
                                                "Phone": account.Phone || c.Phone || '',
                                                "BillingCountry": account.BillingCountry || '',
                                                "BillingState": account.BillingState || '',
                                                "BillingCity": account.BillingCity || '',
                                                "BillingStreet": account.BillingStreet || '',
                                                "BillingPostalCode": account.BillingPostalCode || '',
                                                "Academia__c": account.Academia__c != null ? account.Academia__c : true,
                                                "Industry__c": account.Industry__c != null ? account.Industry__c : false,
                                                "Is_Coordinator__c": false,
                                                "Id": account.Id || '',
                                                "Contacts": [contactObj]
                                            });
                                        } else {
                                            // Fallback: use contact data only
                                            $scope.pushContactOnlyEntry(c, email, existingContactId);
                                        }

                                        if ($scope.allCoordinatorDetails.length > 5) {
                                            $scope.disableAddButton = true;
                                        }
                                        $scope.searchEmail = ''; // Clear search email
                                        $scope.$apply();
                                    });
                                } else {
                                    // No AccountId - fallback
                                    $scope.pushContactOnlyEntry(c, email, existingContactId);
                                    $scope.searchEmail = '';
                                    $scope.$apply();
                                }
                            } else {
                                // fallback: push minimal entry using email
                                $scope.pushMinimalEntry(email);
                                $scope.searchEmail = '';
                                $scope.$apply();
                            }
                        });
                    } else {
                        // No existing contact found — create new empty entry but prefill email
                        $scope.pushMinimalEntry(email);
                        $scope.searchEmail = '';
                        $scope.$apply();
                    }
                } else {
                    // In case of error, fallback to empty entry
                    $scope.pushMinimalEntry(email);
                    $scope.searchEmail = '';
                    $scope.$apply();
                }
            } catch (e) {
                console.error('addAccount checkEmail callback error', e);
                $scope.pushMinimalEntry(email);
                $scope.searchEmail = '';
                $scope.$apply();
            }
        });
    }

    // Helper function to push contact-only entry
    $scope.pushContactOnlyEntry = function (c, email, contactId) {
        $scope.allCoordinatorDetails.push({
            "Name": c.Homepage_URL__c || '',
            "Phone": c.Phone || '',
            "Academia__c": true,
            "Industry__c": false,
            "Is_Coordinator__c": false,
            "Contacts": [{
                FirstName: c.FirstName || '',
                LastName: c.LastName || '',
                Email: c.Email || email,
                Phone: c.Phone || '',
                Id: c.Id || contactId,
                Designation__c: c.Actual_Position__c || '',
                Department: c.Department || '',
                Title: c.Salutation || '',
                Campaign__c: $scope.campaigntype
            }]
        });
    }

    // Helper function to push minimal entry
    $scope.pushMinimalEntry = function (email) {
        $scope.allCoordinatorDetails.push({
            "Name": "",
            "Phone": "",
            "Academia__c": true,
            "Industry__c": false,
            "Is_Coordinator__c": false,
            "Contacts": [{ "FirstName": "", "Email": email, "Campaign__c": $scope.campaigntype }]
        });
        if ($scope.allCoordinatorDetails.length > 5) {
            $scope.disableAddButton = true;
        }
    }
    $scope.removeAccount = function (index, accountid) {
        debugger
        if ($scope.allCoordinatorDetails.length == 1) {
            return;
        }
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this account!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    swal("Account has been deleted successfully!", {
                        icon: "success",
                    });
                    // $scope.all

                    //  .splice(index,1);
                    $scope.$apply();
                    if (accountid != '' && accountid != undefined) {
                        $scope.deleteAccount(index, accountid);
                    } else {
                        $scope.allCoordinatorDetails.splice(index, 1);
                    }

                } else {

                    return;
                }
            });
        if ($scope.allCoordinatorDetails.length < 6) {
            $scope.disableAddButton = false;
        }
        $scope.$apply();
    }
    $scope.deleteAccount = function (index, accountid) {
        IndustrialFellowshipController.deleteAccount(accountid, function (result, event) {
            if (event.status) {
                $scope.allCoordinatorDetails.splice(index, 1);
            }
        });
    }
    $scope.redirectPageURL = function (pageName) {
        var link = document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href = "#/" + pageName;
        link.click();
    }
    // $scope.saveAndNext=function(pageName){
    //     debugger;
    //     var IndianCount=0;
    //     var germanCount=0;
    //     var IndianIndustryCount=0;
    //     var indianAcademiaCount=0;
    //     var GermanIndustryCount=0;
    //     var GermanAcademiaCount=0;
    //     debugger
    //     for(var i=0;i<$scope.consortiaDetails.length;i++){
    //         if(!$scope.arrySaveStatus[i].status){
    //             swal("Consortia!", "Please save changes", "info");
    //             return;
    //         }
    //     }
    //     if($scope.consortiaDetails.length<4){
    //         swal("Consortia!", "Please add minimum four partners.", "info");
    //         return;
    //     }
    //     if($scope.consortiaDetails.length>6){
    //         swal("Consortia!", "maximum six partners are allowed.", "info");
    //         return;
    //     }
    //     for(var i=0;i<$scope.consortiaDetails.length;i++){
    //         if($scope.consortiaDetails[i].BillingCountry=="India"){
    //             IndianCount=IndianCount+1;                    
    //         }
    //         else
    //         {
    //             germanCount=germanCount+1;
    //         }
    //     }
    //     if($scope.consortiaDetails.length==4 && (IndianCount<2 || IndianCount>2)){
    //             swal("Consortia!", "Indian partner should be equal german partner", "info");
    //                 return;
    //             }
    //     if($scope.consortiaDetails.length==6 && (IndianCount<3 || IndianCount>3)){
    //             swal("Consortia!", "Indian and german partner must be in 2+2 or 3+3 format", "info");
    //                 return;
    //     }
    //     for(var i=0;i<$scope.consortiaDetails.length;i++){
    //         if($scope.consortiaDetails[i].BillingCountry=="India"){
    //             if($scope.consortiaDetails[i].Industry__c==true){
    //                 IndianIndustryCount=IndianIndustryCount+1;
    //             }  
    //             else
    //             {
    //                 indianAcademiaCount=indianAcademiaCount+1;
    //             }               
    //         }
    //         else
    //         {
    //             if($scope.consortiaDetails[i].Industry__c==true){
    //                 GermanIndustryCount=GermanIndustryCount+1;
    //             }  
    //             else
    //             {
    //                 GermanAcademiaCount=GermanAcademiaCount+1;
    //             } 
    //         }
    //     }
    //     if(IndianIndustryCount==0 || indianAcademiaCount==0){
    //         swal("Consortia!", "One industry and one academia is mandatory", "info");
    //         return;
    //     }
    //     if(GermanIndustryCount==0 || GermanAcademiaCount==0){
    //         swal("Consortia!", "One industry and one academia is mandatory", "info");
    //         return;
    //     }
    //     for(var i=0;i<$scope.consortiaDetails.length;i++){
    //         if($scope.consortiaDetails[i].Industry__c==true){
    //             if($scope.consortiaDetails[i].Name==undefined || $scope.consortiaDetails[i].Name=='' || $scope.consortiaDetails[i].Name==' '){
    //                 swal("Consortia!", "Please save Academia details all partners", "info");
    //                 return;
    //             } 
    //             if($scope.consortiaDetails[i].ShippingPostalCode==undefined || $scope.consortiaDetails[i].ShippingPostalCode=='' || $scope.consortiaDetails[i].ShippingPostalCode==' '){
    //                 swal("Consortia!", "Please enter post code for "+$scope.consortiaDetails[i].Name+"", "info");
    //                 return;
    //             }
    //             if($scope.consortiaDetails[i].Head_Of_Project__c==undefined || $scope.consortiaDetails[i].Head_Of_Project__c=='' || $scope.consortiaDetails[i].Head_Of_Project__c==' '){
    //                 swal("Consortia!", "Please enter name of the project head for "+$scope.consortiaDetails[i].Name+"", "info");
    //                 return;
    //             }
    //             if($scope.consortiaDetails[i].Email__c==undefined || $scope.consortiaDetails[i].Email__c=='' || $scope.consortiaDetails[i].Email__c==' '){
    //                 swal("Consortia!", "Please enter e-mail id for "+$scope.consortiaDetails[i].Name+"", "info");
    //                 return;
    //             }
    //             if($scope.consortiaDetails[i].Phone==undefined || $scope.consortiaDetails[i].Phone=='' || $scope.consortiaDetails[i].Phone==' '){
    //                 swal("Consortia!", "Please enter phone number for "+$scope.consortiaDetails[i].Name+"", "info");
    //                 return;
    //             }
    //             if($scope.consortiaDetails[i].Year_Of_Establishment__c==undefined || $scope.consortiaDetails[i].Year_Of_Establishment__c=='' || $scope.consortiaDetails[i].Year_Of_Establishment__c==' '){
    //                 swal("Consortia!", "Please enter establishment year for "+$scope.consortiaDetails[i].Name+"", "info");
    //                 return;
    //             }
    //             if($scope.consortiaDetails[i].NumberOfEmployees==undefined || $scope.consortiaDetails[i].NumberOfEmployees=='' || $scope.consortiaDetails[i].NumberOfEmployees==' '){
    //                 swal("Consortia!", "Please enter number of permanent employees for "+$scope.consortiaDetails[i].Name+"", "info");
    //                 return;
    //             }
    //             if($scope.consortiaDetails[i].Last_Year_s_Balance__c==undefined || $scope.consortiaDetails[i].Last_Year_s_Balance__c=='' || $scope.consortiaDetails[i].Last_Year_s_Balance__c==' '){
    //                 swal("Consortia!", "Please enter last year's balance for "+$scope.consortiaDetails[i].Name+"", "info");
    //                 return;
    //             }
    //         }  
    //         else
    //         {
    //             if($scope.consortiaDetails[i].Name==undefined || $scope.consortiaDetails[i].Name=='' || $scope.consortiaDetails[i].Name==' '){
    //                 swal("Consortia!", "Please save Academia details all partners", "info");
    //                 return;
    //             }
    //             if($scope.consortiaDetails[i].Department__c==undefined || $scope.consortiaDetails[i].Department__c=='' || $scope.consortiaDetails[i].Department__c==' '){
    //                 swal("Consortia!", "Please enter Department/Division for "+$scope.consortiaDetails[i].Name+"", "info");
    //                 return;
    //             }
    //             if($scope.consortiaDetails[i].ShippingPostalCode==undefined || $scope.consortiaDetails[i].ShippingPostalCode=='' || $scope.consortiaDetails[i].ShippingPostalCode==' '){
    //                 swal("Consortia!", "Please enter post code for "+$scope.consortiaDetails[i].Name+"", "info");
    //                 return;
    //             }
    //             if($scope.consortiaDetails[i].Head_Of_Project__c==undefined || $scope.consortiaDetails[i].Head_Of_Project__c=='' || $scope.consortiaDetails[i].Head_Of_Project__c==' '){
    //                 swal("Consortia!", "Please enter name of the project head for "+$scope.consortiaDetails[i].Name+"", "info");
    //                 return;
    //             }
    //             if($scope.consortiaDetails[i].Email__c==undefined || $scope.consortiaDetails[i].Email__c=='' || $scope.consortiaDetails[i].Email__c==' '){
    //                 swal("Consortia!", "Please enter e-mail id for "+$scope.consortiaDetails[i].Name+"", "info");
    //                 return;
    //             }
    //             if($scope.consortiaDetails[i].Phone==undefined || $scope.consortiaDetails[i].Phone=='' || $scope.consortiaDetails[i].Phone==' '){
    //                 swal("Consortia!", "Please enter phone number for "+$scope.consortiaDetails[i].Name+"", "info");
    //                 return;
    //             }
    //         }  
    //     }
    //     var srrEmail=[];
    //     for (var i = 0; i < $scope.consortiaDetails.length; i++) 
    //     {
    //         if($scope.consortiaDetails[i].Email__c!=undefined && $scope.consortiaDetails[i].Email__c!=''){
    //         srrEmail.push($scope.consortiaDetails[i].Email__c);
    //         }
    //     }
    //       var duplicateEmailStatus=srrEmail.every(num => srrEmail.indexOf(num) === srrEmail.lastIndexOf(num));
    //       if(!duplicateEmailStatus){
    //         swal("Consortia!", "Please enter unique e-mail id for each partner.", "info");
    //         return;
    //       }
    //     $scope.redirectPageURL(pageName);
    // }
    //         $scope.SaveParticipants=function(account,contactId,index,parentIndex){
    //             debugger
    //             $scope.signleConsortiaDetails=account.Contacts[index];
    //             $scope.accountId=account.Id;
    //             debugger;
    //             $scope.ConsortiaDetailsList = [];
    //             delete($scope.signleConsortiaDetails['$$hashKey']);
    //             delete($scope.signleConsortiaDetails['RecordTypeId']);

    //         IndustrialFellowshipController.upsertConsortiaContactsDet($scope.signleConsortiaDetails, $scope.accountId, $rootScope.projectId, function (result, event) {
    //             console.log('save participants');            
    //                 console.log(result);
    //                 console.log(event);
    //                 if (event.status) { 
    //                     $scope.getPatnerDetails();                   
    //                     debugger;
    //                     Swal.fire(
    //                         'Success',
    //                         'Your data has been saved successfully.',
    //                         'success'
    //                     );                    
    //                     $scope.getContactEduOtherDet(contactId,parentIndex);
    //                     $scope.$apply();
    //                 }
    //             }, {
    //                 escape: true
    //             })          
    //         }
    //         $scope.getContactEduOtherDet=function(accountid,parentIndex){
    //             debugger
    //             IndustrialFellowshipController.getContactEduOtherDet(accountid, function (result, event) {
    //                 debugger
    //                 console.log('publication details');
    //                 console.log(result);
    //                 console.log(event);
    //                 $scope.otherDet=[];
    //                 $scope.eduDet=[];
    //                 $scope.employmentDet=[];
    //                 $scope.publicationDet=[];
    //                 $scope.otherDet=result;
    //                 debugger
    //                 if(result.Education_Details__r==undefined){
    //                     $scope.eduDet.push({
    //                         Contact__c:contactid
    //                     });
    //                 }
    //                 else
    //                 {
    //                     $scope.eduDet=result.Education_Details__r;
    //                 }
    //                 if(result.Employment_Details__r==undefined){
    //                     $scope.employmentDet.push({
    //                         Contact__c:contactid
    //                     });
    //                 }else{
    //                     $scope.employmentDet=result.Employment_Details__r;
    //                 }
    //                 if(result.Publications_Patents__r==undefined){
    //                     $scope.publicationDet.push({
    //                         Contact__c:contactid,
    //                         Description__c:""
    //                     });
    //                 }else{
    //                     $scope.publicationDet=result.Publications_Patents__r;
    //                 }
    //                 $("#divEduOther"+parentIndex+"").show();
    //                     $("#contactBasicDet"+index+"").hide();
    //                 $scope.$apply();
    //             });
    //         }
    //         $scope.backToConatctBasic=function(index){
    // $("#divEduOther"+index+"").hide();
    // $("#contactBasicDet"+index+"").show();
    //         }
    //         $scope.saveOtherDet=function(){
    //             debugger
    //             for(var i=0;i<$scope.eduDet.length;i++){
    //                 delete($scope.eduDet[i]['$$hashKey']);
    //             }
    //             for(var i=0;i<$scope.employmentDet.length;i++){
    //                 delete($scope.employmentDet[i]['$$hashKey']);
    //             }
    //             for(var i=0;i<$scope.publicationDet.length;i++){
    //                 delete($scope.publicationDet[i]['$$hashKey']);
    //             }
    //             debugger
    //             IndustrialFellowshipController.saveOtherDet($scope.eduDet,$scope.employmentDet,$scope.publicationDet, function (result, event) {
    //                     console.log('save other det');
    //                     console.log(result);
    //                     console.log(event);
    //                     swal("Contact Details", result);
    //             });
    //         }

    //         $scope.criteriaMatch = function( criteria ) {
    //             return function( item ) {
    //               return item.Contact__c === criteria;
    //             };
    //           };
    //           $scope.setSaveStatus=function(index){
    //             debugger
    //             $scope.arrySaveStatus[index].status=false;
    //           }
    $scope.setSaveStatus = function (country) {
        debugger
        if (country == "India") {
            $scope.stateList = $scope.indianStates;
        } else {
            $scope.stateList = $scope.germanStates;
        }
    }
    var inputQuantity = [];
    $(function () {
        $(".zipcode-number").on("keyup", function (e) {
            var $field = $(this),
                val = this.value,
                $thisIndex = parseInt($field.data("idx"), 10);
            if (this.validity && this.validity.badInput || isNaN(val) || $field.is(":invalid")) {
                this.value = inputQuantity[$thisIndex];
                return;
            }
            if (val.length > Number($field.attr("maxlength"))) {
                val = val.slice(0, 5);
                $field.val(val);
            }
            inputQuantity[$thisIndex] = val;
        });
    });

    /*////////////////////////////////////////// AFETR UI CHANGE //////////////////////////////////////////////*/
    $scope.filterPartner = function (item) {
        return item.Is_Coordinator__c === false;
    }
    $scope.filterCoordinator = function (item) {
        return item.Is_Coordinator__c === true;
    }
    $scope.getPatnerDetails = function () {
        debugger;
        $scope.allCoordinatorDetails = [];
        $scope.CoordinatorDetails = [];
        ApplicantPortal_Contoller.getPatnerDetails($rootScope.proposalId, function (result, event) {
            if (event.status) {
                debugger;
                console.log('data on load');
                console.log(result);
                if (result == null || result.length == 0) {
                    $scope.allCoordinatorDetails.push({
                        "Name": "",
                        "Phone": "",
                        "Academia__c": true,
                        "Industry__c": false,
                        "Is_Coordinator__c": true,
                        "Contacts": [{ "FirstName": "", "Campaign__c": $scope.campaigntype }]
                        // "Proposals__c":$rootScope.projectId,
                    });
                    // $scope.allCoordinatorDetails.push({
                    //     "Name": "",
                    //     "Phone": "",
                    //     "Contacts": [{"FirstName":"","Proposals__c":$rootScope.projectId}],
                    //     "Proposals__c": $rootScope.projectId
                    // });
                } else {
                    // for(var i=0;i<result.length;i++){

                    // }
                    if (isCoordinator == 'false') {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].Contacts[0].Id == $rootScope.contactId) {
                                $scope.allCoordinatorDetails.push(result[i]);
                            }
                        }
                    } else {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].Is_Coordinator__c) {
                                $scope.CoordinatorDetails.push(result[i]);
                            } else {
                                $scope.allCoordinatorDetails.push(result[i]);
                            }
                        }
                        if ($scope.CoordinatorDetails[0].Is_Coordinator__c) {
                            if ($scope.CoordinatorDetails[0].BillingCountry == 'India') {
                                if ($scope.CoordinatorDetails[0].BillingState != undefined && $scope.CoordinatorDetails[0].BillingState != "") {
                                    var obj = $scope.CoordinatorDetails[0].BillingState.replace(/&amp;/g, '&').replace(/&#39;/g, '\'').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'');
                                    $scope.CoordinatorDetails[0].BillingState = obj;
                                    $scope.CoordinatorDetails[0].BillingStreet = $scope.CoordinatorDetails[0].BillingStreet.replace(/&amp;/g, '&').replace(/&#39;/g, '\'').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'');
                                }
                                $scope.stateList = $scope.indianStates;
                            } else {
                                $scope.stateList = $scope.germanStates;
                            }
                        }
                    }
                    for (var i = 0; i < $scope.allCoordinatorDetails.length; i++) {
                        if ($scope.allCoordinatorDetails[i].Contacts[0].Department != undefined) {
                            console.log("before replace=>" + $scope.allCoordinatorDetails[i].Contacts[0].Department);
                            $scope.allCoordinatorDetails[i].Contacts[0].Department = $scope.allCoordinatorDetails[i].Contacts[0].Department.replace(/&amp;/g, '&').replace(/&#39;/g, '\'').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'');
                            console.log("after replace=>" + $scope.allCoordinatorDetails[i].Contacts[0].Department);
                            $scope.allCoordinatorDetails[i].Name = $scope.allCoordinatorDetails[i].Name.replace(/&amp;/g, '&').replace(/&#39;/g, '\'').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'');
                        }
                    }
                }
                // for(var i=0;i<$scope.allCoordinatorDetails.length;i++){
                //     if($scope.allCoordinatorDetails[i].ShippingCountry == 'India'){
                //         //$scope.allCoordinatorDetails[i].stateList = $scope.indianStates;
                //     }else if($scope.allCoordinatorDetails[i].ShippingCountry == 'Germany'){
                //        // $scope.allCoordinatorDetails[i].stateList = $scope.germanStates; 
                //     }
                // }
                $scope.$apply();
                $("#panelsStayOpencollapse1,#panelsStayOpencollapse2,#panelsStayOpencollapse3,#panelsStayOpencollapse4,#panelsStayOpencollapse5").removeClass();
                $("#panelsStayOpencollapse1,#panelsStayOpencollapse2,#panelsStayOpencollapse3,#panelsStayOpencollapse4,#panelsStayOpencollapse5").addClass('accordion-collapse collapse');

            }
        }, {
            escape: true
        })
    }
    $scope.getPatnerDetails();
    $scope.setCoordinator = function (index) {
        debugger
        for (var i = 0; i < $scope.allCoordinatorDetails.length; i++) {
            if (i == index) {
                $scope.allCoordinatorDetails[i].Is_Coordinator__c = true;
                $scope.allCoordinatorDetails[i].Is_Primary__c = true;
            } else {
                $scope.allCoordinatorDetails[i].Is_Coordinator__c = false;
                $scope.allCoordinatorDetails[i].Is_Primary__c = false;
            }
        }
    }
    $scope.submitDetails = function (flag) {
        debugger;
        var IndianCount = 0;
        var GermanyCount = 0;
        var IndianIndustryCount = 0;
        var indianAcademiaCount = 0;
        var GermanIndustryCount = 0;
        var GermanAcademiaCount = 0;
        // if(flag=='p'){

        $scope.allPartners = [];
        for (let i = 0; i < $scope.allCoordinatorDetails.length; i++) {
            delete ($scope.allCoordinatorDetails[i]['$$hashKey']);
            $scope.allPartners.push($scope.allCoordinatorDetails[i]);
        }
        for (let i = 0; i < $scope.CoordinatorDetails.length; i++) {
            delete ($scope.CoordinatorDetails[i]['$$hashKey']);
            $scope.allPartners.push($scope.CoordinatorDetails[i]);
        }


        for (i = 0; i < $scope.allPartners.length; i++) {

            // $scope.allPartners[i].Contacts[0].Proposals__c = $rootScope.projectId;
            if ($scope.allPartners[i].Id == undefined || $scope.allPartners.Id == "") {
                $scope.allPartners[i].Contacts[0].AccountId = $scope.allPartners[i].Name;
            }

            if ($scope.allPartners[i].Name == undefined || $scope.allPartners[i].Name == "") {
                swal("info", "Please Enter Institution/Industry Name.");
                // $("#inst"+i+"").addClass('border-theme');
                return;
            }

            if ($scope.allPartners[i].BillingCountry == undefined || $scope.allPartners[i].BillingCountry == "") {
                swal("info", "Please select Country.");
                // $("#country"+i+"").addClass('border-theme');
                return;
            }
            // if($scope.allPartners[i].BillingCountry == 'India' && $scope.allPartners[i].Industry__c == true && $scope.allPartners[i].DSIR_Recoginition_Details__c == undefined){
            //     swal("info", "Please Enter DSIR Number.");
            //     $("#dsir"+i+"").addClass('border-theme');
            //     return;
            // }
            if ($scope.allPartners[i].Academia__c == false && $scope.allPartners[i].Industry__c == false) {
                swal("info", "Please Select either Academia or Industry.");
                return;
            }

            if ($scope.allPartners[i].Is_Coordinator__c) {
                if ($scope.allPartners[i].BillingStreet == undefined || $scope.allPartners[i].BillingStreet == "") {
                    swal("info", "Please Enter Address for Coordinator.");
                    return;
                }
                if ($scope.allPartners[i].BillingCity == undefined || $scope.allPartners[i].BillingCity == "") {
                    swal("info", "Please Enter City for Coordinator.");
                    return;
                }
                if ($scope.allPartners[i].BillingState == undefined || $scope.allPartners[i].BillingState == "") {
                    swal("info", "Please Select State for Coordinator.");
                    return;
                }
                if ($scope.allPartners[i].BillingPostalCode == undefined || $scope.allPartners[i].BillingPostalCode == "") {
                    swal("info", "Please Enter Postal/Zip Code for Coordinator.");
                    return;
                }
            }

            if ($scope.allPartners[i].Contacts != undefined) {
                for (var j = 0; j < $scope.allPartners[i].Contacts.length; j++) {
                    if ($scope.allPartners[i].Contacts[j].Title == undefined || $scope.allPartners[i].Contacts[j].Title == "" || $scope.allPartners[i].Contacts[j].Title == null) {
                        swal("info", "Please select Salutation.");
                        // $("#head"+j+"").addClass('border-theme');
                        return;
                    }
                    if ($scope.allPartners[i].Contacts[j].FirstName == undefined || $scope.allPartners[i].Contacts[j].FirstName == "") {
                        swal("info", "Please Enter First Name.");
                        // $("#head"+j+"").addClass('border-theme');
                        return;
                    }
                    if ($scope.allPartners[i].Contacts[j].LastName == undefined || $scope.allPartners[i].Contacts[j].LastName == "") {
                        swal("info", "Please Enter Last Name.");
                        // $("#head"+j+"").addClass('border-theme');
                        return;
                    }
                    if ($scope.allPartners[i].Contacts[j].Designation__c == undefined || $scope.allPartners[i].Contacts[j].Designation__c == "") {
                        swal("info", "Please Enter Current Position/Designation.");
                        // $("#head"+j+"").addClass('border-theme');
                        return;
                    }
                    if ($scope.allPartners[i].Contacts[j].Department == undefined || $scope.allPartners[i].Contacts[j].Department == "") {
                        swal("info", "Please Enter Department/Division.");
                        // $("#dept"+j+"").addClass('border-theme');
                        return;
                    }

                    if ($scope.allPartners[i].Contacts[j].Email == undefined || $scope.allPartners[i].Contacts[j].Email == "") {
                        swal("info", "Please Enter Email.");
                        // $("#email"+j+"").addClass('border-theme');
                        return;
                    } else {
                        if ($scope.valid($scope.allPartners[i].Contacts[j].Email)) {
                            swal(
                                'info',
                                'Check Your Registered Email.',
                                'info'
                            );
                            // $("#email"+j+"").addClass('border-theme');
                            return;
                        }
                    }

                    if ($scope.allPartners[i].Contacts[j].Phone == undefined || $scope.allPartners[i].Contacts[j].Phone == "") {
                        swal("info", "Please Check Phone Number.");
                        // $("#phone"+i+"").addClass('border-theme');
                        return;
                    }
                }
            }
        }

        for (i = 0; i < $scope.allPartners.length; i++) {
            if ($scope.allPartners[i].BillingCountry == "India") {
                IndianCount = IndianCount + 1
            }

            if ($scope.allPartners[i].BillingCountry == "Germany") {
                GermanyCount = GermanyCount + 1
            }
        }
        if ($scope.allPartners.length < 4 && isCoordinator == 'true') {
            swal("Info", "Please add minimum four partners.", "info");
            return;
        }
        if ($scope.allPartners.length > 6) {
            swal("Info", "maximum six partners are allowed.", "info");
            return;
        }
        if ($scope.allPartners.length == 4 && (IndianCount < 2 || IndianCount > 2) && isCoordinator == 'true') {
            swal("Info", "Indian partner should be equal german partner", "info");
            return;
        }
        if ($scope.allPartners.length == 6 && (IndianCount < 3 || IndianCount > 3) && isCoordinator == 'true') {
            swal("Info", "Indian and german partner must be in 2+2 or 3+3 format", "info");
            return;
        }

        for (var i = 0; i < $scope.allPartners.length; i++) {
            if ($scope.allPartners[i].BillingCountry == "India") {
                if ($scope.allPartners[i].Industry__c == true) {
                    IndianIndustryCount = IndianIndustryCount + 1;
                }
                else {
                    indianAcademiaCount = indianAcademiaCount + 1;
                }
            }
            else if ($scope.allPartners[i].BillingCountry == "Germany") {
                if ($scope.allPartners[i].Industry__c == true) {
                    GermanIndustryCount = GermanIndustryCount + 1;
                }
                else {
                    GermanAcademiaCount = GermanAcademiaCount + 1;
                }
            }
        }
        if ((IndianIndustryCount == 0 || indianAcademiaCount == 0) && isCoordinator == 'true') {
            swal("Info", "One industry and one academia is mandatory", "info");
            return;
        }
        if ((GermanIndustryCount == 0 || GermanAcademiaCount == 0) && isCoordinator == 'true') {
            swal("Info", "One industry and one academia is mandatory", "info");
            return;
        }
        $scope.contactList = [];
        for (var i = 0; i < $scope.allPartners.length; i++) {
            if ($scope.allPartners[i].Contacts != undefined) {
                if ($scope.allPartners[i].Is_Coordinator__c) {
                    $scope.allPartners[i]['State__c'] = $scope.allPartners[i].BillingState;
                }
                $scope.contactList.push($scope.allPartners[i].Contacts[0]);
            }
            debugger;
        }

        if ($scope.emailCheck == true) {
            swal('info', 'Email already exists.', 'info');
            //$("#email"+ind+"").addClass('border-theme');
            return;
        }
        debugger
        // for (let i = 0; i < $scope.allPartners.length; i++) {
        //     delete ($scope.allPartners[i]['Contacts']);
        //     // delete ($scope.allCoordinatorDetails[i]['stateList']);
        // }
        // }

        // Prepare final partner list for Apex
        $scope.cleanedPartnerList = angular.copy($scope.allPartners);

        for (let i = 0; i < $scope.cleanedPartnerList.length; i++) {

            let acc = $scope.cleanedPartnerList[i];

            // ---------------- REMOVE UI-ONLY PROPS FROM ACCOUNT ----------------
            delete acc._charLimitMap;
            delete acc.$$hashKey;

            // ---------------- REMOVE UI-ONLY PROPS FROM CONTACT ----------------
            if (acc.Contacts && acc.Contacts.length > 0) {
                for (let j = 0; j < acc.Contacts.length; j++) {
                    delete acc.Contacts[j]._charLimitMap;
                    delete acc.Contacts[j].$$hashKey;
                }
            }

            // ---------------- REMOVE NESTED CONTACTS IF NOT REQUIRED ----------------
            delete acc['Contacts'];
        }

        if ($scope.contactList && $scope.contactList.length > 0) {
            for (let i = 0; i < $scope.contactList.length; i++) {
                delete $scope.contactList[i]._charLimitMap;
                delete $scope.contactList[i].$$hashKey;
            }
        }

        $("#btnPreview").html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Please wait...');
        ApplicantPortal_Contoller.insertCoordinatorsInformation($rootScope.proposalId, $scope.cleanedPartnerList, $scope.contactList, function (result, event) {
            $("#btnPreview").html('<i class="fa-solid fa-check me-2"></i>Save and Next');
            $scope.successmessage = "Co-Ordinators and Partner details have been saved successfully.";
            if (isCoordinator == 'false') {
                $scope.successmessage = "Partner details have been saved successfully.";
            }
            if (event.status) {
                debugger;
                if (flag == 'c') {
                    swal('Success', $scope.successmessage, 'success');

                    location.reload();
                    return;
                }
                swal({
                    title: "Success",
                    text: $scope.successmessage,
                    icon: "success",
                    buttons: true,
                    dangerMode: false,
                }).then((willDelete) => {
                    if (willDelete) {
                        $scope.disableSubmit = true;
                        $scope.redirectPageURL('ConsortiaAddress');
                        $scope.accList = result;
                        $scope.$apply();
                    } else {
                        return;
                    }
                });

                //  Swal.fire(
                //      'Success',
                //      'Co-Ordinators detail has been saved successfully.',
                //      'success'
                //  );
                //  $scope.disableSubmit = true; 
                //  $scope.redirectPageURL('ConsortiaAddress');
                //  $scope.accList = result;
                //  $scope.$apply();  
            }
        },
            { escape: true }
        )
    }

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

    $scope.removeClass = function (controlid, index) {
        var controlIdfor = controlid + "" + index;
        $("#" + controlIdfor + "").removeClass('border-theme');
    }


    $scope.checkEmail = function (flag) {
        //         var coordinatiorStatus=false;
        //         for(var i=0;i<$scope.allCoordinatorDetails.length;i++){
        //                 if($scope.allCoordinatorDetails[i].Is_Coordinator__c){
        //                     coordinatiorStatus=true;
        //                 }
        //          }
        // if(!coordinatiorStatus){
        //     swal('info','Please select coordinator.','info');
        //     return;
        // }
        $scope.emailList = [];
        debugger;
        $scope.emailCheck = false;


        for (var i = 0; i < $scope.allCoordinatorDetails.length; i++) {
            if ($scope.allCoordinatorDetails[i].Contacts[0].Email != undefined) {
                if ($scope.emailList.indexOf($scope.allCoordinatorDetails[i].Contacts[0].Email) != -1) {
                    swal("info", "DUPLICATE Email, Please check.", "info");
                    return;
                }
                else {
                    $scope.emailList.push($scope.allCoordinatorDetails[i].Contacts[0].Email);
                }
                if ($scope.allCoordinatorDetails[i].Contacts[0].Id != undefined) {
                    $scope.listOfIds.push($scope.allCoordinatorDetails[i].Contacts[0].Id);
                }
            }
        }
        ApplicantPortal_Contoller.checkBulkEmail($scope.emailList, $scope.listOfIds, function (result, event) {
            debugger;
            debugger;
            if (event.status) {
                debugger;
                if (result.length > 0) {
                    $scope.emailCheck = true;
                } else {
                    $scope.emailCheck = false;
                }
                $scope.submitDetails(flag);
                $scope.$apply();
            }
        })

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



});