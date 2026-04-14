import { api, LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getExpenseHeads from '@salesforce/apex/WORKSHOPBudgetDetailsController.getAllExpenseHeadLineitems';
import saveDetails from '@salesforce/apex/WORKSHOPBudgetDetailsController.saveExpenseHeadDetails';
import { CloseActionScreenEvent } from 'lightning/actions';

export default class WORKSHOPBudgetDetails extends LightningElement {
    @api recordId;
    @track listOfHeads = [];

    @wire(getExpenseHeads,{proposalId:'$recordId'})
    wiredResponse(result){
        if(result.data){
            console.log('Expense Heads Data-------',result.data);
          
            this.listOfHeads = result.data;
            
            var itemList = [];
            for(var i=0;i<this.listOfHeads.length;i++){
                var item = Object.assign({},this.listOfHeads[i]);

                item.index = i;
                itemList.push(item);
            }
            
            console.log(itemList);
            this.listOfHeads = itemList;
            
        }else{
            console.log("Error to fetch data of Accounts",result);
        }
    }

    handleChange(event) {
        debugger;
        var name = event.target.name;
        var index = event.target.dataset.index;
        console.log('listOfHeads::'+this.listOfHeads);
        if(name == 'approvedhead'){
            this.listOfHeads[index].Approved_Head__c = event.target.value;
        }
        if(name == 'approved'){
            this.listOfHeads[index].Approved_Amount__c = event.target.value;
        }
        if(name == 'comment'){
            this.listOfHeads[index].Approved_Comment__c = event.target.value;
        }
        if(name == 'release'){
            this.listOfHeads[index].Advance_Release__c = event.target.value;
        }
        if(name == 'settlement'){
            this.listOfHeads[index].Final_Settlement__c = event.target.value;
        }
    }

    saveRecords(){
        debugger;
        var temparray = this.listOfHeads;
        var listToBeUpdated= [];

        for(var i in temparray){
            listToBeUpdated.push({
                Id:temparray[i].Id,
                Approved_Head__c:temparray[i].Approved_Head__c,
                Approved_Amount__c:temparray[i].Approved_Amount__c,
                Approved_Comment__c:temparray[i].Approved_Comment__c,
                Advance_Release__c:parseInt(temparray[i].Advance_Release__c),
                Final_Settlement__c:parseInt(temparray[i].Final_Settlement__c),
            });
        }
        saveDetails({ listOfHeads: listToBeUpdated })
        .then(result => {
            console.log('Result:', result);
            this.showNotification('Success','Budget Details have been saved successfully..','success');
            this.closeAction();
        })
        .catch(error => {
            console.error('Error:', error);
            this.showNotification('Error',error.body.message,'error');
        });
    }

    showNotification(title,message,variant){
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }

    closeAction(){
        this.dispatchEvent(new CloseActionScreenEvent());
    }
}