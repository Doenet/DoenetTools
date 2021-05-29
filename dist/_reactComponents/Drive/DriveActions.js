import {nanoid} from "../../_snowpack/pkg/nanoid.js";
import axios from "../../_snowpack/pkg/axios.js";
import {
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import {
  folderDictionarySelector,
  globalSelectedNodesAtom,
  folderDictionary,
  selectedDriveItemsAtom,
  sortOptions,
  getLexicographicOrder,
  folderCacheDirtyAtom,
  dragStateAtom,
  sortItems,
  nodePathSelector,
  folderOpenAtom
} from "./Drive.js";
import Toast, {useToast} from "../../_framework/Toast.js";
const dragShadowId = "dragShadow";
const formatDate = (dt) => {
  const formattedDate = `${dt.getFullYear().toString().padStart(2, "0")}-${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")} ${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}:${dt.getSeconds().toString().padStart(2, "0")}`;
  return formattedDate;
};
export const useAddItem = () => {
  const [addToast, ToastType] = useToast();
  const addItem = useRecoilCallback(({snapshot: snapshot2, set}) => async ({driveIdFolderId, label, itemType, selectedItemId = null, url = null}) => {
    const dt = new Date();
    const creationDate = formatDate(dt);
    const itemId = nanoid();
    const branchId = nanoid();
    const newItem = {
      assignmentId: null,
      branchId,
      contentId: null,
      creationDate,
      isPublished: "0",
      itemId,
      itemType,
      label,
      parentFolderId: driveIdFolderId.folderId,
      url,
      urlDescription: null,
      urlId: null,
      sortOrder: ""
    };
    const fInfo = await snapshot2.getPromise(folderDictionary(driveIdFolderId));
    let newObj = JSON.parse(JSON.stringify(fInfo));
    let newDefaultOrder = [...newObj.contentIds[sortOptions.DEFAULT]];
    let index = newDefaultOrder.indexOf(selectedItemId);
    const newOrder = getLexicographicOrder({
      index,
      nodeObjs: newObj.contentsDictionary,
      defaultFolderChildrenIds: newDefaultOrder
    });
    newItem.sortOrder = newOrder;
    newDefaultOrder.splice(index + 1, 0, itemId);
    newObj.contentIds[sortOptions.DEFAULT] = newDefaultOrder;
    newObj.contentsDictionary[itemId] = newItem;
    const versionId = nanoid();
    const data = {
      driveId: driveIdFolderId.driveId,
      parentFolderId: driveIdFolderId.folderId,
      itemId,
      branchId,
      versionId,
      label,
      type: itemType,
      sortOrder: newItem.sortOrder
    };
    const payload = {
      params: data
    };
    const result = axios.get("/api/addItem.php", payload);
    result.then((resp) => {
      if (resp.data.success) {
        set(folderDictionary(driveIdFolderId), newObj);
        if (itemType === "Folder") {
          set(folderDictionary({driveId: driveIdFolderId.driveId, folderId: itemId}), {
            folderInfo: newItem,
            contentsDictionary: {},
            contentIds: {[sortOptions.DEFAULT]: []}
          });
        }
      }
    });
    return result;
  });
  const onAddItemError = ({errorMessage = null}) => {
    addToast(`Add item error: ${errorMessage}`, ToastType.ERROR);
  };
  return {addItem, onAddItemError};
};
export const useDeleteItem = () => {
  const [addToast, ToastType] = useToast();
  const deleteItem = useRecoilCallback(({snapshot: snapshot2, set}) => async ({driveIdFolderId, driveInstanceId = null, itemId}) => {
    const fInfo = await snapshot2.getPromise(folderDictionary(driveIdFolderId));
    const globalSelectedNodes = await snapshot2.getPromise(globalSelectedNodesAtom);
    const item = {
      driveId: driveIdFolderId.driveId,
      driveInstanceId,
      itemId
    };
    const selectedDriveItems = await snapshot2.getPromise(selectedDriveItemsAtom(item));
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
    delete newFInfo["contentsDictionary"][itemId];
    newFInfo.folderInfo = {...fInfo.folderInfo};
    newFInfo.contentIds = {};
    newFInfo.contentIds[sortOptions.DEFAULT] = [...fInfo.contentIds[sortOptions.DEFAULT]];
    const index = newFInfo.contentIds[sortOptions.DEFAULT].indexOf(itemId);
    newFInfo.contentIds[sortOptions.DEFAULT].splice(index, 1);
    const pdata = {
      driveId: driveIdFolderId.driveId,
      itemId
    };
    const deletepayload = {
      params: pdata
    };
    const result = axios.get("/api/deleteItem.php", deletepayload);
    result.then((resp) => {
      if (resp.data.success) {
        set(folderDictionary(driveIdFolderId), newFInfo);
      }
    });
    return result;
  });
  const onDeleteItemError = ({errorMessage = null}) => {
    addToast(`Delete item error: ${errorMessage}`, ToastType.ERROR);
  };
  return {deleteItem, onDeleteItemError};
};
export const useMoveItems = () => {
  const [addToast, ToastType] = useToast();
  const moveItems = useRecoilCallback(({snapshot: snapshot2, set}) => async ({targetDriveId, targetFolderId, index}) => {
    const globalSelectedNodes = await snapshot2.getPromise(globalSelectedNodesAtom);
    if (globalSelectedNodes.length === 0) {
      throw "No items selected";
    }
    for (let gItem of globalSelectedNodes) {
      if (gItem.itemId === targetFolderId) {
        throw "Cannot move folder into itself";
      }
    }
    let destinationFolderObj = await snapshot2.getPromise(folderDictionary({driveId: targetDriveId, folderId: targetFolderId}));
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
      const oldSourceFInfo = await snapshot2.getPromise(folderDictionary({driveId: gItem.driveId, folderId: gItem.parentFolderId}));
      let newSourceFInfo = editedCache[gItem.driveId]?.[gItem.parentFolderId];
      if (!newSourceFInfo)
        newSourceFInfo = JSON.parse(JSON.stringify(oldSourceFInfo));
      if (gItem.parentFolderId !== targetFolderId) {
        let index2 = newSourceFInfo["contentIds"]["defaultOrder"].indexOf(gItem.itemId);
        newSourceFInfo["contentIds"]["defaultOrder"].splice(index2, 1);
        newDestinationFolderObj["contentsDictionary"][gItem.itemId] = {...newSourceFInfo["contentsDictionary"][gItem.itemId]};
        delete newSourceFInfo["contentsDictionary"][gItem.itemId];
        if (!editedCache[gItem.driveId])
          editedCache[gItem.driveId] = {};
        editedCache[gItem.driveId][gItem.parentFolderId] = newSourceFInfo;
      } else {
        newDestinationFolderObj["contentIds"]["defaultOrder"] = newDestinationFolderObj["contentIds"]["defaultOrder"].filter((itemId) => itemId !== gItem.itemId);
      }
      const cleanDefaultOrder = newDestinationFolderObj["contentIds"]["defaultOrder"].filter((itemId) => itemId !== dragShadowId);
      newSortOrder = getLexicographicOrder({
        index: insertIndex,
        nodeObjs: newDestinationFolderObj.contentsDictionary,
        defaultFolderChildrenIds: cleanDefaultOrder
      });
      newDestinationFolderObj["contentsDictionary"][gItem.itemId].sortOrder = newSortOrder;
      newDestinationFolderObj["contentsDictionary"][gItem.itemId].parentFolderId = targetFolderId;
      newDestinationFolderObj["contentIds"]["defaultOrder"].splice(insertIndex, 0, gItem.itemId);
      if (oldSourceFInfo["contentsDictionary"][gItem.itemId].itemType === "Folder") {
        const gItemFolderInfoObj = await snapshot2.getPromise(folderDictionary({driveId: gItem.driveId, folderId: gItem.itemId}));
        set(folderDictionary({driveId: targetDriveId, folderId: gItem.itemId}), () => {
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
              const folderInfoObj = await snapshot2.getPromise(folderDictionary({driveId: gItem.driveId, folderId: currentNodeId}));
              gItemChildIds.push(currentNodeId);
              for (let childId of folderInfoObj?.contentIds?.[sortOptions.DEFAULT]) {
                if (folderInfoObj?.contentsDictionary[childId].itemType === "Folder") {
                  const childFolderInfoObj = await snapshot2.getPromise(folderDictionary({driveId: gItem.driveId, folderId: childId}));
                  set(folderDictionary({driveId: targetDriveId, folderId: childId}), childFolderInfoObj);
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
      selectedItemIds,
      selectedItemChildrenIds: driveIdChanged,
      destinationItemId: targetFolderId,
      destinationParentFolderId: destinationFolderObj.folderInfo.parentFolderId,
      destinationDriveId: targetDriveId,
      newSortOrder
    };
    const result = axios.post("/api/moveItems.php", payload);
    result.then((resp) => {
      if (resp.data.success) {
        set(globalSelectedNodesAtom, []);
        set(folderDictionary({driveId: targetDriveId, folderId: targetFolderId}), newDestinationFolderObj);
        for (let driveId of Object.keys(editedCache)) {
          for (let parentFolderId of Object.keys(editedCache[driveId])) {
            set(folderDictionary({driveId, folderId: parentFolderId}), editedCache[driveId][parentFolderId]);
            set(folderCacheDirtyAtom({driveId, folderId: parentFolderId}), true);
          }
        }
        set(folderCacheDirtyAtom({driveId: targetDriveId, folderId: targetFolderId}), true);
      }
    });
    return result;
  });
  const onMoveItemsError = ({errorMessage = null}) => {
    addToast(`Move item(s) error: ${errorMessage}`, ToastType.ERROR);
  };
  return {moveItems, onMoveItemsError};
};
export const useCopyItems = () => {
  const [addToast, ToastType] = useToast();
  const copyItems = useRecoilCallback(({snapshot: snapshot2, set}) => async ({items = [], targetDriveId, targetFolderId, index}) => {
    if (items.length === 0) {
      throw "No items to be copied";
    }
    let destinationFolderObj = await snapshot2.getPromise(folderDictionary({driveId: targetDriveId, folderId: targetFolderId}));
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
        snapshot: snapshot2,
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
        branchId: newItem.branchId,
        versionId: newItem.versionId,
        label: newItem.label,
        type: newItem.itemType,
        sortOrder: newItem.sortOrder,
        isNewCopy: "1"
      };
      if (newItem.itemType === "DoenetML") {
        const newDoenetML = cloneDoenetML({item: newItem, timestamp: creationTimestamp});
        promises.push(axios.post("/api/saveNewVersion.php", newDoenetML));
      }
      const payload = {
        params: addItemsParams
      };
      const result2 = axios.get("/api/addItem.php", payload);
      promises.push(result2);
    }
    Promise.allSettled(promises).then(([result2]) => {
      if (result2.value?.data?.success) {
        set(folderDictionary({driveId: targetDriveId, folderId: targetFolderId}), newDestinationFolderObj);
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
                set(folderDictionary({driveId: targetDriveId, folderId: currentItemId}), currentFolderInfoObj);
                queue = [...queue, ...globalContentIds[currentItemId]];
              }
            }
          }
        }
        set(folderCacheDirtyAtom({driveId: targetDriveId, folderId: targetFolderId}), true);
      }
    });
    const result = await Promise.allSettled(promises);
    return result;
  });
  const cloneItem = async ({snapshot: snapshot2, globalDictionary = {}, globalContentIds = {}, creationTimestamp, item, targetDriveId, targetFolderId}) => {
    const itemParentFolder = await snapshot2.getPromise(folderDictionary({driveId: item.driveId, folderId: item.parentFolderId}));
    const itemInfo = itemParentFolder["contentsDictionary"][item.itemId];
    const newItem = {...itemInfo};
    const newItemId = nanoid();
    newItem.itemId = newItemId;
    newItem.branchId = nanoid();
    newItem.versionId = nanoid();
    newItem.previousBranchId = itemInfo.branchId;
    if (itemInfo.itemType === "Folder") {
      const {contentIds} = await snapshot2.getPromise(folderDictionary({driveId: item.driveId, folderId: item.itemId}));
      globalContentIds[newItemId] = [];
      for (let contentId of contentIds[sortOptions.DEFAULT]) {
        let subItem = {
          ...item,
          parentFolderId: item.itemId,
          itemId: contentId
        };
        let result = await cloneItem({
          snapshot: snapshot2,
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
      branchId: item.branchId,
      contentId: item.contentId,
      versionId: item.versionId,
      timestamp,
      isDraft: "0",
      isNamed: "1",
      isNewCopy: "1",
      doenetML: item.doenetML,
      previousBranchId: item.previousBranchId
    };
    return newVersion;
  };
  const onCopyItemsError = ({errorMessage = null}) => {
    addToast(`Copy item(s) error: ${errorMessage}`, ToastType.ERROR);
  };
  return {copyItems, onCopyItemsError};
};
export const useDragShadowCallbacks = () => {
  const replaceDragShadow = useRecoilCallback(({snapshot: snapshot2}) => async () => {
    const {
      dragShadowDriveId,
      dragShadowParentId
    } = await snapshot2.getPromise(dragStateAtom);
    const globalSelectedNodes = await snapshot2.getPromise(globalSelectedNodesAtom);
    if (!dragShadowDriveId || !dragShadowParentId)
      return;
    let dragShadowParentFolderInfoObj = null;
    if (dragShadowDriveId && dragShadowParentId)
      dragShadowParentFolderInfoObj = await snapshot2.getPromise(folderDictionary({driveId: dragShadowDriveId, folderId: dragShadowParentId}));
    ;
    let dragShadowParentDefaultOrder = dragShadowParentFolderInfoObj?.contentIds[sortOptions.DEFAULT];
    let insertIndex = dragShadowParentDefaultOrder?.indexOf(dragShadowId);
    if (insertIndex < 0) {
      return {};
    }
    return {
      targetDriveId: dragShadowDriveId,
      targetFolderId: dragShadowParentId,
      index: insertIndex,
      numItems: globalSelectedNodes.length
    };
  });
  const insertDragShadow = useRecoilCallback(({snapshot: snapshot2, set}) => async ({driveIdFolderId, position, parentId, itemId}) => {
    const {
      dragShadowDriveId,
      dragShadowParentId,
      draggedItemsId,
      copyMode
    } = await snapshot2.getPromise(dragStateAtom);
    if (!copyMode && draggedItemsId && draggedItemsId?.has(itemId)) {
      removeDragShadow();
      return;
    }
    const dragShadow = {
      assignmentId: null,
      branchId: null,
      contentId: null,
      creationDate: "",
      isPublished: "0",
      itemId: dragShadowId,
      itemType: "DragShadow",
      label: "",
      parentFolderId: parentId,
      url: null,
      urlDescription: null,
      urlId: null
    };
    const insertPosition = position;
    const dropTargetParentId = parentId;
    let dragShadowParentFolderInfoObj = null;
    if (dragShadowDriveId && dragShadowParentId)
      dragShadowParentFolderInfoObj = await snapshot2.getPromise(folderDictionary({driveId: dragShadowDriveId, folderId: dragShadowParentId}));
    ;
    if (dragShadowParentFolderInfoObj) {
      set(folderDictionary({driveId: dragShadowDriveId, folderId: dragShadowParentId}), (old) => {
        let newObj = {...old};
        let newDefaultOrder = [...newObj.contentIds[sortOptions.DEFAULT]];
        newDefaultOrder = newDefaultOrder.filter((itemId2) => itemId2 !== dragShadowId);
        const defaultOrderObj = {[sortOptions.DEFAULT]: newDefaultOrder};
        newObj.contentIds = defaultOrderObj;
        return newObj;
      });
    }
    if (insertPosition === "intoCurrent") {
      if (draggedItemsId && draggedItemsId?.has(driveIdFolderId.folderId))
        return;
      set(folderDictionary(driveIdFolderId), (old) => {
        let newObj = {...old};
        let newContentsDictionary = {...old.contentsDictionary};
        let newDefaultOrder = [...newObj.contentIds[sortOptions.DEFAULT]];
        newContentsDictionary[dragShadowId] = dragShadow;
        if (dragShadowParentId === dropTargetParentId)
          newDefaultOrder = newDefaultOrder.filter((itemId2) => itemId2 !== dragShadowId);
        newDefaultOrder.splice(0, 0, dragShadowId);
        const defaultOrderObj = {[sortOptions.DEFAULT]: newDefaultOrder};
        newObj.contentIds = defaultOrderObj;
        newObj.contentsDictionary = newContentsDictionary;
        return newObj;
      });
      set(dragStateAtom, (old) => {
        return {
          ...old,
          dragShadowDriveId: driveIdFolderId.driveId,
          dragShadowParentId: driveIdFolderId.folderId
        };
      });
    } else {
      const isValidPosition = ({draggedItemsId: draggedItemsId2, contentIdsArr, index}) => {
        if (draggedItemsId2?.size > 1)
          return true;
        let isValid2 = true;
        let nextItemId = null, prevItemId = null;
        if (contentIdsArr.length !== 0) {
          if (index <= 0) {
            nextItemId = contentIdsArr[0];
          } else if (index >= contentIdsArr.length) {
            prevItemId = contentIdsArr[contentIdsArr.length - 1];
          } else {
            prevItemId = contentIdsArr[index - 1];
            nextItemId = contentIdsArr[index];
          }
          if (prevItemId && draggedItemsId2?.has(prevItemId))
            isValid2 = false;
          if (nextItemId && draggedItemsId2?.has(nextItemId))
            isValid2 = false;
        }
        return isValid2;
      };
      let isValid = true;
      set(folderDictionary({driveId: driveIdFolderId.driveId, folderId: dropTargetParentId}), (old) => {
        let newObj = {...old};
        let newContentsDictionary = {...old.contentsDictionary};
        let newDefaultOrder = [...newObj.contentIds[sortOptions.DEFAULT]];
        newContentsDictionary[dragShadowId] = dragShadow;
        if (dragShadowParentId === dropTargetParentId)
          newDefaultOrder = newDefaultOrder.filter((itemId2) => itemId2 !== dragShadowId);
        let index = newDefaultOrder.indexOf(itemId);
        if (insertPosition === "afterCurrent")
          index += 1;
        isValid = copyMode || isValidPosition({draggedItemsId, contentIdsArr: newDefaultOrder, index});
        if (isValid)
          newDefaultOrder.splice(index, 0, dragShadowId);
        const defaultOrderObj = {[sortOptions.DEFAULT]: newDefaultOrder};
        newObj.contentIds = defaultOrderObj;
        newObj.contentsDictionary = newContentsDictionary;
        return newObj;
      });
      if (isValid) {
        set(dragStateAtom, (old) => {
          return {
            ...old,
            dragShadowDriveId: driveIdFolderId.driveId,
            dragShadowParentId: dropTargetParentId
          };
        });
      }
    }
  });
  const removeDragShadow = useRecoilCallback(({snapshot: snapshot2, set}) => async () => {
    const {
      dragShadowDriveId,
      dragShadowParentId
    } = await snapshot2.getPromise(dragStateAtom);
    if (!dragShadowDriveId || !dragShadowParentId)
      return;
    set(folderDictionary({driveId: dragShadowDriveId, folderId: dragShadowParentId}), (old) => {
      let newObj = {...old};
      let newDefaultOrder = [...newObj.contentIds[sortOptions.DEFAULT]];
      newDefaultOrder = newDefaultOrder.filter((itemId) => itemId !== dragShadowId);
      const defaultOrderObj = {[sortOptions.DEFAULT]: newDefaultOrder};
      newObj.contentIds = defaultOrderObj;
      return newObj;
    });
    set(dragStateAtom, (old) => {
      return {
        ...old,
        dragShadowDriveId: null,
        dragShadowParentId: null
      };
    });
  });
  const cleanUpDragShadow = useRecoilCallback(({snapshot: snapshot2, set}) => async () => {
    const {
      dragShadowDriveId,
      dragShadowParentId,
      openedFoldersInfo
    } = await snapshot2.getPromise(dragStateAtom);
    let openedFolders = [...openedFoldersInfo];
    let filteredOpenedFolders = [];
    if (dragShadowDriveId && dragShadowParentId) {
      let foldersOnPath = await snapshot2.getPromise(nodePathSelector({driveId: dragShadowDriveId, folderId: dragShadowParentId}));
      let folderOnPathSet = new Set(foldersOnPath.map((obj) => obj.folderId));
      for (let openedFolder of openedFolders) {
        const notFolderOnPath = !(openedFolder.driveId === dragShadowDriveId && folderOnPathSet.has(openedFolder.itemId));
        if (notFolderOnPath) {
          filteredOpenedFolders.push(openedFolder);
        }
      }
    } else {
      filteredOpenedFolders = openedFolders;
    }
    for (let openedFolder of filteredOpenedFolders) {
      set(folderOpenAtom(openedFolder), false);
    }
  });
  return {insertDragShadow, removeDragShadow, replaceDragShadow, cleanUpDragShadow};
};
export const useSortFolder = () => {
  const [addToast, ToastType] = useToast();
  const sortFolder = useRecoilCallback(({set}) => async ({driveIdInstanceIdFolderId, sortKey}) => {
    const {driveId, folderId} = driveIdInstanceIdFolderId;
    const {contentIds} = await snapshot.getPromise(folderDictionarySelector({driveId, folderId}));
    set(folderSortOrderAtom(driveIdInstanceIdFolderId), sortKey);
    if (!contentIds[sortKey]) {
      set(folderDictionary({driveId, folderId}), (old) => {
        let newObj = JSON.parse(JSON.stringify(old));
        let {contentsDictionary, contentIds: contentIds2} = newObj;
        let newFolderInfo = {...newObj.folderInfo};
        const sortedFolderChildrenIds = sortItems({sortKey, nodeObjs: contentsDictionary, defaultFolderChildrenIds: contentIds2[sortOptions.DEFAULT]});
        newObj.folderInfo = newFolderInfo;
        newObj.contentIds[sortKey] = sortedFolderChildrenIds;
        return newObj;
      });
    }
  });
  const invalidateSortCache = useRecoilCallback(({set}) => async ({driveIdFolderId}) => {
    set(folderDictionary(driveIdFolderId), (old) => {
      let newObj = {...old};
      let {contentIds} = old;
      newObj.contentIds = {[sortOptions.DEFAULT]: [...contentIds[sortOptions.DEFAULT]]};
      return newObj;
    });
    return;
  });
  const onSortFolderError = ({errorMessage = null}) => {
    addToast(`Sort items error: ${errorMessage}`, ToastType.ERROR);
  };
  return {sortFolder, invalidateSortCache, onSortFolderError};
};
export const useRenameItem = () => {
  const [addToast, ToastType] = useToast();
  const renameItem = useRecoilCallback(({snapshot: snapshot2, set}) => async ({driveIdFolderId, itemId, itemType, newLabel}) => {
    const fInfo = await snapshot2.getPromise(folderDictionary(driveIdFolderId));
    let newFInfo = {...fInfo};
    newFInfo["contentsDictionary"] = {...fInfo.contentsDictionary};
    newFInfo["contentsDictionary"][itemId] = {...fInfo.contentsDictionary[itemId]};
    newFInfo["contentsDictionary"][itemId].label = newLabel;
    const rndata = {
      instruction: "rename",
      driveId: driveIdFolderId.driveId,
      itemId,
      label: newLabel
    };
    const renamepayload = {
      params: rndata
    };
    const result = axios.get("/api/updateItem.php", renamepayload);
    result.then((resp) => {
      if (resp.data.success) {
        set(folderDictionary(driveIdFolderId), newFInfo);
        if (itemType === "Folder") {
          set(folderDictionary({driveId: driveIdFolderId.driveId, folderId: itemId}), (old) => {
            let newFolderInfo = {...old};
            newFolderInfo.folderInfo = {...old.folderInfo};
            newFolderInfo.folderInfo.label = newLabel;
            return newFolderInfo;
          });
        }
      }
    });
    return result;
  });
  const onRenameItemError = ({errorMessage = null}) => {
    addToast(`Rename item error: ${errorMessage}`, ToastType.ERROR);
  };
  return {renameItem, onRenameItemError};
};
export const useAssignmentCallbacks = () => {
  const [addToast, ToastType] = useToast();
  const makeAssignment = useRecoilCallback(({set}) => ({driveIdFolderId, itemId, payload}) => {
    set(folderDictionary(driveIdFolderId), (old) => {
      let newObj = JSON.parse(JSON.stringify(old));
      let newItemObj = newObj.contentsDictionary[itemId];
      newItemObj.isAssigned = "1";
      newItemObj.dueDate = payload?.dueDate;
      return newObj;
    });
  });
  const onmakeAssignmentError = ({errorMessage = null}) => {
    addToast(`make assignment error: ${errorMessage}`, ToastType.ERROR);
  };
  const publishAssignment = useRecoilCallback(({set}) => ({driveIdFolderId, itemId, payload}) => {
    set(folderDictionary(driveIdFolderId), (old) => {
      let newObj = JSON.parse(JSON.stringify(old));
      let newItemObj = newObj.contentsDictionary[itemId];
      newItemObj.assignment_isPublished = "1";
      newItemObj.isAssigned = "1";
      return newObj;
    });
  });
  const onPublishAssignmentError = ({errorMessage = null}) => {
    addToast(`Publish assignment error: ${errorMessage}`, ToastType.ERROR);
  };
  const publishContent = useRecoilCallback(({set}) => ({driveIdFolderId, itemId}) => {
    set(folderDictionary(driveIdFolderId), (old) => {
      let newObj = JSON.parse(JSON.stringify(old));
      let newItemObj = newObj.contentsDictionary[itemId];
      newItemObj.isPublished = "1";
      return newObj;
    });
  });
  const onPublishContentError = () => {
    addToast(`Publish content error`, ToastType.ERROR);
  };
  const updateAssignmentTitle = useRecoilCallback(({set}) => ({driveIdFolderId, itemId, payloadAssignment}) => {
    set(folderDictionary(driveIdFolderId), (old) => {
      let newObj = JSON.parse(JSON.stringify(old));
      let newItemObj = newObj.contentsDictionary[itemId];
      newItemObj.isAssigned = "1";
      newItemObj.assignedDate = payloadAssignment?.assignedDate;
      newItemObj.dueDate = payloadAssignment?.dueDate;
      newItemObj.timeLimit = payloadAssignment?.timeLimit;
      newItemObj.numberOfAttemptsAllowed = payloadAssignment?.numberOfAttemptsAllowed;
      newItemObj.totalPointsOrPercent = payloadAssignment?.totalPointsOrPercent;
      newItemObj.gradeCategory = payloadAssignment?.gradeCategory;
      return newObj;
    });
  });
  const onUpdateAssignmentTitleError = ({errorMessage = null}) => {
    addToast(`Rename assignment error: ${errorMessage}`, ToastType.ERROR);
  };
  const convertAssignmentToContent = useRecoilCallback(({set}) => ({driveIdFolderId, itemId}) => {
    set(folderDictionary(driveIdFolderId), (old) => {
      let newObj = JSON.parse(JSON.stringify(old));
      let newItemObj = newObj.contentsDictionary[itemId];
      newItemObj.isAssigned = "0";
      return newObj;
    });
  });
  const onConvertAssignmentToContentError = ({errorMessage = null}) => {
    addToast(`Convert assignment error: ${errorMessage}`, ToastType.ERROR);
  };
  return {
    makeAssignment,
    onmakeAssignmentError,
    publishAssignment,
    onPublishAssignmentError,
    publishContent,
    onPublishContentError,
    updateAssignmentTitle,
    onUpdateAssignmentTitleError,
    convertAssignmentToContent,
    onConvertAssignmentToContentError
  };
};
