import React from 'react';
import styled from 'styled-components';
import './toollayout.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
 
  faTimes, faBars
} from "@fortawesome/free-solid-svg-icons";

const NavPanelDiv = styled.div`
width:240px;
display:flex;
height:100vh;
color:white;
background-color: #288ae9;
overflow:scroll;

`;

export default function NavPanel(props) {

  const hideNavPanel = () => {
      props.hideNavPanel(true)
  }
  return ( 
    <NavPanelDiv>
      <button  onClick={()=>{hideNavPanel()}} className="leftCloseButton circle">
              <FontAwesomeIcon
                style={{
                  alignSelf: "center",
                  fontSize: '16px'
                }}
                icon={faTimes}
              />
            </button>
      {props.children}
    </NavPanelDiv>
  )
}