import React from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {fetchDrivesQuery} from "../../_reactComponents/Drive/NewDrive.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
export default function DriveInfoCap() {
  let path = useRecoilValue(searchParamAtomFamily("path"));
  let driveId = useRecoilValue(searchParamAtomFamily("driveId"));
  if (!driveId) {
    driveId = path.split(":")[0];
  }
  const driveInfo = useRecoilValue(fetchDrivesQuery);
  let roles;
  let image;
  let label = "";
  for (let info of driveInfo.driveIdsAndLabels) {
    if (info.driveId === driveId) {
      roles = [...info.role];
      image = info.image;
      label = info.label;
      break;
    }
  }
  let imageURL = `/media/drive_pictures/${image}`;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: {position: "relative", paddingBottom: "100px"}
  }, /* @__PURE__ */ React.createElement("img", {
    style: {position: "absolute", clip: "rect(0, 240px, 100px, 0)"},
    src: imageURL,
    alt: `${label} course`,
    width: "240px"
  })), /* @__PURE__ */ React.createElement("div", null, label), /* @__PURE__ */ React.createElement("div", null, roles));
}
