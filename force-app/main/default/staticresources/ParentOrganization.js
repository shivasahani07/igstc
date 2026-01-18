angular.module('cp_app').controller('parengOrg_ctrl', function($scope,$rootScope) {
    debugger;
    
    $scope.siteURL = siteURL;  
    $scope.accDetails = {};
    $scope.accountDetails = {};
    $scope.objRtf=[{charCount:0,maxCharLimit:500,errorStatus:false}];
    
    // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }

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
                $scope.$apply();
            }
        }
        )  
    }
    $scope.getDependentPicklistValues();

    $scope.getParentOrgDetails = function(){
        debugger;
        ApplicantPortal_Contoller.getParentOrgDetails($rootScope.candidateId, function(result,event){
            debugger;
            if(event.status && result){
                $scope.accDetails = result;
                debugger;

                if(result.Account.Name != undefined || result.Account.Name != ""){
                    $scope.accDetails.Account.Name = $scope.accDetails.Account.Name ? $scope.accDetails.Account.Name.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : $scope.accDetails.Account.Name;
                }

                if(result.Account.Homepage_URL__c != undefined || result.Account.Homepage_URL__c != ""){
                    $scope.accDetails.Account.Homepage_URL__c = $scope.accDetails.Account.Homepage_URL__c ? $scope.accDetails.Account.Homepage_URL__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : $scope.accDetails.Account.Homepage_URL__c;
                }

                if(result.Account.Organisation_Posrt__c != undefined || result.Account.Organisation_Posrt__c != ""){
                    $scope.accDetails.Account.Organisation_Posrt__c = $scope.accDetails.Account.Organisation_Posrt__c ? $scope.accDetails.Account.Organisation_Posrt__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : $scope.accDetails.Account.Organisation_Posrt__c;
                }

                if(result.Account.BillingStreet != undefined || result.Account.BillingStreet != ""){
                    $scope.accDetails.Account.BillingStreet = $scope.accDetails.Account.BillingStreet ? $scope.accDetails.Account.BillingStreet.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : $scope.accDetails.Account.BillingStreet;
                }

                if(result.Account.BillingCity != undefined || result.Account.BillingCity != ""){
                    $scope.accDetails.Account.BillingCity = $scope.accDetails.Account.BillingCity ? $scope.accDetails.Account.BillingCity.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : $scope.accDetails.Account.BillingCity;
                }

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
        // if($scope.accDetails.Account.Email__c==undefined || $scope.accDetails.Account.Email__c==""){
        //     swal('info','Please enter Email','info');
        //     $("#email").addClass('border-theme');
        //     return;
        // }else{
        //     if($scope.valid($scope.accDetails.Account.Email__c)){
        //         swal(
        //             'info',
        //             'Check Your Registered Email!',
        //             'info'
        //         );
        //         $("#email").addClass('border-theme');
        //         return;
        //     }
        // }
        if($scope.accDetails.Account.BillingCountry==undefined || $scope.accDetails.Account.BillingCountry==""){
            swal('info','Please enter Country','info');
            $("#country").addClass('border-theme');
            return;
        }
        if($scope.accDetails.Account.BillingPostalCode==undefined || $scope.accDetails.Account.BillingPostalCode==""){
            swal('info','Please enter Pin Code','info');
            $("#pincode").addClass('border-theme');
            return;
        }else{
            if($scope.accDetails.Account.BillingCountry == "India"){
                if($scope.accDetails.Account.BillingPostalCode.length != 6){
                    swal('info','For India, pin code should be 6 digit.','info');
                    $("#pincode").addClass('border-theme');
                    return; 
                }
            }
          }
        if($scope.accDetails.Account.Homepage_URL__c==undefined || $scope.accDetails.Account.Homepage_URL__c==""){
            swal('info','Please enter Homepage URL','info');
            $("#homepage").addClass('border-theme');
            return;
        }
        if($scope.accDetails.Account.Organisation_Posrt__c==undefined || $scope.accDetails.Account.Organisation_Posrt__c==""){
            swal('info','Please enter Organization portfolio','info');
            return;
        }else{
                // var div = document.createElement("div");
                // div.innerHTML = $scope.accDetails.Account.Organisation_Posrt__c;
                // let abstractText = div.innerText.replace(/(\r\n\t|\t|\n|\r)/gm, "");
                // abstractText = abstractText.replaceAll(/\s/g,'');
          if(charLength > 500){
            swal('info','Max character limit for Brief Portfolio of the organisation is 500 only','info');
            return;
          }
        }

        delete ($scope.accDetails.Account['stateList']);


        ApplicantPortal_Contoller.updateconAccDetails($scope.accountDetails, function(result,event){
            if(event.status){
                debugger;
                swal({
                    title: "Parent Organization Details",
                    text: 'Your parent organization details have been successfully saved.',
                    icon: "success",
                    button: "ok!",
                  }).then((value) => {
                    $scope.redirectPageURL('Education_Qualification');
                    $scope.accDetails = result;
                      });
                
                $scope.$apply(); 
                
            }
            else
              {
                swal({
                  title: "Parent Organization Details",
                  text: "Exception!",
                  icon: "error",
                  button: "ok!",
                });
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

    $scope.onCountryChange = function(){
        debugger;
            if($scope.accDetails.Account.BillingCountry == 'India'){
                $scope.accDetails.Account.stateList = $scope.indianStates;
            }else if($scope.accDetails.Account.BillingCountry == 'Germany'){
                $scope.accDetails.Account.stateList = $scope.germanStates;
            }
            $scope.$apply();
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
                
    });