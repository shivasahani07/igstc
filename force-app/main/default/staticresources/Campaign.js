angular.module('cp_app').controller('campaign_ctrl', function($scope,$rootScope) {
    debugger;
    console.log($rootScope);
    $rootScope.activeTab = 0;
    $rootScope.userDetails;
    $scope.myVar = 'allCampaigns';
    
    $scope.fetchCampaign = function(){
         ApplicantPortal_Contoller.fetchCampaignsPrograms(function(result, event){
            debugger;
            if(event.status && result && result.length){
                debugger;

                $scope.campaignList = result;
                $scope.selectedCampaign = result;
                debugger;
                $scope.$apply();
                angular.forEach(result, function(rec) {
                    if(rec.Campaign_Guidlines__r) {
                        angular.forEach(rec.Campaign_Guidlines__r, function(camp) {
                            camp.Description__c = camp.Description__c ? camp.Description__c.replace(/&lt;/g, '<').replace(/&gt;/g, '>') : camp.Description__c;
                            camp.Description__c = camp.Description__c ? camp.Description__c.replace(/&amp;/g, '&') : camp.Description__c;
                        });
                    }
                });
            }
        },
         {escape: true}
       )
    }
    $scope.fetchCampaign();
    
    $scope.detailPage = function(campaign){
        debugger;
        $scope.myVar = 'selectedcam';
        $rootScope.tagCampaignId = campaign.Id;
        $scope.selectedCampaign = campaign;
    }
    $scope.applyForProgram = function(){
        debugger;
        if(candidateId == "" || candidateId == undefined){
            var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard';   
            window.location.replace(window.location.origin +sitePrefix+'/RegistrationForm');
            
        }
        if(emailVerified == "false"){
            swal("Email Verification", "Please first verify your email, we have sent a verification link on your registered email. After verification you can submit your proposal.");
            return;
        }else{
            var link=document.createElement("a");
            link.id = 'someLink'; //give it an ID!
            link.href="#/"+$scope.selectedCampaign.RedirectPage__c;
            link.click();

        }
            // var link=document.createElement("a");
            // link.id = 'someLink'; //give it an ID!
            // link.href="#/"+$scope.selectedCampaign.RedirectPage__c;
            // //link.href="#/Dashboard_IF";
            // link.click();
    }
    
    $scope.ShowBasicGuidelines = function(campaign){
        debugger;
        $scope.myVar = 'basicGuidelines';
        $scope.selectedCampaign = campaign;
    }
    
    $scope.ShowBasicGuidelinesFAQ = function(){
        debugger;
        $scope.myVar = 'basicGuidelines';
    }
    
    $scope.redirectPageURL = function(){
        debugger;
        $scope.myVar = 'allCampaigns';
        $rootScope.tagCampaignId = campaign.Id;
    }

    $scope.redirectPageURLSelectedCam = function(){
        debugger;
        $scope.myVar = 'selectedcam';
        $rootScope.tagCampaignId = campaign.Id;
    }
    
    $scope.downloadDetails = function(docId){
        debugger;
        let anchorTagA =  document.createElement('a');
        anchorTagA.href = 'https://dev-igstc.cs114.force.com/ApplicantDashboard/servlet/servlet.FileDownload?file='+docId;
        anchorTagA.download = 'downloadPdf';
        anchorTagA.click();
        
    }
});