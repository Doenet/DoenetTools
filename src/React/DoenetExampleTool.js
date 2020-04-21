import React, { Component } from "react";
import ToolLayout from "./ToolLayout/ToolLayout";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
import styled from "styled-components";

const Button = styled.button`
  width: 60px;
  height: 25px;
  border: 1px solid lightgrey;
  position: relative;
  top: 10px;
  left: 20px;
`;

const alphabet =
  "a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z ";
export default class DoenetExampleTool extends Component {
  render() {
    const menuControls = [<Button>Search</Button>];
    const menuControlsEditor = [<Button>Edit</Button>];
    const menuControlsViewer = [<Button>Update</Button>];

    return (
      <>
        <ToolLayout>

       <ToolLayoutPanel
            // menuControls={menuControls}
            panelName="context"
          >
            {alphabet} {alphabet} {alphabet} {alphabet}
          </ToolLayoutPanel> 

       <ToolLayoutPanel
            menuControls={menuControlsEditor}
            panelName="Editor">

            {alphabet} {alphabet} {alphabet} {alphabet} {alphabet} {alphabet}
            {alphabet}
            {alphabet}
            {alphabet}
            {alphabet} {alphabet} {alphabet} {alphabet} {alphabet} {alphabet}
            {alphabet}
            {alphabet}
            {alphabet}
          </ToolLayoutPanel>

          {/* <ToolLayoutPanel menuControls={menuControlsViewer} panelName="Viewer">
            {alphabet} {alphabet} {alphabet} {alphabet}
          </ToolLayoutPanel>  */}
        </ToolLayout>
      </>
    );
  }
}
