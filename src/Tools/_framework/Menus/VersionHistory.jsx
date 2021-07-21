import React, { useState } from 'react';
import { 
  atom,
  useRecoilValue,
  useRecoilState,
  useRecoilValueLoadable,
  useRecoilCallback,
 } from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
import { itemHistoryAtom } from '../ToolHandlers/CourseToolHandler';
import { editorDoenetIdInitAtom } from '../ToolPanels/EditorViewer';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { textEditorDoenetMLAtom, viewerDoenetMLAtom } from '../ToolPanels/EditorViewer';
import { 
  buildTimestamp, 
  getSHAofContent, 
  ClipboardLinkButtons, 
  RenameVersionControl,
  fileByContentId } from '../ToolHandlers/CourseToolHandler';
import { nanoid } from 'nanoid';
import axios from "axios";
import { useToast, toastType } from '@Toast';

const currentDraftSelectedAtom = atom({
  key:"currentDraftSelectedAtom",
  default:true
})

const selectedVersionIdAtom = atom({
  key:"selectedVersionIdAtom",
  default:null
})

export default function VersionHistory(props){

  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const path = decodeURIComponent(useRecoilValue(searchParamAtomFamily('path')));
  const versionHistory = useRecoilValueLoadable(itemHistoryAtom(doenetId))
  const initializedDoenetId = useRecoilValue(editorDoenetIdInitAtom);
  const selectedVersionId = useRecoilValue(selectedVersionIdAtom);
  const addToast = useToast();
  const [driveId, folderId, itemId] = path.split(':');
  const [currentDraftSelected,setCurrentDraftSelected] = useRecoilState(currentDraftSelectedAtom)

//   // const activeVersionId  = useRecoilValue(versionHistoryActiveAtom);
//   // const [editingVersionId,setEditingVersionId] = useRecoilState(EditingVersionIdAtom);


  const toggleReleaseNamed = useRecoilCallback(({set,snapshot})=> async ({doenetId,versionId,driveId,folderId,itemId})=>{
    let doenetIsReleased = false;
    let history = await snapshot.getPromise(itemHistoryAtom(doenetId));
    let newHistory = {...history}
    newHistory.named = [...history.named];
    let newVersion;
    for (const [i,version] of newHistory.named.entries()){
      if (versionId === version.versionId){
        newVersion = {...version}

        if (version.isReleased === '0'){
          //release
          newVersion.isReleased = '1';
          doenetIsReleased = true;

          newHistory.named.splice(i,1,newVersion)
        break;
        }else{
          //retract
          newVersion.isReleased = '0';

          newHistory.named.splice(i,1,newVersion)
        break;
        }
      }
    }
    set(itemHistoryAtom(doenetId),newHistory);
    
    const doenetML = await snapshot.getPromise(fileByContentId(newVersion.contentId));

    let newDBVersion = {...newVersion,
      isNewToggleRelease:'1',
      doenetId,
      doenetML
    }
    // console.log(">>>newDBVersion",newDBVersion);
    axios.post("/api/saveNewVersion.php",newDBVersion)
    // .then((resp)=>{console.log(">>>resp toggleRelease",resp.data)})

    set(folderDictionary({driveId,folderId}),(was)=>{
      let newFolderInfo = {...was};
      newFolderInfo.contentsDictionary =  {...was.contentsDictionary}
      newFolderInfo.contentsDictionary[itemId] = {...was.contentsDictionary[itemId]};
      let newIsReleased = '0';
      if (doenetIsReleased){
        newIsReleased = '1';
      }
      newFolderInfo.contentsDictionary[itemId].isReleased = newIsReleased;
      return newFolderInfo;
    })
})

  const versionHistoryActive = useRecoilCallback(({snapshot,set})=> async (version)=>{
//     set(versionHistoryActiveAtom,version.versionId)
//     let doenetML = await snapshot.getPromise(fileByContentId(version.contentId));
//     // const doenetML = loadableDoenetML.data;
//     set(editorDoenetMLAtom,doenetML);
//     set(viewerDoenetMLAtom,(was)=>{
//       let newObj = {...was}
//       newObj.doenetML = doenetML;
//       newObj.updateNumber = was.updateNumber+1;
//       return newObj});
  })

  const setAsCurrent = useRecoilCallback(({snapshot,set})=> async ({doenetId,version})=>{
    //current to autosave
    // const newDraftVersionId = nanoid();
    // const oldVersions = await snapshot.getPromise(itemHistoryAtom(doenetId));
    // let newVersions = {...oldVersions};
    // let autoSaveWasDraft = {...oldVersions.draft}
    // autoSaveWasDraft.isDraft = "0";
    // autoSaveWasDraft.title = "Autosave (was draft)";
    // autoSaveWasDraft.timestamp = buildTimestamp();
    // newVersions.autoSaves = [autoSaveWasDraft,...oldVersions.autoSaves]
    // //copy (or move?) named version to current
    // let newDraft = {...version};
    // newDraft.isDraft = "1";
    // newDraft.versionId = newDraftVersionId;
    // newVersions.draft = newDraft;
    // // set(itemHistoryAtom(doenetId),newVersions)
    // //set viewer's and text editor's doenetML
    // let doenetML = await snapshot.getPromise(fileByContentId(newDraft.contentId));
    // console.log(">>>set current draft as doenetML:",doenetML)
    // // set(textEditorDoenetMLAtom,doenetML);
    set(textEditorDoenetMLAtom,"test");
    // set(viewerDoenetMLAtom,donetML);

    //   let newDBVersion = {...newDraft,
    //     isSetAsCurrent:'1',
    //     newDraftVersionId,
    //     newDraftContentId:newDraft.contentId,
    //     doenetId
    //   }
    //   console.log(">>>newDBVersion",newDBVersion)
    //   axios.post("/api/saveNewVersion.php",newDBVersion)
    //   .then(resp=>console.log(">>>resp",resp.data))

  });

  const saveVersion = useRecoilCallback(({snapshot,set})=> async (doenetId)=>{

    const doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
    const timestamp = buildTimestamp();
    const contentId = getSHAofContent(doenetML);
    const versionId = nanoid();
    const oldVersions = await snapshot.getPromise(itemHistoryAtom(doenetId));
    let newVersions = {...oldVersions};

    const title = `Save ${oldVersions.named.length+1}`

    let newVersion = {
      title,
      versionId,
      timestamp,
      isReleased:'0',
      isDraft:'0',
      isNamed:'1',
      contentId
    }
    let newDBVersion = {...newVersion,
      doenetML,
      doenetId
    }

    
    newVersions.named = [newVersion,...oldVersions.named];

    set(itemHistoryAtom(doenetId),newVersions)
    set(fileByContentId(contentId),doenetML);
    
    //TODO: Errors don't seem to fire when offline
    axios.post("/api/saveNewVersion.php",newDBVersion)
       .then((resp)=>{
         console.log(">>>resp saveVersion",resp.data)
          if (resp?.data?.success){
            addToast('New Version Saved!', toastType.SUCCESS)
          }else{
            addToast('Version NOT Saved!', toastType.ERROR);
          }
        })
        .catch((err)=>{
          console.log(">>>err",err)
          addToast('Version NOT Saved!', toastType.ERROR);

        })
    
    
  })

  const setSelectedVersionId = useRecoilCallback(({snapshot,set})=> async (versionId,isCurrentDraft)=>{
    set(selectedVersionIdAtom,versionId);
    set(currentDraftSelectedAtom,isCurrentDraft);
    console.log(">>>set versionId to ",versionId)
  })
  
//make sure we are ready
if (initializedDoenetId !== doenetId){
  return <div style={props.style}></div>
}


// console.log(">>>versionHistory",versionHistory)
// console.log(">>>initializedDoenetId",initializedDoenetId)
// console.log(">>>path",path)

    let options = [];
    let versionsObj = {}

  // if (versionHistory.contents?.named?.length > 0){
     let inUseVersionId = selectedVersionId; //Only select history save if current isn't selected
  

  for (let version of versionHistory.contents.named){
    // console.log(">>>version",version)
    versionsObj[version.versionId] = version;
    let selected = false;
    if (version.versionId === inUseVersionId){
      selected = true;
    }
    let released = '';
    if (version.isReleased === '1'){
      released = "(Released)";
    }
    options.push(<option value={version.versionId} selected={selected}>{released} {version.title}</option>,)
  }


  const version = versionsObj[inUseVersionId];
  let releaseButtonText = "Release";
  if (version?.isReleased === '1'){
    releaseButtonText = "Retract"
  }

     
  return <div style={props.style}>
    <div style={{margin:"6px 0px 6px 0px"}}>
    <Button width="menu" value="Save Version" onClick={()=>saveVersion(doenetId)} />
    </div>
    <select 
    size='2' 
    style={{width:'230px'}}
    onChange={(e)=>{setSelectedVersionId(e.target.value,true)}}>
    {/* <option value={version.versionId} selected={selected}>{released} {version.title}</option> */}
    <option value={'version.versionId'} selected={currentDraftSelected}>Current Draft</option>
  </select>

    <div style={{margin:"6px 0px 6px 0px"}}>
    <Button value="Release Current (soon)" disabled onClick={()=>console.log(">>>release current")} />
    </div>
    <div>History</div>
  <select 
    size='8' 
    style={{width:'230px'}}
    onChange={(e)=>{setSelectedVersionId(e.target.value,false)}}>
    {options}
  </select>
  <div>Name: {version?.title}</div>
  <ClipboardLinkButtons contentId={version?.contentId} />
        <div><RenameVersionControl key={version?.versionId} doenetId={doenetId} title={version?.title} versionId={version?.versionId} /></div>
       {/* <div><button onClick={()=>versionHistoryActive(version)} >View</button></div>  */}
       <div><button onClick={()=>setAsCurrent({doenetId,version})} >Set As Current</button></div> 
       <div><button onClick={(e)=>toggleReleaseNamed({doenetId,versionId:version.versionId,driveId,folderId,itemId})} >{releaseButtonText}</button></div>
  </div>
  
  // return <div style={props.style}>
  //   <div>Enter VersionHistory code</div>
  // </div>
}

