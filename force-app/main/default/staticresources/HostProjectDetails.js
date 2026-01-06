angular.module('cp_app').controller('HostProjectDetailInWiserCtrl', function ($scope, $rootScope) {
     $scope.objContact = {};
     $rootScope.projectId;
     $scope.startdate;
     $scope.enddate;
     $scope.objRtf = [{ charCount: 0, maxCharLimit: 700, errorStatus: false }];

     $rootScope.proposalStage;
     $rootScope.candidateId;

     // Get proposalId from LocalStorage
     if (localStorage.getItem('proposalId')) {
          $rootScope.proposalId = localStorage.getItem('proposalId');
          console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
     }

     // Get yearlyCallId from LocalStorage
     if (localStorage.getItem('yearlyCallId')) {
          $rootScope.yearlyCallId = localStorage.getItem('yearlyCallId');
          console.log('Loaded yearlyCallId from localStorage:', $rootScope.yearlyCallId);
     }

     $scope.getContactHostInfo = function () {
          debugger;
          $scope.pairingDetails = [];
          // IndustrialFellowshipController.getHostProjectDetails($rootScope.candidateId, function (result, event) {
          IndustrialFellowshipController.getHostProjectDetails($rootScope.proposalId, function (result, event) {
               debugger;
               if (event.status && result != null) {
                    if (result.Actual_Application_Start_Date__c != null) {
                         result.Actual_Application_Start_Date__c = new Date(result.Actual_Application_Start_Date__c);
                    }
                    if (result.Actual_Application_End_Date__c != null) {
                         result.Actual_Application_End_Date__c = new Date(result.Actual_Application_End_Date__c);
                    }
                    if (result.Host_Project_Title__c != undefined || result.Host_Project_Title__c != "") {
                         result.Host_Project_Title__c = result.Host_Project_Title__c ? result.Host_Project_Title__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Host_Project_Title__c;
                    }
                    if (result.Host_Funding_Source__c != undefined || result.Host_Funding_Source__c != "") {
                         result.Host_Funding_Source__c = result.Host_Funding_Source__c ? result.Host_Funding_Source__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Host_Funding_Source__c;
                    }
                    if (result.Host_Abstract_Of_Project__c != undefined || result.Host_Abstract_Of_Project__c != "") {
                         result.Host_Abstract_Of_Project__c = result.Host_Abstract_Of_Project__c ? result.Host_Abstract_Of_Project__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Host_Abstract_Of_Project__c;
                    }
                    $scope.objContact = result;
                    $scope.$apply();
               }

          });
     }
     $scope.getContactHostInfo();
     $scope.previousPage = function () {
          debugger;
          $scope.redirectPageURL('FinancialOverview_wiser');
          // window.location.replace(window.location.origin+'/ApplicantDashboard/ApplicantPortal?id='+$rootScope.userId+'#/FinancialOverview_wiser');

     }
     $scope.readCharacter = function (event, index) {
          debugger
          try {
               var rtfString = event.toString().replace(/<[^>]*>|\s/g, '').replace(/\s+/g, '').replace(/&ndash;/g, '-').replace(/&euro;/g, '1').replace(/&amp;/g, '1').replace(/&#39;/g, '1').replace(/&quot;/g, '1').replace(/&nbsp;/g, '').replace(/&mdash;/g, '-').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&bull;/g, '');
               charLength = rtfString.length;
               if (charLength > 0) {
                    $scope.objRtf[index].charCount = charLength;
                    if (charLength > $scope.objRtf[index].maxCharLimit) {
                         $scope.objRtf[index].errorStatus = true;
                    } else {
                         $scope.objRtf[index].errorStatus = false;
                    }
               }
               else {
                    $scope.objRtf[index].charCount = 0;
                    $scope.objRtf[index].errorStatus = false;
               }
          } catch (e) { }
     }

     $scope.saveApplicationPortalHostInformation = function () {

          debugger;
          if ($scope.objContact.Host_Project_Title__c == undefined || $scope.objContact.Host_Project_Title__c == "") {
               swal("info", "Please enter project title.", "info");
               $("#txtTitle").addClass('border-theme');
               return;
          }
          // if($scope.objContact.Host_Funding_Source__c == undefined || $scope.objContact.Host_Funding_Source__c == ""){
          //      swal("info", "Please enter funding source.","info");
          //      $("#txtFunding").addClass('border-theme');
          //      return;  
          // }
          var startYear = 0;
          var startMonth = 0;
          var startDay = 0;
          var endYear = 0;
          var endMonth = 0;
          var endDay = 0;

          if ($scope.objContact.Actual_Application_Start_Date__c != undefined && $scope.objContact.Actual_Application_Start_Date__c != "") {
               startYear = $scope.objContact.Actual_Application_Start_Date__c.getUTCFullYear();
               startMonth = $scope.objContact.Actual_Application_Start_Date__c.getUTCMonth() + 1;
               startDay = $scope.objContact.Actual_Application_Start_Date__c.getDate();
          }
          // else{
          //      swal("info", "Please Enter start date.","info");
          //      $("#startDate").addClass('border-theme');
          //         return;
          // }

          if ($scope.objContact.Actual_Application_End_Date__c != undefined && $scope.objContact.Actual_Application_End_Date__c != "") {
               endYear = $scope.objContact.Actual_Application_End_Date__c.getUTCFullYear();
               endMonth = $scope.objContact.Actual_Application_End_Date__c.getUTCMonth() + 1;
               endDay = $scope.objContact.Actual_Application_End_Date__c.getDate();
          }
          // else{
          //      swal("info", "Please Enter end date.","info");
          //      $("#endDate").addClass('border-theme');
          //         return;
          // }

          if ($scope.objContact.Host_Abstract_Of_Project__c == undefined || $scope.objContact.Host_Abstract_Of_Project__c == "") {
               swal("Proposal Detail", "Please Enter Abstract.");
               return;
          } else {
               //      var div = document.createElement("div");
               //     div.innerHTML = $scope.objContact.Host_Abstract_Of_Project__c;
               //     let abstract = div.innerText.replace(/(\r\n\t|\t|\n|\r)/gm, "");
               //     abstract = abstract.replaceAll(' ','');

               if ($scope.objRtf[0].charCount > 700) {
                    swal("info", "Abstract maxlength will be 700 characters only.", "info");
                    return;
               }
          }

          delete ($scope.objContact.Actual_Application_Start_Date__c);
          delete ($scope.objContact.Actual_Application_End_Date__c);

          // New method to create a Proposal
          IndustrialFellowshipController.saveHostProjectInformation(
               $scope.objContact,
               $rootScope.proposalId,
               $rootScope.candidateId,
               $rootScope.yearlyCallId,
               parseInt($rootScope.yearlyCallIdstartDay, 10),
               parseInt(startMonth, 10),
               parseInt(startYear, 10),
               parseInt(endDay, 10),
               parseInt(endMonth, 10),
               parseInt(endYear, 10),
               function (result, event) {
                    debugger;
                    console.log("Result IN saveApplicationPortalHostInformation ::", result);
                    if (event.status) {
                         swal({
                              title: "SUCCESS",
                              text: 'Pair Project Details have been saved successfully.',
                              icon: "success",
                              button: "ok!",
                         })
                         // $scope.redirectPageURL('TwoReferenceWiser');
                         // $scope.redirectPageURL('ProjectDetailsInWiserPage');
                         $scope.redirectPageURL('WiserApplicationPage');
                         // window.location.replace(window.location.origin+'/ApplicantDashboard/ApplicantPortal?id='+$rootScope.userId+'#/TwoReferenceWiser');

                    } else {
                         swal({
                              title: "ERROR",
                              text: "Exception !",
                              icon: "error",
                              button: "ok!",
                         });
                    }
               });

          // IndustrialFellowshipController.saveHostProjectInformation($scope.objContact, startDay, startMonth, startYear, endDay, endMonth, endYear, function (result, event) {
          //      debugger;
          //      console.log("Result IN saveApplicationPortalHostInformation ::", result);
          //      if (event.status) {
          //           swal({
          //                title: "SUCCESS",
          //                text: 'Pair Project Details have been saved successfully.',
          //                icon: "success",
          //                button: "ok!",
          //           })
          //           // $scope.redirectPageURL('TwoReferenceWiser');
          //           $scope.redirectPageURL('HostInfoApplicationPage');
          //           // window.location.replace(window.location.origin+'/ApplicantDashboard/ApplicantPortal?id='+$rootScope.userId+'#/TwoReferenceWiser');

          //      } else {
          //           swal({
          //                title: "ERROR",
          //                text: "Exception !",
          //                icon: "error",
          //                button: "ok!",
          //           });
          //      }
          // });
     }

     $scope.redirectPageURL = function (pageName) {
          debugger;
          var link = document.createElement("a");
          link.id = 'someLink'; //give it an ID!
          link.href = "#/" + pageName;
          link.click();
     }

     $scope.removeClass = function (controlid) {
          $("#" + controlid + "").removeClass('border-theme');
     }
})
