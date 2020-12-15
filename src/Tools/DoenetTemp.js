import React, {useState, useCallback, useEffect, useRef, useMemo, useContext} from 'react';
import './temp.css';
import {
  useQuery,
  useQueryCache,
  QueryCache,
  ReactQueryCacheProvider,
  useMutation,
  useInfiniteQuery,
} from 'react-query'
import axios from "axios";
import './util.css';
import nanoid from 'nanoid';
// import { useHistory } from "react-router-dom";
import { ReactQueryDevtools } from 'react-query-devtools'
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import {
  DropTargetsProvider,
  DropTargetsContext,
  WithDropTarget  
} from '../imports/DropTarget';
import Draggable from '../imports/Draggable';

const queryCache = new QueryCache();

export default function app() {
  

return <>
  <DropTargetsProvider>
    <ReactQueryCacheProvider queryCache={queryCache}>
      <Tool />
      <ReactQueryDevtools />
    </ReactQueryCacheProvider>
  </DropTargetsProvider>
</>
};

//TODO: Replace with the real <Tool /> component
function Tool(props){

  const cache = useQueryCache();
  const { dropState, dropActions } = useContext(DropTargetsContext);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedOverDriveId, setDraggedOverDriveId] = useState(null);

  let selectedNodesArr = useRef({}); //{driveId:"id",selectedArr:[{parentId:"id",nodeId:"id"}]}
  let clearSelectionFunctions = useRef({}); //{driveId:"id",selectedArr:[{parentId:"id",nodeId:"id"}]}

  function regClearSelection(browserId,clearFunc){
    clearSelectionFunctions.current[browserId] = clearFunc;
  }

  const setSelectedNodes = useCallback((selectedNodes)=>{
    selectedNodesArr.current = selectedNodes;
  });

  const mutationMoveNodes = async ({selectedNodes,destinationObj}) => {
    let rdata = {};
    if (Object.keys(selectedNodes).length > 0){//Protect against no selection
       const payload = {selectedNodes, destinationObj}
       let {data} = await axios.post("/api/moveItems.php", payload)
       rdata = data?.response;
      }
     return {selectedNodes, destinationObj, response:rdata}
   } 

  const [moveNodes] = useMutation(mutationMoveNodes, {
    onMutate:(params)=>{
      console.log(JSON.parse(JSON.stringify(params)));
      if (params.selectedNodes.selectedArr !== undefined){ //Only run if something is selected
        const sourceDriveId = params.selectedNodes.driveId;
        const destinationDriveId = params.destinationObj.driveId;
        const destinationParentId = params.destinationObj.parentId;
        //TODO: convert data when it moves from one drive type to another (i.e. content <-> assignment)

          //copy node information
          let sourceData = cache.getQueryData(["nodes",sourceDriveId]);
          let fullInfoAddArr = [];
          
          for (let nodeObj of params.selectedNodes.selectedArr){
            const nodeId = nodeObj.nodeId;
            const nodeFullObj = sourceData[0].nodeObjs[nodeId];
            fullInfoAddArr.push({...nodeFullObj,destinationParentId})
          }
  
          //delete from source drive
          cache.setQueryData(["nodes",sourceDriveId],
        (old)=>{
        old.push({
            deleteArr:params.selectedNodes.selectedArr
        })
        return old
        })
  
          //and add to desination drive
          cache.setQueryData(["nodes",destinationDriveId],
        (old)=>{
        old.push({ addArr:fullInfoAddArr })
        return old
        })
      }
    },
    onSuccess:(params)=>{
    //      
    },
    onError:(errObj,params)=>{
      if (params.selectedNodes.selectedArr !== undefined){ //Only run if something is selected
        const destinationDriveId = params.selectedNodes.driveId;
        const sourceDriveId = params.destinationObj.driveId;
        //TODO: convert data when it moves from one drive type to another (i.e. content <-> assignment)

          //copy node information
          let sourceData = cache.getQueryData(["nodes",sourceDriveId]);
          let fullInfoAddArr = [];
          
          for (let nodeObj of params.selectedNodes.selectedArr){
            const nodeId = nodeObj.nodeId;
            const nodeFullObj = sourceData[0].nodeObjs[nodeId];

            let destinationParentId;
            for (let originalObj of params.selectedNodes.selectedArr){
              if (originalObj.nodeId === nodeId){
                destinationParentId = originalObj.parentId; //put it back
                break;
              }
            }
            fullInfoAddArr.push({...nodeFullObj,destinationParentId})
          }

          let deleteArr = [];
          for (let originalObj of params.selectedNodes.selectedArr){
            deleteArr.push({originalObj,parentId:params.destinationObj.parentId})
          }
          //delete from source drive
        cache.setQueryData(["nodes",sourceDriveId],
        (old)=>{
        old.push({
            deleteArr
        })
        return old
        })
  
        // console.log(">>>fullInfoAddArr")
        // console.log(JSON.parse(JSON.stringify(fullInfoAddArr)));
        
  
          //and add to desination drive
          cache.setQueryData(["nodes",destinationDriveId],
        (old)=>{
        old.push({ addArr:fullInfoAddArr })
        return old
        })
      }
    }
  })

  const onDragStart = ({ nodeId, driveId }) => {
    setIsDragging(true);
    setDraggedOverDriveId(driveId);
  };

  const onDrag = ({ clientX, clientY, translation, id }) => {
    dropActions.handleDrag(clientX, clientY, id);
  };

  const onDragOverContainer = ({ id, driveId }) => {
    // update driveId if changed
    if (draggedOverDriveId !== driveId) {
      setDraggedOverDriveId(driveId);
    }
  };

  const onDragEnd = () => {
    const droppedId = dropState.activeDropTargetId;
    // valid drop
    if (droppedId) {
      // move all selected nodes to droppedId
      moveNodes({selectedNodes:selectedNodesArr.current, destinationObj:{driveId:draggedOverDriveId, parentId:droppedId}})
      .then((props)=>{
        //clear tool and browser selections
        clearSelectionFunctions.current[props.selectedNodes.browserId]();
        selectedNodesArr.current = {}
      })
    } else {

    }

    setIsDragging(false);
    setDraggedOverDriveId(null);
    dropActions.handleDrop();
  };

  const DnDState = {
    DnDState: {
      activeDropTargetId: dropState.activeDropTargetId,
      isDragging,
      draggedOverDriveId
    },
    DnDActions: {
      onDragStart,
      onDrag,
      onDragEnd,
      onDragOverContainer,
      registerDropTarget: dropActions.registerDropTarget,
      unregisterDropTarget: dropActions.unregisterDropTarget

    }
  };

  function NavigationByType(props){

    return <div>{props.type}</div>
  }

  return (<>
 <AddItem type="Folder" />
 <AddItem type="Url" />

  <div style={{display:"flex"}}> 
  <div>
  <Browser drive="content" isNav={true} DnDState={DnDState}/>
  <Browser drive="course" isNav={true} DnDState={DnDState}/>
  </div>
  <div>
  <Browser drive="content" setSelectedNodes={setSelectedNodes} regClearSelection={regClearSelection} DnDState={DnDState}/>
  <Browser drive="course" setSelectedNodes={setSelectedNodes} regClearSelection={regClearSelection} DnDState={DnDState}/>
  </div>
  </div>
  </>
  )
}



