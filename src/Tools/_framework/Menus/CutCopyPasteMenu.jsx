// import { ButtonGroup } from '@blueprintjs/core';
import React from 'react';
import { useRecoilValue } from 'recoil';
// import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { searchParamAtomFamily } from '../NewToolRoot';
// import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import { itemByDoenetId, copiedCourseItems, cutCourseItems, selectedCourseItems, useCourse } from '../../../_reactComponents/Course/CourseActions';
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
import { useToast, toastType } from '@Toast';
import ActionButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ActionButtonGroup';

export default function CutCopyPasteMenu() {
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const { copyItems, cutItems, pasteItems } = useCourse(courseId);
  const addToast = useToast();
  let cutObjs = useRecoilValue(cutCourseItems);
  let copiedObjs = useRecoilValue(copiedCourseItems);
  let selectedItems = useRecoilValue(selectedCourseItems);
  // let firstSelectedDoenetId = selectedItems[0]
  // let firstSelectedItemObj = useRecoilValue(itemByDoenetId(firstSelectedDoenetId))

  let canCopy = true;
  let canCut = true;
  let canPaste = true;

  // console.log("selectedItems",selectedItems)
  // console.log("firstSelectedItemObj",firstSelectedItemObj)

  if (cutObjs.length == 0 && copiedObjs.length == 0){
    canPaste = false;
  }
  // if (selectedItems.length != 1 || firstSelectedItemObj?.type == 'order'){
  //   canCopy = false;
  //   canCut = false;
  // }
  if (selectedItems.length == 0 ){
    canCopy = false;
    canCut = false;
  }

  let copyJSX = <ActionButton
  width="menu"
  value="Copy"
  disabled={!canCopy}
    onClick={() => {
      copyItems({
        successCallback:()=>{
          // addToast("Items Copied!", toastType.INFO);
        },
        failureCallback:(message)=>{
          addToast(message, toastType.INFO);
        },
     })
    }}
/>

let cutJSX = <ActionButton
width="menu"
value="Cut"
disabled={!canCut}
  onClick={() => {
    cutItems({
      successCallback:()=>{
        // addToast("Items Cut!", toastType.INFO);
      },
      failureCallback:(message)=>{
        addToast(message, toastType.INFO);
      },
   })
  }}
/>

let pasteJSX = <ActionButton
width="menu"
value="Paste"
disabled={!canPaste}
  onClick={() => {
    pasteItems({
      successCallback:()=>{
        // addToast("Items Pasted!", toastType.INFO);
      },
      failureCallback:(message)=>{
        addToast(message, toastType.INFO);
      },
   })
  }}
/>



  return (
 <>
 <ActionButtonGroup width="menu">
    {/* {copyJSX} */}
    {cutJSX}
    {pasteJSX}
 </ActionButtonGroup>
 </>
  );
}
