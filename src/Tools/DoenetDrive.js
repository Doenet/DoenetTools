import React, { useState } from "react";
import Tool, { openOverlayByName } from "../imports/Tool/Tool";
import Drive, { globalSelectedNodesAtom, folderDictionary, clearAllSelections} from "../imports/Drive";
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

const driveFolderItemVersion = selectorFamily({
  key:"driveFolderItemVersion",
  get: (driveIdFolderIdItemId)=> async ({get})=>{
    let folderInfo = get(folderDictionary({driveId:driveIdFolderIdItemId.driveId,folderId:driveIdFolderIdItemId.folderId})); 
    let itemInfo = folderInfo?.contentsDictionary?.[driveIdFolderIdItemId.itemId];
    let versions = [];
    if (itemInfo?.itemType === "DoenetML"){
      let branchId = itemInfo.branchId;
      versions = get(itemVersionsSelector(branchId))
    }
    if (!itemInfo && driveIdFolderIdItemId.folderId === driveIdFolderIdItemId.itemId){
      //TODO: Remove this when drive information is available
      if (driveIdFolderIdItemId.driveId !==driveIdFolderIdItemId.folderId){
        itemInfo = folderInfo?.folderInfo;
      }
    }

    return {itemInfo,versions}
}})

const ItemInfo = function (props){
  //data-doenet-drive-stayselected
  // console.log("=== 🧐 Item Info")
  const infoLoad = useRecoilValueLoadable(selectedInformation);
  const setOverlayOpen = useSetRecoilState(openOverlayByName);



    //Use Route to determine path variables
  let routePathDriveId = "";
  let routePathFolderId = "";  
  let pathItemId = "";  
  let pathItemType = "";
  let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
  //use defaults if not defined
  if (urlParamsObj?.path !== undefined){
    [routePathDriveId,routePathFolderId,pathItemId,pathItemType] = urlParamsObj.path.split(":");
  }
 
  const pathFolderInfo = useRecoilValueLoadable(driveFolderItemVersion({driveId:routePathDriveId,folderId:routePathFolderId,itemId:pathItemId}))


    // console.log(">>>infoLoad",infoLoad)
    if (infoLoad.state === "loading"){ return null;}
    if (infoLoad.state === "hasError"){ 
      console.error(infoLoad.contents)
      return null;}
   
      let itemInfo = infoLoad?.contents?.itemInfo;
      let versions = infoLoad?.contents?.versions;

  if (infoLoad.contents?.number > 1){
    return <>
    <h1>{infoLoad.contents.number} Items Selected</h1>
    </>
  }else if (infoLoad.contents?.number < 1){

    if (pathFolderInfo.state === "loading"){ return null;}
    if (pathFolderInfo.state === "hasError"){ 
      console.error(pathFolderInfo.contents)
      return null;}

  itemInfo = pathFolderInfo?.contents?.itemInfo;
  versions = pathFolderInfo?.contents?.versions;


    if (!itemInfo){
      return <div>Nothing Selected</div>;
    }
  }

 
  let editDraft = null;
  if (itemInfo?.itemType === "DoenetML"){
    editDraft =   <button 
    onClick={()=>setOverlayOpen('Editor')}>Edit Draft</button>
  }
  



  // console.log(">>>itemInfo",itemInfo)
  const versionsJSX = [];
  let draftObj;
  for (let version of versions){
    if (version.isDraft === "1"){
      draftObj = version;
    }else{
      versionsJSX.push(<div
      key={`versions${version.timestamp}`}
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
  const clearSelections = useSetRecoilState(clearAllSelections);

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
      {/* <button
            onClick={() => {
              setOverlayOpen("Bob");
            }}
          >
            Open Bob
          </button> */}
        <BreadcrumbContainer /> 
        <div 
        // className="noselect nooutline" 

        onClick={()=>{
          clearSelections();
        }}
        style={{height:"100%",width:"100%"}}>
        <Drive types={['content','course']}  urlClickBehavior="select" />

        </div>
      </mainPanel>

      <menuPanel title="Item Info">
        <ItemInfo route={props.route} />
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
