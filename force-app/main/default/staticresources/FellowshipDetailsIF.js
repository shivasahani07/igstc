angular.module('cp_app').controller('FellowshipDetailsIF_Ctrl', function($scope,$rootScope) {
    // $scope.objContactList=[];
    // $scope.objProposal={};
    // $scope.objContacts__r={};
    // $scope.objContact1={};
    // $scope.objIndFell={};
    $scope.accDetails = {};
    $rootScope.proposalId;
    $rootScope.IFcountry;
    $scope.siteURL = siteURL;
    $scope.objRtf=[{charCount:0,maxCharLimit:250,errorStatus:false}];
    $scope.accountDetails = {}
    
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

    if (localStorage.getItem('IFcountry')) {
        $rootScope.IFcountry = localStorage.getItem('IFcountry');
        console.log('Loaded IFcountry from localStorage:', $rootScope.IFcountry);
    }
    
$scope.callRTF=function(){
  debugger
  //var textValue=$scope.accDetails.Organisation_Posrt__c;
  //alert($scope.accDetails.Organisation_Posrt__c.length);
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
              $scope.getMentorHostDetails();
              debugger;
              $scope.$apply();
          }
      }
      )  
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
  $scope.getDependentPicklistValues();

  $scope.onCountryChange = function(){
    debugger;
        if($scope.accDetails.BillingCountry == 'India'){
            $scope.accDetails.stateList = $scope.indianStates;
        }else if($scope.accDetails.BillingCountry == 'Germany'){
            $scope.accDetails.stateList = $scope.germanStates;
        }
        $scope.$apply();
      
}

    // $scope.checkEmail = function(email,contId){
    //   debugger;
    //   $scope.emailCheck = false;
    //   if(contId == undefined){
    //     contId = "";
    //   }
    //   ApplicantPortal_Contoller.checkEmail(email,contId,function(result,event){
    //     debugger;
    //     if(event.status){
    //       debugger;
    //       if(result.length > 0){
    //         $scope.emailCheck = true;
    //       }else{
    //         $scope.emailCheck = false;
    //       }
    //       $scope.$apply();
    //     }
    //   })

    // }

    $scope.getMentorHostDetails = function(){
      debugger;
      ApplicantPortal_Contoller.getMentorHostDetails($rootScope.candidateId,$rootScope.apaId, function(result,event){
        debugger;
        if(event.status && result){
          debugger;
          if(result.Name != undefined || result.Name != ""){
            result.Name = result.Name ? result.Name.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Name;
          }
          if(result.BillingStreet != undefined || result.BillingStreet != ""){
            result.BillingStreet = result.BillingStreet ? result.BillingStreet.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.BillingStreet;
          }
          if(result.BillingCity != undefined || result.BillingCity != ""){
            result.BillingCity = result.BillingCity ? result.BillingCity.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.BillingCity;
          }
          if(result.BillingCountry != undefined || result.BillingCountry != ""){
            result.BillingCountry = result.BillingCountry ? result.BillingCountry.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.BillingCountry;
            
          }
          if(result.BillingState != undefined || result.BillingState != ""){
            result.BillingState = result.BillingState ? result.BillingState.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.BillingState;
          }
          if(result.Name_of_Mentor__c != undefined || result.Name_of_Mentor__c != ""){
            result.Name_of_Mentor__c = result.Name_of_Mentor__c ? result.Name_of_Mentor__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Name_of_Mentor__c;
          }
          if(result.Designation_Position_of_the_Mentor__c != undefined || result.Designation_Position_of_the_Mentor__c != ""){
            result.Designation_Position_of_the_Mentor__c = result.Designation_Position_of_the_Mentor__c ? result.Designation_Position_of_the_Mentor__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Designation_Position_of_the_Mentor__c;
          }
          if(result.Organisation_Posrt__c != undefined || result.Organisation_Posrt__c != ""){
            result.Organisation_Posrt__c = result.Organisation_Posrt__c ? result.Organisation_Posrt__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Organisation_Posrt__c;
          }
          $scope.accDetails = result;
          //$scope.accDetails.BillingCountry = 'Germany';

            if($scope.accDetails.BillingCountry == 'India'){
                $scope.accDetails.stateList = $scope.indianStates;
            }else if($scope.accDetails.BillingCountry == 'Germany'){
                $scope.accDetails.stateList = $scope.germanStates; 
            }
        $scope.$apply();
        }
       // $scope.accDetails.BillingCountry = 'Germany';
       if( $rootScope.IFcountry=='India'){
            $scope.accDetails.BillingCountry = 'Germany';
          }
          else{
            $scope.accDetails.BillingCountry = 'India';
          }
         $scope.$apply();
      },{escape: true}
      )
    }
    $scope.getMentorHostDetails();

    $scope.saveDetails = function(){
      debugger;
      $scope.accDetails['Shipping_State__c'] = $scope.accDetails['BillingState'];

      if($scope.accDetails.Name==undefined || $scope.accDetails.Name==""){
        swal('info','Please enter Organization Name','info');
        $("#name").addClass('border-theme');
        return;
    }
    if($scope.accDetails.BillingCountry==undefined || $scope.accDetails.BillingCountry==""){
        swal('info','Please enter Country','info');
        $("#country").addClass('border-theme');
        return;
    }
    if($scope.accDetails.BillingPostalCode==undefined || $scope.accDetails.BillingPostalCode==""){
        swal('info','Please enter Pin Code','info');
        $("#pincode").addClass('border-theme');
        return;
    }else{
    //   if($scope.accDetails.BillingCountry == "India"){
    //     if($scope.accDetails.BillingPostalCode.length != 6){
    //         swal('info','For India, pin code should be 6 digit.','info');
    //         $("#pincode").addClass('border-theme');
    //         return; 
    //     }
    // }
    }
    if($scope.accDetails.Name_of_Mentor__c==undefined || $scope.accDetails.Name_of_Mentor__c==""){
        swal('info','Please enter Name of Mentor','info');
        $("#mentor").addClass('border-theme');
        return;
    }
    if($scope.accDetails.Designation_Position_of_the_Mentor__c==undefined || $scope.accDetails.Designation_Position_of_the_Mentor__c==""){
        swal('info','Please enter Designation/Position of Mentor','info');
        $("#designation").addClass('border-theme');
        return;
    }
    if($scope.accDetails.Mentor_contact_number__c==undefined || $scope.accDetails.Mentor_contact_number__c==""){
        swal('info','Please enter Mentor contact number','info');
        $("#number").addClass('border-theme');
        return;
    }
  //   if($scope.accDetails.Mentor_contact_number__c != undefined && $scope.accDetails.Mentor_contact_number__c != ""){
  //     if($scope.accDetails.Mentor_contact_number__c.length < 10){
  //         swal(
  //             'info',
  //             'Contact No. should be 10 digit.',
  //             'info'
  //         )
  //         $("#number").addClass('border-theme');
  //         return;
  //     }
  // }
    if($scope.accDetails.Mentor_E_mail_Id__c==undefined || $scope.accDetails.Mentor_E_mail_Id__c==""){
        swal('info','Please enter Mentor email-id','info');
        $("#email").addClass('border-theme');
        return;
    }else{
      if($scope.valid($scope.accDetails.Mentor_E_mail_Id__c)){
          swal(
              'info',
              'Check Your Registered Email!',
              'info'
          );
          $("#email").addClass('border-theme');
          return;
      }
  }
  //   if($scope.emailCheck == true){
  //     swal('info','Email already exists.','info');
  //     $("#txtEmail").addClass('border-theme');
  //         return;
  // }
    if($scope.accDetails.Organisation_Posrt__c==undefined || $scope.accDetails.Organisation_Posrt__c==""){
        swal('info','Please enter Organization portfolio','info');
        return;
    }else{
      // var div = document.createElement("div");
      //         div.innerHTML = $scope.accDetails.Organisation_Posrt__c;
      //         let abstractText = div.innerText.replace(/(\r\n\t|\t|\n|\r)/gm, "");
      //         abstractText = abstractText.replaceAll(' ','');
        if($scope.objRtf[0].charCount > 250){
          swal('info','Max character limit for Brief Portfolio of the organisation is 250 only','info');
          return;
        }
      }

      delete ($scope.accDetails['stateList']);


      ApplicantPortal_Contoller.saveMentorHostDetails($scope.accDetails,$rootScope.candidateId,$rootScope.proposalId,$rootScope.apaId, function(result,event){
          if(event.status){
              debugger;
              Swal.fire(
                  'Success',
                  'Your Host details have been saved successfully.',
                  'success'
              );
              //$scope.redirectPageURL('Parent_Organization');//Commented By Karthik
               $scope.redirectPageURL('ProjectDetailIF');
              $scope.accDetails = result;
              $scope.$apply();
          }
      },
     {escape: true}
      )
  }

  $scope.redirectPageURL=function(URL){
        var link=document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href='#/'+URL+'';
        link.click();
      }

  $scope.clickPreviousFellowshipDetails=function(){
    var link=document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        //link.href="#/PersonalInformationIF";//Commented By Karthik
        link.href="#/AchievementsIF";
        link.click();
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

$scope.removeClass=function(controlid){
  $("#"+controlid+"").removeClass('border-theme');
}

$scope.checkPinCode = function(){
  debugger;
  if($scope.accDetails.BillingCountry == "India"){
    if($scope.accDetails.BillingPostalCode.length > 6){
      swal('info','For India, pin code should be 6 digit.','info');
      $("#pincode").addClass('border-theme');
    return;
    }
  }
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

});

    
// $scope.getContactDet=function(){
//     IndustrialFellowshipController.getContactDetailsFellowDet($rootScope.userId, function (result, event) {
//       debugger;
//             console.log(result);
//             console.log(event);
//             if(result.Proposals__r!=undefined && result.Proposals__r!=''){
//                 $scope.objProposal=result.Proposals__r;
//             }
//             $scope.objIndFell=result;
//             if(result.Contacts1__r!=undefined && result.Contacts1__r!=''){
//                 $scope.objContact1=result.Contacts1__r[0];   
//             }
//             else{
//                 $scope.objContact1={
//                     Host_Details__c:result.Id,
//                     MailingStreet:""
//                 };              
//             }
//             if(result.Contacts__r!=undefined && result.Contacts__r!=''){
//                 $scope.objContacts__r=result.Contacts__r[0];                
//             }
//             else
//             {
//                 $scope.objContacts__r={
//                     Mentor_Details__c:result.Id,
//                     MailingStreet:""
//                 };                
//             }
//             if($scope.objContacts__r.MailingCountry == 'India'){
//               $scope.objContacts__r.stateList = $scope.indianStates;
//           }else if($scope.objContacts__r.MailingCountry == 'Germany'){
//               $scope.objContacts__r.stateList = $scope.germanStates; 
//           }
          
