import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  useQuery,
  useQueryCache,
  QueryCache,
  ReactQueryCacheProvider,
} from 'react-query'
import axios from "axios";
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
  return useQuery(["nodes",parentId], loadFolderContent,{staleTime:10000})
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
  let openNodesObj = useRef({});
  let toggleAction = useRef([]);
  // const [selectedNodes,setSelectedNodes] = useState({});
  const [loadData,setLoadData] = useState(0)

  const cache = useQueryCache();
  // const { data, error, isFetching, isLoading } = useNodes(props.drive);
 

  

  // //------------------------------------------
  // //****** End of use functions  ***********
  // //------------------------------------------

  //Handle open and closed folders
  if (toggleAction.current.length > 0){
    const [isOpen,nodeId] = toggleAction.current;
  if (isOpen){
    delete openNodesObj.current[nodeId]
  }else{
    openNodesObj.current[nodeId] = true;
  }
    toggleAction.current = [];
  }

  

  // if (isFetching){
  //   console.log(">>>Browser fetching")
  // }
  // if (isLoading){
  //   console.log(">>>Browser loading")
  //   return "Loading...";
  // }

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

  const handleFolderToggle = useCallback((wasOpen,nodeId)=>{
    toggleAction.current = [wasOpen,nodeId];
    setLoadData((x)=>x+1)
  },[])

  function buildNodes(parentId,sortingOrder,nodesJSX=[],level=0){
    let folderData = cache.getQueryData(["nodes",parentId]);
    if (!folderData){
      //TODO: Make key unique
      nodesJSX.push(<p key="nodata">Loading...</p>)
        let folderQueryPromise = cache.fetchQuery(["nodes",parentId],loadFolderContent,{cacheTime:30000})
        folderQueryPromise.then((data)=>{
          //TODO: Store nodes,nodeid,"number of children" here
          console.log(">>>DATA!!",data)
          setLoadData((x)=>x+1)
        })
    }else{

      let nodeArray = getSortedChildren(parentId,sortingOrder);
      for (const node of nodeArray){
        let isOpen = false;
        if (openNodesObj.current[node.id]){ isOpen = true;}
        console.log("determine isOpen",openNodesObj.current)
        nodesJSX.push(<Node key={`node${node.id}`} queryData={node} isOpen={isOpen} handleFolderToggle={handleFolderToggle} level={level}/>)
        if (isOpen){
          buildNodes(node.id,sortingOrder,nodesJSX,level+1)
        }
  
      }
    }


  
    return nodesJSX;
  }
  const nodes = buildNodes(pathDrive,sortingOrder);
  console.log(">>>loadData",loadData)

  return <>
  <h1>Browser</h1>
  {nodes}
  <button onClick={()=>setLoadData((x)=>x+1)}>temp</button>
  
  <ReactQueryDevtools />
  </>
}

const Node = React.memo(function Node(props){
  let data = props.queryData;
  console.log("===NODE TOP ",data.id)
  let openOrClose = "Open";
  if (props.isOpen){ openOrClose = "Close"}
  return <>
  <div><button onClick={()=>props.handleFolderToggle(props.isOpen,data.id)}>{openOrClose}</button>{data.label}</div>
  </>
})
