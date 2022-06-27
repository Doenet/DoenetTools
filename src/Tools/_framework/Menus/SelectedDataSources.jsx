
import React, { useEffect, useState } from 'react';
import {  useRecoilCallback, useRecoilValue } from 'recoil';
import {  itemByDoenetId, selectedCourseItems, studentCourseItemOrderByCourseIdBySection, 
  // useCourse 
} from '../../../_reactComponents/Course/CourseActions';
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
import { searchParamAtomFamily } from '../NewToolRoot';
import { useToast, toastType } from '../Toast';


export default function SelectedDataSources() {
  const [assignedSelectedDoenetIds,setAssignedSelectedDoenetIds] = useState([]);
  const selectedDoenetIds = useRecoilValue(selectedCourseItems);
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));

  const findAssignedDoenetIds = useRecoilCallback(({snapshot})=> async (selectedDoenetIds)=>{
    let foundDoenetIds = []
      for (let doenetId of selectedDoenetIds){
        let itemObj = await snapshot.getPromise(itemByDoenetId(doenetId));
        if (itemObj.type == 'activity' && itemObj.isAssigned){
          foundDoenetIds.push(doenetId)
        }else if (itemObj.type == 'section' && itemObj.isAssigned){
          let sectionDoenetIds = await snapshot.getPromise(studentCourseItemOrderByCourseIdBySection({courseId,sectionId:doenetId}))
          let newDoenetIds = await findAssignedDoenetIds(sectionDoenetIds)
          foundDoenetIds = [...newDoenetIds,...foundDoenetIds];
        }
      }
      //Deduplicate
      foundDoenetIds = [...new Set(foundDoenetIds)]
    return foundDoenetIds;
  },[courseId])

  //Every time the selection changes, find all the activity doenetIds in the selected items
  useEffect(()=>{
    if (selectedDoenetIds.length > 0){
      findAssignedDoenetIds(selectedDoenetIds)
      .then((doenetIds)=>{
        setAssignedSelectedDoenetIds(doenetIds)
      })
    }else{
      setAssignedSelectedDoenetIds([])
    }
  },[selectedDoenetIds])


  const addToast = useToast();
  let heading = (<h2 data-cy="selectedDataSourcesHeading" style={{ margin: "16px 5px" }} >
    Event Data
  </h2>)


  // if (effectiveRole === 'student') {
    return (
      <>
        {heading}
        <div>{assignedSelectedDoenetIds.length} {assignedSelectedDoenetIds.length == 1 ? "Activity": "Activities"}</div>
        <br />
        <ActionButton
          width="menu"
          value="View on Shiny"
          disabled={assignedSelectedDoenetIds.length == 0}
          onClick={() => {
            if (assignedSelectedDoenetIds.length == 0){
              addToast(`No activities found`, toastType.INFO);
            }else{
            let searchParamsText = assignedSelectedDoenetIds.join("&data=");
            window.open(`https://doenet.shinyapps.io/analyzer/?data=${searchParamsText}`, '_blank');

            }
          }}
        />
      </>
    );
  // }
  
}
