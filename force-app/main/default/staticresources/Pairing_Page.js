angular.module('cp_app').controller('pairing_ctrl', function ($scope, $rootScope) {

    debugger;
    $scope.siteURL = siteURL;
    $rootScope.campaignId;
    $rootScope.projectId;
    $scope.disableAddButton = false;
    $scope.pairList = { "Account": { "Name": "" } };
    $scope.country1;
    $scope.country2;
    $scope.pairingDetails = { "Account": { "Name": "" } };
    $scope.mydate = new Date('2013', '10', '28');
    $scope.Pecfar_age_limit;
    $scope.Pecfar_DOB;
    $scope.activeCampaign = null;
    $scope.yearlyCall;
    // $scope.birthday;


    $scope.birthDatepresent = [];


    // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }

    // Fetching the yearlyCallId from Local Storage
    if (localStorage.getItem('yearlyCallId')) {
        $rootScope.yearlyCallId = localStorage.getItem('yearlyCallId');
        console.log('Loaded proposalId from localStorage:', $rootScope.yearlyCallId);
    }

    // Fetching the apaId from Local Storage
    if (localStorage.getItem('apaId')) {
        $rootScope.apaId = localStorage.getItem('apaId');
        console.log('Loaded apaId from localStorage:', $rootScope.apaId);
    }

    /**
     * Fetches proposal stage from Apex on page load
     */
    $scope.getProposalStage = function () {
        debugger;
        if ($rootScope.apaId && $rootScope.proposalId) {
            ApplicantPortal_Contoller.getProposalStageUsingProposalId($rootScope.proposalId, $rootScope.apaId, function (result, event) {
                debugger;
                if (event.status && result) {
                    $scope.proposalStage = (result.proposalStage != 'Draft' && result.proposalStage != null && result.proposalStage != undefined);
                    $rootScope.proposalStage = $scope.proposalStage;
                    $scope.$apply();
                }
            }, { escape: true });
        }
    }
    $scope.getProposalStage();


    // $scope.checkEmail = function(email,contId){
    //     debugger;
    //     $scope.emailCheck = false;
    //     if(contId == undefined){
    //       contId = "";
    //     }
    //     ApplicantPortal_Contoller.checkEmail(email,contId,function(result,event){
    //       debugger;
    //       if(event.status){
    //           debugger;
    //           if (result && result.length > 0) {
    //               $scope.pairList = {
    //                   FirstName: result[0].FirstName || '',
    //                   LastName: result[0].LastName || '',
    //                   Email: result[0].Email || '',
    //                   Id:result[0].Id || '',
    //                   Birthdate: result[0].Birthdate
    //             ? new Date(Number(result[0].Birthdate))
    //             : '',
    //                   MailingCountry: result[0].MailingCountry || '',
    //                   Campaign__c: $scope.campaigntype,
    //                   Account:result[0].Account || ''
    //               };
    //               $scope.emailCheck = false;
    //           }       
    //           else{
    //               $scope.emailCheck = true;
    //         }
    //         $scope.$apply();
    //       }
    //     })

    //   }

    $scope.checkEmail = function (email, contId) {
        debugger;
        $scope.emailCheck = false;

        // Clear previous contact data if email is empty
        if (!email || email.trim() === '') {
            $scope.pairList.Id = '';
            $scope.$apply();
            return;
        }

        // Validate email format first
        if ($scope.valid(email)) {
            $scope.emailCheck = false;
            $scope.pairList.Id = '';
            $scope.$apply();
            return;
        }

        if (contId == undefined) {
            contId = "";
        }

        // Determine opposite MailingCountry based on first contact's MailingCountry
        var oppMailingCountry = "";
        if ($scope.pairingDetails && $scope.pairingDetails.MailingCountry) {
            if ($scope.pairingDetails.MailingCountry == "India") {
                oppMailingCountry = "Germany";
            } else {
                oppMailingCountry = "India";
            }
        } else {
            // Default to India if pairingDetails is not available
            oppMailingCountry = "India";
        }

        ApplicantPortal_Contoller.checkEmailWiser(email, contId, oppMailingCountry, $rootScope.yearlyCallId, function (result, event) {
            debugger;
            if (event.status) {
                debugger;
                // Check for error message first (if contact has already applied for a campaign in current year)
                if (result && result.errorMessage) {
                    // Show error message - contact has already applied
                    $scope.emailCheck = false;
                    $scope.pairList.Id = '';
                    $scope.pairList.FirstName = '';
                    $scope.pairList.LastName = '';
                    $scope.pairList.Birthdate = '';
                    $scope.pairList.Account = { Name: '' };
                    $scope.pairList.AccountId = '';
                    // Keep the email that was entered
                    $scope.pairList.Email = email;

                    swal({
                        title: "Application Already Exists",
                        text: result.errorMessage,
                        icon: "error",
                        button: "OK"
                    });
                    $scope.$apply();
                    return;
                }

                // Check if contacts exist in the wrapper
                if (result && result.contacts && result.contacts.length > 0) {
                    // Contact exists - populate pairList with contact data including Id
                    var contact = result.contacts[0];
                    $scope.pairList.Id = contact.Id || '';
                    $scope.pairList.FirstName = contact.FirstName || '';
                    $scope.pairList.LastName = contact.LastName || '';
                    $scope.pairList.Email = contact.Email || email;
                    $scope.pairList.Birthdate = contact.Birthdate
                        ? new Date(Number(contact.Birthdate))
                        : '';
                    $scope.pairList.MailingCountry = contact.MailingCountry || '';
                    $scope.pairList.Campaign__c = $scope.campaigntype;
                    $scope.pairList.Account = contact.Account || { Name: '' };
                    $scope.pairList.AccountId = contact.AccountId || '';

                    $scope.emailCheck = false;

                    // Show success message that contact exists
                    swal({
                        title: "Contact Found",
                        text: "Contact exists in the system.",
                        icon: "success",
                        button: "OK",
                        timer: 2000
                    });
                }
                else {
                    // Contact doesn't exist - show error and clear contact-specific fields
                    $scope.emailCheck = false;
                    $scope.pairList.Id = '';
                    $scope.pairList.FirstName = '';
                    $scope.pairList.LastName = '';
                    $scope.pairList.Birthdate = '';
                    $scope.pairList.Account = { Name: '' };
                    $scope.pairList.AccountId = '';
                    // Keep the email that was entered
                    $scope.pairList.Email = email;

                    swal({
                        title: "Contact Not Found",
                        text: "This email does not exist in the system. Only existing contacts can be added as the second member of the pair.",
                        icon: "error",
                        button: "OK"
                    });
                }
                $scope.$apply();
            } else {
                // Handle RemoteAction error
                $scope.emailCheck = false;
                $scope.pairList.Id = '';
                swal({
                    title: "Error",
                    text: event.message || "An error occurred while checking the email.",
                    icon: "error",
                    button: "OK"
                });
                $scope.$apply();
            }
        })

    }

    $scope.getcampaigntype = function () {
        debugger;
        $scope.primary = false;
        ApplicantPortal_Contoller.getcampaigntype($rootScope.candidateId, $rootScope.proposalId, function (result, event) {//changed userId to candidateId
            debugger;
            if (event.status && result != null) {
                debugger;
                // $scope.campaigntype = result.Campaign__c;
                if (result.Is_Coordinator__c == true) {
                    $scope.primary = false;
                } else {
                    $scope.primary = true;
                }
                $scope.$apply();
            }
        })
    }
    $scope.getcampaigntype();

    // ============ NEW CAMPAIGN FUNCTIONS Start added by Rukasar============

    $scope.getActiveCampaignData = function () {
        debugger;
        ApplicantPortal_Contoller.getActiveCampaign($rootScope.yearlyCallId, function (result, event) {
            console.log('Direct Test Result:', result);
            console.log('Direct Test Event:', event);

            if (event.status && result != null) {
                $scope.activeCampaign = result[0].Campaign__c;
                $scope.campaigntype = result[0].Campaign__c;
                $rootScope.campaignId = result[0].Campaign__c;
                $scope.yearlyCall = result[0].Id;
                $scope.Pecfar_age_limit = result[0].Pecfar_age_limit__c;
                $scope.Pecfar_DOB = result[0].Date_of_Birth_PECFAR__c;

                console.log('Campaign Data Loaded:', {
                    // name: result.Name,
                    ageLimit: $scope.Pecfar_age_limit,
                    dobLimit: $scope.Pecfar_DOB
                });

                $scope.$apply();
            } else {
                console.warn('No active campaign found or error occurred');
            }
        });
    };

    // Function to validate age against campaign
    $scope.validateWithCampaign = function (birthdate, isPrimary) {
        debugger;

        // Only validate if we have campaign data
        if (!$scope.Pecfar_DOB || !$scope.Pecfar_age_limit) {
            console.log('Campaign data not available for validation');
            return { valid: true, skip: true };
        }

        if (!birthdate) {
            return { valid: false, message: "Birthdate is required", field: isPrimary ? 'txtIndBD' : 'txtGerBD' };
        }

        var applicantDOB = new Date(birthdate);
        var pecfarDOB = new Date($scope.Pecfar_DOB);

        // Check if applicant is older than PECFAR allow
        if (applicantDOB < pecfarDOB) {
            return {
                valid: false,
                message: "Age cannot be more than " + $scope.Pecfar_age_limit + " years",
                field: isPrimary ? 'txtIndBD' : 'txtGerBD'
            };
        }

        return { valid: true, message: "Age validation passed" };
    };

    $scope.getActiveCampaignData();
    // ============ NEW CAMPAIGN FUNCTIONS End ==============  



    $scope.getPairingDetails = function () {
        debugger;
        $scope.pairingDetails = [];
        if ($rootScope.campaignId == undefined) {
            $rootScope.campaignId = "";
        }
        ApplicantPortal_Contoller.getPairingDetails($rootScope.candidateId, $rootScope.campaignId, function (result, event) {
            if (event.status) {
                console.log('getPairingDetails result:', result);
                var listToUse = result;
                if (result != null && result.length > 0 && result[0].contact != null) {
                    listToUse = [];
                    for (var k = 0; k < result.length; k++) {
                        var contactData = result[k].contact;
                        var flat = {
                            Id: contactData.Id,
                            FirstName: contactData.FirstName,
                            LastName: contactData.LastName,
                            Email: contactData.Email,
                            MailingCountry: contactData.MailingCountry,
                            Birthdate: contactData.Birthdate,
                            AccountId: contactData.AccountId,
                            Is_Coordinator__c: result[k].isCoordinator
                        };
                        if (contactData.Account) {
                            flat.Account = {
                                Id: contactData.Account.Id || contactData.AccountId,
                                Name: contactData.Account.Name || ''
                            };
                        } else if (contactData.AccountId) {
                            flat.Account = {
                                Id: contactData.AccountId,
                                Name: ''
                            };
                        }
                        console.log('Flattened contact ' + k + ':', flat);
                        listToUse.push(flat);
                    }
                }
                if (listToUse != null) {
                    for (var i = 0; i < listToUse.length; i++) {
                        if (listToUse[i].Birthdate != null || listToUse[i].Birthdate != undefined) {
                            $scope.birthDatepresent[i] = true;
                            listToUse[i].Birthdate = new Date(listToUse[i].Birthdate);
                        } else {
                            $scope.birthDatepresent[i] = false;
                        }

                        if (listToUse[i].Account != undefined) {
                            if (listToUse[i].FirstName != undefined || listToUse[i].FirstName != '') {
                                listToUse[i].FirstName = listToUse[i].FirstName ? listToUse[i].FirstName.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : listToUse[i].FirstName;
                            }
                            if (listToUse[i].LastName != undefined || listToUse[i].LastName != '') {
                                listToUse[i].LastName = listToUse[i].LastName ? listToUse[i].LastName.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : listToUse[i].LastName;
                            }
                            if (listToUse[i].Account.Name != undefined || listToUse[i].Account.Name != '') {
                                listToUse[i].Account.Name = listToUse[i].Account.Name ? listToUse[i].Account.Name.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : listToUse[i].Account.Name;
                            }
                        }
                    }
                }
                debugger;

                if (listToUse == null || listToUse.length == 0) {
                    $scope.pairingDetails.push({
                        "FirstName": "",
                        "LastName": "",
                        "Email": "",
                        "Birthdate": "",
                        "MailingCountry": "",
                        "Campaign__c": $scope.campaigntype
                    });
                } else {
                    for (var i = 0; i < listToUse.length; i++) {
                        if (listToUse[i].Is_Coordinator__c == true) {
                            $scope.pairingDetails = listToUse[i];
                            if ($scope.pairingDetails.MailingCountry == "India") {
                                $scope.pairList.MailingCountry = "Germany";
                                $scope.country2 = "German";
                                $scope.country1 = "Indian";
                            } else {
                                $scope.pairList.MailingCountry = "India";
                                $scope.country2 = "Indian";
                                $scope.country1 = "German";
                            }
                        } else if (listToUse[i].Is_Coordinator__c == false) {
                            $scope.pairList = listToUse[i];
                            if ($scope.pairList.MailingCountry == "Germany") {
                                $scope.pairingDetails.MailingCountry = "India";
                                $scope.country1 = "Indian";
                                $scope.country2 = "German";
                            } else {
                                $scope.pairingDetails.MailingCountry = "Germany";
                                $scope.country1 = "German";
                                $scope.country2 = "Indian";
                            }
                        }
                    }
                }
                $scope.$apply();

            }
        }, {
            escape: true
        })
    }

    $scope.getPairingDetails();

    $scope.insertPairingDetails = function () {
        debugger;
        var IndianCount = 0;
        var GermanyCount = 0;
        $scope.detailedList = [];
        $scope.conList = [];

        // Trim email fields to remove whitespace
        if ($scope.pairingDetails && $scope.pairingDetails.Email) {
            $scope.pairingDetails.Email = $scope.pairingDetails.Email.trim();
        }
        if ($scope.pairList && $scope.pairList.Email) {
            $scope.pairList.Email = $scope.pairList.Email.trim();
        }

        // Debug: Log email values before pushing to detailedList
        console.log('pairingDetails.Email:', $scope.pairingDetails ? $scope.pairingDetails.Email : 'pairingDetails is undefined');
        console.log('pairList.Email:', $scope.pairList ? $scope.pairList.Email : 'pairList is undefined');

        $scope.detailedList.push($scope.pairingDetails, $scope.pairList);
        console.log('detailedList :: ' + JSON.stringify($scope.detailedList));

        /*  
       $scope.Pecfar_age_limit = $scope.pairingDetails.Proposals__r.yearly_Call__r.Pecfar_age_limit__c;
      $scope.Pecfar_DOB = new Date($scope.pairingDetails.Proposals__r.yearly_Call__r.Date_of_Birth_PECFAR__c);
      */
        var indianCampaignValidation = $scope.validateWithCampaign($scope.pairingDetails.Birthdate, true);
        var germanCampaignValidation = $scope.validateWithCampaign($scope.pairList.Birthdate, false);


        // for(var i=0;i<$scope.detailedList.length;i++){
        debugger;
        // if($scope.detailedList[i].MailingCountry == "India"){
        // IndianCount = IndianCount+1

        if ($scope.pairingDetails != undefined) {
            if ($scope.pairingDetails.FirstName == undefined || $scope.pairingDetails.FirstName == "") {
                swal("Info", "Please Enter First Name.");
                $("#txtIndFN").addClass('border-theme');
                return;
            }

            if ($scope.pairingDetails.LastName == undefined || $scope.pairingDetails.LastName == "") {
                swal("Info", "Please Enter Last Name.");
                $("#txtIndLN").addClass('border-theme');
                return;
            }

            if ($scope.pairingDetails.Email == undefined || $scope.pairingDetails.Email == "" || ($scope.pairingDetails.Email && $scope.pairingDetails.Email.trim() == "")) {
                swal("Info", "Please Enter Email.");
                $("#txtIndEmail").addClass('border-theme');
                return;
            } else {
                // Trim email before validation
                $scope.pairingDetails.Email = $scope.pairingDetails.Email.trim();
                if ($scope.valid($scope.pairingDetails.Email)) {
                    swal(
                        'Info',
                        'Check Your Registered Email.',
                        'info'
                    )
                    $("#txtIndEmail").addClass('border-theme');
                    return;
                }
            }

            if ($scope.pairingDetails.Account == undefined || $scope.pairingDetails.Account == "") {
                swal("Info", "Please Enter Institution / Organization Name.");
                $("#txtIndOrg").addClass('border-theme');
                return;
            }

            if ($scope.pairingDetails.Account != undefined) {
                if ($scope.pairingDetails.Account.Name == undefined) {
                    swal("Info", "Please Enter Institution / Organization Name.");
                    $("#txtIndOrg").addClass('border-theme');
                    return;
                }
            }

            if ($scope.pairingDetails.Birthdate == undefined || $scope.pairingDetails.Birthdate == "") {
                swal("Info", "Please Enter BirthDate.");
                $("#txtIndBD").addClass('border-theme');
                return;
            }



            if ($scope.emailCheck == true) {
                swal('Info', 'Email does not exists.', 'info');
                $("#txtIndEmail").addClass('border-theme');
                return;
            }
        }
        // }

        // if($scope.detailedList[i].MailingCountry == "Germany"){
        // GermanyCount = GermanyCount+1

        if ($scope.pairList != undefined) {
            if ($scope.pairList.FirstName == undefined || $scope.pairList.FirstName == "") {
                swal("Info", "Please Enter First Name.");
                $("#txtGerFN").addClass('border-theme');
                return;
            }

            if ($scope.pairList.LastName == undefined || $scope.pairList.LastName == "") {
                swal("Info", "Please Enter Last Name.");
                $("#txtGerLn").addClass('border-theme');
                return;
            }

            if ($scope.pairList.Email == undefined || $scope.pairList.Email == "" || ($scope.pairList.Email && $scope.pairList.Email.trim() == "")) {
                swal("Info", "Please Enter Email.");
                $("#txtGerEmail").addClass('border-theme');
                return;
            } else {
                // Trim email before validation
                $scope.pairList.Email = $scope.pairList.Email.trim();
                if ($scope.valid($scope.pairList.Email)) {
                    swal(
                        'Info',
                        'Check Your Registered Email.',
                        'info'
                    )
                    $("#txtGerEmail").addClass('border-theme');
                    return;
                }
            }

            if ($scope.pairList.Account == undefined || $scope.pairList.Account == "") {
                swal("Info", "Please Enter Institution / Organization Name.");
                $("#txtGerOrg").addClass('border-theme');
                return;
            }

            if ($scope.pairList.Account != undefined) {
                if ($scope.pairList.Account.Name == undefined) {
                    swal("Info", "Please Enter Institution / Organization Name.");
                    $("#txtGerOrg").addClass('border-theme');
                    return;
                }
            }

            if ($scope.pairList.Birthdate == undefined || $scope.pairList.Birthdate == "") {
                swal("Info", "Please Enter BirthDate.");
                $("#txtGerBD").addClass('border-theme');
                return;
            }

            if ($scope.emailCheck == true) {
                swal('Info', 'Email does not exists.', 'info');
                $("#txtGerEmail").addClass('border-theme');
                return;
            }
        }

        // }

        // }

        // if($scope.detailedList.length==2 && IndianCount>1){
        //     swal("Info", "Indian partner should be only one", "Info");
        //     $("#txtPincode").addClass('border-theme');
        //         return;
        //     }

        // if($scope.detailedList.length==2 && GermanyCount>1){
        //     swal("Info", "German partner should be only 1", "Info");
        //     $("#txtPincode").addClass('border-theme');
        //         return;
        //     }

        for (let i = 0; i < $scope.detailedList.length; i++) {
            delete ($scope.detailedList[i]['$$hashKey']);
            // Ensure email is trimmed and not null
            var emailValue = $scope.detailedList[i].Email ? $scope.detailedList[i].Email.trim() : '';
            var pairingObj = {
                "companyNmae": $scope.detailedList[i].Account.Name, "proposal": $rootScope.projectId, "accId": $scope.detailedList[i].AccountId, "birthyear": 0, "birthmonth": 0, "birthday": 0, cont: {
                    "FirstName": $scope.detailedList[i].FirstName, "LastName": $scope.detailedList[i].LastName, "Id": $scope.detailedList[i].Id, "Email": emailValue, "Campaign__c": $scope.campaigntype, "MailingCountry": $scope.detailedList[i].MailingCountry, AccountId: $scope.detailedList[i].AccountId, "Proposals__c": $rootScope.projectId
                }
            };
            pairingObj.companyNmae = $scope.detailedList[i].Account.Name;

            if ($scope.detailedList[i].Birthdate == undefined || $scope.detailedList[i].Birthdate == '') {
                delete ($scope.detailedList[i].Birthdate);
            } else if ($scope.detailedList[i].Birthdate != undefined || $scope.detailedList[i].Birthdate != "") {
                pairingObj.birthyear = $scope.detailedList[i].Birthdate.getUTCFullYear();
                //pairingObj.birthmonth = $scope.detailedList[i].Birthdate.getUTCMonth()+1;
                pairingObj.birthmonth = $scope.birthDatepresent[i] ? $scope.detailedList[i].Birthdate.getUTCMonth() + 1 : $scope.detailedList[i].Birthdate.getUTCMonth() + 2;
                pairingObj.birthday = $scope.detailedList[i].Birthdate.getDate();

                var deadline = moment($scope.endDate);
                var BDate = moment($scope.detailedList[i].Birthdate);
                var years = deadline.diff(BDate, 'days');

                let date1 = new Date($scope.detailedList[i].Birthdate).getTime();
                let date2 = new Date($scope.Pecfar_DOB).getTime();

                if ($scope.detailedList[i].Is_Coordinator__c == true) {

                    //if(years >  ($scope.Pecfar_age_limit * 365)){
                    if (date1 < date2) {
                        swal("Pairing Detail", "Age can not be more than " + $scope.Pecfar_age_limit + " years", "info");
                        $("#txtIndBD").addClass('border-theme');
                        return;
                    }
                    if (years < 7305) {
                        swal("Pairing Detail", "Age can not be less than 20 years", "info");
                        $("#txtIndBD").addClass('border-theme');
                        return;
                    }
                } else {
                    var age = moment().diff('' + pairingObj.birthyear + '-' + pairingObj.birthmonth + '-' + pairingObj.birthday + '', 'years');
                    //if(years > ($scope.Pecfar_age_limit * 365)){
                    if (date1 < date2) {
                        swal("Pairing Detail", "Age can not be more than " + $scope.Pecfar_age_limit + " years", "info");
                        $("#txtGerBD").addClass('border-theme');
                        return;
                    } else if (years < 7305) {
                        swal("Pairing Detail", "Age can not be less than 20 years", "info");
                        $("#txtGerBD").addClass('border-theme');
                        return;
                    }
                }

                // if($scope.detailedList[i].Is_Primary__c == false || $scope.detailedList[i].Is_Primary__c == undefined){

                // }
            }
            $scope.conList.push(pairingObj);

        }

        for (var i = 0; i < $scope.detailedList.length; i++) {
            // delete ($scope.detailedList[i].Birthdate);
        }

        // for(let i=0; i<$scope.pairingDetails.length; i++){

        //     if($scope.pairingDetails[i].MailingCountry == "India"){
        //         IndianCount = IndianCount+1
        //     }

        //     if($scope.pairingDetails[i].MailingCountry == "Germany"){
        //         GermanyCount = GermanyCount+1
        //     }

        //     if($scope.pairingDetails[i].FirstName == undefined || $scope.pairingDetails[i].FirstName == ""){
        //         swal("Pairing Detail", "Please Enter First Name!");
        //           return;
        //     }

        //     if($scope.pairingDetails[i].LastName == undefined || $scope.pairingDetails[i].LastName == ""){
        //         swal("Pairing Detail", "Please Enter Last Name!");
        //           return;
        //     }

        //     if($scope.pairingDetails[i].Email == undefined || $scope.pairingDetails[i].Email == ""){
        //         swal("Pairing Detail", "Please Enter Email!");
        //           return;
        //     }else{
        //         if($scope.valid($scope.pairingDetails[i].Email)){
        //             swal(
        //                 'info',
        //                 'Check Your Registered Email!',
        //                 'info'
        //             )
        //             return;
        //         }
        //     }

        //     if($scope.pairingDetails[i].Account.Name == undefined || $scope.pairingDetails[i].Account.Name == ""){
        //         swal("Pairing Detail", "Please Enter Company Name!");
        //           return;
        //     }

        //     if($scope.pairingDetails[i].Birthdate == undefined || $scope.pairingDetails[i].Birthdate == ""){
        //         swal("Pairing Detail", "Please Enter BirthDate!");
        //           return;
        //     }

        //     if($scope.pairingDetails[i].MailingCountry == undefined || $scope.pairingDetails[i].MailingCountry == ""){
        //         swal("Pairing Detail", "Please Enter Country!");
        //           return;
        //     }
        // }

        // if($scope.emailCheck == true){
        //     swal('info','Email already exists.','info');
        //         return;
        // }

        // if($scope.pairingDetails.length==2 && IndianCount>1){
        //     swal("Pairing Detail", "Indian partner should be only one", "info");
        //         return;
        //     }

        // if($scope.pairingDetails.length==2 && GermanyCount>1){
        //     swal("Pairing Detail", "German partner should be only 1", "info");
        //         return;
        //     }

        // for(let i=0; i<$scope.pairingDetails.length; i++){
        //     delete ($scope.pairingDetails[i]['$$hashKey']);

        //     var pairingObj = {"companyNmae":$scope.pairingDetails[i].Account.Name,"proposal":$rootScope.projectId,"accId":$scope.pairingDetails[i].AccountId,"birthyear":0,"birthmonth":0,"birthday":0,cont:{
        //         "FirstName":$scope.pairingDetails[i].FirstName,"LastName":$scope.pairingDetails[i].LastName,"Id":$scope.pairingDetails[i].Id,"Email":$scope.pairingDetails[i].Email,"Campaign__c":$scope.campaigntype,"MailingCountry":$scope.pairingDetails[i].MailingCountry,AccountId:$scope.pairingDetails[i].AccountId,"Proposals__c":$rootScope.projectId
        //     }};
        //     pairingObj.companyNmae = $scope.pairingDetails[i].Account.Name;
        //     $scope.detailedList.push(pairingObj);

        //     if($scope.pairingDetails[i].Birthdate == undefined || $scope.pairingDetails[i].Birthdate == ''){
        //         delete ($scope.pairingDetails[i].Birthdate);
        //     }else if($scope.pairingDetails[i].Birthdate != undefined || $scope.pairingDetails[i].Birthdate != ""){
        //         pairingObj.birthyear = $scope.pairingDetails[i].Birthdate.getUTCFullYear();
        //         pairingObj.birthmonth = $scope.pairingDetails[i].Birthdate.getUTCMonth()+1;
        //         pairingObj.birthday = $scope.pairingDetails[i].Birthdate.getDate();

        //         var age = moment().diff(''+pairingObj.birthyear+'-'+pairingObj.birthmonth+'-'+pairingObj.birthday+'', 'years');
        //         if(age>35){
        //             swal("Pairing Detail", "Age can not be more than 35 years", "info");
        //             return;
        //         }else if(age<20){
        //             swal("Pairing Detail", "Age can not be less than 20 years", "info");
        //             return;
        //           }
        //     }

        //     delete ($scope.pairingDetails[i].Birthdate);
        // }
        // 
		 $("#btnPairSave")
        .html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Please wait...')
        .prop("disabled", true);
        ApplicantPortal_Contoller.insertPairingDetails
            ($scope.conList, $rootScope.campaignId, $rootScope.yearlyCallId, $rootScope.contactId, $rootScope.proposalId, function (result, event) {
                if (event.status) {
                    debugger;
                    // Saving the ProposalId in Local Storage
                    localStorage.setItem('proposalId', result.proposalId);
                    // Only save apaId if apa is not null
                    if (result.apa && result.apa.Id) {
                        localStorage.setItem('apaId', result.apa.Id);
                    }
                    $("#btnPairSave")
                	.html('<i class="fa-solid fa-check me-2"></i>Save and Next')
                	.prop("disabled", false);
                    swal({
                        title: "Pairing Details",
                        text: 'Pairing details have been successfully saved.',
                        icon: "success",
                        button: "ok!",
                    }).then((value) => {
                        $scope.getPairingDetails();
                        $scope.redirectPageURL('Personal_Information');
                    });
                    //  Swal.fire(
                    //      'Success',
                    //      'Pairing detail has been saved successfully.',
                    //      'success'
                    //  );
                    // $scope.redirectPageURL('Personal_Information');
                    $scope.$apply();
                }
                else {
                    $("#btnPairSave")
                	.html('<i class="fa-solid fa-check me-2"></i>Save and Next')
                	.prop("disabled", false);
                    swal({
                        title: "Pairing Details",
                        text: "Exception!",
                        icon: "error",
                        button: "ok!",
                    });
                }
            },
                { escape: true }
            )
    }
    $scope.redirectToApplicantPortal = function () {
        // window.location.href = 'https://indo-germansciencetechnologycentre--uatdev.sandbox.my.salesforce-sites.com/ApplicantDashboard/ApplicantPortal?id=%27 + $rootScope.candidateId'
        // window.location.href = 'https://indo-germansciencetechnologycentre--uatdev.sandbox.my.salesforce-sites.com/ApplicantDashboard/ApplicantPortal?id=' + $rootScope.candidateId;
        window.location.href = 'https://indo-germansciencetechnologycentre.my.salesforce-sites.com/ApplicantDashboard/ApplicantPortal?id=' + $rootScope.candidateId;
    };

    $scope.addParticipant = function () {
        debugger;
        if ($scope.pairingDetails.length > 1) {
            swal("Max Account Limit", "You can add only 1 pair.")
        }
        else {
            $scope.pairingDetails.push({
                "companyNmae": "",
                "Proposals__c": $rootScope.projectId,
                cont: {
                    "FirstName": "", "LastName": "", "Email": "", "MailingCountry": "", "Campaign__c": $scope.campaigntype, "Proposals__c": $rootScope.projectId
                }
            });
        }
        if ($scope.pairingDetails.length > 2) {
            $scope.disableAddButton = true;
        }
    }

    $scope.redirectPageURL = function (pageName) {
        debugger;
        var link = document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href = "#/" + pageName;
        link.click();
    }

    $scope.valid = function (value) {
        if (value != undefined) {
            var x = value;
            var atpos = x.indexOf("@");
            var dotpos = x.lastIndexOf(".");
            if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {

                return true;
            }
            return false;
        }
    }

    $scope.removeClass = function (controlid) {
        $("#" + controlid + "").removeClass('border-theme');
    }
});