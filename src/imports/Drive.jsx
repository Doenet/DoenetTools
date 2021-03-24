import React, {useContext, useRef, useEffect, Suspense, useCallback, useState} from 'react';
import { IsNavContext } from "./Tool/Panels/NavPanel";
import axios from "axios";
import { nanoid } from 'nanoid';
import './util.css';
import { faTrashAlt, 
  faLink, 
  faCode, 
  faFolder,
  faChevronRight, 
  faChevronDown, 
  faSortUp, 
  faSortDown, 
  faUsersSlash, 
  faUsers, 
  faUserEdit, 
  faSort,
  faBookOpen,
  faChalkboard
 } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Measure from 'react-measure'

import {
  DropTargetsContext,
  WithDropTarget  
} from './DropTarget';
import Draggable from './Draggable';
import getSortOrder from './LexicographicalRankingSort';

import { BreadcrumbContext } from './Breadcrumb';
import { drivecardSelectedNodesAtom } from '../Tools/DoenetLibrary';

import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory,
  Link
} from "react-router-dom";

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
} from 'recoil';
import ChildLogic from '../Doenet/ChildLogic';

const fetchDriveUsersQuery = atomFamily({
  key:"fetchDriveUsersQuery",
  default: selectorFamily({
    key:"fetchDriveUsersQuery/Default",
    get: (driveId) => async ()=>{
      const payload = { params: {driveId} };
      const { data } = await  axios.get('/api/loadDriveUsers.php', payload)
    return data
  }
  })
})

export const fetchDriveUsers = selectorFamily({
  key:"fetchDriveUsers",
  get:(driveId)=>({get})=>{
    return get(fetchDriveUsersQuery(driveId));
  },
  set:(driveId)=>({get,set},instructions)=>{
    let payload = { params: {
      email:instructions.email,
      type:instructions.type,
      driveId,
      userId:instructions.userId
    } };

    switch(instructions.type){
      case "Add Owner":
        axios.get('/api/saveUserToDrive.php', payload)
        .then((resp)=>{
          instructions.callback(resp.data);
        })
        
        break;
      case "Add Owner step 2":
        set(fetchDriveUsersQuery(driveId),(was)=>{
          let newDriveUsers = {...was}
          let newOwners = [...was.owners];
          newOwners.push({
            email:instructions.email,
            isUser:false,
            screenName:instructions.screenName,
            userId:instructions.userId
          })
          newDriveUsers['owners'] = newOwners;
          return newDriveUsers;
        })
          
        break;
      case "Add Admin":
        axios.get('/api/saveUserToDrive.php', payload)
        .then((resp)=>{
          instructions.callback(resp.data);
        })
        break;
      case "Add Admin step 2":
        set(fetchDriveUsersQuery(driveId),(was)=>{
          let newDriveUsers = {...was}
          let newAdmins = [...was.admins];
          newAdmins.push({
            email:instructions.email,
            isUser:false,
            screenName:instructions.screenName,
            userId:instructions.userId
          })
          newDriveUsers['admins'] = newAdmins;
          return newDriveUsers;
        })
        break;
      case "Remove User":
        set(fetchDriveUsersQuery(driveId),(was)=>{
          let newDriveUsers = {...was}
        if (instructions.userRole === "owner"){
          let newOwners = [...was.owners];
          for (let [i,owner] of newOwners.entries()){
            if (owner.userId === instructions.userId){
              newOwners.splice(i,1);
              break;
            }
          }
          newDriveUsers['owners'] = newOwners;
        }
        if (instructions.userRole === "admin"){
          let newAdmins = [...was.admins];
          for (let [i,admin] of newAdmins.entries()){
            if (admin.userId === instructions.userId){
              newAdmins.splice(i,1);
              break;
            }
          }
            newDriveUsers['admins'] = newAdmins;
        }
          return newDriveUsers;
        })

        axios.get('/api/saveUserToDrive.php', payload)
        // .then((resp)=>{console.log(">>>resp",resp.data) })

        break;
      case "To Owner":
        set(fetchDriveUsersQuery(driveId),(was)=>{
          let newDriveUsers = {...was}
          let userEntry = {};
          let newAdmins = [...was.admins];
          for (let [i,admin] of newAdmins.entries()){
            if (admin.userId === instructions.userId){
              userEntry = admin;
              newAdmins.splice(i,1);
              break;
            }
          }
            newDriveUsers['admins'] = newAdmins;
        
          let newOwners = [...was.owners];
          newOwners.push(userEntry);
          newDriveUsers['owners'] = newOwners;

          return newDriveUsers;
        })

        axios.get('/api/saveUserToDrive.php', payload)
        // .then((resp)=>{console.log(">>>resp",resp.data) })

      break;
      case "To Admin":
        set(fetchDriveUsersQuery(driveId),(was)=>{
          let newDriveUsers = {...was}
          let userEntry = {};

          let newOwners = [...was.owners];
          for (let [i,owner] of newOwners.entries()){
            if (owner.userId === instructions.userId){
              if (owner.isUser){
                newDriveUsers.usersRole = "admin";
              }
              userEntry = owner;
              newOwners.splice(i,1);
              break;
            }
          }
          newDriveUsers['owners'] = newOwners;
    
          let newAdmins = [...was.admins];
          newAdmins.push(userEntry);
          newDriveUsers['admins'] = newAdmins;

          return newDriveUsers;
        })

        axios.get('/api/saveUserToDrive.php', payload)
        // .then((resp)=>{console.log(">>>resp",resp.data) })

      break;
      default:
        console.log(`type ${instructions.type} not handled`)
    }
  }
})

const sortOptions = Object.freeze({
  "DEFAULT": "defaultOrder",
  "LABEL_ASC": "label ascending",
  "LABEL_DESC": "label descending",
  "CREATION_DATE_ASC": "creation date ascending",
  "CREATION_DATE_DESC": "creation date descending"
}); 

export const globalSelectedNodesAtom = atom({
  key:'globalSelectedNodesAtom',
  default:[]
})

export const selectedDriveAtom = atom({
  key: 'selectedDriveAtom',
  default: ""
})

const dragStateAtom = atom({
  key: 'dragStateAtom',
  default: {
    isDragging: false,
    draggedItemsId: null,
    draggedOverDriveId: null,
    isDraggedOverBreadcrumb: false,
    dragShadowDriveId: null,
    dragShadowParentId: null,
    openedFoldersInfo: null
  }
})
const dragShadowId = "dragShadow";

export default function Drive(props){
  // console.log("=== Drive")
  const isNav = useContext(IsNavContext);

  const drivesAvailable = useRecoilValueLoadable(fetchDrivesQuery);
  if (drivesAvailable.state === "loading"){ return null;}
  if (drivesAvailable.state === "hasError"){ 
    console.error(drivesAvailable.contents)
    return null;}


  if (props.types){
    let drives = [];
    for (let type of props.types){
      for (let driveObj of drivesAvailable.contents.driveIdsAndLabels){
        if (driveObj.type === type && driveObj.subType === 'Administrator'){
          drives.push(
          <React.Fragment key={`drive${driveObj.driveId}${isNav}`} ><Router ><Switch>
           <Route path="/" render={(routeprops)=>
            <Suspense fallback={<div></div>}>
              <DriveRouted route={{...routeprops}} driveId={driveObj.driveId} label={driveObj.label} isNav={isNav} {...props} driveObj={driveObj}/>
            </Suspense>
           }></Route>
         </Switch></Router></React.Fragment>)
        }
      }
    }
    return <>
    {drives}</>
  }else if (props.driveId){
    for (let driveObj of drivesAvailable.contents.driveIdsAndLabels){
        if (driveObj.driveId === props.driveId){
         return <Router><Switch>
           <Route path="/" render={(routeprops)=>
            <Suspense fallback={<div></div>}>
              <DriveRouted route={{...routeprops}} driveId={driveObj.driveId} label={driveObj.label} isNav={isNav} {...props} driveObj={driveObj}/>
            </Suspense>
           }></Route>
         </Switch></Router>
        }
    }
    console.warn("Don't have a drive with driveId ",props.id)
    return null;
  }else{
    console.warn("Drive needs types or driveId defined.")
    return null;
  }
}

let loadDriveInfoQuery = selectorFamily({
  key:"loadDriveInfoQuery",
  get: (driveId) => async ({get,set})=>{
    const { data } = await axios.get(
      `/api/loadFolderContent.php?driveId=${driveId}&init=true`
    );
    // console.log("loadDriveInfoQuery DATA ",data)
    // let itemDictionary = {};
    //   for (let item of data.results){
    //     itemDictionary[item.itemId] = item;
    //   }
    //   data["itemDictionary"] = itemDictionary;
    return data;
  },
 
})

//Find DriveInstanceId's given driveId
let driveInstanceIdDictionary = atomFamily({
  key:"driveInstanceIdDictionary",
  default:[]
})

export const folderDictionary = atomFamily({
  key:"folderDictionary",
  default:selectorFamily({
    key:"folderDictionary/Default",
    get:(driveIdFolderId)=>({get})=>{
      if (driveIdFolderId.driveId === ""){
        return {folderInfo:{},contentsDictionary:{},contentIds:{}}
      }
      const driveInfo = get(loadDriveInfoQuery(driveIdFolderId.driveId))
      let defaultOrder = [];
      let contentsDictionary = {};
      let contentIds = {};
      let folderInfo = {};
      for (let item of driveInfo.results){
        if (item.parentFolderId === driveIdFolderId.folderId){
          defaultOrder.push(item.itemId);
          contentsDictionary[item.itemId] = item;
        }
        if (item.itemId === driveIdFolderId.folderId){
          folderInfo = item;
        }
      }
      defaultOrder = sortItems({sortKey: sortOptions.DEFAULT, nodeObjs: contentsDictionary, defaultFolderChildrenIds: defaultOrder});
      contentIds[sortOptions.DEFAULT] = defaultOrder;
      return {folderInfo,contentsDictionary,contentIds}
    } 
  })
})

