import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
// import parse from 'csv-parse';
import {
  useSetRecoilState,
  useRecoilValue,
  atomFamily,
  selectorFamily
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

const supportingFilesAndPermissionByDoenetIdAtom = atomFamily({
  key: 'supportingFilesAndPermissionByDoenetId',
  default: selectorFamily({
    key: 'supportingFilesAndPermissionByDoenetId/Default',
    get: (doenetId) => async () => {
      let { data } = await axios.get('/api/loadSupprtingFileInfo.php', {params:{doenetId}})
      console.log("data",data)
      let {canUpload,supportingFiles,userQuotaBytesAvailable} = data;
      return {canUpload,supportingFiles,userQuotaBytesAvailable};
    },
  }),
});

const supportingFilesAndPermissionByDoenetIdSelector = selectorFamily({
  get:
    (doenetId) =>
    ({ get }) => {
      return get(supportingFilesAndPermissionByDoenetIdAtom(doenetId));
    },
});

export default function SupportingFilesMenu(props){
  const addToast = useToast();
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const { canUpload, userQuotaBytesAvailable, supportingFiles} = useRecoilValue(supportingFilesAndPermissionByDoenetIdSelector(doenetId));
  console.log("supportingFiles",supportingFiles)
  // let userQuotaBytesAvailable = 1073741824; //1 GB in bytes
  // let userQuotaBytesAvailable = supportingFiles.userQuotaBytesAvailable
  let typesAllowed = ["text/csv","image/jpeg"]
  let [uploadProgress,setUploadProgress] = useState([]); // {fileName,size,progressPercent}
  let numberOfFilesUploading = useRef(0);

  const onDrop = useCallback((files) => {
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
    //Only upload one batch at a time
    if (numberOfFilesUploading.current > 0){
      addToast(`Already uploading files.  Please wait before sending more.`, toastType.ERROR);
      success = false;
    }
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
        // let contentId = getSHAofContent(reader.result);
        // console.log("contentId",contentId);

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
        console.log("RESPONSE data>",data)

        //test if all uploads are finished then clear it out
        numberOfFilesUploading.current = numberOfFilesUploading.current - 1;
        if (numberOfFilesUploading.current < 1){setUploadProgress([])}
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
    {uploadProgressJSX}
    </>
  }
  

  return <div>
    {uploadingSection}
      
      <br />
      {/* <img src={imageSrc} width={100}/> */}
      
      

  </div>
}