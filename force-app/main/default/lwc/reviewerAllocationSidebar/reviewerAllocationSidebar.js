import { LightningElement, track, wire } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import bootstrapCSS from '@salesforce/resourceUrl/Bootstrap';
import FontAwesome from '@salesforce/resourceUrl/FontAwesome';
import LOGO from "@salesforce/resourceUrl/Logo";
import getSideBarOnLoadData from '@salesforce/apex/ReviewerAllocationController.getSideBarOnLoadData';

export default class DmsPortalSideBar extends LightningElement {
    @track sidebarItemsWithClasses = [];
    @track activeLink = 'dashboard';
    @track sidebarVisible = false;
    @track isContracted = false;
    @track isLoading = false;
    @track igstcLogo = LOGO;

    connectedCallback() {
        loadStyle(this, FontAwesome + '/FontAwesome/css/all.min.css')
        .then(() => console.log('Icons loaded'))
        .catch(error => console.error('Error loading styles', error));
        loadStyle(this, bootstrapCSS + '/bootstrap-5.3.5-dist/css/bootstrap.min.css')
        .then(() => console.log('Bootstrap CSS loaded'))
        .catch((error) => console.error('Error loading Bootstrap CSS:', error));
    }

    @wire(getSideBarOnLoadData)
    wiredSidebarItems(result) {
        debugger;
        this.isLoading = true;
        if (result.data) {
            this.sidebarItems = result.data.sidebarItems;
            this.sidebarItemsWithClasses = this.sidebarItems.map((item) => ({
                ...item,
                class: this.getItemClass(item.Value__c)
            }));
            this.isLoading = false;
        } else if (result.error) {
            console.error('Error fetching sidebar sections:', result.error);
            this.isLoading = false;
        }
    }

    getItemClass(value) {
        return value === this.activeLink ? 'gap-2 sidebar-content active' : 'gap-2 sidebar-content';
    }

    toggleSidebar() {
        debugger;
        this.sidebarVisible = !this.sidebarVisible;
    }

    toggleContraction() {
        debugger;
        this.isContracted = !this.isContracted;
    }

    setActive(event) {
        if(event.currentTarget.getAttribute('data-value')) {
            var value = event.currentTarget.getAttribute('data-value');
            this.activeLink = value;
        } else if(event.detail.component){
            var value = event.detail.component;
            this.activeLink = value;
        }
        if (!value) {
            console.warn('data-value is missing on clicked element');
            return;
        }
        // Recompute the item classes to reflect the new active state
        this.sidebarItemsWithClasses = this.sidebarItemsWithClasses.map((item) => ({
            ...item,
            class: this.getItemClass(item.Value__c),
        }));
    }

    get sidebarClass() {
        let classes = 'sidebar-container';
        if (this.sidebarVisible) classes += ' visible';
        if (this.isContracted) classes += ' contracted';
        return classes;
    }

    get isDashboard() {
        return this.activeLink == 'dashboard';
    }
    get isApplications() {
        return this.activeLink == 'application';
    }
    get isAllocationEngine() {
        return this.activeLink == 'engine';
    }
    get isBulUpload() {
        return this.activeLink == 'bulk';
    }
    get isReviewerDetails() {
        return this.activeLink == 'reviewers';
    }
    get isReviewerReport() {
        return this.activeLink == 'report';
    }
}