import React, {useContext, useRef, useEffect, Suspense, useCallback, useState} from "../../_snowpack/pkg/react.js";
import axios from "../../_snowpack/pkg/axios.js";
import {nanoid} from "../../_snowpack/pkg/nanoid.js";
import Measure from "../../_snowpack/pkg/react-measure.js";
import {
  faLink,
  faCode,
  faFolder,
  faChevronRight,
  faChevronDown,
  faUsersSlash,
  faUsers,
  faCheck,
  faUserEdit,
  faBookOpen,
  faChalkboard
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory,
  Link
} from "../../_snowpack/pkg/react-router-dom.js";
import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useSetRecoilState,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilState,
  useRecoilValue,
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import {
  DropTargetsContext,
  DropTargetsConstant,
  WithDropTarget
} from "../DropTarget/index.js";
import Draggable from "../Draggable/index.js";
import getSortOrder from "../../_utils/sort/LexicographicalRankingSort.js";
import {BreadcrumbContext} from "../Breadcrumb/index.js";
import {drivecardSelectedNodesAtom} from "../../library/Library.js";
import "../../_utils/util.css.proxy.js";
import {
  useDragShadowCallbacks,
  useSortFolder
} from "./DriveActions.js";
import {IsNavContext} from "../../_framework/Panels/NavPanel.js";
import {useToast} from "../../_framework/Toast.js";
import useKeyPressedListener from "../KeyPressedListener/useKeyPressedListener.js";
import {loadAssignmentSelector} from "../../course/Course.js";
import useSockets from "../Sockets.js";
const fetchDriveUsersQuery = atomFamily({
  key: "fetchDriveUsersQuery",
  default: selectorFamily({
    key: "fetchDriveUsersQuery/Default",
    get: (driveId) => async () => {
      const payload = {params: {driveId}};
      const {data} = await axios.get("/api/loadDriveUsers.php", payload);
      return data;
    }
  })
});
export const fetchDriveUsers = selectorFamily({
  key: "fetchDriveUsers",
  get: (driveId) => ({get}) => {
    return get(fetchDriveUsersQuery(driveId));
  },
  set: (driveId) => ({get, set}, instructions) => {
    let payload = {params: {
      email: instructions.email,
      type: instructions.type,
      driveId,
      userId: instructions.userId
    }};
    switch (instructions.type) {
      case "Add Owner":
        axios.get("/api/saveUserToDrive.php", payload).then((resp) => {
          instructions.callback(resp.data);
        });
        break;
      case "Add Owner step 2":
        set(fetchDriveUsersQuery(driveId), (was) => {
          let newDriveUsers = {...was};
          let newOwners = [...was.owners];
          newOwners.push({
            email: instructions.email,
            isUser: false,
            screenName: instructions.screenName,
            userId: instructions.userId
          });
          newDriveUsers["owners"] = newOwners;
          return newDriveUsers;
        });
        break;
      case "Add Admin":
        axios.get("/api/saveUserToDrive.php", payload).then((resp) => {
          instructions.callback(resp.data);
        });
        break;
      case "Add Admin step 2":
        set(fetchDriveUsersQuery(driveId), (was) => {
          let newDriveUsers = {...was};
          let newAdmins = [...was.admins];
          newAdmins.push({
            email: instructions.email,
            isUser: false,
            screenName: instructions.screenName,
            userId: instructions.userId
          });
          newDriveUsers["admins"] = newAdmins;
          return newDriveUsers;
        });
        break;
      case "Remove User":
        set(fetchDriveUsersQuery(driveId), (was) => {
          let newDriveUsers = {...was};
          if (instructions.userRole === "owner") {
            let newOwners = [...was.owners];
            for (let [i, owner] of newOwners.entries()) {
              if (owner.userId === instructions.userId) {
                newOwners.splice(i, 1);
                break;
              }
            }
            newDriveUsers["owners"] = newOwners;
          }
          if (instructions.userRole === "admin") {
            let newAdmins = [...was.admins];
            for (let [i, admin] of newAdmins.entries()) {
              if (admin.userId === instructions.userId) {
                newAdmins.splice(i, 1);
                break;
              }
            }
            newDriveUsers["admins"] = newAdmins;
          }
          return newDriveUsers;
        });
        axios.get("/api/saveUserToDrive.php", payload);
        break;
      case "To Owner":
        set(fetchDriveUsersQuery(driveId), (was) => {
          let newDriveUsers = {...was};
          let userEntry = {};
          let newAdmins = [...was.admins];
          for (let [i, admin] of newAdmins.entries()) {
            if (admin.userId === instructions.userId) {
              userEntry = admin;
              newAdmins.splice(i, 1);
              break;
            }
          }
          newDriveUsers["admins"] = newAdmins;
          let newOwners = [...was.owners];
          newOwners.push(userEntry);
          newDriveUsers["owners"] = newOwners;
          return newDriveUsers;
        });
        axios.get("/api/saveUserToDrive.php", payload);
        break;
      case "To Admin":
        set(fetchDriveUsersQuery(driveId), (was) => {
          let newDriveUsers = {...was};
          let userEntry = {};
          let newOwners = [...was.owners];
          for (let [i, owner] of newOwners.entries()) {
            if (owner.userId === instructions.userId) {
              if (owner.isUser) {
                newDriveUsers.usersRole = "admin";
              }
              userEntry = owner;
              newOwners.splice(i, 1);
              break;
            }
          }
          newDriveUsers["owners"] = newOwners;
          let newAdmins = [...was.admins];
          newAdmins.push(userEntry);
          newDriveUsers["admins"] = newAdmins;
          return newDriveUsers;
        });
        axios.get("/api/saveUserToDrive.php", payload);
        break;
      default:
        console.log(`type ${instructions.type} not handled`);
    }
  }
});
export const sortOptions = Object.freeze({
  DEFAULT: "defaultOrder",
  LABEL_ASC: "label ascending",
  LABEL_DESC: "label descending",
  CREATION_DATE_ASC: "creation date ascending",
  CREATION_DATE_DESC: "creation date descending"
});
export const globalSelectedNodesAtom = atom({
  key: "globalSelectedNodesAtom",
  default: []
});
export const selectedDriveAtom = atom({
  key: "selectedDriveAtom",
  default: ""
});
export const dragStateAtom = atom({
  key: "dragStateAtom",
  default: {
    isDragging: false,
    draggedItemsId: null,
    draggedOverDriveId: null,
    initialDriveId: null,
    isDraggedOverBreadcrumb: false,
    dragShadowDriveId: null,
    dragShadowParentId: null,
    openedFoldersInfo: null,
    copyMode: false
  }
});
const dragShadowId = "dragShadow";
export default function Drive(props) {
  const isNav = useContext(IsNavContext);
  const drivesAvailable = useRecoilValueLoadable(fetchDrivesQuery);
  if (drivesAvailable.state === "loading") {
    return null;
  }
  if (drivesAvailable.state === "hasError") {
    console.error(drivesAvailable.contents);
    return null;
  }
  if (props.types) {
    let drives = [];
    for (let type of props.types) {
      for (let driveObj of drivesAvailable.contents.driveIdsAndLabels) {
        if (driveObj.type === type && driveObj.subType === "Administrator") {
          drives.push(/* @__PURE__ */ React.createElement(React.Fragment, {
            key: `drive${driveObj.driveId}${isNav}`
          }, /* @__PURE__ */ React.createElement(Router, null, /* @__PURE__ */ React.createElement(Switch, null, /* @__PURE__ */ React.createElement(Route, {
            path: "/",
            render: (routeprops) => /* @__PURE__ */ React.createElement(Suspense, {
              fallback: /* @__PURE__ */ React.createElement("div", null)
            }, /* @__PURE__ */ React.createElement(DriveRouted, {
              route: {...routeprops},
              driveId: driveObj.driveId,
              label: driveObj.label,
              isNav,
              ...props,
              driveObj
            }))
          })))));
        }
      }
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, drives);
  } else if (props.driveId) {
    for (let driveObj of drivesAvailable.contents.driveIdsAndLabels) {
      if (driveObj.driveId === props.driveId) {
        return /* @__PURE__ */ React.createElement(Router, null, /* @__PURE__ */ React.createElement(Switch, null, /* @__PURE__ */ React.createElement(Route, {
          path: "/",
          render: (routeprops) => /* @__PURE__ */ React.createElement(Suspense, {
            fallback: /* @__PURE__ */ React.createElement("div", null)
          }, /* @__PURE__ */ React.createElement(DriveRouted, {
            route: {...routeprops},
            driveId: driveObj.driveId,
            label: driveObj.label,
            isNav,
            ...props,
            driveObj
          }))
        })));
      }
    }
    console.warn("Don't have a drive with driveId ", props.id);
    return null;
  } else {
    console.warn("Drive needs types or driveId defined.");
    return null;
  }
}
export const loadDriveInfoQuery = selectorFamily({
  key: "loadDriveInfoQuery",
  get: (driveId) => async ({get, set}) => {
    const {data} = await axios.get(`/api/loadFolderContent.php?driveId=${driveId}&init=true`);
    return data;
  }
});
let driveInstanceIdDictionary = atomFamily({
  key: "driveInstanceIdDictionary",
  default: []
});
export const folderDictionary = atomFamily({
  key: "folderDictionary",
  default: selectorFamily({
    key: "folderDictionary/Default",
    get: (driveIdFolderId) => ({get}) => {
      if (driveIdFolderId.driveId === "") {
        return {folderInfo: {}, contentsDictionary: {}, contentIds: {}};
      }
      const driveInfo = get(loadDriveInfoQuery(driveIdFolderId.driveId));
      let defaultOrder = [];
      let contentsDictionary = {};
      let contentIds = {};
      let folderInfo = {};
      for (let item of driveInfo.results) {
        if (item.parentFolderId === driveIdFolderId.folderId) {
          defaultOrder.push(item.itemId);
          contentsDictionary[item.itemId] = item;
        }
        if (item.itemId === driveIdFolderId.folderId) {
          folderInfo = item;
        }
      }
      defaultOrder = sortItems({sortKey: sortOptions.DEFAULT, nodeObjs: contentsDictionary, defaultFolderChildrenIds: defaultOrder});
      contentIds[sortOptions.DEFAULT] = defaultOrder;
      return {folderInfo, contentsDictionary, contentIds};
    }
  })
});
export const folderDictionaryFilterAtom = atomFamily({
  key: "folderDictionaryFilterAtom",
  default: selectorFamily({
    key: "folderDictionaryFilterAtom/Default",
    get: (driveId) => () => {
      return "All";
    }
  })
});
export const folderDictionaryFilterSelector = selectorFamily({
  get: (driveIdFolderId) => ({get}) => {
    const filter = get(folderDictionaryFilterAtom({driveId: driveIdFolderId.driveId}));
    const fD = get(folderDictionary(driveIdFolderId));
    let fDreturn = {...fD};
    fDreturn.contentIds = {...fD.contentIds};
    if (filter === "Released Only") {
      let newDefaultOrder = [];
      for (let contentId of fD.contentIds.defaultOrder) {
        if (fD.contentsDictionary[contentId].isReleased === "1" || fD.contentsDictionary[contentId].itemType === "Folder") {
          newDefaultOrder.push(contentId);
        }
      }
      fDreturn.contentIds.defaultOrder = newDefaultOrder;
    } else if (filter === "Assigned Only") {
      let newDefaultOrder = [];
      for (let contentId of fD.contentIds.defaultOrder) {
        if (fD.contentsDictionary[contentId].isAssigned === "1" || fD.contentsDictionary[contentId].itemType === "Folder") {
          newDefaultOrder.push(contentId);
        }
      }
      fDreturn.contentIds.defaultOrder = newDefaultOrder;
    }
    return fDreturn;
  }
});
export const folderSortOrderAtom = atomFamily({
  key: "folderSortOrderAtom",
  default: sortOptions.DEFAULT
});
export const folderCacheDirtyAtom = atomFamily({
  key: "foldedCacheDirtyAtom",
  default: false
});
export const folderInfoSelector = selectorFamily({
  get: (driveIdInstanceIdFolderId) => ({get}) => {
    const {driveId, folderId} = driveIdInstanceIdFolderId;
    const {folderInfo, contentsDictionary, contentIds} = get(folderDictionaryFilterSelector({driveId, folderId}));
    const folderSortOrder = get(folderSortOrderAtom(driveIdInstanceIdFolderId));
    let contentIdsArr = contentIds[folderSortOrder] ?? [];
    const sortedContentIdsNotInCache = !contentIdsArr.length && contentIds[sortOptions.DEFAULT].length;
    if (sortedContentIdsNotInCache) {
      contentIdsArr = sortItems({sortKey: folderSortOrder, nodeObjs: contentsDictionary, defaultFolderChildrenIds: contentIds[sortOptions.DEFAULT]});
    }
    let newFolderInfo = {...folderInfo};
    newFolderInfo.sortBy = folderSortOrder;
    return {folderInfo: newFolderInfo, contentsDictionary, contentIdsArr};
  }
});
export const sortItems = ({sortKey, nodeObjs, defaultFolderChildrenIds}) => {
  let tempArr = [...defaultFolderChildrenIds];
  switch (sortKey) {
    case sortOptions.DEFAULT:
      tempArr.sort((a, b) => {
        return nodeObjs[a].sortOrder.localeCompare(nodeObjs[b].sortOrder);
      });
      break;
    case sortOptions.LABEL_ASC:
      tempArr.sort((a, b) => {
        return nodeObjs[a].label.localeCompare(nodeObjs[b].label);
      });
      break;
    case sortOptions.LABEL_DESC:
      tempArr.sort((b, a) => {
        return nodeObjs[a].label.localeCompare(nodeObjs[b].label);
      });
      break;
    case sortOptions.CREATION_DATE_ASC:
      tempArr.sort((a, b) => {
        return new Date(nodeObjs[a].creationDate) - new Date(nodeObjs[b].creationDate);
      });
      break;
    case sortOptions.CREATION_DATE_DESC:
      tempArr.sort((b, a) => {
        return new Date(nodeObjs[a].creationDate) - new Date(nodeObjs[b].creationDate);
      });
      break;
  }
  return tempArr;
};
export const getLexicographicOrder = ({index, nodeObjs, defaultFolderChildrenIds = []}) => {
  let prevItemId = "";
  let nextItemId = "";
  let prevItemOrder = "";
  let nextItemOrder = "";
  if (defaultFolderChildrenIds.length !== 0) {
    if (index <= 0) {
      nextItemId = defaultFolderChildrenIds[0];
    } else if (index >= defaultFolderChildrenIds.length) {
      prevItemId = defaultFolderChildrenIds[defaultFolderChildrenIds.length - 1];
    } else {
      prevItemId = defaultFolderChildrenIds[index - 1];
      nextItemId = defaultFolderChildrenIds[index];
    }
    if (nodeObjs[prevItemId])
      prevItemOrder = nodeObjs?.[prevItemId]?.sortOrder ?? "";
    if (nodeObjs[nextItemId])
      nextItemOrder = nodeObjs?.[nextItemId]?.sortOrder ?? "";
  }
  const sortOrder = getSortOrder(prevItemOrder, nextItemOrder);
  return sortOrder;
};
function DriveHeader(props) {
  let latestWidth = useRef(0);
  function updateNumColumns(width) {
    const maxColumns = props.columnTypes.length + 1;
    const breakpoints = [375, 500, 650, 800];
    if (width >= breakpoints[3] && props.numColumns !== 5) {
      const numColumns = Math.min(maxColumns, 5);
      if (props.setNumColumns) {
        props.setNumColumns(numColumns);
      }
    } else if (width < breakpoints[3] && width >= breakpoints[2] && props.numColumns !== 4) {
      const numColumns = Math.min(maxColumns, 4);
      if (props.setNumColumns) {
        props.setNumColumns(numColumns);
      }
    } else if (width < breakpoints[2] && width >= breakpoints[1] && props.numColumns !== 3) {
      const numColumns = Math.min(maxColumns, 3);
      if (props.setNumColumns) {
        props.setNumColumns(numColumns);
      }
    } else if (width < breakpoints[1] && width >= breakpoints[0] && props.numColumns !== 2) {
      const numColumns = Math.min(maxColumns, 2);
      if (props.setNumColumns) {
        props.setNumColumns(numColumns);
      }
    } else if (width < breakpoints[0] && props.numColumns !== 1) {
      if (props.setNumColumns) {
        props.setNumColumns(1);
      }
    }
  }
  useEffect(() => {
    updateNumColumns(latestWidth.current);
  }, [props.columnTypes.length]);
  let columns = "250px repeat(4,1fr)";
  if (props.numColumns === 4) {
    columns = "250px repeat(3,1fr)";
  } else if (props.numColumns === 3) {
    columns = "250px 1fr 1fr";
  } else if (props.numColumns === 2) {
    columns = "250px 1fr";
  } else if (props.numColumns === 1) {
    columns = "100%";
  }
  return /* @__PURE__ */ React.createElement(Measure, {
    bounds: true,
    onResize: (contentRect) => {
      const width = contentRect.bounds.width;
      latestWidth.current = width;
      updateNumColumns(contentRect.bounds.width);
    }
  }, ({measureRef}) => /* @__PURE__ */ React.createElement("div", {
    ref: measureRef,
    "data-doenet-driveinstanceid": props.driveInstanceId,
    className: "noselect nooutline",
    style: {
      padding: "8px",
      border: "0px",
      borderBottom: "1px solid grey",
      maxWidth: "850px",
      margin: "0px"
    }
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: columns,
      gridTemplateRows: "1fr",
      alignContent: "center"
    }
  }, /* @__PURE__ */ React.createElement("span", null, "Name"), props.numColumns >= 2 && props.columnTypes[0] ? /* @__PURE__ */ React.createElement("span", {
    style: {textAlign: "center"}
  }, props.columnTypes[0]) : null, props.numColumns >= 3 && props.columnTypes[1] ? /* @__PURE__ */ React.createElement("span", {
    style: {textAlign: "center"}
  }, props.columnTypes[1]) : null, props.numColumns >= 4 && props.columnTypes[2] ? /* @__PURE__ */ React.createElement("span", {
    style: {textAlign: "center"}
  }, props.columnTypes[2]) : null, props.numColumns >= 5 && props.columnTypes[3] ? /* @__PURE__ */ React.createElement("span", {
    style: {textAlign: "center"}
  }, props.columnTypes[3]) : null)));
}
function DriveRouted(props) {
  let columnTypes = [];
  if (props.columnTypes) {
    columnTypes = props.columnTypes;
  }
  const [numColumns, setNumColumns] = useState(1);
  const {onDragEnterInvalidArea, registerDropTarget, unregisterDropTarget} = useDnDCallbacks();
  const drivePath = useRecoilValue(drivePathSyncFamily(props.drivePathSyncKey));
  let hideUnpublished = false;
  if (props.hideUnpublished) {
    hideUnpublished = props.hideUnpublished;
  }
  const setDriveInstanceId = useSetRecoilState(driveInstanceIdDictionary(props.driveId));
  let driveInstanceId = useRef("");
  const path = Object.fromEntries(new URLSearchParams(props.route.location.search))?.path;
  useUpdateBreadcrumb({driveId: props.driveId, driveLabel: props.driveObj.label, path});
  if (driveInstanceId.current === "") {
    driveInstanceId.current = nanoid();
    setDriveInstanceId((old) => {
      let newArr = [...old];
      newArr.push(driveInstanceId.current);
      return newArr;
    });
  }
  let pathFolderId = props.driveId;
  let routePathDriveId = drivePath.driveId;
  let routePathFolderId = drivePath.parentFolderId;
  let pathItemId = drivePath.itemId;
  if (routePathFolderId !== "") {
    pathFolderId = routePathFolderId;
  }
  let rootFolderId = pathFolderId;
  if (props.isNav) {
    rootFolderId = props.driveId;
  }
  if (!props.isNav && (routePathDriveId === "" || props.driveId !== routePathDriveId))
    return /* @__PURE__ */ React.createElement(React.Fragment, null);
  let heading = null;
  if (!props.isNav) {
    heading = /* @__PURE__ */ React.createElement(DriveHeader, {
      driveInstanceId: props.driveInstanceId,
      numColumns,
      setNumColumns,
      columnTypes
    });
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, heading, /* @__PURE__ */ React.createElement(Folder, {
    driveId: props.driveId,
    folderId: rootFolderId,
    indentLevel: 0,
    driveObj: props.driveObj,
    rootCollapsible: props.rootCollapsible,
    driveInstanceId: driveInstanceId.current,
    isNav: props.isNav,
    urlClickBehavior: props.urlClickBehavior,
    route: props.route,
    pathItemId,
    hideUnpublished,
    foldersOnly: props.foldersOnly,
    doenetMLDoubleClickCallback: props.doenetMLDoubleClickCallback,
    numColumns,
    columnTypes,
    drivePathSyncKey: props.drivePathSyncKey
  }), /* @__PURE__ */ React.createElement(WithDropTarget, {
    key: DropTargetsConstant.INVALID_DROP_AREA_ID,
    id: DropTargetsConstant.INVALID_DROP_AREA_ID,
    registerDropTarget,
    unregisterDropTarget,
    dropCallbacks: {onDragEnter: onDragEnterInvalidArea}
  }));
}
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
export const folderOpenAtom = atomFamily({
  key: "folderOpenAtom",
  default: false
});
const folderOpenSelector = selectorFamily({
  key: "folderOpenSelector",
  get: (driveInstanceIdItemId) => ({get}) => {
    return get(folderOpenAtom(driveInstanceIdItemId));
  },
  set: (driveInstanceIdDriveIdItemId) => ({get, set}) => {
    const isOpen = get(folderOpenAtom(driveInstanceIdDriveIdItemId));
    if (isOpen) {
      const folder = get(folderDictionaryFilterSelector({driveId: driveInstanceIdDriveIdItemId.driveId, folderId: driveInstanceIdDriveIdItemId.itemId}));
      const itemIds = folder.contentIds.defaultOrder;
      const globalItemsSelected = get(globalSelectedNodesAtom);
      let newGlobalSelected = [];
      for (let itemObj of globalItemsSelected) {
        if (itemIds.includes(itemObj.itemId)) {
          const {parentFolderId, ...atomFormat} = itemObj;
          set(selectedDriveItemsAtom(atomFormat), false);
        } else {
          newGlobalSelected.push(itemObj);
        }
      }
      set(globalSelectedNodesAtom, newGlobalSelected);
    }
    set(folderOpenAtom(driveInstanceIdDriveIdItemId), !isOpen);
  }
});
export let encodeParams = (p) => Object.entries(p).map((kv) => kv.map(encodeURIComponent).join("=")).join("&");
export const drivePathSyncFamily = atomFamily({
  key: "drivePathSyncFamily",
  default: {
    driveId: "",
    parentFolderId: "",
    itemId: "",
    type: ""
  }
});
function Folder(props) {
  let itemId = props?.folderId;
  if (!itemId) {
    itemId = props.driveId;
  }
  let drivePathSyncKey = props.drivePathSyncKey;
  if (!drivePathSyncKey) {
    drivePathSyncKey = "_";
  }
  const setDrivePath = useSetRecoilState(drivePathSyncFamily(drivePathSyncKey));
  const [folderInfoObj, setFolderInfo] = useRecoilStateLoadable(folderInfoSelector({driveId: props.driveId, instanceId: props.driveInstanceId, folderId: props.folderId}));
  const {onDragStart, onDrag, onDragOverContainer, onDragEnd, onDragExit, renderDragGhost, registerDropTarget, unregisterDropTarget} = useDnDCallbacks();
  const {dropState} = useContext(DropTargetsContext);
  const [dragState, setDragState] = useRecoilState(dragStateAtom);
  const parentFolderSortOrder = useRecoilValue(folderSortOrderAtom({driveId: props.driveId, instanceId: props.driveInstanceId, folderId: props.item?.parentFolderId}));
  const parentFolderSortOrderRef = useRef(parentFolderSortOrder);
  const [selectedDrive, setSelectedDrive] = useRecoilState(selectedDriveAtom);
  const setSelected = useSetRecoilState(selectedDriveItems({driveId: props.driveId, driveInstanceId: props.driveInstanceId, itemId}));
  const isSelected = useRecoilValue(selectedDriveItemsAtom({driveId: props.driveId, driveInstanceId: props.driveInstanceId, itemId}));
  const {deleteItem} = useSockets("drive");
  const deleteItemCallback = (itemId2) => {
    deleteItem({
      driveIdFolderId: {driveId: props.driveId, folderId: props.folderId},
      driveInstanceId: props.driveInstanceId,
      itemId: itemId2
    });
  };
  const globalSelectedNodes = useRecoilValue(globalSelectedNodesAtom);
  const clearSelections = useSetRecoilState(clearDriveAndItemSelections);
  const isOpen = useRecoilValue(folderOpenAtom({driveInstanceId: props.driveInstanceId, driveId: props.driveId, itemId: props.folderId}));
  const toggleOpen = useSetRecoilState(folderOpenSelector({driveInstanceId: props.driveInstanceId, driveId: props.driveId, itemId: props.folderId}));
  const isOpenRef = useRef(isOpen);
  const isSelectedRef = useRef(isSelected);
  const [addToast, ToastType] = useToast();
  const {sortFolder, invalidateSortCache, onSortFolderError} = useSortFolder();
  const {insertDragShadow, removeDragShadow} = useDragShadowCallbacks();
  const setInstanceParentId = useSetRecoilState(driveInstanceParentFolderIdAtom(props.driveInstanceId));
  useEffect(() => {
    setInstanceParentId(props.pathItemId);
  }, [props.pathItemId]);
  const indentPx = 25;
  let bgcolor = "#ffffff";
  let borderSide = "0px";
  let marginSize = "0";
  let widthSize = "60vw";
  if (props.isNav) {
    marginSize = "0px";
    widthSize = "224px";
  }
  ;
  if (isSelected) {
    bgcolor = "hsl(209,54%,82%)";
  }
  if (isSelected && dragState.isDragging) {
    bgcolor = "#e2e2e2";
  }
  const isDraggedOver = dropState.activeDropTargetId === itemId && !dragState.draggedItemsId?.has(itemId);
  if (isDraggedOver) {
    bgcolor = "#f0f0f0";
  }
  const isDropTargetFolder = dragState.dragShadowParentId === itemId;
  if (isDropTargetFolder) {
    bgcolor = "hsl(209,54%,82%)";
  }
  useEffect(() => {
    isOpenRef.current = isOpen;
    isSelectedRef.current = isSelected;
  }, [isOpen, isSelected]);
  useEffect(() => {
    parentFolderSortOrderRef.current = parentFolderSortOrder;
  }, [parentFolderSortOrder]);
  if (props.isNav && itemId === props.pathItemId) {
    borderSide = "8px solid #1A5A99";
  }
  if (folderInfoObj.state === "loading") {
    return null;
  }
  if (folderInfoObj.state === "hasError") {
    console.error(folderInfoObj.contents);
    return null;
  }
  let {folderInfo, contentsDictionary, contentIdsArr} = folderInfoObj.contents;
  let openCloseText = isOpen ? /* @__PURE__ */ React.createElement("span", {
    "data-cy": "folderToggleCloseIcon"
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faChevronDown
  })) : /* @__PURE__ */ React.createElement("span", {
    "data-cy": "folderToggleOpenIcon"
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faChevronRight
  }));
  let openCloseButton = /* @__PURE__ */ React.createElement("button", {
    style: {border: "none", backgroundColor: bgcolor, borderRadius: "5px"},
    "data-doenet-driveinstanceid": props.driveInstanceId,
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleOpen();
    }
  }, openCloseText);
  const sortHandler = ({sortKey}) => {
    const result = sortFolder({
      driveIdInstanceIdFolderId: {driveInstanceId: props.driveInstanceId, driveId: props.driveId, folderId: props.folderId},
      sortKey
    });
    result.then((resp) => {
    }).catch((e) => {
      onSortFolderError({errorMessage: e.message});
    });
  };
  const markFolderDraggedOpened = () => {
    setDragState((old) => {
      let newOpenedFoldersInfo = [...old.openedFoldersInfo];
      newOpenedFoldersInfo.push({driveInstanceId: props.driveInstanceId, driveId: props.driveId, itemId: props.folderId});
      return {
        ...old,
        openedFoldersInfo: newOpenedFoldersInfo
      };
    });
  };
  const onDragOver = ({x, y, dropTargetRef}) => {
    onDragOverContainer({id: props.folderId, driveId: props.driveId});
    if (props.isNav) {
      removeDragShadow();
      insertDragShadow({
        driveIdFolderId: {driveId: props.driveId, folderId: props.folderId},
        parentId: props.folderId,
        position: "intoCurrent"
      });
      return;
    }
    const dropTargetTopY = dropTargetRef?.offsetTop;
    const dropTargetHeight = dropTargetRef?.clientHeight;
    const cursorY = y;
    const cursorArea = (cursorY - dropTargetTopY) / dropTargetHeight;
    if (parentFolderSortOrderRef.current === sortOptions.DEFAULT) {
      if (cursorArea < 0.5) {
        insertDragShadow({
          driveIdFolderId: {driveId: props.driveId, folderId: props.folderId},
          position: "beforeCurrent",
          itemId: props.folderId,
          parentId: props.item?.parentFolderId
        });
      } else if (cursorArea < 1) {
        insertDragShadow({
          driveIdFolderId: {driveId: props.driveId, folderId: props.folderId},
          position: "afterCurrent",
          itemId: props.folderId,
          parentId: props.item?.parentFolderId
        });
      }
    } else {
      removeDragShadow();
    }
  };
  const onDragHover = () => {
    if (props.isNav)
      return;
    if (!isOpenRef.current && !isSelectedRef.current) {
      toggleOpen();
      markFolderDraggedOpened();
    }
    insertDragShadow({
      driveIdFolderId: {driveId: props.driveId, folderId: props.folderId},
      parentId: props.folderId,
      position: "intoCurrent"
    });
  };
  const onDrop = () => {
  };
  const onDragEndCb = () => {
    onDragEnd();
  };
  let label = folderInfo?.label;
  let folder = null;
  let items = null;
  if (!props.driveObj) {
    folder = /* @__PURE__ */ React.createElement("div", {
      "data-doenet-driveinstanceid": props.driveInstanceId,
      "data-cy": "driveItem",
      tabIndex: 0,
      className: "noselect nooutline",
      style: {
        cursor: "pointer",
        padding: "8px",
        border: "0px",
        borderBottom: "2px solid black",
        backgroundColor: bgcolor,
        marginLeft: marginSize,
        borderLeft: borderSide
      },
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (props.isNav) {
          clearSelections();
          setDrivePath({driveId: props.driveId, parentFolderId: itemId, itemId, type: "Folder"});
        } else {
          e.preventDefault();
          e.stopPropagation();
          if (!e.shiftKey && !e.metaKey) {
            setSelected({instructionType: "one item", parentFolderId: props.parentFolderId});
          } else if (e.shiftKey && !e.metaKey) {
            setSelected({instructionType: "range to item", parentFolderId: props.parentFolderId});
          } else if (!e.shiftKey && e.metaKey) {
            setSelected({instructionType: "add item", parentFolderId: props.parentFolderId});
          }
        }
        setSelectedDrive(props.driveId);
      },
      onDoubleClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDrivePath({driveId: props.driveId, parentFolderId: itemId, itemId, type: "Folder"});
      },
      onBlur: (e) => {
        if (!props.isNav) {
        }
      }
    }, /* @__PURE__ */ React.createElement("div", {
      className: "noselect",
      style: {
        marginLeft: `${props.indentLevel * indentPx}px`,
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "1fr",
        alignContent: "center"
      }
    }, /* @__PURE__ */ React.createElement("div", {
      style: {display: "inline", margin: "0px"}
    }, openCloseButton, /* @__PURE__ */ React.createElement("span", {
      "data-cy": "folderIcon"
    }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faFolder
    })), /* @__PURE__ */ React.createElement("span", {
      "data-cy": "folderLabel"
    }, label))));
  } else if (props.driveObj && props.isNav) {
    let driveIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faBookOpen
    });
    if (props.driveObj?.type === "course") {
      driveIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
        icon: faChalkboard
      });
    }
    label = props.driveObj.label;
    folder = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
      "data-doenet-driveinstanceid": props.driveInstanceId,
      "data-cy": "navDriveHeader",
      tabIndex: 0,
      className: "noselect nooutline",
      style: {
        cursor: "pointer",
        padding: "12.5px",
        border: "0px",
        borderBottom: "2px solid black",
        backgroundColor: bgcolor,
        marginLeft: marginSize,
        fontSize: "24px",
        borderLeft: borderSide
      },
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (props.isNav) {
          clearSelections();
          setDrivePath({driveId: props.driveId, parentFolderId: itemId, itemId, type: "Drive"});
        }
        setSelectedDrive(props.driveId);
      }
    }, driveIcon, " ", label));
    if (props.rootCollapsible) {
      folder = /* @__PURE__ */ React.createElement("div", {
        "data-doenet-driveinstanceid": props.driveInstanceId,
        tabIndex: 0,
        className: "noselect nooutline",
        style: {
          cursor: "pointer",
          padding: "12.5px",
          border: "0px",
          borderBottom: "2px solid black",
          backgroundColor: bgcolor,
          marginLeft: marginSize,
          fontSize: "24px",
          borderLeft: borderSide
        }
      }, " ", openCloseButton, " Drive ", label);
    }
  }
  let draggableClassName = "";
  if (!props.isNav) {
    const onDragStartCallback = () => {
      if (globalSelectedNodes.length === 0 || !isSelected) {
        setSelected({instructionType: "clear all"});
        setSelected({instructionType: "one item", parentFolderId: props.parentFolderId});
      }
    };
    folder = /* @__PURE__ */ React.createElement(Draggable, {
      key: `dnode${props.driveInstanceId}${props.folderId}`,
      id: props.folderId,
      className: draggableClassName,
      onDragStart: ({ev}) => onDragStart({ev, nodeId: props.folderId, driveId: props.driveId, onDragStartCallback}),
      onDrag,
      onDragEnd: onDragEndCb,
      ghostElement: renderDragGhost(props.folderId, folder)
    }, folder);
  }
  const dropTargetId = props.driveObj ? props.driveId : props.folderId;
  folder = /* @__PURE__ */ React.createElement(WithDropTarget, {
    key: `wdtnode${props.driveInstanceId}${props.folderId}`,
    id: dropTargetId,
    registerDropTarget,
    unregisterDropTarget,
    dropCallbacks: {
      onDragOver,
      onDragHover,
      onDragExit: () => {
        onDragExit({driveId: props.driveId, itemId: props.folderId});
      },
      onDrop
    }
  }, folder);
  if (isOpen || props.driveObj && !props.rootCollapsible) {
    let dictionary = contentsDictionary;
    items = [];
    for (let itemId2 of contentIdsArr) {
      let item = dictionary[itemId2];
      if (!item)
        continue;
      if (props.hideUnpublished && item.isPublished === "0") {
        if (item.assignment_isPublished != "1")
          continue;
      }
      if (props.foldersOnly) {
        if (item.itemType === "Folder") {
          items.push(/* @__PURE__ */ React.createElement(Folder, {
            key: `item${itemId2}${props.driveInstanceId}`,
            driveId: props.driveId,
            folderId: itemId2,
            item,
            indentLevel: props.indentLevel + 1,
            driveInstanceId: props.driveInstanceId,
            route: props.route,
            isNav: props.isNav,
            urlClickBehavior: props.urlClickBehavior,
            pathItemId: props.pathItemId,
            deleteItem: deleteItemCallback,
            parentFolderId: props.folderId,
            hideUnpublished: props.hideUnpublished,
            foldersOnly: props.foldersOnly,
            drivePathSyncKey: props.drivePathSyncKey
          }));
        }
      } else {
        switch (item.itemType) {
          case "Folder":
            items.push(/* @__PURE__ */ React.createElement(Folder, {
              key: `item${itemId2}${props.driveInstanceId}`,
              driveId: props.driveId,
              folderId: item.itemId,
              item,
              indentLevel: props.indentLevel + 1,
              driveInstanceId: props.driveInstanceId,
              route: props.route,
              isNav: props.isNav,
              urlClickBehavior: props.urlClickBehavior,
              pathItemId: props.pathItemId,
              deleteItem: deleteItemCallback,
              parentFolderId: props.folderId,
              hideUnpublished: props.hideUnpublished,
              foldersOnly: props.foldersOnly,
              doenetMLDoubleClickCallback: props.doenetMLDoubleClickCallback,
              numColumns: props.numColumns,
              columnTypes: props.columnTypes,
              drivePathSyncKey: props.drivePathSyncKey
            }));
            break;
          case "DoenetML":
            items.push(/* @__PURE__ */ React.createElement(DoenetML, {
              key: `item${itemId2}${props.driveInstanceId}`,
              driveId: props.driveId,
              item,
              indentLevel: props.indentLevel + 1,
              driveInstanceId: props.driveInstanceId,
              route: props.route,
              isNav: props.isNav,
              pathItemId: props.pathItemId,
              doubleClickCallback: props.doenetMLDoubleClickCallback,
              deleteItem: deleteItemCallback,
              numColumns: props.numColumns,
              columnTypes: props.columnTypes,
              setDrivePath
            }));
            break;
          case "DragShadow":
            items.push(/* @__PURE__ */ React.createElement(DragShadow, {
              key: `dragShadow${itemId2}${props.driveInstanceId}`,
              indentLevel: props.indentLevel + 1
            }));
            break;
          default:
            console.warn(`Item not rendered of type ${item.itemType}`);
        }
      }
    }
    if (contentIdsArr.length === 0 && !props.foldersOnly) {
      items.push(/* @__PURE__ */ React.createElement(EmptyNode, {
        key: `emptyitem${folderInfo?.itemId}`
      }));
    }
  }
  return /* @__PURE__ */ React.createElement("div", {
    "data-cy": "drive"
  }, folder, items);
}
const EmptyNode = React.memo(function Node() {
  return /* @__PURE__ */ React.createElement("div", {
    style: {
      padding: "8px",
      marginLeft: "47.5%"
    }
  }, /* @__PURE__ */ React.createElement("div", {
    className: "noselect",
    style: {justifyContent: "center"}
  }, "EMPTY"));
});
const DragShadow = React.memo(function Node2(props) {
  const indentPx = 30;
  return /* @__PURE__ */ React.createElement("div", {
    "data-cy": "dragShadow",
    style: {
      width: "100%",
      height: "33px",
      marginLeft: `${props.indentLevel * indentPx}px`,
      padding: "0px",
      backgroundColor: "#f5f5f5",
      color: "#f5f5f5",
      boxShadow: "0 0 3px rgba(0, 0, 0, .2)",
      border: "2px dotted #14c6ff"
    }
  }, /* @__PURE__ */ React.createElement("div", {
    className: "noselect"
  }, "."));
});
export const selectedDriveItemsAtom = atomFamily({
  key: "selectedDriveItemsAtom",
  default: false
});
export const clearDriveAndItemSelections = selector({
  key: "clearDriveAndItemSelections",
  set: ({get, set}) => {
    const globalItemsSelected = get(globalSelectedNodesAtom);
    for (let itemObj of globalItemsSelected) {
      const {parentFolderId, ...atomFormat} = itemObj;
      set(selectedDriveItemsAtom(atomFormat), false);
    }
    if (globalItemsSelected.length > 0) {
      set(globalSelectedNodesAtom, []);
    }
    const globalDrivesSelected = get(drivecardSelectedNodesAtom);
    if (globalDrivesSelected.length > 0) {
      set(drivecardSelectedNodesAtom, []);
    }
  }
});
const driveInstanceParentFolderIdAtom = atomFamily({
  key: "driveInstanceParentFolderIdAtom",
  default: selectorFamily({
    key: "driveInstanceParentFolderIdAtom/Default",
    get: (driveInstanceId) => () => {
      return driveInstanceId;
    }
  })
});
const selectedDriveItems = selectorFamily({
  key: "selectedDriveItems",
  set: (driveIdDriveInstanceIdItemId) => ({get, set}, instruction) => {
    const globalSelected = get(globalSelectedNodesAtom);
    const isSelected = get(selectedDriveItemsAtom(driveIdDriveInstanceIdItemId));
    const {driveId, driveInstanceId, itemId} = driveIdDriveInstanceIdItemId;
    let lastSelectedItem = globalSelected[globalSelected.length - 1];
    function buildItemIdsAndParentIds({parentFolderId, driveInstanceId: driveInstanceId2, driveId: driveId2, itemIdArr = [], parentFolderIdArr = []}) {
      const folderObj = get(folderDictionaryFilterSelector({driveId: driveId2, folderId: parentFolderId}));
      for (let itemId2 of folderObj.contentIds.defaultOrder) {
        itemIdArr.push(itemId2);
        parentFolderIdArr.push(parentFolderId);
        if (folderObj.contentsDictionary[itemId2].itemType === "Folder") {
          const isOpen = get(folderOpenAtom({driveInstanceId: driveInstanceId2, driveId: driveId2, itemId: itemId2}));
          if (isOpen) {
            const [folderItemIdArr, folderParentFolderIdsArr] = buildItemIdsAndParentIds({parentFolderId: itemId2, driveInstanceId: driveInstanceId2, driveId: driveId2});
            itemIdArr = [...itemIdArr, ...folderItemIdArr];
            parentFolderIdArr = [...parentFolderIdArr, ...folderParentFolderIdsArr];
          }
        }
      }
      return [itemIdArr, parentFolderIdArr];
    }
    switch (instruction.instructionType) {
      case "one item":
        if (!isSelected) {
          for (let itemObj of globalSelected) {
            let itemInfo2 = {...itemObj};
            delete itemInfo2["parentFolderId"];
            set(selectedDriveItemsAtom(itemInfo2), false);
          }
          set(selectedDriveItemsAtom(driveIdDriveInstanceIdItemId), true);
          let itemInfo = {...driveIdDriveInstanceIdItemId};
          itemInfo["parentFolderId"] = instruction.parentFolderId;
          set(globalSelectedNodesAtom, [itemInfo]);
        }
        break;
      case "add item":
        if (isSelected) {
          set(selectedDriveItemsAtom(driveIdDriveInstanceIdItemId), false);
          let newGlobalSelected = [...globalSelected];
          let index;
          for (const [i, obj] of newGlobalSelected.entries()) {
            if (obj.driveId === driveId && obj.itemId === itemId && obj.driveInstanceId === driveInstanceId) {
              index = i;
              break;
            }
          }
          newGlobalSelected.splice(index, 1);
          set(globalSelectedNodesAtom, newGlobalSelected);
        } else {
          set(selectedDriveItemsAtom(driveIdDriveInstanceIdItemId), true);
          let itemInfo = {...driveIdDriveInstanceIdItemId};
          itemInfo["parentFolderId"] = instruction.parentFolderId;
          set(globalSelectedNodesAtom, [...globalSelected, itemInfo]);
        }
        break;
      case "range to item":
        if (globalSelected.length === 0 || lastSelectedItem?.driveInstanceId !== driveInstanceId) {
          set(selectedDriveItemsAtom(driveIdDriveInstanceIdItemId), true);
          let itemInfo = {...driveIdDriveInstanceIdItemId};
          itemInfo["parentFolderId"] = instruction.parentFolderId;
          set(globalSelectedNodesAtom, [itemInfo]);
        } else {
          const driveInstanceParentFolderId = get(driveInstanceParentFolderIdAtom(driveInstanceId));
          let [arrayOfItemIds, parentFolderIds] = buildItemIdsAndParentIds({parentFolderId: driveInstanceParentFolderId, driveInstanceId, driveId});
          let foundClickedItem = false;
          let foundLastItem = false;
          let addToGlobalSelected = [];
          let needToReverseOrder = false;
          for (const [i, testItemId] of arrayOfItemIds.entries()) {
            if (!foundLastItem && testItemId === lastSelectedItem.itemId) {
              foundLastItem = true;
              if (foundClickedItem) {
                needToReverseOrder = true;
              }
            }
            if (!foundClickedItem && testItemId === itemId) {
              foundClickedItem = true;
            }
            if (foundClickedItem || foundLastItem) {
              const isSelected2 = get(selectedDriveItemsAtom({driveId, driveInstanceId, itemId: testItemId}));
              if (!isSelected2) {
                set(selectedDriveItemsAtom({driveId, driveInstanceId, itemId: testItemId}), true);
                addToGlobalSelected.push({driveId, driveInstanceId, itemId: testItemId, parentFolderId: parentFolderIds[i]});
              }
              if (foundClickedItem && foundLastItem) {
                break;
              }
            }
          }
          if (needToReverseOrder) {
            addToGlobalSelected.reverse();
          }
          set(globalSelectedNodesAtom, [...globalSelected, ...addToGlobalSelected]);
        }
        break;
      case "clear all":
        for (let itemObj of globalSelected) {
          const {parentFolderId, ...atomFormat} = itemObj;
          set(selectedDriveItemsAtom(atomFormat), false);
        }
        set(globalSelectedNodesAtom, []);
        break;
      default:
        console.warn(`Can't handle instruction ${instruction}`);
        break;
    }
  }
});
function columnJSX(columnType, item) {
  let courseRole = "";
  const assignmentInfoSettings = useRecoilValueLoadable(loadAssignmentSelector(item.doenetId));
  let aInfo = "";
  if (assignmentInfoSettings?.state === "hasValue") {
    aInfo = assignmentInfoSettings?.contents?.assignments[0];
  }
  if (columnType === "Released" && item.isReleased === "1") {
    return /* @__PURE__ */ React.createElement("span", {
      style: {textAlign: "center"}
    }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faCheck
    }));
  } else if (columnType === "Assigned" && item.isAssigned === "1") {
    return /* @__PURE__ */ React.createElement("span", {
      style: {textAlign: "center"}
    }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faCheck
    }));
  } else if (columnType === "Public" && item.isPublic === "1") {
    return /* @__PURE__ */ React.createElement("span", {
      style: {textAlign: "center"}
    }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faCheck
    }));
  } else if (columnType === "Due Date" && item.isAssigned === "1") {
    return /* @__PURE__ */ React.createElement("span", {
      style: {textAlign: "center"}
    }, aInfo?.dueDate);
  }
  return /* @__PURE__ */ React.createElement("span", null);
}
const DoenetML = React.memo((props) => {
  const setSelected = useSetRecoilState(selectedDriveItems({driveId: props.driveId, driveInstanceId: props.driveInstanceId, itemId: props.item.itemId}));
  const isSelected = useRecoilValue(selectedDriveItemsAtom({driveId: props.driveId, driveInstanceId: props.driveInstanceId, itemId: props.item.itemId}));
  const [selectedDrive, setSelectedDrive] = useRecoilState(selectedDriveAtom);
  const [dragState] = useRecoilState(dragStateAtom);
  const {onDragStart, onDrag, onDragEnd, renderDragGhost, registerDropTarget, unregisterDropTarget} = useDnDCallbacks();
  const globalSelectedNodes = useRecoilValue(globalSelectedNodesAtom);
  const [folderInfoObj, setFolderInfo] = useRecoilStateLoadable(folderInfoSelector({driveId: props.driveId, instanceId: props.driveInstanceId, folderId: props.driveId}));
  const parentFolderSortOrder = useRecoilValue(folderSortOrderAtom({driveId: props.driveId, instanceId: props.driveInstanceId, folderId: props.item?.parentFolderId}));
  const parentFolderSortOrderRef = useRef(parentFolderSortOrder);
  const {insertDragShadow} = useDragShadowCallbacks();
  const indentPx = 30;
  let woIndent = 250 - props.indentLevel * indentPx;
  let columns = `${woIndent}px repeat(4,1fr)`;
  if (props.numColumns === 4) {
    columns = `${woIndent}px repeat(3,1fr)`;
  } else if (props.numColumns === 3) {
    columns = `${woIndent}px 1fr 1fr`;
  } else if (props.numColumns === 2) {
    columns = `${woIndent}px 1fr`;
  } else if (props.numColumns === 1) {
    columns = "100%";
  }
  let bgcolor = "#ffffff";
  let borderSide = "0px 0px 0px 0px";
  let widthSize = "auto";
  let marginSize = "0";
  let column2 = columnJSX(props.columnTypes[0], props.item);
  let column3 = columnJSX(props.columnTypes[1], props.item);
  let column4 = columnJSX(props.columnTypes[2], props.item);
  let column5 = columnJSX(props.columnTypes[3], props.item);
  let label = props.item?.label;
  if (props.isNav) {
    widthSize = "224px";
    marginSize = "0px";
    column2 = null;
    column3 = null;
    column4 = null;
    column5 = null;
    columns = "1fr";
  }
  if (isSelected || props.isNav && props.item.itemId === props.pathItemId) {
    bgcolor = "hsl(209,54%,82%)";
    borderSide = "8px 0px 0px 0px #1A5A99";
  }
  if (isSelected && dragState.isDragging) {
    bgcolor = "#e2e2e2";
  }
  useEffect(() => {
    parentFolderSortOrderRef.current = parentFolderSortOrder;
  }, [parentFolderSortOrder]);
  const onDragOver = ({x, y, dropTargetRef}) => {
    const dropTargetTopY = dropTargetRef?.offsetTop;
    const dropTargetHeight = dropTargetRef?.clientHeight;
    const cursorY = y;
    const cursorArea = (cursorY - dropTargetTopY) / dropTargetHeight;
    if (parentFolderSortOrderRef.current === sortOptions.DEFAULT) {
      if (cursorArea < 0.5) {
        insertDragShadow({
          driveIdFolderId: {driveId: props.driveId, folderId: props.driveId},
          position: "beforeCurrent",
          itemId: props.item.itemId,
          parentId: props.item.parentFolderId
        });
      } else if (cursorArea < 1) {
        insertDragShadow({
          driveIdFolderId: {driveId: props.driveId, folderId: props.driveId},
          position: "afterCurrent",
          itemId: props.item.itemId,
          parentId: props.item.parentFolderId
        });
      }
    }
  };
  const onDragEndCb = () => {
    onDragEnd();
  };
  let doenetMLJSX = /* @__PURE__ */ React.createElement("div", {
    "data-doenet-driveinstanceid": props.driveInstanceId,
    "data-cy": "driveItem",
    tabIndex: 0,
    className: "noselect nooutline",
    style: {
      cursor: "pointer",
      padding: "8px",
      border: "0px",
      borderBottom: "2px solid black",
      backgroundColor: bgcolor,
      width: widthSize,
      marginLeft: marginSize
    },
    onDoubleClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (props.doubleClickCallback) {
        props.doubleClickCallback({
          driveId: props.driveId,
          item: props.item,
          driveInstanceId: props.driveInstanceId,
          route: props.route,
          isNav: props.isNav,
          pathItemId: props.pathItemId
        });
      }
    },
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (props.isNav) {
        props.setDrivePath({driveId: props.driveId, parentFolderId: props.item.parentFolderId, itemId: props.item.itemId, type: "DoenetML"});
      } else {
        e.preventDefault();
        e.stopPropagation();
        if (!e.shiftKey && !e.metaKey) {
          setSelected({instructionType: "one item", parentFolderId: props.item.parentFolderId});
        } else if (e.shiftKey && !e.metaKey) {
          setSelected({instructionType: "range to item", parentFolderId: props.item.parentFolderId});
        } else if (!e.shiftKey && e.metaKey) {
          setSelected({instructionType: "add item", parentFolderId: props.item.parentFolderId});
        }
      }
      setSelectedDrive(props.driveId);
    }
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      marginLeft: `${props.indentLevel * indentPx}px`,
      display: "grid",
      gridTemplateColumns: columns,
      gridTemplateRows: "1fr",
      alignContent: "center"
    }
  }, /* @__PURE__ */ React.createElement("p", {
    style: {display: "inline", margin: "0px"}
  }, /* @__PURE__ */ React.createElement("span", {
    "data-cy": "doenetMLIcon"
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faCode
  })), /* @__PURE__ */ React.createElement("span", {
    "data-cy": "doenetMLLabel"
  }, label, " ")), props.numColumns >= 2 ? column2 : null, props.numColumns >= 3 ? column3 : null, props.numColumns >= 4 ? column4 : null, props.numColumns >= 5 ? column5 : null));
  if (!props.isNav) {
    const onDragStartCallback = () => {
      if (globalSelectedNodes.length === 0 || !isSelected) {
        setSelected({instructionType: "clear all"});
        setSelected({instructionType: "one item", parentFolderId: props.item.parentFolderId});
      }
    };
    let draggableClassName = "";
    doenetMLJSX = /* @__PURE__ */ React.createElement(Draggable, {
      key: `dnode${props.driveInstanceId}${props.item.itemId}`,
      id: props.item.itemId,
      className: draggableClassName,
      onDragStart: ({ev}) => onDragStart({ev, nodeId: props.item.itemId, driveId: props.driveId, onDragStartCallback}),
      onDrag,
      onDragEnd,
      onDragEnd: onDragEndCb,
      ghostElement: renderDragGhost(props.item.itemId, doenetMLJSX)
    }, doenetMLJSX);
    doenetMLJSX = /* @__PURE__ */ React.createElement(WithDropTarget, {
      key: `wdtnode${props.driveInstanceId}${props.item.itemId}`,
      id: props.item.itemId,
      registerDropTarget,
      unregisterDropTarget,
      dropCallbacks: {
        onDragOver
      }
    }, doenetMLJSX);
  }
  return doenetMLJSX;
});
function useDnDCallbacks() {
  const {dropState, dropActions} = useContext(DropTargetsContext);
  const [dragState, setDragState] = useRecoilState(dragStateAtom);
  const globalSelectedNodes = useRecoilValue(globalSelectedNodesAtom);
  const [addToast, ToastType] = useToast();
  const {replaceDragShadow, removeDragShadow, cleanUpDragShadow} = useDragShadowCallbacks();
  const {moveItems, copyItems} = useSockets("drive");
  const numItems = useRecoilValue(globalSelectedNodesAtom).length;
  const optionKeyPressed = useKeyPressedListener("Alt");
  const optionKeyPressedRef = useRef(optionKeyPressed);
  useEffect(() => {
    setDragState((dragState2) => ({
      ...dragState2,
      copyMode: optionKeyPressed
    }));
    optionKeyPressedRef.current = optionKeyPressed;
  }, [optionKeyPressed]);
  const onDragStart = ({ev = null, nodeId, driveId, onDragStartCallback}) => {
    let draggedItemsId = new Set();
    if (globalSelectedNodes.length === 0) {
      draggedItemsId.add(nodeId);
    } else {
      const globalSelectedNodeIds = [];
      for (let globalSelectedNode of globalSelectedNodes)
        globalSelectedNodeIds.push(globalSelectedNode.itemId);
      draggedItemsId = new Set(globalSelectedNodeIds);
    }
    let copyMode = false;
    if (ev && ev.altKey)
      copyMode = true;
    setDragState((dragState2) => ({
      ...dragState2,
      isDragging: true,
      draggedOverDriveId: driveId,
      initialDriveId: driveId,
      draggedItemsId,
      openedFoldersInfo: [],
      copyMode
    }));
    onDragStartCallback?.();
  };
  const onDrag = ({clientX, clientY, translation, id, ev}) => {
    dropActions.handleDrag(clientX, clientY);
  };
  const onDragOverContainer = ({id, driveId, isBreadcrumb = false}) => {
    setDragState((dragState2) => {
      const {draggedOverDriveId, initialDriveId, copyMode} = dragState2;
      let newDraggedOverDriveId = draggedOverDriveId;
      let newCopyMode = copyMode;
      if (draggedOverDriveId !== driveId) {
        newDraggedOverDriveId = driveId;
      }
      newCopyMode = initialDriveId !== driveId;
      return {
        ...dragState2,
        draggedOverDriveId: newDraggedOverDriveId,
        isDraggedOverBreadcrumb: isBreadcrumb,
        copyMode: newCopyMode
      };
    });
  };
  const onDragEnd = () => {
    replaceDragShadow().then((replaceDragShadowResp) => {
      if (!replaceDragShadowResp || Object.keys(replaceDragShadowResp).length === 0)
        return;
      const {targetDriveId, targetFolderId, index} = replaceDragShadowResp;
      const draggingAcrossDrives = globalSelectedNodes?.[0].driveId !== targetDriveId;
      const copyMode = dragState.copyMode || draggingAcrossDrives;
      if (copyMode) {
        copyItems({items: globalSelectedNodes, targetDriveId, targetFolderId, index});
      } else {
        moveItems(replaceDragShadowResp);
      }
    });
    cleanUpDragShadow();
    removeDragShadow();
    setDragState((dragState2) => ({
      ...dragState2,
      isDragging: false,
      draggedOverDriveId: null,
      initialDriveId: null,
      draggedItemsId: null,
      openedFoldersInfo: [],
      copyMode: false
    }));
    dropActions.handleDrop();
  };
  const onDragExit = ({driveId, itemId}) => {
    setDragState((dragState2) => {
      const {initialDriveId, copyMode} = dragState2;
      let newCopyMode = copyMode;
      if (initialDriveId !== driveId) {
        newCopyMode = false;
      }
      newCopyMode |= optionKeyPressedRef.current;
      return {
        ...dragState2,
        copyMode: newCopyMode
      };
    });
  };
  const onDragEnterInvalidArea = () => {
  };
  function renderDragGhost(id, element) {
    const dragGhostId = `drag-ghost-${id}`;
    return /* @__PURE__ */ React.createElement(DragGhost, {
      id: dragGhostId,
      numItems,
      element,
      copyMode: dragState.copyMode
    });
  }
  return {
    onDragStart,
    onDrag,
    onDragOverContainer,
    onDragEnd,
    onDragExit,
    onDragEnterInvalidArea,
    renderDragGhost,
    registerDropTarget: dropActions.registerDropTarget,
    unregisterDropTarget: dropActions.unregisterDropTarget
  };
}
export const nodePathSelector = selectorFamily({
  key: "nodePathSelector",
  get: (driveIdFolderId) => ({get}) => {
    const {driveId, folderId} = driveIdFolderId;
    if (!driveId || !folderId)
      return [];
    let path = [];
    let currentNode = folderId;
    while (currentNode && currentNode !== driveId) {
      const folderInfoObj = get(folderDictionaryFilterSelector({driveId, folderId: currentNode}));
      path.push({folderId: currentNode, label: folderInfoObj.folderInfo.label});
      currentNode = folderInfoObj.folderInfo.parentFolderId;
    }
    return path;
  }
});
const nodeChildrenSelector = selectorFamily({
  key: "nodePathSelector",
  get: (driveIdFolderId) => ({get}) => {
    const {driveId, folderId} = driveIdFolderId;
    if (!driveId || !folderId)
      return [];
    let children = [];
    let queue = [folderId];
    while (queue.length) {
      let size = queue.length;
      for (let i = 0; i < size; i++) {
        let currentNodeId = queue.shift();
        const folderInfoObj = get(folderDictionaryFilterSelector({driveId, folderId: currentNodeId}));
        children.push(currentNodeId);
        for (let childId of folderInfoObj?.contentIds?.[sortOptions.DEFAULT]) {
          queue.push(childId);
        }
      }
    }
    return children;
  }
});
function useUpdateBreadcrumb(props) {
  const {addItem: addBreadcrumbItem, clearItems: clearBreadcrumb} = useContext(BreadcrumbContext);
  const {onDragOverContainer} = useDnDCallbacks();
  const {dropActions} = useContext(DropTargetsContext);
  let routePathDriveId = "";
  let routePathFolderId = "";
  if (props.path) {
    const [driveId, folderId, itemId] = props.path?.split(":");
    routePathDriveId = driveId;
    routePathFolderId = folderId;
  }
  const [nodesOnPath, _] = useRecoilState(nodePathSelector({driveId: routePathDriveId, folderId: routePathFolderId}));
  const driveLabel = props.driveLabel ?? "/";
  const {moveItems} = useSockets("drive");
  useEffect(() => {
    updateBreadcrumb({routePathDriveId, routePathFolderId});
  }, [nodesOnPath]);
  const updateBreadcrumb = ({routePathDriveId: routePathDriveId2, routePathFolderId: routePathFolderId2}) => {
    if (props.driveId !== routePathDriveId2) {
      return;
    }
    clearBreadcrumb();
    let breadcrumbStack = [];
    const breadcrumbItemStyle = {
      fontSize: "24px",
      color: "#040F1A",
      textDecoration: "none"
    };
    for (let currentNode of nodesOnPath) {
      const nodeObj = currentNode;
      const currentNodeId = nodeObj.folderId;
      let newParams2 = Object.fromEntries(new URLSearchParams());
      newParams2["path"] = `${routePathDriveId2}:${currentNodeId}:${currentNodeId}:Folder`;
      const destinationLink = `../?${encodeParams(newParams2)}`;
      let breadcrumbElement = /* @__PURE__ */ React.createElement(Link, {
        style: breadcrumbItemStyle,
        to: destinationLink
      }, nodeObj?.label);
      breadcrumbElement = /* @__PURE__ */ React.createElement(WithDropTarget, {
        key: `wdtbreadcrumb${props.driveId}${currentNodeId}`,
        id: currentNodeId,
        registerDropTarget: dropActions.registerDropTarget,
        unregisterDropTarget: dropActions.unregisterDropTarget,
        dropCallbacks: {
          onDragOver: () => onDragOverContainer({id: currentNodeId, driveId: props.driveId, isBreadcrumb: true}),
          onDrop: () => {
            moveItems({targetDriveId: props.driveId, targetFolderId: currentNodeId});
          }
        }
      }, breadcrumbElement);
      const breadcrumbObj = {
        to: destinationLink,
        element: breadcrumbElement
      };
      breadcrumbStack.unshift(breadcrumbObj);
    }
    let newParams = Object.fromEntries(new URLSearchParams());
    newParams["path"] = `${routePathDriveId2}:${routePathDriveId2}:${routePathDriveId2}:Drive`;
    const driveDestinationLink = `../?${encodeParams(newParams)}`;
    const driveBreadcrumbElement = /* @__PURE__ */ React.createElement(WithDropTarget, {
      key: `wdtbreadcrumb${props.driveId}`,
      id: routePathDriveId2,
      registerDropTarget: dropActions.registerDropTarget,
      unregisterDropTarget: dropActions.unregisterDropTarget,
      dropCallbacks: {
        onDragOver: () => onDragOverContainer({id: routePathDriveId2, driveId: props.driveId, isBreadcrumb: true}),
        onDrop: () => {
          moveItems({targetDriveId: props.driveId, targetFolderId: props.driveId});
        }
      }
    }, /* @__PURE__ */ React.createElement(Link, {
      "data-cy": "breadcrumbDriveColumn",
      style: breadcrumbItemStyle,
      to: driveDestinationLink
    }, props.driveLabel));
    breadcrumbStack.unshift({
      to: driveDestinationLink,
      element: driveBreadcrumbElement
    });
    for (let item of breadcrumbStack) {
      addBreadcrumbItem(item);
    }
  };
}
const DragGhost = ({id, element, numItems, copyMode = false}) => {
  const containerStyle = {
    transform: "rotate(-5deg)",
    zIndex: "10",
    background: "#e2e2e2",
    width: "40vw",
    border: "2px solid black",
    padding: "0px",
    height: "38px",
    overflow: "hidden"
  };
  const singleItemStyle = {
    boxShadow: "rgba(0, 0, 0, 0.20) 5px 5px 3px 3px",
    borderRadius: "2px solid black",
    animation: "dragAnimation 2s",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#e2e2e2"
  };
  const multipleItemsNumCircleContainerStyle = {
    position: "absolute",
    zIndex: "5",
    top: "6px",
    right: "5px",
    borderRadius: "25px",
    background: "#1A5A99",
    fontSize: "12px",
    color: "white",
    width: "25px",
    height: "25px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  };
  const copyModeIndicatorCircleContainerStyle = {
    position: "absolute",
    zIndex: "5",
    top: "6px",
    left: "5px",
    borderRadius: "25px",
    background: "#08ed00",
    fontSize: "23px",
    color: "white",
    width: "25px",
    height: "25px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  };
  let dragGhost = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: singleItemStyle
  }, element));
  ;
  if (numItems >= 2) {
    const numItemsIndicator = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
      style: multipleItemsNumCircleContainerStyle
    }, numItems));
    dragGhost = /* @__PURE__ */ React.createElement(React.Fragment, null, numItemsIndicator, dragGhost);
  }
  if (copyMode) {
    const copyModeIndicator = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
      style: copyModeIndicatorCircleContainerStyle
    }, "+"));
    dragGhost = /* @__PURE__ */ React.createElement(React.Fragment, null, copyModeIndicator, dragGhost);
  }
  dragGhost = /* @__PURE__ */ React.createElement("div", {
    id,
    "data-cy": "dragGhost",
    style: containerStyle
  }, dragGhost);
  return dragGhost;
};
