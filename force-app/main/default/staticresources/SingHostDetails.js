
// angular.module('cp_app').controller('SING', function($scope,$rootScope, fileReader){
//      $scope.objContact = {};
//      $rootScope.projectId;
//     debugger;


// $scope.getContact = function(){
//         debugger;
//         ApplicantPortal_Contoller.getConSing($rootScope.candidateId,function(result,event){
//             debugger;
//             if(event.status && result){
//                 $scope.conRecord = result;
//                 $rootScope.projectId = result.Proposals__c;
//             }
//             $scope.$apply();
//             // $scope.getExpenseRecords();
//         })
//     }
//     $scope.getContact();



    

//     $scope.getDependentPicklistValues = function(){
//       debugger;
//       $scope.indianStates = [];
//       $scope.germanStates = [];
//       ApplicantPortal_Contoller.getFieldDependencies('Contact','Country__c','States__c', function(result,event){
//           debugger;
//           if(event.status && result != null){
//               debugger;
//               $scope.indianStates = result.India;
//               $scope.germanStates = result.Germany;
//               $scope.getHostSing();
//               debugger;
//               $scope.$apply();
//           }
//       }
//       )  
//     }
//     $scope.getDependentPicklistValues();

//     $scope.onCountryChange = function(){
//       debugger;
      
//               if($scope.hostDetails.BillingCountry == 'India'){
//                   $scope.hostDetails.stateList = $scope.indianStates;
//               }else if($scope.hostDetails.BillingCountry == 'Germany'){
//                   $scope.hostDetails.stateList = $scope.germanStates;
//               }
//               $scope.$apply();
//   }

//     $scope.checkEmail = function(email,contId){
//       debugger;
//       $scope.emailCheck = false;
//       if(contId == undefined){
//         contId = "";
//       }
//       ApplicantPortal_Contoller.checkEmail(email,contId,function(result,event){
//         debugger;
//         if(event.status){
//           debugger;
//           if(result.length > 0){
//             $scope.emailCheck = true;
//           }else{
//             $scope.emailCheck = false;
//           }
//           $scope.$apply();
//         }
//       })

//     }

//      $scope.getHostSing = function(){
//         debugger;
//         ApplicantPortal_Contoller.getHostSing($rootScope.projectId,function(result,event){
//             debugger;
//             if(event.status && result){
//                 $scope.hostDetails = result;
//                 $scope.contactDetails = result.Contacts[0];

//                 if(result.Name != undefined || result.Name != ''){
//                   $scope.hostDetails.Name = $scope.hostDetails.Name ? $scope.hostDetails.Name.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.hostDetails.Name;  
//                 }
//                 if(result.Contacts[0].FirstName != undefined || result.Contacts[0].FirstName != ''){
//                   $scope.contactDetails.FirstName = $scope.contactDetails.FirstName ? $scope.contactDetails.FirstName.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.contactDetails.FirstName;  
//                 }
//                 if(result.Contacts[0].LastName != undefined || result.Contacts[0].LastName != ''){
//                   $scope.contactDetails.LastName = $scope.contactDetails.LastName ? $scope.contactDetails.LastName.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.contactDetails.LastName;  
//                 }
//                 if(result.Contacts[0].Designation__c != undefined || result.Contacts[0].Designation__c != ''){
//                   $scope.contactDetails.Designation__c = $scope.contactDetails.Designation__c ? $scope.contactDetails.Designation__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.contactDetails.Designation__c;  
//                 }
//                 if(result.BillingStreet != undefined || result.BillingStreet != ''){
//                   $scope.hostDetails.BillingStreet = $scope.hostDetails.BillingStreet ? $scope.hostDetails.BillingStreet.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.hostDetails.BillingStreet;  
//                 }
//                 if(result.BillingCity != undefined || result.BillingCity != ''){
//                   $scope.hostDetails.BillingCity = $scope.hostDetails.BillingCity ? $scope.hostDetails.BillingCity.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.hostDetails.BillingCity;  
//                 }

//                 if($scope.hostDetails.BillingCountry == 'India'){
//                   $scope.hostDetails.stateList = $scope.indianStates;
//               }else if($scope.hostDetails.BillingCountry == 'Germany'){
//                   $scope.hostDetails.stateList = $scope.germanStates; 
//               }
//             }else{
//                 $scope.hostDetails = {"Name":"","Email__c":""};
//                 $scope.contactDetails = {"LastName":"","Email":""};
//             }
//             $scope.$apply();
//         })
//      }
//      //$scope.getHostSing();

