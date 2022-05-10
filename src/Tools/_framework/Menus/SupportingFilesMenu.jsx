import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
// import parse from 'csv-parse';
import {
  useSetRecoilState,
  useRecoilValue,
  atomFamily,
  selectorFamily,
  useRecoilState,
  useRecoilCallback
} from 'recoil';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import CollapseSection from '../../../_reactComponents/PanelHeaderComponents/CollapseSection';
import { useToast, toastType }  from '../Toast';
import axios from 'axios';
import { searchParamAtomFamily } from '../NewToolRoot';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClipboard
 } from '@fortawesome/free-regular-svg-icons';

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

const supportingFilesAndPermissionByDoenetIdAtom = atomFamily({
  key: 'supportingFilesAndPermissionByDoenetId',
  default: selectorFamily({
    key: 'supportingFilesAndPermissionByDoenetId/Default',
    get: (doenetId) => async () => {
      let { data } = await axios.get('/api/loadSupprtingFileInfo.php', {params:{doenetId}})
      // console.log("loadSupprtingFileInfo data",data)
      // let {canUpload,supportingFiles,userQuotaBytesAvailable, quotaBytes} = data;
      return data;
    },
  }),
});

const supportingFilesAndPermissionByDoenetIdSelector = selectorFamily({
  get:
    (doenetId) =>
    ({ get }) => {
      return get(supportingFilesAndPermissionByDoenetIdAtom(doenetId));
    },
  set:
    (doenetId) =>
    ({set},newValue) => {
      set(supportingFilesAndPermissionByDoenetIdAtom(doenetId),newValue)
    }
});

function EditableText({text,submit}){
  if (!submit){ submit = ()=>{}}
  let [editingMode,setEditingMode] = useState(false);
  let [editText,setText] = useState(text);

  //Don't wait for parent's prop to display editted text
  let displayText = text;
  if (!editingMode){
    displayText = editText;
  }
  

  let textSpanStyle = {width:'110px',display: "inline-block",textOverflow:"ellipsis",whiteSpace:"nowrap"}
  if (displayText === ''){
    displayText = ' *Required';
    textSpanStyle['border'] = "solid 2px var(--mainRed)";
  }

  if (!editingMode){
    return <span 
            style={textSpanStyle} 
            onClick={()=>setEditingMode(true)}
           >{displayText}</span>
  }


  return <input 
          autoFocus
          type='text' 
          style={{width:'116px'}} 
          value={editText} 
          onChange={(e)=>setText(e.target.value)} 
          onBlur={(e)=>{
            setEditingMode(false);
            submit(editText);
          }}
          onKeyDown={(e)=>{
            if (e.key === 'Enter'){
              setEditingMode(false);
              submit(editText);
            }
          }}
  />

}

