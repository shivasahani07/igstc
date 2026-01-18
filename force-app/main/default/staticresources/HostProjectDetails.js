angular.module('cp_app').controller('HostProjectDetailInWiserCtrl', function ($scope, $sce, $rootScope) {
     $scope.objContact = {};
     $rootScope.projectId;
     $scope.startdate;
     $scope.enddate;
     $scope.objRtf = [{ charCount: 0, maxCharLimit: 700, errorStatus: false }];

     $rootScope.proposalStage;
     $rootScope.candidateId;
     $scope.objKeyword = [];

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
                    if (result.Broad_area_of_research__c != undefined || result.Broad_area_of_research__c != "") {
                         result.Broad_area_of_research__c = result.Broad_area_of_research__c ? result.Broad_area_of_research__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result.Broad_area_of_research__c;
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
                    $scope.$apply();
               }

          });
     }
     $scope.getContactHostInfo();
     $scope.previousPage = function () {
          debugger;
          // $scope.redirectPageURL('FinancialOverview_wiser');
          // window.location.replace(window.location.origin+'/ApplicantDashboard/ApplicantPortal?id='+$rootScope.userId+'#/FinancialOverview_wiser');
          window.location.href = 'https://indo-germansciencetechnologycentre--newdevutil.sandbox.my.salesforce-sites.com/ApplicantDashboard/ApplicantPortal?id=' + $rootScope.candidateId;
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
               swal("info", "Please Enter Project Title.", "info");
               $("#txtTitle").addClass('border-theme');
               return;
          }

          if ($scope.objContact.Title_Of__c == undefined || $scope.objContact.Title_Of__c == "") {
               swal("info", "Please Enter Title Of Project.", "info");
               $("#titleOfProposal").addClass('border-theme');
               return;
          }

          if ($scope.objContact.Broad_area_of_research__c == undefined || $scope.objContact.Broad_area_of_research__c == "") {
               swal("info", "Please Enter Area Of Research.", "info");
               $("#areaOfResearch").addClass('border-theme');
               return;
          }

          if ($scope.objContact.Layman_title_of_project__c == undefined || $scope.objContact.Layman_title_of_project__c == "") {
               swal("info", "Please Enter Layman Title Of Project.", "info");
               $("#laymanTitle").addClass('border-theme');
               return;
          }

          if ($scope.objContact.Layman_title_of_project__c.length > 600) {
               swal(
                    "info",
                    "Please Enter Layman Title Of Proposal.",
                    "info");
               //$("#laymanTitle").addClass('border-theme');
               return;
          }

          if ($scope.objContact.Layman_abstract_of_proposed_work__c == undefined || $scope.objContact.Layman_abstract_of_proposed_work__c == "") {
               swal("info", "Please Enter Layman Abstract Of Proposed Work.", "info");
               $("#laymanabstract").addClass('border-theme');
               return;
          }

          if ($scope.objContact.Layman_abstract_of_proposed_work__c.length > 600) {
               swal(
                    "info",
                    "Please Enter Layman Abstract Of Proposed Work.",
                    "info");
               //$("#laymanabstract").addClass('border-theme');
               return;
          }

          // if (
          //      $scope.objContact.Duration_In_Months_Max_36__c === null || $scope.objContact.Duration_In_Months_Max_36__c === undefined
          // ) {
          //      swal("info", "Please Enter Project Duration.", "info");
          //      //$("#txtDuration").addClass('border-theme');
          //      return;
          // }

          if ($scope.formPrjDet.$invalid) {
               swal("info", "Duration must be between 24 and 36 months.", "info");
               $("#txtDuration").addClass('border-theme');
               return;
          }





          var keyword = ""; startDay
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
               swal("info", "Please Enter Keywords.", "info");
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
                    swal("info", "Abstract maxlength will be 700 characters only.", "info");
                    return;
               }
          }

          delete ($scope.objContact.Actual_Application_Start_Date__c);
          delete ($scope.objContact.Actual_Application_End_Date__c);
          delete $scope.objContact._charLimitMap;

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
                    console.log("Result In saveApplicationPortalHostInformation ::", result);
                    if (event.status) {
                         swal({
                              title: "SUCCESS",
                              text: 'Paired Project Details have been saved successfully.',
                              icon: "success",
                              button: "ok!",
                         });

                         // Fetch documents
                         // $scope.getProjectDetails();
                         // $scope.redirectPageURL('TwoReferenceWiser');
                         $scope.redirectPageURL('ProjectDetailsInWiserPage');
                         // $scope.redirectPageURL('WiserApplicationPage');
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

     $scope.removeClass2 = function (controlid) {
          $("#" + controlid + "").removeClass('border-theme');
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

     // --------------------- PROJECT PROPOSAL UPLOAD FUNCTIONALITY ----------------------- //
     // $scope.getProjectDetails = function () {
     //      debugger;
     //      ApplicantPortal_Contoller.getAllUserDoc($rootScope.proposalId, function (result, event) {
     //           debugger;
     //           console.log('result : ', result);
     //           if (event.status) {
     //                $scope.allDocs = result;
     //                for (var i = 0; i < $scope.allDocs.length; i++) {
     //                     if ($scope.allDocs[i].userDocument.Name == 'project Description') {
     //                          $scope.doc = $scope.allDocs[i];
     //                     }
     //                }
     //                $scope.$apply();
     //           }
     //      }, {
     //           escape: true
     //      })
     // }
     //$scope.getProjectdetils();

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

          var maxFileSize = fileSizeFun;
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
               swal('info', 'Please choose pdf file only.', 'info');
               return;
          }
          console.log(file);
          if (file != undefined) {
               if (file.size <= maxFileSize) {

                    if (file.size < minFileSize) {
                         swal("info", "File must be at least 30 KB.", "info");
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
                              swal("info", "Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".", "info");
                              return;
                              // alert("Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".");
                         }

                    }
                    fileReader.onerror = function (e) {
                         swal("info", "There was an error reading the file.  Please try again.", "info");
                         console.log('Error is==>', e);
                         console.log('Error Body Is===>', JSON.stringify(e.target.result));
                         return;
                         // alert("There was an error reading the file.  Please try again.");
                    }
                    fileReader.onabort = function (e) {
                         swal("info", "There was an error reading the file.  Please try again.", "info");
                         return;
                         // alert("There was an error reading the file.  Please try again.");
                    }

                    fileReader.readAsDataURL(file); //Read the body of the file

               } else {
                    swal("info", "File must be under 1 Mb in size.  Your file is too large.  Please try again.", "info");
                    return;
               }
          } else {
               swal("info", "You must choose a file before trying to upload it", "info");
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

          //var attachmentBody;
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

          ApplicantPortal_Contoller.doCUploadAttachmentAa(
               attachmentBody, attachmentName, fileId, userDocId,
               function (result, event) {
                    debugger;
                    console.log(result);
                    if (event.type === 'exception') {
                         console.log("exception");
                         console.log(event);
                    } else if (event.status) {
                         if (doneUploading == true) {
                              swal(
                                   'success',
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
          var jhj = $scope.selectedFile.userDocument.Attachments[0].Id;
          console.log(jhj);
          // $scope.filesrec = $sce.trustAsResourceUrl(window.location.origin + '/ApplicantDashboard/servlet/servlet.FileDownload?file=' + $scope.selectedFile.userDocument.Attachments[0].Id);
          $scope.filesrec = window.location.origin + '/ApplicantDashboard/servlet/servlet.FileDownload?file=' + $scope.selectedFile.userDocument.Attachments[0].Id;
          // $('#file_frame').attr('src', $scope.selectedFile.ContentDistribution.DistributionPublicUrl);
          $('#file_frame').attr('src', $scope.filesrec);

          var myModal = new bootstrap.Modal(document.getElementById('filePreview'))
          myModal.show('slow');
          $scope.$apply();

          //.ContentDistribution.DistributionPublicUrl
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
