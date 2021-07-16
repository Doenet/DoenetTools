import React, { useState } from 'react';
import { doenetMainBlue } from "./theme";

export default function ToggleButton(props) {
    const [isSelected, setSelected] = useState(props.isSelected ? props.isSelected : false);
    const [labelVisible, setLabelVisible] = useState(props.label ? 'static' : 'none');
    const [align, setAlign] = useState(props.vertical ? 'static' : 'flex');
    var color = props.alert ? '#C1292E' : `${doenetMainBlue}`;
    if (props.disabled) {
        color = '#e2e2e2';
    }
    //Assume small
    var toggleButton = {
        margin: '0px',
        height: '24px',
        border: `2px solid ${color}`,
        color: `${color}`,
        backgroundColor: '#FFF',
        borderRadius: '5px',
        value: 'Toggle Button',
        padding: '0px 10px 0px 10px',
        cursor: 'pointer',
        fontSize: '12px',
        textAlign: 'center',
        width: 'auto'
      }
      if (props.disabled) {
        toggleButton.cursor = 'not-allowed';
    }
      var icon = '';
    var label ={
        value: 'Label:',
        fontSize: '12px',
        display: `${labelVisible}`,
        marginRight: '5px',
        marginBottom: `${align == 'flex' ? 'none' : '0px'}`
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
        toggleButton.backgroundColor = `${color}`;
        toggleButton.color = '#FFF';
        toggleButton.border = '2px solid #FFF';
        if (props.switch_value) toggleButton.value = props.switch_value
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
    return (
        <>
            <div style={container}>
                <p style={label}>{label.value}</p>
                <button id="toggleButton" style={toggleButton} onClick={() => { handleClick() }}>{icon}{' '}{toggleButton.value}</button>
            </div>
            
        </>
    )
}