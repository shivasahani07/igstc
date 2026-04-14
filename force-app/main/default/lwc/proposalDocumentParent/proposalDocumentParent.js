import { LightningElement,api,wire,track} from 'lwc';
import getFoldersAndFiles from '@salesforce/apex/ProposalDocumentLWCController.getFoldersAndFiles';
import getSubFoldersAndFiles from '@salesforce/apex/ProposalDocumentLWCController.getSubFoldersAndFiles';
import createFolderSP from '@salesforce/apex/ProposalDocumentLWCController.createFolder';
import deleteFolderInsideSite from '@salesforce/apex/ProposalDocumentLWCController.deleteFolderInsideSite';
import deleteFileSP from '@salesforce/apex/ProposalDocumentLWCController.deleteFileSP';
import createFile from '@salesforce/apex/ProposalDocumentLWCController.createFile';
import downloadFile from '@salesforce/apex/ProposalDocumentLWCController.downloadFile';
import { refreshApex } from '@salesforce/apex';


import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class ProposalDocumentParent extends LightningElement {
    @api recordId;
    @track isLoaded = false;
    @track response;
    @track folders = [];
    @track files = [];
    @track showFolderCreation = false;
    @track showFileCreation = false;
    @track disableFolderDeletion = true;
    @track url = 'https://utillabs.sharepoint.com/sites/IGSTC/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FIGSTC%2FShared%20Documents%2FProposals%2FIGSTC-00211%2F1st%20Year%2F2%2B2_Call_Template_-_a081y0000029hfO.pdf&parent=%2Fsites%2FIGSTC%2FShared%20Documents%2FProposals%2FIGSTC-00211%2F1st%20Year';
   

    @wire(getFoldersAndFiles,{recId:'$recordId'})
    wiredResponse(result){
        if(result.data){
            this.response = result;
            let data = result.data;

            let tempFolder = [];
            this.isLoaded = true;
            this.response = data;
            console.log('Data-------',data);
            if(data.folders){
                tempFolder = [...data.folders];
                tempFolder.sort((a,b)=>a.Name.localeCompare(b.Name));
            }
            if(data.files){
                this.files = [...data.files];
                this.files.sort((a,b)=>a.Name.localeCompare(b.Name));
            }
            tempFolder.forEach(item=>{
                let obj = {...item};
                obj.expanded = false;
                this.folders.push(obj);
            })
        }
    }

    selectedParent;
    parentClicked(event){
        debugger;
        this.selectedParent = null;
        this.selectedSubFolder = null;
        this.disableFolderDeletion = true;
        this.disableFileClicked = true;
        this.selectedFile = null;

        let folderId = event.currentTarget.dataset.id;
        let clickedIndex = this.folders.findIndex(item=>item.UniqueId==folderId);

        let foldersList = [];
        this.folders.forEach(item=>{
            let obj = {...item};
            if(obj.UniqueId!=folderId){
                obj.expanded = false;
            }
            foldersList.push(obj);
        })

        this.folders = foldersList;
        this.folders[clickedIndex].expanded = !this.folders[clickedIndex].expanded;

        console.log('ProposalCliecked',this.folders[clickedIndex]);

        let selectedFolder = this.folders[clickedIndex];

        let subFilesUrl = selectedFolder.Files.__deferred.uri.split('https://utillabs.sharepoint.com/')[1];
        let subFoldersUrl = selectedFolder.Folders.__deferred.uri.split('https://utillabs.sharepoint.com/')[1];

        if(selectedFolder.expanded){
            getSubFoldersAndFiles({filesUrl:subFilesUrl,foldersUrl:subFoldersUrl}).then(result=>{
                if(result.folders){
                    let subFolderList = [];
                    result.folders.forEach(item=>{
                        let obj = {...item};
                        obj.expanded = false;
                        subFolderList.push(obj);
                    })
                    selectedFolder.subFolders = subFolderList;
                }
                if(result.files){
                    let subFiles = [];
                    result.files.forEach(item=>{
                        let obj = {...item};
                        obj.clicked = false;
                        subFiles.push(obj);
                    })
                    selectedFolder.subFiles = subFiles.sort((a,b)=>a.Name.localeCompare(b.Name));
                }

                this.folders[clickedIndex] = selectedFolder;
                this.selectedParent = selectedFolder;
            })
        }
    }


    @track selectedSubFolder;
    subFolderClicked1(event){
        debugger;

        this.selectedSubFolder = null;
        this.disableFileClicked = true;
        this.selectedFile = null;

        let subFolderId = event.currentTarget.dataset.id;
        
        let parentClickedIndex = this.folders.findIndex(item=>item.UniqueId==this.selectedParent.UniqueId);
        if(this.folders[parentClickedIndex].subFolders){
            let subFolderIndex = this.folders[parentClickedIndex].subFolders.findIndex(item=>item.UniqueId==subFolderId);

            this.folders[parentClickedIndex].subFolders[subFolderIndex].expanded = !this.folders[parentClickedIndex].subFolders[subFolderIndex].expanded;


            if(this.folders[parentClickedIndex].subFolders[subFolderIndex].expanded){
                let subFolder = this.folders[parentClickedIndex].subFolders[subFolderIndex];

                let subFilesUrl = subFolder.Files.__deferred.uri.split('https://utillabs.sharepoint.com/')[1];
                let subFoldersUrl = subFolder.Folders.__deferred.uri.split('https://utillabs.sharepoint.com/')[1];

                getSubFoldersAndFiles({filesUrl:subFilesUrl,foldersUrl:subFoldersUrl}).then(result=>{
                    if(result.folders){
                        let subFolderList = [];
                        result.folders.forEach(item=>{
                            let obj = {...item};
                            obj.expanded = false;
                            subFolderList.push(obj);
                        })
                        subFolder.subFolders = subFolderList;
                    }
                    if(result.files){
                        let subFiles = [];
                        result.files.forEach(item=>{
                            let obj = {...item};
                            obj.clicked = false;
                            subFiles.push(obj);
                        })
                        subFolder.subFiles = subFiles.sort((a,b)=>a.Name.localeCompare(b.Name));
                    }
                    console.log('SubFolderResult----',subFolder);
                    this.folders[parentClickedIndex].subFolders[subFolderIndex] = subFolder;
                    this.selectedSubFolder = subFolder;
                    this.disableFolderDeletion = false;
                })
            }else{
                this.disableFolderDeletion = true;
            }
        }
    }


    @track fileSelected;
    folderClicked(event){
        let subFileId = event.currentTarget.dataset.id;

        let parentClickedIndex = this.folders.findIndex(item=>item.UniqueId==this.selectedParent.UniqueId);
        if(this.folders[parentClickedIndex].subFiles){
            let subFilesIndex = this.folders[parentClickedIndex].subFiles.findIndex(item=>item.UniqueId==subFileId);

            console.log('FilesSelected------',this.folders[parentClickedIndex].subFiles[subFilesIndex]);
        }
    }

    showFolderCreationPopup(){
        this.showFolderCreation = true;
    }

    closeFolderCreation(){
        this.showFolderCreation = false;
    }

    showFileCreationPopup(){
        this.newFile = null;
        this.showFileCreation = true;        
    }

    @track newFile;
    @track disableFileCreation = true;
    fileSelectedHandler(event){
        let file = event.target.files[0];
        let temp = this;

        this.newFile = file;
        this.disableFileCreation = false;
    }

    createFileSP(){
        // note that "this" is the FileReader
        debugger;
        let file = this.newFile;
        let reader = new FileReader();
        let temp = this;
        console.log('SelectedParent----',temp.selectedParent);

        reader.onload = function() {
           

            debugger;

            let base64 = this.result.split(/,/)[1];
            let fileName = file.name.replaceAll(' ','_');
            let path;
            
            console.log('SelectedParent----',temp.selectedParent);

            if(temp.selectedSubFolder){
                path = temp.selectedSubFolder.ServerRelativeUrl.replaceAll(' ','%20');
            }else{
                path = temp.selectedParent.ServerRelativeUrl.replaceAll(' ','%20');
            }

            console.log('FileName---',fileName);
            console.log('ContentType---',path);

            createFile({base64,fileName,path}).then(res=>{
                console.log('Result------',res);
                debugger;

                if(!res){
                    temp.showNotification('Failed','File size is too big!','error');
                }else{
                    let parentIndex = temp.folders.findIndex(item=>item.UniqueId==temp.selectedParent.UniqueId);
                    if(temp.selectedSubFolder){
                        let childIndex = temp.folders[parentIndex].subFolders.findIndex(item=>item.UniqueId==temp.selectedSubFolder.UniqueId);
                        if(temp.folders[parentIndex].subFolders[childIndex].subFiles){
                            temp.folders[parentIndex].subFolders[childIndex].subFiles.push(res);
                        }else{
                            temp.folders[parentIndex].subFolders[childIndex].subFiles = [...res];
                        }
                    }else{
                        if(temp.folders[parentIndex].subFiles){
                            temp.folders[parentIndex].subFiles.push(res);
                        }else{
                            temp.folders[parentIndex].subFiles = [...res];
                        }
                    }
                    temp.showFileCreation = false;
                    temp.showNotification('Success',`${temp.newFile.name} is uploaded Succesfully`,'success');
                    temp.newFile = null;
                }
            }).catch(error=>{
                temp.showNotification('Error',error,'error');
                console.log('Error to create the file----',error);
            }) 
        }

        reader.readAsDataURL(file)
    }


    closeFileCreation(){
        this.showFileCreation = false;  
    }


    @track disableCreate = true;
    @track folderName = '';
    inputHandler(event){
        this.folderName = event.target.value;
        if(!this.folderName || this.folderName.length==0){
            this.disableCreate = true;
        }else{
            this.disableCreate = false;
        }
    }

    createFolder(){
        let path = this.selectedSubFolder?this.selectedSubFolder.ServerRelativeUrl:this.selectedParent.ServerRelativeUrl;
        createFolderSP({path:`${path+'/'+this.folderName}`}).then(result=>{
            let parentIndex = this.folders.findIndex(item=>item.UniqueId==this.selectedParent.UniqueId);
            if(this.selectedSubFolder){
                let childIndex = this.folders[parentIndex].subFolders.findIndex(item=>item.UniqueId==this.selectedSubFolder.UniqueId);
                if(this.folders[parentIndex].subFolders[childIndex].subFolders){
                    this.folders[parentIndex].subFolders[childIndex].subFolders.push(result);
                }else{
                    this.folders[parentIndex].subFolders[childIndex].subFolders = [...result];
                }
            }else{
                if(this.folders[parentIndex].subFolders){
                    this.folders[parentIndex].subFolders.push(result);
                }else{
                    this.folders[parentIndex].subFolders = [...result];
                }
            }
            this.showFolderCreation = false;
            this.showNotification('Succesfully',`${this.folderName} folder is created.`,'success');
            this.folderName = '';
        }).catch(error=>{
            this.showFolderCreation = false;
            console.log('Error----',error);
        })   
    }

    @track selectedFile;
    @track disableFileClicked = true;

    fileClickedHandler(event){
        let subFileId = event.currentTarget.dataset.id;
        let parentIndex = this.folders.findIndex(item=>item.UniqueId==this.selectedParent.UniqueId);

        let subFileIndex = this.folders[parentIndex].subFiles.findIndex(item=>item.UniqueId==subFileId);
        let filesList = [];

        this.folders[parentIndex].subFiles.forEach(item=>{
            let obj = {...item};
            obj.clicked = item.UniqueId==subFileId;
            filesList.push(obj);
        });

        if(this.folders[parentIndex].subFolders && this.selectedSubFolder){
            let subFolderIndex = this.folders[parentIndex].subFolders.findIndex(item=>item.UniqueId==this.selectedSubFolder.UniqueId);
            let subFilesList = [];

            if(this.folders[parentIndex].subFolders[subFolderIndex].subFiles){
                this.folders[parentIndex].subFolders[subFolderIndex].subFiles.forEach(item=>{
                    let obj = {...item};
                    obj.clicked = false;
                    subFilesList.push(obj);
                })
            }
            this.folders[parentIndex].subFolders[subFolderIndex].subFiles = subFilesList;
        }

        this.disableFileClicked = false;
        this.folders[parentIndex].subFiles = filesList;
        this.selectedFile = this.folders[parentIndex].subFiles[subFileIndex];
        let path = this.selectedFile.LinkingUri;

        if(path && path.length>0){
            window.open(path,'_blank');
        }else{
            console.log('SubFiles',this.selectedFile);
            let filename = '/'+this.selectedFile.Name;
            let id = encodeURIComponent(this.selectedFile.ServerRelativeUrl);
            let parent = encodeURIComponent(this.selectedFile.ServerRelativeUrl.replace(filename,''));
            let path = 'https://utillabs.sharepoint.com/sites/IGSTC/Shared%20Documents/Forms/AllItems.aspx?id='+id+'&parent='+parent;
            window.open(path,'_blank');
        }
    }

    subFileClickedHandler(event){
        debugger;
        let subFileId = event.currentTarget.dataset.id;
        let parentIndex = this.folders.findIndex(item=>item.UniqueId==this.selectedParent.UniqueId);
        let subFolderIndex = this.folders[parentIndex].subFolders.findIndex(item=>item.UniqueId==this.selectedSubFolder.UniqueId);

        let filesList = [];

        this.folders[parentIndex].subFiles.forEach(item=>{
            let obj = {...item};
            obj.clicked = false;
            filesList.push(obj);
        });
        this.folders[parentIndex].subFiles = filesList;

        let subFileIndex = this.folders[parentIndex].subFolders[subFolderIndex].subFiles.findIndex(item=>item.UniqueId==subFileId);

        let subFilesList = [];

        this.folders[parentIndex].subFolders[subFolderIndex].subFiles.forEach(item=>{
            let obj = {...item};
            obj.clicked = item.UniqueId==subFileId;
            subFilesList.push(obj);
        });

        this.folders[parentIndex].subFolders[subFolderIndex].subFiles = subFilesList;
        this.disableFileClicked = false;
      
        this.selectedFile = this.folders[parentIndex].subFolders[subFolderIndex].subFiles[subFileIndex];
        
        console.log('SubFiles----',this.selectedFile);
        //let path = this.folders[parentIndex].subFiles
    }

    deleteFileSPHandler(){
        if(this.selectedFile){
            let path = this.selectedFile.ServerRelativeUrl;
            console.log('Path---',path);
            deleteFileSP({path}).then(result=>{
                if(result=='Success'){
                    this.showNotification('Success',`${this.selectedFile.Name} deleted succesfully.`,'success');
                    if(this.selectedParent){
                        let parentFolderIndex = this.folders.findIndex(item=>item.UniqueId==this.selectedParent.UniqueId);
                        if(this.folders[parentFolderIndex].subFiles){
                            this.folders[parentFolderIndex].subFiles = this.folders[parentFolderIndex].subFiles.filter(item=>item.UniqueId!=this.selectedFile.UniqueId);
                        }
                        if(this.folders[parentFolderIndex].subFolders){
                            let subFolders = [];
                            this.folders[parentFolderIndex].subFolders.forEach(item=>{
                                let obj = {...item};
                                if(obj.subFiles){
                                    obj.subFiles = obj.subFiles.filter(subItem=>subItem.UniqueId!=this.selectedFile.UniqueId);
                                }
                                subFolders.push(obj);
                            })
                            this.folders[parentFolderIndex].subFolders = subFolders;
                        }
                    }
                }else{
                    this.showNotification('Failed','Failed to delete this file','warning');
                }
                console.log('Response----',result);
            }).catch(error=>{
                console.log('Error---',error);
                this.showNotification('Failed',error,'error');
            })
        }else{
            this.showNotification('Failed','Please select a file.','warning');
        }
    }
    
    deleteFolder(){
        let parentIndex = this.folders.findIndex(item=>item.UniqueId==this.selectedParent.UniqueId);
        if(this.selectedSubFolder){
            let childIndex = this.folders[parentIndex].subFolders.findIndex(item=>item.UniqueId==this.selectedSubFolder.UniqueId);
            deleteFolderInsideSite({path:this.selectedSubFolder.ServerRelativeUrl}).then(result=>{
                if(result=='Success'){
                    this.showNotification('Success',`${this.selectedSubFolder.Name} folder deleted succesfully`,'success');
                    debugger;
                    this.folders[parentIndex].subFolders = this.folders[parentIndex].subFolders.filter(item=>item.UniqueId!=this.selectedSubFolder.UniqueId);
                }
            }).catch(error=>{
                console.log('Error to delete subfolder')
            })
        }
    }

    showNotification(title,message,variant){
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

}