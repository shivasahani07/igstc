angular.module('cp_app').controller('POrg_ctrl', function($scope,$rootScope) {
    debugger;
    $rootScope.proposalId;
    $scope.siteURL = siteURL;  
    $scope.accDetails = {};
    $scope.accountDetails = {}
    $scope.objRtf=[{charCount:0,maxCharLimit:250,errorStatus:false}];
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
                $scope.allStates = result.India.concat(result.Germany);
                $scope.getParentOrgDetails();
                $scope.$apply();
            }
        }
        )  
    }
    
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
    
    $scope.getDependentPicklistValues();
    $scope.readCharacter=function(event,index){
        debugger
           try{
           var rtfString=event.toString().replace(/<[^>]*>|\s/g, '').replace(/\s+/g,'').replace(/&ndash;/g,'-').replace(/&euro;/g,'1').replace(/&amp;/g,'1').replace(/&#39;/g,'1').replace(/&quot;/g,'1').replace(/&nbsp;/g,'').replace(/&mdash;/g,'-').replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&bull;/g,'');
            charLength=rtfString.length;
            if(charLength>0){
             $scope.objRtf[index].charCount=charLength;
             if(charLength>$scope.objRtf[index].maxCharLimit){
                  $scope.objRtf[index].errorStatus=true;
             }else
             {
              $scope.objRtf[index].errorStatus=false;
             }
            }
            else{
                  $scope.objRtf[index].charCount=0;
                  $scope.objRtf[index].errorStatus=false;
            }
           }catch(e){}
       }
    $scope.getParentOrgDetails = function(){
        debugger;
        ApplicantPortal_Contoller.getParentOrgDetails($rootScope.candidateId, function(result,event){
            debugger;
            if(event.status && result){
                debugger;
                if(result.Account.Name != undefined || result.Account.Name != ""){
                    result.Account.Name = result.Account.Name ? result.Account.Name.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Account.Name;
                  }
                  if(result.Account.BillingStreet != undefined || result.Account.BillingStreet != ""){
                    result.Account.BillingStreet = result.Account.BillingStreet ? result.Account.BillingStreet.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Account.BillingStreet;
                  }
                  if(result.Account.BillingCity != undefined || result.Account.BillingCity != ""){
                    result.Account.BillingCity = result.Account.BillingCity ? result.Account.BillingCity.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Account.BillingCity;
                  }
                  if(result.Account.BillingCountry != undefined || result.Account.BillingCountry != ""){
                    result.Account.BillingCountry = result.Account.BillingCountry ? result.Account.BillingCountry.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Account.BillingCountry;
                  }
                  if(result.Account.BillingState != undefined || result.Account.BillingState != ""){
                    result.Account.BillingState = result.Account.BillingState ? result.Account.BillingState.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Account.BillingState;
                  }
                  if(result.Account.Name_of_Mentor__c != undefined || result.Account.Name_of_Mentor__c != ""){
                    result.Account.Name_of_Mentor__c = result.Account.Name_of_Mentor__c ? result.Account.Name_of_Mentor__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Account.Name_of_Mentor__c;
                  }
                  if(result.Account.Designation_Position_of_the_Mentor__c != undefined || result.Account.Designation_Position_of_the_Mentor__c != ""){
                    result.Account.Designation_Position_of_the_Mentor__c = result.Account.Designation_Position_of_the_Mentor__c ? result.Account.Designation_Position_of_the_Mentor__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Account.Designation_Position_of_the_Mentor__c;
                  }
                if(result.Account.Organisation_Posrt__c != undefined || result.Account.Organisation_Posrt__c != ""){
                    result.Account.Organisation_Posrt__c = result.Account.Organisation_Posrt__c ? result.Account.Organisation_Posrt__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Account.Organisation_Posrt__c;
                }
                $scope.accDetails = result;
                $scope.accDetails.Account.BillingCountry = 'India';
                if($scope.accDetails.Account.BillingCountry == 'India'){
                    $scope.accDetails.Account.stateList = $scope.indianStates;
                }else if($scope.accDetails.Account.BillingCountry == 'Germany'){
                    $scope.accDetails.Account.stateList = $scope.germanStates; 
                }
                $scope.$apply();
            }
        },
                                                  {escape: true}
                                                 )
    }
    $scope.getParentOrgDetails();

    $scope.saveDetails = function(){
        debugger;
        $scope.accountDetails = $scope.accDetails.Account;
        $scope.accountDetails['Shipping_State__c'] = $scope.accountDetails['BillingState'];

        if($scope.accDetails.Account.Name==undefined || $scope.accDetails.Account.Name==""){
          swal('info','Please enter Organization Name','info');
          $("#name").addClass('border-theme');
          return;
      }
      if($scope.accDetails.Account.BillingCountry==undefined || $scope.accDetails.Account.BillingCountry==""){
          swal('info','Please enter Country','info');
          $("#country").addClass('border-theme');
          return;
      }
      if($scope.accDetails.Account.BillingPostalCode==undefined || $scope.accDetails.Account.BillingPostalCode==""){
          swal('info','Please enter Pin Code','info');
          $("#pincode").addClass('border-theme');
          return;
      }
    //   else{
    //     if($scope.accDetails.Account.BillingCountry == "India"){
    //         if($scope.accDetails.Account.BillingPostalCode.length != 6){
    //             swal('info','For India, pin code should be 6 digit.','info');
    //             $("#pincode").addClass('border-theme');
    //             return; 
    //         }
    //     }
    //   }
      if($scope.accDetails.Account.Name_of_Mentor__c==undefined || $scope.accDetails.Account.Name_of_Mentor__c==""){
          swal('info','Please enter Name of Mentor','info');
          $("#mentor").addClass('border-theme');
          return;
      }
      if($scope.accDetails.Account.Designation_Position_of_the_Mentor__c==undefined || $scope.accDetails.Account.Designation_Position_of_the_Mentor__c==""){
          swal('info','Please enter Designation/Position of Mentor','info');
          $("#designation").addClass('border-theme');
          return;
      }
      if($scope.accDetails.Account.Mentor_contact_number__c==undefined || $scope.accDetails.Account.Mentor_contact_number__c==""){
          swal('info','Please enter Mentor contact number','info');
          $("#number").addClass('border-theme');
          return;
      }
    //   if($scope.accDetails.Account.Mentor_contact_number__c != undefined && $scope.accDetails.Account.Mentor_contact_number__c != ""){
    //     if($scope.accDetails.Account.Mentor_contact_number__c.length < 10){
    //         swal(
    //             'info',
    //             'Contact No. should be 10 digit.',
    //             'info'
    //         )
    //         $("#number").addClass('border-theme');
    //         return;
    //     }
    // }
      if($scope.accDetails.Account.Mentor_E_mail_Id__c==undefined || $scope.accDetails.Account.Mentor_E_mail_Id__c==""){
          swal('info','Please enter Mentor email-id','info');
          $("#email").addClass('border-theme');
          return;
      }
    //   else{
    //     if($scope.valid($scope.accDetails.Account.Mentor_E_mail_Id__c)){
    //         swal(
    //             'info',
    //             'Check Your Registered Email!',
    //             'info'
    //         );
    //         $("#email").addClass('border-theme');
    //         return;
    //     }
    // }
      if($scope.accDetails.Account.Organisation_Posrt__c==undefined || $scope.accDetails.Account.Organisation_Posrt__c==""){
          swal('info','Please enter Organization portfolio','info');
          return;
      }else{
            //   var div = document.createElement("div");
            //   div.innerHTML = $scope.accDetails.Account.Organisation_Posrt__c;
            //   let abstractText = div.innerText.replace(/(\r\n\t|\t|\n|\r)/gm, "");
            //   abstractText = abstractText.replaceAll(' ','');
        if($scope.objRtf[0].charCount > 250){
          swal('info','Max character limit for Brief Portfolio of the organisation is 250 only','info');
          return;
        }
      }

        delete ($scope.accDetails.Account['stateList']);
  
  
        ApplicantPortal_Contoller.updateconAccDetails($scope.accountDetails, function(result,event){
            if(event.status){
                debugger;
                Swal.fire(
                    'Success',
                    'Your Parent Organization details have been saved successfully.',
                    'success'
                );
                $scope.redirectPageURL('EduQualificationIF');
                $scope.accDetails.Account = result;
                $scope.$apply();
            }
        },
       {escape: true}
        )
    }

    $scope.valid = function(value){
        debugger;
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
                
    $scope.redirectPageURL = function(pageName){
        debugger;
        var link=document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href="#/"+pageName;
        link.click();
    }

    $scope.onCountryChange = function(){
        debugger;
            if($scope.accDetails.Account.BillingCountry == 'India'){
                $scope.accDetails.Account.stateList = $scope.indianStates;
            }else if($scope.accDetails.Account.BillingCountry == 'Germany'){
                $scope.accDetails.Account.stateList = $scope.germanStates;
            }
            $scope.$apply();
    }


     $scope.removeClass2=function(controlid){
        $("#"+controlid+"").removeClass('border-theme');
      }

      $scope.checkPinCode = function(){
        debugger;
        if($scope.accDetails.Account.BillingCountry == "India"){
          if($scope.accDetails.Account.BillingPostalCode.length > 6){
            swal('info','For India, pin code should be 6 digit.','info');
            $("#pincode").addClass('border-theme');
          return;
          }
        }
      }
                
    });