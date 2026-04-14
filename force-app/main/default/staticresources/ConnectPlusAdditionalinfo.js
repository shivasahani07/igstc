angular.module('cp_app').controller('additional_ctrl',function($scope,$rootScope) {
    $rootScope.projectId;
    $scope.siteURL = siteURL;
    $rootScope.userId;
    $scope.proposedDate;
    $scope.endDate;
    $scope.proposalDetails = {};

    $scope.getConnectContact = function(){
        debugger;
        $scope.primary = false;
        ApplicantPortal_Contoller.getConnectContact($rootScope.userId, function(result,event){
            debugger;
            if(event.status && result){

                if(result.Proposals__r.Proposed_Date__c != undefined && result.Proposals__r.Proposed_Date__c != ""){
                    $scope.proposedDate = new Date(result.Proposals__r.Proposed_Date__c);
                }
                if(result.Proposals__r.Workshop_Finish_Date__c != undefined && result.Proposals__r.Workshop_Finish_Date__c != ""){
                    $scope.endDate = new Date(result.Proposals__r.Workshop_Finish_Date__c);
                }
                if(result.Proposals__r.Summary__c != undefined || result.Proposals__r.Summary__c != ""){
                    result.Proposals__r.Summary__c = result.Proposals__r.Summary__c ? result.Proposals__r.Summary__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Proposals__r.Summary__c;
                }
                $scope.contactDetails = result;
                $scope.$apply();
            }
        })
    }
    $scope.getConnectContact();

    $scope.getHostDetailsConnect = function(){
        debugger;
        $scope.primary = false;
        ApplicantPortal_Contoller.getHostDetailsConnect($rootScope.projectId, function(result,event){
            debugger;
            if(event.status && result){
                $scope.hostDetails = result;
                $scope.$apply();
            }
        })
    }
    $scope.getHostDetailsConnect();

    $scope.insertConnectadditionalPoints = function(){
        debugger;
        if($scope.contactDetails.FirstName==undefined || $scope.contactDetails.FirstName==""){
            swal('info','Please enter First Name','info');
            $("#fName").addClass('border-theme');
            return;
        }
        if($scope.contactDetails.LastName==undefined || $scope.contactDetails.LastName==""){
            swal('info','Please enter Last Name','info');
            $("#lName").addClass('border-theme');
            return;
        }
        if($scope.contactDetails.Email==undefined || $scope.contactDetails.Email==""){
            swal('info','Please enter Email','info');
            $("#email").addClass('border-theme');
            return;
        }
        if($scope.contactDetails.Department==undefined || $scope.contactDetails.Department==""){
            swal('info','Please enter Department','info');
            $("#dept").addClass('border-theme');
            return;
        }
        if($scope.contactDetails.Designation__c==undefined || $scope.contactDetails.Designation__c==""){
            swal('info','Please enter Designation','info');
            $("#designation").addClass('border-theme');
            return;
        }
        if($scope.contactDetails.Account.Name==undefined || $scope.contactDetails.Account.Name==""){
            swal('info','Please enter Institution/Industry Name','info');
            $("#inst").addClass('border-theme');
            return;
        }
        if($scope.contactDetails.Phone==undefined || $scope.contactDetails.Phone==""){
            swal('info','Please enter Phone','info');
            $("#phone").addClass('border-theme');
            return;
        }
        if($scope.contactDetails.MailingCountry==undefined || $scope.contactDetails.MailingCountry==""){
            swal('info','Please enter Country','info');
            $("#country").addClass('border-theme');
            return;
        }
        if($scope.contactDetails.MailingPostalCode==undefined || $scope.contactDetails.MailingPostalCode==""){
            swal('info','Please enter Pin Code','info');
            $("#pin").addClass('border-theme');
            return;
        }

        //HOST

        if($scope.hostDetails.Name==undefined || $scope.hostDetails.Name==""){
            swal('info','Please enter Organisation Name','info');
            $("#org").addClass('border-theme');
            return;
        }
        if($scope.hostDetails.BillingCountry==undefined || $scope.hostDetails.BillingCountry==""){
            swal('info','Please enter Country','info');
            $("#country2").addClass('border-theme');
            return;
        }
        if($scope.hostDetails.BillingPostalCode==undefined || $scope.hostDetails.BillingPostalCode==""){
            swal('info','Please enter Pin code','info');
            $("#pincode").addClass('border-theme');
            return;
        }
        if($scope.hostDetails.Name_of_Mentor__c==undefined || $scope.hostDetails.Name_of_Mentor__c==""){
            swal('info','Please enter name of Mentor','info');
            $("#mentor").addClass('border-theme');
            return;
        }
        if($scope.hostDetails.Designation_Position_of_the_Mentor__c==undefined || $scope.hostDetails.Designation_Position_of_the_Mentor__c==""){
            swal('info','Please enter Designation/Position of the Mentor','info');
            $("#designation2").addClass('border-theme');
            return;
        }
        if($scope.hostDetails.Mentor_contact_number__c==undefined || $scope.hostDetails.Mentor_contact_number__c==""){
            swal('info','Please enter Mentor contact number','info');
            $("#number").addClass('border-theme');
            return;
        }
        if($scope.hostDetails.Mentor_E_mail_Id__c==undefined || $scope.hostDetails.Mentor_E_mail_Id__c==""){
            swal('info','Please enter Mentor E-mail Id','info');
            $("#email2").addClass('border-theme');
            return;
        }

        //PROPOSAL

        if($scope.contactDetails.Proposals__r.Thematic_Area__c==undefined || $scope.contactDetails.Proposals__r.Thematic_Area__c==""){
            swal('info','Please enter Thematic Area of the Proposal','info');
            $("#Thematic").addClass('border-theme');
            return;
        }
        if($scope.contactDetails.Proposals__r.Title_Of__c==undefined || $scope.contactDetails.Proposals__r.Title_Of__c==""){
            swal('info','Please enter Title Of Proposal','info');
            $("#Title").addClass('border-theme');
            return;
        }
        if($scope.contactDetails.Proposals__r.Title_In_German__c==undefined || $scope.contactDetails.Proposals__r.Title_In_German__c==""){
            swal('info','Please enter Title des Antrages(In German)','info');
            $("#German").addClass('border-theme');
            return;
        }
        if($scope.contactDetails.Proposals__r.Acronym__c==undefined || $scope.contactDetails.Proposals__r.Acronym__c==""){
            swal('info','Please enter Acronym','info');
            $("#acronym").addClass('border-theme');
            return;
        }

        if($scope.proposedDate != undefined){
            var year = $scope.proposedDate.getUTCFullYear();
            var month = $scope.proposedDate.getUTCMonth()+1;
            var day = $scope.proposedDate.getDate();
        }else{
            var year = 0;
            var month = 0;
            var day = 0;
        }

        if($scope.endDate != undefined){
            var endyear = $scope.endDate.getUTCFullYear();
            var endmonth = $scope.endDate.getUTCMonth()+1;
            var endday = $scope.endDate.getDate();
        }else{
            var endyear = 0;
            var endmonth = 0;
            var endday = 0;
        }
        debugger;

        $scope.proposalDetails = $scope.contactDetails.Proposals__r;
        ApplicantPortal_Contoller.insertConnectadditionalPoints($scope.contactDetails,$scope.hostDetails,$scope.proposalDetails,day,month,year,endday,endmonth,endyear, function(result, event){
            if(event.status && result != null){
                debugger;   
                Swal.fire(
                    'SUCCESS',
                    'Your Basic details have been saved successfully.',
                    'success'
                );
                $scope.$apply();
            }
        },
        {escape: true}
        )
    }

    $scope.removeClass=function(controlid){
        $("#"+controlid+"").removeClass('border-theme');
    }
});