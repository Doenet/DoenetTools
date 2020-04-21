import React, { Component } from "react";
import styled from "styled-components";

const TopContent = styled.div`
  display: flex;
  min-height: 40px;
`;

const MenuContent = styled.div`
  margin: 1px;
`;

export default class ToolLayoutPanel extends Component {
  render() {
    let menu = null;
    if (this.props.menuControls) {
      menu = [...this.props.menuControls];
    }
    return (
      <>
        <TopContent>
          {menu} {this.props.leftMenu}
          {this.props.middleMenu}
          {this.props.rightMenu}
        </TopContent>
        <MenuContent style={{ overflowY: "auto" }}>
          {this.props.children}
        </MenuContent>
      </>
    );
  }
}
