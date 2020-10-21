/* eslint-disable react/prop-types */
/*
USAGE:
<CollapseSection iconElements={[<icon1/>,<icon2/>]}>
  // some controls
  <CollapseExtra>
    // some advanced controls
  </CollapseExtra>
</CollapseSection>

PROPS:
CollapseExtra
- title
  The text that appears in the header of the collapsible section
  Defaults to: "Untitled Section". If you want no title, pass "" as the title.
- collapsed
  Whether the section is collapsed
  Defaults to: true
- headerBackground
  background color of the header of the section, passed as a string directly to css.
  defaults to: "lightgrey"
- headerTextColor
  text color of the header, passed as a string directly to css
  defaults to: "black"
*/

import React, { useState } from "react";
import Styled from "styled-components";

const Section = Styled.div`
  margin-top: 1em;
  width: 100%;
  transition: height .25s;
`;

const SectionHeader = Styled.div`
  font-weight: bold;
  height: 1.5em;
  width: 100%;
  line-height: 1.5em;
  user-select: none;
  cursor: pointer;
  border-radius: .25em;
`;

const Icon = Styled.span`
  display: inline-block;
  margin: 0em .5em;
  transition: transform .25s;
`;

const SectionContent = Styled.div`
  padding-top: 1em;
`;

export default function CollapseSection(props) {
  const [collapsed, setCollapsed] = useState(
    props.collapsed === undefined ? true : Boolean(props.collapsed)
  );

  const arrowStyle = collapsed ? {} : { transform: "rotate(135deg)" };
  const contentStyle = collapsed ? { display: "none" } : { display: "block" };
  const headerStyle = {};
  headerStyle.backgroundColor = props.headerBackground || "lightgrey";
  headerStyle.color = props.headerTextColor || "black";

  return (
    <Section>
      <SectionHeader
        style={headerStyle}
        onClick={() => {
          setCollapsed(!collapsed);
        }}
      >
        <Icon style={arrowStyle}>+</Icon>
        {props.title ? String(props.title) : "Untitled Section"}
      </SectionHeader>
      <SectionContent style={contentStyle}>{props.children}</SectionContent>
    </Section>
  );
}