//      $scope.saveHostDetails = function(){
//         debugger;

//         if($scope.contactDetails.FirstName == undefined || $scope.contactDetails.FirstName == ""){
//           swal("info", "Please enter Host collaborator First Name.","info");
//           $("#fname").addClass('border-theme');
//           return;
//         }
//         if($scope.contactDetails.LastName == undefined || $scope.contactDetails.LastName == ""){
//           swal("info", "Please enter Host collaborator Last Name.","info");
//           $("#lname").addClass('border-theme');
//           return;
//         }
//         if($scope.contactDetails.Nationality__c == undefined || $scope.contactDetails.Nationality__c == ""){
//           swal("info", "Please enter Host collaborator Nationality.","info");
//           $("#selectNatinality").addClass('border-theme');
//           return;
//         }
//         if($scope.contactDetails.Email == undefined || $scope.contactDetails.Email == ""){
//           swal("info", "Please enter Host collaborator Email.","info");
//           $("#email2").addClass('border-theme');
//           return;
//         }else{
//           if($scope.valid($scope.contactDetails.Email)){
//             swal(
//                 'info',
//                 'Check Your Registered Email.',
//                 'info'
//             );
//             $("#email2").addClass('border-theme');
//             return;
//         }
//         }
//         if($scope.contactDetails.MobilePhone == undefined || $scope.contactDetails.MobilePhone == ""){
//           swal("info", "Please enter Host collaborator Mobile no.","info");
//           $("#mobile2").addClass('border-theme');
//           return;
//         }
//         if($scope.hostDetails.Name == undefined || $scope.hostDetails.Name == ""){
//           swal("info", "Please enter Host Organization Name.","info");
//           $("#name").addClass('border-theme');
//           return;
//         }
//         if($scope.contactDetails.Designation__c == undefined || $scope.contactDetails.Designation__c == ""){
//           swal("info", "Please enter Host collaborator Designation.","info");
//           $("#designation").addClass('border-theme');
//           return;
//         }

//         //   if($scope.hostDetails.BillingStreet == undefined || $scope.hostDetails.BillingStreet == ""){
//         //     swal("info", "Please Enter First Name.","info");
//         //     $("#txtFirstName").addClass('border-theme');
//         //     return;
//         //   }
//         //   if($scope.hostDetails.BillingCity == undefined || $scope.hostDetails.BillingCity == ""){
//         //     swal("info", "Please Enter First Name.","info");
//         //     $("#txtFirstName").addClass('border-theme');
//         //     return;
//         //   }
//           if($scope.hostDetails.BillingCountry == undefined || $scope.hostDetails.BillingCountry == ""){
//             swal("info", "Please enter Host Country.","info");
//             $("#country").addClass('border-theme');
//             return;
//           }
//           if($scope.hostDetails.BillingState == undefined || $scope.hostDetails.BillingState == ""){
//             swal("info", "Please enter Host State.","info");
//             $("#state").addClass('border-theme');
//             return;
//           }
//           if($scope.hostDetails.BillingPostalCode == undefined || $scope.hostDetails.BillingPostalCode == ""){
//             swal("info", "Please enter Host Pin Code.","info");
//             $("#pin").addClass('border-theme');
//             return;
//           }

//           //COORDINATOR

//           if($scope.emailCheck == true){
//             swal('info','Collaborator Email already exists.','info');
//             $("#email2").addClass('border-theme');
//                 return;
//         }

//         $scope.hostDetails['Shipping_State__c'] = $scope.hostDetails['BillingState'];

//         delete ($scope.hostDetails['stateList']);
//         delete($scope.hostDetails['Contacts']);
//         console.log($scope.hostDetails);
//         debugger;
//         ApplicantPortal_Contoller.saveHostDetails($scope.hostDetails,$scope.contactDetails,$rootScope.projectId,function(result,event){
//             debugger;
//             if(event.status){
//                 swal({
//                     title: "SUCCESS",
//                     text: 'Host details have been saved successfully.',
//                     icon: "success",
//                     button: "ok!",
//                })  
//                $scope.redirectPageURL('ProjectDetailsSing');  
//             }else{
//                 swal({
//                      title: "ERROR",
//                      text: "Exception !",
//                      icon: "error",
//                      button: "ok!",
//                 });
//            }
//            $scope.$apply();
//         })
//      }
    
