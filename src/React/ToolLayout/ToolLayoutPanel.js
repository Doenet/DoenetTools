import React, { Component } from "react";
import PlacementContext from "./PlacementContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import './toollayout.css';
import styled from 'styled-components';
import useResize from '../ToolLayout/Hooks/useResize';

// import { useState, useRef, useEffect } from 'react'
// import ResizeObserver from 'resize-observer-polyfill'

// export default function useMeasure() {
//   const ref = useRef()
//   const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 })
//   const [ro] = useState(() => new ResizeObserver(([entry]) => set(entry.contentRect)))
//   useEffect(() => {
//     if (ref.current) ro.observe(ref.current)
//     return () => ro.disconnect()
//   }, [])
//   return [{ ref }, bounds]
// }


const MainContent = styled.div`
  width: 100%;
  overflow:auto;
  background-color:white;
  height:  calc(100vh - ${props => props.height});

`;

export default class ToolLayoutPanel extends Component {
  static contextType = PlacementContext;

  render() {
    let mainHeight = this.context.panelHeadersControlVisible.sliderVisible ? (this.context.panelHeadersControlVisible.headerSectionCount+1)*50 +'px' : '50px' ;

    let panelHeader = null;
    if (this.props.panelHeaderControls) {
      panelHeader = [...this.props.panelHeaderControls];
    }

    //Context collapse and open panels 
    const leftPanelCloseButton = () => {
      return (
        <>
          {this.context.leftCloseBtn && (
            <button onClick={this.context.leftPanelHideable} className="leftCloseButton" style={{width:'25px',height:'25px', backgroundColor: '#E3E2E2', borderRadius:'20px 0 0 20px', margin:'9px 0 10px 0', float:'right'}}>
              <FontAwesomeIcon
              style={{
                // position: "absolute",
                // right: "0px",
                // color: "#e3d2d2",
                alignSelf: "center",
                fontSize:'16px'
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
            <button   onClick={this.context.rightPanelHideable} className="rightCloseButton" style={{width:'25px',height:'25px', backgroundColor: '#E3E2E2', borderRadius:'0 20px 20px 0'}}>
              <FontAwesomeIcon
              style={{
                // position: "absolute",
                // color: "#e3d2d2",
                alignSelf: "center",
                fontSize:'16px'
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

          {(this.context.leftOpenBtn) && (
          //  {/* {(this.context.leftOpenBtn||this.context.leftWidth) && ( */}

            <button onClick={this.context.leftPanelVisible} className="middleLeftButton" style={{width:'25px',height:'25px', backgroundColor: '#E3E2E2', borderRadius:'0 20px 20px 0',margin:'10px 0 10px 0'}}
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
              
            />
              </button>
          )}
          {this.context.rightOpenBtn && (
            <button  onClick={this.context.rightPanelVisible} className="middleRightButton" style={{width:'25px',height:'25px', backgroundColor: '#E3E2E2', borderRadius:'20px 0 0 20px', margin:'10px 0 10px 0 ',float:'right'}}>
              <FontAwesomeIcon
              icon={faChevronLeft}
              style={{
                // position: "absolute",
                // color: "#e3d2d2",
                // right: "1px",
                alignSelf: "center",
                fontSize:'16px'

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
               {panelHeader}
               {/* panelHeaderWidth: {panelHeaderWidth} */}
               </div>
        </div> : ''}
       

        <MainContent height={mainHeight} isResizing={this.context.isResizing}>
          {this.props.children}
          {this.context.panelHeadersControlVisible.showFooter && <div className='virtual-footer'></div>}
        </MainContent>

      </>
    );
  }
}
