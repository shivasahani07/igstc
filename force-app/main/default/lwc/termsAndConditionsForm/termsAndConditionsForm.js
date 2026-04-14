import { LightningElement, track, wire } from 'lwc';
import saveTermsCondition from '@salesforce/apex/TermsAndConditionController.saveTermsCondition';
import getCountryOptions from '@salesforce/apex/TermsAndConditionController.getCountryOptions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';


export default class TermsAndConditionsForm extends NavigationMixin(LightningElement) {
    @track termsDescription = '';
    @track campaignId = '';
    @track country = '';
    @track countryOptions = [];
    @track campaignId;
    

    @wire(getCountryOptions)
    wiredCountries({ data, error }) {
        if (data) {
            this.countryOptions = data.map(c => ({ label: c, value: c }));
        } else if (error) {
            console.error('Error loading countries:', error);
        }
    }

    handleChange(event) {
        const field = event.target.name;
        if (field === 'description') this.termsDescription = event.target.value;
        if (field === 'country') this.country = event.target.value;
    }

    handleCampaignChange(event) {
        debugger;
        this.campaignId = event.detail.recordId;
        debugger;
        console.log('Selected Campaign Id:', this.campaignId);
    }

    handleSave() {
        debugger;
        if (!this.termsDescription) {
            this.showToast('Error', 'Please enter Terms Description.', 'error');
            return;
        }

        saveTermsCondition({
            htmlText: this.termsDescription,
            campaignId: this.campaignId,
            country: this.country
        })
            .then((result) => {
                debugger
                this.showToast('Success', 'Terms & Condition record created successfully!', 'success');
                this.termsDescription = '';
                this.campaignId = '';
                this.country = '';
                const campaignLookup=this.refs.camapaignLookup;
                if(campaignLookup){
                    campaignLookup.clearSelection();
                }
                window.open('/' + result, '_self');
                // this[NavigationMixin.Navigate]({
                //     type: 'standard__recordPage',
                //     attributes: {
                //         recordId: result,
                //         objectApiName: 'Terms_Condition__c',
                //         actionName: 'view'
                //     }
                // });
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}