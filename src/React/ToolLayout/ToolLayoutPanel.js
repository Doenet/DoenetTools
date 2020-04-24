import React, { Component } from "react";
import styled from "styled-components";

const MenuContent = styled.div`
  display: flex;
  min-height: 40px;
`;

const MainContent = styled.div`
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
        <MenuContent>
          {menu} 
          
          {this.props.leftMenu}
          {this.props.middleMenu}
          {this.props.rightMenu}
        </MenuContent>

        <MainContent 
        style={{overflow:"scroll"}}
        >
          {this.props.children}
        </MainContent>
      </>
    );
  }
}
