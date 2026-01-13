angular.module('cp_app').controller('ProjectDetailsSing_Ctrl', function($scope,$rootScope) {
    $scope.objContact={};
    $scope.objProposal={};
    $rootScope.proposalId;
    $scope.objKeyword=[];
    $scope.config.height=400;
    $scope.objKeyword.push({keyword:""});
    $scope.objRtf=[{charCount:0,maxCharLimit:2500,errorStatus:false}];
    $scope.objRtf.push({charCount:1,maxCharLimit:1000,errorStatus:false});
    
    // Fetching the proposalId from Local Storage

    if (localStorage.getItem('proposalId')) {

        $rootScope.proposalId = localStorage.getItem('proposalId');

        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);

    }
 
    $scope.getProposalDet=function(){
        IndustrialFellowshipController.getProposalDet($rootScope.candidateId, function (result, event) {
          debugger
                console.log(result);
                console.log(event);
                $scope.objContact=result;
                if(result.Applicant_Proposal_Associations__r[0].Proposals__r!=undefined && result.Applicant_Proposal_Associations__r[0].Proposals__r!=''){
                    $scope.objProposal=result.Applicant_Proposal_Associations__r[0].Proposals__r;
                } 
                if($scope.objProposal.KeyWords__c!=undefined && $scope.objProposal.KeyWords__c!=''){
                  var keyword=$scope.objProposal.KeyWords__c.split(';');
                  $scope.objKeyword.splice(0,1);
                  for(var k=0;k<keyword.length;k++){
                    $scope.objKeyword.push({"keyword":keyword[k]});
                  }
                }
                if(result.Applicant_Proposal_Associations__r[0].Proposals__r.KeyWords__c != undefined || result.Applicant_Proposal_Associations__r[0].Proposals__r.KeyWords__c != ''){
                  $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.KeyWords__c = $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.KeyWords__c ? $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.KeyWords__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.KeyWords__c;  
                  // $scope.objContact.Proposals__r.Summary__c = $scope.objContact.Proposals__r.Summary__c ? $scope.objContact.Proposals__r.Summary__c.replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : $scope.objContact.Proposals__r.Summary__c; 
                }
                if(result.Applicant_Proposal_Associations__r[0].Proposals__r.Purpose_for_Applying_Other__c != undefined || result.Applicant_Proposal_Associations__r[0].Proposals__r.Purpose_for_Applying_Other__c != ''){
                  $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Purpose_for_Applying_Other__c = $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Purpose_for_Applying_Other__c ? $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Purpose_for_Applying_Other__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Purpose_for_Applying_Other__c;  
                  // $scope.objContact.Proposals__r.Summary__c = $scope.objContact.Proposals__r.Summary__c ? $scope.objContact.Proposals__r.Summary__c.replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : $scope.objContact.Proposals__r.Summary__c; 
                }
                if(result.Applicant_Proposal_Associations__r[0].Proposals__r.Title_Of__c != undefined || result.Applicant_Proposal_Associations__r[0].Proposals__r.Title_Of__c != ''){
                  $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Title_Of__c = $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Title_Of__c ? $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Title_Of__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Title_Of__c;  
                  // $scope.objContact.Proposals__r.Summary__c = $scope.objContact.Proposals__r.Summary__c ? $scope.objContact.Proposals__r.Summary__c.replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : $scope.objContact.Proposals__r.Summary__c; 
                }
                if(result.Applicant_Proposal_Associations__r[0].Proposals__r.Proposed_area__c != undefined || result.Applicant_Proposal_Associations__r[0].Proposals__r.Proposed_area__c != ''){
                  $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Proposed_area__c = $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Proposed_area__c ? $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Proposed_area__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Proposed_area__c;  
                  // $scope.objContact.Proposals__r.Summary__c = $scope.objContact.Proposals__r.Summary__c ? $scope.objContact.Proposals__r.Summary__c.replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : $scope.objContact.Proposals__r.Summary__c; 
                }
                if(result.Applicant_Proposal_Associations__r[0].Proposals__r.Abstract_of_proposed__c != undefined || result.Applicant_Proposal_Associations__r[0].Proposals__r.Abstract_of_proposed__c != ''){
                  $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Abstract_of_proposed__c = $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Abstract_of_proposed__c ? $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Abstract_of_proposed__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Abstract_of_proposed__c;  
                  // $scope.objContact.Proposals__r.Summary__c = $scope.objContact.Proposals__r.Summary__c ? $scope.objContact.Proposals__r.Summary__c.replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : $scope.objContact.Proposals__r.Summary__c; 
                }
                if(result.Applicant_Proposal_Associations__r[0].Proposals__r.Brief_Statement_of_Purpose__c != undefined || result.Applicant_Proposal_Associations__r[0].Proposals__r.Brief_Statement_of_Purpose__c != ''){
                  $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Brief_Statement_of_Purpose__c = $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Brief_Statement_of_Purpose__c ? $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Brief_Statement_of_Purpose__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Brief_Statement_of_Purpose__c;  
                  // $scope.objContact.Proposals__r.Summary__c = $scope.objContact.Proposals__r.Summary__c ? $scope.objContact.Proposals__r.Summary__c.replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : $scope.objContact.Proposals__r.Summary__c; 
                }  
                if(result.Applicant_Proposal_Associations__r[0].Proposals__r.Summary__c != undefined || result.Applicant_Proposal_Associations__r[0].Proposals__r.Summary__c != ''){
                  $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Summary__c = $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Summary__c ? $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Summary__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Summary__c;  
                  // $scope.objContact.Proposals__r.Summary__c = $scope.objContact.Proposals__r.Summary__c ? $scope.objContact.Proposals__r.Summary__c.replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : $scope.objContact.Proposals__r.Summary__c; 
                }
                if(result.Applicant_Proposal_Associations__r[0].Proposals__r.Research_Approach_Objectives__c != undefined || result.Applicant_Proposal_Associations__r[0].Proposals__r.Research_Approach_Objectives__c != ''){
                  $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Research_Approach_Objectives__c = $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Research_Approach_Objectives__c ? $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Research_Approach_Objectives__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.Research_Approach_Objectives__c;  
                }
                
                $scope.$apply(); 
        });
    }
    $scope.addKeyword=function(){
      debugger
      if($scope.objKeyword.length<=4){
          $scope.objKeyword.push({keyword:""});
          $scope.$apply();
      }
    }
    $scope.removeKeyword=function(index){
      if($scope.objKeyword.length>1){
      $scope.objKeyword.splice(index, 1);
      }  
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
  
    $scope.removeClass=function(){
      $("input[name=txtInputs]").removeClass('border-theme');
    }
    $scope.saveProjectDetailsSing=function(){
      if($rootScope.proposalStage){
        $scope.redirectPageURL('AttachmentsSing');
        return;
      }
      $scope.objProposal.Campaign__c = $rootScope.tagCampaignId;

      if($scope.objProposal.Purpose_for_applying__c==undefined || $scope.objProposal.Purpose_for_applying__c=='' || $scope.objProposal.Purpose_for_applying__c==' '){
        swal('info','Please select purpose for applying to SING.','info');
        return;
      }
      if($scope.objProposal.Purpose_for_applying__c == "Other" && $scope.objProposal.Purpose_for_Applying_Other__c == undefined){
        swal('info','Please specify purpose for applying.','info');
        $("#other").addClass('border-theme');
        return;
      }
      if($scope.objProposal.Title_Of__c==undefined || $scope.objProposal.Title_Of__c=='' || $scope.objProposal.Title_Of__c==' '){
        swal('info','Please enter title of the research.','info');
        $("#txtTitle").addClass('border-theme');
        return;
      }
      if($scope.objProposal.Proposed_area__c==undefined || $scope.objProposal.Proposed_area__c=='' || $scope.objProposal.Proposed_area__c==' '){
        swal('info','Please enter broad area of research.','info');
        $("#txtBrdAreaResearch").addClass('border-theme');
        return;
      }
      if($scope.objProposal.Abstract_of_proposed__c==undefined || $scope.objProposal.Abstract_of_proposed__c=='' || $scope.objProposal.Abstract_of_proposed__c==' '){
        swal('info','Please enter abstract of proposed work.','info');
        //$("#txtProposedWork").addClass('border-theme');
        return;
      }
      if($scope.objProposal.Brief_Statement_of_Purpose__c==undefined || $scope.objProposal.Brief_Statement_of_Purpose__c=='' || $scope.objProposal.Brief_Statement_of_Purpose__c==' '){
        swal('info','Please enter brief description of the organization.','info');
        $("#txtBStatement").addClass('border-theme');
        return;
      }
      if($scope.objProposal.Research_Approach_Objectives__c==undefined || $scope.objProposal.Research_Approach_Objectives__c=='' || $scope.objProposal.Research_Approach_Objectives__c==' '){
        swal('info','Please enter enhance Indo-German Colloboration.','info');
        //$("#txtIndoGerman").addClass('border-theme');
        return;
      }

      if($scope.objProposal.Title_Of__c.length > 255){
        swal('info','Maxlength for Title of the Proposed Work is 255 characters only.','info');
        $("#txtTitle").addClass('border-theme');
        return;
      }

      if($scope.objProposal.Proposed_area__c.length > 255){
        swal('info','Maxlength for Broad area of work is 255 characters only.','info');
        $("#txtBrdAreaResearch").addClass('border-theme');
        return;
      }

      if($scope.objProposal.Abstract_of_proposed__c.length > 255){
        swal('info','Maxlength for Abstract of the proposed work is 255 characters only.','info');
        // $("#txtBrdAreaResearch").addClass('border-theme');
        return;
      }

      if($scope.objProposal.Brief_Statement_of_Purpose__c.length > 255){
        swal('info','Maxlength for Brief description of the Organisation/Institution/Industry is 255 characters only.','info');
        // $("#txtBrdAreaResearch").addClass('border-theme');
        return;
      }
      
      if($scope.objRtf[0].charCount > 2500){
        swal('info','Max characters limit for Project Description is 2500 only','info');
        return;
      }
      if($scope.objRtf[1].charCount > 1000){
        swal('info','Max characters limit for enhance the Indo-German Collaboration is 1000 only','info');
        return;
      }
        delete $scope.objContact.Applicant_Proposal_Associations__r;
        debugger
        var keyword="";
        for(var i=0;i<$scope.objKeyword.length;i++){
          if(i==0)
          keyword=$scope.objKeyword[i].keyword;
          else
          keyword=keyword+';'+$scope.objKeyword[i].keyword;
        }
        $scope.objProposal.KeyWords__c=keyword;
        if($scope.objProposal.KeyWords__c==undefined || $scope.objProposal.KeyWords__c=='' || $scope.objProposal.KeyWords__c==' '){
          swal('info','Please enter altleast one keyword.','info');
          $("#txtKeyword0").addClass('border-theme');
          return;
        }

        if ($scope.objProposal.Duration_In_Months_Max_36__c == undefined || $scope.objProposal.Duration_In_Months_Max_36__c == ""){
          swal("info", "Please Enter Project Duration.","info");
          $("#txtDuration").addClass('border-theme');
            return;
      }

        if ($scope.objProposal.Duration_In_Months_Max_36__c > 12){
          swal("info", "Duration should not be greater than 12 months.","info");
          $("#txtDuration").addClass('border-theme');
            return;
      }

        // if(!$rootScope.proposalStage){
        //   $scope.objProposal.Proposal_Stages__c = 'Draft';    
        // }
        // else
        // {
        //     $scope.objProposal.Proposal_Stages__c = 'Submitted';
        // }
        if(!$rootScope.secondstage){
            $scope.objProposal.Stage__c = '1st Stage';    
        }
        else
        {
            $scope.objProposal.Stage__c = '2nd Stage';
        }
        $scope.objProposal.Campaign__c = $rootScope.campaignId;
        IndustrialFellowshipController.saveProjectDetailsSing($rootScope.candidateId,$scope.objContact,$scope.objProposal,$rootScope.accountId,'SING', function (result, event) {
          debugger     
          console.log(result);
                console.log(event);
                if (event.status) {
                  $rootScope.projectId=result;
                    swal({
                      title: "SUCCESS",
                      text: "Details of the Proposed work have been saved successfully.",
                      icon: "success",
                      button: "ok!",
                    }).then((value) => {
                      $scope.redirectPageURL('BudgetDetails');
                        });
                  }
                  else
                  {
                    swal({
                      title: "Proposals Details",
                      text: "Exception!",
                      icon: "error",
                      button: "ok!",
                    });
                  }
        });  
    }
    $scope.redirectPageURL=function(URL){
      var link=document.createElement("a");
      link.id = 'someLink'; //give it an ID!
      link.href='#/'+URL+'';
      link.click();
    }
    $scope.getProposalDet();

    $scope.restrictDecimalVal = function(myVar){
      // myVar = Math.round($scope.applicantDetails.Duration_In_Months_Max_36__c);
      console.log(myVar);
      if(myVar>12 || myVar<0 ){
          return false;
      }
      else
      {
          return true;
      }
  }
});