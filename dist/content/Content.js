import React, {useState, useEffect} from "../_snowpack/pkg/react.js";
import Tool from "../_framework/Tool.js";
import DoenetViewer from "../viewer/DoenetViewer.js";
import {
  useRecoilValue,
  useRecoilCallback,
  atom
} from "../_snowpack/pkg/recoil.js";
import {fileByContentId} from "../_framework/Overlays/Editor.js";
const contentDoenetMLAtom = atom({
  key: "contentDoenetMLAtom",
  default: {updateNumber: 0, doenetML: ""}
});
export default function Content(props) {
  console.log("props", props);
  let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
  let newParams = {...urlParamsObj};
  let initDoenetML = useRecoilCallback(({snapshot, set}) => async (contentId) => {
    const response = await snapshot.getPromise(fileByContentId(contentId));
    const doenetML = response.data;
    const viewerObj = await snapshot.getPromise(contentDoenetMLAtom);
    const updateNumber2 = viewerObj.updateNumber + 1;
    set(contentDoenetMLAtom, {updateNumber: updateNumber2, doenetML});
  });
  useEffect(() => {
    initDoenetML(newParams.contentId);
  }, []);
  const viewerDoenetML = useRecoilValue(contentDoenetMLAtom);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [updateNumber, setUpdateNumber] = useState(1);
  const showCorrectness = true;
  const readOnly = false;
  const solutionDisplayMode = "button";
  const showFeedback = true;
  const showHints = true;
  const ignoreDatabase = true;
  const requestedVariant = {index: 1};
  return /* @__PURE__ */ React.createElement(Tool, null, /* @__PURE__ */ React.createElement("headerPanel", {
    title: "Content"
  }), /* @__PURE__ */ React.createElement("mainPanel", null, /* @__PURE__ */ React.createElement("p", null, "DoenetViewer"), newParams.contentId ? /* @__PURE__ */ React.createElement(DoenetViewer, {
    key: "doenetviewer" + viewerDoenetML?.updateNumber,
    doenetML: viewerDoenetML?.doenetML,
    flags: {
      showCorrectness,
      readOnly,
      solutionDisplayMode,
      showFeedback,
      showHints
    },
    attemptNumber,
    ignoreDatabase,
    requestedVariant
  }) : /* @__PURE__ */ React.createElement("p", null, "Need a contentId to display content...!")));
}
