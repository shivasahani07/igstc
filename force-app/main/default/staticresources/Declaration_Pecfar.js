angular.module('cp_app').controller('declaration_ctrl', function($scope,$sce,$rootScope) {
    debugger;
    
    $scope.siteURL = siteURL;  
    $scope.decDetails = {};
    $scope.SignDate=new Date($rootScope.signDate);
    $scope.disableUploadButton = true;
    
    
    
     // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }

    $scope.getDeclarationfields = function(){
        debugger;
        ApplicantPortal_Contoller.getDeclarationfields($rootScope.candidateId, function(result,event){
            debugger;
            if(event.status && result){
                if(result != null){
                    if(result.Declaration_Sign_Date__c!=undefined){
                        $scope.SignDate=new Date(result.Declaration_Sign_Date__c);
                    }
                    $scope.decDetails = result;
                }
                debugger;
                $scope.$apply();
            }
        },
                                                  {escape: true}
       )
    }
    $scope.getDeclarationfields();

    $scope.getProjectdetils = function () {
        debugger;
        ApplicantPortal_Contoller.getContactUserDoc($rootScope.contactId,$rootScope.proposalId, function (result, event) {
            debugger
            console.log('result return onload :: ');
            console.log(result);
            if (event.status) {
                $scope.allDocs = result;
                for(var i=0;i<$scope.allDocs.length;i++){
                    if($scope.allDocs[i].userDocument.Name == 'Signature'){
                        $scope.doc=$scope.allDocs[i];
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
    
        $('#file_frame').attr('src', $scope.selectedFile.ContentDistribution.DistributionPublicUrl);
    
        var myModal = new bootstrap.Modal(document.getElementById('filePreview'))        
        myModal.show('slow') ;
        $scope.$apply();
    
        //.ContentDistribution.DistributionPublicUrl
    }
      $scope.uploadFile = function (type, userDocId, fileId) {
        debugger;
        $scope.showSpinnereditProf = true;
        var file;

    file = document.getElementById(type).files[0];
    fileName = file.name;
    var typeOfFile = fileName.split(".");
    lengthOfType =  typeOfFile.length;
    if(typeOfFile[lengthOfType-1] == "jpg" || typeOfFile[lengthOfType-1] == "jpeg"){
        
    }else{
      swal('info','Please choose jpg/jpeg file only.','info');
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
            var maxStringSize = 6000000;    
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
                    $scope.uploadAttachment(type , userDocId, fileId);
                } else {
                  swal("info", "Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".","info");
                        return;
                    // alert("Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".");
                }

            }
            fileReader.onerror = function (e) {
              swal("info", "There was an error reading the file.  Please try again.","info");
                      return;
                // alert("There was an error reading the file.  Please try again.");
            }
            fileReader.onabort = function (e) {
              swal("info", "There was an error reading the file.  Please try again.","info");
                      return;
                // alert("There was an error reading the file.  Please try again.");
            }

            fileReader.readAsBinaryString(file);  //Read the body of the file

        } else {
          swal("info", "File must be under 1 Mb in size.  Your file is too large.  Please try again.","info");
          return;
        }
    } else {
      swal("info", "You must choose a file before trying to upload it","info");
        return;
        // alert("You must choose a file before trying to upload it");
        // $scope.showSpinnereditProf = false;
    }
}

        $scope.uploadAttachment = function (type, userDocId, fileId) {
            debugger;
            var chunkSize = 750000;
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
            ApplicantPortal_Contoller.doCUploadAttachmentSignature(
                attachmentBody, attachmentName,fileId, userDocId, 
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

    $scope.saveDetails = function(){
        debugger;
        var year=0;
        var month=0;
        var day=0;
        for(var i=0;i<$scope.allDocs.length;i++){
            if($scope.allDocs[i].userDocument.Name == 'Signature'){
                if($scope.allDocs[i].userDocument.Status__c != 'Uploaded'){
                    swal('info','Please upload Signature.','info');
                    return;
                }
            }
        }
        if($scope.SignDate!=undefined && $scope.SignDate!=''){
            year = $scope.SignDate.getUTCFullYear();
            month = $scope.SignDate.getUTCMonth()+1;
            day = $scope.SignDate.getDate();
          }

        ApplicantPortal_Contoller.upsertSign($scope.decDetails,year,month,day, function(result,event){
            if(event.status){
                debugger;
                Swal.fire(
                    'Success',
                    'Your data has been saved successfully.',
                    'success'
                );
                $scope.redirectPageURL('ReviewSubmit_Pecfar');
                $scope.decDetails = result;
                $scope.$apply();
            }
        },
       {escape: true}
        )
    }

    $scope.saveandNext = function(){
        debugger;
        for(var i=0;i<$scope.allDocs.length;i++){
            if($scope.allDocs[i].userDocument.Name == 'Signature'){
                if($scope.allDocs[i].userDocument.Status__c != 'Uploaded'){
                    swal('info','Please upload Signature.','info');
                    return;
                }
            }
        }
        swal({
            title: "Declaration",
            text: "Details have been saved successfully.",
            icon: "success",
            button: "ok!",
          }).then((value) => {
            $scope.redirectPageURL('ReviewSubmit_Pecfar');
              }); 
        
    }
                
    $scope.redirectPageURL = function(pageName){
        debugger;
        var link=document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href="#/"+pageName;
        link.click();
    }
                
    });