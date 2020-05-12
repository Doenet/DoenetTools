import React, { useState } from "react";
import ToolLayout from "./ToolLayout/ToolLayout";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";

const alphabet =
  "a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z ";
export default function DoenetExampleTool(props) {

  let [x, setX] = useState(0);
  const menuControls = [<button >Search</button>];
  const menuControlsEditor = [<button>Edit</button>]
  const menuControlsViewer = [<button>Update</button>];

  return (
    <>
      {/* ToolLayout    
         toolName - same tool title in DoenetHeader(can send as props in anytool )
         headingTitle - Header text in middle of Header
         leftPanelWidth - can add width of first child of ToolLayout
         rightPanelWidth - can add width of third child if available in ToolLayout
      ) */}
      <ToolLayout toolName ="Example" headingTitle ="Example Heading"
      //  leftPanelWidth= '100' // !> 300
      //  rightPanelWidth= '200' // !> 500
      >
        {/* ToolLayoutPanel 
              menuControls - menu controls can be defined & send as prop
              panelName - In phone the button container button's name label
        */}

        <ToolLayoutPanel key="one" menuControls={menuControls} panelName="Context Panel">
          <div>
            {alphabet} {alphabet} {alphabet}{alphabet} {alphabet} {alphabet}{alphabet} {alphabet} {alphabet}
            <button onClick={() => setX(x + 1)}> Count</button>{x}
           <p>test</p>  
          </div>
        </ToolLayoutPanel>

        <ToolLayoutPanel key="two" menuControls={menuControlsEditor} panelName="Editor">
          <div>
            {alphabet} {alphabet} {alphabet}{alphabet} {alphabet} {alphabet}{alphabet} {alphabet} {alphabet}{alphabet} {alphabet} {alphabet}
          </div>
        </ToolLayoutPanel>

        <ToolLayoutPanel key="three" menuControls={menuControlsViewer} panelName="Viewer">
          <div>
            {alphabet} {alphabet} {alphabet}{alphabet} {alphabet} {alphabet}{alphabet} {alphabet} {alphabet}{alphabet} {alphabet} {alphabet}
           
          </div>
        </ToolLayoutPanel>
      </ToolLayout>
    </>
  );
}

