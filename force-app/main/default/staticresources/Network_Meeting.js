angular.module('cp_app').controller('networkmeet_ctrl', function($scope,$rootScope) {
debugger;

$scope.siteURL = siteURL;
    $rootScope.projectId;
    $scope.disable = false;
    $rootScope.secondstage;
    $scope.MeetingList = [];
    $scope.applicantDetails = [];
    $scope.accDetails = [];
    $scope.AccountList = [];
    $scope.show = false;
    $scope.defaultAccountList = [];
    const accountIdXaccount = new Map();

    $scope.getProposalAccounts = function () {
        ApplicantPortal_Contoller.getProposalAccounts($rootScope.projectId, function (result, event) {
            if (event.status) {
                $scope.AccountList = result;
                if ($scope.AccountList != undefined) {
                    for (var i = 0; i < $scope.AccountList.length; i++) {
                        accountIdXaccount.set($scope.AccountList[i].Id, $scope.AccountList[i]);
                    }

                    for (var i = 0; i < $scope.AccountList.length; i++) {
                        var option = {
                            'Id': $scope.AccountList[i].Id,
                            'Name': $scope.AccountList[i].Name,
                            'selected': false
                        };
                        $scope.defaultAccountList.push(option);
                    }
                }
            }
        });
    }

    $scope.getMeetingDetails = function () {
        ApplicantPortal_Contoller.getMeetingDetails($rootScope.userId, function (result, event) {
            debugger
            if (event.status && result) {
                debugger;
                $scope.applicantDetails = result;
                if ($scope.applicantDetails.length > 0) {
                    $scope.allAccountDetails = [];
                    for (var i = 0; i < $scope.applicantDetails.length; i++) {
                        const accountIdXselectedAcc = new Map();

                        if ($scope.applicantDetails[i].Network_Meeting_Account_Mapping__r != undefined) {
                            for (var j = 0; j < $scope.applicantDetails[i].Network_Meeting_Account_Mapping__r.length; j++) {
                                accountIdXselectedAcc.set($scope.applicantDetails[i].Network_Meeting_Account_Mapping__r[j].Account__c, $scope.applicantDetails[i].Network_Meeting_Account_Mapping__r[j]);
                            }
                            var accDetails = [];
                            for (const accountId of accountIdXaccount.keys()) {
                                if (accountIdXselectedAcc.has(accountId)) {
                                    var option = {
                                        'Id': accountIdXaccount.get(accountId).Id,
                                        'Name': accountIdXaccount.get(accountId).Name,
                                        'selected': true,
                                        'accountMappingId': accountIdXselectedAcc.get(accountId).Id
                                    };
                                } else {
                                    var option = {
                                        'Id': accountIdXaccount.get(accountId).Id,
                                        'Name': accountIdXaccount.get(accountId).Name,
                                        'selected': false
                                    };
                                }
                                accDetails.push(option);
                            }
                        } else {
                            accDetails= $scope.defaultAccountList;
                        }
                        if($scope.applicantDetails[i].Tentative_Date__c != undefined){
                            $scope.applicantDetails[i].Tentative_Date__c  = new Date($scope.applicantDetails[i].Tentative_Date__c);
                        }
                        if($scope.applicantDetails[i].Actual_Date__c != undefined){
                            $scope.applicantDetails[i].Actual_Date__c  = new Date($scope.applicantDetails[i].Actual_Date__c);
                        }
                        $scope.MeetingList.push({
                            "AccountList": accDetails,
                            "meetingAgenda": $scope.applicantDetails[i].Meeting_Agenda__c,
                            "meetingVenue": $scope.applicantDetails[i].Meeting_Venue__c,
                            "Tentative_Date__c": $scope.applicantDetails[i].Tentative_Date__c,
                            "Actual_Date__c": $scope.applicantDetails[i].Actual_Date__c,
                            Id: $scope.applicantDetails[i].Id,
                            externalId: i
                        });
                    }


                } else {
                    $scope.MeetingList.push({
                        meetingAgenda: "",
                        meetingVenue: "",
                        externalId: 0,
                        "AccountList": $scope.defaultAccountList
                    });
                }
                $scope.$apply();
            }
        }, {
            escape: true
        })
    }

    $scope.getProposalAccounts();
    $scope.getMeetingDetails();

    $scope.saveMeetingDetails = function () {
        debugger
        var objData = $scope.MeetingList;
        for (var i = 0; i < objData.length; i++) {

            var count = 0;
            if(objData[i].AccountList != undefined){
                for(var k = 0; k < objData[i].AccountList.length; k++){
                    if(objData[i].AccountList[k].selected == true){
                        count = count+1;
                    }
                }
            }
            if(count <= 0){
                swal("Meeting Details", "Please Select Partners.");
                $("#partner"+i+"").addClass('border-theme');
                return; 
            }

            if(objData[i].meetingAgenda == undefined || objData[i].meetingAgenda == ""){
                swal("Meeting Details", "Please Enter your Meeting Agenda.");
                $("#agenda"+i+"").addClass('border-theme');
                return;
            }
            if(objData[i].meetingVenue == undefined || objData[i].meetingVenue == ""){
                swal("Meeting Details", "Please Enter Meeting Venue.");
                $("#venue"+i+"").addClass('border-theme');
                return;
            }
            if(objData[i].Tentative_Date__c == undefined || objData[i].Tentative_Date__c == ""){
                swal("Meeting Details", "Please Enter Tentative Date.");
                $("#tentative"+i+"").addClass('border-theme');
                return;
            }
            if(objData[i].Actual_Date__c == undefined || objData[i].Actual_Date__c == ""){
                swal("Meeting Details", "Please Enter Actual Date.");
                $("#actual"+i+"").addClass('border-theme');
                return;
            }
        }

        for (var i = 0; i < objData.length; i++) {
            if(objData[i].Tentative_Date__c != undefined && objData[i].Tentative_Date__c != ""){
                objData[i].tentativeyear = objData[i].Tentative_Date__c.getUTCFullYear();
                objData[i].tentativemonth = objData[i].Tentative_Date__c.getUTCMonth()+1;
                objData[i].tentativeday = objData[i].Tentative_Date__c.getDate();
            }
            if(objData[i].Actual_Date__c != undefined && objData[i].Actual_Date__c != ""){
                objData[i].actualyear = objData[i].Actual_Date__c.getUTCFullYear();
                objData[i].actualmonth = objData[i].Actual_Date__c.getUTCMonth()+1;
                objData[i].actualday = objData[i].Actual_Date__c.getDate();
            }
            delete(objData[i]['$$hashKey']);
            var accountWrapperList = [];
            for (var k = 0; k < objData[i].AccountList.length; k++) {
                if (objData[i].AccountList[k].accountMappingId != undefined) {
                    accountWrapperList.push({
                        accnt: objData[i].AccountList[k],
                        isSelected: objData[i].AccountList[k].selected,
                        accountMappingId: objData[i].AccountList[k].accountMappingId
                    });
                } else {
                    accountWrapperList.push({
                        accnt: objData[i].AccountList[k],
                        isSelected: objData[i].AccountList[k].selected
                    });
                }

                delete(objData[i].AccountList[k]['$$hashKey']);
                delete(objData[i].AccountList[k]['selected']);
                delete(objData[i].AccountList[k]['accountMappingId']);
            }
            objData[i].AccountListWrapper = accountWrapperList;
            delete(objData[i]['AccountList']);
            delete(objData[i].Tentative_Date__c);
            delete(objData[i].Actual_Date__c);
        }

        console.log(objData);
        debugger;
        ApplicantPortal_Contoller.saveMeetingDetailss(objData, $rootScope.projectId, function (result, event) {
            debugger;
            if (event.status) {
                Swal.fire(
                    'Success',
                    'Your Network Meeting detail has been saved successfully.',
                    'success'
                );
                // swal("Network Meeting", "Your Network Meeting detail has been saved successfully.");
                // return;
            }
                debugger;
                $scope.redirectPageURL('ExpenseDeclaration');    

        });
    }

    $scope.addRows = function () {
        debugger
        var arrayLength = $scope.MeetingList.length;
        var externalid = $scope.MeetingList[arrayLength - 1].externalId;
        var accList = [];
        for (var i = 0; i < $scope.AccountList.length; i++) {
            var option = {
                'Id': $scope.AccountList[i].Id,
                'Name': $scope.AccountList[i].Name,
                'selected': false
            };
            accList.push(option);
        }
        $scope.MeetingList.push({
            meetingAgenda: "",
            meetingVenue: "",
            externalId: externalid + 1,
            AccountList: accList
        });
        $scope.$apply();
    }

    $scope.removeRow = function (index) {
        debugger;
        if ($scope.MeetingList.length == 1) {
            return;
        }
        if($scope.MeetingList[index].Id == undefined){
            $scope.MeetingList.splice(index, 1);
            return;
        }
        ApplicantPortal_Contoller.deleteNetworkMeeting($scope.MeetingList[index].Id, function (result, event) {
            if (event.status) {
                swal("Meeting Details", "Meeting Details Deleted Successfully");
                $scope.MeetingList.splice(index, 1);
            }
            $scope.$apply();
        });
    }
// $scope.date;
// $scope.siteURL = siteURL;
// $scope.applicantDetails = [];

// $scope.getApplicantDetails = function(){
//     ApplicantPortal_Contoller.getProjectDetailsForNetMeet($rootScope.userId, function (result, event){
//     if(event.status) {
//         debugger;
//         $scope.applicantDetails = result;
//         $scope.listOfMeeting = [];
//         for(var i=0;i<$scope.applicantDetails.length;i++){
//             if($scope.applicantDetails[i].Network_Meetings__r != undefined){
//                 for(j=0;j<$scope.applicantDetails[i].Network_Meetings__r.length;j++){
//                     if($scope.applicantDetails[i].Network_Meetings__r[j].Tentative_Date__c != undefined){
//                         $scope.applicantDetails[i].Network_Meetings__r[j].Tentative_Date__c   = new Date($scope.applicantDetails[i].Network_Meetings__r[j].Tentative_Date__c);
//                     }
//                     if($scope.applicantDetails[i].Network_Meetings__r[j].Actual_Date__c != undefined){
//                         $scope.applicantDetails[i].Network_Meetings__r[j].Actual_Date__c   = new Date($scope.applicantDetails[i].Network_Meetings__r[j].Actual_Date__c);
//                     }
//                 }
//             }
//             if($scope.applicantDetails[i].Network_Meetings__r == undefined){
//                 var rec = {
//                     'Account__c': $scope.applicantDetails[i].Id,
//                     'Meeting_Agenda__c': '',
//                     'Meeting_Venue__c': '',
//                     'Tentative_Date__c': '',
//                     'Actual_Date__c': ''
//                 };
//                 $scope.applicantDetails[i].Network_Meetings__r = [];
//                 debugger;
//                 $scope.applicantDetails[i].Network_Meetings__r.push(rec);
//             }
//             var netMeeting = [{"meetingAgenda":"","meetingVenue":"","Account":$scope.applicantDetails[i].Id,"id":"","tentativeyear":0,"tentativemonth":0,"tentativeday":0,"actualyear":0,"actualmonth":0,"actualday":0}];
//             $scope.listOfMeeting.push(netMeeting);

//         }
//         $scope.$apply();
//     }
// },
// {escape: true}
// )
// }
// $scope.getApplicantDetails();

// $scope.submitMeetingDetails = function(){
//     debugger;
//     $scope.meetingList = [];

//     for(var i=0;i<$scope.applicantDetails.length;i++){
//         for(var j=0;j<$scope.applicantDetails[i].Network_Meetings__r.length;j++){
//             if($scope.applicantDetails[i].Network_Meetings__r[j].Meeting_Agenda__c == undefined || $scope.applicantDetails[i].Network_Meetings__r[j].Meeting_Agenda__c == ""){
//                 swal("Meeting Details", "Please Enter Meeting Agenda.");
//                     return;
//             }
//             if($scope.applicantDetails[i].Network_Meetings__r[j].Meeting_Venue__c == undefined || $scope.applicantDetails[i].Network_Meetings__r[j].Meeting_Venue__c == ""){
//                 swal("Meeting Details", "Please Enter Meeting Venue.");
//                     return;
//             }
//             if($scope.applicantDetails[i].Network_Meetings__r[j].Tentative_Date__c == undefined || $scope.applicantDetails[i].Network_Meetings__r[j].Tentative_Date__c == ""){
//                 swal("Meeting Details", "Please Enter Tentative Date.");
//                     return;
//             }
//             if($scope.applicantDetails[i].Network_Meetings__r[j].Actual_Date__c == undefined || $scope.applicantDetails[i].Network_Meetings__r[j].Actual_Date__c == ""){
//                 swal("Meeting Details", "Please Enter Actual Date.");
//                     return;
//             }
//         }
//     }
//     for(let i=0; i<$scope.listOfMeeting.length; i++){
//         delete ($scope.listOfMeeting[i]['Name']);
//         delete ($scope.listOfMeeting[i]['$$hashKey']);
      
//         for(let j=0; j<$scope.applicantDetails[i].Network_Meetings__r.length; j++){
//             var networkMeeting = {"meetingAgenda":"","meetingVenue":"","Account":$scope.applicantDetails[i].Id,"id":"","tentativeyear":0,"tentativemonth":0,"tentativeday":0,"actualyear":0,"actualmonth":0,"actualday":0};
//                 networkMeeting.Account = $scope.applicantDetails[i].Id;
//                 networkMeeting.id = $scope.applicantDetails[i].Network_Meetings__r[j].Id;
//                 networkMeeting.meetingAgenda = $scope.applicantDetails[i].Network_Meetings__r[j].Meeting_Agenda__c;
//                 networkMeeting.meetingVenue = $scope.applicantDetails[i].Network_Meetings__r[j].Meeting_Venue__c;
//                 $scope.meetingList.push(networkMeeting);

//             if($scope.applicantDetails[i].Network_Meetings__r[j].Tentative_Date__c != undefined && $scope.applicantDetails[i].Network_Meetings__r[j].Tentative_Date__c != ""){
//                 networkMeeting.tentativeyear = $scope.applicantDetails[i].Network_Meetings__r[j].Tentative_Date__c.getUTCFullYear();
//                 networkMeeting.tentativemonth = $scope.applicantDetails[i].Network_Meetings__r[j].Tentative_Date__c.getUTCMonth()+1;
//                 networkMeeting.tentativeday = $scope.applicantDetails[i].Network_Meetings__r[j].Tentative_Date__c.getDate();
//             }else{
//                 delete ($scope.applicantDetails[i].Network_Meetings__r[j].Tentative_Date__c);
//             }

//             if($scope.applicantDetails[i].Network_Meetings__r[j].Actual_Date__c != undefined && $scope.applicantDetails[i].Network_Meetings__r[j].Actual_Date__c != ""){
//                 networkMeeting.actualyear = $scope.applicantDetails[i].Network_Meetings__r[j].Actual_Date__c.getUTCFullYear();
//                 networkMeeting.actualmonth = $scope.applicantDetails[i].Network_Meetings__r[j].Actual_Date__c.getUTCMonth()+1;
//                 networkMeeting.actualday = $scope.applicantDetails[i].Network_Meetings__r[j].Actual_Date__c.getDate();

//             }else{
//                 delete ($scope.applicantDetails[i].Network_Meetings__r[j].Actual_Date__c);
//             }
//             delete ($scope.applicantDetails[i].Network_Meetings__r[j].Tentative_Date__c);
//             delete ($scope.applicantDetails[i].Network_Meetings__r[j].Actual_Date__c);
//         }
//     }
//     ApplicantPortal_Contoller.insertMeetingDetails($scope.meetingList, function(result, event){
//         if(event.status){
//          debugger;
//          Swal.fire(
//              'Success',
//              'Submitted successfully.',
//              'success'
//          );
//          $scope.redirectPageURL('GrantApplication');
//          $scope.meetingList = result;
//          $scope.$apply();  
//      }
//     },
//     {escape:true}
//     )
// }

// $scope.addRow = function (index) {
//     debugger;
//     var rec = {
//         'Meeting_Agenda__c': '',
//         'Meeting_Venue__c': '',
//         'Tentative_Date__c': '',
//         'Actual_Date__c': '',
//         'Account__c': $scope.applicantDetails[index].Id
//     };
//     $scope.applicantDetails[index].Network_Meetings__r.push(rec);
// }

// $scope.deleteRow = function (param1,param2) {
//     debugger;
//     if ($scope.applicantDetails[param1].Network_Meetings__r.length > 1){
//         if($scope.applicantDetails[param1].Id != undefined){
//             $scope.deleteNetworkMeeting($scope.applicantDetails[param1].Network_Meetings__r[param2].Id);
//         }
//         $scope.applicantDetails[param1].Network_Meetings__r.splice(param2, 1);
//     }
// }

// $scope.deleteNetworkMeeting = function(netId){
//     ApplicantPortal_Contoller.deleteMeeting(netId, function (result, event) {
//         if (event.status) {
//             debugger;
//             Swal.fire(
//                 'Success',
//                 'Deleted Succesfully.',
//                 'success'
//             );
//             $scope.$apply();
//         }
//     },
//         {escape: true}
//         )
// }
$scope.validateDate=function(index,dateModel){
        var Year;
        var Month;
        var Day;
        debugger
        if(dateModel=="t"){
            if($scope.MeetingList[index].Tentative_Date__c!=undefined && $scope.MeetingList[index].Tentative_Date__c!=''){
                Year = $scope.MeetingList[index].Tentative_Date__c.getUTCFullYear();
                Month = $scope.MeetingList[index].Tentative_Date__c.getUTCMonth();
                Month=Month+1;
                Day = $scope.MeetingList[index].Tentative_Date__c.getDate();
            }
            var dayDiff = moment().diff(''+Year+'-'+Month+'-'+Day+'', 'days');
            if(dayDiff>0){
                swal('info','Tentative date can not be less than today date. ','info')
                $scope.MeetingList[index].Tentative_Date__c='';
                $scope.$apply();
            }
        }
        else
        {
            if($scope.MeetingList[index].Actual_Date__c!=undefined && $scope.MeetingList[index].Actual_Date__c!=''){
                Year = $scope.MeetingList[index].Actual_Date__c.getUTCFullYear();
                Month = $scope.MeetingList[index].Actual_Date__c.getUTCMonth();
                Month=Month+1;
                Day = $scope.MeetingList[index].Actual_Date__c.getDate();
            }
            var dayDiff = moment().diff(''+Year+'-'+Month+'-'+Day+'', 'days');
            if(dayDiff>0){
                swal('info','Actual date can not be less than today date. ','info')
                $scope.MeetingList[index].Actual_Date__c='';
                $scope.$apply();
            }
        }
}
$scope.redirectPageURL = function(pageName){
    debugger;
    var link=document.createElement("a");
    link.id = 'someLink'; //give it an ID!
    link.href="#/"+pageName;
    link.click();
}

$scope.removeClass=function(controlid,index){
    debugger;
    var controlIdfor=controlid+""+index;
    $("#"+controlIdfor+"").removeClass('border-theme');
  }
});