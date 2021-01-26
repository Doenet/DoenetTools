import React, {useContext, useState, useCallback, useRef, useEffect, useMemo} from 'react';
import { IsNavContext } from './Tool/NavPanel'
import axios from "axios";
import nanoid from 'nanoid';
import './util.css';
import { faTrashAlt, faLink, faCode, faFolder,faChevronRight, faChevronDown, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import {
  DropTargetsContext,
  WithDropTarget  
} from '../imports/DropTarget';
import Draggable from '../imports/Draggable';

import { BreadcrumbContext } from '../imports/Breadcrumb';

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
  RecoilRoot,
  useSetRecoilState,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

const sortOptions = Object.freeze({
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
  default: null
})

const dragStateAtom = atom({
  key: 'dragStateAtom',
  default: {
    isDragging: false,
    draggedOverDriveId: null,
    isDraggedOverBreadcrumb: false
  }
})

let fetchDrivesQuery = selector({
  key:"fetchDrivesQuery",
  get: async ({get})=>{
    const { data } = await axios.get(
      `/api/loadAvailableDrives.php`
    );
    return data
  },
 
})

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
        if (driveObj.type === type){
          drives.push(
          <React.Fragment key={`drive${driveObj.driveId}${isNav}`} ><Router ><Switch>
           <Route path="/" render={(routeprops)=>
           <DriveRouted route={{...routeprops}} driveId={driveObj.driveId} label={driveObj.label} isNav={isNav} {...props} driveObj={driveObj}/>
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
           <DriveRouted route={{...routeprops}} driveId={driveObj.driveId} label={driveObj.label} isNav={isNav} {...props} driveObj={driveObj}/>
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
      const driveInfo = get(loadDriveInfoQuery(driveIdFolderId.driveId))
      let defaultOrder = [];
      let contentsDictionary = {};
      let contentIds = {};
      let folderInfo = {
        sortBy: "defaultOrder",
        dirty: 0  
      };
      for (let item of driveInfo.results){
        if (item.parentFolderId === driveIdFolderId.folderId){
          defaultOrder.push(item.itemId);
          contentsDictionary[item.itemId] = item;
        }
        if (item.itemId === driveIdFolderId.folderId){
          folderInfo = item;
        }
      }
      
      if (folderInfo.dirty) {
        folderInfo.sortBy = "defaultOrder";
        folderInfo.dirty = 0;
      }

      contentIds["defaultOrder"] = defaultOrder;
  
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
    switch(instructions.instructionType){
      case "addItem":
        const dt = new Date();
        const creationDate = `${
          dt.getFullYear().toString().padStart(2, '0')}-${
            (dt.getMonth()+1).toString().padStart(2, '0')}-${
            dt.getDate().toString().padStart(2, '0')} ${
          dt.getHours().toString().padStart(2, '0')}:${
          dt.getMinutes().toString().padStart(2, '0')}:${
          dt.getSeconds().toString().padStart(2, '0')}`
        const itemId = nanoid();
        const newItem = {
          assignmentId: null,
          branchId: null,
          contentId: null,
          creationDate,
          isPublished: "0",
          itemId,
          itemType: instructions.itemType,
          label: instructions.label,
          parentFolderId: driveIdFolderId.folderId,
          url: null,
          urlDescription: null,
          urlId: null,
          sortBy: "defaultOrder",
          dirty: 0
        }
        //TODO: update to use fInfo
        set(folderDictionary(driveIdFolderId),(old)=>{
          let newObj = JSON.parse(JSON.stringify(old));
          newObj.contentsDictionary[itemId] = newItem;
          let newDefaultOrder = [...newObj.contentIds["defaultOrder"]];
          let index = newDefaultOrder.indexOf(instructions.selectedItemId);
          newDefaultOrder.splice(index+1, 0, itemId);
          newObj.contentIds["defaultOrder"] = newDefaultOrder;
          // newObj.folderInfo.dirty = 1;
          return newObj;
        })
        if (instructions.itemType === "Folder"){
          //If a folder set folderInfo and zero items
          set(folderDictionary({driveId:driveIdFolderId.driveId,folderId:itemId}),{
            folderInfo:newItem,contentsDictionary:{},contentIds:{"defaultOrder":[]}
          })
        }

        const data = { 
          driveId:driveIdFolderId.driveId,
          parentFolderId:driveIdFolderId.folderId,
          itemId,
          label:instructions.label,
          type:instructions.itemType
         };
        const payload = { params: data };

        axios.get('/api/AddItem.php', payload)
        .then(resp=>{
          //Not sure how to handle errors when saving data yet
          // throw Error("made up error")
        })
      break;
      case "sort":
        const { sortKey } = instructions;

        set(folderDictionary(driveIdFolderId),(old)=>{
          let newObj = JSON.parse(JSON.stringify(old));
          let { contentsDictionary, contentIds } = newObj;
          let newFolderInfo = { ...newObj.folderInfo }

          // sort folder child array
          const sortedFolderChildrenIds = sortItems({sortKey, nodeObjs: contentsDictionary, defaultFolderChildrenIds: contentIds["defaultOrder"]});

          // modify folder sortBy            
          newFolderInfo.sortBy = sortKey;

          // update folder data
          newObj.folderInfo = newFolderInfo;
          newObj.contentIds[sortKey] = sortedFolderChildrenIds;
          
          return newObj;
        })

        break;
      case "delete item":
        //Remove from folder
        let item = {driveId:driveIdFolderId.driveId,driveInstanceId:instructions.driveInstanceId,itemId:instructions.itemId}
        let newFInfo = {...fInfo}
        newFInfo["contentsDictionary"] = {...fInfo.contentsDictionary}
        delete newFInfo["contentsDictionary"][instructions.itemId];
        newFInfo.folderInfo = {...fInfo.folderInfo}
        newFInfo.folderInfo.dirty = 1;
        const sortBy = newFInfo.folderInfo.sortBy;
        newFInfo.contentIds = {...fInfo.contentIds}
        newFInfo.contentIds[sortBy] = [...fInfo.contentIds[sortBy]]
        const index = newFInfo.contentIds[sortBy].indexOf(instructions.itemId)
        newFInfo.contentIds[sortBy].splice(index,1)
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
      case "move items":
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
          let sourcesByParentFolderId = {};

          for(let gItem of globalSelectedItems){
            //Deselect Item
            let selecteditem = {driveId:gItem.driveId,driveInstanceId:gItem.driveInstanceId,itemId:gItem.itemId}
            set(selectedDriveItemsAtom(selecteditem),false)

            //Prepare to Add to destination
            const oldSourceFInfo = get(folderDictionary({driveId:instructions.driveId,folderId:gItem.parentFolderId}));
            newDestinationFolderObj["contentsDictionary"][gItem.itemId] = {...oldSourceFInfo["contentsDictionary"][gItem.itemId]}
            newDestinationFolderObj["contentIds"]["defaultOrder"].push(gItem.itemId)

            //Prepare to Remove from source
            let newSourceFInfo = sourcesByParentFolderId[gItem.parentFolderId];
            if (!newSourceFInfo){
              newSourceFInfo = JSON.parse(JSON.stringify(oldSourceFInfo));
              sourcesByParentFolderId[gItem.parentFolderId] = newSourceFInfo;
            }
            let index = newSourceFInfo["contentIds"]["defaultOrder"].indexOf(gItem.itemId);
              newSourceFInfo["contentIds"]["defaultOrder"].splice(index,1)
              delete newSourceFInfo["contentsDictionary"][gItem.itemId];
            
          }
          //Add all to destination
          set(folderDictionary({driveId:instructions.driveId,folderId:instructions.itemId}),newDestinationFolderObj);
          //Clear global selection
          set(globalSelectedNodesAtom,[])
          //Remove from sources
          for (let parentFolderId of Object.keys(sourcesByParentFolderId)){
            set(folderDictionary({driveId:instructions.driveId,folderId:parentFolderId}),sourcesByParentFolderId[parentFolderId])
          }

          let selectedItemIds = [];
          for (let item of globalSelectedItems){
            selectedItemIds.push(item.itemId);
          }

          const payload = {
            sourceDriveId:globalSelectedItems[0].driveId,
            selectedItemIds, 
            destinationItemId:destinationFolderObj.folderInfo.itemId,
            destinationParentFolderId:destinationFolderObj.folderInfo.parentFolderId,
            destinationDriveId:driveIdFolderId.driveId
          }
          axios.post("/api/moveItems.php", payload)
          .then((resp)=>{
            // console.log(resp.data)
          }
          )
          
        }
      break;
      case "assignment was published":
        set(folderDictionary(driveIdFolderId),(old)=>{
          let newObj = JSON.parse(JSON.stringify(old));
          let newItemObj = newObj.contentsDictionary[instructions.itemId];
          newItemObj.assignment_isPublished = "1";
          newItemObj.isAssignment = "1";
          return newObj;
        })
        break;
      case "content was published":
        set(folderDictionary(driveIdFolderId),(old)=>{
          let newObj = JSON.parse(JSON.stringify(old));
          let newItemObj = newObj.contentsDictionary[instructions.itemId];
          newItemObj.isPublished = "1";
          return newObj;
        })
      break;
      default:
        console.warn(`Intruction ${instructions.instructionType} not currently handled`)
    }
    
  }
  // set:(setObj,newValue)=>({set,get})=>{
  //   console.log("setObj",setObj,newValue);

  // }
})

