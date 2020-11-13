import React from 'react';
import {
  useQuery,
  useQueryCache,
  QueryCache,
  ReactQueryCacheProvider,
} from 'react-query'
import axios from "axios";
import { ReactQueryDevtools } from 'react-query-devtools'

export default function app() {
return <>
<ReactQueryCacheProvider>
<Demo />
</ReactQueryCacheProvider>
</>
};
function useNodes() {
  return useQuery("nodes", async ()=>{
    const { data } = await axios.get(
      "/api/loadFolderContent.php"
    );
    //TODO: Handle fail
    return data.contents;
  })
}

function Demo(){

  const { status, data, error, isFetching, isLoading } = useNodes();
  if (isLoading){
    return "Loading...";
  }
  return <>
  {data.map(node=>{
    return <div key={`node${node.id}`}>
      <button>Open</button>
      {node.label}
      </div>
  })}
  <ReactQueryDevtools />
  </>
}
