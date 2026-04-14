import { LightningElement,wire,api,track } from 'lwc';
import pendingRecordCount from '@salesforce/apex/ReviwerPortalController.pendingRecordCount';
import getProposalApplicationSing from '@salesforce/apex/ReviwerPortalController.getProposalApplicationSing';
import getProposalApplicationIf from '@salesforce/apex/ReviwerPortalController.getProposalApplicationIf';
import getProposalApplicationPECFAR from '@salesforce/apex/ReviwerPortalController.getProposalApplicationPECFAR';
import getProposalApplicationWISER from '@salesforce/apex/ReviwerPortalController.getProposalApplicationWISER';
import getProposalApplicationWorkshop from '@salesforce/apex/ReviwerPortalController.getProposalApplicationWorkshop';
import getApplicationBasedOnType from '@salesforce/apex/ReviwerPortalController.getApplicationBasedOnType';
import getAllocatedpending from '@salesforce/apex/ReviwerPortalController.getAllocatedpending';
import getAllocatedCompleted from '@salesforce/apex/ReviwerPortalController.getAllocatedCompleted';
import getAllocatedCompletedtpt from '@salesforce/apex/ReviwerPortalController.getProposalApplicationtpt';
import getUnAllocated from '@salesforce/apex/ReviwerPortalController.getUnAllocated';
export default class ReviewerPortal extends LightningElement {
  @api recName
 @api videoUrl
  @track tptList = [];
  submittedApplications = 0
  totalAllocated1 = 0
  totalAllocated = 0
  totalApplications = 0
  draftApplications = 0
  totalPendApps = 0;
  totalcompApps = 0;
  singList = [];
  pecfarList = [];
  ifList = [];
  wiserList = [];
  workShopList = [];
  numberSing = 0
  numberTpT = 0;
  numberPECFAR = 0;
  numberIF = 0;
  numberWISER = 0;
  numberWorkshop = 0;
  pendingApp=0;
  unallocatedSubmittedApplications=0
  submittedApplications1 = 0
  allocatedSubmittedApplications = 0
  

