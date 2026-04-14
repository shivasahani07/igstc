angular.module('cp_app').controller('PECFARCloserUpload_Ctrl', function($scope,$rootScope) {
    $scope.objContact={};
    $scope.Descison={};
    $scope.Traveller={};
    $scope.Visa={};
    $scope.AttendanceReport={};
    $scope.SEUCUpload={};
    $scope.Undertaking={};
    $scope.CloserReport={};
    $scope.Reimb={}
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
    $scope.getOnLoad=function(){
        debugger
        IndustrialFellowshipController.getDocUploadDet($rootScope.userHashId, function (result, event) {
            
            console.log(result);
            console.log(event);    
            debugger  
            $scope.objContact=result;
            $scope.objProposal=result.Proposals__r;
                  $scope.$apply();
                //   if($scope.objProposal.Decision_Letter_Sent__c!=undefined){                    
                //     if($scope.objProposal.Decision_Letter_Sent__c==true && $scope.objProposal.Invitation_Letter_Form_Status__c=="Approved"){
                //         $scope.decision_letter_disabled=true;
                //         $scope.decision_letter=true;
                //         $scope.showDecisionCheck=true;
                //     }else if($scope.objProposal.Decision_Letter_Sent__c==true){
                //         $scope.decision_letter=false;
                //     }
                //   }
                //   if($scope.objProposal.Travel_Form_Status__c!=undefined){                    
                //     if($scope.objProposal.Travel_Form_Status__c=="Approved"){
                //         $scope.travell_form_disabled=true;
                //         $scope.showTravellerCheck=true;
                //         $scope.travell_letter=true;
                //     }
                //     else
                //     {
                //         $scope.travell_letter=false;
                //     }
                //   }
                //   if($scope.objProposal.Visa_Stages__c!=undefined){
                //     if($scope.objProposal.Visa_Stages__c=="Sent"||$scope.objProposal.Visa_Stages__c=="Submitted")
                //         $scope.visa_stage=false;
                //     else{
                //         $scope.visa_stage=true;
                //         $scope.showVisaCheck=true;
                //         $scope.visa_stage_disabled=true;
                //     }                    
                //   }else{
                //     $scope.visa_stage=true;
                //   }
                //   if($scope.objProposal.Visa_Stages__c!=undefined){
                //     if($scope.objProposal.Visa_Stages__c=="Sent")
                //         $scope.visa_stage=false;
                //     else{
                //         $scope.visa_stage=true;
                //         $scope.visa_stage_disabled=true;
                //     }                    
                //   }
                // if($scope.objProposal.Undertaking_Status__c!=undefined){
                //     if($scope.objProposal.Undertaking_Status__c=="Sent"||$scope.objProposal.Undertaking_Status__c=="Submitted")
                //         $scope.undertaking_stage=false;
                //     else if($scope.objProposal.Undertaking_Status__c=="Approved"){
                //         $scope.showUndertakingCheck=true;
                //         $scope.undertaking_stage=true;
                //         $scope.undertaking_stage_disabled=true;
                //         $scope.monthly_stage=false;
                //         $scope.monthly_stage_disabled=false;
                //     }   
                //     else
                //     {
                //         $scope.undertaking_stage=true;
                //         $scope.undertaking_stage_disabled=true;
                //     }                 
                //   }else{
                //     $scope.undertaking_stage=true;
                //   }
        });   
    }
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
                    if($scope.allDocs[i].userDocument.Name == 'Upload Closure Report'){
                        $scope.CloserReport=$scope.allDocs[i];
                    }
                    else if($scope.allDocs[i].userDocument.Name == 'Upload Re-Imbersement Document'){
                        $scope.Reimb=$scope.allDocs[i];
                    }
                }
                $scope.$apply();
            }
        }, {
            escape: true
        })
    }
    $scope.uploadFile = function (type, userDocId, fileId,fileCtrlId,createTask,taskSubject) {
        //alert(userDocId);
        debugger
        $scope.showSpinnereditProf = true;
        var file;
    
            file = document.getElementById(fileCtrlId).files[0];
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
        if(userDocId==undefined){
            userDocId=null;
        }
        IndustrialFellowshipController.UploadDocuments(
            attachmentBody, attachmentName,fileId, userDocId,type,$rootScope.contactId,$rootScope.projectId,createTask,taskSubject, 
            function (result, event) {
                debugger
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
                        //$scope.updateProposal(type);
                        // $scope.disableSubmit = false;
                            
                        }
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
        if(type == 'Invitation Letter Form'){
            $scope.objProposal.Invitation_Letter_Form_Status__c="Submitted";
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
        else if(type == 'Upload Attendance'){
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