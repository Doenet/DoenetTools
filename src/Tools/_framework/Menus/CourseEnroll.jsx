import React from 'react';
import { useToast } from '@Toast';
import Button from '../temp/Button';

export default function CourseEnroll(props){
  const [toast, toastType] = useToast();

  
  return <div style={props.style}>
    <div>Enter Enrollment code</div>
  {/* <Button onClick={()=>toast('Stub Enrolled in Course!', toastType.SUCCESS)} value="Enroll" /> */}
  <button onClick={()=>toast('Stub Enrolled in Course!', toastType.SUCCESS)}>Enroll</button>
 
  </div>
}