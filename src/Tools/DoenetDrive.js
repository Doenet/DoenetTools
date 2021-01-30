import React, { useState, useRef } from "react";
import Tool, { openOverlayByName } from "../imports/Tool/Tool";
import Drive, { globalSelectedNodesAtom, folderDictionary, clearAllSelections, selectedDriveAtom} from "../imports/Drive";
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
  useRecoilStateLoadable,
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
import crypto from 'crypto';


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
      versions = get(itemVersionsAtom(branchId))
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
      versions = get(itemVersionsAtom(branchId))
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
  const selectedDrive = useRecoilValue(selectedDriveAtom);



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

    if (!itemInfo && selectedDrive){
      return <>
        <h1>{selectedDrive}</h1>
        <AddItem />
      </>
    }
    if (!itemInfo) return <div>Nothing Selected</div>;
  }

  const versionsJSX = [];
 
  if (itemInfo?.itemType === "DoenetML"){
  let draftObj;
  for (let version of versions){
    if (version.isDraft === "1"){
      draftObj = version;
    }else{
      versionsJSX.push(<div
      key={`versions${version.timestamp}`}
        onClick={() => {
          //set activeBranchInfo to version
          setOverlayOpen({
            name: "editor", //to match the prop
            instructions: { 
              supportVisble: true,
              action: "open", //or "close"
              contentId: version.contentId,
              branchId: itemInfo.branchId,
              title: version.title,
              isDraft: version.isDraft,
              timestamp: version.timestamp
            }
          });
        }}
      >
        {version.title}
      </div>)
    }
  }

  versionsJSX.push(<button key='edit draft'
    onClick={()=>setOverlayOpen({
      name: "editor", //to match the prop
      instructions: { 
        supportVisble: true,
        action: "open", //or "close"
        contentId: draftObj.contentId,
        branchId: itemInfo.branchId,
        title: draftObj.title,
        isDraft: draftObj.isDraft,
        timestamp: draftObj.timestamp
      }
    })}>Edit Draft</button>)

  }
  



 

  return <div
  style={{height:"100%"}}
  >
    

  <h1>{itemInfo.label}</h1>
  <AddItem />
  {versionsJSX}
  </div>
}

const fileByContentId = atomFamily({
  key:"fileByContentId",
  default: selectorFamily({
    key:"fileByContentId/Default",
    get:(contentId)=> async ({get})=>{
      console.log(">>>fileByConentId Atom! LOADING......... contentId=",contentId)
      if (!contentId){
        return "";
      }
      return await axios.get(`/media/${contentId}`) 
    }
  })
})

const editorDoenetMLAtom = atom({
  key:"editorDoenetMLAtom",
  default:""
})

function TextEditor(props){
  const [editorDoenetML,setEditorDoenetML] = useRecoilState(editorDoenetMLAtom);

  return <CodeMirror
  value={editorDoenetML}
  // options={options}
  onBeforeChange={(editor, data, value) => {
    setEditorDoenetML(value)
  }}
  onChange={(editor, data, value) => {
  }}
/>
}

const viewerDoenetMLAtom = atom({
  key:"viewerDoenetMLAtom",
  default:{updateNumber:0,doenetML:""}
})

function DoenetViewerUpdateButton(){
  const editorDoenetML = useRecoilValue(editorDoenetMLAtom);
  const setViewerDoenetML = useSetRecoilState(viewerDoenetMLAtom);

  console.log(">>>DoenetViewerUpdateButton",editorDoenetML)
  return <button onClick={()=>{setViewerDoenetML((old)=>{
    let newInfo = {...old};
    newInfo.doenetML = editorDoenetML;
    newInfo.updateNumber = old.updateNumber+1;
    return newInfo;
  })}}>Update</button>
}

const itemVersionsAtom = atomFamily({
  key:"itemVersionsAtom",
  default: selectorFamily({
    key:"itemVersionsAtom/Default",
    get:(branchId)=> async ({get})=>{
      if (!branchId){
        return "";
      }
      const { data } = await axios.get(
        `/api/loadVersions.php?branchId=${branchId}`
      );
      return data.versions
    }
  })
})

const getContentId = (doenetML)=>{
  const hash = crypto.createHash('sha256');
  if (doenetML === undefined){
    return;
  }
  console.log(">>>sha doenetML",doenetML)
  hash.update(doenetML);
  let contentId = hash.digest('hex');
  return contentId;
}

const updateItemVersionsSelector = selectorFamily({
  key:"updateItemVersionsSelector",
  get:(branchId)=> ({get})=>{
    return get(itemVersionsAtom(branchId))
  },
  set:(branchId)=> ({get,set},title)=>{
    const doenetML = get(editorDoenetMLAtom);
    const oldVersions = get(itemVersionsAtom(branchId))
    const contentId = getContentId(doenetML);
    const dt = new Date();
    const timestamp = `${
      dt.getFullYear().toString().padStart(2, '0')}-${
      (dt.getMonth()+1).toString().padStart(2, '0')}-${
      dt.getDate().toString().padStart(2, '0')} ${
      dt.getHours().toString().padStart(2, '0')}:${
      dt.getMinutes().toString().padStart(2, '0')}:${
      dt.getSeconds().toString().padStart(2, '0')}`

    let newVersion = {
      title,
      contentId,
      timestamp,
      isDraft: "0"
    }
    const newVersions = [...oldVersions,newVersion];
    set(itemVersionsAtom(branchId),newVersions)
    set(fileByContentId(contentId),{data:doenetML})
    axios.post("/api/saveNewVersion.php",{title,branchId,doenetML})
    // .then((resp)=>{console.log(">>>resp",resp.data)})
  }
})

