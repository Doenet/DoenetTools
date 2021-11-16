import React, {Suspense} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {BreadCrumb} from "../../_reactComponents/PanelHeaderComponents/BreadCrumb.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {
  useCourseChooserCrumb,
  useDashboardCrumb,
  useNavigationCrumbs,
  useEditorCrumb
} from "../../_utils/breadcrumbUtil.js";
export default function EditorBreadCrumb() {
  const chooserCrumb = useCourseChooserCrumb();
  const path = useRecoilValue(searchParamAtomFamily("path"));
  const [driveId, folderId, itemId] = path.split(":");
  const dashboardCrumb = useDashboardCrumb(driveId);
  const navigationCrumbs = useNavigationCrumbs(driveId, folderId);
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const editorCrumb = useEditorCrumb({doenetId, driveId, folderId, itemId});
  return /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement("div", null, "Loading Breadcrumb...")
  }, /* @__PURE__ */ React.createElement(BreadCrumb, {
    crumbs: [chooserCrumb, dashboardCrumb, ...navigationCrumbs, editorCrumb],
    offset: 62
  }));
}
