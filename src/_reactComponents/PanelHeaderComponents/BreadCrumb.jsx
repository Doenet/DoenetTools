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
    background: var(--lightBlue);
    color: black;
  }
  &:first-of-type span {
    padding: 0px 0px 0px 30px;
  }
  &:only-child span {
    border-radius: 15px;
    padding: 0px 30px 0px 30px;
    background: var(--lightBlue);
    color: black;
  }
`;
const CrumbMenuItem = styled.div`
  padding: 4px;
  cursor: pointer;
  color: var(--canvastext);
  background: var(--canvas);
  border: 2px solid var(--canvastext);
  border-radius: ${props => props.radius};
  margin: -2px 0px -2px 0px;
  border-left: 0px;
  border-right: 0px;
  padding-left: 8px;
  padding-right: 8px;
  max-width: 120px;
  white-space: nowrap;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 21.6px;
  &:hover {
    background-color: var(--lightBlue);
    color:black;
  }
`

const BreadcrumbSpan = styled.span`
  padding: 0px 0px 0px 45px;
  position: relative;
  float: left;
  color: white;
  background: var(--mainBlue);
  border-radius: 15px 0px 0px 15px;
  cursor: pointer;
  &::after {
    content: ' ';
    width: 0;
    height: 0;
    border-top: 50px solid transparent;
    border-bottom: 50px solid transparent;
    border-left: 30px solid var(--mainBlue);
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
  <BreadcrumbSpan tabIndex="0" onClick={onClick} aria-label={label}>{iconJSX}<CrumbTextDiv>{label}</CrumbTextDiv></BreadcrumbSpan>
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
  let [crumbBreaks,setCrumbBreaks] = useState(null);
  let [menuVisible,setMenuVisible] = useState(false);
  let supportPanelHandleLeftValue = useRecoilValue(supportPanelHandleLeft);
  let prevWidths = useRef([]);
  let elipseItemRef = useRef(null);
  const prevRightFirstCrumb = useRef(0);
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


  //Use breaks info to set numHidden
    for (let crumbBreak of crumbBreaks){
      if (effectiveWidth < crumbBreak.end &&
        effectiveWidth >= crumbBreak.start
        ){
          numHidden = crumbBreak.numHidden;
          // break;
        }

    }

  }

  //Only update if the crumb widths change
  //Or the menu panel collapses
  useLayoutEffect(()=>{

    //We need to delete some crumbRefs
    if (crumbs.length < crumbRefs.length){
      setCrumbRefs(crumbRefs.slice(0,crumbs.length))
    }

    //Wait for crumbRefs to be built
    if (crumbs.length === crumbRefs.length){
    let widths = []
        let rights = []
        let newWidths = false;

        for (let [i,crumbRef] of Object.entries(crumbRefs)){
          let boundingClientRect = crumbRef.current?.getBoundingClientRect();

          if (boundingClientRect === undefined){
            boundingClientRect = {width:0,right:0}
          }
          let { width, right } = boundingClientRect
          //Try to recover width information
          if (width === 0){
            if (prevWidths.current?.[i]){
              width = prevWidths.current?.[i];
            }
          }
          widths.push(width);
          rights.push(right);
          if (prevWidths.current?.[i] !== width &&
            width !== 0
            ){
              newWidths = true 
            }
        }

        //Handle length change
        if (prevWidths.current.length > widths.length){
          newWidths = true 
        }

        //Handle menu panel open/close
        if (prevRightFirstCrumb.current !== 0 &&
          prevRightFirstCrumb.current !== rights[0]
          ){
            newWidths = true 
          }

        prevWidths.current = widths;
        prevRightFirstCrumb.current = rights[0];
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


  let crumbsJSX = [];


  for (let [i,{icon,label,onClick}] of Object.entries(crumbs) ){
    
    if (i < numHidden && i != 0){ continue; }
    crumbsJSX.push(<Crumb key={`breadcrumbitem${i}`} icon={icon} label={label} onClick={onClick} i={i} setRef={setCrumbRefs} />)
  }

  if (numHidden > 0){crumbsJSX[1] = <BreadcrumbItem ref={elipseItemRef} key={`breadcrumbitem1`}>
  <BreadcrumbSpan  tabIndex="0" aria-label="..." onClick={()=>{setMenuVisible((was)=>!was)}}>...</BreadcrumbSpan>
  </BreadcrumbItem>}

  let breadcrumbMenu = null;
  if (numHidden > 0 && menuVisible){
    let crumMenuItemsJSX = []
    for (let [i,{icon,label,onClick}] of Object.entries(crumbs) ){
      if (i == 0){continue;}
      if (i > numHidden){break;}
      
      crumMenuItemsJSX.push(<CrumbMenuItem 
        key={`breadcrumbitem${i}`} 
        radius={'0px'}
        onClick={onClick}>{icon}{label}</CrumbMenuItem>)
    }

    if (crumMenuItemsJSX.length > 1) {
    crumMenuItemsJSX = [React.cloneElement(crumMenuItemsJSX[0], {radius: '5px 5px 0px 0px'})]
      .concat(crumMenuItemsJSX.slice(1,-1))
      .concat(React.cloneElement(crumMenuItemsJSX[crumMenuItemsJSX.length - 1], {radius: '0px 0px 5px 5px'}));
    } else if (crumMenuItemsJSX.length == 1) {
      crumMenuItemsJSX = [React.cloneElement(crumMenuItemsJSX[0], {radius: '5px'})]
    }

    const breadcrumbMenuLeft = elipseItemRef.current?.getBoundingClientRect()?.left + 25
    if (!isNaN(breadcrumbMenuLeft)){
      breadcrumbMenu = <div 
      style={{
        left:breadcrumbMenuLeft,
        zIndex:"20",
        top:"31px",
        position:"absolute",
        backgroundColor: 'var(--canvas)',
        border: '2px solid var(--canvastext)',
        borderRadius: '5px',
        // maxHeight: "86.4px",
        maxHeight: "121px",
        overflowY: "scroll"
        
      }}>
        {crumMenuItemsJSX}
      </div>
    }else{
      //Handle open and close menu panel
      setMenuVisible(false)
    }
    
  }
  
  return <>
  <BreadCrumbContainer ref={containerRef}> 
  {crumbsJSX}
  {breadcrumbMenu}
   </BreadCrumbContainer>
  
  </>


}

