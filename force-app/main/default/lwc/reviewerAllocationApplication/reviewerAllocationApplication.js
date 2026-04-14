import { LightningElement, track } from 'lwc';
import getOnloadData from '@salesforce/apex/reviewerAllocationApllicationController.getOnloadData';
import { NavigationMixin } from 'lightning/navigation';

export default class ReviewerAllocationApplication extends NavigationMixin(LightningElement) {
    @track selectedFilter = 'Filter by';
    @track selectedYear = 'All';
    @track filterDropdown = false;
    @track yearDropdown = false;
    @track activateTotal = true;
    @track isLoading = false;
    @track paginatedData = [];
    @track totalProposals = 0;
    @track draftProposals = 0;
    @track submittedProposals = 0;
    @track reviewedProposals = 0;
    @track notReviewedProposals = 0;
    @track filteredByCampaign = [];
    @track filteredByYear = [];
    @track filteredBody = [];
    @track body = [];
    @track filterOptions = [];
    @track yearOptions = [];
    @track header = [
        {
            label: 'S. No.',
            value: 'sno'
        },        {
            label: 'Proposal Id',
            value: 'Name'
        },
        {
            label: 'Applicant Name',
            value: 'appName'
        },
        {
            label: 'Campaign Type',
            value: 'Campaign__r.Name'
        },
        {
            label: 'Proposal Stage',
            value: 'stage'
        },
        {
            label: 'Date Received',
            value: 'CreatedDate'
        }
    ];
    get cards() {
        return [
            {
                icon: 'fa-solid fa-file-lines',
                value: this.totalProposals,
                label: 'Total Applications',
                class: 'icon-container total'
            },
            {
                icon: 'fa-regular fa-circle-check',
                value: this.reviewedProposals,
                label: 'Reviewer Assigned',
                class: 'icon-container approved'
            },
            {
                icon: 'fa-solid fa-pen',
                value: this.draftProposals,
                label: 'Draft',
                class: 'icon-container draft'
            },
            {
                icon: 'fa-solid fa-paper-plane',
                value: this.submittedProposals,
                label: 'Submitted',
                class: 'icon-container submit'
            },
            {
                icon: 'fa-solid fa-file-lines',
                value: this.notReviewedProposals,
                label: 'Reviewer Not Assigned',
                class: 'icon-container pending'
            }
        ]
    }
    // getter to transform body into template-friendly structure
    get processedBody() {
        return this.paginatedData.map((row, index) => {
            return {
                key: index,
                Id: row.Id,
                values: this.header.map((col, colIndex) => {
                    return { key: `${index}-${colIndex}`, value: this.getValue(row, col.value) };
                })
            };
        });
    }
    get isDataAvailable() {
        return this.processedBody.length > 0;
    }

    getValue(row, path) {
        return path.split('.').reduce((acc, key) => acc && acc[key], row);
    }

