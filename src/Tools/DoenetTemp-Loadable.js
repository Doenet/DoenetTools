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
    get: (driveId) => async ({get})=>{
    get(refreshAtom);
    console.log("load drive query!!!",driveId)
    const { data } = await axios.get(
      `/api/loadFolderContent.php?parentId=${driveId}&driveId=${driveId}&init=true`
    );
    
    return {init:true,data}
  }
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

function Demo(){
const driveId = 'ZLHh5s8BWM2azTVFhazI2';
const setRefresh = useSetRecoilState(refreshAtom);
 const [num,setNum] = useState(0);
  // const availableDrives = useRecoilValueLoadable(availableDrivesQuery)
  // console.log(availableDrives);
  let itemList = null;

const driveInfo = useRecoilValueLoadable(loadDriveInfoQuery(driveId))
console.log(driveInfo);

if (driveInfo.state === "loading"){itemList = <div>Loading...</div>}
if (driveInfo.state === "hasValue"){
  itemList = [];
  for (let item of driveInfo.contents.data.results){
    itemList.push(<div key={`item${item.id}`}>{item.label}</div>)
  }
}

  return <>
  <button onClick={()=>setRefresh(old=>old+1)}>Refresh Recoil Queries (<RefreshIndicator />)</button>
  <button onClick={()=>{setNum(old=>old+2)}} >Refresh Demo Component</button>
  {itemList}
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

