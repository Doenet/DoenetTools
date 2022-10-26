import React from "../../_snowpack/pkg/react.js";
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
import {editorPageIdInitAtom} from "../../_sharedRecoil/EditorViewerRecoil.js";
export default function DoenetMLSettings(props) {
  const initializedDoenetId = useRecoilValue(editorPageIdInitAtom);
  const link = `http://${window.location.host}/content/#/?doenetId=${initializedDoenetId}`;
  const addToast = useToast();
  const paramDoenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  if (paramDoenetId !== initializedDoenetId) {
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
