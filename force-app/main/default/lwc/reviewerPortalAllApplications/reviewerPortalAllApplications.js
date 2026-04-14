import { LightningElement,wire,track, api } from 'lwc';
import getApplicationBasedOnType from '@salesforce/apex/ReviwerPortalController.getApplicationBasedOnType';
import getAllocatedpending from '@salesforce/apex/ReviwerPortalController.getAllocatedpending';
import getAllocatedCompleted from '@salesforce/apex/ReviwerPortalController.getAllocatedCompleted';
import PROPOSAL_STAGE from '@salesforce/schema/Application_Proposal__c.Proposal_Stages__c';
import getUnAllocated from '@salesforce/apex/ReviwerPortalController.getUnAllocated';
import getProposalApplicationforDataTable from '@salesforce/apex/ReviwerPortalController.getProposalApplicationforDataTable';
import getProposalApplication from '@salesforce/apex/ReviwerPortalController.getProposalApplication1';
import Proposed_Date__c from '@salesforce/schema/Application_Proposal__c.Proposed_Date__c';
import getSubmittedApplicationforDataTable from '@salesforce/apex/ReviwerPortalController.getSubmittedApplicationforDataTable';
import Actual_Application_Start_Date__c from '@salesforce/schema/Application_Proposal__c.Actual_Application_Start_Date__c';;
import { NavigationMixin,Navigation } from 'lightning/navigation';


export default class ReviewerPortalAllApplications extends NavigationMixin(LightningElement) {
    @track columns = [   
        { label: 'Name', fieldName: 'AccountName', type: 'url',
        typeAttributes: { label: { fieldName: 'Name' }, tooltip: 'View Name', target:'_blank',
        class: 'slds-truncate', 
        tabIndexed: '0',
        recordId: { fieldName: 'Id' }, // pass the record Id to the click event handler
        onclick: this.handleNameClick.bind(this) // bind the click event handler to the LWC instance
        }},

       { label: 'Stage', fieldName: PROPOSAL_STAGE.fieldApiName },
        
    { label: 'Proposed Date', fieldName: Proposed_Date__c.fieldApiName },
        
    { label: 'Application Start Date', fieldName: Actual_Application_Start_Date__c.fieldApiName },
      
      
    ];

    AppType ='Total Applications';

    unallocatedApps =0;


