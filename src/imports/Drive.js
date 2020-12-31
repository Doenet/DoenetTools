import React, {useContext, useState, useCallback, useRef, useEffect} from 'react';
import { IsNavContext } from './Tool/NavPanel'
import {
  useQuery,
  useQueryCache,
  useMutation,
  useInfiniteQuery,
} from 'react-query'
import axios from "axios";
import nanoid from 'nanoid';
import './util.css';


import {
  DropTargetsProvider,
  DropTargetsContext,
  WithDropTarget  
} from '../imports/DropTarget';
import Draggable from '../imports/Draggable';

import {
  atom,
  useSetRecoilState
} from 'recoil';

const sortOptions = Object.freeze({
  "LABEL_ASC": "label ascending",
  "LABEL_DESC": "label descending",
  "CREATION_DATE_ASC": "creation date ascending",
  "CREATION_DATE_DESC": "creation date descending"
});
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";

export const globalSelectedNodesAtom = atom({
  key:'globalSelectedNodesAtom',
  default:[]
})

export default function Drive(props){
  const isNav = useContext(IsNavContext);
  console.log("=== Drive")

  const fetchDrives = async ()=>{
    const { data } = await axios.get(
      `/api/loadAvailableDrives.php`
    );
    return data.driveIdsAndLabels;
  }

  const { data:driveData , isFetching } = useQuery("availableDrives",fetchDrives,{
    refetchOnWindowFocus: false,
      refetchOnMount:false,
      staleTime:600000,
  });
  if (isFetching){ return null;}

  if (props.types){
    let drives = [];
    for (let type of props.types){
      for (let driveObj of driveData){
        if (driveObj.type === type){
          drives.push(
          <React.Fragment key={`drive${driveObj.driveId}${isNav}`} ><Router ><Switch>
           <Route path="/" render={(routeprops)=>
           <Browser route={{...routeprops}} driveId={driveObj.driveId} label={driveObj.label} isNav={isNav} />
           }></Route>
         </Switch></Router></React.Fragment>)
          // drives.push(<Browser key={`browser${driveObj.driveId}nav`} drive={driveObj.driveId} label={driveObj.label} isNav={true} DnDState={DnDState}/>)
        }
      }
    }
    return <>{drives}</>
  }else if (props.id){
    for (let driveObj of driveData){
        if (driveObj.driveId === props.id){
         return <Router><Switch>
           <Route path="/" render={(routeprops)=>
           <Browser route={{...routeprops}} driveId={driveObj.driveId} label={driveObj.label} isNav={isNav} />
           }></Route>
         </Switch></Router>
        }
    }
    console.warn("Don't have a drive with id ",props.id)
    return null;
  }else{
    console.warn("Drive needs types or id defined.")
    return null;
  }
}

const fetchChildrenNodes = async (queryKey,driveId,parentId) => {

  if (!parentId){
    const { data } = await axios.get(
      `/api/loadFolderContent.php?parentId=${driveId}&driveId=${driveId}&init=true`
    );
    return {init:true,data}
  } //First Query returns no data

  const { data } = await axios.get(
    `/api/loadFolderContent.php?parentId=${parentId}&driveId=${driveId}`
  );
  //TODO: Handle fail
  return data.results;
}

const deleteItemMutation = async ({driveId, parentId, itemId}) =>{
  const pdata = {driveId,parentId,itemId}
    const payload = {
      params: pdata
    }

  const { data } = await axios.get("/api/deleteItem.php", payload)
  if (!data.success){ 
    throw Error("Can't Delete Items!");
   }
  return {driveId,parentId,itemId,results:data?.results}
} 

