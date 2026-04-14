angular.module('cp_app').controller('WORKSHOPDocUpload2_Ctrl', function($scope,$rootScope) {
    $scope.objContact={};
    $scope.Traveller={};
    $scope.Visa={};
    $scope.AttendanceReport={};
    $scope.SEUCUpload={};
    $scope.Undertaking={};
    $scope.CloserReport={};
    $scope.objProposal={};
    $scope.invoice_form=false;
    $scope.invoice_form_disabled=false;
    $scope.monthly_stage=true;
    $scope.monthly_stage_disabled=true;
    $scope.showUndertakingCheck=false;
    $scope.contactCountry="India";
    $scope.getOnLoad=function(){
        debugger
        IndustrialFellowshipController.getWorkshopDocUpload($rootScope.userHashId, function (result, event) {
            
            console.log(result);
            console.log(event);    
            debugger  
            $scope.objContact=result;
            // if(result[0].Name!=undefined){
            //     $scope.getOnLoad();
            // }else{
            $scope.contactCountry=$scope.objContact.Account_Country_Type__c;
            console.log('print contact object::=>');
            console.log($scope.objContact);
            $scope.objProposal=result.Proposals__r;
                  $scope.$apply();
                //   if($scope.contactCountry=="India"){
                //     if($scope.objProposal.Indian_Invoice_Status__c!=undefined){
                //         if($scope.objProposal.Indian_Invoice_Status__c=="Approved"){
                //             $scope.invoice_form_disabled=true;
                //             $scope.monthly_stage=false;
                //             $scope.showDecisionCheck=true;
                //             $scope.monthly_stage_disabled=false;
                //             $scope.invoice_form_disabled=true;
                //             $scope.invoice_form=true;
                //         }
                //       }
                //   }else{
                //     if($scope.objProposal.German_Invoice_Status__c!=undefined){
                //         if($scope.objProposal.German_Invoice_Status__c=="Approved"){
                //             $scope.invoice_form_disabled=true;
                //             $scope.showDecisionCheck=true;
                //             $scope.monthly_stage=false;
                //             $scope.monthly_stage_disabled=false;
                //             $scope.invoice_form_disabled=true;
                //             $scope.invoice_form=true;
                //         }
                //       }
                //   }
                //   if($scope.objProposal.Undertaking_Status__c!=undefined){
                //     if($scope.objProposal.Undertaking_Status__c=="Sent"||$scope.objProposal.Undertaking_Status__c=="Submitted")
                //         $scope.undertaking_stage=false;
                //     else if($scope.objProposal.Undertaking_Status__c=="Approved"){
                //         $scope.showUndertakingCheck=true;
                //         $scope.undertaking_stage=true;
                //         $scope.undertaking_stage_disabled=false;
                //         $scope.monthly_stage=true;
                //         $scope.monthly_stage_disabled=true;
                //     }   
                //     else
                //     {
                //         $scope.undertaking_stage=true;
                //         $scope.undertaking_stage_disabled=true;
                //     }                 
                //   }else{
                //     $scope.undertaking_stage=true;
                //   }
                // }
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
                    if($scope.allDocs[i].userDocument.Name == 'Re-Imbersement Document'){
                        $scope.Descison=$scope.allDocs[i];
                        if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
                            uploadCount=uploadCount+1;
                        }
                    }
                    else if($scope.allDocs[i].userDocument.Name == 'Closure Report'){
                        $scope.AttendanceReport=$scope.allDocs[i];
                        if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
                            uploadCount=uploadCount+1;                        
                        }
                    }
                    // else if($scope.allDocs[i].userDocument.Name == 'SC / UC Upload'){
                    //     $scope.SEUCUpload=$scope.allDocs[i];
                    //     if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
                    //         uploadCount=uploadCount+1;                        
                    //     }
                    // }
                    // else if($scope.allDocs[i].userDocument.Name == 'Undertaking'){
                    //     $scope.Undertaking=$scope.allDocs[i];
                    //     if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
                    //         uploadCount=uploadCount+1;                        
                    //     }
                    // }
                    // else if($scope.allDocs[i].userDocument.Name == 'Closure Report and Re-Imbersement'){
                    //     $scope.CloserReport=$scope.allDocs[i];
                    //     if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
                    //         uploadCount=uploadCount+1;                        
                    //     }
                    // }
                    if(uploadCount==2)
                            $scope.disableSubmit = false;
                }
                $scope.$apply();
            }
        }, {
            escape: true
        })
    }
    $scope.uploadFile = function (type, userDocId, fileId,createTask,taskSubject) {
        debugger
        $scope.showSpinnereditProf = true;
        var file;
    
            file = document.getElementById(fileId).files[0];
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
                        $scope.uploadAttachment(type , userDocId, type,createTask,taskSubject);
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
        IndustrialFellowshipController.doCUploadAttachmentA(
            attachmentBody, attachmentName,'', userDocId, $rootScope.projectId,createTask,taskSubject,
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
                        $scope.updateProposal(type);
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
        if(type == 'Invoice Form'){
            if($scope.contactCountry=="India"){
                $scope.objProposal.Indian_Invoice_Status__c="Submitted";
            }
            else{
                $scope.objProposal.German_Invoice_Status__c="Submitted";
            }
        }
        else if(type == 'Undertaking'){
            $scope.objProposal.Undertaking_Status__c="Submitted";
        }
        else if(type == 'Attendance Report'){
            return
        }
        else if(type == 'SC / UC Upload'){
            return
        }
        IndustrialFellowshipController.updateIFDocStatus($scope.objProposal, function (result, event) {
            debugger
            console.log('update proposal status');
            console.log(result);
            console.log(event);
        }); 
    }
    $scope.getOnLoad();
    $scope.getProjectdetils();

    $scope.gettentativeDate = function(){
        debugger;
        ApplicantPortal_Contoller.getTentativeDate($rootScope.contactId, function(result,event){
            debugger;
            if(event.status){
                if(result.Tentative_Start_Date__c != null || result.Tentative_Start_Date__c != undefined){
                    $scope.tentitiveStartDate = new Date(result.Tentative_Start_Date__c); 
                }
                $scope.applicantDetails = result;
                $scope.$apply();
            }
        })
    }
    $scope.gettentativeDate();

    $scope.saveDate = function(){
        debugger;
        var day = 0;
        var month = 0;
        var year = 0;

        if($scope.tentitiveStartDate != undefined || $scope.tentitiveStartDate != ""){
            year = $scope.tentitiveStartDate.getUTCFullYear();
            month = $scope.tentitiveStartDate.getUTCMonth()+1;
            day = $scope.tentitiveStartDate.getDate();
        }

        ApplicantPortal_Contoller.saveTentativeDate($scope.applicantDetails,day,month,year, function(result,event){
            debugger;
            if(event.status && result != null){
                swal({
                    title: "Success",
                    text: 'Details have been saved successfully',
                    icon: "success",
                    button: "ok!",
                  })
                  $scope.$apply();
            }
        })

    }
    
});