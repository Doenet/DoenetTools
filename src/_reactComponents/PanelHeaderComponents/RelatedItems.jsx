import { update } from "@react-spring/web";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div `
    display: ${props => props.align};
    width: auto;
    align-items: center;
`;

const Select = styled.select `
    width: ${props => props.width === "menu" ? "230px" : props.width};
    border: ${props => props.alert ? "2px solid var(--mainRed)" : "var(--mainBorder)"};
    border-radius: var(--mainBorderRadius);
    size: ${props => props.size};
    overflow: auto;
`;

const Label = styled.p `
    font-size: 14px;
    display: ${props => props.labelVisible};
    margin-right: 5px;
    margin-bottom: ${props => props.align == 'flex' ? 'none' : '2px'};
`;

export default function RelatedItems(props) {
    const labelVisible = props.label ? 'static' : 'none';
    const width = props.width ? props.width : '200px';
    const size = props.size ? props.size : 2;
    const ariaLabel = props.ariaLabel ? props.ariaLabel : null;
    const alert = props.alert ? props.alert : null;


    var align = 'flex';
    var label = '';
    if (props.label) {
        label = props.label;
        if (props.vertical) {
        align = 'static';
        }
    };

    function handleChange(e) {
        if (props.onChange) props.onChange(e);
    };

    function handleClick(e) {
        if (props.onClick) props.onClick(e) 
    };
    
    function handleBlur(e) {
        if (props.onBlur) props.onBlur(e)
    };

    function handleKeyDown(e) {
        if (props.onKeyDown) props.onKeyDown(e)
    };

    var options='';
    if (props.options) {
        options = props.options;
    }

    return (
        <Container align={align}>
            <Label labelVisible={labelVisible} align={align}>{label}</Label>
            <Select 
                width={width}
                size={size}
                onChange={(e) => { handleChange(e) }}
                onClick={(e) => { handleClick(e) }}
                onBlur={(e) => { handleBlur(e) }}
                onKeyDown={(e) => { handleKeyDown(e) }}
                aria-label={ariaLabel}
                alert={alert}
            >
                {options}
            </Select>
        </Container>
    )
}