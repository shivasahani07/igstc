angular.module('cp_app').controller('ProjectHandleGrantPageCtrl', function($scope,$rootScope){
     $rootScope.projectId;
     $scope.ExistingGranttList = [];
     $scope.inputToPass = [];
     $scope.AccountName;
     $scope.startDate;
     $scope.eg = [];
     $rootScope.userId;

     debugger;
     $scope.getExistingGrantDetails = function(){
          HostProjectDetailController.getgarntList($rootScope.userId, function(result, event){
               debugger;
              if(event.status && result !=null){
                    if(result.Existing_Grants__r == undefined){
                         result.Existing_Grants__r = [{
                              "Name": "",
                              "Title__c": "",
                              "Funding_Agency__c": "",
                              "Budget__c":"",
                              "Starting_Date__c":"",
                              "Duration__c":"",
                              "Account__c": result.Id
                          }];
                         
               }

                    if(result.Existing_Grants__r != undefined){
                         for (let j = 0; j < result.Existing_Grants__r.length; j++) {
                              if(result.Existing_Grants__r[j].Starting_Date__c != undefined && result.Existing_Grants__r[j].Starting_Date__c != ""){
                                   result.Existing_Grants__r[j].Starting_Date__c = new Date(result.Existing_Grants__r[j].Starting_Date__c);
                                }
                         }
                    }

               $scope.inputToPass.push(result);
                  
              }
              $scope.$apply();
          },
          {escape: true}
          )
     }

     $scope.getExistingGrantDetails();

     $scope.addRowsWorkPackage = function () {
          debugger;

                    $scope.inputToPass[0].Existing_Grants__r.push({

                         "Name": "",
                         "Title__c": "",
                         "Funding_Agency__c": "",
                         "Budget__c":"",
                         "Starting_Date__c":"",
                         "Duration__c":"",
                         "Account__c": $scope.inputToPass[0].Id
                     });
              
          }
        
      
      

      // Delete

      $scope.removeRow = function (index) {
          debugger;
          if ($scope.inputToPass[0].Existing_Grants__r[index].length == 1) {
              return;
          }
          if($scope.inputToPass[0].Existing_Grants__r[index].Id == undefined){
               $scope.inputToPass[0].Existing_Grants__r.splice(index, 1);
              return;
          }
          HostProjectDetailController.deleteExistGrant($scope.inputToPass[0].Existing_Grants__r[index].Id, function (result, event) {
             //  alert("Method Called")
              if (event.status && result !=null) {
                 // swal("Success", "Record Deleted Successfully");
                  $scope.inputToPass[0].Existing_Grants__r.splice(index, 1);
                  console.log("$scope.ExistingGranttList ::"+$scope.inputToPass)
              }
              $scope.$apply();
          });
      }

       // Delete


       $scope.previousPage = function(){
          debugger;
          $scope.redirectPageURL('TwoReferenceWiser');
          // window.location.replace(window.location.origin+'/ApplicantDashboard/ApplicantPortal?id='+$rootScope.userId+'#/TwoReferenceWiser');
       }

      $scope.saveParticipants = function(index){
          debugger;

               var startDay =0;
               var startMonth =0;
               var startYear =0;
               var today = new Date();
               var dd = today.getDate();
               var mm = today.getMonth() + 1; //January is 0!
               var yyyy = today.getFullYear();
               $scope.accountList = [];
               $scope.hostFromAccount = [];
             
               for(var i=0;i<$scope.inputToPass.length;i++){
                    $scope.accountList.push($scope.inputToPass[i]);
                    for(let j=0;j<$scope.accountList[i].Existing_Grants__r.length;j++){
                         $scope.hostFromAccount.push($scope.accountList[i].Existing_Grants__r[j]);
                    }
               }

               for(var i=0;i<$scope.hostFromAccount.length;i++){
                    if($scope.hostFromAccount[i].Title__c == undefined || $scope.hostFromAccount[i].Title__c == ""){
                         swal("info", "Please enter title.","info");
                         // $("#title").addClass('border-theme');
                         $("#title"+i+"").addClass('border-theme');
                         return;
                    }
                    if($scope.hostFromAccount[i].Funding_Agency__c == undefined || $scope.hostFromAccount[i].Funding_Agency__c == ""){
                         swal("info", "Please enter funding agency.","info");
                         // $("#funding").addClass('border-theme');
                         $("#funding"+i+"").addClass('border-theme');
                         return;
                    }
                    if($scope.hostFromAccount[i].Budget__c == undefined || $scope.hostFromAccount[i].Budget__c == ""){
                         swal("info", "Please enter budget.","info");
                         // $("#budget").addClass('border-theme');
                         $("#budget"+i+"").addClass('border-theme');
                         return;
                    }
                    if($scope.hostFromAccount[i].Starting_Date__c == undefined || $scope.hostFromAccount[i].Starting_Date__c == ""){
                         swal("info", "Please enter starting date.","info");
                         // $("#startDate").addClass('border-theme');
                         $("#startDate"+i+"").addClass('border-theme');
                         return;
                    }
                    if($scope.hostFromAccount[i].Starting_Date__c > today){
                         swal("info", "Starting date should not be future date.","info");
                         // $("#startDate").addClass('border-theme');
                         $("#startDate"+i+"").addClass('border-theme');
                         return; 
                    }
                    if($scope.hostFromAccount[i].Duration__c == undefined || $scope.hostFromAccount[i].Duration__c == ""){
                         swal("info", "Please enter duration.","info");
                         // $("#duration").addClass('border-theme');
                         $("#duration"+i+"").addClass('border-theme');
                         return;
                    }
               }


          for(var i=0; i<$scope.hostFromAccount.length;i++){
               delete($scope.hostFromAccount[i]['$$hashKey']);
               var EGRecord = {"startDay":0,"startMonth":0,"startYear":0,"accId":$scope.hostFromAccount[i].Account__c,
               EGList:{
                Id:$scope.hostFromAccount[i].Id,"Title__c":$scope.hostFromAccount[i].Title__c,"Funding_Agency__c":$scope.hostFromAccount[i].Funding_Agency__c,
                "Budget__c":$scope.hostFromAccount[i].Budget__c,"Duration__c":$scope.hostFromAccount[i].Duration__c,Account__c:$scope.hostFromAccount[i].Account__c,
                "Name": $scope.hostFromAccount[i].Name
               }};
              
               if($scope.hostFromAccount[i].Starting_Date__c != undefined && $scope.hostFromAccount[i].Starting_Date__c != ''){
                    console.log("Date::"+ $scope.hostFromAccount[i].Starting_Date__c.getUTCFullYear());
                    EGRecord.startYear = $scope.hostFromAccount[i].Starting_Date__c.getUTCFullYear();
                    EGRecord.startMonth = $scope.hostFromAccount[i].Starting_Date__c.getUTCMonth()+1;
                    EGRecord.startDay = $scope.hostFromAccount[i].Starting_Date__c.getDate();
               }
               $scope.eg.push(EGRecord);
          }
          HostProjectDetailController.insertExistingGrantsListApex($scope.eg, function(result,event){
               if(event.status && result !=null){
                    console.log("Result ::"+result);
                   
                   
                    swal({
                         title: "Success",
                         text:  'Your Existing Grant has been saved successfully.',
                         icon: "success",
                       button: "ok!",
                  });
                  $scope.redirectPageURL('CV_Wiser');
                  
          // window.location.replace('https://dev-igstc.cs114.force.com/ApplicantDashboard/ApplicantPortal?id='+$rootScope.userId+'#/AttachmentsInWiser');
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