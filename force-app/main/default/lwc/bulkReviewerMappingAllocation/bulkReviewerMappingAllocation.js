import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import fetchDataOnLoad from '@salesforce/apex/bulkReviewerMappingAllocationController.fetchDataOnLoad';
import createMapping from '@salesforce/apex/bulkReviewerMappingAllocationController.createMapping';

export default class BulkReviewerMappingAllocation extends LightningElement {
    @track columns = [];
    @track previewData = [];
    @track propsals = [];
    @track reviewers = [];
    @track proposalStages = [];
    @track errorRowNumbers = [];
    @track mappingData = [];
    @track paginatedData = [];
    @track isSubmitDisabled = true;
    @track submitClass = 'cst-btn slds-m-around_small';
    @track expectedHeaders = ['Proposal Id'];
    @track reviewerEmailHeaders = [];
    @track headerErrorMessage = '';

    connectedCallback() {
        this.getDataOnLoad();
    }

    getDataOnLoad() {
        debugger;
        fetchDataOnLoad()
        .then(data => {
            this.propsals = data.proposals || [];
            this.reviewers = data.reviewers || [];
            this.proposalStages = data.proposalStages || [];

            this.reviewerEmailHeaders = this.reviewers
                .filter(reviewer => reviewer && reviewer.Email__c && reviewer.Email__c.trim() !== '')
                .map(reviewer => reviewer.Email__c);

            this.expectedHeaders = ['Proposal Id', ...this.reviewerEmailHeaders];
        })
        .catch(error => {
            console.error(JSON.stringify(error));
        })
    }

    downloadTemplate() {
        debugger;
        const headers = this.expectedHeaders.join(',');
        const csv = headers + '\n';
        const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        // const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = encodedUri;
        a.target = '_self';
        a.download = 'Bulk_Reviewer_Mapping_Temaplate.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    uploadTemplate() {
        debugger;
        const uploadFileComp = this.template.querySelector('.upload');
        uploadFileComp.click();
    }

