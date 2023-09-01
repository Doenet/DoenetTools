import React, {useRef, useEffect} from "../../_snowpack/pkg/react.js";
import {
  useRecoilValue,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import CodeMirror from "../CodeMirror.js";
import {courseIdAtom} from "../../_reactComponents/Course/CourseActions.js";
import {useSaveDraft} from "../../_utils/hooks/useSaveDraft.js";
import {editorPageIdInitAtom, textEditorDoenetMLAtom, updateTextEditorDoenetMLAtom, viewerDoenetMLAtom} from "../../_sharedRecoil/EditorViewerRecoil.js";
export default function DoenetMLEditor() {
  const setEditorDoenetML = useSetRecoilState(textEditorDoenetMLAtom);
  const updateInternalValue = useRecoilValue(updateTextEditorDoenetMLAtom);
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
  const paramPageId = useRecoilValue(searchParamAtomFamily("pageId"));
  const paramlinkPageId = useRecoilValue(searchParamAtomFamily("linkPageId"));
  let effectivePageId = paramPageId;
  let readOnly = false;
  if (paramlinkPageId) {
    readOnly = true;
    effectivePageId = paramlinkPageId;
  }
  const courseId = useRecoilValue(courseIdAtom);
  const initializedPageId = useRecoilValue(editorPageIdInitAtom);
  let editorRef = useRef(null);
  let timeout = useRef(null);
  let backupOldDraft = useRef(true);
  const {saveDraft} = useSaveDraft();
  useEffect(() => {
    return () => {
      if (initializedPageId !== "") {
        saveDraft({pageId: initializedPageId, courseId, backup: backupOldDraft.current});
        if (timeout.current !== null) {
          clearTimeout(timeout.current);
        }
        timeout.current = null;
      }
    };
  }, [initializedPageId, saveDraft, courseId]);
  useEffect(() => {
    if (initializedPageId !== "") {
      saveDraft({pageId: initializedPageId, courseId, backup: backupOldDraft.current}).then(({success}) => {
        if (success) {
          backupOldDraft.current = false;
        }
      });
      if (timeout.current !== null) {
        clearTimeout(timeout.current);
      }
      timeout.current = null;
    }
  }, [viewerDoenetML]);
  if (effectivePageId !== initializedPageId) {
    backupOldDraft.current = true;
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(CodeMirror, {
    key: "codemirror",
    readOnly,
    editorRef,
    setInternalValue: updateInternalValue,
    onBeforeChange: (value) => {
      setEditorDoenetML(value);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(function() {
        saveDraft({pageId: initializedPageId, courseId, backup: backupOldDraft.current}).then(({success}) => {
          if (success) {
            backupOldDraft.current = false;
          }
        });
        timeout.current = null;
      }, 3e3);
    }
  }));
}
