import React, { useRef, useState } from "react";

// import { DateInput } from "@blueprintjs/datetime";

// import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
// import "@blueprintjs/core/lib/css/blueprint.css";
// import "./dateTime.css";

//Passes up the selected date through a onDateChange(selectedDate: Date) prop


export default function DoenetTemp(props){
  const wrapperRef = useRef(null);
  const [height,setHeight] = useState(0)
  const wheight = useRef(0)

  let tall = [];
  for (let i = 1; i < 100; i++){
      tall.push(<p key={`p${i}`}>{i}</p>)
  }

    return (<>
    <div style={{position:"sticky",top:"0px"}}>
    <button
    onClick={()=>{
        console.log("Sample")
        let top = document.documentElement.scrollTop;
        let left = document.documentElement.scrollLeft;
        setHeight(top)
        console.log(`Top ${top}`)
    }}>sample height</button>
       <button
    onClick={()=>{
        window.scrollTo(0,height)
    }}>return to sampled height</button>
     <button
    onClick={()=>{
        console.log("Wrapper")
        let ref = wrapperRef.current;
        let top = ref.scrollTop;
        console.log(wrapperRef.current.scrollTop)
        console.log(100)
        ref.scrollTo(0,100)

        // let left = document.documentElement.scrollLeft;
        // setHeight(top)
        console.log(`Top ${top}`)
    }}>sample wrapper</button>
    </div>
        <div ref={wrapperRef}>
            {tall}
        </div>
        </>
       
    )
}


