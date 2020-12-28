import React from 'react';
import SearchBar from "../imports/PanelHeaderComponents/SearchBar.js";
import Textfield from "../imports/PanelHeaderComponents/Textfield.js";
import VerticalDivider from "../imports/PanelHeaderComponents/VerticalDivider.js";
import Button from "../imports/PanelHeaderComponents/Button.js";
import ActionButton from "../imports/PanelHeaderComponents/ActionButton.js";
// import ActionButtonGroup from "../imports/PanelHeaderComponents/ActionButtonGroup.js";
import ToggleButton from "../imports/PanelHeaderComponents/ToggleButton.js";
import ProgressBar from "../imports/PanelHeaderComponents/ProgressBar.js";
import styled, { ThemeProvider } from 'styled-components';
import ActionButtonGroup from "../imports/PanelHeaderComponents/ActionButtonGroup.js";
import UnitMenu from "../imports/PanelHeaderComponents/UnitMenu.js";

export default function attempt() {
return (
<>
<ActionButtonGroup>
  <ActionButton text='X'></ActionButton>
  <ActionButton text='Y'></ActionButton>
  <ActionButton text='Z'></ActionButton>
</ActionButtonGroup>
</>
);
};

// const finalIcon1 = <FontAwesomeIcon
//   icon={faServer}
//   style={{
//     width: "10px",
//     padding: "2px",
//     backgroundColor: "#e2e2e2",
//     alignSelf: "center",
//     fontSize: '16px',
//     color: 'grey'
//   }} />;
// const finalIcon2 = <FontAwesomeIcon
//   icon={faDatabase}
//   style={{
//     width: "10px",
//     padding: "2px",
//     backgroundColor: "#e2e2e2",
//     alignSelf: "center",
//     fontSize: '16px',
//     color: 'grey'
//   }} />;
// const finalIcon3 = <FontAwesomeIcon
//   icon={faWaveSquare}
//   style={{
//     width: "10px",
//     padding: "2px",
//     backgroundColor: "#e2e2e2",
//     alignSelf: "center",
//     fontSize: '16px',
//     color: 'grey'
//   }} />;

 
// export default function DoenetExampleTool(props) {
// const [showHideNewOverLay, setShowHideNewOverLay]=useState(false);

  

// const showHideOverNewOverlayOnClick = () =>{
//   setShowHideNewOverLay(!showHideNewOverLay);
// }

//   return (


//     <>

//     {!showHideNewOverLay ? 
//     <Tool
//       onUndo={() => { console.log(">>>undo clicked") }}
//       onRedo={() => { console.log(">>>redo clicked") }}
//       title={"My Doc"}
//       responsiveControls={[]}
//       headerMenuPanels={[
//         <HeaderMenuPanelButton buttonText="Add">{"content 1"}</HeaderMenuPanelButton>, <HeaderMenuPanelButton buttonText="Save">{"content 2"}</HeaderMenuPanelButton>
//       ]}
//     >
//       <NavPanel>
//         <div style={{display:"flex", flexDirection:"column"}}>
//         <h3 >
//           This is Nav Panel
//         </h3>
//         <p>
//           Can be closed/opened with close(x) button on bottom left
//         </p>
//         </div>
      

//         {/* loadedContent={content} */}

//       </NavPanel>
  

//       <MainPanel setShowHideNewOverLay= {setShowHideNewOverLay}
//         responsiveControls={[]}
//       >
//         <div onClick={()=> {showHideOverNewOverlayOnClick()}}>Click for Overlay</div>
//         <h3> This is Main Panel</h3>
//         <p>click Switch button in header to see support panel</p>
//         <p>Define responsiveControls to see for standard components section which are responsive and collapses according the width available</p>
//         <h2>Header Menu Panels </h2>

//         <p>Click add and save to see header menu panels section </p>

//       </MainPanel>

//       <SupportPanel
//         responsiveControls={[]}
//       >
//         <h3>Support Panel Content</h3>

//         <p>Define responsiveControls to see for standard components section which are responsive and collapses according the width available</p>

      
//       </SupportPanel>

//       <MenuPanel title="edit">
//         <h3>This is Menu Panel and can be switched to title="style" menu panel</h3>
  
//       </MenuPanel>
//       <MenuPanel title="style">
//         Menu Panel Style Content
  
//       </MenuPanel>
//     </Tool>
//   :
//         <Overlay
//           isOpen={showHideNewOverLay}
//           // onUndo={()=>{...do something}}
//           // onRedo={()=>{...do something}}
//           title={"my doc"}
//           onClose={() => { setShowHideNewOverLay(false) }}

//           responsiveControls={[]}
//           headerMenuPanels={[]}
//         >
//           <MainPanel responsiveControls={[]}
//           >
//             Main panel content
//   </MainPanel>
//           <SupportPanel responsiveControls={[]}
//           >Support</SupportPanel>
//         </Overlay>
//      }
//     </>
//   );
// }











































