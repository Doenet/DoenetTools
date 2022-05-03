
import React, { useEffect, useState } from 'react';
import {  useRecoilValue } from 'recoil';
import {  selectedCourseItems, useCourse } from '../../../_reactComponents/Course/CourseActions';
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
import { searchParamAtomFamily } from '../NewToolRoot';
// import { effectiveRoleAtom } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import { useToast, toastType } from '../Toast';


export default function SelectedDataSources() {
  const [pageDoenetIds,setPageDoenetIds] = useState([]);
  const selectedDoenetIds = useRecoilValue(selectedCourseItems);
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const { findPagesFromDoenetIds } = useCourse(courseId);

  //Every time the selection changes, find all the pages in the selected items
  useEffect(()=>{
    if (selectedDoenetIds.length > 0){
      findPagesFromDoenetIds(selectedDoenetIds)
      .then((pages)=>{
        setPageDoenetIds(pages)
      })
    }else{
      setPageDoenetIds([])
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
        <div>{pageDoenetIds.length} Page{pageDoenetIds.length == 1 ? "": "s"}</div>
        <br />
        <ActionButton
          width="menu"
          value="View on Shiny"
          disabled={pageDoenetIds.length == 0}
          onClick={() => {
            if (pageDoenetIds.length == 0){
              addToast(`No pages found`, toastType.INFO);
            }else{
            console.log("Open Link to data for Pages",pageDoenetIds)
            }
          }}
        />
      </>
    );
  // }
  
}
