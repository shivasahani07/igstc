angular.module('cp_app').controller('SignatureSealsSing_Ctrl', function($scope,$sce,$rootScope) {
    
    $scope.SignatureDoc  = { userDocument: { Id: null }, attachmentId: null };
    
    $scope.disableSubmit = true;
    $scope.SignDate=new Date($rootScope.signDate);
    $rootScope.proposalId;
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
            // $rootScope.projectId = $rootScope.proposalId;
        }

        console.log('proposalStage in SignatureSealsSing.js', $rootScope.proposalStage);
        
        
        //ApplicantPortal_Contoller.getConSing222($rootScope.candidateId,function(result,event){
        //debugger;
        //if(event.status && result){
        //   $scope.conRecord = result;
        //    $rootScope.projectId = result.Applicant_Proposal_Associations__r[0].Proposals__c;
        // }
        // $scope.$apply();
        // $scope.getExpenseRecords();
        // })
    }
    $scope.getContact();
    
    
    
    
    $scope.getProjectdetils = function () {
        debugger;
        ApplicantPortal_Contoller.getContactUserDoc($rootScope.contactId, $rootScope.proposalId, function (result, event) {
            debugger
            console.log('result return onload :: ');
            console.log(result);
            if (event.status) {
                $scope.allDocs = result;
                var uploadCount=0;
                for(var i=0;i<$scope.allDocs.length;i++){
                    if($scope.allDocs[i].userDocument.Name == 'Signature of the Head of Organization (signature, date and seal)'){
                        $scope.doc=$scope.allDocs[i];
                        if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
                            uploadCount=uploadCount+1;
                        }
                    }else if($scope.allDocs[i].userDocument.Name == 'Signature (date) of the applicant Upload in jpg/jpeg format with size between 30'){
                        $scope.SignatureDoc=$scope.allDocs[i];
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
    $scope.getOnload=function(){
        IndustrialFellowshipController.getContactSingh($rootScope.candidateId, function (result, event) {
            debugger
            console.log(result);
            console.log(event);
            if(event.status){
                if(result.Declaration_Sign_Date__c!=undefined && $rootScope.proposalStage){
                    $scope.SignDate=new Date(result.Declaration_Sign_Date__c);
                }
                $scope.objContact=result;
                $scope.$apply();
            }
        });    
    }
    $scope.getOnload();
    // $scope.redirectPageURL=function(URL){
    //     var link=document.createElement("a");
    //     link.id = 'someLink'; //give it an ID!
    //     link.href='#/'+URL+'';
    //     link.click();
    // }


    // Redirect to Home page-

$scope.redirectPageURL = function(pageName) {
    debugger;
    var link = document.createElement("a");
 
    let baseUrl = link.baseURI;
    // Remove hash part ( #/something )
    if (baseUrl.includes('#/')) {
        baseUrl = baseUrl.split('#/')[0];
    }
    if (pageName === 'ApplicantPortal') {
        // Get id and campaign from current URL dynamically
        let urlParams = new URLSearchParams(window.location.search);
        let id = urlParams.get("id") || "";
        let campaign ='SING';
        // Build final HOME URL format dynamically
        let finalUrl = baseUrl;
        if (campaign) {
         //   finalUrl += "&campaign=" + campaign;
        }
       // finalUrl += "#/Home";
        finalUrl;
        link.href = finalUrl;
        link.click();
    } else {
        // For other pages → keep same base + hash routing
        link.href = baseUrl + "#/" + pageName;
        link.click();
    }
};







    $scope.submitSingApp=function(saveType){
        if($rootScope.proposalStage){
            $scope.redirectPageURL('ApplicantPortal');
            return;
        }
        // if(saveType=='d'){
        //     swal('success','Your proposal has been saved as draft.','success');
        //     $scope.redirectPageURL('ApplicantPortal');
        //     return;
        // }

        if (saveType == 'd') {

            ApplicantPortal_Contoller.updateProposalStage(
                $rootScope.projectId,   // Proposal Id
                function (result, event) {
                    if (event.status) {
                        swal('success','Your proposal has been saved as draft.','success');
                        $scope.redirectPageURL('ApplicantPortal');
                        $scope.$apply();
                    } else {
                        swal('error','Failed to save as draft','error');
                    }
                }
            );
            return;
        }





        for(var i=0;i<$scope.allDocs.length;i++){
            if($scope.allDocs[i].userDocument.Name == 'Signature (date) of the applicant Upload in jpg/jpeg format with size between 30'){
                if($scope.allDocs[i].userDocument.Status__c != 'Uploaded'){
                    swal('info','Please upload Signature.','info');
                    return;
                }
            }
        }
        debugger;
        var year=0;
        var month=0;
        var day=0;
        
        if($scope.SignDate!=undefined && $scope.SignDate!=''){
            year = $scope.SignDate.getUTCFullYear();
            month = $scope.SignDate.getUTCMonth()+1;
            day = $scope.SignDate.getDate();
            // delete $scope.objContact.Birthdate;
        }
        IndustrialFellowshipController.submitSingApp($rootScope.proposalId,year,month,day, function (result, event) {
            debugger
            if(event.status){
                $rootScope.proposalStage=true;
                CKEDITOR.config.readOnly = true;                
                swal({
                    title: "Success",
                    text: "Your proposal has been submitted successfully..",
                    icon: "success",
                    button: "ok!",
                }).then((value) => {
                    $scope.redirectPageURL('ApplicantPortal');
                });
                }
                });
                }
                    $scope.reviewApp=function(){
                    debugger
                    ApplicantPortal_Contoller.reviewAppDocGen($rootScope.proposalId,$rootScope.campaigntype.toUpperCase(),function(result,event){
                    console.log("now call for doc");
                    console.log(result);
                    setTimeout($scope.getDoc(), 10000);
                });
                }
                    $scope.getDoc=function(){
                    ApplicantPortal_Contoller.getCongaDoc($rootScope.proposalId,function(result,event){
                    debugger
                    console.log("attachamnet id");
                    console.log(result);
                    if(result.length<1){
                    swal('','Document generation fail, please try again or contact to support.','error');
                    return;
                }
                    let baseUrl = window.location.origin;
                    $scope.fileUrl = $sce.trustAsResourceUrl(baseUrl+'/servlet/servlet.FileDownload?file='+result[0].Id+'#view=FitH');
                    var myModal = new bootstrap.Modal(document.getElementById('filePreview2'))
                    myModal.show('slow');
                    $scope.$apply();
                });
                }
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
                    $scope.uploadFile = function (type, userDocId, fileId,maxSize,minFileSize) {
                    debugger;
                    $scope.showSpinnereditProf = true;
                    var file;
                    
                    file = document.getElementById('SignatureDoc').files[0];
                    fileName = file.name;
                    var typeOfFile = fileName.split(".");
                    lengthOfType =  typeOfFile.length;
                    if(typeOfFile[lengthOfType-1] == "jpg" || typeOfFile[lengthOfType-1] == "jpeg"){
                    
                }else{
                    swal('info','Please choose jpg/jpeg file only.','info');
                    return;
                }
                    console.log(file);
                    maxFileSize=maxSize;
                    if (file != undefined) {
                    if (file.size <= maxFileSize) {
                    if(file.size<minFileSize){
                    swal('info','Your file is too small. Please try again.','info');
                    return;
                    // alert("Your file is too small. Please try again.");
                    // return;
                }
                    attachmentName = file.name;
                    const myArr = attachmentName.split(".");
                    var fileReader = new FileReader();
                    var maxStringSize = 6000000;
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
                    swal('info','Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".','info');
                    return;
                    // alert("Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".");
                }
                    
                }
                    fileReader.onerror = function (e) {
                    swal('info','There was an error reading the file.  Please try again.','info');
                    return;
                    // alert("There was an error reading the file.  Please try again.");
                }
                    fileReader.onabort = function (e) {
                    swal('info','There was an error reading the file.  Please try again.','info');
                    return;
                    // alert("There was an error reading the file.  Please try again.");
                }
                    
                    fileReader.readAsBinaryString(file);  //Read the body of the file
                    
                } else {
                    swal('info','Your file is too large.  Please try again.','info');
                    return;
                    // alert("Your file is too large.  Please try again.");
                    $scope.showSpinnereditProf = false;
                }
                } else {
                    swal('info','You must choose a file before trying to upload it','info');
                    return;
                    // alert("You must choose a file before trying to upload it");
                    $scope.showSpinnereditProf = false;
                }
                }
                    
                    $scope.uploadAttachment = function (type, userDocId, fileId) {
                    debugger;
                    var attachmentBody = "";
                    var chunkSize = 750000;
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
                    ApplicantPortal_Contoller.doCUploadAttachmentSignature(
                    attachmentBody, attachmentName,fileId, userDocId, 
                    function (result, event) {
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