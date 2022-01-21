import React, { useState ,useRef, useEffect} from 'react';
import { doenetComponentForegroundInactive, doenetComponentForegroundActive } from "./theme.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';


export default function Card(props) {
    var card = {
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        width: '400px',
        height: '200px'
    }
    var container = {
        padding: '2px 16px',
    }
    var title = {
        fontSize: '20px',
        fontFamily:"Open Sans",
        textAlign: 'center'
    }

    return (
        <div style={card}>
            <div style={container}>
                <h4 style={title}><b>Enrollment</b></h4>
            </div>
        </div>
    );
}