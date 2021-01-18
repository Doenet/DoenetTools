import React from "react";
import Tool from "../imports/Tool/Tool";
import Drive, { globalSelectedNodesAtom } from "../imports/Drive";
import AddItem from '../imports/AddItem'

import Switch from "../imports/Switch"
import {
  atom,
  useSetRecoilState,
  useRecoilState,
  useRecoilValue,
  selector,
  atomFamily,
  selectorFamily
} from 'recoil';
import { 
  BreadcrumbContainer 
} from '../imports/Breadcrumb';

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
  key:"mytest",
  get:({get})=>{
    let mole = get(molecule);
    console.log("MOLE!!!")
    return `this is mole ${mole}`
  }
})

function GlobalSelectIndicator(){
  let selectedNodes = useRecoilValue(globalSelectedNodesAtom);
  console.log(">>>selectedNodes",selectedNodes)
  return "temp"
  // let nodes = [];
  // for (let nodeObj of selectedNodes) {
  //   nodes.push(
  //     <div key={`gsi${nodeObj.nodeId}`}>
  //       {nodeObj.type} {nodeObj.nodeId}
  //     </div>
  //   );
  // }
  // return (
  //   <div
  //     style={{
  //       backgroundColor: "#fcd2a7",
  //       border: "1px solid black",
  //       margin: "20px",
  //       padding: "10px",
  //     }}
  //   >
  //     <h3>Global Select Indicator</h3>
  //     {nodes}
  //   </div>
  // );
}


export default function DoenetExampleTool(props) {
  console.log("=== DoenetExampleTool");
  return (
    <Tool>
      <navPanel>
        {/* <p>navigate to important stuff</p> */}
        {/* <Drive driveId="ZLHh5s8BWM2azTVFhazIH" /> */}
        <Drive driveId='ZLHh5s8BWM2azTVFhazIH' urlClickBehavior="select"/>
        {/* <Drive types={['content','course']} /> */}
      </navPanel> 

      <headerPanel title="my title">
        <Switch onChange={() => {}}/>
        <p>header for important stuff</p>
      </headerPanel>

      <mainPanel>
        <p>do the main important stuff</p>
        {/* <BreadcrumbContainer />  */}
        <AddItem />
        <Drive driveId="ZLHh5s8BWM2azTVFhazIH" urlClickBehavior="select" />

        {/* <Drive types={['content','course']} /> */}
      </mainPanel>

      <supportPanel width="40%">
        <p>I'm here for support</p>
        <GlobalSelectIndicator />
      </supportPanel>

      <menuPanel title="edit">
        <p>control important stuff</p>
      </menuPanel>

      <menuPanel title="other">
        <p>control more important stuff</p>
      </menuPanel>
    </Tool>
  );
}
