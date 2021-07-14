import {useRef} from "../../_snowpack/pkg/react.js";
import {
  atom,
  useRecoilValue,
  selector,
  useRecoilCallback,
  useSetRecoilState,
  atomFamily,
  selectorFamily
} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily, toolViewAtom, paramObjAtom} from "../NewToolRoot.js";
import {mainPanelClickAtom} from "../Panels/NewMainPanel.js";
import {selectedMenuPanelAtom} from "../Panels/NewMenuPanel.js";
import {globalSelectedNodesAtom} from "../../_reactComponents/Drive/NewDrive.js";
import axios from "../../_snowpack/pkg/axios.js";
export const itemHistoryAtom = atomFamily({
  key: "itemHistoryAtom",
  default: selectorFamily({
    key: "itemHistoryAtom/Default",
    get: (doenetId) => async () => {
      let draft = {};
      let named = [];
      let autoSaves = [];
      if (!doenetId) {
        return {draft, named, autoSaves};
      }
      const {data} = await axios.get(`/api/loadVersions.php?doenetId=${doenetId}`);
      draft = data.versions[0];
      for (let version of data.versions) {
        if (version.isDraft === "1") {
          continue;
        }
        if (version.isNamed === "1") {
          named.push(version);
          continue;
        }
        autoSaves.push(version);
      }
      return {draft, named, autoSaves};
    }
  })
});
export const fileByContentId = atomFamily({
  key: "fileByContentId",
  default: selectorFamily({
    key: "fileByContentId/Default",
    get: (contentId) => async () => {
      if (!contentId) {
        return "";
      }
      const local = localStorage.getItem(contentId);
      if (local) {
        return local;
      }
      try {
        const server = await axios.get(`/media/${contentId}.doenet`);
        return server.data;
      } catch (err) {
        return "Error Loading";
      }
    }
  })
});
export const drivecardSelectedNodesAtom = atom({
  key: "drivecardSelectedNodesAtom",
  default: []
});
export const fetchDrivesQuery = atom({
  key: "fetchDrivesQuery",
  default: selector({
    key: "fetchDrivesQuery/Default",
    get: async () => {
      const {data} = await axios.get(`/api/loadAvailableDrives.php`);
      return data;
    }
  })
});
export const fetchDrivesSelector = selector({
  key: "fetchDrivesSelector",
  get: ({get}) => {
    return get(fetchDrivesQuery);
  },
  set: ({get, set}, labelTypeDriveIdColorImage) => {
    let driveData = get(fetchDrivesQuery);
    let newDriveData = {...driveData};
    newDriveData.driveIdsAndLabels = [...driveData.driveIdsAndLabels];
    let params = {
      driveId: labelTypeDriveIdColorImage.newDriveId,
      label: labelTypeDriveIdColorImage.label,
      type: labelTypeDriveIdColorImage.type,
      image: labelTypeDriveIdColorImage.image,
      color: labelTypeDriveIdColorImage.color
    };
    let newDrive;
    function duplicateFolder({sourceFolderId, sourceDriveId, destDriveId, destFolderId, destParentFolderId}) {
      let contentObjs = {};
      const sourceFolder = get(folderDictionaryFilterSelector({driveId: sourceDriveId, folderId: sourceFolderId}));
      if (destFolderId === void 0) {
        destFolderId = destDriveId;
        destParentFolderId = destDriveId;
      }
      let contentIds = {defaultOrder: []};
      let contentsDictionary = {};
      let folderInfo = {...sourceFolder.folderInfo};
      folderInfo.folderId = destFolderId;
      folderInfo.parentFolderId = destParentFolderId;
      for (let sourceItemId of sourceFolder.contentIds.defaultOrder) {
        const destItemId = nanoid();
        contentIds.defaultOrder.push(destItemId);
        let sourceItem = sourceFolder.contentsDictionary[sourceItemId];
        contentsDictionary[destItemId] = {...sourceItem};
        contentsDictionary[destItemId].parentFolderId = destFolderId;
        contentsDictionary[destItemId].itemId = destItemId;
        if (sourceItem.itemType === "Folder") {
          let childContentObjs = duplicateFolder({sourceFolderId: sourceItemId, sourceDriveId, destDriveId, destFolderId: destItemId, destParentFolderId: destFolderId});
          contentObjs = {...contentObjs, ...childContentObjs};
        } else if (sourceItem.itemType === "DoenetML") {
          let destDoenetId = nanoid();
          contentsDictionary[destItemId].sourceDoenetId = sourceItem.doenetId;
          contentsDictionary[destItemId].doenetId = destDoenetId;
        } else if (sourceItem.itemType === "URL") {
          let desturlId = nanoid();
          contentsDictionary[destItemId].urlId = desturlId;
        } else {
          console.log(`!!! Unsupported type ${sourceItem.itemType}`);
        }
        contentObjs[destItemId] = contentsDictionary[destItemId];
      }
      const destFolderObj = {contentIds, contentsDictionary, folderInfo};
      set(folderDictionary({driveId: destDriveId, folderId: destFolderId}), destFolderObj);
      return contentObjs;
    }
    if (labelTypeDriveIdColorImage.type === "new content drive") {
      newDrive = {
        driveId: labelTypeDriveIdColorImage.newDriveId,
        isShared: "0",
        label: labelTypeDriveIdColorImage.label,
        type: "content"
      };
      newDriveData.driveIdsAndLabels.unshift(newDrive);
      set(fetchDrivesQuery, newDriveData);
      const payload = {params};
      axios.get("/api/addDrive.php", payload);
    } else if (labelTypeDriveIdColorImage.type === "new course drive") {
      newDrive = {
        driveId: labelTypeDriveIdColorImage.newDriveId,
        isShared: "0",
        label: labelTypeDriveIdColorImage.label,
        type: "course",
        image: labelTypeDriveIdColorImage.image,
        color: labelTypeDriveIdColorImage.color,
        subType: "Administrator"
      };
      newDriveData.driveIdsAndLabels.unshift(newDrive);
      set(fetchDrivesQuery, newDriveData);
      const payload = {params};
      axios.get("/api/addDrive.php", payload);
    } else if (labelTypeDriveIdColorImage.type === "update drive label") {
      for (let [i, drive] of newDriveData.driveIdsAndLabels.entries()) {
        if (drive.driveId === labelTypeDriveIdColorImage.newDriveId) {
          let newDrive2 = {...drive};
          newDrive2.label = labelTypeDriveIdColorImage.label;
          newDriveData.driveIdsAndLabels[i] = newDrive2;
          break;
        }
      }
      set(fetchDrivesQuery, newDriveData);
      const payload = {params};
      axios.get("/api/updateDrive.php", payload);
    } else if (labelTypeDriveIdColorImage.type === "update drive color") {
    } else if (labelTypeDriveIdColorImage.type === "delete drive") {
      for (let [i, drive] of newDriveData.driveIdsAndLabels.entries()) {
        if (drive.driveId === labelTypeDriveIdColorImage.newDriveId) {
          newDriveData.driveIdsAndLabels.splice(i, 1);
          break;
        }
      }
      set(fetchDrivesQuery, newDriveData);
      const payload = {params};
      axios.get("/api/updateDrive.php", payload);
    }
  }
});
export default function CourseToolHandler(props) {
  console.log(">>>===CourseToolHandler");
  let lastAtomTool = useRef("");
  const setTool = useRecoilCallback(({set}) => (tool, lastAtomTool2) => {
    if (tool === "courseChooser") {
      set(toolViewAtom, {
        pageName: "Course",
        currentMainPanel: "DriveCards",
        currentMenus: ["CreateCourse", "CourseEnroll"],
        menusTitles: ["Create Course", "Enroll"],
        menusInitOpen: [true, false],
        toolHandler: "CourseToolHandler"
      });
      set(selectedMenuPanelAtom, "");
      set(mainPanelClickAtom, [{atom: drivecardSelectedNodesAtom, value: []}, {atom: selectedMenuPanelAtom, value: ""}]);
    } else if (tool === "navigation") {
      set(toolViewAtom, {
        pageName: "Course",
        currentMainPanel: "DrivePanel",
        currentMenus: ["AddDriveItems"],
        menusTitles: ["Add Items"],
        menusInitOpen: [true, false],
        toolHandler: "CourseToolHandler"
      });
      set(selectedMenuPanelAtom, "");
      set(mainPanelClickAtom, [{atom: globalSelectedNodesAtom, value: []}, {atom: selectedMenuPanelAtom, value: ""}]);
    } else if (tool === "editor") {
      set(toolViewAtom, {
        pageName: "Course",
        currentMainPanel: "EditorViewer",
        currentMenus: ["DoenetMLSettings", "VersionHistory", "Variant"],
        menusTitles: ["Settings", "Version History", "Variant"],
        menusInitOpen: [false, false, false],
        supportPanelOptions: ["DoenetMLEditor"],
        supportPanelTitles: ["DoenetML Editor"],
        supportPanelIndex: 0,
        headerControls: ["ViewerUpdateButton"],
        headerControlsPositions: ["Left"],
        toolHandler: "CourseToolHandler"
      });
      set(selectedMenuPanelAtom, "");
      set(mainPanelClickAtom, []);
    } else if (tool === "enrollment") {
      set(toolViewAtom, {
        pageName: "Course",
        currentMainPanel: "Enrollment",
        currentMenus: [],
        menusTitles: [],
        menusInitOpen: [],
        supportPanelOptions: [],
        supportPanelTitles: [],
        supportPanelIndex: 0,
        headerControls: ["CloseProfileButton"],
        headerControlsPositions: ["Right"],
        toolHandler: "CourseToolHandler"
      });
      set(selectedMenuPanelAtom, "");
      set(mainPanelClickAtom, []);
    } else {
      console.log(`>>>Course Tool Handler: tool '${tool}' didn't match!`);
    }
  });
  const atomTool = useRecoilValue(searchParamAtomFamily("tool"));
  const setParamObj = useSetRecoilState(paramObjAtom);
  if (atomTool !== lastAtomTool.current) {
    setTool(atomTool, lastAtomTool.current);
    lastAtomTool.current = atomTool;
  } else if (atomTool === "" && lastAtomTool.current === "") {
    setParamObj({tool: "courseChooser"});
  }
  return null;
}
