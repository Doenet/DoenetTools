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

export default function SelectedBank() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const itemObj = useRecoilValue(itemByDoenetId(doenetId));
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const { renameItem } = useCourse(courseId);
  const [itemTextFieldLabel,setItemTextFieldLabel] = useState(itemObj.label)
  let { create, deleteItem } = useCourse(courseId);

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
        effectiveItemLabel = 'Untitled';
      }

      setItemTextFieldLabel(effectiveItemLabel);
      addToast('Every item must have a label.');
    }
    //Only update the server when it changes
    if (itemObj.label !== effectiveItemLabel){
      renameItem(doenetId,effectiveItemLabel)
    }
  };

  const addToast = useToast();
  let heading = (<h2 data-cy="infoPanelItemLabel" style={{ margin: "16px 5px" }} >
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
    <ButtonGroup vertical>
      <Button
        width="menu"
        onClick={() =>
          create({itemType:"page"})
        }
        value="Add Page"
      />
    </ButtonGroup>
    <br />
    <Button
      width="menu"
      value="Delete Collection"
      alert
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      
        deleteItem({doenetId});
      }}
    />
  </>
}
