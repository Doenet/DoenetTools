/* eslint-disable react/prop-types */
/*
A collapsible section originally intended for storing controls.

USAGE:
<CollapseSection iconElements={[<icon1/>,<icon2/>]}>
  // some controls
  <CollapseExtra>
    // some advanced controls
  </CollapseExtra>
</CollapseSection>

PROPS:
CollapseSection
- widthCSS
  this props is passed directly as a string to the css of the most-parent element returned by the component. You can set this to any valid value of the CSS property `width`.
  Defaults to: "240px"
- title
  The text that appears in the header of the collapsible section
  Defaults to: "Untitled Section". If you want no title, pass "" as the title.
- collapsed
  Whether the section is collapsed
  Defaults to: false
- bodyBackground
  background color of the body of the section, passed as a string directly to css
  defaults to: "#f8f8f8"
- headerBackground
  background color of the header of the section, passed as a string directly to css.
  defaults to: "lightgrey"
- headerTextColor
  text color of the header, passed as a string directly to css
  defaults to: "black"
- iconElements
  an array of elements that will show up on the right side of the header and are accessible when the section is collapsed.
  They are spaced by this component so no need to implement your own spacing unless you are doing something weird.
  If you pass only one icon, you still must pass it in an array.
  defaults to: _nothing_

NOTES:
There are no preset action icons, you must implement these in the parent component.

*/

import React, { useState } from "react";
import Styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

const Section = Styled.div `
transition: height .25s;
border-radius: .5em;
margin: 0px 4px 0px 4px;
`;

const SectionHeader = Styled.div `
font-weight: bold;
height: 24px;
line-height: 1.5em;
user-select: none;
cursor: pointer;
overflow: auto;
border: 2px solid black;
display: block;
text-align: center;
background-color: #e2e2e2;
color: black;
`;

// const HeaderIconContainer = Styled.div `
// float: right;
// margin-right: 2px;
// `;

const SectionContent = Styled.div `
padding: 1em;
border-radius: 0 0 .5em .5em;
border: 2px solid black;
border-top: none;
background-color: white;
`;

export default function CollapseSection(props) {
  const [collapsed, setCollapsed] = useState(Boolean(props.collapsed));

  // const arrowCollapsed = collapsed ? {} : {transform: "rotate(90deg)"};
  let contentStyle = collapsed ? {display: "none"} : {display: "block"};
  // contentStyle.backgroundColor = props.bodyBackground || "white";
  
  let headerStyle = collapsed ? {borderRadius: ".5em"} : {borderRadius: ".5em .5em 0 0"};
  // headerStyle.backgroundColor = props.headerBackground || "#e2e2e2";
  // headerStyle.color = props.headerTextColor || "black";

  // const sectionStyle = {width: props.widthCSS || "menu"};

  const arrowIcon = {
    // display: "inline-block",
    marginRight: "7px",
    transition: "transform .25s",
    transform: `${collapsed ? "" : "rotate(90deg)"}`
  }

  // if (props.iconElements !== undefined) {
  //     var iconElements = props.iconElements.map((iconEl, index) => (
  //         <HeaderIconContainer key={"aaaaa" + index}>
  //             {iconEl}
  //         </HeaderIconContainer>
  //     ));
  // }

  return (
      <Section >
          <SectionHeader
              style={headerStyle}
              onClick = {() => {setCollapsed(!collapsed);}}
          >
              {/* <ArrowIcon style={arrowStyle}>
                  &gt;
              </ArrowIcon> */}
              <FontAwesomeIcon icon={faCaretRight} style={arrowIcon}/>
              {props.title ? String(props.title) : "Untitled Section"}
              {/* {iconElements} */}
          </SectionHeader>
          <SectionContent style={contentStyle}>
              {props.children}
          </SectionContent>
      </Section >
  );
}
