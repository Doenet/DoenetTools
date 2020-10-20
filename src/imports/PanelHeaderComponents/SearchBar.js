import React from 'react';
import { doenetComponentForegroundInactive } from "./theme.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import Button from "./Button.js";

export default function Searchbar() {
    var searchBar = {
        margin: '0px',
        height: '40px',
        border: `2px solid ${doenetComponentForegroundInactive}`,
        borderRadius: '5px',
        position: 'relative',
        padding: '0px 30px 0px 30px',
        color: '#000'
       }
    var searchIcon = {
        margin: '15px 0px 0px 10px',
        position: 'absolute',
        zIndex: '1',
        color: '#000'
    }
    var cancelButton = {
        float: 'right',
        margin: '15px 0px 0px 172px',
        position: 'absolute',
        zIndex: '2',
        border: '0px',
        backgroundColor: "#FFF",
        visibility: 'visible',
        color: '#000'
    }
    function handleClick() {
        document.getElementById('search').value = '';
    }
    return (
        <div style={{display: "inline"}}>
            <FontAwesomeIcon icon={faSearch} style={searchIcon}/>
            <button style={cancelButton} onClick={() => { handleClick() }} ><FontAwesomeIcon icon={faTimes}/></button>
            <input id="search" type="text" defaultValue="Search..." style={searchBar} onKeyUp={() => { console.log(value) }}/>
            <div style={{padding: '3px', display:'inline'}}></div>
            <Button style={{display: 'inline', borderRadius: '5px'}} text="Submit"/>
        </div>
    )
  }