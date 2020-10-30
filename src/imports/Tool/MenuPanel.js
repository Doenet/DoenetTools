import React from 'react';
import styled from 'styled-components';

const MenuPanelDiv = styled.div`
width:240px;
`;


export default function MenuPanel(props) {
  return (
    <MenuPanelDiv>
      {props.children}
    </MenuPanelDiv>
  )
}