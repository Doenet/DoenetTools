import React from 'react';
import styled from 'styled-components';
import Measure from 'react-measure';


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

//crumb 
//label: the lable which shows in the span
//onClick: the function called when crumb is clicked
export function BreadCrumb({crumbs=[]}){

  if (crumbs.length == 0){ return null}
  let crumbsJSX = [];

  for (let [i,{label,onClick}] of Object.entries(crumbs) ){
    crumbsJSX.push(<BreadcrumbItem key={`breadcrumbitem${i}`}>
      <BreadcrumbSpan onClick={onClick}>{label}</BreadcrumbSpan>
      </BreadcrumbItem>)
  }

  return <BreadCrumbContainer> {crumbsJSX} </BreadCrumbContainer>
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