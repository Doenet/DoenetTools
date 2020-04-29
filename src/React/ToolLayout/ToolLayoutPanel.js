import React, { Component } from "react";

import './toollayout.css'

export default class ToolLayoutPanel extends Component {
  render() {
    let menu = null;
    if (this.props.menuControls) {
      menu = [...this.props.menuControls];
    }
    return (
      <>
      <div className="menucontent">
          {menu} 
          
          {this.props.leftMenu}
          {this.props.middleMenu}
          {this.props.rightMenu}
        </div>

        <div className="maincontent">
          {this.props.children}
        </div>
       
      </>
    );
  }
}
