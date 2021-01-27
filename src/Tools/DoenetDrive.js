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
import DoenetViewer from './DoenetViewer';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';


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
    onClick={()=>setOverlayOpen({
      name: "editor", //to match the prop
      instructions: { 
        action: "open", //or "close"
        supportVisble: true, //or false
        courseId: "c1",
        branchId: "b1",
      }
    })}>Edit Draft</button>
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

  const [updateNumber,setUpdateNumber] = useState(0);
  const [viewerDoenetML,setViewerDoenetML] = useState("");
  const [editorDoenetML,setEditorDoenetML] = useState("");
  let attemptNumber = 1;
  let requestedVariant = { index: attemptNumber }
  let assignmentId = "myassignmentid";
  let solutionDisplayMode = "button";
  
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

      <overlay name="editor">
        <headerPanel title="my title">
          
          <p>Title of edited</p>
          <button
            onClick={() => {
              setOverlayOpen({
                name: "", //to match the prop
                instructions: { 
                  action: "close", //or "close"
                }
              });
            }}
          >
            Go Back
          </button>
        </headerPanel>

        <mainPanel>
        <button onClick={()=>{
            setViewerDoenetML(editorDoenetML);
            setUpdateNumber((old)=>{return old+1})
            }}>Update</button>
          <DoenetViewer
            key={"doenetviewer" + updateNumber}
            doenetML={viewerDoenetML}
            flags={{
              showCorrectness: true,
              readOnly: false,
              solutionDisplayMode: solutionDisplayMode,
              showFeedback: true,
              showHints: true,
            }}
            attemptNumber={attemptNumber}
            assignmentId={assignmentId}
            ignoreDatabase={false}
            requestedVariant={requestedVariant}

          />
        
        </mainPanel>

        <supportPanel width="40%">
        <CodeMirror
        value={editorDoenetML}
        // options={options}
        onBeforeChange={(editor, data, value) => {
          setEditorDoenetML(value)
        }}
        onChange={(editor, data, value) => {
        }}
      />
        </supportPanel>
  
      </overlay>

     
    </Tool>
  );
}
