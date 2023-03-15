import axios from 'axios';
import React, { useCallback, useRef, useState } from 'react';
import { redirect, useLoaderData, useNavigate } from 'react-router';
import { Form } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { useDropzone } from 'react-dropzone';


export async function action({ request, params }) {
  const formData = await request.formData();
  let updates = Object.fromEntries(formData);
  let response = await axios.post("/api/updatePortfolioActivitySettings.php",{
    ...updates, doenetId:params.doenetId
  })
  const portfolioCourseId = response.data.portfolioCourseId;

      // if (response.ok) {
      //   // let { doenetId } = await response.json();

        return redirect(`/portfolio/${portfolioCourseId}`) 
      // }else{
      //   throw Error(response.message)
      // }
}

export async function loader({ params }){
  const response = await fetch(`/api/getPortfolioActivityData.php?doenetId=${params.doenetId}`);
  const data = await response.json();
  return data.activityData;
}

const MainGrid = styled.div`
  display:grid;
  grid-template-rows: auto 10px [slot1-start] 40px [slot1-end] 20px [slot2-start] min-content [slot2-end] 20px [slot3-start] 40px [slot3-end] 10px auto;
  height: 100vh;
`

const Slot1 = styled.div`
  grid-row: slot1-start/slot1-end;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* background: skyblue; */
`

const Slot2 = styled.div`
  grid-row: slot2-start/slot2-end;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* background: lightcoral; */
`
const Slot3 = styled.div`
  grid-row: slot3-start/slot3-end;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* background: greenyellow; */
`

const SideBySide = styled.div`
  display: flex;
  column-gap: 20px;
`

const Table = styled.table`
     border:solid 1px var(--mainGray);
     padding:10px;
     border-radius: 6px;
`

const Th = styled.th`
    border-bottom:solid 1px var(--mainGray);
    max-width:420px;
    min-width:390px;
    text-align:left;
    padding:10px;
`
const Td = styled.td`
    border-bottom:solid 1px var(--mainGray);
    max-width:420px;
    min-width:390px;
    text-align:left;
    padding:10px;
`

  const Image = styled.img`
    max-width: 238px;
    max-height: 122px;
  `
  const CardTop = styled.div`
    height: 124px;
    width: 240px;
    background: black;
    overflow: hidden;
    margin: 10px;
    border: 2px solid #949494;
    border-radius: 6px;
  `

function ImagePreview({defaultValue}){
  return <CardTop>
      <Image alt="preview" src={defaultValue} />
    </CardTop>
}

export function PortfolioActivitySettings(){
  let data = useLoaderData();
  const navigate = useNavigate();
  let numberOfFilesUploading = useRef(0);

  let [uploadProgress,setUploadProgress] = useState([]); // {fileName,size,progressPercent}
  let [imagePath,setImagePath] = useState(data.imagePath);

  const onDrop = useCallback((files) => {
    let success = true;
    let sizeOfUpload = 0;
    const file = files[0];
    if (files.length > 1){
      success = false;
    }


    //Only upload one batch at a time
    if (numberOfFilesUploading.current > 0){
      console.log("Already uploading files.  Please wait before sending more.")
      // addToast(`Already uploading files.  Please wait before sending more.`, toastType.ERROR);
      success = false;
    }

    //If any settings aren't right then abort
    if (!success){ return; }

    numberOfFilesUploading.current = files.length;
    
 
    let initialFileInfo = {fileName:file.name,size:file.size,progressPercent:0}
    setUploadProgress((was)=>[...was,initialFileInfo])



    //Upload files
      const reader = new FileReader();
      reader.readAsDataURL(file);  //This one could be used with image source to preview image
  
      reader.onabort = () => {};
      reader.onerror = () => {};
      reader.onload = () => {

        const uploadData = new FormData();
        uploadData.append('file',file);
        uploadData.append('doenetId',data.doenetId);
          axios.post('/api/upload.php',uploadData,{onUploadProgress: (progressEvent)=>{
        const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
            if (totalLength !== null) {
                // this.updateProgressBarValue(Math.round( (progressEvent.loaded * 100) / totalLength ));
            // console.log("updateProgressBarValue",file.name,fileIndex, Math.round( (progressEvent.loaded * 100) / totalLength ));
            let progressPercent = Math.round( (progressEvent.loaded * 100) / totalLength );
            setUploadProgress((was)=>{
              let newArray = [...was];
              newArray[0].progressPercent = progressPercent;
              return newArray;
            })
            }
      }}).then(({data})=>{
        // console.log("data",file.name,fileIndex,data)
        console.log("RESPONSE data>",data)

        //uploads are finished clear it out
        numberOfFilesUploading.current = 0;
        setUploadProgress([]);
        let {success, fileName, cid, asFileName, width, height, msg, userQuotaBytesAvailable} = data;

        if (success){
          setImagePath(`/media/${cid}.jpg`)
         
        }
        
      })
      };

  }, [data.doenetId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return <>
    <Form id="portfolioActivitySettings" method="post">
  <MainGrid>
  <Slot1>
    <div>{data.isNew ? <h1>Add Activity</h1> : <h1>Activity Settings</h1>}</div>
  </Slot1>
  <Slot2>
  <Table>
    <thead>
      <tr>
        <Th>Property</Th>
        <Th>Setting</Th>
      </tr>
    </thead>
    <tbody>
    {/* <tr key="drop" {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
             <Td colSpan="2"> <p style={{height:"130px"}}>Drop the files here</p></Td>
            ) : (
              <><Td><SideBySide>Image <Button value="Upload" onClick={() => alert('upload')}/></SideBySide>
        <div>Upload will be resized</div>
        <div>max width 238px, max height 122 px</div>
        </Td>
        <Td>
          <ImagePreview defaultValue={data.imagePath}/>
        </Td></>
            )}
          </tr> */}
      <tr>
        <Td><SideBySide>Image <Button value="Upload" onClick={() => alert('upload')}/></SideBySide>
        <div>Upload will be resized</div>
        <div>max width 238px, max height 122 px</div>
        </Td>
        <Td>
        <div key="drop" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p style={{height: "124px"}}>Drop the files here</p>
        ) : (
              <ImagePreview defaultValue={imagePath}/>
        )}
        </div>
        </Td>
      </tr>
          {/* <input name="imagePath" style={{width:"390px"}} type="text" placeholder='This will be an image preview' defaultValue={data.imagePath}/> */}
      <tr>
        <Td>Activity Label</Td>
        <Td><input name="label" style={{width:"390px"}} type="text" placeholder='Activity 1' defaultValue={data.label}/></Td>
        </tr>
      <tr>
        <Td>Learning Outcomes</Td>
        <Td><textarea name="learningOutcomes" style={{width:"390px",resize: "vertical"}} placeholder='Description of Learning Outcomes' defaultValue={data.learningOutcomes}/></Td>
        </tr>
      <tr>
        <Td>Public <input name="public" type="checkbox" defaultChecked={data.public == '1'} /></Td>
        <Td></Td>
      </tr>
    </tbody>
  </Table>
  </Slot2>
  <Slot3>  
    
    {data.isNew ? <SideBySide>
      <Button alert value="Cancel" onClick={() => navigate(-1)}/>
      <Button type="submit" value="Create" />
      </SideBySide>
      :
      <SideBySide>
      <Button alert value="Cancel" onClick={() => navigate(-1)}/>
      <Button type="submit" value="Update" />
      </SideBySide>
    }
    
  </Slot3>
  </MainGrid>
  <input type="hidden" name="imagePath" value={imagePath}></input>
  </Form>
  </>
}