//           if($scope.objContact1.MailingCountry == 'India'){
//             $scope.objContact1.stateList1 = $scope.indianStates;
//         }else if($scope.objContact1.MailingCountry == 'Germany'){
//             $scope.objContact1.stateList1 = $scope.germanStates; 
//         }
//             var mailingAddress=$scope.objContacts__r.MailingStreet;
//                 if(mailingAddress!=undefined && mailingAddress!=''){
//                   var arrMA =mailingAddress.split(';');
//                   $scope.MailingLine1=arrMA[0];
//                   if(arrMA.length>0){
//                     $scope.MailingLine2=arrMA[1];
//                   }
//                 }
//                 var mailingAddress2=$scope.objContact1.MailingStreet;
//                 if(mailingAddress2!=undefined && mailingAddress2!=''){
//                   var arrMA =mailingAddress2.split(';');
//                   $scope.OtherLine1=arrMA[0];
//                   if(arrMA.length>0){
//                     $scope.OtherLine2=arrMA[1];
//                   }
//                 }                     
//             $scope.country=$rootScope.country;
//             $scope.$apply();
//             if(result.Proposals__r.Research_Approach_Objectives__c != undefined || result.Proposals__r.Research_Approach_Objectives__c != ""){
//               result.Proposals__r.Research_Approach_Objectives__c = result.Proposals__r.Research_Approach_Objectives__c ? result.Proposals__r.Research_Approach_Objectives__c.replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.Proposals__r.Research_Approach_Objectives__c;
//           }

