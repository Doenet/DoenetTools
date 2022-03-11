import React, { useRef, useEffect } from 'react';
import { editorDoenetIdInitAtom, textEditorDoenetMLAtom, updateTextEditorDoenetMLAtom } from '../ToolPanels/EditorViewer'
import { 
  atom,
  useRecoilValue, 
  // useRecoilState,
  useSetRecoilState,
  // atom,
} from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';

import CodeMirror from '../CodeMirror';

export const editorSaveTimestamp = atom({
  key:"",
  default:null
})




export default function GuestDoenetMLEditor(props){
  console.log(">>>===GuestDoenetMLEditor")

  // const [editorDoenetML,setEditorDoenetML] = useRecoilState(textEditorDoenetMLAtom);
  const setEditorDoenetML = useSetRecoilState(textEditorDoenetMLAtom);
  const updateInternalValue = useRecoilValue(updateTextEditorDoenetMLAtom);

  const paramDoenetId = useRecoilValue(searchParamAtomFamily('doenetId')) 
  const initilizedDoenetId = useRecoilValue(editorDoenetIdInitAtom);
  let editorRef = useRef(null);


  if (paramDoenetId !== initilizedDoenetId){
    //DoenetML is changing to another DoenetID
    return null;
  }
  
  // console.log(`>>>Show CodeMirror with value -${updateInternalValue}-`)

  return  <div><CodeMirror
    key = "codemirror"
      editorRef = {editorRef}
      setInternalValue = {updateInternalValue}
      // value={editorDoenetML} 
      onBeforeChange={(value) => {
        // if (isCurrentDraft) { //READ ONLY SHOULD STOP TIMERS
          setEditorDoenetML(value);

        // }
      }}
    />
    </div>
}