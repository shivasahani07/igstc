angular.module('cp_app').controller('BankDetails_Ctrl', function($scope,$rootScope) {
    $scope.objAccount={};
$scope.onLoad=function(){
    debugger
    IndustrialFellowshipController.getAccountBankDetails($rootScope.accountId, function (result, event) {
        console.log(result);
        console.log(event);
        debugger
        $scope.objAccount=result;
        if(result.Bank_Details__r==undefined){
            $scope.objAccount.Bank_Details__r=[];
            $scope.objAccount.Bank_Details__r.push({
                Account__c:$rootScope.accountId,
                Bank_Name__c:"",
                Account_Name__c:"",
                Bank_Account_Number__c:"",
                Bank_IFSC_Code__c:"",
                Bank_Address__c:""
            });            
        }
        $scope.$apply();
        // if(event.status){
        //     $scope.objAccount=result;
        // }
    });    
}
$scope.onLoad();
$scope.saveBankDetails=function(){
    var bankDet=$scope.objAccount.Bank_Details__r[0];   
    debugger
    IndustrialFellowshipController.saveAccountBankDetails(bankDet, function (result, event) {
        console.log(result);
        console.log(event);
        debugger
        if(event.status){
            $scope.objAccount.Bank_Details__r[0].Id=result;
            swal('success','Bank details has been updated successfully','success');
        }
        else
        {
            swal('error','Exception occured','error');
        }
    });  
}
$scope.uploadFile = function (type, fileId) {
    debugger;
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
                    $scope.uploadAttachment(type, fileId);
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

$scope.uploadAttachment = function (type, fileId) {
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
    var bankDet=$scope.objAccount.Bank_Details__r[0];
    ApplicantPortal_Contoller.doCUploadAttachmentB(
        attachmentBody, attachmentName,fileId, bankDet, 
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
                    $scope.uploadAttachment(type,result);
                }
        },


        { buffer: true, escape: true, timeout: 120000 }
    );
}
$scope.redirectPageURL = function(pageName){
    debugger;
    var link=document.createElement("a");
    link.id = 'someLink'; //give it an ID!
    link.href="#/"+pageName;
    link.click();
}
});