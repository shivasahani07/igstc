angular.module('cp_app').controller('EmploymentDetails_Ctrl', function($scope,$rootScope) {
  $scope.objContact={};    
  $scope.empDetails=[];
  $scope.showFellCurr=false;
  $scope.showIGSTCProg=false;
   $rootScope.proposalId;
    
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
    
  $scope.objRtf=[{charCount:0,maxCharLimit:500,errorStatus:false}];
  $scope.available_followship=$rootScope.available_followship;
          $scope.associated_with_igstc=$rootScope.associated_with_igstc;
          $scope.nature_of_Job=$rootScope.nature_of_Job;
  $scope.getCotactDetailOnLoad=function(){
      IndustrialFellowshipController.getContactEmployement($rootScope.candidateId,$rootScope.apaId, function (result, event) {
        console.log('data employment detail');  
        console.log(result);
          console.log(event);
          debugger
          if(result!=null){
            if(result.Name==undefined){
            if(result[0].Name=="WISER" || result[0].Name=="SING" || result[0].Name=="PECFAR" || result[0].Name=="2+2 Call" || result[0].Name=="Industrial Fellowships" || result[0].Name=="Workshop"){
              $scope.getCotactDetailOnLoad();
            }
          }else{
            if(result.Availing_Fellowship__c=="Yes"){
              $scope.showFellCurr=true;
            }
            if(result.Associated_with_IGSTC__c=="Yes"){
              $scope.showIGSTCProg=true;
            }
            if(result.Previous_industrial_internship__c!=undefined)
            result.Previous_industrial_internship__c = result.Previous_industrial_internship__c ? result.Previous_industrial_internship__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.Previous_industrial_internship__c;

            if(result.Fellowship_Details__c!=undefined)
            result.Fellowship_Details__c = result.Fellowship_Details__c ? result.Fellowship_Details__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.Fellowship_Details__c;

            if(result.Associated_Details__c!=undefined)
            result.Associated_Details__c = result.Associated_Details__c ? result.Associated_Details__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.Associated_Details__c;

            if(result.Abstract_of_Ongoing_Work__c!=undefined)
            result.Abstract_of_Ongoing_Work__c = result.Abstract_of_Ongoing_Work__c ? result.Abstract_of_Ongoing_Work__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result.Abstract_of_Ongoing_Work__c;

            $scope.objContact=result;
         
          if(result.Employment_Details__r==undefined){
            $scope.empDetails.push({
              "Position__c": " ",
              "Organization_Name__c": " ",
              "Nature_of_Job__c": " ",
              "Start_Date__c":"",
              "End_Date__c":"",
              "Contact__c":$rootScope.contactId
          });
          }
          else{
            for(var i=0;i<result.Employment_Details__r.length;i++){
              $scope.empDetails.push(result.Employment_Details__r[i]);

              if(result.Employment_Details__r[i].Start_Date__c != undefined || result.Employment_Details__r[i].Start_Date__c != ''){
                $scope.empDetails[i].Start_Date__c = $scope.empDetails[i].Start_Date__c ? $scope.empDetails[i].Start_Date__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.empDetails[i].Start_Date__c;  
            }

            if(result.Employment_Details__r[i].End_Date__c != undefined || result.Employment_Details__r[i].End_Date__c != ''){
                $scope.empDetails[i].End_Date__c = $scope.empDetails[i].End_Date__c ? $scope.empDetails[i].End_Date__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.empDetails[i].End_Date__c;  
            }

            if(result.Employment_Details__r[i].Position__c != undefined || result.Employment_Details__r[i].Position__c != ''){
                $scope.empDetails[i].Position__c = $scope.empDetails[i].Position__c ? $scope.empDetails[i].Position__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.empDetails[i].Position__c;  
            }

            if(result.Employment_Details__r[i].Organization_Name__c != undefined || result.Employment_Details__r[i].Organization_Name__c != ''){
                $scope.empDetails[i].Organization_Name__c = $scope.empDetails[i].Organization_Name__c ? $scope.empDetails[i].Organization_Name__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.empDetails[i].Organization_Name__c;  
            }

            if(result.Employment_Details__r[i].Nature_of_Job__c != undefined || result.Employment_Details__r[i].Nature_of_Job__c != ''){
                $scope.empDetails[i].Nature_of_Job__c = $scope.empDetails[i].Nature_of_Job__c ? $scope.empDetails[i].Nature_of_Job__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.empDetails[i].Nature_of_Job__c;  
            }
          }
           
          }
          $scope.$apply();
          }
          }
          
      });
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
  $scope.getCotactDetailOnLoad();
  $scope.redirectPageURL=function(URL){
    var link=document.createElement("a");
    link.id = 'someLink'; //give it an ID!
    link.href='#/'+URL+'';
    link.click();
  }
  $scope.clickEmploymentDetails=function(){
    if($rootScope.proposalStage){
     // $scope.redirectPageURL('ProjectDetailIF'); Commented By Karthik
      $scope.redirectPageURL('AchievementsIF');

      return;
    }
  debugger;
  $scope.empList = [];
    for(let i=0; i<$scope.empDetails.length; i++){

      var emp = {employmentDetails:{
        "Position__c":$scope.empDetails[i].Position__c,"Organization_Name__c":$scope.empDetails[i].Organization_Name__c,
        "Id":$scope.empDetails[i].Id,"Start_Date__c":$scope.empDetails[i].Start_Date__c,"End_Date__c":$scope.empDetails[i].End_Date__c,"Nature_of_Job__c":$scope.empDetails[i].Nature_of_Job__c,"Contact__c":$rootScope.contactId
      }
        };

    $scope.empList.push(emp);

        if($scope.objContact.Abstract_of_Ongoing_Work__c != undefined || $scope.objContact.Abstract_of_Ongoing_Work__c != ""){
          // var div = document.createElement("div");
          //   div.innerHTML = $scope.objContact.Abstract_of_Ongoing_Work__c;
          //   let abstractText = div.innerText.replace(/(\r\n\t|\t|\n|\r)/gm, "");
          //   abstractText = abstractText.replaceAll(' ','');
      if($scope.objRtf[0].charCount > 500){
        swal('info','Max character limit for Abstract for ongoing work is 500 only','info');
        return;
      }
        }
    }
      delete $scope.objContact.Employment_Details__r;
      IndustrialFellowshipController.saveContactEmployement($rootScope.candidateId,$scope.objContact,$scope.empList,$rootScope.apaId, function (result, event) {
          debugger;
          console.log(result);
          console.log(event);
          if (event.status) {
              swal({
                title: "Employment Details",
                text: result,
                icon: "success",
                button: "ok!",
              }).then((value) => {                
                 // $scope.redirectPageURL('ProjectDetailIF'); Commented By Karthik
                  $scope.redirectPageURL('AchievementsIF');
                  });
            }
            else
            {
              swal({
                title: "Employment Details",
                text: "Exception!",
                icon: "error",
                button: "ok!",
              });
            }
      });
  }
  $scope.addEmp=function(){
    debugger;
        $scope.empDetails.push({
            "Contact__c":$rootScope.contactId,
            employmentDetails:{"Position__c":"","Organization_Name__c":"","Nature_of_Job__c":"","Contact__c":$rootScope.contactId
        }});
}

$scope.removeEmployment = function (index) {
    debugger;
    if ($scope.empDetails.length == 1) {
        return;
    }
    if($scope.empDetails[index].Id == undefined){
        $scope.empDetails.splice(index, 1);
        return;
    }
    ApplicantPortal_Contoller.deleteEmployment($scope.empDetails[index].Id, function (result, event) {
        if (event.status) {
            swal("Employment Details", "Employment Deleted Successfully");
            $scope.empDetails.splice(index, 1);
        }
        $scope.$apply();
    });
}
$scope.setOthers=function(chkVal,index){
  if(chkVal){
    for(var i=0;i<$scope.empDetails.length;i++){
      if(index!=i){
        $scope.empDetails[i].current_employement__c=false;
        $("#end"+i+"").removeAttr('disabled');  
      }
      else{
        $scope.empDetails[i].End_Date__c=new Date();
        $("#end"+index+"").attr('disabled',true);                
      }
    }
    $scope.$apply();
  }
}
$scope.showHideDetailField=function(fFlag){
  debugger
  if(fFlag=='f'){
  if($scope.objContact.Availing_Fellowship__c=="Yes"){
    $scope.showFellCurr=true;
  }
  else
  {
    $scope.showFellCurr=false;
  }
}
else
{
  if($scope.objContact.Associated_with_IGSTC__c=="Yes"){
    $scope.showIGSTCProg=true;
  }
  else
  {
    $scope.showIGSTCProg=false;
  }
}
}
  $scope.clickPreviousEmploymentDetails=function(){
      var link=document.createElement("a");
                    link.id = 'someLink'; //give it an ID!
                    link.href="#/EduQualificationIF";
                    link.click();
  }
  $scope.removeClass=function(controlid,index){
    var controlIdfor=controlid+""+index;
    $("#"+controlIdfor+"").removeClass('border-theme');
  }
});