import React from 'react';


export default function VersionHistory(props){

  
  return <div style={props.style}>
    <div>Enter VersionHistory code</div>
  </div>
}

// function VersionHistoryPanel(props){
  
//   const versionHistory = useRecoilValueLoadable(itemHistoryAtom(props.doenetId))
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

//     const releaseButton = <div><button onClick={(e)=>toggleReleaseNamed(props.doenetId,version.versionId,props.driveId,props.folderId)} >{releaseButtonText}</button></div>

//   controls = <>
//   <div>Name: {version.title}</div>
//   <ClipboardLinkButtons contentId={version.contentId} />
//         <div><RenameVersionControl key={version.versionId} doenetId={props.doenetId} title={version.title} versionId={version.versionId} /></div>
//        <div><button onClick={()=>versionHistoryActive(version)} >View</button></div> 
//        <div><button onClick={()=>setAsCurrent(props.doenetId,version)} >Set As Current</button></div> 
//         {releaseButton}
//   </>
// }
     
//   return <>
//   <h2>Versions</h2>
//   {selector}
//   {controls}
//   </>
// }