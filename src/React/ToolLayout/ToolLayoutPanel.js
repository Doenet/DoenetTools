import React, { Component } from "react";
import PlacementContext from './PlacementContext';
import SplitPanelContext from './SplitPanelContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import './toollayout.css';
import styled from 'styled-components';
const MainContent = styled.div`
  width: 100%;
  overflow:auto;
  background-color:white;
  height:  calc(100vh - ${props => props.height});
  flex-direction: row;
  display: flex;
`;

export default class ToolLayoutPanel extends Component {
  static contextType = PlacementContext;

  render() {
    let mainHeight = this.context.panelHeadersControlVisible.sliderVisible ? (this.context.panelHeadersControlVisible.headerSectionCount + 1) * 50 + 'px' : '50px';

    let panelHeader = null;
    if (this.props.panelHeaderControls) {
      panelHeader = [...this.props.panelHeaderControls];
      // console.log(panelHeader);
      // console.log(this.props.panelHeaderControls);
    }

    //Context collapse and open panels 
    const leftPanelCloseButton = () => {
      return (
        <>
          {this.context.leftCloseBtn && (
            <button onClick={this.context.leftPanelHideable} className="leftCloseButton custom">
              <FontAwesomeIcon
                style={{
                  alignSelf: "center",
                  fontSize: '16px'
                }}
                icon={faChevronLeft}
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
            <button onClick={this.context.rightPanelHideable} className="rightCloseButton custom" >
              <FontAwesomeIcon
                style={{
                  alignSelf: "center",
                  fontSize: '16px'
                }}
                icon={faChevronRight}
              />
            </button>
          )}
        </>
      );
    };
    const middleOpenLeftRightButton = () => {
      return (
        <>
          {(this.context.leftOpenBtn) && !this.context.guestUser && (
            <button onClick={this.context.leftPanelVisible} className="middleLeftButton custom"
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                style={{
                  display: "block",
                  alignSelf: "center",
                  fontSize: '16px'
                }}
              />
            </button>
          )}
          {this.context.rightOpenBtn && (
            <button onClick={this.context.rightPanelVisible} className="middleRightButton custom" >
              <FontAwesomeIcon
                icon={faChevronLeft}
                style={{
                  alignSelf: "center",
                  fontSize: '16px'
                }}
              />
            </button>
          )}
        </>
      );
    };

    return (
      <>
        {!this.context.panelHeadersControlVisible.hideMenu ? <div className="panels-header-content">
          {!this.context.panelHeadersControlVisible.hideCollapse ? this.context.position === 'left' ? leftPanelCloseButton() :
            this.context.position === 'middle' ? middleOpenLeftRightButton() :
              this.context.position === 'right' ? rightPanelCloseButton() : '' : ''}
          <div className="panels-header-controls">
            {this.props.panelHeaderControls && this.props.panelHeaderControls.map((p,i)=> 
              (<div className="xyz" key={i}>{p}</div>)
            )}
            {/* {panelHeader} */}
          </div>
        </div> : ''}

        <MainContent height={mainHeight} isResizing={this.context.isResizing}>
          <SplitPanelContext.Provider value={{ splitPanel: this.props.splitPanel, name: "channel" }}>{this.props.children}</SplitPanelContext.Provider>
          {/* {this.props.children} */}
          {this.context.panelHeadersControlVisible.showFooter && <div className='tool-footer'></div>}
        </MainContent>

      </>
    );
  }
}
