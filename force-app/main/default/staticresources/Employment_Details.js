angular.module('cp_app').controller('emp_ctrl', function($scope,$rootScope) {
    debugger;
    
    // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }
	if (localStorage.getItem('apaId')) {
        $rootScope.apaId = localStorage.getItem('apaId');
        console.log('Loaded proposalId from localStorage:', $rootScope.apaId);
    }

    $scope.getEmpDetails = function(){
        debugger;
        $scope.empDetails = [];
        ApplicantPortal_Contoller.getEmpDetails($rootScope.candidateId,$rootScope.apaId, function (result, event) {
            debugger
            if (event.status) {
                if(result != null){
                    // for(var i=0;i<result.length;i++){
                    //     if(result[i].Start_Date__c!=null){
                    //         result[i].Start_Date__c = new Date(result[i].Start_Date__c);
                    //     }
                    //     if(result[i].End_Date__c!=null){
                    //         result[i].End_Date__c = new Date(result[i].End_Date__c);
                    //     }
                    // }
                }
                debugger;

                if (result == null || result.length == 0) {
                    $scope.empDetails.push({
                        "Position__c": "",
                        "Organization_Name__c": "",
                        "Nature_of_Job__c": "",
                        "Start_Date__c":"",
                        "End_Date__c":"",
                        "Contact__c":$rootScope.contactId
                    });
                } else {
                    $scope.empDetails = result;  
                    for(var i=0;i<$scope.empDetails.length;i++){

                        if(result[i].Start_Date__c != undefined || result[i].Start_Date__c != ''){
                            $scope.empDetails[i].Start_Date__c = $scope.empDetails[i].Start_Date__c ? $scope.empDetails[i].Start_Date__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.empDetails[i].Start_Date__c;  
                        }

                        if(result[i].End_Date__c != undefined || result[i].End_Date__c != ''){
                            $scope.empDetails[i].End_Date__c = $scope.empDetails[i].End_Date__c ? $scope.empDetails[i].End_Date__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.empDetails[i].End_Date__c;  
                        }

                        if(result[i].Position__c != undefined || result[i].Position__c != ''){
                            $scope.empDetails[i].Position__c = $scope.empDetails[i].Position__c ? $scope.empDetails[i].Position__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.empDetails[i].Position__c;  
                        }

                        if(result[i].Organization_Name__c != undefined || result[i].Organization_Name__c != ''){
                            $scope.empDetails[i].Organization_Name__c = $scope.empDetails[i].Organization_Name__c ? $scope.empDetails[i].Organization_Name__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.empDetails[i].Organization_Name__c;  
                        }

                        if(result[i].Nature_of_Job__c != undefined || result[i].Nature_of_Job__c != ''){
                            $scope.empDetails[i].Nature_of_Job__c = $scope.empDetails[i].Nature_of_Job__c ? $scope.empDetails[i].Nature_of_Job__c.replace(/&amp;/g,'&').replaceAll('&amp;amp;','&').replaceAll('&amp;gt;','>').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&') : $scope.empDetails[i].Nature_of_Job__c;  
                        }
                    }                     
                }
                $scope.$apply();                    
                       
            }
        }, {
            escape: true
        })
    }
    $scope.getEmpDetails();


$scope.insertEmploymentDetails = function(){
        debugger;
        for(var i=0;i<$scope.empDetails.length;i++){
            delete ($scope.empDetails[i]['$$hashKey']);
        }

        for(var i=0;i<$scope.empDetails.length;i++){
            if($scope.empDetails[i].Start_Date__c == undefined || $scope.empDetails[i].Start_Date__c == ""){
                swal('info','Please enter Start date','info');
                $("#txtSD"+i+"").addClass('border-theme');
                return;
            }

            if($scope.empDetails[i].End_Date__c == undefined || $scope.empDetails[i].End_Date__c == ""){
                swal('info','Please enter End date','info');
                $("#txtED1"+i+"").addClass('border-theme');
                return;
            }

            if($scope.empDetails[i].Position__c == undefined || $scope.empDetails[i].Position__c == ""){
                swal('info','Please enter Position','info');
                $("#txtPos"+i+"").addClass('border-theme');
                return;
            }

            if($scope.empDetails[i].Organization_Name__c == undefined || $scope.empDetails[i].Organization_Name__c == ""){
                swal('info','Please enter Organization/Institute name','info');
                $("#txtOrg"+i+"").addClass('border-theme');
                return;
            }

            if($scope.empDetails[i].Nature_of_Job__c == undefined || $scope.empDetails[i].Nature_of_Job__c == ""){
                swal('info','Please enter Nature of work','info');
                $("#txtNature"+i+"").addClass('border-theme');
                return;
            }
        }
        ApplicantPortal_Contoller.insertEmploymentDetailsPECFAR($scope.empDetails,$rootScope.apaId, function (result, event) {
            debugger
            if (event.status) {
                swal({
                        title: "Employment Details",
                        text: 'Your Employment details have been successfully saved.',
                        icon: "success",
                        button: "ok!",
                    }).then((value) => {
                        $scope.redirectPageURL('ParentOrganization');
                        });
                $scope.$apply();                    
                       
            }
        }, {
            escape: true
        })
    }
    // $scope.insertEmploymentDetails = function(){
    //     debugger;
    //     $scope.empList = [];
    //     var years=0;
    //     var month=0;
    //     var day=0;
    //     var mjStartDate = null;
    //     var mjEndDate = null;

    //     for(var i=0;i<$scope.empDetails.length;i++){
    //         if($scope.empDetails[i].Start_Date__c==undefined || $scope.empDetails[i].Start_Date__c==""){
    //             swal('info','Please enter Start Date','info');
    //             $("#txtSD"+i+"").addClass('border-theme');
    //             return;
    //         }
    //         if($scope.empDetails[i].Position__c==undefined || $scope.empDetails[i].Position__c==""){
    //             swal('info','Please enter Position','info');
    //             $("#txtPos"+i+"").addClass('border-theme');
    //             return;
    //         }
    //         if($scope.empDetails[i].End_Date__c==undefined && $scope.empDetails[i].current_employement__c==false){
    //             swal('info','Please enter Employment End Date/Is it your Current Employment','info');
    //             $("#txtED1"+i+"").addClass('border-theme');
    //             $("#txtCE"+i+"").addClass('border-theme');
    //             return;
    //         }else if($scope.empDetails[i].End_Date__c!=undefined && $scope.empDetails[i].current_employement__c == undefined){

    //         }else if($scope.empDetails[i].End_Date__c==undefined && $scope.empDetails[i].current_employement__c != undefined){

    //         }
    //         if($scope.empDetails[i].Organization_Name__c==undefined || $scope.empDetails[i].Organization_Name__c==""){
    //             swal('info','Please enter Organization Name','info');
    //             $("#txtOrg"+i+"").addClass('border-theme');
    //             return;
    //         }
    //         if($scope.empDetails[i].Nature_of_Job__c==undefined || $scope.empDetails[i].Nature_of_Job__c==""){
    //             swal('info','Please enter Nature of Work','info');
    //             $("#txtNature"+i+"").addClass('border-theme');
    //             return;
    //         }
    //     }
    //     for(let i=0; i<$scope.empDetails.length; i++){
    //         delete ($scope.empDetails[i]['$$hashKey']);
    //         mjStartDate = null;
    //         mjEndDate = null;

    //         var emp = {"startYear":0,"startMonth":0,"startDay":0,"endYear":0,"endMonth":0,"endDay":0,employmentDetails:{
    //             "Position__c":$scope.empDetails[i].Position__c,"current_employement__c":$scope.empDetails[i].current_employement__c,"Organization_Name__c":$scope.empDetails[i].Organization_Name__c,"Id":$scope.empDetails[i].Id,"Nature_of_Job__c":$scope.empDetails[i].Nature_of_Job__c,"Contact__c":$rootScope.contactId
    //         }};
    //         $scope.empList.push(emp);
    //         var today = new Date();
    //         var dd = today.getDate();
    //         var mm = today.getMonth() + 1;
    //         var yyyy = today.getFullYear();

    //         if($scope.empDetails[i].Start_Date__c == undefined || $scope.empDetails[i].Start_Date__c == ''){
    //             delete ($scope.empDetails[i].Start_Date__c); 
    //         }else if($scope.empDetails[i].Start_Date__c != undefined || $scope.empDetails[i].Start_Date__c != ""){
    //             emp.startYear = $scope.empDetails[i].Start_Date__c.getUTCFullYear();
    //             emp.startMonth = $scope.empDetails[i].Start_Date__c.getUTCMonth()+1;
    //             emp.startDay = $scope.empDetails[i].Start_Date__c.getDate();
    //             mjStartDate = moment([$scope.empDetails[i].Start_Date__c.getUTCFullYear(), $scope.empDetails[i].Start_Date__c.getUTCMonth()+1, $scope.empDetails[i].Start_Date__c.getDate()]);
    //         }

    //         if($scope.empDetails[i].End_Date__c == undefined || $scope.empDetails[i].End_Date__c == ''){
    //             delete ($scope.empDetails[i].End_Date__c); 
    //         }else if($scope.empDetails[i].End_Date__c != undefined || $scope.empDetails[i].End_Date__c != ""){
    //             emp.endYear = $scope.empDetails[i].End_Date__c.getUTCFullYear();
    //             emp.endMonth = $scope.empDetails[i].End_Date__c.getUTCMonth()+1;
    //             emp.endDay = $scope.empDetails[i].End_Date__c.getDate();
    //             mjEndDate = moment([$scope.empDetails[i].End_Date__c.getUTCFullYear(), $scope.empDetails[i].End_Date__c.getUTCMonth()+1, $scope.empDetails[i].End_Date__c.getDate()]);
    //         }

    //         if(mjStartDate!=null && mjEndDate!=null){
    //             var mjDiff=mjEndDate.diff(mjStartDate, 'days');
    //             if(mjDiff<0){
    //                 swal('info','Start date can not be greater than end date','info')
    //                 $("#txtSD"+i+"").addClass('border-theme');
    //                 $("#txtED"+i+"").addClass('border-theme');
    //                 return;
    //             }
    //         }
    //         mjStartDate=null;
    //     mjEndDate=null;
    //       if($scope.empDetails[i].Start_Date__c != undefined && $scope.empDetails[i].Start_Date__c != ""){
    //         if($scope.empDetails[i].Start_Date__c.getDate() > dd && $scope.empDetails[i].Start_Date__c.getUTCMonth()+1 >= mm && $scope.empDetails[i].Start_Date__c.getUTCFullYear() >= yyyy){
    //           swal("info", "Start Date should not be future date.","info");
    //           $("#txtSD"+i+"").addClass('border-theme');
    //                   return;
    //         }
    //       }

    //       if(($scope.empDetails[i].Start_Date__c != undefined && $scope.empDetails[i].Start_Date__c != "") && ($scope.empDetails[i].End_Date__c != undefined && $scope.empDetails[i].End_Date__c != "")){
    //         if($scope.empDetails[i].Start_Date__c > $scope.empDetails[i].End_Date__c){
    //             swal("info", "End Date should not be be previous to Start Date.","info");
    //             $("#txtSD"+i+"").addClass('border-theme');
    //             $("#txtED"+i+"").addClass('border-theme');
    //                     return; 
    //         }
    //       }

        
    //     }

    //     for(var i=0;i<$scope.empDetails.length;i++){
    //         delete ($scope.empDetails[i].Start_Date__c);
    //         delete ($scope.empDetails[i].End_Date__c);
    //     }

    //     ApplicantPortal_Contoller.updateEmploymentDetails($scope.empList, function(result, event){
    //         if(event.status){
    //          debugger;
    //          swal({
    //             title: "Employment Details",
    //             text: 'Your Employment detail has been successfully saved.',
    //             icon: "success",
    //             button: "ok!",
    //           }).then((value) => {
    //             $scope.redirectPageURL('ParentOrganization');
    //               });
            
    //         $scope.$apply();  
    //      }
    //      else
    //           {
    //             swal({
    //               title: "Employment Details",
    //               text: "Exception!",
    //               icon: "error",
    //               button: "ok!",
    //             });
    //           }
    //     },
    //     {escape:true}
    //     )
    // }

    $scope.addEmp=function(){
        debugger;
            $scope.empDetails.push({
                "Position__c":"","Organization_Name__c":"","Nature_of_Job__c":"","Contact__c":$rootScope.contactId
            });
    }

    $scope.removeEmployment = function (index) {
        debugger;
        if ($scope.empDetails.length == 1) {
            return;
        }
        if($scope.empDetails[index].Id == undefined){
            $scope.empDetails.splice(index, 1);
            return;
        }
        ApplicantPortal_Contoller.deleteEmployment($scope.empDetails[index].Id, function (result, event) {
            if (event.status) {
                swal("Employment Details", "Employment Deleted Successfully");
                $scope.empDetails.splice(index, 1);
            }
            $scope.$apply();
        });
    }

    $scope.setOthers=function(chkVal,index){
        if(chkVal){
          for(var i=0;i<$scope.empDetails.length;i++){
            if(index!=i){  
            $scope.empDetails[i].current_employement__c=false;
            $("#txtED"+i+"").removeAttr('disabled');  
            }
            else{
                $scope.empDetails[i].End_Date__c=new Date();
                $("#txtED"+index+"").attr('disabled',true);                
              }
          }
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

    $scope.removeClass=function(controlid,index){
        var controlIdfor=controlid+""+index;
        $("#"+controlIdfor+"").removeClass('border-theme');
      }
});