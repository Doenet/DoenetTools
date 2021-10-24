import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import VisibilitySensor from 'react-visibility-sensor'

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

function useSize(ref) {
  const [size, setSize] = useState({})

  useEffect(() => {
    if (ref.current == null) return
    const observer = new ResizeObserver(([entry]) => setSize(entry.contentRect))
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return size
}

//crumb 
//label: the lable which shows in the span
//onClick: the function called when crumb is clicked
export function BreadCrumb({crumbs=[]}){
  const breadCrumbRef = useRef(null)
  let [numHidden,setNumHidden] = useState(0);
  let [rightMostVisible,setRightMostVisible] = useState(true);
  let crumbsWidth = useSize(breadCrumbRef)
  let [windowWidth,setWindowWidth] = useState(window.innerWidth);
  // console.log(">>>>windowWidth",windowWidth)
  // console.log(">>>>crumbsWidth",crumbsWidth.width)
//How do we know the width 350 is big enough for the next crumb?
  if (windowWidth - crumbsWidth.width > 350){
    if (numHidden > 0){
      console.log(">>>>!!!!!!!")
      console.log(">>>>diff",windowWidth - crumbsWidth.width)
      console.log(">>>>!!!!!!!")
    }
    
    // setNumHidden((was)=>{
    //   if (was > 0){
    //     return was - 1;
    //   }
    // })
  }

  function onWindowResize(){
    let width = window.innerWidth;
    setWindowWidth(width);
    // console.log(">>>>window width",width)
    // console.log(">>>>breadcrumbs width",crumbsWidth,crumbsWidth.width)
  }

  useEffect(()=>{
    window.onresize = onWindowResize;
    return ()=>{
      window.onresize = null;
    }
  },[])

  let crumbsJSX = [];

  if (numHidden > 0){crumbsJSX.push(<BreadcrumbItem key={`breadcrumbitem0`}>
    <BreadcrumbSpan>...</BreadcrumbSpan>
    </BreadcrumbItem>)}

  for (let [i,{label,onClick}] of Object.entries(crumbs) ){
    
    if (i < numHidden){ continue; }
    let crumb = <BreadcrumbItem key={`breadcrumbitem${i}`}>
    <BreadcrumbSpan onClick={onClick}>{label}</BreadcrumbSpan>
    </BreadcrumbItem>;

    // if (i == crumbs.length - 1){
      crumbsJSX.push(<VisibilitySensor 
        offset={{right:30}}
        
        onChange={(isVisible)=>{
          // console.log(">>>>i",i,isVisible)
          // setVisible(isVisible)
        if (isVisible){
          //if last one is visible set to zero and recalculate
          if (i == crumbs.length - 1){
            setNumHidden(0);
            setRightMostVisible(true);

          }
          // if (numHidden > 0){
          //   setNumHidden((was)=>was-1)
          // }
        }else{
          console.log(">>>>crumbsWidth",crumbsWidth.width)
          // console.log(">>>>crumbsWidth",crumbsWidth.current,crumbsWidth.current.getBoundingClientRect())
          //Determine number to hide to make visible again
          // if (numHidden < crumbs.length - 1){
          //   setNumHidden((was)=>was+1)
          // }
          //if this item is farthest left then this is the number to hide
            setNumHidden((was)=>{
          let newHide = crumbs.length - i + Number(was);
          // console.log(">>>>i was newHide",i,was,newHide)

              if (was < newHide){
                return newHide
              }else{
                return was
              }
            })

            if (i == crumbs.length - 1){
              setRightMostVisible(false);
            }

        }

      }}>{crumb}</VisibilitySensor>)
    // }else{
    //   crumbsJSX.push(crumb)
    // }
  }


  return <>
  <BreadCrumbContainer ref={breadCrumbRef}> {crumbsJSX} </BreadCrumbContainer>
  </>


}

