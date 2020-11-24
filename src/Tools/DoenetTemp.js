import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  useQuery,
  useQueryCache,
  QueryCache,
  ReactQueryCacheProvider,
  useMutation,
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
return <>
<ReactQueryCacheProvider queryCache={queryCache}>
  <AddNode type="Folder" />
  {/* <AddNode type="DoenetMl" /> */}
  <div style={{display:"flex"}}> 
  <div>
  <BrowserRouted drive="content" isNav={true} />
  <BrowserRouted drive="assignment" isNav={true} />
  </div>
  <div>
  <BrowserRouted drive="content" />
  <BrowserRouted drive="assignment" />
  </div>
  </div>
  <ReactQueryDevtools />

</ReactQueryCacheProvider>
</>
};


// function useNodes(_,parentId,driveId) {
//   if (!parentId){parentId = props.drive}
//   return useQuery(["nodes",{parentId,driveId:props.drive}], loadFolderContent,{staleTime:30000})
// }
const addFolderMutation = ({label, driveId, parentId}) =>{
  const folderId = nanoid();

  const data = {parentId,folderId,driveId,label}
    const payload = {
      params: data
    }
    axios.get("/api/addFolder.php", payload)
    .then((resp)=>{})

  return {driveId,parentId}
} 

function AddNode(props){

  function AddNodeButton(props){
    const cache = useQueryCache();
    const [label,setLabel] = useState('')
    const [addFolder] = useMutation(addFolderMutation,{onSuccess:(obj)=>{
      cache.removeQueries(["nodes",obj.driveId,obj.parentId,"alphabetical label ascending"])
      cache.invalidateQueries(["nodes",obj.driveId,obj.parentId])
      .then((x)=>{
        //Wait for node data to finish updating then refresh browser
        cache.invalidateQueries(["browser",obj.driveId])
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
        addFolder({driveId:routePathDriveId,parentId:routePathFolderId,label});
        setLabel('');  //reset input field
      }}>Add {props.type}</button></span>)
    }
      return <span>Unknown type {props.type}</span>
    
    
  }
  return <Router><Switch>
           <Route path="/" render={(routeprops)=><AddNodeButton route={{...routeprops}} {...props} />}></Route>
         </Switch></Router>
 }

const loadFolderContent = async (_,driveId,parentId) => {
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
  console.log(`===TOP OF BROWSER drive=${props.drive}`)
  const browser = useQuery(["browser",props.drive],()=>{}) //For refreshing Browser after nodes mutate


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
          return newObj;
        })
      }else if (shiftKey && !metaKey){
        //Add selection to range including the end points 
        //of last selected to current nodeid      
        let indexOfLastSelected = 0;
        if (lastSelectedNodeIdRef.current !== ""){indexOfLastSelected = nodeIdRefArray.current.indexOf(lastSelectedNodeIdRef.current) }
        let indexOfNode = nodeIdRefArray.current.indexOf(nodeData.id);
        let startIndex = Math.min(indexOfNode,indexOfLastSelected);
        let endIndex = Math.max(indexOfNode,indexOfLastSelected);
        
        setSelectedNodes((old)=>{
          let newObj = {...old};
          for (let i = startIndex; i <= endIndex;i++){
            newObj[nodeIdRefArray.current[i]] = true;
          }
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
          return newObj;
        })
      }
    }
    
    
  },[])

  const handleDeselectAll = useCallback(()=>{
    setSelectedNodes({})
  })

 
  // //------------------------------------------
  // //****** End of use functions  ***********
  // //------------------------------------------
  if (browserId.current === ""){ browserId.current = nanoid();}

  let pathFolderId = props.drive; //default to root
  let pathDriveId = props.drive; //default to root
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
    //Only show non navigation when drive matches route
  if (!props.isNav && routePathDriveId !== props.drive){ return null;}
  


  function getSortedChildren(driveId,parentId,sortingOrder){

    let resultArray = cache.getQueryData(["nodes",driveId,parentId,sortingOrder]);
    if (!resultArray){
      console.log("SORTING!")
      resultArray = [];
      let nodeData = cache.getQueryData(["nodes",driveId,parentId]);
      //TODO: Handle empty array
      let childrenNodeObjs = nodeData[parentId];
      if (childrenNodeObjs === undefined){ childrenNodeObjs = {}}
      for (let nodeId of Object.keys(childrenNodeObjs)){
        let nodeObj = childrenNodeObjs[nodeId];
        resultArray.push(nodeObj);
      }
      //sort by label ascending
      resultArray.sort((a,b)=>(a.label > b.label)? 1:-1);
      //sort by label descending
      // resultArray.sort((a,b)=>(a.label > b.label)? -1:1);
      //sort by type ascending then label ascending
      // resultArray.sort((a, b) => (a.type > b.type) ? 1 : (a.type === b.type) ? ((a.label > b.label) ? 1 : -1) : -1 )
  
      cache.setQueryData(["nodes",driveId,parentId,sortingOrder],resultArray,{cacheTime:Infinity})
    }
    return resultArray;
  }

  function buildNodes({driveId,parentId,sortingOrder,nodesJSX=[],nodeIdArray=[],level=0}){

    let folderData = cache.getQueryData(["nodes",driveId,parentId]);
    if (!folderData){
      //TODO: Make key unique
      nodesJSX.push(<LoadingNode key={`loading${nodeIdArray.length}`}/>);
        let folderQueryPromise = cache.fetchQuery(["nodes",driveId,parentId],loadFolderContent,{cacheTime:30000})
        folderQueryPromise.then((data)=>{
          setRefresh((x)=>x+1)
        })
    }else{

      let nodeArray = getSortedChildren(driveId,parentId,sortingOrder);
      if (nodeArray.length === 0){nodesJSX.push(<EmptyNode key={`empty${nodeIdArray.length}`}/>)}
      for (const node of nodeArray){
        nodeIdArray.push(node.id);
        let isOpen = false;
        if (openNodesObj[node.id]){ isOpen = true;}
        let appearance = "default";
        if (props.isNav && pathFolderId === node.id && pathDriveId === props.drive){
          //Only select the current path folder if we are a navigation browser
          appearance = "selected";
        }else if (selectedNodes[node.id]){ 
          appearance = "selected";
        }

        nodesJSX.push(<Node 
          key={`node${node.id}`} 
          browserId={browserId.current}
          nodeId={node.id}
          driveId={props.drive}
          parentId={parentId}
          isOpen={isOpen} 
          appearance={appearance}
          handleFolderToggle={handleFolderToggle} 
          handleClickNode={handleClickNode}
          handleDeselectAll={handleDeselectAll}
          level={level}/>)
        if (isOpen){
          buildNodes({driveId,parentId:node.id,sortingOrder,nodesJSX,nodeIdArray,level:level+1})
        }
  
      }
    }
  
    return [nodesJSX,nodeIdArray];
  }

  let rootParentId = pathFolderId;
  let displayDriveId = pathDriveId;
  //If navigation then build from root
  if(props.isNav){
    rootParentId = props.drive;
    displayDriveId = props.drive;
  }
  const [nodes,nodeIdArray] = buildNodes({driveId:displayDriveId,parentId:rootParentId,sortingOrder});
  nodeIdRefArray.current = nodeIdArray;

  return <>
  <div>
  <h3>{props.drive} {props.isNav?"Nav":null}</h3>
  {nodes}
  </div>
  {/* <button onClick={()=>setRefresh((x)=>x+1)}>temp for refresh testing</button> */}
  
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
  console.log("===NODE TOP id",props.parentId,props.nodeId)
  const {data} = useQuery(["nodes",props.driveId,props.parentId],loadFolderContent,{staleTime:30000})
  const children = useQuery(["nodes",props.driveId,props.nodeId],loadFolderContent,{staleTime:30000})

  const nodeData = data[props.parentId][props.nodeId];
  const indentPx = 20;
  let bgcolor = "#e2e2e2";
  if (props.appearance === "selected") { bgcolor = "#6de5ff"; }
  if (props.appearance === "dropperview") { bgcolor = "#53ff47"; }
  if (props.appearance === "dragged") { bgcolor = "#f3ff35"; }  

  let numChildren = 0;
  if (children && children.data){
    numChildren = Object.keys(children.data[props.nodeId]).length;
  }

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
      props.handleClickNode({ nodeData, shiftKey: e.shiftKey, metaKey: e.metaKey })
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
    }}>{toggle} [FOLDER] {nodeData.label} ({numChildren}){deleteNode}</div></div>
  
  </>
// }
})