    handleFileUpload(event) {
        this.previewData = [];
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const text = reader.result;
                this.parseCSV(text);
            };
            reader.readAsText(file);
        }
    }

    parseCSV(text) {
        this.previewData = [];
        this.columns = [];
        this.errorRowNumbers = [];
        this.headerErrorMessage = '';
        this.isSubmitDisabled = true;
        this.mappingData = [];
        
        const rows = text.trim().split('\n').map(row => {
            return row.split(',').map(cell => cell.replace(/^"|"$/g, '').trim());
        });
        
        const csvHeaders = rows[0];
        const invalidHeaders = [];
        const invalidHeaderIndices = [];
        
        csvHeaders.forEach((header, index) => {
            if (!this.expectedHeaders.includes(header.trim())) {
                invalidHeaders.push(header);
                invalidHeaderIndices.push(index + 1);
            }
        });

        if (invalidHeaders.length > 0) {
            this.headerErrorMessage = `Invalid headers found in columns ${invalidHeaderIndices.join(', ')}: ${invalidHeaders.join(', ')}. Please use the downloaded template.`;
            this.isSubmitDisabled = true;
            this.submitClass = 'cst-btn slds-m-around_small disable';
            // return;
        }
        
        this.columns = ['S.No', ...csvHeaders, 'Errors'];
        
        const dataRows = rows.slice(1);
        let errorsFound = false;
        const errorRows = [];
        const seenPairs = new Set();
        
        const reviewerHeaders = Array.isArray(this.reviewerEmailHeaders) ? this.reviewerEmailHeaders : [];
        
        this.previewData = dataRows
            .filter(row => row.some(cell => cell && cell.trim() !== ''))
            .map((row, idx) => {
                let hasError = false;
                let errorMessages = [];
                let proposalIdValue = '';
                let proposalRecord = null;
                const cells = [{ value: idx + 1, class: '' }];
                let selectedReviewers = [];
                let mappingObjects = [];
                let hasDataInRow = row.some(cell => cell && cell.trim() !== '');

                if (this.headerErrorMessage) {
                    hasError = true;
                    errorMessages.push(this.headerErrorMessage);
                }

                row.forEach((cell, colIndex) => {
                    let cssClass = '';
                    const columnName = this.columns[colIndex + 1] ? this.columns[colIndex + 1].trim() : '';

                    // if (this.headerErrorMessage) {
                    //     cssClass = 'error-cell';
                    // }
                    
                    if (!columnName) {
                        if (cell && cell.trim() !== '') {
                            cssClass = 'error-cell';
                            errorMessages.push(`Data found for non-existent column at position ${colIndex + 1}`);
                            hasError = true;
                        }
                        cells.push({ value: cell, class: cssClass });
                        return;
                    }

                    // if (this.headerErrorMessage) {
                    //     cells.push({ value: cell, class: cssClass });
                    //     return;
                    // }

                    if (columnName === 'Proposal Id' && hasDataInRow && (!cell || cell.trim() === '')) {
                        cssClass = 'error-cell';
                        errorMessages.push('Proposal Id is required when data is entered in row');
                        hasError = true;
                        cells.push({ value: cell, class: cssClass });
                        return;
                    }

                    if (columnName === 'Proposal Id' && cell && cell.trim()) {
                        proposalIdValue = cell.trim();
                        proposalRecord = this.propsals.find(proposal => proposal && proposal.Name === cell.trim());
                        
                        if (!proposalRecord) {
                            cssClass = 'error-cell';
                            errorMessages.push('Proposal Id not found in proposals');
                            hasError = true;
                        }
                        cells.push({ value: cell, class: cssClass });
                        return;
                    }
                    
                    if (reviewerHeaders.includes(columnName)) {
                        const cellValue = cell ? cell.trim().toLowerCase() : '';
                        
                        if (cellValue === '1') {
                            const reviewer = this.reviewers.find(rev => rev && rev.Email__c === columnName);
                            
                            if (!reviewer) {
                                cssClass = 'error-cell';
                                errorMessages.push(`Reviewer with email ${columnName} not found`);
                                hasError = true;
                            } else {
                                selectedReviewers.push({
                                    email: columnName,
                                    reviewerId: reviewer.Id
                                });
                            }
                        } else if (cellValue !== '' && cellValue !== '0') {
                            cssClass = 'error-cell';
                            errorMessages.push(`Invalid value '${cell}' for reviewer ${columnName}. Use '1' to select or leave empty.`);
                            hasError = true;
                        }
                        
                        cells.push({ value: cell, class: cssClass });
                        return;
                    }
                    
                    cells.push({ value: cell, class: cssClass });
                });

                if (!hasError && proposalIdValue && selectedReviewers.length === 0 && hasDataInRow) {
                    const hasOtherData = row.some((cell, index) => {
                        if (index >= csvHeaders.length) return false;
                        const colName = csvHeaders[index];
                        return colName !== 'Proposal Id' && cell && cell.trim() !== '';
                    });
                    
                    if (hasOtherData) {
                        hasError = true;
                        errorMessages.push('No reviewers selected for this proposal');
                        cells.forEach((cell, index) => {
                            if (index > 0 && index < this.columns.length - 1) {
                                const colName = this.columns[index] ? this.columns[index].trim() : '';
                                if (reviewerHeaders.includes(colName)) {
                                    cell.class = 'error-cell';
                                }
                            }
                        });
                    }
                }

                if (!hasError && proposalIdValue) {
                    selectedReviewers.forEach(reviewer => {
                        const pairKey = `${proposalIdValue}||${reviewer.email}`;
                        if (seenPairs.has(pairKey)) {
                            hasError = true;
                            errorMessages.push(`Duplicate assignment for reviewer ${reviewer.email}`);
                        } else {
                            seenPairs.add(pairKey);
                        }
                    });
                }

                if (!hasError && proposalRecord && selectedReviewers.length > 0) {
                    selectedReviewers.forEach(reviewer => {
                        const mappingObject = {
                            'Proposals__c': proposalRecord.Id,
                            'Reviewer__c': reviewer.reviewerId,
                            'Proposal_Stage__c': proposalRecord.Stage__c || null
                        };
                        mappingObjects.push(mappingObject);
                    });
                    this.mappingData.push(...mappingObjects);

                    console.log('mappingData=====================>'+JSON.stringify(this.mappingData));
                }

                if (errorMessages.length > 0) {
                    cells.push({ value: errorMessages.join('; '), class: 'error-cell' });
                } else {
                    cells.push({ value: '-', class: '' });
                }

                if (hasError) {
                    errorsFound = true;
                    errorRows.push(idx + 1);
                }

                return { cells };
            });

        this.errorRowNumbers = errorRows.join(', ');
        this.isSubmitDisabled = errorsFound || this.mappingData.length === 0;
        this.submitClass = this.isSubmitDisabled ? 'cst-btn slds-m-around_small disable' : 'cst-btn slds-m-around_small';
    }

    handleSubmit() {
        this.isSubmitDisabled = true;
        this.submitClass = this.isSubmitDisabled ? 'cst-btn slds-m-around_small disable' : 'cst-btn slds-m-around_small';
        createMapping({ mappings: this.mappingData})
        .then(result => {
            this.showToastEvent('Success', 'Mapping Created Successfully', 'success');
            this.previewData = [];
            this.columns = [];
            this.errorRowNumbers = [];
            this.isSubmitDisabled = false;
        })
        .catch(error => {
            this.showToastEvent('Error', 'Something went wrong, please try again', 'error');
            console.log('Error in handleSubmit method==================>'+JSON.stringify(error));
            this.isSubmitDisabled = false;
        })
    }

    handlePagination(event) {
        this.paginatedData = event.detail.recordToDisplay;
    }


    showToastEvent(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            })
        );
    }

}





