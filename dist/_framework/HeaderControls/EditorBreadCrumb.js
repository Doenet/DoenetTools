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
import {courseIdAtom} from "../../_reactComponents/Course/CourseActions.js";
export default function EditorBreadCrumb() {
  const courseId = useRecoilValue(courseIdAtom);
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const pageId = useRecoilValue(searchParamAtomFamily("pageId"));
  const linkPageId = useRecoilValue(searchParamAtomFamily("linkPageId"));
  const chooserCrumb = useCourseChooserCrumb();
  const dashboardCrumb = useDashboardCrumb(courseId);
  const navigationCrumbs = useNavigationCrumbs(courseId, doenetId);
  const editorCrumb = useEditorCrumb({doenetId, pageId, linkPageId});
  return /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement("div", null, "Loading Breadcrumb...")
  }, /* @__PURE__ */ React.createElement(BreadCrumb, {
    crumbs: [
      chooserCrumb,
      dashboardCrumb,
      ...navigationCrumbs,
      ...editorCrumb
    ],
    offset: 68
  }));
}
