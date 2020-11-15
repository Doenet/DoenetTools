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
<Other />
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
  console.log(">>>loadFolderContent",parentId,data.contents)

  //TODO: Handle fail
  return data.contents;
}

function useNodes(_,parentId) {
  if (!parentId){parentId = "content"}
  return useQuery(["nodes",parentId], loadFolderContent,{staleTime:1000})
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
  console.log(">>>TOP OF OTHER")
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
      return [{id: "f1", label: "Folder One", parentId: "content", type: "Folder"},
              {id: "f2", label: "Folder Two", parentId: "content", type: "Folder"}]
    })
    }}>update folder 1 Label</button>
  </>;
}

function Browser(){
  console.log(">>>TOP OF BROWSER")
  const [openNodes,setOpenNodes] = useState({});
  // const [selectedNodes,setSelectedNodes] = useState({});

  // const cache = useQueryCache();
  const { status, data, error, isFetching, isLoading } = useNodes();
 
  //temp
  // const [label,setLabel] = useState("")

  if (isFetching){
    console.log(">>>Browser fetching")
  }
  if (isLoading){
    console.log(">>>Browser loading")
    return "Loading...";
  }

  //Only retrieves if it exists
  // let subData = cache.getQueryData(["nodes","f2"]);
  // console.log(subData)
  //Make a new query

  // let loadFolder = async (parentId) => {
  //   let data;
  //   try {
  //     data = await cache.fetchQuery(["nodes",parentId],loadFolderContent);

  //   } catch (error){
  //     console.log(error)
  //   }
  //   return data
  // }
  
  return <>
  <h1>Browser</h1>
  {/* <button onClick={()=>{
  let subData = loadFolder("f1")
  subData.then((x)=>{
    setLabel(x[0].label)
  })
    // console.log(subData)
  }}>get data</button>
  <div>label:{label}</div> */}
  
  {/* {data.map(node=>{
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
  })} */}
  {data.map(node=>{
    return <div key={`node${node.id}`}>{node.label}</div>
  })}
  <ReactQueryDevtools />
  </>
}
