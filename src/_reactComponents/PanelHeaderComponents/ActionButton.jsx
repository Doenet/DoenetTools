import React, { useState } from 'react';
import styled, { ThemeProvider, css } from "styled-components";

const Button = styled.button`
  margin: ${props => props.theme.margin};
  height: 24px;
  /* border-style: solid;
  border-color: black;
  border-width: 2px; */
  border: ${props => props.theme.border};
  /* color: black; */
  color: white;
  /* background-color: #FFF; */
  background-color: ${props => props.alert ? 'var(--mainRed)' : 'var(--mainBlue)'};
  /* border: 0.25px solid white; */
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.padding};
  cursor: pointer;
  font-size: 12px;

  &:hover {
    color: black;
    /* background-color: var(--lightBlue); */
    background-color: ${props => props.alert ? '#eab8b8' : 'var(--lightBlue)'};
  };
`

Button.defaultProps = {
  theme: {
    margin: '0px 4px 0px 4px',
    borderRadius: '5px',
    padding: '0px 10px 0px 10px',
    border: 'none'
  }
}

const Label = styled.p`
  font-size: 14px;
  display: ${props => props.labelVisible};
  margin-right: 5px;
  margin-left: 4px;
  margin-bottom: ${props => props.align == 'flex' ? 'none' : '2px'};
`
const Container = styled.div`
  display: ${props => props.align};
  width: auto;
  align-items: center;
`

export default function ActionButton(props) {
  const alert = props.alert ? props.alert : null;
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
  const labelVisible = props.label ? 'static' : 'none';
  var label = '';
  if (props.label) {
    label = props.label;
    if (props.vertical){
      align = 'static';
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

  if (props.num === 'first_vert') {
    actionButton.borderRadius = '5px 5px 0px 0px'
  }
  
  if (props.num === 'last_vert') {
    actionButton.borderRadius = '0px 0px 5px 5px'
  }

  if (props.disabled) {
    // actionButton.border = '2px solid #e2e2e2';
    actionButton.backgroundColor = '#e2e2e2';
    actionButton.color = 'black';
    actionButton.cursor = 'not-allowed';
  }
  function handleClick(e) {
    if (props.onClick) props.onClick(e)
  }
    return (
        <>
            <Container style={container} align={align}>
              <Label labelVisible={labelVisible} align={align}>{label}</Label>
              <Button id="actionButton" style={actionButton} alert={alert} onClick={(e) => { handleClick(e) }}>{icon}{' '}{actionButton.value}</Button>
            </Container>
            
        </>
    )
}