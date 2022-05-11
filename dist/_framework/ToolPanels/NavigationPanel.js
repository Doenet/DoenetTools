import React, {useState, Suspense, useEffect, useLayoutEffect} from "../../_snowpack/pkg/react.js";
import {useRecoilCallback, useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily, pageToolViewAtom} from "../NewToolRoot.js";
import CourseNavigator from "../../_reactComponents/Course/CourseNavigator.js";
import {selectedMenuPanelAtom} from "../Panels/NewMenuPanel.js";
import {effectiveRoleAtom} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import {suppressMenusAtom} from "../NewToolRoot.js";
import styled, {keyframes} from "../../_snowpack/pkg/styled-components.js";
import {itemByDoenetId, findFirstPageOfActivity, selectedCourseItems} from "../../_reactComponents/Course/CourseActions.js";
import {useToast, toastType} from "../Toast.js";
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
  /* border-bottom: 2px solid black; */

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
  background-color: rgba(0,0,0,.15);
  width: 70px;
  height: 16px;
  border-radius: 5px;
`;
const Td3Span = styled.span`
  display: block;
  height: 14px;
  border-radius: 5px;
  background: linear-gradient(to right, #eee 20%, #ddd 50%, #eee 80%);
  background-size: 500px 100px;
  animation-name: ${movingGradient};
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
`;
export default function NavigationPanel() {
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  const addToast = useToast();
  useLayoutEffect(() => {
    switch (effectiveRole) {
      case "instructor":
        setSuppressMenus([]);
        break;
      case "student":
        setSuppressMenus(["AddDriveItems", "CutCopyPasteMenu"]);
        break;
      default:
    }
  }, [effectiveRole, setSuppressMenus]);
  const updateSelectMenu = useRecoilCallback(({set, snapshot}) => async ({selectedItems}) => {
    if (selectedItems.length == 1) {
      let selectedDoenetId = selectedItems[0];
      let selectedItem = await snapshot.getPromise(itemByDoenetId(selectedDoenetId));
      if (selectedItem.type == "activity") {
        set(selectedMenuPanelAtom, "SelectedActivity");
      } else if (selectedItem.type == "order") {
        set(selectedMenuPanelAtom, "SelectedOrder");
      } else if (selectedItem.type == "page") {
        set(selectedMenuPanelAtom, "SelectedPage");
      } else if (selectedItem.type == "section") {
        set(selectedMenuPanelAtom, "SelectedSection");
      } else if (selectedItem.type == "bank") {
        set(selectedMenuPanelAtom, "SelectedBank");
      } else {
        set(selectedMenuPanelAtom, null);
      }
    } else {
      set(selectedMenuPanelAtom, null);
    }
  });
  const doubleClickItem = useRecoilCallback(({set, snapshot}) => async ({doenetId, courseId}) => {
    let clickedItem = await snapshot.getPromise(itemByDoenetId(doenetId));
    let effectiveRole2 = await snapshot.getPromise(effectiveRoleAtom);
    if (clickedItem.type == "page") {
      set(pageToolViewAtom, (prev) => {
        return {
          page: "course",
          tool: "editor",
          view: prev.view,
          params: {pageId: doenetId, doenetId: clickedItem.containingDoenetId}
        };
      });
    } else if (clickedItem.type == "activity") {
      if (effectiveRole2 == "student") {
        set(pageToolViewAtom, {
          page: "course",
          tool: "assignment",
          view: "",
          params: {
            doenetId
          }
        });
      } else {
        let pageDoenetId = findFirstPageOfActivity(clickedItem.order);
        if (pageDoenetId == null) {
          addToast(`ERROR: No page found in activity`, toastType.INFO);
        } else {
          set(pageToolViewAtom, (prev) => {
            return {
              page: "course",
              tool: "editor",
              view: prev.view,
              params: {pageId: pageDoenetId, doenetId}
            };
          });
        }
      }
    } else if (clickedItem.type == "section") {
      set(pageToolViewAtom, (prev) => {
        return {
          page: "course",
          tool: "navigation",
          view: prev.view,
          params: {sectionId: clickedItem.doenetId, courseId}
        };
      });
    }
  });
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
