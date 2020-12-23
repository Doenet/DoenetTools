import React from "react";
import Tool from "../imports/Tool/Tool";
import Drive from "../imports/Drive";
import {
  atom,
  useSetRecoilState,
  useRecoilValue
} from 'recoil';

// import styled from "styled-components";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faWaveSquare,
//   faDatabase,
//   faServer,
// } from "@fortawesome/free-solid-svg-icons";
// import NavPanel from "../imports/Tool/NavPanel";
// import MainPanel from "../imports/Tool/MainPanel";
// import SupportPanel from "../imports/Tool/SupportPanel";
// import MenuPanel from "../imports/Tool/MenuPanel";
// import HeaderMenuPanelButton from "../imports/Tool/HeaderMenuPanelButton";
// import ResponsiveControls from "../imports/Tool/ResponsiveControls";
// import Overlay from "../imports/Tool/Overlay";
// import CollapseSection from "../imports/CollapseSection";
// import MenuPanelSection from "../imports/Tool/MenuPanelSection";
// import ActionButton from "../imports/PanelHeaderComponents/ActionButton";
// import MenuItem from "../imports/PanelHeaderComponents/MenuItem";
// import Menu from "../imports/PanelHeaderComponents/Menu";
// import SectionDivider from "../imports/PanelHeaderComponents/SectionDivider";
// import { SelectedElementStore } from "./SelectedElementContext";
let numAtom = atom({
  key:"numAtom",
  default:0
})
function Inc(){
  let setNum = useSetRecoilState(numAtom);
  return <button onClick={()=>setNum((old)=>old+1)}>+</button>
}
function NumIndicator(){
  let num = useRecoilValue(numAtom);
  return <div>{num}</div>
}


export default function DoenetExampleTool(props) {
  console.log("=== DoenetExampleTool")
  return <Tool>
     <navPanel>
        {/* <p>navigate to important stuff</p> */}
        <Drive id="abc123" />
        {/* <Drive types={['content','courses']} /> */}
      </navPanel>

      <mainPanel>
        <p>do important stuff</p>

        <NumIndicator />
        <Drive id="abc123" />
        <Drive types={['content','courses']} />
      </mainPanel>

      <supportPanel width="40%">
        <p>I'm here for support</p>
      </supportPanel>

      <menuPanel> 
        <Inc />
        <p>control important stuff</p>
      </menuPanel>

      <menuPanel>
        <p>control more important stuff</p>
      </menuPanel>
  </Tool>
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