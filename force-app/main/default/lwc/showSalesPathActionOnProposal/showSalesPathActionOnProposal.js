import { api, LightningElement, wire, track } from 'lwc';
import getRecords from '@salesforce/apex/showSalesPathActionOnProposalController.getActionRecords';

export default class ShowSalesPathActionOnProposal extends LightningElement {
    @api recordId;
    @track listOfActions = [];

    @wire(getRecords,{propId:'$recordId'})
    wiredResponse(result){
        if(result.data){
            console.log('Data-------',result.data);
          
            this.listOfActions = result.data;
            
        }else{
            console.log("Error to fetch data of Accounts",result);
        }
    }
}