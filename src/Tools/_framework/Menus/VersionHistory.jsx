import React from 'react';
import { 
  atom,
  useRecoilValue,
  // useRecoilState,
  useRecoilValueLoadable,
  useRecoilCallback,
 } from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
import { itemHistoryAtom } from '../ToolHandlers/CourseToolHandler';
import { 
  editorDoenetIdInitAtom, 
  updateTextEditorDoenetMLAtom,
  textEditorDoenetMLAtom,
  viewerDoenetMLAtom,
} from '../ToolPanels/EditorViewer';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { 
  buildTimestamp, 
  getSHAofContent, 
  ClipboardLinkButtons, 
  RenameVersionControl,
  fileByContentId } from '../ToolHandlers/CourseToolHandler';
import { nanoid } from 'nanoid';
import axios from "axios";
import { useToast, toastType } from '@Toast';
import { folderDictionary } from '../../../_reactComponents/Drive/NewDrive';
import { editorSaveTimestamp } from '../ToolPanels/DoenetMLEditor'; 

export const currentDraftSelectedAtom = atom({
  key:"currentDraftSelectedAtom",
  default:true
})

const selectedVersionIdAtom = atom({
  key:"selectedVersionIdAtom",
  default:null
})

export default function VersionHistory(props){
console.log(">>>===VersionHistory")
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const path = decodeURIComponent(useRecoilValue(searchParamAtomFamily('path')));
  const versionHistory = useRecoilValueLoadable(itemHistoryAtom(doenetId))
  const initializedDoenetId = useRecoilValue(editorDoenetIdInitAtom);
  const selectedVersionId = useRecoilValue(selectedVersionIdAtom);
  const addToast = useToast();
  const currentDraftSelected = useRecoilValue(currentDraftSelectedAtom)
  const [driveId, folderId, itemId] = path.split(':');

  const setReleaseNamed = useRecoilCallback(({set,snapshot})=> async ({doenetId,versionId,driveId,folderId,itemId})=>{
    let doenetIsReleased = false;
    let history = await snapshot.getPromise(itemHistoryAtom(doenetId));
    let newHistory = {...history}
    newHistory.named = [...history.named];
    let newVersion;
    //Establish if we are releasing or retracting "doenetIsReleased"
    //Toggle released
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
    //If releasing then retract other named versions
    if (doenetIsReleased){
      for (const [i,version] of newHistory.named.entries()){
        if (versionId !== version.versionId && version.isReleased === '1'){
          let newVersion = {...version}
            //retract
            newVersion.isReleased = '0';
            newHistory.named.splice(i,1,newVersion)
            break; //Only one other should ever be released
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
    axios.post("/api/saveNewVersion.php",newDBVersion)
    .then((resp)=>{

      if (resp.data.success){
        let message = `'${newVersion.title}' Released`
        if (newVersion.isReleased === '0'){
           message = `'${newVersion.title}' Retracted`
        }
        addToast(message, toastType.SUCCESS)

      }else{
        let message = `Error occured releasing '${newVersion.title}'`
        if (newVersion.isReleased === '0'){
           message = `Error occured retracting '${newVersion.title}'`
        }
        addToast(message, toastType.ERROR)

      }

    })
    set(folderDictionary({driveId,folderId}),(was)=>{
      let newFolderInfo = {...was};
      //TODO: once path has itemId fixed delete this code
      for (let testItemId of newFolderInfo.contentIds.defaultOrder){
        if (newFolderInfo.contentsDictionary[testItemId].doenetId === doenetId){
          itemId = testItemId;
          break;
        }
      }


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

  const setAsCurrent = useRecoilCallback(({snapshot,set})=> async ({doenetId,versionId})=>{
    //Build current draft to named save
    const was = await snapshot.getPromise(itemHistoryAtom(doenetId));
    let nameSaveWasDraft = {...was.draft}
    nameSaveWasDraft.isDraft = "0";
    const title = `Save (current) ${was.named.length+1}`
    nameSaveWasDraft.title = title;
    nameSaveWasDraft.timestamp = buildTimestamp();
    // console.log(">>>nameSaveWasDraft",nameSaveWasDraft)

    //Build version as draft
    let newDraft = {};
    for (let version of was.named){
      if (version.versionId === versionId){
        newDraft = {...version};
      }
    }
    const newDraftVersionId = nanoid();
    newDraft.versionId = newDraftVersionId;
    newDraft.isDraft = '1';
    newDraft.isNamed = '0';
    newDraft.isReleased = '0';
    // console.log(">>>newDraft",newDraft)

    //Save new draft in draft and old draft in named version

    let newItemHistory = {...was};
    newItemHistory.named = [nameSaveWasDraft,...was.named]
    newItemHistory.draft = newDraft;
    // console.log(">>>newItemHistory",newItemHistory)
    set(itemHistoryAtom(doenetId),newItemHistory)

    //set viewer's and text editor's doenetML (Currently not needed)
    // let doenetML = await snapshot.getPromise(fileByContentId(newDraft.contentId));
    // set(viewerDoenetMLAtom,doenetML)
    // set(updateTextEditorDoenetMLAtom,doenetML)
    // set(textEditorDoenetMLAtom,doenetML)

    //Select Current Draft
    set(currentDraftSelectedAtom,true);
    set(selectedVersionIdAtom,newDraftVersionId);


      let newDBVersion = {...newDraft,
        isSetAsCurrent:'1',
        newDraftVersionId,
        newDraftContentId:newDraft.contentId,
        doenetId,
        newTitle:title,
      }
      // console.log(">>>newDBVersion",newDBVersion)
      axios.post("/api/saveNewVersion.php",newDBVersion)
      // .then(resp=>console.log(">>>resp",resp.data))

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
        //  console.log(">>>resp saveVersion",resp.data)
          if (resp?.data?.success){
            addToast('New Version Saved!', toastType.SUCCESS)
          }else{
            addToast('Version NOT Saved!', toastType.ERROR);
            console.error(resp.data?.message);
          }
        })
        .catch((err)=>{
          // console.log(">>>err",err)
          addToast('Version NOT Saved!', toastType.ERROR);

        })
  })

  const saveAndReleaseCurrent = useRecoilCallback(({snapshot,set}) => 
    async ({doenetId,driveId,folderId,itemId}) => {
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
          //  console.log(">>>resp saveVersion",resp.data)
            if (resp?.data?.success){
              addToast('New Version Saved!', toastType.SUCCESS)
            }else{
              addToast('Version NOT Saved!', toastType.ERROR);
            }
          })
          .catch((err)=>{
            // console.log(">>>err",err)
            addToast('Version NOT Saved!', toastType.ERROR);

          })
      setReleaseNamed({doenetId,versionId,driveId,folderId,itemId});

  })

  const setSelectedVersionId = useRecoilCallback(({snapshot,set})=> async ({doenetId,versionId,isCurrentDraft})=>{
    //Update menus
    set(selectedVersionIdAtom,versionId);
    set(currentDraftSelectedAtom,isCurrentDraft); //Use to determine to make read only or not

    //Get DoenetML of currently selected version
    const oldVersions = await snapshot.getPromise(itemHistoryAtom(doenetId));
    let newVersions = {...oldVersions};

    let oldDraftContentId = oldVersions.draft.contentId;
    if (!isCurrentDraft){
      const wasDraftSelected = await snapshot.getPromise(currentDraftSelectedAtom);
      if (wasDraftSelected){
        //we left the draft and it needs to be saved
        const newDraftDoenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
        const newDraftContentId = getSHAofContent(newDraftDoenetML);
        if (newDraftContentId !== oldDraftContentId){

          //Save new draft
          let newDraft = {...oldVersions.draft};
          newDraft.contentId = newDraftContentId;
          newDraft.timestamp = buildTimestamp();
          

          newVersions.draft = newDraft;
          set(itemHistoryAtom(doenetId),newVersions)
          set(fileByContentId(newDraftContentId),newDraftDoenetML)

          let newDBVersion = {...newDraft,
            doenetML:newDraftDoenetML,
            doenetId
          }
          
          try {
            const { data } = await axios.post("/api/saveNewVersion.php",newDBVersion)
            if (data.success){
              set(editorSaveTimestamp,new Date());
            }else{
              //TODO: Toast here
              console.log("ERROR",data.message)
            }
          } catch (error) {
            console.log("ERROR",error)
          }
        }
      }
    }
    //Assume user just selected the draft version
    let displayContentId = newVersions.draft.contentId;
    //If selected version is named use that contentId
    for (let version of newVersions.named){
      if (version.versionId === versionId){
        displayContentId = version.contentId;
        break;
      }
    }

    const doenetML = await snapshot.getPromise(fileByContentId(displayContentId));

    //Display doenetML in viewer and text editor
    set(viewerDoenetMLAtom,doenetML)
    set(updateTextEditorDoenetMLAtom,doenetML)
    // set(textEditorDoenetMLAtom,doenetML) //This causes current draft to be overwritten
    
  })
  
//make sure we are ready
if (initializedDoenetId !== doenetId){
  return <div style={props.style}></div>
}


// console.log(">>>versionHistory.contents",versionHistory.contents)
// console.log(">>>initializedDoenetId",initializedDoenetId)
// console.log(">>>path",path)

//Protected if not defined yet
    if (!versionHistory?.contents?.named){
      return null;
    }

    let options = [];
    let versionsObj = {}

  // if (versionHistory.contents?.named?.length > 0){
     let inUseVersionId = selectedVersionId; //Only select history save if current isn't selected
  
  
  for (let version of versionHistory.contents.named){

    versionsObj[version.versionId] = version;
    let selected = false;
    if (version.versionId === inUseVersionId){
      selected = true;
    }
    let released = '';
    if (version.isReleased === '1'){
      released = "(Released)";
    }
    options.push(<option key={`option${version.versionId}`} value={version.versionId} selected={selected}>{released} {version.title}</option>,)
  }

  const version = versionsObj[inUseVersionId];
  let releaseButtonText = "Release";
  if (version?.isReleased === '1'){
    releaseButtonText = "Retract"
  }
     
  return <>
    <div style={{margin:"6px 0px 6px 0px"}}>
    <Button disabled={!currentDraftSelected} width="menu" value="Save Version" onClick={()=>saveVersion(doenetId)} />
    </div>
    <select 
    size='2' 
    style={{width:'230px'}}
    onChange={(e)=>{setSelectedVersionId({doenetId,versionId:e.target.value,isCurrentDraft:true})}}>
    {/* <option value={version.versionId} selected={selected}>{released} {version.title}</option> */}
    <option value={versionHistory.contents.draft.versionId} selected={currentDraftSelected}>Current Draft</option>
  </select>

    <div style={{margin:"6px 0px 6px 0px"}}>
    <Button disabled={!currentDraftSelected} value="Release Current" onClick={()=> {
      saveAndReleaseCurrent({doenetId,driveId,folderId,itemId});
    }}/>
    </div>
    <div>History</div>
  <select 
    size='8' 
    style={{width:'230px'}}
    onChange={(e)=>{setSelectedVersionId({doenetId,versionId:e.target.value,isCurrentDraft:false})}}>
    {options}
  </select>
  <div>Name: {version?.title}</div>
  <ClipboardLinkButtons disabled={currentDraftSelected} contentId={version?.contentId} />
        <div><RenameVersionControl key={version?.versionId} disabled={currentDraftSelected} doenetId={doenetId} title={version?.title} versionId={version?.versionId} /></div>
       {/* <div><button onClick={()=>versionHistoryActive(version)} >View</button></div>  */}
       <div><Button disabled={currentDraftSelected} onClick={()=>setAsCurrent({doenetId,versionId:version.versionId})} value="Set As Current" /></div> 
       <div><Button disabled={currentDraftSelected} onClick={()=>setReleaseNamed({doenetId,versionId:version.versionId,driveId,folderId,itemId})} value={releaseButtonText} /></div>
  </>
}