// import { LightningElement, track } from 'lwc';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import fetchDataOnLoad from '@salesforce/apex/bulkReviewerMappingAllocationController.fetchDataOnLoad';
// import createMapping from '@salesforce/apex/bulkReviewerMappingAllocationController.createMapping';

// export default class BulkReviewerMappingAllocation extends LightningElement {
//     @track columns = [];
//     @track previewData = [];
//     @track propsals = [];
//     @track reviewers = [];
//     @track proposalStages = [];
//     @track errorRowNumbers = [];
//     @track mappingData = [];
//     @track paginatedData = [];
//     @track isSubmitDisabled = true;
//     @track submitClass = 'cst-btn slds-m-around_small';
//     expectedHeaders = ['Proposal Id'];

//     connectedCallback() {
//         this.getDataOnLoad();
//     }

//     getDataOnLoad() {
//         debugger;
//         fetchDataOnLoad()
//         .then(data => {
//             this.propsals = data.proposals;
//             this.reviewers = data.reviewers;
//             this.proposalStages = data.proposalStages;

//             const validEmails = this.reviewers
//                 .filter(reviewer => reviewer.Email__c && reviewer.Email__c.trim() !== '')
//                 .map(reviewer => reviewer.Email__c);

//             this.expectedHeaders = [...this.expectedHeaders, ...validEmails];
//         })
//         .catch(error => {
//             console.error(JSON.stringify(error));
//         })
//     }

//     downloadTemplate() {
//         debugger;
//         const headers = this.expectedHeaders.join(',');
//         const csv = headers + '\n';
//         const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
//         // const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = encodedUri;
//         a.target = '_self';
//         a.download = 'Bulk_Reviewer_Mapping_Temaplate.csv';
//         a.click();
//         URL.revokeObjectURL(url);
//     }

//     uploadTemplate() {
//         debugger;
//         const uploadFileComp = this.template.querySelector('.upload');
//         uploadFileComp.click();
//     }

//     handleFileUpload(event) {
//         this.previewData = [];
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 const text = reader.result;
//                 this.parseCSV(text);
//             };
//             reader.readAsText(file);
//         }
//     }

