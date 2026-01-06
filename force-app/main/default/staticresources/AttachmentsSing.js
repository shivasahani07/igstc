angular.module('cp_app').controller('Attachments_Ctrl', function($scope,$sce,$rootScope) {


    $scope.doc  = { userDocument: { Id: null }, attachmentId: null };
    $scope.doc2 = { userDocument: { Id: null }, attachmentId: null };
    $scope.doc3 = { userDocument: { Id: null }, attachmentId: null };
	    $rootScope.proposalId;
    $scope.disableSubmit = true;
    $scope.previousProjectDetSingh=function(){
        var link=document.createElement("a");
                              link.id = 'someLink'; //give it an ID!
                              link.href="#/ProjectDetailsSing";
                              link.click();
    }

    $scope.getContact = function(){
        debugger;
        
        // Fetching the proposalId from Local Storage
        if (localStorage.getItem('proposalId')) {
            $rootScope.proposalId = localStorage.getItem('proposalId');
            console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
            $rootScope.projectId = $rootScope.proposalId;
        }
        
        
        
        //ApplicantPortal_Contoller.getConSing222($rootScope.candidateId,function(result,event){
            //debugger;
            //if(event.status && result){
            //    $scope.conRecord = result;
            //    $rootScope.projectId = result.Applicant_Proposal_Associations__r[0].Proposals__c;
            //}
            //$scope.$apply();
            // $scope.getExpenseRecords();
        //})
    }
    $scope.getContact();

    $scope.getProjectdetils = function () {
        debugger;
        ApplicantPortal_Contoller.getContactUserDoc($rootScope.contactId, $rootScope.projectId, function (result, event) {
            debugger
            console.log('result return onload :: ');
            console.log(result);
            if (event.status) {
                $scope.allDocs = result;
                var uploadCount=0;
                for(var i=0;i<$scope.allDocs.length;i++){
                    if($scope.allDocs[i].userDocument.Name == 'Consent from the parent organisation (max 500 KB)'){
                        $scope.doc=$scope.allDocs[i];
                        if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
                            uploadCount=uploadCount+1;
                        }
                    }if($scope.allDocs[i].userDocument.Name == 'Supporting documents in favour of your application (max 10 MB)'){
                        $scope.doc2=$scope.allDocs[i];
                        if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
                            uploadCount=uploadCount+1;
                        }
                    }
                    if($scope.allDocs[i].userDocument.Name == 'No Objection Certificate from the Parent Insitution'){
                        $scope.doc3=$scope.allDocs[i];
                        if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
                            uploadCount=uploadCount+1;
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
    $scope.selectedFile;

    $scope.filePreviewHandler = function(fileContent){
        debugger;
        $scope.selectedFile = fileContent;
    
        console.log('selectedFile---', $scope.selectedFile);
        var jhj=$scope.selectedFile.userDocument.Attachments[0].Id;
        console.log(jhj);
        $scope.filesrec = $sce.trustAsResourceUrl(window.location.origin +'/ApplicantDashboard/servlet/servlet.FileDownload?file='+$scope.selectedFile.userDocument.Attachments[0].Id);
        //$scope.filesrec = window.location.origin +'/ApplicantDashboard/servlet/servlet.FileDownload?file='+$scope.selectedFile.userDocument.Attachments[0].Id;
        // $('#file_frame').attr('src', $scope.selectedFile.ContentDistribution.DistributionPublicUrl);
        $('#file_frame').attr('src', $scope.filesrec);
    
        var myModal = new bootstrap.Modal(document.getElementById('filePreview'))        
        myModal.show('slow') ;
        $scope.$apply();
    
        //.ContentDistribution.DistributionPublicUrl
    }
    $scope.redirectPageURL=function(URL){
        var link=document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href='#/'+URL+'';
        link.click();
      }
    $scope.submitSingApp=function(){
        debugger;
        for(var i=0;i<$scope.allDocs.length;i++){
            if($scope.allDocs[i].userDocument.Name == 'Consent from the parent organisation (max 500 KB)'){
                if($scope.allDocs[i].userDocument.Status__c != 'Uploaded'){
                    swal('info','Please upload Consent Letter/No Objection Certificate from the Parent Institution.','info');
                    return;
                }
            }else if($scope.allDocs[i].userDocument.Name == 'Supporting documents in favour of your application (max 10 MB)'){
                if($scope.allDocs[i].userDocument.Status__c != 'Uploaded'){
                    swal('info','Please upload Supporting documents in favour of your application.','info');
                    return;
                }
            }else if($scope.allDocs[i].userDocument.Name == 'No Objection Certificate from the Parent Insitution'){
                if($scope.allDocs[i].userDocument.Status__c != 'Uploaded'){
                    swal('info','Please upload Invitation / Support Letter from the Host Institution.','info');
                    return;
                }  
            }
        }
        swal({
            title: "SUCCESS",
            text: 'Your Attachments have been successfully saved',
            icon: "success",
            button: "ok!",
          }).then((value) => {
            $scope.redirectPageURL('SignatureSealsSing');
              });
    }

// FIXED UPLOAD FUNCTIONS - ONLY CHANGES MADE HERE
$scope.uploadFile = function (inputId, userDocId, fileId, maxSize) {
    debugger;
    console.log('=== uploadFile START ===');
    console.log('inputId:', inputId);
    console.log('userDocId:', userDocId);
    console.log('fileId:', fileId);
    console.log('maxSize:', maxSize);
    
    // FIX 1: Validate userDocId exists
    if (!userDocId || userDocId === null || userDocId === 'null') {
        swal('error', 'Document record not found. Please refresh the page and try again.', 'error');
        return;
    }
    
    maxFileSize = maxSize;
    $scope.showSpinnereditProf = true;
    
    var file = document.getElementById(inputId).files[0];
    
    if (file == undefined) {
        swal('info', 'You must choose a file before trying to upload it', 'info');
        $scope.showSpinnereditProf = false;
        return;
    }
    
    fileName = file.name;
    var typeOfFile = fileName.split(".");
    lengthOfType = typeOfFile.length;
    
    if (typeOfFile[lengthOfType - 1].toLowerCase() != "pdf") {
        swal('info', 'Please choose pdf file only.', 'info');
        $scope.showSpinnereditProf = false;
        document.getElementById(inputId).value = '';
        return;
    }
    
    if (file.size > maxFileSize) {
        swal('info', 'Your file is too large. Please try again.', 'info');
        $scope.showSpinnereditProf = false;
        document.getElementById(inputId).value = '';
        return;
    }
    
    attachmentName = file.name;
    var fileReader = new FileReader();
    var maxStringSize = 6000000;
    
    fileReader.onloadend = function (e) {
        attachment = window.btoa(this.result);
        positionIndex = 0;
        fileSize = attachment.length;
        
        console.log("Total Attachment Length: " + fileSize);
        doneUploading = false;
        
        if (fileSize < maxStringSize) {
            $scope.uploadAttachment(inputId, userDocId, null);
        } else {
            swal('info', 'Base 64 Encoded file is too large.', 'info');
            document.getElementById(inputId).value = '';
            $scope.showSpinnereditProf = false;
        }
    }
    
    fileReader.onerror = function (e) {
        swal('info', 'There was an error reading the file. Please try again.', 'info');
        $scope.showSpinnereditProf = false;
        document.getElementById(inputId).value = '';
    }
    
    fileReader.onabort = function (e) {
        swal('info', 'There was an error reading the file. Please try again.', 'info');
        $scope.showSpinnereditProf = false;
        document.getElementById(inputId).value = '';
    }
    
    fileReader.readAsBinaryString(file);
}

$scope.uploadAttachment = function (inputId, userDocId, fileId) {
    debugger;
    var attachmentBody = "";
    var chunkSize = 750000;
    
    if (!fileId) fileId = null;
    if (!userDocId) userDocId = null;

    if (fileSize <= positionIndex + chunkSize) {
        attachmentBody = attachment.substring(positionIndex);
        doneUploading = true;
    } else {
        attachmentBody = attachment.substring(positionIndex, positionIndex + chunkSize);
    }
    
    console.log("Uploading " + attachmentBody.length + " chars of " + fileSize);
    console.log("Sending userDocId:", userDocId);
    
    ApplicantPortal_Contoller.doCUploadAttachmentAa(
        attachmentBody, 
        attachmentName, 
        fileId, 
        userDocId, 
        function (result, event) {
            debugger;
            console.log('=== CALLBACK ===');
            console.log('Result:', result);
            console.log('Event Status:', event.status);
            console.log('Event Type:', event.type);
            console.log('Event Message:', event.message);
            
            // FIX 2: Changed from event.inputId to event.type
            if (event.type === 'exception') {
                console.log("Exception occurred:", event.message);
                swal('error', 'Upload failed: ' + event.message, 'error');
                $scope.showSpinnereditProf = false;
                
                try {
                    document.getElementById(inputId).value = '';
                } catch(e) {
                    console.log('Error resetting file input:', e);
                }
            } else if (event.status) {
                if (doneUploading == true) {
                    console.log("Upload complete!");
                    $scope.getProjectdetils();
                    
                    swal('success', 'Uploaded Successfully!', 'success');
                    
                    try {
                        document.getElementById(inputId).value = '';
                    } catch(e) {
                        console.log('Error resetting file input:', e);
                    }
                    
                    $scope.showSpinnereditProf = false;
                    $scope.$apply();
                } else {
                    console.log("Uploading next chunk...");
                    positionIndex += chunkSize;
                    $scope.uploadAttachment(inputId, userDocId, result);
                }
            } else {
                console.log("Upload failed - status false");
                console.log("Full event:", event);
                swal('error', 'Upload failed. Please try again.', 'error');
                $scope.showSpinnereditProf = false;
                
                try {
                    document.getElementById(inputId).value = '';
                } catch(e) {
                    console.log('Error resetting file input:', e);
                }
            }
        },
        { buffer: true, escape: true, timeout: 120000 }
    );
}
});




























// angular.module('cp_app').controller('Attachments_Ctrl', function($scope,$sce,$rootScope) {


//     $scope.doc  = { userDocument: { Id: null }, attachmentId: null };
//     $scope.doc2 = { userDocument: { Id: null }, attachmentId: null };
//     $scope.doc3 = { userDocument: { Id: null }, attachmentId: null };

//     $scope.disableSubmit = true;
//     $scope.previousProjectDetSingh=function(){
//         var link=document.createElement("a");
//                               link.id = 'someLink'; //give it an ID!
//                               link.href="#/ProjectDetailsSing";
//                               link.click();
//     }
//     $scope.getProjectdetils = function () {
//         debugger;
//         ApplicantPortal_Contoller.getContactUserDoc($rootScope.contactId, function (result, event) {
//             debugger
//             console.log('result return onload :: ');
//             console.log(result);
//             if (event.status) {
//                 $scope.allDocs = result;
//                 var uploadCount=0;
//                 for(var i=0;i<$scope.allDocs.length;i++){
//                     if($scope.allDocs[i].userDocument.Name == 'Consent from the parent organisation (max 500 KB)'){
//                         $scope.doc=$scope.allDocs[i];
//                         if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
//                             uploadCount=uploadCount+1;
//                         }
//                     }if($scope.allDocs[i].userDocument.Name == 'Supporting documents in favour of your application (max 10 MB)'){
//                         $scope.doc2=$scope.allDocs[i];
//                         if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
//                             uploadCount=uploadCount+1;
//                         }
//                     }
//                     if($scope.allDocs[i].userDocument.Name == 'No Objection Certificate from the Parent Insitution'){
//                         $scope.doc3=$scope.allDocs[i];
//                         if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
//                             uploadCount=uploadCount+1;
//                         }
//                     }
//                 }
//                 $scope.$apply();
//             }
//         }, {
//             escape: true
//         })
//     }
//     $scope.getProjectdetils();
//     $scope.selectedFile;

//     $scope.filePreviewHandler = function(fileContent){
//         debugger;
//         $scope.selectedFile = fileContent;
    
//         console.log('selectedFile---', $scope.selectedFile);
//         var jhj=$scope.selectedFile.userDocument.Attachments[0].Id;
//         console.log(jhj);
//         $scope.filesrec = $sce.trustAsResourceUrl(window.location.origin +'/ApplicantDashboard/servlet/servlet.FileDownload?file='+$scope.selectedFile.userDocument.Attachments[0].Id);
//         //$scope.filesrec = window.location.origin +'/ApplicantDashboard/servlet/servlet.FileDownload?file='+$scope.selectedFile.userDocument.Attachments[0].Id;
//         // $('#file_frame').attr('src', $scope.selectedFile.ContentDistribution.DistributionPublicUrl);
//         $('#file_frame').attr('src', $scope.filesrec);
    
//         var myModal = new bootstrap.Modal(document.getElementById('filePreview'))� � � � 
//         myModal.show('slow')�;
//         $scope.$apply();
    
//         //.ContentDistribution.DistributionPublicUrl
//     }
//     $scope.redirectPageURL=function(URL){
//         var link=document.createElement("a");
//         link.id = 'someLink'; //give it an ID!
//         link.href='#/'+URL+'';
//         link.click();
//       }
//     $scope.submitSingApp=function(){
//         debugger;
//         for(var i=0;i<$scope.allDocs.length;i++){
//             if($scope.allDocs[i].userDocument.Name == 'Consent from the parent organisation (max 500 KB)'){
//                 if($scope.allDocs[i].userDocument.Status__c != 'Uploaded'){
//                     swal('info','Please upload Consent Letter/No Objection Certificate from the Parent Institution.','info');
//                     return;
//                 }
//             }else if($scope.allDocs[i].userDocument.Name == 'Supporting documents in favour of your application (max 10 MB)'){
//                 if($scope.allDocs[i].userDocument.Status__c != 'Uploaded'){
//                     swal('info','Please upload Supporting documents in favour of your application.','info');
//                     return;
//                 }
//             }else if($scope.allDocs[i].userDocument.Name == 'No Objection Certificate from the Parent Insitution'){
//                 if($scope.allDocs[i].userDocument.Status__c != 'Uploaded'){
//                     swal('info','Please upload Invitation / Support Letter from the Host Institution.','info');
//                     return;
//                 }  
//             }
//         }
//         swal({
//             title: "SUCCESS",
//             text: 'Your Attachments have been successfully saved',
//             icon: "success",
//             button: "ok!",
//           }).then((value) => {
//             $scope.redirectPageURL('SignatureSealsSing');
//               });
//         // if($rootScope.proposalStage){
//         //     $scope.redirectPageURL('Home');
//         //     return;
//         //   }
//         // if(saveType=='d'){
//         //     swal('success','Your proposal has been saved as draft.','success');
//         //     $scope.redirectPageURL('Home');
//         //     return;
//         // }
//         // debugger
//         // IndustrialFellowshipController.submitSingApp($rootScope.projectId, function (result, event) {
//         //     debugger
//         //     if(event.status){
//         //         swal('success','Your proposal has been submitted successfully.','success');
//         //         $rootScope.proposalStage = true;
//         //         $scope.redirectPageURL('Home');
//         //     }
//         // });
//     }

//     // *******************************************************************
// //     $scope.uploadFile = function (type, userDocId, fileId,maxSize) {
// // // $scope.uploadFile = function (type, userDocId, fileId,maxSize,minFileSize) {
// //         debugger;
// //         $scope.showSpinnereditProf = true;
// //         var file;
    
// //             file = document.getElementById(type).files[0];
// //             fileName = file.name;
// //             var typeOfFile = fileName.split(".");
// //             lengthOfType =  typeOfFile.length;
// //             if(typeOfFile[lengthOfType-1] != "pdf"){
// //                 swal('info','Please choose pdf file only.','info');
// //                 return;
// //             }
// //         console.log(file);
// //         maxFileSize=maxSize;
// //         if (file != undefined) {
// //             fileSize=file.size;
// //             if (file.size <= maxFileSize) {
// //                 fileSize=file.size;
                
// //                 attachmentName = file.name;
// //                 const myArr = attachmentName.split(".");
// //                 var fileReader = new FileReader();
// //                 var maxSize = 6000000;
                
// //                 fileReader.onloadend = function (e) {
// //                     attachment = window.btoa(this.result);  //Base 64 encode the file before sending it
// //                     positionIndex = 0;
// //                     //fileSize = attachment.length;
// //                     $scope.showSpinnereditProf = false;
// //                     console.log("Total Attachment Length: " + fileSize);
// //                     doneUploading = false;
// //                     debugger;
// //                     if (fileSize < maxSize) {
// //                         $scope.uploadAttachment(type , userDocId, null);
// //                     } else {
// //                         swal('info','Base 64 Encoded file is too large.','info');
// //                         return;
// //                     }
    
// //                 }
// //                 fileReader.onerror = function (e) {
// //                     swal('info','There was an error reading the file.  Please try again.','info');
// //                     return;
// //                 }
// //                 fileReader.onabort = function (e) {
// //                     swal('info','There was an error reading the file.  Please try again.','info');
// //                     return;
// //                 }
    
// //                 fileReader.readAsBinaryString(file);  //Read the body of the file
    
// //             } else {
// //                 swal('info','Your file is too large.  Please try again.','info');
// //                 return;
// //                 $scope.showSpinnereditProf = false;
// //             }
// //         } else {
// //             swal('info','You must choose a file before trying to upload it','info');
// //             return;
// //             $scope.showSpinnereditProf = false;
// //         }
// //     }


// // **********************************************************************************

//             // Replace both uploadFile and uploadAttachment functions in AttachmentsSing
// $scope.uploadFile = function (inputId, userDocId, fileId, maxSize) {
//     debugger;
//     maxFileSize = maxSize;
//     $scope.showSpinnereditProf = true;
    
//     var file = document.getElementById(inputId).files[0];
    
//     if (file == undefined) {
//         swal('info', 'You must choose a file before trying to upload it', 'info');
//         $scope.showSpinnereditProf = false;
//         return;
//     }
    
//     fileName = file.name;
//     var typeOfFile = fileName.split(".");
//     lengthOfType = typeOfFile.length;
    
//     if (typeOfFile[lengthOfType - 1].toLowerCase() != "pdf") {
//         swal('info', 'Please choose pdf file only.', 'info');
//         $scope.showSpinnereditProf = false;
//         document.getElementById(inputId).value = '';
//         return;
//     }
    
//     if (file.size > maxFileSize) {
//         swal('info', 'Your file is too large. Please try again.', 'info');
//         $scope.showSpinnereditProf = false;
//         document.getElementById(inputId).value = '';
//         return;
//     }
    
//     attachmentName = file.name;
//     var fileReader = new FileReader();
//     var maxStringSize = 6000000;
    
//     fileReader.onloadend = function (e) {
//         // FIX: Use readAsBinaryString result for btoa
//         attachment = window.btoa(this.result);
//         positionIndex = 0;
//         fileSize = attachment.length;
        
//         console.log("Total Attachment Length: " + fileSize);
//         doneUploading = false;
        
//         if (fileSize < maxStringSize) {
//             $scope.uploadAttachment(inputId, userDocId, null);
//         } else {
//             swal('info', 'Base 64 Encoded file is too large.', 'info');
//             document.getElementById(inputId).value = '';
//             $scope.showSpinnereditProf = false;
//         }
//     }
    
//     fileReader.onerror = function (e) {
//         swal('info', 'There was an error reading the file. Please try again.', 'info');
//         $scope.showSpinnereditProf = false;
//         document.getElementById(inputId).value = '';
//     }
    
//     fileReader.onabort = function (e) {
//         swal('info', 'There was an error reading the file. Please try again.', 'info');
//         $scope.showSpinnereditProf = false;
//         document.getElementById(inputId).value = '';
//     }
    
//     // FIX: Changed from readAsArrayBuffer to readAsBinaryString
//     fileReader.readAsBinaryString(file);
// }

// $scope.uploadAttachment = function (inputId, userDocId, fileId) {
//     debugger;
//     var attachmentBody = "";
//     var chunkSize = 750000;
    
//     if (!fileId) fileId = null;
//     if (!userDocId) userDocId = null;

//     if (fileSize <= positionIndex + chunkSize) {
//         attachmentBody = attachment.substring(positionIndex);
//         doneUploading = true;
//     } else {
//         attachmentBody = attachment.substring(positionIndex, positionIndex + chunkSize);
//     }
    
//     console.log("Uploading " + attachmentBody.length + " chars of " + fileSize);        
    
//     ApplicantPortal_Contoller.doCUploadAttachmentAa(
//         attachmentBody, 
//         attachmentName, 
//         fileId, 
//         userDocId, 
//         function (result, event) {
//             debugger;
//             console.log('Result:', result);
//             console.log('Event:', event);
            
//             // FIX: Changed from event.inputId to event.type
//             if (event.type === 'exception') {
//                 console.log("Exception occurred:", event);
//                 swal('error', 'Upload failed: ' + event.message, 'error');
//                 $scope.showSpinnereditProf = false;
                
//                 // Reset file input
//                 try {
//                     document.getElementById(inputId).value = '';
//                 } catch(e) {
//                     console.log('Error resetting file input:', e);
//                 }
//             } else if (event.status) {
//                 if (doneUploading == true) {
//                     // Upload complete
//                     $scope.getProjectdetils();
                    
//                     swal('success', 'Uploaded Successfully!', 'success');
                    
//                     // Reset file input field
//                     try {
//                         document.getElementById(inputId).value = '';
//                     } catch(e) {
//                         console.log('Error resetting file input:', e);
//                     }
                    
//                     $scope.showSpinnereditProf = false;
//                     $scope.$apply();
//                 } else {
//                     // Continue uploading next chunk
//                     positionIndex += chunkSize;
//                     $scope.uploadAttachment(inputId, userDocId, result);
//                 }
//             } else {
//                 console.log("Upload failed - status false");
//                 swal('error', 'Upload failed. Please try again.', 'error');
//                 $scope.showSpinnereditProf = false;
                
//                 // Reset file input
//                 try {
//                     document.getElementById(inputId).value = '';
//                 } catch(e) {
//                     console.log('Error resetting file input:', e);
//                 }
//             }
//         },
//         { buffer: true, escape: true, timeout: 120000 }
//     );
// }
//     });