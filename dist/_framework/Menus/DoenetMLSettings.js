import React from "../../_snowpack/pkg/react.js";
import {editorDoenetIdInitAtom} from "../ToolPanels/EditorViewer.js";
import {useToast, toastType} from "../Toast.js";
import {
  useRecoilValue
} from "../../_snowpack/pkg/recoil.js";
import {CopyToClipboard} from "../../_snowpack/pkg/react-copy-to-clipboard.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {
  faExternalLinkAlt
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {
  faClipboard
} from "../../_snowpack/pkg/@fortawesome/free-regular-svg-icons.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
export default function DoenetMLSettings(props) {
  const initilizedDoenetId = useRecoilValue(editorDoenetIdInitAtom);
  const link = `http://${window.location.host}/content/#/?doenetId=${initilizedDoenetId}`;
  const addToast = useToast();
  const paramDoenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  if (paramDoenetId !== initilizedDoenetId) {
    return /* @__PURE__ */ React.createElement("div", {
      style: props.style
    });
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement("div", null, "DonetML Name (soon)"), /* @__PURE__ */ React.createElement("div", null, "Load time (soon) "), /* @__PURE__ */ React.createElement("div", null, "Most recent release "), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(CopyToClipboard, {
    onCopy: () => addToast("Link copied to clipboard!", toastType.SUCCESS),
    text: link
  }, /* @__PURE__ */ React.createElement("button", {
    onClick: () => {
    }
  }, "copy link ", /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faClipboard
  }))), /* @__PURE__ */ React.createElement("button", {
    onClick: () => window.open(link, "_blank")
  }, "visit ", /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faExternalLinkAlt
  }))));
}
