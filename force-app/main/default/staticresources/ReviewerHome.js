angular.module('rp_app').controller('ReviewerHome_Ctrl', function($scope,$rootScope) {
    debugger
    console.log('reviewer home page');
    $scope.reviewerName=$rootScope.reviewerName;
    $scope.reviewerEmail=$rootScope.reviewerEmail;
    console.log($scope.reviewerName);
    console.log($scope.reviewerEmail);
    $showAvtar=false;
    if($scope.reviewerName!=undefined && $scope.reviewerName!=''){
    $showAvtar=true;
    }
});