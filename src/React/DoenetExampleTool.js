import React, { useState } from "react";
import ToolLayout from "./ToolLayout/ToolLayout";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
import styled from "styled-components";

const Button = styled.button`
  width: 60px;
  height: 30px;
  border: 1px solid lightgrey;
  position: relative;
  top: 5px;
  left: 20px;
`;

const alphabet =
  "a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z ";
export default function DoenetExampleTool(props) {


  let [x, setX] = useState(0);
  const menuControls = [<Button >Search</Button>];
  const menuControlsEditor = [<Button>Edit</Button>]
  const menuControlsViewer = [<Button>Update</Button>];

  const headerProps = {
    title: 'test',
    key: '1'
  };

  return (
    <>

      <ToolLayout toolTitle="Exampletool" headingTitle="Example" 
      // header={
      //   headerProps
      // }
      >
        <ToolLayoutPanel panelName="Context Panel" leftPanelWidth="100px"> 
          <div>
            {alphabet} {alphabet} {alphabet}
            {alphabet} {alphabet} {alphabet}
            <button onClick={() => setX(x + 1)}> Count</button>
        
            {x}
            <p>test</p>
            {alphabet} {alphabet} {alphabet}
            {alphabet} {alphabet} {alphabet}

          </div>
        </ToolLayoutPanel>

        <ToolLayoutPanel 
          menuControls={menuControlsEditor}
          panelName="Editor"
        >
          {alphabet} 
          {alphabet} 
          {alphabet} {alphabet} {alphabet} {alphabet}  {alphabet} 
          {alphabet} {alphabet} {alphabet} {alphabet} 
        </ToolLayoutPanel>

        <ToolLayoutPanel rightPanelWidth="400px"
          menuControls={menuControlsViewer} panelName="Viewer"
        >
          {alphabet} {alphabet} <button onClick={() => setX(x + 1)}> Count</button>
     {alphabet} {alphabet}
        </ToolLayoutPanel>
      </ToolLayout>


    </>
  );
}

