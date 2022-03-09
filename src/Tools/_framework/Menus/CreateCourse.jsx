import React from 'react';
import { nanoid } from 'nanoid';
import axios from "axios";

import { useToast, toastType } from '@Toast';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { useRecoilCallback } from 'recoil';
import { driveColors, driveImages } from '../../../_reactComponents/Drive/util';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import { fetchCoursesQuery } from '../../../_reactComponents/Drive/NewDrive';


const CreateCourse = (props) =>{
  const toast = useToast();
  const onError = ({errorMessage}) => {
    toast(`Course not created. ${errorMessage}`, toastType.ERROR);
  }
  const createNewDrive = useRecoilCallback(({set})=> 
  async ({label,newDriveId,image,color})=>{
    let newDrive = {
      driveId:newDriveId,
      isShared:"0",
      isPublic:"0",
      label,
      type: "course",
      image,
      color,
      subType:"Administrator",
      role:["Owner"]
    }
    const payload = { params:{
      driveId:newDriveId,
      isPublic:"0",
      label,
      type:"new course drive",
      image,
      color,
    } }

    const result = axios.get("/api/addDrive.php", payload)

    result.then((resp) => {
      if (resp.data.success){
        set(fetchCoursesQuery,(oldDrivesInfo)=>{
          let newDrivesInfo = {...oldDrivesInfo}
          newDrivesInfo.driveIdsAndLabels = [newDrive,...oldDrivesInfo.driveIdsAndLabels]
          return newDrivesInfo
        }
        )
      }
    })
    return result;
  });


  return <div style={props.style}>
  {/* <Button value="Create New Course" onClick={()=>toast('Stub Created Course!', toastType.SUCCESS)}  /> */}
  <ButtonGroup vertical>
    <Button   width="menu"  value="Create New Course" onClick={()=>{
        // e.stopPropagation();
        let driveId = null;
        let newDriveId = nanoid();
        let label = "Untitled";
        let image = driveImages[Math.floor(Math.random() * driveImages.length)];
        // let color = driveColors[Math.floor(Math.random() * driveColors.length)];
        let color = "none";
        const result = createNewDrive({label,driveId,newDriveId,image,color});
        result.then((resp)=>{
          if (resp.data.success){
            toast(`Created a new course named '${label}'`, toastType.SUCCESS);
          }else{
            onError({errorMessage: resp.data.message});
          }
        }).catch((e)=>{
          onError({errorMessage: e.message});
        })
    }} >Create New Course</Button>
  </ButtonGroup>
  
 
  </div>
}
export default CreateCourse;