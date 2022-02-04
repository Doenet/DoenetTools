import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


export default function Banner(props) {
    const [bannerVisible, setBannerVisible] = useState('flex');

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
    var container = {}

    switch (props.type) {
        case 'ERROR':
            container.backgroundColor = 'rgba(193, 41, 46, 1)';
            container.color = 'white';
            closeButton.color = 'white';
            break;
        case 'ALERT':
            container.backgroundColor = '#f5ed85';
            break;
        case 'ACTION':
            container.backgroundColor = 'hsl(209,54%,82%)';
            break;
        case 'SUCCESS':
            container.backgroundColor = '#a6f19f';
            break;
        default:
            container.backgroundColor = '#E2E2E2';
            break;
    }

    function clearBanner() {
        setBannerVisible('none');
    }

    return (
        <div>
            <div style={container}> 
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