export default function SupportingFilesMenu(props){
  const addToast = useToast();
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const [{ canUpload, userQuotaBytesAvailable, supportingFiles, quotaBytes},setSupportFileInfo] = useRecoilState(supportingFilesAndPermissionByDoenetIdSelector(doenetId));
  // const { canUpload, userQuotaBytesAvailable, supportingFiles} = useRecoilValue(supportingFilesAndPermissionByDoenetIdSelector(doenetId));
  // console.log("supportingFiles",{ canUpload, userQuotaBytesAvailable, supportingFiles})
  // let userQuotaBytesAvailable = 1073741824; //1 GB in bytes
  // let userQuotaBytesAvailable = supportingFiles.userQuotaBytesAvailable
  let typesAllowed = ["image/jpeg","image/png"]
  // let typesAllowed = ["text/csv","image/jpeg","image/png"]
  let [uploadProgress,setUploadProgress] = useState([]); // {fileName,size,progressPercent}
  let numberOfFilesUploading = useRef(0);

  const updateDescription = useRecoilCallback(({set})=> async (description,contentId)=>{
    // console.log("updateDescription",description,contentId,doenetId);
    let { data } = await axios.get('/api/updateFileDescription.php',{params:{doenetId,contentId,description}});
    // console.log("updateDescription data",data)
    // let { userQuotaBytesAvailable } = data;
    set(supportingFilesAndPermissionByDoenetIdSelector(doenetId),(was)=>{
      let newObj = {...was};
      let newSupportingFiles = [...was.supportingFiles];
      newSupportingFiles.map((file,index)=>{
        if (file.contentId === contentId){
          newSupportingFiles[index] = {...newSupportingFiles[index]}
          newSupportingFiles[index].description = description;
        }
      })
      newObj.supportingFiles = newSupportingFiles;
      return newObj;
    })
  },[doenetId]);

  const updateAsFileName = useRecoilCallback(({set})=> async (asFileName,contentId)=>{
    // console.log("updateasFileName",asFileName,contentId,doenetId);
    let { data } = await axios.get('/api/updateFileAsFileName.php',{params:{doenetId,contentId,asFileName}});
    // console.log("updateasFileName data",data)
    // let { userQuotaBytesAvailable } = data;
    set(supportingFilesAndPermissionByDoenetIdSelector(doenetId),(was)=>{
      let newObj = {...was};
      let newSupportingFiles = [...was.supportingFiles];
      newSupportingFiles.map((file,index)=>{
        if (file.contentId === contentId){
          newSupportingFiles[index] = {...newSupportingFiles[index]}
          newSupportingFiles[index].asFileName = asFileName;
        }
      })
      newObj.supportingFiles = newSupportingFiles;
      return newObj;
    })
  },[doenetId]);

  const deleteFile = useRecoilCallback(({set})=> async (contentId)=>{
    // console.log("Delete file",{doenetId,contentId});
    //Update quota info using the server's records
    let { data } = await axios.get('/api/deleteFile.php',{params:{doenetId,contentId}});
    // console.log("deleteFile data",data)
    let { userQuotaBytesAvailable } = data;
    set(supportingFilesAndPermissionByDoenetIdSelector(doenetId),(was)=>{
      let newObj = {...was};
      newObj.supportingFiles = was.supportingFiles.filter((file)=>file.contentId !== contentId);
      newObj.userQuotaBytesAvailable = userQuotaBytesAvailable;
      return newObj;
    })

  },[doenetId])

  const onDrop = useCallback((files) => {
    let success = true;
    let sizeOfUpload = 0;
    files.map(file=>{
      if (!typesAllowed.includes(file.type)){
        addToast(`File '${file.name}' of type '${file.type}' is not allowed. No files uploaded.`, toastType.ERROR);
        success = false;
      }
      sizeOfUpload += file.size;
    })
    let uploadText = bytesToSize(sizeOfUpload);
    let overage = bytesToSize(sizeOfUpload - userQuotaBytesAvailable); 
    if (sizeOfUpload > userQuotaBytesAvailable){
      addToast(`Upload size ${uploadText} exceeds quota by ${overage}. No files uploaded.`, toastType.ERROR);
      success = false;
    }
    //Only upload one batch at a time
    if (numberOfFilesUploading.current > 0){
      addToast(`Already uploading files.  Please wait before sending more.`, toastType.ERROR);
      success = false;
    }

    //Only upload if less than 1MB
    files.map(file=>{
      if (file.size >= 1000000){
        addToast(`File '${file.name}' is larger than 1MB. No files uploaded.`, toastType.ERROR);
        success = false;
      }
    })


    //If file sizes are over quota or any files aren't right type then abort
    if (!success){ return; }

    numberOfFilesUploading.current = files.length;
    
    files.map((file)=>{
      let initialFileInfo = {fileName:file.name,size:file.size,progressPercent:0}
      setUploadProgress((was)=>[...was,initialFileInfo])
    })


    //Upload files
    files.map((file,fileIndex)=>{
      // console.log('file',file)
      //TODO: Show loading  image
        const reader = new FileReader();
        reader.readAsDataURL(file);  //This one could be used with image source to preview image
        // reader.readAsArrayBuffer(file);
  
      reader.onabort = () => {};
      reader.onerror = () => {};
      reader.onload = () => {

        const uploadData = new FormData();
        uploadData.append('file',file);
        uploadData.append('doenetId',doenetId);
  
          axios.post('/api/upload.php',uploadData,{onUploadProgress: (progressEvent)=>{
        const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
            if (totalLength !== null) {
                // this.updateProgressBarValue(Math.round( (progressEvent.loaded * 100) / totalLength ));
            // console.log("updateProgressBarValue",file.name,fileIndex, Math.round( (progressEvent.loaded * 100) / totalLength ));
            let progressPercent = Math.round( (progressEvent.loaded * 100) / totalLength );
            setUploadProgress((was)=>{
              let newArray = [...was];
              newArray[fileIndex].progressPercent = progressPercent;
              return newArray;
            })
            }
      }}).then(({data})=>{
        // console.log("data",file.name,fileIndex,data)
        // console.log("RESPONSE data>",data)

        //test if all uploads are finished then clear it out
        numberOfFilesUploading.current = numberOfFilesUploading.current - 1;
        if (numberOfFilesUploading.current < 1){setUploadProgress([])}
        let {success, fileName, contentId, asFileName, width, height, msg, userQuotaBytesAvailable} = data;
        // console.log(">>data",data)
        // console.log("FILE UPLOAD COMPLETE: Update UI",file,data)
        if (msg){
          if (success){
            addToast(msg, toastType.INFO)
          }else{
            addToast(msg, toastType.ERROR)
          }
        }
        if (success){
          setSupportFileInfo((was)=>{
            let newObj = {...was}
            let newSupportingFiles = [...was.supportingFiles];
            newSupportingFiles.push({
              contentId,
              fileName,
              fileType:file.type,
              width,
              height,
              description:"",
              asFileName
            })
            newObj.supportingFiles = newSupportingFiles;
            newObj['userQuotaBytesAvailable'] = userQuotaBytesAvailable;
            return newObj;
          })
        }
        
      })
      };
      
    })

  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  let uploadProgressJSX = uploadProgress.map((info)=>{
    return <div>{info.fileName} - {info.progressPercent}%</div>
  })

  let uploadingSection = null;

  if (canUpload){
    uploadingSection = <>
    <div>{userQuotaBytesAvailable}/{quotaBytes} Bytes</div>
    <div key="drop" {...getRootProps()}>
    <input {...getInputProps()} />
    {isDragActive ? (
      <p>Drop the files here</p>
    ) : (
      <ButtonGroup vertical>
        <Button width="menu" value="Upload files"></Button>
      </ButtonGroup>
    )}
    </div>
    <CollapseSection title="Accepted File Types" collapsed={true} >
      <div><b>Image</b>.jpg .png</div>
      {/* <div><b>Data</b>.csv</div> */}
      {/* <div><b>Audio</b></div> */}
    </CollapseSection>
    {uploadProgressJSX}
    </>
  }

  let supportFilesJSX = [];

  supportingFiles.map(({
    contentId,
    fileName,
    fileType,
    width,
    height,
    description,
    asFileName
  })=>{
    let doenetMLCode = 'Error';
    let source = `doenet:cid=${contentId}`;
    if (fileType === 'image/jpeg' || fileType === 'image/png'){
      doenetMLCode = `<image source='${source}' description='${description}' asfilename='${asFileName}' width='${width}' height='${height}' mimeType='${fileType}' />`
    }else if (fileType === 'text/csv'){
      doenetMLCode = `<dataset source='${source}' />`
    }

    let description_required_css = {};
    // if (description === ''){
    //   description_required_css = {border:"solid 2px #C1292E"}
    // }
    
    supportFilesJSX.push(
    <div>
      <div>
        <span style={{width:'116px'}}>asFileName:</span>
        <EditableText text={asFileName} submit={(text)=>{updateAsFileName(text,contentId)}}/>
      </div>
      <div style={description_required_css}>
        <span style={{width:'116px'}}>description:</span>
        <EditableText text={description} submit={(text)=>{updateDescription(text,contentId)}}/>
      </div>
      <div>
        <button onClick={()=>{
          deleteFile(contentId);
        }}>delete</button>
        <CopyToClipboard onCopy={()=>addToast('Code copied to clipboard!', toastType.SUCCESS)} text={doenetMLCode}>
          <button onClick={()=>{
            
          }}>Code <FontAwesomeIcon icon={faClipboard}/></button> 
          </CopyToClipboard>
      </div>
      <hr />
    </div>)
   
  })
  

  return <div>
    {uploadingSection}
      <br />
      {supportFilesJSX}
      {/* <img src={imageSrc} width={100}/> */}
  </div>
}