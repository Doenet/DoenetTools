import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { itemByDoenetId, selectedCourseItems } from '../../../_reactComponents/Course/CourseActions';
import { pageToolViewAtom } from '../NewToolRoot';
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
import ActionButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ActionButtonGroup';

export default function SelectedPageAlias() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const pageId = useRecoilValue(selectedCourseItems)[0];
  const pageObj = useRecoilValue(itemByDoenetId(pageId));
  const containingObj = useRecoilValue(itemByDoenetId(pageObj.containingDoenetId));
  const doenetId = containingObj.doenetId;
  const [itemTextFieldLabel,setItemTextFieldLabel] = useState(pageObj.label)

  useEffect(()=>{
    if (itemTextFieldLabel !== pageObj.label){
      setItemTextFieldLabel(pageObj.label)
    }
  },[pageId]) //Only check when the pageId changes


  let heading = (<h2 data-test="infoPanelItemLabel" style={{ margin: "16px 5px" }} >
    <FontAwesomeIcon icon={faLink} /> {pageObj.label} 
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
                pageId,
                doenetId,
              },
            });
          }}
        />
  </ActionButtonGroup>
  </>
}
