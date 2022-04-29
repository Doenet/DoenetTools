import {
  faFileExport,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import Increment from '../../../_reactComponents/PanelHeaderComponents/IncrementMenu';
import Checkbox from '../../../_reactComponents/PanelHeaderComponents/Checkbox';
import { useRecoilValue } from 'recoil';
import { authorItemByDoenetId, selectedCourseItems, useCourse } from '../../../_reactComponents/Course/CourseActions';
import { searchParamAtomFamily } from '../NewToolRoot';
import DropdownMenu from '../../../_reactComponents/PanelHeaderComponents/DropdownMenu';
import styled from 'styled-components';

const CheckboxLabelText = styled.span`
  font-size: 15px;
  line-height: 1.1
`

export default function SelectedOrder() {
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const itemObj = useRecoilValue(authorItemByDoenetId(doenetId));
  const parentItemObj = useRecoilValue(authorItemByDoenetId(itemObj.parentDoenetId));
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'))
  const [behavior,setBehavior] = useState(itemObj.behavior);
  const [numberToSelect,setNumberToSelect] = useState(itemObj.numberToSelect);
  const [withReplacement,setWithReplacement] = useState(itemObj.withReplacement);
  let { create, updateOrderBehavior, deleteItem } = useCourse(courseId);
  // console.log("parentItemObj",parentItemObj)
  //Can't delete top order
  let deleteDisabled = false;
  if (parentItemObj.type == 'activity'){
    deleteDisabled = true;
  }

  useEffect(()=>{
    if (itemObj.behavior != behavior){
      setBehavior(itemObj.behavior)
    }
    if (itemObj.numberToSelect != numberToSelect){
      setNumberToSelect(itemObj.numberToSelect)
    }
    if (itemObj.withReplacement != withReplacement){
      setWithReplacement(itemObj.withReplacement)
    }
  },[itemObj.doenetId])


  let heading = (<h2 data-cy="infoPanelItemLabel" style={{ margin: "16px 5px" }} >
  <FontAwesomeIcon icon={faFileExport} /> {itemObj.label} 
</h2>)

let items = [
  ['sequence', 'sequence'],
  ['shuffle', 'shuffle'],
  ['select', 'select'],
  // ['deepshuffle', 'deep shuffle'],
  // ['showuntil100', 'show until 100%'],
  // ['adaptive', 'adaptive'],
  // ['select from collection','select from collection'],
  // ['previousrequirements', 'previous requirements'],
];

let defaultIndex = 0;
for (let [i, item] of Object.entries(items)) {
  if (item[0] === behavior) {
    defaultIndex = Number(i) + 1;
    break;
  }
}
// console.log("behavior",behavior)
// console.log("defaultIndex",defaultIndex)
let selectionJSX = null;

if (behavior == 'select'){
  selectionJSX = <>
   <Increment min={0} label='Number to select' vertical value={numberToSelect} onChange={(value)=>{
     let number = Number(value);
     if (isNaN(value)){ number = 0}
     setNumberToSelect(number)
     updateOrderBehavior({doenetId, behavior, numberToSelect:number, withReplacement})
   }}/>
   <Checkbox
              style={{ marginRight: '5px' }}
              checked={withReplacement}
              onClick={(e) => {
                setWithReplacement((prev)=>!prev);
                updateOrderBehavior({doenetId, behavior, numberToSelect, withReplacement:!withReplacement})
              }}
            />
    <CheckboxLabelText>with replacement</CheckboxLabelText>
  <br />
  <br />
  </>
}



  return <>
  {heading}
  <DropdownMenu
        width="menu"
        items={items}
        // title="Order"
        defaultIndex={defaultIndex}
        onChange={({ value }) => {
          setBehavior(value);
          updateOrderBehavior({doenetId, behavior:value, numberToSelect, withReplacement})
        }}
      />
  <br />
  {selectionJSX}
  <ButtonGroup vertical>
      <Button
        width="menu"
        onClick={() =>
          create({itemType:"page"})
        }
        value="Add Page"
      />
        <Button
          width="menu"
          onClick={() =>
            create({itemType:"order"})
          }
          value="Add Order"
        />
    </ButtonGroup>
    <br />
    <Button
      width="menu"
      value="Delete Order"
      alert
      disabled={deleteDisabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      
        deleteItem({doenetId});
      }}
    />
  </>;
}

