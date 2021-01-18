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

import {folderDictionarySelector} from './Drivenew';


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
  const driveId = "ZLHh5s8BWM2azTVFhazIH";
  const folderId = "ZLHh5s8BWM2azTVFhazIH";
  const selectedItemId = "f2";
  const [folderInfo,setFolderInfo] = useRecoilStateLoadable(folderDictionarySelector({driveId,folderId}))


  const [label,setLabel] = useState("")
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
  </div>
}
