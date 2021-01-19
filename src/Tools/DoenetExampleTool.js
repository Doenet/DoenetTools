import React, { useState, useEffect } from "react";
import Tool, { openOverlayByName } from "../imports/Tool/Tool";
import Drive, { globalSelectedNodesAtom } from "../imports/Drive";
import AddItem from '../imports/AddItem'
import Switch from "../imports/Switch";
import {
  atom,
  useSetRecoilState,
  useRecoilState,
  useRecoilValue,
  selector,
  atomFamily,
  selectorFamily,
  RecoilRoot,
} from "recoil";
import { BreadcrumbContainer } from "../imports/Breadcrumb";
import { supportVisible } from "../imports/Tool/SupportPanel";

// Editor imports
import DoenetViewer from './DoenetViewer';
import ErrorBoundary from './ErrorBoundary';
import Button from "../imports/PanelHeaderComponents/Button"
import Editor from './Editor/Editor.js';
import InfoPanel from './Editor/InfoPanel.js';
import {getInitView} from './Editor/viewInit.js';

let numAtom = atom({
  key: "numAtom",
  default: 0,
});

let unitAtom = atom({
  key: "unitAtom",
  default: "px",
});

let molecule = selector({
  key: "mymolecule",
  get: ({ get }) => {
    let aNum = get(numAtom);
    let unit = get(unitAtom);

    return aNum * 3 + unit;
  },
});

let mytest = selector({
  key: "mytest",
  get: ({ get }) => {
    let mole = get(molecule);
    console.log("MOLE!!!");
    return `this is mole ${mole}`;
  },
});

const contentState = atom({
  key: 'DoenetExample_content',
  default: '',
});

const updateNumState = atom({
  key: 'DoenetExample_updateNum',
  default: 0,
});

const tagState = atom({
  key: 'DoenetExample_tag',
  default: {},
});

const MemoizedEditor = React.memo(Editor);

function GlobalSelectIndicator() {
  let selectedNodes = useRecoilValue(globalSelectedNodesAtom);
  let nodes = [];
  for (let nodeObj of selectedNodes) {
    nodes.push(
      <div key={`gsi${nodeObj.nodeId}`}>
        {nodeObj.type} {nodeObj.nodeId}
      </div>
    );
  }
  return (
    <div
      style={{
        backgroundColor: "#fcd2a7",
        border: "1px solid black",
        margin: "20px",
        padding: "10px",
      }}
    >
      <h3>Global Select Indicator</h3>
      {nodes}
    </div>
  );
}

let myAtomFam = atomFamily({
  key: "myAtomFam",
  default: "default",
});
function Inc(props){
  let setNum = useSetRecoilState(numAtom);
  return <button onClick={() => setNum((old) => old + 1)}>+</button>;
}

function NumIndicator() {
  let num = useRecoilValue(molecule);
  return <div>{num}</div>;
}
function ShowFam(props) {
  const famVal = useRecoilValue(myAtomFam(props.mykey));
  return (
    <div>
      mykey{props.mykey} = {famVal}
    </div>
  );
}

export default function DoenetExampleTool(props) {
  const setSupportVisiblity = useSetRecoilState(supportVisible);
  const setOverlayOpen = useSetRecoilState(openOverlayByName);
  console.log("=== DoenetExampleTool");
  const setmyAtomFamOne = useSetRecoilState(myAtomFam("one"));
  const setmyAtomFamTwo = useSetRecoilState(myAtomFam("two"));

  const [content, setContent] = useRecoilState(contentState);
  const [updateNum, setUpdateNum] = useRecoilState(updateNumState);

  const [tag, setTag] = useRecoilState(tagState);
  const [view, setView] = useState(getInitView(content, setContent, setTag));

  let doenetViewer = (<ErrorBoundary key={"doenetErrorBoundry"+updateNum}>
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

let updateButton = <Button text={"Update"} callback={() => {setUpdateNum(updateNum+1);}}/>

  return (
    <Tool>
      <navPanel>
        {/* <p>navigate to important stuff</p> */}
        {/* <Drive driveId="ZLHh5s8BWM2azTVFhazIH" /> */}
        <Drive driveId='ZLHh5s8BWM2azTVFhazIH' urlClickBehavior="select"/>
        {/* <Drive types={['content','course']} /> */}
        <div>
          <button
            onClick={() => {
              setOverlayOpen("George");
            }}
          >
            Go to Overlay
          </button>
        </div>
      </navPanel>

      <headerPanel title="my title">
        <Switch
          onChange={(value) => {
            setSupportVisiblity(value);
          }}
        />
        <p>header for important stuff</p>
      </headerPanel>

      <mainPanel>
        <p>do the main important stuff</p>
        <BreadcrumbContainer /> 
        <AddItem />
        <Drive driveId="ZLHh5s8BWM2azTVFhazIH" urlClickBehavior="select" />

        {/* <Drive types={['content','course']} /> */}
      </mainPanel>

      <supportPanel width="40%">
        <p>I'm here for support</p>
        <MemoizedEditor view={view} mountKey="mountkey-1"/>
        {/* <GlobalSelectIndicator /> */}
      </supportPanel>

      <menuPanel title="edit">
        <p>control important stuff</p>
      </menuPanel>

      <menuPanel title="other">
        <p>control more important stuff</p>
      </menuPanel>

      <overlay>
        <headerPanel title="my title">
          <Switch
            onChange={(value) => {
              setSupportVisiblity(value);
            }}
          />
          <p>header for important stuff</p>
        </headerPanel>

        {/* <mainPanel>
          <p>do the main important stuff</p>

          <BreadcrumbContainer />
          <Drive id="ZLHh5s8BWM2azTVFhazIH" />
          <Drive types={['content','course']} />
        </mainPanel> */}

        <mainPanel responsiveControls={[updateButton]}>
          <div style={{display:'flex', flexDirection:'column'}}>{updateButton} {doenetViewer}</div>
        </mainPanel>

        <supportPanel width="40%">
          <p>I'm here for support</p>
        <MemoizedEditor view={view} mountKey="mountkey-overlay"/>
          {/* <GlobalSelectIndicator /> */}
        </supportPanel>

        <menuPanel title="edit">
          <p>control important stuff</p>
          <button
            onClick={() => {
              setOverlayOpen("");
            }}
          >
            Go Back
          </button>
        </menuPanel>

        <menuPanel title="other">
          <p>control more important stuff</p>

          
        </menuPanel>
      </overlay>
    </Tool>
  );
}
