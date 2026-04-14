angular.module('cp_app').controller('privacy_ctrl', function($scope,$rootScope){

    debugger;
    $scope.siteURL = siteURL;
    $scope.pendings;
    $scope.getProjectdetils = function(){
        debugger;
        ApplicantPortal_Contoller.getProjectdetils($rootScope.userId, function(result,event){
            if(event.status){
                $scope.proposalDetails = result;
                $scope.$apply();
            }
        },
                                                  {escape: true}
                                                 )
    }
    $scope.getProposalPendings=function(){
        ApplicantPortal_Contoller.getProposalPendings($rootScope.projectId, function(result,event){
            console.log('pendings');
            console.log(result);
            if(event.status){
                debugger;
                $scope.pendings=result;
            }
        },
       {escape: true}
        )
    }
    $scope.getProjectdetils();
    $scope.getProposalPendings();
    $scope.saveDetails = function(){
        debugger;
        //$scope.proposalDetails.Research_Approach_Objectives__c = $scope.proposalDetails.Research_Approach_Objectives__c.replace(/<\/?[^>]+(>|$)/g, "");
        ApplicantPortal_Contoller.insertPrivacyPolicy($scope.proposalDetails, function(result,event){
            if(event.status){
                debugger;
                Swal.fire(
                    'Success',
                    'Your proposal has been saved as Draft.',
                    'success'
                );
                $scope.redirectPageURL('Home');
                $scope.proposalDetails = result;
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

    $scope.saveFinal = function(){
        debugger;
        if($scope.proposalDetails.Privacy_Policy_Accepted__c == false){
            swal("Privacy Policy Acceptance", "Please Accept the Privacy Policy to Submit your First Stage Proposal.");
                    return;
        }
        var arryAccId=[];
        for(var i=0;i<$scope.pendings.accountList.length;i++){
            arryAccId.push({Id:$scope.pendings.accountList[i].Id,status:false});
        }
        for(var i=0;i<arryAccId.length;i++){
            var accountId=arryAccId[i].Id;
            for(var j=0;j<$scope.pendings.workPackagesList.length;j++){
                for(var k=0;k<$scope.pendings.workPackagesList[j].Account_Mapping__r.length;k++){
                    if($scope.pendings.workPackagesList[j].Account_Mapping__r[k].Account__c==accountId){
                        arryAccId[i].status=true;
                    }
                }
            }
        }
        for(var i=0;i<arryAccId.length;i++){
            if(!arryAccId[i].status){
                swal('info','Before submit, please update work package detail for all partners.','info');
                return;  
            }
        }
        for(var i=0;i<$scope.pendings.accountList.length;i++){
            if($scope.pendings.accountList[i].Financial_Contribution__r==undefined){
                swal('info','Before submit, please update financial contribution for all partners.','info');
                return;
            }else{
                if($scope.pendings.accountList[i].Financial_Contribution__r[0].Asked_From_IGSTC__c==undefined || $scope.pendings.accountList[i].Financial_Contribution__r[0].Asked_From_IGSTC__c=='' || $scope.pendings.accountList[i].Financial_Contribution__r[0].Asked_From_IGSTC__c==' '){
                    swal('info','Before submit, please update financial contribution for all partners.','info');
                    return;
                }
                else if($scope.pendings.accountList[i].Financial_Contribution__r[0].Own_Contribution__c==undefined || $scope.pendings.accountList[i].Financial_Contribution__r[0].Own_Contribution__c=='' || $scope.pendings.accountList[i].Financial_Contribution__r[0].Own_Contribution__c==' '){
                    swal('info','Before submit, please update financial contribution for all partners.','info');
                    return;
                }
                else if($scope.pendings.accountList[i].Financial_Contribution__r[0].IGSTC_Contribution__c==undefined || $scope.pendings.accountList[i].Financial_Contribution__r[0].IGSTC_Contribution__c=='' || $scope.pendings.accountList[i].Financial_Contribution__r[0].IGSTC_Contribution__c==' '){
                    swal('info','Before submit, please update financial contribution for all partners.','info');
                    return;
                }
            }
        }
        
        swal({
            title: "Are you sure?",
            text: "Once submitted, No partner would be able to edit any information!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {                    
              ApplicantPortal_Contoller.finalSubmit($scope.proposalDetails, function(result,event){
                if(event.status){
                    debugger;
                    swal(
                        'Success',
                        'Your proposal has been submitted successfully.',
                        'success'
                    );
                    $scope.redirectPageURL('Home');
                    $scope.proposalDetails = result;
                    $scope.$apply();
                }
            },
           {escape: true}
            );
            }                  
            });
          }
       
    
});