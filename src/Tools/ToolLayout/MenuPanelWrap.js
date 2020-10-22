import React from 'react';


export default function MenuPanelWrap(props) {
    return (
        <div style={{width: "240px", height: "100vh", display: "flex"}}>
            <div style={{height: "50px",width: "100%", borderBottom: "1px solid black"}}>
                {/* Title / Edit */}
            </div>
            <div>
                {props.children}
            </div>
        </div>
    )
}