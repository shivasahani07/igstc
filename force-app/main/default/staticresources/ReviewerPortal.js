var app = angular.module('rp_app');
var sitePrefix = '/apex'
var candidateId;
app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('');
    var rp = $routeProvider;

    for (var i = 0; i < tabValues.length; i++) {
        var pageName = '/' + tabValues[i].Name;

        if (tabValues[i].Apex_class_Name__c != undefined) {
            rp.when(pageName, {

                templateUrl: sitePrefix + pageName,
                controller: tabValues[i].Apex_class_Name__c
            });
        } else {
            rp.when(pageName, {
                templateUrl: sitePrefix + pageName,
            })
        }

    }
});

app.controller('rp_dashboard_ctrl', function ($scope, $rootScope, $timeout, $window, $location, $element) {
    $rootScope.hashcodeReviewer;
    debugger;
   $scope.GetReviewerDetails = function(){
       debugger;
       ReviewerPortal_Controller.GetReviewerDetails(reviewerId, function(result, event){
        if(event.status && result !=null){
            console.log('Result -->'+result);
console.log("reviewer details");
console.log(result);
            // $rootScope.reviewerId =result.Id;
           $rootScope.hashCodeReviewer=result.Login_Hash_Code__c;
           $rootScope.reviewerName=result.Name;
           $rootScope.reviewerEmail=result.Email__c;
           
        }
       },
       {escape:false}
       );
       $scope.config = {}; 
    $scope.config.toolbarGroups = [
    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
    { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
    { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
    { name: 'forms', groups: [ 'forms' ] },
    { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
    { name: 'links', groups: [ 'links' ] },
    { name: 'insert', groups: [ 'insert' ] },
    { name: 'styles', groups: [ 'styles' ] },
    { name: 'colors', groups: [ 'colors' ] },
    { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
    { name: 'tools', groups: [ 'tools' ] },
    { name: 'others', groups: [ 'others' ] },
    { name: 'about', groups: [ 'about' ] }
];
   }
   $scope.GetReviewerDetails();

   $rootScope.candidateId = candidateId;
    $rootScope.reviewersIdd = reviewersIdd;
});  