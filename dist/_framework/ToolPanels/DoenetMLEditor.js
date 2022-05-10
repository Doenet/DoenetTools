import React, {useRef, useEffect} from "../../_snowpack/pkg/react.js";
import {editorPageIdInitAtom, textEditorDoenetMLAtom, updateTextEditorDoenetMLAtom} from "./EditorViewer.js";
import {
  atom,
  useRecoilValue,
  useSetRecoilState,
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import CodeMirror from "../CodeMirror.js";
import axios from "../../_snowpack/pkg/axios.js";
import {fileByDoenetId} from "../ToolHandlers/CourseToolHandler.js";
export default function DoenetMLEditor(props) {
  console.log(">>>===DoenetMLEditor");
  const setEditorDoenetML = useSetRecoilState(textEditorDoenetMLAtom);
  const updateInternalValue = useRecoilValue(updateTextEditorDoenetMLAtom);
  const paramPageId = useRecoilValue(searchParamAtomFamily("pageId"));
  const paramCourseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const initializedPageId = useRecoilValue(editorPageIdInitAtom);
  let editorRef = useRef(null);
  let timeout = useRef(null);
  const saveDraft = useRecoilCallback(({snapshot, set}) => async (pageId, courseId) => {
    const doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
    try {
      const {data} = await axios.post("/api/saveDoenetML.php", {doenetML, pageId, courseId});
      set(fileByDoenetId(pageId), doenetML);
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
        saveDraft(initializedPageId, paramCourseId);
        if (timeout.current !== null) {
          clearTimeout(timeout.current);
        }
        timeout.current = null;
      }
    };
  }, [initializedPageId, saveDraft]);
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
        saveDraft(initializedPageId, paramCourseId);
        timeout.current = null;
      }, 3e3);
    }
  }));
}
