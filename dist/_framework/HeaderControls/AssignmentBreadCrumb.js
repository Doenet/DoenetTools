import React, {Suspense, useState, useEffect} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {BreadCrumb} from "../../_reactComponents/PanelHeaderComponents/BreadCrumb.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import axios from "../../_snowpack/pkg/axios.js";
import {
  useCourseChooserCrumb,
  useDashboardCrumb,
  useNavigationCrumbs,
  useAssignmentCrumb
} from "../../_utils/breadcrumbUtil.js";
export default function AssignmentBreadCrumb() {
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let [path, setPath] = useState("::");
  useEffect(() => {
    axios.get("/api/findDriveIdFolderId.php", {
      params: {doenetId}
    }).then((resp) => {
      setPath(`${resp.data.driveId}:${resp.data.parentFolderId}:${resp.data.itemId}`);
    });
  }, [doenetId]);
  let [driveId, folderId, itemId] = path.split(":");
  const chooserCrumb = useCourseChooserCrumb();
  const dashboardCrumb = useDashboardCrumb(driveId);
  const navigationCrumbs = useNavigationCrumbs(driveId, folderId);
  const assignmentCrumb = useAssignmentCrumb({doenetId, driveId, folderId, itemId});
  return /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement("div", null, "Loading Breadcrumb...")
  }, /* @__PURE__ */ React.createElement(BreadCrumb, {
    crumbs: [chooserCrumb, dashboardCrumb, ...navigationCrumbs, assignmentCrumb],
    offset: 300
  }));
}
