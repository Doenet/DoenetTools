import React, { useState ,useRef, useEffect} from 'react';
import { doenetComponentForegroundInactive, doenetComponentForegroundActive, doenetComponentBackgroundActive } from "./theme.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import Button from './Button.jsx';


export default function Card(props) {

    const [labelVisible, setLabelVisible] = useState(props.label ? 'static' : 'none');
    const [align, setAlign] = useState(props.vertical ? 'static' : 'flex');

    var card = {
        // boxShadow: `0 4px 8px 0 ${doenetComponentForegroundInactive}`,
        backgroundImage: `linear-gradient(to bottom left, white, white, white, rgb(143, 184, 222))`,
        // backgroundColor: `${doenetComponentForegroundActive}`,
        transition: '0.3s',
        borderRadius: '5px',
        width: '190px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
        border: '2px solid black',
        cursor: 'pointer',
    }
    var title = {
        value: 'Card',
        fontSize: '24px',
        fontFamily: 'Open Sans',
        margin: '0',
    }
    var label = {
        value: 'Label:',
        fontSize: '14px',
        marginRight: '5px',
        display: `${labelVisible}`,
        margin: '0px 5px 2px 0px'
    }
    var container = {
        display: `${align}`, 
        // width: '235px',
        alignItems:'center',
    }
    // var circle = {
    //     height: '50px',
    //     width: '50px',
    //     backgroundColor: `${doenetComponentBackgroundActive}`,
    //     borderRadius: '50%',
    //     position: 'absolute',
    //     top: '40px',
    //     left: '350px'
    // }
    if (props.value){
        title.value = props.value;
    }
    var icon = '';
    if (props.icon){
        icon = props.icon
        console.log(icon)
    }
    const iconVisible = props.icon ? <div style={{padding: '8px', fontSize: '20px'}}>{icon}</div> : ''

    if (props.label) {
        label.value = props.label;
    }
    if (props.alert) {
        card.borderColor = '#C1292E';
      }
      
    if (props.disabled) {
        card.borderColor = '#e2e2e2';
        card.color = 'black';
        card.cursor = 'not-allowed';
    }
    function handleClick(e) {
        if (props.onClick) props.onClick(e);
    }

    return (
        <div style={container}>
            <p style={label}>{label.value}</p>
            <button 
                style={card}
                onClick={(e) => { handleClick(e) }}
                >
                <h4 style={title}><b>{title.value}</b></h4>
                {iconVisible}
            </button>
        </div>
    );
}