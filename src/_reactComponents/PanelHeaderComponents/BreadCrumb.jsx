import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

const BreadCrumbContainer = styled.ul`
  list-style: none;
  overflow: hidden;
  height: 22px;
  display: flex;
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


function Crumb({setSize,i,label,onClick}){
  let crumbRef = useRef(null);
  
  useEffect(()=>{
    // console.log(">>>>",i,crumbRef.current.offsetWidth)
    setSize((was)=>{
      let newObj = [...was];
      newObj[i] = crumbRef.current.offsetWidth;
      return newObj;
    })
  },[])
  return <BreadcrumbItem ref={crumbRef}>
  <BreadcrumbSpan onClick={onClick}>{label}</BreadcrumbSpan>
  </BreadcrumbItem>
}
//crumb 
//label: the lable which shows in the span
//onClick: the function called when crumb is clicked
export function BreadCrumb({crumbs=[]}){
  const breadCrumbRef = useRef(null)
  let [crumbWidths,setCrumbWidths] = useState([])
  let [windowWidth,setWindowWidth] = useState(window.innerWidth);

  function onWindowResize(){
    setWindowWidth(window.innerWidth);
  }

  useEffect(()=>{
    window.onresize = onWindowResize;
    return ()=>{
      window.onresize = null;
    }
  },[])

  let numHidden = 0;
  //Wait until we have the sizes defined
  if (crumbWidths.length == crumbs.length && breadCrumbRef){
    let BreadcrumbLeft = breadCrumbRef.current.getBoundingClientRect().left;
    let prevBreak = BreadcrumbLeft + 95;

    for (let i = crumbWidths.length - 1; i >= 0; i-- ){
      let width = crumbWidths[i];
      let rightBreak = prevBreak + width;
      // console.log(">>>>range",i+1.0,prevBreak,rightBreak)

      if (windowWidth >= prevBreak && windowWidth < rightBreak){
        numHidden = i + 1.0;
        break;
      }
      prevBreak = rightBreak;
    }
    // console.log(">>>>Result",BreadcrumbLeft,crumbWidths,windowWidth,numHidden)
  }

  let crumbsJSX = [];

  if (numHidden > 0){crumbsJSX.push(<BreadcrumbItem key={`breadcrumbitem0`}>
    <BreadcrumbSpan>...</BreadcrumbSpan>
    </BreadcrumbItem>)}

  for (let [i,{label,onClick}] of Object.entries(crumbs) ){
    
    if (i < numHidden){ continue; }
    crumbsJSX.push(<Crumb key={`breadcrumbitem${i}`} label={label} onClick={onClick} i={i} setSize={setCrumbWidths} />)
  }


  return <>
  <BreadCrumbContainer ref={breadCrumbRef}> {crumbsJSX} </BreadCrumbContainer>
  </>


}