//     // parseCSV(text) {
//     //     this.previewData = [];
//     //     this.columns = [];
//     //     this.errorRowNumbers = [];
//     //     this.isSubmitDisabled = true;
//     //     this.mappingData = [];
//     //     const rows = text.trim().split('\n').map(row => row.split(','));
//     //     this.columns = ['S.No', ...rows[0], 'Errors'];
//     //     const dataRows = rows.slice(1);
//     //     var errorsFound = false;
//     //     const errorRows = [];
//     //     const seenPairs = new Set();
//     //     this.previewData = dataRows
//     //         .filter(row => row.some(cell => cell.trim() !== '')) // Remove empty rows
//     //         .map((row, idx) => {
//     //             var hasError = false;
//     //             var errorMessages = [];
//     //             var proposalIdValue = '';
//     //             var reviewerEmailValue = '';
//     //             var mappingObject = {};
//     //             const cells = [{ value: idx + 1, class: '' }];
//     //             var checkProposalStage = false;
//     //             // Loop through CSV data columns
//     //             row.forEach((cell, colIndex) => {
//     //                 var cssClass = '';
//     //                 if (this.columns[colIndex + 1].trim() === 'Proposal Id' && cell.trim()) {
//     //                     if (!(this.propsals.length > 0 && this.propsals.some(proposal => proposal.Name === cell.trim()))) {
//     //                         cssClass = 'error-cell';
//     //                         errorMessages.push('Proposal Id not found in proposals');
//     //                         hasError = true;
//     //                     }else {
//     //                         checkProposalStage = this.propsals.find(pr => pr.Name === cell.trim())?.RecordType?.Name == 'Two Plus Two';
//     //                     }
//     //                 }
//     //                 if (this.columns[colIndex + 1].trim() === 'Reviewer\'s Email' && cell.trim()) {
//     //                     if (!(this.reviewers.length > 0 && this.reviewers.some(reviewer => reviewer.Email__c === cell.trim()))) {
//     //                         cssClass = 'error-cell';
//     //                         errorMessages.push('Email not found in reviewers');
//     //                         hasError = true;
//     //                     }
//     //                 }
//     //                 if (this.columns[colIndex + 1].trim() === 'Proposal Stage' && cell.trim()) {
//     //                     if (!(this.proposalStages.length > 0 && this.proposalStages.some(ps => ps === cell.trim()))) {
//     //                         cssClass = 'error-cell';
//     //                         errorMessages.push('Stage not found in Proposal Stages');
//     //                         hasError = true;
//     //                     }
//     //                 }
//     //                 // Check if column is in expected headers
//     //                 if (this.expectedHeaders.includes(this.columns[colIndex + 1].trim())) {
//     //                     if (!cell.trim() && !(this.columns[colIndex + 1].trim() == 'Proposal Stage')) {
//     //                         cssClass = 'error-cell';
//     //                         errorMessages.push(`${this.columns[colIndex + 1]} is empty`);
//     //                         hasError = true;
//     //                         cells.push({ value: cell, class: cssClass });
//     //                         return;
//     //                     }
//     //                     if (!cell.trim() && (this.columns[colIndex + 1].trim() == 'Proposal Stage' && checkProposalStage)) {
//     //                         cssClass = 'error-cell';
//     //                         errorMessages.push(`${this.columns[colIndex + 1]} is empty`);
//     //                         hasError = true;
//     //                         cells.push({ value: cell, class: cssClass });
//     //                         return;
//     //                     }
//     //                 }
//     //                 if(!hasError) {
//     //                     if(this.columns[colIndex + 1].trim() == 'Proposal Id') {
//     //                         mappingObject['Proposals__c'] = this.propsals.find(pr => pr.Name == cell.trim()).Id;
//     //                     }else if(this.columns[colIndex + 1].trim() == 'Reviewer\'s Email') {
//     //                         mappingObject['Reviewer__c'] = this.reviewers.find(rev => rev.Email__c == cell.trim()).Id;
//     //                     }
//     //                     else if(this.columns[colIndex + 1].trim() == 'Proposal Stage') {
//     //                         mappingObject['Proposal_Stage__c'] = cell.trim();
//     //                     }
//     //                 }
//     //                 cells.push({ value: cell, class: cssClass });
//     //             });
//     //             if (proposalIdValue && reviewerEmailValue) {
//     //                 const pairKey = `${proposalIdValue}||${reviewerEmailValue}`;
//     //                 if (seenPairs.has(pairKey)) {
//     //                     hasError = true;
//     //                     errorMessages.push('Duplicate Proposal Id & Reviewer Email combination');
//     //                     cells.forEach(c => {
//     //                         if (c.value === proposalIdValue || c.value === reviewerEmailValue) {
//     //                             c.class = 'error-cell';
//     //                         }
//     //                     });
//     //                 } else {
//     //                     seenPairs.add(pairKey);
//     //                 }
//     //             }
//     //             if (errorMessages.length > 0) {
//     //                 cells.push({ value: errorMessages.join('; '), class: 'error-cell' });
//     //             } else {
//     //                 cells.push({ value: '-', class: '' });
//     //             }
//     //             if (hasError) {
//     //                 errorsFound = true;
//     //                 errorRows.push(idx + 1);
//     //             }else {
//     //                 if (Object.keys(mappingObject).length > 0) {
//     //                     this.mappingData.push(mappingObject);
//     //                 }
//     //             }
//     //             return { cells };
//     //         });
//     //     this.errorRowNumbers = errorRows.join(', ');
//     //     this.isSubmitDisabled = errorsFound;
//     //     this.submitClass = this.isSubmitDisabled ? 'cst-btn slds-m-around_small disable' : 'cst-btn slds-m-around_small';
//     // }