          connectedCallback() {
                this.recName ='Two plus Two';
                this.getProposalApplicationList;
                this.getProposalApplicationworkshopList
                this.getProposalApplicationqwiserList
                this.getProposalApplicationpecfarList
                this.getProposalApplicationifList
                this.getProposalApplicationsingList
                let draftCount = 0;
                let submittedCount = 0;
                let subcount = 0;
                let AllocationsubmittedCount = 0;
                  getApplicationBasedOnType({
                                RecordTypeName: this.recName
                        }).then(result => {
                                console.log('result-->', JSON.stringify(result));
                                this.totalApplications = result.length;
                                result.forEach(element => {
                                        if (element.Proposal_Stages__c === 'Draft') {
                                                draftCount++;
                                        } else if (element.Submitted__c === true) {
                                                submittedCount++;
                                        } else if (element.Proposal_Stages__c === 'Under Review' && element.Submitted__c === true) {
                                                AllocationsubmittedCount++;
                                        } else if (element.Proposal_Stages__c === 'Submitted') {
                                                subcount++
                                        }
                                });
                                this.draftApplications = draftCount;
                                this.submittedApplications = submittedCount;
                                this.allocatedSubmittedApplications = AllocationsubmittedCount;
                           
                        })
                        .catch(error => {
                                console.log('error-->', error);
                        });
                        getUnAllocated({
                                RecordTypeName: this.recName
                        }).then(result => {
                             
                                this.unallocatedSubmittedApplications= result.length;
                        });
                getAllocatedpending({
                        RecordTypeName: this.recName
                }).then(result => {
                        this.totalPendApps = result.length;
                        this.submittedApplications1 = result.length;
                });
                getAllocatedCompleted({
                        RecordTypeName: this.recName
                }).then(result => {
                        this.totalcompApps = result;
                });
                this.totalAllocated1 = this.totalPendApps + this.totalcompApps
                
                pendingRecordCount({RecordTypeName: this.recName
                }).then(result => {
                        this.pendingApp = result;
                });
        }
        
  
  @api play(){
        this.getProposalApplicationList;
        this.getProposalApplicationworkshopList
        this.getProposalApplicationqwiserList
        this.getProposalApplicationpecfarList
        this.getProposalApplicationifList
        this.getProposalApplicationsingList
  }
  handleClick2p2(event) {
          console.log('tyuio' + event.currentTarget.dataset.name);
          this.recName = event.currentTarget.dataset.name;
          let draftCount = 0;
          let submittedCount = 0;
          let subcount = 0;
          let AllocationsubmittedCount = 0;
          getApplicationBasedOnType({
                          RecordTypeName: this.recName
                  }).then(result => {
                          console.log('result-->', JSON.stringify(result));
                          this.totalApplications = result.length;
                          result.forEach(element => {
                                  if (element.Proposal_Stages__c === 'Draft') {
                                          draftCount++;
                                  } else if (element.Submitted__c === true) {
                                          submittedCount++;
                                  } else if (element.Proposal_Stages__c === 'Under Review' && element.Submitted__c === true) {
                                          AllocationsubmittedCount++;
                                  } else if (element.Proposal_Stages__c === 'Submitted'&& element.Submitted__c === true) {
                                          subcount++
                                  }
                          });
                          this.draftApplications = draftCount;
                          this.submittedApplications = submittedCount;
                          this.allocatedSubmittedApplications = AllocationsubmittedCount;
                          
                  })
                  .catch(error => {
                          console.log('error-->', error);
                  });

                  getUnAllocated({
                        RecordTypeName: this.recName
                }).then(result => {
                      
                        this.unallocatedSubmittedApplications= result.length;
                });

          getAllocatedpending({
                  RecordTypeName: this.recName
          }).then(result => {
                  this.totalPendApps = result.length;
                  this.submittedApplications1 = result.length;
          });
          getAllocatedCompleted({
                  RecordTypeName: this.recName
          }).then(result => {
                  this.totalcompApps = result;
          });
          this.totalAllocated1 = this.totalPendApps + this.totalcompApps

          pendingRecordCount({RecordTypeName: this.recName
          }).then(result => {
                  this.pendingApp = result;
          });
  }
  handleClickPECFAR(event) {
          console.log('tyuio' + event.currentTarget.dataset.name);
          this.recName = event.currentTarget.dataset.name;
          let draftCount = 0;
          let submittedCount = 0;
          let subcount = 0;
          let AllocationsubmittedCount = 0;
          getApplicationBasedOnType({
                          RecordTypeName: this.recName
                  }).then(result => {
                          console.log('result-->', JSON.stringify(result));
                          this.totalApplications = result.length;
                          result.forEach(element => {
                                  if (element.Proposal_Stages__c === 'Draft') {
                                          draftCount++;
                                  } else if (element.Submitted__c === true) {
                                          submittedCount++;
                                  } else if (element.Proposal_Stages__c === 'Under Review' && element.Submitted__c === true) {
                                          AllocationsubmittedCount++;
                                  } else if (element.Proposal_Stages__c === 'Submitted' && element.Submitted__c === true) {
                                          subcount++
                                  }
                          });
                          this.draftApplications = draftCount;
                          this.submittedApplications = submittedCount;
                          this.allocatedSubmittedApplications = AllocationsubmittedCount;
                 
                  })
                  .catch(error => {
                          console.log('error-->', error);
                  });

                  getUnAllocated({
                        RecordTypeName: this.recName
                }).then(result => {
                       
                        this.unallocatedSubmittedApplications= result.length;
                });

          getAllocatedpending({
                  RecordTypeName: this.recName
          }).then(result => {
                  this.totalPendApps = result.length;
                  this.submittedApplications1 = result.length;
          });
          getAllocatedCompleted({
                  RecordTypeName: this.recName
          }).then(result => {
                  this.totalcompApps = result;
          });
          this.totalAllocated1 = this.totalPendApps + this.totalcompApps

          pendingRecordCount({RecordTypeName: this.recName
          }).then(result => {
                  this.pendingApp = result;
          });
  }
  handleClickSING(event) {
          console.log('tyuio' + event.currentTarget.dataset.name);
          this.recName = event.currentTarget.dataset.name;
          let draftCount = 0;
          let submittedCount = 0;
          let subcount = 0;
          let AllocationsubmittedCount = 0;
          getApplicationBasedOnType({
                          RecordTypeName: this.recName
                  }).then(result => {
                          console.log('result-->', JSON.stringify(result));
                          this.totalApplications = result.length;
                          result.forEach(element => {
                                  if (element.Proposal_Stages__c === 'Draft') {
                                          draftCount++;
                                  } else  if (element.Submitted__c === true) {
                                          submittedCount++;
                                  } else if (element.Proposal_Stages__c === 'Under Review' && element.Submitted__c === true) {
                                          AllocationsubmittedCount++;
                                  } else if (element.Proposal_Stages__c === 'Submitted' && element.Submitted__c === true ) {
                                          subcount++
                                  }
                          });
                          this.draftApplications = draftCount;
                          this.submittedApplications = submittedCount;
                          this.allocatedSubmittedApplications = AllocationsubmittedCount;
                         
                  })
                  .catch(error => {
                          console.log('error-->', error);
                  });

                  getUnAllocated({
                        RecordTypeName: this.recName
                }).then(result => {
                    
                        this.unallocatedSubmittedApplications= result.length;
                });
          getAllocatedpending({
                  RecordTypeName: this.recName
          }).then(result => {
                  this.totalPendApps = result.length;
                  this.submittedApplications1 = result.length;
          });
          getAllocatedCompleted({
                  RecordTypeName: this.recName
          }).then(result => {
                  this.totalcompApps = result;
          });
          this.totalAllocated1 = this.totalPendApps + this.totalcompApps

          pendingRecordCount({RecordTypeName: this.recName
          }).then(result => {
                  this.pendingApp = result;
          });
  }
  handleClickIF(event) {
          console.log('tyuio' + event.currentTarget.dataset.name);
          this.recName = event.currentTarget.dataset.name;
          let draftCount = 0;
          let submittedCount = 0;
          let subcount = 0;
          let AllocationsubmittedCount = 0;
          getApplicationBasedOnType({
                          RecordTypeName: this.recName
                  }).then(result => {
                          console.log('result-->', JSON.stringify(result));
                          this.totalApplications = result.length;
                     
                          result.forEach(element => {
                                  if (element.Proposal_Stages__c === 'Draft') {
                                          draftCount++;
                                  } else if (element.Submitted__c === true) {
                                          submittedCount++;
                                  } else if (element.Proposal_Stages__c === 'Under Review' && element.Submitted__c === true) {
                                          AllocationsubmittedCount++;
                                  } else if (element.Proposal_Stages__c === 'Submitted' ) {
                                          subcount++
                                          console.log('>>>>>subcount',subcount);
                                        
                                  }
                          });
                          this.draftApplications = draftCount;
                          this.submittedApplications = submittedCount;
                          this.allocatedSubmittedApplications = AllocationsubmittedCount;
                        
                  })
                  .catch(error => {
                          console.log('error-->', error);
                  });

                  getUnAllocated({
                        RecordTypeName: this.recName
                }).then(result => {
                        
                        this.unallocatedSubmittedApplications= result.length;
                });
          getAllocatedpending({
                  RecordTypeName: this.recName
          }).then(result => {
                  this.totalPendApps = result.length;
                  this.submittedApplications1 = result.length;
          });
          getAllocatedCompleted({
                  RecordTypeName: this.recName
          }).then(result => {
                  this.totalcompApps = result;
          });
          this.totalAllocated1 = this.totalPendApps + this.totalcompApps

          pendingRecordCount({RecordTypeName: this.recName
          }).then(result => {
                  this.pendingApp = result;
          });
  }
  handleClickWiser(event) {
          console.log('tyuio' + event.currentTarget.dataset.name);
          this.recName = event.currentTarget.dataset.name;
          let draftCount = 0;
          let submittedCount = 0;
          let subcount = 0;
          let AllocationsubmittedCount = 0;
          getApplicationBasedOnType({
                          RecordTypeName: this.recName
                  }).then(result => {
                          console.log('result-->', JSON.stringify(result));
                          this.totalApplications = result.length;
                          result.forEach(element => {
                                  if (element.Proposal_Stages__c === 'Draft') {
                                          draftCount++;
                                  } else if (element.Submitted__c === true) {
                                          submittedCount++;
                                  } else if (element.Proposal_Stages__c === 'Under Review' && element.Submitted__c === true) {
                                          AllocationsubmittedCount++;
                                  } else if (element.Proposal_Stages__c === 'Submitted' && element.Submitted__c === true) {
                                          subcount++
                                  }
                          });
                          this.draftApplications = draftCount;
                          this.submittedApplications = submittedCount;
                          this.allocatedSubmittedApplications = AllocationsubmittedCount;
                       
                  })
                  .catch(error => {
                          console.log('error-->', error);
                  });
                  getUnAllocated({
                        RecordTypeName: this.recName
                }).then(result => {
                       
                        this.unallocatedSubmittedApplications= result.length;
                });
          getAllocatedpending({
                  RecordTypeName: this.recName
          }).then(result => {
                  this.totalPendApps = result.length;
                  this.submittedApplications1 = result.length;
          });
          getAllocatedCompleted({
                  RecordTypeName: this.recName
          }).then(result => {
                  this.totalcompApps = result;
          });
          this.totalAllocated1 = this.totalPendApps + this.totalcompApps

          pendingRecordCount({RecordTypeName: this.recName
          }).then(result => {
                  this.pendingApp = result;
          });
  }
  handleClickWorkShp(event) {
          console.log('tyuio' + event.currentTarget.dataset.name);
          this.recName = event.currentTarget.dataset.name;
          let draftCount = 0;
          let submittedCount = 0;
          let subcount = 0;
          let AllocationsubmittedCount = 0;
          getApplicationBasedOnType({
                          RecordTypeName: this.recName
                  }).then(result => {
                          console.log('result-->', JSON.stringify(result));
                          this.totalApplications = result.length;
                          result.forEach(element => {
                                  if (element.Proposal_Stages__c === 'Draft') {
                                          draftCount++;
                                  } else if (element.Submitted__c === true) {
                                          submittedCount++;
                                  } else if (element.Proposal_Stages__c === 'Under Review' && element.Submitted__c === true) {
                                          AllocationsubmittedCount++;
                                  } else if (element.Proposal_Stages__c === 'Submitted') {
                                          subcount++
                                    
                                  }
                          });
                          this.draftApplications = draftCount;
                          this.submittedApplications = submittedCount;
                          this.allocatedSubmittedApplications = AllocationsubmittedCount;
                          
                  })
                  .catch(error => {
                          console.log('error-->', error);
                  });

                  getUnAllocated({
                        RecordTypeName: this.recName
                }).then(result => {
                       
                        this.unallocatedSubmittedApplications= result.length;
                });
          getAllocatedpending({
                  RecordTypeName: this.recName
          }).then(result => {
                  this.totalPendApps = result.length;
                  this.submittedApplications1 = result.length;
          });
          getAllocatedCompleted({
                  RecordTypeName: this.recName
          }).then(result => {
                  this.totalcompApps = result;
          });

          pendingRecordCount({RecordTypeName: this.recName
          }).then(result => {
                  this.pendingApp = result;
          });
  }
  @wire(getAllocatedCompletedtpt)
  getProposalApplicationList({
          data
  }) {
          if (data) {
                  console.log('lead data#' + JSON.stringify(data));
                  this.numberTpT = data.length
          };
  }
  @wire(getProposalApplicationSing)
  getProposalApplicationsingList({
          data
  }) {
          if (data) {
                  console.log('lead data#' + JSON.stringify(data));
                  this.numberSing = data.length
          };
  }
  @wire(getProposalApplicationIf)
  getProposalApplicationifList({
          data
  }) {
          if (data) {
                  console.log('lead data#' + JSON.stringify(data));
                  this.numberIF = data.length
          };
  }
  @wire(getProposalApplicationPECFAR)
  getProposalApplicationpecfarList({
          data
  }) {
          if (data) {
                  console.log('lead data#' + JSON.stringify(data));
                  this.numberPECFAR = data.length
          };
  }
  @wire(getProposalApplicationWISER)
  getProposalApplicationqwiserList({
          data
  }) {
          if (data) {
                  console.log('lead data#' + JSON.stringify(data));
                  this.numberWISER = data.length
          };
  }
  @wire(getProposalApplicationWorkshop)
  getProposalApplicationworkshopList({
          data
  }) {
          if (data) {
                  console.log('lead data#' + JSON.stringify(data));
                  this.numberWorkshop = data.length
          };
  }
}

