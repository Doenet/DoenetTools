import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { itemByDoenetId, selectedCourseItems, useCourse } from '../../../_reactComponents/Course/CourseActions';
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
import { effectiveRoleAtom } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import Textfield from '../../../_reactComponents/PanelHeaderComponents/Textfield';
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';
import { useToast } from '../Toast';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';

export default function SelectedCollectionAlias() {
  // const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const itemObj = useRecoilValue(itemByDoenetId(doenetId));
  console.log("itemObj",itemObj)
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const [itemTextFieldLabel,setItemTextFieldLabel] = useState(itemObj.label)
  let { deleteItem, renameItem } = useCourse(courseId);

  useEffect(()=>{
    if (itemTextFieldLabel !== itemObj.label){
      setItemTextFieldLabel(itemObj.label)
    }
  },[doenetId])

  const handelLabelModfication = () => {
    let effectiveItemLabel = itemTextFieldLabel;
    if (itemTextFieldLabel === '') {
      effectiveItemLabel = itemObj.label;
      if (itemObj.label === ''){
        effectiveItemLabel = 'Untitled Collection Alias';
      }

      setItemTextFieldLabel(effectiveItemLabel);
      addToast('Every item must have a label.');
    }
    //Only update the server when it changes
    if (itemObj.label !== effectiveItemLabel){
      console.log("Rename",doenetId,effectiveItemLabel)
      // renameItem(doenetId,effectiveItemLabel)
    }
  };

  const addToast = useToast();
  let heading = (<h2 data-test="infoPanelItemLabel" style={{ margin: "16px 5px" }} >
    <FontAwesomeIcon icon={faLayerGroup} /> {itemObj.label} 
  </h2>)


  if (effectiveRole === 'student') {
    return null;
  }
  
  return <>
  {heading}
  <Textfield
      label="Label"
      vertical
      width="menu"
      value={itemTextFieldLabel}
      onChange={(e) => setItemTextFieldLabel(e.target.value)}
      onKeyDown={(e) => {
        if (e.keyCode === 13) handelLabelModfication();
      }}
      onBlur={handelLabelModfication}
    />
    <br />
   
    <Button
      width="menu"
      value="Delete Collection Alias"
      alert
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("delete ",doenetId)
        // deleteItem({doenetId});
      }}
    />
  </>
}
