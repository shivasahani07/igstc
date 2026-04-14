angular.module('cp_app').controller('Prgctrl', function($scope,$rootScope) {
    debugger;
    console.log($rootScope);
    $rootScope.activeTab = 0;
    $rootScope.userDetails;
    $scope.fetchCampaign = function(){
        ApplicantPortal_Contoller.fetchCampaignsPrograms(function(result, event){
            if(event.status){
                debugger;
                $scope.campaignList = result;
                $scope.$apply();
            }
        },
        {escape: true}
     )
    }
    $scope.fetchCampaign();
});