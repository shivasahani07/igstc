angular.module('cp_app').controller('ApplicantInformationSing_Ctrl', function($scope,$rootScope) {
$scope.objContact={};
$scope.ddStatus={};
$rootScope.proposalId;
$scope.baseURL = window.location.origin;
$rootScope.proposalStage;
$rootScope.CampaignId;
// $scope.proposalStage = true;
// $rootScope.proposalStage = true;


// Fetching the proposalId from Local Storage
    //if (localStorage.getItem('proposalId')) {
        //$rootScope.proposalId = localStorage.getItem('proposalId');
      //  console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    //}


    // Fetching the yearlyCallId from Local Storage
    if (localStorage.getItem('yearlyCallId')) {
        $rootScope.yearlyCallId = localStorage.getItem('yearlyCallId');
        console.log('Loaded proposalId from localStorage:', $rootScope.yearlyCallId);
    }


    // Check proposal stage from server
// $scope.checkProposalStageFromServer = function() {
//     if($rootScope.proposalId) {
//         // Assuming you have a method to get proposal data
//         IndustrialFellowshipController.getProposalData($rootScope.proposalId, function(result, event) {
//             if(event.status && result != null) {
//                 if(result.proposalStage != "Draft") {
//                     $scope.proposalStage = true;
//                     $rootScope.proposalStage = true;
//                     // localStorage.setItem('proposalStage', 'true');
//                 } else {
//                     $scope.proposalStage = false;
//                     $rootScope.proposalStage = false;
//                     // localStorage.setItem('proposalStage', 'false');
//                 }
//                 $scope.$apply();
//             }
//         });
//     }
// };
// $scope.checkProposalStageFromServer();

// Call on page load if proposalId exists in localStorage
// if(localStorage.getItem('proposalId')) {
//     $rootScope.proposalId = localStorage.getItem('proposalId');
//     $scope.checkProposalStageFromServer();
// }


$scope.getDependentPicklistValues = function(){
  debugger;
  $scope.indianStates = [];
  $scope.germanStates = [];
  ApplicantPortal_Contoller.getFieldDependencies('Contact','Country__c','States__c', function(result,event){
      debugger;
      if(event.status && result != null){
          debugger;
          $scope.indianStates = result.India;
          $scope.germanStates = result.Germany;
          $scope.getContactSingh();
          debugger;
          $scope.$apply();
      }
  }
  )  
}
$scope.getDependentPicklistValues();
$scope.getContactSingh=function(){
    IndustrialFellowshipController.getContactSingh($rootScope.candidateId, function (result, event) {
        debugger
            console.log(result);
            console.log(event);
            $scope.objContact=result;
            $scope.accountDet=$scope.objContact.Account;
            $scope.doc = $scope.objContact.Profile_Pic_Attachment_Id__c;
            $scope.nationality=$rootScope.nationality;
            $scope.country=$rootScope.country;
            if(result.FirstName != undefined || result.FirstName != ''){
              $scope.objContact.FirstName = $scope.objContact.FirstName ? $scope.objContact.FirstName.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.objContact.FirstName;  
            }
            if(result.LastName != undefined || result.LastName != ''){
              $scope.objContact.LastName = $scope.objContact.LastName ? $scope.objContact.LastName.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.objContact.LastName;  
            }
            if(result.Designation__c != undefined || result.Designation__c != ''){
              $scope.objContact.Designation__c = $scope.objContact.Designation__c ? $scope.objContact.Designation__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.objContact.Designation__c;  
            }
            if(result.Account.Name != undefined || result.Account.Name != ''){
              $scope.objContact.Account.Name = $scope.objContact.Account.Name ? $scope.objContact.Account.Name.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.objContact.Account.Name;  
            }
            if(result.Designation__c != undefined || result.Designation__c != ''){
              $scope.objContact.Designation__c = $scope.objContact.Designation__c ? $scope.objContact.Designation__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.objContact.Designation__c;  
            }
            if(result.MailingStreet != undefined || result.MailingStreet != ''){
              $scope.objContact.MailingStreet = $scope.objContact.MailingStreet ? $scope.objContact.MailingStreet.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.objContact.MailingStreet;  
            }
            if(result.MailingCity != undefined || result.MailingCity != ''){
              $scope.objContact.MailingCity = $scope.objContact.MailingCity ? $scope.objContact.MailingCity.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.objContact.MailingStreet;  
            }

            if(result.Birthdate!=undefined && result.Birthdate!=''){
                $scope.Birthdate=new Date(result.Birthdate);
              }
              var mailingAddress=result.MailingStreet;
            if(mailingAddress!=undefined && mailingAddress!=''){
              var arrMA =mailingAddress.split(';');
              $scope.MailingLine1=arrMA[0];
              if(arrMA.length>0){
                $scope.MailingLine2=arrMA[1];
              }
            }
            if($scope.objContact.MailingCountry!=undefined){
              if($scope.objContact.MailingCountry=="India"){
                $scope.ddStatus=$scope.indianStates;
              }else{
                $scope.ddStatus=$scope.germanStates;
              }
            }
            if($scope.objContact.Attachments != undefined && $scope.objContact.Attachments.length > 0){
              $scope.doc = $scope.objContact.Attachments[0];
              $scope.imageSrc = window.location.origin +'/ApplicantDashboard/servlet/servlet.FileDownload?file='+$scope.objContact.Profile_Pic_Attachment_Id__c;
              delete  $scope.objContact.Attachments;
          }
            $scope.$apply();
    });
};
$scope.setStateList=function(country){
  if(country=="India"){
    $scope.ddStatus=$scope.indianStates;
  }else{
    $scope.ddStatus=$scope.germanStates;
  }
}
//$scope.getContactSingh();
$scope.getProjectdetils = function () {
  debugger;
  ApplicantPortal_Contoller.getContactUserDoc($rootScope.contactId, function (result, event) {
      debugger
      console.log('result return onload :: ');
      console.log(result);
      if (event.status) {
        $scope.allDocs = result;
        if(result[0].RedirectPage__c!=undefined){
          $scope.getProjectdetils();
        }
        else{if(result != undefined){
          for(var i=0;i<$scope.allDocs.length;i++){
            if($scope.allDocs[i].userDocument.Name == 'Profile Picture'){
                $scope.docU=$scope.allDocs[i];
            }
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

$scope.uploadFile = function (type, userDocId, fileId,fileSizeFun,fileSizeMin) {
  debugger;
  maxFileSize=fileSizeFun;
  // if(userDocId == )
  $scope.showSpinnereditProf = true;
  var file;
  
      file = document.getElementById("profilePic").files[0];
      
      fileName = file.name;
      var typeOfFile = fileName.split(".");
      lengthOfType =  typeOfFile.length;
      if(typeOfFile[lengthOfType-1] == "jpg" || typeOfFile[lengthOfType-1] == "jpeg" || typeOfFile[lengthOfType-1] == "JPEG" || typeOfFile[lengthOfType-1] == "JPG"){
          
      }else{
          swal('info','Please choose jpg/jpeg file only.','info');
          $scope.setLostValues();
          return;
      }
  console.log(file);
  
  if (file != undefined) {
      if (file.size <= maxFileSize) {
          if(file.size<fileSizeMin){
            swal("info", "File must be between 30 to 500 kb in size.  Your file is too small.  Please try again.","info");
            $scope.setLostValues();
            return; 
              // alert("File must be between 30 to 50 kb in size.  Your file is too small.  Please try again.");
              // return;
          }
          attachmentName = file.name;
          const myArr = attachmentName.split(".");
          /* if (myArr[1] != "pdf" && type != 'profilePic') {
              alert("Please upload in PDF format only");
              return;
          } */
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
                  $scope.uploadAttachment(type , userDocId, fileId);
              } else {
                swal("info", "Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".","info");
                $scope.setLostValues();
                return;
                  // alert("Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".");
              }
  
          }
          fileReader.onerror = function (e) {
            swal("info", "There was an error reading the file.  Please try again.","info");
            $scope.setLostValues();
                return;
              // alert("There was an error reading the file.  Please try again.");
          }
          fileReader.onabort = function (e) {
            swal("info", "There was an error reading the file.  Please try again.","info");
            $scope.setLostValues();
                return;
              // alert("There was an error reading the file.  Please try again.");
          }
  
          fileReader.readAsBinaryString(file);  //Read the body of the file
  
      } else {
        swal("info", "File must be under 500 kb in size.  Your file is too large.  Please try again.","info");
        $scope.setLostValues();
       // $scope.getContactWiser();
                return;
          // alert("File must be under 50 kb in size.  Your file is too large.  Please try again.");
          $scope.showSpinnereditProf = false;
      }
  } else {
    swal("info", "You must choose a file before trying to upload it","info");
    $scope.setLostValues();
      return;
      // alert("You must choose a file before trying to upload it");
      $scope.showSpinnereditProf = false;
  }
  }
  
  $scope.uploadAttachment = function (type, userDocId, fileId) {
  debugger;
  var attachmentBody = "";
  var chunkSize = 750000;
  if (fileId == undefined) {
      fileId = " ";
  }
  if (userDocId == undefined) {
    userDocId = " ";
  }
  if (fileSize <= positionIndex + chunkSize) {
      debugger;
      attachmentBody = attachment.substring(positionIndex);
      doneUploading = true;
  } else {
      attachmentBody = attachment.substring(positionIndex, positionIndex + chunkSize);
  }
  console.log("Uploading " + attachmentBody.length + " chars of " + fileSize);
  ApplicantPortal_Contoller.doUploadProfilePic(
    $rootScope.contactId,attachmentBody, attachmentName,
      function (result, event) {
          console.log(result);
          if (event.type === 'exception') {
              console.log("exception");
              console.log(event);
          } else if (event.status) {
              if (doneUploading == true) {
                $scope.objContact.Uploaded__c = true;
                  swal(
                      'success',
                      'Uploaded successfully.',
                      'success'
                  );
                  $scope.getProjectdetils();          //         var link = document.createElement("a");
          // link.id = 'someLink'; //give it an ID!
          // link.href = '#/HostInfoApplicationPage';
          // link.click();
  
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


$scope.removeClass=function(){
  $("input[name=contactName]").removeClass('border-theme');
}
$scope.validateDate=function(){
  var birthYear=0;
    var birthMonth=0;
    var birthDay=0;
    var today = new Date();
      if($scope.Birthdate!=undefined && $scope.Birthdate!=''){
        birthYear = $scope.Birthdate.getUTCFullYear();
        birthMonth = $scope.Birthdate.getUTCMonth()+1;
        birthDay = $scope.Birthdate.getDate();
        // delete $scope.objContact.Birthdate;
      }
      // if($scope.Birthdate > today){
      //   swal('info','BirthDate should not be future date.','info');
      //   $("#txtBirthdate").addClass('border-theme');
      //   return;
      // }
      // var age = moment().diff(''+birthYear+'-'+birthMonth+'-'+birthDay+'', 'days');
      var deadline = moment($scope.endDate);
      var age = deadline.diff(''+birthYear+'-'+birthMonth+'-'+birthDay+'', 'days');
      if(age>20088){
        swal("Basic Details", "Age should be less than or equal to 55 years", "info");
        $("#txtBirthdate").addClass('border-theme');
        return;
      }
      if(age<7305){
        swal("Basic Details", "Age should be greater than 20 years", "info");
        $("#txtBirthdate").addClass('border-theme');
        return;
      }
}
$scope.saveApplicantPortalSingh=function(){
  debugger;
  if($scope.objContact.Uploaded__c == false){
    swal('info','Please upload image.','info');
    return;  
  }
debugger
  if($rootScope.proposalStage){
    $scope.redirectPageURL('ProjectDetailsSing');
    return;
  }
  if($scope.objContact.FirstName==null || $scope.objContact.FirstName==undefined || $scope.objContact.FirstName=='' || $scope.objContact.FirstName==' '){
    swal('info','Please enter first name','info');
    $("txtFirstName").addClass('border-theme');
    return;
  }
  if($scope.objContact.LastName==null || $scope.objContact.LastName==undefined || $scope.objContact.LastName=='' || $scope.objContact.LastName==' '){
    swal('info','Please enter last name','info');
    $("#txtLastName").addClass('border-theme');
    return;
  }
  debugger;
  
  if($scope.objContact.Email==null || $scope.objContact.Email==undefined || $scope.objContact.Email=='' || $scope.objContact.Email==' '){
    swal('info','Please enter email address','info');
    $("input[name=txtEmail]").addClass('border-theme');
    return;
  }else{
    if($scope.valid($scope.objContact.Email)){
      swal(
          'info',
          'Check Your Registered Email!',
          'info'
      )
      return;
  }
  }
  // if($scope.objContact.Department==null || $scope.objContact.Department==undefined || $scope.objContact.Department=='' || $scope.objContact.Department==' '){
  //   swal('info','Please enter Department','info');
  //   $("input[name=txtDepartment]").addClass('border-theme');
  //   return;
  // }
  if($scope.objContact.Designation__c==null || $scope.objContact.Designation__c==undefined || $scope.objContact.Designation__c=='' || $scope.objContact.Designation__c==' '){
    swal('info','Please enter Designation','info');
    $("input[name=txtDesignation]").addClass('border-theme');
    return;
  }
  if($scope.objContact.Account.Name==null || $scope.objContact.Account.Name==undefined || $scope.objContact.Account.Name=='' || $scope.objContact.Account.Name==' '){
    swal('info','Please enter Institute name','info');
    $("input[name=txtInstituteName]").addClass('border-theme');
    return;
  }
  if($scope.objContact.Nationality__c==null || $scope.objContact.Nationality__c==undefined || $scope.objContact.Nationality__c=='' || $scope.objContact.Nationality__c==' '){
    swal('info','Please enter Nationality','info');
    $("input[name=txtNationality]").addClass('border-theme');
    return;
  }
   
  if($scope.Birthdate==null || $scope.Birthdate==undefined || $scope.Birthdate=='' || $scope.Birthdate==' '){
    swal('info','Please enter birthdate','info');
    $("#txtBirthdate").addClass('border-theme');
    return;
  } 

  if($scope.MailingLine1==null || $scope.MailingLine1==undefined || $scope.MailingLine1=='' || $scope.MailingLine1==' '){
    swal('info','Please enter Line 1','info');
    $("input[name=txtLine1]").addClass('border-theme');
    return;
  }

  if($scope.objContact.MailingCountry==null || $scope.objContact.MailingCountry==undefined || $scope.objContact.MailingCountry=='' || $scope.objContact.MailingCountry==' '){
    swal('info','Please enter Country','info');
    $("input[name=txtCountry]").addClass('border-theme');
    return;
  }

  if($scope.objContact.MailingState==null || $scope.objContact.MailingState==undefined || $scope.objContact.MailingState=='' || $scope.objContact.MailingState==' '){
    swal('info','Please enter State','info');
    $("input[name=txtState]").addClass('border-theme');
    return;
  }

  if($scope.objContact.MailingCity==null || $scope.objContact.MailingCity==undefined || $scope.objContact.MailingCity=='' || $scope.objContact.MailingCity==' '){
    swal('info','Please enter District/City','info');
    $("input[name=txtCity]").addClass('border-theme');
    return;
  }

  if($scope.objContact.MailingPostalCode==null || $scope.objContact.MailingPostalCode==undefined || $scope.objContact.MailingPostalCode=='' || $scope.objContact.MailingPostalCode==' '){
    swal('info','Please enter Pin Code/Zip Code','info');
    $("input[name=txtPin]").addClass('border-theme');
    return;
  }

  if($scope.objContact.Phone==null || $scope.objContact.Phone==undefined || $scope.objContact.Phone=='' || $scope.objContact.Phone==' '){
    swal('info','Please enter Phone','info');
    $("input[name=txtPhone]").addClass('border-theme');
    return;
  }
  var birthYear=0;
    var birthMonth=0;
    var birthDay=0;
    
      if($scope.Birthdate!=undefined && $scope.Birthdate!=''){
        birthYear = $scope.Birthdate.getUTCFullYear();
        birthMonth = $scope.Birthdate.getUTCMonth()+1;
        birthDay = $scope.Birthdate.getDate();
        // delete $scope.objContact.Birthdate;
      }
      var deadline = moment($scope.endDate);
      var age = deadline.diff(''+birthYear+'-'+birthMonth+'-'+birthDay+'', 'days');
      // var age = moment().diff(''+birthYear+'-'+birthMonth+'-'+birthDay+'', 'days');
      // if(age>20088){
      //   swal("Basic Details", "Age should be less than or equal to 55 years", "info");
      //   $("#txtBirthdate").addClass('border-theme');
      //   return;
      // }
      if(age<7305){
        swal("Basic Details", "Age should be greater than 20 years", "info");
        $("#txtBirthdate").addClass('border-theme');
        return;
      }
      debugger
      if($scope.MailingLine1!=undefined){
        $scope.objContact.MailingStreet=$scope.MailingLine1;
      }
      if($scope.MailingLine2!=undefined){
        $scope.objContact.MailingStreet=$scope.objContact.MailingStreet+';'+$scope.MailingLine2;
      }
      if($scope.MailingLine1==null && $scope.MailingLine2==null){
        $scope.objContact.MailingStreet=null;
      }

      swal({
        title: "Processing...",
        text: "Please wait while we save your information",
        icon: "info",
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false
      });
      
    IndustrialFellowshipController.saveApplicantPortalSingh($rootScope.candidateId,$scope.objContact,$scope.accountDet,birthYear,birthMonth,birthDay,$rootScope.contactId, 'SING', $rootScope.CampaignId, $rootScope.yearlyCallId, function (result, event) {
        debugger

        // Saving the ProposalId in Local Storage
            localStorage.setItem('proposalId', result);
            $rootScope.proposalId = result; // Receiving the Proposal Id from the controller


            console.log(result);
            console.log(event);
            swal.close();
            if (event.status) {
                swal({
                  title: "SUCCESS",
                  text: 'Your Personal Information have been successfully saved',
                  icon: "success",
                  button: "ok!",
                }).then((value) => {
                  $scope.redirectPageURL('SingHostDetails');
                    });
              }
              else
              {
                swal({
                  title: "Applicant Information",
                  text: "Exception!",
                  icon: "error",
                  button: "ok!",
                });
              }
    });
};
$scope.getCampaignEndDate=function(){
  ApplicantPortal_Contoller.getCampaignEndDate('SING',function (result, event) {
    debugger
    console.log('campaign date');
      console.log(result);
    if(event.status){
      $rootScope.CampaignId = result.Id;
      $scope.objCampaign=result;
      $scope.endDate=new Date(result.EndDate);
      //$scope.getContactDet();
      $scope.$apply();          
    }
  });
}
$scope.getCampaignEndDate();
$scope.redirectPageURL=function(URL){
  var link=document.createElement("a");
  link.id = 'someLink'; //give it an ID!
  link.href='#/'+URL+'';
  link.click();
}

$scope.valid = function(value){
  if(value!=undefined){
       var x=value;
       var atpos = x.indexOf("@");
       var dotpos = x.lastIndexOf(".");
      if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
          
          return true;
      }
      return false;
   }
}

$scope.validateUrl=function(value) {
  $("input[name=txtUrl]").removeClass('border-theme');
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}
$scope.validateEmail=function(value){
  $("input[name=txtEmail]").removeClass('border-theme');
  return value.toLowerCase()
  .match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}
});