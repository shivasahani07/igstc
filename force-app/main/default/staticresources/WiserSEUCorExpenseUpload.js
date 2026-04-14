angular.module('cp_app').controller('wiserseuc_ctrl', function ($scope,$sce,$rootScope){

    $scope.siteURL = siteURL;
    $rootScope.projectId;
    $scope.Showyear2=false;
    $scope.Showyear3=false;

    $scope.getAccounts = function(){
        IndustrialFellowshipController.getProposalAccounts($rootScope.projectId,function(result,event){
            console.log('onload :: =>');
            console.log(result);
            if (event.status && result != null) {
                debugger;                
                $scope.accDetails = result;
                $scope.durationMonths=result.Proposals__r.Duration_In_Months_Max_36__c;
                if($scope.durationMonths>12 && $scope.durationMonths<25){
                    $scope.Showyear2=true;
                }else if($scope.durationMonths>24){
                    $scope.Showyear2=true;
                    $scope.Showyear3=true;
                }
                console.log($scope.durationMonths);
                $scope.getExpenseRecords();
                $scope.$apply();
            }
        })
    }
    $scope.getAccounts();

    $scope.getAllExpenseHeadwithTotalELI = function(){
        debugger;
        ApplicantPortal_Contoller.getAllExpenseHeadwithTotalELI($rootScope.projectId,function(result,event){
            debugger;
            if(event.status && result){
                debugger;
                $scope.expenseHeadList = result;
                $scope.$apply();
            }
        })
    }
    $scope.getAllExpenseHeadwithTotalELI();

    $scope.saveAllExpenseHeadExpense = function(){
        debugger;
        for(var i=0;i<$scope.expenseHeadList.length;i++){
            delete($scope.expenseHeadList[i]['$$hashKey']);
        }
        ApplicantPortal_Contoller.saveAllExpenseHeadExpense($scope.expenseHeadList,function(result,event){
            debugger;
            if(event.status && result){
                debugger;
                console.log(result);                    
            swal({
                 title: "SUCCESS",
                 text: 'Expense details have been saved successfully.',
                 icon: "success",
                 button: "ok!",
            })  
          
       } else{
            swal({
                 title: "ERROR",
                 text: "Exception !",
                 icon: "error",
                 button: "ok!",
            });
       }

        })
    }

    $scope.selectedFile;

    $scope.filePreviewHandler = function(fileContent){
        debugger;
        $scope.selectedFile = fileContent;
    
        console.log('selectedFile---', $scope.selectedFile);
        var jhj=$scope.selectedFile.userDocument.Attachments[0].Id;
        console.log(jhj);
        $scope.filesrec = $sce.trustAsResourceUrl(window.location.origin +'/ApplicantDashboard/servlet/servlet.FileDownload?file='+$scope.selectedFile.userDocument.Attachments[0].Id);
        $('#file_frame').attr('src', $scope.filesrec);
    
        var myModal = new bootstrap.Modal(document.getElementById('filePreview'))
        myModal.show('slow');
        $scope.$apply();
    
    }

    $scope.getProjectdetils = function () {
        debugger;
        ApplicantPortal_Contoller.getAllUserDoc($rootScope.projectId, function (result, event) {
            debugger
            console.log('result return onload :: ');
            console.log(result);
            if (event.status) {
                $scope.allDocs = result;
                for(var i=0;i<$scope.allDocs.length;i++){
                    if($scope.allDocs[i].userDocument.Name == 'Meeting Agenda'){
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

    $scope.uploadFile = function (type, userDocId, fileId, fileSizeFun) {
        debugger;
        maxFileSize=fileSizeFun;
        $scope.showSpinnereditProf = true;
        var file;
    
        file = document.getElementById(type).files[0];
        fileName = file.name;
        var typeOfFile = fileName.split(".");
        lengthOfType =  typeOfFile.length;
        if(typeOfFile[lengthOfType-1] == "pdf" || typeOfFile[lengthOfType-1] == "PDF"){
            
        }else{
          swal('info','Please choose pdf file only.','info');
            return;
        }
        console.log(file);
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
                        $scope.uploadAttachment(type , userDocId, null);
                    } else {
                      swal("info", "Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".","info");
                            return;
                    }
    
                }
                fileReader.onerror = function (e) {
                  swal("info", "There was an error reading the file.  Please try again.","info");
                          return;
                }
                fileReader.onabort = function (e) {
                  swal("info", "There was an error reading the file.  Please try again.","info");
                          return;
                }
    
                fileReader.readAsBinaryString(file);  //Read the body of the file
    
            } else {
              swal("info", "File must be under 1 Mb in size.  Your file is too large.  Please try again.","info");
              return;
            }
        } else {
          swal("info", "You must choose a file before trying to upload it","info");
            return;
        }
    }
    
    $scope.uploadAttachment = function (type, userDocId, fileId) {
        debugger;
        var attachmentBody = "";
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

});