function Browser(props){
  console.log(`=== Browser '${props.driveId}' isNav='${props.isNav}'`)
  let pathFolderId = props.driveId; //default 
  let pathDriveId = props.driveId; //default
  let routePathDriveId = "";
  let routePathFolderId = "";  
  let itemId = "";  
  let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
  //use defaults if not defined
  if (urlParamsObj?.path !== undefined){
    [routePathDriveId,routePathFolderId,itemId] = urlParamsObj.path.split(":");
    if (routePathDriveId !== ""){pathDriveId = routePathDriveId;}
    if (routePathFolderId !== ""){pathFolderId = routePathFolderId;}
  }
  //If navigation then build from root else build from path
  let rootFolderId = pathFolderId;
  if(props.isNav){
    rootFolderId = props.driveId;
  }

  
  const [sortingOrder, setSortingOrder] = useState("alphabetical label ascending")
  const [driveIsOpen,setDriveIsOpen] = useState(props.driveIdIsOpen?props.driveIdIsOpen:true); //default to open
  const [openNodesObj,setOpenNodesObj] = useState({});
  const [selectedNodes,setSelectedNodes] = useState({});
  // const { DnDState, DnDActions } = props.DnDState;

  let setGlobalSelectedNodes = useSetRecoilState(globalSelectedNodesAtom);

  const {
    data,
    isFetching, 
    isFetchingMore, 
    fetchMore, 
    error} = useInfiniteQuery(['nodes',props.driveId], fetchChildrenNodes, {
      refetchOnWindowFocus: false,
      refetchOnMount:false,
      staleTime:600000,
      onSuccess: (data) => {
        if (Object.keys(data[0])[0] === "init"){
          let folderChildrenIds = {};
          let nodeObjs = {};
          
          for (let row of data[0].data.results){
            if (!folderChildrenIds[row.parentId]){folderChildrenIds[row.parentId] = {defaultOrder:[]}}
            if (row.type === "Folder" && !folderChildrenIds[row.id]){folderChildrenIds[row.id] = {defaultOrder:[]}}
            folderChildrenIds[row.parentId].defaultOrder.push(row.id);
            nodeObjs[row.id] = {
              id:row.id,
              label:row.label,
              parentId:row.parentId,
              creationDate:row.creationDate,
              type:row.type,
            }
          }

          data[0] = {folderChildrenIds,nodeObjs,perms:data[0].data.perms}
        }else if (data[1]){
          let actionOrId = Object.keys(data[1])[0];
          if (actionOrId === "add"){
            let parentId = data[1].add.parentId;
            let nodeId = data[1].add.id;
            if (data[0].folderChildrenIds[parentId]){
              //Append children and don't add if we haven't loaded the other items
              //TODO: handle if data[0].folderChildrenIds[parentId].defaultOrder exists first
              data[0].folderChildrenIds[parentId].defaultOrder.push(nodeId);
              data[0].nodeObjs[nodeId] = {
                id:data[1].add.id,
                parentId:data[1].add.parentId,
                label:data[1].add.label,
                creationDate:data[1].add.creationDate,
                type:data[1].add.type,
              }
            }
            data.pop();   
          }else if (actionOrId === "addArr"){
            
            for (let nodeObj of data[1].addArr){
              let dParentId = nodeObj.destinationParentId;
              delete nodeObj.destinationParentId;
              let nodeId = nodeObj.id;
              let destArr = data[0].folderChildrenIds?.[dParentId]?.defaultOrder
              if (destArr){
                destArr.push(nodeId);
              }
              nodeObj.parentId = dParentId;
              data[0].nodeObjs[nodeId] = nodeObj;
            }
              data.splice(1,1); 

          }else if (actionOrId === "delete"){
            console.log(">>>HERE!!")
            let parentId = data[1].delete.parentId;
            let nodeId = data[1].delete.itemId;
            let childrenIds = data[0].folderChildrenIds[parentId].defaultOrder;
            childrenIds.splice(childrenIds.indexOf(nodeId),1);
            // delete data[0].nodeObjs[nodeId]; //Keep for undo?
            data.pop();    
          }else if (actionOrId === "deleteArr"){
            
            for (let nodeInfo of data[1].deleteArr){
              const nodeId = nodeInfo.nodeId;
              const parentId = nodeInfo.parentId;

              let childrenIds = data[0].folderChildrenIds[parentId].defaultOrder;
              childrenIds.splice(childrenIds.indexOf(nodeId),1);
            }
            data.splice(1,1); 
          }else if (actionOrId === "move"){
            let dParentId = data[1].move.destinationParentId;
            for (let nodeObj of data[1].move.nodeIds){
              let nodeId = nodeObj.nodeId;
              //update parentIds in nodeObjs
              data[0].nodeObjs[nodeId].parentId = dParentId;
              //add to destination
              let destArr = data[0].folderChildrenIds?.[dParentId]?.defaultOrder;
              //Only add if it exists
              if (destArr){
                destArr.push(nodeId);
              }
              //remove from source
              let sParentArr = data[0].folderChildrenIds?.[nodeObj.parentId]?.defaultOrder;
              //Only remove if it exists
              if (sParentArr){
                sParentArr.splice(sParentArr.indexOf(nodeId),1);
              }
            }
            data.pop();    
          } else if (actionOrId === "sort") {
            const { itemId, sortKey } = data[1].sort;
            
            const itemObj = { ...data[0].nodeObjs[itemId] };
            const defaultFolderChildrenIds = [...data[0].folderChildrenIds?.[itemId]?.defaultOrder];
            
            // sort itemId child array
            const sortedFolderChildrenIds = sortItems({sortKey, nodeObjs: data[0].nodeObjs, defaultFolderChildrenIds});

            // modify itemId sortBy            
            itemObj.sortBy = sortKey;

            // update itemId data
            data[0].nodeObjs[itemId] = itemObj;
            data[0].folderChildrenIds[itemId][sortKey] = sortedFolderChildrenIds;
            console.log(">>>", data[0])

            data.pop();
          }else{
            //handle fetchMore
            for (let cNodeId of Object.keys(data[1])){
              let contentIds = [];
              for (let gcNodeId of Object.keys(data[1][cNodeId])){
                let nodeObj = data[1][cNodeId][gcNodeId];
                // if (nodeObj === undefined){nodeObj = {}}
                contentIds.push(gcNodeId);
                data[0].nodeObjs[gcNodeId] = nodeObj;
              }
              data[0].folderChildrenIds[cNodeId] = {defaultOrder:contentIds};
            }
            data.pop();
          }
        }
     
      //   props.driveIdSync.update(props.driveId,nodeIdToDataIndex.current,nodeIdToChildren.current)
      // }
        
        
      },
      getFetchMore: (lastGroup, allGroups) => {
        return lastGroup.nextCursor;
    }})

    const [deleteItem] = useMutation(deleteItemMutation,{
      onMutate:(obj)=>{
        console.log("HERE>>> obj",obj)
        cache.setQueryData(["nodes",obj.driveId],
        (old)=>{
          old.push({delete:{
            parentId:obj.parentId,
            itemId:obj.itemId
          }}); //Flag information about delete
          return old
        })
      },
      onSuccess:(obj)=>{
      
    },onError:(errMsg,obj)=>{
      

      console.warn(errMsg);
      cache.setQueryData(["nodes",obj.driveId],
      (old)=>{
      console.log(JSON.parse(JSON.stringify(old)));

        let creationDate = old[0].nodeObjs[obj.itemId].creationDate;
      //Provide infinitequery with what we know of the new addition
      old.push({
        add:{
          driveId:obj.driveId,
          id:obj.itemId,
          label:obj.label,
          parentId:obj.parentId,
          type:obj.type,
          creationDate:creationDate,
        }
      })
      return old
      })
    }});

    const sortHandler = ({ sortKey, driveId, itemId }) => {
      // insert sort action object
      cache.setQueryData(["nodes", driveId],
        (old)=>{
          old.push({
            sort: {
              sortKey: sortKey,
              itemId: itemId
          }});
          return old
        }
      );
    };
    
  const sortItems = useCallback(({ sortKey, nodeObjs, defaultFolderChildrenIds }) => {
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
  }, []);
 
  let nodeIdRefArray = useRef([])
  let lastSelectedNodeIdRef = useRef("")
  let browserId = useRef("");
  
  const cache = useQueryCache();
  let history = useHistory();

  const handleFolderToggle = useCallback((nodeId)=>{
    setOpenNodesObj((old)=>{
      let newObj = {...old};
      if (newObj[nodeId]){
        delete newObj[nodeId];
      }else{
        newObj[nodeId] = true;
      }
      return newObj;
    })
  },[])

  const updateToolWithSelection = useCallback((nodeIdObj)=>{
      //{driveId:"id",selectedArr:[{parentId:"id",nodeId:"id",type:"folder"}]}
    let data = cache.getQueryData(["nodes",props.driveId]);
    let selectedArr = [];
      for (let nodeId of Object.keys(nodeIdObj)){
        let obj = data[0].nodeObjs[nodeId];
        let parentId = obj.parentId;
        selectedArr.push({parentId,nodeId,type:obj.type})
      }
      setGlobalSelectedNodes(selectedArr);
},[])

  let encodeParams = p => 
  Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&");

  const handleClickNode = useCallback(({ nodeId, parentId, type, shiftKey, metaKey})=>{
    if (props.isNav){
      if (type === 'Folder'){
        let newParams = {...urlParamsObj} 
        newParams['path'] = `${props.driveId}:${nodeId}:${nodeId}:Folder`
        history.push('?'+encodeParams(newParams))
        // history.push(`?path=${props.driveId}:${nodeId}:${nodeId}:Folder`)
      }else if(type === 'Url'){
        console.log('>>>url nodeId',nodeId)
        //TODO: meta data contains url info
        location.href = 'http://doenet.org'; //TODO: Replace with actual URL
        // history.push('doenet.org') 
      }else{
        //TODO: handle other types
        //TODO: maintain other parameters
        let newParams = {...urlParamsObj} 
        newParams['path'] = `${props.driveId}:${parentId}:${nodeId}:${type}`
        history.push('?'+encodeParams(newParams))
        // history.push(`?path=${props.driveId}:${parentId}:${nodeId}:${type}`)

      }
      
    }else{
    
      if (!shiftKey && !metaKey){
        //Only select this node
        setSelectedNodes((old)=>{
          let newObj; 
          //if already selected then leave selections the way they are
          //else only select the current node
          if (old[nodeId]){
            newObj = {...old};
          }else{
            newObj = {};
            newObj[nodeId] = true;
          }
          lastSelectedNodeIdRef.current = nodeId;
          updateToolWithSelection(newObj)
          return newObj;
        })

      }else if (shiftKey && !metaKey){
        //Add selection to range including the end points 
        //of last selected to current nodeid      
        let indexOfLastSelected = 0;
        if (lastSelectedNodeIdRef.current !== ""){
          indexOfLastSelected = nodeIdRefArray.current.indexOf(lastSelectedNodeIdRef.current) 
        }
        let indexOfNode = nodeIdRefArray.current.indexOf(nodeId);
        let startIndex = Math.min(indexOfNode,indexOfLastSelected);
        let endIndex = Math.max(indexOfNode,indexOfLastSelected);
        
        setSelectedNodes((old)=>{
          let newObj = {...old};
          for (let i = startIndex; i <= endIndex;i++){
            newObj[nodeIdRefArray.current[i]] = true;
          }
          updateToolWithSelection(newObj)
          return newObj;
        })
      }else if (!shiftKey && metaKey){
        //Toggle select on this node
        setSelectedNodes((old)=>{
          let newObj = {...old};
          if (newObj[nodeId]){
            delete newObj[nodeId];
          }else{
            newObj[nodeId] = true;
            lastSelectedNodeIdRef.current = nodeId;
        }
          updateToolWithSelection(newObj)
          return newObj;
        })
      }
 
      
    }

    
  },[])

  const handleDeselectAll = useCallback(()=>{
    setSelectedNodes({})
    setGlobalSelectedNodes([])

  },[])

  const deleteItemHandler = useCallback((nodeId)=>{
    deleteItem(nodeId);
  },[]);

  if (browserId.current === ""){ browserId.current = nanoid();}

  useEffect(()=>{
    if (props.regClearSelection){
      props.regClearSelection(browserId.current,handleDeselectAll);
    }
  },[])
 
  // //------------------------------------------
  // //****** End of use functions  ***********
  // //------------------------------------------


  
    //Only show non navigation when drive matches route
  if (!props.isNav && routePathDriveId !== props.driveId){ return null;}
  


  // if (isFetching){ return <div>Loading...</div>}

  function renderDragGhost(element) {
    const dragGhostId = `drag-ghost-${props.driveId}`;
    const numItems = Object.keys(selectedNodes).length;
    
    return <DragGhost id={dragGhostId} numItems={numItems} element={element} />;
  }
  

  function buildNodes({driveId,parentId,sortingOrder,nodesJSX=[],nodeIdArray=[],level=0}){

    const childrenIdsOrder = data[0]?.nodeObjs?.[parentId]?.sortBy ?? "defaultOrder";
    let childrenIdsArr = data[0]?.folderChildrenIds?.[parentId]?.[childrenIdsOrder];

    if (childrenIdsArr === undefined){
      //Need data
      nodesJSX.push(<LoadingNode key={`loading${nodeIdArray.length}`}/>);
      console.log(" 🐕 fetchMore",parentId)
      fetchMore(parentId);
    }else{
      if (childrenIdsArr.length === 0){nodesJSX.push(<EmptyNode key={`empty${nodeIdArray.length}`}/>)}

      for(let nodeId of childrenIdsArr){
        //If folder we need to know how many child nodes it has
        let grandChildrenIdsArr = data[0]?.folderChildrenIds?.[nodeId]?.defaultOrder;
        let grandChildObjType = data[0]?.nodeObjs?.[nodeId]?.type;
        let numChildren = "?";
        if (grandChildrenIdsArr === undefined ){
          //Only need numChildren if it's a folder
          if (grandChildObjType === "Folder"){
            //Need data
            console.log(" 🐕 fetchMore grandChild",nodeId)
            fetchMore(nodeId);
          }
          
        }else{
          numChildren = grandChildrenIdsArr.length;
        }
          nodeIdArray.push(nodeId); //needed to calculate shift click selections
          let nodeObj = data[0].nodeObjs[nodeId];
          let isOpen = false;
          if (openNodesObj[nodeId]){ isOpen = true;}
          
          let appearance = "default";
          let draggableClassName = "hvr-shutter-in-horizontal";
          // if (DnDState.isDragging && selectedNodes[nodeId]) {
          //   appearance = "dragged";
          //   draggableClassName = "";
          // } else 

          //if we are a navigation browser
          //Only select the current path folder or the item
          if (props.isNav && itemId === nodeId && pathDriveId === props.driveId){
            appearance = "selected";
          }else if (props.isNav && itemId === "" && pathFolderId === nodeId && pathDriveId === props.driveId){
            appearance = "selected";
          } else if (selectedNodes[nodeId]){ 
            appearance = "selected";
          } 
          // else if (DnDState.activeDropTargetId === nodeId) {
          //   appearance = "dropperview";
          // }

          let nodeJSX = <Node 
            key={`node${browserId.current}${nodeId}`} 
            label={nodeObj.label}
            browserId={browserId.current}
            nodeId={nodeId}
            driveId={props.driveId}
            parentId={parentId}
            type={nodeObj.type}
            appearance={appearance}
            isOpen={isOpen} 
            numChildren={numChildren}
            level={level}
            handleFolderToggle={handleFolderToggle} 
            deleteItemHandler={deleteItemHandler}
            sortHandler={sortHandler}
            handleClickNode={handleClickNode}
            handleDeselectAll={handleDeselectAll}
            level={level}/>;
          
          // navigation items not draggable
          // if (!props.isNav) {
          //   nodeJSX = <Draggable
          //     key={`dnode${browserId.current}${nodeId}`} 
          //     id={nodeId}
          //     className={draggableClassName}
          //     onDragStart={() => DnDActions.onDragStart({ nodeId, driveId:props.driveId })}
          //     onDrag={DnDActions.onDrag}
          //     onDragEnd={DnDActions.onDragEnd}
          //     ghostElement={renderDragGhost(nodeJSX)}
          //   >
          //    { nodeJSX } 
          //   </Draggable>
          // }
                    
          // if (nodeObj?.type === "Folder") {
          //   nodeJSX = <WithDropTarget
          //     key={`wdtnode${browserId.current}${nodeId}`} 
          //     id={nodeId}
          //     registerDropTarget={DnDActions.registerDropTarget} 
          //     unregisterDropTarget={DnDActions.unregisterDropTarget}
          //     dropCallbacks={{
          //       onDragOver: () => DnDActions.onDragOverContainer({ id: nodeId, driveId: props.driveId }),
          //       onDrop: () => {}
          //     }}
          //   >
          //     { nodeJSX } 
          //   </WithDropTarget>
          // }
  
          nodesJSX.push(nodeJSX);

          if (isOpen){
            buildNodes({driveId,parentId:nodeId,sortingOrder,nodesJSX,nodeIdArray,level:level+1})
          }
        
        
      }
    }
    return [nodesJSX,nodeIdArray];
  }

  let nodes = <></>
  let nodeIdArray = [];
  if (data && driveIsOpen){
    [nodes,nodeIdArray] = buildNodes({driveId:props.driveId,parentId:rootFolderId,sortingOrder});
    nodeIdRefArray.current = nodeIdArray;
  }
  
  let buttonText = "Close"
  if (!driveIsOpen){
    buttonText = "Open"
    nodes = null;
  }
  let driveToggleDiv = null;
  if (props.isNav){
    //***** DRIVE ICON
    let driveColor = "white";
    if (routePathFolderId === props.driveId && itemId === ""){ driveColor = "#6de5ff"} //If drive selected
    driveToggleDiv = <div 
      tabIndex={0}
      className="noselect nooutline" 
      
      onDoubleClick={(e) => {
        setDriveIsOpen((bool)=>!bool);
      }} 
      onClick={()=>{
        let newParams = {...urlParamsObj} 
        newParams['path'] = `${props.driveId}:${props.driveId}::`
        history.push('?'+encodeParams(newParams))
        // history.push(`?path=${props.driveId}:${props.driveId}::`)
      }}
    style={{
      width: "300px",
      padding: "4px",
      backgroundColor: driveColor,
      margin: "2px"
    }} ><div className="noselect"  ><button onClick={()=>setDriveIsOpen(old=>!old)}>{buttonText}</button> {props.label}</div></div>
  }

  return <>
  <div style={{marginTop:"1em",marginBottom:"1em"}}>
  {driveToggleDiv}     
  {nodes}
  
  </div>
  </>
}