const sortItems = ({ sortKey, nodeObjs, defaultFolderChildrenIds }) => {
  let tempArr = [...defaultFolderChildrenIds];
  switch (sortKey) {
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

function DriveRouted(props){
  // console.log("=== DriveRouted")
  let hideUnpublished = false; //Default to showing unpublished
  if (props.hideUnpublished){ hideUnpublished = props.hideUnpublished}
  const driveInfo = useRecoilValueLoadable(loadDriveInfoQuery(props.driveId))
  const setDriveInstanceId = useSetRecoilState(driveInstanceIdDictionary(props.driveId))
  const [_, setSelectedDrive] = useRecoilState(selectedDriveAtom); 
  let driveInstanceId = useRef("");
  // const updateBreadcrumb = useUpdateBreadcrumb({driveId: props.driveId, driveLabel: props.driveObj.label}); 
  useUpdateBreadcrumb({driveId: props.driveId, driveLabel: props.driveObj.label, 
    path: Object.fromEntries(new URLSearchParams(props.route.location.search))?.path}); 

  // useEffect(() => {
  //   if (driveInfo.state === "loading") return;

  //   updateBreadcrumb({routePathDriveId, routePathFolderId});
    
  // }, [driveInfo.state, routePathDriveId, routePathFolderId])

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
    if (routePathDriveId !== ""){
      pathDriveId = routePathDriveId;
      if (props.driveId === pathDriveId) setSelectedDrive(props.driveObj);
    }
    if (routePathFolderId !== ""){pathFolderId = routePathFolderId;}
  }
  //If navigation then build from root else build from path
  let rootFolderId = pathFolderId;
  if(props.isNav){
    rootFolderId = props.driveId;
  }
  
  if (!props.isNav && routePathDriveId && props.driveId !== routePathDriveId) return <></>;  

  return <>
  {/* <LogVisible driveInstanceId={driveInstanceId.current} /> */}
  {/* <Folder driveId={props.driveId} folderId={rootFolderId} indentLevel={0} rootCollapsible={true}/> */}
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
  />
  </>
}

const folderOpenAtom = atomFamily({
  key:"folderOpenAtom",
  default:false
})

const folderOpenSelector = selectorFamily({
  key:"folderOpenSelector",
  set:(driveInstanceIdItemId) => ({get,set})=>{
    const isOpen = get(folderOpenAtom(driveInstanceIdItemId))
    set(folderOpenAtom(driveInstanceIdItemId),!isOpen); 
  }
})

let encodeParams = p => 
Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&");

function Folder(props){

  let itemId = props?.folderId;
  if (!itemId){ itemId = props.driveId}
  //Used to determine range of items in Shift Click
  const isOpen = useRecoilValue(folderOpenAtom({driveInstanceId:props.driveInstanceId,itemId:props.folderId}))
  const toggleOpen = useSetRecoilState(folderOpenSelector({driveInstanceId:props.driveInstanceId,itemId:props.folderId}))

  let history = useHistory();
  
  const [folderInfoObj, setFolderInfo] = useRecoilStateLoadable(folderDictionarySelector({driveId:props.driveId,folderId:props.folderId}))
  const {folderInfo, contentsDictionary, contentIds} = folderInfoObj.contents;
  
  const { onDragStart, onDrag, onDragOverContainer, onDragEnd, renderDragGhost } = useDnDCallbacks();
  const { dropState, dropActions } = useContext(DropTargetsContext);
  const [dragState] = useRecoilState(dragStateAtom);
  
  // console.log(`=== 📁 ${folderInfo?.label}`)
  const setSelected = useSetRecoilState(selectedDriveItems({driveId:props.driveId,driveInstanceId:props.driveInstanceId,itemId})); 
  const isSelected = useRecoilValue(selectedDriveItemsAtom({driveId:props.driveId,driveInstanceId:props.driveInstanceId,itemId})); 
  const deleteItem = (itemId) =>{setFolderInfo({instructionType:"delete item",driveInstanceId:props.driveInstanceId,itemId})}
  const globalSelectedNodes = useRecoilValue(globalSelectedNodesAtom); 

  const indentPx = 20;
  let bgcolor = "#f6f8ff";
  let borderSide = "0px 0px 0px 0px";
  let marginSize = "50px";
  let widthSize = "850px";
  if (props.isNav) {marginSize = "0px"; widthSize = "224px"};
  if (isSelected  || (props.isNav && itemId === props.pathItemId)) { bgcolor = "hsl(209,54%,82%)"; borderSide = "8px 0px 0px 0px #1A5A99"; }
  if (dropState.activeDropTargetId === itemId) { bgcolor = "hsl(209,54%,82%)"; }
  if (isSelected && dragState.isDragging) { bgcolor = "#e2e2e2"; }  
 

  const contentIdsOrder = folderInfo?.sortBy ?? "defaultOrder";
  const contentIdsArr = contentIds?.[contentIdsOrder] ?? [];
 
  let openCloseText = isOpen ? <FontAwesomeIcon icon={faChevronDown}/> : <FontAwesomeIcon icon={faChevronRight}/>;
  let deleteButton = <button
  style={{backgroundColor: bgcolor, border: "none"}}
  data-doenet-driveinstanceid={props.driveInstanceId}
  onClick={(e)=>{
    e.preventDefault();
    e.stopPropagation();
    deleteItem(itemId)
  }}
  ><FontAwesomeIcon icon={faTrashAlt}/></button>

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
      instructionType:"sort",
      sortKey: sortKey
    });
  };

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
  let folder = <div
      data-doenet-driveinstanceid={props.driveInstanceId}
      tabIndex={0}
      className="noselect nooutline" 
      style={{
        cursor: "pointer",
        width: "300px",
        padding: "8px",
        border: "0px",
        borderBottom: "2px solid black", 
        backgroundColor: bgcolor,
        width: widthSize,
        // boxShadow: borderSide,
        marginLeft: marginSize
      }}
      onClick={(e)=>{
        if (props.isNav){
          //Only select one item
          let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));

          let newParams = {...urlParamsObj} 
          newParams['path'] = `${props.driveId}:${itemId}:${itemId}:Folder`
          history.push('?'+encodeParams(newParams))
        }else{
          if (!e.shiftKey && !e.metaKey){
            setSelected({instructionType:"one item",parentFolderId:props.parentFolderId})
          }else if (e.shiftKey && !e.metaKey){
            setSelected({instructionType:"range to item",parentFolderId:props.parentFolderId})
          }else if (!e.shiftKey && e.metaKey){
            setSelected({instructionType:"add item",parentFolderId:props.parentFolderId})
          }
        }
        
        }}
        onBlur={(e) => {
          //Don't clear on navigation changes
          if (!props.isNav){
          //Only clear if focus goes outside of this node group
            if (e.relatedTarget === null ||
              (e.relatedTarget.dataset.doenetDriveinstanceid !== props.driveInstanceId &&
              !e.relatedTarget.dataset.doenetDriveStayselected)
              ){
                setSelected({instructionType:"clear all"})
            }
          }
        }}
      >
        <div 
      className="noselect" 
      style={{
        marginLeft: `${props.indentLevel * indentPx}px`
      }}>{openCloseButton} <FontAwesomeIcon icon={faFolder}/> {label} ({contentIdsArr.length}) {deleteButton}</div></div>

  let items = null;
  
  if (props.driveObj){
    //Root of Drive
    label = props.driveObj.label;
    folder = <>
    <div
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
        // marginLeft: `${(props.indentLevel * indentPx)}px`,
        marginLeft: marginSize,
        fontSize: "24px"
      }}
      onClick={(e)=>{
        if (props.isNav){
          //Only select one item
          let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));

          let newParams = {...urlParamsObj} 
          newParams['path'] = `${props.driveId}:${itemId}:${itemId}:Drive`
          history.push('?'+encodeParams(newParams))
        }
      }
    }
    >Drive {label} ({contentIdsArr.length})</div></>
    if (props.rootCollapsible){
      folder = <div
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
          // marginLeft: `${(props.indentLevel * indentPx)}px`,
          marginLeft: marginSize,
          fontSize: "24px"
        }}
      > {openCloseButton} Drive {label} ({contentIdsArr.length})</div>
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
      onDragEnd={onDragEnd}
      ghostElement={renderDragGhost(props.folderId, folder)}
      >
      { folder } 
    </Draggable>;
  }

  folder = <WithDropTarget
    key={`wdtnode${props.driveInstanceId}${props.folderId}`} 
    id={props.folderId}
    registerDropTarget={dropActions.registerDropTarget} 
    unregisterDropTarget={dropActions.unregisterDropTarget}
    dropCallbacks={{
      onDragOver: () => onDragOverContainer({ id: props.folderId, driveId: props.driveId }),
      onDrop: () => {setFolderInfo({instructionType: "move items", driveId: props.driveId, itemId: props.folderId});}
    }}
    >
    { folder } 
  </WithDropTarget>

  if (props.driveObj && !props.isNav) {
    const sortButtons = <div style={{marginLeft: "50px"}}>
      {sortNodeButtonFactory({buttonLabel: "Sort Label ASC", sortKey: sortOptions.LABEL_ASC, sortHandler})} 
      {sortNodeButtonFactory({buttonLabel: "Sort Label DESC", sortKey: sortOptions.LABEL_DESC, sortHandler})} 
      {sortNodeButtonFactory({buttonLabel: "Sort Date ASC", sortKey: sortOptions.CREATION_DATE_ASC, sortHandler})} 
      {sortNodeButtonFactory({buttonLabel: "Sort Date DESC", sortKey: sortOptions.CREATION_DATE_DESC, sortHandler})}
    </div>;

    folder = <>
      {sortButtons}
      {folder}
    </>;
  }

  if (isOpen || (props.driveObj && !props.rootCollapsible)){
    let dictionary = contentsDictionary;
    items = [];
    for (let itemId of contentIdsArr){
      let item = dictionary[itemId];
      // console.log(">>>item",item)
      if (props.hideUnpublished && item.isPublished === "0"){
        //hide item
        continue;
      }
      switch(item.itemType){
        case "Folder":
        items.push(<Folder 
          key={`item${itemId}${props.driveInstanceId}`} 
          driveId={props.driveId} 
          folderId={item.itemId} 
          indentLevel={props.indentLevel+1}  
          driveInstanceId={props.driveInstanceId}
          route={props.route}
          isNav={props.isNav}
          urlClickBehavior={props.urlClickBehavior}
          pathItemId={props.pathItemId}
          deleteItem={deleteItem}
          parentFolderId={props.folderId}
          hideUnpublished={props.hideUnpublished}
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
            deleteItem={deleteItem}
          />)
        break;
        default:
        console.warn(`Item not rendered of type ${item.itemType}`)
      }
 
    }

    if (contentIdsArr.length === 0){
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
    width: "840px",
    padding: "8px",
    // border: "1px solid black",
    backgroundColor: "#f6f8ff",
    margin: "2px",
  
  }} ><div className="noselect" style={{marginLeft: "50px"}}>EMPTY</div></div>)
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

