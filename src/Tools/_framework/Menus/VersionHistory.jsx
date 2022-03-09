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
  ClipboardLinkButtons, 
  RenameVersionControl,
  fileByContentId } from '../ToolHandlers/CourseToolHandler';
import { nanoid } from 'nanoid';
import axios from "axios";
import { useToast, toastType } from '@Toast';
import { folderDictionary } from '../../../_reactComponents/Drive/NewDrive';
import { editorSaveTimestamp } from '../ToolPanels/DoenetMLEditor'; 
import { DateToUTCDateString } from '../../../_utils/dateUtilityFunction';
import { cidFromText } from '../../../Core/utils/cid';

export const currentDraftSelectedAtom = atom({
  key:"currentDraftSelectedAtom",
  default:true
})

export const selectedVersionIdAtom = atom({
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

    const { data } = await axios.get('/api/releaseVersion.php',{params:{doenetId,versionId}});
    const { success, message, isReleased, title } = data;
    //Note: isReleased if true means version is now released

    let actionName = 'Retracted';
    if (isReleased === '1'){
      actionName = 'Released';
    }
    if (success){
        addToast(`"${title}" is ${actionName}`, toastType.SUCCESS)
    }else{
        addToast(message, toastType.ERROR)
    }

//Update data structures 
    set(itemHistoryAtom(doenetId),(was)=>{
      let newObj = {...was}
      let newNamed = [...was.named];

      for (const [i,version] of newNamed.entries()){
        let newVersion = {...version};
        if (version.versionId === versionId){
          newVersion.isReleased = isReleased;
          newNamed[i] = newVersion;
        }else{
          newVersion.isReleased = '0';
          newNamed[i] = newVersion;
        }
      }
      newObj.named = newNamed;
      return newObj;
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
      newFolderInfo.contentsDictionary[itemId].isReleased = isReleased;

      newFolderInfo.contentsDictionaryByDoenetId =  {...was.contentsDictionaryByDoenetId}
      newFolderInfo.contentsDictionaryByDoenetId[doenetId] = {...was.contentsDictionaryByDoenetId[doenetId]};
      newFolderInfo.contentsDictionaryByDoenetId[doenetId].isReleased = isReleased;
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
    // let doenetML = await snapshot.getPromise(fileByContentId(newDraft.cid));
    // set(viewerDoenetMLAtom,doenetML)
    // set(updateTextEditorDoenetMLAtom,doenetML)
    // set(textEditorDoenetMLAtom,doenetML)

    //Select Current Draft
    set(currentDraftSelectedAtom,true);
    set(selectedVersionIdAtom,newDraftVersionId);


      let newDBVersion = {...newDraft,
        isSetAsCurrent:'1',
        newDraftVersionId,
        newDraftContentId:newDraft.cid,
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
    const cid = await cidFromText(doenetML);
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
      cid
    }
    let newDBVersion = {...newVersion,
      doenetML,
      doenetId
    }

    
    newVersions.named = [newVersion,...oldVersions.named];

    set(itemHistoryAtom(doenetId),newVersions)
    set(fileByContentId(cid),doenetML);
    
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
      const timestamp = DateToUTCDateString(new Date());
      const cid = await cidFromText(doenetML);
      const versionId = nanoid();

      const { data } = await axios.post("/api/releaseDraft.php",{
        doenetId,
        doenetML,
        timestamp,
        versionId
      })

      const { success, message, title } = data;
      if (success){
        addToast(`"${title}" is Released.`, toastType.SUCCESS)
      }else{
          addToast(message, toastType.ERROR)
      }

      set(fileByContentId(cid),doenetML);

      //Update data structures 
    set(itemHistoryAtom(doenetId),(was)=>{
      let newObj = {...was}
      let newNamed = [...was.named];
      //Retract all other named versions
      for (const [i,version] of newNamed.entries()){
        let newVersion = {...version};
        newVersion.isReleased = '0';
        newNamed[i] = newVersion;
      }
      
      let newVersion = {
        title,
        versionId,
        timestamp,
        isReleased:'1',
        isDraft:'0',
        isNamed:'1',
        cid
      }
      newNamed.unshift(newVersion);

      newObj.named = newNamed;
      return newObj;
    })
  

    set(folderDictionary({driveId,folderId}),(was)=>{
      let newFolderInfo = {...was};
      //TODO: once path has itemId fixed delete this code
      //Find itemId
      for (let testItemId of newFolderInfo.contentIds.defaultOrder){
        if (newFolderInfo.contentsDictionary[testItemId].doenetId === doenetId){
          itemId = testItemId;
          break;
        }
      }
      newFolderInfo.contentsDictionary =  {...was.contentsDictionary}
      newFolderInfo.contentsDictionary[itemId] = {...was.contentsDictionary[itemId]};
      newFolderInfo.contentsDictionary[itemId].isReleased = '1';

      newFolderInfo.contentsDictionaryByDoenetId =  {...was.contentsDictionaryByDoenetId}
      newFolderInfo.contentsDictionaryByDoenetId[doenetId] = {...was.contentsDictionaryByDoenetId[doenetId]};
      newFolderInfo.contentsDictionaryByDoenetId[doenetId].isReleased = '1';

      return newFolderInfo;
    })


  })

  const setSelectedVersionId = useRecoilCallback(({snapshot,set})=> async ({doenetId,versionId,isCurrentDraft})=>{
    //Update menus
    set(selectedVersionIdAtom,versionId);
    set(currentDraftSelectedAtom,isCurrentDraft); //Use to determine to make read only or not

    //Get DoenetML of currently selected version
    const oldVersions = await snapshot.getPromise(itemHistoryAtom(doenetId));
    let newVersions = {...oldVersions};

    let oldDraftContentId = oldVersions.draft.cid;
    if (!isCurrentDraft){
      const wasDraftSelected = await snapshot.getPromise(currentDraftSelectedAtom);
      if (wasDraftSelected){
        //we left the draft and it needs to be saved
        const newDraftDoenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
        const newDraftContentId = await cidFromText(newDraftDoenetML);
        if (newDraftContentId !== oldDraftContentId){

          //Save new draft
          let newDraft = {...oldVersions.draft};
          newDraft.cid = newDraftContentId;
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
    let displayContentId = newVersions.draft.cid;
    //If selected version is named use that cid
    for (let version of newVersions.named){
      if (version.versionId === versionId){
        displayContentId = version.cid;
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
     <div style={{padding:"6px 0px 6px 0px"}}>   
    <select 
    size='2' 
    style={{width:'230px'}}
    onChange={(e)=>{setSelectedVersionId({doenetId,versionId:e.target.value,isCurrentDraft:true})}}>
    {/* <option value={version.versionId} selected={selected}>{released} {version.title}</option> */}
    <option value={versionHistory.contents.draft.versionId} selected={currentDraftSelected}>Current Draft</option>
  </select>
  </div>
  <div style={{margin:"0px 0px 6px 0px"}}>
    <Button disabled={!currentDraftSelected} width="menu" value="Save Version" onClick={()=>saveVersion(doenetId)} />
    </div>
    <div style={{margin:"6px 0px 6px 0px"}}>
    <Button disabled={!currentDraftSelected} width="menu" value="Release Current" onClick={()=> {
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
  <ClipboardLinkButtons disabled={currentDraftSelected} cid={version?.cid} doenetId={doenetId} />
        <div><RenameVersionControl key={version?.versionId} disabled={currentDraftSelected} doenetId={doenetId} title={version?.title} versionId={version?.versionId} /></div>
       {/* <div><button onClick={()=>versionHistoryActive(version)} >View</button></div>  */}
       <div><Button disabled={currentDraftSelected} onClick={()=>setAsCurrent({doenetId,versionId:version.versionId})} value="Set As Current" /></div> 
       <div><Button disabled={currentDraftSelected} onClick={()=>setReleaseNamed({doenetId,versionId:version.versionId,driveId,folderId,itemId})} value={releaseButtonText} /></div>
  </>
}
