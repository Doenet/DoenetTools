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

function useOnScreen(ref, rootMargin = "0px") {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (ref.current == null) return
    const observer = new IntersectionObserver(
      // ([entry])=>{console.log(">>>>",entry)}
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin }
    )
    observer.observe(ref.current)
    return () => {
      if (ref.current == null) return
      observer.unobserve(ref.current)
    }
  }, [ref.current, rootMargin])

  return isVisible
}

//crumb 
//label: the lable which shows in the span
//onClick: the function called when crumb is clicked
export function BreadCrumb({crumbs=[]}){
  const breadCrumbRef = useRef(null)
  let [numHidden,setNumHidden] = useState(crumbs.length);
  let tipVisible = useOnScreen(breadCrumbRef,"0px 0px 0px 0px");

    if (!tipVisible && crumbs.length > numHidden + 1){
      setNumHidden((was)=>was+1);
    }

    // if (tipVisible && numHidden > 0){

    //   setNumHidden((was)=>was-1);
    // }
    console.log(">>>>numHidden",numHidden)
    console.log(">>>>tipVisible",tipVisible)
  

  let crumbsJSX = [];

  for (let [i,{label,onClick}] of Object.entries(crumbs) ){
    if (i < numHidden){ continue; }
    crumbsJSX.push(<BreadcrumbItem key={`breadcrumbitem${i}`}>
      <BreadcrumbSpan onClick={onClick}>{label}</BreadcrumbSpan>
      </BreadcrumbItem>)
  }

  crumbsJSX.push(<p ref={breadCrumbRef} > </p>)


  return <>
  <BreadCrumbContainer > {crumbsJSX} </BreadCrumbContainer>
  
  </>


}