//     parseCSV(text) {
//         debugger;
//         this.previewData = [];
//         this.columns = [];
//         this.errorRowNumbers = [];
//         this.isSubmitDisabled = true;
//         this.mappingData = [];
        
//         const rows = text.trim().split('\n').map(row => {
//             // Handle quoted CSV values and split properly
//             return row.split(',').map(cell => cell.replace(/^"|"$/g, '').trim());
//         });
        
//         this.columns = ['S.No', ...rows[0], 'Errors'];
//         const dataRows = rows.slice(1);
//         let errorsFound = false;
//         const errorRows = [];
//         const seenPairs = new Set();
        
//         this.previewData = dataRows
//             .filter(row => row.some(cell => cell.trim() !== '')) // Remove empty rows
//             .map((row, idx) => {
//                 let hasError = false;
//                 let errorMessages = [];
//                 let proposalIdValue = '';
//                 let proposalRecord = null;
//                 const cells = [{ value: idx + 1, class: '' }];
//                 let selectedReviewers = [];
//                 let mappingObjects = [];

//                 // Process each cell in the row
//                 row.forEach((cell, colIndex) => {
//                     let cssClass = '';
//                     const columnName = this.columns[colIndex + 1]?.trim();
                    
//                     // Handle Proposal Id column
//                     if (columnName === 'Proposal Id' && cell.trim()) {
//                         proposalIdValue = cell.trim();
//                         proposalRecord = this.propsals.find(proposal => proposal.Name === cell.trim());
                        
//                         if (!proposalRecord) {
//                             cssClass = 'error-cell';
//                             errorMessages.push('Proposal Id not found in proposals');
//                             hasError = true;
//                         }
//                         cells.push({ value: cell, class: cssClass });
//                         return;
//                     }
                    
//                     // Handle reviewer email columns (check if it's a reviewer email header)
//                     if (this.reviewerEmailHeaders.includes(columnName)) {
//                         const cellValue = cell.trim().toLowerCase();
                        
//                         // Check if this cell should be "1" (selected) or empty/other (not selected)
//                         if (cellValue === '1') {
//                             const reviewer = this.reviewers.find(rev => rev.Email__c === columnName);
                            
