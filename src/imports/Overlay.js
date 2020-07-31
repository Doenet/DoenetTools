import React, {useState} from "react";
import styled from "styled-components";

const Modal = styled.div`
  visibility: hidden;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.3);
`;

const ModalContent = styled.div`
  overflow: auto;
  background-color: white;
  width: 1000px;
  margin: 5% auto;
  border-radius: 0.25em;
  padding: 1em;
`;

const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  max-height: 30em;
  overflow: scroll;
  margin-top: 1em;
`;

const ModalHeader = styled.h3`
  display: inline;
  padding-top: 1em;
  margin: 1em;
`;

const ModalClose = styled.button`
  float: right;
  border: none;
  font-weight: bold;
  font-size: 1.7em;
  padding: 0;
  position: relative;
  top: -0.25em;
`;

const ModalPic = styled.button`
  width: 10em;
  height: 10em;
  flex-shrink: 0;
  flex-grow: 0;
  margin: 1em;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(0, 0, 0, 0);
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url("${props => props.pic}");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-style: none;
  user-select: none;
  &:hover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
      url("${props => props.pic}");
    color: rgba(255, 255, 255, 1);
  }
`;


export default function Overlay(props) {
    return (
      <Modal
        style={{ visibility: props.open ? 'visible': 'hidden' }}
      >
        <ModalContent>
          <ModalHeader>{props.header}</ModalHeader>
          <ModalClose onClick={() => props.onClose()} name="closeProfilePictureModal">
            &times;
          </ModalClose>
          <ModalContainer>{props.body}</ModalContainer>
        </ModalContent>
      </Modal>
    );
  }