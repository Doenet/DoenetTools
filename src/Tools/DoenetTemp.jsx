import React, { useRef, useState } from "react";

// import { DateInput } from "@blueprintjs/datetime";

// import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
// import "@blueprintjs/core/lib/css/blueprint.css";
// import "./dateTime.css";

//Passes up the selected date through a onDateChange(selectedDate: Date) prop


export default function DoenetTemp(props){
  const wrapperRef = useRef(null);
  const [height,setHeight] = useState(0)
  const wrapheight = useRef(0)
  const maxheight = useRef(0)

  let tall = [];
  for (let i = 1; i < 100; i++){
      tall.push(<p key={`p${i}`}>{i}</p>)
  }

    return (<>
    <div style={{position:"sticky",top:"0px"}}>
    <button
    onClick={()=>{
        // console.log("Sample")
        // let top = document.documentElement.scrollTop;
        // let left = document.documentElement.scrollLeft;
        // setHeight(top)
        wrapperRef.current.scrollTo(0,maxheight.current);
        console.log(`maxheight.current ${maxheight.current}`)
    }}>return to max</button>
    
    </div>
        <div
        style={{height:'500px',overflow: 'scroll'}}
         ref={wrapperRef} 
         onScroll={()=>{
            wrapheight.current = wrapperRef.current.scrollTop;
            if (maxheight.current < wrapheight.current){maxheight.current = wrapheight.current}
            //  console.log(">>>scrolling",wrapperRef.current.scrollTop)}
            }}
        //  onScroll={()=>{console.log(">>>scrolling",wrapperRef.current.scrollTop.scrollY)}}
        >
            {tall}
        </div>
        </>
       
    )
}


