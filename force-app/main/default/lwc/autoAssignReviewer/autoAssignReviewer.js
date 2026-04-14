import { api, LightningElement, track,wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import matchReviewer from '@salesforce/apex/AutoAssignReviewerController.matchReviewer';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class AutoAssignReviewer extends LightningElement {
    @api recordId;

    @wire(matchReviewer, { recordId: '$recordId' })
    wiredContacts({data, error}){ }
/*wiredRecordsMethod({ error, data }) {
  console.log('Hello' + data);
  if (data) {
    this.data = data;
    this.error = undefined;
  } else if (error) {
    this.error = error;
    this.data = undefined;
  }

}*/
}