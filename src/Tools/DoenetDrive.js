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
import GlobalFont from "../fonts/GlobalFont.js";


const itemVersionsSelector = selectorFamily({
  key:"itemInfoSelector",
  get:(driveIdItemId)=>({get})=>{
    //Load versions from database
    return [{title:"one",contentId:"123"}]
  }
})

const selectedInformation = selector({
  key:"selectedInformation",
  get:({get})=>{
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
      versions = get(itemVersionsSelector({driveId,itemId}))
    }
    return {number:globalSelected.length,itemInfo,versions}
  }
})

const ItemInfo = function (props){
  // console.log("=== 🧐 Item Info")
  const infoLoad = useRecoilValueLoadable(selectedInformation);
  const setOverlayOpen = useSetRecoilState(openOverlayByName);

  // console.log(">>>infoLoad",infoLoad)

  if (infoLoad.contents?.number > 1){
    return <>
    <h1>{infoLoad.contents.number} Items Selected</h1>
    </>
  }else if (infoLoad.contents?.number < 1){
    return null;
  }

  const itemInfo = infoLoad?.contents?.itemInfo;
  const versions = infoLoad?.contents?.versions;
  console.log(">>>itemInfo",itemInfo)
  console.log(">>>versions",versions)
 const openEditor =   <div>
          <div
            onClick={() => {
              setOverlayOpen("Editor");
            }}
          >
            Version 1
          </div>
        </div>

  return <>
  <h1>{itemInfo.label}</h1>
  
  {openEditor}
  </>
}


export default function DoenetDriveTool(props) {
  console.log("=== 💾 Doenet Drive Tool");
  const setOverlayOpen = useSetRecoilState(openOverlayByName);
  const setSupportVisiblity = useSetRecoilState(supportVisible);

  return (
    <Tool>
      <navPanel>
      <GlobalFont/>
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
