
import React, { useState } from "react";
import ToolLayout from "./ToolLayout/ToolLayout";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
import styled from "styled-components";
import Overlay from "../Tools/ToolLayout/Overlay";


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
  return (
    <>

      {isOpen ? <Overlay isOpen={isOpen} 
             name="Editor"
             header= {"Example"}
          onClose={()=>{overlayOnClose()}}>
            <ToolLayoutPanel
          // panelHeaderControls={mainControls}
          panelName="Main"
          // purpose="main" 
          >
          start main 
          {alphabet}{alphabet}{alphabet}{alphabet}end
        </ToolLayoutPanel>

        {/* <ToolLayoutPanel
          panelName="Support"
          purpose="support">
          start {alphabet}{alphabet}{alphabet}{alphabet}{alphabet}{alphabet}end
          </ToolLayoutPanel> */}
      </Overlay> : <ToolLayout toolName="my example"
      headingTitle="Example tool"


      >
        <ToolLayoutPanel
          // panelHeaderControls={menuControls}
          isLeftPanel={true}
          purpose = "navigation"
        >
          start {alphabet} {alphabet} {alphabet}{alphabet} {alphabet}{alphabet}end
        </ToolLayoutPanel>

        <ToolLayoutPanel
          panelHeaderControls={mainControls}
          panelName="Main"
          // purpose="main" 
          >
          <button onClick = {()=>{showOverLay()}}>Test</button>{alphabet}{alphabet}{alphabet}{alphabet}end
        </ToolLayoutPanel>

        <ToolLayoutPanel
          panelName="Support"
          purpose="support">
          start {alphabet}{alphabet}{alphabet}{alphabet}{alphabet}{alphabet}end
          </ToolLayoutPanel>
      </ToolLayout>}
    </>
  );
}



