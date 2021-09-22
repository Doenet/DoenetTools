import React, {useState, Suspense, useEffect, useLayoutEffect} from "../../_snowpack/pkg/react.js";
import {
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily, pageToolViewAtom} from "../NewToolRoot.js";
import {
  selectedDriveAtom,
  selectedDriveItems,
  itemType,
  clearDriveAndItemSelections,
  folderDictionary,
  DoenetML,
  DriveHeader
} from "../../_reactComponents/Drive/NewDrive.js";
import {DropTargetsProvider} from "../../_reactComponents/DropTarget/index.js";
import {BreadcrumbProvider} from "../../_reactComponents/Breadcrumb/BreadcrumbProvider.js";
import {selectedMenuPanelAtom} from "../Panels/NewMenuPanel.js";
import {mainPanelClickAtom} from "../Panels/NewMainPanel.js";
import axios from "../../_snowpack/pkg/axios.js";
export default function Next7Days({driveId}) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const setMainPanelClear = useSetRecoilState(mainPanelClickAtom);
  let [numColumns, setNumColumns] = useState(4);
  let [assignmentArray, setAssignmentArray] = useState([]);
  let [initialized, setInitialized] = useState(false);
  let [problemMessage, setProblemMessage] = useState("");
  let loadAssignmentArray = useRecoilCallback(({snapshot, set}) => async (driveId2) => {
    const {data} = await axios.get("/api/loadTODO.php", {params: {driveId: driveId2}});
    if (!data.success) {
      setProblemMessage(data.message);
      return;
    }
    if (data.assignments) {
      setAssignmentArray(data.assignments);
    }
  });
  let view = "Student";
  let columnTypes = ["Assigned Date", "Due Date"];
  let isNav = false;
  let driveInstanceId = "not used";
  let pathItemId = "not used";
  let route = "not used";
  useEffect(() => {
    setMainPanelClear((was) => [
      ...was,
      {atom: clearDriveAndItemSelections, value: null},
      {atom: selectedMenuPanelAtom, value: null}
    ]);
    return setMainPanelClear((was) => was.filter((obj) => obj.atom !== clearDriveAndItemSelections || obj.atom !== selectedMenuPanelAtom));
  }, [setMainPanelClear]);
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
      case itemType.DOENETML:
        setPageToolView({
          page: "course",
          tool: "assignment",
          view: "",
          params: {
            doenetId: info.item.doenetId
          }
        });
        break;
      case itemType.COLLECTION:
        setPageToolView({
          page: "course",
          tool: "assignment",
          view: "",
          params: {
            doenetId: info.item.doenetId,
            isCollection: true
          }
        });
        break;
      default:
        throw new Error("NavigationPanel doubleClick info type not defined");
    }
  }, [setPageToolView, view]);
  const filterCallback = useRecoilCallback(({snapshot}) => (item) => {
    switch (view) {
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
          console.log("whats up", item.itemType, "i", item);
          return item.isReleased === "1";
        }
      case "instructor":
        return true;
      default:
        console.warn("No view selected");
    }
  }, [view]);
  if (!initialized && driveId !== "") {
    setInitialized(true);
    loadAssignmentArray(driveId);
  }
  if (problemMessage !== "") {
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, problemMessage));
  }
  let doenetMLsJSX = /* @__PURE__ */ React.createElement("div", null, "There are no assignments due over the next seven days.");
  if (assignmentArray.length > 0) {
    doenetMLsJSX = [];
    for (let item of assignmentArray) {
      doenetMLsJSX.push(/* @__PURE__ */ React.createElement(DoenetML, {
        key: `item${item.itemId}${driveInstanceId}`,
        driveId,
        item,
        indentLevel: 0,
        driveInstanceId,
        route,
        isNav,
        pathItemId,
        clickCallback,
        doubleClickCallback,
        deleteItem: () => {
        },
        numColumns,
        columnTypes,
        isViewOnly: true
      }));
    }
  }
  return /* @__PURE__ */ React.createElement(BreadcrumbProvider, null, /* @__PURE__ */ React.createElement(DropTargetsProvider, null, /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement("div", null, "loading Drive...")
  }, /* @__PURE__ */ React.createElement(Container, null, /* @__PURE__ */ React.createElement("h2", null, "Current Content"), /* @__PURE__ */ React.createElement(DriveHeader, {
    columnTypes,
    numColumns,
    setNumColumns,
    driveInstanceId
  }), doenetMLsJSX))));
}
function Container(props) {
  return /* @__PURE__ */ React.createElement("div", {
    style: {
      maxWidth: "850px",
      margin: "10px 20px"
    }
  }, props.children);
}
