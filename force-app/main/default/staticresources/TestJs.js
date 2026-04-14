angular.module('cp_app').controller('test_ctrl', function($scope,$rootScope) {
    debugger;
   
  $scope.fetchCampaign = function(){
    Test.fetchCampaignsPrograms(function(result, event){
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