import React, {useCallback} from "../../_snowpack/pkg/react.js";
import {faTh} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {folderDictionary, fetchDrivesQuery} from "../Drive/NewDrive.js";
import {
  useRecoilValue,
  atomFamily,
  selectorFamily,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom} from "../../_framework/NewToolRoot.js";
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
export default function BreadCrumb({path}) {
  const [driveId, parentFolderId] = path.split(":");
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const items = useRecoilValue(breadcrumbItemAtomFamily({
    driveId,
    folderId: parentFolderId
  }));
  const goToFolder = useCallback((driveId2, folderId) => {
    setPageToolView((was) => ({
      ...was,
      params: {
        path: `${driveId2}:${folderId}:${folderId}:Folder`
      }
    }));
  }, [setPageToolView]);
  if (driveId === "") {
    return null;
  }
  const returnToCourseChooser = /* @__PURE__ */ React.createElement("span", {
    role: "button",
    tabIndex: "0",
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        setPageToolView({page: "course", tool: "courseChooser", view: ""});
      }
    },
    onClick: () => {
      setPageToolView({page: "course", tool: "courseChooser", view: ""});
    }
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faTh
  }));
  const children = [...items].reverse().map((item) => /* @__PURE__ */ React.createElement("span", {
    role: "button",
    tabIndex: "0",
    key: item.folderId,
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        goToFolder(driveId, item.folderId);
      }
    },
    onClick: () => {
      goToFolder(driveId, item.folderId);
    }
  }, item.label, " /", " "));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, returnToCourseChooser, " ", children);
}
