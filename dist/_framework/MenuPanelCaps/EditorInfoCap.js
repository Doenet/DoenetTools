import React from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {folderDictionary} from "../../_reactComponents/Drive/NewDrive.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
export default function EditorInfoCap() {
  let path = useRecoilValue(searchParamAtomFamily("path"));
  let [driveId, folderId, doenetId] = path.split(":");
  let folderInfo = useRecoilValue(folderDictionary({driveId, folderId}));
  const docInfo = folderInfo.contentsDictionary[doenetId];
  if (!docInfo) {
    return null;
  }
  let status = "Not Released";
  if (docInfo?.isReleased === "1") {
    status = "Released";
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: {padding: "4px"}
  }, /* @__PURE__ */ React.createElement("div", null, docInfo.label), /* @__PURE__ */ React.createElement("div", null, status, " "));
}