const EmptyNode =  React.memo(function Node(props){
  return (<div style={{
    width: "300px",
    padding: "4px",
    border: "1px solid black",
    backgroundColor: "white",
    margin: "2px"
  }} ><div className="noselect" style={{ textAlign: "center" }} >EMPTY</div></div>)
})

const LoadingNode =  React.memo(function Node(props){
  return (<div style={{
    width: "300px",
    padding: "4px",
    border: "1px solid black",
    backgroundColor: "white",
    margin: "2px"
  }} ><div className="noselect" style={{ textAlign: "center" }} >LOADING...</div></div>)
})


// const Node = function Node(props){
  const Node = React.memo(function Node(props){
  console.log(`=== 📁${props.label}`)
  // console.log(props)

  // console.log(`=== NODE='${props.nodeId}' parentId='${props.parentId}'`)

  const indentPx = 20;
  let bgcolor = "#e2e2e2";
  if (props.appearance === "selected") { bgcolor = "#6de5ff"; }
  if (props.appearance === "dropperview") { bgcolor = "#53ff47"; }
  if (props.appearance === "dragged") { bgcolor = "#f3ff35"; }  

  //Toggle
  let openOrClose = "Open";
  if (props.isOpen){ openOrClose = "Close"}
  const toggle = <button 
  data-doenet-browserid={props.browserId}
  tabIndex={0}
  onMouseDown={e=>{ e.preventDefault(); e.stopPropagation(); }}
  onDoubleClick={e=>{ e.preventDefault(); e.stopPropagation(); }}
  onClick={(e)=>{
    e.preventDefault();
    e.stopPropagation();
    props.handleFolderToggle(props.nodeId);
  }}>{openOrClose}</button>

  //Delete
  const deleteNode = <button
  data-doenet-browserid={props.browserId}
  tabIndex={-1}
  onClick={(e)=>{
    e.preventDefault();
    e.stopPropagation();
    props.deleteItemHandler({driveId:props.driveId,parentId:props.parentId,label:props.label,itemId:props.nodeId,type:props.type})
  }}
  onMouseDown={e=>{ e.preventDefault(); e.stopPropagation(); }}
  onDoubleClick={e=>{ e.preventDefault(); e.stopPropagation(); }}
  >X</button>

  const sortNodeButtonFactory = ({ buttonLabel, sortKey }) => {
    return <button
    data-doenet-browserid={props.browserId}
    tabIndex={-1}
    onClick={(e)=>{
      e.preventDefault();
      e.stopPropagation();
      props.sortHandler({driveId: props.driveId, sortKey: sortKey, itemId: props.nodeId});
    }}
    onMouseDown={e=>{ e.preventDefault(); e.stopPropagation(); }}
    onDoubleClick={e=>{ e.preventDefault(); e.stopPropagation(); }}
    >{ buttonLabel }</button>;
  }

  if (props.type === "Folder"){
    return <>
    <div
      data-doenet-browserid={props.browserId}
      tabIndex={0}
      className="noselect nooutline" 
      onMouseDown={(e) => {
        // onClick={(e) => {
        props.handleClickNode({ nodeId:props.nodeId, parentId:props.parentId, type:props.type, shiftKey: e.shiftKey, metaKey: e.metaKey })
      }} 
      onDoubleClick={(e) => {
        props.handleFolderToggle(props.nodeId)
      }} 
      onBlur={(e) => {
        //Only clear if focus goes outside of this node group
         if (e.relatedTarget === null ||
          (e.relatedTarget.dataset.doenetBrowserid !== props.browserId &&
          !e.relatedTarget.dataset.doenetBrowserStayselected)
          ){
        props.handleDeselectAll();
        }
      }}
  
    style={{
        cursor: "pointer",
        width: "300px",
        padding: "4px",
        border: "1px solid black",
        backgroundColor: bgcolor,
        margin: "2px"
      }} ><div 
      className="noselect" 
      style={{
        marginLeft: `${props.level * indentPx}px`
      }}>{toggle} [F] {props.label} ({props.numChildren}) {deleteNode} 
      {sortNodeButtonFactory({buttonLabel: "Sort Label ASC", sortKey: sortOptions.LABEL_ASC})} 
      {sortNodeButtonFactory({buttonLabel: "Sort Label DESC", sortKey: sortOptions.LABEL_DESC})} 
      {sortNodeButtonFactory({buttonLabel: "Sort Date ASC", sortKey: sortOptions.CREATION_DATE_ASC})} 
      {sortNodeButtonFactory({buttonLabel: "Sort Date DESC", sortKey: sortOptions.CREATION_DATE_DESC})} 
      </div></div>
    
    </>
  }else if (props.type === "DoenetML"){
    return <>
    <div
      data-doenet-browserid={props.browserId}
      tabIndex={0}
      className="noselect nooutline" 
      onMouseDown={(e) => {
        // onClick={(e) => {
        props.handleClickNode({ nodeId:props.nodeId, parentId:props.parentId, type:props.type, shiftKey: e.shiftKey, metaKey: e.metaKey })
      }} 
      onBlur={(e) => {
        //Only clear if focus goes outside of this node group
         if (e.relatedTarget === null ||
          (e.relatedTarget.dataset.doenetBrowserid !== props.browserId &&
          !e.relatedTarget.dataset.doenetBrowserStayselected)
          ){
        props.handleDeselectAll();
        }
      }}
  
    style={{
        cursor: "pointer",
        width: "300px",
        padding: "4px",
        border: "1px solid black",
        backgroundColor: bgcolor,
        margin: "2px"
      }} ><div 
      className="noselect" 
      style={{
        marginLeft: `${props.level * indentPx}px`
      }}>[U] {props.label} {deleteNode}</div></div>
    
    </>
    }else if (props.type === "Url"){
      return <>
      <div
        data-doenet-browserid={props.browserId}
        tabIndex={0}
        className="noselect nooutline" 
        onMouseDown={(e) => {
          // onClick={(e) => {
          props.handleClickNode({ nodeId:props.nodeId, parentId:props.parentId, type:props.type, shiftKey: e.shiftKey, metaKey: e.metaKey })
        }} 
        onBlur={(e) => {
          //Only clear if focus goes outside of this node group
           if (e.relatedTarget === null ||
            (e.relatedTarget.dataset.doenetBrowserid !== props.browserId &&
            !e.relatedTarget.dataset.doenetBrowserStayselected)
            ){
          props.handleDeselectAll();
          }
        }}
    
      style={{
          cursor: "pointer",
          width: "300px",
          padding: "4px",
          border: "1px solid black",
          backgroundColor: bgcolor,
          margin: "2px"
        }} ><div 
        className="noselect" 
        style={{
          marginLeft: `${props.level * indentPx}px`
        }}>[D] {props.label} {deleteNode}</div></div>
      
      </>
  }else{
    return <div>{props.type} not available </div>
  }
  
// }
})

const DragGhost = ({ id, element, numItems }) => {

  const containerStyle = {
    transform: "rotate(-5deg)",
    zIndex: "10"
  }

  const singleItemStyle = {
    boxShadow: 'rgba(0, 0, 0, 0.20) 5px 5px 3px 3px',
    borderRadius: '4px',
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
