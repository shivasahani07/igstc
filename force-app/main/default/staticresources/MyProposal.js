angular.module('cp_app').controller('myProp_ctrl', function($scope,$rootScope) {
    debugger;
    $rootScope.activeTab = 0;
    $rootScope.projectId;
    $scope.redirectPage;
    $scope.buttonText='Continue';
    $scope.propStage='Draft';
    $scope.IndianContact='';
    $scope.GermanyContact='';
    $scope.showContactNames=false;
    $scope.objContact={};
    if($rootScope.proposalStage){
        $scope.propStage='Submitted';
        $scope.buttonText='View';
    }
    $scope.fetchProjectDetails = function(){
        debugger;
        ApplicantPortal_Contoller.fetchProjectDetails(projectId, function(result, event){
            debugger;
            console.log(result);
            if(event.status & result != null){
                debugger;
                $scope.project = result.proposalWrap;
                $scope.fileURL="";
                $scope.redirectPage = result.proposalWrap.Campaign__r.RedirectPage__c;
                if($scope.project.Attachments!=undefined){
                    let baseUrl = window.location.origin;
                    $scope.fileURL=baseUrl+'/servlet/servlet.FileDownload?file='+$scope.project.Attachments[0].Id;
                }
                if(result.proposalWrap.Campaign__r.Name=="PECFAR"){
                    $scope.showContactNames-=true;
                    for(var i=0;i<result.contactWrap.length;i++){
                        if(result.contactWrap[i].MailingCountry=='India'){
                            $scope.IndianContact=result.contactWrap[i].Name;
                        }else{
                            $scope.GermanyContact=result.contactWrap[i].Name;
                        }
                    }
                }
                $scope.$apply();
            }
        },
        {escape: true}
        )
    }
    $scope.fetchProjectDetails();

    $scope.viewProposal = function(){
        debugger;
        $scope.fetchProjectDetails();
        if(emailVerified == "false"){
            swal("Email Verification", "Please first verify your email, we have sent a verification link on your registered email. After verification you can submit your proposal.");
            return;
        }else{
            var link=document.createElement("a");
            link.id = 'someLink'; //give it an ID!
            link.href="#/"+$scope.redirectPage;
            link.click();
            // $scope.redirectPageURL('ProjectDetailPage');
            $scope.$apply();
        }
    }
   
    $scope.redirectPageURL = function(pageName){
        debugger;
        var link=document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href="#/"+pageName;
        link.click();
    }
});