// import getProposalApplication from '@salesforce/apex/ReviwerPortalController.getProposalApplication';
// import getProposalApplicationSing from '@salesforce/apex/ReviwerPortalController.getProposalApplicationSing';
// import getProposalApplicationIf from '@salesforce/apex/ReviwerPortalController.getProposalApplicationIf';
// import getProposalApplicationPECFAR from '@salesforce/apex/ReviwerPortalController.getProposalApplicationPECFAR';
// import getProposalApplicationWISER from '@salesforce/apex/ReviwerPortalController.getProposalApplicationWISER';
// import getProposalApplicationWorkshop from '@salesforce/apex/ReviwerPortalController.getProposalApplicationWorkshop';
// import getApplicationBasedOnType from '@salesforce/apex/ReviwerPortalController.getApplicationBasedOnType';
// import getAllocatedpending from '@salesforce/apex/ReviwerPortalController.getAllocatedpending';
// import getAllocatedCompleted from '@salesforce/apex/ReviwerPortalController.getAllocatedCompleted';
// import getAllocatedCompletedtpt from '@salesforce/apex/ReviwerPortalController.getProposalApplicationtpt';
// export default class ReviewerPortal extends LightningElement {
//    @api recName
//     @track tptList =[];
//     submittedApplications=0
//     totalAllocated1=0
//     totalAllocated=0
//     totalApplications=0
//     draftApplications=0
//     totalPendApps=0;
//     totalcompApps = 0;
//     singList=[];
//     pecfarList =[];
//     ifList =[];
//     wiserList= [];
//     workShopList = [];
//     numberSing =0
//     numberTpT = 0;
//     numberPECFAR=0;
//     numberIF=0;
//     numberWISER =0;
//     numberWorkshop =0;
//     submittedApplications1=0
//     allocatedSubmittedApplications=0
//     connectedCallback(){
//       this.getProposalApplicationList;
//       this.getProposalApplicationworkshopList
//       this.getProposalApplicationqwiserList
//       this.getProposalApplicationpecfarList
//       this.getProposalApplicationifList
//       this.getProposalApplicationsingList
  
