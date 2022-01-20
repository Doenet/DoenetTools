import React, { useState ,useRef, useEffect} from 'react';
import { doenetComponentForegroundInactive, doenetComponentForegroundActive } from "./theme.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';


export default function Card(props) {
    

    return (
        <div class="card">
            <div class="container">
                <h4><b>John Doe</b></h4>
                <p>Architect &#38; Engineer</p>
            </div>
        </div>
    );
}