import React, { useEffect, useRef, useState, Suspense } from "react";
import Tool, { openOverlayByName } from "../imports/Tool/Tool";
import { useMenuPanelController } from "../imports/Tool/MenuPanel";
import {driveColors,driveImages} from '../imports/Util';
import DoenetDriveCardMenu from "../imports/DoenetDriveCardMenu";

import Drive, { 
  folderDictionarySelector, 
  globalSelectedNodesAtom, 
  folderDictionary, 
  clearAllSelections, 
  fetchDrivesSelector,
  encodeParams
} from "../imports/Drive";
import nanoid from 'nanoid';

import { 
  faChalkboard,
  faCode,
  faFolder
 } from '@fortawesome/free-solid-svg-icons';
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import {
  useHistory
} from "react-router-dom";
// import AddItem from '../imports/AddItem'
// import Switch from "../imports/Switch";
import Button from "../imports/PanelHeaderComponents/Button";
import {
  atom,
  useSetRecoilState,
  useRecoilState,
  useRecoilValue,
  selector,
  atomFamily,
  selectorFamily,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
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
import crypto from 'crypto';
import DriveCard from '../imports/DoenetDriveCard';
import { useTransition, animated, interpolate } from "react-spring";
import useMedia from "./useMedia";
import "../imports/drivecard.css";
import useMeasure  from "./useMeasure";
import {contentPanelWidthAtom} from "../imports/Tool/ContentPanel";
export const drivecardSelectedNodesAtom = atom({
  key:'drivecardSelectedNodesAtom',
  default:[]
})

const selectedDriveInformation = selector({
  key:"selectedDriveInformation",
   get: ({get})=>{
    const driveSelected = get(drivecardSelectedNodesAtom);
    return driveSelected;
  },
  set:(newObj)=>({set})=>{
    set(drivecardSelectedNodesAtom,(old)=>[...old,newObj])
  }
})

const itemVersionsSelector = selectorFamily({
  key:"itemInfoSelector",
  get:(branchId)=> async ()=>{
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
    const driveInstanceId = globalSelected[0].driveInstanceId;
    let folderInfo = get(folderDictionary({driveId,folderId})); 
    const itemId = globalSelected[0].itemId;
    let itemInfo = {...folderInfo.contentsDictionary[itemId]};
    itemInfo['driveId'] = driveId;
    itemInfo['driveInstanceId'] = driveInstanceId;
    let versions = [];
    if (itemInfo.itemType === "DoenetML"){
      let branchId = itemInfo.branchId;
      versions = get(itemVersionsSelector(branchId))
    }
    return {number:globalSelected.length,itemInfo,versions}
  }
})

const fileByContentId = atomFamily({
  key:"fileByContentId",
  default: selectorFamily({
    key:"fileByContentId/Default",
    get:(contentId)=> async ()=>{
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

const cancelAutoSaveAtom = atom({
  key:"cancelAutoSaveAtom",
  default:false
})

function TextEditor(props){
  const [editorDoenetML,setEditorDoenetML] = useRecoilState(editorDoenetMLAtom);
  const setVersion = useSetRecoilState(updateItemHistorySelector(props.branchId))
  const [cancelAutoSave,setCancelAutoSave] = useRecoilState(cancelAutoSaveAtom);

  const timeout = useRef(null);
  const autosavetimeout = useRef(null);
  const trackMount = useRef("Init");

  const selectedTimestamp = useRecoilValue(versionHistorySelectedAtom);
  

  if (cancelAutoSave){
    if (autosavetimeout.current !== null){
      clearTimeout(autosavetimeout.current)
    }
    setCancelAutoSave(false);
  }

  //Used to work around second mount of codemirror with the same value it doesn't display value
  let value = editorDoenetML;
  if (trackMount.current === "Init"){
    value = "";
  }

  return <CodeMirror
  editorDidMount={()=>trackMount.current = "Mount"}
  value={value}
  // options={options}
  onBeforeChange={(editor, data, value) => {
    if (selectedTimestamp === "") { //Only update if an inactive version history
      setEditorDoenetML(value)
      if (timeout.current === null){
        timeout.current = setTimeout(function(){
          setVersion({instructions:{type:"Save Draft"}})
          timeout.current = null;
        },3000)
      }
      if (autosavetimeout.current === null){
        autosavetimeout.current = setTimeout(function(){
          setVersion({instructions:{type:"Autosave"}})
          autosavetimeout.current = null;
        },5000) //TODO: Make 5 minutes 300000
      }
  }
  }}
  // onChange={(editor, data, value) => {
  // }}
  onBlur={()=>{
    if (timeout.current !== null){
      clearTimeout(timeout.current)
      timeout.current = null;
      setVersion({instructions:{type:"Save Draft"}})
    }
    if (autosavetimeout.current !== null){
      clearTimeout(autosavetimeout.current)
    }
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
  const selectedTimestamp = useRecoilValue(versionHistorySelectedAtom);
  if (selectedTimestamp !== "") {return null;}

  return <button onClick={()=>{setViewerDoenetML((old)=>{
    let newInfo = {...old};
    newInfo.doenetML = editorDoenetML;
    newInfo.updateNumber = old.updateNumber+1;
    return newInfo;
  })}}>Update</button>
}

const getSHAofContent = (doenetML)=>{
  const hash = crypto.createHash('sha256');
  if (doenetML === undefined){
    return;
  }
  hash.update(doenetML);
  let contentId = hash.digest('hex');
  return contentId;
}

const itemHistoryAtom = atomFamily({
  key:"itemHistoryAtom",
  default: selectorFamily({
    key:"itemHistoryAtom/Default",
    get:(branchId)=> async ()=>{
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

const updateItemHistorySelector = selectorFamily({
  key:"updateItemHistorySelector",
  get:(branchId)=> ({get})=>{
    return get(itemHistoryAtom(branchId))
  },
  set:(branchId)=> ({get,set},instructions)=>{
    console.log(">>>instructions",instructions.instructions)
    

    const doenetML = get(editorDoenetMLAtom);
    const contentId = getSHAofContent(doenetML);
    const dt = new Date();
    const timestamp = `${
      dt.getFullYear().toString().padStart(2, '0')}-${
      (dt.getMonth()+1).toString().padStart(2, '0')}-${
      dt.getDate().toString().padStart(2, '0')} ${
      dt.getHours().toString().padStart(2, '0')}:${
      dt.getMinutes().toString().padStart(2, '0')}:${
      dt.getSeconds().toString().padStart(2, '0')}`

      let title = timestamp;
      let isNamed = "0";
      let draft = false;

      if (instructions.instructions.type === "Name Current Version"){
        isNamed = "1";
      }else if (instructions.instructions.type === "Save Draft"){
        draft = true;
        title = "draft";
       } else if (instructions.instructions.type === "Autosave"){
        title = "Autosave";
       } 


       if (instructions.instructions.type === "Name Version"){
        const newTitle = instructions.instructions.newTitle;
        const timestamp = instructions.instructions.timestamp;
        set(itemHistoryAtom(branchId),(oldVersions)=>{
          let newVersions = [];
          for (let version of oldVersions){
            if (version.timestamp === timestamp){
            let newVersion = {...version};
              newVersion.title = newTitle;
              newVersion.isNamed="1";
              newVersions.push(newVersion);
            }else{
              newVersions.push(version);
            }

          }
          return [...newVersions]
        })
        axios.get("/api/updateNamedVersion.php",{ params: {timestamp,newTitle,branchId,isNamed:'1'} })
        //  .then((resp)=>{console.log(">>>resp",resp.data)})

       }else{
        let newVersion = {
          title:timestamp,
          contentId,
          timestamp,
          isDraft: "0",
          isNamed
        }
    
        if (!draft){
          set(itemHistoryAtom(branchId),(oldVersions)=>{return [...oldVersions,newVersion]})
          set(fileByContentId(contentId),{data:doenetML})
        }else{
          set(fileByContentId(branchId),{data:doenetML})
        }
        axios.post("/api/saveNewVersion.php",{title,branchId,doenetML,isNamed,draft})
        //  .then((resp)=>{console.log(">>>resp",resp.data)})
       }


    
  }
})

const versionHistorySelectedAtom = atom({
  key:"versionHistorySelectedAtom",
  default:""
})

const EditingTimestampAtom = atom({
  key:"EditingTimestampAtom",
  default:""
})

const EditingContentIdAtom = atom({
  key:"EditingContentIdAtom",
  default:""
})

function ReturnToEditingButton(){
  const [selectedTimestamp,setSelectedTimestamp] = useRecoilState(versionHistorySelectedAtom);
  const [editingTimestamp,setEditingTimestamp] = useRecoilState(EditingTimestampAtom);
  const [editingContentId,setEditingContentId] = useRecoilState(EditingContentIdAtom);

  if (selectedTimestamp === "" && 
  editingTimestamp === "" &&
  editingContentId === ""
  ){
    return null;
  }

  return <>
  <button onClick={()=>{
  setSelectedTimestamp("")
  setEditingTimestamp("")
  setEditingContentId("")
  }}>Return to editing</button>
  </>
}

function VersionHistoryPanel(props){
  const [versionHistory,setVersion] = useRecoilStateLoadable(updateItemHistorySelector(props.branchId))
  const [selectedTimestamp,setSelectedTimestamp] = useRecoilState(versionHistorySelectedAtom);
  const [editingTimestamp,setEditingTimestamp] = useRecoilState(EditingTimestampAtom);
  const setEditingContentId = useSetRecoilState(EditingContentIdAtom);

  const [editingText,setEditingText] = useState("")

  if (versionHistory.state === "loading"){ return null;}
  if (versionHistory.state === "hasError"){ 
    console.error(versionHistory.contents)
    return null;}

    let versions = [];
  for (let version of versionHistory.contents){
    // console.log(">>>version",version)
      if (version.isDraft !== "1"){
      // let nameItButton = <button>Name Version</button>;

      let titleText = version.timestamp;
      let titleStyle = {}

      if (version.isNamed === "1"){
        titleText = version.title;
      }

      let drawer = null;
      let versionStyle = {};

      if (selectedTimestamp === version.timestamp){
        versionStyle = {backgroundColor:"#b8d2ea"}
        titleStyle = {border: "1px solid black", padding: "1px"}
        drawer = <>
        {/* <div>{nameItButton}</div> */}
        <div><Button text="Make a copy" /></div>
        <div><Button text="Delete Version" /></div>
        <div><Button text="Use as Current Version" /></div>
        </>
      }
      let title = <div><b 
      onClick={()=>{
        if (selectedTimestamp !== ""){
          setEditingText(titleText);
          setEditingTimestamp(version.timestamp)
        }
      }} 
      style={titleStyle}>{titleText}</b></div>

      if (editingTimestamp === version.timestamp){
        title = <div><input 
        autoFocus
        onBlur={()=>{
          setEditingTimestamp("");
          setVersion({instructions:{type:"Name Version",newTitle:editingText,timestamp:version.timestamp}})
        }}
        onChange={(e)=>{setEditingText(e.target.value)}}
        value = {editingText}
      type="text" /></div>
      }

      versions.push(<React.Fragment key={`pastVersion${version.timestamp}`}>
        <div 
        onClick={()=>{
          if (version.timestamp !== selectedTimestamp){
            setSelectedTimestamp(version.timestamp)
            console.log(">>>version.contentId",version.contentId)
            setEditingContentId(version.contentId)
          }
        }}
      style={versionStyle}
      >
        {title}
        <div>{version.timestamp}</div>
        </div>
        {drawer}
        </React.Fragment> )

    }
  }

  //   setVersion({instructions:{type:"Name Current Version"}}) }}>Name Version</button>

  if (versions.length === 0){
    versions = <b>No Saved Versions</b>
  }
  
  return <>
  {versions}
  </>
}

function NameCurrentVersionControl(props){
  const setVersion = useSetRecoilState(updateItemHistorySelector(props.branchId))
  const setCancelAutoSave = useSetRecoilState(cancelAutoSaveAtom);
  const selectedTimestamp = useRecoilValue(versionHistorySelectedAtom);
  if (selectedTimestamp !== "") {return null;}

  return <>
  <button onClick={()=>{
    setVersion({instructions:{type:"Name Current Version"}})
    setCancelAutoSave(true);
    }}>Name Current Version</button>
  </>
  
}

let overlayTitleAtom = atom({
  key:"overlayTitleAtom",
  default:""
})

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
function SetEditorDoenetMLandTitle(props){
  let contentId = props.contentId;
  if (props.isDraft){ contentId = props.branchId;}
  const editingContentId = useRecoilValue(EditingContentIdAtom);
  if (editingContentId !== ""){ contentId = editingContentId}
console.log(">>>SetEditorDoenetMLandTitle editingContentId",editingContentId)
console.log(">>>SetEditorDoenetMLandTitle contentId",contentId)
  const loadedDoenetML = useRecoilValueLoadable(fileByContentId(contentId))
  const setEditorDoenetML = useSetRecoilState(editorDoenetMLAtom);
  const setViewerDoenetML = useSetRecoilState(viewerDoenetMLAtom);
  let lastContentId = useRef("");
  const overlayInfo = useRecoilValue(openOverlayByName);
  const setEditorOverlayTitle = useSetRecoilState(overlayTitleAtom);

  //Set only once
  if (lastContentId.current !== contentId){
    if (loadedDoenetML.state === "hasValue"){
      let overlayTitle = overlayInfo?.instructions?.title;
      setEditorOverlayTitle(overlayTitle)
      let doenetML = loadedDoenetML?.contents?.data;
      setEditorDoenetML(doenetML);
      setViewerDoenetML((old)=>{
        let newInfo = {...old};
        newInfo.doenetML = doenetML;
        newInfo.updateNumber = old.updateNumber+1;
        return newInfo;
      })
      lastContentId.current = contentId; //Don't set again
    }
  }


return null;
}

const DriveInfoPanel = function(props){
  const [driveLabel,setDriveLabel] = useState(props.label);
  const [panelDriveLabel,setPanelDriveLabel] = useState(props.label);
  const setDrivesInfo = useSetRecoilState(fetchDrivesSelector);


  let dIcon = <FontAwesomeIcon icon={faChalkboard}/>

  return <>
  <h2>{dIcon} {panelDriveLabel}</h2>
  <label>Course Name<input type="text" 
  value={driveLabel} 
  onChange={(e)=>setDriveLabel(e.target.value)} 
  onKeyDown={(e)=>{
    if (e.keyCode === 13){
      setPanelDriveLabel(driveLabel)
      setDrivesInfo({
        color:props.color,
        label:driveLabel,
        image:props.image,
        newDriveId:props.driveId,
        type:"update drive label",
      })
    }
  }}
  onBlur={()=>{
    setPanelDriveLabel(driveLabel)
    setDrivesInfo({
      color:props.color,
      label:driveLabel,
      image:props.image,
      newDriveId:props.driveId,
      type:"update drive label",
    })
  }}/></label>
  <DoenetDriveCardMenu
  key={`colorMenu${props.driveId}`}
  colors={driveColors} 
  initialValue={props.color}
  callback={(color)=>{
        setDrivesInfo({
          color,
          label:driveLabel,
          image:props.image,
          newDriveId:props.driveId,
          type:"update drive color"
        })
  }}
  />
  <Button text="Delete Course" callback={()=>{
    // alert("Delete Drive")
    setDrivesInfo({
      color:props.color,
      label:driveLabel,
      image:props.image,
      newDriveId:props.driveId,
      type:"delete drive"
    })
  }} />

  </>
}

const FolderInfoPanel = function(props){
  const itemInfo = props.itemInfo;

  const setFolder = useSetRecoilState(folderDictionarySelector({driveId:itemInfo.driveId,folderId:itemInfo.parentFolderId}))

  const [label,setLabel] = useState(itemInfo.label);
  const [panelLabel,setPanelLabel] = useState(itemInfo.label);

  let fIcon = <FontAwesomeIcon icon={faFolder}/>
  
  return <>
  <h2>{fIcon} {panelLabel}</h2>

  <label>Folder Label<input type="text" 
  value={label} 
  onChange={(e)=>setLabel(e.target.value)} 
  onKeyDown={(e)=>{
    if (e.keyCode === 13){
      setPanelLabel(label)
      setFolder({
        instructionType:"rename item",
        itemId:itemInfo.itemId,
        driveInstanceId:itemInfo.driveInstanceId,
        itemType:itemInfo.itemType,
        label
      })
    }
  }}
  onBlur={()=>{
    setPanelLabel(label)
    setFolder({
      instructionType:"rename item",
      itemId:itemInfo.itemId,
      driveInstanceId:itemInfo.driveInstanceId,
      itemType:itemInfo.itemType,
      label
    })
  }}/></label>
  <br />
  <br />
  <Button text="Delete Folder" callback={()=>{
    setFolder({
      instructionType:"delete item",
      itemId:itemInfo.itemId,
      driveInstanceId:itemInfo.driveInstanceId
    })
  }} />
  </>
}

const DoenetMLInfoPanel = function(props){
  const itemInfo = props.itemInfo;

  const setOverlayOpen = useSetRecoilState(openOverlayByName);
  const setFolder = useSetRecoilState(folderDictionarySelector({driveId:itemInfo.driveId,folderId:itemInfo.parentFolderId}))

  const [label,setLabel] = useState(itemInfo.label);
  const [panelLabel,setPanelLabel] = useState(itemInfo.label);

  let dIcon = <FontAwesomeIcon icon={faCode}/>
  
  return <>
  <h2>{dIcon} {panelLabel}</h2>

  <label>DoenetML Label<input type="text" 
  value={label} 
  onChange={(e)=>setLabel(e.target.value)} 
  onKeyDown={(e)=>{
    if (e.keyCode === 13){
      setPanelLabel(label)
      setFolder({
        instructionType:"rename item",
        itemId:itemInfo.itemId,
        driveInstanceId:itemInfo.driveInstanceId,
        itemType:itemInfo.itemType,
        label
      })
    }
  }}
  onBlur={()=>{
    setPanelLabel(label)
    setFolder({
      instructionType:"rename item",
      itemId:itemInfo.itemId,
      driveInstanceId:itemInfo.driveInstanceId,
      itemType:itemInfo.itemType,
      label
    })
  }}/></label>
  <br />
  <br />
  <Button text="Edit DoenetML" callback={()=>{
    setOverlayOpen({
      name: "editor", //to match the prop
      instructions: { 
        supportVisble: true,
        action: "open", 
        contentId: itemInfo.contentId,
        branchId: itemInfo.branchId,
        title: itemInfo.label,
        isDraft: '1',
        timestamp: itemInfo.creationDate
      }
    });
  }} />
  <br />
  <br />
  <Button text="Delete DoenetML" callback={()=>{
    setFolder({
      instructionType:"delete item",
      itemId:itemInfo.itemId,
      driveInstanceId:itemInfo.driveInstanceId
    })
  }} />
  </>
}


const ItemInfo = function (){
  // console.log("=== 🧐 Item Info")
  const infoLoad = useRecoilValueLoadable(selectedInformation);
  const driveSelections = useRecoilValue(selectedDriveInformation);

    if (infoLoad.state === "loading"){ return null;}
    if (infoLoad.state === "hasError"){ 
      console.error(infoLoad.contents)
      return null;}
   
      let itemInfo = infoLoad?.contents?.itemInfo;

    if (infoLoad.contents?.number > 1){
      return <>
      <h1>{infoLoad.contents.number} Items Selected</h1>
      </>
    }else if (driveSelections.length > 1){
      return  <h1>{driveSelections.length} Drives Selected</h1>

    }else if (infoLoad.contents?.number < 1 && driveSelections.length < 1){
      if (!itemInfo) return <h3>No Items Selected</h3>;

    }else if (driveSelections.length === 1){
      const dInfo = driveSelections[0];

      return <DriveInfoPanel 
      key={`DriveInfoPanel${dInfo.driveId}`}
      label={dInfo.label} 
      color={dInfo.color}
      image={dInfo.image}
      driveId={dInfo.driveId} 
      />

    }else if (infoLoad.contents?.number === 1){
      if (itemInfo?.itemType === "DoenetML"){
        return <DoenetMLInfoPanel
        key={`DoenetMLInfoPanel${itemInfo.itemId}`}
        itemInfo={itemInfo}
        />
      }else if (itemInfo?.itemType === "Folder"){
        return <FolderInfoPanel
        key={`FolderInfoPanel${itemInfo.itemId}`}
        itemInfo={itemInfo}
        />
      }
   
    }
  
}

function AddCourseDriveButton(props){
  const history = useHistory();

  const [_,setNewDrive] = useRecoilState(fetchDrivesSelector)

  return <Button text="Create a New Course" callback={()=>{
    let driveId = null;
    let newDriveId = nanoid();
    let label = "Untitled";
    let image = driveImages[Math.floor(Math.random() * driveImages.length)];
    let color = driveColors[Math.floor(Math.random() * driveColors.length)];
    setNewDrive({label,type:"new course drive",driveId,newDriveId,image,color})
    let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
    let newParams = {...urlParamsObj} 
    // newParams['path'] = `${newDriveId}:${newDriveId}:${newDriveId}:Drive`
    newParams['path'] = `:::`
    history.push('?'+encodeParams(newParams))

  }}/>
}

function AddMenuPanel(props){
  let path = ":";
  if (props?.route?.location?.search){
      path = Object.fromEntries(new URLSearchParams(props.route.location.search))?.path;
  }
  let [driveId,folderId] = path.split(":");
  const [_, setFolderInfo] = useRecoilStateLoadable(folderDictionarySelector({driveId, folderId}))


  let addDrives = <>
   <Suspense fallback={<p>Failed to make add course drive button</p>} >
     <AddCourseDriveButton route={props.route} />
   </Suspense>
   </>

  if (driveId === ""){ return <>{addDrives}</>; }


  return <>
  <h3>Course</h3>
   {addDrives}
  <h3>Folder</h3>
  <Button text="Add Folder" callback={()=>{
    setFolderInfo({instructionType:"addItem",
    label:"Untitled",
    itemType:"Folder"
    })
  }
  } />

  <h3>DoenetML</h3>
  <Button text="Add DoenetML" callback={()=>{
    setFolderInfo({instructionType:"addItem",
    label:"Untitled",
    itemType:"DoenetML"
    })
  }
  } />
 
  {/* <h3>URL</h3>
  <div>
    <label>Label <input size="10" type="text" onChange={(e)=>setURLLabel(e.target.value)} value={URLLabel} /></label>
  </div>
  <div>
    <label>URL <input size="10" type="text" onChange={(e)=>setURLLink(e.target.value)} value={URLLink}/></label>
  <Button callback={()=>{
    setFolderInfo({instructionType:"addItem",
    label:URLLabel === "" ? "Untitled" : URLLabel,
    url:URLLink,
    itemType:"url"
    })
    setURLLink("");
  }} text="Add" />

  </div> */}

  </>
}

const EditorTitle = ()=>{
  const overlayTitle = useRecoilValue(overlayTitleAtom);
  return <span>{overlayTitle}</span>
}

const DriveCardComponent = (props) => {
  const { driveDoubleClickCallback } = props;
  const widthContent = useRecoilValue(contentPanelWidthAtom);
  //  console.log(">>>> width content",widthContent );
  const history = useHistory();
  let encodeParams = (p) =>
    Object.entries(p)
      .map((kv) => kv.map(encodeURIComponent).join("="))
      .join("&");
  let transitions = "";

  const columns = useMedia(
    [
      "(min-width: 1500px)",
      "(min-width: 1200px)", 
      "(min-width: 800px)",//800
      "(min-width: 600px)", //600
      "(min-width: 400px)",
      "(min-width: 300px)" //400
    ],
    [4,3,2,1,1,1],
    1
  );
  const getColumns = (width) => {
    if(width > 1000)
    {
      return 3;
    }
    else if(width > 600)
    {
      return 2;
    }
    else{
      return 1;
    }
  }
  
  let heights = [];
  // console.log(">>>> props.driveInfo",props.driveInfo );
  let wdithColumns = widthContent > 0 ? getColumns(widthContent) : columns;
  heights = new Array(wdithColumns).fill(0);
  const [bind, { width }] = useMeasure();
  let widthCheck = widthContent > 0 ? widthContent : width;
// console.log(">>>>> width  columns", width , "columns",columns);
  let driveCardItem = props.driveInfo.map((child, i) => {
    const column = heights.indexOf(Math.min(...heights)); // Basic masonry-grid placing, puts tile into the smallest column using Math.min
    const xy = [((widthCheck) / wdithColumns) * column, (heights[column] += 250) - 250]; // X = container width / number of columns * column index, Y = it's just the height of the current column
    return { ...child, xy, width: (widthCheck / wdithColumns), height: 250};
  });
    transitions = useTransition(driveCardItem, (item) => item.driveId, {
      from: ({ xy, width, height }) => ({
        xy,
        width,
        height,
        opacity: 0,
        scale: 1.1
      }),
      enter: ({ xy, width, height }) => ({
        xy,
        width,
        height,
        opacity: 1,
        scale: 1
      }),
      update: ({ xy, width, height }) => ({ xy, width, height, scale: 1 }),
      leave: { height: 0, opacity: 0, scale: 0 },
      config: { mass: 30, tension: 600, friction: 200 },
      trail: 25
    });

  // function driveCardSelector(item) {
  //   let newParams = {};
  //   newParams["path"] = `${item.driveId}:${item.driveId}:${item.driveId}:Drive`;
  //   history.push("?" + encodeParams(newParams));
  // }
  const handleKeyDown = (e, item) => {
    if (e.key === "Enter") {
      let newParams = {};
      newParams[
        "path"
      ] = `${item.driveId}:${item.driveId}:${item.driveId}:Drive`;
      history.push("?" + encodeParams(newParams));
    }
  };
  const [on, toggle] = useState(false);  
  const setDrivecardSelection = useSetRecoilState(drivecardSelectedNodesAtom)
  const drivecardSelectedValue = useRecoilValue(drivecardSelectedNodesAtom);
  const setOpenMenuPanel = useMenuPanelController();
  // Drive selection 
  const drivecardselection = (e,item) =>{
   e.preventDefault();
   e.stopPropagation();
   setOpenMenuPanel(0);
   if (!e.shiftKey && !e.metaKey){          // one item
    setDrivecardSelection((old) => [item]);
  }else if (e.shiftKey && !e.metaKey){      // range to item 
    
    setDrivecardSelection((old) => {
      if(old.length > 0)
      {

        let finalArray = [];
        let initalDriveId = '';
        if(old.length === 1)
        {
          initalDriveId = old[0].driveId;
        }
        else
        {
          finalArray = [...old];
          initalDriveId = old[old.length-1].driveId;
        }
        let firstDriveId = transitions.findIndex((j) => j.item.driveId === item.driveId);
        let lastDriveId = transitions.findIndex((k)=>k.item.driveId === initalDriveId);
        if(firstDriveId > lastDriveId)
        {
          let slicedArr = transitions.slice(lastDriveId,firstDriveId+1);
          let filteredArr = slicedArr.map((l)=>l.item);
          finalArray = [...finalArray,...filteredArr];
        }
        else{
          let slicedArr = transitions.slice(firstDriveId,lastDriveId+1);
          let filteredArr = slicedArr.map((m)=>m.item);
          finalArray = [...finalArray,...filteredArr];
        }
        //  console.log(">>>> final array",finalArray);
        return finalArray;
        
      }
      else{
        return [...old,item];
      }
    }); 
  }else if (!e.shiftKey && e.metaKey){   // add item
    setDrivecardSelection((old) =>{
      let alreadyAvaliable = old.filter((i)=>i.driveId === item.driveId);
      if(alreadyAvaliable.length > 0)
      {
        const arr = [];
        for(let i = 0;i<old.length;i++)
        {
          if(old[i].driveId != item.driveId)
          {
            arr.push(old[i]);
          }
        }
        return arr;
      }
      else{
        return [...old,item];
      }
    } );
  }
  //  console.log('>>>> drivecard selection item', item);

 }

 const getSelectedCard = (cardItem) => {
   if(drivecardSelectedValue.length == 0)
   {
     return false;
   }
  let avalibleCard = drivecardSelectedValue.filter((i)=>i.driveId === cardItem.driveId);
  return avalibleCard.length > 0 ? true : false;
 }
  return (
    <div className="drivecardContainer" {...bind} style={{ display:"flex",height: Math.max(...heights) }}>
      {transitions.map(({ item, props }, index) => {
        //  console.log(">>>  item props !!!!!!!!", item);
        let selectedCard = getSelectedCard(item);
        return (
          <animated.div
            className="adiv"
            key={index}
            // onMouseOver={() => toggle(props.scale.setValue(1.1))}
            // onMouseLeave={() => toggle(props.scale.setValue(1))}
            style={{
              transform: props.xy.interpolate(
                (x,y) => { return `scale(${ props.scale.value}) translate3d(${x}px,${y}px,0)`}
              ),
              ...props
             }}
          >
            <div
              className={`drivecardlist ${selectedCard ? 'borderselection' : ''}`}
              tabIndex={index+1}
              // onclick scale
              onClick = {(e) => {drivecardselection(e,item,props);
                // toggle(props.scale.setValue(0.9))
              }}
              onKeyDown={(e) => handleKeyDown(e, item)}
              onDoubleClick={(e) => 
                {e.preventDefault(); 
                e.stopPropagation();
                  if(driveDoubleClickCallback){driveDoubleClickCallback({item})}}}
            >
              <DriveCard
                driveId={item.driveId}
                image={item.image}
                color={item.color}
                label={item.label}
              />
            </div>
           </animated.div>
        );
      })}
    </div>
  );
};

export default function DoenetDriveTool(props) {
  // console.log("=== 💾 Doenet Drive Tool");  
  // const setOverlayOpen = useSetRecoilState(openOverlayByName);
  const [overlayInfo,setOverlayOpen] = useRecoilState(openOverlayByName);
  const setOpenMenuPanel = useMenuPanelController();

  // const setSupportVisiblity = useSetRecoilState(supportVisible);
  const clearSelections = useSetRecoilState(clearAllSelections);
  const setDrivecardSelection = useSetRecoilState(drivecardSelectedNodesAtom)

  const drivecardSelectedValue = useRecoilValue(drivecardSelectedNodesAtom);
  let routePathDriveId = "";
  let urlParamsObj = Object.fromEntries(
    new URLSearchParams(props.route.location.search)
  );
  if (urlParamsObj?.path !== undefined) {
    [
      routePathDriveId
    ] = urlParamsObj.path.split(":");
  }

  //Select +Add menuPanel if no drives selected on startup
  useEffect(()=>{
    if (routePathDriveId === ""){
      setOpenMenuPanel(1)
    }
  },[]);

  
  let textEditor = null;
  let doenetViewerEditorControls = null;
  let doenetViewerEditor = null;
  let setLoadContentId = null;
  let editorTitle = null;
  let versionHistory = null;
  let returnToEditingButton = null;

  if (overlayInfo?.name === "editor"){
    const contentId = overlayInfo?.instructions?.contentId;
    const branchId = overlayInfo?.instructions?.branchId;
    const isDraft = overlayInfo?.instructions?.isDraft;
    editorTitle = overlayInfo?.instructions?.title;
    setLoadContentId = <SetEditorDoenetMLandTitle contentId={contentId} branchId={branchId} isDraft={isDraft} />
    textEditor = <div><NameCurrentVersionControl branchId={branchId} /><TextEditor  branchId={branchId}/></div>
    doenetViewerEditorControls = <div><DoenetViewerUpdateButton  /></div>
    doenetViewerEditor =  <DoenetViewerPanel />
    versionHistory = <VersionHistoryPanel branchId={branchId} />
    returnToEditingButton = <ReturnToEditingButton />
  }
  
  const history = useHistory();

  function useOutsideDriveSelector() {

    let newParams = {};
    newParams["path"] = `:::`;
    history.push("?" + encodeParams(newParams));
  }

  function cleardrivecardSelection(){
    setDrivecardSelection([]);
    // let newParams = {};
    // newParams["path"] = `:::`;
    // history.push("?" + encodeParams(newParams));
  }

  const drivesInfo = useRecoilValueLoadable(fetchDrivesSelector);
  let driveInfo = [];
  if (drivesInfo.state === "hasValue") {
    driveInfo = drivesInfo.contents.driveIdsAndLabels;
  }
  // Breadcrumb container
  let breadcrumbContainer = null;
  if (routePathDriveId) {
    breadcrumbContainer = <BreadcrumbContainer />;
  }

  function driveCardSelector({item}) {
    let newParams = {};
    newParams["path"] = `${item.driveId}:${item.driveId}:${item.driveId}:Drive`;
    history.push("?" + encodeParams(newParams));
  }
  // Drive cards component
  let drivecardComponent = null;
  if (driveInfo && driveInfo.length > 0 && routePathDriveId === "") {
    drivecardComponent = <DriveCardComponent driveDoubleClickCallback={({item})=>{driveCardSelector({item})}}  style={mainPanelStyle} driveInfo={driveInfo}/>;
  } else if (driveInfo.length === 0 && routePathDriveId === "") {
    drivecardComponent = (
      <h2>You have no drives. Add one using the Menu Panel --> </h2>
    );
  }
  
  let mainPanelStyle ={
    height:'100%',
    width:'100%'
  }
  if(routePathDriveId === ''){
    mainPanelStyle = {}
  }
  

  return (
    <Tool>
      <navPanel>
      <GlobalFont/>
      <div style={{marginBottom:"40px",height:"100vh"}} 
       onClick={useOutsideDriveSelector} >
      <Drive types={['content','course']}  foldersOnly={true} />
      </div>
      </navPanel>

      <headerPanel title="Drive">
        {/* <p>Drive</p> */}
      </headerPanel>

      <mainPanel>

      {breadcrumbContainer}
        <div 
        onClick={()=>{
          clearSelections()
        }}
        style={mainPanelStyle}
        >
        <Drive types={['content','course']}  urlClickBehavior="select" 
        doenetMLDoubleClickCallback={(info)=>{
          setOverlayOpen({
            name: "editor", //to match the prop
            instructions: { 
              supportVisble: true,
              action: "open", //or "close"
              contentId: info.item.contentId,
              branchId: info.item.branchId,
              title: info.item.label,
              isDraft: '1',
              timestamp: info.item.creationDate
            }
          });
          }}/>

     
        </div>

        <div 
        onClick={
          cleardrivecardSelection
        }
        tabIndex={0}
        style={{width:"100%",height:"100%"}}
        >
       {drivecardComponent}
        </div>
        
          
        </mainPanel>
      <supportPanel>
      <Drive types={['content','course']}  urlClickBehavior="select" />
      </supportPanel>

      <menuPanel title="Selected">
        {/* <ItemInfo route={props.route} /> */}
        <ItemInfo  />
      </menuPanel>
      <menuPanel title="+ Add Items">
       <AddMenuPanel route={props.route} />
      </menuPanel>

      <overlay name="editor">
        <headerPanel title={editorTitle}>
          {returnToEditingButton}
          {/* {editorTitle} */}
          {/* <p>{overlayInfo?.instructions?.title}</p> */}
        </headerPanel>

        <mainPanel>
          {setLoadContentId}
          {doenetViewerEditorControls}
          {doenetViewerEditor}
        </mainPanel>

        <supportPanel width="40%">
          {textEditor}
        </supportPanel>

        <menuPanel title="Version history">
        {versionHistory}
      </menuPanel>
  
      </overlay>

     
    </Tool>
  );
}
