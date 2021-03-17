import React, { useEffect, useRef, useState, Suspense } from "react";
import Tool from "../imports/Tool/Tool";
import {driveColors,driveImages} from '../imports/Util';
import DoenetDriveCardMenu from "../imports/DoenetDriveCardMenu";
import { useToolControlHelper } from "../imports/Tool/ToolRoot";
import { useToast } from "../imports/Tool/Toast";

import './util.css';

import Drive, { 
  folderDictionarySelector, 
  folderInfoSelectorActions,
  globalSelectedNodesAtom, 
  folderDictionary, 
  clearDriveAndItemSelections,
  fetchDrivesSelector,
  encodeParams,
  fetchDriveUsers,
  fetchDrivesQuery
} from "../imports/Drive";
import nanoid from 'nanoid';

import { 
  faChalkboard,
  faCode,
  faFolder,
  faUserCircle
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
  useRecoilCallback
} from "recoil";
import { BreadcrumbContainer } from "../imports/Breadcrumb";
// import { supportVisible } from "../imports/Tool/Panels/SupportPanel";
import GlobalFont from "../fonts/GlobalFont.js";
import axios from "axios";
// import Button from "../imports/PanelHeaderComponents/Button.js";
import DoenetViewer from './DoenetViewer';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import crypto from 'crypto';
import "../imports/drivecard.css";
import DriveCards from "../imports/DriveCards";

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
      return {number:globalSelected.length,itemObjs:globalSelected}
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

    return {number:globalSelected.length,itemInfo}
  }
})

let overlayTitleAtom = atom({
  key:"overlayTitleAtom",
  default:""
})

