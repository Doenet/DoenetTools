import React, {useState, useCallback, useEffect, useRef} from 'react';
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
const queryCache = new QueryCache();

export default function app() {

  let selectedNodesArr = useRef({}); //{driveId:"id",selectedArr:[{parentId:"id",nodeId:"id"}]}

  const setSelectedNodes = useCallback((selectedNodes)=>{
    console.log(">>>Tool selectedNodes",selectedNodes);
    selectedNodesArr.current = selectedNodes;
  });

  const [moveNodes] = useMutation(mutationMoveNodes, {
    onSuccess:(obj)=>{
      console.log(">>>move nodes",obj)
      //Sort into drives
      //Remove from sources
       // cache.setQueryData(["nodes",obj.driveId],
      // (old)=>{
      //   //We are adding a folder so we need the previous folders
      //   //Find the most recent mention of parentId
        

      // old.push({
      //     add:{
      //       driveId:obj.driveId,
      //       node:{
      //       id:obj.folderId,
      //       label,
      //       parentId:obj.parentId,
      //       type:"Folder"
      //       }
      //     }
      // })
      // return old
      // })

      //Convert to new types
      //TODO: convert data from content to assignments 
      //and assignments to content

      //Add to Destination
      // cache.setQueryData(["nodes",obj.driveId],
      // (old)=>{
      //   //We are adding a folder so we need the previous folders
      //   //Find the most recent mention of parentId
        

      // old.push({
      //     add:{
      //       driveId:obj.driveId,
      //       node:{
      //       id:obj.folderId,
      //       label,
      //       parentId:obj.parentId,
      //       type:"Folder"
      //       }
      //     }
      // })
      // return old
      // })
    }
  })

  //driveSync
  let syncNodeIdToDataIndex = useRef({});
  let syncNodeIdToChildren = useRef({});

  let driveSync = {update,get}

  function update(driveId,nodeIdToDataIndex,nodeIdToChildren){
    syncNodeIdToDataIndex.current[driveId] = nodeIdToDataIndex;
    syncNodeIdToChildren.current[driveId] = nodeIdToChildren;
  }
  function get(driveId){
    console.log("GET",driveId)
    return [syncNodeIdToDataIndex.current[driveId],syncNodeIdToChildren.current[driveId]];
  }

return <>
<ReactQueryCacheProvider queryCache={queryCache}>
  <AddNode type="Folder" />
  {/* <button onClick={()=>{
    moveNodes({selectedNodesArr,destinationObj:{driveId:"course",parentId:"h2"}})
  }} >Move to Course header 2</button>
    <button onClick={()=>{
    moveNodes({selectedNodesArr,destinationObj:{driveId:"content",parentId:"f2"}})
}} >Move to Content Folder 2</button> */}
  <div style={{display:"flex"}}> 
  <div>
  <BrowserRouted drive="content" isNav={true} driveSync={driveSync} />
  <BrowserRouted drive="course" isNav={true} driveSync={driveSync} />
  </div>
  <div>
  <BrowserRouted drive="content" driveSync={driveSync} setSelectedNodes={setSelectedNodes}/>
  <BrowserRouted drive="course" driveSync={driveSync} setSelectedNodes={setSelectedNodes}/>
  </div>
  </div>
  <ReactQueryDevtools />

</ReactQueryCacheProvider>
</>
};

