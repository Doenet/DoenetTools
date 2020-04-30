import React, { Component } from "react";
import PlacementContext from "./PlacementContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faChevronLeft,
  faChevronCircleRight,
  faChevronCircleLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";


import './toollayout.css'

export default class ToolLayoutPanel extends Component {
  static contextType = PlacementContext;

  render() {
  
    let menu = null;
    if (this.props.menuControls) {
      menu = [...this.props.menuControls];
    } 
    //Context collapse and open panels 
    const leftPanelCloseButton = () => {
      return (
        <>
          { this.context.leftCloseBtn && (
            <FontAwesomeIcon
              style={{
                position: "absolute",
                right: "0px",
                color:"grey",
                alignSelf: "center"
              }}
              icon={faChevronCircleLeft}
              onClick={this.context.leftPanelHideable}
            />
          )}
        </>
      );
    };
    const rightPanelCloseButton = () => {
      return (
        <>
          { this.context.rightCloseBtn && (
            <FontAwesomeIcon
              style={{
                position: "absolute",
                color:"grey",
                alignSelf: "center"
              }}
              icon={faChevronCircleRight}
              onClick={this.context.rightPanelHideable}
            />
          )}
        </>
      );
    };
    const middleOpenLeftRightButton = () => {
      return (
        <>
          { this.context.leftOpenBtn && (
            <FontAwesomeIcon
              icon={faChevronCircleRight}
              style={{
                position: "absolute",
                color:"grey",
                display: "block",
                alignSelf: "center"
              }}
              onClick={this.context.leftPanelVisible}
            />
          )}
          { this.context.rightOpenBtn && (
            <FontAwesomeIcon
              icon={faChevronCircleLeft}
              style={{
                position: "absolute",
                color:"grey",
                right: "1px",
                alignSelf: "center"
              }}
              onClick={this.context.rightPanelVisible}
            />
          )}
        </>
      );
    };
  
  
    return (
      <>
      <div className="menucontent">
          {menu} 
     {this.context.position ==='left'? leftPanelCloseButton():
     this.context.position ==='middle'? middleOpenLeftRightButton():
     this.context.position ==='right'? rightPanelCloseButton():''}

        </div>

        <div className="maincontent">
          {this.props.children}
        </div>
       
      </>
    );
  }
}
