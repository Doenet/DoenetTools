import React from 'react';
import { useToast } from '@Toast';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';


export default function CourseEnroll(props){
  const [toast, toastType] = useToast();

  
  return <div style={props.style}>
    <div>Enter Enrollment code</div>
  {/* <Button width="menu" onClick={()=>toast('Stub Enrolled in Course!', toastType.SUCCESS)} value="Enroll">Enroll</Button> */}
  <Button onClick={()=>toast('Stub Enrolled in Course!', toastType.SUCCESS)} value="Enroll">Enroll</Button>
 
  </div>
}