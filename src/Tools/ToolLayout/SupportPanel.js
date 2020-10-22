import React from 'react';
import styled from 'styled-components';

const SupportPanelDiv = styled.div`
backgroundColor:skyblue`;

export default function SupportPanel(props) {
  return (
    <SupportPanelDiv>
      {props.responsiveControls ? <div style={{height: "50px", borderBottom: "1px solid black"}}></div> : "" }
      {props.children}
    </SupportPanelDiv>
  )
}