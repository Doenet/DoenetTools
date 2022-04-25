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

  const paramPageId = useRecoilValue(searchParamAtomFamily('pageId'))
  const paramCourseId = useRecoilValue(searchParamAtomFamily('courseId'))
  const initializedPageId = useRecoilValue(editorDoenetIdInitAtom);
  let editorRef = useRef(null);
  let timeout = useRef(null);

  const saveDraft = useRecoilCallback(({ snapshot, set }) => async (pageId, courseId) => {
    const doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);

    //Save in localStorage
    // localStorage.setItem(cid,doenetML)

    try {
      const { data } = await axios.post("/api/saveDoenetML.php", { doenetML, doenetId: pageId, courseId })
      set(fileByDoenetId(pageId),doenetML);
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

      if (initializedPageId !== "") {
        // save and stop timers
        saveDraft(initializedPageId, paramCourseId) //Always save on leave
        if (timeout.current !== null) {
          clearTimeout(timeout.current)
        }
        timeout.current = null;

      }
    }
  }, [initializedPageId, saveDraft])

  if (paramPageId !== initializedPageId) {
    //DoenetML is changing to another PageId
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
        saveDraft(initializedPageId, paramCourseId);
        timeout.current = null;
      }, 3000)//3 seconds
    }}
  />
  </div>
}