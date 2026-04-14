    angular.module('cp_app').controller('ConsortialCtrl', function ($scope, $rootScope) {
        debugger;
        $scope.countrytype = countrytype;
        $scope.siteURL = siteURL;
        $scope.isIndiaActive = true;
        $scope.contactDetails = {};
        $scope.accountDetails = {};
        $scope.contactcvDetails={};
        $scope.accountDetailsIndia = {
            'Country_Type__c': 'India'
        };
        $scope.accountDetailsGermany = {};
        $scope.contactDetailsIndia = {};
        $scope.contactDetailsGermany = {};
        $rootScope.projectId;
        $rootScope.countrytype;
        $scope.disable = false;
        $rootScope.secondstage;

        //CREATE ACCOUNT ::-
        $scope.createAccounts = function () {
            debugger;
            ApplicantPortal_Contoller.insertAccount($scope.accountDetails, function (result, event) {
                if (event.status && result != null) {
                    debugger;
                    $scope.showAccount = false;
                    $scope.showContact = true;

                    $scope.accountDetails = result;
                    if ($scope.isIndiaActive) {
                        $scope.accountDetailsIndia = result;
                    } else {
                        $scope.accountDetailsGermany = result;
                    }
                    $scope.contactList.push({
                        'FirstName': '',
                        'AccountId': $scope.accountDetails.Id
                    });
                    $scope.$apply();
                }
            }, {
                escape: true
            });
        }

        //CREATE CONTACT ::-
        $scope.createContacts = function () {
            debugger;
            $scope.contactList;
            for (let i = 0; i < $scope.contactList.length; i++) {
                delete($scope.contactList[i]['$$hashKey']);
            }

            ApplicantPortal_Contoller.insertContact($scope.contactList, function (result, event) {
                if (event.status && result != null) {
                    debugger;
                    Swal.fire(
                        'Success',
                        'Submitted successfully.',
                        'success'
                    );

                    $scope.contactDetails = result;
                    if ($scope.isIndiaActive) {
                        $scope.contactDetailsIndia = result;
                    } else {
                        $scope.contactDetailsGermany = result;
                    }
                    $scope.$apply();
                }
            }, {
                escape: true
            });
        }

        //SHOW FORM ::-
        //  $scope.ConsortiaDetials = {Industry__c:" ",Academia__c:" ",Is_DSIR_Available__c:" ",DSIR_Recoginition_Details__c:" ",name:" ",Phone:" ","Contacts" : [ {FirstName:" ",LastName:" ",Email:" ",Phone:" "} ]};
        $scope.accountDetailstoInsert = [{
            Industry__c: " ",
            Academia__c: " ",
            Is_DSIR_Available__c: " ",
            DSIR_Recoginition_Details__c: " ",
            name: " ",
            Phone: " ",
            Country_Type__c: " "
        }]
        $scope.contactDetailstoInsert = [{
            FirstName: " ",
            LastName: " ",
            Email: " ",
            Phone: " "
        }]
        $scope.showIndiaForm = function () {
            debugger;
            $scope.showAccount = true;
            $scope.accountDetails = $scope.accountDetailsIndia;
            $scope.contactDetails = $scope.contactDetailsIndia;
            $scope.accountDetails.Country_Type__c = 'India';
            $scope.showContact = false;
            $scope.isIndiaActive = true;
        }

        $scope.showGermanForm = function () {
            debugger;
            $scope.showAccount = true;
            $scope.accountDetails = $scope.accountDetailsGermany;
            $scope.contactDetails = $scope.contactDetailsGermany;
            $scope.accountDetails.Country_Type__c = 'Germany';
            $scope.showContact = false;
            $scope.isIndiaActive = false;
        }
        $scope.contactList = [];
        $scope.addRow = function (param1, param2) {
            debugger;
            // $scope.contactList.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
            // $scope.ConsortiaDetials.Contacts.push({'FirstName':'','AccountId':$scope.accountDetails.Id});
            $scope.consortiaDetails[param1].Contacts.push({
                'FirstName': '',
                'AccountId': $scope.consortiaDetails[param1].Id
            });
        }

        $scope.deleteRow = function (param1, param2) {
            debugger;
            if ($scope.consortiaDetails[param1].Contacts.length > 1){
                if($scope.consortiaDetails[param1].Contacts[param2].Id != undefined)
                    $scope.deleteContact($scope.consortiaDetails[param1].Contacts[param2].Id);
                $scope.consortiaDetails[param1].Contacts.splice(param2, 1);
            }
                

        }

        $scope.createcontactAccounts = function () {
            ApplicantPortal_Contoller.insertAccountAndContact($scope.accountDetailstoInsert, $scope.contactDetailstoInsert, function (result, event) {
                if (event.status && result != null) {
                    debugger;
                }
            }, {
                escape: true
            });
        }
        $scope.openAcademiaPopup = function(index){
            debugger;
            if($scope.consortiaDetails[index].Academia__c == true){
                $scope.consortiaDetails[index].Industry__c = false;
                $scope.saveAccountup($scope.consortiaDetails[index]);
                $scope.openPopup('Institute',index,'');
                
            }
        }
        $scope.openCompanyPopup = function(index){
            debugger;
            if($scope.consortiaDetails[index].Industry__c == true){
                $scope.consortiaDetails[index].Academia__c = false;
                $scope.saveAccountup($scope.consortiaDetails[index]);
                $scope.openPopup('companyProfile',index,'');
                
            }
        }

        $scope.getPatnerDetails = function () {
            debugger;
            $scope.consortiaDetails = [];
            ApplicantPortal_Contoller.getPatnerDetails($rootScope.userId, function (result, event) {
                
                if (event.status) {
                    debugger;

                    if (result == null || result.length == 0) {
                        $scope.consortiaDetails.push({
                            "Name": " ",
                            "Phone": " ",
                            Contacts: [{
                                "FirstName": " ",
                                "LastName": " "
                            }]
                        });
                    } else {
                        for(var i=0;i<result.length;i++){
                            if(result[i].Contacts == undefined){
                                result[i].Contacts =[{"FirstName": " ","LastName": " "}]
                            }
                        }
                        $scope.consortiaDetails = result;
                        if ($scope.consortiaDetails.Contacts == undefined) {

                        }
                    }
                    $scope.$apply();
                }
            }, {
                escape: true
            })
        }

        $scope.deleteContact = function(conid){
            ApplicantPortal_Contoller.deleteContact(conid, function (result, event) {
                if (event.status) {
                    debugger;
                    Swal.fire(
                        'Success',
                        'Deleted Succesfully.',
                        'success'
                    );
                    $scope.$apply();
                }
            }, {
                escape: true
            })
        }

        $scope.deleteAccount = function(accId, contactIdList){
            ApplicantPortal_Contoller.deleteAccountDetails(accId,contactIdList, function (result, event) {
                if (event.status) {
                    debugger;
                    Swal.fire(
                        'Success',
                        'Deleted Succesfully.',
                        'success'
                    );
                    $scope.$apply();
                }
            }, {
                escape: true
            })
        }

        $scope.getPatnerDetails();
        $scope.addAccountRow = function () {
            debugger;
            if($scope.consortiaDetails.length >5){
                Swal.fire(
                    'Error',
                    'Cannot add more than 6.',
                    'Error'
                );
                return;
            }
            $scope.saveAccountup($scope.consortiaDetails[$scope.consortiaDetails.length -1]);
            $scope.consortiaDetails.push({
                "Name": " ",
                "Phone": " ",
                Contacts: [{
                    "FirstName": " ",
                    "LastName": " "
                }]
            })
        }

        $scope.deleteAccountRow = function (indexNo) {
            debugger;
            if($scope.consortiaDetails[indexNo].Id != undefined){
                if($scope.consortiaDetails[indexNo].Contacts != undefined){
                    var conIdList = [];
                    for(var i=0;i<$scope.consortiaDetails[indexNo].Contacts.length;i++){
                        conIdList.push($scope.consortiaDetails[indexNo].Contacts[i].Id);
                    }
                    $scope.deleteAccount($scope.consortiaDetails[indexNo].Id,conIdList);
                }else{
                    $scope.deleteAccount($scope.consortiaDetails[indexNo].Id,'');
                }
            }
            $scope.consortiaDetails.splice(indexNo, 1);

        }
        
        var count = 0;
        $scope.submitPartnerDetails = function () {
            debugger;
            $scope.conList = [];
            $scope.accList = [];
            for (let i = 0; i < $scope.consortiaDetails.length; i++) {
                debugger;
                delete($scope.consortiaDetails[i]['RecordTypeId']);

                if ($scope.consortiaDetails[i].Contacts.length > 0) {
                    for (let j = 0; j < $scope.consortiaDetails[i].Contacts.length; j++) {
                        if ($scope.consortiaDetails[i].Contacts[j].LastName != undefined) {
                            $scope.conList.push($scope.consortiaDetails[i].Contacts[j])
                        }
                    }
                    for (let i = 0; i < $scope.conList.length; i++) {
                        delete($scope.conList[i]['$$hashKey']);
                    }

                } else {
                    if ($scope.consortiaDetails[i].Name != undefined) {
                        $scope.accList.push($scope.consortiaDetails[i]);
                    }
                }


            }
            ApplicantPortal_Contoller.insertAccount($scope.accList, $scope.conList, function (result, event) {
                if (event.status) {
                    debugger;
                    Swal.fire(
                        'Success',
                        'Submitted successfully.',
                        'success'
                    );
                    $scope.redirectPageURL('ConsortiumPartnerInformation');
                    $scope.$apply();
                }
            }, {
                escape: true
            })
        }

        $scope.submitAllPatnerDetials = function () {
            $scope.consortiaDetails;
            debugger;
            $scope.ConsortiaDetailsList = [];
            if($scope.consortiaDetails.length < 4 || $scope.consortiaDetails.length > 6){
                Swal.fire(
                    '',
                    'Minimum 4 and Maximaum 6 applicants are allowed.',
                    'error'
                );
                return;
            }
            for(i=0;i<$scope.consortiaDetails.length;i++){
                if($scope.consortiaDetails[i].Industry__c.length >1){
                    Swal.fire(
                        '',
                        'error',
                        'error'
                    );
                    return;
                }
            }

            for (let i = 0; i < $scope.consortiaDetails.length; i++) {
                var consortiaAllDetails = {
                    "company": {
                        "Name": " ",
                        "Website": " ",
                        "Country_Type__c":" ",
                        "Is_DSIR_Available__c":"",
                        "DSIR_Recoginition_Details__c":"",
                        "Proposals__c": $rootScope.projectId
                    },
                    "partnerDetails": [{
                        "LastName": " ",
                        "Email": " ",
                        "Proposals__c": $rootScope.projectId
                    }]
                };
                delete($scope.consortiaDetails[i]['$$hashKey']);
                delete($scope.consortiaDetails[i]['RecordTypeId']);
                if ($scope.consortiaDetails[i].Name == undefined) {
                    Swal.fire(
                        '',
                        'Please Enter Account Name',
                        'error'
                    );
                    return;
                }
                if ($scope.consortiaDetails[i].Website == undefined) {
                    Swal.fire(
                        '',
                        'Please Enter Website',
                        'error'
                    );
                    return;
                }
                if ($scope.consortiaDetails[i].Country_Type__c == undefined) {
                    Swal.fire(
                        '',
                        'Please Select Country Type',
                        'error'
                    );
                    return;
                }
                if ($scope.consortiaDetails[i].Industry__c == true && $scope.consortiaDetails[i].Country_Type__c == "India" && ($scope.consortiaDetails[i].Is_DSIR_Available__c == false || $scope.consortiaDetails[i].Is_DSIR_Available__c == undefined)) {
                    Swal.fire(
                        '',
                        'Please Check DSIR Available as it is necessary for Indian Industry.',
                        'error'
                    );
                    return;
                }
                if (($scope.consortiaDetails[i].DSIR_Recoginition_Details__c == undefined || $scope.consortiaDetails[i].DSIR_Recoginition_Details__c == "") && $scope.consortiaDetails[i].Is_DSIR_Available__c == true) {
                    debugger;
                    Swal.fire(
                        '',
                        'Please Enter DSIR Recoginition Details',
                        'error'
                    );
                    return;
                }
                debugger;
                if($scope.consortiaDetails[i].Contacts != undefined){
                if ($scope.consortiaDetails[i].Contacts.length > 0) {
                    for (let j = 0; j < $scope.consortiaDetails[i].Contacts.length; j++) {
                        delete $scope.consortiaDetails[i].Contacts[j]['$$hashKey'];
                        if ($scope.consortiaDetails[i].Contacts[j].LastName == undefined) {
                            Swal.fire(
                                '',
                                'Please Enter LastName',
                                'error'
                            );
                            return;
                        }
                        if ($scope.consortiaDetails[i].Contacts[j].Email == undefined) {
                            Swal.fire(
                                '',
                                'Please Enter Email',
                                'error'
                            );
                            return;
                        }
                    }
                    consortiaAllDetails.partnerDetails = $scope.consortiaDetails[i].Contacts;
                    delete($scope.consortiaDetails[i]['Contacts']);
                    consortiaAllDetails.company = $scope.consortiaDetails[i];
                    $scope.ConsortiaDetailsList.push(consortiaAllDetails);
                }
            }
        }

            ApplicantPortal_Contoller.insertConsortiaDetailPage($scope.ConsortiaDetailsList, $rootScope.projectId, function (result, event) {
                if (event.status) {
                    debugger;
                    Swal.fire(
                        'Success',
                        'Submitted successfully.',
                        'success'
                    );
                    $scope.redirectPageURL('Financial_Overview');
                    $scope.$apply();
                }
            }, {
                escape: true
            })
        }

        $scope.openPopup = function (type, index,conIndex) {
            debugger;
            $scope.consortiaDetails[index].shippingCountry = $scope.consortiaDetails[index].Country_Type__c;
            if (type == 'companyProfile' || type == 'Institute') {
                $scope.selectedAccount = $scope.consortiaDetails[index];
                $scope.saveAccount($scope.selectedAccount, type);
            }


            if (type == 'cvPage') {
                $scope.selectedContact = $scope.consortiaDetails[index].Contacts[conIndex];
                $scope.saveContact($scope.selectedContact,$scope.consortiaDetails[index].Id);
                
            }

        }

        $scope.saveAccount = function (accDetails, type) {
            debugger;
            delete(accDetails['$$hashKey']);
            delete(accDetails['RecordTypeId']);
            var conRec = accDetails.Contacts;
            delete(accDetails['Contacts']);
            if(accDetails.Name.length < 2){
                if (type == 'companyProfile') {
                    $scope.applicantDetails = {};
                    $scope.contactInstituteDetails = {};
                    var myModal = new bootstrap.Modal(document.getElementById('companyProfile'))
                    myModal.show()
                }
                if (type == 'Institute') {
                    var myModal = new bootstrap.Modal(document.getElementById('Institute'))
                    myModal.show()
                }
                return;

            }
            if(type == 'addRow'){
                delete accDetails.Contacts
            }
            ApplicantPortal_Contoller.saveAccount(accDetails,$rootScope.projectId, function (result, event) {
                if (event.status) {
                    debugger;
                    if(result.Id != undefined && type == 'addRow'){
                        $scope.saveContact(conRec,result.Id);
                    }
                    
                    $scope.getPatnerDetails();
                    if (type == 'companyProfile') {
                        $scope.applicantDetails = result;
                        var myModal = new bootstrap.Modal(document.getElementById('companyProfile'));
                        myModal.show()
                    }
                    if (type == 'Institute') {
                        var myModal = new bootstrap.Modal(document.getElementById('Institute'));
                        $scope.contactInstituteDetails = result;
                        myModal.show()
                    }
                    $scope.$apply();
                }
            }, {
                escape: true
            })
        }

        $scope.saveContact = function (salectedContact,accountId) {
            debugger
            if(salectedContact.$$hashKey != undefined){
                delete(salectedContact['$$hashKey']);
            }

            ApplicantPortal_Contoller.saveContact(salectedContact,accountId,$rootScope.projectId, function (result, event) {
                if (event.status) {
                    debugger;
                    $scope.selContact = result;
                    $scope.getCvDetails();
                    var myModal = new bootstrap.Modal(document.getElementById('cvPage'))
                    myModal.show()
                    $scope.$apply();
                }
            }, {
                buffer: false, escape: true, timeout: 30000
            })
        }
        //Company Profile js
        $scope.siteURL = siteURL;
        $scope.getApplicantDetails = function () {
            ApplicantPortal_Contoller.getCompanyApplicantDetails($rootScope.userId, function (result, event) {
                if (event.status) {
                    debugger;
                    $scope.applicantDetails = result;
                    $scope.$apply();
                }
            }, {
                escape: true
            })
        }
        $scope.getApplicantDetails();

        $scope.applicantDetails = {};
        $scope.saveDetails = function () {
            debugger;
            // if ($scope.applicantDetails.DSIR_Recoginition_Details__c == undefined || $scope.applicantDetails.DSIR_Recoginition_Details__c == "") {
            //     Swal.fire(
            //         '',
            //         'Please Enter DSIR Recoginition Details',
            //         'error'
            //     );
            //     return;
            // }

            ApplicantPortal_Contoller.insertApplicant($scope.applicantDetails, function (result, event) {
                if (event.status) {
                    debugger;
                    Swal.fire(
                        'Success',
                        'Submitted successfully.',
                        'success'
                    );
                    // $scope.redirectPageURL('Financial_Overview');
                    $scope.applicantDetails = result;
                    
                    $scope.$apply();

                    $('#companyProfile').modal('hide');
                }
            },
                {escape: true}
            )
        }

        $scope.redirectPageURL = function (pageName) {
            debugger;
            var link = document.createElement("a");
            link.id = 'someLink'; //give it an ID!
            link.href = "#/" + pageName;
            link.click();
        }

        // CV page ------------------------------------

        $scope.contactDetails = {
            'FirstName': ''
        };
        $scope.educationDetails = {
            'Name': ''
        };
        $scope.employmentDetails = {
            'Name': ''
        };
        $scope.publicationDetails = {
            'Name': ''
        };

        //SAVE CONTACTDETAILS

        $scope.getContactDetails = function () {
            ApplicantPortal_Contoller.getContactDetails($rootScope.userId, function (result, event) {
                if (event.status) {
                    debugger;

                    $scope.contactDetails = result;
                    $scope.contactDetails = {
                        'FirstName': result.FirstName,
                        'LastName': result.LastName,
                        'Actual_Position__c': result.Actual_Position__c,
                        'MailingCity': result.MailingCity,
                        'MailingState': result.MailingState,
                        'MailingCountry': result.MailingCountry,
                        'Id': result.Id
                    };
                    if (result.Education_Details__r != undefined)
                        $scope.educationList = result.Education_Details__r;
                    if (result.Employment_Details__r != undefined)
                        $scope.employmentList = result.Employment_Details__r;
                    if (result.Publications_Patents__r != undefined)
                        $scope.publicationList = result.Publications_Patents__r;
                    $scope.$apply();
                }
            }, {
                escape: true
            })
        }

        $scope.getContactDetails();
        $scope.saveCVDetails = function () {
            debugger;
            $scope.educationList;
            $scope.contactcvDetails;
            $scope.employmentList;
            $scope.publicationList;

            //FOR EMPLOYMENT
            for (let i = 0; i < $scope.educationList.length; i++) {
                delete($scope.educationList[i]['$$hashKey']);
            }

            //FOR EMPLOYMENT
            for (let i = 0; i < $scope.employmentList.length; i++) {
                delete($scope.employmentList[i]['$$hashKey']);
            }

            //FOR PUBLICATIONS / PATENTS
            for (let i = 0; i < $scope.publicationList.length; i++) {
                delete($scope.publicationList[i]['$$hashKey']);
            }
                if($scope.contactcvDetails.Employment_Details__r != undefined){
                    delete $scope.contactcvDetails.Employment_Details__r;
                }
                if($scope.contactcvDetails.Education_Details__r != undefined){
                    delete $scope.contactcvDetails.Education_Details__r;
                }
                if($scope.contactcvDetails.Publications_Patents__r != undefined){
                    delete $scope.contactcvDetails.Publications_Patents__r;
                }                

                let contacts = [];
                contacts.push($scope.contactcvDetails);

            ApplicantPortal_Contoller.insertContactDetails(contacts, $scope.educationList, $scope.employmentList, $scope.publicationList, function (result, event) {
                if (event.status) {
                    debugger;
                    Swal.fire(
                        'Success',
                        'Submitted successfully.',
                        'success'
                    );
                    $scope.contactcvDetails = result;
                   
                        $('#cvPage').modal('hide');
                        
                    $scope.$apply();
                }
            }, {
                escape: true
            })
        }

        //EDUCATION
        $scope.educationList = [{
            'Name': '',
            'Contact__c': $scope.contactDetails.id
        }];
        $scope.addRowEdu = function () {
            $scope.educationList.push({
                'Name': '',
                'Contact__c': $scope.contactDetails.id
            });
        }

        $scope.deleteRowEdu = function (index) {
            if ($scope.educationList.length > 1)
                $scope.educationList.splice(index, 1);

        }

        //EMPLOYMENT
        $scope.employmentList = [{
            'Name': '',
            'Contact__c': $scope.contactDetails.id
        }];
        $scope.addRowEmp = function () {
            $scope.employmentList.push({
                'Name': '',
                'Contact__c': $scope.contactDetails.id
            });
        }

        $scope.deleteRowEmp = function (index) {
            if ($scope.employmentList.length > 1)
                $scope.employmentList.splice(index, 1);

        }

        //PUBLICATIONS / PATENTS
        $scope.publicationList = [{
            'Name': '',
            'Contact__c': $scope.contactDetails.id
        }];
        $scope.addRowPublication = function () {
            $scope.publicationList.push({
                'Name': '',
                'Contact__c': $scope.contactDetails.id
            });
        }

        $scope.deleteRowPublication = function (index) {
            if ($scope.publicationList.length > 1)
                $scope.publicationList.splice(index, 1);

        }

        //GET CONTACTDETAILS
        $scope.getContactDetails = function () {
            ApplicantPortal_Contoller.getContactDetails($scope.hashCode, function (result, event) {
                if (event.status) {
                    debugger;
                    $scope.$apply();
                }
            }, {
                escape: true
            })
        }


        //----------------Consortium partner details---------
        $scope.contactDetails = {};
    
        $scope.saveInstituteDetails = function(){
            debugger;
            
                delete ($scope.contactInstituteDetails['Education_Details__r']);
                delete ($scope.contactInstituteDetails['Employment_Details__r']);
                delete ($scope.contactInstituteDetails['Publications_Patents__r']);
            
            ApplicantPortal_Contoller.insertPartnerInformation($scope.contactInstituteDetails, function(result,event){
                if(event.status){
                    debugger;
                    Swal.fire(
                        'Success',
                        'Submitted successfully.',
                        'success'
                    );
                    debugger;
                    $('#Institute').modal('hide');
                    $scope.contactDetails = result;
                    $scope.$apply();
                }
            },
              {escape: true}
           )
        }
    
      /*  $scope.getCVDetails = function(){
            debugger;
            ApplicantPortal_Contoller.getContactDetails($scope.selContact.Id, function(result,event){
                if(event.status){
                    debugger;
                    $scope.contactInstituteDetails = result;
                    $scope.$apply();
                }
            },
              {escape: true}
           )
        }
        $scope.getCVDetails();  */

        $scope.getCvDetails = function () {
            debugger;
            ApplicantPortal_Contoller.getCvDetails($scope.selContact.Id, function (result, event) {
                if (event.status) {
                    debugger;

                    $scope.contactDetails = result;
                    $scope.contactcvDetails = {
                        'FirstName': result.FirstName,
                        'LastName': result.LastName,
                        'Actual_Position__c': result.Actual_Position__c,
                        'MailingCity': result.MailingCity,
                        'MailingStreet': result.MailingStreet,
                        'MailingPostalCode': result.MailingPostalCode,
                        'MailingState': result.MailingState,
                        'MailingCountry': result.MailingCountry,
                        'Id': result.Id
                    };
                    if (result.Education_Details__r != undefined){
                        $scope.educationList = result.Education_Details__r;
                    }else{
                        $scope.educationList = [{
                            'Name': '',
                            'Contact__c': result.Id
                        }];
                    }if (result.Employment_Details__r != undefined){
                        $scope.employmentList = result.Employment_Details__r;
                    }else{
                        $scope.employmentList = [{
                            'Name': '',
                            'Contact__c': result.Id
                        }];
                    }if (result.Publications_Patents__r != undefined){
                        $scope.publicationList = result.Publications_Patents__r;
                    }else{
                        $scope.publicationList =[{
                            'Name': '',
                            'Contact__c': result.Id
                        }];
                    }
                        
                    $scope.$apply();
                }
            }, {
                escape: true
            })
        }


        
        $scope.redirectPageURL = function(pageName){
            debugger;
            var link=document.createElement("a");
            link.id = 'someLink'; //give it an ID!
            link.href="#/"+pageName;
            link.click();
        }

        $scope.saveAccountup = function(consortiaDetails){
            debugger;
            //var accdet = consortiaDetails;
           
            var contacts = consortiaDetails.Contacts;
            
            if(consortiaDetails.Contacts != undefined){
                for (let i = 0; i < contacts.length; i++) {
                delete(contacts[i]['$$hashKey']);
            	}
            }
            
            if(consortiaDetails != undefined){
                var accdet = {"Country_Type__c":consortiaDetails.Country_Type__c,"Email__c":consortiaDetails.Email__c,"Homepage_URL__c":consortiaDetails.Homepage_URL__c,"Name":consortiaDetails.Name};
            }
            if(consortiaDetails.Id != undefined){
                accdet.Id = consortiaDetails.Id;
            }
            ApplicantPortal_Contoller.insertAccountAndContact(accdet, contacts, function (result, event) {
                if(event.status){
                    debugger;
                    $scope.$apply();  
                }
            },
            {escape: true}
           )
}
    });