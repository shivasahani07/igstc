


angular.module('cp_app').controller('twoReferencePageCtrl', function($scope,$rootScope){
     debugger;
     $rootScope.userId;
     $rootScope.conId;
     $rootScope.projectId;
     $scope.ParticipantList = [];
     $rootScope.userId;
     $scope.listOfIds = [];
     var mapForIndex = new Map();
     var indexNum;

     debugger;


     function getKeyByValue(object, value) {
          return Object.keys(object).find(key => object[key] === value);
        }
        
        
        var map = {"first" : "1", "second" : "2"};
        console.log(getKeyByValue(map,"2"));

     $scope.checkEmail = function(){
          $scope.emailList = [];
          $scope.uppercaseEmailList = [];
          debugger;
          $scope.emailCheck = false;

          for(var i=0;i<$scope.ParticipantList.length;i++){
               if($scope.ParticipantList[i].Name == undefined || $scope.ParticipantList[i].Name == ""){
                    swal("info", "Please Enter Reference name.","info");
                    $("#name"+i+"").addClass('border-theme');
                    return;  
               }
               if($scope.ParticipantList[i].Designation__c == undefined || $scope.ParticipantList[i].Designation__c == ""){
                    swal("info", "Please Enter Designation.","info");
                    $("#designation"+i+"").addClass('border-theme');
                    return;  
               }
               if($scope.ParticipantList[i].Organisation_Institute__c == undefined || $scope.ParticipantList[i].Organisation_Institute__c == ""){
                    swal("info", "Please Enter Organisation/Institute.","info");
                    $("#organisation"+i+"").addClass('border-theme');
                    return;  
               }
               if($scope.ParticipantList[i].Email__c == undefined || $scope.ParticipantList[i].Email__c == ""){
                    swal("info", "Please Enter Email.","info");
                    $("#email"+i+"").addClass('border-theme');
                    return;  
               }else{
                    if($scope.valid($scope.ParticipantList[i].Email__c)){
                        swal(
                            'info',
                            'Check Your Registered Email!',
                            'info'
                        )
                        $("#email"+i+"").addClass('border-theme');
                        return;
                    }
                }
         }


          for(var i=0;i<$scope.ParticipantList.length;i++){
               if($scope.emailList.indexOf($scope.ParticipantList[i].Email__c) != -1){
                    swal("info", "DUPLICATE Reference Email, Please check.","info");
                    $("#email"+i+"").addClass('border-theme');
                    return;
               }
               else{
                    $scope.emailList.push($scope.ParticipantList[i].Email__c);
               }
               if($scope.ParticipantList[i].Id != undefined){
                    $scope.listOfIds.push($scope.ParticipantList[i].Id);
               }
            }

            for(var i=0;i<$scope.ParticipantList.length;i++){
               if($scope.ParticipantList[i].Email__c != undefined || $scope.ParticipantList[i].Email__c != ""){
                    $scope.uppercaseEmailList.push($scope.ParticipantList[i].Email__c.toUpperCase());
                    if(!mapForIndex.has($scope.ParticipantList[i].Email__c.toUpperCase())){
                         mapForIndex.set($scope.ParticipantList[i].Email__c.toUpperCase(),i);
                    }else{
                         indexNum = parseInt(mapForIndex.get($scope.ParticipantList[i].Email__c.toUpperCase()));
                    }
               }
            }

            for(var j=0;j<$scope.uppercaseEmailList.length;j++){
               if($scope.uppercaseEmailList.indexOf($scope.uppercaseEmailList[j].toUpperCase()) == -1){
                    swal("info", "DUPLICATE Reference Email, Please check.","info");
                  //  var indexNo = getKeyByValue(mapForIndex,$scope.uppercaseEmailList[j].toUpperCase());
                    $("#email"+indexNum+"").addClass('border-theme');
                    return;
               }
            }
          ApplicantPortal_Contoller.checkReferenceEmail($scope.emailList,$scope.listOfIds,function(result,event){
            debugger;
            debugger;
            if(event.status){
              debugger;
              if(result.length > 0){
                $scope.emailCheck = true;
              }else{
                $scope.emailCheck = false;
              }
              $scope.saveParticipants();
              $scope.$apply();
            }
          })
    
        }


     $scope.getTwoReferenceDetailsWiser = function(){
          ApplicantPortal_Contoller.getProposalDetailsReferences($rootScope.projectId, function(result, event){
               debugger;
              if(event.status && result !=null){
               if(result.length == 0){
                    $scope.ParticipantList = [{"Name": "", "Designation__c": "", "Organisation_Institute__c":"", "Phone__c":"", "Email__c":"", "Proposals__c":$rootScope.projectId}]
               }else{
                    for(var i=0;i<result.length;i++){
                         if(result[i].Name != undefined || result[i].Name != ''){
                              result[i].Name = result[i].Name ? result[i].Name.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result[i].Name;  
                         }
                         if(result[i].Designation__c != undefined || result[i].Designation__c != ''){
                              result[i].Designation__c = result[i].Designation__c ? result[i].Designation__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result[i].Designation__c;  
                         }
                         if(result[i].Organisation_Institute__c != undefined || result[i].Organisation_Institute__c != ''){
                              result[i].Organisation_Institute__c = result[i].Organisation_Institute__c ? result[i].Organisation_Institute__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : result[i].Organisation_Institute__c;  
                         }
                    }
                    $scope.ParticipantList = result;
               }
               $scope.$apply();
              }
          },
          {escape: true}
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
                    "Organisation_Institute__c":"",
                    "Phone__c":"",
                    "Email__c":"",
                    "Proposals__c":$rootScope.projectId
                });
          // }
      
      }

      $scope.previousPage = function(){
          $scope.redirectPageURL('FinancialOverview_wiser');
          // window.location.replace(window.location.origin+'/ApplicantDashboard/ApplicantPortal?id='+$rootScope.userId+'#/HostProjectDetails');
      }

      $scope.deleteRowsWorkPackage = function(index){
          debugger;
          if($scope.ParticipantList.length >0){
               if($scope.ParticipantList[index].Id != undefined){
                    ApplicantPortal_Contoller.deleteParticipantsReferences($scope.ParticipantList[index].Id , function(result, event){
                         if(event.status){
                              $scope.ParticipantList.splice(index,1);
                              swal({
                                   title: "Details Deleted",
                                   text:  'Your Details deleted successfully.',
                                   icon: "success",
                                 button: "ok!",
                            });
                            $scope.$apply();
                         }
                    })
               }else{
                    $scope.ParticipantList.splice(index,1);
               }
          }
      }

      $scope.saveParticipants = function(){
          debugger;
          //var ind = indexNum-1;

          // if($scope.emailCheck == true){
          //      swal('info','Email already exists.','info');
          //      $("#email"+ind+"").addClass('border-theme');
          //          return;
          //  }

          for(var i=0;i<$scope.ParticipantList.length;i++){
               if($scope.ParticipantList[i].Name == undefined || $scope.ParticipantList[i].Name == ""){
                    swal("info", "Please Enter Reference name.","info");
                    $("#name"+i+"").addClass('border-theme');
                    return;  
               }
               if($scope.ParticipantList[i].Designation__c == undefined || $scope.ParticipantList[i].Designation__c == ""){
                    swal("info", "Please Enter Designation.","info");
                    $("#designation"+i+"").addClass('border-theme');
                    return;  
               }
               if($scope.ParticipantList[i].Organisation_Institute__c == undefined || $scope.ParticipantList[i].Organisation_Institute__c == ""){
                    swal("info", "Please Enter Organisation/Institute.","info");
                    $("#organisation"+i+"").addClass('border-theme');
                    return;  
               }
               if($scope.ParticipantList[i].Email__c == undefined || $scope.ParticipantList[i].Email__c == ""){
                    swal("info", "Please Enter Email.","info");
                    $("#email"+i+"").addClass('border-theme');
                    return;  
               }else{
                    if($scope.valid($scope.ParticipantList[i].Email__c)){
                        swal(
                            'info',
                            'Check Your Registered Email!',
                            'info'
                        )
                        $("#email"+i+"").addClass('border-theme');
                        return;
                    }
                }
         }
           
          for(var i=0; i<$scope.ParticipantList.length;i++){
               delete($scope.ParticipantList[i]['$$hashKey']);
          }
          if($scope.ParticipantList.length < 2){
               swal("Max Reference Limit", "Add one more 'Reference'.");
               return;  
           }
          ApplicantPortal_Contoller.insertParticipantsReferences($scope.ParticipantList, $rootScope.projectId, function(result, event){
              
               if(event.status && result !=null){
                    console.log('Result ::'+result);
                    swal({
                         title: "Details Saved",
                         text:  'Reference details have been saved successfully.',
                         icon: "success",
                       button: "ok!",
                  });
                  $scope.redirectPageURL('ExistingGrantWISER');
               //    window.location.replace(window.location.origin+'/ApplicantDashboard/ApplicantPortal?id='+$rootScope.userId+'#/ProjectHandleGrantApplicationWiser');
               }else{
                    swal({
                         title: "Error",
                         text: "Exception!",
                         icon: "error",
                         button: "ok!",
                       });
               }
          })
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

      $scope.redirectPageURL = function(pageName){
          debugger;
          var link=document.createElement("a");
          link.id = 'someLink'; //give it an ID!
          link.href="#/"+pageName;
          link.click();
      }

      $scope.removeClass=function(controlid,index){

          var controlIdfor=controlid+""+index;

          $("#"+controlIdfor+"").removeClass('border-theme');

        }

});