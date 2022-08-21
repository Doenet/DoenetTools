import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { itemByDoenetId, selectedCourseItems } from '../../../_reactComponents/Course/CourseActions';
import { pageToolViewAtom } from '../NewToolRoot';
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
import ActionButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ActionButtonGroup';

export default function SelectedPageLink() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const pageObj = useRecoilValue(itemByDoenetId(doenetId));
  const [itemTextFieldLabel,setItemTextFieldLabel] = useState(pageObj.label)

  useEffect(()=>{
    if (itemTextFieldLabel !== pageObj.label){
      setItemTextFieldLabel(pageObj.label)
    }
  },[doenetId]) //Only check when the pageId changes

  console.log(">>>>SelectedPageLink pageObj",pageObj)

  let heading = (<h2 data-test="infoPanelItemLabel" style={{ margin: "16px 5px" }} >
    <FontAwesomeIcon icon={faLink} /> {pageObj.label} 
  </h2>)

  
  return <>
  {heading}
  <ActionButtonGroup vertical>
  <ActionButton
          width="menu"
          value="View Page Link"
          onClick={() => {
            setPageToolView({
              page: 'course',
              tool: 'editor',
              view: '',
              params: {
                linkPageId:doenetId,
              },
            });
          }}
        />
  </ActionButtonGroup>
  <br />
  <div>Rename Goes Here</div>
  </>
}
