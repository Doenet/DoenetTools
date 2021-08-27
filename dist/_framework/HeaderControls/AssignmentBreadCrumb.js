import React, {Suspense, useState, useEffect} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import BreadCrumb from "../../_reactComponents/Breadcrumb/BreadCrumb.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import axios from "../../_snowpack/pkg/axios.js";
import {folderDictionary} from "../../_reactComponents/Drive/NewDrive.js";
export default function AssignmentBreadCrumb() {
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let [path, setPath] = useState(":");
  useEffect(() => {
    axios.get("/api/findDriveIdFolderId.php", {
      params: {doenetId}
    }).then((resp) => {
      setPath(`${resp.data.driveId}:${resp.data.parentFolderId}`);
    });
  }, [doenetId]);
  let [driveId, folderId] = path.split(":");
  let folderInfo = useRecoilValue(folderDictionary({driveId, folderId}));
  const docInfo = folderInfo?.contentsDictionaryByDoenetId?.[doenetId];
  if (!docInfo) {
    return null;
  }
  if (path === ":") {
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
    tool2: "Assignment",
    doenetId,
    path,
    label: docInfo.label
  })));
}
