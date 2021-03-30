import React from 'react';
import { nanoid } from 'nanoid';
import axios from "axios";
import {
  useRecoilCallback
} from 'recoil';

import Drive, { 
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
  
} from "../imports/Drive";
import { useToast } from "../imports/Tool/Toast";

const dragShadowId = "dragShadow";

export const useAddItem = () => {
  const toast = useToast();

  const addItem = useRecoilCallback(({snapshot, set})=> 
    async ({driveIdFolderId, label, itemType, selectedItemId=null, url=null})=>{
      // Item creation
      const dt = new Date();
      const creationDate = `${
        dt.getFullYear().toString().padStart(2, '0')}-${
        (dt.getMonth()+1).toString().padStart(2, '0')}-${
        dt.getDate().toString().padStart(2, '0')} ${
        dt.getHours().toString().padStart(2, '0')}:${
        dt.getMinutes().toString().padStart(2, '0')}:${
        dt.getSeconds().toString().padStart(2, '0')}`
      const itemId = nanoid();
      const branchId = nanoid();
      const newItem = {
        assignmentId: null,
        branchId,
        contentId: null,
        creationDate,
        isPublished: "0",
        itemId,
        itemType: itemType,
        label: label,
        parentFolderId: driveIdFolderId.folderId,
        url: url,
        urlDescription: null,
        urlId: null,
        sortOrder: "",
      }
       
      const fInfo = await snapshot.getPromise(folderDictionary(driveIdFolderId));
      let newObj = JSON.parse(JSON.stringify(fInfo));
      let newDefaultOrder = [...newObj.contentIds[sortOptions.DEFAULT]];
      let index = newDefaultOrder.indexOf(selectedItemId);
      const newOrder = getLexicographicOrder({
        index, 
        nodeObjs: newObj.contentsDictionary, 
        defaultFolderChildrenIds: newDefaultOrder 
      });
      newItem.sortOrder = newOrder;
      newDefaultOrder.splice(index+1, 0, itemId);
      newObj.contentIds[sortOptions.DEFAULT] = newDefaultOrder;
      newObj.contentsDictionary[itemId] = newItem;

      const versionId = nanoid();
      const data = { 
        driveId: driveIdFolderId.driveId,
        parentFolderId: driveIdFolderId.folderId,
        itemId,
        branchId,
        versionId,
        label: label,
        type: itemType,
        sortOrder: newItem.sortOrder,
       };
      const payload = { 
        params: data 
      };
      const result = axios.get('/api/AddItem.php', payload);

      result.then(resp => {
        if (resp.data.success){
          // Insert item info into destination folder
          set(folderDictionary(driveIdFolderId), newObj)
          
          // Update folderDictionary when new item is of type Folder
          if (itemType === "Folder"){
            set(folderDictionary({driveId:driveIdFolderId.driveId,folderId:itemId}), {
              folderInfo:newItem, 
              contentsDictionary:{},
              contentIds:{ [sortOptions.DEFAULT]: [] }
            });
          }
        }
      })
      return result;
    }
  );

  const onAddItemError = () => {
    toast(`Add item error`, 0, null, 3000);
  }

  return { addItem, onAddItemError };
};

export const useDeleteItem = () => {
  const toast = useToast();
  const deleteItem = useRecoilCallback(({snapshot, set})=> 
    async ({driveIdFolderId, driveInstanceId=null, itemId})=>{
      const fInfo = await snapshot.getPromise(folderDictionary(driveIdFolderId));
      const globalSelectedNodes = await snapshot.getPromise(globalSelectedNodesAtom);
      const item = { 
        driveId: driveIdFolderId.driveId, 
        driveInstanceId: driveInstanceId,
        itemId: itemId
      }
      const selectedDriveItems = await snapshot.getPromise(selectedDriveItemsAtom(item));
      
      // Remove from selection
      if (selectedDriveItems){
        set(selectedDriveItemsAtom(item),false)
        let newGlobalItems = [];
        for(let gItem of globalSelectedNodes){
          if (gItem.itemId !== itemId){
            newGlobalItems.push(gItem);
          }
        }
        set(globalSelectedNodesAtom, newGlobalItems);
      }

      // Remove from folder
      let newFInfo = {...fInfo};
      newFInfo["contentsDictionary"] = {...fInfo.contentsDictionary}
      delete newFInfo["contentsDictionary"][itemId];
      newFInfo.folderInfo = {...fInfo.folderInfo}
      newFInfo.contentIds = {}
      newFInfo.contentIds[sortOptions.DEFAULT] = [...fInfo.contentIds[sortOptions.DEFAULT]]
      const index = newFInfo.contentIds[sortOptions.DEFAULT].indexOf(itemId)
      newFInfo.contentIds[sortOptions.DEFAULT].splice(index,1)
      
      // Remove from database
      const pdata = {
        driveId: driveIdFolderId.driveId,
        itemId: itemId
      }
      const deletepayload = {
        params: pdata
      }
      const result = axios.get("/api/deleteItem.php", deletepayload);

      result.then(resp => {
        if (resp.data.success){
          set(folderDictionary(driveIdFolderId), newFInfo);
        }
      });
      
      return result;
  });

  const onDeleteItemError = () => {
    toast(`Delete item error`, 0, null, 3000);
  }

  return { deleteItem, onDeleteItemError };
}

