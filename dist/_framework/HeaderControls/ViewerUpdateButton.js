import React from "../../_snowpack/pkg/react.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {textEditorDoenetMLAtom, viewerDoenetMLAtom} from "../ToolPanels/EditorViewer.js";
import {
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
export default function ViewerUpdateButton(props) {
  const updateViewer = useRecoilCallback(({snapshot, set}) => async () => {
    const textEditorDoenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
    set(viewerDoenetMLAtom, textEditorDoenetML);
  });
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement(Button, {
    value: "Update",
    onClick: updateViewer
  }));
}
