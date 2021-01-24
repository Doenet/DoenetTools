import React, {useContext, useState, useCallback, useRef, useEffect} from 'react';
import axios from "axios";
import nanoid from 'nanoid';
import styled from "styled-components";
import './util.css';

import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";

import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  RecoilRoot,
  useSetRecoilState,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

import {folderDictionarySelector, globalSelectedNodesAtom, selectedDriveAtom} from './Drive';


export default function AddItem(props){
  // console.log("=== AddItem")

    return  <Router ><Switch>
           <Route path="/" render={(routeprops)=>
           <AddItemRouted route={{...routeprops}} />
           }></Route>
         </Switch></Router>
       
}

function AddItemRouted(props){

  const selectedDrive = useRecoilValue(selectedDriveAtom);
  let selectedItemId = selectedDrive.driveId;  
  let driveId = selectedDrive.driveId;
  let itemInfo = null;

  const globalSelected = useRecoilValue(globalSelectedNodesAtom);
  if (globalSelected.length > 0) {
    selectedItemId = globalSelected[0]?.itemId;
    driveId = globalSelected[0]?.driveId;
    const parentFolderId = globalSelected[0]?.parentFolderId;
    const folderInfo = useRecoilStateLoadable(folderDictionarySelector({driveId,parentFolderId})); 
    itemInfo = folderInfo[0]?.contents?.contentsDictionary?.[selectedItemId];
  }
  
  const [activeForm, setActiveForm] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleClickFormTab = (id) => {
    if (id !== activeForm) {
      setActiveForm(id);
    }
  };
  const onAddItemCallback = () => {
    setIsExpanded(false);
    setActiveForm(0);
  }
  
  if (itemInfo?.itemType !== "Folder" && !selectedDrive) return <></>;

  return <div>
    { !isExpanded ? 
      <div>
        <button 
        style={{backgroundColor: "#1A5A99",color: "white", border: "none", borderRadius: "12px", height: "24px", margin: "2px"}}
        data-doenet-drive-stayselected onClick={()=>{setIsExpanded(true)}}>Add Item</button>
      </div> :
      <div>
        <div className="headingContainer" style={{display: "flex", justifyContent: "space-between", padding: "3px"}}>
          <h3>Add Item</h3>
          <button onClick={()=>{setIsExpanded(false)}}>X</button>
        </div>
        <div>
          <Tabs>
            <Tab onClick={()=>handleClickFormTab(0)} active={activeForm===0} id={`addFormFolder`}>Folder</Tab>
            <Tab onClick={()=>handleClickFormTab(1)} active={activeForm===1} id={`addFormUrl`}>URL</Tab>
            <Tab onClick={()=>handleClickFormTab(2)} active={activeForm===2} id={`addFormDoenetML`}>DoenetML</Tab>
          </Tabs>
          <>
            <Content active={activeForm===0}>
              <AddNewFolderForm driveId={driveId} folderId={selectedItemId} callback={onAddItemCallback}/>
            </Content>
            <Content active={activeForm===1}>
              <AddNewURLForm driveId={driveId} folderId={selectedItemId} callback={onAddItemCallback}/>
            </Content>
            <Content active={activeForm===2}>
              <AddNewDoenetMLForm driveId={driveId} folderId={selectedItemId} callback={onAddItemCallback}/>
            </Content>
          </>
        </div>
      </div>
    }
  </div>
}

function AddNewFolderForm(props) {
  
  const { driveId, folderId } = props;
  const [_, setFolderInfo] = useRecoilStateLoadable(folderDictionarySelector({driveId, folderId}))

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const label = ev.target.label.value;
    dispatchAddInstruction({label});
    props.callback?.();
  }

  const dispatchAddInstruction = ({label}) => {
    setFolderInfo({
      instructionType:"addItem",
      label,
      selectedItemId: null,
      itemType:"Folder"
    });
  }

  return (
    <div>
      <span>New Folder</span>
      <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Label: </label>
            <input
              type="text"
              name="label"
              required
            />
          </div>
          <div className="form-group" style={{display:"flex", justifyContent:"flex-end"}}>
            <input className="btn btn-primary" type="submit" value="Add"/>
          </div>
      </form>
    </div> 
  )
}

function AddNewURLForm(props) {
  
  const { driveId, folderId } = props;
  const [_, setFolderInfo] = useRecoilStateLoadable(folderDictionarySelector({driveId, folderId}))

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const label = ev.target.label.value;
    const url = ev.target.url.value;
    dispatchAddInstruction({label, url});
    props.callback?.();
  }

  const dispatchAddInstruction = ({label, url}) => {
    setFolderInfo({
      instructionType:"addItem",
      label,
      url,
      selectedItemId: null,
      itemType:"Url"
    });
  }

  return (
    <div>
      <span>New URL</span>
      <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Label: </label>
            <input
              type="text"
              name="label"
              required
            />
          </div>
          <div className="form-group">
            <label>URL: </label>
            <input
              type="text"
              name="url"
              required
            />
          </div>
          <div className="form-group" style={{display:"flex", justifyContent:"flex-end"}}>
            <input className="btn btn-primary" type="submit" value="Add"/>
          </div>
      </form>
    </div> 
  )
}

function AddNewDoenetMLForm(props) {
  
  const { driveId, folderId } = props;
  const [_, setFolderInfo] = useRecoilStateLoadable(folderDictionarySelector({driveId, folderId}))

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const label = ev.target.label.value;
    dispatchAddInstruction({label});
    props.callback?.();
  }

  const dispatchAddInstruction = ({label}) => {
    setFolderInfo({
      instructionType:"addItem",
      label,
      selectedItemId: null,
      itemType:"DoenetML"
    });
  }

  return (
    <div>
      <span>New DoenetML</span>
      <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Label: </label>
            <input
              type="text"
              name="label"
              required
            />
          </div>
          <div className="form-group" style={{display:"flex", justifyContent:"flex-end"}}>
            <input className="btn btn-primary" type="submit" value="Add"/>
          </div>
      </form>
    </div> 
  )
}

const Tabs = styled.div`
  overflow: hidden;
  background: #fff;
  font-family: Open Sans;
  height: 1.5em;
`;

const Tab = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  width: 30%;
  position: relative;

  margin-right: 0.1em;
  font-size: 1em;
  border: ${props => (props.active ? "1px solid #ccc" : "")};
  border-bottom: ${props => (props.active ? "none" : "")};
  background-color: ${props => (props.active ? "white" : "lightgray")};
  height: ${props => (props.active ? "1.5em" : "1.2em; top:.4em")};
  transition: background-color 0.5s ease-in-out;

  :hover {
    background-color: white;
  }
`;

const Content = styled.div`
  ${props => (props.active ? "" : "display:none")}
`;