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

function Crumb({setSize,i,label=null,onClick,icon=null}){
  let crumbRef = useRef(null);
  
  useEffect(()=>{
    setSize((was)=>{
      let newObj = [...was];
      newObj[i] = crumbRef.current.getBoundingClientRect();
      return newObj;
    })
  },[i,crumbRef,setSize])

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
  let [crumBounds,setCrumBounds] = useState([])
  let [windowWidth,setWindowWidth] = useState(window.innerWidth);
  let [containerLeft,setContainerLeft] = useState(0);
  let panelsInfo = useRecoilValue(panelsInfoAtom);
  let supportPanelHandleLeftValue = useRecoilValue(supportPanelHandleLeft);

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
  useLayoutEffect(()=>{
    if (containerRef.current?.getBoundingClientRect()?.left !== containerLeft){
      setContainerLeft(containerRef.current?.getBoundingClientRect()?.left);
    }
  })

  let numHidden = 0;
  //Protect against too few crumbs
  //And wait until we have the sizes defined
  if (crumbs.length > 2 &&
      crumBounds.length == crumbs.length){
    
    numHidden = crumbs.length - 2;
    let prevBreak = containerLeft + crumBounds[0].width + 53; //First segment right break point
    prevBreak = prevBreak + crumBounds[crumBounds.length -1].width + 58; //Assume right break point Includes elipsis segment
    console.log(">>>>first break",prevBreak)

    let effectiveWidth = windowWidth;

    // if (panelsInfo?.isActive){
    //   //if menu panel is closed (indirect measurement)

    //   effectiveWidth = (windowWidth  * panelsInfo.propotion) - 10;
    //   //if menu panel is open (indirect measurement)
    //   if (containerLeft > 100){
    //     effectiveWidth = ((windowWidth - 240) * panelsInfo.propotion) + 240 - 10;
    //   }
    // }
  // console.log("\n\n>>>>effectiveWidth",effectiveWidth,windowWidth,containerLeft,panelsInfo.propotion)
  if (supportPanelHandleLeftValue){
    effectiveWidth = supportPanelHandleLeftValue;
  }

    effectiveWidth -= offset;
  // console.log("\n>>>>after effectiveWidth",effectiveWidth)
  // console.log(">>>>supportPanelHandleLeftValue",supportPanelHandleLeftValue)
    
console.log(">>>>",`prev ${prevBreak} effective ${effectiveWidth} then ${numHidden}`)

    //If window is wide enough to expand from minimum size
    if ( prevBreak < effectiveWidth){

      for (let i = crumBounds.length - 2; i >= 1; i-- ){
        let width = crumBounds[i].width;
        let rightBreak = prevBreak + width;
        if (i == 1){ rightBreak -=  58} //no elipsis on last break point
console.log(">>>>prevBreak rightBreak",`${prevBreak} - ${rightBreak} then ${numHidden} with ${effectiveWidth}`)
        //If in this range we have the number to hide
        if (effectiveWidth >= prevBreak && effectiveWidth < rightBreak){
          break;
        }
        prevBreak = rightBreak;
        numHidden--;
      }
    }
  }

  let crumbsJSX = [];

  console.log(">>>>RESULTS",`numHidden ${numHidden} `)


  for (let [i,{icon,label,onClick}] of Object.entries(crumbs) ){
    
    if (i < numHidden && i != 0){ continue; }
    crumbsJSX.push(<Crumb key={`breadcrumbitem${i}`} icon={icon} label={label} onClick={onClick} i={i} setSize={setCrumBounds} />)
  }

  if (numHidden > 0){crumbsJSX[1] = <BreadcrumbItem key={`breadcrumbitem1`}>
  <BreadcrumbSpan>...</BreadcrumbSpan>
  </BreadcrumbItem>}

  return <>
  <BreadCrumbContainer ref={containerRef}> {crumbsJSX} </BreadCrumbContainer>
  </>


}

