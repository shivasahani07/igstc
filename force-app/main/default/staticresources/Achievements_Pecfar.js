angular.module('cp_app').controller('achievements_ctrl', function($scope,$rootScope) {
   debugger;
   
   $scope.siteURL = siteURL;  
    $scope.achievementDetails = {};
    
     // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }
    if (localStorage.getItem('apaId')) {
        $rootScope.apaId = localStorage.getItem('apaId');
        console.log('Loaded proposalId from localStorage:', $rootScope.apaId);
    }

    $scope.getAchievements = function(){
        debugger;
        ApplicantPortal_Contoller.getAchievements($rootScope.candidateId,$rootScope.apaId, function(result,event){
            debugger;
            if(event.status && result){
                $scope.achievementDetails = result;
                debugger;
                if(result.Awards_Honours__c != undefined || result.Awards_Honours__c != ""){
                    result.Awards_Honours__c = result.Awards_Honours__c ? result.Awards_Honours__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Awards_Honours__c;
                }
                if(result.List_of_Publications__c != undefined || result.List_of_Publications__c != ""){
                    result.List_of_Publications__c = result.List_of_Publications__c ? result.List_of_Publications__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.List_of_Publications__c;
                }
                if(result.List_of_Patents_filed__c != undefined || result.List_of_Patents_filed__c != ""){
                    result.List_of_Patents_filed__c = result.List_of_Patents_filed__c ? result.List_of_Patents_filed__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.List_of_Patents_filed__c;
                }
                if(result.Any_other_achievements__c != undefined || result.Any_other_achievements__c != ""){
                    result.Any_other_achievements__c = result.Any_other_achievements__c ? result.Any_other_achievements__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Any_other_achievements__c;
                }
                $scope.$apply();
            }
        },
                                                  {escape: true}
                                                 )
    }
    $scope.getAchievements();

    $scope.saveDetails = function(){
        debugger;
        $scope.achievementDetails.Contact__c = $rootScope.contactId;
        // $scope.achievementDetailss = {"Awards_Honours__c":$scope.achievementDetails.Awards_Honours__c,"List_of_Publications__c":$scope.achievementDetails.List_of_Publications__c,
        // "List_of_Patents_filed__c":$scope.achievementDetails.List_of_Patents_filed__c,"Any_other_achievements__c":$scope.achievementDetails.Any_other_achievements__c,"Contact__c":$rootScope.contactId};

        ApplicantPortal_Contoller.updateAchievements($scope.achievementDetails,$rootScope.apaId, function(result,event){
            if(event.status){
                debugger;
                swal({
                    title: "Achievement Details",
                    text: 'Your Achievement details have been successfully saved.',
                    icon: "success",
                    button: "ok!",
                  }).then((value) => {
                    $scope.redirectPageURL('Fellowship_Details');
                      });
                
                $scope.$apply();
                
            }
            else
              {
                swal({
                  title: "Achievement Details",
                  text: "Exception!",
                  icon: "error",
                  button: "ok!",
                });
              }
        },
       {escape: true}
        )
    }
                     
    $scope.redirectPageURL = function(pageName){
        debugger;
        var link=document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href="#/"+pageName;
        link.click();
    }

});