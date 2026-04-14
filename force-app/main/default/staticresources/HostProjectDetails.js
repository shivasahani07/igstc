angular.module('cp_app').controller('HostProjectDetailInWiserCtrl', function ($scope, $sce, $rootScope) {
     $scope.objContact = {};
     $rootScope.projectId;
     $scope.startdate;
     $scope.enddate;
     $scope.objRtf = [
          { charCount: 0, maxCharLimit: 700, errorStatus: false },  // Abstract
          { charCount: 0, maxCharLimit: 700, errorStatus: false },  // Non Technical Abstract
          { charCount: 0, maxCharLimit: 50, errorStatus: false },   // Acronym
          { charCount: 0, maxCharLimit: 6000, errorStatus: false }, // Project Description
          { charCount: 0, maxCharLimit: 2000, errorStatus: false }, // Work elements Indian
          { charCount: 0, maxCharLimit: 2000, errorStatus: false }, // Work elements German
          { charCount: 0, maxCharLimit: 2000, errorStatus: false }, // Linkages and convergence
          { charCount: 0, maxCharLimit: 3000, errorStatus: false }  // References
     ];

     $rootScope.proposalStage;
     $rootScope.isCurrentUserSubmitted;
     $rootScope.candidateId;
     $scope.objKeyword = [];
     $scope.image1Doc = null;
     $scope.image2Doc = null;
     $scope.allDocs = [];
     $scope.selectedFile = null;
     $scope.showSpinnereditProf = false;
     $scope.showFullInfoBox = false; // Initialize info box as collapsed

     var maxStringSize = 6000000;
     var chunkSize = 750000;
     var attachment = '';
     var attachmentName = '';
     var fileSize = 0;
     var positionIndex = 0;
     var doneUploading = false;
     var maxFileSize = 0;

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

     if (localStorage.getItem('apaId')) {
          $rootScope.apaId = localStorage.getItem('apaId');
          console.log('Loaded proposalId from localStorage:', $rootScope.apaId);
     }

     /**
     * Fetches proposal stage from Apex on page load
     */
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

     // $scope.getApplicantStatusFromAPA = function () {
     //      debugger;

     //      if (!$rootScope.apaId) {
     //           console.log('APA Id not available yet, skipping fetchApplicantStatus call');
     //           return;
     //      }

     //      ApplicantPortal_Contoller.fetchApplicantStatus(
     //           $rootScope.apaId,
     //           function (result, event) {
     //                debugger;

     //                if (event.status) {
     //                     $rootScope.isCurrentUserSubmitted = result;

     //                     // 🔐 Lock editor condition
     //                     $scope.isEditorLocked = ($scope.proposalStage || result);

     //                     // 🔒 Apply lock to CKEditor
     //                     $scope.toggleCkEditorReadOnly($scope.isEditorLocked);
     //                }
     //           },
     //           { escape: true }
     //      );
     // };
     // $scope.getApplicantStatusFromAPA();

     $scope.toggleCkEditorReadOnly = function (isReadOnly) {
          setTimeout(function () {
               if (CKEDITOR.instances) {
                    Object.keys(CKEDITOR.instances).forEach(function (instanceName) {
                         CKEDITOR.instances[instanceName].setReadOnly(isReadOnly);
                    });
               }
          }, 0);
     };

     $scope.getContactHostInfo = function () {
          debugger;

          if (!$rootScope.proposalId) {
               console.log('Proposal Id not available yet, skipping getHostProjectDetails call');
               return;
          }

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
                    if (result.Broad_area_of_research__c != undefined || result.Broad_area_of_research__c != "") {
                         result.Broad_area_of_research__c = result.Broad_area_of_research__c ? result.Broad_area_of_research__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Broad_area_of_research__c;
                    }
                    if (result.Non_Technical_Title_Of_Project__c != undefined || result.Non_Technical_Title_Of_Project__c != "") {
                         result.Non_Technical_Title_Of_Project__c = result.Non_Technical_Title_Of_Project__c ? result.Non_Technical_Title_Of_Project__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Non_Technical_Title_Of_Project__c;
                    }
                    /* if (result.Non_Technical_Abstract_Of_Proposed_Work__c != undefined || result.Non_Technical_Abstract_Of_Proposed_Work__c != "") {
                          result.Non_Technical_Abstract_Of_Proposed_Work__c = result.Non_Technical_Abstract_Of_Proposed_Work__c ? result.Non_Technical_Abstract_Of_Proposed_Work__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Non_Technical_Abstract_Of_Proposed_Work__c;
                          // Initialize character count for Non Technical Abstract RTF field
                          $scope.readCharacter(result.Non_Technical_Abstract_Of_Proposed_Work__c, 1);
                     }*/
                    if (result.Innovative_Aspects__c != undefined || result.Innovative_Aspects__c != "") {
                         result.Innovative_Aspects__c = result.Innovative_Aspects__c ? result.Innovative_Aspects__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Innovative_Aspects__c;
                         // Initialize character count for Non Technical Abstract RTF field
                         $scope.readCharacter(result.Innovative_Aspects__c, 1);
                    }
                    if (result.Acronym__c != undefined || result.Acronym__c != "") {
                         result.Acronym__c = result.Acronym__c ? result.Acronym__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Acronym__c;
                         // Initialize character count for Acronym RTF field
                         $scope.readCharacter(result.Acronym__c, 2);
                    }
                    if (result.Project_Description__c != undefined || result.Project_Description__c != "") {
                         result.Project_Description__c = result.Project_Description__c ? result.Project_Description__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Project_Description__c;
                         // Initialize character count for Project Description RTF field
                         $scope.readCharacter(result.Project_Description__c, 3);
                    }
                    if (result.Work_elements_to_be_completed_by_Indian__c != undefined || result.Work_elements_to_be_completed_by_Indian__c != "") {
                         result.Work_elements_to_be_completed_by_Indian__c = result.Work_elements_to_be_completed_by_Indian__c ? result.Work_elements_to_be_completed_by_Indian__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Work_elements_to_be_completed_by_Indian__c;
                         // Initialize character count for Work elements Indian RTF field
                         $scope.readCharacter(result.Work_elements_to_be_completed_by_Indian__c, 4);
                    }
                    if (result.Work_elements_to_be_completed_by_German__c != undefined || result.Work_elements_to_be_completed_by_German__c != "") {
                         result.Work_elements_to_be_completed_by_German__c = result.Work_elements_to_be_completed_by_German__c ? result.Work_elements_to_be_completed_by_German__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Work_elements_to_be_completed_by_German__c;
                         // Initialize character count for Work elements German RTF field
                         $scope.readCharacter(result.Work_elements_to_be_completed_by_German__c, 5);
                    }
                    if (result.Linkages_and_convergence_of_work_element__c != undefined || result.Linkages_and_convergence_of_work_element__c != "") {
                         result.Linkages_and_convergence_of_work_element__c = result.Linkages_and_convergence_of_work_element__c ? result.Linkages_and_convergence_of_work_element__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Linkages_and_convergence_of_work_element__c;
                         // Initialize character count for Linkages and convergence RTF field
                         $scope.readCharacter(result.Linkages_and_convergence_of_work_element__c, 6);
                    }
                    if (result.References__c != undefined || result.References__c != "") {
                         result.References__c = result.References__c ? result.References__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.References__c;
                         // Initialize character count for References RTF field
                         $scope.readCharacter(result.References__c, 7);
                    }
                    // ------------------------- Keyword Functionality ------------------------------ //
                    if (result.KeyWords__c != undefined && result.KeyWords__c != '') {
                         var keyword = result.KeyWords__c.split(';');
                         $scope.objKeyword.splice(0, 1);
                         for (var k = 0; k < keyword.length; k++) {
                              $scope.objKeyword.push({ "keyword": keyword[k] });
                         }
                    }
                    else {
                         $scope.objKeyword.push({ "keyword": "" });
                    }
                    $scope.objContact = result;
                    // Initialize character count for Abstract RTF field if it exists
                    if (result.Host_Abstract_Of_Project__c != undefined && result.Host_Abstract_Of_Project__c != "") {
                         $scope.readCharacter(result.Host_Abstract_Of_Project__c, 0);
                    }
                    $scope.$apply();
               }

          });
     }
     $scope.getContactHostInfo();
     $scope.previousPage = function () {
          debugger;
          $scope.redirectPageURL('ProjectDetailsInWiserPage');
          // window.location.replace(window.location.origin+'/ApplicantDashboard/ApplicantPortal?id='+$rootScope.userId+'#/FinancialOverview_wiser');
          // window.location.href = 'https://indo-germansciencetechnologycentre--newdevutil.sandbox.my.salesforce-sites.com/ApplicantDashboard/ApplicantPortal?id=' + $rootScope.candidateId;
     }

     $scope.readCharacter = function (event, index) {
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
          // if ($scope.objContact.Host_Project_Title__c == undefined || $scope.objContact.Host_Project_Title__c == "") {
          //      swal("Info", "Please Enter Project Title.", "info");
          //      $("#txtTitle").addClass('border-theme');
          //      return;
          // }

          if ($scope.objContact.Title_Of__c == undefined || $scope.objContact.Title_Of__c == "") {
               swal("Info", "Please Enter Title Of Project.", "info");
               $("#titleOfProposal").addClass('border-theme');
               return;
          }

          if ($scope.objContact.Title_Of__c.length > 300) {
               swal(
                    "Info",
                    "Maximum 300 characters allowed for Title Of Project.",
                    "info");
               //$("#laymanabstract").addClass('border-theme');
               return;
          }

          if ($scope.objContact.Broad_area_of_research__c == undefined || $scope.objContact.Broad_area_of_research__c == "") {
               swal("Info", "Please Enter Area Of Research.", "info");
               $("#areaOfResearch").addClass('border-theme');
               return;
          }

          if ($scope.objContact.Broad_area_of_research__c.length > 300) {
               swal(
                    "Info",
                    "Maximum 300 characters allowed for Area Of Research.",
                    "info");
               //$("#laymanabstract").addClass('border-theme');
               return;
          }


          // if ($scope.objContact.Layman_title_of_project__c == undefined || $scope.objContact.Layman_title_of_project__c == "") {
          //      swal("Info", "Please Enter Layman Title Of Project.", "info");
          //      $("#laymanTitle").addClass('border-theme');
          //      return;
          // }

          // if ($scope.objContact.Layman_title_of_project__c.length > 600) {
          //      swal(
          //           "Info",
          //           "Please Enter Layman Title Of Proposal.",
          //           "info");
          //      //$("#laymanTitle").addClass('border-theme');
          //      return;
          // }

          // if ($scope.objContact.Layman_abstract_of_proposed_work__c == undefined || $scope.objContact.Layman_abstract_of_proposed_work__c == "") {
          //      swal("Info", "Please Enter Layman Abstract Of Proposed Work.", "info");
          //      $("#laymanabstract").addClass('border-theme');
          //      return;
          // }

          // if ($scope.objContact.Layman_abstract_of_proposed_work__c.length > 600) {
          //      swal(
          //           "Info",
          //           "Please Enter Layman Abstract Of Proposed Work.",
          //           "info");
          //      //$("#laymanabstract").addClass('border-theme');
          //      return;
          // }

          if ($scope.objContact.Non_Technical_Title_Of_Project__c == undefined || $scope.objContact.Non_Technical_Title_Of_Project__c == "") {
               swal("Info", "Please Enter Non Technical Title of Project.", "info");
               $("#nonTechnicalTitle").addClass('border-theme');
               return;
          }

          if ($scope.objContact.Non_Technical_Title_Of_Project__c.length > 300) {
               swal(
                    "Info",
                    "Maximum 300 characters allowed for Non Technical Title of Project.",
                    "info");
               //$("#laymanabstract").addClass('border-theme');
               return;
          }

          /* if ($scope.objContact.Non_Technical_Abstract_Of_Proposed_Work__c == undefined || $scope.objContact.Non_Technical_Abstract_Of_Proposed_Work__c == "") {
                swal("Info", "Please Enter Non Technical Abstract of Proposed Work.", "info");
                $("#nonTechnicalAbstract").addClass('border-theme');
                return;
           }*/
          if ($scope.objContact.Innovative_Aspects__c == undefined || $scope.objContact.Innovative_Aspects__c == "") {
               swal("Info", "Please Enter Non Technical Abstract of Proposed Work.", "info");
               $("#nonTechnicalAbstract").addClass('border-theme');
               return;
          }

          if ($scope.objRtf[1].charCount > 700 || $scope.objRtf[1].errorStatus) {
               swal(
                    "Info",
                    "Maximum 700 characters allowed for Non Technical Abstract of Proposed Work.",
                    "info");
               //$("#laymanabstract").addClass('border-theme');
               return;
          }

          if ($scope.objContact.Acronym__c == undefined || $scope.objContact.Acronym__c == "") {
               swal("Info", "Please Enter Acronym.", "info");
               return;
          }

          // if ($scope.objRtf[2].charCount > 50 || $scope.objRtf[2].errorStatus) {
          //      swal(
          //           "Info",
          //           "Maximum 50 characters allowed for Acronym.",
          //           "info");
          //      return;
          // }
           if ($scope.objContact.Acronym__c.length > 50) {
               swal(
                    "Info",
                    "Maximum 50 characters allowed for Acronym.",
                    "info");
               return;
          }

          if ($scope.objContact.Project_Description__c == undefined || $scope.objContact.Project_Description__c == "") {
               swal("Info", "Please Enter Project Description.", "info");
               return;
          }

          if ($scope.objRtf[3].charCount > 6000 || $scope.objRtf[3].errorStatus) {
               swal(
                    "Info",
                    "Maximum 6000 characters allowed for Project Description.",
                    "info");
               return;
          }

          if ($scope.objContact.Work_elements_to_be_completed_by_Indian__c == undefined || $scope.objContact.Work_elements_to_be_completed_by_Indian__c == "") {
               swal("Info", "Please Enter Work elements to be completed by Indian Awardee.", "info");
               return;
          }

          if ($scope.objRtf[4].charCount > 2000 || $scope.objRtf[4].errorStatus) {
               swal(
                    "Info",
                    "Maximum 2000 characters allowed for Work elements to be completed by Indian Awardee.",
                    "info");
               return;
          }

          if ($scope.objContact.Work_elements_to_be_completed_by_German__c == undefined || $scope.objContact.Work_elements_to_be_completed_by_German__c == "") {
               swal("Info", "Please Enter Work elements to be completed by German Awardee.", "info");
               return;
          }

          if ($scope.objRtf[5].charCount > 2000 || $scope.objRtf[5].errorStatus) {
               swal(
                    "Info",
                    "Maximum 2000 characters allowed for Work elements to be completed by German Awardee.",
                    "info");
               return;
          }

          if ($scope.objContact.Linkages_and_convergence_of_work_element__c == undefined || $scope.objContact.Linkages_and_convergence_of_work_element__c == "") {
               swal("Info", "Please Enter Linkages and convergence of these work elements for the expected outcome.", "info");
               return;
          }

          if ($scope.objRtf[6].charCount > 2000 || $scope.objRtf[6].errorStatus) {
               swal(
                    "Info",
                    "Maximum 2000 characters allowed for Linkages and convergence of these work elements for the expected outcome.",
                    "info");
               return;
          }

          if ($scope.objContact.References__c == undefined || $scope.objContact.References__c == "") {
               swal("Info", "Please Enter References.", "info");
               return;
          }

          if ($scope.objRtf[7].charCount > 3000 || $scope.objRtf[7].errorStatus) {
               swal(
                    "Info",
                    "Maximum 3000 characters allowed for References.",
                    "info");
               return;
          }

          // if (
          //      $scope.objContact.Duration_In_Months_Max_36__c === null || $scope.objContact.Duration_In_Months_Max_36__c === undefined
          // ) {
          //      swal("Info", "Please Enter Project Duration.", "info");
          //      //$("#txtDuration").addClass('border-theme');
          //      return;
          // }

          if ($scope.formPrjDet.$invalid) {
               swal("Info", "Duration must be 24 or 36 months.", "info");
               $("#txtDuration").addClass('border-theme');
               return;
          }

          var keyword = "";
          for (var i = 0; i < $scope.objKeyword.length; i++) {
               if ($scope.objKeyword[i].keyword != '' && $scope.objKeyword[i].keyword != undefined) {
                    if (i == 0)
                         keyword = $scope.objKeyword[i].keyword;
                    else
                         keyword = keyword + ';' + $scope.objKeyword[i].keyword;
               }
          }
          $scope.objContact.KeyWords__c = keyword;

          if ($scope.objContact.KeyWords__c == undefined || $scope.objContact.KeyWords__c == "") {
               swal("Info", "Please Enter Keywords.", "info");
               $("#keywords").addClass('border-theme');
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
                    swal("Info", "Abstract maxlength will be 700 characters only.", "info");
                    return;
               }
          }

          delete ($scope.objContact.Actual_Application_Start_Date__c);
          delete ($scope.objContact.Actual_Application_End_Date__c);
          delete $scope.objContact._charLimitMap;

          // Validate that proposalId is available for upsert
          if (!$rootScope.proposalId) {
               swal("Info", "Proposal Id is required. Please go back to the previous page.", "info");
               $("#btnPreview").html('<i class="fa-solid fa-check me-2"></i>Save and Next');
               $("#btnPreview").prop('disabled', false);
               return;
          }

          // Show spinner on button
          $("#btnPreview").html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Please wait...');
          $("#btnPreview").prop('disabled', true);

          console.log('Saving Host Project Information with Proposal Id:', $rootScope.proposalId);

          // Helper function to restore button state
          var isButtonRestored = false;
          var restoreButton = function () {
               if (!isButtonRestored) {
                    isButtonRestored = true;
                    $("#btnPreview").html('<i class="fa-solid fa-check me-2"></i>Save and Next');
                    $("#btnPreview").prop('disabled', false);
               }
          };

          // Safety timeout: re-enable button after 2 minutes if no response
          var safetyTimeout = setTimeout(function () {
               if (!isButtonRestored) {
                    console.warn("Safety timeout: Re-enabling button after 2 minutes");
                    restoreButton();
                    swal({
                         title: "TIMEOUT",
                         text: "The request is taking longer than expected. Please try again.",
                         icon: "warning",
                         button: "ok!",
                    });
               }
          }, 120000); // 2 minutes

          // Upsert Proposal using the Proposal Id from the first page
          try {
               IndustrialFellowshipController.saveHostProjectInformation(
                    $scope.objContact,
                    $rootScope.proposalId,
                    $rootScope.candidateId,
                    $rootScope.yearlyCallId,
                    parseInt(startDay, 10),
                    parseInt(startMonth, 10),
                    parseInt(startYear, 10),
                    parseInt(endDay, 10),
                    parseInt(endMonth, 10),
                    parseInt(endYear, 10),
                    function (result, event) {
                         try {
                              // Clear safety timeout since we got a response
                              clearTimeout(safetyTimeout);

                              debugger;
                              console.log("Result In saveApplicationPortalHostInformation ::", result);
                              // Restore button
                              restoreButton();

                              if (event.status) {

                                   // Saving the ProposalId in Local Storage
                                   // localStorage.setItem('proposalId', result.proposalId);
                                   // localStorage.setItem('apaId', result.apa.Id);
                                   swal({
                                        title: "Success",
                                        text: 'Paired Project Details have been saved successfully.',
                                        icon: "success",
                                        button: "ok!",
                                   });

                                   // Fetch documents
                                   // $scope.getProjectDetails();
                                   // $scope.redirectPageURL('TwoReferenceWiser');
                                   // $scope.redirectPageURL('ProjectDetailsInWiserPage');
                                   $scope.redirectPageURL('WiserApplicationPage');
                                   // window.location.replace(window.location.origin+'/ApplicantDashboard/ApplicantPortal?id='+$rootScope.userId+'#/TwoReferenceWiser');

                              } else {
                                   swal({
                                        title: "ERROR",
                                        text: event.message || "An error occurred while saving. Please try again.",
                                        icon: "error",
                                        button: "ok!",
                                   });
                              }
                         } catch (error) {
                              clearTimeout(safetyTimeout);
                              console.error("Error in saveApplicationPortalHostInformation callback:", error);
                              restoreButton();
                              swal({
                                   title: "ERROR",
                                   text: "An unexpected error occurred. Please try again.",
                                   icon: "error",
                                   button: "ok!",
                              });
                         }
                    },
                    {
                         escape: true,
                         timeout: 120000
                    }
               );
          } catch (error) {
               clearTimeout(safetyTimeout);
               console.error("Error calling saveHostProjectInformation:", error);
               restoreButton();
               swal({
                    title: "ERROR",
                    text: "Failed to submit the form. Please try again.",
                    icon: "error",
                    button: "ok!",
               });
          }

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

     // ----------------- Add and Remove Keyword Functionality ------------------ //
     $scope.objKeyword = [];

     $scope.addKeyword = function () {
          debugger
          if ($scope.objKeyword.length <= 5) {
               $scope.objKeyword.push({ keyword: "" });
               $scope.$apply();
          }
     }
     $scope.removeKeyword = function (index) {
          if ($scope.objKeyword.length > 1) {
               $scope.objKeyword.splice(index, 1);
          }
     }

     $scope.checkCharLimit = function (obj, fieldName, limit) {
          debugger;

          if (!obj) return;

          var targetObj;
          var value;

          // 🔹 Account field
          if (obj.hasOwnProperty(fieldName)) {
               targetObj = obj;
               value = obj[fieldName];

          }
          // 🔹 Contact field
          else if (
               obj.Contacts &&
               obj.Contacts.length > 0 &&
               obj.Contacts[0].hasOwnProperty(fieldName)
          ) {
               targetObj = obj.Contacts[0];
               value = obj.Contacts[0][fieldName];

          } else {
               return;
          }

          // Init error map
          targetObj._charLimitMap = targetObj._charLimitMap || {};

          if (!value) {
               targetObj._charLimitMap[fieldName] = false;
               return;
          }

          /* =====================================================
             SPECIAL CASE: POSTAL / ZIP CODE
             ===================================================== */
          if (fieldName === 'BillingPostalCode') {

               var country = obj.BillingCountry;
               var cleanedValue = value.replace(/[^0-9]/g, '');

               var maxLength;
               var regex;

               if (country === 'India') {
                    maxLength = 6;
                    regex = /^[0-9]{6}$/;
               }
               else if (country === 'Germany') {
                    maxLength = 5;
                    regex = /^[0-9]{5}$/;
               }
               else {
                    maxLength = limit; // fallback
               }

               // Length check
               if (cleanedValue.length > maxLength) {
                    targetObj._charLimitMap[fieldName] = true;
                    console.log('❌ Postal code length exceeded for', country);
                    return;
               }

               // Pattern check (only when full length entered)
               if (cleanedValue.length === maxLength) {
                    if (regex && !regex.test(cleanedValue)) {
                         targetObj._charLimitMap[fieldName] = true;
                         console.log('❌ Invalid Postal Code for', country);
                         return;
                    }
               }

               targetObj._charLimitMap[fieldName] = false;
               console.log('✅ Valid Postal Code for', country);
               return;
          }

          /* =====================================================
              DEFAULT CHAR LIMIT LOGIC (Website, Department, etc.)
             ===================================================== */

          if (value.length > limit) {
               targetObj._charLimitMap[fieldName] = true;
          } else {
               targetObj._charLimitMap[fieldName] = false;
          }
     };

     $scope.removeClass = function (controlid) {
          $("#" + controlid + "").removeClass('border-theme');
     }

     $scope.removeClass2 = function (controlid) {
          $("#" + controlid + "").removeClass('border-theme');
     }

     // --------------------- PROJECT PROPOSAL UPLOAD FUNCTIONALITY ----------------------- //
     $scope.getProjectDetails = function () {
          debugger;
          if (!$rootScope.proposalId) {
               console.log('Proposal Id not available yet, skipping getProjectDetails call');
               return;
          }
          $scope.selectedFile = '';
          $('#file_frame').attr('src', '');
          console.log('Calling getAllProposalDoc with proposalId:', $rootScope.proposalId);
          ApplicantPortal_Contoller.getAllProposalDoc($rootScope.proposalId, function (result, event) {
               debugger;
               console.log('result return onload :: ');
               console.log(result);
               console.log('event:', event);
               if (event.status) {
                    $scope.allDocs = result;
                    $scope.image1Doc = null;
                    $scope.image2Doc = null;
                    for (var i = 0; i < $scope.allDocs.length; i++) {
                         if ($scope.allDocs[i].userDocument.Name == 'Image 1') {
                              $scope.image1Doc = $scope.allDocs[i];
                         }
                         if ($scope.allDocs[i].userDocument.Name == 'Image 2') {
                              $scope.image2Doc = $scope.allDocs[i];
                         }
                    }
                    $scope.$apply();
               } else {
                    console.log('Error in getAllProposalDoc:', event.message);
               }
          }, {
               escape: true
          })
     }
     $scope.getProjectDetails();

     // Removed duplicate - using the one below that handles Attachments

     $scope.uploadImageFile = function (type, userDocId, fileId, maxSize, minFileSize) {
          debugger;
          $scope.showSpinnereditProf = true;
          var file;
          file = document.getElementById(type).files[0];
          if (!file) {
               swal('Info', 'You must choose a file before trying to upload it', 'info');
               $scope.showSpinnereditProf = false;
               return;
          }
          fileName = file.name;
          var typeOfFile = fileName.split(".");
          lengthOfType = typeOfFile.length;
          if (typeOfFile[lengthOfType - 1] == "jpg" || typeOfFile[lengthOfType - 1] == "jpeg" || typeOfFile[lengthOfType - 1] == "png") {
          } else {
               swal('Info', 'Please choose jpg/jpeg/png file only.', 'info');
               $scope.showSpinnereditProf = false;
               return;
          }
          console.log(file);
          // Convert string parameters to numbers for proper comparison
          maxFileSize = parseInt(maxSize, 10);
          minFileSize = parseInt(minFileSize, 10);
          console.log('File size:', file.size, 'bytes (', (file.size / 1024).toFixed(2), 'KB)');
          console.log('Max file size:', maxFileSize, 'bytes (', (maxFileSize / 1024).toFixed(2), 'KB)');
          console.log('Min file size:', minFileSize, 'bytes (', (minFileSize / 1024).toFixed(2), 'KB)');
          if (file != undefined) {
               if (file.size <= maxFileSize) {
                    if (file.size < minFileSize) {
                         swal('Info', 'Your file is too small. Please try again.', 'info');
                         $scope.showSpinnereditProf = false;
                         return;
                    }
                    attachmentName = file.name;
                    const myArr = attachmentName.split(".");

                    // If userDocId is empty, we need to create Proposal_Document__c first
                    if (!userDocId || userDocId == '') {
                         $scope.createProposalDocument(type, function (createdDocId) {
                              if (createdDocId) {
                                   var fileReader = new FileReader();
                                   fileReader.onloadend = function (e) {
                                        attachment = window.btoa(this.result);  //Base 64 encode the file before sending it
                                        positionIndex = 0;
                                        fileSize = attachment.length;
                                        $scope.showSpinnereditProf = false;
                                        console.log("Total Attachment Length: " + fileSize);
                                        doneUploading = false;
                                        debugger;
                                        if (fileSize < maxStringSize) {
                                             $scope.uploadImageAttachment(type, createdDocId, null);
                                        } else {
                                             swal('Info', 'Base 64 Encoded file is too large.  Maximum size is ' + maxStringSize + ' your file is ' + fileSize + '.', 'info');
                                             return;
                                        }
                                   }
                                   fileReader.onerror = function (e) {
                                        swal('Info', 'There was an error reading the file.  Please try again.', 'info');
                                        $scope.showSpinnereditProf = false;
                                        return;
                                   }
                                   fileReader.onabort = function (e) {
                                        swal('Info', 'There was an error reading the file.  Please try again.', 'info');
                                        $scope.showSpinnereditProf = false;
                                        return;
                                   }
                                   fileReader.readAsBinaryString(file);  //Read the body of the file
                              } else {
                                   swal('Info', 'Failed to create document record. Please try again.', 'info');
                                   $scope.showSpinnereditProf = false;
                              }
                         });
                    } else {
                         var fileReader = new FileReader();
                         fileReader.onloadend = function (e) {
                              attachment = window.btoa(this.result);  //Base 64 encode the file before sending it
                              positionIndex = 0;
                              fileSize = attachment.length;
                              $scope.showSpinnereditProf = false;
                              console.log("Total Attachment Length: " + fileSize);
                              doneUploading = false;
                              debugger;
                              if (fileSize < maxStringSize) {
                                   $scope.uploadImageAttachment(type, userDocId, null);
                              } else {
                                   swal('Info', 'Base 64 Encoded file is too large.  Maximum size is ' + maxStringSize + ' your file is ' + fileSize + '.', 'info');
                                   return;
                              }
                         }
                         fileReader.onerror = function (e) {
                              swal('Info', 'There was an error reading the file.  Please try again.', 'info');
                              $scope.showSpinnereditProf = false;
                              return;
                         }
                         fileReader.onabort = function (e) {
                              swal('Info', 'There was an error reading the file.  Please try again.', 'info');
                              $scope.showSpinnereditProf = false;
                              return;
                         }
                         fileReader.readAsBinaryString(file);  //Read the body of the file
                    }
               } else {
                    var maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(2);
                    swal('Info', 'Your file is too large. Maximum file size is ' + maxSizeMB + ' MB. Please try again.', 'info');
                    $scope.showSpinnereditProf = false;
                    return;
               }
          } else {
               swal('Info', 'You must choose a file before trying to upload it', 'info');
               $scope.showSpinnereditProf = false;
               return;
          }
     }

     $scope.createProposalDocument = function (docName, callback) {
          debugger;
          if (!$rootScope.proposalId) {
               swal('Info', 'Proposal Id not available.', 'info');
               callback(null);
               return;
          }
          // Create Proposal_Document__c record by uploading empty attachment
          // This will create the record, then we'll upload the actual file
          // Note: The backend method creates Proposal_Document__c but doesn't set Name/Proposals__c
          // We'll need to query after creation to get the ID
          ApplicantPortal_Contoller.doCUploadAttachmentProjectDet('', docName, '', '', function (result, event) {
               debugger;
               if (event.status && result) {
                    // Query to get the created Proposal_Document__c ID
                    // Since we can't easily get it from result, we'll refresh and find it
                    setTimeout(function () {
                         $scope.getProjectDetails();
                         var docId = null;
                         // Wait a bit for the query to complete
                         setTimeout(function () {
                              if (docName == 'Image 1' && $scope.image1Doc) {
                                   docId = $scope.image1Doc.userDocument.Id;
                              } else if (docName == 'Image 2' && $scope.image2Doc) {
                                   docId = $scope.image2Doc.userDocument.Id;
                              }
                              if (docId) {
                                   callback(docId);
                              } else {
                                   swal('Info', 'Document record created but could not be found. Please try uploading again.', 'info');
                                   callback(null);
                              }
                         }, 1000);
                    }, 500);
               } else {
                    swal('Info', 'Failed to create document record. Please try again.', 'info');
                    callback(null);
               }
          }, { escape: true });
     }

     $scope.uploadImageAttachment = function (type, userDocId, fileId) {
          debugger;
          var attachmentBody = "";
          if (fileSize <= positionIndex + chunkSize) {
               debugger;
               attachmentBody = attachment.substring(positionIndex);
               doneUploading = true;
               console.log("Final chunk - Uploading " + attachmentBody.length + " chars from position " + positionIndex + " to end (total: " + fileSize + ")");
          } else {
               attachmentBody = attachment.substring(positionIndex, positionIndex + chunkSize);
               console.log("Chunk " + Math.floor(positionIndex / chunkSize) + 1 + " - Uploading " + attachmentBody.length + " chars from position " + positionIndex + " to " + (positionIndex + chunkSize) + " (total: " + fileSize + ")");
          }
          console.log("Uploading " + attachmentBody.length + " chars of " + fileSize);
          ApplicantPortal_Contoller.doCUploadAttachmentProjectDet(
               attachmentBody, attachmentName, fileId, userDocId,
               function (result, event) {
                    console.log(result);
                    console.log("Event status:", event.status, "Done uploading:", doneUploading);
                    if (event.type === 'exception') {
                         console.log("exception");
                         console.log(event);
                         swal('Error', 'An error occurred during upload. Please try again.', 'error');
                         $scope.showSpinnereditProf = false;
                    } else if (event.status) {
                         if (doneUploading == true) {
                              // All chunks uploaded successfully
                              $scope.getProjectDetails();
                              swal(
                                   'Success',
                                   'Uploaded Successfully!',
                                   'success'
                              )
                              $scope.getProjectDetails();
                              $scope.showUplaodUserDoc = false;
                              $scope.showSpinnereditProf = false;
                         } else {
                              // More chunks to upload - continue
                              console.log("Continuing with next chunk. Position:", positionIndex, "File size:", fileSize);
                              positionIndex += chunkSize;
                              $scope.uploadImageAttachment(type, userDocId, result);
                         }
                    } else {
                         // Request failed
                         console.log("Upload failed. Event:", event);
                         swal('Error', 'Upload failed. Please try again.', 'error');
                         $scope.showSpinnereditProf = false;
                    }
               },
               { buffer: true, escape: true, timeout: 120000 }
          );
     }

     $scope.uploadFile = function (type, userDocId, good, fileId, fileSizeFun) {
          debugger;

          console.log('type :', type);
          console.log('userDocId :', userDocId);
          console.log('fileId :', fileId);
          console.log('fileSizeFun :', fileSizeFun);

          var lll = good;
          var chunkSize = 950000;
          var positionIndex = 0;
          var maxStringSize = 1500000;
          var attachment = "";
          var attachmentName = "";
          var fileSize = 0;
          var doneUploading = false;

          var minFileSize = 30 * 1024;         // 30 KB
          var maxFileSize = 1 * 1024 * 1024;  // 1 MB

          //userDocId = 'a0xe10000001L7FAAU';
          //type = 'PDF Upload Testing';

          // Convert string parameter to number for proper comparison
          var maxFileSize = parseInt(fileSizeFun, 10);
          $scope.showSpinnereditProf = true;
          var file;

          file = document.getElementById(type).files[0];
          //file = document.getElementById('fileUploader').files[0];
          console.log("Selected File:", file);

          if (!file) {
               console.error("File is undefined. INPUT NOT FOUND.");
               return;
          }

          fileName = file.name;
          var typeOfFile = fileName.split(".");
          lengthOfType = typeOfFile.length;
          if (typeOfFile[lengthOfType - 1] == "pdf" || typeOfFile[lengthOfType - 1] == "PDF") {

          } else {
               swal('Info', 'Please choose pdf file only.', 'info');
               return;
          }
          console.log(file);
          console.log('File size:', file.size, 'bytes (', (file.size / 1024).toFixed(2), 'KB)');
          console.log('Max file size:', maxFileSize, 'bytes (', (maxFileSize / 1024).toFixed(2), 'KB)');
          if (file != undefined) {
               if (file.size <= maxFileSize) {

                    if (file.size < minFileSize) {
                         swal("Info", "File must be at least 30 KB.", "info");
                         return;
                    }

                    attachmentName = file.name;
                    const myArr = attachmentName.split(".");
                    /* if (myArr[1] != "pdf" && type != 'profilePic') {
                        alert("Please upload in PDF format only");
                        return;
                    } */
                    var fileReader = new FileReader();
                    console.log("FileReader created:", fileReader);
                    fileReader.onloadend = function (e) {
                         console.log('E Object==>', e);
                         //attachment = window.btoa(e.target.result);  //Base 64 encode the file before sending it
                         attachment = e.target.result.split(",")[1];
                         positionIndex = 0;
                         fileSize = attachment.length;
                         $scope.showSpinnereditProf = false;
                         console.log("Total Attachment Length: " + fileSize);
                         doneUploading = false;
                         debugger;

                         console.log('attachment : ', attachment);
                         console.log('fileSize : ', fileSize);
                         console.log('doneUploading : ', doneUploading);
                         console.log('userDocId===>', userDocId);

                         if (fileSize < maxStringSize) {
                              $scope.uploadAttachment(type, userDocId, null, attachment, attachmentName);
                         } else {
                              swal("Info", "Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".", "info");
                              return;
                              // alert("Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".");
                         }

                    }
                    fileReader.onerror = function (e) {
                         swal("Info", "There was an error reading the file.  Please try again.", "info");
                         console.log('Error is==>', e);
                         console.log('Error Body Is===>', JSON.stringify(e.target.result));
                         return;
                         // alert("There was an error reading the file.  Please try again.");
                    }
                    fileReader.onabort = function (e) {
                         swal("Info", "There was an error reading the file.  Please try again.", "info");
                         return;
                         // alert("There was an error reading the file.  Please try again.");
                    }

                    fileReader.readAsDataURL(file); //Read the body of the file

               } else {
                    swal("Info", "File must be under 1 Mb in size.  Your file is too large.  Please try again.", "info");
                    return;
               }
          } else {
               swal("Info", "You must choose a file before trying to upload it", "info");
               return;
               // alert("You must choose a file before trying to upload it");
               // $scope.showSpinnereditProf = false;
          }
     }

     $scope.uploadAttachment = function (type, userDocId, fileId, attachment, attachmentName) {
          debugger;

          console.log('type : ', type);
          console.log('userDocId : ', userDocId);
          console.log('fileId : ', fileId);
          console.log('attachment : ', attachment);
          console.log('attachmentName : ', attachmentName);

          var attachmentBody;
          var fileSize = 1048576;
          var positionIndex = 1000000;
          var chunkSize = 48576;
          // if (fileId == undefined) {
          //     fileId = " ";
          // }
          attachmentBody = attachment;
          if (userDocId == undefined) {
               userDocId = null;
          }
          if (fileSize <= positionIndex + chunkSize) {
               debugger;
               attachmentBody = attachment;
               doneUploading = true;
          }
          else {
               attachmentBody = attachment.substring(positionIndex, positionIndex + chunkSize);
          }
          console.log("Uploading " + attachmentBody.length + " chars of " + fileSize);
          debugger;

          // Spinner for buttons 
          $("#btnPreview").html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Please wait...');

          ApplicantPortal_Contoller.doCUploadAttachmentAa(
               attachmentBody, attachmentName, fileId, userDocId,
               function (result, event) {
                    $("#btnPreview").html('<i class="fa-solid fa-check me-2"></i>Save and Next');
                    debugger;
                    console.log(result);
                    if (event.type === 'exception') {
                         console.log("exception");
                         console.log(event);
                    } else if (event.status) {
                         if (doneUploading == true) {
                              swal(
                                   'Success',
                                   'Uploaded Successfully!',
                                   'success'
                              )

                              //$scope.getProjectdetils();
                              // $scope.disableSubmit = false;

                         }
                         else {
                              debugger;
                              positionIndex += chunkSize;
                              $scope.uploadAttachment(type, userDocId, result);
                         }
                         $scope.showUplaodUserDoc = false;
                         // $scope.getCandidateDetails();

                    }
               },
               { buffer: true, escape: true, timeout: 120000 }
          );
     };

     // $scope.filePreviewHandler = function (fileContent) {
     //      debugger;
     //      $scope.selectedFile = fileContent;

     //      console.log('selectedFile---', $scope.selectedFile);

     //      $('#file_frame').attr('src', $scope.selectedFile.ContentDistribution.DistributionPublicUrl);

     //      var myModal = new bootstrap.Modal(document.getElementById('filePreview'))
     //      myModal.show('slow');
     //      $scope.$apply();

     //      ContentDistribution.DistributionPublicUrl
     // }

     $scope.filePreviewHandler = function (fileContent) {
          debugger;
          $scope.selectedFile = fileContent;

          console.log('selectedFile---', $scope.selectedFile);

          // Check if ContentDistribution exists (for newer uploads) or use Attachments (for older)
          if ($scope.selectedFile.ContentDistribution && $scope.selectedFile.ContentDistribution.DistributionPublicUrl) {
               $('#file_frame').attr('src', $scope.selectedFile.ContentDistribution.DistributionPublicUrl);
          } else if ($scope.selectedFile.userDocument && $scope.selectedFile.userDocument.Attachments && $scope.selectedFile.userDocument.Attachments.length > 0) {
               var attachmentId = $scope.selectedFile.userDocument.Attachments[0].Id;
               $scope.filesrec = window.location.origin + '/ApplicantDashboard/servlet/servlet.FileDownload?file=' + attachmentId;
               $('#file_frame').attr('src', $scope.filesrec);
          } else {
               swal('Info', 'File preview not available.', 'info');
               return;
          }

          var myModal = new bootstrap.Modal(document.getElementById('filePreview'));
          myModal.show('slow');

          // Don't call $apply() here - ng-click already triggers digest cycle automatically
     }



     // $scope.filePreviewHandler = function (fileContent) {
     //      debugger;
     //      $scope.selectedFile = fileContent;

     //      console.log('selectedFile---', $scope.selectedFile);
     //      var jhj = $scope.selectedFile.userDocument.Attachments[0].Id;
     //      console.log(jhj);
     //      $scope.filesrec = $sce.trustAsResourceUrl(window.location.origin + '/ApplicantDashboard/servlet/servlet.FileDownload?file=' + $scope.selectedFile.userDocument.Attachments[0].Id);
     //      //$scope.filesrec = window.location.origin +'/ApplicantDashboard/servlet/servlet.FileDownload?file='+$scope.selectedFile.userDocument.Attachments[0].Id;
     //      // $('#file_frame').attr('src', $scope.selectedFile.ContentDistribution.DistributionPublicUrl);
     //      // $('#file_frame').attr('src', $scope.filesrec);

     //      // var myModal = new bootstrap.Modal(document.getElementById('filePreview'))
     //      // myModal.show('slow');
     //      //$scope.$apply();

     //      //.ContentDistribution.DistributionPublicUrl
     // }

})
