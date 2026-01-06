angular.module('cp_app').controller('NewWiserPairingPageCtrl', function ($scope,$sce,$rootScope) {
    debugger;
    $rootScope.userHashId;
    $rootScope.campaignId;
    $rootScope.userId;
    $rootScope.candidateId;
    $rootScope.contactId;
    $scope.objKeyword=[];
    $scope.doc={};
    $scope.config.height=500;
    $scope.objRtf=[{charCount:0,maxCharLimit:600,errorStatus:false}];
    $scope.objRtf.push({charCount:0,maxCharLimit:4500,errorStatus:false});
    $scope.proposalStage = false;
    scope.apaId='';
   
 
    
 $scope.getDataFromLocalStorage = function(){
        debugger;
        if(localStorage.getItem('candidateId')){
            $rootScope.candidateId = localStorage.getItem('candidateId');
        }
        if(localStorage.getItem('apaId')){
            $rootScope.apaId = localStorage.getItem('apaId');
            $scope.apaId = $rootScope.apaId;
        }
        if(localStorage.getItem('proposalId')){
            $rootScope.proposalId = localStorage.getItem('proposalId');
            $scope.proposalId = $rootScope.proposalId;
        }
        if(localStorage.getItem('contactId')){
            $rootScope.contactId = localStorage.getItem('contactId');
            $scope.contactId = $rootScope.contactId;
        }
    }

    $scope.getDataFromLocalStorage();   

    $scope.getProposalStage = function(){
        debugger;
        if($rootScope.apaId && $rootScope.proposalId){
            ApplicantPortal_Contoller.getProposalStageUsingProposalId($rootScope.proposalId, $rootScope.apaId, function(result, event){
                debugger;
                if(event.status && result){
                    $scope.proposalStage = (result.proposalStage != 'Draft' && result.proposalStage != null && result.proposalStage != undefined);
                    $rootScope.proposalStage = $scope.proposalStage;
                    $scope.$apply();
                }
            }, { escape: true });
        }
    }

    $scope.getProposalStage();
    
    
})