import { LightningElement,wire,track,api } from 'lwc';
 
import IMAGES from "@salesforce/resourceUrl/uploaded";
import IMAGES1 from "@salesforce/resourceUrl/notuploaded";

//import getAccountList from '@salesforce/apex/AccountLWCController.getAccountList';
import getUserDocumentList1 from '@salesforce/apex/displayUserDocumentsOnProposalApexClass.getUserDocumentList1';
import getUserDocumentList2 from '@salesforce/apex/displayUserDocumentsOnProposalApexClass.getUserDocumentList2';
import getContactUD from '@salesforce/apex/displayUserDocumentsOnProposalApexClass.getcontactUD';
import getContactUD1 from '@salesforce/apex/displayUserDocumentsOnProposalApexClass.getcontactUD1';

import { getRecord } from 'lightning/uiRecordApi';
import RECORDTYPENAME from '@salesforce/schema/Application_Proposal__c.RecordType_Name__c';


const columns = [{
        label: 'Name',
        fieldName: 'Name'
    },
    {
        label: 'Status',
        fieldName: 'Document_uploaded__c'
    },
 
];
export default class AccountList extends LightningElement {

    uploadedImage = IMAGES;
    notuploadedImage = IMAGES1;
    @track isIFRecord = false;
    @track isPECFAR = false;
    @track isSING = false;
    @track isWISER = false;
    @track isWORKSHOP = false;

    @api recordId;
    @track proposalId = '';
    @track datacount = ''; 
    @track userDocumentListData1;
    @track userDocumentListData2;
    @track userDocumentListData3;
    @track userDocumentListData4;
    @track columns = columns;
    @track displayuploadedimage = true;

    @wire(getRecord, { recordId: '$recordId', fields: [RECORDTYPENAME] })
  record;

    
    
    @wire(getRecord, {recordId: '$recordId',fields: [RECORDTYPENAME]}) 
    wireuser({error,data}) {
        if (error) {
           this.error = error ; 
           console.log('error==>',error);
        } else if (data) {
            console.log('data==>',JSON.stringify(data));
            console.log('data==>',JSON.stringify(data));
            console.log('data==>',JSON.stringify(data.fields));
            console.log('data==>',JSON.stringify(data.fields.RecordType_Name__c));
            console.log('data==>',JSON.stringify(data.fields.RecordType_Name__c.value));
            if(data.fields.RecordType_Name__c.value == 'Industrial Fellowship'){
                this.isIFRecord = true;
                
            }
            else if(data.fields.RecordType_Name__c.value == 'PECFAR'){
                this.isPECFAR = true;
            }
            else if(data.fields.RecordType_Name__c.value == 'SING'){
                this.isSING = true;
                
            }
            else if(data.fields.RecordType_Name__c.value == 'WISER'){
                this.isWISER = true;
            }
            else if(data.fields.RecordType_Name__c.value == 'Workshop'){
                this.isWORKSHOP = true;
            }
        }
    }

     @wire(getUserDocumentList1,{ proposalId: '$recordId'}) 
     userDocumentListData1({error,data}){
        if(error){
            console.log('error is#'+JSON.stringify(error));
        }
        else if(data){
            console.log(' No of records --> ' + data.length);
            console.log('lead data#'+JSON.stringify(data));
            this.datacount = data.length;
            console.log(' No of records datacount --> ' + this.datacount);
            this.userDocumentListData1 = data;
        }
    }
        @wire(getUserDocumentList2,{ proposalId: '$recordId'}) 
     userDocumentListData2({error,data}){
        if(error){
            console.log('error is#'+JSON.stringify(error));
        }
        else if(data){
            console.log(' No of records --> ' + data.length);
            console.log('lead data#'+JSON.stringify(data));
            this.datacount = data.length;
            console.log(' No of records datacount --> ' + this.datacount);
            this.userDocumentListData2 = data;
        }
    }

    @wire(getContactUD, {proposalId: '$recordId'})
    userDocumentList3({ error, data }) {
        if (data) {
            this.userDocumentListData3 = data;
            console.log('1111111111111*********'+JSON.stringify(data));
            
        } else if (error) {
            console.log('Something went wrong:', error);
        }
    }

    @wire(getContactUD1, {proposalId: '$recordId'})
    userDocumentList4({ error, data }) {
        if (data) {
            this.userDocumentListData4 = data;
            console.log('2222222222***********'+JSON.stringify(data));
        } else if (error) {
            console.log('Something went wrong:', error);
        }
    }
       
    
}