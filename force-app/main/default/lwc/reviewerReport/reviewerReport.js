import { LightningElement, track, wire } from 'lwc';
import getCampaignName from '@salesforce/apex/ReviewerReport.getCampaignName';
import getYear from '@salesforce/apex/ReviewerReport.getYear';
import getProposals from '@salesforce/apex/ReviewerReport.getProposals';
import getStageOptions from '@salesforce/apex/ReviewerReport.getStageOptions';
import getCongaSolution from '@salesforce/apex/ReviewerReport.getCongaSolution';
import updateGenerateReviewerDoc from '@salesforce/apex/ReviewerReport.updateGenerateReviewerDoc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class ReviewerReport extends NavigationMixin(LightningElement) {
    @track selectedName;
    @track selectedYear;
    @track campaignNameOptions = [];
    @track yearOptions = [];
    @track proposals = [];
    @track showTable = false;
    @track error;
    @track paginationData = [];
    @track headerCheckboxChecked = false;
    @track currentPage = 1;
    @track showSpinner = false;
    @track selectedCampaignName = '';

    @track stageOptions = [];
    @track selectedStage;
    @track showStage = false;

    @wire(getCampaignName)
    wiredCampaigns({ error, data }) {
        if (data) {
            this.campaignNameOptions = data.map(camp => ({
                label: camp.Name,
                value: camp.Id
            }));
        } else if (error) {
            console.error('Error fetching campaign names:', error);
        }
    }


    @wire(getYear)
    wiredYear({ error, data }) {
        if (data) {
            const allYears = data.map(y => y.Year__c);
            const uniqueYears = [...new Set(allYears)];
            uniqueYears.sort((a, b) => b - a);

            this.yearOptions = uniqueYears.map(year => ({
                label: year,
                value: year
            }));

            console.log('Unique years:', this.yearOptions);
        } else if (error) {
            console.error('Error fetching year names:', error);
        }
    }

    //1st and 2nd Stages Dynamic values for 2+2 Call.
    @wire(getStageOptions)
    wiredStages({ error, data }) {
        if (data) {
            this.stageOptions = [
                { label: 'All', value: '' },
                ...data.map(stage => ({
                    label: stage,
                    value: stage
                }))
            ];
        } else if (error) {
            console.error('Error fetching Stage:', error);
        }
    }

    get noRecords() {
        debugger;
        return this.proposals.length === 0;
    }
    // get hasRecords() {
    //     debugger;
    //     return this.paginationData && this.paginationData.length > 0;
    // }

    handleChangeName(event) {
        this.selectedName = event.target.value;
        console.log('selected call type ===> ' + this.selectedName);
        const selectedCampaign = this.campaignNameOptions.find(
            cmp => cmp.value === this.selectedName
        );

        this.selectedCampaignName = selectedCampaign ? selectedCampaign.label : null;
        console.log('Selected campaign name ===> ' + this.selectedCampaignName);

        // Show only for 2+2 Call
        this.showStage = this.selectedCampaignName === '2+2 Call';
         if (this.showStage) {
           this.selectedStage = ''; // default to All
        }
        else {
            this.selectedStage = null;
        }
        

    }

    handleStageChange(event) {
        this.selectedStage = event.target.value;
    }


    handleChangeYear(event) {
        this.selectedYear = event.target.value;
    }


    handleSearch() {
        if (this.selectedName && this.selectedYear) {
            console.log('selected year ===> ' + this.selectedYear);
            getProposals({ campaignId: this.selectedName, yearValue: this.selectedYear, stageValue: this.selectedStage })
                .then(result => {

                    this.proposals = result.map(p => ({
                        ...p,
                        Generate_Reviewer_Document__c: !!p.Generate_Reviewer_Document__c
                    }));
                    this.showTable = true;
                    this.paginationData = [];
                    this.headerCheckboxChecked = false;
                    this.error = undefined;
                    this.currentPage = 1;
                })
                .catch(error => {
                    this.error = error;
                    this.showTable = false;
                });
        } else {
            alert('Please select both Campaign and Year');
        }
    }
    
    get isSearchDisabled() {
        // Campaign & Year mandatory
        if (!this.selectedName || !this.selectedYear) {
            return true;
        }
        // If 2+2 Call → Stage must NOT be blank ('')
       if (this.showStage && this.selectedStage === undefined) {
            return true;
        }
        return false;
    }

    


    handlePagination(event) {
        const records = event.detail.recordToDisplay || [];
        this.currentPage = event.detail.currentPage || this.currentPage;

        this.paginationData = records.map((record, idx) => {
            const masterRecord = this.proposals.find(p => p.Id === record.Id);
            return {
                ...record,
                Generate_Reviewer_Document__c: !!masterRecord?.Generate_Reviewer_Document__c,
                index: idx + 1
            };
        });


        this.headerCheckboxChecked =
            this.paginationData.length > 0 &&
            this.paginationData.every(item => item.Generate_Reviewer_Document__c);
    }


    handleSelectAll(event) {
        const checked = !!event.target.checked;


        this.paginationData = this.paginationData.map(item => ({
            ...item,
            Generate_Reviewer_Document__c: checked
        }));


        this.proposals.forEach(p => {
            const pageItem = this.paginationData.find(pg => pg.Id === p.Id);
            if (pageItem) p.Generate_Reviewer_Document__c = checked;
        });

        this.headerCheckboxChecked = checked;
    }


    handleRowSelection(event) {
        const recordId = event.target.dataset.id;
        const isChecked = event.target.checked;
        if (!recordId) return;


        this.paginationData = this.paginationData.map(item =>
            item.Id === recordId ? { ...item, Generate_Reviewer_Document__c: isChecked } : item
        );

        const proposal = this.proposals.find(p => p.Id === recordId);
        if (proposal) proposal.Generate_Reviewer_Document__c = isChecked;
        this.headerCheckboxChecked =
            this.paginationData.length > 0 &&
            this.paginationData.every(item => item.Generate_Reviewer_Document__c);
    }


    // handleSave() {
    //     debugger; 
    //     const selectedProposals = this.proposals.filter(p => p.Generate_Reviewer_Document__c);

    //     if (selectedProposals.length === 0) {
    //     this.dispatchEvent(
    //         new ShowToastEvent({
    //             title: 'Info',
    //             message: 'Please select at least one record to save.',
    //             variant: 'info'
    //         })
    //     );
    //     return;
    // }

    //     const minimalProposals = selectedProposals.map(p => ({
    //     Id: p.Id,
    //     Generate_Reviewer_Document__c: p.Generate_Reviewer_Document__c
    //     }));

    //     this.showSpinner = true;
    //     const congaSolutionName = this.selectedCampaignName == '2+2 Call' ? 'Generate New Two plus Two Reviewer Report' : this.selectedCampaignName == 'Industrial Fellowships' ? 'Generate New IF Reviewer Report' :
    //                                 this.selectedCampaignName == 'PECFAR' ? 'Generate New Pecfar Reviewer Report' : this.selectedCampaignName == 'SING' ? 'Generate New SING Reviewer Report' : 
    //                                 this.selectedCampaignName == 'WISER' ? 'Generate New Wiser Reviewer Report' : this.selectedCampaignName == 'Workshop' ? 'Generate New Workshop Reviewer Report' : '';
    //     updateGenerateReviewerDoc({ proposalList: minimalProposals })
    //         .then(() => {
    //             // this.dispatchEvent(
    //             //     new ShowToastEvent({
    //             //         title: 'Success',
    //             //         message: 'Records updated successfully',
    //             //         variant: 'success'
    //             //     })
    //             // );
    //             debugger;
    //             this.showSpinner = false;
    //             if(congaSolutionName == null || congaSolutionName == ''){
    //                 this.dispatchEvent(
    //                     new ShowToastEvent({
    //                         title: 'Error',
    //                         message: 'Error processing conga solution',
    //                         variant: 'error'
    //                     })
    //                 );
    //                 return;
    //             }
    //             getCongaSolution({ solutionName: congaSolutionName })

    //                 .then(solutionRecord => {
    //                     debugger;
    //                     if (solutionRecord) {
    //                         this[NavigationMixin.Navigate]({
    //                             type: 'standard__recordPage',
    //                             attributes: {
    //                                 recordId: solutionRecord.Id,
    //                                 objectApiName: 'APXTConga4__Conga_Solution__c',
    //                                 actionName: 'view'
    //                             }
    //                         });
    //                     } else {
    //                         this.dispatchEvent(
    //                             new ShowToastEvent({
    //                                 title: 'Error',
    //                                 message: 'Record not found',
    //                                 variant: 'error'
    //                             })
    //                         );
    //                     }
    //                 })
    //                 .catch(error => {
    //                     debugger;
    //                     console.error('Error fetching solution:', error);
    //                 });
    //         })
    //         .catch(error => {
    //             debugger;
    //             console.error('Error saving changes:', error);
    //             this.dispatchEvent(
    //                 new ShowToastEvent({
    //                     title: 'Error',
    //                     message: error.body?.message || 'Something went wrong',
    //                     variant: 'error'
    //                 })
    //             );
    //             this.showSpinner = false;
    //         });
    // }

    handleSave() {
        debugger;
        const selectedProposals = this.proposals.filter(p => p.Generate_Reviewer_Document__c);

        if (selectedProposals.length === 0) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Info',
                    message: 'Please select at least one record to save.',
                    variant: 'info'
                })
            );
            return;
        }

        const minimalProposals = selectedProposals.map(p => ({
            Id: p.Id,
            Generate_Reviewer_Document__c: p.Generate_Reviewer_Document__c
        }));

        this.showSpinner = true;

        const congaSolutionName =
            this.selectedCampaignName == '2+2 Call' ? 'Generate New Two plus Two Reviewer Report' :
                this.selectedCampaignName == 'Industrial Fellowships' ? 'Generate New IF Reviewer Report' :
                    this.selectedCampaignName == 'PECFAR' ? 'Generate New Pecfar Reviewer Report' :
                        this.selectedCampaignName == 'SING' ? 'Generate New SING Reviewer Report' :
                            this.selectedCampaignName == 'WISER' ? 'Generate New Wiser Reviewer Report' :
                                this.selectedCampaignName == 'Workshop' ? 'Generate New Workshop Reviewer Report' : '';
        if (!congaSolutionName) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Error processing conga solution.',
                    variant: 'error'
                })
            );
            return;
        }
        updateGenerateReviewerDoc({ proposalList: minimalProposals })
            .then(() => {
                debugger;
                this.showSpinner = false;
                getCongaSolution({ solutionName: congaSolutionName })
                    .then(solutionRecord => {
                        debugger;
                        if (solutionRecord) {
                            this[NavigationMixin.Navigate]({
                                type: 'standard__recordPage',
                                attributes: {
                                    recordId: solutionRecord.Id,
                                    objectApiName: 'APXTConga4__Conga_Solution__c',
                                    actionName: 'view'
                                }
                            });
                        } else {
                            this.dispatchEvent(
                                new ShowToastEvent({
                                    title: 'Error',
                                    message: 'Record not found.',
                                    variant: 'error'
                                })
                            );
                        }
                    })
                    .catch(error => {
                        debugger;
                        console.error('Error fetching solution:', error);
                    });
            })
            .catch(error => {
                debugger;
                console.error('Error saving changes:', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body?.message || 'Something went wrong.',
                        variant: 'error'
                    })
                );
                this.showSpinner = false;
            });
    }
}