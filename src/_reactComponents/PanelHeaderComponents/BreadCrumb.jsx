import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Measure from 'react-measure';


const BreadCrumbContainer = styled.ul`
  list-style: none;
  overflow: hidden;
  height: 22px;
  display: flex;
  flex-wrap: wrap;
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

//crumb 
//label: the lable which shows in the span
//onClick: the function called when crumb is clicked
export function BreadCrumb({crumbs=[]}){
  // const measureRef = useRef(null)
  const [crumbsWidth,setCrumbsWidth] = useState(0);
  let lastWidth = useRef(0);
  let mode = useRef('expanded');
  // if (lastWidth)


  if (crumbs.length == 0){ return null}
  console.log(">>>>crumbsWidth",crumbsWidth)
  console.log(">>>>lastWidth.current",lastWidth.current)
  if (mode.current === 'expanded' && lastWidth.current != 0 && lastWidth.current > crumbsWidth){
    mode.current = 'minimized';
  }
  lastWidth.current = crumbsWidth;

  let crumbsJSX = [];

  // if (mode.current === 'minimized'){
  //   crumbsJSX.push(<BreadcrumbItem key={`breadcrumbitem0`}>
  //   <BreadcrumbSpan onClick={crumbs[0].onClick}>{crumbs[0].label}</BreadcrumbSpan>
  //   </BreadcrumbItem>)
  //   crumbsJSX.push(<BreadcrumbItem key={`breadcrumbitem1`}>
  //   <BreadcrumbSpan onClick={()=>{}}>...</BreadcrumbSpan>
  //   </BreadcrumbItem>)
  //   crumbsJSX.push(<BreadcrumbItem key={`breadcrumbitem2`}>
  //   <BreadcrumbSpan onClick={crumbs[crumbs.length-1].onClick}>{crumbs[crumbs.length-1].label}</BreadcrumbSpan>
  //   </BreadcrumbItem>)
  // }else{
    for (let [i,{label,onClick}] of Object.entries(crumbs) ){
      crumbsJSX.push(<BreadcrumbItem key={`breadcrumbitem${i}`}>
        <BreadcrumbSpan onClick={onClick}>{label}</BreadcrumbSpan>
        </BreadcrumbItem>)
    }
  // }

  

  return <>
  {/* <button style={{marginTop:'20px'}} onClick={()=>{
    if (navigator.onLine) {
      console.log('>>>>online');
    } else {
      console.log('>>>>offline');
    }
  }}>Test if online</button> */}
  <Measure
  bounds
  onResize={(contentRect) => {
    const width = contentRect.bounds.width;
    setCrumbsWidth(width)

    // latestWidth.current = width;
    // updateNumColumns(contentRect.bounds.width);
  }}
>
  {({ measureRef }) => (
    
  <BreadCrumbContainer ref={measureRef}> {crumbsJSX} </BreadCrumbContainer>
  )}
  </Measure>
  </>

  
  // return <div style={{display:'flex',flexWrap:"wrap"}}>
  //   <span style={{margin:"10px",backgroundColor:"purple"}}>one thing wrap me</span>
  //   <span style={{margin:"10px",backgroundColor:"purple"}}>one thing wrap me</span>
  //   <span style={{margin:"10px",backgroundColor:"purple"}}>one thing wrap me</span>
  //   <span style={{margin:"10px",backgroundColor:"purple"}}>one thing wrap me</span>

  //   </div>
}


// <BreadcrumbItem 
// ref={returnToCourseChooserRef}
// >
//   <BreadcrumbSpan
//     role="button"
//     tabIndex="0"
//     onKeyDown={(e) => {
//       if (e.key === 'Enter') {
//         setPageToolView({
//           page: 'course',
//           tool: 'courseChooser',
//           view: '',
//         });
//       }
//     }}
//     onClick={() => {
//       setPageToolView({ page: 'course', tool: 'courseChooser', view: '' });
//     }}
//   >
//     <FontAwesomeIcon icon={faTh} />
//   </BreadcrumbSpan>
// </BreadcrumbItem>