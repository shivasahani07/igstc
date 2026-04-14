angular.module('cp_app').controller('intimation_ctrl', function($scope,$rootScope) {
    debugger;
    
    $scope.siteURL = siteURL; 
    $rootScope.contactId;
        $scope.getIntimmationLetter = function(){
            ApplicantPortal_Contoller.getIntimationLetter($rootScope.contactId,function(result,event){
                debugger;
                if(event.status){
                    $scope.intimationLetter = result;
                    $scope.$apply();
                }else{
                }
            });
        }
         $scope.getIntimmationLetter();
    	 		$scope.saveAcceptance = function(){	
         		debugger;
                    ApplicantPortal_Contoller.saveAccepted($scope.intimationLetter,function(result,event){
                        debugger;
                        if(event.status){
                            Swal.fire(
                                'Success',
                                'Your intimation letter for proposal has been accepted.',
                                'success'
                            );
                            $scope.$apply();
                        }
                    })
          
          		}
    });