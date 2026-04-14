angular.module('cp_app').controller('Attachments_Ctrl', function($scope,$sce,$rootScope) {
    $scope.disableSubmit = true;
    $scope.previousProjectDetSingh=function(){
        var link=document.createElement("a");
                              link.id = 'someLink'; //give it an ID!
                              link.href="#/ProjectDetailsSing";
                              link.click();
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
        myModal.show('slow') ;
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
        // if($rootScope.proposalStage){
        //     $scope.redirectPageURL('Home');
        //     return;
        //   }
        // if(saveType=='d'){
        //     swal('success','Your proposal has been saved as draft.','success');
        //     $scope.redirectPageURL('Home');
        //     return;
        // }
        // debugger
        // IndustrialFellowshipController.submitSingApp($rootScope.projectId, function (result, event) {
        //     debugger
        //     if(event.status){
        //         swal('success','Your proposal has been submitted successfully.','success');
        //         $rootScope.proposalStage = true;
        //         $scope.redirectPageURL('Home');
        //     }
        // });
    }
    $scope.uploadFile = function (type, userDocId, fileId,maxSize,minFileSize) {
        debugger;
        $scope.showSpinnereditProf = true;
        var file;
    
            file = document.getElementById(type).files[0];
            fileName = file.name;
            var typeOfFile = fileName.split(".");
            lengthOfType =  typeOfFile.length;
            if(typeOfFile[lengthOfType-1] != "pdf"){
                swal('info','Please choose pdf file only.','info');
                return;
            }
        console.log(file);
        maxFileSize=maxSize;
        if (file != undefined) {
            fileSize=file.size;
            if (file.size <= maxFileSize) {
                fileSize=file.size;
                attachmentName = file.name;
                const myArr = attachmentName.split(".");
                var fileReader = new FileReader();
                fileReader.onloadend = function (e) {
                    attachment = window.btoa(this.result);  //Base 64 encode the file before sending it
                    positionIndex = 0;
                    //fileSize = attachment.length;
                    $scope.showSpinnereditProf = false;
                    console.log("Total Attachment Length: " + fileSize);
                    doneUploading = false;
                    debugger;
                    if (fileSize < maxSize) {
                        $scope.uploadAttachment(type , userDocId, null);
                    } else {
                        swal('info','Base 64 Encoded file is too large.','info');
                        return;
                    }
    
                }
                fileReader.onerror = function (e) {
                    swal('info','There was an error reading the file.  Please try again.','info');
                    return;
                }
                fileReader.onabort = function (e) {
                    swal('info','There was an error reading the file.  Please try again.','info');
                    return;
                }
    
                fileReader.readAsBinaryString(file);  //Read the body of the file
    
            } else {
                swal('info','Your file is too large.  Please try again.','info');
                return;
                $scope.showSpinnereditProf = false;
            }
        } else {
            swal('info','You must choose a file before trying to upload it','info');
            return;
            $scope.showSpinnereditProf = false;
        }
    }
    
    $scope.uploadAttachment = function (type, userDocId, fileId) {
        debugger;
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
            attachmentBody, attachmentName,fileId, userDocId, 
            function (result, event) {
                debugger;
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
                            
                        }
                       else {
                        debugger;
                        positionIndex += chunkSize;
                        $scope.uploadAttachment(type,userDocId,result);
                    }
                    $scope.showUplaodUserDoc = false;
                    } 
            },
    
    
            { buffer: true, escape: true, timeout: 120000 }
        );
    }
    });