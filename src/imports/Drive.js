import React, {useContext, useState, useCallback, useRef, useEffect} from 'react';
import { IsNavContext } from './Tool/NavPanel'
import axios from "axios";
import nanoid from 'nanoid';
import './util.css';


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
  useHistory
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
  console.log("=== Drive")
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
    return <>{drives}</>
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

let folderDictionary = atomFamily({
  key:"folderDictionary",
  default:selectorFamily({
    key:"folderDictionary/Default",
    get:(driveIdFolderId)=>({get})=>{
      console.log(`=== GET folderDictionary atom ${driveIdFolderId.folderId}`)
  
      const driveInfo = get(loadDriveInfoQuery(driveIdFolderId.driveId))
      console.log(">>>driveInfo",driveInfo)
      let defaultOrder = [];
      let contentsDictionary = {};
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
  
      return {folderInfo,contentsDictionary,defaultOrder}
    } 
  })
})

export const folderDictionarySelector = selectorFamily({
  //{driveId,folderId}
  get:(driveIdFolderId)=>({get})=>{
    return get(folderDictionary(driveIdFolderId));
  },
  set: (driveIdFolderId) => async ({set,get},instructions)=>{
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
          urlId: null
        }
        set(folderDictionary(driveIdFolderId),(old)=>{
        let newObj = {...old}
        newObj.contentsDictionary = {...old.contentsDictionary}
        newObj.contentsDictionary[itemId] = newItem;
        newObj.defaultOrder = [...old.defaultOrder];
        let index = newObj.defaultOrder.indexOf(instructions.selectedItemId);
        newObj.defaultOrder.splice(index+1,0,itemId);
        return newObj;
        })
        if (instructions.itemType === "Folder"){
          //If a folder set folderInfo and zero items
          set(folderDictionary({driveId:driveIdFolderId.driveId,folderId:itemId}),{
            folderInfo:newItem,contentsDictionary:{},defaultOrder:[]
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
          console.log(">>>resp",resp)
          //Not sure how to handle errors when saving data yet
          // throw Error("made up error")
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

function DriveRouted(props){
  console.log("=== DriveRouted")
  const driveInfo = useRecoilValueLoadable(loadDriveInfoQuery(props.driveId))

  let browserId = useRef("");

  if (driveInfo.state === "loading"){ return null;}
  if (driveInfo.state === "hasError"){ 
    console.error(driveInfo.contents)
    return null;}

  if (browserId.current === ""){ browserId.current = nanoid();}

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
    if (routePathDriveId !== ""){pathDriveId = routePathDriveId;}
    if (routePathFolderId !== ""){pathFolderId = routePathFolderId;}
  }
  //If navigation then build from root else build from path
  let rootFolderId = pathFolderId;
  if(props.isNav){
    rootFolderId = props.driveId;
  }


  return <>
  <LogVisible browserId={browserId.current} />
  {/* <Folder driveId={props.driveId} folderId={rootFolderId} indentLevel={0} rootCollapsible={true}/> */}
  <Folder 
  driveId={props.driveId} 
  folderId={rootFolderId} 
  indentLevel={0}  
  driveObj={props.driveObj} 
  rootCollapsible={props.rootCollapsible}
  browserId={browserId.current}
  isNav={props.isNav}
  urlClickBehavior={props.urlClickBehavior}
  route={props.route}
  pathItemId={pathItemId}
  />
  </>
}

let encodeParams = p => 
Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&");

function Folder(props){

  let itemId = props?.folderId;
  if (!itemId){ itemId = props.driveId}
  const [isOpen,setIsOpen] = useState(false);

  let history = useHistory();
  
  const [folderInfo,setFolderInfo] = useRecoilStateLoadable(folderDictionarySelector({driveId:props.driveId,folderId:props.folderId}))
 
  
  const setVisibleItems = useSetRecoilState(visibleDriveItems(props.browserId));
  console.log(`=== 📁 ${folderInfo?.contents?.folderInfo?.label}`)
  const setSelected = useSetRecoilState(selectedDriveItems({driveId:props.driveId,browserId:props.browserId,itemId})); 
  const isSelected = useRecoilValue(selectedDriveItemsAtom({driveId:props.driveId,browserId:props.browserId,itemId})); 

  const indentPx = 20;
  let bgcolor = "#e2e2e2";
  if (isSelected  || (props.isNav && itemId === props.pathItemId)) { bgcolor = "#6de5ff"; }
  if (props.appearance === "dropperview") { bgcolor = "#53ff47"; }
  if (props.appearance === "dragged") { bgcolor = "#f3ff35"; }  
 
  let openCloseText = isOpen ? "Close" : "Open";
  let openCloseButton = <button onClick={()=>setIsOpen(isOpen=>{
    if (isOpen){
      //Closing so remove items
      setVisibleItems((old)=>{
        let newItems = [...old]; 
        const index = newItems.indexOf(folderInfo?.contents?.folderInfo?.itemId)
        const numToRemove = folderInfo.contents.defaultOrder.length
        newItems.splice(index+1,numToRemove)
        return newItems;
      })

    }else{
      //Opening so add items
      let itemIds = [];
    for (let itemId of folderInfo.contents.defaultOrder){
      itemIds.push(itemId);
    }
    setVisibleItems((old)=>{
      let newItems = [...old]; 
      const index = newItems.indexOf(folderInfo?.contents?.folderInfo?.itemId)
      newItems.splice(index+1,0,...itemIds)
      return newItems;
    })
    
    }
    return !isOpen
  })}>{openCloseText}</button>

  let label = folderInfo?.contents?.folderInfo?.label;
  let folder = <div
      data-doenet-browserid={props.browserId}
      tabIndex={0}
      className="noselect nooutline" 
      style={{
        cursor: "pointer",
        width: "300px",
        padding: "4px",
        border: "1px solid black",
        backgroundColor: bgcolor,
        margin: "2px",
      }}
      onClick={(e)=>{
        if (props.isNav){
          //Only select one item
          let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));

          let newParams = {...urlParamsObj} 
          newParams['path'] = `${props.driveId}:${itemId}:${itemId}:Folder`
          history.push('?'+encodeParams(newParams))
          // setSelected("one item")
        }else{
          if (!e.shiftKey && !e.metaKey){
            setSelected("one item")
          }else if (e.shiftKey && !e.metaKey){
            setSelected("range to item")
          }else if (!e.shiftKey && e.metaKey){
            setSelected("add item")
          }
        }
        
        }}
        onBlur={(e) => {
          //Don't clear on navigation changes
          if (!props.isNav){
          //Only clear if focus goes outside of this node group
            if (e.relatedTarget === null ||
              (e.relatedTarget.dataset.doenetBrowserid !== props.browserId &&
              !e.relatedTarget.dataset.doenetBrowserStayselected)
              ){
                setSelected("clear all")
            }
          }
        }}
      >
        <div 
      className="noselect" 
      style={{
        marginLeft: `${props.indentLevel * indentPx}px`
      }}>{openCloseButton} Folder {label} ({folderInfo.contents.defaultOrder.length})</div></div>
  let items = null;
  if (props.driveObj){
    //Root of Drive
    setVisibleItems([])
    label = props.driveObj.label;
    folder = <div
      data-doenet-browserid={props.browserId}
      tabIndex={0}
      className="noselect nooutline" 
      style={{
        cursor: "pointer",
        width: "300px",
        padding: "4px",
        border: "1px solid black",
        backgroundColor: bgcolor,
        margin: "2px",
        marginLeft: `${props.indentLevel * indentPx}px`
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
    >Drive {label} ({folderInfo.contents.defaultOrder.length})</div>
    if (props.rootCollapsible){
      folder = <div
        data-doenet-browserid={props.browserId}
        tabIndex={0}
        className="noselect nooutline" 
        style={{
          cursor: "pointer",
          width: "300px",
          padding: "4px",
          border: "1px solid black",
          backgroundColor: bgcolor,
          margin: "2px",
          marginLeft: `${props.indentLevel * indentPx}px`
        }}
      > {openCloseButton} Drive {label} ({folderInfo.contents.defaultOrder.length})</div>
    }
  }

  if (isOpen || (props.driveObj && !props.rootCollapsible)){
    let dictionary = folderInfo.contents.contentsDictionary;
    items = [];
    let itemIds = [];
    for (let itemId of folderInfo.contents.defaultOrder){

      itemIds.push(itemId);
      let item = dictionary[itemId];
      switch(item.itemType){
        case "Folder":
        items.push(<Folder 
          key={`item${itemId}${props.browserId}`} 
          driveId={props.driveId} 
          folderId={item.itemId} 
          indentLevel={props.indentLevel+1}  
          browserId={props.browserId}
          route={props.route}
          isNav={props.isNav}
          urlClickBehavior={props.urlClickBehavior}
          pathItemId={props.pathItemId}

          />)
        break;
        case "Url":
          items.push(<Url 
            key={`item${itemId}${props.browserId}`} 
            driveId={props.driveId} 
            item={item} 
            indentLevel={props.indentLevel+1}  
            browserId={props.browserId}
            route={props.route}
            isNav={props.isNav} 
            urlClickBehavior={props.urlClickBehavior}
            pathItemId={props.pathItemId}
          />)
        break;
        case "DoenetML":
          items.push(<DoenetML 
            key={`item${itemId}${props.browserId}`} 
            driveId={props.driveId} 
            item={item} 
            indentLevel={props.indentLevel+1}  
            browserId={props.browserId}
            route={props.route}
            isNav={props.isNav} 
            pathItemId={props.pathItemId}
            />)
        break;
        default:
        console.warn(`Item not rendered of type ${item.itemType}`)
      }
 
    }
    if (props.driveObj){
      //Inital Items
      setVisibleItems((old)=>{let newItems = [...old,...itemIds]; return newItems;})
    }

    if (folderInfo.contents.defaultOrder.length === 0){
      items.push(<EmptyNode key={`emptyitem${folderInfo?.contents?.folderInfo?.itemId}`}/>)
    }
  }
  return <>
  {folder}
  {items}
  </>
}

const EmptyNode =  React.memo(function Node(props){

  return (<div style={{
    width: "300px",
    padding: "4px",
    border: "1px solid black",
    backgroundColor: "white",
    margin: "2px",
  
  }} ><div className="noselect" style={{ textAlign: "center" }} >EMPTY</div></div>)
})

function LogVisible(props){
  // const visibleItems = useRecoilValue(visibleDriveItems(props.browserId));
  // console.log(">>>>visibleItems",visibleItems)
  const globalSelected = useRecoilValue(globalSelectedNodesAtom);
  console.log(">>>>globalSelected",globalSelected)
  return null;
}

const visibleDriveItems = atomFamily({
  key:"visibleDriveItems",
  default:[]
})

const selectedDriveItemsAtom = atomFamily({
  key:"selectedDriveItemsAtom",
  default:false
})

const selectedDriveItems = selectorFamily({
  key:"selectedDriveItems",
  // get:(driveIdBrowserIdItemId) =>({get})=>{ 
  //   return get(selectedDriveItemsAtom(driveIdBrowserIdItemId));
  // },
  set:(driveIdBrowserIdItemId) => ({get,set},instruction)=>{
    const globalSelected = get(globalSelectedNodesAtom);
    const isSelected = get(selectedDriveItemsAtom(driveIdBrowserIdItemId))
    const visibleItems = get(visibleDriveItems(driveIdBrowserIdItemId.browserId))
    
    switch (instruction) {
      case "one item":
        if (!isSelected){
          for (let itemObj of globalSelected){
            set(selectedDriveItemsAtom(itemObj),false)
          }
          set(selectedDriveItemsAtom(driveIdBrowserIdItemId),true)
          set(globalSelectedNodesAtom,[driveIdBrowserIdItemId])
        }
        break;
        case "add item":
        if (isSelected){
          set(selectedDriveItemsAtom(driveIdBrowserIdItemId),false)
          let newGlobalSelected = [...globalSelected];
          const index = newGlobalSelected.indexOf(driveIdBrowserIdItemId)
          newGlobalSelected.splice(index,1)
          set(globalSelectedNodesAtom,newGlobalSelected);
        }else{
          set(selectedDriveItemsAtom(driveIdBrowserIdItemId),true)
          set(globalSelectedNodesAtom,[...globalSelected,driveIdBrowserIdItemId])
        }
        case "range to item":
          console.log(">>>range to item",visibleItems,globalSelected)
          //No previous items selected so just select this one
          if (globalSelected.length === 0){
            set(selectedDriveItemsAtom(driveIdBrowserIdItemId),true)
            set(globalSelectedNodesAtom,[driveIdBrowserIdItemId])
          }else{
            //Set select on all items in range
            let lastSelectedItem = globalSelected[globalSelected.length-1];
            const indexOfLastSelected = visibleItems.indexOf(lastSelectedItem.itemId)
            const indexOfCurrentItem = visibleItems.indexOf(driveIdBrowserIdItemId.itemId)
            let minIndex = Math.min(indexOfLastSelected,indexOfCurrentItem);
            let maxIndex = Math.max(indexOfLastSelected,indexOfCurrentItem);
            let componentsToSelect = []
            for (let i = minIndex; i <= maxIndex; i++){
              let itemId = visibleItems[i];
              let item = {...driveIdBrowserIdItemId}
              item.itemId = itemId;
              if (!get(selectedDriveItemsAtom(item))){
                set(selectedDriveItemsAtom(item),true)
                componentsToSelect.push(item);
              }
            }
            //Sort componentsToSelect if needed so current item is last
            if (indexOfLastSelected > indexOfCurrentItem){
              componentsToSelect.reverse();
            }
            set(globalSelectedNodesAtom,[...globalSelected,...componentsToSelect])
            
          }
        break;
        case "clear all":
          //TODO: Only clear this browser?
          for (let itemObj of globalSelected){
            set(selectedDriveItemsAtom(itemObj),false)
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
  console.log(`=== 📜 DoenetML`)
  // console.log(">>>DoenetML",props)

  const history = useHistory();
  const setSelected = useSetRecoilState(selectedDriveItems({driveId:props.driveId,browserId:props.browserId,itemId:props.item.itemId})); 
  const isSelected = useRecoilValue(selectedDriveItemsAtom({driveId:props.driveId,browserId:props.browserId,itemId:props.item.itemId})); 
  // console.log(">>>>isSelected",isSelected,props.item.itemId)

  const indentPx = 20;
  let bgcolor = "#e2e2e2";
  if (isSelected || (props.isNav && props.item.itemId === props.pathItemId)) { bgcolor = "#6de5ff"; }
  if (props.appearance === "dropperview") { bgcolor = "#53ff47"; }
  if (props.appearance === "dragged") { bgcolor = "#f3ff35"; }  

  return <div
      data-doenet-browserid={props.browserId}
      tabIndex={0}
      className="noselect nooutline" 
      style={{
        cursor: "pointer",
        width: "300px",
        padding: "4px",
        border: "1px solid black",
        backgroundColor: bgcolor,
        margin: "2px",
      }}
      onClick={(e)=>{
        
        if (props.isNav){
          //Only select one item
          let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
          let newParams = {...urlParamsObj} 
          newParams['path'] = `${props.driveId}:${props.item.parentFolderId}:${props.item.itemId}:DoenetML`
          history.push('?'+encodeParams(newParams))
          // setSelected("one item")
        }else{
          if (!e.shiftKey && !e.metaKey){
            setSelected("one item")
          }else if (e.shiftKey && !e.metaKey){
            setSelected("range to item")
          }else if (!e.shiftKey && e.metaKey){
            setSelected("add item")
          }
        }
       
      }}
      onBlur={(e) => {
        //Don't clear on navigation changes
        if (!props.isNav){
        //Only clear if focus goes outside of this node group
          if (e.relatedTarget === null ||
            (e.relatedTarget.dataset.doenetBrowserid !== props.browserId &&
            !e.relatedTarget.dataset.doenetBrowserStayselected)
            ){
              setSelected("clear all")
          }
        }
      }}
      ><div 
      className="noselect" 
      style={{
        marginLeft: `${props.indentLevel * indentPx}px`
      }}>
    DoenetML {props.item?.label}</div></div>

  })

const Url = React.memo((props)=>{
  console.log(`=== 🔗 Url`)
  // console.log(">>>url",props)

  const history = useHistory();
  const setSelected = useSetRecoilState(selectedDriveItems({driveId:props.driveId,browserId:props.browserId,itemId:props.item.itemId})); 
  const isSelected = useRecoilValue(selectedDriveItemsAtom({driveId:props.driveId,browserId:props.browserId,itemId:props.item.itemId})); 
  // console.log(">>>>isSelected",isSelected,props.item.itemId)

  const indentPx = 20;
  let bgcolor = "#e2e2e2";
  if (isSelected || (props.isNav && props.item.itemId === props.pathItemId)) { bgcolor = "#6de5ff"; }
  if (props.appearance === "dropperview") { bgcolor = "#53ff47"; }
  if (props.appearance === "dragged") { bgcolor = "#f3ff35"; }  

  return <div
      data-doenet-browserid={props.browserId}
      tabIndex={0}
      className="noselect nooutline" 
      style={{
        cursor: "pointer",
        width: "300px",
        padding: "4px",
        border: "1px solid black",
        backgroundColor: bgcolor,
        margin: "2px",
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
              setSelected("one item")
            }else if (e.shiftKey && !e.metaKey){
              setSelected("range to item")
            }else if (!e.shiftKey && e.metaKey){
              setSelected("add item")
            }
          }
        }else{
          // let linkTo = props.item?.url; //Enable this when add URL is completed
          // location.href = linkTo; 
          location.href = "http://doenet.org"; 
        }
      }}
      onBlur={(e) => {
        //Don't clear on navigation changes
        if (!props.isNav){
        //Only clear if focus goes outside of this node group
          if (e.relatedTarget === null ||
            (e.relatedTarget.dataset.doenetBrowserid !== props.browserId &&
            !e.relatedTarget.dataset.doenetBrowserStayselected)
            ){
              setSelected("clear all")
          }
        }
      }}
      ><div 
      className="noselect" 
      style={{
        marginLeft: `${props.indentLevel * indentPx}px`
      }}>
    Url {props.item?.label}</div></div>

  })