function User(props){
  let onClick = props.onClick;
  if (!onClick){onClick = ()=>{}}
  let emailAddress = null;
  let emailStyle = {}
  let buttons = [];
  let star = null;
  let screenName = props.screenName;
  if (screenName === "" || screenName === null){ screenName = "Unknown" }
  if (props.isUser){
    star = <FontAwesomeIcon icon={faUserCircle}/>;
  }
    emailAddress = <span style={emailStyle}>{props.email}</span>;
  let containerStyle = {}
    if (props.isSelected){
      if (props.isOwner || props.userRole == "admin"){
        if (!(props.userRole === 'owner' && props.numOwners < 2)){
          //Only show remove if two or more owners
          buttons.push(
            <div key={`remove${props.userId}`}>
              <Button 
              data-doenet-removeButton={props.userId}
            value="Remove" 
            callback={(e)=>{
              e.preventDefault();
              e.stopPropagation();
              onClick("")
              props.setDriveUsers({
                driveId:props.driveId,
                type:"Remove User",
                userId:props.userId,
                userRole:props.userRole
              })
            
            
            }
            }/>
           
            </div>
            )
        }
        
      }
      if (props.isOwner && props.userRole == "admin"){
        
        buttons.push(
          <div key={`promote${props.userId}`}>
            <Button 
          data-doenet-removebutton={props.userId}
          value="Promote to Owner" callback={(e)=>{
            e.preventDefault();
            e.stopPropagation();
            onClick("")
          props.setDriveUsers({
              driveId:props.driveId,
              type:"To Owner",
              userId:props.userId,
              userRole:props.userRole
            })
          }
          } /></div>
          )
      }
      if (props.isOwner && props.userRole == "owner"){
        if (!(props.userRole === 'owner' && props.numOwners < 2)){
          //Only show demote if two or more owners
        buttons.push(
          <div key={`demote${props.userId}`}>
            <Button 
          data-doenet-removebutton={props.userId}
          value="Demote to Admin" callback={(e)=>{
            e.preventDefault();
            e.stopPropagation();
            onClick("")
            props.setDriveUsers({
              driveId:props.driveId,
              type:"To Admin",
              userId:props.userId,
              userRole:props.userRole
            })
          }
          }/></div>
          )
        }
      }
      
      containerStyle = {backgroundColor:"#B8D2EA"}
      emailStyle = {border:"solid 1px black"}
  }
  
  return <>
    <div 
    tabIndex={0}
    className="noselect nooutline" 
    onClick={()=>onClick(props.userId)}
    onBlur={(e)=>{
      if (e.relatedTarget?.dataset?.doenetRemovebutton !== props.userId){
      // setTimeout(()=>onClick(""),500);
      onClick("")
      }
    }}
    >
      <div style={containerStyle} >
      <div>{star}{screenName}</div>
      <div>{emailAddress}</div>
      </div>
      {buttons}
    </div>
    </>
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function NewUser(props){
  const [email,setEmail] = useState("")


  function addUser(){
    if (validateEmail(email)){
      props.setDriveUsers({
          driveId:props.driveId,
          type:props.type,
          email,
          callback
        })
      props.open(false);
    }else{
      //Toast invalid email
      console.log(`Not Added: Invalid email ${email}`)
    }

    //TODO: when set async available replace this.
    function callback(resp){

      if (resp.success){
        props.setDriveUsers({
          driveId:props.driveId,
          type:`${props.type} step 2`,
          email,
          screenName:resp.screenName,
          userId:resp.userId
        })
      }else{
        console.log(">>>Toast ",resp.message)
      }
      
    }
    
  }

  return <><div>
    <label>User&#39;s Email Address<br />
    <input type="text" value={email} 
    onChange={(e)=>{setEmail(e.target.value)}}
    onKeyDown={(e)=>{if (e.keyCode === 13){ 
      addUser();
    }}}
    onBlur={()=>{
      addUser();
    }}
    /></label>
  </div>
    <Button value="Submit" callback={()=>addUser()}/>
    <Button value="Cancel" callback={()=>props.open(false)}/>
    </>

}

const DriveInfoPanel = function(props){
  const [driveLabel,setDriveLabel] = useState(props.label);
  const [panelDriveLabel,setPanelDriveLabel] = useState(props.label);
  const setDrivesInfo = useSetRecoilState(fetchDrivesSelector);
  const driveId = props.driveId;
  const [driveUsers,setDriveUsers] = useRecoilStateLoadable(fetchDriveUsers(driveId));

  const [selectedUserId,setSelectedUserId] = useState("");
  const [shouldAddOwners,setAddOwners] = useState(false);
  const [shouldAddAdmins,setAddAdmins] = useState(false);

  if (driveUsers.state === "loading"){ return null;}
    if (driveUsers.state === "hasError"){ 
      console.error(driveUsers.contents)
      return null;}

  let isOwner = false;
  if (driveUsers.contents.usersRole === "Owner"){
    isOwner = true;
  }
  let dIcon = <FontAwesomeIcon icon={faChalkboard}/>

  let admins = [];
  let owners = [];

  let addOwners = null;
  let addOwnersButton = null;
  if (isOwner){
    addOwnersButton = <Button value="+ Add Owner" callback={()=>{
      setAddOwners(true);
    }} />
  }
  

  if (shouldAddOwners){ 
    addOwners = <NewUser open={setAddOwners} driveId={driveId} type="Add Owner" setDriveUsers={setDriveUsers}/>
    addOwnersButton = null;
  }
  let addAdmins = null;
  let addAdminsButton = <Button value="+ Add Administrator" callback={()=>{
    setAddAdmins(true);
  }} />
  if (shouldAddAdmins){
    addAdmins = <NewUser open={setAddAdmins} driveId={driveId} type="Add Admin" setDriveUsers={setDriveUsers}/>
    addAdminsButton = null;
  }



  

  for (let owner of driveUsers.contents.owners){
    let isSelected = false;
    if (owner.userId === selectedUserId){
      isSelected = true;
    }
    owners.push(<User 
      key={`User${owner.userId}`} 
      isSelected={isSelected}
      onClick={setSelectedUserId}
      userId={owner.userId} 
      driveId={driveId} 
      email={owner.email} 
      isUser={owner.isUser} 
      screenName={owner.screenName}
      setDriveUsers={setDriveUsers}
      userRole="owner"
      isOwner={isOwner}
      numOwners={driveUsers.contents.owners.length}
      />)
  }
  for (let admin of driveUsers.contents.admins){
    let isSelected = false;
    if (admin.userId === selectedUserId){
      isSelected = true;
    }
    
    admins.push(<User 
      key={`User${admin.userId}`} 
      isSelected={isSelected}
      onClick={setSelectedUserId}
      userId={admin.userId} 
      driveId={driveId} 
      email={admin.email} 
      isUser={admin.isUser} 
      screenName={admin.screenName}
      setDriveUsers={setDriveUsers}
      userRole="admin"
      isOwner={isOwner}
      />)

  }
  let deleteCourseButton = null;
  if (isOwner){
    deleteCourseButton = <>
    <Button value="Delete Course" callback={()=>{
    // alert("Delete Drive")
    setDrivesInfo({
      color:props.color,
      label:driveLabel,
      image:props.image,
      newDriveId:props.driveId,
      type:"delete drive"
    })
  }} />
  <br />
  <br />
    </>
  }

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
  <br />
  <br />
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
  <br />
  <br />
  {deleteCourseButton}
  <h3>Owners</h3>
  {owners}
  {addOwners}
  {addOwnersButton}
  <h3>Admins</h3>
  {admins}
  {addAdmins}
  {addAdminsButton}

  </>
}

const FolderInfoPanel = function(props){
  const itemInfo = props.itemInfo;

  const setFolder = useSetRecoilState(folderDictionarySelector({driveId:itemInfo.driveId,folderId:itemInfo.parentFolderId}))

  const [label,setLabel] = useState(itemInfo.label);

  let fIcon = <FontAwesomeIcon icon={faFolder}/>
  
  return <>
  <h2>{fIcon} {itemInfo.label}</h2>

  <label>Folder Label<input type="text" 
  value={label} 
  onChange={(e)=>setLabel(e.target.value)} 
  onKeyDown={(e)=>{
    if (e.key === "Enter"){

      setFolder({
        instructionType: folderInfoSelectorActions.RENAME_ITEM,
        itemId:itemInfo.itemId,
        driveInstanceId:itemInfo.driveInstanceId,
        itemType:itemInfo.itemType,
        label
      })
    }
  }}
  onBlur={()=>{
    setFolder({
      instructionType: folderInfoSelectorActions.RENAME_ITEM,
      itemId:itemInfo.itemId,
      driveInstanceId:itemInfo.driveInstanceId,
      itemType:itemInfo.itemType,
      label
    })
  }}/></label>
  <br />
  <br />
  <Button value="Delete Folder" callback={()=>{
    setFolder({
      instructionType: folderInfoSelectorActions.DELETE_ITEM,
      itemId:itemInfo.itemId,
      driveInstanceId:itemInfo.driveInstanceId
    })
  }} />
  </>
}

const DoenetMLInfoPanel = function(props){
  const itemInfo = props.itemInfo;

  const setFolder = useSetRecoilState(folderDictionarySelector({driveId:itemInfo.driveId,folderId:itemInfo.parentFolderId}))

  const [label,setLabel] = useState(itemInfo.label);

  const { openOverlay } = useToolControlHelper();

  let dIcon = <FontAwesomeIcon icon={faCode}/>
  
  return <>
  <h2>{dIcon} {itemInfo.label}</h2>

  <label>DoenetML Label<input type="text" 
  value={label} 
  onChange={(e)=>setLabel(e.target.value)} 
  onKeyDown={(e)=>{

    if (e.key === "Enter"){
      setFolder({
        instructionType: folderInfoSelectorActions.RENAME_ITEM,
        itemId:itemInfo.itemId,
        driveInstanceId:itemInfo.driveInstanceId,
        itemType:itemInfo.itemType,
        label
      })
    }
  }}
  onBlur={()=>{
    setFolder({
      instructionType: folderInfoSelectorActions.RENAME_ITEM,
      itemId:itemInfo.itemId,
      driveInstanceId:itemInfo.driveInstanceId,
      itemType:itemInfo.itemType,
      label
    })
  }}/></label>
  <br />
  <br />
  <Button value="Edit DoenetML" callback={()=>{
    openOverlay({type:"editor",branchId:itemInfo.branchId,title:itemInfo.label})
    // open("editor", itemInfo.branchId, itemInfo.label);
  }} />
  <br />
  <br />
  <Button value="Delete DoenetML" callback={()=>{
    setFolder({
      instructionType: folderInfoSelectorActions.DELETE_ITEM,
      itemId:itemInfo.itemId,
      driveInstanceId:itemInfo.driveInstanceId
    })
  }} />
  </>
}

const ItemInfo = function (){
  // console.log("=== 🧐 Item Info")
  //Temp: Delete Soon

  const infoLoad = useRecoilValueLoadable(selectedInformation);
  const driveSelections = useRecoilValue(selectedDriveInformation);

    if (infoLoad.state === "loading"){ return null;}
    if (infoLoad.state === "hasError"){ 
      console.error(infoLoad.contents)
      return null;}

  
   
      let itemInfo = infoLoad?.contents?.itemInfo;

    if (infoLoad.contents?.number > 1){
      // let itemIds = [];
      // for (let itemObj of infoLoad.contents?.itemObjs){
      //   let key = `itemId${itemObj.itemId}`;
      //   itemIds.push(<div key={key}>{itemObj.itemId}</div>)
      // }
      return <>
      <h1>{infoLoad.contents.number} Items Selected</h1>
      {/* {itemIds} */}
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
  const toast = useToast();

  const createNewDrive = useRecoilCallback(({set})=> 
  async ({label,newDriveId,image,color})=>{
    let newDrive = {
      courseId:null,
      driveId:newDriveId,
      isShared:"0",
      label,
      type: "course",
      image,
      color,
      subType:"Administrator"
    }
    set(fetchDrivesQuery,(oldDrivesInfo)=>{
      let newDrivesInfo = {...oldDrivesInfo}
      newDrivesInfo.driveIdsAndLabels = [newDrive,...oldDrivesInfo.driveIdsAndLabels]
      return newDrivesInfo
    })
    const payload = { params:{
      driveId:newDriveId,
      label,
      type:"new course drive",
      image,
      color,
    } }
    return axios.get("/api/addDrive.php", payload)

  });

  const deleteNewDrive = useRecoilCallback(({snapshot,set})=> 
  async (newDriveId)=>{
    console.log(">>>deleting newDriveId",newDriveId)
    //Filter out drive which was just added
    set(fetchDrivesQuery,(oldDrivesInfo)=>{
      //Could just unshift the first drive but that could break
      //this is less brittle
      let newDrivesInfo = {...oldDrivesInfo}
      let newDriveIdsAndLabels = [];
      for (let driveAndLabel of oldDrivesInfo.driveIdsAndLabels){
        if (driveAndLabel.driveId !== newDriveId){
          newDriveIdsAndLabels.push(driveAndLabel);
        }
      }
      newDrivesInfo.driveIdsAndLabels = newDriveIdsAndLabels;
      return newDrivesInfo
    })

  });


  function onError({newDriveId,errorMessage}){
    deleteNewDrive(newDriveId);
    toast(`Course not created. ${errorMessage}`, 2, null, 6000);
  }

  return <Button value="Create a New Course" callback={()=>{
    let driveId = null;
    let newDriveId = nanoid();
    let label = "Untitled";
    let image = driveImages[Math.floor(Math.random() * driveImages.length)];
    let color = driveColors[Math.floor(Math.random() * driveColors.length)];
    const result = createNewDrive({label,driveId,newDriveId,image,color});
    result.then((resp)=>{
      if (resp.data.success){
        toast(`Created a new course named '${label}'`, 0, null, 3000);
      }else{
        onError({newDriveId,errorMessage:resp.data.message});
      }
    }).catch((errorObj)=>{
      onError({newDriveId,errorMessage:errorObj.message});
      
    })
    let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
    let newParams = {...urlParamsObj} 
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
  <Button value="Add Folder" callback={()=>{
    setFolderInfo({instructionType: folderInfoSelectorActions.ADD_ITEM,
    label:"Untitled",
    itemType:"Folder"
    })
  }
  } />

  <h3>DoenetML</h3>
  <Button value="Add DoenetML" callback={()=>{
    setFolderInfo({instructionType: folderInfoSelectorActions.ADD_ITEM,
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
  }} value="Add" />

  </div> */}

  </>
}

function AutoSelect(props){
  const { activateMenuPanel } = useToolControlHelper();

  const infoLoad = useRecoilValueLoadable(selectedInformation);

  if (infoLoad?.contents?.number > 0){
    activateMenuPanel(0);
  }else{
    activateMenuPanel(1);
  }
  return null;
}

export default function DoenetLibraryTool(props) {
  // console.log("=== 📚 Doenet Library Tool",props);  

  const { openOverlay, activateMenuPanel } = useToolControlHelper();

  // const setSupportVisiblity = useSetRecoilState(supportVisible);
  const clearSelections = useSetRecoilState(clearDriveAndItemSelections);
  const setDrivecardSelection = useSetRecoilState(drivecardSelectedNodesAtom)
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
      activateMenuPanel(1)
    }
  },[]);
  
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

 
  // Breadcrumb container
  let breadcrumbContainer = null;
  if (routePathDriveId) {
    breadcrumbContainer = <BreadcrumbContainer />;
  }

  
  // let mainPanelStyle ={
  //   height:'100%',
  //   width:'100%'
  // }
  // if(routePathDriveId === ''){
  //   mainPanelStyle = {}
  // }
  const driveCardSelection = ({item}) => {
    let newParams = {};
    newParams["path"] = `${item.driveId}:${item.driveId}:${item.driveId}:Drive`;
    history.push("?" + encodeParams(newParams));
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

      <headerPanel title="Library">
      </headerPanel>

      <mainPanel>
      <AutoSelect />

      {breadcrumbContainer}
        <div 
        onClick={()=>{
          clearSelections()
        }}
        className={routePathDriveId ? 'mainPanelStyle' : ''}
        >
        <Drive types={['content','course']}  urlClickBehavior="select" 
        doenetMLDoubleClickCallback={(info)=>{
          openOverlay({type:"editor",branchId: info.item.branchId,title: info.item.label});
          }}/>

        </div>
       
        <div 
        onClick={
          cleardrivecardSelection
        }
        tabIndex={0}
        className={routePathDriveId ? '' : 'mainPanelStyle' }
        >
       <DriveCards
       types={['course']}
       subTypes={['Administrator']}
       routePathDriveId={routePathDriveId}
       driveDoubleClickCallback={({item})=>{driveCardSelection({item})}}
       />
        </div>
        
          
        </mainPanel>
      <supportPanel>
      <Drive types={['content','course']}  urlClickBehavior="select" />
      </supportPanel>

      <menuPanel title="Selected">
        <ItemInfo  />
      </menuPanel>
      <menuPanel title="+ Add Items">
       <AddMenuPanel route={props.route} />
      </menuPanel>

     

     
    </Tool>
  );
}
