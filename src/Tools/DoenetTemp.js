import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  useQuery,
  useQueryCache,
  QueryCache,
  ReactQueryCacheProvider,
} from 'react-query'
import axios from "axios";
import './util.css';
import { ReactQueryDevtools } from 'react-query-devtools'

const queryCache = new QueryCache();

export default function app() {
return <>
<ReactQueryCacheProvider queryCache={queryCache}>
<Browser drive="content" />
</ReactQueryCacheProvider>
</>
};

const loadFolderContent = async (_,parentId) => {
    const { data } = await axios.get(
    `/api/loadFolderContent.php?parentId=${parentId}`
  );
  //TODO: Handle fail
  return data.results;
}

function useNodes(_,parentId) {
  if (!parentId){parentId = "content"}
  return useQuery(["nodes",parentId], loadFolderContent,{staleTime:30000})
}

// function useNodes(_,parentId) {
//   if (!parentId){parentId = "content"}
//   return useQuery(["nodes",parentId], async (parentId)=>{
//     const { data } = await axios.get(
//       `/api/loadFolderContent.php?parentId${parentId}`
//     );
//     //TODO: Handle fail
//     return data.contents;
//   })
// }


function Browser(props){
  console.log(`===TOP OF BROWSER drive=${props.drive}`)
  const [sortingOrder, setSortingOrder] = useState("alphabetical label ascending")
  const [toggleNodeId,setToggleNode] = useState([]);
  const [openNodesObj,setOpenNodesObj] = useState({});
  // const [selectedNodes,setSelectedNodes] = useState({});
  const [refreshNumber,setRefresh] = useState(0)

  const cache = useQueryCache();

  // //------------------------------------------
  // //****** End of use functions  ***********
  // //------------------------------------------


  let pathDrive = props.drive; //TODO: React Router

  function getSortedChildren(parentId,sortingOrder){
    let resultArray = cache.getQueryData(["nodes",parentId,sortingOrder]);
    console.log(">>>resultArray",parentId,resultArray)
    if (!resultArray){
      console.log("SORTING!")
      resultArray = [];
      let nodeData = cache.getQueryData(["nodes",parentId]);
      let childrenNodeObjs = nodeData[parentId];
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
  
      cache.setQueryData(["nodes",parentId,sortingOrder],resultArray,{cacheTime:Infinity})
    }
    return resultArray;
  }

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

  

  function buildNodes(parentId,sortingOrder,nodesJSX=[],nodeIdArray=[],level=0){
    let folderData = cache.getQueryData(["nodes",parentId]);
    if (!folderData){
      //TODO: Make key unique
      nodesJSX.push(<LoadingNode key={`loading${nodeIdArray.length}`}/>);
        let folderQueryPromise = cache.fetchQuery(["nodes",parentId],loadFolderContent,{cacheTime:30000})
        folderQueryPromise.then((data)=>{
          setRefresh((x)=>x+1)
        })
    }else{

      let nodeArray = getSortedChildren(parentId,sortingOrder);
      if (nodeArray.length === 0){nodesJSX.push(<EmptyNode key={`empty${nodeIdArray.length}`}/>)}
      for (const node of nodeArray){
        nodeIdArray.push(node.id);
        let isOpen = false;
        if (openNodesObj[node.id]){ isOpen = true;}

        nodesJSX.push(<Node 
          key={`node${node.id}`} 
          // queryData={node} 
          nodeId={node.id}
          parentId={parentId}
          isOpen={isOpen} 
          handleFolderToggle={handleFolderToggle} 
          level={level}/>)
        if (isOpen){
          buildNodes(node.id,sortingOrder,nodesJSX,nodeIdArray,level+1)
        }
  
      }
    }


  
    return [nodesJSX,nodeIdArray];
  }
  const [nodes,nodeIdArray] = buildNodes(pathDrive,sortingOrder);
  console.log(">>>nodeIdArray",nodeIdArray)

  return <>
  <h1>Browser</h1>
  {nodes}
  <button onClick={()=>setRefresh((x)=>x+1)}>temp for refresh testing</button>
  
  <ReactQueryDevtools />
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

const Node = React.memo(function Node(props){
  const {data,isLoading,isFetching} = useQuery(["nodes",props.parentId],loadFolderContent,{staleTime:30000})
  const nodeData = data[props.parentId][props.nodeId];
  console.log("===NODE TOP id",props.parentId,props.nodeId)
  console.log(">>>nodeData",nodeData)
  const indentPx = 20;
  let bgcolor = "#e2e2e2";
  if (props.appearance === "selected") { bgcolor = "#6de5ff"; }
  if (props.appearance === "dropperview") { bgcolor = "#53ff47"; }
  if (props.appearance === "dragged") { bgcolor = "#f3ff35"; }  
  // let propdata = props.queryData;
  let children = data[props.nodeId];
  let numChildren = Object.keys(children).length;

  //Toggle
  let openOrClose = "Open";
  if (props.isOpen){ openOrClose = "Close"}
  const toggle = <button onClick={()=>props.handleFolderToggle(props.nodeId)}>{openOrClose}</button>

  //Delete
  const deleteNode = <button>X</button>

  return <>
  <div
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
})
