import React from 'react';
import { useToast } from '@Toast';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';

export default function EnrollStudents(props){
  const [toast, toastType] = useToast();
  
  return <div style={props.style}>
  <Button width="menu" onClick={()=>toast('Stub Enroll!', toastType.SUCCESS)} value="Go to Enrollment">Go to Enrollment</Button>
  </div>
}