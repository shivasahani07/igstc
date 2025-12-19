angular.module('cp_app').controller('CV_Ctrl', function ($scope, $rootScope) {
    debugger;

    $rootScope.proposalId;
    $rootScope.apaList;
    ;
    // Fetching the proposalId from Local Storage
    if (localStorage.getItem('proposalId')) {
        $rootScope.proposalId = localStorage.getItem('proposalId');
        console.log('Loaded proposalId from localStorage:', $rootScope.proposalId);
    }

    // Fetching the APA Id from Local Storage
    if (localStorage.getItem('apaId')) {
        $rootScope.apaId = localStorage.getItem('apaId');
        console.log('Loaded apaId from localStorage:', $rootScope.apaId);
    }

    $scope.siteURL = siteURL;
    $scope.AccountContactData = [];
    $scope.getDependentPicklistValues = function () {
        debugger;
        $scope.indianStates = [];
        $scope.germanStates = [];

        // ApplicantPortal_Contoller.getFieldDependencies('Contact', 'Country__c', 'States__c', function (result, event) {
        WorkshopController.getFieldDependencies('Contact', 'Country__c', 'States__c', function (result, event) {
            debugger;
            if (event.status && result != null) {
                debugger;
                for (var i = 0; i < result.India.length; i++) {
                    result.India[i] = result.India[i].replaceAll('&amp;', '&');
                }
                $scope.indianStates = result.India;
                $scope.germanStates = result.Germany;
                debugger;
                $scope.$apply();
            }
        }
        )
    }
    $scope.getDependentPicklistValues();

    $scope.checkEmail = function (email, contId) {
        debugger;
        $scope.emailCheck = false;
        if (contId == undefined) {
            contId = "";
        }
        // ApplicantPortal_Contoller.checkEmail(email, contId, function (result, event) {
        WorkshopController.checkEmail(email, contId, function (result, event) {
            debugger;
            if (event.status) {
                debugger;
                if (result.length > 0) {
                    $scope.emailCheck = true;
                } else {
                    $scope.emailCheck = false;
                }
                $scope.$apply();
            }
        })

    }

    $scope.backComp = function (GrandIndex, index) {
        debugger
        $("#educationDet" + GrandIndex + "" + index + "").hide();
        $("#contactBasicDet" + GrandIndex + "" + index + "").show();
    }

    $scope.updateContactDet = function (parentIndex, index) {
        for (var i = 0; i < $scope.AccountContactData[parentIndex].Lcon.length; i++) {
            $('#contactBasicDet' + parentIndex + '' + i + '').hide('slow');
            $('#educationDet' + parentIndex + '' + i + '').hide('slow');
            $('#employementEx' + parentIndex + '' + i + '').hide('slow');
            $('#publication' + parentIndex + '' + i + '').hide('slow');
        }
        $("#contactBasicDet" + parentIndex + "" + index + "").toggle('slow');
    }

    $scope.addEducationRow = function () {
        debugger;
        $scope.pairingDetails.Education_Details__r.push({
            Institution_Name__c: "",
            Contact__c: $scope.pairingDetails.Id
        });
        $scope.$apply();
        debugger;
    }
    $scope.addEducationRow2 = function () {
        debugger;
        $scope.pairList.Education_Details__r.push({
            Institution_Name__c: "",
            Contact__c: $scope.pairList.Id
        });
        $scope.$apply();
        debugger;
    }
    $scope.removeEducationRow = function (index) {
        debugger;
        if ($scope.pairingDetails.Education_Details__r.length != 1) {
            if ($scope.pairingDetails.Education_Details__r[index].Id != undefined && $scope.pairingDetails.Education_Details__r[index].Id != "") {
                $scope.deleteEducationRow($scope.pairingDetails.Education_Details__r[index].Id);
            } else {
                $scope.pairingDetails.Education_Details__r.splice(index, 1);
            }
        }
    }

    $scope.removeEducationRow2 = function (index) {
        debugger;
        if ($scope.pairList.Education_Details__r.length != 1) {
            if ($scope.pairList.Education_Details__r[index].Id != undefined && $scope.pairList.Education_Details__r[index].Id != "") {
                $scope.deleteEducationRow($scope.pairList.Education_Details__r[index].Id);
            } else {
                $scope.pairList.Education_Details__r.splice(index, 1);
            }
        }
    }

    $scope.deleteEducationRow = function (eduId) {
        // ApplicantPortal_Contoller.deleteEducationWorkshop(eduId, function (result, event) {
        WorkshopController.deleteEducationWorkshop(eduId, function (result, event) {
            if (event.status) {
                debugger;
                Swal.fire(
                    'Success',
                    'Deleted Succesfully.',
                    'success'
                );
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }

    $scope.addEmploymentRow = function (index) {
        debugger;
        $scope.pairingDetails.Employment_Details__r.push({
            Organization_Name__c: "",
            Contact__c: $scope.pairingDetails.Id
        });
        $scope.$apply();
        debugger;
    }

    $scope.addEmploymentRow2 = function (index) {
        debugger;
        $scope.pairList.Employment_Details__r.push({
            Organization_Name__c: "",
            Contact__c: $scope.pairList.Id
        });
        $scope.$apply();
        debugger;
    }
    $scope.removeEmploymentRow = function (index) {
        debugger;
        if ($scope.pairingDetails.Employment_Details__r.length != 1) {
            if ($scope.pairingDetails.Employment_Details__r[index].Id != undefined && $scope.pairingDetails.Employment_Details__r[index].Id != "") {
                $scope.deleteEmploymentWorkshop($scope.pairingDetails.Employment_Details__r[index].Id);
            } else {
                $scope.pairingDetails.Employment_Details__r.splice(index, 1);
            }
        }
    }

    $scope.removeEmploymentRow2 = function (index) {
        debugger;
        if ($scope.pairList.Employment_Details__r.length != 1) {
            if ($scope.pairList.Employment_Details__r[index].Id != undefined && $scope.pairList.Employment_Details__r[index].Id != "") {
                $scope.deleteEmploymentWorkshop($scope.pairList.Employment_Details__r[index].Id);
            } else {
                $scope.pairList.Employment_Details__r.splice(index, 1);
            }
        }
    }

    $scope.deleteEmploymentWorkshop = function (empId) {
        // ApplicantPortal_Contoller.deleteEmploymentWorkshop(empId, function (result, event) {
        WorkshopController.deleteEmploymentWorkshop(empId, function (result, event) {
            if (event.status) {
                debugger;
                Swal.fire(
                    'Success',
                    'Deleted Succesfully.',
                    'success'
                );
                $scope.$apply();
            }
        },
            { escape: true }
        )
    }


    $scope.redirectPageURL = function (pageName) {
        debugger;
        var link = document.createElement("a");
        link.Id = 'someLink'; //give it an ID!
        link.href = "#/" + pageName;
        link.click();
    }

    var inputQuantity = [];
    $(function () {
        $(".zipcode-number").on("keyup", function (e) {
            var $field = $(this),
                val = this.value,
                $thisIndex = parseInt($field.data("idx"), 10);
            if (this.validity && this.validity.badInput || isNaN(val) || $field.is(":invalid")) {
                this.value = inputQuantity[$thisIndex];
                return;
            }
            if (val.length > Number($field.attr("maxlength"))) {
                val = val.slice(0, 5);
                $field.val(val);
            }
            inputQuantity[$thisIndex] = val;
        });
    });



    $scope.onCountryChange1 = function () {
        debugger;

        if ($scope.pairingDetails.MailingCountry == 'India') {
            $scope.pairingDetails.stateList = $scope.indianStates;
        } else if ($scope.pairingDetails.MailingCountry == 'Germany') {
            $scope.pairingDetails.stateList = $scope.germanStates;
        }
        $scope.$apply();
    }

    $scope.onCountryChange2 = function () {
        debugger;

        if ($scope.pairList.MailingCountry == 'India') {
            $scope.pairList.stateList = $scope.indianStates;
        } else if ($scope.pairList.MailingCountry == 'Germany') {
            $scope.pairList.stateList = $scope.germanStates;
        }
        $scope.$apply();
    }

    /*/////////////////////////////////// After UI Code ///////////////////////////////////////////*/

    $scope.getCoordCVDetails = function () {
        debugger;
        // ApplicantPortal_Contoller.getCoordCVDetails($rootScope.projectId, function(result,event){ ----> Old Functionality
        WorkshopController.getCoordCVDetails($rootScope.candidateId, $rootScope.apaId, $rootScope.proposalId, function (result, event) {
            // WorkshopController.getCoordCVDetails($rootScope.proposalId, function (result, event) {

            debugger;
            if (event.status) {
                debugger;
                if (result == null || result.length == 0) {
                    $scope.pairingDetails.push({
                        "FirstName": " ",
                        "LastName": " ",
                        "Email": " ",
                    });
                } else {

                    for (var i = 0; i < result.length; i++) {
                        if (result[i].Name != undefined || result[i].Name != "") {
                            result[i].Name = result[i].Name ? result[i].Name.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Name;
                        }
                        if (result[i].FirstName != undefined || result[i].FirstName != "") {
                            result[i].FirstName = result[i].FirstName ? result[i].FirstName.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].FirstName;
                        }
                        if (result[i].LastName != undefined || result[i].LastName != "") {
                            result[i].LastName = result[i].LastName ? result[i].LastName.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].LastName;
                        }
                        if (result[i].Actual_Position__c != undefined || result[i].Actual_Position__c != "") {
                            result[i].Actual_Position__c = result[i].Actual_Position__c ? result[i].Actual_Position__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Actual_Position__c;
                        }
                        if (result[i].MailingStreet != undefined || result[i].MailingStreet != "") {
                            result[i].MailingStreet = result[i].MailingStreet ? result[i].MailingStreet.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].MailingStreet;
                        }
                        if (result[i].MailingCity != undefined || result[i].MailingCity != "") {
                            result[i].MailingCity = result[i].MailingCity ? result[i].MailingCity.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].MailingCity;
                        }
                        if (result[i].Publications_Patents__c != undefined || result[i].Publications_Patents__c != "") {
                            result[i].Publications_Patents__c = result[i].Publications_Patents__c ? result[i].Publications_Patents__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Publications_Patents__c;
                        }
                        if (result[i].Is_Primary__c == true) {
                            $scope.pairingDetails = result[i];
                            if ($scope.pairingDetails.Education_Details__r == undefined) {
                                var rec = {
                                    'Institution_Name__c': '',
                                    'Contact__c': $scope.pairingDetails.Id
                                };
                                $scope.pairingDetails.Education_Details__r = [];
                                debugger;
                                $scope.pairingDetails.Education_Details__r.push(rec);
                            } else {
                                for (var j = 0; j < result[i].Education_Details__r.length; j++) {
                                    if (result[i].Education_Details__r[j].Degree__c != undefined || result[i].Education_Details__r[j].Degree__c != "") {
                                        $scope.pairingDetails.Education_Details__r[j].Degree__c = result[i].Education_Details__r[j].Degree__c ? result[i].Education_Details__r[j].Degree__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Education_Details__r[j].Degree__c;
                                    }
                                    if (result[i].Education_Details__r[j].Area_of_specialization__c != undefined || result[i].Education_Details__r[j].Area_of_specialization__c != "") {
                                        $scope.pairingDetails.Education_Details__r[j].Area_of_specialization__c = result[i].Education_Details__r[j].Area_of_specialization__c ? result[i].Education_Details__r[j].Area_of_specialization__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Education_Details__r[j].Area_of_specialization__c;
                                    }
                                    if (result[i].Education_Details__r[j].Institution_Name__c != undefined || result[i].Education_Details__r[j].Institution_Name__c != "") {
                                        $scope.pairingDetails.Education_Details__r[j].Institution_Name__c = result[i].Education_Details__r[j].Institution_Name__c ? result[i].Education_Details__r[j].Institution_Name__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Education_Details__r[j].Institution_Name__c;
                                    }
                                    if (result[i].Education_Details__r[j].End_Year__c != undefined || result[i].Education_Details__r[j].End_Year__c != "") {
                                        $scope.pairingDetails.Education_Details__r[j].End_Year__c = result[i].Education_Details__r[j].End_Year__c ? result[i].Education_Details__r[j].End_Year__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Education_Details__r[j].End_Year__c;
                                    }
                                }
                            }
                            if ($scope.pairingDetails.Employment_Details__r == undefined) {
                                var emprec = {
                                    "Organization_Name__c": "",
                                    "Contact__c": $scope.pairingDetails.Id
                                };
                                $scope.pairingDetails.Employment_Details__r = [];
                                debugger;
                                $scope.pairingDetails.Employment_Details__r.push(emprec);
                            } else {
                                for (var j = 0; j < result[i].Employment_Details__r.length; j++) {
                                    if (result[i].Employment_Details__r[j].Organization_Name__c != undefined || result[i].Employment_Details__r[j].Organization_Name__c != "") {
                                        $scope.pairingDetails.Employment_Details__r[j].Organization_Name__c = result[i].Employment_Details__r[j].Organization_Name__c ? result[i].Employment_Details__r[j].Organization_Name__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Employment_Details__r[j].Organization_Name__c;
                                    }
                                    if (result[i].Employment_Details__r[j].Position__c != undefined || result[i].Employment_Details__r[j].Position__c != "") {
                                        $scope.pairingDetails.Employment_Details__r[j].Position__c = result[i].Employment_Details__r[j].Position__c ? result[i].Employment_Details__r[j].Position__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Employment_Details__r[j].Position__c;
                                    }
                                    if (result[i].Employment_Details__r[j].Start_Year__c != undefined || result[i].Employment_Details__r[j].Start_Year__c != "") {
                                        $scope.pairingDetails.Employment_Details__r[j].Start_Year__c = result[i].Employment_Details__r[j].Start_Year__c ? result[i].Employment_Details__r[j].Start_Year__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Employment_Details__r[j].Start_Year__c;
                                    }
                                    if (result[i].Employment_Details__r[j].End_Year__c != undefined || result[i].Employment_Details__r[j].End_Year__c != "") {
                                        $scope.pairingDetails.Employment_Details__r[j].End_Year__c = result[i].Employment_Details__r[j].End_Year__c ? result[i].Employment_Details__r[j].End_Year__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Employment_Details__r[j].End_Year__c;
                                    }
                                }
                            }

                            if ($scope.pairingDetails.MailingCountry == "India") {
                                $scope.pairingDetails.stateList = $scope.indianStates;
                            } else {
                                $scope.pairingDetails.stateList = $scope.germanStates;
                            }
                        } else {
                            $scope.pairList = result[i];
                            if ($scope.pairList.Education_Details__r == undefined) {
                                var rec = {
                                    'Institution_Name__c': '',
                                    'Contact__c': $scope.pairList.Id
                                };
                                $scope.pairList.Education_Details__r = [];
                                debugger;
                                $scope.pairList.Education_Details__r.push(rec);
                            }
                            for (var j = 0; j < result[i].Education_Details__r.length; j++) {
                                if (result[i].Education_Details__r[j].Degree__c != undefined || result[i].Education_Details__r[j].Degree__c != "") {
                                    $scope.pairList.Education_Details__r[j].Degree__c = result[i].Education_Details__r[j].Degree__c ? result[i].Education_Details__r[j].Degree__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Education_Details__r[j].Degree__c;
                                }
                                if (result[i].Education_Details__r[j].Area_of_specialization__c != undefined || result[i].Education_Details__r[j].Area_of_specialization__c != "") {
                                    $scope.pairList.Education_Details__r[j].Area_of_specialization__c = result[i].Education_Details__r[j].Area_of_specialization__c ? result[i].Education_Details__r[j].Area_of_specialization__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Education_Details__r[j].Area_of_specialization__c;
                                }
                                if (result[i].Education_Details__r[j].Institution_Name__c != undefined || result[i].Education_Details__r[j].Institution_Name__c != "") {
                                    $scope.pairList.Education_Details__r[j].Institution_Name__c = result[i].Education_Details__r[j].Institution_Name__c ? result[i].Education_Details__r[j].Institution_Name__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Education_Details__r[j].Institution_Name__c;
                                }
                                if (result[i].Education_Details__r[j].End_Year__c != undefined || result[i].Education_Details__r[j].End_Year__c != "") {
                                    $scope.pairList.Education_Details__r[j].End_Year__c = result[i].Education_Details__r[j].End_Year__c ? result[i].Education_Details__r[j].End_Year__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Education_Details__r[j].End_Year__c;
                                }
                            }
                            if ($scope.pairList.Employment_Details__r == undefined) {
                                var emprec = {
                                    "Organization_Name__c": "",
                                    "Contact__c": $scope.pairList.Id
                                };
                                $scope.pairList.Employment_Details__r = [];
                                debugger;
                                $scope.pairList.Employment_Details__r.push(emprec);
                            } else {
                                for (var j = 0; j < result[i].Employment_Details__r.length; j++) {
                                    if (result[i].Employment_Details__r[j].Organization_Name__c != undefined || result[i].Employment_Details__r[j].Organization_Name__c != "") {
                                        $scope.pairList.Employment_Details__r[j].Organization_Name__c = result[i].Employment_Details__r[j].Organization_Name__c ? result[i].Employment_Details__r[j].Organization_Name__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Employment_Details__r[j].Organization_Name__c;
                                    }
                                    if (result[i].Employment_Details__r[j].Position__c != undefined || result[i].Employment_Details__r[j].Position__c != "") {
                                        $scope.pairList.Employment_Details__r[j].Position__c = result[i].Employment_Details__r[j].Position__c ? result[i].Employment_Details__r[j].Position__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Employment_Details__r[j].Position__c;
                                    }
                                    if (result[i].Employment_Details__r[j].Start_Year__c != undefined || result[i].Employment_Details__r[j].Start_Year__c != "") {
                                        $scope.pairList.Employment_Details__r[j].Start_Year__c = result[i].Employment_Details__r[j].Start_Year__c ? result[i].Employment_Details__r[j].Start_Year__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Employment_Details__r[j].Start_Year__c;
                                    }
                                    if (result[i].Employment_Details__r[j].End_Year__c != undefined || result[i].Employment_Details__r[j].End_Year__c != "") {
                                        $scope.pairList.Employment_Details__r[j].End_Year__c = result[i].Employment_Details__r[j].End_Year__c ? result[i].Employment_Details__r[j].End_Year__c.replace(/&amp;/g, '&').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : result[i].Employment_Details__r[j].End_Year__c;
                                    }
                                }
                            }
                            if ($scope.pairList.MailingCountry == "India") {
                                $scope.pairList.stateList = $scope.indianStates;
                            } else {
                                $scope.pairList.stateList = $scope.germanStates;
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
    $scope.getCoordCVDetails();

    $scope.saveCoordCVDetails = function () {
        debugger;

        if ($scope.pairingDetails.FirstName == undefined || $scope.pairingDetails.FirstName == "") {
            swal("Contact Details", "Please Enter First Name.");
            $("#FName").addClass('border-theme');
            return;
        }
        if ($scope.pairingDetails.LastName == undefined || $scope.pairingDetails.LastName == "") {
            swal("Contact Details", "Please Enter Last Name.");
            $("#LName").addClass('border-theme');
            return;
        }
        if ($scope.pairingDetails.Email == undefined || $scope.pairingDetails.Email == "") {
            swal("Contact Details", "Please Enter Email.");
            $("#txtEmail1").addClass('border-theme');
            return;
        }
        if ($scope.pairingDetails.Actual_Position__c == undefined || $scope.pairingDetails.Actual_Position__c == "") {
            swal("Contact Details", "Please Enter Actual Position.");
            $("#position").addClass('border-theme');
            return;
        }
        if ($scope.pairingDetails.MailingCountry == undefined || $scope.pairingDetails.MailingCountry == "") {
            swal("Contact Details", "Please Enter Country.");
            $("#country").addClass('border-theme');
            return;
        }
        if ($scope.pairingDetails.MailingState == undefined || $scope.pairingDetails.MailingState == "") {
            swal("Contact Details", "Please Enter State.");
            $("#state").addClass('border-theme');
            return;
        }
        if ($scope.pairingDetails.MailingPostalCode == undefined || $scope.pairingDetails.MailingPostalCode == "") {
            swal("Contact Details", "Please Enter Post Code.");
            $("#postCode").addClass('border-theme');
            return;
        }
        if ($scope.emailCheck == true) {
            swal('info', 'Email already exists.', 'info');
            $("#txtEmail1").addClass('border-theme');
            return;
        }

        if ($scope.pairingDetails.Education_Details__r != undefined) {
            for (var j = 0; j < $scope.pairingDetails.Education_Details__r.length; j++) {
                if ($scope.pairingDetails.Education_Details__r[j].Degree__c == undefined || $scope.pairingDetails.Education_Details__r[j].Degree__c == "") {
                    swal('info', 'Please Enter Education Degree', 'info');
                    $("#degree" + j + "").addClass('border-theme');
                    return;
                }
                if ($scope.pairingDetails.Education_Details__r[j].Area_of_specialization__c == undefined || $scope.pairingDetails.Education_Details__r[j].Area_of_specialization__c == "") {
                    swal('info', 'Please enter Area of specialization', 'info');
                    $("#txtSpecialization" + j + "").addClass('border-theme');
                    return;
                }
                if ($scope.pairingDetails.Education_Details__r[j].Institution_Name__c == undefined || $scope.pairingDetails.Education_Details__r[j].Institution_Name__c == "") {
                    swal('info', 'Please Enter Institution Name', 'info');
                    $("#instName" + j + "").addClass('border-theme');
                    return;
                }
                if ($scope.pairingDetails.Education_Details__r[j].End_Year__c == undefined || $scope.pairingDetails.Education_Details__r[j].End_Year__c == "") {
                    swal('info', 'Please Enter Year of Completion', 'info');
                    $("#endYear" + j + "").addClass('border-theme');
                    return;
                }

                // if($scope.pairingDetails.Education_Details__r[j].Percentage_cgpa__c == undefined || $scope.pairingDetails.Education_Details__r[j].Percentage_cgpa__c == ""){
                //     swal('info','Please choose either CGPA/Percentage','info');
                //     $("#cgpa"+j+"").addClass('border-theme');
                //     return; 
                // }
                // if($scope.pairingDetails.Education_Details__r[j].Percentage_cgpa__c == "Percentage"){
                //     if($scope.pairingDetails.Education_Details__r[j].Percentage__c==undefined||$scope.pairingDetails.Education_Details__r[j].Percentage__c==""){
                //         swal('info','Please enter Percentage.','info');
                //         $("#txtPer"+j+"").addClass('border-theme');
                //         return; 
                //     }

                //     if($scope.pairingDetails.Education_Details__r[j].Percentage__c==00){
                //         swal('info','Please enter Percentage more than 0.','info');
                //         $("#txtPer"+j+"").addClass('border-theme');
                //         return;  
                //     }

                // }
                // if($scope.pairingDetails.Education_Details__r[j].Percentage_cgpa__c == "CGPA"){
                //     if($scope.pairingDetails.Education_Details__r[j].CGPA__c==undefined||$scope.pairingDetails.Education_Details__r[j].CGPA__c==""){
                //         swal('info','Please enter CGPA.','info');
                //         $("#txtPer"+j+"").addClass('border-theme');
                //         return; 
                //     }

                //     if($scope.pairingDetails.Education_Details__r[j].CGPA__c==00 || $scope.pairingDetails.Education_Details__r[j].CGPA__c == 0){
                //         swal('info','Please enter CGPA more than 0.','info');
                //         $("#txtPer"+j+"").addClass('border-theme');
                //         return;  
                //     }

                // }
            }
        }

        if ($scope.pairingDetails.Employment_Details__r != undefined) {
            for (var k = 0; k < $scope.pairingDetails.Employment_Details__r.length; k++) {
                if ($scope.pairingDetails.Employment_Details__r[k].Organization_Name__c == undefined || $scope.pairingDetails.Employment_Details__r[k].Organization_Name__c == "") {
                    swal("Employment Details", "Please Enter Organization Name.");
                    $("#org" + k + "").addClass('border-theme');
                    return;
                }

                if ($scope.pairingDetails.Employment_Details__r[k].Position__c == undefined || $scope.pairingDetails.Employment_Details__r[k].Position__c == "") {
                    swal("Employment Details", "Please Enter Position.");
                    $("#pos" + k + "").addClass('border-theme');
                    return;
                }

                if ($scope.pairingDetails.Employment_Details__r[k].Start_Year__c == undefined || $scope.pairingDetails.Employment_Details__r[k].Start_Year__c == "") {
                    swal("Employment Details", "Please Enter Start Year.");
                    $("#sYear" + k + "").addClass('border-theme');
                    return;
                }

                if ($scope.pairingDetails.Employment_Details__r[k].End_Year__c == undefined || $scope.pairingDetails.Employment_Details__r[k].End_Year__c == "") {
                    swal("Employment Details", "Please Enter End Year.");
                    $("#endyear" + k + "").addClass('border-theme');
                    return;
                }
            }

        }



        if ($scope.pairList.FirstName == undefined || $scope.pairList.FirstName == "") {
            swal("Contact Details", "Please Enter First Name.");
            $("#FName2").addClass('border-theme');
            return;
        }
        if ($scope.pairList.LastName == undefined || $scope.pairList.LastName == "") {
            swal("Contact Details", "Please Enter Last Name.");
            $("#LName2").addClass('border-theme');
            return;
        }
        if ($scope.pairList.Email == undefined || $scope.pairList.Email == "") {
            swal("Contact Details", "Please Enter Email.");
            $("#txtEmail12").addClass('border-theme');
            return;
        }
        if ($scope.pairList.Actual_Position__c == undefined || $scope.pairList.Actual_Position__c == "") {
            swal("Contact Details", "Please Enter Actual Position.");
            $("#position2").addClass('border-theme');
            return;
        }
        if ($scope.pairList.MailingCountry == undefined || $scope.pairList.MailingCountry == "") {
            swal("Contact Details", "Please Enter Country.");
            $("#country2").addClass('border-theme');
            return;
        }
        if ($scope.pairList.MailingState == undefined || $scope.pairList.MailingState == "") {
            swal("Contact Details", "Please Enter State.");
            $("#state2").addClass('border-theme');
            return;
        }
        if ($scope.pairList.MailingPostalCode == undefined || $scope.pairList.MailingPostalCode == "") {
            swal("Contact Details", "Please Enter Post Code.");
            $("#postCode2").addClass('border-theme');
            return;
        }
        if ($scope.emailCheck == true) {
            swal('info', 'Email already exists.', 'info');
            $("#txtEmail12").addClass('border-theme');
            return;
        }

        if ($scope.pairList.Education_Details__r != undefined) {
            for (var j = 0; j < $scope.pairList.Education_Details__r.length; j++) {
                if ($scope.pairList.Education_Details__r[j].Degree__c == undefined || $scope.pairList.Education_Details__r[j].Degree__c == "") {
                    swal('info', 'Please Enter Education Degree', 'info');
                    $("#degree2" + j + "").addClass('border-theme');
                    return;
                }
                if ($scope.pairList.Education_Details__r[j].Area_of_specialization__c == undefined || $scope.pairList.Education_Details__r[j].Area_of_specialization__c == "") {
                    swal('info', 'Please enter Area of specialization', 'info');
                    $("#txtSpecialization2" + j + "").addClass('border-theme');
                    return;
                }
                if ($scope.pairList.Education_Details__r[j].Institution_Name__c == undefined || $scope.pairList.Education_Details__r[j].Institution_Name__c == "") {
                    swal('info', 'Please Enter Institution Name', 'info');
                    $("#instName2" + j + "").addClass('border-theme');
                    return;
                }
                if ($scope.pairList.Education_Details__r[j].End_Year__c == undefined || $scope.pairList.Education_Details__r[j].End_Year__c == "") {
                    swal('info', 'Please Enter Year of Completion', 'info');
                    $("#endYear2" + j + "").addClass('border-theme');
                    return;
                }
                // if($scope.pairList.Education_Details__r[j].Percentage_cgpa__c == undefined || $scope.pairList.Education_Details__r[j].Percentage_cgpa__c == ""){
                //     swal('info','Please choose either CGPA/Percentage','info');
                //     $("#cgpa2"+j+"").addClass('border-theme');
                //     return; 
                // }
                // if($scope.pairList.Education_Details__r[j].Percentage_cgpa__c == "Percentage"){
                //     if($scope.pairList.Education_Details__r[j].Percentage__c==undefined||$scope.pairList.Education_Details__r[j].Percentage__c==""){
                //         swal('info','Please enter Percentage.','info');
                //         $("#txtPer2"+j+"").addClass('border-theme');
                //         return; 
                //     }

                //     if($scope.pairList.Education_Details__r[j].Percentage__c==00){
                //         swal('info','Please enter Percentage more than 0.','info');
                //         $("#txtPer2"+j+"").addClass('border-theme');
                //         return;  
                //     }

                // }
                // if($scope.pairList.Education_Details__r[j].Percentage_cgpa__c == "CGPA"){
                //     if($scope.pairList.Education_Details__r[j].CGPA__c==undefined||$scope.pairList.Education_Details__r[j].CGPA__c==""){
                //         swal('info','Please enter CGPA.','info');
                //         $("#txtPer2"+j+"").addClass('border-theme');
                //         return; 
                //     }

                //     if($scope.pairList.Education_Details__r[j].CGPA__c==00 || $scope.pairList.Education_Details__r[j].CGPA__c == 0){
                //         swal('info','Please enter CGPA more than 0.','info');
                //         $("#txtPer2"+j+"").addClass('border-theme');
                //         return;  
                //     }

                // }

            }
        }

        if ($scope.pairList.Employment_Details__r != undefined) {
            for (var k = 0; k < $scope.pairList.Employment_Details__r.length; k++) {
                if ($scope.pairList.Employment_Details__r[k].Organization_Name__c == undefined || $scope.pairList.Employment_Details__r[k].Organization_Name__c == "") {
                    swal("Employment Details", "Please Enter Organization Name.");
                    $("#org2" + k + "").addClass('border-theme');
                    return;
                }

                if ($scope.pairList.Employment_Details__r[k].Position__c == undefined || $scope.pairList.Employment_Details__r[k].Position__c == "") {
                    swal("Employment Details", "Please Enter Position.");
                    $("#pos2" + k + "").addClass('border-theme');
                    return;
                }

                if ($scope.pairList.Employment_Details__r[k].Start_Year__c == undefined || $scope.pairList.Employment_Details__r[k].Start_Year__c == "") {
                    swal("Employment Details", "Please Enter Start Year.");
                    $("#sYear2" + k + "").addClass('border-theme');
                    return;
                }

                if ($scope.pairList.Employment_Details__r[k].End_Year__c == undefined || $scope.pairList.Employment_Details__r[k].End_Year__c == "") {
                    swal("Employment Details", "Please Enter End Year.");
                    $("#endyear2" + k + "").addClass('border-theme');
                    return;
                }
            }

        }



        $scope.allDetailList = [];
        $scope.allDetailList.push($scope.pairingDetails, $scope.pairList);

        $scope.educationDetails = [];
        $scope.employmentDetails = [];
        for (var i = 0; i < $scope.allDetailList.length; i++) {
            $scope.allDetailList[i]['State__c'] = $scope.allDetailList[i]['MailingState'];
            for (var j = 0; j < $scope.allDetailList[i].Education_Details__r.length; j++) {
                $scope.educationDetails.push($scope.allDetailList[i].Education_Details__r[j]);
            }
            for (var k = 0; k < $scope.allDetailList[i].Employment_Details__r.length; k++) {
                $scope.employmentDetails.push($scope.allDetailList[i].Employment_Details__r[k]);
            }
        }

        for (var i = 0; i < $scope.allDetailList.length; i++) {
            delete ($scope.allDetailList[i]['Education_Details__r']);
            delete ($scope.allDetailList[i]['Employment_Details__r']);
            delete ($scope.allDetailList[i]['Education_Details__r']);
            delete ($scope.allDetailList[i]['stateList']);
        }

        for (var i = 0; i < $scope.educationDetails.length; i++) {
            delete ($scope.educationDetails[i]['$$hashKey']);
        }
        for (var i = 0; i < $scope.employmentDetails.length; i++) {
            delete ($scope.employmentDetails[i]['$$hashKey']);
        }

        // ApplicantPortal_Contoller.SaveWorkshopContactDetails($scope.allDetailList, $scope.educationDetails, $scope.employmentDetails, function (result, event) {
        WorkshopController.SaveWorkshopContactDetails($scope.allDetailList, $scope.educationDetails, $scope.employmentDetails, $rootScope.apaId, $rootScope.proposalId, function (result, event) {
            debugger;
            if (event.status) {
                debugger;
                Swal.fire(
                    'Success',
                    'your Contact Details have been Saved successfully.',
                    'success'
                );
                $scope.redirectPageURL('Meeting_Theme');
                $scope.$apply();
            }
        })
    }

    $scope.validatePerCGPA = function (index) {
        debugger
        if ($scope.pairingDetails.Education_Details__r[index].Percentage_cgpa__c == "CGPA") {
            delete $scope.pairingDetails.Education_Details__r[index].Percentage__c;
            delete $scope.pairingDetails.Education_Details__r[index].CGPA__c;

        }
        else {
            $scope.pairingDetails.Education_Details__r[index].Percentage__c = 0;
            delete $scope.pairingDetails.Education_Details__r[index].Percentage__c;
            delete $scope.pairingDetails.Education_Details__r[index].CGPA__c;
            $scope.removeClasses(index);
        }
    }

    $scope.validatePerCGPA2 = function (index) {
        debugger
        if ($scope.pairList.Education_Details__r[index].Percentage_cgpa__c == "CGPA") {
            delete $scope.pairList.Education_Details__r[index].Percentage__c;
            delete $scope.pairList.Education_Details__r[index].CGPA__c;

        }
        else {
            $scope.pairList.Education_Details__r[index].Percentage__c = 0;
            delete $scope.pairList.Education_Details__r[index].Percentage__c;
            delete $scope.pairList.Education_Details__r[index].CGPA__c;
            $scope.removeClasses(index);
        }
    }
    // $scope.gerCoordDetails = function(){
    //     debugger;
    //     ApplicantPortal_Contoller.getCoodinatorDetList($rootScope.userId, function(result,event){
    //         debugger;
    //         if(event.status && result != null){
    //             debugger;
    //             $scope.allDetailList = result;
    //             if($scope.allDetailList.Publications_Patents__c != undefined || $scope.allDetailList.Publications_Patents__c != ""){
    //                 $scope.allDetailList.Publications_Patents__c = $scope.allDetailList.Publications_Patents__c ? $scope.allDetailList.Publications_Patents__c.replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : $scope.allDetailList.Publications_Patents__c;
    //             }
    //             if($scope.allDetailList.Education_Details__r == undefined){
    //                 var rec = {
    //                     'Institution_Name__c':'',
    //                     'Contact__c': $scope.allDetailList.Id
    //                 };
    //                 $scope.allDetailList.Education_Details__r = [];
    //                     debugger;
    //                 $scope.allDetailList.Education_Details__r.push(rec);
    //             }
    //             if($scope.allDetailList.Employment_Details__r == undefined){
    //                 var emprec = {
    //                     "Organization_Name__c":"",
    //                     "Contact__c": $scope.allDetailList.Id
    //                 };
    //                 $scope.allDetailList.Employment_Details__r = [];
    //                 debugger;
    //                 $scope.allDetailList.Employment_Details__r.push(emprec);
    //             }
    //             if($scope.allDetailList.MailingCountry == 'India'){
    //                     $scope.allDetailList.stateList = $scope.indianStates;
    //                 }else if($scope.allDetailList.MailingCountry == 'Germany'){
    //                     $scope.allDetailList.stateList = $scope.germanStates; 
    //                 }
    //             $scope.$apply();
    //         }
    //     })
    // }
    // $scope.gerCoordDetails();

    $scope.saveAllDetails = function () {
        debugger;
        if ($scope.allDetailList != undefined) {
            if ($scope.allDetailList.FirstName == undefined || $scope.allDetailList.FirstName == "") {
                swal("Contact Details", "Please Enter Your First Name.");
                $("#FName").addClass('border-theme');
                return;
            }
            if ($scope.allDetailList.LastName == undefined || $scope.allDetailList.LastName == "") {
                swal("Contact Details", "Please Enter Your Last Name.");
                $("#LName").addClass('border-theme');
                return;
            }
            if ($scope.allDetailList.Email == undefined || $scope.allDetailList.Email == "") {
                swal("Contact Details", "Please Enter Your Email.");
                $("#txtEmail1").addClass('border-theme');
                return;
            }
            if ($scope.allDetailList.Actual_Position__c == undefined || $scope.allDetailList.Actual_Position__c == "") {
                swal("Contact Details", "Please Enter Your Actual Position.");
                $("#position").addClass('border-theme');
                return;
            }
            if ($scope.allDetailList.MailingCountry == undefined || $scope.allDetailList.MailingCountry == "") {
                swal("Contact Details", "Please Enter Country.");
                $("#country").addClass('border-theme');
                return;
            }
            if ($scope.allDetailList.MailingState == undefined || $scope.allDetailList.MailingState == "") {
                swal("Contact Details", "Please Enter State.");
                $("#state").addClass('border-theme');
                return;
            }
            if ($scope.allDetailList.MailingPostalCode == undefined || $scope.allDetailList.MailingPostalCode == "") {
                swal("Contact Details", "Please Enter Post Code.");
                $("#postCode").addClass('border-theme');
                return;
            }
            if ($scope.emailCheck == true) {
                swal('info', 'Email already exists.', 'info');
                $("#txtEmail1").addClass('border-theme');
                return;
            }

            if ($scope.allDetailList.Education_Details__r != undefined) {
                for (var i = 0; i < $scope.allDetailList.Education_Details__r.length; i++) {
                    if ($scope.allDetailList.Education_Details__r[i].Degree__c == undefined || $scope.allDetailList.Education_Details__r[i].Degree__c == "") {
                        swal('info', 'Please Enter Education Degree', 'info');
                        $("#degree" + i + "").addClass('border-theme');
                        return;
                    }
                    if ($scope.allDetailList.Education_Details__r[i].End_Year__c == undefined || $scope.allDetailList.Education_Details__r[i].End_Year__c == "") {
                        swal('info', 'Please Enter Year of Completion', 'info');
                        $("#endYear" + i + "").addClass('border-theme');
                        return;
                    }
                    if ($scope.allDetailList.Education_Details__r[i].Institution_Name__c == undefined || $scope.allDetailList.Education_Details__r[i].Institution_Name__c == "") {
                        swal('info', 'Please Enter Institution Name', 'info');
                        $("#instName" + i + "").addClass('border-theme');
                        return;
                    }
                    if ($scope.allDetailList.Education_Details__r[i].Percentage_cgpa__c == undefined || $scope.allDetailList.Education_Details__r[i].Percentage_cgpa__c == "") {
                        swal('info', 'Please choose either CGPA/Percentage', 'info');
                        $("#cgpa" + i + "").addClass('border-theme');
                        return;
                    }
                    if ($scope.allDetailList.Education_Details__r[i].Percentage_cgpa__c == "Percentage") {
                        if ($scope.allDetailList.Education_Details__r[i].Percentage__c == undefined || $scope.allDetailList.Education_Details__r[i].Percentage__c == "") {
                            swal('info', 'Please enter Percentage.', 'info');
                            $("#txtPer" + i + "").addClass('border-theme');
                            return;
                        }

                        if ($scope.allDetailList.Education_Details__r[i].Percentage__c ==00) {
                            swal('info', 'Please enter Percentage more than 0.', 'info');
                            $("#txtPer" + i + "").addClass('border-theme');
                            return;
                        }

                    }
                    if ($scope.allDetailList.Education_Details__r[i].Percentage_cgpa__c == "CGPA") {
                        if ($scope.allDetailList.Education_Details__r[i].CGPA__c == undefined || $scope.allDetailList.Education_Details__r[i].CGPA__c == "") {
                            swal('info', 'Please enter CGPA.', 'info');
                            $("#txtPer" + i + "").addClass('border-theme');
                            return;
                        }

                        if ($scope.allDetailList.Education_Details__r[i].CGPA__c ==00 || $scope.allDetailList.Education_Details__r[i].CGPA__c == 0) {
                            swal('info', 'Please enter CGPA more than 0.', 'info');
                            $("#txtPer" + i + "").addClass('border-theme');
                            return;
                        }

                    }
                    if ($scope.allDetailList.Education_Details__r[i].Area_of_specialization__c == undefined || $scope.allDetailList.Education_Details__r[i].Area_of_specialization__c == "") {
                        swal('info', 'Please enter Area of specialization', 'info');
                        $("#txtSpecialization" + i + "").addClass('border-theme');
                        return;
                    }
                }
            }

            if ($scope.allDetailList.Employment_Details__r != undefined) {
                for (var j = 0; j < $scope.allDetailList.Employment_Details__r.length; j++) {
                    if ($scope.allDetailList.Employment_Details__r[j].Organization_Name__c == undefined || $scope.allDetailList.Employment_Details__r[j].Organization_Name__c == "") {
                        swal("Employment Details", "Please Enter Organization Name.");
                        $("#org" + j + "").addClass('border-theme');
                        return;
                    }

                    if ($scope.allDetailList.Employment_Details__r[j].Position__c == undefined || $scope.allDetailList.Employment_Details__r[j].Position__c == "") {
                        swal("Employment Details", "Please Enter Position.");
                        $("#pos" + j + "").addClass('border-theme');
                        return;
                    }

                    if ($scope.allDetailList.Employment_Details__r[j].Start_Year__c == undefined || $scope.allDetailList.Employment_Details__r[j].Start_Year__c == "") {
                        swal("Employment Details", "Please Enter Start Year.");
                        $("#sYear" + j + "").addClass('border-theme');
                        return;
                    }

                    if ($scope.allDetailList.Employment_Details__r[j].End_Year__c == undefined || $scope.allDetailList.Employment_Details__r[j].End_Year__c == "") {
                        swal("Employment Details", "Please Enter End Year.");
                        $("#endyear" + j + "").addClass('border-theme');
                        return;
                    }
                }

            }

        }

        $scope.educationDetails = [];
        $scope.employmentDetails = [];
        $scope.educationDetails = $scope.allDetailList.Education_Details__r;
        $scope.employmentDetails = $scope.allDetailList.Employment_Details__r;

        $scope.allDetailList['State__c'] = $scope.allDetailList['MailingState'];
        delete ($scope.allDetailList['Education_Details__r']);
        delete ($scope.allDetailList['Employment_Details__r']);
        delete ($scope.allDetailList['Education_Details__r']);
        delete ($scope.allDetailList['stateList']);

        for (var i = 0; i < $scope.educationDetails.length; i++) {
            delete ($scope.educationDetails[i]['$$hashKey']);
        }
        for (var i = 0; i < $scope.employmentDetails.length; i++) {
            delete ($scope.employmentDetails[i]['$$hashKey']);
        }

        // ApplicantPortal_Contoller.SaveWorkshopContactDetails($scope.allDetailList, $scope.educationDetails, $scope.employmentDetails, function (result, event) {
        WorkshopController.SaveWorkshopContactDetails($scope.allDetailList, $scope.educationDetails, $scope.employmentDetails, function (result, event) {
            debugger;
            if (event.status) {
                debugger;
                Swal.fire(
                    'Success',
                    'your Contact Details have been Saved successfully.',
                    'success'
                );
                $scope.redirectPageURL('Meeting_Theme');
                $scope.$apply();
            }
        })
    }

    $scope.validatePercentage = function (index, event) {
        debugger;

        if ($scope.pairingDetails.Education_Details__r[index].Percentage_cgpa__c == "Percentage") {
            stringP = $scope.pairingDetails.Education_Details__r[index].Percentage__c.toString()
            var splitPercent = stringP.split(".");
            if (splitPercent.length > 2) {
                $scope.pairingDetails.Education_Details__r[index].Percentage__c = Number(splitPercent[0] + "." + splitPercent[1]);
                swal("info", "Enter valid value for percentage.", "info");
                return;
            }
        }

        if ($scope.pairingDetails.Education_Details__r[index].Percentage_cgpa__c != undefined) {
            if ($scope.pairingDetails.Education_Details__r[index].Percentage_cgpa__c == "CGPA") {
                if ($scope.pairingDetails.Education_Details__r[index].Percentage__c > 10) {
                    $scope.pairingDetails.Education_Details__r[index].Percentage__c = 10;
                }
            }
            else {
                if ((event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode == 48 || event.keyCode == 8 || event.keyCode == 190) {
                    if ($scope.pairingDetails.Education_Details__r[index].Percentage__c > 100) {
                        $scope.pairingDetails.Education_Details__r[index].Percentage__c = '100';
                    }
                } else {
                    $scope.pairingDetails.Education_Details__r[index].Percentage__c = 0;
                }
            }
        } else {
            if ($scope.pairingDetails.Education_Details__r[index].Percentage__c > 100) {
                $scope.pairingDetails.Education_Details__r[index].Percentage__c = 100;
            }
        }

    }

    $scope.validatePercentage2 = function (index, event) {
        debugger;

        if ($scope.pairList.Education_Details__r[index].Percentage_cgpa__c == "Percentage") {
            stringP = $scope.pairList.Education_Details__r[index].Percentage__c.toString()
            var splitPercent = stringP.split(".");
            if (splitPercent.length > 2) {
                $scope.pairList.Education_Details__r[index].Percentage__c = Number(splitPercent[0] + "." + splitPercent[1]);
                swal("info", "Enter valid value for percentage.", "info");
                return;
            }
        }

        if ($scope.pairList.Education_Details__r[index].Percentage_cgpa__c != undefined) {
            if ($scope.pairList.Education_Details__r[index].Percentage_cgpa__c == "CGPA") {
                if ($scope.pairList.Education_Details__r[index].Percentage__c > 10) {
                    $scope.pairList.Education_Details__r[index].Percentage__c = 10;
                }
            }
            else {
                if ((event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode == 48 || event.keyCode == 8 || event.keyCode == 190) {
                    if ($scope.pairList.Education_Details__r[index].Percentage__c > 100) {
                        $scope.pairList.Education_Details__r[index].Percentage__c = '100';
                    }
                } else {
                    $scope.pairList.Education_Details__r[index].Percentage__c = 0;
                }
            }
        } else {
            if ($scope.pairList.Education_Details__r[index].Percentage__c > 100) {
                $scope.pairList.Education_Details__r[index].Percentage__c = 100;
            }
        }

    }

    $scope.removeClass = function (controlid, index) {
        debugger;
        var controlIdfor = controlid + "" + index;
        $("#" + controlIdfor + "").removeClass('border-theme');
    }

    $scope.removeClass2 = function (controlid) {
        $("#" + controlid + "").removeClass('border-theme');
    }
});