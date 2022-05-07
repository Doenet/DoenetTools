import React, { useRef, useEffect } from 'react';
import { 
  editorPageIdInitAtom, 
  textEditorDoenetMLAtom, 
  updateTextEditorDoenetMLAtom, 
  editorViewerErrorStateAtom,
  refreshNumberAtom,
  viewerDoenetMLAtom
} from '../ToolPanels/EditorViewer'
import { 
  useRecoilValue, 
  useRecoilState,
  useRecoilCallback,
} from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
import CodeMirror from '../CodeMirror';
import axios from "axios";
import { fileByDoenetId } from '../ToolHandlers/CourseToolHandler';
import { DropTarget } from 'react-drag-drop-container';
import { courseIdAtom } from '../../../_reactComponents/Course/CourseActions';



export default function DoenetMLEditor(props) {
  console.log(">>>===DoenetMLEditor")

  const [editorDoenetML,setEditorDoenetML] = useRecoilState(textEditorDoenetMLAtom);
  const [updateInternalValue,setUpdateInternalValue] = useRecoilState(updateTextEditorDoenetMLAtom);
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom)

  const paramPageId = useRecoilValue(searchParamAtomFamily('pageId'))
  const courseId = useRecoilValue(courseIdAtom)
  
  const initializedPageId = useRecoilValue(editorPageIdInitAtom);
  let editorRef = useRef(null);
  let timeout = useRef(null);

  const updateViewer = useRecoilCallback(({snapshot, set}) => 
    async ()=>{
      const textEditorDoenetML = await snapshot.getPromise(textEditorDoenetMLAtom)
      const isErrorState = await snapshot.getPromise(editorViewerErrorStateAtom)
      if (isErrorState) set(refreshNumberAtom,(was)=>was+1)
      set(viewerDoenetMLAtom, textEditorDoenetML)
    }
  )

  const pasteToEditor = e => {
    setEditorDoenetML(editorDoenetML + "\n" + e.dragData)
    setUpdateInternalValue(editorDoenetML + "\n" + e.dragData)
    updateViewer()
  }

  const saveDraft = useRecoilCallback(({ snapshot, set }) => async (pageId, courseId) => {
    const doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);

    //Save in localStorage
    // localStorage.setItem(cid,doenetML)

    try {
      const { data } = await axios.post("/api/saveDoenetML.php", { doenetML, pageId, courseId })
      set(fileByDoenetId(pageId),doenetML);
      if (!data.success) {
        //TODO: Toast here
        console.log("ERROR", data.message)
      }
    } catch (error) {
      console.log("ERROR", error)
    }

  }, []);

  // save draft when leave page
  useEffect(() => {
    return () => {
      if (initializedPageId !== "") {
        // save and stop timers
        saveDraft(initializedPageId, courseId)
        if (timeout.current !== null) {
          clearTimeout(timeout.current)
        }
        timeout.current = null;
      }
    }
  }, [initializedPageId, saveDraft, courseId])

  // save draft when click the update button
  useEffect(() => {
    if (initializedPageId !== "") {
      // save and stop timers
      saveDraft(initializedPageId, courseId)
      if (timeout.current !== null) {
        clearTimeout(timeout.current)
      }
      timeout.current = null;
    }
  }, [viewerDoenetML])


  if (paramPageId !== initializedPageId) {
    //DoenetML is changing to another PageId
    return null;
  }

  // console.log(`>>>Show CodeMirror with value -${updateInternalValue}-`)

  return (
    <DropTarget targetKey="doenetML-editor" onHit={ pasteToEditor }>
      <CodeMirror
        key="codemirror"
        editorRef={editorRef}
        setInternalValue={updateInternalValue}
        // value={editorDoenetML} 
        onBeforeChange={(value) => {
          setEditorDoenetML(value);
          // Debounce save to server at 3 seconds
          clearTimeout(timeout.current);

          timeout.current = setTimeout(function () {
            saveDraft(initializedPageId, courseId);
            timeout.current = null;
          }, 3000)//3 seconds
        }}
      />
    </DropTarget>
  )
}