export const folderDictionarySelector = selectorFamily({
  //{driveId,folderId}
  get:(driveIdFolderId)=>({get})=>{
    return get(folderDictionary(driveIdFolderId));
  },
  set: (driveIdFolderId) => async ({set,get},instructions)=>{
    const fInfo = get(folderDictionary(driveIdFolderId))
    const { dragShadowDriveId, dragShadowParentId, draggedItemsId, openedFoldersInfo } = get(dragStateAtom);
    let dragShadowParentFolderInfoObj = null;
    
    let item = {driveId:driveIdFolderId.driveId,driveInstanceId:instructions.driveInstanceId,itemId:instructions.itemId}
    let newFInfo = {...fInfo}

    // console.log(">>>finfo",fInfo)
    switch(instructions.instructionType){
      case folderInfoSelectorActions.ADD_ITEM:
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
          itemType: instructions.itemType,
          label: instructions.label,
          parentFolderId: driveIdFolderId.folderId,
          url: instructions.url,
          urlDescription: null,
          urlId: null,
          sortOrder: "",
        }
        //TODO: update to use fInfo
        set(folderDictionary(driveIdFolderId),(old)=>{
          let newObj = JSON.parse(JSON.stringify(old));
          let newDefaultOrder = [...newObj.contentIds[sortOptions.DEFAULT]];
          let index = newDefaultOrder.indexOf(instructions.selectedItemId);
          const newOrder = getLexicographicOrder({
            index, 
            nodeObjs: newObj.contentsDictionary, 
            defaultFolderChildrenIds: newDefaultOrder 
          });
          newItem.sortOrder = newOrder;
          newDefaultOrder.splice(index+1, 0, itemId);
          newObj.contentIds[sortOptions.DEFAULT] = newDefaultOrder;
          newObj.contentsDictionary[itemId] = newItem;
          // newObj.folderInfo.dirty = 1;
          return newObj;
        })
        if (instructions.itemType === "Folder"){
          //If a folder set folderInfo and zero items
          set(folderDictionary({driveId:driveIdFolderId.driveId,folderId:itemId}),{
            folderInfo:newItem,contentsDictionary:{},contentIds:{[sortOptions.DEFAULT]:[]}
          })
        }
        const versionId = nanoid();

        const data = { 
          driveId:driveIdFolderId.driveId,
          parentFolderId:driveIdFolderId.folderId,
          itemId,
          label:instructions.label,
          type:instructions.itemType,
          branchId,
          versionId,
          sortOrder: newItem.sortOrder,
         };
        const payload = { params: data };

        axios.get('/api/AddItem.php', payload)
        .then(resp=>{
          //Not sure how to handle errors when saving data yet
          // throw Error("made up error")
        })
      break;
      case folderInfoSelectorActions.SORT:
        const { sortKey } = instructions;
        set(folderDictionary(driveIdFolderId),(old)=>{
          let newObj = JSON.parse(JSON.stringify(old));
          let { contentsDictionary, contentIds } = newObj;
          let newFolderInfo = { ...newObj.folderInfo }

          // sort folder child array
          const sortedFolderChildrenIds = sortItems({sortKey, nodeObjs: contentsDictionary, defaultFolderChildrenIds: contentIds[sortOptions.DEFAULT]});

          // update folder data
          newObj.folderInfo = newFolderInfo;
          newObj.contentIds[sortKey] = sortedFolderChildrenIds;
          
          return newObj;
        })

        break;
      case folderInfoSelectorActions.INVALIDATE_SORT_CACHE:
        set(folderDictionary(driveIdFolderId),(old)=>{
          let newObj = { ...old };
          let { contentIds } = old;

          newObj.contentIds = { [sortOptions.DEFAULT]: [...contentIds[sortOptions.DEFAULT]] };
          return newObj;
        });

        break;
      case folderInfoSelectorActions.RENAME_ITEM:
        //Rename Item in folder
        newFInfo["contentsDictionary"] = {...fInfo.contentsDictionary}
        newFInfo["contentsDictionary"][instructions.itemId] = {...fInfo.contentsDictionary[instructions.itemId]};
        newFInfo["contentsDictionary"][instructions.itemId].label = instructions.label;
        set(folderDictionary(driveIdFolderId),newFInfo);
        //If a folder, update the label in the child folder
        if (instructions.itemType === "Folder"){
          set(folderDictionary({driveId:driveIdFolderId.driveId,folderId:instructions.itemId}),(old)=>{
            let newFolderInfo = {...old}
            newFolderInfo.folderInfo = {...old.folderInfo}
            newFolderInfo.folderInfo.label = instructions.label;
            return newFolderInfo;
          })
        }
        //TODO: Rename in selection
        // if (get(selectedDriveItemsAtom(item))){
        //   set(selectedDriveItemsAtom(item),false)
        //   let newGlobalItems = [];
        //   for(let gItem of get(globalSelectedNodesAtom)){
        //     if (gItem.itemId !== instructions.itemId){
        //       newGlobalItems.push(gItem)
        //     }
        //   }
        //   set(globalSelectedNodesAtom,newGlobalItems)
        // }
        //Rename in  database
        const rndata = {
          instruction:"rename",
          driveId:driveIdFolderId.driveId,
          itemId:instructions.itemId,
          label:instructions.label}
        
        const renamepayload = {
          params: rndata
        }
        const { renamedata } = await axios.get("/api/updateItem.php", renamepayload)
        // .then((resp)=>console.log(">>>resp",resp.data))
      break;
      case folderInfoSelectorActions.DELETE_ITEM:
        //Remove from folder
        newFInfo["contentsDictionary"] = {...fInfo.contentsDictionary}
        delete newFInfo["contentsDictionary"][instructions.itemId];
        newFInfo.folderInfo = {...fInfo.folderInfo}
        newFInfo.contentIds = {}
        newFInfo.contentIds[sortOptions.DEFAULT] = [...fInfo.contentIds[sortOptions.DEFAULT]]
        const index = newFInfo.contentIds[sortOptions.DEFAULT].indexOf(instructions.itemId)
        newFInfo.contentIds[sortOptions.DEFAULT].splice(index,1)
        set(folderDictionary(driveIdFolderId),newFInfo);
        //Remove from selection
        if (get(selectedDriveItemsAtom(item))){
          set(selectedDriveItemsAtom(item),false)
          let newGlobalItems = [];
          for(let gItem of get(globalSelectedNodesAtom)){
            if (gItem.itemId !== instructions.itemId){
              newGlobalItems.push(gItem)
            }
          }
          set(globalSelectedNodesAtom,newGlobalItems)
        }
        //Remove from database
        const pdata = {driveId:driveIdFolderId.driveId,itemId:instructions.itemId}
        const deletepayload = {
          params: pdata
        }
        const { deletedata } = await axios.get("/api/deleteItem.php", deletepayload)

      break;
      case folderInfoSelectorActions.MOVE_ITEMS:
        //Don't move if nothing selected or draging folder to itself
        let canMove = true;
        if (get(globalSelectedNodesAtom).length === 0){ canMove = false;}
        //TODO: Does this catch every case of folder into itself?
        for(let gItem of get(globalSelectedNodesAtom)){
          if (gItem.itemId === instructions.itemId){
            console.log("Can't move folder into itself") //TODO: Toast
            canMove = false;
          }
        }
        if (canMove){
          
          // //Add to destination at end
          let destinationFolderObj = get(folderDictionary({driveId:instructions.driveId,folderId:instructions.itemId}))
          let newDestinationFolderObj = JSON.parse(JSON.stringify(destinationFolderObj));
          let globalSelectedItems = get(globalSelectedNodesAtom)
          let editedCache = {};
          let driveIdChanged = [];
          const insertIndex = instructions.index ?? 0;
          let newSortOrder = "";

          for(let gItem of globalSelectedItems){
            //Deselect Item
            let selecteditem = {driveId:gItem.driveId,driveInstanceId:gItem.driveInstanceId,itemId:gItem.itemId}
            set(selectedDriveItemsAtom(selecteditem),false)

            const oldSourceFInfo = get(folderDictionary({driveId:gItem.driveId, folderId:gItem.parentFolderId}));
            // get parentInfo from edited cache or derive from oldSource
            let newSourceFInfo = editedCache[gItem.driveId]?.[gItem.parentFolderId];
            if (!newSourceFInfo) newSourceFInfo = JSON.parse(JSON.stringify(oldSourceFInfo));

            if (gItem.parentFolderId !== instructions.itemId) {  
              // remove item from original parent contentIds
              let index = newSourceFInfo["contentIds"]["defaultOrder"].indexOf(gItem.itemId);
              newSourceFInfo["contentIds"]["defaultOrder"].splice(index, 1)

              // add item to destination dictionary
              newDestinationFolderObj["contentsDictionary"][gItem.itemId] = {...newSourceFInfo["contentsDictionary"][gItem.itemId]}

              // remove item from original dictionary
              delete newSourceFInfo["contentsDictionary"][gItem.itemId];

              // item must be removed from parent, add to edited cache
              if (!editedCache[gItem.driveId]) editedCache[gItem.driveId] = {};
              editedCache[gItem.driveId][gItem.parentFolderId] = newSourceFInfo;
            } else {
              // make sure item not duplicated in destination contentIds
              newDestinationFolderObj["contentIds"]["defaultOrder"] = newDestinationFolderObj["contentIds"]["defaultOrder"].filter(itemId => itemId !== gItem.itemId);
            }

            /* generate and update sortOrder */
            const cleanDefaultOrder = newDestinationFolderObj["contentIds"]["defaultOrder"].filter(itemId => itemId !== dragShadowId);
            newSortOrder = getLexicographicOrder({
              index: insertIndex, 
              nodeObjs: newDestinationFolderObj.contentsDictionary, 
              defaultFolderChildrenIds: cleanDefaultOrder 
            });
            newDestinationFolderObj["contentsDictionary"][gItem.itemId].sortOrder = newSortOrder;
            newDestinationFolderObj["contentsDictionary"][gItem.itemId].parentFolderId = instructions.itemId;

            // insert item into contentIds of destination
            newDestinationFolderObj["contentIds"]["defaultOrder"].splice(insertIndex, 0, gItem.itemId)

            /* if moved item is a folder, update folder info */
            if (oldSourceFInfo["contentsDictionary"][gItem.itemId].itemType === "Folder") {
              // retrieval from folderDictionary necessary when moving to different drive
              const gItemFolderInfoObj = get(folderDictionary({driveId: gItem.driveId, folderId: gItem.itemId}));
              set(folderDictionary({driveId: instructions.driveId, folderId: gItem.itemId}),()=>{
                let newFolderInfo = {...gItemFolderInfoObj}
                newFolderInfo.folderInfo = {...gItemFolderInfoObj.folderInfo}
                newFolderInfo.folderInfo.parentFolderId = instructions.itemId;
                return newFolderInfo;
              })
            }

            /* if moved between drives, handle update driveId */
            if (gItem.driveId !== instructions.driveId) {
              driveIdChanged.push(gItem.itemId)

              /* update driveId of all children in the subtree */
              if (oldSourceFInfo["contentsDictionary"][gItem.itemId].itemType === "Folder") {
                let gItemChildIds = [];
                let queue = [gItem.itemId];

                /* BFS tree-walk to iterate through all child nodes */
                while (queue.length) {
                  let size = queue.length;
                  for (let i = 0; i < size; i++) {
                    let currentNodeId = queue.shift();
                    const folderInfoObj = get(folderDictionarySelector({ driveId: gItem.driveId, folderId: currentNodeId}));
                    gItemChildIds.push(currentNodeId);
                    for (let childId of folderInfoObj?.contentIds?.[sortOptions.DEFAULT]) {
                      if (folderInfoObj?.contentsDictionary[childId].itemType === "Folder") {
                        // migrate child folderInfo into destination driveId
                        const childFolderInfoObj = get(folderDictionary({driveId: gItem.driveId, folderId: childId}));
                        set(folderDictionary({driveId: instructions.driveId, folderId: childId}), childFolderInfoObj);
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
          //Add all to destination
          set(folderDictionary({driveId:instructions.driveId, folderId:instructions.itemId}), newDestinationFolderObj);
          //Clear global selection
          set(globalSelectedNodesAtom,[])
          //Remove from sources
          
          for (let driveId of Object.keys(editedCache)){
            for (let parentFolderId of Object.keys(editedCache[driveId])) {
              set(folderDictionary({driveId:driveId,folderId:parentFolderId}),editedCache[driveId][parentFolderId])
              // Mark modified folders as dirty
              set(folderCacheDirtyAtom({driveId:driveId, folderId:parentFolderId}), true);
            }
          }
          //Mark current folder as dirty
          set(folderCacheDirtyAtom({driveId:instructions.driveId, folderId:instructions.itemId}), true);

          let selectedItemIds = [];
          for (let item of globalSelectedItems){
            selectedItemIds.push(item.itemId);
          }

          const payload = {
            sourceDriveId:globalSelectedItems[0].driveId,
            selectedItemIds,
            selectedItemChildrenIds: driveIdChanged,
            destinationItemId:instructions.itemId,
            destinationParentFolderId:destinationFolderObj.folderInfo.parentFolderId,
            destinationDriveId:instructions.driveId,
            newSortOrder,
          }
          axios.post("/api/moveItems.php", payload)
          .then((resp)=>{
            // console.log(resp.data)
          }
          )
          
        }
      break;
      case folderInfoSelectorActions.PUBLISH_ASSIGNMENT:
        set(folderDictionary(driveIdFolderId),(old)=>{
          let newObj = JSON.parse(JSON.stringify(old));
          let newItemObj = newObj.contentsDictionary[instructions.itemId];          
          newItemObj.assignment_isPublished = "1";
          newItemObj.isAssignment = "1";
          newItemObj.assignment_title = instructions.payload.title;
          newItemObj.assignmentId=instructions.payload.assignmentId;
          return newObj;
        })
      
        break;
      case folderInfoSelectorActions.PUBLISH_CONTENT:
        set(folderDictionary(driveIdFolderId),(old)=>{
          let newObj = JSON.parse(JSON.stringify(old));
          let newItemObj = newObj.contentsDictionary[instructions.itemId];
          newItemObj.isPublished = "1";
          return newObj;
        })
        
      break;
      case folderInfoSelectorActions.ASSIGNMENT_TO_CONTENT:
        set(folderDictionary(driveIdFolderId),(old)=>{
          let newObj = JSON.parse(JSON.stringify(old));
          let newItemObj = newObj.contentsDictionary[instructions.itemId];
          newItemObj.isAssignment = "0";
          return newObj;
        })
     
      break;
      case folderInfoSelectorActions.UPDATE_ASSIGNMENT_TITLE:
        set(folderDictionary(driveIdFolderId),(old)=>{
          let newObj = JSON.parse(JSON.stringify(old));
          let newItemObj = newObj.contentsDictionary[instructions.itemId];          
          newItemObj.isAssignment = "1";
          newItemObj.assignment_title = instructions.payloadAssignment.title;
          newItemObj.assignmentId=instructions.payloadAssignment.assignmentId;
          return newObj;
        })
        break;
      case folderInfoSelectorActions.INSERT_DRAG_SHADOW:
        if (draggedItemsId && draggedItemsId?.has(instructions.itemId)) {
          set(folderDictionarySelector(driveIdFolderId), {instructionType: folderInfoSelectorActions.REMOVE_DRAG_SHADOW});
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
          parentFolderId: instructions.parentId,
          url: null,
          urlDescription: null,
          urlId: null,
        }
        const insertPosition = instructions.position;
        
        const dropTargetParentId = instructions.parentId;
        if (dragShadowDriveId && dragShadowParentId) dragShadowParentFolderInfoObj = get(folderDictionarySelector({ driveId: dragShadowDriveId, folderId: dragShadowParentId}));

        // remove dragShadowId from dragShadowParentId (contentDictionary, contentIds)
        if (dragShadowParentFolderInfoObj) {
          set(folderDictionary({driveId: driveIdFolderId.driveId, folderId: dragShadowParentId}),(old)=>{
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

          /* Helper function to verify if position of insertion is valid */
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
            let index = newDefaultOrder.indexOf(instructions.itemId);
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
        break;
      case folderInfoSelectorActions.REMOVE_DRAG_SHADOW:
        // check if drag shadow valid
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
      break;
      case folderInfoSelectorActions.REPLACE_DRAG_SHADOW:
        // check if drag shadow valid
        if (!dragShadowDriveId || !dragShadowParentId) return;

        if (dragShadowDriveId && dragShadowParentId) dragShadowParentFolderInfoObj = get(folderDictionarySelector({ driveId: dragShadowDriveId, folderId: dragShadowParentId}));
        let dragShadowParentDefaultOrder = dragShadowParentFolderInfoObj?.contentIds[sortOptions.DEFAULT];
        let insertIndex = dragShadowParentDefaultOrder?.indexOf(dragShadowId);
        
        if (insertIndex >= 0) {
          const instructions = {
            instructionType: folderInfoSelectorActions.MOVE_ITEMS,
            driveId: dragShadowDriveId,
            itemId: dragShadowParentId,
            index: insertIndex
          }
          set(folderDictionarySelector(driveIdFolderId), instructions);
        }
      break;
      case folderInfoSelectorActions.CLEAN_UP_DRAG:
        // If valid dragShadow, filter path of folders to dragShadow
        let openedFolders = [...openedFoldersInfo];
        let filteredOpenedFolders = [];
        if (dragShadowDriveId && dragShadowParentId) {
          let foldersOnPath = get(nodePathSelector({driveId: dragShadowDriveId, folderId: dragShadowParentId}));
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
      break;
      default:
        console.warn(`Instruction ${instructions.instructionType} not currently handled`)
    }
    
  }
  // set:(setObj,newValue)=>({set,get})=>{
  //   console.log("setObj",setObj,newValue);

  // }
})

const folderSortOrderAtom = atomFamily({
  key:"folderSortOrderAtom",
  default:sortOptions.DEFAULT
})

const folderCacheDirtyAtom = atomFamily({
  key:"foldedCacheDirtyAtom",
  default:false
})

export const folderInfoSelectorActions = Object.freeze({
  ADD_ITEM: "addItem",
  DELETE_ITEM: "delete item",
  MOVE_ITEMS: "move items",
  SORT: "sort",
  PUBLISH_ASSIGNMENT: "assignment was published",
  PUBLISH_CONTENT: "content was published",
  ASSIGNMENT_TO_CONTENT: "assignment to content",
  UPDATE_ASSIGNMENT_TITLE: "assignment title update",
  INSERT_DRAG_SHADOW: "insertDragShadow",
  REMOVE_DRAG_SHADOW: "removeDragShadow",
  REPLACE_DRAG_SHADOW: "replaceDragShadow",
  INVALIDATE_SORT_CACHE: "invalidate sort cache",
  RENAME_ITEM: "rename item",
  CLEAN_UP_DRAG: "clean up drag"
});

const useFolderSelectorCallbacks = () => {

}

export const folderInfoSelector = selectorFamily({
  get:(driveIdInstanceIdFolderId)=>({get})=>{
    const { driveId, folderId } = driveIdInstanceIdFolderId;
    
    const {folderInfo, contentsDictionary, contentIds} = get(folderDictionarySelector({driveId, folderId}))
    const folderSortOrder = get(folderSortOrderAtom(driveIdInstanceIdFolderId))
    let contentIdsArr = contentIds[folderSortOrder] ?? [];

    const sortedContentIdsNotInCache = !contentIdsArr.length && contentIds[sortOptions.DEFAULT].length;
    if (sortedContentIdsNotInCache) {
      contentIdsArr = sortItems({sortKey: folderSortOrder, nodeObjs: contentsDictionary, defaultFolderChildrenIds: contentIds[sortOptions.DEFAULT]});
    }

    let newFolderInfo = { ...folderInfo };
    newFolderInfo.sortBy = folderSortOrder
    return {folderInfo: newFolderInfo, contentsDictionary, contentIdsArr};
  },
  set: (driveIdInstanceIdFolderId) => async ({set,get}, instructions)=>{
    const { driveId, folderId } = driveIdInstanceIdFolderId;

    const dirtyActions = new Set([folderInfoSelectorActions.ADD_ITEM, folderInfoSelectorActions.DELETE_ITEM])
    if (dirtyActions.has(instructions.instructionType)) {
      set(folderSortOrderAtom(driveIdInstanceIdFolderId), sortOptions.DEFAULT);
    }

    switch(instructions.instructionType){
      case folderInfoSelectorActions.SORT:
        const {contentIds} = get(folderDictionarySelector({driveId, folderId}))
        set(folderSortOrderAtom(driveIdInstanceIdFolderId), instructions.sortKey);
        
        // if sortOrder not already cached in folderDictionary
        if (!contentIds[instructions.sortKey]) {
          set(folderDictionarySelector({driveId, folderId}), instructions);
        }
        
        break;
      default:
        set(folderDictionarySelector({driveId, folderId}), instructions);
    }
  }
});

const sortItems = ({ sortKey, nodeObjs, defaultFolderChildrenIds }) => {
  let tempArr = [...defaultFolderChildrenIds];
  switch (sortKey) {
    case sortOptions.DEFAULT:
      tempArr.sort(
        (a,b) => { 
          return (nodeObjs[a].sortOrder.localeCompare(nodeObjs[b].sortOrder))}
      );
      break;
    case sortOptions.LABEL_ASC:
      tempArr.sort(
        (a,b) => { 
          return (nodeObjs[a].label.localeCompare(nodeObjs[b].label))}
      );
      break;
    case sortOptions.LABEL_DESC:
      tempArr.sort(
        (b,a) => { 
          return (nodeObjs[a].label.localeCompare(nodeObjs[b].label))}
      );
      break;
    case sortOptions.CREATION_DATE_ASC:
      tempArr.sort(
        (a,b) => { 
          return (new Date(nodeObjs[a].creationDate) - new Date(nodeObjs[b].creationDate))}
      );
      break;
    case sortOptions.CREATION_DATE_DESC:
      tempArr.sort(
        (b,a) => { 
          return (new Date(nodeObjs[a].creationDate) - new Date(nodeObjs[b].creationDate))}
      );
      break;
  }
  return tempArr;
};

const getLexicographicOrder = ({ index, nodeObjs, defaultFolderChildrenIds=[] }) => {
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
    
    if (nodeObjs[prevItemId]) prevItemOrder = nodeObjs?.[prevItemId]?.sortOrder ?? "";
    if (nodeObjs[nextItemId]) nextItemOrder = nodeObjs?.[nextItemId]?.sortOrder ?? "";
  }
  const sortOrder = getSortOrder(prevItemOrder, nextItemOrder);
  return sortOrder;
}


function DriveHeader(props){
  const [width,setWidth] = useState(0);
  const [numColumns,setNumColumns] = useState(4);

  let columns = '250px repeat(3,1fr)';
  if (numColumns === 3){
    columns = '250px 1fr 1fr';
  }else if (numColumns === 2){
    columns = '250px 1fr';
  }else if (numColumns === 1){
    columns = '100%';
  }

  //update number of columns in header
  const breakpoints = [375,500,650];
  if (width >= breakpoints[2] && numColumns !== 4){
    if (props.setNumColumns){props.setNumColumns(4)}
    setNumColumns(4);
  }else if(width < breakpoints[2] && width >= breakpoints[1] && numColumns !== 3){
    if (props.setNumColumns){props.setNumColumns(3)}
    setNumColumns(3);
  }else if(width < breakpoints[1] && width >= breakpoints[0] && numColumns !== 2){
    if (props.setNumColumns){props.setNumColumns(2)}
    setNumColumns(2);
  }else if(width < breakpoints[0] && numColumns !== 1){
    if (props.setNumColumns){props.setNumColumns(1)}
    setNumColumns(1);
  }


  return (
    <Measure
    bounds
    onResize={contentRect =>{
      setWidth(contentRect.bounds.width)
    }}
    >
      {({ measureRef }) => (
          <div 
          ref={measureRef} 
          data-doenet-driveinstanceid={props.driveInstanceId}
          className="noselect nooutline" 
          style={{
            padding: "8px",
            border: "0px",
            borderBottom: "1px solid grey",
            backgroundColor: "#f6f8ff",
            maxWidth: "850px",
            margin: "0px",
          }} 
          >

            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: columns,
                gridTemplateRows: '1fr',
                alignContent: 'center'
              }}>
                <span>Name</span> 
              {numColumns >= 2 ? <span>Date</span> : null}  
              {numColumns >= 3 ? <span>Published</span> : null}  
              {numColumns >= 4 ? <span>Assigned</span> : null}  
           
              </div>
          </div>
        )}
    </Measure>
  )

} 


function DriveRouted(props){

  // console.log("=== DriveRouted")
  const [numColumns,setNumColumns] = useState(1);

  let hideUnpublished = false; //Default to showing unpublished
  if (props.hideUnpublished){ hideUnpublished = props.hideUnpublished}
  const driveInfo = useRecoilValueLoadable(loadDriveInfoQuery(props.driveId))
  const setDriveInstanceId = useSetRecoilState(driveInstanceIdDictionary(props.driveId))
  let driveInstanceId = useRef("");
  const path = Object.fromEntries(new URLSearchParams(props.route.location.search))?.path;
  useUpdateBreadcrumb({driveId: props.driveId, driveLabel: props.driveObj.label, path: path}); 

  if (driveInfo.state === "loading"){ return null;}
  if (driveInfo.state === "hasError"){ 
    console.error(driveInfo.contents)
    return null;}

  if (driveInstanceId.current === ""){ 
    driveInstanceId.current = nanoid();
    setDriveInstanceId((old)=>{let newArr = [...old]; newArr.push(driveInstanceId.current); return newArr;});
  }

  //Use Route to determine path variables
  let pathFolderId = props.driveId; //default 
  let pathDriveId = props.driveId; //default
  let routePathDriveId = "";
  let routePathFolderId = "";  
  let pathItemId = "";  
  let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
  //use defaults if not defined
  if (urlParamsObj?.path !== undefined){
    [routePathDriveId,routePathFolderId,pathItemId] = urlParamsObj.path.split(":");
    if (routePathDriveId !== ""){ pathDriveId = routePathDriveId}
    if (routePathFolderId !== ""){pathFolderId = routePathFolderId;}
  }
  //If navigation then build from root else build from path
  let rootFolderId = pathFolderId;
  if(props.isNav){
    rootFolderId = props.driveId;
  }
  
  if (!props.isNav && (routePathDriveId === "" || props.driveId !== routePathDriveId)) return <></>;

  let heading = null;
  if (!props.isNav){
    heading = <DriveHeader driveInstanceId={props.driveInstanceId} setNumColumns={setNumColumns}/>
  }
   
  


  return <>

   {heading}
  
  {/* <CustomComponent /> */}
  <Folder 
  driveId={props.driveId} 
  folderId={rootFolderId} 
  indentLevel={0}  
  driveObj={props.driveObj} 
  rootCollapsible={props.rootCollapsible}
  driveInstanceId={driveInstanceId.current}
  isNav={props.isNav}
  urlClickBehavior={props.urlClickBehavior}
  route={props.route}
  pathItemId={pathItemId}
  hideUnpublished={hideUnpublished}
  foldersOnly={props.foldersOnly}
  doenetMLDoubleClickCallback={props.doenetMLDoubleClickCallback}
  numColumns={numColumns}
  />

 
  </>
}

export const fetchDrivesQuery = atom({
  key:"fetchDrivesQuery",
  default: selector({
    key:"fetchDrivesQuery/Default",
    get: async ()=>{
    const { data } = await axios.get(
      `/api/loadAvailableDrives.php`
    );
    // console.log(">>>data",data)
    return data
  },
 
  })
})

export const fetchDrivesSelector = selector({
  key:"fetchDrivesSelector",
  get:({get})=>{
    return get(fetchDrivesQuery);
  },
  set:({get,set},labelTypeDriveIdColorImage)=>{
    let driveData = get(fetchDrivesQuery)
    // let selectedDrives = get(selectedDriveInformation);
    let newDriveData = {...driveData};
    newDriveData.driveIdsAndLabels = [...driveData.driveIdsAndLabels];
    let params = {
      driveId:labelTypeDriveIdColorImage.newDriveId,
      label:labelTypeDriveIdColorImage.label,
      type:labelTypeDriveIdColorImage.type,
      image:labelTypeDriveIdColorImage.image,
      color:labelTypeDriveIdColorImage.color,
    }
    let newDrive;
    function duplicateFolder({sourceFolderId,sourceDriveId,destDriveId,destFolderId,destParentFolderId}){
      let contentObjs = {};
      const sourceFolder = get(folderDictionary({driveId:sourceDriveId,folderId:sourceFolderId}));
      if (destFolderId === undefined){
        destFolderId = destDriveId;  //Root Folder of drive
        destParentFolderId = destDriveId;  //Root Folder of drive
      }

      let contentIds = {defaultOrder:[]};
      let contentsDictionary = {}
      let folderInfo = {...sourceFolder.folderInfo}
      folderInfo.folderId = destFolderId;
      folderInfo.parentFolderId = destParentFolderId;

      for (let sourceItemId of sourceFolder.contentIds.defaultOrder){
        const destItemId = nanoid();
        contentIds.defaultOrder.push(destItemId);
        let sourceItem = sourceFolder.contentsDictionary[sourceItemId]
        contentsDictionary[destItemId] = {...sourceItem}
        contentsDictionary[destItemId].parentFolderId = destFolderId;
        contentsDictionary[destItemId].itemId = destItemId;
        if (sourceItem.itemType === 'Folder'){
         let childContentObjs = duplicateFolder({sourceFolderId:sourceItemId,sourceDriveId,destDriveId,destFolderId:destItemId,destParentFolderId:destFolderId})
          contentObjs = {...contentObjs,...childContentObjs};
        }else if (sourceItem.itemType === 'DoenetML'){
          let destBranchId = nanoid();
          contentsDictionary[destItemId].sourceBranchId = sourceItem.branchId;
          contentsDictionary[destItemId].branchId = destBranchId;
        }else if (sourceItem.itemType === 'URL'){
          let desturlId = nanoid();
          contentsDictionary[destItemId].urlId = desturlId;
        }else{
          console.log(`!!! Unsupported type ${sourceItem.itemType}`)
        }
        contentObjs[destItemId] = contentsDictionary[destItemId];
      }
      const destFolderObj = {contentIds,contentsDictionary,folderInfo}
      // console.log({destFolderObj})
      set(folderDictionary({driveId:destDriveId,folderId:destFolderId}),destFolderObj)
      return contentObjs;
    }
    if (labelTypeDriveIdColorImage.type === "new content drive"){
      newDrive = {
        courseId:null,
        driveId:labelTypeDriveIdColorImage.newDriveId,
        isShared:"0",
        label:labelTypeDriveIdColorImage.label,
        type: "content"
      }
      newDriveData.driveIdsAndLabels.unshift(newDrive)
    set(fetchDrivesQuery,newDriveData)

    const payload = { params }
    axios.get("/api/addDrive.php", payload)
  // .then((resp)=>console.log(">>>resp",resp.data))
    }else if (labelTypeDriveIdColorImage.type === "new course drive"){
      newDrive = {
        courseId:null,
        driveId:labelTypeDriveIdColorImage.newDriveId,
        isShared:"0",
        label:labelTypeDriveIdColorImage.label,
        type: "course",
        image:labelTypeDriveIdColorImage.image,
        color:labelTypeDriveIdColorImage.color,
        subType:"Administrator"
      }
      newDriveData.driveIdsAndLabels.unshift(newDrive)
    set(fetchDrivesQuery,newDriveData)

    const payload = { params }
    axios.get("/api/addDrive.php", payload)
  // .then((resp)=>console.log(">>>resp",resp.data))
    
    }else if (labelTypeDriveIdColorImage.type === "update drive label"){
      //Find matching drive and update label
      for (let [i,drive] of newDriveData.driveIdsAndLabels.entries()){
        if (drive.driveId === labelTypeDriveIdColorImage.newDriveId ){
          let newDrive = {...drive};
          newDrive.label = labelTypeDriveIdColorImage.label
          newDriveData.driveIdsAndLabels[i] = newDrive;
          break;
        }
      }
      //Set drive
    set(fetchDrivesQuery,newDriveData)
      //Save to db
      const payload = { params }
      axios.get("/api/updateDrive.php", payload)
    // .then((resp)=>console.log(">>>updateDrive resp",resp.data))
    }else if (labelTypeDriveIdColorImage.type === "update drive color"){
    //TODO: implement      

    }else if (labelTypeDriveIdColorImage.type === "delete drive"){
      // set(fetchDrivesQuery,newDriveData)
      //Find matching drive and update label
      for (let [i,drive] of newDriveData.driveIdsAndLabels.entries()){
        if (drive.driveId === labelTypeDriveIdColorImage.newDriveId ){
          newDriveData.driveIdsAndLabels.splice(i,1);
          break;
        }
      }
      //Set drive
      set(fetchDrivesQuery,newDriveData)
        //Save to db
        const payload = { params }
        axios.get("/api/updateDrive.php", payload)
      // .then((resp)=>console.log(">>>updateDrive resp",resp.data))
    }
  //   else if (labelTypeDriveIdColorImage.type === "make course drive from content drive"){
  //     const sourceDriveId = labelTypeDriveIdColorImage.driveId;
  //     params['sourceDriveId'] = sourceDriveId;
  //     //TODO: duplicate items from driveId
  //     let contentObjs = duplicateFolder({sourceFolderId:sourceDriveId,sourceDriveId,destDriveId:labelTypeDriveIdColorImage.newDriveId});
  //     // console.log({contentObjs}) //Save these in addBulkItems.php post
  //     axios.post('/api/addBulkItems.php',{driveId:labelTypeDriveIdColorImage.newDriveId,content:contentObjs})
  //     // .then(resp=>{console.log(resp.data)})
  //     newDrive = {
  //       courseId:null,
  //       driveId:labelTypeDriveIdColorImage.newDriveId,
  //       isShared:"0",
  //       label:labelTypeDriveIdColorImage.label,
  //       type: "course"
  //     }
  //     newDriveData.driveIdsAndLabels.unshift(newDrive)
  //   set(fetchDrivesQuery,newDriveData)
  //   const payload = { params }
  //   axios.get("/api/addDrive.php", payload)
  // // .then((resp)=>console.log(">>>resp",resp.data))
  //   }
    // else if (labelTypeDriveIdColorImage.type === "duplicate content drive"){
    //     //TODO: duplicate items from driveId
    //     const sourceDriveId = labelTypeDriveIdColorImage.driveId;
    //     params['sourceDriveId'] = sourceDriveId;
    //     newDrive = {
    //       courseId:null,
    //       driveId,
    //       isShared:"0",
    //       label:labelTypeDriveIdColorImage.label,
    //       type: "content"
    //     }
    // }else if (labelTypeDriveIdColorImage.type === "duplicate course drive"){
    //     //TODO: duplicate items from driveId
    //     const sourceDriveId = labelTypeDriveIdColorImage.driveId;
    //     params['sourceDriveId'] = sourceDriveId;
    //     newDrive = {
    //       courseId:null,
    //       driveId,
    //       isShared:"0",
    //       label:labelTypeDriveIdColorImage.label,
    //       type: "course"
    //     }
    // }else if (labelTypeDriveIdColorImage.type === "make content drive from course drive"){
    //   //TODO: duplicate items from driveId
    //     const sourceDriveId = labelTypeDriveIdColorImage.driveId;
    //     params['sourceDriveId'] = sourceDriveId;
    //   newDrive = {
    //     courseId:null,
    //     driveId,
    //     isShared:"0",
    //     label:labelTypeDriveIdColorImage.label,
    //     type: "content"
    //   }
    // }
    
    
  }
})

const folderOpenAtom = atomFamily({
  key:"folderOpenAtom",
  default:false
})

const folderOpenSelector = selectorFamily({
  key:"folderOpenSelector",
  get:(driveInstanceIdItemId)=>({get})=>{
    return get(folderOpenAtom(driveInstanceIdItemId));
  },
  set:(driveInstanceIdDriveIdItemId) => ({get,set})=>{
    const isOpen = get(folderOpenAtom(driveInstanceIdDriveIdItemId))
    if (isOpen){ 
      //Deselect contained items on close
      const folder = get(folderDictionarySelector({driveId:driveInstanceIdDriveIdItemId.driveId,folderId:driveInstanceIdDriveIdItemId.itemId}));
      const itemIds = folder.contentIds.defaultOrder;
      const globalItemsSelected = get(globalSelectedNodesAtom);
      let newGlobalSelected = [];
      for (let itemObj of globalItemsSelected){
        if (itemIds.includes(itemObj.itemId)){
        const {parentFolderId,...atomFormat} = itemObj;  //Without parentFolder
        set(selectedDriveItemsAtom(atomFormat),false)
        }else{
          newGlobalSelected.push(itemObj);
        }
      }
      set(globalSelectedNodesAtom,newGlobalSelected);
    }
    set(folderOpenAtom(driveInstanceIdDriveIdItemId),!isOpen); 
  }
})

export let encodeParams = p => 
Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&");

function Folder(props){

  let itemId = props?.folderId;
  if (!itemId){ itemId = props.driveId}
  let history = useHistory();
  
  const [folderInfoObj, setFolderInfo] = useRecoilStateLoadable(folderInfoSelector({driveId:props.driveId,instanceId:props.driveInstanceId, folderId:props.folderId}))
  // const [folderInfoObj, setFolderInfo] = useRecoilStateLoadable(folderDictionarySelector({driveId:props.driveId,folderId:props.folderId}))
  const {folderInfo, contentsDictionary, contentIdsArr} = folderInfoObj.contents;
  const { onDragStart, onDrag, onDragOverContainer, onDragEnd, renderDragGhost, registerDropTarget, unregisterDropTarget } = useDnDCallbacks();
  const { dropState } = useContext(DropTargetsContext);
  const [dragState, setDragState] = useRecoilState(dragStateAtom);
  const [folderCacheDirty, setFolderCacheDirty] = useRecoilState(folderCacheDirtyAtom({driveId:props.driveId, folderId:props.folderId}))

  const parentFolderSortOrder = useRecoilValue(folderSortOrderAtom({driveId:props.driveId,instanceId:props.driveInstanceId, folderId:props.item?.parentFolderId}))
  const parentFolderSortOrderRef = useRef(parentFolderSortOrder);  // for memoized DnD callbacks
  const [selectedDrive, setSelectedDrive] = useRecoilState(selectedDriveAtom); 
  const setSelected = useSetRecoilState(selectedDriveItems({driveId:props.driveId,driveInstanceId:props.driveInstanceId,itemId})); 
  const isSelected = useRecoilValue(selectedDriveItemsAtom({driveId:props.driveId,driveInstanceId:props.driveInstanceId,itemId})); 
  const deleteItem = (itemId) =>{setFolderInfo({instructionType: folderInfoSelectorActions.DELETE_ITEM,driveInstanceId:props.driveInstanceId,itemId})}
  const globalSelectedNodes = useRecoilValue(globalSelectedNodesAtom); 
  const clearSelections = useSetRecoilState(clearDriveAndItemSelections);

  //Used to determine range of items in Shift Click
  const isOpen = useRecoilValue(folderOpenAtom({driveInstanceId:props.driveInstanceId,driveId:props.driveId,itemId:props.folderId}))
  const toggleOpen = useSetRecoilState(folderOpenSelector({driveInstanceId:props.driveInstanceId,driveId:props.driveId,itemId:props.folderId}))
  const isOpenRef = useRef(isOpen);  // for memoized DnD callbacks
  const isSelectedRef = useRef(isSelected);  // for memoized DnD callbacks

  //Set only when parentFolderId changes
  const setInstanceParentId = useSetRecoilState(driveInstanceParentFolderIdAtom(props.driveInstanceId));
  useEffect(() => {
    setInstanceParentId(props.pathItemId);
  },[props.pathItemId])


  const indentPx = 20;
  let bgcolor = "#f6f8ff";
  let borderSide = "0px";
  let marginSize = "0";
  let widthSize = "60vw";
  if (props.isNav) {marginSize = "0px"; widthSize = "224px"};
  if (isSelected) { bgcolor = "hsl(209,54%,82%)";  }
  if (dropState.activeDropTargetId === itemId) { bgcolor = "hsl(209,54%,82%)"; }
  if (isSelected && dragState.isDragging) { bgcolor = "#e2e2e2"; }  

  /* Update refs for variables used in DnD callbacks to eliminate re-registration */
  useEffect(() => {
    isOpenRef.current = isOpen;
    isSelectedRef.current = isSelected;
  }, [isOpen, isSelected])

  useEffect(() => {
    parentFolderSortOrderRef.current = parentFolderSortOrder;
  }, [parentFolderSortOrder])

  /* Cache invalidation when folder is dirty */
  useEffect(() => {
    if (folderCacheDirty) {
      setFolderInfo({ instructionType: folderInfoSelectorActions.INVALIDATE_SORT_CACHE});
      setFolderCacheDirty(false);
    }    
  }, [folderCacheDirty])

  if (props.isNav && itemId === props.pathItemId) {borderSide = "8px solid #1A5A99";}
 
  if (folderInfoObj.state === "loading"){ return null;}
 
  let openCloseText = isOpen ? <FontAwesomeIcon icon={faChevronDown}/> : <FontAwesomeIcon icon={faChevronRight}/>;

  let openCloseButton = <button 
  style={{border: "none", backgroundColor: bgcolor, borderRadius: "5px"}}
  data-doenet-driveinstanceid={props.driveInstanceId}
  onClick={(e)=>{
    e.preventDefault();
    e.stopPropagation();
    toggleOpen();
  }}>{openCloseText}</button>

  const sortHandler = ({ sortKey }) => {
    // dispatch sort instruction
    setFolderInfo({
      instructionType: folderInfoSelectorActions.SORT,
      sortKey: sortKey
    });
  };

  const markFolderDraggedOpened = useCallback(() => {
    setDragState((old) => {
      let newOpenedFoldersInfo = [...old.openedFoldersInfo];
      newOpenedFoldersInfo.push({driveInstanceId:props.driveInstanceId,driveId:props.driveId,itemId:props.folderId});
      return {
        ...old,
        openedFoldersInfo: newOpenedFoldersInfo
      }
    })
  }, [props.driveInstanceId, props.driveId, props.folderId]);

  const onDragOver = ({x, y, dropTargetRef}) => {
    onDragOverContainer({ id: props.folderId, driveId: props.driveId });

    if (props.isNav) {
      setFolderInfo({instructionType: folderInfoSelectorActions.REMOVE_DRAG_SHADOW});
      setFolderInfo({
        instructionType: folderInfoSelectorActions.INSERT_DRAG_SHADOW,
        parentId: props.folderId,
        position: "intoCurrent"
      });
      return;
    }

    const dropTargetTopY = dropTargetRef?.offsetTop;
    const dropTargetHeight = dropTargetRef?.clientHeight;
    const cursorY = y;
    const cursorArea = (cursorY - dropTargetTopY) / dropTargetHeight;
    
    // Open folder if initially closed
    if (!isOpenRef.current && !isSelectedRef.current) {
      toggleOpen();
      // Mark current folder to close on dragEnd
      markFolderDraggedOpened();
    }
    
    if (parentFolderSortOrderRef.current === sortOptions.DEFAULT) {
      if (cursorArea < 0.5) {
        // insert shadow to top of current dropTarget
        setFolderInfo({
          instructionType: folderInfoSelectorActions.INSERT_DRAG_SHADOW,
          position: "beforeCurrent",
          itemId: props.folderId,
          parentId: props.item?.parentFolderId
        });
      }else if (cursorArea < 1.0000) {
        // insert shadow to bottom of current dropTarget
        setFolderInfo({
          instructionType: folderInfoSelectorActions.INSERT_DRAG_SHADOW,
          position: "afterCurrent",
          itemId: props.folderId,
          parentId: props.item?.parentFolderId
        });
      }
    } else {
      setFolderInfo({instructionType: folderInfoSelectorActions.REMOVE_DRAG_SHADOW});
    }
  }

  const onDragHover = () => {
    if (props.isNav) return;

    setFolderInfo({
      instructionType: folderInfoSelectorActions.INSERT_DRAG_SHADOW,
      parentId: props.folderId,
      position: "intoCurrent"
    });
  }

  const onDrop = () => {
  }

  const onDragEndCb = () => {
    setFolderInfo({instructionType: folderInfoSelectorActions.CLEAN_UP_DRAG});
    setFolderInfo({instructionType: folderInfoSelectorActions.REPLACE_DRAG_SHADOW});
    setFolderInfo({instructionType: folderInfoSelectorActions.REMOVE_DRAG_SHADOW});
    onDragEnd();
  }

  const sortNodeButtonFactory = ({ buttonLabel, sortKey, sortHandler }) => {
    return <button
    style={{backgroundColor: "#1A5A99",color: "white", border: "none", borderRadius: "12px", height: "24px", margin: "2px"}}
    tabIndex={-1}
    onClick={(e)=>{
      e.preventDefault();
      e.stopPropagation();
      sortHandler({sortKey: sortKey});
    }}
    onMouseDown={e=>{ e.preventDefault(); e.stopPropagation(); }}
    onDoubleClick={e=>{ e.preventDefault(); e.stopPropagation(); }}
    >{ buttonLabel }</button>;
  }

  let label = folderInfo?.label;

  let folder = null;
  let items = null;

  if (!props.driveObj){


  folder = <div
      data-doenet-driveinstanceid={props.driveInstanceId}
      tabIndex={0}
      className="noselect nooutline" 
      style={{
        cursor: "pointer",
        // width: "300px",
        padding: "8px",
        border: "0px",
        borderBottom: "2px solid black", 
        backgroundColor: bgcolor,
        // width: widthSize,
        // boxShadow: borderSide,
        marginLeft: marginSize,
        borderLeft: borderSide
      }}
      onClick={(e)=>{
        e.preventDefault(); // Folder
        e.stopPropagation();
        if (props.isNav){
          clearSelections();
          //Only select one item
          let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));

          let newParams = {...urlParamsObj} 
          newParams['path'] = `${props.driveId}:${itemId}:${itemId}:Folder`
          history.push('?'+encodeParams(newParams))
        }else{
          e.preventDefault();
          e.stopPropagation();
          if (!e.shiftKey && !e.metaKey){
            setSelected({instructionType:"one item",parentFolderId:props.parentFolderId})
          }else if (e.shiftKey && !e.metaKey){
            setSelected({instructionType:"range to item",parentFolderId:props.parentFolderId})
          }else if (!e.shiftKey && e.metaKey){
            setSelected({instructionType:"add item",parentFolderId:props.parentFolderId})
          }
        }
        setSelectedDrive(props.driveId);
        }}
        onDoubleClick={(e)=>{
          e.preventDefault();
          e.stopPropagation();
          toggleOpen();
        }}
        onBlur={(e) => {
          //Don't clear on navigation changes
          if (!props.isNav){
          //Only clear if focus goes outside of this node group
            // if (e.relatedTarget === null ||
            //   (e.relatedTarget.dataset.doenetDriveinstanceid !== props.driveInstanceId &&
            //   !e.relatedTarget.dataset.doenetDriveStayselected)
            //   ){
            //     setSelected({instructionType:"clear all"})
            // }
            // if (e?.relatedTarget?.dataset?.doenetDeselectDrive){
            //   setSelected({instructionType:"clear all"});
            // }
          }
        }}
      >
        <div 
      className="noselect" 
      style={{
        marginLeft: `${props.indentLevel * indentPx}px`,
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr',
        alignContent: 'center'
      }}><div style={{display: 'inline', margin:'0px'}}>{openCloseButton} <FontAwesomeIcon icon={faFolder}/> {label}</div> </div></div>
    
    
    } else if (props.driveObj && props.isNav){

    let driveIcon = <FontAwesomeIcon icon={faBookOpen}/>;
    if (props.driveObj?.type === "course"){
      driveIcon = <FontAwesomeIcon icon={faChalkboard}/>;
    }
    //Root of Drive and in navPanel
    label = props.driveObj.label;
    folder = <>
    <div
      data-doenet-driveinstanceid={props.driveInstanceId}
      tabIndex={0}
      className="noselect nooutline" 
      style={{
        cursor: "pointer",
        padding: "12.5px",
        border: "0px",
        borderBottom: "2px solid black",
        backgroundColor: bgcolor,
        // width: widthSize,
        // marginLeft: `${(props.indentLevel * indentPx)}px`,
        marginLeft: marginSize,
        fontSize: "24px",
        borderLeft: borderSide
      }}
      onClick={(e)=>{
        e.preventDefault();
        e.stopPropagation();
        if (props.isNav){
          clearSelections();
          //Only select one item
          let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
          let newParams = {...urlParamsObj} 
          newParams['path'] = `${props.driveId}:${itemId}:${itemId}:Drive`
          history.push('?'+encodeParams(newParams))
        }
        setSelectedDrive(props.driveId);
      }
    }
    >{driveIcon} {label}</div></>
    if (props.rootCollapsible){
      folder = <div
        data-doenet-driveinstanceid={props.driveInstanceId}
        tabIndex={0}
        className="noselect nooutline" 
        style={{
          cursor: "pointer",
          padding: "12.5px",
          border: "0px",
          borderBottom: "2px solid black",
          backgroundColor: bgcolor,
          // width: widthSize,
          // marginLeft: `${(props.indentLevel * indentPx)}px`,
          marginLeft: marginSize,
          fontSize: "24px",
          borderLeft: borderSide
        }}
      > {openCloseButton} Drive {label}</div>
    }
  }

  // make folder draggable and droppable
  let draggableClassName = "";
  if (!props.isNav) {
    const onDragStartCallback = () => {
      if (globalSelectedNodes.length === 0 || !isSelected) {
        setSelected({instructionType:"clear all"});
        setSelected({instructionType:"one item", parentFolderId: props.parentFolderId});
      } 
    }
    folder = <Draggable
      key={`dnode${props.driveInstanceId}${props.folderId}`} 
      id={props.folderId}
      className={draggableClassName}
      onDragStart={() => onDragStart({ nodeId: props.folderId, driveId: props.driveId, onDragStartCallback })}
      onDrag={onDrag}
      onDragEnd={onDragEndCb}
      ghostElement={renderDragGhost(props.folderId, folder)}
      >
      { folder } 
    </Draggable>;
  }

  const dropTargetId = props.driveObj ? props.driveId : props.folderId;
  folder = <WithDropTarget
    key={`wdtnode${props.driveInstanceId}${props.folderId}`} 
    id={dropTargetId}
    registerDropTarget={registerDropTarget} 
    unregisterDropTarget={unregisterDropTarget}
    dropCallbacks={{
      onDragOver: onDragOver,
      onDragHover: onDragHover,
      onDrop: onDrop
    }}
    >
    { folder } 
  </WithDropTarget>

  // if (props.driveObj && !props.isNav) {
  //   const sortButtons = <div style={{marginLeft: "2.5vw"}}>
  //     {sortNodeButtonFactory({buttonLabel: "Sort Custom", sortKey: sortOptions.DEFAULT, sortHandler})} 
  //     {sortNodeButtonFactory({buttonLabel: "Sort Label ASC", sortKey: sortOptions.LABEL_ASC, sortHandler})} 
  //     {sortNodeButtonFactory({buttonLabel: "Sort Label DESC", sortKey: sortOptions.LABEL_DESC, sortHandler})} 
  //     {sortNodeButtonFactory({buttonLabel: "Sort Date ASC", sortKey: sortOptions.CREATION_DATE_ASC, sortHandler})} 
  //     {sortNodeButtonFactory({buttonLabel: "Sort Date DESC", sortKey: sortOptions.CREATION_DATE_DESC, sortHandler})}
  //   </div>;

  //   folder = <>
  //     {sortButtons}
  //     {folder}
      
  //   </>;
  // }

  if (isOpen || (props.driveObj && !props.rootCollapsible)){
    let dictionary = contentsDictionary;
    items = [];
    for (let itemId of contentIdsArr){
      let item = dictionary[itemId];
      if (!item) continue;
      // console.log(">>>item",item)
      if (props.hideUnpublished && item.isPublished === "0"){
        //hide item
        if(item.assignment_isPublished != '1')
          continue;
        // TODO : update
      }
      if (props.foldersOnly){
        if (item.itemType === "Folder"){
          items.push(<Folder 
            key={`item${itemId}${props.driveInstanceId}`} 
            driveId={props.driveId} 
            folderId={itemId} 
            item={item} 
            indentLevel={props.indentLevel+1}  
            driveInstanceId={props.driveInstanceId}
            route={props.route}
            isNav={props.isNav}
            urlClickBehavior={props.urlClickBehavior}
            pathItemId={props.pathItemId}
            deleteItem={deleteItem}
            parentFolderId={props.folderId}
            hideUnpublished={props.hideUnpublished}
            foldersOnly={props.foldersOnly}
            />)
        }
      }else{
        switch(item.itemType){
          case "Folder":
          items.push(<Folder 
            key={`item${itemId}${props.driveInstanceId}`} 
            driveId={props.driveId} 
            folderId={item.itemId} 
            item={item} 
            indentLevel={props.indentLevel+1}  
            driveInstanceId={props.driveInstanceId}
            route={props.route}
            isNav={props.isNav}
            urlClickBehavior={props.urlClickBehavior}
            pathItemId={props.pathItemId}
            deleteItem={deleteItem}
            parentFolderId={props.folderId}
            hideUnpublished={props.hideUnpublished}
            foldersOnly={props.foldersOnly}
            doenetMLDoubleClickCallback={props.doenetMLDoubleClickCallback}
            numColumns={props.numColumns}
            />)
          break;
          case "Url":
            items.push(<Url 
              key={`item${itemId}${props.driveInstanceId}`} 
              driveId={props.driveId} 
              item={item} 
              indentLevel={props.indentLevel+1}
              driveInstanceId={props.driveInstanceId}
              route={props.route}
              isNav={props.isNav} 
              urlClickBehavior={props.urlClickBehavior}
              pathItemId={props.pathItemId}
              deleteItem={deleteItem}
              numColumns={props.numColumns}
            />)
          break;
          case "DoenetML":
            items.push(<DoenetML 
              key={`item${itemId}${props.driveInstanceId}`} 
              driveId={props.driveId} 
              item={item} 
              indentLevel={props.indentLevel+1}  
              driveInstanceId={props.driveInstanceId}
              route={props.route}
              isNav={props.isNav} 
              pathItemId={props.pathItemId}
              doubleClickCallback={props.doenetMLDoubleClickCallback}
              deleteItem={deleteItem}
              numColumns={props.numColumns}
            />)
          break;
          case "DragShadow":
            items.push(<DragShadow 
              key={`dragShadow${itemId}${props.driveInstanceId}`} 
              indentLevel={props.indentLevel+1}
            />)
          break;
          default:
          console.warn(`Item not rendered of type ${item.itemType}`)
        }
      }
      
 
    }

    if (contentIdsArr.length === 0 && !props.foldersOnly){
      items.push(<EmptyNode key={`emptyitem${folderInfo?.itemId}`}/>)
    }
  }

  return <>
  {folder}
  {items}
  </>
}

const EmptyNode =  React.memo(function Node(props){

  return (<div style={{
    // width: "840px",
    padding: "8px",
    backgroundColor: "#f6f8ff",
    marginLeft: '47.5%',
  
  }} ><div className="noselect" style={{justifyContent: "center"}}>EMPTY</div></div>)
})

const DragShadow =  React.memo(function Node(props){
  const indentPx = 20;
  return (<div style={{
    // width: "840px",
    padding: "8px",
    backgroundColor: "#8dff45",
    margin: "2px",
    marginLeft: `${props.indentLevel * indentPx}px`,
  
  }} ><div className="noselect" style={{marginLeft: "50px"}}>Drag shadow</div></div>)
})

function LogVisible(props){
  const globalSelected = useRecoilValue(globalSelectedNodesAtom);
  console.log("globalSelected",globalSelected)
  return null;
}

const selectedDriveItemsAtom = atomFamily({
  key:"selectedDriveItemsAtom",
  default:false
})

export const clearDriveAndItemSelections = selector({
  key:"clearDriveAndItemSelections",
  set:({get,set})=>{
    const globalItemsSelected = get(globalSelectedNodesAtom);
    for (let itemObj of globalItemsSelected){
      const {parentFolderId,...atomFormat} = itemObj;  //Without parentFolder
      set(selectedDriveItemsAtom(atomFormat),false)
    }
    if (globalItemsSelected.length > 0){
      set(globalSelectedNodesAtom,[]);
    }
    const globalDrivesSelected = get(drivecardSelectedNodesAtom);
    if (globalDrivesSelected.length > 0){
      set(drivecardSelectedNodesAtom,[]);
    }
  }
})

//key: driveInstanceId
const driveInstanceParentFolderIdAtom = atomFamily({
  key:"driveInstanceParentFolderIdAtom",
  default: selectorFamily({
    key:"driveInstanceParentFolderIdAtom/Default",
    get: (driveInstanceId) => ()=>{
    return driveInstanceId
  }
  })
})

const selectedDriveItems = selectorFamily({
  key:"selectedDriveItems",
  // get:(driveIdDriveInstanceIdItemId) =>({get})=>{ 
  //   return get(selectedDriveItemsAtom(driveIdDriveInstanceIdItemId));
  // },
  set:(driveIdDriveInstanceIdItemId) => ({get,set},instruction)=>{
    const globalSelected = get(globalSelectedNodesAtom);
    const isSelected = get(selectedDriveItemsAtom(driveIdDriveInstanceIdItemId))
    const {driveId,driveInstanceId,itemId} = driveIdDriveInstanceIdItemId;
    let lastSelectedItem = globalSelected[globalSelected.length-1];

    function buildItemIdsAndParentIds({parentFolderId,driveInstanceId,driveId,itemIdArr=[],parentFolderIdArr=[]}){
      const folderObj = get(folderDictionary({driveId,folderId:parentFolderId}))
      for (let itemId of folderObj.contentIds.defaultOrder){
        itemIdArr.push(itemId);
        parentFolderIdArr.push(parentFolderId);
        if (folderObj.contentsDictionary[itemId].itemType === 'Folder'){
          const isOpen = get(folderOpenAtom({driveInstanceId,driveId,itemId}));
          if (isOpen){
            const [folderItemIdArr,folderParentFolderIdsArr] = buildItemIdsAndParentIds({parentFolderId:itemId,driveInstanceId,driveId})
            itemIdArr = [...itemIdArr,...folderItemIdArr];
            parentFolderIdArr = [...parentFolderIdArr,...folderParentFolderIdsArr];
          }
        }
      }
      return [itemIdArr,parentFolderIdArr];
    }

    switch (instruction.instructionType) {
      case "one item":
        if (!isSelected){
          //Deselect all global selected
          for (let itemObj of globalSelected){
            let itemInfo = { ...itemObj };
            delete itemInfo["parentFolderId"];
            set(selectedDriveItemsAtom(itemInfo),false)
          }
          set(selectedDriveItemsAtom(driveIdDriveInstanceIdItemId),true)
          let itemInfo = {...driveIdDriveInstanceIdItemId}
          itemInfo["parentFolderId"] = instruction.parentFolderId;
          set(globalSelectedNodesAtom,[itemInfo])

          //Select contents of open folders??
          // const parentFolder = get(folderDictionary({driveId,folderId:instruction.parentFolderId}))
          // const itemType = parentFolder.contentsDictionary[itemId].itemType;
          // if (itemType === 'Folder'){
          //   let isOpen = get(folderOpenAtom(driveIdDriveInstanceIdItemId));
          //   console.log(">>>isOpen",isOpen)
          // }
        }
        break;
      case "add item":
        if (isSelected){
          set(selectedDriveItemsAtom(driveIdDriveInstanceIdItemId),false)
          let newGlobalSelected = [...globalSelected];
          let index;
          for (const [i,obj] of newGlobalSelected.entries()){
            if (obj.driveId === driveId &&
              obj.itemId === itemId &&
              obj.driveInstanceId === driveInstanceId
              ){
                index = i;
                break;
              }
          }
          newGlobalSelected.splice(index,1)
          set(globalSelectedNodesAtom,newGlobalSelected);
        }else{
          set(selectedDriveItemsAtom(driveIdDriveInstanceIdItemId),true)
          let itemInfo = {...driveIdDriveInstanceIdItemId}
          itemInfo["parentFolderId"] = instruction.parentFolderId;
          set(globalSelectedNodesAtom,[...globalSelected,itemInfo])
        }
        break;
      case "range to item":
        //select one if driveInstanceId doesn't match
        if (globalSelected.length === 0 || lastSelectedItem?.driveInstanceId !== driveInstanceId){
          //No previous items selected so just select this one
          set(selectedDriveItemsAtom(driveIdDriveInstanceIdItemId),true)
          let itemInfo = {...driveIdDriveInstanceIdItemId}
          itemInfo["parentFolderId"] = instruction.parentFolderId;
          set(globalSelectedNodesAtom,[itemInfo])
        }else{
          const driveInstanceParentFolderId = get(driveInstanceParentFolderIdAtom(driveInstanceId))
          let [arrayOfItemIds,parentFolderIds] = buildItemIdsAndParentIds({parentFolderId:driveInstanceParentFolderId,driveInstanceId,driveId})

          let foundClickedItem = false;
          let foundLastItem = false;
          let addToGlobalSelected = [];
          let needToReverseOrder = false;
          for (const [i,testItemId] of arrayOfItemIds.entries()){
            if (!foundLastItem && testItemId === lastSelectedItem.itemId){
              foundLastItem = true;
              if (foundClickedItem){needToReverseOrder = true;}
            }
            if (!foundClickedItem && testItemId === itemId){
              foundClickedItem = true;
            }
            if (foundClickedItem || foundLastItem){
              //in range
              // console.log(">>>in range",testItemId,parentFolderIds[i])
              const isSelected = get(selectedDriveItemsAtom({driveId,driveInstanceId,itemId:testItemId}));
              if (!isSelected){
                set(selectedDriveItemsAtom({driveId,driveInstanceId,itemId:testItemId}),true);//select item
                addToGlobalSelected.push({driveId,driveInstanceId,itemId:testItemId,parentFolderId:parentFolderIds[i]})
              }
              if (foundClickedItem && foundLastItem){
                break;
              }
            }
            
          }
          
          if (needToReverseOrder){
            addToGlobalSelected.reverse();
          }
          // console.log(">>>globalSelected",globalSelected)
          // console.log(">>>addToGlobalSelected",addToGlobalSelected)
          set(globalSelectedNodesAtom,[...globalSelected,...addToGlobalSelected])
        }
      break;
      case "clear all":
          for (let itemObj of globalSelected){
            const {parentFolderId,...atomFormat} = itemObj;  //Without parentFolder
            set(selectedDriveItemsAtom(atomFormat),false)
          }
          set(globalSelectedNodesAtom,[]);
        break;
      default:
        console.warn(`Can't handle instruction ${instruction}`)
        break;
    }
    
  }
})

const DoenetML = React.memo((props)=>{
  // console.log(`=== 📜 DoenetML`)

  const history = useHistory();
  const setSelected = useSetRecoilState(selectedDriveItems({driveId:props.driveId,driveInstanceId:props.driveInstanceId,itemId:props.item.itemId})); 
  const isSelected = useRecoilValue(selectedDriveItemsAtom({driveId:props.driveId,driveInstanceId:props.driveInstanceId,itemId:props.item.itemId})); 
  const [selectedDrive, setSelectedDrive] = useRecoilState(selectedDriveAtom); 
  const [dragState] = useRecoilState(dragStateAtom);
  const { onDragStart, onDrag, onDragEnd, renderDragGhost, registerDropTarget, unregisterDropTarget } = useDnDCallbacks();
  const globalSelectedNodes = useRecoilValue(globalSelectedNodesAtom); 
  const [folderInfoObj, setFolderInfo] = useRecoilStateLoadable(folderInfoSelector({driveId:props.driveId,instanceId:props.driveInstanceId, folderId:props.driveId}))
  const parentFolderSortOrder = useRecoilValue(folderSortOrderAtom({driveId:props.driveId,instanceId:props.driveInstanceId, folderId:props.item?.parentFolderId}))
  const parentFolderSortOrderRef = useRef(parentFolderSortOrder);  // for memoized DnD callbacks
  
  const indentPx = 20;

  let woIndent = 250 - props.indentLevel * indentPx;
  let columns = `${woIndent}px repeat(3,1fr)`;
  if (props.numColumns === 3){
    columns = `${woIndent}px 1fr 1fr`;
  }else if (props.numColumns === 2){
    columns = `${woIndent}px 1fr`;
  }else if (props.numColumns === 1){
    columns = '100%';
  }



  let bgcolor = "#f6f8ff";
  let borderSide = "0px 0px 0px 0px";
  let widthSize = "auto";
  let marginSize = "0";
  let date = props.item.creationDate.slice(0,10)
  let published = <FontAwesomeIcon icon={faUsersSlash}/>
  let assigned = '-'
  // let columns = 'repeat(4,25%)'
  if (props.isNav) {widthSize = "224px"; marginSize = "0px"; date = ''; published=''; assigned=''; columns='1fr'}
  if (isSelected || (props.isNav && props.item.itemId === props.pathItemId)) { bgcolor = "hsl(209,54%,82%)"; borderSide = "8px 0px 0px 0px #1A5A99";}
  if (isSelected && dragState.isDragging) { bgcolor = "#e2e2e2"; }  
  if (props.item.isPublished == 1 && !props.isNav) {published = <FontAwesomeIcon icon={faUsers}/>}
  if (props.item.isAssignment == 1 && !props.isNav) {assigned = <FontAwesomeIcon icon={faUserEdit}/>}

  let label = props.item?.label;
  if (props.item?.assignment_isPublished === "1" && props.item?.isAssignment === "1"){
    label = props.item?.assignment_title;
  }

  useEffect(() => {
    parentFolderSortOrderRef.current = parentFolderSortOrder;
  }, [parentFolderSortOrder])

  const onDragOver = ({x, y, dropTargetRef}) => {
    const dropTargetTopY = dropTargetRef?.offsetTop;
    const dropTargetHeight = dropTargetRef?.clientHeight;
    const cursorY = y;
    const cursorArea = (cursorY - dropTargetTopY) / dropTargetHeight;
    if (parentFolderSortOrderRef.current === sortOptions.DEFAULT) {
      if (cursorArea < 0.5) {
        // insert shadow to top of current dropTarget
        setFolderInfo({
          instructionType: folderInfoSelectorActions.INSERT_DRAG_SHADOW,
          position: "beforeCurrent",
          itemId: props.item.itemId,
          parentId: props.item.parentFolderId
        });
      }else if (cursorArea < 1.0000) {
        // insert shadow to bottom of current dropTarget
        setFolderInfo({
          instructionType: folderInfoSelectorActions.INSERT_DRAG_SHADOW,
          position: "afterCurrent",
          itemId: props.item.itemId,
          parentId: props.item.parentFolderId
        });
      }
    }
  }

  const onDragEndCb = () => {
    setFolderInfo({instructionType: folderInfoSelectorActions.CLEAN_UP_DRAG});
    setFolderInfo({instructionType: folderInfoSelectorActions.REPLACE_DRAG_SHADOW});
    setFolderInfo({instructionType: folderInfoSelectorActions.REMOVE_DRAG_SHADOW});
    onDragEnd();
  }

  let doenetMLJSX = <div
      data-doenet-driveinstanceid={props.driveInstanceId}
      tabIndex={0}
      className="noselect nooutline" 
      style={{
        cursor: "pointer",
        padding: "8px",
        border: "0px",
        borderBottom: "2px solid black",
        backgroundColor: bgcolor,
        width: widthSize,
        // boxShadow: borderSide,
        marginLeft: marginSize
      }}
      onDoubleClick={(e)=>{
        e.preventDefault();
        e.stopPropagation();
        if (props.doubleClickCallback){
          props.doubleClickCallback({
            driveId:props.driveId,
            item:props.item,
            driveInstanceId:props.driveInstanceId,
            route:props.route,
            isNav:props.isNav, 
            pathItemId:props.pathItemId,
          })
        }
      }}
      onClick={(e)=>{
        e.preventDefault();
        e.stopPropagation();
        if (props.isNav){
          //Only select one item
          let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
          let newParams = {...urlParamsObj} 
          newParams['path'] = `${props.driveId}:${props.item.parentFolderId}:${props.item.itemId}:DoenetML`
          history.push('?'+encodeParams(newParams))
        }else{
          e.preventDefault();
          e.stopPropagation();
          if (!e.shiftKey && !e.metaKey){
            setSelected({instructionType:"one item",parentFolderId:props.item.parentFolderId})
          }else if (e.shiftKey && !e.metaKey){
            setSelected({instructionType:"range to item",parentFolderId:props.item.parentFolderId})
          }else if (!e.shiftKey && e.metaKey){
            setSelected({instructionType:"add item",parentFolderId:props.item.parentFolderId})
          }
        }
        setSelectedDrive(props.driveId);
      }}
      onBlur={(e) => {
        //Don't clear on navigation changes
        if (!props.isNav){
        //Only clear if focus goes outside of this node group
          // if (e.relatedTarget === null ||
          //   (e.relatedTarget.dataset.doenetDriveinstanceid !== props.driveInstanceId &&
          //   !e.relatedTarget.dataset.doenetDriveStayselected)
          //   ){
          //     setSelected({instructionType:"clear all"})
          // }
          // if (e.relatedTarget === null){
          //   setSelected({instructionType:"clear all"})
          // }
          // console.log(">>>dataset",e?.relatedTarget?.dataset)
          // if (e?.relatedTarget?.dataset?.doenetDeselectDrive){
          //   setSelected({instructionType:"clear all"});
          // }
        }
      }}
      ><div 
      style={{
        marginLeft: `${props.indentLevel * indentPx}px`, 
        display: 'grid',
        gridTemplateColumns: columns,
        gridTemplateRows: '1fr',
        alignContent: 'center'
      }}>
      <p style={{display: 'inline', margin: '0px'}}><FontAwesomeIcon icon={faCode}/> {label} </p> 
      {props.numColumns >= 2 ? <span>{date}</span> : null }
      {props.numColumns >= 3 ? <span>{published}</span> : null }
      {props.numColumns >= 4 ? <span>{assigned}</span> : null }
      </div></div>

    if (!props.isNav) {
      const onDragStartCallback = () => {
        if (globalSelectedNodes.length === 0 || !isSelected) {
          setSelected({instructionType:"clear all"});
          setSelected({instructionType:"one item", parentFolderId: props.item.parentFolderId});
        } 
      }
      // make DoenetML draggable
      let draggableClassName = "";
      doenetMLJSX = <Draggable
        key={`dnode${props.driveInstanceId}${props.item.itemId}`} 
        id={props.item.itemId}
        className={draggableClassName}
        onDragStart={() => onDragStart({ nodeId: props.item.itemId, driveId: props.driveId, onDragStartCallback })}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        onDragEnd={onDragEndCb}
        ghostElement={renderDragGhost(props.item.itemId, doenetMLJSX)}
        >
        { doenetMLJSX } 
      </Draggable>


      // attach dropTarget to enable drag-reordering
      doenetMLJSX = <WithDropTarget
        key={`wdtnode${props.driveInstanceId}${props.item.itemId}`} 
        id={props.item.itemId}
        registerDropTarget={registerDropTarget} 
        unregisterDropTarget={unregisterDropTarget}
        dropCallbacks={{
          onDragOver: onDragOver,
        }}
        >
        { doenetMLJSX } 
      </WithDropTarget>;
    }
    return doenetMLJSX;
  })

const Url = React.memo((props)=>{
  const { onDragStart, onDrag, onDragEnd, renderDragGhost, registerDropTarget, unregisterDropTarget } = useDnDCallbacks();
  const [dragState] = useRecoilState(dragStateAtom);
  const [folderInfoObj, setFolderInfo] = useRecoilStateLoadable(folderInfoSelector({driveId:props.driveId,instanceId:props.driveInstanceId, folderId:props.driveId}))
  const parentFolderSortOrder = useRecoilValue(folderSortOrderAtom({driveId:props.driveId,instanceId:props.driveInstanceId, folderId:props.item?.parentFolderId}))
  const parentFolderSortOrderRef = useRef(parentFolderSortOrder);  // for memoized DnD callbacks

  const history = useHistory();
  const setSelected = useSetRecoilState(selectedDriveItems({driveId:props.driveId,driveInstanceId:props.driveInstanceId,itemId:props.item.itemId})); 
  const isSelected = useRecoilValue(selectedDriveItemsAtom({driveId:props.driveId,driveInstanceId:props.driveInstanceId,itemId:props.item.itemId})); 
  const globalSelectedNodes = useRecoilValue(globalSelectedNodesAtom); 
  const [selectedDrive, setSelectedDrive] = useRecoilState(selectedDriveAtom); 

  const indentPx = 20;
  let bgcolor = "#f6f8ff";
  let borderSide = "0px 0px 0px 0px";
  let widthSize = "60vw";
  let marginSize = "0";
  let date = props.item.creationDate.slice(0,10);
  let published = <FontAwesomeIcon icon={faUsersSlash}/>
  let assigned = '-'
  let columns = 'repeat(4,25%)'
  if (props.isNav) {widthSize = "224px"; marginSize = "0px"; date = ''; published=''; assigned=''; columns='1fr'};
  if (isSelected || (props.isNav && props.item.itemId === props.pathItemId)) {bgcolor = "hsl(209,54%,82%)"; borderSide = "8px 0px 0px 0px #1A5A99"}
  if (isSelected && dragState.isDragging) { bgcolor = "#e2e2e2"; }  
  if (props.item.isPublished == 1 && !props.isNav) {published = <FontAwesomeIcon icon={faUsers}/>}
  if (props.item.isAssignment == 1 && !props.isNav) {assigned = <FontAwesomeIcon icon={faUserEdit}/>}

  useEffect(() => {
    parentFolderSortOrderRef.current = parentFolderSortOrder;
  }, [parentFolderSortOrder])

  const onDragOver = ({x, y, dropTargetRef}) => {
    const dropTargetTopY = dropTargetRef?.offsetTop;
    const dropTargetHeight = dropTargetRef?.clientHeight;
    const cursorY = y;
    const cursorArea = (cursorY - dropTargetTopY) / dropTargetHeight;
    if (parentFolderSortOrderRef.current === sortOptions.DEFAULT) {
      if (cursorArea < 0.5) {
        // insert shadow to top of current dropTarget
        setFolderInfo({
          instructionType: folderInfoSelectorActions.INSERT_DRAG_SHADOW,
          position: "beforeCurrent",
          itemId: props.item.itemId,
          parentId: props.item.parentFolderId
        });
      }else if (cursorArea < 1.0000) {
        // insert shadow to bottom of current dropTarget
        setFolderInfo({
          instructionType: folderInfoSelectorActions.INSERT_DRAG_SHADOW,
          position: "afterCurrent",
          itemId: props.item.itemId,
          parentId: props.item.parentFolderId
        });
      }
    }
  }

  const onDragEndCb = () => {
    setFolderInfo({instructionType: folderInfoSelectorActions.REPLACE_DRAG_SHADOW});
    setFolderInfo({instructionType: folderInfoSelectorActions.REMOVE_DRAG_SHADOW});
    onDragEnd();
  }

  let urlJSX = <div
      data-doenet-driveinstanceid={props.driveInstanceId}
      tabIndex={0}
      className="noselect nooutline" 
      style={{
        cursor: "pointer",
        // width: "60vw",
        padding: "8px",
        border: "0px",
        borderBottom: "2px solid black",
        backgroundColor: bgcolor,
        width: widthSize,
        // boxShadow: borderSide,
        marginLeft: marginSize
      }}
      onClick={(e)=>{
        e.preventDefault();
        e.stopPropagation();
        if (props.urlClickBehavior === "select"){
          if (props.isNav){
            //Only select one item
            let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
            let newParams = {...urlParamsObj} 
            newParams['path'] = `${props.driveId}:${props.item.parentFolderId}:${props.item.itemId}:Url`
            history.push('?'+encodeParams(newParams))
          }else{
            e.preventDefault();
            e.stopPropagation();
            if (!e.shiftKey && !e.metaKey){
              setSelected({instructionType:"one item",parentFolderId:props.item.parentFolderId})
            }else if (e.shiftKey && !e.metaKey){
              setSelected({instructionType:"range to item",parentFolderId:props.item.parentFolderId})
            }else if (!e.shiftKey && e.metaKey){
              setSelected({instructionType:"add item",parentFolderId:props.item.parentFolderId})
            }
          }
          setSelectedDrive(props.driveId);
        }else{
          //Default url behavior is new tab
          let linkTo = props.item?.url; //Enable this when add URL is completed
          window.open(linkTo)
        }
      }}
      onBlur={(e) => {
        //Don't clear on navigation changes
        if (!props.isNav){
        //Only clear if focus goes outside of this node group
          // if (e.relatedTarget === null ||
          //   (e.relatedTarget.dataset.doenetDriveinstanceid !== props.driveInstanceId &&
          //   !e.relatedTarget.dataset.doenetDriveStayselected)
          //   ){
          //     setSelected({instructionType:"clear all"})
          // }
          // if (e.relatedTarget.dataset.doenetDriveStayselected){
          //   console.log(">>>GET FOCUS BACK!")
          // }
          // if (e?.relatedTarget?.dataset?.doenetDeselectDrive){
          //   setSelected({instructionType:"clear all"});
          // }
        }
      }}
      ><div 
      className="noselect" 
      style={{
        marginLeft: `${props.indentLevel * indentPx}px`,
        display: 'grid',
        gridTemplateColumns: columns,
        gridTemplateRows: '1fr',
        alignItems: 'center'
      }}>
    <div style={{display: 'inline', margin: '0px'}}><FontAwesomeIcon icon={faLink}/> {props.item?.label}</div> {date} {published} {assigned}</div></div>

  if (!props.isNav) {
    // make URL draggable
    const onDragStartCallback = () => {
      if (globalSelectedNodes.length === 0 || !isSelected) {
        setSelected({instructionType:"clear all"});
        setSelected({instructionType:"one item", parentFolderId: props.item.parentFolderId});
      } 
    }
    let draggableClassName = "";
    urlJSX = <Draggable
      key={`dnode${props.driveInstanceId}${props.item.itemId}`} 
      id={props.item.itemId}
      className={draggableClassName}
      onDragStart={() => onDragStart({ nodeId: props.item.itemId, driveId: props.driveId, onDragStartCallback })}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      onDragEnd={onDragEndCb}
      ghostElement={renderDragGhost(props.item.itemId, urlJSX)}
      >
      { urlJSX } 
    </Draggable>
  }

  // attach dropTarget to enable drag-reordering
  urlJSX = <WithDropTarget
    key={`wdtnode${props.driveInstanceId}${props.item.itemId}`} 
    id={props.item.itemId}
    registerDropTarget={registerDropTarget} 
    unregisterDropTarget={unregisterDropTarget}
    dropCallbacks={{
      onDragOver: onDragOver,
    }}
    >
    { urlJSX } 
  </WithDropTarget>

  return urlJSX;

  })

function useDnDCallbacks() {
  const { dropState, dropActions } = useContext(DropTargetsContext);
  const [dragState, setDragState] = useRecoilState(dragStateAtom);
  const globalSelectedNodes = useRecoilValue(globalSelectedNodesAtom); 

  const onDragStart = ({ nodeId, driveId, onDragStartCallback }) => {
    let draggedItemsId = new Set();
    if (globalSelectedNodes.length === 0) {
      draggedItemsId.add(nodeId);
    } else {
      const globalSelectedNodeIds = [];
      for (let globalSelectedNode of globalSelectedNodes) globalSelectedNodeIds.push(globalSelectedNode.itemId);

      draggedItemsId = new Set(globalSelectedNodeIds);
    }

    setDragState((dragState) => ({      
      ...dragState,
      isDragging: true,
      draggedOverDriveId: driveId,
      draggedItemsId,
      openedFoldersInfo: []
    }));
    onDragStartCallback?.();
  };

  const onDrag = ({ clientX, clientY, translation, id }) => {
    dropActions.handleDrag(clientX, clientY);
  };

  const onDragOverContainer = ({ id, driveId, isBreadcrumb=false }) => {
    // update driveId if changed
    if (dragState.draggedOverDriveId !== driveId) {
      setDragState((dragState) => ({
        ...dragState,
        draggedOverDriveId: driveId,
        isDraggedOverBreadcrumb: isBreadcrumb
      }));
    }
  };

  const onDragEnd = () => {
    setDragState((dragState) => ({
      ...dragState,
      isDragging: false,
      draggedOverDriveId: null,
      draggedItemsId: null,
      openedFoldersInfo: []
    }));
    dropActions.handleDrop();
  };

  function renderDragGhost(id, element) {
    const dragGhostId = `drag-ghost-${id}`;
    const numItems = useRecoilValue(globalSelectedNodesAtom).length;
    return <DragGhost id={dragGhostId} numItems={numItems} element={element} />;
  }

  return {
    onDragStart,
    onDrag,
    onDragOverContainer,
    onDragEnd,
    renderDragGhost,
    registerDropTarget: dropActions.registerDropTarget,
    unregisterDropTarget: dropActions.unregisterDropTarget
  }
}

const nodePathSelector = selectorFamily({
  key:"nodePathSelector",
  get: (driveIdFolderId) => ({get})=>{
    
    const { driveId, folderId } = driveIdFolderId;
    if (!driveId || !folderId) return []
    let path = []
    let currentNode = folderId;
    while (currentNode && currentNode !== driveId) {
      const folderInfoObj = get(folderDictionarySelector({ driveId, folderId: currentNode}));
      path.push({folderId: currentNode, label: folderInfoObj.folderInfo.label})
      currentNode = folderInfoObj.folderInfo.parentFolderId;
    }
    return path;
  }
})

const nodeChildrenSelector = selectorFamily({
  key:"nodePathSelector",
  get: (driveIdFolderId) => ({get})=>{
    
    const { driveId, folderId } = driveIdFolderId;
    if (!driveId || !folderId) return []
    let children = [];
    let queue = [folderId];
    
    while (queue.length) {
      let size = queue.length;
      for (let i = 0; i < size; i++) {
        let currentNodeId = queue.shift();
        const folderInfoObj = get(folderDictionarySelector({ driveId, folderId: currentNodeId}));
        children.push(currentNodeId);
        for (let childId of folderInfoObj?.contentIds?.[sortOptions.DEFAULT]) {
          queue.push(childId); 
        }
      }
    }
    return children;
  }
})

function useUpdateBreadcrumb(props) {
  const { addItem: addBreadcrumbItem , clearItems: clearBreadcrumb } = useContext(BreadcrumbContext);
  const { onDragOverContainer } = useDnDCallbacks();
  const { dropActions } = useContext(DropTargetsContext);
  let routePathDriveId = "";
  let routePathFolderId = "";
  if (props.path) {
    const[driveId, folderId, itemId] = props.path?.split(":");
    routePathDriveId = driveId;
    routePathFolderId = folderId;
  }
  const [nodesOnPath, _] = useRecoilState(nodePathSelector({driveId: routePathDriveId, folderId: routePathFolderId}));
  const driveLabel = props.driveLabel ?? "/";

  useEffect(() => {
    updateBreadcrumb({routePathDriveId, routePathFolderId});
  }, [nodesOnPath])

  const updateBreadcrumb = ({routePathDriveId, routePathFolderId}) => {
    if (props.driveId !== routePathDriveId) {
      return;
    }

    clearBreadcrumb();
    let breadcrumbStack = [];
    
    // generate folder stack
    const breadcrumbItemStyle = {
      fontSize: "24px",
      color: "#040F1A",
      textDecoration: "none",
    }
    
    for (let currentNode of nodesOnPath ) {
      const nodeObj = currentNode;
      const currentNodeId = nodeObj.folderId;

      let newParams = Object.fromEntries(new URLSearchParams());
      newParams['path'] = `${routePathDriveId}:${currentNodeId}:${currentNodeId}:Folder`;
      const destinationLink = `../?${encodeParams(newParams)}`
      // const draggedOver = DnDState.activeDropTargetId === currentNodeId && isDraggedOverBreadcrumb;  
      let breadcrumbElement = <Link 
        style={breadcrumbItemStyle} 
        to={destinationLink}>
        {nodeObj?.label}
      </Link>
      breadcrumbElement = <WithDropTarget
        key={`wdtbreadcrumb${props.driveId}${currentNodeId}`} 
        id={currentNodeId}
        registerDropTarget={dropActions.registerDropTarget} 
        unregisterDropTarget={dropActions.unregisterDropTarget}
        dropCallbacks={{
          onDragOver: () => onDragOverContainer({ id: currentNodeId, driveId: props.driveId, isBreadcrumb: true }),
          onDrop: () => {
            setFolderInfo({instructionType: folderInfoSelectorActions.MOVE_ITEMS, driveId: props.driveId, itemId: currentNodeId});
          }
        }}
        >
        { breadcrumbElement } 
      </WithDropTarget>

      const breadcrumbObj = {
        to: destinationLink,
        element: breadcrumbElement
      }

      breadcrumbStack.unshift(breadcrumbObj);
    }
    
    // add current drive to head of stack
    let newParams = Object.fromEntries(new URLSearchParams());
    newParams['path'] = `${routePathDriveId}:${routePathDriveId}:${routePathDriveId}:Drive`;
    const driveDestinationLink = `../?${encodeParams(newParams)}`
    
    const driveBreadcrumbElement = <WithDropTarget
      key={`wdtbreadcrumb${props.driveId}`} 
      id={routePathDriveId}
      registerDropTarget={dropActions.registerDropTarget} 
      unregisterDropTarget={dropActions.unregisterDropTarget}
      dropCallbacks={{
        onDragOver: () => onDragOverContainer({ id: routePathDriveId, driveId: props.driveId, isBreadcrumb: true }),
        onDrop: () => {setFolderInfo({instructionType: folderInfoSelectorActions.MOVE_ITEMS, driveId: props.driveId, itemId: props.driveId});}
      }}
      >
      <Link 
        style={breadcrumbItemStyle} 
        to={driveDestinationLink}>
        {props.driveLabel}
      </Link>
    </WithDropTarget>
    breadcrumbStack.unshift({
      to: driveDestinationLink,
      element: driveBreadcrumbElement
    });

    // add items in stack to breadcrumb
    for (let item of breadcrumbStack) {
      addBreadcrumbItem(item);      
    }
  }
}

const DragGhost = ({ id, element, numItems }) => {

  const containerStyle = {
    transform: "rotate(-5deg)",
    zIndex: "10",
    background: "#e2e2e2",
    width: "800px",
    border: "2px solid black",
    padding: "0px",
    height: "38px",
    overflow: "hidden",
  }

  const singleItemStyle = {
    boxShadow: 'rgba(0, 0, 0, 0.20) 5px 5px 3px 3px',
    borderRadius: '2px solid black',
    animation: 'dragAnimation 2s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: "#e2e2e2",
    // marginLeft: "-60px"
  }

  const multipleItemsNumCircleContainerStyle = {
    position: 'absolute',
    zIndex: "5",
    top: "6px",
    right: "5px",
    borderRadius: '25px',
    background: '#1A5A99',
    fontSize: '12px',
    color: 'white',
    width: '25px',
    height: '25px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', 
    // marginLeft: "-60px"
  }

  // const multipleItemsRearStackStyle = {
  //   boxShadow: 'rgba(0, 0, 0, 0.30) 5px 5px 3px -2px',
  //   borderRadius: '4px',
  //   padding: "0 5px 5px 0px",
  //   display: 'flex',
  //   justifyContent: 'flex-start',
  //   alignItems: 'flex-start',
  //   zIndex: "1",
  //   background: "#fff",
  //   marginLeft: "-60px"
  // }

  // const multipleItemsFrontStackStyle = {
  //   borderRadius: '4px',
  //   boxShadow: 'rgba(0, 0, 0, 0.15) 3px 3px 3px 0px',
  //   border: '1px solid rgba(0, 0, 0, 0.70)',
  //   display: 'flex',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   zIndex: "2",
  //   marginLeft: "-60px"
  // }

  return (
    <div id={id} style={containerStyle}>
    {
      numItems < 2 ? 
        <div
          style={singleItemStyle}>
          { element }
        </div>
      :
      <div 
        // style={{minWidth: "300px"}}
        >
        <div
          style={multipleItemsNumCircleContainerStyle}>
          {numItems}
        </div>
        <div
          // style={multipleItemsRearStackStyle}
          >
          <div
            style={singleItemStyle}>
            { element }
          </div>
        </div>
      </div>
    }      
    </div>
  )
}
