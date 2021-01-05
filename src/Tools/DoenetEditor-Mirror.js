import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWaveSquare, faDatabase, faServer
} from "@fortawesome/free-solid-svg-icons";
import Tool from "../imports/Tool/Tool";
import NavPanel from "../imports/Tool/NavPanel";
import MainPanel from "../imports/Tool/MainPanel";
import SupportPanel from "../imports/Tool/SupportPanel";
import MenuPanel from '../imports/Tool/MenuPanel';
import HeaderMenuPanelButton from '../imports/Tool/HeaderMenuPanelButton';
import Overlay from "../imports/Tool/Overlay";
import DoenetViewer from './DoenetViewer';
import ErrorBoundary from './ErrorBoundary';
import Button from "../imports/PanelHeaderComponents/Button"

import Editor from './Editor/Editor.js';
import InfoPanel from './Editor/InfoPanel.js';
import play from './Editor/macbeth.js'
import {getInitView} from './Editor/viewInit.js'


const finalIcon1 = <FontAwesomeIcon
  icon={faServer}
  style={{
    width: "10px",
    padding: "2px",
    backgroundColor: "#e2e2e2",
    alignSelf: "center",
    fontSize: '16px',
    color: 'grey'
  }} />;
const finalIcon2 = <FontAwesomeIcon
  icon={faDatabase}
  style={{
    width: "10px",
    padding: "2px",
    backgroundColor: "#e2e2e2",
    alignSelf: "center",
    fontSize: '16px',
    color: 'grey'
  }} />;
const finalIcon3 = <FontAwesomeIcon
  icon={faWaveSquare}
  style={{
    width: "10px",
    padding: "2px",
    backgroundColor: "#e2e2e2",
    alignSelf: "center",
    fontSize: '16px',
    color: 'grey'
  }} />;

 
function DoenetEditor(props) {
const [showHideNewOverLay, setShowHideNewOverLay]=useState(false);

const showHideOverNewOverlayOnClick = () =>{
  setShowHideNewOverLay(!showHideNewOverLay);
}

// const init_content = "<outer>\n <inner>\n  I am inside\n </inner>\n</outer>";
// const content = play;
const [content, setContent] = useState("");
const [updateNum, setUpdateNum] = useState(0);

const [tag, setTag] = useState({});
const [view, setView] = useState(getInitView("", setContent, setTag));

let doenetViewer = (<ErrorBoundary key={"doenetErrorBoundry"}>
      <DoenetViewer 
              key={"doenetviewer"+updateNum} //each component has their own key, change the key will trick React to look for new component
              // free={{doenetCode: this.state.viewerDoenetML}} 
              doenetML={typeof content === 'string' ? content : content.sliceString(0)} 
              mode={{
              solutionType:false,
              allowViewSolutionWithoutRoundTrip:false,
              showHints:false,
              showFeedback:false,
              showCorrectness:false,
          }}           
          />
          </ErrorBoundary>)

let updateButton = <Button text={"Update"} onClick={() => setUpdateNum(updateNum+1)}/>
// let updateButton = <Button text={"Update"}/>

  return (

<>

{!showHideNewOverLay ? 
    <Tool
      onUndo={() => { console.log(">>>undo clicked") }}
      onRedo={() => { console.log(">>>redo clicked") }}
      title={"My Doc"}
      initSupportPanelOpen={true}
      // responsiveControls={[]}
      headerMenuPanels={[
        <HeaderMenuPanelButton buttonText="Add">{"content 1"}</HeaderMenuPanelButton>, <HeaderMenuPanelButton buttonText="Save">{"content 2"}</HeaderMenuPanelButton>
      ]}
    >


   <NavPanel>
    <>
     Nav Panel
    </>
   </NavPanel>

      <MainPanel setShowHideNewOverLay= {setShowHideNewOverLay}
        // responsiveControls={[]}
      >
        <div onClick={()=> {showHideOverNewOverlayOnClick()}}>Click for Overlay</div>

      </MainPanel>

      <SupportPanel
        // responsiveControls={[]}
      >
        <Editor view={view} mountKey="mountkey-1"/>
      
      </SupportPanel>
      <MenuPanel title="edit">
      </MenuPanel>
      <MenuPanel title="style">
        <InfoPanel curr_tag={tag} view={view} setView={setView}/>
      </MenuPanel>
    </Tool>
    :

    <Overlay
          isOpen={showHideNewOverLay}
          onUndo={()=>{}}
          onRedo={()=>{}}
          title={"my doc"}
          onClose={() => { setShowHideNewOverLay(false) }}

          // responsiveControls={[<ResponsiveControls/>]}  
          headerMenuPanels={[]}
        >
        <MainPanel responsiveControls={[updateButton]}>
          <div style={{display:'flex', flexDirection:'column'}}> {doenetViewer}</div>
        </MainPanel>
        <SupportPanel responsiveControls={[]}>
          <Editor view={view} mountKey="mountkey-overlay"/>
        </SupportPanel>
    </Overlay> 
    }
</>
  );
}

export default DoenetEditor;