const selectedDriveItems = selectorFamily({
  key:"selectedDriveItems",
  // get:(driveIdDriveInstanceIdItemId) =>({get})=>{ 
  //   return get(selectedDriveItemsAtom(driveIdDriveInstanceIdItemId));
  // },
  set:(driveIdDriveInstanceIdItemId) => ({get,set},instruction)=>{
    const globalSelected = get(globalSelectedNodesAtom);
    const isSelected = get(selectedDriveItemsAtom(driveIdDriveInstanceIdItemId))
    const {driveId,driveInstanceId,itemId} = driveIdDriveInstanceIdItemId;
    function findRange({clickNeedle,lastNeedle,foundClickNeedle=false,foundLastNeedle=false,currentFolderId}){
      let itemIdsParentFolderIdsInRange = [];
      let folder = get(folderDictionary({driveId,folderId:currentFolderId}))      
      let sortOrder = folder.folderInfo.sortBy;

      for (let itemId of folder.contentIds[sortOrder]){
        if (foundClickNeedle && foundLastNeedle){
          break;
        }
        if (clickNeedle === itemId){ foundClickNeedle = true;}
        if (lastNeedle === itemId){ foundLastNeedle = true;}
        //Add itemId if inside the range or an end point then add to itemIds
        if (foundClickNeedle || foundLastNeedle){
          itemIdsParentFolderIdsInRange.push({itemId,parentFolderId:currentFolderId});
        }
        
        
        if (folder.contentsDictionary[itemId].itemType === "Folder"){
          const isOpen = get(folderOpenAtom({driveInstanceId,itemId}))
          //Recurse if open
          if (isOpen){
            let [subItemIdsParentFolderIdsInRange,subFoundClickNeedle,subFoundLastNeedle] = 
            findRange({clickNeedle,lastNeedle,foundClickNeedle,foundLastNeedle,currentFolderId:itemId});
            itemIdsParentFolderIdsInRange.push(...subItemIdsParentFolderIdsInRange);
            if (subFoundClickNeedle){foundClickNeedle = true;}
            if (subFoundLastNeedle){foundLastNeedle = true;}
          }
          
        }
        if (foundClickNeedle && foundLastNeedle){
          break;
        }
      }
      return [itemIdsParentFolderIdsInRange,foundClickNeedle,foundLastNeedle];
    }
    switch (instruction.instructionType) {
      case "one item":
        if (!isSelected){
          for (let itemObj of globalSelected){
            let itemInfo = { ...itemObj };
            delete itemInfo["parentFolderId"];
            set(selectedDriveItemsAtom(itemInfo),false)
          }
          set(selectedDriveItemsAtom(driveIdDriveInstanceIdItemId),true)
          let itemInfo = {...driveIdDriveInstanceIdItemId}
          itemInfo["parentFolderId"] = instruction.parentFolderId;
          set(globalSelectedNodesAtom,[itemInfo])
        }
        break;
      case "add item":
        if (isSelected){
          set(selectedDriveItemsAtom(driveIdDriveInstanceIdItemId),false)
          let newGlobalSelected = [...globalSelected];
          const index = newGlobalSelected.indexOf(driveIdDriveInstanceIdItemId)
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
        if (globalSelected.length === 0){
          //No previous items selected so just select this one
          set(selectedDriveItemsAtom(driveIdDriveInstanceIdItemId),true)
          let itemInfo = {...driveIdDriveInstanceIdItemId}
          itemInfo["parentFolderId"] = instruction.parentFolderId;
          set(globalSelectedNodesAtom,[itemInfo])
        }else{
          let lastSelectedItem = globalSelected[globalSelected.length-1];

          //TODO: Just select one if driveInstanceId doesn't match
          //Starting at root build array of visible items in order
          let [selectTheseItemIdParentFolderIds] = findRange({
            currentFolderId:driveId,
            lastNeedle:lastSelectedItem.itemId,
            clickNeedle:driveIdDriveInstanceIdItemId.itemId});
          let addToGlobalSelected = []
          for (let itemIdParentFolderIdsToSelect of selectTheseItemIdParentFolderIds){
            let itemKey = {...driveIdDriveInstanceIdItemId}
            itemKey.itemId = itemIdParentFolderIdsToSelect.itemId;
            let forGlobal = {...itemKey}
            forGlobal.parentFolderId = itemIdParentFolderIdsToSelect.parentFolderId;
            if (!get(selectedDriveItemsAtom(itemKey))){
              set(selectedDriveItemsAtom(itemKey),true)
              addToGlobalSelected.push(forGlobal);
            }
          }
          //TODO: Does this have the parentFolderId?
          set(globalSelectedNodesAtom,[...globalSelected,...addToGlobalSelected])

        }
      break;
      case "clear all":
          //TODO: Only clear this browser?
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
  const [dragState] = useRecoilState(dragStateAtom);
  const { onDragStart, onDrag, onDragEnd, renderDragGhost } = useDnDCallbacks();
  const globalSelectedNodes = useRecoilValue(globalSelectedNodesAtom); 

  const indentPx = 20;
  let bgcolor = "#f6f8ff";
  let borderSide = "0px 0px 0px 0px";
  let widthSize = "850px";
  let marginSize = "50px";
  if (props.isNav) {widthSize = "224px"; marginSize = "0px"}
  if (isSelected || (props.isNav && props.item.itemId === props.pathItemId)) { bgcolor = "hsl(209,54%,82%)"; borderSide = "8px 0px 0px 0px #1A5A99"; }
  if (isSelected && dragState.isDragging) { bgcolor = "#e2e2e2"; }  
  
  

  let deleteButton = <button
  style={{backgroundColor: bgcolor, border: "none"}}
  data-doenet-driveinstanceid={props.driveInstanceId}
  onClick={(e)=>{
    e.preventDefault();
    e.stopPropagation();
    props.deleteItem(props.item.itemId)
  }}
  ><FontAwesomeIcon icon={faTrashAlt}/></button>

  let label = props.item?.label;
  if (props.item?.assignment_isPublished === "1" && props.item?.isAssignment === "1"){
    label = props.item?.assignment_title;
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
      onClick={(e)=>{
        
        if (props.isNav){
          //Only select one item
          let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
          let newParams = {...urlParamsObj} 
          newParams['path'] = `${props.driveId}:${props.item.parentFolderId}:${props.item.itemId}:DoenetML`
          history.push('?'+encodeParams(newParams))
        }else{
          if (!e.shiftKey && !e.metaKey){
            setSelected({instructionType:"one item",parentFolderId:props.item.parentFolderId})
          }else if (e.shiftKey && !e.metaKey){
            setSelected({instructionType:"range to item",parentFolderId:props.item.parentFolderId})
          }else if (!e.shiftKey && e.metaKey){
            setSelected({instructionType:"add item",parentFolderId:props.item.parentFolderId})
          }
        }
       
      }}
      onBlur={(e) => {
        //Don't clear on navigation changes
        if (!props.isNav){
        //Only clear if focus goes outside of this node group
          if (e.relatedTarget === null ||
            (e.relatedTarget.dataset.doenetDriveinstanceid !== props.driveInstanceId &&
            !e.relatedTarget.dataset.doenetDriveStayselected)
            ){
              setSelected({instructionType:"clear all"})
          }
          // if (e.relatedTarget === null){
          //   setSelected({instructionType:"clear all"})
          // }
          // console.log(">>>",e.relatedTarget);
          // console.log(">>>dataset",e?.relatedTarget?.dataset)
          
        }
      }}
      ><div 
      style={{
        marginLeft: `${props.indentLevel * indentPx}px`
      }}>
<FontAwesomeIcon icon={faCode}/> {label} {deleteButton} </div></div>

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
        ghostElement={renderDragGhost(props.item.itemId, doenetMLJSX)}
        >
        { doenetMLJSX } 
      </Draggable>
    }
    return doenetMLJSX;
  })

const Url = React.memo((props)=>{
  const { onDragStart, onDrag, onDragEnd, renderDragGhost } = useDnDCallbacks();
  const [dragState] = useRecoilState(dragStateAtom);
  // console.log(`=== 🔗 Url`)


  const history = useHistory();
  const setSelected = useSetRecoilState(selectedDriveItems({driveId:props.driveId,driveInstanceId:props.driveInstanceId,itemId:props.item.itemId})); 
  const isSelected = useRecoilValue(selectedDriveItemsAtom({driveId:props.driveId,driveInstanceId:props.driveInstanceId,itemId:props.item.itemId})); 
  const globalSelectedNodes = useRecoilValue(globalSelectedNodesAtom); 

  const indentPx = 20;
  let bgcolor = "#f6f8ff";
  let borderSide = "0px 0px 0px 0px";
  let widthSize = "850px";
  let marginSize = "50px";
  if (props.isNav) {widthSize = "224px"; marginSize = "0px"};
  if (isSelected || (props.isNav && props.item.itemId === props.pathItemId)) {bgcolor = "hsl(209,54%,82%)"; borderSide = "8px 0px 0px 0px #1A5A99"}
  if (isSelected && dragState.isDragging) { bgcolor = "#e2e2e2"; }  
  

  let deleteButton = <button
  style={{backgroundColor: bgcolor, border: "none"}}
  data-doenet-driveinstanceid={props.driveInstanceId}
  onClick={(e)=>{
    e.preventDefault();
    e.stopPropagation();
    props.deleteItem(props.item.itemId)
  }}
  ><FontAwesomeIcon icon={faTrashAlt}/></button>

  let urlJSX = <div
      data-doenet-driveinstanceid={props.driveInstanceId}
      tabIndex={0}
      className="noselect nooutline" 
      style={{
        cursor: "pointer",
        width: "300px",
        padding: "8px",
        border: "0px",
        borderBottom: "2px solid black",
        backgroundColor: bgcolor,
        width: widthSize,
        // boxShadow: borderSide,
        marginLeft: marginSize
      }}
      onClick={(e)=>{
        if (props.urlClickBehavior === "select"){
          if (props.isNav){
            //Only select one item
            let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
            let newParams = {...urlParamsObj} 
            newParams['path'] = `${props.driveId}:${props.item.parentFolderId}:${props.item.itemId}:Url`
            history.push('?'+encodeParams(newParams))
          }else{
            if (!e.shiftKey && !e.metaKey){
              setSelected({instructionType:"one item",parentFolderId:props.item.parentFolderId})
            }else if (e.shiftKey && !e.metaKey){
              setSelected({instructionType:"range to item",parentFolderId:props.item.parentFolderId})
            }else if (!e.shiftKey && e.metaKey){
              setSelected({instructionType:"add item",parentFolderId:props.item.parentFolderId})
            }
          }
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
          if (e.relatedTarget === null ||
            (e.relatedTarget.dataset.doenetDriveinstanceid !== props.driveInstanceId &&
            !e.relatedTarget.dataset.doenetDriveStayselected)
            ){
              setSelected({instructionType:"clear all"})
          }
        }
      }}
      ><div 
      className="noselect" 
      style={{
        marginLeft: `${props.indentLevel * indentPx}px`
      }}>
    <FontAwesomeIcon icon={faLink}/> {props.item?.label} {deleteButton}</div></div>

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
      ghostElement={renderDragGhost(props.item.itemId, urlJSX)}
      >
      { urlJSX } 
    </Draggable>
  }

  return urlJSX;

  })

function useDnDCallbacks() {
  const { dropState, dropActions } = useContext(DropTargetsContext);
  const [dragState, setDragState] = useRecoilState(dragStateAtom);

  const onDragStart = ({ nodeId, driveId, onDragStartCallback }) => {
    setDragState((dragState) => ({
      ...dragState,
      isDragging: true,
      draggedOverDriveId: driveId
    }));
    onDragStartCallback?.();
  };

  const onDrag = ({ clientX, clientY, translation, id }) => {
    dropActions.handleDrag(clientX, clientY, id);
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
      draggedOverDriveId: null
    }));
    dropActions.handleDrop();
  };

  function renderDragGhost(id, element) {
    const dragGhostId = `drag-ghost-${id}`;
    // const numItems = Object.keys(selectedNodes).length;
    const numItems = 1;
    
    return <DragGhost id={dragGhostId} numItems={numItems} element={element} />;
  }

  return {
    onDragStart,
    onDrag,
    onDragOverContainer,
    onDragEnd,
    renderDragGhost
  }
}

