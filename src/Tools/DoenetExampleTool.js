import React from "react";
import Tool from "../imports/Tool/Tool";
import Drive, {globalSelectedNodesAtom} from "../imports/Drive";
import {
  atom,
  useSetRecoilState,
  useRecoilState,
  useRecoilValue,
  selector,
  atomFamily
} from 'recoil';
import { node } from "prop-types";
import { DropTargetsProvider } from '../imports/DropTarget';
import { 
  BreadcrumbProvider, 
  BreadcrumbContainer 
} from '../imports/Breadcrumb';
import { HashRouter as Router } from "react-router-dom";



let numAtom = atom({
  key:"numAtom",
  default:0
})

let unitAtom = atom({
  key:"unitAtom",
  default:"px"
})

let molecule = selector({
  key:"mymolecule",
  get:({get})=>{
    let aNum = get(numAtom);
    let unit = get(unitAtom);

    return (aNum * 3)+unit;
  }
})

function GlobalSelectIndicator(){
  let selectedNodes = useRecoilValue(globalSelectedNodesAtom);
  let nodes = [];
  for (let nodeObj of selectedNodes){
    nodes.push(<div key={`gsi${nodeObj.nodeId}`}>{nodeObj.type} {nodeObj.nodeId}</div>)
  }
  return <div style={{backgroundColor:"#fcd2a7",border:"1px solid black",margin:"20px",padding:"10px"}}>
  <h3>Global Select Indicator</h3>
  {nodes}
  </div>
}

function Inc(){
  let setNum = useSetRecoilState(numAtom);
  return <button onClick={()=>setNum((old)=>old+1)}>+</button>
}

function NumIndicator(){
  let num = useRecoilValue(molecule);
  return <div>{num}</div>
}


export default function DoenetExampleTool(props) {
  console.log("=== DoenetExampleTool")
  return <DropTargetsProvider>
    <BreadcrumbProvider>
      <Tool >
        <navPanel>
            {/* <p>navigate to important stuff</p> */}
            <Drive id="ZLHh5s8BWM2azTVFhazIH" />
            {/* <Drive types={['content','course']} /> */}
          </navPanel>

          <headerPanel title="my title">
            <p>header for important stuff</p>
          </headerPanel>

          <mainPanel>
            <p>do the main important stuff</p>
            <Router>
              <BreadcrumbContainer />
            </Router>

            <NumIndicator />
            <Drive id="ZLHh5s8BWM2azTVFhazIH" />
            {/* <Drive types={['content','course']} /> */}
          </mainPanel>

          <supportPanel width="40%">
            <p>I'm here for support</p>
            <GlobalSelectIndicator />
          </supportPanel>

          <menuPanel> 
            <Inc />
            <p>control important stuff</p>
          </menuPanel>

          <menuPanel>
            <p>control more important stuff</p>
          </menuPanel>
      </Tool>
    </BreadcrumbProvider>
  </DropTargetsProvider>
}










// const [showHideNewOverLay, setShowHideNewOverLay] = useState(false);

// const showHideOverNewOverlayOnClick = () => {
//   setShowHideNewOverLay(!showHideNewOverLay);
// };

// return (
//   // <SelectedElementStore>
//   <>
//     {!showHideNewOverLay ? (
//       <Tool
//         initSupportPanelOpen
//         onUndo={() => {
//           console.log(">>>undo clicked");
//         }}
//         onRedo={() => {
//           console.log(">>>redo clicked");
//         }}
//         title={"My Doc"}
//         // responsiveControls={[]}
//         headerMenuPanels={[
//           <HeaderMenuPanelButton buttonText="Add">
//             {"content 1"}
//           </HeaderMenuPanelButton>,
//           <HeaderMenuPanelButton buttonText="Save">
//             {"content 2"}
//           </HeaderMenuPanelButton>,
//         ]}
//       >
//         <NavPanel>
//           Nav Panel
//         </NavPanel>

//         <MainPanel
//           setShowHideNewOverLay={setShowHideNewOverLay}
//           // responsiveControls={[]}
//         >
//           <div
//             onClick={() => {
//               showHideOverNewOverlayOnClick();
//             }}
//           >
//             Click for Overlay
//           </div>

//           <h3> This is Main Panel</h3>
//           <p>click Switch button in header to see support panel</p>
//           <p>
//             Define responsiveControls to see for standard components section
//             which are responsive and collapses according the width available
//           </p>

//           <h2>Header Menu Panels </h2>
//           <p>Click add and save to see header menu panels section </p>
//         </MainPanel>

//         <SupportPanel
//         // responsiveControls={[]}
//         >
//           <h3>Support Panel Content</h3>

//           <p>
//             Define responsiveControls to see for standard components section
//             which are responsive and collapses according the width available
//           </p>
//         </SupportPanel>
//         <MenuPanel>
//           <MenuPanelSection title="Font">
//             <CollapseSection>
//               <SectionDivider type="single">
//                 <ActionButton
//                   handleClick={() => {
//                     alert();
//                   }}
//                 />
//                 <Menu label="actions">
//                   <MenuItem
//                     value="Times"
//                     onSelect={() => {
//                       alert("Times Selected");
//                     }}
//                   />
//                   <MenuItem
//                     value="Ariel"
//                     onSelect={() => {
//                       alert("Ariel Selected");
//                     }}
//                   />
//                 </Menu>
//               </SectionDivider>
//             </CollapseSection>
//             <CollapseSection></CollapseSection>
//           </MenuPanelSection>
//           <MenuPanelSection title="style">
//             Menu Panel Style Content
//           </MenuPanelSection>
//         </MenuPanel>
//       </Tool>
//     ) : (
//       <Overlay
//         isOpen={showHideNewOverLay}
//         onUndo={() => {}}
//         onRedo={() => {}}
//         title={"my doc"}
//         onClose={() => {
//           setShowHideNewOverLay(false);
//         }}
//         // responsiveControls={[<ResponsiveControls/>]}
//         headerMenuPanels={[]}
//       >
//         <MainPanel responsiveControls={[]}>Overlay Main panel</MainPanel>
//         <SupportPanel responsiveControls={[]}>Overlay Support</SupportPanel>
//         <MenuPanel>
//           <MenuPanelSection title="Font">
//             <CollapseSection>
//               <SectionDivider type="single">
//                 <ActionButton
//                   handleClick={() => {
//                     alert();
//                   }}
//                 />
//                 <Menu label="actions">
//                   <MenuItem
//                     value="Times"
//                     onSelect={() => {
//                       alert("Times Selected");
//                     }}
//                   />
//                   <MenuItem
//                     value="Ariel"
//                     onSelect={() => {
//                       alert("Ariel Selected");
//                     }}
//                   />
//                 </Menu>
//               </SectionDivider>
//             </CollapseSection>
//             <CollapseSection></CollapseSection>
//           </MenuPanelSection>
//           <MenuPanelSection title="style">
//             Menu Panel Style Content
//           </MenuPanelSection>
//         </MenuPanel>
//       </Overlay>
//     )}
//     </>
//   // </SelectedElementStore>
// );