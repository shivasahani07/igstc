import { LightningElement,api,track,wire} from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getReviewers from '@salesforce/apex/MatchReviewer_Controller.getReviewers';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class MatchReviewer extends LightningElement {
    @api recordId
    @wire(getReviewers) 
    reviewertList({error,data}){
        if(error){
            console.log('error is#'+error);
        }
        else if(data){
            console.log('lead data#'+data);
            this.leadList = data;
        }

    };
   
}