import React, {useState, Suspense, useEffect, useLayoutEffect} from "../../_snowpack/pkg/react.js";
import {useRecoilCallback, useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily, pageToolViewAtom} from "../NewToolRoot.js";
import {
  selectedDriveAtom,
  selectedDriveItems,
  itemType,
  clearDriveAndItemSelections,
  folderDictionary
} from "../../_reactComponents/Drive/NewDrive.js";
import CourseNavigator from "../../_reactComponents/Course/CourseNavigator.js";
import {DropTargetsProvider} from "../../_reactComponents/DropTarget/index.js";
import {BreadcrumbProvider} from "../../_reactComponents/Breadcrumb/BreadcrumbProvider.js";
import {selectedMenuPanelAtom} from "../Panels/NewMenuPanel.js";
import {mainPanelClickAtom} from "../Panels/NewMainPanel.js";
import {effectiveRoleAtom} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import {suppressMenusAtom} from "../NewToolRoot.js";
import styled, {keyframes} from "../../_snowpack/pkg/styled-components.js";
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
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const setMainPanelClear = useSetRecoilState(mainPanelClickAtom);
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const [columnTypes, setColumnTypes] = useState([]);
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  useEffect(() => {
    setMainPanelClear((was) => [
      ...was,
      {atom: clearDriveAndItemSelections, value: null},
      {atom: selectedMenuPanelAtom, value: null}
    ]);
    return setMainPanelClear((was) => was.filter((obj) => obj.atom !== clearDriveAndItemSelections || obj.atom !== selectedMenuPanelAtom));
  }, [setMainPanelClear]);
  useLayoutEffect(() => {
    switch (effectiveRole) {
      case "instructor":
        setColumnTypes(["Released", "Assigned", "Public"]);
        setSuppressMenus([]);
        break;
      case "student":
        setColumnTypes(["Due Date"]);
        setSuppressMenus(["AddDriveItems"]);
        break;
      default:
    }
  }, [effectiveRole, setSuppressMenus]);
  const clickCallback = useRecoilCallback(({set}) => (info) => {
    switch (info.instructionType) {
      case "one item":
        set(selectedMenuPanelAtom, `Selected${info.type}`);
        break;
      case "range to item":
      case "add item":
        set(selectedMenuPanelAtom, `SelectedMulti`);
        break;
      case "clear all":
        set(selectedMenuPanelAtom, null);
        break;
      default:
        throw new Error("NavigationPanel found invalid select instruction");
    }
    set(selectedDriveItems({
      driveId: info.driveId,
      driveInstanceId: info.driveInstanceId,
      itemId: info.itemId
    }), {
      instructionType: info.instructionType,
      parentFolderId: info.parentFolderId
    });
    set(selectedDriveAtom, info.driveId);
  }, []);
  const doubleClickCallback = useRecoilCallback(({set}) => (info) => {
    switch (info.type) {
      case itemType.FOLDER:
        set(clearDriveAndItemSelections, null);
        setPageToolView((was) => ({
          ...was,
          params: {
            path: `${info.driveId}:${info.parentFolderId}:${info.parentFolderId}:Folder`
          }
        }));
        break;
      case itemType.DOENETML:
        if (effectiveRole === "student") {
          setPageToolView({
            page: "course",
            tool: "assignment",
            view: "",
            params: {
              doenetId: info.item.doenetId
            }
          });
        } else if (effectiveRole === "instructor") {
          setPageToolView({
            page: "course",
            tool: "editor",
            view: "",
            params: {
              doenetId: info.item.doenetId,
              path: `${info.driveId}:${info.item.parentFolderId}:${info.item.itemId}:DoenetML`
            }
          });
        }
        break;
      case itemType.COLLECTION:
        if (effectiveRole === "student") {
          setPageToolView({
            page: "course",
            tool: "assignment",
            view: "",
            params: {
              doenetId: info.item.doenetId,
              isCollection: true
            }
          });
        } else if (effectiveRole === "instructor") {
          setPageToolView({
            page: "course",
            tool: "collection",
            view: "",
            params: {
              doenetId: info.item.doenetId,
              path: `${info.driveId}:${info.item.itemId}:${info.item.itemId}:Collection`
            }
          });
        }
        break;
      default:
        throw new Error("NavigationPanel doubleClick info type not defined");
    }
  }, [setPageToolView, effectiveRole]);
  const filterCallback = useRecoilCallback(({snapshot}) => (item) => {
    switch (effectiveRole) {
      case "student":
        if (item.itemType === itemType.FOLDER) {
          const folderContents = snapshot.getLoadable(folderDictionary({
            driveId: item.driveId,
            folderId: item.itemId
          })).getValue()["contentsDictionary"];
          for (const key in folderContents) {
            if (folderContents[key].isReleased === "1") {
              return true;
            }
          }
          return false;
        } else {
          return item.isReleased === "1";
        }
      case "instructor":
        return true;
      default:
        console.warn("No view selected");
    }
  }, [effectiveRole]);
  return /* @__PURE__ */ React.createElement(BreadcrumbProvider, null, /* @__PURE__ */ React.createElement(DropTargetsProvider, null, /* @__PURE__ */ React.createElement(Suspense, {
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
    courseId,
    filterCallback,
    columnTypes,
    urlClickBehavior: "select",
    clickCallback,
    doubleClickCallback,
    isViewOnly: effectiveRole === "student"
  })))));
}
function Container(props) {
  return /* @__PURE__ */ React.createElement("div", {
    style: {
      maxWidth: "850px",
      margin: "10px 20px"
    }
  }, props.children);
}