// function VersionHistoryPanel(props){
  
//   const versionHistory = useRecoilValueLoadable(itemHistoryAtom(doenetId))
//   // const activeVersionId  = useRecoilValue(versionHistoryActiveAtom);
//   // const [editingVersionId,setEditingVersionId] = useRecoilState(EditingVersionIdAtom);

//   const toggleReleaseNamed = useRecoilCallback(({set})=> async (doenetId,versionId,driveId,folderId)=>{
//     let doenetIsReleased = false;
    
//     set(itemHistoryAtom(doenetId),(was)=>{
//       let newHistory = {...was}
//       newHistory.named = [...was.named];
//       let newVersion;
//       for (const [i,version] of newHistory.named.entries()){
//         if (versionId === version.versionId){
//           newVersion = {...version}

//           if (version.isReleased === '0'){
//             //release
//             newVersion.isReleased = '1';
//             newHistory.named.splice(i,1,newVersion)
//           break;
//           }else{
//             //retract
//             newVersion.isReleased = '0';
//             newHistory.named.splice(i,1,newVersion)
//           break;
//           }
//         }
//       }
//       for (let named of newHistory.named){
//         if (named.isReleased === '1'){
//           doenetIsReleased = true;
//           break;
//         }
//       }
//       let newDBVersion = {...newVersion,
//         isNewToggleRelease:'1',
//         doenetId
//       }
//       // console.log(">>>newDBVersion",newDBVersion);
//          axios.post("/api/saveNewVersion.php",newDBVersion)
//           // .then((resp)=>{console.log(">>>resp toggleRelease",resp.data)})
//       return newHistory;
//     })
//     set(folderDictionary({driveId,folderId}),(was)=>{
//       let newFolderInfo = {...was};
//       newFolderInfo.contentsDictionary =  {...was.contentsDictionary}
//       newFolderInfo.contentsDictionary[props.itemId] = {...was.contentsDictionary[props.itemId]};
//       let newIsReleased = '0';
//       if (doenetIsReleased){
//         newIsReleased = '1';
//       }
//       newFolderInfo.contentsDictionary[props.itemId].isReleased = newIsReleased;
//       return newFolderInfo;
//     })
// })

