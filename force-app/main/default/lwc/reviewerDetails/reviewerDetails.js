import { LightningElement, wire, track } from 'lwc';
import getReviewerMappingCounts from '@salesforce/apex/ReviewerReport.getReviewerMappingCounts';
import getReviewerDetails from '@salesforce/apex/ReviewerReport.getReviewerDetails';

export default class ReviewerDetails extends LightningElement {
    
    @track allData = [];
    @track paginationData = []; 
    @track error;

   
    @track isModalOpen = false;
    @track selectedReviewer;
    @track selectedReviewerDetails = [];   
    @track filteredReviewerDetails = [];   
    @track selectedReviewerDetail = [];    
    @track searchKey = '';


    @wire(getReviewerMappingCounts)
    wiredData({ error, data }) {
        if (data) {
            this.allData = data.map((element, idx) => ({
                ...element,
                index: idx + 1
            }));
            this.error = undefined;
           
        } else if (error) {
            this.error = error;
            this.allData = [];
        }
    }

 
    handlePagination(event) {
        this.paginationData = event.detail.recordToDisplay || [];
    }

  
    handlePaginationTwo(event) {
        this.selectedReviewerDetail = event.detail.recordToDisplay || [];
    }

 
    handleViewDetails(event) {
        const reviewerName = event.target.dataset.name;
        this.selectedReviewer = reviewerName;
        console.log('Inside handleViewDetails=====================>'+reviewerName);

        getReviewerDetails({ reviewerName })
            .then(result => {
              
                this.selectedReviewerDetails = result.map((item, idx) => ({
                    ...item,
                    serialNumber: idx + 1,
                    callType:
                        (item.Proposals__r &&
                         item.Proposals__r.RecordType &&
                         item.Proposals__r.RecordType.Name)
                            ? item.Proposals__r.RecordType.Name
                            : ''
                }));

             
                this.filteredReviewerDetails = [...this.selectedReviewerDetails];
                this.searchKey = '';

                this.isModalOpen = true;
            })
            .catch(err => {
               
                console.error(err);
                this.selectedReviewerDetails = [];
                this.filteredReviewerDetails = [];
                this.selectedReviewerDetail = [];
                this.isModalOpen = true; 
            });
    }

   
   handleSearch(event) {
    debugger;
    this.searchKey = event.target.value.toLowerCase();

    if (this.searchKey) {
        this.filteredReviewerDetails = this.selectedReviewerDetails.filter(
            (item) =>
                (item.callType && item.callType.toLowerCase().includes(this.searchKey))
        );
    } else {
       
        this.filteredReviewerDetails = [...this.selectedReviewerDetails];
    }
}

    handleCloseModal() {
        this.isModalOpen = false;
        this.selectedReviewer = null;
        this.selectedReviewerDetails = [];
        this.filteredReviewerDetails = [];
        this.selectedReviewerDetail = [];
        this.searchKey = '';
    }
}