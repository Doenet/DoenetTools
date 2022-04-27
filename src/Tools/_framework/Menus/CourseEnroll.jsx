import React from 'react';
import { useToast, toastType } from '../Toast';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';


export default function CourseEnroll(props){
  const toast = useToast();

  
  return <div style={props.style}>
    <div>Enter Enrollment code</div>
  {/* <Button width="menu" onClick={()=>toast('Stub Enrolled in Course!', toastType.SUCCESS)} value="Enroll">Enroll</Button> */}
  <ButtonGroup vertical>
      <Button onClick={()=>toast('Stub Enrolled in Course!', toastType.SUCCESS)} value="Enroll">Enroll</Button>
  </ButtonGroup>
  
  </div>
}