import React, { useState } from "react";
import Styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons"; // Arrow icon

const Section = Styled.div`
  transition: height .25s;
  border-radius: .5em;
  margin: 0px 4px 0px 4px;
  width: ${(props) =>
    props.width === "menu" ? "var(--menuWidth)" : ""}; // Menu prop
`;

const SectionHeader = Styled.div`
  font-weight: bold;
  height: 24px;
  line-height: 1.5em;
  user-select: none;
  cursor: ${(props) =>
    props.disabled ? "not-allowed" : "pointer"}; // Disabled prop
  overflow: auto;
  border: var(--mainBorder);
  display: block;
  text-align: center;
  background-color: var(--mainGray);
  color: var(--canvastext);
  &:focus {
    outline: 2px solid var(--canvastext);
    outline-offset: 2px;
  }
`;

const SectionContent = Styled.div`
  padding: 1em;
  border-radius: 0 0 .5em .5em;
  border: var(--mainBorder);
  border-top: none;
  background-color: var(--canvas);
`;

const Label = Styled.p` // Only visible with vertical label prop
  font-size: 14px;
  display: ${(props) => props.labelVisible};
  margin-right: 5px;
  margin-bottom: ${(props) => (props.align == "flex" ? "none" : "2px")};
`;

export default function CollapseSection(props) {
  const [collapsed, setCollapsed] = useState(Boolean(props.collapsed));
  const title = props.title ? String(props.title) : "Untitled Section"; // Title prop
  const labelVisible = props.label ? "static" : "none";
  const align = props.vertical ? "static" : "flex";
  const width = props.width ? props.width : null;
  const disabled = props.disabled ? props.disabled : null;
  const label = props.label ? props.label : null;

  let contentStyle = collapsed ? { display: "none" } : { display: "block" };
  let headerStyle = collapsed
    ? { borderRadius: ".5em" }
    : { borderRadius: ".5em .5em 0 0" };

  const arrowIcon = {
    // Styles the arrow icon
    marginRight: "7px",
    transition: "transform .25s",
    transform: `${collapsed ? "" : "rotate(90deg)"}`,
  };

  return (
    <Section width={width}>
      <Label labelVisible={labelVisible} align={align}>
        {label}
      </Label>
      <SectionHeader
        data-test={props.dataTest}
        aria-label={title}
        aria-labelledby={label}
        aria-disabled={disabled}
        style={headerStyle}
        disabled={disabled}
        onClick={() => {
          disabled ? "" : setCollapsed(!collapsed);
        }} // If not disabled, the user can open/close the collapse section
        onKeyDown={(e) => {
          disabled
            ? ""
            : e.key === "Enter" || e.key === "Spacebar" || e.key === " "
            ? setCollapsed(!collapsed)
            : "";
        }}
        tabIndex="0"
      >
        <FontAwesomeIcon icon={faCaretRight} style={arrowIcon} />
        {title}
      </SectionHeader>
      <SectionContent style={contentStyle}>{props.children}</SectionContent>
    </Section>
  );
}
