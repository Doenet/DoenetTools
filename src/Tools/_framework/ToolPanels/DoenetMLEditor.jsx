import React, { useRef, useEffect } from 'react';
import { editorDoenetIdInitAtom, textEditorDoenetMLAtom, updateTextEditorDoenetMLAtom } from '../ToolPanels/EditorViewer'
import { 
  atom,
  useRecoilValue, 
  // useRecoilState,
  useSetRecoilState,
  // atom,
  useRecoilCallback,
} from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
import { currentDraftSelectedAtom } from '../Menus/VersionHistory'

import CodeMirror from '../CodeMirror';
import { itemHistoryAtom, fileByContentId } from '../ToolHandlers/CourseToolHandler';
import sha256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';
import axios from "axios";
import { nanoid } from 'nanoid';

export const editorSaveTimestamp = atom({
  key:"",
  default:null
})


const getSHAofContent = (doenetML)=>{
  if (doenetML === undefined){
    return;
  }
  //NOTICE: JSON.stringify CHANGES THE CONTENT SO IT DOESN'T MATCH
  // let contentId = sha256(JSON.stringify(doenetML)).toString(CryptoJS.enc.Hex);
  let contentId = sha256(doenetML).toString(CryptoJS.enc.Hex);
  return contentId;
}

function buildTimestamp(){
  const dt = new Date();
  return `${
    dt.getFullYear().toString().padStart(2, '0')}-${
    (dt.getMonth()+1).toString().padStart(2, '0')}-${
    dt.getDate().toString().padStart(2, '0')} ${
    dt.getHours().toString().padStart(2, '0')}:${
    dt.getMinutes().toString().padStart(2, '0')}:${
    dt.getSeconds().toString().padStart(2, '0')}`
}

export default function DoenetMLEditor(props){
  console.log(">>>===DoenetMLEditor")

  // const [editorDoenetML,setEditorDoenetML] = useRecoilState(textEditorDoenetMLAtom);
  const setEditorDoenetML = useSetRecoilState(textEditorDoenetMLAtom);
  const updateInternalValue = useRecoilValue(updateTextEditorDoenetMLAtom);

  const paramDoenetId = useRecoilValue(searchParamAtomFamily('doenetId')) 
  const initilizedDoenetId = useRecoilValue(editorDoenetIdInitAtom);
  const isCurrentDraft = useRecoilValue(currentDraftSelectedAtom)
  let editorRef = useRef(null);
  let timeout = useRef(null);
  let autosavetimeout = useRef(null);

  const saveDraft = useRecoilCallback(({snapshot,set})=> async (doenetId)=>{

      const doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
      const oldVersions = await snapshot.getPromise(itemHistoryAtom(doenetId));

      let newDraft = {...oldVersions.draft};
  
      const contentId = getSHAofContent(doenetML);
  
      newDraft.contentId = contentId;
      newDraft.timestamp = buildTimestamp();
  
      let oldVersionsReplacement = {...oldVersions};
  
      oldVersionsReplacement.draft = newDraft;
  
      set(itemHistoryAtom(doenetId),oldVersionsReplacement)
      set(fileByContentId(contentId),doenetML)
  
      //Save in localStorage
      // localStorage.setItem(contentId,doenetML)
  
      let newDBVersion = {...newDraft,
        doenetML,
        doenetId
      }

      try {
        const resp = await axios.post("/api/saveNewVersion.php",newDBVersion)
        if (resp.data.success){
          set(editorSaveTimestamp,new Date());
        }else{
          //TODO: Toast here
          console.log("ERROR",resp.data.message)
        }
      } catch (error) {
        console.log("ERROR",error)
      }
    
  },[]);

  const autoSave = useRecoilCallback(({snapshot,set})=> async (doenetId)=>{
    const doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
    const contentId = getSHAofContent(doenetML);
    const timestamp = buildTimestamp();
    const versionId = nanoid();

    let newVersion = {
      contentId,
      versionId,
      timestamp,
      isDraft:'0',
      isNamed:'0',
      isReleased:'0',
      title:'Autosave'
    }
    let newDBVersion = {...newVersion,
      doenetML,
      doenetId
    }

    const oldVersions = await snapshot.getPromise(itemHistoryAtom(doenetId));
    let newVersions = {...oldVersions}
    newVersions.autoSaves = [newVersion,...oldVersions.autoSaves]
      set(itemHistoryAtom(doenetId),newVersions)
      set(fileByContentId(contentId),doenetML);
  
    try {
      const resp = await axios.post("/api/saveNewVersion.php",newDBVersion)
      if (resp.data.success){
        set(editorSaveTimestamp,new Date());
      }else{
        //TODO: Toast here
        console.log("ERROR",resp.data.message)
      }
    } catch (error) {
      console.log("ERROR",error)
    }
  
  });

  useEffect(()=>{

    return ()=>{
      if (isCurrentDraft && initilizedDoenetId !== ""){
        // save and stop timers
        saveDraft(initilizedDoenetId)
        if (timeout.current !== null){
        clearTimeout(timeout.current)
        timeout.current = null;
        }
      if (autosavetimeout.current !== null){
        clearTimeout(autosavetimeout.current)
      }
      autosavetimeout.current = null;
      timeout.current = null;

      }
    }
  },[isCurrentDraft,initilizedDoenetId, saveDraft])


  if (paramDoenetId !== initilizedDoenetId){
    //DoenetML is changing to another DoenetID
    return null;
  }
  
  // console.log(`>>>Show CodeMirror with value -${updateInternalValue}-`)
  // console.log('>>>DoenetViewer Read Only:',!isCurrentDraft)

  return <div style={props.style}>
    <CodeMirror
    key = "codemirror"
      editorRef = {editorRef}
      setInternalValue = {updateInternalValue}
      readOnly = {!isCurrentDraft}
      // value={editorDoenetML} 
      onBeforeChange={(value) => {
        if (isCurrentDraft) { //No timers when active version history
          setEditorDoenetML(value);
          // console.log(`>>>set to value -${value}-`)
          //Start just one timer
          if (timeout.current === null){
            timeout.current = setTimeout(function(){
              saveDraft(initilizedDoenetId);
              timeout.current = null;
            },3000)
          }
          if (autosavetimeout.current === null){
            autosavetimeout.current = setTimeout(function(){
              autoSave(initilizedDoenetId);
              autosavetimeout.current = null;
          },60000) //1 minute
          }
        }
      }}
    />
  </div>
}