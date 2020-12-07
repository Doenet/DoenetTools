import React, {useState, useCallback, useEffect, useRef, useContext} from 'react';
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

  let selectedNodesArr = useRef({}); //{driveId:"id",selectedArr:[{parentId:"id",nodeId:"id"}]}
  let clearSelectionFunctions = useRef({}); //{driveId:"id",selectedArr:[{parentId:"id",nodeId:"id"}]}

  function regClearSelection(browserId,clearFunc){
    clearSelectionFunctions.current[browserId] = clearFunc;
  }

  const setSelectedNodes = useCallback((selectedNodes)=>{
    selectedNodesArr.current = selectedNodes;
  });

  const mutationMoveNodes = ({selectedNodes,destinationObj}) => {
    if (Object.keys(selectedNodes).length > 0){//Protect against no selection
       const payload = {selectedNodes, destinationObj}
       axios.post("/api/moveNodes.php", payload)
       .then((resp)=>{
         console.log(">>>MOVE resp")
         console.log(resp.data)
       })
      }
     return {selectedNodes, destinationObj}
   } 

  const [moveNodes] = useMutation(mutationMoveNodes, {
    onSuccess:(params)=>{
      if (params.selectedNodes.selectedArr !== undefined){ //Only run if something is selected
        const sourceDriveId = params.selectedNodes.driveId;
        const destinationDriveId = params.destinationObj.driveId;
        const destinationParentId = params.destinationObj.parentId;
        //Convert to new types
        //TODO: convert data from content to assignments 
        //and assignments to content
        console.log(`>>>move from drive ${sourceDriveId} to ${destinationDriveId}`)
        console.log(">>>selectedNodes",params.selectedNodes)
        console.log(">>>selectedNodes selectedArr",params.selectedNodes.selectedArr)
        if (sourceDriveId === destinationDriveId){
          console.log(">>>DRIVES MATCH")
          //move nodes in a drive
          cache.setQueryData(["nodes",sourceDriveId],
        (old)=>{
        old.push({
            move:{
              destinationParentId,
              nodeIds:params.selectedNodes.selectedArr,
            }
        })
        return old
        })
        }else{
          //move nodes to a new drive
          console.log(">>>DRIVES DONT MATCH")
  
          //copy node information
          let sourceData = cache.getQueryData(["nodes",sourceDriveId]);
          let selectedFullArr = [];
          
          for (let nodeObj of params.selectedNodes.selectedArr){
            const nodeId = nodeObj.nodeId;
            const nodeFullObj = sourceData[0].nodeObjs[nodeId];
            selectedFullArr.push({...nodeFullObj})
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
        old.push({
            addArr:{
              destinationParentId,
              nodeArr:selectedFullArr
            }
        })
        return old
        })
        }
      }
    }
  })


  return (<>
<AddNode type="Folder" />
<div>
  <button onClick={()=>{console.log(clearSelectionFunctions.current)}}>Log Registration</button>
<button 
      data-doenet-browser-stayselected = {true}
  onClick={()=>{
    moveNodes({selectedNodes:selectedNodesArr.current,destinationObj:{driveId:"content",parentId:"f1"}})
    .then((props)=>{
      //clear tool and browser selections
      clearSelectionFunctions.current[props.selectedNodes.browserId]();
      selectedNodesArr.current = {}
    })
  }} >Move to content folder 1</button>
  <button 
      data-doenet-browser-stayselected = {true}
  onClick={()=>{
    moveNodes({selectedNodes:selectedNodesArr.current,destinationObj:{driveId:"content",parentId:"f2"}})
    .then((props)=>{
      //clear tool and browser selections
      clearSelectionFunctions.current[props.selectedNodes.browserId]();
      selectedNodesArr.current = {}
    })

  }} >Move to content folder 2</button>
</div>
<div>
<button 
      data-doenet-browser-stayselected = {true}
  onClick={()=>{
    moveNodes({selectedNodes:selectedNodesArr.current,destinationObj:{driveId:"course",parentId:"h1"}})
    .then((props)=>{
      //clear tool and browser selections
      clearSelectionFunctions.current[props.selectedNodes.browserId]();
      selectedNodesArr.current = {}
    })

  }} >Move to course Header 1</button>
  <button 
      data-doenet-browser-stayselected = {true}
  onClick={()=>{
    moveNodes({selectedNodes:selectedNodesArr.current,destinationObj:{driveId:"course",parentId:"h2"}})
    .then((props)=>{
      //clear tool and browser selections
      clearSelectionFunctions.current[props.selectedNodes.browserId]();
      selectedNodesArr.current = {}
    })


  }} >Move to course Header 2</button>
</div>
  

  <div style={{display:"flex"}}> 
  <div>
  <BrowserRouted drive="content" isNav={true} />
  <BrowserRouted drive="course" isNav={true} />
  </div>
  <div>
  <BrowserRouted drive="content" setSelectedNodes={setSelectedNodes} regClearSelection={regClearSelection}/>
  <BrowserRouted drive="course" setSelectedNodes={setSelectedNodes} regClearSelection={regClearSelection}/>
  </div>
  </div>
  </>
  )
}



