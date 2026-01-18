angular.module('cp_app').controller('personalInfo_ctrl', function($scope,$rootScope){

    debugger;
    $scope.siteURL = siteURL;
    $rootScope.projectId;
    $scope.birthdate;
    $rootScope.contactId;
    $scope.baseURL = window.location.origin;
    $scope.showSpinnereditProf = false;
    var maxFileSize = 4350000;
    var chunkSize = 950000;
    var attachment;
    var attachmentName;
    var fileSize;
    
    // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
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
                $scope.getPersonalInformation();
                debugger;
                $scope.$apply();
            }
        }
        )  
    }
    $scope.getDependentPicklistValues();

    $scope.onCountryChange = function(){
        debugger;
        
                if($scope.applicantDetails.MailingCountry == 'India'){
                    $scope.applicantDetails.stateList = $scope.indianStates;
                }else if($scope.applicantDetails.MailingCountry == 'Germany'){
                    $scope.applicantDetails.stateList = $scope.germanStates;
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
      $scope.countryChange = function(val){
        debugger
        $scope.applicantDetails.Country_Code__c=val;
    }
    $scope.getPersonalInformation = function(){
        debugger;
        ApplicantPortal_Contoller.getPersonalInformation($rootScope.candidateId, function (result, event){
            debugger;
            if(event.status){
                debugger;
                if(result != null){
                    if(result.Birthdate != null){
                        $scope.birthdate = new Date(result.Birthdate);
                    }
                    if(result.Name != undefined || result.Name != ''){
                      result.Name = result.Name ? result.Name.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.Name;  
                    }
                    if(result.MailingStreet != undefined || result.MailingStreet != ''){
                      result.MailingStreet = result.MailingStreet ? result.MailingStreet.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.MailingStreet;  
                    }
                    if(result.MailingCity != undefined || result.MailingCity != ''){
                      result.MailingCity = result.MailingCity ? result.MailingCity.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.MailingCity;  
                    }

                    if(result.MailingStreet != undefined && result.MailingStreet != ""){
                        splitStreet = result.MailingStreet.split(";");
                        $scope.MailingStreet1 = splitStreet[0];
                        $scope.MailingStreet2 = splitStreet[1];
                      }

                    $scope.applicantDetails = result;

                    if(result.Account.Name != undefined || result.Account.Name != ''){
                      $scope.applicantDetails.Account.Name = $scope.applicantDetails.Account.Name ? $scope.applicantDetails.Account.Name.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.applicantDetails.Account.Name;  
                    }

                    if(result.Designation__c != undefined || result.Designation__c != ''){
                      $scope.applicantDetails.Designation__c = $scope.applicantDetails.Designation__c ? $scope.applicantDetails.Designation__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.applicantDetails.Designation__c;  
                    }

                    if($scope.applicantDetails.MailingCountry == 'India'){
                        $scope.applicantDetails.stateList = $scope.indianStates;
                    }else if($scope.applicantDetails.MailingCountry == 'Germany'){
                        $scope.applicantDetails.stateList = $scope.germanStates; 
                    }
                    if($scope.applicantDetails.Attachments != undefined && $scope.applicantDetails.Attachments.length > 0){
                        $scope.doc = $scope.applicantDetails.Attachments[0];
                        $scope.imageSrc = window.location.origin +'/ApplicantDashboard/servlet/servlet.FileDownload?file='+$scope.applicantDetails.Profile_Pic_Attachment_Id__c;
                        delete  $scope.applicantDetails.Attachments;
                    }                    
                }
                $scope.$apply();
              //   if($scope.applicantDetails.Country_Code__c!=undefined){
              //     if($scope.applicantDetails.Country_Code__c=='49')
              //     $('#country-field').text('+49 Germany');
              //     else
              //     $('#country-field').text('+91 India');
              // }
              // else
              // $('#country-field').text('--Country Code--');
            }
        },
        {escape: true}
        )
    }
    

    $scope.redirectPageURL = function(pageName){
        debugger;
        var link=document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href="#/"+pageName;
        link.click();
    }
    
    $scope.submitDet = function(){
        debugger;
        var  birthyear=0;
        var birthmonth=0;
        var birthday=0;
      if($scope.birthdate!=undefined && $scope.birthdate!=''){
        birthyear = $scope.birthdate.getUTCFullYear();
        birthmonth = $scope.birthdate.getUTCMonth()+1;
        birthday = $scope.birthdate.getDate();
      }
    //   var age = moment().diff(''+birthyear+'-'+birthmonth+'-'+birthday+'', 'years');
    //   if(age>35){
    //     swal("Personal Info", "Age can not be more than 35 years", "info");
    //     return;
    //   }
    // if($scope.applicantDetails.Country_Code__c == undefined){
    //   swal("Personal Info", "Please select country code.");
    //   $("#btnCountryCode").addClass('border-theme');
    //     return;
    // }
    if($scope.applicantDetails.Name == undefined || $scope.applicantDetails.Name == ""){
        swal("Personal Info", "Please Enter Full Name.");
        $("#txtFirstName").addClass('border-theme');
          return;
    }
    if($scope.birthdate == undefined || $scope.birthdate == ""){
        swal("Personal Info", "Please Enter BirthDate.");
        $("#txtDOB").addClass('border-theme');
            return;
    }
    if($scope.applicantDetails.Gender__c == undefined || $scope.applicantDetails.Gender__c == ""){
        swal("Personal Info", "Please Enter your Gender.");
        $("#txtGender").addClass('border-theme');
            return;
    }
    if($scope.applicantDetails.Nationality__c == undefined || $scope.applicantDetails.Nationality__c == ""){
        swal("Personal Info", "Please Enter your Nationality.");
        $("#selectNatinality").addClass('border-theme');
            return;
    }
    if($scope.applicantDetails.Email == undefined || $scope.applicantDetails.Email == ""){
        swal("Personal Info", "Please Enter Email.");
        $("#txtEmail").addClass('border-theme');
            return;
    }
    if($scope.applicantDetails.MobilePhone == undefined || $scope.applicantDetails.MobilePhone == ""){
        swal("Personal Info", "Please Enter Mobile No.");
        $("#txtPhone").addClass('border-theme');
            return;
    }

    if($scope.applicantDetails.MobilePhone != undefined && $scope.applicantDetails.MobilePhone != "" && $scope.applicantDetails.MailingCountry == "India"){
        if($scope.applicantDetails.MobilePhone.length < 10){
            swal(
                'info',
                'Mobile No. should be 10 digit.',
                'info'
            )
            $("#txtPhone").addClass('border-theme');
            return;
        }
    }

    if($scope.applicantDetails.Account.Name == undefined || $scope.applicantDetails.Account.Name == ""){
        swal("Personal Info", "Please Enter Institution Name.");
        $("#txtOrg").addClass('border-theme');
            return;
    }
    if($scope.applicantDetails.Designation__c == undefined || $scope.applicantDetails.Designation__c == ""){
        swal("Personal Info", "Please Enter your Designation.");
        $("#txtDesignation").addClass('border-theme');
            return;
    }
    if($scope.emailCheck == true){
        swal('info','Email already exists.','info');
        $("#txtEmail").addClass('border-theme');
            return;
    }
    if ($scope.MailingStreet1 == undefined || $scope.MailingStreet1 == "") {
        swal("info", "Please Enter Line 1.","info");
        $("#txtMailingL1").addClass('border-theme');
        return; 
    }

    if($scope.applicantDetails.MailingCountry != undefined && $scope.applicantDetails.MailingCountry == "India"){
        if($scope.applicantDetails.MailingPostalCode != undefined){
            if($scope.applicantDetails.MailingPostalCode.length != 6){
                swal('info','For India, pin code should be 6 digit.','info');
                $("#txtMailingPincode").addClass('border-theme');
              return;
            }
        }
      }
    
    if($scope.MailingStreet2 == undefined || $scope.MailingStreet2 == ""){
        $scope.applicantDetails.MailingStreet = $scope.MailingStreet1;
    }else if($scope.MailingStreet2 != undefined){
        $scope.applicantDetails.MailingStreet = $scope.MailingStreet1+';'+$scope.MailingStreet2;  
    }

    if($scope.applicantDetails.Uploaded__c == false){
        swal('info','Please upload image.','info');
        return;  
      }
    $scope.applicantDetails['State__c'] = $scope.applicantDetails['MailingState'];
     
      delete ($scope.birthdate);
      delete ($scope.applicantDetails['stateList']);
      delete ($scope.MailingStreet1);
      delete ($scope.MailingStreet2);

      ApplicantPortal_Contoller.insertPersonalInfo($scope.applicantDetails,birthday,birthmonth,birthyear, function (result, event){
        debugger;   
        if(event.status && result != null) {
                debugger;
                swal({
                  title: "Personal Information",
                  text: 'Your Personal Information have been successfully saved.',
                  icon: "success",
                  button: "ok!",
                }).then((value) => {
                    $scope.redirectPageURL('ParentOrganization');
                    });
                // Swal.fire(
                //     'SUCCESS',
                //     'Your Personal Information has been saved successfully.',
                //     'success'
                // );
                // $scope.redirectPageURL('Education_Qualification');
                // $scope.$apply();
        }
        else
              {
                swal({
                  title: "Personal Information",
                  text: "Exception!",
                  icon: "error",
                  button: "ok!",
                });
              }
        },
        {escape: true}
        )
    }
    
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
            // if($scope.doc!=undefined && file == undefined){
            //   swal(
            //     'success',
            //     'Applicant Detail has been Saved Successfully!',
            //     'success'
            // );
            // var link = document.createElement("a");
            //         link.id = 'someLink'; //give it an ID!
            //         link.href = '#/HostInfoApplicationPage';
            //         link.click();
            //         return;
            // }
            // if(file == undefined){
            //   swal('info','Please select profile pic.','info');
            //   $scope.setLostValues();
            //     return;
            // }
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
                      $scope.applicantDetails.Uploaded__c = true;
                        swal(
                            'success',
                            'Uploaded successfully.',
                            'success'
                        );
                        $scope.getProjectdetils();
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

        $scope.removeClass=function(controlid){
            $("#"+controlid+"").removeClass('border-theme');
          }

          $scope.checkPinCode = function(){
            debugger;
            if($scope.applicantDetails.MailingCountry == "India"){
              if($scope.applicantDetails.MailingPostalCode.length > 6){
                swal('info','For India, pin code should be 6 digit.','info');
                $("#txtMailingPincode").addClass('border-theme');
              return;
              }
            }
          }

    // $scope.uploadAttachment = function (type, userDocId, fileId) {
    //     debugger;
    //     var attachmentBody = "";
    //     if (fileId == undefined) {
    //         fileId = " ";
    //     }
    //     if (fileSize <= positionIndex + chunkSize) {
    //         debugger;
    //         attachmentBody = attachment.substring(positionIndex);
    //         doneUploading = true;
    //     } else {
    //         attachmentBody = attachment.substring(positionIndex, positionIndex + chunkSize);
    //     }
    //     console.log("Uploading " + attachmentBody.length + " chars of " + fileSize);
    //     ApplicantPortal_Contoller.doCUploadProfilePic(
    //         attachmentBody, attachmentName,fileId, userDocId, 
    //         function (result, event) {
    //             console.log(result);
    //             if (event.type === 'exception') {
    //                 console.log("exception");
    //                 console.log(event);
    //             } else if (event.status) {
    //                 if (doneUploading == true) {
    //                     Swal.fire(
    //                         '',
    //                         'Uploaded Successfully!',
    //                         'success'
    //                     )
    //                     $scope.updateContactProfilePicId(userDocId,result);

    //                     $scope.showUplaodUserDoc = false;
    //                    // $scope.getCandidateDetails();

    //                 } else {
    //                     debugger;
    //                     positionIndex += chunkSize;
    //                     $scope.uploadAttachment(type,userDocId,result);
    //                 }
    //             } else {
    //                 console.log(event.message);
    //             }
    //         },


    //         { buffer: true, escape: true, timeout: 120000 }
    //     );
    // }
});
app.directive("ngFileSelect", function(fileReader, $timeout) {
    return {
      scope: {
        ngModel: '='
      },
      link: function($scope, el) {
        function getFile(file) {
          fileReader.readAsDataUrl(file, $scope)
            .then(function(result) {
              $timeout(function() {
                $scope.ngModel = result;
              });
            });
        }

        el.bind("change", function(e) {
          var file = (e.srcElement || e.target).files[0];
          getFile(file);
        });
      }
    };
  });