//                             if (!reviewer) {
//                                 cssClass = 'error-cell';
//                                 errorMessages.push(`Reviewer with email ${columnName} not found`);
//                                 hasError = true;
//                             } else {
//                                 selectedReviewers.push({
//                                     email: columnName,
//                                     reviewerId: reviewer.Id
//                                 });
//                             }
//                         } else if (cellValue !== '' && cellValue !== '0') {
//                             // Invalid value (not 1, 0, or empty)
//                             cssClass = 'error-cell';
//                             errorMessages.push(`Invalid value '${cell}' for reviewer ${columnName}. Use '1' to select or leave empty.`);
//                             hasError = true;
//                         }
                        
//                         cells.push({ value: cell, class: cssClass });
//                         return;
//                     }
                    
//                     // For any other columns, just add the cell as-is
//                     cells.push({ value: cell, class: cssClass });
//                 });

//                 // Check if no reviewers were selected for this proposal
//                 if (!hasError && selectedReviewers.length === 0) {
//                     hasError = true;
//                     errorMessages.push('No reviewers selected for this proposal');
//                     cells.forEach((cell, index) => {
//                         if (index > 0 && this.reviewerEmailHeaders.includes(this.columns[index]?.trim())) {
//                             cell.class = 'error-cell';
//                         }
//                     });
//                 }

//                 // Check for duplicate proposal-reviewer combinations
//                 if (!hasError && proposalIdValue) {
//                     selectedReviewers.forEach(reviewer => {
//                         const pairKey = `${proposalIdValue}||${reviewer.email}`;
//                         if (seenPairs.has(pairKey)) {
//                             hasError = true;
//                             errorMessages.push(`Duplicate assignment for reviewer ${reviewer.email}`);
//                         } else {
//                             seenPairs.add(pairKey);
//                         }
//                     });
//                 }

//                 // Create mapping objects for valid rows
//                 if (!hasError && proposalRecord && selectedReviewers.length > 0) {
//                     selectedReviewers.forEach(reviewer => {
//                         const mappingObject = {
//                             'Proposals__c': proposalRecord.Id,
//                             'Reviewer__c': reviewer.reviewerId,
//                             'Proposal_Stage__c': proposalRecord.RecordType?.Name === 'Two Plus Two' 
//                                 ? 'SomeDefaultStage' // You might want to set a default stage or get it from somewhere
//                                 : null
//                         };
//                         mappingObjects.push(mappingObject);
//                     });
//                     this.mappingData.push(...mappingObjects);
//                 }

//                 // Add error messages cell
//                 if (errorMessages.length > 0) {
//                     cells.push({ value: errorMessages.join('; '), class: 'error-cell' });
//                 } else {
//                     cells.push({ value: '-', class: '' });
//                 }

//                 if (hasError) {
//                     errorsFound = true;
//                     errorRows.push(idx + 1);
//                 }

//                 return { cells };
//             });

//         this.errorRowNumbers = errorRows.join(', ');
//         this.isSubmitDisabled = errorsFound || this.mappingData.length === 0;
//         this.submitClass = this.isSubmitDisabled ? 'cst-btn slds-m-around_small disable' : 'cst-btn slds-m-around_small';
//     }

//     handleSubmit() {
//         this.isSubmitDisabled = true;
//         this.submitClass = this.isSubmitDisabled ? 'cst-btn slds-m-around_small disable' : 'cst-btn slds-m-around_small';
//         createMapping({ mappings: this.mappingData})
//         .then(result => {
//             this.showToastEvent('Success', 'Mapping Created Successfully', 'success');
//             this.previewData = [];
//             this.columns = [];
//             this.errorRowNumbers = [];
//             this.isSubmitDisabled = false;
//         })
//         .catch(error => {
//             this.showToastEvent('Error', 'Something went wrong, please try again', 'error');
//             this.isSubmitDisabled = false;
//         })
//     }

//     handlePagination(event) {
//         this.paginatedData = event.detail.recordToDisplay;
//     }


//     showToastEvent(title, message, variant) {
//         this.dispatchEvent(
//             new ShowToastEvent({
//                 title: title,
//                 message: message,
//                 variant: variant
//             })
//         );
//     }
// }



