import React, { useState } from 'react';
import styled from "styled-components";
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const TooltipStyling = styled.button`
    border-radius: 16px;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--canvas);
    color: var(--canvastext);
    border: 2px solid var(--canvastext);
    cursor: pointer;
    &:focus {
        outline: 2px solid var(--mainGray);
        color: var(--mainGray);
        border: 2px solid var(--mainGray);
        outline-offset: 2px;
    }

    &:hover {
        color: var(--mainGray);
        border: 2px solid var(--mainGray);
    }
`

const ContainerStyling = styled.button`
    border-radius: 5px;
    border: none;
    padding: 5px;
    margin-top: 5px;
    margin-left: -5px;
    z-index: 2;
    width: 240px;
    background-color: var(--mainGray);
    color: var(--canvastext);
    cursor: pointer;
    display: ${(props) => props.isVisible};
`

export default function Tooltip(props) {
    const [isVisible, setVisible] = useState('none');

    var icon = <b>i</b>;
    if (props.icon){
        icon = props.icon
    }
    const iconVisible = <div style={{fontSize: '10px'}}>{icon}</div>

    var text = "You’ve found a tooltip where we haven’t given you any additional information. Yikes! If you’re super nice, you can contact us and let us know. Otherwise, let’s just pretend like this never happened...";
    if (props.text){
        text = props.text
    }

    function handleClick(e) {
        if (props.onClick) props.onClick(e);
        setVisible('flex');
    }

    function handleFocus(e) {
        if (props.onFocus) props.onFocus(e);
        setVisible('flex');
    }

    function handleBlur(e) {
        if (props.onBlur) props.onBlur(e);
        setVisible('none');
    }

    function handleKeyDown(e) {
        if (props.onKeyDown) props.onKeyDown(e);
        if (e.key == 'Escape') setVisible('none');
    }

    return (
        <>
            <TooltipStyling 
                role="tooltip"
                onClick={(e) => { handleClick(e) }}
                onFocus={(e) => { handleFocus(e) }}
                onBlur={(e) => { handleBlur(e) }}
                onKeyDown={(e) => { handleKeyDown(e) }}
            >
                {iconVisible}
            </TooltipStyling>
            <ContainerStyling isVisible={isVisible} tabIndex="-1">
                {text}
            </ContainerStyling>
        </>
        
    );
}