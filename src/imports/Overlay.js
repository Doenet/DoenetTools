import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle }
  from '@fortawesome/free-solid-svg-icons';

const OverlayWrapper = styled.div`
  z-index: 6;
  left: 0;
  width: 100%;
  height: 100%;
  position:absolute;
  overflow-y: hidden;
	transition-property: all;
  transition: all .2s ease-in-out;
  &.on {
    margin-top: 0%;
  }
   
  &.off {
    margin-top: 100%;
  }
  @media (max-width: 768px){
    z-index: 6;
    left: 0;
    width: 100%;
    height: 100%;
    position:absolute;
    overflow-y: hidden;
    transition-property: all;
    transition: all .2s ease-in-out;
    &.on {
      margin-top: 0%;
    }
     
    &.off {
      margin-top: 400%;
    }
  }
`;
const OverlayContent = styled.div`
  width: 100%;
  height: 100%;
`;
const OverlayHeaderWrapper = styled.div`
  display: flex;
  background-color: #288ae9;

`;
const OverlayContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  height: calc(100vh + 10px);
  overflow: scroll;
  background-color:white;
`;

const OverlayName = styled.span`
  display: inline-flex;
  font-size:20px;
  font-weight: 700;
  margin: 10px 0 10px 10px;
  align-items: flex-start;
  padding-left: 5px;
  width: 33%;
  color:white;
`;

const OverlayHeader = styled.span`
  display: inline-flex;
  font-size:20px;
  font-weight: 700;

  width: 33%;
  align-items: center;
  justify-content: center;
  color:white;

`;

const OverlayClose = styled.div`
  display: inline-flex;
  align-items: flex-end;
  border: none;
  transition: all 0.1s ease-in-out;
  width: 33%;
`;




export default function Overlay(props) {
  return (
    <OverlayWrapper
      className={props.open ? 'on' : 'off'}
    >
      <OverlayContent>
        <OverlayHeaderWrapper>
          <OverlayName>{props.name}</OverlayName>
          <OverlayHeader>{props.header}</OverlayHeader>
          <OverlayClose onClick={() => props.onClose()} name="closeOverlay">
            <FontAwesomeIcon icon={faTimesCircle} style={{ "fontSize": "21px", "color": "white", "position": "absolute", "top": "5px", "right": "5px" }}></FontAwesomeIcon>
          </OverlayClose>
        </OverlayHeaderWrapper>

        <OverlayContainer>{props.body}</OverlayContainer>
      </OverlayContent>
    </OverlayWrapper>
  );
}

function OverlayWrappingContainer(props) {
  return (
    <OverlayContentContainer style={{ backgroundColor: "pink", width: "100%", height: "100%" }}>
      {Overlay()}
    </OverlayContentContainer>
  )

}