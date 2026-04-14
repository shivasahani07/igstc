angular.module('cp_app').controller('home_ctrl', function($scope,$rootScope,$window) {
    console.log($rootScope);
    $rootScope.activeTab = 0;
    $rootScope.userDetails;
    $scope.showIf=false;
    $scope.showWorkshop=false;
    $scope.showPecfar=false;
    $scope.show2plus2=false;
    $scope.showWiser=false;
    $scope.showSing=false;
    $scope.dealLinedate;
    $scope.currentCampaignName="INDUSTRIAL FELLOWSHIPS";
    //     var siteURL2=window.location.href
    // var sitecampaign=siteURL2.split('&campaign=')[1];
    // sitecampaign=sitecampaign.split('#/')[0];
    // $scope.CampainURL=sitecampaign;
    switch($rootScope.CampainURL.toUpperCase()){
        case 'IF':
            $scope.showIf=true;
            $scope.currentCampaignName="INDUSTRIAL FELLOWSHIPS";
            break;
        case 'PECFAR':
            $scope.showPecfar=true;
            $scope.currentCampaignName="PECFAR";
            break;
        case 'WORKSHOP':
            $scope.showWorkshop=true;
            $scope.currentCampaignName="WORKSHOP";
            break;
        case '2PLUS2':
            $scope.show2plus2=true;
            $scope.currentCampaignName="2+2 CALL";
            break;
        case 'SING':
            $scope.showSing=true;
            $scope.currentCampaignName="SING";
            break;
        case 'WISER':
            $scope.showWiser=true;
            $scope.currentCampaignName="WISER";
            break;
        default:
            $scope.showIf=true;
            break;
    }
    $scope.getFAQLinks=function(){
        var programmeNameLink="Industrial Fellowships";
        if($scope.campaingUrlText=="if"){
            programmeNameLink="Industrial Fellowships";
        }else if($scope.campaingUrlText=="2plus2"){
            programmeNameLink="2+2 Call";
        }
            else{
                programmeNameLink=$scope.campaingUrlText;
            }
        ApplicantPortal_Contoller.getFAQLinks($scope.currentCampaignName, function(result,event){
            console.log('programme links list');
            console.log(result);
            debugger
            if(event.status && result!=undefined){
                $scope.LinkBasicGuidelines=result.Basic_Guidelines__c;
                $scope.LinkCallText=result.Call_Text__c;
                $scope.LinkFAQs=result.FAQs__c;
                $scope.$apply();
            }
        });
    }
    $scope.getCampaignTheme=function(){
        ApplicantPortal_Contoller.fetchCampaignsPrograms(function(result, event){
            debugger;
            if(event.status && result && result.length){
                debugger;
                console.log('campaign::=>');
                console.log(result);
                for(var i=0;i<result.length; i++) {
                    if(result[i].Name.toUpperCase()==$scope.currentCampaignName){
                        $rootScope.tagCampaignId=result[i].Id;
                        $rootScope.campaignEndDate=new Date(result[i].EndDate);
                        $scope.Endyear=$rootScope.campaignEndDate.getUTCFullYear();
                        $rootScope.campaignEndDate=moment($rootScope.campaignEndDate).format('Do MMMM YYYY');
                        $scope.dealLinedate=$rootScope.campaignEndDate;
                        
                        $scope.$apply();
                    }
                };
                
            }
        },
                                                         {escape: true}
                                                        );
    }
    $scope.getCampaignTheme();
    $scope.getFAQLinks();
    $scope.redirectPageURL=function(URL){
        // swal({
        //     title: "Are you sure?",
        //     text: "Once submitted, you will not be able to update proposal!",
        //     icon: "warning",
        //     buttons: true,
        //     dangerMode: true,
        //   })
        //   .then((willDelete) => {
        //     close();
        //   });
        
        
        if(emailVerified == "false" && $scope.currentCampaignName == "WISER"){
            // swal("Email Verification", "Please first verify your email, we have sent a verification link on your registered email. After verification you can submit your proposal. In case you do not receive an email, please check your 'SPAM' or 'JUNK' folder. If you still fail to find the email, please try reaching us at wiser@igstc.org");
            // return;
            swal({
                title: "Email Verification",
                content: (() => {
                    let div = document.createElement("div");
                    div.innerHTML = `Please first verify your email, we have sent a verification link on your registered email. 
                    After verification, you can submit your proposal. In case you do not receive an email, please check your 
                    'SPAM' or 'JUNK' folder.<b> In case you face an error or lag in the portal, please try clearing your browser 
                    cache by pressing Ctrl+Shift+R to refresh the page.</b> If you still fail to verify your email, 
                    please try reaching us at wiser@igstc.org`;
                    return div;
                })(),
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                history.back();
                // $scope.closeWin();
            });
            }else if(emailVerified == "false" && $scope.currentCampaignName == "INDUSTRIAL FELLOWSHIPS"){
                // swal("Email Verification", "Please first verify your email, we have sent a verification link on your registered email. After verification you can submit your proposal. In case you do not receive an email, please check your 'SPAM' or 'JUNK' folder. If you still fail to find the email, please try reaching us at industrialfellowship@igstc.org");
                // return;
                swal({
                title: "Email Verification",
                text: "Please first verify your email, we have sent a verification link on your registered email. After verification you can submit your proposal. In case you do not receive an email, please check your 'SPAM' or 'JUNK' folder. If you still fail to find the email, please try reaching us at industrial.fellowship@igstc.org",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                history.back();
            });
            }else if(emailVerified == "false" && $scope.currentCampaignName == "PECFAR"){
                // swal("Email Verification", "Please first verify your email, we have sent a verification link on your registered email. After verification you can submit your proposal. In case you do not receive an email, please check your 'SPAM' or 'JUNK' folder. If you still fail to find the email, please try reaching us at pecfar@igstc.org");
                // return;
                swal({
                title: "Email Verification",
                text: "Please first verify your email, we have sent a verification link on your registered email. After verification you can submit your proposal. In case you do not receive an email, please check your 'SPAM' or 'JUNK' folder. If you still fail to find the email, please try reaching us at pecfar@igstc.org",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                history.back();
            });
            }else if(emailVerified == "false" && $scope.currentCampaignName == "WORKSHOP"){
                // swal("Email Verification", "Please first verify your email, we have sent a verification link on your registered email. After verification you can submit your proposal. In case you do not receive an email, please check your 'SPAM' or 'JUNK' folder. If you still fail to find the email, please try reaching us at workshop@igstc.org");
                // return;
                swal({
                title: "Email Verification",
                text: "Please first verify your email, we have sent a verification link on your registered email. After verification you can submit your proposal. In case you do not receive an email, please check your 'SPAM' or 'JUNK' folder. If you still fail to find the email, please try reaching us at info.igstc@igstc.org",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                history.back();
            });
            }else if(emailVerified == "false" && $scope.currentCampaignName == "2+2 CALL"){
                // swal("Email Verification", "Please first verify your email, we have sent a verification link on your registered email. After verification you can submit your proposal. In case you do not receive an email, please check your 'SPAM' or 'JUNK' folder. If you still fail to find the email, please try reaching us at lalitha.pv@igstc.org");
                // return;
                swal({
                title: "Email Verification",
                content: (() => {
                    let div = document.createElement("div");
                    div.innerHTML = `Please first verify your email, we have sent a verification link on your registered email. After verification you can submit your proposal.<b> In case you do not receive an email, please check your 'SPAM' or 'JUNK' folder. In case you face an error or lag in the portal, please try clearing your browser cache by pressing Ctrl+Shift+R to refresh the page.</b> If you still fail to verify your email, please try reaching us at info.igstc@igstc.org`;
                    return div;
                })(),
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                history.back();
            });
            }else if(emailVerified == "false" && $scope.currentCampaignName == "SING"){
                // swal("Email Verification", "Please first verify your email, we have sent a verification link on your registered email. After verification you can submit your proposal. In case you do not receive an email, please check your 'SPAM' or 'JUNK' folder. If you still fail to find the email, please try reaching us at sing@igstc.org");
                // return;
                swal({
                title: "Email Verification",
                text: "Please first verify your email, we have sent a verification link on your registered email. After verification you can submit your proposal. In case you do not receive an email, please check your 'SPAM' or 'JUNK' folder. If you still fail to find the email, please try reaching us at sing@igstc.org",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                history.back();
            });
            }
                else{
                var link=document.createElement("a");
                link.id = 'someLink'; //give it an ID!
                link.href='#/'+URL+'';
                link.click();
            }
            }
                $scope.closeWin=function(){
                $window.close();
                //window.close();
            }
            });