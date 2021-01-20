import React from "react";
import Tool, { openOverlayByName } from "../imports/Tool/Tool";
import Drive, { globalSelectedNodesAtom } from "../imports/Drive";
import AddItem from "../imports/AddItem";
import Switch from "../imports/Switch";
import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  selector,
  atomFamily,
} from "recoil";
import { BreadcrumbContainer } from "../imports/Breadcrumb";
import { supportVisible } from "../imports/Tool/SupportPanel";

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
function Inc(props) {
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
  // console.log("=== DoenetExampleTool");

  return (
    <Tool>
      <navPanel>
        {/* <p>navigate to important stuff</p> */}
        {/* <Drive driveId="ZLHh5s8BWM2azTVFhazIH" /> */}
        <Drive driveId="ZLHh5s8BWM2azTVFhazIH" urlClickBehavior="select" />
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
        <p>header for important stuff</p>
        <Switch
          onChange={(value) => {
            setSupportVisiblity(value);
          }}
        />
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

        <mainPanel>
          <p>do the main important stuff</p>

          {/* <BreadcrumbContainer /> */}
          {/* <Drive id="ZLHh5s8BWM2azTVFhazIH" /> */}
          {/* <Drive types={['content','course']} /> */}
        </mainPanel>

        <supportPanel width="40%">
          <p>I'm here for support</p>
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