    handleView(event) {
        const recordId = event.target.value;
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                actionName: 'view'
            }
        }).then(url => {
            window.open(url, '_blank');
        });
    }

    connectedCallback() {
        // window.addEventListener('click', this.closeDropDown.bind(this));
        // this.template.querySelector('[data-value="Total"]').classList.add('active');
        this.loadData();
    }

    loadData() {
        this.selectedFilter = 'Filter by';
        this.selectedYear = 'All';
        this.filterDropdown = false;
        this.yearDropdown = false;
        this.activateTotal = true;
        this.paginatedData = [];
        this.filteredByCampaign = [];
        this.filteredByYear = [];
        this.filteredBody = [];
        this.body = [];
        this.filterOptions = [];
        this.yearOptions = [];
        this.isLoading = true;
        getOnloadData()
        .then(result => {
            debugger;
            this.body = result.proposals.map((item, index) => {
                var allNames = [];
                item.Accounts__r?.forEach(acc => {acc.Contacts?.forEach(con => {
                    if(con.Name) {
                        allNames.push(con.Name);
                    }
                })});
                return {
                    ...item,
                    sno: index + 1,
                    appName: allNames.join(', '),
                    stage: item.RecordType.Name == 'Two Plus Two' ? item.Proposal_Stages__c + ' - ' + item.Stage__c : item.Proposal_Stages__c,
                    CreatedDate: item.CreatedDate ? new Date(item.CreatedDate).toLocaleDateString('en-GB', {day: '2-digit',month: 'short',year: 'numeric'}) : 'Not Mentioned'
                }
            });
            this.calculateCards(this.body);
            this.originalData = [...this.body];
            this.filteredByCampaign = [...this.body];
            this.filteredBody = [...this.body];
            this.filterOptions = [
                { label: 'All', value: 'all' },
                ...result.campaigns.map(item => ({
                    label: item.Name,
                    value: item.Name
                }))
            ];
            this.yearOptions = [
                { label: 'All', value: 'all' },
                ...result.yearlist.map(year => ({
                    label: String(year.Year__c),
                    value: String(year.Year__c)
                }))
            ];
            this.isLoading = false;
        })
        .catch(error => {
            console.error('Error while fetching initial data of applications ---> ' + JSON.stringify(error));
            this.isLoading = false;
        })
    }

    renderedCallback() {
        if(this.activateTotal){
            this.activateTotal = false;
            setTimeout(() => {
                const cards = this.template.querySelectorAll(`[data-id="card"]`);
                cards.forEach(card => {
                    if(card.dataset.value == 'Total') {
                        card.classList.add('active');
                    } else {
                        card.classList.remove('active');
                    }
                })
            }, 500);
        }
    }

    calculateCards(value) {
        this.totalProposals = value.length;
        this.draftProposals = value.filter(item => item?.Proposal_Stages__c == 'Draft').length;
        this.submittedProposals = value.filter(item => item?.Submitted__c == true).length;
        this.reviewedProposals = value.filter(item => item?.Reviewer_Mapping__r?.length > 0).length;
        this.notReviewedProposals = value.filter(item => !(item?.Reviewer_Mapping__r?.length > 0)).length;
    }

    handleSelect(event) {
        this.activateTotal = true;
        const value = event.target.dataset.value;
        const label = event.target.textContent;
        if(this.filterOptions.map(item => item.value).includes(value)) {
            this.selectedFilter = label;
            this.selectedYear = "All";
            if(value =='all') {
                this.filteredByCampaign = this.originalData.map((item, index) => {
                    item.sno = index + 1;
                    return item;
                });
                this.body = this.originalData.map((item, index) => {
                    item.sno = index + 1;
                    return item;
                });;
                this.filteredBody = this.originalData.map((item, index) => {
                    item.sno = index + 1;
                    return item;
                });;
            } else {
                this.filteredByCampaign = this.originalData
                .filter(item => item.Campaign__r.Name == value)
                .map((item, index) => {
                    item.sno = index + 1;
                    return item;
                });
                this.body = [...this.filteredByCampaign];
                this.filteredBody = [...this.filteredByCampaign];
            }
            this.filterDropdown = false;
        }
        else {
            this.selectedYear = label;
            if(value == 'all') {
                this.filteredByYear = [...this.filteredByCampaign];
                this.body = [...this.filteredByCampaign];
                this.filteredBody = [...this.filteredByCampaign];
            } else {
                this.filteredByYear = this.filteredByCampaign
                .filter(item => item.CreatedDate.slice(-4) == label)
                .map((item, index) => {
                    item.sno = index + 1;
                    return item;
                });
                this.body = [...this.filteredByYear];
                this.filteredBody = [...this.filteredByYear];
            }
            this.yearDropdown = false;
        }
        this.calculateCards(this.body);
    }

    handleCardClick(event) {
        debugger;
        const value = event.target.dataset.value;
        // Activating the selected card
        const cards = this.template.querySelectorAll(`[data-id="card"]`);
        cards.forEach(card => {
            if(card.dataset.value == value) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        })
        // this.template.querySelector(`[data-value="${event.target.dataset.value}"]`).classList.add('active');
        if(value == 'Total') {
            this.body = [...this.filteredBody];
        }else if(value == 'Reviewed') {
            this.body = this.filteredBody
            .filter(item => item?.Reviewer_Mapping__r?.length > 0)
            .map((item, index) => {
                item.sno = index + 1;
                return item;
            })
        }else if(value == 'Draft') {
            this.body = this.filteredBody
            .filter(item => item.Proposal_Stages__c == 'Draft')
            .map((item, index) => {
                item.sno = index + 1;
                return item;
            })
        }else if(value == 'Submitted') {
            this.body = this.filteredBody
            .filter(item => item.Submitted__c == true)
            .map((item, index) => {
                item.sno = index + 1;
                return item;
            })
        }else if(value == 'Not Reviewed') {
            this.body = this.filteredBody.filter(item => !(item?.Reviewer_Mapping__r?.length > 0))
            .map((item, index) => {
                item.sno = index + 1;
                return item;
            })
        }
    }

    handleRefresh() {
        this.loadData();
    }

    handlePagination(event) {
        this.paginatedData = event.detail.recordToDisplay;
    }

    openDropdown(event) {
        const id = event.target.dataset.id;
        if(id === 'filter') {
            this.filterDropdown = !this.filterDropdown;
        }
        if(id === 'year') {
            this.yearDropdown = !this.yearDropdown;
        }
    }

    closeDropDown() {
        if(this.filterDropdown || this.yearDropdown) {
            this.filterDropdown = false;
            this.yearDropdown = false;
        }
    }

    // disconnectedCallback() {
    //     window.removeEventListener('click', this.closeDropDown.bind(this));
    // }
}