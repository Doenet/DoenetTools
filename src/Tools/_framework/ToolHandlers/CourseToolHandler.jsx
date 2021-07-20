import React, { useState } from 'react';
import { 
  atom, 
  selector, 
  atomFamily,
  selectorFamily,
  useRecoilCallback
 } from 'recoil'
import axios from "axios";
import sha256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useToast, toastType } from '@Toast';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExternalLinkAlt
 } from '@fortawesome/free-solid-svg-icons';

 import { 
  faClipboard
 } from '@fortawesome/free-regular-svg-icons';

import { nanoid } from 'nanoid';

export const itemHistoryAtom = atomFamily({
  key:"itemHistoryAtom",
  default: selectorFamily({
    key:"itemHistoryAtom/Default",
    get:(doenetId)=> async ()=>{
      let draft = {};
      let named = [];
      let autoSaves = [];
      if (!doenetId){
        return {draft,named,autoSaves};
      }
      const { data } = await axios.get(
        `/api/loadVersions.php?doenetId=${doenetId}`
      );
        
      draft = data.versions[0];
      for (let version of data.versions){
        if (version.isDraft === '1'){
          continue;
        }
        if (version.isNamed === '1'){
          named.push(version);
          continue;
        }
        autoSaves.push(version);
      }
      return {draft,named,autoSaves};

    }
  })
})

export const fileByContentId = atomFamily({
  key:"fileByContentId",
  default: selectorFamily({
    key:"fileByContentId/Default",
    get:(contentId)=> async ()=>{
      if (!contentId){
        return "";
      }
      const local = localStorage.getItem(contentId);
      if (local){ return local}
      try {
        const server = await axios.get(`/media/${contentId}.doenet`); 
        return server.data;
      } catch (err) {
        //TODO: Handle 404
        return "Error Loading";
      }
    }
  })
  
})

export const drivecardSelectedNodesAtom = atom({
  key:'drivecardSelectedNodesAtom',
  default:[]
})

export const fetchDrivesQuery = atom({
  key:"fetchDrivesQuery",
  default: selector({
    key:"fetchDrivesQuery/Default",
    get: async ()=>{
      const { data } = await axios.get(`/api/loadAvailableDrives.php`);
      return data
    },
  })
})

