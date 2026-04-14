angular.module('Landingapp',['ngRoute']).controller('Landingcontroller',function($scope, $rootScope){
    console.log('App Initiated');
    $scope.reviwerId = 'a1V1y000000LwWhEAK';
    $scope.proposalList = [];
    $scope.getOnload = function(){
        debugger;
        
        LandingPageController.onpageload($scope.reviwerId,function (result, event){
            if (event.status && result != null) {
                debugger;
                $scope.proposalList = result;
                $scope.$apply();
            }
        })
    }
    
$scope.getOnload();  
    
    $scope.redirectTodetailsPage = function(){
        alert('Redirect page needs tobe tag');
        console.log('Inisde redirect page');
    }
                                         
})