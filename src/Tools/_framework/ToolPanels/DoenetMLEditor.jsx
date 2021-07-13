import React from 'react';
import { editorDoenetIdInitAtom, textEditorDoenetMLAtom } from '../ToolPanels/EditorViewer'
import { 
  useRecoilValue, 
  // atom,
  // useRecoilCallback,
} from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';


export default function DoenetMLEditor(props){
  console.log(">>>===DoenetMLEditor")
  const doenetML = useRecoilValue(textEditorDoenetMLAtom);
  const paramDoenetId = useRecoilValue(searchParamAtomFamily('doenetId')) 
  const initilizedDoenetId = useRecoilValue(editorDoenetIdInitAtom);

  console.log(">>>initilizedDoenetId",initilizedDoenetId)
  console.log(">>>doenetML",doenetML)

  if (paramDoenetId !== initilizedDoenetId){
    console.log(">>>NOT EQUAL")
    return <div style={props.style}></div>
  }
  
  return <div style={props.style}><h1>DoenetMLEditor</h1>
  <p>initilizedDoenetId</p>
  <p>{initilizedDoenetId}</p>
  </div>
}