//     }
//     handleClick2p2(event){
//       console.log('tyuio'+ event.currentTarget.dataset.name);
//        this.recName = event.currentTarget.dataset.name;
//        let draftCount=0;
//        let submittedCount = 0;
//        let subcount=0;
//        let AllocationsubmittedCount=0;
//        getApplicationBasedOnType({RecordTypeName: this.recName}).then(result=> {
//               console.log('result-->',JSON.stringify(result));
//              this.totalApplications = result.length;
//              result.forEach(element => {
//               if(element.Proposal_Stages__c === 'Draft'){
//               draftCount++;
//               }
//               else if(element.Proposal_Stages__c === 'Submitted' ){
//                 submittedCount++;
//                }
//               else if(element.Proposal_Stages__c === 'Under Review' && element.Submitted__c === true){
//                AllocationsubmittedCount++;
//               }
//               else if(element.Proposal_Stages__c === 'Submitted' || element.Proposal_Stages__c === 'Under Review'){
//                 subcount++
//               }
//              });
//              this.draftApplications =draftCount;
//              this.submittedApplications= submittedCount;
//             this.allocatedSubmittedApplications =AllocationsubmittedCount;
//              // this.submittedApplications1= subcount;
//         })
//        .catch(error => {
//               console.log('error-->',error);
//         });

