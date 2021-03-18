import React, { useRef, useState } from "react";
import { useToolControlHelper } from "../imports/Tool/ToolRoot";
import Tool from "../imports/Tool/Tool";
import Button from "../imports/PanelHeaderComponents/Button";
import MenuPanel from "../imports/Tool/Panels/MenuPanel";
import {useStackId} from "../imports/Tool/ToolRoot"

// import { DateInput } from "@blueprintjs/datetime";

// import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
// import "@blueprintjs/core/lib/css/blueprint.css";
// import "./dateTime.css";

//Passes up the selected date through a onDateChange(selectedDate: Date) prop


export default function DoenetTemp(props){
//     const stackId = useStackId();
//   console.log("stackId",stackId);
  const wrapperRef = useRef(null);
  const [height,setHeight] = useState(0)
  const wheight = useRef(0)

  let tall = [];
  for (let i = 1; i < 100; i++){
      tall.push(<p key={`p${i}`}>{i}</p>)
  }
  const { openOverlay } = useToolControlHelper();

  const gotoOverlay = () =>{
 
  }
    return (<>
    <Tool>
        <headerPanel>

        </headerPanel>
        <navPanel></navPanel>
        <mainPanel>
                {/* <Button value="Overlay" callback={()=> {openOverlay({type:"editor",branchId:"branch123",title:"test"})}} /> */}
                <Button value="Overlay" callback={()=> {openOverlay({type:"overlay",branchId:"branch123",contentId:"content123",title:"test"})}} />
        </mainPanel>
        <menuPanel>

        </menuPanel>
    </Tool>
       
    </>)
}


