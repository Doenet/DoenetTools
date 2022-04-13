// import React from 'react';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import { useRecoilCallback } from 'recoil';
import { authorItemByDoenetId, selectedCourseItems } from '../../../_reactComponents/Course/CourseActions';

export default function NavigationLeave(){
  // console.log(">>>===NavigationLeave")
  const clearSelections = useRecoilCallback(({set,snapshot})=> async ()=>{
    let selectedDoenentIds = await snapshot.getPromise(selectedCourseItems);
    for (let doenetId of selectedDoenentIds){
      set(authorItemByDoenetId(doenetId),(prev)=>{
        let next = {...prev}
        next.isSelected = false;
        return next
      })
    }
    set(selectedCourseItems,[]);
    set(selectedMenuPanelAtom,"");
  })
  clearSelections()

  return null;
}