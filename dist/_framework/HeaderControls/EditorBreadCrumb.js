import React, {Suspense} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import BreadCrumb from "../../_reactComponents/Breadcrumb/BreadCrumb.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {folderDictionary} from "../../_reactComponents/Drive/NewDrive.js";
export default function EditorBreadCrumb() {
  const path = useRecoilValue(searchParamAtomFamily("path"));
  let [driveId, folderId, itemId] = path.split(":");
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let folderInfo = useRecoilValue(folderDictionary({driveId, folderId}));
  const docInfo = folderInfo.contentsDictionary[itemId];
  if (!docInfo) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement("div", null, "loading Drive...")
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      margin: "-9px 0px 0px -25px",
      maxWidth: "850px"
    }
  }, /* @__PURE__ */ React.createElement(BreadCrumb, {
    tool: "Content",
    tool2: "Editor",
    doenetId,
    path,
    label: docInfo.label
  })));
}
