import React, {Suspense} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {BreadCrumb} from "../../_reactComponents/PanelHeaderComponents/BreadCrumb.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {useCourseChooserCrumb, useDashboardCrumb, useNavigationCrumbs, useCollectionCrumb} from "../../_utils/breadcrumbUtil.js";
export default function CollectionBreadCrumb() {
  const chooserCrumb = useCourseChooserCrumb();
  const path = useRecoilValue(searchParamAtomFamily("path"));
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const [driveId, folderId] = path.split(":");
  const dashboardCrumb = useDashboardCrumb(driveId);
  const navigationCrumbs = useNavigationCrumbs(driveId, folderId);
  const collectionCrumb = useCollectionCrumb(doenetId, path);
  return /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement("div", null, "Loading Breadcrumb...")
  }, /* @__PURE__ */ React.createElement(BreadCrumb, {
    crumbs: [chooserCrumb, dashboardCrumb, ...navigationCrumbs, collectionCrumb]
  }));
}
