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
  getLexicographicOrder
} from "../imports/Drive";
import { createComponentNamesFromParentName } from '../Doenet/utils/serializedStateProcessing';


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
      console.log("HERE")
      const selectedDriveItems = await snapshot.getPromise(selectedDriveItemsAtom(item));
      console.log(selectedDriveItems)
      
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