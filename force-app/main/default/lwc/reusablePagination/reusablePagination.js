import { LightningElement, api, track } from 'lwc';

export default class ReusablePagination extends LightningElement {
    @track currentPage = 1;
    @api pageSize ;
    @track recordsToDisplay = [];
    @track hasRecordsToPaginate = false;
    @track  pagesCountArray = [];
    @track pagesCount = 0;
    @track currentPageNums={};
    @track _list = [];

    @api
    set list(value) {
        this._list = value;
        this.currentPage = 1; 
        this.setPagination(); 
    }

    get list() {
        return this._list;
    }

    connectedCallback() {
        this.setPagination();
    }

    setPagination() {
        debugger;
        if (this.list.length > 0) {
            this.pagesCount = Math.ceil(this.list.length / this.pageSize);
            let startPage, endPage;
            if (this.pagesCount <= 3) {
                startPage = 1;
                endPage = this.pagesCount;
            } else {
                if (this.currentPage === 1) {
                    startPage = 1;
                    endPage = 3;
                } else if (this.currentPage === this.pagesCount) {
                    startPage = this.pagesCount - 2;
                    endPage = this.pagesCount;
                } else {
                    startPage = this.currentPage - 1;
                    endPage = this.currentPage + 1;
                }
                if (startPage < 1) {
                    startPage = 1;
                    endPage = 3;
                }
                if (endPage > this.pagesCount) {
                    endPage = this.pagesCount;
                    startPage = this.pagesCount - 2;
                }
            }
            this.pagesCountArray = [];
            this.currentPageNums={};
            for (let i = startPage; i <= endPage; i++) {
                this.pagesCountArray.push({
                    number: i,
                    isCurrent: i == this.currentPage
                });
            }
            this.hasRecordsToPaginate = true;
            this.recordsToDisplay = this.list.slice(
                (this.currentPage - 1) * this.pageSize,
                this.currentPage * this.pageSize
            );
        } else {
            this.pagesCountArray = [];
            this.recordsToDisplay = [];
            this.hasRecordsToPaginate = false;
        }
        this.fireEventToDispaly();
    }

    handleNextButton() {
        if (this.currentPage < this.pagesCount) {
            this.currentPage++;
            this.setPagination();
        }
    }

    handlePrevButton() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.setPagination();
        }
    }

    handlePageNumChange(event) {
        this.currentPage = parseInt(event.target.dataset.field, 10);
        this.setPagination();
    }

    fireEventToDispaly() {
        this.dispatchEvent(new CustomEvent('pagechange', { detail: { recordToDisplay: this.recordsToDisplay
         } }));
    }
}