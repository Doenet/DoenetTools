import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  // Depend on if we have a label or the showProgress props
  display: ${props => props.align};
  align-items: ${props => props.alignItems};
`;

const Svg = styled.svg``;

const Rect = styled.rect`;
  x: 0px;
  y: 0px;
  rx: ${props => props.radius}; // Depends on if we have the donutIcon prop
  stroke: none;
  stroke-width: 0;
  height: ${props => props.height};
  // width prop is passed in as a number without "px"
  // Usage: <ProgressBar width=400/> to set the width of the progress bar to 400px
  width: ${props => (props.width).toString() + "px"};
`;

const DonutG = styled.g``;

const Circle = styled.circle`
  cy: 12.5px;
`;

const Label = styled.p`
  font-size: 14px;
  display: ${props => props.labelVisible}; // Only visible with label prop
  margin-right: 5px;
  margin-bottom: ${props => props.align == 'flex' ? 'none' : '2px'};
`;

const Progress = styled.p`
    font-size: 12px;
    display: ${props => props.showProgress}; // Only visible with showProgress prop
    margin-left: 5px; // Percentage appears to the right of the progress bar
`;

export default function ProgressBar(props) {
  const [fillWidth, setFillWidth] = useState("0px");
  const [donutPosition, setDonutPosition] = useState("12.5px");
  const [barWidth, setBarWidth] = useState(props.width ? props.width : 235); // Default to the width of the navigation panel
  const height = props.donutIcon ? "25px" : "10px";
  const radius = props.donutIcon ? "12.5px" : "5px";
  const ariaLabel = props.ariaLabel ? props.ariaLabel : null;
  const labelVisible = props.label ? 'static' : 'none';

  // donutIcon styled-component
  // Only visible with donutIcon prop
  var donut = 
  <DonutG>
    <Circle
      id="donut" 
      cx={donutPosition}
      fill="var(--donutBody)" 
      r="12.5" 
    />
    <Circle
      id="donut-topping"
      cx={donutPosition}
      fill="var(--donutTopping)"
      r="10"
    />
    <Circle 
      id="donut-hole"  
      cx={donutPosition}
      r="4" 
      fill="var(--mainGray)"
    />
  </DonutG>
    
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
  if (props.showProgress) {
    percent = (props.progress * 100).toString() + "%";
    alignItems = 'center';
  };

  // progress prop should ALWAYS be defined
  // Usage: <ProgressBar progress={0.4}/> to fill the progress bar 40%
  useEffect(() => {
    let progress = props.progress ? props.progress : 0;
    progress *= barWidth;

    // Fill the bar and/or move the donut based on the progress prop
    setFillWidth(progress);    
    setDonutPosition(progress-12.5); 

    // If the showProgress prop is used, shorten the progress bar
    // We want to keep the total length of the component to be 235px
    if (props.showProgress) {
      setBarWidth(200);
    };
  }, [props.progress, props.showProgress, barWidth]);

  return (
    <Container align={align} alignItems={alignItems}>
      <Label labelVisible={labelVisible} align={align}>{label}</Label>
      <Svg width={barWidth} height={height}>
        <Rect id="main" fill="var(--mainGray)" width={barWidth} height={height} radius={radius} aria-label={ariaLabel}/>
        <Rect id="moving" fill="var(--mainBlue)" width={fillWidth} height={height} radius={radius}/>
        {props.donutIcon ? donut : ''}
      </Svg>
      {props.showProgress ? <Progress>{percent}</Progress> : ''}
    </Container>
  );
};
  