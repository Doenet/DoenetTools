import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const SearchBar = styled.input `
    margin: 0px;
    height: 24px;
    border: ${props => props.alert ? '2px solid var(--mainRed)' : 'var(--mainBorder)'};
    border-radius: var(--mainBorderRadius);
    position: relative;
    padding: 0px 70px 0px 30px;
    color: #000;
    overflow: hidden;
    width: ${props => props.width === 'menu' ? '130px' : '220px'};
    font-size: 14px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'auto'};
`;


const CancelButton = styled.button `
    float: right;
    margin: 6px 0px 0px ${props => props.cancelLeftMargin};
    // margin: '6px 0px 0px 172px',
    position: absolute;
    z-index: 2;
    border: 0px;
    background-color: #FFF;
    visibility: ${props => props.cancelShown};
    color: #000;
    overflow: hidden;
    outline: none;
`;

const SubmitButton = styled.button `
    position: absolute;
    display: inline;
    margin: 0px 0px 0px -60px;
    z-index: 2;
    height: 28px;
    border: var(--mainBorder);
    background-color: ${props => props.disabled ? 'var(--mainGray)' : 'var(--mainBlue)'};
    color: ${props => props.disabled ? 'black' : 'white'};
    border-radius: 0px 5px 5px 0px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    font-size: 12px;
    overflow: hidden;

    &:hover {
        color: black;
        background-color: ${props => props.alert ? 'var(--lightRed)' : (props.disabled ? 'var(--mainGray)' : 'var(--lightBlue)')};
    }
`;

const Label = styled.p `
    font-size: 14px;
    display: ${props => props.labelVisible}; 
    margin: 0px 5px 2px 0px;
`;

const Container = styled.div `
    display: ${props => props.align};
    width: 235px;
    align-items: center;
`;

export default function Searchbar(props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [cancelShown, setCancelShown] = useState('hidden');
    const labelVisible = props.label ? 'static' : 'none';
    const align = props.vertical ? 'static' : 'flex';
    const marginLeft = props.noSearchButton ? 80 : 26;
    const alert = props.alert ? props.alert : null;

    var searchIcon = {
        margin: '6px 0px 0px 6px',
        position: 'absolute',
        zIndex: '1',
        color: '#000',
        overflow: 'hidden'
    };

    var disable = "";
    if (props.disabled) {
        disable = "disabled";
    };

    var searchButton = 
    <SubmitButton
        disabled={disable}
        onClick={searchSubmitAction}>
        Search
    </SubmitButton>

    var width = "";
    if (props.width) {
        width = props.width;
    };

    // Get help with cancel button placement
    // console.log(this.style.getPropertyValue('width'));
    let cancelLeftMargin = parseInt(width.split("px")[0]) + marginLeft + "px";
    // console.log(cancelLeftMargin);

    if (props.noSearchButton) {
        searchButton = '';
    };

    var placeholder = "Search...";
    if (props.placeholder) {
        placeholder = props.placeholder;
    };

    var label = "";
    if (props.label) {
        label = props.label;
    };

    var ariaLabel = "";
    if (props.ariaLabel) {
        ariaLabel = props.ariaLabel;
    };

    let autoFocus = false;
    if (props.autoFocus) {
        autoFocus = true;
    };

    function clearInput() {
        setSearchTerm('');
        setCancelShown('hidden')
        if (props.onChange){
            props.onChange('');
        }
    };

    function onChange(e) {
        let val = e.target.value;
        setSearchTerm(val);
        if (val === ""){
            setCancelShown('hidden')
        } else {
            setCancelShown('visible')
        }
        if (props.onChange){
            props.onChange(val);
        }
    };

    function handleBlur(e) {
        if (props.onBlur) props.onBlur(e)
    };

    function handleKeyDown(e) {
        if (props.onKeyDown) props.onKeyDown(e)
    };

    function searchSubmitAction() {
        if (props.onSubmit){
            props.onSubmit(searchTerm);
        }
    };

    return (
        <Container align={align}>
            <Label labelVisible={labelVisible} align={align}>{label}</Label>
            <div style={{display: "table-cell"}} >
                <FontAwesomeIcon icon={faSearch} style={searchIcon}/>
                <CancelButton 
                    cancelShown={cancelShown}
                    cancelLeftMargin={cancelLeftMargin}
                    onClick={() => { clearInput() }} >
                    <FontAwesomeIcon icon={faTimes}/>
                </CancelButton>
                <SearchBar
                    id="search" 
                    type="text" 
                    width={width}
                    placeholder={placeholder} 
                    onChange={onChange}
                    onBlur={(e) => { handleBlur(e) }}
                    onKeyDownCapture={(e) => { handleKeyDown(e) }}
                    disabled={disable}
                    alert={alert}
                    value={searchTerm}
                    onKeyDown={(e)=>{if (e.key === 'Enter'){searchSubmitAction()}}}
                    autoFocus={autoFocus} 
                    ariaLabel={ariaLabel}
                />
                <div style={{padding: '3px', display:'inline'}}></div>
                {searchButton}
            </div>
        </Container>
    )
  };