//     },{ escape: true });
// }
// $scope.setAddressSameAs=function(){
//     if($scope.objContacts__r.Addess_same_as__c){
//       $scope.objContacts__r.OtherStreet=$scope.objContacts__r.MailingStreet;
//       $scope.OtherLine22=$scope.MailingLine2;
//       $scope.objContacts__r.OtherCity=$scope.objContacts__r.MailingCity;
//       $scope.objContacts__r.OtherState=$scope.objContacts__r.MailingState;
//       $scope.objContacts__r.OtherCountry=$scope.objContacts__r.MailingCountry;
//       $scope.objContacts__r.OtherPostalCode=$scope.objContacts__r.MailingPostalCode;
//     }
//     else
//     {
//       $scope.objContacts__r.OtherStreet=null;
//       $scope.OtherLine22=null;
//       $scope.objContacts__r.OtherCity=null;
//       $scope.objContacts__r.OtherState=null;
//       $scope.objContacts__r.OtherCountry=null;
//       $scope.objContacts__r.OtherPostalCode=null;
//     }
//   }
//   $scope.setAddressSameAsHost=function(){
//     if($scope.objContact1.Addess_same_as__c){
//       $scope.objContact1.OtherStreet=$scope.objContact1.MailingStreet;
//       $scope.OtherLine223=$scope.MailingStreet3;
//       $scope.objContact1.OtherCity=$scope.objContact1.MailingCity;
//       $scope.objContact1.OtherState=$scope.objContact1.MailingState;
//       $scope.objContact1.OtherCountry=$scope.objContact1.MailingCountry;
//       $scope.objContact1.OtherPostalCode=$scope.objContact1.MailingPostalCode;
//     }
//     else
//     {
//       $scope.objContact1.OtherStreet=null;
//       $scope.OtherLine223=null;
//       $scope.objContact1.OtherCity=null;
//       $scope.objContact1.OtherState=null;
//       $scope.objContact1.OtherCountry=null;
//       $scope.objContact1.OtherPostalCode=null;
//     }
//   }
//   $scope.redirectPageURL=function(URL){
//     var link=document.createElement("a");
//     link.id = 'someLink'; //give it an ID!
//     link.href='#/'+URL+'';
//     link.click();
//   }
// $scope.clickFellowshipDetails=function(){
//   debugger;
//   if($rootScope.proposalStage){
//     $scope.redirectPageURL('EduQualificationIF');
//     return; 
// }
//   if($scope.objContacts__r.FirstName==undefined || $scope.objContacts__r.FirstName==''){
//     swal('info','Please enter mentor first name','info');
//     $("#txtFName").addClass('border-theme');
//     return;
//   }
//   if($scope.objContacts__r.LastName==undefined || $scope.objContacts__r.LastName==''){
//     swal('info','Please enter mentor last name','info');
//     $("#txtLName").addClass('border-theme');
//     return;
//   } 
//   if($scope.objContacts__r.Email == undefined || $scope.objContacts__r.Email == ''){
//     swal('info',"Please Enter Mentor's Email",'info');
//     $("#txtEmail").addClass('border-theme');
//     return;
// }else{
//     if($scope.valid($scope.objContacts__r.Email)){
//       swal('info','Check Your Registered Email.','info');
//         $("#txtEmail").addClass('border-theme');
//         return;
//     }
// }