export const fetchDrivesSelector = selector({
  key:"fetchDrivesSelector",
  get:({get})=>{
    return get(fetchDrivesQuery);
  },
  set:({get,set},labelTypeDriveIdColorImage)=>{
    let driveData = get(fetchDrivesQuery)
    // let selectedDrives = get(selectedDriveInformation);
    let newDriveData = {...driveData};
    newDriveData.driveIdsAndLabels = [...driveData.driveIdsAndLabels];
    let params = {
      driveId:labelTypeDriveIdColorImage.newDriveId,
      label:labelTypeDriveIdColorImage.label,
      type:labelTypeDriveIdColorImage.type,
      image:labelTypeDriveIdColorImage.image,
      color:labelTypeDriveIdColorImage.color,
    }
    let newDrive;
    function duplicateFolder({sourceFolderId,sourceDriveId,destDriveId,destFolderId,destParentFolderId}){
      let contentObjs = {};
      // const sourceFolder = get(folderDictionary({driveId:sourceDriveId,folderId:sourceFolderId}));  
      const sourceFolder = get(folderDictionaryFilterSelector({driveId:sourceDriveId,folderId:sourceFolderId}));
      if (destFolderId === undefined){
        destFolderId = destDriveId;  //Root Folder of drive
        destParentFolderId = destDriveId;  //Root Folder of drive
      }

      let contentIds = {defaultOrder:[]};
      let contentsDictionary = {}
      let folderInfo = {...sourceFolder.folderInfo}
      folderInfo.folderId = destFolderId;
      folderInfo.parentFolderId = destParentFolderId;

      for (let sourceItemId of sourceFolder.contentIds.defaultOrder){
        const destItemId = nanoid();
        contentIds.defaultOrder.push(destItemId);
        let sourceItem = sourceFolder.contentsDictionary[sourceItemId]
        contentsDictionary[destItemId] = {...sourceItem}
        contentsDictionary[destItemId].parentFolderId = destFolderId;
        contentsDictionary[destItemId].itemId = destItemId;
        if (sourceItem.itemType === 'Folder'){
         let childContentObjs = duplicateFolder({sourceFolderId:sourceItemId,sourceDriveId,destDriveId,destFolderId:destItemId,destParentFolderId:destFolderId})
          contentObjs = {...contentObjs,...childContentObjs};
        }else if (sourceItem.itemType === 'DoenetML'){
          let destDoenetId = nanoid();
          contentsDictionary[destItemId].sourceDoenetId = sourceItem.doenetId;
          contentsDictionary[destItemId].doenetId = destDoenetId;
        }else if (sourceItem.itemType === 'URL'){
          let desturlId = nanoid();
          contentsDictionary[destItemId].urlId = desturlId;
        }else{
          console.log(`!!! Unsupported type ${sourceItem.itemType}`)
        }
        contentObjs[destItemId] = contentsDictionary[destItemId];
      }
      const destFolderObj = {contentIds,contentsDictionary,folderInfo}
      // console.log({destFolderObj})
      set(folderDictionary({driveId:destDriveId,folderId:destFolderId}),destFolderObj)
      return contentObjs;
    }
    if (labelTypeDriveIdColorImage.type === "new content drive"){
      newDrive = {
        driveId:labelTypeDriveIdColorImage.newDriveId,
        isShared:"0",
        label:labelTypeDriveIdColorImage.label,
        type: "content"
      }
      newDriveData.driveIdsAndLabels.unshift(newDrive)
    set(fetchDrivesQuery,newDriveData)

    const payload = { params }
    axios.get("/api/addDrive.php", payload)
  // .then((resp)=>console.log(">>>resp",resp.data))
    }else if (labelTypeDriveIdColorImage.type === "new course drive"){
      newDrive = {
        driveId:labelTypeDriveIdColorImage.newDriveId,
        isShared:"0",
        label:labelTypeDriveIdColorImage.label,
        type: "course",
        image:labelTypeDriveIdColorImage.image,
        color:labelTypeDriveIdColorImage.color,
        subType:"Administrator"
      }
      newDriveData.driveIdsAndLabels.unshift(newDrive)
    set(fetchDrivesQuery,newDriveData)

    const payload = { params }
    axios.get("/api/addDrive.php", payload)
  // .then((resp)=>console.log(">>>resp",resp.data))
    
    }else if (labelTypeDriveIdColorImage.type === "update drive label"){
      //Find matching drive and update label
      for (let [i,drive] of newDriveData.driveIdsAndLabels.entries()){
        if (drive.driveId === labelTypeDriveIdColorImage.newDriveId ){
          let newDrive = {...drive};
          newDrive.label = labelTypeDriveIdColorImage.label
          newDriveData.driveIdsAndLabels[i] = newDrive;
          break;
        }
      }
      //Set drive
    set(fetchDrivesQuery,newDriveData)
      //Save to db
      const payload = { params }
      axios.get("/api/updateDrive.php", payload)
    }else if (labelTypeDriveIdColorImage.type === "update drive color"){
    //TODO: implement      

    }else if (labelTypeDriveIdColorImage.type === "delete drive"){
      //Find matching drive and update label
      let driveIdsAndLabelsLength = newDriveData.driveIdsAndLabels;
      // for (let [i,drive] of newDriveData.driveIdsAndLabels.entries()){
        for(let i = 0; i< driveIdsAndLabelsLength.length; i++){
        for(let x=0; x<labelTypeDriveIdColorImage.newDriveId.length ;x++){
          if (driveIdsAndLabelsLength[i].driveId === labelTypeDriveIdColorImage.newDriveId[x] ){
            newDriveData.driveIdsAndLabels.splice(i,1);
            i = (i==0) ? i : i-1;
          }
        }
      }
      //Set drive
      set(fetchDrivesQuery,newDriveData)
        //Save to db
        const payload = { params }
        axios.get("/api/updateDrive.php", payload)
    }
  }
})

