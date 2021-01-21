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

import {folderDictionarySelector, globalSelectedNodesAtom} from './Drive';


export default function AddItem(props){
  // console.log("=== AddItem")

    return  <Router ><Switch>
           <Route path="/" render={(routeprops)=>
           <AddItemRouted route={{...routeprops}} />
           }></Route>
         </Switch></Router>
       
}

function AddItemRouted(props){

  const globalSelected = useRecoilValue(globalSelectedNodesAtom);
  const selectedItemId = globalSelected[0]?.itemId;
  const driveId = globalSelected[0]?.driveId;
  const folderId = globalSelected[0]?.parentFolderId;
  let folderInfo = useRecoilStateLoadable(folderDictionarySelector({driveId,folderId})); 
  let itemInfo = folderInfo[0]?.contents?.contentsDictionary?.[selectedItemId];
  
  const [isExpanded, setIsExpanded] = useState(false);
  if (itemInfo?.itemType !== "Folder") return <></>;

  return <div>
    { !isExpanded ? 
      <div>
        <button data-doenet-drive-stayselected onClick={()=>{setIsExpanded(true)}}>Add Item</button>
      </div> :
      <div>
        <div className="headingContainer" style={{display: "flex", justifyContent: "space-between", padding: "3px"}}>
          <span><strong>Add Item to {itemInfo.label}</strong></span>
          <button onClick={()=>{setIsExpanded(false)}}>X</button>
        </div>
        <div>
          {
            // get add form, dispatch format, getter for form fields
            <AddNewFolderForm driveId={driveId} folderId={selectedItemId} callback={()=>{setIsExpanded(false)}}/>

          }
        </div>
      </div>
    }

  </div>
}

function AddNewFolderForm(props) {
  
  const { driveId, folderId } = props;
  const [_, setFolderInfo] = useRecoilStateLoadable(folderDictionarySelector({driveId, folderId}))

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const label = ev.target.label.value;
    dispatchAddInstruction({label});
    props.callback?.();
  }

  const dispatchAddInstruction = ({label}) => {
    setFolderInfo({
      instructionType:"addItem",
      label,
      selectedItemId: null,
      itemType:"Folder"
    });
  }

  return (
    <div>
      <span>New Folder</span>
      <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Label: </label>
            <input
              type="text"
              name="label"
              required
            />
          </div>
          <div className="form-group">
            <label>Other details: </label>
          </div>
          <div className="form-group" style={{display:"flex", justifyContent:"flex-end"}}>
            <input className="btn btn-primary" type="submit" value="Add"/>
          </div>
      </form>
    </div> 
  )
}

// function AddItemRouted(props){
//   // console.log("=== AddItemRouted")
  
//   // console.log(props)
//   //TODO: driveId and folderId come from route
//   const driveId = "ZLHh5s8BWM2azTVFhazIH";
//   const folderId = "ZLHh5s8BWM2azTVFhazIH";
//   const selectedItemId = "f2";
//   const [folderInfo,setFolderInfo] = useRecoilStateLoadable(folderDictionarySelector({driveId,folderId}))

//   const [label,setLabel] = useState("")

//   return <div><input type="text" value={label} onChange={(e)=>setLabel(e.target.value)}/>
//   <button onClick={()=>{setFolderInfo({
//     instructionType:"addItem",
//     label,
//     selectedItemId,
//     itemType:"Folder"
//     });setLabel("")}}>Add Folder</button>
//     <button onClick={()=>{setFolderInfo({
//     instructionType:"addItem",
//     label,
//     selectedItemId,
//     itemType:"Url"
//     });setLabel("")}}>Add URL</button>
//   </div>
// }