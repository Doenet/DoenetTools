import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { animated, useSpring, useTransition, useChain } from 'react-spring';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
// import MenuItem from './menuItem.js';

const DropDown = styled.div`
    text-align:center;
    color: black;
    padding: 0px;
    font-size: 16px;
    border-radius:20px;
    position:relative;
`
const MenuController = styled.button`
    margin:0;
    background-color: #6de5ff;
    color: black;
    padding: 16px;
    font-size: 16px;
    cursor: pointer;
    display:block;
`
const DropDownContent = styled.div`
    opacity:1;
    display: ${props => props.open ? 'block' : 'none'};
    // position: fixed;
    background-color: white;
    // min-width: 200px;
    // max-width:500px;
    width:300px;
    border:1px solid #E2E2E2;
    z-index: 9999;
    color:black;
    position:${props => props.appendToBody ? 'fixed' : 'absolute'};
    left: ${props => props.position === 'right' ? 0 : 'unset'};
    right: ${props => props.position === 'left' ? 0 : 'unset'};
    top: ${props => props.position === 'right' ? '35px' : 'unset'};

`
const DropDownContentItem = styled.div`
    
    background-color: ${props => props.selected ? 'rgb(58, 172, 144)' : 'transperant'};
    color: ${props => props.selected ? 'white' : 'black'};
    
    &:hover {
        // color: ${props => props.selected ? 'white' : 'blue'};
        background-color: ${props => props.selected ? 'rgb(58, 172, 144)' : 'lightgray'};
    }
    cursor: default;
    max-width:350px;
`

const DropdownLabelLink =  styled.div`
    padding: 5px 5px;
    min-height: 40px;
    justify-content: center;
    align-items: center;
    display:flex;
        a {
            width: 190px;
            padding: 20px 0px;
            text-decoration: none !important;
            background-color: transperant;
            color: ${props => props.selected ? 'white' : 'black'};    
        }
`

const DropdownCustomOption =  styled.div`
    justify-content: center;
    align-items: center;
    display:flex;
`

const MenuDropDown = ({
    currentTool,
    showThisMenuText = "",
    options = [],
    menuBase,
    width,
    picture,
    grayTheseOut = [],
    offsetPos = 0,
    appendToBody = false,
    position = 'right',
    menuWidth,
    placeholder = "Select Value" }) => {
    const [MenuWidth, setMenuWidth] = useState(menuWidth);
    let defaultValue = !!options.length && !!showThisMenuText && options.filter(o => o.label === showThisMenuText)[0];
    if (!defaultValue) { defaultValue = []; }
    const [currentItemDisplay, setCurrentItemDisplay] = useState(defaultValue);

    let updateNumber = 0;
    const node = useRef();
    const [show, setShow] = useState(false);

    useEffect(() => {
        document.addEventListener('click', handleClick, false);
        return () => {
            document.removeEventListener('click', handleClick, false);
        };
    });

    useEffect(() => {
        setMenuWidth(node.current ? node.current.offsetWidth : 0)
    }, [node.current]);

    const handleClick = e => {
        if (node.current.contains(e.target)) {
            setShow(!show)
        } else {
            setShow(false)
        }
    }

    if (!menuBase) {
        menuBase = (
            <button
                style={{
                    color: "black",
                    margin: "0",
                    height: "20px",
                    fontSize: "14px",
                    cursor: "pointer",
                    display: "block",
                }}
            >
                {!!Object.keys(currentItemDisplay).length ? <div
                    style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100px",
                        display: "inline-block"
                    }}>
                    {currentItemDisplay.label}
                </div> : <div
                    style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100px",
                        display: "inline-block"
                    }}>
                        {placeholder}
                    </div>}
                <FontAwesomeIcon
                    icon={faChevronDown}
                    style={{
                        verticalAlign: "1px",
                        marginLeft: "5px"
                    }}
                    size={'sm'} />
            </button>)
    }


    return (
        <DropDown ref={node}>
            <div>
                {menuBase}
            </div>

            <DropDownContent open={show} appendToBody={appendToBody} position={position}>
                {options.map((o, i) =>
                    (<DropDownContentItem
                        key={i}
                        onClick={() => {
                            if (o['url']) {
                                window.location.href = o['url']
                            } else {
                                setCurrentItemDisplay(o);
                                if (o["callBackFunction"]) {
                                    o["callBackFunction"](o)
                                }
                            }
                        }}
                        selected={currentItemDisplay && currentItemDisplay.id === o['id']}>
                        <DropdownCustomOption>
                        {!!o['optionElem'] && o['optionElem']}
                        </DropdownCustomOption>
                        <DropdownLabelLink 
                        selected={currentItemDisplay && currentItemDisplay.id === o['id']}>
                            {!!o.link ? <a href={o.link}>
                        {o['label']}</a> : o['label']}
                        </DropdownLabelLink>
                    </DropDownContentItem>
                    ))}
            </DropDownContent>
        </DropDown>)
};

export default MenuDropDown;