const addFolderMutation = ({label, driveId, parentId}) =>{
  const folderId = nanoid();

  const data = {driveId,parentId,folderId,label}
    const payload = {
      params: data
    }

    axios.get("/api/addFolder.php", payload)
    .then((resp)=>{
    })

  return {driveId,parentId,folderId,label}
} 

const deleteFolderMutation = ({driveId, parentId, folderId}) =>{

  const data = {driveId,parentId,folderId}
    const payload = {
      params: data
    }

    axios.get("/api/deleteFolder.php", payload)
    .then((resp)=>{
    })

  return {driveId,parentId,folderId}
} 

function AddNode(props){

  function AddNodeButton(props){
    const cache = useQueryCache();
    const [label,setLabel] = useState('')
    const [addFolder] = useMutation(addFolderMutation,{
      onSuccess:(obj)=>{
      cache.setQueryData(["nodes",obj.driveId],
      (old)=>{
      //Provide infinitequery with what we know of the new addition
      old.push({
          add:{
            driveId:obj.driveId,
            nodeObj:{
            id:obj.folderId,
            label,
            parentId:obj.parentId,
            type:"Folder"
            }
          }
      })
      return old
      })
     
      
    }});

    let routePathDriveId = "";
    let routePathFolderId = "";
    let driveFolderPath = props.route.location.pathname.split("/").filter(i=>i)[0] //filter out ""
    
    if (driveFolderPath !== undefined){
      [routePathDriveId,routePathFolderId] = driveFolderPath.split(":");
      if (routePathDriveId !== "" && routePathFolderId === ""){routePathFolderId = routePathDriveId;}
    }

    if (props.type === "Folder"){
      return (<span>
        <input data-doenet-browser-stayselected = {true} type="text" value={label} onChange={(e)=>setLabel(e.target.value)} />
        <button 
        data-doenet-browser-stayselected = {true}
        disabled={routePathFolderId === ""} 
      onClick={()=>{
        addFolder({driveId:routePathDriveId,parentId:routePathFolderId,label})
        setLabel('');  //reset input field
      }}>Add {props.type}</button></span>)
    }
      return <span>Unknown type {props.type}</span>
    
    
  }
  return <Router><Switch>
           <Route path="/" render={(routeprops)=><AddNodeButton route={{...routeprops}} {...props} />}></Route>
         </Switch></Router>
 }

const fetchChildrenNodes = async (queryKey,driveId,parentId) => {
  if (!parentId){return {init:true}} //First Query returns no data

  const { data } = await axios.get(
    `/api/loadFolderContent.php?parentId=${parentId}&driveId=${driveId}`
  );
  //TODO: Handle fail
  return data.results;
}

function BrowserRouted(props){
  return <Router><Switch>
           <Route path="/" render={(routeprops)=><Browser route={{...routeprops}} {...props} />}></Route>
         </Switch></Router>
 }

