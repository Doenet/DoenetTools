import React, { useState } from 'react';
import styled, { ThemeProvider, css } from "styled-components";

const Button = styled.button`
  margin: ${props => props.theme.margin};
  height: 24px;
  border-style: solid;
  border-color: black;
  border-width: 2px;
  color: black;
  background-color: #FFF;
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.padding};
  cursor: pointer;
  font-size: 12px;
`

Button.defaultProps = {
  theme: {
    margin: "0",
    borderRadius: "5px",
    padding: '0px 10px 0px 10px',
  }
}

const Label = styled.p`
  font-size: 12px;
  display: ${props => props.labelVisible};
  margin-right: 5px;
  margin-bottom: ${props => props.align == 'flex' ? 'none' : '0px'};
`
const Container = styled.div`
  display: ${props => props.align};
  width: auto;
  align-items: center;
`

export default function ActionButton(props) {
  //Assume small
  var container = {};
  var align = 'flex';
  var actionButton = {
        value: 'Action Button',
      };
  if (props.width) {
    if (props.width === "menu") {
      actionButton.width = '235px'
      if (props.label) {
        container.width = '235px';
        actionButton.width = '100%';
      }
    }
  }
  const [labelVisible, setLabelVisible] = useState(props.label ? 'static' : 'none');
  var label = '';
  if (props.label) {
    label = props.label;
    if (props.vertical){
      align = 'static';
      console.log('vertical')
    }
  }
  var icon = '';
  if (props.value || props.icon){
    if (props.value && props.icon){
        icon = props.icon;
        actionButton.value = props.value
    }
    else if (props.value){
        actionButton.value = props.value
    }
    else if (props.icon){
        icon = props.icon;
        actionButton.value = ''
    }
}
  if (props.num === 'first') {
    actionButton.borderRadius = '5px 0px 0px 5px'
  }
  if (props.num === 'last') {
    actionButton.borderRadius = '0px 5px 5px 0px'
  }
  
  if (props.alert) {
    actionButton.border = '2px solid #C1292E';
  }
  function handleClick(e) {
    if (props.onClick) props.onClick(e)
  }
    return (
        <>
            <Container style={container} align={align}>
              <Label labelVisible={labelVisible} align={align}>{label}</Label>
              <Button id="actionButton" style={actionButton} onClick={(e) => { handleClick(e) }}>{icon}{' '}{actionButton.value}</Button>
            </Container>
            
        </>
    )
}