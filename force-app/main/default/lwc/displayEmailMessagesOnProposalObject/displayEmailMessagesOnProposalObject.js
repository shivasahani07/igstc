import { LightningElement,wire,track,api } from 'lwc';
 
//import getAccountList from '@salesforce/apex/AccountLWCController.getAccountList';
import getEmailMessagesBasedOnContact from '@salesforce/apex/displayEmailDataOnProposalApexClass.getEmailMessagesBasedOnContact';
 
const columns = [
    {
        label: 'Subject',
        fieldName: 'Subject'
    },
    {
        label: 'Contact',
        fieldName: 'ContactName'
    },
    {
        label: 'Message Date',
        fieldName: 'MessageDate'
    },
 
];
export default class DisplayEmailMessagesOnProposalObject extends LightningElement {
    @api recordId;
    @track proposalId = '';
    @track datacount = ''; 
    @track EmailMessagesListData;
    @track columns = columns;
     @wire(getEmailMessagesBasedOnContact,{ proposalId: '$recordId'}) 
    reviewerMappingList({error,data}){
        if(error){
            console.log('error is email ->'+JSON.stringify(error));
        }
        else if(data){
            console.log(' No of records --> ' + data.length);
            console.log('lead data#'+JSON.stringify(data));
            this.datacount = data.length;
            console.log(' No of records datacount --> ' + this.datacount);
            let tempRecords = JSON.parse( JSON.stringify( data ) );
            tempRecords = tempRecords.map( row => {
                return { ...row, ContactName: row.Contact__r.Name };
            })
            this.EmailMessagesListData = tempRecords;
            //this.ReviewerMappingListData = data;
        }
 
    }

    
}