// import { LightningElement, track } from 'lwc';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import fetchDataOnLoad from '@salesforce/apex/bulkReviewerMappingAllocationController.fetchDataOnLoad';
// import createMapping from '@salesforce/apex/bulkReviewerMappingAllocationController.createMapping';

// export default class BulkReviewerMappingAllocation extends LightningElement {
//     @track columns = [];
//     @track previewData = [];
//     @track propsals = [];
//     @track reviewers = [];
//     @track proposalStages = [];
//     @track errorRowNumbers = [];
//     @track mappingData = [];
//     @track paginatedData = [];
//     @track isSubmitDisabled = true;
//     @track submitClass = 'cst-btn slds-m-around_small';
//     expectedHeaders = ['Proposal Id', 'Reviewer\'s Email', 'Proposal Stage'];

//     connectedCallback() {
//         this.getDataOnLoad();
//     }

//     getDataOnLoad() {
//         debugger;
//         fetchDataOnLoad()
//         .then(data => {
//             this.propsals = data.proposals;
//             this.reviewers = data.reviewers;
//             this.proposalStages = data.proposalStages;
//         })
//         .catch(error => {
//             console.error(JSON.stringify(error));
//         })
//     }

//     downloadTemplate() {
//         debugger;
//         const headers = this.expectedHeaders.join(',');
//         const csv = headers + '\n';
//         const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
//         // const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = encodedUri;
//         a.target = '_self';
//         a.download = 'Bulk_Reviewer_Mapping_Temaplate.csv';
//         a.click();
//         URL.revokeObjectURL(url);
//     }

//     uploadTemplate() {
//         debugger;
//         const uploadFileComp = this.template.querySelector('.upload');
//         uploadFileComp.click();
//     }

//     handleFileUpload(event) {
//         this.previewData = [];
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 const text = reader.result;
//                 this.parseCSV(text);
//             };
//             reader.readAsText(file);
//         }
//     }

