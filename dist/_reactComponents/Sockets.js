import axios from "../_snowpack/pkg/axios.js";
import {nanoid} from "../_snowpack/pkg/nanoid.js";
import {
  atom,
  selector,
  atomFamily,
  selectorFamily,
  useRecoilCallback
} from "../_snowpack/pkg/recoil.js";
import {Manager} from "../_snowpack/pkg/socket.io-client.js";
import {useToast, toastType} from "../_framework/Toast.js";
import {
  folderCacheDirtyAtom,
  folderDictionary,
  getLexicographicOrder,
  globalSelectedNodesAtom,
  selectedDriveItemsAtom,
  sortOptions
} from "./Drive/NewDrive.js";
import {DateToUTCDateString} from "../_utils/dateUtilityFunction.js";
const socketManger = atom({
  key: "socketManger",
  default: selector({
    key: "socketManger/Default",
    get: () => {
      return new Manager("http://localhost:81", {
        withCredentials: true
      });
    },
    dangerouslyAllowMutability: true
  }),
  dangerouslyAllowMutability: true
});
const sockets = atomFamily({
  key: "socketStore",
  default: selectorFamily({
    key: "socketStore/Default",
    get: (nsp) => ({get}) => {
      const manager = get(socketManger);
      const socket = manager.socket(`/${nsp}`);
      return socket;
    },
    dangerouslyAllowMutability: true
  }),
  dangerouslyAllowMutability: true
});
export const itemType = Object.freeze({
  FOLDER: "Folder",
  DOENETML: "DoenetML",
  URL: "Url",
  COLLECTION: "Collection"
});
export default function useSockets(nsp) {
  const addToast = useToast();
  const dragShadowId = "dragShadow";
  const {acceptAddItem, acceptDeleteItem, acceptMoveItems, acceptRenameItem} = useAcceptBindings();
  const addItem = useRecoilCallback(({snapshot}) => async ({driveIdFolderId, type, label = "Untitled", selectedItemId = null, url = null}) => {
    const dt = new Date();
    const creationDate = DateToUTCDateString(dt);
    const itemId = nanoid();
    const doenetId = nanoid();
    const versionId = nanoid();
    const fInfo = await snapshot.getPromise(folderDictionary(driveIdFolderId));
    let newObj = JSON.parse(JSON.stringify(fInfo));
    let newDefaultOrder = [...newObj.contentIds[sortOptions.DEFAULT]];
    let index = newDefaultOrder.indexOf(selectedItemId);
    const newOrder = getLexicographicOrder({
      index,
      nodeObjs: newObj.contentsDictionary,
      defaultFolderChildrenIds: newDefaultOrder
    });
    let payload = {
      driveId: driveIdFolderId.driveId,
      parentFolderId: driveIdFolderId.folderId,
      doenetId,
      itemId,
      versionId,
      type,
      label,
      sortOrder: newOrder,
      selectedItemId,
      creationDate,
      url
    };
    if (type === "DoenetML") {
      payload = {
        ...payload,
        assignedDate: null,
        attemptAggregation: "m",
        dueDate: null,
        gradeCategory: "",
        individualize: true,
        isAssigned: "0",
        isPublished: "0",
        contentId: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        multipleAttempts: true,
        numberOfAttemptsAllowed: "1",
        proctorMakesAvailable: false,
        showCorrectness: true,
        showFeedback: true,
        showHints: true,
        showSolution: true,
        showSolutionInGradebook: true,
        timeLimit: null,
        totalPointsOrPercent: "10",
        assignment_isPublished: "0"
      };
    }
    if (type === itemType.COLLECTION) {
      payload = {
        ...payload,
        assignedDate: null,
        attemptAggregation: "m",
        dueDate: null,
        gradeCategory: "",
        individualize: true,
        isAssigned: "0",
        isPublished: "0",
        contentId: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        multipleAttempts: false,
        numberOfAttemptsAllowed: "1",
        proctorMakesAvailable: false,
        showCorrectness: true,
        showFeedback: true,
        showHints: true,
        showSolution: true,
        showSolutionInGradebook: true,
        timeLimit: null,
        totalPointsOrPercent: "10",
        assignment_isPublished: "0"
      };
    }
    try {
      const resp = await axios.post("/api/addItem.php", payload);
      if (resp.data.success) {
        acceptAddItem(payload);
      } else {
        addToast(`Add item error: ${resp.data.message}`, toastType.ERROR);
      }
    } catch (error) {
      console.error(error);
    }
  });
  const deleteItem = useRecoilCallback(() => async ({driveIdFolderId, driveInstanceId = null, itemId, label}) => {
    const payload = {
      driveId: driveIdFolderId.driveId,
      parentFolderId: driveIdFolderId.folderId,
      itemId,
      label,
      driveInstanceId
    };
    try {
      const resp = await axios.get("/api/deleteItem.php", {
        params: payload
      });
      if (resp.data.success) {
        acceptDeleteItem(payload);
      } else {
        addToast(`Delete item error: ${resp.data.message}`, toastType.ERROR);
      }
    } catch (error) {
      console.log(error);
    }
  });
  const moveItems = useRecoilCallback(({snapshot, set}) => async ({targetDriveId, targetFolderId, index}) => {
    const globalSelectedNodes = await snapshot.getPromise(globalSelectedNodesAtom);
    let destinationFolderObj = await snapshot.getPromise(folderDictionary({
      driveId: targetDriveId,
      folderId: targetFolderId
    }));
    if (globalSelectedNodes.length === 0) {
      throw "No items selected";
    }
    for (let gItem of globalSelectedNodes) {
      const sourceFolderInfo = await snapshot.getPromise(folderDictionary({
        driveId: gItem.driveId,
        folderId: gItem.parentFolderId
      }));
      if (gItem.itemId === targetFolderId) {
        throw "Cannot move folder into itself";
      } else if (destinationFolderObj.folderInfo.itemType === itemType.COLLECTION && sourceFolderInfo.contentsDictionary[gItem.itemId].itemType !== itemType.DOENETML) {
        addToast(`Can not ${sourceFolderInfo.contentsDictionary[gItem.itemId].itemType}s into a Collection`, toastType.ERROR);
        throw `Can not ${sourceFolderInfo.contentsDictionary[gItem.itemId].itemType}s into a Collection`;
      }
    }
    let newDestinationFolderObj = JSON.parse(JSON.stringify(destinationFolderObj));
    let editedCache = {};
    let driveIdChanged = [];
    const insertIndex = index ?? 0;
    let newSortOrder = "";
    for (let gItem of globalSelectedNodes) {
      let selectedItem = {
        driveId: gItem.driveId,
        driveInstanceId: gItem.driveInstanceId,
        itemId: gItem.itemId
      };
      set(selectedDriveItemsAtom(selectedItem), false);
      const oldSourceFInfo = await snapshot.getPromise(folderDictionary({
        driveId: gItem.driveId,
        folderId: gItem.parentFolderId
      }));
      let newSourceFInfo = editedCache[gItem.driveId]?.[gItem.parentFolderId];
      if (!newSourceFInfo)
        newSourceFInfo = JSON.parse(JSON.stringify(oldSourceFInfo));
      if (gItem.parentFolderId !== targetFolderId) {
        let index2 = newSourceFInfo["contentIds"]["defaultOrder"].indexOf(gItem.itemId);
        newSourceFInfo["contentIds"]["defaultOrder"].splice(index2, 1);
        newDestinationFolderObj["contentsDictionary"][gItem.itemId] = {
          ...newSourceFInfo["contentsDictionary"][gItem.itemId]
        };
        if (!newDestinationFolderObj["contentsDictionaryByDoenetId"]) {
          newDestinationFolderObj["contentsDictionaryByDoenetId"] = {};
        }
        newDestinationFolderObj["contentsDictionaryByDoenetId"][newSourceFInfo["contentsDictionary"][gItem.itemId].doenetId] = {...newSourceFInfo["contentsDictionary"][gItem.itemId]};
        delete newSourceFInfo["contentsDictionaryByDoenetId"][newSourceFInfo["contentsDictionary"][gItem.itemId].doenetId];
        delete newSourceFInfo["contentsDictionary"][gItem.itemId];
        if (!editedCache[gItem.driveId])
          editedCache[gItem.driveId] = {};
        editedCache[gItem.driveId][gItem.parentFolderId] = newSourceFInfo;
        newDestinationFolderObj["contentIds"]["defaultOrder"].splice(insertIndex, 0, gItem.itemId);
      } else {
        newDestinationFolderObj.contentIds.defaultOrder.splice(insertIndex, 0, dragShadowId);
        newDestinationFolderObj.contentIds.defaultOrder = newDestinationFolderObj.contentIds.defaultOrder.filter((itemId) => itemId !== gItem.itemId);
        newDestinationFolderObj.contentIds.defaultOrder.splice(newDestinationFolderObj.contentIds.defaultOrder.indexOf(dragShadowId), 1, gItem.itemId);
      }
      const cleanDefaultOrder = newDestinationFolderObj.contentIds.defaultOrder.filter((itemId) => itemId !== dragShadowId);
      newSortOrder = getLexicographicOrder({
        index: insertIndex,
        nodeObjs: newDestinationFolderObj.contentsDictionary,
        defaultFolderChildrenIds: cleanDefaultOrder
      });
      newDestinationFolderObj["contentsDictionary"][gItem.itemId].sortOrder = newSortOrder;
      newDestinationFolderObj["contentsDictionary"][gItem.itemId].parentFolderId = targetFolderId;
      if (oldSourceFInfo["contentsDictionary"][gItem.itemId].itemType === "Folder") {
        const gItemFolderInfoObj = await snapshot.getPromise(folderDictionary({
          driveId: gItem.driveId,
          folderId: gItem.itemId
        }));
        set(folderDictionary({
          driveId: targetDriveId,
          folderId: gItem.itemId
        }), () => {
          let newFolderInfo = {...gItemFolderInfoObj};
          newFolderInfo.folderInfo = {...gItemFolderInfoObj.folderInfo};
          newFolderInfo.folderInfo.parentFolderId = targetFolderId;
          return newFolderInfo;
        });
      }
      if (gItem.driveId !== targetDriveId) {
        driveIdChanged.push(gItem.itemId);
        if (oldSourceFInfo["contentsDictionary"][gItem.itemId].itemType === "Folder") {
          let gItemChildIds = [];
          let queue = [gItem.itemId];
          while (queue.length) {
            let size = queue.length;
            for (let i = 0; i < size; i++) {
              let currentNodeId = queue.shift();
              const folderInfoObj = await snapshot.getPromise(folderDictionary({
                driveId: gItem.driveId,
                folderId: currentNodeId
              }));
              gItemChildIds.push(currentNodeId);
              for (let childId of folderInfoObj?.contentIds?.[sortOptions.DEFAULT]) {
                if (folderInfoObj?.contentsDictionary[childId].itemType === "Folder") {
                  const childFolderInfoObj = await snapshot.getPromise(folderDictionary({
                    driveId: gItem.driveId,
                    folderId: childId
                  }));
                  set(folderDictionary({
                    driveId: targetDriveId,
                    folderId: childId
                  }), childFolderInfoObj);
                  queue.push(childId);
                } else {
                  gItemChildIds.push(childId);
                }
              }
            }
          }
          driveIdChanged = [...driveIdChanged, ...gItemChildIds];
        }
      }
    }
    let selectedItemIds = [];
    for (let item of globalSelectedNodes) {
      selectedItemIds.push(item.itemId);
    }
    const payload = {
      sourceDriveId: globalSelectedNodes[0].driveId,
      destinationDriveId: targetDriveId,
      destinationItemId: targetFolderId,
      newSortOrder,
      selectedItemIds,
      selectedItemChildrenIds: driveIdChanged
    };
    try {
      const resp = await axios.post("/api/moveItems.php", payload);
      if (resp.data.success) {
        acceptMoveItems(payload, newDestinationFolderObj, editedCache);
      } else {
        addToast(`Move item(s) error: ${resp.data.message}`, toastType.ERROR);
      }
    } catch (error) {
      console.log(error);
    }
  });
  const renameItem = useRecoilCallback(() => async ({driveIdFolderId, itemId, itemType: itemType2, newLabel}) => {
    const payload = {
      instruction: "rename",
      driveId: driveIdFolderId.driveId,
      folderId: driveIdFolderId.folderId,
      itemId,
      label: newLabel,
      type: itemType2
    };
    try {
      const resp = await axios.get("/api/updateItem.php", {
        params: payload
      });
      if (resp.data.success) {
        acceptRenameItem(payload);
      } else {
        addToast(`Rename item error: ${resp.data.message}`, toastType.ERROR);
      }
    } catch (error) {
      console.log(error);
    }
  });
  const copyItems = useRecoilCallback(({snapshot, set}) => async ({items = [], targetDriveId, targetFolderId, index}) => {
    if (items.length === 0) {
      throw "No items to be copied";
    }
    let destinationFolderObj = await snapshot.getPromise(folderDictionary({
      driveId: targetDriveId,
      folderId: targetFolderId
    }));
    let newDestinationFolderObj = JSON.parse(JSON.stringify(destinationFolderObj));
    const insertIndex = index ?? 0;
    let newSortOrder = "";
    const dt = new Date();
    const creationTimestamp = formatDate(dt);
    let globalDictionary = {};
    let globalContentIds = {};
    for (let item of items) {
      if (!item.driveId || !item.driveInstanceId || !item.itemId)
        throw "Invalid arguments error";
      let selectedItem = {
        driveId: item.driveId,
        driveInstanceId: item.driveInstanceId,
        itemId: item.itemId
      };
      set(selectedDriveItemsAtom(selectedItem), false);
      const {newItemId, newItem} = await cloneItem({
        snapshot,
        globalDictionary,
        globalContentIds,
        creationTimestamp,
        item,
        targetDriveId,
        targetFolderId
      });
      if (item.driveId === targetDriveId) {
        const newItemLabel = `Copy of ${newItem.label}`;
        newItem.label = newItemLabel;
      }
      const cleanDefaultOrder = newDestinationFolderObj["contentIds"]["defaultOrder"].filter((itemId) => itemId !== dragShadowId);
      newSortOrder = getLexicographicOrder({
        index: insertIndex,
        nodeObjs: newDestinationFolderObj.contentsDictionary,
        defaultFolderChildrenIds: cleanDefaultOrder
      });
      newItem.sortOrder = newSortOrder;
      newDestinationFolderObj["contentsDictionary"][newItemId] = newItem;
      newDestinationFolderObj["contentIds"]["defaultOrder"].splice(insertIndex, 0, newItemId);
    }
    set(globalSelectedNodesAtom, []);
    let promises = [];
    for (let newItemId of Object.keys(globalDictionary)) {
      let newItem = globalDictionary[newItemId];
      const addItemsParams = {
        driveId: targetDriveId,
        parentFolderId: newItem.parentFolderId,
        itemId: newItemId,
        doenetId: newItem.doenetId,
        versionId: newItem.versionId,
        label: newItem.label,
        type: newItem.itemType,
        sortOrder: newItem.sortOrder,
        isNewCopy: "1"
      };
      if (newItem.itemType === "DoenetML") {
        const newDoenetML = cloneDoenetML({
          item: newItem,
          timestamp: creationTimestamp
        });
        promises.push(axios.post("/api/saveNewVersion.php", newDoenetML));
      }
      const result2 = axios.get("/api/addItem.php", {
        params: addItemsParams
      });
      promises.push(result2);
    }
    Promise.allSettled(promises).then(([result2]) => {
      if (result2.value?.data?.success) {
        set(folderDictionary({
          driveId: targetDriveId,
          folderId: targetFolderId
        }), newDestinationFolderObj);
        for (let newItemId of Object.keys(globalDictionary)) {
          let newItem = globalDictionary[newItemId];
          if (newItem.itemType === "Folder") {
            let queue = [newItemId];
            while (queue.length) {
              const size = queue.length;
              for (let i = 0; i < size; i++) {
                const currentItemId = queue.shift();
                const currentItem = globalDictionary[currentItemId];
                if (currentItem.itemType !== "Folder")
                  continue;
                let contentsDictionary = {};
                for (let childContentId of globalContentIds[currentItemId]) {
                  contentsDictionary = {
                    ...contentsDictionary,
                    [childContentId]: globalDictionary[childContentId]
                  };
                }
                const currentFolderInfoObj = {
                  folderInfo: currentItem,
                  contentsDictionary,
                  contentIds: {
                    [sortOptions.DEFAULT]: globalContentIds[currentItemId]
                  }
                };
                set(folderDictionary({
                  driveId: targetDriveId,
                  folderId: currentItemId
                }), currentFolderInfoObj);
                queue = [...queue, ...globalContentIds[currentItemId]];
              }
            }
          }
        }
        set(folderCacheDirtyAtom({
          driveId: targetDriveId,
          folderId: targetFolderId
        }), true);
      }
    }).catch((err) => {
      console.error(err);
    });
    const result = await Promise.allSettled(promises);
    return result;
  });
  const cloneItem = async ({
    snapshot,
    globalDictionary = {},
    globalContentIds = {},
    creationTimestamp,
    item,
    targetDriveId,
    targetFolderId
  }) => {
    const itemParentFolder = await snapshot.getPromise(folderDictionary({
      driveId: item.driveId,
      folderId: item.parentFolderId
    }));
    const itemInfo = itemParentFolder["contentsDictionary"][item.itemId];
    const newItem = {...itemInfo};
    const newItemId = nanoid();
    newItem.itemId = newItemId;
    newItem.doenetId = nanoid();
    newItem.versionId = nanoid();
    newItem.previousDoenetId = itemInfo.doenetId;
    if (itemInfo.itemType === "Folder") {
      const {contentIds} = await snapshot.getPromise(folderDictionary({driveId: item.driveId, folderId: item.itemId}));
      globalContentIds[newItemId] = [];
      for (let contentId of contentIds[sortOptions.DEFAULT]) {
        let subItem = {
          ...item,
          parentFolderId: item.itemId,
          itemId: contentId
        };
        let result = await cloneItem({
          snapshot,
          globalDictionary,
          globalContentIds,
          creationTimestamp,
          item: subItem,
          targetFolderId: newItemId,
          targetDriveId
        });
        const newSubItemId = result.newItemId;
        globalContentIds[newItemId].push(newSubItemId);
      }
    }
    newItem.parentFolderId = targetFolderId;
    newItem.creationDate = creationTimestamp;
    globalDictionary[newItemId] = newItem;
    return {newItemId, newItem};
  };
  const cloneDoenetML = ({item, timestamp}) => {
    let newVersion = {
      title: item.label,
      doenetId: item.doenetId,
      contentId: item.contentId,
      versionId: item.versionId,
      timestamp,
      isDraft: "0",
      isNamed: "1",
      isNewCopy: "1",
      doenetML: item.doenetML,
      previousDoenetId: item.previousDoenetId
    };
    return newVersion;
  };
  return {
    addItem,
    deleteItem,
    moveItems,
    renameItem,
    copyItems
  };
}
function useAcceptBindings() {
  const addToast = useToast();
  const acceptAddItem = useRecoilCallback(({snapshot, set}) => async ({
    driveId,
    parentFolderId,
    doenetId,
    versionId,
    itemId,
    type,
    label,
    sortOrder,
    creationDate,
    url,
    selectedItemId
  }) => {
    const newItem = {
      parentFolderId,
      doenetId,
      versionId,
      itemId,
      itemType: type,
      label,
      sortOrder,
      creationDate,
      isPublished: "0",
      url,
      urlDescription: null,
      urlId: null
    };
    const fInfo = await snapshot.getPromise(folderDictionary({
      driveId,
      folderId: parentFolderId
    }));
    let newObj = JSON.parse(JSON.stringify(fInfo));
    let newDefaultOrder = [...newObj.contentIds[sortOptions.DEFAULT]];
    let index = newDefaultOrder.indexOf(selectedItemId);
    newDefaultOrder.splice(index + 1, 0, itemId);
    newObj.contentIds[sortOptions.DEFAULT] = newDefaultOrder;
    newObj.contentsDictionary[itemId] = newItem;
    newObj.contentsDictionaryByDoenetId[doenetId] = newItem;
    set(folderDictionary({
      driveId,
      folderId: parentFolderId
    }), newObj);
    if (type === "Folder" || type === "Collection") {
      set(folderDictionary({
        driveId,
        folderId: itemId
      }), {
        folderInfo: newItem,
        contentsDictionary: {},
        contentIds: {[sortOptions.DEFAULT]: []}
      });
    }
    addToast(`Add new item 'Untitled'`, toastType.SUCCESS);
  }, [addToast]);
  const acceptDeleteItem = useRecoilCallback(({snapshot, set}) => async ({driveId, parentFolderId, itemId, driveInstanceId, label}) => {
    const fInfo = await snapshot.getPromise(folderDictionary({driveId, folderId: parentFolderId}));
    const globalSelectedNodes = await snapshot.getPromise(globalSelectedNodesAtom);
    const item = {
      driveId,
      driveInstanceId,
      itemId
    };
    const selectedDriveItems = await snapshot.getPromise(selectedDriveItemsAtom(item));
    if (selectedDriveItems) {
      set(selectedDriveItemsAtom(item), false);
      let newGlobalItems = [];
      for (let gItem of globalSelectedNodes) {
        if (gItem.itemId !== itemId) {
          newGlobalItems.push(gItem);
        }
      }
      set(globalSelectedNodesAtom, newGlobalItems);
    }
    let newFInfo = {...fInfo};
    newFInfo["contentsDictionary"] = {...fInfo.contentsDictionary};
    newFInfo["contentsDictionaryByDoenetId"] = {
      ...fInfo.contentsDictionaryByDoenetId
    };
    delete newFInfo["contentsDictionaryByDoenetId"][newFInfo["contentsDictionary"][itemId].doenetId];
    delete newFInfo["contentsDictionary"][itemId];
    newFInfo.folderInfo = {...fInfo.folderInfo};
    newFInfo.contentIds = {};
    newFInfo.contentIds[sortOptions.DEFAULT] = [
      ...fInfo.contentIds[sortOptions.DEFAULT]
    ];
    const index = newFInfo.contentIds[sortOptions.DEFAULT].indexOf(itemId);
    newFInfo.contentIds[sortOptions.DEFAULT].splice(index, 1);
    set(folderDictionary({
      driveId,
      folderId: parentFolderId
    }), newFInfo);
    addToast(`Deleted item '${label}'`, toastType.SUCCESS);
  });
  const acceptMoveItems = useRecoilCallback(({set}) => (payload, newDestinationFolderObj, editedCache) => {
    set(globalSelectedNodesAtom, []);
    set(folderDictionary({
      driveId: payload.destinationDriveId,
      folderId: payload.destinationItemId
    }), newDestinationFolderObj);
    for (let driveId of Object.keys(editedCache)) {
      for (let parentFolderId of Object.keys(editedCache[driveId])) {
        set(folderDictionary({
          driveId,
          folderId: parentFolderId
        }), editedCache[driveId][parentFolderId]);
        set(folderCacheDirtyAtom({
          driveId,
          folderId: parentFolderId
        }), true);
      }
    }
    set(folderCacheDirtyAtom({
      driveId: payload.destinationDriveId,
      folderId: payload.destinationItemId
    }), true);
  }, []);
  const acceptRenameItem = useRecoilCallback(({snapshot, set}) => async ({driveId, folderId, itemId, label, type}) => {
    const fInfo = await snapshot.getPromise(folderDictionary({driveId, folderId}));
    let newFInfo = {...fInfo};
    newFInfo["contentsDictionary"] = {...fInfo.contentsDictionary};
    newFInfo["contentsDictionaryByDoenetId"] = {
      ...fInfo.contentsDictionaryByDoenetId
    };
    newFInfo["contentsDictionary"][itemId] = {
      ...fInfo.contentsDictionary[itemId]
    };
    newFInfo["contentsDictionary"][itemId].label = label;
    newFInfo["contentsDictionaryByDoenetId"][newFInfo["contentsDictionary"][itemId].doenetId] = {
      ...fInfo.contentsDictionary[itemId]
    };
    newFInfo["contentsDictionaryByDoenetId"][newFInfo["contentsDictionary"][itemId].doenetId].label = label;
    set(folderDictionary({
      driveId,
      folderId
    }), newFInfo);
    if (type === "Folder" || type === "Collection") {
      set(folderDictionary({
        driveId,
        folderId: itemId
      }), (old) => {
        let newFolderInfo = {...old};
        newFolderInfo.folderInfo = {...old.folderInfo};
        newFolderInfo.folderInfo.label = label;
        return newFolderInfo;
      });
    }
    addToast(`Renamed item to '${label}'`, toastType.SUCCESS);
  });
  return {
    acceptAddItem,
    acceptDeleteItem,
    acceptMoveItems,
    acceptRenameItem
  };
}
const formatDate = (dt) => {
  const formattedDate = `${dt.getFullYear().toString().padStart(2, "0")}-${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")} ${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}:${dt.getSeconds().toString().padStart(2, "0")}`;
  return formattedDate;
};
