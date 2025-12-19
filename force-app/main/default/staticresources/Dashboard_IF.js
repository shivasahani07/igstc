angular.module('cp_app').controller('Dashboard_iF_Ctlr', function($scope,$sce,$rootScope) {
    $scope.showEnrolDate=true;
    $scope.basicDetails=true;
    
    $rootScope.proposalId;
    
    $rootScope.yearlyCallId;
    $scope.eduQualification=false;
    $scope.achievements=false;
    $scope.employmentDetails=false;
    $scope.fellowshipDetails=false;
    $scope.myDate=new Date();
    $scope.DivPDIF=false;
    $scope.activeCampaign={};
    $scope.objContact={};
    $scope.objProposal={};
    $scope.objContact.Industrial_Fellowship_Type__c='PIEF';
    $scope.objCampaign={};
    $scope.PhD_Awarded_Date__c;
    $scope.PIEF_age_limit;
    $scope.PDIF_age_limit;
    $scope.PDIF_phd_limit;
    $scope.PIEF_phd_limit;
    $scope.PIEF_DOB;
    $scope.PIEF_phddate;
    $scope.PIEF_phddate_onlydate;
    $scope.PDIF_DOB;
    $scope.PDIF_phddate;
    $scope.PDIF_phddate_onlydate;
    
    // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }
    
    // Fetching the campaignId from Local Storage
            if (localStorage.getItem('campaignId')) {
                $rootScope.campaignId = localStorage.getItem('campaignId');
                console.log('Loaded campaignId from localStorage:', $rootScope.campaignId);
            }

    // Fetching the yearlyCallId from Local Storage
    if (localStorage.getItem('yearlyCallId')) {
        $rootScope.yearlyCallId = localStorage.getItem('yearlyCallId');
        console.log('Loaded yearlyCallId from localStorage:', $rootScope.yearlyCallId);
    }

    localStorage.setItem('thesisSubmission','true');

    // Fetching the apaId from Local Storage
    if (localStorage.getItem('apaId')) {
        $rootScope.apaId = localStorage.getItem('apaId');
        console.log('Loaded apaId from localStorage:', $rootScope.apaId);
    }
    
    // Method to validate If Yearly call condions added by Rukasar:
 
   /* $scope.getActiveCampaignData = function() {
    debugger;
    ApplicantPortal_Contoller.getActiveCampaignIf('Industrial Fellowships', function(result, event) {
        console.log('Direct Test Result:', result);
        console.log('Direct Test Event:', event);
        
        if (event.status && result != null && result.length > 0) {
            $scope.activeCampaign = result;
            $scope.campaigntype = result[0].Id;
            $rootScope.campaignId = result[0].Id;
            
            $scope.yearlyCallId=result[0].Yearly_Call__c;
            
           
            
             // Fetching the campaignId from Local Storage
            if (localStorage.getItem('campaignId')) {
                $rootScope.campaignId = localStorage.getItem('campaignId');
                console.log('Loaded campaignId from localStorage:', $rootScope.campaignId);
            }
            
      
            if (result[0].Yearly_Call__r) {
                $scope.PIEF_age_limit = result[0].Yearly_Call__r.PIEF_Age_Limit__c;
                $scope.PDIF_age_limit = result[0].Yearly_Call__r.PDIF_Age_Limit__c;
                $scope.PDIF_phd_limit = result[0].Yearly_Call__r.PDIF_PhD_time__c;
                $scope.PIEF_DOB = result[0].Yearly_Call__r.Date_of_Birth_PIEF__c;
                $scope.PIEF_phddate = result[0].Yearly_Call__r.PhD_Enrollment_Date_PIEF__c;
                $scope.PIEF_phddate_onlydate = result[0].Yearly_Call__r.PhD_Enrollment_Date_PIEF__c;
                $scope.PDIF_DOB = result[0].Yearly_Call__r.Date_of_Birth_PDIF__c;
                $scope.PDIF_phddate = result[0].Yearly_Call__r.PhD_Enroll_ment_Date_PDIF__c;
                $scope.PDIF_phddate_onlydate = result[0].Yearly_Call__r.PhD_Enroll_ment_Date_PDIF__c;
                $scope.PIEF_PhD_time = result[0].Yearly_Call__r.PIEF_PhD_time__c;
  
            } else {
                console.error('Yearly Call relationship data not found');
               
            }
            console.log('Campaign Data Loaded:', {
                name: result[0].Name,
                PIEF_Age_Limit: $scope.PIEF_Age_Limit,
                PDIF_Age_Limit: $scope.PDIF_Age_Limit
            });
            //delete $scope.result.Yearly_Call__r;
          delete  $scope.activeCampaign[0].Yearly_Call__r;
            $scope.$apply();
        } else {
            console.warn('No active campaign found or error occurred');
         
        }
    });
}
$scope.getActiveCampaignData(); */


$scope.getActiveCampaignData = function() {
    debugger;
    ApplicantPortal_Contoller.getActiveCampaignIf($rootScope.yearlyCallId, function(result, event) {
        console.log('Direct Test Result:', result);
        console.log('Direct Test Event:', event);
        
        if (event.status && result != null && result.length > 0) {                           
            
            if (result) {
                $scope.PIEF_age_limit = result[0].PIEF_Age_Limit__c;
                $scope.PDIF_age_limit = result[0].PDIF_Age_Limit__c;
                $scope.PDIF_phd_limit = result[0].PDIF_PhD_time__c;
                $scope.PIEF_DOB = result[0].Date_of_Birth_PIEF__c;
                $scope.PIEF_phddate = result[0].PhD_Enrollment_Date_PIEF__c;
                $scope.PIEF_phddate_onlydate = result[0].PhD_Enrollment_Date_PIEF__c;
                $scope.PDIF_DOB = result[0].Date_of_Birth_PDIF__c;
                $scope.PDIF_phddate = result[0].PhD_Enroll_ment_Date_PDIF__c;
                $scope.PDIF_phddate_onlydate = result[0].PhD_Enroll_ment_Date_PDIF__c;
                $scope.PIEF_PhD_time = result[0].PIEF_PhD_time__c;

                 $scope.endDate=new Date(result[0].Campaign_End_Date__c,);

                //Set Campaign ID;
               localStorage.setItem('campaignId', result[0].Campaign__c);
  
            } else {
                console.error('Yearly Call relationship data not found');
               
            }
            console.log('Campaign Data Loaded:', {
               // name: result[0].Name,
                PIEF_Age_Limit: $scope.PIEF_Age_Limit,
                PDIF_Age_Limit: $scope.PDIF_Age_Limit
            });
            //delete $scope.result.Yearly_Call__r;
          //delete  $scope.activeCampaign[0].Yearly_Call__r;
            $scope.$apply();
        } else {
            console.warn('No active campaign found or error occurred');
         
        }
    });
}
$scope.getActiveCampaignData();
    
    $scope.getCampaignEndDate=function(){
      ApplicantPortal_Contoller.getCampaignEndDate('Industrial Fellowships',function (result, event) {
        debugger
        console.log('campaign date');
          console.log(result);
        if(event.status){
          $scope.objCampaign=result;
            
             //Set Campaign ID;
            //localStorage.setItem('campaignId', result.Id);            
         // $scope.endDate=new Date(result.EndDate);

          $scope.getContactDet();          
          $scope.$apply();          
        }
      });
    }
    $scope.getCampaignEndDate();
    
    $scope.getContactDet=function(){
        ApplicantPortal_Contoller.getContactDetails($rootScope.candidateId, function (result, event) {   // Chanded userId to candidateId
          debugger
            if (event.status) {
                    $scope.objContact=result;
                    delete $scope.objContact.Publications_Patents__r;
                    delete $scope.objContact.Education_Details__r;
                
               // $scope.PIEF_age_limit = $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.yearly_Call__r.PIEF_Age_Limit__c;
              //  $scope.PDIF_age_limit = $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.yearly_Call__r.PDIF_Age_Limit__c;
             //   $scope.PDIF_phd_limit = $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.yearly_Call__r.PDIF_PhD_time__c;
             
                
             //   $scope.PIEF_DOB = new Date($scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.yearly_Call__r.Date_of_Birth_PIEF__c);
             //   $scope.PIEF_phddate = new Date($scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.yearly_Call__r.PhD_Enrollment_Date_PIEF__c);
            //    $scope.PIEF_phddate_onlydate = $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.yearly_Call__r.PhD_Enrollment_Date_PIEF__c;
            //    $scope.PDIF_DOB = new Date($scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.yearly_Call__r.Date_of_Birth_PDIF__c);
              //  $scope.PDIF_phddate = new Date($scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.yearly_Call__r.PhD_Enroll_ment_Date_PDIF__c);
            //    $scope.PDIF_phddate_onlydate = $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r.yearly_Call__r.PhD_Enroll_ment_Date_PDIF__c;
                
                //$scope.objContact.Industrial_Fellowship_Type__c='PIEF';                    
                  
                    if(result.Birthdate!=undefined && result.Birthdate!=''){
                      $scope.Birthdate=new Date($scope.objContact.Birthdate);
                    }
                    if(result.PhD_Enroll_Date__c!=undefined && result.PhD_Enroll_Date__c!=''){
                      $scope.PhD_Enroll_Date__c=new Date($scope.objContact.PhD_Enroll_Date__c);
                    }
                    if(result.PhD_Awarded_Date__c!=undefined && result.PhD_Awarded_Date__c!=''){
                      $scope.PhD_Awarded_Date__c=new Date($scope.objContact.PhD_Awarded_Date__c);
                    }
                    if(result.Thesis_Submission_Date__c!=undefined && result.Thesis_Submission_Date__c!=''){
                      $scope.Thesis_Submission_Date__c=new Date($scope.objContact.Thesis_Submission_Date__c);
                    }
                    if($scope.objContact.Industrial_Fellowship_Type__c==undefined || $scope.objContact.Industrial_Fellowship_Type__c==''){
                      $scope.objContact.Industrial_Fellowship_Type__c='PIEF';
                    }
                    else if($scope.objContact.Industrial_Fellowship_Type__c!='PIEF'){
                      $scope.clickRadioPDIF();
                      $scope.changeAward();                      
                    }
                    if(result.Applicant_Proposal_Associations__r[0].Proposals__r!=undefined && result.Applicant_Proposal_Associations__r[0].Proposals__r!=''){
                      $scope.objProposal=result.Applicant_Proposal_Associations__r[0].Proposals__r?result.Applicant_Proposal_Associations__r[0].Proposals__r:null;
                  }
                    delete $scope.objContact.Applicant_Proposal_Associations__r[0].Proposals__r;
                
                    $scope.$apply();
            }
          },
            { escape: true }
          );
    }
    
    $scope.getContactDet();
    $scope.validateDate=function(controlId){
      debugger
        var birthYear=0;
        var birthMonth=0;
        var birthDay=0;
        if(controlId=="txtBirthdate"){
        //   var deadline = moment($scope.endDate);
        //   var BDate = moment($scope.Birthdate);
        //   var years = deadline.diff(BDate, 'years');

        //   if(years > 30){
        //     swal("Basic Details", "Age can not be more than 30 years", "info");
        //         $("#txtBirthdate").addClass('border-theme');
        //         return; 
        // }
        
        // if(years<20){
        //     swal("Basic Details", "Age can not be less than 20 years", "info");
        //     $("#txtBirthdate").addClass('border-theme');
        //     return;
        //   }
        }
        else if(controlId=="txtEnroleDate"){
          var Difference_In_Days = Math.floor((Date.UTC($scope.endDate.getFullYear(), $scope.endDate.getMonth(), $scope.endDate.getDate()) - Date.UTC($scope.PhD_Enroll_Date__c.getFullYear(), $scope.PhD_Enroll_Date__c.getMonth(), $scope.PhD_Enroll_Date__c.getDate()) ) /(1000 * 60 * 60 * 24));
        
        if(Difference_In_Days <= 365){
          //swal("Basic Details", "Minimum PhD enrollement year should be one", "info");
          $("#txtEnroleDate").addClass('border-theme');
          return;
        }
        }
        else if(controlId=="txtPhDSubmissionDat"){
          if($scope.Thesis_Submission_Date__c!=undefined && $scope.Thesis_Submission_Date__c!=''){
            var totalMonthsSubmission = $scope.endDate.getMonth() - $scope.Thesis_Submission_Date__c.getMonth() + 12 * ($scope.endDate.getFullYear() - $scope.Thesis_Submission_Date__c.getFullYear());
            
  
            if(totalMonthsSubmission > 36){
              //swal("Basic Details", "Years of thesis submission should be less than or equal to 3 years", "info");
                  $("#txtPhDSubmissionDat").addClass('border-theme');
                  return; 
          }
          }
        }
        else if(controlId=="txtPhDAwardedDate"){
          if($scope.PhD_Awarded_Date__c!=undefined && $scope.PhD_Awarded_Date__c!=''){
            var totalMonths = $scope.endDate.getMonth() - $scope.PhD_Awarded_Date__c.getMonth() + 12 * ($scope.endDate.getFullYear() - $scope.PhD_Awarded_Date__c.getFullYear());
            
  
            if(totalMonths > 36){
              //swal("Basic Details", "PhD awarded years should be less than or equal to 3 years", "info");
                  $("#txtPhDAwardedDate").addClass('border-theme');
                  return; 
          }
          }
        }
    }
    
    


    $scope.removeClass=function(controlid){
      $("#"+controlid+"").removeClass('border-theme');
    }
    $scope.clickBasicDetails=function(){  
      debugger
      if($rootScope.proposalStage){
        $scope.redirectPageURL('PersonalInformationIF');
        return; 
    }

        var birthYear=0;
        var birthMonth=0;
        var birthDay=0;
        var IndusrialFelloType=$scope.objContact.Industrial_Fellowship_Type__c;        
      if($scope.Birthdate!=undefined && $scope.Birthdate!=''){
        birthYear = $scope.Birthdate.getUTCFullYear();
        birthMonth = $scope.Birthdate.getUTCMonth()+1;
        birthDay = $scope.Birthdate.getDate();
      }

        var phdEnrollYear=0;
        var phdEnrollMonth=0;
        var phdEnrollDay=0;
      if($scope.PhD_Enroll_Date__c!=undefined && $scope.PhD_Enroll_Date__c!=''){
        phdEnrollYear = $scope.PhD_Enroll_Date__c.getUTCFullYear();
        phdEnrollMonth = $scope.PhD_Enroll_Date__c.getUTCMonth()+1;
        phdEnrollDay = $scope.PhD_Enroll_Date__c.getDate();
      }

      var phdAwardYear=0;
      var phdAwardMonth=0;
      var phdAwardDay=0;
      if($scope.PhD_Awarded_Date__c!=undefined && $scope.PhD_Awarded_Date__c!=''){
        phdAwardYear = $scope.PhD_Awarded_Date__c.getUTCFullYear();
        phdAwardMonth = $scope.PhD_Awarded_Date__c.getUTCMonth()+1;
        phdAwardDay = $scope.PhD_Awarded_Date__c.getDate();
      }
        var phdThesisYear=0;
        var phdThesisMonth=0;
        var phdThesisDay=0;
      if($scope.Thesis_Submission_Date__c!=undefined && $scope.Thesis_Submission_Date__c!=''){
        phdThesisYear = $scope.Thesis_Submission_Date__c.getUTCFullYear();
        phdThesisMonth = $scope.Thesis_Submission_Date__c.getUTCMonth()+1;
        phdThesisDay = $scope.Thesis_Submission_Date__c.getDate();
      }
      
    if($scope.objContact.Industrial_Fellowship_Type__c == 'PIEF'){
      if($scope.Birthdate==undefined || $scope.Birthdate==''){
        swal("Basic Details", "Please enter date of birth", "info");
        $("#txtBirthdate").addClass('border-theme');
        return;
      }

      if($scope.PhD_Enroll_Date__c==undefined || $scope.PhD_Enroll_Date__c==''){
        swal("Basic Details", "Please enter PhD enrolement date", "info");
        $("#txtEnroleDate").addClass('border-theme');
        return;
      }
      else{ 
      
    var Difference_In_Days = Math.floor((Date.UTC($scope.endDate.getFullYear(), $scope.endDate.getMonth(), $scope.endDate.getDate()) - Date.UTC($scope.PhD_Enroll_Date__c.getFullYear(), $scope.PhD_Enroll_Date__c.getMonth(), $scope.PhD_Enroll_Date__c.getDate()) ) /(1000 * 60 * 60 * 24));
   
    let date1_phd = new Date($scope.PhD_Enroll_Date__c).getTime();
  	let date2_phd = new Date($scope.PIEF_phddate).getTime(); 
    let today_date = new Date();
    let setYearAgo = new Date(today_date.setFullYear(today_date.getFullYear() - $scope.PIEF_phd_limit));  // Subtract 1 year from today
    let setYearAgoTimestamp = setYearAgo.getTime(); 
   
    let testdateyear = new Date($scope.PIEF_phddate).getFullYear(); 
          let testdatemonth = new Date($scope.PIEF_phddate).getMonth()+1; 
          let testdatedate = new Date($scope.PIEF_phddate).getDate(); 
          
          // if(date1_phd >= date2_phd){
          if(date1_phd >= setYearAgoTimestamp){
          swal("Basic Details", "PhD enrollment date should be greater than " + $scope.PIEF_phd_limit + " years", "info");
          //swal("Basic Details", "PhD enrollment date should be greater than " + testdatedate + "/" + testdatemonth + "/" + testdateyear, "info");
          $("#txtEnroleDate").addClass('border-theme');
          return;
        }
      }

      var deadline = moment($scope.endDate);
      var BDate = moment($scope.Birthdate);
      var years = deadline.diff(BDate, 'days');

      /*if(years > 10957){
        swal("Basic Details", "Age can not be more than 30 years", "info");
            $("#txtBirthdate").addClass('border-theme');
            return; 
    }*/
        
    let date1 = new Date($scope.Birthdate).getTime();
  	let date2 = new Date($scope.PIEF_DOB).getTime();

    //if(years > ($scope.PIEF_age_limit * 365)){
    if(date1 < date2 ){        
        swal("Basic Details", "Age can not be more than " + $scope.PIEF_age_limit + " years", "info");
            $("#txtBirthdate").addClass('border-theme');
            return; 
    }
    
    if(years<7305){
        swal("Basic Details", "Age can not be less than 20 years", "info");
        $("#txtBirthdate").addClass('border-theme');
        return;
      }
    }

    if($scope.objContact.Industrial_Fellowship_Type__c == 'PDIF'){

      if($scope.Birthdate == undefined || $scope.Birthdate == ""){
        swal("Basic Details", "Please enter date of birth", "info");
        $("#txtBirthdate1").addClass('border-theme');
        return;
      }

      var deadline = moment($scope.endDate);
      var BDate = moment($scope.Birthdate);
      var years = deadline.diff(BDate, 'days');

        let date3 = new Date($scope.Birthdate).getTime();
  		let date4 = new Date($scope.PDIF_DOB).getTime();
        
      //if(years > ($scope.PDIF_age_limit * 365)){
      if(date3 < date4){    
        swal("Basic Details", "Age can not be more than " + $scope.PDIF_age_limit + " years", "info");
            $("#txtBirthdate1").addClass('border-theme');
            return; 
    }
    
    if(years<7305){
        swal("Basic Details", "Age can not be less than 20 years", "info");
        $("#txtBirthdate1").addClass('border-theme');
        return;
      }
    
      if($scope.objContact.Awarded_PhD__c == undefined){
        swal("Basic Details", "Please enter have you been awarded PhD degree or not ?", "info");
          $("#awarded").addClass('border-theme');
          return;
      }

      if($scope.objContact.Awarded_PhD__c == 'Yes'){
        if($scope.PhD_Awarded_Date__c==undefined || $scope.PhD_Awarded_Date__c==''){
          swal("Basic Details", "Please enter PhD award mentioned in certificate", "info");
          $("#txtPhDAwardedDate").addClass('border-theme');
          return;
        }

        if($scope.PhD_Awarded_Date__c!=undefined && $scope.PhD_Awarded_Date__c!=''){
          var totalMonths = $scope.endDate.getMonth() - $scope.PhD_Awarded_Date__c.getMonth() + 12 * ($scope.endDate.getFullYear() - $scope.PhD_Awarded_Date__c.getFullYear());
          //var test = $scope.PDIF_phd_limit * 12;
            //if(totalMonths > ($scope.PDIF_phd_limit * 12)){
            let date1_phd1 = new Date($scope.PhD_Awarded_Date__c).getTime();
            let date2_phd1 = new Date($scope.PDIF_phddate).getTime();    
            let testdateyear1 = new Date($scope.PDIF_phddate).getFullYear(); 
            let testdatemonth1 = new Date($scope.PDIF_phddate).getMonth()+1; 
          	let testdatedate1 = new Date($scope.PDIF_phddate).getDate(); 
            
            //if(totalMonths > ($scope.PDIF_phd_limit * 12)){
            if(date1_phd1 < date2_phd1){
          		swal("Basic Details", "PhD awarded date should be less than " + $scope.PDIF_phd_limit + " years", "info");
          		//swal("Basic Details", "PhD awarded date should be less than " + testdatedate1 + "/" + testdatemonth1 + "/" + testdateyear1, "info");
                //swal("Basic Details", "PhD awarded years should be less than or equal to " + $scope.PDIF_phd_limit + " years", "info");
                $("#txtPhDAwardedDate").addClass('border-theme');
                return; 
            }
        }
      }

      if($scope.objContact.Awarded_PhD__c == 'No'){
        if($scope.Thesis_Submission_Date__c==undefined || $scope.Thesis_Submission_Date__c==''){
          swal("Basic Details", "Please enter PhD thesis submission date", "info");
          $("#txtPhDSubmissionDat").addClass('border-theme');
          return;
        }
        if($scope.Thesis_Submission_Date__c!=undefined && $scope.Thesis_Submission_Date__c!=''){
          var totalMonthsSubmission = $scope.endDate.getMonth() - $scope.Thesis_Submission_Date__c.getMonth() + 12 * ($scope.endDate.getFullYear() - $scope.Thesis_Submission_Date__c.getFullYear());
          

          if(totalMonthsSubmission > 36){
            swal("Basic Details", "Years of thesis submission should be less than or equal to 3 years", "info");
                $("#txtPhDSubmissionDat").addClass('border-theme');
                return; 
        }
        }

        // for(var i=0;i<$scope.allDocs.length;i++){
        //   if($scope.allDocs[i].userDocument.Name == 'proof of thesis submission'){
        //       if($scope.allDocs[i].userDocument.Status__c != 'Uploaded'){
        //           swal('info','Please upload proof of thesis submission.','info');
        //           return;
        //       }
        //   }
        // }
      }
     
      }
        //*********************added By Karthik KE (26/11/2025 11:15 AM)**************
        delete $scope.objContact.Employment_Details__r;
        delete $scope.objContact.Applicant_Proposal_Associations__r;
        delete $scope.objContact.Education_Details__r;
        delete $scope.objContact.Publications_Patents__r;
        delete $scope.objContact.Attachments;
        //****************************************************************************
        
      if(!$rootScope.proposalStage){
        $scope.objProposal.Proposal_Stages__c = 'Draft';    
        }
        else
        {
            $scope.objProposal.Proposal_Stages__c = 'Submitted';
        }
        if(!$rootScope.secondstage){
            $scope.objProposal.Stage__c = '1st Stage';    
        }
        else
        {
            $scope.objProposal.Stage__c = '2nd Stage';
        }
        delete $scope.objContact.Attachments;
    
        
    $scope.objProposal.Campaign__c = $rootScope.campaignId;
    $scope.objProposal.yearly_Call__c = $rootScope.yearlyCallId;
    ApplicantPortal_Contoller.updateIndusrianFellowshipBasicDet($rootScope.campaignId,$rootScope.candidateId,$scope.objContact, 
          birthDay,birthMonth,birthYear,
          phdEnrollYear,phdEnrollMonth,phdEnrollDay,
          phdAwardYear,phdAwardMonth,phdAwardDay,
          phdThesisYear,phdThesisMonth,phdThesisDay,$scope.objProposal,function (result, event) {
            console.log(result);
            console.log(event);
            debugger
            if (event.status) {
               if(result!=null){
             // Saving the ProposalId in Local Storage
				    localStorage.setItem('apaId', result.apa.Id);
            localStorage.setItem('proposalId', result.proposalId);
           
              
                   
                   
             }
              swal({
                title: "Basic Details",
                text: "Basic details saved successfully.",
                icon: "success",
                button: "ok!",
              }).then((value) => {
                    $scope.redirectPageURL('PersonalInformationIF');
                  });
            }
            else
            {
              swal({
                title: "Basic Details",
                text: "Exception!",
                icon: "error",
                button: "ok!",
              });
            }
          },
            { escape: true }
          );
    } 
    
    $scope.getProjectdetils = function () {
      debugger;
      ApplicantPortal_Contoller.getContactUserDoc($rootScope.contactId,$rootScope.proposalId, function (result, event) {
          debugger
          console.log('result return onload :: ');
          console.log(result);
          if (event.status) {
              $scope.allDocs = result;
              for(var i=0;i<$scope.allDocs.length;i++){
                  if($scope.allDocs[i].userDocument.Name == 'proof of thesis submission'){
                      $scope.doc=$scope.allDocs[i];
                  }
              }
              $scope.$apply();
          }
      }, {
          escape: true
      })
    }
    $scope.getProjectdetils();

    $scope.redirectPageURL=function(URL){
      var link=document.createElement("a");
      link.id = 'someLink'; //give it an ID!
      link.href='#/'+URL+'';
      link.click();
  }
    $scope.clickPersonalInfo=function(){
        $scope.basicDetails=false;
        
        $scope.eduQualification=true;
        $scope.achievements=false;
        $scope.employmentDetails=false;
        $scope.fellowshipDetails=false;
    }
    $scope.clickPreviousPersonalInfo=function(){
        $scope.basicDetails=true;
        
        $scope.eduQualification=false;
        $scope.achievements=false;
        $scope.employmentDetails=false;
        $scope.fellowshipDetails=false;
    }
    $scope.clickEduQualification=function(){
        $scope.basicDetails=false;
        
        $scope.eduQualification=false;
        $scope.achievements=true;
        $scope.employmentDetails=false;
        $scope.fellowshipDetails=false;
    }
    $scope.clickPreviousEduQualification=function(){
        $scope.basicDetails=false;
        $scope.personalInfo=true;
        $scope.eduQualification=false;
        $scope.achievements=false;
        $scope.employmentDetails=false;
        $scope.fellowshipDetails=false;
    }
    $scope.clickAchievements=function(){
        $scope.basicDetails=false;
        
        $scope.eduQualification=false;
        $scope.achievements=false;
        $scope.employmentDetails=true;
        $scope.fellowshipDetails=false;
    }
    $scope.clickPreviousAchievements=function(){
        $scope.basicDetails=false;
        
        $scope.eduQualification=true;
        $scope.achievements=false;
        $scope.employmentDetails=false;
        $scope.fellowshipDetails=false;
    }
    $scope.clickEmploymentDetails=function(){
        $scope.basicDetails=false;
        
        $scope.eduQualification=false;
        $scope.achievements=false;
        $scope.employmentDetails=false;
        $scope.fellowshipDetails=true;
    }
    $scope.clickPreviousEmploymentDetails=function(){
        $scope.basicDetails=false;
        
        $scope.eduQualification=false;
        $scope.achievements=true;
        $scope.employmentDetails=false;
        $scope.fellowshipDetails=false;
    }
    $scope.clickFellowshipDetails=function(){
        swal({
            title: "Good job!",
            text: "Write your code here!",
            icon: "success",
          });
    }
    $scope.clickBack=function(){
      var link=document.createElement("a");
      link.id = 'someLink'; //give it an ID!
      link.href="#/ProjectDetailIF";
      link.click();
    }
    $scope.clickPreviousFellowshipDetails=function(){
        $scope.basicDetails=false;
        
        $scope.eduQualification=false;
        $scope.achievements=false;
        $scope.employmentDetails=true;
        $scope.fellowshipDetails=false;
    }
    $scope.clickRadioPIEF=function(){
        $scope.showAwardDrop=false;
        $scope.PhDThesis=false;
        $scope.PhDDate=false;
        $scope.showEnrolDate=true;
        $scope.DivPDIF=false;
    }
    $scope.clickRadioPDIF=function(){
        $scope.showEnrolDate=false;
        $scope.showAwardDrop=true;  
        $scope.DivPDIF=true;
        if($scope.objContact.Awarded_PhD__c=="Yes"){
          $scope.PhDDate=true;
          $scope.PhDThesis=false;
        }      
        else
        {
          $scope.PhDThesis=true;
          $scope.PhDDate=false;
        }
    }    
    $scope.changeAward=function(){
      debugger
          if($scope.objContact.Awarded_PhD__c=="Yes"){
            $scope.PhDDate=true;
            $scope.PhDThesis=false;
            localStorage.setItem('thesisSubmission','false');
          }
          else
          {
            $scope.PhDDate=false;
            $scope.PhDThesis=true;
            localStorage.setItem('thesisSubmission','true');
          }
    }
     $scope.redirectToApplicantPortal = function() {
    window.location.href = 'https://indo-germansciencetechnologycentre--newdevutil.sandbox.my.salesforce-sites.com/ApplicantDashboard/ApplicantPortal?id=' + $rootScope.candidateId;
};

    $scope.uploadFile = function (type, userDocId, fileId) {
      debugger;
      $scope.showSpinnereditProf = true;
      var file;
      
          file = document.getElementById(type).files[0];
      console.log(file);
      if (file != undefined) {
          if (file.size <= maxFileSize) {
              
              attachmentName = file.name;
              const myArr = attachmentName.split(".");
              /* if (myArr[1] != "pdf" && type != 'profilePic') {
                  alert("Please upload in PDF format only");
                  return;
              } */
              var fileReader = new FileReader();
              fileReader.onloadend = function (e) {
                  attachment = window.btoa(this.result);  //Base 64 encode the file before sending it
                  positionIndex = 0;
                  fileSize = attachment.length;
                  $scope.showSpinnereditProf = false;
                  console.log("Total Attachment Length: " + fileSize);
                  doneUploading = false;
                  debugger;
                  if (fileSize < maxStringSize) {
                      $scope.uploadAttachment(type , userDocId, null);
                  } else {
                      alert("Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".");
                  }
      
              }
              fileReader.onerror = function (e) {
                  alert("There was an error reading the file.  Please try again.");
              }
              fileReader.onabort = function (e) {
                  alert("There was an error reading the file.  Please try again.");
              }
      
              fileReader.readAsBinaryString(file);  //Read the body of the file
      
          } else {
              alert("File must be under 4.3 MB in size.  Your file is too large.  Please try again.");
              $scope.showSpinnereditProf = false;
          }
      } else {
          alert("You must choose a file before trying to upload it");
          $scope.showSpinnereditProf = false;
      }
      }

      $scope.uploadAttachment = function (type, userDocId, fileId) {
          debugger;
          var attachmentBody = "";
          // if (fileId == undefined) {
          //     fileId = " ";
          // }
          if (fileSize <= positionIndex + chunkSize) {
              debugger;
              attachmentBody = attachment.substring(positionIndex);
              doneUploading = true;
          } else {
              attachmentBody = attachment.substring(positionIndex, positionIndex + chunkSize);
          }
          console.log("Uploading " + attachmentBody.length + " chars of " + fileSize);
          ApplicantPortal_Contoller.doCUploadAttachmentAa(
              attachmentBody, attachmentName,fileId, userDocId, 
              function (result, event) {
                  console.log(result);
                  if (event.type === 'exception') {
                      console.log("exception");
                      console.log(event);
                  } else if (event.status) {
                      if (doneUploading == true) {
                        $scope.getProjectdetils();
                          swal(
                              'success',
                              'Uploaded Successfully!',
                              'success'
                          )
                          
                          // $scope.disableSubmit = false;
                              
                          // }
                          // $scope.getCandidateDetails();
                          
                        } else {
                          debugger;
                          positionIndex += chunkSize;
                          $scope.uploadAttachment(type,userDocId,result);
                        }
                        $scope.showUplaodUserDoc = false;
                      }
              },
          
          
              { buffer: true, escape: true, timeout: 120000 }
          );
          }

          $scope.filePreviewHandler = function(fileContent){
            debugger;
            $scope.selectedFile = fileContent;
        
            // console.log('selectedFile---', $scope.selectedFile);
            var jhj=$scope.selectedFile.userDocument.Attachments[0].Id;
            // console.log(jhj);
            $scope.filesrec = $sce.trustAsResourceUrl(window.location.origin +'/ApplicantDashboard/servlet/servlet.FileDownload?file='+$scope.selectedFile.userDocument.Attachments[0].Id);
            $('#file_frame').attr('src', $scope.filesrec);
            // console.log('filesrec : ',$scope.filesrec);
            var myModal = new bootstrap.Modal(document.getElementById('filePreview'))        
            myModal.show('slow') ;
            $scope.$apply();
        
        }

});