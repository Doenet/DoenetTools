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
import axios from "axios";
import { nanoid } from 'nanoid';
import { CIDFromText } from '../../../Core/utils/cid';

export const editorSaveTimestamp = atom({
  key:"",
  default:null
})



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
    const isCurrentDraft = await snapshot.getPromise(currentDraftSelectedAtom);
    //Only save draft if it's being edited
    if (isCurrentDraft){
      const doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
      const oldVersions = await snapshot.getPromise(itemHistoryAtom(doenetId));
      let newDraft = {...oldVersions.draft};
  
      const contentId = await CIDFromText(doenetML);
  
      newDraft.contentId = contentId;
      newDraft.timestamp = buildTimestamp();
  
      set(itemHistoryAtom(doenetId),(was)=>{
        let asyncDraft = {...was.draft}
        asyncDraft.contentId = contentId;
        asyncDraft.timestamp = newDraft.timestamp;
        let asyncReplacement = {...was}
        asyncReplacement.draft = asyncDraft;
        return asyncReplacement})
      set(fileByContentId(contentId),doenetML)
      //Save in localStorage
      // localStorage.setItem(contentId,doenetML)
  
      let newDBVersion = {...newDraft,
        doenetML,
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
    
  },[]);

  const autoSave = useRecoilCallback(({snapshot,set})=> async (doenetId)=>{
    const doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
    const contentId = await CIDFromText(doenetML);
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
      set(itemHistoryAtom(doenetId),
        (was)=>{
        let newVersions = {...was}
        newVersions.autoSaves = [newVersion,...was.autoSaves]
          return newVersions
        })

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

      if (initilizedDoenetId !== ""){
    // save and stop timers
      saveDraft(initilizedDoenetId) //Always save on leave
      if (timeout.current !== null){
      clearTimeout(timeout.current)
      }
      if (autosavetimeout.current !== null){
        autoSave(initilizedDoenetId);
        clearTimeout(autosavetimeout.current)
      }
      autosavetimeout.current = null;
      timeout.current = null;

      }
    }
  },[initilizedDoenetId, saveDraft, autoSave])

  if (paramDoenetId !== initilizedDoenetId){
    //DoenetML is changing to another DoenetID
    return null;
  }
  
  // console.log(`>>>Show CodeMirror with value -${updateInternalValue}-`)
  // console.log('>>>DoenetViewer Read Only:',!isCurrentDraft)

  return  <div><CodeMirror
    key = "codemirror"
      editorRef = {editorRef}
      setInternalValue = {updateInternalValue}
      readOnly = {!isCurrentDraft}
      // value={editorDoenetML} 
      onBeforeChange={(value) => {
        // if (isCurrentDraft) { //READ ONLY SHOULD STOP TIMERS
          setEditorDoenetML(value);
          //Start just one timer
          if (timeout.current === null){
            timeout.current = setTimeout(function(){
              saveDraft(initilizedDoenetId);
              timeout.current = null;
            },3000)//3 seconds
          }
          if (autosavetimeout.current === null){
            autosavetimeout.current = setTimeout(function(){
              autoSave(initilizedDoenetId);
              autosavetimeout.current = null;
          },60000) //1 minute
          }
        // }
      }}
    />
    </div>
}