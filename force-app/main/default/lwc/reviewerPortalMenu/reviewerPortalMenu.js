import { LightningElement, track } from 'lwc';
    import LOGO from "@salesforce/resourceUrl/Logo";
    export default class ReviewerPortalMenu extends LightningElement {
        igstcLogo = LOGO;
        allApplications= false;
        isopenDashBoard = false;
        isallAppliactions=false;
        isAllocated = false;
        isReviwer = false
        isReviwerReport = false;
        allApplications1 =false;
      @track dashboardOpen = true;
        @track openMenu = false;
        @track dashBoard = false;
       
        handleClick(){
            debugger;
            openMenu = true;
            console.log(openMenu);
        
        }  
        openApplicationdefault(){
          this.isReviwerReport = false;
            this.dashboardOpen= true;
            this.allApplications= true;
            this.allApplications1=true
            this.isopenDashBoard= false;
            this.isallAppliactions=true;
            this.isAllocated = false;
              this.isReviwer = false;
        }
        openAlocationdefault(){
          this.isReviwerReport = false;
             this.dashboardOpen= true;
               this.isAllocated = true;
                 this.isReviwer = false;
        this.allApplications1=false;   
        this.allApplications= true;
        this.isopenDashBoard= false;
        this.isallAppliactions=false;
        }
        openDashboardBydefault(){
          this.isReviwerReport = false;
            this.dashboardOpen= true;
              this.allApplications= false;
            this.isopenDashBoard= true;
            this.isallAppliactions=false;
            this.isAllocated = false;
                this.isReviwer = false;
            this.allApplications1=false;   
        }
        hamburgerClose(){
            this.dashboardOpen = false;
        }
        openDashBoard(){
          this.isReviwerReport = false;
           // this.template.querySelector('c-reviewer-portal').play();
            this.allApplications= false;
            this.isopenDashBoard= true;
            this.isallAppliactions=false;
            this.isAllocated = false;
               this.isReviwer = false;
            this.allApplications1=false;       
            console.log(this.allApplications);
        }
        allAppliactions(){
          this.isReviwerReport = false;
            this.allApplications= true;
            this.allApplications1=true
            this.isopenDashBoard= false;
            this.isallAppliactions=true;
            this.isAllocated = false;
           this.isReviwer = false;
            console.log(this.allApplications);
          }
     allocated(){
      this.isReviwerReport = false;
        this.isAllocated = true;
        this.isReviwer = false;
        this.allApplications1=false;   
        this.allApplications= true;
        this.isopenDashBoard= false;
        this.isallAppliactions=false;
           }
           reviewerData(){
            this.isReviwerReport = false;
             this.isReviwer = true;
               this.isAllocated = false;
        this.allApplications1=false;   
        this.allApplications= true;
        this.isopenDashBoard= false;
        this.isallAppliactions=false;
           }
      
        reviewerDataReport(){
          this.isReviwerReport = true;
          this.isReviwer = false;
            this.isAllocated = false;
     this.allApplications1=false;   
     this.allApplications= true;
     this.isopenDashBoard= false;
     this.isallAppliactions=false;
        }
     }