app.factory("fileReader", function($q, $log) {
  var onLoad = function(reader, deferred, scope) {
    return function() {
      scope.$apply(function() {
        deferred.resolve(reader.result);
      });
    };
  };

  var onError = function(reader, deferred, scope) {
    return function() {
      scope.$apply(function() {
        deferred.reject(reader.result);
      });
    };
  };

  var onProgress = function(reader, scope) {
    return function(event) {
      scope.$broadcast("fileProgress", {
        total: event.total,
        loaded: event.loaded
      });
    };
  };

  var getReader = function(deferred, scope) {
    var reader = new FileReader();
    reader.onload = onLoad(reader, deferred, scope);
    reader.onerror = onError(reader, deferred, scope);
    reader.onprogress = onProgress(reader, scope);
    return reader;
  };

  var readAsDataURL = function(file, scope) {
    var deferred = $q.defer();

    var reader = getReader(deferred, scope);
    reader.readAsDataURL(file);

    return deferred.promise;
  };

  return {
    readAsDataUrl: readAsDataURL
  };
});

app.directive('wrapIntlTelInput', function ($timeout) {
  return {
    restrict: 'A',
    require: '^ngModel',
    link: link
  };

  ////////////////////////////////////////////////////////////

  function link (scope, elem, attrs, ctrl) {
    hookFieldIntoIntlTelInputJqueryPlugin();
    hookFieldIntoJqueryChangeEvent();

    ctrl.$parsers.push(validateFieldAndFormatModelValue);

    elem.on('blur keyup change', applyRenderWhenChange);
    elem.on('$destroy', function () {
      elem.off('blur keyup change');
    });

    $timeout(applyMaskingWhenInitWithPresetPhoneNumber);

    ////////////

    function hookFieldIntoIntlTelInputJqueryPlugin () {
      elem.intlTelInput({
        autoFormat: false,
        autoHideDialCode: true,
        autoPlaceholder: false,
        defaultCountry: 'us',
        nationalMode: true,
        numberType: '',
        preferredCountries: ['us', 'ca', 'gb', 'au'],
        responsiveDropdown: false,
        utilsScript: ''
      });
    }

    function hookFieldIntoJqueryChangeEvent () {
      elem.change(reformatPhoneNumberWithCountryCode);
    }

    function reformatPhoneNumberWithCountryCode () {
      ctrl.$$parseAndValidate();
    }

    function validateFieldAndFormatModelValue (value) {
      var parsedValue = elem.intlTelInput('getNumber') || value;
      var formattedModelValue = removeInvalidInput(parsedValue);
      ctrl.$setValidity('invalidIntlTel', elem.intlTelInput('isValidNumber'));
      return formattedModelValue;

      ////////////
      
      function removeInvalidInput (input) {
        return input ? input.replace(/(?!^\+?)[^0-9]/g, '') : '';
      }
    }

    function applyMaskingWhenInitWithPresetPhoneNumber () {
      if (elem.val()) {
        elem.intlTelInput('setNumber', elem.val());
        applyRenderWhenChange();
      }
    }

    function applyRenderWhenChange () {
      scope.$apply(function () {
        return ctrl.$setViewValue(elem.val());
      });
    }
  }
});