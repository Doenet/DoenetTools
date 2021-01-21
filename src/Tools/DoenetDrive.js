import React, { useState } from "react";
import Tool, { openOverlayByName } from "../imports/Tool/Tool";
import Drive, { globalSelectedNodesAtom, folderDictionary} from "../imports/Drive";
import AddItem from '../imports/AddItem'
import Switch from "../imports/Switch";
import {
  atom,
  useSetRecoilState,
  useRecoilState,
  useRecoilValue,
  selector,
  atomFamily,
  selectorFamily,
  RecoilRoot,
  useRecoilValueLoadable,
} from "recoil";
import { BreadcrumbContainer } from "../imports/Breadcrumb";
import { supportVisible } from "../imports/Tool/SupportPanel";
import axios from "axios";
import Button from "../imports/PanelHeaderComponents/Button.js";



const itemVersionsSelector = selectorFamily({
  key:"itemInfoSelector",
  get:(branchId)=> async ({get})=>{
    // Load versions from database
    const { data } = await axios.get(
      `/api/loadVersions.php?branchId=${branchId}`
    );
    return data.versions
  }
})

const selectedInformation = selector({
  key:"selectedInformation",
  get: ({get})=>{
    const globalSelected = get(globalSelectedNodesAtom);
    if (globalSelected.length !== 1){
      return {number:globalSelected.length}
    }
    //Find information if only one item selected
    const driveId = globalSelected[0].driveId;
    const folderId = globalSelected[0].parentFolderId;
    let folderInfo = get(folderDictionary({driveId,folderId})); 
    const itemId = globalSelected[0].itemId;
    let itemInfo = folderInfo.contentsDictionary[itemId];
    let versions = [];
    if (itemInfo.itemType === "DoenetML"){
      let branchId = itemInfo.branchId;
      versions = get(itemVersionsSelector(branchId))
    }
    return {number:globalSelected.length,itemInfo,versions}
  }
})

const ItemInfo = function (props){
  //data-doenet-drive-stayselected
  // console.log("=== 🧐 Item Info")
  const infoLoad = useRecoilValueLoadable(selectedInformation);
  const setOverlayOpen = useSetRecoilState(openOverlayByName);

  // console.log(">>>infoLoad",infoLoad)
  if (infoLoad.state === "loading"){ return null;}
  if (infoLoad.state === "hasError"){ 
    console.error(infoLoad.contents)
    return null;}

    const editDraft =   <button 
    data-doenet-drive-stayselected
     onClick={()=>setOverlayOpen('Editor')}>Edit Draft</button>

  if (infoLoad.contents?.number > 1){
    return <>
    <h1>{infoLoad.contents.number} Items Selected</h1>
    </>
  }else if (infoLoad.contents?.number < 1){

 return <>{editDraft}</>
    return null;
  }

  const itemInfo = infoLoad?.contents?.itemInfo;
  const versions = infoLoad?.contents?.versions;
  console.log(">>>itemInfo",itemInfo)
  const versionsJSX = [];
  let draftObj;
  for (let version of versions){
    if (version.isDraft === "1"){
      draftObj = version;
    }else{
      versionsJSX.push(<div
      key={`versions${version.timestamp}`}
    data-doenet-drive-stayselected
        onClick={() => {
          //set activeBranchInfo to version
          setOverlayOpen("Editor");
        }}
      >
        {version.title}
      </div>)
    }
  }

  return <div
  data-doenet-drive-stayselected
  tabIndex={0}
  style={{height:"100%"}}
  >
    

  <h1>{itemInfo.label}</h1>
  <AddItem />
  
  {versionsJSX}
  {editDraft}
  </div>
}


export default function DoenetDriveTool(props) {
  console.log("=== 💾 Doenet Drive Tool");
  const setOverlayOpen = useSetRecoilState(openOverlayByName);
  const setSupportVisiblity = useSetRecoilState(supportVisible);
console.log(">>>")
  return (
    <Tool>
      <navPanel>
        <Drive types={['content','course']}  urlClickBehavior="select" />
      </navPanel>

      <headerPanel title="my title">
        <Switch
          onChange={(value) => {
            setSupportVisiblity(value);
          }}
        />
        <p>header for important stuff</p>
      </headerPanel>

      <mainPanel>
      <button
            onClick={() => {
              setOverlayOpen("Bob");
            }}
          >
            Open Bob
          </button>
        <BreadcrumbContainer /> 
        <AddItem />

        <Drive types={['content','course']}  urlClickBehavior="select" />
      </mainPanel>

      <menuPanel title="Item Info">
        <ItemInfo />
      </menuPanel>

      <overlay name="Editor">
        <headerPanel title="my title">
          
          <p>Title of edited</p>
          <button
            onClick={() => {
              setOverlayOpen("");
            }}
          >
            Go Back
          </button>
        </headerPanel>

        <mainPanel>
          <p>DoenetViewer</p>
        
        </mainPanel>

        <supportPanel width="40%">
          <p>Text Editor</p>
        </supportPanel>
  
      </overlay>

     
    </Tool>
  );
}
