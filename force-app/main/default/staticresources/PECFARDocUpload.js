angular.module('cp_app').controller('PECFARDocUpload_Ctrl', function($scope,$rootScope) {
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
    $scope.objBank={};
    $("#spnBankName,#spnAccNo,#spnIFSC,#spnSWIFTCode").hide();

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
    $scope.getOnLoad=function(){
        debugger
        IndustrialFellowshipController.getDocUploadDetPECFAR($rootScope.userHashId, function (result, event) {
            console.log('Bank Details');
            console.log(result);
            console.log(event);    
            debugger  
            $scope.objContact=result.con;
            if(result.con.Proposals__r!=undefined)
                $scope.objProposal=result.con.Proposals__r;
            if(result.acc.Bank_Details__r==undefined){
                $scope.objBank={Account__c:result.acc.Id};
            }else{
                $scope.objBank=result.acc.Bank_Details__r[0];
            }
                  $scope.$apply();
                  if($scope.objProposal.Invitation_Letter_Form_Status__c!=undefined){
                    if($scope.objProposal.Invitation_Letter_Form_Status__c=="Approved"){
                        $scope.decision_letter_disabled=true;
                        $scope.decision_letter=true;
                        $scope.showDecisionCheck=true;
                    }else{
                        $scope.decision_letter=false;
                    }
                    // if($scope.objProposal.Invitation_Letter_Form_Status__c=="Sent" || $scope.objProposal.Invitation_Letter_Form_Status__c=="Submitted"){
                    //     $scope.decision_letter=true;
                    // }
                  }
                //   if($scope.objProposal.Decision_Letter_Sent__c!=undefined){                    
                //     if($scope.objProposal.Decision_Letter_Sent__c==true && $scope.objProposal.Invitation_Letter_Form_Status__c=="Approved"){
                //         $scope.decision_letter_disabled=true;
                //         $scope.decision_letter=true;
                //         $scope.showDecisionCheck=true;
                //     }else if($scope.objProposal.Decision_Letter_Sent__c==true){
                //         $scope.decision_letter=false;
                //     }
                //   }
                  if($scope.objProposal.Travel_Form_Status__c!=undefined){                    
                    if($scope.objProposal.Travel_Form_Status__c=="Approved"){
                        $scope.travell_form_disabled=true;
                        $scope.showTravellerCheck=true;
                        $scope.travell_letter=true;
                    }
                    else
                    {
                        $scope.travell_letter=false;
                    }
                  }
                  if($scope.objProposal.Visa_Stages__c!=undefined){
                    if($scope.objProposal.Visa_Stages__c=="Sent"||$scope.objProposal.Visa_Stages__c=="Submitted")
                        $scope.visa_stage=false;
                    else{
                        $scope.visa_stage=true;
                        $scope.showVisaCheck=true;
                        $scope.visa_stage_disabled=true;
                    }                    
                  }else{
                    $scope.visa_stage=true;
                  }
                //   if($scope.objProposal.Visa_Stages__c!=undefined){
                //     if($scope.objProposal.Visa_Stages__c=="Sent")
                //         $scope.visa_stage=false;
                //     else{
                //         $scope.visa_stage=true;
                //         $scope.visa_stage_disabled=true;
                //     }                    
                //   }
                if($scope.objProposal.Undertaking_Status__c!=undefined){
                    if($scope.objProposal.Undertaking_Status__c=="Sent"||$scope.objProposal.Undertaking_Status__c=="Submitted")
                        $scope.undertaking_stage=false;
                    else if($scope.objProposal.Undertaking_Status__c=="Approved"){
                        $scope.showUndertakingCheck=true;
                        $scope.undertaking_stage=true;
                        $scope.undertaking_stage_disabled=true;
                        $scope.monthly_stage=false;
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
    $scope.removeClass=function(ctrlId){
        $("#txt"+ctrlId+"").removeClass('border-theme');
            $("#spn"+ctrlId+"").hide();
    }
    $scope.saveBankDetails=function(){
        if($scope.objBank.Bank_Name__c==undefined || $scope.objBank.Bank_Name__c==''){
            $("#txtBankName").addClass('border-theme');
            $("#spnBankName").show();
            return
        }
        if($scope.objBank.Bank_Account_Number__c==undefined || $scope.objBank.Bank_Account_Number__c==''){
            $("#txtAccNo").addClass('border-theme');
            $("#spnAccNo").show();
            return
        }
        if($scope.objBank.Bank_IFSC_Code__c==undefined || $scope.objBank.Bank_IFSC_Code__c==''){
            $("#txtIFSC").addClass('border-theme');
            $("#spnIFSC").show();
            return
        }
        if($scope.objBank.Bank_SWIFT_Code__c==undefined || $scope.objBank.Bank_SWIFT_Code__c==''){
            $("#txtSWIFTCode").addClass('border-theme');
            $("#spnspnSWIFTCode").show();
            return
        }
        IndustrialFellowshipController.saveBankDet($scope.objBank, function (result, event) {
            debugger
            console.log(result);
            console.log(event);
            if(result==null||result=='exception'||result==undefined){
                swal('Error','An exception occurred, please try again or contact support.','error');
            }else{
                $scope.objBank.Id=result;
                $scope.$apply();
                swal('success','Bank details have been saved successfully.','success');
            }
        });
    }
    $scope.getProjectdetils = function () {
        debugger;
        ApplicantPortal_Contoller.getContactUserDoc($rootScope.contactId, function (result, event) {
            debugger
            console.log('result return onload :: ');
            console.log(result);
            if (event.status) {
                $scope.allDocs = result;
                var uploadCount=0;
                for(var i=0;i<$scope.allDocs.length;i++){
                    if($scope.allDocs[i].userDocument.Name == 'Invitation letter from Host Organization'){
                        $scope.Descison=$scope.allDocs[i];
                    }
                    else if($scope.allDocs[i].userDocument.Name == 'Upload Traveller Form'){
                        $scope.Traveller=$scope.allDocs[i];
                    }
                    else if($scope.allDocs[i].userDocument.Name == 'Upload Visa'){
                        $scope.Visa=$scope.allDocs[i];
                    }
                    else if($scope.allDocs[i].userDocument.Name == 'Upload Undertaking'){
                        $scope.Undertaking=$scope.allDocs[i];
                    }
                    else if($scope.allDocs[i].userDocument.Name == 'Upload Attendance'){
                        $scope.AttendanceReport=$scope.allDocs[i];
                    }
                    else if($scope.allDocs[i].userDocument.Name == 'Upload SC / UC'){
                        $scope.SEUCUpload=$scope.allDocs[i];
                    }
                    else if($scope.allDocs[i].userDocument.Name == 'Upload Bank Details of Parent Organization'){
                        $scope.BankDetUpload=$scope.allDocs[i];
                    }
                    else if($scope.allDocs[i].userDocument.Name == 'NOC letter from Parent Organization'){
                        $scope.VisitLetterUpload=$scope.allDocs[i];
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
        if(type == 'Invitation letter from Host Organization'){
            $scope.objProposal.Invitation_Letter_Form_Status__c="Submitted";
        }
        else if(type == 'Upload Bank Details of Parent Organization'){
            $scope.objProposal.Bank_Status__c="Submitted";
        }
        else if(type == 'Upload Traveller Form'){
            $scope.objProposal.Travel_Form_Status__c="Submitted";
        }
        else if(type == 'Upload Visa'){
            $scope.objProposal.Visa_Stages__c="Submitted";
        }
        else if(type == 'Upload Undertaking'){
            $scope.objProposal.Undertaking_Status__c="Submitted";
        }
        else if(type == 'NOC letter from Parent Organization'){
            return
        }
        else if(type == 'Upload Attendance'){
            return
        }
        else if(type == 'Upload Bank Details of Parent Organization'){
            return
        }
        else if(type == 'SC / UC Upload'){
            return
        }
        IndustrialFellowshipController.updateIFDocStatus($scope.objProposal, function (result, event) {
            console.log('update proposal status');
            console.log(result);
            console.log(event);
        }); 
    }
    $scope.getOnLoad();
    $scope.getProjectdetils();
    
});