export const useMoveItems = () => {
  const moveItems = useRecoilCallback(({snapshot, set})=> 
    async ({targetDriveId, targetFolderId, index})=>{
      const globalSelectedNodes = await snapshot.getPromise(globalSelectedNodesAtom);

      // Interrupt move action if nothing selected
      if (globalSelectedNodes.length === 0){ 
        throw "No items selected"
      }
      
      // TODO: Does this catch every case of folder into itself?
      // Interrupt move action if dragging folder to itself
      for (let gItem of globalSelectedNodes){
        if (gItem.itemId === targetFolderId){
          throw "Cannot move folder into itself"
        }
      }

      // if (canMove){ 
        // Add to destination at index
        let destinationFolderObj = await snapshot.getPromise(folderDictionary({driveId: targetDriveId, folderId: targetFolderId}));
        let newDestinationFolderObj = JSON.parse(JSON.stringify(destinationFolderObj));
        let editedCache = {};
        let driveIdChanged = [];
        const insertIndex = index ?? 0;
        let newSortOrder = "";

        for(let gItem of globalSelectedNodes){
          // Deselect Item
          let selectedItem = {
            driveId: gItem.driveId,
            driveInstanceId: gItem.driveInstanceId,
            itemId: gItem.itemId
          };
          set(selectedDriveItemsAtom(selectedItem), false);

          // Get parentInfo from edited cache or derive from oldSource
          const oldSourceFInfo = await snapshot.getPromise(folderDictionary({driveId: gItem.driveId, folderId: gItem.parentFolderId}));
          let newSourceFInfo = editedCache[gItem.driveId]?.[gItem.parentFolderId];
          if (!newSourceFInfo) newSourceFInfo = JSON.parse(JSON.stringify(oldSourceFInfo));

          // Handle moving item out of folder
          if (gItem.parentFolderId !== targetFolderId) {  
            // Remove item from original parent contentIds
            let index = newSourceFInfo["contentIds"]["defaultOrder"].indexOf(gItem.itemId);
            newSourceFInfo["contentIds"]["defaultOrder"].splice(index, 1)

            // Add item to destination dictionary
            newDestinationFolderObj["contentsDictionary"][gItem.itemId] = {...newSourceFInfo["contentsDictionary"][gItem.itemId]}

            // Remove item from original dictionary
            delete newSourceFInfo["contentsDictionary"][gItem.itemId];

            // Ensure item removed from cached parent and added to edited cache
            if (!editedCache[gItem.driveId]) editedCache[gItem.driveId] = {};
            editedCache[gItem.driveId][gItem.parentFolderId] = newSourceFInfo;
          } else {
            // Ensure item not duplicated in destination contentIds
            newDestinationFolderObj["contentIds"]["defaultOrder"] = newDestinationFolderObj["contentIds"]["defaultOrder"].filter(itemId => itemId !== gItem.itemId);
          }

          // Generate and update sortOrder
          const cleanDefaultOrder = newDestinationFolderObj["contentIds"]["defaultOrder"].filter(itemId => itemId !== dragShadowId);
          newSortOrder = getLexicographicOrder({
            index: insertIndex, 
            nodeObjs: newDestinationFolderObj.contentsDictionary, 
            defaultFolderChildrenIds: cleanDefaultOrder 
          });
          newDestinationFolderObj["contentsDictionary"][gItem.itemId].sortOrder = newSortOrder;
          newDestinationFolderObj["contentsDictionary"][gItem.itemId].parentFolderId = targetFolderId;

          // Insert item into contentIds of destination
          newDestinationFolderObj["contentIds"]["defaultOrder"].splice(insertIndex, 0, gItem.itemId)

          // If moved item is a folder, update folder info
          if (oldSourceFInfo["contentsDictionary"][gItem.itemId].itemType === "Folder") {
            // Retrieval from folderDictionary necessary when moving to different drive
            const gItemFolderInfoObj = await snapshot.getPromise(folderDictionary({driveId: gItem.driveId, folderId: gItem.itemId}));
            set(folderDictionary({driveId: targetDriveId, folderId: gItem.itemId}),()=>{
              let newFolderInfo = {...gItemFolderInfoObj}
              newFolderInfo.folderInfo = {...gItemFolderInfoObj.folderInfo}
              newFolderInfo.folderInfo.parentFolderId = targetFolderId;
              return newFolderInfo;
            })
          }

          // If moved between drives, handle update driveId
          if (gItem.driveId !== targetDriveId) {
            driveIdChanged.push(gItem.itemId)

            // Update driveId of all children in the subtree
            if (oldSourceFInfo["contentsDictionary"][gItem.itemId].itemType === "Folder") {
              let gItemChildIds = [];
              let queue = [gItem.itemId];

              // BFS tree-walk to iterate through all child nodes
              while (queue.length) {
                let size = queue.length;
                for (let i = 0; i < size; i++) {
                  let currentNodeId = queue.shift();
                  const folderInfoObj = await snapshot.getPromise(folderDictionary({driveId: gItem.driveId, folderId: currentNodeId}));
                  gItemChildIds.push(currentNodeId);
                  for (let childId of folderInfoObj?.contentIds?.[sortOptions.DEFAULT]) {
                    if (folderInfoObj?.contentsDictionary[childId].itemType === "Folder") {
                      // migrate child folderInfo into destination driveId
                      const childFolderInfoObj = await snapshot.getPromise(folderDictionary({driveId: gItem.driveId, folderId: childId}));
                      set(folderDictionary({driveId: targetDriveId, folderId: childId}), childFolderInfoObj);
                      queue.push(childId);
                    } else {
                      gItemChildIds.push(childId);
                    }
                  }
                }
              }

              driveIdChanged = [...driveIdChanged, ...gItemChildIds]
            }
          }
        }
        // Add all to destination
        set(folderDictionary({driveId:targetDriveId, folderId:targetFolderId}), newDestinationFolderObj);
        
        // Clear global selection
        set(globalSelectedNodesAtom,[])
        
        // Remove from sources
        for (let driveId of Object.keys(editedCache)){
          for (let parentFolderId of Object.keys(editedCache[driveId])) {
            set(folderDictionary({driveId:driveId,folderId:parentFolderId}),editedCache[driveId][parentFolderId])
            // Mark modified folders as dirty
            set(folderCacheDirtyAtom({driveId:driveId, folderId:parentFolderId}), true);
          }
        }
        // Mark current folder as dirty
        set(folderCacheDirtyAtom({driveId:targetDriveId, folderId:targetFolderId}), true);

        let selectedItemIds = [];
        for (let item of globalSelectedNodes){
          selectedItemIds.push(item.itemId);
        }

        const payload = {
          sourceDriveId: globalSelectedNodes[0].driveId,
          selectedItemIds,
          selectedItemChildrenIds: driveIdChanged,
          destinationItemId: targetFolderId,
          destinationParentFolderId: destinationFolderObj.folderInfo.parentFolderId,
          destinationDriveId: targetDriveId,
          newSortOrder,
        }

        return axios.post("/api/moveItems.php", payload);
      // }
    }
  );

  const onMoveItemsError = () => {
    // TODO: revert changes
  }

  return { moveItems, onMoveItemsError };
}

