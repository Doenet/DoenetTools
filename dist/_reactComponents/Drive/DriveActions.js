import {useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import {
  folderDictionaryFilterSelector,
  globalSelectedNodesAtom,
  folderDictionary,
  sortOptions,
  dragStateAtom,
  sortItems,
  nodePathSelector,
  folderOpenAtom,
  folderSortOrderAtom
} from "./NewDrive.js";
import {toastType, useToast} from "../../_framework/Toast.js";
const dragShadowId = "dragShadow";
export const useDragShadowCallbacks = () => {
  const replaceDragShadow = useRecoilCallback(({snapshot}) => async () => {
    const {dragShadowDriveId, dragShadowParentId} = await snapshot.getPromise(dragStateAtom);
    const globalSelectedNodes = await snapshot.getPromise(globalSelectedNodesAtom);
    if (!dragShadowDriveId || !dragShadowParentId)
      return;
    let dragShadowParentFolderInfoObj = null;
    if (dragShadowDriveId && dragShadowParentId)
      dragShadowParentFolderInfoObj = await snapshot.getPromise(folderDictionary({
        driveId: dragShadowDriveId,
        folderId: dragShadowParentId
      }));
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
  const insertDragShadow = useRecoilCallback(({snapshot, set}) => async ({driveIdFolderId, position, parentId, itemId}) => {
    const {
      dragShadowDriveId,
      dragShadowParentId,
      draggedItemsId,
      copyMode
    } = await snapshot.getPromise(dragStateAtom);
    if (!copyMode && draggedItemsId && draggedItemsId?.has(itemId)) {
      removeDragShadow();
      return;
    }
    const dragShadow = {
      assignmentId: null,
      doenetId: null,
      cid: null,
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
      dragShadowParentFolderInfoObj = await snapshot.getPromise(folderDictionary({
        driveId: dragShadowDriveId,
        folderId: dragShadowParentId
      }));
    if (dragShadowParentFolderInfoObj) {
      set(folderDictionary({
        driveId: dragShadowDriveId,
        folderId: dragShadowParentId
      }), (old) => {
        let newObj = {...old};
        let newDefaultOrder = [...newObj.contentIds[sortOptions.DEFAULT]];
        newDefaultOrder = newDefaultOrder.filter((itemId2) => itemId2 !== dragShadowId);
        const defaultOrderObj = {
          [sortOptions.DEFAULT]: newDefaultOrder
        };
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
      const isValidPosition = ({
        draggedItemsId: draggedItemsId2,
        contentIdsArr,
        index
      }) => {
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
      set(folderDictionary({
        driveId: driveIdFolderId.driveId,
        folderId: dropTargetParentId
      }), (old) => {
        let newObj = {...old};
        let newContentsDictionary = {...old.contentsDictionary};
        let newDefaultOrder = [...newObj.contentIds[sortOptions.DEFAULT]];
        newContentsDictionary[dragShadowId] = dragShadow;
        if (dragShadowParentId === dropTargetParentId)
          newDefaultOrder = newDefaultOrder.filter((itemId2) => itemId2 !== dragShadowId);
        let index = newDefaultOrder.indexOf(itemId);
        if (insertPosition === "afterCurrent")
          index += 1;
        isValid = copyMode || isValidPosition({
          draggedItemsId,
          contentIdsArr: newDefaultOrder,
          index
        });
        if (isValid)
          newDefaultOrder.splice(index, 0, dragShadowId);
        const defaultOrderObj = {
          [sortOptions.DEFAULT]: newDefaultOrder
        };
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
  const removeDragShadow = useRecoilCallback(({snapshot, set}) => async () => {
    const {dragShadowDriveId, dragShadowParentId} = await snapshot.getPromise(dragStateAtom);
    if (!dragShadowDriveId || !dragShadowParentId)
      return;
    set(folderDictionary({
      driveId: dragShadowDriveId,
      folderId: dragShadowParentId
    }), (old) => {
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
  const cleanUpDragShadow = useRecoilCallback(({snapshot, set}) => async () => {
    const {dragShadowDriveId, dragShadowParentId, openedFoldersInfo} = await snapshot.getPromise(dragStateAtom);
    let openedFolders = [...openedFoldersInfo];
    let filteredOpenedFolders = [];
    if (dragShadowDriveId && dragShadowParentId) {
      let foldersOnPath = await snapshot.getPromise(nodePathSelector({
        driveId: dragShadowDriveId,
        folderId: dragShadowParentId
      }));
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
  return {
    insertDragShadow,
    removeDragShadow,
    replaceDragShadow,
    cleanUpDragShadow
  };
};
export const useSortFolder = () => {
  const addToast = useToast();
  const sortFolder = useRecoilCallback(({set, snapshot}) => async ({driveIdInstanceIdFolderId, sortKey}) => {
    const {driveId, folderId} = driveIdInstanceIdFolderId;
    const {contentIds} = await snapshot.getPromise(folderDictionaryFilterSelector({driveId, folderId}));
    set(folderSortOrderAtom(driveIdInstanceIdFolderId), sortKey);
    if (!contentIds[sortKey]) {
      set(folderDictionary({driveId, folderId}), (old) => {
        let newObj = JSON.parse(JSON.stringify(old));
        let {contentsDictionary, contentIds: contentIds2} = newObj;
        let newFolderInfo = {...newObj.folderInfo};
        const sortedFolderChildrenIds = sortItems({
          sortKey,
          nodeObjs: contentsDictionary,
          defaultFolderChildrenIds: contentIds2[sortOptions.DEFAULT]
        });
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
      newObj.contentIds = {
        [sortOptions.DEFAULT]: [...contentIds[sortOptions.DEFAULT]]
      };
      return newObj;
    });
    return;
  });
  const onSortFolderError = ({errorMessage = null}) => {
    addToast(`Sort items error: ${errorMessage}`, toastType.ERROR);
  };
  return {sortFolder, invalidateSortCache, onSortFolderError};
};
export const useAssignmentCallbacks = () => {
  const addToast = useToast();
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
    addToast(`make assignment error: ${errorMessage}`, toastType.ERROR);
  };
  const publishAssignment = useRecoilCallback(({set}) => ({driveIdFolderId, itemId}) => {
    set(folderDictionary(driveIdFolderId), (old) => {
      let newObj = JSON.parse(JSON.stringify(old));
      let newItemObj = newObj.contentsDictionary[itemId];
      newItemObj.assignment_isPublished = "1";
      newItemObj.isAssigned = "1";
      return newObj;
    });
  });
  const onPublishAssignmentError = ({errorMessage = null}) => {
    addToast(`Publish assignment error: ${errorMessage}`, toastType.ERROR);
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
    addToast(`Publish content error`, toastType.ERROR);
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
    addToast(`Rename assignment error: ${errorMessage}`, toastType.ERROR);
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
    addToast(`Convert assignment error: ${errorMessage}`, toastType.ERROR);
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