const addItemMutation = async ({itemId,label, driveId, parentId,type}) =>{

  const pdata = {driveId,parentId,itemId,label,type}
    const payload = {
      params: pdata
    }

   const { data } = await axios.get("/api/addItem.php", payload);

  return {driveId,parentId,itemId,label,type,results:data?.results}
} 

const deleteItemMutation = async ({driveId, parentId, itemId}) =>{

  const pdata = {driveId,parentId,itemId}
    const payload = {
      params: pdata
    }

  const { data } = await axios.get("/api/deleteItem.php", payload)

  return {driveId,parentId,itemId,results:data?.results}
} 

function AddItem(props){

  function AddItemButton(props){
    const cache = useQueryCache();
    const [label,setLabel] = useState('')
    const [addItem] = useMutation(addItemMutation,{
      onMutate:(obj)=>{
        //NOTE: this will not be the same as the database time
        const dt = new Date();
        const creationDate = `${
          dt.getFullYear().toString().padStart(2, '0')}-${
            (dt.getMonth()+1).toString().padStart(2, '0')}-${
            dt.getDate().toString().padStart(2, '0')} ${
          dt.getHours().toString().padStart(2, '0')}:${
          dt.getMinutes().toString().padStart(2, '0')}:${
          dt.getSeconds().toString().padStart(2, '0')}`

        cache.setQueryData(["nodes",obj.driveId],
      (old)=>{
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
      },
      onSuccess:(obj)=>{
        // console.log("onSuccess add obj",obj)
      
    },
    onError:(errMsg,obj)=>{
        console.warn(errMsg);
      cache.setQueryData(["nodes",obj.driveId],
      (old)=>{
      old.push({
          delete:{
            driveId:obj.driveId,
            itemId:obj.itemId,
            parentId:obj.parentId
          }
      })
      return old
      })
    }
  });

    let routePathDriveId = "";
    let routePathFolderId = "";
    let driveFolderPath = props.route.location.pathname.split("/").filter(i=>i)[0] //filter out ""
    
    if (driveFolderPath !== undefined){
      [routePathDriveId,routePathFolderId] = driveFolderPath.split(":");
      if (routePathDriveId !== "" && routePathFolderId === ""){routePathFolderId = routePathDriveId;}
    }

    if (props.type === "Folder" || props.type === "Url"){ //List of types accepted
      return (<span>
        <input 
        className="noselect nooutline" 
        data-doenet-browser-stayselected = {true} 
        type="text" 
        value={label} 
        onChange={(e)=>setLabel(e.target.value)} />
        <button 
        className="noselect nooutline" 
        data-doenet-browser-stayselected = {true}
        disabled={routePathFolderId === ""} 
      onClick={()=>{
        const itemId = nanoid();
        addItem({itemId,driveId:routePathDriveId,parentId:routePathFolderId,label,type:props.type})
        setLabel('');  //reset input field
      }}>Add {props.type}</button></span>)
    }
      return <span>Unknown type {props.type}</span>
    
    
  }
  return <Router><Switch>
           <Route path="/" render={(routeprops)=><AddItemButton route={{...routeprops}} {...props} />}></Route>
         </Switch></Router>
 }

const fetchChildrenNodes = async (queryKey,driveId,parentId) => {
  if (!parentId){
    const { data } = await axios.get(
      `/api/loadFolderContent.php?parentId=${driveId}&driveId=${driveId}&init=true`
    );
    return {init:true,data:data.results}
  } //First Query returns no data

  const { data } = await axios.get(
    `/api/loadFolderContent.php?parentId=${parentId}&driveId=${driveId}`
  );
  //TODO: Handle fail
  return data.results;
}

function Browser(props){
  return <Router><Switch>
           <Route path="/" render={(routeprops)=><BrowserChild route={{...routeprops}} {...props} />}></Route>
         </Switch></Router>
 }

function BrowserChild(props){
  console.log(`=== BROWSER='${props.drive}' isNav='${props.isNav}'`)
  let pathFolderId = props.drive; //default 
  let pathDriveId = props.drive; //default
  let routePathDriveId = "";
  let routePathFolderId = "";  
  if (props.route){
    let driveFolderPath = props.route.location.pathname.split("/").filter(i=>i)[0] //filter out ""
      //use defaults if not defined
      if (driveFolderPath !== undefined){
       [routePathDriveId,routePathFolderId] = driveFolderPath.split(":");
        if (routePathDriveId !== ""){pathDriveId = routePathDriveId;}
        if (routePathFolderId !== ""){pathFolderId = routePathFolderId;}
      }
    }
  //If navigation then build from root else build from path
  let rootFolderId = pathFolderId;
  if(props.isNav){
    rootFolderId = props.drive;
  }

  const [sortingOrder, setSortingOrder] = useState("alphabetical label ascending")
  const [driveIsOpen,setDriveIsOpen] = useState(props.driveIsOpen?props.driveIsOpen:true); //default to open
  const [openNodesObj,setOpenNodesObj] = useState({});
  const [selectedNodes,setSelectedNodes] = useState({});
  const { DnDState, DnDActions } = props.DnDState;

  const {
    data,
    isFetching, 
    isFetchingMore, 
    fetchMore, 
    error} = useInfiniteQuery(['nodes',props.drive], fetchChildrenNodes, {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (Object.keys(data[0])[0] === "init"){
          let folderChildrenIds = {};
          let nodeObjs = {};
          for (let row of data[0].data){
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

          data[0] = {folderChildrenIds,nodeObjs}
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
     
      //   props.driveSync.update(props.drive,nodeIdToDataIndex.current,nodeIdToChildren.current)
      // }
        
        
      },
      getFetchMore: (lastGroup, allGroups) => {
        return lastGroup.nextCursor;
    }})

    const [deleteItem] = useMutation(deleteItemMutation,{
      onMutate:(obj)=>{
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
    let data = cache.getQueryData(["nodes",props.drive]);
    let selectedArr = [];
      for (let nodeId of Object.keys(nodeIdObj)){
        let obj = data[0].nodeObjs[nodeId];
        let parentId = obj.parentId;
        selectedArr.push({parentId,nodeId,type:obj.type})
      }
      if (props.setSelectedNodes){
        props.setSelectedNodes({
          browserId:browserId.current,
          driveId:props.drive,
          selectedArr
        });
      }
  },[])

  const handleClickNode = useCallback(({ nodeId, parentId, type, shiftKey, metaKey})=>{
    if (props.isNav){
      if (type === 'Folder'){
        history.push(`/${props.drive}:${nodeId}/`)
      }else{
        //TODO: handle not a folder actions here
        history.push(`/${props.drive}:${parentId}/`)

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
    if (props.setSelectedNodes){
      props.setSelectedNodes({});
    }
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
  if (!props.isNav && routePathDriveId !== props.drive){ return null;}
  


  // if (isFetching){ return <div>Loading...</div>}

  function renderDragGhost(element) {
    const dragGhostId = `drag-ghost-${props.driveId}`;
    const numItems = Object.keys(selectedNodes).length;
    
    return <DragGhost id={dragGhostId} numItems={numItems} element={element} />;
  }

  function deleteFolderHandler(nodeObj){
    deleteFolder(nodeObj);
  }
  

  function buildNodes({driveId,parentId,sortingOrder,nodesJSX=[],nodeIdArray=[],level=0}){

    let childrenIdsArr = data[0]?.folderChildrenIds?.[parentId]?.defaultOrder;

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
          if (DnDState.isDragging && selectedNodes[nodeId]) {
            appearance = "dragged";
            draggableClassName = "";
          } else if (props.isNav && pathFolderId === nodeId && pathDriveId === props.drive){
            //Only select the current path folder if we are a navigation browser
            appearance = "selected";
          } else if (selectedNodes[nodeId]){ 
            appearance = "selected";
          } else if (DnDState.activeDropTargetId === nodeId) {
            appearance = "dropperview";
          }

          let nodeJSX = <Node 
            key={`node${nodeId}`} 
            label={nodeObj.label}
            browserId={browserId.current}
            nodeId={nodeId}
            driveId={props.drive}
            parentId={parentId}
            type={nodeObj.type}
            appearance={appearance}
            isOpen={isOpen} 
            numChildren={numChildren}
            level={level}
            handleFolderToggle={handleFolderToggle} 
            deleteItemHandler={deleteItemHandler}
            handleClickNode={handleClickNode}
            handleDeselectAll={handleDeselectAll}
            level={level}/>;
          
          // navigation items not draggable
          if (!props.isNav) {
            nodeJSX = <Draggable
              id={nodeId}
              className={draggableClassName}
              onDragStart={() => DnDActions.onDragStart({ nodeId, driveId:props.drive })}
              onDrag={DnDActions.onDrag}
              onDragEnd={DnDActions.onDragEnd}
              ghostElement={renderDragGhost(nodeJSX)}
            >
             { nodeJSX } 
            </Draggable>
          }

          if (nodeObj?.type === "Folder") {
            nodeJSX = <WithDropTarget
              id={nodeId}
              registerDropTarget={DnDActions.registerDropTarget} 
              unregisterDropTarget={DnDActions.unregisterDropTarget}
              dropCallbacks={{
                onDragOver: () => DnDActions.onDragOverContainer({ id: nodeId, driveId: props.drive }),
                onDrop: () => {}
              }}
            >
              { nodeJSX } 
            </WithDropTarget>
          }
  
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
    driveToggleDiv = <div style={{
      width: "300px",
      padding: "4px",
      // border: "1px solid black",
      backgroundColor: "white",
      margin: "2px"
    }} ><div className="noselect"  ><button onClick={()=>setDriveIsOpen(old=>!old)}>{buttonText}</button> Drive label here</div></div>
  }
  return <>
  <div style={{marginTop:"1em",marginBottom:"1em"}}>
  {/* <h3>{props.drive} {props.isNav?"Nav":null}</h3> */}
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
      }}>{toggle} [F] {props.label} ({props.numChildren}) {deleteNode}</div></div>
    
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
      }}>[U] {props.label} {deleteNode}</div></div>
    
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