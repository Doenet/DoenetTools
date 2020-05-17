import React, { Component } from "react";
import PlacementContext from "./PlacementContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleRight,
  faChevronCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import './toollayout.css';
import styled from 'styled-components';

const MainContent = styled.div`
  width: 100%;
  overflow: auto;
  height:  calc(100vh - ${props => props.height});
`;

export default class ToolLayoutPanel extends Component {
  static contextType = PlacementContext;

  render() {

    let menu = null;
    let mainHeight = '50px';
    if (this.props.menuControls) {
      menu = [...this.props.menuControls];
    }

    //Context collapse and open panels 
    const leftPanelCloseButton = () => {
      return (
        <>
          {this.context.leftCloseBtn && (
            <FontAwesomeIcon
              style={{
                position: "absolute",
                right: "0px",
                color: "grey",
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
          {this.context.rightCloseBtn && (
            <FontAwesomeIcon
              style={{
                position: "absolute",
                color: "grey",
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
          {this.context.leftOpenBtn && (
            <FontAwesomeIcon
              icon={faChevronCircleRight}
              style={{
                position: "absolute",
                color: "grey",
                display: "block",
                alignSelf: "center"
              }}
              onClick={this.context.leftPanelVisible}
            />
          )}
          {this.context.rightOpenBtn && (
            <FontAwesomeIcon
              icon={faChevronCircleLeft}
              style={{
                position: "absolute",
                color: "grey",
                right: "1px",
                alignSelf: "center"
              }}
              onClick={this.context.rightPanelVisible}
            />
          )}
        </>
      );
    };
    if (!this.context.visibilityMenuControl.hideMenu) {
      mainHeight = '90px';
    }

    if (!!this.context.visibilityMenuControl.showFooter) {
      mainHeight = '115px';
    }
    if (!!this.context.visibilityMenuControl.hideFooter) {
      mainHeight = '90px';
    }
    if (!!this.context.visibilityMenuControl.sliderVisible) {
      mainHeight = '215px';
    }
    if (this.context.visibilityMenuControl.sliderVisible) {
      mainHeight = '210px';
    }
    if (this.context.visibilityMenuControl.sliderVisible && !this.context.visibilityMenuControl.hideFooter && this.context.visibilityMenuControl.hideMenu
    ) {
      mainHeight = '150px';
    }

    return (
      <>
        {!this.context.visibilityMenuControl.hideMenu ? <div className="menucontent">
          {menu}
          {!this.context.visibilityMenuControl.hideCollapse ? this.context.position === 'left' ? leftPanelCloseButton() :
            this.context.position === 'middle' ? middleOpenLeftRightButton() :
              this.context.position === 'right' ? rightPanelCloseButton() : '' : ''}
        </div> : ''}

        <MainContent height={mainHeight}>
          {this.props.children}
        </MainContent>

      </>
    );
  }
}
