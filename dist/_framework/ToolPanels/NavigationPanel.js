import React, {Suspense, useLayoutEffect} from "../../_snowpack/pkg/react.js";
import {useRecoilCallback, useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import styled, {keyframes} from "../../_snowpack/pkg/styled-components.js";
import {useToast, toastType} from "../Toast.js";
import {suppressMenusAtom} from "../NewToolRoot.js";
import {selectedMenuPanelAtom} from "../Panels/NewMenuPanel.js";
import {searchParamAtomFamily, pageToolViewAtom} from "../NewToolRoot.js";
import CourseNavigator from "../../_reactComponents/Course/CourseNavigator.js";
import {effectivePermissionsByCourseId} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import {
  itemByDoenetId,
  findFirstPageOfActivity,
  coursePermissionsAndSettingsByCourseId
} from "../../_reactComponents/Course/CourseActions.js";
const movingGradient = keyframes`
  0% { background-position: -250px 0; }
  100% { background-position: 250px 0; }
`;
const Table = styled.table`
  width: 850px;
  border-radius: 5px;
  margin-top: 50px;
  margin-left: 20px;
`;
const Tr = styled.tr``;
const Td = styled.td`
  height: 40px;
  vertical-align: middle;
  padding: 8px;
  /* border-bottom: 2px solid var(--canvastext); */

  &.Td2 {
    width: 50px;
  }

  &.Td3 {
    width: 400px;
  }
`;
const TBody = styled.tbody``;
const Td2Span = styled.span`
  display: block;
  //background-color: var(--canvastext);
  width: 70px;
  height: 16px;
  border-radius: 5px;
`;
const Td3Span = styled.span`
  display: block;
  height: 14px;
  border-radius: 5px;
  background: linear-gradient(
    to right,
    var(--mainGray) 20%,
    var(--mainGray) 50%,
    var(--mainGray) 80%
  );
  background-size: 500px 100px;
  animation-name: ${movingGradient};
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
`;
export default function NavigationPanel() {
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const {canEditContent} = useRecoilValue(effectivePermissionsByCourseId(courseId));
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  const addToast = useToast();
  useLayoutEffect(() => {
    setSuppressMenus(canEditContent == "1" ? [] : ["AddDriveItems", "CutCopyPasteMenu"]);
  }, [canEditContent, setSuppressMenus]);
  const updateSelectMenu = useRecoilCallback(({set, snapshot}) => async ({singleItem}) => {
    console.log(`singleItem doenetId:${singleItem?.doenetId}`, singleItem);
    if (singleItem !== null) {
      if (singleItem.type == "activity") {
        set(selectedMenuPanelAtom, "SelectedActivity");
      } else if (singleItem.type == "order") {
        set(selectedMenuPanelAtom, "SelectedOrder");
      } else if (singleItem.type == "page") {
        set(selectedMenuPanelAtom, "SelectedPage");
      } else if (singleItem.type == "section") {
        set(selectedMenuPanelAtom, "SelectedSection");
      } else if (singleItem.type == "bank") {
        set(selectedMenuPanelAtom, "SelectedBank");
      } else if (singleItem.type == "collectionLink") {
        set(selectedMenuPanelAtom, "SelectedCollectionLink");
      } else if (singleItem.type == "pageLink") {
        set(selectedMenuPanelAtom, "SelectedPageLink");
      } else {
        set(selectedMenuPanelAtom, null);
      }
    } else {
      set(selectedMenuPanelAtom, null);
    }
  });
  const doubleClickItem = useRecoilCallback(({set, snapshot}) => async ({doenetId, courseId: courseId2}) => {
    let clickedItem = await snapshot.getPromise(itemByDoenetId(doenetId));
    let {canEditContent: canEditContent2} = await snapshot.getPromise(effectivePermissionsByCourseId(courseId2));
    if (clickedItem.type == "page") {
      set(pageToolViewAtom, (prev) => {
        return {
          page: "course",
          tool: "editor",
          view: prev.view,
          params: {
            pageId: doenetId,
            doenetId: clickedItem.containingDoenetId
          }
        };
      });
    } else if (clickedItem.type == "pageLink") {
      set(pageToolViewAtom, (prev) => {
        return {
          page: "course",
          tool: "editor",
          view: prev.view,
          params: {
            linkPageId: doenetId
          }
        };
      });
    } else if (clickedItem.type == "activity") {
      if (canEditContent2 == "1") {
        let pageDoenetId = findFirstPageOfActivity(clickedItem.content);
        if (pageDoenetId == null) {
        } else {
          set(pageToolViewAtom, (prev) => {
            return {
              page: "course",
              tool: "editor",
              view: prev.view,
              params: {doenetId, pageId: pageDoenetId}
            };
          });
        }
      } else {
        set(pageToolViewAtom, {
          page: "course",
          tool: "assignment",
          view: "",
          params: {
            doenetId
          }
        });
      }
    } else if (clickedItem.type == "section") {
      set(pageToolViewAtom, (prev) => {
        return {
          page: "course",
          tool: "navigation",
          view: prev.view,
          params: {sectionId: clickedItem.doenetId, courseId: courseId2}
        };
      });
    }
  });
  let course = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));
  if (course?.canViewCourse == "0") {
    return /* @__PURE__ */ React.createElement("h1", null, "No Access to view this page.");
  }
  return /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement(Table, null, /* @__PURE__ */ React.createElement(TBody, null, /* @__PURE__ */ React.createElement(Tr, null, /* @__PURE__ */ React.createElement(Td, {
      className: "Td2"
    }, /* @__PURE__ */ React.createElement(Td2Span, null)), /* @__PURE__ */ React.createElement(Td, {
      className: "Td3"
    }, /* @__PURE__ */ React.createElement(Td3Span, null))), /* @__PURE__ */ React.createElement(Tr, null, /* @__PURE__ */ React.createElement(Td, {
      className: "Td2"
    }, /* @__PURE__ */ React.createElement(Td2Span, null)), /* @__PURE__ */ React.createElement(Td, {
      className: "Td3"
    }, /* @__PURE__ */ React.createElement(Td3Span, null))), /* @__PURE__ */ React.createElement(Tr, null, /* @__PURE__ */ React.createElement(Td, {
      className: "Td2"
    }, /* @__PURE__ */ React.createElement(Td2Span, null)), /* @__PURE__ */ React.createElement(Td, {
      className: "Td3"
    }, /* @__PURE__ */ React.createElement(Td3Span, null)))))
  }, /* @__PURE__ */ React.createElement(Container, null, /* @__PURE__ */ React.createElement(CourseNavigator, {
    updateSelectMenu,
    doubleClickItem
  })));
}
function Container(props) {
  return /* @__PURE__ */ React.createElement("div", {
    style: {
      maxWidth: "850px",
      margin: "10px 20px"
    }
  }, props.children);
}
