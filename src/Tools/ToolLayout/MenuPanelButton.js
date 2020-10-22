import React from "react";

export default function MenuPanelButton(props) {
    return(
        <div style={{height: "50px",width: "100%", borderRight: "1px solid black"}}>
           <button onClick={props.buttonClick}>{props.buttonText}</button>
        </div>
        
    )
}