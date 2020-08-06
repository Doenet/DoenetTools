import React, {useState} from "react";
import styled from "styled-components";

const OverlayWrapper = styled.div`
  visibility: hidden;
  // position: fixed;
  z-index: 1;
  left: 0;
  top: 50px;
  width: 100%;
  height: 100%;
  position:absolute;
  overflow-y: hidden;
	transition-property: all;
  transition: all 0.1s ease-in-out;
  // margin-bottom:-1000px;
	// transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  background-color:rgba(0,0,0,0.8);
`;

const OverlayContent = styled.div`
  overflow: auto;
  background-color: white;
  width: 100%;
  height: 100%;
  border-radius: 0.25em;
`;

const OverlayContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  height: 100%;
  overflow: scroll;
  margin-top: 1em;
`;

const OverlayHeader = styled.h3`
  display: inline;
  padding-top: 1em;
  margin: 1em;
`;

const OverlayClose = styled.button`
  float: right;
  border: none;
  font-weight: bold;
  font-size: 1.7em;
  padding: 0;
  position: relative;
  top: -0.25em;

`;




export default function Overlay(props) {
    return (
      <OverlayWrapper
        style={{ visibility: props.open ? 'visible': 'hidden' }}
      >
        <OverlayContent>
          <OverlayHeader>{props.header}</OverlayHeader>
          <OverlayClose onClick={() => props.onClose()} name="closeOverlay">
            &times;
          </OverlayClose>
          <OverlayContainer>{props.body}</OverlayContainer>
        </OverlayContent>
      </OverlayWrapper>
    );
  }

  function OverlayWrappingContainer(props){
    return (
      <OverlayContentContainer style={{backgroundColor:"pink", width:"100%", height:"100%"}}>
        {Overlay()}
      </OverlayContentContainer>
    )

  }