// import React from 'react';
// import SearchBar from "../imports/PanelHeaderComponents/SearchBar.js";
// import Textfield from "../imports/PanelHeaderComponents/Textfield.js";
// import VerticalDivider from "../imports/PanelHeaderComponents/VerticalDivider.js";
// import Button from "../imports/PanelHeaderComponents/Button.js";
// import ActionButton from "../imports/PanelHeaderComponents/ActionButton.js";
// import ToggleButton from "../imports/PanelHeaderComponents/ToggleButton.js";

// export default function attempt() {
// return (
// <div>
//   <p>Button</p>
//   <Button/>
//   <p>ToggleButton</p>
//   <ToggleButton/>
//   <p>ActionButton</p>
//   <ActionButton/>
//   <p>textfield</p>
//   <Textfield/>
//   <p>searchbar</p>
//   <SearchBar/>

// </div>
// );
// };






//   import React from 'react';
// import VerticalDivider from "../Doenet/components/VerticalDivider.js";
// import ToolLayout from '../Tools/ToolLayout/ToolLayout.js';
// import ToolLayoutPanel from '../Tools/ToolLayout/ToolLayoutPanel.js';
// import { getCourses_CI, setSelected_CI, saveCourse_CI } from "../imports/courseInfo";

// export default function attempt() {
//      //Save new course in IndexedDB
//     //  getCourses_CI({courseId, courseName, courseCode, term, description, department, section})
//     let courseId = "mycourseid";
//     let courseName = "my test course";
//     let courseCode = "my101"
//     let term = "Spring 2020"
//     let description = "my description"
//     let department = "dep"
//     let section = "01"

//     // getCourses_CI({courseId, courseName, courseCode, term, description, department, section})
// return (


// <Tool 
// onUndo={()=>{console.log("undo clicked")}}
// onRedo={()=>{console.log("redo clicked")}}
//  title={"my doc"}
// responsiveControls={[<button>Tool button </button>,<button>Tool button </button>,<button>button 2</button>,<button>button 3</button>
//   // <ResponsiveControls>
//   //   <button>Tool button </button>,<button>button 2</button>,<button>button 3</button>
//   // </ResponsiveControls>,
//   // <ResponsiveControls>
//   //   <button>Tool button </button>,<button>button 2</button>,<button>button 3</button>
//   // </ResponsiveControls>
//     ]}  
//   headerMenuPanels={[<HeaderMenuPanelButton buttonText="Add">{"content 1"}</HeaderMenuPanelButton>,<HeaderMenuPanelButton buttonText="Save">{"content 2"}</HeaderMenuPanelButton>,<HeaderMenuPanelButton buttonText="Save">{"content 3"}</HeaderMenuPanelButton>]} 
// >

//   <NavPanel>

//     {alphabet}{alphabet}{alphabet}{alphabet}<VericalDivider />
//     {alphabet}{alphabet}{alphabet}{alphabet}
//     {alphabet}{alphabet}{alphabet}{alphabet}
//   {/* loadedContent={content} */}

//   </NavPanel>

//   <MainPanel responsiveControls={[<button>Main button</button>,<button>button 2</button>,<button>button 3</button>,<button>Tool button </button>,<button>button 2</button>,<button>button 3</button>,<button>Tool button </button>,<button>button 2</button>,<button>button 3</button>]}>
//     Main Panel content
//     {alphabet}{alphabet}{alphabet}{alphabet}
//     {alphabet}{alphabet}{alphabet}{alphabet}
//     {alphabet}{alphabet}{alphabet}{alphabet}
//   </MainPanel>

//  <SupportPanel responsiveControls={[<button>Support button </button>,<button>button 2</button>,<button>button 3</button>]}>
//    Support Panel Content
//    {alphabet}{alphabet}{alphabet}{alphabet}
//    {alphabet}{alphabet}{alphabet}{alphabet}
//    {alphabet}{alphabet}{alphabet}{alphabet}
//  </SupportPanel>
// {/* <MenuPanelWrap> */}
//   <MenuPanel title="edit">
//     Menu Panel Edit Content
//     {alphabet}{alphabet}{alphabet}{alphabet}
//     {alphabet}{alphabet}{alphabet}{alphabet}
//     {alphabet}{alphabet}{alphabet}{alphabet}
//  {/* <CollapsibleSection />
//       <CollapsibleSection /> */}
//     </MenuPanel>
//     <MenuPanel title="style">
//     Menu Panel Style Content
//     {alphabet}{alphabet}{alphabet}{alphabet}
//     {alphabet}{alphabet}{alphabet}{alphabet}
//     {alphabet}{alphabet}{alphabet}{alphabet}
//       {/* <CollapsibleSection />
//       <CollapsibleSection /> */}
//     </MenuPanel>





// </Tool>
// );
// }


