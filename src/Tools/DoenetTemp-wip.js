import React, {useState, useCallback, useEffect, useRef, useMemo, useContext} from 'react';
import './temp.css';
import axios from "axios";
import './util.css';
import nanoid from 'nanoid';
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";

import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  RecoilRoot,
  useSetRecoilState,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilState,
  useRecoilValue,
} from 'recoil';



export default function app() {
return <RecoilRoot>
    <Demo />
</RecoilRoot>
};

let refreshAtom = atom({
  key:"refreshAtom",
  default:0
})

let loadDriveInfoQuery = selectorFamily({
  key:"loadDriveInfoQuery",
  get: (driveId) => async ({get,set})=>{
    get(refreshAtom);
    console.log("load drive query!!!",driveId)
    const { data } = await axios.get(
      `/api/loadFolderContent.php?parentId=${driveId}&driveId=${driveId}&init=true`
    );
    console.log("GOT DATA ",data)
    return {init:false,data}
  },
  set: (driveId) => ({get,set})=>{
    // const driveInfo = get(loadDriveInfoQuery(driveId));
    // console.log("driveInfo ",driveInfo)

    // if (!driveInfo.init){
      console.log("RUN ONLY ONCE!!!!!!!!!!!!!!!!!")
      set(refreshAtom,10);
      // set(loadDriveInfoQuery,(old)=>{console.log(old); return old})
    // }
  }
  //   get: (driveId) => async ({get})=>{
  //   get(refreshAtom);
  //   console.log("load drive query!!!",driveId)
  //   const { data } = await axios.get(
  //     `/api/loadFolderContent.php?parentId=${driveId}&driveId=${driveId}&init=true`
  //   );
    
  //   return {init:true,data}
  // }
})



let availableDrivesQuery = selector({
  key:"availableDrivesQuery",
  get: async ({get})=>{
    get(refreshAtom);
    console.log("available drives query!!!")
    const { data } = await axios.get(
      `/api/loadAvailableDrives.php`
    );
    return data.driveIdsAndLabels;
  }
})

function Drive(props){
  console.log("=== Drive")
  let itemList = null;

  // const driveInfo = useRecoilValueLoadable(loadDriveInfoQuery(driveId))
  const [driveInfo,setDriveInfo] = useRecoilStateLoadable(loadDriveInfoQuery(props.driveId))
  useEffect(()=>{
    if (driveInfo.state === "hasValue"){
      setDriveInfo({driveId:props.driveId,type:"init"});
  }
  },[driveInfo.state])
  
  if (driveInfo.state === "loading"){itemList = <div>Loading...</div>}
  if (driveInfo.state === "hasValue"){
  
    itemList = [];
    for (let item of driveInfo.contents.data.results){
      itemList.push(<div key={`item${item.id}`}>{item.label}</div>)
    }
  }
  return  <div>
    <h1>{props.driveId}</h1>
    {itemList}
    </div>
}

function Demo(){
  console.log("=== Demo")
const setRefresh = useSetRecoilState(refreshAtom);
 const [num,setNum] = useState(0);
  // const availableDrives = useRecoilValueLoadable(availableDrivesQuery)
  // console.log(availableDrives);
 

  return <>
  <button onClick={()=>setRefresh(old=>old+1)}>Refresh Recoil Queries (<RefreshIndicator />)</button>
  <button onClick={()=>{setNum(old=>old+2)}} >Refresh Demo Component</button>
  <Drive driveId='ZLHh5s8BWM2azTVFhazI2' />
  <Drive driveId='ZLHh5s8BWM2azTVFhazI2' />
 
  <AddFolder folderId="ZLHh5s8BWM2azTVFhazI2" />
  </>
}

function RefreshIndicator(){
  const refreshNum = useRecoilValue(refreshAtom)
  return <>{refreshNum}</>
}

let folderItemsFamily = atomFamily({
  key:"folderItemsFamily",
  default:[]
})

function AddFolder(props){
  const [label,setLabel] = useState("");
  const [folderItems,setFolderItems] = useRecoilState(folderItemsFamily(props.folderId));
  let items = [];
  for(let [i,item] of Object.entries(folderItems)){
    items.push(<div key={`item${i}${props.folderId}`}>{item}</div>)
  }
  return <div>
    <input type="text" value={label} onChange={(e)=>setLabel(e.target.value)} />
    <button
    onClick={()=>{
      setFolderItems((old)=>{
        let newItems = [...old];
        newItems.push(label)
        return newItems;
      });
      setLabel("")
    }}
    >Add Folder</button>
    {items}
  </div>
}