    handleNameClick(event) {
        const recordId = event.target.dataset.recordid;
        window.open(
            this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                actionName: 'view'
            }
        }),"_blank");
      }
      
      

    @api allocatedPage;
    allocatedApplications =0;

 
    value = 'Two plus Two';
    submittedApplications =0
    draftApplications =0
    totalPendApps=0
    totalcompApps=0
    totalApplications=0;
    availableAccounts =[]
    get options() {
        return [
            { label: '2 + 2', value: 'Two plus Two' },
            { label: 'PECFAIR', value: 'PECFAR' },
            { label: 'SING', value: 'SING' },
            {label: 'Industrial Fellowship', value: 'Industrial Fellowship'},
            {label: 'WISER', value: 'WISER'},
            {label: 'Workshop', value: 'Workshop'},
        ];
    }
    
    handleChange(event) {
        this.value = event.detail.value;
      
            console.log('tyuio'+ event.currentTarget.dataset.name);
             this.recName = event.currentTarget.dataset.name;
             let draftCount=0;
             let submittedCount = 0;
             let unallocatecount =0;
             getUnAllocated({RecordTypeName: this.value}).then(result=> {

                this.unallocatedApps = result.length;
             });
             getApplicationBasedOnType({RecordTypeName: this.value}).then(result=> {
                    console.log('result-->',JSON.stringify(result));
                   this.totalApplications = result.length;
                   result.forEach(element => {
                    console.log('!!!!',element.Submitted__c);
                    if(element.Proposal_Stages__c === 'Draft'){
                    draftCount++;
                    }
                    else if(element.Submitted__c === true){
                        console.log(element.Submitted__c);
                     submittedCount++;
                    }
                    else if(element.Proposal_Stages__c === 'Submitted'){
                    
                     unallocatecount++;
                    }
                   });
                   this.draftApplications =draftCount;
                   this.submittedApplications= submittedCount;
                   //this.unallocatedApps=unallocatecount;
              })
             .catch(error => {
                    console.log('error-->',error);
              });
              getAllocatedpending({RecordTypeName:  this.value}).then(result=>{
                this.totalPendApps= result.length;
                this.allocatedApplications=result.length;
            
               });
               getAllocatedCompleted({RecordTypeName:  this.value}).then(result=>{
                this.totalcompApps= result;
               });
               getProposalApplication({RecordTypeName: this.value}).then(result=>{
                console.log('result'+ JSON.stringify(result));
            
                let tempRecs = [];
                result.forEach(element => {
                    this.AccountName= element.Name;
                    let tempRec = Object.assign( {}, element );  
                    tempRec.AccountName = '/' + tempRec.Id;
                    tempRecs.push( tempRec );
                    
                    
                   
           });
           this.availableAccounts =tempRecs;
            });
    }

    handleDraftApplications(event){
        this.AppType='Draft Applications'
        event.currentTarget.dataset.id;
        event.currentTarget.dataset.name;
        getProposalApplicationforDataTable({RecordTypeName: event.currentTarget.dataset.id, Stage:event.currentTarget.dataset.name}).then(result=>{
            let tempRecs = [];
            result.forEach(element => {
                this.AccountName= element.Name;
                let tempRec = Object.assign( {}, element );  
                tempRec.AccountName = '/' + tempRec.Id;
                tempRecs.push( tempRec );
                
                
               
       });
       this.availableAccounts =tempRecs;
        }) }
    connectedCallback(){
        console.log('allo'+this.allocatedPage);
        let draftCount=0;
        let submittedCount = 0;
        let unallocatecount =0;
        getUnAllocated({RecordTypeName: this.value}).then(result=> {

            this.unallocatedApps = result.length;
         });
        getApplicationBasedOnType({RecordTypeName: this.value}).then(result=> {
               console.log('result-->',JSON.stringify(result));
              this.totalApplications = result.length;
              result.forEach(element => {
               if(element.Proposal_Stages__c === 'Draft'){
               draftCount++;
               }
               else if(element.Submitted__c === true){
                submittedCount++;
               }
               else if(element.Proposal_Stages__c === 'Submitted'){
               unallocatecount++;
               }
              });
              this.draftApplications =draftCount;
              this.submittedApplications= submittedCount;
              //this.unallocatedApps=unallocatecount;
         })
        .catch(error => {
               console.log('error-->',error);
         });
         getAllocatedpending({RecordTypeName: this.value}).then(result=>{
           this.allocatedApplications= result.length;
           console.log('>>>>', this.allocatedApplication);
          });
          getAllocatedCompleted({RecordTypeName: this.recName}).then(result=>{
           this.totalcompApps= result;
          });
        getProposalApplication({RecordTypeName: this.value}).then(result=>{
            console.log('result'+ JSON.stringify(result));
        
            let tempRecs = [];
            result.forEach(element => {
                this.AccountName= element.Name;
                let tempRec = Object.assign( {}, element );  
                tempRec.AccountName = '/' + tempRec.Id;
                tempRecs.push( tempRec );
                
                
               
       });
       this.availableAccounts =tempRecs;
        });
        console.log('result'+ JSON.stringify( this.availableAccounts));
    }
    handleallApplications(event){
        
    this.AppType ='Total Applications';
        getProposalApplication({RecordTypeName: event.currentTarget.dataset.id}).then(result=>{
            console.log('result'+ JSON.stringify(result));
        
            let tempRecs = [];
            result.forEach(element => {
                this.AccountName= element.Name;
                let tempRec = Object.assign( {}, element );  
                tempRec.AccountName = '/' + tempRec.Id;
                tempRecs.push( tempRec );
                
                
               
       });
       this.availableAccounts =tempRecs;
        });
    }
    handlesubmittedApplications(event){
        this.AppType='Submitted Applications'
        event.currentTarget.dataset.id;
        event.currentTarget.dataset.name;
        
        getSubmittedApplicationforDataTable({RecordTypeName: event.currentTarget.dataset.id, Stage:event.currentTarget.dataset.name}).then(result=>{
            let tempRecs = [];
        
            result.forEach(element => {
               
                this.AccountName= element.Name;
                let tempRec = Object.assign( {}, element );  
                tempRec.AccountName = '/' + tempRec.Id;
                tempRecs.push( tempRec );
            
        
                
               
       });
       this.availableAccounts =tempRecs;
       debugger;
        })

    }
    handleAllocateApplications(event){
        event.currentTarget.dataset.id;
        this.AppType='Allocated'
        getAllocatedpending({RecordTypeName: this.value}).then(result=>{
            console.log('result'+ JSON.stringify(result));
            this.AppType ='Allocated Applications';
            let tempRecs = [];
            result.forEach(element => {
                this.AccountName= element.Name;
                let tempRec = Object.assign( {}, element );  
                tempRec.AccountName = '/' + tempRec.Id;
                tempRecs.push( tempRec );
                
                
               
       });
       this.availableAccounts =tempRecs;
        });
    }
    handleUnallocatedApplications(event){this.AppType ='Total Applications';
    getUnAllocated({RecordTypeName: event.currentTarget.dataset.id}).then(result=>{

 
        console.log('result'+ JSON.stringify(result));
    
        let tempRecs = [];
        result.forEach(element => {
            this.AccountName= element.Name;
            let tempRec = Object.assign( {}, element );  
            tempRec.AccountName = '/' + tempRec.Id;
            tempRecs.push( tempRec );
            
            
           
   });
   this.availableAccounts =tempRecs;
    });
}
}