angular.module('cp_app').controller('participant_ctrl', function($scope,$rootScope){
    debugger;
    $scope.siteURL = siteURL;
    $rootScope.projectId;
    $scope.participantType = participantType;
    $scope.participatingWorkshop = participatingWorkshop;
    $scope.disableAddButton=false;
    $scope.indianList = [];
    $scope.germanList = [];
    $scope.IndianParticipant = "Indian Participant";
    $scope.GermanParticipant = "German Participant";

    $scope.getParticipantDetails = function () {
        debugger;
        ApplicantPortal_Contoller.getParticipantDetails($rootScope.userId, function (result, event) {
            if (event.status) {
                debugger;
                if(result == null || result.length == 0){
                   $scope.indianList.push({
                    "Name": "",
                    "Phone__c": "",
                    "Proposals__c":$rootScope.projectId,
                    "Participant_Type__c":'Indian Participant'
                   });
                   
                   $scope.germanList.push({
                    "Name": "",
                    "Phone__c": "",
                    "Proposals__c":$rootScope.projectId,
                    "Participant_Type__c":'German Participant'
                   });
                }else{
                    for(var i=0;i<result.length;i++){
                        if(result[i].Participant_Type__c == 'Indian Participant'){
                            $scope.indianList.push(result[i]);
                        }else if(result[i].Participant_Type__c == 'German Participant'){
                            $scope.germanList.push(result[i]);
                        }
                    }

                    for(var i=0;i<$scope.indianList.length;i++){
                        if($scope.indianList[i].Name != undefined || $scope.indianList[i].Name != ""){
                            $scope.indianList[i].Name = $scope.indianList[i].Name ? $scope.indianList[i].Name.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.indianList[i].Name;
                        }
                        if($scope.indianList[i].Affiliation__c != undefined || $scope.indianList[i].Affiliation__c != ""){
                            $scope.indianList[i].Affiliation__c = $scope.indianList[i].Affiliation__c ? $scope.indianList[i].Affiliation__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.indianList[i].Affiliation__c;
                        }
                        if($scope.indianList[i].Organisation_Institute__c != undefined || $scope.indianList[i].Organisation_Institute__c != ""){
                            $scope.indianList[i].Organisation_Institute__c = $scope.indianList[i].Organisation_Institute__c ? $scope.indianList[i].Organisation_Institute__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.indianList[i].Organisation_Institute__c;
                        }
                    }

                    for(var i=0;i<$scope.germanList.length;i++){
                        if($scope.germanList[i].Name != undefined || $scope.germanList[i].Name != ""){
                            $scope.germanList[i].Name = $scope.germanList[i].Name ? $scope.germanList[i].Name.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.germanList[i].Name;
                        }
                        if($scope.germanList[i].Affiliation__c != undefined || $scope.germanList[i].Affiliation__c != ""){
                            $scope.germanList[i].Affiliation__c = $scope.germanList[i].Affiliation__c ? $scope.germanList[i].Affiliation__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.germanList[i].Affiliation__c;
                        }
                        if($scope.germanList[i].Organisation_Institute__c != undefined || $scope.germanList[i].Organisation_Institute__c != ""){
                            $scope.germanList[i].Organisation_Institute__c = $scope.germanList[i].Organisation_Institute__c ? $scope.germanList[i].Organisation_Institute__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.germanList[i].Organisation_Institute__c;
                        }
                    }
                }        
                $scope.$apply();                    
                       
            }
        }, {
            escape: true
        })
    }
    $scope.getParticipantDetails();

    $scope.addParticipant=function(countrytype){
        debugger;
        if($scope.indianList.length +$scope.germanList.length  >29){
            swal("Max Account Limit", "You cannot add more than 30 partcipants.")
        }
        else{

           // for(var i=0;i<$scope.allParticipantDetails.length;i++){
                if(countrytype== 'india'){
                    $scope.indianList.push({
                        "Name": "",
                        "Affiliation__c": " ",
                        "Email__c":"",
                        "Phone__c":"",
                        "Participant_Type__c":'Indian Participant',
                        "Proposals__c":$rootScope.projectId 
                    });
                }else if(countrytype== 'german'){
                    $scope.germanList.push({
                        "Name": "",
                        "Affiliation__c": " ",
                        "Email__c":"",
                        "Phone__c":"",
                        "Participant_Type__c":'German Participant',
                        "Proposals__c":$rootScope.projectId 
                    });
                }
         //   }
        }
        if($scope.allParticipantDetails.length>30){
            $scope.disableAddButton=true;
        }
    }

    $scope.submitDetails = function(saveType){
        if(saveType == 'partial'){
           debugger;
           $scope.allParticipantDetails = [];
           $scope.allParticipantDetails = $scope.indianList.concat($scope.germanList);

           for(var i=0;i<$scope.indianList.length;i++){
            if($scope.indianList[i].Name == undefined || $scope.indianList[i].Name == ""){
                swal("Participant Details", "Please Enter Participant Name.");
                $("#name"+i+"").addClass('border-theme');
                return;
            }
           }

            for(var i=0;i<$scope.germanList.length;i++){
                if($scope.germanList[i].Name == undefined || $scope.germanList[i].Name == ""){
                    swal("Participant Details", "Please Enter Participant Name.");
                    $("#name1"+i+"").addClass('border-theme');
                    return;
                }
            }
           
            for(let i=0; i<$scope.allParticipantDetails.length; i++){
                delete ($scope.allParticipantDetails[i]['$$hashKey']);
            }

            ApplicantPortal_Contoller.insertParticipants($scope.allParticipantDetails, function(result, event){
                if(event.status){
                 debugger;
                 Swal.fire(
                     'Success',
                     'Participant details have been partially saved.',
                     'success'
                 );
                 $scope.$apply();  
             }
            },
            {escape:true}
            )
			window.location.reload();
        }else{
            debugger;
            $scope.allParticipantDetails = [];
            // for(var i=0;i<$scope.indianList.length;i++){
            //     $scope.germanList.push($scope.indianList[i]);
            // }
            // $scope.allParticipantDetails = $scope.germanList;
            // $("#txtOrg"+i+"").addClass('border-theme');
            $scope.allParticipantDetails = $scope.indianList.concat($scope.germanList);
            debugger;
            
            for(var i=0;i<$scope.indianList.length;i++){
                if($scope.indianList[i].Participant_Type__c == undefined || $scope.indianList[i].Participant_Type__c == ""){
                    swal("Participant Details", "Please Select Participant type.");
                    return;
                }
                if($scope.indianList[i].Name == undefined || $scope.indianList[i].Name == ""){
                    swal("Participant Details", "Please Enter Participant Name.");
                    $("#name"+i+"").addClass('border-theme');
                    return;
                }
                if($scope.indianList[i].Affiliation__c == undefined || $scope.indianList[i].Affiliation__c == ""){
                    swal("Participant Details", "Please Enter Participant's Position/Designation.");
                    $("#affiliation"+i+"").addClass('border-theme');
                    return;
                }
                if($scope.indianList[i].Organisation_Institute__c == undefined || $scope.indianList[i].Organisation_Institute__c == ""){
                    swal("Participant Details", "Please Enter Participant's Organisation.");
                    $("#org"+i+"").addClass('border-theme');
                    return;
                }
                if($scope.indianList[i].Email__c == undefined || $scope.indianList[i].Email__c == ""){
                    swal("Participant Details", "Please Enter Email of Participant.");
                    $("#email"+i+"").addClass('border-theme');
                    return;
                }
                if($scope.valid($scope.indianList[i].Email__c)){
                    swal(
                        'info',
                        'Check Your Registered Email!',
                        'info'
                    );
                    $("#email"+i+"").addClass('border-theme');
                    return;
                }
                // if($scope.indianList[i].Phone__c == undefined || $scope.indianList[i].Phone__c == ""){
                //     swal("Participant Details", "Please Enter Phone Number.");
                //     $("#phone"+i+"").addClass('border-theme');
                //     return;
                // }
                if($scope.indianList[i].Whether_Participant_is_presenting__c == undefined || $scope.indianList[i].Whether_Participant_is_presenting__c == ""){
                    swal("Participant Details", "Please select Whether the participant is a speaker or not.");
                    $("#nature"+i+"").addClass('border-theme');
                    return;
                }
            }
    
            for(var i=0;i<$scope.germanList.length;i++){
                if($scope.germanList[i].Participant_Type__c == undefined || $scope.germanList[i].Participant_Type__c == ""){
                    swal("Participant Details", "Please Select Participant type.");
                    return;
                }
                if($scope.germanList[i].Name == undefined || $scope.germanList[i].Name == ""){
                    swal("Participant Details", "Please Enter Participant Name.");
                    $("#name1"+i+"").addClass('border-theme');
                    return;
                }
                if($scope.germanList[i].Affiliation__c == undefined || $scope.germanList[i].Affiliation__c == ""){
                    swal("Participant Details", "Please Enter Participant's Position/Designation.");
                    $("#affiliation2"+i+"").addClass('border-theme');
                    return;
                }
                if($scope.germanList[i].Organisation_Institute__c == undefined || $scope.germanList[i].Organisation_Institute__c == ""){
                    swal("Participant Details", "Please Enter Participant's Organisation.");
                    $("#org2"+i+"").addClass('border-theme');
                    return;
                }
                if($scope.germanList[i].Email__c == undefined || $scope.germanList[i].Email__c == ""){
                    swal("Participant Details", "Please Enter Email of Participant.");
                    $("#email2"+i+"").addClass('border-theme');
                    return;
                }
                if($scope.valid($scope.germanList[i].Email__c)){
                    swal(
                        'info',
                        'Check Your Registered Email!',
                        'info'
                    );
                    $("#email2"+i+"").addClass('border-theme');
                    return;
                }
                // if($scope.germanList[i].Phone__c == undefined || $scope.germanList[i].Phone__c == ""){
                //     swal("Participant Details", "Please Enter Phone Number.");
                //     $("#phone2"+i+"").addClass('border-theme');
                //     return;
                // }
                if($scope.germanList[i].Whether_Participant_is_presenting__c == undefined || $scope.germanList[i].Whether_Participant_is_presenting__c == ""){
                    swal("Participant Details", "Please select Whether the participant is a speaker or not.");
                    $("#nature2"+i+"").addClass('border-theme');
                    return;
                }
            }
    
            for(let i=0; i<$scope.allParticipantDetails.length; i++){
                delete ($scope.allParticipantDetails[i]['$$hashKey']);
            }
            console.log('$scope.allParticipantDetails::'+$scope.allParticipantDetails);

            ApplicantPortal_Contoller.insertParticipants($scope.allParticipantDetails, function(result, event){
                if(event.status){
                 debugger;
                 Swal.fire(
                     'Success',
                     'Participant details have been saved successfully.',
                     'success'
                 );
                //  
                $scope.redirectPageURL('Financial_Details');
                 $scope.accList = result;
                 $scope.$apply();  
             }
            },
            {escape:true}
            )
        }
    }

    $scope.removeParticipant = function (index,type) {
        debugger;
        if ($scope.indianList.length == 1) {
            return;
        }
        if($scope.indianList[index].Id == undefined){
            $scope.indianList.splice(index, 1);
            return;
        }
        ApplicantPortal_Contoller.deleteParticipant($scope.indianList[index].Id, function (result, event) {
            if (event.status) {
                swal("Participant Details", "Participant Deleted Successfully");
                $scope.indianList.splice(index, 1);
            }
            $scope.$apply();
        });
    }

    $scope.removeParticipant2 = function (index,type) {
        debugger;
        
        if ($scope.germanList.length == 1) {
            return;
        }
        if($scope.germanList[index].Id == undefined){
            $scope.germanList.splice(index, 1);
            return;
        }
        ApplicantPortal_Contoller.deleteParticipant($scope.germanList[index].Id, function (result, event) {
            if (event.status) {
                swal("Participant Details", "Participant Deleted Successfully");
                $scope.germanList.splice(index, 1);
            }
            $scope.$apply();
        });
    }

    $scope.redirectPageURL = function(pageName){
        debugger;
        var link=document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href="#/"+pageName;
        link.click();
    }

    $scope.valid = function(value){
        if(value!=undefined){
             var x=value;
             var atpos = x.indexOf("@");
             var dotpos = x.lastIndexOf(".");
            if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
                
                return true;
            }
            return false;
         }
     }

    $scope.removeClass=function(controlid,index){
        var controlIdfor=controlid+""+index;
        $("#"+controlIdfor+"").removeClass('border-theme');
      }
});