import { LightningElement, track,wire,api } from 'lwc';
//import { refreshApex } from '@salesforce/apex';
import getFoldersAndFiles from '@salesforce/apex/filesAndDocsViewerLWCcontroller.getFoldersAndFiles';
import getFoldersAndFilesAgain from  '@salesforce/apex/filesAndDocsViewerLWCcontroller.getFoldersAndFilesAgain';
import getSubFoldersAndFiles from '@salesforce/apex/filesAndDocsViewerLWCcontroller.getSubFoldersAndFiles';
import createFolderSP from '@salesforce/apex/filesAndDocsViewerLWCcontroller.createFolder';
import deleteFolderInsideSite from '@salesforce/apex/filesAndDocsViewerLWCcontroller.deleteFolderInsideSite';
import deleteFileSP from '@salesforce/apex/filesAndDocsViewerLWCcontroller.deleteFileSP';
import createFile from '@salesforce/apex/filesAndDocsViewerLWCcontroller.createFile';
import downloadFile from '@salesforce/apex/filesAndDocsViewerLWCcontroller.downloadFile';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FilesDocsViewer extends LightningElement {
    
@api recordId;
@track isLoaded = false;
@track response;
@track folders = []
@track fileData;
@track parentId;
@track isFileUpLoading;
@track isFolderCreating;
@track lastfolderSelected

@track selectedFolder;
@track selectedFile;
@track isHomeActive;
@track files = [];
@track path = [{name:"Home",folders:[]}]
@track showFolderCreation = false;
@track showFileCreation = false;
@track disableFolderDeletion = true;
//@track url = 'https://utillabs.sharepoint.com/sites/IGSTC/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FIGSTC%2FShared%20Documents%2FProposals%2FPECFAR%2FIGSTC%2D02205%2FApplication%20Document%2FAttachments%2FPECFAR%5Fdocument%5Ftree%5F%281%29%2Epdf&viewid=3011baaa%2D2e8b%2D44f4%2Dacec%2D9f92c56dec28&parent=%2Fsites%2FIGSTC%2FShared%20Documents%2FProposals%2FPECFAR%2FIGSTC%2D02205%2FApplication%20Document%2FAttachments';
@track url = 'https://utillabs.sharepoint.com/sites/IGSTC/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FIGSTC%2FShared%20Documents%2FProposals%2FPECFAR%2FIGSTC%2D02205%2FApplication%20Document%2FAttachments%2FPECFAR%5Fdocument%5Ftree%5F%281%29%2Epdf&viewid=3011baaa%2D2e8b%2D44f4%2Dacec%2D9f92c56dec28&parent=%2Fsites%2FIGSTC%2FShared%20Documents%2FProposals%2FPECFAR%2FIGSTC%2D02205%2FApplication%20Document%2FAttachments';


@wire(getFoldersAndFiles,{recId:'$recordId'})
    wiredResponse(result){
        debugger;
        if(result.data){
            debugger;
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
                console.log(this.folders);
            })
        }else{
            this.isLoaded = true;
        }
    }
 
    viewAllFolders() {
    debugger;
    this.isLoaded = false;
    this.folders = [];
    getFoldersAndFilesAgain({ recId:this.recordId})
        .then((data) => {
            this.response = data;
            let tempFolder = [];
            this.isLoaded = true;
        
            if (data.folders) {
                tempFolder = [...data.folders];
                tempFolder.sort((a, b) => a.Name.localeCompare(b.Name));
            }
            if (data.files) {
                this.files = [...data.files];
                this.files.sort((a, b) => a.Name.localeCompare(b.Name));
            }
            tempFolder.forEach(item => {
                let obj = { ...item };
                obj.expanded = true;
                this.folders.push(obj);
            });
        })
        .catch((error) => {
            this.error = error;
            this.data = undefined;
        });
    }

    hideAllFolders() {
        debugger;
    }

    refreshFoldersAndFiles() {
    debugger;
    this.isLoaded = false;
    this.folders = [];
    getFoldersAndFilesAgain({ recId:this.recordId })
        .then((data) => {
            this.response = data;
            let tempFolder = [];
            this.isLoaded = true;
        
            if (data.folders) {
                tempFolder = [...data.folders];
                tempFolder.sort((a, b) => a.Name.localeCompare(b.Name));
            }
            if (data.files) {
                this.files = [...data.files];
                this.files.sort((a, b) => a.Name.localeCompare(b.Name));
            }
            tempFolder.forEach(item => {
                let obj = { ...item };
                obj.expanded = false;
                this.folders.push(obj);
            });
        })
        .catch((error) => {
            this.error = error;
            this.data = undefined;
        });
    }
    
    parentClicked(event){
        debugger;
        this.selectedParent = null;
        this.selectedSubFolder = null;
        this.disableFolderDeletion = true;
        this.disableFileClicked = true;
        this.selectedFile = null;

        let folderId = event.currentTarget.dataset.id;
        console.log('ProposalCliecked1',folderId);
        let clickedIndex = this.folders.findIndex(item=>item.UniqueId==folderId);

        let foldersList = [];
        this.folders.forEach(item=>{
            let obj = {...item};
            if(obj.UniqueId!=folderId){
                obj.expanded = false;
            }
            foldersList.push(obj);
        })
        console.log('ProposalCliecked1',foldersList);
        
        this.folders = foldersList;
        console.log('ProposalCliecked1',this.folders);
        this.folders[clickedIndex].expanded = !this.folders[clickedIndex].expanded;

        console.log('ProposalCliecked',this.folders[clickedIndex]);

        let selectedFolder = this.folders[clickedIndex];

        let subFilesUrl = selectedFolder.Files.__deferred.uri.split('https://igstc.sharepoint.com/')[1];
        let subFoldersUrl = selectedFolder.Folders.__deferred.uri.split('https://igstc.sharepoint.com/')[1];

        console.log('ProposalCliecked2',subFilesUrl);
        console.log('ProposalCliecked3',subFoldersUrl);

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
                this.selectedFolder = selectedFolder;
                this.isHomeActive = false;
                this.folderDeletionDisable = false;
                //this.deleteFiles = false; 
                
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

                let subFilesUrl = subFolder.Files.__deferred.uri.split('https://igstc.sharepoint.com/')[1];
                let subFoldersUrl = subFolder.Folders.__deferred.uri.split('https://igstc.sharepoint.com/')[1];

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
                    this.selectedFolder = subFolder;
                    this.disableFolderDeletion = false;
                })
            }else{
                this.disableFolderDeletion = true;
            }
        }
    }
 
    @track selectedChildFolder;
    subFolderClicked2(event){
        debugger;

        this.selectedChildFolder = null;
        this.disableFileClicked = true;
        this.selectedFile = null;
        
        let parentFolderId = event.currentTarget.dataset.msg;
        let subFolderId = event.currentTarget.dataset.id;
        
        let parentClickedIndex = this.folders.findIndex(item=>item.UniqueId==this.selectedParent.UniqueId);
        if(this.folders[parentClickedIndex].subFolders){
            let subFolderIndex = this.folders[parentClickedIndex].subFolders.findIndex(item=>item.UniqueId==parentFolderId);
            let folderInnerIndex = this.folders[parentClickedIndex].subFolders[subFolderIndex].subFolders.findIndex(item=>item.UniqueId==subFolderId);
            this.folders[parentClickedIndex].subFolders[subFolderIndex].subFolders[folderInnerIndex].expanded = !this.folders[parentClickedIndex].subFolders[subFolderIndex].subFolders[folderInnerIndex].expanded;

            if(this.folders[parentClickedIndex].subFolders[subFolderIndex].subFolders[folderInnerIndex].expanded){
                let subFolder = this.folders[parentClickedIndex].subFolders[subFolderIndex].subFolders[folderInnerIndex];

                let subFilesUrl = subFolder.Files.__deferred.uri.split('https://igstc.sharepoint.com/')[1];
                let subFoldersUrl = subFolder.Folders.__deferred.uri.split('https://igstc.sharepoint.com/')[1];

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
                    this.folders[parentClickedIndex].subFolders[subFolderIndex].subFolders[folderInnerIndex] = subFolder;
                    this.selectedChildFolder = subFolder;
                    this.selectedFolder = subFolder;
                    this.disableFolderDeletion = false;
                })
            }else{
                this.disableFolderDeletion = true;
            }
        }
    }
    
    @track selectedSubChildFolder;
    subFolderClicked3(event){
        debugger;
        this.showNotification('Failed','No more subfolders can be created!!','error');
        event.stopPropagation();
        /*this.selectedSubChildFolder = null;
        this.disableFileClicked = true;
        this.selectedFile = null;
        
        let currentFolderId = event.currentTarget.dataset.id;
        let parentClickedIndex = this.folders.findIndex(item=>item.UniqueId==this.selectedParent.UniqueId);
        if(this.folders[parentClickedIndex].subFolders){
            let subFolderIndex = this.folders[parentClickedIndex].subFolders.findIndex(item=>item.UniqueId==this.selectedSubFolder.UniqueId);
            let folderInnerIndex = this.folders[parentClickedIndex].subFolders[subFolderIndex].subFolders.findIndex(item=>item.UniqueId==this.selectedChildFolder.UniqueId);
            let childFolderIndex = this.folders[parentClickedIndex].subFolders[subFolderIndex].subFolders[folderInnerIndex].subFolders.findIndex(item=>item.UniqueId==currentFolderId);
            
            this.folders[parentClickedIndex].subFolders[subFolderIndex].subFolders[folderInnerIndex].subFolders[childFolderIndex].expanded = !this.folders[parentClickedIndex].subFolders[subFolderIndex].subFolders[folderInnerIndex].subFolders[childFolderIndex].expanded;

            if(this.folders[parentClickedIndex].subFolders[subFolderIndex].subFolders[folderInnerIndex].subFolders[childFolderIndex].expanded){
                let subFolder = this.folders[parentClickedIndex].subFolders[subFolderIndex].subFolders[folderInnerIndex].subFolders[childFolderIndex];

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
                    //this.folders[parentClickedIndex].subFolders[subFolderIndex].subFolders[folderInnerIndex] = subFolder;
                    this.folders[parentClickedIndex].subFolders[subFolderIndex].subFolders[folderInnerIndex].subFolders[childFolderIndex] = subFolder;
                    this.selectedSubChildFolder = subFolder;
                    this.selectedFolder = subFolder;
                    this.lastfolderSelected = subFolder;
                    this.disableFolderDeletion = false;
                    
                })
            }else{
                this.disableFolderDeletion = true;
                this.showNotification('Failed','No more subfolders can be created!!','error');
            }
        }*/
    }

    fileClickedHandler(event){
        debugger;
        this.fileDeletionDisable = false;
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
        let path = this.selectedFile.linkedUrl;

        if(path && path.length>0){
            window.open(path,'_blank');
        }else{
            console.log('SubFiles',this.selectedFile);
            let filename = '/'+this.selectedFile.Name;
            let id = encodeURIComponent(this.selectedFile.ServerRelativeUrl);
            let parent = encodeURIComponent(this.selectedFile.ServerRelativeUrl.replace(filename,''));
            
            let path = 'https://igstc.sharepoint.com/sites/SalesforceSharepoint/Shared%20Documents/Forms/AllItems.aspx?id='+id+'&parent='+parent;
            window.open(path,'_blank');
        }
    }

    subFileClickedHandler(event){
        debugger;
        //event.stopPropagation();
        this.fileDeletionDisable = false;
        let subFileId = event.currentTarget.dataset.id;
        let parentIndex = this.folders.findIndex(item=>item.UniqueId==this.selectedParent.UniqueId);
        let subFolderIndex = this.folders[parentIndex].subFolders.findIndex(item=>item.UniqueId==this.selectedSubFolder.UniqueId);

        let filesList = [];

        this.folders[parentIndex].subFolders[subFolderIndex].subFiles.forEach(item=>{
            let obj = {...item};
            obj.clicked = false;
            filesList.push(obj);
        });
        this.folders[parentIndex].subFolders[subFolderIndex].subFiles = filesList;

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
        let path = this.selectedFile.linkedUrl;

        if(path && path.length>0){
            window.open(path,'_blank');
        }else{
            console.log('SubFiles',this.selectedFile);
            let filename = '/'+this.selectedFile.Name;
            let id = encodeURIComponent(this.selectedFile.ServerRelativeUrl);
            let parent = encodeURIComponent(this.selectedFile.ServerRelativeUrl.replace(filename,''));
            let path = 'https://igstc.sharepoint.com/sites/SalesforceSharepoint/Shared%20Documents/Forms/AllItems.aspx?id='+id+'&parent='+parent;
            window.open(path,'_blank');
        }

        console.log('SubFiles----',this.selectedFile);
    }

    childFileClickedHandler(event){
            debugger;
            event.stopPropagation();
            this.fileDeletionDisable = false;
            let subFileId = event.currentTarget.dataset.id;
            let parentIndex = this.folders.findIndex(item=>item.UniqueId==this.selectedParent.UniqueId);
            let subFolderIndex = this.folders[parentIndex].subFolders.findIndex(item=>item.UniqueId==this.selectedSubFolder.UniqueId);
            let folderInnerIndex = this.folders[parentIndex].subFolders[subFolderIndex].subFolders.findIndex(item=>item.UniqueId==this.selectedChildFolder.UniqueId);
            let filesList = [];

            this.folders[parentIndex].subFolders[subFolderIndex].subFolders[folderInnerIndex].subFiles.forEach(item=>{
                let obj = {...item};
                obj.clicked = false;
                filesList.push(obj);
            });
            this.folders[parentIndex].subFolders[subFolderIndex].subFolders[folderInnerIndex].subFiles = filesList;

            let subFileIndex = this.folders[parentIndex].subFolders[subFolderIndex].subFolders[folderInnerIndex].subFiles.findIndex(item=>item.UniqueId==subFileId);

            let subFilesList = [];

            this.folders[parentIndex].subFolders[subFolderIndex].subFolders[folderInnerIndex].subFiles.forEach(item=>{
                let obj = {...item};
                obj.clicked = item.UniqueId==subFileId;
                subFilesList.push(obj);
            });

            this.folders[parentIndex].subFolders[subFolderIndex].subFolders[folderInnerIndex].subFiles = subFilesList;
            this.disableFileClicked = false;
        
            this.selectedFile = this.folders[parentIndex].subFolders[subFolderIndex].subFolders[folderInnerIndex].subFiles[subFileIndex];
            let path = this.selectedFile.linkedUrl;

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
            
            console.log('SubFiles----',this.selectedFile);
    }


    @track showFileCreation = false;
    showFileCreationHandler(){
        this.isFileUpLoading = false;
        this.showFileCreation = true;
    }

    closeFileCreation(){
        this.showFileCreation = false;
    }


    @track disableFileCreation = true;
    @track newFile;
    
    fileSelectedHandler(event){
        debugger;

        let file = event.target.files[0];
        let temp = this;
        this.fileData=file;
        this.newFile = file;
        this.disableFileCreation = false;

    }


    @track isFileUploading = false;
   
    createFileSP(){
        debugger;
        this.isFileUpLoading = true;
        let file = this.fileData;
        let reader = new FileReader();
        let temp = this
        console.log('SelectedParent----',temp);
        console.log('selectedFolder--------',this.selectedFolder);

        reader.onload = function() {
            debugger;
            let base64 = this.result.split(/,/)[1];
            let fileName = file.name.replaceAll(' ','_');
            let path;
            
            console.log('SelectedParent----',temp.selectedParent);
            if(temp.selectedFolder){
                path = temp.selectedFolder.ServerRelativeUrl.replaceAll(' ','%20');
                this.selectedFolder = temp.selectedFolder;
                
            }else{
                path = temp.selectedParent.ServerRelativeUrl.replaceAll(' ','%20');
                this.selectedFolder = temp.selectedFolder;
            }
            console.log('ContentType---',path);
            createFile({base64,fileName,path}).then(res=>{
                temp.showFileCreation = false;
                temp.fileData = null
                temp.isFileUpLoading = false;
                temp.showFileCreation = false;
                temp.refreshFoldersAndFiles();
                temp.showNotification('Success',`${fileName} is uploaded Succesfully`,'success');
                
                }).catch(error=>{
                temp.isFileUpLoading = false;
                temp.showNotification('Error',error,'error');
                
                console.log('Error to create the file----',error);
            }) 
            this.showFileCreation = false;
        }

        reader.readAsDataURL(file)
    }

    showNotification(title,message,variant){
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    onFileDBClicked(event){
        console.log(event.currentTarget.dataset.id)
        this[NavigationMixin.Navigate]({ 
            type:'standard__namedPage',
            attributes:{ 
                pageName:'filePreview'
            },
            state:{ 
                selectedRecordId: event.currentTarget.dataset.id
            }
        })
    }

    @track fileDeletionDisable = true;
    onFileSingleClick(event){
        debugger;
        let fileId = event.currentTarget.dataset.id;
      
         if(this.path.length!=1){
           
        this.selectedFolder.files.forEach(file=>{
              
            if(file.UniqueId == fileId){
            file.active = true;
            file.value ==file.UniqueId;
            file.style = file.active?'color:blue':'';
            }else{
                file.style=''
                file.active = false;
            }
            if(file.active){
                this.fileDeletionDisable = false;
            }
        })
        console.log('files are ----->',this.selectedFolder.files);
        }
    }

    @track showFolderCreation = false;
    showFolderCreationPopup(){
        this.showFolderCreation = true;
    }

    closeFolderCreation(){
        this.showFolderCreation = false;
        this.folderName = '';
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
        debugger;
        this.isFolderCreating = false;
        if(!this.folderName || this.folderName.length==0){
            this.showNotification('Failed','Please enter the folder name','error');
            return;
        }
        this.isFolderCreating = true;

        let path = this.selectedFolder.ServerRelativeUrl.replaceAll(' ','%20');
        createFolderSP({path:`${path+'/'+this.folderName}`}).then(result=>{
            this.isFileUploading = false;
            this.showFolderCreation = false;
            this.showNotification('Succesfully',`${this.folderName} folder is created.`,'success');
            this.refreshFoldersAndFiles();
            this.folderName = '';
            this.isFolderCreating = false;
        }).catch(error=>{
            this.isFolderCreating = false;
            console.log('Error----',error);
        })   
    }

    updateRecordView() {
       setTimeout(() => {
            eval("$A.get('e.force:refreshView').fire();");
       }, 1000); 
    }

    downloadFile() {
    debugger;
    //this.isLoaded = false;
    downloadFile({ path: this.selectedFile.ServerRelativeUrl , recordId : this.recordId})
        .then((data) => {
            this.response = data;
            this.showNotification('Success','File downloaded Succesfully!','success');
        })
        .catch((error) => {
            this.error = error;
            this.data = undefined;
        });
    }

    deleteFiles(){
        debugger;
        let selectedFolderToDelete = this.selectedFolder;//.files.find(item=>item.active);
        let selectedFileToDelete = this.selectedFile;
        this.isLoading = true;
        let path = selectedFileToDelete.ServerRelativeUrl;
        console.log('Path---',path);
        deleteFileSP({path}).then(result=>{
       debugger;
            console.log('File deletion result---',result);
            this.fileDeletionDisable = true;
            this.isLoading = false;
            this.showNotification('Success','File deleted Succesfully!','success');
            this.refreshFoldersAndFiles();
            this.updateRecordView();
        }).catch(error=>{
            console.log('Error to delete the file---',error);
            this.showNotification('Error',error,'error');
        })
    }
    deleteFolders(){
        debugger;
                    console.log('serverurl-----', this.selectedFolder);
                    let selectedFolderToDelete = this.selectedFolder;//.folders.find(item=>item.active);
                    if(!selectedFolderToDelete){
                        this.showNotification('Error','Please select any folder to delete','error');
                    }

                    deleteFolderInsideSite({path:selectedFolderToDelete.ServerRelativeUrl}).then(result=>{
                        if(result=='Success'){
                            this.showNotification('Success',`${this.selectedFolder.Name} folder deleted succesfully`,'success');
                            debugger;
                            this.refreshFoldersAndFiles();
                            this.selectedFolder.folders = this.selectedFolder.folders.filter(item=>!item.active);
                            this.folderDeletionDisable = true;
                        }
                    }).catch(error=>{
                        console.log(error.message)
                        console.log('Error to delete subfolder')
                    })
                    console.log('selectedFolderToDelete>>>', selectedFolderToDelete);
        }
    }