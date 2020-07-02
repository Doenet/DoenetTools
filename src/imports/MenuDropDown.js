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
const Icon = styled.div`
font-size:19px;
padding:15px;
    // display: flex;
    // flex-direction: row;
    // font-size: 13px;
    // text-align: center;
    // width: 250px;
    // border-radius: 4px;
    // cursor: pointer;
    // background-color: none;
    // padding: 7px 5px;
    // padding-left:55px;
    // color:#333333;
    // text-transform: none;
    // font-weight: 700;
    // border: 0.5px solid;
    // border-color: #333333;
    // transition: 300ms;
    // margin: 0px 10px;
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
    min-width: 200px;
    border:1px solid #E2E2E2;
    z-index: 9999;
    color:black;
    position:${props => props.appendToBody ? 'fixed' : 'absolute'};
    left: ${props => props.position === 'right' ? 0 : 'unset'};
    right: ${props => props.position === 'left' ? 0 : 'unset'};
`
const DropDownContentItem = styled.div`
    padding: 5px 5px;
    background-color: ${props => props.selected ? 'rgb(58, 172, 144)' : 'transperant'};
    color: ${props => props.selected ? 'white' : 'black'};
    justify-content: center;
    min-height: 40px;
    align-items: center;
    display:flex;
    &:hover {
        // color: ${props => props.selected ? 'white' : 'blue'};
        background-color: ${props => props.selected ? 'rgb(58, 172, 144)' : 'lightgray'};
    }
    cursor: default;
    max-width:250px;
 
    a {
        width: 190px;
        padding: 20px 0px;
        text-decoration: none !important;
        background-color: transperant;
        color: ${props => props.selected ? 'white' : 'black'};    
    }
`
const ProfilePicture = styled.button`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url("/profile_pictures/${props => props.pic}.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  transition: 300ms;
  color: #333333;
  width:40px;
  height:40px;
  display: inline;
  color: rgba(0, 0, 0, 0);
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border-style:none;
  
`;

const MenuDropDown = ({
    currentTool,
    showThisMenuText = "",
    options = [],
    menuIcon,
    width,
    picture,
    grayTheseOut = [],
    offsetPos = 0,
    appendToBody = false,
    position = 'right',
    menuWidth,
    placeholder = "Select Value" }) => {
    const [MenuWidth, setMenuWidth] = useState(menuWidth);
    let defaultValue = !!options.length && !!showThisMenuText && options.filter(o => o.id === showThisMenuText)[0];
    if (!defaultValue){ defaultValue = [];}
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


    let menuBase = (
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

    if (menuIcon) {
        menuBase = <Icon>
            <FontAwesomeIcon icon={menuIcon} size={'lg'} />
        </Icon>
    } else if (picture) {

        menuBase = <ProfilePicture
            pic={picture}
            name="changeProfilePicture"
            id="changeProfilePicture"
        >
        </ProfilePicture>

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
                        {!!o.link ? <a href={o.link}>
                            {o['label']}</a> : o['label']}
                    </DropDownContentItem>
                    ))}
            </DropDownContent>
        </DropDown>)
};

export default MenuDropDown;