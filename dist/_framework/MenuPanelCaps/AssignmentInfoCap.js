import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {folderDictionary, fetchDrivesQuery, loadAssignmentSelector} from "../../_reactComponents/Drive/NewDrive.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import axios from "../../_snowpack/pkg/axios.js";
import {currentAttemptNumber} from "../ToolPanels/AssignmentViewer.js";
export default function AssignmentInfoCap() {
  let doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const {numberOfAttemptsAllowed} = useRecoilValue(loadAssignmentSelector(doenetId));
  const recoilAttemptNumber = useRecoilValue(currentAttemptNumber);
  let [driveId, setDriveId] = useState("");
  let [folderId, setFolderId] = useState("");
  useEffect(() => {
    axios.get("/api/findDriveIdFolderId.php", {
      params: {doenetId}
    }).then((resp) => {
      setDriveId(resp.data.driveId);
      setFolderId(resp.data.parentFolderId);
    });
  }, [doenetId]);
  const driveInfo = useRecoilValue(fetchDrivesQuery);
  let folderInfo = useRecoilValue(folderDictionary({driveId, folderId}));
  const docInfo = folderInfo?.contentsDictionaryByDoenetId?.[doenetId];
  if (!docInfo) {
    return null;
  }
  let image;
  let driveLabel = "";
  for (let info of driveInfo.driveIdsAndLabels) {
    if (info.driveId === driveId) {
      image = info.image;
      driveLabel = info.label;
      break;
    }
  }
  let imageURL = `/media/drive_pictures/${image}`;
  let attemptsAllowedDescription = numberOfAttemptsAllowed;
  if (!numberOfAttemptsAllowed) {
    attemptsAllowedDescription = "Unlimited";
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
    style: {position: "relative", paddingBottom: "100px"}
  }, /* @__PURE__ */ React.createElement("img", {
    style: {position: "absolute", clip: "rect(0, 240px, 100px, 0)"},
    src: imageURL,
    alt: `${driveLabel} course`,
    width: "240px"
  })), /* @__PURE__ */ React.createElement("div", null, driveLabel), /* @__PURE__ */ React.createElement("div", null, docInfo.label), /* @__PURE__ */ React.createElement("div", null, recoilAttemptNumber, "/", attemptsAllowedDescription, " Attempts"));
}
