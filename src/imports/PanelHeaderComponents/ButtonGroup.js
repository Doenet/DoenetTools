import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAlignJustify,
    faStream
} from '@fortawesome/free-solid-svg-icons';


export default function ButtonGroup(props) {
    let [currentValue, setCurrentValue] = useState();
    const handleClick = function (value) {
        setCurrentValue(value);
        props.clickCallBack(value);
    }
    return (
        <div style={{ border: '1px solid grey', width: '55px', height: '22px', borderRadius: '5px', padding: '1px', display: 'flex', alignItems: 'center' }}>
            <button style={{ backroundColor: "transperant", borderRadius: '5px', border: 'none', cursor: 'pointer', outline: 'none', width: '50%', height: '18px', backgroundColor: currentValue === props.valueOne ? '#E2E2E2' : 'white' }}>
                <FontAwesomeIcon onClick={() => { handleClick(props.valueOne) }} icon={faAlignJustify} style={{ fontSize: '15px' }} />
            </button>
            <button style={{ backroundColor: "transperant", borderRadius: '5px', border: 'none', cursor: 'pointer', outline: 'none', width: '50%', height: '18px', backgroundColor: currentValue === props.valueTwo ? '#E2E2E2' : 'white' }}>
                <FontAwesomeIcon onClick={() => { handleClick(props.valueTwo) }} icon={faStream} style={{ fontSize: '15px' }} />
            </button>
        </div>
    );
}