//   const versionHistoryActive = useRecoilCallback(({snapshot,set})=> async (version)=>{
//     set(versionHistoryActiveAtom,version.versionId)
//     let doenetML = await snapshot.getPromise(fileByContentId(version.contentId));
//     // const doenetML = loadableDoenetML.data;
//     set(editorDoenetMLAtom,doenetML);
//     set(viewerDoenetMLAtom,(was)=>{
//       let newObj = {...was}
//       newObj.doenetML = doenetML;
//       newObj.updateNumber = was.updateNumber+1;
//       return newObj});
//   })

//   const setAsCurrent = useRecoilCallback(({snapshot,set})=> async (doenetId,version)=>{
//     // console.log(">>>sac",doenetId,version)
//     //current to autosave
//     const newDraftVersionId = nanoid();
//     const oldVersions = await snapshot.getPromise(itemHistoryAtom(doenetId));
//     let newVersions = {...oldVersions};
//     let autoSaveWasDraft = {...oldVersions.draft}
//     autoSaveWasDraft.isDraft = "0";
//     autoSaveWasDraft.title = "Autosave (was draft)";
//     autoSaveWasDraft.timestamp = buildTimestamp();
//     newVersions.autoSaves = [autoSaveWasDraft,...oldVersions.autoSaves]
//     //copy (or move?) named version to current
//     let newDraft = {...version};
//     newDraft.isDraft = "1";
//     newDraft.versionId = newDraftVersionId;
//     newVersions.draft = newDraft;
//     set(itemHistoryAtom(doenetId),newVersions)
//     //set viewer's and text editor's doenetML
//     let doenetML = await snapshot.getPromise(fileByContentId(newDraft.contentId));
//     set(editorDoenetMLAtom,doenetML);
//     set(viewerDoenetMLAtom,(was)=>{
//       let newObj = {...was}
//       newObj.doenetML = doenetML;
//       newObj.updateNumber = was.updateNumber+1;
//       return newObj});

