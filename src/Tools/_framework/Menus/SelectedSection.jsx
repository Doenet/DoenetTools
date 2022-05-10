import { faFolderTree } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authorItemByDoenetId, selectedCourseItems, useCourse } from '../../../_reactComponents/Course/CourseActions';
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { effectiveRoleAtom } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import Textfield from '../../../_reactComponents/PanelHeaderComponents/Textfield';
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';
import { toastType, useToast } from '../Toast';



export default function SelectedSection() {
  // const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const itemObj = useRecoilValue(authorItemByDoenetId(doenetId));
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const { renameItem, deleteItem } = useCourse(courseId);
  const [itemTextFieldLabel,setItemTextFieldLabel] = useState(itemObj.label)
  const { updateAssignItem } = useCourse(courseId);

  let assignSectionText = 'Assign Section';
  if (itemObj.isAssigned ) {
    assignSectionText = 'Unassign Section';
  }

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
    <FontAwesomeIcon icon={faFolderTree} /> {itemObj.label} 
  </h2>)


  if (effectiveRole === 'student') {
    return (
      <>
        {heading}
        
      </>
    );
  }
  
  return <>
  {heading}
  <ActionButton
        width="menu"
        value={assignSectionText}
        onClick={() => {
          console.log("itemObj.isAssigned",itemObj.isAssigned)
          let toastText = 'Section Assigned.'
          if (itemObj.isAssigned){
            toastText = 'Section Unassigned.'
          }
          updateAssignItem({
            doenetId,
            isAssigned:!itemObj.isAssigned,
            successCallback: () => {
              addToast(toastText, toastType.INFO);
            },
          })
        
        }}
      />
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
      value="Delete Section"
      alert
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      
        deleteItem({doenetId});
      }}
    />
  </>
}
 