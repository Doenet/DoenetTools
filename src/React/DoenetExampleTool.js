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
export default class ExampleTool extends Component {
  render() {
    const menuControls = [<Button>Search</Button>];
    const menuControls2 = [<Button>Edit</Button>];
    const menuControls3 = [<Button>Update</Button>];

    return (
      <>
        <ToolLayout>

       <ToolLayoutPanel
            menuControls={menuControls}
            panelName="context"
          >
            {alphabet} {alphabet} {alphabet} {alphabet}
          </ToolLayoutPanel> 

          <ToolLayoutPanel
            // menuControls={menuControls2}
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

          <ToolLayoutPanel menuControls={menuControls3} panelName="Viewer">
            {alphabet} {alphabet} {alphabet} {alphabet}
          </ToolLayoutPanel>
        </ToolLayout>
      </>
    );
  }
}
