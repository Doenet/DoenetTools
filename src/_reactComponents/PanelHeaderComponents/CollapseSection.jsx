import React, { useState } from "react";
import Styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'; // Arrow icon

const Section = Styled.div `
  transition: height .25s;
  border-radius: .5em;
  margin: 0px 4px 0px 4px;
  width: ${props => props.width === "menu" ? "235px" : ""}; // Menu prop
`;

const SectionHeader = Styled.div `
  font-weight: bold;
  height: 24px;
  line-height: 1.5em;
  user-select: none;
  cursor: ${props => props.disabled ? "not-allowed" : "pointer"}; // Disabled prop
  overflow: auto;
  border: var(--mainBorder);
  display: block;
  text-align: center;
  background-color: var(--mainGray);
  color: black;
`;

const SectionContent = Styled.div `
  padding: 1em;
  border-radius: 0 0 .5em .5em;
  border: var(--mainBorder);
  border-top: none;
  background-color: white;
`;

const Label = Styled.p ` // Only visible with vertical label prop
  font-size: 14px;
  display: ${props => props.labelVisible};
  margin-right: 5px;
  margin-bottom: ${props => props.align == 'flex' ? 'none' : '2px'};
`;

export default function CollapseSection(props) {
  const [collapsed, setCollapsed] = useState(Boolean(props.collapsed));
  const title = props.title ? String(props.title) : "Untitled Section"; // Title prop
  const labelVisible = props.label ? 'static' : 'none';
  const align = props.vertical ? 'static' : 'flex';
  const width = props.width ? props.width : null;
  const ariaLabel = props.ariaLabel ? props.ariaLabel : null;
  const disabled = props.disabled ? props.disabled : null;
  const label = props.label ? props.label : null;

  let contentStyle = collapsed ? {display: "none"} : {display: "block"};
  let headerStyle = collapsed ? {borderRadius: ".5em"} : {borderRadius: ".5em .5em 0 0"};

  const arrowIcon = { // Styles the arrow icon
    marginRight: "7px",
    transition: "transform .25s",
    transform: `${collapsed ? "" : "rotate(90deg)"}`
  };

  return (
      <Section aria-label={ariaLabel} width={width}>
        <Label labelVisible={labelVisible} align={align}>{label}</Label>
          <SectionHeader
              style={headerStyle}
              disabled={disabled}
              onClick = {() => {disabled ? "" : setCollapsed(!collapsed);}} // If not disabled, the user can open/close the collapse section
          >
              <FontAwesomeIcon icon={faCaretRight} style={arrowIcon}/>
              {title}
          </SectionHeader>
          <SectionContent style={contentStyle}>
              {props.children}
          </SectionContent>
      </Section>
  );
};
