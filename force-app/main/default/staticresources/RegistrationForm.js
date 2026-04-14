var app = angular.module('myApp',[]);
        app.controller('myCtrl', function($scope){
            debugger;
            $scope.isRegistration = isRegistration;
            $scope.showSpinner = false;
            $scope.contactDetails = {};
            $scope.registrationPage = false;
            $scope.contactDetails.FirstName = first_name;
            $scope.contactDetails.Email = gemail;
            $scope.userName = '';
            $scope.userPassword = '';

            if(isRegistration == "true"){
                $scope.registrationPage = true;
            }else{
                $scope.registrationPage = false;
            }
            
            
            $scope.saveContact = function(){
                debugger;
                $scope.showSpinner = true;
                Proposal_Controller.insertContact($scope.contactDetails,function (result, event) {
                    if(event.status && result != Null) {
                        debugger;
                        Swal.fire(
                            'Well Done',
                            'Registration Form Submitted Successfully!',
                            'Success'
                        );
                        $scope.apply();
                    }
                    $scope.showSpinner = false;
                },
                    {escape: false}
               );
            }
                
                $scope.showRegForm = function(){
                    $scope.registrationPage = true;
                }
                
                /*$scope.loginUser = function () {
                    $scope.userName;
                    $scope.userPassword;
                    $scope.showSpinner = true;
                    Proposal_Controller.loginUser($scope.userName, $scope.userPassword, function (result, event) {
                        if (event.status && result != null) {
                            $scope.Profile = result;
                            $scope.hashcodeId = $scope.Profile.Login_Hash_Code__c;
                            $scope.userLoggedIn = true;
                            Swal.fire(
                                '',
                                'LoggedIn Successfully!',
                                'success'
                            )
                            $scope.$apply();
                            debugger;
                            if(result.Candidate_Status__c == "Document Upload"){
                                window.location.replace(siteUrl+"CP_DocumentUpload?id="+$scope.Profile.Login_Hash_Code__c);
                                return;
                            }
                            window.location.replace(siteUrl+"CandidateDashboard?id=" + $scope.Profile.Login_Hash_Code__c+'#/CP_HomePage');
                        }
                        else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Please enter the correct Username and Password!'
                            })
                        }
                    }, { escape: false })
                    $scope.showSpinner = false;
                    $scope.$apply();
                }*/
                
        });