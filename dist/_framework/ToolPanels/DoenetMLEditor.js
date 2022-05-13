import React, {useRef, useEffect} from "../../_snowpack/pkg/react.js";
import {editorPageIdInitAtom, textEditorDoenetMLAtom, updateTextEditorDoenetMLAtom, viewerDoenetMLAtom} from "./EditorViewer.js";
import {
  atom,
  useRecoilValue,
  useSetRecoilState,
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import CodeMirror from "../CodeMirror.js";
import axios from "../../_snowpack/pkg/axios.js";
import {fileByPageId} from "../ToolHandlers/CourseToolHandler.js";
import {courseIdAtom} from "../../_reactComponents/Course/CourseActions.js";
export default function DoenetMLEditor(props) {
  console.log(">>>===DoenetMLEditor");
  const setEditorDoenetML = useSetRecoilState(textEditorDoenetMLAtom);
  const updateInternalValue = useRecoilValue(updateTextEditorDoenetMLAtom);
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
  const paramPageId = useRecoilValue(searchParamAtomFamily("pageId"));
  const courseId = useRecoilValue(courseIdAtom);
  const initializedPageId = useRecoilValue(editorPageIdInitAtom);
  let editorRef = useRef(null);
  let timeout = useRef(null);
  const saveDraft = useRecoilCallback(({snapshot, set}) => async (pageId, courseId2) => {
    const doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
    try {
      const {data} = await axios.post("/api/saveDoenetML.php", {doenetML, pageId, courseId: courseId2});
      set(fileByPageId(pageId), doenetML);
      if (!data.success) {
        console.log("ERROR", data.message);
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  }, []);
  useEffect(() => {
    return () => {
      if (initializedPageId !== "") {
        saveDraft(initializedPageId, courseId);
        if (timeout.current !== null) {
          clearTimeout(timeout.current);
        }
        timeout.current = null;
      }
    };
  }, [initializedPageId, saveDraft, courseId]);
  useEffect(() => {
    if (initializedPageId !== "") {
      saveDraft(initializedPageId, courseId);
      if (timeout.current !== null) {
        clearTimeout(timeout.current);
      }
      timeout.current = null;
    }
  }, [viewerDoenetML]);
  if (paramPageId !== initializedPageId) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(CodeMirror, {
    key: "codemirror",
    editorRef,
    setInternalValue: updateInternalValue,
    onBeforeChange: (value) => {
      setEditorDoenetML(value);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(function() {
        saveDraft(initializedPageId, courseId);
        timeout.current = null;
      }, 3e3);
    }
  }));
}
