import { faCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authorItemByDoenetId, selectedCourseItems, useCourse } from '../../../_reactComponents/Course/CourseActions';
// import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
// import { effectiveRoleAtom } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import Textfield from '../../../_reactComponents/PanelHeaderComponents/Textfield';
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';
import { useToast, toastType } from '@Toast';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
import ActionButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ActionButtonGroup';

export default function SelectedPage() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  // const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const itemObj = useRecoilValue(authorItemByDoenetId(doenetId));
  const containingObj = useRecoilValue(authorItemByDoenetId(itemObj.containingDoenetId));
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'))
  const { create, renameItem, compileActivity, deleteItem } = useCourse(courseId);
  const [itemTextFieldLabel,setItemTextFieldLabel] = useState(itemObj.label)
  const addToast = useToast();

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

  let heading = (<h2 data-cy="infoPanelItemLabel" style={{ margin: "16px 5px" }} >
    <FontAwesomeIcon icon={faCode} /> {itemObj.label} 
  </h2>)

  
  return <>
  {heading}
  <ActionButtonGroup vertical>
  <ActionButton
          width="menu"
          value="Edit Page"
          onClick={() => {
            setPageToolView({
              page: 'course',
              tool: 'editor',
              view: '',
              params: {
                courseId,
                doenetId,
              },
            });
          }}
        />
  <ActionButton
          width="menu"
          value="View Page"
          onClick={() => {
            compileActivity({
              activityDoenetId:doenetId,successCallback:()=>{
                addToast("Activity compiled!", toastType.INFO);
                setPageToolView({
                  page: 'course',
                  tool: 'assignment',
                  view: '',
                  params: {
                    courseId,
                    doenetId,
                  },
                });
              }
            })
          }}
        />
  </ActionButtonGroup>
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
    {containingObj.type == 'activity' ? 
     <Button
     width="menu"
     onClick={() =>
       create({itemType:"order"})
     }
     value="Add Order"
   /> : null
    }
     
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
      value="Delete Page"
      alert
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      
        deleteItem({doenetId});
      }}
    />
  </>
}