// // import React, { useState } from "react";
// // import ToolLayout from "./ToolLayout/ToolLayout";
// // import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
// // import styled from "styled-components";
// // import Overlay from "../Tools/ToolLayout/Overlay";
// // import Tool from "./ToolLayout/Tool";
// // import NavPanel from "./ToolLayout/NavPanel";
// // import MainPanel from "./ToolLayout/MainPanel";
// // import SupportPanel from "./ToolLayout/SupportPanel";
// // import MenuPanel from './ToolLayout/MenuPanel';
// // import HeaderMenuPanelButton from '../Tools/ToolLayout/HeaderMenuPanelButton';
// // import VericalDivider from "../imports/PanelHeaderComponents/VerticalDivider";
// // import ControlGroup from "../ToolLayout/ResponsiveControls/ControlGroup";


// // const alphabet =
// //   "a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z ";

// // export default function DoenetExampleTool(props) {
// //   const [isOpen,setIsOpen] = useState(false);

// //   const mainControls = [<button>Test</button>];

// //   const overlayOnClose = () => {
// //     setIsOpen(false);
// //   }
// //   const showOverLay = () => {
// //     setIsOpen(true);

// //   } 
// //   const overlayContent = () =>{
// //     return(
// //       <Overlay isOpen={isOpen} 
// //       name="Editor"
// //       header= {"Example"}
// //       onClose={()=>{overlayOnClose()}}>
// //      <ToolLayoutPanel
// //    panelName="Main"
// //    purpose="main" 
// //    >
// //    start main 
// //    {alphabet}{alphabet}{alphabet}{alphabet}end
// //  </ToolLayoutPanel>

// //  {/* <ToolLayoutPanel
// //    panelName="Support"
// //    purpose="support">
// //    start {alphabet}{alphabet}{alphabet}{alphabet}{alphabet}{alphabet}end
// //    </ToolLayoutPanel> */}
// // </Overlay>
// //     )
// //   }
// //   return (




// // <Tool 
// // onUndo={()=>{console.log("undo clicked")}}
// // onRedo={()=>{console.log("redo clicked")}}
// //  title={"my doc"}
// // responsiveControls={[<button>Tool button </button>,<button>Tool button </button>,<button>button 2</button>,<button>button 3</button>
// //   // <ResponsiveControls>
// //   //   <button>Tool button </button>,<button>button 2</button>,<button>button 3</button>
// //   // </ResponsiveControls>,
// //   // <ResponsiveControls>
// //   //   <button>Tool button </button>,<button>button 2</button>,<button>button 3</button>
// //   // </ResponsiveControls>
// //     ]}  
// //   headerMenuPanels={[<HeaderMenuPanelButton buttonText="Add">{"content 1"}</HeaderMenuPanelButton>,<HeaderMenuPanelButton buttonText="Save">{"content 2"}</HeaderMenuPanelButton>,<HeaderMenuPanelButton buttonText="Save">{"content 3"}</HeaderMenuPanelButton>]} 
// // >

// //   <NavPanel>

// //     {alphabet}{alphabet}{alphabet}{alphabet}<VericalDivider />
// //     {alphabet}{alphabet}{alphabet}{alphabet}
// //     {alphabet}{alphabet}{alphabet}{alphabet}
// //   {/* loadedContent={content} */}

// //   </NavPanel>

// //   <MainPanel responsiveControls={[<button>Main button</button>,<button>button 2</button>,<button>button 3</button>,<button>Tool button </button>,<button>button 2</button>,<button>button 3</button>,<button>Tool button </button>,<button>button 2</button>,<button>button 3</button>]}>
// //     Main Panel content
// //     {alphabet}{alphabet}{alphabet}{alphabet}
// //     {alphabet}{alphabet}{alphabet}{alphabet}
// //     {alphabet}{alphabet}{alphabet}{alphabet}
// //   </MainPanel>

// //  <SupportPanel responsiveControls={[<button>Support button </button>,<button>button 2</button>,<button>button 3</button>]}>
// //    Support Panel Content
// //    {alphabet}{alphabet}{alphabet}{alphabet}
// //    {alphabet}{alphabet}{alphabet}{alphabet}
// //    {alphabet}{alphabet}{alphabet}{alphabet}
// //  </SupportPanel>
// // {/* <MenuPanelWrap> */}
// //   <MenuPanel title="edit">
// //     Menu Panel Edit Content
// //     {alphabet}{alphabet}{alphabet}{alphabet}
// //     {alphabet}{alphabet}{alphabet}{alphabet}
// //     {alphabet}{alphabet}{alphabet}{alphabet}
// //  {/* <CollapsibleSection />
// //       <CollapsibleSection /> */}
// //     </MenuPanel>
// //     <MenuPanel title="style">
// //     Menu Panel Style Content
// //     {alphabet}{alphabet}{alphabet}{alphabet}
// //     {alphabet}{alphabet}{alphabet}{alphabet}
// //     {alphabet}{alphabet}{alphabet}{alphabet}
// //       {/* <CollapsibleSection />
// //       <CollapsibleSection /> */}
// //     </MenuPanel>





// // </Tool>