//       let newDBVersion = {...newDraft,
//         isSetAsCurrent:'1',
//         newDraftVersionId,
//         newDraftContentId:newDraft.contentId,
//         doenetId
//       }
//       // console.log(">>>newDBVersion",newDBVersion)
//       axios.post("/api/saveNewVersion.php",newDBVersion)
//       // .then(resp=>console.log(">>>resp",resp.data))

//   });
  
//   const [selectedVersionId,setSelectedVersionId] = useState(null)

//   if (versionHistory.state === "loading"){ return null;}
//   if (versionHistory.state === "hasError"){ 
//     console.error(versionHistory.contents)
//     return null;}

//     let controls = null;
//     let options = [];
//     let versionsObj = {}

//   for (let version of versionHistory.contents.named){
//     versionsObj[version.versionId] = version;
//     let selected = false;
//     if (version.versionId === selectedVersionId){
//       selected = true;
//     }
//     let released = '';
//     if (version.isReleased === '1'){
//       released = "(Released)";
//     }
//     options.push(<option value={version.versionId} selected={selected}>{released} {version.title}</option>,)
//   }
//     let selector = <select 
//     size='8' 
//     onChange={(e)=>{setSelectedVersionId(e.target.value)}}>
//     {options}
//   </select>

// if (selectedVersionId){
//   const version = versionsObj[selectedVersionId];
//   let releaseButtonText = "Release";
//   if (version.isReleased === '1'){
//     releaseButtonText = "Retract"
//   }

//     const releaseButton = <div><button onClick={(e)=>toggleReleaseNamed(doenetId,version.versionId,props.driveId,props.folderId)} >{releaseButtonText}</button></div>

//   controls = <>
//   <div>Name: {version.title}</div>
//   <ClipboardLinkButtons contentId={version.contentId} />
//         <div><RenameVersionControl key={version.versionId} doenetId={doenetId} title={version.title} versionId={version.versionId} /></div>
//        <div><button onClick={()=>versionHistoryActive(version)} >View</button></div> 
//        <div><button onClick={()=>setAsCurrent(doenetId,version)} >Set As Current</button></div> 
//         {releaseButton}
//   </>
// }
     
//   return <>
//   <h2>Versions</h2>
//   {selector}
//   {controls}
//   </>
// }