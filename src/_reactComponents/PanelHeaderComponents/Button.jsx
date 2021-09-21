import React, { useState } from 'react';
import { doenetComponentForegroundActive } from "./theme";
import styled, { ThemeProvider, css } from "styled-components";

const ButtonStyling = styled.button`
  margin: ${props => props.theme.margin};
  height: 24px;
  border-style: hidden;
  // border-color: black;
  // border-width: 2px;
  color: white;
  background-color: #1a5a99;
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.padding};
  cursor: pointer;
  font-size: 12px;
  border-radius: 20px;
 ;
`

ButtonStyling.defaultProps = {
  theme: {
    margin: "0px 4px 0px 4px",
    borderRadius: "5px",
    padding: '0px 10px 0px 10px'
  }
}

const Label = styled.p`
  font-size: 12px;
  display: ${props => props.labelVisible};
  margin-right: 5px;
  margin-bottom: ${props => props.align == 'flex' ? 'none' : '2px'};
`
const Container = styled.div`
  display: ${props => props.align};
  width: auto;
  align-items: center;
`

export default function Button(props) {
  //Assume small
  var container = {};
  var align = 'flex';
  var button = {
    value: 'Button',
  };
  // var button = {
  //       margin: '0px',
  //       height: '24px',
  //       border: `hidden`,
  //       backgroundColor: `${doenetComponentForegroundActive}`,
  //       fontFamily: 'Arial',
  //       color: '#FFFFFF',
  //       borderRadius: '20px',
  //       value: 'Button',
  //       padding: '0px 10px 0px 10px',
  //       cursor: 'pointer',
  //       fontSize: '12px'
  //     };
  if (props.width) {
    if (props.width === "menu") {
      button.width = '235px';
      if (props.label) {
        container.width = '235px';
        button.width = '100%';
      }
    } 
  }
  const [labelVisible, setLabelVisible] = useState(props.label ? 'static' : 'none');
  var label = '';
  if (props.label) {
    label = props.label;
    if (props.vertical) {
      align = 'static';
    }
  }
  var icon = '';
  if (props.value || props.icon){
    if (props.value && props.icon){
        icon = props.icon;
        button.value = props.value
    }
    else if (props.value){
        button.value = props.value
    }
    else if (props.icon){
        icon = props.icon;
        button.value = ''
    }
}

if (props.alert) {
  button.backgroundColor = '#C1292E'
}

if (props.disabled) {
  button.backgroundColor = '#e2e2e2';
  button.color = 'black';
  button.cursor = 'not-allowed';
}
  // if (props.value) {
  //     button.value = props.value;
  // };
  function handleClick(e) {
    if (props.onClick) props.onClick(e)
  }
    return (
        <>
            <Container style={container} align={align}>
              <Label labelVisible={labelVisible} align={align}>{label}</Label>
              <ButtonStyling style={button} {...props} onClick={(e) => { handleClick(e) }}>{icon}{' '}{button.value}</ButtonStyling>
            </Container>
        </>
    )
}