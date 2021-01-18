import React, {useContext, useState, useCallback, useRef, useEffect} from 'react';
import axios from "axios";
import nanoid from 'nanoid';
import './util.css';

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

import {folderDictionarySelector} from './Drive';


export default function AddItem(props){
  console.log("=== AddItem")

    return  <Router ><Switch>
           <Route path="/" render={(routeprops)=>
           <AddItemRouted route={{...routeprops}} />
           }></Route>
         </Switch></Router>
       
}

function AddItemRouted(props){
  console.log("=== AddItemRouted")
  
  // console.log(props)
  //TODO: driveId and folderId come from route
  // let driveId = "";
  // let folderId = "";
  // let selectedItemId = "";
  let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
  let path = ":::";
  if (urlParamsObj.path){
    path = urlParamsObj.path;
    // let [routePathDriveId,routePathFolderId,pathItemId,pathItemType] = urlParamsObj.path.split(":");
  }
  let [driveId,folderId,selectedItemId,pathItemType] = path.split(":");

  //  driveId = routePathDriveId;
  //  folderId = routePathFolderId;
  //  selectedItemId = pathItemId;

    // const driveId = "ZLHh5s8BWM2azTVFhazIH";
  // const folderId = "ZLHh5s8BWM2azTVFhazIH";
  // const selectedItemId = "f2";
  const [folderInfo,setFolderInfo] = useRecoilStateLoadable(folderDictionarySelector({driveId:driveId,folderId:folderId}))

  const [label,setLabel] = useState("")

  if (!driveId){ return <div>Select something to enable add item</div>}

  return <div><input type="text" value={label} onChange={(e)=>setLabel(e.target.value)}/>
  <button onClick={()=>{setFolderInfo({
    instructionType:"addItem",
    label,
    selectedItemId,
    itemType:"Folder"
    });setLabel("")}}>Add Folder</button>
    <button onClick={()=>{setFolderInfo({
    instructionType:"addItem",
    label,
    selectedItemId,
    itemType:"Url"
    });setLabel("")}}>Add URL</button>
    <button onClick={()=>{setFolderInfo({
    instructionType:"addItem",
    label,
    selectedItemId,
    itemType:"DoenetML"
    });setLabel("")}}>Add DoenetML</button>
  </div>
}
