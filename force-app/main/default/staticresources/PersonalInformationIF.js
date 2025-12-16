angular.module('cp_app').controller('PersonalInformationIF_Ctrl', function($scope,$rootScope) {
    $scope.objContact={};
    debugger
    $rootScope.proposalId;
    $scope.countryIndia=['India'];
    $scope.nationalityy = ['Indian'];
    
    // var index = $scope.countryIndia.indexOf('Germany');
    // $scope.countryIndia.splice(index);
    $scope.baseURL = window.location.origin;
	
    // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }

    // Fetching the apaId from Local Storage
    if (localStorage.getItem('apaId')) {
        $rootScope.apaId = localStorage.getItem('apaId');
        console.log('Loaded apaId from localStorage:', $rootScope.apaId);
    }
    
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
              $scope.getContactDetails();
              debugger;
              $scope.$apply();
          }
      }
      )  
  }
  $scope.getDependentPicklistValues();

  $scope.onCountryChange = function(){
    debugger;
    
            if($scope.objContact.MailingCountry == 'India'){
                $scope.objContact.stateList = $scope.indianStates;
            }else if($scope.objContact.MailingCountry == 'Germany'){
                $scope.objContact.stateList = $scope.germanStates;
            }
            if($scope.objContact.OtherCountry == 'India'){
              $scope.objContact.stateList1 = $scope.indianStates;
          }else if($scope.objContact.OtherCountry == 'Germany'){
              $scope.objContact.stateList1 = $scope.germanStates;
          }
            $scope.$apply();
}

    $scope.checkEmail = function(email,contId){
      debugger;
      $scope.emailCheck = false;
      if(contId == undefined){
        contId = "";
      }
      ApplicantPortal_Contoller.checkEmail(email,contId,function(result,event){
        debugger;
        if(event.status){
          debugger;
          if(result.length > 0){
            $scope.emailCheck = true;
          }else{
            $scope.emailCheck = false;
          }
          $scope.$apply();
        }
      })

    }
