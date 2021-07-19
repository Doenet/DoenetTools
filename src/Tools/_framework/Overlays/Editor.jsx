import React, { useEffect, useState, useRef } from "react";
import Tool from "../Tool";
// import { useToolControlHelper } from "../ToolRoot";
import axios from "axios";
import sha256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';
import  VisibilitySensor from 'react-visibility-sensor';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';

import { nanoid } from 'nanoid';

import { 
  useRecoilValue, 
  atom, 
  useSetRecoilState,
  useRecoilState,
  useRecoilValueLoadable,
  useRecoilCallback
} from "recoil";
import DoenetViewer from '../../../Viewer/DoenetViewer';
import CodeMirror from '../CodeMirror';

import './Editor.css';
import { 
  itemHistoryAtom, 
  fileByContentId 
} from '../../../_sharedRecoil/content';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExternalLinkAlt
 } from '@fortawesome/free-solid-svg-icons';

 import { 
  faClipboard
 } from '@fortawesome/free-regular-svg-icons';

import { useToast } from '../../_framework/Toast';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { folderDictionary } from '../../../_reactComponents/Drive/Drive';

const editorDoenetMLAtom = atom({
  key:"editorDoenetMLAtom",
  default:""
})

const viewerDoenetMLAtom = atom({
  key:"viewerDoenetMLAtom",
  default:{updateNumber:0,doenetML:""}
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

  const versionHistoryActiveAtom = atom({
    key:"versionHistoryActiveAtom",
    default:""
  })

  //Need this?
  const EditingVersionIdAtom = atom({
    key:"EditingVersionIdAtom",
    default:""
  })
  
function ReturnToEditingButton(props){
  const activeVersionId = useRecoilValue(versionHistoryActiveAtom);
  const returnToEditing = useRecoilCallback(({snapshot,set})=> async (doenetId)=>{
    set(versionHistoryActiveAtom,"")
    const versionHistory = await snapshot.getPromise((itemHistoryAtom(doenetId)));
    const contentId = versionHistory.draft.contentId;
 
    let doenetML = await snapshot.getPromise(fileByContentId(contentId));
    set(editorDoenetMLAtom,doenetML);
    set(viewerDoenetMLAtom,(was)=>{
      let newObj = {...was}
      newObj.doenetML = doenetML;
      newObj.updateNumber = was.updateNumber+1;
      return newObj});
  })

  if (activeVersionId === ""){ return null; }

  return <Button onClick={()=> returnToEditing(props.doenetId) } value="Return to current version" />
}

function EditorInfoPanel(props){
  const [addToast, ToastType] = useToast();

  const link = `http://${window.location.host}/content/#/?doenetId=${props.doenetId}`

  return <div style={{margin:"6px"}}>
  <div>DonetML Name (soon)</div>
  <div>Load time (soon) </div>
  <div>Most recent release 
  
  <CopyToClipboard onCopy={()=>addToast('Link copied to clipboard!', ToastType.SUCCESS)} text={link}>
  <button onClick={()=>{
    
  }}>copy link <FontAwesomeIcon icon={faClipboard}/></button> 
  </CopyToClipboard>

  <button onClick={
    ()=>window.open(link, '_blank')
  }>visit <FontAwesomeIcon icon={faExternalLinkAlt}/></button>
  </div>
  
</div>
}

//Required props:
//doenetId
//versionId
//title --Original Title
function RenameVersionControl(props){
  let [textFieldFlag,setTextFieldFlag] = useState(false);
  let [currentTitle,setCurrentTitle] = useState(props.title);

  const renameVersion = useRecoilCallback(({snapshot,set})=> async (doenetId,versionId,newTitle)=>{
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

function ClipboardLinkButtons(props){
  const [addToast, ToastType] = useToast();

  if (!props.contentId){
    console.error("Component only handles contentId at this point")
    return null;
  }
  

  const link = `http://${window.location.host}/content/#/?contentId=${props.contentId}`
  return <div> 
  <CopyToClipboard onCopy={()=>addToast('Link copied to clipboard!', ToastType.SUCCESS)} text={link}>
  <button>copy link <FontAwesomeIcon icon={faClipboard}/></button> 
  </CopyToClipboard>

  <button onClick={
    ()=>window.open(link, '_blank')
  }>visit <FontAwesomeIcon icon={faExternalLinkAlt}/></button>
  </div>
}

function VersionHistoryPanel(props){
  
  const versionHistory = useRecoilValueLoadable(itemHistoryAtom(props.doenetId))
  // const activeVersionId  = useRecoilValue(versionHistoryActiveAtom);
  // const [editingVersionId,setEditingVersionId] = useRecoilState(EditingVersionIdAtom);

  const toggleReleaseNamed = useRecoilCallback(({set})=> async (doenetId,versionId,driveId,folderId)=>{
    let doenetIsReleased = false;
    
    set(itemHistoryAtom(doenetId),(was)=>{
      let newHistory = {...was}
      newHistory.named = [...was.named];
      let newVersion;
      for (const [i,version] of newHistory.named.entries()){
        if (versionId === version.versionId){
          newVersion = {...version}

          if (version.isReleased === '0'){
            //release
            newVersion.isReleased = '1';
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
      for (let named of newHistory.named){
        if (named.isReleased === '1'){
          doenetIsReleased = true;
          break;
        }
      }
      let newDBVersion = {...newVersion,
        isNewToggleRelease:'1',
        doenetId
      }
      // console.log(">>>newDBVersion",newDBVersion);
         axios.post("/api/saveNewVersion.php",newDBVersion)
          // .then((resp)=>{console.log(">>>resp toggleRelease",resp.data)})
      return newHistory;
    })
    set(folderDictionary({driveId,folderId}),(was)=>{
      let newFolderInfo = {...was};
      newFolderInfo.contentsDictionary =  {...was.contentsDictionary}
      newFolderInfo.contentsDictionary[props.itemId] = {...was.contentsDictionary[props.itemId]};
      let newIsReleased = '0';
      if (doenetIsReleased){
        newIsReleased = '1';
      }
      newFolderInfo.contentsDictionary[props.itemId].isReleased = newIsReleased;
      return newFolderInfo;
    })
})

  const versionHistoryActive = useRecoilCallback(({snapshot,set})=> async (version)=>{
    set(versionHistoryActiveAtom,version.versionId)
    let doenetML = await snapshot.getPromise(fileByContentId(version.contentId));
    // const doenetML = loadableDoenetML.data;
    set(editorDoenetMLAtom,doenetML);
    set(viewerDoenetMLAtom,(was)=>{
      let newObj = {...was}
      newObj.doenetML = doenetML;
      newObj.updateNumber = was.updateNumber+1;
      return newObj});
  })

  const setAsCurrent = useRecoilCallback(({snapshot,set})=> async (doenetId,version)=>{
    // console.log(">>>sac",doenetId,version)
    //current to autosave
    const newDraftVersionId = nanoid();
    const oldVersions = await snapshot.getPromise(itemHistoryAtom(doenetId));
    let newVersions = {...oldVersions};
    let autoSaveWasDraft = {...oldVersions.draft}
    autoSaveWasDraft.isDraft = "0";
    autoSaveWasDraft.title = "Autosave (was draft)";
    autoSaveWasDraft.timestamp = buildTimestamp();
    newVersions.autoSaves = [autoSaveWasDraft,...oldVersions.autoSaves]
    //copy (or move?) named version to current
    let newDraft = {...version};
    newDraft.isDraft = "1";
    newDraft.versionId = newDraftVersionId;
    newVersions.draft = newDraft;
    set(itemHistoryAtom(doenetId),newVersions)
    //set viewer's and text editor's doenetML
    let doenetML = await snapshot.getPromise(fileByContentId(newDraft.contentId));
    set(editorDoenetMLAtom,doenetML);
    set(viewerDoenetMLAtom,(was)=>{
      let newObj = {...was}
      newObj.doenetML = doenetML;
      newObj.updateNumber = was.updateNumber+1;
      return newObj});

      let newDBVersion = {...newDraft,
        isSetAsCurrent:'1',
        newDraftVersionId,
        newDraftContentId:newDraft.contentId,
        doenetId
      }
      // console.log(">>>newDBVersion",newDBVersion)
      axios.post("/api/saveNewVersion.php",newDBVersion)
      // .then(resp=>console.log(">>>resp",resp.data))

  });
  
  const [selectedVersionId,setSelectedVersionId] = useState(null)

  if (versionHistory.state === "loading"){ return null;}
  if (versionHistory.state === "hasError"){ 
    console.error(versionHistory.contents)
    return null;}

    let controls = null;
    let options = [];
    let versionsObj = {}

  for (let version of versionHistory.contents.named){
    versionsObj[version.versionId] = version;
    let selected = false;
    if (version.versionId === selectedVersionId){
      selected = true;
    }
    let released = '';
    if (version.isReleased === '1'){
      released = "(Released)";
    }
    options.push(<option value={version.versionId} selected={selected}>{released} {version.title}</option>,)
  }
    let selector = <select 
    size='8' 
    onChange={(e)=>{setSelectedVersionId(e.target.value)}}>
    {options}
  </select>

if (selectedVersionId){
  const version = versionsObj[selectedVersionId];
  let releaseButtonText = "Release";
  if (version.isReleased === '1'){
    releaseButtonText = "Retract"
  }

    const releaseButton = <div><button onClick={(e)=>toggleReleaseNamed(props.doenetId,version.versionId,props.driveId,props.folderId)} >{releaseButtonText}</button></div>

  controls = <>
  <div>Name: {version.title}</div>
  <ClipboardLinkButtons contentId={version.contentId} />
        <div><RenameVersionControl key={version.versionId} doenetId={props.doenetId} title={version.title} versionId={version.versionId} /></div>
       <div><button onClick={()=>versionHistoryActive(version)} >View</button></div> 
       <div><button onClick={()=>setAsCurrent(props.doenetId,version)} >Set As Current</button></div> 
        {releaseButton}
  </>
}
     
  return <>
  <h2>Versions</h2>
  {selector}
  {controls}
  </>
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

function TextEditor(props){
  const [editorDoenetML,setEditorDoenetML] = useRecoilState(editorDoenetMLAtom);
  const [activeVersionId,setactiveVersionId]  = useRecoilState(versionHistoryActiveAtom);

  const saveDraft = useRecoilCallback(({snapshot,set})=> async (doenetId)=>{
    const doenetML = await snapshot.getPromise(editorDoenetMLAtom);
    const oldVersions = await snapshot.getPromise(itemHistoryAtom(props.doenetId));

    let newVersion = {...oldVersions.draft};
  
    const contentId = getSHAofContent(doenetML);

    newVersion.contentId = contentId;
    newVersion.timestamp = buildTimestamp();

    let oldVersionsReplacement = {...oldVersions};
    oldVersionsReplacement.draft = newVersion;
    set(itemHistoryAtom(props.doenetId),oldVersionsReplacement)
    set(fileByContentId(contentId),doenetML)
    // set(fileByContentId(contentId),{data:doenetML})

    //Save in localStorage
    localStorage.setItem(contentId,doenetML)

    let newDBVersion = {...newVersion,
      doenetML,
      doenetId:props.doenetId
    }
       axios.post("/api/saveNewVersion.php",newDBVersion)
// .then((resp)=>{console.log(">>>resp saveNewVersion",resp.data)})  
  });
  
  const autoSave = useRecoilCallback(({snapshot,set})=> async ()=>{
    const doenetML = await snapshot.getPromise(editorDoenetMLAtom);
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
      doenetId:props.doenetId
    }

    const oldVersions = await snapshot.getPromise(itemHistoryAtom(props.doenetId));
    let newVersions = {...oldVersions}
    newVersions.autoSaves = [newVersion,...oldVersions.autoSaves]
      set(itemHistoryAtom(props.doenetId),newVersions)
      // set(fileByContentId(newVersion.contentId),{data:doenetML});
      set(fileByContentId(newVersion.contentId),doenetML);
  
      axios.post("/api/saveNewVersion.php",newDBVersion)
        // .then((resp)=>{console.log(">>>resp autoSave",resp.data)})
  
  });

  const timeout = useRef(null);
  let editorRef = useRef(null);
  const autosavetimeout = useRef(null);
  let textValue = editorDoenetML;

  function clearSaveTimeouts(){
    if (timeout.current !== null){
      clearTimeout(timeout.current)
      timeout.current = null;
      saveDraft(props.doenetId);
    }
    if (autosavetimeout.current !== null){
      clearTimeout(autosavetimeout.current)
    }
  }

 //Stop timers on unmount
 //Also, clear history selection on unmount
  useEffect(() => {
    return () => {
      clearSaveTimeouts();
      setactiveVersionId("");
    };
  },[]);

  if (activeVersionId !== ""){
    //Read Only without timers
    clearSaveTimeouts()
  }

  const editorInit = useRecoilValue(editorInitAtom);
  if (!editorInit){return null;}

  const options = {
      mode: 'xml',
      autoRefresh:true,
      // theme: 'neo',
      // theme: 'base16-light',
      theme: 'xq-light',
      lineNumbers: true,
      indentUnit : 2,
      // smartIndent : true,
      matchTags : true,
      // autoCloseTags: true,
      matchBrackets: true,
      lineWrapping: true,
      // autoCloseBrackets: true,
      // hintOptions: {schemaInfo: tags},
      extraKeys : {
        Tab: (cm) => {
          var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
          cm.replaceSelection(spaces);
        },
        Enter : (cm) => {
          cm.replaceSelection("\n")
          setTimeout( () => cm.execCommand("indentAuto"), 1);
        },
        "Ctrl-Space" : "autocomplete",
        "Cmd-/" : (cm) => {
          let selections = cm.getSelections();
          if(selections[0] == ""){
            let line = cm.getCursor().line;
            let content = cm.getLine(line) 
            if(content.substring(0,4) === "<!--"){
              content = content.substring(5,content.length-3) + "\n"
            } else {
              content = "<!-- "+ content + " -->\n";
            }
            cm.replaceRange(content,{line : line, ch: 0}, {line: line + 1, ch: 0});
            // This set cursor doesn't seem to work...
            setTimeout(cm.setCursor(line,Math.max(content.length-1,0)),1);
            return;
          }
          // Might be non-obvious behavior. Should it comment/uncomment all of the selections?
          // Shouldn't come up too often.
          selections = selections.map((s) => s.trim().substring(0,4) !== "<!--" ? "<!-- " + s + " -->": s.trim().substring(5,s.length-3))
          // let selectionsPos = cm.listSelections().map(({anchor,head}) => {return {anchor : anchor, head : {line : head.line, ch: head.ch + "<!--  -->".length}}}) ;
          // console.log(">>pos",selectionsPos);
          //the around option here is supposed to keep the replacing text selected, but it doesn't work.
          //Not a huge issue,but needs to be fixed at some point
          cm.replaceSelections(selections,"around");
          //neither does setting it manaully... 
          // cm.setSelection(selectionsPos[0].anchor,selectionsPos[0].head)

        }
      }
  }

  return <>

  {/* <button onClick={()=>{
    console.log(">>>editorRef.current",editorRef.current)
    // editorRef.current.options.readOnly = true;
    // editorRef.current.doc.undo();
    editorRef.current.doc.markText({line:1,ch:1},{line:2,ch:3});
    // let tm = editorRef.current.doc.markText({line:1,ch:1},{line:2,ch:3},{css:"background:olive"});
    // tm.css("background:olive")
    //cm.getTokenAt
    let cm = editorRef.current.doc.getEditor();
    // let token = cm.getTokenAt({line:1,ch:1},true);
    // console.log(">>>token",token)
    let tokens = cm.getLineTokens(1);
    console.log(">>>tokens",tokens)

  }}>Mark</button>
  <button onClick={()=>{
    console.log(">>>editorRef.current",editorRef.current)
    // editorRef.current.options.readOnly = false;
    // editorRef.current.doc.redo();
  }}>Redo</button> */}

  {/* <VisibilitySensor onChange={(visible)=>{
    if (visible){
      editorRef.current.refresh();
    }  
    }}> */}
    
<CodeMirror
  editorRef = {editorRef}
  value={textValue} 
  onBeforeChange={(value) => {
    if (activeVersionId === "") { //No timers when active version history
      setEditorDoenetML(value);
      if (timeout.current === null){
        timeout.current = setTimeout(function(){
          saveDraft(props.doenetId);
          timeout.current = null;
        },3000)
      }
      if (autosavetimeout.current === null){
        autosavetimeout.current = setTimeout(function(){
          autoSave();
          autosavetimeout.current = null;
      },60000) //1 minute
      }
    }
  }}

  />
{/* <CodeMirror
  className="CodeMirror"
  editorDidMount={editor => { editorRef.current = editor;  }}
  value={textValue}
  options={options}
  // onChange={(editor, data, value) => {
  // }}
/> */}

  {/* </VisibilitySensor> */}
  </>
}

function DoenetViewerUpdateButton(props){
  // const editorDoenetML = useRecoilValue(editorDoenetMLAtom);
  // const setViewerDoenetML = useSetRecoilState(viewerDoenetMLAtom);
  const activeVersionId = useRecoilValue(versionHistoryActiveAtom);

  const saveDraft = useRecoilCallback(({snapshot,set})=> async (doenetId)=>{
    const doenetML = await snapshot.getPromise(editorDoenetMLAtom);
    set(viewerDoenetMLAtom,(old)=>{
      let newInfo = {...old};
      newInfo.doenetML = doenetML;
      newInfo.updateNumber = old.updateNumber+1;
      return newInfo;
    })
    const oldVersions = await snapshot.getPromise(itemHistoryAtom(props.doenetId));

    let newVersion = {...oldVersions.draft};
  
    const contentId = getSHAofContent(doenetML);

    newVersion.contentId = contentId;
    newVersion.timestamp = buildTimestamp();

    let oldVersionsReplacement = {...oldVersions};
    oldVersionsReplacement.draft = newVersion;
    set(itemHistoryAtom(props.doenetId),oldVersionsReplacement)
    set(fileByContentId(contentId),doenetML)
    // set(fileByContentId(contentId),{data:doenetML})

    //Save in localStorage
    localStorage.setItem(contentId,doenetML)

    let newDBVersion = {...newVersion,
      doenetML,
      doenetId:props.doenetId
    }
       axios.post("/api/saveNewVersion.php",newDBVersion)
// .then((resp)=>{console.log(">>>resp saveNewVersion",resp.data)})  
  },[]);

  if (activeVersionId !== "") {return null;}


  return <Button value="Update" onClick={()=>{saveDraft(props.doenetId)}} />
}

function NameCurrentVersionControl(props){
  const saveVersion = useRecoilCallback(({snapshot,set})=> async (doenetId)=>{
    const doenetML = await snapshot.getPromise(editorDoenetMLAtom);
    const timestamp = buildTimestamp();
    const contentId = getSHAofContent(doenetML);
    const versionId = nanoid();

    let newVersion = {
      title:"Named",
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

    const oldVersions = await snapshot.getPromise(itemHistoryAtom(doenetId));
    let newVersions = {...oldVersions};
    newVersions.named = [newVersion,...oldVersions.named];

    set(itemHistoryAtom(doenetId),newVersions)
    // set(fileByContentId(contentId),{data:doenetML});
    set(fileByContentId(contentId),doenetML);
    
    axios.post("/api/saveNewVersion.php",newDBVersion)
      //  .then((resp)=>{console.log(">>>resp saveVersion",resp.data)})
    
    
  })
  const activeVersionId = useRecoilValue(versionHistoryActiveAtom);
  if (activeVersionId !== "") {return null;}

  return <Button value="Save Version" onClick={()=>saveVersion(props.doenetId)} />
}

function TempEditorHeaderBar(props){
  return <div style={{height:"24px"}}>
    <NameCurrentVersionControl doenetId={props.doenetId} />
  </div>
}

const variantInfoAtom = atom({
  key:"variantInfoAtom",
  default:{index:null,name:null,lastUpdatedIndexOrName:null,requestedVariant:{index:1}}
})

const variantPanelAtom = atom({
  key:"variantPanelAtom",
  default:{index:null,name:null}
})
 
function DoenetViewerPanel(){
  // console.log("=== DoenetViewer Panel")
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
  const editorInit = useRecoilValue(editorInitAtom);
  const [variantInfo,setVariantInfo] = useRecoilState(variantInfoAtom);
  const setVariantPanel = useSetRecoilState(variantPanelAtom);
  if (!editorInit){ return null; }

  let attemptNumber = 1;
  let solutionDisplayMode = "button";


  if (variantInfo.lastUpdatedIndexOrName === 'Index'){
    setVariantInfo((was)=>{
      let newObj = {...was}; 
      newObj.lastUpdatedIndexOrName = null; 
      newObj.requestedVariant = {index:variantInfo.index};
    return newObj})

  }else if (variantInfo.lastUpdatedIndexOrName === 'Name'){
    setVariantInfo((was)=>{
      let newObj = {...was}; 
      newObj.lastUpdatedIndexOrName = null; 
      newObj.requestedVariant = {name:variantInfo.name};
    return newObj})

  }


  function variantCallback(generatedVariantInfo, allPossibleVariants){
    const cleanGeneratedVariant = JSON.parse(JSON.stringify(generatedVariantInfo))
    cleanGeneratedVariant.lastUpdatedIndexOrName = null 
    setVariantPanel({
      index:cleanGeneratedVariant.index,
      name:cleanGeneratedVariant.name,
      allPossibleVariants
    });
    setVariantInfo((was)=>{
      let newObj = {...was}
      Object.assign(newObj,cleanGeneratedVariant)
      return newObj;
    });
  }
  
  return <DoenetViewer
      // key={"doenetviewer" + viewerDoenetML?.updateNumber}
      key={"doenetviewer"}
      doenetML={viewerDoenetML?.doenetML}
      flags={{
        showCorrectness: true,
        readOnly: false,
        solutionDisplayMode: solutionDisplayMode,
        showFeedback: true,
        showHints: true,
      }}
      attemptNumber={attemptNumber}
      allowLoadPageState={false}
      allowSavePageState={false}
      allowLocalPageState={false}
      allowSaveSubmissions={false}
      allowSaveEvents={false}
      generatedVariantCallback={variantCallback}
      requestedVariant={variantInfo.requestedVariant}
      /> 
}

function VariantPanel(){
  const [variantInfo,setVariantInfo] = useRecoilState(variantInfoAtom);
  const [variantPanel,setVariantPanel] = useRecoilState(variantPanelAtom);
  

  function updateVariantInfoAtom(source){
    // console.log(">>>updateVariantInfoAtom")
    //Prevent calling when it didn't change
    if (source === 'Index'){
      if (variantPanel.index === variantInfo.index){
        return;
      }
    }
    if (source === 'Name'){
      if (variantPanel.name === variantInfo.name){
        return;
      }
    }
    setVariantInfo((was)=>{
      let newObj = {...was};
      newObj.index = Number.isFinite(Number(variantPanel.index)) ? Number(variantPanel.index) : 0;
      newObj.name = variantPanel.name;
      newObj.lastUpdatedIndexOrName = source;
      return newObj;
    })
  }

  //In the case allPossibleVariants isn't defined it's an empty array
  let allPossibleVariants = [];
  if (variantPanel.allPossibleVariants){
    allPossibleVariants = variantPanel.allPossibleVariants
  }
  let optionsList = allPossibleVariants.map(function (s, i) {
    return <option key={i + 1} value={s}>{s}</option>
  });

  return <>
  <div><label>Variant Index <input type="text" value={variantPanel.index} onKeyDown={(e)=>{
    if (e.key ==='Enter'){ updateVariantInfoAtom('Index') }
    }} onBlur={()=>updateVariantInfoAtom('Index')} onChange={(e)=>{setVariantPanel(
      (was)=>{
      let newObj = {...was}
      newObj.index = e.target.value;
      return newObj; })}}/></label></div>

      <div><label>Variant Name 
      <select value={variantPanel.name} onChange={(e)=>{
        setVariantInfo((was)=>{
          let newObj = {...was};
          newObj.name = e.target.value;
          newObj.lastUpdatedIndexOrName = 'Name';
          return newObj;
        })
     
      }}>
      {optionsList}
        </select></label></div>
  </>
}
 
const editorInitAtom = atom({
  key:"editorInit",
  default:false
})

export default function Editor({ doenetId, title, driveId, folderId, itemId }) {
  // console.log("===Editor!");

  let initDoenetML = useRecoilCallback(({snapshot,set})=> async (doenetId)=>{
    const versionHistory = await snapshot.getPromise((itemHistoryAtom(doenetId)));
    const contentId = versionHistory.draft.contentId;
    
    let response = await snapshot.getPromise(fileByContentId(contentId));
    if (typeof response === "object"){
      response = response.data;
    }
    const doenetML = response;

    set(editorDoenetMLAtom,doenetML);
    const viewerObj = await snapshot.getPromise(viewerDoenetMLAtom);
    const updateNumber = viewerObj.updateNumber+1;
    set(viewerDoenetMLAtom,{updateNumber,doenetML})
    set(editorInitAtom,true);
  })

  const setEditorInit = useSetRecoilState(editorInitAtom);

  useEffect(() => {
    initDoenetML(doenetId)
    return () => {
      setEditorInit(false);
    }
}, []);


  return (
    <Tool>
      <headerPanel title={title}>
        <ReturnToEditingButton doenetId={doenetId} />
      </headerPanel>

      <mainPanel>
        <div><DoenetViewerUpdateButton doenetId={doenetId} /></div>
        <div style={{overflowY:"scroll", height:"calc(100vh - 84px)" }}><DoenetViewerPanel /></div>
      </mainPanel>

      <supportPanel isInitOpen>
      <TempEditorHeaderBar doenetId={doenetId} />
          <TextEditor  doenetId={doenetId}/>
      </supportPanel>

      <menuPanel title="Info">
        <EditorInfoPanel doenetId={doenetId} driveId={driveId} folderId={folderId} itemId={itemId}/>
      </menuPanel>
      <menuPanel title="Version history">
        <VersionHistoryPanel doenetId={doenetId} driveId={driveId} folderId={folderId} itemId={itemId}/>
      </menuPanel>
      <menuPanel title="Variant">
        <VariantPanel  />
      </menuPanel>
      
    </Tool>
  );
}