export const useDragShadowCallbacks = () => {
  const replaceDragShadow = useRecoilCallback(({snapshot})=> 
    async () => {
      const { 
        dragShadowDriveId,
        dragShadowParentId, 
      } = await snapshot.getPromise(dragStateAtom);
      const globalSelectedNodes = await snapshot.getPromise(globalSelectedNodesAtom);
      
      // Check if drag shadow valid
      if (!dragShadowDriveId || !dragShadowParentId) return;

      let dragShadowParentFolderInfoObj = null;
      if (dragShadowDriveId && dragShadowParentId) dragShadowParentFolderInfoObj = await snapshot.getPromise(folderDictionary({ driveId: dragShadowDriveId, folderId: dragShadowParentId}));;
      let dragShadowParentDefaultOrder = dragShadowParentFolderInfoObj?.contentIds[sortOptions.DEFAULT];
      let insertIndex = dragShadowParentDefaultOrder?.indexOf(dragShadowId);

      if (insertIndex < 0) {
        return {}
      }

      return {
        targetDriveId: dragShadowDriveId,
        targetFolderId: dragShadowParentId,
        index: insertIndex,
        numItems: globalSelectedNodes.length
      }
    });

  const insertDragShadow = useRecoilCallback(({snapshot, set})=> 
    async ({driveIdFolderId, position, parentId, itemId }) => {
      const { 
        dragShadowDriveId,
        dragShadowParentId,
        draggedItemsId 
      } = await snapshot.getPromise(dragStateAtom);

      if (draggedItemsId && draggedItemsId?.has(itemId)) {
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
        urlId: null,
      }
      const insertPosition = position;
      
      const dropTargetParentId = parentId;
      let dragShadowParentFolderInfoObj = null;
      if (dragShadowDriveId && dragShadowParentId) dragShadowParentFolderInfoObj = await snapshot.getPromise(folderDictionary({ driveId: dragShadowDriveId, folderId: dragShadowParentId}));;

      // remove dragShadowId from dragShadowParentId (contentDictionary, contentIds)
      if (dragShadowParentFolderInfoObj) {
        set(folderDictionary({driveId: dragShadowDriveId, folderId: dragShadowParentId}),(old)=>{
          let newObj = {...old};
          let newDefaultOrder = [...newObj.contentIds[sortOptions.DEFAULT]];
          newDefaultOrder = newDefaultOrder.filter(itemId => itemId !== dragShadowId);
          const defaultOrderObj = {[sortOptions.DEFAULT]: newDefaultOrder};
          newObj.contentIds = defaultOrderObj;
          return newObj;
        })
      }
      
      if (insertPosition === "intoCurrent") {
        /*
         * Handle drag move: display drag shadow as a child of target item
         * insert dragShadowId into driveIdFolderId.folderId (contentDictionary, contentIds)
         */
        // Handle insertion into dragged items
        if (draggedItemsId && draggedItemsId?.has(driveIdFolderId.folderId)) return;
        
        set(folderDictionary(driveIdFolderId), (old)=>{
          let newObj = {...old};
          let newContentsDictionary = {...old.contentsDictionary};
          let newDefaultOrder = [...newObj.contentIds[sortOptions.DEFAULT]];

          // Copy dragShadow data into destination dictionary
          newContentsDictionary[dragShadowId] = dragShadow;

          // Make sure dragShadow not duplicated
          if (dragShadowParentId === dropTargetParentId) newDefaultOrder = newDefaultOrder.filter(itemId => itemId !== dragShadowId);
          
          // Insert dragShadow into order array
          newDefaultOrder.splice(0, 0, dragShadowId);
          
          // Update data
          const defaultOrderObj = {[sortOptions.DEFAULT]: newDefaultOrder};
          newObj.contentIds = defaultOrderObj;
          newObj.contentsDictionary = newContentsDictionary;
          return newObj;
        })

        // Update dragStateAtom.dragShadowParentId to dropTargetParentId
        set(dragStateAtom, (old) => {
          return {
            ...old,
            dragShadowDriveId: driveIdFolderId.driveId,
            dragShadowParentId: driveIdFolderId.folderId
          }
        })
      } else {
        /*
         * Handle drag re-ordering: display drag shadow before or after target item
         * insert dragShadowId into dropTargetParent (contentDictionary, contentIds)
         */

        // Helper function to verify if position of insertion is valid
        const isValidPosition = ({draggedItemsId, contentIdsArr, index}) => {
          // Allow any position if multiple items are being dragged
          if (draggedItemsId?.size > 1) return true;

          let isValid = true;
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
            
            if (prevItemId && draggedItemsId?.has(prevItemId)) isValid = false;
            if (nextItemId && draggedItemsId?.has(nextItemId)) isValid = false;
          }
          return isValid;
        }

        let isValid = true;

        set(folderDictionary({driveId: driveIdFolderId.driveId, folderId: dropTargetParentId}),(old)=>{
          let newObj = {...old};
          let newContentsDictionary = {...old.contentsDictionary};
          let newDefaultOrder = [...newObj.contentIds[sortOptions.DEFAULT]];

          // Copy dragShadow data into destination dictionary
          newContentsDictionary[dragShadowId] = dragShadow;

          // Make sure dragShadow not duplicated            
          if (dragShadowParentId === dropTargetParentId) newDefaultOrder = newDefaultOrder.filter(itemId => itemId !== dragShadowId);
          
          // Compute insertion index
          let index = newDefaultOrder.indexOf(itemId);
          if (insertPosition === "afterCurrent") index += 1;

          // Check if insertion index valid
          isValid = isValidPosition({draggedItemsId, contentIdsArr: newDefaultOrder, index});

          // Insert dragShadow into order array
          if (isValid) newDefaultOrder.splice(index, 0, dragShadowId);
          
          // Update data
          const defaultOrderObj = {[sortOptions.DEFAULT]: newDefaultOrder};
          newObj.contentIds = defaultOrderObj;
          newObj.contentsDictionary = newContentsDictionary;
          return newObj;
        })
        
        // Update dragShadow data in dragStateAtom
        if (isValid) {
          set(dragStateAtom, (old) => {
            return {
              ...old,
              dragShadowDriveId: driveIdFolderId.driveId,
              dragShadowParentId: dropTargetParentId
            }
          })  
        }
      }
  });

  const removeDragShadow = useRecoilCallback(({snapshot, set})=> 
    async () => {
      const { 
        dragShadowDriveId,
        dragShadowParentId
      } = await snapshot.getPromise(dragStateAtom);
      // Check if drag shadow valid
      if (!dragShadowDriveId || !dragShadowParentId) return;

      set(folderDictionary({driveId: dragShadowDriveId, folderId: dragShadowParentId}),(old)=>{
        let newObj = {...old};
        let newDefaultOrder = [...newObj.contentIds[sortOptions.DEFAULT]];
        newDefaultOrder = newDefaultOrder.filter(itemId => itemId !== dragShadowId);
        const defaultOrderObj = {[sortOptions.DEFAULT]: newDefaultOrder};
        newObj.contentIds = defaultOrderObj;
        return newObj;
      })
      set(dragStateAtom, (old) => {
        return {
          ...old,
          dragShadowDriveId: null,
          dragShadowParentId: null
        }
      })      
  });

  const cleanUpDragShadow = useRecoilCallback(({snapshot, set})=> 
    async () => {
      const { 
        dragShadowDriveId,
        dragShadowParentId,
        openedFoldersInfo
      } = await snapshot.getPromise(dragStateAtom);
      
      // If valid dragShadow, filter path of folders to dragShadow
      let openedFolders = [...openedFoldersInfo];
      let filteredOpenedFolders = [];
      if (dragShadowDriveId && dragShadowParentId) {
        let foldersOnPath = await snapshot.getPromise(nodePathSelector({driveId: dragShadowDriveId, folderId: dragShadowParentId}));
        let folderOnPathSet = new Set(foldersOnPath.map(obj => obj.folderId));
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
}

export const useSortFolder = () => {
  const sortFolder = useRecoilCallback(({set})=> 
    async ({driveIdInstanceIdFolderId, sortKey})=>{
      const {driveId, folderId} = driveIdInstanceIdFolderId;
      const {contentIds} = await snapshot.getPromise(folderDictionarySelector({driveId, folderId}));
      set(folderSortOrderAtom(driveIdInstanceIdFolderId), sortKey);
      
      // if sortOrder not already cached in folderDictionary
      if (!contentIds[sortKey]) {
        set(folderDictionary({driveId, folderId}), (old) => {
          let newObj = JSON.parse(JSON.stringify(old));
          let { contentsDictionary, contentIds } = newObj;
          let newFolderInfo = { ...newObj.folderInfo }
  
          const sortedFolderChildrenIds = sortItems({sortKey, nodeObjs: contentsDictionary, defaultFolderChildrenIds: contentIds[sortOptions.DEFAULT]});
  
          // Update folder data
          newObj.folderInfo = newFolderInfo;
          newObj.contentIds[sortKey] = sortedFolderChildrenIds;
          
          return newObj;
        });
      }
    }
  )

  const invalidateSortCache = useRecoilCallback(({set})=> 
    async ({driveIdFolderId})=>{
      set(folderDictionary(driveIdFolderId),(old)=>{
        let newObj = { ...old };
        let { contentIds } = old;

        newObj.contentIds = { [sortOptions.DEFAULT]: [...contentIds[sortOptions.DEFAULT]] };
        return newObj;
      });
      return;      
    } 
  )

  const onSortFolderError = () => {

  }

  return { sortFolder, invalidateSortCache, onSortFolderError }
}

export const useRenameItem = () => {
  const renameItem = useRecoilCallback(({snapshot, set})=> 
    async ({driveIdFolderId, itemId, itemType, newLabel})=>{
      const fInfo = await snapshot.getPromise(folderDictionary(driveIdFolderId));

      // Rename in folder
      let newFInfo = {...fInfo};
      newFInfo["contentsDictionary"] = {...fInfo.contentsDictionary}
      newFInfo["contentsDictionary"][itemId] = {...fInfo.contentsDictionary[itemId]};
      newFInfo["contentsDictionary"][itemId].label = newLabel;
      set(folderDictionary(driveIdFolderId), newFInfo);
      // If a folder, update the label in the child folder
      if (itemType === "Folder"){
        set(folderDictionary({driveId: driveIdFolderId.driveId, folderId:itemId}),(old)=>{
          let newFolderInfo = {...old}
          newFolderInfo.folderInfo = {...old.folderInfo}
          newFolderInfo.folderInfo.label = newLabel;
          return newFolderInfo;
        })
      }
      // TODO: Rename in selection
      
      // Rename in database
      const rndata = {
        instruction: "rename",
        driveId: driveIdFolderId.driveId,
        itemId: itemId,
        label: newLabel
      };
      
      const renamepayload = {
        params: rndata
      };
      return await axios.get("/api/updateItem.php", renamepayload);
    } 
  )

  const onRenameItemError = () => {

  }

  return { renameItem, onRenameItemError }
}

export const useAssignmentCallbacks = () => {
  const publishAssignment = useRecoilCallback(({set})=> 
    ({driveIdFolderId, itemId, payload})=>{
      set(folderDictionary(driveIdFolderId),(old)=>{
        let newObj = JSON.parse(JSON.stringify(old));
        let newItemObj = newObj.contentsDictionary[itemId];          
        newItemObj.assignment_isPublished = "1";
        newItemObj.isAssignment = "1";
        newItemObj.assignment_title = payload?.title;
        newItemObj.assignmentId = payload?.assignmentId;
        return newObj;
      })
    }
  )
  
  const onPublishAssignmentError = () => {
  }

  const publishContent = useRecoilCallback(({set})=> 
    ({driveIdFolderId, itemId})=>{
      set(folderDictionary(driveIdFolderId),(old)=>{
        let newObj = JSON.parse(JSON.stringify(old));
        let newItemObj = newObj.contentsDictionary[itemId];
        newItemObj.isPublished = "1";
        return newObj;
      })
    }
  )
  
  const onPublishContentError = () => {
  }

  const updateAssignmentTitle = useRecoilCallback(({set})=> 
    ({driveIdFolderId, itemId, payloadAssignment})=>{
      set(folderDictionary(driveIdFolderId),(old)=>{
        let newObj = JSON.parse(JSON.stringify(old));
        let newItemObj = newObj.contentsDictionary[itemId];          
        newItemObj.isAssignment = "1";
        newItemObj.assignment_title = payloadAssignment?.title;
        newItemObj.assignmentId = payloadAssignment?.assignmentId;
        return newObj;
      })
    }
  )
  
  const onUpdateAssignmentTitleError = () => {
  }

  const convertAssignmentToContent = useRecoilCallback(({set})=> 
    ({driveIdFolderId, itemId})=>{
      set(folderDictionary(driveIdFolderId),(old)=>{
        let newObj = JSON.parse(JSON.stringify(old));
        let newItemObj = newObj.contentsDictionary[itemId];
        newItemObj.isAssignment = "0";
        return newObj;
      })

    }
  )
  
  const onConvertAssignmentToContentError = () => {
  }

  return { 
    publishAssignment, 
    onPublishAssignmentError,
    publishContent,
    onPublishContentError,
    updateAssignmentTitle,
    onUpdateAssignmentTitleError,
    convertAssignmentToContent,
    onConvertAssignmentToContentError
  }
}