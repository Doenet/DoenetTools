import React, {useRef, useEffect} from "../../_snowpack/pkg/react.js";
import {editorDoenetIdInitAtom, textEditorDoenetMLAtom, updateTextEditorDoenetMLAtom} from "./EditorViewer.js";
import {
  atom,
  useRecoilValue,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import CodeMirror from "../CodeMirror.js";
export const editorSaveTimestamp = atom({
  key: "",
  default: null
});
export default function GuestDoenetMLEditor(props) {
  console.log(">>>===GuestDoenetMLEditor");
  const setEditorDoenetML = useSetRecoilState(textEditorDoenetMLAtom);
  const updateInternalValue = useRecoilValue(updateTextEditorDoenetMLAtom);
  const paramDoenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const initilizedDoenetId = useRecoilValue(editorDoenetIdInitAtom);
  let editorRef = useRef(null);
  if (paramDoenetId !== initilizedDoenetId) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(CodeMirror, {
    key: "codemirror",
    editorRef,
    setInternalValue: updateInternalValue,
    onBeforeChange: (value) => {
      setEditorDoenetML(value);
    }
  }));
}
