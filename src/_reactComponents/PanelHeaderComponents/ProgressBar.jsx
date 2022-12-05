import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: ${props => props.isLabelVertical && 'column'} ;
  align-items:  ${props => !props.isLabelVertical && 'center'};
  width: ${props => props.width ? props.width : "200px"};
`;

const Label = styled.span`
  font-size: 14px;
  margin-right: 5px;
  margin-bottom: ${props => props.isVertical && '2px'};
`;

const BarWrapper = styled.div`
  display: flex;
  align-items: center;
  width: ${props => props.width ? props.width : "200px"};
  height: ${props => props.isDonut ? "25px" : props.height ? props.height : "10px"};
`;

const FullBar = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: ${props => props.isDonut ? "12.5px" : props.radius ? props.radius : "5px"};
  background-color: var(--mainGray); 
`;

const InnerBar = styled.div`
  border-radius: ${props => props.isDonut ? "12.5px" : props.radius ? props.radius : "5px"};
  position: absolute;
  height: 100%;
  background-color: var(--mainBlue); 
  left: ${props => !props.rotated && 0};
  right: ${props => props.rotated && 0};
  width: ${props => props.progress + "%"};
`;

const Donut = styled.div`
  position: absolute;
  right: ${props => !props.rotated && 0};
  left: ${props => props.rotated && 0};
`;

const DonutWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Circle = styled.circle`
  cy: 12.5px;
`;

const Progress = styled.span`
  font-size: 12px;
  margin-left: 5px; 
`;

export default function ProgressBar(props) {

  var donutIcon = 
    <svg width='25px' height='25px'>
      <g>
        <Circle
          id="donut" 
          cx={12.5}
          fill="var(--donutBody)" 
          r="12.5" 
        />
        <Circle
          id="donut-topping"
          cx={12.5}
          fill="var(--donutTopping)"
          r="10"
        />
        <Circle 
          id="donut-hole"  
          cx={12.5}
          r="4" 
          fill="var(--mainGray)"
        />
      </g>
    </svg>
    

  return (
    <Container 
      isLabelVertical={props.label && props.vertical} 
      aria-labelledby="progress-bar-label" 
      aria-label={"progress bar " + props.progress * 100}
      width={props.width}
    >
      {
        props.label ?
          <Label id="progress-bar-label" isVertical={props.vertical}>
            {props.label}
          </Label>
        :
          null
      }
      <BarWrapper
       width={props.width}
       height={props.height}
       isDonut={props.donutIcon}
      >
        <FullBar radius={props.radius}>
          <InnerBar 
            progress={props.progress * 100}
            isDonut={props.donutIcon}
            rotated={props.rotated}
            radius={props.radius}
          >
            { 
            props.donutIcon ? 
              <DonutWrapper>
                <Donut rotated={props.rotated}>
                  {donutIcon}
                </Donut>
              </DonutWrapper>
            : 
              null 
            }
          </InnerBar>
        </FullBar>
        { 
        props.showProgress ? 
          <Progress>{props.progress * 100}%</Progress> 
        : 
          null
        }
      </BarWrapper>
    </Container>
  );
};
  