

app.directive("ngFileSelect", function($scope,$rootScope, fileReader) {
    debugger;
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
angular.module('cp_app').controller('HostInfoApplication_Ctrl', function($scope,$rootScope, fileReader){
     $scope.objContact = {};
     $rootScope.projectId;
     $scope.docU={};
     $scope.objContact.stateList={};
     $scope.baseURL = window.location.origin;
     $scope.indianStates = [];
        $scope.germanStates = [];
        $scope.allSates;
     $scope.countryCode='+49 Germany';
    debugger;

     $scope.$on("fileProgress", function(e, progress) {
        $scope.progress = progress.loaded / progress.total;
      });
      $scope.reloadpage=function(){
        location.reload();
      }      
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
                $scope.allSates=result;
                $scope.indianStates = result.India;
                $scope.germanStates = result.Germany;
                debugger;
                $scope.$apply();
                }
            }
            $scope.getConRecord();
        }
        )  
    }
    $scope.getDependentPicklistValues();
     $scope.getConRecord = function(){
        debugger;
        ApplicantPortal_Contoller.getConForHostNationality($rootScope.candidateId, function(result,event){
            debugger;
            if(event.status && result){
                debugger;
                $scope.ConNationality = result;                
                $scope.$apply();
            }
            $scope.getContactHostInfo();
        })
     }
     

     $scope.createHostContact = function(){
      debugger;
      ApplicantPortal_Contoller.createHostContact($rootScope.contactId,$rootScope.projectId, function(result,event){
        debugger;
        if(event.status && result){
          debugger;
          $scope.hostId = result;
          if($scope.ConNationality == "India"){
            $scope.objContact = {"Id":$scope.hostId,"FirstName":"","MailingCountry":"Germany","Proposals__c":$scope.projectId};  
            $scope.objContact.stateList = $scope.allSates.Germany;  
        }else if($scope.ConNationality == "Germany"){
          $scope.objContact = {"Id":$scope.hostId,"FirstName":"","MailingCountry":"India","Proposals__c":$rootScope.projectId};
          $scope.objContact.stateList = $scope.allSates.India;
        }
          $scope.$apply();
        }
      })
     }

     $scope.getcampaigntype = function(){
        debugger;
        ApplicantPortal_Contoller.getcampaigntype($rootScope.candidateId, function(result,event){
            debugger;
            if(event.status && result != null){
                debugger;
                $scope.campaigntype = result;
                $scope.$apply();
            }            
        })
    }
    $scope.getcampaigntype();

     

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
          ApplicantPortal_Contoller.getContactUserDoc($scope.objContact.Id, function (result, event) {
              debugger
              console.log('result return onload :: ');
              console.log(result);
              if (event.status) {
                $scope.allDocs = result;
                if(result != undefined){
                  for(var i=0;i<$scope.allDocs.length;i++){
                    if($scope.allDocs[i].userDocument.Name == 'Profile Picture'){
                        $scope.docU=$scope.allDocs[i];
                    //     $scope.uploadFile(docU.userDocument.Name,docU.userDocument.Id,'');
                    }
                }
                }
                  $scope.$apply();
              }
          }, {
              escape: true
          })
        }
     //$scope.getProjectdetils();

     $scope.getContactHostInfo = function(){
          debugger;
          $scope.pairingDetails = [];
          IndustrialFellowshipController.getContactHostInfo($rootScope.contactId, function(result, event){
               debugger;
               console.log("RESULT ::",result);
               console.log("RESULT ::",event);
              if(event.status && (result !=null && angular.equals({}, result) == false)){
               $scope.objContact = result;
               if($scope.objContact.LastName == "hostaccABC"){
                $scope.objContact.LastName = "";
               }
               if($scope.objContact.Account.Name == "hostaccABC"){
                $scope.objContact.Account.Name = "";
               }
               if(result.MailingStreet != undefined && result.MailingStreet != ""){
                splitStreet = result.MailingStreet.split(",");
                $scope.MailingStreet1 = splitStreet[0];
                $scope.MailingStreet2 = splitStreet[1];
              }
              var allstatus=$scope.allSates;
               $scope.contactid = result.Id;
               if($scope.ConNationality == "India"){
                    $scope.objContact.MailingCountry = "Germany";
               }else if($scope.ConNationality == "Germany"){
                $scope.objContact.MailingCountry = "India";
               }
               if($scope.objContact.Profile_Pic_Attachment_Id__c != undefined){
                if($scope.objContact.Profile_Pic_Attachment_Id__c.length == 18){
                    $scope.objContact.Profile_Pic_Attachment_Id__c = $scope.objContact.Profile_Pic_Attachment_Id__c.slice(0, -3);
                }
            }
               $scope.doc = $scope.objContact.Profile_Pic_Attachment_Id__c;
               if($scope.objContact.MailingCountry == 'India'){
                    $scope.objContact.stateList = $scope.allSates.India;
                }else if($scope.objContact.MailingCountry == 'Germany'){
                    $scope.objContact.stateList = $scope.allSates.Germany; 
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
                
                $scope.$apply();
              }
              else{
                $scope.createHostContact();
              }
              if($scope.objContact.Attachments != undefined && $scope.objContact.Attachments.length > 0){
                $scope.doc = $scope.objContact.Profile_Pic_Attachment_Id__c;
                $scope.imageSrc = window.location.origin +'/ApplicantDashboard/servlet/servlet.FileDownload?file='+$scope.objContact.Profile_Pic_Attachment_Id__c;
                delete  $scope.objContact.Attachments;
            }
               $scope.nationality = $rootScope.nationality;
               $scope.country = $rootScope.country;               
               $scope.$apply();
          });
     };

     $scope.previousPage = function(){
        var link = document.createElement("a");
            link.id = 'someLink'; //give it an ID!
            link.href = '#/WiserApplicationPage';
            link.click();

     }

     $scope.saveApplicationPortalHostInformation = function(){
        
          debugger;
          if($scope.objContact.Salutation == undefined || $scope.objContact.Salutation == ""){
            swal("info", "Please Enter Salutation.","info");
            $("#salutation").addClass('border-theme');
            return;
          }
          if($scope.objContact.FirstName == undefined || $scope.objContact.FirstName == ""){
            swal("info", "Please Enter First Name.","info");
            $("#txtFirstName").addClass('border-theme');
            return;
          }

          if($scope.objContact.LastName == undefined || $scope.objContact.LastName == ""){
            swal("info", "Please Enter Last Name.","info");
            $("#txtLastName").addClass('border-theme');
            return;
          }

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

        if($scope.objContact.MailingCountry == "India"){
          if ($scope.objContact.Phone == undefined || $scope.objContact.Phone == "") {
            swal("info", "Please Enter Phone No.","info");
            $("#txtPhoneI").addClass('border-theme');
            return; 
        }
        }else if($scope.objContact.MailingCountry == "Germany"){
          if ($scope.objContact.Phone == undefined || $scope.objContact.Phone == "") {
            swal("info", "Please Enter Phone No.","info");
            $("#txtPhoneG").addClass('border-theme');
            return; 
        }
        }

        if($scope.objContact.Phone != undefined && $scope.objContact.Phone != "" && $scope.objContact.MailingCountry == "India"){
          if($scope.objContact.Phone.length < 10){
              swal(
                  'info',
                  'Phone no. should be 10 digit.',
                  'info'
              )
              $("#txtPhoneI").addClass('border-theme');
              return;
          }
      }

    //   if ($scope.objContact.Email == undefined || $scope.objContact.Email == "") {
    //     swal("info", "Please Enter Email.","info");
    //     $("#txtEmail1").addClass('border-theme');
    //     return; 
    // }

  //   if($scope.objContact.Email != undefined || $scope.objContact.Email != ""){
  //     if($scope.valid($scope.objContact.Email)){
  //         swal(
  //             'info',
  //             'Check Your Registered Email.',
  //             'info'
  //         )
  //         $("#txtEmail1").addClass('border-theme');
  //         return;
  //     }
  // }

  // if($scope.emailCheck == true){
  //     swal('info','Email already exists.','info');
  //     $("#txtEmail1").addClass('border-theme');
  //         return;
  //   }

      if ($scope.objContact.Account.Name == undefined || $scope.objContact.Account.Name == "") {
        swal("info", "Please Enter Institute.","info");
        $("#txtInstitution").addClass('border-theme');
        return; 
    }

          if ($scope.objContact.Designation__c == undefined || $scope.objContact.Designation__c == "") {
            swal("info", "Please Enter Designation.","info");
            $("#txtDesignation").addClass('border-theme');
            return; 
        }
    
        if ($scope.objContact.Department == undefined || $scope.objContact.Department == "") {
            swal("info", "Please Enter Department.","info");
            $("#txtDepartment").addClass('border-theme');
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

        if($scope.objContact.MailingCountry == undefined || $scope.objContact.MailingCountry == "") {
          swal("info", "Please Enter Country.","info");
          $("#txtFirsttxtCountryName").addClass('border-theme');
          return; 
      }
    
        if ($scope.objContact.MailingState == undefined || $scope.objContact.MailingState == "") {
            swal("info", "Please Enter State.","info");
            $("#txtState").addClass('border-theme');
            return; 
        }

        if (($scope.objContact.MailingPostalCode == undefined || $scope.objContact.MailingPostalCode == "") && $scope.objContact.MailingCountry == "India") {
            swal("info", "Please Enter Pin code.","info");
            $("#txtPinCodeI").addClass('border-theme');
            return; 
        }else{
            if($scope.objContact.MailingPostalCode != undefined && $scope.objContact.MailingCountry == "India"){
                if($scope.objContact.MailingPostalCode.length != 6){
                    swal('info','For India, pin code should be 6 digit.','info');
                    $("#txtPinCodeI").addClass('border-theme');
                  return;
            }
          }
        }

        if (($scope.objContact.MailingPostalCode == undefined || $scope.objContact.MailingPostalCode == "") && $scope.objContact.MailingCountry == "Germany") {
          swal("info", "Please Enter Pin code.","info");
          $("#txtPinCodeG").addClass('border-theme');
          return; 
      }
    
        // if($scope.objContact.Homepage_URL__c != undefined || $scope.objContact.Homepage_URL__c != ""){
        //     if($scope.validurl($scope.objContact.Homepage_URL__c)){
        //         swal(
        //             'info',
        //             'Check Your Homepage url.',
        //             'info'
        //         )
        //         $("#txtHomePage").addClass('border-theme');
        //         return;
        //     }
        // }

      //   var file;
      //   file = document.getElementById("profilePic").files[0];
      //   if(file != undefined){
      //     fileName = file.name;
      //     var typeOfFile = fileName.split(".");
      //     debugger;
      //     if(typeOfFile[1] == "jpg" || typeOfFile[1] == "jpeg"){
              
      //     }else{
      //         debugger;
              
      //         swal('info','Please choose jpg/jpeg file only.','info');
      //         debugger;
      //         return;
      //     }
      // }

      if($scope.MailingStreet2 == undefined || $scope.MailingStreet2 == ""){
        $scope.objContact.MailingStreet = $scope.MailingStreet1;
    }else if($scope.MailingStreet2 != undefined){
        $scope.objContact.MailingStreet = $scope.MailingStreet1+';'+$scope.MailingStreet2;  
    }
    //By Ajai
     // $scope.objContact.MailingStreet = $scope.MailingStreet1+';'+$scope.MailingStreet2; 

          $scope.objContact['State__c'] = $scope.objContact['MailingState'];
          delete ($scope.objContact['stateList']);
          delete ($scope.objContact['Contact__c']);
         
          $scope.accDet = $scope.objContact.Account
          delete($scope.objContact.Account);
          IndustrialFellowshipController.saveApplicationPortalHostInformation($scope.objContact,$scope.accDet,$rootScope.projectId,'Academia', function(result,event){
               debugger;
               console.log("Result IN saveApplicationPortalHostInformation ::",result);
               if(event.status){
                    // $scope.contactid = result;
                    // $scope.uploadFile('','','',51200,30720);                    
                    swal({
                         title: "SUCCESS",
                         text: 'Pair Information details have been saved successfully.',
                         icon: "success",
                         button: "ok!",
                    })  
                    $scope.redirectPageURL('FinancialOverview_wiser');                  
                  //  window.location.replace(window.location.origin+'/ApplicantDashboard/ApplicantPortal?id='+$rootScope.userId+'#/HostProjectDetails');
                    // window.location.replace(window.location.origin+'/ApplicantDashboard/ApplicantPortal?id='+$rootScope.userId+'#/FinancialOverview_wiser');
                  
               } else{
                    swal({
                         title: "ERROR",
                         text: "Exception !",
                         icon: "error",
                         button: "ok!",
                    });
               }
          });
     }

     $scope.countryChange = function(val){
      debugger
      $scope.objContact.Country_Code__c=val;
  }

     $scope.checkPinCode = function(){
      debugger;
      if($scope.objContact.MailingCountry == "India"){
        if($scope.objContact.MailingPostalCode.length > 6){
          swal('info','For India, pin code should be 6 digit.','info');
          $("#txtPinCode").addClass('border-theme');
        return;
        }
      }
    }
    //  $scope.getContactHostInfo();
    $scope.setLostValues=function(){
        if($scope.objContact.MailingCountry == 'India'){
          $scope.objContact.stateList = $scope.indianStates;
      }else if($scope.objContact.MailingCountry == 'Germany'){
          $scope.objContact.stateList = $scope.germanStates;
      }
      $scope.$apply();
      }
    $scope.uploadFile = function (type, userDocId, fileId,fileSizeFun,fileSizeMin) {
        debugger;if($scope.hostId != undefined && $scope.hostId != ""){
          $scope.contId = $scope.hostId;
        }else{
          $scope.contId = $scope.contactid;
        }
        maxFileSize=fileSizeFun;
        // if(userDocId == )
        $scope.showSpinnereditProf = true;
        var file;
        
            file = document.getElementById("profilePic").files[0];
            // if($scope.doc!=undefined && file == undefined){
            //     swal(
            //       'success',
            //       'Host Information has been saved successfully!',
            //       'success'
            //   );
            //   var link = document.createElement("a");
            //           link.id = 'someLink'; //give it an ID!
            //           link.href = '#/ProjectDetailsInWiserPage';
            //           link.click();
            //           return;
            //   }
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
                var maxStringSize= 6000000;
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
            $scope.contId,attachmentBody, attachmentName,
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
                        )
                        $scope.getProjectdetils();
                        //$scope.doc.Id = result;
            //             var link = document.createElement("a");
            // link.id = 'someLink'; //give it an ID!
            // link.href = '#/ProjectDetailsInWiserPage';
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

        //  $scope.checkEmail = function(email,contId){
        //     debugger;
        //     $scope.emailCheck = false;
        //     if(contId == undefined){
        //       contId = "";
        //     }
        //     ApplicantPortal_Contoller.checkEmail(email,contId,function(result,event){
        //       debugger;
        //       if(event.status){
        //         debugger;
        //         if(result.length > 0){
        //           $scope.emailCheck = true;
        //         }else{
        //           $scope.emailCheck = false;
        //         }
        //         $scope.$apply();
        //       }
        //     })
      
        //   }
    
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
});
// image upload

