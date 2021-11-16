import React from 'react';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';

import { 
  textEditorDoenetMLAtom, 
  viewerDoenetMLAtom,
  refreshNumberAtom,
  editorViewerErrorStateAtom,

} from '../ToolPanels/EditorViewer'
import { 
  useRecoilCallback
} from 'recoil';



export default function ViewerUpdateButton(props){

  const updateViewer = useRecoilCallback(({snapshot,set})=> async ()=>{
    const textEditorDoenetML = await snapshot.getPromise(textEditorDoenetMLAtom)
    const isErrorState = await snapshot.getPromise(editorViewerErrorStateAtom)
    
    if (isErrorState){
      set(refreshNumberAtom,(was)=>was+1);
    }

    set(viewerDoenetMLAtom,textEditorDoenetML)
  })


  return <div style={props.style}>
    <Button value='Update' onClick={updateViewer} />
  </div>
}