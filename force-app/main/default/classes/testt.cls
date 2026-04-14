public with sharing class testt {

        public string state {get; set;}
        public string city { get; set; }
        public List<Account> listc {get;set;}
        public testt () 
        {
            state = city  = null;
            listc = new List<Account>();
        }

        public List<SelectOption> getListStates() 
        {
            List<SelectOption> options = new List<SelectOption> { new SelectOption('','-- Choose --') };
                system.debug('options--'+options);
            for(Schema.PicklistEntry pe: Account.Indian_States__c.getDescribe().getPicklistValues()) 
            {
                options.add(new SelectOption(pe.getValue(),pe.getLabel()));
            }
            return options;
        }

        public void getCity()
        {
            listc.clear();
            listc = [select id,Indian_Cities__c,Indian_States__c  from Account where Indian_States__c = :state] ; 
        }  
}