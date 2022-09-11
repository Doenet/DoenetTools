import React from "../../_snowpack/pkg/react.js";
import copyToClipboard from "../../_snowpack/pkg/copy-to-clipboard.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {toastType, useToast} from "../Toast.js";
import {viewerDoenetMLAtom} from "../ToolPanels/EditorViewer.js";
import axios from "../../_snowpack/pkg/axios.js";
import {courseIdAtom} from "../../_reactComponents/Course/CourseActions.js";
export default function PageLink() {
  const addToast = useToast();
  const pageId = useRecoilValue(searchParamAtomFamily("pageId"));
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const courseId = useRecoilValue(courseIdAtom);
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
  async function savePageDoenetMLAndCopyLink() {
    let params = {
      doenetML: viewerDoenetML,
      pageId,
      courseId,
      saveAsCid: true
    };
    const {data} = await axios.post("/api/saveDoenetML.php", params);
    if (!data.success) {
      console.error(data.message);
      addToast(data.message, toastType.ERROR);
      return;
    }
    let pageCid = data.cid;
    let linkText = `<copy uri="doenet:doenetId=${doenetId}&pageId=${pageId}&cid=${pageCid}" />`;
    copyToClipboard(linkText);
    addToast("Link copied to clipboard!", toastType.SUCCESS);
  }
  return /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    "data-test": "Copy Page Link",
    value: "Copy Page Link",
    onClick: savePageDoenetMLAndCopyLink
  });
}
