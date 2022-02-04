import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
// import parse from 'csv-parse';
import {
  useSetRecoilState,
  useRecoilValue,
} from 'recoil';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import CollapseSection from '../../../_reactComponents/PanelHeaderComponents/CollapseSection';
import { useToast, toastType }  from '../Toast';
import axios from 'axios';
import { getSHAofContent } from '../ToolHandlers/CourseToolHandler';
import { searchParamAtomFamily } from '../NewToolRoot';


function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export default function SupprtingFilesMenu(props){
  const addToast = useToast();
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  // let [imageSrc,setImageSrc] = useState(null);
  let userQuotaBytesAvailable = 1073741824; //1 GB in bytes
  // let userQuotaBytesAvailable = 100024; //TEST
  let typesAllowed = ["text/csv","image/jpeg"]

  const onDrop = useCallback((files) => {
    // console.log("files",files)
    let success = true;
    let sizeOfUpload = 0;
    files.map(file=>{
      if (!typesAllowed.includes(file.type)){
        addToast(`File ${file.name} of type ${file.type} is not allowed. No files uploaded.`, toastType.ERROR);
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
    //If file sizes are over quota or any files aren't right type then abort
    if (!success){ return; }
  

    //Upload files
    files.map((file,fileIndex)=>{
      console.log('file',file)
      //TODO: Show loading  image
        const reader = new FileReader();
        reader.readAsDataURL(file);  //This one could be used with image source to preview image
        // reader.readAsArrayBuffer(file);
  
      reader.onabort = () => {};
      reader.onerror = () => {};
      reader.onload = () => {
        // let contentId = getSHAofContent(reader.result);
        // console.log("contentId",contentId);
        // console.log("reader.result",reader.result)
        // let contentData = reader.result.split(',')[1];
        let contentData = reader.result;
        // setImageSrc(imageData)
        // setImageSrc(reader.result)
        const uploadData = new FormData();
        uploadData.append('file',file);
        uploadData.append('doenetId',doenetId);
        // uploadData.set('thing','mytest');
        // let doenetId = 'need!';
        // uploadData.append('contents',reader.result);
        // axios.post('/api/upload.php',uploadData,{onUploadProgress: (progressEvent)=>{

        // let uploadData = {
        //   type:file.type,
        //   content:contentData,
        //   // content:reader.result,
        //   doenetId,
        //   size:file.size,
        // }
          axios.post('/api/upload.php',uploadData,{onUploadProgress: (progressEvent)=>{
        const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
            // console.log("onUploadProgress",file.name,fileIndex, totalLength);
            if (totalLength !== null) {
                // this.updateProgressBarValue(Math.round( (progressEvent.loaded * 100) / totalLength ));
            console.log("updateProgressBarValue",file.name,fileIndex, Math.round( (progressEvent.loaded * 100) / totalLength ));
            }
      }}).then(({data})=>{
        // console.log("data",file.name,fileIndex,data)
        console.log("RESPONSE data>",data)
      })
      };
      

      

    })

    


    
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });


  return <div style={props.style}>
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
        <div><b>Image</b>.jpg .jpeg</div>
        <div><b>Data</b>.csv</div>
        {/* <div><b>Audio</b></div> */}
      </CollapseSection>
      <br />
      {/* <img src={imageSrc} width={100}/> */}
      
      

  </div>
}