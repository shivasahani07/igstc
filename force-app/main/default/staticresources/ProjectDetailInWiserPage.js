/**
 * @author [Dinesh B]
 * @email dinesh.b@utilitarianLab.com
 * @create date 2022-08-13 13:18:26
 * @modify date 2022-10-15 12:58:57
 * @desc [description]
 */


angular.module('cp_app').controller('ProjectDetailInWiserCtrl', function ($scope,$sce,$rootScope) {
     debugger;
     $rootScope.userHashId;
    //new 
    $rootScope.campaignId;
    //
     $rootScope.userId;
    $rootScope.candidateId;
    
     $rootScope.contactId;
     $scope.objKeyword=[];
     $scope.doc={};
     $scope.config.height=500;
     $scope.objRtf=[{charCount:0,maxCharLimit:600,errorStatus:false}];
     $scope.objRtf.push({charCount:0,maxCharLimit:4500,errorStatus:false});
     debugger;

     $scope.selectedFile;
     $scope.isPdfUploded = false;
      
     // ============================================
     /*var maxFileSize = 1048576; // 1MB in bytes
     var maxStringSize = 6000000; // Maximum base64 string size 
     var chunkSize = 950000; // Chunk size for splitting large files
     var attachment = '';
     var attachmentName = '';
     var positionIndex = 0;
     var fileSize = 0;
     var fileName = '';
     var lengthOfType = 0;
     var doneUploading = false;*/
    var maxFileSize = 1048576;
    var chunkSize = 950000;

$scope.filePreviewHandler = function(fileContent){
    debugger;
    $scope.selectedFile = fileContent;

    console.log('selectedFile---', $scope.selectedFile);

    var jhj=$scope.selectedFile.userDocument.Attachments[0].Id;
    console.log(jhj);

    if(localStorage.getItem('proposalId')){
        $rootScope.proposalId=localStorage.getItem('proposalId');
        $scope.applicantDetails.Id=localStorage.getItem('proposalId');
        
    }

    $scope.filesrec = $sce.trustAsResourceUrl(window.location.origin +'/ApplicantDashboard/servlet/servlet.FileDownload?file='+$scope.selectedFile.userDocument.Attachments[0].Id);
    $('#file_frame').attr('src', $scope.filesrec);

    // $('#file_frame').attr('src', $scope.selectedFile.ContentDistribution.DistributionPublicUrl);

    var myModal = new bootstrap.Modal(document.getElementById('filePreview'))        
    myModal.show('slow') ;
    $scope.$apply();

    //.ContentDistribution.DistributionPublicUrl
}

     $scope.getProjectdetils = function () {
          debugger;
          ApplicantPortal_Contoller.getAllUserDoc($rootScope.projectId, function (result, event) {
              debugger
              console.log('result return onload :: ');
              console.log(result);
              if (event.status) {
                  $scope.allDocs = result;
                  $scope.userdocsIds = '';
                  for(var i=0;i<$scope.allDocs.length;i++){
                      if($scope.allDocs[i].userDocument.Name == 'project Description'){
                          $scope.doc=$scope.allDocs[i];
                          // Append ID with a comma only if userdocsIds is not empty
                          if ($scope.userdocsIds) {
                            $scope.userdocsIds += ',';
                          }
                          $scope.userdocsIds += $scope.allDocs[i].userDocument.Id;
                          if($scope.allDocs[i].userDocument.Status__c == 'Uploaded'){
                            $scope.isPdfUploded = true;
                          }
                      }
                  }
                  $scope.$apply();
              }
          }, {
              escape: true
          })
      }
      $scope.getProjectdetils();
      
      $scope.readCharacter=function(event,index){
          debugger
             try{
             var rtfString=event.toString().replace(/<[^>]*>|\s/g, '').replace(/\s+/g,'').replace(/&ndash;/g,'-').replace(/&euro;/g,'1').replace(/&amp;/g,'1').replace(/&#39;/g,'1').replace(/&quot;/g,'1').replace(/&nbsp;/g,'').replace(/&mdash;/g,'-').replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&bull;/g,'');
              charLength=rtfString.length;
              if(charLength>0){
               $scope.objRtf[index].charCount=charLength;
               if(charLength>$scope.objRtf[index].maxCharLimit){
                    $scope.objRtf[index].errorStatus=true;
               }else{
                    $scope.objRtf[index].errorStatus=false;
              }
              }
              else{
                    $scope.objRtf[index].charCount=0;
                    $scope.objRtf[index].errorStatus=false;
              }
             }catch(e){}
         }
      $scope.uploadFile = function (type, userDocId, fileId, fileSizeFun) {
          debugger;
          maxFileSize=fileSizeFun;
          $scope.showSpinnereditProf = true;
          var file;
        //new Lines 
          var inputElement = document.getElementById(type);
            if(!inputElement || !inputElement.files || inputElement.files.length === 0){
                swal('info', 'Please select a file before uploading.', 'info');
                return;
            }
            var file = inputElement.files[0];

          fileName = file.name;
          var typeOfFile = fileName.split("."); 
          lengthOfType =  typeOfFile.length;
          if(typeOfFile[lengthOfType-1] == "pdf" || typeOfFile[lengthOfType-1] == "PDF"){
              
          }else{
            swal('info','Please choose pdf file only.','info');
              return;
          }
          console.log(file);
          if (file != undefined) {
            var fileSize1 = file.size/2;
              if (file.size <= maxFileSize) {
                  
                  attachmentName = file.name;
                  const myArr = attachmentName.split(".");
                  /* if (myArr[1] != "pdf" && type != 'profilePic') {
                      alert("Please upload in PDF format only");
                      return;
                  } */
                  var fileReader = new FileReader();
                  var maxStringSize=6000000;
                  fileReader.onloadend = function (e) {
                      attachment = window.btoa(this.result);  //Base 64 encode the file before sending it
                      console.log("Attachments========> ", attachment, this.result);
                      positionIndex = 0;
                      fileSize = attachment.length;
                      $scope.showSpinnereditProf = false;
                      console.log("Total Attachment Length: " + fileSize);
                      doneUploading = false;
                      debugger;
                      
                      if (fileSize < maxStringSize) {
                          $scope.uploadAttachment(type , userDocId, null);
                      } else {
                        swal("info", "Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".","info");
                        return;
                        //   alert("Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".");
                      }
      
                  }
                  fileReader.onerror = function (e) {
                    swal("info", "There was an error reading the file.  Please try again.","info");
                      return;
                    //   alert("There was an error reading the file.  Please try again.");
                  }
                  fileReader.onabort = function (e) {
                    swal("info", "There was an error reading the file.  Please try again.","info");
                    return;
                    //   alert("There was an error reading the file.  Please try again.");
                  }
      
                  fileReader.readAsBinaryString(file);  //Read the body of the file
      
              } else {
                swal("info", "File must be under 1 Mb in size.  Your file is too large.  Please try again.","info");
                  return;
                //   alert("File must be 1 MB in size.  Your file is too large.  Please try again.");
                //   $scope.showSpinnereditProf = false;
              }
          } else {
            swal("info", "You must choose a file before trying to upload it","info");
        return;
            //   alert("You must choose a file before trying to upload it");
            //   $scope.showSpinnereditProf = false;
          }
      }
      
      $scope.uploadAttachment = function (type, userDocId, fileId) {
          debugger;
          var attachmentBody = "";
          var chunkSize=750000;
        //   if (fileId == undefined) {
        //       fileId = " ";
        //   }
          if (fileSize <= positionIndex + chunkSize) {
              debugger;
              attachmentBody = attachment.substring(positionIndex);
              doneUploading = true;
          } else {
              attachmentBody = attachment.substring(positionIndex, positionIndex + chunkSize);
          }
          console.log("Uploading " + attachmentBody.length + " chars of " + fileSize);
          ApplicantPortal_Contoller.doCUploadAttachmentSignatureCustom(
              attachmentBody, attachmentName,fileId, userDocId,
              function (result, event) {
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
                          
                          $scope.getProjectdetils();
                          // $scope.disableSubmit = false;
                              
                        //   }
                          $scope.showUplaodUserDoc = false;
                         // $scope.getCandidateDetails();
                         $scope.isPdfUploded = true;
      
                      } else {
                          debugger;
                          positionIndex += chunkSize;
                          $scope.uploadAttachment(type,userDocId,result);
                      }
                    }
              },
      
      
              { buffer: true, escape: true, timeout: 240000 }
          );
      }


     $scope.getApplicantDetailsWiser = function () {
        

          ApplicantPortal_Contoller.getApplicantDetailsWiser($rootScope.candidateId, $rootScope.proposalId, function (result, event) {
               if (event.status) {
                    debugger;
                    if(result != null){
                        if(result.Title_Of__c != undefined || result.Title_Of__c != ""){
                            result.Title_Of__c = result.Title_Of__c ? result.Title_Of__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Title_Of__c;
                        }
                        if(result.Broad_area_of_research__c != undefined || result.Broad_area_of_research__c != ""){
                            result.Broad_area_of_research__c = result.Broad_area_of_research__c ? result.Broad_area_of_research__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Broad_area_of_research__c;
                        }
                        if(result.KeyWords__c != undefined || result.KeyWords__c != ""){
                            result.KeyWords__c = result.KeyWords__c ? result.KeyWords__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.KeyWords__c;
                        }
                         if(result.Abstract_of_proposed_work__c != undefined || result.Abstract_of_proposed_work__c != ""){
                              result.Abstract_of_proposed_work__c = result.Abstract_of_proposed_work__c ? result.Abstract_of_proposed_work__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Abstract_of_proposed_work__c;
                          }
                          if(result.Project_Description__c != undefined || result.Project_Description__c != ""){
                              result.Project_Description__c = result.Project_Description__c ? result.Project_Description__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Project_Description__c;
                          }
                         $scope.applicantDetails = result;
                         if($scope.applicantDetails.KeyWords__c!=undefined && $scope.applicantDetails.KeyWords__c!=''){
                              var keyword=$scope.applicantDetails.KeyWords__c.split(';');
                              $scope.objKeyword.splice(0,1);
                              for(var k=0;k<keyword.length;k++){
                                $scope.objKeyword.push({"keyword":keyword[k]});
                              }
                            } 
                            else{
                              $scope.objKeyword.push({"keyword":""});
                            }
                    }else{
                         $scope.objKeyword.push({"keyword":""});
                    }
                    $scope.$apply();
                 }
             },
               {escape: true}
           )
         }

     //$scope.getApplicantDetailsWiser();
     $scope.applicantDetails = {};

     $scope.saveApplication = function () {

      // if(! $scope.isPdfUploded){
      //   swal('info','Please upload the PDF file.','info'); 
      // }
      // else {
          $scope.applicantDetails.Campaign__c = $rootScope.campaignId;
          debugger;

          if ($scope.applicantDetails.Title_Of__c == undefined || $scope.applicantDetails.Title_Of__c == "") {
               swal("info", "Please Enter Title of proposal.","info");
               $("#txtTitle").addClass('border-theme');
               return; 
          }

          if($scope.applicantDetails.Broad_area_of_research__c == undefined || $scope.applicantDetails.Broad_area_of_research__c == ""){
               swal("info", "Please Enter Broad Area of Reasearch.","info");
               $("#txtResearch").addClass('border-theme');
               return;  
          }

          if ($scope.applicantDetails.Duration_In_Months_Max_36__c == undefined || $scope.applicantDetails.Duration_In_Months_Max_36__c == ""){
               swal("info", "Please Enter Project Duration.","info");
               $("#txtDuration").addClass('border-theme');
                 return;
           }

           if ($scope.applicantDetails.Duration_In_Months_Max_36__c < 24 || $scope.applicantDetails.Duration_In_Months_Max_36__c > 36){
               swal("Proposal Detail", "Duration must be between 24 to 36 months.");
                    $("#txtDuration").addClass('border-theme');
                      return;
           }

           var keyword="";
        for(var i=0;i<$scope.objKeyword.length;i++){
            if($scope.objKeyword[i].keyword!='' && $scope.objKeyword[i].keyword!=undefined){
                if(i==0)
                keyword=$scope.objKeyword[i].keyword;
                else
                keyword=keyword+';'+$scope.objKeyword[i].keyword;
            }
        }
        $scope.applicantDetails.KeyWords__c=keyword;

        if($scope.applicantDetails.KeyWords__c == undefined || $scope.applicantDetails.KeyWords__c == ""){
          swal("info", "Please Enter Keyword.","info");
          $("#txtKeyword").addClass('border-theme');
            return;
      }

          if($scope.applicantDetails.Abstract_of_proposed_work__c == undefined || $scope.applicantDetails.Abstract_of_proposed_work__c == ""){
               swal("info", "Please Enter Abstract of proposed work.","info");
               return;  
          }else{
            //    var div = document.createElement("div");
            //   div.innerHTML = $scope.applicantDetails.Abstract_of_proposed_work__c;
            //   let abstractText = div.innerText.replace(/(\r\n\t|\t|\n|\r)/gm, "");
            //   abstractText = abstractText.replaceAll(' ','');
              
            //   console.log('abstractText---',abstractText);
            //   console.log('abstractTextLength---',abstractText.length);
                  
                  
               if($scope.objRtf[0].charCount > 600){
                   swal("info", "Abstract of proposed work maxlength will be 600 characters only.","info");
                   return;
               }
       }


      //     if($scope.applicantDetails.Project_Description__c == undefined || $scope.applicantDetails.Project_Description__c == ""){
      //          swal("info", "Please Enter Project Description.","info");
      //          // $("#txtDescription").addClass('border-theme');
      //          return;  
      //     }else{
      //       //    var div = document.createElement("div");
      //       //   div.innerHTML = $scope.applicantDetails.Project_Description__c;
      //       //   let description = div.innerText.replace(/(\r\n\t|\t|\n|\r)/gm, "");
      //       //   description = description.replaceAll(' ','');
                
      //         //  if($scope.objRtf[1].charCount > 4500){
      //         //      swal("info", "Project description maxlength will be 4500 characters only.","info");
      //         //      return;
      //         //  }
      //  }

      

          // if ($scope.applicantDetails.Duration_In_Months_Max_36__c > 36){
          //      swal("Proposal Detail", "Duration must be under 36 months.");
          //      $("#txtDuration").addClass('border-theme');
          //        return;
          //  }
          if (!$rootScope.proposalStage) {
               $scope.applicantDetails.Proposal_Stages__c = 'Draft';
          } else {
               $scope.applicantDetails.Proposal_Stages__c = 'Submitted';
          }
          if(localStorage.getItem('yearlyCallId')){
            $scope.applicantDetails.yearly_Call__c=localStorage.getItem('yearlyCallId');
          }
          
          ApplicantPortal_Contoller.insertApplicationWiser($scope.applicantDetails, $rootScope.contactId,'WISER', function (result, event) {

            if(event.status && result != null){
                $rootScope.projectId = result.proposalId;
                localStorage.setItem('proposalId', result.proposalId);
                localStorage.setItem('apaId', result.apa.Id);
                    console.log(result);                    
                swal({
                     title: "SUCCESS",
                     text: 'Your project details have been saved successfully.',
                     icon: "success",
                     button: "ok!",
                })  
                $scope.redirectPageURL('WiserApplicationPage');                  
              
           } else{
                swal({
                     title: "ERROR",
                     text: "Exception !",
                     icon: "error",
                     button: "ok!",
                });
           }

            //    if (event.status && result != null) {
            //         $rootScope.projectId = result;
            //         console.log(result);
            //         Swal.fire(
            //              'Success',
            //              'Your project details have been saved successfully.',
            //              'success'
            //         );
            //         $scope.redirectPageURL('FinancialOverview_wiser');
            //    } else {
            //         Swal.fire(
            //              'Error',
            //              'Error.',
            //              'error'
            //         );
            //    }

          });
        
     };

     $scope.getApplicantDetailsWiser();
     $scope.addKeyword=function(){
          debugger
          if($scope.objKeyword.length<=5){
              $scope.objKeyword.push({keyword:""});
              $scope.$apply();
          }
        }
        $scope.removeKeyword=function(index){
          if($scope.objKeyword.length>1){
          $scope.objKeyword.splice(index, 1);
          }  
        }

        $scope.restrictDecimalVal = function(myVar){
          debugger;
          if(myVar>36){
               $scope.applicantDetails.Duration_In_Months_Max_36__c=36;
          //     return false;
          }
          else{
               return true;
          }
      }

      $scope.redirectPageURL = function(pageName){
          debugger;
          var link=document.createElement("a");
          link.id = 'someLink'; //give it an ID!
          link.href="#/"+pageName;
          link.click();
      }

      $scope.rtfMaxLength = function(myVar){
          debugger
          var k = myVar;
          if(myVar.length>300){
              return false;
          }
          else
          {
              return true;
          }
      }
      $scope.removeClass=function(controlid){
          $("#"+controlid+"").removeClass('border-theme');
        }

})