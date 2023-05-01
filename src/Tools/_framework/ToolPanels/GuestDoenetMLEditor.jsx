import React, { useRef } from "react";
import {
  useRecoilValue,
  // useRecoilState,
  useSetRecoilState,
  // atom,
} from "recoil";
import {
  textEditorDoenetMLAtom,
  updateTextEditorDoenetMLAtom,
} from "../../../_sharedRecoil/EditorViewerRecoil";

import CodeMirror from "../CodeMirror";

export default function GuestDoenetMLEditor(props) {
  // console.log(">>>===BuestDoenetMLEditor")

  // const [editorDoenetML,setEditorDoenetML] = useRecoilState(textEditorDoenetMLAtom);
  const setEditorDoenetML = useSetRecoilState(textEditorDoenetMLAtom);
  const updateInternalValue = useRecoilValue(updateTextEditorDoenetMLAtom);

  let editorRef = useRef(null);

  // console.log(`>>>Show CodeMirror with value -${updateInternalValue}-`)

  return (
    <div>
      <CodeMirror
        key="codemirror"
        editorRef={editorRef}
        setInternalValueTo={updateInternalValue}
        // value={editorDoenetML}
        onBeforeChange={(value) => {
          setEditorDoenetML(value);
        }}
      />
    </div>
  );
}
