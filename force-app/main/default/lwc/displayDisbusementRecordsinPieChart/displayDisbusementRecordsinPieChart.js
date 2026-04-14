import { LightningElement,wire,track,api} from 'lwc';
//importing the Chart library from Static resources
import chartjs from '@salesforce/resourceUrl/ChartJs'; 
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//importing the apex method.
import getAllAccountsByRating from '@salesforce/apex/displayDisbursementRecordsinPieChart.getAllAccountsByRating';
export default class DisplayDisbusementRecordsinPieChart extends LightningElement {
    @api recordId;

@wire (getAllAccountsByRating,{ proposalId: '$recordId'}) 
accounts({error,data})
{
   if(data)
   {
      console.log('11111111111=====>1=>',data);
      for(var key in data)
       {
          this.updateChart(data[key].count,data[key].label);
       }
      this.error=undefined;
   }
  else if(error)
  {
    console.log('11111111111=====>2=>',error);
     this.error = error;
     this.accounts = undefined;
  }
}
chart;
chartjsInitialized = false;
config={
type : 'doughnut',
data :{
datasets :[
{
data: [
],
backgroundColor :[
    'rgb(247, 124, 0)',
    'rgb(2, 150, 19)',
    'rgb(237, 14, 14)',
    'rgb(75,192,192)',
],
   label:'Dataset 1'
}
],
labels:[]
},
options: {
    responsive : true,
legend : {
    position :'right'
},
animation:{
   animateScale: true,
   animateRotate : true
}
}
};
renderedCallback()
{
   if(this.chartjsInitialized)
  {
   return;
  }
  this.chartjsInitialized = true;
  Promise.all([
   loadScript(this,chartjs)
  ]).then(() =>{
    const ctx = this.template.querySelector('canvas.donut')
    .getContext('2d');
    this.chart = new window.Chart(ctx, this.config);
  })
  .catch(error =>{
    this.dispatchEvent(
    new ShowToastEvent({
    title : 'Error loading ChartJS',
    message : error.message,
    variant : 'error',
   }),
  );
});
}
updateChart(count,label)
{

   this.chart.data.labels.push(label);
   this.chart.data.datasets.forEach((dataset) => {
   dataset.data.push(count);
   });
   this.chart.update();
 }
}