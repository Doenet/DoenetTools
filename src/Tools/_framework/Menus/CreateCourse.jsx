import React from 'react';
import { useToast } from '@Toast';
import Button from '../temp/Button';

export default function CreateCourse(props){
  const [toast, toastType] = useToast();

  
  return <div style={props.style}>
  {/* <Button onClick={()=>toast('Stub Created Course!', toastType.SUCCESS)} value="Create New Course" /> */}
  <button onClick={()=>toast('Stub Created Course!', toastType.SUCCESS)} >Create New Course</button>
 
  </div>
}