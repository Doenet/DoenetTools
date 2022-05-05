// import { update } from "@react-spring/web";
import React from "react";
import styled from "styled-components";

const Container = styled.div `
    display: ${props => props.align};
    width: auto;
    align-items: center;
`;

const Select = styled.select `
    width: ${props => props.width === "menu" ? "230px" : props.width};
    /* background-color: var(--lightBlue); */
    border: ${props => props.alert ? "2px solid var(--mainRed)" : props.disabled ? "2px solid var(--mainGray)" : "var(--mainBorder)"};
    border-radius: var(--mainBorderRadius);
    size: ${props => props.size};
    overflow: auto;
    cursor: ${props => props.disabled ? "not-allowed" : "auto"};
`;

const Option = styled.option `
    key: ${props => props.key};
    value: ${props => props.value};
    selected: ${props => props.selected};

    &:focus {
        background-color: var(--lightBlue);
    }
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
    const size = props.size ? props.size : 4;
    const ariaLabel = props.ariaLabel ? props.ariaLabel : null;
    const alert = props.alert ? props.alert : null;
    const disabled = props.disabled ? props.disabled : null;

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
                disabled={disabled}
                multiple={props.multiple}
            >
                {options}
            </Select>
        </Container>
    )
}