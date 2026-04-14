angular.module('cp_app').controller('bankDetailsWiser_ctrl', function($scope,$rootScope) {
   $scope.bankDetails;
   $scope.getBankDetails = function(){
    debugger;
    IndustrialFellowshipController.getBankDetails($rootScope.projectId, function (result, event) {
        //  alert("Method Called")
         if (event.status) {
            if(result != null){
                $scope.bankDetails = result;
            }
         }
         $scope.$apply();
   })
}
   $scope.getBankDetails();

   $scope.submitBankDetails = function(){
    IndustrialFellowshipController.submitWiserBankDetails($scope.bankDetails, function (result, event) {
        //  alert("Method Called")
         if(event.status) {
            $scope.redirectPageURL('AttachmentsInWiser');
         }
         $scope.$apply();
   })
   }
   $scope.redirectPageURL = function(pageName){
    debugger;
    var link=document.createElement("a");
    link.id = 'someLink'; //give it an ID!
    link.href="#/"+pageName;
    link.click();
}
});