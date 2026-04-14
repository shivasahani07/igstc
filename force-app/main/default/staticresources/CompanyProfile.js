angular.module('cp_app').controller('CompanyProfileCtrl', function($scope,$rootScope) {
    debugger;
    $scope.siteURL = siteURL;
    $scope.getApplicantDetails = function(){
        ApplicantPortal_Contoller.getCompanyApplicantDetails($rootScope.userId, function(result, event){
            if(event.status) {
                debugger;
                $scope.applicantDetails = result;
                $scope.$apply();
            }
        },
                                                             {escape: true}
                                                            )
    }
    $scope.getApplicantDetails();
    
    $scope.applicantDetails = {};
    $scope.saveDetails = function(){
        debugger;
        ApplicantPortal_Contoller.insertApplicant($scope.applicantDetails, function(result,event){
            if(event.status){
                debugger;
                Swal.fire(
                    'Success',
                    'Submitted successfully.',
                    'success'
                );
                $scope.redirectPageURL('Financial_Overview');
                $scope.applicantDetails = result;
                $scope.$apply();
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