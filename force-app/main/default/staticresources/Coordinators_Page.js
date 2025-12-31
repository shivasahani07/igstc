angular.module('cp_app').controller('coordinators_ctrl', function ($scope, $rootScope) {
    debugger;

    $rootScope.projectId;
    $scope.siteURL = siteURL;
    $scope.countrytype = countrytype;
    $scope.allCoordinatorDetails = [];
    $scope.signleCoordinatorDetails = {};
    $scope.disableAddButton = false;
    $scope.disableSubmit = false;
    $scope.listOfIds = [];
    $rootScope.proposalId;
    $rootScope.apaId;
    $rootScope.campaignId;
    $rootScope.yearlyCallId;

    // Get proposalId from LocalStorage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }

    // Get yearlyCallId from LocalStorage
    if (localStorage.getItem('yearlyCallId')) {
        $rootScope.yearlyCallId = localStorage.getItem('yearlyCallId');
        console.log('Loaded yearlyCallId from localStorage:', $rootScope.yearlyCallId);
    }
    $scope.redirectToApplicantPortal = function () {
        window.location.href = 'https://indo-germansciencetechnologycentre--newdevutil.sandbox.my.salesforce-sites.com/ApplicantDashboard/ApplicantPortal?id=' + $rootScope.candidateId;
    }
    // $scope.checkEmail = function(email,contId){
    //     debugger;
    //     $scope.emailCheck = false;
    //     if(contId == undefined){
    //       contId = "";
    //     }
    //     WorkshopController.checkEmail(email,contId,function(result,event){
    //       debugger;
    //       if(event.status){
    //         debugger;
    //         if(result.length > 0){
    //           $scope.emailCheck = true;
    //         }else{
    //           $scope.emailCheck = false;
    //         }
    //         $scope.$apply();
    //       }
    //     })

    //   }

    $scope.getDependentPicklistValues = function () {
        debugger;
        $scope.indianStates = [];
        $scope.germanStates = [];
        WorkshopController.getFieldDependencies('Contact', 'Country__c', 'States__c', function (result, event) {
            debugger;
            if (event.status && result != null) {
                debugger;
                for (var i = 0; i < result.India.length; i++) {
                    //$scope.indianStates = result.India;
                    result.India[i] = result.India[i].replaceAll('&amp;', '&');
                    console.log('1=>' + result.India[34].replaceAll('&amp;', '&'));
                    console.log('1=>' + result.India[i]);
                }
                $scope.indianStates = result.India;
                $scope.germanStates = result.Germany;
                $scope.allStates = result.India.concat(result.Germany);
                $scope.$apply();
            }
        }
        )
    }
    $scope.getDependentPicklistValues();

    $scope.getcampaigntype = function () {
        debugger;
        $scope.primary = false;
        WorkshopController.getcampaigntype($rootScope.candidateId, function (result, event) {
            debugger;
            if (event.status && result != null) {
                debugger;
                $scope.campaigntype = result.Campaign__c;
                if (result.Is_Primary__c == true) {
                    $scope.primary = false;
                } else {
                    $scope.primary = true;
                }
                $scope.$apply();
            }
        })
    }
    $scope.getcampaigntype();

    // NEW CODE
    $scope.getPatnerDetails = function () {
        debugger;
        $scope.allCoordinatorDetails = [];
        WorkshopController.getPatnerDetails3($rootScope.candidateId, $rootScope.proposalId, function (result, event) {
            if (event.status) {
                debugger;

                if (result == null || result.length == 0) {
                    $scope.allCoordinatorDetails.push({
                        "Name": " ",
                        "Phone": " ",
                        "Contacts": [{ "LastName": "", "Campaign__c": $scope.campaigntype, "Proposals__c": $rootScope.projectId }],
                        "Proposals__c": $rootScope.projectId
                    });
                } else {

                    $scope.allCoordinatorDetails = result;

                    for (var i = 0; i < result.length; i++) {
                        if (result[i].Contacts[0].FirstName != undefined || result[i].Contacts[0].FirstName != '') {
                            $scope.allCoordinatorDetails[i].Contacts[0].FirstName = result[i].Contacts[0].FirstName ? result[i].Contacts[0].FirstName.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].Contacts[0].FirstName;
                        }
                        if (result[i].Contacts[0].LastName != undefined || result[i].Contacts[0].LastName != '') {
                            $scope.allCoordinatorDetails[i].Contacts[0].LastName = result[i].Contacts[0].LastName ? result[i].Contacts[0].LastName.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].Contacts[0].LastName;
                        }
                        if (result[i].Contacts[0].Department != undefined || result[i].Contacts[0].Department != '') {
                            $scope.allCoordinatorDetails[i].Contacts[0].Department = result[i].Contacts[0].Department ? result[i].Contacts[0].Department.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].Contacts[0].Department;
                        }
                        if (result[i].Name != undefined || result[i].Name != '') {
                            $scope.allCoordinatorDetails[i].Name = result[i].Name ? result[i].Name.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].Name;
                        }
                        if (result[i].Homepage_URL__c != undefined || result[i].Homepage_URL__c != '') {
                            $scope.allCoordinatorDetails[i].Homepage_URL__c = result[i].Homepage_URL__c ? result[i].Homepage_URL__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].Homepage_URL__c;
                        }
                        if (result[i].BillingStreet != undefined || result[i].BillingStreet != '') {
                            $scope.allCoordinatorDetails[i].BillingStreet = result[i].BillingStreet ? result[i].BillingStreet.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].BillingStreet;
                        }
                        if (result[i].BillingCity != undefined || result[i].BillingCity != '') {
                            $scope.allCoordinatorDetails[i].BillingCity = result[i].BillingCity ? result[i].BillingCity.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].BillingCity;
                        }
                        if (result[i].BillingState != undefined && result[i].BillingState != '') {
                            $scope.allCoordinatorDetails[i].BillingState = result[i].BillingState ? result[i].BillingState.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].BillingState;
                        }
                    }

                    for (var i = 0; i < $scope.allCoordinatorDetails.length; i++) {

                        if ($scope.allCoordinatorDetails[i].BillingStreet != undefined && $scope.allCoordinatorDetails[i].BillingStreet != "") {
                            splitStreet = $scope.allCoordinatorDetails[i].BillingStreet.split(",");
                            $scope.allCoordinatorDetails[i].BillingStreet1 = splitStreet[0];
                            $scope.allCoordinatorDetails[i].BillingStreet2 = splitStreet[1];
                        }

                    }
                }
                for (var i = 0; i < $scope.allCoordinatorDetails.length; i++) {
                    if ($scope.allCoordinatorDetails[i].BillingCountry == 'India') {
                        $scope.allCoordinatorDetails[i].stateList = $scope.indianStates;
                    } else if ($scope.allCoordinatorDetails[i].BillingCountry == 'Germany') {
                        $scope.allCoordinatorDetails[i].stateList = $scope.germanStates;
                    }
                }
                $scope.$apply();
                $("#panelsStayOpencollapse1,#panelsStayOpencollapse2,#panelsStayOpencollapse3,#panelsStayOpencollapse4,#panelsStayOpencollapse5").removeClass();
                $("#panelsStayOpencollapse1,#panelsStayOpencollapse2,#panelsStayOpencollapse3,#panelsStayOpencollapse4,#panelsStayOpencollapse5").addClass('accordion-collapse collapse');

            }
        }, {
            escape: true
        })
    }
    $scope.getPatnerDetails();

    // OLD CODE
    /*
    $scope.getPatnerDetails = function () {
        debugger;
        $scope.allCoordinatorDetails = [];
        WorkshopController.getPatnerDetails2($rootScope.candidateId, function (result, event) {
            if (event.status) {
                debugger;

                if (result == null || result.length == 0) {
                    $scope.allCoordinatorDetails.push({
                        "Name": " ",
                        "Phone": " ",
                        "Contacts": [{ "LastName": "", "Campaign__c": $scope.campaigntype, "Proposals__c": $rootScope.projectId }],
                        "Proposals__c": $rootScope.projectId
                    });
                } else {

                    $scope.allCoordinatorDetails = result;

                    for (var i = 0; i < result.length; i++) {
                        if (result[i].Contacts[0].FirstName != undefined || result[i].Contacts[0].FirstName != '') {
                            $scope.allCoordinatorDetails[i].Contacts[0].FirstName = result[i].Contacts[0].FirstName ? result[i].Contacts[0].FirstName.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].Contacts[0].FirstName;
                        }
                        if (result[i].Contacts[0].LastName != undefined || result[i].Contacts[0].LastName != '') {
                            $scope.allCoordinatorDetails[i].Contacts[0].LastName = result[i].Contacts[0].LastName ? result[i].Contacts[0].LastName.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].Contacts[0].LastName;
                        }
                        if (result[i].Contacts[0].Department != undefined || result[i].Contacts[0].Department != '') {
                            $scope.allCoordinatorDetails[i].Contacts[0].Department = result[i].Contacts[0].Department ? result[i].Contacts[0].Department.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].Contacts[0].Department;
                        }
                        if (result[i].Name != undefined || result[i].Name != '') {
                            $scope.allCoordinatorDetails[i].Name = result[i].Name ? result[i].Name.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].Name;
                        }
                        if (result[i].Homepage_URL__c != undefined || result[i].Homepage_URL__c != '') {
                            $scope.allCoordinatorDetails[i].Homepage_URL__c = result[i].Homepage_URL__c ? result[i].Homepage_URL__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].Homepage_URL__c;
                        }
                        if (result[i].BillingStreet != undefined || result[i].BillingStreet != '') {
                            $scope.allCoordinatorDetails[i].BillingStreet = result[i].BillingStreet ? result[i].BillingStreet.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].BillingStreet;
                        }
                        if (result[i].BillingCity != undefined || result[i].BillingCity != '') {
                            $scope.allCoordinatorDetails[i].BillingCity = result[i].BillingCity ? result[i].BillingCity.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&') : result[i].BillingCity;
                        }
                    }

                    for (var i = 0; i < $scope.allCoordinatorDetails.length; i++) {

                        if ($scope.allCoordinatorDetails[i].BillingStreet != undefined && $scope.allCoordinatorDetails[i].BillingStreet != "") {
                            splitStreet = $scope.allCoordinatorDetails[i].BillingStreet.split(",");
                            $scope.allCoordinatorDetails[i].BillingStreet1 = splitStreet[0];
                            $scope.allCoordinatorDetails[i].BillingStreet2 = splitStreet[1];
                        }

                    }
                }
                for (var i = 0; i < $scope.allCoordinatorDetails.length; i++) {
                    if ($scope.allCoordinatorDetails[i].BillingCountry == 'India') {
                        $scope.allCoordinatorDetails[i].stateList = $scope.indianStates;
                    } else if ($scope.allCoordinatorDetails[i].BillingCountry == 'Germany') {
                        $scope.allCoordinatorDetails[i].stateList = $scope.germanStates;
                    }
                }
                $scope.$apply();
                $("#panelsStayOpencollapse1,#panelsStayOpencollapse2,#panelsStayOpencollapse3,#panelsStayOpencollapse4,#panelsStayOpencollapse5").removeClass();
                $("#panelsStayOpencollapse1,#panelsStayOpencollapse2,#panelsStayOpencollapse3,#panelsStayOpencollapse4,#panelsStayOpencollapse5").addClass('accordion-collapse collapse');

            }
        }, {
            escape: true
        })
    }
    $scope.getPatnerDetails();
    */

    $scope.addAccount = function () {
        debugger;
        if ($scope.allCoordinatorDetails.length > 1) {
            swal("Max Account Limit", "You can add only 2 Accounts.")
        }
        else {
            $scope.allCoordinatorDetails.push({
                "Name": "",
                "Academia__c": true,
                "Industry__c": false,
                "Contacts": [{ "LastName": "", "Campaign__c": $scope.campaigntype }],
                "Proposals__c": $rootScope.projectId
            });
        }
        if ($scope.allCoordinatorDetails.length > 1) {
            $scope.disableAddButton = true;
        }
    }

    $scope.industryAcademia = function (industryType, index) {
        debugger
        if (industryType == "academia") {
            $scope.allCoordinatorDetails[index].Industry__c = false;
            $scope.allCoordinatorDetails[index].Academia__c = true;
        } else {
            $scope.allCoordinatorDetails[index].Industry__c = true;
            $scope.allCoordinatorDetails[index].Academia__c = false;
        }
        $scope.$apply();
    }

    $scope.onchangeFuc = function () {
        for (let i = 0; i < $scope.allCoordinatorDetails.length; i++) {
            $scope.allCoordinatorDetails[i].BillingCountry = $scope.allCoordinatorDetails[i].Country_Type__c;
        }
    }

    $scope.submitDetails = function () {
        debugger;
        var IndianCount = 0;
        var GermanyCount = 0;

        for (let i = 0; i < $scope.allCoordinatorDetails.length; i++) {
            delete ($scope.allCoordinatorDetails[i]['$$hashKey']);
        }
        if ($scope.allCoordinatorDetails.length < 2) {
            swal("Max Account Limit", "Add one more account for Coordinator 2.");
            return;
        }

        for (i = 0; i < $scope.allCoordinatorDetails.length; i++) {

            if ($scope.allCoordinatorDetails[i].Academia__c == false && $scope.allCoordinatorDetails[i].Industry__c == false) {
                swal("Coordinator Details", "Please Select either Academia or Industry.");
                return;
            }

            if ($scope.allCoordinatorDetails[i].Contacts != undefined) {
                for (var j = 0; j < $scope.allCoordinatorDetails[i].Contacts.length; j++) {
                    if ($scope.allCoordinatorDetails[i].Contacts[j].FirstName == undefined || $scope.allCoordinatorDetails[i].Contacts[j].FirstName == "") {
                        swal("Coordinator Details", "Please Enter First Name.");
                        $("#fn" + i + "").addClass('border-theme');
                        return;
                    }
                    if ($scope.allCoordinatorDetails[i].Contacts[j].LastName == undefined || $scope.allCoordinatorDetails[i].Contacts[j].LastName == "") {
                        swal("Coordinator Details", "Please Enter Last Name.");
                        $("#ln" + i + "").addClass('border-theme');
                        return;
                    }
                    if ($scope.allCoordinatorDetails[i].Contacts[j].Department == undefined || $scope.allCoordinatorDetails[i].Contacts[j].Department == "") {
                        swal("Coordinator Details", "Please Enter Department.");
                        $("#dept" + i + "").addClass('border-theme');
                        return;
                    }
                    if ($scope.allCoordinatorDetails[i].Contacts[j].Email == undefined || $scope.allCoordinatorDetails[i].Contacts[j].Email == "") {
                        swal("Coordinator Details", "Please Enter Email.");
                        $("#email" + i + "").addClass('border-theme');
                        return;
                    } else {
                        if ($scope.valid($scope.allCoordinatorDetails[i].Contacts[j].Email)) {
                            swal(
                                'info',
                                'Check Your Registered Email.',
                                'info'
                            );
                            $("#email" + i + "").addClass('border-theme');
                            return;
                        }
                    }
                    if ($scope.allCoordinatorDetails[i].Contacts[j].Phone == undefined || $scope.allCoordinatorDetails[i].Contacts[j].Phone == "") {
                        swal("Coordinator Details", "Please Enter Phone.");
                        $("#phone" + i + "").addClass('border-theme');
                        return;
                    }
                }
            }

            if ($scope.allCoordinatorDetails[i].Name == undefined || $scope.allCoordinatorDetails[i].Name == "") {
                swal("Coordinator Details", "Please Enter Institution/Industry Name.");
                $("#inst" + i + "").addClass('border-theme');
                return;
            }

            if ($scope.allCoordinatorDetails[i].Homepage_URL__c == undefined || $scope.allCoordinatorDetails[i].Homepage_URL__c == "") {
                swal("Coordinator Details", "Please Enter Homepage URL.");
                $("#homePage" + i + "").addClass('border-theme');
                return;
            }

            if ($scope.allCoordinatorDetails[i].BillingCountry == "India") {
                IndianCount = IndianCount + 1
            }

            if ($scope.allCoordinatorDetails[i].BillingCountry == "Germany") {
                GermanyCount = GermanyCount + 1
            }

            if ($scope.allCoordinatorDetails[i].Contacts != undefined) {
                $scope.allCoordinatorDetails[i].Contacts[0].Proposals__c = $rootScope.projectId;
            }
            if ($scope.allCoordinatorDetails[i].Id == undefined || $scope.allCoordinatorDetails.Id == "") {
                if ($scope.allCoordinatorDetails[i].Contacts != undefined) {
                    $scope.allCoordinatorDetails[i].Contacts[0].AccountId = $scope.allCoordinatorDetails[i].Name;
                }
            }

            if ($scope.allCoordinatorDetails[i].BillingCountry == undefined || $scope.allCoordinatorDetails[i].BillingCountry == "") {
                swal("Coordinator Details", "Please select Country.");
                $("#country" + i + "").addClass('border-theme');
                return;
            }
        }

        if ($scope.allCoordinatorDetails.length == 2 && IndianCount > 1) {
            swal("info!", "Indian partner should be only one", "info");
            return;
        }

        if ($scope.allCoordinatorDetails.length == 2 && GermanyCount > 1) {
            swal("info!", "German partner should be only 1", "info");
            return;
        }

        $scope.contactList = [];
        for (var i = 0; i < $scope.allCoordinatorDetails.length; i++) {
            $scope.allCoordinatorDetails[i].BillingStreet = $scope.allCoordinatorDetails[i].BillingStreet1 + ',' + $scope.allCoordinatorDetails[i].BillingStreet2;
            if ($scope.allCoordinatorDetails[i].Contacts != undefined) {
                $scope.contactList.push($scope.allCoordinatorDetails[i].Contacts[0]);
            }
            debugger;
        }

        for (let i = 0; i < $scope.allCoordinatorDetails.length; i++) {
            delete ($scope.allCoordinatorDetails[i]['Contacts']);
            delete ($scope.allCoordinatorDetails[i]['stateList']);
            delete ($scope.allCoordinatorDetails[i]['BillingStreet1']);
            delete ($scope.allCoordinatorDetails[i]['BillingStreet2']);
            // delete ($scope.allCoordinatorDetails[i]['Shipping_State__c']);

            $scope.allCoordinatorDetails[i]['Shipping_State__c'] = $scope.allCoordinatorDetails[i]['BillingState'];
            $scope.allCoordinatorDetails[i].BillingState = $scope.allCoordinatorDetails[i].BillingState;
        }

        console.log('$scope.allCoordinatorDetails::' + $scope.allCoordinatorDetails);
        $scope.tempAccList = $scope.allCoordinatorDetails;

        let accPayload = [];

        angular.forEach($scope.allCoordinatorDetails, function (uiAcc) {
            accPayload.push({
                Id: uiAcc.Id,
                Name: uiAcc.Name,
                BillingCountry: uiAcc.BillingCountry,
                BillingCity: uiAcc.BillingCity,
                BillingStreet: uiAcc.BillingStreet,
                BillingPostalCode: uiAcc.BillingPostalCode,
                BillingState:
                    (uiAcc.BillingState && uiAcc.BillingState !== 'null')
                        ? uiAcc.BillingState
                        : null,
                Shipping_State__c: uiAcc.Shipping_State__c,
                Homepage_URL__c: uiAcc.Homepage_URL__c,
                RecordTypeId: uiAcc.RecordTypeId,
                Academia__c: uiAcc.Academia__c === true,
                Industry__c: uiAcc.Industry__c === true
            });
        });

        // WorkshopController.insertCoordinatorsInformation2(
        //     accPayload,
        //     $scope.contactList,
        //     $rootScope.proposalId,
        //     $rootScope.yearlyCallId,
        //     callback
        // );


        WorkshopController.insertCoordinatorsInformation2(accPayload, $scope.contactList, $rootScope.proposalId, $rootScope.yearlyCallId, function (result, event) {
            console.log('*************RESULT************* : ', result);
            debugger;

            // Saving the ProposalId & APA Id in Local Storage
            if (result.proposalId) {
                localStorage.setItem('proposalId', result.proposalId);
                $rootScope.proposalId = result.proposalId;
            }

            if (result.apa && result.apa.Id) {
                localStorage.setItem('apaId', result.apa.Id);
                $rootScope.apaId = result.apa.Id;
            }

            if (event.status) {
                debugger;
                Swal.fire(
                    'Success',
                    'Co-Ordinators details have been saved successfully.',
                    'success'
                );
                $scope.disableSubmit = true;
                $scope.redirectPageURL('BasicDetails_Page');
                $scope.accList = result;
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }


    /*
    $scope.checkEmail = function () {
        $scope.emailList = [];
        debugger;
        $scope.emailCheck = false;


        for (var i = 0; i < $scope.allCoordinatorDetails.length; i++) {
            if ($scope.allCoordinatorDetails[i].Contacts != undefined) {
                if ($scope.emailList.indexOf($scope.allCoordinatorDetails[i].Contacts[0].Email) != -1) {
                    swal("info", "DUPLICATE Email, Please check.", "info");
                    return;
                }
                else {
                    $scope.emailList.push($scope.allCoordinatorDetails[i].Contacts[0].Email);
                }
                if ($scope.allCoordinatorDetails[i].Contacts[0].Id != undefined) {
                    $scope.listOfIds.push($scope.allCoordinatorDetails[i].Contacts[0].Id);
                }
            }
        }

        WorkshopController.checkBulkEmail($scope.emailList, $scope.listOfIds, function (result, event) {
            debugger;
            debugger;
            if (event.status) {
                debugger;
                if (result.length > 0) {
                    $scope.emailCheck = true;
                } else {
                    $scope.emailCheck = false;
                }
                $scope.submitDetails();
                $scope.$apply();
            }
        })
    }
    */

    $scope.onEmailChange = function (email, index) {
        debugger;
        if (!email) return;

        WorkshopController.checkBulkEmail2(email, function (result, event) {

            if (event.status && result && result.length > 0) {

                var con = result[0];
                var uiAcc = $scope.allCoordinatorDetails[index];
                var uiCon = uiAcc.Contacts[0];

                // ---------------- CONTACT ----------------
                uiCon.Salutation = con.Salutation;
                uiCon.Id = con.Id;
                uiCon.FirstName = con.FirstName || '';
                uiCon.LastName = con.LastName || '';
                uiCon.Phone = con.Phone || '';
                uiCon.Department = con.Department || '';
                uiCon.Email = con.Email || '';
                uiCon.AccountId = con.AccountId;

                // ---------------- ACCOUNT ----------------
                if (con.Account) {

                    uiAcc.Id = con.AccountId;
                    uiAcc.Name = con.Account.Name || '';
                    uiAcc.Homepage_URL__c = con.Account.Homepage_URL__c || '';

                    uiAcc.BillingCity = con.Account.BillingCity || '';
                    uiAcc.BillingState = con.Account.BillingState || '';
                    uiAcc.BillingCountry = con.Account.BillingCountry || '';
                    uiAcc.BillingPostalCode = con.Account.BillingPostalCode || '';

                    // UI expects Street1 & Street2
                    if (con.Account.BillingStreet) {
                        let parts = con.Account.BillingStreet.split(',');
                        uiAcc.BillingStreet1 = parts[0] || '';
                        uiAcc.BillingStreet2 = parts[1] || '';
                    }
                }

                $scope.emailCheck = true;

                $scope.$applyAsync();
            }
        });
    };





    $scope.validurl = function (value) {
        if (value != undefined) {
            var x = value;
            var atpos = x.indexOf("www.");
            var dotpos = x.lastIndexOf(".");
            if (atpos > 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {

                return true;
            }
            return false;
        }
    }

    $scope.redirectPageURL = function (pageName) {
        debugger;
        var link = document.createElement("a");
        link.id = 'someLink'; //give it an ID!
        link.href = "#/" + pageName;
        link.click();
    }

    $scope.onCountryChange = function (index) {
        debugger;
        if ($scope.allCoordinatorDetails[index].BillingCountry == 'India') {
            $scope.allCoordinatorDetails[index].stateList = $scope.indianStates;
        } else if ($scope.allCoordinatorDetails[index].BillingCountry == 'Germany') {
            $scope.allCoordinatorDetails[index].stateList = $scope.germanStates;
        }
        $scope.$apply();
    }

    $scope.removeClass = function (controlid, index) {
        var controlIdfor = controlid + "" + index;
        $("#" + controlIdfor + "").removeClass('border-theme');
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

    $scope.validurl = function (value) {
        if (value != undefined) {
            var x = value;
            var atpos = x.indexOf("www.");
            var dotpos = x.lastIndexOf(".");
            if (atpos > 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {

                return true;
            }
            return false;
        }
    }
});