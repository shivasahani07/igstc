angular.module('cp_app').controller('ConsortiumPartnerCtrl', function($scope,$rootScope) {
    debugger;
    $scope.siteURL = siteURL;
    $scope.contactDetails = {};
    
    $scope.saveDetails = function(){
        debugger;
        
            delete ($scope.contactDetails['Education_Details__r']);
            delete ($scope.contactDetails['Employment_Details__r']);
            delete ($scope.contactDetails['Publications_Patents__r']);
        
        ApplicantPortal_Contoller.insertPartnerInformation($scope.contactDetails, function(result,event){
            if(event.status){
                debugger;
                Swal.fire(
                    'Success',
                    'Submitted successfully.',
                    'success'
                );
                debugger;
                $scope.redirectPageURL('Curriculum_vitae');
                $scope.contactDetails = result;
                $scope.$apply();
            }
        },
          {escape: true}
       )
    }

    $scope.getDetails = function(){
        debugger;
        ApplicantPortal_Contoller.getContactDetails($rootScope.userId, function(result,event){
            if(event.status){
                debugger;
                $scope.contactDetails = result;
                $scope.$apply();
            }
        },
          {escape: true}
       )
    }
    $scope.getDetails();
    
    $scope.redirectPageURL = function(pageName){
        debugger;
        var link=document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href="#/"+pageName;
        link.click();
    }
});