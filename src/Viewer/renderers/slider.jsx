import React, { useRef, useState, useEffect } from 'react';

import styled from "styled-components";
import {Spring} from '@react-spring/web';
import useDoenetRender from './useDoenetRenderer';
import Button from "../../_reactComponents/PanelHeaderComponents/Button";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup";
import { doenetComponentForegroundActive, doenetComponentForegroundInactive, doenetLightGray } from "../../_reactComponents/PanelHeaderComponents/theme"

const SliderContainer = styled.div`
    width: fit-content;
    height: ${props => (props.labeled && props.noTicked) ? "60px" : props.labeled ? "80px" : props.noTicked ? "40px" : "60px"};
`;

const SubContainer2 = styled.div`
    padding-top: 10px;
    height: 50px;
`;

const StyledSlider = styled.div`
  position: relative;
  border-radius: 3px;
  background: #888888 ;
  height: 1px;
  width: ${props => props.width};
`;

const StyledValueLabel = styled.p`
    display: inline;
    user-select: none;
`;

const StyledThumb = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  position: relative;
  top: -3px;
  opacity: 1;
  background: ${props => props.disabled ? "#404040" : `${doenetComponentForegroundActive}`};
  cursor: pointer;
`;

const Tick = styled.div`
    position: absolute;
    border-left: 2px solid  ${doenetLightGray};
    height: 10px;
    top:1px;
    z-Index:-2;
    left: ${props => props.x};
`;

const Label = styled.p`
    position: absolute;
    left: ${props => props.x};
    color: ${doenetComponentForegroundInactive};
    font-size: 12px;
    top:1px;
    user-select: none;
