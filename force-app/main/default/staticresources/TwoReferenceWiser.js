angular.module('cp_app').controller('twoReferencePageCtrl', function ($scope, $rootScope) {
     debugger;
     $rootScope.userId;
     $rootScope.conId;
     $rootScope.projectId;
     $scope.ParticipantList = [];
     $rootScope.userId;
     $scope.listOfIds = [];
     var mapForIndex = new Map();
     var indexNum;
     $scope.objContact;;
     $scope.proposalStage = false; // Initialize proposal stage
     $scope.isCurrentUserSubmitted = false; // Initialize applicant submission status

     debugger;

     // Fetching the proposalId from Local Storage
     if (localStorage.getItem('proposalId')) {
          $rootScope.proposalId = localStorage.getItem('proposalId');
          console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
     }

     if (localStorage.getItem('apaId')) {
          $rootScope.apaId = localStorage.getItem('apaId');
          console.log('Loaded proposalId from localStorage:', $rootScope.apaId);
     }

     if (localStorage.getItem('signatoryAPAId')) {
          $rootScope.signatoryAPAId = localStorage.getItem('signatoryAPAId');
          console.log('Loaded signatoryAPAId from localStorage:', $rootScope.signatoryAPAId);
     }

     // Fetching the accountId and accName from Local Storage, assigned on WiserApplicationPage.js
     if (localStorage.getItem('accountId')) {
          $rootScope.accountId = localStorage.getItem('accountId');
          console.log('Loaded accountId from localStorage:', $rootScope.accountId);
     }

     if (localStorage.getItem('accountName')) {
          $rootScope.accountName = localStorage.getItem('accountName');
          console.log('Loaded accountName from localStorage:', $rootScope.accountName);
     }

     // Fetching the hashCode for current user identification
     if (localStorage.getItem('hashCode')) {
          $rootScope.hashCode = localStorage.getItem('hashCode');
          console.log('Loaded hashCode from localStorage:', $rootScope.hashCode);
     }

     function getKeyByValue(object, value) {
          return Object.keys(object).find(key => object[key] === value);
     }

     var map = { "first": "1", "second": "2" };
     console.log(getKeyByValue(map, "2"));

     // $scope.getApplicantStatusFromAPA = function () {
     //      debugger;
     //      ApplicantPortal_Contoller.fetchApplicantStatus($rootScope.apaId, function (result, event) {
     //           debugger;

     //           console.log('result return onload :: ');
     //           console.log(result);
     //           console.log('event:', event);

     //           if (event.status) {
     //                $rootScope.isCurrentUserSubmitted = result;
     //                $scope.isCurrentUserSubmitted = result;
     //                // Only set CKEditor to read-only if the applicant has actually submitted
     //                CKEDITOR.config.readOnly = result === true;
     //           } else {
     //                console.log('Error in fetchApplicantStatus:', event.message);
     //                // On error, default to false (not submitted)
     //                $rootScope.isCurrentUserSubmitted = false;
     //                $scope.isCurrentUserSubmitted = false;
     //                CKEDITOR.config.readOnly = false;
     //           }
     //      }, {
     //           escape: true
     //      });
     // }
     // $scope.getApplicantStatusFromAPA();

     $scope.getProposalStage = function () {
          debugger;
          if ($rootScope.apaId && $rootScope.proposalId) {
               ApplicantPortal_Contoller.getProposalStageUsingProposalId($rootScope.proposalId, $rootScope.apaId, function (result, event) {
                    debugger;
                    if (event.status && result) {
                         $scope.proposalStage = (result.proposalStage != 'Draft' && result.proposalStage != null && result.proposalStage != undefined);
                         $rootScope.proposalStage = $scope.proposalStage;
                         $scope.$apply();
                    }
               }, { escape: true });
          }
     }
     $scope.getProposalStage();

     $scope.checkEmail = function () {
          $scope.emailList = [];
          $scope.uppercaseEmailList = [];
          debugger;
          $scope.emailCheck = false;

          for (var i = 0; i < $scope.ParticipantList.length; i++) {
               if ($scope.ParticipantList[i].Name == undefined || $scope.ParticipantList[i].Name == "") {
                    swal("Info", "Please Enter Reference name.", "info");
                    $("#name" + i + "").addClass('border-theme');
                    return;
               }
               if ($scope.ParticipantList[i].Designation__c == undefined || $scope.ParticipantList[i].Designation__c == "") {
                    swal("Info", "Please Enter Designation.", "info");
                    $("#designation" + i + "").addClass('border-theme');
                    return;
               }
               if ($scope.ParticipantList[i].Organisation_Institute__c == undefined || $scope.ParticipantList[i].Organisation_Institute__c == "") {
                    swal("Info", "Please Enter Organisation/Institute.", "info");
                    $("#organisation" + i + "").addClass('border-theme');
                    return;
               }
               if ($scope.ParticipantList[i].Email__c == undefined || $scope.ParticipantList[i].Email__c == "") {
                    swal("Info", "Please Enter Email.", "info");
                    $("#email" + i + "").addClass('border-theme');
                    return;
               } else {
                    if ($scope.valid($scope.ParticipantList[i].Email__c)) {
                         swal(
                              'Info',
                              'Check Your Registered Email!',
                              'info'
                         )
                         $("#email" + i + "").addClass('border-theme');
                         return;
                    }
               }
          }


          for (var i = 0; i < $scope.ParticipantList.length; i++) {
               if ($scope.emailList.indexOf($scope.ParticipantList[i].Email__c) != -1) {
                    swal("Info", "DUPLICATE Reference Email, Please check.", "info");
                    $("#email" + i + "").addClass('border-theme');
                    return;
               }
               else {
                    $scope.emailList.push($scope.ParticipantList[i].Email__c);
               }
               if ($scope.ParticipantList[i].Id != undefined) {
                    $scope.listOfIds.push($scope.ParticipantList[i].Id);
               }
          }

          for (var i = 0; i < $scope.ParticipantList.length; i++) {
               if ($scope.ParticipantList[i].Email__c != undefined || $scope.ParticipantList[i].Email__c != "") {
                    $scope.uppercaseEmailList.push($scope.ParticipantList[i].Email__c.toUpperCase());
                    if (!mapForIndex.has($scope.ParticipantList[i].Email__c.toUpperCase())) {
                         mapForIndex.set($scope.ParticipantList[i].Email__c.toUpperCase(), i);
                    } else {
                         indexNum = parseInt(mapForIndex.get($scope.ParticipantList[i].Email__c.toUpperCase()));
                    }
               }
          }

          for (var j = 0; j < $scope.uppercaseEmailList.length; j++) {
               if ($scope.uppercaseEmailList.indexOf($scope.uppercaseEmailList[j].toUpperCase()) == -1) {
                    swal("Info", "DUPLICATE Reference Email, Please check.", "info");
                    //  var indexNo = getKeyByValue(mapForIndex,$scope.uppercaseEmailList[j].toUpperCase());
                    $("#email" + indexNum + "").addClass('border-theme');
                    return;
               }
          }
          ApplicantPortal_Contoller.checkReferenceEmail($scope.emailList, $scope.listOfIds, function (result, event) {
               debugger;
               debugger;
               if (event.status) {
                    debugger;
                    if (result.length > 0) {
                         $scope.emailCheck = true;
                    } else {
                         $scope.emailCheck = false;
                    }
                    $scope.saveParticipants();
                    $scope.$apply();
               }
          })

     }

     $scope.getTwoReferenceDetailsWiser = function () {
          // ApplicantPortal_Contoller.getProposalDetailsReferences($rootScope.projectId, function(result, event){
          ApplicantPortal_Contoller.getProposalDetailsReferences($rootScope.proposalId, $rootScope.apaId, function (result, event) {
               debugger;
               if (event.status && result != null) {
                    if (result.length == 0) {
                         $scope.ParticipantList = [{ "Name": "", "Designation__c": "", "Organisation_Institute__c": "", "Phone__c": "", "Email__c": "", "Proposals__c": $rootScope.projectId }]
                    } else {
                         for (var i = 0; i < result.length; i++) {
                              if (result[i].Name != undefined || result[i].Name != '') {
                                   result[i].Name = result[i].Name ? result[i].Name.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].Name;
                              }
                              if (result[i].Designation__c != undefined || result[i].Designation__c != '') {
                                   result[i].Designation__c = result[i].Designation__c ? result[i].Designation__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].Designation__c;
                              }
                              if (result[i].Organisation_Institute__c != undefined || result[i].Organisation_Institute__c != '') {
                                   result[i].Organisation_Institute__c = result[i].Organisation_Institute__c ? result[i].Organisation_Institute__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].Organisation_Institute__c;
                              }
                         }
                         $scope.ParticipantList = result;
                    }
                    $scope.$apply();
               }
          },
               { escape: true }
          )
     }
     $scope.getTwoReferenceDetailsWiser();

     $scope.addRowsWorkPackage = function () {
          debugger;

          // if($scope.ParticipantList.length > 1){
          //      swal("Error", "Only two Reference Allowed");
          //      return;
          // }else{
          $scope.ParticipantList.push({
               "Name": "",
               "Designation__c": "",
               "Organisation_Institute__c": "",
               "Phone__c": "",
               "Email__c": "",
               "Proposals__c": $rootScope.projectId
          });
          // }

     }

     $scope.previousPage = function () {
          $scope.redirectPageURL('ExistingGrantWISER');
          // window.location.replace(window.location.origin+'/ApplicantDashboard/ApplicantPortal?id='+$rootScope.userId+'#/HostProjectDetails');
     }

     $scope.deleteRowsWorkPackage = function (index) {
          debugger;
          if ($scope.ParticipantList.length > 0) {
               if ($scope.ParticipantList[index].Id != undefined) {
                    ApplicantPortal_Contoller.deleteParticipantsReferences($scope.ParticipantList[index].Id, function (result, event) {
                         if (event.status) {
                              $scope.ParticipantList.splice(index, 1);
                              swal({
                                   title: "Details Deleted",
                                   text: 'Your Details deleted successfully.',
                                   icon: "success",
                                   button: "ok!",
                              });
                              $scope.$apply();
                         }
                    })
               } else {
                    $scope.ParticipantList.splice(index, 1);
               }
          }
     }

     $scope.valid = function (value) {
          if (value != undefined) {
               var x = value;
               var atpos = x.indexOf("@");
               var dotpos = x.lastIndexOf(".");
               if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {

                    return true;
               }
               return false;
          }
     }

     $scope.redirectPageURL = function (pageName) {
          debugger;
          var link = document.createElement("a");
          link.id = 'someLink'; //give it an ID!
          link.href = "#/" + pageName;
          link.click();
     }

     $scope.removeClass = function (controlid, index) {

          var controlIdfor = controlid + "" + index;

          $("#" + controlIdfor + "").removeClass('border-theme');
     }


     // CALLING APEX TO GET THE SIGNATORY SALUTATION VALUES
     $scope.signatorySalutationList = [];

     $scope.loadSignatorySalutations = function () {
          ApplicantPortal_Contoller.getSignatorySalutationPicklist(
               function (result, event) {
                    if (event.status && result) {
                         $scope.signatorySalutationList = result;
                         $scope.$applyAsync();
                    }
               }
          );
     };
     $scope.loadSignatorySalutations();

     // Get Signatory Contact Details
     $scope.getContactWiser = function () {

          ApplicantPortal_Contoller.getSignatoryContactAPADetails(
               $rootScope.proposalId,
               $rootScope.apaId,
               // $rootScope.signatoryAPAId,
               $rootScope.accountId,
               function (result, event) {

                    if (!event.status) {
                         // If there's an error or no signatory exists, initialize empty structure
                         $scope.objContact = {
                              Contact__r: {
                                   Signatory_Salutation__c: '',
                                   Signatory_First_Name__c: '',
                                   Signatory_Last_Name__c: '',
                                   Signatory_Institution__c: '',
                                   Signatory_Designation__c: '',
                                   Email: '',
                                   Institution_Name__c: '',
                                   Designation__c: '',
                                   Account: {
                                        Name: ''
                                   }
                              },
                              Signatory_Emailist_Name__c: ''
                         };
                         $scope.$applyAsync();
                         return;
                    }

                    // If result is null (no signatory exists), initialize empty structure
                    if (!result) {
                         $scope.objContact = {
                              Contact__r: {
                                   Signatory_Salutation__c: '',
                                   Signatory_First_Name__c: '',
                                   Signatory_Last_Name__c: '',
                                   Signatory_Institution__c: '',
                                   Signatory_Designation__c: '',
                                   Email: '',
                                   Institution_Name__c: '',
                                   Designation__c: '',
                                   Account: {
                                        Name: ''
                                   }
                              },
                              Signatory_Emailist_Name__c: ''
                         };
                         $scope.$applyAsync();
                         return;
                    }

                    // 🔒 SAFE INITIALIZATION
                    result.Contact__r = result.Contact__r || {};
                    result.Contact__r.Account = result.Contact__r.Account || {};

                    $scope.objContact = result;

                    let c = $scope.objContact.Contact__r;

                    c.Signatory_Salutation__c = decode(c.Signatory_Salutation__c);
                    c.Signatory_First_Name__c = decode(c.Signatory_First_Name__c);
                    c.Signatory_Last_Name__c = decode(c.Signatory_Last_Name__c);
                    c.Signatory_Institution__c = decode(c.Signatory_Institution__c);
                    c.Signatory_Designation__c = decode(c.Signatory_Designation__c);
                    c.Email = decode(c.Email);
                    c.Institution_Name__c = decode(c.Institution_Name__c);
                    c.Designation__c = decode(c.Designation__c);
                    c.Account.Name = decode(c.Account.Name);

                    $scope.objContact.Signatory_Emailist_Name__c =
                         decode($scope.objContact.Signatory_Emailist_Name__c);

                    $scope.$applyAsync();
               }
          );
     };

     // Get current logged-in user contact details
     $scope.getCurrentUserContactDetails = function () {
          if (!$rootScope.hashCode) {
               console.log('No hashCode found for current user');
               return;
          }

          ApplicantPortal_Contoller.getContactDetailsForWiser($rootScope.hashCode, function (result, event) {
               if (event.status && result) {
                    $scope.currentUserContact = result;
                    console.log('Current user Contact ID:', $scope.currentUserContact.Id);
                    console.log('Current user Email:', $scope.currentUserContact.Email);
                    $scope.$applyAsync();
               } else {
                    console.log('Error fetching current user contact details');
               }
          });
     };

     // Validate signatory email against current user
     $scope.validateSignatoryEmail = function (signatoryEmail) {
          if (!signatoryEmail || !$scope.currentUserContact) {
               return true; // No validation needed if email is empty or current user not loaded
          }

          // Check if signatory email matches current user email
          if (signatoryEmail.toLowerCase() === $scope.currentUserContact.Email.toLowerCase()) {
               showInfo("You cannot designate yourself as the signatory. Please enter a different email address.");
               return false;
          }

          return true;
     };

     // Enhanced email validation with signatory check
     /*
     $scope.validateSignatoryEmailExists = function (signatoryEmail) {
          if (!signatoryEmail) {
               return true; // Skip validation if email is empty
          }

          // First check against current user
          if (!$scope.validateSignatoryEmail(signatoryEmail)) {
               return false;
          }

          // Check if email exists in the system
          ApplicantPortal_Contoller.checkContactEmailExists(signatoryEmail, function (result, event) {
               if (event.status && result) {
                    // Email exists, check if it's the current user
                    if (result.Id === $scope.currentUserContact.Id) {
                         swal("Validation Error", "You cannot designate yourself as the signatory. Please enter a different email address.", "error");
                         // Clear the email field
                         $scope.objContact.Contact__r.Email = '';
                         $scope.$applyAsync();
                    }
               }
          });
     };
     */

     $scope.getContactWiser();
     $scope.getCurrentUserContactDetails();

     function decode(val) {
          if (!val) return val;
          return val
               .replace(/&amp;amp;/g, '&')
               .replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>');
     }

     function showInfo(message) {
          swal({
               title: "Info",
               content: {
                    element: "div",
                    attributes: {
                         innerHTML: `<p style="margin-top:10px; margin-bottom:20px; line-height:1.6;">${message}</p>`
                    }
               },
               icon: "info",
               button: "OK"
          });
     }

     // METHOD TO SAVE REFERENCES AND SIGNATORY CONTACT
     $scope.saveParticipants = function () {
          debugger;
          //var ind = indexNum-1;

          // if($scope.emailCheck == true){
          //      swal('info','Email already exists.','info');
          //      $("#email"+ind+"").addClass('border-theme');
          //          return;
          //  }

          for (var i = 0; i < $scope.ParticipantList.length; i++) {
               if ($scope.ParticipantList[i].Name == undefined || $scope.ParticipantList[i].Name == "") {
                    swal("Info", "Please Enter Reference name.", "info");
                    $("#name" + i + "").addClass('border-theme');
                    return;
               }
               if ($scope.ParticipantList[i].Designation__c == undefined || $scope.ParticipantList[i].Designation__c == "") {
                    swal("Indo", "Please Enter Designation.", "info");
                    $("#designation" + i + "").addClass('border-theme');
                    return;
               }
               if ($scope.ParticipantList[i].Organisation_Institute__c == undefined || $scope.ParticipantList[i].Organisation_Institute__c == "") {
                    swal("Info", "Please Enter Organisation/Institute.", "info");
                    $("#organisation" + i + "").addClass('border-theme');
                    return;
               }
               if ($scope.ParticipantList[i].Email__c == undefined || $scope.ParticipantList[i].Email__c == "") {
                    swal("Info", "Please Enter Email.", "info");
                    $("#email" + i + "").addClass('border-theme');
                    return;
               } else {
                    if ($scope.valid($scope.ParticipantList[i].Email__c)) {
                         swal(
                              'Info',
                              'Check Your Registered Email!',
                              'info'
                         )
                         $("#email" + i + "").addClass('border-theme');
                         return;
                    }
               }
          }

          for (var i = 0; i < $scope.ParticipantList.length; i++) {
               delete ($scope.ParticipantList[i]['$$hashKey']);
          }
          if ($scope.ParticipantList.length < 2) {
               swal("Max Reference Limit", "Add one more 'Reference'.");
               return;
          }


          // Signatory Validations

          let contact = $scope.objContact?.Contact__r;

          // Salutation validation
          if (!contact || !contact.Signatory_Salutation__c || contact.Signatory_Salutation__c === '' || contact.Signatory_Salutation__c === '-- Select Salutation --') {
               swal("Info", "Please select Signatory Salutation.", "info");
               angular.element('#signatorySalutation').addClass('error-border');
               return;
          }

          // First Name validation
          if (!contact.Signatory_First_Name__c || contact.Signatory_First_Name__c.trim() === '') {
               swal("Info", "Please enter Signatory First Name.", "info");
               angular.element('#signFirstName').addClass('error-border');
               return;
          }

          // Last Name validation
          if (!contact.Signatory_Last_Name__c || contact.Signatory_Last_Name__c.trim() === '') {
               swal("Info", "Please enter Signatory Last Name.", "info");
               angular.element('#signLastName').addClass('error-border');
               return;
          }

          // Signatory_Institution__c validation
          if (!contact.Signatory_Institution__c || contact.Signatory_Institution__c.trim() === '') {
               swal("Info", "Please enter Signatory Institution.", "info");
               angular.element('#signInstitution').addClass('error-border');
               return;
          }

          // Signatory_Designation__c validation
          if (!contact.Signatory_Designation__c || contact.Signatory_Designation__c.trim() === '') {
               swal("Info", "Please enter Signatory Designation.", "info");
               angular.element('#signDesignation').addClass('error-border');
               return;
          }

          // Email validation
          if (!contact.Email || contact.Email.trim() === '') {
               swal("Info", "Please enter Signatory Email.", "info");
               angular.element('#signatoryEmail').addClass('error-border');
               return;
          }

          // Validate that signatory is not the current user
          if (!$scope.validateSignatoryEmail(contact.Email)) {
               angular.element('#signEmail').addClass('error-border');
               return;
          }

          // Institution_Name__c validation
          // if (!contact.Institution_Name__c || contact.Institution_Name__c.trim() === '') {
          //      swal("Info", "Please enter Institution.", "info");
          //      angular.element('#signInstitution2').addClass('error-border');
          //      return;
          // }

          // Designation__c validation
          // if (!contact.Designation__c || contact.Designation__c.trim() === '') {
          //      swal("Info", "Please enter Designation.", "info");
          //      angular.element('#signDesignation2').addClass('error-border');
          //      return;
          // }

          // Signatory Emailst Name validation
          // if (!$scope.objContact.Signatory_Emailist_Name__c || $scope.objContact.Signatory_Emailist_Name__c.trim() === '') {
          //      swal("Info", "Please enter Signatory Emailist Name.", "info");
          //      angular.element('#signEmailistName').addClass('error-border');
          //      return;
          // }





          // ApplicantPortal_Contoller.insertParticipantsReferences($scope.ParticipantList, $rootScope.projectId, function (result, event) {

          //      if (event.status && result != null) {
          //           console.log('Result ::' + result);
          //           swal({
          //                title: "Details Saved",
          //                text: 'Reference details have been saved successfully.',
          //                icon: "success",
          //                button: "ok!",
          //           });
          //           $scope.redirectPageURL('AttachmentsInWiser');
          //           //    window.location.replace(window.location.origin+'/ApplicantDashboard/ApplicantPortal?id='+$rootScope.userId+'#/ProjectHandleGrantApplicationWiser');
          //      } else {
          //           swal({
          //                title: "Error",
          //                text: "Exception!",
          //                icon: "error",
          //                button: "ok!",
          //           });
          //      }
          // })

          // ------------ METHOD UPDATED TO SAVE SIGNATORY DETAILS ALSO ------------ //
          // Ensure objContact is initialized
          if (!$scope.objContact) {
               $scope.objContact = {
                    Contact__r: {
                         Signatory_Salutation__c: '',
                         Signatory_First_Name__c: '',
                         Signatory_Last_Name__c: '',
                         Signatory_Institution__c: '',
                         Signatory_Designation__c: '',
                         Email: '',
                         Institution_Name__c: '',
                         Designation__c: '',
                         Account: {
                              Name: ''
                         }
                    },
                    Signatory_Emailist_Name__c: ''
               };
          }

          // Ensure Contact__r exists
          if (!$scope.objContact.Contact__r) {
               $scope.objContact.Contact__r = {
                    Signatory_Salutation__c: '',
                    Signatory_First_Name__c: '',
                    Signatory_Last_Name__c: '',
                    Signatory_Institution__c: '',
                    Signatory_Designation__c: '',
                    Email: '',
                    Institution_Name__c: '',
                    Designation__c: '',
                    Account: {
                         Name: ''
                    }
               };
          }

          delete ($scope.objContact['Contact__c']);
          delete ($scope.objContact['Is_Signatory__c']);

          var signatoryAPAId = $scope.objContact && $scope.objContact.Id ? $scope.objContact.Id : null;

          // Prepare Contact object for Apex - ensure it has the correct structure
          var signatoryContact = angular.copy($scope.objContact.Contact__r);

          // Remove nested Account object if it exists (not needed for Contact upsert)
          if (signatoryContact.Account) {
               delete signatoryContact.Account;
          }

          // Copy signatory fields to Contact fields if needed
          if (signatoryContact.Signatory_Salutation__c) {
               signatoryContact.Salutation = signatoryContact.Signatory_Salutation__c;
          }
          if (signatoryContact.Signatory_Institution__c) {
               signatoryContact.Institution_Name__c = signatoryContact.Signatory_Institution__c;
          }
          if (signatoryContact.Signatory_Designation__c) {
               signatoryContact.Designation__c = signatoryContact.Signatory_Designation__c;
          }

          // If Contact has no Id (new contact), ensure we don't pass undefined Id
          // The Id will be set by Apex after insert
          if (!signatoryContact.Id) {
               // Explicitly remove Id for new contacts
               delete signatoryContact.Id;
          }

          // Prepare APA record object
          var apaRecordObj = {
               Signatory_Emailist_Name__c: $scope.objContact.Signatory_Emailist_Name__c || ''
          };

          // Show spinner on button
          $("#btnPreview").html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Please wait...');
          $("#btnPreview").prop('disabled', true);

          ApplicantPortal_Contoller.insertParticipantsReferences($scope.ParticipantList, $rootScope.proposalId, $rootScope.apaId, signatoryContact, apaRecordObj, signatoryAPAId, $rootScope.accountId, function (result, event) {
               debugger;
               // Restore button
               $("#btnPreview").html('<i class="fa-solid fa-check me-2"></i>Save and Next');
               $("#btnPreview").prop('disabled', false);

               console.log('Result:', result);
               console.log('Event status:', event.status);
               console.log('Event message:', event.message);

               // Check if result is an error (starts with "Error:")
               if (result && typeof result === 'string' && (result.startsWith('Error:') || result.startsWith('Error'))) {
                    swal({
                         title: "Error",
                         text: result,
                         icon: "error",
                         button: "ok!",
                    });
                    return;
               }

               if (event.status && result != null && result != '') {
                    // Check if result is a valid Id (18 characters)
                    if (result.length == 18 || result.length == 15) {
                         localStorage.setItem("signatoryAPAId", result);

                         showSuccess('References & Signatory details have been saved successfully.').then(function () {
                              $scope.redirectPageURL('AttachmentsInWiser');
                         });
                    } else {
                         // Result might be an error message
                         swal({
                              title: "Error",
                              text: result || "An error occurred while saving.",
                              icon: "error",
                              button: "ok!",
                         });
                    }
               } else {
                    swal({
                         title: "Error",
                         text: event.message || result || "An error occurred while saving. Please try again.",
                         icon: "error",
                         button: "ok!",
                    });
               }
          });
     }

     function showSuccess(message) {
          return swal({
               title: "Success",
               content: {
                    element: "div",
                    attributes: {
                         innerHTML: `<p style="margin-top:10px; margin-bottom:20px; line-height:1.6;">${message}</p>`
                    }
               },
               icon: "success",
               button: "OK"
          });
     }
});