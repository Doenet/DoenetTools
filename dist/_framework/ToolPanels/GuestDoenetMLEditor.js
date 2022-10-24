import React, {useRef} from "../../_snowpack/pkg/react.js";
import {
  useRecoilValue,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {textEditorDoenetMLAtom, updateTextEditorDoenetMLAtom} from "../../_sharedRecoil/EditorViewerRecoil.js";
import CodeMirror from "../CodeMirror.js";
export default function GuestDoenetMLEditor(props) {
  const setEditorDoenetML = useSetRecoilState(textEditorDoenetMLAtom);
  const updateInternalValue = useRecoilValue(updateTextEditorDoenetMLAtom);
  let editorRef = useRef(null);
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(CodeMirror, {
    key: "codemirror",
    editorRef,
    setInternalValue: updateInternalValue,
    onBeforeChange: (value) => {
      setEditorDoenetML(value);
    }
  }));
}