//         getAllocatedpending({RecordTypeName: this.recName}).then(result=>{
//          this.totalPendApps= result.length;
//          this.submittedApplications1= result.length;
//         });

//         getAllocatedCompleted({RecordTypeName: this.recName}).then(result=>{
//           this.totalcompApps= result;
//          });
//          this.totalAllocated1= this.totalPendApps+ this.totalcompApps
//     }
//     handleClickPECFAR(event){
//       console.log('tyuio'+ event.currentTarget.dataset.name);
//       this.recName = event.currentTarget.dataset.name;
//       let draftCount=0;
//       let submittedCount = 0;
//       let subcount=0;
//       let AllocationsubmittedCount=0;
//       getApplicationBasedOnType({RecordTypeName: this.recName}).then(result=> {
//              console.log('result-->',JSON.stringify(result));
//             this.totalApplications = result.length;
//             result.forEach(element => {
//              if(element.Proposal_Stages__c === 'Draft'){
//              draftCount++;
//              }
//              else if(element.Proposal_Stages__c === 'Submitted' ){
//                submittedCount++;
//               }
//              else if(element.Proposal_Stages__c === 'Under Review' && element.Submitted__c === true){
//               AllocationsubmittedCount++;
//              }
//              else if(element.Proposal_Stages__c === 'Submitted' || element.Proposal_Stages__c === 'Under Review'){
//                subcount++
//              }
//             });
//             this.draftApplications =draftCount;
//             this.submittedApplications= submittedCount;
//            this.allocatedSubmittedApplications =AllocationsubmittedCount;
//             // this.submittedApplications1= subcount;
          
