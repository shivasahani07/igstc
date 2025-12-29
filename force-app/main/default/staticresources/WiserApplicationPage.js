angular.module('cp_app').controller('WiserApplicantInformation_Ctrl', function($scope,$rootScope, fileReader) {
  $rootScope.userId;

  
//   $scope.doc={};
$rootScope.campaignId;//added
$scope.docU={};
$scope.indianStates = [];
$scope.germanStates = [];
$scope.countryCode='49';
$scope.phone="+44";
$scope.indiaCode=true;
$scope.baseURL = window.location.origin;
$scope.genderFemale=['Female','Other'];
  $scope.objContact = {
    "FirstName": " ",
    "LastName": " ",
    "Email": " ",
    "Birthdate":"",
    "Country__c":"",
    "Designation__c":"",
    "Institution_Name__c":"",
    "Department":"",
    "Phone":"",
    "Homepage_URL__c":"",
    "MailingCity":"",
    "MailingState":"",
    "MailingCountry":"",
    "MailingPostalCode":"",
    "Proposals__c":$rootScope.projectId,
};
$scope.objContact.stateList={};
$scope.$on("fileProgress", function(e, progress) {
    $scope.progress = progress.loaded / progress.total;
  });
  

  $scope.getDependentPicklistValues = function(){
    debugger;    
    ApplicantPortal_Contoller.getFieldDependencies('Contact','Country__c','States__c', function(result,event){
        debugger;
        if(event.status && result != null){
            debugger;
            if(result.India==undefined){
            if(result[0].Name=="WISER" || result[0].Name=="SING" || result[0].Name=="PECFAR" || result[0].Name=="2+2 Call" || result[0].Name=="Industrial Fellowships" || result[0].Name=="Workshop"){
              $scope.getDependentPicklistValues();
            }
          }else{
            $scope.indianStates = result.India;
            $scope.germanStates = result.Germany;
            $scope.getContactWiser();
            debugger;
            $scope.$apply();
            }
        }
    }
    )  
}

if(localStorage.getItem('proposalId')){
    $rootScope.proposalId = localStorage.getItem('proposalId'); 
}
$scope.getDependentPicklistValues();

$scope.onCountryChange = function(){
    debugger;
    
            if($scope.objContact.MailingCountry == 'India'){
                $scope.objContact.stateList = $scope.indianStates;
            }else if($scope.objContact.MailingCountry == 'Germany'){
                $scope.objContact.stateList = $scope.germanStates;
            }
            $scope.$apply();
}

$scope.getProjectdetils = function () {
    debugger;
    ApplicantPortal_Contoller.getContactUserDoc($rootScope.contactId, function (result, event) {
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

  $scope.getContactWiser = function(){
    debugger;
    $scope.pairingDetails = [];
    IndustrialFellowshipController.getContactWiser($rootScope.contactId, function(result, event){
        debugger;
        console.log("result ::",result);
        if(event.status && result){
                if(result.Birthdate!=undefined){
                    result.Birthdate = new Date(result.Birthdate);
                }

                if(result.MailingStreet != undefined && result.MailingStreet != ""){
                  splitStreet = result.MailingStreet.split(",");
                  $scope.MailingStreet1 = splitStreet[0];
                  $scope.MailingStreet2 = splitStreet[1];
                }
                $scope.objContact = result;
                $scope.orgDOB=result.Birthdate;
                if($scope.objContact.MailingCountry == 'India'){
                    $scope.objContact.stateList = $scope.indianStates;
                }else if($scope.objContact.MailingCountry == 'Germany'){
                    $scope.objContact.stateList = $scope.germanStates; 
                }
                if($scope.objContact.Attachments != undefined && $scope.objContact.Attachments.length > 0){
                    $scope.doc = $scope.objContact.Profile_Pic_Attachment_Id__c;
                    $scope.imageSrc = window.location.origin +'/ApplicantDashboard/servlet/servlet.FileDownload?file='+$scope.objContact.Profile_Pic_Attachment_Id__c;
                    delete  $scope.objContact.Attachments;
                }

                if(result.FirstName != undefined || result.FirstName != ''){
                  $scope.objContact.FirstName = $scope.objContact.FirstName ? $scope.objContact.FirstName.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.objContact.FirstName;  
                }
                if(result.LastName != undefined || result.LastName != ''){
                  $scope.objContact.LastName = $scope.objContact.LastName ? $scope.objContact.LastName.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.objContact.LastName;  
                }
                if(result.Account.Name != undefined || result.Account.Name != ''){
                  $scope.objContact.Account.Name = $scope.objContact.Account.Name ? $scope.objContact.Account.Name.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.objContact.Account.Name;  
                }
                if(result.Department != undefined || result.Department != ''){
                  $scope.objContact.Department = $scope.objContact.Department ? $scope.objContact.Department.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.objContact.Department;  
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

              //   if($scope.objContact.Country_Code__c!=undefined){
              //     if($scope.objContact.Country_Code__c=='49')
              //     $('#country-field').text('+49 Germany');
              //     else
              //     $('#country-field').text('+91 India');
              // }
              // else
              // $('#country-field').text('--Country Code--');
                $scope.$apply();
        }
    });
  };

//   $scope.getContactWiser();

  $scope.previousPage = function(){
    var link = document.createElement("a");
            link.id = 'someLink'; //give it an ID!
            link.href = '#/ProjectDetailsInWiserPage';
            link.click();
    // window.location.replace(window.location.origin+'/ApplicantDashboard/ApplicantPortal?id='+$rootScope.userId+'#/ProjectDetailsInWiserPage');

}


  $scope.saveApplicantPortalWiser = function(){
  
    debugger;
    var birthYear = 0;
    var birthMonth = 0;
    var birthDay = 0;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var IndianCount = 0;
    var GermanyCount = 0;
    $scope.detailedList = [];

    if ($scope.objContact.Salutation == undefined || $scope.objContact.Salutation == "") {
      swal("info", "Please Enter Salutation.","info");
      $("#salutation").addClass('border-theme');
      return; 
  }
    if ($scope.objContact.FirstName == undefined || $scope.objContact.FirstName == "") {
        swal("info", "Please Enter First Name.","info");
        $("#txtFirstName").addClass('border-theme');
        return; 
    }

    if ($scope.objContact.LastName == undefined || $scope.objContact.LastName == "") {
        swal("info", "Please Enter Last Name.","info");
        $("#txtLastName").addClass('border-theme');
        return; 
    }

    if ($scope.objContact.Birthdate == undefined || $scope.objContact.Birthdate == "") {
      swal("info", "Please Enter Date of Birth.","info");
      $("#txtDOB").addClass('border-theme');
      return; 
    }

    if($scope.objContact.Birthdate > today){
      swal("info", "Date of birth should not be future date.","info");
      $("#txtDOB").addClass('border-theme');
      return;   
    }

    if($scope.objContact.Birthdate !=undefined && $scope.objContact.Birthdate !=''){
      birthYear = $scope.objContact.Birthdate.getUTCFullYear();
      birthMonth = $scope.objContact.Birthdate.getUTCMonth()+1;
      birthDay = $scope.objContact.Birthdate.getDate();
      }
      var age = moment().diff(''+birthYear+'-'+birthMonth+'-'+birthDay+'', 'years');
    if(age<21){
      swal("info", "Age should not be less than 20 years", "info");
      $("#txtDOB").addClass('border-theme');
      return;
    }

  //   if ($scope.objContact.Gender__c == undefined || $scope.objContact.Gender__c == "") {
  //     swal("info", "Please Enter Gender.","info");
  //     $("#txtGender").addClass('border-theme');
  //     return; 
  // }

  if ($scope.objContact.Nationality__c == undefined || $scope.objContact.Nationality__c == "") {
      swal("info", "Please Enter Nationality.","info");
      $("#selectNatinality").addClass('border-theme');
      return; 
  }

  // if($scope.objContact.Country_Code__c == undefined){
  //   swal("Personal Info", "Please select country code.");
  //   $("#btnCountryCode").addClass('border-theme');
  //     return;
  // }

  if ($scope.objContact.Phone == undefined || $scope.objContact.Phone == "") {
    swal("info", "Please Enter Phone No.","info");
    $("#txtPhone").addClass('border-theme');
    return; 
    }

  //   if($scope.objContact.Phone != undefined && $scope.objContact.Phone != ""){
  //     if($scope.objContact.Phone.length < 10){
  //         swal(
  //             'info',
  //             'Phone no. should be 10 digit.',
  //             'info'
  //         )
  //         $("#txtPhone").addClass('border-theme');
  //         return;
  //     }
  // }
    if ($scope.objContact.Email == undefined || $scope.objContact.Email == "") {
        swal("info", "Please Enter Email.","info");
        $("#txtEmail1").addClass('border-theme');
        return; 
    }

    if($scope.objContact.Email != undefined || $scope.objContact.Email != ""){
      if($scope.valid($scope.objContact.Email)){
          swal(
              'info',
              'Check Your Registered Email.',
              'info'
          )
          $("#txtEmail1").addClass('border-theme');
          return;
        }
    }

    if($scope.emailCheck == true){
      swal('info','Email already exists.','info');
      $("#txtEmail1").addClass('border-theme');
          return;
    }

    if ($scope.objContact.Account.Name == undefined || $scope.objContact.Account.Name == "") {
      swal("info", "Please Enter Institution / Organisation Name.","info");
      $("#txtInstitiute").addClass('border-theme');
      return; 
    }

    if ($scope.objContact.Department == undefined || $scope.objContact.Department == "") {
        swal("info", "Please Enter Department.","info");
        $("#txtDepartment").addClass('border-theme');
        return; 
    }

    if ($scope.objContact.Designation__c == undefined || $scope.objContact.Designation__c == "") {
      swal("info", "Please Enter Designation.","info");
      $("#txtDesignation").addClass('border-theme');
      return; 
    }

    if ($scope.MailingStreet1 == undefined || $scope.MailingStreet1 == "") {
        swal("info", "Please Enter Line 1.","info");
        $("#txtStreet").addClass('border-theme');
        return; 
    }

    if ($scope.objContact.MailingCity == undefined || $scope.objContact.MailingCity == "") {
        swal("info", "Please Enter City.","info");
        $("#txtCity").addClass('border-theme');
        return; 
    }

    if ($scope.objContact.MailingCountry == undefined || $scope.objContact.MailingCountry == "") {
      swal("info", "Please Enter Country.","info");
      $("#txtCountry").addClass('border-theme');
      return; 
    }

    if ($scope.objContact.MailingState == undefined || $scope.objContact.MailingState == "") {
        swal("info", "Please Enter State.","info");
        $("#txtState").addClass('border-theme');
        return; 
    }

    if ($scope.objContact.MailingPostalCode == undefined || $scope.objContact.MailingPostalCode == "") {
        swal("info", "Please Enter Pin code.","info");
        $("#txtPincode").addClass('border-theme');
        return; 
    }else{
    }

    if($scope.MailingStreet2 == undefined || $scope.MailingStreet2 == ""){
      $scope.objContact.MailingStreet = $scope.MailingStreet1;
  }else if($scope.MailingStreet2 != undefined){
      $scope.objContact.MailingStreet = $scope.MailingStreet1+','+$scope.MailingStreet2;  
  }
  
  //By Ajai
   // $scope.objContact.MailingStreet = $scope.MailingStreet1+','+$scope.MailingStreet2; 
   
    $scope.objContact['State__c'] = $scope.objContact['MailingState'];

      if($scope.objContact.Uploaded__c == false){
        swal('info','Please upload image.','info');
        return;  
      }
        delete $scope.objContact.Birthdate;
        delete ($scope.objContact['stateList']);
        delete ($scope.objContact['MailingStreet1']);
        delete ($scope.objContact['MailingStreet2']);

    debugger;
   
    if($rootScope.campaignId == undefined){
        $rootScope.campaignId = "";
    }

    $scope.accDet = $scope.objContact.Account;
    IndustrialFellowshipController.saveApplicantPortalWiser($scope.objContact,$scope.accDet,birthYear,birthMonth,birthDay, $rootScope.proposalId, function(result, event){
        debugger;
        if (event.status && result !=null) {
            $rootScope.projectId = result;
            console.log(result);
            // $scope.uploadFile('','','',51200,30720);
            swal({
                 title: "SUCCESS",
                 text:  'Applicant Details have been Saved Successfully.',
                 icon: "success",
               button: "ok!",
          });
          $scope.redirectPageURL('HostInfoApplicationPage');
            
          }
          else
          {
            swal({
              title: "ERROR",
              text: "Exception!",
              icon: "error",
              button: "ok!",
            });
          }
        
       
    });

  }

  $scope.checkPinCode = function(){
    debugger;
    if($scope.objContact.MailingCountry == "India"){
      if($scope.objContact.MailingPostalCode.length > 6){
        swal('info','For India, pin code should be 6 digit.','info');
        $("#txtPincode").addClass('border-theme');
      return;
      }
    }
  }

$scope.setLostValues=function(){
  if($scope.objContact.MailingCountry == 'India'){
    $scope.objContact.stateList = $scope.indianStates;
}else if($scope.objContact.MailingCountry == 'Germany'){
    $scope.objContact.stateList = $scope.germanStates;
}
$scope.objContact.Birthdate=$scope.orgDOB;
$scope.$apply();
}
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
                    $scope.uploadAttachment(type , userDocId, fileId);
                } else {
                  swal("info", "Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".","info");
                  $scope.setLostValues();
                  return;
                }
    
            }
            fileReader.onerror = function (e) {
              swal("info", "There was an error reading the file.  Please try again.","info");
              $scope.setLostValues();
                  return;
            }
            fileReader.onabort = function (e) {
              swal("info", "There was an error reading the file.  Please try again.","info");
              $scope.setLostValues();
                  return;
            }
    
            fileReader.readAsBinaryString(file);  //Read the body of the file
    
        } else {
          swal("info", "File must be under 500 kb in size.  Your file is too large.  Please try again.","info");
          $scope.setLostValues();
                  return;
            $scope.showSpinnereditProf = false;
        }
    } else {
      swal("info", "You must choose a file before trying to upload it","info");
      $scope.setLostValues();
        return;
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
                    $scope.getProjectdetils();
                        
                    }
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

    $scope.redirectPageURL = function(pageName){
        debugger;
        var link=document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href="#/"+pageName;
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

     $scope.validurl = function(value){
        if(value!=undefined){
             var x=value;
             var atpos = x.indexOf("www.");
             var dotpos = x.lastIndexOf(".");
            if (atpos>1 || dotpos<atpos+2 || dotpos+2>=x.length) {
                
                return true;
            }
            return false;
         }
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

      $scope.countryChange = function(val){
        debugger
        $scope.objContact.Country_Code__c=val;
    }

      $scope.removeClass=function(controlid){
        $("#"+controlid+"").removeClass('border-theme');
      }


      $scope.imageUpload = function(event){
        var files = event.target.files; //FileList object
        
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded; 
                reader.readAsDataURL(file);
        }
   }

   $scope.imageIsLoaded = function(e){
       $scope.$apply(function() {
           $scope.stepsModel.push(e.target.result);
       });
   }

   $scope.abc = function(){
    debugger;
   }

});

