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
  sortItems
} from "../imports/Drive";
import { createComponentNamesFromParentName } from '../Doenet/utils/serializedStateProcessing';

const dragShadowId = "dragShadow";

// TODO: Remove this, only for reference as todo list
export const folderInfoSelectorActions = Object.freeze({
  // ADD_ITEM: "addItem",
  // DELETE_ITEM: "delete item",
  // MOVE_ITEMS: "move items",
  // SORT: "sort",
  PUBLISH_ASSIGNMENT: "assignment was published",
  PUBLISH_CONTENT: "content was published",
  ASSIGNMENT_TO_CONTENT: "assignment to content",
  UPDATE_ASSIGNMENT_TITLE: "assignment title update",
  INSERT_DRAG_SHADOW: "insertDragShadow",
  REMOVE_DRAG_SHADOW: "removeDragShadow",
  // REPLACE_DRAG_SHADOW: "replaceDragShadow",
  INVALIDATE_SORT_CACHE: "invalidate sort cache",
  RENAME_ITEM: "rename item",
  CLEAN_UP_DRAG: "clean up drag"
});

export const useAddItem = () => {
  const addItem = useRecoilCallback(({set})=> 
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
      
      // Insert item into destination folder
      // TODO: update to use fInfo
      set(folderDictionary(driveIdFolderId),(old)=>{
        let newObj = JSON.parse(JSON.stringify(old));
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
        return newObj;
      })

      // Update folderDictionary when new item is of type Folder
      if (itemType === "Folder"){
        set(folderDictionary({driveId:driveIdFolderId.driveId,folderId:itemId}), {
          folderInfo:newItem, 
          contentsDictionary:{},
          contentIds:{ [sortOptions.DEFAULT]: [] }
        });
      }
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

      return axios.get('/api/AddItem.php', payload);
    }
  );

  const onAddItemError = () => {
    // TODO: delete new item
  }

  return { addItem, onAddItemError };
};

export const useDeleteItem = () => {
  const deleteItem = useRecoilCallback(({snapshot, set})=> 
    async ({driveIdFolderId, driveInstanceId, itemId})=>{
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
      set(folderDictionary(driveIdFolderId), newFInfo);
      
      // Remove from database
      const pdata = {
        driveId: driveIdFolderId.driveId,
        itemId: itemId
      }
      const deletepayload = {
        params: pdata
      }

      return axios.get("/api/deleteItem.php", deletepayload);
  });

  const onDeleteItemError = () => {
    // TODO: re-add new item
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

export const useReplaceDragShadow = () => {
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
  return {replaceDragShadow};
}

export const useSortFolder = () => {
  const sortFolder = useRecoilCallback(({set})=> 
    async ({driveIdInstanceIdFolderId, sortKey})=>{
      const {contentIds} = get(folderDictionarySelector({driveId, folderId}))
      set(folderSortOrderAtom(driveIdInstanceIdFolderId), sortKey);
      
      // if sortOrder not already cached in folderDictionary
      if (!contentIds[instructions.sortKey]) {
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
    } 
  )

  const onSortFolderError = () => {

  }

  return { sortFolder, invalidateSortCache, onSortFolderError }
}