`;

function generateNumericLabels (points, div_width, point_start_val,SVs) {
  let maxValueWidth = findMaxValueWidth(points);
  let showAllItems = false;
 const length = Object.keys(points).length;
 if(SVs.width.size > maxValueWidth * length){
    showAllItems = true;
    return (
      [points.map((point, index) => (
          <Tick key = {point} x = {`${index * div_width}px`}/>
          )
      ),
      points.map((point, index) => {
          return  <Label key = {point} x = {`${(index * div_width) - 3}px`}>{point}</Label>
      }   
      )
      ]
  );
  }  else if(SVs.width.size < maxValueWidth ){
    showAllItems = false;
    return (
      [points.map((point, index) => {
        if(index == 0){
         return <Tick key = {point} x = {`${index * div_width}px`}/>
        }else{
          return ''
        }
      }
      ),
      points.map((point, index) => {
        if(index == 0){
          return  <Label key = {point} x = {`${(index * div_width) - 3}px`}>{point}</Label>

        }else if(index == 2){
          return  <Label key = {point} x = {`${(index * div_width) - 3}px`}>{"..."}</Label>

        }
      }   
      )
      ]
  );
  }
  else if(SVs.width.size < maxValueWidth * length){

        showAllItems = false;
    return (
      [points.map((point, index) => {
        let countToShow = Math.round((SVs.width.size * Math.round(div_width)) / length) + 2;
        let displayPoints = [];
        for(let i=1; i<countToShow;i++){
          displayPoints.push(Math.round((length/countToShow) * i));
  
        } 
        if(index == 0 ){
        return <Tick key = {point} x = "0px"/>
        }
        // else if(point % (length/10) == 0){
          else if(displayPoints.includes(point)){
          return <Tick key = {point} x = {`${ (index * div_width)}px`}/>
        }
        else if(length === index + 1){
          return <Tick key = {point} x = {`${index * div_width  }px`}/>
        }
      }
          
      ),
      points.map((point, index) => {
      let countToShow = Math.round((SVs.width.size * Math.round(div_width)) / length) + 2;
      
      let displayPoints = [];
      // displayPoints = points.filter((item)=> item % Math.round(length /countToShow) == 0) 
      // // displayPoints.pop();
      for(let i=1; i<countToShow;i++){
        displayPoints.push(Math.round((length/countToShow) * i));
      } 
        if(index == 0){
          return  <Label key = {point} x = "0px">{point}</Label>
        }
        else if(displayPoints.includes(point)){
           return  <Label key = {point} x = {`${(index * div_width)}px`}>{point}</Label>
        }
        else if(length  ==  index + 1 ){
          return  <Label key = {point} x = {`${index * div_width }px`}>{point}</Label>

        }
      }   
      )
      ]
  );
  }
  else{
    return (
      [points.map(point => (
          <Tick key = {point} x = {`${(point - point_start_val) * div_width}px`}/>
          )
      ),
      points.map(point => (
              <Label key = {point} x = {`${((point - point_start_val) * div_width) - 3}px`}>{point}</Label>
          )
      )
      ]
  );
  }

}

function findMaxValueWidth(points){
  let currWidth = points.reduce(function(a,b){
    return a.length > b.length ? a : b;
  });
return currWidth.toString().length * 12;
}

function generateTextLabels (points, div_width,SVs) {
  let maxValueWidth = findMaxValueWidth(points);
  const length = Object.keys(points).length;

  let showAllItems = false;
  if(SVs.width.size > maxValueWidth * length){
    showAllItems = true;
    return (
      [points.map((point, index) => (
          <Tick key = {point} x = {`${index * div_width}px`}/>
          )
      ),
      points.map((point, index) => {
          return  <Label key = {point} x = {`${(index * div_width) - 3}px`}>{point}</Label>
      }   
      )
      ]
  );
  }  else if(SVs.width.size < maxValueWidth ){
    showAllItems = false;
    return (
      [points.map((point, index) => {
        if(index == 0){
         return <Tick key = {point} x = {`${index * div_width}px`}/>
        }else{
          return ''
        }
      }
      ),
      points.map((point, index) => {
        if(index == 0){
          return  <Label key = {point} x = {`${(index * div_width) - 3}px`}>{point}</Label>

        }else if(index == 2){
          return  <Label key = {point} x = {`${(index * div_width) - 3}px`}>{"..."}</Label>

        }
      }   
      )
      ]
  );
  }
  else if(SVs.width.size < maxValueWidth * length){
    showAllItems = false;
    return (
      [points.map((point, index) => (
          <Tick key = {point} x = {`${index * div_width}px`}/>
          )
      ),
      points.map((point, index) => {
        if(index == 0 || length === index + 1){
          return  <Label key = {point} x = {`${(index * div_width) - 3}px`}>{point}</Label>

        }else{
          return  <Label key = {point} x = {`${(index * div_width) - 3}px`}>{point.length < 3 ? point : point.substr(0,3) + "..." }</Label>

        }
      }   
      )
      ]
  );
  }


}

function xPositionToValue(ref, div_width, start_val){ 
  return (start_val + (ref/div_width));
}

function nearestValue(refval, points){
  let [min, val, index] = [Infinity, null, 0];
  let i = 0;
  for (let point of points) {

      let diff = Math.abs(point - refval);
      if (diff < min) {
      min = diff;
      val = point;
      index = i;
      }

      i = i + 1;
  }
  return [val, index];
}

export default function Slider(props) {
  let [name, SVs, actions] = useDoenetRender(props);
//   console.log("name: ", name, " value: ", SVs.value, " index: ", SVs.index);
// console.log(SVs)

  const containerRef = useRef(null);
// console.log("SVs",SVs);
  // let sorted_points = [...SVs.items].sort((p1, p2) => p1 - p2);

  const [thumbXPos, setThumbXPos] = useState(0);
  const [thumbValue, setThumbValue] = useState((SVs.sliderType === "text") ? SVs.items[0] :  Math.min(...SVs.items));
  const [isMouseDown, setIsMouseDown] = useState(0);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const startValue = (SVs.sliderType === "text") ? 0 : Math.min(...SVs.items);
  const endValue = (SVs.sliderType === "text") ? 0 : Math.max(...SVs.items);
  let divisionWidth = SVs.sliderType === "text" ? SVs.width.size/(SVs.items.length - 1) : SVs.width.size/(SVs.items.length);

  const [index, setIndex] = useState(0);
   const width = (SVs.width.size);
  useEffect(() => {
      if(containerRef.current){
          const rect = containerRef.current.getBoundingClientRect();
          setOffsetLeft(rect.left);
      }
  }, []);

  useEffect(() => {
      //console.log("ran");
      if(!isMouseDown){
        setThumbValue(SVs.value);
        setIndex(SVs.index);
        if(!(SVs.sliderType === "text")){

            setThumbXPos((SVs.index/(SVs.items.length -1))*SVs.width.size);
            // setThumbXPos((SVs.value - startValue)*divisionWidth);
        }else{
            setThumbXPos((SVs.index)*divisionWidth);
        }
      }
  }, [SVs.index]);

  if(SVs.hidden){
    return null;
  }

  if(SVs.disabled) {
    let controls = '';
    if(SVs.showControls){
      controls = <ButtonGroup>
                <Button value="Prev"  onClick = {(e)=>handlePrevious(e)} disabled />
                <Button value="Next" onClick = {(e)=>handleNext(e)} disabled />
                </ButtonGroup>
    }else{
      controls = null;
    }
    let labels = '';
    if(SVs.sliderType === 'text'){
      labels = generateTextLabels(SVs.items, divisionWidth, SVs)
    }else{
      labels = generateNumericLabels(SVs.items, divisionWidth, startValue, SVs)
    }
    let ticksAndLabels = '' ;
    if(SVs.showTicks === false){
      ticksAndLabels = null
    }else{
      ticksAndLabels = labels;
    }
    return (
      <SliderContainer
        labeled={SVs.showControls || SVs.label}
        noTicked={SVs.showTicks === false}
        ref={containerRef}
      >
        <div style={{ height: SVs.showControls || SVs.label ? '20px' : '0px' }}>
          {SVs.label ? <StyledValueLabel>{SVs.label}</StyledValueLabel> : null}
          {controls}
        </div>
        <SubContainer2>
          <StyledSlider width={`${SVs.width.size}px`}>
            <StyledThumb disabled style={{ left: `${-3}px` }} />
            {ticksAndLabels}
          </StyledSlider>
        </SubContainer2>
      </SliderContainer>
    );
    }

    function handleDragEnter(e) {
        setIsMouseDown(true);

        setThumbXPos(e.nativeEvent.clientX - offsetLeft);

        if(!(SVs.sliderType === "text")){
            let refval = xPositionToValue(e.nativeEvent.clientX - offsetLeft, divisionWidth, startValue);
            let valindexpair = nearestValue(refval, SVs.items);
            
            setThumbValue(valindexpair[0]);
            setIndex(valindexpair[1]);

            actions.changeValue({ value: SVs.items[valindexpair[1]], transient: true});
        }else{
            let i = Math.round((e.nativeEvent.clientX - offsetLeft)/divisionWidth);
            setIndex(i);
            setThumbValue(SVs.items[i]);

            actions.changeValue({ value: SVs.items[i], transient: true});
        }
    }

    function handleDragExit(e) {
        if(!isMouseDown){
            return;
        }

        setIsMouseDown(false);

        if (!(SVs.sliderType === "text")){
            //Find the new index based on clientX and total width
            const ratio = (e.nativeEvent.clientX - offsetLeft)/SVs.width.size;
            const selectedIndex = Math.min(Math.max(Math.round(ratio*SVs.items.length), 0), SVs.items.length - 1)

            setThumbValue(SVs.items[selectedIndex]);
            setThumbXPos(selectedIndex*divisionWidth);
            setIndex(selectedIndex);

            actions.changeValue({ value: SVs.items[selectedIndex]});
        }else{
            let i = Math.round((e.nativeEvent.clientX - offsetLeft)/divisionWidth);
            setIndex(i);
            setThumbValue(SVs.items[i]);

            setThumbXPos(i*divisionWidth);

            actions.changeValue({ value: SVs.items[i]});

        }
    }

    function handleDragThrough(e) {
        if(isMouseDown){

            setThumbXPos(e.nativeEvent.clientX - offsetLeft);
            if(!(SVs.sliderType === "text")){
                let refval = xPositionToValue(e.nativeEvent.clientX - offsetLeft, divisionWidth, startValue);
                let valindexpair = nearestValue(refval, SVs.items);
                setThumbValue(valindexpair[0]);
                setIndex(valindexpair[1]);

                actions.changeValue({ value: SVs.items[valindexpair[1]], transient: true});
            }else{
                let i = Math.round((e.nativeEvent.clientX - offsetLeft)/divisionWidth);
                setIndex(i);
                setThumbValue(SVs.items[i]);

                actions.changeValue({ value: SVs.items[i], transient: true});
            }
        }
    }

    function handleNext(e) {
        if(index === SVs.items.length - 1){
            return;
        }

        if(!(SVs.sliderType === "text")){

            setThumbXPos((SVs.items[index+1] - startValue) * divisionWidth);
        }else{
            setThumbXPos((index+1)*divisionWidth);
        }

        
        actions.changeValue({ value: SVs.items[index+1]});
        setThumbValue(SVs.items[index+1]);
        setIndex(index + 1);

    }

    function handlePrevious(e) {
        if(index === 0){
            return;
        }

        if(!(SVs.sliderType === "text")){

            setThumbXPos((SVs.items[index-1] - startValue) * divisionWidth);
        }else{
            setThumbXPos((index-1)*divisionWidth);
        }

        actions.changeValue({ value: SVs.items[index-1]});

        setThumbValue(SVs.items[index-1]);
        setIndex(index - 1);
    }

  let labels = '';
  if(SVs.sliderType === 'text'){
    labels = generateTextLabels(SVs.items, divisionWidth, SVs)
  }else{
    labels = generateNumericLabels(SVs.items, divisionWidth, startValue, SVs)
  }
  let ticksAndLabels = '' ;
  if(SVs.showTicks === false){
    ticksAndLabels = null
  }else{
    ticksAndLabels = labels;
  }
  let controls = '';
  if(SVs.showControls){
    controls =  <ButtonGroup>
    <Button
      value="Prev"
      onClick={(e) => handlePrevious(e)}
      data-cy="prevbutton"
    ></Button>
    <Button
      value="Next"
      onClick={(e) => handleNext(e)}
      data-cy="nextbutton"
    ></Button>
  </ButtonGroup>
  }else{
    null
  }
  return (
    <SliderContainer  ref = {containerRef} labeled = {(SVs.showControls||SVs.label)} noTicked = {SVs.showTicks === false} >
      <div style = {{height: (SVs.showControls||SVs.label) ? "20px": "0px"}}>
            {SVs.label? <StyledValueLabel>{SVs.label}</StyledValueLabel> : null}
            {/* TODO */}
        {controls}
        </div>
        <SubContainer2 onMouseDown = {handleDragEnter} onMouseUp = {handleDragExit} onMouseMove = {handleDragThrough} onMouseLeave = {handleDragExit} >
            <StyledSlider width = {(`${SVs.width.size}px`)} data-cy="slider1">
            <Spring
                to={{ x: thumbXPos }}>              
                {(styles) => { return <StyledThumb style={{left: `${thumbXPos - 3}px`}}
                data-cy="slider1-handle"/>
            }}
            </Spring>
            {ticksAndLabels}
            </StyledSlider>
        </SubContainer2>
    </SliderContainer>
  );
  
}
