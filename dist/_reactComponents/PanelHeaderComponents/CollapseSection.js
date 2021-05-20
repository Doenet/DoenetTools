import React, {
  useState
} from "../../_snowpack/pkg/react.js";
import Styled from "../../_snowpack/pkg/styled-components.js";
const Section = Styled.div`
transition: height .25s;
border-radius: .5em;
`;
const SectionHeader = Styled.div`
font-weight: bold;
height: 1.5em;
width: 100%;
line-height: 1.5em;
user-select: none;
cursor: pointer;
overflow: auto;
`;
const ArrowIcon = Styled.span`
display: inline-block;
margin: 0em .5em;
transition: transform .25s;
`;
const HeaderIconContainer = Styled.div`
float: right;
margin-right: .5em;
`;
const SectionContent = Styled.div`
padding: 1em;
border-radius: 0 0 .5em .5em;
`;
export default function CollapseSection(props) {
  const [collapsed, setCollapsed] = useState(Boolean(props.collapsed));
  const arrowStyle = collapsed ? {} : {transform: "rotate(90deg)"};
  let contentStyle = collapsed ? {display: "none"} : {display: "block"};
  contentStyle.backgroundColor = props.bodyBackground || "#f8f8f8";
  let headerStyle = collapsed ? {borderRadius: ".5em"} : {borderRadius: ".5em .5em 0 0"};
  headerStyle.backgroundColor = props.headerBackground || "lightgrey";
  headerStyle.color = props.headerTextColor || "black";
  const sectionStyle = {width: props.widthCSS || "240px"};
  if (props.iconElements !== void 0) {
    var iconElements = props.iconElements.map((iconEl, index) => /* @__PURE__ */ React.createElement(HeaderIconContainer, {
      key: "aaaaa" + index
    }, iconEl));
  }
  return /* @__PURE__ */ React.createElement(Section, {
    style: sectionStyle
  }, /* @__PURE__ */ React.createElement(SectionHeader, {
    style: headerStyle,
    onClick: () => {
      setCollapsed(!collapsed);
    }
  }, /* @__PURE__ */ React.createElement(ArrowIcon, {
    style: arrowStyle
  }, ">"), props.title ? String(props.title) : "Untitled Section", iconElements), /* @__PURE__ */ React.createElement(SectionContent, {
    style: contentStyle
  }, props.children));
}