export const variantInfoAtom = atom({
  key:"variantInfoAtom",
  default:{index:null,name:null,lastUpdatedIndexOrName:null,requestedVariant:{index:1}}
})

export const variantPanelAtom = atom({
  key:"variantPanelAtom",
  default:{index:null,name:null}
})

export function buildTimestamp(){
  const dt = new Date();
  return `${
    dt.getFullYear().toString().padStart(2, '0')}-${
    (dt.getMonth()+1).toString().padStart(2, '0')}-${
    dt.getDate().toString().padStart(2, '0')} ${
    dt.getHours().toString().padStart(2, '0')}:${
    dt.getMinutes().toString().padStart(2, '0')}:${
    dt.getSeconds().toString().padStart(2, '0')}`
}

export const getSHAofContent = (doenetML)=>{
  if (doenetML === undefined){
    return;
  }
  //NOTICE: JSON.stringify CHANGES THE CONTENT SO IT DOESN'T MATCH
  // let contentId = sha256(JSON.stringify(doenetML)).toString(CryptoJS.enc.Hex);
  let contentId = sha256(doenetML).toString(CryptoJS.enc.Hex);
  return contentId;
}

export function ClipboardLinkButtons(props){
  const addToast = useToast();


  if (!props.contentId){
    console.error("Component only handles contentId at this point")
    return null;
  }
  

  const link = `http://${window.location.host}/content/#/?contentId=${props.contentId}`
  return <div> 
  <CopyToClipboard onCopy={()=>addToast('Link copied to clipboard!', toastType.SUCCESS)} text={link}>
  <button>copy link <FontAwesomeIcon icon={faClipboard}/></button> 
  </CopyToClipboard>

  <button onClick={
    ()=>window.open(link, '_blank')
  }>visit <FontAwesomeIcon icon={faExternalLinkAlt}/></button>
  </div>
}

export function RenameVersionControl(props){
  let [textFieldFlag,setTextFieldFlag] = useState(false);
  let [currentTitle,setCurrentTitle] = useState(props.title);

  const renameVersion = useRecoilCallback(({set})=> async (doenetId,versionId,newTitle)=>{
    // console.log(">>>",{doenetId,versionId,newTitle})
      set(itemHistoryAtom(doenetId),(was)=>{
        let newHistory = {...was}
        newHistory.named = [...was.named];
        let newVersion;
        for (const [i,version] of newHistory.named.entries()){
          if (versionId === version.versionId){
            newVersion = {...version}
            newVersion.title = newTitle;
            newHistory.named.splice(i,1,newVersion)
          }
        }
        let newDBVersion = {...newVersion,
          isNewTitle:'1',
          doenetId
        }
           axios.post("/api/saveNewVersion.php",newDBVersion)
            // .then((resp)=>{console.log(">>>resp saveNamedVersion",resp.data)})
        return newHistory;
      })
  
    });

    function renameIfChanged(){
      setTextFieldFlag(false)
      if (props.title !== currentTitle){
        renameVersion(props.doenetId,props.versionId,currentTitle);
      }
    }

    if (!textFieldFlag){
      return <button onClick={()=>setTextFieldFlag(true)}>Rename</button>
    }
  return <input type='text' autoFocus value={currentTitle} 
  onChange={(e)=>{setCurrentTitle(e.target.value)}}
  onKeyDown={(e)=>{
    if (e.key === 'Enter'){
    renameIfChanged();
  }}}
  onBlur={()=>{
    renameIfChanged();
  }}
  />

}