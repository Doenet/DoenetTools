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


const selectedInformation = selector({
  key:"selectedInformation",
  get:({get})=>{
    const globalSelected = get(globalSelectedNodesAtom);
    console.log(">>>globalSelected",globalSelected)
    // folderDictionary({driveId,folderId})
    return {names:["name 1"]}
  }
})

const ItemInfo = function (props){
  console.log("=== 🧐 Item Info")
  const infoLoad = useRecoilValueLoadable(selectedInformation);
  const setOverlayOpen = useSetRecoilState(openOverlayByName);

  console.log(">>>infoLoad",infoLoad)

 const openEditor =     <div>
          <button
            onClick={() => {
              setOverlayOpen("Editor");
            }}
          >
            Go to Overlay
          </button>
        </div>

  return <>
  <h1>Info</h1>
  {/* <p>Name: {infoLoad.names[0]}</p> */}
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
