import { LightningElement,api,track,wire} from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import matchReviewer from '@salesforce/apex/AutoAssignReviewerController.matchReviewer';
import getRcDetails from '@salesforce/apex/AutoAssignReviewerController.getRcDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class TestLWCComp extends LightningElement {

    @api recordId

    @wire(getRcDetails, { id: '$recordId' })
    wiredRecordsMethod(result) {
        debugger;
        console.log('Result---',result);
        if(result.data){
            this.autoMatchReviewer(result.data.Id);
        }
    }  


    showNotification(title,message,variant){
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    autoMatchReviewer(id){
        matchReviewer({proposalId: id})
            .then(result => {
                if(result){
                    console.log(result);
                    const event = new ShowToastEvent({
                      
                        message: result,
                        
                    });
                    this.dispatchEvent(event);
                }
            })
            .catch(error => {
                console.log('Error: ', error);
            })
    }
}