import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const BreadCrumbContainer = styled.ul`
  list-style: none;
  overflow: hidden;
  height: 22px;
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
  white-space: nowrap;
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
  <BreadcrumbSpan onClick={onClick}>{iconJSX}{label}</BreadcrumbSpan>
  </BreadcrumbItem>
}
//crumb 
//label: the label which shows in the span
//icon: the Font Awesome icon which shows in the span
//onClick: the function called when crumb is clicked
export function BreadCrumb({crumbs=[]}){
  // console.log(">>>>----BREADCRUMB")
  let [crumBounds,setCrumBounds] = useState([])
  let [windowWidth,setWindowWidth] = useState(window.innerWidth);
  let [containerLeft,setContainerLeft] = useState(0);

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
  useEffect(()=>{
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
    prevBreak = prevBreak + crumBounds[crumBounds.length -1].width + 58; //Second segment right break point Includes elipsis segment

    
    //If window is wide enough to expand from minimum size
    if ( prevBreak < windowWidth){

      for (let i = crumBounds.length - 2; i >= 1; i-- ){
        let width = crumBounds[i].width;
        let rightBreak = prevBreak + width;
        if (i == 1){ rightBreak -=  58} //no elipsis on last break

        //If in this range we know the number to hide
        if (windowWidth >= prevBreak && windowWidth < rightBreak){
          break;
        }
        prevBreak = rightBreak;
        numHidden--;
      }
    }
  }

  let crumbsJSX = [];



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

