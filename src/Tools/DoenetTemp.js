import React, {useState} from 'react';
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
  console.log(">>>loadFolderContent",parentId,data.results)

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

function Other(){
  console.log("===TOP OF OTHER")
  const cache = useQueryCache();
  const [refresh,setRefresh] = useState(0)

  // let loadFolder = async (parentId) => {
  //   let data;
  //   try {
  //     data = await cache.fetchQuery(["nodes",parentId],loadFolderContent);

  //   } catch (error){
  //     console.log(error)
  //   }
  //   return data
  // }

  // let f1text = cache.getQueryData(['nodes','f1'])

  // loadFolder("f1").then((x)=>{
  //   console.log(">>>other",x)
  //   // setLabel(x[0].label)
  // })
  // let f1text = cache.getQuery(['nodes','f1'])
  // console.log(">>>other f1text",f1text)
  return <>
 
  <h1>OTHER</h1>
  {/* <button onClick={()=>{
    setRefresh(refresh + 1)
    }}>refresh</button>{refresh} */}
    <button onClick={()=>{
    cache.setQueryData(["nodes","content"],(oldData)=>{
      console.log("other sqd",oldData);
      //Only update Folder 2 to Folder Two
      return [oldData[0],
              {id: "f2", label: "Folder Two", parentId: "content", type: "Folder"}]
    })
    }}>update folder 2 Only</button>
  </>;
}

function Browser(props){
  console.log(`===TOP OF BROWSER drive=${props.drive}`)
  const [sortingOrder, setSortingOrder] = useState("alphabetical label ascending")
  const [openNodes,setOpenNodes] = useState({});
  // const [selectedNodes,setSelectedNodes] = useState({});

  const cache = useQueryCache();
  const { data, error, isFetching, isLoading } = useNodes(props.drive);
 
  //------------------------------------------
  //****** End of use functions  ***********
  //------------------------------------------

  if (isFetching){
    console.log(">>>Browser fetching")
  }
  if (isLoading){
    console.log(">>>Browser loading")
    return "Loading...";
  }

  let pathDrive = props.drive; //TODO: React Router

  function sortedChildren(parentId,sortingOrder){
    let resultArray = cache.getQueryData(["nodes",parentId,sortingOrder]);

    if (!resultArray){
      console.log("SORTING!")
      resultArray = [];
      let childrenNodeObjs = data[parentId];
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

  function handleFolderToggle(isOpen,nodeId){
    let newOpenNodes = {...openNodes};
    if (isOpen){
      delete newOpenNodes[nodeId];
    }else{
      newOpenNodes[nodeId] = true;
    }
    setOpenNodes(newOpenNodes);
  }

  function buildNodes(parentId,sortingOrder,nodesJSX=[],level=0){
    let nodeArray = sortedChildren(parentId,sortingOrder);
    for (const node of nodeArray){
      let isOpen = false;
      if (openNodes[node.id]){ isOpen = true;}
      
      nodesJSX.push(<Node key={`node${node.id}`} queryData={node} isOpen={isOpen} handleFolderToggle={handleFolderToggle} level={level}/>)
      if (isOpen){
        buildNodes(node.id,sortingOrder,nodesJSX,level+1)
      }

    }
    return nodesJSX;
  }
  const nodes = buildNodes(pathDrive,sortingOrder);

  return <>
  <h1>Browser</h1>
  {nodes}
  
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
