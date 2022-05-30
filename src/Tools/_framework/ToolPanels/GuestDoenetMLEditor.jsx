import React, { useRef } from 'react';
import { textEditorDoenetMLAtom, updateTextEditorDoenetMLAtom } from '../ToolPanels/EditorViewer'
import {
  useRecoilValue,
  // useRecoilState,
  useSetRecoilState,
  // atom,
} from 'recoil';

import CodeMirror from '../CodeMirror';


export default function GuestDoenetMLEditor(props) {
  // console.log(">>>===BuestDoenetMLEditor")

  // const [editorDoenetML,setEditorDoenetML] = useRecoilState(textEditorDoenetMLAtom);
  const setEditorDoenetML = useSetRecoilState(textEditorDoenetMLAtom);
  const updateInternalValue = useRecoilValue(updateTextEditorDoenetMLAtom);

  let editorRef = useRef(null);

  // console.log(`>>>Show CodeMirror with value -${updateInternalValue}-`)

  return <div><CodeMirror
    key="codemirror"
    editorRef={editorRef}
    setInternalValue={updateInternalValue}
    // value={editorDoenetML} 
    onBeforeChange={(value) => {
      setEditorDoenetML(value);
    }}
  />
  </div>
}