// if($scope.objContact1.Position_of_the_Mentor__c==undefined || $scope.objContact1.Position_of_the_Mentor__c==''){
//   swal('info','Please enter Designation/Position of the Mentor','info');
//   $("#hostPosition").addClass('border-theme');
//   return;
// }

//   if($scope.objContact1.FirstName==undefined || $scope.objContact1.FirstName==''){
//       swal('info','Please enter host first name','info');
//       $("#hostFName").addClass('border-theme');
//       return;
//     }
//     if($scope.objContact1.LastName==undefined || $scope.objContact1.LastName==''){
//       swal('info','Please enter host last name','info');
//       $("#hostLName").addClass('border-theme');
//       return;
//     }

//   if($scope.objContact1.Email == undefined || $scope.objContact1.Email == ''){
//     swal('info','Please enter host Email.','info');
//           $("#txtEmail2").addClass('border-theme');
//           return;
//     }else{
//       if($scope.valid($scope.objContact1.Email)){
//         swal('info','Check Your Registered Email.','info');
//           $("#txtEmail2").addClass('border-theme');
//           return;
//       }
// }

// if($scope.emailCheck == true){
//   swal('info','Email already exists.','info');
//   $("#txtEmail").addClass('border-theme');
//       return;
// }

// if($scope.emailCheck2 == true){
//   swal('info','Email already exists.','info');
//   $("#txtEmail2").addClass('border-theme');
//       return;
// }

// if($scope.objContact1.Email == $scope.objContacts__r.Email){
//   swal('info','Mentor and Host Email are same please check.','info');
//   $("#txtEmail2").addClass('border-theme');
//       return;
// }

// $scope.objContacts__r['State__c'] = $scope.objContacts__r['MailingState'];
// $scope.objContact1['State__c'] = $scope.objContact1['MailingState'];

//     $scope.objContactList.push($scope.objContact1);
//     $scope.objContactList.push($scope.objContacts__r);

//     for(var i=0;i<$scope.objContactList.length;i++){
//       if($scope.objContactList[i].stateList != undefined){
//         delete ($scope.objContactList[i].stateList);
//       }else if($scope.objContactList[i].stateList1 != undefined){
//         delete ($scope.objContactList[i].stateList1);
//       }
//     }
//     delete $scope.objIndFell.Contacts__r;
//     delete $scope.objIndFell.Contacts1__r;
    
//     IndustrialFellowshipController.saveFellowshipDetails($rootScope.userId,$scope.objContactList,$scope.objIndFell, function (result, event) {
//             console.log(result);
//             console.log(event);
//             if (event.status) {
//                 swal({
//                   title: "Mentor/Host Details",
//                   text: result,
//                   icon: "success",
//                   button: "ok!",
//                 }).then((value) => {
//                       $scope.redirectPageURL('EduQualificationIF');
//                     });
//               }

//     },{ escape: true });
// }