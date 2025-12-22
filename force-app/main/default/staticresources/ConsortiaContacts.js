angular.module('cp_app').controller('ConsortiaContacts_Ctrl', function ($scope, $rootScope) {

    /*/////////////////////// UI ////////////////////////*/

    debugger;
    $scope.siteURL = typeof siteURL !== 'undefined' ? siteURL : '';
    $scope.apaId = '';
    $scope.hashCode = '';
    $scope.AccountContactData = [];
    $scope.proposalStage = $scope.proposalStage ? true : ($scope.secondstage ? true : false);
    $scope.getDependentPicklistValues = function () {
        debugger;
        $scope.indianStates = [];
        $scope.germanStates = [];
        ApplicantPortal_Contoller.getFieldDependencies('Contact', 'Country__c', 'States__c', function (result, event) {
            debugger;
            if (event.status && result != null) {
                debugger;
                // if(result.India==undefined){
                //     if(result[0].Name=="WISER" || result[0].Name=="SING" || result[0].Name=="PECFAR" || result[0].Name=="2+2 Call" || result[0].Name=="Industrial Fellowships" || result[0].Name=="Workshop"){
                //       $scope.getDependentPicklistValues();
                //     }
                //   }else{
                var indianStatesArray = result.India;
                $scope.indianStates = indianStatesArray.map(item => item == "Union Territory of J&amp;K" ? "Union Territory of J&K" : item);
                // $scope.indianStates = result.India;
                $scope.germanStates = result.Germany;
                debugger;
                $scope.$apply();
                //$scope.gerCoordDetails();
                //   }
            }
        }
        )
    }

    if (localStorage.getItem('apaId')) {
        var apaId = localStorage.getItem('apaId');
        $scope.apaId = apaId;
    }
    if (localStorage.getItem('proposalId')) {
        var proposalId = localStorage.getItem('proposalId');
    }
    if (localStorage.getItem('hashCode')) {
        $scope.hashCode = localStorage.getItem('hashCode');
    } else if ($rootScope.hashCode) {
        $scope.hashCode = $rootScope.hashCode;
    }

    $scope.getDependentPicklistValues();

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
        $scope.allDetailList.Education_Details__r.push({
            Institution_Name__c: "",
            Contact__c: $scope.allDetailList.Id,
            'Applicant_Proposal_Association__c': $scope.apaId
        });
        $scope.$apply();
        debugger;
    }
    $scope.removeEducationRow = function (index) {
        debugger;
        if ($scope.allDetailList.Education_Details__r.length != 1) {
            if ($scope.allDetailList.Education_Details__r[index].Id != undefined && $scope.allDetailList.Education_Details__r[index].Id != "") {
                $scope.deleteEducationRow($scope.allDetailList.Education_Details__r[index].Id);
            } else {
                $scope.allDetailList.Education_Details__r.splice(index, 1);
            }
        }
    }

    $scope.deleteEducationRow = function (eduId) {
        ApplicantPortal_Contoller.deleteEducationWorkshop(eduId, function (result, event) {
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
        $scope.allDetailList.Employment_Details__r.push({
            Organization_Name__c: "",
            Contact__c: $scope.allDetailList.Id,
            Applicant_Proposal_Association__c: $scope.apaId
        });
        $scope.$apply();
        debugger;
    }
    $scope.removeEmploymentRow = function (index) {
        debugger;
        if ($scope.allDetailList.Employment_Details__r.length != 1) {
            if ($scope.allDetailList.Employment_Details__r[index].Id != undefined && $scope.allDetailList.Employment_Details__r[index].Id != "") {
                $scope.deleteEmploymentWorkshop($scope.allDetailList.Employment_Details__r[index].Id);
            } else {
                $scope.allDetailList.Employment_Details__r.splice(index, 1);
            }
        }
    }

    $scope.deleteEmploymentWorkshop = function (empId) {
        ApplicantPortal_Contoller.deleteEmploymentWorkshop(empId, function (result, event) {
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



    $scope.onCountryChange = function () {
        debugger;

        if ($scope.allDetailList.MailingCountry == 'India') {
            $scope.allDetailList.stateList = $scope.indianStates;
        } else if ($scope.allDetailList.MailingCountry == 'Germany') {
            $scope.allDetailList.stateList = $scope.germanStates;
        }
        $scope.$apply();
    }


    $scope.allDetailList = [];
    $scope.gerCoordDetails = function () {
        debugger;
        if (!$scope.hashCode) {
            console.error('hashCode is not available. Cannot load coordinator details.');
            return;
        }
        ApplicantPortal_Contoller.getCoodinatorDetList($scope.hashCode, $scope.apaId, function (result, event) {
            debugger;
            if (event.status && result != null) {
                debugger;
                $scope.allDetailList = result;
                console.log('onload');
                console.log(result);
                if ($scope.allDetailList.Publications_Patents__c != undefined || $scope.allDetailList.Publications_Patents__c != "") {
                    $scope.allDetailList.Publications_Patents__c = $scope.allDetailList.Publications_Patents__c ? $scope.allDetailList.Publications_Patents__c.replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replace(/&#39;/g, '\'').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : $scope.allDetailList.Publications_Patents__c;
                }
                if ($scope.allDetailList.Publications_Patents_Relevant__c != undefined || $scope.allDetailList.Publications_Patents_Relevant__c != "") {
                    $scope.allDetailList.Publications_Patents_Relevant__c = $scope.allDetailList.Publications_Patents_Relevant__c ? $scope.allDetailList.Publications_Patents_Relevant__c.replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replace(/&#39;/g, '\'').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : $scope.allDetailList.Publications_Patents_Relevant__c;
                }
                if ($scope.allDetailList.Actual_Position__c != undefined || $scope.allDetailList.Actual_Position__c != "") {
                    $scope.allDetailList.Actual_Position__c = $scope.allDetailList.Actual_Position__c ? $scope.allDetailList.Actual_Position__c.replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replace(/&#39;/g, '\'').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : $scope.allDetailList.Actual_Position__c;
                }
                if ($scope.allDetailList.MailingStreet != undefined || $scope.allDetailList.MailingStreet != "") {
                    $scope.allDetailList.MailingStreet = $scope.allDetailList.MailingStreet ? $scope.allDetailList.MailingStreet.replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replace(/&#39;/g, '\'').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : $scope.allDetailList.MailingStreet;
                }
                if ($scope.allDetailList.MailingCity != undefined || $scope.allDetailList.MailingCity != "") {
                    $scope.allDetailList.MailingCity = $scope.allDetailList.MailingCity ? $scope.allDetailList.MailingCity.replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replace(/&#39;/g, '\'').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : $scope.allDetailList.MailingCity;
                }
                if ($scope.allDetailList.MailingState != undefined || $scope.allDetailList.MailingState != "") {
                    $scope.allDetailList.MailingState = $scope.allDetailList.MailingState ? $scope.allDetailList.MailingState.replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replace(/&#39;/g, '\'').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : $scope.allDetailList.MailingState;
                }
                if ($scope.allDetailList.Education_Details__r == undefined) {
                    var rec = {
                        'Institution_Name__c': '',
                        'Contact__c': $scope.allDetailList.Id,
                        'Applicant_Proposal_Association__c': $scope.apaId
                    };
                    $scope.allDetailList.Education_Details__r = [];
                    debugger;
                    $scope.allDetailList.Education_Details__r.push(rec);
                } else {
                    for (var i = 0; i < $scope.allDetailList.Education_Details__r.length; i++) {
                        $scope.allDetailList.Education_Details__r[i].Applicant_Proposal_Association__c = $scope.apaId;
                        if ($scope.allDetailList.Education_Details__r[i].Degree__c != undefined || $scope.allDetailList.Education_Details__r[i].Degree__c != "") {
                            $scope.allDetailList.Education_Details__r[i].Degree__c = $scope.allDetailList.Education_Details__r[i].Degree__c ? $scope.allDetailList.Education_Details__r[i].Degree__c.replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replace(/&#39;/g, '\'').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : $scope.allDetailList.Education_Details__r[i].Degree__c;
                        }
                        if ($scope.allDetailList.Education_Details__r[i].Institution_Name__c != undefined || $scope.allDetailList.Education_Details__r[i].Institution_Name__c != "") {
                            $scope.allDetailList.Education_Details__r[i].Institution_Name__c = $scope.allDetailList.Education_Details__r[i].Institution_Name__c ? $scope.allDetailList.Education_Details__r[i].Institution_Name__c.replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replace(/&#39;/g, '\'').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : $scope.allDetailList.Education_Details__r[i].Institution_Name__c;
                        }
                        if ($scope.allDetailList.Education_Details__r[i].Area_of_specialization__c != undefined || $scope.allDetailList.Education_Details__r[i].Area_of_specialization__c != "") {
                            $scope.allDetailList.Education_Details__r[i].Area_of_specialization__c = $scope.allDetailList.Education_Details__r[i].Area_of_specialization__c ? $scope.allDetailList.Education_Details__r[i].Area_of_specialization__c.replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replace(/&#39;/g, '\'').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : $scope.allDetailList.Education_Details__r[i].Area_of_specialization__c;
                        }
                    }
                }
                if ($scope.allDetailList.Employment_Details__r == undefined) {
                    var emprec = {
                        "Organization_Name__c": "",
                        "Contact__c": $scope.allDetailList.Id,
                        'Applicant_Proposal_Association__c': $scope.apaId
                    };
                    $scope.allDetailList.Employment_Details__r = [];
                    debugger;
                    $scope.allDetailList.Employment_Details__r.push(emprec);
                } else {
                    for (var i = 0; i < $scope.allDetailList.Employment_Details__r.length; i++) {
                        $scope.allDetailList.Employment_Details__r[i].Applicant_Proposal_Association__c = $scope.apaId;
                        if ($scope.allDetailList.Employment_Details__r[i].Organization_Name__c != undefined || $scope.allDetailList.Employment_Details__r[i].Organization_Name__c != "") {
                            $scope.allDetailList.Employment_Details__r[i].Organization_Name__c = $scope.allDetailList.Employment_Details__r[i].Organization_Name__c ? $scope.allDetailList.Employment_Details__r[i].Organization_Name__c.replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replace(/&#39;/g, '\'').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : $scope.allDetailList.Employment_Details__r[i].Organization_Name__c;
                        }
                        if ($scope.allDetailList.Employment_Details__r[i].Position__c != undefined || $scope.allDetailList.Employment_Details__r[i].Position__c != "") {
                            $scope.allDetailList.Employment_Details__r[i].Position__c = $scope.allDetailList.Employment_Details__r[i].Position__c ? $scope.allDetailList.Employment_Details__r[i].Position__c.replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replace(/&#39;/g, '\'').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : $scope.allDetailList.Employment_Details__r[i].Position__c;
                        }
                    }
                }
                if ($scope.allDetailList.MailingCountry == 'India') {
                    $scope.allDetailList.stateList = $scope.indianStates;
                } else if ($scope.allDetailList.MailingCountry == 'Germany') {
                    $scope.allDetailList.stateList = $scope.germanStates;
                }
                $scope.$apply();
                console.log($scope.allDetailList);
            }
        })
    }
    $scope.gerCoordDetails();

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
                $("#email").addClass('border-theme');
                return;
            }
            if ($scope.allDetailList.Actual_Position__c == undefined || $scope.allDetailList.Actual_Position__c == "") {
                swal("Contact Details", "Please Enter Your Actual Position.");
                $("#position").addClass('border-theme');
                return;
            }
            if ($scope.allDetailList.MailingStreet == undefined || $scope.allDetailList.MailingStreet == "") {
                swal("Contact Details", "Please Enter Your Street Name.");
                $("#street").addClass('border-theme');
                return;
            }
            if ($scope.allDetailList.MailingCity == undefined || $scope.allDetailList.MailingCity == "") {
                swal("Contact Details", "Please Enter Your City.");
                $("#city").addClass('border-theme');
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
                $("#pCode").addClass('border-theme');
                return;
            }

            if ($scope.allDetailList.Education_Details__r != undefined) {
                for (var i = 0; i < $scope.allDetailList.Education_Details__r.length; i++) {
                    if ($scope.allDetailList.Education_Details__r[i].Degree__c == undefined || $scope.allDetailList.Education_Details__r[i].Degree__c == "") {
                        swal("Education Details", "Please Enter Degree.");
                        $("#degree" + i + "").addClass('border-theme');
                        return;
                    }
                    if ($scope.allDetailList.Education_Details__r[i].Institution_Name__c == undefined || $scope.allDetailList.Education_Details__r[i].Institution_Name__c == "") {
                        swal("Education Details", "Please Enter Institution Name.");
                        $("#institution" + i + "").addClass('border-theme');
                        return;
                    }
                    if ($scope.allDetailList.Education_Details__r[i].Area_of_specialization__c == undefined || $scope.allDetailList.Education_Details__r[i].Area_of_specialization__c == "") {
                        swal("Education Details", "Please Enter Specialization.");
                        $("#specialization" + i + "").addClass('border-theme');
                        return;
                    }

                    if ($scope.allDetailList.Education_Details__r[i].Start_Year__c == undefined || $scope.allDetailList.Education_Details__r[i].Start_Year__c == "") {
                        swal("Education Details", "Please Enter Start Year.");
                        $("#zipCode1" + i + "").addClass('border-theme');
                        return;
                    }
                    if ($scope.allDetailList.Education_Details__r[i].End_Year__c == undefined || $scope.allDetailList.Education_Details__r[i].End_Year__c == "") {
                        swal("Education Details", "Please Enter End Year.");
                        $("#zipCode2" + i + "").addClass('border-theme');
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
                        $("#position1" + j + "").addClass('border-theme');
                        return;
                    }

                    if ($scope.allDetailList.Employment_Details__r[j].Start_Year__c == undefined || $scope.allDetailList.Employment_Details__r[j].Start_Year__c == "") {
                        swal("Employment Details", "Please Enter Start Year.");
                        $("#zipCode11" + j + "").addClass('border-theme');
                        return;
                    }

                    if ($scope.allDetailList.Employment_Details__r[j].End_Year__c == undefined || $scope.allDetailList.Employment_Details__r[j].End_Year__c == "") {
                        swal("Employment Details", "Please Enter End Year.");
                        $("#zipCode22" + j + "").addClass('border-theme');
                        return;
                    }
                }

            }

        }

        // ---- OLD CODE WHICH IS DELETING DATA FROM LIST TO PASS DATA TO APEX ----- //
        // ---- BECAUSE OF THIS DATA IS GETTING CLEARED FROM UI AS SOON AS WE CLICKED ON CANCEL BUTTON ON SWAL ---- //

        // $scope.educationDetails = [];
        // $scope.employmentDetails = [];
        // $scope.educationDetails = $scope.allDetailList.Education_Details__r;
        // $scope.employmentDetails = $scope.allDetailList.Employment_Details__r;
        // debugger

        // $scope.allDetailList['State__c'] = $scope.allDetailList['MailingState'];
        // delete ($scope.allDetailList['Education_Details__r']);
        // delete ($scope.allDetailList['Employment_Details__r']);
        // delete ($scope.allDetailList['Education_Details__r']);
        // delete ($scope.allDetailList['stateList']);

        // for (var i = 0; i < $scope.educationDetails.length; i++) {
        //     delete ($scope.educationDetails[i]['$$hashKey']);
        // }
        // for (var i = 0; i < $scope.employmentDetails.length; i++) {
        //     delete ($scope.employmentDetails[i]['$$hashKey']);
        // }
        // $("#btnSubmit").html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Please wait...');
        // debugger

        // delete $scope.allDetailList.Account;


        // ------ NEW CODE ----- //
        // Extract lists from allDetailList (UI bound object)
        $scope.educationDetails = $scope.allDetailList.Education_Details__r || [];
        $scope.employmentDetails = $scope.allDetailList.Employment_Details__r || [];

        // Create CLEAN COPY for Apex (DO NOT modify UI object)

        $scope.cleanedDetailList = angular.copy($scope.allDetailList);

        // Add/modify fields on cleaned object only
        $scope.cleanedDetailList['State__c'] = $scope.allDetailList['MailingState'];

        // Remove UI-only fields safely (ONLY from cleaned copy)
        delete $scope.cleanedDetailList['Education_Details__r'];
        delete $scope.cleanedDetailList['Employment_Details__r'];
        delete $scope.cleanedDetailList['stateList'];
        delete $scope.cleanedDetailList['Account'];
        delete $scope.cleanedDetailList._charLimitMap;
        delete $scope.cleanedDetailList.$$hashKey;

        // Copy and clean child lists (Education & Employment)

        $scope.cleanedEducationDetails = angular.copy($scope.educationDetails);
        $scope.cleanedEmploymentDetails = angular.copy($scope.employmentDetails);

        for (var i = 0; i < $scope.cleanedEducationDetails.length; i++) {
            delete $scope.cleanedEducationDetails[i]._charLimitMap;
            delete $scope.cleanedEducationDetails[i]['$$hashKey'];
        }

        for (var i = 0; i < $scope.cleanedEmploymentDetails.length; i++) {
            delete $scope.cleanedEmploymentDetails[i]._charLimitMap;
            delete $scope.cleanedEmploymentDetails[i]['$$hashKey'];
        }

        // Call Apex using CLEANED lists

        $("#btnSubmit").html('<i class="fa-solid fa-spinner fa-spin-pulse me-3"></i>Please wait...');

        // ApplicantPortal_Contoller.SaveWorkshopContactDetails2($scope.allDetailList, $scope.educationDetails, $scope.employmentDetails, function (result, event) {
        ApplicantPortal_Contoller.SaveWorkshopContactDetails2($scope.cleanedDetailList, $scope.cleanedEducationDetails, $scope.cleanedEmploymentDetails, function (result, event) {
            debugger;
            $("#btnSubmit").html('<i class="fa-solid fa-check me-2"></i>Save and Next');
            if (event.status) {
                debugger;
                // swal({
                //     title: "Success",
                //     text: "Your CV Details has been Saved successfully.",
                //     icon: "success",
                //     buttons: true,
                //     dangerMode: false,
                // }).then((willDelete) => {
                //     if (willDelete) {
                //         $scope.redirectPageURL('Financial_Overview');
                //         $scope.$apply();
                //     } else {
                //         return;
                //     }
                // });

                swal({
                    title: "Success",
                    text:
                        "Your CV details have been saved successfully.\n\n" +
                        "Next Step:\n" +
                        "Please fill in the information about the following:\n" +
                        "• Financial Contribution (Own)\n" +
                        "• Financial Contribution (IGSTC)",
                    icon: "success",
                    button: "OK",
                    // buttons: true,
                    dangerMode: false
                }).then((willDelete) => {
                    if (willDelete) {
                        $scope.redirectPageURL('Financial_Overview');
                        $scope.$apply();
                    }
                });


                //     Swal.fire(
                //         'Success',
                //         'your Contact Details has been Saved successfully.',
                //         'success'
                //     );
                //    $scope.redirectPageURL('Financial_Overview');
                //    $scope.$apply();
            }
        })
    }

    $scope.removeClass = function (controlid, index) {
        debugger;
        var controlIdfor = controlid + "" + index;
        $("#" + controlIdfor + "").removeClass('border-theme');
    }

    $scope.removeClass2 = function (controlid) {
        $("#" + controlid + "").removeClass('border-theme');
    }


    $scope.checkCharLimit = function (obj, fieldName, limit) {

        // SAFETY: if Contacts[0] not ready, stop
        if (!obj) return;

        // Initialize map once
        if (!obj._charLimitMap) {
            obj._charLimitMap = {};
        }

        var value = obj[fieldName];

        if (!value) {
            obj._charLimitMap[fieldName] = false;
            return;
        }

        if (value.length > limit) {
            obj[fieldName] = value.substring(0, limit);
            obj._charLimitMap[fieldName] = true;
        } else {
            obj._charLimitMap[fieldName] = false;
        }
    };


});

//     $scope.AccountContactData=[];
//     $scope.gparentInd=0;
//     $scope.degree = degree;
//     $scope.specialization = specialization;
//     $scope.cloneData="";
//     $scope.getAccountContactEduOtherDetList=function(){
//         IndustrialFellowshipController.getAccountContactEduOtherDetList($rootScope.projectId, function (result, event) {
//             debugger
//             if(result.Publications_Patents__c != undefined || result.Publications_Patents__c != ""){
//                 result.Publications_Patents__c = result.Publications_Patents__c ? result.Publications_Patents__c.replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result.Publications_Patents__c;
//             }
//             console.log('get all data');
//             console.log(result);
//             console.log(event);
//             $scope.AccountContactData=result;
//             for(var i=0;i<$scope.AccountContactData.length;i++){
//             if($scope.AccountContactData[i].Lcon==undefined){
//                 debugger;
//                 $scope.AccountContactData[i].Lcon = [];
//                 $scope.AccountContactData[i].Lcon.push({
//                     AccountId:$scope.AccountContactData[i].AccId,
//                     FirstName:"",
//                     Education_Details__r:[{
//                         Institution_Name__c:""
//                     }],
//                     Employment_Details__r:[{
//                         Organization_Name__c:""
//                     }],
//                     // Publications_Patents__r:[{
//                     //     Description__c:""
//                     // }]
//                 });
//                 }else{
//                     if($scope.AccountContactData[i].Lcon[0].Education_Details__r==undefined){
//                         $scope.AccountContactData[i].Lcon[0].Education_Details__r = [];
//                         $scope.AccountContactData[i].Lcon[0].Education_Details__r.push({
//                             Institution_Name__c:""
//                         });
//                     }
//                     if($scope.AccountContactData[i].Lcon[0].Employment_Details__r==undefined){
//                         $scope.AccountContactData[i].Lcon[0].Employment_Details__r = [];
//                         $scope.AccountContactData[i].Lcon[0].Employment_Details__r.push({
//                             Organization_Name__c:""
//                         });
//                     }
//                     // if($scope.AccountContactData[i].Lcon[0].Publications_Patents__r==undefined){
//                     //     $scope.AccountContactData[i].Lcon[0].Publications_Patents__r = [];
//                     //     $scope.AccountContactData[i].Lcon[0].Publications_Patents__r.push({
//                     //         Description__c:""
//                     //     });
//                     // }
//                 }
//         }
//             $scope.$apply();
//             $("#collapse1,#collapse2,#collapse3,#collapse4,#collapse5").removeClass();
//             $("#collapse1,#collapse2,#collapse3,#collapse4,#collapse5").addClass('accordion-collapse collapse');
//         });
//     }
//     $scope.addEducationRow=function(parentIndex,index){
//         debugger
//         $scope.AccountContactData[parentIndex].Lcon[index].Education_Details__r.push({
//             Institution_Name__c:""
//         });
//         $scope.$apply();
//         debugger
//     }
//     $scope.removeEducationRow=function(index,ParentIndex,GrandIndex){
// debugger
//         if($scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Education_Details__r.length!=1){
//             if($scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Education_Details__r[index].Id!=undefined && $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Education_Details__r[index].Id!=''){
//                 var EducationId=$scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Education_Details__r[index].Id;
//                 IndustrialFellowshipController.deleteEducation(EducationId, function (result, event) {
//                     $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Education_Details__r.splice(index,1);
//                     $scope.$apply();
//                 });
//             }
//             else
//         {
//             $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Education_Details__r.splice(index,1);
//             $scope.$apply();
//         }
//         }
//     }

//     $scope.addEmploymentRow=function(parentIndex,index){
//         debugger
//         $scope.AccountContactData[parentIndex].Lcon[index].Employment_Details__r.push({
//             Organization_Name__c:""
//         });
//         $scope.$apply();
//         debugger
//     }
//     $scope.removeEmploymentRow=function(index,ParentIndex,GrandIndex){
//         debugger
//         if($scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Employment_Details__r.length!=1){
//             if($scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Employment_Details__r[index].Id!=undefined && $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Employment_Details__r[index].Id!=''){
//                 var EducationId=$scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Employment_Details__r[index].Id;
//                 IndustrialFellowshipController.deleteEmployment(EducationId, function (result, event) {
//                     $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Employment_Details__r.splice(index,1);
//                     $scope.$apply();
//                 });
//             }
//             else
//         {
//             $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Employment_Details__r.splice(index,1);
//             $scope.$apply();
//         }
//         }
// if($scope.AccountContactData[gind].Lcon[pind].Employment_Details__r.length==1){
//     return
// }
// else{
//  $scope.AccountContactData[gind].Lcon[pind].Employment_Details__r.splice(ind,1);
// }
// }

// $scope.addPublicationRow=function(ind,pind,gind){
//     debugger
//     $scope.AccountContactData[gind].Lcon[pind].Publications_Patents__r.push({
//         Description__c:""
//     });
//     $scope.$apply();
//     debugger
// }
// $scope.removePublicationRow=function(index,ParentIndex,GrandIndex){
//     debugger
//     if($scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Publications_Patents__r.length!=1){
//         if($scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Publications_Patents__r[index].Id!=undefined && $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Publications_Patents__r[index].Id!=''){
//             var EducationId=$scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Publications_Patents__r[index].Id;
//             IndustrialFellowshipController.deletePublication(EducationId, function (result, event) {
//                 $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Publications_Patents__r.splice(index,1);
//                 $scope.$apply();
//             });
//         }
//         else
//     {
//         $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Publications_Patents__r.splice(index,1);
//         $scope.$apply();
//     }
//     }
// if($scope.AccountContactData[gind].Lcon[pind].Publications_Patents__r.length==1){
//     return
// }
// else{
//  $scope.AccountContactData[gind].Lcon[pind].Publications_Patents__r.splice(ind,1);
// }
// }
// $scope.saveDetail=function(flag,GrandIndex,ParentIndex){
//     debugger
//     let ContactData=$scope.AccountContactData[GrandIndex].Lcon[ParentIndex];
//     if(ContactData.FirstName==undefined || ContactData.FirstName==''){
//         swal("Required", "Please Enter the First Name of Contact.");
//         return;
//     }
//     if(ContactData.LastName==undefined || ContactData.LastName==''){
//         swal("Required", "Please Enter Last Name of Contact.");
//         return;
//     }
//     if(ContactData.Email==undefined || ContactData.Email==''){
//         swal("Required", "Please Enter Email of Contact.");
//         return;
//     }
//     if(ContactData.Actual_Position__c==undefined || ContactData.Actual_Position__c==''){
//         swal("Required", "Please enter the actual position.");
//         return;
//     }
//     if(ContactData.MailingPostalCode==undefined || ContactData.MailingPostalCode==''){
//         swal("Required", "Please Enter Country Postal Code.");
//         return;
//     }
//     if(ContactData.MailingCountry==undefined || ContactData.MailingCountry==''){
//         swal("Required", "Please select country.");
//         return;
//     }
// if(Employment_Details__r2.Organization_Name__c=='' || Employment_Details__r2.Organization_Name__c==undefined){
//     swal("Required", "Please enter employment details");
//     return;
// }
// let AccountId=$scope.AccountContactData[GrandIndex].AccId;
// var Education_Details__r2=Education_Details__r2=$scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Education_Details__r;
// // if(flag=='educationDet'){
//     if(Education_Details__r2==undefined){
//         Education_Details__r2=[];
//         Education_Details__r2.push({Institution_Name__c:""});
//     }
//     for(var i=0;i<Education_Details__r2.length;i++){
//         delete(Education_Details__r2[i]['$$hashKey']);
//     }
//     if(flag=='education'){
//         for(var i=0;i<Education_Details__r2.length;i++){
//             if(Education_Details__r2[i].Institution_Name__c==undefined || Education_Details__r2[i].Institution_Name__c==''){
//                 swal("Required", "Please enter Institute Name.");
//                 return;
//             }
//             if(Education_Details__r2[i].Area_of_specialization__c==undefined || Education_Details__r2[i].Area_of_specialization__c==''){
//                 swal("Required", "Please Enter your specialization.");
//                 return;
//             }
//             if(Education_Details__r2[i].Degree__c==undefined || Education_Details__r2[i].Degree__c==''){
//                 swal("Required", "Please Enter your Degree");
//                 return;
//             }
//             if(Education_Details__r2[i].Start_Year__c==undefined || Education_Details__r2[i].Start_Year__c==''){
//                 swal("Required", "Please Enter Start Year.");
//                 return;
//             }
//             if(Education_Details__r2[i].End_Year__c==undefined || Education_Details__r2[i].End_Year__c==''){
//                 swal("Required", "Please Enter End Year.");
//                 return;
//             }
//         }
//     }
// // }
// // else if(flag=='employment'){
//     var Employment_Details__r2=$scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Employment_Details__r;
//     if(Employment_Details__r2==undefined){
//         Employment_Details__r2=[];
//         Employment_Details__r2.push({Organization_Name__c:""});
//     }
//     for(var i=0;i<Employment_Details__r2.length;i++){
//         delete(Employment_Details__r2[i]['$$hashKey']);
//     }
//     if(flag=='employment'){
//         for(var i=0;i<Employment_Details__r2.length;i++){
//             if(Employment_Details__r2[i].Organization_Name__c==undefined || Employment_Details__r2[i].Organization_Name__c==''){
//                 swal("Required", "Please enter organization name.");
//                 return;
//             }
//             if(Employment_Details__r2[i].Position__c==undefined || Employment_Details__r2[i].Position__c==''){
//                 swal("Required", "Please Enter your position.");
//                 return;
//             }
//             if(Employment_Details__r2[i].Start_Year__c==undefined || Employment_Details__r2[i].Start_Year__c==''){
//                 swal("Required", "Please Enter Start Year.");
//                 return;
//             }
//             if(Employment_Details__r2[i].End_Year__c==undefined || Employment_Details__r2[i].End_Year__c==''){
//                 swal("Required", "Please Enter End Year.");
//                 return;
//             }
//         }
//     }
// }
// else if(flag=='publication'){
// var Publications_Patents__r2=$scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Publications_Patents__r;
// if(Publications_Patents__r2==undefined){
//     Publications_Patents__r2=[];
//     Publications_Patents__r2.push({ Description__c:""});
// }
// for(var i=0;i<Publications_Patents__r2.length;i++){
//     delete(Publications_Patents__r2[i]['$$hashKey']);
// }
// if(flag=='publication'){
//     for(var i=0;i<Publications_Patents__r2.length;i++){
//         if(Publications_Patents__r2[i].Description__c==undefined || Publications_Patents__r2[i].Description__c==''){
//             swal("Required", "Please enter publication details.");
//             return;
//         }
//     }
// }
// }

// delete(ContactData['Publications_Patents__r']);
// delete(ContactData['Employment_Details__r']);
// delete(ContactData['Education_Details__r']);
// delete(ContactData['$$hashKey']);
// IndustrialFellowshipController.saveAccountContactEduOtherDetList($rootScope.projectId,AccountId,ContactData,Employment_Details__r2,Education_Details__r2,flag, function (result, event) {
//    debugger
//     console.log('save contact details');
//     console.log(result);
//     console.log(event);
//     if(event.status){
//         $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Id=result;
//         if(flag=='basicDet'){
//             console.log('before get education data');
//             console.log($scope.AccountContactData);
//             $('#contactBasicDet'+GrandIndex+''+ParentIndex+'').hide('slow');
//             $('#educationDet'+GrandIndex+''+ParentIndex+'').show('slow');
//             $scope.getEducationQualificationData(GrandIndex,ParentIndex,result);
//             if($rootScope.proposalStage == false){
//                 swal("Contact", "Basic details of the contact has been saved successfully.");
//             }
//             console.log('get education data');
//             console.log($scope.AccountContactData);
// if($scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Education_Details__r==undefined){
//     $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Education_Details__r = [];
//     $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Education_Details__r.push({
//         Institution_Name__c:""
//     });
// }
// if($scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Education_Details__r.length<1){
//     $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].push({
//         Institution_Name__c:""
//     });
// }
// if($scope.AccountContactData[i].Lcon[ParentIndex].Employment_Details__r==undefined){
//     $scope.AccountContactData[i].Lcon[ParentIndex].Employment_Details__r = [];
//     $scope.AccountContactData[i].Lcon[ParentIndex].Employment_Details__r.push({
//         Organization_Name__c:""
//     });
// }
// if($scope.AccountContactData[i].Lcon[ParentIndex].Publications_Patents__r==undefined){
//     $scope.AccountContactData[i].Lcon[ParentIndex].Publications_Patents__r = [];
//     $scope.AccountContactData[i].Lcon[ParentIndex].Publications_Patents__r.push({
//         Description__c:""
//     });
// }
// }
// else if(flag=='education'){
//     $('#educationDet'+GrandIndex+''+ParentIndex+'').hide('slow');
//     $('#employementEx'+GrandIndex+''+ParentIndex+'').show('slow');
//     if($rootScope.proposalStage == false){
//         swal("Contact", "Education details of the contact has been saved successfully.");
//     }
// if($scope.AccountContactData[i].Lcon[ParentIndex].Employment_Details__r==undefined){
//     $scope.AccountContactData[i].Lcon[ParentIndex].Employment_Details__r = [];
//     $scope.AccountContactData[i].Lcon[ParentIndex].Employment_Details__r.push({
//         Organization_Name__c:""
//     });
//                     // }
//                     console.log('education object data')
//                     console.log($scope.AccountContactData);
//                     console.log($scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Education_Details__r);
//                     $scope.getEmploymentData(GrandIndex,ParentIndex,result);
//                 }
//                 else if(flag=='employment'){
//                     $('#employementEx'+GrandIndex+''+ParentIndex+'').hide('slow');
//                     $('#publication'+GrandIndex+''+ParentIndex+'').show('slow');
//                     // if($scope.AccountContactData[i].Lcon[ParentIndex].Publications_Patents__r==undefined){
//                     //     $scope.AccountContactData[i].Lcon[ParentIndex].Publications_Patents__r = [];
//                     //     $scope.AccountContactData[i].Lcon[ParentIndex].Publications_Patents__r.push({
//                     //         Description__c:""
//                     //     });
//                     // }
//                     $scope.getPublicationData(GrandIndex,ParentIndex,result);
//                     if($rootScope.proposalStage == false){
//                         swal("Contact", "Employment details of the contact has been saved successfully.");
//                     }
//                 }
//                 else if(flag=='publication'){
//                     $('#publication'+GrandIndex+''+ParentIndex+'').hide('slow');
//                     $('#contactBasicDet'+GrandIndex+''+ParentIndex+'').show('slow');
//                     if($rootScope.proposalStage == false){
//                         swal("Contact", "Publication details of the contact has been saved successfully.");
//                     }
//                 }

//                 $scope.$apply();
//             }

//         });
//     }
//     $scope.addContact=function(index){
//         $scope.AccountContactData[index].Lcon.push({
//             AccountId:$scope.AccountContactData[index].AccId,
//             FirstName:"",
//             Education_Details__r:[{
//                 Institution_Name__c:""
//             }],
//             Employment_Details__r:[{
//                 Organization_Name__c:""
//             }],
//             // Publications_Patents__r:[{
//             //     Description__c:""
//             // }]
//         });
//     }
//     $scope.redirectPageURL = function (pageName){
//         var link = document.createElement("a");
//         link.id = 'someLink'; //give it an ID!
//         link.href = "#/" + pageName;
//         link.click();
//     }
//     $scope.saveAndNext=function(page){
//         for(var i=0;i<$scope.AccountContactData.length;i++){
//             for(j=0; j<$scope.AccountContactData[i].Lcon.length;j++){
//                 if($scope.AccountContactData[i].Lcon[j].LastName==undefined ||$scope.AccountContactData[i].Lcon[j].LastName==''){
//                     swal("Required", "Last name is mandatory.");
//                     return;
//                 }
//             }
//         }
//         $scope.redirectPageURL(page);
//     }
//     $scope.updateContactDet=function(parentIndex,index){
//         for(var i=0;i<$scope.AccountContactData[parentIndex].Lcon.length;i++){
//             $('#contactBasicDet'+parentIndex+''+i+'').hide('slow');
//             $('#educationDet'+parentIndex+''+i+'').hide('slow');
//             $('#employementEx'+parentIndex+''+i+'').hide('slow');
//             $('#publication'+parentIndex+''+i+'').hide('slow');
//         }
//         $("#contactBasicDet"+parentIndex+""+index+"").toggle('slow');
//     }
//     $scope.getEducationQualificationData=function(GrandIndex,ParentIndex,ContactId){
//         IndustrialFellowshipController.getEducationQualificationData(ContactId, function (result, event) {
//             console.log(result);
//             console.log(event);
//             debugger
//             if(event.status){
//             if($scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Education_Details__r==undefined){
//                 $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Education_Details__r = [];
//                 if(result.length<1){
//                      $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Education_Details__r.push({
//                     Institution_Name__c:""
//                 });
//                 $scope.$apply();
//                 }else{
//                     for(var i=0;i<result.length;i++){
//                         if(result[i].Start_Year__c != undefined || result[i].Start_Year__c != ""){
//                             result[i].Start_Year__c = Number(result[i].Start_Year__c);
//                         }
//                         if(result[i].End_Year__c != undefined || result[i].End_Year__c != ""){
//                             result[i].End_Year__c = Number(result[i].End_Year__c);
//                         }
//                     }
//                     $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Education_Details__r=result;
//                     $scope.$apply();
//                 }
//             }
//             else
//             {

//             }
//             // $scope.cloneData= JSON.stringify($scope.AccountContactData);
//         }
//         });
//     }
//     $scope.getEmploymentData=function(GrandIndex,ParentIndex,ContactId){
//         IndustrialFellowshipController.getEmploymentData(ContactId, function (result, event) {
//             console.log(result);
//             console.log(event);
//             debugger
//             if(event.status){
//                 // $scope.AccountContactData=JSON.parse($scope.cloneData);
//             if($scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Employment_Details__r==undefined){
//                 $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Employment_Details__r = [];
//                 if(result.length>0){
//                     for(var i=0;i<result.length;i++){
//                         if(result[i].Start_Year__c != undefined || result[i].Start_Year__c != ""){
//                             result[i].Start_Year__c = Number(result[i].Start_Year__c);
//                         }
//                         if(result[i].End_Year__c != undefined || result[i].End_Year__c != ""){
//                             result[i].End_Year__c = Number(result[i].End_Year__c);
//                         }
//                     }
//                     $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Employment_Details__r=result;

//                 }
//                 else{
//                     $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Employment_Details__r.push({
//                         Organization_Name__c:""
//                                     });
//                 }
//             }
//             else
//             {

//             }
//             // $scope.cloneData= JSON.stringify($scope.AccountContactData);
//             $scope.$apply();
//     }
// });
//     }
//     $scope.getPublicationData=function(GrandIndex,ParentIndex,ContactId){
//         IndustrialFellowshipController.getPublicationData(ContactId, function (result, event) {
//             console.log(result);
//             console.log(event);
//             debugger
//             if(event.status){
//             if($scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Publications_Patents__r==undefined){
//                 $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Publications_Patents__r = [];
//                 if(result.length<1){
//                      $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Publications_Patents__r.push({
//                         Description__c:""
//                 });
//                 }
//                 else
//                 {
//                     for(var i=0;i<result.length;i++){
//                         if(result[i].Description__c != undefined || result[i].Description__c != ""){
//                             result[i].Description__c = result[i].Description__c ? result[i].Description__c.replaceAll('&lt;','<').replaceAll('lt;','<').replaceAll('&gt;','>').replaceAll('gt;','>').replaceAll('&amp;','&').replaceAll('amp;','&').replaceAll('&quot;','\'') : result[i].Description__c;
//                         }
//                     }
//                     $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Publications_Patents__r=result;
//                 }
//             }
//             else
//             {

//             }
//             $scope.$apply();
//     }
// });
//     }
// $scope.deleteContact=function(GrandIndex,ParentIndex){
//     debugger
//     swal({
//         title: "Are you sure?",
//         text: "Once deleted, you will not be able to recover this contact!",
//         icon: "warning",
//         buttons: true,
//         dangerMode: true,
//       })
//       .then((willDelete) => {
//         if (willDelete) {
//           swal("Contact has been deleted successfully!", {
//             icon: "success",
//           });
//           if($scope.AccountContactData[GrandIndex].Lcon[ParentIndex].length!=1){
//             if($scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Id!=undefined && $scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Id!=''){
//                 var ContactId=$scope.AccountContactData[GrandIndex].Lcon[ParentIndex].Id;
//                 IndustrialFellowshipController.deleteContact(ContactId, function (result, event) {
//                     $scope.AccountContactData[GrandIndex].Lcon.splice(ParentIndex,1);
//                     $scope.$apply();
//                 });
//             }
//             else
//         {
//             $scope.AccountContactData[GrandIndex].Lcon.splice(ParentIndex,1);
//             $scope.$apply();
//         }
//         }
//         } else {
//          return;
//         }
//       });


// }
// $scope.getAccountContactEduOtherDetList();

// $scope.backComp=function(GrandIndex,index){
//     debugger
//     $("#educationDet"+GrandIndex+""+index+"").hide();
//     $("#contactBasicDet"+GrandIndex+""+index+"").show();
// }

// $scope.backCompEmployment=function(GrandIndex,index){
//     debugger
//     $("#employementEx"+GrandIndex+""+index+"").hide();
//     $("#educationDet"+GrandIndex+""+index+"").show();
// }

// $scope.backCompPublication=function(GrandIndex,index){
//     debugger
//     $("#publication"+GrandIndex+""+index+"").hide();
//     $("#employementEx"+GrandIndex+""+index+"").show();
// }

// var inputQuantity = [];
// $(function() {
//   $(".zipcode-number").on("keyup", function (e) {
//     var $field = $(this),
//         val=this.value,
//         $thisIndex=parseInt($field.data("idx"),10);
//     if (this.validity && this.validity.badInput || isNaN(val) || $field.is(":invalid") ) {
//         this.value = inputQuantity[$thisIndex];
//         return;
//     }
//     if (val.length > Number($field.attr("maxlength"))) {
//       val=val.slice(0, 5);
//       $field.val(val);
//     }
//     inputQuantity[$thisIndex]=val;
//   });
// });