/*
    $scope.getContactDetails=function(){
    ApplicantPortal_Contoller.getContactDetails($rootScope.candidateId, function (result, event) {
      debugger  
      console.log(result);
        console.log(event);
        if (event.status) {
          debugger;
          if(result != null){
            if(result.PassportNo__c != undefined || result.PassportNo__c != ''){
              result.PassportNo__c = result.PassportNo__c ? result.PassportNo__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.PassportNo__c;  
            }
            if(result.MailingStreet != undefined || result.MailingStreet != ''){
              result.MailingStreet = result.MailingStreet ? result.MailingStreet.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.MailingStreet;  
            }
            if(result.MailingCity != undefined || result.MailingCity != ''){
              result.MailingCity = result.MailingCity ? result.MailingCity.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.MailingCity;  
            }
            if(result.MailingState != undefined || result.MailingState != ''){
              result.MailingState = result.MailingState ? result.MailingState.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.MailingState;  
            }
            if(result.MailingCountry != undefined || result.MailingCountry != ''){
              result.MailingCountry = result.MailingCountry ? result.MailingCountry.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.MailingCountry;  
            }
            if(result.OtherStreet != undefined || result.OtherStreet != ''){
              result.OtherStreet = result.OtherStreet ? result.OtherStreet.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.OtherStreet;  
            }
            if(result.OtherCity != undefined || result.OtherCity != ''){
              result.OtherCity = result.OtherCity ? result.OtherCity.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.OtherCity;  
            }
            if(result.OtherState != undefined || result.OtherState != ''){
              result.OtherState = result.OtherState ? result.OtherState.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.OtherState;  
            }
            if(result.OtherCountry != undefined || result.OtherCountry != ''){
              result.OtherCountry = result.OtherCountry ? result.OtherCountry.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.OtherCountry;  
            }
            $scope.objContact=result;
                
            delete $scope.objContact.Publications_Patents__r;
            delete $scope.objContact.Education_Details__r;
             $scope.objContact.stateList = $scope.indianStates;

            $scope.objContact.stateList1 = $scope.indianStates;
        
          
            if(result.Passport_Expiry__c!=undefined && result.Passport_Expiry__c!=''){
              $scope.PassExpiryDate=new Date(result.Passport_Expiry__c);
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
            if(result.OtherStreet!=undefined && result.OtherStreet!=''){
              var arrMA =result.OtherStreet.split(';');
              $scope.OtherLine1=arrMA[0];
              if(arrMA.length>0){
                $scope.OtherLine2=arrMA[1];
              }
            }
            if($scope.objContact.Attachments != undefined && $scope.objContact.Attachments.length > 0){
              $scope.doc = $scope.objContact.Attachments[0];
              $scope.imageSrc = window.location.origin +'/ApplicantDashboard/servlet/servlet.FileDownload?file='+$scope.objContact.Profile_Pic_Attachment_Id__c;
              delete  $scope.objContact.Attachments;
          }
            $scope.gender=$rootScope.gender;
            $scope.nationality=$rootScope.nationality;
            
          }
          $scope.$apply();
        }
      },
        { escape: true }
      );
}
*/
    
   /* $scope.getContactDetails=function(){
    ApplicantPortal_Contoller.getContactDetails($rootScope.candidateId, function (result, event) {
      debugger  
      console.log('Full result:', result);
      console.log('Contact data:', result.contactRecord);
      console.log('Proposal data:', result.proposals);
        console.log(event);
        if (event.status) {
          debugger;
          if(result != null && result.contactRecord != null){
            var contactData = result.contactRecord; // Extract contact from wrapper
            
            if(contactData.PassportNo__c != undefined || contactData.PassportNo__c != ''){
              contactData.PassportNo__c = contactData.PassportNo__c ? contactData.PassportNo__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : contactData.PassportNo__c;  
            }
            if(contactData.MailingStreet != undefined || contactData.MailingStreet != ''){
              contactData.MailingStreet = contactData.MailingStreet ? contactData.MailingStreet.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : contactData.MailingStreet;  
            }
            if(contactData.MailingCity != undefined || contactData.MailingCity != ''){
              contactData.MailingCity = contactData.MailingCity ? contactData.MailingCity.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : contactData.MailingCity;  
            }
            if(contactData.MailingState != undefined || contactData.MailingState != ''){
              contactData.MailingState = contactData.MailingState ? contactData.MailingState.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : contactData.MailingState;  
            }
            if(contactData.MailingCountry != undefined || contactData.MailingCountry != ''){
              contactData.MailingCountry = contactData.MailingCountry ? contactData.MailingCountry.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : contactData.MailingCountry;  
            }
            if(contactData.OtherStreet != undefined || contactData.OtherStreet != ''){
              contactData.OtherStreet = contactData.OtherStreet ? contactData.OtherStreet.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : contactData.OtherStreet;  
            }
            if(contactData.OtherCity != undefined || contactData.OtherCity != ''){
              contactData.OtherCity = contactData.OtherCity ? contactData.OtherCity.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : contactData.OtherCity;  
            }
            if(contactData.OtherState != undefined || contactData.OtherState != ''){
              contactData.OtherState = contactData.OtherState ? contactData.OtherState.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : contactData.OtherState;  
            }
            if(contactData.OtherCountry != undefined || contactData.OtherCountry != ''){
              contactData.OtherCountry = contactData.OtherCountry ? contactData.OtherCountry.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : contactData.OtherCountry;  
            }
            
            $scope.objContact = contactData;
                
            delete $scope.objContact.Publications_Patents__r;
            delete $scope.objContact.Education_Details__r;
            $scope.objContact.stateList = $scope.indianStates;
            $scope.objContact.stateList1 = $scope.indianStates;
        
            // Handle proposal data - add it back to maintain UI compatibility
            if(result.proposals && result.proposals.length > 0) {
                $scope.objContact.Proposals__r = result.proposals;
                $scope.proposal = result.proposals[0];
            }
          
            if(contactData.Passport_Expiry__c!=undefined && contactData.Passport_Expiry__c!=''){
              $scope.PassExpiryDate=new Date(contactData.Passport_Expiry__c);
            }
            if(contactData.Birthdate!=undefined && contactData.Birthdate!=''){
              $scope.Birthdate=new Date(contactData.Birthdate);
            }
            var mailingAddress=contactData.MailingStreet;
            if(mailingAddress!=undefined && mailingAddress!=''){
              var arrMA =mailingAddress.split(';');
              $scope.MailingLine1=arrMA[0];
              if(arrMA.length>0){
                $scope.MailingLine2=arrMA[1];
              }
            }
            if(contactData.OtherStreet!=undefined && contactData.OtherStreet!=''){
              var arrMA =contactData.OtherStreet.split(';');
              $scope.OtherLine1=arrMA[0];
              if(arrMA.length>0){
                $scope.OtherLine2=arrMA[1];
              }
            }
            if($scope.objContact.Attachments != undefined && $scope.objContact.Attachments.length > 0){
              $scope.doc = $scope.objContact.Attachments[0];
              $scope.imageSrc = window.location.origin +'/ApplicantDashboard/servlet/servlet.FileDownload?file='+$scope.objContact.Profile_Pic_Attachment_Id__c;
              delete  $scope.objContact.Attachments;
            }
            $scope.gender=$rootScope.gender;
            $scope.nationality=$rootScope.nationality;
            
          }
          $scope.$apply();
        }
      },
        { escape: true }
      );
}*/
    
    $scope.getContactDetails=function(){
    ApplicantPortal_Contoller.getContactDetails($rootScope.candidateId, function (result, event) {
      debugger  
      console.log('Full result:', result);
      console.log('Contact data:', result.contactRecord);
      console.log('Proposal data:', result.proposals);
        console.log(event);
        if (event.status) {
          debugger;
          if(result != null){
            
            
            if(result.PassportNo__c != undefined || result.PassportNo__c != ''){
              result.PassportNo__c = result.PassportNo__c ? result.PassportNo__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.PassportNo__c;  
            }
            if(result.MailingStreet != undefined || result.MailingStreet != ''){
              result.MailingStreet = result.MailingStreet ? result.MailingStreet.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.MailingStreet;  
            }
            if(result.MailingCity != undefined || result.MailingCity != ''){
              result.MailingCity = result.MailingCity ? result.MailingCity.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.MailingCity;  
            }
            if(result.MailingState != undefined || result.MailingState != ''){
              result.MailingState = result.MailingState ? result.MailingState.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.MailingState;  
            }
            if(result.MailingCountry != undefined || result.MailingCountry != ''){
              result.MailingCountry = result.MailingCountry ? result.MailingCountry.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.MailingCountry;  
            }
            if(result.OtherStreet != undefined || result.OtherStreet != ''){
              result.OtherStreet = result.OtherStreet ? result.OtherStreet.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.OtherStreet;  
            }
            if(result.OtherCity != undefined || result.OtherCity != ''){
              result.OtherCity = result.OtherCity ? result.OtherCity.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.OtherCity;  
            }
            if(result.OtherState != undefined || result.OtherState != ''){
              result.OtherState = result.OtherState ? result.OtherState.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.OtherState;  
            }
            if(result.OtherCountry != undefined || result.OtherCountry != ''){
              result.OtherCountry = result.OtherCountry ? result.OtherCountry.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.OtherCountry;  
            }
            
            $scope.objContact = result;
                
            delete $scope.objContact.Publications_Patents__r;
            delete $scope.objContact.Education_Details__r;
            $scope.objContact.stateList = $scope.indianStates;
            $scope.objContact.stateList1 = $scope.indianStates;
        
            // Handle proposal data - add it back to maintain UI compatibility
            if(result.proposals && result.proposals.length > 0) {
                $scope.objContact.Proposals__r = result.proposals;
                $scope.proposal = result.proposals[0];
            }
          
            if(result.Passport_Expiry__c!=undefined && result.Passport_Expiry__c!=''){
              $scope.PassExpiryDate=new Date(result.Passport_Expiry__c);
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
            if(result.OtherStreet!=undefined && result.OtherStreet!=''){
              var arrMA =result.OtherStreet.split(';');
              $scope.OtherLine1=arrMA[0];
              if(arrMA.length>0){
                $scope.OtherLine2=arrMA[1];
              }
            }
            if($scope.objContact.Attachments != undefined && $scope.objContact.Attachments.length > 0){
              $scope.doc = $scope.objContact.Attachments[0];
              $scope.imageSrc = window.location.origin +'/ApplicantDashboard/servlet/servlet.FileDownload?file='+$scope.objContact.Profile_Pic_Attachment_Id__c;
              delete  $scope.objContact.Attachments;
            }
            $scope.gender=$rootScope.gender;
            $scope.nationality=$rootScope.nationality;
            
          }
          $scope.$apply();
        }
      },
        { escape: true }
      );
}
    
// $scope.removeValue = function(i){
//   debugger;
//   $scope.country.splice(i,1);
// }
$scope.getProjectdetils = function () {
  debugger;
  ApplicantPortal_Contoller.getContactUserDoc($rootScope.contactId,$rootScope.proposalId,function (result, event) {
      debugger
      console.log('result return onload :: ');
      console.log(result);
      if (event.status) {
        $scope.allDocs = result;
        if(result != undefined){
          for(var i=0;i<$scope.allDocs.length;i++){
            if($scope.allDocs[i].userDocument.Name == 'Profile Picture'){
                $scope.docU=$scope.allDocs[i];
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
          var maxStringSize = 10480000;
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
          //         var link = document.createElement("a");
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
  $("input[name=txtRemoveBorder]").removeClass('border-theme');
}
$scope.redirectPageURL=function(URL){
  var link=document.createElement("a");
  link.id = 'someLink'; //give it an ID!
  link.href='#/'+URL+'';
  link.click();
}

$scope.updatePersonalInfoIF=function(){
  if($rootScope.proposalStage){
    $scope.redirectPageURL('FellowshipDetailsIF');
    return; 
}
debugger
    var birthYear=0;
    var birthMonth=0;
    var birthDay=0;
    // $scope.objContact.Country_Code__c = code[0];
    if($scope.objContact.Title==undefined || $scope.objContact.Title==''||$scope.objContact.Title==' '){
      swal('info','Please enter Salutation','info');
      $("#txtSalutation").addClass('border-theme');
      return;
    }
    if($scope.objContact.FirstName==undefined || $scope.objContact.FirstName==''||$scope.objContact.FirstName==' '){
      swal('info','Please enter first name','info');
      $("#txtFirstName").addClass('border-theme');
      return;
    }
    if($scope.objContact.LastName==undefined || $scope.objContact.LastName==''||$scope.objContact.LastName==' '){
      swal('info','Please enter last name','info');
      $("#txtLastName").addClass('border-theme');
      return;
    }
    if($scope.Birthdate==undefined || $scope.Birthdate==''||$scope.Birthdate==' '){
      swal('info','Please enter birth date','info');
      $("#txtDOB").addClass('border-theme');
      return;
    }
    if($scope.objContact.Nationality__c==undefined || $scope.objContact.Nationality__c==''||$scope.objContact.Nationality__c==' '){
      swal('info','Please select nationality','info');
      $("#selectNatinality").addClass('border-theme');
      return;
    }
    if($scope.objContact.Gender__c==undefined || $scope.objContact.Gender__c==''||$scope.objContact.Gender__c==' '){
      swal('info','Please select Gender','info');
      $("#gender").addClass('border-theme');
      return;
    }
    if($scope.objContact.Email==undefined || $scope.objContact.Email==''||$scope.objContact.Email==' '){
      swal('info','Please enter Email','info');
      $("#txtEmail").addClass('border-theme');
      return;
    }else{
      if($scope.valid($scope.objContact.Email)){
          swal(
              'info',
              'Check Your Registered Email!',
              'info'
          );
          $("#txtEmail").addClass('border-theme');
          return;
      }
  }

    if($scope.emailCheck == true){
      swal('info','Email already exists.','info');
      $("#txtEmail").addClass('border-theme');
          return;
    }

    if($scope.objContact.MobilePhone==undefined || $scope.objContact.MobilePhone==''||$scope.objContact.MobilePhone==' '){
      swal('info','Please enter Mobile No.','info');
      $("#mobile").addClass('border-theme');
      return;
    }

    if($scope.objContact.MobilePhone != undefined && $scope.objContact.MobilePhone != ""){
      if($scope.objContact.MobilePhone.length < 10){
          swal(
              'info',
              'Mobile No. should be 10 digit.',
              'info'
          )
          $("#mobile").addClass('border-theme');
          return;
      }
  }

  if($scope.objContact.OtherPhone != undefined && $scope.objContact.OtherPhone != ""){
    if($scope.objContact.OtherPhone.length < 10){
        swal(
            'info',
            'Contact No. should be 10 digit.',
            'info'
        )
        $("#mobile2").addClass('border-theme');
        return;
    }
}

    if($scope.MailingLine1 == undefined || $scope.MailingLine1 == ""){
      swal('info','Please enter Line 1.','info');
      $("#line1").addClass('border-theme');
      return;
    }

    if($scope.objContact.MailingCity == undefined || $scope.objContact.MailingCity == ""){
      swal('info','Please enter District.','info');
      $("#district").addClass('border-theme');
      return;
    }

    if($scope.objContact.MailingCountry == undefined || $scope.objContact.MailingCountry == ""){
      swal('info','Please enter country.','info');
      $("#country").addClass('border-theme');
      return;
    }

    if($scope.objContact.MailingState == undefined || $scope.objContact.MailingState == ""){
      swal('info','Please enter State.','info');
      $("#state").addClass('border-theme');
      return;
    }

    if($scope.objContact.MailingPostalCode == undefined || $scope.objContact.MailingPostalCode == ""){
      swal('info','Please enter pin code.','info');
      $("#pin").addClass('border-theme');
      return;
    }

    if($scope.objContact.MailingCountry == "India"){
      if($scope.objContact.MailingPostalCode.length != 6){
        swal('info','For India, pin code should be 6 digit.','info');
        $("#pin").addClass('border-theme');
      return;
      }
    }

    if($scope.objContact.Addess_same_as__c == false){
      if($scope.OtherLine1 == undefined || $scope.OtherLine1 == ""){
        swal('info','Please enter Line 1.','info');
        $("#line11").addClass('border-theme');
        return;
      }

      if($scope.objContact.OtherCity == undefined || $scope.objContact.OtherCity == ""){
        swal('info','Please enter District.','info');
        $("#district2").addClass('border-theme');
        return;
      }

      if($scope.objContact.OtherCountry == undefined || $scope.objContact.OtherCountry == ""){
        swal('info','Please enter country.','info');
        $("#country2").addClass('border-theme');
        return;
      }

      if($scope.objContact.OtherState == undefined || $scope.objContact.OtherState == ""){
        swal('info','Please enter State.','info');
        $("#state2").addClass('border-theme');
        return;
      }

      if($scope.objContact.OtherPostalCode == undefined || $scope.objContact.OtherPostalCode == ""){
        swal('info','Please enter pin code.','info');
        $("#pin2").addClass('border-theme');
        return;
      }
    }

    if($scope.objContact.OtherCountry == "India"){
      if($scope.objContact.OtherPostalCode.length != 6){
        swal('info','For India, pin code should be 6 digit.','info');
        $("#pin2").addClass('border-theme');
      return;
      }
    }
      if($scope.Birthdate!=undefined && $scope.Birthdate!=''){
        birthYear = $scope.Birthdate.getUTCFullYear();
        birthMonth = $scope.Birthdate.getUTCMonth()+1;
        birthDay = $scope.Birthdate.getDate();
        // delete $scope.objContact.Birthdate;
      }
      var pasExYear=0;
      var pasExMonth=0;
      var pasExDay=0;
      if($scope.PassExpiryDate!=undefined && $scope.PassExpiryDate!=''){
        pasExYear = $scope.PassExpiryDate.getUTCFullYear();
        pasExMonth = $scope.PassExpiryDate.getUTCMonth()+1;
        pasExDay = $scope.PassExpiryDate.getDate();
        // delete $scope.objContact.PhD_Enroll_Date__c;
      }
      if($scope.MailingLine1!=undefined){
        $scope.objContact.MailingStreet=$scope.MailingLine1;
      }
      if($scope.MailingLine2!=undefined){
        $scope.objContact.MailingStreet=$scope.objContact.MailingStreet+','+$scope.MailingLine2;
      }
      if($scope.MailingLine1==null && $scope.MailingLine2==null){
        $scope.objContact.MailingStreet=null;
      }
      if($scope.OtherLine1!=undefined){
        $scope.objContact.OtherStreet=$scope.OtherLine1;
      }
      if($scope.OtherLine2!=undefined){
        $scope.objContact.OtherStreet=$scope.objContact.OtherStreet+';'+$scope.OtherLine2;
      }
      if($scope.OtherLine1==null && $scope.OtherLine2==null){
        $scope.objContact.OtherStreet=null;
      }
      if($scope.objContact.Uploaded__c == false){
        swal('info','Please upload image.','info');
        return;  
      }
      $scope.objContact['State__c'] = $scope.objContact['MailingState'];
      $scope.objContact['Other_State__c'] = $scope.objContact['OtherState'];
      // $scope.objContact.MailingPostalCode = $scope.objContact.MailingPostalCode.toString();
      delete ($scope.objContact['stateList']);
      delete ($scope.objContact['stateList1']);
      delete $scope.objContact.Employment_Details__r;
    //*********************added By Karthik KE (26/11/2025 11:25 AM)**************
        delete $scope.objContact.Employment_Details__r;
        delete $scope.objContact.Applicant_Proposal_Associations__r;
        delete $scope.objContact.Education_Details__r;
        delete $scope.objContact.Publications_Patents__r;
        delete $scope.objContact.Attachments;
        //****************************************************************************
    ApplicantPortal_Contoller.updatePersonalInfoIF($rootScope.candidateId,$scope.objContact,
      birthDay,birthMonth,birthYear,pasExYear,pasExMonth,pasExDay,function (result, event) {
          debugger
          console.log(result);
          console.log(event);
          debugger
          if (event.status) {
            swal({
              title: "Personal Info",
              text: result,
              icon: "success",
              button: "ok!",
            }).then((value) => {
                  $scope.redirectPageURL('FellowshipDetailsIF');
                });
          }
          else
          {
            swal({
              title: "Personal Info",
              text: "Exception!",
              icon: "error",
              button: "ok!",
            });
          }
        },
          { escape: true }
        );
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


    $scope.clickPreviousPersonalInfo=function(){
        var link=document.createElement("a");
                    link.id = 'someLink'; //give it an ID!
                    link.href="#/Dashboard_IF";
                    link.click();
    }
    $scope.setAddressSameAs=function(){
      debugger;
      if($scope.objContact.Addess_same_as__c == true){
        $scope.OtherLine1=$scope.MailingLine1;
        $scope.OtherLine2=$scope.MailingLine2;
        $scope.objContact.OtherCity=$scope.objContact.MailingCity;
        $scope.objContact.OtherState=$scope.objContact.MailingState;
        $scope.objContact.OtherCountry=$scope.objContact.MailingCountry;
        $scope.objContact.OtherPostalCode=$scope.objContact.MailingPostalCode;
      }else{
        $scope.OtherLine1=null;
        $scope.OtherLine2=null;
        $scope.objContact.OtherCity=null;
        $scope.objContact.OtherState=null;
        $scope.objContact.OtherCountry=null;
        $scope.objContact.OtherPostalCode=null;
      }
    }

    $scope.removeClass=function(controlid){
      $("#"+controlid+"").removeClass('border-theme');
    }

    $scope.checkPinCode = function(){
      debugger;
      if($scope.objContact.MailingCountry == "India"){
        if($scope.objContact.MailingPostalCode.length > 6){
          swal('info','For India, pin code should be 6 digit.','info');
          $("#pin").addClass('border-theme');
        return;
        }
      }
    }

    $scope.checkPinCode2 = function(){
      debugger;
      if($scope.objContact.OtherCountry == "India"){
        if($scope.objContact.OtherPostalCode.length != 6){
          swal('info','For India, pin code should be 6 digit.','info');
          $("#pin2").addClass('border-theme');
        return;
        }
      }
    }
    var countryCode;
            	$( document.body ).on( 'click', '.dropdown-menu li', function( event ) {
debugger
// alert('hello country code');
                  var $target = $( event.currentTarget );
                    
                    
                   console.log('XXX---',$target.text());
                   countryCode = $target.text();
                    
                    let code = countryCode.split(' ');
                    
                   console.log('XXX---',countryCode);
                    console.log('XXX2---',code[1]);
                    
                    
            
                  $target.closest( '.btn-group' )
                     .find( '[data-bind="label"]' ).text( $target.text() )
                        .end()
                     .children( '.dropdown-toggle' ).dropdown( 'toggle' );
            
                  return false;            
               });
});

// app.directive("ngFileSelect", function(fileReader, $timeout) {
//   return {
//     scope: {
//       ngModel: '='
//     },
//     link: function($scope, el) {
//       function getFile(file) {
//         fileReader.readAsDataUrl(file, $scope)
//           .then(function(result) {
//             $timeout(function() {
//               $scope.ngModel = result;
//             });
//           });
//       }

//       el.bind("change", function(e) {
//         var file = (e.srcElement || e.target).files[0];
//         getFile(file);
//       });
//     }
//   };
// });

// app.factory("fileReader", function($q, $log) {
// var onLoad = function(reader, deferred, scope) {
//   return function() {
//     scope.$apply(function() {
//       deferred.resolve(reader.result);
//     });
//   };
// };

// var onError = function(reader, deferred, scope) {
//   return function() {
//     scope.$apply(function() {
//       deferred.reject(reader.result);
//     });
//   };
// };

// var onProgress = function(reader, scope) {
//   return function(event) {
//     scope.$broadcast("fileProgress", {
//       total: event.total,
//       loaded: event.loaded
//     });
//   };
// };

// var getReader = function(deferred, scope) {
//   var reader = new FileReader();
//   reader.onload = onLoad(reader, deferred, scope);
//   reader.onerror = onError(reader, deferred, scope);
//   reader.onprogress = onProgress(reader, scope);
//   return reader;
// };

// var readAsDataURL = function(file, scope) {
//   var deferred = $q.defer();

//   var reader = getReader(deferred, scope);
//   reader.readAsDataURL(file);

//   return deferred.promise;
// };

// return {
//   readAsDataUrl: readAsDataURL
// };
// });

// app.directive('wrapIntlTelInput', function ($timeout) {
// return {
//   restrict: 'A',
//   require: '^ngModel',
//   link: link
// };

// ////////////////////////////////////////////////////////////

// function link (scope, elem, attrs, ctrl) {
//   hookFieldIntoIntlTelInputJqueryPlugin();
//   hookFieldIntoJqueryChangeEvent();

//   ctrl.$parsers.push(validateFieldAndFormatModelValue);

//   elem.on('blur keyup change', applyRenderWhenChange);
//   elem.on('$destroy', function () {
//     elem.off('blur keyup change');
//   });

//   $timeout(applyMaskingWhenInitWithPresetPhoneNumber);

//   ////////////

//   function hookFieldIntoIntlTelInputJqueryPlugin () {
//     elem.intlTelInput({
//       autoFormat: false,
//       autoHideDialCode: true,
//       autoPlaceholder: false,
//       defaultCountry: 'us',
//       nationalMode: true,
//       numberType: '',
//       preferredCountries: ['us', 'ca', 'gb', 'au'],
//       responsiveDropdown: false,
//       utilsScript: ''
//     });
//   }

//   function hookFieldIntoJqueryChangeEvent () {
//     elem.change(reformatPhoneNumberWithCountryCode);
//   }

//   function reformatPhoneNumberWithCountryCode () {
//     ctrl.$$parseAndValidate();
//   }

//   function validateFieldAndFormatModelValue (value) {
//     var parsedValue = elem.intlTelInput('getNumber') || value;
//     var formattedModelValue = removeInvalidInput(parsedValue);
//     ctrl.$setValidity('invalidIntlTel', elem.intlTelInput('isValidNumber'));
//     return formattedModelValue;

//     ////////////
    
//     function removeInvalidInput (input) {
//       return input ? input.replace(/(?!^\+?)[^0-9]/g, '') : '';
//     }
//   }

//   function applyMaskingWhenInitWithPresetPhoneNumber () {
//     if (elem.val()) {
//       elem.intlTelInput('setNumber', elem.val());
//       applyRenderWhenChange();
//     }
//   }

//   function applyRenderWhenChange () {
//     scope.$apply(function () {
//       return ctrl.$setViewValue(elem.val());
//     });
//   }
// }
// });