// import { ButtonGroup } from '@blueprintjs/core';
import React from 'react';
import { useRecoilValue } from 'recoil';
// import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { searchParamAtomFamily } from '../NewToolRoot';
// import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import { copiedCourseItems, cutCourseItems, useCourse } from '../../../_reactComponents/Course/CourseActions';
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
import { useToast, toastType } from '../Toast';

export default function PasteOptionsMenu() {
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const { pasteItems } = useCourse(courseId);
  const addToast = useToast();
  let cutObjs = useRecoilValue(cutCourseItems);
  let copiedObjs = useRecoilValue(copiedCourseItems);

  if (cutObjs.length == 0 && copiedObjs.length == 0){
    return <div>No Items To Paste</div>
  }

  return (
 <>
    <ActionButton
      width="menu"
      value="Paste"
        onClick={() => {
          pasteItems({
            successCallback:()=>{
              addToast("Items Pasted!", toastType.INFO);
            },
            failureCallback:(message)=>{
              addToast(message, toastType.INFO);
            },
         })
        }}
    />
   
 </>
  );
}
