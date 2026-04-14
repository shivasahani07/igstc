angular.module('cp_app').controller('WISERDocUpload_Ctrl', function($scope,$rootScope) {
    $scope.objContact={};
    $scope.Descison={};
    $scope.Traveller={};
    $scope.Visa={};
    $scope.AttendanceReport={};
    $scope.SEUCUpload={};
    $scope.Undertaking={};
    $scope.CloserReport={};
    $scope.objProposal={};
    $scope.decision_letter=true;
    $scope.travell_letter=true;
    $scope.decision_letter_disabled=false;
    $scope.travell_form_disabled=false;
    $scope.visa_stage=true;
    $scope.visa_stage_disabled=false;
    $scope.undertaking_stage=true;
    $scope.undertaking_stage_disabled=false;
    $scope.monthly_stage=true;
    $scope.monthly_stage_disabled=true;
    $scope.showDecisionCheck=false;
    $scope.showTravellerCheck=false;
    $scope.showVisaCheck=false;
    $scope.showUndertakingCheck=false;
    $scope.showBankDet=false;
    $scope.showUnderTaking=false;
    $scope.showSecurity=true;
    $scope.objBank={};
    $("#spnBankName,#spnAccNo,#spnIFSC,#spnSWIFTCode").hide();
    $scope.getOnLoad=function(){
        debugger
        IndustrialFellowshipController.getDocUploadDet($rootScope.userHashId, function (result, event) {
            
            console.log(result);
            console.log(event);    
            debugger  
            console.log('return onload proposal data');
            $scope.objContact=result;
            $scope.objProposal=result.Proposals__r;
                  $scope.$apply();
                  if($scope.objProposal.SC_Review_Stages__c != undefined && $scope.objProposal.SC_Review_Stages__c == "Sc Review Approved"){                    
                        $scope.decision_letter_disabled=true;
                        $scope.showTravellerCheck=true;
                        $scope.decision_letter=true;
                    }
                    if($scope.objProposal.Due_Diligence_Stage__c != undefined && $scope.objProposal.Due_Diligence_Stage__c == "Approved"){                    
                        // $scope.decision_letter_disabled=true;
                        // $scope.showTravellerCheck=true;
                        // $scope.decision_letter=true;                        
                        $scope.showSecurity=false;
                    }
                  if($scope.objProposal.Bank_Status__c!=undefined){
                    if($scope.objProposal.Bank_Status__c=="Submitted" || $scope.objProposal.Bank_Status__c=="Sent"){
                        // $scope.visa_stage=false;
                        $scope.showBankDet=true;
                        $scope.showSecurity=false;
                        $scope.showUnderTaking=false;
                    }
                    if($scope.objProposal.Bank_Status__c=="Approved"){
                        // $scope.visa_stage=false;
                        $scope.showBankDet=false;
                        $scope.showSecurity=false;
                        $scope.showUnderTaking=true;
                    }  
                }                      
                    // else{
                    //     $scope.showVisaCheck=true;
                    //     $scope.visa_stage=true;
                    //     $scope.visa_stage_disabled=true;
                    // }                    
                //   }else{
                //     $scope.visa_stage=true;
                //   }
                  if($scope.objProposal.Undertaking_Status__c!=undefined){
                    if($scope.objProposal.Undertaking_Status__c=="Sent"||$scope.objProposal.Undertaking_Status__c=="Submitted")
                        $scope.undertaking_stage=false;
                    else if($scope.objProposal.Undertaking_Status__c=="Approved"){
                        $scope.showUndertakingCheck=true;
                        $scope.undertaking_stage=true;
                        $scope.undertaking_stage_disabled=true;
                        $scope.monthly_stage=true;
                        $scope.monthly_stage_disabled=false;
                    }   
                    else
                    {
                        $scope.undertaking_stage=true;
                        $scope.undertaking_stage_disabled=true;
                    }                 
                  }else{
                    $scope.undertaking_stage=true;
                  }
        });   
    }

    $scope.getBankDetailsOfIFContact = function(){
        debugger;
        ApplicantPortal_Contoller.getBankDetailsOfIFContact($rootScope.contactId,function(result,event){
            debugger;
            if(event.status && result){
                debugger;
                $scope.bankDetails = result
            }else{
                $scope.bankDetails = {"Bank_Name__c":"","Bank_Account_Number__c":"","Bank_IFSC_Code__c":"","Contact__c":$rootScope.contactId};
            }
            $scope.$apply();
        })
    }
    $scope.getBankDetailsOfIFContact();
    $scope.getAccountCountryType = function(){
        debugger;
        ApplicantPortal_Contoller.getAccountCountryType($rootScope.contactId,function(result,event){
            debugger;
            if(event.status && result){
                debugger;
                $scope.statusResult = result;
                $scope.accountCountryType = result.Account_Country_Type__c;
            }
            $scope.$apply();
        })
    }
    $scope.getAccountCountryType();

    $scope.saveBankDetails = function(){
        debugger;
        if($scope.bankDetails.Bank_Name__c == undefined || $scope.bankDetails.Bank_Name__c == ""){
            swal('info','Please Enter Bank name.','info');
            return; 
        }
        if($scope.bankDetails.Bank_Account_Number__c == undefined || $scope.bankDetails.Bank_Account_Number__c == ""){
            swal('info','Please Enter Bank Account Number.','info');
            return; 
        }
        if($scope.accountCountryType == "India"){
            if($scope.bankDetails.Bank_IFSC_Code__c == undefined || $scope.bankDetails.Bank_IFSC_Code__c == ""){
                swal('info','Please Enter Bank IFSC Code.','info');
                return; 
            }
        }
        if($scope.accountCountryType == "Germany"){
            if($scope.bankDetails.Bank_SWIFT_Code__c == undefined || $scope.bankDetails.Bank_SWIFT_Code__c == ""){
                swal('info','Please Enter Bank SWIFT Code.','info');
                return; 
            }
        }

        $scope.bankDetails2 = {"Bank_Name__c":$scope.bankDetails.Bank_Name__c,"Bank_Account_Number__c":$scope.bankDetails.Bank_Account_Number__c,"Bank_IFSC_Code__c":$scope.bankDetails.Bank_IFSC_Code__c,
        "Bank_SWIFT_Code__c":$scope.bankDetails.Bank_SWIFT_Code__c,"Bank_Branch_Name__c":$scope.bankDetails.Bank_Branch_Name__c,"Bank_Address__c":$scope.bankDetails.Bank_Address__c,"Contact__c":$rootScope.contactId}
        ApplicantPortal_Contoller.saveBankDetails($scope.bankDetails2,function(result,event){
            debugger;
            if(event.status && result){
                debugger;
                swal('success','Bank details have been saved successfully.','success');
            }
            $scope.$apply();
        })
    }


    // $scope.removeClass=function(ctrlId){
    //     $("#txt"+ctrlId+"").removeClass('border-theme');
    //         $("#spn"+ctrlId+"").hide();
    // }
    // $scope.saveBankDetails=function(){
    //     if($scope.objBank.Bank_Name__c==undefined || $scope.objBank.Bank_Name__c==''){
    //         $("#txtBankName").addClass('border-theme');
    //         $("#spnBankName").show();
    //         return
    //     }
    //     if($scope.objBank.Bank_Account_Number__c==undefined || $scope.objBank.Bank_Account_Number__c==''){
    //         $("#txtAccNo").addClass('border-theme');
    //         $("#spnAccNo").show();
    //         return
    //     }
    //     if($scope.objBank.Bank_IFSC_Code__c==undefined || $scope.objBank.Bank_IFSC_Code__c==''){
    //         $("#txtIFSC").addClass('border-theme');
    //         $("#spnIFSC").show();
    //         return
    //     }
    //     if($scope.objBank.Bank_SWIFT_Code__c==undefined || $scope.objBank.Bank_SWIFT_Code__c==''){
    //         $("#txtSWIFTCode").addClass('border-theme');
    //         $("#spnspnSWIFTCode").show();
    //         return
    //     }
    //     debugger;
    //     IndustrialFellowshipController.saveBankDet($scope.objBank, function (result, event) {
    //         debugger
    //         console.log(result);
    //         console.log(event);
    //         if(result==null||result=='exception'||result==undefined){
    //             swal('Error','An exception occurred, please try again or contact support.','error');
    //         }else{
    //             $scope.objBank.Id=result;
    //             $scope.$apply();
    //             swal('success','Bank details have been saved successfully.','success');
    //         }
    //     });
    // }
    $scope.getProjectdetils = function () {
        debugger;
        IndustrialFellowshipController.getAllUserDoc($rootScope.contactId, function (result, event) {
            debugger
            console.log('result return onload :: ');
            console.log(result);
            if (event.status) {
                $scope.allDocs = result;
                var uploadCount=0;
                for(var i=0;i<$scope.allDocs.length;i++){
                    
                    if($scope.allDocs[i].userDocument.Name == 'Due Diligence Document'){
                        $scope.diligence=$scope.allDocs[i];
                    }
                    else if($scope.allDocs[i].userDocument.Name == 'Security-Sensitivity Clearance Document'){
                        $scope.sensitivity=$scope.allDocs[i];
                    }
                    else if($scope.allDocs[i].userDocument.Name == 'Undertaking'){
                        $scope.Undertaking=$scope.allDocs[i];
                    }
                    else if($scope.allDocs[i].userDocument.Name == 'Upload Attendance'){
                        $scope.AttendanceReport=$scope.allDocs[i];
                    }
                    else if($scope.allDocs[i].userDocument.Name == 'Upload SC / UC'){
                        $scope.SEUCUpload=$scope.allDocs[i];
                    }
                    else if($scope.allDocs[i].userDocument.Name == 'Upload Bank Details'){
                        $scope.BankDetUpload=$scope.allDocs[i];
                    }
                    else if($scope.allDocs[i].userDocument.Name == 'Endorsement Letter'){
                        $scope.endorsement=$scope.allDocs[i];
                    }
                    else if($scope.allDocs[i].userDocument.Name == 'Euro Remittance Invoice (German applicant only)'){
                        $scope.euroRemittance=$scope.allDocs[i];
                        
                    }
                }
                $scope.$apply();
            }
        }, {
            escape: true
        })
    }
    $scope.uploadFile = function (type, userDocId, fileId,createTask,taskSubject) {
        $scope.showSpinnereditProf = true;
        var file;
    
            file = document.getElementById(type).files[0];
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
                    if (fileSize < maxStringSize) {
                        $scope.uploadAttachment(type , userDocId, fileId,createTask,taskSubject);
                    } else {
                        alert("Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".");
                    }
    
                }
                fileReader.onerror = function (e) {
                    alert("There was an error reading the file.  Please try again.");
                }
                fileReader.onabort = function (e) {
                    alert("There was an error reading the file.  Please try again.");
                }
    
                fileReader.readAsBinaryString(file);  //Read the body of the file
    
            } else {
                alert("File must be under 4.3 MB in size.  Your file is too large.  Please try again.");
                $scope.showSpinnereditProf = false;
            }
        } else {
            alert("You must choose a file before trying to upload it");
            $scope.showSpinnereditProf = false;
        }
    }
    
    $scope.uploadAttachment = function (type, userDocId, fileId,createTask,taskSubject) {
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
        ApplicantPortal_Contoller.doCUploadAttachmentSignature22(
            attachmentBody, attachmentName,fileId, userDocId,$rootScope.projectId,createTask,taskSubject, 
            function (result, event) {
                console.log(result);
                if (event.type === 'exception') {
                    console.log("exception");
                    console.log(event);
                } else if (event.status) {
                    // if (doneUploading == true) {
                        swal(
                            'success',
                            'Uploaded Successfully!',
                            'success'
                        )                        
                        $scope.getProjectdetils();
                        $scope.updateProposal(type);
                        // $scope.disableSubmit = false;
                            
                        // }
                        $scope.showUplaodUserDoc = false;
                       // $scope.getCandidateDetails();
    
                    } else {
                        debugger;
                        positionIndex += chunkSize;
                        $scope.uploadAttachment(type,userDocId,result);
                    }
            },
    
    
            { buffer: true, escape: true, timeout: 120000 }
        );
    }
    $scope.updateProposal=function(type){
        if(type == 'Due Diligence Document'){
            $scope.objProposal.Due_Diligence_Stage__c="Submitted";
        }
        else if(type == 'Security-Sensitivity Clearance Document'){
            $scope.objProposal.Security_Sensitivity_Clearance_Stage__c="Submitted";
        }
        else if(type == 'Undertaking'){
            $scope.objProposal.Undertaking_Status__c="Submitted";
        }
        else if(type == 'Upload Bank Details'){
            $scope.objProposal.Bank_Status__c="Submitted";
        }
        else if(type == 'Endorsement Letter'){
            $scope.objProposal.Endorsement_Letter_Status__c="Submitted";
        }
        /*else if(type == 'Euro Remittance Invoice (German applicant only)'){
            $scope.objProposal. ="Submitted";
        }*/
        IndustrialFellowshipController.updateIFDocStatus($scope.objProposal, function (result, event) {
            console.log('update proposal status');
            console.log(result);
            console.log(event);
        }); 
    }
    $scope.getOnLoad();
    $scope.getProjectdetils();

    $scope.selectedFile;

    $scope.filePreviewHandler = function(fileContent){
        debugger;
        $scope.selectedFile = fileContent;
    
        console.log('selectedFile---', $scope.selectedFile);
    
        $('#file_frame').attr('src', $scope.selectedFile.ContentDistribution.DistributionPublicUrl);
    
        var myModal = new bootstrap.Modal(document.getElementById('filePreview'))        
        myModal.show('slow') ;
        $scope.$apply();
    
    }
    
});