angular.module('cp_app').controller('singdoc_ctrl', function ($scope,$sce,$rootScope) {

    $scope.allDocs={};
    $scope.doc={};
    $scope.objProposal={};
    $scope.bankDetails = false;
    $scope.undertaking = false;


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
    ApplicantPortal_Contoller.getDocUploadDet2($rootScope.userHashId, function (result, event) {
        if(event.status && result){
            console.log(result);
            console.log(event);    
            debugger  
            $scope.objProposal=result.Proposals__r;
        }
        $scope.$apply();
    });   
}

$scope.getAccountCountryType = function(){
    debugger;
    ApplicantPortal_Contoller.getAccountCountryType($rootScope.contactId,function(result,event){
        debugger;
        if(event.status && result){
            debugger;
            $scope.statusResult = result;
            $scope.accountCountryType = result.Account_Country_Type__c;
            if(result.Proposals__r.Bank_Status__c == "Sent"){
                $scope.bankDetails = true;
                $scope.undertaking = false;
            }else if(result.Proposals__r.Undertaking_Status__c == "Sent"){
                $scope.bankDetails = false;
                $scope.undertaking = true;
            }else if(result.Proposals__r.Bank_Status__c == "Approved"){
                $scope.bankDetails = false;
                $scope.undertaking = true;
            }else if(result.Proposals__r.Undertaking_Status__c == "Approved"){
                $scope.bankDetails = false;
                $scope.undertaking = false;
            }
        }
        $scope.$apply();
    })
}
$scope.getAccountCountryType();

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
    if($scope.bankDetails.Account_Name__c == undefined || $scope.bankDetails.Account_Name__c == ""){
        swal('info','Please Enter Account Name.','info');
        return; 
    }
    if($scope.bankDetails.Bank_Branch_Name__c == undefined || $scope.bankDetails.Bank_Branch_Name__c == ""){
        swal('info','Please Enter Branch.','info');
        return; 
    }
    /*if($scope.accountCountryType == "India"){
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
    }*/
    ApplicantPortal_Contoller.saveBankDetails($scope.bankDetails,function(result,event){
        debugger;
        if(event.status && result){
            debugger;
            swal('success','Bank details have been saved successfully.','success');
        }
        $scope.$apply();
    })
}

$scope.getProjectdetils = function () {
    debugger;
    ApplicantPortal_Contoller.getAllUserDoc($rootScope.projectId, function (result, event) {
        debugger
        console.log('result return onload :: ');
        console.log(result);
        if (event.status) {
            $scope.allDocs = result;
            var uploadCount=0;
            for(var i=0;i<$scope.allDocs.length;i++){
                debugger;
                if($scope.allDocs[i].userDocument.Name == 'Bank Account Details'){
                    $scope.bank=$scope.allDocs[i];
                    if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
                        uploadCount=uploadCount+1;
                    }
                }else if($scope.allDocs[i].userDocument.Name == 'Undertaking'){
                    $scope.undertaking=$scope.allDocs[i];
                    if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
                        uploadCount=uploadCount+1; 
                    }
                }
                    else if($scope.allDocs[i].userDocument.Name == 'Euro Remittance Invoice (German applicant only)'){
                        $scope.euroRemittance=$scope.allDocs[i];
                        if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
                            uploadCount=uploadCount+1;
                        }
                    }
                // else if($scope.allDocs[i].userDocument.Name == 'Note for Sensitivity/ Security Clearance'){
                //     $scope.noteForSensitivity=$scope.allDocs[i];
                //     if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
                //         uploadCount=uploadCount+1;
                //     }
                // }else if($scope.allDocs[i].userDocument.Name == 'Note for Due Diligence'){
                //     $scope.dueDiligence=$scope.allDocs[i];
                //     if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
                //         uploadCount=uploadCount+1;
                //     }
                // }else if($scope.allDocs[i].userDocument.Name == 'Note for Approval to release Award Letter'){
                //     $scope.awardNote=$scope.allDocs[i];
                //     if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
                //         uploadCount=uploadCount+1;
                //     }
                // }else if($scope.allDocs[i].userDocument.Name == 'Undertaking'){
                //     $scope.undertaking=$scope.allDocs[i];
                //     if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
                //         uploadCount=uploadCount+1;
                //     }
                // }else if($scope.allDocs[i].userDocument.Name == 'Euro Remittance Invoice (German applicant only)'){
                //     $scope.euroRemittance=$scope.allDocs[i];
                //     if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
                //         uploadCount=uploadCount+1;
                //     }
                // }
            }
            $scope.$apply();
        }
    }, {
        escape: true
    })
}
$scope.getProjectdetils();


$scope.uploadFile = function (type, userDocId, fileId,createTask,taskSubject) {
    $scope.showSpinnereditProf = true;
    var file;

        file = document.getElementById(type).files[0];
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
                    swal(
                        'success',
                        'Uploaded Successfully!',
                        'success'
                    )                        
                    $scope.getProjectdetils();
                    $scope.updateProposal(type);
                        
                    $scope.showUplaodUserDoc = false;

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
    if(type == 'Bank Account Details'){
        $scope.objProposal.Bank_Status__c="Submitted";
    }
    if(type == 'Undertaking'){
        $scope.objProposal.Undertaking_Status__c="Submitted";
    }
    ApplicantPortal_Contoller.updateIFDocStatus2($scope.objProposal, function (result, event) {
        debugger
        console.log('update proposal status');
        console.log(result);
        console.log(event);
    }); 
}
$scope.getOnLoad();
$scope.getProjectdetils();

$scope.saveandNext = function(){
    debugger;
    for(var i=0;i<$scope.allDocs.length;i++){
        if($scope.allDocs[i].userDocument.Name == 'Bank Account Details.'){
            if($scope.allDocs[i].userDocument.Status__c != 'Uploaded'){
                swal('info','Please upload Bank Account Details.','info');
                return;
            }
        }
    }
    swal({
        title: "Document Upload",
        text: "Documents have been saved successfully.",
        icon: "success",
        button: "ok!",
      }).then((value) => {
        $scope.redirectPageURL('Home');
          });    
}

$scope.redirectPageURL=function(URL){
    var link=document.createElement("a");
    link.id = 'someLink'; //give it an ID!
    link.href='#/'+URL+'';
    link.click();
}
});