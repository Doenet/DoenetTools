import React from 'react';
// import { doenetComponentBackgroundInactive } from '../../Tools/_framework/temp/theme';


export default function Card(props) {

    const labelVisible = props.label ? 'static' : 'none';
    const align = props.vertical ? 'static' : 'flex';

    var card = {
        // boxShadow: `0 4px 8px 0 ${doenetComponentBackgroundInactive}`,
        backgroundImage: `linear-gradient(to bottom left, var(--canvas), var(--canvas), var(--canvas), var(--solidLightBlue))`,
        transition: '0.3s',
        borderRadius: '5px',
        width: '190px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--canvastext)',
        border: '2px solid var(--canvastext)',
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
        alignItems:'center',
    }

    if (props.value){
        title.value = props.value;
    }
    var icon = '';
    if (props.icon){
        icon = props.icon
        // console.log(icon)
    }
    const iconVisible = props.icon ? <div style={{padding: '8px', fontSize: '20px'}}>{icon}</div> : ''

    if (props.label) {
        label.value = props.label;
    }
    if (props.alert) {
        card.borderColor = 'var(--mainRed)';
      }
      
    if (props.disabled) {
        card.borderColor = 'var(--mainGray)';
        card.color = 'var(--canvastext)';
        card.cursor = 'not-allowed';
    }
    function handleClick(e) {
        if (props.onClick) props.onClick(e);
    }

    return (
        <div style={container}>
            <p style={label}>{label.value}</p>
            <button 
                aria-labelledby={label} 
                aria-label={title.value}
                style={card}
                onClick={(e) => { handleClick(e) }}
                >
                <h4 style={title}><b>{title.value}</b></h4>
                {iconVisible}
            </button>
        </div>
    );
}