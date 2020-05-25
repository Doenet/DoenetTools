import React, { Component } from "react";
import PlacementContext from "./PlacementContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleRight,
  faChevronCircleLeft,
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import './toollayout.css';
import styled from 'styled-components';

const MainContent = styled.div`
  width: 100%;
  // overflow: ${props => props.isResizing ? 'hidden' : 'auto'};
  overflow:auto;
  background-color:white;
  height:  calc(100vh - ${props => props.height});

`;

export default class ToolLayoutPanel extends Component {
  static contextType = PlacementContext;

  render() {
    let mainHeight = this.context.visibilityMenuControl.sliderVisible ? (this.context.visibilityMenuControl.headerSectionCount+1)*50 +'px' : '50px' ;

    let menu = null;
    if (this.props.menuControls) {
      menu = [...this.props.menuControls];
    }

    //Context collapse and open panels 
    const leftPanelCloseButton = () => {
      return (
        <>
          {this.context.leftCloseBtn && (
            <button className="leftCloseButton" style={{width:'25px',height:'25px', backgroundColor: '#E3E2E2', borderRadius:'20px 0 0 20px', margin:'9px 0 10px 0', float:'right'}}>
              <FontAwesomeIcon
              style={{
                // position: "absolute",
                // right: "0px",
                // color: "#e3d2d2",
                alignSelf: "center",
                fontSize:'16px'
              }}
              icon={faChevronLeft}
              onClick={this.context.leftPanelHideable}
            />
            </button>
            
          
          )}
        </>
      );
    };
    const rightPanelCloseButton = () => {
      return (
        <>
          {this.context.rightCloseBtn && (
            <button  className="rightCloseButton" style={{width:'25px',height:'25px', backgroundColor: '#E3E2E2', borderRadius:'0 20px 20px 0'}}>
              <FontAwesomeIcon
              style={{
                // position: "absolute",
                // color: "#e3d2d2",
                alignSelf: "center",
                fontSize:'16px'
              }}
              icon={faChevronRight}
              onClick={this.context.rightPanelHideable}
            />
            </button>
          )}
        </>
      );
    };
    const middleOpenLeftRightButton = () => {
      return (
        <>

          {this.context.leftOpenBtn && (
            <button style={{width:'25px',height:'25px', backgroundColor: '#E3E2E2', borderRadius:'0 20px 20px 0',margin:'10px 0 10px 0'}}
            >
              <FontAwesomeIcon
              icon={faChevronRight}
              style={{
                // position: "absolute",
                // color: "#e3d2d2",
                display: "block",
                alignSelf: "center",
                fontSize:'16px'
              }}
              onClick={this.context.leftPanelVisible}
            />
              </button>
          )}
          {this.context.rightOpenBtn && (
            <button style={{width:'25px',height:'25px', backgroundColor: '#E3E2E2', borderRadius:'20px 0 0 20px', margin:'10px 0 10px 0 ',float:'right'}}>
              <FontAwesomeIcon
              icon={faChevronLeft}
              style={{
                // position: "absolute",
                // color: "#e3d2d2",
                right: "1px",
                alignSelf: "center",
                fontSize:'16px'

              }}
              onClick={this.context.rightPanelVisible}
            />
              </button>
          )}
        </>
      );
    };
    // if (!this.context.visibilityMenuControl.hideMenu) {
    //   mainHeight = '90px';
    // }

    // if (!!this.context.visibilityMenuControl.showFooter) {
    //   mainHeight = '115px';
    // }
    // if (!!this.context.visibilityMenuControl.hideFooter) {
    //   mainHeight = '90px';
    // }
    // if (!!this.context.visibilityMenuControl.sliderVisible) {
    //   mainHeight = '215px';
    // }
    // if (this.context.visibilityMenuControl.sliderVisible) {
    //   mainHeight = '210px';
    // }
    // if (this.context.visibilityMenuControl.sliderVisible && !this.context.visibilityMenuControl.hideFooter && this.context.visibilityMenuControl.hideMenu
    // ) {
    //   mainHeight = '150px';
    // }

    return (
      <>
        {!this.context.visibilityMenuControl.hideMenu ? <div className="menucontent">
         
          {!this.context.visibilityMenuControl.hideCollapse ? this.context.position === 'left' ? leftPanelCloseButton() :
            this.context.position === 'middle' ? middleOpenLeftRightButton() :
              this.context.position === 'right' ? rightPanelCloseButton() : '' : ''}
              <div className="menuControls">
               {menu}
               </div>
        </div> : ''}
       

        <MainContent height={mainHeight} isResizing={this.context.isResizing}>
          {this.props.children}
          {this.context.visibilityMenuControl.showFooter && <div className='virtual-footer'></div>}
        </MainContent>

      </>
    );
  }
}
