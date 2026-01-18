angular.module('cp_app').controller('AchievementsIF_Ctrl', function($scope,$rootScope) {
    $scope.siteURL = siteURL;  
    $scope.achievementDetails = {};
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
    
    $scope.getAchievements = function(){
        debugger;
        ApplicantPortal_Contoller.getAchievements($rootScope.candidateId,$rootScope.apaId, function(result,event){
            debugger;
            if(event.status && result){
                $scope.achievementDetails = result;
                debugger;
                if(result.Awards_Honours__c != undefined || result.Awards_Honours__c != ""){
                    result.Awards_Honours__c = result.Awards_Honours__c ? result.Awards_Honours__c.replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Awards_Honours__c;
                }
                if(result.List_of_Publications__c != undefined || result.List_of_Publications__c != ""){
                    result.List_of_Publications__c = result.List_of_Publications__c ? result.List_of_Publications__c.replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.List_of_Publications__c;
                }
                if(result.List_of_Patents_filed__c != undefined || result.List_of_Patents_filed__c != ""){
                    result.List_of_Patents_filed__c = result.List_of_Patents_filed__c ? result.List_of_Patents_filed__c.replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.List_of_Patents_filed__c;
                }
                if(result.Book_Chapters__c != undefined || result.Book_Chapters__c != ""){
                    result.Book_Chapters__c = result.Book_Chapters__c ? result.Book_Chapters__c.replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Book_Chapters__c;
                }
                if(result.Any_other_achievements__c != undefined || result.Any_other_achievements__c != ""){
                    result.Any_other_achievements__c = result.Any_other_achievements__c ? result.Any_other_achievements__c.replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Any_other_achievements__c;
                }
                $scope.$apply();
            }
        },
                                                  {escape: true}
                                                 )
    }
    $scope.getAchievements();

    $scope.redirectPageURL=function(URL){
        var link=document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href='#/'+URL+'';
        link.click();
      }
      $scope.saveDetails = function(){
        debugger;
        $scope.achievementDetails.Contact__c = $rootScope.contactId;
        // $scope.achievementDetailss = {"Awards_Honours__c":$scope.achievementDetails.Awards_Honours__c,"List_of_Publications__c":$scope.achievementDetails.List_of_Publications__c,
        // "List_of_Patents_filed__c":$scope.achievementDetails.List_of_Patents_filed__c,"Any_other_achievements__c":$scope.achievementDetails.Any_other_achievements__c,"Contact__c":$rootScope.contactId};

        ApplicantPortal_Contoller.updateAchievements($scope.achievementDetails,$rootScope.apaId, function(result,event){
            if(event.status){
                debugger;
                Swal.fire(
                    'Success',
                    'Your achievement details have been saved successfully.',
                    'success'
                );
                //$scope.redirectPageURL('AttachmentsIF');//Commented By Karthik
                $scope.redirectPageURL('FellowshipDetailsIF');
                $scope.$apply();
            }
        },
       {escape: true}
        )
    }
    $scope.clickPreviousAchievements=function(){
        var link=document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        //link.href="#/ProjectDetailIF";//Commented By Karthik
         link.href="#/EmploymentDetailsIF";
        link.click();
    }
});