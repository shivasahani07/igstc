import { LightningElement, api ,track,wire} from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Application_Proposal__c.Name';
import TENTATIVESTARTDATE_FIELD from '@salesforce/schema/Application_Proposal__c.Tentative_Start_Date__c';
import TENTATIVEENDDATE_FIELD from '@salesforce/schema/Application_Proposal__c.Tentative_End_Date__c';
import FELLOWSHIPDURATION_FIELD from '@salesforce/schema/Application_Proposal__c.Duration_In_Months_Max_36__c';
import AWARDLETTER_FIELD from '@salesforce/schema/Application_Proposal__c.Award_Letter_Date__c';
import PRIMARYACCOUNT_FIELD from '@salesforce/schema/Application_Proposal__c.Primary_Account__c';
import PRIMARYCONTACT_FIELD from '@salesforce/schema/Application_Proposal__c.Primary_Contact__c';
import RECORDTYPENAME from '@salesforce/schema/Application_Proposal__c.RecordType_Name__c';
import PROPOSALTITLE from '@salesforce/schema/Application_Proposal__c.Title_Of__c';


import PROPOSAL_OBJECT from '@salesforce/schema/Application_Proposal__c';
import getAccount from '@salesforce/apex/displayProposalOutputFieldsApexClass.getaccount';
import getContact from '@salesforce/apex/displayProposalOutputFieldsApexClass.getcontact';




export default class LwcRecordViewForm extends LightningElement {
    @track isIFRecord = false;
    @track isPECFAR = false;
    @track isSING = false;
    @api recordId;
    getAccountRecord;
    getContactRecord;

    @track ReviewerMappingListData1;
    @track ReviewerMappingListData2;
    @track recordtypename;
    @track primaryAccount;
    @track primaryContact;
    @track hostAccount;
    @track hostContact;
    @track proposalTitle;
    @track fellowshipType;

    @track NameAccount;
    @track IndustryAccount;
    @track NameContact;
    @track myInstituteContact;
    @track fellowshiptypeContact;
    @track phdEnrollDateContact;
    @track addressContact;
    


    objectApiName = PROPOSAL_OBJECT;
    nameField = NAME_FIELD;
    startField = TENTATIVESTARTDATE_FIELD;
    endField = TENTATIVEENDDATE_FIELD;
    fellowshipDurationField = FELLOWSHIPDURATION_FIELD;
    awardletterDateField = AWARDLETTER_FIELD;
    primaryAccountField = PRIMARYACCOUNT_FIELD;
    primaryContactField = PRIMARYCONTACT_FIELD;
    recordtypeNameField = RECORDTYPENAME;

   
    

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
                this.proposalTitle = data.fields.Title_Of__c;
                //console.log('isIFRecord==>',isIFRecord);
            }
            else if(data.fields.RecordType_Name__c.value == 'PECFAR'){
                this.isPECFAR = true;
                //console.log('isPECFAR==>',isPECFAR);
            }
            else if(data.fields.RecordType_Name__c.value == 'SING'){
                this.isSING = true;
                //console.log('isPECFAR==>',isPECFAR);
            }
        }
    }

     
    @wire(getAccount, {proposalId: '$recordId'})
    ReviewerMappingList1({ error, data }) {
        if (data) {

            this.ReviewerMappingListData1 = data;
            if(this.isIFRecord == true){
            for(let i=0; i<this.ReviewerMappingListData1.length; i++){
                if(this.ReviewerMappingListData1[i].Is_Primary__c == true){
                    this.primaryAccount = this.ReviewerMappingListData1[i].Name ;
                }else if(this.ReviewerMappingListData1[i].Host__c == true){
                    this.hostAccount = this.ReviewerMappingListData1[i].Name ;
                }

                
                console.log('pppppppppp'+this.ReviewerMappingListData1[i].Name);
            }
            }   
        } else if (error) {
            console.log('Something went wrong:', error);
        }
    }

    @wire(getContact, {proposalId: '$recordId'})
    ReviewerMappingList2({ error, data }) {
        if (data) {
            this.ReviewerMappingListData2 = data;
            if(this.isIFRecord == true){
                for(let i=0; i<this.ReviewerMappingListData2.length; i++){
            if(this.ReviewerMappingListData2[i].Is_Primary__c == true){
                this.primaryContact = this.ReviewerMappingListData2[i].Name ;
                this.fellowshipType = this.ReviewerMappingListData2[i].Industrial_Fellowship_Type__c;
            }else {
                this.hostContact = this.ReviewerMappingListData2[i].Name ;
            }
        }
            }
        } else if (error) {
            console.log('Something went wrong:', error);
        }
    }

    
    
    
}