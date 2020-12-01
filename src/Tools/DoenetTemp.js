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
  }} >Move to Course</button>
    <button onClick={()=>{
moveNodes({sourceArr:[
  {driveId:"course",parentId:"h2",nodeId:"uG8qTnZAOk9rbf7nhn3Ga",type:"folder"},
  {driveId:"course",parentId:"h2",nodeId:"S-MMeUy1ZZtK7x5PXWUFV",type:"folder"},
  {driveId:"course",parentId:"h2",nodeId:"pGSy25ktWmK5-2hi4VAad",type:"folder"},
],destinationObj:{driveId:"content",parentId:"f2"}})
}} >Move to Content</button> */}
  <div style={{display:"flex"}}> 
  <div>
  <BrowserRouted drive="content" isNav={true} driveSync={driveSync} />
  {/* <BrowserRouted drive="course" isNav={true} driveSync={driveSync} /> */}
  </div>
  <div>
  {/* <BrowserRouted drive="content" driveSync={driveSync} setSelectedNodes={setSelectedNodes}/> */}
  {/* <BrowserRouted drive="course" driveSync={driveSync} setSelectedNodes={setSelectedNodes}/> */}
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
        //We are adding a folder so we need the previous folders
        //Find the most recent mention of parentId
        

      old.push({
          add:{
            driveId:obj.driveId,
            node:{
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

const fetchChildrenNodes = async (queryKey,driveId,fetchMoreParentId) => {
  console.log(">>>queryKey",queryKey,driveId,fetchMoreParentId)
  if (!fetchMoreParentId){return {init:true}} //First Query returns no data
  let parentId = fetchMoreParentId;
  if (!parentId){
    parentId = driveId;
  }
  // console.log(`>>>fetchChildrenNodes driveId='${driveId}' parentId='${parentId}' fetchMoreParentId='${fetchMoreParentId}' `)

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

  let nodeIdToDataIndex = useRef({});
  let nodeIdToChildren = useRef({});

  const {
    data,
    isFetching, 
    isFetchingMore, 
    fetchMore, 
    error} = useInfiniteQuery(['nodes',props.drive], fetchChildrenNodes, {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        console.log(">>>data",data);
        if (Object.keys(data[0])[0] === "init"){
          data[0] = {folderChildren:{},node:{}}
        }else{
          console.log(">>>data[1]",data[1])
          let actionOrId = Object.keys(data[1])[0];
          if (actionOrId === "add"){
            console.log(">>>ADD!!!!")
          }else{
            let contentIds = [];
            for (let nodeId of Object.keys(data[1][actionOrId])){
              let nodeObj = data[1][actionOrId][nodeId];
              contentIds.push(nodeId);
              data[0].node[nodeId] = nodeObj;

            }
            data[0].folderChildren[actionOrId] = {sortings:{0:contentIds}};
            data.pop();
            console.log(data)
          }
        }
      //   const indexOfLastItem = data.length-1;
      //   //Protect if data is already converted to an array
      //   if (Array.isArray(data[indexOfLastItem])){ 
      //    let [nodeIdToDataIndexTemp,nodeIdToChildrenTemp] = props.driveSync.get(props.drive);
      //    nodeIdToDataIndex.current = nodeIdToDataIndexTemp;
      //    nodeIdToChildren.current = nodeIdToChildrenTemp;
      //   }else{

      //   let parentNodeId = Object.keys(data[indexOfLastItem])[0];
      //   if (parentNodeId === "add"){
      //     //Latest data is instructions for adding
      //     const addFolderObj = data[indexOfLastItem].add.node;
      //     if (data[indexOfLastItem].add.driveId === props.drive){
      //       let childrenIds = [];
      //       if (nodeIdToDataIndex.current[addFolderObj.parentId]){
      //         childrenIds = [...data[nodeIdToDataIndex.current[addFolderObj.parentId]]]
      //       }
      //       nodeIdToDataIndex.current[addFolderObj.parentId] = indexOfLastItem;
      //       nodeIdToChildren.current[addFolderObj.id] = addFolderObj;
      //       childrenIds.push(addFolderObj.id)
      //       data[indexOfLastItem] = childrenIds;
      //     }
          
      //   }else if (parentNodeId === "delete"){
      //     //Latest data is instructions for delete
      //     const deleteFolderObj = data[indexOfLastItem].delete;
      //     if (deleteFolderObj.driveId === props.drive){
      //       let childrenIds = [];
      //       if (nodeIdToDataIndex.current[deleteFolderObj.parentId]){
      //         childrenIds = [...data[nodeIdToDataIndex.current[deleteFolderObj.parentId]]]
      //       }
      //       nodeIdToDataIndex.current[deleteFolderObj.parentId] = indexOfLastItem;
      //       console.log(JSON.parse(JSON.stringify(childrenIds)));
            
      //       childrenIds.splice(childrenIds.indexOf(deleteFolderObj.id),1)
      //       console.log(JSON.parse(JSON.stringify(childrenIds)));

      //       data[indexOfLastItem] = childrenIds;
      //     }
      //   }else{
      //     nodeIdToDataIndex.current[parentNodeId] = indexOfLastItem;
      //     let childrenIds = [];
      //     for (let nodeId of Object.keys(data[indexOfLastItem][parentNodeId])){
      //       childrenIds.push(nodeId)
      //       //Need to not change object to prevent refreshes so reuse the same one
      //       if (!nodeIdToChildren.current[nodeId]){
      //         nodeIdToChildren.current[nodeId] = data[indexOfLastItem][parentNodeId][nodeId];
      //       }
      //     }
      //     data[indexOfLastItem] = childrenIds;
      //   }

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

  function updateSelection(nodeIdObj){
    //setSelectedNodes
      //{driveId:"id",selectedArr:[{parentId:"id",nodeId:"id"}]}
      let selectedArr = [];
      for (let nodeId of Object.keys(nodeIdObj)){
        let obj = nodeIdToChildren.current[nodeId];
        let parentId = obj.parentId;
        selectedArr.push({parentId,nodeId})
      }
      if (props.setSelectedNodes){
        props.setSelectedNodes({
          driveId:props.drive,
          selectedArr
        });
      }
  }

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
          updateSelection(newObj)
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
          updateSelection(newObj)
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
          updateSelection(newObj)
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
    let index = nodeIdToDataIndex.current[parentId];

    let parentArr = data[index];

    if (parentArr === undefined){
      //Need data
      nodesJSX.push(<LoadingNode key={`loading${nodeIdArray.length}`}/>);
      fetchMore(parentId);

    }else{
      if (parentArr.length === 0){nodesJSX.push(<EmptyNode key={`empty${nodeIdArray.length}`}/>)}

      for(let nodeId of parentArr){
        nodeIdArray.push(nodeId); //needed to calculate shift click selections
        let node = nodeIdToChildren.current[nodeId];
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
          key={`node${node.id}`} 
          browserId={browserId.current}
          node={node}
          nodeId={node.id}
          driveId={props.drive}
          parentId={parentId}
          deleteFolderHandler={deleteFolderHandler}
          isOpen={isOpen} 
          appearance={appearance}
          handleFolderToggle={handleFolderToggle} 
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
  // if (data){
  //   [nodes,nodeIdArray] = buildNodes({driveId:props.driveId,parentId:rootFolderId,sortingOrder});
  //   nodeIdRefArray.current = nodeIdArray;
  // }
  

  return <>
  <div>
  <h3>{props.drive} {props.isNav?"Nav":null}</h3>
  </div>
  
  <button onClick={()=>{fetchMore('f2');}}>fetch f2</button>
  {nodes}
  {/* <button onClick={()=>{
    fetchMore('f1');
  }}>Fetch content,f1</button> */}
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
