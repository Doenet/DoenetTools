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
      `/api/loadFolderContent.php?driveId=${driveId}&init=true`
    );
    console.log("GOT DATA ",data)
    // return {init:false,data}
    return {data}
    // return data;
  },
 
})

let itemDictionary = atomFamily({
  key:"itemDictionary",
  default:selectorFamily({
    key:"itemDictionary/Default",
    get:(driveId)=>({get})=>{
      const loaded = get(loadDriveInfoQuery(driveId))
      console.log("itemDictionary atom loaded",loaded)
      const driveInfo = driveId + 'here';
      let dictionary = {};
      for (let item of loaded.data.results){
        dictionary[item.itemId] = item;
      }
      return dictionary;
    } 
  })
})

let itemDictionarySelector = selectorFamily({
  get:(driveId)=>({get})=>{
    return get(itemDictionary(driveId));
  },
  set: (driveId) => ({set,get},newValue)=>{
    set(itemDictionary(driveId),(old)=>{
      console.log("old",old)
    console.log(">>>newValue",newValue)
    let newObj = {...old}
    newObj['newSTuff'] = newValue.data;
      return newObj;
    })
  }
  // set:(setObj,newValue)=>({set,get})=>{
  //   console.log("setObj",setObj,newValue);

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
  // let driveInfo = useRecoilValue(itemDictionary(props.driveId))
  // console.log(driveInfo)
  // return <div>{props.driveId}</div>

  let itemList = null;

  // const driveInfo = useRecoilValueLoadable(loadDriveInfoQuery(props.driveId))
  const [driveInfo,setDriveInfo] = useRecoilStateLoadable(loadDriveInfoQuery(props.driveId))
  const [driveInfo2,setDriveInfo2] = useRecoilStateLoadable(itemDictionarySelector(props.driveId))
  console.log(">>>driveInfo2",driveInfo2)
  // useEffect(()=>{
  //   if (driveInfo.state === "hasValue"){
  //     setDriveInfo(props.driveId);
  // }
  // },[driveInfo.state])
    // let driveInfo =  setDriveInfo(props.driveId);
  
  if (driveInfo.state === "loading"){itemList = <div>Loading...</div>}
  if (driveInfo.state === "hasValue"){
    itemList = [];
    for (let item of driveInfo.contents.data.results){
      itemList.push(<div key={`item${item.itemId}`}>{item.label}</div>)
    }
  }
  return  <div>
    <h1>{props.driveId}</h1>
    
    <button onClick={()=>{setDriveInfo2({action:"addItem",data:{label:"new"}})}}>Add Item</button>
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
  <Drive driveId='ZLHh5s8BWM2azTVFhazIH' />
  {/* <Drive driveId='ZLHh5s8BWM2azTVFhazIH' /> */}
 
  <AddFolder folderId="ZLHh5s8BWM2azTVFhazIH" />
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