import React, {useState} from "react";
import styled from "styled-components";
// import "./ProgressBar.css"

const Container = styled.div`
  display: ${props => props.align};
  align-items: ${props => props.alignItems};
`;
const Svg = styled.svg``;
const Rect = styled.rect`
  x: 0px;
  y: 0px;
  rx: ${props => props.radius};
  /* fill: #E2E2E2; */
  stroke: none;
  stroke-width: 0;
  /* width: 1000px; */
  height: ${props => props.height};
`;
const DonutG = styled.g``;
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

const Label = styled.p`
  font-size: 14px;
  display: ${props => props.labelVisible};
  margin-right: 5px;
  margin-bottom: ${props => props.align == 'flex' ? 'none' : '2px'};
`;

export default function ProgressBar(props) {
  const [fillWidth, setFillWidth] = useState("0px");
  const [donutPosition, setDonutPosition] = useState("12.5px");
  const barWidth = props.width ? props.width : "235px";
  const height = props.donutIcon ? "25px" : "10px";
  const radius = props.donutIcon ? "12.5px" : "5px";
  const ariaLabel = props.ariaLabel ? props.ariaLabel : null;
  const labelVisible = props.label ? 'static' : 'none';

  var donut = 
  <DonutG>
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
    <Circle 
      id="donut-hole"  
      cx={donutPosition}
      r="4" 
      fill="#E2E2E2"
    />
  </DonutG>

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
    
    var align = 'flex';
    var alignItems = 'none';

    var label = '';
    if (props.label) {
      label = props.label;
      alignItems = 'center';
      if (props.vertical) {
        align = 'static';
      }
    };

    var percent = '';
    if (props.progress) {
      percent = props.progress;
      load(percent);
    };

    function load(percent) {
      percent *= barWidth;
      setFillWidth(percent.toString() + "px");    
      setDonutPosition((percent+12.5).toString() + "px");       
    };
    // let percent = props.progress ? props.progress : 0;
    // percent *= barWidth;
    // setFillWidth((40).toString() + "px");    
    // setDonutPosition((40+12.5).toString() + "px");       
    

    // function handleClick() {
    //   // if (props.onClick) props.onClick(e);
    //   var percent;
    //   if (progress === "") {
    //     percent = 0;
    //   } else {
    //     percent = progress/100;
    //   }
    //   load(percent);
    // };

    // function handleChange(e) {
    //   setProgress(e.target.value);
    // };

    return (
      <Container align={align} alignItems={alignItems}>
        <Label labelVisible={labelVisible} align={align}>{label}</Label>
        <Svg width={barWidth} height={height}>
          <Rect id="main" fill="#E2E2E2" width={barWidth} height={height} radius={radius} aria-label={ariaLabel}/>
          <Rect id="moving" fill="#1A5A99" width={fillWidth} height={height}/>
          {props.donutIcon ? donut : ''}
        </Svg>
      </Container>
    );
  }
  