//         })
//       .catch(error => {
//              console.log('error-->',error);
//        });
//        getAllocatedpending({RecordTypeName: this.recName}).then(result=>{
//         this.totalPendApps= result.length;
//         this.submittedApplications1= result.length;
//        });
//        getAllocatedCompleted({RecordTypeName: this.recName}).then(result=>{
//         this.totalcompApps= result;
//        });
//        this.totalAllocated1= this.totalPendApps+ this.totalcompApps
//     }
//     handleClickSING(event){
//       console.log('tyuio'+ event.currentTarget.dataset.name);
//       this.recName = event.currentTarget.dataset.name;
//       let draftCount=0;
//       let submittedCount = 0;
//       let subcount=0;
//       let AllocationsubmittedCount=0;
//       getApplicationBasedOnType({RecordTypeName: this.recName}).then(result=> {
//              console.log('result-->',JSON.stringify(result));
//             this.totalApplications = result.length;
//             result.forEach(element => {
//              if(element.Proposal_Stages__c === 'Draft'){
//              draftCount++;
//              }
//              else if(element.Proposal_Stages__c === 'Submitted' ){
//                submittedCount++;
//               }
//              else if(element.Proposal_Stages__c === 'Under Review' && element.Submitted__c === true){
//               AllocationsubmittedCount++;
//              }
//              else if(element.Proposal_Stages__c === 'Submitted' || element.Proposal_Stages__c === 'Under Review'){
//                subcount++
//              }
//             });
//             this.draftApplications =draftCount;
//             this.submittedApplications= submittedCount;
//            this.allocatedSubmittedApplications =AllocationsubmittedCount;
//             // this.submittedApplications1= subcount;
//         })
//       .catch(error => {
//              console.log('error-->',error);
//        });
//        getAllocatedpending({RecordTypeName: this.recName}).then(result=>{
//         this.totalPendApps= result.length;
//         this.submittedApplications1= result.length;
//        });
//        getAllocatedCompleted({RecordTypeName: this.recName}).then(result=>{
//         this.totalcompApps= result;
//        });
//        this.totalAllocated1= this.totalPendApps+ this.totalcompApps

