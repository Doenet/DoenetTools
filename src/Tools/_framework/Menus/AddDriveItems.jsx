import React from 'react';
import { useToast } from '@Toast';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';


export default function AddDriveItems(props){
  const [toast, toastType] = useToast();
  
  return <div style={props.style}>
  <div><Button width="menu" onClick={()=>toast('Stub Add Folder!', toastType.SUCCESS)} value="Add Folder">Add Folder</Button></div>
  <div><Button width="menu" onClick={()=>toast('Stub Add Assignment!', toastType.SUCCESS)} value="Add Assignment">Add Assignment</Button></div>
  <div> <Button width="menu" onClick={()=>toast('Stub Add DoenetML!', toastType.SUCCESS)} value="Add DoenetML">Add DoenetML</Button></div>
  </div>
}