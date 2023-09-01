import React from "../../_snowpack/pkg/react.js";
import {faTh} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {drivePathSyncFamily, folderDictionary, fetchCoursesQuery} from "../Drive/NewDrive.js";
import {useRecoilValue, useRecoilState, atomFamily, selectorFamily} from "../../_snowpack/pkg/recoil.js";
const breadcrumbItemAtomFamily = atomFamily({
  key: "breadcrumbItemAtomFamily",
  default: selectorFamily({
    key: "breadcrumbItemAtomFamily/Default",
    get: (driveIdFolderId) => ({get}) => {
      let items = [];
      let driveId = driveIdFolderId.driveId;
      let folderId = driveIdFolderId.folderId;
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
      const drivesInfo = get(fetchCoursesQuery);
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
export const BreadcrumbContainer = (props) => {
  const [drivePath, setDrivePath] = useRecoilState(drivePathSyncFamily(props.drivePathSyncKey));
  const items = useRecoilValue(breadcrumbItemAtomFamily({driveId: drivePath.driveId, folderId: drivePath.parentFolderId}));
  if (drivePath.driveId === "") {
    return null;
  }
  let leftmostBreadcrumb = /* @__PURE__ */ React.createElement("span", {
    onClick: () => {
      setDrivePath({
        driveId: "",
        parentFolderId: "",
        itemId: "",
        type: ""
      });
    }
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faTh
  }));
  let reversed = [...items];
  reversed.reverse();
  let children = [];
  for (let item of reversed) {
    children.push(/* @__PURE__ */ React.createElement("span", {
      onClick: () => {
        setDrivePath({
          driveId: drivePath.driveId,
          parentFolderId: item.folderId,
          itemId: item.folderId,
          type: "Folder"
        });
      }
    }, item.label, " / "));
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: {margin: "10px"}
  }, leftmostBreadcrumb, " ", children);
};
