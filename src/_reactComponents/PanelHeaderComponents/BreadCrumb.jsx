import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { panelsInfoAtom } from '../../Tools/_framework/Panels/NewContentPanel';
import { useRecoilValue } from 'recoil';
import { supportPanelHandleLeft } from '../../Tools/_framework/Panels/NewContentPanel';

const BreadCrumbContainer = styled.ul`
  list-style: none;
  overflow: hidden;
  height: 21px;
  display: flex;
  margin-left: -35px;
`;

const BreadcrumbItem = styled.li`
  float: left;
  &:last-of-type span {
    border-radius: 0px 15px 15px 0px;
    padding: 0px 25px 0px 45px;
    background: hsl(209, 54%, 82%);
    color: black;
  }
  &:first-of-type span {
    padding: 0px 0px 0px 30px;
  }
  &:only-child span {
    border-radius: 15px;
    padding: 0px 30px 0px 30px;
    background: hsl(209, 54%, 82%);
    color: black;
  }
`;

const BreadcrumbSpan = styled.span`
  padding: 0px 0px 0px 45px;
  position: relative;
  float: left;
  color: white;
  background: #1a5a99;
  border-radius: 15px 0px 0px 15px;
  cursor: pointer;
  &::after {
    content: ' ';
    width: 0;
    height: 0;
    border-top: 50px solid transparent;
    border-bottom: 50px solid transparent;
    border-left: 30px solid #1a5a99;
    position: absolute;
    top: 50%;
    margin-top: -50px;
    left: 100%;
    z-index: 2;
  }
  &::before {
    content: ' ';
    width: 0;
    height: 0;
    border-top: 50px solid transparent;
    border-bottom: 50px solid transparent;
    border-left: 30px solid white;
    position: absolute;
    top: 50%;
    margin-top: -50px;
    margin-left: 1px;
    left: 100%;
    z-index: 1;
  }
`;

const CrumbTextDiv = styled.div`
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
max-width: 175px;
`