function Browser(props){
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
  const [toggleNodeId,setToggleNode] = useState([]);
  const [openNodesObj,setOpenNodesObj] = useState({});
  const [selectedNodes,setSelectedNodes] = useState({});
  const [refreshNumber,setRefresh] = useState(0)
  const [draggedId, setDraggedId] = useState(null);
  const { dropState, dropActions } = useContext(DropTargetsContext);

  const {
    data,
    isFetching, 
    isFetchingMore, 
    fetchMore, 
    error} = useInfiniteQuery(['nodes',props.drive], fetchChildrenNodes, {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (Object.keys(data[0])[0] === "init"){
          data[0] = {folderChildrenIds:{},nodeObjs:{}}
        }else if (data[1]){
          let actionOrId = Object.keys(data[1])[0];
          if (actionOrId === "add"){
            let parentId = data[1].add.nodeObj.parentId;
            let nodeId = data[1].add.nodeObj.id;
            if (data[0].folderChildrenIds[parentId]){
              //Append children and don't add if we haven't loaded the other items
              //TODO: test if this exists first????
              data[0].folderChildrenIds[parentId].defaultOrder.push(nodeId);
              data[0].nodeObjs[nodeId] = data[1].add.nodeObj;
            }
            data.pop();   
          }else if (actionOrId === "addArr"){
            let dParentId = data[1].addArr.destinationParentId;
            for (let nodeObj of data[1].addArr.nodeArr){
              let nodeId = nodeObj.id;
              let destArr = data[0].folderChildrenIds?.[dParentId]?.defaultOrder
              if (destArr){
                destArr.push(nodeId);
              }
              nodeObj.parentId = dParentId;
              data[0].nodeObjs[nodeId] = nodeObj;
            }
              data.pop(); 

          }else if (actionOrId === "delete"){
            let parentId = data[1].delete.parentId;
            let nodeId = data[1].delete.folderId;
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
            data.pop();    
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

    const [deleteFolder] = useMutation(deleteFolderMutation,{
      onSuccess:(obj)=>{
      cache.setQueryData(["nodes",obj.driveId],
      (old)=>{
        old.push({delete:obj}); //Flag information about delete
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

  const handleClickNode = useCallback(({ nodeData, shiftKey, metaKey})=>{
    if (props.isNav){
      history.push(`/${props.drive}:${nodeData.id}/`)
    }else{
    
      if (!shiftKey && !metaKey){
        //Only select this node
        setSelectedNodes((old)=>{
          let newObj; 
          //if already selected then leave selections the way they are
          //else only select the current node
          if (old[nodeData.id]){
            newObj = {...old};
          }else{
            newObj = {};
            newObj[nodeData.id] = true;
          }
          lastSelectedNodeIdRef.current = nodeData.id;
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
        let indexOfNode = nodeIdRefArray.current.indexOf(nodeData.id);
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
          if (newObj[nodeData.id]){
            delete newObj[nodeData.id];
          }else{
            newObj[nodeData.id] = true;
            lastSelectedNodeIdRef.current = nodeData.id;
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
  })

  const onDragStart = ({ id }) => {
    setDraggedId(id);
  };

  const onDrag = ({ clientX, clientY, translation, id }) => {
    dropActions.handleDrag(clientX, clientY, id);
  };

  const onDragOverContainer = ({ id }) => {
    // console.log("onDragOver", id);
    // how to insert dummy object?
  };

  const onDragEnd = () => {
    dropActions.handleDrop();
    setDraggedId(null);
  };

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
    // const numItems = state.mode == "DRAGGING" ? state.draggedItemData.draggedItemIds.size : 0;
    // const innerNode = state.mode == "DRAGGING" && state.draggedItemData.draggedNodeElement ?
    //   state.draggedItemData.draggedNodeElement :
    //   <div>Test</div>;    

    const numItems = 4;
    const innerNode = <div>Test</div>;    
    
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
      fetchMore(parentId);

    }else{
      if (childrenIdsArr.length === 0){nodesJSX.push(<EmptyNode key={`empty${nodeIdArray.length}`}/>)}

      for(let nodeId of childrenIdsArr){
        //If folder we need to know how many child nodes it has
        let grandChildrenIdsArr = data[0]?.folderChildrenIds?.[nodeId]?.defaultOrder;
        let numChildren = "?";
        if (grandChildrenIdsArr === undefined){
          //Need data
          fetchMore(nodeId);
        }else{
          numChildren = grandChildrenIdsArr.length;
        }
          nodeIdArray.push(nodeId); //needed to calculate shift click selections
          let nodeObj = data[0].nodeObjs[nodeId];
          let isOpen = false;
          if (openNodesObj[nodeId]){ isOpen = true;}
          
          let appearance = "default";
          if (props.isNav && pathFolderId === nodeId && pathDriveId === props.drive){
            //Only select the current path folder if we are a navigation browser
            appearance = "selected";
          }else if (selectedNodes[nodeId]){ 
            appearance = "selected";
          } else if (draggedId === nodeId) {
            appearance = "dragged";
          } else if (dropState.activeDropTargetId === nodeId) {
            appearance = "dropperview";
          }

          let nodeJSX = <Node 
            key={`node${nodeId}`} 
            browserId={browserId.current}
            node={nodeObj}
            nodeId={nodeId}
            driveId={props.drive}
            parentId={parentId}
            isOpen={isOpen} 
            appearance={appearance}
            numChildren={numChildren}
            handleFolderToggle={handleFolderToggle} 
            deleteFolderHandler={deleteFolderHandler}
            handleClickNode={handleClickNode}
            handleDeselectAll={handleDeselectAll}
            level={level}/>;
  
          nodeJSX = <Draggable
            id={nodeId}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            ghostElement={renderDragGhost(nodeJSX)}
          >
            { nodeJSX } 
          </Draggable>
  
          nodeJSX = <WithDropTarget
            id={nodeId}
            dropProps={{dropState: dropState, dropActions: dropActions}}
            dropCallbacks={{
              onDragOver: () => onDragOverContainer({ id: nodeId }),
              onDrop: () => {}
            }}
          >
            { nodeJSX } 
          </WithDropTarget>
  
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
  if (data){
    [nodes,nodeIdArray] = buildNodes({driveId:props.driveId,parentId:rootFolderId,sortingOrder});
    nodeIdRefArray.current = nodeIdArray;
  }
  

  return <>
  <div>
  <h3>{props.drive} {props.isNav?"Nav":null}</h3>
  </div>
  {nodes}
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
  console.log(`=== NODE='${props.nodeId}' parentId='${props.parentId}'`)

  const indentPx = 20;
  let bgcolor = "#e2e2e2";
  if (props.appearance === "selected") { bgcolor = "#6de5ff"; }
  if (props.appearance === "dropperview") { bgcolor = "#53ff47"; }
  if (props.appearance === "dragged") { bgcolor = "#f3ff35"; }  

  // let numChildren = 0;
  // if (children && children.data){
  //   numChildren = Object.keys(children.data[props.nodeId]).length;
  // }

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
    props.deleteFolderHandler({driveId:props.driveId,parentId:props.parentId,folderId:props.nodeId})
  }}
  onMouseDown={e=>{ e.preventDefault(); e.stopPropagation(); }}
  onDoubleClick={e=>{ e.preventDefault(); e.stopPropagation(); }}
  >X</button>

  return <>
  <div
    data-doenet-browserid={props.browserId}
    tabIndex={0}
    className="noselect nooutline" 
    onMouseDown={(e) => {
      // onClick={(e) => {
      props.handleClickNode({ nodeData:props.node, shiftKey: e.shiftKey, metaKey: e.metaKey })
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
    }}>{toggle} [F] {props.node.label} ({props.numChildren}) {deleteNode}</div></div>
  
  </>
// }
})

const DragGhost = ({ id, element, numItems }) => {

  return (
    <div id={id}>
    {
      numItems < 2 ? 
        <div
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.20) 3px 3px 3px 3px',
            borderRadius: '4px',
            animation: 'dragAnimation 2s',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: "#fff"
          }}>
          { element }
        </div>
      :
      <div style={{minWidth: "300px"}}>
        <div
          style={{
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
          }}>
          {numItems}
        </div>
        <div
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.30) 4px 4px 2px 0px',
            borderRadius: '4px',
            padding: "0 5px 5px 0",
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            zIndex: "1",
            background: "#fff"
          }}>
          <div
            style={{
              borderRadius: '4px',
              boxShadow: 'rgba(0, 0, 0, 0.20) 3px 3px 2px 2px',
              border: '1px solid rgba(0, 0, 0, 0.20)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: "2"
            }}>
            { element }
          </div>
        </div>
      </div>
    }      
    </div>
  )
}