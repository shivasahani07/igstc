angular.module('cp_app').controller('revSubmit_ctrl', function($scope,$sce,$rootScope){
    $scope.projectData={};
    $scope.objAchievments={};
    $scope.siteURL = siteURL;
    $scope.objDocFirst={};
    $scope.objDocSecond={};
    debugger
    if($rootScope.isPrimaryContact!="false") { 
        $('#btnSubmit').show();
    }
     // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId +'--'+$rootScope.proposalDetails +'--'+$scope.proposalDetails);
    }
    
    
    debugger
    /*
    $scope.getProjectdetils = function(){
        debugger;        
        ApplicantPortal_Contoller.getProjectdetils($rootScope.candidateId,function(result,event){
            if(event.status){
                $scope.proposalDetails = result;
                $scope.$apply();
            }
            if($scope.projectData.length==0){
                location.reload();
            }
        },
        {escape: true}
      )
    }
	*/
    
    $scope.getPECFARProposalDetails=function(){
        ApplicantPortal_Contoller.getPECFARProposalDetails($rootScope.proposalId, function(result,event){
            console.log('project data');
            console.log(result);
            if(event.status){
                $scope.projectData=result.Lcon;
                $scope.objAchievments=result.achievements;
                $scope.proposalDetails=result.proposal;
                /*for(var i=0;i<$scope.projectData.length;i++){
                    if(i==0)
                    $scope.getProjectdetils($scope.projectData[i].Id,'a');
                    else
                    $scope.getProjectdetils($scope.projectData[i].Id,'b');
                } */
            }
        });
    }
    $scope.getPECFARProposalDetails();
   // $scope.getProjectdetils();
    $scope.saveDetails = function(){
        debugger;
        ApplicantPortal_Contoller.saveAsDraftPecfar($scope.proposalDetails, function(result,event){
            if(event.status){
                debugger;
                Swal.fire(
                    'Success',
                    'Your proposal has been saved as draft.',
                    'success'
                );
                $scope.redirectPageURL('Home');
                $scope.proposalDetails = result;
                $scope.$apply();
            }
        },
       {escape: true}
        )
    }

    $scope.saveFinal = function(){
        debugger;
        if($rootScope.disabledCampaign){
            swal('Campaign ended','Campaign deadline has been lapsed.','info');
            return;
        }
        if($scope.projectData.length==0){
            location.reload();
        }
        if($scope.projectData.length<2){
         swal('Review and Submit','Before submit the proposal, please add second contact.');
         return;   
        }
        // if($scope.proposalDetails.Privacy_Policy_Accepted__c == false){
        //     swal("Review And Submit", "Please Accept the Privacy Policy to Submit your Application.");
        //             return;
        // }
        for(var i=0;i<$scope.projectData.length;i++){
            if($scope.projectData[i].FirstName==undefined || $scope.projectData[i].FirstName==""){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }
            else if($scope.projectData[i].LastName==undefined || $scope.projectData[i].LastName==""){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }
            else if($scope.projectData[i].Account.Name==undefined || $scope.projectData[i].Account.Name==""){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }
            else if($scope.projectData[i].Email==undefined || $scope.projectData[i].Email==""){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }
            else if($scope.projectData[i].Email==undefined || $scope.projectData[i].Email==""){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }
            else if($scope.projectData[i].Name==undefined || $scope.projectData[i].Name==""){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }
            else if($scope.projectData[i].Gender__c==undefined || $scope.projectData[i].Gender__c==""){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }
            else if($scope.projectData[i].Nationality__c==undefined || $scope.projectData[i].Nationality__c==""){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }
            else if($scope.projectData[i].MobilePhone==undefined || $scope.projectData[i].MobilePhone==""){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }
            else if($scope.projectData[i].Designation__c==undefined || $scope.projectData[i].Designation__c==""){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }
            else if($scope.projectData[i].MailingStreet==undefined || $scope.projectData[i].MailingStreet==""){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }
            else if($scope.projectData[i].Attachments==undefined){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }
            else if($scope.projectData[i].Education_Details__r==undefined){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            } 
            // else if($scope.projectData[i].Account.Email__c==undefined || $scope.projectData[i].Account.Email__c==""){
            //     swal('Review and Submit','Please ask your partner to fill all their details.');
            //     return;
            // }
            else if($scope.projectData[i].Account.Homepage_URL__c==undefined || $scope.projectData[i].Account.Homepage_URL__c==""){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            } 
            else if($scope.projectData[i].Account.BillingCountry==undefined || $scope.projectData[i].Account.BillingCountry==""){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }
            else if($scope.projectData[i].Account.BillingPostalCode==undefined || $scope.projectData[i].Account.BillingPostalCode==""){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }
            else if($scope.projectData[i].Account.Organisation_Posrt__c==undefined || $scope.projectData[i].Account.Organisation_Posrt__c==""){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            } 
            else if($scope.projectData[i].Planned_research_activities_of_the_visit__c==undefined || $scope.projectData[i].Planned_research_activities_of_the_visit__c==""){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }
            else if($scope.projectData[i].Expected_outcomes__c==undefined || $scope.projectData[i].Expected_outcomes__c==""){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }   
            else if($scope.projectData[i].Basis_for_choosing_your_paired_member__c==undefined || $scope.projectData[i].Basis_for_choosing_your_paired_member__c==""){
                swal('Review and Submit','Please ask your partner to fill all their details');
                return;
            }
            
            else if($scope.projectData[i].Tentative_Start_Date__c==undefined || $scope.projectData[i].Tentative_Start_Date__c==""){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }
            else if($scope.projectData[i].Tentative_End_Date__c==undefined || $scope.projectData[i].Tentative_End_Date__c==""){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            } 
            else if($scope.projectData[i].Availing_Fellowship__c==undefined){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }
            else if($scope.projectData[i].Availing_Fellowship__c=="Yes" && ($scope.projectData[i].Give_Fellowship_Details__c==undefined || $scope.projectData[i].Give_Fellowship_Details__c=="")){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }
            else if($scope.projectData[i].Associated_with_IGSTC__c==undefined){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }
            else if($scope.projectData[i].Associated_with_IGSTC__c=="Yes" && ($scope.projectData[i].Give_Associated_Details__c==undefined || $scope.projectData[i].Give_Associated_Details__c=="")){
                swal('Review and Submit','Please ask your partner to fill all their details.');
                return;
            }
        }   
        for(var i=0;i<$scope.objDocSecond.length;i++){
            if($scope.objDocSecond[i].userDocument.Name == 'Scan copy of Passport/Proof of Date of birth.'){
                if($scope.objDocSecond[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }else if($scope.objDocSecond[i].userDocument.Name == 'Educational Qualification certificates.'){
                if($scope.objDocSecond[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }else if($scope.objDocSecond[i].userDocument.Name == 'Invitation letter from the host organization'){
                if($scope.objDocSecond[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }else if($scope.objDocSecond[i].userDocument.Name == 'No Objection Certificate'){
                if($scope.objDocSecond[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }else if($scope.objDocSecond[i].userDocument.Name == 'Signature'){
                if($scope.objDocSecond[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }
            else if($scope.objDocSecond[i].userDocument.Name == 'Proof of employment'){
                if($scope.objDocSecond[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }
        } 
        for(var i=0;i<$scope.objDocFirst.length;i++){
            if($scope.objDocFirst[i].userDocument.Name == 'Scan copy of Passport/Proof of Date of birth.'){
                if($scope.objDocFirst[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }else if($scope.objDocFirst[i].userDocument.Name == 'Educational Qualification certificates.'){
                if($scope.objDocFirst[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }else if($scope.objDocFirst[i].userDocument.Name == 'Invitation letter from the host organization'){
                if($scope.objDocFirst[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }else if($scope.objDocFirst[i].userDocument.Name == 'No Objection Certificate'){
                if($scope.objDocFirst[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }else if($scope.objDocFirst[i].userDocument.Name == 'Signature'){
                if($scope.objDocFirst[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }
            else if($scope.objDocFirst[i].userDocument.Name == 'Proof of employment'){
                if($scope.objDocFirst[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }
        }     
        ApplicantPortal_Contoller.finalSubmitPecfar($scope.proposalDetails, function(result,event){
            if(event.status){
                debugger;
                Swal.fire(
                    'Success',
                    'Your proposal has been submitted successfully.',
                    'success'
                );
                $rootScope.proposalStage=true;
                CKEDITOR.config.readOnly = true;
                $scope.redirectPageURL('Home');
                $scope.proposalDetails = result;
                $scope.$apply();
            }
        },
       {escape: true}
        )
    }
    $scope.reviewApp=function(){
        debugger
        $("#btnPreview").html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Generating...');
            ApplicantPortal_Contoller.reviewAppDocGen($rootScope.projectId,function(result,event){
                console.log("now call for doc");
            console.log(result);
            setTimeout(
                function(){
                    $("#btnPreview").html('<i class="fa-solid fa-eye me-2"></i>Review');
                    $scope.getDoc();
                    $scope.$digest();
                }, 
                37000);
        });
    }
    $scope.getDoc=function(){
        ApplicantPortal_Contoller.getCongaDoc($rootScope.projectId,function(result,event){
        debugger
            console.log("attachamnet id");
        console.log(result);
        if(result.length<1){
            swal('','Document generation fail, please try again or contact to support.','error');
            return;
        }
        let baseUrl = window.location.origin;
        $scope.fileUrl = $sce.trustAsResourceUrl(baseUrl+'/servlet/servlet.FileDownload?file='+result[0].Id+'#view=FitH');
        var myModal = new bootstrap.Modal(document.getElementById('filePreview2'))
        myModal.show('slow');
        $scope.$apply();
    });
    }
    $scope.getProjectdetils = function (contactId,sFlag) {
        debugger;
        ApplicantPortal_Contoller.getContactUserDoc(contactId, $rootScope.proposalId, function (result, event) {
            debugger
            console.log('result return onload :: ');
            console.log(result);
            if (event.status) {
                if(sFlag=='a')
                $scope.objDocFirst = result;
                else
                $scope.objDocSecond = result;                
                $scope.$apply();
            }
        }, {
            escape: true
        })
      }
      $scope.checkDocFirst=function(){
        for(var i=0;i<$scope.objDocFirst.length;i++){
            if($scope.objDocFirst[i].userDocument.Name == 'Scan copy of Passport/Proof of Date of birth.'){
                if($scope.objDocFirst[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }else if($scope.objDocFirst[i].userDocument.Name == 'Educational Qualification certificates.'){
                if($scope.objDocFirst[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }else if($scope.objDocFirst[i].userDocument.Name == 'Invitation letter from the host organization'){
                if($scope.objDocFirst[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }else if($scope.objDocFirst[i].userDocument.Name == 'No Objection Certificate'){
                if($scope.objDocFirst[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }else if($scope.objDocFirst[i].userDocument.Name == 'Signature'){
                if($scope.objDocFirst[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }
            else if($scope.objDocFirst[i].userDocument.Name == 'Proof of employment'){
                if($scope.objDocFirst[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }
        } 
      }
      $scope.checkDocSecond=function(){
        for(var i=0;i<$scope.objDocSecond.length;i++){
            if($scope.objDocSecond[i].userDocument.Name == 'Scan copy of Passport/Proof of Date of birth.'){
                if($scope.objDocSecond[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }else if($scope.objDocSecond[i].userDocument.Name == 'Educational Qualification certificates.'){
                if($scope.objDocSecond[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }else if($scope.objDocSecond[i].userDocument.Name == 'Invitation letter from the host organization'){
                if($scope.objDocSecond[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }else if($scope.objDocSecond[i].userDocument.Name == 'No Objection Certificate'){
                if($scope.objDocSecond[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }else if($scope.objDocSecond[i].userDocument.Name == 'Signature'){
                if($scope.objDocSecond[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }
            else if($scope.objDocSecond[i].userDocument.Name == 'Proof of employment'){
                if($scope.objDocSecond[i].userDocument.Status__c == 'Pending'){
                    swal('Submit and Review','Please ask your partner to fill all their details.');
                    return;
                }
            }
        } 
      }

   /*   
    $scope.redirectPageURL = function(pageName){
        debugger;
        var link=document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href="#/"+pageName;
        link.click();
    }
*/

$scope.redirectPageURL = function(pageName) {
    debugger;
    var link = document.createElement("a");

    let baseUrl = link.baseURI;
    // Remove hash part ( #/something )
    if (baseUrl.includes('#/')) {
        baseUrl = baseUrl.split('#/')[0];
    }
    if (pageName === 'Home') {
        // Get id and campaign from current URL dynamically
        let urlParams = new URLSearchParams(window.location.search);
        let id = urlParams.get("id") || "";
        let campaign ='PECFAR';
        // Build final HOME URL format dynamically
        let finalUrl = baseUrl;
        if (campaign) {
         //   finalUrl += "&campaign=" + campaign;
        }
       // finalUrl += "#/Home";
        finalUrl;
        link.href = finalUrl;
        link.click();
 
    } else {
        // For other pages → keep same base + hash routing
        link.href = baseUrl + "#/" + pageName;
        link.click();
    }
};
});