import React from "../../_snowpack/pkg/react.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {
  useRecoilValue,
  atom,
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import DoenetViewer from "./AssignmentViewer.js";
import {
  itemHistoryAtom
} from "../ToolHandlers/CourseToolHandler.js";
const contentIdAtom = atom({
  key: "contentIdAtom",
  default: null
});
export default function Content(props) {
  const paramDoenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const paramContentId = useRecoilValue(searchParamAtomFamily("cid"));
  const paramVariantIndex = useRecoilValue(searchParamAtomFamily("variantIndex"));
  const paramVariantName = useRecoilValue(searchParamAtomFamily("variantName"));
  const recoilContentId = useRecoilValue(contentIdAtom);
  const loadRecoilContentId = useRecoilCallback(({set, snapshot}) => async ({doenetId: doenetId2, assignment = false}) => {
    const versionHistory = await snapshot.getPromise(itemHistoryAtom(doenetId2));
    let cid2 = null;
    if (assignment) {
      for (let named of versionHistory.named) {
        if (named.isAssigned === "1") {
          cid2 = named.cid;
          break;
        }
      }
    } else {
      for (let named of versionHistory.named) {
        if (named.isReleased === "1") {
          cid2 = named.cid;
          break;
        }
      }
    }
    set(contentIdAtom, cid2);
  });
  let cid = null;
  if (paramContentId) {
    cid = paramContentId;
  }
  let doenetId = null;
  if (paramDoenetId) {
    doenetId = paramDoenetId;
  }
  if (paramDoenetId && !cid && !recoilContentId) {
    loadRecoilContentId({doenetId});
    return /* @__PURE__ */ React.createElement("div", {
      style: props.style
    });
  }
  if (recoilContentId && !cid) {
    cid = recoilContentId;
  }
  let requestedVariant = {index: 1};
  if (paramVariantIndex) {
    requestedVariant = {index: paramVariantIndex};
  } else if (paramVariantName) {
    requestedVariant = {name: paramVariantName};
  }
  const solutionDisplayMode = "button";
  const attemptNumber = 1;
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement(DoenetViewer, {
    key: "doenetviewer",
    cid,
    flags: {
      showCorrectness: true,
      readOnly: false,
      solutionDisplayMode,
      showFeedback: true,
      showHints: true,
      allowLoadState: true,
      allowSaveState: true,
      allowLocalState: true,
      allowSaveSubmissions: true,
      allowSaveEvents: true
    },
    attemptNumber,
    doenetId,
    requestedVariant
  }));
}
