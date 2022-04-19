import React, { useRef, useEffect } from 'react';
import { editorDoenetIdInitAtom, textEditorDoenetMLAtom, updateTextEditorDoenetMLAtom } from '../ToolPanels/EditorViewer'
import {
  atom,
  useRecoilValue,
  // useRecoilState,
  useSetRecoilState,
  // atom,
  useRecoilCallback,
} from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';

import CodeMirror from '../CodeMirror';
import axios from "axios";
import { fileByDoenetId } from '../ToolHandlers/CourseToolHandler';



export default function DoenetMLEditor(props) {
  console.log(">>>===DoenetMLEditor")

  // const [editorDoenetML,setEditorDoenetML] = useRecoilState(textEditorDoenetMLAtom);
  const setEditorDoenetML = useSetRecoilState(textEditorDoenetMLAtom);
  const updateInternalValue = useRecoilValue(updateTextEditorDoenetMLAtom);

  const paramDoenetId = useRecoilValue(searchParamAtomFamily('doenetId'))
  const paramCourseId = useRecoilValue(searchParamAtomFamily('courseId'))
  const initializedDoenetId = useRecoilValue(editorDoenetIdInitAtom);
  let editorRef = useRef(null);
  let timeout = useRef(null);

  const saveDraft = useRecoilCallback(({ snapshot, set }) => async (doenetId, courseId) => {
    const doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);

    //Save in localStorage
    // localStorage.setItem(cid,doenetML)

    try {
      const { data } = await axios.post("/api/saveDoenetML.php", { doenetML, doenetId, courseId })
      set(fileByDoenetId(doenetId),doenetML);
      if (!data.success) {
        //TODO: Toast here
        console.log("ERROR", data.message)
      }
    } catch (error) {
      console.log("ERROR", error)
    }

  }, []);


  useEffect(() => {

    return () => {

      if (initializedDoenetId !== "") {
        // save and stop timers
        saveDraft(initializedDoenetId, paramCourseId) //Always save on leave
        if (timeout.current !== null) {
          clearTimeout(timeout.current)
        }
        timeout.current = null;

      }
    }
  }, [initializedDoenetId, saveDraft])

  if (paramDoenetId !== initializedDoenetId) {
    //DoenetML is changing to another DoenetID
    return null;
  }

  // console.log(`>>>Show CodeMirror with value -${updateInternalValue}-`)

  return <div><CodeMirror
    key="codemirror"
    editorRef={editorRef}
    setInternalValue={updateInternalValue}
    // value={editorDoenetML} 
    onBeforeChange={(value) => {
      setEditorDoenetML(value);
      // Debounce save to server at 3 seconds
      clearTimeout(timeout.current);

      timeout.current = setTimeout(function () {
        saveDraft(initializedDoenetId, paramCourseId);
        timeout.current = null;
      }, 3000)//3 seconds
    }}
  />
  </div>
}