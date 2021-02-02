import React, { useRef } from "react";
import Tool, { openOverlayByName } from "../imports/Tool/Tool";
import Drive, { globalSelectedNodesAtom, folderDictionary, clearAllSelections, selectedDriveAtom} from "../imports/Drive";
import AddItem from '../imports/AddItem'
// import Switch from "../imports/Switch";
import {
  atom,
  useSetRecoilState,
  useRecoilState,
  useRecoilValue,
  selector,
  atomFamily,
  selectorFamily,
  useRecoilValueLoadable,
} from "recoil";
import { BreadcrumbContainer } from "../imports/Breadcrumb";
// import { supportVisible } from "../imports/Tool/SupportPanel";
import GlobalFont from "../fonts/GlobalFont.js";
import axios from "axios";
// import Button from "../imports/PanelHeaderComponents/Button.js";
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

const fileByContent = atomFamily({
  key:"fileByContent",
  default: selectorFamily({
    key:"fileByContent/Default",
    get:(contentId)=> async ({get})=>{
      // console.log(">>>contentId",contentId);
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
  default:{updateNumber:0,doenetML:"test"}
})

function DoenetViewerUpdateButton(){
  const editorDoenetML = useRecoilValue(editorDoenetMLAtom);
  const setViewerDoenetML = useSetRecoilState(viewerDoenetMLAtom);

  return <button onClick={()=>{setViewerDoenetML((old)=>{
    let newInfo = {...old};
    newInfo.doenetML = editorDoenetML;
    newInfo.updateNumber = old.updateNumber+1;
    return newInfo;
  })}}>Update</button>
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
    const loadedDoenetML = useRecoilValueLoadable(fileByContent(props.contentId))
    const setEditorDoenetML = useSetRecoilState(editorDoenetMLAtom);
    const setViewerDoenetML = useSetRecoilState(viewerDoenetMLAtom);
    let lastContentId = useRef("");

    //Set only once
    if (lastContentId.current !== props.contentId){
      if (loadedDoenetML.state === "hasValue"){
        let doenetML = loadedDoenetML?.contents?.data;
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

const ItemInfo = function (){
  //data-doenet-drive-stayselected
  console.log("=== 🧐 Item Info")
  const infoLoad = useRecoilValueLoadable(selectedInformation);
  const setOverlayOpen = useSetRecoilState(openOverlayByName);
  const selectedDrive = useRecoilValue(selectedDriveAtom);

  //   //Use Route to determine path variables
  // let routePathDriveId = "";
  // let routePathFolderId = "";  
  // let pathItemId = "";  
  // // let pathItemType = "";
  // let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
  // //use defaults if not defined
  // if (urlParamsObj?.path !== undefined){
  //   [routePathDriveId,routePathFolderId,pathItemId] = urlParamsObj.path.split(":");
  // }
 
  // const pathFolderInfo = useRecoilValueLoadable(driveFolderItemVersion({driveId:routePathDriveId,folderId:routePathFolderId,itemId:pathItemId}))


    console.log(">>>infoLoad",infoLoad)
    if (infoLoad.state === "loading"){ return null;}
    if (infoLoad.state === "hasError"){ 
      console.error(infoLoad.contents)
      return null;}

      // console.log(">>>infoLoad",infoLoad)
   
      let itemInfo = infoLoad?.contents?.itemInfo;
      let versions = infoLoad?.contents?.versions;

    if (infoLoad.contents?.number > 1){
      return <>
      <h1>{infoLoad.contents.number} Items Selected</h1>
      </>
    }else if (infoLoad.contents?.number < 1){

  //   if (pathFolderInfo.state === "loading"){ return null;}
  //   if (pathFolderInfo.state === "hasError"){ 
  //     console.error(pathFolderInfo.contents)
  //     return null;}

  // itemInfo = pathFolderInfo?.contents?.itemInfo;
  // versions = pathFolderInfo?.contents?.versions;

    // if (!itemInfo && selectedDrive){
    //   return <>
    //     <h1>{selectedDrive}</h1>
    //     <AddItem />
    //   </>
    // }
    if (!itemInfo) return <h3>No Items Selected</h3>;
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

export default function DoenetDriveTool(props) {
  console.log("=== 💾 Doenet Drive Tool");
  // const setOverlayOpen = useSetRecoilState(openOverlayByName);
  const [overlayInfo,setOverlayOpen] = useRecoilState(openOverlayByName);
  // const setSupportVisiblity = useSetRecoilState(supportVisible);
  const clearSelections = useSetRecoilState(clearAllSelections);

  const contentId = overlayInfo?.instructions?.contentId;
  
  let textEditor = null;
  let doenetViewerEditorControls = null;
  let doenetViewerEditor = null;
  let setLoadContentId = null;
  if (overlayInfo?.name === "editor"){
    setLoadContentId = <SetEditorDoenetML contentId={contentId} />
    textEditor = <TextEditor />
    doenetViewerEditorControls = <DoenetViewerUpdateButton  />
    doenetViewerEditor =  <DoenetViewerPanel />
  }

  
  return (
    <Tool>
      <navPanel>
      <GlobalFont/>
        <Drive types={['content','course']}  foldersOnly={true} />
        {/* <Drive types={['content','course']}  urlClickBehavior="select" /> */}
      </navPanel>

      <headerPanel title="my title">
        <p>Drive</p>
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
        {/* <ItemInfo route={props.route} /> */}
        <ItemInfo  />
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
