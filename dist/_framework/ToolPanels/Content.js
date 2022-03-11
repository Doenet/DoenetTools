import React, {useState} from "../../_snowpack/pkg/react.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {
  useRecoilValue,
  atom,
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import DoenetViewer from "../../viewer/DoenetViewer.js";
import {
  itemHistoryAtom
} from "../ToolHandlers/CourseToolHandler.js";
import axios from "../../_snowpack/pkg/axios.js";
const contentIdAtom = atom({
  key: "contentIdAtom",
  default: null
});
export default function Content(props) {
  const paramDoenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const paramContentId = useRecoilValue(searchParamAtomFamily("contentId"));
  const paramVariantIndex = useRecoilValue(searchParamAtomFamily("variantIndex"));
  const paramVariantName = useRecoilValue(searchParamAtomFamily("variantName"));
  const recoilContentId = useRecoilValue(contentIdAtom);
  const [doenetML, setDoenetML] = useState(null);
  const loadRecoilContentId = useRecoilCallback(({set, snapshot}) => async ({doenetId: doenetId2, assignment = false}) => {
    const versionHistory = await snapshot.getPromise(itemHistoryAtom(doenetId2));
    let contentId2 = null;
    if (assignment) {
      for (let named of versionHistory.named) {
        if (named.isAssigned === "1") {
          contentId2 = named.contentId;
          break;
        }
      }
    } else {
      for (let named of versionHistory.named) {
        if (named.isReleased === "1") {
          contentId2 = named.contentId;
          break;
        }
      }
    }
    let resp = await axios.get(`/media/${contentId2}.doenet`);
    setDoenetML(resp.data);
    set(contentIdAtom, contentId2);
  });
  let contentId = null;
  if (paramContentId) {
    contentId = paramContentId;
  }
  let doenetId = null;
  if (paramDoenetId) {
    doenetId = paramDoenetId;
  }
  if (paramDoenetId && !contentId && !recoilContentId) {
    loadRecoilContentId({doenetId});
    return /* @__PURE__ */ React.createElement("div", {
      style: props.style
    });
  }
  if (recoilContentId && !contentId) {
    contentId = recoilContentId;
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
    doenetML,
    flags: {
      showCorrectness: true,
      readOnly: false,
      solutionDisplayMode,
      showFeedback: true,
      showHints: true
    },
    attemptNumber,
    doenetId,
    allowLoadPageState: false,
    allowSavePageState: false,
    allowLocalPageState: false,
    allowSaveSubmissions: false,
    allowSaveEvents: false,
    requestedVariant
  }));
}
