import React, {Suspense, useCallback, useEffect} from "../../_snowpack/pkg/react.js";
import {useRecoilCallback, useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily, pageToolViewAtom} from "../NewToolRoot.js";
import Drive, {
  selectedDriveAtom,
  selectedDriveItems,
  itemType,
  clearDriveAndItemSelections
} from "../../_reactComponents/Drive/NewDrive.js";
import {DropTargetsProvider} from "../../_reactComponents/DropTarget/index.js";
import {BreadcrumbProvider} from "../../_reactComponents/Breadcrumb/index.js";
import {selectedMenuPanelAtom} from "../Panels/NewMenuPanel.js";
import {mainPanelClickAtom} from "../Panels/NewMainPanel.js";
export default function NavigationPanel(props) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const setMainPanelClear = useSetRecoilState(mainPanelClickAtom);
  const path = useRecoilValue(searchParamAtomFamily("path"));
  useEffect(() => {
    setMainPanelClear((was) => [
      ...was,
      {atom: clearDriveAndItemSelections, value: null},
      {atom: selectedMenuPanelAtom, value: null}
    ]);
    return setMainPanelClear((was) => was.filter((obj) => obj.atom !== clearDriveAndItemSelections || obj.atom !== selectedMenuPanelAtom));
  }, [setMainPanelClear]);
  const filter = useCallback((item) => item.released === "1", []);
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
  const doubleClickCallback = useCallback((info) => {
    switch (info.type) {
      case itemType.FOLDER:
        setPageToolView((was) => ({
          ...was,
          params: {
            path: `${info.driveId}:${info.parentFolderId}:${info.parentFolderId}:Folder`
          }
        }));
        break;
      case itemType.DOENETML:
        setPageToolView({
          page: "course",
          tool: "editor",
          view: "",
          params: {
            doenetId: info.item.doenetId,
            path: `${info.driveId}:${info.item.parentFolderId}:${info.item.itemId}:DoenetML`
          }
        });
        break;
      case itemType.COLLECTION:
        break;
      default:
        throw new Error("NavigationPanel doubleClick info type not defined");
    }
  }, [setPageToolView]);
  if (props.style?.display === "none") {
    return /* @__PURE__ */ React.createElement("div", {
      style: props.style
    });
  }
  return /* @__PURE__ */ React.createElement(BreadcrumbProvider, null, /* @__PURE__ */ React.createElement(DropTargetsProvider, null, /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement("div", null, "loading Drive...")
  }, /* @__PURE__ */ React.createElement(Container, null, /* @__PURE__ */ React.createElement(Drive, {
    path,
    filter,
    columnTypes: ["Released", "Public"],
    urlClickBehavior: "select",
    clickCallback,
    doubleClickCallback
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
