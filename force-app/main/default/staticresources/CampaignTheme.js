angular.module('cp_app').controller('campaignTheme_ctrl', function($scope,$rootScope) {
    debugger;
    console.log($rootScope);
    $rootScope.activeTab = 0;
    $rootScope.userDetails;
    $scope.fetchCampaignTheme = function(){
         ApplicantPortal_Contoller.fetchCampaignThemes(function(result, event){
            if(event.status){
                debugger;
               $scope.campaignThemeList = result;
              $scope.$apply();
            }
        },
         {escape: true}
       )
    }
    $scope.fetchCampaignTheme();
});