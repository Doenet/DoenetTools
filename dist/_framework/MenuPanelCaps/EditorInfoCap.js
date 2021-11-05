import React from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {folderDictionary, fetchDrivesQuery} from "../../_reactComponents/Drive/NewDrive.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
export default function EditorInfoCap() {
  let path = useRecoilValue(searchParamAtomFamily("path"));
  let [driveId, folderId, doenetId] = path.split(":");
  let folderInfo = useRecoilValue(folderDictionary({driveId, folderId}));
  const driveInfo = useRecoilValue(fetchDrivesQuery);
  const docInfo = folderInfo.contentsDictionary[doenetId];
  if (!docInfo) {
    return null;
  }
  let status = "Not Released";
  if (docInfo?.isReleased === "1") {
    status = "Released";
  }
  let image;
  let course_label = "";
  for (let info of driveInfo.driveIdsAndLabels) {
    if (info.driveId === driveId) {
      image = info.image;
      course_label = info.label;
      break;
    }
  }
  let imageURL = `/media/drive_pictures/${image}`;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: {position: "relative", paddingBottom: "100px"}
  }, /* @__PURE__ */ React.createElement("img", {
    style: {position: "absolute", height: "100px", objectFit: "cover"},
    src: imageURL,
    alt: `${course_label} course`,
    width: "240px"
  })), /* @__PURE__ */ React.createElement("div", {
    style: {padding: "8px"}
  }, /* @__PURE__ */ React.createElement("div", null, course_label), /* @__PURE__ */ React.createElement("div", null, docInfo.label), /* @__PURE__ */ React.createElement("div", null, status, " ")));
}
