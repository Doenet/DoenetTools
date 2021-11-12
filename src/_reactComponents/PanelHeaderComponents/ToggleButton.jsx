import React, { useState } from 'react';
import { doenetMainBlue } from "./theme";
import styled, { ThemeProvider } from 'styled-components';

const Button = styled.button`
  margin: ${props => props.theme.margin};
  height: 24px;
  border-style: solid;
  border-color: ${doenetMainBlue};
  border-width: 2px;
  color: ${doenetMainBlue};
  background-color: #FFF;
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.padding};
  cursor: pointer;
  font-size: 12px;
  textAlign: center;
`

Button.defaultProps = {
  theme: {
    margin: "0px 4px 0px 4px",
    borderRadius: "5px",
    padding: '0px 10px 0px 10px',
  }
}

// const Label = styled.p`
//   font-size: 12px;
//   display: ${props => props.labelVisible};
//   margin-right: 5px;
//   margin-bottom: ${props => props.align == 'flex' ? 'none' : '2px'};
// `
// const Container = styled.div`
//   display: ${props => props.align};
//   width: auto;
//   align-items: center;
// `

export default function ToggleButton(props) {
    const [isSelected, setSelected] = useState(props.isSelected ? props.isSelected : false);
    const [labelVisible, setLabelVisible] = useState(props.label ? 'static' : 'none');
    const [align, setAlign] = useState(props.vertical ? 'static' : 'flex');
    // var color = props.alert ? '#C1292E' : `${doenetMainBlue}`;
    if (props.disabled) {
        toggleButton.color = '#e2e2e2';
        toggleButton.border = '2px solid #e2e2e2';
    }
    //Assume small
    var toggleButton = {
        value: 'Toggle Button',
      }
      if (props.disabled) {
        toggleButton.cursor = 'not-allowed';
    }
    if (props.alert) {
        toggleButton.border = '2px solid #C1292E';
        toggleButton.color = '#C1292E';
    }
      var icon = '';
    var label ={
        value: 'Label:',
        fontSize: '12px',
        display: `${labelVisible}`,
        marginRight: '5px',
        marginBottom: `${align == 'flex' ? 'none' : '2px'}`
    }
    
    var container = {
        display: `${align}`,
        width: 'auto',
        alignItems: 'center'
    }
    if (props.value || props.icon){
        if (props.value && props.icon){
            icon = props.icon;
            toggleButton.value = props.value
        }
        else if (props.value){
            toggleButton.value = props.value
        }
        else if (props.icon){
            icon = props.icon;
            toggleButton.value = ''
        }
    }
    if (isSelected === true) {
        if (!props.disabled) {
            if (!props.alert) {
                toggleButton.backgroundColor = `${doenetMainBlue}`; 
            } else {
                toggleButton.backgroundColor = '#C1292E';
            }
            toggleButton.color = '#FFF';
            toggleButton.border = '2px solid #FFF';
            if (props.switch_value) toggleButton.value = props.switch_value
        }
    }
    function handleClick() {
        if (isSelected === false) {
            setSelected(true)
        } if (isSelected === true) {
            setSelected(false)
        }
        if (props.onClick) props.onClick(isSelected);
    }
    if (props.label) {
        label.value = props.label;
    }
    if (props.width) {
        if (props.width === "menu") {
          toggleButton.width = '235px'
          if (props.label) {
            container.width = '235px';
            toggleButton.width = '100%';
          }
        } 
      }
      if (props.num === 'first') {
        toggleButton.borderRadius = '5px 0px 0px 5px'
      }
      
      if (props.num === 'last') {
        toggleButton.borderRadius = '0px 5px 5px 0px'
      }
    
      if (props.num === 'first_vert') {
        toggleButton.borderRadius = '5px 5px 0px 0px'
      }
      
      if (props.num === 'last_vert') {
        toggleButton.borderRadius = '0px 0px 5px 5px'
      }
    return (
        <>
            <div style={container}>
                <p style={label}>{label.value}</p>
                <Button id="toggleButton" style={toggleButton} onClick={() => { handleClick() }}>{icon}{' '}{toggleButton.value}</Button>
            </div>
            
        </>
    )
}