//     }
//     handleClickIF(event){
//       console.log('tyuio'+ event.currentTarget.dataset.name);
//       this.recName = event.currentTarget.dataset.name;
//       let draftCount=0;
//       let submittedCount = 0;
//       let subcount=0;
//       let AllocationsubmittedCount=0;
//        getApplicationBasedOnType({RecordTypeName: this.recName}).then(result=> {
//               console.log('result-->',JSON.stringify(result));
//              this.totalApplications = result.length;
//              result.forEach(element => {
//               if(element.Proposal_Stages__c === 'Draft'){
//               draftCount++;
//               }
//               else if(element.Proposal_Stages__c === 'Submitted' ){
//                 submittedCount++;
//                }
//               else if(element.Proposal_Stages__c === 'Under Review' && element.Submitted__c === true){
//                AllocationsubmittedCount++;
//               }
//               else if(element.Proposal_Stages__c === 'Submitted' || element.Proposal_Stages__c === 'Under Review'){
//                 subcount++
//               }
//              });
//              this.draftApplications =draftCount;
//              this.submittedApplications= submittedCount;
//             this.allocatedSubmittedApplications =AllocationsubmittedCount;
//              // this.submittedApplications1= subcount;
//         })
//       .catch(error => {
//              console.log('error-->',error);
//        });
//        getAllocatedpending({RecordTypeName: this.recName}).then(result=>{
//         this.totalPendApps= result.length;
//         this.submittedApplications1= result.length;
//        });
//        getAllocatedCompleted({RecordTypeName: this.recName}).then(result=>{
//         this.totalcompApps= result;
//        });
//        this.totalAllocated1= this.totalPendApps+ this.totalcompApps
//     }
//     handleClickWiser(event){
//       console.log('tyuio'+ event.currentTarget.dataset.name);
//       this.recName = event.currentTarget.dataset.name;
//       let draftCount=0;
//       let submittedCount = 0;
//       let subcount=0;
//       let AllocationsubmittedCount=0;
//       getApplicationBasedOnType({RecordTypeName: this.recName}).then(result=> {
//              console.log('result-->',JSON.stringify(result));
//             this.totalApplications = result.length;
//             result.forEach(element => {
//              if(element.Proposal_Stages__c === 'Draft'){
//              draftCount++;
//              }
//              else if(element.Proposal_Stages__c === 'Submitted' ){
//                submittedCount++;
//               }
//              else if(element.Proposal_Stages__c === 'Under Review' && element.Submitted__c === true){
//               AllocationsubmittedCount++;
//              }
//              else if(element.Proposal_Stages__c === 'Submitted' || element.Proposal_Stages__c === 'Under Review'){
//                subcount++
//              }
//             });
//             this.draftApplications =draftCount;
//             this.submittedApplications= submittedCount;
//            this.allocatedSubmittedApplications =AllocationsubmittedCount;
//             // this.submittedApplications1= subcount;
//         })
//       .catch(error => {
//              console.log('error-->',error);
//        });
//        getAllocatedpending({RecordTypeName: this.recName}).then(result=>{
//         this.totalPendApps= result.length;
//         this.submittedApplications1= result.length;
//        });
//        getAllocatedCompleted({RecordTypeName: this.recName}).then(result=>{
//         this.totalcompApps= result;
//        });
//        this.totalAllocated1= this.totalPendApps+ this.totalcompApps
//     }
//     handleClickWorkShp(event){
//       console.log('tyuio'+ event.currentTarget.dataset.name);
//       this.recName = event.currentTarget.dataset.name;
//       let draftCount=0;
//       let submittedCount = 0;
//       let subcount=0;
//       let AllocationsubmittedCount=0;
//       getApplicationBasedOnType({RecordTypeName: this.recName}).then(result=> {
//              console.log('result-->',JSON.stringify(result));
//             this.totalApplications = result.length;
//             result.forEach(element => {
//              if(element.Proposal_Stages__c === 'Draft'){
//              draftCount++;
//              }
//              else if(element.Proposal_Stages__c === 'Submitted' ){
//                submittedCount++;
//               }
//              else if(element.Proposal_Stages__c === 'Under Review' && element.Submitted__c === true){
//               AllocationsubmittedCount++;
//              }
//              else if(element.Proposal_Stages__c === 'Submitted' || element.Proposal_Stages__c === 'Under Review'){
//                subcount++
//              }
//             });
//             this.draftApplications =draftCount;
//             this.submittedApplications= submittedCount;
//            this.allocatedSubmittedApplications =AllocationsubmittedCount;
//             // this.submittedApplications1= subcount;
//        })
//       .catch(error => {
//              console.log('error-->',error);
//        });
//        getAllocatedpending({RecordTypeName: this.recName}).then(result=>{
//         this.totalPendApps= result.length;
//         this.submittedApplications1= result.length;
//        });
//        getAllocatedCompleted({RecordTypeName: this.recName}).then(result=>{
//         this.totalcompApps= result;
//        });
     
//     }
    

//     @wire(getAllocatedCompletedtpt)
//     getProposalApplicationList({data}){
//        if(data){
//             console.log('lead data#'+JSON.stringify(data));
//             this.numberTpT = data.length 
  
//     };
//   }
//     @wire(getProposalApplicationSing)
//     getProposalApplicationsingList({data}){
//        if(data){
//             console.log('lead data#'+JSON.stringify(data));
//             this.numberSing = data.length 
  
//     };
//   }
//     @wire(getProposalApplicationIf)
//     getProposalApplicationifList({data}){
//        if(data){
//             console.log('lead data#'+JSON.stringify(data));
//             this.numberIF = data.length 
  
//     };
//   }
//     @wire(getProposalApplicationPECFAR)
//     getProposalApplicationpecfarList({data}){
//        if(data){
//             console.log('lead data#'+JSON.stringify(data));
//             this.numberPECFAR  = data.length 
  
//     };
//   }
//     @wire(getProposalApplicationWISER)
//     getProposalApplicationqwiserList({data}){
//        if(data){
//             console.log('lead data#'+JSON.stringify(data));
//             this.numberWISER = data.length 
  
//     };
//   }
//     @wire(getProposalApplicationWorkshop)
//     getProposalApplicationworkshopList({data}){
//        if(data){
//             console.log('lead data#'+JSON.stringify(data));
//             this.numberWorkshop = data.length 
  
//     };

//     }
//   }