import React, {useCallback} from "../../_snowpack/pkg/react.js";
import {faTh} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {
  folderDictionary,
  fetchDrivesQuery,
  clearDriveAndItemSelections
} from "../Drive/NewDrive.js";
import {
  useRecoilValue,
  atomFamily,
  selectorFamily,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom} from "../../_framework/NewToolRoot.js";
import styled from "../../_snowpack/pkg/styled-components.js";
const Breadcrumb = styled.ul`
  list-style: none;
  overflow: hidden; ;
`;
const BreadcrumbItem = styled.li`
  float: left;
  &:last-of-type span {
    border-radius: 0px 15px 15px 0px;
    padding: 0px 25px 0px 45px;
    background: hsl(209, 54%, 82%);
    color: black;
  }
  &:first-of-type span {
    padding: 0px 0px 0px 30px;
  }
`;
const BreadcrumbSpan = styled.span`
  padding: 0px 0px 0px 45px;
  position: relative;
  display: block;
  float: left;
  color: white;
  background: #1a5a99;
  border-radius: 15px 0px 0px 15px;
  cursor: pointer;
  &::after {
    content: ' ';
    display: block;
    width: 0;
    height: 0;
    border-top: 50px solid transparent;
    border-bottom: 50px solid transparent;
    border-left: 30px solid #1a5a99;
    position: absolute;
    top: 50%;
    margin-top: -50px;
    left: 100%;
    z-index: 2;
  }
  &::before {
    content: ' ';
    display: block;
    width: 0;
    height: 0;
    border-top: 50px solid transparent;
    border-bottom: 50px solid transparent;
    border-left: 30px solid white;
    position: absolute;
    top: 50%;
    margin-top: -50px;
    margin-left: 1px;
    left: 100%;
    z-index: 1;
  }
`;
const breadcrumbItemAtomFamily = atomFamily({
  key: "breadcrumbItemAtomFamily",
  default: selectorFamily({
    key: "breadcrumbItemAtomFamily/Default",
    get: ({driveId, folderId}) => ({get}) => {
      let items = [];
      if (!driveId) {
        return items;
      }
      while (folderId) {
        let folderInfo = get(folderDictionary({driveId, folderId}));
        if (!folderInfo.folderInfo.itemId) {
          break;
        }
        items.push({
          type: "Folder",
          folderId: folderInfo.folderInfo.itemId,
          label: folderInfo.folderInfo.label
        });
        folderId = folderInfo.folderInfo.parentFolderId;
      }
      const drivesInfo = get(fetchDrivesQuery);
      let driveObj = {type: "Drive", folderId: driveId};
      for (let drive of drivesInfo.driveIdsAndLabels) {
        if (drive.driveId === driveId) {
          driveObj.label = drive.label;
          break;
        }
      }
      items.push(driveObj);
      return items;
    }
  })
});
export default function BreadCrumb({path, tool, tool2, doenetId}) {
  const [driveId, parentFolderId] = path.split(":");
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const clearSelections = useSetRecoilState(clearDriveAndItemSelections);
  const items = useRecoilValue(breadcrumbItemAtomFamily({
    driveId,
    folderId: parentFolderId
  }));
  const goToFolder = useCallback((driveId2, folderId) => {
    clearSelections();
    setPageToolView((was) => ({
      page: was.page,
      tool: "navigation",
      view: "",
      params: {
        path: `${driveId2}:${folderId}:${folderId}:Folder`
      }
    }));
  }, [setPageToolView, clearSelections]);
  let courseTitle = items[items.length - 1]?.label;
  let returnToToolHead = null;
  if (tool) {
    let toolName = "";
    let params = {
      path: `${driveId}:${driveId}:${driveId}:Drive`
    };
    if (tool === "Content") {
      toolName = "navigation";
    } else if (tool === "Enrollment") {
      toolName = "enrollment";
      params = {driveId};
    } else if (tool === "Gradebook") {
      toolName = "gradebook";
      params = {driveId};
    } else if (tool === "CourseChooser") {
      toolName = "courseChooser";
      params = {};
    }
    returnToToolHead = /* @__PURE__ */ React.createElement(BreadcrumbItem, null, /* @__PURE__ */ React.createElement(BreadcrumbSpan, {
      role: "button",
      tabIndex: "0",
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          setPageToolView((was) => ({
            page: was.page,
            tool: toolName,
            view: "",
            params
          }));
        }
      },
      onClick: () => {
        setPageToolView((was) => ({
          page: was.page,
          tool: toolName,
          view: "",
          params
        }));
      }
    }, tool));
  }
  const returnToCourseChooser = /* @__PURE__ */ React.createElement(BreadcrumbItem, null, /* @__PURE__ */ React.createElement(BreadcrumbSpan, {
    role: "button",
    tabIndex: "0",
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        setPageToolView({
          page: "course",
          tool: "courseChooser",
          view: ""
        });
      }
    },
    onClick: () => {
      setPageToolView({page: "course", tool: "courseChooser", view: ""});
    }
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faTh
  })));
  if (tool === "CourseChooser") {
    return /* @__PURE__ */ React.createElement(Breadcrumb, null, returnToCourseChooser, " ", /* @__PURE__ */ React.createElement(BreadcrumbItem, null, /* @__PURE__ */ React.createElement(BreadcrumbSpan, null)));
  }
  const returnToDashboard = /* @__PURE__ */ React.createElement(BreadcrumbItem, null, /* @__PURE__ */ React.createElement(BreadcrumbSpan, {
    role: "button",
    tabIndex: "0",
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        setPageToolView((was) => ({
          page: was.page,
          tool: "dashboard",
          view: "",
          params: {
            path: `${driveId}:${driveId}:${driveId}:Drive`
          }
        }));
      }
    },
    onClick: () => {
      setPageToolView((was) => ({
        page: was.page,
        tool: "dashboard",
        view: "",
        params: {
          path: `${driveId}:${driveId}:${driveId}:Drive`
        }
      }));
    }
  }, courseTitle));
  let children = null;
  if (tool) {
    let folders = [...items];
    folders.pop();
    children = [...folders].reverse().map((item) => /* @__PURE__ */ React.createElement(BreadcrumbItem, {
      key: item.folderId
    }, /* @__PURE__ */ React.createElement(BreadcrumbSpan, {
      role: "button",
      tabIndex: "0",
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          goToFolder(driveId, item.folderId);
        }
      },
      onClick: () => {
        goToFolder(driveId, item.folderId);
      }
    }, item.label)));
  }
  let returnToToolHead2 = null;
  let tool2name = "";
  let params2 = {};
  if (tool2 === "Assignment") {
    tool2name = "assignment";
    params2 = {doenetId};
  } else if (tool2 === "Editor") {
    tool2name = "editor";
    params2 = {doenetId, path};
  }
  if (tool2) {
    returnToToolHead2 = /* @__PURE__ */ React.createElement(BreadcrumbItem, null, /* @__PURE__ */ React.createElement(BreadcrumbSpan, {
      role: "button",
      tabIndex: "0",
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          setPageToolView((was) => ({
            page: was.page,
            tool: tool2name,
            view: "",
            params: params2
          }));
        }
      },
      onClick: () => {
        setPageToolView((was) => ({
          page: was.page,
          tool: tool2name,
          view: "",
          params: params2
        }));
      }
    }, tool2));
  }
  return /* @__PURE__ */ React.createElement(Breadcrumb, null, returnToCourseChooser, " ", returnToDashboard, " ", returnToToolHead, " ", children, " ", returnToToolHead2);
}