const nodePathSelector = selectorFamily({
  key:"nodePathSelector",
  get: (driveIdFolderId) => ({get})=>{
    
    const { driveId, folderId } = driveIdFolderId;
    let path = []
    let currentNode = folderId;
    while (currentNode && currentNode !== driveId) {
      const folderInfoObj = get(folderDictionary({ driveId, folderId: currentNode})); 
      path.push({folderId: currentNode, label: folderInfoObj.folderInfo.label})
      currentNode = folderInfoObj.folderInfo.parentFolderId;
    }
    return path;
  }
})

function useUpdateBreadcrumb(props) {
  const { addItem: addBreadcrumbItem , clearItems: clearBreadcrumb } = useContext(BreadcrumbContext);
  const { onDragOverContainer } = useDnDCallbacks();
  const [ pathDriveIdFolderId, setPathDriveIdFolderId] = useState({})
  const { dropActions } = useContext(DropTargetsContext);
  const [dragState] = useRecoilState(dragStateAtom);
  const { isDraggedOverBreadcrumb } = dragState;
  const nodePathObj = useRecoilStateLoadable(nodePathSelector({driveId: pathDriveIdFolderId.driveId, folderId: pathDriveIdFolderId.folderId}));
  const nodesOnPath = nodePathObj?.[0]?.contents ?? [];
  const driveLabel = props.driveLabel ?? "/";

  useEffect(() => {
    if (!props.path) return;
    const[routePathDriveId, routePathFolderId, _] = props.path.split(":");
    // routePathDriveIdRef.current = routePathDriveId;
    // routePathFolderIdRef.current = routePathFolderId;
    setPathDriveIdFolderId({driveId: routePathDriveId, folderId: routePathFolderId})
  }, [props.path, nodePathObj.state, nodesOnPath])

  useEffect(() => {
    updateBreadcrumb({routePathDriveId: pathDriveIdFolderId.driveId, routePathFolderId: pathDriveIdFolderId.folderId});
  }, [pathDriveIdFolderId])

  const updateBreadcrumb = ({routePathDriveId, routePathFolderId}) => {
    // const {routePathDriveId, routePathFolderId} = pathDriveIdFolderId;
    // console.log(pathDriveIdFolderId)
    if (routePathDriveId === "") {
      clearBreadcrumb();
      addBreadcrumbItem({to: "/", element: <div>{driveLabel}</div>});
      return;
    }

    if (props.driveId !== routePathDriveId) {
      return;
    }

    clearBreadcrumb();
    let breadcrumbStack = [];
    
    // generate folder stack
    const breadcrumbItemStyle = {
      fontSize: "24px",
      color: "#8a8a8a",
      textDecoration: "none",
    }
    // let nodesOnPath = getNodesOnPath({ currentNodeId: routePathFolderId, end: routePathDriveId});
    console.log(">>>", nodesOnPath)
    
    for (let currentNode of nodesOnPath ) {
      const nodeObj = currentNode;
      const currentNodeId = nodeObj.folderId;

      let newParams = Object.fromEntries(new URLSearchParams());
      newParams['path'] = `${routePathDriveId}:${currentNodeId}::/`;
      const destinationLink = `../?${encodeParams(newParams)}`
      // const draggedOver = DnDState.activeDropTargetId === currentNodeId && isDraggedOverBreadcrumb;  
      const breadcrumbElement = <Link 
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
            setFolderInfo({instructionType: "move items", driveId: props.driveId, itemId: currentNodeId});
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
    newParams['path'] = `${routePathDriveId}:${routePathDriveId}::/`;
    const driveDestinationLink = `../?${encodeParams(newParams)}`
    
    const driveBreadcrumbElement = <WithDropTarget
      key={`wdtbreadcrumb${props.driveId}`} 
      id={routePathDriveId}
      registerDropTarget={dropActions.registerDropTarget} 
      unregisterDropTarget={dropActions.unregisterDropTarget}
      dropCallbacks={{
        onDragOver: () => onDragOverContainer({ id: routePathDriveId, driveId: props.driveId, isBreadcrumb: true }),
        onDrop: () => {setFolderInfo({instructionType: "move items", driveId: props.driveId, itemId: props.driveId});}
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
    zIndex: "10"
  }

  const singleItemStyle = {
    boxShadow: 'rgba(0, 0, 0, 0.20) 5px 5px 3px 3px',
    borderRadius: '2px solid black',
    animation: 'dragAnimation 2s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: "#fff"
  }

  const multipleItemsNumCircleContainerStyle = {
    position: 'absolute',
    zIndex: "5",
    top: "-10px",
    right: "-15px",
    borderRadius: '25px',
    background: '#bc0101',
    fontSize: '12px',
    color: 'white',
    width: '25px',
    height: '25px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const multipleItemsRearStackStyle = {
    boxShadow: 'rgba(0, 0, 0, 0.30) 5px 5px 3px -2px',
    borderRadius: '4px',
    padding: "0 5px 5px 0px",
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    zIndex: "1",
    background: "#fff"
  }

  const multipleItemsFrontStackStyle = {
    borderRadius: '4px',
    boxShadow: 'rgba(0, 0, 0, 0.15) 3px 3px 3px 0px',
    border: '1px solid rgba(0, 0, 0, 0.70)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: "2"
  }


  return (
    <div id={id} style={containerStyle}>
    {
      numItems < 2 ? 
        <div
          style={singleItemStyle}>
          { element }
        </div>
      :
      <div style={{minWidth: "300px"}}>
        <div
          style={multipleItemsNumCircleContainerStyle}>
          {numItems}
        </div>
        <div
          style={multipleItemsRearStackStyle}>
          <div
            style={multipleItemsFrontStackStyle}>
            { element }
          </div>
        </div>
      </div>
    }      
    </div>
  )
}