function SaveVersionControl(props){
  let [versionsInfo,setVersionsInfo] = useRecoilStateLoadable(updateItemVersionsSelector(props.branchId))
  // let versionsInfo = useRecoilValueLoadable(itemVersionsAtom(props.branchId))
  const firstTitle = "Version 1"
  const [title,setTitle] = useState(firstTitle);

  //Can't equal the value of earlier versions
  if (versionsInfo.state === "loading"){ return null;}
  if (versionsInfo.state === "hasError"){ 
    console.error(versionsInfo.contents)
    return null;}
  if (versionsInfo.state === "hasValue" && title === firstTitle && versionsInfo.contents?.length){
    setTitle(`Version ${versionsInfo.contents.length}`)
  }
  console.log(">>>SaveVersionControl versionsInfo",props.branchId,versionsInfo)

  return <>
  <label>Version Title: <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)}/>
  </label>
  <button onClick={()=>{setVersionsInfo(title)}}>Save</button>
  </>
  
}

function DoenetViewerPanel(){
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
  let attemptNumber = 1;
  let requestedVariant = { index: attemptNumber }
  let assignmentId = "myassignmentid";
  let solutionDisplayMode = "button";

  return <DoenetViewer
      key={"doenetviewer" + viewerDoenetML?.updateNumber}
      doenetML={viewerDoenetML?.doenetML}
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
}

//When contentId changes then set the new loaded info into the editor atoms
function SetEditorDoenetML(props){
    const loadedDoenetML = useRecoilValueLoadable(fileByContentId(props.contentId))
    const setEditorDoenetML = useSetRecoilState(editorDoenetMLAtom);
    const setViewerDoenetML = useSetRecoilState(viewerDoenetMLAtom);
    let lastContentId = useRef("");

    //Set only once
    if (lastContentId.current !== props.contentId){
      if (loadedDoenetML.state === "hasValue"){
        let doenetML = loadedDoenetML?.contents?.data;
        console.log(">>>>---------------------------------")
        console.log(">>>SetEditorDoenetML SET EDITOR AND VIEWER!!!!!")
        console.log(">>>contentId ",props.contentId)
        console.log(">>>loadedDoenetML",loadedDoenetML)
        console.log(">>>loadedDoenetML?.contents",loadedDoenetML?.contents)
        console.log(">>>doenetML",doenetML)
        console.log(">>>>---------------------------------")
        setEditorDoenetML(doenetML);
        setViewerDoenetML((old)=>{
          let newInfo = {...old};
          newInfo.doenetML = doenetML;
          newInfo.updateNumber = old.updateNumber+1;
          return newInfo;
        })
        lastContentId.current = props.contentId; //Don't set again
      }
    }


  return null;
}

export default function DoenetDriveTool(props) {
  console.log("=== 💾 Doenet Drive Tool");
  const [overlayInfo,setOverlayOpen] = useRecoilState(openOverlayByName);
  const clearSelections = useSetRecoilState(clearAllSelections);

  const contentId = overlayInfo?.instructions?.contentId;
  const branchId = overlayInfo?.instructions?.branchId;
  
  let textEditor = null;
  let doenetViewerEditorControls = null;
  let doenetViewerEditor = null;
  let setLoadContentId = null;

  if (overlayInfo?.name === "editor"){
    setLoadContentId = <SetEditorDoenetML contentId={contentId} />
    textEditor = <TextEditor />
    doenetViewerEditorControls = <div><DoenetViewerUpdateButton  /><SaveVersionControl branchId={branchId} /></div>
    doenetViewerEditor =  <DoenetViewerPanel />
  }

  
  return (
    <Tool>
      <navPanel>
      <GlobalFont/>
        <Drive types={['content','course']}  urlClickBehavior="select" />
      </navPanel>

      <headerPanel title="my title">
        <p>Drive</p>
      </headerPanel>

      <mainPanel>
        <BreadcrumbContainer /> 
        <div 
        onClick={()=>{
          clearSelections();
        }}
        style={{height:"100%",width:"100%"}}>
        <Drive types={['content','course']}  urlClickBehavior="select" />

        </div>
      </mainPanel>
      <supportPanel>
      <Drive types={['content','course']}  urlClickBehavior="select" />
      </supportPanel>

      <menuPanel title="Item Info">
        <ItemInfo route={props.route} />
      </menuPanel>

      <overlay name="editor">
        <headerPanel title="my title">
          
          <p>{overlayInfo?.instructions?.title}</p>
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
          {setLoadContentId}
          {doenetViewerEditorControls}
          {doenetViewerEditor}
        </mainPanel>

        <supportPanel width="40%">
          {textEditor}
        </supportPanel>
  
      </overlay>

     
    </Tool>
  );
}
