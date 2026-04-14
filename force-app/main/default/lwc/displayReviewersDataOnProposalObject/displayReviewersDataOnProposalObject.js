import { LightningElement,wire,track,api } from 'lwc';
 
//import getAccountList from '@salesforce/apex/AccountLWCController.getAccountList';
import getReviewerMapping from '@salesforce/apex/displayReviewersDataOnProposalApexClass.getReviewerMapping';
 
const columns = [{
        label: 'Name',
        fieldName: 'Name'
    },
    {
        label: 'Stage',
        fieldName: 'Stage__c'
    },
    {
        label: 'Reviewer',
        fieldName: 'ReviewerName'
    },
    {
        label: 'Score',
        fieldName: 'Total_Score__c'
    },
 
];
export default class AccountList extends LightningElement {
    @api recordId;
    @track proposalId = '';
    @track datacount = ''; 
    @track ReviewerMappingListData;
    @track columns = columns;
     @wire(getReviewerMapping,{ proposalId: '$recordId'}) 
    reviewerMappingList({error,data}){
        if(error){
            console.log('error is#'+JSON.stringify(error));
        }
        else if(data){
            console.log(' No of records --> ' + data.length);
            console.log('lead data#'+JSON.stringify(data));
            this.datacount = data.length;
            console.log(' No of records datacount --> ' + this.datacount);
            let tempRecords = JSON.parse( JSON.stringify( data ) );
            tempRecords = tempRecords.map( row => {
                return { ...row, ReviewerName: row.Reviewer__r.Name };
            })
            this.ReviewerMappingListData = tempRecords;
            //this.ReviewerMappingListData = data;
        }
 
    }

    
}