function Crumb({setRef,i,label=null,onClick,icon=null}){
  let crumbRef = useRef(null);
  
  useEffect(()=>{
    setRef((was)=>{
      let newObj = [...was];
      newObj[i] = crumbRef;
      return newObj;
    })
  },[i,crumbRef,setRef])

  let iconJSX = null;
  if (icon){
    iconJSX = <FontAwesomeIcon icon={icon}/>
  }

  if (!icon && !label){
    label = '_'
  }

  return <BreadcrumbItem ref={crumbRef}>
  <BreadcrumbSpan onClick={onClick}>{iconJSX}<CrumbTextDiv>{label}</CrumbTextDiv></BreadcrumbSpan>
  </BreadcrumbItem>
}
//crumb 
//label: the label which shows in the span
//icon: the Font Awesome icon which shows in the span
//onClick: the function called when crumb is clicked
export function BreadCrumb({crumbs=[],offset=0}){
  // console.log(">>>>----BREADCRUMB")
  let [crumbRefs,setCrumbRefs] = useState([])
  let [windowWidth,setWindowWidth] = useState(window.innerWidth);
  // let [containerLeft,setContainerLeft] = useState(0);
  let [crumbBreaks,setCrumbBreaks] = useState(null);
  let panelsInfo = useRecoilValue(panelsInfoAtom);
  let supportPanelHandleLeftValue = useRecoilValue(supportPanelHandleLeft);
  let prevWidths = useRef([]);

  const containerRef = useRef(null);

  function onWindowResize(){
    setWindowWidth(window.innerWidth);
  }

  useEffect(()=>{
    window.onresize = onWindowResize;
    return ()=>{
      window.onresize = null;
    }
  },[])

  //Needed to update after the component is mounted
  //So we are fine with the warning
  // useLayoutEffect(()=>{
  //   if (containerRef.current?.getBoundingClientRect()?.left !== containerLeft){
  //     setContainerLeft(containerRef.current?.getBoundingClientRect()?.left);
  //   }
  // })


  let numHidden = 0;

  //Update numHidden
  //Protect against too few crumbs
  //And wait until we have the sizes defined
  if (crumbBreaks !== null &&
      crumbs.length > 2){

    let effectiveWidth = windowWidth;
    if (supportPanelHandleLeftValue){
      effectiveWidth = supportPanelHandleLeftValue;
    }
      effectiveWidth -= offset;

    console.log("\n>>>>> effectiveWidth",effectiveWidth)
  // console.log("\n>>>>>supportPanelHandleLeftValue",supportPanelHandleLeftValue)

  //Use breaks info to set numHidden
    for (let crumbBreak of crumbBreaks){
      console.log(">>>>>crumbBreak",crumbBreak)
      if (effectiveWidth < crumbBreak.end &&
        effectiveWidth >= crumbBreak.start
        ){
          numHidden = crumbBreak.numHidden;
          // break;
        }

    }

  }

  //Only update if the crumb widths change
  useLayoutEffect(()=>{

    // console.log("\n>>>>>useLayoutEffect crumbs crumbRefs ",crumbs,crumbRefs)
    // console.log(">>>>>crumbs.length",crumbs.length)

    if (crumbs.length === crumbRefs.length 
      // crumbBreaks === null &&
      // numHidden === 0
      // numHidden === 0 &&
      // crumbs.length === 6  //TODO: need to recalculate when length changes
      ){
        let widths = []
        let rights = []
        let newWidths = false;
        // if (crumbBreaks === null){newWidths = true }
        for (let [i,crumbRef] of Object.entries(crumbRefs)){
          let boundingClientRect = crumbRef.current?.getBoundingClientRect();
          if (boundingClientRect === undefined){
            let prevWidth = 0;
            let prevRight = 0;
            if (prevWidths.current?.[i]?.width){
              prevWidth = prevWidths.current?.[i].width;
              prevRight = prevWidths.current?.[i].right;
              console.log(">>>>>prevWidth",prevWidth)
              console.log(">>>>>prevRight",prevRight)
            }
            boundingClientRect = {width:prevWidth,right:prevRight}
          }
          let { width, right } = boundingClientRect
          widths.push(width);
          rights.push(right);
          if (prevWidths.current?.[i] !== width &&
            width !== 0
            ){
              newWidths = true 
            }
          // console.log(">>>>>i width right ",i,width,right)
        }
        console.log(">>>>>newWidths widths!!!!!!!!!!",newWidths,widths)

        prevWidths.current = widths;

        //prevent infinite loop
        if (newWidths){
          let newCrumbBreaks = [];

        
            let elipseWidth = 52;
            let rightPadding = 5;
            //Set to the first break
            let crumbBreak = rights[0] + elipseWidth + widths[widths.length - 2] + widths[widths.length - 1] + rightPadding;
    
            newCrumbBreaks.push({start:0,end:crumbBreak,numHidden:crumbs.length - 2})
  
            for (let i = 3; i < crumbs.length; i++ ){
              let start = crumbBreak;
              crumbBreak = crumbBreak + widths[widths.length - i];
  
              if (i === crumbs.length - 1){
                //Handle case where we aren't colapsing crumbs
                crumbBreak = start + widths[1] - elipseWidth;
              }
              newCrumbBreaks.push({start,end:crumbBreak,numHidden:crumbs.length - i})
            }

            //Special case when width narrower than elipses
            if (widths.length > 2 && elipseWidth > widths[1]){
              newCrumbBreaks.pop();
            }
       
          setCrumbBreaks(newCrumbBreaks);
        }
        
        
    }
    
  },[crumbs,crumbRefs,setCrumbBreaks,crumbBreaks,numHidden])

  
  //Use for testing breaks
  // if (crumbs.length === 6 && crumbBreaks !== null){
  //   numHidden = 1;
  // }
  console.log(">>>>>numHidden",numHidden)
//     numHidden = crumbs.length - 2;

//     let prevBreak = 481; //delete me

//     // let prevBreak = crumBounds[0].right + 53; //First segment right break point
//     // prevBreak = prevBreak + crumBounds[crumBounds.length -1].width + 58; //Assume right break point Includes elipsis segment
//     console.log("\n>>>>>containerLeft ",containerLeft)
//     console.log(">>>>>first break ",prevBreak)

//     let effectiveWidth = windowWidth;

//     // if (panelsInfo?.isActive){
//     //   //if menu panel is closed (indirect measurement)

//     //   effectiveWidth = (windowWidth  * panelsInfo.propotion) - 10;
//     //   //if menu panel is open (indirect measurement)
//     //   if (containerLeft > 100){
//     //     effectiveWidth = ((windowWidth - 240) * panelsInfo.propotion) + 240 - 10;
//     //   }
//     // }
//   // console.log("\n\n>>>>effectiveWidth",effectiveWidth,windowWidth,containerLeft,panelsInfo.propotion)
//   if (supportPanelHandleLeftValue){
//     effectiveWidth = supportPanelHandleLeftValue;
//   }
//     effectiveWidth -= offset;


//   // console.log("\n>>>>after effectiveWidth",effectiveWidth)
//   // console.log(">>>>>offset",offset)
//   console.log(">>>>>supportPanelHandleLeftValue",supportPanelHandleLeftValue)
    
// console.log(">>>>>",`prev ${prevBreak} effective ${effectiveWidth} then ${numHidden}`)

//     //If window is wide enough to expand from minimum size
//     if ( prevBreak < effectiveWidth){

//       for (let i = crumBounds.length - 2; i >= 1; i-- ){
//         // let width = crumBounds[i].width;

//         let width = 100; //delete me

//         let rightBreak = prevBreak + width;
//         if (i == 1){ rightBreak -=  58} //no elipsis on last break point
// console.log(">>>>>prevBreak rightBreak",`${prevBreak} - ${rightBreak} then ${numHidden} effectiveWidth ${effectiveWidth}`)
//         //If in this range we have the number to hide
//         if (effectiveWidth >= prevBreak && effectiveWidth < rightBreak){
//           break;
//         }
//         prevBreak = rightBreak;
//         numHidden--;
//       }
//     }
//   }
//   numHidden = 0; //DELETE ME!!!

  let crumbsJSX = [];

  // console.log(">>>>>RESULTS",`numHidden ${numHidden} `)


  for (let [i,{icon,label,onClick}] of Object.entries(crumbs) ){
    
    if (i < numHidden && i != 0){ continue; }
    crumbsJSX.push(<Crumb key={`breadcrumbitem${i}`} icon={icon} label={label} onClick={onClick} i={i} setRef={setCrumbRefs} />)
  }

  if (numHidden > 0){crumbsJSX[1] = <BreadcrumbItem key={`breadcrumbitem1`}>
  <BreadcrumbSpan>...</BreadcrumbSpan>
  </BreadcrumbItem>}

  return <>
  <BreadCrumbContainer ref={containerRef}> {crumbsJSX} </BreadCrumbContainer>
  </>


}