//     parseCSV(text) {
//         this.previewData = [];
//         this.columns = [];
//         this.errorRowNumbers = [];
//         this.isSubmitDisabled = true;
//         this.mappingData = [];
//         const rows = text.trim().split('\n').map(row => row.split(','));
//         this.columns = ['S.No', ...rows[0], 'Errors'];
//         const dataRows = rows.slice(1);
//         var errorsFound = false;
//         const errorRows = [];
//         const seenPairs = new Set();
//         this.previewData = dataRows
//             .filter(row => row.some(cell => cell.trim() !== '')) // Remove empty rows
//             .map((row, idx) => {
//                 var hasError = false;
//                 var errorMessages = [];
//                 var proposalIdValue = '';
//                 var reviewerEmailValue = '';
//                 var mappingObject = {};
//                 const cells = [{ value: idx + 1, class: '' }];
//                 var checkProposalStage = false;
//                 // Loop through CSV data columns
//                 row.forEach((cell, colIndex) => {
//                     var cssClass = '';
//                     if (this.columns[colIndex + 1].trim() === 'Proposal Id' && cell.trim()) {
//                         if (!(this.propsals.length > 0 && this.propsals.some(proposal => proposal.Name === cell.trim()))) {
//                             cssClass = 'error-cell';
//                             errorMessages.push('Proposal Id not found in proposals');
//                             hasError = true;
//                         }else {
//                             checkProposalStage = this.propsals.find(pr => pr.Name === cell.trim())?.RecordType?.Name == 'Two Plus Two';
//                         }
//                     }
//                     if (this.columns[colIndex + 1].trim() === 'Reviewer\'s Email' && cell.trim()) {
//                         if (!(this.reviewers.length > 0 && this.reviewers.some(reviewer => reviewer.Email__c === cell.trim()))) {
//                             cssClass = 'error-cell';
//                             errorMessages.push('Email not found in reviewers');
//                             hasError = true;
//                         }
//                     }
//                     if (this.columns[colIndex + 1].trim() === 'Proposal Stage' && cell.trim()) {
//                         if (!(this.proposalStages.length > 0 && this.proposalStages.some(ps => ps === cell.trim()))) {
//                             cssClass = 'error-cell';
//                             errorMessages.push('Stage not found in Proposal Stages');
//                             hasError = true;
//                         }
//                     }
//                     // Check if column is in expected headers
//                     if (this.expectedHeaders.includes(this.columns[colIndex + 1].trim())) {
//                         if (!cell.trim() && !(this.columns[colIndex + 1].trim() == 'Proposal Stage')) {
//                             cssClass = 'error-cell';
//                             errorMessages.push(`${this.columns[colIndex + 1]} is empty`);
//                             hasError = true;
//                             cells.push({ value: cell, class: cssClass });
//                             return;
//                         }
//                         if (!cell.trim() && (this.columns[colIndex + 1].trim() == 'Proposal Stage' && checkProposalStage)) {
//                             cssClass = 'error-cell';
//                             errorMessages.push(`${this.columns[colIndex + 1]} is empty`);
//                             hasError = true;
//                             cells.push({ value: cell, class: cssClass });
//                             return;
//                         }
//                     }
//                     if(!hasError) {
//                         if(this.columns[colIndex + 1].trim() == 'Proposal Id') {
//                             mappingObject['Proposals__c'] = this.propsals.find(pr => pr.Name == cell.trim()).Id;
//                         }else if(this.columns[colIndex + 1].trim() == 'Reviewer\'s Email') {
//                             mappingObject['Reviewer__c'] = this.reviewers.find(rev => rev.Email__c == cell.trim()).Id;
//                         }
//                         else if(this.columns[colIndex + 1].trim() == 'Proposal Stage') {
//                             mappingObject['Proposal_Stage__c'] = cell.trim();
//                         }
//                     }
//                     cells.push({ value: cell, class: cssClass });
//                 });
//                 if (proposalIdValue && reviewerEmailValue) {
//                     const pairKey = `${proposalIdValue}||${reviewerEmailValue}`;
//                     if (seenPairs.has(pairKey)) {
//                         hasError = true;
//                         errorMessages.push('Duplicate Proposal Id & Reviewer Email combination');
//                         cells.forEach(c => {
//                             if (c.value === proposalIdValue || c.value === reviewerEmailValue) {
//                                 c.class = 'error-cell';
//                             }
//                         });
//                     } else {
//                         seenPairs.add(pairKey);
//                     }
//                 }
//                 if (errorMessages.length > 0) {
//                     cells.push({ value: errorMessages.join('; '), class: 'error-cell' });
//                 } else {
//                     cells.push({ value: '-', class: '' });
//                 }
//                 if (hasError) {
//                     errorsFound = true;
//                     errorRows.push(idx + 1);
//                 }else {
//                     if (Object.keys(mappingObject).length > 0) {
//                         this.mappingData.push(mappingObject);
//                     }
//                 }
//                 return { cells };
//             });
//         this.errorRowNumbers = errorRows.join(', ');
//         this.isSubmitDisabled = errorsFound;
//         this.submitClass = this.isSubmitDisabled ? 'cst-btn slds-m-around_small disable' : 'cst-btn slds-m-around_small';
//     }

//     handleSubmit() {
//         this.isSubmitDisabled = true;
//         this.submitClass = this.isSubmitDisabled ? 'cst-btn slds-m-around_small disable' : 'cst-btn slds-m-around_small';
//         createMapping({ mappings: this.mappingData})
//         .then(result => {
//             this.showToastEvent('Success', 'Mapping Created Successfully', 'success');
//             this.previewData = [];
//             this.columns = [];
//             this.errorRowNumbers = [];
//             this.isSubmitDisabled = false;
//         })
//         .catch(error => {
//             this.showToastEvent('Error', 'Something went wrong, please try again', 'error');
//             this.isSubmitDisabled = false;
//         })
//     }

//     handlePagination(event) {
//         this.paginatedData = event.detail.recordToDisplay;
//     }


//     showToastEvent(title, message, variant) {
//         this.dispatchEvent(
//             new ShowToastEvent({
//                 title: title,
//                 message: message,
//                 variant: variant
//             })
//         );
//     }
// }