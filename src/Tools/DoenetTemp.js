
import React, { useState } from "react";
import ToolLayout from "./ToolLayout/ToolLayout";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
import styled from "styled-components";
import Overlay from "../Tools/ToolLayout/Overlay";
import Tool from "./ToolLayout/Tool";
import NavPanel from "./ToolLayout/NavPanel";
import MainPanel from "./ToolLayout/MainPanel";
import SupportPanel from "./ToolLayout/SupportPanel";
import MenuPanel from './ToolLayout/MenuPanel';
import MenuPanelButton from '../Tools/ToolLayout/MenuPanelButton';
import VericalDivider from "../imports/PanelHeaderComponents/VerticalDivider";


const alphabet =
  "a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z ";

export default function DoenetExampleTool(props) {
  const [isOpen,setIsOpen] = useState(false);

  const mainControls = [<button>Test</button>];

  const overlayOnClose = () => {
    setIsOpen(false);
  }
  const showOverLay = () => {
    setIsOpen(true);
    
  } 
  const overlayContent = () =>{
    return(
      <Overlay isOpen={isOpen} 
      name="Editor"
      header= {"Example"}
      onClose={()=>{overlayOnClose()}}>
     <ToolLayoutPanel
   panelName="Main"
   purpose="main" 
   >
   start main 
   {alphabet}{alphabet}{alphabet}{alphabet}end
 </ToolLayoutPanel>

 {/* <ToolLayoutPanel
   panelName="Support"
   purpose="support">
   start {alphabet}{alphabet}{alphabet}{alphabet}{alphabet}{alphabet}end
   </ToolLayoutPanel> */}
</Overlay>
    )
  }
  return (




<Tool 
onUndo={()=>{console.log("undo clicked")}}
onRedo={()=>{console.log("redo clicked")}}
 title={"my doc"}
responsiveControls={[<button>Tool button </button>,<button>Tool button </button>,<button>button 2</button>,<button>button 3</button>
  // <ResponsiveControls>
  //   <button>Tool button </button>,<button>button 2</button>,<button>button 3</button>
  // </ResponsiveControls>,
  // <ResponsiveControls>
  //   <button>Tool button </button>,<button>button 2</button>,<button>button 3</button>
  // </ResponsiveControls>
    ]}  
  headerMenuPanels={[<MenuPanelButton buttonText="Add">{"content 1"}</MenuPanelButton>,<MenuPanelButton buttonText="Save">{"content 2"}</MenuPanelButton>,<MenuPanelButton buttonText="Save">{"content 3"}</MenuPanelButton>]} 
>

  <NavPanel>
 
    {alphabet}{alphabet}{alphabet}{alphabet}<VericalDivider />
    {alphabet}{alphabet}{alphabet}{alphabet}
    {alphabet}{alphabet}{alphabet}{alphabet}
  {/* loadedContent={content} */}

  </NavPanel>
 
  <MainPanel responsiveControls={[<button>Main button</button>,<button>button 2</button>,<button>button 3</button>,<button>Tool button </button>,<button>button 2</button>,<button>button 3</button>,<button>Tool button </button>,<button>button 2</button>,<button>button 3</button>]}>
    Main Panel content
    {alphabet}{alphabet}{alphabet}{alphabet}
    {alphabet}{alphabet}{alphabet}{alphabet}
    {alphabet}{alphabet}{alphabet}{alphabet}
  </MainPanel>

 <SupportPanel responsiveControls={[<button>Support button </button>,<button>button 2</button>,<button>button 3</button>]}>
   Support Panel Content
   {alphabet}{alphabet}{alphabet}{alphabet}
   {alphabet}{alphabet}{alphabet}{alphabet}
   {alphabet}{alphabet}{alphabet}{alphabet}
 </SupportPanel>
{/* <MenuPanelWrap> */}
  <MenuPanel title="edit">
    Menu Panel Edit Content
    {alphabet}{alphabet}{alphabet}{alphabet}
    {alphabet}{alphabet}{alphabet}{alphabet}
    {alphabet}{alphabet}{alphabet}{alphabet}
 {/* <CollapsibleSection />
      <CollapsibleSection /> */}
    </MenuPanel>
    <MenuPanel title="style">
    Menu Panel Style Content
    {alphabet}{alphabet}{alphabet}{alphabet}
    {alphabet}{alphabet}{alphabet}{alphabet}
    {alphabet}{alphabet}{alphabet}{alphabet}
      {/* <CollapsibleSection />
      <CollapsibleSection /> */}
    </MenuPanel>

    
  


</Tool>

    // <>

    //   {isOpen ? overlayContent()
    //   : 
    //   <ToolLayout 
    //   // navigationPanelData={} mainPanelData={} supportPanelData={} 
    //   toolName="my example"
    //   headingTitle="Example tool"
    //   >
    //     {/* <ToolLayoutPanel
    //       // panelHeaderControls={menuControls}
    //       isLeftPanel={true}
    //       purpose = "navigation"
    //     >
    //       start {alphabet} {alphabet} {alphabet}{alphabet} {alphabet}{alphabet}end
    //     </ToolLayoutPanel> */}
    //     <NavigationPanel>
    //     start {alphabet} {alphabet} {alphabet}{alphabet} {alphabet}{alphabet}end
    //     </NavigationPanel>
    //     <MainPanel>

    //     </MainPanel>
        
    //     {/* <SupportPanel>

    //     </SupportPanel> */}



    //     <ToolLayoutPanel
    //       panelHeaderControls={mainControls}
    //       panelName="Main"
    //       // purpose="main" 
    //       >
    //       <button onClick = {()=>{showOverLay()}}>Test</button>{alphabet}{alphabet}{alphabet}{alphabet}end
    //     </ToolLayoutPanel>

    //     <ToolLayoutPanel
    //       panelName="Support"
    //       purpose="support">
    //       start {alphabet}{alphabet}{alphabet}{alphabet}{alphabet}{alphabet}end
    //       </ToolLayoutPanel>

    //       <ToolLayoutPanel>
    //         <>

    //         </>
    //       </ToolLayoutPanel>
    //   </ToolLayout>}
    // </>
  );
}



