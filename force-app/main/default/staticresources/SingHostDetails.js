
angular.module('cp_app').controller('singHost_ctrl', function($scope,$rootScope, fileReader){
     $scope.objContact = {};
     $rootScope.projectId;
    debugger;

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
              $scope.$apply();
          }
      }
      )  
    }
    $scope.getDependentPicklistValues();

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
        ApplicantPortal_Contoller.getHostSing($rootScope.projectId,function(result,event){
            debugger;
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
        ApplicantPortal_Contoller.saveHostDetails($scope.hostDetails,$scope.contactDetails,$rootScope.projectId,function(result,event){
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
                if(result.length > 0){
                  $scope.emailCheck = true;
                }else{
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

