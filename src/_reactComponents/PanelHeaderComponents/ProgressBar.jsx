import React, {useState} from "react";
import styled from "styled-components";
// import "./ProgressBar.css"

const Container = styled.div ``;
const Svg = styled.svg``;
const Rect = styled.rect`
  x: 0px;
  y: 0px;
  rx: 5px;
  /* fill: #E2E2E2; */
  stroke: none;
  stroke-width: 0;
  /* width: 1000px; */
  height: 10px;
`;
const G = styled.g``;
const Circle = styled.circle`
  cy: 12.5px;
`;
const Input = styled.input``;
const Button = styled.button`
  height: 40px;
  margin: 50px;
  border-radius: 5px;
  background-color: white;
`;

export default function ProgressBar(props) {
  const [fillWidth, setFillWidth] = useState("0px");
  const [donutPosition, setDonutPosition] = useState("12.5px");
  const [progress, setProgress] = useState(props.value ? props.value : "");

    //Takes percentage without symbol and updates length of loaded bar
    //Any number from 0-100 inclusive
    //Needs to be called when you want the length to update
    // function convert() {
    //   var elem = document.getElementById("moving")
    //   var donut = document.getElementById("donut")

    //   var width = elem.width.animVal.value;
    //   var decimalPercent = percent/100;
    //   width = decimalPercent * 1000;
    //   elem.setAttribute("width", width)
    //   donut.setAttribute("cx", width)
    //   return(width)
    // }
    // if (props.percent) {
    //   var percent = (props.percent)/100;
    //   // var elem = document.getElementById("moving");
    //   // var length = elem.width.animVal.value;
    //   // if (length == 1000) {
    //   //   length = 0;
    //   // } else {
    //   //   length = percent * 1000;
    //   // }
    //   // elem.setAttribute("width", length);
    //   // return(length)
    //   load(percent)
    // }
    
    // function submit() {
    //   var percent;
    //   if (document.getElementById("percent").value === '') {
    //     percent = 0.1
    //   } else {
    //     percent = (document.getElementById("percent").value)/100;
    //   }
    //   load(percent)
    // };

    function load(percent) {
      var length = fillWidth;
      if (length == 1000) {
        length = 0;
      } else {
        length = percent * 1000;
      }

      setFillWidth(length);
      setDonutPosition(length+25);
      return(length);
    };

    function handleClick() {
      // if (props.onClick) props.onClick(e);
      var percent;
      if (progress === "") {
        percent = 0;
      } else {
        percent = progress/100;
      }
      load(percent);
    };

    function handleChange(e) {
      setProgress(e.target.value);
    }

    return (
      <Container>
        <Svg width="235" height="300">
          <Rect id="main" fill="#E2E2E2" width="235px"/>
          <Rect id="moving" fill="#1A5A99" width={fillWidth}/>
          <G className="donut-main">
            <Circle
              id="donut" 
              cx={donutPosition}
              fill="rgb(238,161,119)" 
              r="12.5" 
            />
            <Circle
              id="donut-topping"
              cx={donutPosition}
              fill="rgb(109,68,69)"
              r="10"
            />
            {/* <rect 
              id="sprinkle"
              x="125"
              y="22"
              rx="3"
              fill="pink"
              stroke="none"
              width="15"
              height="6"
              transform='rotate(45)'
            /> */}
            <Circle 
              id="donut-hole"  
              cx={donutPosition}
              r="4" 
              fill="#E2E2E2"
            />
          </G>
        </Svg>
        <Input 
          type="text" 
          id="percent" 
          value={progress}
          onChange={(e) => {
            handleChange(e);
          }}>
        </Input>
        <Button 
          className="button" 
          onClick={() => { handleClick() }}>
          Submit
        </Button>
      </Container>
    );
  }
  