//           $scope.redirectPageURL = function(pageName){
//             debugger;
//             var link=document.createElement("a");
//             link.id = 'someLink'; //give it an ID!
//             link.href="#/"+pageName;
//             link.click();
//         }

//         $scope.valid = function(value){
//             if(value!=undefined){
//                  var x=value;
//                  var atpos = x.indexOf("@");
//                  var dotpos = x.lastIndexOf(".");
//                 if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
                    
//                     return true;
//                 }
//                 return false;
//              }
//          }

//          $scope.checkEmail = function(email,contId){
//             debugger;
//             $scope.emailCheck = false;
//             if(contId == undefined){
//               contId = "";
//             }
//             ApplicantPortal_Contoller.checkEmail(email,contId,function(result,event){
//               debugger;
//               if(event.status){
//                 debugger;
//                 if(result.length > 0){
//                   $scope.emailCheck = true;
//                 }else{
//                   $scope.emailCheck = false;
//                 }
//                 $scope.$apply();
//               }
//             })
      
//           }
    
//           $scope.removeClass=function(controlid){
//             $("#"+controlid+"").removeClass('border-theme');
//           } 
// });

























angular.module('cp_app').controller('SING', function($scope,$rootScope, fileReader){
     $scope.objContact = {};
     $rootScope.projectId;
     $rootScope.proposalId;
    //  $scope.hostDetails = [];
     debugger;

    // $scope.assignProposalIdAsProjectId = function () {

    //     IndustrialFellowshipHelper.fetchProjectId(
    //         $rootScope.candidateId,
    //         function (result, event) {

    //             console.log(result);
    //             console.log(event);

    //             if (event.status && result) {
    //                 $rootScope.projectId = result.Proposals__c;
    //             }

    //             if (!$scope.$$phase) {
    //                 $scope.$apply();
    //             }
    //         }
    //     );
    // };

  // Fetching the proposalId from Local Storage

    if (localStorage.getItem('proposalId')) {

        $rootScope.proposalId = localStorage.getItem('proposalId');

        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);

        $rootScope.projectId = $rootScope.proposalId;
    }






    // $scope.getContact = function(){
    //     debugger;
    //     ApplicantPortal_Contoller.getConSing222($rootScope.candidateId,function(result,event){
    //         debugger;
    //         if(event.status && result){
    //             $scope.conRecord = result;
    //             $rootScope.projectId = result.Applicant_Proposal_Associations__r[0].Proposals__c;
    //         }
    //         $scope.$apply();
    //         // $scope.getExpenseRecords();
    //     })
    // }
    // $scope.getContact();

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
              $scope.getHostSing();
              debugger;
              if (!$scope.$$phase) {
                  $scope.$apply();
              }
          }
      }
      )  
    }

    $scope.getDependentPicklistValues();


    // $scope.assignProposalIdAsProjectId = function () {
    //     debugger;
    //     IndustrialFellowshipHelper.fetchProjectId($rootScope.candidateId, function (result, event) {
    //             console.log(result);
    //             console.log(event);

    //             $rootScope.projectId = result.Proposals__c;

    //             $scope.$apply();
    //         }
    //     );
    // };


        // IndustrialFellowshipController.getContactSingh($rootScope.userHashId, function (result, event) {
        //     debugger
        //     console.log(result);
        //     console.log(event);
        //     if(event.status){
        //         if(result.Declaration_Sign_Date__c!=undefined && $rootScope.proposalStage){
        //             $scope.SignDate=new Date(result.Declaration_Sign_Date__c);
        //         }
        //         $scope.objContact=result;
        //         $scope.$apply();
        //     }
        // });    
    



    $scope.onCountryChange = function(){
      debugger;
      
              if($scope.hostDetails.BillingCountry == 'India'){
                  $scope.hostDetails.stateList = $scope.indianStates;
              }else if($scope.hostDetails.BillingCountry == 'Germany'){
                  $scope.hostDetails.stateList = $scope.germanStates;
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

    
     $scope.getHostSing = function(){
        debugger;
        // projectIdToPass=$rootScope.projectId;
        
        ApplicantPortal_Contoller.getHostSing($rootScope.projectId,function(result,event){
            debugger;
            //onsole.log('$rootScope.projectId==>', projectId);
            console.log('event.status===>',event.status);
            console.log('result===>',result);
            if(event.status && result){
                $scope.hostDetails = result;
                $scope.contactDetails = result.Contacts[0];

                if(result.Name != undefined || result.Name != ''){
                  $scope.hostDetails.Name = $scope.hostDetails.Name ? $scope.hostDetails.Name.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.hostDetails.Name;  
                }
                if(result.Contacts[0].FirstName != undefined || result.Contacts[0].FirstName != ''){
                  $scope.contactDetails.FirstName = $scope.contactDetails.FirstName ? $scope.contactDetails.FirstName.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.contactDetails.FirstName;  
                }
                if(result.Contacts[0].LastName != undefined || result.Contacts[0].LastName != ''){
                  $scope.contactDetails.LastName = $scope.contactDetails.LastName ? $scope.contactDetails.LastName.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.contactDetails.LastName;  
                }
                if(result.Contacts[0].Designation__c != undefined || result.Contacts[0].Designation__c != ''){
                  $scope.contactDetails.Designation__c = $scope.contactDetails.Designation__c ? $scope.contactDetails.Designation__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.contactDetails.Designation__c;  
                }
                if(result.BillingStreet != undefined || result.BillingStreet != ''){
                  $scope.hostDetails.BillingStreet = $scope.hostDetails.BillingStreet ? $scope.hostDetails.BillingStreet.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.hostDetails.BillingStreet;  
                }
                if(result.BillingCity != undefined || result.BillingCity != ''){
                  $scope.hostDetails.BillingCity = $scope.hostDetails.BillingCity ? $scope.hostDetails.BillingCity.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.hostDetails.BillingCity;  
                }

                if($scope.hostDetails.BillingCountry == 'India'){
                  $scope.hostDetails.stateList = $scope.indianStates;
              }else if($scope.hostDetails.BillingCountry == 'Germany'){
                  $scope.hostDetails.stateList = $scope.germanStates; 
              }
            }else{
                $scope.hostDetails = {"Name":"","Email__c":""};
                $scope.contactDetails = {"LastName":"","Email":""};
            }
            $scope.$apply();
        })
     }
    //  $scope.getHostSing();

//     $scope.getHostSing = function () {
//     debugger;
//     projectIdToPass = $rootScope.projectId;
//     console.log('$rootScope.projectId ==>', $rootScope.projectId);

//     try {
//         ApplicantPortal_Contoller.getHostSing(projectIdToPass, function (result, event) {
//             debugger;
//             console.log('event.status ===>', event.status);
//             console.log('event.type ===>', event.type);
//             console.log('event.message ===>', event.message);
//             console.log('result ===>', result);

//             // ❗ Check if Apex threw an exception
//             if (event.type === 'exception') {
//                 console.error('Apex Exception:', event.message);
//                 console.error('Stack Trace:', event.where);
//                 alert('Server Error: ' + event.message);
//                 return;
//             }

//             // ❗ Check if call failed
//             if (!event.status) {
//                 console.error('Unknown Error (event.status = false):', event);
//                 alert('Unexpected error occurred fetching Host Details.');
//                 return;
//             }

//             // ---------------------------------------------
//             // SUCCESS FLOW
//             // ---------------------------------------------
//             if (result) {
//                 $scope.hostDetails = result;
//                 $scope.contactDetails = result.acc.Contacts[0];

//                 // Clean Name
//                 if (result.Name) {
//                     $scope.hostDetails.Name = $scope.hostDetails.Name
//                         .replace(/&amp;/g, '&')
//                         .replaceAll('&amp;amp;', '&')
//                         .replaceAll('&amp;gt;', '>')
//                         .replaceAll('&lt;', '<')
//                         .replaceAll('&gt;', '>')
//                         .replaceAll('&amp;', '&');
//                 }

//                 // Clean Contact First Name
//                 if (result.Contacts[0].FirstName) {
//                     $scope.contactDetails.FirstName = $scope.contactDetails.FirstName
//                         .replace(/&amp;/g, '&')
//                         .replaceAll('&amp;amp;', '&')
//                         .replaceAll('&amp;gt;', '>')
//                         .replaceAll('&lt;', '<')
//                         .replaceAll('&gt;', '>')
//                         .replaceAll('&amp;', '&');
//                 }

//                 // Clean Contact Last Name
//                 if (result.Contacts[0].LastName) {
//                     $scope.contactDetails.LastName = $scope.contactDetails.LastName
//                         .replace(/&amp;/g, '&')
//                         .replaceAll('&amp;amp;', '&')
//                         .replaceAll('&amp;gt;', '>')
//                         .replaceAll('&lt;', '<')
//                         .replaceAll('&gt;', '>')
//                         .replaceAll('&amp;', '&');
//                 }

//                 // Clean Designation
//                 if (result.Contacts[0].Designation__c) {
//                     $scope.contactDetails.Designation__c = $scope.contactDetails.Designation__c
//                         .replace(/&amp;/g, '&')
//                         .replaceAll('&amp;amp;', '&')
//                         .replaceAll('&amp;gt;', '>')
//                         .replaceAll('&lt;', '<')
//                         .replaceAll('&gt;', '>')
//                         .replaceAll('&amp;', '&');
//                 }

//                 // Clean Billing Street
//                 if (result.BillingStreet) {
//                     $scope.hostDetails.BillingStreet = $scope.hostDetails.BillingStreet
//                         .replace(/&amp;/g, '&')
//                         .replaceAll('&amp;amp;', '&')
//                         .replaceAll('&amp;gt;', '>')
//                         .replaceAll('&lt;', '<')
//                         .replaceAll('&gt;', '>')
//                         .replaceAll('&amp;', '&');
//                 }

//                 // Clean Billing City
//                 if (result.BillingCity) {
//                     $scope.hostDetails.BillingCity = $scope.hostDetails.BillingCity
//                         .replace(/&amp;/g, '&')
//                         .replaceAll('&amp;amp;', '&')
//                         .replaceAll('&amp;gt;', '>')
//                         .replaceAll('&lt;', '<')
//                         .replaceAll('&gt;', '>')
//                         .replaceAll('&amp;', '&');
//                 }

//                 // States
//                 if ($scope.hostDetails.BillingCountry == 'India') {
//                     $scope.hostDetails.stateList = $scope.indianStates;
//                 } else if ($scope.hostDetails.BillingCountry == 'Germany') {
//                     $scope.hostDetails.stateList = $scope.germanStates;
//                 }
//             } else {
//                 $scope.hostDetails = { "Name": "", "Email__c": "" };
//                 $scope.contactDetails = { "LastName": "", "Email": "" };
//             }

//             $scope.$apply();
//         });
//     } catch (err) {
//         // This catches JS-level errors (NOT Apex errors)
//         console.error("JS Error:", err);
//         console.log('Error================>',err);
//         console.log('Error for Harsh is===>',JSON.stringify(err));
//         //alert("JavaScript Error: " + err.message);
//     }
// };

     //$scope.getHostSing();

     $scope.saveHostDetails = function(){
        debugger;

        if($scope.contactDetails.FirstName == undefined || $scope.contactDetails.FirstName == ""){
          swal("info", "Please enter Host collaborator First Name.","info");
          $("#fname").addClass('border-theme');
          return;
        }
        if($scope.contactDetails.LastName == undefined || $scope.contactDetails.LastName == ""){
          swal("info", "Please enter Host collaborator Last Name.","info");
          $("#lname").addClass('border-theme');
          return;
        }
        if($scope.contactDetails.Nationality__c == undefined || $scope.contactDetails.Nationality__c == ""){
          swal("info", "Please enter Host collaborator Nationality.","info");
          $("#selectNatinality").addClass('border-theme');
          return;
        }
        if($scope.contactDetails.Email == undefined || $scope.contactDetails.Email == ""){
          swal("info", "Please enter Host collaborator Email.","info");
          $("#email2").addClass('border-theme');
          return;
        }else{
          if($scope.valid($scope.contactDetails.Email)){
            swal(
                'info',
                'Check Your Registered Email.',
                'info'
            );
            $("#email2").addClass('border-theme');
            return;
        }
        }
        if($scope.contactDetails.MobilePhone == undefined || $scope.contactDetails.MobilePhone == ""){
          swal("info", "Please enter Host collaborator Mobile no.","info");
          $("#mobile2").addClass('border-theme');
          return;
        }
        if($scope.hostDetails.Name == undefined || $scope.hostDetails.Name == ""){
          swal("info", "Please enter Host Organization Name.","info");
          $("#name").addClass('border-theme');
          return;
        }
        if($scope.contactDetails.Designation__c == undefined || $scope.contactDetails.Designation__c == ""){
          swal("info", "Please enter Host collaborator Designation.","info");
          $("#designation").addClass('border-theme');
          return;
        }

        //   if($scope.hostDetails.BillingStreet == undefined || $scope.hostDetails.BillingStreet == ""){
        //     swal("info", "Please Enter First Name.","info");
        //     $("#txtFirstName").addClass('border-theme');
        //     return;
        //   }
        //   if($scope.hostDetails.BillingCity == undefined || $scope.hostDetails.BillingCity == ""){
        //     swal("info", "Please Enter First Name.","info");
        //     $("#txtFirstName").addClass('border-theme');
        //     return;
        //   }
          if($scope.hostDetails.BillingCountry == undefined || $scope.hostDetails.BillingCountry == ""){
            swal("info", "Please enter Host Country.","info");
            $("#country").addClass('border-theme');
            return;
          }
          if($scope.hostDetails.BillingState == undefined || $scope.hostDetails.BillingState == ""){
            swal("info", "Please enter Host State.","info");
            $("#state").addClass('border-theme');
            return;
          }
          if($scope.hostDetails.BillingPostalCode == undefined || $scope.hostDetails.BillingPostalCode == ""){
            swal("info", "Please enter Host Pin Code.","info");
            $("#pin").addClass('border-theme');
            return;
          }

          //COORDINATOR

          if($scope.emailCheck == true){
            swal('info','Collaborator Email already exists.','info');
            $("#email2").addClass('border-theme');
                return;
        }

        $scope.hostDetails['Shipping_State__c'] = $scope.hostDetails['BillingState'];

        delete ($scope.hostDetails['stateList']);
        delete($scope.hostDetails['Contacts']);
        console.log($scope.hostDetails);
        debugger;
        ApplicantPortal_Contoller.saveHostDetails($scope.hostDetails,$scope.contactDetails,$rootScope.projectId, function(result,event){
            debugger;
            if(event.status){
                swal({
                    title: "SUCCESS",
                    text: 'Host details have been saved successfully.',
                    icon: "success",
                    button: "ok!",
               })  
               $scope.redirectPageURL('ProjectDetailsSing');  
            }else{
                swal({
                     title: "ERROR",
                     text: "Exception !",
                     icon: "error",
                     button: "ok!",
                });
           }
           $scope.$apply();
        })
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
              if (result && result.length > 0) {
                  $scope.contactDetails = {
                      FirstName: result[0].FirstName || '',
                      LastName: result[0].LastName || '',
                      Email: result[0].Email || '',
                      
                      Nationality__c: result[0].Nationality__c || '',
                      Designation__c: result[0].Designation__c || '',
                      MobilePhone: result[0].MobilePhone || '',

                      Account:result[0].Account || ''
                  };
                  //$scope.emailCheck = true;
              }    
              if (result && result.length > 0) {
                  $scope.hostDetails.stateList = [];
                  if (result && result.length > 0 && result[0].Account && result[0].Account.BillingState) {
                      $scope.hostDetails.stateList.push(result[0].Account.BillingState,"");
                  }
                  $scope.hostDetails = {
                      Name: result[0].Institution__c || '',
                      BillingStreet: result[0].Account.BillingStreet || '',
                      BillingCity: result[0].Account.BillingCity || '', 
                      BillingCountry: result[0].Account.BillingCountry || '',
                      BillingState: result[0].Account.BillingState||'',
                      BillingPostalCode: result[0].Account.BillingPostalCode || '',
                      
                      

                  };

                  $scope.onCountryChange();
                  
                }   
              else{
                  $scope.emailCheck = false;
            }
            $scope.$apply();
          }
        })
      }
    
          $scope.removeClass=function(controlid){
            $("#"+controlid+"").removeClass('border-theme');
          } 
});