const mutationMoveNodes = ({sourceArr, destinationObj}) => {
 console.log(">>source dest",sourceArr,destinationObj)
    const payload = {sourceArr, destinationObj}
    axios.post("/api/moveNodes.php", payload)
    .then((resp)=>{
      console.log(">>>MOVE resp",resp.data)
    })

  return {sourceArr, destinationObj}
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
      return (<span><input type="text" value={label} onChange={(e)=>setLabel(e.target.value)} /><button disabled={routePathFolderId === ""} 
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

  const {
    data,
    isFetching, 
    isFetchingMore, 
    fetchMore, 
    error} = useInfiniteQuery(['nodes',props.drive], fetchChildrenNodes, {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        console.log(">>>ONSUCCESS")
        if (Object.keys(data[0])[0] === "init"){
          data[0] = {folderChildrenIds:{},nodeObjs:{}}
        }else if (data[1]){
          console.log(">>>data[1]",data[1])
          let actionOrId = Object.keys(data[1])[0];
          if (actionOrId === "add"){
            let parentId = data[1].add.nodeObj.parentId;
            let nodeId = data[1].add.nodeObj.id;
            if (data[0].folderChildrenIds[parentId]){
              //Append children and don't add if we haven't loaded the other items
              data[0].folderChildrenIds[parentId].defaultArr.push(nodeId);
              data[0].nodeObjs[nodeId] = data[1].add.nodeObj;
            }
            data.pop();          
          }else if (actionOrId === "delete"){
            let parentId = data[1].delete.parentId;
            let nodeId = data[1].delete.folderId;
            let childrenIds = data[0].folderChildrenIds[parentId].defaultArr;
            childrenIds.splice(childrenIds.indexOf(nodeId),1);
            // delete data[0].nodeObjs[nodeId]; //Keep for undo?
            data.pop();          
          }else{
            //fetchMore
            let contentIds = [];
            for (let nodeId of Object.keys(data[1][actionOrId])){
              let nodeObj = data[1][actionOrId][nodeId];
              contentIds.push(nodeId);
              data[0].nodeObjs[nodeId] = nodeObj;
            }
            data[0].folderChildrenIds[actionOrId] = {defaultArr:contentIds};
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

 

  const [sortingOrder, setSortingOrder] = useState("alphabetical label ascending")
  const [toggleNodeId,setToggleNode] = useState([]);
  const [openNodesObj,setOpenNodesObj] = useState({});
  const [selectedNodes,setSelectedNodes] = useState({});
  const [refreshNumber,setRefresh] = useState(0)

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
  // function updateToolWithSelection(nodeIdObj){
      //{driveId:"id",selectedArr:[{parentId:"id",nodeId:"id"}]}
    let data = cache.getQueryData(["nodes",props.drive]);
    let selectedArr = [];
      for (let nodeId of Object.keys(nodeIdObj)){
        let obj = data[0].nodeObjs[nodeId];
        let parentId = obj.parentId;
        selectedArr.push({parentId,nodeId})
      }
      if (props.setSelectedNodes){
        props.setSelectedNodes({
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
          let newObj = {};
          newObj[nodeData.id] = true;
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

 
  // //------------------------------------------
  // //****** End of use functions  ***********
  // //------------------------------------------
  if (browserId.current === ""){ browserId.current = nanoid();}

  
    //Only show non navigation when drive matches route
  if (!props.isNav && routePathDriveId !== props.drive){ return null;}
  


  // if (isFetching){ return <div>Loading...</div>}

  function deleteFolderHandler(nodeObj){
    deleteFolder(nodeObj);
  }

  function buildNodes({driveId,parentId,sortingOrder,nodesJSX=[],nodeIdArray=[],level=0}){

    let childrenIdsArr = data[0]?.folderChildrenIds?.[parentId]?.defaultArr;

    if (childrenIdsArr === undefined){
      //Need data
      nodesJSX.push(<LoadingNode key={`loading${nodeIdArray.length}`}/>);
      fetchMore(parentId);
    }else{
      if (childrenIdsArr.length === 0){nodesJSX.push(<EmptyNode key={`empty${nodeIdArray.length}`}/>)}

      for(let nodeId of childrenIdsArr){
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
        }
        nodesJSX.push(<Node 
          key={`node${nodeId}`} 
          browserId={browserId.current}
          node={nodeObj}
          nodeId={nodeId}
          driveId={props.drive}
          parentId={parentId}
          isOpen={isOpen} 
          appearance={appearance}
          handleFolderToggle={handleFolderToggle} 
          deleteFolderHandler={deleteFolderHandler}
          handleClickNode={handleClickNode}
          handleDeselectAll={handleDeselectAll}
          level={level}/>)
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

  let numChildren = 0;
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
    onClick={(e) => {
      props.handleClickNode({ nodeData:props.node, shiftKey: e.shiftKey, metaKey: e.metaKey })
    }} 
    onDoubleClick={(e) => {
      props.handleFolderToggle(props.nodeId)
    }} 
    onBlur={(e) => {
      //Only clear if focus goes outside of this node group
       if (e.relatedTarget === null ||
        e.relatedTarget.dataset.doenetBrowserid !== props.browserId
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
    }}>{toggle} [FOLDER] {props.node.label} {deleteNode}</div></div>
  
  </>
// }
})
