import React, { useState } from 'react';
import { doenetComponentForegroundInactive, doenetComponentForegroundActive, doenetComponentBackgroundActive } from "./theme.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


export const bannerType = Object.freeze({
    //Color contrast with accessibility -- no text on color
    ERROR: {
      // process failed or error occurred, user must dismiss
      backgroundColor: 'rgba(193, 41, 46, 1)'
    },
    ALERT: {
      // user attetion reqired to dismiss
      backgroundColor: 'rgba(255, 230, 0, 1)'
    },
    ACTION: {
      // requires user interaction
      // backgroundColor: 'rgba()'
      backgroundColor: 'hsl(209,54%,82%)'
    },
    INFO: {
      // non-interactive information
      // backgroundColor: 'rgba(26, 90, 153,1)'
      backgroundColor: '#E2E2E2'
    },
    SUCCESS: {
      // confirm action
      backgroundColor: 'rgba(41, 193, 67,  1)'
    },
    // CONFIRMATION: {
    //   //confirm action and offer undo
    //   backgroundColor: 'rgba(26,90,153,1)'
    // },
});

export default function Banner(props) {
    const [bannerVisible, setBannerVisible] = useState('flex');
    const type = props.type ? props.type : bannerType.INFO;

    var banner = {
        padding: '10px',
        display: `${bannerVisible}`,
        alignItems: 'center',
    }

    var bannerText = {
        flexGrow: '1',
        lineHeight: '1.4',
        fontFamily: 'Open Sans',
        fontSize: '16px',
    }

    var closeButton = {
        background: 'none',
        border: '0px',
        marginLeft: '5px',
        padding: '0px',
        value: 'Label:',
        fontFamily: 'Open Sans',
        fontSize: '14px',
        cursor: 'pointer',
    }
    var container = {
        backgroundColor: `${type}`
    }
    if (props.type) {
        container.backgroundColor = type.backgroundColor
    }
    function clearBanner() {
        setBannerVisible('none');
    }

    return (
        <div>
            <div style={container} type={type}>
                <div style={banner}>
                    <div style={bannerText}>
                        <strong>Reminder:</strong> your subscription expires in 22 days. Renew to avoid account suspension.
                        Here is some more text! I am trying out this banner to see how many words I can fit.
                        Please contact the help desk if you need any assistance. They can be reached at 651-713-8393.
                    </div>
                    <button style={closeButton} onClick={() => { clearBanner() }} ><FontAwesomeIcon icon={faTimes}/></button>
                </div>
            </div>
            <div style={{padding: '5px'}}></div>
        </div>
    );
}