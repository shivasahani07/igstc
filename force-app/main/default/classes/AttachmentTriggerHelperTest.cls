@isTest
public class AttachmentTriggerHelperTest {
    static testMethod void testMethod1(){
        Account acc = new Account();
        acc.Name =  'Shiva';
        Insert acc; 
         
        list<Attachment> attachlilst = new list<Attachment>();
         Attachment attach=new Attachment();       
         attach.Name='Unit Test Attachment';
         Blob bodyBlob = Blob.valueOf('Unit Test Attachment Body');
          attach.body = bodyBlob;
          attach.parentId = acc.id;
        attachlilst.add(attach);
        insert attachlilst;
        
    } 

}