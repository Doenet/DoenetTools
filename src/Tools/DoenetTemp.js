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
<Browser />
</ReactQueryCacheProvider>
</>
};

//TODO: HOW?
// async function loadFolderContent(parentId){
//   const { data } = await axios.get(
//     `/api/loadFolderContent.php?parentId${parentId}`
//   );
//   //TODO: Handle fail
//   return data.contents;
// }
const loadFolderContent = async (_,parentId) => {
    const { data } = await axios.get(
    `/api/loadFolderContent.php?parentId=${parentId}`
  );
  console.log(">>>parentId",parentId,data.contents)

  //TODO: Handle fail
  return data.contents;
}

function useNodes(_,parentId) {
  if (!parentId){parentId = "content"}
  return useQuery(["nodes",parentId], loadFolderContent)
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

function Browser(){
  const [openNodes,setOpenNodes] = useState({});
  const [selectedNodes,setSelectedNodes] = useState({});

  const cache = useQueryCache();
  const { status, data, error, isFetching, isLoading } = useNodes();


  if (isLoading){
    return "Loading...";
  }

  //Only retrieves if it exists
  // let subData = cache.getQueryData(["nodes","f2"]);
  // console.log(subData)
  //Make a new query
  let subData = cache.fetchQuery(["nodes","f1"],loadFolderContent)


  return <>
  <button>get data</button>
  {data.map(node=>{
    let isOpen = false;
    if (openNodes[node.id]){ isOpen = true;}
    let openOrClose = "Open";
    if (isOpen){ openOrClose = "Close"}
    return <div key={`node${node.id}`}>
      <button onClick={()=>{
        //Toggle node is open
        let newOpenNodes = {...openNodes};
        if (isOpen){
          delete newOpenNodes[node.id];
        }else{
          newOpenNodes[node.id] = true;
        }
        setOpenNodes(newOpenNodes);
      }}>{openOrClose}</button>
      {node.label}
      </div>
  })}
  <ReactQueryDevtools />
  </>
}
